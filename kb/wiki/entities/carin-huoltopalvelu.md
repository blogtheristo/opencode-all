<!--
VERSION AND AGENT HISTORY
Document: carin-huoltopalvelu.md
Version: 1.0
Last-Updated: 2026-07-28
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: KB entity record for Carin Huoltopalvelu Tmi (Y-tunnus 3582356-8), the
         cari.fi website customer — confirmed facts, settled decisions, and the
         open blockers, so a later session does not re-derive or "correct" them.
Introduced-In: branch claude/cari-fi-new-site-x410ox
Code-Version: 1.0
Branch: claude/cari-fi-new-site-x410ox
Date: 2026-07-28
Owner: risto.paarni@lifetime.fi
-->

# Carin Huoltopalvelu Tmi

**Type:** Customer (SMB services) · **Y-tunnus:** 3582356-8 · **VAT:** FI35823568 · **Status:** Site delivered, launch blocked on domain

Independent car service and repair workshop in Jorvas, Kirkkonummi. Lifetime Oy customer for the `cari.fi` website (delivered 2026-07-28).

## Confirmed facts

| Field | Value |
| --- | --- |
| Owner / operator | Kari Törn |
| Address | Kiilatie 15, rakennus 1, ovi 12, 02430 Jorvas, Kirkkonummi |
| Phone / WhatsApp | +358 400 744 214 |
| Opening hours | Mon–Fri 8–18 |
| Payment methods | Debit card, credit card, cash |
| Scope | All makes and models; petrol + diesel; vans and commercial vehicles; tyre sales |
| Service area | Kirkkonummi, Jorvas, Masala, Espoo, Siuntio, Inkoo, Karjaa, Raasepori |
| Tyre brands | Falken, Nexen, Pirelli |
| Facebook | facebook.com/p/Carin-Huoltopalvelu-61561376596621 |

**The address contradicts YTJ and the owner's version is the correct one.** The registry still shows Kiilatie 12 B 12, 02420 Jorvas (data from 10.01.2026). The owner confirmed the address above as current. **Do not "correct" it back to the registry value** — this has been raised and settled twice.

## Positioning

**"Personal Car Service."** Framed by analogy to a personal trainer, with the promise *"Tarkkaa huolenpitoa"* (precise care). Explicitly **not** "small one-person workshop" — that framing was rejected by the owner because it fixes the business at its current headcount and would read as a downgrade if Kari hires.

## Settled design decisions

Recorded because each was reached by rejecting an alternative, and a later session that does not know why will re-open them:

- **Logo:** a 24-tick measuring-scale ring with a wrench, representing precision. Five hand-drawn wrench SVGs were rejected before the Lucide line-art was accepted.
- **Door photo is not cropped to fill.** Its job is colour recognition — the customer checks that the door colour matches where they arrived. `object-fit: cover` defeats that purpose.
- **No prices published.** The owner's decision. "Hinta" is nonetheless one of the most common words in these searches — a standing trade-off, not an oversight.
- **No third-party brand logos** (Bosch, Bahco) and no outbound link to `luiginpaja.fi` — trademark exposure with no return.
- **EN address ends in FINLAND** so foreign suppliers can address shipments from it; **recruiting address is Finnish-only.**

## Digital assets

| Asset | State |
| --- | --- |
| `cari.fi` domain | Registered 26.07.2026 at hostingpalvelu.fi. **`Pending` since registration**; escalated 28.07.2026 20:57 |
| Website | Delivered. `blogtheristo/cari`, `main`, published from `public/` |
| Hosting | Cloudflare Pages — **project not yet connected** (waits on the zone) |
| `huolto@` / `service@` / `rekry@cari.fi` | **Do not exist.** Google Workspace waits on DNS, which waits on the domain |
| WhatsApp | `wa.me/358400744214` — **verified working** 28.07.2026 from an independent phone. Currently the only contact channel that reaches Kari |
| Google Business Profile | **Not created.** Largest single visibility lever for a local workshop; address verification by post takes 1–2 weeks |

**Launch gate:** do not point `cari.fi` at the site until a test message to `huolto@cari.fi` has actually arrived. Until the mailbox exists, every contact email and form submission bounces silently.

## Open with the customer

- SEO review list delivered for Kari to check — missing services, missing car makes, tyre brands, service area, whether invoicing is accepted. **No answers received yet.**
- Google Business Profile ownership: **decided 28.07.2026 — Kari's own Google account**, created when the domain activates. Lifetime Oy takes manager rights, not ownership.

## Related

- `docs/field-notes/2026-07-26-cari-fi-new-site-cloudflare-onboarding.md` — canonical onboarding record
- `sales-outreach/TARJOUS_CARIN_HUOLTOPALVELU_VERKKOSIVUT_FI.md` — the proposal
- `kb/wiki/concepts/plausible-wait-window.md`, `kb/wiki/concepts/repo-as-publication-surface.md` — the two reusable lessons from this engagement
