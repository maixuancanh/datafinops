import { describe, expect, it } from 'vitest';

import {
  AuthorizationError,
  authorize,
  createPrincipal,
  requireJobScope,
  tenantPredicate,
} from '@datafinops/auth';
import { createTenantContext } from '@datafinops/domain';

const scope = createTenantContext({
  organizationId: '11111111-1111-4111-8111-111111111111',
  workspaceId: '22222222-2222-4222-8222-222222222222',
  environmentId: '33333333-3333-4333-8333-333333333333',
  mode: 'SANDBOX',
});
const otherScope = createTenantContext({
  organizationId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  workspaceId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
  environmentId: 'cccccccc-cccc-4ccc-8ccc-cccccccccccc',
  mode: 'SANDBOX',
});

describe('tenant, mode, role, direct-ID, list, export, and job isolation', () => {
  const procurement = createPrincipal({
    subjectRef: 'procurement-demo',
    kind: 'USER',
    context: scope,
    roles: ['PROCUREMENT'],
    scopes: ['portfolio:read', 'proposal:create'],
  });

  it('returns opaque not-found for a cross-tenant direct ID', () => {
    expect(() => authorize(procurement, 'portfolio:read', otherScope, { directId: true })).toThrowError(
      expect.objectContaining({ statusCode: 404, reasonCode: 'RESOURCE_NOT_VISIBLE' }),
    );
  });

  it('denies cross-mode access even within the same workspace', () => {
    const liveRead = createTenantContext({ ...scope, mode: 'LIVE_READ' });
    expect(() => authorize(procurement, 'portfolio:read', liveRead)).toThrowError(
      expect.objectContaining({ statusCode: 403, reasonCode: 'MODE_SCOPE_MISMATCH' }),
    );
  });

  it('denies a role/scope not granted to the user', () => {
    expect(() => authorize(procurement, 'finance:export', scope)).toThrow(AuthorizationError);
  });

  it('builds mandatory repository predicates for list queries', () => {
    expect(tenantPredicate(procurement)).toEqual({
      organizationId: scope.organizationId,
      workspaceId: scope.workspaceId,
      environmentId: scope.environmentId,
      mode: 'SANDBOX',
    });
  });

  it('requires explicit finance/auditor scope for export', () => {
    const finance = createPrincipal({
      subjectRef: 'finance-demo', kind: 'USER', context: scope,
      roles: ['FINANCE'], scopes: ['finance:export'],
    });
    expect(authorize(finance, 'finance:export', scope).allowed).toBe(true);
  });

  it('rejects background jobs whose embedded scope differs from the worker principal', () => {
    expect(() => requireJobScope(procurement, { context: otherScope, operationKey: 'operation-demo-0001' })).toThrowError(
      expect.objectContaining({ reasonCode: 'JOB_SCOPE_MISMATCH' }),
    );
  });

  it.each(['proposal:approve', 'transaction:sign', 'policy:write', 'live-write:enable']) (
    'denies service accounts the privileged %s action',
    (action) => {
      const service = createPrincipal({
        subjectRef: 'importer-demo', kind: 'SERVICE_ACCOUNT', context: scope,
        roles: ['IMPORTER'], scopes: [action],
      });
      expect(() => authorize(service, action, scope)).toThrowError(
        expect.objectContaining({ reasonCode: 'SERVICE_ACCOUNT_RESTRICTED' }),
      );
    },
  );
});
