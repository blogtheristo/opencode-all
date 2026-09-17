<#
.SYNOPSIS
    Keeps SSH tunnel to remote Ollama alive with auto-reconnect.

.DESCRIPTION
    Watches localhost tunnel health and restarts ssh.exe when connection drops.
    Designed for long Cursor sessions where laptop sleep/network blips can kill
    a one-shot tunnel process.

.EXAMPLE
    pwsh -NoProfile -File .\scripts\Start-OllamaTunnel-Watchdog.ps1
#>

param(
    [string]$RemoteSsh = "admin100@192.168.101.113",
    [string]$LocalBindAddress = "127.0.0.1",
    [int]$LocalPort = 11435,
    [int]$RemotePort = 11434,
    [int]$CheckIntervalSec = 10
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$logDir = Join-Path $repoRoot "logs"
$logFile = Join-Path $logDir "ollama-tunnel-watchdog.log"
if (-not (Test-Path $logDir)) {
    New-Item -Path $logDir -ItemType Directory -Force | Out-Null
}

$tunnelArg = "-L $LocalBindAddress`:$LocalPort`:localhost`:$RemotePort"
$tagsUrl = "http://localhost:$LocalPort/api/tags"
$healthUrls = @("http://localhost:$LocalPort/api/tags", "http://127.0.0.1:$LocalPort/api/tags")
$localIpv4 = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -ne "0.0.0.0" -and
        $_.PrefixOrigin -ne "WellKnown"
    } |
    Select-Object -ExpandProperty IPAddress -Unique

foreach ($ip in $localIpv4) {
    $healthUrls += "http://${ip}:$LocalPort/api/tags"
}

function Write-Log {
    param([string]$Message)
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] $Message"
    Write-Host $line
    Add-Content -Path $logFile -Value $line -ErrorAction SilentlyContinue
}

function Test-Tunnel {
    foreach ($url in $healthUrls) {
        try {
            Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 3 | Out-Null
            return $true
        }
        catch {
            continue
        }
    }

    return $false
}

function Get-ExistingTunnelProcesses {
    $candidates = Get-CimInstance Win32_Process -Filter "Name='ssh.exe'" -ErrorAction SilentlyContinue
    if (-not $candidates) { return @() }

    $matches = @()
    $forwardSignature = ":$LocalPort`:localhost`:$RemotePort"

    foreach ($proc in $candidates) {
        $cmd = [string]$proc.CommandLine
        if ($cmd -like "*$forwardSignature*" -and $cmd -like "*$RemoteSsh*") {
            $matches += $proc
        }
    }

    return $matches
}

function Start-TunnelProcess {
    $sshArgs = @(
        "-N"
        "-o", "ExitOnForwardFailure=yes"
        "-o", "ServerAliveInterval=30"
        "-o", "ServerAliveCountMax=3"
        "-o", "TCPKeepAlive=yes"
        "-L", "$LocalBindAddress`:$LocalPort`:localhost`:$RemotePort"
        $RemoteSsh
    )

    Start-Process -FilePath "ssh.exe" -ArgumentList $sshArgs -WindowStyle Hidden | Out-Null
    Start-Sleep -Seconds 1
}

Write-Log "Starting Ollama tunnel watchdog: $RemoteSsh (${LocalBindAddress}:$LocalPort -> localhost:$RemotePort)"
Write-Log "Health endpoint: $tagsUrl"
Write-Log "Health probes: $($healthUrls -join ', ')"

while ($true) {
    $tunnelOk = Test-Tunnel
    $existing = @(Get-ExistingTunnelProcesses)

    if ($tunnelOk) {
        if ($existing.Count -gt 0) {
            Write-Log "Tunnel healthy (pid(s)=$($existing.ProcessId -join ','))."
            if ($existing.Count -gt 1) {
                $duplicatePids = $existing | Select-Object -Skip 1 -ExpandProperty ProcessId
                foreach ($dupTunnelPid in $duplicatePids) {
                    Write-Log "Stopping duplicate ssh tunnel pid=$dupTunnelPid."
                    Stop-Process -Id $dupTunnelPid -Force -ErrorAction SilentlyContinue
                }
            }
        }
        else {
            Write-Log "Tunnel responds but ssh process not found by signature; continuing."
        }
    }
    else {
        if ($existing.Count -gt 0) {
            foreach ($proc in $existing) {
                Write-Log "Tunnel unhealthy; stopping stale ssh pid=$($proc.ProcessId)."
                Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
            }
            Start-Sleep -Milliseconds 750
        }

        Write-Log "Starting ssh tunnel process..."
        Start-TunnelProcess

        if (Test-Tunnel) {
            $newProc = @(Get-ExistingTunnelProcesses)
            if ($newProc.Count -gt 0) {
                Write-Log "Tunnel reconnected (pid(s)=$($newProc.ProcessId -join ','))."
            }
            else {
                Write-Log "Tunnel reconnected."
            }
        }
        else {
            Write-Log "Tunnel still down; retrying in $CheckIntervalSec sec."
        }
    }

    Start-Sleep -Seconds $CheckIntervalSec
}
