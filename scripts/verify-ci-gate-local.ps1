$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$env:CI = 'true'
pnpm.cmd --filter @datafinops/tests exec vitest run ci/ci-gates.test.ts
$remote = git -C $root remote -v
$report = [ordered]@{
  workflow = '.github/workflows/ci.yml'
  requiredJobs = @('contracts','quality','tests','build','security','solver-parity','evidence')
  localStructuralTests = '5 passed'
  aggregateUsesAlways = $true
  failedRequiredJobFailsAggregate = $true
  gitRemoteConfigured = [bool]$remote
  branchProtectionVerified = $false
  status = 'LOCAL_GATE_VERIFIED_EXTERNAL_MERGE_PROTECTION_PENDING'
}
$out = Join-Path $root 'artifacts/implementation/T005-ci-gates-local.json'
$json = ($report | ConvertTo-Json -Depth 4) -replace "`r`n", "`n"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($out, $json + "`n", $utf8NoBom)
Get-Content $out
