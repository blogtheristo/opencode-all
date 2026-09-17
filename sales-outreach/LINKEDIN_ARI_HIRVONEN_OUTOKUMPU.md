<!--
VERSION AND AGENT HISTORY
Document: LINKEDIN_ARI_HIRVONEN_OUTOKUMPU.md
Version: 1.0
Last-Updated: 2026-05-18
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Purpose: Short-form LinkedIn message variants for Ari Hirvonen (Patent IP
         Director, Outokumpu Oyj). Connect message, post-acceptance DM,
         follow-up nudges, and a re-engagement variant. All messages are
         under LinkedIn's character ceilings (300 for connect notes,
         shorter is better for DMs).
Introduced-In: PR-pending (branch claude/dws-compliance-sales-rz5He)
Code-Version: 1.0
Branch: claude/dws-compliance-sales-rz5He
Date: 2026-05-18
Owner: risto.paarni@lifetime.fi
Recipient: Ari Hirvonen, Patent IP Director, Outokumpu Oyj
-->

# LinkedIn Messages: Ari Hirvonen (Patent IP Director, Outokumpu Oyj)

Short-form variants. Pair with `INTRO_ARI_HIRVONEN_OUTOKUMPU.md` (strategy) and `LETTER_ARI_HIRVONEN_OUTOKUMPU.md` (cold email). LinkedIn-first; email as fallback after 5 business days of silence.

---

## 1. Connect message (≤ 300 characters)

> Hei Ari — Risto Päärni, Lifetime Oy (Espoo). Every CBAM/EPD doc your sales attaches to a quote is a published technical disclosure that reads on process IP — and today the IP function isn't in that loop. We close it. 20 min at Salmisaarenranta?

**Character count:** 282 / 300. Within LinkedIn ceiling.

---

## 2. Post-acceptance DM (send within 24h of him accepting)

> Thanks for connecting, Ari.
>
> One line: DWS Intelligence amplifies human intelligence in regulated industries. For Outokumpu concretely — we help sales sell more by removing compliance friction before the sale, using KYA-governed disclosure logic and sovereign NVIDIA infra to make regulated deals easier to close and the IP moat stronger.
>
> Anonymized sector reference if useful: dws10.com/sovereign-cbam-disclosure/
>
> Worth 20 min at Salmisaarenranta? Week of 1 June or 8 June.
>
> — Risto

**Notes:**
- Sends right after he accepts the connect, while the wedge is fresh.
- Master tagline first (intelligence amplifier), Boardy line second (the buyer concretion).
- One URL only — the anonymized sector reference. No attachment, no calendar wall.
- Pure ask: 20 min, two specific weeks.

---

## 3. Follow-up nudge (Day 7, no reply to post-acceptance DM)

> Ari, brief one: take any Forta or Circle Green tender to a European OEM in the last 12 months. The CBAM / Scope 3 doc that went out with it — was your office asked to sign off on the level of process detail before it left? If "no, because it goes through sustainability," that is the 20 min I'm asking for. — Risto

**Notes:**
- Concrete and falsifiable. Forces him to either say "yes we are in the loop" (in which case we ask how) or admit the gap.
- No new URL, no new ask. Same 20 min.

---

## 4. Follow-up nudge (Day 14, still no reply)

> Ari — last bump from me. Q3 2026 CBAM definitive declarations land in 12 weeks. After that the disclosure-as-IP gap is harder to close retroactively. Happy to come to Salmisaarenranta with one Outokumpu product line modelled end-to-end, 20 min, your choice of date. If now's not the time, fully understood — I'll re-route to your CSO. — Risto

**Notes:**
- Time-anchor (Q3 CBAM landing) creates real urgency without manufactured pressure.
- "Will re-route to CSO" signals we are going to engage Outokumpu regardless. Gives Ari the choice to stay in the loop as sponsor or let it go around him. Most IP Directors will not let it go around them.

---

## 5. Re-engagement (90 days after silence, after first CBAM definitive declaration window)

> Ari — circling back. First CBAM definitive declaration window closed last month. Curious: did the level of process detail Outokumpu published surprise the IP office? In our work with other EU industrials it usually has. Same 20 min still open. — Risto

**Notes:**
- Reopens with a real-world data point Ari now has lived experience of.
- Curiosity-framed, not pitch-framed. Lets him answer freely.

---

## 6. Post-call thank-you (send within 4 hours of first meeting)

> Ari — thanks for the time. Quick recap of what we agreed:
>
> 1. You will share the product line for the worked example (Forta / Circle Green / long products).
> 2. We will model the CBAM disclosure end-to-end with the IP-policy lever applied at field level, KYA-attested.
> 3. Three-party motion: bring [name] (CSO) and [name] (CRO or Head of Sales Eng) into a 30-min follow-up to align on a pilot scope.
>
> One-pager modelled on a public Forta product line attached. No customer data used; all signals are public.
>
> Best — Risto

**Notes:**
- Document the three commitments in writing within 4 hours. Fastest path to a second meeting.
- Attach the cycle-time benchmark one-pager (`CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md` once produced) only if Ari named that line in the meeting.

---

## Sending mechanics

- **Channel:** LinkedIn direct message from `risto.paarni@lifetime.fi` LinkedIn profile (Risto Anton Päärni, Founder & CEO Lifetime Oy).
- **Cadence:** Connect → 24h → post-accept DM → Day 7 → Day 14 → Day 90.
- **Parallel email:** after Day 5 of no connect-accept, send `LETTER_ARI_HIRVONEN_OUTOKUMPU.md` via Amazon SES SMTP. Do not double-channel on the same day — alternate.
- **Stop conditions:** clear "not interested" → unsubscribe and re-route to CSO; or successful meeting booked → stop nudges, switch to post-call thank-you flow.

## Compliance notes

- All messages comply with LinkedIn ToS (no automation, no scraping).
- Connect message is under 300 characters (LinkedIn ceiling).
- No tracking pixels, no shortened URLs.
- Sender identity is verified Founder & CEO; no impersonation.
- All URLs link to dws10.com pages owned by Lifetime Oy.
