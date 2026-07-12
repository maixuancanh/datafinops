export interface HardConstraint {
  readonly minCoverage?: number;
  readonly maxLatencyMs?: number;
  readonly budgetMinor?: number;
}
export interface VerifiableCandidate {
  readonly coverage: number;
  readonly latencyMs: number;
  readonly costMinor: number;
}
export interface VerificationResult {
  readonly status: 'PASSED' | 'FAILED';
  readonly failures: readonly string[];
}
export function verify(
  candidate: VerifiableCandidate,
  constraint: HardConstraint,
): VerificationResult {
  const failures: string[] = [];
  if (constraint.minCoverage !== undefined && candidate.coverage < constraint.minCoverage)
    failures.push('MIN_COVERAGE');
  if (constraint.maxLatencyMs !== undefined && candidate.latencyMs > constraint.maxLatencyMs)
    failures.push('MAX_LATENCY');
  if (constraint.budgetMinor !== undefined && candidate.costMinor > constraint.budgetMinor)
    failures.push('BUDGET');
  return { status: failures.length ? 'FAILED' : 'PASSED', failures };
}
