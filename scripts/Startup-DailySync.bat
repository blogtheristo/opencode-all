@echo off
REM =============================================================================
REM DWS6 Daily Sync - Runs on Windows login via Startup folder
REM =============================================================================
REM Place a SHORTCUT to this file in:
REM   %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
REM
REM What it does:
REM   1. Pulls latest changes from GitHub
REM   2. Syncs business files to Proton Drive
REM   3. Runs silently in background (closes when done)
REM =============================================================================

set REPO_PATH=F:\2026\Repos2026\dws6

REM Wait 120 seconds for network/Proton Drive to be ready
timeout /t 120 /nobreak >nul

cd /d "%REPO_PATH%"
if errorlevel 1 (
    echo [ERROR] Repo not found: %REPO_PATH%
    pause
    exit /b 1
)

REM Pull latest changes
echo [%date% %time%] Pulling from GitHub...
git pull origin main

REM Run Proton Drive sync
echo [%date% %time%] Syncing to Proton Drive...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Sync-ToProton.ps1"

echo [%date% %time%] Daily sync complete.
