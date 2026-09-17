# Field Note — Cari.fi: New Customer Site on Cloudflare, and Why the Nameservers Don't Exist Yet

- **Date:** 2026-07-26
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/cari-fi-new-site-x410ox`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — new customer onboarding (Carin Huoltopalvelu), domain + Cloudflare setup
- **Confidence:** High on process and constraints (verified against Cloudflare DNS docs, 2026-07-24 revision); the specific assigned nameserver pair is **not yet knowable** — see below.

## Ontology Tags

- **Geography:** Europe > Finland > Espoo
- **Sector:** SMB services > Automotive workshop (autokorjaamo ja autohuolto) > Web presence
- **Entities:** Carin Huoltopalvelu (Y-tunnus **3582356-8**; auto repair/maintenance, Jorvas FI — verified via Finder.fi 2026-07-26), `cari.fi`, Cloudflare (DNS + Pages), Traficom (.fi registry), `sales-outreach/TARJOUS_CARIN_HUOLTOPALVELU_VERKKOSIVUT_FI.md` v4.0
- **Temporal Context:** 2026-Q3

---

## Customer of record

| Field | Value |
| --- | --- |
| Trade name | Carin Huoltopalvelu |
| Business ID (Y-tunnus) | **3582356-8** (verified via Finder.fi, 2026-07-26) |
| Line of business | Automotive workshop — auto repair & maintenance (*autokorjaamo ja autohuolto*), Jorvas, Finland |
| Domain | `cari.fi` |
| Site type | Single-page, bilingual (FI/EN), static HTML/CSS/JS |
| Source repository | **`github.com/blogtheristo/cari`** — the site has its own repo, separate from dws6/dws7 |
| Address | Kiilatie 15, rakennus 1, ovi 12, 02430 Jorvas, Kirkkonummi (owner-provided; YTJ still shows the old Kiilatie 12 B 12, 02420 Jorvas — **do not "correct" it back**) |
| Phone / WhatsApp | +358 400 744 214 |
| Product email | `huolto@cari.fi` (Google Workspace — to be provisioned) |
| Domain registrar | **hostingpalvelu.fi** — registered 26.07.2026, status **Pending** (see below) |
| Scale | All makes and models, petrol + diesel, vans and commercial vehicles; tyre sales. **Public positioning is "Personal Car Service"** — "one-person workshop" was rejected by the owner, since it fixes the business at its current headcount |
| Hosting | Cloudflare Pages (git-based deploy from `blogtheristo/cari`, **output directory `public`**, same model as `lifetime.fi`) |
| Product email | `huolto@cari.fi` (FI), `service@cari.fi` (EN), `rekry@cari.fi` (recruiting) — Google Workspace, **none provisioned yet**. Supersedes the `myynti@cari.fi` placeholder recorded on 07-26 |
| Contact until mail works | `cari.huoltopalvelu@gmail.com` · WhatsApp +358 400 744 214 (**the only verified channel**) |
| Commercial basis | Fixed **85 € incl. VAT** for the one-page build; domain + Workspace onboarding billed separately at 75 €/h + VAT (per proposal v4.0). Third-party recurring fees (domain, Workspace/user) are the customer's pass-through costs. |

This note supplies the **Y-tunnus (3582356-8)** that proposal v4.0 recorded as *"Ei Y-tunnusta tiedossa vielä"* — the last open blocker before an order confirmation on the domain/Workspace scope.

## The Story

"We create it under Cloudflare, give the nameserver information." The natural next step is to hand over the two Cloudflare nameservers so cari.fi can be pointed at them. The finding of this session is that **those two names do not exist yet, and there is no way to produce them ahead of time** — by Cloudflare's design, not by a tooling gap.

## The Insight — the nameservers are assigned, not chosen, and only at zone-creation time

Cloudflare's DNS documentation ("Nameserver options → Assignment method", last updated 2026-07-24) is explicit on two points that decide this task:

1. **Automatic assignment at add-time.** "When you add a domain on a primary (full) … DNS setup, Cloudflare automatically assigns your nameservers." You receive a pair — always two `*.ns.cloudflare.com` names (standard nameservers) — chosen by Cloudflare when the zone is created. You cannot pick them.
2. **You cannot preset them (anti-hijacking).** "To prevent domain hijacking, you can no longer preset Cloudflare nameservers at your registrar before creating the respective zone in Cloudflare. If you preset your nameservers and then add the domain, your domain will be assigned a **new** pair of nameservers." So even guessing a plausible pair and setting it at the registrar first is actively counter-productive — it guarantees a mismatch.

**Conclusion:** any specific nameserver values written into a document *before* cari.fi is added as a zone would be fabricated, and would be wrong even if they happened to be real Cloudflare names, because the account's actual assignment is generated at add-time. Per Rule 12 (Fail Loud) and "never fabricate data," this note records the **format and the exact retrieval procedure** instead of inventing a pair.

### Second constraint, already on record: .fi cannot be registered at Cloudflare

Proposal v4.0 already established (and it still holds): **Cloudflare Registrar does not support the `.fi` TLD.** So `cari.fi` must be registered/held at a `.fi`-capable registrar — a Traficom-accredited Finnish registrar. Cloudflare is used for **DNS + Pages only** (Full setup): the domain lives at the Finnish registrar, and its NS records are pointed at the Cloudflare pair. This is a "Full setup" zone, not a Cloudflare-registered domain.

## Domain registration — of record (owner-provided, 2026-07-28)

`cari.fi` **is paid for and registered** at **hostingpalvelu.fi** (a `.fi`-capable Finnish registrar — Cloudflare Registrar could not have held it).

| Field | Value |
| --- | --- |
| Domain | `cari.fi` |
| Registrar | hostingpalvelu.fi |
| Registration date | 26.07.2026 |
| First payment (ex. VAT) | 39,80 € |
| Recurring (ex. VAT) | 49,80 € / 2 years |
| Next due date | 26.07.2028 |
| Payment method | Verkkopankki |
| **Status** | **Pending** — escalated to registrar support 28.07.2026 20:57 |

### The Pending status is the current blocker — and it re-orders everything

The registrar panel states plainly: *"This domain is not currently active. Domains cannot be managed unless active."*

This is the second gate on the nameserver question, and it is **upstream of the Cloudflare one**. Earlier this note established that the Cloudflare NS pair does not exist until the zone is created. Now there is a step before even that: **the NS fields at the registrar are not editable while the domain is Pending.** A `.fi` registration goes through the Traficom registry, and `Pending` means that registry step has not completed. Nothing can be pointed anywhere yet.

So the sequence is fixed, and no step can be pulled forward:

1. **Wait for `Pending` → `Active`** at hostingpalvelu.fi (Traficom registry completes). *(Current state — nothing else is actionable.)*
2. **Then** add `cari.fi` to Cloudflare (**Full setup**), on the **same Cloudflare account as `lifetime.fi`** — Cloudflare favours consistent nameservers within an account, so this is what makes "same nameservers as lifetime.fi" likely rather than a coincidence.
3. **Then** read the assigned `*.ns.cloudflare.com` pair from cari.fi's own dashboard (use cari.fi's pair, not lifetime.fi's, if they differ).
4. **Then** set exactly those two at hostingpalvelu.fi → "Done, check nameservers" in Cloudflare.

**Do not attempt step 4 before step 2.** Presetting Cloudflare nameservers before the zone exists causes Cloudflare to assign a *different* pair (anti-hijacking) — so an early edit, once the panel unlocks, would actively break activation.

### Escalated — support ticket filed 28.07.2026 at 20:57

**A support request was filed with hostingpalvelu.fi on 28.07.2026 at 20:57**, after the domain had sat in `Pending` for two full days.

That escalation is correct, and waiting longer would not have been. A `.fi` registration normally activates within minutes to a few hours of the payment clearing — the Traficom registry is automated. Two days is outside that window by an order of magnitude, which means this is no longer "the registry is working on it"; something is stuck, and the stuck thing is on the registrar's side of the boundary. **The waiting posture only makes sense while the delay is plausible.** Once it stops being plausible, continuing to wait is not patience, it is an unreported failure — the exact shape of Rule 12 (fail loud).

What the escalation is actually asking for, in order of likelihood:

1. **Payment reconciliation.** Verkkopankki payments post asynchronously. If the payment did not get matched to the order, the registrar never submitted the registration to the registry at all, and no amount of waiting fixes it.
2. **A registry rejection that was never surfaced.** `.fi` registrations can be rejected at the registry (holder details, business-ID mismatch against YTJ). A rejected request can display as `Pending` in a reseller panel rather than as an error.
3. **A genuinely queued registry request** — in which case the answer is a timestamp, and the wait continues with an end in sight.

Case 2 is the one worth naming explicitly in the ticket, because it is the only one where the fix requires **us** to do something: the holder is **Carin Huoltopalvelu Tmi, Y-tunnus 3582356-8**, and if the registration was filed against a different holder name or an address that does not match the registry, it stays stuck until corrected. Ask the registrar to state which of the three cases applies rather than to "check the status".

**Nothing downstream moves until this resolves.** The Cloudflare zone, the nameserver pair, Google Workspace verification, the MX records, and therefore `huolto@`, `service@` and `rekry@` are all serialised behind `Pending → Active`. The site itself is finished and pushed; the domain is the whole critical path.

**Next check: 29.07.2026.** If there is no substantive reply — a reason, not an acknowledgement — within one business day, chase it by phone. If the registrar cannot resolve it, the fallback is to transfer the registration to another `.fi` registrar (Louhi, Domainkeskus, Zoner); the domain is paid for and the loss would be the fee, not the name.

### SSL fields at the registrar — ignore them

The panel's SSL rows (`SSL Status`, `SSL Issuer Name`, `SSL Expiry Date`) were all still `Loading...`. They are **not needed and should not be purchased**: once `cari.fi` is an active Cloudflare zone with the Pages custom domain attached, **Cloudflare issues and renews the certificate for free** (Universal SSL). Buying a registrar SSL for this site would be a duplicate cost with no benefit.

### Renewal is a 2-year cycle — worth a calendar entry

Next due **26.07.2028** at 49,80 € ex VAT, every 2 years. A two-year cycle is long enough that it will fall outside anyone's working memory; per the Script Automation Rule (no process that depends on human memory), this belongs in a calendar/reminder rather than in this note alone. **Not yet scheduled — flagged, not done.**

## Nameserver information — the actual deliverable

**What the nameservers will look like (format):**

```
<word>.ns.cloudflare.com
<word>.ns.cloudflare.com
```

Two "standard" nameservers, both under `ns.cloudflare.com`, e.g. the shape `aria.ns.cloudflare.com` / `rob.ns.cloudflare.com`. **The two words are assigned per-account at zone creation — the placeholders above are illustrative, not the real values.**

**How to obtain the real pair and activate cari.fi (order matters):**

1. **Register/confirm `cari.fi`** at a Traficom-accredited `.fi` registrar (Cloudflare Registrar can't hold `.fi`). Verify availability of `cari.fi` before the order confirmation.
2. **Add `cari.fi` to Cloudflare** → *Add site* → **Full setup** (primary DNS).
3. **Read the assigned pair** on the Cloudflare dashboard's *Get your nameservers* screen (DNS → Nameservers). These two `*.ns.cloudflare.com` names are cari.fi's real nameservers. **This is the point at which the nameserver information becomes real and shareable.**
4. **Set exactly those two nameservers** at the `.fi` registrar, replacing the registrar's defaults. Do not add a third; do not pre-enter them before step 2.
5. **Back in Cloudflare, click "Done, check nameservers."** Cloudflare polls and activates the zone once the registrar propagates (minutes to a few hours for `.fi`).
6. **Connect Cloudflare Pages:** in the Pages project, add `cari.fi` (and `www.cari.fi`) as a custom domain — Cloudflare creates the proxied records automatically once DNS is active.
7. **Google Workspace mail (`huolto@`, `service@`, `rekry@cari.fi`):** after activation, add the Workspace **MX**, **SPF** (`v=spf1 include:_spf.google.com ~all`), **DKIM** (from the Workspace admin console), and a **DMARC** record in Cloudflare DNS. Keep those DNS-only (grey cloud) — mail records must not be proxied.

> **Handoff line for the customer / registrar:** "cari.fi's nameservers will be two `*.ns.cloudflare.com` addresses that Cloudflare shows us only after we add the domain as a zone. I'll send the exact two names the moment the zone is created; please don't set any Cloudflare nameservers before then."

## Next Steps

- **Add `cari.fi` as a Cloudflare zone** (Full setup) → capture the assigned NS pair → record it in the customer file and send to the registrar. *(Needs Cloudflare dashboard access; not doable from this session's toolset — the Cloudflare MCP here covers Workers/D1/KV/R2 only, not DNS zones.)*
- **Confirm `cari.fi` availability + registrar** before order confirmation.
- **Update proposal `TARJOUS_CARIN_HUOLTOPALVELU_VERKKOSIVUT_FI.md`** to fill in Y-tunnus 3582356-8 (currently "ei tiedossa vielä") — keep the FI/EN pair and `_SHORT` variant in lockstep per the Document Standard.
- ~~**Stand up the Pages project**~~ — **DONE (2026-07-26).** `blogtheristo/cari` was added to the session and the single-page bilingual (FI/EN) site is committed and pushed to branch `claude/cari-fi-new-site-x410ox` (repo was empty, so this is its initial commit → currently the default branch). Files: `index.html` (self-contained, navy/amber automotive theme, `?lang`/localStorage FI-EN toggle, tel:/mailto: CTAs), `_headers` (CSP + security headers), `robots.txt`, `sitemap.xml`, `README.md`. Render verified in Chromium; 42/42 FI/EN parity.
  - **Placeholders flagged for owner confirmation before go-live:** service list, opening hours, prices (none shown by design), exact Jorvas address, and email (`cari.huoltopalvelu@gmail.com` now → `myynti@cari.fi` after Workspace).
  - **Remaining to connect Pages:** create the Cloudflare Pages project on `blogtheristo/cari` (build command: none; **output dir: `public`**), then attach `cari.fi` — which still needs the zone added + NS pointed (below).
  - **Superseded (2026-07-28):** the output directory was `/` above. It must **not** be the repo root — the root now holds `README.md` and `docs/` (customer address, registration pricing, escalation log), and Cloudflare Pages serves every file inside the output directory to anyone who requests its path. The site was moved to `public/`. Generalised as `kb/wiki/concepts/repo-as-publication-surface.md`. The leak was caught only because the domain was still blocked — an unrelated delay, not a control.
  - **Superseded (2026-07-28):** the placeholder email above (`myynti@cari.fi`) is retired. The addresses are **`huolto@`** (FI), **`service@`** (EN) and **`rekry@cari.fi`** (recruiting, Finnish page only). None of them exist yet.

### Learning-loop steps (DWS_LEARNING_STANDARD five-step)

Closed out 2026-07-28. The 07-26 pass left steps 1, 3 and 4 open; they are done here rather than left as a standing N/A.

- **(1) KB entry** — ✅ three articles. Two reusable concepts: `kb/wiki/concepts/repo-as-publication-surface.md` (output directory is a publication decision) and `kb/wiki/concepts/plausible-wait-window.md` (waiting on a third party is legitimate only inside their normal completion time). One entity: `kb/wiki/entities/carin-huoltopalvelu.md` — the confirmed facts and the settled decisions, so a later session does not re-derive or "correct" them. *(The 07-26 pass judged there was no reusable concept yet. That was true then; two emerged on 07-28.)*
- **(2) Field note** — this file. ✅
- **(3) `Learn/` HTML render** — ✅ `Learn/cari-fi-onboarding-v1.0-2026-07-28.html` via `scripts/render-doc.sh`. Note `pandoc` is **not** persisted in a fresh cloud container; it had to be installed first (`apt-get install -y pandoc`).
- **(4) Drive export** — ✅ Google Doc *"Field Note — cari.fi onboarding (Carin Huoltopalvelu) 2026-07-28"* in the Drive `dws6` folder (`docs.google.com/document/d/1zbVAvYiF32DFSIVE3_4SJVJISqSkv-JTFy2MC0wc_34`), content verified by reading it back after upload. The repo file remains source of truth; the Drive copy carries that statement in its own header so a reader who arrives via Drive cannot mistake it for the original. *(The 07-26 pass recorded this step as "N/A — not implemented in this container." That was **wrong**, not merely outdated: the Drive MCP could do it then too. Recorded here rather than quietly fixed, per Rule 12.)*
- **(5) HIC question** — below. ✅ The 07-26 question was answered; a new one is open.

## HIC questions

### Asked 2026-07-26 — answered

*The nameserver pair only becomes real once cari.fi is added as a Cloudflare zone, and that step needs dashboard/API access this session doesn't have. Do you want to (a) add the zone yourself and paste the two `*.ns.cloudflare.com` names back, or (b) provision a scoped Cloudflare DNS API token so a future session can create the zone programmatically?*

**Answer: moot for now — (a) by default.** The question assumed the blocker was Cloudflare access. It is not: the registrar has not activated the domain, so no zone can be created by anyone, with any token. The real gate moved upstream. Re-ask once the domain is `Active`.

### Asked 2026-07-28 — answered same day

*Google Business Profile is the largest single visibility lever for a local workshop, and address verification by post takes 1–2 weeks — so it could run in parallel with the domain rather than waiting for it. Create it in Kari's own Google account (he owns it, Lifetime Oy gets manager rights) or in a Lifetime-managed account (faster to start, ownership transferred later)?*

**Answer (HIC, 2026-07-28): Kari's own Google account**, created tomorrow or as soon as the domain activates. Lifetime Oy takes manager rights, not ownership. This is the right call — a transferred profile is friction later, and the customer owning his own listing is the correct end state regardless of who does the setup work.

### Open — for the next session

The launch gate says: do not publish until a test message to `huolto@cari.fi` arrives. But the domain has now been stuck for two days at the registrar with no committed resolution date, and the site is finished.

**If the registrar has still not resolved the domain by the end of this week, do we (a) keep the site unpublished until `cari.fi` works — clean, but the customer has nothing to show and the Google Business Profile verification clock cannot start; or (b) publish to the Cloudflare Pages `*.pages.dev` URL with the email addresses swapped for `cari.huoltopalvelu@gmail.com`, giving Kari a live link and an unbroken contact path now, then cut over to `cari.fi` when it activates?**

Option (b) makes the silent-bounce risk go away today but puts a temporary URL and a Gmail address in front of customers. This is a business call about what Kari can live with, not a technical one — which is why it is yours.

**Answer (HIC, 2026-07-28): neither yet — hold until the registrar replies tomorrow.** One more day is still inside a reasonable window now that the ticket is filed: the escalation changed the situation, and re-deciding before the reply arrives would be deciding without the one piece of information that was asked for. **The hold is explicitly bounded by that reply, not open-ended** — if 29.07 brings an acknowledgement instead of a reason, the plausible-wait window has closed a second time and this question comes back live, together with the phone chase and the transfer fallback.
