export const requiredCiJobs: readonly string[];
export function validateCiWorkflow(source: string): string[];
export function assertSuccessfulNeeds(
  needs: Readonly<Record<string, Readonly<{ result?: string }>>>,
): void;
export function validateBranchProtectionEvidence(
  evidence: Readonly<{
    gitRemoteConfigured?: boolean;
    remoteUrl?: string | null;
    targetBranch?: string | null;
    requiredStatusChecks?: readonly string[];
    failedRequiredJobBlocksMerge?: boolean;
    fixedAggregateUnblocksMerge?: boolean;
  }>,
): string[];
