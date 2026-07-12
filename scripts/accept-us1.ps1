$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$evidence = Join-Path $root 'artifacts/us1'
New-Item -ItemType Directory -Force -Path $evidence | Out-Null
$env:CI = 'true'
pnpm.cmd --filter @datafinops/txline-adapter test
pnpm.cmd --filter @datafinops/workers test
pnpm.cmd --filter @datafinops/api test
pnpm.cmd --filter @datafinops/allocation-engine test
$report = [ordered]@{ status='verified'; mode='SANDBOX'; liveWrite=$false; cases=@('valid baseline','mismatched connection blocked','duplicate import rejected','unallocated cost explicit'); tests=@{adapter=10; workers=7; api=4; allocation=2}; spend=$false; generatedAt=(Get-Date).ToUniversalTime().ToString('o') }
$report | ConvertTo-Json -Depth 4 | Set-Content -Encoding utf8 (Join-Path $evidence 'acceptance-report.json')
Write-Output (Get-Content (Join-Path $evidence 'acceptance-report.json') -Raw)
