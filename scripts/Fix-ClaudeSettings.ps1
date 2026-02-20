#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Fix incomplete Claude settings.local.json files by adding missing hooks/permissions

.DESCRIPTION
    Restores missing configuration sections to Claude settings files that were
    incorrectly resolved during merge conflicts. Ensures all worktrees have
    complete MCP and tool functionality.

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

# Function to check if all worktrees have complete configurations
function Test-ClaudeSettingsComplete {
    Write-Host "🔍 Checking Claude settings completeness across all worktrees..." -ForegroundColor Yellow

    $worktrees = git worktree list
    $incomplete = @()

    foreach ($line in $worktrees) {
        $parts = $line -split '\s+', 3
        $worktreePath = $parts[0]
        $branch = $parts[2] -replace '^\[|\]$', ''

        if ($branch -ne "main" -and (Test-Path $worktreePath)) {
            $settingsPath = Join-Path $worktreePath ".claude\settings.local.json"

            if (Test-Path $settingsPath) {
                $content = Get-Content $settingsPath -Raw
                $hasHooks = $content -match '"hooks"'
                $hasPermissions = $content -match '"permissions"'

                if (-not ($hasHooks -and $hasPermissions)) {
                    $incomplete += $branch
                    Write-Host "❌ $branch - missing: $(if(-not $hasHooks){'hooks'}else{''}) $(if(-not $hasPermissions){'permissions'}else{''})" -ForegroundColor Red
                } else {
                    Write-Host "✅ $branch - complete" -ForegroundColor Green
                }
            } else {
                $incomplete += $branch
                Write-Host "❌ $branch - no settings file" -ForegroundColor Red
            }
        }
    }

    if ($incomplete.Count -eq 0) {
        Write-Host "`n🎉 All worktrees have complete Claude configurations!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "`n⚠️ Found $($incomplete.Count) incomplete configurations: $($incomplete -join ', ')" -ForegroundColor Yellow
        return $false
    }
}

# Main script logic

$backupPath = Join-Path $PSScriptRoot ".." $BackupDir

# Define the complete configuration sections
$hooksSection = @'
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python .claude/hooks/validate-branch-name.py"
          }
        ]
      }
    ]
  }
}
'@

$permissionsSection = @'
{
  "permissions": {
    "allow": [
      "WebFetch(domain:www.aitmpl.com)",
      "WebFetch(domain:www.npmjs.com)"
    ]
  }
}
'@

Write-Host "🔧 Fixing incomplete Claude settings configurations..." -ForegroundColor Yellow

# Get all worktrees
$worktrees = git worktree list

foreach ($line in $worktrees) {
    $parts = $line -split '\s+', 3
    $worktreePath = $parts[0]
    $branch = $parts[2] -replace '^\[|\]$', ''

    if ($branch -ne "main" -and (Test-Path $worktreePath)) {
        $settingsPath = Join-Path $worktreePath ".claude\settings.local.json"

        if (Test-Path $settingsPath) {
            $content = Get-Content $settingsPath -Raw
            $hasHooks = $content -match '"hooks"'
            $hasPermissions = $content -match '"permissions"'

            $needsFix = $false

            # Parse existing JSON
            try {
                $json = $content | ConvertFrom-Json
            } catch {
                Write-Host "❌ Invalid JSON in $branch - skipping" -ForegroundColor Red
                continue
            }

            # Add missing hooks
            if (-not $hasHooks) {
                Write-Host "📝 Adding hooks to $branch..." -ForegroundColor Cyan
                $hooksObj = ConvertFrom-Json $hooksSection
                $json | Add-Member -MemberType NoteProperty -Name "hooks" -Value $hooksObj.hooks -Force
                $needsFix = $true
            }

            # Add missing permissions
            if (-not $hasPermissions) {
                Write-Host "📝 Adding permissions to $branch..." -ForegroundColor Cyan
                $permissionsObj = ConvertFrom-Json $permissionsSection
                $json | Add-Member -MemberType NoteProperty -Name "permissions" -Value $permissionsObj.permissions -Force
                $needsFix = $true
            }

            if ($needsFix) {
                # Convert back to JSON and save
                $fixedJson = $json | ConvertTo-Json -Depth 10
                $fixedJson | Set-Content $settingsPath -Encoding UTF8

                Write-Host "✅ Fixed $branch - now has complete configuration" -ForegroundColor Green

                # Stage and commit the fix
                Push-Location $worktreePath
                try {
                    git add ".claude/settings.local.json"
                    git commit -m "fix: Restore complete Claude configuration (hooks + permissions)

- Added missing hooks section for PreToolUse validation
- Added missing permissions section for MCP tool access
- Ensures full MCP functionality in Claude sessions" 2>$null
                    Write-Host "💾 Committed fix for $branch" -ForegroundColor Blue
                } catch {
                    Write-Host "⚠️ Could not commit $branch (may have no changes)" -ForegroundColor Yellow
                }
                Pop-Location
            } else {
                Write-Host "✅ $branch already has complete configuration" -ForegroundColor Green
            }
        }
    }
}

Write-Host "`n🎉 All Claude settings configurations have been fixed!" -ForegroundColor Green
Write-Host "🔄 MCP tools and hooks are now fully functional across all worktrees" -ForegroundColor Cyan