import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { compile } from 'json-schema-to-typescript';
import openapiTS, { astToString } from 'openapi-typescript';
import { parse } from 'yaml';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contractsRoot = path.resolve(packageRoot, '../../contracts');
const outputRoot = path.resolve(packageRoot, 'src/generated');
const checkOnly = process.argv.includes('--check');

async function source(name) {
  const absolute = path.resolve(contractsRoot, name);
  const text = await readFile(absolute, 'utf8');
  return { absolute, text, hash: createHash('sha256').update(text).digest('hex') };
}

function header(name, hash) {
  return `// Generated from ${name} sha256:${hash}\n// Do not edit; run pnpm contracts:generate.\n\n`;
}

async function formatTypeScript(content) {
  const prettier = await import('prettier');
  const config = (await prettier.resolveConfig(packageRoot)) ?? {};
  return prettier.format(content, { ...config, parser: 'typescript' });
}

function rewriteComponentRefs(value) {
  if (Array.isArray(value)) return value.map(rewriteComponentRefs);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [
        key,
        key === '$ref' && typeof child === 'string'
          ? child.replace('#/components/schemas/', '#/$defs/')
          : rewriteComponentRefs(child),
      ]),
    );
  }
  return value;
}

async function openApiOutput() {
  const input = await source('openapi.yaml');
  const ast = await openapiTS(pathToFileURL(input.absolute), { alphabetize: true });
  return formatTypeScript(header('openapi.yaml', input.hash) + astToString(ast));
}

async function eventOutput() {
  const input = await source('events.asyncapi.yaml');
  const document = parse(input.text);
  const messages = Object.values(document.components?.messages ?? {});
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    title: 'DataFinOpsEvent',
    oneOf: messages.map((message) => rewriteComponentRefs(message.payload)),
    $defs: rewriteComponentRefs(document.components?.schemas ?? {}),
  };
  return await formatTypeScript(
    header('events.asyncapi.yaml', input.hash) +
      (await compile(schema, 'DataFinOpsEvent', {
        additionalProperties: false,
        bannerComment: '',
        format: false,
        strictIndexSignatures: true,
        unknownAny: true,
      })),
  );
}

async function jsonSchemaOutput(name, typeName) {
  const input = await source(`schemas/${name}.schema.json`);
  const schema = JSON.parse(input.text);
  return await formatTypeScript(
    header(`schemas/${name}.schema.json`, input.hash) +
      (await compile(schema, typeName, {
        additionalProperties: false,
        bannerComment: '',
        format: false,
        strictIndexSignatures: true,
        unknownAny: true,
      })),
  );
}

const outputs = new Map([
  ['openapi.ts', await openApiOutput()],
  ['events.ts', await eventOutput()],
  [
    'optimization-snapshot.ts',
    await jsonSchemaOutput('optimization-snapshot', 'OptimizationSnapshot'),
  ],
  [
    'transaction-proposal.ts',
    await jsonSchemaOutput('transaction-proposal', 'TransactionProposal'),
  ],
]);
const exportNames = new Map([
  ['openapi.ts', 'OpenApiTypes'],
  ['events.ts', 'EventTypes'],
  ['optimization-snapshot.ts', 'OptimizationSnapshotTypes'],
  ['transaction-proposal.ts', 'TransactionProposalTypes'],
]);
const index = [...outputs.keys()]
  .map((name) => `export * as ${exportNames.get(name)} from './generated/${name.slice(0, -3)}.js';`)
  .join('\n');

await mkdir(outputRoot, { recursive: true });
for (const [name, content] of outputs) {
  const target = path.join(outputRoot, name);
  if (checkOnly) {
    const current = await readFile(target, 'utf8').catch(() => '');
    if (current !== content) throw new Error(`Generated contract drift: ${name}`);
  } else {
    await writeFile(target, content, 'utf8');
  }
}
const indexTarget = path.resolve(outputRoot, '../index.ts');
if (checkOnly) {
  const current = await readFile(indexTarget, 'utf8').catch(() => '');
  if (current !== `${index}\n`) throw new Error('Generated contract drift: src/index.ts');
} else {
  await writeFile(indexTarget, `${index}\n`, 'utf8');
}
console.log(
  checkOnly ? 'Generated contracts match sources.' : `Generated ${outputs.size} contract files.`,
);
