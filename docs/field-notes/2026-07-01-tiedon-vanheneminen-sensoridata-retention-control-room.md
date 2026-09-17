# Field Note: Tiedon vanheneminen — sensoridatan tallennusstrategia Control Roomissa ja Situation Roomissa

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/lifetime-handbook-web-updates-lmyi2g | Date: 01.07.2026 | Changes: Ensimmäinen versio. Vastaa Risto Päärnin field note -pohdintaan rakenteettoman tiedon vanhenemisesta ja tiedonhallinnan riskeistä. Dokumentoi konkreettisen tiedon tallennusstrategian (retention policy) Control Room- ja Situation Room -tuotteiden sensoridatalle: kerrostettu säilytys, omistajuus, pääsynhallinta ja GDPR-perusteet.

Document Status:

- Created: 01.07.2026
- Last Modified: 01.07.2026
- Language: Suomi
- Publication Status: ACTIVE
- Document Type: Field Note / Data Governance Policy

Related Documents:

- `DWS_SECURITY_STANDARD.md` §3.6.1 (Database Backup & Disaster Recovery Controls)
- `docs/KYA_BYO_LIFECYCLE.md` (forensic dump retention, tier-based agent lifecycle)
- `docs/Deputy-Agents-Architecture.md` §9 (Control Room & Situation Room)
- `docs/KONSULTOINNIN_KASIKIRJA_2026.md` §3 (Control Room / Situation Room -tuotteet), §4 (Kyvykkyysontologia / LWM)
- `docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md`

---

- **Date:** 01.07.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** Field-note-pohdinta rakenteettoman tiedon vanhenemisesta organisaatioissa (10 vuoden havaintodata eri toimialoilta) laajennettuna DWS:n omaan Control Room- ja Situation Room -tuoteperheeseen: miten käsittelemme asiakkaan sensoridataa, ja mikä on sen tallennusstrategia.

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Data Governance > Information Lifecycle Management > Industrial Compliance
- **Entities:** Lifetime Oy, DWS IQ 6, Control Room, Situation Room, Lifetime World Model (LWM), GDPR, EU AI Act Art. 12
- **Standards:** GDPR Art. 5(1)(c) (tietojen minimointi), Art. 5(1)(e) (säilytyksen rajoittaminen), EU AI Act Art. 12 (lokitus), NIS2
- **Temporal Context:** 2026-Q3
- **Confidence:** High — perustuu tuotannossa olevaan Article 12 -auditointiarkkitehtuuriin ja olemassa olevaan backup/retention-käytäntöön (`DWS_SECURITY_STANDARD.md` §3.6.1)

---

## 1. Havainto: tekoäly ei luo tiedonhallinnan ongelmaa — se tekee sen näkyväksi

Kymmenen vuoden aikana toistuva havainto rakenteettomasta tiedosta eri toimialoilla:

- vanhentunutta tietoa säilytetään vuosia tai vuosikymmeniä ilman perustetta,
- sama tieto on tallessa useassa paikassa eri versioina,
- käyttöoikeuksia on enemmän kuin tarve edellyttää,
- omistajuus on epäselvä,
- kukaan ei täysin tiedä, mitä ympäristöön on kertynyt.

Sama riski koskee DWS:n omaa tuotetta heti, kun Control Room ja Situation Room alkavat vastaanottaa jatkuvaa sensorivirtaa asiakkaan tiloista. Jos emme määritä eksplisiittistä tallennusstrategiaa, rakennamme asiakkaalle juuri sen ongelman, jota olemme myymässä ratkaisuna.

**Löydös ei ole tiedon olemassaolo — löydös on tieto väärässä paikassa, väärän ikäisenä, väärällä pääsyoikeudella, ilman omistajaa.** Sama periaate pätee sensoridataan kuin henkilötunnuslistaan.

## 2. Mitä sensoridataa Control Room ja Situation Room vastaanottavat

Käsikirjan §3 mukaisesti (`docs/KONSULTOINNIN_KASIKIRJA_2026.md`):

- **Control Room** (Acer Veriton GN100, per toimiala/tehdas) — lokaali LWM Enterprise Model + DWS-alustatuote. Reaaliaikainen compliance-seuranta paikallisella ontologialla. Syötteet: tuotantolinjan anturidata, päästömittarit, ERP-tapahtumat, laadunvarmistusdata, kenttäagenttien havainnot.
- **Situation Room** (2× Acer Veriton GN100) — aggregoi syötteet useista Control Roomeista yhdeksi johtotason tilannekuvaksi. Ei vastaanota raakaa sensoridataa suoraan — vain Control Roomien jo prosessoituja ja ontologisoituja tiivistelmiä.

Kummankaan tuotteen suvereniteetti ei perustu vain sijaintiin vaan **paikalliseen laitteistoon ja paikalliseen World Model -toteutukseen** — data ei poistu asiakkaan hallinnasta oletuksena. Tämä tekee tallennusstrategian määrittelystä asiakkaan, ei DWS:n, vastuulla olevan päätöksen — DWS toimittaa kehyksen ja oletusasetukset.

## 3. Tiedon tallennusstrategia (retention policy)

Neljä kerrosta, kukin oma säilytysaika ja pääsyoikeustaso. Kerrosmalli noudattaa samaa periaatetta kuin olemassa oleva backup-arkkitehtuuri (`DWS_SECURITY_STANDARD.md` §3.6.1: paikallinen → salattu pilvi → toinen sijainti → CI-artefaktit, kukin eri retentioajalla).

### Kerros 1 — Raaka sensorivirta (Hot)

- **Sisältö:** anturisignaali sellaisenaan (lämpötila, päästöanturi, kamerakuva, IoT-telemetria).
- **Säilytys:** Control Room -lokaalilevy, **72 tuntia** oletuksena.
- **Tarkoitus:** reaaliaikainen poikkeamahavainnointi ja agenttien syöte ontologian päivitykseen.
- **Jälkeen:** puretaan (aggregoidaan ontologiaan, kerros 2) tai poistetaan pysyvästi. Raakadataa ei siirretä Situation Roomiin.

### Kerros 2 — Ontologisoitu tiivistelmä (Warm)

- **Sisältö:** LWM-ontologiaan jäsennelty tapahtuma (esim. "päästöraja ylitetty klo 14:32, syy X, korjaava toimi Y") — ei enää raakasignaalia.
- **Säilytys:** Control Room, **13 kuukautta** (kattaa vuosivertailun compliance-raportointia varten: CSRD, CBAM, ETS edellyttävät edellisen vuoden vertailudataa).
- **Pääsy:** asiakkaan nimetyt compliance- ja operatiiviset roolit; DWS-konsultti vain HIC-hyväksynnällä.

### Kerros 3 — Compliance-jälki (Audit, kylmä mutta muuttumaton)

- **Sisältö:** EU AI Act Article 12 -edellyttämä auditointijälki: mitä agentti päätteli, mistä syötteestä, kuka hyväksyi. Hash-ketjutettu, muuttumaton.
- **Säilytys:** **7 vuotta** (linjassa NIS2- ja GDPR-lokitusvaatimusten sekä olemassa olevan Article 12 -käytännön kanssa, ks. `Deputy-Agents-Architecture.md` — 7-year retention, SIEM export capability).
- **Pääsy:** vain auditointitarkoitukseen; ei operatiiviseen käyttöön.

### Kerros 4 — Situation Room -tiivistelmä

- **Sisältö:** useiden Control Roomien johtotason koonti (Atlas-tyyppinen orkestrointinäkymä).
- **Säilytys:** **24 kuukautta** liukuvana ikkunana, vanhin poistuu automaattisesti kuukausittain.
- **Ei koskaan:** raakaa sensoridataa tai yksilöityä henkilödataa — vain toimialatason ja tehdastason aggregaatteja.

### Poikkeus: turvaluokiteltu / kaksikäyttödata (Aegis Defence)

ArgusAgent-SAR-analyysin ja muun kaksikäyttödatan (Reg. (EU) 2021/821) osalta retentio määräytyy asiakkaan omien turvaluokitussääntöjen mukaan, ei DWS:n oletusarvojen mukaan. DWS ei aseta ylärajaa — vain audit-jäljen 7 vuoden vähimmäisvaatimuksen.

## 4. Omistajuus ja pääsynhallinta

Kaksi kysymystä, jotka on ratkaistava ennen käyttöönottoa jokaisella asiakkaalla — ei jälkikäteen:

1. **Kuka omistaa minkäkin ontologiasolmun?** Jokaiselle LWM-ontologian luokalle (10 luokkaa, ks. käsikirja §6) nimetään asiakasorganisaatiosta yksi vastuuhenkilö käyttöönottovaiheessa (Pillar 2 -työnkulussa, konsultti fasilitoi). Ei jaettua omistajuutta — epäselvä omistajuus on sama juurisyy kuin rakenteettoman tiedon ongelmassa.
2. **Kuka pääsee käsiksi mihinkin kerrokseen?** Roolipohjainen pääsy (RLS) kerroksittain — operatiivinen tiimi näkee kerrokset 1–2, compliance-tiimi kerrokset 2–3, DWS-konsultti ei koskaan kerrosta 1 ilman erillistä, aikarajattua HIC-lupaa.

Pääsyoikeuksien laajuus tarkistetaan **neljännesvuosittain** osana Situation Room -katselmusta — ei kertaluonteisena käyttöönottopäätöksenä, joka jää elämään käyttämättömänä vuosia (sama ilmiö kuin havainnossa: "käyttöoikeuksia on enemmän kuin tarve edellyttää").

## 5. GDPR-peruste

- **Art. 5(1)(c) — tietojen minimointi:** Kerros 1 kerää vain sen, mitä poikkeamahavainnointi vaatii; ei tallenneta "varmuuden vuoksi" -periaatteella.
- **Art. 5(1)(e) — säilytyksen rajoittaminen:** jokaisella kerroksella on eksplisiittinen, dokumentoitu ja automatisoitu vanhenemisaika — ei manuaalista "joskus siivotaan" -käytäntöä.
- **Art. 30 — käsittelytoimien seloste:** neljä kerrosta vastaavat suoraan selosteen sarakkeita (käsittelyn tarkoitus, säilytysaika, vastaanottajat).

Jos sensoridata sisältää tunnistettavia henkilöitä (esim. kameravalvonta työmaalla), kerroksen 1 säilytysaikaa **ei pidennetä** ilman erillistä, dokumentoitua käsittelyperustetta — oletus on tiukempi kuin tuotanto-optimoinnin oletus.

## 6. Insight — mitä tästä opimme

AI on peili, joka näyttää tiedonhallinnan todellisen tilan. Sama koskee omaa tuotettamme: jos emme määritä Control Roomille ja Situation Roomille eksplisiittistä, kerrostettua ja automatisoitua tallennusstrategiaa, myymme asiakkaalle uuden sensoridatan kertymän ilman omistajuutta — täsmälleen sen ongelman, jonka olemassa oleva tutkimushavainto kuvaa rakenteettomasta tiedosta yleensä.

"Garbage in, garbage out" pätee myös ontologian rakentamiseen: jos Control Roomiin syötetty raakadata on vanhaa, hajanaista tai ilman selkeää vanhenemisikää, myös siitä johdettu LWM-ontologia ja agenttien päätökset perivät saman heikkouden.

## 7. Next Steps

- [ ] Lisää tämä retention-malli (kerrokset 1–4) tuote-toimitusprosessiin — käsikirjan §3 Control Room / Situation Room -kuvaukseen viittaus tähän field noteen.
- [ ] Tekninen toteutus: automatisoitu vanhenemisajastin Control Room -laitteiston paikalliselle levylle (ei manuaalinen siivous).
- [ ] Käyttöönottokysely (Pillar 2): omistajuuskysymykset 1–2 pakolliseksi osaksi scoping-vaihetta.
- [ ] Harkitse elevointia Core Artifactiksi (`/artifacts/`), kun mallia on sovellettu 3+ asiakkaalla.
