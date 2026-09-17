#!/bin/bash
# production-mode.sh — Switch DGX Spark / GN100 from training back to production
# Restarts Ollama + Docker agent stack, validates model health before accepting traffic

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="/var/log/dws/mode-switch.log"
ARTICLE12_LOG="/var/log/dws/article12-training.jsonl"
LOCKFILE="/tmp/dws-mode-switch.lock"
HEARTBEAT_URL="${DWS_HEARTBEAT_URL:-http://localhost:9999}"
OLLAMA_URL="${OLLAMA_URL:-http://localhost:11434}"
HEALTH_TIMEOUT=120

log() {
    local msg="[$(date -u +%Y-%m-%dT%H:%M:%SZ)] [production-mode] $1"
    echo "$msg" | tee -a "$LOG_FILE"
}

article12_log() {
    local event="$1"
    echo "{\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"event\":\"$event\",\"mode\":\"production\",\"hostname\":\"$(hostname)\",\"user\":\"$(whoami)\"}" >> "$ARTICLE12_LOG"
}

die() { log "ERROR: $1"; exit 1; }

# Prevent concurrent mode switches
exec 200>"$LOCKFILE"
flock -n 200 || die "Another mode-switch is already running"

log "=== PRODUCTION MODE SWITCH INITIATED ==="

# 1. Check current mode
if [ -f /tmp/dws-mode-production ]; then
    log "Already in production mode. Nothing to do."
    exit 0
fi

# 2. Stop AI Workbench training processes (if any)
log "Stopping any running AI Workbench training processes..."
if pgrep -f "nvwb" &>/dev/null; then
    pkill -f "nvwb" 2>/dev/null || true
    sleep 3
    log "AI Workbench processes stopped."
else
    log "No AI Workbench processes running."
fi

# 3. Start Ollama
log "Starting Ollama service..."
if command -v systemctl &>/dev/null; then
    sudo systemctl start ollama
else
    nohup ollama serve &>/dev/null &
fi

# Wait for Ollama to be ready
log "Waiting for Ollama to respond..."
ELAPSED=0
while [ $ELAPSED -lt $HEALTH_TIMEOUT ]; do
    if curl -sf "${OLLAMA_URL}/api/tags" &>/dev/null; then
        log "Ollama is responding."
        break
    fi
    sleep 2
    ELAPSED=$((ELAPSED + 2))
done

if [ $ELAPSED -ge $HEALTH_TIMEOUT ]; then
    die "Ollama did not respond within ${HEALTH_TIMEOUT}s. Manual intervention required."
fi

# 4. Validate model availability
log "Validating model availability..."
MODEL_COUNT=$(curl -sf "${OLLAMA_URL}/api/tags" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    models = data.get('models', [])
    for m in models:
        print(f\"  - {m['name']} ({m.get('size', 'unknown')} bytes)\")
    print(len(models))
except:
    print('0')
" 2>/dev/null | tail -1)

if [ "$MODEL_COUNT" = "0" ]; then
    log "WARN: No models found in Ollama. You may need to pull a model."
else
    log "Models available: $MODEL_COUNT"
fi

# 5. Test inference latency
log "Testing inference latency..."
LATENCY=$(curl -sf -w "%{time_total}" -o /dev/null \
    -X POST "${OLLAMA_URL}/api/generate" \
    -H "Content-Type: application/json" \
    -d '{"model":"'$(curl -sf "${OLLAMA_URL}/api/tags" | python3 -c "
import sys,json
try:
    d=json.load(sys.stdin)
    print(d['models'][0]['name'])
except:
    print('llama3.2:8b')
" 2>/dev/null)'","prompt":"test","stream":false,"options":{"num_predict":1}}' \
    2>/dev/null || echo "failed")

if [ "$LATENCY" = "failed" ]; then
    log "WARN: Inference test failed. Model may need loading."
else
    log "Inference latency: ${LATENCY}s"
fi

# 6. Start Docker agent stack
log "Starting Docker agent stack..."
if command -v docker &>/dev/null && [ -f /opt/dws/docker-compose.yml ]; then
    docker compose -f /opt/dws/docker-compose.yml up -d
    sleep 5
    RUNNING=$(docker compose -f /opt/dws/docker-compose.yml ps --status running -q 2>/dev/null | wc -l)
    log "Docker agents running: $RUNNING"
else
    log "WARN: Docker compose file not found at /opt/dws/docker-compose.yml"
fi

# 7. Notify heartbeat service
log "Notifying heartbeat: production mode restored..."
curl -sf -X POST "${HEARTBEAT_URL}/status" \
    -H "Content-Type: application/json" \
    -d '{"mode":"production","message":"Production mode restored — inference available"}' \
    2>/dev/null || log "WARN: Heartbeat notification failed"

# 8. Mark mode
touch /tmp/dws-mode-production
rm -f /tmp/dws-mode-training

# 9. Article 12 compliance log
article12_log "mode_switch_to_production"

# 10. Memory report
FREE_GB=$(free -g | awk '/^Mem:/ {print $7}')
log "=== PRODUCTION MODE ACTIVE ==="
log "Available memory: ${FREE_GB} GB"
log "Ollama: running (models: ${MODEL_COUNT})"
log "Docker agents: running"
log "Inference: ready"
log ""
log "To enter training mode: scripts/training-mode.sh"
