#!/bin/bash
# training-mode.sh — Switch DGX Spark / GN100 from production to training mode
# Frees ~70 GB memory by stopping Ollama + Docker agent stack for QLoRA training
# Safety: refuses if active inference requests are in-flight

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/dws/mode-switch.log"
ARTICLE12_LOG="/var/log/dws/article12-training.jsonl"
LOCKFILE="/tmp/dws-mode-switch.lock"
HEARTBEAT_URL="${DWS_HEARTBEAT_URL:-http://localhost:9999}"
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"

log() {
    local msg="[$(date -u +%Y-%m-%dT%H:%M:%SZ)] [training-mode] $1"
    echo "$msg" | tee -a "$LOG_FILE"
}

article12_log() {
    local event="$1"
    echo "{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"event\":\"$event\",\"mode\":\"training\",\"hostname\":\"$(hostname)\",\"user\":\"$(whoami)\"}" >> "$ARTICLE12_LOG"
}

die() { log "ERROR: $1"; exit 1; }

# Prevent concurrent mode switches
exec 200>"$LOCKFILE"
flock -n 200 || die "Another mode-switch is already running"

log "=== TRAINING MODE SWITCH INITIATED ==="

# 1. Check current mode
if [ -f /tmp/dws-mode-training ]; then
    log "Already in training mode. Nothing to do."
    exit 0
fi

# 2. Check for active inference requests
log "Checking for active inference requests..."
ACTIVE=$(curl -sf "${OLLAMA_URL}/api/ps" 2>/dev/null | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    models = data.get('models', [])
    print(len(models))
except:
    print('0')
" 2>/dev/null || echo "0")

if [ "$ACTIVE" != "0" ] && [ "$ACTIVE" != "" ]; then
    die "Refusing to switch: $ACTIVE active inference request(s) in-flight. Wait or cancel them first."
fi

# 3. Notify heartbeat service
log "Notifying heartbeat: entering training mode..."
curl -sf -X POST "${HEARTBEAT_URL}/status" \
    -H "Content-Type: application/json" \
    -d '{"mode":"training","message":"Entering training mode — inference unavailable"}' \
    2>/dev/null || log "WARN: Heartbeat notification failed (continuing anyway)"

# 4. Stop Docker agent stack
log "Stopping Docker agent stack..."
if command -v docker &>/dev/null; then
    docker compose -f /opt/dws/docker-compose.yml down --timeout 30 2>/dev/null || \
        log "WARN: Docker compose down failed (may not be running)"
fi

# 5. Stop Ollama
log "Stopping Ollama service..."
if systemctl is-active --quiet ollama 2>/dev/null; then
    sudo systemctl stop ollama
    log "Ollama stopped."
elif pgrep -x ollama &>/dev/null; then
    pkill -x ollama
    sleep 2
    log "Ollama process killed."
else
    log "Ollama was not running."
fi

# 6. Verify memory freed
log "Verifying memory availability..."
FREE_GB=$(free -g | awk '/^Mem:/ {print $7}')
log "Available memory: ${FREE_GB} GB"

if [ "$FREE_GB" -lt 60 ]; then
    log "WARN: Less than 60 GB free. Training may be constrained."
fi

# 7. Mark mode
touch /tmp/dws-mode-training
rm -f /tmp/dws-mode-production

# 8. Article 12 compliance log
article12_log "mode_switch_to_training"

log "=== TRAINING MODE ACTIVE ==="
log "Memory available: ${FREE_GB} GB"
log "Ollama: stopped"
log "Docker agents: stopped"
log "AI Workbench: ready for QLoRA training"
log ""
log "To return to production: scripts/production-mode.sh"
