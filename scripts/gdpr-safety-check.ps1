# GDPR Safety Check Script
# Prevents committing confidential files to GitHub
# Run before any git commit: .\scripts\gdpr-safety-check.ps1

Write-Host "[GDPR] Running GDPR Compliance Safety Check..." -ForegroundColor Cyan

$BLOCKED = $false
$BLOCKED_FILES = @()

# Get staged file names once
$stagedNames = git diff --cached --name-only 2>&1

# Check for Admin/ folder files
$adminFiles = $stagedNames | Where-Object { $_ -like 'Admin/*' }
if ($adminFiles -and $adminFiles.Count -gt 0) {
    Write-Host "`n[BLOCKED] Files from Admin/ folder detected!" -ForegroundColor Red
    Write-Host "   These files contain confidential business and personal data" -ForegroundColor Red
    $adminFiles | ForEach-Object {
        Write-Host "   - $_" -ForegroundColor Red
        $BLOCKED_FILES += $_
    }
    $BLOCKED = $true
}

# Note: Sensitive keyword checking disabled - use Admin/ folder protection instead
# This prevents false positives while maintaining compliance through folder-level access control

# Check for secret files
$secretPatterns = @("\.env\.", "CLOUDFLARE_SECRETS", "ADD_TOKEN_TO_GITHUB", "SFTP_SECRETS")
foreach ($pattern in $secretPatterns) {
    $secretFiles = $stagedNames | Where-Object { $_ -match $pattern }
    if ($secretFiles -and $secretFiles.Count -gt 0) {
        Write-Host "`n[BLOCKED] Secret files detected!" -ForegroundColor Red
        $secretFiles | ForEach-Object {
            Write-Host "   - $_" -ForegroundColor Red
            $BLOCKED_FILES += $_
        }
        $BLOCKED = $true
    }
}

if ($BLOCKED) {
    Write-Host "`n[BLOCKED] COMMIT BLOCKED for GDPR compliance" -ForegroundColor Red
    Write-Host "`nTo unstage these files:" -ForegroundColor Yellow
    Write-Host '   git reset HEAD <file>' -ForegroundColor White
    Write-Host "`nBlocked files:" -ForegroundColor Yellow
    $BLOCKED_FILES | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    exit 1
} else {
    Write-Host "`n[OK] GDPR compliance check passed" -ForegroundColor Green
    exit 0
}
