# Themis Control Plane Impact Analysis — Branch: claude/themis-control-plane-impact-dxvrh2

**Session:** 2026-08-30 | **Analysis:** Latest PR Impact on Themis Agent Orchestration  
**Status:** Checkpoint 1 — Impact Assessment Complete

---

## Executive Summary

Three recent commits (last 7 days) materially change the Themis control plane architecture:

1. **MCP Hub Refactor (e785dbb, 2026-08-29)** — Modular task routing + observability layer
2. **Cosmos 3 Edge LWM Integration (6b1d708, 2026-08-29)** — Procurement domain added to control plane
3. **Agent Registry Snapshot (2026-08-27)** — 3 critical agents reporting DEAD status

---

## Impact Detail

### 1. MCP Hub Refactor: Structural & Routing Changes

**What Changed:**

- Split 1385-line `server.py` into 7 focused modules:
  - `routing.py` (142 lines): AgentTask class + MCP_SERVERS registry + async execution
  - `observability.py` (245 lines): Redis streams + Supabase logging + fallback JSONL
  - `workflows.py` (203 lines): Fan-out, sequential, pipeline, reflection patterns
  - `review.py` (101 lines): Gemini code-review HIL automation
  - `sandbox.py` (116 lines): OpenSandbox MCP endpoints
  - `pipelines/bim_carbon.py` (126 lines): Domain-specific BIM-Carbon pipeline
  - `llm_mesh.py`: Federated LLM registry (unchanged)

**Control Plane Impact:**

- ✅ **Positive**: Modular design allows independent agent testing; observability now decoupled from routing
- ⚠️ **Requires**: MCP_SERVERS registry must be kept in sync when agents join/leave Themis
- ⚠️ **Requires**: Redis/Supabase initialization now separate from request path; startup order matters
- ✅ **Enabled**: Redis streams (`agent:tasks`, `agent:results`) now feed observability pipeline

**Critical Dependency:**

- `routing.AgentTask` now validates endpoints against `MCP_SERVERS` base URLs — agents with hardcoded endpoints will fail

---

### 2. Cosmos 3 Edge LWM: Procurement Domain Integration

**What Changed:**

- New Supabase migration `084_contracts_lifecycle.sql` — adds contract state machine
- 4 new daily/hourly procurement scripts added to `scripts/daily/`:
  - `bid-archive-expired.sh`
  - `bid-expiry-check.sh`
- Procurement monitoring agent at `scripts/procurement-monitor.mjs` with CLI integration
- Admin procurement reference: `docs/ADMIN_PROCUREMENT_MONITORING.md` (676 lines)
- Procurement MCP server placeholder in routing registry

**Control Plane Impact:**

- ✅ **Enabled**: Procurement workflows now routable through Themis via `lwm-mcp` endpoint
- ⚠️ **Requires**: Migration 084 must be applied before procurement agent can write to `contracts_lifecycle`
- ⚠️ **Requires**: `procurement-monitor.mjs` is a standalone script — not yet integrated into agent orchestrator loop
- ⚠️ **Added complexity**: Procurement domain introduces new agent dependencies (Cloudia auth integration, bid scout)

---

### 3. Agent Registry: 3 Critical Services Down

**Registry File:** `.themis/registry/agents.json` (timestamp: 2026-08-27T17:55:48.584Z)

| Agent                 | ID        | Type         | Status   | Issue                                                    |
| --------------------- | --------- | ------------ | -------- | -------------------------------------------------------- |
| OpenCode Batch Worker | agent_002 | batch        | **DEAD** | Uptime 0%, Load 8.64, Latency 59ms — unresponsive        |
| DGX Ollama Local      | agent_005 | reasoning    | **DEAD** | Uptime 0%, Load 5.03, Latency 2ms — kernel/network issue |
| Remote Control        | agent_045 | orchestrator | **DEAD** | Uptime 0%, Load 12.63, Latency -1ms — connection refused |

**Cascading Impact:**

- **DGX Ollama down**: Reasoning workloads (model training, inference) blocked; fallback to Claude API required
- **Batch Worker down**: Code review & validation cannot scale beyond 1 concurrent task
- **Remote Control down**: Distributed execution across environments offline; all multi-machine workflows grounded

**Healthy Count:** 42/45 agents (93% availability, but 3 critical paths blocked)

---

## Risk Assessment

### HIGH Risk

1. **Agent Registry Stale** — Last health check 2026-08-27; current date 2026-08-30 → 72h without fresh state
   - May have recovered (DEAD agents might be back online) or gotten worse
   - Registry-driven routing decisions use stale health data
   - **Action:** Re-run health check via `Themis.health()` API before routing to DEAD agents

2. **MCP_SERVERS Hardcoded URLs** — `/routing.py` line 13–25
   - Endpoints must match registered base URLs exactly
   - No discovery mechanism; URLs must be manually synced
   - **Action:** Make MCP server discovery dynamic (consul/etcd/env-var-based) to reduce coupling

3. **Procurement Migration Not Applied** — Migration 084 exists but no confirmation it ran
   - Procurement agent will crash on `INSERT` to `contracts_lifecycle` if migration not applied
   - **Action:** Confirm migration 084 applied in production before routing procurement tasks

### MEDIUM Risk

1. **Observability Fallback Chain** — If Redis + Supabase both down, logs go to `/mcp-hub/agent_activity.jsonl`
   - Fallback JSONL can grow unbounded
   - **Action:** Implement rotation/truncation for fallback log

2. **Procurement Script Coupling** — `procurement-monitor.mjs` runs standalone, not orchestrated by Themis
   - Missed by scheduler if Themis is down
   - **Action:** Integrate into `Schedule` orchestrator (agent_042) with cron entry

---

## Recommendations

### Immediate (Next Session)

- [ ] Re-run `.themis/registry/agents.json` health check; update registry with current state
- [ ] Confirm migration 084 applied; add verification step to deployment pipeline
- [ ] Audit MCP_SERVERS registry against actual running services

### Short-term (This Week)

- [ ] Create `Themis.health()` API that re-checks all agents and updates registry
- [ ] Integrate `procurement-monitor.mjs` into `Schedule` orchestrator
- [ ] Add observability logs to Grafana dashboard (Prometheus at `localhost:9091` already in registry)

### Medium-term (Next Sprint)

- [ ] Replace hardcoded MCP_SERVERS with service discovery (Consul/K8s DNS/env-driven)
- [ ] Add circuit breaker to `routing.AgentTask` to gracefully degrade when agents DEAD
- [ ] Implement Redis stream consumer group validation on startup

---

## Files Affected by PRs

**MCP Hub Refactor:**

- New: `mcp-hub/routing.py`, `mcp-hub/observability.py`, `mcp-hub/workflows.py`, `mcp-hub/review.py`, `mcp-hub/sandbox.py`, `mcp-hub/pipelines/bim_carbon.py`
- Modified: `mcp-hub/server.py` (1385 → 200 lines), `mcp-hub/llm_mesh.py` (no change)

**Cosmos 3 Edge LWM:**

- New: `supabase/migrations/084_contracts_lifecycle.sql`
- New: `scripts/daily/bid-archive-expired.sh`, `scripts/daily/bid-expiry-check.sh`
- New: `scripts/procurement-monitor.mjs`
- New: `docs/ADMIN_PROCUREMENT_MONITORING.md`

**Registry:**

- Active: `.themis/registry/agents.json` (45 agents, last update 2026-08-27)

---

## Next Steps

1. **Verify Agent Health** — Call Themis health endpoint to refresh registry
2. **Test Routing** — Send test task through `routing.AgentTask` for each MCP server
3. **Procurement Readiness** — Confirm migration 084 applied, test procurement workflow end-to-end
4. **Document Runbook** — Add to `docs/CLAUDE.md` or `AGENTS.md` how to recover DEAD agents
