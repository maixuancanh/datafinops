import { describe, expect, it } from 'vitest';
import { signWebhook, verifyWebhook } from '../../apps/workers/src/webhooks/governance.js';
describe('governance webhooks', () => { it('verifies HMAC and rejects replayed body mutation', () => { const body = '{"event":"APPROVAL_REQUIRED"}'; const signature = signWebhook('secret', body); expect(verifyWebhook('secret', body, signature)).toBe(true); expect(verifyWebhook('secret', body + 'x', signature)).toBe(false); }); });
