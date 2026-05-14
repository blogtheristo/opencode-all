# DWS6.com Cloudflare Pages Deployment Script
# Deploy the multi-login platform to Cloudflare Pages

Write-Host "🚀 DWS6.com Cloudflare Pages Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is installed
Write-Host "Checking for Wrangler CLI..." -ForegroundColor Yellow
$wranglerInstalled = Get-Command wrangler -ErrorAction SilentlyContinue

if (-not $wranglerInstalled) {
    Write-Host "❌ Wrangler CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing Wrangler CLI..." -ForegroundColor Yellow
    npm install -g wrangler
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Wrangler CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g wrangler" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Wrangler CLI installed successfully" -ForegroundColor Green
} else {
    Write-Host "✅ Wrangler CLI found" -ForegroundColor Green
}

Write-Host ""

# Login to Cloudflare
Write-Host "Logging in to Cloudflare..." -ForegroundColor Yellow
Write-Host "(A browser window will open for authentication)" -ForegroundColor Gray
wrangler login

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to login to Cloudflare" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Logged in to Cloudflare" -ForegroundColor Green
Write-Host ""

# Deploy to Cloudflare Pages
Write-Host "Deploying dws6.com to Cloudflare Pages..." -ForegroundColor Yellow
Write-Host "Project: dws6-platform" -ForegroundColor Gray
Write-Host ""

wrangler pages deploy . --project-name=dws6-platform --branch=main

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Deployment successful!" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 DWS6.com is now live!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Add custom domain in Cloudflare dashboard:" -ForegroundColor White
Write-Host "   https://dash.cloudflare.com/" -ForegroundColor Gray
Write-Host "   → Select 'dws6-platform' project" -ForegroundColor Gray
Write-Host "   → Go to 'Custom domains'" -ForegroundColor Gray
Write-Host "   → Add 'dws6.com'" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Update Supabase redirect URLs:" -ForegroundColor White
Write-Host "   https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz/settings/auth" -ForegroundColor Gray
Write-Host "   Add all dashboard URLs (see DEPLOYMENT_OPTIONS.md)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Test the platform:" -ForegroundColor White
Write-Host "   https://dws6.com/login/" -ForegroundColor Gray
Write-Host ""
Write-Host "Cost: $0/month (completely free!)" -ForegroundColor Green
Write-Host ""
