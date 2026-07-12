import { canLiveWrite, type LiveWriteEvidence } from '@datafinops/domain';
export function liveWriteAllowed(
  evidence: LiveWriteEvidence | undefined,
  tenantId: string,
  amountMinor: number,
  now: string,
): boolean {
  return canLiveWrite(evidence, tenantId, amountMinor, now);
}
