import { createHash } from 'node:crypto';
export interface OptimizationSnapshot {
  readonly snapshotId: string;
  readonly sourceVersions: readonly string[];
  readonly materialHash: string;
  readonly createdAt: string;
  readonly requirements: readonly Readonly<Record<string, unknown>>[];
  readonly inventory: readonly Readonly<Record<string, unknown>>[];
}
export function assembleSnapshot(
  input: Omit<OptimizationSnapshot, 'materialHash'>,
): OptimizationSnapshot {
  if (!input.snapshotId || !input.createdAt || !input.sourceVersions.length)
    throw new TypeError('snapshot completeness required');
  const materialHash = createHash('sha256')
    .update(
      JSON.stringify({
        requirements: input.requirements,
        inventory: input.inventory,
        sourceVersions: input.sourceVersions,
      }),
    )
    .digest('hex');
  return Object.freeze({
    ...input,
    sourceVersions: Object.freeze([...input.sourceVersions]),
    requirements: Object.freeze([...input.requirements]),
    inventory: Object.freeze([...input.inventory]),
    materialHash,
  });
}
