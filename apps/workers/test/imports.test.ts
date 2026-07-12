import { describe, expect, it } from 'vitest';
import { parseAggregateImport } from '../src/imports/normalize.js';

const base = { periodStart: '2026-01-01', periodEnd: '2026-01-31', currency: 'USD', units: 2, amount: '12.00', productId: 'product-a' };

describe('aggregate import contract', () => {
  it('accepts scoped aggregate rows and detects duplicate/late rows', () => {
    const result = parseAggregateImport({ tenantId: 'tenant-a', now: '2026-02-02T00:00:00Z', periodEnd: '2026-01-31', rows: [base, base] });
    expect(result.accepted).toHaveLength(1);
    expect(result.accepted[0]?.late).toBe(true);
    expect(result.rejected[0]?.reason).toBe('DUPLICATE_ROW');
  });
  it('rejects customer-level identifiers', () => {
    const result = parseAggregateImport({ tenantId: 'tenant-a', now: '2026-01-01T00:00:00Z', periodEnd: '2026-01-31', rows: [{ ...base, customerEmail: 'secret@example.test' }] });
    expect(result.accepted).toHaveLength(0);
    expect(result.rejected[0]?.reason).toBe('PROHIBITED_CUSTOMER_LEVEL_DATA');
  });
});
