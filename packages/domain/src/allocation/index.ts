export interface AllocationVersion { readonly id: string; readonly version: number; readonly effectiveAt: string; readonly ruleHash: string; }
export function createAllocationVersion(input: AllocationVersion): AllocationVersion { if (!input.id || input.version < 1 || !input.effectiveAt || !input.ruleHash) throw new TypeError('Invalid allocation version'); return Object.freeze({ ...input }); }
