[CmdletBinding()]
param([int]$Port = 55432, [string]$SourceDatabase = 'datafinops_test')

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$bin = 'C:\Program Files\PostgreSQL\16\bin'
$artifact = Join-Path $root 'artifacts\foundation\restore'
$versions = Join-Path $root '.local-runtime\object-versions'
$restoreDatabase = 'datafinops_restore_test'
New-Item -ItemType Directory -Path $artifact, $versions -Force | Out-Null
& (Join-Path $PSScriptRoot 'start-test-postgres.ps1') -Port $Port -Database $SourceDatabase

$startedAt = (Get-Date).ToUniversalTime()
$backup = Join-Path $artifact 'datafinops-test.dump'
$sourceSchema = Join-Path $artifact 'source-schema.sql'
$restoreSchema = Join-Path $artifact 'restore-schema.sql'
$sourceData = Join-Path $artifact 'source-data.sql'
$restoreData = Join-Path $artifact 'restore-data.sql'

& (Join-Path $bin 'pg_dump.exe') -h 127.0.0.1 -p $Port -U datafinops -d $SourceDatabase -Fc --no-owner --no-privileges -f $backup
if ($LASTEXITCODE -ne 0) { throw 'pg_dump backup failed.' }
& (Join-Path $bin 'dropdb.exe') -h 127.0.0.1 -p $Port -U datafinops --if-exists $restoreDatabase
& (Join-Path $bin 'createdb.exe') -h 127.0.0.1 -p $Port -U datafinops $restoreDatabase
& (Join-Path $bin 'pg_restore.exe') -h 127.0.0.1 -p $Port -U datafinops -d $restoreDatabase --no-owner --no-privileges $backup
if ($LASTEXITCODE -ne 0) { throw 'pg_restore failed.' }

foreach ($item in @(
    @{ Database=$SourceDatabase; Schema=$sourceSchema; Data=$sourceData },
    @{ Database=$restoreDatabase; Schema=$restoreSchema; Data=$restoreData }
)) {
    & (Join-Path $bin 'pg_dump.exe') -h 127.0.0.1 -p $Port -U datafinops -d $item.Database --schema-only --no-owner --no-privileges -f $item.Schema
    & (Join-Path $bin 'pg_dump.exe') -h 127.0.0.1 -p $Port -U datafinops -d $item.Database --data-only --inserts --no-owner --no-privileges -f $item.Data
    if ($LASTEXITCODE -ne 0) { throw 'Fingerprint dump failed.' }
}

function Get-CanonicalDumpHash([string]$Path, [switch]$Schema) {
    $text = Get-Content -LiteralPath $Path -Raw
    $text = [regex]::Replace($text, '(?m)^\\(?:un)?restrict .*(?:\r?\n)?', '')
    if ($Schema) {
        $text = [regex]::Replace($text, '(?ms)^--\r?\n-- Name: public; Type: SCHEMA;.*?-- \*not\* creating schema, since initdb creates it\r?\n\r?\n', '')
    }
    $text = [regex]::Replace($text, '(\r?\n){3,}', "`n`n")
    $sha = [System.Security.Cryptography.SHA256]::Create()
    try { return ([BitConverter]::ToString($sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($text)))).Replace('-', '').ToLowerInvariant() }
    finally { $sha.Dispose() }
}

$backupHash = (Get-FileHash -LiteralPath $backup -Algorithm SHA256).Hash.ToLowerInvariant()
$sourceSchemaHash = Get-CanonicalDumpHash $sourceSchema -Schema
$restoreSchemaHash = Get-CanonicalDumpHash $restoreSchema -Schema
$sourceDataHash = Get-CanonicalDumpHash $sourceData
$restoreDataHash = Get-CanonicalDumpHash $restoreData
if ($sourceSchemaHash -ne $restoreSchemaHash) { throw 'Restored schema fingerprint differs from source.' }
if ($sourceDataHash -ne $restoreDataHash) { throw 'Restored data fingerprint differs from source.' }

$versionedBackup = Join-Path $versions "$backupHash.dump"
if (-not (Test-Path -LiteralPath $versionedBackup)) { Copy-Item -LiteralPath $backup -Destination $versionedBackup }
$report = [ordered]@{
    product = 'DataFinOps'; mode = 'native-windows'; sourceDatabase = $SourceDatabase
    restoreDatabase = $restoreDatabase; startedAt = $startedAt.ToString('o')
    completedAt = (Get-Date).ToUniversalTime().ToString('o'); backupHash = $backupHash
    schemaHash = $sourceSchemaHash; dataHash = $sourceDataHash; contentAddressedCopy = $versionedBackup
    liveWrite = $false; status = 'passed'
}
$report | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $artifact 'restore-report.json') -Encoding utf8
Write-Host "Backup/restore passed: $backupHash"
