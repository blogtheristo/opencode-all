<#
.SYNOPSIS
    Git Corruption Recovery Script - Non-Destructive Recovery for Windows/OneDrive Conflicts

.DESCRIPTION
    Safely handles corrupted git refs and objects caused by sync tools (OneDrive, Google Drive, Dropbox)
    creating "Name clash" and "Edit conflict" artifacts inside .git\refs and .git\objects directories.
    
    SAFETY GUARANTEES:
    - No history rewriting (no force push, no rebase --root)
    - No object pruning (git gc uses --prune=never)
    - No deletion of refs or objects
    - Quarantine operations are reversible
    
.PARAMETER ArchiveCorruptedRefs
    Create timestamped copies of suspicious ref and object files in Admin/artifacts/git-recovery/
    Does not modify .git/refs or .git/objects directories.

.PARAMETER QuarantineCorruptedRefs
    Move suspicious ref and object files out of .git/refs and .git/objects into quarantine directories.
    This resolves badRefName errors. Requires confirmation unless -NonInteractive is used.

.PARAMETER NonInteractive
    Skip confirmation prompts. Use with -QuarantineCorruptedRefs for automation.

.PARAMETER Verify
    Explicit verify-only mode (default behavior when no action flags provided).
    Scans for issues and runs git fsck but makes no changes.

.EXAMPLE
    .\recover-git-corruption.ps1
    # Verify-only mode: Check for corruption without making changes

.EXAMPLE
    .\recover-git-corruption.ps1 -ArchiveCorruptedRefs
    # Archive suspicious files to Admin/artifacts/git-recovery/<timestamp>/

.EXAMPLE
    .\recover-git-corruption.ps1 -QuarantineCorruptedRefs
    # Move suspicious files to .git/quarantine/ (interactive prompt)

.EXAMPLE
    .\recover-git-corruption.ps1 -ArchiveCorruptedRefs -QuarantineCorruptedRefs -NonInteractive
    # Archive AND quarantine without prompts (for automation)

.NOTES
    Version: 2.0
    Created: January 11, 2026
    Updated: January 11, 2026
    Author: DWS IQ Admin Team
    
    IMPORTANT: Always exclude .git from sync tools!
    - OneDrive: Add .git to exclusion list
    - Google Drive: Use "**/.git/**" in sync settings
    - Dropbox: Add .git to selective sync exclusions
#>

[CmdletBinding(DefaultParameterSetName='Verify')]
param(
    [Parameter(ParameterSetName='Archive')]
    [Parameter(ParameterSetName='QuarantineWithArchive')]
    [switch]$ArchiveCorruptedRefs,
    
    [Parameter(ParameterSetName='Quarantine')]
    [Parameter(ParameterSetName='QuarantineWithArchive')]
    [switch]$QuarantineCorruptedRefs,
    
    [Parameter()]
    [switch]$NonInteractive,
    
    [Parameter(ParameterSetName='Verify')]
    [switch]$Verify
)

# Configuration
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

# Timestamp for this run
$Timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'

# Colors for console output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = 'White'
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success { param([string]$Message) Write-ColorOutput "✓ $Message" -Color Green }
function Write-Warning2 { param([string]$Message) Write-ColorOutput "⚠ $Message" -Color Yellow }
function Write-ErrorMsg { param([string]$Message) Write-ColorOutput "✗ $Message" -Color Red }
function Write-Info { param([string]$Message) Write-ColorOutput "ℹ $Message" -Color Cyan }
function Write-SectionHeader { param([string]$Message) Write-ColorOutput "`n=== $Message ===" -Color Magenta }

# Check if we're in a git repository
function Test-GitRepository {
    if (-not (Test-Path -LiteralPath '.git' -PathType Container)) {
        Write-ErrorMsg "Not in a git repository root directory"
        Write-Info "Please run this script from your dws6 repository directory"
        exit 1
    }
    Write-Success "Running in git repository"
}

# Detect suspicious ref files
function Get-CorruptedRefs {
    Write-SectionHeader "Scanning for Corrupted Refs"
    
    $refsPath = Join-Path -Path (Get-Location) -ChildPath '.git\refs'
    if (-not (Test-Path -LiteralPath $refsPath)) {
        Write-Warning2 "No .git\refs directory found"
        return @()
    }
    
    $suspiciousPatterns = @(
        '*# Name clash*',
        '*# Edit conflict*',
        '*# Desktop conflict*',
        '*(conflicted copy)*'
    )
    
    $corruptedRefs = @()
    # Single scan with filtering for better performance
    Get-ChildItem -LiteralPath $refsPath -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
        $filename = $_.Name
        foreach ($pattern in $suspiciousPatterns) {
            if ($filename -like $pattern) {
                $corruptedRefs += $_
                break  # Found match, no need to check other patterns
            }
        }
        # Also catch any file with parentheses (catch-all)
        if ($filename -match '\(.*\)') {
            $corruptedRefs += $_
        }
    }
    
    # Remove duplicates
    $corruptedRefs = $corruptedRefs | Sort-Object -Property FullName -Unique
    
    if ($corruptedRefs.Count -eq 0) {
        Write-Success "No corrupted ref files detected"
    } else {
        Write-Warning2 "Found $($corruptedRefs.Count) suspicious ref file(s):"
        foreach ($ref in $corruptedRefs) {
            $relativePath = $ref.FullName.Replace((Get-Location).Path, '').TrimStart('\')
            Write-Host "  - $relativePath" -ForegroundColor Yellow
        }
    }
    
    return $corruptedRefs
}

# Detect suspicious object files
function Get-CorruptedObjects {
    Write-SectionHeader "Scanning for Corrupted Objects"
    
    $objectsPath = Join-Path -Path (Get-Location) -ChildPath '.git\objects'
    if (-not (Test-Path -LiteralPath $objectsPath)) {
        Write-Warning2 "No .git\objects directory found"
        return @()
    }
    
    $suspiciousPatterns = @(
        '*# Name clash*',
        '*# Edit conflict*',
        '*# Desktop conflict*',
        '*(conflicted copy)*'
    )
    
    $corruptedObjects = @()
    # Single scan with filtering for better performance
    Get-ChildItem -LiteralPath $objectsPath -Recurse -File -ErrorAction SilentlyContinue | ForEach-Object {
        $filename = $_.Name
        foreach ($pattern in $suspiciousPatterns) {
            if ($filename -like $pattern) {
                $corruptedObjects += $_
                break  # Found match, no need to check other patterns
            }
        }
        # Also catch any file with parentheses (catch-all)
        if ($filename -match '\(.*\)') {
            $corruptedObjects += $_
        }
    }
    
    # Remove duplicates
    $corruptedObjects = $corruptedObjects | Sort-Object -Property FullName -Unique
    
    if ($corruptedObjects.Count -eq 0) {
        Write-Success "No corrupted object files detected"
    } else {
        Write-Warning2 "Found $($corruptedObjects.Count) suspicious object file(s):"
        foreach ($obj in $corruptedObjects) {
            $relativePath = $obj.FullName.Replace((Get-Location).Path, '').TrimStart('\')
            Write-Host "  - $relativePath" -ForegroundColor Yellow
        }
    }
    
    return $corruptedObjects
}

# Run git fsck with readable output
function Invoke-GitFsck {
    param([string]$Stage = "Initial")
    
    Write-SectionHeader "Git Fsck - $Stage"
    
    $fsckOutput = git fsck --full 2>&1 | Out-String
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "git fsck completed successfully"
        Write-Info "Repository integrity: OK"
    } else {
        Write-Warning2 "git fsck reported issues"
    }
    
    # Parse and display errors
    $errors = $fsckOutput -split "`n" | Where-Object { $_ -match 'error:|warning:|fatal:|badRefName|bad sha1' }
    if ($errors) {
        Write-Host "`nFsck Errors/Warnings:" -ForegroundColor Yellow
        foreach ($error in $errors) {
            Write-Host "  $error" -ForegroundColor Yellow
        }
    }
    
    # Check for badRefName specifically
    $badRefNames = $fsckOutput -split "`n" | Where-Object { $_ -match 'badRefName' }
    if ($badRefNames) {
        Write-Warning2 "Detected badRefName errors (corrupted ref files)"
        return $false
    }
    
    # Check for bad sha1 files
    $badSha1Files = $fsckOutput -split "`n" | Where-Object { $_ -match 'bad sha1 file' }
    if ($badSha1Files) {
        Write-Warning2 "Detected bad sha1 file errors (corrupted object files)"
        return $false
    }
    
    return $LASTEXITCODE -eq 0
}

# Archive corrupted refs
function Invoke-ArchiveCorruptedRefs {
    param([array]$CorruptedRefs)
    
    if ($CorruptedRefs.Count -eq 0) {
        Write-Info "No files to archive"
        return
    }
    
    Write-SectionHeader "Archiving Corrupted Refs"
    
    $archivePath = Join-Path -Path (Get-Location) -ChildPath "Admin\artifacts\git-recovery\$Timestamp"
    New-Item -ItemType Directory -Path $archivePath -Force | Out-Null
    Write-Success "Created archive directory: $archivePath"
    
    $archived = 0
    foreach ($ref in $CorruptedRefs) {
        try {
            $relativePath = $ref.FullName.Replace((Join-Path (Get-Location) '.git\refs'), '').TrimStart('\')
            $targetPath = Join-Path -Path $archivePath -ChildPath $relativePath
            $targetDir = Split-Path -LiteralPath $targetPath -Parent
            
            if (-not (Test-Path -LiteralPath $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            
            Copy-Item -LiteralPath $ref.FullName -Destination $targetPath -Force
            Write-Success "Archived: $relativePath"
            $archived++
        } catch {
            Write-ErrorMsg "Failed to archive: $($ref.Name) - $_"
        }
    }
    
    Write-Success "Archived $archived file(s) to: $archivePath"
    
    # Create a manifest file
    $manifestPath = Join-Path -Path $archivePath -ChildPath 'MANIFEST.txt'
    @"
Git Corruption Recovery Archive
Generated: $Timestamp
Total Files: $archived

Archived Files:
$($CorruptedRefs | ForEach-Object { $_.FullName.Replace((Get-Location).Path, '').TrimStart('\') } | Out-String)

Recovery Instructions:
1. These are backup copies only - originals remain in .git\refs
2. To restore: copy files back to their original locations in .git\refs
3. Use -QuarantineCorruptedRefs to move originals out of .git\refs
"@ | Set-Content -LiteralPath $manifestPath -Encoding UTF8
    
    Write-Info "Created manifest: $manifestPath"
}

# Archive corrupted objects
function Invoke-ArchiveCorruptedObjects {
    param([array]$CorruptedObjects)
    
    if ($CorruptedObjects.Count -eq 0) {
        Write-Info "No object files to archive"
        return
    }
    
    Write-SectionHeader "Archiving Corrupted Objects"
    
    $archivePath = Join-Path -Path (Get-Location) -ChildPath "Admin\artifacts\git-recovery\$Timestamp"
    New-Item -ItemType Directory -Path $archivePath -Force | Out-Null
    Write-Success "Archive directory: $archivePath"
    
    $archived = 0
    foreach ($obj in $CorruptedObjects) {
        try {
            $relativePath = $obj.FullName.Replace((Join-Path (Get-Location) '.git\objects'), '').TrimStart('\')
            $targetPath = Join-Path -Path $archivePath -ChildPath "objects\$relativePath"
            $targetDir = Split-Path -LiteralPath $targetPath -Parent
            
            if (-not (Test-Path -LiteralPath $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            
            Copy-Item -LiteralPath $obj.FullName -Destination $targetPath -Force
            Write-Success "Archived: objects\$relativePath"
            $archived++
        } catch {
            Write-ErrorMsg "Failed to archive: $($obj.Name) - $_"
        }
    }
    
    Write-Success "Archived $archived object file(s)"
    
    # Create/update manifest file
    $manifestPath = Join-Path -Path $archivePath -ChildPath 'MANIFEST.txt'
    $existingContent = if (Test-Path -LiteralPath $manifestPath) { Get-Content -LiteralPath $manifestPath -Raw } else { "" }
    
    $objectsManifest = @"

Archived Object Files:
$($CorruptedObjects | ForEach-Object { $_.FullName.Replace((Get-Location).Path, '').TrimStart('\') } | Out-String)

Recovery Instructions for Objects:
1. These are backup copies only - originals remain in .git\objects
2. To restore: copy files back to their original locations in .git\objects
3. Use -QuarantineCorruptedRefs to move originals out of .git\objects
"@
    
    $existingContent + $objectsManifest | Set-Content -LiteralPath $manifestPath -Encoding UTF8
    Write-Info "Updated manifest: $manifestPath"
}

# Quarantine corrupted refs
function Invoke-QuarantineCorruptedRefs {
    param([array]$CorruptedRefs)
    
    if ($CorruptedRefs.Count -eq 0) {
        Write-Info "No files to quarantine"
        return
    }
    
    Write-SectionHeader "Quarantining Corrupted Refs"
    
    # Prompt for confirmation unless non-interactive
    if (-not $NonInteractive) {
        Write-Warning2 "This will MOVE $($CorruptedRefs.Count) file(s) out of .git\refs"
        Write-Info "Files will be moved to: .git\quarantine\refs-name-clash\$Timestamp\"
        Write-Info "This operation is reversible - you can move files back manually"
        Write-Host ""
        $response = Read-Host "Continue? (yes/no)"
        if ($response -notmatch '^y(es)?$') {
            Write-Info "Quarantine cancelled by user"
            return
        }
    }
    
    $quarantinePath = Join-Path -Path (Get-Location) -ChildPath ".git\quarantine\refs-name-clash\$Timestamp"
    New-Item -ItemType Directory -Path $quarantinePath -Force | Out-Null
    Write-Success "Created quarantine directory: $quarantinePath"
    
    $quarantined = 0
    foreach ($ref in $CorruptedRefs) {
        try {
            $relativePath = $ref.FullName.Replace((Join-Path (Get-Location) '.git\refs'), '').TrimStart('\')
            $targetPath = Join-Path -Path $quarantinePath -ChildPath $relativePath
            $targetDir = Split-Path -LiteralPath $targetPath -Parent
            
            if (-not (Test-Path -LiteralPath $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            
            # Check if target exists (idempotency)
            if (Test-Path -LiteralPath $targetPath) {
                $guid = [System.Guid]::NewGuid().ToString().Substring(0,8)
                $targetPath = $targetPath + ".MOVED-$guid"
                Write-Warning2 "Target exists, using collision-free name: $($targetPath.Split('\')[-1])"
            }
            
            Move-Item -LiteralPath $ref.FullName -Destination $targetPath -Force
            Write-Success "Quarantined: $relativePath"
            $quarantined++
        } catch {
            Write-ErrorMsg "Failed to quarantine: $($ref.Name) - $_"
        }
    }
    
    Write-Success "Quarantined $quarantined file(s) to: $quarantinePath"
    
    # Create a restoration script
    $restorePath = Join-Path -Path $quarantinePath -ChildPath 'RESTORE.ps1'
    @"
# Restoration Script
# Created: $Timestamp
# This script restores quarantined refs to their original locations

`$ErrorActionPreference = 'Stop'

Write-Host "Restoring quarantined refs..." -ForegroundColor Yellow

Get-ChildItem -LiteralPath "$quarantinePath" -Recurse -File | Where-Object { `$_.Name -ne 'RESTORE.ps1' } | ForEach-Object {
    `$relativePath = `$_.FullName.Replace('$quarantinePath', '').TrimStart('\')
    `$originalPath = Join-Path -Path (Get-Location) -ChildPath ".git\refs\`$relativePath"
    `$originalDir = Split-Path -LiteralPath `$originalPath -Parent
    
    if (-not (Test-Path -LiteralPath `$originalDir)) {
        New-Item -ItemType Directory -Path `$originalDir -Force | Out-Null
    }
    
    Move-Item -LiteralPath `$_.FullName -Destination `$originalPath -Force
    Write-Host "Restored: `$relativePath" -ForegroundColor Green
}

Write-Host "Restoration complete!" -ForegroundColor Green
"@ | Set-Content -LiteralPath $restorePath -Encoding UTF8
    
    Write-Info "Created restoration script: $restorePath"
}

# Quarantine corrupted objects
function Invoke-QuarantineCorruptedObjects {
    param([array]$CorruptedObjects)
    
    if ($CorruptedObjects.Count -eq 0) {
        Write-Info "No object files to quarantine"
        return
    }
    
    Write-SectionHeader "Quarantining Corrupted Objects"
    
    # Prompt for confirmation unless non-interactive
    if (-not $NonInteractive) {
        Write-Warning2 "This will MOVE $($CorruptedObjects.Count) object file(s) out of .git\objects"
        Write-Info "Files will be moved to: .git\quarantine\objects-name-clash\$Timestamp\"
        Write-Info "This operation is reversible - you can move files back manually"
        Write-Host ""
        $response = Read-Host "Continue? (yes/no)"
        if ($response -notmatch '^y(es)?$') {
            Write-Info "Quarantine cancelled by user"
            return
        }
    }
    
    $quarantinePath = Join-Path -Path (Get-Location) -ChildPath ".git\quarantine\objects-name-clash\$Timestamp"
    New-Item -ItemType Directory -Path $quarantinePath -Force | Out-Null
    Write-Success "Created quarantine directory: $quarantinePath"
    
    $quarantined = 0
    foreach ($obj in $CorruptedObjects) {
        try {
            $relativePath = $obj.FullName.Replace((Join-Path (Get-Location) '.git\objects'), '').TrimStart('\')
            $targetPath = Join-Path -Path $quarantinePath -ChildPath $relativePath
            $targetDir = Split-Path -LiteralPath $targetPath -Parent
            
            if (-not (Test-Path -LiteralPath $targetDir)) {
                New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
            }
            
            # Check if target exists (idempotency)
            if (Test-Path -LiteralPath $targetPath) {
                $guid = [System.Guid]::NewGuid().ToString().Substring(0,8)
                $targetPath = $targetPath + ".MOVED-$guid"
                Write-Warning2 "Target exists, using collision-free name: $($targetPath.Split('\')[-1])"
            }
            
            Move-Item -LiteralPath $obj.FullName -Destination $targetPath -Force
            Write-Success "Quarantined: objects\$relativePath"
            $quarantined++
        } catch {
            Write-ErrorMsg "Failed to quarantine: $($obj.Name) - $_"
        }
    }
    
    Write-Success "Quarantined $quarantined object file(s) to: $quarantinePath"
    
    # Create a restoration script
    $restorePath = Join-Path -Path $quarantinePath -ChildPath 'RESTORE.ps1'
    @"
# Restoration Script for Objects
# Created: $Timestamp
# This script restores quarantined objects to their original locations

`$ErrorActionPreference = 'Stop'

Write-Host "Restoring quarantined objects..." -ForegroundColor Yellow

Get-ChildItem -LiteralPath "$quarantinePath" -Recurse -File | Where-Object { `$_.Name -ne 'RESTORE.ps1' } | ForEach-Object {
    `$relativePath = `$_.FullName.Replace('$quarantinePath', '').TrimStart('\')
    `$originalPath = Join-Path -Path (Get-Location) -ChildPath ".git\objects\`$relativePath"
    `$originalDir = Split-Path -LiteralPath `$originalPath -Parent
    
    if (-not (Test-Path -LiteralPath `$originalDir)) {
        New-Item -ItemType Directory -Path `$originalDir -Force | Out-Null
    }
    
    Move-Item -LiteralPath `$_.FullName -Destination `$originalPath -Force
    Write-Host "Restored: `$relativePath" -ForegroundColor Green
}

Write-Host "Object restoration complete!" -ForegroundColor Green
"@ | Set-Content -LiteralPath $restorePath -Encoding UTF8
    
    Write-Info "Created restoration script: $restorePath"
}

# Run git gc with safe settings
function Invoke-SafeGitGC {
    Write-SectionHeader "Git Maintenance (Safe Mode)"
    
    Write-Info "Running git gc with --prune=never (no object deletion)"
    try {
        $output = git gc --prune=never 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Write-Success "git gc completed successfully"
        } else {
            Write-Warning2 "git gc reported warnings"
            Write-Host $output
        }
    } catch {
        Write-Warning2 "git gc failed: $_"
    }
}

# Main execution
function Main {
    Write-ColorOutput "`n╔════════════════════════════════════════════════════════════════╗" -Color Cyan
    Write-ColorOutput "║   Git Corruption Recovery Script v2.0                         ║" -Color Cyan
    Write-ColorOutput "║   Non-Destructive Recovery for Windows/OneDrive Conflicts     ║" -Color Cyan
    Write-ColorOutput "╚════════════════════════════════════════════════════════════════╝`n" -Color Cyan
    
    # Check environment
    Test-GitRepository
    
    # Determine operation mode
    $isVerifyOnly = (-not $ArchiveCorruptedRefs) -and (-not $QuarantineCorruptedRefs)
    
    if ($isVerifyOnly) {
        Write-Info "Running in VERIFY-ONLY mode (no changes will be made)"
        Write-Info "Use -ArchiveCorruptedRefs or -QuarantineCorruptedRefs to take action"
    } else {
        $operations = @()
        if ($ArchiveCorruptedRefs) { $operations += "Archive" }
        if ($QuarantineCorruptedRefs) { $operations += "Quarantine" }
        Write-Info "Operation mode: $($operations -join ' + ')"
    }
    
    # Pre-check fsck
    $preCheckOK = Invoke-GitFsck -Stage "Pre-Check"
    
    # Scan for corrupted refs and objects
    $corruptedRefs = Get-CorruptedRefs
    $corruptedObjects = Get-CorruptedObjects
    
    $totalCorrupted = $corruptedRefs.Count + $corruptedObjects.Count
    
    if ($totalCorrupted -eq 0) {
        Write-Success "`nNo corrupted refs or objects found - repository appears healthy"
        
        if (-not $preCheckOK) {
            Write-Warning2 "However, git fsck reported errors - manual investigation needed"
            Write-Info "Check git fsck output above for details"
        }
        
        Write-Info "`nTo prevent future corruption, ensure .git is excluded from sync tools:"
        Write-Info "  - OneDrive: Settings → Sync and backup → Manage backup → Exclude .git"
        Write-Info "  - Google Drive: Use selective sync, exclude **/.git/**"
        Write-Info "  - Dropbox: Preferences → Sync → Selective Sync → Exclude .git"
        
        exit 0
    }
    
    # Perform requested operations
    if ($ArchiveCorruptedRefs) {
        if ($corruptedRefs.Count -gt 0) {
            Invoke-ArchiveCorruptedRefs -CorruptedRefs $corruptedRefs
        }
        if ($corruptedObjects.Count -gt 0) {
            Invoke-ArchiveCorruptedObjects -CorruptedObjects $corruptedObjects
        }
    }
    
    if ($QuarantineCorruptedRefs) {
        if ($corruptedRefs.Count -gt 0) {
            Invoke-QuarantineCorruptedRefs -CorruptedRefs $corruptedRefs
        }
        if ($corruptedObjects.Count -gt 0) {
            Invoke-QuarantineCorruptedObjects -CorruptedObjects $corruptedObjects
        }
        
        # Post-check fsck after quarantine
        Write-Host ""
        $postCheckOK = Invoke-GitFsck -Stage "Post-Quarantine"
        
        if ($postCheckOK) {
            Write-Success "`nQuarantine successful! Repository errors resolved"
        } else {
            Write-Warning2 "`nSome issues remain after quarantine - manual investigation needed"
        }
    }
    
    # Safe maintenance
    if (-not $isVerifyOnly) {
        Invoke-SafeGitGC
    }
    
    # Summary
    Write-SectionHeader "Summary"
    Write-Success "Operation completed successfully"
    
    if ($isVerifyOnly) {
        Write-Info "No changes were made (verify-only mode)"
        Write-Info "To fix issues, run with -ArchiveCorruptedRefs and/or -QuarantineCorruptedRefs"
    } else {
        if ($ArchiveCorruptedRefs) {
            Write-Info "✓ Archived $($corruptedRefs.Count) ref file(s) and $($corruptedObjects.Count) object file(s) to Admin/artifacts/git-recovery/$Timestamp"
        }
        if ($QuarantineCorruptedRefs) {
            Write-Info "✓ Quarantined $($corruptedRefs.Count) ref file(s) to .git/quarantine/refs-name-clash/$Timestamp"
            if ($corruptedObjects.Count -gt 0) {
                Write-Info "✓ Quarantined $($corruptedObjects.Count) object file(s) to .git/quarantine/objects-name-clash/$Timestamp"
            }
            Write-Info "  To restore refs: Run .git/quarantine/refs-name-clash/$Timestamp/RESTORE.ps1"
            if ($corruptedObjects.Count -gt 0) {
                Write-Info "  To restore objects: Run .git/quarantine/objects-name-clash/$Timestamp/RESTORE.ps1"
            }
        }
    }
    
    Write-Info "`nFor more information, see: GIT_CORRUPTION_RECOVERY.md"
}

# Execute main function
try {
    Main
} catch {
    Write-ErrorMsg "`nScript failed with error:"
    Write-ErrorMsg $_.Exception.Message
    Write-ErrorMsg "`nStack trace:"
    Write-ErrorMsg $_.ScriptStackTrace
    exit 1
}
