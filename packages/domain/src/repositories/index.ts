const tenantContextBrand: unique symbol = Symbol('TenantContext');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type EnvironmentMode = 'SANDBOX' | 'DEVNET' | 'LIVE_READ' | 'LIVE_WRITE';

export interface TenantContext {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly environmentId: string;
  readonly mode: EnvironmentMode;
  readonly [tenantContextBrand]: true;
}

export interface RepositoryAdapter<T extends { readonly id: string }> {
  findById(context: TenantContext, id: string): Promise<T | undefined>;
  list(context: TenantContext): Promise<readonly T[]>;
}

function requireUuid(name: string, value: string): string {
  if (!UUID.test(value)) throw new TypeError(`${name} must be a UUID`);
  return value.toLowerCase();
}

export function createTenantContext(input: {
  readonly organizationId: string;
  readonly workspaceId: string;
  readonly environmentId: string;
  readonly mode: EnvironmentMode;
}): TenantContext {
  return Object.freeze({
    organizationId: requireUuid('organizationId', input.organizationId),
    workspaceId: requireUuid('workspaceId', input.workspaceId),
    environmentId: requireUuid('environmentId', input.environmentId),
    mode: input.mode,
    [tenantContextBrand]: true as const,
  });
}

export function createScopedRepository<T extends { readonly id: string }>(
  context: TenantContext,
  adapter: RepositoryAdapter<T>,
) {
  return Object.freeze({
    findById(id: string): Promise<T | undefined> {
      return adapter.findById(context, requireUuid('id', id));
    },
    list(): Promise<readonly T[]> {
      return adapter.list(context);
    },
    context(): TenantContext {
      return context;
    },
  });
}
