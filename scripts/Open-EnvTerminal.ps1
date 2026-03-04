#requires -Version 7.0
<#
.SYNOPSIS
    Launches a PowerShell terminal that automatically loads secrets from .env.mcp.

.DESCRIPTION
    Reads key/value pairs from the provided .env file, injects them into the
    environment, changes directory to the repository root, and (by default)
    spawns a new PowerShell window that stays open for further commands.

.PARAMETER EnvFile
    Relative path to the .env file (defaults to ".env.mcp").

.PARAMETER ReuseCurrentWindow
    When provided, the current PowerShell session is updated instead of launching
    a new window.

.EXAMPLE
    pwsh -File .\scripts\Open-EnvTerminal.ps1

.EXAMPLE
    pwsh -File .\scripts\Open-EnvTerminal.ps1 -ReuseCurrentWindow
#>
param(
    [string]$EnvFile = ".env.mcp",
    [switch]$ReuseCurrentWindow
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path -Path $projectRoot -ChildPath $EnvFile
$activatePath = Join-Path -Path $projectRoot -ChildPath "venv\Scripts\Activate.ps1"

if (-not (Test-Path -Path $envPath)) {
    Write-Warning "Cannot find '$EnvFile' in $projectRoot. Create it (copy from env.mcp.example) and rerun."
    exit 1
}

$envPairs = @{}
Get-Content -Path $envPath | ForEach-Object {
    $line = $_.Trim()
    if (-not $line) { return }
    if ($line.StartsWith("#")) { return }

    $split = $line -split "=", 2
    if ($split.Count -lt 2) {
        Write-Warning "Skipping invalid line: $line"
        return
    }

    $name = $split[0].Trim()
    $value = $split[1].Trim()

    if (-not $name) {
        Write-Warning "Skipping unnamed variable in line: $line"
        return
    }

    $envPairs[$name] = $value
}

if ($envPairs.Count -eq 0) {
    Write-Warning "No variables discovered inside $EnvFile. Populate it before continuing."
    exit 1
}

function Set-EnvVariables {
    param([hashtable]$Pairs)

    foreach ($entry in $Pairs.GetEnumerator()) {
        $name = $entry.Key
        $value = $entry.Value
        [Environment]::SetEnvironmentVariable($name, $value, "Process")
        Set-Item -Path "Env:$name" -Value $value
    }
}

function Invoke-Venv {
    if (Test-Path -Path $activatePath) {
        . $activatePath
        Write-Host "Python virtual environment activated via $activatePath" -ForegroundColor DarkCyan
    }
    else {
        Write-Host "Skipping virtual environment activation (venv\Scripts\Activate.ps1 not found)." -ForegroundColor Yellow
    }
}

if ($ReuseCurrentWindow) {
    Set-Location -Path $projectRoot
    Set-EnvVariables -Pairs $envPairs
    Invoke-Venv
    Write-Host "Loaded $($envPairs.Count) variables from $EnvFile into current session." -ForegroundColor Green
    return
}

$scriptLines = @("Set-Location -Path '$projectRoot'")
foreach ($entry in $envPairs.GetEnumerator()) {
    $name = $entry.Key.Replace("'", "''")
    $value = $entry.Value.Replace("'", "''")
    $scriptLines += "[Environment]::SetEnvironmentVariable('$name', '$value', 'Process')"
    $scriptLines += "`$env:$name = '$value'"
}
$scriptLines += "if (Test-Path '$activatePath') { . '$activatePath'; Write-Host 'Python virtual environment activated via $activatePath' -ForegroundColor DarkCyan } else { Write-Host 'Skipping virtual environment activation (venv\Scripts\Activate.ps1 not found).' -ForegroundColor Yellow }"
$scriptLines += "Write-Host 'Loaded $($envPairs.Count) variables from $EnvFile (auto terminal).' -ForegroundColor Green"
$scriptLines += "Write-Host 'Repo root: $projectRoot' -ForegroundColor DarkGray"
$commandString = $scriptLines -join "; "

Start-Process pwsh -ArgumentList "-NoExit", "-Command", $commandString | Out-Null

Write-Host "New PowerShell window launched with $($envPairs.Count) environment variables from $EnvFile." -ForegroundColor Green
Write-Host "Close this bootstrap shell if no longer needed." -ForegroundColor DarkGray
