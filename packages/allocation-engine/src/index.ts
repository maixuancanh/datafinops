export interface AllocationInput { readonly costMinor: number; readonly mappings: readonly { readonly targetId: string; readonly weight: number; readonly priority?: number; readonly retired?: boolean }[]; }
export interface AllocationResult { readonly allocations: readonly { readonly targetId: string; readonly amountMinor: number }[]; readonly unallocatedMinor: number; readonly totalMinor: number; }

export function allocate(input: AllocationInput): AllocationResult {
  if (!Number.isSafeInteger(input.costMinor) || input.costMinor < 0) throw new TypeError('costMinor must be a non-negative integer');
  const active = input.mappings.filter((mapping) => !mapping.retired && mapping.weight > 0).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || a.targetId.localeCompare(b.targetId));
  const totalWeight = active.reduce((sum, mapping) => sum + mapping.weight, 0);
  if (!active.length || totalWeight <= 0) return { allocations: Object.freeze([]), unallocatedMinor: input.costMinor, totalMinor: input.costMinor };
  const floors = active.map((mapping) => ({ targetId: mapping.targetId, floor: Math.floor(input.costMinor * mapping.weight / totalWeight), remainder: (input.costMinor * mapping.weight) % totalWeight }));
  let remainder = input.costMinor - floors.reduce((sum, item) => sum + item.floor, 0);
  floors.sort((a, b) => b.remainder - a.remainder || a.targetId.localeCompare(b.targetId));
  const allocations = floors.map((item) => ({ targetId: item.targetId, amountMinor: item.floor + (remainder-- > 0 ? 1 : 0) })).sort((a, b) => a.targetId.localeCompare(b.targetId));
  return { allocations: Object.freeze(allocations), unallocatedMinor: 0, totalMinor: allocations.reduce((sum, item) => sum + item.amountMinor, 0) };
}
