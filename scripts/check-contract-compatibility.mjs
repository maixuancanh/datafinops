import { spawnSync } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parse } from 'yaml';

const productRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractsRoot = path.join(productRoot, 'contracts');
const baselinePath = path.join(contractsRoot, '.compatibility-baseline.json');

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

export function compareContractSurface(baseline, current) {
  const errors = [];
  for (const operation of baseline.operations ?? []) {
    if (!current.operations?.includes(operation)) errors.push(`removed operation: ${operation}`);
  }
  for (const channel of baseline.channels ?? []) {
    if (!current.channels?.includes(channel)) errors.push(`removed channel: ${channel}`);
  }
  for (const [schema, fields] of Object.entries(baseline.requiredFields ?? {})) {
    for (const field of fields) {
      if (!current.requiredFields?.[schema]?.includes(field)) {
        errors.push(`removed required field: ${schema}.${field}`);
      }
    }
  }
  return errors;
}

function collectRequired(document, prefix, result) {
  const schemas = document?.components?.schemas ?? document?.$defs ?? {};
  for (const [name, schema] of Object.entries(schemas)) {
    if (Array.isArray(schema?.required)) result[`${prefix}${name}`] = sortedUnique(schema.required);
  }
}

export async function extractContractSurface() {
  const openapi = parse(await readFile(path.join(contractsRoot, 'openapi.yaml'), 'utf8'));
  const asyncapi = parse(await readFile(path.join(contractsRoot, 'events.asyncapi.yaml'), 'utf8'));
  const snapshot = JSON.parse(
    await readFile(path.join(contractsRoot, 'schemas/optimization-snapshot.schema.json'), 'utf8'),
  );
  const transaction = JSON.parse(
    await readFile(path.join(contractsRoot, 'schemas/transaction-proposal.schema.json'), 'utf8'),
  );
  const operations = [];
  for (const pathItem of Object.values(openapi.paths ?? {})) {
    for (const operation of Object.values(pathItem ?? {})) {
      if (typeof operation?.operationId === 'string') operations.push(operation.operationId);
    }
  }
  const requiredFields = {};
  collectRequired(openapi, 'openapi:', requiredFields);
  collectRequired(asyncapi, 'events:', requiredFields);
  collectRequired(snapshot, 'snapshot:', requiredFields);
  collectRequired(transaction, 'transaction:', requiredFields);
  if (Array.isArray(snapshot.required)) requiredFields['snapshot:root'] = sortedUnique(snapshot.required);
  if (Array.isArray(transaction.required)) {
    requiredFields['transaction:root'] = sortedUnique(transaction.required);
  }
  return {
    operations: sortedUnique(operations),
    channels: sortedUnique(Object.values(asyncapi.channels ?? {}).map((channel) => channel.address)),
    requiredFields: Object.fromEntries(
      Object.entries(requiredFields).sort(([left], [right]) => left.localeCompare(right)),
    ),
  };
}

async function main() {
  const current = await extractContractSurface();
  if (process.argv.includes('--initialize')) {
    await writeFile(baselinePath, `${JSON.stringify(current, null, 2)}\n`, 'utf8');
    console.log('Initialized compatibility baseline from approved contracts.');
    return;
  }
  const baseline = JSON.parse(await readFile(baselinePath, 'utf8'));
  const errors = compareContractSurface(baseline, current);
  if (errors.length > 0) {
    if (
      process.argv.includes('--approve-breaking') &&
      process.env.CONTRACT_BREAKING_CHANGE_APPROVED === 'true'
    ) {
      await writeFile(baselinePath, `${JSON.stringify(current, null, 2)}\n`, 'utf8');
      console.log('Updated compatibility baseline with explicit breaking-change approval.');
    } else {
      throw new Error(`${errors.join('\n')}\nExplicit reviewed approval is required.`);
    }
  } else {
    console.log('Contract compatibility passed.');
  }
  const generated = spawnSync(process.execPath, ['./scripts/generate.mjs', '--check'], {
    cwd: path.join(productRoot, 'packages/contracts'),
    stdio: 'inherit',
  });
  if (generated.status !== 0) process.exitCode = generated.status ?? 1;
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (invokedPath === fileURLToPath(import.meta.url)) await main();
