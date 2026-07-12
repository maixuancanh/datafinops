import { describe, expect, it } from 'vitest';
import { savingsDelta } from '@datafinops/savings-ledger';
describe('savings ledger property', () => { it('delta is antisymmetric over baseline and actual', () => { for (let i = 0; i < 20; i += 1) expect(savingsDelta({ baselineMinor: i, actualMinor: i + 1 })).toBe(-savingsDelta({ baselineMinor: i + 1, actualMinor: i })); }); });
