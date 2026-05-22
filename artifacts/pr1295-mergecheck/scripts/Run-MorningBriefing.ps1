#requires -Version 7.0
<#
.SYNOPSIS
  Runs CEO Cockpit morning briefing sender with repo .env (SES / Resend).

.DESCRIPTION
  Loads .env from the repository root (same merge as Open-EnvTerminal: primary
  .env.mcp then .env), then runs the same script as GitHub Actions cron.
  Use Windows Task Scheduler to run this daily if you do not use GitHub Actions.

.PARAMETER Force
  Send immediately, bypassing the Helsinki 06:00 hour guard (for testing).

.EXAMPLE
  pwsh -File .\scripts\Run-MorningBriefing.ps1

.EXAMPLE
  pwsh -File .\scripts\Run-MorningBriefing.ps1 -Force
#>
param(
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -Path $projectRoot

function Merge-EnvFile {
    param([hashtable]$Pairs, [string]$Path)
    if (-not (Test-Path -Path $Path)) { return }
    Get-Content -Path $Path | ForEach-Object {
        $line = $_.Trim()
        if (-not $line) { return }
        if ($line.StartsWith("#")) { return }
        $split = $line -split "=", 2
        if ($split.Count -lt 2) { return }
        $name = $split[0].Trim()
        $value = $split[1].Trim()
        if ($name) { $Pairs[$name] = $value }
    }
}

$envPairs = @{}
$mcpPath = Join-Path $projectRoot ".env.mcp"
$dotEnvPath = Join-Path $projectRoot ".env"
if (Test-Path $mcpPath) { Merge-EnvFile -Pairs $envPairs -Path $mcpPath }
Merge-EnvFile -Pairs $envPairs -Path $dotEnvPath

foreach ($entry in $envPairs.GetEnumerator()) {
    [Environment]::SetEnvironmentVariable($entry.Key, $entry.Value, "Process")
    Set-Item -Path "Env:$($entry.Key)" -Value $entry.Value
}

$argsList = @("--import", "tsx", "scripts/send-morning-briefing.ts")
if ($Force) {
    $argsList += "--force"
}

& node @argsList
exit $LASTEXITCODE
