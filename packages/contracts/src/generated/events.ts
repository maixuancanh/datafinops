// Generated from events.asyncapi.yaml sha256:bd332c0051d1a55cb4ed9e79b294297ad67a4ca2823b5e01c2957f196dde7f53
// Do not edit; run pnpm contracts:generate.

export type DataFinOpsEvent = ((EventEnvelope & {
runId: string
snapshotHash: Sha256
state: ("COMPLETE" | "INFEASIBLE")
recommendationId?: string
}) | (EventEnvelope & {
proposalId: string
proposalHash: Sha256
requiredRole: string
expiresAt: string
}) | (EventEnvelope & {
proposalId: string
proposalHash: Sha256
expiredAt: string
}) | (EventEnvelope & {
operationId: string
proposalId: string
state: ("SUBMITTED" | "CONFIRMED" | "FAILED" | "EXPIRED" | "REPLACED")
network: string
publicTransactionHash?: string
}) | (EventEnvelope & {
operationId: string
proposalId: string
confirmedTransaction: true
reasonCodes: string[]
repurchaseBlocked: true
}) | (EventEnvelope & {
proposalId: string
expectedHash: Sha256
observedHash: Sha256
reasonCodes: string[]
}) | (EventEnvelope & {
subscriptionRef: string
risk: ("MISSING_REQUIREMENTS" | "APPROVAL_DELAY" | "ENTITLEMENT_MISMATCH" | "EXPIRY")
renewalAt: string
}) | (EventEnvelope & {
periodId: string
state: ("CLOSED" | "DISPUTED")
currency: string
realizedMinorUnits: string
evidenceHash: Sha256
}))
export type Sha256 = string

export interface EventEnvelope {
eventId: string
eventType: string
schemaVersion: "1.0"
occurredAt: string
organizationRef: string
workspaceRef: string
environmentRef: string
idempotencyKey: string
correlationId: string
}
