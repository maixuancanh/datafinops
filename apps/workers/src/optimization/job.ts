export interface OptimizationJob {
  readonly id: string;
  readonly tenantId: string;
  readonly resourceClass: 'SMALL' | 'MEDIUM' | 'LARGE';
  readonly status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'CANCELLED';
  readonly snapshotId: string;
}
export function createOptimizationJob(input: Omit<OptimizationJob, 'status'>): OptimizationJob {
  return Object.freeze({ ...input, status: 'QUEUED' });
}
