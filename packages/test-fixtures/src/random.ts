import { createHash } from 'node:crypto';

export interface SeededRandom {
  next(): number;
  int(minimum: number, maximum: number): number;
  fork(label: string): SeededRandom;
}

export function createSeededRandom(seed: string): SeededRandom {
  let counter = 0;
  const next = (): number => {
    const bytes = createHash('sha256').update(`${seed}\0${counter++}`, 'utf8').digest();
    return bytes.readUInt32BE(0) / 0x1_0000_0000;
  };
  return Object.freeze({
    next,
    int(minimum: number, maximum: number): number {
      if (!Number.isSafeInteger(minimum) || !Number.isSafeInteger(maximum) || maximum < minimum) {
        throw new RangeError('Integer range must contain safe integers with maximum >= minimum');
      }
      return minimum + Math.floor(next() * (maximum - minimum + 1));
    },
    fork: (label: string): SeededRandom => createSeededRandom(`${seed}\0${label}`),
  });
}
