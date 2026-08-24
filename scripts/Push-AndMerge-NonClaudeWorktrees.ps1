#requires -Version 7.0
<#
.SYNOPSIS
    Push and merge branches from worktrees that are NOT under .claude/worktrees.

.DESCRIPTION
    Claude Code worktrees live under "<repo>/.claude/worktrees/*". This script ignores
    those paths entirely (no push, no merge from them).

    Typical remaining worktrees: main repo checkout, GitHub Copilot session folders, etc.

    Steps: fetch, optional commit of pending files in main repo, push listed branches,
    checkout main, pull, merge each branch with --no-ff, push main.

.PARAMETER RepoRoot
    Path to primary clone (contains .git). Default: parent of scripts/.

.PARAMETER Branches
    Explicit branch names to push and merge. If empty, derived from non-Claude worktrees.

.PARAMETER SkipCommit
    Do not create a commit for pending changes in RepoRoot before pushing.

.PARAMETER DryRun
    Print planned actions only.

.EXAMPLE
    pwsh -File .\scripts\Push-AndMerge-NonClaudeWorktrees.ps1

.EXAMPLE
    pwsh -File .\scripts\Push-AndMerge-NonClaudeWorktrees.ps1 -DryRun
#>
param(
    [string]$RepoRoot = "",
    [string[]]$Branches = @(),
    [switch]$SkipCommit,
    [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

if (-not $RepoRoot) {
    $RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}
$RepoRoot = (Resolve-Path -LiteralPath $RepoRoot).Path -replace '\\', '/'

$claudeWtMarker = '/.claude/worktrees/'
$excludeMarker = '\.claude\worktrees'

function Get-NonClaudeWorktreeBranches {
    param([string]$Root)
    $lines = git -C $Root worktree list --porcelain 2>$null
    if ($LASTEXITCODE -ne 0) { throw "git worktree list failed" }
    $list = [System.Collections.Generic.List[string]]::new()
    $pendingPath = $null
    foreach ($line in $lines) {
        if ($line -match '^worktree (.+)$') {
            $pendingPath = $matches[1].Trim() -replace '\\', '/'
        }
        elseif ($line -match '^branch refs/heads/(.+)$' -and $null -ne $pendingPath) {
            $norm = $pendingPath
            if ($norm -notlike "*${claudeWtMarker}*" -and $pendingPath -notmatch $excludeMarker) {
                $list.Add($matches[1].Trim())
            }
            $pendingPath = $null
        }
    }
    return $list | Sort-Object -Unique
}

function Invoke-GitSafe {
    param([string[]]$Args, [string]$Label)
    if ($DryRun) {
        Write-Host "[DRY-RUN] git $($Args -join ' ')" -ForegroundColor DarkCyan
        return
    }
    Write-Host "[RUN] $Label" -ForegroundColor Green
    & git @Args
    if ($LASTEXITCODE -ne 0) {
        throw "git failed: $($Args -join ' ') (exit $LASTEXITCODE)"
    }
}

Write-Host "Repo: $RepoRoot" -ForegroundColor Cyan
Write-Host "Excluding worktrees under: .claude/worktrees" -ForegroundColor DarkGray

if (-not $Branches -or $Branches.Count -eq 0) {
    $Branches = @(Get-NonClaudeWorktreeBranches -Root $RepoRoot)
}

Write-Host "Branches to integrate: $($Branches -join ', ')" -ForegroundColor Yellow

if ($Branches.Count -eq 0) {
    throw "No branches found (check worktree list and filters)."
}

$pending = git -C $RepoRoot status --porcelain 2>$null
if (-not $SkipCommit -and $pending -and -not $DryRun) {
    Invoke-GitSafe -Label "commit pending changes in main repo" -Args @("-C", $RepoRoot, "add", "-A")
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Invoke-GitSafe -Label "commit WIP" -Args @("-C", $RepoRoot, "commit", "--no-verify", "-m", "chore: sync before push/merge non-Claude worktrees ($ts)")
}

Invoke-GitSafe -Label "fetch origin" -Args @("-C", $RepoRoot, "fetch", "origin")

foreach ($b in $Branches) {
    if ($b -in @("main", "master")) {
        Write-Host "[SKIP] protected branch: $b" -ForegroundColor DarkYellow
        continue
    }
    git -C $RepoRoot merge-base --is-ancestor $b "main" 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SKIP] push $b — already contained in main" -ForegroundColor DarkGray
        continue
    }
    Invoke-GitSafe -Label "push branch $b" -Args @("-C", $RepoRoot, "push", "-u", "origin", $b)
}

Invoke-GitSafe -Label "checkout main" -Args @("-C", $RepoRoot, "checkout", "main")
Invoke-GitSafe -Label "pull main" -Args @("-C", $RepoRoot, "pull", "origin", "main")

foreach ($b in $Branches) {
    if ($b -in @("main", "master")) { continue }
    git -C $RepoRoot merge-base --is-ancestor $b "main" 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SKIP] merge $b — already an ancestor of main" -ForegroundColor DarkGray
        continue
    }
    $count = git -C $RepoRoot rev-list --count "main..$b" 2>$null
    if ($count -eq "0") {
        Write-Host "[SKIP] merge $b — rev-list main..$b is empty" -ForegroundColor DarkGray
        continue
    }
    if ($DryRun) {
        Write-Host "[DRY-RUN] git merge --no-ff $b" -ForegroundColor DarkCyan
        continue
    }
    Write-Host "[MERGE] main <- $b ($count commits)" -ForegroundColor Yellow
    & git -C $RepoRoot merge --no-ff $b -m "merge: integrate branch $b (non-Claude worktrees script)"
    if ($LASTEXITCODE -ne 0) {
        Write-Warning "Merge conflict or failure merging $b. Resolve in repo, then: git merge --continue"
        exit $LASTEXITCODE
    }
}

if (-not $DryRun) {
    Invoke-GitSafe -Label "push main" -Args @("-C", $RepoRoot, "push", "origin", "main")
}

Write-Host "Done." -ForegroundColor Green
