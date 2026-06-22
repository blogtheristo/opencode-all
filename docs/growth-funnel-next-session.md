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

**LIVE as of 2026-06-22:** migration 070 applied → end-to-end funnel is active:
discoverable (SEO/AEO) → capture (newsletter + free-audit) → store (`web_leads`) →
daily sales brief.

---

## Queued work (priority order)

### 1. Roll FAQPage JSON-LD onto top high-intent pages (IN PROGRESS — start here)

The homepage already has a hand-written FAQPage block. This is now the 2nd round of FAQ
work, so **codify it** per the "asked twice = failure" rule instead of hand-editing each
page:

- Build `scripts/on-deploy/inject-faq-jsonld.mjs` — reads a curated data file, injects a
  **marked** FAQPage `<script type="application/ld+json">` block (between
  `<!-- FAQ-JSONLD:START -->` / `<!-- FAQ-JSONLD:END -->`) into each page's `<head>`,
  idempotent, `--check` mode, writes root + `landing-pages/` mirror.
- Put curated Q&A in `dws10.com/config/faq.json` keyed by page path (relative to
  dws10.com). Migrate the homepage's existing manual block into this file and replace it
  with a marked block (single source, no duplicate FAQPage).
- Run it, validate each block parses as JSON, run `node scripts/lint-truth-claims.mjs`,
  sync mirrors, commit.

**Canonical phrasing (MUST use, truth-lint enforced):**
"16 captain hats covering 25 EU-regulated industries", "25 EU-regulated industries",
"16 captain hats". NEVER "16 industries" / "20 EU industries" (deprecated → FAIL).

**Grounding already gathered for the target pages (use for accurate answers):**

- `csrd/` — "Automate CSRD reporting with 82 ESRS disclosures mapped, AI-powered data
  collection, audit-ready reports. EU-hosted. Operational in 30 days."
- `compliance/` — "Compliance Hub — CI Power V2 engine: EN 15978 lifecycle assessment,
  CSRD, EPBD, ETS2, CBAM, Fit for 55. Multi-jurisdiction Nordic support."
- `construction/` — "Construction Solutions — Enterprise AI for EU climate compliance."
- `energy/` — "Energy & Utilities — ETS, CBAM, renewable energy."
- `logistics/` — "Logistics & Supply Chain — fleet emissions, transport compliance."
- `manufacturing/` — "Manufacturing — emissions reporting, CSRD, factory compliance."

After adding any new page, re-run `scripts/on-deploy/generate-discoverability.mjs` so it
lands in sitemap.xml + llms.txt.

### 2. web_leads auto-acknowledgement email (RED-zone send — needs human approval)

When a `web_leads` row is created, send a branded acknowledgement via **Amazon SES SMTP**
(never Resend, never `noreply@`; sender e.g. `sales@lifetime.fi`). Reuse
`src/services/email.service.ts` / `email-queue.service.ts`. Authoring is GREEN; the actual
send path is RED-zone — gate behind human approval. Consider a Supabase trigger/webhook or
a `scripts/hourly` poller over `web_leads?status=eq.new`.

### 3. Wire the jsdom test into CI

Add `tests/growth-capture-dom.test.mjs` to the npm test script / CI so the capture forms
stay verified. jsdom is already a devDependency.

### 4. Verify live capture end-to-end (quick win for whoever has access)

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
