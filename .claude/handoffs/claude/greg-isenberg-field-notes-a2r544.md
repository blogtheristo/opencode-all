# Handoff — `claude/greg-isenberg-field-notes-a2r544`

**Last updated:** 2026-07-25 (reopened, then closed again) · Claude Code (Opus 5)
**Status:** session CLOSED per DWS_LEARNING_STANDARD five-step. Tree clean, all pushed. **No production code changed on this branch** — the one code fix is delivered as an unpushed patch (see §Pending).

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

## Closing phase (25.07.2026)

- **Thesis v3.83 → v3.84, all four files in lockstep.** Master's **§10.26** (EN+FI) = implementation evidence (F1/F3, falsification as a test-quality gate). PhD **§14.42** (EN+FI) = scientific framing + standards-route market signal. Versioned `Learn/` renders at v3.84; **v3.83 retained**.
- **`dws10.com/kya-standard/` corrected** — Standard → Specification throughout, stale "Implementation Ready (Q1 2026)" replaced with an honest status block (not an Art. 40 harmonised standard; four gates named). Mirror synced.
- **Open finding: 43 public files still say "KYA Standard."** A blanket rename is WRONG — legal/DPA needs counsel, dated press releases should be annotated not rewritten, and `Legal/KYA_STANDARD_v1.md` is legitimately an internal standard. Four treatments, not one sweep. **This is the live HIC question.**
- **KB:** `kb/wiki/concepts/specification-vs-standard-four-gates.md` (new).

## Second closing phase (25.07.2026)

- **SG route VERIFIED** (was flagged unverified analysis; the check corrected it). **Enterprise Singapore** is the ISO member body — *not* IMDA, which regulates/promotes; **AI Verify Foundation** is a wholly owned IMDA subsidiary. Singapore tabled **ISO/IEC AWI TS 42119-8** into **ISO/IEC JTC 1/SC 42** and hosted the 17th plenary (SG, 20–24 Apr 2026). Calibrations: **stage 20.00**, TS track, and its **scope is GenAI output testing, not agent governance — KYA cannot ride it.** Still unverified: whether agent-authority governance fits an existing SC 42 item or needs an NWIP, and EnterpriseSG participation cost for a non-SG entity.
- **SPEC v0.3 — §10 Jurisdiction profiles.** One jurisdiction-neutral core **plus** EU/US/SG conformance profiles, **not three forked specs**. Rule: *a profile may tighten a core MUST, never weaken one.* ASB/EAB/CSB/SIB is the parameterisation seam. **Profiles are named, not written** — populating them needs in-jurisdiction legal review. §10.4 records two asymmetries: only the EU confers a legal presumption (US NIST AI RMF is voluntary), and **harmonised status cannot be self-initiated** (CEN/CENELEC works from a Commission standardisation request).
- **Thesis v3.85** — PhD §14.43 EN+FI (self-initiation constraint, conformance asymmetry, SC 42 route, core-plus-profile). Master's lockstep bump, **no content change** — the material is PhD-scope per the Content Scope Rule.
- **Research scope v1.1 EN+FI** — proposed refinement, **NOT adopted**, TK1–TK3 unchanged. Key point: Expected contribution (1) *"open-licensed KYA governance standard with conformance suite"* is **not falsifiable as written**; a four-gate staged restatement makes it checkable. For Smolander.
- **Public page compliance claims softened** (see backlog **D5**) — agent judgement, **not counsel-reviewed**.
- **Blog draft updated** with the real review outcome. Still unregistered, unpublished.
- **`DWS_LEARNING_STANDARD` v1.3 — §10.3.1 The cooling gap.** *Nothing irreversible ships in the session that conceived it.* §10.1's six-field decision format and §10.6's four-per-session cap unchanged.

## Pending — needs HIC permission or access

- **Push the F1/F3 patch.** `security-reports/patches/2026-07-24-PR1716-fix-F1-F3.patch` (2 files, +142/−15). `git apply` on `claude/kya-v2-attestation-signing-6e5703`. **Not pushed** — this session is authorized only for its own branch.
- **Post the review/fix to PR #1716?** Not posted; repo-only so far.
- **B9** — settle 074/079 against the live DB (needs Supabase approval).
- **Three `[HIC INPUT NEEDED]` REMAIN OPEN** (a reviewer summary claimed all were resolved — they are not; §0.2 still reads "proposed but not chosen" / "not recorded here" / "is undecided"): why Q4 2026, which standards body, conformance story (`standards/kya-open/SPEC.md` §0.2). **A standards-body route is now PROPOSED** (CEN/CENELEC JTC 21 via SFS/LUT · W3C CG · Gaia-X/IDSA for gate-1 implementers) in the dual-track field note — the pick is still open, and it also answers the Q4 timing question, since the three bodies run on incompatible clocks.
- **Migration 080** = B7 + B8 + D4, gated on B9.

## Gotchas

- ⚠️ **The F1 patch changes the signed payload format.** Any credential signed *before* it will not verify *after* it. Costless now (everything mints unsigned) — which is an argument for landing it before any tier switches on.
- **Do not edit `Legal/KYA_STANDARD_v1.md` on this branch** — PR #1716 bumps it 1.11 → 2.0; editing here conflicts. That is why the anti-regression note lives in a field note.
- **`pandoc` was installed this session**; a fresh container will not have it (`apt-get install -y pandoc`). Learn/ renders depend on it.
- **Stale worktree** registered at `…/scratchpad/pr1716` (detached at `1d3bb5e`, holds the uncommitted fix). Scratchpad is ephemeral; `git worktree prune` after it vanishes.
- **Verify Boardy claims before propagating.** This session caught an unsupported Entra/Agent-365 claim, TK1–3 mislabelled as product tracks (they are thesis research questions), an IP-assignment/schema category error, and the jose regression. Prior art: KYA v1.9 corrected Boardy's "21 industries."
- **Learning-loop step 4 (Drive export) was N/A in every note this session** — not done for any of them.

## Artifacts

`docs/field-notes/2026-07-24-*` (4) · `standards/kya-open/{SPEC.md,LICENSE,NOTICE}` (**KYA Specification** v1.5 — retitled from "Open Standard"; §0.6 holds the four gates that would earn the word) · `security-reports/2026-07-24-PR1716-KYA-SIGNING-CRYPTO-REVIEW.md` + `patches/` · `kb/wiki/concepts/kya-attestation-signing-fallback.md` · `DWS_LEARNING_STANDARD.md` v1.2 (§10 HIC Decisioning Process Model) · `docs/backlog/BACKLOG_UNDONE_2026-07-24.md` (+B7/B8/B9/D4) · `onelifetime.world/posts/greg-isenberg-agents-need-a-signature_DRAFT.html` (+mirror, **unregistered**) · `Learn/2026-07-24-*` renders.
