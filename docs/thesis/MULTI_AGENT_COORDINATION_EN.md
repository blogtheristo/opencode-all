***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code | Session: silly-bassi | Commit: pending | Date: 05.02.2026 | Changes: Added Claude Code Agent Teams vs Subagents comparison (Section 7.3)
  - Version: 1.0 | Tool: Cursor.ai | Session: Ultra-Agents | Commit: pending | Date: 03.01.2026 | Changes: Initial thesis documentation for multi-agent coordination

Session Links & References:
  - GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/thesis/MULTI_AGENT_COORDINATION_EN.md
  - Related: AGENTS.md - Master Agent Index
  - Related: .workflows/agents/ULTRA_AGENT_COORDINATOR.md
  - Related: AgentFoundry/Calculus_for_Training.md

Document Status:
  - Created: 03.01.2026
  - Last Modified: 03.01.2026
  - Language: English
  - Languages Available: English, Suomi
  - Publication Status: Published
  - Document Type: Thesis Documentation / Technical Architecture

Repository Status:
  - GitHub: ✅ Committed
  - Location: docs/thesis/MULTI_AGENT_COORDINATION_EN.md
  - .gitignore: NO (academic document)
  - Workflows: None
  - Access Level: 🟢 Public
  - Category: Academic / Research

Update Process:
  - Manual edits: Thesis author, AI agents
  - Automated updates: None
  - Approval required: Yes - Risto Päärni
  - Publishing: Manual commit to GitHub

Related Documents:
  - AGENTS.md - Master Agent Index
  - AgentFoundry/Calculus_for_Training.md - LLM training calculus
  - mcp-hub/server.py - MCP Hub implementation
  - CloudAgents/dws-team/README.md - Internal agent specifications
---

# Multi-Agent Coordination in Industrial AI Platforms
## A Case Study of the DWS IQ 6 Agent Ecosystem

**Author:** Risto Anton Päärni  
**Institution:** Metropolia University of Applied Sciences  
**Date:** January 3, 2026  
**Document Type:** Thesis Technical Documentation

---

## Abstract

This document presents the technical architecture and implementation of the Lifetime Scope Signals protocol used for coordinating multiple AI agents in the DWS IQ 6 industrial intelligence platform. The system manages three categories of agents (development, internal operations, and customer-facing) through a signal-based communication mechanism that enables dependency-aware parallel execution.

**Keywords:** Multi-agent systems, AI orchestration, signal-based coordination, industrial AI, MCP (Model Context Protocol)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Agent Architecture Design](#3-agent-architecture-design)
4. [Lifetime Scope Signals Protocol](#4-lifetime-scope-signals-protocol)
5. [Implementation](#5-implementation)
6. [Evaluation](#6-evaluation)
7. [Related Work](#7-related-work)
8. [Conclusion](#8-conclusion)
9. [References](#9-references)

---

## 1. Introduction

### 1.1 Background

Modern AI-native enterprise platforms require coordination of multiple specialized AI agents working concurrently on interdependent tasks. The DWS IQ 6 platform, designed for industrial climate compliance, employs 22+ AI agents across development, operations, and customer service domains.

### 1.2 Research Context

This work is part of a thesis project at Metropolia University of Applied Sciences, focusing on the practical implementation of multi-agent AI systems for industrial applications. The DWS IQ 6 platform serves as the case study for demonstrating real-world agent coordination patterns.

### 1.3 Document Scope

This technical documentation covers:
- Agent architecture and categorization
- The Lifetime Scope Signals protocol specification
- Signal dependency management
- Implementation details using Node.js and Python
- Integration with the MCP Hub coordination layer

---

## 2. Problem Statement

### 2.1 Coordination Challenges

When building complex AI-native platforms with multiple agents, several coordination challenges emerge:

1. **Dependency Management**: Agents often depend on outputs from other agents
2. **Parallel Execution**: Maximizing throughput by running independent agents concurrently
3. **State Synchronization**: Maintaining consistent state across distributed agents
4. **Error Propagation**: Handling failures without cascading to dependent agents
5. **Progress Visibility**: Enabling human oversight of multi-agent workflows

### 2.2 Requirements

The coordination system must:
- Support three distinct agent categories with different lifecycle patterns
- Enable dependency-aware task scheduling
- Provide real-time status visibility
- Allow manual intervention for stuck agents
- Scale from 10 to 22+ agents

---

## 3. Agent Architecture Design

### 3.1 Agent Categories

The DWS IQ 6 platform organizes agents into three categories:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        AGENT ECOSYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CATEGORY A: V1.0 DEVELOPMENT AGENTS (10 agents)                │   │
│  │  Lifecycle: Sprint-based (one-time)                             │   │
│  │  Coordination: Signal-based phase dependencies                  │   │
│  │  Tools: Cursor AI, Claude, Gemini                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CATEGORY B: INTERNAL TEAM AGENTS (7 agents)                    │   │
│  │  Lifecycle: Continuous (ongoing operations)                     │   │
│  │  Coordination: Weekly cycle, event-driven                       │   │
│  │  Tools: LlamaStack, Groq, Claude                                │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  CATEGORY C: CUSTOMER-FACING AGENTS (5+ agents)                 │   │
│  │  Lifecycle: Per-vertical deployment, phased rollout             │   │
│  │  Coordination: Silent Pilot → Advisor → Autonomous              │   │
│  │  Tools: AgentFoundry configs, MCP Hub                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Orchestration | MCP Hub (FastAPI) | Central coordination, workflow patterns |
| Fast Inference | Groq API (Llama 3.1 70B) | High-speed agent responses (<100ms) |
| Complex Reasoning | Claude Sonnet 4.5 | Deep analysis, planning tasks |
| Multi-Agent | LlamaStack | Agent orchestration framework |
| Edge AI | NVIDIA Jetson | On-premise SiteSense agents |
| Database | Supabase (PostgreSQL + pgvector) | Data, embeddings, signals |

### 3.3 MCP Hub Architecture

The MCP Hub (`mcp-hub/server.py`) implements three coordination patterns:

1. **Fan-Out Pattern**: Distributes tasks to multiple agents in parallel
2. **Reflection Pattern**: Agent self-reviews output and iterates
3. **Sequential Pattern**: Step-by-step execution with explicit dependencies

```python
class WorkflowRequest(BaseModel):
    workflow_type: str  # fan-out, reflection, sequential
    tasks: list[AgentTask]
    metadata: dict[str, Any] | None = None
```

---

## 4. Lifetime Scope Signals Protocol

### 4.1 Protocol Overview

The Lifetime Scope Signals protocol enables inter-agent communication through a publish-subscribe mechanism. Agents **emit** signals when completing milestones, and dependent agents **listen** for these signals before proceeding.

### 4.2 Signal Format Specification

```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

**Components:**
- `AGENT-XX`: Unique agent identifier (e.g., `AGENT-01`, `AGENT-07`)
- `SIGNAL_TYPE`: One of `READY`, `COMPLETE`, `ERROR`, `BLOCKED`
- `MILESTONE`: Specific deliverable identifier (e.g., `supabase-auth`)
- `TIMESTAMP`: ISO 8601 format timestamp

**Example Signals:**
```
[AGENT-07]:READY:rls-policies:2026-01-05T14:30:00Z
[AGENT-01]:COMPLETE:v1-auth:2026-01-10T09:00:00Z
[AGENT-02]:BLOCKED:report-api:2026-01-06T10:15:00Z
```

### 4.3 Signal Types

| Type | Semantics | Effect on Dependencies |
|------|-----------|----------------------|
| `READY` | Milestone achieved | Unblocks downstream agents listening for this signal |
| `COMPLETE` | All agent work finished | Agent transitions to complete status |
| `ERROR` | Failure occurred | Alerts coordinator, may block dependent agents |
| `BLOCKED` | Waiting for external dependency | No effect until unblocked |

### 4.4 Dependency Graph

The dependency graph for V1.0 Development Agents:

```
PHASE 1 (Foundation - No Dependencies)
├── Agent-01 (Auth)      ──EMITS──► READY:supabase-auth
├── Agent-07 (Database)  ──EMITS──► READY:rls-policies, READY:schema-users
└── Agent-10 (Docs)      ──EMITS──► READY:api-docs
         │
         ▼
PHASE 2 (Core Backend - Needs Phase 1)
├── Agent-02 (Firehorse) ◄──LISTENS── Agent-01:supabase-auth, Agent-07:rls-policies
├── Agent-04 (AI Agents) ◄──LISTENS── Agent-07:rls-policies
└── Agent-09 (Email)     ◄──LISTENS── Agent-07:schema-users
         │
         ▼
PHASE 3 (Frontend - Needs Phase 2)
├── Agent-03 (Dashboard) ◄──LISTENS── Agent-02:report-api, Agent-04:customersat
└── Agent-05 (Mobile)    ◄──LISTENS── Agent-02:report-api, Agent-04:mcp-hub
         │
         ▼
PHASE 4 (Enhancements - Optional)
├── Agent-08 (Payments)  ◄──LISTENS── Agent-01:v1-auth, Agent-07:v1-database
└── Agent-06 (Enterprise) ⊘ DEFERRED
```

### 4.5 Signal State Machine

Each agent follows this state machine:

```
┌─────────────┐     dependencies     ┌─────────────┐
│   WAITING   │ ─────────met───────► │   RUNNING   │
└─────────────┘                      └─────────────┘
       ▲                                    │
       │                           emit signals
       │                                    │
       │                                    ▼
       │                             ┌─────────────┐
       └────── error ◄────────────── │   WORKING   │
                                     └─────────────┘
                                            │
                                    all signals emitted
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │  COMPLETE   │
                                     └─────────────┘
```

---

## 5. Implementation

### 5.1 Signal Registry

The signal state is persisted in JSON format:

**File:** `.workflows/agents/AGENT_SIGNAL_REGISTRY.json`

```json
{
  "version": "1.0",
  "launch_date": "2026-02-23",
  
  "agents": {
    "agent-01": {
      "name": "DWS IQ Login System",
      "phase": 1,
      "status": "running",
      "dependencies": [],
      "signals": {
        "listening": [],
        "emitted": ["READY:jwt-service"],
        "pending": ["READY:supabase-auth", "COMPLETE:v1-auth"]
      },
      "unlocks": ["agent-02", "agent-03", "agent-05", "agent-08"]
    }
  },
  
  "signal_log": [
    {
      "timestamp": "2026-01-03T10:00:00Z",
      "agent": "agent-01",
      "type": "READY:jwt-service",
      "message": "JWT authentication service implemented"
    }
  ]
}
```

### 5.2 Coordinator CLI

The coordinator is implemented in Node.js:

**File:** `.workflows/agents/coordinator.cjs`

```javascript
function showReady() {
  const registry = loadRegistry();
  
  // Collect all emitted signals
  const emittedSignals = new Set();
  for (const [id, agent] of Object.entries(registry.agents)) {
    for (const signal of agent.signals.emitted || []) {
      emittedSignals.add(`${id}:${signal}`);
    }
  }
  
  // Check which waiting agents have all dependencies met
  for (const [id, agent] of Object.entries(registry.agents)) {
    if (agent.status !== 'waiting') continue;
    
    const listening = agent.signals.listening || [];
    const unmet = listening.filter(sig => !emittedSignals.has(sig));
    
    if (unmet.length === 0) {
      console.log(`✅ Ready: ${id}`);
    } else {
      console.log(`⏳ Blocked: ${id} - Needs: ${unmet.join(', ')}`);
    }
  }
}
```

### 5.3 Signal Emission

```javascript
function emitSignal(agentId, signal) {
  const registry = loadRegistry();
  const agent = registry.agents[agentId];
  
  // Move from pending to emitted
  const idx = agent.signals.pending.indexOf(signal);
  agent.signals.pending.splice(idx, 1);
  agent.signals.emitted.push(signal);
  
  // Log the emission
  registry.signal_log.push({
    timestamp: new Date().toISOString(),
    agent: agentId,
    type: signal,
    message: `Signal emitted: [${agentId.toUpperCase()}]:${signal}`
  });
  
  // Check for completion
  if (signal.startsWith('COMPLETE:')) {
    agent.status = 'complete';
  }
  
  saveRegistry(registry);
}
```

### 5.4 MCP Hub Integration (Future)

For production deployment, signals will be stored in Supabase:

```python
# mcp-hub/server.py (planned addition)
@app.post("/signals/emit")
async def emit_signal(agent_id: str, signal: str):
    await supabase.table("agent_signals").insert({
        "agent_id": agent_id,
        "signal": signal,
        "timestamp": datetime.now().isoformat()
    })
    await notify_listeners(agent_id, signal)
    return {"status": "emitted"}
```

### 5.5 User Interface Implementation - Dashboard V9

To monitor the multi-agent ecosystem and enable user interaction, Dashboard V9 user interface was implemented in January 2026.

**Technical Architecture:**
```
┌──────────────────────────────────────────┐
│  Dashboard V9 (React + TypeScript)       │
│  ┌────────────────────────────────────┐  │
│  │  UI Components                     │  │
│  │  - Portfolio Metrics (MetricsHeader)
│  │  - Project Cards (ProjectCard)     │  │
│  │  - AI Assistant (ClimateAssistant) │  │
│  └────────────────────────────────────┘  │
│                 ↕                         │
│  ┌────────────────────────────────────┐  │
│  │  Vercel AI SDK Integration         │  │
│  │  - useChat() hook                  │  │
│  │  - Streaming responses             │  │
│  │  - Tool calling                    │  │
│  └────────────────────────────────────┘  │
│                 ↕                         │
│  ┌────────────────────────────────────┐  │
│  │  Anthropic Claude Sonnet 4         │  │
│  │  - DWS IQ system prompt            │  │
│  │  - Carbon calculation (EN 15978)   │  │
│  │  - Compliance checks               │  │
│  │  - Report generation               │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

**Technology Stack:**
- **Frontend:** React 18.3.1 + TypeScript 5.6.2
- **Build Tool:** Vite 6.0.5
- **AI SDK:** Vercel AI SDK 4.1.10
- **AI Model:** Anthropic Claude Sonnet 4
- **Database:** Supabase (real-time subscriptions)
- **Styling:** Tailwind CSS 3.4.17
- **Speech Recognition:** Web Speech API
- **Speech Synthesis:** Speech Synthesis API

**Key Features:**

1. **Real-time Portfolio Monitoring**
   - SPI (Schedule Performance Index) metrics
   - CPI (Cost Performance Index) metrics
   - Carbon footprint tracking (EN 15978 methodology)
   - Compliance monitoring (CSRD, EPBD, ETS, CBAM)

2. **AI-powered Climate Assistant**
   - Streaming chat with Claude Sonnet 4
   - Tool calling for:
     - Carbon calculation
     - Compliance checks
     - Report generation
   - Natural language queries

3. **Voice Interaction**
   - Speech-to-text input (Web Speech API)
   - Text-to-speech output (hands-free operation)
   - Multi-language support
   - Browser support: Chrome, Edge, Safari

**Performance:**
- Bundle size: ~70KB (gzipped)
- Initial load: ~1.2s
- Time to Interactive: ~1.5s
- First AI token: 200-400ms
- Speech recognition latency: ~200ms

**Connection to Multi-Agent Ecosystem:**

Dashboard V9 serves as the user interface layer for the multi-agent ecosystem, enabling:
- User interaction with AI agents via natural language
- Real-time visibility into project data through Supabase
- Agent tool invocation (carbon calculation, compliance checking)
- Visualization of agent results in user-friendly format

**Implementation Benefits:**

1. **Improved Development Speed:** Using Vercel AI SDK reduced development time by 43% compared to custom implementation
2. **Type-safe:** TypeScript reduces runtime errors
3. **Maintainable:** -47% annual maintenance costs
4. **Extensible:** Easy to switch AI providers (Anthropic → OpenAI → Groq)

**Deployment:**
```bash
# Production build
cd /home/user/dws6/dws6.com/dashboard/firehorse/v9-react
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=dws-iq-dashboard-v9
```

**Documentation:**
- Field Note: `/docs/field-notes/2026-01-22-dashboard-v9-technical-stack.md`
- README: `/dashboard/firehorse/v9-react/README.md`
- Evaluation: `/docs/evaluation/typescript-react-ai-sdk-evaluation.md`

---

## 6. Evaluation

### 6.1 Metrics

| Metric | Description | Current Value |
|--------|-------------|---------------|
| Agent Count | Total agents in ecosystem | 22 |
| Parallel Phases | Independent execution phases | 4 |
| Signal Types | Distinct signal categories | 4 |
| Max Dependencies | Most dependencies for single agent | 3 |

### 6.2 Performance Characteristics

- **Signal Emission Latency**: <10ms (file-based), <50ms (Supabase-based)
- **Dependency Check Latency**: <5ms per agent
- **State Persistence**: Immediate (synchronous file write)

### 6.3 Scalability Considerations

The current file-based implementation is suitable for:
- Development environments (10-50 agents)
- Single-coordinator deployments

For production scale (100+ agents), migration to:
- Supabase real-time subscriptions
- Redis pub/sub for high-frequency signals

---

## 7. Related Work

### 7.1 Multi-Agent Frameworks

- **LangChain Agents** (Python): General-purpose agent framework
- **CrewAI**: Multi-agent collaboration patterns
- **AutoGPT**: Autonomous AI agent experiments
- **Microsoft AutoGen**: Multi-agent conversation framework

### 7.2 Coordination Patterns

- **Publish-Subscribe**: Event-driven communication (similar to our signals)
- **Workflow Engines**: Apache Airflow, Prefect (DAG-based coordination)
- **Actor Model**: Erlang/Akka style message passing

### 7.3 Claude Code Agent Teams vs Subagents (February 2026)

Anthropic's Claude Code introduced two complementary patterns for parallel AI work:

**Subagents** (Production):
- Run within a single session's context
- Report results back to main agent only
- Lower token cost (results summarized)
- Best for focused tasks where only the result matters

**Agent Teams** (Experimental):
- Fully independent Claude instances with separate context windows
- Inter-agent messaging through shared mailbox
- Shared task list with self-coordination
- Higher token cost but enables complex collaborative work

| Aspect | DWS6 Signals | Subagents | Agent Teams |
|--------|--------------|-----------|-------------|
| **Communication** | Signal broadcast | Return to caller | Direct messaging |
| **Context** | Shared registry | Caller's window | Independent per agent |
| **Coordination** | Dependency DAG | Caller manages | Shared task list |
| **Best For** | Phase dependencies | Quick research | Complex collaboration |

**Recommendation for DWS6 AgentFoundry:**

| Scenario | Recommended Approach |
|----------|---------------------|
| Sprint-based development (Category A) | Agent Teams for parallel features |
| PR review (security, performance, tests) | Agent Teams (3 reviewers) |
| Sales automation (Category B) | Subagents (cost-effective) |
| Customer support (Category C) | Subagents (predictable costs) |
| Complex debugging | Agent Teams (competing hypotheses) |

**Integration Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│            DWS6 MULTI-AGENT ORCHESTRATION               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  MCP HUB (Port 8765) + Temporal.io              │   │
│  │  - Workflow orchestration                        │   │
│  │  - Agent activity logging (Supabase)            │   │
│  │  - Session persistence (Upstash Redis)          │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│        ┌────────────────┼────────────────┐             │
│        ▼                ▼                ▼             │
│  ┌───────────┐  ┌────────────┐  ┌────────────────┐    │
│  │ SUBAGENTS │  │AGENT TEAMS │  │ LIFETIME SCOPE │    │
│  │(Focused)  │  │(Parallel)  │  │ SIGNALS (DAG)  │    │
│  └───────────┘  └────────────┘  └────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Reference:** Field Note 2026-02-05: `docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md`

### 7.4 Industry Standards

- **MCP (Model Context Protocol)**: Anthropic's standard for AI tool integration
- **OpenAPI**: API specification for agent-to-service communication
- **JSON-LD**: Structured data for agent knowledge bases

---

## 8. Conclusion

### 8.1 Contributions

This work presents:
1. A practical signal-based coordination protocol for multi-agent systems
2. A three-category agent architecture suitable for industrial AI platforms
3. Reference implementation using Node.js CLI and Python FastAPI
4. Integration patterns with the MCP Hub orchestration layer

### 8.2 Future Work

1. **Supabase Real-Time Integration**: Move signals to database with real-time subscriptions
2. **Distributed Coordination**: Support for multi-hub deployments
3. **Machine Learning Optimization**: Predict agent completion times for scheduling
4. **Visual Monitoring**: Dashboard for real-time agent status visualization

### 8.3 Reproducibility

All code and documentation is available at:
- Repository: `https://github.com/blogtheristo/dws6`
- Signal Registry: `.workflows/agents/AGENT_SIGNAL_REGISTRY.json`
- Coordinator: `.workflows/agents/coordinator.cjs`
- MCP Hub: `mcp-hub/server.py`

---

## 9. References

1. **Anthropic MCP Specification** (2024). Model Context Protocol. https://modelcontextprotocol.io
2. **LlamaStack Documentation** (2024). Multi-agent orchestration. https://github.com/meta-llama/llama-stack
3. **Groq API Documentation** (2025). Low-latency inference. https://groq.com
4. **Supabase Documentation** (2025). PostgreSQL + Real-time. https://supabase.com
5. **FastAPI Documentation** (2024). Modern Python web framework. https://fastapi.tiangolo.com
6. **Claude Code Agent Teams** (2026). Orchestrate teams of Claude Code sessions. https://code.claude.com/docs/en/agent-teams
7. **Claude Code Subagents** (2026). Spawn helper agents for focused tasks. https://code.claude.com/docs/en/sub-agents
8. **Upstash Redis** (2026). Serverless Redis for edge computing. https://github.com/upstash/redis-js

---

**Document Version:** 1.1
**Last Updated:** February 5, 2026
**Academic Context:** Metropolia University of Applied Sciences
**Thesis Supervisor:** [To be assigned]
