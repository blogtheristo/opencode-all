# Markkinatutkimus: DWS IQ 7 Aegis Pilot — datakeskukset, kaksoiskäyttö, valmistava teollisuus

---

# VERSION AND AGENT HISTORY

Version: 1.2 [Latest]

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: Claude Code (web) | Session: claude/dws-iq7-aegis-research-lwqxgw | Date: 28.09.2026 | Changes: HIC hyväksyi D7: myytävä luku on päätöspolun kattavuus, toissijainen luku operaattorin aika; € kirjataan tuloksena, ei luvata; PUE ei käytössä. | Harness: Claude Code + CLAUDE.md
- Version: 1.1 [not latest] | Tool: Claude Code (web) | Session: claude/dws-iq7-aegis-research-lwqxgw | Date: 28.09.2026 | Changes: HIC 28.09.2026: operaattorin hyväksyntä kirjataan päätöstapahtumana, ei muistiinpanona (§1.2, D6). Pilotin mittari: päätöspolun kattavuus + operaattorin aika; € tulostapahtumana, PUE ei (§1.3, D7). Myyntisäikeiden kärki on tietue ja pysäytys, optimointi on todistettava asia (§9, D8). | Harness: Claude Code + CLAUDE.md + DWS_MARKET_RESEARCH_STANDARD
- Version: 1.0 [not latest] | Tool: Claude Code (web) | Session: claude/dws-iq7-aegis-research-lwqxgw | Date: 28.09.2026 | Changes: Ensimmäinen versio. Kolmen kohdeteollisuuden tarpeet, nimetyt yritykset ja rahastot, SWOT, GTM-päätösesitys ja myyntisäikeet DWS-AEGIS-PILOT-001:lle. Gemini-syöte (HIC, 28.09.2026) tarkistettu nimi nimeltä; virheet korjattu §6:ssa. HIC-päätös 28.09.2026: ensimmäinen työnkulku on neuvoa-antava (operaattori hyväksyy), ei fyysistä ohjausta. | Harness: Claude Code + CLAUDE.md + DWS_MARKET_RESEARCH_STANDARD + DWS_ROLES_REGISTRY + DWS_TRUTH_STANDARD

Session Links & References:

- Tarjous: `Store/PRODUCT_AEGIS_PILOT.md` (DWS-AEGIS-PILOT-001, €19,990) · `Store/PRODUCT_AEGIS.md` (DWS-AEGIS-001)
- Hinnat: `dws10.com/config/products.json` (DWS-AEGIS-001)
- Valmiusaste ja päivämäärät: `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md` §1, §5.4
- Pilottipaketti: `docs/field-notes/2026-09-28-aegis-pilot-local-first-kit.md`
- Traction: `docs/TRACTION_CANONICAL.md` §2
- Myyntiputki: `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md` (rivit lisätty tästä dokumentista)

Document Status:

- Created: 28.09.2026
- Last Modified: 28.09.2026
- Language: Finnish (EN termit säilytetty)
- Publication Status: INTERNAL — myyntiluonnos. Yhtään viestiä ei lähetetä ennen HIC-hyväksyntää (Approval Request Rule).
- Classification: Internal — Sales Engineering

---

## 0. Päätökset lyhyesti

| #   | Päätös / havainto                                                                                                                                                                                                                                                                      | Tila                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| D1  | Ensimmäinen pilottityönkulku on **neuvoa-antava**: agentti ehdottaa, operaattori hyväksyy, Aegis-tietue todistaa kuka valtuutti, mitä päätettiin ja että agentti voitiin pysäyttää. Ei suoraa SCADA/PLC-ohjausta.                                                                      | **HIC-päätös 28.09.2026**               |
| D2  | Myynnin pääterä: **valmistava teollisuus** ensisijaisena allekirjoituskaistana, **datakeskukset** kumppani- ja CER-kaistana, **kaksoiskäyttö** 2027 volyymikaistana ja rahoituskertomuksena.                                                                                           | Esitys — HIC päättää (§8)               |
| D3  | Geminin tavoite "1 maksettu pilotti **toimitettu ja hyväksytty** 31.12.2026" ei ole saavutettavissa 13 viikon pilotilla, ellei allekirjoitus tapahdu viimeistään ~29.09.2026. Esitys: 31.12.2026 mennessä **1 allekirjoitettu pilotti + Phase 1 -portti läpi**; hyväksyntäajo Q1/2027. | Ristiriita nostettu (Rule 7)            |
| D4  | Myyntiviesteissä ei väitetä "alan ainoa ratkaisu" eikä "isäntäytimen lokista todennettu pysäytys" ennen kuin C4 (OpenShell-eristys) on toimitettu.                                                                                                                                     | Korjaus Gemini-tekstiin                 |
| D5  | Kilpailukenttä muuttui tänään: NVIDIA julkaisi Open Agent Safety Platformin (OpenShell + Sentry) 28.09.2026. Aegiksen erottuvuus on **EU-suvereniteetti + katkaistun yhteyden hyväksyntätesti + Article 12 -todiste**, ei pysäytyskyky sinänsä.                                        | Havainto                                |
| D6  | Operaattorin hyväksyntä kirjataan **allekirjoitettuna päätöstapahtumana** (`human.decide`), ei muistiinpanona eikä `human.override`-tapahtumana. Pilotti tuottaa silloin katkotestin lisäksi ensimmäisen todennettavan päätöspolun: suositus → päätös → toimenpide → tulos.            | **HIC-päätös 28.09.2026** — toteutus C5 |
| D7  | Pilotin myytävä luku on **päätöspolun kattavuus** ja **operaattorin aika päätöstä kohden**. Sähkölaskun € kirjataan jokaisen hyväksytyn suosituksen tulostapahtumana, mutta sitä ei luvata. PUE:ta ei käytetä.                                                                         | **HIC-päätös 28.09.2026**               |
| D8  | Myyntiviestien kärki on **tietue ja pysäytys**; optimointi on se, mitä niillä todistetaan. Energianoptimointityökalujen kanssa ei kilpailla optimoinnin laadulla.                                                                                                                      | HIC 28.09.2026                          |

---

## 1. Tuote ja rajaus, josta myydään

- **Tuote:** DWS IQ Aegis Pilot, 3 kk, **€19,990 kiinteä**, hyvitetään täysimääräisesti €59,990 Aegis-onboardingista jos jatketaan 6 kk sisällä (`Store/PRODUCT_AEGIS_PILOT.md`). Ylläpito alkaen €999/kk (`dws10.com/config/products.json`, DWS-AEGIS-001).
- **Binäärinen hyväksyntä:** yhteys poikki sovitun ikkunan ajan → (i) työnkulku valmistuu, (ii) Article 12 -tietue kirjoittuu paikallisesti ilman aukkoa, (iii) operaattori pysäyttää ajossa olevan agentin. Kaikki kolme tai tulos on negatiivinen.
- **Tila tänään:** Aegis on ennakkotilauksessa, GA syyskuu 2026, pre-revenue (`docs/TRACTION_CANONICAL.md` §2). Pilotin valmiusaste 71 %; 95 % (M4, todistettu staging-hyväksyntä edge-laitteella) tavoite 25.10.2026, P80 08.11.2026 (`docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md` §1).
- **Mitä on rakennettu:** paikallinen Ed25519-identiteetti, fsyncattu hash-ketjutettu todistusloki, operaattorin allekirjoittama pysäytyskomento, kova pysäytys `worker_threads`-tasolla (C1), severed-uplink-hyväksyntätesti `unshare --net`-eristyksessä (PASS) (`docs/field-notes/2026-09-28-aegis-pilot-local-first-kit.md` §2–3).
- **Mitä ei vielä ole:** OpenShell-sandbox ja sen OCSF-tapahtumat allekirjoitettuina tietueina (C4, suunniteltu). Vaatii Linux 6.2+ ja Landlock — Phase 0 -tarkistus (`AEGIS_PILOT_95_READINESS_PLAN.md:125`).

### 1.1 Rajaus: ei fyysistä ohjausta (HIC 28.09.2026)

HIC:n perustelut: (1) pilotin laiteturvallisuus — kenttäväyläohjaus jää pois, (2) yksikään CISO ei päästä uutta agenttia suoraan chiller- tai syöttöohjaukseen päivänä 1, (3) neuvoa-antava ketju todistaa päätösvallan siirron juuri niin kuin tarjous lupaa.

**Aukko (Rule 12):** HIC viittaa tarjouksen "Luku 3" -lauseeseen _"Pilotin agentit tuottavat päätöksiä, suosituksia ja kirjauksia… Ne eivät ohjaa fyysisiä laitteita."_ Tätä lausetta **ei löydy** repositoriosta (`Store/PRODUCT_AEGIS_PILOT.md`, `sales-package-v1.0/*`, runbookit). Todennäköisesti se on repositorion ulkopuolisessa tarjousdokumentissa. Ehdotus: lisätään sama rajauslause `Store/PRODUCT_AEGIS_PILOT.md` "Exactly what is in scope" -kohtaan ja H1-sopimusliitteeseen — Store-muutos vaatii HIC-hyväksynnän.

### 1.2 Hyväksyntä on päätöstapahtuma, ei muistiinpano (HIC 28.09.2026)

Neuvoa-antava työnkulku on sama tapahtumaketju, joka on jo suunniteltu päätöspolulle (`docs/plans/2026-09-24-decision-journey-outcome-evidence.md` §144–234). Agentti emittoi suosituksen ilman päätöksentekijää. Operaattorin hyväksyntä asettaa päätöksentekijän. Lopputulos kirjataan perään.

| Pilotin ledger-tapahtuma                          | Päätöspolun tapahtuma                              | `decision_by`      | Allekirjoittaja                          |
| ------------------------------------------------- | -------------------------------------------------- | ------------------ | ---------------------------------------- |
| `agent.decide` (suositus)                         | `PATH_RECOMMENDED`                                 | ei ole             | agentin credential                       |
| **`human.decide`** accept / reject / defer (uusi) | `PATH_ACCEPTED` / `PATH_REJECTED` / `PATH_DELAYED` | operaattorin rooli | **operaattorin oma avain**               |
| `tool.invoke` / työnkulun askel                   | `ACTION_STARTED` / `ACTION_COMPLETED`              | —                  | agentti                                  |
| **`outcome.record`** (uusi)                       | `OUTCOME_RECORDED`                                 | —                  | site-avain, viittaa päätöksen seq + hash |
| `human.override` (pysäytys)                       | — (avoin suositus → `PATH_ABANDONED`)              | operaattori        | operaattorin avain                       |

**Tilanne koodissa tänään:** pilottikitin ledgerissä (`src/aegis/pilot/evidence-ledger.ts:46–62`) ei ole hyväksyntätapahtumaa. Hyväksyntä päätyisi joko `agent.decide`-tapahtuman `detail`-kenttään (eli muistiinpanoksi) tai `human.override`-tapahtumaksi. Jälkimmäinen olisi virhe, koska `acceptance.ts:632` tulkitsee `human.override`-tapahtuman pysäytykseksi.

**Suunnittelupäätös (C5, `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md`):**

1. Lisätään `human.decide` ja `outcome.record` ledgerin tapahtumatyyppeihin.
2. Hyväksyntä allekirjoitetaan operaattorin avaimella samalla polulla kuin pysäytyskomento: credential, allekirjoitus, tuoreus ja replay-suoja (`kill-authority.ts`). Se toimii siis myös yhteyden ollessa poikki.
3. Tapahtuma sitoo suosituksen `seq` + `event_hash` → hyväksyntä ei voi koskea eri suositusta kuin sitä, jonka agentti antoi.
4. `decision_by` on rooli (päätöspolun sääntö, ei henkilönimiä). `operator_id` on credentialin avaintunniste (Art. 14(5)); nimen ja avaimen vastaavuus säilyy asiakkaalla.
5. Pysäytys odottavan suosituksen aikana: ledgerissä ei saa olla `human.decide`-tapahtumaa pysäytyksen jälkeen, ja polku päättyy tilaan abandoned.

**Seuraus:** hyväksyntäajo (Phase 3) tuottaa kaksi todistetta yhdestä ledgeristä: katkotestin tuloksen ja ensimmäisen päätöspolun, jossa päätöksentekijä on asiakkaan operaattori (`subject_is_external = true`). Verified Decision Journey vaatii lisäksi `OWNERSHIP_CONFIRMED`-tapahtuman (Phase 0:n allekirjoitettu scope) sekä `LEARNING_DELTA_CREATED`-tapahtuman (Phase 4:n raportti).

### 1.3 Mikä luku muuttuu, kun työnkulku on käytössä

| Luku                                                                                       | Muuttuuko 13 viikossa?                  | Voiko sen kohdistaa Aegikseen?                                          | Käyttö                                                                                                            |
| ------------------------------------------------------------------------------------------ | --------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Päätöspolun kattavuus** (osuus suosituksista, joilla on allekirjoitettu päätös ja tulos) | Kyllä: 0 % → tavoite 100 %              | Kyllä. Luku tulee suoraan ledgeristä                                    | **Myytävä luku.** Tätä energianoptimointityökalu ei tuota                                                         |
| **Operaattorin aika päätöstä kohden** (suosituksesta päätökseen + dokumentointiaika)       | Kyllä, verrattuna Phase 0:n lähtötasoon | Kyllä: ledgerin aikaleimat + lähtötason mittaus                         | Toissijainen, konkreettinen COO:lle                                                                               |
| **Sähkölasku (€)**                                                                         | Mahdollisesti                           | Vain arviona hyväksyttyä suositusta kohden (siirretyt kWh × spot-hinta) | Kirjataan `outcome.record`-payloadiin. Ei luvata                                                                  |
| **PUE**                                                                                    | Ei luotettavasti                        | Ei                                                                      | **Ei käytetä.** Vuositason mittari, johon vaikuttaa kausi (Q4–Q1 vapaajäähdytys), ja energianoptimoijien ydinalue |

**Kausihuomio:** marras–helmikuun pilotissa jäähdytyksen säästöpotentiaali on pienin, ja spot-hinnan vaihtelu on suurin. Talven ensimmäinen työnkulku kannattaa siis rajata kuorman ajoitussuositukseen spot-hinnan mukaan, ei jäähdytyksen asetusarvoihin.

---

## 2. Toimiala 1 — Datakeskukset ja kriittinen digitaalinen infra

### 2.1 Tarpeet 2026–2027

| Ajuri                                     | Tila (lähde)                                                                                                                                                                                                                                                                                                                                                                              | Mitä se tarkoittaa Aegikselle                                                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **CER-direktiivi**                        | Jäsenvaltioiden piti nimetä kriittiset toimijat 17.07.2026 mennessä; "cloud and data centre infrastructure" mukana. Velvoitteet ~10 kk nimeämisestä → **~toukokuu 2027**: riskiarvio, resilienssisuunnitelma, toimittajaketjun vaatimukset. [DLA Piper](https://privacymatters.dlapiper.com/2026/07/eu-cer-directive-enters-a-new-phase-as-critical-entity-designation-deadline-arrives/) | **Vahvin ajuri.** Katkaistun yhteyden testi on suoraa jatkuvuusnäyttöä resilienssisuunnitelmaan. Suomen nimettyjen listaa ei ole julkaistu. |
| **NIS2 / kyberturvallisuuslaki 124/2025** | Voimassa 8.4.2025; Traficomin NCSC-FI valvoo digitaalista infraa. [Traficom](https://kyberturvallisuuskeskus.fi/en/our-activities/regulation-and-supervision/digital-infrastructure-digital-services-and-ict-services)                                                                                                                                                                    | Agenttien identiteetti, pysäytysvalta ja audit-loki operatiiviseen AI:hin.                                                                  |
| **EED-luokitusjärjestelmä**               | Komissio hyväksyi datakeskusten EU-luokituksen delegoidun asetuksen 21.09.2026; ensimmäiset luokitukset 2027. Samalla konsultaatio minimisuoritusvaatimuksista. [Freshfields](https://www.freshfields.com/en/our-thinking/blogs/sustainability/from-reporting-to-rating-the-eus-next-steps-for-data-centres-102o345)                                                                      | Vierustarve. Energia-KPI:t kantaa DCIM/ESG-kumppani; Aegis tuo päätösketjun.                                                                |
| **AI-gigatehtaat (InvestAI €20 mrd)**     | 76 hakemusta, haku sulkeutuu **12.11.2026**, päätökset alku 2027. Nokia-vetoisen konsortion kerrotaan tähtäävän Ouluun (ei vahvistettu). [DCD](https://www.datacenterdynamics.com/en/news/eu-allocates-20bn-to-developing-four-ai-gigafactories/), [mreast](https://www.mreast.eu/2026/09/nokia-bids-for-eu-ai-gigafactory-in-oulu/)                                                      | Konsortiot kirjoittavat hallinto- ja suvereniteettiosioita nyt. Aegis nimettynä hallintakerroksena hakemukseen.                             |
| **Hybridiuhat**                           | Elisan Helsinki–Tallinna-kaapeli vaurioitui 31.12.2025 (Fitburg-alus takavarikoitiin). Supo 10.3.2026: kaikki viat eivät ole sabotaasia. [Euronews](https://www.euronews.com/2026/01/26/finland-steps-up-undersea-monitoring-to-prevent-cable-damage-after-string-of-sabotage-inci)                                                                                                       | Yhteyden menetys on todellinen skenaario, ei hypoteesi.                                                                                     |
| **Hukkalämpö**                            | Fortum aloitti lämmöntuotannon Microsoftin Kolabackenin ja Hepokorven kohteissa 05/2026; tavoite ~40 % alueen kaukolämmöstä. [Fortum](https://www.fortum.com/en/media/2026/05/fortum-has-started-heat-production-two-large-data-centre-sites-finland)                                                                                                                                     | Konesalikatko = kaukolämpökatko → kaksi CER-sektoria kytköksissä. Vahvistaa jatkuvuusperustetta.                                            |
| **Agentit DCIM:ssä**                      | Schneider Electric markkinoi "Agentic AI-Native" -ekosysteemiä; **ei näyttöä** pohjoismaisista operaattoreista, joilla autonomiset agentit ohjaavat tuotannossa.                                                                                                                                                                                                                          | Tulevaisuuden tarve. Siksi D1: neuvoa-antava ensin.                                                                                         |

**Ensimmäinen työnkulku (HIC 28.09.2026):** _Energia- ja jäähdytyskentän optimointiehdotus ja operaattorin hyväksyntäketju._ Agentti lukee lämpökartan, pörssisähkön hinnan ja kuormaennusteen, ehdottaa toimenpiteen; operaattori hyväksyy tai hylkää; tietue sitoo ehdotuksen, hyväksyjän ja pysäytyksen.

### 2.2 Kohdeyritykset

| Yritys                                                                        | Mitä / uutinen                                                                                                                                                                                                                                                        | Laukaisija                                | Aegis-sopivuus · ostajarooli                                                                                     | ★      |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------ |
| **Verda** (ex-DataCrunch, Helsinki/Akaa)                                      | US$189M Series B 22.09.2026, arvo > $1 mrd; suvereniteetti ja GDPR on tuote. [TFN](https://techfundingnews.com/verda-189m-series-b-unicorn-ai-cloud-helsinki/)                                                                                                        | Tuore raha, suvereniteettibrändi          | **Paras suomalainen sopivuus**: Aegis hallintakerroksena Verdan AI Act -asiakkaille (co-sell). R04 CTO, R15 CISO | ★★★★☆  |
| **Telia Finland** (Helsinki DC, 24 MW +4 MW)                                  | Laajennus AI-kysyntään; Gcore GPU-klusteri; hukkalämpö Helsingin kaukolämpöön. [Datacenter Forum](https://www.datacenter-forum.com/telia-company/telia-expands-helsinki-data-center-to-meet-rising-ai-demand)                                                         | NIS2 + CER-operaattori                    | Jatkuvuusnäyttö. R15 CISO, DC-palvelujen johtaja                                                                 | ★★★☆☆  |
| **atNorth** (Kouvola FIN04, 430 MW potentiaali)                               | CPP Investments ~51 %, Equinix ~34 %, Partners Group ~10 %; US$4 mrd kauppa suljettu 02.09.2026. [Equinix](https://newsroom.equinix.com/2026-09-02-CPP-Investments-and-Equinix-Complete-atNorth-Acquisition-to-Support-Growth-of-Leading-Nordic-Data-Center-Platform) | Uudet omistajat, integraatio, monimaa-CER | R15 CISO / Head of Compliance                                                                                    | ★★★☆☆  |
| **Glesys** (osti Vernen Porin ja Tampereen kohteet)                           | Pohjoismainen pilvi, keskikokoinen. Kaupan ajankohta lähteissä ristiriitainen (10/2025 vs 07/2026). [DCD](https://www.datacenterdynamics.com/en/news/verne-sells-two-finnish-data-centers-to-glesys/)                                                                 | Omistajanvaihdos, integraatio             | Keskikokoinen ostaja, nopea päätös. R04 CTO                                                                      | ★★★☆☆  |
| **AI-gigatehdaskonsortio (Nokia/Oulu)**                                       | Hakemus 12.11.2026 mennessä                                                                                                                                                                                                                                           | Hakemusdeadline                           | Aegis nimettynä hallintakerroksena. Kumppanuus, ei myynti                                                        | ★★★☆☆  |
| **Hyperco** (Edgnex/DAMAC, UAE; TikTok-vuokralainen Kouvolassa)               | EU:n ulkopuolinen omistaja + kiinalainen vuokralainen                                                                                                                                                                                                                 | Suvereniteetti-altistus                   | Sovereignty-pisteytys vahva argumentti; ostohalukkuus epävarma                                                   | ★★☆☆☆  |
| **CSC / LUMI AI Factory** (Kajaani)                                           | EuroHPC LUMI-AI-sopimus €387,8M 31.08.2026, käyttöönotto H2 2027. [EuroHPC](https://www.eurohpc-ju.europa.eu/eurohpc-ju-signs-contract-deploy-lumi-ai-supercomputer-2026-08-31_en)                                                                                    | Julkinen hankinta                         | Hilma-seuranta (`/hilma-watch`)                                                                                  | ★★☆☆☆  |
| **Nebius** (Mäntsälä 75 MW; Lappeenranta 310 MW)                              | Iso yhdysvaltalaislistattu neocloud, rakentaa itse                                                                                                                                                                                                                    | Nopea laajentuminen                       | Kumppanuus realistisempi kuin myynti                                                                             | ★★☆☆☆  |
| **UpCloud**                                                                   | Nykyinen Aegis-hostingkumppani; Helsingin kaupungin ydinalusta 03/2026                                                                                                                                                                                                | —                                         | **Kanava/jälleenmyyjä**, ei loppuasiakas                                                                         | Kanava |
| **Equinix (5 DC Helsingissä), Google Hamina (€13 mrd 09.09.2026), Microsoft** | Hyperskaalaajat                                                                                                                                                                                                                                                       | —                                         | Ei ostajia; Google/Microsoft ovat CLOUD Act -altistus, jota Aegis pisteyttää                                     | 0      |

### 2.3 Rahastot ja omistajat (kanava, ei sijoittaja)

Infrarahastot omistavat konesaleja mutta eivät sijoita ohjelmistoyhtiöihin. Niiden arvo on **kanava**: yksi salkkutason hallintostandardi useaan konesaliin.

| Toimija                            | Konesaliomistus (tarkistettu)                                                                                                                 | Rooli                                                         |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **CapMan Infra**                   | Kolo DC (NL, DK, SE; 3 kohdetta EcoDataCenteriltä 2025); Suomessa ei konesaleja. [CapMan](https://capman.com/portfolio/data-centre-platform/) | Kanava Pohjoismaissa, suomalainen omistaja                    |
| **CPP / Equinix / Partners Group** | atNorth                                                                                                                                       | Kanava atNorthiin                                             |
| **EQT Infrastructure**             | EdgeConneX (Skellefteå jopa 1 GW, 02/2026), GlobalConnect                                                                                     | Kanava Ruotsiin; EQT Ventures sijoittaa ohjelmistoon (Evroc)  |
| **Areim**                          | EcoDataCenter                                                                                                                                 | Kanava                                                        |
| **Marguerite II**                  | Conapto (100 %, 07/2026)                                                                                                                      | Kanava                                                        |
| **Ardian**                         | Verne (Keflavík, Helsinki, Mäntsälä 70 MW)                                                                                                    | Kanava                                                        |
| **Tesi, Lifeline Ventures, NIB**   | Verdan rahoittajat (Tesi osittain vahvistettu)                                                                                                | Tesi ja Lifeline myös Lifetime Oy:n sijoittajaehdokkaita (§5) |

---

## 3. Toimiala 2 — Kaksoiskäyttö ja puolustusteollisuus

### 3.1 Tarpeet 2026

| Ajuri                                            | Tila (lähde)                                                                                                                                                                                                                                                               | Mitä se tarkoittaa Aegikselle                                                                                                                                                                                     |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **EU AI Act Art. 2(3) -raja**                    | Poikkeus koskee vain järjestelmiä, joita käytetään **yksinomaan** sotilas-, puolustus- tai kansallisen turvallisuuden tarkoituksiin. Siviilikäyttö → AI Act pätee. [Defence Finance Monitor](https://www.defencefinancemonitor.com/p/eu-ai-act-defence-exemption-boundary) | **Aegiksen ydinkiila.** Yhteiset tuotantolinjat (Nammo/Lapua, Forcit siviiliräjähteet, Patria–Valmet Automotive) eivät ole "yksinomaan" sotilaallisia → Art. 12 -lokitus ja ihmisvalvonta koskevat tehtaan AI:ta. |
| **SAFE €150 mrd lainat**                         | Suomi ~€1 mrd yhteishankintoihin ja droonikyvykkyyteen Ukrainan kanssa. [Valtioneuvosto](https://valtioneuvosto.fi/en/-/finland-to-use-new-eu-loan-financing-to-bolster-defence)                                                                                           | Tuotannon nopea kasvu → uudet linjat ja valvomot.                                                                                                                                                                 |
| **EDIP €1,5 mrd**                                | Työohjelma 30.03.2026; > €700M tuotannon ylösajoon. [EC](https://defence-industry-space.ec.europa.eu/edip-commission-adopts-eu15-billion-work-programme-boost-european-and-ukrainian-defence-industry-2026-03-30_en)                                                       | Asiakkaan ramp-up-rahoitus voi kattaa hallintakerroksen.                                                                                                                                                          |
| **EIC avattu puolustukselle ja kaksoiskäytölle** | Jopa €1,4 mrd, 17.06.2026. [EIC](https://eic.ec.europa.eu/news/european-innovation-council-opens-defence-and-dual-use-technologies-2026-06-17_en)                                                                                                                          | Lifetime Oy:n oma rahoitusreitti. EIC Accelerator seuraava täysi haku **4.11.2026** (toissijainen lähde).                                                                                                         |
| **Kaksoiskäyttöasetus 2021/821**                 | Arviointi käynnissä, julkinen konsultaatio 07/2026, valmis Q4 2026. [regulatory-compliance.eu](https://www.regulatory-compliance.eu/2026/07/24/eu-public-consultation-on-dual-use-export-controls-evaluation-of-the-dual-use-regulation/)                                  | Luokittelusäännöt muuttuvat → ajantasainen vientivalvontatarkistus on myyntiperuste.                                                                                                                              |
| **Suomen puolustusbudjetti**                     | 2026 ~€6,3 mrd, ~2,4–2,5 % BKT:stä. [Valtioneuvosto](https://valtioneuvosto.fi/en/-/236553176/minister-of-defence-antti-hakkanen-finland-will-exceed-nato-s-1.5-target-for-defence-and-security-related-spending-in-2026)                                                  | Kotimainen kysyntä kasvaa.                                                                                                                                                                                        |
| **EDF 2026**                                     | Haku sulkeutui ~29.09.2026.                                                                                                                                                                                                                                                | Suunnittele 2027-kierrokselle.                                                                                                                                                                                    |

**Ensimmäinen työnkulku (D1 mukaisesti):** _Tuotantolinjan vientivalvonta- ja laatupoikkeaman päätösehdotus._ Agentti luokittelee erän/komponentin (siviili vs. sotilas, Annex I -tarkistus), ehdottaa toimenpidettä; vientivalvonnan vastuuhenkilö hyväksyy; tietue säilyy paikallisesti ilmarakoisessa segmentissä.

### 3.2 Kohdeyritykset

| Yritys                                          | Mitä / uutinen                                                                                                                                                                                                                                                                                                                                            | Laukaisija                                                   | Aegis-sopivuus · ostajarooli                                                                                      | ★        |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | -------- |
| **Forcit** (Pori/Noormarkku)                    | TNT-tehdas > €200M, peruskivi 15.09.2026, tuotanto 2028; Puolustusvoimien sopimus €189M. [Forcit](https://forcitgroup.com/news/forcit-plans-to-invest-more-than-eur-200-million-in-the-construction-of-a-new-tnt-production-facility-in-pori-finland/)                                                                                                    | Greenfield, suunnitteluvaihe nyt                             | Hallinta sisään suunnitteluvaiheessa; siviili + puolustus = kaksoiskäyttö. R11 projektijohtaja, R16 OT-tietoturva | ★★★★☆    |
| **Summa Defence** (First North)                 | Droonitehdas-JV TAF Industriesin kanssa Suomeen (04/2026). [United24](https://united24media.com/latest-news/ukraines-taf-industries-and-finlands-summa-defence-partner-to-expand-drone-production-18265)                                                                                                                                                  | Uusi tehdas, Ukrainan vienti → vientivalvonta                | Nopea päätöksenteko, pk-budjetti sopii €19,990:een. R22 CEO, R04 CTO                                              | ★★★★☆    |
| **Patria** (valtio 50,1 %, Kongsberg 49,9 %)    | 6×6-ajoneuvot Valmet Automotiven Uudenkaupungin tehtaalla, ramp-up alku 2027; F135-moottori Linnavuoressa 03.09.2026; AI-WASP-ohjelman vetäjä (€45M); liikevaihto 2025 €1,087 mrd. [Patria](https://www.patriagroup.com/newsroom/news/2026/patria-and-valmet-automotive-to-significantly-expand-their-cooperation-in-the-production-of-armoured-vehicles) | Teknologiansiirto siviiliautotehtaaseen = kaksoiskäyttölinja | R15 CISO, tuotanto-IT, trade compliance. Hidas hankinta; aiempi "defence-industry prime" menetetty (NDA)          | ★★★☆☆    |
| **Nammo** (Lapua, Vihtavuori)                   | Nalliehtehdas €33M Vihtavuoreen, täysi kapasiteetti 2027; tilauskanta NOK 50 mrd. [Lapua](https://www.lapua.com/nammo-builds-primer-factory-in-vihtavuori-finland/)                                                                                                                                                                                       | Uusi tehdas; siviilipatruunat + lataustarvikkeet             | Selvä kaksoiskäyttö + huoltovarmuus. Suomen tehdasjohto                                                           | ★★★☆☆    |
| **Bittium**                                     | Q2 2026 puolustusmyynti +101 %; NATO-puitesopimus. [Investing](https://www.investing.com/news/company-news/bittium-q2-2026-slides-defence-sales-surge-101-margins-hit-22-93CH-4845278)                                                                                                                                                                    | Kasvu, CRA + AI Act                                          | Parempi **kumppanina** (suojattu viestintä katkotilanteessa)                                                      | ★★☆☆☆    |
| **Insta**                                       | NCIA-kyberturvamarkkinapaikka (09/2026), Lockheed Martin -MoU. [ESD](https://euro-sd.com/2026/09/news/cyber-coms/54001/insta-ncia/)                                                                                                                                                                                                                       | —                                                            | **Integraattori/jälleenmyyjä** puolustusteollisuuteen                                                             | Kanava   |
| **ICEYE, Kuva Space**                           | ICEYE: €450M Series F, arvo > €10 mrd (06/2026). Kuva Space (ex-Reaktor Space Lab): IHI-MoU 07/2026                                                                                                                                                                                                                                                       | —                                                            | **Datakumppanit** ArgusAgentille; liian suuria/vääriä pilotin ostajiksi                                           | Kumppani |
| **Senop** (Patria/Millog)                       | Tähtäimet; Ranskan sopimus 2026                                                                                                                                                                                                                                                                                                                           | —                                                            | Tavoitetaan Patrian kautta                                                                                        | ★★☆☆☆    |
| **Frankenburg** (EE), **Milrem** (EE, EDGE/UAE) | Sotilaskäyttö / UAE-omistus                                                                                                                                                                                                                                                                                                                               | —                                                            | AI Act -argumentti heikko / suvereniteetti ristiriitainen                                                         | ★☆☆☆☆    |

Lisäksi: Turun Security & Dual-Use -klusteri (01/2026) ja Tampereen pk→puolustus-ohjelma [vahvistamaton] — pk-yritykset sopivat €19,990 pilottiin paremmin kuin päähankkijat.

### 3.3 Rahastot (sijoittajat Lifetime Oy:hyn)

| Sijoittaja                        | Teesi ja pohjoismainen ulottuvuus                                                                                                                                                                                                                                   | Sopivuus                          |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| **Expeditions Fund II** (Varsova) | €197M (07/2026), taustalla NIF, BAE, EIF, PFR; kyber mukana. [Expeditions](https://expeditionsfund.com/news-post/expeditions-closes-eu197m-for-fund-ii-to-shape-the-future-of-european-security)                                                                    | **Paras teesisopivuus**           |
| **NATO Innovation Fund** (€1 mrd) | Kaksoiskäyttö, Pohjoismaat painopisteenä; Tesi €35M; johti Kelluun €15M A-kierroksen 04/2026. [EU-Startups](https://www.eu-startups.com/2026/04/finlands-kelluu-raises-e15-million-series-a-led-by-nato-innovation-fund-to-advance-persistent-aerial-intelligence/) | Vahva, vaatii tractionia          |
| **Tesi**                          | €3,9 mrd; NIF, NestAI (Nokia), ICEYE, Verda; ei nimettyä "puolustusohjelmaa".                                                                                                                                                                                       | Vahva, kotimainen, suvereniteetti |
| **Lifeline Ventures**             | ICEYE, Verda; puolustus mainittu                                                                                                                                                                                                                                    | Vahva, lämmin ekosysteemi         |
| **Plural**                        | Frankenburg, Helsing                                                                                                                                                                                                                                                | Keskitaso                         |
| **Project A**                     | €325M, sis. puolustuksen, €1–8M liput                                                                                                                                                                                                                               | Keskitaso                         |
| **Join Capital III**              | €235M tavoite, EIF €50M (03/2026), puolustus/kaksoiskäyttö                                                                                                                                                                                                          | Keskitaso                         |
| **Voima Ventures**                | €100M Fund III, €0,2–3M liput, VTT-juuret; ei puolustusrahastoa                                                                                                                                                                                                     | Keskitaso (deep tech)             |
| **Darkstar** (Tallinna)           | €25M tavoite, painottaa taistelussa todennettua                                                                                                                                                                                                                     | Heikko                            |

---

## 4. Toimiala 3 — Valmistava ja prosessiteollisuus

### 4.1 Tarpeet 2026–2028

| Ajuri                                                               | Tila (lähde)                                                                                                                                                                                                                                                                                                                                                                                      | Mitä se tarkoittaa Aegikselle                                                                                                                        |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cyber Resilience Act -raportointi**                               | Voimassa **11.09.2026**: aktiivisesti hyödynnetyt haavoittuvuudet ja vakavat häiriöt ENISAlle/CSIRTille 24 h / 72 h; sakko jopa €15M tai 2,5 %. [EC](https://digital-strategy.ec.europa.eu/en/policies/cra-reporting)                                                                                                                                                                             | **Kuuma laukaisija tässä kuussa** OEM-valmistajille, joiden laitteissa on digitaalisia elementtejä (Metso, Valmet, Wärtsilä, Kone, Ponsse, Glaston). |
| **CBAM**                                                            | Lopullinen vaihe 1.1.2026; ensimmäinen vuosi-ilmoitus 2026 tuonnista **30.9.2027**; sertifikaattimyynti 1.2.2027. [EY](https://www.ey.com/en_gl/technical/tax-alerts/eu-adopts-cbam-omnibus-regulation)                                                                                                                                                                                           | ~12 kk aikaa rakentaa auditointikelpoinen päästödata. Climate IQ -yhdistelmä.                                                                        |
| **NIS2**                                                            | Kyberturvallisuuslaki 8.4.2025; Ruotsin Cybersäkerhetslag 15.1.2026 (toissijainen lähde). Koneet, sähkölaitteet, kemikaalit ja öljynjalostus selvästi soveltamisalassa; teräs ja sellu **välillisesti** — tarkista yhtiökohtaisesti.                                                                                                                                                              | Agenttien valvonta ja jäljitettävyys.                                                                                                                |
| **Konedirektiivin korvaava asetus 2023/1230**                       | Sovelletaan **20.1.2027**; ML-pohjaiset turvakomponentit korkean riskin listalle (toissijainen lähde).                                                                                                                                                                                                                                                                                            | Rajaus D1 on tärkeä: Aegis ei ole turvakomponentti eikä kosketa SIL-luokiteltua hätä-seis-piiriä.                                                    |
| **EU AI Act + Digital Omnibus**                                     | Korkean riskin Annex III -määräaika siirtyy **2.12.2027**, Annex I -tuotteet **2.8.2028** (toissijaiset lähteet; asetusnumero tarkistettava EUR-Lexistä). [Gibson Dunn](https://www.gibsondunn.com/eu-ai-act-omnibus-agreement-postponed-high-risk-deadlines-and-other-key-changes/)                                                                                                              | Art. 12/26 on "valmistaudu 2027–28" -viesti, ei kiireellinen. CRA, NIS2 ja CBAM ovat lähiajan koukut.                                                |
| **OT-kiristyshaittaohjelmat**                                       | Norsk Hydro 2019: käsiohjaus, ~$70M kokonaiskustannus. Valmistus 36 % pohjoismaisista kiristysuhreista 2025; JLR:n tehtaat seis > 5 vk 09/2025 (toissijaiset lähteet). **Ei vahvistettua 2025–26 tapausta nimetyissä suomalaisyhtiöissä — älä väitä sellaista.**                                                                                                                                  | "Norsk Hydro ajoi käsin; Aegis pitää päätösketjun ja lokin käynnissä yhteyden ollessa poikki."                                                       |
| **Intialaiset integraattorit agenttisen AI:n kanssa IT/OT-rajalla** | Neste–HCLTech (24.06.2026, "secure edge computing"); Metsä Group–Infosys Topaz Fabric (08/2026); Valmet–Infosys (06/2026). [PR Newswire](https://www.prnewswire.com/news-releases/hcltech-partners-with-neste-for-a-long-term-ai-led-efficiency-transformation-302809349.html), [Infosys](https://www.infosys.com/newsroom/press-releases/2026/collaboration-drive-ai-led-it-transformation.html) | **Uusi kiila:** kun ulkoistettu toimittaja ajaa agentteja OT-rajalla, asiakas tarvitsee **riippumattoman** hallinta- ja todistekerroksen.            |

**Ensimmäinen työnkulku (D1 mukaisesti):** _Annostelun / energiankäytön optimointiehdotus ja valvomon hyväksyntäketju_ — agentti ehdottaa, valvomo-operaattori hyväksyy, tehtaan oma SIL-luokiteltu hätä-seis pysyy koskemattomana.

### 4.2 Kohdeyritykset

| Yritys                                      | Laukaisija (lähde)                                                                                                                                                                                                                                                      | Aegis-sopivuus · ostajarooli                                                                                                                | ★     |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| **Metso**                                   | AI-avusteinen Digital Production Management julkaistiin Metso Summitissa 10.09.2026; Geminex-digitaalinen kaksonen. [Mining Digital](https://miningdigital.com/news/metso-adds-data-led-performance-production-management-tools)                                        | Toimittaa AI:ta asiakkaiden valvomoihin → CRA nyt, kone-/AI Act 2027–28. Aegis OEM-/upotettavana hallintakerroksena. R04 CTO digital, PSIRT | ★★★★☆ |
| **Neste** (Porvoo)                          | HCLTech-sopimus 24.06.2026 AI-valvonta + secure edge. NIS2 (öljynjalostus), CER-ehdokas [vahvistamaton]                                                                                                                                                                 | Riippumaton hallintakerros integraattorin agenteille. R15 CISO, R16 OT-tietoturva                                                           | ★★★★☆ |
| **Metsä Group**                             | Infosys Topaz Fabric agenttinen AI, IT/OT-raja (08/2026)                                                                                                                                                                                                                | Sama kiila kuin Neste. R13 CIO, R15 CISO                                                                                                    | ★★★☆☆ |
| **Outokumpu** (Tornio, Kemi)                | EVOLVE 2026–30; €100M rakenneohjelma; AI-innovaatiohubi (Solita); Palo Alto OT-tietoturva. **Aktiivinen keskustelu** (Climate IQ) `docs/TRACTION_CANONICAL.md` §2                                                                                                       | Lämmin tili → Aegis-pilotti lisämyyntinä; CLOUD Act -kulma pilvialustaan. R02 IP Director (Ari Hirvonen), R11 Plant Director                | ★★★★☆ |
| **Kemira**                                  | **Aktiivinen keskustelu** (Climate IQ). H1/2026 kannattavuuspaine; ei AI/kyber-laukaisijaa. NIS2 (kemikaalit)                                                                                                                                                           | Lämmin tili, heikko laukaisija. Kustannuspaineessa €19,990 pilotti on osastotason päätös. R08 Head of Sustainability                        | ★★★☆☆ |
| **SSAB** (Raahe)                            | Raahe yhä masuuni, ei investointipäätöstä; suurin ETS/CBAM-altistus. [SSAB](https://www.ssab.com/en/company/about-ssab/ssabs-transformation)                                                                                                                            | Päästödata + edge-jatkuvuus siirtymävaiheessa. R08, R15, tehtaanjohtaja                                                                     | ★★★☆☆ |
| **Valmet**                                  | Strateginen arviointi, liiketoimintojen jakoa harkitaan (Q2/2026); DNAe-ohjausjärjestelmät; Infosys-sopimus                                                                                                                                                             | CRA ohjausjärjestelmiin; organisaatiomuutos hidastaa. PSIRT                                                                                 | ★★★☆☆ |
| **Boliden** (Rönnskär, Harjavalta, Kokkola) | Rönnskärin elektrolyysi ramp-up Q4/2026 tulipalon jälkeen                                                                                                                                                                                                               | Uusi valvomo ylösajossa. Cyber Security Service Manager                                                                                     | ★★★☆☆ |
| **Terrafame** (Sotkamo)                     | CRMA strategic project 25.03.2025; strategia 2026–30. [Terrafame](https://www.terrafame.com/newsroom/media-releases/terrafame-s-strategy-for-2026-2030-the-company-will-remodel-its-operational-logic-streamline-processes-and-pursue-growth-through-new-products.html) | Kriittiset raaka-aineet + valtio-omisteinen → EU-suvereniteetti. R13 CIO                                                                    | ★★★☆☆ |
| **Stegra** (Boden)                          | €1,4 mrd kierros 24.06.2026; käynnistysaikataulu arvioinnissa                                                                                                                                                                                                           | Greenfield; ruotsalainen päätöksenteko                                                                                                      | ★★☆☆☆ |
| **Wärtsilä, Kone, Ponsse, Glaston**         | CRA 11.09.2026 (yleinen); ei yhtiökohtaista 2026 AI-uutista                                                                                                                                                                                                             | CRA-kiila, tutki lisää                                                                                                                      | ★★☆☆☆ |

### 4.3 Rahastot

**Teollisuuden PE-rahastot (Gemini-esitys "Operating Partner" -reitti) — tarkistettu:**

| Rahasto            | Toimintamalli (tarkistettu)                                                                                                 | Suomalainen teollisuussalkku                       | Arvio                                                                    |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| **Nordic Capital** | Oma Operations Team + Suomen neuvonantajatiimi, 89 salkkuyhtiötä. [Nordic Capital](https://www.nordiccapital.com/about-us/) | Vähän; painopiste terveys, fintech, tech           | Ainoa, jolla on oikea operatiivinen tiimi; salkku väärä                  |
| **CapMan Buyout**  | Neuvonantajaverkosto, ei nimettyä operatiivista tiimiä                                                                      | Teollisuushistoriaa (Maintpartner, myyty)          | Keskitaso                                                                |
| **Vaaka Partners** | ~€470M, ei muodollista operating partner -tiimiä                                                                            | Hultström (06/2026), Eltrea, Sähkö-Vendelin, Molok | Pienet teollisuusyhtiöt — sopivat pilottihintaan                         |
| **MB Rahastot**    | Senior-asiantuntijaverkosto + hallitustyö                                                                                   | Kotkamills, Protacon, Raksystems                   | Kotkamills (prosessi) + Protacon (teollisuus-IT, mahdollinen **kanava**) |

**Johtopäätös:** Geminin "2–3 Operating Partneria" -reitti on oikea periaate (yksi hyväksyntä → monta salkkuyhtiötä), mutta suomalaisilla mid-market-rahastoilla ei ole operating partner -tiimejä, vaan hallitus- ja asiantuntijaverkostot. Käytännön ovi on **hallituksen puheenjohtaja tai rahaston partner**, ei "OP". Kovin yhdistelmä: **MB Rahastot (Kotkamills + Protacon)** ja **Vaaka (Hultström, Eltrea)**.

**Sijoittajat / rahoitus Lifetime Oy:lle teollisuuskaistalta:** Tesi, Voima Ventures (€0,2–3M), ABB Ventures ($0,5–10M, teollinen AI ja kyber), EIC Accelerator (4.11.2026), Business Finland Deep Tech Accelerator (≤ €400k/vaihe; vahvista businessfinland.fi:stä). Siemens Next47 heikko: Siemens ilmoitti 04/2026 suuntaavansa teollisen AI:n investoinnit USA:han EU-sääntelyn vuoksi — käytä vastakertomuksena ("EU-compliance on tuote").

---

## 5. Kilpailukenttä 28.09.2026

| Toimija                                                                   | Mitä myy oikeasti (tarkistettu)                                                                                                                                                                                 | Suhde Aegikseen                                                                                                                                                                            |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **NVIDIA OpenShell + Sentry** (Open Agent Safety Platform, GA 28.09.2026) | Apache-2.0 agenttiajoympäristö ydintason eristyksellä; Sentry = BlueField-4-vahtikoira, joka karanteenaa agentin millisekunneissa; > 100 kumppania. [GitHub](https://github.com/NVIDIA/OpenShell)               | **Alusta, ei kilpailija**: Aegis käyttää OpenShelliä eristykseen (C4). Kumppaniseinällä ei ole EU-suvereenia pilvitoimittajaa eikä pohjoismaista teollisuuskonsernia — se aukko on meidän. |
| **EQTY Lab** Verifiable Runtime                                           | Laitteistotodennettu hallinta NVIDIA confidential computingilla + BlueField + OpenShell; Accenture Public Sector puolustuspiloteissa. [BusinessWire](https://www.businesswire.com/news/home/20260318888449/en/) | **Lähin kilpailija.** Ero: USA-riippuvainen piiri ja integraattori; Aegis on EU-omisteinen ja toimii ilman confidential-GPU:ta.                                                            |
| **Diagrid** (Dapr Agents, Catalyst)                                       | Dapr 1.18 (06/2026): workflow-historian allekirjoitus ja attestaatio. [BusinessWire](https://www.businesswire.com/news/home/20260611538698/en/)                                                                 | Päällekkäinen allekirjoitetun audit-ketjun kanssa; ei katkotestiä eikä EU AI Act -kehystä.                                                                                                 |
| **Trend Micro TrendAI**                                                   | Yritystietoturvakerros OpenShell-agenteille, Agentic SIEM.                                                                                                                                                      | Tietoturva, ei päätösvallan todistetta.                                                                                                                                                    |
| **Palantir Foundry / Anduril Lattice**                                    | USA:n NGC2-datakerros                                                                                                                                                                                           | CLOUD Act -altistus (`Store/PRODUCT_AEGIS.md`).                                                                                                                                            |

**Johtopäätös:** pysäytyskyky ja allekirjoitettu loki ovat nyt hygieniatekijöitä. Aegiksen puolustettava ero: **(1) EU-omisteinen, ei CLOUD Act -ulottuvuutta, (2) binäärinen katkaistun yhteyden hyväksyntätesti asiakkaan omassa valvomossa, (3) Article 12 -tietue, joka ei katkea häiriön aikana, (4) kiinteä €19,990 hinta, joka hyvitetään.**

---

## 6. Gemini-syötteen tarkistus (HIC 28.09.2026)

| Gemini-väite                                                                     | Tulos                    | Korjattu tieto                                                                                                                     |
| -------------------------------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Verne Global                                                                     | Oikein, vanhentunut nimi | "Verne", omistaja Ardian; Pori ja Tampere myyty Glesysille                                                                         |
| Atman                                                                            | Väärä kohdemaa           | Puolalainen operaattori (Varsova, Katowice); ei Pohjoismaissa — poistettu                                                          |
| "Lumi (ex-Ficolo)"                                                               | **Väärin**               | Ficolo → Digital 9 → Verne → Ardian; Tampere nyt Glesysillä. LUMI on CSC:n supertietokone Kajaanissa                               |
| Equinix Nordic                                                                   | Oikein                   | 5 DC Helsingissä, 3 Tukholmassa; ~34 % atNorthista                                                                                 |
| Granlund valvomosofta                                                            | **Väärin**               | Suunnittelu + Granlund Manager (kiinteistöhuolto-SaaS), ei DCIM/valvomo                                                            |
| CapMan Infra konesalit                                                           | Oikein                   | Kolo DC (NL/DK/SE), ei Suomessa                                                                                                    |
| Infranode                                                                        | Osittain                 | Ruotsalainen infrarahasto, ei konesaleja                                                                                           |
| EQT Infra salkkunostot                                                           | Osittain                 | EdgeConneX kyllä; atNorth ei ole koskaan ollut EQT:n                                                                               |
| Patria, Senop, Bittium, ICEYE, Insta                                             | Oikein                   | Senop kuuluu Patria-konserniin (Millog)                                                                                            |
| NATO Innovation Fund, Tesi                                                       | Oikein                   | Tesillä ei nimettyä puolustusohjelmaa                                                                                              |
| **Summa Equity**                                                                 | **Väärin**               | Ei puolustusteemaa; sekoitus Summa Defence Oyj:hin (listattu drooniyhtiö, nyt §3.2 kohde)                                          |
| **Vitosha**                                                                      | **Väärin**               | Bulgarialainen €26M rahasto, ei pohjoismaista yhteyttä — poistettu                                                                 |
| Kemira, Outokumpu, Valmet, Neste, Metsä                                          | Oikein                   | Laukaisijat §4.2                                                                                                                   |
| Vaaka, MB, CapMan Buyout "Operating Partners"                                    | Osittain                 | Ei operatiivisia tiimejä; hallitus-/asiantuntijaverkostot. Vain Nordic Capitalilla oikea Operations Team                           |
| Trend Micro, Diagrid, EQTY Lab "geneeriset hiekkalaatikot"                       | **Väärin luokiteltu**    | Erikoistuneita kerroksia OpenShellin/Dapr:n päällä; EQTY Lab lähin kilpailija (§5)                                                 |
| "Alan ainoa ratkaisu, joka todistaa ettei pysäytyksen jälkeen tapahtunut mitään" | **Ei todennettavissa**   | Poistettu. Nykyinen näyttö: pysäytetty agentti ei kirjoittanut ledgeriin pysäytyksen jälkeen (`acceptance.ts`).                    |
| "Pysäytys todennetaan isäntäpuolen ydinlokista"                                  | **Ei vielä totta**       | C4 OpenShell-OCSF-tapahtumat on suunniteltu, ei toimitettu. Nykyinen: kova pysäytys `worker_threads` (C1) + allekirjoitettu ledger |
| "Freeze–Sever–Sign–Kill"                                                         | Termi ei esiinny repossa | Käytetään kannan omaa kieltä: _severed-uplink acceptance test_, _four locals_                                                      |
| Linux 6.2+ / Landlock -vaatimus                                                  | Oikein                   | `AEGIS_PILOT_95_READINESS_PLAN.md:125`                                                                                             |
| "Art. 12 ja 26 edellyttämä todistusaineisto"                                     | Liian vahva              | Velvoitteet koskevat korkean riskin järjestelmiä; määräajat siirtymässä 2027–28. Muoto: "valmistaa Art. 12 ja 26 -vaatimuksiin"    |
| "1 maksettu pilotti toimitettu ja hyväksytty 31.12.2026"                         | **Aikatauluristiriita**  | Katso D3 ja §8                                                                                                                     |

---

## 7. SWOT — DWS IQ 7 Aegis Pilot (DWS-AEGIS-PILOT-001)

| **Vahvuudet**                                                                                                                             | **Heikkoudet**                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Binäärinen, todennettava hyväksyntä: katkaistun yhteyden testi läpäisty eristetysti (PASS) ja negatiivinen tulos on hyväksytty lopputulos | Pre-revenue; ei Aegis-referenssiä. Aiempi puolustuksen päähankkija menetetty, Defence Startup Fund hylkäsi 23.4.2026  |
| Paikallinen identiteetti, loki ja pysäytysvalta — ei verkkoriippuvuutta, ei CLOUD Act -ulottuvuutta                                       | Valmiusaste 71 %; 95 % vasta 25.10.2026 (P80 08.11.)                                                                  |
| Kiinteä €19,990, 100 % hyvitys onboardingiin — osastotason päätös, ei hallituksen                                                         | Yhden henkilön myyntikapasiteetti (HIC)                                                                               |
| Phase 0 ilmainen ja portitettu: huono sopivuus paljastuu ennen maksua                                                                     | Ajoympäristövaatimus Linux 6.2+ / Landlock (OpenShell)                                                                |
| EU AI Act Art. 12 -lokituksen hash-ketju + tietoturvakatselmoinnin kriittiset löydökset korjattu testein                                  | Vanhat PLC/kenttäväylät: rajaus digitaalinen vs. fyysinen turvallisuus on kirjoitettava sopimukseen (§1.1 aukko)      |
|                                                                                                                                           | ISO 27001 -sertifiointi vielä tavoitteena                                                                             |
| **Mahdollisuudet**                                                                                                                        | **Uhat**                                                                                                              |
| CER-velvoitteet ~05/2027 datakeskuksille ja muille kriittisille toimijoille                                                               | NVIDIA OpenShell + Sentry (28.09.2026) ja EQTY Lab tekevät pysäytyksestä ja allekirjoitetusta lokista hygieniatekijän |
| CRA-raportointi voimassa 11.09.2026 → OEM-valmistajien kiireellinen tarve                                                                 | AI Act -määräaikojen siirto 2027–28 heikentää kiireellisyyttä                                                         |
| AI Act Art. 2(3): kaksoiskäyttötehtaiden AI ei ole poikkeuksen piirissä                                                                   | Suurten teollisuusyhtiöiden hitaat hankinnat ja rakennejärjestelyt (Valmet, Outokumpu, Kemira)                        |
| Intialaiset integraattorit ajavat agentteja IT/OT-rajalla (Neste, Metsä, Valmet) → riippumattoman hallinnan tarve                         | Asiakas sekoittaa Aegiksen tietoturvatuotteisiin ennen kuin ymmärtää päätösvallan todisteen                           |
| Greenfield-tehtaat nyt (Forcit, Summa Defence, Nammo Vihtavuori, Patria Uusikaupunki)                                                     | Suvereniteetti ≠ ostopäätös, jos budjetti puuttuu; advisory-työnkulku rinnastetaan energianoptimointityökaluun (D8)   |
| AI-gigatehdashaku 12.11.2026; EIC avattu kaksoiskäytölle                                                                                  |                                                                                                                       |
| NVIDIA-kumppaniseinältä puuttuu EU-suvereeni ja pohjoismainen kerros                                                                      |                                                                                                                       |

---

## 8. GTM-päätös (esitys HIC:lle)

### 8.1 Strateginen linja

**Todistusvuosi 2026 → Volyymivuosi 2027** (Gemini-rakenne säilytetty), mutta **kolme kaistaa eri rooleissa** ja rajattu määrä avauksia (ei 20–25 kylmäavausta):

| Kaista                        | Rooli                               | Ensimmäiset 3 kohdetta                                                    | Miksi                                                                |
| ----------------------------- | ----------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **A — Valmistava teollisuus** | **Ensimmäinen allekirjoitus 2026**  | Outokumpu (lämmin), Neste (HCLTech-laukaisija), Metso (CRA + OEM-kerroin) | Lämmin ovi olemassa; CRA voimassa nyt; integraattorikiila            |
| **B — Datakeskukset**         | **Kumppani ja CER-näyttö**          | Verda (co-sell), Telia Finland, gigatehdaskonsortio (12.11.2026)          | Suvereniteetti on heidän tuotteensa; CER ~05/2027                    |
| **C — Kaksoiskäyttö**         | **2027 volyymi + rahoituskertomus** | Forcit (greenfield), Summa Defence (nopea pk), Patria (pitkä sykli)       | AI Act Art. 2(3) -kiila; huoltovarmuus; EIC/NIF/Expeditions-kertomus |

**Rahastoreitti:** Geminin idea säilyy, mutta ovi on **partner/hallituksen puheenjohtaja**: MB Rahastot (Kotkamills + Protacon kanavana) ja Vaaka (Hultström, Eltrea). Yksi hyväksytty pilotti → pyyntö toiseen salkkuyhtiöön.

### 8.2 Ehtolista 31.12.2026 (korjattu D3)

1. **1 allekirjoitettu pilotti** (€19,990) ja **Phase 1 -portti läpi** (neljä paikallista toimintoa todistettu eristyksessä).
2. **M4 saavutettu:** todistettu staging-hyväksyntä edge-laitteella, HIC todistajana (tavoite 25.10.2026).
3. **1 datakeskuskumppanuus** (Verda tai Telia) aiesopimustasolla, tai Aegis nimettynä gigatehdashakemuksessa.
4. **1 rahoitushakemus jätetty** kaksoiskäyttökertomuksella (EIC Accelerator 4.11.2026 tai Business Finland).
5. **Pilottisopimukseen kirjattu fyysisen ohjauksen poissulku** (§1.1).

**Q1/2027:** ensimmäisen pilotin hyväksyntäajo (Phase 3) → ensimmäinen referenssi ja todennettu learning delta. Readiness-suunnitelman mukaan allekirjoitus 16.11.2026 → hyväksyntäajo ~01.02.2027.

**2027 volyymi:** konversiot onboardingiin (€40,000 hyvityksen jälkeen) + ylläpito €999–4,999/kk, rahaston toinen salkkuyhtiö, kaksoiskäyttötehtaat.

---

## 9. Myyntisäikeet (luonnokset — HIC-hyväksyntä ennen lähetystä)

Jokainen säie noudattaa D1:tä (neuvoa-antava), D4:ää (ei vahvistamattomia väitteitä), D8:aa (kärki on tietue ja pysäytys, optimointi on todistettava asia) ja lähettäjäidentiteettiä (`CLAUDE.md` Sender Identity).

### Säie A — Valmistava teollisuus (R15 CISO / R16 OT-tietoturva / valvomopäällikkö)

**Kulma:** _"Kun integraattorin agentti tekee ehdotuksen valvomoon — kenen päätös se on, ja jääkö siitä jälki, kun yhteys katkeaa?"_

```
Aihe: Valvomon ensimmäinen AI-työnkulku — päätösvalta ja todiste myös ilman verkkoyhteyttä

Hei [etunimi],

[Yritys] ajaa AI-avusteista kehitystä IT/OT-rajalla [laukaisija: esim. HCLTech-sopimus 06/2026].
Kun agentti tekee ehdotuksia valvomoon, kaksi kysymystä jää usein auki: kuka hyväksyi
toimenpiteen, ja jatkuuko kirjaus, jos yhteys ulos katkeaa.

DWS IQ Aegis Pilot on 3 kuukauden kiinteähintainen hanke (19 990 €). Siinä teidän oma
ensimmäinen valvomotyönkulku ajetaan paikallisesti. Agentti ehdottaa, operaattori hyväksyy
omalla avaimellaan, ja hyväksyntä kirjataan päätöstapahtumaksi. Agentti ei ohjaa laitteita eikä kosketa tehtaan hätä-seis-piiriä. Lopuksi yhteys katkaistaan
sovitun ikkunan ajaksi, ja mittaamme kolme asiaa: työnkulku valmistuu, EU AI Actin
artiklan 12 mukainen tietue kirjoittuu paikallisesti ilman aukkoa, ja operaattori voi
pysäyttää agentin. Jos jokin ehto ei täyty, saatte sen tiedon kirjallisena — sekin on tulos.

Pilotin hinta hyvitetään kokonaan, jos jatkatte tuotantoon kuuden kuukauden sisällä.
Ensimmäiset kaksi viikkoa (laajuus ja lähtötaso) ovat maksuttomia.

Sopisiko 30 minuuttia [viikko]?

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

**OEM-variantti (Metso/Valmet, R04 CTO digital + PSIRT):** "Toimitatte AI:ta asiakkaidenne valvomoihin; CRA-raportointi on ollut voimassa 11.9.2026 alkaen. Aegis on hallinta- ja todistekerros, jonka voitte upottaa tuotteeseenne."

### Säie B — Datakeskukset (R04 CTO / R15 CISO / infrastruktuurijohtaja)

**Kulma:** _"Kuka hyväksyi agentin ehdotuksen, ja voitteko pysäyttää sen — myös silloin, kun yhteys on poikki? Energiasuositus on vain se, millä tämä todistetaan."_

```
Aihe: Konesalin AI-päätökset — allekirjoitettu tietue ja pysäytys myös ilman verkkoyhteyttä

Hei [etunimi],

Kun AI-agentit tulevat konesalin energian ja kuorman ohjaukseen, tarkastaja ja
CER-resilienssisuunnitelma kysyvät samat kaksi asiaa: kuka hyväksyi agentin ehdotuksen,
ja voiko sen pysäyttää, kun yhteys ulos on poikki.

DWS IQ Aegis Pilot (19 990 €, 3 kk) todistaa molemmat teidän omassa ympäristössänne.
Jokainen agentin suositus kirjataan, ja operaattorin hyväksyntä tai hylkäys allekirjoitetaan
hänen omalla avaimellaan päätöstapahtumaksi. Tuloksena on päätöspolku: suositus, kuka päätti,
mitä tehtiin ja mitä siitä seurasi. Agentti ei ohjaa laitteita. Hyväksyntätestissä yhteys
katkaistaan, ja todennamme, että työnkulku valmistuu, tietue kirjoittuu paikallisesti ilman
aukkoa ja operaattori voi pysäyttää agentin.

Todistettava työnkulku on esimerkiksi kuorman ajoitussuositus sähkön spot-hinnan mukaan.
Optimoinnin laatu ei ole se, mitä myymme — tietue ja pysäytys ovat.

Olemme EU-omisteinen (Lifetime Oy, Espoo), eikä ratkaisu ole riippuvainen yhdysvaltalaisesta
pilvestä.

Sopisiko lyhyt keskustelu [viikko]?

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

**Kumppanivariantti (Verda):** "Asiakkaanne rakentavat agentteja infrastruktuurinne päälle ja kohtaavat EU AI Actin lokitusvaatimukset. Aegis voisi olla hallintakerros, jota tarjoatte heille — EU-suvereeni kokonaisuus, jota NVIDIA-kumppaniseinällä ei vielä ole."

### Säie C — Kaksoiskäyttö (R04 CTO / tuotantojohtaja / vientivalvonnan vastuuhenkilö)

**Kulma:** _"Tehtaan AI ei ole AI Actin puolustuspoikkeuksen piirissä, jos linja palvelee myös siviilimarkkinaa."_

```
Aihe: Kaksoiskäyttölinjan AI — päätösvalta ja tietue ilmarakoisessa ympäristössä

Hei [etunimi],

EU AI Actin puolustuspoikkeus koskee vain järjestelmiä, joita käytetään yksinomaan
sotilaallisiin tarkoituksiin. Kun tuotantolinja palvelee myös siviilimarkkinaa
[esim. siviiliräjähteet / siviilipatruunat], tehtaan AI-järjestelmiin sovelletaan
lokitus- ja ihmisvalvontavaatimuksia.

DWS IQ Aegis Pilot (19 990 €, 3 kk) ajaa yhden päätöstyönkulun eristetyssä segmentissänne:
esimerkiksi erän vientivalvontaluokittelun tai laatupoikkeaman ehdotuksen, jonka vastuuhenkilö
hyväksyy. Tietue siitä, kuka valtuutti, mitä päätettiin ja miten agentti pysäytettiin,
syntyy paikallisesti eikä vaadi pilviyhteyttä. Hyväksyntätestissä yhteys katkaistaan, ja
kolmen ehdon on täytyttävä.

[Laukaisija: esim. uusi tehdas suunnitteluvaiheessa] on hyvä hetki rakentaa tämä sisään
alusta alkaen. Pilotin hinta hyvitetään kokonaan tuotantolisenssistä.

Sopisiko 30 minuuttia [viikko]?

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
```

### Säie D — Rahastot (partner / hallituksen pj)

**Teollisuus-PE (MB Rahastot, Vaaka):** "Yksi hallitustason kysymys salkkuyhtiöillenne vuodelle 2027: kun AI-agentit tulevat valvomoihin, kuka voi todistaa päätösvallan ja jatkuvuuden? Ehdotamme yhtä kiinteähintaista pilottia siinä salkkuyhtiössä, jossa tarve on suurin — ja tuloksen jakamista hallitukselle."

**Sijoittajat (Expeditions, NIF, Tesi, Lifeline):** Käytä olemassa olevaa `/investor-outreach`-prosessia ja `docs/TRACTION_CANONICAL.md` §2 -tekstiä sellaisenaan. Kertomus: EU-suvereeni hallintakerros kaksoiskäyttöteollisuudelle; NVIDIA-seinältä puuttuva kerros; binäärinen katkotesti tehty (PASS). Ei tractionia, jota ei ole kirjattu §2:een.

---

## 10. Päivämäärät (kalenterointi HIC:n päätöksen jälkeen)

| Päivä      | Tapahtuma                                                   |
| ---------- | ----------------------------------------------------------- |
| 04.10.2026 | M1 (readiness 77 %)                                         |
| 25.10.2026 | M4 — todistettu staging-hyväksyntä (95 %)                   |
| 04.11.2026 | EIC Accelerator täysi haku (toissijainen lähde — vahvista)  |
| 12.11.2026 | AI-gigatehdashaku sulkeutuu                                 |
| 16.11.2026 | Tavoite: ensimmäinen pilottiallekirjoitus                   |
| 20.01.2027 | Koneasetus 2023/1230 sovelletaan                            |
| ~05/2027   | CER-velvoitteet nimetyille toimijoille                      |
| 30.09.2027 | Ensimmäinen CBAM-vuosi-ilmoitus                             |
| 02.12.2027 | AI Act Annex III korkea riski (Omnibus, toissijainen lähde) |

---

## 11. Lähteiden laatu

- Kaikki yritys- ja rahastotiedot haettu verkosta 28.09.2026. Osa lähteistä on hakutulosten tiivistelmiä (välityspalvelin esti osan sivuhauista). Toissijaiset lähteet on merkitty.
- **Ei vahvistettu:** Suomen nimettyjen CER-toimijoiden lista, gigatehtaiden esivalinta, Turun/Tampereen puolustusklusterit, Glesys-kaupan päivämäärä, NIS2:n soveltuminen teräs- ja selluyhtiöihin, Digital Omnibus -asetuksen numero.
- **Nimettyjä henkilöitä ei ole tässä dokumentissa**, lukuun ottamatta aiemmin kirjattua Outokumpu R02 -yhteyttä. Seuraava vaihe on tilikohtainen yhteyshenkilöhaku ennen yhtäkään lähetystä (sama käytäntö kuin `SALES_OPPORTUNITIES_PIPELINE.md` Phase 2).
