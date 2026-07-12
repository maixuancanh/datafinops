const prohibitedName =
  /^(?:x[-_])?(?:private[_-]?key|seed[_-]?phrase|mnemonic|keystore|recovery[_-]?phrase|signing[_-]?passphrase|raw[_-]?signer)$/i;
const prohibitedContent =
  /(?:private[_-]?key|seed[_-]?phrase|mnemonic|keystore|recovery[_-]?phrase|signing[_-]?passphrase|raw[_-]?signer)\s*[:=]/i;

export class ProhibitedMaterialError extends Error {
  readonly reasonCode = 'PROHIBITED_SIGNING_MATERIAL';

  constructor() {
    super('Request contains prohibited signing material');
    this.name = 'ProhibitedMaterialError';
  }
}

export interface SafeSink {
  record(entry: Readonly<Record<string, unknown>>): void;
  entries(): readonly Readonly<Record<string, unknown>>[];
}

export function createSafeSink(): SafeSink {
  const values: Readonly<Record<string, unknown>>[] = [];
  return Object.freeze({
    record(entry: Readonly<Record<string, unknown>>) {
      values.push(Object.freeze({ ...entry }));
    },
    entries() {
      return structuredClone(values);
    },
  });
}

function inspect(value: unknown, key: string | undefined, seen: WeakSet<object>): void {
  if (key && prohibitedName.test(key)) throw new ProhibitedMaterialError();
  if (typeof value === 'string' && prohibitedContent.test(value)) {
    throw new ProhibitedMaterialError();
  }
  if (value === null || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);
  if (Array.isArray(value)) {
    for (const child of value) inspect(child, undefined, seen);
  } else {
    for (const [childKey, child] of Object.entries(value)) inspect(child, childKey, seen);
  }
}

export function assertNoProhibitedMaterial(
  value: unknown,
  options: { readonly correlationId?: string; readonly sink?: SafeSink } = {},
): void {
  try {
    inspect(value, undefined, new WeakSet());
  } catch (error) {
    if (error instanceof ProhibitedMaterialError) {
      options.sink?.record({
        level: 'security',
        reasonCode: error.reasonCode,
        correlationId: options.correlationId ?? 'unavailable',
      });
    }
    throw error;
  }
}
