import { Money, normalizeCurrency } from './money.js';

export type RoundingMode = 'HALF_EVEN' | 'FLOOR' | 'CEILING' | 'TRUNCATE';

export function roundRational(
  numerator: bigint,
  denominator: bigint,
  mode: RoundingMode,
): bigint {
  if (denominator === 0n) throw new RangeError('Rational denominator cannot be zero');
  if (denominator < 0n) return roundRational(-numerator, -denominator, mode);
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;
  if (remainder === 0n || mode === 'TRUNCATE') return quotient;
  if (mode === 'FLOOR') return remainder < 0n ? quotient - 1n : quotient;
  if (mode === 'CEILING') return remainder > 0n ? quotient + 1n : quotient;
  const comparison = (remainder < 0n ? -remainder : remainder) * 2n - denominator;
  if (comparison < 0n) return quotient;
  const direction = remainder < 0n ? -1n : 1n;
  if (comparison > 0n) return quotient + direction;
  return quotient % 2n === 0n ? quotient : quotient + direction;
}

export interface ConversionRate {
  readonly fromCurrency: string;
  readonly toCurrency: string;
  readonly numerator: bigint;
  readonly denominator: bigint;
  readonly sourceRef: string;
  readonly observedAt: string;
  readonly rounding: RoundingMode;
}

export function convertMoney(money: Money, rate: ConversionRate) {
  const fromCurrency = normalizeCurrency(rate.fromCurrency);
  const toCurrency = normalizeCurrency(rate.toCurrency);
  if (money.currency !== fromCurrency) throw new TypeError('Conversion source currency mismatch');
  if (!rate.sourceRef.trim()) throw new TypeError('Conversion source reference is required');
  const observed = new Date(rate.observedAt);
  if (Number.isNaN(observed.valueOf()) || observed.toISOString() !== rate.observedAt) {
    throw new TypeError('Conversion observedAt must be a canonical UTC instant');
  }
  const converted = Money.of(
    toCurrency,
    roundRational(money.minorUnits * rate.numerator, rate.denominator, rate.rounding),
  );
  return Object.freeze({
    money: converted,
    evidence: Object.freeze({
      sourceRef: rate.sourceRef,
      observedAt: rate.observedAt,
      fromCurrency,
      toCurrency,
      rate: Object.freeze({
        numerator: rate.numerator.toString(),
        denominator: rate.denominator.toString(),
      }),
      rounding: rate.rounding,
    }),
  });
}
