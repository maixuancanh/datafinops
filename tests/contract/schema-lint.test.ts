import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { inspectApprovedContracts } from '../helpers/contracts.js';

const contractsRoot = path.resolve(import.meta.dirname, '../../contracts');

describe('approved DataFinOps contracts', () => {
  it('parses OpenAPI, AsyncAPI, and both Draft 2020-12 JSON Schemas', async () => {
    const report = await inspectApprovedContracts(contractsRoot);
    expect(report.parseErrors).toEqual([]);
    expect(report.files).toHaveLength(4);
    expect(report.openApiVersion).toBe('3.1.0');
    expect(report.asyncApiVersion).toBe('3.0.0');
  });

  it('resolves every local file reference and internal JSON pointer', async () => {
    const report = await inspectApprovedContracts(contractsRoot);
    expect(report.referenceErrors).toEqual([]);
  });

  it('contains no schema field capable of accepting private signing material', async () => {
    const report = await inspectApprovedContracts(contractsRoot);
    expect(report.prohibitedSchemaFields).toEqual([]);
  });

  it('keeps every object schema closed when it carries transaction fields', async () => {
    const report = await inspectApprovedContracts(contractsRoot);
    expect(report.openTransactionObjects).toEqual([]);
  });
});
