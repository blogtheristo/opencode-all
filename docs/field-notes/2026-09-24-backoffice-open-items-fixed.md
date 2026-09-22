<!-- Evidence: Tool=Claude Code Model=claude-sonnet-5 Agent=Claude Code Date=2026-09-24 -->

# Field Note — PR #2072's three open items: two fixed, one infra-blocked

## VERSION AND AGENT HISTORY

---

Version: 1.0
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
that owns these routes) only runs via `infrastructure/dgx-spark/docker-compose.yml`, bound
to the DGX host's internal Docker network. The only Cloudflare Tunnel ingress currently
configured (in the Cloudflare Zero Trust dashboard, not in this repo) routes to
`mcp-gateway`, not `dws-backend`. `window.DWS_API_BASE` (dashboard pages) and
`VITE_API_URL` (V10 React build) are both correctly read as "call relative to whatever
host serves this page" when unset — which is the right default, but means every backoffice
API call against the Cloudflare-Pages-served frontend currently 404s, since Pages serves
static files only.

**Why this session can't fix it:** the fix is a Cloudflare Zero Trust dashboard action
(add an ingress hostname → `http://dws-backend:8080` to the existing tunnel's config, plus
a DNS CNAME) — not a file in this repo. Same category of gap as this session's earlier
DGX Spark Temporal work: infrastructure state that lives outside version control and
outside this sandbox's reach (no Cloudflare dashboard access, no DGX SSH). Documented the
exact remaining step as a comment in
`infrastructure/dgx-spark/docker-compose.yml`'s `cloudflare-tunnel` service block so it's
discoverable next to the one ingress rule that already exists.

## The Insight

Two of three "open items" were genuinely code-shaped (a missing endpoint + a missing
static-hosting config file) and closeable in this session. The third only looked
code-shaped from the PR description — it's actually a one-time manual DNS/tunnel-config
action, the same class of gap as the DGX Spark deployment blocker two sessions ago
(unset `POSTGRES_PASSWORD`). Worth normalizing as a pattern: "no production API host"
items in this repo tend to resolve to a Cloudflare Zero Trust config step, not a code
change, because the whole DGX-first architecture keeps backend services off the public
internet by default.

## Proposed solution for the infra-blocked item

Reuse the existing pattern instead of standing up new infrastructure — there is already
exactly one tunnel with one ingress rule (`mcp-gateway`, per `docs/CLOUD_ENVIRONMENTS.md`
§12.x). Add a **second** ingress rule to that same tunnel:

1. **Hostname: `api.dws6.com`** — same domain as the frontend calling it (no CORS
   complications), doesn't collide with any existing subdomain found in this repo.
2. **Cloudflare Zero Trust dashboard** (one-time, outside repo): add ingress rule
   `api.dws6.com` → `http://dws-backend:8080` to the tunnel already carrying
   `mcp-gateway`'s traffic. No new `CLOUDFLARE_TUNNEL_TOKEN`, no new `cloudflare-tunnel`
   compose service — one tunnel, two ingress hostnames.
3. **DNS:** CNAME `api.dws6.com` → the tunnel's `<tunnel-id>.cfargotunnel.com`, the same
   pattern as whatever record already exists for `mcp-gateway`'s hostname.
4. **No new auth needed at the tunnel layer.** Unlike `mcp-gateway` (which needed
   `MCP_GATEWAY_API_KEY` because it had no other auth), `/api/v1/backoffice/*` already
   requires a Supabase Bearer token + `organization_members` check per-route — exposing
   `dws-backend:8080` publicly is safe as-is for this route group. Other, currently
   unauthenticated routes on the same Express app would need their own review before
   relying on the tunnel alone for protection — pre-existing scope, not new risk from
   this change.
5. **Code, ready the moment DNS resolves** (not done yet — waiting on steps 2-3):
   - `dws6.com/dashboard/backoffice/index.html` (+ mirror): inject
     `window.DWS_API_BASE = "https://api.dws6.com";` before the module script.
   - V10 build: set `VITE_API_URL=https://api.dws6.com` in its build env, rebuild,
     republish.

## Next Steps

1. HIC confirms or vetoes `api.dws6.com` as the hostname (default proposed above — flag
   if a different naming convention should be used instead).
2. Whoever holds Cloudflare Zero Trust dashboard access adds the ingress rule + DNS CNAME
   per steps 2-3 above.
3. A follow-up session makes the two one-line code changes in step 5 and republishes.
4. Verify: log in on `dws6.com` → Back-Office page loads live stats/containers/users/audit
   data (currently the two remaining unchecked boxes in PR #2072's own test plan).

## HIC decision needed

Confirm `api.dws6.com` as the hostname for `dws-backend` (proposed above), or name a
different one. Nothing else in steps 1-3 above can start until this is answered.

## N/A items (Rule 12)

- KB update: N/A — infra-blocked item has no new operational fact yet; the two code fixes
  are captured in this note and their own PR.
- Calendar entry: N/A — no dated commitment; depends on Cloudflare dashboard access timing.
