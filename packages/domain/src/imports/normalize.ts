import { createHash } from 'node:crypto';

export interface AggregateImportRow {
  readonly tenantId: string;
  readonly periodStart: string;
  readonly periodEnd: string;
  readonly currency: string;
  readonly units: number;
  readonly amount: string;
  readonly productId: string;
  readonly rowHash: string;
  readonly qualityScore: number;
  readonly late: boolean;
}
const hash = (value: unknown) =>
  createHash('sha256')
    .update(JSON.stringify(value, Object.keys(value as object).sort()))
    .digest('hex');
export function parseAggregateImport(input: {
  readonly tenantId: string;
  readonly rows: readonly Readonly<Record<string, unknown>>[];
  readonly periodEnd: string;
  readonly now: string;
}): {
  readonly accepted: readonly AggregateImportRow[];
  readonly rejected: readonly {
    readonly reason: string;
    readonly row: Readonly<Record<string, unknown>>;
  }[];
} {
  const seen = new Set<string>();
  const accepted: AggregateImportRow[] = [];
  const rejected: { reason: string; row: Readonly<Record<string, unknown>> }[] = [];
  for (const row of input.rows) {
    const forbidden = Object.keys(row).some((key) => /customer|user|email|wallet/i.test(key));
    const periodStart = String(row.periodStart ?? '');
    const periodEnd = String(row.periodEnd ?? input.periodEnd);
    const currency = String(row.currency ?? '');
    const units = Number(row.units);
    const amount = String(row.amount ?? '');
    const productId = String(row.productId ?? '');
    const rowHash = hash({ ...row, tenantId: input.tenantId });
    const late = Date.parse(periodEnd) < Date.parse(input.now);
    if (forbidden) rejected.push({ reason: 'PROHIBITED_CUSTOMER_LEVEL_DATA', row });
    else if (seen.has(rowHash)) rejected.push({ reason: 'DUPLICATE_ROW', row });
    else if (
      !periodStart ||
      !currency ||
      !Number.isFinite(units) ||
      units < 0 ||
      !amount ||
      !productId
    )
      rejected.push({ reason: 'SCHEMA_INVALID', row });
    else if (Date.parse(periodStart) > Date.parse(periodEnd))
      rejected.push({ reason: 'INVALID_PERIOD', row });
    else {
      seen.add(rowHash);
      accepted.push({
        tenantId: input.tenantId,
        periodStart,
        periodEnd,
        currency,
        units,
        amount,
        productId,
        rowHash,
        qualityScore: late ? 0.75 : 1,
        late,
      });
    }
  }
  return { accepted: Object.freeze(accepted), rejected: Object.freeze(rejected) };
}
