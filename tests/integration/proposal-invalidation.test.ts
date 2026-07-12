import { describe, expect, it } from 'vitest';
import { materialChange } from '../../apps/workers/src/proposals/invalidate.js';
describe('proposal invalidation', () => {
  it('invalidates material changes while preserving prior evidence', () => {
    const previous = {
      pricingHash: 'a',
      requirementHash: 'r',
      policyHash: 'p',
      amountMinor: 10,
      network: 'devnet',
      programId: 'prog',
      signer: 's',
      effectiveAt: '2026-01-01',
      expiresAt: '2026-02-01',
    };
    expect(materialChange(previous, { ...previous, amountMinor: 11 })).toEqual(['amountMinor']);
  });
});
