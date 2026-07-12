const CANONICAL_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function epoch(value: string): number {
  const parsed = Date.parse(value);
  if (
    !CANONICAL_INSTANT.test(value) ||
    Number.isNaN(parsed) ||
    new Date(parsed).toISOString() !== value
  ) {
    throw new TypeError('Accounting period boundary must be a canonical UTC instant');
  }
  return parsed;
}

export class AccountingPeriod {
  readonly start: string;
  readonly end: string;
  readonly durationMilliseconds: bigint;
  readonly #startEpoch: number;
  readonly #endEpoch: number;

  private constructor(start: string, end: string, startEpoch: number, endEpoch: number) {
    this.start = start;
    this.end = end;
    this.#startEpoch = startEpoch;
    this.#endEpoch = endEpoch;
    this.durationMilliseconds = BigInt(endEpoch - startEpoch);
    Object.freeze(this);
  }

  static create(start: string, end: string): AccountingPeriod {
    const startEpoch = epoch(start);
    const endEpoch = epoch(end);
    if (endEpoch <= startEpoch) throw new RangeError('Accounting period end must be after start');
    return new AccountingPeriod(start, end, startEpoch, endEpoch);
  }

  contains(instant: string): boolean {
    const value = epoch(instant);
    return value >= this.#startEpoch && value < this.#endEpoch;
  }
}
