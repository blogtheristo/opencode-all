# DGX task — wire the tiered Ollama-boss routing into model-selector.ts

Run on the DGX (Ollama reachable at localhost:11434). Branch:
claude/ollama-orchestration-merge-047pj7 (pull --rebase first). Goal: make the
boss run on a strong LOCAL model and workers on a small LOCAL model, escalating
only the hardest calls to Opus 5 via API — per
docs/field-notes/2026-07-26-ollama-boss-cost-architecture.md.

Edit `src/agents/model-selector.ts` (read it first — reuse existing symbols):
- **T0 workers (LITE tier):** confirm `qwen2.5:7b` (provider `ollama-local`) is the
  first/preferred model in `MODEL_CATALOG.lite`. Keep it.
- **T1 boss (HEAVY tier):** add `qwen2.5:72b` (provider `ollama-local`, ~44 GB disk,
  ~48 GB ram, contextWindow 32768, supportsTools true) as the FIRST model in
  `MODEL_CATALOG.heavy`, so the orchestrator prefers the local 72B when
  `isProviderAvailable('ollama-local')` (OLLAMA_BASE_URL set).
- **T2 escalation (hardest ~5%):** set the `anthropic` option in `MODEL_CATALOG.heavy`
  to model id `claude-opus-5` ($5/$25). It is only reached as the cloud fallback when
  no local HEAVY provider is available, OR via an explicit escalate path — add a
  helper `escalateToClaude(agentName)` that forces the anthropic/`claude-opus-5`
  option and is gated on `isProviderAvailable('anthropic')` (ANTHROPIC_API_KEY). Never
  the Pro subscription — this is the metered API key path.
- **AGENT_TIER_MAP:** map the orchestrator/boss agent name(s) to `'heavy'` and the
  high-volume classify/triage/safety agents to `'lite'`.
- Keep the existing tier-fallback chain (local → cloud) intact.

Then: update `src/__tests__/model-selector.test.ts` to assert (a) boss→qwen2.5:72b
local when OLLAMA_BASE_URL set, (b) workers→qwen2.5:7b, (c) escalateToClaude→claude-opus-5
only when ANTHROPIC_API_KEY set, (d) graceful fallback when a provider is absent.
Run `npm run build` (tsc) + `npm test` (vitest) green. No secrets in code — keys via env only.

Commit on branch claude/ollama-orchestration-merge-047pj7 (DGX is the sole writer per
the handoff), pull --rebase before push. This is code — do NOT open a PR without asking.
