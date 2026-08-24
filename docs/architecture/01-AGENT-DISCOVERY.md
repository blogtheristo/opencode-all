# Phase 01: Agent Discovery
## DWS IQ 6 Agent Architecture

**Phase:** 01 of 10  
**Status:** Requirements Definition  
**Dependencies:** None  
**Output:** Agent scope document, autonomy levels

---

## 1.1 Problem Statement

### Current Pain Points

DWS IQ 6 serves EU-regulated industries (logistics, construction) with an AI orchestration platform. Current operational challenges:

| Pain Point | Impact | Frequency | Current Solution |
|-----------|--------|-----------|------------------|
| Manual API integration per customer | 3-5 days/integration | Every new customer | Custom development |
| Compliance document interpretation | 2-4 hours/request | 10-15/week | Manual expert review |
| Multi-system data reconciliation | 1-2 hours/day | Daily | Manual cross-checking |
| Customer query routing | 15 min/query avg | 50+/day | Rule-based routing |
| Regulatory update tracking | 4+ hours/week | Ongoing | Manual monitoring |

### Quantified Business Impact

```
Monthly operational overhead:
├── API integrations (4 × 4 days × €500/day): €8,000
├── Compliance review (60 hrs × €75/hr): €4,500
├── Data reconciliation (40 hrs × €50/hr): €2,000
├── Query handling (125 hrs × €40/hr): €5,000
├── Regulatory monitoring (16 hrs × €75/hr): €1,200
└── Total monthly overhead: €20,700

Potential savings with agents (60% automation):
└── Monthly savings: €12,420
```

---

## 1.2 Agent vs. Prompted Model Decision Matrix

### Decision Framework

Not every task requires an agent. Use this decision matrix:

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT NECESSITY MATRIX                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HIGH │ Multi-system      │ AGENT           │ MULTI-AGENT      │
│       │ integration but   │ (ReAct pattern) │ SYSTEM           │
│  A    │ single path       │                 │                  │
│  U    ├───────────────────┼─────────────────┼──────────────────│
│  T    │ Single-step       │ PROMPTED        │ AGENT            │
│  O    │ text generation   │ MODEL           │ (if tools needed)│
│  N    │                   │                 │                  │
│  O    ├───────────────────┼─────────────────┼──────────────────│
│  M    │ Static responses  │ CACHED          │ PROMPTED MODEL   │
│  Y    │ no real-time      │ RESPONSES       │ with RAG         │
│       │ data needed       │                 │                  │
│  LOW  ├───────────────────┴─────────────────┴──────────────────│
│       │         LOW            MEDIUM           HIGH           │
│       │                    COMPLEXITY                          │
└─────────────────────────────────────────────────────────────────┘
```

### DWS IQ 6 Task Classification

| Task | Autonomy | Complexity | Real-time Data | Verdict |
|------|----------|------------|----------------|---------|
| Customer onboarding | Medium | High | Yes | **Multi-Agent** |
| Compliance checking | High | High | Yes | **Agent (ReAct)** |
| Query routing | Medium | Low | Yes | **Agent (Simple)** |
| Report generation | Low | Medium | Yes | **Prompted + RAG** |
| API status monitoring | High | Medium | Yes | **Agent (ReAct)** |
| Invoice generation | Low | Low | No | **Prompted Model** |
| Regulatory updates | Medium | High | Yes | **Agent (CoT)** |

---

## 1.3 Identified Agent Types

### Primary Agents (Required for MVP)

#### 1. Logistics Orchestration Agent
```yaml
Agent: LogisticsAgent
Purpose: Manage transport logistics workflows for Uber Taksi Helsinki, Bolt, Kela
Autonomy: High (with approval gates for financial transactions)
Key Tasks:
  - Route optimization requests
  - Kela transport API integration
  - Driver dispatch coordination
  - Compliance verification (ADR, driver licenses)
Real-World Actions:
  - API calls to partner systems
  - Database updates
  - Notification dispatch
Cognitive Pattern: ReAct (reason-act-observe loops)
```

#### 2. Construction Compliance Agent
```yaml
Agent: ConstructionAgent
Purpose: Manage construction compliance workflows for NCC, T2H
Autonomy: Medium (human-in-loop for permit submissions)
Key Tasks:
  - YTJ company verification
  - Building permit status checking
  - Safety compliance verification
  - Subcontractor vetting
Real-World Actions:
  - Traficom API queries
  - Document retrieval from Suomi.fi
  - Compliance report generation
Cognitive Pattern: ReAct with Chain-of-Thought verification
```

#### 3. Customer Service Agent
```yaml
Agent: CustomerServiceAgent
Purpose: Handle customer inquiries across all verticals
Autonomy: Medium (escalation for complex issues)
Key Tasks:
  - Query intent classification
  - Ticket routing
  - FAQ response generation
  - Status updates
Real-World Actions:
  - CRM updates
  - Email/SMS notifications
  - Escalation triggers
Cognitive Pattern: Reflexion (self-correction capability)
```

### Secondary Agents (Post-MVP)

#### 4. Compliance Monitor Agent
```yaml
Agent: ComplianceMonitorAgent
Purpose: Track regulatory changes affecting customers
Autonomy: Low (alerts only, no automatic changes)
Key Tasks:
  - EUR-Lex monitoring
  - Finnish law updates (Finlex)
  - Industry standard changes
Real-World Actions:
  - Alert generation
  - Knowledge base updates
Cognitive Pattern: Chain-of-Thought
```

#### 5. Data Reconciliation Agent
```yaml
Agent: DataReconciliationAgent
Purpose: Cross-system data consistency verification
Autonomy: High (automatic correction for low-risk items)
Key Tasks:
  - Multi-system data comparison
  - Anomaly detection
  - Correction suggestions
Real-World Actions:
  - Database queries across systems
  - Discrepancy reports
Cognitive Pattern: Tree-of-Thoughts (exploring multiple resolution paths)
```

---

## 1.4 Human Oversight Architecture

### Three-Tier Autonomy Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTONOMY TIERS                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  TIER 1: FULL AUTONOMY                                         │
│  ├── Query responses                                           │
│  ├── Status checks                                             │
│  ├── Non-PII data retrieval                                    │
│  └── Read-only API calls                                       │
│                                                                 │
│  TIER 2: SUPERVISED EXECUTION                                  │
│  ├── Data modifications                                        │
│  ├── Customer communications                                   │
│  ├── Report generation                                         │
│  └── Integration configuration                                 │
│      → Requires: Audit log + async review                      │
│                                                                 │
│  TIER 3: HUMAN-IN-THE-LOOP                                     │
│  ├── Financial transactions                                    │
│  ├── Permit submissions                                        │
│  ├── Contract modifications                                    │
│  └── PII processing decisions                                  │
│      → Requires: Explicit approval before execution            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation in LangGraph

```python
# Example: Human-in-the-loop configuration for LangGraph
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver

# Define approval gate
def approval_required(state):
    """Check if human approval is required."""
    tier = state.get("action_tier", 1)
    
    if tier == 3:  # HUMAN-IN-THE-LOOP
        return "await_approval"
    elif tier == 2:  # SUPERVISED
        return "execute_with_logging"
    else:  # FULL AUTONOMY
        return "execute"

# Build graph with approval gates
workflow = StateGraph(AgentState)
workflow.add_node("analyze", analyze_request)
workflow.add_node("await_approval", human_approval_gate)
workflow.add_node("execute", execute_action)
workflow.add_node("execute_with_logging", execute_with_audit)

workflow.add_conditional_edges(
    "analyze",
    approval_required,
    {
        "await_approval": "await_approval",
        "execute_with_logging": "execute_with_logging",
        "execute": "execute"
    }
)
```

---

## 1.5 Scope Boundaries

### In Scope for Phase 1

- [ ] LogisticsAgent (MVP)
- [ ] ConstructionAgent (MVP)
- [ ] CustomerServiceAgent (MVP)
- [ ] Basic memory (session + semantic)
- [ ] 3 MCP servers (Kela, YTJ, Traficom)
- [ ] Single-region deployment (Google Cloud Run EU)

### Out of Scope for Phase 1

- Multi-agent coordination (Phase 2)
- Edge deployment on Jetson (Phase 2)
- Voice interface (Phase 3)
- All 8 industry verticals (Phases 2-4)
- Multi-region deployment (Phase 3)

---

## 1.6 Success Criteria

### Technical Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Agent response latency (P95) | <3 seconds | Cloud Run logs |
| Tool call success rate | >95% | MCP server metrics |
| Reasoning accuracy | >90% | Human evaluation sample |
| Memory retrieval relevance | >85% | Embedding similarity |

### Business Metrics

| Metric | Baseline | Target (6 months) |
|--------|----------|-------------------|
| Manual intervention rate | 40% | 15% |
| Customer onboarding time | 14 days | 3 days |
| Support ticket resolution | 4 hours avg | 30 min avg |
| Compliance review time | 2 hours | 15 minutes |

---

## 1.7 ROI Projection for Phase 1

### Investment Required

```
Phase 1 Development (3 months):
├── Engineering time: 400 hours × €75/hr = €30,000
├── Infrastructure setup: €500
├── API costs (development): €600
├── Testing/QA: €2,000
└── Total Phase 1 investment: €33,100
```

### Expected Returns

```
Monthly operational savings (post Phase 1):
├── Logistics automation (15 hrs × €50): €750/month
├── Construction compliance (20 hrs × €75): €1,500/month
├── Customer service (40 hrs × €40): €1,600/month
└── Monthly savings: €3,850/month

Time to break-even: 33,100 / 3,850 = 8.6 months
Year 1 net benefit: (€3,850 × 9 months) - €33,100 = €1,550
Year 2 net benefit: €3,850 × 12 = €46,200
```

---

## 1.8 Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| API rate limits hit | Medium | High | Implement caching, queue system |
| LLM hallucination in compliance | Medium | Critical | Human verification for Tier 3 actions |
| MCP security vulnerabilities | Low | Critical | OAuth 2.1, signed manifests, TLS 1.3 |
| Cost overrun on API calls | Medium | Medium | Budget alerts, usage caps |
| Regulatory changes invalidate tools | Low | High | Compliance monitoring agent |

---

## References

1. Anthropic Engineering. (2024). *Building Effective Agents*. Anthropic. https://www.anthropic.com/research/building-effective-agents

2. Shinn, N. et al. (2023). *Reflexion: Language Agents with Verbal Reinforcement Learning*. arXiv:2303.11366. https://arxiv.org/abs/2303.11366

3. n8n GmbH. (2025). *AI Agent Orchestration Frameworks*. n8n Blog. https://blog.n8n.io/ai-agent-orchestration-frameworks/

---

**Phase Complete Checklist:**
- [ ] Problem statement documented
- [ ] Agent vs. model decisions made
- [ ] Agent types defined
- [ ] Autonomy levels specified
- [ ] Scope boundaries set
- [ ] Success criteria defined
- [ ] ROI projection completed

**Next Phase:** Proceed to `02-COGNITIVE-ARCHITECTURE.md` for reasoning framework selection.
