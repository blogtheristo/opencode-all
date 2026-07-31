# scripts/test-revolut.ps1

# Koska skripti ajetaan juuresta, .env pitäisi löytyä nykyisestä sijainnista
$envPath = "./.env"

Write-Host "--- Revolut API Testi ---" -ForegroundColor Cyan

# 1. Tarkistetaan löytyykö .env tiedosto
if (Test-Path $envPath) {
    Write-Host "✅ Luetaan asetukset tiedostosta: $envPath"
    Get-Content $envPath | ForEach-Object {
        $line = $_.Trim()
        # Ohitetaan tyhjät rivit ja kommentit
        if ($line -and -not $line.StartsWith("#")) {
            $name, $value = $line -split '=', 2
            if ($name -and $value) {
                # Poistetaan mahdolliset lainausmerkit
                $value = $value.Trim().Trim("'").Trim('"')
                # Asetetaan muuttuja PowerShell-istuntoon
                Set-Variable -Name "ENV_$($name.Trim())" -Value $value
            }
        }
    }
} else {
    Write-Host "❌ Virhe: .env-tiedostoa ei löytynyt projektin juuresta!" -ForegroundColor Red
    Write-Host "Varmista, että olet projektin juurikansiossa, kun ajat skriptin."
    exit
}

# 2. Haetaan tarvittavat muuttujat
$baseUrl = $ENV_REVOLUT_API_URL
$apiKey = $ENV_REVOLUT_SECRET_KEY

if (-not $apiKey) {
    Write-Host "❌ REVOLUT_SECRET_KEY puuttuu .env-tiedostosta!" -ForegroundColor Red
    exit
}

# Varmistetaan URL:n muoto (poistetaan loppuslash jos on)
$baseUrl = $baseUrl.TrimEnd('/')
$testUrl = "$baseUrl/payment-links"

# Näytetään debug-tietoa (maskattu avain tietoturvan vuoksi)
$maskedKey = $apiKey.Substring(0, 7) + "..." + $apiKey.Substring($apiKey.Length - 4)
Write-Host "📍 Testataan osoitetta: $testUrl"
Write-Host "🔑 Avain alkaa: $($apiKey.Substring(0, 7))"

# 3. Valmistellaan otsikot
$headers = @{
    "Authorization" = "Bearer $apiKey"
    "Revolut-Api-Version" = "2024-09-01"
    "Accept" = "application/json"
}

# 4. Tehdään testi-kutsu
try {
    Write-Host "🚀 Lähetetään kutsu..." -NoNewline
    $response = Invoke-RestMethod -Uri $testUrl -Method Get -Headers $headers
    Write-Host " Valmis!" -ForegroundColor Green
    
    Write-Host "`n✅ Yhteys onnistui!" -ForegroundColor Green
    Write-Host "Löytyi $($response.Count) kpl olemassa olevia maksulinkkejä."
    
    if ($response.Count -gt 0) {
        Write-Host "`nEsimerkki ensimmäisestä linkistä:"
        $response[0] | ConvertTo-Json -Depth 2
    }
} catch {
    Write-Host " VIRHE!" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $status = [int]$_.Exception.Response.StatusCode
        Write-Host "Statuskoodi: $status" -ForegroundColor Yellow
        
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Palvelimen vastaus: $errorBody" -ForegroundColor White
    } else {
        Write-Host "Yhteysvirhe: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n--- Testi päättynyt ---" -ForegroundColor Cyan