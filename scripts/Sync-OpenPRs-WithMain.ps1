#requires -Version 7.0
<#
.SYNOPSIS
    Merge origin/main into each open PR branch, commit, push — repeat until GitHub reports no conflicts (or max iterations).

.DESCRIPTION
    Resolves the common "PR is out of date / has conflicts with main" loop by repeatedly:
      1. Fetching latest main and PR heads from origin
      2. For each open PR (gh), merging origin/main into the head branch
      3. Pushing the updated branch
      4. If conflicts: records the branch, aborts the merge, continues with other branches
      5. Optional outer loop: wait and retry until gh reports zero CONFLICTING PRs

    **This does not magically resolve content conflicts.** When Git stops with conflicts, fix files
    in the listed branch, run `git add` / `git commit` / `git push`, then re-run this script.

    Run from the primary clone (e.g. F:\2026\Repos2026\dws6). Requires GitHub CLI: `gh`.

.PARAMETER BaseBranch
    Base branch for PRs (default: main).

.PARAMETER MaxIterations
    Outer loop count when -LoopUntilClean is set (default: 12).

.PARAMETER SleepSeconds
    Pause between outer iterations when -LoopUntilClean (default: 8).

.PARAMETER MaxPRs
    Maximum open PRs to process per pass (default: 80).

.PARAMETER DryRun
    Print actions only.

.PARAMETER LoopUntilClean
    Re-check gh for CONFLICTING PRs and re-run merges until none remain or MaxIterations reached.

.PARAMETER NoStash
    Do not stash uncommitted changes before switching branches.

.PARAMETER SkipBranches
    Branch names to skip (wildcard-style contains match optional - exact match).

.EXAMPLE
    pwsh -File .\scripts\Sync-OpenPRs-WithMain.ps1 -DryRun

.EXAMPLE
    pwsh -File .\scripts\Sync-OpenPRs-WithMain.ps1 -LoopUntilClean
#>
param(
    [string]$BaseBranch = "main",
    [int]$MaxIterations = 12,
    [int]$SleepSeconds = 8,
    [int]$MaxPRs = 80,
    [switch]$DryRun,
    [switch]$LoopUntilClean,
    [switch]$NoStash,
    [string[]]$SkipBranches = @()
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Test-GhAvailable {
    if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
        throw "GitHub CLI (gh) not found. Install: https://cli.github.com/"
    }
}

function Get-OpenPullRequestHeads {
    param([int]$Limit)
    $json = gh pr list --state open --limit $Limit --json number,title,headRefName,mergeable,mergeStateStatus 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "gh pr list failed"
    }
    return $json | ConvertFrom-Json
}

function Get-ConflictingPrCount {
    $prs = Get-OpenPullRequestHeads -Limit 200
    return @($prs | Where-Object { $_.mergeable -eq 'CONFLICTING' }).Count
}

function Ensure-CleanWorkingTree {
    param([string]$RepoRoot, [bool]$UseStash)
    $dirty = git -C $RepoRoot status --porcelain 2>$null
    if (-not $dirty) {
        return $null
    }
    if (-not $UseStash) {
        throw "Working tree dirty. Commit/stash or pass -NoStash after cleaning."
    }
    $msg = "autostash Sync-OpenPRs-WithMain $(Get-Date -Format 'yyyyMMdd-HHmmss')"
    if ($DryRun) {
        Write-Host "[DRY-RUN] git stash push -u -m $msg" -ForegroundColor DarkCyan
        return $null
    }
    git -C $RepoRoot stash push -u -m $msg
    if ($LASTEXITCODE -ne 0) {
        throw "git stash failed"
    }
    return $msg
}

function Restore-Stash {
    param([string]$RepoRoot, [string]$StashLabel)
    if ($DryRun -or [string]::IsNullOrEmpty($StashLabel)) {
        return
    }
    git -C $RepoRoot stash pop
}

Test-GhAvailable

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path -replace '\\', '/'
Push-Location $repoRoot

$startBranch = git rev-parse --abbrev-ref HEAD 2>$null
if ($LASTEXITCODE -ne 0) {
    throw "Not in a git repository"
}

$stashNotice = $null
$stashId = Ensure-CleanWorkingTree -RepoRoot $repoRoot -UseStash (-not $NoStash)
if ($stashId) {
    $stashNotice = $true
}

try {
    $iter = 0
    do {
        $iter++
        Write-Host "`n========== Sync pass $iter $(if ($LoopUntilClean) { '(loop until clean)' } else { '' }) ==========" -ForegroundColor Cyan

        if (-not $DryRun) {
            git -C $repoRoot fetch origin $BaseBranch
            if ($LASTEXITCODE -ne 0) { throw "git fetch origin $BaseBranch failed" }
        }
        else {
            Write-Host "[DRY-RUN] git fetch origin $BaseBranch" -ForegroundColor DarkCyan
        }

        $prs = Get-OpenPullRequestHeads -Limit $MaxPRs
        if ($prs.Count -eq 0) {
            Write-Host "No open PRs." -ForegroundColor Green
            break
        }

        $failed = [System.Collections.Generic.List[string]]::new()
        $ok = 0

        foreach ($pr in $prs) {
            $branch = $pr.headRefName
            if ([string]::IsNullOrWhiteSpace($branch) -or $branch -in @($BaseBranch, 'master')) {
                continue
            }
            $skip = $false
            foreach ($s in $SkipBranches) {
                if ($branch -eq $s) {
                    $skip = $true
                    break
                }
            }
            if ($skip) {
                Write-Host "[SKIP] $branch (SkipBranches)" -ForegroundColor DarkGray
                continue
            }

            Write-Host "`n--- PR #$($pr.number) $branch — $($pr.title)" -ForegroundColor Yellow
            Write-Host "    mergeable=$($pr.mergeable) mergeState=$($pr.mergeStateStatus)" -ForegroundColor DarkGray

            if ($DryRun) {
                Write-Host "[DRY-RUN] checkout $branch ; merge origin/$BaseBranch ; push" -ForegroundColor DarkCyan
                continue
            }

            git -C $repoRoot fetch origin "$branch" 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "[FAIL] fetch $branch — skip"
                $failed.Add("$branch (fetch)")
                continue
            }

            git -C $repoRoot checkout -B $branch "origin/$branch" 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "[FAIL] checkout $branch — skip"
                $failed.Add("$branch (checkout)")
                continue
            }

            git -C $repoRoot merge "origin/$BaseBranch" -m "chore: merge $BaseBranch into $branch [sync script]"
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "[CONFLICT] $branch — merge aborted. Resolve manually, then push and re-run."
                git -C $repoRoot merge --abort 2>$null
                $failed.Add("$branch (conflict)")
                continue
            }

            git -C $repoRoot push origin $branch
            if ($LASTEXITCODE -ne 0) {
                Write-Warning "[FAIL] push $branch"
                $failed.Add("$branch (push)")
                continue
            }

            Write-Host "[OK]   pushed $branch" -ForegroundColor Green
            $ok++
        }

        Write-Host "`nPass $iter summary: pushed=$ok  failed=$($failed.Count)" -ForegroundColor Cyan
        if ($failed.Count -gt 0) {
            $failed | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
        }

        if (-not $LoopUntilClean) {
            break
        }

        $conflictCount = Get-ConflictingPrCount
        Write-Host "GitHub CONFLICTING PR count (approx): $conflictCount" -ForegroundColor Magenta

        if ($conflictCount -eq 0 -and $failed.Count -eq 0) {
            Write-Host "All clean (no local failures, no CONFLICTING on API)." -ForegroundColor Green
            break
        }

        if ($iter -ge $MaxIterations) {
            Write-Warning "MaxIterations ($MaxIterations) reached. Stop."
            break
        }

        Write-Host "Sleeping ${SleepSeconds}s before next pass..." -ForegroundColor DarkGray
        Start-Sleep -Seconds $SleepSeconds
    } while ($LoopUntilClean)

    if (-not $DryRun) {
        Write-Host "`nRestoring branch: $startBranch" -ForegroundColor DarkGray
        git -C $repoRoot checkout $startBranch 2>&1 | Out-Null
    }
}
finally {
    Pop-Location
    if ($stashNotice) {
        Write-Host "`nLocal changes were stashed. Restore: cd `"$repoRoot`" ; git stash pop" -ForegroundColor Yellow
    }
}
