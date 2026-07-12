import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureNames = [
  'pricing',
  'subscription',
  'fixtures',
  'usage',
  'requirements',
  'receipt',
  'entitlement',
  'savings',
] as const;

async function readFixture(name: (typeof fixtureNames)[number]): Promise<Record<string, unknown>> {
  return JSON.parse(
    await readFile(path.join(packageRoot, 'fixtures', `${name}.json`), 'utf8'),
  ) as Record<string, unknown>;
}

describe('committed synthetic fixture datasets', () => {
  it.each(fixtureNames)('%s declares deterministic synthetic provenance', async (name) => {
    const fixture = await readFixture(name);
    expect(fixture).toMatchObject({
      schemaVersion: '1.0',
      fixtureType: name,
      provenance: {
        synthetic: true,
        containsCustomerData: false,
        containsSigningMaterial: false,
        generatorVersion: 'datafinops-fixtures-1.0.0',
      },
    });
  });

  it('uses only sandbox mode and the fixed demo clock across fixtures', async () => {
    for (const name of fixtureNames) {
      const fixture = await readFixture(name);
      expect(JSON.stringify(fixture)).not.toMatch(/LIVE_WRITE|mainnet|production/i);
      expect(fixture.generatedAt).toBe('2026-08-01T12:00:00.000Z');
    }
  });
});
