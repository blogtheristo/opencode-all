# Handoff: claude/dws-learning-hic-process-e70k0a

> Per-branch handoff file. See `.claude/HANDOFF.md` for the protocol and the
> cross-branch history log. Owned by sessions on this branch only.

- **Task:** (1) Codify the HIC learning process as a major outcome of every
  session, as an EU AI Act legal-basis requirement; (2) ground the Kertos
  wedge for the Richard Würl / Redstone investor outreach; (3) build a
  blocking session-stop hook that enforces the learning outcome.

- **State: shipped + pushed (branch tip commits, oldest→newest):**
  1. `26ef6a3` — **DWS Learning Standard**: new `DWS_LEARNING_STANDARD.md`;
     Truth Standard §2F + §2 row 30 (v3.7→3.8); Standards Library EU AI Act
     **Art. 14** added to §3.1 (v1.6→1.7); CLAUDE.md Resolver row + Session
     Learning Outcome Rule; `docs/backlog/BACKLOG_UNDONE_2026-07-24.md`;
     dogfood field note + `Learn/` HTML + Drive export
     (Google Doc `12KkbXrffUETD4Q43OsP8tmlJcaLnskLIu6l2IOuAgoQ`).
  2. `da9d502` — **Kertos wedge**: `investor-outreach/CASE_KERTOS_REDSTONE_WEDGE.md`
     (web-sourced: Kertos = privacy/compliance PROGRAM, DPO/CISO buyer;
     DWS = industrial FILING, sustainability/compliance buyer; Redstone LED
     the 2023 seed + FOLLOWED the 2025 Series A; complementary, not competing)
     + sharpened INTRO (v1.4) and ONEPAGER (v1.5). Send-ready letter body left
     verbatim; send is RED-zone (Risto sends via SES; email address not on
     file — do not guess).
  3. `119794d` — session-stop hook Check 6 (blocking learning-outcome).
  4. `9ca424e` — marked the hook built in Standard §6 + backlog C2.

- **State: LOCAL, not yet pushed:**
  - `ab51eb8` — **hook hardening** (fail-open): `cd` to repo root (fixes a
    false-block-from-wrong-cwd bug), non-git-repo → exit 0, dropped `set -e`.
    Dry-run verified: normal pass / forced block / block-from-subdir / non-repo
    never blocks / `stop_hook_active` breaker. **Authored by legal name.**
  - this handoff file.

- **⚠️ OPEN DECISION — commit identity vs GitHub Verified (needs HIC choice):**
  Founder directive: "use legal name, not that name" (commits were authored
  `Claude <noreply@anthropic.com>` + `Co-Authored-By: Claude Opus 4.8`).
  BUT Claude Code signs commits with a key tied to `noreply@anthropic.com`, so
  a legal-name **committer** email → GitHub shows **Unverified**. Git author ≠
  committer, so:
  - **Option 1 (recommended, being used for new commits):** author = Risto
    Anton Päärni <risto.paarni@lifetime.fi>, committer = Claude/noreply →
    **Verified** + legal name is the visible author; "Claude" only as
    small-print committer.
  - **Option 2:** author = committer = legal → no "Claude" anywhere, but
    **Unverified**.
  - **Option 3:** revert to Claude both (founder rejected).
  - The **4 already-pushed commits** (`26ef6a3`,`da9d502`,`119794d`,`9ca424e`)
    are still authored `Claude` + carry the `Claude` trailer. Fixing them needs
    a history rewrite (`git filter-branch` — **classifier-blocked, needs an
    Edit/Bash permission grant**) + `git push --force-with-lease` (safe: unmerged
    feature branch). `git config` is already set to the legal identity.

- **NOTE — this branch's session-stop hook now BLOCKS:** a substantive session
  with no field note / `Learn/` HTML dated today is blocked (exit 2). Escape
  hatches if it false-fires: an `N/A — <reason>` field note today,
  `DWS_SKIP_LEARNING_OUTCOME=1`, or `[skip-learning]` in the commit message.

- **Not started:** dws7 = empty repo (no commits/`main`/files) — nothing to
  change there.

- **Next steps (priority):**
  1. **HIC picks commit-identity option 1/2/3** (above). Then: if 1 → push
     `ab51eb8` + handoff as-is (already split); if the 4 pushed commits must
     also change → grant the rewrite permission, run filter-branch, force-with-lease.
  2. Merge-review the branch to `main` (nothing merged yet). Compare:
     `https://github.com/blogtheristo/dws6/compare/main...claude/dws-learning-hic-process-e70k0a`
  3. Optional: add the KB entry (`/kb`) for the "HIC Learning Outcome" concept
     (only mechanizable artifacts — field note + Learn HTML — are hook-enforced).

- **Blockers:** `git filter-branch` classifier-blocked (needs permission); pandoc
  absent in cloud sessions (Learn HTML written directly, house-style matched).
