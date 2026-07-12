import { createHash } from 'node:crypto';
export type PeriodState = 'OPEN' | 'COMPLETE' | 'CLOSED' | 'DISPUTED' | 'REVERSED';
export interface LedgerEntry { readonly id: string; readonly period: string; readonly baselineMinor: number; readonly actualMinor: number; readonly state: PeriodState; readonly entryHash: string; }
export function createLedgerEntry(input: Omit<LedgerEntry, 'entryHash'>): LedgerEntry { if (input.baselineMinor < 0 || input.actualMinor < 0 || !input.period) throw new TypeError('invalid ledger entry'); const entryHash = createHash('sha256').update(JSON.stringify(input)).digest('hex'); return Object.freeze({ ...input, entryHash }); }
export function savingsDelta(entry: Pick<LedgerEntry, 'baselineMinor' | 'actualMinor'>): number { return entry.baselineMinor - entry.actualMinor; }
