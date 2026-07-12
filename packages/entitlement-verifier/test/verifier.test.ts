import { describe, expect, it } from 'vitest';
import { verifyEntitlement } from '../src/index.js';
const expected = {
  subscriptionId: 's',
  network: 'devnet',
  programId: 'p',
  proposalHash: 'h',
  periodStart: '2026-01-01',
  periodEnd: '2026-02-01',
  maxLatencyMs: 100,
};
describe('entitlement verifier', () => {
  it('verifies and reports mismatches', () => {
    expect(verifyEntitlement(expected, expected).status).toBe('VERIFIED');
    expect(verifyEntitlement(expected, { ...expected, programId: 'wrong' }).reasons).toContain(
      'PROGRAMID_MISMATCH',
    );
  });
});
