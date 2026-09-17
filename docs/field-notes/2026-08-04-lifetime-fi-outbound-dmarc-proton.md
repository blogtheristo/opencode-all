# Field Note — lifetime.fi Outbound Was Failing Its Own DMARC Policy

- **Date:** 2026-08-04
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/lifetime-fi-proton-outbound-dmarc`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — mail infrastructure; triggered by a question about adding a Cloudflare contact form to lifetime.fi
- **Confidence:** High. Read directly from the `lifetime.fi` zone export (2026-08-04) and the Proton Business address list, both HIC-supplied. The one thing **not** measured is actual deliverability — see §6.

## Ontology Tags

- **Geography:** Europe > Finland > Espoo
- **Sector:** Internal infrastructure > Email authentication (SPF / DKIM / DMARC)
- **Entities:** `lifetime.fi`, Proton Business, Google Workspace, Cloudflare DNS, `CLAUDE.md` Sender Identity Rule, `DWS_TRUTH_STANDARD.md` §0
- **Temporal Context:** 2026-Q3

---

## 1. What was asked, and what turned up instead

The question was operational: *can lifetime.fi have a Cloudflare-based contact form like cari.fi, keep Proton as the primary MX, and still use Google Meet and Calendar?*

Answering it required reading the zone. The zone answered a different and more urgent question first.

## 2. The finding

`lifetime.fi` zone export, 2026-08-04:

| Record | Value |
| --- | --- |
| MX | `10 mail.protonmail.ch` · `20 mailsec.protonmail.ch` |
| SPF | `v=spf1 include:_spf.protonmail.ch ~all` |
| DKIM | `protonmail._domainkey` · `protonmail2._domainkey` · `protonmail3._domainkey` (all → Proton) |
| DMARC | `v=DMARC1; p=quarantine` |

**The domain authorizes exactly one sender: Proton.** There is no `include:_spf.google.com`. There is no `google._domainkey`. And the policy is not the permissive `p=none` — it is `p=quarantine`, an enforcing policy.

Against that, `docs/field-notes/2026-07-26-pr-backlog-orchestration-cleanup.md` §"GWS check" recorded that outbound to partners and investors (KTH Törngren, LUT Smolander, investor Würl) was being sent **from Gmail** as `risto.paarni2024@lifetime.fi`.

Mail sent from Google's servers with a `@lifetime.fi` From therefore fails SPF (Google's IPs are not in Proton's include) and fails DKIM alignment (no Google key is published). DMARC needs one of the two to pass **and** align. Neither does. The domain's own published policy tells every receiver to quarantine those messages.

**The highest-stakes correspondence the company sends was the correspondence instructed into spam folders**, by the domain's own records.

## 3. The second-order problem: nobody could have noticed

The DMARC record has **no `rua=`**. An enforcing policy was running with no reporting address, so no aggregate report was ever delivered to anyone. The failure had no observer — which is why it survived a rule change that was specifically about which address to send from.

## 4. Why the 2026-07-26 rule got it backwards

On 2026-07-26 the Sender Identity Rule was changed by HIC decision to **promote** `risto.paarni2024@` to a legitimate outbound address, on this evidence:

> *"a Google Workspace check confirmed it is the address current outbound actually originates from — `risto.paarni@` had no send in the prior year."*

The observation was accurate. The inference was not, for one reason: **the check was performed from inside a single mailbox, and never looked at DNS or at the Proton account.** From inside Gmail, "this address sends" is what you see. From the zone, "this address is not authorized to send" is what you see. Both were true simultaneously.

The HIC has now confirmed (2026-08-04) that **Proton has handled all Lifetime Oy outbound for several years**, and the Proton Business account list shows `risto.paarni@lifetime.fi` as a live address on it. So the address the 07-26 rule demoted is the one that passes DMARC today, and the address it promoted is the one that fails.

**This is a worked example of `DWS_TRUTH_STANDARD.md` §0.** A HIC decision is Tier A *for the decision itself* — but a Tier A decision resting on an unverified premise inherits the premise's tier, not its own. Nothing in the 07-26 entry was dishonest or careless; it simply answered "where does mail originate" with a one-system answer to a two-system question.

## 5. Decisions taken (HIC, 2026-08-04)

1. **Outbound stays where it already is: Proton.** `risto.paarni@lifetime.fi` is the primary sender for all Lifetime Oy mail. No DNS change is required for this — the records already authorize it.
2. **`risto.paarni2024@lifetime.fi` reverts to a Google Workspace login only.** Never a `From:`, `Reply-To:`, or signature contact.
3. **Google Workspace stays** for Calendar, Meet, Drive, Docs and the Google Cloud / Supabase / billing IAM identity. Gmail's service status is irrelevant to mail flow and does not need to be switched off — MX already decides delivery.
4. **Customer domains are out of scope.** `cari.fi` runs on Google Workspace with a Cloudflare Email Sending binding and stays that way. Do not consolidate a customer's mail onto Lifetime's Proton account.

## 6. What is fixed, what is open

**Fixed in this change:** `CLAUDE.md` Sender Identity Rule rewritten with the DNS evidence inline, so the next reader gets the reason and not just the instruction. The Productivity Stack Rule (HIC, 03.08.2026) said *"mail means Gmail on that Workspace account"* — corrected in the same pass, since leaving two rules in contradiction is a Rule 7 violation regardless of which one is right.

**Open — recommended, in order:**

1. **Add `rua` to DMARC.** `v=DMARC1; p=quarantine; rua=mailto:risto.paarni@lifetime.fi`. An enforcing policy with no reporting address is how this went unseen for a year; adding it costs one record.
2. **Check the other Proton-hosted domains for the same gap.** The Proton account also holds addresses on `onelifetime.world`, `dws10.com`, `dws6.com` and `lifetimeconsulting.eu`. Whether each of those zones authorizes Proton in SPF and publishes Proton DKIM has **not** been verified here. `risto@onelifetime.world` in particular is the canonical DWS IQ product sender — if that zone has the mirror-image problem, product mail is affected.
3. **Cloudflare Email Sending for the lifetime.fi form** — ordering matters more here than it did on cari.fi. cari.fi ran `p=none`, so an unaligned form sender degraded quietly; lifetime.fi runs `p=quarantine`, so a form sender that is not properly onboarded gets quarantined from its first message. Onboard the domain to Email Sending (records land under `cf-bounce.lifetime.fi`, root MX untouched) and confirm DKIM alignment **before** the form goes live.
4. **Never enable Email Routing on `lifetime.fi`.** It replaces the zone's MX with Cloudflare's and cannot coexist with an external mail server. On cari.fi that risk was four aliases; here it is the company's entire partner and investor correspondence.

**Not measured:** actual deliverability. Whether a given message was quarantined depends on each receiver's enforcement, and some are lenient. The claim proven here is narrower and does not depend on that: *the domain publishes a policy instructing receivers to quarantine mail that Gmail's sending path cannot avoid triggering.* A concrete check is available if wanted — ask one recipient of a 2026 send to look in their spam folder.

## 7. Learning-loop steps (DWS_LEARNING_STANDARD five-step)

- **(1) KB entry** — N/A this note. The reusable lesson is not a new concept: it is `DWS_TRUTH_STANDARD.md` §0's Tier-A-on-an-unverified-premise case, and it is registered there as of the same session. Adding a second home for it would fork the rule.
- **(2) Field note** — this file. ✅
- **(3) `Learn/` HTML render** — N/A. Internal infrastructure note with no external reader; `Learn/` is for artifacts a human reads outside the repo.
- **(4) Drive export** — N/A for the same reason. Repo is source of truth (§2E) and this note has no audience outside it.
- **(5) HIC question** — below. ✅

## 8. HIC question

The `rua` address needs to be somewhere that is actually read. `risto.paarni@lifetime.fi` lands in the Proton mailbox alongside everything else, and DMARC aggregate reports are daily XML attachments from every major receiver — high volume, low readability, easy to start ignoring within a week.

**Do you want the reports going to `risto.paarni@lifetime.fi` directly, or to a dedicated address (e.g. `dmarc@lifetime.fi` as another Proton alias) so they can be filtered away from real mail and reviewed deliberately?**

The second is the one I would pick — a report stream that annoys you is a report stream you will mute, and muting it recreates exactly the blind spot this note exists to close. But it is one more address to remember, and that is your call, not mine.
