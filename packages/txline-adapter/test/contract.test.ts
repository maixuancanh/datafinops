import { describe, expect, it } from 'vitest';

import {
  createReplayAdapter,
  type ConnectionExpectation,
  type ReplayDataset,
} from '../src/index.js';

const expectation: ConnectionExpectation = {
  network: 'txline-sandbox',
  programId: 'TxLINEProgram11111111111111111111111111',
  apiHost: 'https://api.sandbox.txline.example',
  publicWalletRef: 'DemoWallet111111111111111111111111111111',
};

const dataset: ReplayDataset = {
  network: expectation.network,
  programId: expectation.programId,
  apiHost: expectation.apiHost,
  pricing: [{ id: 'price-1', tier: 'STANDARD', leagues: ['EPL'], latencyClass: 'STANDARD', currency: 'USD', minorUnits: '120000' }],
  subscriptions: [{ externalRef: 'sub-1', pricingItemIds: ['price-1'], periodStart: '2026-08-01T00:00:00.000Z', periodEnd: '2026-09-01T00:00:00.000Z', state: 'ACTIVE' }],
  fixtures: [{ fixtureRef: 'fixture-1', league: 'EPL', scheduledAt: '2026-08-10T18:00:00.000Z' }],
  entitlement: { status: 'ACTIVE', leagues: ['EPL'], latencyClass: 'STANDARD' },
  sourcePublishedAt: '2026-08-01T11:59:00.000Z',
};

describe('TxLINE adapter contract', () => {
  it('verifies network/program/host and normalizes all read surfaces with lineage times', async () => {
    const adapter = createReplayAdapter({ mode: 'SANDBOX', dataset, clock: '2026-08-01T12:00:00.000Z' });
    const connection = await adapter.verifyConnection(expectation);
    expect(connection.status).toBe('VERIFIED_READ');
    expect(connection.checks.every((check) => check.status === 'PASS')).toBe(true);
    const [pricing, subscriptions, fixtures, entitlement] = await Promise.all([
      adapter.getPricing(), adapter.getSubscriptions(), adapter.getFixtures(), adapter.getEntitlement(),
    ]);
    for (const rows of [pricing, subscriptions, fixtures, entitlement]) {
      expect(rows.sourcePublishedAt).toBe(dataset.sourcePublishedAt);
      expect(rows.ingestedAt).toBe('2026-08-01T12:00:00.000Z');
      expect(rows.contentHash).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(pricing.rows[0]?.currency).toBe('USD');
    expect(subscriptions.rows[0]?.state).toBe('ACTIVE');
    expect(fixtures.rows[0]?.fixtureRef).toBe('fixture-1');
    expect(entitlement.rows.status).toBe('ACTIVE');
  });

  it('blocks mismatch nondestructively and marks unknown semantics non-executable', async () => {
    const adapter = createReplayAdapter({ mode: 'LIVE_READ', dataset: { ...dataset, apiHost: 'unknown' }, clock: '2026-08-01T12:00:00.000Z' });
    const result = await adapter.verifyConnection(expectation);
    expect(result.status).toBe('BLOCKED');
    expect(result.reasonCodes).toContain('API_HOST_MISMATCH');
    expect(result.executable).toBe(false);
  });

  it('records activation semantics but keeps source uncertainty explicit', async () => {
    const adapter = createReplayAdapter({ mode: 'SANDBOX', dataset, clock: '2026-08-01T12:00:00.000Z' });
    const activation = await adapter.activateEntitlement({ operationKey: 'activation-demo-0001', target: ['EPL'] });
    expect(activation.status).toBe('SIMULATED');
    expect(activation.repurchaseAllowed).toBe(false);
  });
});
