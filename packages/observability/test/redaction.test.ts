import { describe, expect, it } from 'vitest';

import { createTelemetry, redact } from '../src/index.js';

describe('observability redaction', () => {
  it('recursively redacts secrets, signing material, credentials, and finance values', () => {
    const input = {
      correlationId: 'correlation-demo',
      tenantRef: 'tenant-demo',
      readCredential: 'txline-secret',
      nested: { privateKey: 'forbidden', amountMinorUnits: '120000', safe: 'visible' },
      rows: [{ revenue: '900000' }, { league: 'EPL' }],
    };
    expect(redact(input)).toEqual({
      correlationId: 'correlation-demo',
      tenantRef: 'tenant-demo',
      readCredential: '[REDACTED]',
      nested: { privateKey: '[REDACTED]', amountMinorUnits: '[FINANCE_REDACTED]', safe: 'visible' },
      rows: [{ revenue: '[FINANCE_REDACTED]' }, { league: 'EPL' }],
    });
    expect(JSON.stringify(redact(input))).not.toMatch(/txline-secret|forbidden|120000|900000/);
  });

  it('emits allowlisted structured logs, trace spans, metrics, and redacted errors', () => {
    const telemetry = createTelemetry({ serviceName: 'datafinops-api', serviceVersion: '0.1.0' });
    telemetry.log('info', 'health.checked', {
      correlationId: 'corr-1',
      tenantRef: 'tenant-demo',
      password: 'do-not-log',
      unexpected: 'drop-me',
    });
    telemetry.metric('health_check_total', 1, { mode: 'sandbox', password: 'do-not-log' });
    telemetry.span('health.check', { correlationId: 'corr-1', mnemonic: 'do-not-log' });
    telemetry.captureError(new Error('failure secret=do-not-log'), { correlationId: 'corr-1' });

    const snapshot = telemetry.snapshot();
    expect(snapshot.logs[0]).toMatchObject({
      level: 'info',
      event: 'health.checked',
      serviceName: 'datafinops-api',
      correlationId: 'corr-1',
      tenantRef: 'tenant-demo',
    });
    expect(snapshot.logs[0]).not.toHaveProperty('unexpected');
    expect(JSON.stringify(snapshot)).not.toContain('do-not-log');
    expect(snapshot.metrics).toHaveLength(1);
    expect(snapshot.spans).toHaveLength(1);
    expect(snapshot.errors).toHaveLength(1);
  });
});
