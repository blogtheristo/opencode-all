# Simple script to get Cloudflare Zone IDs
# Run: .\get-zone-ids-simple.ps1

$token = "7apODsrHxfUvglqyYxqwVJo2501ZqTILJWIJv3zT"
$email = "risto.paarni@lifetime.fi"

Write-Host "`n=== Fetching Cloudflare Zones ===" -ForegroundColor Cyan
Write-Host "Email: $email" -ForegroundColor Gray
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer $token"
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
        
        Write-Host "CLOUDFLARE_API_TOKEN" -ForegroundColor Cyan
        Write-Host "  $token" -ForegroundColor Green
        Write-Host ""
        
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
    Write-Host $_.Exception | Format-List
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Copy the Zone IDs above" -ForegroundColor White
Write-Host "2. Go to: https://github.com/blogtheristo/dws6/settings/secrets/actions" -ForegroundColor White
Write-Host "3. Add the 3 secrets listed above" -ForegroundColor White
Write-Host ""

