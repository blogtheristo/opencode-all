$email = "risto.paarni2024@lifetime.fi"
$apiKey = "963818c29a1e7dffa002b596228230e6bbdb4"

$headers = @{
    "X-Auth-Email" = $email
    "X-Auth-Key" = $apiKey
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://api.cloudflare.com/client/v4/zones" -Method Get -Headers $headers
    
    if ($response.success) {
        $dws10 = $response.result | Where-Object { $_.name -eq "dws10.com" }
        $onelife = $response.result | Where-Object { $_.name -eq "onelifetime.world" }
        
        $result = @"
=== Cloudflare Zone IDs ===

dws10.com Zone ID: $($dws10.id)
onelifetime.world Zone ID: $($onelife.id)

=== GitHub Secrets to Add ===

1. CLOUDFLARE_API_TOKEN
   Value: 7apODsrHxfUvglqyYxqwVJo2501ZqTILJWIJv3zT

2. CLOUDFLARE_ZONE_ID_DWS10
   Value: $($dws10.id)

3. CLOUDFLARE_ZONE_ID_ONELIFETIME
   Value: $($onelife.id)

"@
        
        $result | Out-File -FilePath "zone-ids-final.txt" -Encoding utf8
        Write-Host $result
    }
} catch {
    "Error: $($_.Exception.Message)" | Out-File -FilePath "zone-ids-final.txt" -Encoding utf8
    Write-Host "Error: $($_.Exception.Message)"
}

