# Field Note: .NET Aspire Development Evolution — PR #1500 to Main, and Lessons Learned to Implementation

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/aspire-development-evolution-16fxg0 | Date: 07.07.2026 | Changes: "Implement what is now possible" pass. Repo reality check overturned v1.0's premise: option 1 was ALREADY deployed (compose v1.1.1 pinned aspire-dashboard:13.3.5; `src/observability/otel.ts` + `tracing.ts` with GenAI semconv helpers wired into `src/app.ts` and `src/agents/llm-client.ts`; `telemetry.types.ts` v1.1 + migration 066). Primary-source verification: GenAI visualizer CONFIRMED (introduced 9.5, improved 13.2); in-dashboard GitHub Copilot UI REMOVED in 13.3 (replaced by Aspire CLI + MCP for AI agents); dashboard endpoint reference confirmed UI 18888 / OTLP gRPC 18889 / OTLP HTTP 18890. That reference exposed a live bug: all three DGX OTLP/HTTP producers pushed telemetry to the 18888 UI port — silently dropped. FIXED in compose v1.3.1 (18888→18890 on dws-backend, dws-cron, bumblebee-collector) + comment corrections in bumblebee/scan-and-emit.ts. Added §6 (verification results + reality check). Sections 3–5 annotated, not rewritten.
- Version: 1.0 | Tool: Claude Code | Session: claude/aspire-development-evolution-16fxg0 | Date: 07.07.2026 | Changes: Captured Risto's field note on Aspire's evolution from PR #1500 (early 2024, .NET Aspire 8.0 Preview 3/4 era) to current main. Preserved the upstream synthesis verbatim (Section 1), then mapped each of its five evolution tracks to DWS IQ 6 implementation lessons (Section 2), refreshed the April 2026 adoption decision (Section 3), and updated the observability gap table from the 2026-04-08 research note — the GenAI visualizer partially closes a gap we flagged as "NOT built-in" (Section 2.4)

Session Links & References:

- Prior DWS Aspire research: docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md
- Prior field note (13.2 isolated mode, version-jump resolution, `aspire docs`): docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md
- Prior field note (dws docs CLI gap): docs/field-notes/2026-04-10-dws-docs-cli-gap-aspire-pattern.md
- Sensor plan that cut Aspire AppHost: docs/ASPIRE_SENSOR_MANAGEMENT_PLAN.md
- DGX Spark deployment surface (no Aspire artifacts): infrastructure/dgx-spark/docker-compose.yml
- Aspire repository: https://github.com/dotnet/aspire (PR #1500 ≈ early 2024, 8.0 Preview 3/4)
- Aspire docs hub: https://aspire.dev

Document Status:

- Created: 07.07.2026
- Last Modified: 07.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Upstream Evolution Analysis / Lessons Learned

Related Documents:

- docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md (adoption options 1/2/3 — this note refreshes that decision)
- docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md (gap table updated by Section 2.4 below)
- docs/field-notes/2026-05-15-opentelemetry-genai-observability-control-room.md (GenAI observability for Control Room)

---

## Ontology Tags

- **Geography:** Global > Microsoft > .NET Ecosystem
- **Sector:** Technology > Developer Tools > Cloud-Native Orchestration
- **Entities:** Microsoft, Aspire team, DWS IQ 6, DGX Spark, Lifetime Oy
- **Temporal Context:** 2024-Q1 (PR #1500, 8.0 previews) → 2026-Q3 (current main, Aspire 13.x)
- **Confidence:** Medium-High (upgraded in v1.1) — Section 1 is Risto's synthesis of upstream history. v1.1 primary-source-verified the GenAI visualizer (introduced 9.5, improved 13.2) and the dashboard endpoint/configuration surface (aspire.dev configuration reference), and found one claim outdated (in-dashboard Copilot UI removed in 13.3 — see §6.1). `WithPip()`, `aspire destroy` targets, per-app ACA managed identities, and TS AppHost GA status remain unverified; do not use those externally yet.

---

## Executive Summary

Between PR #1500 (early 2024, during the Preview 3/4 stage of the initial .NET Aspire 8.0 release) and today's main branch, Aspire transformed from an experimental, C#-centric microservices orchestrator into a mature, decoupled, polyglot, AI-integrated cloud-native stack. This note captures that evolution (Section 1, Risto's field note, preserved verbatim) and extracts what each track means for DWS IQ 6 implementation (Section 2).

**Headline for DWS:** two of the three reasons we cut Aspire from the sensor plan and deferred adoption in April 2026 have since dissolved upstream — the .NET-toolchain requirement (polyglot AppHost, workload decoupling) and the missing AI/LLM trace visualization (GenAI visualizer). The April "option 1: dashboard-only adoption" recommendation stands, but the option 2 (AppHost) cost estimate is now materially lower and should be re-scored.

> **v1.1 correction (the "fail loud" part):** the paragraph above and Section 3 assumed option 1 was unexecuted. It wasn't — `aspire-dashboard:13.3.5` has been pinned in `infrastructure/dgx-spark/docker-compose.yml` since compose v1.1.1, and the OTel code layer (`src/observability/otel.ts`, `tracing.ts` with GenAI semconv helpers, `telemetry.types.ts`) already exists and is wired into `src/app.ts` and `src/agents/llm-client.ts`. v1.0 of this note repeated the April-era "not deployed" narrative without re-checking the tree — exactly the narrative-vs-reality failure mode the 2026-04-10 note warned about, committed by the note itself. The re-check also surfaced a real bug: all three OTLP producers pushed telemetry to the dashboard's **UI port (18888)** instead of its OTLP/HTTP listener (**18890**), so DGX telemetry was silently dropped. Fixed in compose v1.3.1 (this session). Details in §6.

---

## 1. The Field Note (Upstream Evolution, PR #1500 → Main)

> Captured verbatim from Risto, 2026-07-07. This is the source formulation — do not compress on future edits (DWS_DOCUMENT_STANDARD.md §21).

Since the repository transitioned through its early development phases—around PR #1500 (early 2024, during the Preview 3/4 stage of the initial .NET Aspire 8.0 release)—and progressed up to the current changes in main, .NET Aspire has transformed from an experimental, C#-centric microservices orchestrator into a mature, highly decoupled, polyglot (multi-language), and AI-integrated cloud-native development stack.

Thousands of pull requests have introduced major shifts in architecture, developer tooling, and cloud deployment pipelines. Below is a breakdown of the monumental changes and features introduced between PR #1500 and the current state of the main branch:

### 1.1 Architectural Evolution & SDK Simplification

- **From Components to "Integrations":** Around PR #1500, backing services were known as Aspire Components. To align better with standard .NET ecosystem terminology and avoid confusion with UI components, the team refactored the vocabulary, renaming them to Aspire Integrations.
- **Workload Decoupling:** In early previews, building an Aspire application required the heavy .NET Aspire Workload to be explicitly installed on the machine. The project has since decoupled this requirement. You can now build, run, and test Aspire applications purely via NuGet packages, which dramatically simplifies CI/CD build runners.
- **Simplified AppHost SDK:** The boilerplate inside AppHost projects has been vastly reduced. The SDK is now declared directly inside the project file (`Sdk="Aspire.AppHost.Sdk/13.x"`), automatically injecting the core hosting references without needing explicit package tags or duplicate `<Sdk Name="..." />` entries.

### 1.2 First-Class Polyglot (Multi-Language) Support

While the early framework was heavily bound to C# and ASP.NET Core, the current main branch supports building multi-language microservices seamlessly:

- **JavaScript & TypeScript:** Aspire features auto-detection and native hosting for Vite, npm, pnpm, and Yarn-backed frontend clients. It automatically manages port binding, hot module replacement (HMR), and container-based production pipelines for Node.js apps.
- **Python Support:** Through APIs like `WithPip()`, Aspire natively supports Python scripts and modules (such as Flask or FastAPI/Uvicorn). It can automatically walk up directories to find virtual environments (`.venv`), install requirements from `requirements.txt` or `pyproject.toml`, and attach debuggers with variable inspection.
- **Cross-Language Trust:** Security infrastructure has been added to handle automatic TLS termination and certificate trust across different languages and containers, ensuring a Python backend or Node frontend can talk to a C# API over HTTPS seamlessly.

### 1.3 The Dashboard Revolution (AI & Telemetry Visualizations)

The Aspire Dashboard has evolved from a basic telemetry UI into an advanced operations control center:

- **GenAI Visualizer:** Introduced to support LLM workflows, this feature collates, summarizes, and visually traces AI/LLM-centric calls. Developers can view highlighted JSON/XML payloads, explore prompt input/output messages, and preview multimodal markdown text directly from the trace log.
- **GitHub Copilot Integration:** The dashboard integrates with AI coding assistants to review hundreds of log messages in a single click, identify root causes of distributed errors, and highlight bottlenecks within telemetry traces.
- **The Aspire Resource Graph:** Provides an interactive force-directed visual map layout showing how your services, databases, caches, and uninstrumented external resources connect to one another.
- **Custom Resource Commands:** Developers can now build programmatic buttons inside the dashboard UI using `WithHttpCommand()`. This lets you click a button on the dashboard to trigger actions like seeding a database, flushing a Redis cache, or running migrations.

### 1.4 Standalone CLI & Tooling Enhancements

The CLI has evolved into a robust standalone environment manager:

- **Native AOT Compilation:** The `aspire` CLI tool is compiled using Native AOT, providing instant execution and significantly reduced local resource overhead.
- **Lifecycle State Commands:** New commands make setting up and tearing down microservice topologies effortless:
  - `aspire init`: Sweeps existing legacy applications and automatically sets up an Aspire AppHost wrapper.
  - `aspire update`: Intelligently analyzes your solution packages and upgrades AppHost integrations safely across custom or stable release channels.
  - `aspire destroy`: Gracefully tears down infrastructure stacks across local Docker Compose, Kubernetes (via Helm), or Azure ARM environments.

### 1.5 Deployment and Cloud-Native Polish

- **Docker Compose Publisher:** The deployment engine natively supports exporting your application architecture definition into multi-container Docker Compose files, converting resource endpoints into environment variables dynamically.
- **Isolated Managed Identities:** When deploying to Azure Container Apps (ACA), the execution security model was rewritten. Instead of sharing a single broad managed identity across the cluster, Aspire now automatically spins up granular, per-application isolated managed identities by default.
- **Deep Linking for Cloud Infrastructure:** Integrations for cloud ecosystems (such as Azure Cosmos DB, Service Bus, Event Hubs, and OpenAI) support Deep Linking, enabling the AppHost to pass child configurations (like specific queues, tables, or model deployments) seamlessly through standard connection strings.

---

## 2. Lessons Learned to Implementation (DWS IQ 6)

Each upstream track maps to a concrete DWS lesson. The pattern to notice across all five: **Aspire won by deleting prerequisites, not by adding features** — every major shift (workload removal, SDK one-liner, polyglot, AOT CLI) reduced what a developer or CI runner must have installed before the tool works.

### 2.1 Vocabulary refactors are product work, not cosmetics (Components → Integrations)

Microsoft renamed a shipping concept mid-flight because the old name collided with an adjacent mental model (UI components). They ate the migration cost early rather than compounding confusion.

**DWS application:** identical to our Terminology Guardrail — the deprecated "GodAgent" wording and the noise-floor ontology relabeling (`2026-06-15-noise-floor-ontology-old-labels.md`). The lesson learned to implementation: when a taxonomy term is wrong, rename it while the blast radius is small and enforce via lint (`/truth-check`), exactly as Aspire did. A wrong name kept for compatibility becomes permanent.

### 2.2 Delete machine prerequisites; ship everything through the package channel (Workload decoupling)

Aspire's single biggest DX win was removing the machine-level Workload install: any runner with the SDK can now build via NuGet alone.

**DWS application:** this is the property our cloud-session model already depends on — ephemeral containers must reach green with `npm install && npm run build && npm test` and nothing else. The lesson: treat any setup step that lives outside the package manifest (a global tool, a manual `.env` copy, an apt package not in the session-start hook) as a defect with a deadline. Audit trigger: if `session-start.sh` or a worktree script grows a new manual prerequisite, that's the "Aspire Workload" anti-pattern reappearing.

### 2.3 Polyglot AppHost dissolves our April blocker (JS/TS + Python first-class)

The April 2026 note rejected AppHost adoption (option 2) mainly because DGX Spark has no .NET toolchain and the TypeScript AppHost was preview-only. Per this field note, JS/TS and Python hosting are now first-class: npm/Vite auto-detection, `WithPip()`, `.venv` discovery, cross-language TLS trust.

**DWS application:** the DWS stack is exactly the shape Aspire now targets natively — TypeScript backend (`src/`), Python suite (`Firehorse/`), containers on DGX Spark. An AppHost could orchestrate the existing stack without a single line of C# beyond (or possibly including) the AppHost itself. The cross-language TLS trust work also addresses a real DWS pain: Node ↔ Python ↔ container HTTPS inside the DGX perimeter currently relies on hand-managed certs. **Action:** re-score option 2 (Section 3).

### 2.4 The GenAI visualizer closes a gap we flagged as open — update the record

The 2026-04-08 research note's gap table asserted, for both Aspire and dotnet-skills:

| Observability need (per 2026-04-08 table) | April 2026 status          | Status per this note                                                                         |
| ----------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------- |
| AI/LLM agent tracing                      | NOT built-in — Gap for DWS | **Partially closed** — GenAI visualizer traces LLM calls, prompt in/out, multimodal payloads |
| MCP tool call tracing                     | NOT built-in — Gap for DWS | Still open upstream (no claim of MCP-span awareness)                                         |
| Token/cost tracking                       | NOT built-in — Gap for DWS | Unverified — GenAI visualizer may surface token counts; verify                               |
| EU AI Act audit logging                   | NOT built-in — Gap for DWS | Still open — remains a DWS differentiator                                                    |

**DWS application:** the Control Room / LWM observability plan (`2026-05-15-opentelemetry-genai-observability-control-room.md`) should evaluate the Aspire Dashboard GenAI visualizer as the _dev-time_ LLM trace viewer, since it reads standard OTel GenAI semantic-convention spans — which our TypeScript agents can emit regardless of Aspire adoption. The remaining open rows (MCP tracing, EU AI Act audit logging) are confirmation that the DWS agent-observability layer still has a defensible scope; we build the two rows Aspire didn't, not the one it did.

### 2.5 `WithHttpCommand()` is the dashboard-button pattern our Control Room already needs

Programmatic buttons on the dashboard (seed DB, flush cache, run migrations) are operator affordances defined next to the resource they act on.

**DWS application:** the Lifetime Fleet Control Room / `remote-control` skill has the same shape — mission commands attached to devices. Lesson learned to implementation: define operator commands _in the resource model_ (one declaration → CLI + JSON + UI button), not as separate dashboard features. This is the "Agent Productization Rule" applied to human operators; the two surfaces should be generated from the same declaration. Caution: any DWS equivalent of "run migrations" as a button must respect the RED-zone gate — migration _files_ are GREEN, migration _application_ stays human-gated.

### 2.6 Lifecycle verbs and AOT: the CLI is the product (init / update / destroy)

`aspire init` (adopt legacy apps in place), `aspire update` (safe dependency upgrades across release channels), `aspire destroy` (tear down compose/Helm/ARM stacks) — plus Native AOT for instant startup — confirm the trajectory the 2026-04-10 note documented: the CLI is a first-class agent interface.

**DWS application:** the `dws` CLI has run/agents/workflow verbs but no lifecycle symmetry — there is no `dws destroy` for a provisioned customer stack and no `dws update` that safely bumps integration versions. The already-flagged `dws docs` gap (2026-04-10 note, §3.7) remains open as well. Lesson: adopt vs. build stays the rule of thumb — where Aspire ships a verb we lack, prove it in their tooling first (option 1 posture), then decide whether `dws` needs its own.

### 2.7 Per-app isolated identities validate the KYA/Aegis posture

Aspire's ACA security-model rewrite — granular per-application managed identities by default, replacing one broad cluster identity — is Microsoft independently converging on the DWS position: least-privilege identity _per agent/workload_, not per cluster.

**DWS application:** direct external validation for KYA session-scoped trust and the Aegis sovereignty pitch. Use in partner/investor narrative (after primary-source verification): "the default in mainstream cloud tooling is now per-workload isolated identity — DWS applies the same principle per _agent_." Also an implementation check: any DWS service on DGX Spark or GCR still running under one shared service account is now behind the mainstream default, not ahead of it.

### 2.8 Compose publisher: AppHost as source-of-truth, compose as artifact

Aspire can now emit `docker-compose.yml` from the resource graph, endpoints converted to env vars dynamically.

**DWS application:** `infrastructure/dgx-spark/docker-compose.yml` is today hand-maintained. If option 2 is ever adopted, the compose file becomes a _generated artifact_ of a TypeScript AppHost rather than the source — which would eliminate the class of drift the 2026-04-10 note documented (narrative says Aspire, compose says nothing). Until then, the lesson is the general one: wherever DWS keeps two representations of one topology (compose + docs + partner deck), generate the downstream ones.

---

## 3. Adoption Decision Refresh (options from 2026-04-10, re-scored)

| Option                                                         | April 2026 assessment                                           | July 2026 re-score                                                                                                                                                                |
| -------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Dashboard-only** (standalone OTLP container on DGX Spark) | Recommended; ~2h                                                | **Still recommended, value increased** — GenAI visualizer now included; our TS agents emit OTel GenAI spans and get LLM trace UI for free                                         |
| **2. AppHost + ServiceDefaults**                               | Rejected: ~20h + .NET toolchain on DGX; TS AppHost preview-only | **Re-score warranted** — polyglot AppHost first-class per this note; no .NET runtime blocker claimed. Needs primary-source verification of TS AppHost GA status before committing |
| **3. Do nothing**                                              | Acceptable; fix overclaiming docs                               | Weakened — the gap between "reference architecture" and "deployed" now costs us a free GenAI trace viewer                                                                         |

**Recommendation (unchanged in direction, stronger in urgency):** execute option 1 — pin `mcr.microsoft.com/dotnet/aspire-dashboard:13.x` (never `:latest`) into `infrastructure/dgx-spark/docker-compose.yml`, wire `OTEL_EXPORTER_OTLP_ENDPOINT`, and validate the GenAI visualizer against real DWS agent spans. Gate option 2 on primary-source confirmation that the TypeScript AppHost is out of preview. This note does not make the change — adoption remains a strategy decision (CEO-level), and infrastructure edits belong to their own PR with verification.

> **v1.1:** superseded by reality — option 1 was executed in compose v1.1.1 (April), before this note existed. What remained "possible now" was making it actually work: the OTLP port fix shipped in compose v1.3.1 (§6.2). Option 2 gating is unchanged. The remaining decision is no longer _whether_ to run the dashboard, but whether to enable GenAI **message-content capture** on LLM spans (§6.3) — that is a data-protection call, not a tooling call.

---

## 4. Honesty Register

- **Section 1 is not primary-source-verified in this session.** It is Risto's synthesis; overlap with the web-verified 2026-04-10 note (polyglot, rebrand, SDK line, CLI-as-agent-interface) is confirmed, but GenAI visualizer, `WithPip()`, `aspire init/update/destroy`, compose publisher, per-app managed identities, and deep linking are asserted here without fetched sources. _(v1.1: GenAI visualizer now verified, Copilot-UI claim corrected — see §6.1; the rest still open.)_
- **"PR #1500" is used as an era marker** (early 2024, 8.0 Preview 3/4), not as a claim about that specific PR's content.
- **"13.x" is deliberately imprecise.** The last version this repo verified was 13.2 (March 31, 2026); the current minor as of July 2026 was not checked.
- **Token/cost tracking status in the GenAI visualizer is unknown** — the gap-table row in §2.4 is marked unverified for a reason.

---

## 5. Follow-Up Actions

- [x] ~~Primary-source verification sweep (dashboard claims)~~ — done in v1.1 for the GenAI visualizer (9.5+, improved 13.2), dashboard endpoint config, and Copilot-UI removal (13.3). STILL OPEN: TS AppHost GA status, `WithPip()` surface, `aspire destroy` targets, ACA per-app identity default (aspire.dev direct fetch 403s; verify via InfoQ/VS Magazine or MS Learn next session).
- [x] ~~Option-1 implementation PR~~ — moot; already deployed since compose v1.1.1. The real gap was the OTLP port bug, fixed in compose v1.3.1 (§6.2). **Deploy note:** the fix takes effect on DGX Spark at the next `docker compose up -d` after this branch merges and the host pulls.
- [x] ~~Evaluate OTel GenAI spans in `src/agents/`~~ — already implemented: `withLLMSpan()`/`recordLLMResponse()` in `src/observability/tracing.ts`, used by `src/agents/llm-client.ts`; attrs persisted per migration 066.
- [ ] **Verify on-device after merge:** open `http://dgx-spark:18888`, confirm traces from `dws-backend` appear and LLM spans show the GenAI sparkle icon. If spans arrive but the GenAI chat view is empty, that is the message-content-capture decision (§6.3), not a wiring failure.
- [ ] Decide (human, data-protection): enable GenAI message-content capture on LLM spans? Prompts/completions would then be stored in dashboard memory (dev tool, in-memory, EU host — but still content persistence). Default today: OFF.
- [ ] Re-score option 2 formally once TS AppHost GA is confirmed; if adopted, compose file becomes generated (§2.8).
- [ ] Audit DGX Spark / GCR service accounts against the per-workload-identity default (§2.7); list any shared-identity services.
- [ ] Carry-over from 2026-04-10 (still open): `dws docs {list,search,get}` design; `Partners/Partners_gamma.md:341` Aspire overclaim correction (needs human approval).

---

## 6. v1.1 — Verification Results and Repo Reality Check

### 6.1 Primary-source verification (what "Implement what is now possible" confirmed)

| Claim (from §1)                                                              | Verdict                                                                                                                                                                                                                                                                                                                  | Source                                                                                                                                      |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| GenAI visualizer in the dashboard                                            | **CONFIRMED** — introduced in Aspire **9.5**, improved in 13.2 (schema handling, tool inspection). Sparkle icon on `gen_ai.*` spans opens a chat log: system prompt, messages, tool calls, token counts, finish reason. Works best with message-content capture enabled; without it the dialog shows a note + docs link. | devblogs.microsoft.com/dotnet/announcing-dotnet-aspire-95; devblogs.microsoft.com/aspire/aspire-dashboard-improvements-export-and-telemetry |
| GitHub Copilot integration in dashboard                                      | **OUTDATED** — the in-dashboard Copilot UI was **removed in Aspire 13.3**; AI coding agents now access telemetry via the Aspire CLI and MCP server (`Dashboard:AI:Disabled` is "reserved for future use").                                                                                                               | aspire.dev dashboard configuration reference (fetched 2026-07-07)                                                                           |
| Dashboard endpoint layout                                                    | **CONFIRMED** — three distinct endpoints: frontend UI `:18888` (`ASPNETCORE_URLS`), OTLP/gRPC `:18889` (`ASPIRE_DASHBOARD_OTLP_ENDPOINT_URL`), OTLP/HTTP `:18890` (`ASPIRE_DASHBOARD_OTLP_HTTP_ENDPOINT_URL`).                                                                                                           | aspire.dev dashboard configuration reference                                                                                                |
| `WithPip()`, `aspire destroy` targets, per-app ACA identities, TS AppHost GA | **STILL UNVERIFIED** — aspire.dev pages 403 on direct fetch from this environment (same as April); MS Learn search did not surface them this session.                                                                                                                                                                    | —                                                                                                                                           |

### 6.2 Repo reality check — v1.0 had the deployment status backwards

What the tree actually contains (all pre-dating this note):

- `infrastructure/dgx-spark/docker-compose.yml` v1.1.1+ — **`aspire-dashboard:13.3.5` pinned**, dashboard-only, exactly the April option 1, citing the April field note.
- `src/observability/otel.ts` — opt-in OTel SDK init (no-op without `OTEL_EXPORTER_OTLP_ENDPOINT`), called from `src/app.ts:16`, graceful shutdown on SIGTERM/SIGINT.
- `src/observability/tracing.ts` — `withAgentSpan` / `withWorkflowSpan` / `withLLMSpan` / `withToolSpan` helpers; `withLLMSpan` + `recordLLMResponse` emit OTel **GenAI semantic-convention** attrs (`gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.input_tokens`, …), consumed by `src/agents/llm-client.ts` and `src/agents/index.ts`.
- `src/agents/telemetry.types.ts` v1.1 — GenAI attrs persisted via migration `066_tool_telemetry_genai.sql`, cross-referencing OTel `trace_id`/`span_id`.

**And the bug this exposed:** all three OTLP producers (`dws-backend`, `dws-cron`, `bumblebee-collector`) were configured with `OTEL_EXPORTER_OTLP_ENDPOINT: http://aspire-dashboard:18888` — the **UI port**. The dashboard's OTLP/HTTP listener is `:18890` (§6.1). The compose v1.2.0 changelog shows the trap: it "fixed" the protocol by moving from the gRPC port (18889) to the UI port (18888) — from one wrong port to another. Telemetry was HTTP-POSTed at the frontend endpoint and dropped; nothing failed loudly because the OTel BatchSpanProcessor swallows export errors by design. **Fixed this session in compose v1.3.1:** all three producers → `:18890`, comments corrected in the compose file and `bumblebee/scan-and-emit.ts`. Takes effect at the next `docker compose up -d` on the DGX host after merge.

**Lesson (append to §2's list):** the April note's gap-detection rule — "when the narrative layer mentions a version number, verify it against the actual deployed artifact" — needs a stronger form: _verify against the deployed artifact AND its observed behavior._ Here the artifact existed and the narrative lagged in the pessimistic direction, while the artifact itself was silently broken. A dashboard that receives zero telemetry looks identical to a dashboard nobody wired up.

### 6.3 The remaining decision — message-content capture

The GenAI visualizer's chat view needs prompt/completion content recorded onto spans. Our `withLLMSpan` deliberately records only metadata (model, token counts, finish reason) — no message bodies. Enabling content capture would put prompts and completions into dashboard memory (dev-tool, in-memory, EU host — but content persistence nonetheless, with GDPR/customer-data implications for agents that process customer text). This is a human data-protection decision, logged as a follow-up; default remains OFF.

---

## CHANGES MADE

- `docs/field-notes/2026-07-07-aspire-development-evolution-pr1500-to-main.md` v1.0: created — preserved Risto's PR #1500 → main evolution synthesis verbatim, mapped five upstream tracks to eight DWS implementation lessons, updated the 2026-04-08 observability gap table (GenAI visualizer partially closes the AI/LLM tracing gap), re-scored the April adoption options, logged honesty register and follow-ups
- v1.1: verification sweep (§6.1), repo reality check correcting v1.0's "not deployed" premise (§6.2), OTLP port bug found and fixed
- `infrastructure/dgx-spark/docker-compose.yml` v1.3.1: `OTEL_EXPORTER_OTLP_ENDPOINT` 18888→18890 on `dws-backend`, `dws-cron`, `bumblebee-collector`; endpoint documentation corrected on the `aspire-dashboard` service block
- `infrastructure/dgx-spark/bumblebee/scan-and-emit.ts`: header comment 18888→18890 (comment-only; no code change — the exporter reads the env var)
- `.claude/HANDOFF.md`: CURRENT HANDOFF updated at both checkpoints

## THINGS I DIDN'T TOUCH

- `src/observability/*`, `src/agents/llm-client.ts`: already correct — `otel.ts` appends `/v1/traces` to whatever endpoint it is given, so the compose-level fix is sufficient; no message-content capture added (§6.3, human decision)
- Dashboard auth (`DASHBOARD__FRONTEND__AUTHMODE: Unsecured`): pre-existing posture on a LAN-only host port; flagged under POTENTIAL CONCERNS, not changed unilaterally
- `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md`: not back-edited — the gap-table update lives here (§2.4) with the old note preserved as a historical snapshot
- `Partners/Partners_gamma.md`, `Learn/Oppimispäiväkirja.md`: partner deck (needs approval) and thesis file (RED zone) — carried over as open items, untouched

## POTENTIAL CONCERNS

- **The port fix is verified against primary docs, not against a running host.** This container cannot reach DGX Spark. The follow-up list includes the on-device check: traces visible at `http://dgx-spark:18888` after the next compose pull. If 13.3.5's OTLP/HTTP default differs from the current docs (unlikely — the config reference is versionless and 4318:18890 appears in the canonical example), the on-device check catches it.
- **Dashboard runs `Unsecured` on both frontend and OTLP** with port 18888 published on the host. On a LAN-only DGX host this matches the dev-tool posture, but heartbeat/state-observer already hit it unauthenticated — if the host ever gets a routable interface, this becomes an exposure. Consider `BrowserToken` frontend auth as hardening.
- The still-unverified §1 claims (per-app identities, `WithPip()`, `aspire destroy`) remain unusable in partner/investor material until sourced.
- The repo formatter rewrites `***` thematic breaks to `---`, conflicting with `DWS_DOCUMENT_STANDARD.md`'s Pandoc rule for the VERSION AND AGENT HISTORY block. Every recent field note has the same issue — this is a hook/standard conflict to resolve once, centrally, not per-document.
