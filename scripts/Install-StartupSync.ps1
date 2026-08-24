<#
.SYNOPSIS
    Creates a Windows Startup folder shortcut for daily DWS6 sync.

.DESCRIPTION
    Version: 1.1

    CHANGE LOG:
      v1.0 - 05.02.2026 - Initial: creates .lnk shortcut in Startup folder
      v1.1 - 07.02.2026 - Documented versioning

    Places a shortcut to Startup-DailySync.bat in:
      %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup

    After running this script, the sync will run automatically
    every time you log into Windows.

.EXAMPLE
    .\Install-StartupSync.ps1
    .\Install-StartupSync.ps1 -Remove   # Remove the shortcut
#>

param(
    [switch]$Remove
)

$StartupFolder = [System.IO.Path]::Combine(
    $env:APPDATA,
    "Microsoft\Windows\Start Menu\Programs\Startup"
)

$ShortcutPath = Join-Path $StartupFolder "DWS6-DailySync.lnk"
$BatFile = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "Startup-DailySync.bat"

if ($Remove) {
    if (Test-Path $ShortcutPath) {
        Remove-Item $ShortcutPath -Force
        Write-Host "Removed startup shortcut: $ShortcutPath" -ForegroundColor Green
    } else {
        Write-Host "No shortcut found to remove." -ForegroundColor Gray
    }
    return
}

if (-not (Test-Path $BatFile)) {
    Write-Error "Batch file not found: $BatFile"
    exit 1
}

# Create shortcut
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $BatFile
$Shortcut.WorkingDirectory = Split-Path -Parent $BatFile
$Shortcut.WindowStyle = 7  # Minimized
$Shortcut.Description = "DWS6 daily git pull + Proton Drive sync"
$Shortcut.Save()

Write-Host ""
Write-Host "=== Startup Shortcut Installed ===" -ForegroundColor Green
Write-Host "  Shortcut: $ShortcutPath"
Write-Host "  Target:   $BatFile"
Write-Host "  Window:   Minimized"
Write-Host ""
Write-Host "The sync will run every time you log into Windows." -ForegroundColor Cyan
Write-Host "To remove: .\Install-StartupSync.ps1 -Remove" -ForegroundColor Gray
Write-Host ""
