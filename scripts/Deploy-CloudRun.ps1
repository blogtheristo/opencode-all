# Deploy to Google Cloud Run
# Usage: .\scripts\Deploy-CloudRun.ps1 -StripeSecretKey "sk_live_..." -StripeWebhookSecret "whsec_..."

param(
    [Parameter(Mandatory=$true)]
    [string]$StripeSecretKey,

    [Parameter(Mandatory=$true)]
    [string]$StripeWebhookSecret,

    [string]$SupabaseUrl = $env:SUPABASE_URL,
    [string]$SupabaseServiceKey = $env:SUPABASE_SERVICE_KEY,
    [string]$ProjectId = "dws6run6",
    [string]$Region = "europe-north1",
    [string]$ServiceName = "dws-iq-backend",
    [string]$ImageName = "dws-iq-backend"
)

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
