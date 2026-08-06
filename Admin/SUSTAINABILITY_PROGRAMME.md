# Lifetime Oy — Vastuullisuusohjelma V1 / Sustainability Programme V1

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/add-sustainability-requirements-ffvGj | Date: 19.07.2026 | Changes: Alkuperäinen versio — Lifetime Oy:n Vastuullisuusohjelma V1. Pohjautuu Spondan kymmenen painopistealueen malliin (case Sponda 2026) ja sovitettu Lifetime Oy:n omaan liiketoimintaan (DWS IQ 6 -alusta, Firehorse-sarja, Lifetime Fleet). Sidottu olemassa oleviin agentteihin (emissions-data-analyst, material-oracle, compliance, sitesense) ja skilleihin (/carbon-analysis, /compliance-check, /site-safety, /sovereignty-assess).

Session Links & References:

- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/SUSTAINABILITY_PROGRAMME.md
- Case Sponda: https://sponda.fi/vastuullisuuden-painopistealueet/
- Case Sponda release: https://sponda.fi/releases/spondan-uusi-vastuullisuusohjelma-julkaistu-kunnianhimoisena-tavoitteena-nostaa-60-kiinteistokannasta-a-tai-b-energialuokkaan-jo-tana-vuonna/

Document Status:

- Created: 19.07.2026
- Last Modified: 19.07.2026
- Language: Finnish (primary) & English (section headings)
- Languages Available: Suomi, English
- Classification: Public
- Publication Status: ACTIVE

---

> **Kohderyhmä / Audience:** Lifetime Oy:n asiakkaat, kumppanit, sijoittajat, työntekijät, viranomaiset.
> **Governance owner:** Founder/CEO Risto Anton Päärni. Vuosikatselmus: Q4 2026, seuraava versio V2 vuoden 2027 alussa.

---

## 0. Executive Summary / Tiivistelmä

**FI.** Lifetime Oy on suomalainen EU-suvereeni tekoäly- ja SaaS-yritys, jonka päätuotteet ovat DWS IQ 6 -monetoimijamalli, Firehorse-omnikanavasarja ja Lifetime Fleet -laitealusta. Vastuullisuusohjelmamme V1 mukailee Spondan (2026) kymmenen painopistealueen rakennetta, mutta sovittaa sen SaaS-toimintaan ja siihen, että me _mahdollistamme_ asiakkaidemme (kuten Sponda) omat vastuullisuustavoitteet auditoitavalla, agenttien tuottamalla laskentadatalla. Ohjelmalla on kaksi kerrosta: (a) Lifetime Oy:n oma toiminta ja (b) asiakkaan vastuullisuustavoitteiden vipuvaikutus alustan kautta.

**EN.** Lifetime Oy is an EU-sovereign AI/SaaS company (DWS IQ 6, Firehorse, Lifetime Fleet). This V1 programme mirrors the ten focus areas of Sponda's 2026 programme, adapted to SaaS operations and to how our platform _enables_ customer sustainability targets with agent-computed, auditable data. Two layers: (a) Lifetime Oy's own operations and (b) leverage effect on customers' targets.

---

## 1. Yritys ja soveltamisala / Company & Scope

**Yhtiö / Company:** Lifetime Oy
**Y-tunnus / Business ID:** 0772407-9 · **ALV / VAT:** FI07724079
**Osoite / Address:** Laidunmaanraitti 2 A 25, 02330 Espoo, Suomi
**Founder, CEO:** Risto Anton Päärni · risto.paarni@lifetime.fi · +358 400 319 010

**Sovelluspiiri / Scope:**

- Lifetime Oy:n oma toiminta (Espoo HQ, etätyö, pilvi-infra Suomi/Saksa/Alankomaat).
- Kaikki Lifetime Oy:n omistamat tuotteet: DWS IQ 6, Firehorse-sarja, Lifetime Fleet.
- Toimitusketju (SaaS-alihankkijat, laitetoimittajat, kumppaniverkosto).
- Asiakasprojekteissa toimitetut agentit ja työkalut, joilla asiakkaat mittaavat ja raportoivat omaa vastuullisuuttaan.

**Ohjelman viitekehykset / Frameworks anchored to:**

- **EU-lainsäädäntö:** CSRD/ESRS (E1–E5, S1–S4, G1), EU Taksonomia, EU ETS, CBAM, Fit for 55, EU AI Act, GDPR, NIS2.
- **Standardit:** ISO 27001 (roadmap aktiivinen), ISO 14001 (V2-tavoite), EN 15978 (LCA A1–D).
- **Sisäiset:** `DWS_SECURITY_STANDARD.md`, `DWS_DATA_STANDARD.md`, `DWS_LEGAL_STANDARD.md`, `DWS_SOVEREIGNTY_STANDARD.md`, `AI_AGENT_GUIDELINES.md`.

---

## 2. Periaatteet / Principles

1. **EU-suvereenius by default.** Kaikki asiakasdata ja mallisuoritukset pysyvät EU:ssa (Suomi/Saksa/Alankomaat). Ei CLOUD Act -altistusta. Todentaminen: `/sovereignty-assess`.
2. **Auditoitavuus ennen retoriikkaa.** Jokaisen väitteen (kg CO₂e, taksonomiaprosentit, energialuokat) takana on deterministinen laskenta ja append-only-lokijälki (`src/compliance/scoring-engine.ts`, `debit-credit-ledger.ts`), ei LLM-arviota.
3. **Agenttiavusteinen mittaaminen.** Vastuullisuustyö on agenttien suorittamaa työtä ja ihmisen katselmoimaa tulosta. Agentit: emissions-data-analyst, material-oracle, compliance, sitesense.
4. **Rakennussektori-tapaus etusijalla.** Rakennus- ja kiinteistöasiakkaat (kuten Sponda) ovat V1-fokusala — heidän vaatimuksensa (LEED/BREEAM, CCM7.1/7.2, EN 15978) ovat suoraan alustan mittarit.
5. **12 sääntöä koodissa (CLAUDE.md).** Simplicity first, surgical changes, fail loud — samat säännöt koskevat myös vastuullisuusdataa: ei arvausta, ei hiljaista pyöristystä, ei "onnistui"-viestejä epäonnistumisen päälle.
6. **Kaksitasoinen vaikutus / Two-layer impact.** Oma jalanjälkemme on pieni (SaaS), mutta _asiakkaiden vipuvaikutus_ on merkittävä. Mittaamme molemmat erikseen ja raportoimme ne erikseen.

---

## 3. Kymmenen painopistealuetta / Ten Focus Areas

Rakenne mukailee case Spondan 2026 vastuullisuusohjelmaa, mutta jokainen kohta on sovitettu Lifetime Oy:n omaan toimintaan ja siihen miten alustamme auttaa asiakkaita täyttämään omat vaatimuksensa.

---

### 3.1 Ilmastonmuutoksen hillintä / Climate Change Mitigation

**Oma toiminta / Own operations:**

- Lifetime Oy tavoittelee, että 100 % kulutetusta pilvi- ja konesalienergiasta on uusiutuvaa vuoden 2027 loppuun mennessä. Nykytila mitataan sertifioimalla kaikkien käytettyjen palveluntarjoajien (Hetzner, Scaleway, GCP Belgia/Suomi) energialaadut ja päivittämällä ne vuosittain.
- Espoon HQ-toimipiste ja mahdolliset edge-laitteet (LWM Acer, DGX Spark, Jetson) käyttävät sähköä, jolle vaaditaan alkuperätakuu (GO).
- Scope 1 + 2 + 3 -jalanjälki lasketaan vuosittain `/carbon-analysis`-skillillä (emissions-data-analyst-agentti) ja julkaistaan tässä ohjelmassa vuoden 2027 päivityksessä.

**Asiakasprojektien mahdollistaminen / Customer enablement:**

- Alustamme sisältää valmiit laskentamoottorit, joilla asiakas (esim. Sponda) voi laskea uudisrakennus- ja peruskorjaushankkeidensa elinkaaripäästöt:
  - **material-oracle**-agentti: kappaletason materiaalien A1–D-päästöt EN 15978:n mukaan, EPD-korttien haku, alhaisemman hiilijalanjäljen materiaalien vertailu.
  - **emissions-data-analyst**: rakennushankkeen käyttövaiheen (B6) energiapäästöt, energiatehokkuusluokka-arviointi.
  - **compliance**-agentti: kansallisten (Suomen ympäristöministeriö) ja EU:n voimassa olevien raja-arvojen tarkistus + tulevan 2029 vaatimusajanjakson simulointi.
- Kaikki laskenta on deterministinen (ei LLM-arviointia numeerisissa vaiheissa) ja tulokset viedään append-only-lokiin (`debit-credit-ledger.ts`), josta ne kestävät ulkoisen auditoinnin.

**Mittarit / KPIs (mitattavaksi V2:ssa):**

- Oma toiminta: tCO₂e vuosi, uusiutuvan energian osuus %, energiaintensiivisyys (kWh per asiakas).
- Asiakasvaikutus: alustan kautta laskettu ja raportoitu asiakkaan vältetty CO₂-määrä (kgCO₂e).

---

### 3.2 Ilmastonmuutokseen sopeutuminen / Climate Change Adaptation

**Oma toiminta:**

- Lifetime Oy:n palvelun jatkuvuus on riippuvainen kolmesta pilvialueesta (Suomi ensisijaisena, Saksa ja Alankomaat varalla). Vuosittain päivitetään **ilmastoriskiarvio**, joka kattaa: kuumuus-, tulva- ja myrskyriskit datakeskusalueilla; kaapeli- ja sähköverkkoriskit; jäähdytystehohäiriöt.
- Business continuity -suunnitelma (BCP) sisältää RTO 4 h / RPO 15 min -tason kriittisille komponenteille.

**Asiakasprojektien mahdollistaminen:**

- Rakennus- ja infrahankkeille alustassamme on **regulatory-radar**- ja **compliance**-agenttien tuottama **ilmastoriskimoduuli**: tulvariski-, hulevesi- ja kuumuusstressiraportit tontin sijainnin ja kaavatietojen pohjalta, sekä kytkentä EU:n Fit for 55 -sopeutumissuosituksiin.
- Skill **/site-safety** arvioi työmaan sään ja tuulen sietokyvyn (EN 13001 -tuulivaroitukset nostureille), mikä yhdistää ilmasto- ja tapaturmariskin.

---

### 3.3 Ympäristösertifiointi / Environmental Certification

**Oma toiminta:**

- **Roadmap 2026–2027:**
  - **ISO 27001** — sertifiointi käynnissä (roadmap aktiivinen, kts. `Admin/SECURITY_COMPLIANCE.md` v2.0).
  - **ISO 14001** — tavoite: Stage 1 -auditointi 2027, sertifikaatti 2028.
  - **ISO 42001** (AI Management System) — arviointi 2027 osana EU AI Act -valmistautumista.
- SOC 2 Type II ei ole tavoite EU-suvereeniuden takia; korvaamme sen ISO 27001 + C5 (Saksa) -yhdistelmällä.

**Asiakasprojektien mahdollistaminen:**

- Alustassa on rakennussertifiointien tuki:
  - **LEED® v4.1 BD+C** -kriteeriseuranta (Energy & Atmosphere, Materials & Resources, Innovation).
  - **BREEAM® International New Construction 2016/2021** -kredit­tikartoitus.
  - **WELL v2** -esiselvitys isoihin hankkeisiin (akustiikka, sisäilma, valo, hyvinvointi).
- material-oracle tuottaa sertifiointeja varten vaadittavat EPD-kortit ja M1-luokitusdokumentit.

**Tavoite / Target:** Vuoteen 2028 mennessä Lifetime Oy:n alusta on tunnustettu työkalu vähintään viidessä LEED Platinum tai BREEAM Excellent -tason rakennushankkeessa Suomessa.

---

### 3.4 EU-taksonomia / EU Taxonomy

**Oma toiminta:**

- Lifetime Oy:n oma taloudellinen toiminta on **SaaS-palvelu** (NACE J.62). Nykytilassa se ei ole taksonomia-_kelpoinen_ toimialaltaan (ei mainita CCM/CCA delegoiduissa säädöksissä), mutta se on **taksonomiaa mahdollistava** (enabling): tarjoamme asiakkaille CCM7.1-, CCM7.2- ja CCM7.7-arviointityökaluja.
- Raportoimme taksonomiakelpoisuuden ja -mukaisuuden nollan sijaan realistisesti: 0 % taksonomiakelpoinen liikevaihto, 100 % arvon­lisä _enabling_-asemassa asiakkaan taksonomiatuloksen mahdollistajana.

**Asiakasprojektien mahdollistaminen — Sponda-tapaus esimerkkinä:**

Alustan taksonomia-moduuli tarkistaa uudisrakennus- ja peruskorjaushankkeille CCM7.1/7.2 -kriteerit, mukaan lukien:

| Kriteeri                         | Vaatimus                                                                                           | Alustan tarkistus                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Primäärienergia (PED)            | 10 % alle NZEB-vaatimuksen                                                                         | emissions-data-analyst simuloi PED   |
| Elinkaaren hiilijalanjälki (GWP) | Julkistetaan uudisrakennuksille ≥5000 m²                                                           | material-oracle laskee A1–D EN 15978 |
| Rakennus- ja purkujäte           | 70 % uudelleenkäyttöön / kierrätykseen                                                             | sitesense + jätekartoitus-työnkulku  |
| Sijainti                         | Ei viljelysmaalle, biologisesti monimuotoiselle alueelle, uhanalaisille lajeille tai metsäalueille | biodiversiteetti-tarkistus (§3.7)    |
| Vesitehokkuus                    | Delegoidun säädöksen mukaiset raja-arvot                                                           | osa PED-laskentaa                    |
| Ilmastonmuutokseen sopeutuminen  | Fyysinen ilmastoriskiarvio                                                                         | §3.2 moduuli                         |

**Tavoite:** Jokaisella asiakkaalla, joka käyttää alustaa uudisrakennus- tai peruskorjaushankkeeseen, on hankkeen luovutushetkellä taksonomiakelpoisuuden ja -mukaisuuden auditoitava raportti.

---

### 3.5 Kiertotalous / Circular Economy

**Oma toiminta:**

- **Digitaalinen kiertotalous:** avoimen lähdekoodin uudelleenkäyttö on ohjelmakoodin oletus (ei silo-toteutusta, ei "for future flexibility" -abstraktioita — CLAUDE.md sääntö 2). Bacterial-code-menettely (`AI_AGENT_GUIDELINES.md`) irrottaa uudelleenkäytettävät kyvyt agenttien välillä.
- **Laitekierto:** LWM Acer -, DGX Spark - ja Jetson-laitteille vaaditaan:
  - Alkuperäisen valmistajan **takeback**-ohjelma tai sertifioitu WEEE-käsittelijä käyttöiän lopussa.
  - Vähintään 5 vuoden käyttöikä ennen uusintaa (ei planned obsolescence).
  - Toissijaisilla omistajilla oleva laitehankintakelpoisuus (secondary market).

**Asiakasprojektien mahdollistaminen (rakennushankkeet):**

- **Purkukartoitusagentti**: jo hankkeen esisuunnitteluvaiheessa material-oracle + sitesense tuottavat purkukartoituksen ja uudelleenkäyttöön kelpaavien osien inventaarion tontilta.
- **Aikataulumoduuli** (**schedule-genius**-agentti): allokoi purkuvaiheeseen aikaa kevyeen purkuun ja uudelleenkäyttöön kelpaavien elementtien ehjänä irrottamiseen. Aikataulun oletus on 15 % lisäaika­varaus kevyelle purulle isoissa peruskorjaushankkeissa.
- **Uudelleenkäyttörekisteri**: irrotettujen osien luetteloiminen dws registry -moduuliin, mahdollisuus jälleenmyyntiin partneriverkoston kautta.
- **Muuntojoustavuuden arviointi**: suunnitteluvaiheessa tarkistetaan tilan pitkäikäisyys- ja muunneltavuuskriteerit (BREEAM Mat 06 ja LEED MRc BPDO -kriteerit).
- **EPD- ja M1-vaatimusten tarkistus** hankinnoille (§3.3 sertifioinnit).

**Mittarit:**

- Oma toiminta: WEEE-käsittelyprosentti (tavoite 100 %), avoimen lähdekoodin osuus koodikannasta.
- Asiakas: hankkeen rakennus- ja purkujätteen uudelleenkäyttö- ja kierrätysprosentti (tavoite ≥70 % taksonomian mukaisesti).

---

### 3.6 Kestävä liikkuminen / Sustainable Mobility

**Oma toiminta:**

- **Etätyö-ensin**: Lifetime Oy on remote-first. Espoon HQ:n läsnäolo on vapaaehtoista; sijainti (Laidunmaanraitti 2 A 25, Espoo) on valittu joukkoliikenne- ja pyörätieyhteyksien perusteella.
- Työmatkakorvaukset painottavat joukkoliikennettä ja pyöräilyä; henkilöautot vain kun välttämättömiä (asiakas­tapaamiset, kentältä-mittausajot).
- Emme omista ajoneuvokantaa, joten Scope 1 (mobile combustion) on lähtökohtaisesti 0 t CO₂e.

**Asiakasprojektien mahdollistaminen:**

- Kiinteistöasiakkaiden hankkeisiin alusta tuottaa **liikenneyhteysanalyysin** (SEO-audit + sitesense-yhdistelmä):
  - Etäisyys lähimpään metro/juna/raitiotie-asemaan.
  - Palvelutason arviointi (kauppa, koulu, terveydenhuolto 500 m säteellä).
  - Suositukset pyöräsäilytyksestä, sosiaalitiloista ja sähköautojen latauspisteistä LEED LTc / BREEAM Tra -kriteerien mukaisesti.
- **Lifetime Fleet** -tuotelinjan päästövähennystavoite: käytettyjen sähköautojen kierrätys­markkina, joka tukee kestävän liikkumisen infrastruktuuria.

---

### 3.7 Biodiversiteetti / Biodiversity

**Oma toiminta:**

- Lifetime Oy:n suora luontovaikutus on pieni (SaaS), mutta konesalien maankäyttö-, jäähdytysvesi- ja lämpöpäästöt tunnistetaan pilvitoimittaja-arvioinnissa.
- Toimittajarekisteri (dws registry) laajenee 2026–2027 sisältämään toimittajien EFRAG ESRS E4 (Biodiversity and Ecosystems) -itsearvion.

**Asiakasprojektien mahdollistaminen (rakennushankkeet):**

- Alustan **biodiversiteetti-moduuli** yhdistää:
  - **Ekologinen sijaintitarkistus**: onko tontti viljelysmaata, biologisesti monimuotoista aluetta, uhanalaisten lajien elin­ympäristöä tai metsäalue? (Suorat rasteritietokannat: Syke, Copernicus.)
  - **Rakennusmateriaalien luontovaikutusarvio**: material-oracle liittää jokaiseen EPD:hen valmistuksen luontovaikutuksen (biodiversiteetti-footprint), kun tieto on saatavilla.
  - **Ekologiakonsultin raportin tuki**: alusta pystyy tuomaan sisään ekologin kartoituksen ja seuraamaan ekologisen arvon säilyttämistä ja parantamista projektin läpi.

**Tavoite:** Jokaiselle uudisrakennus­hankkeelle, joka käyttää alustaa, tuotetaan biodiversiteetin nollavaikutus- tai nettopositiivinen -raportti EU-taksonomian DNSH-vaatimusten mukaisesti.

---

### 3.8 Sosiaalinen vastuu ja hyvä hallintotapa / Social Responsibility & Governance

**Oma toiminta:**

- **Työterveys ja -turvallisuus:** Lifetime Oy:llä ei ole omia työmaita; toimistolla työterveyshuolto lakisääteisen mukaisesti. Tavoite: 0 vakavaa työtapaturmaa (vuosittainen mittari).
- **Ihmisoikeudet:** Code of Business Conduct (§4) sitoo kaikkia työntekijöitä, sopimuskumppaneita ja alihankkijoita.
- **AI-vastuu:** EU AI Act -itsearviointi tehty (`Admin/SECURITY_COMPLIANCE.md` v1.7): tuotteet luokitellaan "limited risk" -kategoriaan; Article 12 -lokijärjestelmä aktiivinen (`article-12-annex-iv-log-schema-mapping.md`); KYA (Know Your Agent) -menettely kaikille autonomisille agenteille (Legal/KYA_STANDARD_v1.md, KYA_SECURITY_v1.2.md).
- **Whistleblowing:** EU:n Whistleblowing-direktiivin (2019/1937) mukainen ilmoituskanava avataan Q4 2026.
- **Tasa-arvo ja monimuotoisuus:** EU Pay Transparency -direktiivin mukainen palkkatasa-arvoraportti aloitetaan 2027 (kun henkilöstömäärä ylittää 100).

**Asiakasprojektien mahdollistaminen:**

- **Tavoite 0 vakavaa työmaatapaturmaa** asiakas­hankkeissa, joissa alustaa käytetään:
  - **sitesense**-agentti mittaa työmaan olosuhteet (sää, tuuli, näkyvyys, työntekijöiden lukumäärä).
  - **/site-safety**-skill tuottaa 0–100-turvallisuuspisteytyksen ja EN 13001 -tuulivaroituksen nostureille reaaliajassa.
  - **quality-gate**-agentti pysäyttää työvaiheen automaattisesti, kun turvallisuuspisteytys putoaa alle asiakkaan asettaman rajan.
- **ESG-auditointi**: **compliance**-agentti tuottaa vuosittaisen ESG-auditointi­raportin asiakkaan työmaille (mahdolliset riskit, korjaustoimet, kumppani-​yhteistyö).

---

### 3.9 Sopimuskumppanit ja arvoketju / Contract Partners & Supply Chain

**Code of Business Conduct — Lifetime Oy Kumppanimalli:**

Kaikki sopimuskumppanit (kumppaniverkosto, palveluntarjoajat, alihankkijat) sitoutuvat kirjallisesti seuraaviin sopimuslisäkkeisiin:

1. **DWS Code of Business Conduct** — kirjoitetaan V1-versiona ennen vuoden 2026 loppua (`Partners/CODE_OF_BUSINESS_CONDUCT.md`; ei vielä olemassa, ohjelman ensimmäinen toimenpide, ks. §5 roadmap).
2. Lisäys: kumppani vastaa siitä, että myös **alihankkijat** noudattavat ohjeistusta (chain-of-conduct-lauseke).
3. Lisäys: kumppani sitoutuu ilmoittamaan olennaiset muutokset omassa vastuullisuustilanteessaan (esim. tuomiot, sanktiot, keskeiset ESG-tapahtumat) 30 päivän kuluessa.

**Toimittajahallinnan työkalut:**

| Työkalu                          | Käyttötarkoitus                                                      | Tila                                             |
| -------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| **dws registry** (sisäinen)      | Toimittajien mestari­rekisteri, ESG-itsearvio, sertifikaattiseuranta | Aktiivinen                                       |
| **DWS IQ 6 compliance -agentti** | Kumppanin CSRD/ETS/CBAM-riskipisteytys                               | Aktiivinen                                       |
| **Vastuu Groupin Valvoja**       | Rakennustyömaan verovelvoite- ja YEL-tarkistus                       | Integraatio Q4 2026                              |
| **Shufti (KYC/IDV)**             | Yritys- ja henkilötunnistus, sanktiotarkistus                        | Aktiivinen (`Admin/SECURITY_COMPLIANCE.md` v2.0) |
| **KYA (Know Your Agent)**        | Autonomisten agenttien luottamus­pisteytys ja "leash snap" -katkaisu | Aktiivinen (Legal/KYA_STANDARD_v1.md)            |

**Prosessi:**

1. Ennen sopimusta: Shufti KYC + dws registry -onboarding + Code of Business Conduct -allekirjoitus.
2. Käytön aikana: Valvoja-integraatio (rakennuspuoli), vuosittainen ESG-audit, KYA-seuranta autonomisille agenteille.
3. Poikkeamat: `debit-credit-ledger`-lokimerkintä + tarvittaessa TC-4 Leash Snap -katkaisu (KYA-skill).

---

### 3.10 Lähiympäristö ja käyttäjien hyvinvointi / Local Environment & User Well-Being

**Oma toiminta (SaaS-tuote):**

- **Käytettävyys, saavutettavuus:** EU Accessibility Act (EAA, sovellettavana 28.6.2025 alkaen) -vaatimusten mukaisuus DWS IQ 6 -käyttöliittymälle ja onelifetime.world-, dws10.com- ja dws6.com-sivustoille. WCAG 2.2 AA -taso tavoite kesäkuuhun 2027 mennessä.
- **Digitaalinen hyvinvointi:** ei "dark pattern" -käytäntöjä käyttöliittymissä, ei manipuloivia sitoumus­uusintoja, ei laskutus­yllätyksiä.
- **Yksityisyys:** GDPR-oletukset kaikilla tuotteilla (DPIA-mallit, tietojen minimointi, oikeus poistaa, säilytysajat).

**Asiakasprojektien mahdollistaminen (rakennushankkeet):**

Alusta tuottaa rakennus­hankkeille automatisoidun **lähiympäristö- ja terveys­raportin** sisältäen:

- **Melu- ja pölyseuranta**: sitesense-agentin sensorimoduuli seuraa työmaan melu- ja pölytasoja lähialueen asukkaille asetettujen rajojen suhteen (Suomen ympäristöministeriön ohjeet).
- **Valosaaste**: yöaikaisen työmaavalaistuksen valumaraportti kaavamääräyksiä vastaan.
- **Hulevesien hallinta**: material-oracle + biodiversiteetti-moduuli tarkistavat hulevesien viivytys- ja imeytysratkaisut.
- **Sisäilma ja kemikaaliturvallisuus (rakennuksen valmis­tuttua)**:
  - Vaatimus **CE-merkittyjen tuotteiden ja M1-luokiteltujen pintamateriaalien** käytöstä (tarkistus material-oraclen EPD-taulukossa).
  - Vaatimus **käyttöturvallisuustiedotteista (SDS)** kaikista käytetyistä kemikaaleista, tallennus dws registry -moduuliin.
  - **Akustiset, sisäilma-, lämpö- ja valaistus­olosuhde-suunnitteluratkaisut** BREEAM Hea / LEED EQ / WELL-kriteerien mukaisesti.
- **WELL-sertifioinnin mahdollisuus** selvitetään isoihin hankkeisiin osana esisuunnittelua (§3.3).

---

## 4. Mittaaminen ja todentaminen / Measurement & Evidence

Vastuullisuustyö ei ole PDF-sivu; se on ajettava koodi. Jokainen ohjelman kohta on sidottu olemassa olevaan tai roadmap-vaiheessa olevaan agenttiin, skilliin tai laskenta­moduuliin:

| Painopiste              | Ensisijainen agentti / skill                                | Deterministinen laskenta                                  | Lokijälki                |
| ----------------------- | ----------------------------------------------------------- | --------------------------------------------------------- | ------------------------ |
| 3.1 Ilmastonhillintä    | emissions-data-analyst, material-oracle, `/carbon-analysis` | `src/compliance/emission-factors.ts`, `ets-calculator.ts` | `debit-credit-ledger.ts` |
| 3.2 Sopeutuminen        | regulatory-radar, compliance                                | `src/compliance/eu-benchmarks.ts`                         | audit-log                |
| 3.3 Sertifiointi        | compliance, sitesense                                       | ESRS-mapping (`esrs-registry.ts`)                         | audit-log                |
| 3.4 EU-taksonomia       | compliance, material-oracle                                 | `scoring-engine.ts` (CCM7.1/7.2)                          | append-only ledger       |
| 3.5 Kiertotalous        | material-oracle, sitesense, schedule-genius                 | EN 15978 A1–D + WEEE-tracking                             | dws registry             |
| 3.6 Kestävä liikkuminen | seo-audit + sitesense                                       | Sijaintitietokannat                                       | audit-log                |
| 3.7 Biodiversiteetti    | compliance + material-oracle                                | ESRS E4 -mapping                                          | audit-log                |
| 3.8 Sosiaali & hallinto | sitesense, `/site-safety`, quality-gate                     | EN 13001, sääbenchmark                                    | append-only ledger       |
| 3.9 Kumppanit           | compliance, KYA, Shufti                                     | Deterministinen pisteytys                                 | KYA trust ledger         |
| 3.10 Lähiympäristö      | sitesense, material-oracle                                  | Ympäristö­ministeriön ohjeet                              | audit-log                |

**Auditoitavuus:** Kaikki laskenta on **deterministinen** — ei LLM-arvausta numeerisissa vaiheissa (CLAUDE.md sääntö 5). LLM:ää käytetään vain luokitteluun, tiivistämiseen ja luonnosteluun; kaikki numerot tulevat säädetyistä laskuri­komponenteista, joiden syöte, versio ja tulos tallennetaan appen­d-only-lokiin.

**Ulkoinen todentaminen:** Vuoden 2027 raportti (V2) toimitetaan riippumattomalle auditoijalle (ISAE 3000 limited assurance -taso).

---

## 5. Roadmap 2026–2028

| Aikataulu             | Toimenpide                                                                                   | Vastuu                       |
| --------------------- | -------------------------------------------------------------------------------------------- | ---------------------------- |
| **Q3 2026** (Aug–Sep) | Code of Business Conduct V1 (`Partners/CODE_OF_BUSINESS_CONDUCT.md`)                         | CEO                          |
| **Q4 2026**           | Vastuu Groupin Valvoja -integraatio dws registryyn                                           | Product                      |
| **Q4 2026**           | Whistleblowing-kanavan avaus (EU-direktiivin mukaisesti)                                     | Legal                        |
| **Q4 2026**           | Scope 1+2+3 -baseline-mittaus omalle toiminnalle (`/carbon-analysis`)                        | CEO + emissions-data-analyst |
| **Q4 2026**           | Ilmastoriski- ja tulvariski-arvio konesali­toimittajille                                     | Product                      |
| **Q1 2027**           | Vastuullisuusohjelma V2 (mittaustulokset, tarkennetut tavoitteet)                            | CEO                          |
| **Q1 2027**           | Palkkatasa-arvo­raportti (kun henkilöstö ylittää 100)                                        | HR                           |
| **Q2 2027**           | Ensimmäinen ISAE 3000 limited assurance -auditointi V1-mittareista                           | External                     |
| **Q3 2027**           | WCAG 2.2 AA -saavutettavuus­auditointi kaikille tuotteille (EU EAA)                          | Product                      |
| **2027**              | ISO 14001 Stage 1 -auditointi                                                                | External                     |
| **2027**              | ISO 42001 AI Management System -arviointi                                                    | Product + Legal              |
| **2028**              | ISO 14001 -sertifikaatti                                                                     | External                     |
| **2028**              | Tavoite: vähintään 5 LEED Platinum / BREEAM Excellent -tason asiakas­hanketta alustan päällä | Sales                        |

---

## 6. Governance ja katselmus / Governance & Review

- **Omistaja / Owner:** Founder, CEO Risto Anton Päärni.
- **Katselmus / Review cadence:**
  - Kuukausittain: mittarien tarkastelu (CEO + Product).
  - Neljännes­vuosittain: roadmap-etenemä (CEO + Product + Legal).
  - Vuosittain: ohjelman versio­päivitys (V2 Q1/2027), julkinen raportti.
- **Muutoshallinta:** Kaikki merkittävät muutokset (tavoitteen tiukennus, uusi painopiste, poistettu KPI) kirjataan tämän dokumentin `VERSION AND AGENT HISTORY` -lohkoon `DWS_DOCUMENT_STANDARD.md` §14–§15 mukaisesti.
- **Ristiin­viittaukset:** Kaikki muutokset synkronoidaan seuraaviin dokumentteihin, jos ne koskevat niitä:
  - `Admin/SECURITY_COMPLIANCE.md` (turvallisuus ja compliance)
  - `DWS_DATA_STANDARD.md` (dataraportoinnin säilytys)
  - `DWS_SOVEREIGNTY_STANDARD.md` (EU-suvereenius)
  - `AI_AGENT_GUIDELINES.md` (agenttien autonomiataso ja mittaus)
  - `AGENTS.md` (agenttitopologia — emissions-data-analyst, material-oracle, compliance, sitesense)

---

## 7. Referenssit / References

**Ulkoiset lähteet / External sources:**

- Case Sponda — Vastuullisuuden painopistealueet 2026: https://sponda.fi/vastuullisuuden-painopistealueet/
- Case Sponda — Uusi vastuullisuusohjelma (60 % A/B energialuokkaan): https://sponda.fi/releases/spondan-uusi-vastuullisuusohjelma-julkaistu-kunnianhimoisena-tavoitteena-nostaa-60-kiinteistokannasta-a-tai-b-energialuokkaan-jo-tana-vuonna/
- EU-taksonomia CCM 7.1/7.2 delegoitu säädös (Ilmasto­delegoitu säädös 2021/2139).
- Euroopan komissio — CSRD (2022/2464) ja ESRS (2023/2772).
- Euroopan komissio — EU ETS (2003/87 päivityksineen), CBAM (2023/956).
- EU AI Act (2024/1689).
- EN 15978:2011 — Sustainability of construction works — Assessment of environmental performance of buildings.
- LEED v4.1 BD+C (USGBC), BREEAM International New Construction 2021 (BRE), WELL v2 (IWBI).
- EU Whistleblowing-direktiivi (2019/1937), EU Pay Transparency -direktiivi (2023/970), EU Accessibility Act (2019/882).
- ISO 27001:2022, ISO 14001:2015, ISO 42001:2023.

**Sisäiset lähteet / Internal sources (dws6 repository):**

- `CLAUDE.md` — 12 sääntöä, legal identity, sender identity, DWS Truth Standard.
- `DWS_DOCUMENT_STANDARD.md` — dokumenttistandardi (v1.9).
- `DWS_SECURITY_STANDARD.md`, `DWS_DATA_STANDARD.md`, `DWS_LEGAL_STANDARD.md`, `DWS_SOVEREIGNTY_STANDARD.md`.
- `Admin/SECURITY_COMPLIANCE.md` (v2.0) — CISO-suunta­tason turvallisuus ja compliance.
- `AI_AGENT_GUIDELINES.md`, `AGENTS.md` — agenttien topologia ja tuotannolliset guardrailit.
- `Legal/KYA_STANDARD_v1.md`, `Legal/KYA_SECURITY_v1.2.md` — Know Your Agent -runtime­turva.
- `src/compliance/` — `esrs-registry.ts`, `emission-factors.ts`, `eu-benchmarks.ts`, `ets-calculator.ts`, `cbam-calculator.ts`, `scoring-engine.ts`, `debit-credit-ledger.ts`, `ember-carbon-price.ts`, `esg-report-extractor.ts`.
- `skills/material-oracle/SKILL.md`, `skills/compliance/SKILL.md`, `skills/sitesense/SKILL.md`.
- `.claude/commands/` — `/carbon-analysis`, `/compliance-check`, `/site-safety`, `/sovereignty-assess`.
- `docs/article-12-annex-iv-log-schema-mapping.md` — EU AI Act Article 12 -lokivaatimukset.

---

_V1 — tämä on lähtökohta, ei loppupiste. Numerot tulevat baseline-mittauksen jälkeen Q4 2026, ulkoinen todennus Q2 2027. Kommentit ja parannusehdotukset: risto.paarni@lifetime.fi._
