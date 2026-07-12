import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

const policy = parse(await readFile('security/prohibited-material.yml', 'utf8'));
const requiredSurfaces = [
  'request-headers',
  'json',
  'csv',
  'uploaded-files',
  'errors',
  'logs',
  'traces',
  'queues',
  'exports',
  'support-captures',
  'source-maps',
  'video-configs',
];
const missing = requiredSurfaces.filter((surface) => !policy.scanSurfaces?.includes(surface));
if (missing.length > 0)
  throw new Error(`Missing prohibited-material scan surfaces: ${missing.join(', ')}`);
if (policy.action !== 'reject-before-durable-logging')
  throw new Error('Policy must reject before durable logging');
if (policy.response?.persistRawValue !== false)
  throw new Error('Raw prohibited values must never persist');
if (!Array.isArray(policy.fieldNames) || policy.fieldNames.length < 10) {
  throw new Error('Prohibited field-name corpus is incomplete');
}
console.log(
  `Security policy covers ${requiredSurfaces.length} surfaces and ${policy.fieldNames.length} field names.`,
);
