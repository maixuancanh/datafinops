import { createHash } from 'node:crypto';

export interface AuditEventInput {
  readonly eventId: string;
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly environmentId: string;
  readonly actorRef: string;
  readonly action: string;
  readonly purpose: string;
  readonly resourceRef: string;
  readonly occurredAt: string;
  readonly previousHash: string | null;
}

export interface AuditEvent extends AuditEventInput {
  readonly eventHash: string;
}

function canonical(input: AuditEventInput): string {
  return JSON.stringify({
    action: input.action,
    actorRef: input.actorRef,
    environmentId: input.environmentId,
    eventId: input.eventId,
    occurredAt: input.occurredAt,
    organizationId: input.organizationId,
    previousHash: input.previousHash,
    purpose: input.purpose,
    resourceRef: input.resourceRef,
    workspaceId: input.workspaceId,
  });
}

function eventHash(input: AuditEventInput): string {
  return createHash('sha256').update(canonical(input)).digest('hex');
}

export function createAuditEvent(input: AuditEventInput): AuditEvent {
  for (const [name, value] of Object.entries(input)) {
    if (name !== 'previousHash' && typeof value === 'string' && !value.trim()) {
      throw new TypeError(`Audit ${name} is required`);
    }
  }
  const timestamp = new Date(input.occurredAt);
  if (Number.isNaN(timestamp.valueOf()) || timestamp.toISOString() !== input.occurredAt) {
    throw new TypeError('Audit occurredAt must be a canonical UTC instant');
  }
  if (input.previousHash !== null && !/^[a-f0-9]{64}$/.test(input.previousHash)) {
    throw new TypeError('Audit previousHash is invalid');
  }
  return Object.freeze({ ...input, eventHash: eventHash(input) });
}

export function recordPrivilegedRead(input: Omit<AuditEventInput, 'action'>): AuditEvent {
  if (!input.purpose.trim()) throw new TypeError('Privileged read purpose is required');
  return createAuditEvent({ ...input, action: 'PRIVILEGED_READ' });
}

export function verifyAuditChain(events: readonly AuditEvent[]) {
  let previousHash: string | null = null;
  for (let index = 0; index < events.length; index += 1) {
    const event = events[index];
    if (!event) return { valid: false as const, index, reason: 'MISSING_EVENT' };
    if (event.previousHash !== previousHash) {
      return { valid: false as const, index, reason: 'CHAIN_MISMATCH' };
    }
    const { eventHash: observedHash, ...input } = event;
    if (eventHash(input) !== observedHash) {
      return { valid: false as const, index, reason: 'HASH_MISMATCH' };
    }
    previousHash = observedHash;
  }
  return { valid: true as const, count: events.length };
}
