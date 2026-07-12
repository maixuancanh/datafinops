import { describe, expect, it } from 'vitest';

import { buildApi } from '../src/app.js';

describe('health endpoint', () => {
  it('reports version, sandbox mode, replay adapter, fixed clock, and disabled live-write', async () => {
    const app = buildApi({
      version: '0.1.0-test',
      mode: 'sandbox',
      adapter: 'replay',
      fixedClock: '2026-08-01T12:00:00.000Z',
      liveWrite: false,
    });

    const response = await app.inject({ method: 'GET', url: '/api/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: 'ok',
      version: '0.1.0-test',
      mode: 'sandbox',
      adapter: 'replay',
      fixedClock: '2026-08-01T12:00:00.000Z',
      liveWrite: 'disabled',
    });
    await app.close();
  });

  it('never serializes credential-shaped extra input', async () => {
    const app = buildApi({
      version: '0.1.0-test',
      mode: 'sandbox',
      adapter: 'replay',
      fixedClock: '2026-08-01T12:00:00.000Z',
      liveWrite: false,
      readCredential: 'must-not-appear',
    } as never);
    const response = await app.inject({ method: 'GET', url: '/api/health' });
    expect(response.body).not.toContain('must-not-appear');
    expect(response.body).not.toMatch(/credential/i);
    await app.close();
  });
});
