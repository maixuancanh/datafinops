import { createHash } from 'node:crypto';
export function financeExport(rows: readonly Readonly<Record<string, unknown>>[]): {
  readonly content: string;
  readonly contentHash: string;
  readonly expiresAt: string;
} {
  const content = JSON.stringify(rows);
  return {
    content,
    contentHash: createHash('sha256').update(content).digest('hex'),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  };
}
