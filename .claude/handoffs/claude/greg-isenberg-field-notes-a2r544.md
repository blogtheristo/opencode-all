# Handoff — `claude/greg-isenberg-field-notes-a2r544`

**Last updated:** 2026-07-24 (end of session) · Claude Code (Opus 5)
**Status:** 13 commits, tree clean, all pushed. **No production code changed on this branch** — the one code fix is delivered as an unpushed patch (see §Pending).

## Task

Started as "Greg Isenberg field note — what's true and useful for KYA." Became a KYA audit, four field notes, an open-standard spec, a crypto review with a HIGH finding, a verified fix, three Boardy review rounds, and four HIC decisions.

## HIC decisions (Learning Standard §10.7 — loops closed)

| # | Decision | Outcome |
| - | -------- | ------- |
| 1 | Human crypto review before merging PR #1716; all tiers unsigned until key custody + fail-loud guard | **CLOSED — review done, did NOT come back clean.** F1 (HIGH) + F3 fixed and verified. Patch **not pushed** (needs permission). |
| 2 | Settle the 074/079 production-state contradiction before writing migration 080 | **BLOCKED.** Supabase MCP requires an approval this session could not obtain. **B9 stays P0** for a session with approval rights. Do not write 080 on assumptions. |
| 3 | Land the Open Standard spec in-repo; publish the ATS formula; retain the telemetry pipeline | **CLOSED — `standards/kya-open/` created** (SPEC.md, LICENSE, NOTICE). Resolved `[HIC INPUT NEEDED]` #3. |
| 4 | Hold the blog post until signing ships | **CLOSED — holding.** No action. |

## Key findings (carry forward)

1. **PR #1716 crypto review found a HIGH issue.** `security-reports/2026-07-24-PR1716-KYA-SIGNING-CRYPTO-REVIEW.md`. **F1:** the signature did not cover the proof options, so `created` / `verificationMethod` / `proofPurpose` / `type` were mutable post-signing — a mutable timestamp on an Article 12 artifact, and a did:web verifier picking its trust anchor from unsigned data. **F2** (revoked credentials still verify `true`), **F3**, F4, F5 also filed.
2. **F1 + F3 are fixed and verified** — 51/51 tests (was 47), `tsc` clean, prettier clean. The 4 new tests were **confirmed to fail against the original source**; the 8 pre-existing signing tests pass in both states, which is exactly why the original suite missed F1 (it tampered the subject, never the proof).
3. **The trust chain still has no cryptographic material on `main`.** `ManifestSignature` carries no signature value; `ats-engine.ts:72` gates spend authority on a caller-supplied boolean; no verifier exists. **The manifest ingestion path was never traced** — unstarted, `/security-reviewer` work.
4. **`jose` was rejected, not deferred** (Node-native `node:crypto`, sovereignty-clean). A withdrawn recommendation re-entered as a plan via a reviewer within hours; standing anti-regression note is in the crypto field note. Do not let it back without a §14.7.1 version bump.
5. **Three-asset separation:** track record → tenant · accountability → the moment (immutable) · agent configuration → the contract. Schema bug: attestations have `hic NOT NULL` and **no tenant column**.
6. **Anchor fix is a precondition for signing**, not parallel.

## Pending — needs HIC permission or access

- **Push the F1/F3 patch.** `security-reports/patches/2026-07-24-PR1716-fix-F1-F3.patch` (2 files, +142/−15). `git apply` on `claude/kya-v2-attestation-signing-6e5703`. **Not pushed** — this session is authorized only for its own branch.
- **Post the review/fix to PR #1716?** Not posted; repo-only so far.
- **B9** — settle 074/079 against the live DB (needs Supabase approval).
- **Three `[HIC INPUT NEEDED]`** on the Open Standard: why Q4 2026, which standards body, conformance story. Recorded in `standards/kya-open/SPEC.md` §0.2.
- **Migration 080** = B7 + B8 + D4, gated on B9.

## Gotchas

- ⚠️ **The F1 patch changes the signed payload format.** Any credential signed *before* it will not verify *after* it. Costless now (everything mints unsigned) — which is an argument for landing it before any tier switches on.
- **Do not edit `Legal/KYA_STANDARD_v1.md` on this branch** — PR #1716 bumps it 1.11 → 2.0; editing here conflicts. That is why the anti-regression note lives in a field note.
- **`pandoc` was installed this session**; a fresh container will not have it (`apt-get install -y pandoc`). Learn/ renders depend on it.
- **Stale worktree** registered at `…/scratchpad/pr1716` (detached at `1d3bb5e`, holds the uncommitted fix). Scratchpad is ephemeral; `git worktree prune` after it vanishes.
- **Verify Boardy claims before propagating.** This session caught an unsupported Entra/Agent-365 claim, TK1–3 mislabelled as product tracks (they are thesis research questions), an IP-assignment/schema category error, and the jose regression. Prior art: KYA v1.9 corrected Boardy's "21 industries."
- **Learning-loop step 4 (Drive export) was N/A in every note this session** — not done for any of them.

## Artifacts

`docs/field-notes/2026-07-24-*` (4) · `standards/kya-open/{SPEC.md,LICENSE,NOTICE}` · `security-reports/2026-07-24-PR1716-KYA-SIGNING-CRYPTO-REVIEW.md` + `patches/` · `kb/wiki/concepts/kya-attestation-signing-fallback.md` · `DWS_LEARNING_STANDARD.md` v1.2 (§10 HIC Decisioning Process Model) · `docs/backlog/BACKLOG_UNDONE_2026-07-24.md` (+B7/B8/B9/D4) · `onelifetime.world/posts/greg-isenberg-agents-need-a-signature_DRAFT.html` (+mirror, **unregistered**) · `Learn/2026-07-24-*` renders.
