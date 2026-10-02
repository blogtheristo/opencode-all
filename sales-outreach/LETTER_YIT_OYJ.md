<!--
VERSION AND AGENT HISTORY
Document: LETTER_YIT_OYJ.md
Version: 1.0
Last-Updated: 2026-09-28
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-sonnet-4-6)
Branch: claude/sales-outreach-2-7uro90
Purpose: Cold email to Antti Inkilä (CEO) at YIT Oyj.
         Wedge: Finland's largest construction company has dual CSRD exposure —
         Scope 1 from construction machinery AND EPC data for developments sold
         to building owners. One platform automates both. Post-restructuring
         cost efficiency frame lands well.
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4 — no Resend)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
Recipient: antti.inkila@yit.fi *(verify — yit.fi investor relations or LinkedIn)*
-->

# Cold Email — YIT Oyj / Antti Inkilä

**To:** antti.inkila@yit.fi _(verify before send — check yit.fi/en/investors or LinkedIn)_
**From:** risto.paarni@lifetime.fi
**Subject options (A/B test — pick one):**

- A: `YIT CSRD Wave 1 — kaksi datavirtaa automaattisesti`
- B: `YIT: rakennuttajan CSRD-ongelma on kaksinkertainen — ja ratkaistava nyt`
- C: `Scope 1 rakentamisesta + EPC myynneistä — YIT:lle yksi automaattinen raportti`

Suositus: **Subject A** — konkreettinen ja nopea. Subject C on teknisempi mutta toimii jos Antti on jo tuttu CSRD:n kanssa.

---

## Versio 1 — Suomeksi (primääri)

Hei Antti,

Näin YIT:n 2024 CSRD-raportin julkaisusta, että olette jo listatun yhtiön velvoitteiden parissa — hyvä. Teillä on kuitenkin harvinaisempi tilanne kuin useimmilla rakennusalan toimijoilla: rakennuttajana YIT raportoi sekä oman rakentamisen Scope 1/2 -päästöt että myytyjen kohteiden EPC-datan. Kaksi erillistä manuaaliprosessia.

DWS IQ 6 yhdistää nämä: automaattinen datankeruu projekteiltanne, CSRD-raportti valmiina, EPC-dashboardit myyntikohteiden ostajille. Ei manuaalityötä.

Kiinnostaako 15 min? Näytän miten YIT:n projektiportfolio näyttäisi.

Terveisin,
Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## Versio 2 — Englanniksi (if Antti responds in English or prefers it)

Hi Antti,

I noticed YIT published its first CSRD-compliant sustainability report under Wave 1 requirements — you're doing the right thing. You're also in a unique position in construction: as both a builder and a developer, YIT needs to report Scope 1/2 from construction operations AND track EPC performance data for developments sold to asset owners. That's two separate manual data chains.

DWS IQ 6 consolidates both: automated data collection across YIT's project portfolio, CSRD report generated, EPC dashboards for completed developments. No manual overhead.

Worth 15 minutes to show you how YIT's portfolio would look in the platform?

Best,
Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## LinkedIn DM variant (after connection accepted)

> Hei Antti,
>
> YIT:llä on harvinainen CSRD-yhdistelmä: Scope 1 rakentamisesta ja EPC-data myyntikohteiden ostajille — kaksi manuaaliprosessia. DWS IQ 6 yhdistää nämä automaattisesti. Kiinnostaako 15 min?

---

## Send Mechanics

- **Transport:** Amazon SES SMTP — `src/services/email.service.ts`
- **Sender:** `risto.paarni@lifetime.fi`
- **Recipient verify:** YIT is a listed company — check yit.fi/en/investors for Antti Inkilä's
  listed contact. Pattern likely `firstname.lastname@yit.fi`
- **Attachments first send:** NONE
- **Timing:** Tuesday or Wednesday, 08:00–09:30 Finnish time
- **Follow-up rule:** One follow-up max (Day 14), then silence per NORDIC_SALES_STRATEGY.md

## Follow-Up Angle (Day 14, if no reply)

> Hei Antti,
>
> Palaan yhden kerran: EPBD:n EPC-vaatimus kiristää — YIT:n kehityskohteissa ostajat alkavat vaatia EPC-dataa due diligencessa. DWS IQ 6 tuottaa tämän automaattisesti. Kiinnostaako?

## Escalation Path if Antti is Unresponsive

After 14 days:

1. Identify YIT's Head of Sustainability or ESG Director (2025 Annual Report sustainability section)
2. Send second-track cold email (new file: `LETTER_YIT_OYJ_ESG.md`)
3. Reference Antti: "Olen yrittänyt tavoittaa Anttia — teillä on kaksi CSRD-datavirtaa joihin olemme erikoistuneet"
4. Max 2 touches to ESG contact, then mark "silent — revisit H1 2027 at results season"
