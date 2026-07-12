[CmdletBinding()]
param([int]$Port = 55432, [string]$Database = 'datafinops_test')

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$data = Join-Path $root '.local-runtime\postgres-test'
$logs = Join-Path $root '.local-runtime\logs'
$bin = 'C:\Program Files\PostgreSQL\16\bin'
New-Item -ItemType Directory -Path $logs -Force | Out-Null
if (-not (Test-Path -LiteralPath (Join-Path $bin 'initdb.exe'))) { throw 'PostgreSQL 16 native binaries are required.' }
if (-not (Test-Path -LiteralPath (Join-Path $data 'PG_VERSION'))) {
    & (Join-Path $bin 'initdb.exe') -D $data -A trust -U datafinops --no-locale --encoding=UTF8
    if ($LASTEXITCODE -ne 0) { throw "initdb failed with exit code $LASTEXITCODE" }
}
& (Join-Path $bin 'pg_ctl.exe') -D $data status *> $null
if ($LASTEXITCODE -ne 0) {
    & (Join-Path $bin 'pg_ctl.exe') -D $data -l (Join-Path $logs 'postgres-test.log') -o "-p $Port -h 127.0.0.1" start
    if ($LASTEXITCODE -ne 0) { throw "pg_ctl start failed with exit code $LASTEXITCODE" }
}
$exists = (& (Join-Path $bin 'psql.exe') -h 127.0.0.1 -p $Port -U datafinops -d postgres -Atc "SELECT 1 FROM pg_database WHERE datname='$Database'").Trim()
if ($exists -ne '1') {
    & (Join-Path $bin 'createdb.exe') -h 127.0.0.1 -p $Port -U datafinops $Database
    if ($LASTEXITCODE -ne 0) { throw "createdb failed with exit code $LASTEXITCODE" }
}
& (Join-Path $bin 'pg_isready.exe') -h 127.0.0.1 -p $Port -d $Database
if ($LASTEXITCODE -ne 0) { throw 'Isolated test PostgreSQL is not ready.' }
