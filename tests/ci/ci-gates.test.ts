import { describe, expect, it } from 'vitest';

import {
  assertSuccessfulNeeds,
  validateBranchProtectionEvidence,
  validateCiWorkflow,
} from '../../scripts/check-ci-gates.mjs';

const completeWorkflow = `
name: CI
jobs:
  contracts: { runs-on: ubuntu-latest, steps: [] }
  quality: { runs-on: ubuntu-latest, steps: [] }
  tests: { runs-on: ubuntu-latest, steps: [] }
  build: { runs-on: ubuntu-latest, steps: [] }
  security: { runs-on: ubuntu-latest, steps: [] }
  solver-parity: { runs-on: ubuntu-latest, steps: [] }
  evidence: { runs-on: ubuntu-latest, steps: [] }
  aggregate:
    if: always()
    needs: [contracts, quality, tests, build, security, solver-parity, evidence]
    runs-on: ubuntu-latest
    steps:
      - run: node scripts/assert-ci-results.mjs '\${{ toJson(needs) }}'
`;

describe('CI aggregate gate', () => {
  it('accepts a gate that observes every required job even after a failure', () => {
    expect(validateCiWorkflow(completeWorkflow)).toEqual([]);
  });

  it('rejects an aggregate gate that omits a required job', () => {
    const workflow = completeWorkflow.replace(', evidence]', ']');
    expect(validateCiWorkflow(workflow)).toContain('aggregate.needs must include evidence');
  });

  it('rejects a gate that can be skipped after an upstream failure', () => {
    const workflow = completeWorkflow.replace('if: always()', 'if: success()');
    expect(validateCiWorkflow(workflow)).toContain('aggregate must use if: always()');
  });

  it('fails the aggregate result when any required job fails', () => {
    expect(() =>
      assertSuccessfulNeeds({
        contracts: { result: 'success' },
        quality: { result: 'failure' },
      }),
    ).toThrow('quality=failure');
  });

  it('requires external branch protection proof before T005 can close', () => {
    expect(
      validateBranchProtectionEvidence({
        gitRemoteConfigured: true,
        remoteUrl: 'https://github.com/example/datafinops',
        targetBranch: 'main',
        requiredStatusChecks: ['Required aggregate gate'],
        failedRequiredJobBlocksMerge: true,
        fixedAggregateUnblocksMerge: true,
      }),
    ).toEqual([]);

    expect(
      validateBranchProtectionEvidence({
        gitRemoteConfigured: true,
        remoteUrl: 'https://github.com/example/datafinops',
        targetBranch: 'main',
        requiredStatusChecks: ['contracts'],
        failedRequiredJobBlocksMerge: false,
        fixedAggregateUnblocksMerge: false,
      }),
    ).toEqual([
      'branch protection must require Required aggregate gate',
      'failed required job must be observed blocking merge',
      'fixed aggregate gate must be observed unblocking merge',
    ]);
  });
});
