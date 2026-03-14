<#
.SYNOPSIS
    Wraps DailySync pipeline steps and produces a structured JSON report.

.DESCRIPTION
    Version: 1.0

    CHANGE LOG:
      v1.0 - 14.03.2026 - Initial: health check + git pull + Proton + Supabase, JSON report output

    Runs the full DailySync pipeline and captures each step's result into
    a structured JSON report (sync-report.json). Enables agents and CI to
    check last sync status programmatically.

    Steps:
      0. Health check (Test-DailySync.ps1)
      1. git pull origin main
      2. Sync-ToProton.ps1
      3. Sync-ToSupabase.ps1 -CreateBucket

    Output: scripts/sync-report.json (overwritten each run)

.PARAMETER RepoPath
    Path to the git repo. Default: auto-detect from script location.

.PARAMETER SkipProton
    Skip Proton Drive sync step.

.PARAMETER SkipSupabase
    Skip Supabase Storage sync step.

.PARAMETER DryRun
    Pass -DryRun to sync scripts (no actual uploads).

.PARAMETER JsonOnly
    Output only the final JSON report to stdout (no console progress text).

.EXAMPLE
    .\Sync-Report.ps1
    .\Sync-Report.ps1 -DryRun
    .\Sync-Report.ps1 -JsonOnly
    .\Sync-Report.ps1 -SkipProton
#>

param(
    [string]$RepoPath = "",
    [switch]$SkipProton,
    [switch]$SkipSupabase,
    [switch]$DryRun,
    [switch]$JsonOnly
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

$ScriptsDir = Join-Path $RepoPath "scripts"
$ReportPath = Join-Path $ScriptsDir "sync-report.json"

# --- Report structure ---
$report = @{
    timestamp  = (Get-Date -Format "o")
    repo_path  = $RepoPath
    dry_run    = [bool]$DryRun
    steps      = @()
    overall    = "unknown"
}

function Run-Step {
    param(
        [string]$Name,
        [string]$Command,
        [string[]]$Args
    )

    $step = @{
        name       = $Name
        status     = "unknown"
        started_at = (Get-Date -Format "o")
        duration_s = 0
        output     = ""
        exit_code  = 0
    }

    if (-not $JsonOnly) {
        Write-Host "[$Name] Running..." -ForegroundColor Cyan
    }

    $sw = [System.Diagnostics.Stopwatch]::StartNew()

    try {
        $output = & $Command @Args 2>&1 | Out-String
        $step.exit_code = $LASTEXITCODE
        $step.output = $output.Trim()
        $step.status = if ($LASTEXITCODE -eq 0 -or $null -eq $LASTEXITCODE) { "ok" } else { "fail" }
    } catch {
        $step.status = "fail"
        $step.output = "Exception: $_"
        $step.exit_code = 1
    }

    $sw.Stop()
    $step.duration_s = [math]::Round($sw.Elapsed.TotalSeconds, 1)

    if (-not $JsonOnly) {
        $color = if ($step.status -eq "ok") { "Green" } else { "Red" }
        Write-Host "[$Name] $($step.status.ToUpper()) ($($step.duration_s)s)" -ForegroundColor $color
    }

    return $step
}

# --- Step 0: Health check ---
$healthCheckScript = Join-Path $ScriptsDir "Test-DailySync.ps1"
$step0 = Run-Step -Name "health-check" -Command "pwsh" -Args @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $healthCheckScript, "-JsonOnly")

# Parse health check JSON from output
try {
    $healthJson = $step0.output | ConvertFrom-Json
    $step0.output = $healthJson
} catch {
    # Keep raw output if JSON parsing fails
}

$report.steps += $step0

# --- Step 1: git pull ---
$locationPushed = $false
try {
    if (-not (Test-Path -LiteralPath $RepoPath)) {
        throw "RepoPath '$RepoPath' does not exist or is not accessible."
    }

    Push-Location -Path $RepoPath -ErrorAction Stop
    $locationPushed = $true

    $step1 = Run-Step -Name "git-pull" -Command "git" -Args @("pull", "origin", "main")
} catch {
    # Record git-pull as a failed step if location change or git command fails
    $step1 = @{
        name       = "git-pull"
        status     = "fail"
        started_at = (Get-Date -Format "o")
        duration_s = 0
        output     = "Exception during git-pull step: $_"
        exit_code  = 1
    }
} finally {
    if ($locationPushed) {
        Pop-Location
    }
}
$report.steps += $step1

# --- Step 2: Proton Drive sync ---
if ($SkipProton) {
    $report.steps += @{
        name       = "proton-sync"
        status     = "skip"
        started_at = (Get-Date -Format "o")
        duration_s = 0
        output     = "Skipped (-SkipProton)"
        exit_code  = 0
    }
} else {
    $protonScript = Join-Path $ScriptsDir "Sync-ToProton.ps1"
    $protonArgs = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $protonScript)
    if ($DryRun) { $protonArgs += "-DryRun" }
    $step2 = Run-Step -Name "proton-sync" -Command "pwsh" -Args $protonArgs
    $report.steps += $step2
}

# --- Step 3: Supabase Storage sync ---
if ($SkipSupabase) {
    $report.steps += @{
        name       = "supabase-sync"
        status     = "skip"
        started_at = (Get-Date -Format "o")
        duration_s = 0
        output     = "Skipped (-SkipSupabase)"
        exit_code  = 0
    }
} else {
    $supabaseScript = Join-Path $ScriptsDir "Sync-ToSupabase.ps1"
    $supabaseArgs = @("-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $supabaseScript, "-CreateBucket")
    if ($DryRun) { $supabaseArgs += "-DryRun" }
    $step3 = Run-Step -Name "supabase-sync" -Command "pwsh" -Args $supabaseArgs
    $report.steps += $step3
}

# --- Overall status ---
$failCount = ($report.steps | Where-Object { $_.status -eq "fail" }).Count
$report.overall = if ($failCount -eq 0) { "ok" } else { "fail" }
$report.completed_at = (Get-Date -Format "o")

# --- Write report file ---
$json = $report | ConvertTo-Json -Depth 5
$json | Set-Content -Path $ReportPath -Encoding UTF8

if ($JsonOnly) {
    Write-Output $json
} else {
    Write-Host ""
    Write-Host "=== DailySync Report ===" -ForegroundColor Cyan
    foreach ($s in $report.steps) {
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
        Write-Host "  $icon $($s.name.PadRight(16)) $($s.duration_s)s" -ForegroundColor $color
    }
    Write-Host ""
    $overallColor = if ($report.overall -eq "ok") { "Green" } else { "Red" }
    Write-Host "  Overall: $($report.overall.ToUpper())" -ForegroundColor $overallColor
    Write-Host "  Report:  $ReportPath" -ForegroundColor Gray
    Write-Host ""
}

# --- Exit code ---
if ($report.overall -ne "ok") { exit 1 }
