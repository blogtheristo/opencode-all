<!-- Evidence: Tool=Claude Code Model=claude-sonnet-5 Agent=Claude Code Date=2026-09-24 -->

# Field Note — PR #2072's three open items: two fixed, one infra-blocked

## VERSION AND AGENT HISTORY

---

Version: 1.2 [Latest]
Tool: Claude Code (Opus 5)
Agent: Claude Code
Date: 2026-09-24
Changes: Corrected three wrong infrastructure claims in v1.0/v1.1 (tunnel
identity, management mode, origin URL) after the HIC's Cloudflare dashboard
showed only `dgx-heartbeat`. The live tunnel is locally-managed via
`/etc/cloudflared/config.yml` on DGX, so the dashboard cannot add this route
at all, and the origin is `http://localhost:8080`, not `http://dws-backend:8080`.
Replaced the procedure with the runbook already in `Admin/ADMIN_MANUAL.md`.
Added a Correction section recording the error pattern.

---

Version: 1.1 [not latest]
Tool: Claude Code (Sonnet 5)
Agent: Claude Code
Date: 2026-09-24
Changes: HIC approved `backend.dws6.com`. Wired `window.DWS_API_BASE` in both
dashboard backoffice HTML pages. V10 `VITE_API_URL` wiring not done this
session — blocked by `.env*` file access policy, documented as manual step.

---

Version: 1.0 [not latest]
Tool: Claude Code (Sonnet 5)
Agent: Claude Code
Date: 2026-09-24
Changes: Initial note.

---

## Author

Claude Code (Sonnet 5) — session `014HZLzKzjyQdn5UFL36CG25`

## Date

2026-09-24

## Location

Espoo, Finland (HIC). Agent: Claude Code cloud session.

## Context

PR #2072 (merged) shipped server-verified `/api/v1/backoffice/*` routes but left three
items open. This note records what was fixed and what's still blocked, and why.

## Ontology Tags

- **Geography:** N/A (internal engineering)
- **Sector:** Internal platform / DevOps
- **Entities:** Cloudflare Pages, Cloudflare Zero Trust, DGX Spark, Supabase
- **Temporal Context:** 2026-Q3
- **Confidence:** High on code changes (tested); the infra item is a documented gap, not a
  guess

## The Story

### Fixed: page-level UI gates reading spoofable `user_metadata.role`

`dws6.com/dashboard/backoffice/index.html` (and its `landing-pages/dws6-com` mirror) gated
the page with `requireRole("backoffice_admin")`, which reads client-editable
`user.user_metadata.role`. The actual data calls were already safe (every
`/api/v1/backoffice/*` route runs `requireBackofficeAdmin`, checking
`organization_members` server-side) — the gate only controlled whether the page _looked_
authorized before those calls failed. Added `GET /api/v1/backoffice/me` to
`src/routes/backoffice.routes.ts`, reusing the same `requireBackofficeAdmin` middleware,
returning `{ isAdmin: true }` on success. The page now calls that endpoint (new local
`requireBackofficeAdmin()` function in the page's own script) and redirects to
`/unauthorized.html` on anything but 200, instead of trusting local metadata. 2 new tests
(`src/__tests__/backoffice-routes.test.ts`, now 7/7). The other ~10 `requireRole(...)`
call sites across the dashboard (onelifetime, store, api, dws-iq, watsonx,
enterprise-model, enterprise, dws-iq-mobile, mcp-hub, lifetime-model) were left unchanged
— out of scope, none of them front a route with an equivalent server-verified check yet.

### Fixed: no `_redirects` for V10 deep-link refresh

No `_redirects` file existed anywhere in the repo. Cloudflare Pages only honors one at the
project root (not per-subfolder), so added `dws6.com/_redirects` (and the
`landing-pages/dws6-com` mirror) scoped specifically to V10's base path:

```
/dashboard/firehorse/v10/*  /dashboard/firehorse/v10/index.html  200
```

Confirmed V10's Vite `base` is `/dashboard/firehorse/v10/` in both
`dws6.com/dashboard/firehorse/v10-react/vite.config.ts` and its mirror — the rule matches.
Scoped narrowly (not a catch-all) so it doesn't affect the rest of the site, which is
static multi-page HTML, not a SPA.

### Not fixed — blocked on infrastructure outside this repo

**No production API host for `/api/v1/backoffice`.** `dws-backend` (the Express service
that owns these routes) only runs via `infrastructure/dgx-spark/docker-compose.yml` on the
DGX box. The one Cloudflare Tunnel that exists (`dgx-heartbeat`) routes only
`heartbeat.dws6.com` → `http://localhost:9999`; nothing routes to `dws-backend`.
`window.DWS_API_BASE` (dashboard pages) and `VITE_API_URL` (V10 React build) are both
correctly read as "call relative to whatever host serves this page" when unset — which is
the right default, but means every backoffice API call against the Cloudflare-Pages-served
frontend currently 404s, since Pages serves static files only.

**Why this session can't fix it:** the fix is an edit to `/etc/cloudflared/config.yml` on
the DGX box plus a `cloudflared tunnel route dns` call — it needs DGX SSH, which this
sandbox does not have. Same category of gap as this session's earlier DGX Spark Temporal
work: infrastructure state that lives outside version control and outside this sandbox's
reach. See the corrected procedure below.

## The Insight

Two of three "open items" were genuinely code-shaped (a missing endpoint + a missing
static-hosting config file) and closeable in this session. The third only looked
code-shaped from the PR description — it's actually a one-time manual DNS/tunnel-config
action on the DGX box, the same class of gap as the DGX Spark deployment blocker two
sessions ago (unset `POSTGRES_PASSWORD`). Worth normalizing as a pattern: "no production
API host" items in this repo tend to resolve to a `cloudflared` config step on the edge
node, not a code change, because the whole DGX-first architecture keeps backend services
off the public internet by default.

The sharper lesson is the one in "Correction" below: three rounds of confident, specific
instructions were given to the HIC from a compose-file comment describing an _intended_
deployment, while the file describing the _actual_ one (`Admin/ADMIN_MANUAL.md`, which
carried a ready-made runbook for exactly this task) sat unread. Infrastructure claims
need a source that records running state, not planned state.

## Proposed solution for the infra-blocked item

**Correction (v1.2):** the first draft of this section was wrong about which tunnel exists
and how it is managed. See "Correction" below. Corrected plan:

There is exactly one tunnel on the account: **`dgx-heartbeat`**, ID
`b2d1d6e8-28e5-48e0-a2d5-3d5b702ead8b`, currently carrying `heartbeat.dws6.com` →
`http://localhost:9999`. It is a **locally-managed tunnel** — its ingress config lives in
`/etc/cloudflared/config.yml` on the DGX box and `cloudflared` runs there as a **systemd
service on the host**, not as the profile-gated `cloudflare-tunnel` compose service (which
was never provisioned). Locally-managed tunnels expose no "Public Hostname" tab in the
Cloudflare dashboard — the dashboard cannot add this route at all.

1. **Hostname: `backend.dws6.com`** — same domain as the frontend calling it (no CORS
   complications), doesn't collide with any existing subdomain found in this repo.
2. **Origin URL is `http://localhost:8080`, not `http://dws-backend:8080`.** The host-level
   `cloudflared` daemon is not on the Docker network, so the compose service name does not
   resolve for it. `dws-backend` publishes `8080:8080` to the host, so `localhost:8080`
   reaches it — the same pattern the existing `heartbeat.dws6.com` → `localhost:9999` rule
   already uses.
3. **Procedure** (on the DGX box, per `Admin/ADMIN_MANUAL.md` → "Adding a new public
   hostname to the tunnel"):

   ```bash
   cloudflared tunnel route dns dgx-heartbeat backend.dws6.com   # creates the proxied CNAME
   # then edit /etc/cloudflared/config.yml, BEFORE the catch-all 404:
   #   - hostname: backend.dws6.com
   #     service: http://localhost:8080
   #   - service: http_status:404
   sudo systemctl restart cloudflared
   ```

4. **No new auth needed at the tunnel layer.** `/api/v1/backoffice/*` already requires a
   Supabase Bearer token + `organization_members` check per-route — exposing that route
   group publicly is safe as-is. Other, currently unauthenticated routes on the same
   Express app would need their own review before relying on the tunnel alone for
   protection — pre-existing scope, not new risk from this change.
5. **Verify:** `curl https://backend.dws6.com/health` → 200. That endpoint needs no auth
   (`docker-compose.yml` healthcheck uses it), so it isolates tunnel/DNS correctness from
   auth problems. Confirm the `dws-backend` container is actually running first.

## Correction — what the first draft got wrong

Recorded because the error pattern matters more than the fix. The v1.0/v1.1 draft of this
note asserted three things, none verified against the repo's own documentation:

| Claimed                                        | Actual                                                                                       |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------- |
| The tunnel carries `mcp-gateway`               | It carries `heartbeat.dws6.com` → `localhost:9999`; the tunnel is `dgx-heartbeat`            |
| Managed in the Cloudflare Zero Trust dashboard | Managed locally in `/etc/cloudflared/config.yml`; dashboard shows no hostname tab            |
| Origin is `http://dws-backend:8080`            | `http://localhost:8080` — `cloudflared` is a host systemd service, not on the Docker network |

The `mcp-gateway` claim came from reading the `cloudflare-tunnel` comment block in
`infrastructure/dgx-spark/docker-compose.yml` and taking its _intent_ as deployed state.
That service is gated behind the `gateway` compose profile and was never started. The
live tunnel was documented all along in `Admin/ADMIN_MANUAL.md` — including a ready-made
"Adding a new public hostname to the tunnel (future)" runbook — and was not consulted.
Lesson: a compose comment describes what someone planned; `Admin/ADMIN_MANUAL.md`
describes what is running. Check the latter before asserting infrastructure state.

## Approved (2026-09-24)

HIC approved `backend.dws6.com` as proposed. Code-side wiring status:

- **Done:** `dws6.com/dashboard/backoffice/index.html` (+ `landing-pages/dws6-com` mirror)
  now sets `window.DWS_API_BASE = window.DWS_API_BASE || "https://backend.dws6.com";` before
  the Supabase client script loads. Falls back to same-origin relative calls if unset.
- **Not done — session-blocked:** V10 React build's `VITE_API_URL`. This session hit a
  hard permission-policy block on reading/writing any `.env*` path (including
  `.env.example` templates) via both Bash and Read tools — consistent with the Secret
  Egress Rules philosophy but stricter than expected for a non-secret template. A local
  build session must set `VITE_API_URL=https://backend.dws6.com` in
  `dws6.com/dashboard/firehorse/v10-react/.env` (and mirror) and rebuild/republish the
  committed output at `dws6.com/dashboard/firehorse/v10/`.

## Next Steps

1. On the DGX box (needs SSH, not dashboard): run the three-step procedure in "Proposed
   solution" step 3 — `cloudflared tunnel route dns`, edit `/etc/cloudflared/config.yml`,
   restart the daemon. Confirm `dws-backend` is running first.
2. Verify `curl https://backend.dws6.com/health` → 200 before touching anything else.
3. A local session (with `.env*` access) sets V10's `VITE_API_URL` and republishes.
4. Verify: log in on `dws6.com` → Back-Office page loads live stats/containers/users/audit
   data (currently the two remaining unchecked boxes in PR #2072's own test plan).

## HIC decision needed

None — hostname approved, tracked above. Remaining items are execution (DGX SSH, local
build), not decisions.

## N/A items (Rule 12)

- KB update: N/A — infra-blocked item has no new operational fact yet; the two code fixes
  are captured in this note and their own PR.
- Calendar entry: N/A — no dated commitment; depends on DGX SSH session timing.
