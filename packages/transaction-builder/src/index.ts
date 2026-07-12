import { createHash } from 'node:crypto';
export interface UnsignedTransaction {
  readonly version: number;
  readonly network: string;
  readonly programId: string;
  readonly account: string;
  readonly amountMinor: number;
  readonly instructions: readonly string[];
  readonly expiresAt: string;
  readonly approvalHash: string;
}
export function buildUnsigned(input: UnsignedTransaction): {
  readonly envelope: UnsignedTransaction;
  readonly materialHash: string;
  readonly summary: string;
} {
  if (
    input.version < 1 ||
    input.amountMinor < 0 ||
    !input.network ||
    !input.programId ||
    !input.account ||
    !input.approvalHash ||
    !input.instructions.length ||
    Date.parse(input.expiresAt) <= Date.now()
  )
    throw new TypeError('invalid or expired transaction envelope');
  if (input.instructions.some((instruction) => !/^ALLOW_[A-Z_]+$/.test(instruction)))
    throw new Error('INSTRUCTION_NOT_ALLOWED');
  const materialHash = createHash('sha256').update(JSON.stringify(input)).digest('hex');
  return Object.freeze({
    envelope: Object.freeze({ ...input, instructions: Object.freeze([...input.instructions]) }),
    materialHash,
    summary: `${input.network} ${input.programId} ${input.amountMinor} minor units from ${input.account}`,
  });
}
export function verifySigned(input: {
  readonly envelope: UnsignedTransaction;
  readonly materialHash: string;
  readonly signedMaterialHash: string;
}): { readonly status: 'VERIFIED' | 'BLOCKED'; readonly reason?: string } {
  return input.materialHash === input.signedMaterialHash
    ? { status: 'VERIFIED' }
    : { status: 'BLOCKED', reason: 'MATERIAL_HASH_MISMATCH' };
}
