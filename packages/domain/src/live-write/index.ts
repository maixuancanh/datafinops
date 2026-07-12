export interface LiveWriteEvidence {
  readonly tenantId: string;
  readonly approvedBy: string;
  readonly expiresAt: string;
  readonly maxSpendMinor: number;
  readonly emergencyStop: boolean;
}
export function canLiveWrite(
  evidence: LiveWriteEvidence | undefined,
  tenantId: string,
  amountMinor: number,
  now: string,
): boolean {
  return Boolean(
    evidence &&
    evidence.tenantId === tenantId &&
    !evidence.emergencyStop &&
    amountMinor <= evidence.maxSpendMinor &&
    Date.parse(now) <= Date.parse(evidence.expiresAt),
  );
}
