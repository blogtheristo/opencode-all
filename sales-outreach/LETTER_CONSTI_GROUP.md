<!--
VERSION AND AGENT HISTORY
Document: LETTER_CONSTI_GROUP.md
Version: 1.0
Last-Updated: 2026-06-17
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-fable-5)
Branch: claude/sales-outreach-2-7uro90
Purpose: Cold email to Esa Korkeela (CEO) or ESG Director at Consti Group Oyj.
         Wedge: EPBD-driven renovation demand + CSRD Wave 1 reporting burden = dual
         pressure that DWS IQ 6 resolves. Primary subject line references EPBD
         because it is Consti's core business trigger.
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4 — no Resend)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
Recipient: [VERIFY email] — Consti Group executive email pattern likely
           firstname.lastname@consti.fi — confirm via Consti investor relations
           or LinkedIn "Contact info" before sending
-->

# Cold Email — Consti Group / Esa Korkeela

**To:** esa.korkeela@consti.fi _(verify before send — check consti.fi investor relations)_
**From:** risto.paarni@lifetime.fi
**Subject options (A/B test — pick one):**

- A: `Consti + EPBD + CSRD — raportointityö 60 h → 8 h`
- B: `Consti remonttipipeline: EPBD-toimijana CSRD-taakka on teille kaksinkertainen`
- C: `60 tuntia kuukaudessa CSRD-raportointiin — Kela sai sen 8:aan`

Suositus: **Subject A** — konkreettinen luku, ei hyperbolia.

---

## Versio 1 — Suomeksi (primääri)

Hei Esa,

Näin Constin 2025 vuosituloksesta, että renovointikysyntänne kasvaa juuri nyt — EPBD pakottaa kiinteistönomistajat tilaamaan energiaremontit, ja te teette ne. Mutta listatun yhtiön CSRD-raportointi tarkoittaa samaan aikaan, että Scope 1/2 -data täytyy kerätä kaikilta työmailta manuaalisesti.

Asiakkaamme Kela leikkasi tämän työn 60 tunnista 8 tuntiin kuukaudessa DWS IQ 6:lla — automaattinen datankeruu projekteiltanne, CSRD-raportti valmiina, ei manuaalityötä.

Kiinnostaako 15 min? Näytän miten Constin remonttipipelinen näyttäisi dashboardilla.

Terveisin,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## Versio 2 — Englanniksi (jos Esa vastaa englanniksi tai kontakti on kansainvälinen)

Hi Esa,

I noticed from Consti's 2025 results that EPBD is now directly driving your renovation order book — building owners subject to EPC upgrade mandates are your customers. That's a strong tailwind. The challenge: as a listed company under CSRD Wave 1, you also need project-level Scope 1/2 data collected and formatted from every renovation site.

Our customer Kela cut that compliance workload from 60 hours per month to 8 with DWS IQ 6 — automated data collection from project sites, CSRD report generated, no manual work.

Worth 15 minutes to show you how a renovation portfolio like Consti's looks in the dashboard?

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## LinkedIn DM variant (shorter, after connection accepted)

> Hei Esa,
>
> Constin ydinliiketoiminta on EPBD:n toteutus — teette remontit, jotka direktiivi vaatii. Mutta listatun yhtiön CSRD lisää projektikohtaisen datankeruun päälle. Kela leikkasi tämän 60 tunnista 8 tuntiin. Kiinnostaako 15 min demo?

---

## Send Mechanics

- **Transport:** Amazon SES SMTP — `src/services/email.service.ts`
- **Sender:** `risto.paarni@lifetime.fi` — not `noreply@`
- **Recipient verify:** Consti Group email pattern is typically `firstname.lastname@consti.fi`.
  Confirm Esa Korkeela's address via:
  1. Consti investor relations page (contact section)
  2. LinkedIn "Contact info" if visible
  3. If unverifiable: send via Consti Group website contact form with same body
- **Attachments first send:** NONE. If Esa replies and asks for more detail, send `investor-outreach/INVESTOR_MEMO_ONE_PAGER.md`
- **Timing:** Send Tuesday or Wednesday, 08:00–09:30 Finnish time (highest open rates in B2B)
- **Follow-up rule:** One follow-up email max (Day 14), then silence. Two touches total per NORDIC_SALES_STRATEGY.md rules.

## When to Use Which Version

| Situation                                           | Use                                                      |
| --------------------------------------------------- | -------------------------------------------------------- |
| True cold email, no prior LinkedIn contact          | Version 1 (Finnish) or Version 2 (English) — full letter |
| After LinkedIn DM sent, no reply after 5 days       | Full letter version (whichever language)                 |
| After LinkedIn connection accepted and chat started | LinkedIn DM variant only — shorter                       |
| After first call follow-up                          | Draft a new custom note — do not reuse this template     |
