export interface ConnectionRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly environmentId: string;
  readonly secretRef: string;
  readonly expectedNetwork: string;
  readonly expectedProgramId: string;
  readonly expectedApiHost: string;
  readonly publicWalletRef: string;
}

export interface ConnectionVerificationResult {
  readonly connectionId: string;
  readonly status: 'VERIFIED_READ' | 'BLOCKED';
  readonly executable: boolean;
  readonly checks: readonly {
    readonly name: string;
    readonly status: 'PASS' | 'FAIL';
    readonly observed: string;
  }[];
  readonly reasonCodes: readonly string[];
}

export interface ConnectionProbe {
  readonly network: string;
  readonly programId: string;
  readonly apiHost: string;
  readonly publicWalletRef: string;
}

export function verifyConnection(
  record: ConnectionRecord,
  observed: ConnectionProbe,
): ConnectionVerificationResult {
  const checks = [
    {
      name: 'NETWORK',
      observed: observed.network,
      status: observed.network === record.expectedNetwork ? 'PASS' : 'FAIL',
    },
    {
      name: 'PROGRAM',
      observed: observed.programId,
      status: observed.programId === record.expectedProgramId ? 'PASS' : 'FAIL',
    },
    {
      name: 'API_HOST',
      observed: observed.apiHost,
      status: observed.apiHost === record.expectedApiHost ? 'PASS' : 'FAIL',
    },
    {
      name: 'PUBLIC_WALLET',
      observed: observed.publicWalletRef,
      status: observed.publicWalletRef === record.publicWalletRef ? 'PASS' : 'FAIL',
    },
  ] as const;
  const reasonCodes = checks
    .filter((check) => check.status === 'FAIL')
    .map((check) => `${check.name}_MISMATCH`);
  const blocked = reasonCodes.length > 0;
  return {
    connectionId: record.id,
    status: blocked ? 'BLOCKED' : 'VERIFIED_READ',
    executable: !blocked,
    checks,
    reasonCodes,
  };
}
