---
signal_id: MS-2026-09-006
reality: "Supabase dws6 (eu-west-1) 24.09.2026: construction_leads 0 riviä, ted_leads 0, market_signals-taulua ei ole, gtm_event_log 0, blog_subscribers 0, orders 0, web_leads 1, booking_reservations 20 (14 konsultaatiota + 6 demoa, 29.04–12.06.2026; muistiinpanoista ~17/20 testejä, 2–3 aitoa: 'FPE aloituskonsultaatio', 'Full Workforce Onboarding interest', 'calendar app'), inbound_emails 309 kaikki sama automaattiotsikko 'T:XXXX status responded' parse_ok=false, social_posts 127 kaikki draft. Cloudflare Analytics- ja Google Merchant -tunnuksia ei tässä ympäristössä; BigQuery on pelkkä connector ilman toteutusta."
observation: "Meillä ei ole sisältöongelmaa eikä liikenneongelmaa. Meillä on havainto-ongelma. Tiedämme, että ihmiset tulevat (Cloudflare: 100 000+ kävijää), mutta emme tiedä, mitä he yrittävät saada aikaan. Viikoittainen construction-lead-paketti ei päädy tietokantaan; sähköpostisensori kerää vain automaattivastauksia; some-jono ei ole julkaissut yhtään; tuotenäytöistä (Merchant, 0 kauppaa) ei ole näyttö/klikkidataa saatavilla."
signal: "Reality ✅, Observation ❌: verkkosivusto toimii julkaisukoneena, ei sensorina. Yksikään nykyinen datalähde ei vastaa kysymykseen 'miksi kävijä tuli'."
insight: "Aktiivisen ontologian ensimmäinen versio ei ole agentti eikä chat vaan yksi kenttä: 'Mikä päätös on tällä hetkellä vaikea tehdä?' + toimialavalinta. Kun ensimmäinen tuhat vastaa, meillä on enemmän markkinatietoa kuin Cloudflaren dashboardista. Cloudflare kertoo kuinka monta tuli; Observation Intake kertoo miksi. Merchantin 0 kauppaa on havainto, ei epäonnistuminen: hypoteesi 'ontologia puuttuu', ei 'tuotteet ovat huonoja'."
source: agent run
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
decided_at: 2026-09-24
kb_updated_at: 2026-09-24
observer: Claude Code (Supabase read-only queries) + HIC
confidence: high
occurrences: 1
evidence:
  {
    construction_leads: 0,
    ted_leads: 0,
    market_signals_table: "missing",
    gtm_event_log: 0,
    booking_reservations: 20,
    real_booking_notes: 3,
    inbound_emails: 309,
    inbound_distinct_subjects: 1,
    social_posts_published: 0,
    web_leads: 1,
    orders: 0,
  }
affected: [dws10.com, dws10.com/buy, workflows, data-pipeline]
status: accepted
hypothesis: "Kun Observation Intake on dws10.com:n etusivulla 30 päivää, kertyy vähintään 300 luokiteltavaa havaintoa toimialoittain, ja niistä syntyy ensimmäinen HIC:n hyväksymä Learning Delta, joka muuttaa tarjontaa tai sisältöä. Samalla construction-lead-putki (scripts/daily/construction-leads.sh → construction_leads/ted_leads) korjataan kirjoittamaan tietokantaan, ja market_signals-taulu luodaan DWS_MARKET_RESEARCH_STANDARD §4.3:n mukaan."
refuting_evidence: "Jos 30 päivässä kertyy alle 50 havaintoa, sensori on väärin sijoitettu tai muotoiltu (ei periaate väärä). Jos construction_leads pysyy tyhjänä korjauksen jälkeen, DGX-cron ei aja tai TED-API estää."
learning_delta:
  id: LD-2026-09-006
  old_assumption: "Meillä on data-analytiikka (Cloudflare, Merchant, Supabase), joten meillä on havaintoja."
  new_learning: "Liikenne- ja tapahtumadata ei ole havaintoja. Havainto = data + konteksti + merkitys, ja se syntyy vasta kun kävijä kertoo tilanteensa tai järjestelmä kirjaa, mitä hän yritti saada aikaan. Verkkosivusto on muutettava julkaisukoneesta sensoriksi."
  ontology_change: "Erotetaan käsitteet Liikenne (Reality) ja Havainto (Observation); jokaisella datalähteellä on 'vastaa miksi?' -attribuutti (Cloudflare: ei; Merchant: osittain; Observation Intake: kyllä)."
  hic_decision: APPLY
  decision_reasoning: "HIC 24.09.2026: APPLY, ei PARTIAL, ei DEFER. Reality/Traffic/Content/Products ✅, Observation/Signals/Learning ❌. Todellinen ongelma ei ole sisältö, SEO, tuotteet tai kampanjat vaan: emme kuule mitä asiakkaat yrittävät tehdä. Hyväksytty kokonaisuutena: construction lead intake, market signals, observation intake, Agentic Commerce discovery. Tärkein havainto: ainoat aidot asiakashavainnot ovat varauslomakkeiden vapaatekstikentissä (3 kpl) — ensimmäiset raakamuotoiset Observation-entiteetit; analysoidaan kuten market signalit."
  applied_to: [dws10.com, dws10.com/buy, data-pipeline, workflows]
  excluded: [lifetime.fi, investor-centre]
  approved_by: HIC
  approved_at: 2026-09-24
  effective_from: 2026-09-24
  world_model_version: 1.6.0
decision: observation_first_v1
comprehension: "HIC 24.09.2026: taulukko paljasti enemmän kuin odotin; Active Ontology = Uncertainty Reduction System, ei Recommendation System."
application_decision:
  applies_to: [dws10.com, dws10.com/buy, data-pipeline, workflows]
  does_not_apply_to: [lifetime.fi, investor-centre]
  basis: [MS-2026-09-006 Supabase-evidenssi, MS-003, MS-004, MS-005]
  valid_until: 2026-12-31 tai 30 pv Observation Intaken julkaisusta
  affects: [dws10.com-kävijät, DGX-cron (construction-leads), Admin pipeline view]
dispatched_runs:
  - docs/specs/active-ontology-ux-v2.md (§0b Observation Intake)
  - dws10.com Active Ontology UX v2 + functions/api/observations.js + migration 089_240926_website_observations (PR #2091)
  - TODO: construction-leads.sh → construction_leads/ted_leads kirjoitus (DGX-cron tarkistus)
  - TODO: market_signals-migraatio (DWS_MARKET_RESEARCH_STANDARD §4.3) tiedostona; ajo RED
  - TODO: booking_reservations.customer_notes → Chapter 14 CAPTURE (3 aitoa havaintoa)
impact:
  - { target: dws10.com, status: in progress, note: Observation Intake + UX v2 }
  - {
      target: data-pipeline,
      status: not started,
      note: construction-leads → DB; market_signals-migraatio,
    }
  - { target: workflows, status: not started, note: Chapter 14 CAPTURE bookings + intake }
  - { target: lifetime.fi, status: excluded }
  - { target: investor-centre, status: excluded }
evaluation: null
---

## Mitä kysyttiin ja mitä löytyi (Supabase, read-only, 24.09.2026)

| Lähde                                 | Riviä                           | Mitä se kertoo Active Ontologialle                                                                                                                              |
| ------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| construction_leads / ted_leads        | 0 / 0                           | Viikoittainen construction-lead-paketti ei päädy tietokantaan; Chapter 14 ei voi lukea sitä ennen kuin putki korjataan.                                         |
| market_signals                        | taulua ei ole                   | DWS_MARKET_RESEARCH_STANDARD §4.3 määrittelee sen, mutta migraatiota ei ole ajettu.                                                                             |
| booking_reservations                  | 20 (14 konsultaatiota, 6 demoa) | Ainoa "mitä asiakas halusi" -teksti; 17/20 testejä, 3 aitoa. Todellinen kysyntäsignaali: FPE-aloituskonsultaatio, Full Workforce Onboarding, kalenterisovellus. |
| inbound_emails                        | 309, 1 erillinen otsikko        | Sensori kerää vain automaattiset "status responded" -viestit; ei asiakaspuhetta.                                                                                |
| social_posts                          | 127, kaikki draft               | Chapter 11 ei ole koskaan julkaissut; MEASURE-silmukka ei ole alkanut.                                                                                          |
| gtm_event_log                         | 0                               | Suppilotapahtumia ei kerätä.                                                                                                                                    |
| web_leads / orders / blog_subscribers | 1 / 0 / 0                       | BUY-kerros ei tuota havaintoja.                                                                                                                                 |

Cloudflare ja Google Merchant: tunnuksia ei ole tässä ympäristössä; HIC hakee Top URLs, Entry
pages, Exit pages, Referrers, Search queries, Countries, Top paths (Cloudflare) ja näytöt,
klikit, hakutermit per tuote (Merchant). Merchantin kannalta kiinnostavin ei ole myynti vaan
"74 klikkasi, kukaan ei ostanut" → miksi.

## Seuraava solmu

GUARDRAIL (ei PII: varausnimiä ei kirjattu) → SHOW_TO_HIC → HIC_APPROVAL_GATE →
APPLY_LEARNING_GATE (LD-006). Ehdotettu applies_to: dws10.com (Observation Intake),
data-pipeline (construction-leads → DB, market_signals-migraatio), workflows (Chapter 14 CAPTURE
lukee bookings-muistiinpanot ja Observation Intaken).
