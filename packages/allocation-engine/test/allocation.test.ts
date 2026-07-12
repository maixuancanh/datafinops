import { describe, expect, it } from 'vitest';
import { allocate } from '../src/index.js';

describe('versioned allocation', () => {
  it('reconciles exact cost with deterministic largest remainder', () => {
    const result = allocate({ costMinor: 100, mappings: [{ targetId: 'b', weight: 1 }, { targetId: 'a', weight: 2 }] });
    expect(result.allocations).toEqual([{ targetId: 'a', amountMinor: 67 }, { targetId: 'b', amountMinor: 33 }]);
    expect(result.totalMinor).toBe(100);
  });
  it('excludes retired mappings and reports explicit unallocated cost', () => {
    const result = allocate({ costMinor: 100, mappings: [{ targetId: 'retired', weight: 1, retired: true }] });
    expect(result.allocations).toEqual([]);
    expect(result.unallocatedMinor).toBe(100);
  });
});
