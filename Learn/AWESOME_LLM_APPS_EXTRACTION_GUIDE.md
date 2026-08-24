# Awesome LLM Apps - Agent Extraction Guide for DWS6 & DWS7

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/deepwiki-agent-extraction-aS6Ub | Date: 11.02.2026 | Changes: Initial analysis of 146 agents from awesome-llm-apps repo, mapped to DWS6/DWS7 needs

Session Links & References:
  - Source repo: github.com/Shubhamsaboo/awesome-llm-apps
  - DeepWiki: deepwiki.com/Shubhamsaboo/awesome-llm-apps
  - Claude Code: https://github.com/blogtheristo/dws6/commits/claude/deepwiki-agent-extraction-aS6Ub

Document Status:
  - Created: 11.02.2026
  - Last Modified: 11.02.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Repository Overview

**Shubhamsaboo/awesome-llm-apps** contains 146 agent implementations across 427 Python files (~37,000 LOC). It's a catalog of production-ready patterns using multiple frameworks.

### Framework Distribution

| Framework | Usage | Notes |
|-----------|-------|-------|
| **Agno** (ex-Phidata) | 79% | Dominant. Multi-model, tool integration, teams |
| **Google ADK** | 22% | Sequential/Coordinator patterns, Gemini native |
| **LangChain** | 23% | Used within other frameworks for tools |
| **OpenAI Agents SDK** | 5% | Newest. Handoffs, structured output, tracing |
| **CrewAI** | 3% | Role-based teams |
| **AutoGen (AG2)** | 2% | Microsoft. Nested chats, game agents |

### Key Insight

Most agents are 100-300 lines of Python. Self-contained. The "bacterial code" pattern applies perfectly - extract the pattern, rewrite for DWS6's TypeScript/BaseAgent standard.

---

## HIGH FIT - Extract and Implement for DWS6

These agents directly solve gaps identified in `Learn/MISSING_AGENTS_ANALYSIS.md`.

### 1. Data Analysis Agent → **Emissions Data Analyst**

**Source:** `starter_ai_agents/ai_data_analysis_agent/ai_data_analyst.py` (125 LOC)

**Pattern:** Upload CSV/Excel → DuckDB SQL engine → Natural language queries → Formatted results

**Why it fits DWS6:**
- Customers upload emissions data (Scope 1/2/3) as CSV/Excel from ERPs
- Natural language queries: "What's our total CO2 for Q4?" or "Which facility exceeds ETS allowance?"
- DuckDB runs SQL without a full database server - perfect for edge/serverless

**Extraction plan:**
- Core logic: `preprocess_and_save()` for data cleaning + DuckDB tool integration
- Adapt system prompt for emissions/compliance domain
- Rewrite as TypeScript BaseAgent with Supabase storage instead of temp files
- Add EN 15978 lifecycle stage awareness to queries

**DWS6 agent:** `emissions-data-analyst` (implemented in `src/agents/emissions-data-analyst.agent.ts`)

---

### 2. Research Agent → **Compliance Researcher**

**Source:** `starter_ai_agents/opeani_research_agent/research_agent.py` (331 LOC)

**Pattern:** Triage Agent → Research Agent (web search + fact collection) → Editor Agent (report synthesis) with Pydantic structured output

**Why it fits DWS6:**
- CSRD/ETS/CBAM regulations change frequently. Manual tracking is unsustainable across 25+ industries
- The triage→research→report pattern maps perfectly to: regulatory scan → impact analysis → compliance report
- Structured output (`ResearchPlan`, `ResearchReport`) matches DWS document standard
- `save_important_fact()` tool creates audit trail (EU AI Act Article 12)

**Extraction plan:**
- Core pattern: 3-agent handoff with structured Pydantic output
- Adapt: Replace web search with EUR-Lex/Finlex API search
- Rewrite as TypeScript BaseAgent
- Add compliance-specific output schema (regulation ID, impact level, deadline, affected industries)

**DWS6 agent:** `compliance-researcher` (implemented in `src/agents/compliance-researcher.agent.ts`)

---

### 3. Email GTM Outreach Agent → **Sales Outreach**

**Source:** `advanced_ai_agents/multi_agent_apps/ai_email_gtm_outreach_agent/ai_email_gtm_outreach_agent.py` (361 LOC)

**Pattern:** 4-stage pipeline: Company Finder → Contact Finder → Research (website + Reddit) → Email Writer. SQLite persistence, JSON structured output, configurable email styles.

**Why it fits DWS6:**
- Directly fills the Lead Scout + Outreach agent gap from `MISSING_AGENTS_ANALYSIS.md`
- 4-stage pipeline matches DWS sales playbook in `SALES_AI_AGENT_DESIGN_FI_v1.md`
- Configurable email styles (Professional, Cold, Consultative) match B2B EU enterprise sales
- SQLite persistence → adapt to Supabase for shared state across team

**Extraction plan:**
- Core logic: `run_pipeline()` with 4 sequential stages + `extract_json_or_raise()` for robust parsing
- Adapt: Replace Exa tools with DuckDuckGo/SerpAPI (no dependency on niche APIs)
- Rewrite as TypeScript BaseAgent
- Add DWS-specific targeting: EU industrial companies, climate compliance decision-makers, sustainability officers

**DWS6 agent:** `sales-outreach` (implemented in `src/agents/sales-outreach.agent.ts`)

---

### 4. Agent Governance → **Policy Engine Pattern**

**Source:** `advanced_ai_agents/single_agent_apps/ai_agent_governance/ai_agent_governance.py` (601 LOC)

**Pattern:** PolicyEngine with pluggable rules (Filesystem, Network, RateLimit, ApprovalRequired) + governed_tool decorator + audit log. YAML-configurable.

**Why it fits DWS6:**
- EU AI Act requires governance guardrails for autonomous agents
- DWS already has 3 autonomy tiers (full/supervised/human-in-loop)
- PolicyEngine pattern maps directly to tier enforcement
- Audit log matches Article 12 automatic logging requirement
- YAML config enables per-customer policy customization

**Extraction plan:**
- Core: `PolicyEngine`, `PolicyRule` subclasses, `governed_tool` decorator, `AuditEntry`
- Adapt: Rewrite in TypeScript, integrate with Supabase audit table
- Replace interactive approval with webhook/Slack notification
- Add DWS-specific policies: data residency (EU only), emissions threshold alerts, financial transaction limits

**DWS6 integration:** Not a separate agent - integrate into `src/agents/base.agent.ts` as governance middleware

---

## MEDIUM FIT - Useful Patterns for DWS7

### 5. Multi-MCP Agent → **ERP Integration Orchestrator**

**Source:** `mcp_ai_agents/multi_mcp_agent/multi_mcp_agent.py`

**Pattern:** Coordinates 4+ MCP servers (GitHub, Perplexity, Calendar, Gmail) with SQLite memory, user sessions, streaming. CLI interface.

**DWS7 application:**
- Replace MCP servers with: SAP MCP, IFS MCP, Dynamics MCP, Supabase MCP
- Orchestrate cross-ERP queries: "Show carbon intensity across all facilities in SAP and IFS"
- Session persistence for multi-turn compliance investigations

---

### 6. Customer Support Voice Agent → **Compliance Voice Assistant**

**Source:** `voice_ai_agents/customer_support_voice_agent/customer_support_voice_agent.py`

**Pattern:** Firecrawl crawls docs → Qdrant vector DB → Voice query → Vector search → TTS response

**DWS7 application:**
- Crawl EU regulation sites → store in Supabase pgvector
- Field workers query compliance requirements hands-free
- Multilingual (Finnish, Swedish, English, German) for EU operations

---

### 7. Mixture of Agents → **Compliance Consensus Engine**

**Source:** `starter_ai_agents/mixture_of_agents/mixture-of-agents.py` (100 LOC)

**Pattern:** 4 LLMs in parallel → aggregator synthesizes consensus answer

**DWS7 application:**
- Run compliance question through Groq + Claude + Gemini in parallel
- Aggregator identifies consensus and flags disagreements
- Reduces risk of single-model hallucination on regulatory interpretations
- ~100 lines to implement

---

### 8. Life Insurance Advisor → **CBAM Tariff Calculator**

**Source:** `starter_ai_agents/ai_life_insurance_advisor_agent/life_insurance_advisor_agent.py`

**Pattern:** Questionnaire → E2B sandbox for deterministic calculation → Web research for products → JSON structured output with step-by-step math

**DWS7 application:**
- Replace insurance questionnaire with import data (country of origin, material type, quantity)
- E2B sandbox → deterministic CBAM tariff calculation (no LLM hallucination on math)
- Web research → EU ETS price lookup
- Step-by-step calculation trail for customs audit

---

### 9. Teaching Agent Team → **Customer Onboarding Team**

**Source:** `advanced_ai_agents/multi_agent_apps/agent_teams/ai_teaching_agent_team/teaching_agent_team.py`

**Pattern:** 4 specialized agents (Professor, Advisor, Librarian, TA) working in parallel, outputting to Google Docs

**DWS7 application:**
- Replace with: Compliance Trainer, Roadmap Planner, Resource Finder, Exercise Builder
- Generate per-customer onboarding materials for CSRD compliance
- Output to customer's document system (Notion, Google Docs, SharePoint)

---

### 10. AI Services Agency → **DWS Team Simulation**

**Source:** `advanced_ai_agents/multi_agent_apps/ai_services_agency/agency.py`

**Pattern:** 5-agent organization (CEO, CTO, Product Manager, Developer, Client Manager) with shared context and communication flows using Agency Swarm

**DWS7 application:**
- Maps to DWS Internal Team agents (Architect, Builder, DevOps, Security, Product)
- Shared context via `context.set()` → Supabase shared state
- Role-based communication flows model the weekly coordination cycle in AGENTS.md Section 4

---

## LOW FIT - Reference Only

| Agent | Source | Why Low | DWS Learning |
|-------|--------|---------|--------------|
| Chess/TicTacToe | game_playing_agents/ | Entertainment | Multi-agent turn-based patterns |
| Home Renovation | ai_home_renovation_agent/ | Different domain | Multimodal image + text pipeline |
| Meme Generator | ai_meme_generator_agent/ | Entertainment | Browser automation pattern |
| Music Generator | ai_music_generator_agent/ | Entertainment | Generative pipeline |
| Breakup Recovery | ai_breakup_recovery_agent/ | Consumer | Conversational agent pattern |
| Movie Production | ai_movie_production_agent/ | Entertainment | Creative workflow |

---

## Framework Recommendations for DWS6/DWS7

### Current: TypeScript BaseAgent (keep)

DWS6 already has a solid agent standard. The awesome-llm-apps patterns should be extracted and rewritten as BaseAgent implementations, not imported as Python dependencies.

### Future: Consider Adding

| Framework | When | Why |
|-----------|------|-----|
| **Agno** | DWS7 Python agents | 79% of ecosystem uses it. Mature, multi-model, tool integration |
| **Google ADK** | Edge agents on Jetson | SequentialAgent/Coordinator patterns ideal for SiteSense |
| **OpenAI Agents SDK** | Research/report agents | Best handoff pattern, structured output, native tracing |

### Anti-Pattern: Don't Import

- Don't add awesome-llm-apps as a dependency
- Don't copy Streamlit UI code (DWS uses React)
- Don't copy API key management patterns (DWS has .env standard)
- Extract the core logic only - "bacterial code" philosophy

---

## Implemented Agents (This Session)

| Agent | Source Pattern | DWS6 File | Lines |
|-------|--------------|-----------|-------|
| emissions-data-analyst | Data Analysis Agent | `src/agents/emissions-data-analyst.agent.ts` | ~250 |
| compliance-researcher | Research Agent | `src/agents/compliance-researcher.agent.ts` | ~280 |
| sales-outreach | Email GTM Outreach | `src/agents/sales-outreach.agent.ts` | ~300 |

All three follow BaseAgent standard, use AgentContext/AgentResponse types, log to Supabase, and handle missing LLM gracefully.

---

## Key Takeaways for HIL

1. **146 agents, 79% use Agno** - The Python AI agent ecosystem has standardized around Agno. DWS should consider Agno for any Python-side agents.

2. **Most agents are 100-300 LOC** - Validates the "bacterial code" philosophy. Enterprise agents don't need to be complex.

3. **4 agents directly fill DWS6 gaps** - Data Analysis → Emissions, Research → Compliance, GTM Outreach → Sales, Governance → Policy Engine.

4. **MCP pattern is emerging** - 5 dedicated MCP agents show the protocol is gaining traction. DWS's existing MCP infrastructure is well-positioned.

5. **Voice is underexplored in DWS** - 3 voice agents in the repo demonstrate RAG + TTS. Consider for DWS7 field worker interfaces.

6. **Governance pattern is critical** - The PolicyEngine from ai_agent_governance aligns perfectly with EU AI Act Article 12. Should be integrated into BaseAgent as middleware.
