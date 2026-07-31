# Keenon Partnership — Flip-to-Authorized Checklist

**Do not run any step until a signed Keenon distributor agreement exists.**
Until then the public page stays in "partnership in development" framing.

Related files:

- Live public page (in development): `dws10.com/lifetime-fleet/keenon/index.html`
  (+ mirror `landing-pages/dws10-com/lifetime-fleet/keenon/index.html`)
- Flip-ready page (authorized): `Lifetime Fleet/keenon-partner-page-AUTHORIZED-DRAFT.html`
- Outreach: `sales-outreach/LETTER_ANDREA_LI_KEENON_DISTRIBUTOR.md`
- Brief: `sales-outreach/KEENON_FLEET_FIT_BRIEF.md`

## On signature — one commit

1. Copy the authorized draft over **both** public locations:
   - → `dws10.com/lifetime-fleet/keenon/index.html`
   - → `landing-pages/dws10-com/lifetime-fleet/keenon/index.html`
2. In **both** `lifetime-fleet/index.html` files, swap the Keenon card badge:
   - `Partnership In Development` → `Authorized Distributor`
   - (optional) card colour tag `#f59e0b` → `#4a90e2` to match the blue theme.
3. Verify claims against `DWS_TRUTH_STANDARD.md`; run `/truth-check` on the page.
4. Confirm the two public files are byte-identical to their mirrors before commit
   (dual-folder sync rule).
5. Commit + push; merge to `main` publishes via Cloudflare Pages.

## Before signature — nothing publishes

`dws10.com` auto-publishes on merge to `main`. The authorized draft lives in
`Lifetime Fleet/` (not a deployed site root), so it will **not** go live. The
public page keeps its visible "in development / subject to agreement" note.

---

## No reply yet — next actions

The initial enquiry (via Ace Jing, European Division A) went unanswered — the
LinkedIn connection was still **pending ("Odottaa")**, so a DM could not be
delivered. We now have the right owner: **Andrea Li — Senior Sales Manager,
Nordic Region**. Re-aim at her and work the reachable channels:

1. **LinkedIn to Andrea Li** — she owns the Nordic region. She shows as
   3rd-degree, so send a connection request carrying Message 1, or an InMail.
   (See `sales-outreach/LETTER_ANDREA_LI_KEENON_DISTRIBUTOR.md`.)
2. **Keenon Nordic/EU distributor intake form / email** — send the email version
   from the letter (verify Andrea's address first). Independent of any accept.
3. **Escalation:** Ace Jing (European Division A) as a fallback or CC once a
   thread opens.
4. **Bump after 7 business days** — short nudge below.

### Follow-up nudge (LinkedIn or email, after ~1 week of silence)

> Hi Andrea — following up on my note about Lifetime Fleet becoming Keenon's
> Nordic distributor and operating partner. We're scoping our H2 robot-fleet
> rollout now and want Keenon in it as the hardware line. Even 15 minutes to
> scope Nordic distributor terms would help. Thanks — Risto

### If still no reply after the bump

- Escalate to Ace Jing (European Division A), or Keenon's general EU/partnerships
  contact.
- Check for a Keenon distributor application form on keenonrobotics.com and
  submit the brief through it.
- Consider a warm intro: the Ace Jing profile showed shared connections
  (Mikael, Anri + 4 others) — ask one for an intro into Keenon.
