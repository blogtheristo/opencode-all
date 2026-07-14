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

## Open / for next step

- **One false positive** (non-blocking CI): `benchmark scores` FAILs on
  `onelifetime.world/posts/eu-policy-backed-capital-bankable-sovereignty.html:394`
  (+ landing-pages mirror) where it's used in a doctrine-**aligned** _rejection_
  sentence ("buyers are not going to fund AI... on the basis of benchmark scores").
  Follow-up options: reword the page, or reclassify the `benchmark scores` family as
  WARN-only `ambiguousDisplayPhrasesNeedingContext` (valid when paired with a rejection
  word). Left as deprecated per the explicit Step-1 instruction; surfaced for a decision.
- Step 2 not started.
