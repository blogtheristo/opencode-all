# PR Backlog Drain — Next-Session Prompt (2026-09-25)

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code 2.1.282 | Session: fix/gha-reduce-checks | Date: 25.09.2026 | Changes: Initial triage of 73 open PRs; one chapter per non-ready PR.

---

## 0. Prompt (paste into the next session)

> Drain the dws6 PR backlog using `.claude/handoffs/pr-backlog-2026-09-25.md`.
> Work top-down: §2 merge list first, then §3 (fix a check, then merge), then §4
> (merge `main` into the branch and resolve), then §5 (close + cherry-pick onto a fresh
> branch from `main` → new PR). Merge **one PR at a time**, re-check `mergeable` after
> each merge (later PRs can become conflicting). Skip anything marked HIC/RED.
> Tick each chapter `[x]` in this file as you go; commit the file at the end.
> Merges, pushes to PR branches, and PR closes need explicit HIC permission in
> Claude Code auto mode (classifier: "Merge Without Review" / "Modify Shared Resources").

## 1. Facts this plan rests on

- 73 open PRs at 2026-09-25: 37 MERGEABLE, 37 CONFLICTING (`gh pr list`, triage run in this session).
- `main` has **no required status checks** (ruleset 21394039 = deletion, non_fast_forward, pull_request with 0 approvals). A failing check never blocks a merge — it only signals.
- The Actions cost is from **run count**, not duration. Top workflows average 3–4 s per run, and GitHub bills each job as at least 1 min. `pr-auto-merge` ran 1,002 times in 14 days (27 times on one commit), triggered by `check_suite` events from the Cursor, Cloudflare, Google and Claude apps.
- Cause of the Cloudflare Pages failures on #2079 and #2100: both bump the `opencode-all` submodule to `3ea2c8c`, which does not exist on `blogtheristo/opencode-all`. Fixed on #2100 in commit `62784dd70` by resetting the pointer to main's `203bbed`.
- Migration numbers on `main` go up to `091_240926_*`, and `089` already appears twice there. #2077 (`089_hilma_tenders.sql`) and #2093 (`092/093_*`) fail the `filename` and `soak` checks.
- Truth-lint failures on #1787, #1790 and #1806 are real: each uses the deprecated phrase "agent count" (use "Monthly Governed Decisions"). Checked locally with `scripts/lint-truth-claims.mjs`.

## 2. Ready to merge (squash, in this order)

| PR        | Title (short)                     | Note                                                                          |
| --------- | --------------------------------- | ----------------------------------------------------------------------------- |
| [ ] #2101 | ci: cut GHA fan-out               | Merge FIRST — stops the check pile-up                                         |
| [ ] #2100 | LinkedIn UTF-8 + docs             | After Cloudflare re-runs green on `62784dd70`; then close #2079 as superseded |
| [ ] #1452 | Microsoft ISV brand finalize      |                                                                               |
| [ ] #1659 | Aspire AppHost                    |                                                                               |
| [ ] #1664 | Frankenburg → Kusti Salm outreach | doc only, no send                                                             |
| [ ] #1698 | KEENON meeting record             |                                                                               |
| [ ] #1768 | EIC step 1                        |                                                                               |
| [ ] #1792 | LUT supervision materials RQ5     |                                                                               |
| [ ] #1994 | Aegis item-3 edge test plan       |                                                                               |
| [ ] #1995 | Sisu Defence case v1.1            |                                                                               |
| [ ] #2015 | OSS integration roadmap           |                                                                               |
| [ ] #2042 | auto-sync AGENTS.md               | bot PR                                                                        |
| [ ] #2055 | Sync Motion assessment            |                                                                               |
| [ ] #2056 | Field note idea-customer funnel   |                                                                               |
| [ ] #2065 | Jev-KYA checkpoint                |                                                                               |
| [ ] #2073 | Temporal use case #13             |                                                                               |
| [ ] #2074 | DGX Temporal next-session prompt  |                                                                               |
| [ ] #2076 | Altar-1 field note                |                                                                               |
| [ ] #2078 | backoffice → api.dws6.com         |                                                                               |
| [ ] #2081 | hardened ephemeral DGX GHA runner | related to §6                                                                 |
| [ ] #2084 | A5 handoff + reseller draft       | internal                                                                      |

## 3. Mergeable, but a real check fails — fix, then merge

### [ ] #1787 · #1790 · #1806 — truth-lint "agent count"

- **Blocker:** Deprecated phrase "agent count": #1787 at `Partners/outreach/2026-05-26-patria.md:145` and `sales-outreach/INTRO_KIMMO_KAKKO_PATRIA.md:165`; #1790 at `docs/partnerships/LIFETIME_CERTIFIED_PARTNERS_CONCEPT.md:71`; #1806 at `docs/bids/SUBMISSION_CHECKLIST.md:101,110`.
- **Action:** Replace with "Monthly Governed Decisions" where the meaning holds. Where it literally means a number of agents, reword it (e.g. "number of deployed agents"). Re-run lint, then merge.

### [ ] #2057 · #2063 · #2067 — `lint-check` + `test` fail

- **Blocker:** `test-on-pr` failed. `main` also failed once on 2026-09-24 05:20, then went green, so some of these failures may come from the old `main` rather than the PR.
- **Action:** Merge `main` into each branch and run `npm test` locally. Fix any real failures, then merge. #2063 adds a compliance-proof endpoint, so review its security.

### [ ] #2077 — Hilma tender lane (migration 089_hilma_tenders.sql)

- **Blocker:** The migration filename fails the `NNN_DDMMYY_slug` check, and number 089 is already used twice on `main`. The anon soak check also fails.
- **Action:** Rename to the next free number (`092_<DDMMYY>_hilma_tenders.sql` or later) and add the standard GRANT + RLS block. Merging the file is fine; **applying the migration is RED (HIC)**.

### [ ] #2093 — Active Ontology 1.5 (migrations 092/093 decision_journey)

- **Blocker:** `089_240926_decision_journey.sql` is already on `main`. Check whether 092 and 093 extend it or duplicate it. The filename and soak checks fail.
- **Action:** Deduplicate against 089, renumber after #2077, and fix soak. Applying the migration is RED.

### [ ] #2096 — dws10 catalogue 1.33 (products.json)

- **Blocker:** The pricing `validate` job fails. `products.json` is the single source of truth for prices, and it goes live on merge.
- **Action:** Run `scripts/validate-pricing.ts` locally and fix. Merge this **before** the pricing PRs in §5 (#1990, #2054, #2085); rebase those onto it.

### [ ] #1983 · #1984 · #1988 · #2097 · #2098 — DoD Gate / Tree Gate fail

- **Blocker:** DoD is a coverage gate; Tree Gate runs on the DGX runner. Both failures may be noise from the old `main`.
- **Action:** After #2101 merges, update each branch from `main` and re-run the checks. Merge if green. #1984 adds a production maintenance Worker for dws10.com: check the env var gate before merging.

### [ ] #1800 — LOVEGIN confirmation note

- **Blocker:** Only Cloudflare Pages dws10-com failed, on a docs-only change, so it's probably transient.
- **Action:** Re-run the check, then merge.

## 4. Minor conflicts — merge `main` into the branch, resolve, merge

### [ ] #1807 — NATO DIANA test centres

Conflict in `.claude/HANDOFF.md` (cross-branch history list). Keep both sides' lines.

### [ ] #2064 — enclaive assessment

Same as #1807. Keep both sides' lines in `HANDOFF.md`.

### [ ] #2010 — spacexai login note

**Take `main`'s side.** `main` redacted the IP address, location and browser. The PR version contains a raw IPv6 address (personal data).

### [ ] #1643 — Wärtsilä INTRO

`HANDOFF.md`: keep `main`'s protocol rule 6 and drop the PR's stale "CURRENT HANDOFF" block from July. Merge the history list from both sides.

### [ ] #1993 — KYA conformance baseline

Only `.gitignore` conflicts, and the file has diverged heavily. Take `main`, then re-add only the lines this PR introduced.

### [ ] #2075 — backoffice open items

`.gitignore`: keep both sides. `ONTOLOGY.md`: both sides claim v1.8, so bump to **1.9 [Latest]**, keep both appendix entries, and mark the older one `[not latest]`. Also check whether #2072 (already merged) superseded the backoffice gate.

### [ ] #1479 — remove grok-consent imports (`src/app.ts`)

Created in June; 2,846 commits behind. Check whether `main` still has those imports. If not, **close as obsolete**.

### [ ] #1762 — Baseten Kimi K3 (`src/agents/llm-client.ts`)

One code conflict. Re-apply the model entry by hand against the current `main` tier table.

### [ ] #1836 — OpenCode Nemotron primary (`opencode.json`)

3 conflicts in a runtime config file. **HIC decision:** is Nemotron still the wanted primary DGX model?

### [ ] #1782 — Keep the Why evaluation (`CLAUDE.md`)

Changes the canonical rules file. **HIC review** of the `CLAUDE.md` change. The rest is docs.

### [ ] #1487 — DGX failover health

Conflicts in `deploy-dgx-spark.yml` and the skills guide. Re-apply on top of the #2101 workflow state.

### [ ] #1716 — KYA v2.0 attestation signing

`HANDOFF.md` (keep both) plus `Legal/KYA_STANDARD_v1.md` (needs a version bump). The code parts merge cleanly.

### [ ] #1829 — contact form replaces mailto (519 files)

Only 2 regulatory-notice HTML files conflict, but the PR is large and live on merge. Resolve both mirrors identically (dual-folder sync rule).

### [ ] #2009 — external auth + migration 080

Conflicts in `auth-handler.js` and a field note. This is an auth change, so run a security review. Applying migration 080 is RED.

### [ ] #1830 — `/kya inference` planned-only (DRAFT, Copilot)

One line in `.claude/commands/kya.md`. Re-apply manually or close.

### [ ] #2060 — signed-work GTM pivot (DRAFT, Cursor)

Conflicts in `google-products.xml` (both mirrors). **HIC decision:** strategy change. Leave it as a draft until decided.

## 5. Major conflicts — close the old PR, cherry-pick onto a fresh branch from `main` → new PR

Recipe per PR: `git switch -c salvage/<old-branch> origin/main`, then `git checkout refs/pr/<N> -- <paths still relevant>` (or `git cherry-pick -x` the PR's own commits), resolve the conflicts, and open a new PR with "Supersedes #N". Close the old PR with a link to the new one. The old branch is kept.

### [ ] #1759 — 25-rules audit (170 conflicted files, 1,446 commits behind)

Salvage **only the audit document(s)**; everything else is stale churn, including `Learn/Archive/PHD_*`. Close.

### [ ] #1495 — PKI ownership blog post #28 (24 files)

**RED — Rule 13.** Salvage as a `docs/blog-drafts/<slug>.md` draft only, run `/blog-draft`, and get HIC approval before any `posts/*.html` goes out.

### [ ] #1810 — KYA blog series parts 8–11

**RED — Rule 13.** Drafts only. Re-land them in `docs/blog-drafts/`; publishing waits for HIC approval.

### [ ] #1771 — boss-session handoff record (DRAFT)

The handoff record is historical. Close without salvage unless `LOCKED_DECISIONS.md` has lines that aren't on `main`.

### [ ] #1549 — Firehorse Mobile real functionality (DRAFT, 39 files)

Conflicts in `package-lock.json` and `package.json`. Regenerate the lockfile after the cherry-pick; don't hand-merge it.

### [ ] #2022 — Aegis page in 5 languages (8 files)

Overlaps #1828 and #2021. Do **one** combined salvage PR: Aegis i18n = #2022 + #1828 + #2021.

### [ ] #1828 — Outokumpu one-pagers + aegis.html (Copilot)

Folded into the #2022 salvage.

### [ ] #2021 — i18n 109 products (17 hunks)

Folded into the #2022 salvage.

### [ ] #1990 · #2054 · #2085 — pricing / feeds (products.json + google-products.xml)

Salvage **after #2096**, one PR each, and run `validate-pricing` on each. Prices go live on merge.

### [ ] #2016 · #2035 — dashboard server-owned role / hub admin

Probably **superseded by merged #2072** (server-side `organization_members` check). Diff each against `main`, salvage only what's missing, then close.

### [ ] #2034 — admin dev-env OpenCode policy

Conflicts in `.cursorrules`, `AGENTS.md` and `CLOUD_ENVIRONMENTS.md`. Re-apply the policy text to the current files.

### [ ] #2004 — Tooling Hub: Copilot onboarding (11 hunks)

Re-apply the Copilot section to the current `docs/TOOLING_HUB.md`.

### [ ] #1769 — Truth Standard confidence tiers

Canonical standards file (6 hunks). Re-apply with a version bump in both standards.

### [ ] #1498 — loop-memory journal

Re-apply the feature files; `.gitignore`, `.prettierignore` and the skills guide are trivial.

### [ ] #1809 — consultancy handbook v1.11 (5 hunks, one file)

Language-editing pass on chapters 1–8. Re-apply on top of the current handbook version.

### [ ] #1819 — Copilot repo audit (31 findings)

4 source files conflict. Salvage the **audit report** only; re-check each code fix against the current `main`.

### [ ] #1837 — Nemotron lab note (DRAFT, Copilot)

Salvage the lab note; drop the conflicting dws10 config and press-release edits.

### [ ] #2086 — lifetime.fi campaign homepage

Marked **"PROPOSAL (do not merge yet)"**. Keep it open and don't close it. HIC decision.

## 6. Moving Actions to DGX (after the backlog)

1. #2101 (merge first): 2 duplicate AI reviewers turned off. `pr-auto-merge`, `validate-dod` and `lint-truth-claims` move to the DGX runner with burst cancellation.
2. The next largest GitHub-hosted spenders are `test-on-pr` (it already fails over to DGX), `deploy-scaleway` (104 s per run, 33 of 33 runs failed in 30 days — fix or disable), `supabase-anon-soak` (97 of 100 failed — fix the soak or path-filter it) and `sync-dws6-landing-pages` (40 of 48 failed).
3. There is only one DGX runner (`dgx-spark`, ARM64). Land #2081 (ephemeral runner) before moving more jobs, or `tree-gate` (30-min timeout) will queue everything behind it.
4. Measure the result with `/cron cost` 14 days after #2101 merges (target date **2026-10-09**).
