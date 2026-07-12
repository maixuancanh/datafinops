export interface Renewal {
  readonly id: string;
  readonly dueAt: string;
  readonly entitlementHash: string;
  readonly proposalHash: string;
  readonly status: 'OPEN' | 'BLOCKED' | 'CLOSED';
}
export function createRenewal(input: Omit<Renewal, 'status'>): Renewal {
  return Object.freeze({ ...input, status: 'OPEN' });
}
