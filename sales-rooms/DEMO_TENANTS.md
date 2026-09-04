# Demo Tenants — Per-Customer Demo Environments Behind the Noux Rooms

**Last updated:** 2026-08-30
**Status:** Convention agreed (HIC, 2026-08-30) — provisioning automation NOT built yet.

A Noux room hands the visitor a link. That link should open **their own populated environment** —
every DWS IQ and Firehorse product/service instantiated with their name on it — not a generic demo.

## Naming convention

```
dev.<customer-slug>@dws10.com
```

Examples: `dev.outokumpu@dws10.com`, `dev.kemira@dws10.com`, `dev.valmet-automotive@dws10.com`

- `<customer-slug>` = lowercase company name, hyphenated, no legal suffix (`oyj`, `oy`, `ab`).
- One tenant address per **customer organisation**, not per contact person.
- `dev.` prefix marks it as a demo/trial tenant with demo data — never a production account.

## What a tenant contains

Provisioned once, identical every time (that is the point of automating it):

| Layer    | Contents                                                                                                              |
| -------- | --------------------------------------------------------------------------------------------------------------------- |
| Products | Full DWS IQ tuoteperhe + Firehorse tuoteperhe, all enabled                                                            |
| Data     | Customer-branded demo dataset (name, industry, plausible scope figures) — synthetic, never the customer's real data   |
| Agents   | The agents relevant to the customer's industry, pre-run once so the room visitor sees results, not an empty dashboard |
| Access   | Magic-link / invite from the Noux room; no password handoff by email                                                  |

## Provisioning path (proposed, not implemented)

Cloudflare fronts the sites and Workers already; the demo tenant is a Cloudflare-triggered provision:

1. Sales room invite is prepared → customer slug is chosen.
2. A provisioning job creates the tenant record (Supabase), seeds the demo dataset, and enables the
   product set.
3. Cloudflare routes `dev.<slug>` to the demo app with the tenant bound.
4. The Noux room's CTA link points at the tenant.
5. Trial expiry (default 30 days) is written into Google Calendar at creation time
   (`DWS_LEARNING_STANDARD.md` §4.1 — a date only in a `.md` gets missed).

## Guardrails

- **Synthetic data only.** A demo tenant never contains a customer's real ERP/emissions data before an
  NDA and a signed pilot. If the customer wants their real data in it, that is a pilot, not a demo.
- **Tenant isolation is RLS-backed** — every demo tenant is a separate row-level-secured tenant, not a
  shared account with a filter (`DWS_SECURITY_STANDARD.md`).
- **No secrets in the room.** The room links to the tenant; it never carries keys or credentials.
- **Expiry is enforced, not remembered.** A demo tenant with no expiry becomes a free forever account.

## Open decisions for the HIC

1. Is `dws10.com` the right tenant domain for **all** three rooms, or does the partner room want
   `dev.<slug>@lifetime.fi` to keep the consulting brand separate from the store brand?
2. Default trial length — 30 days, or per-room (partners longer, trials shorter)?
3. Who provisions: an agent on invite-prep (automated), or the HIC on demand (manual first, automate at
   3+ demos)?
