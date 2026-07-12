import { describe, expect, it } from 'vitest';

import { compareContractSurface } from '../../../scripts/check-contract-compatibility.mjs';

describe('contract compatibility', () => {
  const baseline = {
    operations: ['createConnection', 'getConnection'],
    channels: ['connection.verified.v1'],
    requiredFields: { Connection: ['id', 'status'] },
  };

  it('accepts additive operations, channels, and optional fields', () => {
    expect(
      compareContractSurface(baseline, {
        operations: [...baseline.operations, 'listConnections'],
        channels: [...baseline.channels, 'connection.created.v1'],
        requiredFields: baseline.requiredFields,
      }),
    ).toEqual([]);
  });

  it('rejects removed operations, channels, and required fields', () => {
    expect(
      compareContractSurface(baseline, {
        operations: ['createConnection'],
        channels: [],
        requiredFields: { Connection: ['id'] },
      }),
    ).toEqual([
      'removed operation: getConnection',
      'removed channel: connection.verified.v1',
      'removed required field: Connection.status',
    ]);
  });
});
