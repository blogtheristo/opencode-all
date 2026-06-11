---
name: truth-check
description: Checks a claim, file, or the current diff against the DWS canonical truth registry — flags deprecated phrases (FAIL) and ambiguous ones used without context (WARN), and suggests the approved phrasing. Use when writing or reviewing public-facing copy (store, landing pages, investor/sales, press, decks) that asserts a DWS "fact" like an industry count, captain-hat count, product price/name, or KYA tier. Backed by scripts/lint-truth-claims.mjs and the approvedDisplayPhrases / deprecatedDisplayPhrases in each structured mirror (e.g. dws10.com/config/industries.json). See DWS_TRUTH_STANDARD.md §5/§7.
---

Check copy against the canonical truth registry (DWS_TRUTH_STANDARD.md §2 mirrors).

Usage:
- `/truth-check <claim text>` — lint an inline claim
- `/truth-check <path ...>` — lint files/dirs
- `/truth-check --changed` — lint files changed vs `origin/main` (PR/local)

Input: $ARGUMENTS

## Steps

1. Decide the mode from `$ARGUMENTS`:
   - Looks like a path or `--changed` → run `node scripts/lint-truth-claims.mjs $ARGUMENTS`.
   - Otherwise treat it as a claim → run `node scripts/lint-truth-claims.mjs --check "$ARGUMENTS"`.
   - Add `--json` when the caller wants structured output.
2. Read the result:
   - **FAIL** = a `deprecatedDisplayPhrases` hit. The copy is wrong; replace it with one of the suggested approved phrases.
   - **WARN** = an `ambiguousDisplayPhrasesNeedingContext` hit with no nearby disambiguator (e.g. "21 EU-regulated industries" without "Aegis" / "defence" / "dual-use"). Either add the qualifier or switch to the platform-wide phrase.
   - **clean** = no drift.
3. If FAILs exist and the source is editable copy (not a canonical mirror), fix the phrase in place using the approved wording, then re-run to confirm clean. Per DWS_TRUTH_STANDARD.md §3, never "fix" the canonical source to match drifting copy — correct the copy.
4. Report PASS / WARN / FAIL with file:line and the canonical phrasing on each mismatch.

## Notes

- The allow-list and deny-list live in the structured mirrors, not in this command — add phrases there (`approvedDisplayPhrases` / `deprecatedDisplayPhrases`) and the lint picks them up automatically.
- Canonical mirrors and registry docs (config JSON, INDUSTRIES.md, DWS_TRUTH_STANDARD.md, STORE_PROFILE_DESCRIPTION.md) are excluded from scanning because they legitimately contain the phrases as data.
- The same script runs in CI (`.github/workflows/lint-truth-claims.yml`) on every PR diff.
