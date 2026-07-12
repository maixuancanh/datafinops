export type RoleLifecycle = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';

export interface BreakGlassGrant {
  readonly subjectRef: string;
  readonly reason: string;
  readonly createdAt: string;
  readonly expiresAt: string;
  readonly readOnly: true;
  readonly reviewed: false;
  readonly audit: Readonly<{
    action: 'BREAK_GLASS_GRANTED';
    subjectRef: string;
    reason: string;
    occurredAt: string;
  }>;
}

function instant(value: string): number {
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed) || new Date(parsed).toISOString() !== value) {
    throw new TypeError('Timestamp must be a canonical UTC instant');
  }
  return parsed;
}

export function requirePrivilegedAccess(input: {
  readonly subjectRef: string;
  readonly mfaVerified: boolean;
  readonly roleStatus: RoleLifecycle;
}) {
  if (!input.mfaVerified) throw new Error('MFA is required for privileged access');
  if (input.roleStatus !== 'ACTIVE') throw new Error('An active privileged role is required');
  return Object.freeze({ allowed: true as const, subjectRef: input.subjectRef });
}

export function createBreakGlassGrant(input: {
  readonly subjectRef: string;
  readonly reason: string;
  readonly createdAt: string;
  readonly expiresAt: string;
}): BreakGlassGrant {
  if (input.reason.trim().length < 4) throw new TypeError('Break-glass reason is required');
  const created = instant(input.createdAt);
  const expires = instant(input.expiresAt);
  const duration = expires - created;
  if (duration <= 0 || duration > 60 * 60 * 1000) {
    throw new RangeError('Break-glass duration must be positive and no more than 60 minutes');
  }
  return Object.freeze({
    ...input,
    readOnly: true as const,
    reviewed: false as const,
    audit: Object.freeze({
      action: 'BREAK_GLASS_GRANTED' as const,
      subjectRef: input.subjectRef,
      reason: input.reason,
      occurredAt: input.createdAt,
    }),
  });
}

export function assertBreakGlass(grant: BreakGlassGrant, now: string) {
  const current = instant(now);
  if (current < instant(grant.createdAt)) throw new Error('Break-glass grant is not active yet');
  if (current >= instant(grant.expiresAt)) throw new Error('Break-glass grant expired');
  return Object.freeze({ allowed: true as const, readOnly: true as const });
}

const transitions: Readonly<Record<RoleLifecycle, readonly RoleLifecycle[]>> = {
  INVITED: ['ACTIVE', 'REVOKED'],
  ACTIVE: ['SUSPENDED', 'REVOKED'],
  SUSPENDED: ['ACTIVE', 'REVOKED'],
  REVOKED: [],
};

export function transitionRoleLifecycle(
  current: RoleLifecycle,
  next: RoleLifecycle,
): RoleLifecycle {
  if (!transitions[current].includes(next)) {
    throw new Error(`Invalid role lifecycle transition: ${current} -> ${next}`);
  }
  return next;
}
