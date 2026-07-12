[CmdletBinding()]
param([int]$S3Port = 59000)

$ErrorActionPreference = 'Stop'
$pgReady = 'C:\Program Files\PostgreSQL\16\bin\pg_isready.exe'
$redisCli = 'C:\Program Files\Redis\redis-cli.exe'
if (-not (Test-Path -LiteralPath $pgReady)) { throw "PostgreSQL readiness binary not found: $pgReady" }
if (-not (Test-Path -LiteralPath $redisCli)) { throw "Redis CLI not found: $redisCli" }

& $pgReady -h 127.0.0.1 -p 5432
if ($LASTEXITCODE -ne 0) { throw 'Native PostgreSQL is not accepting connections on 127.0.0.1:5432.' }
$redis = (& $redisCli -h 127.0.0.1 -p 6379 ping).Trim()
if ($redis -ne 'PONG') { throw "Native Redis health failed: $redis" }

$client = [System.Net.Sockets.TcpClient]::new()
try {
    $connection = $client.ConnectAsync('127.0.0.1', $S3Port)
    if (-not $connection.Wait(3000) -or -not $client.Connected) {
        throw "S3rver is not listening on 127.0.0.1:$S3Port. Run pnpm deps:native:start."
    }
} finally {
    $client.Dispose()
}
Write-Host "Native dependencies healthy: PostgreSQL 127.0.0.1:5432, Redis 127.0.0.1:6379, S3rver 127.0.0.1:$S3Port"
