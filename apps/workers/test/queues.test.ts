import { describe, expect, it } from 'vitest';

import { FairTenantScheduler, queueDefinitions } from '../src/queues/index.js';

describe('isolated worker queues', () => {
  it('declares every required workload with bounded retry policy', () => {
    expect(Object.keys(queueDefinitions)).toEqual([
      'activation', 'close', 'export', 'ingestion', 'metering', 'notification',
      'observation', 'optimization', 'renewal', 'snapshot', 'verification',
    ]);
    for (const definition of Object.values(queueDefinitions)) {
      expect(definition.attempts).toBeGreaterThanOrEqual(1);
      expect(definition.attempts).toBeLessThanOrEqual(8);
      expect(definition.removeOnComplete).toBe(false);
    }
  });

  it('round-robins tenants without allowing a large tenant to starve another', () => {
    const scheduler = new FairTenantScheduler<string>({ perTenantBurst: 2 });
    scheduler.enqueue('tenant-a', 'a1');
    scheduler.enqueue('tenant-a', 'a2');
    scheduler.enqueue('tenant-a', 'a3');
    scheduler.enqueue('tenant-b', 'b1');
    expect([scheduler.next(), scheduler.next(), scheduler.next(), scheduler.next()]).toEqual([
      { tenantId: 'tenant-a', job: 'a1' },
      { tenantId: 'tenant-a', job: 'a2' },
      { tenantId: 'tenant-b', job: 'b1' },
      { tenantId: 'tenant-a', job: 'a3' },
    ]);
  });

  it('rejects invalid tenant IDs and unbounded burst settings', () => {
    expect(() => new FairTenantScheduler({ perTenantBurst: 0 })).toThrow(/burst/);
    const scheduler = new FairTenantScheduler({ perTenantBurst: 1 });
    expect(() => scheduler.enqueue('', 'job')).toThrow(/tenant/);
  });
});
