export type ExactMoney = MinorUnitMoney | DecimalMoney;

export interface MinorUnitMoney {
  readonly representation: 'minor-unit';
  readonly currency: string;
  readonly minorUnits: bigint;
}

export interface DecimalMoney {
  readonly representation: 'decimal';
  readonly currency: string;
  readonly decimal: string;
  readonly scale: number;
}

function normalizeCurrency(currency: string): string {
  const normalized = currency.trim().toUpperCase();
  if (!/^[A-Z][A-Z0-9]{2,11}$/.test(normalized)) {
    throw new TypeError('Currency must be a 3-12 character alphanumeric code');
  }
  return normalized;
}

export function minorUnitMoney(currency: string, minorUnits: bigint): MinorUnitMoney {
  if (typeof minorUnits !== 'bigint') throw new TypeError('minorUnits must be a bigint');
  return Object.freeze({
    representation: 'minor-unit',
    currency: normalizeCurrency(currency),
    minorUnits,
  });
}

export function decimalMoney(currency: string, decimal: string, scale: number): DecimalMoney {
  if (!Number.isSafeInteger(scale) || scale < 0)
    throw new TypeError('scale must be a non-negative integer');
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(decimal);
  if (match === null) throw new TypeError('decimal must be an exact base-10 string');
  const fraction = match[3] ?? '';
  if (fraction.length > scale) throw new RangeError('decimal precision exceeds declared scale');
  const sign = match[1] ?? '';
  const integer = (match[2] ?? '0').replace(/^0+(?=\d)/, '');
  const normalized =
    scale === 0 ? `${sign}${integer}` : `${sign}${integer}.${fraction.padEnd(scale, '0')}`;
  return Object.freeze({
    representation: 'decimal',
    currency: normalizeCurrency(currency),
    decimal: normalized,
    scale,
  });
}
