export interface ContractSurface {
  readonly operations: readonly string[];
  readonly channels: readonly string[];
  readonly requiredFields: Readonly<Record<string, readonly string[]>>;
}
export function compareContractSurface(
  baseline: ContractSurface,
  current: ContractSurface,
): string[];
export function extractContractSurface(): Promise<ContractSurface>;
