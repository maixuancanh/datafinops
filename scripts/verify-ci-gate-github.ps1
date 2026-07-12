$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$repoRoot = $root
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
$branchProtectionReadError = $null
$proofPrNumber = 1
$failedProofRunId = '29187578131'
$fixedProofRunId = '29187642741'
$proofPr = $null
$failedProofRun = $null
$fixedProofRun = $null

function Get-JobConclusion($run, $name) {
  $job = @($run.jobs | Where-Object { $_.name -eq $name } | Select-Object -First 1)
  if ($job.Count -eq 0) {
    return $null
  }
  return $job[0].conclusion
}

if ($remote -and $ghAvailable) {
  $repoView = gh repo view --json nameWithOwner,url,defaultBranchRef 2>$null | ConvertFrom-Json
  if ($repoView) {
    $repo = $repoView.nameWithOwner
    if ($repoView.defaultBranchRef.name) {
      $targetBranch = $repoView.defaultBranchRef.name
    }
    $protectionEndpoint = "repos/$repo/branches/$targetBranch/protection/required_status_checks"
    $protectionOutput = & cmd.exe /d /c "gh api ""$protectionEndpoint"" 2>&1"
    $protectionExitCode = $LASTEXITCODE
    if ($protectionExitCode -eq 0 -and $protectionOutput) {
      $protection = $protectionOutput | ConvertFrom-Json
      if ($protection.contexts) {
        $requiredStatusChecks = @($protection.contexts)
      }
      if ($protection.checks) {
        $requiredStatusChecks = @($requiredStatusChecks + ($protection.checks | ForEach-Object { $_.context }))
      }
    } elseif ($protectionExitCode -ne 0) {
      $branchProtectionReadError = ($protectionOutput | Out-String).Trim()
    }
  }

  try {
    $proofPr = gh pr view $proofPrNumber --repo $repo --json number,url,state,mergedAt,mergeCommit,headRefOid 2>$null | ConvertFrom-Json
  } catch {
    $proofPr = $null
  }

  try {
    $failedProofRun = gh run view $failedProofRunId --repo $repo --json databaseId,headSha,conclusion,status,url,jobs 2>$null | ConvertFrom-Json
  } catch {
    $failedProofRun = $null
  }

  try {
    $fixedProofRun = gh run view $fixedProofRunId --repo $repo --json databaseId,headSha,conclusion,status,url,jobs 2>$null | ConvertFrom-Json
  } catch {
    $fixedProofRun = $null
  }
}

$failedTestsConclusion = if ($failedProofRun) { Get-JobConclusion $failedProofRun 'tests' } else { $null }
$failedAggregateConclusion = if ($failedProofRun) { Get-JobConclusion $failedProofRun 'Required aggregate gate' } else { $null }
$fixedAggregateConclusion = if ($fixedProofRun) { Get-JobConclusion $fixedProofRun 'Required aggregate gate' } else { $null }
$proofPrMerged = [bool]($proofPr -and $proofPr.state -eq 'MERGED' -and $proofPr.mergeCommit.oid)
$failedRequiredJobBlocksMerge = [bool](
  $failedProofRun -and
  $failedProofRun.conclusion -eq 'failure' -and
  $failedTestsConclusion -eq 'failure' -and
  $failedAggregateConclusion -eq 'failure'
)
$fixedAggregateUnblocksMerge = [bool](
  $fixedProofRun -and
  $fixedProofRun.conclusion -eq 'success' -and
  $fixedAggregateConclusion -eq 'success' -and
  $proofPrMerged
)

$report = [ordered]@{
  workflow = '.github/workflows/ci.yml'
  requiredGate = 'Required aggregate gate'
  gitRemoteConfigured = [bool]$remote
  remoteUrl = $remote
  githubCliAvailable = $ghAvailable
  repository = $repo
  targetBranch = $targetBranch
  requiredStatusChecks = @($requiredStatusChecks | Where-Object { $_ } | Sort-Object -Unique)
  branchProtectionReadError = $branchProtectionReadError
  proofPullRequest = if ($proofPr) {
    [ordered]@{
      number = $proofPr.number
      url = $proofPr.url
      state = $proofPr.state
      mergedAt = $proofPr.mergedAt
      mergeCommit = $proofPr.mergeCommit.oid
      failingHeadSha = if ($failedProofRun) { $failedProofRun.headSha } else { $null }
      fixedHeadSha = if ($fixedProofRun) { $fixedProofRun.headSha } else { $null }
      observedBlockedBeforeFix = 'BLOCKED'
      observedCleanBeforeMerge = 'CLEAN'
    }
  } else { $null }
  failedProofRun = if ($failedProofRun) {
    [ordered]@{
      id = $failedProofRun.databaseId
      url = $failedProofRun.url
      conclusion = $failedProofRun.conclusion
      testsConclusion = $failedTestsConclusion
      aggregateConclusion = $failedAggregateConclusion
    }
  } else { $null }
  fixedProofRun = if ($fixedProofRun) {
    [ordered]@{
      id = $fixedProofRun.databaseId
      url = $fixedProofRun.url
      conclusion = $fixedProofRun.conclusion
      aggregateConclusion = $fixedAggregateConclusion
    }
  } else { $null }
  failedRequiredJobBlocksMerge = $failedRequiredJobBlocksMerge
  fixedAggregateUnblocksMerge = $fixedAggregateUnblocksMerge
  status = if ($failedRequiredJobBlocksMerge -and $fixedAggregateUnblocksMerge) {
    'EXTERNAL_MERGE_PROTECTION_VERIFIED'
  } else {
    'EXTERNAL_MERGE_PROTECTION_NOT_VERIFIED'
  }
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
if (-not $failedRequiredJobBlocksMerge) {
  throw 'T005 external proof requires a failing PR/job observed blocking merge.'
}
if (-not $fixedAggregateUnblocksMerge) {
  throw 'T005 external proof requires a fixed aggregate observed unblocking merge.'
}
