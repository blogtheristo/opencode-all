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

|              |                                                                                                                                                                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Price**    | €19,990 fixed                                                                                                                                                                                                                                                                                                   |
| **Duration** | 3 months                                                                                                                                                                                                                                                                                                        |
| **Hardware** | Supplied as separate price-list lines on the same order: an NVIDIA CUDA platform — a GB10 node from our price list (`LF-DGX-SPARK`, `edge-node-gn100`, `LF-SITROOM-001`) or an x86 industrial PC with an NVIDIA GPU, preferably the brand the site already runs. Remains the customer's property. Not credited. |
| **Credit**   | **Credited in full against the €59,990 Aegis onboarding** if you proceed within 6 months                                                                                                                                                                                                                        |

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

_Teksti v2.0.2, 01.10.2026. Aiemmat versiot: `docs/sales/aegis-pilot-versions/`. Versiohistoria osion lopussa._

**DWS IQ Aegis -pilotti: yksi pullonkaula ratkaistuna yhdessä tuotantohuoneessa, valvonta tilannehuoneessa**

**Mikä se on.** Aegis on ajoympäristö, jossa työnkulun vaatimat tekoälyagentit tekevät tiukasti johdettua ja valvottua työtä asiakkaan omissa tuotantotiloissa. Työ tehdään tuotantohuoneessa (control room), ja sitä valvotaan tilannehuoneessa (situation room). Agentti suosittelee, operaattori päättää. Yksikään komento ei mene suoraan tuotantolaitteisiin, eikä laitoksen omiin turvatoimintoihin kosketa. Jokaisesta vaiheesta jää allekirjoitettu jälki.

**Miksi testataan eikä luvata.** Tuotantohuoneessa verkkokatko on tuotantotapahtuma. Siksi työn, lokin ja pysäytyksen on toimittava ilman verkkoa, ja se todennetaan katkaisemalla yhteys, ei kirjoittamalla se tarjoukseen.

**Pilotti on Aegis-käyttöönoton ensimmäinen vaihe.** Kolme kuukautta, kiinteä hinta 19 990 euroa. Summa hyvitetään kokonaan Aegis-käyttöönotosta, jos jatkatte tuotantoon kuuden kuukauden kuluessa. Laitteisto laskutetaan hinnaston riveinä samalla tilauksella; se ei hyvity ja jää tilaajan omaisuudeksi.

**Vaihe 0 (kaksi viikkoa, ei maksua).** Aloituskatselmointi ja pilotointiprojektin asettaminen. Työnkulku valitaan asiakkaan omasta kriittisestä prosessitarpeesta, ei katalogista, esimerkiksi erätason hiilijalanjäljen mittauksen rajoituksesta tai suvereenin tuotannon prosessin pullonkaulasta. Asiakas nimeää kirjallisesti projektinjohtajan, työnkulun omistajan, operaattorin, teknisen yhteyshenkilön ja päätösvastuun kantajan. Laitekatselmointi vahvistaa laskentasolmun, eristysmenetelmän ja sen, että pilottipaketti läpäisee harjoitusajon valitulla laitteella. Tulos on allekirjoitettu rajaus. Jos työnkululla ei ole määriteltyä valmis-tilaa, sitä ei voi testata, ja se todetaan ennen kuin mitään on maksettu.

**Tuote sisältää kaksi osatoimitusta:**

1. **Aegis-tuote, sama jokaisessa toimituksessa:** ajoympäristö (skilled agents -parvi, Lifetime World Model v2, paikallinen mallipalvelu, agentti-identiteetti); hallinto (EU AI Act art. 12 -loki, allekirjoitetut päätöstapahtumat, operaattorin pysäytysvalta, kaksi mittaria); hyväksymistesti; vaiheen 0 menetelmä.
2. **Asiakaskohtainen toimitus, tehdään kerran per asiakas:** työnkulku; sensorit ja syötteet, joiden rajat määritetään toimialan, standardien ja asiakkaan omien laatuvaatimusten mukaan; vain lukevat integraatiot (MES, historian, DCS, ERP); tietoliikennekanavat sekä tuotanto- ja tilannehuoneen syötteet; mittarit ja ohjaustasot; koulutus; laitteistokokoonpano.

**Vastuut.**

- **Asiakas:** arkkitehtuurin hyväksyntä (CIO) ja tietoturvan hyväksyntä (CISO); nimetyt roolit; sähkö, jäähdytys, kaapelointi ja telinepaikka; verkon eristys asiakkaan omalla kytkimellä tai palomuurilla, tai Lifetime Oy:n toimittamalla teollisuuskytkimellä ja palomuurilla, jotka laskutetaan laiteriveinä. Hyväksymistestin aikana eristystä hallinnoi aina asiakas, ei Lifetime Oy eikä Aegis.
- **Lifetime Oy:** laitteiston toimitus, asennus ja käyttöönotto jälleenmyyjänä valmistajan takuu- ja varaosaehdoilla (Lifetime Oy ei ole laitevalmistaja eikä sillä ole valmistajan huoltosopimusta); sensoriliityntöjen rakentaminen ja yhdistäminen; agenttien ja LWM v2:n sovitus asiakasympäristöön; käyttöhenkilöstön koulutus. Koulutuksen toteutuskustannuksen Lifetime Oy kantaa pilotissa.
- **Yhdessä:** katselmoinneissa syntyvä hyväksymistestaus.

**Laitteisto.** NVIDIA CUDA -alusta: hinnastomme GB10-solmu (NVIDIA DGX Spark, Acer GN100, kahden solmun Situation Room) tai x86-teollisuustietokone NVIDIA-näytönohjaimella; ensisijaisesti merkki, jota laitos jo käyttää. Paikallinen mallipalvelu ajaa CUDA:lla. Laitevalinta vahvistetaan vaiheen 0 laitekatselmoinnissa, ei sopimustekstissä.

**Hyväksymistesti.** Testi mittaa kolmea asiaa: offline-jatkuvuutta, lokin eheyttä ja pysäytysvaltaa. Asiakas ajaa testin itse ja katkaisee yhteyden omalla menetelmällään Aegis-pinon yläpuolelta (kytkin, palomuuri tai hypervisor):

1. Työnkulku päättyy valmis-tilaan.
2. Lokiin ei jää aukkoa.
3. Operaattori pysäyttää käynnissä olevan agentin omalla avaimellaan, ja pysäytys todennetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Kaikkien kolmen on mentävä läpi. Hylätty testi on käyttökelpoinen tulos, ja se raportoidaan. Lokin ketju sinetöidään testin alussa ja lopussa, ja sinetin tarkistussumma kirjataan asiakkaan omaan rekisteriin, jotta loki voidaan myöhemmin tarkistaa laatikon ulkopuolelta.

**Mittarit.** Päätöspolun kattavuus (kuinka moni agentin suositus päätyi kirjattuun ihmisen päätökseen, keskeytyneet polut mukaan lukien) ja operaattorin aika per päätös. Jokaisesta päätöksestä tallentuu, kuka päätti, mitä päätettiin ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se; muutos ja hylkäys vaativat perustelun. Hylätyt ja keskeytyneet polut säilyvät, koska myös ne ovat todistusaineistoa. Sääntelyvaatimukset ovat perustelu, eivät syy ostaa.

**Suvereniteettiluokka** on toimivalta ja omistusketju, ja se ilmoitetaan kerroksittain, ei yhdellä sanalla. Toimittaja Lifetime Oy on EU-omisteinen; data, loki ja pysäytysvalta ovat asiakkaan tiloissa asiakkaan omistamalla laitteella; laskentalaitteiston näytönohjain on NVIDIA:n, yhdysvaltalaisen yhtiön, suunnittelema, ja se kirjataan riskirekisteriin eikä piiloteta. Suvereniteettiluokkaa ei mitata verkkokaapelin katkaisulla.

**Omistus.** Lifetime World Model v2 ja sen asiakaskohtainen konfiguraatio, agentit, ajoympäristö ja hallintakerros ovat Lifetime Oy:n; asiakas saa niihin käyttölisenssin, eikä tekijänoikeus siirry. LWM v2:n käyttö kuuluu pilottiin maksutta. Asiakkaan oma data, loki ja päätöstapahtumat, sensorisyötteet, hyväksymistestin raportti, arkkitehtuurikuvaus, mittaukset ja laitteisto ovat asiakkaan. Lifetime Oy päivittää mallin ja konfiguraation; pilotissa päivitys kuuluu pilottiin, tuotannossa Aegis-ylläpitotilaukseen. Päivitys asennetaan asiakkaan hyväksynnällä, ja edellinen versio säilyy palautettavana.

**Päivä 91.** Jatko tuotantoon kuuden kuukauden kuluessa: 19 990 euroa hyvitetään, ja käyttölisenssi jatkuu Aegis-lisenssin ja ylläpitotilauksen osana. Ei jatkoa: asiakas pitää datansa, lokinsa, raportin, arkkitehtuurikuvauksen, mittaukset ja laitteiston, käyttölisenssi malliin päättyy, eikä mitään ole velkaa.

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
