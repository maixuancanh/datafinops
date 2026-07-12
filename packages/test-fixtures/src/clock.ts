export interface FixedClock {
  now(): Date;
  nowIso(): string;
}

const UTC_MILLISECOND_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

export function createFixedClock(instant: string): FixedClock {
  if (!UTC_MILLISECOND_ISO.test(instant) || Number.isNaN(Date.parse(instant))) {
    throw new TypeError('Fixed clock instant must be a valid UTC ISO timestamp with milliseconds');
  }

  const epochMilliseconds = Date.parse(instant);
  const iso = new Date(epochMilliseconds).toISOString();
  return Object.freeze({
    now: (): Date => new Date(epochMilliseconds),
    nowIso: (): string => iso,
  });
}
