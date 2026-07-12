import corpus from '../../../tests/security/fixtures/signing-material-corpus.json' with { type: 'json' };
import { describe, expect, it } from 'vitest';

import {
  ProhibitedMaterialError,
  assertNoProhibitedMaterial,
  createSafeSink,
} from '../src/prohibited-material.js';

describe('prohibited signing material prefilter', () => {
  it.each(corpus)('rejects $surface material named $name before a sink', (entry) => {
    const sink = createSafeSink();
    expect(() =>
      assertNoProhibitedMaterial(
        { [entry.name]: entry.value },
        { correlationId: 'corr-demo', sink },
      ),
    ).toThrow(ProhibitedMaterialError);
    const serialized = JSON.stringify(sink.entries());
    expect(serialized).not.toContain(entry.value);
    expect(serialized).toContain('PROHIBITED_SIGNING_MATERIAL');
  });

  it('recursively checks arrays and encoded string content', () => {
    expect(() =>
      assertNoProhibitedMaterial({ rows: [{ note: 'private_key=FAKE666666666666666666666666' }] }),
    ).toThrow(/prohibited/i);
  });

  it('allows public wallet references and normal aggregate data', () => {
    expect(() =>
      assertNoProhibitedMaterial({
        publicWalletRef: 'DemoWallet111111111111111111111111111111',
        requests: 10,
      }),
    ).not.toThrow();
  });
});
