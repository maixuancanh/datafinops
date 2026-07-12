import { describe, expect, it } from 'vitest';
import { optimize } from '@datafinops/optimizer';
describe('optimizer replay', () => { it('is identical for identical snapshots', () => { const request = { minCoverage: 80, budgetMinor: 100, candidates: [{ id: 'a', costMinor: 50, coverage: 90, latencyMs: 10, headroomMinor: 1 }] }; expect(optimize(request)).toEqual(optimize(request)); }); });
