<#
.SYNOPSIS
  Apply, back up, or restore the per-environment Claude Code local settings.

.DESCRIPTION
  .claude/settings.local.json is git-ignored, because Claude Code writes to it
  during a session and because it is genuinely machine-local. That gitignore is
  itself a risk: on a fresh clone (Chromebook, DGX Spark, or an ephemeral cloud
  container) the file simply does not exist, and the configuration is lost.

  This script is the recovery route. There are two layers:

    1. DURABLE  - .claude/env/<profile>.json is committed to git. `apply`
                  regenerates settings.local.json from it, so any of the four
                  environments can be rebuilt from a clone with one command.
    2. LOCAL    - every `apply` first copies the current settings.local.json to
                  .claude/env/.backups/ (git-ignored) with a timestamp, so an
                  in-session edit is never silently overwritten. `restore` puts
                  the most recent one back.

  Profiles: win11, chromebook, dgx-spark, mobile.

.EXAMPLE
  .\scripts\Sync-ClaudeEnv.ps1
  Detect the environment and apply the matching profile.

.EXAMPLE
  .\scripts\Sync-ClaudeEnv.ps1 -Profile dgx-spark -WhatIf
  Show what would change without writing.

.EXAMPLE
  .\scripts\Sync-ClaudeEnv.ps1 -Action restore
  Roll back to the newest local backup.
#>
[CmdletBinding(SupportsShouldProcess)]
param(
    [ValidateSet('win11', 'chromebook', 'dgx-spark', 'mobile')]
    [string]$Profile,

    [ValidateSet('apply', 'backup', 'restore', 'list')]
    [string]$Action = 'apply'
)

$ErrorActionPreference = 'Stop'

$repoRoot   = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$envDir     = Join-Path $repoRoot '.claude/env'
$backupDir  = Join-Path $envDir '.backups'
$targetPath = Join-Path $repoRoot '.claude/settings.local.json'

function Resolve-Profile {
    if ($env:DWS_CLAUDE_PROFILE) { return $env:DWS_CLAUDE_PROFILE }

    # Ephemeral cloud containers first: they can also look like plain Linux.
    if ($env:CODESPACES -or $env:GITHUB_ACTIONS -or $env:CLAUDE_CODE_CLOUD) { return 'mobile' }
    if ($IsWindows -or $env:OS -eq 'Windows_NT') { return 'win11' }

    $hostName = [System.Net.Dns]::GetHostName().ToLowerInvariant()
    if ($hostName -match 'spark|dgx') { return 'dgx-spark' }
    if ((Test-Path '/etc/apt/sources.list.d/cros.list') -or $env:SOMMELIER_VERSION) { return 'chromebook' }

    throw "Could not detect the environment. Pass -Profile explicitly, or set DWS_CLAUDE_PROFILE."
}

function Backup-Current {
    if (-not (Test-Path $targetPath)) {
        Write-Verbose 'No existing settings.local.json to back up.'
        return $null
    }
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    }
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $dest  = Join-Path $backupDir "settings.local.$stamp.json"
    Copy-Item $targetPath $dest -Force
    Write-Host "Backed up current settings to $((Resolve-Path $dest).Path)"
    return $dest
}

switch ($Action) {
    'list' {
        Write-Host "Available profiles (committed, so they survive a fresh clone):"
        Get-ChildItem $envDir -Filter '*.json' | ForEach-Object {
            $p = Get-Content $_.FullName -Raw | ConvertFrom-Json
            Write-Host ("  {0,-12} {1}" -f $p._profile, $p._comment.Split('.')[0])
        }
        Write-Host ''
        Write-Host "Local backups (git-ignored, newest first):"
        if (Test-Path $backupDir) {
            Get-ChildItem $backupDir -Filter '*.json' |
                Sort-Object LastWriteTime -Descending |
                ForEach-Object { Write-Host ("  {0}  {1}" -f $_.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss'), $_.Name) }
        } else {
            Write-Host '  (none yet)'
        }
        return
    }

    'backup' {
        if (-not (Backup-Current)) { Write-Warning 'Nothing to back up.' }
        return
    }

    'restore' {
        if (-not (Test-Path $backupDir)) {
            throw "No backups found. Recover from git instead: .\scripts\Sync-ClaudeEnv.ps1 -Action apply"
        }
        $newest = Get-ChildItem $backupDir -Filter '*.json' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
        if (-not $newest) {
            throw "No backups found. Recover from git instead: .\scripts\Sync-ClaudeEnv.ps1 -Action apply"
        }
        if ($PSCmdlet.ShouldProcess($targetPath, "Restore from $($newest.Name)")) {
            Copy-Item $newest.FullName $targetPath -Force
            Write-Host "Restored settings.local.json from $($newest.Name)"
        }
        return
    }
}

if (-not $Profile) { $Profile = Resolve-Profile }

$sourcePath = Join-Path $envDir "$Profile.json"
if (-not (Test-Path $sourcePath)) {
    throw "Unknown profile '$Profile'. Expected $sourcePath."
}

# Fail before touching anything if the profile is not parseable.
$null = Get-Content $sourcePath -Raw | ConvertFrom-Json

if ($PSCmdlet.ShouldProcess($targetPath, "Apply profile '$Profile'")) {
    Backup-Current | Out-Null
    Copy-Item $sourcePath $targetPath -Force
    Write-Host "Applied profile '$Profile' to .claude/settings.local.json"
    Write-Host "Restart Claude Code for the change to take effect."
} else {
    Write-Host "Would apply profile '$Profile' to .claude/settings.local.json"
}
