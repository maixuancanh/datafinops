import type { TenantContext } from '@datafinops/domain';

export type PrincipalKind = 'USER' | 'SERVICE_ACCOUNT';

export interface ApprovalAuthority {
  readonly role: string;
  readonly currency?: string;
  readonly maximumMinorUnits?: bigint;
  readonly expiresAt?: string;
}

export interface Principal {
  readonly subjectRef: string;
  readonly kind: PrincipalKind;
  readonly context: TenantContext;
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
  readonly authorities: readonly ApprovalAuthority[];
}

export class AuthorizationError extends Error {
  readonly statusCode: 403 | 404;
  readonly reasonCode: string;

  constructor(statusCode: 403 | 404, reasonCode: string) {
    super(reasonCode === 'RESOURCE_NOT_VISIBLE' ? 'Resource not found' : 'Action is not permitted');
    this.name = 'AuthorizationError';
    this.statusCode = statusCode;
    this.reasonCode = reasonCode;
  }
}

const serviceAccountDenied = new Set([
  'proposal:approve',
  'transaction:sign',
  'policy:write',
  'live-write:enable',
  'secret:read',
  'savings:close',
]);

function sameTenant(left: TenantContext, right: TenantContext): boolean {
  return (
    left.organizationId === right.organizationId &&
    left.workspaceId === right.workspaceId &&
    left.environmentId === right.environmentId
  );
}

export function createPrincipal(input: {
  readonly subjectRef: string;
  readonly kind: PrincipalKind;
  readonly context: TenantContext;
  readonly roles: readonly string[];
  readonly scopes: readonly string[];
  readonly authorities?: readonly ApprovalAuthority[];
}): Principal {
  if (!input.subjectRef.trim()) throw new TypeError('subjectRef is required');
  return Object.freeze({
    ...input,
    roles: Object.freeze([...new Set(input.roles)].sort()),
    scopes: Object.freeze([...new Set(input.scopes)].sort()),
    authorities: Object.freeze([...(input.authorities ?? [])]),
  });
}

export function authorize(
  principal: Principal,
  action: string,
  resourceContext: TenantContext,
  options: { readonly directId?: boolean } = {},
) {
  if (!sameTenant(principal.context, resourceContext)) {
    throw new AuthorizationError(
      options.directId ? 404 : 403,
      options.directId ? 'RESOURCE_NOT_VISIBLE' : 'TENANT_SCOPE_MISMATCH',
    );
  }
  if (principal.context.mode !== resourceContext.mode) {
    throw new AuthorizationError(403, 'MODE_SCOPE_MISMATCH');
  }
  if (principal.kind === 'SERVICE_ACCOUNT' && serviceAccountDenied.has(action)) {
    throw new AuthorizationError(403, 'SERVICE_ACCOUNT_RESTRICTED');
  }
  if (!principal.scopes.includes(action)) throw new AuthorizationError(403, 'SCOPE_REQUIRED');
  return Object.freeze({ allowed: true as const, subjectRef: principal.subjectRef, action });
}

export function tenantPredicate(principal: Principal) {
  return Object.freeze({
    organizationId: principal.context.organizationId,
    workspaceId: principal.context.workspaceId,
    environmentId: principal.context.environmentId,
    mode: principal.context.mode,
  });
}

export function requireJobScope(
  principal: Principal,
  job: { readonly context: TenantContext; readonly operationKey: string },
) {
  if (!sameTenant(principal.context, job.context) || principal.context.mode !== job.context.mode) {
    throw new AuthorizationError(403, 'JOB_SCOPE_MISMATCH');
  }
  if (job.operationKey.length < 16) throw new TypeError('Job operation key is invalid');
  return Object.freeze({ principal, operationKey: job.operationKey });
}

export function mapOidcSubject(input: {
  readonly issuer: string;
  readonly subject: string;
  readonly allowedIssuers: readonly string[];
  readonly resolve: (issuer: string, subject: string) => Principal | undefined;
}): Principal {
  if (!input.allowedIssuers.includes(input.issuer)) {
    throw new AuthorizationError(403, 'OIDC_ISSUER_NOT_ALLOWED');
  }
  const principal = input.resolve(input.issuer, input.subject);
  if (!principal) throw new AuthorizationError(403, 'OIDC_SUBJECT_NOT_MAPPED');
  return principal;
}

export {
  assertBreakGlass,
  createBreakGlassGrant,
  requirePrivilegedAccess,
  transitionRoleLifecycle,
  type BreakGlassGrant,
  type RoleLifecycle,
} from './privileged-access.js';
export * from './enterprise.js';
