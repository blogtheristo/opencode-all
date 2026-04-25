<#
.SYNOPSIS
    Daily pg_dump from Supabase PostgreSQL with GPG encryption and multi-destination backup.

.DESCRIPTION
    Version: 1.0

    CHANGE LOG:
      v1.0 - 07.03.2026 - Initial: pg_dump from Supabase, GPG encryption, row count verification,
                           local retention, optional SCP to Acer Veriton Helsinki

    Creates a daily database backup from Supabase PostgreSQL:
    1. pg_dump in custom format (.dump) for fast restore
    2. pg_dump schema-only (.sql) for readability
    3. Row count snapshot (row_counts.json) for verification
    4. GPG symmetric encryption (AES256) of .dump file
    5. Optional SCP transfer to Acer Veriton GN100 in Helsinki
    6. Auto-cleanup of local backups older than retention period

    Backup destinations (handled by other scripts):
    - Local:          F:\2026\Backups\dws6-db\YYYY-MM-DD\ (this script)
    - Proton Drive:   Sync-ToProton.ps1 picks up encrypted .gpg files
    - Acer Helsinki:  -RemoteBackup flag sends via SCP
    - GitHub Actions: daily-db-backup.yml (separate CI/CD workflow)

    Requires: pg_dump/psql from PostgreSQL 17+ (match hosted Supabase; see supabase/config.toml db.major_version)
               OR Docker image with pg_dump 17+ (e.g. postgres:17)

.PARAMETER BackupDir
    Local backup directory. Default: F:\2026\Backups\dws6-db

.PARAMETER RetentionDays
    Days to keep local backups. Default: 30

.PARAMETER DryRun
    Show what would happen without executing.

.PARAMETER SkipEncrypt
    Skip GPG encryption (for debugging only).

.PARAMETER SchemaOnly
    Dump schema only, no data.

.PARAMETER RemoteBackup
    Send encrypted backup to Acer Veriton GN100 in Helsinki via SCP.

.EXAMPLE
    .\Backup-Database.ps1
    .\Backup-Database.ps1 -DryRun
    .\Backup-Database.ps1 -RemoteBackup
    .\Backup-Database.ps1 -BackupDir "D:\Backups\dws6-db" -RetentionDays 60
#>

param(
    [string]$BackupDir = "F:\2026\Backups\dws6-db",
    [int]$RetentionDays = 30,
    [switch]$DryRun,
    [switch]$SkipEncrypt,
    [switch]$SchemaOnly,
    [switch]$RemoteBackup
)

# --- Configuration ---
$ErrorActionPreference = "Stop"
$Datestamp = Get-Date -Format "yyyy-MM-dd"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$DayDir = Join-Path $BackupDir $Datestamp

# --- Load environment variables from .env ---
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

# --- Database connection (from env) ---
$DbHost = $env:SUPABASE_DB_HOST
$DbPort = $env:SUPABASE_DB_PORT ?? "5432"
$DbName = $env:SUPABASE_DB_NAME ?? "postgres"
$DbUser = $env:SUPABASE_DB_USER ?? "postgres"
$DbPassword = $env:SUPABASE_DB_PASSWORD
$GpgPassphrase = $env:BACKUP_GPG_PASSPHRASE

# Remote backup config
$VeritonHost = $env:ACER_VERITON_HOST
$VeritonUser = $env:ACER_VERITON_USER ?? "backup"
$VeritonSshKey = $env:ACER_VERITON_SSH_KEY
$VeritonBackupDir = $env:ACER_VERITON_BACKUP_DIR ?? "/backups/dws6-db"

# --- Validation ---
if (-not $DbHost) {
    Write-Error "SUPABASE_DB_HOST not set. Add to .env file."
    exit 1
}
if (-not $DbPassword) {
    Write-Error "SUPABASE_DB_PASSWORD not set. Add to .env file."
    exit 1
}
if (-not $SkipEncrypt -and -not $GpgPassphrase) {
    Write-Error "BACKUP_GPG_PASSPHRASE not set. Add to .env or use -SkipEncrypt."
    exit 1
}
if ($RemoteBackup -and -not $VeritonHost) {
    Write-Error "ACER_VERITON_HOST not set. Add to .env file."
    exit 1
}

# --- Find pg_dump ---
$PgDump = $null
$PgDumpSource = ""

# Check PATH first
$PgDumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue
if ($PgDumpPath) {
    $PgDump = $PgDumpPath.Source
    $PgDumpSource = "PATH"
} else {
    # Check common Windows install locations
    $commonPaths = @(
        "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe",
        "C:\Program Files\PostgreSQL\15\bin\pg_dump.exe",
        "C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"
    )
    foreach ($p in $commonPaths) {
        if (Test-Path $p) {
            $PgDump = $p
            $PgDumpSource = "installed"
            break
        }
    }
}

# Docker fallback
$UseDocker = $false
if (-not $PgDump) {
    $DockerCheck = Get-Command docker -ErrorAction SilentlyContinue
    if ($DockerCheck) {
        $UseDocker = $true
        $PgDumpSource = "Docker (pgvector/pgvector:pg16)"
    } else {
        Write-Error "pg_dump not found in PATH, common locations, or Docker. Install PostgreSQL client tools or Docker."
        exit 1
    }
}

# --- Find psql (for row counts) ---
$Psql = $null
$PsqlPath = Get-Command psql -ErrorAction SilentlyContinue
if ($PsqlPath) {
    $Psql = $PsqlPath.Source
} else {
    $commonPsql = @(
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files\PostgreSQL\17\bin\psql.exe"
    )
    foreach ($p in $commonPsql) {
        if (Test-Path $p) {
            $Psql = $p
            break
        }
    }
}

# --- Find gpg ---
$Gpg = $null

# Explicit override for allowing plaintext remote backup when gpg is missing.
# Set ALLOW_PLAINTEXT_REMOTE=1|true|yes in the environment to opt in.
$allowPlaintextRemote = $false
if ($env:ALLOW_PLAINTEXT_REMOTE) {
    $allowPlaintextRemoteValue = $env:ALLOW_PLAINTEXT_REMOTE.ToString().ToLowerInvariant()
    if ($allowPlaintextRemoteValue -in @("1", "true", "yes")) {
        $allowPlaintextRemote = $true
    }
}

if (-not $SkipEncrypt) {
    $GpgPath = Get-Command gpg -ErrorAction SilentlyContinue
    if ($GpgPath) {
        $Gpg = $GpgPath.Source
    } else {
        if ($RemoteBackup) {
            if (-not $allowPlaintextRemote) {
                Write-Error "gpg not found but -RemoteBackup was specified. Remote backups require encryption. Install GnuPG or explicitly allow plaintext remote transfer via ALLOW_PLAINTEXT_REMOTE=1."
                exit 1
            }
            Write-Warning "gpg not found and -RemoteBackup was specified. ALLOW_PLAINTEXT_REMOTE is set, so remote backup will proceed WITHOUT encryption. The .dump file will be transferred in plaintext."
            $SkipEncrypt = [switch]::new($true)
        } else {
            Write-Warning "gpg not found. Encryption will be skipped for local backup. Install GnuPG or use -SkipEncrypt."
            $SkipEncrypt = [switch]::new($true)
        }
    }
}

# --- Output file paths ---
$DumpFile = Join-Path $DayDir "dws6_${Datestamp}.dump"
$SchemaFile = Join-Path $DayDir "schema_${Datestamp}.sql"
$RowCountFile = Join-Path $DayDir "row_counts.json"
$ManifestFile = Join-Path $DayDir "manifest.json"

# --- Banner ---
Write-Host ""
Write-Host "=== DWS6 Database Backup ===" -ForegroundColor Cyan
Write-Host "  Host:      $DbHost" -ForegroundColor White
Write-Host "  Database:  $DbName" -ForegroundColor White
Write-Host "  User:      $DbUser" -ForegroundColor White
Write-Host "  pg_dump:   $PgDumpSource" -ForegroundColor White
Write-Host "  Output:    $DayDir" -ForegroundColor White
Write-Host "  Retention: $RetentionDays days" -ForegroundColor White
Write-Host "  Encrypt:   $(-not $SkipEncrypt)" -ForegroundColor White
Write-Host "  Remote:    $RemoteBackup" -ForegroundColor White
if ($DryRun) { Write-Host "  MODE:      DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# --- Create backup directory ---
if (-not (Test-Path $DayDir)) {
    if ($DryRun) {
        Write-Host "  [MKDIR] $DayDir" -ForegroundColor Cyan
    } else {
        New-Item -ItemType Directory -Path $DayDir -Force | Out-Null
        Write-Host "  [OK] Created $DayDir" -ForegroundColor Green
    }
}

# --- Step 1: pg_dump (custom format) ---
Write-Host "Step 1/6: pg_dump (custom format)" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [DUMP] pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName -F c -f $DumpFile" -ForegroundColor Yellow
} else {
    try {
        # Set password via environment variable (NEVER on command line)
        $env:PGPASSWORD = $DbPassword

        if ($UseDocker) {
            $dockerArgs = @(
                "run", "--rm",
                "-e", "PGPASSWORD=$DbPassword",
                "-v", "${DayDir}:/backup",
                "pgvector/pgvector:pg16",
                "pg_dump",
                "-h", $DbHost,
                "-p", $DbPort,
                "-U", $DbUser,
                "-d", $DbName,
                "-F", "c",
                "-f", "/backup/dws6_${Datestamp}.dump"
            )
            if ($SchemaOnly) { $dockerArgs += "--schema-only" }
            & docker @dockerArgs
        } else {
            $pgArgs = @(
                "-h", $DbHost,
                "-p", $DbPort,
                "-U", $DbUser,
                "-d", $DbName,
                "-F", "c",
                "-f", $DumpFile
            )
            if ($SchemaOnly) { $pgArgs += "--schema-only" }
            & $PgDump @pgArgs
        }

        if ($LASTEXITCODE -ne 0) {
            throw "pg_dump failed with exit code $LASTEXITCODE"
        }

        $dumpSize = (Get-Item $DumpFile).Length
        if ($dumpSize -lt 1000) {
            Write-Warning "Dump file suspiciously small: $dumpSize bytes"
        }
        Write-Host "  [OK] $DumpFile ($([math]::Round($dumpSize / 1KB, 1)) KB)" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] pg_dump failed: $_" -ForegroundColor Red
        exit 1
    } finally {
        # Clear password from environment immediately
        $env:PGPASSWORD = $null
    }
}

# --- Step 2: Schema-only dump ---
Write-Host "Step 2/6: Schema-only dump (SQL)" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [DUMP] pg_dump --schema-only -f $SchemaFile" -ForegroundColor Yellow
} elseif (-not $SchemaOnly) {
    # Only do separate schema dump if main dump includes data
    try {
        $env:PGPASSWORD = $DbPassword

        if ($UseDocker) {
            & docker run --rm `
                -e "PGPASSWORD=$DbPassword" `
                -v "${DayDir}:/backup" `
                pgvector/pgvector:pg16 `
                pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName `
                --schema-only -f "/backup/schema_${Datestamp}.sql"
        } else {
            & $PgDump -h $DbHost -p $DbPort -U $DbUser -d $DbName `
                --schema-only -f $SchemaFile
        }

        Write-Host "  [OK] $SchemaFile" -ForegroundColor Green
    } catch {
        Write-Warning "Schema dump failed: $_ (non-fatal)"
    } finally {
        $env:PGPASSWORD = $null
    }
} else {
    Write-Host "  [SKIP] Schema-only mode, main dump is schema" -ForegroundColor Gray
}

# --- Step 3: Row count verification ---
Write-Host "Step 3/6: Row count snapshot" -ForegroundColor Cyan

if ($DryRun) {
    Write-Host "  [QUERY] SELECT row counts from pg_stat_user_tables" -ForegroundColor Yellow
} elseif ($Psql) {
    try {
        $env:PGPASSWORD = $DbPassword
        $query = "SELECT json_agg(row_to_json(t)) FROM (SELECT schemaname, relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC) t"
        $result = & $Psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -t -A -c $query 2>&1
        $env:PGPASSWORD = $null

        if ($result -and $result -ne "null" -and $result.Length -gt 2) {
            Set-Content -Path $RowCountFile -Value $result -Encoding UTF8
            Write-Host "  [OK] $RowCountFile" -ForegroundColor Green
        } else {
            Write-Warning "Row count query returned empty (tables may not have stats yet)"
            Set-Content -Path $RowCountFile -Value "[]" -Encoding UTF8
        }
    } catch {
        Write-Warning "Row count snapshot failed: $_ (non-fatal)"
        $env:PGPASSWORD = $null
    }
} elseif ($UseDocker) {
    try {
        $query = "SELECT json_agg(row_to_json(t)) FROM (SELECT schemaname, relname, n_live_tup FROM pg_stat_user_tables ORDER BY n_live_tup DESC) t"
        $result = & docker run --rm `
            -e "PGPASSWORD=$DbPassword" `
            pgvector/pgvector:pg16 `
            psql -h $DbHost -p $DbPort -U $DbUser -d $DbName -t -A -c $query 2>&1

        if ($result -and $result -ne "null") {
            Set-Content -Path $RowCountFile -Value $result -Encoding UTF8
            Write-Host "  [OK] $RowCountFile (via Docker)" -ForegroundColor Green
        }
    } catch {
        Write-Warning "Row count snapshot via Docker failed: $_ (non-fatal)"
    }
} else {
    Write-Host "  [SKIP] psql not available" -ForegroundColor Gray
}

# --- Step 4: GPG encryption ---
Write-Host "Step 4/6: GPG encryption" -ForegroundColor Cyan

$EncryptedFile = "${DumpFile}.gpg"

if ($SkipEncrypt) {
    Write-Host "  [SKIP] Encryption disabled" -ForegroundColor Gray
} elseif ($DryRun) {
    Write-Host "  [GPG] $DumpFile -> $EncryptedFile" -ForegroundColor Yellow
} else {
    try {
        $GpgPassphrase | & $Gpg --batch --yes --symmetric --cipher-algo AES256 `
            --pinentry-mode loopback `
            --passphrase-fd 0 `
            -o $EncryptedFile $DumpFile

        if ($LASTEXITCODE -ne 0) {
            throw "gpg encryption failed with exit code $LASTEXITCODE"
        }

        # Remove unencrypted dump after successful encryption
        Remove-Item $DumpFile -Force
        $encSize = (Get-Item $EncryptedFile).Length
        Write-Host "  [OK] $EncryptedFile ($([math]::Round($encSize / 1KB, 1)) KB)" -ForegroundColor Green
        Write-Host "  [OK] Removed unencrypted .dump" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] Encryption failed: $_" -ForegroundColor Red

        # Clean up any partially created encrypted file
        if (Test-Path $EncryptedFile) {
            Remove-Item $EncryptedFile -Force -ErrorAction SilentlyContinue
        }

        # Remove unencrypted dump to avoid leaving plaintext when encryption is required
        if (Test-Path $DumpFile) {
            Remove-Item $DumpFile -Force -ErrorAction SilentlyContinue
            Write-Warning "Unencrypted .dump file removed due to encryption failure."
        }

        # Ensure the script fails with a non-zero exit code so automation can detect the error
        $global:LASTEXITCODE = 1
        throw
    }
}

# --- Step 5: Remote backup to Acer Veriton Helsinki ---
Write-Host "Step 5/6: Remote backup (Acer Veriton Helsinki)" -ForegroundColor Cyan

if (-not $RemoteBackup) {
    Write-Host "  [SKIP] Use -RemoteBackup to enable" -ForegroundColor Gray
} elseif ($DryRun) {
    Write-Host "  [SCP] -> ${VeritonUser}@${VeritonHost}:${VeritonBackupDir}/${Datestamp}/" -ForegroundColor Yellow
} else {
    try {
        $scpSource = if ($SkipEncrypt) { $DumpFile } else { $EncryptedFile }
        $scpDest = "${VeritonUser}@${VeritonHost}:${VeritonBackupDir}/${Datestamp}/"

        # Create remote directory
        $sshArgs = @()
        if ($VeritonSshKey) { $sshArgs += @("-i", $VeritonSshKey) }
        $sshArgs += @("${VeritonUser}@${VeritonHost}", "mkdir -p ${VeritonBackupDir}/${Datestamp}")
        & ssh @sshArgs

        # SCP the backup files
        $filesToSend = @($scpSource, $ManifestFile, $RowCountFile, $SchemaFile) | Where-Object { Test-Path $_ }
        foreach ($file in $filesToSend) {
            $scpArgs = @()
            if ($VeritonSshKey) { $scpArgs += @("-i", $VeritonSshKey) }
            $scpArgs += @($file, $scpDest)
            & scp @scpArgs
            Write-Host "  [OK] SCP $(Split-Path -Leaf $file)" -ForegroundColor Green
        }
    } catch {
        Write-Host "  [ERROR] Remote backup failed: $_" -ForegroundColor Red
        Write-Warning "Local backup is safe. Fix SSH connectivity and retry."
    }
}

# --- Step 6: Cleanup old backups ---
Write-Host "Step 6/6: Cleanup (>$RetentionDays days)" -ForegroundColor Cyan

if ($DryRun) {
    $oldDirs = Get-ChildItem -Path $BackupDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^\d{4}-\d{2}-\d{2}$' } |
        Where-Object { (Get-Date) - $_.CreationTime -gt [TimeSpan]::FromDays($RetentionDays) }
    if ($oldDirs) {
        $oldDirs | ForEach-Object { Write-Host "  [DELETE] $($_.FullName)" -ForegroundColor Yellow }
    } else {
        Write-Host "  [SKIP] No old backups to clean" -ForegroundColor Gray
    }
} else {
    $cleaned = 0
    Get-ChildItem -Path $BackupDir -Directory -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -match '^\d{4}-\d{2}-\d{2}$' } |
        Where-Object { (Get-Date) - $_.CreationTime -gt [TimeSpan]::FromDays($RetentionDays) } |
        ForEach-Object {
            Remove-Item $_.FullName -Recurse -Force
            $cleaned++
        }
    if ($cleaned -gt 0) {
        Write-Host "  [OK] Removed $cleaned old backup(s)" -ForegroundColor Green
    } else {
        Write-Host "  [OK] No old backups to clean" -ForegroundColor Gray
    }
}

# --- Write manifest ---
if (-not $DryRun) {
    $manifest = @{
        timestamp      = $Timestamp
        datestamp      = $Datestamp
        host           = $DbHost
        database       = $DbName
        pg_dump_source = $PgDumpSource
        encrypted      = -not [bool]$SkipEncrypt
        schema_only    = [bool]$SchemaOnly
        remote_backup  = [bool]$RemoteBackup
        retention_days = $RetentionDays
        files          = @{}
    }

    @($DumpFile, $EncryptedFile, $SchemaFile, $RowCountFile) | ForEach-Object {
        if (Test-Path $_) {
            $manifest.files[(Split-Path -Leaf $_)] = @{
                size_bytes = (Get-Item $_).Length
                size_human = "$([math]::Round((Get-Item $_).Length / 1KB, 1)) KB"
            }
        }
    }

    $manifest | ConvertTo-Json -Depth 3 | Set-Content -Path $ManifestFile -Encoding UTF8
}

# --- Summary ---
Write-Host ""
Write-Host "=== Backup Complete ===" -ForegroundColor Cyan
if (-not $DryRun) {
    $totalSize = (Get-ChildItem -Path $DayDir -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    Write-Host "  Location:  $DayDir" -ForegroundColor Green
    Write-Host "  Total:     $([math]::Round($totalSize / 1KB, 1)) KB" -ForegroundColor Green
    Write-Host "  Encrypted: $(-not $SkipEncrypt)" -ForegroundColor Green
    if ($RemoteBackup) {
        Write-Host "  Remote:    ${VeritonUser}@${VeritonHost}:${VeritonBackupDir}/${Datestamp}/" -ForegroundColor Green
    }
}
Write-Host ""

# --- Log backup event ---
if (-not $DryRun) {
    $logFile = Join-Path $BackupDir "backup.log"
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | pg_dump $DbHost/$DbName | encrypted=$(-not $SkipEncrypt) | remote=$RemoteBackup"
    Add-Content -Path $logFile -Value $logEntry
}
