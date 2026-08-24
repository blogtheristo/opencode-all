# Morning Emails — Unified Local Runner (Windows)
#
# Runs ALL daily email digests from this machine. Replaces 7 GitHub Actions workflows.
# Trigger: Windows Task Scheduler at 05:00 EET, or run manually on machine startup.
#
# Usage:
#   .\scripts\run-morning-emails.ps1              # Run all morning emails
#   .\scripts\run-morning-emails.ps1 -Test        # Dry run (bypasses time/day checks)
#   .\scripts\run-morning-emails.ps1 -Install     # Install Windows Task Scheduler task
#   .\scripts\run-morning-emails.ps1 -Status      # Show last run status
#   .\scripts\run-morning-emails.ps1 -Uninstall   # Remove scheduled task
#
# Code-Version: 1.0
# Introduced-In: PR-morning-brief-feature
# Date: 2026-03-27
# Owner: risto@lifetime.fi

param(
    [switch]$Test,
    [switch]$Install,
    [switch]$Uninstall,
    [switch]$Status
)

$ErrorActionPreference = 'Continue'
$ProjectDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$LogDir = Join-Path $ProjectDir 'logs'
$LogFile = Join-Path $LogDir 'morning-emails.log'
$LockFile = Join-Path $LogDir '.morning-emails-today'
$TaskName = 'DWS6-MorningEmails'

if (-not (Test-Path $LogDir)) { New-Item -ItemType Directory -Path $LogDir -Force | Out-Null }

function Write-Log {
    param([string]$Message)
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "[$ts] $Message"
    Add-Content -Path $LogFile -Value $line
    Write-Host $line
}

# ---------------------------------------------------------------------------
# Lock file: prevent double-send on same day
# ---------------------------------------------------------------------------

function Test-AlreadySentToday {
    if (Test-Path $LockFile) {
        $lockDate = Get-Content $LockFile -Raw
        $today = Get-Date -Format 'yyyy-MM-dd'
        return $lockDate.Trim() -eq $today
    }
    return $false
}

function Set-SentToday {
    Get-Date -Format 'yyyy-MM-dd' | Set-Content $LockFile
}

# ---------------------------------------------------------------------------
# Email runners — each is best-effort (failure doesn't block the next)
# ---------------------------------------------------------------------------

function Get-DayOfWeek { return (Get-Date).DayOfWeek }
function Get-IsWeekday { return (Get-DayOfWeek) -notin @('Saturday', 'Sunday') }
function Get-IsFriday { return (Get-DayOfWeek) -eq 'Friday' }
function Get-IsMonday { return (Get-DayOfWeek) -eq 'Monday' }
function Get-IsMonSat { return (Get-DayOfWeek) -ne 'Sunday' }

function Invoke-Script {
    param(
        [string]$Name,
        [string]$Script,
        [string[]]$Args = @()
    )
    Write-Log "--- $Name ---"
    try {
        $allArgs = @('tsx', $Script) + $Args
        $output = & npx @allArgs 2>&1 | Out-String
        Write-Log $output.Trim()
        Write-Log "$Name OK"
    } catch {
        Write-Log "$Name FAILED: $_"
    }
}

function Send-AllMorningEmails {
    $isMonSat = Get-IsMonSat
    $isWeekday = Get-IsWeekday
    $isFriday = Get-IsFriday
    $isMonday = Get-IsMonday

    Write-Log "========== MORNING EMAILS START =========="
    Write-Log "Day: $(Get-Date -Format 'ddd yyyy-MM-dd HH:mm') | MonSat=$isMonSat Weekday=$isWeekday Friday=$isFriday Monday=$isMonday"

    # 1. EU Regulation Monitor (Mon-Fri, was 05:30)
    if ($isWeekday) {
        Invoke-Script 'Regulation Digest' 'scripts/send-regulation-digest.ts'
    }

    # 2. CEO Cockpit Morning Briefing (Mon-Sat, was 06:00)
    if ($isMonSat) {
        Invoke-Script 'CEO Cockpit' 'scripts/send-morning-briefing.ts'
    }

    # 3. Outreach Digest (Mon-Sat, was 06:05)
    if ($isMonSat) {
        Invoke-Script 'Outreach Digest' 'scripts/send-outreach-digest.ts'
    }

    # 4. Captain Pre-Briefing (Mon-Fri, was 07:30)
    if ($isWeekday) {
        Invoke-Script 'Captain Briefing' 'scripts/send-captain-briefing.ts' @('--auto')
    }

    # 5. Social Digest / LinkedIn Queue (Mon-Fri, was 08:00)
    if ($isWeekday) {
        Invoke-Script 'Social Digest' 'scripts/send-social-digest.ts'
    }

    # 6. Weekly Campaign Newsletter (Friday only, was 08:00)
    if ($isFriday) {
        Invoke-Script 'Campaign Newsletter' 'scripts/send-campaign-newsletter.ts'
    }

    # 7. Weekly Report (Monday only, was 09:00 UTC)
    if ($isMonday) {
        Invoke-Script 'Weekly Report' 'scripts/send-weekly-report-email.ts'
    }

    Write-Log "========== MORNING EMAILS DONE =========="
}

# ---------------------------------------------------------------------------
# Sub-commands
# ---------------------------------------------------------------------------

Push-Location $ProjectDir
$env:SKIP_TIME_CHECK = 'true'

if ($Status) {
    Write-Host "Task Scheduler status:"
    schtasks /Query /TN $TaskName 2>$null || Write-Host "Task '$TaskName' not found."
    Write-Host ""
    Write-Host "Lock file:"
    if (Test-Path $LockFile) { Write-Host "  Last sent: $(Get-Content $LockFile)" } else { Write-Host "  (none)" }
    Write-Host ""
    Write-Host "Last 30 log lines:"
    if (Test-Path $LogFile) { Get-Content $LogFile -Tail 30 } else { Write-Host "  (no logs yet)" }
    Pop-Location
    return
}

if ($Install) {
    # Task Scheduler: 05:00 EET daily + on logon
    $scriptPath = Join-Path $ProjectDir 'scripts\run-morning-emails.ps1'
    $action = New-ScheduledTaskAction `
        -Execute 'pwsh.exe' `
        -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" `
        -WorkingDirectory $ProjectDir

    # Trigger 1: Daily at 05:00 EET (03:00 UTC winter, 02:00 UTC summer — use local time)
    $triggerDaily = New-ScheduledTaskTrigger -Daily -At '05:00'

    # Trigger 2: On user logon (catches "HIL opens machine" case)
    $triggerLogon = New-ScheduledTaskTrigger -AtLogOn

    $settings = New-ScheduledTaskSettingsSet `
        -AllowStartIfOnBatteries `
        -DontStopIfGoingOnBatteries `
        -StartWhenAvailable `
        -RunOnlyIfNetworkAvailable

    Register-ScheduledTask `
        -TaskName $TaskName `
        -Action $action `
        -Trigger @($triggerDaily, $triggerLogon) `
        -Settings $settings `
        -Description 'DWS6 Morning Emails — CEO Cockpit, Outreach, Regulation, Social, Captain' `
        -Force

    Write-Host "Installed Task Scheduler task '$TaskName':"
    Write-Host "  - Daily at 05:00 (local time)"
    Write-Host "  - On user logon"
    schtasks /Query /TN $TaskName 2>$null
    Pop-Location
    return
}

if ($Uninstall) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
    Write-Host "Task '$TaskName' removed."
    Pop-Location
    return
}

# --- Default: send emails ---

if (-not $Test) {
    # Check lock — don't double-send
    if (Test-AlreadySentToday) {
        Write-Log "Already sent today. Skipping. Use -Test to force."
        Pop-Location
        return
    }
}

Send-AllMorningEmails

if (-not $Test) {
    Set-SentToday
}

Pop-Location
