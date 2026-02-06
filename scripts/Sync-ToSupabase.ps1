<#
.SYNOPSIS
    Uploads DWS6 business files to Supabase Storage as EU cloud backup.

.DESCRIPTION
    Uploads Admin/, AgentFoundry/, and other business docs to a private
    Supabase Storage bucket. Runs locally on Windows where Supabase is reachable.

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
    "docs\metropolia"
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

# --- Load credentials from .env if not provided ---
if (-not $SupabaseUrl -or -not $SupabaseKey) {
    $envFile = Join-Path $RepoPath ".env"
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile
        foreach ($line in $envContent) {
            if ($line -match "^SUPABASE_URL=(.+)$") {
                if (-not $SupabaseUrl) { $SupabaseUrl = $Matches[1].Trim() }
            }
            if ($line -match "^SUPABASE_SERVICE_KEY=(.+)$") {
                if (-not $SupabaseKey) { $SupabaseKey = $Matches[1].Trim() }
            }
        }
    }

    # Also check .env.mcp
    $envMcpFile = Join-Path $RepoPath ".env.mcp"
    if (Test-Path $envMcpFile) {
        $envContent = Get-Content $envMcpFile
        foreach ($line in $envContent) {
            if ($line -match "^SUPABASE_URL=(.+)$") {
                if (-not $SupabaseUrl) { $SupabaseUrl = $Matches[1].Trim() }
            }
            if ($line -match "^SUPABASE_SERVICE_KEY=(.+)$") {
                if (-not $SupabaseKey) { $SupabaseKey = $Matches[1].Trim() }
            }
        }
    }
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
            ".py"   { "text/plain" }
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
        $files = Get-ChildItem -Path $srcFolder -Recurse -File
        foreach ($file in $files) {
            $relativePath = $file.FullName.Substring($RepoPath.Length + 1)
            # Use forward slashes for Supabase Storage paths
            $remotePath = $relativePath -replace '\\', '/'
            Upload-File -LocalPath $file.FullName -RemotePath $remotePath
        }
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
