<!--
VERSION AND AGENT HISTORY
Document: LETTER_ARI_HIRVONEN_OUTOKUMPU_SHORT.md
Version: 1.0
Last-Updated: 2026-05-25
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Purpose: Short variant of the Ari Hirvonen / Outokumpu outreach.
         ~80 words. States the wedge and the number in one paragraph,
         asks for a pilot-scoping conversation. Companion to the
         longer LETTER_ARI_HIRVONEN_OUTOKUMPU.md (cold opener, ~350
         words). Use this when prior context exists (post-LinkedIn
         connect, post-prior-meeting, post-warm-intro) — the opener
         "On the Outokumpu motion" assumes Ari knows DWS is talking
         about this.
Branch: claude/exa-openclaw-integration-YnDpO
Date: 2026-05-25
Owner: risto.paarni@lifetime.fi
Recipient: Ari Hirvonen, Patent IP Director, Outokumpu Oyj
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
-->

# Short Variant — Ari Hirvonen (Outokumpu)

**To:** ari.hirvonen@outokumpu.com *(verify before send)*
**From:** risto.paarni@lifetime.fi
**Subject options:**
- *On the Outokumpu motion* — short, matches body opener
- *Outokumpu motion — pilot scoping?* — adds the ask to the subject
- *Forta tenders: 2–6 weeks → under 2 minutes per disclosure* — leads with the number

---

Hi Ari,

On the Outokumpu motion, the wedge is simple: Forta tenders currently leak CBAM, EPD, and Scope-3 disclosures without IP review, which can expose scrap ratio, energy mix, recipe, and source country to competitors. The win is to compress that disclosure cycle from 2 to 6 weeks down to under 2 minutes per disclosure, and reclaim roughly 240 to 480 sales-engineering hours per rep each year.

If that lines up with how you see the process, I'd like to map the first pilot path with you.

Best,
Risto

---

**Risto Anton Päärni**
Founder & CEO, Lifetime Oy
risto.paarni@lifetime.fi
https://dws10.com

---

## Send mechanics

- **Transport:** Amazon SES SMTP only (per `CLAUDE.md` non-negotiable rule #4 — no Resend).
- **Sender:** `risto.paarni@lifetime.fi` — never `noreply@` (rule #3).
- **Recipient verification before send:** confirm `ari.hirvonen@outokumpu.com` against Outokumpu's published IP-function contact (LinkedIn confirms title; corporate site or IP/Legal department contact form confirms email pattern). If unverifiable, route via Outokumpu IP/Legal department contact form with the same body.
- **Attachments on first send:** none. If Ari has not had any prior DWS context, send `LETTER_ARI_HIRVONEN_OUTOKUMPU.md` (the longer cold opener) instead — this short variant assumes some prior touchpoint.

## When to use this vs. the longer letter

| Situation | Use |
|---|---|
| No prior contact, true cold outreach | `LETTER_ARI_HIRVONEN_OUTOKUMPU.md` (long version, ~350 words) — sets up wedge from scratch |
| After LinkedIn connect accepted, no reply to first message | This file (short, ~80 words) — assumes Ari has seen the connect message context |
| After a warm intro from a mutual contact | This file — shorter is more respectful of warm-intro context |
| Post-first-call follow-up | The "tender-deadline" variant in `INTRO_ARI_HIRVONEN_OUTOKUMPU.md` §Thread step 3 |

## Protocol note

The original `INTRO_ARI_HIRVONEN_OUTOKUMPU.md` thread plan was: (1) LinkedIn connect first, (2) cold email after 5 days no reply, (3) tender-deadline bump after first reply. If you are sending this short variant cold (no prior LinkedIn connect), you are deviating from that plan — fine if intentional; flag if not.
