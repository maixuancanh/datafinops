import { describe, expect, it } from 'vitest';

import { parseModeConfiguration } from '../src/modes.js';

describe('mode configuration', () => {
  it('keeps sandbox deterministic and write-disabled', () => {
    expect(
      parseModeConfiguration({
        DATAFINOPS_MODE: 'sandbox',
        DATAFINOPS_FIXED_CLOCK: '2026-08-01T12:00:00.000Z',
      }),
    ).toMatchObject({ mode: 'sandbox', fixedClock: '2026-08-01T12:00:00.000Z', liveWrite: false });
  });

  it.each(['sandbox', 'devnet', 'live-read'] as const)(
    'rejects a live-write enablement signal in %s mode',
    (mode) => {
      expect(() =>
        parseModeConfiguration({ DATAFINOPS_MODE: mode, DATAFINOPS_LIVE_WRITE: 'true' }),
      ).toThrow(/live-write/i);
    },
  );

  it('requires explicit tenant evidence and allowlists for live-write', () => {
    expect(() =>
      parseModeConfiguration({ DATAFINOPS_MODE: 'live-write', DATAFINOPS_LIVE_WRITE: 'true' }),
    ).toThrow(/evidence/i);
  });

  it('accepts live-write only with explicit scoped gates', () => {
    expect(
      parseModeConfiguration({
        DATAFINOPS_MODE: 'live-write',
        DATAFINOPS_LIVE_WRITE: 'true',
        DATAFINOPS_LIVE_WRITE_EVIDENCE: 'evidence-tenant-demo-2026-08',
        DATAFINOPS_NETWORK_ALLOWLIST: 'txline-devnet',
        DATAFINOPS_PROGRAM_ALLOWLIST: 'TxLINEProgram11111111111111111111111111',
        DATAFINOPS_TENANT_ALLOWLIST: 'tenant-demo',
      }),
    ).toMatchObject({ mode: 'live-write', liveWrite: true, tenantAllowlist: ['tenant-demo'] });
  });
});
