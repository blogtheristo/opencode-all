#requires -Version 7.0
<#
.SYNOPSIS
    For each Git worktree in this repo, commit all changes if the tree is dirty.

.DESCRIPTION
    Walks `git worktree list --porcelain`, skips bare paths, and runs
    `git add -A` + `git commit` only when `git status --porcelain` is non-empty.

.PARAMETER NoVerify
    Passes --no-verify to git commit (skips hooks).

.EXAMPLE
    pwsh -NoProfile -File .\scripts\Commit-DirtyWorktrees.ps1

.EXAMPLE
    pwsh -NoProfile -File .\scripts\Commit-DirtyWorktrees.ps1 -NoVerify
#>
param(
    [switch]$NoVerify
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
Push-Location $repoRoot

try {
    $lines = git worktree list --porcelain 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "git worktree list --porcelain failed (is this a git repo?)"
    }

    # Porcelain blocks: worktree <path> / HEAD <sha> / branch refs/heads/<name> | detached
    $worktrees = [System.Collections.Generic.List[object]]::new()
    $pendingPath = $null
    foreach ($line in $lines) {
        if ($line -match '^worktree (.+)$') {
            $pendingPath = $matches[1].Trim()
        }
        elseif ($line -match '^branch refs/heads/(.+)$' -and $null -ne $pendingPath) {
            $worktrees.Add([pscustomobject]@{
                    Path   = $pendingPath
                    Branch = $matches[1].Trim()
                })
            $pendingPath = $null
        }
        elseif ($line -match '^detached$' -and $null -ne $pendingPath) {
            $worktrees.Add([pscustomobject]@{
                    Path   = $pendingPath
                    Branch = "(detached)"
                })
            $pendingPath = $null
        }
    }

    $msg = "wip: auto-commit dirty worktree $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $commitArgs = @("commit", "-m", $msg)
    if ($NoVerify) {
        $commitArgs = @("commit", "--no-verify", "-m", $msg)
    }

    $ok = 0
    $skip = 0
    $fail = 0

    foreach ($wt in $worktrees) {
        $p = $wt.Path
        $b = $wt.Branch
        if (-not (Test-Path -LiteralPath $p)) {
            Write-Warning "[SKIP] Missing path: $p ($b)"
            $skip++
            continue
        }

        $dirty = git -C $p status --porcelain 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "[FAIL] git status failed: $p ($b)"
            $fail++
            continue
        }

        if ([string]::IsNullOrWhiteSpace($dirty)) {
            Write-Host "[CLEAN] $p  ($b)" -ForegroundColor DarkGray
            $skip++
            continue
        }

        Write-Host "[DIRTY] $p  ($b)" -ForegroundColor Yellow
        git -C $p add -A
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "[FAIL] git add -A: $p"
            $fail++
            continue
        }

        $commitOut = git -C $p @commitArgs 2>&1
        if ($LASTEXITCODE -ne 0) {
            Write-Warning "[FAIL] git commit: $p`n$commitOut"
            $fail++
            continue
        }

        Write-Host "[OK]    committed: $p" -ForegroundColor Green
        $ok++
    }

    Write-Host ""
    Write-Host "Summary: committed=$ok  skipped(clean or missing)=$skip  failed=$fail" -ForegroundColor Cyan
}
finally {
    Pop-Location
}
