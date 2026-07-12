import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const generatedRoot = path.resolve(import.meta.dirname, '../src/generated');
const expectedFiles = [
  'openapi.ts',
  'events.ts',
  'optimization-snapshot.ts',
  'transaction-proposal.ts',
];

describe('generated contract types', () => {
  it.each(expectedFiles)('%s is generated with source hash and strict unknowns', async (file) => {
    const source = await readFile(path.join(generatedRoot, file), 'utf8');
    expect(source).toMatch(/^\/\/ Generated from .+ sha256:[a-f0-9]{64}/);
    expect(source).not.toMatch(/\bany\b/);
    expect(source).toContain('export');
  });

  it('exports every generated contract surface', async () => {
    const source = await readFile(path.resolve(generatedRoot, '../index.ts'), 'utf8');
    for (const file of expectedFiles)
      expect(source).toContain(`./generated/${file.slice(0, -3)}.js`);
  });
});
