<!--
VERSION AND AGENT HISTORY
Document: Raw signal — use-vs-mention in canonical-phrase linting; thesis autonomy boundary
Version: 1.0
Date: 2026-08-03
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active (raw source — not compiled)
Agent: Claude Code (Opus 5), session claude/thesis-unlock-and-truth-fix
Purpose: Raw capture for later /kb compile. Compiled reading: docs/field-notes/2026-08-03-thesis-unlock-and-use-mention-lint.md
-->

# Raw Signal — Use vs. Mention, and the Thesis Unlock (03.08.2026)

**Kind:** Engineering pattern + governance ruling

## The durable engineering rule

**A deprecation check that cannot tell use from mention makes it impossible to write the history of a deprecation.**

A string matcher flags the changelog entry that records a rename, and the section heading whose job is to name the old term. The guard then silently forbids the repository from explaining its own decisions — the opposite of what a truth standard is for.

Two escapes, both **downgrading FAIL → WARN rather than silencing**:

1. **Historical context** — `VERSION AND AGENT HISTORY` blocks are historical records by definition; plus markers `formerly`, `historical`, `deprecat*`, `renamed`, `superseded`, `replaced by`, `no longer`, `retired`.
2. **Use vs. mention** — a term in quotation marks is being talked about, not asserted. Unquoted uses still fail.

Effect: 42 failures → 14 genuine. **Two-thirds of the apparent drift was the linter failing to read English.**

**Diagnostic heuristic worth reusing:** _when a check fails on a document about the check's own subject, suspect the check._ This bug had already bitten once — a field note failed for quoting the banned phrases in order to explain them — and was patched as a documentation problem, so it was paid for twice before being fixed at source.

## Two more transferable observations

- **Diff-scoped checks make "green" mean "nobody touched the drifting files."** Both theses carried this drift for months with no failing build, because nothing changed them. A green CI is evidence about the diff, not about the repository.
- **Verify pre-existence before accepting blame.** Counting occurrences on `main` and on the branch showed identical figures, converting "what did I break" into "what has this file always contained."

## Governance ruling (HIC, 01–03.08.2026)

**Additive** thesis content is GREEN on all four thesis files — new `§x.y`, its Key Contribution, lockstep version bump. **Structural** edits stay RED: TOC/chapter restructure, renumbering existing sections, rewriting or deleting existing `VERSION AND AGENT HISTORY` entries, removing existing content.

Corollary now in `CLAUDE.md`: **superseding a claim is additive, not structural** — preserve the original formulation and add a pointer to what replaced it (Rule 12). Never silently rewrite an existing passage to match new canon.

Rationale: a blanket block did not reduce risk, it relocated it. The thesis stopped tracking the work being done while the guard reported success.

## Compiled reading

`docs/field-notes/2026-08-03-thesis-unlock-and-use-mention-lint.md` — full record, the per-category fix rationale, and the open HIC question on whether the linter escapes should be scoped to documentation paths only.
