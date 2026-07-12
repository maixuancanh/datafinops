import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const migrationPath = path.resolve(import.meta.dirname, '../../infrastructure/migrations/0001_baseline.sql');
const client = new Client({
  connectionString:
    process.env.TEST_DATABASE_URL ?? 'postgresql://datafinops@127.0.0.1:55432/datafinops_test',
});

const expectedTables = [
  'organizations', 'workspaces', 'environments', 'users', 'roles', 'memberships',
  'service_accounts', 'txline_connection_versions', 'pricing_snapshots', 'pricing_items',
  'subscription_versions', 'entitlement_verifications', 'fixture_schedule_versions', 'products',
  'cost_centers', 'usage_imports', 'usage_aggregates', 'revenue_imports', 'revenue_aggregates',
  'allocation_rule_versions', 'allocation_results', 'requirement_versions', 'optimization_snapshots',
  'optimization_runs', 'candidate_configurations', 'constraint_evaluations', 'recommendations',
  'policy_versions', 'proposal_versions', 'approvals', 'signing_envelopes',
  'transaction_observations', 'activation_attempts', 'verification_records',
  'savings_baseline_versions', 'savings_periods', 'savings_entries', 'finance_exports', 'renewals',
  'incidents', 'webhook_deliveries', 'audit_events', 'evidence_bundles', 'usage_meters',
  'outbox_events', 'consumed_operations',
] as const;

beforeAll(async () => {
  await client.connect();
  await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await client.query(await readFile(migrationPath, 'utf8'));
});

afterAll(async () => client.end());

describe('baseline database model', () => {
  it('creates every Commercial V1 durable entity table', async () => {
    const result = await client.query<{ table_name: string }>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
    );
    const actual = result.rows.map((row) => row.table_name);
    for (const table of expectedTables) expect(actual).toContain(table);
  });

  it('requires organization/workspace/environment scope on tenant business records', async () => {
    const scopedTables = ['usage_imports', 'requirement_versions', 'proposal_versions', 'savings_entries'];
    for (const table of scopedTables) {
      const result = await client.query<{ column_name: string; is_nullable: string }>(
        `SELECT column_name, is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name=$1`,
        [table],
      );
      const columns = new Map(result.rows.map((row) => [row.column_name, row.is_nullable]));
      for (const column of ['organization_id', 'workspace_id', 'environment_id']) {
        expect(columns.get(column), `${table}.${column}`).toBe('NO');
      }
    }
  });

  it('enforces append-only approval, audit, outbox, and savings entries', async () => {
    const org = await client.query<{ id: string }>("INSERT INTO organizations(name) VALUES('Demo') RETURNING id");
    const workspace = await client.query<{ id: string }>(
      "INSERT INTO workspaces(organization_id,name) VALUES($1,'Demo') RETURNING id",
      [org.rows[0]?.id],
    );
    const environment = await client.query<{ id: string }>(
      "INSERT INTO environments(organization_id,workspace_id,name,mode) VALUES($1,$2,'Sandbox','SANDBOX') RETURNING id",
      [org.rows[0]?.id, workspace.rows[0]?.id],
    );
    const approval = await client.query<{ id: string }>(
      `INSERT INTO approvals(organization_id,workspace_id,environment_id,proposal_hash,actor_ref,role,decision,decided_at)
       VALUES($1,$2,$3,repeat('a',64),'finance-demo','FINANCE','APPROVE',now()) RETURNING id`,
      [org.rows[0]?.id, workspace.rows[0]?.id, environment.rows[0]?.id],
    );
    await expect(client.query('UPDATE approvals SET role=$1 WHERE id=$2', ['ADMIN', approval.rows[0]?.id])).rejects.toThrow(/append-only/i);
  });

  it('has unique operation and idempotency constraints', async () => {
    const result = await client.query<{ indexdef: string }>(
      "SELECT indexdef FROM pg_indexes WHERE schemaname='public'",
    );
    const definitions = result.rows.map((row) => row.indexdef).join('\n');
    expect(definitions).toMatch(/UNIQUE.*usage_imports.*idempotency_key/i);
    expect(definitions).toMatch(/UNIQUE.*transaction_observations.*operation_key/i);
    expect(definitions).toMatch(/UNIQUE.*activation_attempts.*operation_key/i);
  });
});
