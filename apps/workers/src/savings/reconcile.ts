import { createLedgerEntry, type LedgerEntry } from '@datafinops/savings-ledger';
export function reconcilePeriod(
  input: Omit<LedgerEntry, 'entryHash'> & { readonly complete: boolean },
): LedgerEntry {
  return createLedgerEntry({ ...input, state: input.complete ? 'COMPLETE' : 'OPEN' });
}
