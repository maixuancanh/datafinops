import { describe, expect, it } from 'vitest';
import { buildServer } from '../src/server.js';

describe('connection baseline', () => {
  it('stores a secret reference but never returns the secret reference', async () => {
    const { app, store } = buildServer();
    const response = await app.inject({ method: 'POST', url: '/v1/connections', payload: {
      tenantId: 'tenant_a', environmentId: 'env_sandbox', readCredentialSecretRef: 'vault://secret/1',
      expectedNetwork: 'sandbox', expectedProgramId: 'program-1', expectedApiHost: 'https://api.example.test', publicWalletRef: 'wallet-public',
    }});
    expect(response.statusCode).toBe(201);
    expect(response.body).not.toContain('vault://secret/1');
    expect(store.records.get('conn_1')?.secretRef).toBe('vault://secret/1');
  });

  it('rejects incomplete connection expectations', async () => {
    const { app } = buildServer();
    const response = await app.inject({ method: 'POST', url: '/v1/connections', payload: { tenantId: 'tenant_a' } });
    expect(response.statusCode).toBe(400);
  });
});
