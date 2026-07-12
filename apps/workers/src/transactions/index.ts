export type OperationStatus =
  | 'SUBMITTED'
  | 'CONFIRMED'
  | 'FAILED'
  | 'EXPIRED'
  | 'REPLACED'
  | 'REORGANIZED';
export interface ObservedOperation {
  readonly operationId: string;
  readonly transactionHash: string;
  readonly status: OperationStatus;
  readonly observedAt: string;
}
export function observeOperation(operation: ObservedOperation): ObservedOperation {
  return Object.freeze({ ...operation });
}
