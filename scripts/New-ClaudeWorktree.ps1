#requires -Version 7.0
<#
.SYNOPSIS
    Creates a new git worktree with proper environment setup for Claude Code workflows.

.DESCRIPTION
    Automates the Daniel San workflow (Ghostty + Worktrees + Lazygit) for DWS6:
    - Creates a new git worktree in the configured worktree directory
    - Symlinks shared .venv from main repository (avoids duplicate 500MB+ venvs)
    - Copies essential config files (.env, .env.mcp, .claude/)
    - Verifies .gitignore is inherited from main repo
    - Optionally launches Claude Code in the new worktree

.PARAMETER BranchName
    Name of the branch to create/checkout. Also used as the worktree folder name.

.PARAMETER PrNumber
    Pull request number used to derive naming:
    - Branch defaults to: claude/pr-<number>
    - Worktree folder defaults to: pr-<number>

.PARAMETER BaseBranch
    Branch to base the new branch on (default: main).

.PARAMETER WorktreeRoot
    Root directory for worktrees. Defaults to environment-specific paths:
    - Windows: C:\Users\<user>\.claude-worktrees\dws6
    - Chromebook/iOS: Adjacent to main repo

.PARAMETER MainRepo
    Path to the main DWS6 repository. Auto-detected if not specified.

.PARAMETER NoVenvSymlink
    Skip symlinking .venv (create isolated venv instead).

.PARAMETER LaunchClaude
    Launch Claude Code in the new worktree after creation.

.EXAMPLE
    .\New-ClaudeWorktree.ps1 -BranchName "feature-auth-improvements"

.EXAMPLE
    .\New-ClaudeWorktree.ps1 -PrNumber 769 -BaseBranch "main" -LaunchClaude

.EXAMPLE
    .\New-ClaudeWorktree.ps1 -BranchName "fix-api-bug" -BaseBranch "develop" -LaunchClaude

.NOTES
    Based on Daniel San's workflow: https://x.com/dani_avila7
    References:
    - https://huonw.github.io/blog/2020/04/worktrees-and-pyenv/
    - https://www.geeky-gadgets.com/how-to-use-git-worktrees-with-claude-code-for-seamless-multitasking/
#>
param(
    [Parameter(Mandatory = $false)]
    [ValidatePattern('^[a-zA-Z0-9_./-]+$')]
    [string]$BranchName,

    [Parameter(Mandatory = $false)]
    [ValidateRange(1, 2147483647)]
    [int]$PrNumber,

    [string]$BaseBranch = "main",

    [string]$WorktreeRoot,

    [string]$MainRepo,

    [ValidatePattern('^[a-zA-Z0-9_-]+$')]
    [string]$WorktreeName,

    [switch]$NoVenvSymlink,

    [switch]$LaunchClaude
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ============================================================================
# CONFIGURATION
# ============================================================================

function Get-MainRepoPath {
    # Try to find main repo automatically
    $possiblePaths = @(
        "F:/2026/Repos2026/dws6",                    # Windows primary
        "D:/Proton/My files/2026/Repos2026/dws6",   # Windows secondary
        "$HOME/repos/dws6",                          # Linux/Chromebook
        "$HOME/Developer/dws6"                       # macOS/iOS
    )

    foreach ($path in $possiblePaths) {
        if (Test-Path -Path "$path/.git") {
            return $path
        }
    }

    # Try to detect from current worktree
    $gitDir = git rev-parse --git-common-dir 2>$null
    if ($gitDir) {
        $mainPath = Split-Path -Parent $gitDir
        if (Test-Path -Path "$mainPath/.git") {
            return $mainPath
        }
    }

    return $null
}

function Get-WorktreeRootPath {
    param([string]$MainRepoPath)

    # Environment-specific defaults
    if ($IsWindows -or $env:OS -match "Windows") {
        # CRITICAL: Always use F: drive on Windows, NEVER C: drive
        # This prevents worktrees from being created in user profile directories
        # which caused security issues (user home being tracked as git repo)

        # Check if main repo is on F: drive
        if ($MainRepoPath -match "^F:") {
            $parentDir = Split-Path -Parent $MainRepoPath
            return "$parentDir/.claude-worktrees/dws6"
        }
        # Fallback: Use F: drive standard location if available
        elseif (Test-Path "F:/") {
            return "F:/2026/Repos2026/.claude-worktrees/dws6"
        }
        # Last resort: Adjacent to main repo (but warn about C: drive)
        else {
            $parentDir = Split-Path -Parent $MainRepoPath
            if ($parentDir -match "^C:/Users") {
                Write-Warning "Creating worktree in C:\Users is NOT recommended!"
                Write-Warning "Consider moving main repo to F: drive"
            }
            return "$parentDir/.claude-worktrees/dws6"
        }
    }
    elseif ($IsMacOS) {
        return "$HOME/.claude-worktrees/dws6"
    }
    else {
        # Linux/Chromebook - place adjacent to main repo
        $parentDir = Split-Path -Parent $MainRepoPath
        return "$parentDir/.claude-worktrees/dws6"
    }
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DWS6 Claude Worktree Creator" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Derive naming from PR number when provided
if (-not $BranchName) {
    if ($PrNumber -gt 0) {
        $BranchName = "claude/pr-$PrNumber"
    }
    else {
        Write-Error "Specify -BranchName or -PrNumber."
        exit 1
    }
}

if (-not $WorktreeName) {
    if ($PrNumber -gt 0) {
        $WorktreeName = "pr-$PrNumber"
    }
    else {
        $WorktreeName = ($BranchName -replace '[^a-zA-Z0-9_-]', '-').Trim('-')
    }
}

# Resolve main repository path
if (-not $MainRepo) {
    $MainRepo = Get-MainRepoPath
}

if (-not $MainRepo -or -not (Test-Path -Path "$MainRepo/.git")) {
    Write-Error "Cannot locate main DWS6 repository. Specify -MainRepo parameter."
    exit 1
}

$MainRepo = (Resolve-Path $MainRepo).Path -replace '\\', '/'
Write-Host "Main repository: $MainRepo" -ForegroundColor DarkGray

# Resolve worktree root
if (-not $WorktreeRoot) {
    $WorktreeRoot = Get-WorktreeRootPath -MainRepoPath $MainRepo
}

$WorktreeRoot = $WorktreeRoot -replace '\\', '/'
Write-Host "Worktree root: $WorktreeRoot" -ForegroundColor DarkGray

# Create worktree root if needed
if (-not (Test-Path -Path $WorktreeRoot)) {
    Write-Host "Creating worktree root directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $WorktreeRoot -Force | Out-Null
}

# Define new worktree path
$newWorktreePath = "$WorktreeRoot/$WorktreeName"

if (Test-Path -Path $newWorktreePath) {
    Write-Error "Worktree path already exists: $newWorktreePath"
    exit 1
}

# ============================================================================
# STEP 1: Create Git Worktree
# ============================================================================

Write-Host "`n[1/7] Creating git worktree..." -ForegroundColor Green

# Check if branch exists
$branchExists = git -C $MainRepo branch --list $BranchName 2>$null
$remoteBranchExists = git -C $MainRepo branch -r --list "origin/$BranchName" 2>$null

if ($branchExists) {
    Write-Host "  Checking out existing branch: $BranchName" -ForegroundColor DarkGray
    git -C $MainRepo worktree add $newWorktreePath $BranchName
}
elseif ($remoteBranchExists) {
    Write-Host "  Checking out remote branch: origin/$BranchName" -ForegroundColor DarkGray
    git -C $MainRepo worktree add $newWorktreePath $BranchName
}
else {
    Write-Host "  Creating new branch: $BranchName (from $BaseBranch)" -ForegroundColor DarkGray
    git -C $MainRepo worktree add -b $BranchName $newWorktreePath $BaseBranch
}

if (-not (Test-Path -Path $newWorktreePath)) {
    Write-Error "Failed to create worktree at: $newWorktreePath"
    exit 1
}

Write-Host "  Worktree created at: $newWorktreePath" -ForegroundColor Green

# Verify worktree was created correctly (has .git file, not .git folder)
$worktreeGitFile = "$newWorktreePath/.git"
if (Test-Path -Path $worktreeGitFile -PathType Leaf) {
    $gitContent = Get-Content -Path $worktreeGitFile -Raw
    if ($gitContent -match "gitdir:.*$MainRepo") {
        Write-Host "  Verified: Proper worktree link to main repo" -ForegroundColor Green
    }
    else {
        Write-Warning "  Warning: .git file doesn't point to expected main repo"
        Write-Host "  Content: $gitContent" -ForegroundColor DarkGray
    }
}
elseif (Test-Path -Path $worktreeGitFile -PathType Container) {
    Write-Error "  CRITICAL: Created standalone repo (.git folder) instead of worktree!"
    Write-Error "  This is a security risk - .gitignore may not be inherited!"
    Write-Host "  Removing broken worktree..." -ForegroundColor Red
    Remove-Item -Path $newWorktreePath -Recurse -Force
    exit 1
}
else {
    Write-Error "  CRITICAL: No .git found in worktree - creation failed!"
    exit 1
}

# ============================================================================
# STEP 2: Verify .gitignore (Inherited from main repo)
# ============================================================================

Write-Host "`n[2/7] Verifying .gitignore inheritance..." -ForegroundColor Green

# Git worktrees share the same .git directory, so .gitignore is automatically shared
$mainGitignore = "$MainRepo/.gitignore"
if (Test-Path -Path $mainGitignore) {
    # Verify critical patterns are present
    $gitignoreContent = Get-Content -Path $mainGitignore -Raw
    $requiredPatterns = @(".env", ".venv/", "Admin/", "*.secret", "*.key")
    $missingPatterns = @()

    foreach ($pattern in $requiredPatterns) {
        if ($gitignoreContent -notmatch [regex]::Escape($pattern)) {
            $missingPatterns += $pattern
        }
    }

    if ($missingPatterns.Count -gt 0) {
        Write-Warning "  .gitignore missing critical patterns: $($missingPatterns -join ', ')"
        Write-Warning "  Update $mainGitignore before committing sensitive files!"
    }
    else {
        Write-Host "  .gitignore verified (inherited from main repo)" -ForegroundColor Green
    }
}
else {
    Write-Error "  Main repo missing .gitignore! This is a security risk."
    exit 1
}

# ============================================================================
# STEP 3: Symlink Python Virtual Environment
# ============================================================================

Write-Host "`n[3/7] Setting up Python virtual environment..." -ForegroundColor Green

$mainVenv = "$MainRepo/.venv"
$worktreeVenv = "$newWorktreePath/.venv"

if ($NoVenvSymlink) {
    Write-Host "  Skipping venv symlink (--NoVenvSymlink specified)" -ForegroundColor Yellow
    Write-Host "  Run 'python -m venv .venv' in worktree to create isolated environment" -ForegroundColor DarkGray
}
elseif (Test-Path -Path $mainVenv) {
    Write-Host "  Creating symlink to main .venv..." -ForegroundColor DarkGray

    # Create symlink (requires admin on Windows, or Developer Mode enabled)
    try {
        if ($IsWindows -or $env:OS -match "Windows") {
            # Windows: Use mklink /D (directory symlink)
            $cmdResult = cmd /c "mklink /D `"$($worktreeVenv -replace '/', '\')`" `"$($mainVenv -replace '/', '\')`"" 2>&1
            if ($LASTEXITCODE -ne 0) {
                throw "mklink failed: $cmdResult"
            }
        }
        else {
            # Unix: Use ln -s
            ln -s $mainVenv $worktreeVenv
        }

        Write-Host "  Symlinked .venv -> $mainVenv" -ForegroundColor Green
        Write-Host "  Activate: $worktreeVenv/Scripts/Activate.ps1" -ForegroundColor DarkGray
    }
    catch {
        Write-Warning "  Failed to create symlink: $_"
        Write-Warning "  On Windows, enable Developer Mode or run as Administrator"
        Write-Host "  Falling back to manual activation from main repo" -ForegroundColor Yellow
    }
}
else {
    Write-Warning "  Main repo .venv not found at: $mainVenv"
    Write-Host "  Create with: python -m venv $mainVenv" -ForegroundColor DarkGray
}

# ============================================================================
# STEP 4: Copy Configuration Files
# ============================================================================

Write-Host "`n[4/7] Copying configuration files..." -ForegroundColor Green

# Files Claude Code needs to work properly:
# - .mcp.json       : MCP server connections (Supabase, Redis, etc.) — CRITICAL for tool access
# - .env            : Environment variables (API keys, DB URLs)
# - .env.mcp        : MCP Hub environment config
# - .env.local       : Local overrides
# - .env.mcp.minimal : Minimal MCP config for hosted endpoints
# - .env.mcp.txt    : MCP reference/notes
$configFiles = @(
    @{ Source = ".mcp.json"; Required = $true; Desc = "MCP server config (Supabase, Redis tools)" },
    @{ Source = ".env"; Required = $true; Desc = "Environment variables (API keys, DB URLs)" },
    @{ Source = ".env.mcp"; Required = $false; Desc = "MCP Hub environment config" },
    @{ Source = ".env.local"; Required = $false; Desc = "Local environment overrides" },
    @{ Source = ".env.mcp.minimal"; Required = $false; Desc = "Minimal MCP config" },
    @{ Source = ".env.mcp.txt"; Required = $false; Desc = "MCP reference notes" }
)

$criticalMissing = @()

foreach ($config in $configFiles) {
    $sourcePath = "$MainRepo/$($config.Source)"
    $destPath = "$newWorktreePath/$($config.Source)"

    if (Test-Path -Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  Copied: $($config.Source)" -ForegroundColor Green
    }
    elseif ($config.Required) {
        Write-Warning "  MISSING (required): $($config.Source) — $($config.Desc)"
        $criticalMissing += $config.Source
    }
    else {
        Write-Host "  Skipped (not found): $($config.Source)" -ForegroundColor DarkGray
    }
}

# Copy .claude folder if exists (contains settings.local.json with permissions)
$mainClaudeDir = "$MainRepo/.claude"
$worktreeClaudeDir = "$newWorktreePath/.claude"

if (Test-Path -Path $mainClaudeDir) {
    Copy-Item -Path $mainClaudeDir -Destination $worktreeClaudeDir -Recurse -Force
    Write-Host "  Copied: .claude/ folder" -ForegroundColor Green
}
else {
    Write-Warning "  MISSING: .claude/ folder — Claude Code permissions won't be pre-configured"
}

# Copy .cursorrules if exists (for Cursor IDE users)
$mainCursorRules = "$MainRepo/.cursorrules"
$worktreeCursorRules = "$newWorktreePath/.cursorrules"

if (Test-Path -Path $mainCursorRules) {
    Copy-Item -Path $mainCursorRules -Destination $worktreeCursorRules -Force
    Write-Host "  Copied: .cursorrules" -ForegroundColor Green
}

# ============================================================================
# STEP 5: Validate Environment (CRITICAL — do not skip)
# ============================================================================

Write-Host "`n[5/7] Validating worktree environment..." -ForegroundColor Green

$validationErrors = @()

# Check 1: .mcp.json exists and has MCP servers defined
$worktreeMcpJson = "$newWorktreePath/.mcp.json"
if (Test-Path -Path $worktreeMcpJson) {
    $mcpContent = Get-Content -Path $worktreeMcpJson -Raw
    if ($mcpContent -match '"mcpServers"') {
        Write-Host "  .mcp.json: MCP servers configured" -ForegroundColor Green
    }
    else {
        $validationErrors += ".mcp.json exists but has no mcpServers defined"
    }
}
else {
    $validationErrors += ".mcp.json missing — Claude Code will have NO MCP tool access (no Supabase, no Redis)"
}

# Check 2: .env exists and has key variables
$worktreeEnv = "$newWorktreePath/.env"
if (Test-Path -Path $worktreeEnv) {
    $envContent = Get-Content -Path $worktreeEnv -Raw
    $envChecks = @(
        @{ Pattern = "SUPABASE_URL"; Name = "Supabase URL" },
        @{ Pattern = "SUPABASE_SERVICE_KEY"; Name = "Supabase service key" },
        @{ Pattern = "ANTHROPIC_API_KEY"; Name = "Anthropic API key" }
    )
    foreach ($check in $envChecks) {
        if ($envContent -match "(?m)^[ \t]*$([regex]::Escape($check.Pattern))=") {
            Write-Host "  .env: $($check.Name) present" -ForegroundColor Green
        }
        else {
            Write-Host "  .env: $($check.Name) not found" -ForegroundColor Yellow
        }
    }
}
else {
    $validationErrors += ".env missing — backend services will not connect"
}

# Check 3: .claude/settings.local.json exists with permissions
$worktreeClaudeSettings = "$newWorktreePath/.claude/settings.local.json"
if (Test-Path -Path $worktreeClaudeSettings) {
    Write-Host "  .claude/settings.local.json: permissions configured" -ForegroundColor Green
}
else {
    Write-Host "  .claude/settings.local.json: not found (Claude will ask for each permission)" -ForegroundColor Yellow
}

# Report validation results
if ($validationErrors.Count -gt 0) {
    Write-Host "`n  VALIDATION WARNINGS:" -ForegroundColor Red
    foreach ($err in $validationErrors) {
        Write-Host "    ! $err" -ForegroundColor Red
    }
    Write-Host "`n  Claude Code sessions in this worktree may not work correctly!" -ForegroundColor Red
    Write-Host "  Fix: Copy missing files from main repo: $MainRepo" -ForegroundColor Yellow
}
else {
    Write-Host "  All checks passed — worktree is ready for Claude Code" -ForegroundColor Green
}

# ============================================================================
# STEP 6: Ping Docker & MCP Services
# ============================================================================

Write-Host "`n[6/7] Checking Docker & MCP configuration..." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = $false
try {
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  Docker: running" -ForegroundColor Green
        $dockerRunning = $true
    }
    else {
        Write-Host "  Docker: NOT running — local container checks skipped" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  Docker: NOT installed or not in PATH (OK for remote MCP)" -ForegroundColor Yellow
}

if ($dockerRunning) {
    # List all DWS-related containers and their health
    $containers = docker ps --format "{{.Names}}|{{.Ports}}|{{.Status}}" 2>$null
    $mcpContainers = @()

    if ($containers) {
        foreach ($line in $containers -split "`n") {
            if ($line -match '\S') {
                $parts = $line -split '\|'
                $name = $parts[0].Trim()
                $ports = if ($parts.Count -gt 1) { $parts[1].Trim() } else { "" }
                $status = if ($parts.Count -gt 2) { $parts[2].Trim() } else { "" }
                $mcpContainers += @{ Name = $name; Ports = $ports; Status = $status }
            }
        }
    }

    if ($mcpContainers.Count -gt 0) {
        Write-Host "  Docker containers running: $($mcpContainers.Count)" -ForegroundColor Green
        foreach ($container in $mcpContainers) {
            $healthIcon = if ($container.Status -match "healthy") { "OK" }
                         elseif ($container.Status -match "unhealthy") { "!!" }
                         else { "--" }
            $color = if ($container.Status -match "healthy") { "Green" }
                    elseif ($container.Status -match "unhealthy") { "Red" }
                    else { "Yellow" }
            Write-Host "    [$healthIcon] $($container.Name) ($($container.Ports))" -ForegroundColor $color
        }
    }
    else {
        Write-Host "  No Docker containers running" -ForegroundColor Yellow
        Write-Host "  Win11 developer MCP should stay local and non-Docker; DGX hosts the orchestration hub" -ForegroundColor DarkGray
    }

    # Check configured MCP endpoints from .mcp.json
    if (Test-Path -Path $worktreeMcpJson) {
        $mcpContent = Get-Content -Path $worktreeMcpJson -Raw | ConvertFrom-Json -ErrorAction SilentlyContinue
        if ($mcpContent -and $mcpContent.mcpServers) {
            Write-Host "`n  MCP server connectivity:" -ForegroundColor Cyan
            foreach ($serverName in $mcpContent.mcpServers.PSObject.Properties.Name) {
                $server = $mcpContent.mcpServers.$serverName
                if ($server.url) {
                    if ($server.url -match '\$\{.+\}') {
                        Write-Host "    $serverName : needs environment variables ($($server.url))" -ForegroundColor Yellow
                    }
                    else {
                        try {
                            $healthUrl = if ($server.url.EndsWith('/mcp')) { "$($server.url)/health" } else { $server.url }
                            $response = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 3 -ErrorAction Stop
                            Write-Host "    $serverName : reachable ($healthUrl)" -ForegroundColor Green
                        }
                        catch {
                            Write-Host "    $serverName : UNREACHABLE ($($server.url))" -ForegroundColor Red
                        }
                    }
                }
                elseif ($server.command) {
                    Write-Host "    $serverName : configured (local command: $($server.command))" -ForegroundColor Green
                }
            }
        }
    }
}

# ============================================================================
# STEP 7: Summary and Launch
# ============================================================================

Write-Host "`n[7/7] Worktree setup complete!" -ForegroundColor Green

Write-Host "`n----------------------------------------" -ForegroundColor Cyan
Write-Host "  WORKTREE CREATED SUCCESSFULLY" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "  Path:   $newWorktreePath" -ForegroundColor White
Write-Host "  Branch: $BranchName" -ForegroundColor White
if ($PrNumber -gt 0) {
    Write-Host "  PR:     #$PrNumber" -ForegroundColor White
}
Write-Host "----------------------------------------`n" -ForegroundColor Cyan

# List all worktrees
Write-Host "All worktrees:" -ForegroundColor DarkGray
git -C $MainRepo worktree list

Write-Host "`nQuick commands:" -ForegroundColor Yellow
Write-Host "  cd '$newWorktreePath'" -ForegroundColor DarkGray
Write-Host "  claude                              # Launch Claude Code" -ForegroundColor DarkGray
Write-Host "  . .venv/Scripts/Activate.ps1       # Activate Python venv" -ForegroundColor DarkGray
Write-Host "  git worktree remove '$newWorktreePath'  # Remove when done" -ForegroundColor DarkGray

if ($LaunchClaude) {
    Write-Host "`nLaunching Claude Code..." -ForegroundColor Green
    Set-Location -Path $newWorktreePath
    & claude
}
else {
    Write-Host "`nTo start working:" -ForegroundColor Yellow
    Write-Host "  cd '$newWorktreePath' && claude" -ForegroundColor White
}
