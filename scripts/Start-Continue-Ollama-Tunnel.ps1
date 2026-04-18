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
    [string]$RemoteSsh = "admin100@gn100-cb5d",
    [int]$LocalPort = 11435,
    [int]$RemotePort = 11434,
    [int]$MaxWaitSeconds = 15
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$watchdogScript = Join-Path $PSScriptRoot "Start-OllamaTunnel-Watchdog.ps1"
$tagsUrl = "http://localhost:$LocalPort/api/tags"

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
