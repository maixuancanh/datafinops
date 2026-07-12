import { describe, expect, it } from 'vitest';
import { bruteForceBest } from '@datafinops/test-fixtures';
import { optimize } from '@datafinops/optimizer';

describe('optimizer bounded optimality', () => {
  it('matches the independent oracle across generated bounded cases', () => {
    for (let seed = 0; seed < 25; seed += 1) {
      const candidates = Array.from({ length: 5 }, (_, index) => ({ id: `${seed}-${index}`, costMinor: (seed * 17 + index * 13) % 100, coverage: 60 + ((seed * 11 + index * 7) % 50), latencyMs: 20 + index, headroomMinor: 0 }));
      const request = { candidates, minCoverage: 80, budgetMinor: 90 };
      expect(optimize(request).selected?.id).toBe(bruteForceBest(request)?.id);
    }
  });
});
