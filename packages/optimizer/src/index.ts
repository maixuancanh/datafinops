export interface OptimizationCandidate {
  readonly id: string;
  readonly costMinor: number;
  readonly coverage: number;
  readonly latencyMs: number;
  readonly headroomMinor: number;
}
export interface OptimizationRequest {
  readonly candidates: readonly OptimizationCandidate[];
  readonly minCoverage: number;
  readonly maxLatencyMs?: number;
  readonly budgetMinor: number;
}
export interface OptimizationResult {
  readonly status: 'OPTIMAL' | 'INFEASIBLE';
  readonly selected?: OptimizationCandidate;
  readonly objective?: readonly number[];
  readonly rejectionReasons: readonly string[];
}
export function optimize(input: OptimizationRequest, signal?: AbortSignal): OptimizationResult {
  if (signal?.aborted) return { status: 'INFEASIBLE', rejectionReasons: ['CANCELLED'] };
  const feasible = input.candidates.filter(
    (candidate) =>
      candidate.coverage >= input.minCoverage &&
      (input.maxLatencyMs === undefined || candidate.latencyMs <= input.maxLatencyMs) &&
      candidate.costMinor <= input.budgetMinor,
  );
  if (!feasible.length)
    return { status: 'INFEASIBLE', rejectionReasons: ['NO_FEASIBLE_CANDIDATE'] };
  const selected = [...feasible].sort(
    (a, b) =>
      a.costMinor - b.costMinor ||
      b.coverage - a.coverage ||
      a.latencyMs - b.latencyMs ||
      a.id.localeCompare(b.id),
  )[0]!;
  return {
    status: 'OPTIMAL',
    selected,
    objective: [selected.costMinor, -selected.coverage, selected.latencyMs, selected.id.length],
    rejectionReasons: [],
  };
}
