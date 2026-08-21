#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Pin every git stash to a permanent ref and back the set up to a bundle.

.DESCRIPTION
    Git stashes are the least durable thing in a repository:

      * They are local-only. Nothing pushes them, so GitHub never has a copy.
      * Only stash@{0} has a real ref (refs/stash). Every older stash exists
        ONLY as a reflog entry on that ref, and reflog entries expire —
        90 days reachable / 30 days unreachable by default. A routine
        `git gc` silently deletes months of parked work.

    On 2026-08-12 this repo had 54 stashes, 53 of them reflog-only, the oldest
    from April, including content the project memory flags as never-overwrite.
    They were one maintenance run from gone.

    This script closes that hole permanently. It:

      1. Sets gc.<pattern>.reflogExpire = never for refs/stash and the archive,
         so git itself stops expiring stash reflog entries.
      2. Promotes every stash commit to a permanent ref under
         refs/stash-archive/, which makes it unreachable-proof and gc-proof.
      3. Refreshes MANIFEST.txt, because a bundle carries refs but NOT the
         reflog messages that say what each stash was for.
      4. Writes a rotated git bundle, skipping the write when nothing changed
         (the bundle is ~600 MB; weekly unconditional copies would eat disk).

    Existing pins are detected by COMMIT SHA, not ref name, so the numeric
    refs/stash-archive/000..053 created by the initial 2026-08-12 sweep are
    recognised and never duplicated under a second name.

    Idempotent. Safe to run on every schedule tick. Never deletes a stash,
    never drops a ref, never runs `git stash clear`.

.PARAMETER RepoPath
    Repository to protect. Default: the repo this script lives in.

.PARAMETER BackupPath
    Where MANIFEST.txt and the bundles go. MUST be outside the repo — a
    600 MB bundle must never land in git. Default: <repo>/../dws6-stash-backup

.PARAMETER KeepBundles
    How many dated bundles to retain. Default: 3.

.PARAMETER SkipBundle
    Pin refs and refresh the manifest, but do not write a bundle. Use for a
    fast check when you only care that nothing is gc-eligible.

.PARAMETER Install
    Register this script as a weekly Windows Scheduled Task and exit.

.EXAMPLE
    .\Protect-GitStashes.ps1

.EXAMPLE
    .\Protect-GitStashes.ps1 -Install

.EXAMPLE
    .\Protect-GitStashes.ps1 -SkipBundle
#>

param(
    [string]$RepoPath = (Split-Path -Parent $PSScriptRoot),
    [string]$BackupPath = "",
    [int]$KeepBundles = 3,
    [switch]$SkipBundle,
    [switch]$Install
)

$ErrorActionPreference = 'Stop'
$TaskName = 'DWS6-Protect-GitStashes'

function Write-Step { param([string]$m) Write-Host "==> $m" -ForegroundColor Cyan }
function Write-Ok   { param([string]$m) Write-Host "    $m" -ForegroundColor Green }
function Write-Warn { param([string]$m) Write-Host "    $m" -ForegroundColor Yellow }

# ---------------------------------------------------------------- Install ---
if ($Install) {
    $self = $MyInvocation.MyCommand.Path
    Write-Step "Registering weekly scheduled task '$TaskName'"

    $action = New-ScheduledTaskAction -Execute 'powershell.exe' `
        -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$self`""
    # Sunday 03:00 — after any weekend work is parked, before Monday.
    $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Sunday -At 3am
    $settings = New-ScheduledTaskSettingsSet -StartWhenAvailable `
        -DontStopIfGoingOnBatteries -AllowStartIfOnBatteries `
        -ExecutionTimeLimit (New-TimeSpan -Hours 2)

    Register-ScheduledTask -TaskName $TaskName -Action $action -Trigger $trigger `
        -Settings $settings -Description 'Pin git stashes to permanent refs and bundle them (DWS6).' `
        -Force | Out-Null

    Write-Ok "Registered. Runs Sundays 03:00."
    Write-Ok "Run now:  Start-ScheduledTask -TaskName $TaskName"
    Write-Ok "Remove:   Unregister-ScheduledTask -TaskName $TaskName -Confirm:`$false"
    exit 0
}

# ------------------------------------------------------------------ Setup ---
if (-not (Test-Path (Join-Path $RepoPath '.git'))) {
    throw "Not a git repository: $RepoPath"
}
if ([string]::IsNullOrWhiteSpace($BackupPath)) {
    $BackupPath = Join-Path (Split-Path -Parent $RepoPath) 'dws6-stash-backup'
}
# Compare with a trailing separator, else a SIBLING directory whose name merely
# starts with the repo name (dws6-stash-backup vs dws6) is wrongly rejected.
$repoFull = [IO.Path]::GetFullPath($RepoPath).TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
$backupFull = [IO.Path]::GetFullPath($BackupPath).TrimEnd('\', '/') + [IO.Path]::DirectorySeparatorChar
if ($backupFull.StartsWith($repoFull, [StringComparison]::OrdinalIgnoreCase)) {
    throw "BackupPath must be OUTSIDE the repo (bundles are ~600 MB): $BackupPath"
}
if (-not (Test-Path $BackupPath)) {
    New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
}

Push-Location $RepoPath
try {
    $stamp = Get-Date -Format 'yyyy-MM-dd'
    Write-Step "Protecting stashes in $RepoPath"

    # -- 1. Stop git expiring stash reflogs ---------------------------------
    foreach ($pat in @('refs/stash', 'refs/stash-archive/*')) {
        git config "gc.`"$pat`".reflogExpire" never
        if ($LASTEXITCODE -ne 0) { throw "git config reflogExpire failed for pattern: $pat" }
        git config "gc.`"$pat`".reflogExpireUnreachable" never
        if ($LASTEXITCODE -ne 0) { throw "git config reflogExpireUnreachable failed for pattern: $pat" }
    }
    Write-Ok "reflog expiry disabled for refs/stash and refs/stash-archive/*"

    # -- 2. Pin every stash to a permanent ref ------------------------------
    # Match on SHA so a stash already pinned under ANY archive ref name
    # (including the original numeric 000..053) is never pinned twice.
    $pinned = @{}
    git for-each-ref --format='%(objectname)' refs/stash-archive/ |
        ForEach-Object { if ($_) { $pinned[$_] = $true } }

    $stashes = @(git stash list --format='%H')
    $new = 0
    foreach ($sha in $stashes) {
        if (-not $sha -or $pinned.ContainsKey($sha)) { continue }
        git update-ref "refs/stash-archive/$($sha.Substring(0,12))" $sha
        if ($LASTEXITCODE -ne 0) { throw "git update-ref failed for stash $sha" }
        $pinned[$sha] = $true
        $new++
    }

    $total = @(git for-each-ref --format='%(objectname)' refs/stash-archive/).Count
    if ($new -gt 0) { Write-Ok "pinned $new new stash(es)" } else { Write-Ok "no new stashes to pin" }
    Write-Ok "$($stashes.Count) stash(es) in list; $total permanent ref(s) in archive"

    # Fail loud: every live stash must be pinned (Rule 12).
    $unpinned = @($stashes | Where-Object { $_ -and -not $pinned.ContainsKey($_) })
    if ($unpinned.Count -gt 0) {
        throw "$($unpinned.Count) stash(es) failed to pin — investigate before trusting this backup."
    }

    # -- 3. Manifest — bundles do not carry reflog messages -----------------
    $manifest = Join-Path $BackupPath 'MANIFEST.txt'
    $lines = @(
        "# dws6 stash archive - manifest"
        "# Refreshed: $stamp   Source clone: $RepoPath"
        "#"
        "# Stashes are local-only refs; GitHub never has them. Each entry below is"
        "# pinned to a permanent ref so gc cannot expire it. Reflog descriptions are"
        "# NOT carried by a git bundle, which is why this file exists."
        "#"
        ("{0,-46} {1}" -f 'COMMIT', 'STASH DESCRIPTION')
    )
    git stash list --format='%H%x09%gs' | ForEach-Object {
        $p = $_ -split "`t", 2
        $lines += ("{0,-46} {1}" -f $p[0], $(if ($p.Count -gt 1) { $p[1] } else { '' }))
    }
    $lines += ""
    $lines += "# Permanent refs (authoritative - survives even if the stash list is cleared):"
    git for-each-ref --format='%(refname) %(objectname)' refs/stash-archive/ |
        ForEach-Object { $lines += "  $_" }
    Set-Content -Path $manifest -Value $lines -Encoding UTF8
    Write-Ok "manifest refreshed: $manifest"

    if ($SkipBundle) {
        Write-Warn "-SkipBundle set; no bundle written."
        exit 0
    }

    # -- 4. Bundle, but only when the archive actually changed --------------
    # A bundle is ~600 MB. Rewriting an identical one every week is waste.
    $fingerprint = (git for-each-ref --format='%(objectname)' refs/stash-archive/ | Sort-Object) -join "`n"
    $fpFile = Join-Path $BackupPath '.last-bundle-fingerprint'
    $prev = if (Test-Path $fpFile) { Get-Content $fpFile -Raw } else { '' }

    if ($fingerprint.Trim() -eq $prev.Trim() -and (Get-ChildItem $BackupPath -Filter '*.bundle')) {
        Write-Ok "archive unchanged since last bundle; skipping ($total refs)"
        exit 0
    }

    $bundle = Join-Path $BackupPath "dws6-stashes-$stamp.bundle"
    Write-Step "Writing bundle (full history; this takes ~20s)"
    git bundle create $bundle --all
    if ($LASTEXITCODE -ne 0) { throw "git bundle create failed" }

    git bundle verify $bundle | Out-Null
    if ($LASTEXITCODE -ne 0) { throw "bundle failed verification: $bundle" }

    Set-Content -Path $fpFile -Value $fingerprint -Encoding UTF8
    $size = [math]::Round((Get-Item $bundle).Length / 1MB, 1)
    Write-Ok "bundle written and verified: $bundle ($size MB)"

    # -- 5. Rotate ----------------------------------------------------------
    $old = Get-ChildItem $BackupPath -Filter '*.bundle' |
        Sort-Object LastWriteTime -Descending | Select-Object -Skip $KeepBundles
    foreach ($f in $old) {
        Remove-Item $f.FullName -Force
        Write-Warn "rotated out: $($f.Name)"
    }

    Write-Step "Done. $($stashes.Count) stashes protected; $total permanent refs."
}
finally {
    Pop-Location
}
