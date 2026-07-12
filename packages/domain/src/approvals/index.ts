export interface Approval {
  readonly id: string;
  readonly proposalId: string;
  readonly approverId: string;
  readonly role: string;
  readonly decision: 'APPROVED' | 'REJECTED';
  readonly createdAt: string;
  readonly rationale: string;
}
export function authorizeApproval(input: {
  readonly approverId: string;
  readonly role: string;
  readonly selfApproval: boolean;
  readonly expired: boolean;
  readonly requiredRole: string;
}): void {
  if (!input.approverId || input.role !== input.requiredRole)
    throw new Error('APPROVAL_ROLE_DENIED');
  if (input.selfApproval) throw new Error('SELF_APPROVAL_DENIED');
  if (input.expired) throw new Error('APPROVAL_EXPIRED');
}
export function appendApproval(input: Approval): Approval {
  if (!input.id || !input.proposalId || !input.rationale)
    throw new TypeError('approval facts required');
  return Object.freeze({ ...input });
}
