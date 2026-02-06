<#
.SYNOPSIS
    Generates PDF versions of key Admin Manual, sales, and investor files.

.DESCRIPTION
    Uses pandoc to convert markdown files to PDF. Outputs to Proton Drive
    generated-pdfs/ folder (or local generated-pdfs/ if Proton unavailable).

    Requires:
      - pandoc (winget install JohnMacFarlane.Pandoc)
      - wkhtmltopdf (winget install wkhtmltopdf) - no LaTeX needed

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
    [switch]$DryRun,
    [switch]$OpenNew
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

# --- Check wkhtmltopdf ---
$wkPath = Get-Command wkhtmltopdf -ErrorAction SilentlyContinue
if (-not $wkPath) {
    Write-Warning "wkhtmltopdf not found. Install with: winget install wkhtmltopdf"
    Write-Warning "PDF generation will fail without it."
}

# --- Create inline CSS for PDF styling ---
$cssFile = Join-Path $env:TEMP "dws6-pdf-style.css"
@"
body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 1in; }
h1 { color: #0a1628; border-bottom: 2px solid #0066cc; padding-bottom: 8px; }
h2 { color: #0a1628; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
h3 { color: #333; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 10pt; }
pre { background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background: #0a1628; color: white; }
a { color: #0066cc; }
"@ | Set-Content -Path $cssFile -Encoding UTF8

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
$newPDFs = @()

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
            "--pdf-engine=wkhtmltopdf"
            "--toc"
            "--toc-depth=2"
            "-f", "markdown-yaml_metadata_block+smart"
            "--css", "`"$cssFile`""
        )

        $process = Start-Process -FilePath "pandoc" -ArgumentList $pandocArgs -NoNewWindow -Wait -PassThru -RedirectStandardError "$env:TEMP\pandoc-err.txt"

        if ($process.ExitCode -eq 0) {
            $size = [math]::Round((Get-Item $destFile).Length / 1KB)
            Write-Host " OK (${size}KB)" -ForegroundColor Green
            $successCount++
            $newPDFs += $destFile
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
    Write-Host "    - Is wkhtmltopdf installed? winget install wkhtmltopdf" -ForegroundColor Yellow
    Write-Host "    - Is pandoc installed? winget install JohnMacFarlane.Pandoc" -ForegroundColor Yellow
}
Write-Host "  Output:    $OutputPath" -ForegroundColor Cyan
Write-Host ""

# --- Open newly generated PDFs in Edge ---
if ($OpenNew -and $newPDFs.Count -gt 0 -and -not $DryRun) {
    Write-Host "  Opening $($newPDFs.Count) updated PDF(s) in Edge..." -ForegroundColor Cyan
    foreach ($pdf in $newPDFs) {
        Start-Process "msedge" -ArgumentList "`"$pdf`""
    }
}
