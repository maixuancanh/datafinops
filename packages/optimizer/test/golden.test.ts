import { describe, expect, it } from 'vitest';
import { optimize } from '../src/index.js';

describe('deterministic optimizer', () => {
  it('handles hard constraints and stable ties', () => {
    const result = optimize({
      minCoverage: 80,
      maxLatencyMs: 100,
      budgetMinor: 100,
      candidates: [
        { id: 'b', costMinor: 50, coverage: 90, latencyMs: 50, headroomMinor: 2 },
        { id: 'a', costMinor: 50, coverage: 90, latencyMs: 50, headroomMinor: 2 },
        { id: 'bad', costMinor: 10, coverage: 70, latencyMs: 10, headroomMinor: 0 },
      ],
    });
    expect(result.selected?.id).toBe('a');
  });

  it('explains infeasibility', () => {
    const result = optimize({ minCoverage: 100, budgetMinor: 1, candidates: [] });
    expect(result.rejectionReasons).toContain('NO_FEASIBLE_CANDIDATE');
  });
});
