# Handoff — claude/register-mgd-crc-truth-0ceter

**Task:** Step 1 REGISTER — add MGD/CRC north-star metric doctrine to the DWS Truth Registry.

## Done (this session)

- **`config/truth/mgd-crc-metrics.json`** (new) — structured mirror of the field note
  `docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md` §3.
  - `humanReadableSource` = the exact field note path (traceable by `/truth-check`).
  - MGD + CRC metric definitions copied **verbatim from §3** (no paraphrase).
  - `deprecatedDisplayPhrases` seeded from the §2 anti-games table (4 games:
    agent/skill/workflow count · tokens consumed/API throughput · benchmark scores/model
    rankings · logos/sign-ups/pilot count). `approvedDisplayPhrases` = MGD / CRC family.
- **`scripts/lint-truth-claims.mjs`** — added `config/truth` as the 4th mirror-discovery
  dir; excluded the field note from being self-scanned (it now holds the phrases as data,
  like the registry doc).
- **`DWS_TRUTH_STANDARD.md`** — §2 row 29 registered; v3.5→v3.6; Last Modified 14.07.2026;
  §6 drift-log entry added.
- **Field note** — added canonical-registry declaration (§3 = source of truth; mirror path).

## Verified

- `node scripts/lint-truth-claims.mjs --check "agent count"` → FAIL, suggests
  "Monthly Governed Decisions"/"MGD". ✅ (the required Step-1 test)
- JSON parses; 34 deprecated + 5 ambiguous phrases load (was 19 → +15).
- Registry doc + field note excluded from scan (0 self-flags).

## Resolved

- **False positive fixed by rewording** (founder chose "reword the page"):
  `onelifetime.world/posts/eu-policy-backed-capital-bankable-sovereignty.html` (+ landing-pages
  mirror) "benchmark scores" → "lab benchmarks" in the doctrine-aligned rejection sentence.
  Meaning preserved; dual-folder synced; both files lint clean; drift-log updated to "resolved".
  The `benchmark scores` family stays a clean hard-FAIL (no reclassification needed).

## Step 2 — INSTRUMENT (recipe step 6, done)

Built the MGD audit-grade filter on existing plumbing (no new tables):

- **`src/agents/mgd-filter.ts`** — pure, deterministic filter. `evaluateMgd(candidate)`
  encodes the three field-note §3 criteria as machine-checkable predicates over an
  `article12_audit_log` row: (a) governed-outcome-layer = agent_id present; (b)
  article12-lineage = input_hash AND thinking_block_hash present (pre+post flight);
  (c) audit-grade = decision_summary + risk_classification present AND pii_scrubbed===true.
  `countMgd(candidates)` aggregates with per-criterion exclusion reasons.
- **`src/agents/mgd-metrics.service.ts`** — `MGDMetricsService.getMGDMetrics(month?)`
  reads `article12_audit_log` for the month window (the governed-decision ledger — the
  correct candidate universe, since ungoverned `agent_executions` "don't count" and the
  two tables share no join key) and applies the filter. Injectable client for route+tests.
  Never throws; degrades to zeros. **CRC not fabricated** — it's a 4P asset inventory,
  not log-derivable (Rule 12).
- **`src/routes/dashboard.routes.ts`** — added `mgd: { monthToDate, month }` to
  `GET /api/v1/dashboard/summary`, reusing the request-scoped Supabase client, try/catch → 0.
- **`src/__tests__/mgd-filter.test.ts`** — 13 Vitest cases, intent-level (each criterion
  removed → decision stops counting). All pass; dashboard-routes test still 4/4; tsc clean
  on all three files.
- Field note §4 step 6 annotated "Implemented 2026-07-14" with the file pointers.

## Open / for next step

- Optional: a React Control Room tile (MetricsHeader.tsx pattern) reading the new `mgd`
  field — deferred (endpoint is the reuse point; tile is presentation only).
- Recipe steps 7 (route copy through it) and 8 (quarterly re-check) not started.
