export class ExactDecimal {
  readonly unscaled: bigint;
  readonly scale: number;

  private constructor(unscaled: bigint, scale: number) {
    this.unscaled = unscaled;
    this.scale = scale;
    Object.freeze(this);
  }

  static parse(value: string, scale: number): ExactDecimal {
    if (!Number.isSafeInteger(scale) || scale < 0 || scale > 18) {
      throw new RangeError('Declared scale must be an integer from 0 through 18');
    }
    const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(value);
    if (!match) throw new TypeError('Decimal must be an exact base-10 string');
    const fraction = match[3] ?? '';
    if (fraction.length > scale) throw new RangeError('Decimal precision exceeds declared scale');
    const digits = `${(match[2] ?? '0').replace(/^0+(?=\d)/, '')}${fraction.padEnd(scale, '0')}`;
    const sign = match[1] === '-' ? -1n : 1n;
    return new ExactDecimal(sign * BigInt(digits || '0'), scale);
  }

  toJSON(): { decimal: string; scale: number } {
    const negative = this.unscaled < 0n;
    const absolute = (negative ? -this.unscaled : this.unscaled)
      .toString()
      .padStart(this.scale + 1, '0');
    const decimal =
      this.scale === 0
        ? absolute
        : `${absolute.slice(0, -this.scale)}.${absolute.slice(-this.scale)}`;
    return { decimal: `${negative ? '-' : ''}${decimal}`, scale: this.scale };
  }
}
