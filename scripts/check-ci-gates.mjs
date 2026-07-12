import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';

export const requiredCiJobs = Object.freeze([
  'contracts',
  'quality',
  'tests',
  'build',
  'security',
  'solver-parity',
  'evidence',
]);

export function validateCiWorkflow(source) {
  const errors = [];
  let workflow;
  try {
    workflow = parse(source);
  } catch (error) {
    return [`workflow YAML is invalid: ${error instanceof Error ? error.message : String(error)}`];
  }
  const jobs = workflow?.jobs;
  if (!jobs || typeof jobs !== 'object') return ['workflow.jobs is required'];
  for (const job of requiredCiJobs) {
    if (!jobs[job]) errors.push(`jobs.${job} is required`);
  }
  const aggregate = jobs.aggregate;
  if (!aggregate || typeof aggregate !== 'object') return [...errors, 'jobs.aggregate is required'];
  if (aggregate.if !== 'always()') errors.push('aggregate must use if: always()');
  const needs = Array.isArray(aggregate.needs) ? aggregate.needs : [];
  for (const job of requiredCiJobs) {
    if (!needs.includes(job)) errors.push(`aggregate.needs must include ${job}`);
  }
  return errors;
}

export function assertSuccessfulNeeds(needs) {
  const failures = Object.entries(needs)
    .filter(([, value]) => value?.result !== 'success')
    .map(([name, value]) => `${name}=${value?.result ?? 'missing'}`);
  if (failures.length > 0)
    throw new Error(`Required CI jobs did not succeed: ${failures.join(', ')}`);
}

export function validateBranchProtectionEvidence(evidence) {
  const errors = [];
  if (!evidence?.gitRemoteConfigured) errors.push('git remote must be configured');
  if (!evidence?.remoteUrl) errors.push('remoteUrl is required');
  if (!evidence?.targetBranch) errors.push('targetBranch is required');
  const checks = Array.isArray(evidence?.requiredStatusChecks) ? evidence.requiredStatusChecks : [];
  if (!checks.includes('Required aggregate gate'))
    errors.push('branch protection must require Required aggregate gate');
  if (evidence?.failedRequiredJobBlocksMerge !== true)
    errors.push('failed required job must be observed blocking merge');
  if (evidence?.fixedAggregateUnblocksMerge !== true)
    errors.push('fixed aggregate gate must be observed unblocking merge');
  return errors;
}

async function main() {
  const workflowPath = process.argv[2] ?? '.github/workflows/ci.yml';
  const errors = validateCiWorkflow(await readFile(workflowPath, 'utf8'));
  if (errors.length > 0) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`CI workflow aggregate covers ${requiredCiJobs.length} required jobs.`);
  }
}

if (import.meta.url === `file:///${process.argv[1]?.replaceAll('\\', '/')}`) await main();
