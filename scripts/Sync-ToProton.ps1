<#
.SYNOPSIS
    Syncs DWS6 project files to Proton Drive for encrypted backup.

.DESCRIPTION
    Copies tracked business files (Admin/, AgentFoundry/, Team/, docs/)
    from the git repo to Proton Drive. Runs locally on Windows after git pull.

    This exists because Claude Code cloud can only reach GitHub.
    Business files need a second copy on encrypted Proton Drive storage.

.PARAMETER RepoPath
    Path to the git repo. Default: auto-detect from script location.

.PARAMETER ProtonPath
    Path to Proton Drive DWS6 folder. Default: F:\Proton\Proton\My files\2026\Repos2026\dws6

.PARAMETER DryRun
    Show what would be copied without copying.

.EXAMPLE
    .\Sync-ToProton.ps1
    .\Sync-ToProton.ps1 -DryRun
    .\Sync-ToProton.ps1 -ProtonPath "D:\Proton\My files\2026\Repos2026\dws6"
#>

param(
    [string]$RepoPath = "",
    [string]$ProtonPath = "F:\Proton\Proton\My files\2026\Repos2026\dws6",
    [switch]$DryRun
)

# --- Configuration ---
# Folders to sync from git repo to Proton Drive
$SyncFolders = @(
    "Admin",
    "AgentFoundry",
    "Team",
    "docs\metropolia",
    "Metropolia2026"
)

# Individual files to sync
$SyncFiles = @(
    "ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md",
    "ADMIN_MANUAL_AUTHENTICATION.md",
    "ADMIN_MANUAL_DWS6_COM.md",
    "ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md",
    "ADMIN_MANUAL_GAPS_ANALYSIS.md",
    "ADMIN_MANUAL_SUPABASE_EN_v1.md",
    "ADMIN_MANUAL_TESTING.md",
    "SECURITY_COMPLIANCE.md"
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

# --- Validation ---
if (-not (Test-Path $RepoPath)) {
    Write-Error "Repo path not found: $RepoPath"
    exit 1
}

if (-not (Test-Path $ProtonPath)) {
    Write-Warning "Proton Drive path not found: $ProtonPath"
    Write-Warning "Creating directory..."
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path $ProtonPath -Force | Out-Null
    }
}

# --- Sync logic ---
$syncCount = 0
$skipCount = 0
$errorCount = 0

function Sync-Item {
    param(
        [string]$Source,
        [string]$Destination
    )

    if (-not (Test-Path $Source)) {
        return
    }

    $destDir = Split-Path -Parent $Destination
    if (-not (Test-Path $destDir)) {
        if ($DryRun) {
            Write-Host "  [MKDIR] $destDir" -ForegroundColor Cyan
        } else {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
    }

    # Skip if destination is newer or identical
    if (Test-Path $Destination) {
        $srcHash = (Get-FileHash $Source -Algorithm MD5).Hash
        $dstHash = (Get-FileHash $Destination -Algorithm MD5).Hash
        if ($srcHash -eq $dstHash) {
            $script:skipCount++
            return
        }
    }

    if ($DryRun) {
        Write-Host "  [COPY] $Source -> $Destination" -ForegroundColor Yellow
    } else {
        try {
            Copy-Item -Path $Source -Destination $Destination -Force
            Write-Host "  [OK] $Source" -ForegroundColor Green
        } catch {
            Write-Host "  [ERROR] $Source : $_" -ForegroundColor Red
            $script:errorCount++
            return
        }
    }
    $script:syncCount++
}

Write-Host ""
Write-Host "=== DWS6 Proton Drive Sync ===" -ForegroundColor Cyan
Write-Host "  Repo:   $RepoPath"
Write-Host "  Proton: $ProtonPath"
if ($DryRun) { Write-Host "  MODE:   DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# Sync folders
foreach ($folder in $SyncFolders) {
    $srcFolder = Join-Path $RepoPath $folder
    if (Test-Path $srcFolder) {
        Write-Host "Syncing $folder/" -ForegroundColor Cyan
        $files = Get-ChildItem -Path $srcFolder -Recurse -File
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring($RepoPath.Length + 1)
            $destPath = Join-Path $ProtonPath $relativePath
            Sync-Item -Source $file.FullName -Destination $destPath
        }
    }
}

# Sync individual files
Write-Host "Syncing individual files" -ForegroundColor Cyan
foreach ($fileName in $SyncFiles) {
    $srcFile = Join-Path $RepoPath $fileName
    if (Test-Path $srcFile) {
        $destFile = Join-Path $ProtonPath $fileName
        Sync-Item -Source $srcFile -Destination $destFile
    }
}

# --- Summary ---
Write-Host ""
Write-Host "=== Sync Complete ===" -ForegroundColor Cyan
Write-Host "  Copied:  $syncCount files" -ForegroundColor Green
Write-Host "  Skipped: $skipCount files (unchanged)" -ForegroundColor Gray
if ($errorCount -gt 0) {
    Write-Host "  Errors:  $errorCount files" -ForegroundColor Red
}
Write-Host ""

# Log sync event
if (-not $DryRun -and $syncCount -gt 0) {
    $logFile = Join-Path $ProtonPath "sync-log.txt"
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | Synced $syncCount files from $RepoPath"
    Add-Content -Path $logFile -Value $logEntry
    Write-Host "  Log: $logFile" -ForegroundColor Gray
}
