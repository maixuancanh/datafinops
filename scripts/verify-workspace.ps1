[CmdletBinding()]
param([switch]$SkipBuild)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$artifactDirectory = Join-Path $root 'artifacts/bootstrap'
New-Item -ItemType Directory -Path $artifactDirectory -Force | Out-Null

function Invoke-Gate([string]$Name, [scriptblock]$Command) {
    Write-Host "[gate] $Name"
    & $Command
    if ($LASTEXITCODE -ne 0) { throw "$Name failed with exit code $LASTEXITCODE" }
}

Push-Location $root
try {
    $node = (& node --version).Trim()
    $pnpm = (& pnpm --version).Trim()
    if ($node -ne 'v24.14.1') { throw "Expected Node v24.14.1; observed $node" }
    if ($pnpm -ne '11.5.2') { throw "Expected pnpm 11.5.2; observed $pnpm" }
    Invoke-Gate 'frozen install' { pnpm install --frozen-lockfile }
    Invoke-Gate 'lint' { pnpm lint }
    Invoke-Gate 'typecheck' { pnpm typecheck }
    Invoke-Gate 'tests' { pnpm test }
    Invoke-Gate 'security configuration' { pnpm test:security }
    Invoke-Gate 'compose configuration' { docker compose --env-file .env.example config --quiet }
    if (-not $SkipBuild) { Invoke-Gate 'production build' { pnpm build } }

    $evidence = [ordered]@{
        product = 'DataFinOps'
        observedAt = (Get-Date).ToUniversalTime().ToString('o')
        branch = (& git branch --show-current).Trim()
        commit = (& git rev-parse HEAD).Trim()
        node = $node
        pnpm = $pnpm
        mode = 'sandbox'
        liveWrite = $false
        status = 'passed'
        buildIncluded = -not $SkipBuild
    }
    $evidence | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $artifactDirectory 'latest.json') -Encoding utf8
    Write-Host "Workspace verification passed. Evidence: $artifactDirectory/latest.json"
} finally {
    Pop-Location
}
