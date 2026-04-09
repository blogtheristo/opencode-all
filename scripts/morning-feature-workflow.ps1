#requires -Version 7.0
<#
.SYNOPSIS
    Morning workflow: create feature branch, run build and tests, then ready for implementation.

.DESCRIPTION
    Run at start of day to:
    1. Create or checkout a feature branch (from main)
    2. Run build and test so the branch is green
    3. Optionally run workflow fix-agent to apply one automated fix
    Then you implement your feature on this branch.

.PARAMETER FeatureName
    Short name for the feature (used in branch name). Default: morning-<date>.

.PARAMETER PrNumber
    Pull request number used to derive branch/worktree naming:
    - Branch: claude/pr-<number>
    - Worktree folder: pr-<number>

.PARAMETER BaseBranch
    Branch to base the feature branch on (default: main).

.PARAMETER SkipBuild
    Skip npm run build.

.PARAMETER SkipTest
    Skip npm run test.

.PARAMETER RunFixAgent
    After build/test, run .workflows/agents/fix-agent.js --latest (fix one audited workflow).

.PARAMETER UseWorktree
    Create a new worktree via New-ClaudeWorktree.ps1 instead of branching in current repo.

.EXAMPLE
    .\morning-feature-workflow.ps1 -FeatureName "compliance-dashboard"

.EXAMPLE
    .\morning-feature-workflow.ps1 -FeatureName "v2-carbon-reporting" -RunFixAgent

.EXAMPLE
    .\morning-feature-workflow.ps1 -PrNumber 769 -UseWorktree
#>
param(
    [Parameter(Mandatory = $false)]
    [string]$FeatureName,

    [Parameter(Mandatory = $false)]
    [ValidateRange(1, 2147483647)]
    [int]$PrNumber,

    [string]$BaseBranch = "main",

    [switch]$SkipBuild,
    [switch]$SkipTest,
    [switch]$RunFixAgent,
    [switch]$UseWorktree
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = $null
if (Test-Path "F:/2026/Repos2026/dws6") { $repoRoot = "F:/2026/Repos2026/dws6" }
elseif ($PSScriptRoot) { $repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path }
if (-not $repoRoot -or -not (Test-Path (Join-Path $repoRoot ".git"))) {
    Write-Error "Cannot find repo root (run from dws6 or set repo root)."
    exit 1
}
$repoRoot = $repoRoot -replace '\\', '/'

# Branch naming
$dateStr = Get-Date -Format "yyyyMMdd"
if ($PrNumber -gt 0) {
    $branchName = "claude/pr-$PrNumber"
}
else {
    $name = if ($FeatureName) { $FeatureName } else { "morning-$dateStr" }
    $branchName = "claude/$name"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DWS6 Morning Feature Workflow" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($UseWorktree) {
    $worktreeScript = Join-Path $repoRoot "scripts/New-ClaudeWorktree.ps1"
    if (-not (Test-Path $worktreeScript)) {
        Write-Error "New-ClaudeWorktree.ps1 not found at $worktreeScript"
        exit 1
    }
    if ($PrNumber -gt 0) {
        Write-Host "[Worktree mode] Creating PR worktree: #$PrNumber ($branchName)" -ForegroundColor Yellow
        & $worktreeScript -PrNumber $PrNumber -BaseBranch $BaseBranch
    }
    else {
        Write-Host "[Worktree mode] Creating worktree for branch: $branchName" -ForegroundColor Yellow
        & $worktreeScript -BranchName $branchName -BaseBranch $BaseBranch
    }
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host ""
    Write-Host "Worktree created. Cd into the worktree and run build/test there, or run this script again without -UseWorktree." -ForegroundColor Green
    exit 0
}

Push-Location $repoRoot
try {
    # 1. Ensure we're not on a protected branch with uncommitted changes
    $currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
    $status = git status --porcelain 2>$null
    if ($status -and ($currentBranch -eq "main" -or $currentBranch -eq "master")) {
        Write-Host "You have uncommitted changes on $currentBranch. Stash or commit them first." -ForegroundColor Yellow
        git status -s
        exit 1
    }

    # 2. Fetch and update base
    Write-Host "[1/4] Fetching and updating $BaseBranch..." -ForegroundColor Green
    git fetch origin $BaseBranch 2>$null
    git checkout $BaseBranch 2>$null
    git pull --ff-only origin $BaseBranch 2>$null
    if ($LASTEXITCODE -ne 0) { Write-Warning "Pull had issues (e.g. no upstream). Continuing." }

    # 3. Create or checkout feature branch
    Write-Host "[2/4] Branch: $branchName" -ForegroundColor Green
    $branchExists = git rev-parse --verify $branchName 2>$null
    if ($branchExists) {
        git checkout $branchName
        git merge --ff-only $BaseBranch 2>$null
    } else {
        git checkout -b $branchName
    }
    if ($LASTEXITCODE -ne 0) { exit 1 }

    # 4. Build
    if (-not $SkipBuild) {
        Write-Host "[3/4] Running build..." -ForegroundColor Green
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Build failed. Fix and re-run, or use -SkipBuild." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[3/4] Skipping build (-SkipBuild)." -ForegroundColor DarkGray
    }

    # 5. Test
    if (-not $SkipTest) {
        Write-Host "[4/4] Running tests..." -ForegroundColor Green
        npm run test -- --run 2>$null
        if ($LASTEXITCODE -ne 0) {
            npm run test -- --run
            Write-Host "Tests failed. Fix and re-run, or use -SkipTest." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "[4/4] Skipping tests (-SkipTest)." -ForegroundColor DarkGray
    }

    # 6. Optional: fix-agent
    if ($RunFixAgent) {
        $fixAgent = Join-Path $repoRoot ".workflows/agents/fix-agent.js"
        if (Test-Path $fixAgent) {
            Write-Host ""
            Write-Host "Running fix-agent (latest audit)..." -ForegroundColor Green
            node $fixAgent --latest
        } else {
            Write-Host "fix-agent.js not found; skipping." -ForegroundColor DarkGray
        }
    }

    Write-Host ""
    Write-Host "Done. Branch '$branchName' is ready. Implement your feature, then commit and push." -ForegroundColor Green
    Write-Host "  git add . && git commit -m \"feat: your message\" && git push -u origin $branchName" -ForegroundColor DarkGray
}
finally {
    Pop-Location
}
