#requires -Version 7.0
<#
.SYNOPSIS
    Restore .env.mcp from backup or template if file is missing.

.DESCRIPTION
    Automatically detects if .env.mcp is missing and restores it from:
    1. Latest backup in Admin/.env-backups/
    2. env.mcp.example template (fallback)

.PARAMETER Auto
    Skip confirmation prompts and restore automatically.

.EXAMPLE
    pwsh -File .\scripts\Restore-EnvMcp.ps1

.EXAMPLE
    pwsh -File .\scripts\Restore-EnvMcp.ps1 -Auto
#>
param(
    [switch]$Auto
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
$envMcpPath = Join-Path -Path $projectRoot -ChildPath ".env.mcp"
$backupDir = Join-Path -Path $projectRoot -ChildPath "Admin/.env-backups"
$examplePath = Join-Path -Path $projectRoot -ChildPath "env.mcp.example"

Write-Host "=== .env.mcp Protection Check ===" -ForegroundColor Cyan
Write-Host ""

# Check if .env.mcp exists
if (Test-Path -Path $envMcpPath) {
    $fileSize = (Get-Item -Path $envMcpPath).Length
    $lastWrite = (Get-Item -Path $envMcpPath).LastWriteTime
    Write-Host "✓ .env.mcp EXISTS" -ForegroundColor Green
    Write-Host "  Size: $fileSize bytes"
    Write-Host "  Last modified: $lastWrite"
    Write-Host ""
    exit 0
}

Write-Host "⚠️  .env.mcp NOT FOUND!" -ForegroundColor Red
Write-Host "  Path: $envMcpPath"
Write-Host ""

# Try to restore from backups
if (Test-Path -Path $backupDir) {
    $backups = @(Get-ChildItem -Path $backupDir -Filter ".env.mcp.backup-*" -ErrorAction SilentlyContinue | 
        Sort-Object -Property LastWriteTime -Descending)
    
    if ($backups.Length -gt 0) {
        $latestBackup = $backups[0]
        Write-Host "Found $($backups.Length) backup(s)" -ForegroundColor Yellow
        Write-Host "  Latest: $($latestBackup.Name)" -ForegroundColor Cyan
        Write-Host "  Date: $($latestBackup.LastWriteTime)" -ForegroundColor DarkGray
        Write-Host ""
        
        $restoreFromBackupResponse = Read-Host "Restore from backup? (Y/n)"
        if ($Auto -or $restoreFromBackupResponse -eq "" -or $restoreFromBackupResponse -eq "Y" -or $restoreFromBackupResponse -eq "y") {
            try {
                Copy-Item -Path $latestBackup.FullName -Destination $envMcpPath -Force
                Write-Host "✓ Successfully restored from backup!" -ForegroundColor Green
                Write-Host "  File: $envMcpPath" -ForegroundColor DarkGray
                Write-Host ""
                exit 0
            }
            catch {
                Write-Host "❌ Failed to restore from backup: $_" -ForegroundColor Red
                Write-Host ""
            }
        }
    }
    else {
        Write-Host "No backups found in $backupDir" -ForegroundColor Yellow
    }
}
else {
    Write-Host "Backup directory not found: $backupDir" -ForegroundColor Yellow
}

Write-Host ""

# Fallback: restore from env.mcp.example
if (Test-Path -Path $examplePath) {
    Write-Host "Fallback: Restoring from env.mcp.example" -ForegroundColor Yellow
    Write-Host ""
    
    if ($Auto -or (Read-Host "Restore from template? (Y/n)") -ne "n") {
        try {
            Copy-Item -Path $examplePath -Destination $envMcpPath -Force
            Write-Host "✓ Restored from template" -ForegroundColor Green
            Write-Host "  ⚠️  IMPORTANT: You need to re-fill your API keys!" -ForegroundColor Yellow
            Write-Host "  Follow the checklist: .ENV_CHECKLIST.md" -ForegroundColor DarkGray
            Write-Host ""
            exit 0
        }
        catch {
            Write-Host "❌ Failed to restore from template: $_" -ForegroundColor Red
        }
    }
}
else {
    Write-Host "Template not found: $examplePath" -ForegroundColor Red
}

Write-Host ""
Write-Host "❌ Cannot restore .env.mcp - no backup or template available" -ForegroundColor Red
Write-Host ""
Write-Host "Manual recovery:" -ForegroundColor Yellow
Write-Host "1. Copy env.mcp.example to .env.mcp manually"
Write-Host "2. Edit .env.mcp with your API keys"
Write-Host "3. Check .ENV_CHECKLIST.md for what to fill"
Write-Host ""

exit 1
