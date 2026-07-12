import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

describe('migration prohibited signing columns', () => {
  it('contains no signing-secret column or persistence surface', async () => {
    const migration = await readFile(
      path.resolve(import.meta.dirname, '../../infrastructure/migrations/0001_baseline.sql'),
      'utf8',
    );
    expect(migration).not.toMatch(
      /\b(private_?key|seed_?phrase|mnemonic|keystore|recovery_?phrase|signing_?passphrase|raw_?signer)\b/i,
    );
  });
});
