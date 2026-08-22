# Architecture Coherence Audit — Bugs & TODOs

> **Wedge:** *"This is not architecturally coherent."*
> Date: 2026-05-31 · Branch: `claude/bugs-architecture-coherence-TT4Xo`
> Scope: backend (`src/`), `Firehorse/`, `mcp-hub*`, repo hygiene. Evidence is cited as `file:line`.

This audit separates three things that get conflated: **real bugs** (wrong behaviour today),
**unfinished TODOs** (known gaps), and **architectural incoherence** (two sources of truth,
duplicated trees, rules that contradict reality). The last category is the wedge — the codebase
does not have one obvious place for each concern, so the same decision is made in multiple
places and they drift.

---

## 1. Real bugs (incorrect behaviour today)

### 1.1 OIDC callback stores unvalidated tokens — auth bypass (HIGH)
`Firehorse/.../v8/scripts/dws-bundle.js:38-46`

```js
function handleCallback() {
  // TODO: Implement full OIDC callback validation (JWT decode + signature verification)
  const params = new URLSearchParams(window.location.hash.substring(1));
  const token = params.get('access_token') || params.get('id_token');
  if (token) { setToken(token); ... }   // stored & sent as Bearer with no validation
}
```

The callback takes whatever token is in the URL fragment and uses it as a `Bearer` credential
with **no signature, issuer, audience, or expiry check**. Any value in `#access_token=` is
accepted. Combined with `beginLogin()` doing `window.prompt('Enter bearer token (dev only)')`,
this is dev-grade auth shipped in a client bundle.

- **Incoherence multiplier:** the file is committed **three times, byte-identical**
  (md5 `46065e67…`):
  - `Firehorse/OK_Firehorse/V7_extracted/v8/scripts/dws-bundle.js`
  - `Firehorse/OK_Firehorse/v8/scripts/dws-bundle.js`
  - `Firehorse/V7_extracted/v8/scripts/dws-bundle.js`

  A fix has to land in 3 places or the copies drift. There is no single source for the auth bundle.

### 1.2 Payment provisioning is a no-op — purchases succeed but nothing activates (HIGH)
`src/routes/stripe-webhook.routes.ts:174`, `src/services/billing.service.ts:346`

Both files carry the **identical** stub `// TODO: Activate service/product access`, and
`stripe-webhook.routes.ts` does **not** import or delegate to `billing.service.ts` — they are
two parallel empty implementations of the same concern. On `checkout.session.completed` /
`invoice.paid`, the customer is charged but no entitlement is granted, no provisioning runs, and
no notification is sent (see §2.1). This is a money-affecting correctness bug, not just a TODO.

### 1.3 Dangling route wiring for a renamed file (MEDIUM)
`src/app.ts:42,421` import `./routes/grok-consent.routes.js`, but the only file on disk is
`src/routes/grok-consent.routes_OLD.ts`. The wiring is commented out with
`// TODO: restore when grok-consent is available`. The route was renamed to `_OLD` (the
soft-delete convention) but the consumer still references the live name — so "restore" can never
succeed without un-renaming. Either delete the dead route or restore it; the in-between state is
a permanent broken reference.

---

## 2. Unfinished TODOs (known gaps, grouped by owner)

Most raw `TODO/FIXME` grep hits (≈82) are **false positives** — `T:XXXXXXXX` reply-token format
strings, `GTM-XXXXXXX`, `CVE-2025-XXXXX`, Finnish phone masks. The genuinely actionable ones cluster:

### 2.1 Payments / billing / email lifecycle (21 TODOs)
- `src/routes/stripe-webhook.routes.ts` — **13 TODOs**: activate access, provisioning/onboarding,
  payment-failure + admin notifications, auto-cancel after 30 days, refund order-status update,
  customer-deletion anonymisation.
- `src/services/billing.service.ts` — **4 TODOs**: activate access, payment reminders, auto-cancel.
- `src/routes/email-webhook.routes.ts` — **4 TODOs**: mark contact invalid, suppress hard bounces,
  drop from campaigns, alert for manual review.
- `src/routes/b2b-payment.routes.ts:385` — admin notify / customer reminder.

These overlap (auto-cancel, activate-access, payment-failure notify appear in both the webhook and
the service) — see §3.2.

### 2.2 Other
- `Firehorse/report_engine.py:810` — `# TODO: Implement rule checking logic` (rule engine stubbed).
- `mcp-servers/supabase_OLD/server.py:233` — embeddings generation TODO, but in an `_OLD` dir →
  dead code that should be removed, not finished.
- `src/services/analytics.service.ts:16` — frontend/pipeline event emission deferred to "the TODO
  list in the PR description" (off-repo tracking; should be issues, not a code comment).

---

## 3. Architectural incoherence (the wedge)

### 3.1 A full second copy of the repo is committed
`artifacts/pr1295-mergecheck/` contains **4,027 tracked files** — an entire snapshot of the repo,
including its own `.claude/`, `.github/workflows/`, `_OLD` files, edit-conflict files, and
landing-page mirrors. Every grep, every "find all callers", every security scan now returns each
hit twice, and any standard (dual-folder sync, pricing source-of-truth) is silently duplicated and
will drift. This single directory is the largest coherence liability in the tree.

### 3.2 No single owner for payments
Six route files touch payments/webhooks — `payment.routes.ts`, `b2b-payment.routes.ts`,
`stripe-webhook.routes.ts`, `webhook.routes.ts`, `email-webhook.routes.ts`, `kya-webhook.routes.ts`
— plus `services/billing.service.ts`. The activation/notification logic is stubbed independently in
the webhook route **and** the service (§1.2). There is no "this is where a purchase becomes an
entitlement" module. Per CLAUDE.md's source-of-truth principle, this concern needs one owner that
the routes delegate to.

### 3.3 Three live `mcp-hub` variants, no canonical
- `mcp-hub/` — Python (`server.py`, `llm_mesh.py`)
- `mcp-hub-ts/` — TypeScript (`src/`, `package.json`, `cloudbuild.yaml`)
- `mcp-hub_OLD/` — Python, near-duplicate of `mcp-hub/`

Nothing marks which is authoritative. A Python and a TS implementation coexisting with an `_OLD`
Python copy means three answers to "where does the MCP hub live?"

### 3.4 `.gitignore` rules that don't match reality
- `.gitignore:19` is `[0-9][0-9][0-9][0-9][0-9][0-9].env` — written **specifically** to exclude
  `100326.env`, yet `100326.env` is tracked (gitignore can't untrack an already-committed file).
  The rule looks like protection but does nothing.
- `.gitignore:20` is `[0-9][0-9][0-9][0-9][0-9][0-9]mcp.env`, but the real file is `env100326.mcp`
  — the pattern doesn't even match the filename it was meant to catch. `.env.mcp` (line 17) also
  misses `env100326.mcp`.

`100326.env` and `env100326.mcp` ship `SUPABASE_SERVICE_KEY`, `JWT_SECRET`, `*_API_KEY`,
`GOOGLE_OAUTH_CLIENT_SECRET` keys. **Values are placeholders (`your…`), so this is not a live
secret leak** — but committing real-shaped env files with these exact keys is exactly what
CLAUDE.md Rule 1/2 forbids, and the ignore rules give a false sense that it's handled.
Recommend: `git rm --cached` both, fix the ignore patterns to match the actual names.

### 3.5 `.gitignore` line 19 vs Rule 4 — Resend is both banned and load-bearing
CLAUDE.md Rule 4: *"Never use Resend; email transport is Amazon SES (SMTP) only."* Reality:
- `RESEND_API_KEY` is in the committed env files.
- The user-facing `/email` skill is described as *"manages Resend email delivery."*
- `resend_test.py` sits at repo root.
- ~10 `src/` modules reference Resend **and** ~10 reference SES, including the same files
  (`src/services/email.service.ts`, `src/middleware/env-validation.ts`,
  `src/morning-briefing/data-collectors.ts`) — i.e. a dual email stack.

Either the standard is wrong or the code is. Today a reader can't tell which transport is canonical.

### 3.6 Leftover edit-conflict and `_OLD` files in the live tree (root, not just artifacts)
- `PAYMENT_INTEGRATION (# Edit conflict 2026-01-05 md53b7C #).md` + the clean `PAYMENT_INTEGRATION.md`
- `README (# Edit conflict 2026-01-05 9cxax4C #).md` + the clean `README.md`
- empty `gcp-sa-key-new.json` (0 bytes) and empty `gcloud_OLD` at root — key-shaped filenames with
  no content, pure noise/risk.
- `docker-compose.hybrid_OLD.yml`, `mcp-servers/supabase_OLD/`, `src/web/utils/redirect_validator_OLD.py`, etc.

The `_OLD` rename convention (CLAUDE.md Rule 6) is being used as a substitute for deletion, so the
tree accumulates two versions of everything and search results are ambiguous.

---

## 4. Recommended remediation order

| # | Action | Severity | Effort |
|---|--------|----------|--------|
| 1 | Add real OIDC validation in `dws-bundle.js`; de-duplicate to one source bundle (§1.1) | HIGH | M |
| 2 | One payment-entitlement module; routes delegate to it; implement activate/notify (§1.2, §3.2) | HIGH | L |
| 3 | `git rm -r --cached artifacts/pr1295-mergecheck/` and gitignore it (§3.1) | HIGH | S |
| 4 | `git rm --cached 100326.env env100326.mcp`; fix `.gitignore:19-20` to match real names (§3.4) | HIGH | S |
| 5 | Resolve grok-consent: delete `_OLD` route or restore + re-wire (§1.3) | MED | S |
| 6 | Pick one `mcp-hub` (TS vs Python); remove `mcp-hub_OLD` (§3.3) | MED | M |
| 7 | Reconcile Resend-vs-SES: align Rule 4, `/email` skill, and `src/` on one transport (§3.5) | MED | M |
| 8 | Purge committed edit-conflict files and empty key-shaped files at root (§3.6) | LOW | S |

**Theme:** the bugs are downstream of the incoherence. Two payment stubs exist because there is no
payment owner; the OIDC TODO is unfixable-in-one-place because the bundle is triplicated; the env
files leak shape because the ignore rules were never reconciled with the filenames. Fixing the
"one obvious place" for each concern removes the class, not just the instance.
