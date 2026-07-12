import { describe, expect, it } from 'vitest';
import { evaluate, validatePolicy } from '../src/index.js';
const policy = {
  id: 'p1',
  version: 1,
  network: 'devnet',
  programId: 'prog',
  spendLimitMinor: 100,
  coverageFloor: 80,
  expiresAt: '2027-01-01',
  liveWrite: false,
};
describe('policy engine', () => {
  it('validates immutable policy', () =>
    expect(Object.isFrozen(validatePolicy(policy))).toBe(true));
  it('returns eligible, approval-required or blocked', () => {
    expect(
      evaluate(policy, {
        network: 'devnet',
        programId: 'prog',
        spendMinor: 10,
        coverage: 90,
        now: '2026-01-01',
        liveWrite: false,
      }).decision,
    ).toBe('ELIGIBLE');
    expect(
      evaluate(
        { ...policy, liveWrite: true },
        {
          network: 'devnet',
          programId: 'prog',
          spendMinor: 10,
          coverage: 90,
          now: '2026-01-01',
          liveWrite: true,
        },
      ).decision,
    ).toBe('APPROVAL_REQUIRED');
    expect(
      evaluate(policy, {
        network: 'mainnet',
        programId: 'prog',
        spendMinor: 10,
        coverage: 90,
        now: '2026-01-01',
        liveWrite: false,
      }).decision,
    ).toBe('BLOCKED');
  });
});
