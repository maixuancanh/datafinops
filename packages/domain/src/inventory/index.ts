export interface InventoryVersion<T extends Readonly<Record<string, unknown>>> {
  readonly id: string;
  readonly version: number;
  readonly sourceHash: string;
  readonly observedAt: string;
  readonly values: T;
}

export function createInventoryVersion<T extends Readonly<Record<string, unknown>>>(input: InventoryVersion<T>): InventoryVersion<T> {
  if (!input.id || input.version < 1 || !input.sourceHash || !input.observedAt) throw new TypeError('Invalid inventory version');
  return Object.freeze({ ...input, values: Object.freeze({ ...input.values }) });
}
