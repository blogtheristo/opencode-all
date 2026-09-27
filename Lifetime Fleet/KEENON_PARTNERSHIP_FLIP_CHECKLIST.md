# Keenon Partnership — Flip-to-Authorized Checklist

**Do not run any step until a signed Keenon distributor agreement exists.**
Until then the public page stays in "partnership in development" framing.

Related files:

- Live public page (in development): `dws10.com/lifetime-fleet/keenon/index.html`
  (+ mirror `landing-pages/dws10-com/lifetime-fleet/keenon/index.html`)
- Flip-ready page (authorized): `Lifetime Fleet/keenon-partner-page-AUTHORIZED-DRAFT.html`
- Cold outreach (pre-meeting): `sales-outreach/LETTER_ANDREA_LI_KEENON_DISTRIBUTOR.md`
- Brief: `sales-outreach/KEENON_FLEET_FIT_BRIEF.md`
- **Meeting record (Jul 2026):** `docs/partnerships/keenon-meeting-record-2026-07.md`
- **Post-meeting reply (draft):** `sales-outreach/LETTER_ANDREA_LI_KEENON_POST_MEETING_2026-07.md`
- **Technical questions to pre-sales:** `sales-outreach/KEENON_TECHNICAL_QUESTIONS_2026-07.md`

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

## State: intro meeting held (July 2026) — next actions

We connected with **Andrea Li — Senior Sales Manager, Nordic Region** and held an
intro meeting. Andrea shared the KEENON decks (company, senior living, cleaning,
retail, Q1 cases) and asked us to (1) say which models we want to test, (2) send
our sensor / API questions **in writing** for her pre-sales team, and (3) book a
technical follow-up. Full record: `docs/partnerships/keenon-meeting-record-2026-07.md`.

Live thread is on **`risto.paarni2024@lifetime.fi`** (partner sales outreach).

1. **Human review + send** the post-meeting reply
   (`sales-outreach/LETTER_ANDREA_LI_KEENON_POST_MEETING_2026-07.md`) via SES SMTP,
   attaching the technical questions
   (`sales-outreach/KEENON_TECHNICAL_QUESTIONS_2026-07.md`). Outbound email is
   RED-zone — a human sends it.
2. **Technical follow-up call** with Andrea + KEENON pre-sales to walk the answers.
3. On answers, scope **eval/loan units** (C40, T10, W3) + Nordic exclusivity and
   distributor/operating-partner terms.
4. **MNDA** if KEENON needs it to release SDK / interface specs
   (`Partners/NDA_TEMPLATE_EU_2026.md`).
5. **Escalation:** Ace Jing (European Division A) as CC/fallback if the thread stalls.

### Follow-up nudge (if no reply in ~5 business days)

> Hi Andrea — following up on my note with our model shortlist and the written
> questions for your pre-sales team. Happy to take the technical call whenever
> suits — I can offer two slots next week if that's easier. Thanks — Risto
