// Generated from events.asyncapi.yaml sha256:38b2bcab1fef8a5c037aae3c24d706a689033c2e40376311a694795361c2776a
// Do not edit; run pnpm contracts:generate.

export type DataFinOpsEvent =
  | (EventEnvelope & {
      runId: string;
      snapshotHash: Sha256;
      state: 'COMPLETE' | 'INFEASIBLE';
      recommendationId?: string;
    })
  | (EventEnvelope & {
      proposalId: string;
      proposalHash: Sha256;
      requiredRole: string;
      expiresAt: string;
    })
  | (EventEnvelope & {
      proposalId: string;
      proposalHash: Sha256;
      expiredAt: string;
    })
  | (EventEnvelope & {
      operationId: string;
      proposalId: string;
      state: 'SUBMITTED' | 'CONFIRMED' | 'FAILED' | 'EXPIRED' | 'REPLACED';
      network: string;
      publicTransactionHash?: string;
    })
  | (EventEnvelope & {
      operationId: string;
      proposalId: string;
      confirmedTransaction: true;
      reasonCodes: string[];
      repurchaseBlocked: true;
    })
  | (EventEnvelope & {
      proposalId: string;
      expectedHash: Sha256;
      observedHash: Sha256;
      reasonCodes: string[];
    })
  | (EventEnvelope & {
      subscriptionRef: string;
      risk: 'MISSING_REQUIREMENTS' | 'APPROVAL_DELAY' | 'ENTITLEMENT_MISMATCH' | 'EXPIRY';
      renewalAt: string;
    })
  | (EventEnvelope & {
      periodId: string;
      state: 'CLOSED' | 'DISPUTED';
      currency: string;
      realizedMinorUnits: string;
      evidenceHash: Sha256;
    });
export type Sha256 = string;

export interface EventEnvelope {
  eventId: string;
  eventType: string;
  schemaVersion: '1.0';
  occurredAt: string;
  organizationRef: string;
  workspaceRef: string;
  environmentRef: string;
  idempotencyKey: string;
  correlationId: string;
}
