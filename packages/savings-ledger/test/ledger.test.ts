import { describe, expect, it } from 'vitest';
import { createLedgerEntry, savingsDelta } from '../src/index.js';
describe('ledger state', () => { it('does not style forecast as realized', () => { const entry = createLedgerEntry({ id: 'e', period: '2026-01', baselineMinor: 100, actualMinor: 120, state: 'OPEN' }); expect(savingsDelta(entry)).toBe(-20); expect(entry.state).toBe('OPEN'); }); });
