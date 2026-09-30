<!--
VERSION AND AGENT HISTORY
Document: LETTER_SRV_YHTIOT.md
Version: 1.0
Last-Updated: 2026-09-28
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-sonnet-4-6)
Branch: claude/sales-outreach-2-7uro90
Purpose: Cold email to Santtu Laitinen (CEO) at SRV Yhtiöt Oyj.
         Wedge: CSRD Wave 1 mandatory for listed company + recovery from loss
         years = cost efficiency framing. EPBD commercial buyer pressure adds
         second data requirement. Both HQ in Espoo — local hook available.
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4 — no Resend)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
Recipient: santtu.laitinen@srv.fi *(verify — srv.fi investor relations or LinkedIn)*
-->

# Cold Email — SRV Yhtiöt Oyj / Santtu Laitinen

**To:** santtu.laitinen@srv.fi _(verify before send — check srv.fi/en/investors or LinkedIn)_
**From:** risto.paarni@lifetime.fi
**Subject options (A/B test — pick one):**

- A: `SRV CSRD Wave 1 — raportointityö 60 h → 8 h kuukaudessa`
- B: `SRV:n kustannustehokkuus ja CSRD — automatisoiko nyt kun tulos on kääntynyt?`
- C: `CSRD-raportointi automaattisesti SRV:lle — molemmat Espoosta`

Suositus: **Subject A** — konkreettinen luku, ei oleta kontekstia. Subject B toimii jos Santtu on jo aktiivinen kustannustehokkuuden viestijä. Subject C vain LinkedIn DM:ssä, liian tuttavallinen kylmässä viestissä.

---

## Versio 1 — Suomeksi (primääri)

Hei Santtu,

Näin SRV:n tuloksen kääntyneen takaisin positiiviseksi — hyvä. Listatun yhtiön CSRD Wave 1 on nyt pakollinen, ja juuri recovery-vaiheessa se tuntuu eniten: Scope 1/2 -data kerätään projekteiltanne manuaalisesti, yleensä 60+ tuntia kuukaudessa.

DWS IQ 6 leikkaa sen 8 tuntiin — automaattinen datankeruu työmailta, CSRD-raportti valmiina. Molemmat Espoosta, jos se helpottaa ensimmäistä tapaamista.

Kiinnostaako 15 min?

Terveisin,
Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## Versio 2 — Englanniksi (if Santtu responds in English or prefers it)

Hi Santtu,

I noticed SRV's results have turned back to positive — well done. As a listed company, CSRD Wave 1 is now mandatory, and the compliance data workload arrives right when operational efficiency matters most: Scope 1/2 data from project sites, typically 60+ hours per month of manual collection.

DWS IQ 6 cuts that to 8 hours — automated data from sites, CSRD report generated. We're also both based in Espoo, if that makes a first conversation easier.

Worth 15 minutes?

Best,
Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## LinkedIn DM variant (after connection accepted)

> Hei Santtu,
>
> Kiitos yhteydestä. SRV + Lifetime Oy — molemmat Espoosta. Näin teidän CSRD Wave 1 -velvoitteen olevan jo tuotannossa. Monilla asiakkaillamme se on tarkoittanut 60 h/kk manuaalityötä — leikkasimme sen 8:aan automaattisesti. Kiinnostaako 15 min demo?

---

## Send Mechanics

- **Transport:** Amazon SES SMTP — `src/services/email.service.ts`
- **Sender:** `risto.paarni@lifetime.fi`
- **Recipient verify:** SRV is a listed company — check srv.fi/en/investors for Santtu Laitinen's
  listed contact. Pattern likely `firstname.lastname@srv.fi`
- **Attachments first send:** NONE
- **Timing:** Tuesday or Wednesday, 08:00–09:30 Finnish time
- **Follow-up rule:** One follow-up max (Day 14), then silence per NORDIC_SALES_STRATEGY.md

## Local (Espoo) Hook Rules — Same as Kreate

Use "molemmat Espoosta" only:

- In LinkedIn DM (appropriate there)
- As one sentence in the email body (brief)
- NOT as the subject line (too casual for cold email to CEO)
- Only because it is true — do not fabricate proximity claims

## Escalation Path

After 14 days without reply:

1. Identify SRV Head of Sustainability / ESG contact (2025 Annual Report)
2. Send second-track cold email (new file: `LETTER_SRV_YHTIOT_ESG.md`)
3. Reference Santtu: "Olen yrittänyt tavoittaa Santtua — voitte olla oikea henkilö CSRD-automaation arviointiin"
4. Max 2 touches to ESG contact, then mark "silent — revisit at SRV H2 2026 results"
