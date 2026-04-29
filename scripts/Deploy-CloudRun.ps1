# Deploy to Google Cloud Run
# Usage: .\scripts\Deploy-CloudRun.ps1
# (reads secrets from .env file automatically)

param(
    [string]$ProjectId = "dws6run6",
    [string]$Region = "europe-north1",
    [string]$ServiceName = "dws-iq-backend",
    [string]$ImageName = "dws-iq-backend"
)

# Load .env file
$envFile = Join-Path $PSScriptRoot ".." ".env"
if (-not (Test-Path $envFile)) {
    throw "❌ .env file not found at $envFile"
}

Write-Host "📂 Loading secrets from .env file..." -ForegroundColor Gray

# Parse .env file
$envVars = @{}
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            $envVars[$parts[0].Trim()] = $parts[1].Trim()
        }
    }
}

# Extract required secrets
$StripeSecretKey = $envVars["STRIPE_SECRET_KEY"]
$StripeKey = $envVars["STRIPE_KEY"]
$StripeWebhookSecret = $envVars["STRIPE_WEBHOOK_SECRET"]
$SupabaseUrl = $envVars["SUPABASE_URL"]
$SupabaseServiceKey = $envVars["SUPABASE_SERVICE_KEY"]
$SmtpHost = $envVars["SMTP_HOST"]
$SmtpPort = $envVars["SMTP_PORT"]
$SmtpSecure = $envVars["SMTP_SECURE"]
$SmtpUser = $envVars["SMTP_USER"]
$SmtpPass = $envVars["SMTP_PASS"]
$EmailFrom = $envVars["EMAIL_FROM"]
$BookingAdminEmail = $envVars["BOOKING_ADMIN_EMAIL"]

# If STRIPE_SECRET_KEY not found, try STRIPE_KEY (which may contain label + secret)
if (-not $StripeSecretKey -and $StripeKey) {
    # Parse format: "label sk_live_..." → extract just "sk_live_..."
    $parts = $StripeKey -split '\s+' | Where-Object { $_ -match '^sk_live_' }
    if ($parts) {
        $StripeSecretKey = $parts[0]
        Write-Host "ℹ️  Extracted secret key from STRIPE_KEY" -ForegroundColor Gray
    }
}

# Validate secrets
if (-not $StripeSecretKey) { throw "❌ STRIPE_SECRET_KEY or STRIPE_KEY not found in .env" }
if (-not $StripeWebhookSecret) { throw "❌ STRIPE_WEBHOOK_SECRET not found in .env" }
if (-not $SupabaseUrl) { Write-Host "⚠️  SUPABASE_URL not found in .env (optional)" -ForegroundColor Yellow }
if (-not $SupabaseServiceKey) { Write-Host "⚠️  SUPABASE_SERVICE_KEY not found in .env (optional)" -ForegroundColor Yellow }
if (-not $SmtpHost) { throw "❌ SMTP_HOST not found in .env" }
if (-not $SmtpUser) { throw "❌ SMTP_USER not found in .env" }
if (-not $SmtpPass) { throw "❌ SMTP_PASS not found in .env" }
if (-not $SmtpPort) { $SmtpPort = "587" }
if (-not $SmtpSecure) { $SmtpSecure = "false" }
if (-not $EmailFrom) { $EmailFrom = "risto@onelifetime.world" }
if (-not $BookingAdminEmail) { $BookingAdminEmail = "risto@lifetime.fi" }

Write-Host "✅ Secrets loaded successfully" -ForegroundColor Green

Write-Host "🚀 Deploying to Google Cloud Run" -ForegroundColor Cyan
Write-Host "Project: $ProjectId" -ForegroundColor Gray
Write-Host "Region: $Region" -ForegroundColor Gray
Write-Host ""

# Step 1: Authenticate with Google Cloud
Write-Host "1️⃣  Authenticating with Google Cloud..." -ForegroundColor Yellow
gcloud auth login --project=$ProjectId
if ($LASTEXITCODE -ne 0) { throw "Authentication failed" }

# Step 2: Set project
Write-Host "2️⃣  Setting project to $ProjectId..." -ForegroundColor Yellow
gcloud config set project $ProjectId
if ($LASTEXITCODE -ne 0) { throw "Failed to set project" }

# Step 3: Build and push Docker image
Write-Host "3️⃣  Building Docker image..." -ForegroundColor Yellow
gcloud builds submit `
  --tag "$Region-docker.pkg.dev/$ProjectId/dws-iq-repo/$ImageName`:latest" `
  --project=$ProjectId
if ($LASTEXITCODE -ne 0) { throw "Docker build failed" }

# Step 4: Deploy to Cloud Run
Write-Host "4️⃣  Deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
  --image "$Region-docker.pkg.dev/$ProjectId/dws-iq-repo/$ImageName`:latest" `
  --region $Region `
  --project=$ProjectId `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --timeout 300 `
  --set-env-vars=`
"STRIPE_SECRET_KEY=$StripeSecretKey,`
STRIPE_WEBHOOK_SECRET=$StripeWebhookSecret,`
SUPABASE_URL=$SupabaseUrl,`
SUPABASE_SERVICE_KEY=$SupabaseServiceKey,`
SMTP_HOST=$SmtpHost,`
SMTP_PORT=$SmtpPort,`
SMTP_SECURE=$SmtpSecure,`
SMTP_USER=$SmtpUser,`
SMTP_PASS=$SmtpPass,`
EMAIL_FROM=$EmailFrom,`
BOOKING_ADMIN_EMAIL=$BookingAdminEmail,`
NODE_ENV=production"

if ($LASTEXITCODE -ne 0) { throw "Cloud Run deployment failed" }

# Step 5: Get service URL
Write-Host "5️⃣  Getting service URL..." -ForegroundColor Yellow
$ServiceUrl = gcloud run services describe $ServiceName `
  --region $Region `
  --project=$ProjectId `
  --format 'value(status.url)'

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "Service Details:" -ForegroundColor Cyan
Write-Host "  Name: $ServiceName"
Write-Host "  URL: $ServiceUrl"
Write-Host "  Region: $Region"
Write-Host "  Memory: 512Mi"
Write-Host "  CPU: 1"
Write-Host ""
Write-Host "Webhook URL for Stripe:" -ForegroundColor Cyan
Write-Host "  $ServiceUrl/webhooks/stripe"
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update Stripe Workbench with webhook URL: $ServiceUrl/webhooks/stripe"
Write-Host "  2. Test with: gcloud run logs read $ServiceName --region $Region --limit 50"
Write-Host ""
