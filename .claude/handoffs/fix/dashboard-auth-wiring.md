# Handoff — fix/dashboard-auth-wiring

**Branch:** `fix/dashboard-auth-wiring`
**Task:** Real data on the dws6.com Back-Office dashboard; fix V10 dashboard login and hub button wiring
**State:** READY-FOR-REVIEW → merging
**PR:** (see `gh pr list --head fix/dashboard-auth-wiring`)
**Date:** 2026-09-22

---

## Version & Agent History

| Version      | Date       | Changes         | Agent       |
| ------------ | ---------- | --------------- | ----------- |
| [Latest] 1.0 | 2026-09-22 | Initial handoff | Claude Code |

---

## Task

HIC 22.09.2026: audit the Back-Office admin dashboard, replace its hardcoded numbers with real data, fix "V10 asks for a new login", check dashboard hub buttons, document, hand off, merge.

## State

- **Done:**
  - Audit: page-level admin gates (`requireRole`) trust `user_metadata.role`, which any signed-in user can edit on themselves. DB tables are safe (RLS uses `is_backoffice_admin()` → `organization_members`).
  - New API `src/routes/backoffice.routes.ts` at `/api/v1/backoffice/{stats,containers,users,audit-log}`. Server checks Supabase token + active owner/admin in `organization_members`. Tests: `src/__tests__/backoffice-routes.test.ts` (5/5).
  - `dashboard/backoffice/index.html` renders live data; "—" when a source is down. Dead `docker-compose.mcp.yml` link removed.
  - Prod DB (MCP, HIC-approved 22.09.2026): created org **DWS AB** (`dws-ab`); `admin@dws10.com` + `risto.paarni2024@lifetime.fi` = owner/active; created their missing `user_profiles` rows.
  - V10: shares `shared/config/supabase-config.js` (real project + `dws6-auth-token` session key), router `basename`, built into committed `dashboard/firehorse/v10/`; hub button now points there. Verified in headless Chromium served statically.
  - `Admin/ADMIN_MANUAL_DWS6_COM.md` v1.2 §11.
- **Not done:** see Next steps.

## Next steps

1. Decide the production API host for `/api/v1/backoffice/*` (Cloudflare Pages has no `/api`); set `window.DWS_API_BASE` on the page or add a route.
2. Stop using `user_metadata.role` for page gates: move roles to `app_metadata` (server-set) or gate UI on a `/api/v1/backoffice/me` check. Affects backoffice, control-room, situation-room, admin/backoffice, dashboard hub.
3. Fix `auth-handler.js` `loginWithGoogle()` dead block (un-awaited `getUser()`, undefined `emailDomain`, lines ~240-265).
4. Restrict `auth_audit_log` inserts (RLS) so clients cannot forge entries — migration file (GREEN to author, RED to apply).
5. V10 deep-link refresh falls back to site root: add a `_redirects` rewrite after confirming Cloudflare Pages serves existing assets before rewrites.
6. Browser-test: log in on dws6.com, click Open V10 → should land signed in.

## Blockers (if any)

- Production API host unknown (step 1) — Back-Office cards show errors on dws6.com until resolved.

## Notes for next session

- Rebuild V10 after any change: `cd dws6.com/dashboard/firehorse/v10-react && npm ci && npm run build` → commit `../v10` + mirror to `landing-pages/dws6-com/`.
- `tsc` shows ~22 pre-existing errors in `src/temporal/**` on main — unrelated.
- Container stats need Docker on the backend host (DGX Spark).

### Next session prompt (copy-paste)

```
Continue dws6 dashboard auth hardening. Read .claude/handoffs/fix/dashboard-auth-wiring.md and Admin/ADMIN_MANUAL_DWS6_COM.md §11 first.
Goals, in order:
1. Add GET /api/v1/backoffice/me (src/routes/backoffice.routes.ts) returning {isAdmin, orgs} from organization_members, and switch the page gates in dws6.com/dashboard/{backoffice,control-room,situation-room}/index.html, admin/backoffice/index.html and dashboard/index.html from user_metadata.role to that endpoint. Mirror to landing-pages/dws6-com in the same commit.
2. Fix loginWithGoogle() dead auto-role block in dws6.com/shared/js/auth-handler.js (remove it; roles must never be client-assigned).
3. Author (do not apply) a migration restricting auth_audit_log INSERT to user_id = auth.uid().
4. Ask HIC for the production API host for /api/v1/backoffice.
Tests: vitest for new route behaviour; headless check of each gated page. Branch: fix/dashboard-auth-gates.
```
