import { describe, expect, it } from 'vitest';
import { createProposal } from '../src/proposals/index.js';
describe('proposal canonicalization', () => {
  it('binds candidate, snapshot, policy and material hash', () => {
    const proposal = createProposal({
      id: 'p1',
      version: 1,
      candidateId: 'c1',
      snapshotHash: 's',
      policyVersion: 'policy:1',
      amountMinor: 50,
      network: 'devnet',
      programId: 'prog',
      effectiveAt: '2026-01-01',
      expiresAt: '2026-02-01',
    });
    expect(proposal.materialHash).toHaveLength(64);
    expect(Object.isFrozen(proposal)).toBe(true);
  });
});
