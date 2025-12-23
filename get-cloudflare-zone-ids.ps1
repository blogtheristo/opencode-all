# Cloudflare Zone ID Finder
# Run this script to get your Zone IDs

$token = "7apODsrHxfUvglqyYxqwVJo2501ZqTILJWIJv3zT"

Write-Host "Testing Cloudflare API token..." -ForegroundColor Cyan

# Test token
$verifyResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/user/tokens/verify" `
    -Method Get `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

if ($verifyResponse.success) {
    Write-Host "✅ Token is valid!" -ForegroundColor Green
    Write-Host "Token ID: $($verifyResponse.result.id)" -ForegroundColor Gray
    Write-Host "Token Status: $($verifyResponse.result.status)" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host "❌ Token verification failed!" -ForegroundColor Red
    exit
}

Write-Host "Fetching zones..." -ForegroundColor Cyan

# Get all zones
$zonesResponse = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones" `
    -Method Get `
    -Headers @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

if ($zonesResponse.success) {
    Write-Host ""
    Write-Host "=== Zone IDs ===" -ForegroundColor Yellow
    Write-Host ""
    
    $targetZones = $zonesResponse.result | Where-Object { 
        $_.name -eq "dws10.com" -or $_.name -eq "onelifetime.world" 
    }
    
    if ($targetZones) {
        foreach ($zone in $targetZones) {
            Write-Host "Domain: $($zone.name)" -ForegroundColor White
            Write-Host "Zone ID: $($zone.id)" -ForegroundColor Green
            Write-Host ""
        }
        
        Write-Host "=== GitHub Secrets to Add ===" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1. CLOUDFLARE_API_TOKEN" -ForegroundColor Cyan
        Write-Host "   Value: $token" -ForegroundColor Gray
        Write-Host ""
        
        $dws10Zone = $targetZones | Where-Object { $_.name -eq "dws10.com" }
        if ($dws10Zone) {
            Write-Host "2. CLOUDFLARE_ZONE_ID_DWS10" -ForegroundColor Cyan
            Write-Host "   Value: $($dws10Zone.id)" -ForegroundColor Gray
            Write-Host ""
        }
        
        $onelifeZone = $targetZones | Where-Object { $_.name -eq "onelifetime.world" }
        if ($onelifeZone) {
            Write-Host "3. CLOUDFLARE_ZONE_ID_ONELIFETIME" -ForegroundColor Cyan
            Write-Host "   Value: $($onelifeZone.id)" -ForegroundColor Gray
            Write-Host ""
        }
    } else {
        Write-Host "⚠️  Could not find dws10.com or onelifetime.world zones" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "All available zones:" -ForegroundColor Cyan
        foreach ($zone in $zonesResponse.result) {
            Write-Host "  - $($zone.name) (ID: $($zone.id))" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "❌ Failed to fetch zones" -ForegroundColor Red
}

