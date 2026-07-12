[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$pidFile = Join-Path $root '.local-runtime\s3rver.pid'
if (Test-Path -LiteralPath $pidFile) {
    $processId = [int](Get-Content -LiteralPath $pidFile -Raw).Trim()
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($process) {
        $command = (Get-CimInstance Win32_Process -Filter "ProcessId=$processId").CommandLine
        if ($command -notmatch 's3rver') { throw "PID $processId is not an S3rver process; refusing to stop it." }
        Stop-Process -Id $processId
        $process.WaitForExit(10000) | Out-Null
    }
    Remove-Item -LiteralPath $pidFile -Force
}
Write-Host 'Stopped DataFinOps S3rver. Shared PostgreSQL and Redis Windows services remain running.'
