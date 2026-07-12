import { describe, expect, it } from 'vitest';
import { bruteForceBest } from '../src/brute-force-optimizer.js';
describe('brute-force optimizer oracle', () => { it('selects lowest feasible cost then stable id', () => expect(bruteForceBest({ minCoverage: 80, budgetMinor: 100, candidates: [{ id: 'b', costMinor: 50, coverage: 90 }, { id: 'a', costMinor: 50, coverage: 90 }, { id: 'x', costMinor: 20, coverage: 70 }] })).toEqual({ id: 'a', costMinor: 50, coverage: 90 })); });
