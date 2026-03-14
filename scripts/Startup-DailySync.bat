@echo off
REM =============================================================================
REM DWS6 Daily Sync - Runs on Windows login via Startup folder
REM Version: 1.7
REM =============================================================================
REM
REM CHANGE LOG:
REM   v1.0 - 05.02.2026 - Initial: git pull + Proton Drive sync
REM   v1.1 - 05.02.2026 - Increased startup wait from 30s to 120s
REM   v1.2 - 06.02.2026 - Added -GeneratePDFs -OpenNewPDFs flags
REM   v1.3 - 07.02.2026 - Documented versioning
REM   v1.4 - 07.02.2026 - Added Supabase backup, engine choice for PDFs
REM   v1.5 - 07.03.2026 - Added database backup (Step 4) and Aiven mirror (Step 5)
REM   v1.6 - 14.03.2026 - Added -CreateBucket to Supabase sync (prevents 404 on fresh setup)
REM   v1.7 - 14.03.2026 - Added pre-flight health check (Test-DailySync.ps1), merged DB+Aiven steps
REM
REM Place a SHORTCUT to this file in:
REM   %APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup
REM
REM What it does:
REM   1. Waits 120s for network/Proton Drive
REM   2. Pre-flight health check (GitHub, Proton, Supabase)
REM   3. Pulls latest changes from GitHub
REM   4. Syncs business files to Proton Drive (incl. encrypted DB backups)
REM   5. Generates styled HTML from admin manuals, sales & investor docs
REM   6. Opens changed docs in Edge for morning review
REM   7. Uploads working copies to Supabase Storage (EU cloud backup)
REM   8. pg_dump from Supabase PostgreSQL (encrypted, local + remote)
REM   9. Mirrors database to Aiven PostgreSQL sandbox (if AIVEN_ENABLED=true)
REM =============================================================================

set REPO_PATH=F:\2026\Repos2026\dws6

REM Wait 120 seconds for network/Proton Drive to be ready
timeout /t 120 /nobreak >nul

cd /d "%REPO_PATH%"
if errorlevel 1 (
    echo [ERROR] Repo not found: %REPO_PATH%
    pause
    exit /b 1
echo [%date% %time%] Step 0/4: Running health check...

REM Step 0: Pre-flight health check
echo [%date% %time%] Step 0/5: Running health check...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Test-DailySync.ps1"
if errorlevel 1 (
    echo [WARNING] Health check found issues. Continuing anyway...
echo [%date% %time%] Step 1/4: Pulling from GitHub...

REM Step 1: Pull latest changes
echo [%date% %time%] Step 1/5: Pulling from GitHub...
echo [%date% %time%] Step 2/4: Syncing to Proton Drive + generating docs...

REM Step 2: Proton Drive sync + document generation
echo [%date% %time%] Step 2/5: Syncing to Proton Drive + generating docs...
echo [%date% %time%] Step 3/4: Uploading to Supabase Storage...

REM Step 3: Supabase Storage backup (EU cloud)
echo [%date% %time%] Step 3/5: Uploading to Supabase Storage...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Sync-ToSupabase.ps1" -CreateBucket

REM Step 4: Database backup (pg_dump from Supabase, GPG encrypted)
echo [%date% %time%] Step 4/5: Backing up Supabase database...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Backup-Database.ps1"

REM Step 5: Mirror database to Aiven sandbox (skips if AIVEN_ENABLED!=true)
echo [%date% %time%] Step 5/5: Mirroring to Aiven PostgreSQL...
pwsh -NoProfile -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Mirror-ToAiven.ps1"

echo [%date% %time%] Daily sync complete (GitHub + Proton + Supabase + DB Backup + Aiven).
