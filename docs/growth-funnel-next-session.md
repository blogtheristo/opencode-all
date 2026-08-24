# Next Session Prompt — Growth System Funnel

**Branch to continue on:** `claude/growth-system-funnel-rwnjxf`
**Last session ended:** 2026-06-22
**Status:** Phase 1 (discoverability) + Phase 2 (lead capture) shipped and LIVE.

---

## Paste this into the next session

> Continue the growth-system funnel work on branch `claude/growth-system-funnel-rwnjxf`.
> Migration `070_web_leads.sql` is already APPLIED to Supabase (the `web_leads` table is
> live), so the footer newsletter and `/free-audit/` forms now write real leads and the
> daily morning brief surfaces them. Pick up the queued work below, highest-value first.
> Follow CLAUDE.md (dual-folder sync, truth-lint approved phrasing, RED-zone gates).

---

## What already shipped (7 commits on the branch)

1. `8496bed` — SEO+AEO discoverability: `robots.txt` / `sitemap.xml` / `llms.txt` across
   dws10.com, onelifetime.world, lifetime.fi (+ protective robots for the internal
   dws6.com). One re-runnable generator: `scripts/on-deploy/generate-discoverability.mjs`.
2. `02cf03f` — `web_leads` table (migration 070) + newsletter capture band in the shared
   `ironclad-footer.js` (every page of the 3 lead-gen sites).
3. `e1439e4` — `/free-audit/` lead-magnet page → `web_leads` (`source=free_audit`).
4. `45e8fd8` — made migration 070 replay-safe (idempotent RLS policies).
5. `b237fb3` — jsdom functional tests: `tests/growth-capture-dom.test.mjs` (17 checks).
6. `f3d7298` — `web_leads` surfaced in the daily morning brief
   (`src/morning-briefing/data-collectors.ts` + `briefing-template.ts`).
7. `7945f45` — FAQPage JSON-LD on the dws10.com homepage (AEO).
8. `31aa549` — FAQPage JSON-LD rolled across homepage + csrd, compliance, construction,
   energy, logistics, manufacturing via a re-runnable injector
   (`scripts/on-deploy/inject-faq-jsonld.mjs`) driven by `dws10.com/config/faq.json`.

**LIVE as of 2026-06-22:** migration 070 applied → end-to-end funnel is active:
discoverable (SEO/AEO) → capture (newsletter + free-audit) → store (`web_leads`) →
daily sales brief.

---

## Queued work (priority order)

### 1. FAQPage JSON-LD rollout — DONE (commit 31aa549)

Injector `scripts/on-deploy/inject-faq-jsonld.mjs` + curated `dws10.com/config/faq.json`
now manage marked FAQPage blocks on homepage, csrd, compliance, construction, energy,
logistics, manufacturing. To extend: add a page entry to `faq.json` (canonical phrasing
only — "16 captain hats covering 25 EU-regulated industries"), re-run the injector, then
`generate-discoverability.mjs`. Candidate next pages: real-estate, mining,
financial-services, public-sector.

### 2. web_leads acknowledgement email — DONE (commit abd5899), needs enabling

`scripts/hourly/web-leads-ack.ts` sends a one-time SES acknowledgement per lead.
**DRY-RUN by default.** To go live (human, RED-zone): (a) apply
`supabase/migrations/071_web_leads_ack.sql` (adds `ack_sent_at`), (b) set
`WEB_LEADS_ACK_ENABLED=true` in the DGX Spark hourly-runner env. Verify with a dry-run
first: `npx tsx scripts/hourly/web-leads-ack.ts` (logs would-send, sends nothing).

### 3. Wire the jsdom test into CI — DONE (commit 25896f2)

`tests/growth-capture-dom.test.mjs` is now a vitest suite (runs under `npm test`);
test-on-pr.yml path filters extended to tests/\*\* + the tested assets.

### 4. Resend/SendGrid → SES — DONE (commit 38acbef)

email.service.ts now routes through the SES utility; Resend/SendGrid providers removed
(CLAUDE.md Rule 4). Note: `email.service.ts` had dual-provider Resend/SendGrid code — if
any other module reintroduces a non-SES sender, route it through `src/utils/send-email.ts`.
Legacy INBOUND webhook plumbing (`/webhooks/resend/inbound`, `verifyResendSignature`) left
intact — it's inbound, not the banned outbound transport.

### 5. Verify live capture end-to-end (quick win for whoever has access)

Submit the footer newsletter + `/free-audit/` form on the live site (or after deploy) and
confirm rows land in `web_leads`, then confirm the next morning brief shows the "Web Leads"
section.

---

## Conventions & gotchas (from this session)

- **Direct Supabase insert pattern:** public forms POST straight to
  `https://kpucuwwfhuwurdxyjjtz.supabase.co/rest/v1/<table>` with the **publishable anon
  key** `sb_publishable_mZtEHU2k4WolHxePGF6g3w_tdkMCWRh` (already public; RLS = anon INSERT
  only). Mirror this for any new public form.
- **Dual Folder Sync Rule:** `dws10.com/` → `landing-pages/dws10-com/` (etc.) must be
  byte-identical in the same commit. The footer JS is shared across 3 lead-gen sites
  (6 identical copies); dws6.com has its own and stays untouched.
- **RED-zone (human-gated, BLOCKED in container):** applying migrations, deploys, outbound
  email, secrets. No DB credentials exist in the container — can't query/seed Supabase.
- **GTM:** container `GTM-5Q43B4J`. `/free-audit/` pushes a `lead_free_audit` dataLayer
  event; reuse that pattern for new conversion points.
- **Verify before done:** `npx tsc --noEmit`, `node tests/growth-capture-dom.test.mjs`,
  `node scripts/on-deploy/generate-discoverability.mjs --check`, `node scripts/lint-truth-claims.mjs <files>`.

---

## Compare / PR (none created yet)

`https://github.com/blogtheristo/dws6/compare/main...claude/growth-system-funnel-rwnjxf`
