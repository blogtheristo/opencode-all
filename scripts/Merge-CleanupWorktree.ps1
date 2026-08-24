#requires -Version 7.0
<#
.SYNOPSIS
    After a PR is merged: fetch, checkout main, pull, remove a linked worktree, delete the local feature branch, prune.

.DESCRIPTION
    Run from the main DWS6 repository (not from inside the worktree being removed). Inverse of New-ClaudeWorktree.ps1.

    After a PR merge, GitHub usually deletes the remote branch automatically (repo setting). This script does not delete
    remotes — it removes the linked worktree and the local branch ref (git branch -d/-D), then prunes worktree metadata.

    Example (full path):
      .\scripts\Merge-CleanupWorktree.ps1 -WorktreePath "F:/2026/Repos2026/.claude-worktrees/dws6/my-feature"

    Example (find worktree by branch name):
      .\scripts\Merge-CleanupWorktree.ps1 -BranchName "claude/my-feature"

.PARAMETER WorktreePath
    Full path to the worktree directory to remove. Optional if -BranchName is set and unique.

.PARAMETER BranchName
    Feature branch that was merged. Used to locate the worktree if -WorktreePath is omitted.

.PARAMETER MainRepo
    Path to the main clone. Auto-detected when possible (same heuristics as New-ClaudeWorktree.ps1).

.PARAMETER BaseBranch
    Branch to checkout and pull before removing the worktree (default: main).

.PARAMETER Force
    Pass --force to git worktree remove when the worktree has uncommitted or untracked changes.

.PARAMETER ForceDeleteBranch
    Use git branch -D instead of -d (delete local branch even if not merged into BaseBranch in this clone).

.NOTES
    Code-Version: 1.0.1
    Introduced-In: PR-TBD
    Date: 2026-04-01
    Owner: Lifetime Oy
#>
param(
    [string]$WorktreePath,

    [string]$BranchName,

    [string]$MainRepo,

    [string]$BaseBranch = 'main',

    [switch]$Force,

    [switch]$ForceDeleteBranch
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

if (-not $WorktreePath -and -not $BranchName) {
    Write-Error 'Specify -WorktreePath or -BranchName. See Get-Help Merge-CleanupWorktree.ps1.'
}

function Get-MainRepoPath {
    $possiblePaths = @(
        'F:/2026/Repos2026/dws6',
        'D:/Proton/My files/2026/Repos2026/dws6',
        "$HOME/repos/dws6",
        "$HOME/Developer/dws6"
    )
    foreach ($path in $possiblePaths) {
        if (Test-Path -Path "$path/.git") {
            return $path
        }
    }
    $gitDir = git rev-parse --git-common-dir 2>$null
    if ($gitDir) {
        $mainPath = Split-Path -Parent $gitDir
        if (Test-Path -Path "$mainPath/.git") {
            return $mainPath
        }
    }
    return $null
}

function Get-WorktreeBranchPairs {
    param([string]$RepoRoot)
    $pairs = [System.Collections.Generic.List[object]]::new()
    $lines = git -C $RepoRoot worktree list --porcelain 2>$null
    if (-not $lines) {
        return $pairs
    }
    $curPath = $null
    foreach ($line in $lines) {
        if ($line -match '^worktree (.+)$') {
            $curPath = $matches[1]
        }
        elseif ($line -match '^branch refs/heads/(.+)$') {
            $pairs.Add([PSCustomObject]@{ Path = $curPath; Branch = $matches[1] })
        }
    }
    return $pairs
}

function Resolve-WorktreePath {
    param(
        [string]$MainRepo,
        [string]$WorktreePath,
        [string]$BranchName
    )
    if ($WorktreePath) {
        $resolved = (Resolve-Path -LiteralPath $WorktreePath -ErrorAction Stop).Path -replace '\\', '/'
        return $resolved
    }
    if (-not $BranchName) {
        Write-Error 'Specify -WorktreePath and/or -BranchName.'
    }
    $pairs = Get-WorktreeBranchPairs -RepoRoot $MainRepo
    $branchHits = @($pairs | Where-Object { $_.Branch -eq $BranchName })
    if ($branchHits.Count -eq 0) {
        Write-Error "No worktree found for branch '$BranchName'. Use -WorktreePath or check 'git worktree list'."
    }
    if ($branchHits.Count -gt 1) {
        Write-Error "Multiple worktrees for branch '$BranchName' — specify -WorktreePath explicitly."
    }
    return $branchHits[0].Path -replace '\\', '/'
}

# --- main ---
if (-not $MainRepo) {
    $MainRepo = Get-MainRepoPath
}
if (-not $MainRepo -or -not (Test-Path -LiteralPath "$MainRepo/.git")) {
    Write-Error 'Cannot locate main DWS6 repository. Run from the repo or pass -MainRepo.'
}
$MainRepo = (Resolve-Path -LiteralPath $MainRepo).Path -replace '\\', '/'

$wtPath = Resolve-WorktreePath -MainRepo $MainRepo -WorktreePath $WorktreePath -BranchName $BranchName

if ($wtPath -eq $MainRepo) {
    Write-Error 'Refusing to remove the main repository path. Pass a linked worktree path.'
}

# Resolve branch checked out in target worktree (authoritative)
if (-not (Test-Path -LiteralPath $wtPath)) {
    Write-Error "Worktree path does not exist: $wtPath"
}
$branchToDelete = git -C $wtPath rev-parse --abbrev-ref HEAD 2>$null
if (-not $branchToDelete -or $branchToDelete -eq 'HEAD') {
    Write-Error "Could not resolve branch for worktree at $wtPath (detached HEAD?)."
}
if ($branchToDelete -in @('main', 'master')) {
    Write-Error "Refusing to delete protected branch '$branchToDelete'."
}

Write-Host "Main repository: $MainRepo" -ForegroundColor DarkGray
Write-Host "Worktree to remove: $wtPath" -ForegroundColor DarkGray
Write-Host "Branch to remove locally: $branchToDelete" -ForegroundColor DarkGray

Write-Host "`n[1/5] git fetch origin..." -ForegroundColor Green
git -C $MainRepo fetch origin

Write-Host "`n[2/5] git checkout $BaseBranch..." -ForegroundColor Green
git -C $MainRepo checkout $BaseBranch

Write-Host "`n[3/5] git pull origin $BaseBranch..." -ForegroundColor Green
git -C $MainRepo pull origin $BaseBranch

$removeArgs = @('worktree', 'remove')
if ($Force) {
    $removeArgs += '--force'
}
$removeArgs += $wtPath

Write-Host "`n[4/5] git worktree remove..." -ForegroundColor Green
& git -C $MainRepo @removeArgs
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "`n[5/5] git branch (local) ; git worktree prune..." -ForegroundColor Green
$localRef = git -C $MainRepo show-ref -q --verify "refs/heads/$branchToDelete" 2>$null
if ($LASTEXITCODE -eq 0) {
    $deleteFlag = if ($ForceDeleteBranch) { '-D' } else { '-d' }
    git -C $MainRepo branch $deleteFlag $branchToDelete
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Local branch delete failed (not merged in this clone?). Fix manually: git branch -d $branchToDelete or -D"
    }
}
else {
    Write-Host "  Local branch '$branchToDelete' already gone (e.g. deleted already)." -ForegroundColor DarkGray
}

git -C $MainRepo worktree prune

Write-Host "`nDone. Main is on $BaseBranch; worktree removed; local branch cleaned up if it still existed." -ForegroundColor Cyan
