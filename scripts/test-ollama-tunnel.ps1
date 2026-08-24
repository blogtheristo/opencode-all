# Test that Ollama is reachable via the SSH tunnel (localhost:11435 on client).
# Run this on Windows with the tunnel open: ssh -L 11435:localhost:11434 admin100@192.168.101.113
# If this fails, Cursor cannot use Ollama either. If this passes but Cursor fails, Cursor may be proxying via their backend.

$url = "http://localhost:11435/api/tags"
try {
    $r = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 5
    $n = if ($r.models) { $r.models.Count } else { 0 }
    Write-Host "OK: Tunnel works. Ollama returned $n model(s) at $url" -ForegroundColor Green
    if ($n -gt 0) {
        $r.models | ForEach-Object { Write-Host "  - $($_.name)" }
    }
    exit 0
} catch {
    Write-Host "FAIL: Cannot reach $url" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)"
    Write-Host "  Ensure: (1) SSH tunnel is open: ssh -L 11435:localhost:11434 admin100@192.168.101.113"
    Write-Host "          (2) Ollama is running on the host (systemctl status ollama)"
    exit 1
}
