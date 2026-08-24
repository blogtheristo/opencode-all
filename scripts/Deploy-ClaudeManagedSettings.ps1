#requires -Version 5.1
<#
.SYNOPSIS
    Deploys managed-settings.json to C:\Program Files\ClaudeCode\ (requires admin).

.DESCRIPTION
    Copies ClaudeCode/managed-settings.json.example to the system location.
    Must be run as Administrator (right-click → Run as administrator).

.EXAMPLE
    .\Deploy-ClaudeManagedSettings.ps1
#>
param(
    [string]$RepoRoot = (Split-Path -Parent $PSScriptRoot),
    [switch]$Elevate
)

$destDir = "C:\Program Files\ClaudeCode"
$destFile = "$destDir\managed-settings.json"
$src = Join-Path $RepoRoot "ClaudeCode\managed-settings.json.example"

if (-not (Test-Path $src)) {
    Write-Error "Source not found: $src"
    exit 1
}

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    if ($Elevate) {
        Start-Process powershell -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs -Wait
        exit $LASTEXITCODE
    }
    Write-Host "This script requires Administrator privileges." -ForegroundColor Yellow
    Write-Host "Run with -Elevate to open an elevated prompt, or run manually as Administrator:" -ForegroundColor Gray
    Write-Host "  .\Deploy-ClaudeManagedSettings.ps1 -Elevate" -ForegroundColor Cyan
    Write-Host "  # or: Right-click PowerShell → Run as administrator → & '$PSCommandPath'" -ForegroundColor Gray
    exit 1
}

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force | Out-Null
}
Copy-Item -Path $src -Destination $destFile -Force
Write-Host "Deployed: $destFile" -ForegroundColor Green
