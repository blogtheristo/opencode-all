# kya-jev Specification

***

# VERSION AND AGENT HISTORY

Version: 0.2 [Latest]

Sessions & Modifications:

- Version: 0.2 | Tool: Claude Code (Sonnet 5) | Session: claude/agents-md-support-eyody6 | Date: 18.09.2026 | Changes: HIC (Finnish) flagged that §1's earlier claim "not difficult to deliver as engineering" (made in chat, not this document) was an unsupported opinion. Added a grounded paragraph to §1 citing the two pre-existing components that made the build low-effort — KYA-gating (`authorizeToolCall()`, `src/security/runtime-auth.ts:271`) and Article-12 audit logging (`agent_executions`, extended by `087_kya_jev_calls.sql` + `BaseAgent.logKyaJevCall()`) — turning the claim into cited evidence.
- Version: 0.1 | Tool: Claude Code (Sonnet 5) | Session: claude/agents-md-support-eyody6 | Date: 18.09.2026 | Changes: Initial creation. Codifies kya-jev (KYA-gated typed decision primitive) as a specification, incorporating the Boardy audit (A1–E2) requested against PR #2043 and the public `blogtheristo/KYAv2` release candidate. Records the audit's Overall Recommendations (MERGE-WITH-CONDITIONS on PR #2043; PUBLISH on KYAv2) and closes the one blocking condition (D2) by setting `KYA-JEV-001.detailsUrl` to `null` in `dws10.com/config/products.json` and its landing-pages mirror, so the storefront falls back to the products index instead of 404ing on a non-existent `products/kya-jev.html`.

Session Links & References:

- Claude Code (claude/agents-md-support-eyody6): https://github.com/blogtheristo/dws6
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/KYA_JEV_SPECIFICATION.md
- Related: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`, PR #2043, `blogtheristo/KYAv2` (staged, not yet published)

Document Status:

- Created: 18.09.2026
- Last Modified: 18.09.2026 (v0.2)
- Language: English
- Languages Available: English
- Publication Status: ACTIVE — internal specification

***

## 1. Summary

`kya-jev` is a KYA-gated typed decision primitive: given application state and a typed question (`choice` / `score` / `boolean`), it returns a typed decision plus self-reported probabilities and confidence. It differs from a bare structured-output wrapper in one load-bearing way — every call requires an already-issued `allowed` verdict from the caller's own KYA runtime-authorization gate; there is no code path to a decision without one.

Origin: built as a sovereign, DGX/Groq/Anthropic-backed alternative to TypeSafe AI's "Jev" model, after independent verification (`docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`) found Jev is US-hosted and CLOUD Act-exposed.

**Why this was not a difficult build (evidence, not opinion):** the two components that make `kya-jev` a governed primitive rather than a bare structured-output wrapper already existed on the DWS agent platform before this work started — KYA-gating (`authorizeToolCall()`, `src/security/runtime-auth.ts:271`) and Article-12 audit logging (`agent_executions`, extended this session by `087_kya_jev_calls.sql` + `BaseAgent.logKyaJevCall()`). The new work was `makeTypedDecision()` itself (`src/agents/kya-jev.ts`) sitting on top of that existing infrastructure, not building the governance layer from zero.

## 2. Scope

- **Primitive:** `src/agents/kya-jev.ts` — `makeTypedDecision()`.
- **Pilot integration:** `src/agents/seo/seo-audit.agent.ts` — `reviewWithKyaJev()`, advisory-only; `deployGate` remains fully deterministic.
- **Audit trail:** `supabase/migrations/087_kya_jev_calls.sql` + `BaseAgent.logKyaJevCall()`.
- **Calibration tooling:** `scripts/calibrate-kya-jev.mjs` (real ECE harness; no fabricated results — no labeled dataset exists yet).
- **Commercial listing:** `KYA-JEV-001`, EUR 99/month, Early Access, `dws10.com/config/products.json` (+ landing-pages mirror).
- **Public release candidate:** `blogtheristo/KYAv2` (staged locally; repo creation blocked at the tool-access layer — not yet pushed).

## 3. Boardy Audit — Overall Recommendations

- **PR #2043 (dws6): MERGE-WITH-CONDITIONS.** Condition: add the missing `products/kya-jev.html` route, or set product visibility to unlinked, to prevent a 404 storefront error. **Status: closed this session** — `KYA-JEV-001.detailsUrl` set to `null` in both `dws10.com/config/products.json` and `landing-pages/dws10-com/config/products.json`; the storefront's existing fallback (`product.detailsUrl || "../products/"`, `dws10.com/buy/index.html:1894`) routes to the products index instead of a dead link.
- **blogtheristo/KYAv2 (Public Release): PUBLISH.** Clean isolation verified — no internal dependencies, secrets, or policy leaks present. Still blocked on repo creation permissions (see §6).

## 4. Audit Findings

### A. Governance / KYA Integrity

| #   | Verdict     | Finding                                                                                                                                                         | Reference                         |
| --- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| A1  | Pass        | `requireKyaVerdict()` strictly checks runtime context and rejects any verdict other than `'allowed'`.                                                           | `src/agents/kya-jev.ts:42`        |
| A2  | Needs-Human | A caller can pass arbitrary context in unmanaged environments unless context creation is strictly bound to internal factory functions using signed auth tokens. | `src/security/runtime-auth.ts:18` |
| A3  | Pass        | KYAv2 exposes only generic TypeScript interfaces, keeping proprietary DWS policy engines and authorization flows completely offline.                            | `blogtheristo/KYAv2:src/index.ts` |

### B. Calibration / Truthfulness

| #   | Verdict     | Finding                                                                                                             | Reference                                                        |
| --- | ----------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| B1  | Pass        | Output types, loggers, product JSON, and documentation consistently tag confidence as `self-reported-uncalibrated`. | `src/agents/kya-jev.ts:15`; `dws10.com/config/products.json:112` |
| B2  | Needs-Human | Early Access listing must explicitly note that confidence metrics are uncalibrated pending human dataset labeling.  | `dws10.com/config/products.json:118`                             |
| B3  | Pass        | ECE arithmetic in `calibrate-kya-jev.mjs` handles zero-division and single-value degenerate inputs safely.          | `scripts/calibrate-kya-jev.mjs:34`                               |

### C. Security / Disclosure Risk

| #   | Verdict | Finding                                                                                                                      | Reference                         |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| C1  | Pass    | Staged public repository contains zero internal `@dws/*` imports, database schemas, or API credentials.                      | `blogtheristo/KYAv2:package.json` |
| C2  | Pass    | MIT license applies to the primitive interface, while commercial value resides in hosted runtime management (`KYA-JEV-001`). | `blogtheristo/KYAv2:LICENSE`      |
| C3  | Pass    | Exposing the KYA naming convention reveals generic agent-safety terminology without disclosing backend gate logic.           | `blogtheristo/KYAv2:README.md`    |

### D. Product / Commercial Integrity

| #   | Verdict                        | Finding                                                                                                                                                     | Reference                            |
| --- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| D1  | Needs-Human                    | EUR 99/month pricing is defensible as a preorder reservation, but commercial activation must remain gated until calibration benchmarks complete.            | `dws10.com/config/products.json:120` |
| D2  | Fail → **Closed this session** | Storefront would throw a 404 because `products/kya-jev.html` is missing; page must be created or URL unlinked before merging. Fixed via `detailsUrl: null`. | `dws10.com/config/products.json:105` |
| D3  | Needs-Human                    | Requires standard registration in `DWS_STANDARDS_LIBRARY.md` before promotion to official product tier.                                                     | `docs/DWS_STANDARDS_LIBRARY.md`      |

### E. Scope / Blast Radius

| #   | Verdict | Finding                                                                                                                      | Reference                                     |
| --- | ------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| E1  | Pass    | `reviewWithKyaJev()` is fully isolated inside a try/catch block, populating advisory metadata without blocking `deployGate`. | `src/agents/seo/seo-audit.agent.ts:142`       |
| E2  | Pass    | Migration 087 is strictly additive (`CREATE TABLE IF NOT EXISTS`) and poses zero risk to existing production tables.         | `supabase/migrations/087_kya_jev_calls.sql:1` |

## 5. Needs-Human Items (open, not blocking this version)

1. **A2** — harden `AgentRuntimeContext.kya` construction so it can only originate from a signed, internal factory (not caller-constructed) in any environment, not just the managed one.
2. **B2** — verify the Early Access calibration caveat renders on the live storefront card copy, not only in the JSON `description` field.
3. **D1** — keep commercial activation (actual billing) gated until a calibration study runs; `preorder` availability stays until then.
4. **D3** — register `kya-jev` in `DWS_STANDARDS_LIBRARY.md` before treating it as an official, generally-available product tier.

## 6. Outstanding Blocker (tooling, not audit)

Publishing `blogtheristo/KYAv2` requires creating a new GitHub repository; this session's GitHub integration returns `403 Resource not accessible by integration` on repo creation. The package is staged and verified (tests passing, `tsc` clean, MIT-licensed, no DWS-internal imports) — pending a human creating the empty repo so it can be pushed.

## 7. Never Without Further Approval

Unchanged from the field note and this specification's audit: no auto-execute or consequential (financial, compliance, customer-facing) action may be gated on `kya-jev`'s self-reported confidence alone until a real calibration study runs against a human-labeled DWS dataset.
