<#
.SYNOPSIS
    Red-zone runbook for booking calendar rollout.

.DESCRIPTION
    Executes deployment-adjacent steps for booking calendar:
    1) Preflight env checks
    2) Push Supabase migrations
    3) Optional backend startup
    4) Optional API smoke checks

    This script always resolves repository root from scripts/ folder location,
    so it can be run from anywhere.

.PARAMETER SkipDbPush
    Skip migration push step.

.PARAMETER StartBackend
    Start backend with npm run dev after DB push.

.PARAMETER RunSmoke
    Run basic booking API smoke checks (requires backend running).

.PARAMETER ApiBaseUrl
    Backend base URL for smoke checks.

.EXAMPLE
    pwsh -File .\scripts\Run-BookingCalendar-RedZone.ps1

.EXAMPLE
    pwsh -File .\scripts\Run-BookingCalendar-RedZone.ps1 -StartBackend

.EXAMPLE
    pwsh -File .\scripts\Run-BookingCalendar-RedZone.ps1 -RunSmoke -ApiBaseUrl "http://localhost:3000"
#>
param(
    [switch]$SkipDbPush,
    [switch]$StartBackend,
    [switch]$RunSmoke,
    [string]$ApiBaseUrl = "http://localhost:3000"
)

$ErrorActionPreference = "Stop"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Set-Location $ProjectRoot

function Import-DotEnvFile([string]$Path) {
    if (-not (Test-Path $Path)) { return }

    Get-Content $Path | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith("#")) { return }

        $idx = $line.IndexOf("=")
        if ($idx -lt 1) { return }

        $key = $line.Substring(0, $idx).Trim()
        $value = $line.Substring($idx + 1).Trim()

        if (($value.StartsWith('"') -and $value.EndsWith('"')) -or ($value.StartsWith("'") -and $value.EndsWith("'"))) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($key))) {
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }
}

function Assert-EnvVar([string]$Name) {
    if ([string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($Name))) {
        throw "Missing required env var: $Name"
    }
}

function Set-EnvFallback([string]$Target, [string[]]$Candidates) {
    if (-not [string]::IsNullOrWhiteSpace([Environment]::GetEnvironmentVariable($Target))) {
        return
    }

    foreach ($candidate in $Candidates) {
        $value = [Environment]::GetEnvironmentVariable($candidate)
        if (-not [string]::IsNullOrWhiteSpace($value)) {
            [Environment]::SetEnvironmentVariable($Target, $value, "Process")
            Write-Host "  Using $candidate as fallback for $Target" -ForegroundColor DarkGray
            return
        }
    }
}

function Invoke-SmokeGet([string]$Path) {
    $url = "$ApiBaseUrl$Path"
    Write-Host "GET $url" -ForegroundColor DarkGray
    $response = Invoke-WebRequest -Uri $url -Method GET -TimeoutSec 20
    Write-Host "  -> HTTP $($response.StatusCode)" -ForegroundColor Green
}

Write-Host "=== Booking Calendar Red-Zone Runbook ===" -ForegroundColor Cyan
Write-Host "Repo: $ProjectRoot" -ForegroundColor DarkGray
Write-Host ""

Write-Host "[1/4] Preflight checks..." -ForegroundColor Yellow
Import-DotEnvFile ".\.env"
Import-DotEnvFile ".\.env.local"
Import-DotEnvFile ".\.env.mcp"
if (-not (Test-Path ".\package.json")) { throw "package.json not found in repo root." }
if (-not (Test-Path ".\supabase\migrations\063_token_usage_optimization.sql")) { throw "Missing migration file 063." }
if (-not (Test-Path ".\supabase\migrations\064_booking_system.sql")) { throw "Missing migration file 064." }

Set-EnvFallback "SUPABASE_ACCESS_TOKEN" @("SUPABASE_TOKEN", "SUPABASE_PAT", "SUPABASE_PERSONAL_ACCESS_TOKEN")

Assert-EnvVar "SUPABASE_ACCESS_TOKEN"
Assert-EnvVar "SUPABASE_URL"
Assert-EnvVar "JWT_SECRET"

Write-Host "  Preflight OK." -ForegroundColor Green
Write-Host ""

if (-not $SkipDbPush) {
    Write-Host "[2/4] Running migration push..." -ForegroundColor Yellow
    npm run db:push
    if ($LASTEXITCODE -ne 0) { throw "npm run db:push failed with exit code $LASTEXITCODE" }
    Write-Host "  Migration push done." -ForegroundColor Green
} else {
    Write-Host "[2/4] Skipped migration push." -ForegroundColor DarkGray
}
Write-Host ""

if ($RunSmoke) {
    Write-Host "[3/4] Running smoke checks..." -ForegroundColor Yellow
    Invoke-SmokeGet "/health"
    Invoke-SmokeGet "/api/booking/services"
    Write-Host "  Smoke checks finished." -ForegroundColor Green
} else {
    Write-Host "[3/4] Smoke checks skipped." -ForegroundColor DarkGray
}
Write-Host ""

if ($StartBackend) {
    Write-Host "[4/4] Starting backend (npm run dev)..." -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop." -ForegroundColor DarkGray
    npm run dev
} else {
    Write-Host "[4/4] Backend start skipped." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "Runbook complete." -ForegroundColor Green
