export interface Explanation {
  readonly status: 'FEASIBLE' | 'INFEASIBLE';
  readonly requirementIds: readonly string[];
  readonly reasons: readonly string[];
  readonly confidence: number;
  readonly assumptions: readonly string[];
}
export function explainInfeasible(
  requirementIds: readonly string[],
  reasons: readonly string[],
): Explanation {
  return Object.freeze({
    status: 'INFEASIBLE',
    requirementIds: Object.freeze([...requirementIds]),
    reasons: Object.freeze([...reasons]),
    confidence: 1,
    assumptions: Object.freeze([]),
  });
}
