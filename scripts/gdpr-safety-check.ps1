# GDPR Safety Check Script
# Prevents committing secret-bearing files/content to GitHub.
# Run before any git commit: .\scripts\gdpr-safety-check.ps1
#
# Safer policy:
# - Block by file pattern/content, not folder.
# - Allow docs by default (including Admin/*.md).
# - Keep ClaudeCode templates/docs commit-friendly.
# - Reserve Admin/Claudecode_Secrets for truly sensitive artifacts.

Write-Host "[SECURITY] Running Security & GDPR Compliance Check..." -ForegroundColor Cyan

$blocked = $false
$blockedEntries = New-Object System.Collections.Generic.List[string]

function Add-Blocked([string]$file, [string]$reason) {
    $script:blocked = $true
    $script:blockedEntries.Add("$file  [$reason]") | Out-Null
}

# Get staged paths (added/copied/modified/renamed only)
$stagedNames = git diff --cached --name-only --diff-filter=ACMR 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[WARN] Unable to read staged files. Skipping hook." -ForegroundColor Yellow
    exit 0
}

if (-not $stagedNames -or $stagedNames.Count -eq 0) {
    Write-Host "[OK] No staged files to validate" -ForegroundColor Green
    exit 0
}

# Path-based secret file checks
foreach ($file in $stagedNames) {
    if ([string]::IsNullOrWhiteSpace($file)) { continue }

    # Block .env* except explicit templates
    if (
        $file -match '(^|/)\.env($|[.].*)' -and
        $file -notmatch '(^|/)\.env\.example$' -and
        $file -notmatch '(^|/)\.env\..*\.example$'
    ) {
        Add-Blocked $file ".env secret file"
    }

    if ($file -match '\.pem$') { Add-Blocked $file "private key file (.pem)" }
    if ($file -match '\.key$') { Add-Blocked $file "private key file (.key)" }
    if ($file -match '(^|/)credentials\.json$') { Add-Blocked $file "credentials.json" }
    if ($file -match '(^|/)service-account-.*\.json$') { Add-Blocked $file "service account key json" }

    # Keep sensitive artifacts out of git while allowing policy docs/examples
    if (
        $file -match '^Admin/Claudecode_Secrets/' -and
        $file -notmatch '^Admin/Claudecode_Secrets/README\.md$' -and
        $file -notmatch '^Admin/Claudecode_Secrets/.*\.example$'
    ) {
        Add-Blocked $file "reserved sensitive folder (use secure vault, not git)"
    }
}

# High-confidence secret content checks (staged content only)
$contentRegexes = @(
    'gh[pousr]_[A-Za-z0-9]{36,}',                            # GitHub tokens
    'github_pat_[A-Za-z0-9_]{20,}',                          # GitHub fine-grained PAT
    'AKIA[0-9A-Z]{16}',                                      # AWS access key
    'ASIA[0-9A-Z]{16}',                                      # AWS temporary access key
    'AIza[0-9A-Za-z\-_]{35}',                                # Google API key
    'xox[baprs]-[A-Za-z0-9-]{10,}',                          # Slack tokens
    'sk-[A-Za-z0-9]{20,}',                                   # OpenAI-style API keys
    '-----BEGIN [A-Z ]*PRIVATE KEY-----',                    # PEM block
    'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' # JWT
)

foreach ($file in $stagedNames) {
    if ([string]::IsNullOrWhiteSpace($file)) { continue }

    $content = git show ":$file" 2>$null
    if ($LASTEXITCODE -ne 0) { continue } # binary/removed/unreadable
    if (-not $content) { continue }

    foreach ($rx in $contentRegexes) {
        if ($content -match $rx) {
            Add-Blocked $file "secret-like token detected in staged content"
            break
        }
    }
}

if ($blocked) {
    Write-Host "`n[BLOCKED] COMMIT BLOCKED for security compliance" -ForegroundColor Red
    Write-Host "`nBlocked files:" -ForegroundColor Yellow
    $blockedEntries | Sort-Object -Unique | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
    Write-Host "`nTo unstage files: git reset HEAD <file>" -ForegroundColor Yellow
    Write-Host "If this is a false positive template, use *.example naming and placeholder values." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n[OK] Security compliance check passed" -ForegroundColor Green
exit 0
