@echo off
REM =============================================================================
REM DWS6 Daily Sync - Runs on Windows login via Startup folder
REM Version: 1.6
REM =============================================================================
REM
REM CHANGE LOG:
REM   v1.0 - 05.02.2026 - Initial: git pull + Proton Drive sync
REM   v1.1 - 05.02.2026 - Increased startup wait from 30s to 120s
REM   v1.2 - 06.02.2026 - Added -GeneratePDFs -OpenNewPDFs flags
REM   v1.3 - 07.02.2026 - Documented versioning
REM   v1.4 - 07.02.2026 - Added Supabase backup, engine choice for PDFs
REM   v1.5 - 14.03.2026 - Added -CreateBucket to Supabase sync (prevents 404 on fresh setup)
REM   v1.6 - 14.03.2026 - Added pre-flight health check (Test-DailySync.ps1) before sync steps
REM
REM Place a SHORTCUT to this file in:
REM   %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
REM
REM What it does:
REM   1. Waits 120s for network/Proton Drive
REM   2. Pre-flight health check (GitHub, Proton, Supabase)
REM   3. Pulls latest changes from GitHub
REM   4. Syncs business files to Proton Drive
REM   5. Generates styled HTML from admin manuals, sales & investor docs
REM   6. Opens changed docs in Edge for morning review
REM   7. Uploads working copies to Supabase Storage (EU cloud backup)
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

REM Step 0: Pre-flight health check
echo [%date% %time%] Step 0/3: Running health check...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Test-DailySync.ps1"
if errorlevel 1 (
    echo [WARNING] Health check found issues. Continuing anyway...
)

REM Step 1: Pull latest changes
echo [%date% %time%] Step 1/3: Pulling from GitHub...
git pull origin main

REM Step 2: Proton Drive sync + document generation
echo [%date% %time%] Step 2/3: Syncing to Proton Drive + generating docs...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Sync-ToProton.ps1" -GeneratePDFs -OpenNewPDFs

REM Step 3: Supabase Storage backup (EU cloud)
echo [%date% %time%] Step 3/3: Uploading to Supabase Storage...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Sync-ToSupabase.ps1" -CreateBucket

echo [%date% %time%] Daily sync complete (GitHub + Proton + Supabase).
