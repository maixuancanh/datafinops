import { canonicalHash } from '@datafinops/test-fixtures';

export interface NormalizedRow {
  readonly rowKey: string;
  readonly version: number;
  readonly effectiveAt: string;
  readonly observedAt: string;
  readonly contentHash: string;
  readonly values: Readonly<Record<string, unknown>>;
}

export function normalizeRows(rows: readonly Readonly<Record<string, unknown>>[], now: string): readonly NormalizedRow[] {
  const byKey = new Map<string, NormalizedRow>();
  for (const row of rows) {
    const rowKey = String(row.rowKey ?? row.id ?? canonicalHash(row));
    const candidate: NormalizedRow = { rowKey, version: Number(row.version ?? 1), effectiveAt: String(row.effectiveAt ?? row.periodStart ?? now), observedAt: now, contentHash: canonicalHash(row), values: Object.freeze({ ...row }) };
    const previous = byKey.get(rowKey);
    if (!previous || candidate.version >= previous.version) byKey.set(rowKey, Object.freeze(candidate));
  }
  return Object.freeze([...byKey.values()].sort((a, b) => a.rowKey.localeCompare(b.rowKey)));
}

export function freshness(observedAt: string, now: string, maxAgeMs: number): 'FRESH' | 'STALE' {
  return Date.parse(now) - Date.parse(observedAt) <= maxAgeMs ? 'FRESH' : 'STALE';
}
