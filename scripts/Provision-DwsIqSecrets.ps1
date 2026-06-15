<#
.SYNOPSIS
    Provisions DWS IQ backend secrets to Google Secret Manager (europe-north1).

.DESCRIPTION
    Uploads the DWS IQ backend's runtime secrets to Google Secret Manager in
    the dws6run6 project, user-managed replication pinned to europe-north1 for
    EU residency. The exact inventory is the $SecretMap at the top of this
    script — keep that as the source of truth. As of 2026-04-25 it covers:

      STRIPE_SECRET_KEY     -> stripe-secret-key
      STRIPE_WEBHOOK_SECRET -> stripe-webhook-secret
      SUPABASE_URL          -> supabase-url
      SUPABASE_ANON_KEY     -> supabase-anon-key
      SUPABASE_SERVICE_KEY  -> supabase-service-key   (alias accepted: SUPABASE_SERVICE_ROLE_KEY)
      JWT_SECRET            -> jwt-secret
      SMTP_USER             -> smtp-user
      SMTP_PASS             -> smtp-pass
      EXA_API_KEY           -> exa-api-key

    Then grants roles/secretmanager.secretAccessor on each secret to the
    Cloud Run runtime service account (Compute Engine default SA; this is the
    principal that dws6run6 actually uses per Cloud Environments Section 4.4).

    Safe-input pattern: values are written to a single temp file per secret,
    uploaded via `gcloud secrets versions add --data-file=`, then the temp
    file is overwritten with zeros before deletion. Values are never printed
    to console and never passed on a command line.

.PARAMETER SecretsFile
    Path to the local secrets file. Accepts:
      - .env format: one KEY=VALUE per line (optionally quoted)
      - Any text containing substrings of the form KEY=VALUE or KEY="VALUE"
        (so gcloud command snippets like --set-env-vars="A=1,B=2" also work)

.PARAMETER ProjectId
    GCP project id. Default: dws6run6.

.PARAMETER Region
    User-managed replication location. Default: europe-north1.

.PARAMETER RuntimeServiceAccount
    Service account granted secretAccessor on each secret.
    Default: 1074393862472-compute@developer.gserviceaccount.com (Compute
    Engine default SA for dws6run6 — the principal Cloud Run uses).

.PARAMETER DryRun
    If specified, prints which keys were found and their character lengths,
    but does NOT create, modify, or access Secret Manager.

.EXAMPLE
    .\scripts\Provision-DwsIqSecrets.ps1 -SecretsFile "F:\Proton\My files\2026\Lifetime_fi\secrets.txt" -DryRun

.EXAMPLE
    .\scripts\Provision-DwsIqSecrets.ps1 -SecretsFile "F:\Proton\My files\2026\Lifetime_fi\secrets.txt"

.NOTES
    This script handles only the DWS IQ backend's runtime secrets (see the
    $SecretMap inventory at the top of this script). For broader .env
    provisioning (MCP gateway, sales agents, etc.), use the sibling bash
    script scripts/provision-secrets.sh on Linux/WSL.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$SecretsFile,

    [string]$ProjectId = 'dws6run6',

    [string]$Region = 'europe-north1',

    [string]$RuntimeServiceAccount = '1074393862472-compute@developer.gserviceaccount.com',

    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

# Use the .cmd wrapper to bypass bundledpython permission issue on Windows.
$GcloudCmd = 'C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd'
if (-not (Test-Path $GcloudCmd)) { $GcloudCmd = 'gcloud' }

# Map ENV var names in the source file -> Secret Manager secret names.
$SecretMap = [ordered]@{
    'STRIPE_SECRET_KEY'     = 'stripe-secret-key'
    'STRIPE_WEBHOOK_SECRET' = 'stripe-webhook-secret'
    'SUPABASE_URL'          = 'supabase-url'
    'SUPABASE_ANON_KEY'     = 'supabase-anon-key'
    'SUPABASE_SERVICE_KEY'  = 'supabase-service-key'
    'JWT_SECRET'            = 'jwt-secret'
    'SMTP_USER'             = 'smtp-user'
    'SMTP_PASS'             = 'smtp-pass'
    'EXA_API_KEY'           = 'exa-api-key'
    'EXA_API_KEY_OPENCLAW'  = 'exa-api-key-openclaw'
}

function Write-Info  { param($m) Write-Host "[INFO]  $m" -ForegroundColor Cyan }
function Write-Ok    { param($m) Write-Host "[OK]    $m" -ForegroundColor Green }
function Write-Warn2 { param($m) Write-Host "[WARN]  $m" -ForegroundColor Yellow }
function Write-Err   { param($m) Write-Host "[ERROR] $m" -ForegroundColor Red }

function Assert-Gcloud {
    if (-not (Test-Path $GcloudCmd) -and -not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
        throw 'gcloud CLI not found. Install Google Cloud SDK and re-run.'
    }
    $null = & $GcloudCmd projects describe $ProjectId --format='value(projectNumber)' 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Cannot access project '$ProjectId'. Run: $GcloudCmd auth login && $GcloudCmd config set project $ProjectId"
    }
}

function Get-SecretsFromFile {
    param([string]$Path)

    if (-not (Test-Path -LiteralPath $Path)) {
        throw "Secrets file not found: $Path"
    }
    $raw = Get-Content -LiteralPath $Path -Raw

    $found = [ordered]@{}
    # Aliases: alternate env-var names that map to the same secret. Lets a source
    # file written with canonical Supabase naming (SUPABASE_SERVICE_ROLE_KEY) also
    # satisfy the backend's SUPABASE_SERVICE_KEY lookup without duplication.
    $Aliases = @{
        'SUPABASE_SERVICE_KEY' = @('SUPABASE_SERVICE_ROLE_KEY')
    }

    foreach ($envName in $SecretMap.Keys) {
        # Match KEY=value in any of: .env, export KEY=, gcloud --set-env-vars="KEY=v,KEY=v"
        # Uses \b so both whitespace and quote/comma separators before the key work.
        $candidates = @($envName)
        if ($Aliases.ContainsKey($envName)) { $candidates += $Aliases[$envName] }

        foreach ($candidate in $candidates) {
            # Build regex using [char]39 for the single-quote to avoid PowerShell 5.1
            # parser quirks with dense '' escapes inside complex string literals.
            $sq = [char]39
            $pattern = '\b' + [regex]::Escape($candidate) + "\s*=\s*(?:`"([^`"]*)`"|$sq([^$sq]*)$sq|([^\s,`"$sq\r\n]+))"
            $regex = [regex]::new($pattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
            $match = $regex.Match($raw)
            if ($match.Success) {
                $value = $match.Groups[1].Value
                if (-not $value) { $value = $match.Groups[2].Value }
                if (-not $value) { $value = $match.Groups[3].Value }
                if ($value) {
                    $found[$envName] = $value
                    break
                }
            }
        }
    }
    return $found
}

function Test-SecretExists {
    param([string]$Name)
    $null = & $GcloudCmd secrets describe $Name --project=$ProjectId 2>$null
    return ($LASTEXITCODE -eq 0)
}

function Submit-SecretValue {
    param(
        [string]$SecretName,
        [string]$Value
    )

    $tempFile = [System.IO.Path]::GetTempFileName()
    try {
        # Write value as UTF-8 without BOM, no trailing newline.
        $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText($tempFile, $Value, $utf8NoBom)

        if (Test-SecretExists -Name $SecretName) {
            & $GcloudCmd secrets versions add $SecretName `
                --project=$ProjectId `
                --data-file="$tempFile" 1>$null
            if ($LASTEXITCODE -ne 0) { throw "Failed to add version to $SecretName" }
            Write-Ok "Added new version to '$SecretName'"
        } else {
            & $GcloudCmd secrets create $SecretName `
                --project=$ProjectId `
                --replication-policy='user-managed' `
                --locations=$Region `
                --data-file="$tempFile" 1>$null
            if ($LASTEXITCODE -ne 0) { throw "Failed to create secret $SecretName" }
            Write-Ok "Created '$SecretName' (user-managed, $Region)"
        }
    } finally {
        # Best-effort secure wipe before delete.
        if (Test-Path -LiteralPath $tempFile) {
            try {
                $len  = (Get-Item -LiteralPath $tempFile).Length
                $zero = New-Object byte[] ([Math]::Max([int]$len, 1))
                [System.IO.File]::WriteAllBytes($tempFile, $zero)
            } catch { }
            Remove-Item -LiteralPath $tempFile -Force -ErrorAction SilentlyContinue
        }
    }
}

function Grant-RuntimeAccess {
    param([string]$SecretName)

    & $GcloudCmd secrets add-iam-policy-binding $SecretName `
        --project=$ProjectId `
        --member="serviceAccount:$RuntimeServiceAccount" `
        --role='roles/secretmanager.secretAccessor' `
        --quiet 1>$null
    if ($LASTEXITCODE -ne 0) { throw "Failed to grant accessor on $SecretName" }
    Write-Ok "Granted secretAccessor on '$SecretName' to $RuntimeServiceAccount"
}

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
Write-Info "DWS IQ backend secret provisioning"
Write-Info "  Project : $ProjectId"
Write-Info "  Region  : $Region"
Write-Info "  Runtime : $RuntimeServiceAccount"
Write-Info "  Source  : $SecretsFile"
Write-Info "  DryRun  : $($DryRun.IsPresent)"
Write-Host ""

Assert-Gcloud

$values = Get-SecretsFromFile -Path $SecretsFile

$missing = @()
foreach ($envName in $SecretMap.Keys) {
    if (-not $values.Contains($envName)) { $missing += $envName }
}

Write-Info "Keys discovered in source file:"
foreach ($envName in $SecretMap.Keys) {
    if ($values.Contains($envName)) {
        $len = $values[$envName].Length
        Write-Host ("  [{0,3} chars] {1} -> {2}" -f $len, $envName, $SecretMap[$envName])
    } else {
        Write-Host ("  [MISSING ] {0} -> {1}" -f $envName, $SecretMap[$envName]) -ForegroundColor DarkYellow
    }
}
Write-Host ""

if ($missing.Count -gt 0) {
    Write-Warn2 "Missing $($missing.Count) of $($SecretMap.Count) keys: $($missing -join ', ')"
    Write-Warn2 "Only found keys will be provisioned. Add the missing ones to the source file and re-run if needed."
    Write-Host ""
}

if ($DryRun) {
    Write-Info "DryRun mode — no changes made. Re-run without -DryRun to apply."
    exit 0
}

$provisioned = @()
foreach ($envName in $SecretMap.Keys) {
    if (-not $values.Contains($envName)) { continue }
    $secretName = $SecretMap[$envName]
    Submit-SecretValue -SecretName $secretName -Value $values[$envName]
    Grant-RuntimeAccess -SecretName $secretName
    $provisioned += $secretName
}

Write-Host ""
Write-Ok  "Provisioned $($provisioned.Count) secret(s): $($provisioned -join ', ')"
Write-Info "Verify with: gcloud secrets list --project=$ProjectId"
Write-Info "Next: run the Cloud Run deploy command (see docs/CLOUD_ENVIRONMENTS.md Section 4.5)."
