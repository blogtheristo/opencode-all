<#
.SYNOPSIS
    Installs a Windows scheduled task that keeps Ollama SSH tunnel alive.

.DESCRIPTION
    Registers task DWS-OllamaTunnelWatchdog to run at logon and keep reconnecting
    via Start-OllamaTunnel-Watchdog.ps1.

.EXAMPLE
    .\scripts\Install-OllamaTunnel-Task.ps1
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$watchdogScript = Join-Path $repoRoot "scripts\Start-OllamaTunnel-Watchdog.ps1"
$taskName = "DWS-OllamaTunnelWatchdog"

if (-not (Test-Path $watchdogScript)) {
    throw "Watchdog script not found: $watchdogScript"
}

$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if ($existing) {
    try {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false -ErrorAction Stop
    }
    catch {
        throw "Failed to remove existing scheduled task '$taskName'. Run PowerShell as Administrator and retry. Details: $($_.Exception.Message)"
    }
}

$trigger = New-ScheduledTaskTrigger -AtLogOn
$action = New-ScheduledTaskAction `
    -Execute "pwsh.exe" `
    -Argument "-NonInteractive -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$watchdogScript`"" `
    -WorkingDirectory $repoRoot

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -RunOnlyIfNetworkAvailable `
    -MultipleInstances IgnoreNew `
    -RestartCount 999 `
    -RestartInterval (New-TimeSpan -Minutes 1)

try {
    Register-ScheduledTask `
        -TaskName $taskName `
        -Description "DWS: Maintain SSH tunnel to remote Ollama with auto-reconnect" `
        -Trigger $trigger `
        -Action $action `
        -Settings $settings `
        -RunLevel Limited `
        -ErrorAction Stop | Out-Null
}
catch {
    throw "Failed to register scheduled task '$taskName' (Access denied is common without elevation). Start PowerShell as Administrator and rerun this script. Details: $($_.Exception.Message)"
}

$installed = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
if (-not $installed) {
    throw "Scheduled task '$taskName' was not found after registration."
}

Write-Host "OK: Scheduled task installed: $taskName" -ForegroundColor Green
Write-Host "Run now with: Start-ScheduledTask -TaskName $taskName"
Write-Host "Check status: Get-ScheduledTask -TaskName $taskName | Format-List TaskName,State"
