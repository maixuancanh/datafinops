import { canonicalHash } from '@datafinops/test-fixtures';
export * from './normalization.js';

export type AdapterMode = 'SANDBOX' | 'DEVNET' | 'LIVE_READ' | 'LIVE_WRITE';

export interface ConnectionExpectation {
  readonly network: string;
  readonly programId: string;
  readonly apiHost: string;
  readonly publicWalletRef: string;
}

export interface ReplayDataset {
  readonly network: string;
  readonly programId: string;
  readonly apiHost: string;
  readonly pricing: readonly Readonly<Record<string, unknown>>[];
  readonly subscriptions: readonly Readonly<Record<string, unknown>>[];
  readonly fixtures: readonly Readonly<Record<string, unknown>>[];
  readonly entitlement: Readonly<Record<string, unknown>>;
  readonly sourcePublishedAt: string;
}

interface SourceRows<T> {
  readonly rows: readonly T[];
  readonly sourcePublishedAt: string;
  readonly ingestedAt: string;
  readonly contentHash: string;
}

interface SourceValue<T> {
  readonly rows: T;
  readonly sourcePublishedAt: string;
  readonly ingestedAt: string;
  readonly contentHash: string;
}

export interface ReplayAdapterBase {
  readonly mode: AdapterMode;
  readonly capabilities: Readonly<{ liveWrite: boolean }>;
  verifyConnection(expectation: ConnectionExpectation): Promise<{
    readonly status: 'VERIFIED_READ' | 'BLOCKED';
    readonly executable: boolean;
    readonly checks: readonly Readonly<{ name: string; status: 'PASS' | 'FAIL'; observed: string }>[];
    readonly reasonCodes: readonly string[];
  }>;
  getPricing(): Promise<SourceRows<Readonly<Record<string, unknown>>>>;
  getSubscriptions(): Promise<SourceRows<Readonly<Record<string, unknown>>>>;
  getFixtures(): Promise<SourceRows<Readonly<Record<string, unknown>>>>;
  getEntitlement(): Promise<SourceValue<Readonly<Record<string, unknown>>>>;
  activateEntitlement(input: { readonly operationKey: string; readonly target: readonly string[] }): Promise<{
    readonly status: 'SIMULATED';
    readonly repurchaseAllowed: false;
    readonly operationKey: string;
  }>;
}

export interface ReplayAdapterWrite extends ReplayAdapterBase {
  readonly capabilities: Readonly<{ liveWrite: true }>;
  writeSubscription(input: Readonly<Record<string, unknown>>): Promise<{
    readonly status: 'SIMULATED';
    readonly spend: false;
  }>;
}

function sourceRows<T>(rows: readonly T[], dataset: ReplayDataset, clock: string): SourceRows<T> {
  return Object.freeze({
    rows: Object.freeze(rows.map((row) => Object.freeze({ ...row }))),
    sourcePublishedAt: dataset.sourcePublishedAt,
    ingestedAt: clock,
    contentHash: canonicalHash(rows),
  });
}

function sourceValue<T extends Readonly<Record<string, unknown>>>(value: T, dataset: ReplayDataset, clock: string): SourceValue<T> {
  return Object.freeze({ rows: Object.freeze({ ...value }), sourcePublishedAt: dataset.sourcePublishedAt, ingestedAt: clock, contentHash: canonicalHash(value) });
}

export function createReplayAdapter(input: {
  readonly mode: AdapterMode;
  readonly liveWriteEvidence?: string;
  readonly dataset: ReplayDataset;
  readonly clock: string;
}): ReplayAdapterBase | ReplayAdapterWrite {
  if (input.mode === 'LIVE_WRITE' && !input.liveWriteEvidence?.trim()) {
    throw new Error('LIVE_WRITE adapter requires explicit enablement evidence');
  }
  const adapter: ReplayAdapterBase = {
    mode: input.mode,
    capabilities: Object.freeze({ liveWrite: input.mode === 'LIVE_WRITE' }),
    async verifyConnection(expectation) {
      const checks = [
        { name: 'NETWORK', observed: input.dataset.network, status: input.dataset.network === expectation.network ? 'PASS' : 'FAIL' },
        { name: 'PROGRAM', observed: input.dataset.programId, status: input.dataset.programId === expectation.programId ? 'PASS' : 'FAIL' },
        { name: 'API_HOST', observed: input.dataset.apiHost, status: input.dataset.apiHost === expectation.apiHost ? 'PASS' : 'FAIL' },
        { name: 'PUBLIC_WALLET', observed: expectation.publicWalletRef, status: expectation.publicWalletRef ? 'PASS' : 'FAIL' },
      ] as const;
      const reasonCodes = checks.filter((check) => check.status === 'FAIL').map((check) => `${check.name}_MISMATCH`);
      if (input.dataset.apiHost === 'unknown' || !input.dataset.sourcePublishedAt) reasonCodes.push('UNKNOWN_SOURCE_SEMANTICS');
      const blocked = reasonCodes.length > 0;
      return Object.freeze({ status: blocked ? 'BLOCKED' as const : 'VERIFIED_READ' as const, executable: !blocked, checks, reasonCodes });
    },
    async getPricing() { return sourceRows(input.dataset.pricing, input.dataset, input.clock); },
    async getSubscriptions() { return sourceRows(input.dataset.subscriptions, input.dataset, input.clock); },
    async getFixtures() { return sourceRows(input.dataset.fixtures, input.dataset, input.clock); },
    async getEntitlement() { return sourceValue(input.dataset.entitlement, input.dataset, input.clock); },
    async activateEntitlement({ operationKey }) {
      if (!operationKey.trim()) throw new TypeError('Activation operation key is required');
      return Object.freeze({ status: 'SIMULATED' as const, repurchaseAllowed: false as const, operationKey });
    },
  };
  if (input.mode !== 'LIVE_WRITE') return Object.freeze(adapter);
  return Object.freeze({
    ...adapter,
    capabilities: Object.freeze({ liveWrite: true as const }),
    async writeSubscription() { return Object.freeze({ status: 'SIMULATED' as const, spend: false as const }); },
  });
}
