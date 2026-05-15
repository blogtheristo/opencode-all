---
title: "Field Note — Cline SDK 2.0 vs. Firehorse Product Line"
author: DWS IQ 6 Platform
date: 2026-05-15
status: evaluation
tags: [agents, sdk, harness, firehorse, cline, evaluation]
---

# Field Note — Does Cline SDK 2.0 have a use in the Firehorse product line?

**TL;DR:** Yes, but narrowly. Cline SDK is a credible agent runtime for the *outreach / workflow / briefing* pillars of Firehorse (Omnichannel, Automation, Situation+Control rooms). It is **not** a fit for the *deterministic* core (`report_engine.py`, EN 15978 calculations). Recommended: one contained pilot on **Firehorse Omnichannel investor outreach**. Do not rip-and-replace LlamaStack, MCP hub, or `report_engine.py`.

---

## 1. What Cline 2.0 actually ships

From the launch note:

- Open-source agent runtime (`@cline/sdk`) + rebuilt CLI (`npm i -g cline`).
- Rewritten harness: simplified loop, tighter context, better feedback/error handling, redesigned tool surfaces.
- Built-ins: plugins, custom tools, MCP connectors, skills, sub-agents / agent teams, checkpointing, scheduled jobs, web search.
- Provider portability: Anthropic, OpenAI, Google, Bedrock, Mistral, LiteLLM, OpenAI-compatible endpoints.

Positioning: a **library for building agents**, not a vertical product.

## 2. Firehorse pillars and what they actually are

| Pillar | What it is today | LLM-shaped or deterministic? |
|---|---|---|
| **Reports** (`report_engine.py`, FastAPI on `:8084`) | Python engine that loads JSON templates, fetches Supabase project + carbon data, validates EN 15978, exports PDF/DOCX/XLSX/PPTX | **Deterministic.** Carbon factors, EPD lookups, A1–D stage maths, signature blocks. No reasoning loop wanted. |
| **Automation** (FastAPI on `:8085`) | Rule-based workflow engine: `trigger → action[]`, where `action_type ∈ {generate_report, send_email, send_whatsapp, call_webhook, …}` | **Mostly deterministic**, but agentic if the trigger is fuzzy ("budget looks off this week") instead of `>= 90%`. |
| **Omnichannel** (Investors / Customers / Partners) | Cold outreach — 20 investor emails/day, Supabase contact DB, LinkedIn Sales Navigator, template-driven personalization, lead scoring, follow-ups | **Strongly agent-shaped.** Researcher → personalizer → sender → follow-up is a textbook agent team. |
| **Situation Rooms** (Board / Finance CxO / Managers) | Role-tailored strategic briefings | Agent-shaped — synthesize KPIs into a role-specific narrative. |
| **Control Rooms** (Constructor / Contractor / Engineer / Site Chief / Specialized) | Role-tailored operational briefings | Agent-shaped — same reason, operational tier. |
| **ContentMS** | Email templates, subject variations, landing copy, pitch deck blocks | Agent-shaped for drafting, deterministic for serving. |

## 3. Where Cline SDK 2.0 *adds* something

### 3.1 Omnichannel investor outreach (strongest fit)
This is the workflow Cline SDK was built for:
- **Scheduled jobs** native → maps to "20 cold emails/day" cron.
- **Agent teams** native → researcher (firmography, fund stage, thesis match) → personalizer (template + investor profile) → sender → follow-up classifier.
- **Checkpointing** → critical for multi-day follow-up sequences that survive process restarts.
- **MCP connectors** → reuse our existing Supabase MCP for the contact DB.

Today `Firehorse/Omnichannel/` is procedural and template-driven. A Cline-SDK-based team would let each investor be *reasoned about* against current Lifetime/DWS positioning rather than slot-filled.

### 3.2 Situation & Control rooms (medium fit)
Each role view (`BOARD_VIEW.md`, `FINANCE_CXO_VIEW.md`, `SITE_CHIEF_VIEW.md`, …) is a *prompt + data-source contract*. Cline SDK's plugin + custom-tool model maps cleanly: one tool per data source (project_carbon view, carbon_budget view, SPI/CPI, weather, KYA score), one sub-agent per role. Currently these views live as static markdown, so almost any agent runtime is a step up.

### 3.3 Automation engine — fuzzy triggers (medium fit)
The current `TriggerType` enum is `SCHEDULE | WEBHOOK | EVENT | THRESHOLD | MANUAL`. The threshold trigger is `metric op value` — purely arithmetic. Cline SDK enables a `INTENT` or `NARRATIVE` trigger ("alert me when the project looks like it's drifting") without us building the reasoning layer.

### 3.4 ContentMS drafting (medium fit)
LSJ (Lifetime Scope Monthly) drafting, investor INTRO_*.md generation, the `lsj-publish` skill — these are already Claude-shaped tasks that today run inside Claude Code. Putting them on Cline SDK lets the same logic run **outside** an interactive coding session, on a schedule, with checkpoints.

## 4. Where Cline SDK 2.0 *doesn't* help — or makes things worse

### 4.1 `report_engine.py` — no
Generating a compliant EN 15978 PDF doesn't need an LLM loop. Reasoning over `kgCO2e` numbers is where hallucinations cost us regulatory pain (Fit for 55, CSRD). Keep this code-only.

### 4.2 Duplication with the existing stack
DWS already has:
- **LlamaStack** as the multi-agent orchestrator (per `AGENTS.md`).
- **MCP hub** + `mcp-servers/{supabase-official, cloud-run-gateway, clawdbot-dream}` for tool wiring.
- **Lifetime Scope Signals** protocol for inter-agent comms.
- **Anthropic SDK** (`@anthropic-ai/sdk ^0.32.0`) inside Cloudflare `worker-agent.ts`.
- A rich Claude-Code skills layer: `agent-run`, `discover-agents`, `workflow`, `case-run`, `clawdbot`, `kya`, `ollama-spark`.

Adopting Cline SDK across the board means **two agent runtimes** to maintain, not one. The Lifetime Scope Signals protocol does not exist in Cline's worldview, and the `kya` trust-score / TC-4 Leash Snap controls are DWS-specific safety primitives we'd have to re-implement on top of Cline's harness.

### 4.3 Sovereignty / EU residency friction
DWS has explicit sovereignty rules (`sovereignty-assess` skill, CLOUD Act exposure, GDPR posture). Cline SDK's default providers (Anthropic US, OpenAI US, Google US) violate residency for EU customer data. Solvable through:
- LiteLLM → Bedrock `eu-central-1` / `eu-west-1`, or
- `ollama-spark` route to the on-prem DGX Spark.

Solvable, but it's *our* config burden, not something the SDK helps with.

### 4.4 CLI surface conflict
DWS engineering runs in Claude Code, not Cline CLI. We have CLAUDE.md, hooks, skills, GitHub MCP, web sessions, and an established review pipeline (`/review`, `/ship`, `/ultrareview`). Switching the dev CLI is not on the table. **Treat Cline SDK as a Node library only; ignore the CLI.**

### 4.5 Email transport
Cline's "send email" examples will reach for Resend / generic SMTP. **CLAUDE.md rule 4: SES SMTP only, no Resend.** Any pilot must wrap sends in our existing `email` skill / SES path.

## 5. Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Two parallel agent runtimes (Cline SDK + LlamaStack) | High | Pilot scope-fenced to Omnichannel only; no migration of existing agents. |
| Non-EU model routing exfiltrates customer data | High | All model calls through LiteLLM with EU endpoints + Ollama-Spark fallback. Block direct Anthropic/OpenAI URLs at the egress layer. |
| Resend creeps in via "send email" tool | Medium | Custom SES tool registered; default email tool disabled. |
| Hallucinated carbon numbers in agent-generated reports | High | Reports stay code-only. Agents may *narrate* numbers fetched from Supabase but cannot compute them. |
| Loss of Lifetime Scope Signals coordination | Medium | Build a Signals adapter as a Cline plugin in the pilot; do not bypass the protocol. |
| KYA trust-score / Leash Snap not honored | Medium-High | Wrap every Cline-SDK agent session in a KYA-bound supervisor before any side-effect action. |
| Vendor lock to a 0.x OSS runtime | Medium | Library-only adoption; keep tools/prompts portable so we can drop back to LlamaStack or direct Anthropic SDK. |

## 6. Pilot proposal (small, measurable, kill-switchable)

**Scope:** Rebuild the Firehorse investor outreach loop on `@cline/sdk` behind the existing `Firehorse/Automation` FastAPI surface.

**Architecture sketch:**

```
Firehorse/Automation (existing FastAPI :8085)
  └── POST /v1/workflows/{id}/execute  ── for trigger_type = "investor_outreach"
        └── invokes ClineRunner(team="investor-outreach")
              ├── Tools (Cline SDK plugins)
              │     ├── supabase.investors (MCP)            ── existing
              │     ├── ses.send_email                       ── new wrapper (rule 4)
              │     ├── linkedin.lookup                      ── existing connector
              │     └── signals.emit / signals.listen        ── Lifetime Scope Signals adapter
              ├── Sub-agents (Cline agent team)
              │     ├── researcher  (firmography + thesis match)
              │     ├── personalizer (template → INTRO_*.md draft)
              │     ├── sender      (HIL gate, then SES SMTP)
              │     └── follower    (classify replies, schedule next touch)
              └── Routing: LiteLLM → Bedrock eu-central-1, fallback Ollama-Spark
```

**Success metrics (8-week pilot, decide go/no-go after):**
- Response rate ≥ baseline + 30%.
- Personalization quality scored by Risto on a 10-investor sample.
- Token cost ≤ €0.40 per investor touch.
- Zero non-EU model calls in logs.
- Zero Resend calls in logs.

**Kill switch:** the FastAPI endpoint feature-flags Cline-SDK execution; flipping it off reverts to the current procedural pipeline.

## 7. Decision

- **Adopt as a library, in one pillar.** Don't adopt as a CLI, don't replace LlamaStack, don't touch `report_engine.py`.
- **Pilot: Omnichannel/Investors.** It is the highest-fit pillar, it is contained, and it has measurable revenue impact (V1 SAFE round, German Messe).
- **Reassess after 8 weeks** before extending to Situation/Control rooms or ContentMS drafting.

## 8. Open questions for the Cline team

1. Does the harness expose hooks compatible with our **Lifetime Scope Signals** protocol (signal-emit, signal-listen on milestones)?
2. Is checkpointing process-local or persistable to Postgres/Supabase? Multi-day follow-up sequences need durable state.
3. License + governance of the SDK plugins — can we ship a custom plugin (SES-only email tool) without forking?
4. Sub-agent context isolation: does each role agent get its own context window, or do they share?
5. EU residency story for the managed offering (if any) — what's the data path for telemetry?

---

**Author note:** This is a fit assessment, not a procurement decision. No code has been written against `@cline/sdk` yet. If approved, the pilot lands as a new module under `Firehorse/Automation/cline_runner/` with the SES + Signals adapters tested before any live investor send.
