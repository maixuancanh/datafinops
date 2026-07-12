// Generated from schemas/optimization-snapshot.schema.json sha256:c7b2ecc7737e0038ef578c3c12c5d0b0262a8f554ce8c05883a735a7d20b807a
// Do not edit; run pnpm contracts:generate.

export type Sha256 = string;

export interface DataFinOpsOptimizationSnapshot {
  snapshotId: string;
  workspaceId: string;
  mode: 'SANDBOX' | 'DEVNET' | 'LIVE_READ' | 'LIVE_WRITE';
  network: string;
  programId: string;
  period: Period;
  currency: string;
  sourceVersions: {
    pricing: VersionHash;
    subscription: VersionHash;
    entitlement: VersionHash;
    fixtures: VersionHash;
    usage: VersionHash;
    allocation: VersionHash;
    requirements: VersionHash;
    policy: VersionHash;
  };
  currentConfiguration: ConfigurationItem[];
  /**
   * @minItems 1
   */
  pricingItems: [PricingItem, ...PricingItem[]];
  /**
   * @minItems 1
   */
  requirements: [Requirement, ...Requirement[]];
  unallocatedCost?: Money;
  dataQuality?: number;
  optimizerVersion: string;
  canonicalHash: Sha256;
  createdAt: string;
}
export interface Period {
  start: string;
  end: string;
}
export interface VersionHash {
  version: string;
  hash: Sha256;
}
export interface ConfigurationItem {
  pricingItemId: string;
  effectiveStart: string;
  effectiveEnd: string;
}
export interface PricingItem {
  id: string;
  tier: string;
  leagues: string[];
  latencyClass: string;
  cost: Money;
  effectiveStart: string;
  effectiveEnd: string;
}
export interface Money {
  currency: string;
  minorUnits: string;
}
export interface Requirement {
  id: string;
  kind:
    | 'LEAGUE'
    | 'FIXTURE'
    | 'LATENCY'
    | 'REGION'
    | 'BUDGET'
    | 'EFFECTIVE_DATE'
    | 'BLACKOUT'
    | 'HEADROOM';
  hardness: 'HARD' | 'SOFT';
  operator: 'INCLUDE' | 'EXCLUDE' | 'MAX' | 'MIN' | 'EQUALS' | 'BEFORE' | 'AFTER';
  value: unknown;
  ownerRef: string;
}
