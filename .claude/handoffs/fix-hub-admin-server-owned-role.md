# Handoff — fix/hub-admin-server-owned-role (PR #2016)

**Branch:** `fix/hub-admin-server-owned-role`
**Task:** Close 5 audited security findings in PR #2016 (server-owned `hub_admin`/`backoffice_admin` dashboard authorization) without breaking the concurrent Aikido/Copilot-Autofix commits pushed to the same branch.
**State:** READY-FOR-REVIEW — requesting Claude audit before merge.
**PR:** https://github.com/blogtheristo/dws6/pull/2016
**Date:** 2026-09-14

---

## Version & Agent History

| Version      | Date       | Changes                                                                                                   | Agent            |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------------- | ---------------- |
| [Latest] 1.0 | 2026-09-14 | Reconciled local security fixes with concurrently-pushed remote commits via rebase; pushed `4c5f96c71` | GitHub Copilot |

---

## Task

User pasted an external audit ("SECURITY_PATCH_PR2016.md") claiming 5 issues in PR #2016 and instructed: do NOT merge until fixed, re-run CI. Each finding was independently verified against real code (not taken at face value) before fixing.

## Findings verified + fixed

1. **CRITICAL — Incomplete RPC gate coverage.** `ADMIN_SECTIONS` in `dws6.com/functions/dashboard/_middleware.js` (+ landing-pages mirror) did not include `'backoffice'`, even though `dws6.com/dashboard/backoffice/index.html` renders privileged admin content. **Confirmed real.** Fixed: added `'backoffice'` to `ADMIN_SECTIONS`.
2. **CRITICAL — Client-side role reading.** `backoffice/index.html` gated itself only with `requireRole('backoffice_admin')`, reading browser-spoofable `user_metadata.role` — any signed-in user could self-spoof the role client-side and view the panel (no server check existed at all, since it wasn't in `ADMIN_SECTIONS`). **Confirmed real — genuine privilege escalation.** Fixed: replaced with `isHubAdmin()` / `isBackofficeAdmin()` RPC calls (server-owned), added `handleOAuthCallback()`, pinned Supabase JS to `2.39.0` with SRI. Also fixed a case-sensitivity bypass (`ADMIN_SECTIONS.has(section)` with no `.toLowerCase()` — e.g. `/dashboard/BACKOFFICE/` would bypass the gate).
3. **HIGH — Unbounded HTML user input (XSS+DoS).** `unauthorizedPage(status, detail)` interpolated `detail` unescaped. All call sites currently pass only fixed literal strings (not live-exploitable today), but fixed defensively: added `escapeHtml()` helper + applied to `detail`; also added `MAX_DEMO_DETAIL_TOTAL_LENGTH = 6000` cap on the concatenated demo-request `details` string.
4. **HIGH — Missing email backfill (migration 088).** Trigger only fires `BEFORE INSERT OR UPDATE OF email`, so pre-existing `web_leads` rows would keep `email_domain_class = 'unknown'` forever. **Confirmed real.** Fixed: one-time backfill `UPDATE`. (Note: a concurrent Aikido/Copilot-Autofix commit `e3508d600` added a near-identical backfill independently — kept the version with the explanatory comment; functionally equivalent.)
5. **HIGH — Unbounded briefing rendering (DoS+confusion).** `renderWebLeadsHtml` / `renderWebLeadsPlainText` rendered `lead.message` in full (potentially ~13KB from the new demo form), unlike `inq.message` which truncates to 120 chars. **Confirmed real.** Fixed: added shared `truncateLeadMessage()` helper (400-char cap, `WEB_LEAD_MESSAGE_MAX_LENGTH`), applied in both renderers. (A concurrent commit inline-truncated to 120/100 chars in two places inconsistently — resolved by keeping the shared-helper approach for consistency; the 400-char limit choice vs. 120 is worth a second opinion, see "Open question" below.)

## Unrelated corruption discovered + fixed

`dws6.com/dashboard/control-room/index.html` and `situation-room/index.html` (source copies) had corrupted/duplicated HTML (old insecure script block leftover merged with new one, causing JS `SyntaxError` — verified via `node --check` on extracted `<script type="module">` bodies). Root cause: a patch-edit tool fallback (`git apply`) in a prior session apparently duplicated content. The `landing-pages` mirrors were clean and served as ground truth for restoration. **Verified the concurrent remote fix (`bf70d19ff "Fix HTML entity encoding"`) did NOT actually fix `control-room/index.html`** — its JS still failed `node --check` at push time. My restoration (copy from clean mirror) is the real fix for that file; `situation-room` was already fixed correctly by the remote commit (both approaches ended up equivalent after reconciliation).

## Concurrent-edit collision (git mechanics, FYI for audit)

While this session was fixing PR #2016, another actor (commits authored `blogtheristo` with co-author `Copilot Autofix powered by AI`) pushed 4 commits directly to `fix/hub-admin-server-owned-role`: `bf70d19ff`, `bca1794a9`, `e3508d600`, `b5e5c6cca` — addressing an overlapping-but-incomplete subset of the same findings (HTML corruption attempt, migration backfill, briefing truncation) but **not** the two most critical fixes (`ADMIN_SECTIONS` gap, spoofable client-side role check in `backoffice/index.html`).

Reconciled via `git rebase origin/fix/hub-admin-server-owned-role` (a `git reset --hard` was attempted first but blocked by a preToolUse safety hook — rebase was the correct, non-destructive path). 3 files had real conflicts (`situation-room/index.html`, `briefing-template.ts`, migration `088`) — all resolved by keeping the functionally-superior/more-consistent side (see per-finding notes above). 6 other files auto-merged cleanly with no data loss. Final state pushed as fast-forward `b5e5c6cca..4c5f96c71` (no force needed).

## Verification performed

- [x] `npm run build` — clean.
- [x] `npm run lint` — 0 errors, 13 pre-existing warnings (unchanged).
- [x] `npx vitest run src/__tests__/dashboard-access-middleware.test.js` — 21/21 passed (17 existing + 4 new: backoffice-gate positive test, 3 case-insensitive-bypass path variants, case-insensitive-allow test).
- [x] Source/mirror byte parity re-verified for all touched pairs (`backoffice/index.html`, `control-room/index.html`, `situation-room/index.html`, `_middleware.js`) after rebase.
- [x] `node --check` on all extracted `<script type="module">` bodies in touched HTML files — all pass.
- [ ] PR #2016 CI re-triggered on push (`4c5f96c71`) — **pending at handoff time**, not yet confirmed green. Check `gh pr checks 2016`.

## Open question for Claude audit

- `WEB_LEAD_MESSAGE_MAX_LENGTH = 400` (mine) vs. the concurrent commit's inline 120-char (HTML) / 100-char (plain-text) truncation. I kept 400 via the shared `truncateLeadMessage()` helper for single-source-of-truth consistency across both renderers, but the existing `inq.message` pattern elsewhere in the same file truncates to 120 chars — worth a second opinion on whether 400 is too generous for a DoS-defensive cap, or whether the goal was just "bounded, not unlimited" (400 chars is still ~30x smaller than the ~13KB worst case, so it satisfies the DoS finding either way).
- No test file exists for `briefing-template.ts` (`renderWebLeadsHtml`/`renderWebLeadsPlainText`) or migration 088's backfill — coverage relies on build/lint only for those two files. Consider whether a regression test is warranted before merge.

## Next steps

1. Claude: audit this reconciliation + the 5 fixes against the original `SECURITY_PATCH_PR2016.md` checklist; confirm no regressions from the rebase.
2. Confirm PR #2016 CI is green post-push (`gh pr checks 2016`).
3. Do NOT merge without explicit HIC instruction (per original constraint).

## Blockers (if any)

None currently — CI result pending confirmation.
