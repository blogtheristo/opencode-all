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

A fixed-price, fixed-duration engagement that proves the complete **local-first operational path** for Aegis on a dedicated NVIDIA CUDA node supplied as price-list lines (a GB10 node, or an x86 industrial PC with an NVIDIA GPU, preferably the brand your site already runs) — **before any production rollout**. The hardware stays your property and is not credited.

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

- **We do:** deploy the execution runtime and local model serving on the NVIDIA CUDA node chosen in Phase 0; issue KYA agent identity that resolves locally, with no reachable control plane; stand up the Article 12 log writer against local durable storage; wire the kill path operator → running agent with no network hop.
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
- **Exit gate:** report delivered, and walked through with you within 14 days of delivery. The credit terms below run from the delivery date; the walk-through date does not move them.

## Pricing

|              |                                                                                                                                                                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Price**    | €19,990 fixed                                                                                                                                                                                                                                                                                                   |
| **Duration** | 3 months                                                                                                                                                                                                                                                                                                        |
| **Hardware** | Supplied as separate price-list lines on the same order: an NVIDIA CUDA platform — a GB10 node from our price list (`LF-DGX-SPARK`, `edge-node-gn100`, `LF-SITROOM-001`) or an x86 industrial PC with an NVIDIA GPU, preferably the brand the site already runs. Remains the customer's property. Not credited. |
| **Credit**   | **Credited in full against the €59,990 Aegis onboarding** if you proceed within 6 months of report delivery, whatever the acceptance result                                                                                                                                                                     |

**One net price, not two.** The pilot is a staged first payment toward Aegis, not a separate fee on top of it. Proceed after the pilot and your total cost to production is the standard €59,990 onboarding — the €19,990 already paid comes off it, leaving €40,000. The pilot lowers the risk of the platform decision; it does not add to its cost.

If you do not proceed, you keep the architecture, the measurements and the evidence record. Nothing further is owed.

### Exactly what is in scope

**No physical control.** The pilot's agents produce recommendations, decisions and records. They do not control physical equipment: no command reaches a PLC, SCADA system or fieldbus, and the site's own safety functions, including any SIL-rated emergency stop, are not touched. Every recommendation is decided by an operator, and the decision is recorded as a signed event: who decided, what was decided, and whether the recommendation was accepted, changed or rejected.

**The €19,990 includes:** one site, one control-room workflow, and one deployment-mode recommendation; only the agent set that workflow requires; local execution, evidence capture, identity verification, audit logs and human kill authority stood up on the NVIDIA CUDA node chosen in Phase 0 (hardware billed as separate price-list lines); Lifetime World Model (LWM v2) training to your environment, since every Aegis delivery needs it; and production hardware sizing derived from measured behaviour on that workload.

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

_Teksti v2.0.15, 01.10.2026. Aiemmat versiot: `docs/sales/aegis-pilot-versions/`. Versiohistoria osion lopussa._

**DWS IQ Aegis -pilotti: yksi pullonkaula ratkaistuna yhdessä tuotantohuoneessa, valvonta tilannehuoneessa**

**Mikä se on.** Aegis on ajoympäristö, jossa työnkulun vaatimat tekoälyagentit tekevät tiukasti johdettua ja valvottua työtä asiakkaan omissa tuotantotiloissa. Työ tehdään tuotantohuoneessa (control room), ja sitä valvotaan tilannehuoneessa (situation room). Agentti suosittelee, operaattori päättää. Yksikään komento ei mene suoraan tuotantolaitteisiin, eikä laitoksen omiin turvatoimintoihin kosketa. Jokaisesta vaiheesta jää allekirjoitettu jälki.

**Miksi testataan eikä luvata.** Tuotantohuoneessa verkkokatko on tuotantotapahtuma. Siksi työn, lokin ja pysäytyksen on toimittava ilman verkkoa, ja se todennetaan katkaisemalla yhteys, ei kirjoittamalla se tarjoukseen.

**Pilotti on Aegis-käyttöönoton ensimmäinen vaihe.** Kolme kuukautta, kiinteä hinta 19 990 euroa. Aegis-käyttöönotto (`DWS-AEGIS-001`) maksaa 59 990 euroa, ja pilotin hinta hyvitetään siitä kokonaan, jos jatkatte tuotantoon kuuden kuukauden kuluessa loppuraportin luovutuspäivästä; maksettavaksi jää 40 000 euroa. Ylläpitotilaus (`DWS-AEGIS-SUB-001`) kattaa ajoympäristön ja hallintakerroksen päivitykset ja tietoturvakorjaukset, Lifetime World Model v2:n ja asiakaskohtaisen konfiguraation mallipäivitykset asiakkaan hyväksynnällä sekä tuen ja operoinnin: Standard 999 €/kk (vakiotuki, vasteaika seuraava arkipäivä), Defence 1 999 €/kk (prioriteettituki, vasteaika 4 tuntia tukipyynnön vastaanotosta, ympäri vuorokauden) ja Sovereign 4 999 €/kk (sovittava palvelutaso). Sovereign on tukitason nimi, ei suvereniteettiluokka: luokka määräytyy toimivallasta ja omistusketjusta, ja minkä tahansa luokan asiakas voi ostaa minkä tahansa tukitason. Laitteisto ei sisälly. Integraatiot, joita Lifetime Oy:llä ei ole valmiina, tilataan erikseen ja toteutetaan tuntityönä; Lifetime Oy:n valmiit integraatiot sisältyvät. Hyvitys ei riipu hyväksymistestin tuloksesta: jos testi ei mennyt läpi ja jatkatte silti, hyvitys pätee samoin ehdoin. Laitteisto laskutetaan hinnaston riveinä samalla tilauksella; se ei hyvity ja jää tilaajan omaisuudeksi.

**Vaihe 0 (kaksi viikkoa, ei maksua).** Aloituskatselmointi ja pilotointiprojektin asettaminen. Työnkulku valitaan asiakkaan omasta kriittisestä prosessitarpeesta, ei katalogista, esimerkiksi erätason hiilijalanjäljen mittauksen rajoituksesta tai suvereenin tuotannon prosessin pullonkaulasta. Asiakas nimeää kirjallisesti projektinjohtajan, työnkulun omistajan, operaattorin, teknisen yhteyshenkilön ja päätösvastuun kantajan. Laitekatselmointi vahvistaa laskentasolmun, eristysmenetelmän ja sen, että pilottipaketti läpäisee harjoitusajon valitulla laitteella. Tulos on allekirjoitettu rajaus. Jos työnkululla ei ole määriteltyä valmis-tilaa, sitä ei voi testata, ja se todetaan ennen kuin mitään on maksettu.

**Tuote sisältää kaksi osatoimitusta:**

1. **Aegis-tuote, sama jokaisessa toimituksessa:** ajoympäristö (skilled agents -parvi, Lifetime World Model v2, paikallinen mallipalvelu, agentti-identiteetti); hallinto (EU AI Act art. 12 -loki, allekirjoitetut päätöstapahtumat, operaattorin pysäytysvalta, kaksi mittaria); hyväksymistesti; vaiheen 0 menetelmä.
2. **Asiakaskohtainen toimitus, tehdään kerran per asiakas:** työnkulku; sensorit ja syötteet, joiden rajat määritetään toimialan, standardien ja asiakkaan omien laatuvaatimusten mukaan; vain lukevat integraatiot (MES, historian, DCS, ERP); tietoliikennekanavat sekä tuotanto- ja tilannehuoneen syötteet; mittarit ja ohjaustasot; koulutus; laitteistokokoonpano.

**Vastuut.**

- **Asiakas:** arkkitehtuurin hyväksyntä (CIO) ja tietoturvan hyväksyntä (CISO); nimetyt roolit; sähkö, jäähdytys, kaapelointi ja telinepaikka; verkon eristys asiakkaan omalla kytkimellä tai palomuurilla, tai Lifetime Oy:n toimittamalla teollisuuskytkimellä ja palomuurilla, jotka laskutetaan laiteriveinä. Hyväksymistestin aikana eristystä hallinnoi aina asiakas, ei Lifetime Oy eikä Aegis.
- **Lifetime Oy:** laitekokoonpanon (alla) toimitus, asennus ja käyttöönotto jälleenmyyjänä valmistajan takuu- ja varaosaehdoilla (Lifetime Oy ei ole laitevalmistaja eikä sillä ole valmistajan huoltosopimusta); sensoriliityntöjen rakentaminen ja yhdistäminen; agenttien ja LWM v2:n sovitus asiakasympäristöön; käyttöhenkilöstön koulutus. Koulutuksen toteutuskustannuksen Lifetime Oy kantaa pilotissa. Pilotin aikana asiakkaalla on nimetty yhteyshenkilö Lifetime Oy:ssä ja Standard-tason tuki: tukipyyntöön vastataan seuraavana arkipäivänä.
- **Yhdessä:** katselmoinneissa syntyvä hyväksymistestaus.

**Laitekokoonpano.** Valitaan vaiheen 0 laitekatselmoinnissa ja laskutetaan hinnaston riveinä:

- **Laskentasolmu (NVIDIA CUDA):** `edge-node-gn100` (Control Room, yksi solmu), `LF-DGX-SPARK` (yksi solmu) tai `LF-SITROOM-001` (Situation Room, kaksi solmua); vaihtoehtona x86-teollisuustietokone NVIDIA-näytönohjaimella (rivi lisätään hinnastoon).
- **Asennus ja mallien käyttöönotto:** `LF-NVIDIA-INSTALL`, yksi per solmu.
- **Syötteet:** sensoriyhdyskäytävä `LF-IPCMAX-IPC409`, konenäköyhdyskäytävä `LF-IPCMAX-IPCP68`, OT-yhdyskäytävän alusta `LF-IPCMAX-CINCOZE-DA1200`; reunasensorisolmut `LF-JETSON-NANO`, `LF-JETSON-NX`, `LF-JETSON-AGX`. Energia- ja virtausmittarit sekä sensorihubit lisätään hinnastoon.
- **Turva ja infrastruktuuri:** operaattorin laiteavaimet, operaattorin työasema, lokin kestotallennus, teollisuuskytkin, palomuuri, aikalähde, UPS ja lukittava kaappi lisätään hinnastoon.

**Laitteisto.** NVIDIA CUDA -alusta: hinnastomme GB10-solmu (NVIDIA DGX Spark, Acer GN100, kahden solmun Situation Room) tai x86-teollisuustietokone NVIDIA-näytönohjaimella; ensisijaisesti merkki, jota laitos jo käyttää. Paikallinen mallipalvelu ajaa CUDA:lla. Laitevalinta vahvistetaan vaiheen 0 laitekatselmoinnissa, ei sopimustekstissä.

**Hyväksymistesti.** Testi mittaa kolmea asiaa: offline-jatkuvuutta, lokin eheyttä ja pysäytysvaltaa. Asiakas ajaa testin itse ja katkaisee yhteyden omalla menetelmällään Aegis-pinon yläpuolelta (kytkin, palomuuri tai hypervisor):

1. Työnkulku päättyy valmis-tilaan.
2. Lokiin ei jää aukkoa.
3. Operaattori pysäyttää käynnissä olevan agentin omalla avaimellaan, ja pysäytys todennetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Kaikkien kolmen on mentävä läpi. Hylätty testi on käyttökelpoinen tulos, ja se raportoidaan. Lokin ketju sinetöidään testin alussa ja lopussa, ja sinetin tarkistussumma kirjataan asiakkaan omaan rekisteriin, jotta loki voidaan myöhemmin tarkistaa laatikon ulkopuolelta.

**Mittarit.** Päätöspolun kattavuus (kuinka moni agentin suositus päätyi kirjattuun ihmisen päätökseen, keskeytyneet polut mukaan lukien) ja operaattorin aika per päätös. Jokaisesta päätöksestä tallentuu, kuka päätti, mitä päätettiin ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se; muutos ja hylkäys vaativat perustelun. Hylätyt ja keskeytyneet polut säilyvät, koska myös ne ovat todistusaineistoa. Sääntelyvaatimukset ovat perustelu, eivät syy ostaa.

**Suvereniteettiluokka** on toimivalta ja omistusketju, ja se ilmoitetaan kerroksittain, ei yhdellä sanalla. Toimittaja Lifetime Oy on EU-omisteinen; data, loki ja pysäytysvalta ovat asiakkaan tiloissa asiakkaan omistamalla laitteella; laskentalaitteiston näytönohjain on NVIDIA:n, yhdysvaltalaisen yhtiön, suunnittelema, ja se kirjataan riskirekisteriin eikä piiloteta. Suvereniteettiluokkaa ei mitata verkkokaapelin katkaisulla.

**Omistus.** Lifetime World Model v2 ja sen asiakaskohtainen konfiguraatio, agentit, ajoympäristö ja hallintakerros ovat Lifetime Oy:n; asiakas saa niihin käyttölisenssin, eikä tekijänoikeus siirry. LWM v2:n käyttö kuuluu pilottiin maksutta. Asiakkaan oma data, loki ja päätöstapahtumat, sensorisyötteet, hyväksymistestin raportti, arkkitehtuurikuvaus, mittaukset ja laitteisto ovat asiakkaan. Lifetime Oy päivittää mallin ja konfiguraation; pilotissa päivitys kuuluu pilottiin, tuotannossa Aegis-ylläpitotilaukseen. Päivitys asennetaan asiakkaan hyväksynnällä, ja edellinen versio säilyy palautettavana.

**Pilotin päättyessä.** Hyvitysaika on kuusi kuukautta loppuraportin luovutuspäivästä. Raportti käydään läpi asiakkaan kanssa viimeistään 14 päivän kuluessa luovutuksesta; läpikäynnin ajankohta ei siirrä hyvitysajan alkua. Jatko tuotantoon hyvitysaikana: 19 990 euroa hyvitetään 59 990 euron Aegis-käyttöönotosta, ja käyttölisenssi jatkuu Aegis-lisenssin ja ylläpitotilauksen osana.

**Tarkistettavuus ilman Lifetime Oy:tä.** Kun pilotti päättyy, asiakas saa todistepaketin: lokin, päätöstapahtumat ja pysäytykset operaattorin allekirjoituksineen, hyväksymistestin tuloksen, sinettien tarkistussummat, allekirjoitetun sisällysluettelon sekä kaikki tarkistukseen tarvittavat julkiset avaimet (laitos ja operaattorit roolitietoineen). Paketti sisältää myös lokiformaatin jäädytetyn kuvauksen ja testivektorit: pienen esimerkkilokin, jonka tiivisteet ja allekirjoitukset tunnetaan. Niiden avulla kuka tahansa voi toteuttaa tarkistuksen uudelleen millä tahansa ohjelmointikielellä ja todeta sen oikeaksi vuosienkin päästä, ilman Lifetime Oy:tä ja ilman Aegis-lisenssiä. Formaatti käyttää vain avoimia menetelmiä (JSON-rivit, SHA-256-ketju, Ed25519-allekirjoitukset). Formaattikuvaus ja testivektorit luovutetaan jo vaiheessa 0 arkkitehtuuri- ja tietoturvahyväksynnän aineistona, joten asiakas voi tarkistaa lokia koko pilotin ajan eikä vasta lopussa. **Mitä paketti todistaa ja mitä ei.** Paketti todistaa, ettei lokiin ole tullut havaitsematonta muutosta sinetöinnin jälkeen, ja kuka allekirjoitti minkä pysäytyksen tai päätöksen missä roolissa. Se ei todista, että tapahtumat tapahtuivat niin kuin ne on kirjattu. Ennen sinetöintiä se, jolla on laatikon kirjoitusoikeus ja laitoksen avain, voi kirjoittaa ketjun uudelleen; siksi sinetin tiiviste kirjataan asiakkaan omaan rekisteriin laatikon ulkopuolelle, ja operaattorin allekirjoittamia päätöksiä ei voi muuttaa ilman operaattorin avainta.

**Kenelle.** Ostaja on se, jolla on päätösvalta pilotoitavaan työnkulkuun ja joka joutuu vastaamaan siihen, miten päätökseen päädyttiin. Titteli riippuu organisaatiosta ja tehtävien jaosta. CIO ja CISO hyväksyvät arkkitehtuurin, ja pilotin on annettava heille uskottava arkkitehtuuri, mutta he eivät välttämättä ole ostaja.

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
- v1.9, 01.10.2026: Boardy: laitetoimitus jälleenmyyjänä valmistajan takuulla; ei omaa NVIDIA-huoltosopimusta; asennus hinnaston palvelurivinä, sitepreparaatio asiakkaalla; laitevalinta vaiheen 0 laitekatselmoinnissa, ei sopimustekstissä.
- v1.10, 01.10.2026: koulutuksen toteutuskustannus Lifetime Oy:llä; LWM v2 Lifetime Oy:n tekijänoikeudella suojattu tuote, pilotissa maksuton, tekijänoikeus ei siirry.
- v1.11, 01.10.2026: Boardy: omistus kahdessa osassa (Lifetime Oy: LWM v2 + konfiguraatio, käyttölisenssi; asiakas: data, loki, syötteet, raportti, laitteisto); mallin päivitys Lifetime Oy:llä, tuotannossa ylläpitotilauksessa; päivä 91 kolme vaihtoehtoa. Vaihtoehto 3 (harkinta-aika Standard-hinnalla) on ehdotus, odottaa HIC:tä.
- v1.12, 01.10.2026: HIC: pysy x86:ssa, Arm-pohjainen pino ei päde. GB10/DGX Spark/GN100/Jetson pois pilotin laskentasolmuista; ensisijaisesti asiakkaan jo käyttämä merkki (Beckhoff, Siemens), muuten hinnaston x86-solmu.
- v1.12, 01.10.2026: (virhe) x86-only; perustui Boardyn ehdotukseen, jonka tulkitsin HIC:n päätökseksi.
- v2.0, 01.10.2026: kovennettu teksti. Laitteistoportti NVIDIA CUDA -alusta (GB10 tai x86 + NVIDIA), x86-only kumottu (HIC). Vaihe 0 omaksi kappaleeksi, harjoitusajo valitulla laitteella. Sinetöinti testin alussa ja lopussa. Päivä 91 -vaihtoehto 3 poistettu (ei HIC-hyväksyntää). Sisäiset tiedostopolut poistettu julkisesta tekstistä. Versiot arkistoitu.
- v2.0.1, 01.10.2026: HIC: epäselvä lause "toinen kauppa on halvempi…" korvattu muodolla "Tuote sisältää kaksi osatoimitusta: 1. … 2. …".
- v2.0.2, 01.10.2026: HIC: epäselvä "tai toimittamallamme" tarkennettu: kytkin ja palomuuri laiteriveinä (SKU-ehdotukset `LF-NET-SWITCH`, `LF-NET-EDGE-FW`, hinta TBD); eristystä hallinnoi testissä asiakas.
- v2.0.3, 01.10.2026: HIC: "laitteiston toimitus" tarkennettu laitekokoonpanoksi SKU-tasolla; hinnastossa olevat rivit nimetty, puuttuvat merkitty "lisätään hinnastoon".
- v2.0.4, 01.10.2026: Boardyn huomio (auditoitu, pitää): tarkistettavuus ilman Lifetime Oy:tä lisätty. Perusta: `export`/`verify-bundle` (`src/aegis/pilot/bundle.ts`). Lupaus antaa tarkistimen lähdekoodi asiakkaalle odottaa HIC:n lisenssipäätöstä.
- v2.0.5, 01.10.2026: Boardy: hyvitysikkunan alkupäivä määritelty (loppuraportin luovutus ja läpikäynti, vaihe 4, kuten EN "credit terms run from here"); otsikko "Päivä 91" → "Pilotin päättyessä".
- v2.0.6, 01.10.2026: Boardy (auditoitu, pitää): avaimet ja jäädytetty formaatti + testivektorit lähdekoodikopion sijaan. **Ehto ennen ensimmäistä asiakastoimitusta:** opencode-tehtävä `.claude/done/opencode/aegis-evidence-ten-year-verify.json` (operaattorin allekirjoitus lokiin, formaattikuvaus, testivektorit, Python-tarkistin); tänään operaattorin allekirjoitus ei ole lokissa eikä paketissa.
- v2.0.7, 01.10.2026: Boardy: hyvitysaika alkaa loppuraportin luovutuspäivästä (päivätty), läpikäynti viimeistään 14 päivän kuluessa; Aegis-käyttöönoton hinta 59 990 € ja jäävä 40 000 € samaan kappaleeseen; hyvitys pätee myös, jos testi ei mennyt läpi (kuten EN: ei ehtoa). EN-teksti linjattu. 14 päivää ja tulosriippumattomuus odottavat HIC-vahvistusta.
- v2.0.8, 01.10.2026: Boardyn muotoilu tarkistettu koodia vasten (6/8 osaa toimii tänään; operaattorin allekirjoitus ja formaattikuvaus + testivektorit odottavat opencode-tehtävää `aegis-evidence-ten-year-verify`). Lisätty: formaattikuvaus ja testivektorit luovutetaan jo vaiheessa 0.
- v2.0.9, 01.10.2026: Boardy: ylläpitotilauksen sisältö lisätty (lähteet: `products.json` DWS-AEGIS-SUB-001 features/exclusions, `Store/PRODUCT_AEGIS.md:187–189` tiers, HIC 01.10.2026 mallipäivitys ylläpidossa). Boardy hyväksyi v2.0.7:n 14 päivän takarajan ja tulosriippumattoman hyvityksen. Standard-tuen vasteaika puuttuu lähteistä.
- v2.0.10, 01.10.2026: HIC: tuen vasteaika pilotin aikana 48 tuntia. Tuotannon Standard-tason vasteaika edelleen auki.
- v2.0.11, 01.10.2026: HIC-ehdotus: "tilaamattomat integraatiot" → erikseen tilattavat integraatiot tuntityönä, paitsi Lifetime Oy:n valmiit integraatiot. Valmiiden integraatioiden lista ja tuntihinta puuttuvat.
- v2.0.12, 01.10.2026: Boardy + HIC-merkintä: Defence-tuen 4 h lasketaan tukipyynnön vastaanotosta, ympäri vuorokauden (tuotannon ylläpito); pilotin 48 h toimistoaikana. Standard-vasteaika ja toimistoajan kellonajat auki; Sovereign-tukitason nimen törmäys suvereniteettiluokkaan auki.
- v2.0.13, 01.10.2026: HIC: Standard-tuen vasteaika seuraava arkipäivä; pilotin toimistoaika arkipäivisin klo 8–16 Suomen aikaa; Sovereign-tukitason nimi pidetään, ja tekstiin lisätty erottelu suvereniteettiluokasta.
- v2.0.14, 01.10.2026: Boardy (auditoitu, johtopäätös pitää, premissi osin väärin): todistusvoiman rajaus lisätty. Ketju on allekirjoitettu laitoksen avaimella, mutta avain on samassa laatikossa, joten ennen sinetöintiä kirjoitusoikeuden haltija voi kirjoittaa ketjun uudelleen.
- v2.0.15, 01.10.2026: HIC (Boardyn huomio): pilotin 48 h toimistoaikaa poistettu (vastasi noin kuutta työpäivää ja oli heikompi kuin halvin tuotantotaso). Pilotille nimetty yhteyshenkilö ja Standard-taso: vastaus seuraavana arkipäivänä.
