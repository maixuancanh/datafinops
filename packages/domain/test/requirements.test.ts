import { describe, expect, it } from 'vitest';
import { createRequirementVersion } from '../src/requirements/index.js';

const base = {
  id: 'req-1',
  version: 1,
  kind: 'HARD' as const,
  ownerId: 'owner',
  productId: 'product',
  periodStart: '2026-01-01',
  periodEnd: '2026-01-31',
  effectiveAt: '2026-01-01',
  maxLatencyMs: 500,
  budgetMinor: 1000,
  blackout: [{ start: '2026-01-10', end: '2026-01-11' }],
};
describe('requirement lifecycle', () => {
  it('creates immutable hard/soft-scoped versions', () => {
    const result = createRequirementVersion(base);
    expect(result.kind).toBe('HARD');
    expect(Object.isFrozen(result)).toBe(true);
  });
  it('rejects invalid periods, budget and blackout', () => {
    expect(() => createRequirementVersion({ ...base, periodStart: '2026-02-01' })).toThrow();
    expect(() => createRequirementVersion({ ...base, budgetMinor: -1 })).toThrow();
    expect(() =>
      createRequirementVersion({ ...base, blackout: [{ start: '2026-02-02', end: '2026-02-01' }] }),
    ).toThrow();
  });
});
