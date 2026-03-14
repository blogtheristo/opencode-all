<#
.SYNOPSIS
    Health check for DWS6 DailySync pipeline — validates all sync targets before running.

.DESCRIPTION
    Version: 1.0

    CHANGE LOG:
      v1.0 - 14.03.2026 - Initial: GitHub, Proton Drive, Supabase reachability checks + JSON output

    Validates that all three sync targets are reachable:
      1. GitHub (git ls-remote)
      2. Proton Drive (F:\Proton mount check)
      3. Supabase Storage (bucket API check)

    Outputs structured JSON for agent consumption.
    Returns exit code 0 if all checks pass, 1 if any fail.

    Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY in .env for Supabase check.

.PARAMETER RepoPath
    Path to the git repo. Default: auto-detect from script location.

.PARAMETER BucketName
    Supabase Storage bucket name to check. Default: admin-vault

.PARAMETER JsonOnly
    Output only JSON (no colored console text). For agent/CI consumption.

.PARAMETER ProtonPath
    Proton Drive mount path to verify. Default: F:\Proton

.EXAMPLE
    .\Test-DailySync.ps1
    .\Test-DailySync.ps1 -JsonOnly
    .\Test-DailySync.ps1 -ProtonPath "D:\Proton"
#>

param(
    [string]$RepoPath = "",
    [string]$BucketName = "admin-vault",
    [string]$ProtonPath = "F:\Proton",
    [switch]$JsonOnly
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

# --- Load credentials from .env ---
$SupabaseUrl = ""
$SupabaseKey = ""

function Read-EnvFile {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return }
    $content = Get-Content $FilePath
    foreach ($line in $content) {
        $trimmed = $line.Trim()
        if ($trimmed -match "^SUPABASE_URL=(.+)$") {
            if (-not $script:SupabaseUrl) {
                $script:SupabaseUrl = $Matches[1].Trim().Trim('"').Trim("'")
            }
        }
        if ($trimmed -match "^SUPABASE_SERVICE_(?:ROLE_)?KEY=(.+)$") {
            if (-not $script:SupabaseKey) {
                $script:SupabaseKey = $Matches[1].Trim().Trim('"').Trim("'")
            }
        }
    }
}

Read-EnvFile (Join-Path $RepoPath ".env")
Read-EnvFile (Join-Path $RepoPath ".env.mcp")
Read-EnvFile (Join-Path $RepoPath "env.mcp")

# --- Results object ---
$results = @{
    timestamp = (Get-Date -Format "o")
    checks = @{
        github = @{ status = "unknown"; message = "" }
        proton = @{ status = "unknown"; message = "" }
        supabase = @{ status = "unknown"; message = "" }
    }
    all_passed = $false
}

# --- Check 1: GitHub ---
if (-not $JsonOnly) { Write-Host "Checking GitHub..." -ForegroundColor Cyan }
$pushed = $false
try {
    Push-Location -Path $RepoPath -ErrorAction Stop
    $pushed = $true
    $gitOutput = git ls-remote --exit-code origin HEAD 2>&1
    if ($LASTEXITCODE -eq 0) {
        $results.checks.github.status = "ok"
        $results.checks.github.message = "GitHub remote reachable"
    } else {
        $results.checks.github.status = "fail"
        $results.checks.github.message = "git ls-remote failed (exit $LASTEXITCODE)"
    }
} catch {
    $results.checks.github.status = "fail"
    $results.checks.github.message = "Exception: $_"
} finally {
    if ($pushed) {
        Pop-Location
    }
}

# --- Check 2: Proton Drive ---
if (-not $JsonOnly) { Write-Host "Checking Proton Drive..." -ForegroundColor Cyan }
if (Test-Path $ProtonPath) {
    $results.checks.proton.status = "ok"
    $results.checks.proton.message = "Proton Drive mounted at $ProtonPath"
} else {
    $results.checks.proton.status = "fail"
    $results.checks.proton.message = "Proton Drive not found at $ProtonPath"
}

# --- Check 3: Supabase Storage ---
if (-not $JsonOnly) { Write-Host "Checking Supabase Storage..." -ForegroundColor Cyan }
if (-not $SupabaseUrl -or -not $SupabaseKey) {
    $results.checks.supabase.status = "fail"
    $results.checks.supabase.message = "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env"
} else {
    try {
        $response = Invoke-RestMethod -Uri "$SupabaseUrl/storage/v1/bucket/$BucketName" `
            -Method GET `
            -Headers @{
                "Authorization" = "Bearer $SupabaseKey"
                "apikey" = $SupabaseKey
            } `
            -ErrorAction Stop
        $results.checks.supabase.status = "ok"
        $results.checks.supabase.message = "Bucket '$BucketName' exists and accessible"
    } catch {
        $statusCode = $null
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            $statusCode = $_.Exception.Response.StatusCode.value__
        }

        if ($statusCode -eq $null) {
            # No HTTP response available (likely network/DNS/TLS error)
            $results.checks.supabase.status = "fail"
            $results.checks.supabase.message = "No HTTP response from Supabase (network/DNS/TLS error): $_"
        } elseif ($statusCode -eq 404) {
            $results.checks.supabase.status = "fail"
            $results.checks.supabase.message = "Bucket '$BucketName' not found (404). Run: Sync-ToSupabase.ps1 -CreateBucket"
        } elseif ($statusCode -eq 401 -or $statusCode -eq 403) {
            $results.checks.supabase.status = "fail"
            $results.checks.supabase.message = "Auth failed ($statusCode). Check SUPABASE_SERVICE_KEY"
        } else {
            $results.checks.supabase.status = "fail"
            $results.checks.supabase.message = "HTTP $statusCode - $_"
        }
    }
}

# --- Evaluate overall ---
$statuses = @($results.checks.github.status, $results.checks.proton.status, $results.checks.supabase.status)
$results.all_passed = ($statuses | Where-Object { $_ -eq "fail" }).Count -eq 0

# --- Output ---
$json = $results | ConvertTo-Json -Depth 3

if ($JsonOnly) {
    Write-Output $json
} else {
    Write-Host ""
    Write-Host "=== DWS6 DailySync Health Check ===" -ForegroundColor Cyan
    foreach ($check in @("github", "proton", "supabase")) {
        $s = $results.checks[$check]
        $icon = switch ($s.status) {
            "ok"   { "[OK]" }
            "fail" { "[FAIL]" }
            "skip" { "[SKIP]" }
            default { "[?]" }
        }
        $color = switch ($s.status) {
            "ok"   { "Green" }
            "fail" { "Red" }
            "skip" { "Yellow" }
            default { "Gray" }
        }
        Write-Host "  $icon $($check.PadRight(10)) $($s.message)" -ForegroundColor $color
    }
    Write-Host ""
    if ($results.all_passed) {
        Write-Host "  All checks passed. Safe to run DailySync." -ForegroundColor Green
    } else {
        Write-Host "  Some checks failed. Fix before running DailySync." -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "JSON output:" -ForegroundColor Gray
    Write-Output $json
}

# --- Exit code ---
if (-not $results.all_passed) { exit 1 }
