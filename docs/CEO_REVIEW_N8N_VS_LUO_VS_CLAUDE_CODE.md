# CEO Review — n8n vs Luo vs Claude Code Dynamic Workflows

***

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code (Opus 4.8) | Session: claude/ceo-review-workflow-comparison-PNMzv | Date: 07.06.2026 | Changes: §11 — recorded the host decision: n8n self-host runs on DGX Spark (Tier 1), inheriting the cron skill's compute tiering; EU-owned VPS demoted to fallback. CLOUD Act-clean, free, in-region.
- Version: 1.1 | Tool: Claude Code (Opus 4.8) | Session: claude/ceo-review-workflow-comparison-PNMzv | Date: 07.06.2026 | Changes: Added §11 TODO — n8n self-host (EU, sovereignty-clean): provision/deploy, sovereignty & security, n8n↔agent MCP handoff, and governance checklists.
- Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/ceo-review-workflow-comparison-PNMzv | Date: 07.06.2026 | Changes: Initial creation — CEO-level strategic review of three workflow-automation paradigms (n8n visual/fair-code, Luo AI-native NL builder, Claude Code / Agent SDK code-native agentic). Triggered by competitor page luo.app/vs/n8n. Includes the dynamic-workflow spectrum, capability matrix, cost model, EU-sovereignty lens, and DWS build/buy recommendation.

Session Links & References:

- Claude Code (claude/ceo-review-workflow-comparison-PNMzv): https://github.com/blogtheristo/dws6/commits/claude/ceo-review-workflow-comparison-PNMzv
- Source competitor page: https://luo.app/vs/n8n/ (Cloudflare 403 on automated fetch — assessed via indexed snippets + public docs)
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/CEO_REVIEW_N8N_VS_LUO_VS_CLAUDE_CODE.md

Document Status:

- Created: 07.06.2026
- Last Modified: 07.06.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL — STRATEGY
- Document Type: CEO Review / Competitive Assessment

Related Documents:

- DSaaS_CLI_FIRST_STRATEGY.md (CLI-first mandate — the door is the `dws` CLI)
- DWS7_CLI_ROADMAP.md (CLI roadmap)
- GITHUB_CLI_VS_MCP.md (house style for tool-vs-tool comparison)
- AI_AGENT_GUIDELINES.md (BaseAgent, autonomy tiers, cost budgets)
- AGENTS.md (agent topology, signal dependencies)
- DWS_SECURITY_STANDARD.md (KYA, sandbox, prompt injection, NIS2/EU AI Act)
- DWS_MARKET_RESEARCH_STANDARD.md (competitive intelligence)

***

**Owner:** Lifetime Oy / DWS IQ
**Confidentiality:** Internal — Strategy
**Decision requested:** Confirm the build/buy posture in §9 (Recommendation).

---

## 1. Executive Summary (the one-screen version)

Three products are being compared, but they are **not the same kind of thing**. The marketing fight at `luo.app/vs/n8n` frames a two-horse race; the real question for DWS is a three-way one, and the three sit at different points on a single axis: **how much of the workflow the machine decides at runtime.**

| Contender | What it really is | Who decides the steps |
| --- | --- | --- |
| **n8n** | Visual, node-based automation engine (fair-code, self-hostable) | **You**, at design time. Deterministic graph. |
| **Luo** | AI-native, natural-language agent/workflow builder (hosted SaaS) | **Mixed** — you describe intent in NL; an LLM assembles and runs it. |
| **Claude Code / Agent SDK** | Code-native agentic runtime (terminal/library, MCP + subagents + hooks + skills) | **The model**, at runtime, inside guardrails you set. |

**Verdict for DWS.** This is not "pick one." DWS is a **CLI-first, EU-sovereign, agentic** company — our substrate already *is* the third category. The recommendation:

1. **Bet (already placed):** Claude Code / Agent SDK as the agentic core. It is what `dws` and the agent ecosystem are built on. Nothing here changes that.
2. **Adopt tactically:** n8n as **deterministic glue** — the boring, auditable, "fire this webhook → write this row → notify SES" plumbing that should *not* be an LLM decision. Self-hosted in-region, it is cheap and sovereignty-clean.
3. **Watch, don't buy:** Luo as a **UX reference and a competitor**. Its natural-language-to-workflow front door is the thing to learn from; its hosted-SaaS, non-EU-by-default posture is a sovereignty disqualifier for our regulated buyers.

**One-line answer to the CEO:** *Keep the agentic bet on Claude Code, bolt n8n underneath it for the deterministic 80%, and treat Luo as a mirror — it shows us the front door our CLI-first product is missing.*

---

## 2. Why the comparison is framed wrong

Luo's comparison page sells the classic AI-native pitch: *"n8n makes you wire nodes by hand; just tell Luo what you want."* That is a real UX gap and a fair jab. But it collapses two different decisions into one:

- **Decision A — Authoring:** how a human expresses the workflow (drag nodes vs describe in English vs write code).
- **Decision B — Execution:** how much is fixed vs decided live (static graph vs LLM-routed vs fully agentic loop).

n8n loses on Decision A's convenience and wins on Decision B's predictability. Luo wins authoring convenience and trades away predictability and control. Claude Code wins on adaptability and control-via-code, and trades away "non-technical user can build it unaided."

A CEO should not buy a paradigm because a landing page won the authoring argument. **The execution argument is where the money and the risk live.**

---

## 3. The Dynamic-Workflow Spectrum

```
 STATIC / DETERMINISTIC  ───────────────────────────►  FULLY AGENTIC / DYNAMIC
 (you fix every step)                                   (model decides every step)

   n8n                         Luo                          Claude Code / Agent SDK
   ┌───────────┐               ┌───────────┐                ┌───────────────────┐
   │ node graph│               │ NL → agent│                │ agent loop + tools│
   │ fixed     │               │ LLM-routed│                │ MCP + subagents   │
   │ replayable│               │ semi-fixed│                │ hooks + skills    │
   └───────────┘               └───────────┘                └───────────────────┘
   Predictable                 Convenient                    Adaptable
   Auditable                   Fast to author                Handles ambiguity
   Brittle to change           Opaque at runtime             Hard to make deterministic
```

**Reading the spectrum:** the further right you go, the better you handle *ambiguous, judgment-heavy, changing* tasks — and the harder it gets to guarantee the *same input → same output*. For DWS, regulated outputs (compliance scoring, carbon math, contract clauses) want the **left/middle**; open-ended work (research, triage, code, customer reasoning) wants the **right**. We need all three positions, which is exactly why "pick one" is the wrong question.

---

## 4. Contender Profiles

### 4.1 n8n — the deterministic workhorse

- **What it is:** Fair-code (n8n Sustainable Use License) workflow automation. Visual node canvas, 400+ integrations, custom-code nodes, native AI nodes (LLM + agent + vector stores — Pinecone, Qdrant, Weaviate, Supabase pgvector). Self-host or cloud.
- **Execution model:** Deterministic graph. Steps run in the order you wired them. AI lives *inside* nodes as bounded calls; the orchestration stays human-defined and replayable.
- **Cost:** Self-hosted Community Edition is **free, unlimited executions** (you pay ~€3–7/mo server + your own LLM tokens). Cloud: Starter €24/mo (2,500 exec), Pro €60/mo (10k exec), Business €800/mo (SSO, 40k exec), Enterprise custom.
- **Strengths:** Predictable, auditable, cheap at volume, huge connector library, self-hostable in-region. Excellent for repeatable ops plumbing.
- **Weaknesses:** Authoring is manual node wiring; brittle when requirements shift; not built for open-ended reasoning. Business-tier features need a license key that **phones home daily** to n8n's license server — a sovereignty footnote, not a blocker.
- **DWS fit:** **High** — as infrastructure plumbing under the agent layer.

### 4.2 Luo (luo.app) — the AI-native front door

- **What it is:** A hosted "build your AI workspace / agents that connect to tools" platform. Pitch: describe what you want in natural language; Luo assembles and runs the agent/workflow. Tiers for solo professionals, small teams, organizations.
- **Execution model:** Mixed. NL intent → LLM-assembled, LLM-routed execution. More dynamic than n8n, more packaged than raw Claude Code.
- **Cost:** Public pricing page exists (`luo.app/pricing`); specifics were not retrievable for this review (site blocks automated fetch). Treat tier/price as **to be verified** before any quoting.
- **Strengths:** Lowest authoring friction; appealing to non-technical operators; rides the AI-native wave.
- **Weaknesses (for DWS specifically):**
  - **Sovereignty:** Hosted SaaS, no evidence of EU data residency / EU-owned infra / CLOUD Act insulation. For CSRD/NIS2-regulated buyers this is a **disqualifier** until proven otherwise.
  - **Maturity / lock-in:** Newer entrant, thin public footprint, proprietary. Workflows are not portable the way code or n8n JSON are.
  - **Determinism:** Runtime is opaque — bad for regulated, replayable outputs.
- **DWS fit:** **Low as a dependency; high as intelligence.** Do not build on it. Do study its onboarding UX — it is doing the "talk to it, get a workflow" thing our CLI-first product should expose more aggressively.

### 4.3 Claude Code / Claude Agent SDK — the agentic core

- **What it is:** The runtime behind Claude Code, exposed as a library (renamed Claude Code SDK → **Claude Agent SDK**, Sept 2025; Python + TypeScript). Same agent loop, context management, and tool use that power this very session.
- **Execution model:** Fully agentic. The model plans and acts in a loop, using **MCP** (connect to DBs, trackers, browsers, internal APIs), **subagents** (context-isolated specialists), **hooks** (PreToolUse/PostToolUse/Stop/SessionStart… for validate/log/block/transform), and **skills** (Markdown procedures invoked as slash commands).
- **Cost:** Your model tokens + infra. Note the **June 15, 2026 change**: Agent SDK / `claude -p` usage on subscription plans draws from a **separate monthly Agent SDK credit** — budget owners should re-baseline.
- **Strengths:** Maximum adaptability and judgment; runs where the work is (repo, terminal, CI, edge); programmable guardrails; portable (it's code + Markdown, not a proprietary canvas); MCP makes it operate real systems, not just chat.
- **Weaknesses:** Not a no-code tool for non-engineers; non-deterministic by nature (mitigated with hooks, skills, eval gates, and KYA controls); cost/latency need governance (see AI_AGENT_GUIDELINES autonomy tiers + cost budgets).
- **DWS fit:** **Native.** This *is* the DWS substrate (`dws` CLI, agent ecosystem, skills, MCP hub, hooks, KYA). No migration; only deepening.

---

## 5. Capability Matrix

| Dimension | n8n | Luo | Claude Code / Agent SDK |
| --- | --- | --- | --- |
| Primary paradigm | Visual node graph | NL → AI agent | Code-native agent loop |
| Who decides steps at runtime | Human (design time) | LLM + human intent | Model (in guardrails) |
| Determinism / replayability | ★★★★★ | ★★☆☆☆ | ★★☆☆☆ (★★★★ with hooks/skills/evals) |
| Handles ambiguity / judgment | ★★☆☆☆ | ★★★★☆ | ★★★★★ |
| Authoring friction (non-technical) | ★★★☆☆ | ★★★★★ | ★★☆☆☆ |
| Integration breadth | ★★★★★ (400+) | ★★★☆☆ | ★★★★★ (via MCP, open) |
| Self-host / in-region | ★★★★★ | ✗ (hosted SaaS) | ★★★★★ (your infra) |
| EU sovereignty / CLOUD Act posture | ★★★★☆ (self-host; license phone-home) | ★☆☆☆☆ (unverified) | ★★★★★ (model endpoint is the only variable) |
| Portability / lock-in risk | ★★★★☆ (JSON export) | ★★☆☆☆ (proprietary) | ★★★★★ (code + Markdown) |
| Cost at volume | ★★★★★ (free self-host) | ❓ (verify) | ★★★☆☆ (token-governed) |
| Auditability for regulated output | ★★★★★ | ★★☆☆☆ | ★★★★☆ (with hook audit log) |
| Maturity / ecosystem | ★★★★★ | ★★☆☆☆ | ★★★★☆ (fast-growing) |

(★ = relative, not absolute. ❓ = unverified for this review.)

---

## 6. The EU-Sovereignty Lens (the DWS filter that re-orders everything)

For a generic startup, this is a feature/price/UX call. For DWS, **sovereignty is the first filter**, and it re-ranks the field:

- **n8n self-hosted:** Runs entirely on EU infra you control. Clean — the only leak is the optional Business-tier license phone-home (metadata, not customer data). **Sovereignty-acceptable.**
- **Claude Code / Agent SDK:** The runtime is yours; the only external surface is the model endpoint. With EU/region routing (or DGX Spark / Ollama fallback per the ollama-spark path for EU-only prompts), this is **sovereignty-controllable**. **Acceptable.**
- **Luo:** Hosted SaaS, residency/ownership unverified → presumed US/CLOUD Act exposure → **not acceptable** for regulated workloads until proven. **Fails the first filter.**

So the moment we apply our own standard, the "n8n vs Luo" landing-page fight is moot: **Luo is out for production**, and the real choice is how we *combine* n8n and Claude Code.

---

## 7. The combination architecture (how they actually fit together)

The mature pattern is not n8n **or** agents — it is **deterministic rails + agentic judgment**:

```
        ┌──────────────────────────────────────────────────────┐
        │  Claude Code / Agent SDK  (judgment, ambiguity, code) │
        │  subagents · skills · hooks · KYA · MCP               │
        └───────────────┬──────────────────────────────────────┘
                        │ calls / is called by (MCP, webhook)
        ┌───────────────▼──────────────────────────────────────┐
        │  n8n  (deterministic glue: schedules, fan-out,        │
        │  connectors, retries, idempotent writes, SES, audit)  │
        └───────────────┬──────────────────────────────────────┘
                        │
        ┌───────────────▼──────────────────────────────────────┐
        │  Systems of record (Supabase/RLS, SES, stores, APIs)  │
        └───────────────────────────────────────────────────────┘
```

- Let the **agent** decide *what* to do when the task needs judgment.
- Let **n8n** do *the same thing every time* when the task is mechanical — and give you the replayable audit trail regulators want.
- Expose each to the other via **MCP / webhooks** so the agent can trigger deterministic pipelines and n8n can hand ambiguous steps up to the agent.

This is the "structured agent" pattern the industry converged on in 2026: agents are better at judgment; static graphs win on reliability, auditability, and maintainability — so you use each for what it's good at.

---

## 8. Cost & Risk Snapshot

| | n8n | Luo | Claude Code / Agent SDK |
| --- | --- | --- | --- |
| Floor cost | ~€0 (self-host + server) | Subscription (verify) | Token + infra |
| Scales with | Server size | Seats/usage tier | Tokens / autonomy |
| Lock-in | Low (export JSON) | High (proprietary) | Low (code + MD) |
| Top risk | Brittle to change; manual upkeep | Sovereignty + vendor maturity | Non-determinism + token spend |
| Mitigation | Keep agentic tasks out of n8n | Don't build on it | Hooks, skills, evals, KYA, cost budgets |

---

## 9. Recommendation (decision requested)

1. **Confirm the standing bet.** Claude Code / Claude Agent SDK remains the DWS agentic core. No change; deepen skills/hooks/KYA governance and re-baseline budgets for the **15 Jun 2026 Agent SDK credit** change.
2. **Approve n8n (self-hosted, EU) as sanctioned deterministic glue.** Use it for the mechanical 80% — schedules, fan-out, connectors, retries, idempotent writes, SES notifications, audit trails. Pilot one real pipeline (e.g. outreach digest or a scheduled compliance export) to validate the n8n↔agent MCP handoff.
3. **Do not adopt Luo.** It fails the sovereignty filter for regulated buyers and adds proprietary lock-in. **Do** assign it to competitive-intelligence watch (DWS_MARKET_RESEARCH_STANDARD) and **steal its best idea**: a natural-language front door. Our CLI-first product should let a user *describe* the workflow and have the agent assemble it — that is Luo's whole wedge, and we can do it sovereign.
4. **Strategic takeaway for positioning.** The market is racing toward "describe it, don't wire it." DWS already owns the hardest end of that spectrum (true agentic + sovereign). The gap is **approachability**. Closing it — NL onboarding over the `dws` CLI / agent layer — is where the next product point is.

---

## 10. Open items / to verify

- [ ] Luo pricing tiers and data-residency posture (site blocks automated fetch — verify manually before any external claim, per DWS_TRUTH_STANDARD).
- [ ] n8n Business-tier license phone-home: confirm it transmits only metadata, document for sovereignty sign-off.
- [ ] Cost model for the n8n pilot pipeline under the new Agent SDK credit accounting.
- [ ] Decide owner + scope for the "NL front door over `dws`" exploration (ties to DWS7_CLI_ROADMAP).

---

## 11. TODO — n8n Self-Host (EU, sovereignty-clean)

Action item from §9.2. Goal: a self-hosted, in-region n8n acting as deterministic glue under the agent layer, validated with one real pipeline + the n8n↔agent MCP handoff.

**Where to run — DECIDED: DGX Spark (Tier 1).** This inherits the existing house compute decision in the `cron` skill: **Tier 1 = DGX Spark (primary, free, 24/7)**, GHA = paid fallback. DGX Spark is already the sanctioned EU-sovereign in-house box (runs scheduled work + EU-only Ollama inference via the `dgx-spark` SSH alias). It is free, in-region, and CLOUD Act-clean — the natural n8n host. EU-owned VPS is the **fallback only** if DGX capacity/uptime is insufficient for an always-on web service.

**Provision & deploy**

- [ ] Deploy n8n Community Edition via Docker on **DGX Spark** (Postgres-backed, not SQLite); reuse the `dgx-spark` SSH alias / existing host conventions.
- [ ] Confirm DGX Spark can carry an always-on web service alongside cron + Ollama (resource/port budget — n8n UI + webhook listener). If not, fall back to EU-owned VPS and record the reason.
- [ ] Put behind TLS + auth (reverse proxy); restrict admin UI to VPN / allowlist.
- [ ] Set secrets via environment variables only (CLAUDE.md Rule 1–2); no secrets in workflow JSON.
- [ ] Configure SES (SMTP) as the only email transport (Rule 3–4); never `noreply@` senders.

**Sovereignty & security**

- [ ] Stay on Community Edition for the pilot → avoids the Business-tier license phone-home; if Business features needed later, document the metadata-only phone-home for sign-off (§10).
- [ ] Confirm no customer data leaves EU region; enable execution data pruning/retention policy.
- [ ] Add n8n to the KYA / audit posture; treat workflow outputs as untrusted input downstream (DWS_SECURITY_STANDARD).

**Integration (the actual point)**

- [ ] Wire one pilot pipeline (candidate: outreach digest **or** scheduled compliance export).
- [ ] Validate the **n8n↔agent MCP/webhook handoff** both directions: agent triggers an n8n pipeline; n8n hands an ambiguous step up to the agent.
- [ ] Register the pipeline in the scheduler/discovery path per the Script Automation Rule — no human-memory triggers.

**Govern**

- [ ] Capture cost model under the new Agent SDK credit accounting (§10).
- [ ] Back up n8n Postgres + workflow JSON exports (export = portability / low lock-in).
- [ ] Assign an owner + decide whether this becomes a `/`-invocable skill once the pattern repeats (Skill Codification Rule).

---

*Prepared as an internal CEO review. External assertions of any DWS "canonical fact" (pricing, counts, framework names) must be resolved through `DWS_TRUTH_STANDARD.md` before publication.*
