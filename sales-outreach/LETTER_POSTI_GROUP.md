<!--
VERSION AND AGENT HISTORY
Document: LETTER_POSTI_GROUP.md
Version: 1.0
Last-Updated: 2026-09-28
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-sonnet-4-6)
Branch: claude/sales-outreach-2-7uro90
Purpose: Cold email to Turkka Kuusisto (CEO) at Posti Group.
         Wedge: Fleet Scope 1 = mandatory CSRD + ETS2 direct cost from 2027.
         DWS IQ 6 is the measurement layer that makes electrification ROI visible
         before the cost lands. Opens logistics/transportation vertical.
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4 — no Resend)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
Recipient: turkka.kuusisto@posti.com *(verify — posti.fi/en/about or LinkedIn)*
-->

# Cold Email — Posti Group / Turkka Kuusisto

**To:** turkka.kuusisto@posti.com _(verify before send — check posti.fi/en/about/posti-group/management or LinkedIn)_
**From:** risto.paarni@lifetime.fi
**Subject options (A/B test — pick one):**

- A: `Postin laivasto + ETS2 2027 — dieselkustannus selviää, onko mittaristo valmis?`
- B: `CSRD-laivastoraportointi Postille — Scope 1 automaattisesti reittikohtaisesti`
- C: `ETS2 alkaa 2027 — Posti voi optimoida sähköistymisen ennen kuin kustannus iskee`

Suositus: **Subject A** — aktivoi ETS2-kiireellisyyden ilman myyntipainetta. Kysymysmuoto.

---

## Versio 1 — Suomeksi (primääri)

Hei Turkka,

Posti on sitoutunut laivaston sähköistämiseen — hyvä. ETS2 alkaa 2027: Postin dieselkalusto ylittää kynnysarvon ja jokaisesta tonnista CO₂ tulee suora kustannus. CSRD edellyttää jo nyt Scope 1 -raportoinnin reittikohtaisesti.

DWS IQ 6 on mittaristo, jolla Posti näkee missä reittikohtainen päästölasku on suurin — ja missä sähköistyminen maksaa itsensä takaisin nopeimmin ennen kuin ETS2-hinta iskee. Ei arviota: oikeaa dataa laivastosta.

Kiinnostaako 15 min?

Terveisin,
Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## Versio 2 — Englanniksi (if Turkka responds in English or prefers it)

Hi Turkka,

Posti has committed to fleet electrification — a smart move. ETS2 starts in 2027: Posti's diesel fleet is above the threshold, meaning every tonne of CO₂ becomes a direct cost line. CSRD already requires Scope 1 fleet reporting by route.

DWS IQ 6 is the measurement layer that shows Posti where per-route emissions are highest — and where electrification pays back fastest before ETS2 pricing kicks in. Not estimates: real data from the fleet.

Worth 15 minutes?

Best,
Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## LinkedIn DM variant (after connection accepted)

> Hei Turkka,
>
> Kiitos yhteydestä. Seuraan Postin sähköistymistä kiinnostuksella — ETS2 2027 tekee dieselkilometreistä suoran kustannuksen. DWS IQ 6 näyttää missä sähköistyminen maksaa itsensä takaisin nopeimmin — oikealla datalla, ei arviolla. Kiinnostaako 15 min?

---

## Send Mechanics

- **Transport:** Amazon SES SMTP — `src/services/email.service.ts`
- **Sender:** `risto.paarni@lifetime.fi`
- **Recipient verify:** Check posti.fi/en/about/posti-group/management for Turkka Kuusisto's
  email. Pattern likely `firstname.lastname@posti.com` or `@posti.fi` — verify
- **Attachments first send:** NONE
- **Timing:** Tuesday or Wednesday, 08:00–09:30 Finnish time
- **Follow-up rule:** One follow-up max (Day 14), then silence per NORDIC_SALES_STRATEGY.md

## Follow-Up Angle (Day 14, if no reply)

> Hei Turkka,
>
> Palaan yhden kerran: ETS2 alkaa viimeistään 2027. Postin laivasto ylittää kynnysarvon — jokainen dieselkilometri saa hintalapun. DWS IQ 6 kertoo jo nyt mitkä reitit ovat kalleimpia ja kannattaako sähköistää ensin. Kiinnostaako?

## Escalation Path if Turkka is Unresponsive

After 14 days:

1. Identify Posti's Chief Sustainability Officer or Head of Fleet Operations (posti.fi/en/about or 2025 Annual Report)
2. Send second-track cold email (new file: `LETTER_POSTI_GROUP_CSO.md`)
3. ETS2 angle → CFO is also valid: "jokaisesta tonnista CO₂ tulee kustannus 2027 — budjetti valmis?"
4. Max 2 touches to CSO/CFO, then mark "silent — revisit at ETS2 legislative milestone or Posti H2 2026 results"

## Vertical Note

Posti is the first logistics/transportation target in this outreach batch. The ETS2 + CSRD fleet angle differs from the construction (EPBD + machinery Scope 1) angle — adjust follow-on materials accordingly. If Posti converts, the logistics vertical proof is established for subsequent targets (DB Schenker Finland, Transval, Kuehne + Nagel).
