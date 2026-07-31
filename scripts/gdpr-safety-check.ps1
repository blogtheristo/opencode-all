# GDPR Safety Check Script
# Prevents committing confidential files to GitHub
# Run before any git commit: .\scripts\gdpr-safety-check.ps1
# 
# Checks for:
# - Admin/ folder files (confidential business data)
# - Secret files (API keys, tokens)
# - Deployment files (infrastructure configuration)

Write-Host "[SECURITY] Running Security & GDPR Compliance Check..." -ForegroundColor Cyan

$BLOCKED = $false
$BLOCKED_FILES = @()

# Get staged file names once
$stagedNames = git diff --cached --name-only 2>&1

# Check for Admin/ folder files (with exceptions for public documentation)
$adminFiles = $stagedNames | Where-Object { $_ -like 'Admin/*' }
if ($adminFiles -and $adminFiles.Count -gt 0) {
    # Filter out allowed documentation (matches .gitignore exceptions)
    $blockedAdminFiles = $adminFiles | Where-Object {
        $_ -notmatch '^Admin/Security/ADMIN_.*\.md$' -and
        $_ -notmatch '^Admin/Security/SECURITY_.*\.md$' -and
        $_ -notmatch '^Admin/Security/SECURITY_.*\.txt$' -and
        $_ -notmatch '^Admin/Security/SIMONWILLISON_.*\.md$' -and
        $_ -notmatch '^Admin/Security/DWS-IQ6-.*\.md$' -and
        $_ -notmatch '^Admin/Security/REORGANIZATION_.*\.md$' -and
        $_ -notmatch '^Admin/SECURITY_.*\.md$' -and
        $_ -notmatch '^Admin/ADMIN_MANUAL\.md$' -and
        $_ -notmatch '^Admin/PORT_MAPPING\.md$' -and
        $_ -notmatch '^Admin/TWITTER_AUTOMATION_GUIDE\.md$' -and
        $_ -notmatch '^Admin/CONFIDENTIAL-handling-policy\.md$' -and
        $_ -notmatch '^Admin/GIT_CORRUPTION_RESOLUTION_NOTE\.md$' -and
        $_ -notlike 'Admin/Installation/*' -and
        $_ -notlike 'Admin/Li/*'
    }
    
    if ($blockedAdminFiles -and $blockedAdminFiles.Count -gt 0) {
        Write-Host "`n[BLOCKED] Files from Admin/ folder detected!" -ForegroundColor Red
        Write-Host "   These files contain confidential business and personal data" -ForegroundColor Red
        $blockedAdminFiles | ForEach-Object {
            Write-Host "   - $_" -ForegroundColor Red
            $BLOCKED_FILES += $_
        }
        $BLOCKED = $true
    }
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

# Check for deployment files (CRITICAL SECURITY - infrastructure exposure)
$deploymentPatterns = @(
    "cloudbuild\.yaml",
    "cloudrun-service\.yaml",
    "deploy-gcp\.sh",
    "setup-secrets-gcp\.sh",
    "GCP_DEPLOYMENT\.md",
    "QUICK_DEPLOY\.md",
    "docker-compose\.mcp\.yml",
    "^Dockerfile$",
    "^\.dockerignore$",
    "DOCKER_.*\.md",
    "DOCKER_.*\.txt",
    ".*\.dockerfile$",
    "mcp-hub/DOCKER_.*",
    "mcp-hub/GCP_.*",
    "mcp-hub/DEPLOY_.*",
    "mcp-hub/.*deploy.*",
    "mcp-hub/.*deployment.*"
)
foreach ($pattern in $deploymentPatterns) {
    $deploymentFiles = $stagedNames | Where-Object { $_ -match $pattern }
    if ($deploymentFiles -and $deploymentFiles.Count -gt 0) {
        Write-Host "`n[BLOCKED] Deployment files detected!" -ForegroundColor Red
        Write-Host "   These files contain infrastructure configuration and deployment procedures" -ForegroundColor Red
        Write-Host "   They must remain local only and are protected by .gitignore" -ForegroundColor Yellow
        $deploymentFiles | ForEach-Object {
            Write-Host "   - $_" -ForegroundColor Red
            $BLOCKED_FILES += $_
        }
        $BLOCKED = $true
    }
}

if ($BLOCKED) {
    Write-Host "`n[BLOCKED] COMMIT BLOCKED for security compliance" -ForegroundColor Red
    Write-Host "`nTo unstage these files:" -ForegroundColor Yellow
    Write-Host '   git reset HEAD <file>' -ForegroundColor White
    Write-Host "`nBlocked files:" -ForegroundColor Yellow
    $BLOCKED_FILES | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host "`n⚠️  These files are protected by .gitignore and should not be committed" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "`n[OK] Security compliance check passed" -ForegroundColor Green
    exit 0
}
