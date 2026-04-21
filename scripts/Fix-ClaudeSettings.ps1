#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Fix incomplete Claude settings.local.json files by adding missing hooks/permissions
.PARAMETER BackupDir
    Directory containing the backup settings files (default: .claude-settings-backups)
.EXAMPLE
    .\Fix-ClaudeSettings.ps1
#>
param(
    [string]$BackupDir = ".claude-settings-backups"
)

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

$worktrees = git worktree list
$fixedCount = 0
$correctCount = 0
$errorCount = 0

foreach ($line in $worktrees) {
    $parts = $line -split '\s+', 3
    $worktreePath = $parts[0]
    $branch = $parts[2] -replace '^\[|\]$', ''

    if ($branch -eq "main" -or -not (Test-Path $worktreePath)) { continue }

    $settingsPath = Join-Path $worktreePath ".claude\settings.local.json"
    if (-not (Test-Path $settingsPath)) {
        Write-Host "  SKIP $branch - no settings file" -ForegroundColor DarkGray
        continue
    }

    $content = Get-Content $settingsPath -Raw
    try { $json = $content | ConvertFrom-Json } catch {
        Write-Host "  ERROR $branch - invalid JSON" -ForegroundColor Red
        $errorCount++; continue
    }

    $hasHooks = $json.PSObject.Properties.Name -contains 'hooks'
    $hasPermissions = $json.PSObject.Properties.Name -contains 'permissions'
    $needsFix = $false

    if (-not $hasHooks) {
        Write-Host "  FIXING $branch - adding hooks..." -ForegroundColor Cyan
        $json | Add-Member -MemberType NoteProperty -Name "hooks" -Value $hooksTemplate -Force
        $needsFix = $true
    }
    if (-not $hasPermissions) {
        Write-Host "  FIXING $branch - adding permissions..." -ForegroundColor Cyan
        $json | Add-Member -MemberType NoteProperty -Name "permissions" -Value $permissionsTemplate -Force
        $needsFix = $true
    }

    if ($needsFix) {
        $fixedJson = $json | ConvertTo-Json -Depth 10
        $fixedJson | Set-Content $settingsPath -Encoding UTF8
        Write-Host "  FIXED $branch" -ForegroundColor Green
        $fixedCount++

        Push-Location $worktreePath
        try {
            git add ".claude/settings.local.json"
            git commit -m "fix: restore complete Claude configuration (hooks + permissions)" 2>$null
            Write-Host "  COMMITTED $branch" -ForegroundColor Blue
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
Write-Host "Results: $correctCount correct, $fixedCount fixed, $errorCount errors"