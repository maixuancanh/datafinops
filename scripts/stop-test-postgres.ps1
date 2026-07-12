[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$data = Join-Path $root '.local-runtime\postgres-test'
$pgCtl = 'C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe'
if (Test-Path -LiteralPath (Join-Path $data 'PG_VERSION')) {
    & $pgCtl -D $data status *> $null
    if ($LASTEXITCODE -eq 0) {
        & $pgCtl -D $data stop -m fast
        if ($LASTEXITCODE -ne 0) { throw "pg_ctl stop failed with exit code $LASTEXITCODE" }
    }
}
Write-Host 'Stopped isolated DataFinOps PostgreSQL cluster.'
