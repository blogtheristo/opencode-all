# Handoff: claude/cari-fi-new-site-x410ox

## Task

New customer onboarding: **Carin Huoltopalvelu Tmi** (Y-tunnus 3582356-8), a
one-person car workshop in Jorvas, Kirkkonummi. Build and ship `cari.fi` —
a bilingual (FI/EN) single-page site — and get the domain, DNS, and mail
running.

Two repos, same branch name:

- **`blogtheristo/cari`** — the site itself (`index.html`, assets, `_headers`).
- **`blogtheristo/dws6`** — the canonical field note
  `docs/field-notes/2026-07-26-cari-fi-new-site-cloudflare-onboarding.md`.

## State: site DONE — blocked on the domain, not on code

The site is finished, pushed, and previewed to the customer. **Nothing in the
codebase is the blocker.** The whole remaining critical path is one registrar
status flag.

### What the site is

Single `index.html`, no build step, deployed to Cloudflare Pages. Language
switching is client-side via `data-fi` / `data-en` attribute pairs read by
`apply(lang)`; there is no second HTML file and no server-side routing.

- Black theme, gold accent, mobile-first — the customer's own brief.
- Logo is a 24-tick gold ring + Lucide wrench, inline SVG, also the favicon
  data URI. Do not redraw it — five hand-drawn attempts were rejected before
  the Lucide line-art was accepted.
- `.js` class is set inline in `<head>` so the reveal animations' `opacity: 0`
  can never apply when JS fails. Reveals use a forced reflow
  (`void el.offsetWidth`) plus a **2.5 s backstop timer**, because
  IntersectionObserver was verified to not fire at some viewport widths and
  left the door photo permanently invisible. Do not "simplify" this to a
  single `requestAnimationFrame` — that was tried and it broke EN entirely.
- vCard (`assets/carin-huoltopalvelu.vcf`) is served as `text/vcard` via
  `_headers` for native "add to contacts" on mobile. It is CRLF, as vCard 3.0
  requires.
- `.fi-only` class + `apply()` hides Finnish-only rows (currently the
  recruiting address) on the English page rather than translating them.

### Facts that are settled — do not "fix" them back

| Thing | Value | Why it looks wrong |
| --- | --- | --- |
| Address | **Kiilatie 15, rakennus 1, ovi 12, 02430 Jorvas, Kirkkonummi** | YTJ still shows Kiilatie 12 B 12, 02420 Jorvas (data from 10.01.2026). The owner confirmed the above as current. |
| Positioning | **"Personal Car Service"** | Not "small one-person workshop" — the owner may hire, and the earlier wording was rejected. |
| Door photo | CSS-cropped, **not** `object-fit: cover` | Its purpose is colour recognition — the customer must see the door colour matches where they arrived. Cropping defeats it. |
| EN address | ends in **FINLAND** | Deliberate — suppliers abroad address shipments from it. |
| Recruiting row | **FI only** | Recruiting is a Finnish-language channel. |
| Prices | **none published** | By design, owner's decision. |

## The blocker

`cari.fi` is registered and paid at **hostingpalvelu.fi** (26.07.2026, 39,80 €
first term, 49,80 € / 2 yr, next due 26.07.2028) and has been **`Pending` since
registration**. The registrar's panel says *"Domains cannot be managed unless
active"*, so the nameserver fields are not editable.

**A support request was filed 28.07.2026 at 20:57**, after two days in
`Pending`. A `.fi` normally activates in minutes to hours (automated Traficom
registry), so this is stuck, not slow. The field note records the three causes
worth making the registrar distinguish — payment reconciliation, an unsurfaced
registry rejection (holder must read **Carin Huoltopalvelu Tmi, 3582356-8**),
or a genuinely queued request — and the transfer fallback (Louhi,
Domainkeskus, Zoner) if they cannot resolve it.

Everything else is serialised behind it:

`cari.fi Active` → Cloudflare zone → nameservers → Pages custom domain
→ Workspace verification + MX → `huolto@` / `service@` / `rekry@` work

### Sequence that must not be re-ordered

1. Wait for `Pending` → `Active`.
2. Add `cari.fi` to Cloudflare as **Full setup**, on the **same Cloudflare
   account as `lifetime.fi`**.
3. Read the assigned `*.ns.cloudflare.com` pair from **cari.fi's own**
   dashboard.
4. Only then set those two at the registrar.

**Never do 4 before 2.** Presetting nameservers before the zone exists makes
Cloudflare assign a *different* pair (anti-hijacking) and breaks activation.
The pair cannot be predicted or copied from lifetime.fi.

The registrar's own SSL rows are irrelevant — Cloudflare Universal SSL covers
this for free. Do not buy one.

## Launch gate

**Do not point cari.fi at the site until a test message to `huolto@cari.fi`
has actually arrived.** Until the mailbox exists, every contact email and every
contact-form submission bounces silently — nobody sees it fail. `wa.me`
WhatsApp is verified working (tested 28.07.2026 from another phone), so it is
the only contact channel that reaches Kari today; that is why it sits directly
under the form.

## Open with the customer

1. **SEO review list** was delivered to the owner for Kari to check — missing
   services (öljynvaihto, jarruhuolto, ilmastointihuolto, akku, vetokoukku,
   nelipyöräsuuntaus, rengashotelli, hybridit/sähköautot), missing car makes,
   whether the tyre brands are only Falken/Nexen/Pirelli, the service area,
   and whether invoicing is accepted as a payment method. **Answers not
   received yet.**
2. **Google Business Profile is not created.** For a local workshop this is
   the single largest visibility lever — bigger than anything on the page —
   and it needs a verified address. Not started.
3. Real search queries are unknown. Google Trends is **blocked from the
   sandbox** (`trends.google.*` → connection refused); the keyword list given
   to the customer is reasoned, not measured. Use Search Console once the site
   has been indexed a few weeks.

## Next check

**29.07.2026** — chase the registrar by phone if the reply is an
acknowledgement rather than a reason.
