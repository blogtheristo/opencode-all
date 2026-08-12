<#
.SYNOPSIS
    PowerShell launcher for Continue + Ollama tunnel + Cursor.

.DESCRIPTION
    Starts the tunnel watchdog (if not already running), waits until the tunnel
    health endpoint responds, then opens Cursor in the repo root.

.EXAMPLE
    .\scripts\Start-Continue-Ollama-Tunnel.ps1
#>

param(
    [string]$RemoteSsh = "admin100@192.168.101.113",
    [int]$LocalPort = 11435,
    [int]$RemotePort = 11434,
    [int]$MaxWaitSeconds = 15,
    [string]$OllamaModel = "qwen3-coder:30b",
    [switch]$SkipDiagnostics,
    [switch]$SkipCursor
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$watchdogScript = Join-Path $PSScriptRoot "Start-OllamaTunnel-Watchdog.ps1"
$testTunnelScript = Join-Path $PSScriptRoot "Test-Continue-OllamaTunnel.ps1"
$continueTemplate = Join-Path $repoRoot "docs\continue-ollama-tunnel.yaml"
$tagsUrl = "http://localhost:$LocalPort/api/tags"
$baseUrl = "http://127.0.0.1:$LocalPort"

if (-not (Test-Path $watchdogScript)) {
    throw "Missing watchdog script: $watchdogScript"
}

function Get-WatchdogProcess {
    $procs = Get-CimInstance Win32_Process -Filter "Name='pwsh.exe'" -ErrorAction SilentlyContinue
    if (-not $procs) { return $null }

    foreach ($p in $procs) {
        $cmd = [string]$p.CommandLine
        if ($cmd -like "*Start-OllamaTunnel-Watchdog.ps1*") {
            return $p
        }
    }

    return $null
}

function Test-Tunnel {
    try {
        Invoke-RestMethod -Uri $tagsUrl -Method Get -TimeoutSec 2 | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

if (-not (Get-WatchdogProcess)) {
    Write-Host "[INFO] Starting tunnel watchdog..." -ForegroundColor Cyan
    Start-Process pwsh -ArgumentList @(
        "-NoExit",
        "-ExecutionPolicy", "Bypass",
        "-File", $watchdogScript,
        "-RemoteSsh", $RemoteSsh,
        "-LocalPort", $LocalPort,
        "-RemotePort", $RemotePort
    ) | Out-Null
}
else {
    Write-Host "[INFO] Tunnel watchdog already running." -ForegroundColor DarkCyan
}

Write-Host "[INFO] Waiting for tunnel at $tagsUrl ..." -ForegroundColor Cyan
$ready = $false
for ($i = 0; $i -lt $MaxWaitSeconds; $i++) {
    if (Test-Tunnel) {
        $ready = $true
        break
    }

    Start-Sleep -Seconds 1
}

if ($ready) {
    Write-Host "[OK] Tunnel reachable." -ForegroundColor Green
}
else {
    Write-Host "[WARN] Tunnel did not respond in $MaxWaitSeconds seconds. Opening Cursor anyway." -ForegroundColor Yellow
}

if (-not $SkipDiagnostics -and (Test-Path $testTunnelScript)) {
    try {
        & $testTunnelScript -BaseUrl $baseUrl -Model $OllamaModel
    }
    catch {
        Write-Host "[WARN] Diagnostics failed (tunnel or model). Fix errors above; config template: $continueTemplate" -ForegroundColor Yellow
    }
}
elseif (-not $SkipDiagnostics) {
    Write-Host "[WARN] Missing $testTunnelScript — run Test-Continue-OllamaTunnel.ps1 manually." -ForegroundColor Yellow
}

$cfgPath = Join-Path $env:USERPROFILE ".continue\config.yaml"
Write-Host "`nContinue config: $cfgPath" -ForegroundColor DarkGray
Write-Host "YAML template:  $continueTemplate" -ForegroundColor DarkGray
Write-Host "Use apiBase: $baseUrl (127.0.0.1 avoids some Windows localhost issues)." -ForegroundColor DarkGray

if ($SkipCursor) {
    Write-Host "[INFO] -SkipCursor: not launching Cursor." -ForegroundColor Cyan
    return
}

$cursorExe = Join-Path $env:LOCALAPPDATA "Programs\cursor\Cursor.exe"
if (Test-Path $cursorExe) {
    Start-Process $cursorExe -ArgumentList $repoRoot | Out-Null
    Write-Host "[OK] Cursor started via Cursor.exe." -ForegroundColor Green
    return
}

$cursorCmd = Get-Command cursor -ErrorAction SilentlyContinue
if ($cursorCmd) {
    Start-Process $cursorCmd.Source -ArgumentList $repoRoot | Out-Null
    Write-Host "[OK] Cursor started via cursor CLI." -ForegroundColor Green
    return
}

Write-Host "[WARN] Cursor executable not found. Opening repo folder instead." -ForegroundColor Yellow
Start-Process explorer.exe -ArgumentList $repoRoot | Out-Null
