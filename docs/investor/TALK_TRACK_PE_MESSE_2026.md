# PE Meeting + German Messe Talk Track — 2026 Q2 SAFE Round

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/investor-labor-pricing-thesis-rWS2b | Date: 14.05.2026 | Changes: Initial creation — investor talk-track package for 2026 Q2 SAFE round. Covers 30-second elevator, 2-minute pitch, 8-slide deck outline, Q&A bank pointer, and DE / FI translations of the elevator + 2-minute pitch for Messe Germany and Finnish-language investor conversations. Companion to INVESTOR_ONE_PAGER_2026Q2.md and INVESTOR_QA_BANK_2026Q2.md.
- Version: 1.1 | Tool: Claude Code (claude-opus-4-8) | Session: claude/4p-capital-classes-propagate-h0hien | Date: 21.06.2026 | Changes: Added §2.5 "The 4P Moat Beat" — the drop-in answer to "why you / why can't a competitor catch up", mapping Prompt / People / Plant / Perception to the valuation re-rate and naming Perception as the lever (still-being-proven). Sourced from DWS_BRAND_STANDARD.md §23 and the 4P field note (v2.0).
- Version: 1.2 | Tool: Claude Code | Session: claude/capital-classes-audit-jgworp | Date: 21.06.2026 | Changes: Added 4P Capital Classes moat bullet to the 2-minute pitch (between Traction and Ask); moat content lives in §2.5 "The 4P Moat Beat" (already merged from PR #1568) rather than a 9th slide, keeping the "8-Slide Deck" title honest. Canonical source: DWS_BRAND_STANDARD.md §23.

Session Links & References:

- Claude Code (claude/investor-labor-pricing-thesis-rWS2b): https://github.com/blogtheristo/dws6/commits/claude/investor-labor-pricing-thesis-rWS2b
- Companion: docs/investor/INVESTOR_ONE_PAGER_2026Q2.md
- Companion: docs/investor/INVESTOR_QA_BANK_2026Q2.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/investor-labor-pricing-thesis-rWS2b/docs/investor/TALK_TRACK_PE_MESSE_2026.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English (primary)
- Languages Available: English · Deutsch (Messe) · Suomi (Lifetime Oy context)
- Publication Status: ACTIVE — internal, used live in PE meetings and at Messe Germany

---

## 0. Brand Architecture (read first)

- **Buyer / investor-facing offer:** **DWS 365 Skilled Agents** and **Firehorse 365 Skilled Agents**.
- **Platform underneath:** **DWS IQ** (DWS IQ 6 is the current release).
- Lead every talk track with the offer-layer name. Platform name is mentioned once, as the thing the offer runs on.

The spine — in every conversation, on every slide:

> **Labor-anchored pricing · regulation drives demand · MACC + AppExchange drive distribution.**

---

## 1. The 30-Second Elevator (EN)

> "We sell **DWS 365 Skilled Agents** — sixteen AI workers that produce signed
> EU regulatory reports: CSRD, CBAM, EU AI Act conformity, EN 15978 LCA,
> site-safety. We price them like labor, not like software — a bundle that
> replaces six to eight EU FTEs sells for €200k a year, gross margin north of
> 80%, and the margin gets better as model cost falls. Regulation drives the
> demand. MACC-burn on Azure and AppExchange on Salesforce drive the
> distribution. Raising €650k SAFE at €3.8M cap to ride Messe Germany this
> autumn."

**One number to lead with**: _"Six-to-eight EU FTE replaced, €200k a year, margin above 80% and rising."_

---

## 2. The 2-Minute Pitch (EN — 5 bullets, then ask)

1. **Category.** "Software stopped helping humans do the work and started doing the work itself. That's a business-model shift from a tool to a labor unit. **DWS 365 Skilled Agents** are on the labor side of that line — sixteen agents that produce the signed artifact a buyer would otherwise pay a consultant or an FTE to produce."

2. **Unit economics.** "Pricing is anchored to the human cost of producing the work. Per-outcome SKUs are roughly 10–20% of consultancy day-rate baselines; per-agent-month SKUs are roughly 15–30% of fully loaded FTE cost. The full Skilled Workforce bundle replaces six to eight EU FTEs for €199,990 a year. Gross margin above 80% at list — margin expands as inference cost falls, because the price is anchored to labor, not to compute."

3. **Regulation drives demand.** "CSRD reporting waves hit 2026–27, CBAM closes 2026, EU AI Act high-risk obligations live August 2026, NIS2 already operational. Every one of those regulations is the regulator hiring our customer's compliance team. Skilled Agents are the answer that ships."

4. **Distribution.** "Every Tier-1 named account in our pipeline — Skanska, STRABAG, HOCHTIEF, PORR, NCC, Bilfinger — sits on an active Microsoft Azure Consumption Commitment. We list on Azure Marketplace, the customer burns down committed cloud spend at our sticker, Microsoft co-sell credit makes their field a distribution channel for us. AppExchange on Salesforce slots us inside their 'digital labor' vocabulary at a defensible per-agent-month sticker on top of the platform meter."

5. **Traction.** "Two Q1 pilots signed at €29,950, €7k MRR live with 100% retention, sixteen agents in production, €550k to €1.07M ACV booked-target across the Tier-1 pipeline for Q2–Q4 2026, V1 launches at Arctic 15 June 15, Messe Germany commercial push in Stuttgart September 17–19."

6. **The accumulated moat.** "Seven months of operation built four capital classes a competitor can't reconstruct with the same model: Prompt — a validated skills and agent corpus; People — calibrated operator judgment that was earned in the field; Plant — a sovereign, mobile two-room edge stack; and Perception — a governed world model that compounds with every field deployment. A rival starting today runs 18 months behind on Perception alone."

**Ask.** "€650k SAFE at €3.8M cap. Sixty percent funds Tier-1 EU sales through Messe Germany, twenty-five percent EU AI Act conformity co-sign, fifteen percent MACC-burn and AppExchange co-sell. Twenty-minute follow-up call, or come see the Messe stand in September."

---

## 2.5 The 4P Moat Beat (drop-in when an investor asks "why you?")

> "We accumulate four durable capital classes — the **4P model**. **Prompt** —
> the codified intelligence: 30+ skills, a 50-agent foundry, eval datasets.
> **People** — seven months of calibrated HIL judgment a new entrant cannot
> hire around. **Plant** — an EU-resident, audit-logged, mobile two-room
> Control Room and Situation Room stack, deployable at a site or in a fleet
> vehicle. **Perception** — a governed world model and a closed
> sense-decide-act loop; the only class with data-network effects, and the
> lever that takes the comp from a SaaS multiple to an industrial-AI multiple.
> A competitor can buy the hardware; they cannot buy a year of our governed
> observations or skip the seven-month HIL phase."

**Valuation translation (only if the investor pushes on the multiple):** Prompt
and People move the comp off the SaaS curve onto the labor curve; Plant makes the
revenue durable; **Perception is the re-rate lever**. Keep it qualitative unless
they ask for the cap math — then point to the one-pager's "4P Capital Classes"
section and `IMPACT_FORECAST.md` §2.1.1.

**Honesty beat (say it before they find it):** "Perception is the youngest of
the four and **still being proven** — we name it as upside, not as banked moat."
Naming the caveat buys credibility on the other three.

---

## 3. 8-Slide Deck Outline (Outlines Only — Gamma Renders Separately)

> **Do not build the deck here.** Gamma is triggered separately and only after Risto signs off the outline below. Slide order is locked; per-slide content stays at headline + 3–5 bullet beats.

| #   | Slide                      | Headline                                                                 | Bullet beats                                                                                                                                                                       |
| --- | -------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Thesis**                 | Price AI like labor, not like a tool.                                    | Tool→labor shift · DWS 365 Skilled Agents on the labor side · @dhaber attribution · spine in one line.                                                                             |
| 2   | **Shift Table**            | What changes when AI does the work itself.                               | Buyer, unit, anchor, pricing, value, procure, risk, margin — tool vs labor lens.                                                                                                   |
| 3   | **Unit Economics**         | Sixteen agents = six-to-eight EU FTE at a fraction of the cost.          | Per-outcome anchor · per-agent-month anchor · bundle replaces 6–8 FTE for €199,990/yr · GM >80% and rising.                                                                        |
| 4   | **Demand Engine**          | Regulation is hiring our customer's compliance team.                     | CSRD · CBAM · EU AI Act · NIS2 · Fit-for-55 · 24-month enforcement calendar.                                                                                                       |
| 5   | **Distribution**           | MACC-burn + AppExchange = enterprise field as our channel.               | Azure MACC math · Microsoft co-sell credit · AppExchange "digital labor" frame · channel-conflict-free pricing.                                                                    |
| 6   | **Product Catalog Teaser** | Sixteen Skilled Agents, T0→T4 upsell ladder, consult-plus-keep bundles.  | Single-agent SKUs (Compliance / Material Oracle / SiteSense / Schedule Genius / Sovereignty Monitor / Themis) · Function-as-a-Service bundles · Consulting-plus-agent land-motion. |
| 7   | **Traction**               | €7k MRR, 100% retention, €550k–€1.07M booked target, Messe in September. | Q1 pilots signed · Q2 launch · Q3 Messe pickup · Year-2 attach math (+40–80% per landed account).                                                                                  |
| 8   | **Ask**                    | €650k SAFE @ €3.8M cap.                                                  | Round structure · use of funds (60 / 25 / 15) · two calendar slots · Messe stand option.                                                                                           |

Slide cosmetics, lengths, and visual style are owned by the Gamma render — **do not** specify those here.

---

## 4. Q&A Coverage

Live Q&A is handled out of `docs/investor/INVESTOR_QA_BANK_2026Q2.md` — twelve hardest investor questions, each answered in ≤120 words. Memorize the top six (Q1, Q3, Q4, Q5, Q9, Q12); read the rest before the meeting.

---

## 5. Deutsch — Messe Germany (Stuttgart, Sep 17–19, 2026)

### 5.1 30-Sekunden-Elevator (DE)

> „Wir verkaufen **DWS 365 Skilled Agents** — sechzehn KI-Arbeitskräfte, die
> unterschriebene EU-Regulatorik-Berichte produzieren: CSRD, CBAM, EU-AI-
> Act-Konformität, EN 15978 LCA, Baustellen-Sicherheit. Wir bepreisen sie wie
> Arbeit, nicht wie Software — ein Bundle, das sechs bis acht EU-FTE
> ersetzt, kostet €200k im Jahr, Rohmarge über 80 %, und die Marge steigt,
> sobald Modellkosten fallen. Regulierung treibt die Nachfrage. MACC-burn
> auf Azure und AppExchange auf Salesforce treiben den Vertrieb. Wir
> sammeln €650k SAFE bei €3,8 Mio Cap, um die Messe-Saison im Herbst
> mitzunehmen."

### 5.2 2-Minuten-Pitch (DE)

1. **Kategorie.** „Software hört auf, Menschen bei der Arbeit zu helfen — sie übernimmt die Arbeit selbst. Das ist eine Geschäftsmodell-Verschiebung von einem Werkzeug zu einer Arbeitseinheit. **DWS 365 Skilled Agents** stehen auf der Arbeitsseite dieser Linie: sechzehn Agenten, die das unterschriebene Artefakt produzieren, für das ein Käufer sonst einen Berater oder einen Vollzeit-Mitarbeiter bezahlen müsste."

2. **Stückkostenrechnung.** „Der Preis ist an die Personalkosten der zu erbringenden Arbeit gekoppelt. Per-Outcome-SKUs liegen bei rund 10–20 % des Beratungstagessatzes; Per-Agent-Month-SKUs bei rund 15–30 % der voll geladenen FTE-Kosten. Das volle Skilled-Workforce-Bundle ersetzt sechs bis acht EU-FTE für €199.990 pro Jahr. Rohmarge über 80 % zum Listenpreis — die Marge wächst, wenn Inferenzkosten fallen, denn der Preis ist an Arbeit gekoppelt, nicht an Rechenleistung."

3. **Regulierung treibt Nachfrage.** „CSRD-Berichts-wellen 2026–27, CBAM schließt 2026, EU-AI-Act-Hochrisiko-Pflichten ab August 2026 in Kraft, NIS2 bereits operativ. Jede dieser Regulierungen ist faktisch der Regulator, der das Compliance-Team unseres Kunden einstellt. Skilled Agents sind die Antwort, die heute liefert."

4. **Vertrieb.** „Jeder Tier-1-Kunde in unserer Pipeline — Skanska, STRABAG, HOCHTIEF, PORR, NCC, Bilfinger — sitzt auf einer aktiven Microsoft Azure Consumption Commitment. Wir listen auf Azure Marketplace, der Kunde verbrennt gebundene, nicht ausgegebene Cloud-Mittel zu unserem Listenpreis, Microsoft-Co-Sell-Credit macht deren Vertrieb zu unserem Kanal. AppExchange auf Salesforce platziert uns innerhalb deren ‚digital labor'-Vokabular zu einem verteidigungsfähigen Per-Agent-Month-Preis."

5. **Traktion.** „Zwei Q1-Piloten unterzeichnet zu je €29.950, €7k MRR live mit 100 % Retention, sechzehn Agenten im Produktiveinsatz, €550k bis €1,07 Mio ACV-Buchungsziel über die Tier-1-Pipeline für Q2–Q4 2026, V1-Launch Arctic 15 am 15. Juni, Messe-Schub in Stuttgart 17.–19. September."

**Bitte.** „€650k SAFE bei €3,8 Mio Cap. Zwanzig-minütiger Call zum Anschluss oder Besuch am Messe-Stand im September."

---

## 6. Suomi — Lifetime Oy Investor Context

### 6.1 30-sekunnin elevator (FI)

> „Myymme **DWS 365 Skilled Agents** -palvelua — kuusitoista tekoälytyöntekijää,
> jotka tuottavat allekirjoitetut EU-sääntelyraportit: CSRD, CBAM, EU AI Act
> -konformiteetti, EN 15978 -elinkaariarvio, työmaaturvallisuus. Hinnoittelu
> on kytketty työvoiman, ei ohjelmiston, hintaan — kuuden–kahdeksan EU-
> kokoaikaisen henkilön työn korvaava paketti maksaa noin €200k vuodessa,
> kateprosentti yli 80, ja kate kasvaa kun mallikustannukset laskevat.
> Sääntely ajaa kysyntää. MACC-burn Azurella ja AppExchange Salesforcessa
> ajavat jakelua. Keräämme €650k SAFE-rundilla, cap €3,8M, Messen Saksan-
> kausi syksyllä."

### 6.2 2-minuutin pitch (FI)

1. **Kategoria.** „Ohjelmisto on lakannut auttamasta ihmistä tekemään työn — se tekee työn itse. Tämä on liiketoimintamallin muutos työkalusta työvoimayksiköksi. **DWS 365 Skilled Agents** on tällä työvoimapuolella: kuusitoista agenttia, jotka tuottavat allekirjoitetun lopputuotteen, josta ostaja muuten maksaisi konsultille tai kokoaikaiselle työntekijälle."

2. **Yksikkötalous.** „Hinta on kytketty työn tekemisen henkilöstökustannukseen. Per-outcome-SKUt noin 10–20 % konsultoinnin päivähinnasta; per-agent-month-SKUt noin 15–30 % täysin kuormitetusta FTE-kustannuksesta. Täysi Skilled Workforce -paketti korvaa 6–8 EU-FTE:ä €199 990/v. Bruttokate yli 80 % listalla — kate kasvaa kun inferenssikustannukset laskevat, koska ankkuri on työvoima, ei laskenta."

3. **Sääntely ajaa kysyntää.** „CSRD-raportointiaallot 2026–27, CBAM sulkeutuu 2026, EU AI Act -riskivelvoitteet voimaan elokuussa 2026, NIS2 jo operatiivinen. Jokainen näistä on käytännössä sääntelijä palkkaamassa asiakkaamme compliance-tiimin. Skilled Agents on toimitettavissa oleva vastaus tänään."

4. **Jakelu.** „Jokainen Tier-1-asiakas pipelinessä — Skanska, STRABAG, HOCHTIEF, PORR, NCC, Bilfinger — istuu aktiivisella Microsoft Azure Consumption Commitmentilla. Listaamme Azure Marketplaceen, asiakas polttaa sitoutunutta-mutta-käyttämätöntä pilvipanosta meidän listahinnallamme, Microsoftin co-sell-krediitti tekee heidän kenttäorganisaationsa kanavaksemme. AppExchange Salesforcessa istuttaa meidät 'digital labor' -sanastoon."

5. **Traktio.** „Kaksi Q1-pilottia allekirjoitettu á €29 950, €7k MRR ja 100 % retentio, kuusitoista agenttia tuotannossa, €550k–€1,07M ACV-tavoitebookkaus Tier-1-pipelinessä Q2–Q4 2026, V1 lanseeraus Arctic 15:llä 15. kesäkuuta, Messe Saksa -veto syyskuun 17.–19. päivä."

**Pyyntö.** „€650k SAFE-runda capilla €3,8M. 20-minuutin jatkokeskustelu tai vierailu Messe-osastolle syyskuussa."

---

## 7. Talk-Track Discipline (Anti-Goals)

- **Never** say "AI-powered platform", "copilot", "X% faster", "per-seat".
- **Never** lead with the underlying platform name (DWS IQ); lead with the offer-layer brand (DWS 365 Skilled Agents / Firehorse 365 Skilled Agents).
- **Never** compare to other SaaS in the same sentence as our price; compare to consultancy day rate or FTE loaded cost.
- **Always** close the conversation with one of the two booking offers (PE call or Messe stand).
- **Always** route the follow-up through the named human sender (`risto.paarni@lifetime.fi`) via Amazon SES SMTP.

---

## 8. Companion Documents

- `docs/investor/INVESTOR_ONE_PAGER_2026Q2.md` — the leave-behind.
- `docs/investor/INVESTOR_QA_BANK_2026Q2.md` — live-Q&A reference.
- `docs/investor/INTRO_TEMPLATE_LABOR_THESIS.md` — INTRO master template.
- `docs/investor/data-room-2026Q2/` — post-meeting follow-up pack.
