#requires -Version 7.0
<#
.SYNOPSIS
    Verifies SSH Ollama tunnel + OpenAI-compatible API for Continue (Cursor).

.DESCRIPTION
    1) GET  /api/tags (Ollama)
    2) POST /v1/chat/completions (what Continue uses for chat)
    3) Optionally checks %USERPROFILE%\.continue\config.yaml for matching apiBase

.EXAMPLE
    pwsh -NoProfile -File .\scripts\Test-Continue-OllamaTunnel.ps1
.EXAMPLE
    pwsh -NoProfile -File .\scripts\Test-Continue-OllamaTunnel.ps1 -Model qwen3-coder:30b -VerboseConfigCheck
#>

param(
    [string]$BaseUrl = "http://127.0.0.1:11435",
    [string]$Model = "qwen3-coder:30b",
    [switch]$VerboseConfigCheck
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$base = $BaseUrl.TrimEnd('/')

function Write-Step {
    param([string]$Msg)
    Write-Host "`n=== $Msg ===" -ForegroundColor Cyan
}

Write-Step "Target: $base"

# --- 1) Tags ---
Write-Step "GET /api/tags"
try {
    $tags = Invoke-RestMethod -Uri "$base/api/tags" -Method Get -TimeoutSec 10
}
catch {
    Write-Host "FAILED: tunnel may be down or wrong port. Start: pwsh -File scripts/Start-OllamaTunnel-Watchdog.ps1" -ForegroundColor Red
    throw $_
}

$names = @($tags.models | ForEach-Object { $_.name })
$sample = ($names | Select-Object -First 5) -join ', '
Write-Host "OK — $($names.Count) model(s). Sample: $sample" -ForegroundColor Green

$haveModel = $names | Where-Object { $_ -eq $Model -or $_ -like "$Model*" }
if (-not $haveModel) {
    Write-Host "WARN: Model '$Model' not listed. Pull on the Ollama host or pick a name from the list above." -ForegroundColor Yellow
}
else {
    Write-Host "OK — model '$Model' is available." -ForegroundColor Green
}

# --- 2) Chat completions (Continue path) ---
Write-Step "POST /v1/chat/completions (minimal)"
$body = @{
    model       = $Model
    messages    = @(@{ role = "user"; content = "Reply with exactly: OK_TUNNEL_TEST" })
    temperature = 0
    max_tokens  = 64
} | ConvertTo-Json -Depth 6 -Compress

try {
    $chat = Invoke-RestMethod -Uri "$base/v1/chat/completions" -Method Post -TimeoutSec 120 `
        -ContentType "application/json; charset=utf-8" `
        -Headers @{ Authorization = "Bearer ollama" } `
        -Body $body
}
catch {
    Write-Host "FAILED: Continue chat will not work until this succeeds." -ForegroundColor Red
    throw $_
}

$content = $chat.choices[0].message.content
Write-Host "OK — reply snippet: $($content.Substring(0, [Math]::Min(120, $content.Length)))..." -ForegroundColor Green

# --- 3) Optional: config.yaml hint ---
$cfg = Join-Path $env:USERPROFILE ".continue\config.yaml"
Write-Step "Continue config"
if (Test-Path $cfg) {
    Write-Host "Found: $cfg" -ForegroundColor DarkGray
    $raw = Get-Content -Path $cfg -Raw -ErrorAction SilentlyContinue
    if ($raw) {
        $port = if ($base -match ':(\d+)') { $Matches[1] } else { "11435" }
        if ($raw -match "127\.0\.0\.1:$port" -or $raw -match "localhost:$port") {
            Write-Host "OK — config mentions apiBase on port $port." -ForegroundColor Green
        }
        else {
            Write-Host "WARN: config may not point at $base — merge docs/continue-ollama-tunnel.yaml" -ForegroundColor Yellow
        }
        if ($VerboseConfigCheck) {
            Write-Host $raw.Substring(0, [Math]::Min(2000, $raw.Length))
        }
    }
}
else {
    Write-Host "MISSING: $cfg" -ForegroundColor Yellow
    Write-Host "Create it (or merge) using docs/continue-ollama-tunnel.yaml" -ForegroundColor Yellow
}

Write-Host "`nDone. In Cursor: Continue → select model 'Qwen3-Coder 30B (tunnel)' (or your name)." -ForegroundColor Cyan
