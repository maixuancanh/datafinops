import { readFile } from 'node:fs/promises';
import path from 'node:path';

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { parse } from 'yaml';

export interface ContractInspectionReport {
  readonly files: readonly string[];
  readonly openApiVersion?: string;
  readonly asyncApiVersion?: string;
  readonly parseErrors: readonly string[];
  readonly referenceErrors: readonly string[];
  readonly prohibitedSchemaFields: readonly string[];
  readonly openTransactionObjects: readonly string[];
}

const prohibitedField =
  /^(?:private[_-]?key|seed[_-]?phrase|mnemonic|keystore|passphrase|recovery[_-]?phrase|raw[_-]?signer|signing[_-]?secret)$/i;
const transactionField =
  /^(?:accounts|instructions|publicSigner|signingEnvelopeId|unsignedPayload)$/;

type Document = Record<string, unknown>;

function pointerValue(document: unknown, pointer: string): unknown {
  if (pointer === '' || pointer === '#') return document;
  if (!pointer.startsWith('#/')) return undefined;
  return pointer
    .slice(2)
    .split('/')
    .map((part) => part.replaceAll('~1', '/').replaceAll('~0', '~'))
    .reduce<unknown>((current, part) => {
      if (current === null || typeof current !== 'object') return undefined;
      return (current as Record<string, unknown>)[part];
    }, document);
}

function walk(
  value: unknown,
  visitor: (value: Document, pointer: string) => void,
  pointer = '#',
): void {
  if (value === null || typeof value !== 'object') return;
  if (!Array.isArray(value)) visitor(value as Document, pointer);
  for (const [key, child] of Object.entries(value)) {
    walk(child, visitor, `${pointer}/${key.replaceAll('~', '~0').replaceAll('/', '~1')}`);
  }
}

async function readDocument(file: string): Promise<Document> {
  const source = await readFile(file, 'utf8');
  return (file.endsWith('.json') ? JSON.parse(source) : parse(source)) as Document;
}

export async function inspectApprovedContracts(root: string): Promise<ContractInspectionReport> {
  const relativeFiles = [
    'openapi.yaml',
    'events.asyncapi.yaml',
    'schemas/optimization-snapshot.schema.json',
    'schemas/transaction-proposal.schema.json',
  ];
  const parseErrors: string[] = [];
  const referenceErrors: string[] = [];
  const prohibitedSchemaFields: string[] = [];
  const openTransactionObjects: string[] = [];
  const documents = new Map<string, Document>();

  for (const relativeFile of relativeFiles) {
    try {
      documents.set(relativeFile, await readDocument(path.join(root, relativeFile)));
    } catch (error) {
      parseErrors.push(
        `${relativeFile}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  for (const relativeFile of relativeFiles.filter((file) => file.endsWith('.json'))) {
    const document = documents.get(relativeFile);
    if (!document) continue;
    try {
      ajv.compile(document);
    } catch (error) {
      parseErrors.push(
        `${relativeFile}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  for (const [relativeFile, document] of documents) {
    walk(document, (node, pointer) => {
      if (typeof node.$ref === 'string') {
        const [filePart = '', fragment = ''] = node.$ref.split('#', 2);
        const targetFile = filePart
          ? path.posix.normalize(path.posix.join(path.posix.dirname(relativeFile), filePart))
          : relativeFile;
        const target = documents.get(targetFile);
        if (!target) referenceErrors.push(`${relativeFile}${pointer}: missing ${targetFile}`);
        else if (fragment && pointerValue(target, `#${fragment}`) === undefined) {
          referenceErrors.push(`${relativeFile}${pointer}: missing #${fragment} in ${targetFile}`);
        }
      }
      const properties = node.properties;
      if (properties && typeof properties === 'object' && !Array.isArray(properties)) {
        const names = Object.keys(properties);
        for (const name of names.filter((property) => prohibitedField.test(property))) {
          prohibitedSchemaFields.push(`${relativeFile}${pointer}/properties/${name}`);
        }
        if (names.some((name) => transactionField.test(name)) && node.type === 'object') {
          if (node.additionalProperties !== false)
            openTransactionObjects.push(`${relativeFile}${pointer}`);
        }
      }
    });
  }

  const openApiVersion = documents.get('openapi.yaml')?.openapi;
  const asyncApiVersion = documents.get('events.asyncapi.yaml')?.asyncapi;
  return {
    files: [...documents.keys()],
    ...(typeof openApiVersion === 'string' ? { openApiVersion } : {}),
    ...(typeof asyncApiVersion === 'string' ? { asyncApiVersion } : {}),
    parseErrors,
    referenceErrors,
    prohibitedSchemaFields,
    openTransactionObjects,
  };
}
