# =============================================================================
# LIFETIME WORLD - Sync Local Checkpoints to GCP
# =============================================================================
# Syncs trained model checkpoints from local GN-100 cluster to Google Cloud
# for burst training or production deployment
#
# Usage:
#   .\sync-to-gcp.ps1 -CheckpointPath C:\data\llm\checkpoints\latest
#   .\sync-to-gcp.ps1 -CheckpointPath C:\data\llm\checkpoints\latest -BucketName my-bucket
# =============================================================================

param(
    [Parameter(Mandatory=$true)]
    [string]$CheckpointPath,
    
    [string]$BucketName = "lifetime-llm-checkpoints",
    
    [string]$DestinationPrefix = "checkpoints",
    
    [switch]$DryRun,
    
    [switch]$Parallel
)

$ErrorActionPreference = "Stop"

# Validate gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Error "gcloud CLI is not installed. Install from https://cloud.google.com/sdk"
    exit 1
}

# Validate checkpoint path exists
if (-not (Test-Path $CheckpointPath)) {
    Write-Error "Checkpoint path does not exist: $CheckpointPath"
    exit 1
}

# Get checkpoint directory name
$checkpointName = Split-Path $CheckpointPath -Leaf
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$destinationPath = "gs://$BucketName/$DestinationPrefix/$checkpointName-$timestamp"

Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "LIFETIME WORLD - GCP Checkpoint Sync" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host ""
Write-Host "Source:      $CheckpointPath" -ForegroundColor Yellow
Write-Host "Destination: $destinationPath" -ForegroundColor Yellow
Write-Host ""

# Calculate size
$size = (Get-ChildItem $CheckpointPath -Recurse | Measure-Object -Property Length -Sum).Sum
$sizeGB = [math]::Round($size / 1GB, 2)
Write-Host "Total Size: $sizeGB GB" -ForegroundColor Green
Write-Host ""

# Estimate transfer time (assuming 100 Mbps = 12.5 MB/s)
$estimatedMinutes = [math]::Round($size / (12.5 * 1024 * 1024) / 60, 1)
Write-Host "Estimated Transfer Time: ~$estimatedMinutes minutes (at 100 Mbps)" -ForegroundColor Cyan
Write-Host ""

if ($DryRun) {
    Write-Host "[DRY RUN] Would sync to: $destinationPath" -ForegroundColor Magenta
    exit 0
}

# Confirm
$confirm = Read-Host "Proceed with upload? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Upload cancelled."
    exit 0
}

# Sync using gcloud storage (gsutil is deprecated; removed from the default gcloud CLI after March 2027)
Write-Host ""
Write-Host "Starting upload..." -ForegroundColor Green

# gcloud storage parallelizes transfers by default, so the old "gsutil -m" flag is no longer needed.
$gcloudArgs = @("storage", "cp", "-r", $CheckpointPath, $destinationPath)

if ($Parallel) {
    # Use parallel composite uploads for large files (default threshold is 150 MiB).
    $gcloudArgs = @("storage", "cp", "--parallel-composite-upload-threshold=150M", "-r", $CheckpointPath, $destinationPath)
}

$startTime = Get-Date

try {
    gcloud @gcloudArgs
    
    $endTime = Get-Date
    $duration = $endTime - $startTime
    
    Write-Host ""
    Write-Host "=" * 60 -ForegroundColor Green
    Write-Host "Upload Complete!" -ForegroundColor Green
    Write-Host "=" * 60 -ForegroundColor Green
    Write-Host "Duration: $($duration.TotalMinutes.ToString('0.0')) minutes" -ForegroundColor Cyan
    Write-Host "Location: $destinationPath" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To use in GCP training:" -ForegroundColor White
    Write-Host "  export CHECKPOINT_PATH=$destinationPath" -ForegroundColor Gray
}
catch {
    Write-Error "Upload failed: $_"
    exit 1
}
