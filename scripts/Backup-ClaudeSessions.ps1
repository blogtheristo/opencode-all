#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Backup Claude Code session data from all worktrees

.DESCRIPTION
    This script creates a backup of all .claude directories from Git worktrees
    and stores them in a timestamped archive for safekeeping.

.PARAMETER OutputPath
    Path where to store the backup archive (default: current directory)

.PARAMETER KeepDays
    Number of days to keep old backups (default: 30)

.EXAMPLE
    .\Backup-ClaudeSessions.ps1

.EXAMPLE
    .\Backup-ClaudeSessions.ps1 -OutputPath "C:\Backups" -KeepDays 7
#>

param(
    [string]$OutputPath = ".",
    [int]$KeepDays = 30
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $OutputPath ".claude-sessions-backup-temp"
$archiveName = "claude-sessions-backup-${timestamp}.tar.gz"
$archivePath = Join-Path $OutputPath $archiveName

Write-Host "Starting Claude sessions backup..." -ForegroundColor Green

# Create temp backup directory
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

try {
    # Get worktree list
    $worktrees = git worktree list

    foreach ($line in $worktrees) {
        $parts = $line -split '\s+', 3
        $worktreePath = $parts[0]
        $branchName = $parts[2] -replace '^\[|\]$', ''

        $claudePath = Join-Path $worktreePath ".claude"

        if (Test-Path $claudePath) {
            Write-Host "Backing up Claude session from: $branchName" -ForegroundColor Yellow

            $branchBackupDir = Join-Path $backupDir $branchName
            New-Item -ItemType Directory -Path $branchBackupDir -Force | Out-Null

            # Copy .claude directory contents
            Copy-Item -Path "$claudePath\*" -Destination $branchBackupDir -Recurse -Force
        }
    }

    # Create archive
    Write-Host "Creating backup archive: $archiveName" -ForegroundColor Green

    # Use tar if available, otherwise use Compress-Archive
    if (Get-Command tar -ErrorAction SilentlyContinue) {
        & tar -czf $archivePath -C $OutputPath ".claude-sessions-backup-temp"
    } else {
        Compress-Archive -Path "$backupDir\*" -DestinationPath $archivePath -Force
    }

    Write-Host "Backup completed: $archivePath" -ForegroundColor Green

    # Clean up old backups
    Write-Host "Cleaning up backups older than $KeepDays days..." -ForegroundColor Yellow
    $oldBackups = Get-ChildItem -Path $OutputPath -Filter "claude-sessions-backup-*.tar.gz" |
                  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$KeepDays) }

    foreach ($oldBackup in $oldBackups) {
        Remove-Item $oldBackup.FullName -Force
        Write-Host "Removed old backup: $($oldBackup.Name)" -ForegroundColor Gray
    }

} finally {
    # Clean up temp directory
    if (Test-Path $backupDir) {
        Remove-Item $backupDir -Recurse -Force
    }
}

Write-Host "Claude sessions backup completed successfully!" -ForegroundColor Green