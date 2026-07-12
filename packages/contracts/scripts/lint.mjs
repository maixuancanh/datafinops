import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, ['./scripts/generate.mjs', '--check'], {
  cwd: process.cwd(),
  stdio: 'inherit',
});
process.exitCode = result.status ?? 1;
