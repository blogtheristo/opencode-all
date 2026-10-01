---
title: "DWS IQ Aegis Pilot (3 months)"
price: "19990.00"
currency: "EUR"
sku: "DWS-AEGIS-PILOT-001"
availability: "preorder"
condition: "new"
google_product_category: "Software > Business & Productivity Software"
image_link: "https://dws10.com/static/images/firehorse-aegis-head.png"
brand: "DWS IQ"
storeCategory: "platform"
type: "one-time"
priceNote: "€19,990 fixed, 3 months. Credited in full against the €59,990 Aegis onboarding if you proceed within 6 months, leaving €40,000. Credit capped at €19,990; includes Lifetime World Model (LWM v2) training to the customer environment; excludes hardware, multi-site rollout and custom ERP/BIM/SCADA integrations."
mpn: "DWS-AEGIS-PILOT-2026"
---

# DWS IQ Aegis Pilot

**Prove the local-first path before you buy the silicon** — a 3-month scoped engagement, part of DWS IQ Aegis

## What it is

A fixed-price, fixed-duration engagement that proves the complete **local-first operational path** for Aegis on infrastructure you already have — or on a compact edge appliance — **before any DGX procurement**.

The pilot exists because the control-room requirement is testable. In manufacturing control rooms, dual-use facilities and air-gapped plants, compliance execution cannot depend on external connectivity. That is either true of a deployment or it is not, and the way to find out is to run it and pull the cable — not to model it in a proposal.

**Indicative nearest SEAL-3** (Digital Resilience) — same depth as Aegis. Not a Commission certificate. Lifetime Oy was not in Cloud III. SEAL-4 is closed by NVIDIA GN100/DGX chip dependence.

## What it proves

The five requirements that define a control-room deployment, demonstrated rather than asserted:

1. **Local execution and local evidence** — the outcome is produced on site, and the evidence of it is written on site.
2. **Local identity, logs and kill authority** — agent identity, the Article 12 record and the ability to stop an agent all resolve locally.
3. **No network dependency for the core outcome** — the critical path completes with the uplink down.
4. **Cloud only for optional sync, backup or non-critical reporting** — never the outcome, never the evidence chain, never the stop.
5. **Graceful degradation** — specified in advance, then demonstrated, rather than discovered during an incident.

**The acceptance KPI is binary and deliberately blunt.** With the uplink severed for an agreed window: (i) does the piloted workflow run to completion, (ii) is the EU AI Act Article 12 record still being written locally, and (iii) can an operator still stop a running agent? **All three must pass.** A pilot that does not pass has produced a useful negative result — a valid outcome, not a defect — and you will have learned it for €19,990 instead of after a hardware programme.

## What you get

- A scoped architecture for your site, with the deployment mode named (Local / Edge, Hybrid, or EU-Sovereign Cloud) and justified.
- A demonstrated uplink-down run against your own workflow.
- The Article 12 evidence record, produced locally throughout the engagement.
- Hardware sizing for production — informed by measured behaviour on your workload rather than a vendor spec sheet.
- A written recommendation, including the honest one: if your workload does not need local-first, the pilot says so.

## How the three months run

Five phases. The ordering is deliberate: the substrate is proven before the workflow exists, and the acceptance test is rehearsed before it is taken. Each phase has an exit gate, and a gate that does not pass is reported rather than worked around.

### Phase 0 — Scoping and baseline · weeks 0–2 · no charge

**Objective.** Establish what "the core outcome" actually is, precisely enough that it can be tested.

- **We do:** site, workflow and deployment-mode selection workshop; read-only audit of the source systems; **criticality classification** — every step in the workflow marked core (must survive an outage) or non-core; first draft of the degradation and reconciliation spec; baseline measurement of current-state behaviour.
- **You do:** appoint a named project lead for the pilot; nominate the technical contact, the workflow owner, and the operator who will exercise kill authority; grant read-only access; agree the outage window, its date, and **the isolation method**.
- **Exit gate:** a one-page signed scope — site, workflow, deployment mode, isolation method, and the three acceptance conditions written in _your_ operational language, not ours.

**On the isolation method.** Continuously-operating sites cannot usually permit a physical cable pull, and a pilot that assumes one arrives at the acceptance test with no test. So the method is chosen in Phase 0 from a ranked ladder — physical disconnect, deny-all egress at the edge router, VLAN isolation of the Aegis segment, or host-level egress block — and recorded with what it does and does not demonstrate. Two rules make the choice safe: the block must be **enforced above the stack** (at your router, switch or hypervisor, administered by you — a system asked to disconnect itself has not been tested), and **egress must be attempted and shown to fail** before the run starts. The weaker methods prove less about the network boundary and exactly as much about the workload; the acceptance record names which was used, so a reader in three years knows what was demonstrated.

- **This phase fails if** the workflow cannot be described as a terminating sequence with a defined "complete" state. If there is no completion, there is nothing to test, and we say so before you have spent anything.

### Phase 1 — Local substrate · weeks 3–5

**Objective.** Stand up execution, identity, evidence and kill authority on site. Nothing about your workflow yet.

- **We do:** deploy the execution runtime and local model serving on your hardware or a compact edge appliance; issue KYA agent identity that resolves locally, with no reachable control plane; stand up the Article 12 log writer against local durable storage; wire the kill path operator → running agent with no network hop.
- **You do:** hardware placement, power, network segment, operator account provisioning.
- **Exit gate:** the **four locals** demonstrated in isolation with the uplink already down — an agent runs, is identified, writes a record, and can be stopped.
- **Why before the workflow.** Proving the substrate first means a Phase 3 failure is a workflow problem, not a platform problem. If identity or kill authority turns out to need a round-trip, that is the pilot's finding and it is reported at week 5, not discovered at week 11.

### Phase 2 — Workflow integration · weeks 6–9

**Objective.** Your actual control-room workflow, running on the local substrate.

- **We do:** configure the agent set that workflow requires and no more; read-only source-system integration; map each decision point to the Article 12 record schema; implement the degraded-mode behaviour and the reconnect reconciliation order specified in Phase 0.
- **You do:** the workflow owner validates each decision point; the operator is trained on the kill path.
- **Exit gate:** the workflow runs to completion online, with a complete Article 12 record, accepted by its owner.
- **This phase fails if** a step classified core turns out to need the network. That either reclassifies the step or redesigns it — surfaced here, where it is cheap.

### Phase 3 — Severed-uplink acceptance test · weeks 10–11

**Objective.** The binary KPI, announced, witnessed and recorded.

- **We do:** a **rehearsal run** first under a short window, with findings fixed; then the acceptance run under the agreed window with your witness present; instrumented capture of all three conditions; observation of reconnection behaviour and verification that reconciliation happens in the specified order.
- **You do:** authorise the window; provide the witness; your operator executes the stop.
- **Exit gate — all three, or it is a negative result:** (i) the workflow ran to completion without network access, (ii) the Article 12 record was written locally throughout, with no gap, (iii) the operator stopped a running agent.
- **Why rehearse.** An unrehearsed test measures the deployment engineer's luck, not the architecture. The rehearsal is where problems are meant to appear.

### Phase 4 — Sizing, report and decision · weeks 12–13

**Objective.** Convert measured behaviour into a production decision.

- **We do:** production hardware sizing derived from your measured load, not a vendor spec sheet; deployment mode confirmed or revised against what the test actually showed; before/after report against the baseline; written recommendation and conversion terms.
- **You do:** decide.
- **Exit gate:** report delivered and walked through. The credit terms below run from here.

## Pricing

|              |                                                                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Price**    | €19,990 fixed                                                                                                                                                                                   |
| **Duration** | 3 months                                                                                                                                                                                        |
| **Hardware** | Supplied as separate price-list lines on the same order (NVIDIA GB10 nodes: `edge-node-gn100`, `LF-DGX-SPARK`, `LF-SITROOM-001`), or customer-owned 100% DGX-compatible hardware. Not credited. |
| **Credit**   | **Credited in full against the €59,990 Aegis onboarding** if you proceed within 6 months                                                                                                        |

**One net price, not two.** The pilot is a staged first payment toward Aegis, not a separate fee on top of it. Proceed after the pilot and your total cost to production is the standard €59,990 onboarding — the €19,990 already paid comes off it, leaving €40,000. The pilot lowers the risk of the platform decision; it does not add to its cost.

If you do not proceed, you keep the architecture, the measurements and the evidence record. Nothing further is owed.

### Exactly what is in scope

**No physical control.** The pilot's agents produce recommendations, decisions and records. They do not control physical equipment: no command reaches a PLC, SCADA system or fieldbus, and the site's own safety functions, including any SIL-rated emergency stop, are not touched. Every recommendation is decided by an operator, and the decision is recorded as a signed event: who decided, what was decided, and whether the recommendation was accepted, changed or rejected.

**The €19,990 includes:** one site, one control-room workflow, and one deployment-mode recommendation; only the agent set that workflow requires; local execution, evidence capture, identity verification, audit logs and human kill authority stood up on your existing hardware or a compact edge appliance; Lifetime World Model (LWM v2) training to your environment, since every Aegis delivery needs it; and production hardware sizing derived from measured behaviour on that workload.

**Outside the credit, stated so there is no ambiguity later:** any hardware procurement or appliance supply; multi-site rollout; industries beyond the one piloted; custom ERP, BIM or SCADA integrations; and the separate **DWS IQ Aegis Implementation Programme** (`DWS-AEGIS-IMPL-001`, €45,000, additive and not credited). The credit is capped at €19,990, applies only against Aegis onboarding, and lapses if you do not proceed within 6 months.

### Commercial summary

| Stage                        | Fee         | Credit applied | Balance due at production rollout                    |
| ---------------------------- | ----------- | -------------- | ---------------------------------------------------- |
| Aegis 3-month pilot          | €19,990     | €19,990 (100%) | €40,000 of the €59,990 onboarding                    |
| Proceed to production        | €40,000     | —              | €0 — onboarding settled; licence from €999/mo begins |
| **Total cost to production** | **€59,990** |                | Unchanged by taking the pilot                        |

**Why the scope is written this tightly.** A pilot priced at a large fraction of the product stops being a pilot and becomes the product under a lower-commitment name. €19,990 is a bounded subset of onboarding, which is what makes crediting it in full defensible rather than a discount in disguise.

## Who it is for

Manufacturing control rooms, dual-use facilities and other critical sites where a network outage is an operational event rather than an inconvenience — and where somebody has to be able to state, to a regulator or a board, what the system did while the link was down.

## Related

- **DWS IQ Aegis** — the full platform (`DWS-AEGIS-001`), €59,990 onboarding + from €999/mo.
- **DWS IQ Aegis Implementation Programme** — the three-phase engagement (`DWS-AEGIS-IMPL-001`), €45,000, additive and not credited.
- Deployment architecture, modes and the control-room requirement: see the Aegis product page.

## Suomeksi

_Teksti v1.8, 01.10.2026. Versiohistoria osion lopussa._

**DWS IQ Aegis -pilotti: yksi pullonkaula ratkaistuna yhdessä tuotantohuoneessa, valvonta tilannehuoneessa**

Aegis on ajoympäristö, jossa työnkulun vaatimat tekoälyagentit tekevät tiukasti johdettua ja valvottua työtä asiakkaan omissa tuotantotiloissa: työ tehdään tuotantohuoneessa (control room) ja sitä valvotaan tilannehuoneessa (situation room), toimittamallamme dedikoidulla laitteistolla. Laitteisto on hinnastomme NVIDIA GB10 Grace Blackwell -luokkaa: yksi solmu (Control Room, Acer Veriton GN100, `edge-node-gn100`, tai NVIDIA DGX Spark, `LF-DGX-SPARK`) tai kaksi yhdistettyä solmua (Situation Room, `LF-SITROOM-001`), sekä Jetson-sensorisolmut ja iPCMax-yhdyskäytävät syötteille. Pilotti toimitetaan meidän laitteillamme tai asiakkaan 100 % NVIDIA DGX -yhteensopivalla laitteistolla; muuta laitteistoa ei käytetä. Pilotti on kokonaistoimitus yhdellä tilauksella: pilotin kiinteä hinta ja laitteisto hinnaston riveinä (laite, asennus `LF-NVIDIA-INSTALL`). Laitteisto ei sisälly 19 990 euron hyvitykseen. Laitekaavio: `docs/sales/AEGIS_PILOT_LAITEKAAVIO_FI.md`. Agentit toimivat asiakkaan määrittelemien syötteiden (sensorit, integraatiot) ja tulostavoitteiden (ohjaussuositukset, raportointitiedot) pohjalta, ja niiden tehtävä on asiakkaan määrittelemien tuotantoprosessien tavoitteiden saavuttaminen ja ylläpitäminen. Agentti suosittelee, operaattori päättää, eikä yksikään komento mene suoraan tuotantolaitteisiin. Jokaisesta vaiheesta jää allekirjoitettu jälki.

Tuotantohuoneessa verkkokatko on tuotantotapahtuma, ei haitta. Siksi Aegiksen vaatimus on, että työ, loki ja pysäytys toimivat ilman verkkoa, ja siksi se testataan yhteys katkaistuna eikä esitetä tarjouksessa.

Toimitusvaiheen ensimmäinen sisäänkäynti on maksullinen pilotti: kolme kuukautta, kiinteä hinta 19 990 euroa, joka hyvitetään kokonaan Aegis-käyttöönotosta, jos jatkatte tuotantoon kuuden kuukauden kuluessa. Laitteita ei hyvitetä, ja ne jäävät tilaajan omaisuudeksi. Työnkulku valitaan vaiheessa 0 asiakkaan omasta kriittisestä prosessitarpeesta, esimerkiksi erätason hiilijalanjäljen mittauksen rajoituksista tai suvereenin tuotannon prosessin pullonkaulasta. Työnkulku on aina asiakaskohtainen, ja se vaatii aloituskatselmoinnin ja pilotointiprojektin asettamisen. Asiakas asettaa projektin johtoon nimetyn henkilön.

Kyseessä on Aegis-tuotteen käyttöönotto pilottitoimituksena. Sopimus jakautuu kahteen osaan: siihen, mikä toistuu jokaisessa toimituksessa, ja siihen, mikä on asiakaskohtaista. Toinen kauppa on halvempi, koska toistuva osa on jo olemassa.

**Toistuva osa (Aegis-tuote, sama jokaisessa toimituksessa):**

- ajoympäristö: skilled agents -parvi, Lifetime World Model v2, paikallinen mallipalvelu, KYA-identiteetti;
- hallinto: Art. 12 -loki, allekirjoitetut päätöstapahtumat, operaattorin pysäytysvalta, päätöspolun kattavuus ja operaattorin aika per päätös;
- hyväksymistesti: kolme ehtoa, asiakas ajaa, eristysmenetelmän portaikko, raportti;
- vaiheen 0 menetelmä: aloituskatselmointi, kriittisyysluokitus, roolien nimeäminen, allekirjoitettu rajaus;
- laitteisto hinnastosta: NVIDIA GB10 -solmut ja niihin liitetyt laitteet, toimitus, asennus ja käyttöönotto (Lifetime Oy).

**Asiakaskohtainen osa (tehdään kerran per asiakas):**

- työnkulku: valitaan vaiheessa 0 asiakkaan kriittisestä prosessitarpeesta, valmis-tila määritellään asiakkaan sanoin;
- sensorit ja syötteet: liityntöjen rakentaminen ja yhdistäminen (Lifetime Oy), syötteiden rajat toimialan, standardien ja asiakkaan laatuvaatimusten mukaan;
- integraatiot: yrityksen infran tietoliikennekanavat, tuotantohuoneen ja tilannehuoneen syötteet, mittarit ja ohjaustasot;
- koulutus: LWM v2:n sovitus asiakasympäristöön ja asiakkaan käyttöhenkilöstön koulutus;
- hyväksynnät: arkkitehtuuri (CIO) ja tietoturva (CISO) asiakkaan toimesta; nimetty projektinjohtaja, operaattori ja työnkulun omistaja.

Hyväksymistestaus syntyy näiden katselmoinnissa ja on asiakkaan ja Lifetime Oy:n yhteinen.

Tuotannolliset syötteet ja niiden rajat määritetään toimialan, standardien ja asiakkaan omien laatuvaatimusten mukaisina.

**Suvereeniteettiluokka** on toimivalta ja omistusketju (`DWS_STANDARDS_LIBRARY.md` §3.6), ja se ilmoitetaan kerroksittain, ei yhdellä sanalla. Pilotissa: toimittaja Lifetime Oy on EU-omisteinen (Tier 1); data, loki ja pysäytysvalta ovat asiakkaan tiloissa asiakkaan omistamalla laitteella, eikä niihin ulotu kolmannen maan tiedonluovutusvelvoite (datataso Tier 1); laskentalaitteisto on NVIDIA:n suunnittelema (teknologiataso Tier 2), mikä kirjataan riskirekisteriin eikä piiloteta. Suvereeniteettiluokkaa ei mitata verkkokaapelin katkaisulla.

**Hyväksymistesti** mittaa kolmea eri asiaa: pysäytysvaltaa, offline-jatkuvuutta ja lokin eheyttä. Asiakas ajaa testin itse ja katkaisee yhteyden omalla menetelmällään:

1. Työnkulku päättyy silti valmis-tilaan.
2. Lokiin ei jää aukkoa.
3. Operaattori pysäyttää käynnissä olevan agentin, ja pysäytys todennetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Kaikkien kolmen on mentävä läpi. Hylätty testi on käyttökelpoinen tulos ja se raportoidaan: tieto maksoi 19 990 euroa eikä laitehankintaa. Ostajan ei tarvitse uskoa mitään, kun hän voi ajaa testin itse.

Kaksi lukua, jotka pilotti tuottaa: päätöspolun kattavuus (kuinka moni agentin suositus päätyi kirjattuun ihmisen päätökseen, keskeytyneet polut mukaan lukien) ja operaattorin aika per päätös. Jokainen päätös tallentuu: kuka päätti, mitä päätettiin, ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se. Hylätyt ja keskeytyneet polut säilyvät lokissa, koska myös ne ovat todistusaineistoa. Sääntelyvaatimukset (EU AI Act art. 12) ovat perustelu, eivät syy ostaa.

**Kenelle.** Pilotin ostaja on se, jolla on päätösvalta pilotoitavaan työnkulkuun ja joka joutuu vastaamaan siihen, miten päätökseen päädyttiin. Titteli riippuu organisaatiosta ja tehtävien jaosta. IT-osasto ja tietoturva hyväksyvät arkkitehtuurin, ja pilotin on annettava CIO:lle ja CISO:lle uskottava arkkitehtuuri, mutta he eivät välttämättä ole ostaja. Pilotin ensimmäisessä vaiheessa (2 viikkoa, ei maksua) nimetään kirjallisesti asiakkaan projektinjohtaja, työnkulun omistaja, operaattori, tekninen yhteyshenkilö ja päätösvastuun kantaja.

**Versiohistoria (FI-osio)**

- v1.0, 01.10.2026: HIC:n alkuteksti kiristettynä; kolme testiä; ostaja = päätösvaltainen henkilö.
- v1.1, 01.10.2026: tuotantohuone, dedikoitu laitteisto, tiukasti johdettu ja valvottu työ.
- v1.2, 01.10.2026: syötteet ja tulostavoitteet; verkkokatko testin syynä; hylätty testi pätevä tulos.
- v1.3, 01.10.2026: hinnaston GB10-solmut (1x/2x) tai 100 % DGX-yhteensopiva; kokonaistoimitus; laitteisto hinnaston riveinä, ei hyvitykseen.
- v1.4, 01.10.2026: Boardy: yksi pullonkaula tuotantohuoneessa, valvonta tilannehuoneessa; asiakas ajaa testin itse; päätöspolun kattavuus ja operaattorin aika per päätös; CIO/CISO hyväksyvät, eivät osta.
- v1.5, 01.10.2026: toimitusvaiheen rajaus; laitteet jäävät tilaajalle; aloituskatselmointi ja projektin asettaminen; LWM v2 kuuluu pilottiin; nimetty projektinjohtaja.
- v1.6, 01.10.2026: vastuut jaettu asiakas / Lifetime Oy / yhdessä; versiointi lisätty.
- v1.7, 01.10.2026: suvereeniteettiluokka (§3.6, toimivalta ja omistusketju) erotettu hyväksymistestistä, joka mittaa pysäytysvaltaa, offline-jatkuvuutta ja lokin eheyttä.
- v1.8, 01.10.2026: sopimus jaettu toistuvaan osaan (ajoympäristö, hallinto, hyväksymistesti, vaiheen 0 menetelmä, laitteisto) ja asiakaskohtaiseen osaan (työnkulku, sensorit, integraatiot, koulutus, hyväksynnät). Pilotti = Aegis-tuotteen käyttöönotto pilottitoimituksena.
