import { describe, expect, it } from 'vitest';
import { verify } from '../src/index.js';
describe('independent hard constraint verifier', () => {
  it('passes compliant candidate', () =>
    expect(
      verify(
        { coverage: 90, latencyMs: 20, costMinor: 50 },
        { minCoverage: 80, maxLatencyMs: 100, budgetMinor: 100 },
      ).status,
    ).toBe('PASSED'));
  it('rejects every violated hard constraint', () =>
    expect(
      verify(
        { coverage: 70, latencyMs: 200, costMinor: 101 },
        { minCoverage: 80, maxLatencyMs: 100, budgetMinor: 100 },
      ).failures,
    ).toEqual(['MIN_COVERAGE', 'MAX_LATENCY', 'BUDGET']));
});
