<#
.SYNOPSIS
    Installs Windows Task Scheduler tasks for all DWS daily scripts.
    Run ONCE on Win11. After that, tasks run automatically forever.

.DESCRIPTION
    Registers scheduled tasks for:
    - Database backup (daily 02:00)
    - Proton Drive sync (daily 03:00)
    - Supabase sync (daily 03:30)
    - Aiven mirror (daily 04:00)
    - Daily sync health check (daily 05:00)
    - Morning emails (daily 06:00 Helsinki = 03:00/04:00 UTC)

    All tasks run under the current user's context.
    Re-running this script updates existing tasks (idempotent).

.EXAMPLE
    .\scripts\Install-DailyTasks.ps1

.NOTES
    Code-Version: 1.0.0
    Date: 2026-03-29
    Owner: Lifetime Oy
#>

$RepoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$ScriptsDir = "$RepoRoot\scripts"

# Task definitions: [Name, Script, CronTime (HH:mm), DaysOfWeek]
$Tasks = @(
    @{
        Name        = 'DWS-DatabaseBackup'
        Script      = "$ScriptsDir\Backup-Database.ps1"
        Time        = '02:00'
        Description = 'DWS: Nightly Supabase pg_dump backup (GPG encrypted)'
        Daily       = $true
    },
    @{
        Name        = 'DWS-SyncProton'
        Script      = "$ScriptsDir\Sync-ToProton.ps1"
        Time        = '03:00'
        Description = 'DWS: Sync repo to Proton Drive encrypted backup'
        Daily       = $true
    },
    @{
        Name        = 'DWS-SyncSupabase'
        Script      = "$ScriptsDir\Sync-ToSupabase.ps1"
        Time        = '03:30'
        Description = 'DWS: Sync files to Supabase Storage'
        Daily       = $true
    },
    @{
        Name        = 'DWS-MirrorAiven'
        Script      = "$ScriptsDir\Mirror-ToAiven.ps1"
        Time        = '04:00'
        Description = 'DWS: Mirror database to Aiven cloud PostgreSQL'
        Daily       = $true
    },
    @{
        Name        = 'DWS-DailySyncCheck'
        Script      = "$ScriptsDir\Test-DailySync.ps1"
        Time        = '05:00'
        Description = 'DWS: Health check for sync pipeline (GitHub + Proton + Supabase)'
        Daily       = $true
    },
    @{
        Name        = 'DWS-MorningEmails'
        Script      = "$ScriptsDir\run-morning-emails.ps1"
        Time        = '06:00'
        Description = 'DWS: All 7 morning email digests (briefing, leads, outreach, etc.)'
        DaysOfWeek  = @('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    }
)

Write-Host "`nDWS Daily Tasks Installer" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "Repo: $RepoRoot`n"

foreach ($task in $Tasks) {
    $name = $task.Name

    # Skip if script doesn't exist
    if (-not (Test-Path $task.Script)) {
        Write-Host "  SKIP: $name — script not found: $($task.Script)" -ForegroundColor Yellow
        continue
    }

    # Build trigger
    $triggerParams = @{ At = $task.Time }
    if ($task.Daily) {
        $trigger = New-ScheduledTaskTrigger -Daily @triggerParams
    } elseif ($task.DaysOfWeek) {
        $trigger = New-ScheduledTaskTrigger -Weekly -DaysOfWeek $task.DaysOfWeek @triggerParams
    }

    # Build action
    $action = New-ScheduledTaskAction `
        -Execute 'pwsh.exe' `
        -Argument "-NonInteractive -NoProfile -File `"$($task.Script)`"" `
        -WorkingDirectory $RepoRoot

    # Settings
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable

    # Remove existing task if present (idempotent)
    $existing = Get-ScheduledTask -TaskName $name -ErrorAction SilentlyContinue
    if ($existing) {
        Unregister-ScheduledTask -TaskName $name -Confirm:$false
    }

    # Register
    Register-ScheduledTask `
        -TaskName $name `
        -Description $task.Description `
        -Trigger $trigger `
        -Action $action `
        -Settings $settings `
        -RunLevel Limited

    Write-Host "  OK: $name — $($task.Time) — $($task.Description)" -ForegroundColor Green
}

# --- Startup task (runs at logon) ---
Write-Host "`nInstalling startup task..." -ForegroundColor Cyan

$startupScript = "$ScriptsDir\Startup-DWS.ps1"
if (Test-Path $startupScript) {
    $existing = Get-ScheduledTask -TaskName 'DWS-Startup' -ErrorAction SilentlyContinue
    if ($existing) { Unregister-ScheduledTask -TaskName 'DWS-Startup' -Confirm:$false }

    $trigger = New-ScheduledTaskTrigger -AtLogOn
    $action = New-ScheduledTaskAction `
        -Execute 'pwsh.exe' `
        -Argument "-NonInteractive -NoProfile -File `"$startupScript`"" `
        -WorkingDirectory $RepoRoot
    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable

    Register-ScheduledTask `
        -TaskName 'DWS-Startup' `
        -Description 'DWS: Startup — git pull, check DGX Spark, run missed tasks' `
        -Trigger $trigger `
        -Action $action `
        -Settings $settings `
        -RunLevel Limited

    Write-Host "  OK: DWS-Startup — at logon — git pull, DGX check, missed tasks" -ForegroundColor Green
}

Write-Host "`nAll tasks installed. Verify with:" -ForegroundColor Cyan
Write-Host "  Get-ScheduledTask | Where-Object TaskName -like 'DWS-*' | Format-Table TaskName, State, NextRunTime"
Write-Host ""
