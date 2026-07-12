import { describe, expect, it } from 'vitest';
import { createLedgerEntry, savingsDelta } from '../src/index.js';
describe('savings baseline', () => {
  it('calculates exact delta and content hash', () => {
    const entry = createLedgerEntry({
      id: 'e1',
      period: '2026-01',
      baselineMinor: 1000,
      actualMinor: 800,
      state: 'COMPLETE',
    });
    expect(savingsDelta(entry)).toBe(200);
    expect(entry.entryHash).toHaveLength(64);
  });
});
