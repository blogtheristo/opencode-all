# DWS IQ 6 Agent Architecture Blueprint
## Master Overview Document

**Version:** 1.0.0  
**Last Updated:** 2026-01-18  
**Platform:** DWS IQ 6 & Firehorse Products  
**Company:** Lifetime Oy

---

## Executive Summary

This blueprint defines the production-grade AI agent architecture for DWS IQ 6, Lifetime Consulting's "One Brain, Eight Industries" platform serving EU-regulated verticals including logistics (Uber Taksi Helsinki, Bolt, Kela) and construction (NCC, T2H).

### Architecture Philosophy

The DWS IQ 6 agent architecture follows three core principles derived from Anthropic's Building Effective Agents (2024) and extended for EU-regulated enterprise deployment:

1. **Specialized Agents Over Monolithic Models**: Split complex tasks across domain-specific agents that share context via MCP
2. **Regulatory-First Design**: NIS2/GDPR/ISO 27001 compliance embedded at the orchestration layer
3. **Hybrid Cloud-Edge Topology**: Google Cloud Run for orchestration, NVIDIA Jetson for edge inference

---

## Technology Stack Summary

| Layer | Technology | Purpose | Cost Profile |
|-------|-----------|---------|--------------|
| **Orchestration** | Google Cloud Run | Stateless agent runtime | €0.10/million requests |
| **Memory** | Supabase PostgreSQL + pgVector | Session, semantic, episodic memory | €25/month Pro tier |
| **Edge Compute** | NVIDIA Jetson Orin Nano/AGX | Local inference, low-latency | €249-€1,999 hardware |
| **MCP Server** | FastMCP (Python) | Tool exposure, protocol compliance | Open source |
| **Agent Framework** | LangGraph + Claude API | Orchestration, reasoning loops | API costs vary |
| **Observability** | OpenTelemetry + Supabase Logs | Tracing, debugging, audit | €0-50/month |

---

## ROI & Runway Impact Analysis

### Current Baseline (Pre-Agent Architecture)
- **MRR:** €7,000
- **Customer Retention:** 100%
- **Vertical Coverage:** 2 (Logistics, Construction)
- **Manual Intervention Rate:** ~40% of customer requests

### Projected Impact (6 months post-deployment)

| Metric | Current | Target | Impact |
|--------|---------|--------|--------|
| Manual Intervention | 40% | 15% | -62.5% labor cost |
| Customer Onboarding Time | 14 days | 3 days | -78.6% |
| Vertical Scalability | 2 industries | 4 industries | +100% |
| MRR Growth Enablement | €7K | €15K+ | +114% capacity |

### Monthly Cost Structure

```
Agent Infrastructure:
├── Google Cloud Run: €150/month (estimated)
├── Supabase Pro: €25/month
├── Claude API (Sonnet): €200/month (estimated at current usage)
├── Observability: €25/month
└── Total: €400/month

ROI Calculation:
├── Labor savings (25hrs/week × €50/hr × 4 weeks): €5,000/month
├── Faster onboarding (2 additional customers/month × €700): €1,400/month
├── Gross benefit: €6,400/month
└── Net ROI: €6,000/month (1,500% return on infrastructure spend)
```

### Runway Extension

At current burn rate with €150K SAFE at €3.8M post-money valuation:
- **Without agents:** 18 months runway
- **With agents:** 24+ months runway (due to operational efficiency)

---

## Phase Structure

This blueprint is organized into 10 operational phases, each delivered as a separate file:

| Phase | File | Description |
|-------|------|-------------|
| 01 | `01-AGENT-DISCOVERY.md` | Problem definition, agent vs. prompted model decision |
| 02 | `02-COGNITIVE-ARCHITECTURE.md` | ReAct/CoT/ToT framework selection |
| 03 | `03-ORCHESTRATION-LAYER.md` | Cloud Run + LangGraph control flow |
| 04 | `04-TOOL-ARCHITECTURE.md` | MCP servers, extensions, functions |
| 05 | `05-GROUNDING-MEMORY.md` | Supabase pgVector, memory schemas |
| 06 | `06-PROMPT-ENGINEERING.md` | System prompts, tool descriptions |
| 07 | `07-IMPLEMENTATION.md` | Code structure, API integration |
| 08 | `08-TESTING-EVALUATION.md` | Test suite, metrics, adversarial tests |
| 09 | `09-PRODUCTION-DEPLOYMENT.md` | Cloud Run deployment, monitoring |
| 10 | `10-DELIVERY-ROADMAP.md` | Timeline, milestones, next steps |

---

## Architecture Diagram (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DWS IQ 6 AGENT SYSTEM                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐ │
│  │   CLOUD LAYER    │    │   EDGE LAYER     │    │  CLIENT APPS  │ │
│  │ (Google Cloud)   │◄──►│ (NVIDIA Jetson)  │◄──►│  (React/iOS)  │ │
│  └────────┬─────────┘    └────────┬─────────┘    └───────────────┘ │
│           │                       │                                 │
│           ▼                       ▼                                 │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                    ORCHESTRATION LAYER                         ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ ││
│  │  │ LangGraph   │  │ Cloud Run   │  │ MCP Protocol Handler   │ ││
│  │  │ State Mgmt  │  │ Functions   │  │ (JSON-RPC 2.0)         │ ││
│  │  └─────────────┘  └─────────────┘  └─────────────────────────┘ ││
│  └────────────────────────────────────────────────────────────────┘│
│           │                                                         │
│           ▼                                                         │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                    AGENT LAYER                                 ││
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌────────────────┐ ││
│  │  │ Logistics │ │Construction│ │ Compliance│ │ Customer Svc  │ ││
│  │  │   Agent   │ │   Agent   │ │   Agent   │ │    Agent      │ ││
│  │  │ (ReAct)   │ │ (ReAct)   │ │ (CoT)     │ │ (Reflexion)   │ ││
│  │  └───────────┘ └───────────┘ └───────────┘ └────────────────┘ ││
│  └────────────────────────────────────────────────────────────────┘│
│           │                                                         │
│           ▼                                                         │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                    MEMORY & GROUNDING LAYER                    ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ ││
│  │  │ Supabase     │  │ pgVector     │  │ RAG Pipeline         │ ││
│  │  │ PostgreSQL   │  │ Embeddings   │  │ (Regulatory Docs)    │ ││
│  │  └──────────────┘  └──────────────┘  └──────────────────────┘ ││
│  └────────────────────────────────────────────────────────────────┘│
│           │                                                         │
│           ▼                                                         │
│  ┌────────────────────────────────────────────────────────────────┐│
│  │                    TOOL LAYER (MCP SERVERS)                    ││
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐  ││
│  │  │ Kela    │ │ Traficom│ │ DVV     │ │ YTJ     │ │ Custom  │  ││
│  │  │ API MCP │ │ API MCP │ │ API MCP │ │ API MCP │ │ APIs    │  ││
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘  ││
│  └────────────────────────────────────────────────────────────────┘│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Industry-Specific Agent Specialization

### "One Brain, Eight Industries" Implementation

Each industry vertical receives a specialized agent that inherits from a base DWS Agent class:

| Industry | Agent Name | Primary Cognitive Pattern | Key Tools |
|----------|-----------|---------------------------|-----------|
| Logistics | `LogisticsAgent` | ReAct | Route optimization, Kela transport APIs |
| Construction | `ConstructionAgent` | ReAct | YTJ compliance, permit checking |
| Healthcare | `HealthcareAgent` | Chain-of-Thought | DVV integration, GDPR data handling |
| Energy | `EnergyAgent` | Tree-of-Thoughts | Fingrid data, optimization |
| Finance | `FinanceAgent` | CoT + Verification | FIN-FSA compliance tools |
| Manufacturing | `ManufacturingAgent` | ReAct | Supply chain, Traficom |
| Public Sector | `PublicSectorAgent` | CoT | Suomi.fi, DVV population register |
| Retail | `RetailAgent` | ReAct | Inventory, logistics integration |

---

## Compliance & Security Architecture

### NIS2 Compliance Integration

```yaml
NIS2_Requirements:
  incident_reporting:
    - 24h initial notification
    - 72h full incident report
    - Automated via ComplianceAgent
  
  supply_chain_security:
    - MCP server validation
    - OAuth 2.1 for all tool connections
    - TLS 1.3 minimum
  
  audit_logging:
    - All agent decisions logged
    - OpenTelemetry spans
    - 7-year retention in Supabase
```

### GDPR Data Handling

```yaml
GDPR_Architecture:
  data_minimization:
    - Agents only request required fields
    - Automatic PII redaction in logs
  
  right_to_erasure:
    - Memory cascade delete supported
    - Customer data isolation per workspace
  
  consent_management:
    - Tool permissions stored per user
    - Granular data access controls
```

---

## References

1. Anthropic Engineering. (2024). *Building Effective Agents*. Anthropic. https://www.anthropic.com/research/building-effective-agents

2. Weng, L. et al. (2025). *A Practical Guide for Designing, Developing, and Deploying Production-Grade Agentic AI Workflows*. arXiv:2512.08769v1. https://arxiv.org/html/2512.08769v1

3. Model Context Protocol Working Group. (2025). *MCP Security Best Practices*. Anthropic. https://docs.anthropic.com/mcp/security

---

## Quick Start

```bash
# Clone the DWS IQ 6 repository
git clone https://github.com/lifetime-consulting/dws6.git
cd dws6

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start the orchestration layer
python -m dws6.orchestrator

# In a separate terminal, start MCP servers
python -m dws6.mcp.logistics_server
python -m dws6.mcp.construction_server
```

---

**Next Phase:** Proceed to `01-AGENT-DISCOVERY.md` for detailed problem definition and agent scope analysis.
