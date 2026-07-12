export type RequirementKind = 'HARD' | 'SOFT';
export interface RequirementInput {
  readonly kind: RequirementKind;
  readonly ownerId: string;
  readonly productId: string;
  readonly league?: string;
  readonly fixtureId?: string;
  readonly maxLatencyMs?: number;
  readonly budgetMinor?: number;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly blackout?: readonly { readonly start: string; readonly end: string }[];
  readonly effectiveAt: string;
}
export interface RequirementVersion extends RequirementInput {
  readonly id: string;
  readonly version: number;
}
export function validateRequirement(input: RequirementInput): void {
  if (
    !input.ownerId ||
    !input.productId ||
    !input.periodStart ||
    !input.periodEnd ||
    !input.effectiveAt
  )
    throw new TypeError('requirement identity and period are required');
  if (input.kind !== 'HARD' && input.kind !== 'SOFT')
    throw new TypeError('requirement kind is invalid');
  if (Date.parse(input.periodStart) > Date.parse(input.periodEnd))
    throw new TypeError('requirement period is invalid');
  if (
    input.maxLatencyMs !== undefined &&
    (!Number.isFinite(input.maxLatencyMs) || input.maxLatencyMs < 0)
  )
    throw new TypeError('latency is invalid');
  if (
    input.budgetMinor !== undefined &&
    (!Number.isSafeInteger(input.budgetMinor) || input.budgetMinor < 0)
  )
    throw new TypeError('budget is invalid');
  for (const blackout of input.blackout ?? [])
    if (Date.parse(blackout.start) > Date.parse(blackout.end))
      throw new TypeError('blackout period is invalid');
}
export function createRequirementVersion(input: RequirementVersion): RequirementVersion {
  validateRequirement(input);
  if (!input.id || input.version < 1)
    throw new TypeError('requirement version identity is invalid');
  return Object.freeze({ ...input, blackout: Object.freeze([...(input.blackout ?? [])]) });
}
