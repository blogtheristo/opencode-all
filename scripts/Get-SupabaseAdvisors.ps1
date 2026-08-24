# Get Supabase Security Advisor Critical Errors
# Requires: SUPABASE_ACCESS_TOKEN (Personal Access Token from https://supabase.com/dashboard/account/tokens)
# Project ref is extracted from SUPABASE_URL (e.g. kpucuwwfhuwurdxyjjtz from https://kpucuwwfhuwurdxyjjtz.supabase.co)

param(
    [string]$Token = $env:SUPABASE_ACCESS_TOKEN,
    [string]$ProjectRef = $env:SUPABASE_PROJECT_REF,
    [switch]$CriticalOnly,
    [switch]$Json
)

$ErrorActionPreference = "Stop"

if (-not $Token) {
    Write-Host "ERROR: SUPABASE_ACCESS_TOKEN required." -ForegroundColor Red
    Write-Host "  1. Go to https://supabase.com/dashboard/account/tokens"
    Write-Host "  2. Create a Personal Access Token (PAT)"
    Write-Host "  3. Run: `$env:SUPABASE_ACCESS_TOKEN='sbp_xxx'; .\scripts\Get-SupabaseAdvisors.ps1"
    exit 1
}

if (-not $ProjectRef) {
    $Url = $env:SUPABASE_URL
    if ($Url -match 'https://([a-z0-9]+)\.supabase\.co') {
        $ProjectRef = $Matches[1]
    } else {
        Write-Host "ERROR: Set SUPABASE_PROJECT_REF or SUPABASE_URL (e.g. https://kpucuwwfhuwurdxyjjtz.supabase.co)" -ForegroundColor Red
        exit 1
    }
}

$uri = "https://api.supabase.com/v1/projects/$ProjectRef/advisors/security"
$headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type"  = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "ERROR: Invalid or expired token. Create a new PAT at https://supabase.com/dashboard/account/tokens" -ForegroundColor Red
    } elseif ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "ERROR: Token lacks advisors_read permission." -ForegroundColor Red
    } else {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    exit 1
}

$lints = $response.lints
if (-not $lints) {
    Write-Host "No advisor issues found." -ForegroundColor Green
    exit 0
}

if ($CriticalOnly) {
    $lints = $lints | Where-Object { $_.level -eq "ERROR" }
}

if ($Json) {
    $lints | ConvertTo-Json -Depth 5
    exit 0
}

$critical = $lints | Where-Object { $_.level -eq "ERROR" }
$warn = $lints | Where-Object { $_.level -eq "WARN" }
$info = $lints | Where-Object { $_.level -eq "INFO" }

Write-Host "`n=== Supabase Security Advisor ===" -ForegroundColor Cyan
Write-Host "Project: $ProjectRef"
Write-Host "ERROR: $($critical.Count) | WARN: $($warn.Count) | INFO: $($info.Count)`n"

foreach ($lint in $lints) {
    $color = switch ($lint.level) { "ERROR" { "Red" }; "WARN" { "Yellow" }; default { "Gray" } }
    Write-Host "[$($lint.level)] $($lint.name)" -ForegroundColor $color
    Write-Host "  $($lint.detail)"
    if ($lint.remediation) { Write-Host "  Fix: $($lint.remediation)" -ForegroundColor DarkGray }
    Write-Host ""
}
