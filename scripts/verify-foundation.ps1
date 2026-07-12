[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$artifact = Join-Path $root 'artifacts\foundation'
New-Item -ItemType Directory -Path $artifact -Force | Out-Null
$startedAt = (Get-Date).ToUniversalTime()

function Invoke-Gate([string]$Name, [scriptblock]$Command) {
    Write-Host "[foundation] $Name"
    & $Command
    if ($LASTEXITCODE -ne 0) { throw "$Name failed with exit code $LASTEXITCODE" }
}

Push-Location $root
try {
    & (Join-Path $PSScriptRoot 'start-test-postgres.ps1')
    $env:TEST_DATABASE_URL = 'postgresql://datafinops@127.0.0.1:55432/datafinops_test'
    Invoke-Gate 'frozen install' { pnpm.cmd install --frozen-lockfile --offline }
    Invoke-Gate 'contract lint and compatibility' { pnpm.cmd contracts:lint }
    Invoke-Gate 'contract test packages' { pnpm.cmd --filter '@datafinops/contracts' test }
    Invoke-Gate 'domain tests' { pnpm.cmd --filter '@datafinops/domain' test }
    Invoke-Gate 'authorization tests' { pnpm.cmd --filter '@datafinops/auth' test }
    Invoke-Gate 'worker queue tests' { pnpm.cmd --filter '@datafinops/workers' test }
    Invoke-Gate 'prohibited material tests' { pnpm.cmd --filter '@datafinops/security' test }
    Invoke-Gate 'database and outbox integration' {
        pnpm.cmd --filter '@datafinops/tests' test:integration
    }
    Invoke-Gate 'workspace typecheck' { pnpm.cmd typecheck }
    Invoke-Gate 'workspace lint' { pnpm.cmd lint }
    Invoke-Gate 'production dependency audit' { pnpm.cmd audit --prod --audit-level high }
    & (Join-Path $PSScriptRoot 'restore-test.ps1')

    $report = [ordered]@{
        product = 'DataFinOps'; phase = 'foundation'; startedAt = $startedAt.ToString('o')
        completedAt = (Get-Date).ToUniversalTime().ToString('o'); commit = (& git rev-parse HEAD).Trim()
        database = 'native-postgresql-16-isolated'; redis = 'native-windows'; objectStorage = 's3rver'
        liveWrite = $false; status = 'passed'
    }
    $report | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $artifact 'verification-report.json') -Encoding utf8
    Write-Host "Foundation verification passed: $artifact"
} finally {
    & (Join-Path $PSScriptRoot 'stop-test-postgres.ps1')
    Pop-Location
}
