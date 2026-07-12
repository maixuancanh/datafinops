import { describe, expect, it } from 'vitest';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
describe('browser wallet boundary', () => {
  it('keeps wallet references out of server packages', async () => {
    const files = [
      'apps/api/src',
      'apps/workers/src',
      'packages/domain/src',
      'packages/transaction-builder/src',
      'packages/txline-adapter/src',
    ];
    const contents = await Promise.all(
      files.map(async (file) =>
        readFile(resolve(import.meta.dirname, '../../', file), 'utf8').catch(() => ''),
      ),
    );
    expect(contents.join('\n')).not.toContain("from '@datafinops/wallet-client'");
  });
});
