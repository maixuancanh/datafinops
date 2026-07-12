import { describe, expect, it } from 'vitest';
import { buildUnsigned, verifySigned } from '../src/index.js';
describe('signed public transaction verification', () => {
  it('blocks bound-field mutation', () => {
    const built = buildUnsigned({
      version: 1,
      network: 'devnet',
      programId: 'p',
      account: 'a',
      amountMinor: 1,
      instructions: ['ALLOW_SUBSCRIBE'],
      expiresAt: '2099-01-01',
      approvalHash: 'h',
    });
    expect(
      verifySigned({
        envelope: built.envelope,
        materialHash: built.materialHash,
        signedMaterialHash: 'tampered',
      }).status,
    ).toBe('BLOCKED');
  });
});
