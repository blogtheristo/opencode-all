# Moltworker & OpenClaw: Self-Hosted AI Agent for DWS Personal Assistant

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/security-dws6-vulnerabilities-bsqHe | Date: 21.02.2026 | Changes: Added "Claw Layer" conceptual framework (Section: The Claw Layer), security vulnerability cross-reference, updated known risks with Cisco findings
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/molt-field-note-FFMhi | Date: 15.02.2026 | Changes: Initial field note — Moltworker evaluation for DWS assistant use case

Session Links & References:
  - Claude Code (claude/molt-field-note-FFMhi): https://github.com/blogtheristo/dws6/commits/claude/molt-field-note-FFMhi
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/molt-field-note-FFMhi/docs/field-notes/2026-02-15-moltworker-openclaw-dws-assistant.md

Document Status:
  - Created: 15.02.2026
  - Last Modified: 21.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Technical Evaluation

Related Documents:
  - docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md
  - docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md
  - docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md
  - DWS_SECURITY_STANDARD.md (v1.1 — Added Claw-layer security, Section 12)

***

## Summary

**Moltworker** is a middleware Worker that runs OpenClaw (formerly Moltbot, formerly Clawdbot) on Cloudflare's Sandbox SDK and Developer Platform APIs. It enables self-hosting an AI personal assistant without dedicated hardware — replacing the need for a $500+ Mac mini with a ~$5-10/month Cloudflare Workers deployment.

This field note evaluates Moltworker as the infrastructure layer for a **DWS Personal Assistant** — a sovereign, self-hosted AI agent that can operate across messaging platforms (Telegram, Discord, Slack), automate browser tasks, manage files, and serve as a persistent AI companion for DWS team members and customers.

**Recommendation: Adopt Moltworker as the DWS AI Assistant platform**, deployed on Cloudflare Workers alongside existing DWS edge infrastructure.

---

## Background: The Naming Journey

| Date | Name | Reason |
|------|------|--------|
| November 2025 | **Clawdbot** | Original name by creator Peter Steinberger (PSPDFKit founder) |
| January 27, 2026 | **Moltbot** | Renamed — Anthropic requested change (too close to "Claude") |
| January 30, 2026 | **OpenClaw** | Final rebrand — open-source community identity |
| February 2026 | **Moltworker** | Cloudflare's middleware adaptation for Workers deployment |

OpenClaw gained 100,000+ GitHub stars in under a week (late January 2026) — one of the fastest-growing open-source repositories in GitHub history. Now at 180k+ stars.

---

## Architecture

### OpenClaw Gateway Architecture

OpenClaw follows a four-component Gateway-centric architecture:

```
┌───────────────────────────────────────────────────────────────┐
│                    OPENCLAW ARCHITECTURE                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │   GATEWAY    │    │    AGENT     │    │     MEMORY      │  │
│  │             │    │  (Reasoning) │    │  (Persistent)   │  │
│  │ • Telegram  │───▶│             │───▶│                 │  │
│  │ • Discord   │    │ • Claude    │    │ • Conversations │  │
│  │ • Slack     │    │ • GPT      │    │ • Preferences   │  │
│  │ • WhatsApp  │    │ • Local LLM│    │ • Context       │  │
│  │ • iMessage  │    │             │    │                 │  │
│  └─────────────┘    └──────┬──────┘    └─────────────────┘  │
│                            │                                  │
│                     ┌──────▼──────┐                           │
│                     │   SKILLS    │                           │
│                     │             │                           │
│                     │ • Browser   │                           │
│                     │ • Files     │                           │
│                     │ • Calendar  │                           │
│                     │ • Shell     │                           │
│                     │ • Custom    │                           │
│                     └─────────────┘                           │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Moltworker on Cloudflare Workers

Moltworker wraps OpenClaw in a three-tier Cloudflare architecture:

```
┌────────────────────────────────────────────────────────────┐
│                  MOLTWORKER ON CLOUDFLARE                    │
├────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐                                       │
│  │ ENTRYPOINT WORKER │  Edge Gateway                        │
│  │ • API Router      │  • Protected by Cloudflare Access    │
│  │ • Admin UI        │  • JWT validation                    │
│  │ • CDP Shim        │  • Device pairing                    │
│  └────────┬─────────┘                                       │
│           │                                                  │
│  ┌────────▼─────────┐                                       │
│  │   SANDBOX SDK    │  Durable Object                       │
│  │ • Container mgmt │  • 1/2 vCPU, 4 GiB RAM, 8 GB disk   │
│  │ • Process mgmt   │  • Secure isolation                   │
│  │ • File systems   │  • Lifecycle management               │
│  └────────┬─────────┘                                       │
│           │                                                  │
│  ┌────────▼─────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ OPENCLAW RUNTIME │  │  R2 STORAGE  │  │   BROWSER    │ │
│  │ • Gateway        │  │ • Persistent │  │  RENDERING   │ │
│  │ • Agent          │  │   state      │  │ • Headless   │ │
│  │ • Skills         │  │ • Sessions   │  │   Chromium   │ │
│  │ • Memory         │  │ • History    │  │ • Screenshots│ │
│  └──────────────────┘  └──────────────┘  └──────────────┘ │
│                                                              │
└────────────────────────────────────────────────────────────┘
```

---

## The Claw Layer: A New Abstraction in the AI Stack

Just as LLM agents emerged as a new layer on top of LLMs — adding orchestration, tool calls, and session memory — Claws represent the next architectural layer on top of LLM agents. They take orchestration, scheduling, context, tool calls, and persistence to a qualitatively different level.

### The Three-Layer AI Stack

```
┌─────────────────────────────────────────────────────────────────┐
│  LAYER 3: CLAW                                                   │
│  Persistent daemon · Multi-channel gateway · Self-extending      │
│  skills · Long-term memory · Container autonomy                  │
│  Examples: OpenClaw, Moltworker                                  │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 2: LLM AGENT                                             │
│  Orchestrated inference · Tool calls · Session memory            │
│  Conversation-scoped · Human-initiated                           │
│  Examples: Claude Code, Cursor, Copilot, Codex                  │
├─────────────────────────────────────────────────────────────────┤
│  LAYER 1: LLM                                                    │
│  Raw inference · Prompt in, text out · Stateless                 │
│  Single-turn or multi-turn chat                                  │
│  Examples: Claude API, GPT API, Gemini API                      │
└─────────────────────────────────────────────────────────────────┘
```

### What Claws Add Beyond Agents

| Capability | LLM Agent | Claw |
|-----------|-----------|------|
| **Lifecycle** | Session-bound (dies when you close terminal) | Persistent daemon (always running) |
| **Channels** | Single interface (CLI, IDE, chat) | Multi-channel gateway (Telegram, Discord, Slack, WhatsApp, iMessage simultaneously) |
| **Memory** | Session context (lost between sessions) | Long-term memory (weeks/months, preference learning) |
| **Skill extension** | Uses pre-defined tools | Can write code to give itself new capabilities |
| **Scheduling** | Reactive (waits for human prompt) | Proactive (scheduled tasks, monitoring, alerts) |
| **Autonomy** | Bounded by session tools | Shell access, browser automation, file system operations |
| **Identity** | Anonymous tool | Persistent personality, adapts to user over time |

### Why This Matters for DWS

The Brain-Memory-Body-Hands architecture maps cleanly to the three-layer stack:

| DWS Layer | AI Stack Layer | Implementation |
|-----------|---------------|----------------|
| **Brain** (DWS IQ 6) | Claw (orchestration daemon) | Moltworker on Cloudflare Workers |
| **Memory** (LWM) | LLM (knowledge base + inference) | Claude/Gemini via AI Gateway |
| **Body** (Firehorse) | LLM Agent (tool-using workflows) | Claude Code, MCP Hub agents |
| **Hands** (Fleet) | Physical execution | NVIDIA Jetson, IoT devices |

### Security Implications of the Claw Layer

Each layer inherits and amplifies all vulnerabilities from the layer below. See **DWS_SECURITY_STANDARD.md Section 12** for the full Claw-layer threat model. Key additional risks:

- **Skill registry poisoning** — Malicious community skills (Cisco found exfiltration in OpenClaw skills)
- **Self-modifying code** — Claw writes its own extensions, potentially bypassing safety constraints
- **Cross-channel data leakage** — Data from Slack could flow to Telegram without access controls
- **Long-term memory poisoning** — Adversary corrupts persistent memory to alter future behavior
- **Persistent shell access** — Container sandbox provides isolation, but shell + internet = exfiltration path

**Full vulnerability assessment:** `docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md`

---

## Key Capabilities

### Multi-Channel Messaging

Single gateway process connects to multiple chat platforms:

| Channel | Status | Use Case |
|---------|--------|----------|
| Telegram | Supported | Mobile-first personal assistant |
| Discord | Supported | Team/community communication |
| Slack | Supported | Enterprise workspace integration |
| WhatsApp | Supported | Customer communication |
| iMessage | Supported | Apple ecosystem users |
| Mattermost | Extension | Self-hosted alternative |
| Web UI | Built-in | Browser-based control panel |

### Autonomous Capabilities

- **Shell command execution** on the host/container
- **Browser automation** via Puppeteer/CDP (web scraping, screenshots, form filling)
- **File management** (read, write, organize documents)
- **Calendar integration** (schedule entries, reminders)
- **Email management** (send, summarize, delete)
- **PDF summarization** and document processing
- **Agentic shopping** and web research
- **Self-improving skills** — autonomously writes code for new capabilities

### Persistent Memory

- Recalls past interactions over weeks
- Adapts to user habits for hyper-personalized assistance
- Maintains long-term context across sessions
- Stored in Markdown files (local) or R2 (Cloudflare)

### Multi-Model Support

| Provider | Model | Via |
|----------|-------|-----|
| Anthropic | Claude Sonnet 4.5 (default) | Direct API or AI Gateway |
| OpenAI | GPT-4o, GPT-4.1 | Direct API |
| KIMI | K2.5 | Direct API |
| Xiaomi | MiMo-V2-Flash | Direct API |
| Local | Any model | Ollama |

---

## Cost Analysis

### Moltworker on Cloudflare (Recommended)

| Component | Cost | Notes |
|-----------|------|-------|
| Workers Paid plan | $5/month | Required base |
| Container (24/7) | ~$34.50/month | Full-time availability |
| Container (4h/day) | ~$5-6/month | Sleep configuration |
| Container (with sleep) | ~$10-11/month | Balanced availability |
| R2 storage | Minimal | First 10 GB free |
| AI Gateway | Included | Analytics and routing |
| **Total (sleep mode)** | **~$15-16/month** | |

### vs. Mac Mini Self-Hosting

| Component | Cost | Notes |
|-----------|------|-------|
| Mac mini M4 | $500+ one-time | Hardware purchase |
| Electricity | ~$5-10/month | 24/7 operation |
| Maintenance | Ongoing | Physical hardware |
| **Total Year 1** | **~$560-620** | |

**Moltworker saves ~$400 in Year 1** and eliminates hardware maintenance.

---

## Security Model

### Authentication Layers

1. **Cloudflare Access** — Only approved identities reach admin/management routes
2. **Gateway Token** — Required for web control interface access
3. **Device Pairing** — Each browser, client, or chat integration requires manual approval
4. **JWT Validation** — Verifies requests came from Access, not third parties

### Known Risks

| Risk | Severity | Mitigation |
|------|----------|------------|
| Shell access to container | High | Sandbox SDK isolation |
| Prompt injection | Medium | Input validation, skill allowlisting |
| Data exfiltration via skills | Medium | Audit third-party skills (Cisco found issues) |
| API key exposure | High | Cloudflare Access + R2 encrypted storage |

### DWS Security Alignment

| DWS Requirement | Moltworker Support |
|-----------------|-------------------|
| EU data residency | Cloudflare EU regions available |
| GDPR compliance | Self-hosted, data stays in Cloudflare account |
| NIS2 | Access logs, JWT audit trail |
| No hardware on-premise | Fully serverless |

---

## Recommendation: DWS Personal Assistant

### Why Moltworker for DWS

1. **Existing Cloudflare infrastructure** — DWS already deploys to Cloudflare Workers (dws6.com, dws10.com). Moltworker runs on the same platform.

2. **Cost-effective** — $15-16/month per assistant instance vs. building custom agent infrastructure.

3. **Multi-channel reach** — Telegram, Discord, Slack integration covers DWS team communication and customer outreach channels.

4. **Claude-native** — Default model is Claude Sonnet 4.5 via Cloudflare AI Gateway, matching DWS's primary AI provider (Anthropic).

5. **Persistent memory** — Long-term context enables the assistant to learn DWS-specific terminology, customer preferences, and compliance workflows over time.

6. **Self-hosted sovereignty** — No third-party SaaS dependency. Data stays in DWS's Cloudflare account.

7. **Extensible skills** — Custom skills can be developed for DWS-specific tasks (compliance checking, report generation, customer lookup).

### Proposed DWS Assistant Use Cases

| Use Case | Channel | Skills Needed |
|----------|---------|---------------|
| **Climate compliance Q&A** | Slack, Telegram | LWM knowledge base, regulation lookup |
| **Customer support triage** | Discord, Web UI | Firehorse product knowledge, ticket routing |
| **Report automation** | Slack | Firehorse Report generation, PDF creation |
| **Meeting preparation** | Telegram | Calendar, document summarization |
| **Competitive intelligence** | Slack | Web research, browser automation |
| **EU regulation monitoring** | Telegram | RSS/web scraping, alerting |
| **Internal knowledge search** | Slack | Supabase vector search, field notes lookup |
| **Sales support** | WhatsApp | CRM lookup, product catalog, pricing |

### Integration with DWS Ecosystem

```
┌──────────────────────────────────────────────────────────────┐
│                DWS ASSISTANT (via Moltworker)                  │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────┐    ┌──────────────────────────────────┐  │
│  │   MOLTWORKER   │    │      DWS BACKEND SERVICES        │  │
│  │                │    │                                    │  │
│  │ OpenClaw +     │───▶│ • Supabase (DB + Auth + Vector)  │  │
│  │ Custom Skills  │    │ • MCP Hub (Agent coordination)    │  │
│  │                │◀───│ • Firehorse APIs                  │  │
│  └───────┬────────┘    │ • LWM Knowledge Base              │  │
│          │             │ • ERP Integrations (SAP, IFS)     │  │
│          │             └──────────────────────────────────┘  │
│          │                                                    │
│  ┌───────▼────────────────────────────────────────────────┐  │
│  │              MESSAGING CHANNELS                         │  │
│  │                                                         │  │
│  │  Slack (Team)  │  Telegram (Mobile)  │  Discord (Comm) │  │
│  │  WhatsApp (CX) │  Web UI (Admin)     │  iMessage (Exec)│  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Implementation Roadmap

**Phase 1 — Proof of Concept (Q1 2026)**

- Deploy Moltworker on DWS Cloudflare account
- Configure Telegram + Slack channels
- Connect to Claude via AI Gateway
- Test basic assistant functions (Q&A, web research, document summary)

**Phase 2 — DWS Skills Development (Q2 2026)**

- Build custom skill: Supabase knowledge search
- Build custom skill: Firehorse Report trigger
- Build custom skill: EU regulation monitor
- Connect persistent memory to LWM ontology tags

**Phase 3 — Customer-Facing Assistant (Q3 2026)**

- Deploy customer support instance (Discord/WhatsApp)
- Integrate Firehorse product catalog for sales assistance
- Add compliance Q&A with regulatory knowledge base
- Monitor with AI Gateway analytics

### Cost Projection

| Phase | Instances | Monthly Cost | Annual Cost |
|-------|-----------|-------------|-------------|
| Phase 1 (PoC) | 1 | ~$16 | ~$192 |
| Phase 2 (Internal) | 2 | ~$32 | ~$384 |
| Phase 3 (Customer) | 3-5 | ~$48-80 | ~$576-960 |

Compared to building a custom agent platform from scratch, this saves significant development time and infrastructure cost.

---

## Caveats and Risks

1. **Experimental status** — Moltworker is a proof of concept, not a supported Cloudflare product. May break without notice.

2. **Prompt injection** — Cisco's AI security team found third-party OpenClaw skills performing data exfiltration. All skills must be audited before deployment.

3. **Vendor dependency** — Running on Cloudflare creates platform dependency, though OpenClaw itself can be self-hosted elsewhere.

4. **Shell access** — The agent has shell access to its container. Sandbox SDK provides isolation, but defense in depth is required.

5. **Rate limiting** — Anthropic API rate limits apply. AI Gateway helps with monitoring but doesn't bypass limits.

---

## Ontology Tags

- **Geography:** Global > Cloud > Cloudflare Edge Network (EU regions available)
- **Sector:** Technology > Cloud_Infrastructure > Edge_Computing
- **Entities:** Cloudflare, OpenClaw, Moltbot, Peter Steinberger, Anthropic Claude, Sandbox SDK, AI Gateway, DWS IQ 6
- **Temporal Context:** 2026-Q1, Post-OpenClaw launch (Jan 2026)
- **Confidence:** High

---

## References

- [Cloudflare Blog: Introducing Moltworker](https://blog.cloudflare.com/moltworker-self-hosted-ai-agent/)
- [GitHub: cloudflare/moltworker](https://github.com/cloudflare/moltworker)
- [InfoQ: Cloudflare Demonstrates Moltworker](https://www.infoq.com/news/2026/02/cloudflare-moltworker/)
- [CNBC: From Clawdbot to OpenClaw](https://www.cnbc.com/2026/02/02/openclaw-open-source-ai-agent-rise-controversy-clawdbot-moltbot-moltbook.html)
- [DigitalOcean: What is OpenClaw?](https://www.digitalocean.com/resources/articles/what-is-openclaw)
- [Serenities AI: Cloudflare Moltworker Guide](https://serenitiesai.com/articles/cloudflare-moltworker-ai-agents-edge-2026)
- [A2A Protocol: Moltworker Complete Guide 2026](https://a2aprotocol.ai/blog/2026-moltworker-complete-guide)
- [Apidog: How to Run ClawdBot on Cloudflare](https://apidog.com/blog/run-clawdbot-cloudflare/)
- [OpenClaw Wikipedia](https://en.wikipedia.org/wiki/OpenClaw)
- [IBM Think: OpenClaw and the future of AI agents](https://www.ibm.com/think/news/clawdbot-ai-agent-testing-limits-vertical-integration)
- [Milvus Blog: OpenClaw Complete Guide](https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md)

---

## Action Items

- [ ] Deploy Moltworker PoC on DWS Cloudflare account
- [ ] Configure Telegram channel for team testing
- [ ] Audit OpenClaw default skills for security compliance
- [ ] Develop DWS-specific Supabase knowledge search skill
- [ ] Integrate with AI Gateway using DWS Anthropic API key
- [ ] Document deployment in Admin manual
- [ ] Add to DWS product catalog as internal tool

---

**Document Version:** 1.1
**Field Note Type:** Technical Evaluation / Product Recommendation
**Author:** Claude Code Session claude/molt-field-note-FFMhi
