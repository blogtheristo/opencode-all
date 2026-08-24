#Requires -Version 5.1
<#
.SYNOPSIS
  Run npm install in the repo root and every subproject that has its own package-lock.json.

.DESCRIPTION
  Default: known npm roots (only directories where package-lock.json exists):
  - Repository root
  - mobile-dashboard, Firehorse/mobile-app, src/cloudflare, cli
  - dws6.com + landing-pages v10-react and content-pipeline

  Use -Discover to scan the repo for package-lock.json files (excludes node_modules,
  .git, and .claude/worktrees copies).

.PARAMETER RepoRoot
  Path to dws6 repo root (default: parent of scripts/).

.PARAMETER Discover
  Find all package-lock.json under RepoRoot instead of the built-in list.

.PARAMETER DryRun
  List targets only; do not run npm install.

.PARAMETER RetryCount
  On failure, how many extra attempts after the first (default: 2). Waits 4s between tries
  to let Windows release file locks (ENOTEMPTY / EPERM during node_modules cleanup).

.EXAMPLE
  .\scripts\Install-NpmLockProjects.ps1

.EXAMPLE
  .\scripts\Install-NpmLockProjects.ps1 -DryRun

.EXAMPLE
  .\scripts\Install-NpmLockProjects.ps1 -Discover
#>
param(
    [string]$RepoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path,
    [switch]$Discover,
    [switch]$DryRun,
    [ValidateRange(0, 10)]
    [int]$RetryCount = 2
)

$ErrorActionPreference = 'Stop'

if (-not (Test-Path (Join-Path $RepoRoot 'package.json'))) {
    Write-Error "Not an npm repo root: $RepoRoot"
    exit 1
}

$repoRootNorm = [System.IO.Path]::GetFullPath($RepoRoot.TrimEnd('\', '/'))

function Get-ExplicitLockDirs {
    $relativeDirs = @(
        '.',
        'mobile-dashboard',
        'Firehorse\mobile-app',
        'src\cloudflare',
        'cli',
        'dws6.com\dashboard\firehorse\v10-react',
        'landing-pages\dws6-com\dashboard\firehorse\v10-react',
        'dws6.com\tools\content-pipeline',
        'landing-pages\dws6-com\tools\content-pipeline'
    )
    $dirs = @()
    foreach ($rel in $relativeDirs) {
        $full = [System.IO.Path]::GetFullPath((Join-Path $repoRootNorm $rel))
        $lock = Join-Path $full 'package-lock.json'
        if (Test-Path -LiteralPath $lock) {
            $dirs += $full
        }
    }
    # Preserve list order (dual-folder: dws6.com paths before matching landing-pages copies).
    return $dirs
}

function Get-DiscoveredLockDirs {
    $locks = Get-ChildItem -Path $repoRootNorm -Recurse -Filter 'package-lock.json' -File -ErrorAction SilentlyContinue |
        Where-Object {
            $p = $_.FullName
            $p -notmatch '[\\/]node_modules[\\/]' -and
            $p -notmatch '[\\/]\.git[\\/]' -and
            $p -notmatch '[\\/]\.claude[\\/]worktrees[\\/]'
        }
    return $locks | ForEach-Object { $_.DirectoryName } | Sort-Object -Unique
}

if ($Discover) {
    $targetDirs = Get-DiscoveredLockDirs
    $mode = 'discover'
}
else {
    $targetDirs = Get-ExplicitLockDirs
    $mode = 'explicit'
}

if (-not $targetDirs -or $targetDirs.Count -eq 0) {
    Write-Warning "No package-lock.json targets ($mode mode). Use -Discover or add lockfiles."
    exit 0
}

Write-Host "npm install in $($targetDirs.Count) project(s) ($mode)" -ForegroundColor Cyan
Write-Host "Repo: $repoRootNorm`n" -ForegroundColor DarkGray

$failed = @()
foreach ($dir in $targetDirs) {
    $rel = $dir.Substring($repoRootNorm.Length).TrimStart('\', '/')
    if (-not $rel) { $rel = '.' }

    Write-Host "==> $rel" -ForegroundColor Yellow
    Write-Host "    $dir"

    if ($DryRun) { continue }

    Push-Location -LiteralPath $dir
    try {
        $maxAttempts = 1 + $RetryCount
        $attempt = 0
        do {
            $attempt++
            npm install
            if ($LASTEXITCODE -eq 0) { break }
            if ($attempt -lt $maxAttempts) {
                Write-Host "npm install failed (attempt $attempt/$maxAttempts); retrying in 4s..." -ForegroundColor DarkYellow
                Start-Sleep -Seconds 4
            }
        } while ($attempt -lt $maxAttempts)

        if ($LASTEXITCODE -ne 0) {
            $failed += $rel
            Write-Host @"

Windows often reports ENOTEMPTY/EPERM while npm updates node_modules (IDE, antivirus, or ESLint/TS holding files).
Try: close editors on this folder, then remove node_modules and run npm install again in:
  $dir
Or:  Remove-Item -Recurse -Force .\node_modules   (from that directory)
"@ -ForegroundColor DarkGray
        }
    }
    finally {
        Pop-Location
    }
    Write-Host ""
}

if ($DryRun) {
    Write-Host "(DryRun: no npm commands run)" -ForegroundColor Green
    exit 0
}

if ($failed.Count -gt 0) {
    Write-Host "FAILED in:" -ForegroundColor Red
    $failed | ForEach-Object { Write-Host "  $_" }
    Write-Host ""
    Write-Host "If errors were ENOTEMPTY/EPERM: stop processes locking that folder, delete node_modules there, re-run this script." -ForegroundColor DarkYellow
    exit 1
}

Write-Host "Done." -ForegroundColor Green
exit 0
