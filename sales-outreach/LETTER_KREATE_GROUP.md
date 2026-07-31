<!--
VERSION AND AGENT HISTORY
Document: LETTER_KREATE_GROUP.md
Version: 1.0
Last-Updated: 2026-06-17
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-fable-5)
Branch: claude/sales-outreach-2-7uro90
Purpose: Cold email to Timo Repo (CEO) at Kreate Group Oyj.
         Wedge: Listed company, CSRD Wave 1 active (already paying for compliance),
         both HQ in Espoo — local connection. Tier C "stable": the next margin
         point comes from operational efficiency, not new contracts. DWS IQ 6
         reduces compliance cost and adds SPI/CPI portfolio visibility.
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4 — no Resend)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
Recipient: timo.repo@kreate.fi *(verify — Kreate investor relations or LinkedIn)*
-->

# Cold Email — Kreate Group / Timo Repo

**To:** timo.repo@kreate.fi _(verify before send — check kreate.fi investor relations)_
**From:** risto.paarni@lifetime.fi
**Subject options (A/B test — pick one):**

- A: `Kreate CSRD-raportointi — 60 h → 8 h kuukaudessa`
- B: `Kreate + DWS IQ 6 — sama Espoo, eri ongelma`
- C: `Kreaten CSRD Wave 1 on jo tuotannossa — onko raportointi automaattista?`

Suositus: **Subject C** — kysymysmuoto, aktivoi uteliaisuuden ilman myyntipainetta. Subject B on luovempi mutta saattaa tuntua liian tutulta kylmässä viestissä.

---

## Versio 1 — Suomeksi (primääri)

Hei Timo,

Näin Kreaten 2025 vuosikatsauksesta, että CSRD-raportointi on jo käynnissä listatun yhtiön velvoitteena — te olette jo oikealla polulla. Kysymys on, paljonko se nyt maksaa: monilla asiakkaillamme (Kela, T2H, NCC-pilotti) CSRD-datankeruu projekteiltaan vei 60 tuntia kuukaudessa manuaalisesti.

DWS IQ 6 leikkaa sen 8 tuntiin — automaattinen Scope 1/2 -data Kreaten projekteiltanne, raportti valmiina, ei manuaalityötä. Ja ollaan molemmat Espoosta.

Kiinnostaako 15 min? Näytän miten Kreaten infraportfolio näyttäisi dashboardilla.

Terveisin,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## Versio 2 — Englanniksi (if Timo responds in English or prefers it)

Hi Timo,

I noticed from Kreate's 2025 annual review that CSRD reporting is already active — you're doing the right thing as a listed company. The question is what it costs: our customers at Kela, T2H, and NCC pilots were spending 60+ hours per month collecting Scope 1/2 data from project sites manually.

DWS IQ 6 cuts that to 8 hours — automated data collection from Kreate's project portfolio, CSRD report generated, no manual work. We're also both based in Espoo, which is a start.

Worth 15 minutes to show you how Kreate's infrastructure portfolio would look in the dashboard?

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## LinkedIn DM variant (after connection accepted)

> Hei Timo,
>
> Kreate ja Lifetime Oy — molemmat Espoosta, molemmat infrassa. Näin Kreaten CSRD-raportoinnin olevan jo käynnissä. Monilla asiakkaillamme se vei 60 h/kk manuaalisesti — leikattiin 8:aan automaattisesti. Kiinnostaako 15 min demo?

---

## Send Mechanics

- **Transport:** Amazon SES SMTP — `src/services/email.service.ts`
- **Sender:** `risto.paarni@lifetime.fi`
- **Recipient verify:** Kreate is a listed company — check https://www.kreate.fi/en/investors/
  for Timo Repo's listed contact, or confirm email via LinkedIn "Contact info"
  Email pattern likely `firstname.lastname@kreate.fi`
- **Attachments first send:** NONE. If reply received and they ask for more, send the one-pager.
- **Timing:** Tuesday or Wednesday, 08:00–09:30 Finnish time
- **Follow-up rule:** One follow-up max (Day 14) — then silence per NORDIC_SALES_STRATEGY.md

## When to Use the Local (Espoo) Hook

The "molemmat Espoosta" (both from Espoo) reference is genuine — use it:

- In the email body (briefly — one sentence max)
- In the LinkedIn DM (stronger here — more personal context appropriate)
- Do NOT use it as the email subject line (too casual for cold outreach to a CEO)
- Do NOT fabricate proximity claims — this hook only works because it is true

## Escalation Path if Timo is Unresponsive

After 14 days without reply:

1. Identify Kreate's Head of Sustainability / ESG contact from the 2025 Annual Report sustainability section
2. Send a second-track cold email to that person (new file: `LETTER_KREATE_GROUP_ESG.md`)
3. Reference Timo Repo in that letter: "Olen yrittänyt tavoittaa Timoa — ajattelin että voitte olla oikea henkilö"
4. Max 2 touches to ESG contact as well, then mark as "silent — revisit H2 2026"
