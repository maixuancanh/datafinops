import { describe, expect, it } from 'vitest';
import { verifyConnection } from '../src/connections/verify.js';

const record = { id: 'conn_1', tenantId: 't', environmentId: 'e', secretRef: 'vault://x', expectedNetwork: 'sandbox', expectedProgramId: 'p', expectedApiHost: 'https://api.test', publicWalletRef: 'wallet' };

describe('connection verification job', () => {
  it('verifies an exact expected connection', () => {
    const result = verifyConnection(record, { network: 'sandbox', programId: 'p', apiHost: 'https://api.test', publicWalletRef: 'wallet' });
    expect(result.status).toBe('VERIFIED_READ');
    expect(result.executable).toBe(true);
  });

  it('blocks mismatched API hosts', () => {
    const result = verifyConnection(record, { network: 'sandbox', programId: 'p', apiHost: 'https://wrong.test', publicWalletRef: 'wallet' });
    expect(result.status).toBe('BLOCKED');
    expect(result.reasonCodes).toContain('API_HOST_MISMATCH');
    expect(result.executable).toBe(false);
  });
});
