#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Backup Claude settings.local.json before resolving merge conflicts

.DESCRIPTION
    Creates a timestamped backup of .claude/settings.local.json in all worktrees
    to prevent loss of configuration during merge conflict resolution.

.PARAMETER WorktreePath
    Specific worktree path to backup (optional - defaults to all worktrees)

.EXAMPLE
    .\Backup-ClaudeSettings.ps1

.EXAMPLE
    .\Backup-ClaudeSettings.ps1 -WorktreePath "C:\Users\risto\.claude-worktrees\dws6\elated-zhukovsky"
#>

param(
    [string]$WorktreePath
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = Join-Path $PSScriptRoot "..\.claude-settings-backups"

# Create backup directory if it doesn't exist
if (!(Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

Write-Host "🔄 Backing up Claude settings.local.json files..." -ForegroundColor Yellow

if ($WorktreePath) {
    # Backup specific worktree
    $worktreeName = Split-Path $WorktreePath -Leaf
    $settingsFile = Join-Path $WorktreePath ".claude\settings.local.json"

    if (Test-Path $settingsFile) {
        $backupFile = Join-Path $backupDir "settings.local-${worktreeName}-${timestamp}.json"
        Copy-Item $settingsFile $backupFile -Force
        Write-Host "✅ Backed up: $worktreeName → $backupFile" -ForegroundColor Green
    } else {
        Write-Host "⚠️ No settings file found in: $worktreeName" -ForegroundColor Yellow
    }
} else {
    # Backup all worktrees
    $worktrees = git worktree list

    foreach ($line in $worktrees) {
        $parts = $line -split '\s+', 3
        $worktreePath = $parts[0]
        $branchName = $parts[2] -replace '^\[|\]$', ''

        if ($branchName -ne "main" -and (Test-Path $worktreePath)) {
            $settingsFile = Join-Path $worktreePath ".claude\settings.local.json"

            if (Test-Path $settingsFile) {
                # Clean branch name for filename (remove slashes)
                $cleanBranchName = $branchName -replace '[^a-zA-Z0-9_-]', '-'
                $backupFile = Join-Path $backupDir "settings.local-${cleanBranchName}-${timestamp}.json"
                Copy-Item $settingsFile $backupFile -Force
                Write-Host "✅ Backed up: $branchName → $(Split-Path $backupFile -Leaf)" -ForegroundColor Green
            }
        }
    }
}

Write-Host "📁 Backups saved to: $backupDir" -ForegroundColor Cyan
Write-Host "🛡️ Safe to resolve merge conflicts now!" -ForegroundColor Green