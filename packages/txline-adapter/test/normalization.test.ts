import { describe, expect, it } from 'vitest';
import { freshness, normalizeRows } from '../src/normalization.js';

describe('normalization', () => {
  it('deduplicates rows and keeps the latest correction version', () => {
    const rows = normalizeRows([{ rowKey: 'price-1', version: 1, amount: '10' }, { rowKey: 'price-1', version: 2, amount: '12' }, { rowKey: 'price-1', version: 1, amount: '11' }], '2026-01-02T00:00:00.000Z');
    expect(rows).toHaveLength(1);
    expect(rows[0]?.values.amount).toBe('12');
    expect(rows[0]?.contentHash).toMatch(/^[a-f0-9]{64}$/);
  });
  it('marks freshness from observed time', () => {
    expect(freshness('2026-01-01T00:00:00.000Z', '2026-01-01T00:30:00.000Z', 3600000)).toBe('FRESH');
    expect(freshness('2026-01-01T00:00:00.000Z', '2026-01-01T02:00:00.000Z', 3600000)).toBe('STALE');
  });
});
