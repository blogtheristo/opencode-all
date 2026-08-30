# DGX Spark Deployment & Operations Guide

---

## VERSION AND AGENT HISTORY

| Version | Agent                        | Date       | Change                                                                                                   |
| ------- | ---------------------------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| 1.0     | Claude Code + GitHub Copilot | 2026-08-13 | Initial DGX Spark deployment, operation, and failover procedures. Phase 2 of OpenCode-primary migration. |

**Document Status:** ACTIVE | **Last Modified:** 2026-08-13 | **Languages Available:** English

---

## Overview

This guide covers installation, operation, health checks, and manual failover procedures for DGX Spark as the primary runtime for OpenCode development in DWS IQ 6.

**Platform:** NVIDIA DGX Spark (Grace Blackwell, 1 PFLOPS FP4, 128 GB LPDDR5x, 20-core Arm)  
**Deployment:** tmux-based service on Linux/Unix (persistent across disconnects)  
**Primary Use:** Local NVIDIA NIM inference, long-running agents, scheduled jobs  
**Failover:** Manual via `.claude/handoffs/<branch>.md` (documented procedure §Failover)

## Installation

### Prerequisites

- DGX Spark hardware (20-core Arm, 128 GB LPDDR5x)
- NVIDIA CUDA Toolkit 12.x and cuDNN 8.x
- NVIDIA NIM microservices framework
- Docker 24.x+ (for containerized NIM services)
- Git 2.40+
- Bash 4.0+

### Step 1: Base System Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y \
  build-essential curl wget git tmux \
  python3-dev python3-pip python3-venv \
  docker.io nvidia-container-toolkit

# Add user to docker group (avoid sudo for docker)
sudo usermod -aG docker $USER
newgrp docker

# Verify NVIDIA driver and compute capability
nvidia-smi
```

### Step 2: Clone Repository & Set Up Environment

```bash
# Clone the dws6 repository
git clone https://github.com/blogtheristo/dws6.git
cd dws6

# Create Python virtualenv for local tools
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip setuptools wheel

# Install project dependencies
npm install
pip install -r requirements.txt  # if exists
pip install -r Firehorse/requirements.txt  # Python agents
```

### Step 3: Configure NVIDIA NIM Services

Create `./scripts/dgx-nim-start.sh`:

```bash
#!/bin/bash
# Start NVIDIA NIM microservices on DGX Spark
set -e

DGX_PORT=8080
DGX_HOST="0.0.0.0"

echo "[DGX] Starting NVIDIA NIM services..."

# Image pinning is mandatory. A mutable :latest tag on a container that runs
# with --gpus all and receives NGC_API_KEY means a compromised or rotated
# upstream tag silently gains GPU access and the key on the next restart.
# Resolve the digest once, verify it, then pin it here:
#   docker buildx imagetools inspect nvcr.io/nvidia/nim:<version> --format '{{.Manifest.Digest}}'
#   cosign verify nvcr.io/nvidia/nim@<digest> --certificate-identity-regexp '.*' \
#     --certificate-oidc-issuer-regexp '.*'
# Record the digest and its verification date in docs/field-notes/ when bumping.
NIM_IMAGE="${NIM_IMAGE:?set NIM_IMAGE to a digest-pinned nvcr.io/nvidia/nim@sha256:... reference}"
HEALTH_IMAGE="${HEALTH_IMAGE:?set HEALTH_IMAGE to a digest-pinned alpine@sha256:... reference}"

# Start NIM inference service (example: LLaMA)
docker run -d \
  --name=nim-llama \
  --gpus all \
  -e NGC_API_KEY="${NGC_API_KEY}" \
  -p ${DGX_PORT}:8000 \
  "${NIM_IMAGE}" \
  --model-repository=/opt/nim/models \
  --backend=vllm

# Start health check service
docker run -d \
  --name=nim-health \
  -p 8081:8081 \
  -v /tmp/dgx-health:/logs \
  --restart=unless-stopped \
  "${HEALTH_IMAGE}" \
  sh -c "while true; do curl -s http://localhost:8000/v1/models || echo 'unhealthy' >> /logs/health.txt; sleep 10; done"

echo "[DGX] NIM services started. Listening on :${DGX_PORT}"
docker ps | grep nim
```

Make it executable:

```bash
chmod +x scripts/dgx-nim-start.sh
./scripts/dgx-nim-start.sh
```

## Operation

### Running DGX Services in tmux

DGX services must persist across terminal disconnects. Use tmux:

```bash
# Create persistent tmux session
tmux new-session -d -s dws6-dgx \
  -x 200 -y 50 \
  -c "$HOME/dws6"

# Window 0: NIM services
tmux send-keys -t dws6-dgx:0 "bash scripts/dgx-nim-start.sh" Enter

# Window 1: Health monitor
tmux new-window -t dws6-dgx:1 -n monitor
tmux send-keys -t dws6-dgx:1 "watch -n 5 'nvidia-smi; docker ps | grep nim'" Enter

# Window 2: Log tail
tmux new-window -t dws6-dgx:2 -n logs
tmux send-keys -t dws6-dgx:2 "tail -f /tmp/dgx-health/health.txt" Enter

# Attach/detach
tmux attach -t dws6-dgx      # Attach
tmux detach -t dws6-dgx      # Detach (Ctrl-B d inside tmux)
tmux kill-session -t dws6-dgx  # Shutdown
```

### Health Checks

```bash
# Check NIM service status
curl -s http://localhost:8080/v1/models | jq .

# Check DGX resource usage
nvidia-smi --query-gpu=index,name,driver_version,memory.total,memory.used \
  --format=csv,noheader

# Check Docker container health
docker ps --format "table {{.Names}}\t{{.Status}}" | grep nim

# Manual DGX health check (add to crontab or scheduled job)
#!/bin/bash
HEALTH_FILE="/tmp/dgx-health-$(date +%s).txt"
if curl -s http://localhost:8080/v1/health > /dev/null 2>&1; then
  echo "OK" > "$HEALTH_FILE"
  exit 0
else
  echo "FAIL: NIM service unreachable" > "$HEALTH_FILE"
  exit 1
fi
```

### Metrics & Logging

Create `scripts/dgx-metrics.sh` for periodic health capture:

```bash
#!/bin/bash
# Capture DGX metrics every 60 seconds
LOG_DIR="/tmp/dgx-logs"
mkdir -p "$LOG_DIR"

while true; do
  TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  nvidia-smi --query-gpu=utilization.gpu,utilization.memory,memory.used,temperature.gpu \
    --format=csv,nounits,noheader >> "$LOG_DIR/gpu-metrics.csv"
  docker stats --no-stream nim-llama >> "$LOG_DIR/docker-stats.txt"
  sleep 60
done
```

Run in tmux window or as background service.

## Failover Procedure

### When to Failover

Failover to Claude Code is triggered by:

1. **DGX service down:** `curl http://localhost:8080/v1/health` returns error or timeout
2. **Resource exhaustion:** GPU memory full, CPU at 100% for >5 min
3. **Network split:** DGX unreachable from development machine
4. **Scheduled job failure:** Job fails after 2 automatic health-check retries

### Manual Failover Steps

**Goal:** Switch active session from OpenCode (DGX) to Claude Code with full state preservation.

#### Step 1: Document the Failure

Update `.claude/handoffs/<current-branch>.md` with incident log:

```markdown
## Failover Event — 2026-08-13 14:32:45 UTC

**Trigger:** DGX NIM service unreachable (http://localhost:8080/v1/health timeout)  
**Symptom:** `curl: (7) Failed to connect to localhost port 8080: Connection refused`  
**Duration:** ~5 minutes  
**Root Cause (preliminary):** GPU memory OOM (nvidia-smi shows 100% utilization)  
**Action:** Switching to Claude Code for this branch  
**Resume Branch:** `claude/claude-code-migration-plan-g24eht`  
**Session Status:** All uncommitted work: `git stash save "failover: $(date -u +%s)"`

### Investigation (Post-Failover)

- [ ] Check DGX logs: `docker logs nim-llama | tail -100`
- [ ] Review GPU memory: `nvidia-smi -i 0 -q -d memory`
- [ ] Inspect failed job output: `.opencode/failover.log`
- [ ] Document findings in field note: `docs/field-notes/2026-08-13-dgx-failover-incident.md`
```

#### Step 2: Stash Work & Prepare for Switch

```bash
# Save uncommitted changes to a named stash (do NOT discard)
git stash save "failover backup: $(date -u +%s)"

# Verify clean working tree
git status  # should show "working tree clean"

# Record current commit hash
git rev-parse HEAD > /tmp/failover-commit.txt
```

#### Step 3: Switch Platforms

**In Claude Code session:**

1. Open this repository
2. Check out the same branch: `git checkout <branch-name>`
3. Verify you're at the same commit:
   ```bash
   git log -1 --oneline
   # should match what was in /tmp/failover-commit.txt on DGX
   ```
4. If stashed work exists, restore it:
   ```bash
   git stash pop  # or: git stash apply (if unsure)
   ```
5. Continue work on Claude Code

#### Step 4: Diagnose DGX Issue (Parallel)

While work resumes on Claude Code, diagnose DGX:

```bash
# Logs
docker logs nim-llama 2>&1 | tee /tmp/dgx-diagnosis.log | tail -50

# GPU state
nvidia-smi -i 0 -q -d memory,temperature,power
nvidia-smi dmon -s pucme

# Restart NIM service (if safe)
docker restart nim-llama
sleep 10
curl -s http://localhost:8080/v1/health && echo "Service recovered" || echo "Still down"

# If recovered, notify team and prepare to resume on OpenCode
```

#### Step 5: Resume on OpenCode (When DGX Recovers)

```bash
# On Claude Code: stash work again
git stash save "resuming on OpenCode: $(date -u +%s)"

# On DGX/OpenCode: pull latest, restore stash, and resume
git fetch origin <branch-name>
git checkout -B <branch-name> origin/<branch-name>
git stash pop

# Verify no conflicts
git status

# Resume work on OpenCode
```

### Automatic Recovery Attempts (Scheduled Jobs Only)

Scheduled jobs on DGX retry automatically before failing:

```bash
# In .opencode/opencode.json
"failover": {
  "health_check_auto_retry": true,
  "health_check_retry_count": 2,
  "health_check_retry_interval_seconds": 5,
  "platform_switch_mode": "manual",
  ...
}
```

**Behavior:**

- Job detects DGX unavailable (health check fails)
- Retries health check 2 times with 5-second backoff
- If still unavailable after 2 retries, **job fails with ERROR** (does not auto-switch)
- Human then follows §Manual Failover Steps above

**Why not auto-switch:** Automatic switching can lose job state, logs, and partial results. Manual switch with git stash ensures state is captured.

## Decommissioning / Shutdown

To safely shut down DGX services:

```bash
# Stop all NIM containers
docker stop $(docker ps | grep nim | awk '{print $1}')

# Remove tmux session
tmux kill-session -t dws6-dgx

# Verify everything stopped
docker ps | grep nim  # should output nothing
ps aux | grep dgx    # should output nothing (except grep itself)
```

## Related Documents

- `docs/CLAUDE_CODE_MIGRATION_STRATEGY.md` — OpenCode-primary strategy
- `AGENTS.md` §1 — runtime selection decision table
- `AI_AGENT_GUIDELINES.md` §1a — failover procedure rules
- `.claude/handoffs/<branch>.md` — per-branch session state (git-persisted)

---

**Questions?** See `Admin/ADMIN_MANUAL.md` or file an issue in `.claude/handoffs/` directory.
