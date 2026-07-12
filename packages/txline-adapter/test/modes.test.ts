import { describe, expect, it } from 'vitest';

import { createReplayAdapter } from '../src/index.js';

const dataset = {
  network: 'txline-sandbox', programId: 'TxLINEProgram11111111111111111111111111', apiHost: 'https://api.sandbox.txline.example',
  pricing: [], subscriptions: [], fixtures: [], entitlement: { status: 'UNKNOWN', leagues: [], latencyClass: 'UNKNOWN' },
  sourcePublishedAt: '2026-08-01T11:59:00.000Z',
} as const;

describe('TxLINE capability modes', () => {
  it.each(['SANDBOX', 'DEVNET', 'LIVE_READ'] as const)('has no write capability in %s', (mode) => {
    const adapter = createReplayAdapter({ mode, dataset, clock: '2026-08-01T12:00:00.000Z' });
    expect('writeSubscription' in adapter).toBe(false);
  });

  it('does not implicitly enable live-write in a live-read adapter', () => {
    const adapter = createReplayAdapter({ mode: 'LIVE_READ', dataset, clock: '2026-08-01T12:00:00.000Z' });
    expect(adapter.mode).toBe('LIVE_READ');
    expect(adapter.capabilities.liveWrite).toBe(false);
  });

  it('requires explicit evidence before a live-write adapter can expose a write method', () => {
    expect(() => createReplayAdapter({ mode: 'LIVE_WRITE', dataset, clock: '2026-08-01T12:00:00.000Z' })).toThrow(/evidence/i);
    const adapter = createReplayAdapter({ mode: 'LIVE_WRITE', liveWriteEvidence: 'tenant-demo-evidence', dataset, clock: '2026-08-01T12:00:00.000Z' });
    expect('writeSubscription' in adapter).toBe(true);
  });
});
