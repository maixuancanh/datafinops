import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

// Every getByTestId call below resolves a stable data-testid from ux-spec.md.
type DemoConfig = {
  baseUrl: string;
  outputDir: string;
  tenantSlug: string;
  demoUser: string;
  demoPassword: string;
  planningPeriodRef: string;
  headless: boolean;
  slowMoMs: number;
  maxDurationSeconds: number;
  viewport: { width: number; height: number };
};

const configPath = process.env.DEMO_CONFIG ?? path.join(__dirname, 'demo-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8')) as DemoConfig;
const baseURL = process.env.BASE_URL ?? config.baseUrl;
const outputDir = path.resolve(__dirname, '..', config.outputDir);
const prohibitedSecretLabels =
  /private key|seed phrase|mnemonic|keystore|recovery phrase|signing passphrase/i;

async function mark(page: Page, name: string): Promise<void> {
  await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: false });
}

test.use({
  baseURL,
  viewport: config.viewport,
  video: { mode: 'on', size: config.viewport },
  trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
});

test('records the deterministic non-custodial DataFinOps walkthrough', async ({
  page,
}, testInfo) => {
  test.setTimeout((config.maxDurationSeconds + 30) * 1_000);
  fs.mkdirSync(outputDir, { recursive: true });
  const startedAt = Date.now();

  await page.goto(`/demo/login?tenant=${encodeURIComponent(config.tenantSlug)}`);
  await page.getByLabel('Email').fill(config.demoUser);
  await page.getByLabel('Password').fill(config.demoPassword);
  await page.getByRole('button', { name: 'Enter sandbox' }).click();
  await expect(page.getByText('Crescent Markets Sandbox')).toBeVisible();
  await expect(page.getByText('Live write disabled')).toBeVisible();
  await expect(page.getByTestId('current-subscription')).toContainText('Synthetic current cost');
  await mark(page, 'df-01-portfolio');

  await page.goto('/demo/connections/txline');
  await expect(page.getByTestId('connection-verified')).toContainText('VERIFIED READ');
  await expect(page.getByTestId('connection-verified')).toContainText('Program');
  await expect(page.getByTestId('connection-verified')).toContainText('Public wallet reference');
  await mark(page, 'df-02-connection');

  await page.goto('/demo/usage');
  await page.getByTestId('usage-import').click();
  await expect(page.getByTestId('usage-import')).toContainText('Imported');
  await expect(page.getByText('Unallocated cost')).toBeVisible();
  await page.goto('/demo/requirements');
  await expect(page.getByTestId('coverage-requirements')).toContainText('HARD');
  await mark(page, 'df-03-inputs');

  await page.goto(`/demo/scenarios?period=${encodeURIComponent(config.planningPeriodRef)}`);
  await page.getByTestId('run-optimizer').click();
  await expect(page.getByTestId('recommendation-card')).toBeVisible({ timeout: 30_000 });
  await expect(page.getByTestId('hard-constraint-status')).toContainText('PASSED');
  await expect(page.getByTestId('recommendation-card')).toContainText('Synthetic forecast');
  const firstSnapshotHash = await page.getByTestId('snapshot-hash').textContent();
  await mark(page, 'df-04-recommendation');

  await page.getByTestId('add-hard-constraint').click();
  await page.getByRole('option', { name: 'Knockout fixture — required' }).click();
  await page.getByTestId('run-optimizer').click();
  await expect(page.getByTestId('hard-constraint-status')).toContainText('PASSED');
  await expect(page.getByTestId('recommendation-card')).toContainText('Knockout fixture covered');
  await expect(page.getByTestId('snapshot-hash')).not.toHaveText(firstSnapshotHash ?? '');
  await mark(page, 'df-05-hard-constraint');

  await page.getByTestId('proposal-create').click();
  await expect(page.getByTestId('procurement-approve')).toBeVisible();
  await page.getByTestId('procurement-approve').click();
  await page.getByTestId('switch-finance-role').click();
  await page.getByTestId('finance-approve').click();
  await expect(page.getByText('READY TO SIGN')).toBeVisible();
  await expect(page.getByTestId('proposal-hash')).toBeVisible();
  await mark(page, 'df-06-approved');

  await page.getByTestId('open-signing-review').click();
  await expect(page.getByTestId('transaction-summary')).toContainText('SANDBOX');
  await expect(page.getByTestId('transaction-summary')).toContainText('Unsigned transaction');
  await expect(page.getByTestId('transaction-summary')).toContainText('Synthetic amount');
  await expect(page.locator('body')).not.toContainText(prohibitedSecretLabels);
  await page.getByTestId('demo-signer').click();
  await expect(page.getByText('Simulation receipt submitted')).toBeVisible();
  await mark(page, 'df-07-demo-signer');

  await page.getByTestId('advance-transaction').click();
  await expect(page.getByTestId('transaction-confirmed')).toContainText('CONFIRMED');
  await page.getByTestId('run-entitlement-verification').click();
  await expect(page.getByTestId('entitlement-verified')).toContainText('VERIFIED ACTIVE');
  await expect(page.getByTestId('entitlement-verified')).toContainText('1 logical operation');
  await mark(page, 'df-08-entitlement');

  await page.goto(`/demo/savings/${encodeURIComponent(config.planningPeriodRef)}`);
  await page.getByTestId('close-savings-period').click();
  await expect(page.getByTestId('realized-savings')).toContainText('REALIZED');
  await expect(page.getByTestId('realized-savings')).toContainText('Synthetic actual cost');
  await expect(page.getByTestId('audit-evidence')).toBeVisible();
  await mark(page, 'df-09-savings');

  await page.goto('/demo/audit/proposal-chain');
  await expect(page.getByTestId('audit-evidence')).toContainText('Replay matched');
  await expect(page.getByText('Live write disabled')).toBeVisible();
  await mark(page, 'df-10-audit');

  const elapsedSeconds = (Date.now() - startedAt) / 1_000;
  expect(elapsedSeconds).toBeLessThanOrEqual(config.maxDurationSeconds);
  fs.writeFileSync(
    path.join(outputDir, 'execution-report.json'),
    JSON.stringify(
      {
        product: 'DataFinOps',
        baseURL,
        planningPeriodRef: config.planningPeriodRef,
        mode: 'SANDBOX',
        fundedTransaction: false,
        liveWrite: false,
        elapsedSeconds,
        completedAt: new Date().toISOString(),
        status: 'passed',
        playwrightOutputDir: testInfo.outputDir,
      },
      null,
      2,
    ),
  );
});
