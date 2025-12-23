# Get Zone IDs using Email + Global API Key method
# Note: You need your Global API Key from Cloudflare dashboard

$email = "risto.paarni2024@lifetime.fi"
# Get your Global API Key from: https://dash.cloudflare.com/profile/api-tokens
# Click "View" next to "Global API Key"
$apiKey = "YOUR_GLOBAL_API_KEY_HERE"  # Replace with your actual Global API Key

Write-Host "`n=== Fetching Cloudflare Zones (Email/Key Method) ===" -ForegroundColor Cyan
Write-Host "Email: $email" -ForegroundColor Gray
Write-Host ""

if ($apiKey -eq "YOUR_GLOBAL_API_KEY_HERE") {
    Write-Host "⚠️  Please set your Global API Key in this script first!" -ForegroundColor Yellow
    Write-Host "Get it from: https://dash.cloudflare.com/profile/api-tokens" -ForegroundColor Gray
    Write-Host "Click 'View' next to 'Global API Key'" -ForegroundColor Gray
    exit
}

try {
    $headers = @{
        "X-Auth-Email" = $email
        "X-Auth-Key" = $apiKey
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones" -Method Get -Headers $headers
    
    if ($response.success) {
        Write-Host "✅ Successfully retrieved zones!" -ForegroundColor Green
        Write-Host ""
        Write-Host "=== Zone IDs for GitHub Secrets ===" -ForegroundColor Yellow
        Write-Host ""
        
        $dws10 = $response.result | Where-Object { $_.name -eq "dws10.com" }
        $onelife = $response.result | Where-Object { $_.name -eq "onelifetime.world" }
        
        if ($dws10) {
            Write-Host "CLOUDFLARE_ZONE_ID_DWS10" -ForegroundColor Cyan
            Write-Host "  $($dws10.id)" -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "⚠️  dws10.com not found" -ForegroundColor Yellow
        }
        
        if ($onelife) {
            Write-Host "CLOUDFLARE_ZONE_ID_ONELIFETIME" -ForegroundColor Cyan
            Write-Host "  $($onelife.id)" -ForegroundColor Green
            Write-Host ""
        } else {
            Write-Host "⚠️  onelifetime.world not found" -ForegroundColor Yellow
        }
        
        Write-Host "=== All Available Zones ===" -ForegroundColor Yellow
        $response.result | ForEach-Object {
            Write-Host "  $($_.name) - $($_.id)" -ForegroundColor Gray
        }
        
    } else {
        Write-Host "❌ API call failed" -ForegroundColor Red
        Write-Host $response | ConvertTo-Json
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Note ===" -ForegroundColor Cyan
Write-Host "The GitHub Actions workflow uses Bearer token method (more secure)" -ForegroundColor Gray
Write-Host "This script is for testing with email/key method" -ForegroundColor Gray
Write-Host ""

