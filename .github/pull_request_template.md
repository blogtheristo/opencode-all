## Description

<!-- Summarize the change and why it's needed. -->

## Checklist

- [ ] Is this feature complete?
  - [ ] Yes. Ready to ship.
  - [ ] No. Follow-up changes expected.
- [ ] Are you including unit tests for the changes, and scenario tests if relevant?
  - [ ] Yes
  - [ ] No
- [ ] Did you add public API?
  - [ ] Yes
    - [ ] If yes, did you have an API review for it?
      - [ ] Yes
      - [ ] No
    - [ ] Did you add doc comments (JSDoc/TSDoc for TS/JS, docstrings for Python) describing usage and behavior?
      - [ ] Yes
      - [ ] No
  - [ ] No
- [ ] Does the change make any security assumptions or guarantees?
  - [ ] Yes
    - [ ] If yes, have you done a threat model and had a security review?
      - [ ] Yes
      - [ ] No
  - [ ] No

## Session Learning Outcome (cursor branches only)

**Applies to branches: `claude/cursor-*`**

Per CLAUDE.md §Session Learning Outcome Rule (EU AI Act Art. 14), all substantive cursor sessions require:

- [ ] **Step 1: KB Updated** — Added entries to `kb/raw/{articles,signals,repos,images}/` documenting:
  - [ ] `kb/raw/articles/` for scope, technical approach, impact
  - [ ] `kb/raw/signals/` for market/strategic signals (if applicable)
  - [ ] Links in KB entries point to relevant commits/PRs/docs
- [ ] **Step 2: Field Note** — Created `docs/field-notes/YYYY-MM-DD-topic.md` with:
  - [ ] Session metadata (date, branch, status)
  - [ ] What Changed section describing work
  - [ ] 6-step Learning Outcome Rule checklist
  - [ ] HIC Decision Needed (if applicable)
  - [ ] Dated Commitments (if applicable)
- [ ] **Step 3: Learn/ HTML** — Rendered to `Learn/` via `scripts/render-doc.sh`
- [ ] **Step 4: Drive Export** — Pushed to repo (Drive mirrors from source-of-truth)
- [ ] **Step 5: HIC Decision** — Asked one real decision question (inline below or in field note)
- [ ] **Step 6: Calendar** — Scheduled dated commitments in Google Calendar

**HIC Decision Question:**
<!-- Paste your decision question here. Example: "Should we adopt Playwright for E2E testing?" -->

**If Not Applicable:**
- [ ] N/A — `<reason>` (e.g., "trivial session", "tooling-only change", "no external commitment")
