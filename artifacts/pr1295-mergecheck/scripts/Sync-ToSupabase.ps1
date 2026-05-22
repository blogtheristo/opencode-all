<#
.SYNOPSIS
    Uploads DWS6 business files to Supabase Storage as EU cloud backup.

.DESCRIPTION
    Version: 1.5

    CHANGE LOG:
      v1.0 - 05.02.2026 - Initial: Supabase Storage upload, bucket management
      v1.1 - 07.02.2026 - Documented versioning
      v1.2 - 07.02.2026 - Added scripts/, src/, Firehorse/ to backup folders
      v1.3 - 07.02.2026 - Added docs/, .github/, .workflows/, root-level standards (CLAUDE.md etc.)
      v1.4 - 07.02.2026 - Exclude node_modules/, dist/, build/, __pycache__, .git/ from sync
      v1.5 - 07.02.2026 - Robust .env reading: strip quotes, accept SERVICE_ROLE_KEY, check env.mcp

    Uploads Admin/, scripts/, src/, docs/, and business files to a private
    Supabase Storage bucket as EU cloud backup. Runs locally on Windows.

    Requires: SUPABASE_URL and SUPABASE_SERVICE_KEY in .env or as parameters.

.PARAMETER BucketName
    Supabase Storage bucket name. Default: admin-vault

.PARAMETER DryRun
    Show what would be uploaded without uploading.

.EXAMPLE
    .\Sync-ToSupabase.ps1
    .\Sync-ToSupabase.ps1 -DryRun
    .\Sync-ToSupabase.ps1 -BucketName "my-backup"
#>

param(
    [string]$RepoPath = "",
    [string]$BucketName = "admin-vault",
    [string]$SupabaseUrl = "",
    [string]$SupabaseKey = "",
    [switch]$DryRun,
    [switch]$CreateBucket
)

# --- Configuration ---
$SyncFolders = @(
    "Admin",
    "AgentFoundry",
    "Team",
    "scripts",
    "src",
    "Firehorse",
    "docs",
    "sales-outreach",
    "investor-outreach",
    ".github",
    ".workflows"
)

# Root-level files to sync (standards, environment rules)
$SyncFiles = @(
    "CLAUDE.md",
    "DWS_DOCUMENT_STANDARD.md",
    "VERSION_AND_AGENT_HISTORY_TEMPLATE.md",
    "ONTOLOGY.md",
    "README.md",
    "16-INDUSTRIES.md"
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

# --- Load credentials from .env / .env.mcp ---
function Read-EnvFile {
    param([string]$FilePath)
    if (-not (Test-Path $FilePath)) { return }
    Write-Host "  Reading: $FilePath" -ForegroundColor Gray
    $content = Get-Content $FilePath
    foreach ($line in $content) {
        $trimmed = $line.Trim()
        if ($trimmed -match "^SUPABASE_URL=(.+)$") {
            if (-not $script:SupabaseUrl) {
                $script:SupabaseUrl = $Matches[1].Trim().Trim('"').Trim("'")
                Write-Host "    Found SUPABASE_URL" -ForegroundColor Gray
            }
        }
        # Accept SUPABASE_SERVICE_KEY or SUPABASE_SERVICE_ROLE_KEY
        if ($trimmed -match "^SUPABASE_SERVICE_(?:ROLE_)?KEY=(.+)$") {
            if (-not $script:SupabaseKey) {
                $script:SupabaseKey = $Matches[1].Trim().Trim('"').Trim("'")
                Write-Host "    Found SUPABASE_SERVICE_KEY" -ForegroundColor Gray
            }
        }
    }
}

if (-not $SupabaseUrl -or -not $SupabaseKey) {
    Read-EnvFile (Join-Path $RepoPath ".env")
    Read-EnvFile (Join-Path $RepoPath ".env.mcp")
    Read-EnvFile (Join-Path $RepoPath "env.mcp")
}

# --- Validation ---
if (-not $SupabaseUrl -or -not $SupabaseKey) {
    Write-Error "Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env or pass as parameters."
    exit 1
}

if (-not (Test-Path $RepoPath)) {
    Write-Error "Repo path not found: $RepoPath"
    exit 1
}

Write-Host ""
Write-Host "=== DWS6 Supabase Storage Sync ===" -ForegroundColor Cyan
Write-Host "  Repo:    $RepoPath"
Write-Host "  Bucket:  $BucketName"
Write-Host "  URL:     $SupabaseUrl"
if ($DryRun) { Write-Host "  MODE:    DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# --- Create bucket if needed ---
if ($CreateBucket) {
    Write-Host "Creating bucket '$BucketName'..." -ForegroundColor Cyan
    if (-not $DryRun) {
        $body = @{
            id = $BucketName
            name = $BucketName
            public = $false
        } | ConvertTo-Json

        try {
            $response = Invoke-RestMethod -Uri "$SupabaseUrl/storage/v1/bucket" `
                -Method POST `
                -Headers @{
                    "Authorization" = "Bearer $SupabaseKey"
                    "apikey" = $SupabaseKey
                    "Content-Type" = "application/json"
                } `
                -Body $body
            Write-Host "  Bucket created: $BucketName" -ForegroundColor Green
        } catch {
            if ($_.Exception.Response.StatusCode -eq 409) {
                Write-Host "  Bucket already exists" -ForegroundColor Gray
            } else {
                Write-Warning "  Failed to create bucket: $_"
            }
        }
    }
}

# --- Upload logic ---
$uploadCount = 0
$skipCount = 0
$errorCount = 0

function Upload-File {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )

    if ($DryRun) {
        Write-Host "  [UPLOAD] $RemotePath" -ForegroundColor Yellow
        $script:uploadCount++
        return
    }

    try {
        $fileBytes = [System.IO.File]::ReadAllBytes($LocalPath)
        $extension = [System.IO.Path]::GetExtension($LocalPath).ToLower()
        $contentType = switch ($extension) {
            ".md"   { "text/markdown" }
            ".txt"  { "text/plain" }
            ".json" { "application/json" }
            ".ps1"  { "text/plain" }
            ".sh"   { "text/plain" }
            ".bat"  { "text/plain" }
            ".py"   { "text/plain" }
            ".ts"   { "text/typescript" }
            ".tsx"  { "text/typescript" }
            ".js"   { "text/javascript" }
            ".jsx"  { "text/javascript" }
            ".css"  { "text/css" }
            ".html" { "text/html" }
            ".yaml" { "text/yaml" }
            ".yml"  { "text/yaml" }
            ".xml"  { "application/xml" }
            ".xlsx" { "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
            default { "application/octet-stream" }
        }

        $uri = "$SupabaseUrl/storage/v1/object/$BucketName/$RemotePath"
        $response = Invoke-RestMethod -Uri $uri `
            -Method POST `
            -Headers @{
                "Authorization" = "Bearer $SupabaseKey"
                "apikey" = $SupabaseKey
                "Content-Type" = $contentType
                "x-upsert" = "true"
            } `
            -Body $fileBytes

        Write-Host "  [OK] $RemotePath" -ForegroundColor Green
        $script:uploadCount++
    } catch {
        Write-Host "  [ERROR] $RemotePath : $_" -ForegroundColor Red
        $script:errorCount++
    }
}

# --- Sync folders ---
foreach ($folder in $SyncFolders) {
    $srcFolder = Join-Path $RepoPath $folder
    if (Test-Path $srcFolder) {
        Write-Host "Uploading $folder/" -ForegroundColor Cyan
        $files = Get-ChildItem -Path $srcFolder -Recurse -File |
            Where-Object { $_.FullName -notmatch '[\\/]node_modules[\\/]' -and
                           $_.FullName -notmatch '[\\/]\.git[\\/]' -and
                           $_.FullName -notmatch '[\\/]dist[\\/]' -and
                           $_.FullName -notmatch '[\\/]build[\\/]' -and
                           $_.FullName -notmatch '[\\/]__pycache__[\\/]' }
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring($RepoPath.Length + 1)
            # Use forward slashes for Supabase Storage paths
            $remotePath = $relativePath -replace '\\', '/'
            Upload-File -LocalPath $file.FullName -RemotePath $remotePath
        }
    }
}

# --- Sync individual root-level files ---
Write-Host "Uploading root-level standards" -ForegroundColor Cyan
foreach ($fileName in $SyncFiles) {
    $srcFile = Join-Path $RepoPath $fileName
    if (Test-Path $srcFile) {
        $remotePath = $fileName -replace '\\', '/'
        Upload-File -LocalPath $srcFile -RemotePath $remotePath
    }
}

# --- Summary ---
Write-Host ""
Write-Host "=== Upload Complete ===" -ForegroundColor Cyan
Write-Host "  Uploaded: $uploadCount files" -ForegroundColor Green
Write-Host "  Errors:   $errorCount files" -ForegroundColor $(if ($errorCount -gt 0) { "Red" } else { "Gray" })
Write-Host ""

if (-not $DryRun -and $uploadCount -gt 0) {
    Write-Host "  View files: $SupabaseUrl -> Storage -> $BucketName" -ForegroundColor Gray
}
