<#
.SYNOPSIS
    DWS Startup Script — Runs automatically when Win11 laptop opens.
    Pulls latest code, syncs data, runs missed daily tasks, checks DGX Spark.

.DESCRIPTION
    Registered in Windows Task Scheduler to run at logon.
    Install: .\scripts\Install-DailyTasks.ps1
    Or manual: Register-ScheduledTask (see bottom of this file)

    What it does (every laptop open):
    1. Git pull main — always latest code
    2. Check DGX Spark heartbeat — verify 24/7 runtime is alive
    3. Run any missed daily PowerShell tasks (backup, sync, etc.)
    4. Show status summary in terminal

.NOTES
    Code-Version: 1.0.0
    Date: 2026-03-29
    Owner: Lifetime Oy
#>

$ErrorActionPreference = 'Continue'
$RepoRoot = 'F:\2026\Repos2026\dws6'
$LogFile = "$RepoRoot\logs\startup-dws.log"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
function Write-Log {
    param([string]$Msg)
    $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
    $line = "[$ts] $Msg"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line -ErrorAction SilentlyContinue
}

# ---------------------------------------------------------------------------
# 1. Git Pull — always latest code
# ---------------------------------------------------------------------------
Write-Log '=== DWS Startup ==='

if (Test-Path "$RepoRoot\.git") {
    Push-Location $RepoRoot

    # Fetch remote state
    Write-Log 'Fetching remote...'
    git fetch origin main 2>&1 | Out-Null

    # Compare local vs remote
    $localHash  = (git rev-parse HEAD 2>$null).Trim()
    $remoteHash = (git rev-parse origin/main 2>$null).Trim()
    $localBranch = (git branch --show-current 2>$null).Trim()

    if ($localHash -eq $remoteHash) {
        Write-Log "Repo UP TO DATE ($($localHash.Substring(0,8))) on branch: $localBranch"
    } else {
        $behindCount = (git rev-list --count HEAD..origin/main 2>$null).Trim()
        Write-Log "Repo BEHIND by $behindCount commits ($($localHash.Substring(0,8)) -> $($remoteHash.Substring(0,8)))"

        # Check for uncommitted local changes
        $dirty = git status --porcelain 2>$null
        if ($dirty) {
            Write-Log "WARNING: Local changes detected — stashing before pull"
            git stash push -m "auto-stash-startup-$(Get-Date -Format 'yyyyMMdd-HHmmss')" 2>&1 | ForEach-Object { Write-Log "  $_" }
            $stashed = $true
        }

        # Pull latest
        Write-Log 'Pulling latest code...'
        $pullResult = git pull origin main 2>&1
        Write-Log "Git: $pullResult"

        # Pop stash if we stashed
        if ($stashed) {
            Write-Log 'Restoring local changes...'
            $popResult = git stash pop 2>&1
            if ($LASTEXITCODE -ne 0) {
                Write-Log "WARNING: Stash pop had conflicts — check manually. Stash kept."
            } else {
                Write-Log "Local changes restored OK"
            }
        }

        # npm ci if package.json changed
        $changed = git diff --name-only "$localHash" HEAD 2>$null
        if ($changed -match 'package\.json') {
            Write-Log 'package.json changed — running npm ci...'
            npm ci --omit=dev 2>&1 | Select-Object -Last 3 | ForEach-Object { Write-Log $_ }
        }

        # Log what changed
        $newCommits = git log --oneline "$localHash..HEAD" 2>$null
        Write-Log "New commits pulled:"
        $newCommits | ForEach-Object { Write-Log "  $_" }
    }

    Pop-Location
} else {
    Write-Log "WARN: Repo not found at $RepoRoot — cloning..."
    git clone git@github.com:blogtheristo/dws6.git $RepoRoot 2>&1 | ForEach-Object { Write-Log $_ }
}

# ---------------------------------------------------------------------------
# 2. Check DGX Spark heartbeat
# ---------------------------------------------------------------------------
$DgxIp = if ($env:DGX_SPARK_IP) { $env:DGX_SPARK_IP } else { '192.168.101.113' }

Write-Log "Checking DGX Spark ($DgxIp)..."
try {
    $response = Invoke-RestMethod -Uri "http://${DgxIp}:9999/health" -TimeoutSec 5 -ErrorAction Stop
    Write-Log "DGX Spark: $($response.status) (services running)"

    if ($response.status -eq 'down') {
        Write-Log 'WARNING: DGX Spark services are DOWN — GitHub Actions failover is active'
        Write-Log 'Fix: ssh admin100@192.168.101.113 "cd /home/admin100/dws6/infrastructure/dgx-spark && docker compose up -d"'
    }
} catch {
    Write-Log "DGX Spark: UNREACHABLE — check network or SSH into $DgxIp"
    Write-Log 'GitHub Actions failover should be handling cron jobs'
}

# ---------------------------------------------------------------------------
# 3. Run missed daily tasks
# ---------------------------------------------------------------------------
$Today = (Get-Date).ToString('yyyy-MM-dd')
$StateFile = "$RepoRoot\logs\win-startup-state.json"

# Load state
$state = @{}
if (Test-Path $StateFile) {
    try { $state = Get-Content $StateFile -Raw | ConvertFrom-Json -AsHashtable } catch { $state = @{} }
}

# Daily PowerShell tasks (only run if not already done today)
$DailyTasks = @(
    @{ Name = 'Backup-Database';   Script = "$RepoRoot\scripts\Backup-Database.ps1" },
    @{ Name = 'Sync-ToProton';     Script = "$RepoRoot\scripts\Sync-ToProton.ps1" },
    @{ Name = 'Sync-ToSupabase';   Script = "$RepoRoot\scripts\Sync-ToSupabase.ps1" },
    @{ Name = 'Mirror-ToAiven';    Script = "$RepoRoot\scripts\Mirror-ToAiven.ps1" },
    @{ Name = 'Test-DailySync';    Script = "$RepoRoot\scripts\Test-DailySync.ps1" }
)

foreach ($task in $DailyTasks) {
    $lastRun = $state[$task.Name]
    if ($lastRun -eq $Today) {
        Write-Log "SKIP: $($task.Name) — already ran today"
        continue
    }

    if (-not (Test-Path $task.Script)) {
        Write-Log "SKIP: $($task.Name) — script not found"
        continue
    }

    Write-Log "Running: $($task.Name)..."
    try {
        & pwsh.exe -NonInteractive -NoProfile -File $task.Script 2>&1 |
            Select-Object -Last 5 |
            ForEach-Object { Write-Log "  $_" }
        $state[$task.Name] = $Today
        Write-Log "OK: $($task.Name)"
    } catch {
        Write-Log "FAILED: $($task.Name) — $($_.Exception.Message)"
    }
}

# Save state
$state | ConvertTo-Json | Set-Content -Path $StateFile -ErrorAction SilentlyContinue

# ---------------------------------------------------------------------------
# 4. Summary
# ---------------------------------------------------------------------------
Write-Log ''
Write-Log '=== DWS Startup Complete ==='
Write-Log "Repo: $RepoRoot"
Write-Log "DGX Spark: ${DgxIp}:9999"
Write-Log "Log: $LogFile"
Write-Log ''
