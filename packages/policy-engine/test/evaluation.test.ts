import { describe, expect, it } from 'vitest';
import { evaluate } from '../src/index.js';
const policy = {
  id: 'p',
  version: 1,
  network: 'devnet',
  programId: 'prog',
  spendLimitMinor: 10,
  coverageFloor: 80,
  expiresAt: '2027-01-01',
  liveWrite: true,
};
describe('policy decision table', () => {
  it('returns approval required for live write and blocked for expiry/spend', () => {
    expect(
      evaluate(policy, {
        network: 'devnet',
        programId: 'prog',
        spendMinor: 1,
        coverage: 90,
        now: '2026-01-01',
        liveWrite: true,
      }).decision,
    ).toBe('APPROVAL_REQUIRED');
    expect(
      evaluate(policy, {
        network: 'devnet',
        programId: 'prog',
        spendMinor: 11,
        coverage: 90,
        now: '2026-01-01',
        liveWrite: false,
      }).reasons,
    ).toContain('SPEND_LIMIT');
  });
});
