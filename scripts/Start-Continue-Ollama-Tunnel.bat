@echo off
setlocal EnableExtensions

REM =============================================================================
REM Start Continue + Ollama SSH Tunnel (Windows)
REM Opens SSH tunnel in a dedicated PowerShell window, then launches Cursor.
REM Repo root = parent of this script's directory (no hardcoded drive/path).
REM =============================================================================

pushd "%~dp0.."
set "REPO_PATH=%CD%"
popd
set "REMOTE_SSH=admin100@192.168.101.113"
set "LOCAL_PORT=11435"
set "REMOTE_PORT=11434"
set "TAGS_URL=http://localhost:%LOCAL_PORT%/api/tags"

echo [INFO] Opening tunnel watchdog window...
start "DWS6 Ollama Tunnel Watchdog" pwsh -NoExit -ExecutionPolicy Bypass -File "%REPO_PATH%\scripts\Start-OllamaTunnel-Watchdog.ps1" -RemoteSsh "%REMOTE_SSH%" -LocalPort %LOCAL_PORT% -RemotePort %REMOTE_PORT%

echo [INFO] Waiting for tunnel on %TAGS_URL% ...
set /a ATTEMPT=0

:wait_for_tunnel
set /a ATTEMPT+=1
powershell -NoProfile -Command "try { Invoke-RestMethod -Uri '%TAGS_URL%' -Method Get -TimeoutSec 2 | Out-Null; exit 0 } catch { exit 1 }"
if %errorlevel%==0 goto tunnel_ready
if %ATTEMPT% GEQ 15 goto tunnel_timeout
timeout /t 1 /nobreak >nul
goto wait_for_tunnel

:tunnel_ready
echo [OK] Tunnel is reachable at %TAGS_URL%.
echo [INFO] Full Continue checks: pwsh -NoProfile -File "%REPO_PATH%\scripts\Test-Continue-OllamaTunnel.ps1"
echo [INFO] Config template: %REPO_PATH%\docs\continue-ollama-tunnel.yaml
goto launch_cursor

:tunnel_timeout
echo [WARN] Tunnel did not respond within 15 seconds.
echo [WARN] Continuing to launch Cursor anyway. Keep the tunnel window open.

:launch_cursor
if exist "%LOCALAPPDATA%\Programs\cursor\Cursor.exe" (
    start "" "%LOCALAPPDATA%\Programs\cursor\Cursor.exe" "%REPO_PATH%"
    echo [OK] Cursor started via Cursor.exe.
    goto end
)

where cursor >nul 2>nul
if %errorlevel%==0 (
    start "" cursor "%REPO_PATH%"
    echo [OK] Cursor started via cursor CLI.
    goto end
)

echo [WARN] Could not find Cursor executable automatically.
echo [INFO] Open Cursor manually. Continue Ollama apiBase: http://127.0.0.1:%LOCAL_PORT%  ^(see docs\continue-ollama-tunnel.yaml^)
start "" "%REPO_PATH%"

:end
echo [INFO] Done.
endlocal
