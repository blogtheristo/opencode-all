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
    .\New-ClaudeWorktree.ps1 -BranchName "fix-api-bug" -BaseBranch "develop" -LaunchClaude

.NOTES
    Based on Daniel San's workflow: https://x.com/dani_avila7
    References:
    - https://huonw.github.io/blog/2020/04/worktrees-and-pyenv/
    - https://www.geeky-gadgets.com/how-to-use-git-worktrees-with-claude-code-for-seamless-multitasking/
#>
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[a-zA-Z0-9_-]+$')]
    [string]$BranchName,

    [string]$BaseBranch = "main",

    [string]$WorktreeRoot,

    [string]$MainRepo,

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
$newWorktreePath = "$WorktreeRoot/$BranchName"

if (Test-Path -Path $newWorktreePath) {
    Write-Error "Worktree path already exists: $newWorktreePath"
    exit 1
}

# ============================================================================
# STEP 1: Create Git Worktree
# ============================================================================

Write-Host "`n[1/5] Creating git worktree..." -ForegroundColor Green

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

Write-Host "`n[2/5] Verifying .gitignore inheritance..." -ForegroundColor Green

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

Write-Host "`n[3/5] Setting up Python virtual environment..." -ForegroundColor Green

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

Write-Host "`n[4/5] Copying configuration files..." -ForegroundColor Green

$configFiles = @(
    @{ Source = ".env"; Required = $false },
    @{ Source = ".env.mcp"; Required = $false },
    @{ Source = ".env.local"; Required = $false }
)

foreach ($config in $configFiles) {
    $sourcePath = "$MainRepo/$($config.Source)"
    $destPath = "$newWorktreePath/$($config.Source)"

    if (Test-Path -Path $sourcePath) {
        Copy-Item -Path $sourcePath -Destination $destPath -Force
        Write-Host "  Copied: $($config.Source)" -ForegroundColor Green
    }
    elseif ($config.Required) {
        Write-Warning "  Required file missing: $($config.Source)"
    }
    else {
        Write-Host "  Skipped (not found): $($config.Source)" -ForegroundColor DarkGray
    }
}

# Copy .claude folder if exists
$mainClaudeDir = "$MainRepo/.claude"
$worktreeClaudeDir = "$newWorktreePath/.claude"

if (Test-Path -Path $mainClaudeDir) {
    Copy-Item -Path $mainClaudeDir -Destination $worktreeClaudeDir -Recurse -Force
    Write-Host "  Copied: .claude/ folder" -ForegroundColor Green
}

# ============================================================================
# STEP 5: Summary and Launch
# ============================================================================

Write-Host "`n[5/5] Worktree setup complete!" -ForegroundColor Green

Write-Host "`n----------------------------------------" -ForegroundColor Cyan
Write-Host "  WORKTREE CREATED SUCCESSFULLY" -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan
Write-Host "  Path:   $newWorktreePath" -ForegroundColor White
Write-Host "  Branch: $BranchName" -ForegroundColor White
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
