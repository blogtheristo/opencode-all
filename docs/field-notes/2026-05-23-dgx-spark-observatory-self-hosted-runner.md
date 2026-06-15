# Field Note: DGX Spark Observatory — Self-Hosted Runner, OTel Fix, State Observer, and gcloud Windows Bug

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/aspire-isolated-mode-research-IXTT0 | Date: 23.05.2026 | Changes: Initial field note documenting the DGX Spark Observatory session — registered GitHub Actions self-hosted runner on DGX Spark, fixed OTel protocol mismatch (gRPC→HTTP), built state-observer service with drift detection, created local dashboard, fixed gcloud Windows path bug in secret-loader.ts

Session Links & References:

- PR: https://github.com/blogtheristo/dws6/pull/1384
- webframp article: https://webframp.com/posts/you-were-never-declaring-state/
- Aspire Dashboard: mcr.microsoft.com/dotnet/aspire-dashboard:13.3.5
- GitHub Actions runner docs: https://github.com/actions/runner
- Related field note: docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md

Document Status:

- Created: 23.05.2026
- Last Modified: 23.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Infrastructure / Observability

***

## 1. Context

DGX Spark (Acer Veriton GN100, NVIDIA Grace Blackwell GB10, 128 GB, ARM64, Ubuntu 24.04) serves as the primary 24/7 agent and cron runtime for DWS IQ. GitHub Actions is the failover — if DGX Spark misses a heartbeat, GHA picks up the cron schedules.

PR #1117 had CI checks running on GitHub-hosted `ubuntu-latest`. The question was: why not run them on DGX Spark itself?

Answer: because DGX Spark had never been registered as a self-hosted runner. It was only a Docker host for backend, cron, Redis, OpenClaw, heartbeat, and Aspire Dashboard containers.

## 2. Changes Made

### 2.1 Self-Hosted GitHub Actions Runner

Registered DGX Spark as a self-hosted runner with labels `self-hosted,arm64,dgx-spark,ubuntu-24.04`.

**Files:**
- `infrastructure/dgx-spark/setup-github-runner.sh` — reproducible install script (downloads runner v2.325.0 ARM64, configures, installs as user-level systemd service)
- `infrastructure/dgx-spark/runner-health.sh` — tiny bash HTTP server on port 9800 that checks `pgrep -f "Runner.Listener"` and returns JSON health status

**Workflow changes** (4 files, all `runs-on: ubuntu-latest` → `runs-on: [self-hosted, dgx-spark]`):
- `.github/workflows/ci-audit-verify.yml`
- `.github/workflows/test-on-pr.yml` (2 jobs: test + lint-check)
- `.github/workflows/claude-auto-fix.yml`
- `.github/workflows/security-check-pr.yml`

Runner confirmed online via `gh api repos/blogtheristo/dws6/actions/runners` — 16h+ uptime at time of writing.

### 2.2 OTel Protocol Mismatch Fix

**Root cause:** `src/observability/otel.ts` uses `@opentelemetry/exporter-trace-otlp-http` (HTTP protocol), but `docker-compose.yml` pointed both `dws-backend` and `dws-cron` to port 18889 (Aspire's gRPC ingestion port) with `OTEL_EXPORTER_OTLP_PROTOCOL: grpc`.

**Fix in `infrastructure/dgx-spark/docker-compose.yml`:**
- `OTEL_EXPORTER_OTLP_ENDPOINT`: `http://aspire-dashboard:18889` → `http://aspire-dashboard:18888`
- `OTEL_EXPORTER_OTLP_PROTOCOL`: `grpc` → `http/protobuf`

This would have caused all OTel traces to silently fail once the SDK was activated. Caught before production impact.

### 2.3 State Observer (Inspired by webframp.com)

New service inspired by the article "You Were Never Declaring State" — instead of declaring what state should be, observe what state IS and produce typed, versioned, schema-validated snapshots.

**File:** `infrastructure/dgx-spark/state-observer.ts`

Captures a `StateSnapshot` every 60 seconds:

| Layer | What it observes | How |
|-------|-----------------|-----|
| System | CPU load, memory, disk, GPU utilization | `/proc/loadavg`, `/proc/meminfo`, `df`, `nvidia-smi` |
| Containers | Name, status, health, restarts, memory | `docker ps`, `docker stats`, `docker inspect` |
| Runner | Online/offline, PID | `pgrep -f "Runner.Listener"` |
| Ollama | Model inventory, up/down | `curl localhost:11434/api/tags` |
| Services | Backend, cron, heartbeat, Aspire | HTTP health checks with latency |
| Redis | Up/down | TCP PING/PONG probe (not HTTP — Redis speaks its own protocol) |

**Drift detection rules:**
- Memory > 90% → critical
- Disk > 85% → warn
- GitHub runner offline → warn
- Any service down → warn (backend down = critical)
- Expected Ollama models missing → warn
- Container restart count > 5 → warn

Snapshots persisted to JSONL files in `/app/state/snapshots/` with 7-day retention.

**HTTP API:**
- `GET /state/latest` — current snapshot
- `GET /state/drift` — drift signals only
- `GET /state/history?date=YYYY-MM-DD` — last 60 snapshots for a given day
- `GET /dashboard` — serves the HTML dashboard
- `GET /health` — health check

### 2.4 Observatory Dashboard

**File:** `infrastructure/dgx-spark/dashboard.html`

Self-contained HTML dashboard (zero external dependencies) with dark theme. Auto-refreshes every 15 seconds from `/state/latest`.

Sections:
- 4 system gauges (CPU, Memory, Disk, GPU) with color-coded thresholds (green/amber/red)
- Services grid with latency indicators
- GitHub Actions runner status with label tags
- Ollama model inventory
- Containers table (name, status, health, memory, restarts, uptime)
- Drift signal alerts
- Memory sparkline (last hour from `/state/history`)

Accessible at `http://dgx-spark:9801/dashboard` when the stack is running.

### 2.5 Heartbeat Expansion

**File:** `infrastructure/dgx-spark/heartbeat.ts`

Added two new health checks to the heartbeat service:
- `CHECK_RUNNER`: `http://host.docker.internal:9800/healthz` (runner-health.sh)
- `CHECK_STATE_OBSERVER`: `http://state-observer:9801/health`

Heartbeat now monitors 7 services (was 5): backend, cron, Ollama, Redis, OpenClaw, Aspire, GitHub runner, state-observer.

### 2.6 gcloud Windows Path Bug Fix

**File:** `src/config/secret-loader.ts` (line 155)

**Bug:** `execFileAsync('gcloud', [...])` fails on Windows because the actual executable is `gcloud.cmd`. Node's `execFile` does not resolve `.cmd` extensions via PATH on Windows (unlike `exec` which uses the shell).

**Fix:**
```typescript
const bin =
  process.env.GCLOUD_BIN ||
  (process.platform === 'win32' ? 'gcloud.cmd' : 'gcloud');
const { stdout } = await execFileAsync(bin, [...]);
```

Supports `GCLOUD_BIN` env var override for non-standard install paths.

## 3. docker-compose.yml Changes Summary

Updated to Code-Version 1.2.0. Key additions:

```yaml
# New service — uses Docker Engine REST API, not CLI
# No host port mapping — only reachable within dws-network
state-observer:
  build: { context: ., dockerfile: Dockerfile.heartbeat }
  entrypoint: ["node", "--experimental-strip-types", "/app/state-observer.ts"]
  group_add: ["${DOCKER_GID:-999}"]   # host docker group for socket access
  volumes:
    - ./state-observer.ts:/app/state-observer.ts:ro
    - ./dashboard.html:/app/dashboard.html:ro
    - state-snapshots:/app/state/snapshots
    - /var/run/docker.sock:/var/run/docker.sock:ro

# New volume
state-snapshots:

# Heartbeat additions
CHECK_RUNNER: http://host.docker.internal:9800/healthz
CHECK_STATE_OBSERVER: http://state-observer:9801/health
```

### 3.1 Security Review Fixes

Five issues caught in code review and fixed:

1. **State observer network exposure.** Port 9801 was mapped to all host interfaces, exposing system resource data, container inventory, runner PID, and model list without authentication. Fixed by removing host port mapping — now only reachable within the Docker network. Dashboard access via SSH tunnel.

2. **Redis false-positive drift.** `checkService('redis', 'http://redis:6379')` tried HTTP against Redis's TCP protocol, always returning "down." Replaced with a TCP PING/PONG probe (`checkRedis`) using `net.Socket`.

3. **runner-health.sh not installed.** `setup-github-runner.sh` installed only the runner service but not the companion health probe. Heartbeat checked `:9800/healthz`, which was always closed. Fixed by adding runner-health systemd unit installation (including netcat dependency check) to the setup script.

4. **Untrusted PR code on self-hosted runner.** `test-on-pr.yml`, `security-check-pr.yml`, and `claude-auto-fix.yml` ran PR-triggered jobs on DGX Spark, exposing the host's filesystem, Docker socket, network, and local credentials to arbitrary PR code. Reverted all four workflow files to `ubuntu-latest`. Self-hosted runner remains available for trusted push-triggered workflows.

5. **Auto-fix with write permissions.** `claude-auto-fix.yml` had `contents: write` and checked out the PR branch on DGX Spark with the Anthropic API key available. Reverted to GitHub-hosted runner.

## 4. Architecture After This Session

```
┌─────────────────────────────────────────────────────────────┐
│ DGX Spark (Acer Veriton GN100, ARM64, Ubuntu 24.04)        │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Backend  │  │   Cron   │  │ Firehorse│  │  OpenClaw   │  │
│  │  :8080   │  │          │  │  :8084   │  │   :8090     │  │
│  └────┬─────┘  └────┬─────┘  └──────────┘  └────────────┘  │
│       │              │                                       │
│       │    OTel (HTTP/protobuf)                              │
│       ▼              ▼                                       │
│  ┌──────────────────────┐   ┌───────────────────────────┐   │
│  │  Aspire Dashboard    │   │   State Observer           │   │
│  │  :18888 (UI + OTLP)  │   │   :9801                    │   │
│  └──────────────────────┘   │   /state/latest             │   │
│                              │   /state/drift              │   │
│  ┌──────────┐  ┌──────────┐ │   /dashboard                │   │
│  │  Redis   │  │Heartbeat │ └───────────────────────────┘   │
│  │  :6379   │  │  :9999   │                                  │
│  └──────────┘  └────┬─────┘  ┌───────────────────────────┐  │
│                      │        │  GitHub Actions Runner     │  │
│                      │        │  (systemd, user-level)     │  │
│                      │        │  runner-health :9800       │  │
│                      │        └───────────────────────────┘  │
│                      │                                       │
│  Ollama (host-native, :11434)                               │
│  Models: nemotron-3-super, qwen3-coder:30b                  │
└──────────────────────────────────────────────────────────────┘
          │
          ▼ heartbeat POST
┌─────────────────────┐
│ GitHub Actions       │
│ (failover cron)      │
│ CI on [self-hosted,  │
│  dgx-spark]          │
└─────────────────────┘
```

## 5. Lessons

1. **Protocol alignment matters.** An HTTP OTel exporter pointed at a gRPC port will silently drop all telemetry. Always verify the wire protocol matches across the stack.

2. **Observe, do not declare.** The state-observer pattern from webframp works well for a single-node setup. Typed snapshots with drift detection surface real problems faster than static health checks.

3. **User-level systemd is enough.** The GitHub Actions runner and runner-health service run as user-level systemd units — no sudo required, no root daemons, clean separation from Docker.

4. **Windows `.cmd` resolution.** Node's `execFile` does not shell-expand `.cmd` extensions. Any cross-platform CLI invocation (`gcloud`, `az`, `aws`) should use the `.cmd` suffix on `win32` or allow a `*_BIN` env var override.

5. **Docker socket access from slim containers.** The state-observer reuses `Dockerfile.heartbeat` (node:22-slim, unprivileged `dws` user). Shelling out to `docker ps` / `docker stats` would fail — no Docker CLI installed and no socket group membership. Fixed by using Docker Engine REST API over the mounted Unix socket (`http.request` with `socketPath`) and adding `group_add: ["${DOCKER_GID:-999}"]` to compose. No CLI binary needed, no root, read-only socket mount preserved.

6. **Self-hosted runners and untrusted PRs.** A persistent self-hosted runner executing `npm ci` and test scripts from untrusted PR checkouts exposes the entire host to attacker-controlled code. PR-triggered CI must stay on ephemeral GitHub-hosted runners. Self-hosted is safe for push-triggered workflows on trusted branches only.

7. **Protocol-aware health checks.** HTTP `fetch()` against `redis:6379` always fails because Redis speaks RESP, not HTTP. Every service check must speak the target's wire protocol — TCP PING for Redis, HTTP GET for HTTP services.

## 6. Follow-ups

- [ ] Deploy updated docker-compose.yml to DGX Spark (`docker compose up -d --build`)
- [ ] Run `setup-github-runner.sh` on DGX Spark (already done, runner online)
- [ ] Install `runner-health.sh` as systemd service on DGX Spark
- [ ] Verify Aspire Dashboard receives OTel traces after backend restart
- [ ] Monitor state-observer drift signals for first 48 hours
- [ ] Consider pushing drift signals to Slack/webhook for alerting
