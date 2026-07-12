export type PolicyDecision = 'ELIGIBLE' | 'APPROVAL_REQUIRED' | 'BLOCKED';
export interface Policy {
  readonly id: string;
  readonly version: number;
  readonly network: string;
  readonly programId: string;
  readonly spendLimitMinor: number;
  readonly coverageFloor: number;
  readonly expiresAt: string;
  readonly liveWrite: boolean;
}
export interface PolicyInput {
  readonly network: string;
  readonly programId: string;
  readonly spendMinor: number;
  readonly coverage: number;
  readonly now: string;
  readonly liveWrite: boolean;
}
export function validatePolicy(policy: Policy): Policy {
  if (
    !policy.id ||
    policy.version < 1 ||
    policy.spendLimitMinor < 0 ||
    policy.coverageFloor < 0 ||
    policy.coverageFloor > 100 ||
    !policy.expiresAt
  )
    throw new TypeError('invalid policy');
  return Object.freeze({ ...policy });
}
export function evaluate(
  policy: Policy,
  input: PolicyInput,
): { readonly decision: PolicyDecision; readonly reasons: readonly string[] } {
  const reasons: string[] = [];
  if (input.network !== policy.network) reasons.push('NETWORK_MISMATCH');
  if (input.programId !== policy.programId) reasons.push('PROGRAM_MISMATCH');
  if (input.spendMinor > policy.spendLimitMinor) reasons.push('SPEND_LIMIT');
  if (input.coverage < policy.coverageFloor) reasons.push('COVERAGE_FLOOR');
  if (Date.parse(input.now) > Date.parse(policy.expiresAt)) reasons.push('EXPIRED');
  if (input.liveWrite && !policy.liveWrite) reasons.push('LIVE_WRITE_DISABLED');
  if (reasons.length) return { decision: 'BLOCKED', reasons };
  return { decision: input.liveWrite ? 'APPROVAL_REQUIRED' : 'ELIGIBLE', reasons: [] };
}
