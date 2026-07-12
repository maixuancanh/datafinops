export interface Candidate { readonly id: string; readonly costMinor: number; readonly coverage: number; }
export interface OracleInput { readonly candidates: readonly Candidate[]; readonly minCoverage: number; readonly budgetMinor: number; }
export function bruteForceBest(input: OracleInput): Candidate | undefined { return input.candidates.filter((candidate) => candidate.coverage >= input.minCoverage && candidate.costMinor <= input.budgetMinor).sort((a, b) => a.costMinor - b.costMinor || a.id.localeCompare(b.id))[0]; }
