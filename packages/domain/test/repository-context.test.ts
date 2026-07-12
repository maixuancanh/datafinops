import { describe, expect, it, vi } from 'vitest';

import { createScopedRepository, createTenantContext } from '../src/repositories/index.js';

describe('mandatory repository context', () => {
  it('passes the exact immutable tenant/environment context to every adapter call', async () => {
    const context = createTenantContext({
      organizationId: '11111111-1111-4111-8111-111111111111',
      workspaceId: '22222222-2222-4222-8222-222222222222',
      environmentId: '33333333-3333-4333-8333-333333333333',
      mode: 'SANDBOX',
    });
    const adapter = { findById: vi.fn(), list: vi.fn().mockResolvedValue([]) };
    const repository = createScopedRepository(context, adapter);
    await repository.list();
    expect(adapter.list).toHaveBeenCalledWith(context);
    expect(Object.isFrozen(repository.context())).toBe(true);
  });

  it('rejects malformed scope identifiers before a repository exists', () => {
    expect(() =>
      createTenantContext({
        organizationId: 'unsafe',
        workspaceId: '22222222-2222-4222-8222-222222222222',
        environmentId: '33333333-3333-4333-8333-333333333333',
        mode: 'SANDBOX',
      }),
    ).toThrow(/organizationId/);
  });
});
