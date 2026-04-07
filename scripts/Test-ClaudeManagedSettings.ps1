#requires -Version 5.1
<#
.SYNOPSIS
    Verifies Claude Code managed-settings.json is present and valid at the expected location.

.DESCRIPTION
    Checks endpoint compliance for the Claude Code managed settings migration (legacy path stops 2026-03-12).
    - Windows: C:\Program Files\ClaudeCode\managed-settings.json
    - macOS: /Library/Application Support/ClaudeCode/managed-settings.json
    - Linux/WSL: /etc/claude-code/managed-settings.json

    Use before the deadline to ensure MDM/endpoint deployment succeeded.

.PARAMETER ValidateJson
    Parse and validate JSON structure (requires valid JSON).

.PARAMETER JsonOnly
    Output JSON result only (for piping to other tools).

.EXAMPLE
    .\Test-ClaudeManagedSettings.ps1

.EXAMPLE
    .\Test-ClaudeManagedSettings.ps1 -ValidateJson -JsonOnly

.NOTES
    Migration: legacy path C:\ProgramData\ClaudeCode\ stops being read on 2026-03-12.
    See CLAUDE.md, docs/DWS_INFORMATION_LAYERING_STRATEGY.md, ClaudeCode/README.md
#>
param(
    [switch]$ValidateJson,
    [switch]$JsonOnly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$result = @{
    present   = $false
    path      = ""
    platform  = ""
    validJson = $null
    error     = $null
}

function Get-ManagedSettingsPath {
    if ($PSVersionTable.PSVersion.Major -ge 6) {
        if ($IsWindows) { return "C:\Program Files\ClaudeCode\managed-settings.json" }
        if ($IsMacOS) { return "/Library/Application Support/ClaudeCode/managed-settings.json" }
        return "/etc/claude-code/managed-settings.json"
    }
    if ($env:OS -match "Windows|NT") {
        return "C:\Program Files\ClaudeCode\managed-settings.json"
    }
    if (Test-Path "/Library" -ErrorAction SilentlyContinue) {
        return "/Library/Application Support/ClaudeCode/managed-settings.json"
    }
    return "/etc/claude-code/managed-settings.json"
}

$path = Get-ManagedSettingsPath
$result.path = $path
$result.platform = if ($env:OS -match "Windows|NT") { "Windows" } elseif (Test-Path "/Library") { "macOS" } else { "Linux" }

try {
    if (-not (Test-Path -Path $path -PathType Leaf)) {
        $result.error = "File not found. Deploy via MDM to: $path"
        if (-not $JsonOnly) {
            Write-Host "FAIL: managed-settings.json not found" -ForegroundColor Red
            Write-Host "  Path: $path" -ForegroundColor Gray
            Write-Host "  Action: Update MDM/endpoint config; deploy before 2026-03-12" -ForegroundColor Yellow
        }
    } else {
        $result.present = $true
        if ($ValidateJson) {
            try {
                $content = Get-Content -Path $path -Raw
                $null = $content | ConvertFrom-Json
                $result.validJson = $true
            } catch {
                $result.validJson = $false
                $result.error = $_.Exception.Message
            }
        }
        if (-not $JsonOnly) {
            Write-Host "PASS: managed-settings.json present" -ForegroundColor Green
            Write-Host "  Path: $path" -ForegroundColor Gray
            if ($null -ne $result.validJson -and -not $result.validJson) {
                Write-Host "  WARN: JSON validation failed - $($result.error)" -ForegroundColor Yellow
            }
        }
    }
} catch {
    $result.error = $_.Exception.Message
    if (-not $JsonOnly) {
        Write-Host "FAIL: $($result.error)" -ForegroundColor Red
    }
}

if ($JsonOnly) {
    $result | ConvertTo-Json -Compress
} else {
    $result
}
