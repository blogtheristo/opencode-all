# Field Note: Hakimi's Critique — Observability Is Not Authorization; the Span-Stamped Verdict Answer

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/aspire-development-evolution-16fxg0 | Date: 07.07.2026 | Changes: Captured Hakimi's critique of the week's Aspire/OTLP observability work, verified it against the code (llm-client.ts has no ex-ante gate; KYA enforcement lives only at the sandbox layer), implemented the span-stamped-verdict answer (`KYAVerdict` + `dws.kya.*` attributes in `src/observability/tracing.ts`, default `ungated`, 2 new tests), and logged the §14.37 correction shipped in thesis v3.79

Document Status:

- Created: 07.07.2026
- Last Modified: 07.07.2026
- Language: English
- Publication Status: ACTIVE
- Document Type: Field Note / External Critique / Design Decision

Related Documents:

- docs/field-notes/2026-07-07-aspire-development-evolution-pr1500-to-main.md (v1.1 — the work being critiqued)
- docs/PHD_FIREHORSE_EN.md §14.37.4 (the correction this critique forced)
- docs/metropolia/master-thesis/en/V3Thesis_EN.md §10.25 (implementation context)

---

## The Critique (verbatim)

> "Polyglot OTLP is right, no stack should pretend to be .NET to be seen. But every LLM call it lights up is a record of what already fired. The trace shows the agent reached prod. It never shows whether it should have been able to."
> — Hakimi, 2026-07-07

## Verification Against the Code

The critique is factually accurate for this stack as of commit `dfecf4c`:

- `src/agents/llm-client.ts` contained exactly one authorization concept: the HTTP `Bearer` header sent to the model provider.
- KYA trust-score enforcement exists only at the sandbox boundary (`src/sandbox/nemoclaw-sandbox.ts`, `src/mcp/nemoclaw-bridge.ts`) — a different code path. Its verdicts never reached the telemetry layer.
- The GenAI spans (`gen_ai.*`) are pure Article 12 material: what fired, with what model, at what token cost. Nothing on the span records under what authority the execution was permitted (Article 14 / KYA).

## The Answer: Stamp the Verdict onto the Span

Implemented this session in `src/observability/tracing.ts`:

- **`KYAVerdict`** — `{ decision: 'allowed' | 'denied', trustScore?, policyVersion?, gate? }`, accepted by `withAgentSpan` and `withLLMSpan`.
- **Span attributes** — `dws.kya.verdict`, `dws.kya.trust_score`, `dws.kya.policy_version`, `dws.kya.gate`, emitted alongside the `gen_ai.*` attributes so the same trace answers both questions: what fired, and under what authority it was allowed to fire.
- **The load-bearing default:** a span with no verdict is stamped `dws.kya.verdict: "ungated"` — never left blank. Absence becomes a queryable finding (filter the trace UI on `ungated` to enumerate every execution path no gate cleared) instead of being indistinguishable from gated execution. This is Engineering Discipline Rule 12 applied to authorization coverage.
- Tests: verdict stamping + ungated default (`src/__tests__/otel-tracing.test.ts`, 8/8 passing).

**Honest current state:** every production span today reads `ungated`, because no caller passes a verdict yet — the sandbox gate and the LLM path are not yet connected. That is the truthful baseline the vocabulary makes visible, and closing it (thread the sandbox verdict through `llm-client.ts` / agent runner call sites) is the named follow-up, not an implied fait accompli.

## Sequencing Doctrine

Observe → gate → **record the gate's verdict in the observation**. The week's OTLP work completed layer one; the KYA sandbox is layer two on a disconnected path; this change builds the junction. The §14.37 "conformance evidence as a projection of operational telemetry" thesis is only fully true once ex-ante verdicts are part of the projection — the correction is recorded as §14.37.4 in thesis v3.79.

## Follow-Up Actions

- [ ] Thread real verdicts: emit `KYAVerdict` from the sandbox/bridge gate and pass it through agent runner + `llm-client.ts` call sites, replacing the all-`ungated` baseline.
- [ ] Dashboard check after next deploy: filter traces on `dws.kya.verdict = ungated` — the count is the authorization-coverage gap metric.
- [ ] Consider a `denied`-but-executed alert (a span carrying `decision: 'denied'` that still ran is a leash failure, not a telemetry curiosity).
