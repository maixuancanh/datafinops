import { createHmac, timingSafeEqual } from 'node:crypto';
export function signWebhook(secret: string, body: string): string { return createHmac('sha256', secret).update(body).digest('hex'); }
export function verifyWebhook(secret: string, body: string, signature: string): boolean { const expected = signWebhook(secret, body); return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature)); }
