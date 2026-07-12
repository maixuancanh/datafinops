export interface ActivationOperation { readonly operationId: string; readonly transactionHash: string; readonly proposalId: string; readonly status: 'PENDING' | 'CONFIRMED' | 'RECOVERY_REQUIRED'; }
export function createActivation(input: Omit<ActivationOperation, 'status'>): ActivationOperation { return Object.freeze({ ...input, status: 'PENDING' }); }
