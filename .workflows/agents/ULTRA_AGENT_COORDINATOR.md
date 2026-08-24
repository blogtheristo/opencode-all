# Ultra Plan Agent Coordinator
## DWS IQ 6 - V1.0 Development Sprint

**Created:** January 3, 2026  
**Status:** 🚀 ACTIVE  
**Launch Date:** February 23, 2026 (49 days remaining)

---

## ⚡ QUICK START FOR RUNNING AGENTS (1, 7, 10)

### Check Current Status
```bash
cd ".workflows/agents"
node coordinator.cjs status
```

### Emit a Signal When You Complete a Milestone
```bash
node coordinator.cjs emit agent-07 READY:schema-users
node coordinator.cjs emit agent-01 READY:jwt-service
node coordinator.cjs emit agent-10 READY:api-docs
```

### See Detailed Instructions
See: [AGENT_SIGNAL_INSTRUCTIONS.md](AGENT_SIGNAL_INSTRUCTIONS.md)

---

## 🎯 Agent Fleet Overview

| Agent ID | Feature | Status | Phase | Dependencies |
|----------|---------|--------|-------|--------------|
| Agent-01 | DWS IQ Login System | 🟢 LAUNCHED | 1 | None |
| Agent-02 | Firehorse Apps | ⏳ WAITING | 2 | Agent-01, Agent-07 |
| Agent-03 | Customer Dashboard | ⏳ WAITING | 3 | Agent-01, Agent-02, Agent-04 |
| Agent-04 | AI Agents | ⏳ WAITING | 2 | Agent-07 |
| Agent-05 | Mobile Dashboard | ⏳ WAITING | 3 | Agent-01, Agent-02, Agent-04 |
| Agent-06 | Enterprise Integrations | 🔒 DEFERRED | V1.1 | All core agents |
| Agent-07 | Supabase Database | 🟢 LAUNCHED | 1 | None |
| Agent-08 | Payment Integration | ⏳ WAITING | 4 | Agent-01, Agent-07 |
| Agent-09 | Email System | ⏳ WAITING | 2 | Agent-07 |
| Agent-10 | Documentation | 🟢 LAUNCHED | 1 | None |

---

## 📡 Lifetime Scope Signals

### Signal Protocol

Each agent emits signals when reaching milestones. Dependent agents listen for these signals before proceeding.

```
SIGNAL FORMAT: [AGENT-XX]:[SIGNAL_TYPE]:[MILESTONE]:[TIMESTAMP]
```

### Phase 1 Signals (Foundation - No Dependencies)

#### Agent-01: Authentication
```
EMIT: [AGENT-01]:READY:jwt-service:TIMESTAMP
EMIT: [AGENT-01]:READY:auth-middleware:TIMESTAMP
EMIT: [AGENT-01]:READY:supabase-auth:TIMESTAMP      ← Unblocks Agent-02, Agent-03, Agent-05, Agent-08
EMIT: [AGENT-01]:READY:login-ui:TIMESTAMP
EMIT: [AGENT-01]:READY:oauth-google:TIMESTAMP
EMIT: [AGENT-01]:READY:oauth-microsoft:TIMESTAMP
EMIT: [AGENT-01]:COMPLETE:v1-auth:TIMESTAMP         ← Full auth system ready
```

#### Agent-07: Database
```
EMIT: [AGENT-07]:READY:schema-users:TIMESTAMP
EMIT: [AGENT-07]:READY:schema-orgs:TIMESTAMP
EMIT: [AGENT-07]:READY:rls-policies:TIMESTAMP       ← Unblocks Agent-01, Agent-02, Agent-04
EMIT: [AGENT-07]:READY:seed-data:TIMESTAMP
EMIT: [AGENT-07]:COMPLETE:v1-database:TIMESTAMP     ← Full database ready
```

#### Agent-10: Documentation
```
EMIT: [AGENT-10]:READY:api-docs:TIMESTAMP
EMIT: [AGENT-10]:READY:integration-guides:TIMESTAMP
EMIT: [AGENT-10]:COMPLETE:v1-docs:TIMESTAMP         ← All docs updated
```

### Phase 2 Signals (Core Backend - Needs Phase 1)

#### Agent-02: Firehorse Apps
```
LISTEN: [AGENT-07]:READY:rls-policies              ← Wait for DB policies
LISTEN: [AGENT-01]:READY:supabase-auth             ← Wait for auth

EMIT: [AGENT-02]:READY:report-api:TIMESTAMP        ← Report Engine API live
EMIT: [AGENT-02]:READY:automation-api:TIMESTAMP    ← Automation API live
EMIT: [AGENT-02]:READY:dms-upload:TIMESTAMP
EMIT: [AGENT-02]:COMPLETE:v1-firehorse:TIMESTAMP   ← Unblocks Agent-03, Agent-05
```

#### Agent-04: AI Agents
```
LISTEN: [AGENT-07]:READY:rls-policies              ← Wait for DB

EMIT: [AGENT-04]:READY:mcp-hub:TIMESTAMP           ← Hub coordination ready
EMIT: [AGENT-04]:READY:groq-integration:TIMESTAMP
EMIT: [AGENT-04]:READY:sitesense:TIMESTAMP
EMIT: [AGENT-04]:READY:schedulegenius:TIMESTAMP
EMIT: [AGENT-04]:READY:materialoracle:TIMESTAMP
EMIT: [AGENT-04]:READY:customersat:TIMESTAMP       ← Unblocks Agent-03, Agent-05
EMIT: [AGENT-04]:COMPLETE:v1-agents:TIMESTAMP
```

#### Agent-09: Email System
```
LISTEN: [AGENT-07]:READY:schema-users              ← Wait for user tables

EMIT: [AGENT-09]:READY:transactional:TIMESTAMP     ← Welcome, password reset
EMIT: [AGENT-09]:READY:notifications:TIMESTAMP
EMIT: [AGENT-09]:COMPLETE:v1-email:TIMESTAMP
```

### Phase 3 Signals (Frontend - Needs Phase 2)

#### Agent-03: Customer Dashboard
```
LISTEN: [AGENT-01]:READY:supabase-auth
LISTEN: [AGENT-02]:READY:report-api
LISTEN: [AGENT-04]:READY:customersat

EMIT: [AGENT-03]:READY:nextjs-setup:TIMESTAMP
EMIT: [AGENT-03]:READY:dashboard-layout:TIMESTAMP
EMIT: [AGENT-03]:READY:project-view:TIMESTAMP
EMIT: [AGENT-03]:READY:carbon-dashboard:TIMESTAMP
EMIT: [AGENT-03]:READY:agent-chat:TIMESTAMP
EMIT: [AGENT-03]:COMPLETE:v1-dashboard:TIMESTAMP
```

#### Agent-05: Mobile Dashboard
```
LISTEN: [AGENT-01]:READY:supabase-auth
LISTEN: [AGENT-02]:READY:report-api
LISTEN: [AGENT-04]:READY:mcp-hub

EMIT: [AGENT-05]:READY:expo-setup:TIMESTAMP
EMIT: [AGENT-05]:READY:redux-store:TIMESTAMP
EMIT: [AGENT-05]:READY:navigation:TIMESTAMP
EMIT: [AGENT-05]:READY:dashboard-screen:TIMESTAMP
EMIT: [AGENT-05]:READY:projects-screen:TIMESTAMP
EMIT: [AGENT-05]:READY:offline-sync:TIMESTAMP
EMIT: [AGENT-05]:COMPLETE:v1-mobile:TIMESTAMP
```

### Phase 4 Signals (Enhancements - Optional for V1.0)

#### Agent-08: Payment Integration
```
LISTEN: [AGENT-01]:COMPLETE:v1-auth
LISTEN: [AGENT-07]:COMPLETE:v1-database

EMIT: [AGENT-08]:READY:stripe-setup:TIMESTAMP
EMIT: [AGENT-08]:READY:subscription-plans:TIMESTAMP
EMIT: [AGENT-08]:READY:billing-ui:TIMESTAMP
EMIT: [AGENT-08]:COMPLETE:v1-payments:TIMESTAMP
```

#### Agent-06: Enterprise Integrations (DEFERRED to V1.1)
```
LISTEN: [AGENT-02]:COMPLETE:v1-firehorse
LISTEN: [AGENT-04]:COMPLETE:v1-agents

EMIT: [AGENT-06]:READY:sap-connector:TIMESTAMP
EMIT: [AGENT-06]:READY:bim-parser:TIMESTAMP
EMIT: [AGENT-06]:COMPLETE:v1-enterprise:TIMESTAMP
```

---

## 🚦 Launch Sequence

### Current Status (January 3, 2026)

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE 1: FOUNDATION (Parallel - No Dependencies)           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Agent-01    │  │ Agent-07    │  │ Agent-10    │          │
│  │ Auth System │  │ Database    │  │ Docs        │          │
│  │ 🟢 RUNNING  │  │ 🟢 RUNNING  │  │ 🟢 RUNNING  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 2: CORE BACKEND (After Phase 1 Signals)              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ Agent-02    │  │ Agent-04    │  │ Agent-09    │          │
│  │ Firehorse   │  │ AI Agents   │  │ Email       │          │
│  │ ⏳ WAITING  │  │ ⏳ WAITING  │  │ ⏳ WAITING  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 3: FRONTEND (After Phase 2 APIs Ready)               │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │ Agent-03    │  │ Agent-05    │                           │
│  │ Web Dashboard│  │ Mobile App │                           │
│  │ ⏳ WAITING  │  │ ⏳ WAITING  │                           │
│  └─────────────┘  └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  PHASE 4: ENHANCEMENTS (Optional for V1.0)                  │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │ Agent-08    │  │ Agent-06    │                           │
│  │ Payments    │  │ Enterprise  │                           │
│  │ ⏳ OPTIONAL │  │ 🔒 V1.1     │                           │
│  └─────────────┘  └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 Signal Log

### Emitted Signals

| Timestamp | Agent | Signal | Status |
|-----------|-------|--------|--------|
| 2026-01-03T10:00 | Agent-01 | LAUNCHED | ✅ |
| 2026-01-03T10:00 | Agent-07 | LAUNCHED | ✅ |
| 2026-01-03T10:00 | Agent-10 | LAUNCHED | ✅ |

### Pending Signals

| Agent | Waiting For | Expected |
|-------|-------------|----------|
| Agent-02 | Agent-07:READY:rls-policies | Jan 4-5 |
| Agent-02 | Agent-01:READY:supabase-auth | Jan 6-7 |
| Agent-04 | Agent-07:READY:rls-policies | Jan 4-5 |
| Agent-09 | Agent-07:READY:schema-users | Jan 4 |

---

## ⚡ Quick Commands

### Launch Phase 2 (When Phase 1 Signals Received)

```
# After [AGENT-07]:READY:rls-policies AND [AGENT-01]:READY:supabase-auth

Launch: Agent-02 (Firehorse Apps)
Launch: Agent-04 (AI Agents)
Launch: Agent-09 (Email System)
```

### Launch Phase 3 (When Phase 2 APIs Ready)

```
# After [AGENT-02]:READY:report-api AND [AGENT-04]:READY:customersat

Launch: Agent-03 (Customer Dashboard)
Launch: Agent-05 (Mobile Dashboard)
```

### Check Status

```
# Query all agent statuses
GET: /agents/status

# Query specific signal
GET: /signals/[AGENT-XX]/[SIGNAL_TYPE]
```

---

## 🎯 V1.0 Completion Criteria

All agents must emit their `COMPLETE:v1-*` signal for V1.0 launch:

| Agent | Completion Signal | Required for V1.0 |
|-------|-------------------|-------------------|
| Agent-01 | COMPLETE:v1-auth | ✅ YES |
| Agent-02 | COMPLETE:v1-firehorse | ✅ YES |
| Agent-03 | COMPLETE:v1-dashboard | ✅ YES |
| Agent-04 | COMPLETE:v1-agents | ✅ YES |
| Agent-05 | COMPLETE:v1-mobile | 🟡 TestFlight OK |
| Agent-06 | COMPLETE:v1-enterprise | ❌ V1.1 |
| Agent-07 | COMPLETE:v1-database | ✅ YES |
| Agent-08 | COMPLETE:v1-payments | 🟡 Optional |
| Agent-09 | COMPLETE:v1-email | ✅ YES |
| Agent-10 | COMPLETE:v1-docs | ✅ YES |

---

## 📊 Progress Tracking

### Daily Standup Template

```markdown
## Agent Status Report - [DATE]

### Phase 1 (Foundation)
- Agent-01 (Auth): [STATUS] - [LAST_SIGNAL]
- Agent-07 (DB): [STATUS] - [LAST_SIGNAL]
- Agent-10 (Docs): [STATUS] - [LAST_SIGNAL]

### Phase 2 (Backend)
- Agent-02 (Firehorse): [STATUS] - Waiting for: [SIGNALS]
- Agent-04 (AI Agents): [STATUS] - Waiting for: [SIGNALS]
- Agent-09 (Email): [STATUS] - Waiting for: [SIGNALS]

### Phase 3 (Frontend)
- Agent-03 (Dashboard): [STATUS] - Waiting for: [SIGNALS]
- Agent-05 (Mobile): [STATUS] - Waiting for: [SIGNALS]

### Blockers
- [LIST ANY BLOCKERS]

### Next 24h Goals
- [EXPECTED SIGNALS TO EMIT]
```

---

**Document Version:** 1.0  
**Last Updated:** January 3, 2026  
**Status:** 🚀 ACTIVE - Phase 1 Running
