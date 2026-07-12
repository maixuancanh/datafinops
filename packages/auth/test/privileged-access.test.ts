import { describe, expect, it } from 'vitest';

import {
  assertBreakGlass,
  createBreakGlassGrant,
  requirePrivilegedAccess,
  transitionRoleLifecycle,
} from '../src/privileged-access.js';

describe('privileged access posture', () => {
  it('requires MFA and an active role for privileged actions', () => {
    expect(() =>
      requirePrivilegedAccess({ subjectRef: 'admin', mfaVerified: false, roleStatus: 'ACTIVE' }),
    ).toThrow(/MFA/);
    expect(() =>
      requirePrivilegedAccess({ subjectRef: 'admin', mfaVerified: true, roleStatus: 'SUSPENDED' }),
    ).toThrow(/active/);
    expect(
      requirePrivilegedAccess({ subjectRef: 'admin', mfaVerified: true, roleStatus: 'ACTIVE' }),
    ).toEqual({ allowed: true, subjectRef: 'admin' });
  });

  it('creates a reasoned, audited, read-only, time-limited break-glass grant', () => {
    const grant = createBreakGlassGrant({
      subjectRef: 'admin-demo',
      reason: 'SEV-2 entitlement investigation',
      createdAt: '2026-08-01T12:00:00.000Z',
      expiresAt: '2026-08-01T12:30:00.000Z',
    });
    expect(grant).toMatchObject({ readOnly: true, reviewed: false });
    expect(grant.audit).toMatchObject({ action: 'BREAK_GLASS_GRANTED', subjectRef: 'admin-demo' });
    expect(assertBreakGlass(grant, '2026-08-01T12:20:00.000Z').allowed).toBe(true);
    expect(() => assertBreakGlass(grant, '2026-08-01T12:30:00.000Z')).toThrow(/expired/);
  });

  it('rejects excessive or unreasoned break-glass grants', () => {
    expect(() =>
      createBreakGlassGrant({
        subjectRef: 'admin-demo',
        reason: '',
        createdAt: '2026-08-01T12:00:00.000Z',
        expiresAt: '2026-08-01T12:30:00.000Z',
      }),
    ).toThrow(/reason/);
    expect(() =>
      createBreakGlassGrant({
        subjectRef: 'admin-demo',
        reason: 'test',
        createdAt: '2026-08-01T12:00:00.000Z',
        expiresAt: '2026-08-01T14:00:00.000Z',
      }),
    ).toThrow(/60 minutes/);
  });

  it('permits only explicit role lifecycle transitions', () => {
    expect(transitionRoleLifecycle('INVITED', 'ACTIVE')).toBe('ACTIVE');
    expect(transitionRoleLifecycle('ACTIVE', 'SUSPENDED')).toBe('SUSPENDED');
    expect(() => transitionRoleLifecycle('REVOKED', 'ACTIVE')).toThrow(/transition/);
  });
});
