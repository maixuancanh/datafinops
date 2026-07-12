[CmdletBinding()]
param([int]$S3Port = 59000)

$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$runtime = Join-Path $root '.local-runtime'
$data = Join-Path $runtime 's3-data'
$logs = Join-Path $runtime 'logs'
$pidFile = Join-Path $runtime 's3rver.pid'
New-Item -ItemType Directory -Path $data, $logs -Force | Out-Null

foreach ($serviceName in @('postgresql-x64-16', 'Redis')) {
    $service = Get-Service -Name $serviceName -ErrorAction Stop
    if ($service.Status -ne 'Running') {
        Start-Service -Name $serviceName
        $service.WaitForStatus('Running', [TimeSpan]::FromSeconds(20))
    }
}

$listening = Get-NetTCPConnection -LocalPort $S3Port -State Listen -ErrorAction SilentlyContinue
if (-not $listening) {
    $pnpm = (Get-Command pnpm.cmd -ErrorAction Stop).Source
    $stdout = Join-Path $logs 's3rver.stdout.log'
    $stderr = Join-Path $logs 's3rver.stderr.log'
    $arguments = @(
        'exec', 's3rver', '-d', $data, '-a', '127.0.0.1', '-p', "$S3Port",
        '--no-vhost-buckets', '--configure-bucket', 'datafinops-local-evidence'
    )
    Start-Process -FilePath $pnpm -ArgumentList $arguments -WorkingDirectory $root -WindowStyle Hidden -RedirectStandardOutput $stdout -RedirectStandardError $stderr | Out-Null
}

$deadline = (Get-Date).AddSeconds(20)
do {
    try {
        & (Join-Path $PSScriptRoot 'check-native-dependencies.ps1') -S3Port $S3Port
        break
    } catch {
        if ((Get-Date) -ge $deadline) { throw }
        Start-Sleep -Milliseconds 500
    }
} while ($true)

$listener = Get-NetTCPConnection -LocalPort $S3Port -State Listen -ErrorAction Stop | Select-Object -First 1
Set-Content -LiteralPath $pidFile -Value $listener.OwningProcess -Encoding ascii
Write-Host "Native dependency profile started; S3rver PID $($listener.OwningProcess)."
