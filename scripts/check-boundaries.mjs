import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const serverRoots = [
  'apps/api',
  'apps/workers',
  'packages/domain',
  'packages/transaction-builder',
  'packages/txline-adapter',
];
const sourceExtension = /\.(?:[cm]?js|tsx?)$/u;
const forbiddenImport = /(?:from\s+|import\s*\()['"]@datafinops\/wallet-client(?:\/[^'"]*)?['"]/u;
const violations = [];

async function visit(relativeDirectory) {
  const absoluteDirectory = path.join(root, relativeDirectory);
  let entries;
  try {
    entries = await readdir(absoluteDirectory, { withFileTypes: true });
  } catch (error) {
    if (error?.code === 'ENOENT') return;
    throw error;
  }
  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isDirectory()) await visit(relativePath);
    else if (sourceExtension.test(entry.name)) {
      const source = await readFile(path.join(root, relativePath), 'utf8');
      if (forbiddenImport.test(source)) violations.push(relativePath.replaceAll('\\', '/'));
    }
  }
}

await Promise.all(serverRoots.map(visit));
if (violations.length > 0) {
  console.error(`Browser wallet boundary violated by:\n${violations.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log('Browser/server dependency boundary passed.');
}
