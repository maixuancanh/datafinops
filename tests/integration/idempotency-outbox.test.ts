import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { Pool } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  consumeOnce,
  createOperationKey,
  executeIdempotent,
  type OperationScope,
} from '@datafinops/domain';

const pool = new Pool({
  connectionString:
    process.env.TEST_DATABASE_URL ?? 'postgresql://datafinops@127.0.0.1:55432/datafinops_test',
  max: 8,
});
const scope: OperationScope = {
  organizationId: '11111111-1111-4111-8111-111111111111',
  workspaceId: '22222222-2222-4222-8222-222222222222',
  environmentId: '33333333-3333-4333-8333-333333333333',
};

beforeAll(async () => {
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await pool.query(
    await readFile(path.resolve(import.meta.dirname, '../../infrastructure/migrations/0001_baseline.sql'), 'utf8'),
  );
  await pool.query("INSERT INTO organizations(id,name) VALUES($1,'Demo')", [scope.organizationId]);
  await pool.query("INSERT INTO workspaces(id,organization_id,name) VALUES($1,$2,'Demo')", [scope.workspaceId, scope.organizationId]);
  await pool.query(
    "INSERT INTO environments(id,organization_id,workspace_id,name,mode) VALUES($1,$2,$3,'Sandbox','SANDBOX')",
    [scope.environmentId, scope.organizationId, scope.workspaceId],
  );
});
afterAll(async () => pool.end());

describe('idempotency and transactional outbox', () => {
  it('returns the original result and creates one outbox event on request replay', async () => {
    const operationKey = createOperationKey('usage-import', scope, { source: 'demo', period: '2026-08' });
    let executions = 0;
    const execute = () =>
      executeIdempotent(pool, scope, operationKey, async () => {
        executions += 1;
        return {
          result: { importId: 'import-demo-001', rows: 2 },
          events: [{ type: 'usage.imported.v1', payload: { importId: 'import-demo-001' } }],
        };
      });
    const [first, replay] = await Promise.all([execute(), execute()]);
    expect(first).toEqual(replay);
    expect(executions).toBe(1);
    const outbox = await pool.query('SELECT * FROM outbox_events WHERE operation_key=$1', [operationKey]);
    expect(outbox.rowCount).toBe(1);
  });

  it('rolls back domain result and outbox together when the handler fails', async () => {
    const operationKey = createOperationKey('failure', scope, { fixture: 1 });
    await expect(
      executeIdempotent(pool, scope, operationKey, async () => {
        throw new Error('synthetic failure');
      }),
    ).rejects.toThrow('synthetic failure');
    expect((await pool.query('SELECT 1 FROM idempotent_operations WHERE operation_key=$1', [operationKey])).rowCount).toBe(0);
    expect((await pool.query('SELECT 1 FROM outbox_events WHERE operation_key=$1', [operationKey])).rowCount).toBe(0);
  });

  it('deduplicates reordered consumer delivery by consumer and operation key', async () => {
    const operationKey = createOperationKey('event', scope, { sequence: 2 });
    const later = await consumeOnce(pool, scope, 'baseline-projector', operationKey, 'b'.repeat(64));
    const duplicate = await consumeOnce(pool, scope, 'baseline-projector', operationKey, 'b'.repeat(64));
    expect(later).toBe(true);
    expect(duplicate).toBe(false);
  });
});
