<!--
VERSION AND AGENT HISTORY
Document: LETTER_GRK_INFRA.md
Version: 1.0
Last-Updated: 2026-06-17
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-fable-5)
Branch: claude/sales-outreach-2-7uro90
Purpose: Cold email to COO/CDO/CEO at GRK Infra Oy.
         Wedge: GRK's best profit year (6.7% EBIT 2025) + CSRD Wave 2 first
         mandatory reporting (FY2025, due 2026-2027). Scope 1 from construction
         machinery fleet never tracked at project level — this is the compliance
         gap. Tier A: they have the budget to invest in this infrastructure now.
Transport: Amazon SES SMTP only (CLAUDE.md non-negotiable rule #4 — no Resend)
Sender: risto.paarni@lifetime.fi (never noreply@, rule #3)
Recipient: [IDENTIFY FIRST — private company, no public email pattern. Find COO/CDO
           via LinkedIn then verify email. Do not send to generic info@ or myynti@.]
-->

# Cold Email — GRK Infra / COO or CDO

**To:** [VERIFY — identify and confirm COO/CDO email via LinkedIn before sending]
**From:** risto.paarni@lifetime.fi
**Subject options (A/B test — pick one):**

- A: `GRK Infra CSRD Wave 2 — Scope 1 konekalustosta automaattisesti`
- B: `GRK 6,7 % liiketulos 2025 — CSRD-infrastruktuuri kasvun ajaksi`
- C: `T2H hoitaa CSRD-raportoinnin automaattisesti — GRK seuraava?`

Suositus: **Subject B** — tunnistaa heidän oman menestyksensä, ei aloita velvoitteella.

---

## Versio 1 — Suomeksi (primääri)

Hei [Etunimi],

Näin GRK Infran 2025 liiketuloksen — 6,7 % on selvästi paras vuosi pitkään aikaan, ja infrarakentaminen pitää marginaalin asuntorakentajia vahvempana. Juuri kun volyymi kasvaa, CSRD Wave 2 iskee ensimmäistä kertaa: Scope 1 -päästöt konekalustosta ja työmailta raportoitava projektikohtaisesti FY2025-raportissa.

Asiakkaamme T2H (infrarakentaminen, aktiivinen pilotti) ja NCC hoitavat tämän automaattisesti DWS IQ 6:lla — dataa ei kerätä manuaalisesti, raportti generoidaan suoraan projekteista.

Kiinnostaako 15 min? Näytän miten GRK:n projektiportfolio näyttäisi dashboardilla.

Terveisin,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## Versio 2 — Englanniksi (jos kontakti on kansainvälinen tai ruotsinkielinen)

Hi [First name],

GRK Infra's 2025 operating result — 6.7% EBIT — is the strongest in years, and infrastructure margins are holding well above housing construction peers. Exactly when volume is scaling up, CSRD Wave 2 lands for the first time: Scope 1 emissions from your construction machinery fleet must be reported at project level, starting with FY2025 data.

Our customers T2H (active pilot, infrastructure adjacent) and NCC handle this automatically with DWS IQ 6 — no manual data collection, CSRD report generated directly from project data.

Worth 15 minutes to show you how GRK's project portfolio would look in the dashboard?

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
+358 400 319 010
https://dws10.com

---

## LinkedIn DM variant (after connection accepted, shorter)

> Hei [Nimi],
>
> GRK:n 2025 tulos — 6,7 % liiketulos — on infrarakentamisen merkkipaalu. CSRD Wave 2 iskee juuri nyt ensimmäistä kertaa: Scope 1 konekalustosta projektikohtaisesti. T2H hoitaa tämän automaattisesti meidän kanssa. Kiinnostaako 15 min demo?

---

## Pre-Send Checklist (Private Company — extra steps required)

- [ ] **Step 1:** Search LinkedIn for GRK Infra Oy leadership — identify COO, CDO, or CEO by name
- [ ] **Step 2:** Confirm they are still in role (check last activity / profile update date)
- [ ] **Step 3:** Find email pattern — GRK Group likely uses `firstname.lastname@grk.fi` or `firstname.lastname@grkinfra.fi` [VERIFY via LinkedIn "Contact info" or GRK corporate website]
- [ ] **Step 4:** If email unverifiable, route via GRK website contact form with the same body, or send via LinkedIn InMail
- [ ] **Step 5:** Send Tuesday or Wednesday 08:00–09:30 Finnish time

## Send Mechanics

- **Transport:** Amazon SES SMTP — `src/services/email.service.ts`
- **Sender:** `risto.paarni@lifetime.fi`
- **Attachments first send:** NONE
- **Follow-up:** One follow-up max (Day 14), then silence
- **Peer reference to use:** T2H (active pilot — same infra vertical, strongest social proof for GRK)

## Data Source Note

GRK Infra's 6.7% operating margin (2025) is sourced from Alma Insights per
`sales-outreach/construction-profitability-targeting-FI.md`. Confirm this figure
is still publicly verifiable before citing it in an email — if Alma Insights data
is behind a paywall and not publicly sourced, rephrase as:
"infrasektorin johtavia marginaaleja" (infra sector leading margins) without the specific number.
