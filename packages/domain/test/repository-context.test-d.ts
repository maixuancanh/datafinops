import {
  createScopedRepository,
  createTenantContext,
  type RepositoryAdapter,
} from '../src/repositories/index.js';

const context = createTenantContext({
  organizationId: '11111111-1111-4111-8111-111111111111',
  workspaceId: '22222222-2222-4222-8222-222222222222',
  environmentId: '33333333-3333-4333-8333-333333333333',
  mode: 'SANDBOX',
});
const adapter = {} as RepositoryAdapter<{ id: string }>;
const repository = createScopedRepository(context, adapter);
repository.findById('44444444-4444-4444-8444-444444444444');

// @ts-expect-error repositories cannot be constructed without mandatory tenant context
createScopedRepository(adapter);
// @ts-expect-error raw scope strings cannot replace a validated TenantContext
createScopedRepository({ organizationId: 'unsafe' }, adapter);
