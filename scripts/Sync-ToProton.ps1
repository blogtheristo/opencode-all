<#
.SYNOPSIS
    Syncs DWS6 project files to Proton Drive for encrypted backup.

.DESCRIPTION
    Version: 2.0

    CHANGE LOG:
      v1.0 - 05.02.2026 - Initial: folder mappings, MD5 dedup, sensitive file sync
      v1.1 - 05.02.2026 - Added -FullRepo backup flag, exclude folders
      v1.2 - 06.02.2026 - Added -GeneratePDFs flag, calls Generate-PDFs.ps1
      v1.3 - 06.02.2026 - Added -OpenNewPDFs, switched to hashtable splatting
      v1.4 - 07.02.2026 - Documented versioning
      v1.5 - 07.02.2026 - Added root-level standards to $SyncFiles (CLAUDE.md, DWS_DOCUMENT_STANDARD, etc.)
      v1.6 - 07.02.2026 - PDF output now goes to Learn/ folder (HIL pipeline)
      v1.7 - 08.02.2026 - Fix: sync Learn/ (generated HTML/PDF) to Proton after generation
      v1.8 - 10.02.2026 - Added docs/ folder to folder mappings
      v1.9 - 04.03.2026 - Added investor-outreach/ and sales-outreach/ folders to folder mappings
      v2.0 - 07.03.2026 - Added encrypted database backup sync (.gpg files from Backup-Database.ps1)

    Copies business files from the git repo to Proton Drive, mapping repo
    folders to the correct Proton Drive structure:

    Repo                          Proton Drive (F:\Proton\...\2026\)
    ----                          --------------------------------
    Admin/                    --> Repos2026\dws6\Admin\
    AgentFoundry/             --> Repos2026\dws6\AgentFoundry\
    docs/                     --> Repos2026\dws6\docs\
    investor-outreach/        --> Repos2026\dws6\investor-outreach\
    sales-outreach/           --> Repos2026\dws6\sales-outreach\
    Firehorse/                --> Firehorse\
    docs/metropolia/          --> Metropolia2026\
    Metropolia2026/           --> Metropolia2026\
    onelifetime.world/        --> LifetimeWorld\
    landing-pages/lifetime-fi/--> Lifetime_fi\
    .env, credentials, etc.   --> Repos2026\dws6\ (sensitive backup)

    Runs locally on Windows (Cursor/VS Code) after git pull.

.PARAMETER RepoPath
    Path to the git repo. Default: auto-detect from script location.

.PARAMETER ProtonRoot
    Root of Proton Drive 2026 folder. Default: F:\Proton\Proton\My files\2026

.PARAMETER DryRun
    Show what would be copied without copying.

.PARAMETER BackupPath
    Path for full repo backups. Default: F:\2026\Backups\dws6

.PARAMETER FullRepo
    Copy the entire dws6 repository to BackupPath (excluding node_modules,
    .git, dist, build, venv). Without this flag, only mapped folders and
    sensitive files are synced to Proton Drive.

.PARAMETER GeneratePDFs
    After sync, generate PDFs from admin manuals and business docs using pandoc.

.PARAMETER OpenNewPDFs
    Open newly generated PDFs in Edge browser for review.

.EXAMPLE
    .\Sync-ToProton.ps1
    .\Sync-ToProton.ps1 -DryRun
    .\Sync-ToProton.ps1 -FullRepo
    .\Sync-ToProton.ps1 -GeneratePDFs -OpenNewPDFs
    .\Sync-ToProton.ps1 -ProtonRoot "D:\Proton\My files\2026"
#>

param(
    [string]$RepoPath = "",
    [string]$ProtonRoot = "F:\Proton\Proton\My files\2026",
    [string]$BackupPath = "F:\2026\Backups\dws6",
    [switch]$DryRun,
    [switch]$FullRepo,
    [switch]$GeneratePDFs,
    [switch]$OpenNewPDFs,
    [ValidateSet("wkhtmltopdf", "html")]
    [string]$PdfEngine = "html"
)

# --- Configuration ---
# Proton Drive sub-path for the git repo backup (secrets, Admin, etc.)
$ProtonRepoPath = Join-Path $ProtonRoot "Repos2026\dws6"

# Folder mappings: repo folder -> Proton Drive destination
# "same" means copy to $ProtonRepoPath preserving structure
$FolderMappings = @(
    @{ Src = "Admin";                        Dest = "same" }
    @{ Src = "AgentFoundry";                 Dest = "same" }
    @{ Src = "docs";                         Dest = "same" }
    @{ Src = "investor-outreach";            Dest = "same" }
    @{ Src = "sales-outreach";               Dest = "same" }
    @{ Src = "Team";                         Dest = "same" }
    @{ Src = "Firehorse";                    Dest = (Join-Path $ProtonRoot "Firehorse") }
    @{ Src = "docs\metropolia";              Dest = (Join-Path $ProtonRoot "Metropolia2026") }
    @{ Src = "Metropolia2026";               Dest = (Join-Path $ProtonRoot "Metropolia2026") }
    @{ Src = "onelifetime.world";            Dest = (Join-Path $ProtonRoot "LifetimeWorld") }
    @{ Src = "landing-pages\lifetime-fi";    Dest = (Join-Path $ProtonRoot "Lifetime_fi") }
)

# Individual doc files -> Proton repo backup (relative to $RepoPath)
# NOTE: Files inside mapped folders (Admin/, docs/, Firehorse/, etc.) are already
# synced by $FolderMappings above. Only list files that live OUTSIDE mapped folders.
$SyncFiles = @(
    # Root-level standards and environment files
    "CLAUDE.md",
    "DWS_DOCUMENT_STANDARD.md",
    "VERSION_AND_AGENT_HISTORY_TEMPLATE.md",
    "ONTOLOGY.md",
    "README.md",
    "16-INDUSTRIES.md",
    # GitHub/AI agent environment rules
    ".github\copilot-instructions.md"
)

# Sensitive/gitignored files -> Proton repo backup (encrypted)
$SensitiveFiles = @(
    ".env",
    ".env.local",
    ".env.mcp",
    ".mcp.json",
    "credentials.json",
    "SFTP_SECRETS.py",
    "CLOUDFLARE_SECRETS.md",
    "ADD_TOKEN_TO_GITHUB.md",
    "supabase\.env",
    "supabase\.env.local",
    "supabase\PROJECT_INFO.md"
)

# Folders to EXCLUDE from full repo copy (large/generated/not useful on Proton)
$ExcludeFolders = @(
    ".git",
    "node_modules",
    ".next",
    "dist",
    "build",
    "out",
    ".venv",
    "venv",
    "__pycache__",
    ".gradle",
    "captures",
    ".externalNativeBuild",
    ".cxx",
    ".vercel",
    ".turbo",
    "mcp-context-data",
    "claude-sessions"
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

# --- Validation ---
if (-not (Test-Path $RepoPath)) {
    Write-Error "Repo path not found: $RepoPath"
    exit 1
}

if (-not (Test-Path $ProtonRoot)) {
    Write-Error "Proton Drive root not found: $ProtonRoot"
    Write-Error "Is Proton Drive mounted? Check F: drive."
    exit 1
}

if (-not (Test-Path $ProtonRepoPath)) {
    Write-Warning "Creating repo backup folder: $ProtonRepoPath"
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path $ProtonRepoPath -Force | Out-Null
    }
}

# --- Sync logic ---
$syncCount = 0
$skipCount = 0
$errorCount = 0

function Sync-Item {
    param(
        [string]$Source,
        [string]$Destination
    )

    if (-not (Test-Path $Source)) {
        return
    }

    $destDir = Split-Path -Parent $Destination
    if (-not (Test-Path $destDir)) {
        if ($DryRun) {
            Write-Host "  [MKDIR] $destDir" -ForegroundColor Cyan
        } else {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
    }

    # Skip if identical (MD5 compare)
    if (Test-Path $Destination) {
        $srcHash = (Get-FileHash $Source -Algorithm MD5).Hash
        $dstHash = (Get-FileHash $Destination -Algorithm MD5).Hash
        if ($srcHash -eq $dstHash) {
            $script:skipCount++
            return
        }
    }

    if ($DryRun) {
        Write-Host "  [COPY] $Source -> $Destination" -ForegroundColor Yellow
    } else {
        try {
            Copy-Item -Path $Source -Destination $Destination -Force
            Write-Host "  [OK] $Source" -ForegroundColor Green
        } catch {
            Write-Host "  [ERROR] $Source : $_" -ForegroundColor Red
            $script:errorCount++
            return
        }
    }
    $script:syncCount++
}

Write-Host ""
Write-Host "=== DWS6 Proton Drive Sync ===" -ForegroundColor Cyan
Write-Host "  Repo:        $RepoPath"
Write-Host "  Proton Root: $ProtonRoot"
Write-Host "  Secrets:     $ProtonRepoPath"
if ($FullRepo) { Write-Host "  Backup:      $BackupPath" }
if ($DryRun) { Write-Host "  MODE:        DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# --- Sync mapped folders ---
foreach ($mapping in $FolderMappings) {
    $srcFolder = Join-Path $RepoPath $mapping.Src
    if (-not (Test-Path $srcFolder)) { continue }

    $destBase = if ($mapping.Dest -eq "same") {
        $ProtonRepoPath
    } else {
        $mapping.Dest
    }

    Write-Host "Syncing $($mapping.Src)/ -> $destBase" -ForegroundColor Cyan
    $files = Get-ChildItem -Path $srcFolder -Recurse -File
    foreach ($file in $files) {
        if ($mapping.Dest -eq "same") {
            # Preserve full relative path under repo backup
            $relativePath = $file.FullName.Substring($RepoPath.Length + 1)
            $destPath = Join-Path $ProtonRepoPath $relativePath
        } else {
            # Map to Proton subfolder, preserving internal structure
            $relativeToSrc = $file.FullName.Substring($srcFolder.Length + 1)
            $destPath = Join-Path $destBase $relativeToSrc
        }
        Sync-Item -Source $file.FullName -Destination $destPath
    }
}

# --- Sync individual doc files to repo backup ---
Write-Host "Syncing documentation files" -ForegroundColor Cyan
foreach ($fileName in $SyncFiles) {
    $srcFile = Join-Path $RepoPath $fileName
    if (Test-Path $srcFile) {
        $destFile = Join-Path $ProtonRepoPath $fileName
        Sync-Item -Source $srcFile -Destination $destFile
    }
}

# --- Sync sensitive/gitignored files to repo backup ---
Write-Host "Syncing sensitive files (gitignored backups)" -ForegroundColor Magenta
$sensitiveCount = 0
foreach ($fileName in $SensitiveFiles) {
    $srcFile = Join-Path $RepoPath $fileName
    if (Test-Path $srcFile) {
        $destFile = Join-Path $ProtonRepoPath $fileName
        Sync-Item -Source $srcFile -Destination $destFile
        $sensitiveCount++
    }
}
if ($sensitiveCount -eq 0) {
    Write-Host "  (no sensitive files found - this is normal on cloud)" -ForegroundColor Gray
}

# --- Sync encrypted database backups to Proton Drive ---
$dbBackupDir = $env:BACKUP_LOCAL_DIR
if (-not $dbBackupDir) { $dbBackupDir = "F:\2026\Backups\dws6-db" }
$protonDbDest = Join-Path $ProtonRoot "Repos2026\dws6-db-backups"

if (Test-Path $dbBackupDir) {
    Write-Host "Syncing encrypted database backups -> $protonDbDest" -ForegroundColor Magenta
    # Only sync encrypted .gpg files, manifests, row counts, and schema SQL
    # NEVER sync unencrypted .dump files to cloud
    Get-ChildItem -Path $dbBackupDir -Recurse -File -ErrorAction SilentlyContinue |
        Where-Object { $_.Extension -in @(".gpg", ".json", ".sql") } |
        ForEach-Object {
            $rel = $_.FullName.Substring($dbBackupDir.Length + 1)
            $dest = Join-Path $protonDbDest $rel
            Sync-Item -Source $_.FullName -Destination $dest
        }
} else {
    Write-Host "  (no database backups found at $dbBackupDir)" -ForegroundColor Gray
}

# --- Full repo backup (when -FullRepo flag is set) ---
if ($FullRepo) {
    Write-Host ""
    if (-not (Test-Path $BackupPath)) {
        Write-Warning "Creating backup folder: $BackupPath"
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null
        }
    }

    Write-Host "Full repo backup -> $BackupPath" -ForegroundColor Cyan
    $allFiles = Get-ChildItem -Path $RepoPath -Recurse -File -ErrorAction SilentlyContinue
    foreach ($file in $allFiles) {
        $relativePath = $file.FullName.Substring($RepoPath.Length + 1)

        # Skip excluded folders
        $skip = $false
        foreach ($exclude in $ExcludeFolders) {
            if ($relativePath -like "$exclude\*" -or $relativePath -like "*\$exclude\*") {
                $skip = $true
                break
            }
        }
        if ($skip) { continue }

        $destPath = Join-Path $BackupPath $relativePath
        Sync-Item -Source $file.FullName -Destination $destPath
    }
}

# --- PDF/HTML Generation (optional) ---
if ($GeneratePDFs) {
    Write-Host ""
    $pdfScript = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "Generate-PDFs.ps1"
    if (Test-Path $pdfScript) {
        $pdfOutputPath = Join-Path $RepoPath "Learn"
        $pdfSplat = @{
            RepoPath   = $RepoPath
            OutputPath = $pdfOutputPath
            Engine     = $PdfEngine
        }
        if ($DryRun) { $pdfSplat["DryRun"] = $true }
        if ($OpenNewPDFs) { $pdfSplat["OpenNew"] = $true }
        & $pdfScript @pdfSplat

        # --- Sync generated HTML/PDF files to Proton Drive ---
        $learnFolder = $pdfOutputPath
        if (Test-Path $learnFolder) {
            $protonLearnDest = Join-Path $ProtonRepoPath "Learn"
            Write-Host ""
            Write-Host "Syncing Learn/ (generated docs) -> $protonLearnDest" -ForegroundColor Cyan
            $learnFiles = Get-ChildItem -Path $learnFolder -Recurse -File
            foreach ($file in $learnFiles) {
                $relativeToLearn = $file.FullName.Substring($learnFolder.Length + 1)
                $destPath = Join-Path $protonLearnDest $relativeToLearn
                Sync-Item -Source $file.FullName -Destination $destPath
            }
        }
    } else {
        Write-Warning "PDF script not found: $pdfScript"
    }
}

# --- Summary ---
Write-Host ""
Write-Host "=== Sync Complete ===" -ForegroundColor Cyan
Write-Host "  Copied:  $syncCount files" -ForegroundColor Green
Write-Host "  Skipped: $skipCount files (unchanged)" -ForegroundColor Gray
if ($errorCount -gt 0) {
    Write-Host "  Errors:  $errorCount files" -ForegroundColor Red
}
Write-Host ""

# Log sync event
if (-not $DryRun -and $syncCount -gt 0) {
    $logFile = Join-Path $ProtonRepoPath "sync-log.txt"
    $logEntry = "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') | Synced $syncCount files from $RepoPath"
    Add-Content -Path $logFile -Value $logEntry
    Write-Host "  Log: $logFile" -ForegroundColor Gray
}
