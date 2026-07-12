import { describe, expect, it } from 'vitest';
import { explainInfeasible } from '../src/explanations/index.js';
describe('infeasibility explanations', () => {
  it('returns actionable requirement IDs without relaxation', () => {
    const result = explainInfeasible(['req-latency'], ['MAX_LATENCY']);
    expect(result.status).toBe('INFEASIBLE');
    expect(result.requirementIds).toEqual(['req-latency']);
    expect(result.assumptions).toEqual([]);
  });
});
