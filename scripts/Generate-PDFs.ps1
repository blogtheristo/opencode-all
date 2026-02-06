<#
.SYNOPSIS
    Generates PDF versions of key Admin Manual, sales, and investor files.

.DESCRIPTION
    Uses pandoc to convert markdown files to PDF. Outputs to Proton Drive
    generated-pdfs/ folder (or local generated-pdfs/ if Proton unavailable).

    Requires:
      - pandoc (winget install JohnMacFarlane.Pandoc)
      - A LaTeX engine (MiKTeX recommended: winget install MiKTeX.MiKTeX)

    Called automatically by Sync-ToProton.ps1 when -GeneratePDFs flag is set,
    or run standalone.

.PARAMETER RepoPath
    Path to the git repo. Default: auto-detect from script location.

.PARAMETER OutputPath
    Where to write PDFs. Default: F:\Proton\Proton\My files\2026\generated-pdfs

.PARAMETER DryRun
    Show what would be generated without generating.

.EXAMPLE
    .\Generate-PDFs.ps1
    .\Generate-PDFs.ps1 -DryRun
    .\Generate-PDFs.ps1 -OutputPath "C:\temp\pdfs"
#>

param(
    [string]$RepoPath = "",
    [string]$OutputPath = "F:\Proton\Proton\My files\2026\generated-pdfs",
    [switch]$DryRun
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

# --- Check pandoc is installed ---
$pandocPath = Get-Command pandoc -ErrorAction SilentlyContinue
if (-not $pandocPath) {
    Write-Error "pandoc not found. Install with: winget install JohnMacFarlane.Pandoc"
    Write-Host "  Alternative: choco install pandoc" -ForegroundColor Gray
    Write-Host "  Alternative: scoop install pandoc" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "=== DWS6 PDF Generator (pandoc) ===" -ForegroundColor Cyan
Write-Host "  pandoc:  $($pandocPath.Source)"
Write-Host "  Repo:    $RepoPath"
Write-Host "  Output:  $OutputPath"
if ($DryRun) { Write-Host "  MODE:    DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# --- Files to convert ---
# Each entry: relative path from repo root -> output PDF name
$FilesToConvert = @(
    # Admin Manuals
    @{ Src = "Admin\ADMIN_MANUAL.md";                          Name = "ADMIN_MANUAL.pdf" }
    @{ Src = "Admin\ADMIN_MANUAL_AUTHENTICATION.md";           Name = "ADMIN_MANUAL_AUTHENTICATION.pdf" }
    @{ Src = "Admin\ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md";     Name = "ADMIN_MANUAL_DWS10_STORE_PAYMENTS.pdf" }
    @{ Src = "Admin\ADMIN_MANUAL_DWS6_COM.md";                 Name = "ADMIN_MANUAL_DWS6_COM.pdf" }
    @{ Src = "Admin\ADMIN_MANUAL_SUPABASE_EN_v1.md";           Name = "ADMIN_MANUAL_SUPABASE_EN_v1.pdf" }
    @{ Src = "Admin\ADMIN_MANUAL_TESTING.md";                   Name = "ADMIN_MANUAL_TESTING.pdf" }
    @{ Src = "Admin\ADMIN_MANUAL_GAPS_ANALYSIS.md";            Name = "ADMIN_MANUAL_GAPS_ANALYSIS.pdf" }
    @{ Src = "Admin\ADMIN_MANUAL_FILES_AND_FOLDERS.md";        Name = "ADMIN_MANUAL_FILES_AND_FOLDERS.pdf" }
    @{ Src = "Admin\Security\ADMIN_MANUAL_SECURITY_TESTING.md"; Name = "ADMIN_MANUAL_SECURITY_TESTING.pdf" }
    @{ Src = "Admin\Security\ADMIN_MANUAL_SECURITY_MONITORING.md"; Name = "ADMIN_MANUAL_SECURITY_MONITORING.pdf" }
    @{ Src = "Admin\SECURITY_COMPLIANCE.md";                     Name = "SECURITY_COMPLIANCE.pdf" }

    # Sales & Marketing
    @{ Src = "sales-outreach\enterprise-sales.md";              Name = "enterprise-sales.pdf" }
    @{ Src = "sales-outreach\SALES_AI_AGENT_DESIGN_FI_v1.md";  Name = "SALES_AI_AGENT_DESIGN_FI_v1.pdf" }

    # Investor Materials
    @{ Src = "investor-outreach\V3-DWS-IQ6-InvestorPD_2026.md"; Name = "V3-DWS-IQ6-InvestorPD_2026.pdf" }
    @{ Src = "investor-outreach\investor-pitch-deck.md";         Name = "investor-pitch-deck.pdf" }
    @{ Src = "investor-outreach\INVESTOR_MEMO.md";               Name = "INVESTOR_MEMO.pdf" }
)

# --- Create output directory ---
if (-not (Test-Path $OutputPath)) {
    if ($DryRun) {
        Write-Host "  [MKDIR] $OutputPath" -ForegroundColor Cyan
    } else {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
        Write-Host "  [MKDIR] $OutputPath" -ForegroundColor Cyan
    }
}

# --- Generate PDFs ---
$successCount = 0
$skipCount = 0
$errorCount = 0

foreach ($file in $FilesToConvert) {
    $srcFile = Join-Path $RepoPath $file.Src
    $destFile = Join-Path $OutputPath $file.Name

    if (-not (Test-Path $srcFile)) {
        $skipCount++
        continue
    }

    # Skip if PDF is newer than source
    if (Test-Path $destFile) {
        $srcTime = (Get-Item $srcFile).LastWriteTime
        $dstTime = (Get-Item $destFile).LastWriteTime
        if ($dstTime -gt $srcTime) {
            $skipCount++
            continue
        }
    }

    if ($DryRun) {
        Write-Host "  [PDF] $($file.Src) -> $($file.Name)" -ForegroundColor Yellow
        $successCount++
        continue
    }

    Write-Host "  [PDF] $($file.Src)..." -ForegroundColor Cyan -NoNewline
    try {
        $pandocArgs = @(
            "`"$srcFile`""
            "-o", "`"$destFile`""
            "-V", "geometry:margin=1in"
            "-V", "fontsize=11pt"
            "-V", "colorlinks=true"
            "-V", "linkcolor=blue"
            "--toc"
            "--toc-depth=2"
            "--highlight-style=tango"
            "-f", "markdown+smart+emoji"
        )

        $process = Start-Process -FilePath "pandoc" -ArgumentList $pandocArgs -NoNewWindow -Wait -PassThru -RedirectStandardError "$env:TEMP\pandoc-err.txt"

        if ($process.ExitCode -eq 0) {
            $size = [math]::Round((Get-Item $destFile).Length / 1KB)
            Write-Host " OK (${size}KB)" -ForegroundColor Green
            $successCount++
        } else {
            $err = Get-Content "$env:TEMP\pandoc-err.txt" -Raw -ErrorAction SilentlyContinue
            Write-Host " FAILED" -ForegroundColor Red
            if ($err) { Write-Host "    $err" -ForegroundColor Red }
            $errorCount++
        }
    } catch {
        Write-Host " ERROR: $_" -ForegroundColor Red
        $errorCount++
    }
}

# --- Summary ---
Write-Host ""
Write-Host "=== PDF Generation Complete ===" -ForegroundColor Cyan
Write-Host "  Generated: $successCount files" -ForegroundColor Green
Write-Host "  Skipped:   $skipCount files (unchanged or missing)" -ForegroundColor Gray
if ($errorCount -gt 0) {
    Write-Host "  Errors:    $errorCount files" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Troubleshooting:" -ForegroundColor Yellow
    Write-Host "    - Is MiKTeX installed? winget install MiKTeX.MiKTeX" -ForegroundColor Yellow
    Write-Host "    - Or use wkhtmltopdf engine: pandoc --pdf-engine=wkhtmltopdf" -ForegroundColor Yellow
}
Write-Host "  Output:    $OutputPath" -ForegroundColor Cyan
Write-Host ""
