import { assembleSnapshot, type OptimizationSnapshot } from '@datafinops/domain';
export function createOptimizationSnapshot(input: Omit<OptimizationSnapshot, 'materialHash'>): OptimizationSnapshot { return assembleSnapshot(input); }
