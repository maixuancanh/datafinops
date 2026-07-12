import { describe, expect, it } from 'vitest';

import {
  AccountingPeriod,
  ExactDecimal,
  MAX_MINOR_UNITS,
  Money,
  convertMoney,
  roundRational,
} from '../src/index.js';

describe('Money', () => {
  it('uses exact bigint minor units and immutable uppercase currency', () => {
    const money = Money.of('usd', 12_345n);
    expect(money.toJSON()).toEqual({ currency: 'USD', minorUnits: '12345' });
    expect(money.add(Money.of('USD', 55n)).minorUnits).toBe(12_400n);
    expect(Object.isFrozen(money)).toBe(true);
  });

  it('rejects currency mismatch and invalid currency codes', () => {
    expect(() => Money.of('US', 1n)).toThrow(/currency/i);
    expect(() => Money.of('USD', 1n).add(Money.of('EUR', 1n))).toThrow(/currency/i);
  });

  it('enforces signed 128-bit storage bounds', () => {
    expect(Money.of('USD', MAX_MINOR_UNITS).minorUnits).toBe(MAX_MINOR_UNITS);
    expect(() => Money.of('USD', MAX_MINOR_UNITS + 1n)).toThrow(/overflow/i);
    expect(() => Money.of('USD', MAX_MINOR_UNITS).add(Money.of('USD', 1n))).toThrow(/overflow/i);
  });
});

describe('ExactDecimal and rounding', () => {
  it('normalizes declared scale without binary floating point', () => {
    expect(ExactDecimal.parse('0012.34', 4).toJSON()).toEqual({ decimal: '12.3400', scale: 4 });
    expect(() => ExactDecimal.parse('1.234', 2)).toThrow(/scale/i);
  });

  it('implements half-even and directional rational rounding', () => {
    expect(roundRational(5n, 2n, 'HALF_EVEN')).toBe(2n);
    expect(roundRational(7n, 2n, 'HALF_EVEN')).toBe(4n);
    expect(roundRational(-5n, 2n, 'FLOOR')).toBe(-3n);
    expect(roundRational(-5n, 2n, 'CEILING')).toBe(-2n);
  });
});

describe('conversion provenance', () => {
  it('converts with an exact rational rate and preserves source evidence', () => {
    const converted = convertMoney(Money.of('USD', 10_001n), {
      fromCurrency: 'USD',
      toCurrency: 'EUR',
      numerator: 9n,
      denominator: 10n,
      sourceRef: 'ecb-demo-2026-08-01',
      observedAt: '2026-08-01T12:00:00.000Z',
      rounding: 'HALF_EVEN',
    });
    expect(converted.money.toJSON()).toEqual({ currency: 'EUR', minorUnits: '9001' });
    expect(converted.evidence).toMatchObject({
      sourceRef: 'ecb-demo-2026-08-01',
      rate: { numerator: '9', denominator: '10' },
    });
  });

  it('rejects missing/mismatched source currency and zero denominator', () => {
    const usd = Money.of('USD', 100n);
    expect(() =>
      convertMoney(usd, {
        fromCurrency: 'EUR',
        toCurrency: 'USD',
        numerator: 1n,
        denominator: 1n,
        sourceRef: 'source',
        observedAt: '2026-08-01T12:00:00.000Z',
        rounding: 'HALF_EVEN',
      }),
    ).toThrow(/source currency/i);
  });
});

describe('AccountingPeriod', () => {
  it('uses a half-open UTC interval and exact elapsed milliseconds', () => {
    const period = AccountingPeriod.create(
      '2026-08-01T00:00:00.000Z',
      '2026-09-01T00:00:00.000Z',
    );
    expect(period.contains('2026-08-01T00:00:00.000Z')).toBe(true);
    expect(period.contains('2026-09-01T00:00:00.000Z')).toBe(false);
    expect(period.durationMilliseconds).toBe(31n * 24n * 60n * 60n * 1000n);
  });

  it('rejects non-canonical, empty, or reversed periods', () => {
    expect(() => AccountingPeriod.create('2026-08-01', '2026-09-01')).toThrow(/canonical/i);
    expect(() =>
      AccountingPeriod.create('2026-09-01T00:00:00.000Z', '2026-08-01T00:00:00.000Z'),
    ).toThrow(/after/i);
  });
});
