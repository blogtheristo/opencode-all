@echo off
title DWS6 + DGX Spark + Claude CLI
cd /d F:\2026\Repos2026\dws6

echo [1/3] Starting SSH tunnel to DGX Spark (Ollama on port 11435)...
start /B ssh -f -N -L 11435:localhost:11434 admin100@192.168.101.113

echo [2/3] Waiting for tunnel...
timeout /t 3 /nobreak >nul

echo [3/3] Verifying Ollama connection...
curl -s http://localhost:11435/api/tags >nul 2>&1
if %errorlevel%==0 (
    echo ✓ Ollama tunnel active — Qwen available at http://localhost:11435
) else (
    echo ⚠ Tunnel may not be ready yet — check SSH key auth
)

echo.
echo Starting Claude CLI...
claude
