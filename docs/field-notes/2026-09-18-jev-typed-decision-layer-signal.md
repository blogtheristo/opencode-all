<!-- Evidence: Tool=Claude Code Model=claude-sonnet-5 Agent=Claude Code Date=2026-09-18 -->

# Field Note — Jev (TypeSafe AI): Typed Decision-Layer Signal — "Add Jev Support" Decision Gate

**Date:** 2026-09-18
**Session:** Claude Code, branch `claude/agents-md-support-eyody6`
**Status:** Phase 0 APPROVED by HIC (2026-09-18). Phase 0 verification complete this session. Phase 1 (code) NOT started — separate approval required.
**Source:** Excerpt supplied by HIC — "Jev in Depth Report" (TypeSafe AI), compiled via levangielabs.com + @scobleizer's AI lists (x.com/scobleizer/lists), forwarded as a Google Docs excerpt. All primary citations in the excerpt are X (Twitter) posts — none independently verified by this session (Rule 12, fail loud).

## What Jev is (per the excerpt)

TypeSafe AI's Jev is a "System One" model: instead of generating prose, it takes application state + a typed question and returns a typed decision + probability distribution + confidence. Positioned as the fast/cheap/typed judgment layer sitting between deterministic code and frontier LLM deliberation — routing, ranking, verification, classification, action selection. Launch-week distribution: Vercel AI Gateway, Cloudflare, OpenRouter, LangChain, Pydantic AI, Dify, AX (multi-language).

Published economics (vendor/partner claims, unverified): $0.042/M input tokens, free output, 70–500ms latency, up to "190x faster / 440x cheaper" than compared alternatives (OpenRouter launch post).

## Why this maps to existing DWS architecture

The excerpt's proposed 4-layer stack —

> Code constrains. Jev judges. LLMs deliberate. Humans govern.

— is structurally the same shape as this repo's existing autonomy ladder (`AGENTS.md` §5 Deployment Phases: silent_pilot → advisor → autonomous; `src/agents/autonomy.ts`, `src/agents/nudge.service.ts`) and the model-tiering already in place (Groq/Llama fast-inference vs. Claude Sonnet complex reasoning vs. DGX Qwen 2.5 72B, per `AGENTS.md` §1 Technology Stack, §8 Managed Agent Backends).

Candidate DWS fits, if Jev's calibration holds up under our own testing:

- `src/agents/signal-catalogue.ts` "worth interrupting" 2×2 gate — currently rule/LLM-based; a typed decision model is a plausible cheaper front stage.
- `nudge-response-handler.ts` Confirm/Override/Dismiss/Investigate classification.
- `outreach-lead-finder` / `keyword-intent` / `lead-feedback` agent triage steps — currently `llama3.3:70b` — repetitive bounded classification is exactly Jev's stated sweet spot.
- `seo-audit`, `competitor-surveillance` — already on the Ledger-Native exemption list (AI_AGENT_GUIDELINES §2), same pilot-scope logic used for the Claude Managed Agents evaluation in `AGENTS.md` §8.3 Phase 1.

## Why this is NOT integrated yet — calibration is unproven

The excerpt itself is explicit that the central open question is whether Jev's returned "confidence" is a calibrated probability or an uncalibrated softmax score:

- Reported expected calibration error 0.144 in one independent test (@latent_node).
- 16,000-decision production test found it fast/cheap but "not ready for that production environment" (@chrismdp).
- ACP-style completion ambiguity is a known failure mode DWS already hit with the opencode-all Living Engine (`docs/field-notes/2026-08-24-opencode-all-living-engine.md`: OpenCode's own `session/prompt` returns no parseable `stopReason`, forcing a PROVISIONAL-completion label and seven audit gates in `DWS_ENGINEERING_STANDARD.md` DDM-v1). Committing to an unverified third-party "confidence" number without our own calibration study would repeat that exact mistake at the model layer instead of the session layer.
- Status/company maturity: early beta, single-vendor, no independent EU-residency or CLOUD Act posture found (mirrors the open question already flagged for Claude Managed Agents in `AGENTS.md` §8.1 — "no confirmed EU-only execution SLA found"). TypeSafe AI's data-processing location is unresearched.

**Decision:** Log as a signal only. Following the same Phase-0/Phase-1/Phase-2 gate pattern already used for Claude Managed Agents (`AGENTS.md` §8.3), "Add Jev support" is not implemented this session because:

1. No DWS-side calibration test has been run against our own decision workloads (routing/ranking/triage) — Rule 1, think before coding; Rule 12, fail loud on an unverified premise.
2. No sovereignty/data-residency review has been done — same gate KYA would require for any BYO model substrate (`docs/Deputy-Agents-Architecture.md` §8.3).
3. Non-Negotiable Rule 6 (`CLAUDE.md`) requires an env-var-scoped secret and provider entry before any API key exists in this repo — none does yet.

## Phase 0 — completed 2026-09-18 (HIC-approved)

Verified independently (not X posts) via `docs.typesafe.ai` and `openrouter.ai/typesafe/jev-1.13`:

- **Live API:** `POST https://api.typesafe.ai/v1/systemone`, model id `jev-latest`, single call accepts one state (text or program state) + any number of typed questions, returns every answer in that call. 32,000-token context window (Jev 1.13).
- **Three answer primitives:** `Choice` (pick one option from a fixed set → choice + per-option probabilities + confidence), `Score` (rate state against ordered levels → score + probabilities + confidence), `Boolean` (probability the answer is yes).
- **Pricing confirmed:** $0.042/M input tokens, $0/M output tokens — matches the excerpt's OpenRouter figure. TypeSafe states this price may be subsidized and could rise, not just fall — treat as provisional for budget lines (Rule 12).
- **Data residency / CLOUD Act — now resolved, and it's a hard blocker for anything sovereignty-sensitive.** Per `typesafe.ai/legal/privacy-policy` and `typesafe.ai/legal/terms`: TypeSafe AI, Inc. (255 California St, Suite 1300, San Francisco, CA 94117) hosts the Service in the **U.S.**; EEA/UK/Swiss usage is a cross-border transfer covered by SCCs + a UK Addendum, not EU-local processing. They commit to no training on customer data and offer zero-data-retention (ZDR) for enterprise. **Conclusion:** Jev is CLOUD-Act-exposed like any other US SaaS API (same bucket as Claude Managed Agents in `AGENTS.md` §8.1) — it is a non-starter for any Ledger-Native / customer-regulatory-data workload under DWS's sovereignty posture (`docs/Deputy-Agents-Architecture.md`), and ZDR + a signed DPA would be the minimum contractual floor even for the exempt-agent pilot.
- **Not yet found in independent docs:** SLA terms, an independent (non-vendor) calibration benchmark.

**Pilot candidate selected:** `seo-audit` (`src/agents/` — Ledger-Native exempt, Tier-1 read-only, currently `llama-3.3-70b-versatile`). Rationale: bounded, repetitive classification (Core Web Vitals / canonical / schema-markup pass-fail calls) is exactly Jev's `Choice`/`Boolean` shape, output never touches the carbon ledger or a customer commitment, and a wrong call is a missed SEO nit, not a compliance or financial exposure — lowest-risk place to measure real calibration before trusting Jev anywhere consequential.

## Pivot: build `kya-jev` in-house instead of adopting vendor Jev (HIC decision, 2026-09-18)

Given the CLOUD-Act exposure above, the HIC decided to build a DWS-native, DGX-sovereign equivalent — **`kya-jev`** — rather than integrate the vendor API. Strategic framing: this turns KYA from a pure governance/gating layer into a sellable product primitive (a KYA-gated typed-decision function), not just an internal safety control.

**Phase 1 shipped this session:** `src/agents/kya-jev.ts` — `makeTypedDecision()`.

- Implements the same three typed-question primitives as Jev (`choice`, `score`, `boolean`) over the existing `LLMClient` (any configured provider — Groq, DGX Ollama, Anthropic; no new vendor dependency, no new secret).
- **The "kya" part is load-bearing, not branding:** `requireKyaVerdict()` refuses to run unless `AgentRuntimeContext.kya.decision === 'allowed'` — a typed decision cannot be produced without an already-issued runtime KYA verdict (`src/security/runtime-auth.ts`), the same gate that governs proactive nudges. This is the differentiator vendor Jev cannot offer as an external SaaS call.
- Confidence is explicitly typed `calibration: 'self-reported-uncalibrated'` on every result — Rule 12 fail-loud baked into the type, not just documented. No caller can silently treat it as trustworthy.
- Malformed/invalid model output retries once, then returns a safe `abstained: true` result rather than throwing or guessing — never blocks the caller's own fallback logic.
- Tests: `src/__tests__/agents/kya-jev.test.ts` (5/5 passing) — KYA-denial refusal, valid choice/boolean parsing, retry-then-succeed, retry-then-abstain.
- Zero new infra: runs entirely on already-deployed DGX/Groq/Anthropic clients — no CLOUD Act exposure, no DPA, no vendor API key.

**Not done yet (next steps, need HIC go-ahead per item):**

1. Wire into a real agent (`seo-audit` remains the lowest-risk pilot candidate) — currently a standalone primitive, not called by any agent.
2. `agent_executions` `runtime`/decision logging column (migration) so kya-jev calls are Article-12 auditable like other agent executions.
3. **The actual calibration study** — expected-calibration-error measurement against a labeled DWS dataset. Until this runs, `kya-jev` output must be treated exactly like vendor Jev's: useful signal, not a threshold for auto-execution.
4. Product framing: if this becomes a KYA product surface (per HIC's "makes KYA a product" framing), it needs its own `DWS_TRUTH_STANDARD.md` entry (pricing/positioning) and a `DWS_STANDARDS_LIBRARY.md` registration akin to DDM-v1 — not done this session, flagged for a product/GTM pass, not an engineering one.

**Never without further approval:** any Ledger-Native / non-exempt agent, any auto-execute action gated only on `kya-jev`'s self-reported confidence, any consequential (financial, compliance, customer-facing) decision — same boundary already drawn for Managed Agents (`AGENTS.md` §8.2) and vendor Jev above.

## Learning Outcome steps (EU AI Act Art. 14)

1. KB update: N/A — this note is the primary record; no KB API session available.
2. Field note: this file.
3. Learn/ HTML: N/A — internal signal, no publication intent.
4. Drive export: N/A — repo is source of truth.
5. HIC question: resolved — Phase 0 approved 2026-09-18; pilot candidate is `seo-audit`. Open follow-up: confirm Phase 1 (code) go-ahead, and which historical `seo-audit` run outputs to use as the calibration ground-truth set.
6. Calendar: N/A — no dated commitment created; would follow once Phase 1 start date is set.
