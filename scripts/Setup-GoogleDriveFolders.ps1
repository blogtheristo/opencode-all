<#
.SYNOPSIS
    Creates the DWS Archive folder structure in Google Drive.

.DESCRIPTION
    Version: 1.0

    Creates folders under "DWS Archive" in Google Drive (risto.paarni2024@lifetime.fi).
    Uses gws (Google Workspace CLI) for automation.
    See docs/google-drive.md for full structure and mapping.

    Prerequisites:
      - gws: npm install -g @googleworkspace/cli
      - Auth: gws auth setup, then gws auth login (use risto.paarni2024@lifetime.fi)

.PARAMETER DryRun
    Show what would be created without creating.

.PARAMETER RootName
    Root folder name. Default: DWS Archive

.EXAMPLE
    .\Setup-GoogleDriveFolders.ps1
    .\Setup-GoogleDriveFolders.ps1 -DryRun

.NOTES
    On Windows, use pwsh (PowerShell 7+) if available: pwsh -File .\Setup-GoogleDriveFolders.ps1
#>

param(
    [switch]$DryRun,
    [string]$RootName = "DWS Archive"
)

$ErrorActionPreference = "Stop"

# Folder structure per docs/google-drive.md
$FolderStructure = @(
    @{ Path = ""; Name = "Weekly-Reports" }
    @{ Path = ""; Name = "Investor-Reports" }
    @{ Path = ""; Name = "Compliance" }
    @{ Path = "Compliance"; Name = "Security" }
    @{ Path = ""; Name = "Thesis" }
    @{ Path = "Thesis"; Name = "Metropolia" }
    @{ Path = "Thesis"; Name = "PHD-Firehorse" }
    @{ Path = ""; Name = "Learn" }
    @{ Path = ""; Name = "Field-Notes" }
    @{ Path = ""; Name = "Architecture" }
    @{ Path = ""; Name = "Admin" }
    @{ Path = ""; Name = "Archive" }
    @{ Path = "Archive"; Name = "dws6-dashboard" }
    @{ Path = "Archive"; Name = "dws6-deployment" }
    @{ Path = "Archive"; Name = "dws6-status" }
    @{ Path = "Archive"; Name = "dws10-hero" }
    @{ Path = "Archive"; Name = "dws10-docs" }
    @{ Path = "Archive"; Name = "dws10-misc" }
    @{ Path = "Archive"; Name = "onelifetime-blog" }
)

function Test-GwsInstalled {
    try {
        $null = Get-Command gws -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

function New-GDriveFolder {
    param(
        [string]$Name,
        [string]$ParentId = $null,
        [switch]$DryRun
    )
    $body = @{
        name = $Name
        mimeType = "application/vnd.google-apps.folder"
    }
    if ($ParentId) {
        $body.parents = @($ParentId)
    }
    $json = $body | ConvertTo-Json -Compress
    if ($DryRun) {
        Write-Host "  [DRY RUN] Would create: $Name" -ForegroundColor Cyan
        return "dry-run-id"
    }
    $result = gws drive files create --json $json 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "gws create failed: $result"
    }
    $obj = $result | ConvertFrom-Json
    return $obj.id
}

function Get-ExistingFolderId {
    param([string]$Name, [string]$ParentId = $null)
    $q = "name='$Name' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if ($ParentId) {
        $q += " and '$ParentId' in parents"
    } else {
        $q += " and 'root' in parents"
    }
    $params = @{ q = $q }
    $paramsJson = $params | ConvertTo-Json -Compress
    $result = gws drive files list --params $paramsJson 2>&1
    if ($LASTEXITCODE -ne 0) { return $null }
    $obj = $result | ConvertFrom-Json
    if ($obj.files -and $obj.files.Count -gt 0) {
        return $obj.files[0].id
    }
    return $null
}

# --- Main ---
Write-Host "Setup-GoogleDriveFolders.ps1 — DWS Archive structure" -ForegroundColor Green
Write-Host "Account: risto.paarni2024@lifetime.fi" -ForegroundColor Gray
Write-Host ""

if (-not (Test-GwsInstalled)) {
    Write-Host "ERROR: gws (Google Workspace CLI) not found." -ForegroundColor Red
    Write-Host "Install: npm install -g @googleworkspace/cli" -ForegroundColor Yellow
    Write-Host "Auth:    gws auth setup, then gws auth login" -ForegroundColor Yellow
    exit 1
}

if ($DryRun) {
    Write-Host "DRY RUN — no folders will be created" -ForegroundColor Cyan
    Write-Host ""
}

# Track created folder IDs: "path" -> id
$folderIds = @{}

# 1. Create or find root
Write-Host "1. Root folder: $RootName" -ForegroundColor White
$rootId = Get-ExistingFolderId -Name $RootName
if ($rootId) {
    Write-Host "   Already exists (id: $rootId)" -ForegroundColor Gray
} elseif (-not $DryRun) {
    $rootId = New-GDriveFolder -Name $RootName -DryRun:$DryRun
    if ($rootId -ne "dry-run-id") {
        Write-Host "   Created (id: $rootId)" -ForegroundColor Green
    }
} else {
    $rootId = "dry-run-id"
}
$folderIds[""] = $rootId

# 2. Create subfolders in order (parents first)
foreach ($item in $FolderStructure) {
    $parentPath = $item.Path
    $name = $item.Name
    $fullPath = if ($parentPath) { "$parentPath/$name" } else { $name }

    $parentId = $folderIds[$parentPath]
    if (-not $parentId -and $parentPath -and $rootId -ne "dry-run-id") {
        Write-Host "   Skipping $fullPath (parent $parentPath not found)" -ForegroundColor Yellow
        continue
    }
    $effectiveParentId = if ($parentPath) { $parentId } else { $rootId }

    Write-Host "   Creating: $fullPath" -ForegroundColor White
    $existing = if ($effectiveParentId -and $effectiveParentId -ne "dry-run-id") {
        Get-ExistingFolderId -Name $name -ParentId $effectiveParentId
    } else { $null }
    if ($existing) {
        Write-Host "     Already exists (id: $existing)" -ForegroundColor Gray
        $folderIds[$fullPath] = $existing
    } else {
        $newId = New-GDriveFolder -Name $name -ParentId $effectiveParentId -DryRun:$DryRun
        $folderIds[$fullPath] = $newId
        if ($newId -ne "dry-run-id") {
            Write-Host "     Created (id: $newId)" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Done. See docs/google-drive.md for usage and NotebookLM integration." -ForegroundColor Gray
