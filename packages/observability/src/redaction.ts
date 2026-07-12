const secretKey =
  /(?:authorization|credential|keystore|mnemonic|passphrase|password|private.?key|recovery.?phrase|secret|seed.?phrase|token)/i;
const financeKey = /(?:amount|budget|cost|minor.?units|revenue|savings|spend)/i;
const sensitiveText =
  /(?:authorization|credential|mnemonic|password|private.?key|secret|seed.?phrase)\s*[=:]\s*[^\s,;]+/gi;

export function redactText(value: string): string {
  return value.replace(sensitiveText, '[REDACTED]');
}

export function redact(value: unknown, key = ''): unknown {
  if (secretKey.test(key)) return '[REDACTED]';
  if (financeKey.test(key)) return '[FINANCE_REDACTED]';
  if (typeof value === 'string') return redactText(value);
  if (Array.isArray(value)) return value.map((item) => redact(item));
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        redact(childValue, childKey),
      ]),
    );
  }
  return value;
}
