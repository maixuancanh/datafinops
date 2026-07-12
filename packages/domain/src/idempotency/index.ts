import { createHash } from 'node:crypto';

import type { Pool } from 'pg';

export interface OperationScope {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly environmentId: string;
}

export interface DomainEvent {
  readonly type: string;
  readonly payload: Readonly<Record<string, unknown>>;
}

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') {
    return `{${Object.entries(value)
      .filter(([, child]) => child !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => `${JSON.stringify(key)}:${canonical(child)}`)
      .join(',')}}`;
  }
  if (typeof value === 'bigint') return JSON.stringify(value.toString());
  const encoded = JSON.stringify(value);
  if (encoded === undefined) throw new TypeError('Operation input is not JSON serializable');
  return encoded;
}

function hash(value: unknown): string {
  return createHash('sha256').update(canonical(value)).digest('hex');
}

export function createOperationKey(
  namespace: string,
  scope: OperationScope,
  input: unknown,
): string {
  if (!/^[a-z][a-z0-9-]{2,63}$/.test(namespace)) throw new TypeError('Operation namespace is invalid');
  return `${namespace}:${hash({ scope, input })}`;
}

export async function executeIdempotent<T>(
  pool: Pool,
  scope: OperationScope,
  operationKey: string,
  handler: () => Promise<{ readonly result: T; readonly events: readonly DomainEvent[] }>,
): Promise<T> {
  if (operationKey.length < 16 || operationKey.length > 256) throw new TypeError('Operation key is invalid');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))', [operationKey]);
    const existing = await client.query<{ result_json: T }>(
      `SELECT result_json FROM idempotent_operations
       WHERE workspace_id=$1 AND environment_id=$2 AND operation_key=$3`,
      [scope.workspaceId, scope.environmentId, operationKey],
    );
    if (existing.rows[0]) {
      await client.query('COMMIT');
      return existing.rows[0].result_json;
    }
    const produced = await handler();
    const resultHash = hash(produced.result);
    await client.query(
      `INSERT INTO idempotent_operations
       (organization_id,workspace_id,environment_id,operation_key,result_json,result_hash)
       VALUES($1,$2,$3,$4,$5::jsonb,$6)`,
      [
        scope.organizationId,
        scope.workspaceId,
        scope.environmentId,
        operationKey,
        canonical(produced.result),
        resultHash,
      ],
    );
    for (const event of produced.events) {
      const payloadHash = hash(event.payload);
      await client.query(
        `INSERT INTO outbox_events
         (organization_id,workspace_id,environment_id,operation_key,event_type,payload,payload_hash,occurred_at)
         VALUES($1,$2,$3,$4,$5,$6::jsonb,$7,now())`,
        [
          scope.organizationId,
          scope.workspaceId,
          scope.environmentId,
          operationKey,
          event.type,
          canonical(event.payload),
          payloadHash,
        ],
      );
    }
    await client.query('COMMIT');
    return produced.result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function consumeOnce(
  pool: Pool,
  scope: OperationScope,
  consumer: string,
  operationKey: string,
  resultHash: string,
): Promise<boolean> {
  const result = await pool.query(
    `INSERT INTO consumed_operations
     (organization_id,workspace_id,environment_id,consumer,operation_key,result_hash)
     VALUES($1,$2,$3,$4,$5,$6)
     ON CONFLICT(workspace_id,environment_id,consumer,operation_key) DO NOTHING RETURNING id`,
    [scope.organizationId, scope.workspaceId, scope.environmentId, consumer, operationKey, resultHash],
  );
  return result.rowCount === 1;
}
