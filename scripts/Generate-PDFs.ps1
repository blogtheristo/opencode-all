<#
.SYNOPSIS
    Generates PDF or HTML versions of key Admin Manual, sales, and investor files.

.DESCRIPTION
    Version: 1.6

    CHANGE LOG:
      v1.0 - 06.02.2026 - Initial: pandoc + pdflatex, 16 source files
      v1.1 - 06.02.2026 - Disabled -yaml_metadata_block (DWS headers aren't valid YAML)
      v1.2 - 06.02.2026 - Switched from pdflatex to wkhtmltopdf (Unicode, no LaTeX)
      v1.3 - 07.02.2026 - Auto-detect wkhtmltopdf at default install path
      v1.4 - 07.02.2026 - Pass full wkhtmltopdf path to --pdf-engine
      v1.5 - 07.02.2026 - Engine choice (wkhtmltopdf/html), switched to & pandoc
      v1.6 - 07.02.2026 - Default output to Learn/ folder in repo (HIL pipeline)

    Uses pandoc to convert markdown files to styled PDF or HTML.
    Outputs to Proton Drive generated-pdfs/ folder by default.

    Requires:
      - pandoc (winget install JohnMacFarlane.Pandoc)
      - wkhtmltopdf (winget install wkhtmltopdf) - only for PDF engine

    Called automatically by Sync-ToProton.ps1 when -GeneratePDFs flag is set,
    or run standalone.

.PARAMETER Engine
    Output engine: "wkhtmltopdf" for PDF files, "html" for styled HTML files.
    HTML always works (no extra deps). Default: html.

.PARAMETER RepoPath
    Path to the git repo. Default: auto-detect from script location.

.PARAMETER OutputPath
    Where to write output files. Default: <repo>/Learn/ (HIL learning pipeline)

.PARAMETER DryRun
    Show what would be generated without generating.

.PARAMETER OpenNew
    Open newly generated/updated files in Edge browser.

.EXAMPLE
    .\Generate-PDFs.ps1                          # HTML output (default, always works)
    .\Generate-PDFs.ps1 -Engine wkhtmltopdf      # PDF output (requires wkhtmltopdf)
    .\Generate-PDFs.ps1 -DryRun
    .\Generate-PDFs.ps1 -OpenNew
#>

param(
    [string]$RepoPath = "",
    [string]$OutputPath = "",
    [ValidateSet("wkhtmltopdf", "html")]
    [string]$Engine = "html",
    [switch]$DryRun,
    [switch]$OpenNew
)

# --- Auto-detect repo path ---
if (-not $RepoPath) {
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $RepoPath = Split-Path -Parent $ScriptDir
}

# --- Default output to Learn/ folder in repo ---
if (-not $OutputPath) {
    $OutputPath = Join-Path $RepoPath "Learn"
}

# --- Check pandoc is installed ---
$pandocExe = (Get-Command pandoc -ErrorAction SilentlyContinue).Source
if (-not $pandocExe) {
    Write-Error "pandoc not found. Install with: winget install JohnMacFarlane.Pandoc"
    exit 1
}

# --- Output extension based on engine ---
$outExt = if ($Engine -eq "html") { ".html" } else { ".pdf" }

Write-Host ""
Write-Host "=== DWS6 Document Generator (pandoc) ===" -ForegroundColor Cyan
Write-Host "  pandoc:  $pandocExe"
Write-Host "  Engine:  $Engine -> $outExt files"
Write-Host "  Repo:    $RepoPath"
Write-Host "  Output:  $OutputPath"
if ($DryRun) { Write-Host "  MODE:    DRY RUN" -ForegroundColor Yellow }
Write-Host ""

# --- Find wkhtmltopdf (only needed for PDF engine) ---
$wkExe = $null
if ($Engine -eq "wkhtmltopdf") {
    $wkExe = (Get-Command wkhtmltopdf -ErrorAction SilentlyContinue).Source
    if (-not $wkExe) {
        $wkDefault = "C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe"
        if (Test-Path $wkDefault) {
            $wkExe = $wkDefault
            Write-Host "  wkhtml: $wkExe (not in PATH, using default)" -ForegroundColor Yellow
        } else {
            Write-Warning "wkhtmltopdf not found. Falling back to HTML engine."
            Write-Warning "Install with: winget install wkhtmltopdf"
            $Engine = "html"
            $outExt = ".html"
        }
    } else {
        Write-Host "  wkhtml: $wkExe"
    }
}

# --- Create CSS for DWS brand styling ---
$cssFile = Join-Path $env:TEMP "dws6-pdf-style.css"
@"
body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 40px; color: #333; }
h1 { color: #0a1628; border-bottom: 3px solid #0066cc; padding-bottom: 8px; margin-top: 32px; }
h2 { color: #0a1628; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 24px; }
h3 { color: #333; margin-top: 20px; }
code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; font-size: 10pt; }
pre { background: #f4f4f4; padding: 12px; border-radius: 4px; overflow-x: auto; border: 1px solid #ddd; }
table { border-collapse: collapse; width: 100%; margin: 12px 0; }
th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
th { background: #0a1628; color: white; }
tr:nth-child(even) { background: #f9f9f9; }
a { color: #0066cc; }
blockquote { border-left: 4px solid #0066cc; margin: 16px 0; padding: 8px 16px; background: #f0f7ff; }
"@ | Set-Content -Path $cssFile -Encoding UTF8

# --- Files to convert ---
$FilesToConvert = @(
    # Admin Manuals
    @{ Src = "Admin\ADMIN_MANUAL.md";                          Name = "ADMIN_MANUAL" }
    @{ Src = "Admin\ADMIN_MANUAL_AUTHENTICATION.md";           Name = "ADMIN_MANUAL_AUTHENTICATION" }
    @{ Src = "Admin\ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md";     Name = "ADMIN_MANUAL_DWS10_STORE_PAYMENTS" }
    @{ Src = "Admin\ADMIN_MANUAL_DWS6_COM.md";                 Name = "ADMIN_MANUAL_DWS6_COM" }
    @{ Src = "Admin\ADMIN_MANUAL_SUPABASE_EN_v1.md";           Name = "ADMIN_MANUAL_SUPABASE_EN_v1" }
    @{ Src = "Admin\ADMIN_MANUAL_TESTING.md";                   Name = "ADMIN_MANUAL_TESTING" }
    @{ Src = "Admin\ADMIN_MANUAL_GAPS_ANALYSIS.md";            Name = "ADMIN_MANUAL_GAPS_ANALYSIS" }
    @{ Src = "Admin\ADMIN_MANUAL_FILES_AND_FOLDERS.md";        Name = "ADMIN_MANUAL_FILES_AND_FOLDERS" }
    @{ Src = "Admin\Security\ADMIN_MANUAL_SECURITY_TESTING.md"; Name = "ADMIN_MANUAL_SECURITY_TESTING" }
    @{ Src = "Admin\Security\ADMIN_MANUAL_SECURITY_MONITORING.md"; Name = "ADMIN_MANUAL_SECURITY_MONITORING" }
    @{ Src = "Admin\SECURITY_COMPLIANCE.md";                     Name = "SECURITY_COMPLIANCE" }

    # Sales & Marketing
    @{ Src = "sales-outreach\enterprise-sales.md";              Name = "enterprise-sales" }
    @{ Src = "sales-outreach\SALES_AI_AGENT_DESIGN_FI_v1.md";  Name = "SALES_AI_AGENT_DESIGN_FI_v1" }

    # Investor Materials
    @{ Src = "investor-outreach\V3-DWS-IQ6-InvestorPD_2026.md"; Name = "V3-DWS-IQ6-InvestorPD_2026" }
    @{ Src = "investor-outreach\investor-pitch-deck.md";         Name = "investor-pitch-deck" }
    @{ Src = "investor-outreach\INVESTOR_MEMO.md";               Name = "INVESTOR_MEMO" }

    # Standards & Environment Rules
    @{ Src = "CLAUDE.md";                                        Name = "CLAUDE" }
    @{ Src = "DWS_DOCUMENT_STANDARD.md";                         Name = "DWS_DOCUMENT_STANDARD" }
    @{ Src = "docs\Document-index.md";                           Name = "Document-index" }

    # Master Thesis (Metropolia)
    @{ Src = "docs\metropolia\master-thesis\en\V3Thesis_EN.md";  Name = "V3Thesis_EN" }
    @{ Src = "docs\metropolia\master-thesis\fi\V3Thesis_FI.md";  Name = "V3Thesis_FI" }
)

# --- Create output directory ---
if (-not (Test-Path $OutputPath)) {
    if (-not $DryRun) {
        New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
    }
    Write-Host "  [MKDIR] $OutputPath" -ForegroundColor Cyan
}

# --- Generate documents ---
$successCount = 0
$skipCount = 0
$errorCount = 0
$newFiles = @()

foreach ($file in $FilesToConvert) {
    $srcFile = Join-Path $RepoPath $file.Src
    $destFile = Join-Path $OutputPath "$($file.Name)$outExt"

    if (-not (Test-Path $srcFile)) {
        $skipCount++
        continue
    }

    # Skip if output is newer than source
    if (Test-Path $destFile) {
        $srcTime = (Get-Item $srcFile).LastWriteTime
        $dstTime = (Get-Item $destFile).LastWriteTime
        if ($dstTime -gt $srcTime) {
            $skipCount++
            continue
        }
    }

    if ($DryRun) {
        Write-Host "  [$($Engine.ToUpper())] $($file.Src) -> $($file.Name)$outExt" -ForegroundColor Yellow
        $successCount++
        continue
    }

    Write-Host "  [$($Engine.ToUpper())] $($file.Src)..." -ForegroundColor Cyan -NoNewline
    try {
        $errFile = Join-Path $env:TEMP "pandoc-err.txt"

        if ($Engine -eq "html") {
            # HTML: pandoc handles natively, no external engine needed
            & $pandocExe $srcFile -o $destFile --standalone --toc --toc-depth=2 -f "markdown-yaml_metadata_block+smart" --css $cssFile --embed-resources --metadata "title=$($file.Name)" 2>$errFile
        } else {
            # PDF: use wkhtmltopdf engine
            & $pandocExe $srcFile -o $destFile --pdf-engine $wkExe --toc --toc-depth=2 -f "markdown-yaml_metadata_block+smart" --css $cssFile 2>$errFile
        }

        if ($LASTEXITCODE -eq 0 -and (Test-Path $destFile)) {
            $size = [math]::Round((Get-Item $destFile).Length / 1KB)
            Write-Host " OK (${size}KB)" -ForegroundColor Green
            $successCount++
            $newFiles += $destFile
        } else {
            $err = Get-Content $errFile -Raw -ErrorAction SilentlyContinue
            Write-Host " FAILED" -ForegroundColor Red
            if ($err) { Write-Host "    $($err.Trim())" -ForegroundColor Red }
            $errorCount++
        }
    } catch {
        Write-Host " ERROR: $_" -ForegroundColor Red
        $errorCount++
    }
}

# --- Summary ---
Write-Host ""
Write-Host "=== Generation Complete ===" -ForegroundColor Cyan
Write-Host "  Engine:    $Engine ($outExt)" -ForegroundColor Cyan
Write-Host "  Generated: $successCount files" -ForegroundColor Green
Write-Host "  Skipped:   $skipCount files (unchanged or missing)" -ForegroundColor Gray
if ($errorCount -gt 0) {
    Write-Host "  Errors:    $errorCount files" -ForegroundColor Red
    if ($Engine -eq "wkhtmltopdf") {
        Write-Host ""
        Write-Host "  TIP: Try -Engine html (always works, no extra deps)" -ForegroundColor Yellow
    }
}
Write-Host "  Output:    $OutputPath" -ForegroundColor Cyan
Write-Host ""

# --- Open newly generated files in Edge ---
if ($OpenNew -and $newFiles.Count -gt 0 -and -not $DryRun) {
    Write-Host "  Opening $($newFiles.Count) updated file(s) in Edge..." -ForegroundColor Cyan
    foreach ($f in $newFiles) {
        Start-Process "msedge" -ArgumentList "`"$f`""
    }
}
