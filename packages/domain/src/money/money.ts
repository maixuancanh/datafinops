export const MAX_MINOR_UNITS = (1n << 127n) - 1n;
export const MIN_MINOR_UNITS = -(1n << 127n);

export function normalizeCurrency(currency: string): string {
  const normalized = currency.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9]{2,7}$/.test(normalized)) {
    throw new TypeError('Currency must be a 3-8 character uppercase alphanumeric code');
  }
  return normalized;
}

function bounded(value: bigint): bigint {
  if (value < MIN_MINOR_UNITS || value > MAX_MINOR_UNITS) {
    throw new RangeError('Money minor-unit overflow outside signed 128-bit bounds');
  }
  return value;
}

export class Money {
  readonly currency: string;
  readonly minorUnits: bigint;

  private constructor(currency: string, minorUnits: bigint) {
    this.currency = currency;
    this.minorUnits = minorUnits;
    Object.freeze(this);
  }

  static of(currency: string, minorUnits: bigint): Money {
    if (typeof minorUnits !== 'bigint') throw new TypeError('minorUnits must be bigint');
    return new Money(normalizeCurrency(currency), bounded(minorUnits));
  }

  private requireCurrency(other: Money): void {
    if (this.currency !== other.currency) throw new TypeError('Money currency mismatch');
  }

  add(other: Money): Money {
    this.requireCurrency(other);
    return Money.of(this.currency, bounded(this.minorUnits + other.minorUnits));
  }

  subtract(other: Money): Money {
    this.requireCurrency(other);
    return Money.of(this.currency, bounded(this.minorUnits - other.minorUnits));
  }

  negate(): Money {
    return Money.of(this.currency, bounded(-this.minorUnits));
  }

  toJSON(): { currency: string; minorUnits: string } {
    return { currency: this.currency, minorUnits: this.minorUnits.toString() };
  }
}
