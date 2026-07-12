import { describe, expect, it } from 'vitest';
import { optimize } from '@datafinops/optimizer';
describe('commercial capacity bounded smoke', () => {
  it('handles a supported large synthetic candidate set deterministically', () => {
    const candidates = Array.from({ length: 500 }, (_, i) => ({
      id: `c${i}`,
      costMinor: i + 1,
      coverage: 80 + (i % 20),
      latencyMs: i % 100,
      headroomMinor: 0,
    }));
    expect(optimize({ candidates, minCoverage: 90, budgetMinor: 500 }).status).toBe('OPTIMAL');
  });
});
