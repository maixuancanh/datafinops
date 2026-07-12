import { describe, expect, it } from 'vitest';
import { createDemoSigner } from '../src/index.js';
describe('browser-only demo wallet', () => { it('returns public simulated signature only', async () => { const result = await createDemoSigner('public').sign('hash'); expect(result).toEqual({ signedMaterialHash: 'hash', simulation: true }); }); it('never accepts secret input', () => expect(() => createDemoSigner('')).toThrow()); });
