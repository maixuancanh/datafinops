import { describe, expect, it } from 'vitest';

import { createAuditEvent, recordPrivilegedRead, verifyAuditChain } from '../src/audit/index.js';

describe('append-only canonical audit events', () => {
  it('creates a deterministic hash chain with tenant, actor, action, and purpose', () => {
    const first = createAuditEvent({
      eventId: 'audit-001', organizationId: 'org', workspaceId: 'workspace', environmentId: 'environment',
      actorRef: 'auditor-demo', action: 'PROPOSAL_READ', purpose: 'quarterly control review',
      resourceRef: 'proposal-demo', occurredAt: '2026-08-01T12:00:00.000Z', previousHash: null,
    });
    const second = recordPrivilegedRead({
      eventId: 'audit-002', organizationId: 'org', workspaceId: 'workspace', environmentId: 'environment',
      actorRef: 'support-demo', resourceRef: 'finance-export-demo', purpose: 'customer ticket DF-100',
      occurredAt: '2026-08-01T12:01:00.000Z', previousHash: first.eventHash,
    });
    expect(verifyAuditChain([first, second])).toEqual({ valid: true, count: 2 });
    expect(second.action).toBe('PRIVILEGED_READ');
  });

  it('rejects missing purpose and detects payload or chain tampering', () => {
    expect(() => recordPrivilegedRead({
      eventId: 'audit-001', organizationId: 'org', workspaceId: 'workspace', environmentId: 'environment',
      actorRef: 'support-demo', resourceRef: 'export', purpose: '',
      occurredAt: '2026-08-01T12:00:00.000Z', previousHash: null,
    })).toThrow(/purpose/);
    const event = createAuditEvent({
      eventId: 'audit-001', organizationId: 'org', workspaceId: 'workspace', environmentId: 'environment',
      actorRef: 'auditor-demo', action: 'READ', purpose: 'review', resourceRef: 'proposal',
      occurredAt: '2026-08-01T12:00:00.000Z', previousHash: null,
    });
    expect(verifyAuditChain([{ ...event, action: 'DELETE' }])).toMatchObject({ valid: false });
  });
});
