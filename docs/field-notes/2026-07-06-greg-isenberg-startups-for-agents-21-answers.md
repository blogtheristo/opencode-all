# Field Note: Greg Isenberg's "Startups for Agents" — The DWS Answer to All 21 Points

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Field Note / Strategy / Competitive Positioning
- Author: Claude Code (Claude Code session) + risto.paarni2024@lifetime.fi
- Date: 2026-07-06
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/agent-infrastructure-ideas-1jtgms

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Date: 06.07.2026 | Changes: Added the §13 protocol addendum after researching Google's agentic commerce stack (AP2 v0.2 at FIDO Alliance, UCP, ACP): the wire protocol points 11/13 anticipated has arrived, and the KYA Standard was updated to v1.8 (§14 Agentic Commerce Mandate Gating) in the same session — mandate gating by ATS band, Capability Manifest v1.3 spend_authority, W3C VC interop, Verifiable Intent ↔ Article 12 evidence chain.
- Version: 1.0 | Tool: Claude Code | Date: 06.07.2026 | Changes: Initial field note — Greg Isenberg's 21-point "build startups for agents" X thread mapped point-by-point against what DWS already ships, what is partial, and what is an honest gap. Each answer cites the repo artifact or standard that backs it. Thesis extracted: points 6, 7, 8, 9, 10, 14 are one product (KYA governance), not six startups, and EU AI Act Article 12 makes that layer mandatory — the Doctrine Shift pillar applied to agent infrastructure.

Document Status:

- Created: 06.07.2026
- Last Modified: 06.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

Related Documents:

- `Legal/KYA_STANDARD_v1.md` (Know Your Agent / Know Your Architecture — the governance layer most of these points reduce to)
- `Legal/KYA_SECURITY_v1.2.md` (identity, isolation, kill, forensics, memory audit trail)
- `Legal/KYA_OPTIMIZATION_v1.4.md` (efficiency, attribution, ROI, memory-driven financial intelligence)
- `AI_AGENT_GUIDELINES.md` (autonomy tiers §7, cost budgets, execution logging)
- `AGENTS.md` (agent topology, READY/COMPLETE/ERROR/BLOCKED signal protocol)
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` (EU AI Act record-keeping — the regulatory forcing function)
- `DWS_TRUTH_STANDARD.md` §2A (positioning pillars — Doctrine Shift is the "why now" for this whole list)
- `docs/20-MOAT-FORTRESS.md` (19 moats + Layer 0)
- `docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md` (choosing the dominant game — this note names DWS's dominant game in agent infrastructure)

---

## The Source

Greg Isenberg (@gregisenberg), via X, circulated 06.07.2026: **"Build startups for agents. I think it's the biggest opportunity of the next 10 years."** — followed by 21 numbered infrastructure categories, closing with _"The internet got built for people. Mobile got built for people. This wave gets built for machines, and we're as early as it gets."_

> ⚠️ Thread text supplied by the founder from X; treat exact wording as MEDIUM confidence for external quotation. The category list itself is what this note responds to.

## Ontology Tags

- **Geography:** Global > United States (creator economy VC lens) > Europe (DWS regulated-industry lens)
- **Sector:** Enterprise AI > Agent infrastructure > Governance / payments / identity / observability
- **Entities:** Greg Isenberg, Lifetime Oy / DWS IQ 6, KYA, Lifetime Fleet, DGX Spark
- **Temporal Context:** 2026-Q3
- **Confidence:** HIGH (repo-artifact claims verified against source files at write time)

---

## 0. The One-Paragraph DWS Answer

Greg's list reads as 21 startups. DWS's read: it is **three products and a doctrine**. Points 2, 6, 7, 8, 9, 10, 11, 14 are all the same product — **agent governance (KYA)**: identity, trust score, capability gating, spend control, forensic replay, fault attribution, liability. Points 3, 5, 19 are the **memory + docs + versioning substrate** an agent fleet runs on (a git repo with standards, which DWS already operates as its production pattern). Points 15, 16, 17, 18 are the **physical/sovereign runtime** (owned hardware, fleet devices, real-world verification). The doctrine: in the EU this layer is not optional tooling — the AI Act makes logging, human authority, and risk controls **mandatory sovereign infrastructure** (Positioning Pillar 1, Doctrine Shift). Whoever sells the governed outcome layer wins; the component startups get absorbed into it (Pillar 2, Orchestration Over Components).

Status legend per point: **HAVE** (shipping in repo today) · **PARTIAL** (real artifact, not yet a sellable product) · **GAP** (honest miss — roadmap or deliberate no).

---

## 1. "Be the tool the harness loads by default" — HAVE

DWS codified this as the **Agent Productization Rule** (`CLAUDE.md`): every production capability must be agent-accessible — CLI path, structured JSON output, MCP exposure, skill registration in `skills/manifest.json`. The `mcp-hub/` and `mcp-servers/` trees exist precisely so that when a harness (Claude Code, or any MCP client) connects, DWS capabilities are what it reaches for. The distribution insight Greg names is already an operating rule here, not an aspiration. **Next:** publish selected DWS MCP servers to public MCP registries so third-party harnesses discover them by default.

## 2. Spend controls — "Ramp for agents" — HAVE (internal), PARTIAL (as product)

Three enforcement layers already run: (a) `CLAUDE_AUTO_MODE_BUDGET` env-gated session budgets surfaced by `.claude/hooks/session-start.sh`; (b) Engineering Discipline Rule 6 — token budgets are not advisory (4,000/task, 30,000/session): past budget, stop, checkpoint, re-scope; (c) per-agent cost budgets in `AI_AGENT_GUIDELINES.md`. KYA-Optimization adds the financial-attribution layer (which agent earned/spent what). What DWS has not done is sell this standalone — it ships inside the governed platform. That is deliberate: spend control without identity (point 7) is a leaky bucket.

## 3. Memory agents can trust — HAVE

This is a core DWS bet, in two tiers. Operational: `.claude/HANDOFF.md` (git-committed cross-session memory that survives ephemeral containers) plus `kb/` ingestion. Product: the **Lifetime World Model (LWM)** — per-industry ontology + LWM base, fine-tuned per enterprise (`DWS_TRUTH_STANDARD.md` row 20), with the **dual LWM + client memory architecture and memory audit trail** governed under KYA-S v1.5 §10. Greg's word is "trust" — DWS's differentiator is exactly that the memory is _audited_: every fact extraction is governed (PR-254 pattern), so an agent can know not just what the memory says but where it came from. "Shared brain" without provenance is how agents get poisoned.

## 4. Safe sandboxes for agents — HAVE

The category "nobody's clocked" is the founding pillar of KYA v1.0: **Firecracker MicroVM isolation** (`Legal/KYA_STANDARD_v1.md`, §Pillar architecture) and `src/cloudflare/tenant-sandbox.ts`. The tagline is literally _"Verify the Human. Sandbox the Agent."_ Operationally the same idea runs as the auto-mode trust boundary: GREEN (full auto) / YELLOW (auto + audit-logged) / RED (blocked, human required — payments, outbound email, migrations). An agent in a DWS session physically cannot touch the real Stripe write path without a human; that's the sandbox pattern Greg describes, enforced by hooks, not by politeness.

## 5. Docs are the product — agents onboard by reading — HAVE

This repo is the proof: `CLAUDE.md` is the onboarding flow, the Resolver routing table is the nav menu, `skills/<name>/SKILL.md` files are the feature docs, and `AGENTS.md` is auto-generated from code (`scripts/sync-agents-md.mjs`) so the docs cannot drift from the product. The Skill Codification Rule ("asked twice = failure") means every repeatable capability ends up as a documented, parameterized procedure an agent can load cold. For customers, the same pattern ships as per-industry ontologies — the machine-readable doc layer an enterprise agent onboards against. **Next:** treat customer-facing docs with the same rigor — an `llms.txt`-grade agent onboarding surface for dws10.com products.

## 6. Track record before you trust an agent — HAVE

This is the **Agent Trust Score (ATS)** — a computed, formula-defined score with an executable engine (`src/identity/ats-engine.ts`), Capability Manifests, and a Subagent Registry with path-scoped access control and KYA Violation enforcement (KYA §8). Trust score ranges carry financial multipliers — a higher-trust agent is literally cheaper to insure and license (KYA §9). Greg says a checkable track record "becomes real money"; KYA already prices it. This is one of the strongest claims DWS can make externally: not "we will build agent reputation" but "we have a scoring standard and an engine."

## 7. Prove the agent acts for a real person with authority to spend — HAVE

KYA Pillar 1, Identity Attribution: **verify the human, then bind the agent to that verified human** — the Shufti partnership positioning exists for exactly the human-KYC half (`docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md`). Organizationally the same principle is the **HIC (Human-In-Command)** model: every agent chain terminates in an accountable human, and the `/kya` skill can check a session trust score or trigger a TC-4 Leash Snap on a compromised chain. Who builds the permission layer? This is the layer DWS builds. It is the keystone point of the whole thread — 2, 8, 10, 11, and 14 are unbuildable without it.

## 8. Escrow that releases on verified done — PARTIAL

DWS has the _verification_ half: the verification-gate discipline skill (`/goal` — explicit success criteria, loop until verified), the quality-gate agent, and scored structured output from every `/agent-run`. What does not exist is the _money movement_ half — no escrow rails. Honest gap. The DWS position: verified-done is the hard part and the differentiated part; escrow release is a Stripe/PSP integration on top of a verification signal you can trust. Roadmap fit: emit a signed "job verified complete" attestation from the quality gate that any escrow provider can consume.

## 9. "Why did my agent do that" replay — HAVE

KYA Pillar 3 is **Forensic Observability** with court-defensible audit trails; every YELLOW-zone action logs to `.claude/hooks/audit/`; agent execution logging is mandated by `AI_AGENT_GUIDELINES.md`; and `DWS_ARTICLE_12_LOGGING_STANDARD.md` aligns the whole thing to EU AI Act Article 12 record-keeping. Greg is right that this will be "mega valuable" — but in the EU it is not merely valuable, it is _required_ for high-risk deployments. Selling replay as a debugging tool undersells it; DWS sells it as the compliance artifact that keeps a deployer out of Art. 99(4) penalty territory (€15M / 3%).

## 10. A judge for agent disputes — PARTIAL

The evidence layer exists: **Fault Attribution in Supabase** (KYA §8.4) records which agent in a chain caused a failure, and the audit trail is built to be court-defensible. The Themis coordination pattern (`/case-run`) handles multi-agent case management. What does not exist: an arbitration _service_ between two strangers' agents. DWS's read: machine courts will not be neutral startups; they will be the governance layer both parties already run, plus existing arbitration law. The winning move is producing evidence a real court accepts — which is what Article 12 logging is.

## 11. Throwaway payment methods per task — GAP

No virtual-card issuance in DWS. Adjacent controls exist (RED-zone payment blocking, per-agent budgets) but per-task ephemeral cards are a fintech licensing business — Ramp/Stripe Issuing territory. Deliberate no for now: DWS supplies the authorization signal (points 6/7 — _should_ this agent be allowed to spend, and on whose authority), and card issuers supply the rails. Partner, don't build.

## 12. Reliable high-throughput access when rate limits kill workflows — HAVE

Lived and solved internally: `src/agents/model-selector.ts` runs a tier-based multi-vendor router (Claude, Gemini 2.5/3, Llama, Qwen), and the `ollama-spark` skill fails over to **self-hosted open models on owned DGX Spark / NVIDIA hardware** when Anthropic/Groq limits hit or a prompt must stay EU-resident. Canonical posture: DWS is not single-sourced to any frontier lab (`DWS_TRUTH_STANDARD.md` §2D). Greg frames this as a reselling business; the DWS frame is sovereignty — the customer's workflow survives any single vendor's rate limiter _and_ any single vendor's jurisdiction.

## 13. Agent-to-agent negotiation protocol — GAP (with a defined position)

Does not exist here, and Greg is right that it barely exists anywhere. What DWS has is the precondition stack: inter-agent signaling (READY / COMPLETE / ERROR / BLOCKED dependency protocol in `AGENTS.md`) and priced capability manifests. Position: negotiation between unidentified, unscored agents is adversarial noise — millisecond haggling only works after both sides can check the other's ATS (point 6) and authority binding (point 7). When an open negotiation protocol emerges (A2A-class), DWS adopts it and supplies the trust layer underneath rather than competing on the wire format.

> **Addendum 06.07.2026 (v1.1):** the wire protocols this point (and points 7/11) anticipated have arrived on the _commerce_ side: Google's **AP2** (Agent Payments Protocol, v0.2, donated to the FIDO Alliance 28.04.2026 — Intent/Cart/Payment Mandates as W3C Verifiable Credentials, Human Not Present payments, Verifiable Intent logs), **UCP** (Google/Shopify/Walmart + Amazon/Meta/Microsoft/Salesforce/Stripe on the Tech Council), and **ACP** (OpenAI/Stripe, live in ChatGPT). Exactly per this point's position, DWS adopted rather than competed: **KYA Standard v1.8 §14 (Agentic Commerce Mandate Gating)** now gates all three rails by ATS band, extends the Capability Manifest with `spend_authority` (v1.3), and binds AP2 Verifiable Intent to the Article 12 evidence chain. Points 7 and 11's "DWS supplies the authorization signal" is now a written standard, not just a stance.

## 14. Legal and insurance layer for agent actions — PARTIAL, and the DWS wedge

Greg calls it "probably venture funded"; in the EU it is regulation-funded. DWS artifacts: the KYA **insurance & liability reduction framework** (KYA §9 — trust scores as underwriting input), the HIC accountability doctrine (a named human is always in command, so liability has an address), Article 12 logging as the evidence base, and EU AI Act penalty mapping down to article granularity (Art. 99(3) vs 99(4), KYA v1.7 sweep). DWS does not want to _be_ the insurer; it wants to be what the insurer requires — the same relationship building codes have to structural engineers. That is a moat-tier position (regulatory lock-in, `docs/20-MOAT-FORTRESS.md` Layer 0).

## 15. The always-on box agents live on — HAVE

DGX Spark is that box: owned NVIDIA hardware running 24/7 cron workloads (`scripts/daily|weekly|hourly`, `/cron` skill migrating GitHub Actions jobs onto it), Ollama serving EU-resident models, persistent tmux sessions (`scripts/dws6-tmux-session.sh`) surviving disconnects. The Script Automation Rule bans anything that depends on human memory to run — which is precisely the "agent lives here, always on" property. Product form: this is the Aegis single-tenant sovereign tier — the customer's agents living on hardware in the customer's jurisdiction, not a shared US cloud.

## 16. Machines with wallets / physical world — PARTIAL

**Lifetime Fleet** is the physical substrate: Control Room, Situation Room, missions, device health (`/remote-control` skill). Devices do not yet hold wallets or buy their own compute — and under the DWS governance model they should not, unbound: a machine that spends is an agent that spends, so it gets an identity, a trust score, a budget, and a HIC like any other agent (points 2/6/7 apply verbatim to robots). The wallet is downstream of governance, and governance is built.

## 17. Agents hiring robots — a machine-labor marketplace — GAP

Not built. Nearest artifacts: Lifetime Fleet mission dispatch (software → device tasking, which is structurally "an agent posting a job a machine picks up," inside one owner's fleet) and Upwork MCP integration for the human-labor version. An open cross-owner machine-labor marketplace is DWS7+ horizon at earliest, and it inherits every unsolved point above (6, 7, 10, 13, 18). Watch, don't build yet — but note the marketplace will need a KYA-class trust layer, which is the part DWS would sell into it.

## 18. Proof the physical job was done — HAVE (differentiated)

This is where DWS has an angle most of the thread's readers do not: **verification of real-world industrial state is already a DWS product surface.** SiteSense scores live site conditions (weather, crane risk, wind, worker capacity — `/site-safety`); the **Argus** agent does AI orbital target labeling from ICEYE SAR satellite data with change detection across industries (`src/agents/argus.agent.ts`, `src/integrations/iceye/`, KYA v1.5 Pillar 5 — "Label Every Target from Orbit"). Photos and on-site sensors prove the small scale; SAR proves the large scale, independent of the party being verified. Greg's point 18 is a layer DWS is already standing on.

## 19. Git for prompts and skills — version control for agent behavior — HAVE

This repo _is_ that product pattern, running in production: skills, prompts, hooks, and standards are git-versioned; every standard carries a VERSION AND AGENT HISTORY block naming which agent changed what, when, in which session; `/learn` closes the loop by diarizing mediocre outcomes into read-only edit plans applied by a human; `/autoresearch` mutates skills against binary evals and retains only improvements; truth-claim linting (`scripts/lint-truth-claims.mjs`) runs as a CI gate. "Roll back the exact skill that broke your agent" is `git revert` on a `SKILL.md` — the innovation is the discipline structure around it, which DWS has written down and could package.

## 20. Agents subscribing to agents — machine-to-machine recurring revenue — PARTIAL

The catalog and metering exist: 50 production agents (`AGENTS.md`, auto-synced from `src/agents/index.ts`), each invocable with structured scored output via `/agent-run`, discoverable via `/discover-agents`, priced via `dws10.com/config/products.json`. Per-industry LWM supply chains are explicitly the recurring machine-consumable asset (truth registry row 20). What's missing is self-serve M2M billing — today a human signs the subscription. Note Positioning Pillar 2 discipline: the customer buys the governed outcome, and agent-to-agent subscription is plumbing beneath it, not the headline.

## 21. A job board where applicants are machines — GAP (internal version exists)

Internally this already runs: `/discover-agents` finds an agent by capability, `/agent-run` executes it against a task with scored results, AgentFoundry builds new ones when no agent matches — that is a job board, matching engine, and training pipeline for a fleet of one owner. The open "Fiverr for machines" is not built and faces the same trust bootstrap as point 17. DWS's entry, if any, is as the verification and trust layer such a marketplace must run on (ATS as the applicant's résumé — checkable, per point 6), not as the marketplace operator.

---

## 22. Scorecard and the Dominant Game

| #   | Greg's category                  | DWS status     | Anchor artifact                                                |
| --- | -------------------------------- | -------------- | -------------------------------------------------------------- |
| 1   | Default tool in the harness      | HAVE           | Agent Productization Rule, `mcp-hub/`                          |
| 2   | Spend controls                   | HAVE / PARTIAL | Rule 6 budgets, `CLAUDE_AUTO_MODE_BUDGET`                      |
| 3   | Trusted memory                   | HAVE           | LWM + memory audit trail (KYA-S §10)                           |
| 4   | Safe sandboxes                   | HAVE           | Firecracker MicroVM, `tenant-sandbox.ts`, RED zone             |
| 5   | Docs as onboarding               | HAVE           | `CLAUDE.md` resolver, `SKILL.md` pattern                       |
| 6   | Checkable track record           | HAVE           | ATS + `src/identity/ats-engine.ts`                             |
| 7   | Human-authority permission layer | HAVE           | KYA Pillar 1, HIC, Shufti positioning                          |
| 8   | Verified-done escrow             | PARTIAL        | verification-gate; no money rails                              |
| 9   | Replay / forensics               | HAVE           | Article 12 logging, audit hooks                                |
| 10  | Dispute judge                    | PARTIAL        | Fault attribution (KYA §8.4); no arbitration service           |
| 11  | Per-task virtual cards           | GAP            | Partner play (issuers), DWS supplies authorization             |
| 12  | Rate-limit-proof throughput      | HAVE           | model-selector router + DGX Spark failover                     |
| 13  | Negotiation protocol             | GAP            | Signal protocol + manifests as preconditions                   |
| 14  | Liability & insurance layer      | PARTIAL        | KYA §9 underwriting framework, HIC doctrine                    |
| 15  | Always-on box                    | HAVE           | DGX Spark, cron paths, Aegis tier                              |
| 16  | Machines with wallets            | PARTIAL        | Lifetime Fleet; wallets gated behind governance                |
| 17  | Agents hiring robots             | GAP            | Fleet missions = single-owner precursor                        |
| 18  | Physical-work proof              | HAVE           | SiteSense + Argus/ICEYE orbital verification                   |
| 19  | Git for agent behavior           | HAVE           | This repo's discipline stack, `/learn`, `/autoresearch`        |
| 20  | M2M subscriptions                | PARTIAL        | 50-agent catalog, LWM supply chains; no self-serve M2M billing |
| 21  | Machine job board                | GAP            | `/discover-agents` + `/agent-run` internal version             |

11 HAVE, 6 PARTIAL, 4 GAP — and every GAP is one where the DWS entry point is the same product: the trust/governance layer the gap's eventual winner must buy or build.

**The dominant game** (per the Ross field note): Greg's readers will race to build 21 point solutions and compete on features. The higher-level game is that points 2, 6, 7, 8, 9, 10, 11, 14 collapse into one governed layer — and in the EU, regulation makes that layer mandatory rather than optional (Doctrine Shift). DWS does not need to win 21 categories; it needs the one layer the other twenty plug into. That claim passes the Ari test: for a buyer, it is risk removed (agents that cannot overspend, act without authority, or fail without a forensic trail); for the ecosystem, it is leverage gained (any marketplace, escrow, or insurer can consume ATS + Article 12 evidence instead of rebuilding trust from zero).

**Where Greg is right and DWS should move:** point 5 (docs as product) deserves a customer-facing upgrade — machine-onboardable product docs for dws10.com; point 8 deserves the signed "verified done" attestation so escrow partners can integrate; point 19 is packageable — the discipline stack in this repo is itself a sellable pattern.
