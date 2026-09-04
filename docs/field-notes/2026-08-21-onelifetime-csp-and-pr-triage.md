---
title: onelifetime.world CSP break, blog-mirror sync, and open-PR triage
date: 2026-08-21
session: claude/onelifetime-blog-errors-2n2tst
---

# What happened

HIC reported onelifetime.world/blog "looked destroyed." Root cause: PR `af5cdc9b` (a
Copilot bot commit, merged before #1864) tightened the site's CSP `script-src` by
dropping `'unsafe-inline'` and never allowlisting `https://cdn.tailwindcss.com`. That
silently broke every page that depends on either — 180 pages load Tailwind from that
CDN, 87 pages carry inline `<script>` for nav/menu/language-bar — so pages rendered
unstyled and non-interactive with no build error, no test failure, no visible signal
except "the site looks wrong."

Fix: restored `'unsafe-inline'` and added the Tailwind CDN host to `script-src` in
`onelifetime.world/_headers` and its `landing-pages/onelifetime-world/` mirror (same
commit, dual-folder rule). Also found and fixed: PR #1856's two blog-series posts
(`ai-vendor-dependency.html`, `-part-2.html`) had never been copied into the
`landing-pages/` mirror — synced them so the two folders are byte-identical again.
Pushed as PR #1866 (merged).

Separately, HIC asked for a PR review pass. Reviewed the 10 most-recent open PRs for
merge-readiness; picked PR #1826 ("Noux sales rooms setup") to continue — it was 460
commits behind `main` with three concrete open items in its own handoff file. Merged
`main` into it cleanly (no conflicts) and pushed. Remaining items in that PR's scope
(P0 sales-room PDF uploads, Cloudflare zone IDs, Noux API question, three pending HIC
decisions) are genuinely blocked on the HIC or on tooling not present in this
environment (`pandoc` is not installed here, so `scripts/render-doc.sh` cannot run) —
not on further agent effort.

# Insight

A CSP change is a class of regression that passes every automated gate (build, lint,
type-check, unit tests) and only shows up as a visual/behavioral failure in a live
browser — worth flagging because the repo has no CSP-vs-page-asset consistency check.
Consider a lightweight audit (grep every `<script src=` / inline `<script>` host
against `_headers`' `script-src` allowlist) as a pre-push or CI check so the next
CSP tightening doesn't silently break the site again.

# Next steps

- No repo-side action pending on the CSP fix — it's merged and live.
- PR #1826 needs the HIC decisions listed in its handoff (tenant domain, trial length,
  auto-send trial emails) and Cloudflare zone IDs before automation Phases 3–4 can
  proceed; PDF uploads for Room 3 need `pandoc` in-environment or a different render
  path.
- The session-stop hook's advisory list (many pre-existing onelifetime.world posts
  published without a `docs/blog-drafts/` source, or not `Status: APPROVED`) predates
  this session — none of those files were touched here (confirmed via `git log`
  authorship on the merge). Flagging to the HIC as a backlog item, not fixing it in
  this session (out of scope: this session's task was the CSP break + PR triage, not
  a blog-approval audit).

# Steps 3–4 of the HIC Learning Outcome — N/A

- KB compile (`/kb`): N/A — no LLM provider key configured in this environment for
  the KB agent (same constraint documented in prior sessions, e.g. PR #1854).
- Learn/ HTML render: N/A — `pandoc` is not installed in this environment; cannot run
  `scripts/render-doc.sh`.
- Drive export: N/A — no interactive Google Drive tool call made this session; can be
  done on request.

# One question for the HIC

The advisory list above shows ~50 live onelifetime.world blog posts with no
`docs/blog-drafts/` source and several more explicitly not `Status: APPROVED` —
all pre-existing, not from this session. Do you want a dedicated session to run the
Rule 13 backlog (retroactively draft-and-approve or unpublish each), or should these
stand as accepted exceptions since they're already live?
