<#
.SYNOPSIS
    Link Supabase project and push migrations.

.DESCRIPTION
    Links the DWS6 Supabase project (kpucuwwfhuwurdxyjjtz) and applies
    all pending migrations from supabase/migrations/.

.PARAMETER SkipLink
    Skip the link step (use if already linked).

.EXAMPLE
    pwsh -File .\scripts\db_push.ps1

.EXAMPLE
    pwsh -File .\scripts\db_push.ps1 -SkipLink
#>
param(
    [switch]$SkipLink
)

$ErrorActionPreference = "Stop"
$ProjectRef = $env:SUPABASE_PROJECT_REF ?? "kpucuwwfhuwurdxyjjtz"
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Set-Location $ProjectRoot

Write-Host "=== Supabase DB Push ===" -ForegroundColor Cyan
Write-Host "  Project ref: $ProjectRef" -ForegroundColor DarkGray
Write-Host ""

if (-not $SkipLink) {
    Write-Host "[1/2] Linking project..." -ForegroundColor Yellow
    npx supabase link --project-ref $ProjectRef
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Link failed. If already linked, run: pwsh -File .\scripts\db_push.ps1 -SkipLink" -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "  Done." -ForegroundColor Green
} else {
    Write-Host "[1/2] Skipping link (already linked)." -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "[2/2] Pushing migrations..." -ForegroundColor Yellow
npx supabase db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed." -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Done. Migrations applied." -ForegroundColor Green
