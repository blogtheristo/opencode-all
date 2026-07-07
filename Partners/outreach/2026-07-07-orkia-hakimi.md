# Partner Outreach: Orkia (Hakimi)

---

**Document Classification:** Partner Confidential
**Version:** 1.0
**Created:** 2026-07-07
**Owner:** Lifetime Oy
**Status:** Prospective — no contact made yet. Draft reply ready for Risto to send from the public exchange (X/Twitter thread).
**Type:** Technology / Ecosystem Partner (connector-not-competitor track)

---

## VERSION AND AGENT HISTORY

| Version | Date       | Agent       | Action                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------- | ---------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1.0     | 2026-07-07 | Claude Code | Created partner outreach record after Hakimi's public critique of the week's Aspire/OTLP observability work ("the trace shows the agent reached prod — it never shows whether it should have been able to"). Documents the exchange, the same-day KYAVerdict span-attribute response it produced (`src/observability/tracing.ts`, thesis v3.79 §10.25.6/§14.37.4), research on Hakimi's own project Orkia (github.com/orkiaHQ/orkia, orkia.dev), and a connector-not-competitor partnership read. Drafted send-ready reply for Risto. |

---

## 1. Organization Profile

| Field         | Value                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Name**      | Orkia (project) / Hakimi (builder — solo, indie)                                                                                      |
| **Product**   | Agentic shell (Rust) that runs AI coding agents (Claude Code, Codex, Gemini) as governed, audited Unix jobs                           |
| **HQ / team** | Unknown / not stated publicly; reads as a solo indie-hacker project ("was hacking before LLMs, still hacking, different stack")       |
| **Repo**      | github.com/orkiaHQ/orkia — 5 stars, 1 fork, 41 commits, v0.1.0, single release (as of this research pass, 2026-07-07)                 |
| **License**   | Mixed: Elastic License 2.0 (shell core, most crates — source-available, not OSI-open-source) / Apache 2.0 (plugin SDK, build tooling) |
| **Site**      | orkia.dev (403 on direct fetch from this environment; content summarized via GitHub README + web search)                              |
| **Maturity**  | Pre-1.0, active development, minimal community traction yet — this is an early relationship, not a vendor evaluation                  |

## 2. What Orkia Does (verified via GitHub README, 2026-07-07)

- **Daemon-owned agent jobs.** Every `@agent <prompt>` dispatch runs in the Orkia daemon, not the shell process — it survives shell exit, and `ps` still lists it after relaunch.
- **PTY isolation.** Each agent gets its own pseudo-terminal via a three-thread (Reader/Extractor/Render) engine.
- **Brush POSIX engine underneath.** Not a wrapper around agents — a real shell (pipes, jobs, redirection all work) with agents as first-class dispatchable jobs.
- **`approve`/`deny` builtins + a "cage" execution boundary** (`orkia-cage`, `orkia-sh`) that mediate what a running agent can do, command-by-command, **before** it runs.
- **SEAL audit chain.** Hash-linked, Ed25519-signed JSONL records of every agent action; `audit --job N` replays it, `audit verify --job N` cryptographically verifies tamper-evidence.
- **Bring-your-own-key.** No credential proxying, no phone-home; local-first, runs offline. Commercial "Orkia OS" layers learned model-routing classification and multi-host verification on top of the open core.
- **No visible token-budget or spend-limit feature** — notable given Hakimi's own stated trigger for the project (an agent burning $400 in tokens overnight doing nothing).
- **No OpenTelemetry integration** — the audit trail is a local signed chain, not an exportable trace.

## 3. The Exchange (this session, 2026-07-07)

Hakimi publicly critiqued the week's DWS Aspire/OTLP observability work: _"Polyglot OTLP is right, no stack should pretend to be .NET to be seen. But every LLM call it lights up is a record of what already fired. The trace shows the agent reached prod. It never shows whether it should have been able to."_

We verified the critique against our own code and found it accurate: `src/agents/llm-client.ts` had exactly one authorization concept (the provider's Bearer header); KYA trust-score enforcement existed only at the sandbox boundary, on a code path disconnected from telemetry. Same session, we shipped the fix: `withAgentSpan`/`withLLMSpan` now accept a `KYAVerdict` and stamp `dws.kya.verdict` / `trust_score` / `policy_version` / `gate` alongside the `gen_ai.*` attributes, with unverified executions defaulting to `dws.kya.verdict: "ungated"` — never blank, so authorization-coverage gaps become a queryable trace-UI filter instead of an invisible absence. Thesis corrected in lockstep (V3Thesis §10.25.6, PHD_FIREHORSE §14.37.4 — the restated thesis: _conformance evidence is a projection of operational telemetry iff the projection includes the ex-ante verdict_). Full record: `docs/field-notes/2026-07-07-hakimi-observability-vs-authorization.md`.

Hakimi then posted his own framing, independently arriving at the same problem from the operator side: _"ran AI agents in prod for months the way everyone does: fire it off, hope, scroll the logs later. Then one quietly burned $400 in tokens overnight doing nothing. So I started treating agents like what they actually are: Unix processes. ps. kill. audit."_ — which is exactly what Orkia is.

## 4. Relevance to DWS / Lifetime Oy

**The two projects are complementary, not overlapping — a clean connector-not-competitor fit, same pattern as the Palantir AIP connector positioning:**

| Layer                           | Orkia has it                            | DWS/KYA has it                                                                                    |
| ------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Ex-ante gate (before execution) | Yes — `approve`/`deny`, cage boundary   | Yes — KYA sandbox (`nemoclaw-sandbox.ts`), now with span attrs too                                |
| Tamper-evidence                 | Yes — Ed25519-signed hash-linked chain  | No — OTLP spans are not cryptographically signed                                                  |
| Queryable projection / trace UI | No — local chain only, no OTel export   | Yes — Aspire Dashboard, GenAI visualizer, `gen_ai.*` + `dws.kya.*`                                |
| Token/spend budgeting           | No (and it's his own stated pain point) | Partial — Engineering Discipline Rule 6 (4000/task, 30000/session), not yet a runtime kill switch |
| Measured kill latency           | Unstated                                | Yes — <125 ms Firecracker MicroVM snap (KYA, Key Contribution #20)                                |

**Composed, the two answer the full regulator-grade question**: what fired, under what authority, provably untampered. Neither answers it alone today.

**Concrete, low-commitment integration point:** Orkia's plugin SDK is Apache 2.0 (the shell core is Elastic License 2.0 — do not build against that without separately reviewing its terms). A small OSS contribution — an Orkia plugin that exports SEAL-chain approve/deny decisions as OTLP span attributes matching our `dws.kya.*` vocabulary — would let Orkia's signed gate decisions appear inside any OTel-compatible dashboard (Aspire, Grafana, etc.) without either side depending on the other's roadmap. This is an experiment, not a partnership commitment.

## 5. Recommended Actions

1. **Reply on the public thread** (drafted below) — acknowledge the critique publicly, since it happened publicly; that is also the lowest-commitment way to open contact.
2. **Do not disclose KYA internals beyond what is already in the public field notes / thesis excerpts** — trust-score formulas, ATS thresholds, and the sandbox implementation stay internal. The reply references only what we've already made public this session.
3. **No NDA needed at this stage.** This is a public-exchange-to-OSS-experiment path, not a data-sharing or reseller relationship. Revisit if a joint integration grows into anything with shared customer data.
4. **If Hakimi engages:** propose the plugin experiment (§4) as a concrete first step rather than an abstract "let's partner" — matches his own builder-in-public style and gives both sides something shippable to point at.
5. **Track maturity, don't over-invest yet.** v0.1.0, 5 stars, solo builder. Revisit classification once (if) Orkia shows sustained traction or a 1.0 release.

## 6. Partnership Classification

| Tier                           | Fit                    | Rationale                                                                                                |
| ------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------- |
| **Technology / OSS Connector** | Strong immediate fit   | Complementary gaps (§4 table); a plugin-level integration is buildable without any commercial agreement  |
| **Ecosystem Partner**          | Speculative, long-term | If Orkia gains traction, DWS/KYA could be referenced as the "conformance projection" layer for its chain |
| **Strategic/Reseller**         | Not applicable         | Wrong stage — solo indie project, no commercial surface yet                                              |

## 7. Guardrails

- Public reply only for now — no private outreach, no NDA, no data sharing.
- Keep the reply technical and specific (cite the actual span attributes and the ungated-default design), not promotional.
- Do not commit DWS engineering time to the plugin experiment without Risto's explicit go-ahead; §4's integration sketch is a proposal, not a task in flight.

## 8. Proposed Reply (public thread — ready to send, Risto's account)

**Channel:** X/Twitter, as a reply in the existing thread with Hakimi
**Voice:** first-person, Risto — technical peer reply, not a company pitch

> You're right, and I checked before replying: on our LLM path the only "authorization" was the provider's Bearer header. So we shipped what your framing implies — the gate's verdict now rides on the trace itself: dws.kya.verdict / trust_score / policy_version next to the gen_ai.\* attributes. And a span with no verdict gets stamped "ungated," never left blank — so the trace now shows not just what fired, but every path nothing gated. Our current ungated count is our honesty metric.
>
> On ps/kill/audit: agreed, and our kill has a number — <125 ms sandbox snap, measured, not spec'd. Looked at Orkia: your signed chain is the piece OTLP doesn't give anyone (tamper-evidence), and OTLP is the piece your chain doesn't (a queryable projection). Composed, that's the whole record a regulator actually accepts. Following your build.

**Optional follow-up (only if he engages, not part of the first reply):**

> If useful — your plugin SDK is Apache 2.0, ours is OTel GenAI semconv. A small plugin that exports SEAL approve/deny as OTLP span attrs would let your signed gate decisions show up in any OTel dashboard without either of us depending on the other's roadmap. Happy to sketch the attribute mapping if you're interested.

---

## CHANGES MADE

- Created `Partners/outreach/2026-07-07-orkia-hakimi.md` v1.0 — full outreach record following the house format (`Partners/outreach/2026-04-18-aiven.md` pattern): org profile, verified product summary, the exchange record, relevance/connector analysis, recommended actions, partnership classification, guardrails, send-ready public reply.

## THINGS I DIDN'T TOUCH

- No message sent — the reply is drafted and staged for Risto to post from his own X/Twitter account (outbound public communication is the user's call, not autonomous).
- No code written for the plugin integration sketch (§4) — flagged as a future experiment requiring explicit go-ahead, not started.
- orkia.dev direct fetch failed (403); all product claims sourced from the public GitHub README and web search, not the marketing site — flagged as the honesty boundary on this record.

## POTENTIAL CONCERNS

- Orkia is pre-1.0 with a single builder and minimal traction (5 stars). This record intentionally classifies it as "prospective, low-commitment" rather than a partner-track relationship — do not escalate past a public reply without a reason to believe the project has real momentum.
- The Elastic License 2.0 core is source-available, not OSI open-source — any future integration work must target the Apache 2.0 plugin SDK specifically, not the licensed core, to avoid license-compatibility issues.
