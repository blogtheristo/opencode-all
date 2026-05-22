# Field Note: OpenTelemetry GenAI Observability — Control Room Telemetry Update

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/update-control-room-telemetry-s9I4X | Date: 15.05.2026 | Changes: Initial field note. Documents the May 2026 OpenTelemetry GenAI Observability post, the resulting refresh of the control-room deployment script (`scripts/deploy-control-room.sh`), and the additive backend telemetry schema (`gen_ai.*` semantic-convention fields on `tool_telemetry`).

Session Links & References:

- Source: OpenTelemetry blog — GenAI Observability (https://opentelemetry.io/blog/2026/genai-observability/)
- OTel GenAI semantic conventions: https://opentelemetry.io/docs/specs/semconv/gen-ai/
- Related DWS field note: `docs/field-notes/2026-05-02-gcp-otel-ingestion-api-launch.md`
- DWS observability assessment: `observability/observability.md` §4.2
- Article 12 logging pipeline: `DWS_ARTICLE_12_LOGGING_STANDARD.md` §2–§3
- Claude Code session branch: `claude/update-control-room-telemetry-s9I4X`

Document Status:

- Created: 15.05.2026
- Last Modified: 15.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Infrastructure Change

Related Documents:

- `dws6.com/dashboard/control-room/index.html`
- `landing-pages/dws6-com/dashboard/control-room/index.html`
- `scripts/deploy-control-room.sh`
- `src/agents/telemetry.types.ts`
- `src/agents/telemetry.service.ts`
- `supabase/migrations/066_tool_telemetry_genai.sql`

***

- **Date:** 15.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Location:** EU — Finland
- **Context:** DWS Control Room dashboard + ASTA tool telemetry — aligning event schema and deployment with OpenTelemetry GenAI semantic conventions following the May 2026 OTel blog post.

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Observability > OpenTelemetry > GenAI
- **Entities:** OpenTelemetry, DWS IQ 6, Control Room, ASTA, telemetry.googleapis.com, Aiven Postgres, Supabase
- **Standards:** OpenTelemetry GenAI semantic conventions, OTLP, EU AI Act Article 12, DWS Article 12 Logging Standard
- **Temporal Context:** 2026-Q2; logged 2026-05-15
- **Confidence:** High — official OpenTelemetry community announcement

***

## What Happened

OpenTelemetry published "GenAI Observability" (May 2026), reaffirming the GenAI semantic-convention namespace and clarifying the recommended shape for LLM and agent traces:

- **Span attributes** — `gen_ai.system`, `gen_ai.operation.name`, `gen_ai.request.model`, `gen_ai.response.model`, `gen_ai.request.max_tokens`, `gen_ai.request.temperature`, `gen_ai.request.top_p`, `gen_ai.usage.input_tokens`, `gen_ai.usage.output_tokens`, `gen_ai.response.finish_reasons`, `gen_ai.response.id`.
- **Operation/span naming** — `{gen_ai.operation.name} {gen_ai.request.model}` (e.g. `chat claude-opus-4-7`).
- **Metrics** — `gen_ai.client.token.usage` (histogram, `gen_ai.token.type` dimension) and `gen_ai.client.operation.duration`.
- **Events** — message events (`gen_ai.user.message`, `gen_ai.system.message`, `gen_ai.assistant.message`, `gen_ai.tool.message`) and a `gen_ai.choice` event for responses.
- **Status** — the GenAI conventions remain experimental as a group but the core attribute names above are stable and recommended for production agents.

The post sits squarely on top of the GCP OTel ingestion API change captured in `2026-05-02-gcp-otel-ingestion-api-launch.md`: the vendor endpoint exists, and now the schema is converging.

## DWS Impact

### Control Room (`dws6.com/dashboard/control-room/`)

The Control Room is the operator surface for the same event stream Article 12 logs to. Today's `index.html` renders three demo events from a hand-rolled `eventSchema` array with fields `source`, `severity`, `assetId`, `actionRequired`, `message`. None of those map to OTel — once the backend starts emitting `gen_ai.*` spans, the Control Room cannot show GenAI events (model, token cost, finish reason) without a schema bridge.

This field note captures the **bridge layer**, not a UI rewrite:

1. The deployment script (`scripts/deploy-control-room.sh`) is added so that Control Room rolls forward together with backend telemetry. It enforces the dual-folder sync (`dws6.com/` → `landing-pages/dws6-com/`) per `CLAUDE.md`, validates the OTel endpoint env vars before sync, and refuses to deploy if the source and mirror diverge after copy.
2. The backend telemetry service (`src/agents/telemetry.service.ts` + `telemetry.types.ts`) gains optional `gen_ai.*` fields and OTel `trace_id` / `span_id`, written through migration `066_tool_telemetry_genai.sql`. Existing tool-invocation events are unaffected; only LLM operations populate the new columns.

### ASTA Tool Telemetry

ASTA (Phase 1, PR-TBD) was scoped to tool-use rate and partial-failure detection — model-aware token accounting was out of scope. The OTel GenAI conventions now give us a stable schema for that gap without inventing new field names. Adopting them keeps the `tool_telemetry` table aligned with anything we later export to `telemetry.googleapis.com` or to Langfuse via OTLP.

### Article 12 Logging Pipeline

The mandatory log schema in `DWS_ARTICLE_12_LOGGING_STANDARD.md` §3 already carries `trace_id: otel_trace_id` and `span_id: otel_span_id`. Adding the matching attributes to `tool_telemetry` means the same trace correlates ASTA telemetry, Article 12 events, and the Control Room feed — no downstream join logic to invent.

### Sovereignty Assessment

| Criterion                | Status                                                                                                   |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Data residency**       | `gen_ai.*` columns live in Supabase (Tier 2) or Aiven Postgres (Aegis, FI) — no change to residency tier |
| **CLOUD Act exposure**   | Unchanged — attribute additions, not a transport change                                                  |
| **EU AI Act Article 12** | Net positive — trace correlation now spans tool, model, and Control Room events                          |

## The Insight

The cheapest version of "AI observability" is **don't invent your own names for things that already have stable OTel names**. ASTA was close to coining a parallel vocabulary (`prompt_tokens`, `completion_tokens`, `model_version`) just like the OpenAI-style fields scattered across `src/services/climate-assistant-gated.service.ts` and `src/sandbox/cloudrun-ephemeral.ts`. The OTel GenAI post is the trigger to converge — once, before more services land.

Doing this on the same branch as the Control Room deploy script keeps the front-end consumer and the backend producer locked together: when the Control Room learns to render `gen_ai.usage.output_tokens`, the column already exists.

## Required Actions

| #   | Action                                                                                          | File                                                                                                | Priority |
| --- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------- |
| 1   | Add optional `gen_ai.*` and OTel trace fields to `ToolTelemetryEvent`                           | `src/agents/telemetry.types.ts`                                                                     | HIGH     |
| 2   | Persist new fields in the Supabase flush + skip writes when absent                              | `src/agents/telemetry.service.ts`                                                                   | HIGH     |
| 3   | Add migration `066_tool_telemetry_genai.sql` for the new columns                                | `supabase/migrations/066_tool_telemetry_genai.sql`                                                  | HIGH     |
| 4   | Create `scripts/deploy-control-room.sh` enforcing dual-folder sync and OTel env-var sanity      | `scripts/deploy-control-room.sh`                                                                    | HIGH     |
| 5   | Note the OTel GenAI naming convergence in the observability assessment                          | `observability/observability.md` §4.2 (deferred — out of branch scope)                              | LOW      |

Actions 1–4 land on branch `claude/update-control-room-telemetry-s9I4X`. Action 5 is deferred to a docs-only follow-up to keep this branch reviewable.

## Next Steps

- [ ] Wire `llm-client.ts` and `climate-assistant-gated.service.ts` to call `telemetryService.recordInvocation` with the new `gen_ai.*` fields populated from the provider response (separate branch).
- [ ] Extend the Control Room `eventSchema` (`dws6.com/dashboard/control-room/index.html`) to render `gen_ai.usage.*` and `gen_ai.response.finish_reason` once backend emission is in place. Sync to the landing-pages mirror in the same commit.
- [ ] Decide whether to export `tool_telemetry` rows via OTLP to `telemetry.googleapis.com` for the Aegis Article 12 pipeline, or keep the export Langfuse-only. Track on the Q2 2026 Aegis roadmap.
