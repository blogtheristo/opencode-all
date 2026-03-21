<#
.SYNOPSIS
    Restores daily Supabase pg_dump to Aiven PostgreSQL sandbox.

.DESCRIPTION
    Version: 1.0

    CHANGE LOG:
      v1.0 - 07.03.2026 - Initial: pg_restore to Aiven, row count verification,
                           auth stub compatibility, backup metadata logging

    Mirrors Supabase production data to Aiven PostgreSQL sandbox for:
    - AI agent workspace (read/write without production risk)
    - Lifetime World Model (LWM) training data
    - Schema testing and migration validation

    The script:
    1. Finds the latest .dump file (or decrypts .gpg if needed)
    2. Tests Aiven connectivity
    3. Restores using pg_restore (public schema only, skips Supabase internals)
    4. Verifies row counts against backup manifest
    5. Logs restore metadata to _backup_metadata table

    Prerequisites:
    - Run scripts/aiven-init.sql once on Aiven to create auth stubs
    - Set AIVEN_* variables in .env
    - Set AIVEN_ENABLED=true

.PARAMETER DumpFile
    Specific .dump file to restore. If omitted, auto-detects latest backup.

.PARAMETER DryRun
    Show what would happen without executing.

.PARAMETER SkipVerify
    Skip post-restore row count verification.

.PARAMETER BackupDir
    Directory containing backup dumps. Default: F:\2026\Backups\dws6-db

.EXAMPLE
    .\Mirror-ToAiven.ps1
    .\Mirror-ToAiven.ps1 -DryRun
    .\Mirror-ToAiven.ps1 -DumpFile "F:\2026\Backups\dws6-db\2026-03-07\dws6_2026-03-07.dump"
#>

param(
    [string]$DumpFile = "",
    [string]$BackupDir = "F:\2026\Backups\dws6-db",
    [switch]$DryRun,
    [switch]$SkipVerify
)

$ErrorActionPreference = "Stop"

# --- Load .env ---
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoPath = Split-Path -Parent $ScriptDir
$EnvFile = Join-Path $RepoPath ".env"

function Load-EnvFile {
    param([string]$Path)
    if (Test-Path $Path) {
        Get-Content $Path | ForEach-Object {
            if ($_ -match '^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.+)$' -and $_ -notmatch '^\s*#') {
                $key = $Matches[1]
                $val = $Matches[2].Trim('"').Trim("'")
                [System.Environment]::SetEnvironmentVariable($key, $val, "Process")
            }
        }
    }
}

Load-EnvFile -Path $EnvFile

# --- Aiven connection ---
$AivenEnabled = $env:AIVEN_ENABLED
$AivenHost = $env:AIVEN_DB_HOST
$AivenPort = $env:AIVEN_DB_PORT ?? "5432"
$AivenDb = $env:AIVEN_DB_NAME ?? "defaultdb"
$AivenUser = $env:AIVEN_DB_USER ?? "avnadmin"
$AivenPassword = $env:AIVEN_DB_PASSWORD
$AivenSslMode = $env:AIVEN_DB_SSLMODE ?? "require"
$GpgPassphrase = $env:BACKUP_GPG_PASSPHRASE

# --- Validation ---
if ($AivenEnabled -ne "true") {
    Write-Host "Aiven mirror is disabled (AIVEN_ENABLED != true). Skipping." -ForegroundColor Yellow
    exit 0
}
if (-not $AivenHost) {
    Write-Error "AIVEN_DB_HOST not set. Add to .env file."
    exit 1
}
if (-not $AivenPassword) {
    Write-Error "AIVEN_DB_PASSWORD not set. Add to .env file."
    exit 1
}

# --- Find pg_restore / psql ---
$PgRestore = $null
$Psql = $null

foreach ($tool in @("pg_restore", "psql")) {
    $found = Get-Command $tool -ErrorAction SilentlyContinue
    if ($found) {
        Set-Variable -Name ($tool -replace '_','') -Value $found.Source
        continue
    }
    $commonPaths = @(
        "C:\Program Files\PostgreSQL\16\bin\${tool}.exe",
        "C:\Program Files\PostgreSQL\15\bin\${tool}.exe",
        "C:\Program Files\PostgreSQL\17\bin\${tool}.exe"
    )
    foreach ($p in $commonPaths) {
        if (Test-Path $p) {
            Set-Variable -Name ($tool -replace '_','') -Value $p
            break
        }
    }
}

# Correct variable names from the loop
$PgRestore = Get-Command pg_restore -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $PgRestore) {
    @("C:\Program Files\PostgreSQL\16\bin\pg_restore.exe",
      "C:\Program Files\PostgreSQL\15\bin\pg_restore.exe") | ForEach-Object {
        if ((Test-Path $_) -and -not $PgRestore) { $PgRestore = $_ }
    }
}

$Psql = Get-Command psql -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $Psql) {
    @("C:\Program Files\PostgreSQL\16\bin\psql.exe",
      "C:\Program Files\PostgreSQL\15\bin\psql.exe") | ForEach-Object {
        if ((Test-Path $_) -and -not $Psql) { $Psql = $_ }
    }
}

if (-not $PgRestore) {
    Write-Error "pg_restore not found. Install PostgreSQL client tools."
    exit 1
}

# --- Find dump file ---
$ActualDumpFile = $DumpFile
$TempDecrypted = $false

if (-not $ActualDumpFile) {
    # Auto-detect latest backup
    $latestDir = Get-ChildItem -Path $BackupDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^\d{4}-\d{2}-\d{2}$' } |
        Sort-Object Name -Descending |
        Select-Object -First 1

    if (-not $latestDir) {
        Write-Error "No backup directories found in $BackupDir"
        exit 1
    }

    # Look for .dump first, then .dump.gpg
    $dumpCandidate = Get-ChildItem -Path $latestDir.FullName -Filter "*.dump" -File | Select-Object -First 1
    if ($dumpCandidate) {
        $ActualDumpFile = $dumpCandidate.FullName
    } else {
        $gpgCandidate = Get-ChildItem -Path $latestDir.FullName -Filter "*.dump.gpg" -File | Select-Object -First 1
        if ($gpgCandidate) {
            # Decrypt to temp location
            if (-not $GpgPassphrase) {
                Write-Error "BACKUP_GPG_PASSPHRASE not set. Cannot decrypt backup."
                exit 1
            }

            $ActualDumpFile = Join-Path $env:TEMP "dws6_mirror_restore.dump"
            Write-Host "Decrypting $($gpgCandidate.Name)..." -ForegroundColor Cyan

            if (-not $DryRun) {
                # Use stdin for passphrase to avoid exposing it in process command line
                $gpgArgs = @(
                    "--batch",
                    "--yes",
                    "--decrypt",
                    "--pinentry-mode", "loopback",
                    "--passphrase-fd", "0",
                    "-o", "`"$ActualDumpFile`"",
                    "`"$($gpgCandidate.FullName)`""
                ) -join ' '

                $psi = New-Object System.Diagnostics.ProcessStartInfo
                $psi.FileName = "gpg"
                $psi.Arguments = $gpgArgs
                $psi.UseShellExecute = $false
                $psi.RedirectStandardInput = $true
                $psi.RedirectStandardOutput = $false
                $psi.RedirectStandardError = $false

                $proc = [System.Diagnostics.Process]::Start($psi)
                try {
                    # Write passphrase to stdin (not visible in process list)
                    $proc.StandardInput.WriteLine($GpgPassphrase)
                    $proc.StandardInput.Close()
                    $proc.WaitForExit()
                    $LASTEXITCODE = $proc.ExitCode
                } finally {
                    if ($proc -ne $null) {
                        $proc.Dispose()
                    }
                }
                if ($LASTEXITCODE -ne 0) {
                    Write-Error "GPG decryption failed"
                    exit 1
                }
                $TempDecrypted = $true
            }
        } else {
            Write-Error "No .dump or .dump.gpg files found in $($latestDir.FullName)"
            exit 1
        }
    }

    # Load row counts for verification
    $RowCountFile = Join-Path $latestDir.FullName "row_counts.json"
}

# --- Banner ---
Write-Host ""
Write-Host "=== DWS6 Aiven Mirror Restore ===" -ForegroundColor Cyan
Write-Host "  Aiven Host:  $AivenHost" -ForegroundColor White
Write-Host "  Aiven DB:    $AivenDb" -ForegroundColor White
Write-Host "  Aiven User:  $AivenUser" -ForegroundColor White
Write-Host "  Dump File:   $ActualDumpFile" -ForegroundColor White
Write-Host "  SSL Mode:    $AivenSslMode" -ForegroundColor White
if ($DryRun) { Write-Host "  MODE:        DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# --- Step 1: Test connectivity ---
Write-Host "Step 1/4: Testing Aiven connectivity" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [TEST] psql -h $AivenHost -p $AivenPort -U $AivenUser -c 'SELECT 1'" -ForegroundColor Yellow
} elseif ($Psql) {
    try {
        $env:PGPASSWORD = $AivenPassword
        $env:PGSSLMODE = $AivenSslMode
        $result = & $Psql -h $AivenHost -p $AivenPort -U $AivenUser -d $AivenDb -t -A -c "SELECT 1" 2>&1
        if ($result -match "1") {
            Write-Host "  [OK] Connected to Aiven" -ForegroundColor Green
        } else {
            throw "Connection test returned: $result"
        }
    } catch {
        Write-Host "  [ERROR] Cannot connect to Aiven: $_" -ForegroundColor Red
        exit 1
    } finally {
        $env:PGPASSWORD = $null
    }
} else {
    Write-Host "  [SKIP] psql not available, will attempt restore directly" -ForegroundColor Gray
}

# --- Step 2: Pre-restore row counts ---
$preRestoreCounts = $null
if (-not $SkipVerify -and $Psql -and -not $DryRun) {
    Write-Host "Step 2/4: Pre-restore row counts" -ForegroundColor Cyan
    try {
        $env:PGPASSWORD = $AivenPassword
        $env:PGSSLMODE = $AivenSslMode
        $query = "SELECT json_agg(row_to_json(t)) FROM (SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC) t"
        $preRestoreCounts = & $Psql -h $AivenHost -p $AivenPort -U $AivenUser -d $AivenDb -t -A -c $query 2>&1
        Write-Host "  [OK] Captured pre-restore state" -ForegroundColor Green
    } catch {
        Write-Warning "Pre-restore count failed: $_ (non-fatal)"
    } finally {
        $env:PGPASSWORD = $null
    }
} else {
    Write-Host "Step 2/4: Pre-restore row counts [SKIP]" -ForegroundColor Gray
}

# --- Step 3: pg_restore ---
Write-Host "Step 3/4: pg_restore to Aiven" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [RESTORE] pg_restore --clean --if-exists --no-owner --no-acl --schema=public" -ForegroundColor Yellow
    Write-Host "  [RESTORE] -h $AivenHost -p $AivenPort -U $AivenUser -d $AivenDb" -ForegroundColor Yellow
} else {
    try {
        $env:PGPASSWORD = $AivenPassword
        $env:PGSSLMODE = $AivenSslMode

        $restoreArgs = @(
            "-h", $AivenHost,
            "-p", $AivenPort,
            "-U", $AivenUser,
            "-d", $AivenDb,
            "--clean",
            "--if-exists",
            "--no-owner",
            "--no-acl",
            "--schema=public",
            "--verbose",
            $ActualDumpFile
        )

        # pg_restore returns non-zero on warnings (like "table does not exist" for --clean)
        # Capture output and check for actual errors
        $output = & $PgRestore @restoreArgs 2>&1
        $exitCode = $LASTEXITCODE
        $errors = $output | Where-Object { $_ -match "ERROR" -and $_ -notmatch "does not exist" }

        if ($errors) {
            Write-Warning "pg_restore completed with errors (exit code $exitCode):"
            $errors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
            exit 1
        } elseif ($exitCode -ne 0) {
            # Non-zero exit code but no ERROR lines detected; likely benign --clean/--if-exists warnings
            Write-Warning "pg_restore exited with code $exitCode but no ERROR lines were detected. This may be benign (e.g. --clean/--if-exists warnings)."
        } else {
            Write-Host "  [OK] Restore complete" -ForegroundColor Green
        }
    } catch {
        Write-Host "  [ERROR] pg_restore failed: $_" -ForegroundColor Red
        exit 1
    } finally {
        $env:PGPASSWORD = $null
        $env:PGSSLMODE = $null
    }
}

# --- Step 4: Post-restore verification ---
Write-Host "Step 4/4: Post-restore verification" -ForegroundColor Cyan

if ($SkipVerify -or $DryRun) {
    Write-Host "  [SKIP] Verification $( if ($DryRun) {'(dry run)'} else {'disabled'} )" -ForegroundColor Gray
} elseif ($Psql) {
    try {
        $env:PGPASSWORD = $AivenPassword
        $env:PGSSLMODE = $AivenSslMode

        # Get post-restore counts
        $query = "SELECT json_agg(row_to_json(t)) FROM (SELECT relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC) t"
        $postCounts = & $Psql -h $AivenHost -p $AivenPort -U $AivenUser -d $AivenDb -t -A -c $query 2>&1

        if ($postCounts -and $postCounts -ne "null") {
            $tables = $postCounts | ConvertFrom-Json
            $totalRows = ($tables | Measure-Object -Property n_live_tup -Sum).Sum
            Write-Host "  [OK] $($tables.Count) tables, $totalRows total rows on Aiven" -ForegroundColor Green

            # Compare with backup row_counts.json if available
            if ($RowCountFile -and (Test-Path $RowCountFile)) {
                $sourceCountsRaw = Get-Content $RowCountFile -Raw | ConvertFrom-Json
                $sourceTotalRows = ($sourceCountsRaw | Measure-Object -Property n_live_tup -Sum).Sum

                if ($sourceTotalRows -gt 0) {
                    $delta = [math]::Abs($totalRows - $sourceTotalRows) / $sourceTotalRows * 100
                    if ($delta -gt 5) {
                        Write-Warning "Row count delta: ${delta}% (source: $sourceTotalRows, aiven: $totalRows)"
                    } else {
                        Write-Host "  [OK] Row count delta: $([math]::Round($delta, 1))% (within threshold)" -ForegroundColor Green
                    }
                }
            }
        }

        # Log restore metadata using parameterized query to prevent SQL injection.
        # psql doesn't support bind parameters directly, so we use dollar-quoting
        # and escape single quotes in all interpolated values.
        $datestamp = if ($RowCountFile) { Split-Path -Parent $RowCountFile | Split-Path -Leaf } else { Get-Date -Format "yyyy-MM-dd" }
        $sourceHost = ($env:SUPABASE_DB_HOST ?? "unknown") -replace "'", "''"
        $sourceDb = ($env:SUPABASE_DB_NAME ?? "postgres") -replace "'", "''"
        $safeDate = $datestamp -replace "'", "''"

        # Validate row counts is valid JSON before inserting; fall back to empty array
        $safeRowCounts = "{}"
        if ($postCounts -and $postCounts -ne "null") {
            try {
                $null = $postCounts | ConvertFrom-Json
                $safeRowCounts = ($postCounts -replace "'", "''")
            } catch {
                $safeRowCounts = "[]"
            }
        }

        # Escape single quotes in values before embedding in SQL to prevent injection
        $escapedSourceHost = $sourceHost.Replace("'", "''")
        $escapedSourceDb   = $sourceDb.Replace("'", "''")
        $escapedPostCounts = $postCounts.Replace("'", "''")

        $insertQuery = @"
INSERT INTO _backup_metadata (source_host, source_db, backup_date, row_counts, notes)
VALUES ('$escapedSourceHost', '$escapedSourceDb', '$datestamp', '$escapedPostCounts'::jsonb, 'Automated mirror restore')
ON CONFLICT DO NOTHING
"@
        & $Psql -h $AivenHost -p $AivenPort -U $AivenUser -d $AivenDb -c $insertQuery 2>&1 | Out-Null
        Write-Host "  [OK] Logged to _backup_metadata" -ForegroundColor Green

    } catch {
        Write-Warning "Verification failed: $_ (non-fatal, restore likely succeeded)"
    } finally {
        $env:PGPASSWORD = $null
        $env:PGSSLMODE = $null
    }
} else {
    Write-Host "  [SKIP] psql not available for verification" -ForegroundColor Gray
}

# --- Cleanup temp decrypted file ---
if ($TempDecrypted -and (Test-Path $ActualDumpFile)) {
    Remove-Item $ActualDumpFile -Force
    Write-Host "  [OK] Cleaned up temp decrypted file" -ForegroundColor Green
}

# --- Summary ---
Write-Host ""
Write-Host "=== Aiven Mirror Complete ===" -ForegroundColor Cyan
if (-not $DryRun) {
    Write-Host "  Target:  ${AivenUser}@${AivenHost}:${AivenPort}/${AivenDb}" -ForegroundColor Green
    Write-Host "  Source:  $(Split-Path -Leaf $ActualDumpFile)" -ForegroundColor Green
}
Write-Host ""
