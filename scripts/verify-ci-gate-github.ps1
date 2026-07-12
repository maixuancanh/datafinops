$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$repoRoot = Split-Path (Split-Path $root -Parent) -Parent
$out = Join-Path $root 'artifacts/implementation/T005-ci-gates-github.json'

$remote = $null
try {
  $remote = git -C $repoRoot remote get-url origin 2>$null
} catch {
  $remote = $null
}
$targetBranch = 'main'
$requiredStatusChecks = @()
$ghAvailable = [bool](Get-Command gh -ErrorAction SilentlyContinue)
$repo = $null

if ($remote -and $ghAvailable) {
  $repoView = gh repo view --json nameWithOwner,url,defaultBranchRef 2>$null | ConvertFrom-Json
  if ($repoView) {
    $repo = $repoView.nameWithOwner
    if ($repoView.defaultBranchRef.name) {
      $targetBranch = $repoView.defaultBranchRef.name
    }
    $protection = gh api "repos/$repo/branches/$targetBranch/protection/required_status_checks" 2>$null | ConvertFrom-Json
    if ($protection.contexts) {
      $requiredStatusChecks = @($protection.contexts)
    }
    if ($protection.checks) {
      $requiredStatusChecks = @($requiredStatusChecks + ($protection.checks | ForEach-Object { $_.context }))
    }
  }
}

$report = [ordered]@{
  workflow = '.github/workflows/ci.yml'
  requiredGate = 'Required aggregate gate'
  gitRemoteConfigured = [bool]$remote
  remoteUrl = $remote
  githubCliAvailable = $ghAvailable
  repository = $repo
  targetBranch = $targetBranch
  requiredStatusChecks = @($requiredStatusChecks | Where-Object { $_ } | Sort-Object -Unique)
  failedRequiredJobBlocksMerge = $false
  fixedAggregateUnblocksMerge = $false
  status = 'EXTERNAL_MERGE_PROTECTION_NOT_VERIFIED'
}

$json = ($report | ConvertTo-Json -Depth 6) -replace "`r`n", "`n"
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($out, $json + "`n", $utf8NoBom)
Get-Content $out

if (-not $remote) {
  throw 'T005 external proof requires git remote origin.'
}
if (-not $requiredStatusChecks.Contains('Required aggregate gate')) {
  throw 'T005 external proof requires branch protection to require Required aggregate gate.'
}

throw 'T005 external proof still requires a failing PR/job observed blocking merge and a fixed aggregate observed unblocking merge.'
