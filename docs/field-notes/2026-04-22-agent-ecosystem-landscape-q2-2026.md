<!--
VERSION AND AGENT HISTORY
Document: 2026-04-22-agent-ecosystem-landscape-q2-2026.md
Version: 1.0
Last-Updated: 2026-04-22
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Purpose: Snapshot of the competitive agent ecosystem (Q2 2026) across
         Siemens, NVIDIA, .NET Aspire 13.2, Google A2A v1.0, Salesforce
         AgentExchange, and ERP vendors (SAP Joule, Oracle AI Agent
         Studio, Microsoft Dynamics 365 Copilot). Positions DWS IQ 6
         and derives design implications for the V2 Skilled Agents
         rollout on dws10.com industry pages.
Introduced-In: PR-pending (branch claude/agents-v2-implementation-PPLwb-EIYyg)
Code-Version: 1.0
Branch: claude/agents-v2-implementation-PPLwb-EIYyg
Date: 2026-04-22
Owner: risto.paarni@lifetime.fi
-->

# Agent Ecosystem Landscape — Q2 2026

- **Date:** 2026-04-22
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** V2 Skilled Agents rollout on dws10.com industry pages and AgentFoundry refresh. Competitive synthesis to sharpen KYA positioning and BYO agent interop story.

## Ontology Tags

- **Geography:** Global > EU + US
- **Sector:** Agents > Industrial, Agents > Enterprise, Agents > ERP
- **Entities:** Siemens AG, NVIDIA, Microsoft, Google, Salesforce, SAP, Oracle, Linux Foundation, Lifetime Oy
- **Standards:** Google A2A v1.0, MCP, KYA Standard v1.1

## 1. Vendor Moves (April 2026)

### Siemens Industrial Copilot

- Automate 2025 (Detroit): "AI agents for industrial automation" — orchestrator that deploys a toolbox of specialized agents.
- CES 2026: unified stack from engineering models to production data, edge inference to cloud deployment.
- Backend: Microsoft Azure OpenAI.
- Pitch: "automating automation" — up to 50% productivity lift.
- Partnerships: thyssenkrupp on skills gap (manufacturing workforce).

### NVIDIA (two stacks)

- **NIM Agent Blueprints** — catalog of pretrained, customizable AI workflows. Helm chart deployment. New blueprints monthly.
- **NeMo Agent Toolkit** (open source) — connects and optimizes teams of agents across LangChain, LlamaIndex, CrewAI, Microsoft Semantic Kernel, Google ADK, custom Python.
- Use cases: customer service avatars, RAG, drug discovery virtual screening, R&D.

### Microsoft .NET Aspire 13.2

- AI-agent-native CLI: `--detach`, `--isolated`, resource start/stop from CLI.
- Parallel dev environments with random ports + separate secrets (worktree-safe).
- **Microsoft Agent Framework 1.0** (Apr 2026) — production-ready for .NET + Python.
- Aspire.Azure.AI.OpenAI 13.2 — primitive for registering `OpenAIClient` from a connection string.

### Google Agent2Agent (A2A) v1.0

- Released early 2026. **Linux Foundation-owned.** 150+ organizations.
- **Signed Agent Cards** — cryptographic signature on Agent Card at `/.well-known/agent-card.json`.
- Production at Microsoft, AWS, Salesforce, SAP, ServiceNow.
- AP2 ships as formal extension.

### Salesforce AgentExchange (TDX 2026)

- Unified marketplace: AppExchange + Slack Marketplace + Agentforce.
- Inventory: 10,000+ apps, 1,000+ pre-built agents / sub-agents / tools / MCP servers, 2,600+ Slack apps.
- Native MCP + A2A support.
- Agentforce 3: open connectivity + enterprise-grade trust.
- $50M AgentExchange Builders Initiative for ISV partners.
- Fall 2026: conversational search + Go-To-Market App (private offers, unified billing, automated provisioning).

### ERPs

- **SAP Joule** — SAP Connect 2025 shipped 14 new Joule Agents (finance, HR, procurement, supply chain, industry-specific). SAP Concur Fusion 2026 embeds Joule across travel/expense/payments. Joule ↔ Microsoft 365 Copilot cross-platform skill sharing.
- **Oracle AI Agent Studio** — builds and modifies agents inside Oracle Fusion (procurement, financial close, expense).
- **Microsoft Dynamics 365 Copilot** — Azure OpenAI, Dataverse-integrated. Build 2025 added multi-agent collaboration, persistent session memory, Teams cross-user task coordination.

## 2. DWS IQ 6 Position

| Vendor                   | Their move                                           | DWS differentiator                                                                                                               |
| ------------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Siemens                  | Orchestrator + Azure OpenAI, factory focus           | Sovereign EU-hosted LLM (Qwen 2.5 72B on DGX Spark), regulatory-first scoring (CSRD/CBAM/ETS deterministic)                      |
| NVIDIA NIM / NeMo        | Framework-agnostic toolkit, pre-built blueprints     | DWS IQ exposes MCP `tools/list` + A2A — same interop, plus EU regs baked into Climate IQ agents                                  |
| .NET Aspire 13.2         | Agent-native CLI (`--detach`, `--isolated`)          | DWS ships `dws <command>` CLI — parity ergonomics, EU data residency by default                                                  |
| Google A2A v1.0          | Signed Agent Cards at `/.well-known/agent-card.json` | **Gap:** DWS likely does not yet expose `/.well-known/agent-card.json`. Close this in a follow-up PR.                            |
| Salesforce AgentExchange | Marketplace + MCP + A2A + platform trust             | KYA gives **hardware-level MicroVM sandbox** + identity binding + TC-4 Leash-Snap — no other marketplace has this for BYO agents |
| SAP / Oracle / MS ERP    | Embedded agents, cross-platform skill sharing        | DWS IQ integrates via ERP connectors (IFS, Epicor); positions above ERP as the regulatory gate, not a replacement                |

## 3. Design Implications for V2 Skilled Agents Rollout

1. **Skills-as-product framing is correct.** Every major vendor is now selling skills / blueprints / agents as reusable units. "V2 Skilled Agents" aligns with market language.
2. **Speak the standards.** Add a "Standards & Interop" strip to each V2 block showing `A2A v1.0 · MCP · KYA`. These are the three interop primitives DWS must claim parity on (A2A, MCP) while owning the trust primitive (KYA).
3. **Sharpen KYA as hardware isolation.** Salesforce / Siemens / SAP trust is platform-level (RBAC, audit logs, signed cards). KYA goes below the platform to MicroVM isolation. This is the differentiator; the copy should say it plainly.
4. **A2A Agent Card endpoint gap.** Every A2A-compliant platform publishes `/.well-known/agent-card.json`. DWS should expose this for each deployed agent. Track as a follow-up engineering task — not in this PR.
5. **Industry-vertical framing wins over horizontal marketplace.** Salesforce / NVIDIA sell horizontally. DWS sells by industry (Climate IQ pantheon). Keep industry pages as the main surface.

## 4. Follow-up Engineering Tasks

- [ ] Implement `/.well-known/agent-card.json` endpoint per agent (A2A v1.0 compliance).
- [ ] Add Signed Agent Card support (cryptographic signature at domain level).
- [ ] Publish DWS IQ as an A2A participant in the Linux Foundation registry (marketing visibility).
- [ ] Evaluate AgentExchange listing for SiteSense + Compliance agent (go-to-market reach to Salesforce customers).

## 5. Sources

- Siemens: https://press.siemens.com/global/en/pressrelease/siemens-introduces-ai-agents-industrial-automation
- NVIDIA NIM Blueprints: https://nvidianews.nvidia.com/news/nvidia-and-global-partners-launch-nim-agent-blueprints-for-enterprises-to-make-their-own-ai
- NVIDIA NeMo Agent Toolkit: https://developer.nvidia.com/nemo-agent-toolkit
- Aspire 13.2: https://devblogs.microsoft.com/aspire/aspire-13-2-announcement/
- Microsoft Agent Framework 1.0: https://visualstudiomagazine.com/articles/2026/04/06/microsoft-ships-production-ready-agent-framework-1-0-for-net-and-python.aspx
- Google A2A announcement: https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
- A2A Specification: https://a2a-protocol.org/latest/specification/
- A2A v1.0 adoption (150+ orgs): https://stellagent.ai/insights/a2a-protocol-google-agent-to-agent
- Salesforce AgentExchange: https://www.salesforce.com/agentforce/agentexchange/
- TDX 2026 coverage: https://www.computerweekly.com/news/366641628/TDX-2026-Salesforce-depicts-Saas-as-in-agentic-evolution
- SAP Joule: https://www.sap.com/products/artificial-intelligence/ai-assistant.html
- Oracle AI Agent Studio: https://mlq.ai/news/oracle-adds-agentic-applications-builder-and-workflow-tools-to-ai-agent-studio-for-fusion-apps/
- Dynamics 365 Copilot: https://topdynamicspartners.com/learn/dynamics-365/copilot-ai
