import { createHash } from 'node:crypto';

export interface DeterministicIdFactory {
  next(label?: string): string;
}

export function createDeterministicIdFactory(
  seed: string,
  namespace = 'fixture',
): DeterministicIdFactory {
  let counter = 0;
  return Object.freeze({
    next(label = 'id'): string {
      const digest = createHash('sha256')
        .update(`${namespace}\0${seed}\0${counter++}\0${label}`, 'utf8')
        .digest('hex')
        .slice(0, 32);
      return `${namespace}_${digest}`;
    },
  });
}
