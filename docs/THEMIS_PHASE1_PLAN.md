# Themis Agent Control Plane — Phase 1 Plan

**Status:** APPROVED FOR IMPLEMENTATION  
**Timeline:** 2-3 weeks (sprint-based)  
**Scale:** 50+ agents identified in DWS6 ecosystem  
**Objective:** Build foundational agent registry, selector, and health monitoring

---

## Executive Summary

**Goal:** Central orchestration for 50+ agents across Claude Code, OpenCode, Copilot, Cursor, and DGX

**Phase 1 Scope:**

1. Agent Registry — inventory all agents with metadata
2. Agent Selector — intelligent workload routing
3. Health Monitoring — detect and handle failures
4. Integration — wire into existing batch worker

**Deliverable:** Production-ready agent controller for DWS6

**Success Metric:** Can route 10+ concurrent sessions across 50+ agents without manual intervention

---

## Part 1: DWS6 Agent Inventory

### Identified Agents (50+)

**Core Processing Agents (5):**

1. Claude Code CLI — Interactive, human-driven, full context
2. OpenCode batch worker — Automated queue processing, 30-min intervals
3. Copilot GitHub CLI — Source of recovered sessions, legacy
4. Cursor / VS Code — User-driven, real-time edits
5. DGX Ollama local — Reasoning/inference without external calls

**Specialist Agents (30+):** 6. autoresearch — Background research automation 7. brain-ops — Memory/context management 8. clawdbot — Session janitor & queue manager 9. compliance-check — Security & compliance verification 10. cron-scheduler — Scheduled task execution 11. daily-task-manager — Persistent task tracking 12. design-first — Design validation & review 13. dream-on — Experimentation & A/B testing 14. edge-control-room-capital — Capital allocation simulation 15. enrich — Data enrichment pipeline 16. firehorse-report — Thesis/research reporting 17. gcr-skill — Google Cloud Registry automation 18. hilma-watch — Finnish regulatory monitoring 19. human-capital — HR/team analytics 20. ingest — Data ingestion pipeline 21. KB (knowledge-base) — Information retrieval 22. KYA — KYA standard compliance 23. learn — Learning loop & improvement 24. lsj-publish — Legal/journal publishing 25. maintain — System maintenance automation 26. material-oracle — Material/supply chain analytics 27. mgd-report — Report generation 28. multilingual — Translation & localization 29. ollama-spark — DGX Ollama interface 30. outreach-agents — Investor/partner outreach 31. product-page-polish — Landing page optimization 32. promote-proposal — Proposal promotion pipeline 33. query — Database/API querying 34. reports — Report aggregation 35. risto — CRM/contact management 36. signal-detector — Market signal detection 37. sitesense — Website analytics & monitoring 38. soul-audit — Philosophy/values alignment check 39. supermetrics-seo-sync — SEO metrics synchronization 40. swarm — Multi-agent coordination 41. token-capital — Token economics analysis 42. train-model — Model fine-tuning 43. truth-check — Fact verification

**Review & Validation (8+):** 44. code-reviewer — Staff-level code review 45. security-reviewer — Security audit 46. compliance-review — Compliance verification 47. qa-skill — Quality assurance automation 48. verify-gate — Pre-merge verification 49. design-validation — Design review gate 50. security-validation — Security gate 51. performance-reviewer — Performance benchmarking

**Infrastructure/Orchestration (5+):** 52. loop — Recurring task execution 53. schedule — Cron-based scheduling 54. workflow — Multi-agent workflow orchestration 55. clawdbot (session management) — See above 56. remote-control — Remote agent invocation

---

## Part 2: Phase 1 Architecture

### Component 1: Agent Registry

**Purpose:** Inventory of all agents with capabilities, endpoints, health status

**Data Model:**

```typescript
interface Agent {
  id: string; // "agent_001"
  name: string; // "Claude Code CLI"
  type: "interactive" | "batch" | "skill" | "review" | "orchestrator";
  platform: "claude-code" | "opencode" | "copilot" | "cursor" | "dsx" | "themis";

  // Capabilities
  capabilities: string[]; // ["code-review", "debug", "test"]
  max_concurrent: number; // 1 (Claude CLI) vs 16 (batch worker)

  // Connection
  endpoint: string; // "http://localhost:8080" or local
  protocol: "stdio" | "http" | "grpc" | "events";

  // Performance & Constraints
  timeout_ms: number; // 300000 (5 min) for interactive
  cost_per_token: number; // 0 (local) or $X
  avg_latency_ms: number; // Historical avg
  success_rate: number; // 0.95 = 95%

  // Metadata
  version: string; // "1.2.3"
  last_updated: Date;
  owner: string; // "engineering@dws6.com"
  docs_url?: string;
}
```

**File Structure:**

```
.themis/
├── registry/
│   ├── agents.json              # Master registry (50+ agents)
│   ├── capabilities.json        # Capability index
│   ├── endpoints.json           # Live endpoints
│   └── metrics.jsonl            # Historical performance
├── selector/
│   ├── rules.yaml               # Routing rules
│   └── models/
│       └── workload-classifier/ # ML model for workload type
└── health/
    ├── checks.yaml              # Health check definitions
    └── status.jsonl             # Real-time status updates
```

**Initialize with (Day 1):**

```bash
node scripts/themis-init.mjs --discover --register-all
# Scans DWS6 for all agents, auto-registers 50+
# Polls endpoints, collects current metrics
# Creates baseline registry
```

---

### Component 2: Agent Selector

**Purpose:** Intelligent routing of sessions/workloads to best agent

**Decision Logic:**

```
Incoming Session
    ↓
[Classify Workload Type]
    ├─ Code review → send to code-reviewer
    ├─ Security audit → send to security-reviewer
    ├─ Interactive coding → send to Claude Code CLI
    ├─ Batch processing → send to OpenCode batch
    └─ Skill execution → send to matching skill agent
    ↓
[Check Agent Availability]
    ├─ Is agent healthy? (health check)
    ├─ Is agent under capacity? (current load)
    └─ Does agent support this workload? (capabilities)
    ↓
[Score Candidates]
    ├─ Cost (free local > expensive API)
    ├─ Speed (latency SLA)
    ├─ Quality (success rate)
    └─ Fit (capability match)
    ↓
[Select Best]
    ├─ Primary choice (if available)
    └─ Fallback (if primary unavailable)
    ↓
[Route Session]
    └─ Acquire lock → Send to agent → Track execution
```

**Implementation (Day 2-3):**

1. **Workload Classifier:**

   ```
   Input: Session metadata (branch, title, repo, event count)
   Output: Workload type + confidence

   Types:
   - INTERACTIVE_CODING (Claude CLI)
   - BATCH_VALIDATION (OpenCode)
   - CODE_REVIEW (code-reviewer)
   - SECURITY_CHECK (security-reviewer)
   - DATA_PIPELINE (ingest/pipeline agent)
   - SKILL_EXECUTION (any skill)
   ```

2. **Agent Scorer:**

   ```
   For each available agent:
     score = (capability_match × 0.4) +
             (cost_inverse × 0.2) +
             (speed_score × 0.2) +
             (reliability × 0.2)

   Select: argmax(score)
   Fallback: next best if primary fails
   ```

3. **Integration Point:**
   ```bash
   # New handoff command
   claude handoff-to-best [--constraint claude-code|opencode|any]

   # Systemis automatically selects best agent
   # If constraint given, filters to that platform
   ```

---

### Component 3: Health Monitoring

**Purpose:** Detect agent failures, circuit-break, auto-escalate

**Health Check Types:**

1. **Liveness:** Is agent alive?

   ```
   Ping endpoint every 30 seconds
   Timeout: 5 seconds
   Threshold: 3 failures = DEAD
   ```

2. **Readiness:** Is agent ready to accept work?

   ```
   Check: Can agent process new session?
   Current load < max_concurrent
   Recent success rate > 50%
   ```

3. **Deep Health:** Is agent functioning correctly?
   ```
   Run synthetic test workload every 5 minutes
   Measure: latency, correctness, resource usage
   Alert if degraded
   ```

**Health States:**

```
           ↓
    ┌─────────────┐
    │   HEALTHY   │  (ready to accept work)
    └──────┬──────┘
           │ (fails 3 health checks)
    ┌──────▼──────┐
    │  DEGRADED   │  (accept work but route new to others)
    └──────┬──────┘
           │ (fails 5 total)
    ┌──────▼──────┐
    │    DEAD     │  (stop sending work, escalate)
    └─────────────┘
```

**Monitoring Dashboard (Day 4-5):**

```
Real-time display:
- All 50+ agents with status
- Current load per agent
- Recent success rate
- Last health check result
- Active sessions count
```

---

## Part 3: Integration Points

### Integration 1: Batch Worker

**Current:** Manual queue processing  
**Future:** Agent selector routes sessions

```
Queue (QUEUED session)
    ↓
[Session Coordinator]
    ├─ Validates session
    └─ Calls Agent Selector
    ↓
[Agent Selector]
    ├─ Classifies workload
    ├─ Scores available agents
    └─ Returns: best_agent, priority, fallbacks
    ↓
[Batch Worker]
    ├─ Acquires session lock
    ├─ Routes to selected agent
    ├─ Monitors execution
    └─ Releases on completion
```

**Code Change:**

```javascript
// BEFORE: Hardcoded target
processOne(session, CLAUDE_CODE_ENDPOINT);

// AFTER: Intelligent routing
const bestAgent = await agentSelector.select(session);
processOne(session, bestAgent.endpoint);
```

### Integration 2: Session Handoff

**Current:** Manual `claude handoff-to-batch`  
**Future:** `claude handoff-to-best` auto-selects

```bash
# User command
claude handoff-to-best

# Themis does:
workloadType = classify(currentSession)
bestAgent = selector.score([all_agents])
claimSession(bestAgent.platform)
routeSession(bestAgent.endpoint, currentSession)
```

### Integration 3: Monitoring Loop

**Current:** Manual `node scripts/session-coordinator.mjs list`  
**Future:** Real-time dashboard + alerts

```
┌──────────────────────────────────┐
│  Themis Control Plane Dashboard  │
├──────────────────────────────────┤
│ Agent Status (50+ agents)        │
│ ├─ 48 HEALTHY                    │
│ ├─ 1 DEGRADED (monitoring)       │
│ └─ 1 DEAD (escalated)            │
│                                  │
│ Active Sessions: 12/50 capacity  │
│ ├─ Claude CLI: 1                 │
│ ├─ OpenCode: 3                   │
│ ├─ Reviewer: 2                   │
│ └─ Skills: 6                      │
│                                  │
│ Recent Actions:                  │
│ ├─ Routed session_001 → Claude   │
│ ├─ Fallback agent_042 → agent_15 │
│ └─ Escalated agent_007 DEAD      │
└──────────────────────────────────┘
```

---

## Part 4: Implementation Timeline

### Week 1: Registry & Discovery

**Day 1: Audit**

- List all 50+ agents in DWS6
- Document capabilities
- Identify endpoints
- Record baseline metrics

**Day 2: Registry Implementation**

- Create `.themis/registry/agents.json`
- Build registry loader
- Connect to existing agents
- Verify connectivity

**Day 3: Auto-Discovery Script**

- `themis-discover.mjs` — scan for new agents
- `themis-register.mjs` — add agent to registry
- `themis-health-check.mjs` — baseline health

### Week 2: Selector & Routing

**Day 4: Workload Classifier**

- Define workload types (6-8 types)
- Build classifier logic
- Test on known sessions

**Day 5: Agent Scorer**

- Implement scoring algorithm
- Weight capability/cost/speed/reliability
- Test routing decisions

**Day 6: Integration**

- Wire into batch worker
- Test session routing
- Add fallback logic

### Week 3: Health Monitoring

**Day 7: Health Checks**

- Liveness check (ping)
- Readiness check (capacity)
- Deep health (synthetic test)
- State machine enforcement

**Day 8: Dashboard**

- Real-time agent status
- Session tracking
- Alert thresholds
- Metrics visualization

**Day 9: Testing & Hardening**

- Chaos tests (kill agents, overload)
- Failover scenarios
- Performance benchmarks
- Documentation

**Day 10: Deployment**

- Merge to main
- Deploy Themis controller
- Monitor for 1 week
- Gather metrics

---

## Part 5: Success Criteria

### Functional

- ✅ All 50+ agents registered and discovered
- ✅ Workload classifier works on 10+ test sessions
- ✅ Agent selector picks best agent 90%+ of the time
- ✅ Health checks detect failures within 2 minutes
- ✅ Fallback routing works on agent failures

### Performance

- ✅ Routing decision < 500ms
- ✅ Health check overhead < 5% CPU
- ✅ Can handle 10+ concurrent sessions
- ✅ Dashboard updates real-time (<1s latency)

### Reliability

- ✅ No lost sessions due to routing errors
- ✅ 99%+ session completion rate
- ✅ All agent failures properly escalated
- ✅ Audit trail of all routing decisions

### Operational

- ✅ New agents auto-discovered
- ✅ Operators can view agent status
- ✅ Clear alerts for agent failures
- ✅ Manual override possible when needed

---

## Part 6: Detailed Component Specs

### Agent Registry (`agents.json`)

**Schema:**

```json
{
  "version": "1.0.0",
  "agents": [
    {
      "id": "agent_001",
      "name": "Claude Code CLI",
      "type": "interactive",
      "platform": "claude-code",
      "capabilities": ["code-edit", "debug", "test", "repl"],
      "max_concurrent": 1,
      "endpoint": "stdio://localhost",
      "protocol": "stdio",
      "timeout_ms": 300000,
      "cost_per_token": 0,
      "avg_latency_ms": 500,
      "success_rate": 0.99,
      "version": "CLI-1.0.0",
      "owner": "engineering",
      "health": {
        "status": "HEALTHY",
        "last_check": "2026-08-27T04:00:00Z",
        "uptime_percent": 99.8
      }
    },
    {
      "id": "agent_002",
      "name": "OpenCode Batch Worker",
      "type": "batch",
      "platform": "opencode",
      "capabilities": ["code-review", "validation", "merge"],
      "max_concurrent": 16,
      "endpoint": "http://localhost:8080/batch",
      "protocol": "http",
      "timeout_ms": 600000,
      "cost_per_token": 0,
      "avg_latency_ms": 15000,
      "success_rate": 0.97,
      "version": "1.0.0",
      "owner": "infrastructure"
    }
    // ... 48 more agents
  ]
}
```

### Workload Classifier

**Input:**

```json
{
  "session_id": "copilot_deddef51-437",
  "title": "Fix PR 1851 and Merge",
  "event_count": 2463,
  "duration_hours": 7.5,
  "branch": "kya-baseline-clean",
  "repository": "blogtheristo/dws6"
}
```

**Output:**

```json
{
  "workload_type": "INTERACTIVE_CODING",
  "confidence": 0.92,
  "recommended_agents": [
    "agent_001", // Claude Code CLI (primary)
    "agent_054", // Cursor plugin (fallback)
    "agent_002" // OpenCode batch (last resort)
  ],
  "reasoning": "Long session (7.5h), high event count (2463), branch suggests active development, requires human judgment"
}
```

### Agent Selector Scoring

**Algorithm:**

```
For each agent in registry:
  capability_score = (capabilities_matched / capabilities_required) × 100
  cost_score = (1 - cost/max_cost) × 100
  speed_score = (1 - latency/max_latency) × 100
  reliability_score = success_rate × 100

  final_score = (
    capability_score × 0.40 +
    cost_score × 0.20 +
    speed_score × 0.20 +
    reliability_score × 0.20
  )

Return: sorted list by final_score desc
```

---

## Part 7: Key Files to Create

| File                                 | Purpose               | Author |
| ------------------------------------ | --------------------- | ------ |
| `.themis/registry/agents.json`       | Master agent registry | Day 2  |
| `.themis/registry/capabilities.json` | Capability index      | Day 3  |
| `scripts/themis-init.mjs`            | Initialize Themis     | Day 3  |
| `scripts/themis-discover.mjs`        | Auto-discover agents  | Day 3  |
| `scripts/themis-selector.mjs`        | Workload routing      | Day 5  |
| `scripts/themis-health.mjs`          | Health monitoring     | Day 8  |
| `scripts/themis-dashboard.mjs`       | Real-time UI          | Day 8  |
| `scripts/themis-cli.mjs`             | CLI commands          | Day 6  |
| `docs/THEMIS_ARCHITECTURE.md`        | Design doc            | Day 1  |
| `docs/THEMIS_OPERATIONS.md`          | Operations manual     | Day 9  |

---

## Part 8: Risk Mitigation

| Risk                      | Impact                   | Mitigation                              |
| ------------------------- | ------------------------ | --------------------------------------- |
| Agent not in registry     | Sessions lost            | Auto-discovery + manual fallback        |
| Classifier confidence low | Wrong agent selected     | Human override + explicit platform hint |
| All agents degraded       | Complete shutdown        | Manual operation fallback (no selector) |
| Metrics stale             | Wrong scoring            | Real-time health checks + alerts        |
| Registry conflicts        | Multiple source versions | Version control + lock-based updates    |

---

## Part 9: Success Metrics Dashboard

**Metrics to Track:**

```
Daily:
- Agent availability (% time HEALTHY)
- Session success rate (% completed)
- Average routing latency
- Fallback rate (% needed fallback)

Weekly:
- Total sessions routed
- Cost per session (weighted by agent)
- Most-used agents
- Agent reliability trends

Monthly:
- New agents added
- Agents retired/decommissioned
- Capability gaps identified
- ROI of Themis (manual vs automated)
```

---

## Approval Checklist

- [x] 50+ agents identified
- [x] Phase 1 scope defined
- [x] Timeline approved (2-3 weeks)
- [x] Success criteria set
- [x] Risk mitigation planned
- [x] Key files identified

**Ready to proceed with implementation.**

---

## Next Action

1. **Day 1 (Tomorrow):** Audit all 50+ agents → create initial registry
2. **Day 2-3:** Implement registry system → verify connectivity
3. **Day 4-6:** Build selector and routing → integrate with batch worker
4. **Day 7-9:** Health monitoring + dashboard → test failover
5. **Day 10:** Deploy Themis Phase 1 → production ready

**Estimated effort:** 200-250 person-hours (distributed across components)

**Budget impact:** Infrastructure cost for health-check polling (~$10-20/month)
