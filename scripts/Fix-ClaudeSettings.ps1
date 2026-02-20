#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Fix incomplete Claude settings.local.json files by adding missing hooks/permissions
.DESCRIPTION
    Restores missing configuration sections to Claude settings files that were
    incorrectly resolved during merge conflicts. Ensures all worktrees have
    complete hooks and permissions functionality.

    This script should be run:
    - After creating new worktrees
    - After merge conflicts in Claude settings
    - Periodically to ensure all worktrees are properly configured
.PARAMETER BackupDir
    Directory containing the backup settings files (default: .claude-settings-backups)
.EXAMPLE
    .\Fix-ClaudeSettings.ps1
.EXAMPLE
    .\Fix-ClaudeSettings.ps1 -BackupDir "C:\MyBackups"
#>
param(
    [string]$BackupDir = ".claude-settings-backups"
)

# Define the complete configuration sections

$hooksTemplate = @{
    PreToolUse = @(
        @{
            matcher = "Bash"
            hooks = @(
                @{
                    type = "command"
                    command = 'python "$CLAUDE_PROJECT_DIR"/.claude/hooks/validate-branch-name.py'
                }
            )
        }
    )
}

$permissionsTemplate = @{
    allow = @(
        "Bash(powershell -Command:*)",
        "Bash(powershell -NoProfile -Command:*)",
        "Bash(pandoc:*)",
        "Bash(pip install:*)",
        "Bash(python -c:*)",
        "Bash(python -X utf8 -c:*)",
        "Bash(ls:*)",
        "Bash(python:*)"
    )
}

Write-Host "Checking Claude settings across all worktrees..." -ForegroundColor Yellow

# Get all worktrees
$worktrees = git worktree list
$fixedCount = 0
$correctCount = 0
$errorCount = 0

foreach ($line in $worktrees) {
    $parts = $line -split '\s+', 3
    $worktreePath = $parts[0]
    $branch = $parts[2] -replace '^\[|\]$', ''

    if ($branch -eq "main" -or -not (Test-Path $worktreePath)) {
        continue
    }

    $settingsPath = Join-Path $worktreePath ".claude\settings.local.json"

    if (-not (Test-Path $settingsPath)) {
        Write-Host "  SKIP $branch - no settings file" -ForegroundColor DarkGray
        continue
    }

    $content = Get-Content $settingsPath -Raw

    # Parse existing JSON
    try {
        $json = $content | ConvertFrom-Json
    } catch {
        Write-Host "  ERROR $branch - invalid JSON, skipping" -ForegroundColor Red
        $errorCount++
        continue
    }

    $hasHooks = $null -ne $json.hooks
    $hasPermissions = $null -ne $json.permissions
    $needsFix = $false

    # Add missing hooks
    if (-not $hasHooks) {
        Write-Host "  FIXING $branch - adding hooks..." -ForegroundColor Cyan
        $json | Add-Member -MemberType NoteProperty -Name "hooks" -Value $hooksTemplate -Force
        $needsFix = $true
    }

    # Add missing permissions
    if (-not $hasPermissions) {
        Write-Host "  FIXING $branch - adding permissions..." -ForegroundColor Cyan
        $json | Add-Member -MemberType NoteProperty -Name "permissions" -Value $permissionsTemplate -Force
        $needsFix = $true
    }

    if ($needsFix) {
        # Convert back to JSON and save
        $fixedJson = $json | ConvertTo-Json -Depth 10
        $fixedJson | Set-Content $settingsPath -Encoding UTF8
        Write-Host "  FIXED $branch" -ForegroundColor Green
        $fixedCount++

        # Stage and commit the fix
        Push-Location $worktreePath
        try {
            git add ".claude/settings.local.json"
            git commit -m "fix: restore complete Claude configuration (hooks + permissions)"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  COMMITTED $branch" -ForegroundColor Blue
            } else {
                Write-Host "  WARNING could not commit $branch (exit code $LASTEXITCODE)" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  WARNING could not commit $branch" -ForegroundColor Yellow
        }
        Pop-Location
    } else {
        Write-Host "  OK $branch" -ForegroundColor Green
        $correctCount++
    }
}

Write-Host ""
Write-Host "Results: $correctCount correct, $fixedCount fixed, $errorCount errors" -ForegroundColor $(if ($fixedCount -eq 0 -and $errorCount -eq 0) { "Green" } else { "Yellow" })
