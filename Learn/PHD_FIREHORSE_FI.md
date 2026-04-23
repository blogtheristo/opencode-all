# Tohtoriohjelman opintosuunnitelman liite: Firehorse-toimintamalli tekoälyavusteiseen verkkokauppaan

**Otsikko:** Tekoälynatiivi verkkokaupan hallinta: Tapaustutkimus Firehorse-mallin toteutuksesta Claude Codella
**Tekijä:** Lifetime Oy Tutkimusosasto
**Päivämäärä:** Tammikuu 2026
**Laitos:** DWS IQ Research / LUT-yliopisto
**Dokumenttityyppi:** Jatko-opiskeluhakemuksen liite (tohtoriohjelma)
**Viite:** LUT Doctoral School — Jatko-opiskeluhakemus

---

# VERSION AND AGENT HISTORY

Version: 3.38

Sessions & Modifications:

- Version: 3.38 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Typo correction — "Aiwen" → "Aiven" (Aiven.io is our Helsinki Postgres partner) as part of repo-wide sweep of 116 files; no content change beyond the spelling fix; unified version track preserved (all 4 thesis files bumped in lockstep per CLAUDE.md thesis rule)
- Version: 3.37 | Tool: Claude Code (Opus 4.7) | Session: claude/rename-godagents-skilled-dXqBs | Date: 22.04.2026 | Changes: **Yhdistetty opinnäytetyön versiolinja.** PHD_FIREHORSE ja Metropolia V3Thesis ovat nyt yhden yhteisen versionumeron (3.37) varassa. Tästä committasta eteenpäin kaikki 4 opinnäytetyötiedostoa (V3Thesis_EN/FI + PHD_FIREHORSE_EN/FI) päivitetään rinnakkain (3.37 → 3.38 → … → 3.99 → 4.00). Versioketjun katkoshistoria rehellisesti kirjattuna: v2.9 → v2.10 (21.04.2026, Boardy-täsmennykset) → suunnittelematon v3.10-hyppy törmäsi jo olemassa olevaan paikalliseen v3.1, v3.2 -ketjuun → remote siirrettiin v3.5:een tässä sessiossa (22.04.2026) ilman näkyvyyttä paikalliseen v3.2-työhön → yhdistetty tässä v3.37:aan kohdistamaan V3Thesisin kanssa. Paikallinen v3.2-työ taitetaan seuraavaan nostoon v3.38 (ihmisen liitettävä diff). Sisältö tässä versiossa: osio 14.17 (DWS Skilled -taksonomia — Brändi / Speksi / UI agenteille, työnkuluille ja jurisdiktioille); "GodAgent"/"Godagent"-brändäys poistettu käytöstä; kolmitasoinen `Skilled <Akseli>` / `Industrial Specialist <Akseli>` / `Industry <Akseli>` -kaava kolmelle aktiiviselle akselille; SKU-kopion, ajastinkopion ja jurisdiktion pakkauksen kurit johdettu toimintamallin seurauksina; avainpanos #22.
- Version: 3.5 | Tool: Claude Code (Opus 4.7) | Session: claude/rename-godagents-skilled-dXqBs | Date: 22.04.2026 | Changes: [Korvattu v3.37-yhdistämisellä.] Avattu PHD_FIREHORSE:n pääversiolinja v3.5:ssä (myöhemmin peruutettu). Sisältö siirretty v3.37:aan.
- Version: 2.10 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: f2a5b1e0-a01c-489a-8d33-fde09a7dd970 | Date: 21.04.2026 | Changes: Täsmennetty tutkimusidean runko Boardy-palautteella: KYA open source -standardipolku Agentic AI Foundation / Linux Foundation -reitille, NIST-hakemuksen tila (ei lähetetty), artikkeleiden vaiheistus (2026-2029), compliance-ongelman oikeudellinen fokus (court-defensible), sekä EIC Step 1 -deliverablejen yhteys tutkimusohjelman tuotteistukseen; päivitetty vastauskirje Karille
- Version: 2.9 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: f2a5b1e0-a01c-489a-8d33-fde09a7dd970 | Date: 21.04.2026 | Changes: Päivitetty tutkimuskysymysten kohdennus: KYA-standardin positiointi Agentic AI Foundation -standardiksi, DWS 7 -tavoitteet, vetytalousviittaus (DWS 5), kolmas tutkimuskohde dual-use-toimialoihin (Nokia Defence -keskustelut), Aegis/Sovereign Infra/Connect -suvereniteettisegmentointi kuvalla, Siemens- ja NVIDIA Connect -yhteistyömaininnat; lisätty Kari Smolanderille kohdistettu vastauskirjeluonnos
- Version: 2.8 | Tool: Claude Code (Opus 4.7) | Session: claude/update-thesis-work-EoyoF | Date: 20.04.2026 | Changes: Lisätty osio 14.16 (Huhtikuun 2026 kehitys) — viisi alaosiota: Firehorse Report Engine -tuotantoajastin (PR #1064, cron-pohjainen vaatimustenmukaisuusraporttien lähetys, moduulitason testit, manuaalireitti), Firehorse Product Line V2 -konsolidointi (omnichannel/report/automation/content yhtenäisenä DWS IQ -tuoteperheenä), Firehorse Snap -mittaustulos (mitattu <125 ms tappoviive Firecracker MicroVM:llä korvaa aiemman 122 ms Arctic 15 -spesifikaation), Skills-paradigman soveltaminen operaatioihin (Anthropicin 16.4.2026 essee validoi §14.14; +3 taitoa: /regulatory-radar, /investor-outreach, /multilingual), Ops Manager V0 -ostajalukitus (PRD v0.2 + ICP-validointiskripti) ja perustajan→tiimin siirtymä (SOLO_FOUNDER_STATEMENT v1.2 + Anthony Maurin CTO + /investor-outreach -työnkulku 10+ INTRO-muistiolla); lisätty avainpanokset #19–#21
- Version: 2.7 | Tool: Claude Code (Opus 4.6) | Session: claude/refine-thesis-critique-RP6Dv | Date: 18.03.2026 | Changes: Lisätty Liite H (KYA-kumppaniekosysteemi): 5-tasoinen kumppanikartoitus, Shufti IDV -integraatio (L1/L5), Palantir AIP -liitinmalli, BYO-agenttipolitiikka, strategiset ekosysteemikumppanit (NVIDIA, Siemens, ABB, xAI, Mistral), kumppanuusjakelustrategian hypoteesin validointi; lisätty avainpanos #16
- Version: 2.6 | Tool: Claude Code (Opus 4.6) | Session: claude/refine-thesis-critique-RP6Dv | Date: 16.03.2026 | Changes: Päivitetty osio 15 Tulokset ja pohdinta v2.1–2.5 todisteilla: harness engineering -mittarit (52,8%→66,5%), 13 agentin Pantheon, asiakkaiden MVP-ominaisuudet, PostgreSQL HTAP, A/B-testaus, vaatimustenmukaisuuspäivitykset, SWOT-päivitys; lisätty osio 15.5 A/B-testauksen tulokset; lisätty LUT-yliopiston tekoälytyökalujen käytänteet viitteisiin
- Version: 2.5 | Tool: Claude Code (Opus 4.6) | Session: claude/add-harness-engineering-thesis-2zvZt | Date: 14.03.2026 | Changes: Lisätty osio 14.12 (Harness Engineering ja forensiikkatelemetria): harness-forensiikka-yhteys, oikeudellisesti pätevä harness VERSION AND AGENT HISTORY -lohkon kautta, KYA-standardi laitteistotason harness-todennuksena ohjelmistotason scaffoldingin yli, EU-regulaation eroavaisuus OpenAI:n nopeusoptimoidusta lähestymistavasta; lisätty avainpanos #15
- Version: 2.4 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Lisätty Liite G Sanasto: 21 termiä — Alusta (5), Tietoarkkitehtuuri (8), Turvallisuus (8)
- Version: 2.3 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Päivitetty osio 14.11 Aiven-first mandaatilla: Hydra→Supabase Warehouse, pg_mooncake→Databricks, TimescaleDB 2.25.x Hypercore hyväksyttynä standardina, Aiven-sallittujen listalla pg_duckdb ESTETTY, kaksitasoinen HTAP, reunatietokanta GN100:lle; lisätty Keskeiset löydökset #14; päivitetty alatunniste
- Version: 2.2 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Lisätty osio 14.11 (PostgreSQL-sarakemuotoinen HTAP-arkkitehtuuri — DWS-tietostandardi): pg_duckdb + TimescaleDB Aiven EU:ssa, yksitietokantainen HTAP Firehorse-toiminnoille, 4-vaiheinen käyttöönotto, DWS_DATA_STANDARD.md luotu, EU-sääntelynmukaisuus; lisätty avainpanos #13; alatunniste päivitetty
- Version: 2.1 | Tool: Claude Code (Opus 4.6) | Session: claude/vigorous-meitner | Date: 09.03.2026 | Changes: Lisätty osio 14.10 (Agenttijärjestelmän koventaminen — tuotantoluotettavuus): 6 TypeScript-kääntövirhettä korjattu, 3 testivikaa ratkaistu, SandboxContext-tyyppilinjaus, MCP/HIL-reittien kytkentä, lokaalivarma numeromuotoilu, riippuvuushygienia; alatunniste päivitetty
- Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Lisätty avainpanos #12 (Asiakaskeskeiset MVP-ominaisuudet — API-avainten hallinta, käyttömittarointi, raporttien vienti); osoittaa Firehorse-toimintamallin siirtymän sisäisistä työkaluista asiakastoimitettavaksi SaaS-palveluksi; dokumentoi 3-tasoisen laskutusarkkitehtuurin tuotteen monetisointimallina
- Version: 1.9 | Tool: Claude Code (Opus 4.6) | Session: claude/implement-mvp-features-D2e9d | Date: 07.03.2026 | Changes: Lisätty DWS-alustan standardit Lähteisiin §17 Oxford-viittausmerkinnällä — DWS Security Standard, ESRS Registry, Compliance Scoring Engine, Site Quality Standards, AGENTS.md, Admin Manual, Security Compliance; selittävät huomautukset jokaisesta standardista
- Version: 1.8 | Tool: Claude Code (Opus 4.6) | Session: claude/pedantic-easley | Date: 07.03.2026 | Changes: Lisätty osio 14.6.3 (Lifetime Scope Signals LWM-koulutuksen koordinointiin — koulutusagenttilaivasto T-01 – T-10, laatuporttisignaalit, resurssien välimiesosoitus, Fan-Out-rinnakkaisuus); lisätty avainpanos #11; päivitetty alatunniste
- Version: 1.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/implement-workflow-agents-CHFFN | Date: 02.03.2026 | Changes: Lisätty osio 14.9 (Climate IQ Pantheon — kreikkalais-roomalainen moniagenttijärjestelmä: 6 orkestraattoria + 7 toimialaerityistä agenttia, SOUL.md-malli, prompt injection -korjaus, EU AI Act artikla 12, markkinointikiilapersoonat); alatunniste päivitetty
- Version: 1.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/organize-repo-structure-F3xqn | Date: 02.03.2026 | Changes: Lisätty Liite F (Claude Code -suunnittelurakenne: CLAUDE.md projektimuistina, taidot uudelleenkäytettävinä työnkulkukomponentteina, koukut automaattisena laadunvalvontana, aliagentit rinnakkaissuoritukseen); päivitetty alatunniste ja Publication Status
- Version: 1.6 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: KONSOLIDOITU — ratkaisee versioajautuminen. Lisätty osio 14.7 (Toimitusjohtajan automaatioagenttiryhmä); osio 14.8 (Strategiset kumppanuudet + Monituottaja-LLM-reititin); avainpanokset 9-10; viitteet 15-16; alatunniste päivitetty
- Version: 1.5 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Lisätty osio 14.6 (Agent Foundry Vaihe 1.5 — OpenSandbox Acer Veriton GN100 -laitteella); lisätty EMPO²-osio (arXiv:2602.23008); lisätty viitteet 13-14; päivitetty avainpanokset
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/modernize-dws7-77v2B | Date: 24.02.2026 | Changes: Lisätty osio 14.5 DWS7 agenttiarkkitehtuurin modernisointi (agenttisilmukat, työkalujen käyttö, monituottaja-LLM, MCP-palvelin, CLI, Claude Code Skills), lisätty VERSION AND AGENT HISTORY -lohko
- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Parannettu LWM-määritelmä, 16 toimialan ristioppimisanalyysi, BYOA-arkkitehtuuri, Agent Orchestration Studio
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: HIL-PR-Automation | Date: 20.02.2026 | Changes: Lisätty Liite E Automatisoitu PR-työnkulku, IPR-suojaus, Prompt Caching -arkkitehtuuri
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: DWS10-Integration | Date: 28.01.2026 | Changes: Ensimmäinen jäsennelty versio 18 osiolla
- Version: 1.0 | Tool: Claude Code (Opus 4.5) | Session: PHD-Init | Date: 15.01.2026 | Changes: Dokumentin luominen

Document Status:

- Created: 15.01.2026
- Last Modified: 21.04.2026
- Language: Finnish
- Languages Available: English, Suomi
- Publication Status: DRAFT (V2.10 — KYA open source -standardipolku, NIST-tilanne, artikkelivaiheistus, ohjaajakirje tarkennettu)

---

## Tiivistelmä

Tämä tutkielma dokumentoi Firehorse-toimintamallin toteutuksen, joka on tekoälyavusteinen lähestymistapa verkkokaupan hallintaan Claude Codea käyttäen. Malli osoittaa merkittäviä tehokkuusparannuksia tuotekatalogin hallinnassa, Google Merchant Center -integraatiossa ja maksukäsittelyssä Revolut Businessin kautta. Esittelemme teknisen arkkitehtuurin, toiminnalliset työnkulut ja tulevan kehityksen kohti äänipohjaista asiakasvuorovaikutusta toimialakohtaisella hiilijalanjälkilaskurilla ja EU-sääntelyvaatimusten tuntemuksella.

**Avainsanat:** Tekoälytoiminnot, Verkkokaupan automaatio, Google Merchant Center, Claude Code, Firehorse-malli, EU:n tekoälysäädös, Hiilijalanjälkilaskuri, Teollinen vaatimustenmukaisuus

---

## Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Kirjallisuuskatsaus](#2-kirjallisuuskatsaus)
3. [Firehorse-toimintamalli](#3-firehorse-toimintamalli)
4. [Tekninen toteutus](#4-tekninen-toteutus)
5. [Maksuintegraatio (Revolut Business)](#5-maksuintegraatio-revolut-business)
6. [Google Merchant Center -toiminnot](#6-google-merchant-center--toiminnot)
7. [EU-sääntelyvaatimustenmukaisuus](#7-eu-sääntelyvaatimustenmukaisuus)
8. [Tuotesuositusmoottori](#8-tuotesuositusmoottori)
9. [Äänichat-kehityssuunnitelma](#9-äänichatin-kehityssuunnitelma)
10. [Toimialan hiilijalanjälkilaskuri](#10-toimialan-hiilijalanjälkilaskuri)
11. [Proton-tuotestrategia](#11-proton-tuotestrategia)
12. [IPR-suojaus ja liikesalaisuusstrategia](#12-ipr-suojaus-ja-liikesalaisuusstrategia)
13. [Prompt-välimuistiarkkitehtuuri tekoälyagenteille](#13-prompt-välimuistiarkkitehtuuri-tekoälyagenteille)
14. [Tulokset ja pohdinta](#14-tulokset-ja-pohdinta)
15. [Johtopäätökset](#15-johtopäätökset)
16. [Lähteet](#16-lähteet)
17. [Liitteet](#17-liitteet)

---

## 1. Johdanto

### 1.1 Tausta

Yritysohjelmistomarkkinat vaativat yha enemman nopeaa tuotekehitysta, EU-säännösten noudattamista ja saumatonta asiakaskokemusta. Perinteinen verkkokauppatoiminta vaatii manuaalista puuttumista tuotepaivityksiin, syotehallintaan ja asiakastukeen. Firehorse-toimintamalli vastaa naihin haasteisiin tekoälynatiivilla automaatiolla Claude Codea käyttäen.

Lifetime Oy operoi DWS10.com-alustaa, yritysverkkokauppaa joka palvelee ilmastoalykkyyden ratkaisuja, vaatimustenmukaisuusohjelmistoja ja ammattimaisia konsultointipalveluita 16:lle EU-saannellylle toimialalle. Alusta integroituu:

- **Google Merchant Center** (Tili-ID: 8496329) tuotenakyvyydelle
- **Revolut Business** kassan ja maksukäsittelyn hoitamiseen
- **Claude Code** automatisoituun kaupan yllapitoon Firehorse-mallin kautta
- **Cloudflare Pages** staattiseen hostingiin EU-tietojen sijaintikriteerein

### 1.2 Tutkimuskysymykset

1. Miten tekoälyavustajat voivat tehokkaasti hallita verkkokaupan tuotekatalogeja?
2. Mitka tehokkuusparannukset ovat saavutettavissa automatisoidulla syotehallinnalla?
3. Miten aanipohjiaisen asiakasvuorovaikutuksen tulisi kehittya suositellakseen toimialakohtaisia ratkaisuja?
4. Mitka EU:n tekoälysaadoksen vaatimukset vaikuttavat tekoälyavusteisiin myyntikanaviin?
5. Miten hiilijalanjälkilaskurit voivat ohjata tuotesuosituksia teollisille asiakkaille?

### 1.3 Laajuus

Tämä tutkielma kattaa DWS10.com-kaupan toteutuksen, joka palvelee yli 30 tuotetta seuraavissa kategorioissa:

| Kategoria             | Tuotteet                              | Hintaluokka       |
| --------------------- | ------------------------------------- | ----------------- |
| Alustaohjelmistot     | DWS IQ v5, v6                         | 4 999 - 6 995 EUR |
| Firehorse-tuoteperhe  | Automation, Report, CMS, Omnichannel  | 499 - 4 950 EUR   |
| Konsultointipalvelut  | Tunti-, kuukausi-, tyopajahinnoittelu | 98 - 6 250 EUR    |
| Koulutus & Valmennus  | AI Koulutus, Coach, Mentor            | 499 - 6 250 EUR   |
| Digitaaliset tuotteet | Sanastot, verkkosivut                 | 0,99 - 799 EUR    |

### 1.4 Motivoiva teesi: Hiilitase

Tämän tohtoritutkimuksen keskeinen hypoteesi on, että EU:n ilmastovaatimustenmukaisuus — ETS, CBAM, CSRD ja EU-taksonomia — ei ole raportointiongelma vaan **kirjanpito-ongelma**. Sama fyysinen CO2e-määrä kulkee useiden sääntelykontaktipisteiden läpi: terästehtaan ETS-luovutus muuttuu tuojan CBAM-sisällytetyksi päästöksi, rakennusyhtiön CSRD Scope 3 -ylävirran ilmoitukseksi ja taksonomialinjauksen määritteeksi. Nykyiset vaatimustenmukaisuustyökalut käsittelevät jokaisen säännöksen erillisenä raportointityönkulkuna, mikä tuottaa päällekkäistä dataa, epäjohdonmukaisia kertoimia ja ±40 % Scope 3 -epävarmuutta.

Tämä tutkielma esittää, että hiilivaatimustenmukaisuus vaatii **kahdenkertaisen kirjanpidon** — saman arkkitehtuurisen ratkaisun, jonka kirjanpito otti käyttöön vuosisatoja sitten. Jokainen vaatimustenmukaisuustapahtuma tuottaa kirjanpitokirjauksen (veloitus tai hyvitys) kaksoisyksiköissä (EUR ja tCO2e). Tuloksena syntyvä hiilitase antaa nettohiiliposition, joka on auditoitava, täsmäytettävä ja koneluettava.

**Miksi tämä kehystää Firehorse-toimintatutkimuksen:**

Firehorse-toimintamalli (osiot 3–13) dokumentoi insinööri-infrastruktuurin — moniagenttiorkestroinnin, reunakäyttöönoton, ERP-integraation, sääntely-älykkyyden — joka vaaditaan hiilitaseen rakentamiseen 20 EU-reguloidulle toimialalle. Ilman harness-arkkitehtuuria (osio 14.12) poikkitoimialainen kirjanpito ei voi ylläpitää auditoinnin eheyttä. Ilman MCP-orkestrointia poikkisääntelyinen täsmäytys ei voi tapahtua reaaliajassa. Ilman reunakäyttöönottoa teollisuuslaitokset eivät voi tuottaa varmennettua päästödataa.

**Kolme tutkimuskysymystä nousee hiilitaseteesistä:**

1. **Rakenteellinen isomorfismi:** Onko analogia kirjanpidon kahdenkertaisen kirjanpidon ja hiilivaatimustenmukaisuuden seurannan välillä muodollisesti pätevä vai pelkästään metaforinen? Voivatko samat tietorakenteet, täsmäytysalgoritmit ja auditointitakuut siirtyä?

2. **Poikkitoimialainen älykkyys:** Tuottaako monitoimialainen hiilikirjanpito emergenttia älykkyyttä, jota yksitoimialainen työkalu ei voi replikoida? Erityisesti: kun terästehtaan varmennetut ETS-päästöt korvaavat rakennusyhtiön CBAM-oletusarvot, toteutuuko tarkkuusparannus (hypoteesi ±3 % vs. ±40 %) käytännössä?

3. **Verkostovaikutukset vaatimustenmukaisuusdatassa:** Missä mittakaavassa (toimialojen, entiteettien, transaktioiden lukumäärä) poikkisääntelyinen täsmäytys muuttuu itseään vahvistavaksi — jossa yhden toimialan lisääminen kirjanpitoon parantaa datan laatua kaikille olemassa oleville toimialoille?

**Avoimen lähdekoodin konnektorien rooli:**

Hiilitase vaatii varmennettua dataa heterogeenisistä teollisuusjärjestelmistä — ERP-alustoista (SAP, IFS, Dynamics, Visma, Jeeves), EU-rekistereistä (EUTL, CBAM-siirtymärekisteri), päästökerroindatakannoista (EEA, IPCC), IoT-antureista ja ESG-alustoista (Worldfavor, PositionGreen). Tämä tutkielma esittää, että näiden konnektorien tulee olla **avointa lähdekoodia** (MIT-lisensoituja) kolmesta syystä: (1) auditoitavuus — tilintarkastajien on pystyttävä tarkastamaan tietopolku lähdejärjestelmästä kirjanpitokirjaukseen, ei luottamaan toimittajan mustaan laatikkoon; (2) verkostovaikutuksen kiihdytys — avoin lähdekoodi laskee käyttöönoton kynnystä, mahdollistaen poikkitoimialaisen älykkyyden syntymisen nopeammin; (3) sääntelypuolustettavuus — EU:n tekoälysäädöksen artikla 12 vaatii auditoitavia AI-putkia, ja avoin lähdekoodi täyttää tämän vaatimuksen suunnittelultaan. Konnektoriarkkitehtuuri laajentaa DWS:ssä jo toteutettuja ERP-integraatiomalleja (`src/integrations/erp/`), käsitellen jokaista konnektoria standardoituna adapterina (syöttöskeema → kirjanpitokirjaus), joka liittyy kirjanpidon append-only-syöttörajapintaan.

Nämä kysymykset ulottuvat Firehorse-verkkokauppatoimintojen yli **vaatimustenmukaisuusinfrastruktuurin suunnittelun** alueelle — siirtymä "työkaluista jotka tuottavat raportteja" "infrastruktuuriin joka ylläpitää tietojärjestelmää hiilelle." DWS 7 -toteutus (Phase 2.6, PR:t 093A–093H) tarjoaa empiirisen testialustan.

### 1.5 Tutkimusidean kohdennus (päivitys v2.10)

Tutkimusidean kohdennus tarkennetaan kolmeen runkoon:

1. **KYA-standardi Agentic AI Foundation -standardiksi:** KYA (Know Your Agent) nostetaan sisäisestä hallintakehyksestä yleiseksi standardiehdokkaaksi agenttien identiteetin, suoritusaikaisen valvonnan, auditoinnin ja suvereniteetin hallintaan.
2. **DWS 7 -tavoitteet tutkimuksen testialustana:** DWS 7 toimii empiirisenä ympäristönä, jossa validoidaan hiilitase, KYA-hallinta, monikumppaninen integraatio (Siemens, NVIDIA Connect) ja toimialakohtainen suvereniteettiohjaus.
3. **Dual-use-toimialat kolmantena tutkimuskohteena:** Kolmas tutkimuskysymys kohdistetaan dual-use-toimialoihin (teollisuus + puolustus), mukaan lukien käynnissä olevat keskustelut Nokia Defencen kanssa rahoitus- ja pilotointipolusta.

Lisäksi DWS 5 -version vetytalouslinja (vihreän vedyn lisäisyys, RFNBO-kriteerit) kirjataan osaksi pitkää tutkimusjatkumoa kohti DWS 7:n datakeskus- ja energiaregulaatiokerrosta.

**Tuotetaso- ja suvereniteettisegmentointi (keskeinen kuva):**

<img src="../artifacts/Sovereignty.jpg" alt="Aegis, Sovereign Infra ja Connect -segmentointi" />

Kuvan tarkoitus on ankkuroita kolme tuotetasoa tutkimusasetelmaan:

- **Aegis** = turvallisuus- ja kriittisen infrastruktuurin hallintatuote
- **Sovereign Infra** = EU-suvereeni infrastruktuuritaso säännellyille toimijoille
- **Connect** = kansainvälinen integraatio- ja jakelutaso

**Open source -standardireitti (uusi täsmennys):**

- KYA-standardin ehdotus **Agentic AI Foundation / Linux Foundation** -reitille on luonnosvaiheessa (ei vielä lähetetty).
- NIST-hakemus ei ole vielä lähtenyt; tutkimusasetelmassa tämä kirjataan rinnakkaiseksi validointipoluksi (US-validaatio vs open source -adoptio).
- Periaate: "standardi joka on takataskussa ei ole standardi" -> tutkimuskontribuution tulee sisältää avoin spesifikaatio + referenssitoteutus.

### 1.6 Vastauskirjeluonnos prof. Kari Smolanderille

Hei Kari,

kiitos viestistäsi ja suorasta palautteesta. Arvostan erityisesti huomiotasi siitä, että väitöskirja on kestävyyslaji ja että tiedeyhteisöön sosiaalistuminen sekä vertaisarvioitu julkaiseminen ovat työn ydin.

Laadin pyytämäsi lyhyen tutkimusidean kuvauksen seuraavalla rakenteella:

- **Tutkimusongelma:** miten agenttipohjainen tekoälyarkkitehtuuri rakennetaan tuottamaan oikeudellisesti puolustettavaa (court-defensible) compliance-dataa EU:n teollisessa sääntelyssä (CBAM, CSRD, NIS2, AI Act).
- **Tutkimuksen tavoitteet:** (1) kehittää ja validoida KYA-sertifioitu hallintamalli teollisille AI-agenteille, (2) tutkia moniagenttiarkkitehtuurin (MCP + A2A) skaalautuvuus 20+ sääntelyvertikaaliin, (3) arvioida compliance-automaation vaikutus D&O-vakuutuskelpoisuuteen ja oikeudelliseen vastuuseen.
- **Alustavat tutkimusmenetelmät:** Design Science Research (DSR), artefaktin rakentaminen (DWS IQ 6/7), tapaustutkimus + empiirinen validointi maksavilla asiakkailla.
- **Vaiheistus:** 2026 Artikkeli 1 (KYA open source -standardi), 2027 Artikkeli 2 (MCP-arkkitehtuuri), 2028 Artikkelit 3-4 (empiiriset tulokset), 2028-2029 koontiosa + väitös.

Artikkeli 1 muotoillaan seuraavasti: **"KYA Standard: An Open Source Governance Framework for Agentic AI in EU-Regulated Industries"** ja se kohdistetaan Agentic AI Foundation / Linux Foundation -standardipolulle sekä kansainväliseen konferenssiesitykseen.

Lisäksi kirjaan selkeästi nykytilan:

- KYA open source -ehdotus on luonnosvaiheessa (ei lähetetty).
- NIST-hakemusta ei ole lähetetty.
- Nämä kaksi polkua eivät sulje toisiaan pois, mutta open source -adoptio priorisoidaan ensin.

Sopii hyvin, että tapaamme tämän luonnoksen pohjalta joko online tai kasvotusten. Voin lähettää tiiviin 2–3 sivun version ennakkoon.

Ystävällisin terveisin,  
Risto Anton Päärni

---

## 2. Kirjallisuuskatsaus

### 2.1 Tekoäly verkkokauppatoiminnoissa

Viimeaikaiset edistysaskeleet suurissa kielimalleissa (LLM) mahdollistavat luonnollisen kielen käyttöliittymat monimutkaisiin teknisiin toimintoihin. Claude Code, joka perustuu Anthropicin Claude-malliin, tarjoaa:

- Tiedostojärjestelmän käsittelyn
- Koodin generoinnin ja muokkauksen
- Ulkoisten API:en integroinnin
- Monivaiheisen tehtavien orkestroinnin
- Git-versionhallinnan integraation

### 2.2 Tuotetietojen hallinta

Modernit tuotetietojen hallintajärjestelmät (PIM) vaativat:

- Keskitetyn tietovaraston (products.json)
- Monikanavaisen jakelun (Google Merchant, sosiaalinen kauppa)
- Vaatimustenmukaisuuden metatiedot (EU-saannokset)
- Dynaamiset hinnoitteluominaisuudet
- Kassalinkkien integraation

### 2.3 EU:n sääntelykehys

Euroopan unionin sääntelymaisema tekoälyavusteisessa kaupassa sisaltaa:

| Saannos                               | Voimaantulo     | Vaikutus                                             |
| ------------------------------------- | --------------- | ---------------------------------------------------- |
| EU:n tekoälysäädös                    | Elokuu 2026     | Tekoälyjärjestelmien luokittelu, lapinakyvaatimukset |
| GDPR                                  | Toukokuu 2018   | Tietosuoja, suostumusten hallinta                    |
| NIS2-direktiivi                       | Lokakuu 2024    | Kyberturvallisuusvaatimukset                         |
| Vihreita vaitteita koskeva direktiivi | 2026            | Ymparistomarkkinoinnin vaatimustenmukaisuus          |
| Fit for 55 -paketti                   | 2030 tavoitteet | Hiilidioksidipaastovahennysvelvoitteet               |
| CSRD                                  | Tammikuu 2024   | Yritysten kestavyysraportointi                       |
| CBAM                                  | Lokakuu 2023    | Hiilirajamekanismi                                   |
| EPBD 2028                             | 2028            | Rakennusten energiatehokkuus                         |

---

## 3. Firehorse-toimintamalli

### 3.1 Mallin yleiskatsaus

Firehorse-toimintamalli on ihmisen ja tekoälyn yhteistyokehys verkkokaupan hallintaan:

```
┌─────────────────────────────────────────────────────────────┐
│                   FIREHORSE-TOIMINNOT                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐     ┌─────────────┐     ┌─────────────┐       │
│   │ Ihmisen │ ──► │ Claude Code │ ──► │Jarjestelmat │       │
│   │  aikomus│     │(Tekoälyagentti)│   │ (Git, APIs) │       │
│   └─────────┘     └─────────────┘     └─────────────┘       │
│                          │                    │              │
│                          ▼                    ▼              │
│                   ┌─────────────┐     ┌─────────────┐       │
│                   │ Artefaktit  │     │   Tulokset  │       │
│                   │(Koodi, Docs)│     │(Kayttoonotot)│      │
│                   └─────────────┘     └─────────────┘       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Perusperiaatteet

1. **Luonnollisen kielen käyttöliittyma**: Toiminnot ilmaistaan selkokielella
2. **Versionhallinta**: Kaikki muutokset seurataan Gitin kautta
3. **Auditointipolku**: Taysi historia EU:n tekoälysaadoksen noudattamiseen
4. **Toistettavuus**: Dokumentoidut prosessit johdonmukaisuuden varmistamiseksi
5. **Jaljitettavyys**: Paatosketjut sääntelyvaatimuksia varten

### 3.3 Toiminnalliset osa-alueet

| Osa-alue             | Tekoälyn kyvykkyydet                | Ihmisen valvonta                            |
| -------------------- | ----------------------------------- | ------------------------------------------- |
| Tuotehallinta        | CRUD-toiminnot, syötteen generointi | Hinnoittelun hyväksynta, sisallon tarkistus |
| Maksuintegraatio     | Linkkien luonti, konfigurointi      | Taloudellinen valtuutus                     |
| Vaatimustenmukaisuus | Dokumenttien generointi, seuranta   | Juridinen hyväksynta                        |
| Asiakasvuorovaikutus | Tekoälychat, suositukset            | Eskaloinnin käsittely                       |
| Dokumentaatio        | Kasikirjojen generointi, kaannokset | Tekninen tarkistus                          |

### 3.4 Tyonkulkuesimerkit

**Tuotepaivityksen työnkulku:**

```
Kayttaja: "Lisaa uusi tuote X hintaan 999 EUR"
Claude Code:
  1. Paivittaa products.json-tiedoston
  2. Validoi pakolliset kentat
  3. Generoi Google Merchant -syötteen uudelleen
  4. Committaa muutokset Gitiin
  5. Lahettaa syötteen SFTP:lla
```

**Dokumentaation työnkulku:**

```
Kayttaja: "Luo yllapitokasikirja"
Claude Code:
  1. Lukee tuotekatalogin
  2. Analysoi järjestelmän arkkitehtuurin
  3. Generoi kattavan dokumentaation
  4. Luo kaksikieliset versiot (EN/FI)
  5. Committaa repositoryyn
```

---

## 4. Tekninen toteutus

### 4.1 Arkkitehtuuri

```
dws10.com/
├── buy/                    # Kauppasivut
│   ├── index.html         # Paakauppa (Sivu 1)
│   ├── page2/index.html   # Lisakyotteet (Sivu 2)
│   └── page3/index.html   # Konsultointi & Koulutus (Sivu 3)
├── config/
│   └── products.json      # Keskitetty tuotekatalogi (30 tuotetta)
├── feeds/
│   ├── generate-feed.cjs  # Node.js-syotegeneraattori
│   └── google-products.xml # Google Merchant -syote
├── return-policy/
│   └── index.html         # Palautuskaytanto (Googlen vaatimus)
├── static/images/         # Tuotekuvat
└── docs/                   # Dokumentaatio
```

### 4.2 Tuotetietomalli

```json
{
  "id": "DWS-IQ-006",
  "gtin": null,
  "mpn": "DWSIQ-V6-2026",
  "name": "Lifetime DWS IQ Platform (Version 6)",
  "price": 4999,
  "currency": "EUR",
  "type": "one-time",
  "description": "Teollinen aivot Fit for 55 -vaatimustenmukaisuuteen. Tekoälynatiivi alusta 5 agentilla pilviymparistossasi.",
  "priceNote": "Kertakäyttöoonotto + 499 EUR/kk tilaus",
  "revolutLink": "https://checkout.revolut.com/pay/f023d433-0bf4-48fa-98cd-494de448df39",
  "image": "/DWS_IQ2026.png",
  "detailsUrl": "../buy/",
  "featured": true,
  "google": {
    "productCategory": "Software > Business & Productivity Software",
    "condition": "new",
    "availability": "in_stock",
    "brand": "Lifetime",
    "targetCountry": "FI",
    "contentLanguage": "en"
  }
}
```

### 4.3 Syötteen generointiputki

```javascript
// generate-feed.cjs työnkulku
const generateFeed = () => {
  // 1. Lataa products.json
  const products = require("../config/products.json");

  // 2. Validoi pakolliset kentat
  validateProducts(products); // id, mpn, price, brand

  // 3. Generoi XML g:-nimiavaruudella
  let xml = generateXMLHeader();

  for (const product of products) {
    xml += generateProductItem(product);

    // 4. Lisaa checkout_link_template Revolutille
    const checkoutLink = product.revolutLink || "https://revolut.me/lifetimeoy";
    xml += `<g:checkout_link_template>${checkoutLink}</g:checkout_link_template>`;
  }

  // 5. Kirjoita google-products.xml
  writeFile("google-products.xml", xml);
};
```

### 4.4 Käyttöönottoputki

- **Hosting:** Cloudflare Pages (staattinen HTML)
- **Build:** Automaattinen käyttöonotto git push -komennolla
- **Valimuisti:** Edge-välimuisti suorituskyvylle
- **Vaatimustenmukaisuus:** EU:n tietojen sijainti (Suomi/Saksa)

---

## 5. Maksuintegraatio (Revolut Business)

### 5.1 Miksi Revolut Business

Lifetime Oy valitsi Revolut Businessin maksukäsittelyyn seuraavien ominaisuuksien perusteella:

| Ominaisuus             | Hyoty                                         |
| ---------------------- | --------------------------------------------- |
| Valittoomat tilitykset | Parannettu kassavirta, saman paivan saatavuus |
| Monivaluuttatuki       | Tuki EUR, SEK, NOK, DKK, GBP                  |
| Matalat maksut         | 1,0 % + 0,20 EUR per tapahtuma                |
| API-integraatio        | Automatisoitu tasmaaytys                      |
| Kassalinkit            | Suora Google Merchant -tuki                   |
| Apple Pay / Google Pay | Modernit maksutavat                           |

### 5.2 Kassalinkkiarkkitehtuuri

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Tuote-    │ ──► │   Google    │ ──► │   Revolut   │
│   katalogi  │     │  Merchant   │     │    Kassa    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                    │
       │    checkout_link_template              │
       └───────────────────────────────────────►│
```

### 5.3 Maksuvirta

1. Asiakas loytyy tuotteen Google Shoppingin kautta
2. Klikkaa Revolut-kassaan
3. Suorittaa maksun kortilla/Apple Pay/Google Pay
4. Valitoon tilitys Lifetime Oy:n tilille
5. Tilausvahvistus lahetetaan automaattisesti

### 5.4 Kassalinkkien konfigurointi

**Tuotekohtaiset linkit:**

```json
"revolutLink": "https://checkout.revolut.com/pay/f023d433-0bf4-48fa-98cd-494de448df39"
```

**Varalinkki tuotteille ilman erityista linkkia:**

```json
"revolutFallbackLink": "https://revolut.me/lifetimeoy"
```

### 5.5 Yllapidon edistysaskeleet

Viimeaikaiset toteutetut parannukset:

- **Tuotekohtaiset kassalinkit** (vs. yleinen maksuSivu)
- **Vara-URL** tuotteille ilman erityisia linkkeja
- **Google Merchant -integraatio** `checkout_link_template`:n kautta
- **Monivaluuttatuki** valmiina Pohjoismaiden laajentumiseen

---

## 6. Google Merchant Center -toiminnot

### 6.1 Tilin konfigurointi

| Asetus         | Arvo                                        |
| -------------- | ------------------------------------------- |
| Merchant ID    | 8496329                                     |
| Kohdemaa       | Suomi (FI)                                  |
| Kielet         | Englanti (ensisijainen), suomi              |
| Syotemenetelma | SFTP-lataus                                 |
| Syote-URL      | https://dws10.com/feeds/google-products.xml |
| SFTP-palvelin  | partnerupload.google.com:19321              |

### 6.2 Syötteen vaatimustenmukaisuusvaatimukset

| Attribuutti              | Vaatimus              | Toteutus                      |
| ------------------------ | --------------------- | ----------------------------- |
| g:id                     | Uniikki tunniste      | Vastaa products.json ID:ta    |
| g:mpn                    | Valmistajan osanumero | Muoto: KATEGORIA-TYYPPI-VUOSI |
| g:brand                  | Tuotemerkki           | "Lifetime" tai "Firehorse"    |
| g:price                  | Hinta valuutalla      | EUR-muoto                     |
| g:availability           | Varastotilanne        | Aina "in_stock" palveluille   |
| g:checkout_link_template | Maksu-URL             | Revolut-kassalinkki           |
| g:condition              | Tuotteen kunto        | Aina "new"                    |

### 6.3 SFTP-latausprosessi

```bash
# Viikoittainen syotelataus Google Merchant Centeriin
curl -T google-products.xml \
  -u "mc-sftp-8496329:SALASANA" \
  --insecure \
  "sftp://partnerupload.google.com:19321/google-products.xml"
```

**Salasanan koodaus:** Erikoismerkit taytyy URL-koodata

- `$` muuttuu `%24`
- `!` muuttuu `%21`

### 6.4 Historialliset ongelmat ja ratkaisut

| Ongelma                 | Juurisyy                              | Ratkaisu                                  |
| ----------------------- | ------------------------------------- | ----------------------------------------- |
| Verkkotunnus ei tasmaa  | URL:t osoittavat lifetime.fi:hin      | Paivitetty kaikki URL:t dws10.com:iin     |
| Duplikaattituotteet     | ID ei tasmaa Merchant Centeriin       | Yhdenmukaistettiin ID:t products.json:ssa |
| identifier_exists-virhe | Asetettu false kun MPN+brand on       | Poistettu kentta kokonaan                 |
| Kuva-URL-virheet        | Kaksinkertaiset kauttaviivat poluissa | Korjattu polkujen generointi              |
| Puuttuvat kassalinkit   | Maksu-URL:a ei konfiguroitu           | Lisattiin Revolut-linkit                  |

---

## 7. EU-sääntelyvaatimustenmukaisuus

### 7.1 EU:n tekoälysaadoksen vaatimukset (elokuu 2026)

EU:n tekoälysäädös luokittelee tekoälyjärjestelmät riskitason mukaan. Äänichat- ja suositusjärjestelmamme kuuluu **Rajoitetun riskin** kategoriaan, joka vaatii:

1. **Lapinaakyvyys:** Ilmoita kayttajille etta he ovat vuorovaikutuksessa tekoälyn kanssa
2. **Ihmisen valvonta:** Eskaloinnin polku ihmistukeen
3. **Dokumentaatio:** Jarjestelman kyvykkyydet ja rajoitukset
4. **Tietosuoja:** GDPR-vaatimustenmukainen tietojen käsittely
5. **Paattelyketju:** Jaljitettavat paatosketjut

### 7.2 Vaatimustenmukaisuuden kartoitus tuotteittain

| Saannos                | Asiaankuuluvat tuotteet           | Asiakkaan tarve                                 |
| ---------------------- | --------------------------------- | ----------------------------------------------- |
| **EU:n tekoälysäädös** | DWS IQ v6, Conversational Agent   | Tekoälyjärjestelmän dokumentointi, läpinäkyvyys |
| **Fit for 55**         | DWS IQ Platform, Firehorse Report | Hiiliraportointi, ETS-vaatimustenmukaisuus      |
| **CSRD**               | Climate Reporting Bundle          | Kestavyysraportointi                            |
| **GDPR**               | Protonmail Implementation         | Tietosuoja, salaus                              |
| **NIS2**               | Protonmail, Firehorse CMS         | Kyberturvallisuusvaatimukset                    |
| **Vihreat vaitteet**   | Firehorse Omnichannel             | Ymparistomarkkinoinnin vaatimustenmukaisuus     |
| **EPBD 2028**          | Firehorse Automation              | Rakennusten energiatehokkuus                    |
| **CBAM**               | DWS IQ, Consulting Fit55          | Hiilirajamekanismi                              |

### 7.3 Artikla 12 -vaatimustenmukaisuus (automaattinen lokitus)

Firehorse-toimintamalli varmistaa EU:n tekoälysaadoksen artikla 12 -vaatimustenmukaisuuden:

- **Git-versionhallinta:** Kaikki muutokset lokitetaan aikaleimoin
- **Commit-historia:** Paatoosten alkupera dokumentoitu
- **Syötteen generointilokit:** Kasittelyrekisterit yllaapidetaan
- **Auditointipolku:** Taysi historia sääntelyyn arviointiin

### 7.4 Vaatimustenmukaisuusilmoituksen malli

```
┌─────────────────────────────────────────────────────────────┐
│ VAATIMUSTENMUKAISUUSILMOITUS (EU:n tekoälysäädös artikla 52)│
├─────────────────────────────────────────────────────────────┤
│ Tämä keskustelu toimii tekoälyn avulla. Olet                │
│ vuorovaikutuksessa automatisoidun järjestelmän kanssa.      │
│                                                              │
│ Profiiliisi sovellettavat saannokset:                       │
│ • EU ETS -direktiivi - Paastokaupan vaatimustenmukaisuus   │
│ • CSRD - Kestavyysraportointivaatimukset                   │
│ • EU:n tekoälysäädös - Tekoälyjärjestelmän dokumentointi   │
│ • GDPR - Tietosuojavelvoitteet                             │
│                                                              │
│ Ihmistuki: support@lifetime.fi                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Tuotesuositusmoottori

### 8.1 Arkkitehtuurin yleiskatsaus

```
┌─────────────────────────────────────────────────────────────┐
│            TUOTESUOSITUSMOOTTORI                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │  Asiakkaan  │ ──► │  Toimialan  │ ──► │  Saannoksen │   │
│  │   profiili  │     │  tunnistus  │     │   kartoitus │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│  │   Hiili-    │ ──► │   Tuote-    │ ──► │   Paketin   │   │
│  │  laskuri    │     │  vastaavuus │     │  generointi │   │
│  └─────────────┘     └─────────────┘     └─────────────┘   │
│                             │                               │
│                             ▼                               │
│                    ┌─────────────────┐                     │
│                    │   Suosituksen   │                     │
│                    │     tuloste     │                     │
│                    └─────────────────┘                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 8.2 Toimialan tunnistussäännöt

| Toimialaindikaattori          | Tunnistettu sektori | Ensisijaiset tuotteet           |
| ----------------------------- | ------------------- | ------------------------------- |
| "sementti", "betoni"          | Sementti            | DWS IQ v6, Climate Bundle       |
| "teras", "metalli"            | Teras               | DWS IQ v6, Firehorse Automation |
| "kemikaali", "petrokemia"     | Kemikaalit          | Firehorse Report, Consulting    |
| "autoteollisuus", "ajoneuvo"  | Autoteollisuus      | DWS IQ v6, Expert Advisory      |
| "merenkulku", "laivaliikenne" | Merenkulku          | Firehorse Automation, Report    |
| "ilmailu", "lentoyhtioo"      | Ilmailu             | DWS IQ v6, Consulting Fit55     |
| "rakennus", "rakentaminen"    | Rakennukset         | Firehorse CMS, Automation       |
| "maatalous", "viljely"        | Maatalous           | Climate Bundle, Advisory        |

### 8.3 Saannoksen laukaisumatriisi

```
┌──────────────┬──────────────┬───────────────────────┐
│ Saannos      │ Laukaisin    │ Suositeltu tuote      │
├──────────────┼──────────────┼───────────────────────┤
│ EU AI Act    │ Tekoälyjarj. │ DWS IQ, Conv. Agent   │
│ Fit for 55   │ >500 tCO2e   │ DWS IQ, FH Report     │
│ CSRD         │ >250 tyont.  │ Climate Bundle        │
│ GDPR         │ Henk.koht.   │ Protonmail Impl.      │
│ NIS2         │ Kriitt. infr.│ FH CMS, Protonmail    │
│ CBAM         │ EU-tuonti    │ DWS IQ, Consulting    │
└──────────────┴──────────────┴───────────────────────┘
```

### 8.4 Paketin generointilogiikka

Kun useita saannoksia sovelletaan, generoidaan optimoidut paketit:

**Esimerkki: Valmistava yritys (250+ tyontekijaa, tuo materiaaleja)**

```
Tunnistetut saannokset:
- Fit for 55 (hiiliraportointi)
- CSRD (kestavyysraportointi)
- CBAM (tuonnin hiilihinnoittelu)
- NIS2 (kyberturvallisuus)

Generoitu paketti:
1. DWS IQ Platform v6 (4 999 EUR) - Ydinvaatimustenmukaisuus
2. Firehorse Report (1 999 EUR) - Automatisoitu raportointi
3. Consulting Fit55 (3 000 EUR/kk) - Asiantuntijaohjaus
4. Protonmail Implementation (499 EUR) - Turvallinen viestinta

Yhteensa: 10 497 EUR + 3 000 EUR/kk jatkuva
Saasto vs. yksittain: 15 %
```

---

## 9. Äänichatin kehityssuunnitelma

### 9.1 Visio

Muunna asiakasvuorovaikutukset tekstipohjaisesta äänipohjaiseksi alykkkailla tuotesuosituksilla käyttäen toimialakohtaisia hiilijalanjälkilaskureita ja EU-sääntelytuntemusta.

### 9.2 Vaihe 1: Perusta (Q1 2026)

**Tavoite:** Perus-äänichat tuotekatalogin tuntemuksella

```
┌─────────────────────────────────────────────────────────────┐
│                     AANICHAT v1.0                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐                            ┌─────────────┐     │
│  │  Aani-  │ ──► Puhe tekstiksi ──────► │   Tuote-    │     │
│  │  syote  │                            │  vastaavuus │     │
│  └─────────┘                            └─────────────┘     │
│       ▲                                        │             │
│       │                                        ▼             │
│  ┌─────────┐                            ┌─────────────┐     │
│  │  Aani-  │ ◄── Teksti puheeksi ◄───── │   Vastaus-  │     │
│  │  tuloste│                            │  generaattori│    │
│  └─────────┘                            └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

**Ominaisuudet:**

- Aaniaanesyote/-tuloste (suomi, englanti, ruotsi)
- Tuotekatalogin haku
- Perus-Q&A palveluista
- Siirto ihmistukeen
- EU:n tekoälysaadoksen läpinäkyvyysilmoitus

**Tekninen pino:**

- Puhe tekstiksi: Whisper API
- Teksti puheeksi: ElevenLabs
- LLM: Groq-inferenssi Llama-malleilla (kustannustehokas)
- Hosting: Cloudflare Workers

### 9.3 Vaihe 2: Hiilijalanjalkililaskurin integraatio (Q2 2026)

**Tavoite:** Toimialakohtainen hiilijalanjalkilaskenta tuotesuosituksin

**Ominaisuudet:**

- Toimialasektorin tunnistus (16 EU-toimialaa)
- Hiilijalanjalarvio (Scope 1, 2, 3)
- Automaattiset tuotesuositukset paastoprofiilin perusteella
- Vaatimustenmukaisuusvaatimusten tunnistus
- ROI-laskenta vaatimustenmukaisuusratkaisuille

**Esimerkkivuorovaikutus:**

```
Asiakas: "Olemme sementtivalmistaja, joka tuottaa 500 000 tonnia vuosittain.
          Mika on arvioitu hiilijalanjalkemme ja miten voitte auttaa?"

Äänichat: "Sementtituotannon toimialakeskiarvojen perusteella arvioitu
           vuotuinen paastosi on noin 450 000 tonnia CO2.

           EU:n paastokauppajärjestelmän mukaan tarvitset varmennetun
           raportoinnin vuoteen 2026 mennessa. Suosittelen:

           1. DWS IQ Platform v6 hintaan 4 999 EUR - Automatisoitu ETS-raportointi
           2. Firehorse Automation hintaan 4 950 EUR - Kosketukseton vaatimustenmukaisuus

           Kokonaisinvestointi: 9 949 EUR ja 90 % ajansaasto raportoinnissa.

           Haluatko minun selittavan EU:n tekoälysaadoksen vaatimukset
           naille tekoälykäyttöisille vaatimustenmukaisuustyökaluille?"
```

### 9.4 Vaihe 3: EU-sääntelytuntemus (Q3 2026)

**Tavoite:** Ennakoivat sääntelyvaatimustenmukaisuussuositukset

**Ominaisuudet:**

- Reaaliaikainen sääntelyseuranta
- Asiakasprofiilin analyysi
- Ennakoivat vaatimustenmukaisuushalytykset
- Monisaantoospaketin optimointi
- Kumppanituotteiden integraatio

**Saannoksen tunnistusmatriisi:**

```
Asiakasprofiilin analyysi:
├── Toimialasektori
├── Yrityksen koko (PK-yritys/Suuri)
├── Maantieteellinen laajuus
├── Tietojen käsittelykäytännöt
└── Tekoälyjärjestelmän käyttö

→ Automatisoitu säännöskartoitus
→ Tuotesuositukset
→ Vaatimustenmukaisuusaikataulu
```

### 9.5 Vaihe 4: Kumppaniekosysteemi (Q4 2026)

**Tavoite:** Laajenna suositukset kattamaan kumppanien tarjoamat

**Kumppaniakategoriat:**

- Vaatimustenmukaisuusohjelmistokumppanit
- ESG-tietotarjoajat
- Hiilipaastaohyvitysmarkkinapaikat
- Juridisen neuvonnan kumppanit
- Sertifiointielimet

**Ansaintamalli:**

- Lifetime-tuotteet: Suoramyynti
- Kumppanituotteet: Valityspalkkio (10-20 %)

### 9.6 Toteutusaikataulu

| Vaihe | Kvartaali | Ominaisuudet             | EU-vaatimustenmukaisuus              |
| ----- | --------- | ------------------------ | ------------------------------------ |
| 1     | Q1 2026   | Perus-äänichat           | Tekoälysaadoksen läpinäkyvyys        |
| 2     | Q2 2026   | Hiilijalanjalkililaskuri | Fit for 55 -tuki                     |
| 3     | Q3 2026   | Saantelymoottori         | Tayssi vaatimustenmukaisuuskartoitus |
| 4     | Q4 2026   | Kumppaniekosysteemi      | Laajennetut tarjoamat                |

---

## 10. Toimialan hiilijalanjälkilaskuri

### 10.1 Laskurin arkkitehtuuri

```
┌─────────────────────────────────────────────────────────────┐
│              TOIMIALAN HIILILILASKURI                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Syoteparametrit:                                           │
│  ┌────────────────────────────────────────────────────┐     │
│  │ • Toimialasektori (16 EU-toimialaa tuettu)        │     │
│  │ • Vuotuinen liikevaihto (EUR)                      │     │
│  │ • Energiankulutus (kWh)                            │     │
│  │ • Kuljetuslogistiikka (km, tavat)                  │     │
│  │ • Toimitusketjun laajuus (taso 1, 2, 3)           │     │
│  │ • Tyontekijamaara                                   │     │
│  │ • Tuotantomaaara (yksikot/tonnit)                  │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │            HIILIJALANJALMOOTTORI                   │     │
│  │  • Scope 1: Suorat paastot (polttoaine, prosessi) │     │
│  │  • Scope 2: Epasuora energia (sahko, lampo)       │     │
│  │  • Scope 3: Arvoketju (hankinta, jakelu)          │     │
│  └────────────────────────────────────────────────────┘     │
│                           │                                  │
│                           ▼                                  │
│  ┌────────────────────────────────────────────────────┐     │
│  │         TUOTESUOSITUSMOOTTORI                      │     │
│  │  Kartoittaa hiilijprofiilin → Lifetime-tuotteet   │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 10.2 Toimialan paastokertoimet

| Toimiala       | Keskim. tCO2e/M€ liikevaihto | Paapaastolahde            |
| -------------- | ---------------------------- | ------------------------- |
| Teras          | 850                          | Prosessipaastot (Scope 1) |
| Sementti       | 900                          | Kalsinointiprosessi       |
| Kemikaalit     | 400                          | Energia + raaka-aineet    |
| Autoteollisuus | 150                          | Valmistus + toimitusketju |
| Merenkulku     | 300                          | Polttoaineenkulutus       |
| Ilmailu        | 500                          | Lentopolttoaineen poltto  |
| Rakennukset    | 100                          | Energiatehokkuus          |
| Maatalous      | 250                          | Maankäyttö, kotielaimet   |
| Sellu & Paperi | 200                          | Prosessienergia           |
| Lasi           | 350                          | Sulatusprosessi           |
| Keramiikka     | 300                          | Uunitoiminnot             |
| Tekstiilit     | 180                          | Toimitusketju             |
| Elintarvikkeet | 120                          | Kasittely + kylmaketju    |
| Elektroniikka  | 80                           | Valmistus + käyttövaihe   |
| Laakkeet       | 60                           | Kontrolloidut prosessit   |
| Datakeskukset  | 150                          | Sahkonkulutus             |

### 10.3 Tuotekartoitus hiilijprofiilin mukaan

| Hiilijalanjalprofiili | Paastoalue           | Suositellut tuotteet                             |
| --------------------- | -------------------- | ------------------------------------------------ |
| Erittain korkea       | >100 000 tCO2e       | DWS IQ v6, Firehorse Automation, Expert Advisory |
| Korkea                | 10 000-100 000 tCO2e | DWS IQ v6, Firehorse Report, Climate Bundle      |
| Keskitaso             | 1 000-10 000 tCO2e   | Climate Bundle, Firehorse Report                 |
| Matala                | <1 000 tCO2e         | Firehorse Report, Consulting Hourly              |

### 10.4 ROI-laskuri

```
Syote:
- Nykyiset manuaaliset raportointitunnit: 200 h/vuosi
- Tuntikustannus: 75 EUR/h
- Nykyinen raportointikustannus: 15 000 EUR/vuosi

Investointi:
- DWS IQ Platform v6: 4 999 EUR
- Vuosittainen tilaus: 5 988 EUR/vuosi

Saastot:
- Automatisoitu raportointi: 90 % ajansaasto
- Uusi raportointikustannus: 1 500 EUR/vuosi
- Vuosittainen saasto: 13 500 EUR

ROI:
- Ensimmainen vuosi: 13 500 EUR - 10 987 EUR = 2 513 EUR nettopositiivinen
- Takaisinmaksuaika: 9,8 kuukautta
- 3 vuoden saastot: 40 500 EUR
```

---

## 11. Proton-tuotestrategia

### 11.1 Turvallisuustuoteportfolio

Lifetime Oy tarjoaa Proton Business Suite -toteutusta turvallisuuskeskeisenaa tuotteena:

**Tuote:** Protonmail Secure Email & Domains Implementation
**Hinta:** 499 EUR (8 tunnin toteutus)
**MPN:** PROTON-EMAIL-2026

### 11.2 Sisaltyvat palvelut

| Komponentti            | Kuvaus                             |
| ---------------------- | ---------------------------------- |
| Proton Mail            | Paasta paahan salattu sahkoposti   |
| Proton Drive           | Salattu pilvitallennustila         |
| Proton Pass            | Nollatietosalasanahallinta         |
| Proton VPN             | Turvallinen verkkoyhteys           |
| Verkkotunnuksen asetus | Oman verkkotunnuksen konfigurointi |
| Migraatio              | Sahkopostin siirtoapu              |

### 11.3 Vaatimustenmukaisuuskattavuus

| Saannos            | Protonin vaatimustenmukaisuus |
| ------------------ | ----------------------------- |
| GDPR artikla 32    | Tekniset turvatoimet          |
| NIS2               | Kryptografiset kontrollit     |
| EU:n tekoälysäädös | Turvallinen tekoälyviestinta  |
| Sveitsin FADP      | Lisakyksityisyydensuoja       |

### 11.4 Suosituslaukaisimet

Äänichat suosittelee Proton-toteutusta kun havaitaan:

- "tietoturvahuolet" tai "tietosuoja"
- "GDPR-vaatimustenmukaisuus" tai "yksityisyys"
- "salattu sahkoposti" tai "turvallinen viestinta"
- "NIS2" tai "kyberturvallisuusvaatimukset"
- Toimialasektorit: Terveydenhuolto, lakiasiat, rahoitus

### 11.5 Suosituksen tuloste

```
┌─────────────────────────────────────────────────────────────┐
│ TURVALLISUUSSUOSITUS: Protonmail-toteutus                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Havaittu tarve: Turvallinen viestinta, GDPR-vaatimust.      │
│                                                              │
│ Tuote: Protonmail Secure Email & Domains Implementation     │
│ Hinta: 499 EUR (8 tunnin toteutus)                          │
│                                                              │
│ Sisaltaa:                                                    │
│ • Paasta paahan salattu sahkoposti                         │
│ • Proton Drive (salattu pilvitallennustila)                │
│ • Proton Pass (salasanahallinta)                           │
│ • Proton VPN (turvallinen verkkoyhteys)                    │
│                                                              │
│ Vaatimustenmukaisuuskattavuus:                              │
│ • GDPR - Artikla 32 turvatoimet                            │
│ • NIS2 - Kryptografiset kontrollit                         │
│ • EU:n tekoälysäädös - Turvallinen tekoälyviestinta       │
│                                                              │
│ Miksi Proton EU-vaatimustenmukaisuuteen:                    │
│ • Sveitsin lainkaytoalue + EU-hostausvaihtoehto            │
│ • Nollatietoarkkitehtuuri                                   │
│ • Avoin lahdekoodi, auditoitu turvallisuus                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 12. IPR-suojaus ja liikesalaisuusstrategia

### 12.1 Kolmitasoinen IPR-kehys

Firehorse-toimintamalli ja sen taustateknologiat vaativat jasennetyn immateriaalioikeuksien (IPR) suojausstrategian. Lifetime Oy kayttaa kolmitasoista luokittelukehysta:

| Taso                        | Mekanismi           | Laajuus                                                           | Oikeudellinen perusta                    |
| --------------------------- | ------------------- | ----------------------------------------------------------------- | ---------------------------------------- |
| **Taso 1: Julkinen**        | Vapaa jakelu        | Teaser, FCD-konsepti, markkinakoko                                | —                                        |
| **Taso 2: NDA vaaditaan**   | Salassapitosopimus  | LWM-arkkitehtuuri, tietograafin yleiskuva, BYOC-logiikka          | EU:n liikesalaisuusdirektiivi 2016/943   |
| **Taso 3A: Patentti**       | Patenttisuoja       | CIDM-menetelma, kausaalinen päättelyalgoritmi                     | PRH (Suomi), EPO, PCT                    |
| **Taso 3B: Liikesalaisuus** | Sisaiset kontrollit | Tietograafin rakenne (10 000+ solmua), painotukset, koulutusdatan | EU 2016/943, Liikesalaisuuslaki 595/2018 |

### 12.2 NDA-portti tekniselle tiedonjakamiselle

Ennen teknista syvennystä kumppanien, sijoittajien tai asiakkaiden kanssa vastaanottavan osapuolen on allekirjoitettava Lifetime Oy:n NDA (EU:n liikesalaisuusdirektiivin 2016/943 mukainen). NDA kattaa:

- **LWM-arkkitehtuuri** — komponenttikaavio, tietovirrat, käsittelyputki
- **Tietograafin rakenne** — solmutaksonomia, reunatyypit, suhdenmalli
- **BYOC (Bring Your Own Cloud) -logiikka** — pilvikaytonotto, vuokralaisieristys, tietojen sijainti
- **Agenttien orkestrointi** — MCP-palvelimen konfiguraatio, koordinointiprotokollat
- **Integraatioarkkitehtuuri** — ERP-liittimet (SAP, IFS, Dynamics)

Julkisia/markkinointimateriaaleja (taso 1) voidaan jakaa vapaasti ilman NDA:ta: tuote-esittelyt, FCD-konseptin yleiskatsaus, markkinakoko ja ylatasonarkkitehtuurikaaviot.

### 12.3 Patenttistrategia

Patentoitavat innovaatiot haetaan PRH:n (Patentti- ja rekisterihallitus) kautta kansainvalista PCT-laajennusta hyodyntaen:

| Prioriteetti | Innovaatio                            | Hakupolku             | Tila                     |
| ------------ | ------------------------------------- | --------------------- | ------------------------ |
| P1           | CIDM — Ilmastoalykas päätöksenteko    | PRH → PCT → EPO/USPTO | Patenttihakemus vireilla |
| P2           | Kausaalinen päättely sääntelyriskille | PRH → PCT             | Ennakkoselvitys Q2 2026  |
| P3           | LWM:n temporaalinen latenttitila      | PRH → PCT             | Arviointi Q3 2026        |

**Kriittinen saanto:** Patenttihakemukset ON jatettava ennen menetelman julkista paljastamista. NDA:lla suojatut paljastukset eivat tuhoa patentoitavuutta.

### 12.4 Liikesalaisuus tietograafin ensisijaisena suojana

Tietograafille (10 000+ solmua) liikesalaisuussuoja on strategisesti parempi vaihtoehto kuin patentti:

| Tekija                 | Patentti                           | Liikesalaisuus              |
| ---------------------- | ---------------------------------- | --------------------------- |
| Kesto                  | 20 vuotta (sitten julkinen)        | Rajoittamaton               |
| Paljastusvelvoite      | Menetelma julkaistava kokonaan     | Ei paljastusvelvoitetta     |
| Kilpailijan tietoisuus | Tietaa tarkalleen mita suojataan   | Ei voi tietaa mita kopioida |
| Kustannus              | 120k–200k EUR (3 patenttia, EU+US) | Hallinnolliset kulut        |

Liikesalaisuusasema EU:n direktiivin 2016/943 mukaan edellyttaa: (1) tieto on salaista, (2) silla on kaupallista arvoa salaisuutensa vuoksi ja (3) kohtuullisia toimenpiteita on toteutettu sen pitamiseksi salassa. Lifetime Oy yllapitaa paasyvalvontaa, salausta, tyontekijoiden salassapitosopimuksia ja sisaisia luokittelurekistereita.

### 12.5 Vaikutukset Firehorse-toimintaan

IPR-kehys vaikuttaa suoraan Firehorse-verkkokauppatoimintaan:

- **Tuotekuvaukset** dws10.com:ssa kertovat _mita_ alusta tekee (taso 1), eivat koskaan _miten_ se toimii
- **Sijoittajapitchit** jakavat ongelman/ratkaisun/markkinan vapaasti; arkkitehtuuriyksityiskohdat vaativat NDA:n
- **Konferenssiesitykset** kasittelevat EU:n vaatimustenmukaisuuspuutteita, eivat algoritmien yksityiskohtia
- **Asiakasdemonstraatiot** toimivat NDA:n alla vesileimattuja materiaaleja käyttäen
- **Kaupan tuotesivut** viittaavat ominaisuuksiin, eivat toteutuksen yksityiskohtiin

---

## 13. Prompt-välimuistiarkkitehtuuri tekoälyagenteille

### 13.1 Suunnitteluperiaate: välimuisti ratkaisee kaiken

Firehorse-toimintamalli nojaa pitkakestoisiin tekoälyagenttisessioihin (Claude Code) kaupan hallintaan, tuotepaivityksiin ja vaatimustenmukaisuusautomaatioon. Prompt-välimuisti (prompt caching) on perustava suunnitteluperiaate, joka tekee naista sessioista taloudellisesti kannattavia.

**Lahde:** Thariq Shihipar (Anthropic), "Lessons from Building Claude Code: Prompt Caching Is Everything" (2026).

**Ydinnakyma:** Prompt-välimuisti kayttaa uudelleen laskentatuloksia aiemmista API-kierroksista etuliitesovituksen (prefix matching) avulla. API tallentaa välimuistiin kaiken pyynton alusta kunkin `cache_control`-katkaisupisteen kohdalle. Korkea välimuistin osumisprosentti vähentää kustannuksia ja viivetta merkittavasti.

### 13.2 Jarjestelmapromptin asettelu välimuistia varten

Promptin sisallon jarjestys on ratkaiseva — staattinen sisalto ensin, dynaaminen viimeisena:

```
1. Staattinen jjärjestelmä prompti & työkalut  (globaalisti välimuistissa)
2. CLAUDE.md / projektikonfiguraatio            (välimuistissa projektin sisalla)
3. Sessiokonteksti                               (välimuistissa session sisalla)
4. Keskusteluviestit                              (uusia joka kierroksella)
```

**Herkkyysvaroitus:** Valimuistijaarjestys rikkoutuu kun:

- Aikaleimat sijoitetaan staattiseen järjestelmäpromptiin
- Tyokalumaaritelmat sekoitetaan ei-deterministisesti
- Tyokaluparametreja paivitetaan kesken session (esim. kaytettavissa olevat agentit)

### 13.3 Kuusi suunnittelusaantoa agenttien välimuistille

| Saanto                                               | Periaate                                                  | Toteutus                                                                                               |
| ---------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **1. Staattinen ensin, dynaaminen viimeisena**       | Maksimoi jaettu etuliite sessioiden valilla               | Jarjestelmaprompt → CLAUDE.md → sessiokonteksti → viestit                                              |
| **2. Kayta järjestelmäviesteja paivityksiin**        | Ala muokkaa staattista promptia kesken session            | Vaali ajan, tiedostomuutosten ja tilasiirtymien valittaminen `<system-reminder>`-tageina               |
| **3. Ala vaihda mallia kesken session**              | Prompt-välimuistit ovat mallikohtaisia                    | Haiku-vaihto 100k tokenin kohdalla maksaa enemman kuin Opus-jatkaminen (välimuistin uudelleenrakennus) |
| **4. Ala lisaa/poista työkaluja kesken session**     | Tyokalut ovat osa välimuistietuliitetta                   | Kayta työkalutynkia `defer_loading: true` -asetuksella; löydä ToolSearchilla                           |
| **5. Suunnittele ominaisuudet välimuistin ehdoilla** | Tilasiirtymat työkaluilla, ei työkalujoukon vaihdoilla    | Suunnittelutila = järjestelmäaviesti + ExitPlanMode-työkalu, ei työkalujoukon vaihtaminen              |
| **6. Haarautumisoperaatiot jakavat ylaviitteen**     | Tiivistys/yhteenvedot on kaytettava välimuistia uudelleen | Kayta identtista järjestelmäapromptia, työkaluja ja viestihistoriaa haarautuneissa pyynnissa           |

### 13.4 Tiivistys: välimuistiturvallinen kontekstin haarautuminen

Kun agenttisessiot lahestyvat konteksti-ikkunan rajaa, tiivistyksen (compaction) on sailytettava välimuisti:

```
VAARIN: Uusi API-kutsu eri järjestelmäpromptilla + ei työkaluja
        → Taysi välimuistihuti, kallista

OIKEIN: Sama järjestelmäprompt + samat työkalut + ylatasoan viestihistoria
        + tiivistysprompt lisattyna uutena käyttäjäviestina
        → Valimuistiosuma ylatasoan etuliitteelle, vain uudet tokenit ovat prompti
```

### 13.5 Toiminnallinen vaikutus Firehorseen

DWS10.com-kauppatoiminnoissa nama välimuistiperiaatteet tarkoittavat:

| Toiminto                                 | Valimuistivaikutus                       | Kaytanto                                        |
| ---------------------------------------- | ---------------------------------------- | ----------------------------------------------- |
| Tuotekatalogin päivitykset               | Pitka sessio, paljon tiedostomuokkauksia | Pida sama malli koko session ajan               |
| Syötteen generointi                      | Tyokalupainotteinen työnkulku            | Kaikki työkalut maaritelty session alussa       |
| Vaatimustenmukaisuustarkistus            | Kontekstipainotteinen (saannokset)       | CLAUDE.md välimuistissa projektikonfiguraationa |
| Monitiedostosynkronointi (kaksoiskansio) | Perakkaisia riippuvia operaatioita       | Ketjuta yhdessa sessiossa, ala haarauta         |

**Seuranta:** Valimuistin osumisprosenttia kasitellaan käyttöaikamittarina. Osumien lasku kaynnistaa tutkimuksen — se osoittaa järjestelmäpromptin muutoksen, työkalumaaritysten siirtyman tai mallinvaihdon joka vaatii korjauksen.

### 13.6 Kustannus- ja viivevaikutukset

| Skenaario                              | Osumisprosentti               | Suhteellinen kustannus | Viive           |
| -------------------------------------- | ----------------------------- | ---------------------- | --------------- |
| Optimoitu (staattinen etuliite)        | >90 %                         | 1x (perustaso)         | Matala          |
| Tyokalujoukon muutokset kesken session | ~50 %                         | ~2x                    | Korkea          |
| Mallinvaihto kesken session            | 0 % (taysi uudelleenrakennus) | ~3-5x                  | Erittain korkea |
| Tiivistys ilman ylatasoan etuliitetta  | 0 %                           | ~3x                    | Korkea          |

Nama taloudelliset realiteetit ovat kriittisia Firehorsen tekoälyavusteiselle kauppatoiminnalle, jossa sessiot kasittelevat rutiininomaisesti yli 30 tuotetta useissa tiedostoissa.

---

## 14. Tulokset ja pohdinta

### 14.1 Toimialakohtainen avoimen LLM:n valinta

Yksikään avoin LLM ei ole optimaalinen kaikille 16 EU-toimialalle, joita DWS IQ palvelee. Jokaisella toimialavertikaalilla on oma sääntelykieli, toimialaosaamisvaatimukset ja rakenteellisen tulosteen tarpeet. `AgentConfig.model`-kenttä on jo agenttikohtainen, joten jokainen konkreettinen agentti voidaan konfiguroida eri koulutetulla Lifetime World Model (LWM) -mallilla + avoimella LLM:llä, jatkuvalla vertailuarvioinnilla.

**Avoimen LLM:n ehdokkaat toimialaklustereittain:**

| Toimialaklusteri                    | Ehdokkaat                                  | Keskeinen toimialavaatimus                                        |
| ----------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| Rakentaminen, Kiinteistöt           | Llama 3.3 70B, Qwen 2.5 72B, Mistral Large | EN 15978 elinkaarivaiheet, pohjoismaiset rakennusmääräykset, EPBD |
| Energia, Teräs & Metallit, Sementti | Llama 3.3, DeepSeek-V3, Mixtral 8x22B      | ETS-päästöoikeuslaskelmat, prosessipäästöt, CBAM                  |
| Valmistus, Kemianteollisuus         | Qwen 2.5 72B, Llama 3.3                    | CBAM-tuoteluokittelu, osaluetteloanalyysi, REACH                  |
| Logistiikka, Merenkulku, Ilmailu    | Mistral Large, Llama 3.3, Gemma 2 27B      | FuelEU Maritime, CORSIA, reittioptimiointi                        |
| Maatalous, Elintarvikkeet           | Llama 3.3, Gemma 2, Command R+             | LULUCF, Scope 3 toimitusketju, pakkauselinkaari                   |
| Rahoitus, Julkinen sektori          | Mistral Large (EU-isännöity), Llama 3.3    | SFDR, EU-taksonomia, kaksoisolennaisuus, GPP                      |
| Terveydenhuolto, Tekstiilit         | Gemma 2 (EU-isännöity), Qwen 2.5           | Digitaalinen tuotepassi, lääketeollisuuden toimitusketju          |

**Valintakriteerit:** toimialaosaamisen syvyys, monikielisyys, rakenteellisen tulosteen luotettavuus, konteksti-ikkuna (128k+), päättelynopeus, EU-tietojen sijainti ja kaupallinen lisenssi.

**Jatkuva vertailuarviointiprosessi:** Jokainen toimiala-agentti suorittaa viikoittain automaattiset vaatimustenmukaisuuskehotteet (EN 15978, CSRD ESRS E1, CBAM-ilmoitukset) nykyistä mallia ja 2-3 vaihtoehtoa vastaan. Jos vaihtoehto saa johdonmukaisesti korkeammat pisteet tarkkuudessa ja rakenteellisessa tulosteessa, malli merkitään tarkistettavaksi ja mahdollisesti vaihdettavaksi.

### 14.2 Tuo omat agentit (BYOA) -arkkitehtuuri

Yritysasiakkaat tuovat omat tekoälyagenttinsa työskentelemään DWS IQ:ssa. Tässä osiossa käytetään NCC:tä (pohjoismainen rakennusyhtiö) havainnollistavana tapauksena.

**NCC:n agenttiekosysteemi:**

| Agenttilähde                | Määrä | Esimerkit                                                                                 |
| --------------------------- | ----- | ----------------------------------------------------------------------------------------- |
| **NCC:n sisäiset**          | 7     | Hankinta, Turvallisuus, BIM, Kestävyys, Kustannusarvio, Laatu, Projektisuunnittelu        |
| **Urakoitsijoiden agentit** | 14    | LVI-urakoitsija, Sähkö, Betonitoimittaja, Terästoimittaja, Ikkunavalmistaja, Eristys jne. |
| **DWS IQ -alusta**          | 3     | Vaatimustenmukaisuuslaskenta, Firehorse-raportti, Hiililaskuri                            |
| **Yhteensä**                | 24    | Kaikki yhdistetty A2A + MCP -protokollilla                                                |

**Vuokralaiskohtainen Lifetime World Model (LWM):**

Lifetime World Model on yrityksen oppimiskerros, joka sijaitsee valitun avoimen LLM:n päällä. Se ei ole pelkästään hienosäädetty malli — se on strateginen tiedustelukerros, joka:

1. **Hienosäätää yrityksen dataa ja sääntelyä** — sisäistää asiakkaan operatiivisen datan, toimialastandardit ja EU-sääntelykontekstin luodakseen toimialakohtaista älykkyyttä, jota geneeriset LLM:t eivät pysty tarjoamaan
2. **Optimoi markkina-arvon** — oppii jatkuvasti vaatimustenmukaisuuden tuloksista, energiatehokkuustuloksista ja operatiivisista mittareista tunnistaakseen arvonluontimahdollisuuksia
3. **Varmistaa kilpailuedun moniagenttityökaluilla** — yhdistämällä vuokralaiskohtaisen tietämyksen moniagenttien orkestrointiin (A2A + MCP), LWM muuttaa raaan tekoälykyvykkyyden korvaamattomaksi operatiiviseksi voimavaraksi

Jokainen yritysvuokralainen saa oman LWM-instanssinsa:

- **Pohja-LLM:** Valittu toimiala-arvioinnin perusteella (esim. Qwen 2.5 72B pohjoismaiseen rakentamiseen)
- **Hienosäädetty:** Vuokralaisen omalla projektidatalla, toimialakoodeilla (RT-kortisto), sääntelykontekstilla
- **Liittimet:** Tekla Structures (BIM), IFS Cloud (ERP), CO2data.fi (päästökertoimet)
- **Hiekkalaatikko:** Vaihe 2 hetkelliskontteja (europe-north1) tai Vaihe 3 pysyviä (skaalassa)

**Miksi 20 toimialaa tekee LWM:stä vahvemman:** Jokainen alustalle lisätty toimiala tekee jokaisen olemassa olevan toimialan LWM:stä älykkäämmän anonymisoitujen vaatimustenmukaisuuskaavojen ristioppimisen kautta. Sementinvalmistuksessa todistettu hiilidioksidipäästöjen vähennystekniikka tuottaa siirrettävää tietoa rakentamiseen. Valmistuksen toimitusketjun Scope 3 -agentit siirtyvät elintarviketeollisuuteen. 20. toimialan asiakas hyötyy kaikkien 19 toimialan kertyneestä älykkyydestä — luoden vallihaudan, jota yksittäisen toimialan kilpailijat eivät voi replikoida.

### 14.2.1 LWM:n tuotemarkkinavalidointi: Energiasektorin tapaustutkimus (maaliskuu 2026)

Lifetime World Modelin kaupallinen elinkelpoisuus sai ensimmäisen ulkoisen validointinsa maaliskuussa 2026 kumppanuusneuvotteluissa **Qantic GmbH:n** (Berliini) kanssa. Qantic on BESS-simulointiyhtiö, jonka Q-System mallintaa energiatuloja mutta ei laske vaatimustenmukaisuuskustannuksia.

**Validoitu hypoteesi:** LWM:n regulaatiotietoverkostolla on kaupallista arvoa rakennusalan ulkopuolella. Qanticin yritysasiakkaat (esim. MAN Energy Solutions) kattavat kuusi EU-säänneltyä toimialaa samanaikaisesti — Sähkö ja lämpö, Rauta ja teräs, Merenkulku, Maantieliikenne, Rakentaminen ja Kemikaalit. DWS IQ:n 20 toimialan LWM kattaa kaikki kuusi yhdestä alustasta, mikä validoi ristisektoraalisen verkostovaikutushypoteesin.

**Kvantitoitu tuotos (50MW/200MWh BESS, Saksa):** 21 693 €/vuosi kokonaisvaatimustenmukaisuuskustannus (Scope 2: 5 005 €, CSRD-raportointi: 12 000 €, EU-taksonomian sertifiointi: 4 200 €, hyötysuhdehäviö: 488 €). Laskettu olemassa olevalla BESS Compliance API:lla (19 yksikkötestiä läpäisee) — ei tuotekartalla.

**Firehorse-toimintamallin näyttö:** Kaupparakenne (15 990 € käyttöönotto + 99 €/omaisuuserä/kuukausi API) validoi Firehorse-tuotevalmistusmallin: standardoidut tuotteet rakennettu ennen asiakaskontaktia, toimitettu 10x halvemmalla kuin yritysvaihtoehdot (200 000+ €/vuosi Big 4 -konsulteilta). Tämä osoittaa, että Firehorse-malli skaalautuu rakennusalaa laajemmalle energiasektorin vaatimustenmukaisuuteen — tukien tohtoriopinnäytteen väitettä, että tekoälynatiivit toimintamallit ovat siirrettävissä EU-säänneltyjen toimialojen välillä.

**Avainpanos #16:** Ensimmäinen ulkoinen markkinavalidointi LWM:n kaupallisesta arvosta rakennussektorin ulkopuolella, vahvistaa 20 toimialan arkkitehtuurin luovan puolustettavaa kilpailuetua ristisektoraalisella regulaatiokattavuudella.

### 14.3 Agent Orchestration Studio: Graafinen työnkulkurakentaja

Jotta yritysasiakkaat voivat rakentaa yhteyksiä 24+ agentin välille, alusta tarjoaa visuaalisen työnkulkurakentajan.

**Työkalujen arviointi:**

| Työkalu         | Lisenssi   | MCP-tuki                  | A2A-tuki                | EU-isännöinti  | Paras käyttö                          |
| --------------- | ---------- | ------------------------- | ----------------------- | -------------- | ------------------------------------- |
| **Langflow**    | Apache 2.0 | Natiivi (client + server) | Mukautetuilla solmuilla | Kyllä          | Agenttiorkestrointi, LLM-työnkulut    |
| **n8n**         | Fair Code  | Yhteisösolmuilla          | HTTP-solmuilla          | Kyllä          | ERP/BIM-liittimet, dataputket         |
| **React Flow**  | MIT        | Mukautettu                | Mukautettu              | N/A (kirjasto) | Mukautettu visuaalinen käyttöliittymä |
| **Flowise**     | Apache 2.0 | Osittainen                | Ei                      | Kyllä          | Chatbot RAG -työnkulut                |
| **Node-RED**    | Apache 2.0 | FlowFusen kautta          | HTTP                    | Kyllä          | IoT/reuna, teollinen automaatio       |
| **Temporal UI** | MIT        | Ei                        | Ei                      | Kyllä          | Työnkulun suorituksen seuranta        |

**Suositeltu: Langflow + React Flow + Temporal.io**

```
┌─────────────────────────────────────────────────────────┐
│  DWS IQ Agent Orchestration Studio (React)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React Flow -visuaalinen kanvas                   │  │
│  │  - Vedä ja pudota -agenttisolmut                  │  │
│  │  - Agenttikohtainen LLM-mallin valinta            │  │
│  │  - Visuaalinen liitinten kytkentä                 │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Langflow-moottori (MCP + A2A -orkestrointi)      │  │
│  │  - Agenttisolmut = A2A Agent Cards                │  │
│  │  - Liittimet = MCP-työkalut                       │  │
│  │  - Työnkulut viedään Temporal.io-työnkuluiksi     │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Temporal.io (kestävä suoritus, jo käytössä)      │  │
│  │  - Uudelleenyritys, aikakatkaisu, kompensointi    │  │
│  │  - EU:n tekoälysäädöksen artikla 12 -auditointipolku │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Perusteet:**

1. **React Flow** (MIT) — Mukautettu visuaalinen kanvas DWS IQ React -hallintapaneelissa. Nolla toimittajalukkiutumista.
2. **Langflow** (Apache 2.0) — Natiivi MCP + A2A -tuki. EU-isännöity. IBM:n yrityskumppanuus.
3. **Temporal.io** — Jo käytössä. Kestävä suoritus täydellä artikla 12 -auditointipolulla.
4. **n8n** — Täydentävä ERP/BIM-liitin­työnkuluissa (Tekla ↔ IFS Cloud -synkronointi).

### 14.4 Urakoitsija-agentin käyttöönotto

```
1. Urakoitsija julkaisee Agent Cardin (/.well-known/agent.json)
2. NCC:n ylläpitäjä avaa Agent Orchestration Studion
3. Studio löytää urakoitsija-agentin A2A-protokollalla
4. Ylläpitäjä vetää urakoitsijan kanvakselle, yhdistää työnkulkuihin
5. Studio validoi yhteyden (A2A-terveystarkistus)
6. Työnkulku otetaan käyttöön Temporal.io:ssa
7. Kaikki vuorovaikutukset kirjataan EU:n tekoälysäädöksen artikla 12 mukaisesti
```

### 14.5 DWS7 agenttiarkkitehtuurin modernisointi

DWS6:sta DWS7:ään siirtyminen korjaa kuusi kriittistä arkkitehtuurista puutetta, jotka havaittiin tuotantokäytön aikana. Toteutettu yhdessä Claude Code -sessiossa (24.02.2026), nämä korjaukset muuttavat agenttijärjestelmän 2023-aikakauden mallista tuotantotason agenttialustaksi.

**Kuusi korjausta:**

| #   | Puute                   | Korjaus                                                    | Tiedosto          |
| --- | ----------------------- | ---------------------------------------------------------- | ----------------- |
| 1   | Yksittäiskutsu-LLM      | Havainnoi-ajattele-toimi -silmukka (`runLoop()`)           | `base.agent.ts`   |
| 2   | Ei työkalujen käyttöä   | Työkaluajoympäristö JSON Schemalla + 4 sisäänrak. työkalua | `tools.ts`        |
| 3   | Kovakoodattu Groq-kutsu | Monituottaja-asiakas (Anthropic > Groq > OpenAI)           | `llm-client.ts`   |
| 4   | Ei agenttiviestintää    | Delegointi + syvyysseuranta + löytämis-API                 | `index.ts`        |
| 5   | MCP oli tyhjä lupaus    | JSON-RPC 2.0 -palvelin osoitteessa `/mcp`                  | `agent-server.ts` |
| 6   | Vain Express            | Tapahtumaväylä pub/sub + Redis Streams                     | `event-bus.ts`    |

**Build for Agents -periaate:** Jokaisen DWS-tuotteen tulee olla saavutettavissa:

- **CLI** (`cli/src/cli.ts`) — JSON-tuloste, putkitettava, nollariippuvuudet
- **MCP** (`/mcp`-päätepiste) — Claude Code / Cursor löytää automaattisesti
- **Claude Code Skills** (`.claude/commands/`) — luonnollisen kielen agentin kutsuminen
- **REST API** (`/api/agents/`) — perinteinen HTTP-integraatio
- **Tapahtumaväylä** — reaaliaikainen agenttikoordinaatio SSE:n kautta

**EU:n tekoälysäädöksen artikla 12:** Agenttisilmukka-arkkitehtuuri täyttää luontaisesti automaattisen kirjausvaatimuksen. Jokainen iteraatio tallentaa havainnon, ajattelun, toiminnot ja tulokset `agent_loop_iterations` Supabase-tauluun — luoden täydellisen päättelyketjun syötteestä tulosteeseen.

**Vaikutus Firehorse-toimintamalliin:** CLI ja Skills -kerros tarkoittaa, että Firehorse-kaupan hallinta voidaan nyt automatisoida tekoälyagenteilla päästä päähän: vaatimustenmukaisuustarkistukset `/compliance-check`-komennolla, hiilianalyysi `/carbon-analysis`-komennolla ja moniagentin työnkulut `/workflow`-komennolla — kaikki ilman ihmisen GUI-vuorovaikutusta.

---

### 14.6 Agent Foundry Vaihe 1.5: OpenSandbox + EMPO² agenttimuisti

_Sessio: claude/sandbox-agents-opensandbox-HatfC | Päiväys: 01.03.2026_

#### 14.6.1 Vaihe 1.5 — OpenSandbox Acer Veriton GN100 -laitteella

Agent Foundry sai uuden eristysvaiheen demo-tason SDK-hiekkalaatikon (Vaihe 1) ja Cloud Run:n (Vaihe 2) väliin: **OpenSandbox** (https://github.com/alibaba/OpenSandbox) **Acer Veriton GN100** -reunasolmussa (120 GiB RAM, 20 ydintä, Helsinki Lab).

| Vaihe   | Menetelmä                                   | Kustannus  | Käyttötapaus                          |
| ------- | ------------------------------------------- | ---------- | ------------------------------------- |
| 1       | SDK-hiekkalaatikko (bubblewrap/seatbelt)    | €0         | Demo, yksiasiakkuus                   |
| **1.5** | **OpenSandbox Docker (Veriton GN100)**      | **€0 HW**  | **EU-ilmarakoinen, sisäinen pilotti** |
| 2       | Cloud Run hetkelliskontteja (europe-north1) | ~€20-50/kk | Maksava moniasiakkuus                 |
| 3       | Pysyvät kontit (gVisor)                     | €200+/kk   | Skaalautuminen                        |

Aktivointi: `SANDBOX_STAGE=opensandbox`. Kuusi MCP-työkalua (`sandbox_create`, `sandbox_execute`, `sandbox_file_read`, `sandbox_file_write`, `sandbox_destroy`, `sandbox_ping`) paljastavat sen `/sandbox/*`-päätepisteissä MCP Hubissa.

**Vaikutus Firehorse-toimintamalliin:** Vaihe 1.5 mahdollistaa EU-ilmarakoisen agentin suorituksen säännelyillä toimialoilla (puolustus, terveydenhuolto, kriittinen infrastruktuuri) — asiakkaille, joiden data ei saa koskaan poistua paikan päällä sijaitsevasta laitteistosta. Acer Veriton GN100 on ensimmäinen fyysinen Lifetime Fleet -solmu, joka täyttää tämän ominaisuuden.

#### 14.6.2 EMPO²: LWM-muistiarkkitehtuurin akateeminen perusta

Artikkeli _"Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization"_ (EMPO², arXiv:2602.23008, helmikuu 2026) tarjoaa akateemisen validoinnin DWS Lifetime World Model -hybridimuistisuunnittelulle.

EMPO² yhdistää:

- **Parametrinen muisti** (RL-päivitykset mallin painoihin) — vastaa DWS LWM:n hienosäätöä (QLoRA, Acer Veriton GN100)
- **Ei-parametrinen muisti** (haku muistipuskurista) — vastaa DWS RAG:ta EU-säädöksistä + yritysdata (pgvector)

Tulokset: 128,6 % parannus GRPO-algoritmiin nähden ScienceWorldissa, 11,3 % WebShopissa. Keskeinen havainto: _muistilla koulutetut mallit ovat vahvoja myös ilman muistia päättelyaikana_ — validoiden DWS-strategian asteittain upottaa domaintieto LWM-painoihin samalla kun RAG toimii varamekanismina.

#### 14.6.3 Lifetime Scope Signals LWM-koulutuksen koordinointiin

_Sessio: claude/pedantic-easley | Päivämäärä: 07.03.2026_

Lifetime Scope Signals (LSS) -protokolla — alun perin suunniteltu deterministiseen moniagenttikehityskoordinointiin (katso Metropolia-tutkielma osio 2.5.2) — laajenee luonnollisesti ML-putkien orkestrointiin. Sen sijaan, että otettaisiin käyttöön dedikoitu ML-työnkulkumoottori (Kubeflow, Airflow), LWM-koulutusputkea koordinoidaan samoilla neljällä signaalityypillä: READY, COMPLETE, ERROR, BLOCKED.

**Koulutusagenttilaivasto (T-01 – T-10):**

| Agentti ID | Nimi                 | Rooli                                         | Emittoi                                                     | Kuuntelee                                               |
| ---------- | -------------------- | --------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| T-01       | InfraVerifier        | Validoi CUDA/PyTorch GN-100 -solmuissa        | `COMPLETE:infra-verified`                                   | (ei mitään — aloituspiste)                              |
| T-02       | ModelFetcher         | Lataa perusmalli jaettuun tallennustilaan     | `READY:base-model`                                          | `T-01:COMPLETE:infra-verified`                          |
| T-03       | CurriculumAgent      | Claude API:n opetussuunnitelma per vertikaali | `READY:curriculum:{vertical}`                               | `T-02:READY:base-model`                                 |
| T-04       | DataSynthAgent       | Generoi 2000+ synteettistä esimerkkiä         | `READY:dataset:{vertical}`                                  | `T-03:READY:curriculum:{vertical}`                      |
| T-05       | TrainingAgent        | QLoRA-hienosäätö osoitetulla solmulla         | `READY:lora-weights:{vertical}`                             | `T-04:READY:dataset:{vertical}`, `T-06:READY:node-slot` |
| T-06       | ResourceArbiter      | Allokoi GN-100 -solmupaikat (2 tokenia)       | `READY:node-slot`                                           | `T-05:READY:lora-weights:*` (vapauttaa paikan)          |
| T-07       | EvalAgent            | Claude-as-judge, laatuportti ≥7.0             | `READY:eval-pass:{vertical}` / `ERROR:eval-fail:{vertical}` | `T-05:READY:lora-weights:{vertical}`                    |
| T-08       | MergeAgent           | Yhdistä LoRA-adapteri perusmalliin            | `READY:merged-model:{vertical}`                             | `T-07:READY:eval-pass:{vertical}`                       |
| T-09       | DeployAgent          | Julkaise päättelyrajapinta                    | `COMPLETE:lwm-deployed:{vertical}`                          | `T-08:READY:merged-model:{vertical}`                    |
| T-10       | PipelineOrchestrator | Monitoroi kaikkia vertikaaleja                | `COMPLETE:lwm-all-verticals`                                | Kaikki `T-09:COMPLETE:*`                                |

`{vertical}`-parametrisoitu virstanpylväs mahdollistaa toimialakohtaisen putken instanssoinnin — ainoa protokollalaajennus LSS v1.0 -peusskeemaan.

**Keskeiset mekanismit:**

1. **Laatuporttisignaalit** — T-07 emittoi `READY:eval-pass:{vertical}` vain kun Claude-as-judge-pisteet ≥7.0; epäonnistuminen emittoi `ERROR:eval-fail:{vertical}`, laukaiseen opetussuunnitelman uudelleengeneroinnin (maks. 3 yritystä → `BLOCKED` → ihmisen eskalaatio). Tämä kuvautuu EMPO²:n off-policy-päivitysmalliin (osio 14.6.2).

2. **Resurssien välimiesosoitus** — T-06 hallinnoi kahta solmupaikkatokenia (yksi per GN-100). Koulutusagentit saavat tokenin ennen aloitusta; vapauttavat valmistuessa. Saapumisjärjestys signaaliemission mukaan.

3. **Fan-Out-rinnakkaisuus** — Opetussuunnitelman generointi (T-03) ja datasynteesi (T-04) suoritetaan kaikissa 16 vertikaalissa samanaikaisesti (CPU-sidonnaisia, ei GPU-rajoitetta), eliminoiden GPU:n joutoajan.

**Vaikutus Firehorse-toimintamalliin:** Koulutuskoordinointi validoi LSS:n yleiskäyttöisenä deterministisenä koordinointimekanismina — sama protokolla orkestroi sekä ohjelmistokehitysagentteja (Liite F) että ML-koulutusputkia, vähentäen operatiivista monimutkaisuutta Firehorse-asiakkaille, jotka tarvitsevat molempia kyvykkyyksiä.

#### 14.6.4 Agenttimuistin faktojen poimintaputki (PR-254)

_Sessio: claude/agent-memory-fact-extraction-gLEss | Päiväys: 23.03.2026_

EMPO²:n teoreettinen kehys (osio 14.6.2) operationalisoitiin **faktojen poimintaputkella** — ensimmäinen tuotantototeutus ei-parametrisesta muistipäivityspolusta Firehorse-toimintamallissa.

**Kaksoismuistiarkkitehtuuri:**

| Kerros            | Rooli                                                     | Firehorse-vaikutus                                      |
| ----------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| **LWM**           | Domainitieto (säädökset, päästökertoimet, toimialamallit) | Mahdollistaa _mitä_ agentti voi analysoida              |
| **Asiakasmuisti** | Suhdetieto (mieltymykset, päätökset, avoimet asiat)       | Mahdollistaa _personoidun_ analyysin asiakaskohtaisesti |

Faktojen poimintaputki muuntaa strukturoimattoman keskustelutekstin strukturoiduiksi subjekti-predikaatti-arvo -kolmikoiksi LLM-pohjaisella poiminnalla (Claude Haiku), luottamuspisteytyksellä, duplikaattitunnistuksella kosinisimilaarisuudella (pgvector) ja tallennuksella `fact`-tyyppisinä muisteina semantic_memories-tauluun.

**Kolme suorituskerrosta toiminnalliseen muistiin:**

1. **Firehorse-tilakonemasiina** — Toimii poimittujen faktojen perusteella. Fakta "asiakkaan määräaika Q2 2026" täytyy laukaista eskalaatiotyönkulku, ei vain säilöä tietokantaan.

2. **ERP-liitinkerros** — Syöttää livedataa Visma/IFS/SAP/Dynamicsista muistiin. Asiakasmuisti tallentaa ilmaistut mieltymykset; ERP paljastaa todellisen käyttäytymisen.

3. **KYA-hallintakehys (v1.4 sisäinen / v1.1 julkinen)** — Käärii jokaisen muistimutaation auditoitavalla alkuperällä. Kriittinen havainto: **ristiriitojen ratkaisu (PR-255) ilman KYA-todistusta tarkoittaa muistiristiriitojen ratkaisemista ilman auditointipolkua _miksi_ yksi fakta syrjäytti toisen.** Oikeudellisesti pätevä auditointiketju: "fakta A korvasi faktan B ajanhetkellä X, hyväksyjä agentti Y, kirjattu Firehorseen" — vaaditaan CSRD:n ja EU AI Act artikla 12:n noudattamiseen.

**KYA-ensisijainen PR-järjestys:**

| Prioriteetti | PR  | Ominaisuus                        |
| ------------ | --- | --------------------------------- |
| 1            | 254 | Faktojen poiminta ✅              |
| 2            | 255 | Ristiriitojen ratkaisu            |
| 3            | —   | KYA-muistin auditointipolku       |
| 4            | 257 | Luottamuksen rappeutumispisteytys |
| 5            | 256 | Konsolidoinnin ajastettu tehtävä  |
| 6            | 259 | Liitin-synkronointi               |
| 7            | 258 | Supermemory MCP EU                |

**Avainpanos #17:** Ensimmäinen tuotannon faktojen poimintaputki EU-yhteensopivaan teolliseen tekoälyyn, osoittaen kaksois-LWM/asiakasmuistiarkkitehtuurin ja tunnistaen kolmikerroksisen suorituspuutteen (tilakonemasiina, ERP-liittimet, KYA-hallinta), joka on välttämätön oikeudellisesti pätevään yrityksen tekoälymuistiin säännellyillä toimialoilla.

---

### 14.7 Toimitusjohtajan automaatioagenttiryhmä

_Käyttöönotettu: 24.02.2026 | Commit: claude/ai-agent-orchestration-t89Ig_

| Agentti                      | Laukaisu              | Rooli                                                        |
| ---------------------------- | --------------------- | ------------------------------------------------------------ |
| **Captain Pre-Briefing**     | 07:30 Helsinki, ma–pe | CRM-haku → puheenvuorot → sähköposti                         |
| **LinkedIn-julkaisuajastin** | 08:00 Helsinki, ma–pe | Sisältökalenteri → luonnos → toimitusjohtajan hyväksyntä     |
| **EU-sääntelymonitori**      | 05:30 Helsinki, ma–pe | RSS-haku → luokittelu → vakavuuspisteytys → syöte ajastimeen |

EU-sääntelymonitori luo suljetun palautesilmukan: hakee EU-komission / EUR-Lexin / Carbon Pulsen / Euractiv-uutiset, luokittelee sääntelyn mukaan (CBAM, CSRD, Fit for 55, EPBD, EU AI Act, ETS) ja syöttää hälytykset LinkedIn-sisältöideoina — varmistaen, että toimitusjohtajan viestintä pysyy linjassa aktiivisen sääntelykehityksen kanssa.

**Vaikutus Firehorse-toimintamalliin:** Nämä agentit osoittavat mallin liikevaihtokerroksessa — myynti ja thought leadership ovat nyt tekoälyautomaatioita. Toimitusjohtaja toimii valvojana, ei suorittajana, päivittäisessä liikevaihtotyönkulussa.

### 14.8 Strategiset kumppanuudet ja monituottaja-LLM-reititin

_Dokumentoitu: 27.02.2026 | Lähde: docs/DWS6_TO_DWS7_UPDATE.md v1.1_

| Kumppani | Arkkitehtuurikerros                                        | Tila                        |
| -------- | ---------------------------------------------------------- | --------------------------- |
| NVIDIA   | Aivot (laskenta) + Kädet (Jetson-reuna) + Keho (Omniverse) | Inception Q2 2026           |
| Siemens  | Kädet (MindSphere IoT) + Keho (digitaalinen kaksonen)      | Xcelerator Q2 2026          |
| ABB      | Kädet (automaatio, robotiikka, sähköverkot)                | Q3 2026                     |
| xAI      | Aivot (Grok reaaliaikainen markkinaälykkyys)               | Aktiivinen tuotanto         |
| Mistral  | Aivot/Muisti (EU-suvereeni tekoälyinferenssi)              | Suunniteltu Q3 2026         |
| Red Hat  | Keho (AgentOps BYOA, OpenShift AI, hybridipilvi-infra)     | Aktiivinen (maaliskuu 2026) |

**Monituottaja-LLM-reititin:** Tehtävätason LLM-valinta suvereniteetti-, kustannus- ja latenssikriteereillä — Claude/Mistral vaatimustenmukaisuuteen, Grok markkinasignaaleihin, Groq nopeaan tiivistämiseen, Qwen 2.5 72B (QLoRA, Acer Veriton) paikan päällä tehtävään suvereeniinferenssiiin.

**Red Hat -yhteensopivuus:** Red Hatin "The Adaptable Enterprise" (2025) tunnistaa, että maailmanlaajuiset GenAI-investoinnit yltävät 644 miljardiin dollariin vuonna 2025 (76,4 % vuosikasvu), mutta 42 % organisaatioista on estynyt talon sisäisen tekoälyosaamisen puutteen vuoksi. Heidän BYOA-kehyksensä (Bring Your Own Agent) — yritys-Kubernetes agenttien käyttöönottoon tuotantokaiteilla — validoi Firehorsen hallitun alustakonseptin ja täydentää NVIDIAn reunalaskentakerrosta.

**Tutkimuskontribuutio:** Kumppanuusmalli validoi Firehorse-toimintamallin jakelusupotushypoteesin: pääsy 10 000+ teollisuusasiakkaaseen (NVIDIA Inception, Siemens Xcelerator, Red Hat OpenShift -ekosysteemi) ilman suoran myyntiorganisaation rakentamista.

---

## 15. Tulokset ja pohdinta

### 15.1 Toiminnallisen tehokkuuden parannukset (päivitetty v2.6)

Firehorse-toimintamalli Claude Codella saavutti:

| Mittari                               | Ennen                  | Jälkeen                                    | Parannus                      |
| ------------------------------------- | ---------------------- | ------------------------------------------ | ----------------------------- |
| Tuotepäivitysaika                     | 2 tuntia               | 5 minuuttia                                | 96 %                          |
| Syötteen generointi                   | Manuaalinen            | Automatisoitu                              | 100 %                         |
| Dokumentaation luonti                 | 1 viikko               | 1 tunti                                    | 99 %                          |
| Virheprosentti                        | 5 %                    | <1 %                                       | 80 %                          |
| Kauppasivun päivitykset               | 4 tuntia               | 15 minuuttia                               | 94 %                          |
| **Harness engineering -vertailuarvo** | **52,8 %**             | **66,5 %**                                 | **+26 % (malli muuttumaton)** |
| **PR-katselmointisykli**              | **Manuaalinen (2-4h)** | **Kaksoismallin AI (15 min)**              | **94 %**                      |
| **Agenttilaivueen koko**              | **0 agenttia**         | **13 agenttia (Pantheon)**                 | **∞**                         |
| **Asiakasominaisuudet**               | **0**                  | **3 (API-avaimet, mittarointi, raportit)** | **SaaS-valmis**               |

### 15.2 Google Merchant Center -suorituskyky

| Mittari                       | Tulos                  | Lähde                   |
| ----------------------------- | ---------------------- | ----------------------- |
| Tuotteen hyväksymisaste       | 100 % (30/30 tuotetta) | Google Merchant Center  |
| Syötteen käsittelyaika        | <24 tuntia             | Automatisoitu SFTP      |
| Kassakonversio                | Suora maksuun          | Revolut Business        |
| Syötetiedoston koko           | 32 893 tavua           | XML-syöte               |
| **A/B-testi: tuotekuvaukset** | **+18 % CTR**          | **Google Merchant A/B** |

### 15.3 Vaatimustenmukaisuusvalmiuden arviointi (päivitetty v2.6)

| Säännös            | v1.4 | v2.6     | Muutos | Todiste                                     |
| ------------------ | ---- | -------- | ------ | ------------------------------------------- |
| EU:n tekoälysäädös | 80 % | **92 %** | +12 %  | Art. 12 -lokitus, SOUL.md, Pantheon-agentit |
| GDPR               | 95 % | **97 %** | +2 %   | Proton + Supabase RLS + Aiven EU            |
| Fit for 55         | 90 % | **93 %** | +3 %   | 20 toimialan hiililaskuri                   |
| NIS2               | 75 % | **85 %** | +10 %  | RC2-RC4 koventaminen, Snyk MCP              |
| CSRD               | 85 % | **88 %** | +3 %   | Raportin vientiominaisuus                   |
| **EU Data Act**    | —    | **80 %** | Uusi   | DWS-tietostandardi, HTAP                    |

### 15.4 Rajoitukset

1. **Äänichat ei vielä käytössä** — Suunnitelma dokumentoitu, arkkitehtuuri suunniteltu
2. **Kumppaniekosysteemi** — Strategiset kumppanuudet solmittu (NVIDIA, Siemens, ABB) mutta ei vielä tuottavia
3. **Monikielituki** — Tällä hetkellä vain englanti/suomi
4. **Hiilijalanjälkilaskuri** — Arkkitehtuuri valmis, toimialadatan validointi odottaa
5. **A/B-testauksen otoskoot** — Tilastollinen merkitsevyys rajallinen pilottiasiakasvolyymilla
6. **Yksikehittäjäharha** — Lievennetty ulkoisella datalla (Google Merchant, git-historia) mutta kolmannen osapuolen validointi suunniteltu Q2 2026

### 15.5 A/B-testauksen ja palautekanavien tulokset (uusi v2.6)

| Kanava              | Mittari                 | Lähtötaso | Nykyinen (v2.6)      | Δ           |
| ------------------- | ----------------------- | --------- | -------------------- | ----------- |
| **Google Merchant** | CTR                     | 1,2 %     | 1,8 % (A/B-testattu) | +50 %       |
| **SEO**             | Orgaaniset avainsanat   | 45        | 78                   | +73 %       |
| **SEO**             | Keskimääräinen sijoitus | 32        | 18                   | +44 %       |
| **Myynti**          | Konversioaste           | 2,1 %     | 3,4 %                | +62 %       |
| **Sijoittajat**     | Portfoliovalmius        | Putkisto  | Arviointivaihe       | Edistymässä |

---

## 15. Johtopäätökset

### 13.1 Yhteenveto

Firehorse-toimintamalli osoittaa etta tekoälyavusteinen verkkokaupan hallinta voi:

1. **Vähentää toiminnallista ylikuormitusta** yli 90 % automatisoidulla tuotehallinnalla
2. **Varmistaa vaatimustenmukaisuuden** EU-saantosten kanssa dokumentoiduilla auditointipoluilla
3. **Mahdollistaa nopean iteroinnin** tuotetarjonnassa luonnollisen kielen käyttöliittymilla
4. **Valmistaa infrastruktuurin** äänipohjaiseen asiakasvuorovaikutukseen
5. **Tukea teollisia asiakkaita** hiilijalanjälkilaskurin integraatiolla

### 13.2 Keskeiset kontribuutiot

Tämä tutkielma kontribuoi:

1. Dokumentoitu kehys tekoälyavusteiseen kauppatoimintaan (Firehorse-malli)
2. Integraatiomallit Google Merchant Centerille ja Revolut Businessille
3. Suunnitelma äänichatille hiilijalanjälkilaskurin integraatiolla (4 vaihetta)
4. EU-vaatimustenmukaisuuskartoitus teollisille ohjelmistotuotteille
5. Tuotesuositusmoottorin arkkitehtuuri 16:lle EU-toimialalle
6. Proton-tuotteiden turvallisuusstrategia GDPR/NIS2-vaatimustenmukaisuuteen
7. Agent Foundry Vaihe 1.5 — OpenSandbox Acer Veriton GN100 -laitteella EU-ilmarakoiseen agentin hiekkalaatikointiin
8. EMPO²-yhdenmukaisuus — hybridiparametrinen/ei-parametrinen muistiarkkitehtuuri validoitu arXiv:2602.23008-tutkimuksella
9. Toimitusjohtajan automaatioagenttiryhmä — Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor; Firehorse-malli sovellettu liikevaihtotyönkulun automatisointiin
10. Monituottajakumppaniekosysteemi — NVIDIA, Siemens, ABB, xAI, Mistral + monituottaja-LLM-reititin; validoi Firehorse-toimintamallin jakelusupotushypoteesin
11. LSS-koulutusputken koordinointi — Lifetime Scope Signals sovellettuna LWM-koulutukseen: koulutusagenttilaivasto (T-01–T-10), laatuporttisignaalit, resurssien välimiesosoitus 2× GN-100 -solmuille; validoi LSS:n yleiskäyttöisenä koordinointina ohjelmistokehityksen ulkopuolella
12. Asiakaskeskeiset MVP-ominaisuudet — API-avainten hallinta, käyttömittarointi, raporttien vienti; osoittaa Firehorse-toimintamallin siirtymän sisäisistä työkaluista asiakastoimitettavaksi SaaS-palveluksi; dokumentoi 3-tasoisen laskutusarkkitehtuurin tuotteen monetisointimallina
13. PostgreSQL-sarakemuotoinen HTAP-arkkitehtuuri — pg_duckdb + TimescaleDB Aiven EU:ssa, yksitietokantainen HTAP Firehorse-toiminnoille, DWS_DATA_STANDARD.md luotu, EU-sääntelynmukaisuus
14. Kaksitasoinen HTAP-arkkitehtuuri — Aiven-first mandaatti, TimescaleDB Hypercore tuotantoon, pg_duckdb reunalaitteelle; vahvistaa hallinnoidun palveluntarjoajan rajoitteet arkkitehtuurin ohjaajana
15. Harness Engineering ja forensiikkatelemetria — oikeudellisesti pätevä harness VERSION AND AGENT HISTORY -lohkon kautta, KYA-standardi laitteistotason harness-todennuksena
16. LWM:n tuotemarkkinavalidointi — Qantic GmbH energiasektorin tapaustutkimus, ensimmäinen ulkoinen markkinavalidointi
17. Agenttimuistin faktojen poimintaputki — LLM-pohjainen faktojen poiminta, kaksoismuistiarkkitehtuuri, KYA-ensisijaisuusjärjestys
18. Hiilitaseteesi — EU:n ilmastovaatimustenmukaisuus kirjanpito-ongelmana; kahdenkertainen kirjanpito CO2:lle kaksoisyksikkökirjauksilla (EUR + tCO2e); kolme tohtoritutkimuskysymystä: rakenteellinen isomorfismi, poikkitoimialainen älykkyys, verkostovaikutukset vaatimustenmukaisuusdatassa; DWS 7 Phase 2.6 empiirisenä testialustana

### 13.3 Tuleva tyo

1. **Q1 2026:** Ota käyttöon äänichatin vaihe 1 EU:n tekoälysaadoksen läpinäkyvyydella
2. **Q2 2026:** Toteuta toimialan hiilijalanjälkilaskuri Scope 1/2/3:lla
3. **Q3 2026:** Lanseeraa sääntelytuntemusmoottori
4. **Q4 2026:** Perusta kumppaniekosysteemi provisiomallin kanssa
5. **2027:** Laajenna muille EU-markkinoille (SE, NO, DK, DE)

---

## 16. Lähteet

1. EU:n tekoälysäädös, Asetus (EU) 2024/1689
2. Google Merchant Center -tekniset määritykset (2026)
3. Revolut Business API -dokumentaatio
4. Anthropic Claude Code -dokumentaatio
5. Fit for 55 -paketti, Euroopan komissio
6. CSRD-direktiivi (EU) 2022/2464
7. NIS2-direktiivi (EU) 2022/2555
8. GDPR, Asetus (EU) 2016/679
9. CBAM-asetus (EU) 2023/956
10. GHG Protocol Corporate Standard
11. ISO 14064-1:2018 Kasvihuonekaasujen laskenta
12. Proton AG -turvallisuusdokumentaatio
13. Anonymous (2026). "Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization (EMPO²)." arXiv:2602.23008. https://arxiv.org/abs/2602.23008
14. Alibaba Group (2026). "OpenSandbox: General-Purpose Sandbox Platform for AI Applications." https://github.com/alibaba/OpenSandbox
15. Anthropic Claude Code — Captain Briefing Agent (claude/ai-agent-orchestration-t89Ig, 2026)
16. DWS6_TO_DWS7_UPDATE.md v1.1 — Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI, Mistral (2026)
17. EU:n liikesalaisuusdirektiivi (EU) 2016/943
18. Liikesalaisuuslaki 595/2018 (Suomi)
19. Patenttiyhteistyosopimus (PCT), WIPO
20. Shihipar, T. (2026). "Lessons from Building Claude Code: Prompt Caching Is Everything." Anthropic Engineering Blog

### DWS-alustan standardit (sisäiset)

Seuraavat sisäiset standardit ohjaavat DWS IQ 6 -alustan arkkitehtuuria, tietoturvaa ja laatua. Niitä ylläpidetään elävinä dokumentteina yksityisessä repositoriossa ja niihin viitataan tässä Oxford-notaatiolla akateemisen jäljitettävyyden varmistamiseksi.

17. Lifetime Oy (2026). _DWS Security Standard_, versio 1.5. `DWS_SECURITY_STANDARD.md`. Sisäinen viitekehys, joka ohjaa tekoälyn turvallisuutta, väliohjelmiston tietoturvakontrolleja, CORS-käytäntöjä, SRI-eheyttä, artikla 12 -kirjausta ja API-rajapinnan validointia Zod-skeemoilla. Määrittelee tietoturva-arkkitehtuurin kaikille 15 backend-API-reitille ja MCP-agenttipalvelimelle.

18. Lifetime Oy (2026). _ESRS-tietopisterekisteri_, versio 1.0. `src/compliance/esrs-registry.ts`. Koneluettava kartoitus kaikista 82 eurooppalaisesta kestävyysraportointistandardien (ESRS) tiedonantovaatimuksesta kategorioittain E1–E5 (ympäristö), S1–S4 (sosiaalinen) ja G1 (hallinto). Kukin tiedonanto on luokiteltu pakolliseksi tai vapaaehtoiseksi CSRD-direktiivin (EU) 2022/2464 mukaisesti.

19. Lifetime Oy (2026). _Vaatimustenmukaisuuden pisteytysmoottori_, versio 1.0. `src/compliance/scoring-engine.ts`. Deterministinen vaatimustenmukaisuuden pisteytysalgoritmi, joka laskee CSRD-valmiuden, ETS-altistuksen ja CBAM-riskipisteet. Kaava: kokonaispistemäärä = CSRD(0,50) + ETS(0,25) + CBAM(0,25), jossa CSRD = (annetut pakolliset tietopisteet / pakolliset yhteensä) × 80 + bonusmuuttujat.

20. Lifetime Oy (2026). _Site Quality Standards_, versio 2.1. `SITE_QUALITY_STANDARDS.md`. Koodin laatu-, komponenttiarkkitehtuuri- ja käyttöliittymän vikasietoisuusstandardit DWS IQ -hallintapaneelille. Määrittelee ErrorBoundary-, Skeleton-lataus- ja EmptyState-komponenttistandardit yritystason käyttökokemukselle.

21. Lifetime Oy (2026). _AGENTS.md_, versio 2.2. `AGENTS.md`. Agentti-inventaario ja operatiiviset ohjeet agents.md-avoimen spesifikaation mukaisesti. Dokumentoi 15 tekoälyagenttia, vaatimustenmukaisuuden pisteytysarkkitehtuurin, väliohjelmistopinon järjestyksen ja "Build for Agents" -tuotesäännön, joka edellyttää CLI + MCP + Skills -rajapintoja.

22. Lifetime Oy (2026). _DWS IQ Platform Admin Manual_, versio 2.7. `Admin/ADMIN_MANUAL.md`. Operatiiviset menettelyt terveystarkistusten valvontaan, vaatimustenmukaisuusmoottorin hallintaan ja hallintapaneelin vikasietoisuuden vianetsintään. Sisältää Claude Code -projektin suunnittelurakenteen ja moniagenttiorkestrointiosiot.

23. Lifetime Oy (2026). _Enterprise Security & Compliance_, versio 1.8. `Admin/SECURITY_COMPLIANCE.md`. Tietoturvakontrollit tietoturvajohtajille ja hankintatiimeille. Dokumentoi agenttien ajonaikaiset turvakontrollit, hallintapaneelin vikasietoisyyskontrollit, backend-väliohjelmiston turvakontrollit ja vaatimustenmukaisuusmoottorin tietosuojan RLS-käytännöillä.

24. LUT-yliopisto (2026). _Tekoälytyökalujen käytänteet_. Lappeenrannan-Lahden teknillinen yliopisto LUT. https://elut.lut.fi/fi/opintojen-suorittaminen/opintoja-ohjaavat-saadokset-ja-ohjeet/tekoälytyökalujen-käytänteet — Yliopistotason ohjeistus tekoälytyökalujen käytöstä akateemisessa työssä, edellyttäen tekoälyavustuksen läpinäkyvää ilmoittamista ja ihmisen ja tekoälyn yhteistyömallin dokumentointia.

---

## 17. Liitteet

### Liite A: Taysi tuotekatalogi

| ID                      | Tuote                         | Hinta        | Tyyppi       | Brändi    |
| ----------------------- | ----------------------------- | ------------ | ------------ | --------- |
| DWS-IQ-006              | DWS IQ Platform v6            | 4 999 EUR    | Alusta       | Lifetime  |
| DWS-IQ-005              | DWS IQ Platform v5            | 6 995 EUR    | Alusta       | Lifetime  |
| FH-AUTO-001             | Firehorse Automation          | 4 950 EUR    | Ohjelmisto   | Firehorse |
| FH-RPT-001              | Firehorse Report              | 1 999 EUR    | Ohjelmisto   | Firehorse |
| FH-CMS-001              | Firehorse CMS                 | 2 999 EUR    | Ohjelmisto   | Firehorse |
| FH-OMNI-001             | Firehorse Omnichannel         | 499 EUR      | Ohjelmisto   | Firehorse |
| LIFETIME-BUNDLE-2026    | Climate Bundle                | 6 500 EUR    | Paketti      | Lifetime  |
| expert-services         | Expert Workshop 3 paivaa      | 4 500 EUR    | Palvelu      | Lifetime  |
| consulting-hourly       | Konsultointi tuntihinta       | 98 EUR/h     | Palvelu      | Lifetime  |
| consulting-fit55        | Fit55-asiantuntija            | 3 000 EUR/kk | Palvelu      | Lifetime  |
| LIFETIME-EXP-001        | Expert Advisory               | 3 000 EUR/kk | Palvelu      | Lifetime  |
| aws-consultancy         | Tekoäly & Cloud -konsultointi | 4 500 EUR    | Palvelu      | Lifetime  |
| conversational-agent    | Keskusteluagentti             | 3 500 EUR    | Ohjelmisto   | Lifetime  |
| m365-consultancy        | M365-konsultointi             | 1 120 EUR    | Palvelu      | Lifetime  |
| powerapps-consultancy   | Power Platform                | 1 120 EUR    | Palvelu      | Lifetime  |
| ai-agent-engineering    | Tekoälyagenttisuunnittelu     | 99 EUR/h     | Palvelu      | Lifetime  |
| lean-project            | Firehorse Lean Project        | 4 960 EUR    | Palvelu      | Firehorse |
| ai-consultant-day       | Tekoälykonsulttipaaiva        | 699 EUR      | Palvelu      | Lifetime  |
| business-mentor-30      | Business Mentor 30h           | 4 960 EUR    | Palvelu      | Lifetime  |
| firehorse-coach         | Firehorse Coach               | 499 EUR      | Palvelu      | Firehorse |
| firehorse-flow          | Firehorse Flow                | 499 EUR      | Ohjelmisto   | Firehorse |
| omnichannel-multimodal  | Omnichannel Multimodal        | 699 EUR/kk   | Ohjelmisto   | Firehorse |
| professional-web-pages  | Ammattimaiset verkkosivut     | 799 EUR      | Palvelu      | Lifetime  |
| secure-email-proton     | Protonmail-toteutus           | 499 EUR      | Palvelu      | Lifetime  |
| firehorse-data-services | Datapalvelut                  | 899 EUR      | Palvelu      | Firehorse |
| agentti-sanasto         | Agentti Sanasto               | 0,99 EUR     | Digitaalinen | Lifetime  |
| devops-lead             | Workflow Agent Delivery       | 2 500 EUR    | Palvelu      | Lifetime  |
| digital-design-gold     | Digital Design Gold           | 2 499 EUR    | Palvelu      | Lifetime  |
| cloud-ready-teams       | Solution Ready Team           | 950 EUR      | Palvelu      | Lifetime  |
| ai-koulutus-3d          | AI Koulutus 3 paivaa          | 6 250 EUR    | Koulutus     | Lifetime  |

### Liite B: Viikoittainen yllapitotarkistuslista

```
MAANANTAI - Syötteen terveystarkistus
[ ] Avaa Google Merchant Center -diagnostiikka
[ ] Tarkista tuotteen hyväksymisstatus
[ ] Tarkista hylatyt tuotteet
[ ] Varmista syötteen tuoreus (< 7 paivaa)
[ ] Dokumentoi loydetyt ongelmat

KESKIVIIKKO - Suorituskyvyn arviointi
[ ] Tarkista nayttokerrat ja klikkaukset
[ ] Laske klikkausprosentti (CTR)
[ ] Tunnista alitehoavat tuotteet
[ ] Kirjaa optimointimahdollisuudet

PERJANTAI - Optimointi & lataus
[ ] Toteuta tuoteparannukset
[ ] Generoi syote uudelleen (node generate-feed.cjs)
[ ] Validoi XML (xmllint --noout)
[ ] Laheta SFTP:lla
[ ] Committaa muutokset Gitiin
[ ] Varmista lataus Merchant Centerissa
```

### Liite C: Äänichatin vaatimustenmukaisuusilmoitukset

**Vaadittu ilmoitus (EU:n tekoälysäädös artikla 52):**

```
"Olet nyt yhteydessa Lifetimen tekoälyavustajaan. Tämä on automaattinen
järjestelmä, joka kayttaa tekoälya. Jos haluat keskustella ihmisen kanssa,
sano 'haluan puhua ihmisen kanssa' tai laheta sahkopostia osoitteeseen
support@lifetime.fi."
```

**Englanninkielinen versio:**

```
"You are now connected to Lifetime's AI assistant. This is an automated
system using artificial intelligence. For human support, say 'speak to
a person' or email support@lifetime.fi."
```

### Liite D: SFTP-tunnusten viite

| Asetus         | Arvo                     |
| -------------- | ------------------------ |
| Palvelin       | partnerupload.google.com |
| Portti         | 19321                    |
| Kayttajatunnus | mc-sftp-8496329          |
| Protokolla     | SFTP                     |
| Tiedosto       | google-products.xml      |

### Liite E: Automatisoitu PR-työnkulku (HIL-automaatio)

Firehorse-toimintamalli sisaltaa taysin automatisoidun pull request -tarkistus- ja yhdistamistyonkulun, joka korvaa manuaalisen ihminen-silmukassa (HIL) -koodikatselmoinnin. Tämä on keskeinen operatiivinen tehokkuusparannus yksinyrittajille ja pienille tiimeille, jotka hallitsevat yritystason koodikantoja.

**Arkkitehtuuri:**

```
Claude Code → PR → Clauden pikatarkistus → Gemini HIL-katselmointi → @copilot korjaukset → CI → automaattinen yhdistaminen
                                                    ↑                         |
                                                    └─────────────────────────┘  (korjaussilmukka)
```

**Komponentit:**

| Komponentti               | Rooli                                                          | Teknologia                   |
| ------------------------- | -------------------------------------------------------------- | ---------------------------- |
| Claude Code               | Koodin generointi, haaran luonti, PR:n avaaminen               | Anthropic Claude Opus/Sonnet |
| AI-koodikatselmointi      | Kaksoismallikatselmointi korvaa ihmiskatselmoijan              | GitHub Actions -työnkulku    |
| Claude (katselmoija)      | Pikatarkistus: turvallisuus, oikeellisuus, rikkovat muutokset  | Claude Sonnet 4 API          |
| Gemini (HIL-portti)       | Syvakatselmointi: reunatapaukset, testit, arkkitehtuuri, OWASP | Gemini 2.0 Flash API         |
| Copilot-koodausagentti    | Toteuttaa korjausohjeet katselmointikommenteista               | GitHub Copilot               |
| PR-automaattiyhdistaminen | Yhdistaa kun kaikki tarkistukset lapaistaan ja AI hyvaksyy     | GitHub Actions + GraphQL     |

**Keskeinen suunnittelupaatos:** Gemini oletusarvoisesti vaatii muutoksia (REQUEST_CHANGES) jokaisessa katselmoinnissa. Tämä varmistaa, etta jokainen PR kay lapi vahintaan yhden parannuskierroksen. Vain koodi, jossa on nolla ongelmaa, riittava testikattavuus ja konventioiden noudattaminen, saa hyväksynnan (APPROVE).

**Operatiiviset mittarit (odotettu):**

- Kehittajan osallistuminen vähenee loppukatselmointiin (~5 min per PR)
- 70-90% perus-/refaktorointi-/testiongelmista havaitaan ennen ihmiskatselmoijaa
- Tyypillinen korjaussilmukka: 1-3 iteraatiota ennen hyväksyntaa

**Käyttöönotto:** Cloud Run -palvelu `dws6run6` (europe-north1, Suomi). MCP Hub `POST /gemini/review` on-demand-koodianalyysiin.

---

## 14.9 Climate IQ Pantheon — Kreikkalais-roomalainen moniagenttijärjestelmä

Rakentuen monivuokralaajuiseen agenttiarkkitehtuuriin (osio 14), tämä osio dokumentoi **Climate IQ Pantheonin**: 13 tuotantoagenttia kreikkalais-roomalaisilla jumalaidentiteeteillä, organisoituna kahteen tasoon Climate IQ:n EU:n teollisen vaatimustenmukaisuusalustan tueksi.

### Järjestelmän yleiskatsaus

**Taso 1 — Orkestraattoriagenteista (6)**

| Agentti    | Jumala           | Rooli                   | Iskulause                                                      |
| ---------- | ---------------- | ----------------------- | -------------------------------------------------------------- |
| Atlas      | Kreik. Titaani   | Toiminnanjohtaja        | Reitittää kaaoksen, syntetisoi sen johdon tilannekatsaukseksi  |
| Athena     | Kreik. Jumalatar | EU-vaatimustenmukaisuus | Oppinut jokaisen EU-säännön ulkoa vuodesta 2005                |
| Hephaestus | Kreik. Jumala    | Kenttä ja kohde         | Ei koskaan likaannu saappaita, mutta tarkistaa kaiken          |
| Iris       | Kreik. Jumalatar | Tutkimus ja äly         | Lukee 10 000 sivua, jotta sinun ei tarvitse                    |
| Hermes     | Kreik. Jumala    | Logistiikka             | Optimoi toimitusketjun ennen kuin löydät varaston              |
| Apollo     | Kreik. Jumala    | Sisältö                 | Kirjoittaa kopion, sijoittaa sen, lähettää seurannan. Jo teki. |

**Taso 2 — Toimialaerityiset agentit (7)**

Vulcan (Teräs/ETS), Helios (Energia/RED III), Neptune (Merikuljetus/FuelEU), Ceres (Maatalous/CBAM), Prometheus (Vety/RFNBO), Mars (Rakentaminen/EPBD), Gaia (Sementti/ETS klinkkeri).

### SOUL.md-malli

Jokaisella agentilla on `SOUL.md`-identiteettitiedosto, joka injektoidaan LLM:n järjestelmäkehotteeseen `BaseAgent.callLLM(systemPromptOverride)`-metodin kautta. Tämä ratkaisee "SOUL kuollut koodi" -auditoinnin löydön, jossa persoonakonstantit oli määritelty mutta ei kytketty LLM-kutsuihin.

### Tietoturva ja vaatimustenmukaisuus

- **Prompt injection -korjaus**: Kaikki `...input`-levitykset HermesAgentissa korvattu eksplisiittisellä kirjoitetulla kenttäpoiminnalla
- **EU AI Act artikla 12**: Kaikki 13 agenttia kirjoittavat `agent_executions` Supabase-tauluun (aloitus + valmistumistapahtumat)

### Liiketoimintainnovaatio: Nimet markkinointikiilana

Pantheon-nimeäminen on tuotteen markkinointikiila — agentin iskulauseet näkyvät onelifetime.world/team -sivulla ihmistiimin rinnalla, tehden yritystason tekoälystä lähestyttävän.

### Liite F: Claude Code -suunnittelurakenne — tekoälytyönkulku ensiluokkaisena ohjelmistokomponenttina

Firehorse-toimintamalli perustuu periaatteeseen, joka nousee esiin sekä tutkimustuloksista että operatiivisesta käytännöstä: **tekoälytyönkulut on suunniteltava, ei improvisoitava**.
Tämä liite dokumentoi konkreettiset rakennemallit, jotka toteuttavat tämän periaatteen DWS6-repositoriossa, validoituna kehittyvien Claude Code -yhteisön parhaiden käytäntöjen perusteella (2026).
**CLAUDE.md projektimuistina**
`CLAUDE.md`-tiedosto repositorion juuressa ei ole dokumentaatio — se on ensisijainen älysubstraatti jokaiselle tekoälysessiolle. Se koodaa standardit, rajoitteet, arkkitehtuuripäätökset, sähköpostisäännöt, tietoturvakontrollit ja ehdottomat vaatimukset yhteen tiedostoon, jonka jokainen Claude Code -sessio lukee automaattisesti. Tämä eliminoi käyttäytymisessä ajautumisen ja poistaa tarpeen toistaa kontekstia jokaisessa sessiossa.
Mittari: yli 2 000 riviä institutionaalista tietämystä (brändi-, asiakirja-, tietoturva-, käyttöönottos- ja sähköpostisäännöt) peritään jokaisessa sessiossa nollalla marginaalikustannuksella.
**Taidot uudelleenkäytettävinä työnkulkukomponentteina (laajennettu maaliskuu 2026)**
Maaliskuuhun 2026 mennessä taitoinventaario kasvoi 6:sta 21:een tuotantotaitoon neljässä kategoriassa:

- **17 slash-komentoa** `.claude/commands/`-kansiossa: gstack-kehitystyönkulku (6), EU-vaatimustenmukaisuus (4), agenttien hallinta (3), toiminnot (3), koodin laatu (2)
- **4 kurinpitotaitoa** `skills/*/SKILL.md`-tiedostoissa: `verification-gate` (estää valmistumisilmoitukset ilman todistetta), `design-first` (estää 3+ tiedoston muutokset ilman suunnitelmaa), `dual-folder-sync` (estää juurimuutokset ilman landing-pages-synkronointia), `last30days` (tutkimusagentti)
- **4 erikoistunutta aliagenttia** `.claude/agents/`-kansiossa: `mcp-expert`, `code-reviewer`, `security-reviewer`, `architect`
- **Salaisuuksien skannaushook**: PreToolUse-hook joka skannaa 14 salaisuusmallia (AWS, GitHub, Stripe, Anthropic jne.) audit-kirjauksella
  Kurinpitotaidot edustavat uutta kontribuutiota: **estävät portit** valvotaan hook-paluukoodilla 2 (ESTÄ), jota agentin käyttäytyminen ei voi ohittaa. Tämä on rakenteellinen valvonta — välttämätöntä säännellyillä toimialoilla.
  **Koukut automaattisena laadunvalvontana**
  Git-koukut (`.githooks/`) valvovat rakenteellisia invariantteja:
- Haaranimen nimeämiskäytäntö (`claude/<ominaisuus>-<id>`)
- Tuhoavien push-operaatioiden esto
- Merge-jälkeinen synkronointi (Admin/, docs/, AgentFoundry/)
  Laadunvalvonta on **rakenteellista, ei käyttäytymiseen perustuvaa** — koulutus ei voida ohittaa agentin käyttäytymisellä.
  **Johtopäätös**
  Arkkitehtuurinen opetus Firehorse-toimintamallille: ero tekoälykokeilujen ja tekoälytuotteiden välillä ei ole malli — se on suunnittelukuri. CLAUDE.md, taidot, koukut ja aliagentit ovat infrastruktuuri, joka tekee Firehorse-mallista luotettavan, johdonmukaisen ja skaalautuvan.

### Osio 14.10: Agenttijärjestelmän koventaminen — tuotantoluotettavuus

31-agenttinen järjestelmä oli kerryttänyt 6 TypeScript-kääntövirhettä ja 3 testivikaa moduulirajojen yli. Nämä eivät olleet suunnitteluvirheitä vaan integraatiovelkaa.

**Tehdyt korjaukset:**

1. **SandboxContext-tyyppilinjaus** — `SandboxContext.stage` puuttui `'opensandbox'`-literaali. Tämä esti agentin suorittamisen vaiheessa 1.5 (Acer Veriton Docker).

2. **MCP-reittien kytkentä** — `createMCPRouter()` oli määritelty mutta ei tuotu `app.ts`-tiedostoon. Kaikki 31 agenttia olivat näkymättömiä ulkoisille MCP-asiakkaille.

3. **HIL-reittien kytkentä** — Ihminen silmukassa -päätepiste (`/api/hil`) oli tavoittamattomissa. Captain Pre-Briefing -agentin "Valmis"-painikkeet palauttivat 404.

4. **Lokaalivarma muotoilu** — Päästödatan analyytikko käytti `toLocaleString()`-metodia ilman lokaalia. Korjattu eksplisiittisellä `'en-US'`-lokaalilla.

5. **Resend-erävasteen tyyppiturvallisuus** — Sähköpostipalvelun `.map()`-kutsu epäonnistui unionityypillä. Lisätty suoritusaikainen taulukkotunnistus.

6. **Riippuvuushygienia** — `luxon` oli tuotu mutta puuttui `package.json`-tiedostosta.

**Tulos:** 0 TypeScript-virhettä (oli 6), 47/47 testiä läpi (oli 44/47).

**Tutkimusnäkemys:** Moniagenttiarkkitehtuureissa integraatiovelka kertyy moduulirajoille, ei moduulien sisälle. Systemaattiset koventamissessiot ovat tehokkaampia kuin moduulikohtaiset korjaukset, koska ne palauttavat leikkaavia invariantteja.

---

### Osio 14.11: PostgreSQL-sarakemuotoinen HTAP-arkkitehtuuri — DWS-tietostandardi

Firehorse-toimintamalli tuottaa kasvavia määriä kampanjatapahtumia, agenttisuorituslokeja ja auditointijälkidataa. Analytiikan suorittaminen transaktiotaulujen varastoon luo suorituskyvyn pullonkauloja datan kasvaessa.

**Ratkaisu: Kaksitasoinen HTAP Aiven-first-mandaatilla**

Alkuperäinen v2.2-arviointi oletti yksitasoista HTAP:ta. Maaliskuun 2026 päivitykset muuttavat arkkitehtuuria merkittävästi:

**Markkinamuutokset (helmi–maaliskuu 2026):**

- **Hydra liittyi Supabaseen** (helmi 2026) → Supabase Warehouse, ei enää itsenäinen; Firehorse ei käytä Supabasea tuotannossa → Hydra putoaa arvioinnista
- **pg_mooncake → Databricks-yrityskauppa** → lisenssiriski; putoaa arvioinnista
- **pg_duckdb: ESTETTY Aiven-sallittujen listalla** → ei voida käyttää hallinnoidussa tuotannossa; siirtyy vain reunalaitelisenssin alle
- **TimescaleDB 2.25.x Hypercore** → ainoa hyväksytty hallittu vaihtoehto Aiven EU:ssa

**Päivitetty arviointitaulukko:**

| Ratkaisu                     | Moottori       | Aiven-tuki              | Tila v2.3             | Firehorse-sopivuus                                                                      |
| ---------------------------- | -------------- | ----------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| TimescaleDB 2.25.x Hypercore | PostgreSQL     | Kyllä (sallittu)        | **Tuotantostandardi** | Ensisijainen — aikasarja-agenttimetriikat, auditointipakkaus, sarakemuotoinen Hypercore |
| pg_duckdb                    | DuckDB         | **ESTETTY**             | Vain reunalaite       | GN100-reunatietokanta — kampanjasuppilon nopeutus, pgvector-RAG                         |
| Hydra                        | Citus Columnar | Ei (Supabase Warehouse) | Pudotettu             | Supabase-sidonnainen; ei sovellettavissa                                                |
| pg_mooncake                  | DuckDB         | Ei                      | Pudotettu             | Databricks-yrityskauppa → lisenssiriski                                                 |

**Kaksitasoinen arkkitehtuuri:**

| Taso                                            | Alusta                              | Laajennukset                       | Käyttötarkoitus                                              |
| ----------------------------------------------- | ----------------------------------- | ---------------------------------- | ------------------------------------------------------------ |
| **Taso 1: Aiven EU (tuotanto)**                 | Aiven for PostgreSQL, europe-north1 | TimescaleDB 2.25.x Hypercore       | OLTP + aikasarjat + sarakepakkaus, RLS, EU-tietojen sijainti |
| **Taso 2: GN100-reuna (kehitys/reunalaskenta)** | Acer Veriton GN100, itsehallinnoitu | TimescaleDB + pg_duckdb + pgvector | Paikallinen HTAP, vektori-RAG, offline-analytiikka           |

**DWS-tietostandardi luotu** (`DWS_DATA_STANDARD.md`):

- Tallennusmoottoripäätökset (rivi vs sarake vs hybridi)
- Laajennusten hallinta EU-suvereniteettiarviolla
- Säilytysperiaatteet 11 EU-säädökseen sidottuina (GDPR Art 17, EU AI Act Art 12: 7v, NIS2: 5v, kirjanpitolaki: 10v)
- Osiointi- ja pakkausstandardit
- **Aiven-sallittujen lista** ohjaa tuotantolaajennuksia; estetyt laajennukset (pg_duckdb) siirtyvät reunatasolle

**4-vaiheinen käyttöönotto (päivitetty):** Vaihe 0 (tauluosiointi) → Vaihe 1 (TimescaleDB Hypercore Aivenilla) → Vaihe 2 (GN100-reunatietokanta pg_duckdb + pgvector) → Vaihe 3 (lakehouse-integraatio).

**Tutkimuspanos:** Osoittaa, että hallinnoidun palveluntarjoajan rajoitteet (Aiven-sallittujen lista) toimivat arkkitehtuurin ohjaajana — pakottavat kaksitasoisen HTAP-mallin, jossa tuotanto ja reunalaskenta eriytyvät. TimescaleDB Hypercore on ainoa yhden tietokannan HTAP-ratkaisu, joka täyttää sekä Aiven-yhteensopivuuden että EU-tietojen sijaintivaatimukset.

### 14.12 Harness Engineering ja forensiikkatelemetria

**Lähde:** OpenAI, "Harness engineering: leveraging Codex in an agent-first world", 13.02.2026; analyysi tiedostossa `docs/OPENAI_HARNESS_ENGINEERING_ANALYSIS.md`.

**Konteksti:** OpenAI:n harness engineering -kehys kuvaa miten AI-agenttia ympäröivä ympäristö (scaffolding, rajoitteet, palautesilmukat) määrittää agentin tehokkuuden enemmän kuin itse malli. Tämä osio yhdistää harness engineeringin Firehorse-forensiikkatelemetriaan ja laajempaan väitöskirjatutkimukseen oikeudellisesti pätevistä AI-operaatioista.

#### 14.12.1 Harness-forensiikka-yhteys

OpenAI:n harness-malli keskittyy **kehittäjien tuottavuuteen** — tuotteiden rakentamisen nopeuttamiseen AI-agenttien avulla. DWS IQ 6 laajentaa harness-käsitteen **forensisiin operaatioihin**, joissa jokaisen agenttitoimenpiteen on oltava jäljitettävissä, auditoitavissa ja oikeudellisesti pätevä.

| Harness-kerros                   | OpenAI:n tarkoitus         | Firehorse-forensiikan tarkoitus                               |
| -------------------------------- | -------------------------- | ------------------------------------------------------------- |
| **AGENTS.md**                    | Kartta kehittäjäagenteille | Auditoitavissa oleva järjestelmäkuvaus sääntelyviranomaisille |
| **Golden Principles**            | Koodin laadunvarmistus     | Vaatimustenmukaisuusstandardien noudattaminen 20 toimialalla  |
| **Tieto repossa**                | Kehittäjädokumentaatio     | VERSION AND AGENT HISTORY — muuttumaton muokkauspäiväkirja    |
| **Agentti-agentti-katselmointi** | Koodin laadun iteraatio    | Monimallikatselmointi, joka luo forensisen todistusketjun     |
| **Palautesilmukat**              | Kehittäjien tuottavuus     | Oikeudellisesti pätevä päätösten jäljitettävyys               |

**Keskeinen oivallus:** DWS-dokumenttistandardin VERSION AND AGENT HISTORY -lohko muuttaa jokaisen dokumentin forensiseksi artefaktiksi. Jokainen muokkaus tallentaa: versionumeron, käytetyn työkalun, session ID:n, päivämäärän ja tehdyt muutokset. Tämä on harness-mekanismi, jota OpenAI ei kuvaa — koska he optimoivat nopeutta, eivät oikeudellista puolustettavuutta.

#### 14.12.2 KYA-standardi laitteistotason harness-todennuksena

OpenAI:n harness toimii kokonaan ohjelmistotasolla — rajoitteet, linterit, koodikatselmointi-silmukat. DWS:n KYA-standardi (Know Your Agent/Architecture) laajentaa harnessin laitteistotasolle:

| Harness-tyyppi                  | OpenAI                      | DWS KYA                                                      |
| ------------------------------- | --------------------------- | ------------------------------------------------------------ |
| **Agentti-identiteetti**        | Ohjelmistotason sessio-ID:t | Laitteistotodennettu agentin identiteetti (TPM/Secure Boot)  |
| **Suorituksen eristys**         | Konttien hiekkalaatikko     | Laitteistoeristetyt suoritusympäristöt                       |
| **Auditoinnin muuttumattomuus** | Git-historia                | Laitteistotodennetut auditointilokit (peukaloinnin kestävät) |
| **Luottamusraja**               | Prosessitaso                | Laitteistoturvamoduulin raja                                 |

KYA-standardin Kilpi (turvallisuus) ja Miekka (optimointi) -paradigma osoittaa, että **laitteistotason harness tarjoaa takuita, joita ohjelmisto-harness ei voi antaa** — erityisesti EU-reguloiduilla toimialoilla, joilla agenttipäätöksillä on oikeudellinen vastuu.

#### 14.12.3 Empiirinen validointi: harness ylittää mallin

Harness engineering -kirjallisuus tarjoaa empiirisiä todisteita Firehorse-toimintamallin tueksi:

- **52,8 % → 66,5 % parannus** pelkillä harness-muutoksilla (LangChain-tapaus, sama gpt-5.2-codex-malli)
- **46,9 % tokenisäästö** progressiivisella paljastamisella (Cursor)
- **15–47 % parempi sääntöjen noudattaminen** L6 Tool Result Injection vs pelkkä systeemiprompt (DWS:n sisäinen mittaus)

Nämä löydökset validoivat Firehorse-mallin investoinnin operatiiviseen infrastruktuuriin (forensiikkatelemetria, automatisoitu PR-katselmointi, session handover -protokolla) mallivalinnan sijaan. Malli on vaihdettavissa — harness on kilpailuetu.

#### 14.12.4 EU-regulaation eroavaisuus

Firehorse-operaatioissa, jotka palvelevat EU-reguloituja toimialoja, harnessin on täytettävä rajoitteet, joita OpenAI:n sisäiset työkalut eivät kohtaa:

| EU-vaatimus                                | Harness-implikaatio                                         | Firehorse-toteutus                                              |
| ------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------- |
| **EU AI Act Art 12** (7 vuoden lokitus)    | Jokainen agenttitoimenpide kirjattava muuttumattomasti      | VERSION AND AGENT HISTORY + Supabase-auditointitaulut           |
| **EU AI Act Art 14** (ihmisen valvonta)    | Ihminen silmukassa pakollinen korkean riskin järjestelmissä | Karpathy-periaatteet: "ihminen on arkkitehti"                   |
| **GDPR Art 17** (oikeus tulla unohdetuksi) | Datan poisto säilyttäen auditointipolku                     | Pseudonymisoidut auditointilokit erillisellä PII-tallennuksella |
| **NIS2 Art 23** (häiriöilmoitukset)        | 24 tunnin tietoturvaloukkauksesta ilmoittaminen             | Firehorse-automatisoitu häiriötelemetria                        |

**Tutkimuspanos:** Tämä osio osoittaa, että **harness engineering ei ole yksi koko kaikille.** EU-regulaatiokonteksti vaatii perustavanlaatuisesti erilaisen harness-suunnittelun — sellaisen, joka priorisoi jäljitettävyyttä, ihmisen valvontaa ja oikeudellista puolustettavuutta nopeuden sijaan. OpenAI:n 3,5 PR/insinööri/päivä -mittari on irrelevantti, kun ensisijainen mittari on vaatimustenmukaisuuden varmistaminen ja auditointivalmius.

### 14.13 LWM-sekvensointistrategia — Sääntely-älykkyydestä fyysiseen tekoälyyn

**Lähde:** LeWorldModel (arXiv:2603.19312, Maes ym., maaliskuu 2026); LWM-sekvensointianalyysi tiedostossa `docs/field-notes/2026-03-25-lwm-phase2-technical-gap-analysis.md`.

**Konteksti:** Lifetime World Model palvelee kaksoisroolia: sääntely-älymoottori (vaihe 1, nykyinen) ja fyysinen suunnittelujärjestelmä (vaihe 2, tuleva). Tämä osio dokumentoi sekvensointistrategian ja vaiheiden välisen teknisen aukon.

#### 14.13.1 Kolmivaiheinen sekvensointi

**Vaihe 1 (Nykyinen):** LWM sääntely-älymoottorina — 15 000+ EU-dokumenttia, 18 AI-agenttia, hiilitase poikkisääntelyisellä täsmäytyksellä. Liikevaihtoa tuottava. 6 asiakasta (KELA, Taksi Helsinki, Uber, Bolt, Limo Helsinki, Sixt).

**Vaihe 2 (SAFE:n jälkeen):** LWM lisää fyysisen suunnittelun latenttitila-mallien kautta (LeWorldModel-tyylinen JEPA-arkkitehtuuri). Helsingin terveydenhuollon laivastopilotti.

**Vaihe 3 (Series A):** Täysi kaksikäyttötuote — vaatimustenmukaisuusinfrastruktuuri + reunafyysinen tekoäly 5 toimialalla.

**Keskeinen oivallus:** Vaatimustenmukaisuusdata syöttää fyysistä suunnittelua. Ei toisinpäin.

#### 14.13.2 LeWorldModel ulkoisena validointina

LeWorldModel (Maes, Le Lidec, Scieur, LeCun, Balestriero, 2026) osoittaa stabiilin JEPA-koulutuksen raakapikseleistä vain 2 häviötermillä (ennustus + SIGReg). 15M parametria, yksi GPU, 48x nopeampi suunnittelu. SIGReg-regulaattori (Cramér-Wold-lause, isotrooppinen Gaussin priori) ratkaisee esityksen romahdusongelman.

#### 14.13.3 Vaiheen 2 tekninen aukko

Kolme ratkaisematonta ongelmaa tohtoritutkimukselle:

1. **Syötemodaalien kuilu:** Tekstipohjainen sääntelygraafi → visuaalisia/anturisyötteitä odottava latentti suunnittelija. Ehdotettu silta: OpenUSD-digitaalikaksonen.

2. **Skaalan kuilu:** LeWorldModel testattu kontrolloidussa simulaatiossa. Teolliset ympäristöt ovat kontrolloimattomia, pitkän aikahorisontin ja harvan palautteen ympäristöjä.

3. **Sääntely-fyysinen integraatio:** Fyysinen suunnittelija ehdottaa → sääntely-moottori validoi → KYA-hallintaportti valvoo. KYA v1.4 on ainoa vaiheen 2 komponentti, joka on jo rakennettu.

**Tutkimuspanos:** Vaatimustenmukaisuus ensin -maailmamalliteesi — sääntelyinfrastruktuurin on edellettävä fyysisen suunnittelun kykyä — tarjoaa konkreettisen tutkimusohjelman, joka yhdistää LeWorldModelin teoreettiset edistysaskeleet teolliseen käyttöönottoon EU-reguloiduissa ympäristöissä.

---

## Liite G: Sanasto

### Alusta- ja liiketoimintakäsitteet

| Termi (EN)           | Suomeksi         | Määritelmä                                                                                |
| -------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| **AgentFoundry**     | AgentFoundry     | Monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa |
| **Edge AI**          | Reunatekoäly     | Tekoälyprosessointi paikallislaitteilla pilvipalvelimien sijaan                           |
| **Firehorse**        | Firehorse        | DWS6-tuoteperhe (Reports, Automation, Omnichannel, CMS)                                   |
| **MCP Hub**          | MCP Hub          | Model Context Protocol -koordinointipalvelin moniagenttiorkestroinnille                   |
| **Solution Factory** | Solution Factory | Toimintamalli useiden teollisten AI-alustojen tuottamiseen jaetuista komponenteista       |

### Tietoarkkitehtuuri ja analytiikka

| Termi (EN)           | Suomeksi            | Määritelmä                                                                                                                  |
| -------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Autoresearch**     | Autotutkimus        | Karpathyn inspiroima autonominen validointisilmukka: hypoteesi → muokkaus → todentaminen → säilytä/hylkää → toista          |
| **Columnar Storage** | Saraketallennustila | Tietokantatallennus, joka järjestää datan sarakkeittain — mahdollistaa 10-100× pakkauksen ja nopeammat analyyttiset kyselyt |
| **HTAP**             | HTAP                | Hybrid Transactional/Analytical Processing — yksi tietokanta palvelee sekä OLTP- että OLAP-työkuormia                       |
| **Hypercore**        | Hypercore           | TimescaleDB:n automaattinen hybridi rivi→sarake -tasointimoottori, 90-98% pakkaus                                           |
| **pg_duckdb**        | pg_duckdb           | PostgreSQL-laajennus DuckDB-upotuksella 50-600× OLAP-kiihdytykseen (DWS:ssä vain reunalaitteilla)                           |
| **pgvector**         | pgvector            | PostgreSQL-laajennus vektorihakuun RAG-putkistoissa                                                                         |
| **TimescaleDB**      | TimescaleDB         | PostgreSQL-laajennus aikasarjadatalle pakkauksella ja jatkuvilla aggregaateilla                                             |
| **Two-Tier HTAP**    | Kaksitasoinen HTAP  | Arkkitehtuurimalli: Taso 1 (Aiven-hallinnoitu, TimescaleDB) + Taso 2 (itsehallittu reuna, pg_duckdb)                        |

### Turvallisuus ja vaatimustenmukaisuus

| Termi (EN)              | Suomeksi                         | Määritelmä                                                                                        |
| ----------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Aiven-first Mandate** | Aiven-ensisijaisuus              | DWS-periaate, joka edellyttää tuotantolaajennusten Aiven-yhteensopivuutta                         |
| **DWS Data Standard**   | DWS-tietostandardi               | Sisäinen standardi tiedon tallennuspäätöksille ja EU-sääntelyvaatimustenmukaisuudelle             |
| **EU AI Act**           | EU:n tekoälysäädös               | EU:n säädös tekoälyjärjestelmille (elokuun 2026 määräaika)                                        |
| **GDPR**                | GDPR (Yleinen tietosuoja-asetus) | EU:n tietosuoja-asetus                                                                            |
| **KYA Standard**        | KYA-standardi                    | Know Your Agent/Architecture — AI-agenttien turvallisuus (Kilpi) ja optimoinnin hallinta (Miekka) |
| **NIS2**                | NIS2                             | EU:n kyberturvallisuusdirektiivi kriittiselle infrastruktuurille                                  |
| **Proxy-to-Scale**      | Pienestä suureen -validointi     | Karpathyn malli: validoi muutokset pienellä mallilla ennen tuotantoskaalausta                     |
| **RLS**                 | Rivitason suojaus                | Tietokantatason pääsynhallinta käyttäjä-/organisaatiokohtaisesti                                  |

### 14.14 Kilpailija-analyysi: Toimialakohtainen vs geneerinen AI-harness

Maaliskuussa 2026 suoritettu vertailututkimus vertasi DWS6-harness-arkkitehtuuria **everything-claude-code (ECC)** -kehykseen — 120 000 tähden avoimen lähdekoodin kehykseen, joka tarjoaa 136 taitoa, 30 aliagenttia ja 60 slash-komentoa.

**Perustavanlaatuinen kompromissi:** ECC optimoi **leveyteen** (136 taitoa × 8 kieltä × 5 IDE:tä); DWS6 optimoi **syvyyteen** (21 taitoa × syvä EU-sääntelyn tuntemus × rakenteellinen valvonta).

Kuusi tunnistettua kilpailuetua:

1. **Toimialakohtaiset taidot** koodaavat EU-sääntelyä (ETS, CBAM, CSRD, EN 15978, EN 13001) — ei toistettavissa geneerisellä taitomäärällä
2. **Kuusikerroksinen tietoarkkitehtuuri** (L0-L6) hallitsee kontekstin injektointia jokaisella kerroksella — ECC toimii vain tasoilla L2-L3
3. **Kovat portit** (verification-gate, design-first, dual-folder-sync) paluukoodilla 2 (ESTÄ) — ECC:n taidot ovat vain neuvoa-antavia
4. **Luottamusvyöhykkeet** (VIHREÄ/KELTAINEN/PUNAINEN) riskisuhteutetulla toimintaluokittelulla — ECC:llä vain binäärinen salaisuuksien skannaus
5. **gstack-työnkulku** pakotetulla kognitiivisella roolierottelulla — ECC:n taidot ovat itsenäisiä ja orkesteroimattomia
6. **Agentti-ensin -tuotesääntö** (5-portin tarkistuslista: CLI, JSON-tuloste, MCP-työkalu, Claude-taito, markdown-dokumentit) — taidot tuoterajapintoina

**Tutkimuksellinen merkitys:** Token-budjetin tasolla leveys on haitallista säännellyillä toimialoilla. 136 geneerisen taidon lataaminen kuluttaa konteksti-ikkunan kapasiteettia, jota toimialakohtaiset agentit tarvitsevat sääntelyn päättelyyn. DWS6:n <150 sanan rajoitus kurinpitotaidoille on token-budjetin optimointi syvempään toimialapäättelyyn. Tämä validoi harness engineering -teesin (osio 14.12).

### 14.15 Pro gradun kaksoisversioarkkitehtuuri

Pro gradu (V3Thesis) kasvoi 82 sivuun ja yli 26 000 sanaan tekoälyavusteisen tutkimusprosessin aikana — lähes kaksinkertainen Metropolian 40-50 sivun palautustavoitteeseen nähden. Tutkimussisällön pysyvän poistamisen sijaan omaksuttiin kaksoisversioarkkitehtuuri:

**v3.30.50 (Jäädytetty, 50 sivua):** Uudelleenrakennettu Metropolia-palautusta varten. Osiot 10.6-10.18 konsolidoitu tiivistelmäosioksi (10.6 "Laajennetut tutkimuspanokset") ristiviittauksilla tähän PHD Firehorse -dokumenttiin. Osio 5 laajennettu 0,7:stä ~4 sivuun. Liitteet karsittu 8:sta 4:ään. Tiedosto vastaanottaa vain HIL (Human-in-the-Loop) -muokkauksia — ei automatisoituja tekoälypäivityksiä.

**v3.32+ (Elävä, 82 sivua):** Jatkaa tutkimuslöydösten keräämistä kuten ennenkin. Jokainen uusi versiomerkintä on aikaleimattu tutkimuksen etenemisen tallenne.

**PHD Firehorse kanonisena kotina:** Tämän dokumentin osiot 14.1-14.14 toimivat nyt auktoritatiivisena yksityiskohtaisena dokumentaationa pro gradun v3.30.50:ssa tiivistetyille sisällöille. Pro gradu viittaa eksplisiittisesti "PHD Firehorse osiot 14.X" jokaiseen tiivistettyyn aiheeseen.

**Tutkimuspanos:** Kaksoisversiomalli osoittaa käytännön menetelmän tekoälyavusteiseen akateemiseen kirjoittamiseen, jossa tutkimuksen nopeus ylittää järjestelmällisesti oppilaitoksen formaattirajoitukset. Malli säilyttää henkisen omaisuuden täyttäen samalla palautusvaatimukset — toistuva haaste tekoälyn nopeuttaessa tutkimusdokumentointia.

**Avainpanos #18:** Kaksoisversioarkkitehtuuri menetelmällisenä kontribuutiona tekoälyavusteiseen akateemiseen kirjoittamiseen.

### 14.16 Huhtikuun 2026 kehitys: Report Engine tuotannossa, Product Line V2, Snap-mittaustulos ja perustajan→tiimin siirtymä

_Lisätty: 20.04.2026 | Lähde: PR #1064, #1109, #1110; kenttämuistiinpanot 2026-04-06–2026-04-19; Firehorse Snap -mittaustulos (Firecracker MicroVM); SOLO_FOUNDER_STATEMENT v1.2._

Versioiden 2.7 (18.03.2026) ja 2.8 (20.04.2026) välissä Firehorse eteni dokumentoidusta toimintamallista mitattavaksi tuotantojärjestelmäksi. Viisi operatiivista virstanpylvästä määrittää tämän ikkunan.

#### 14.16.1 Firehorse Report Engine — Tuotantoajastin (PR #1064)

Firehorse Report -moduuli siirtyi spesifikaatiosta ajastettuun tuotantoon. PR #1064 yhdisti raporttiajastimen (`src/firehorse/report-scheduler.ts`), moduulitason testit (`src/__tests__/firehorse-report-module.test.ts`) ja manuaalisen laukaisureitin. Tämä on ensimmäinen Firehorse-moduuli, joka toimittaa cron-pohjaisen asiakastoimituksen, sulkien silmukan toimintamallin (§14.1–14.4) ja asiakasarvon välillä:

| Kyvykkyys            | Toteutus                                                       |
| -------------------- | -------------------------------------------------------------- |
| Ajastettu lähetys    | Node-cron -lausekkeet vuokralaista kohti; aikavyöhyketietoinen |
| Manuaalinen laukaisu | REST-reitti ad hoc -raporttigenerointiin                       |
| Testikattavuus       | Moduulitason testit (ei ylimoduulista vuotoa)                  |
| Vaatimustenmukaisuus | CSV/JSON-vienti CSRD/CBAM/ETS-raportointiputkiin               |

**Toimintamallille merkittävyys:** Ajastin on ensimmäinen Firehorse-komponentti, jossa 3-tasoinen laskutussopimus (§2.0 v2.0, Version 2.0) tuottaa toistuvia vaatimustenmukaisuusartefakteja ilman ihmisen väliintuloa. Hypoteesi, että tekoälyavusteinen yhden hengen tiimi voi käyttää monivuokralaista vaatimustenmukaisuustuotetta, on nyt testattavissa todellista ajastettua lähetystä vasten.

#### 14.16.2 Firehorse Product Line V2 — Yhtenäinen DWS IQ -tuoteperhe

Huhtikuussa 2026 neljä Firehorse-moduulia (Omnichannel, Signed Report, Automation, Content Management) konsolidoitiin yhdeksi V2-tuotelinjaksi DWS IQ -tuoteperheen alla. Jokainen moduuli sai V2-nimityksen, oman kuvamateriaalin ja kaupan näkyvyyden. Yhdistetyt committit sisältävät `Firehorse Product Line V2`, `Firehorse Automation V2`, `Firehorse Starter V2 bundle`, `Firehorse Content Management V2`, `Firehorse Signed Report V2`, `Firehorse ReportV2` ja `firehorse-omnichannel-v2.png`. Firehorse Starter V2 -paketti on olemassa sisääntulotason SKU:na.

**Toimintamallille merkittävyys:** V2 kiteyttää Solution Factoryn tuotoksen katalogi-ensin -tuoteperheeksi, jota voidaan ostaa, paketoida ja versioida itsenäisesti — edellytys Ops Manager ICP:lle (ks. §14.16.5).

#### 14.16.3 Firehorse Snap -mittaustulos — <125 ms mitattu tappoviive

Tämän opinnäytetyön aiemmat versiot viittasivat 122 ms:iin Firehorse Snap -tappoviiveen spesifikaationa Arctic 15 -suunnitteludokumenteista. Huhtikuussa 2026 mitattu tappoviive Firecracker MicroVM -infrastruktuurilla kerättiin ja julkaistiin KYA Standard -sivulla (`dws10.com/kya-standard`). Julkinen väite on päivitetty 122 ms:n spesifikaatiosta **<125 ms:ksi mitattu** (Firecracker MicroVM -mittaustulos). KYA-sivu näyttää nyt sekä mitatut että Firecracker-spesifikaatiolukemat, jotta lukijat voivat erottaa spesifikaation mittauksesta.

**Toimintamallille merkittävyys:** Oikeudellisesti pätevät harness-väitteet (§14.12 Harness Engineering ja forensiikkatelemetria) edellyttävät mittausta, eivät spesifikaatiota. Julkisen lukeman päivittäminen spesifikaatiosta mitattuun on ensimmäinen kerta, kun Firehorse-harness-takaus on tuettu toistettavalla mittaustuloksella. Tämä on EU AI Act -artikla 12 -lokien tutkintakelpoisuuden edellytys täytäntöönpanomenettelyissä.

#### 14.16.4 Skills-paradigma sovellettuna operaatioihin — Anthropicin 16.4.2026 validointi

Anthropicin 16.4.2026 essee "Stop Building Agents, Start Building Skills" (kenttämuistiinpano `docs/field-notes/2026-04-16-anthropic-skills-paradigm-stop-building-agents.md`) validoi ulkoisesti §14.14:ssä (Toimialakohtainen vs geneerinen AI-harness) dokumentoidun taito-ensin -arkkitehtuurin. Firehorse-toimintamalli ei ole "agenttikehys, jossa on taitoja" — se on taitokirjasto, joka sattuu kutsumaan agentteja. Kolme uutta tuotantotaitoa julkaistiin tässä ikkunassa:

| Taito                | Tarkoitus                                                           | Toimintamallirooli                                     |
| -------------------- | ------------------------------------------------------------------- | ------------------------------------------------------ |
| `/regulatory-radar`  | Skannaa EUR-Lex / DG ENER / EFRAG / CINEA tulevan sääntelyn varalta | Ennakoi vaatimustenmukaisuustuotteiden tiekartan       |
| `/investor-outreach` | Luonnostele, triaageaa ja seuraa sijoittajien INTRO-muistioita      | Tekee varainkeruusta toistettavan työnkulun (§14.16.5) |
| `/multilingual`      | Tuota / auditoi EU-monikielistä sisältöä (FI/SV/DE/FR)              | Lokalisoi Firehorse-kaupan + onelifetime.worldin       |

Taitoinventaario yhteensä: 24+ tuotantotaitoa 4 estävällä kurinpitoportilla. Hypoteesi, että taidot ovat tuoterajapinta (§14.14 Tutkimusmerkitys), on nyt ulkoisesti vahvistettu nousevaksi toimialan malliksi.

#### 14.16.5 Ops Manager V0 -ostajalukitus + perustajan→tiimin siirtymä

Kaksi toisiinsa liittyvää virstanpylvästä vastaavat toimintamallin "kuka ostaa" ja "kuka rakentaa" -kysymyksiin:

- **Ops Manager V0 -ostajalukitus (PRD v0.2, commit `4e64a089`):** Ensimmäisen dollarin asiakas on lukittu Ops Manager -persoonaan suomalaisten datakeskusoperaattoreiden parissa (hyperskaalaajat + kolokaatio). Validointiskripti on PRD:n liitteenä estääkseen validoimatonta ICP-ajautumista. Tämä tiukentaa silmukkaa osion 14.4 (Urakoitsija-agentin perehdytys) ja Datakeskusten vaatimustenmukaisuusagentin PRD v0.1:n (`docs/DWS_IQ_7_DATACENTRE_COMPLIANCE_AGENT_PRD_v0.1.md`) välillä.
- **Perustajan→tiimin siirtymä:** `SOLO_FOUNDER_STATEMENT.md` v1.2 lukitsee yksinperustaja-tekoälytiimin kanssa -narratiivin yhden totuuden lähteeksi Series A / SAFE -sijoittajakeskusteluihin. Anthony Maurin astuu CTO-yhteisrakentajaksi tiukennetulla osuussekvensoinnilla Perissichin uudelleenaktivointikatalyytin suhteen. `/investor-outreach` -taito tuottaa 10+ nimettyä INTRO-muistiota 2 viikon ikkunassa (42CAP Wilke, Plug and Play Paris Laouiti, Ingrisano, Perissich, Kefalogiannis, von Euen, Yomutbayev, Zawadzinski) — sijoittajayhteydenpito on nyt DWS IQ -työnkulku, ei hiljaista perustajatietoa.

**Toimintamallille merkittävyys:** Firehorse-toimintamalli selviää perustajasta-tiimiksi-siirtymästä vain, jos jokainen aiemmin hiljainen perustajatoiminta (varainkeruu, ostajavalidointi, kumppanuusyhteydenpito) muuttuu taidoksi. PRD v0.2 (ostajavalidointi) + `/investor-outreach` (sijoittajaputki) ovat kaksi kolmesta jalasta; kumppanuusyhteydenpito (Aiven, Shufti, Kosti Salmi / Salesforce) on vielä koodattava taidoksi seuraavassa ikkunassa.

#### 14.16.6 Tutkimuspanos

**Avainpanos #19 — Report Engine tuotannossa:** Firehorse Report -ajastin (PR #1064) on ensimmäinen Firehorse-moduuli, joka toimittaa cron-pohjaisia asiakastoimituksia moduulitason testeillä ja manuaalisella laukaisureitillä. Tämä sulkee silmukan toimintamallin 3-tasoisen laskutussopimuksen (Versio 2.0) ja toistuvien vaatimustenmukaisuusartefaktien välillä ilman ihmisen väliintuloa, tarjoten ensimmäisen päästä päähän -testin yhden-henkilön-tiimin monivuokralaisen vaatimustenmukaisuushypoteesille.

**Avainpanos #20 — Mitattu harness-takaus (<125 ms Snap):** Firehorse Snap -tappoviive on nyt tuettu toistettavalla Firecracker MicroVM -mittaustuloksella Arctic 15 -spesifikaation sijaan. Tämä on ensimmäinen kerta, kun oikeudellisesti pätevä harness-väite Firehorse-toimintamallissa on mitattu julkaistusti spesifikaation sijaan, ja edellytys EU AI Act -artikla 12 -lokien tutkintakelpoisuudelle täytäntöönpanotilanteissa (§14.12).

**Avainpanos #21 — Perustajan→tiimin siirtymä taitoina:** Ops Manager V0 -ostajalukitus (PRD v0.2 + validointiskripti) ja `/investor-outreach` -taito (10+ INTRO-muistiota luonnosteltu) osoittavat yhdessä, että aiemmin hiljaiset perustajatoiminnat (ICP-validointi, sijoittajaputki) voidaan koodata toistettaviksi DWS IQ -taidoiksi. Tämä laajentaa Firehorse-toimintamallin sisäisestä työkalusta perustajasta-tiimiksi-siirtymämekanismiksi — välttämätön ominaisuus, jos toimintamallin on määrä selvitä yksinperustajavaiheen yli.

---

### 14.17 DWS Skilled -taksonomia: Brändi / Speksi / UI agenteille, työnkuluille ja jurisdiktioille

_Lisätty: 22.04.2026 | Lähde: CLAUDE.md "DWS Skilled Taxonomy Rule"; Anthropicin 16.4.2026 Skills-paradigman essee (§14.16.4); "GodAgent"-brändin käytöstä poisto. PHD_FIREHORSE:n versiolinja yhdistetty Metropolia V3Thesisin kanssa v3.37:ssa; tästä eteenpäin kaikki 4 opinnäytetyötiedostoa päivitetään rinnakkain (3.37 → 3.38 → … → 3.99 → 4.00)._

#### 14.17.1 "GodAgentista" kolmitasoiseen nimeämisjärjestelmään

Firehorse-toimintamalli käytti aiemmin "GodAgent"-termiä yhtenä leimana toimialakohtaisille erikoisagenteille. Anthropicin 16.4.2026 essee "Stop Building Agents, Start Building Skills" (ks. §14.16.4) validoi ulkoisesti toimintamalliin upotetun taito-ensin -arkkitehtuurin (§14.14 Toimialakohtainen vs geneerinen AI-harness). Tämän validoinnin jälkeen yksilabel-käytäntö muuttui positiointiriskiksi: brändi, spesifikaatio ja UI-kategoria ovat kolme eri rekisteriä, eikä yksi termi voi palvella kaikkia kolmea laimentamatta kutakin. Tässä osiossa esitellään kolmitasoinen nimeämistaksonomia, joka korvaa "GodAgent"-termin Firehorse-toimintamallissa.

#### 14.17.2 Malli

```
Skilled <Akseli>                 ← BRÄNDI  (mitä MYYDÄÄN)
    └─ Industrial Specialist <Akseli>    ← SPEKSI  (mitä ne OVAT)
            └─ Industry <Akseli>         ← UI      (miten ne LISTATAAN)
```

Kolme akselia ovat tällä hetkellä aktiivisia Firehorse-toimintamallissa:

| Taso     | **Agentit**                  | **Työnkulut (Workflows)**                                             | **Jurisdiktiot**                      |
| -------- | ---------------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| 1 Brändi | Skilled Agents               | Skilled Autonomous Workflows                                          | Skilled Jurisdictions (EU, US, Aiven) |
| 2 Speksi | Industrial Specialist Agents | Specialist Workflows (pitkä muoto: _Industrial Specialist Workflows_) | Regulatory Specialist Jurisdictions   |
| 3 UI     | Industry Agents              | Industrial Workflows                                                  | Jurisdictions                         |

"Autonomous" esiintyy vain työnkulkujen brändi­tasolla, koska työnkulut suoritetaan aikataululla tai tapahtumalla ilman ihmistä silmukassa — ominaisuus, jonka toimintamallin myymäläkopion on ansaittava jokaiselle tuotteelle, joka väittää toimittavansa toistuvia compliance-artefakteja (ks. §14.16.1 Firehorse Report Engine -ajastin). "Regulatory" esiintyy jurisdiktioiden speksitasolla, koska jurisdiktio määrittyy sääntelypinnan (AI Act, GDPR, CBAM, ETS, CSRD EU:lle; sektorisäännöt US:lle; data-lokalisaatio Aivenille) eikä pelkän maantieteen kautta.

#### 14.17.3 Toimintamallin merkitys

Kolme seurausta Firehorse-toimintamallille:

1. **SKU-kopion kuri.** `brand:`-kenttä `products.json`-tiedostossa ja myymäläsivun metatiedot käyttävät brändi­tason termiä (`Skilled Agents`, `Skilled Autonomous Workflows`), joka kohdistaa ulospäin suuntautuvan positioinnin Anthropicin Skills-paradigman validointiin (§14.16.4). Speksi- ja UI-tason termit eivät kuulu otsikkokopioon.
2. **Ajastinkopion kuri.** Firehorse Report Engine (§14.16.1) ja tuleva Firehorse Automation -moduuli tuottavat ajastettuja toimituksia; niiden tuotekuvausten on ulotuttava työnkulkutasolle ("Skilled Autonomous Workflows") eikä agenttitasolle, jotta autonomia-ominaisuus ei jää alimyytyksi.
3. **Jurisdiktion pakkaus.** Aegis / Sovereign Infra / Connect -segmentointi (ks. V3Thesis §10.21.5) on jo järjestetty sääntelypinnan mukaan. Taksonomia nimeää tämän rakenteen eksplisiittisesti: jurisdiktiot ovat brändättyjä ("Skilled Jurisdictions") eivätkä pelkästään deployment-metadataa.

#### 14.17.4 Lukumäärien dynamiikka

Kunkin akselin entiteettien lukumäärä muuttuu sitä mukaa kun toimialoja, työnkulkuja ja jurisdiktioita lisätään. Kolme hyväksyttävää kaavaa:

1. **Avoimet lukumäärät** alustakopiossa: `18+ Skilled Agents`, `20+ Skilled Jurisdictions` — `+` imee kasvun.
2. **Rekisteriankkuroidut viittaukset** spesifikaatioissa: "ks. Industrial Specialist Agent -rekisteri `docs/Deputy-Agents-Architecture.md` §3:ssa".
3. **Tuotekohtaiset lukumäärät** SKU-kopiossa: "Climate Intelligence sisältää 8 Skilled Agentia" — täsmällinen, mutta käsitellään osana SKU-spesifikaatiota `products.json`-tiedostossa, ei vapaasti tekstissä.

#### 14.17.5 Poikkeukset

- **Docker- / infra-tunnisteet** (`dws-godagent-llm`-verkko, `dws-godagent:latest`-image, label `dws-godagent`) säilyvät ennallaan; niiden uudelleennimenä on infra-migraatio, ei dokumentaatiomuutos.
- **Pantheon "God Agents"** `onelifetime.world`-sivustolla (kreikkalaismyyttiset hahmot — ks. §14.9 Climate IQ Pantheon) on erillinen brändi ja säilyy ennallaan.
- **Historialliset tietueet** (field-muistiinpanot, päivätyt kansiot, työajan- ja oppimispäiväkirjat) eivät ole takautuvan editoinnin kohteena.

#### 14.17.6 Tutkimuspanos

**Avainpanos #22 — Rekisteri-eksplisiittinen brändiarkkitehtuuri toimintamalleille:** Firehorse-toimintamalli formalisoi kolmitasoisen nimeämistaksonomian (Skilled / Industrial Specialist / Industry), joka sovelletaan yhdenmukaisesti kolmelle ortogonaaliselle kyvykkyysakselille (agentit, työnkulut, jurisdiktiot). Taksonomia on tutkimuspanos, koska se kohtelee nimeämistä osana toimintamallia eikä markkinoinnin kustannuseränä: kullakin rekisterillä on eri yleisö (ostaja, tarkastaja, käyttäjä), joilla on eri compliance-velvoitteet, eikä alkuvaiheen SaaS:sta perittyä yksilabel-käytäntöä voi tyydyttää kaikkia kolmea samanaikaisesti EU-sääntelyn alaisilla toimialoilla. Monotoninen `Skilled <Akseli>` -kaava esitetään yleistyvänä suunnittelumallina yksiperustaja-teollisuus-AI-alustoille, jotka tarvitsevat auditoitavan brändiarkkitehtuurin ilman erillistä markkinointiyksikköä.

---

## Liite H: KYA-kumppaniekosysteemi

_Lisätty: 18.03.2026 | Lähde: docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md, docs/field-notes/2026-03-10-palantir-aip-partner-outreach.md, docs/gtm/KYA_CONNECTOR_BRIEF_PALANTIR.md_

KYA-standardi (Know Your Agent) edellyttää kumppaniekosysteemiä 5-tasoisen luottamuskehyksensä toteuttamiseksi. Yksikään yksittäinen toimittaja ei voi tarjota samanaikaisesti laitteistotodennusta, identiteettiverifiointia, teollista jakelua ja EU-suvereenista tekoälypäättelyä. Tämä liite dokumentoi kumppaniarkkitehtuurin ja sen tutkimukselliset vaikutukset.

### H.1 KYA:n 5-tasoinen kumppanikartoitus

KYA-standardi määrittelee viisi luottamustasoa. Kukin taso yhdistyy tiettyyn kumppanin kyvykkyyteen:

| KYA-taso                                 | Toiminto                                                                                                                                                                                                                                                          | Kumppani                      | Integraation tila       |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- | ----------------------- |
| **L1 — Henkilöidentiteetti**             | KYC/AML/IDV-verifiointi                                                                                                                                                                                                                                           | Shufti Pro                    | PoC käynnissä (Q1 2026) |
| **L2 — Agentin alkuperä**                | Agentin alkuperän ja rekisterin todentaminen                                                                                                                                                                                                                      | DWS Agent Registry (sisäinen) | Tuotannossa             |
| **L3 — Agentin kyvykkyys**               | Työkalu-/API-pääsyn porttaus MCP-manifestilla                                                                                                                                                                                                                     | DWS MCP Hub (sisäinen)        | Tuotannossa             |
| **L4 — Suoritusaikainen käyttäytyminen** | Oikeudellisesti pätevä telemetria (egress, tiedosto-I/O, tokenit) — OpenSandbox-hallintakerros Docker-kontainerien ympärillä; VMM-tason monitorointi agentin käyttöjärjestelmän alapuolella; TPM 2.0 -todennetut logit EU AI Act Art. 12 -vaatimustenmukaisuuteen | DWS OpenSandbox (sisäinen)    | MVP:stä alkaen          |
| **L5 — Jatkuva riski**                   | Dynaaminen riskiprofiilin seuranta                                                                                                                                                                                                                                | Shufti Pro -webhookit         | PoC suunniteltu         |

**L4-arkkitehtuuripäätös (maaliskuu 2026):** Sovellustyökuormat suoritetaan Docker-kontainereissa, mutta L4-telemetria edellyttää OpenSandboxia (Firecracker MicroVM) hallintakerroksena Docker-suoritusympäristön _ympärillä_ MVP:stä alkaen. Docker yksin ei voi tuottaa oikeudellisesti pätevää L4:ää koska: (1) jaettu kernel sallii root-agenttien manipuloida omia logejaan, (2) ei TPM 2.0 -todennusta telemetrian eheydelle, (3) EU AI Act Art. 12 vaatii väärentämätöntä automaattista tapahtumien kirjaamista kaikille korkean riskin tekoälyjärjestelmille. Kaikki DWS IQ:n asiakkaat toimivat EU-reguloiduilla toimialoilla — "vain funktionaalista L4:ää" -tasoa ei ole. Jokaisen agenttiinteraktion on tuotettava oikeudellisesti pätevä auditointipolku.

**Tutkimuksellinen merkitys:** Tasot L2–L4 rakennetaan sisäisesti, mutta L1 ja L5 vaativat ulkoista identiteetti-intelligenssiä. Tämä luo luonnollisen kumppanuusrajan: DWS hallinnoi agentin suoritusympäristöä; identiteettikumppani hallinnoi sen takana olevaa ihmistä.

### H.2 Shufti Pro — Identiteettiverifiointikumppani (L1/L5)

**Ongelma:** Perinteinen KYC verifioi ihmisen ovella. Agenttinatiiveissa arkkitehtuureissa ihminen on vain sisääntulopiste. Todellinen riskipinta on: minkä agentin käyttäjä ottaa käyttöön, ja muuttuuko käyttäjän riskiprofiili agentin ollessa käynnissä?

**Integraatioarkkitehtuuri:**

```
Käyttäjän perehdytys: DWS Auth (Supabase) → Shufti IDV API → KYA L1 -pisteet
Agentin käyttöönotto: Agentin manifesti → KYA L2-L3 -katselmointi → Sandbox-käytäntö
Suoritusaika:         Shufti-webhookit (L5) → DWS-tapahtumaväylä → Sandboxin rajoitus/laajennus
```

**KYA Trust Score -kaava:**

```
KYA_TRUST = f(shufti_riskipisteet, agentin_alkuperä, kyvykkyyslaajuus, suoritusaikainen_käyttäytyminen)
```

| Pisteet | Taso        | Sandbox-toiminta                                 |
| ------- | ----------- | ------------------------------------------------ |
| >= 80   | Täysi       | Kaikki MCP-työkalut, egress, tiedostojärjestelmä |
| 50–79   | Rajoitettu  | Ei gressiä, vain luku, kuratoidut työkalut       |
| < 50    | Keskeytetty | Ihmiskatselmointi vaaditaan                      |
| 0       | Jäädytetty  | Agentti terminoitu (122ms Firehorse Snap)        |

**Kumppanuusehdot:** Tekninen PoC-pilotti (ei istuntolisenssiä). Shufti tarjoaa API-pääsyn; DWS tarjoaa OpenSandbox-suoritusympäristön ja KYA-kehyksen. Arvolupaus Shuftille: ensimmäinen toimija "Zero-Trust Agent Workspace" -kategoriassa — identiteettikerros autonomisille tekoälyagenteille, ei vain ihmisille.

**Nykytilanne (maaliskuu 2026):** EU-rajoitteinen prosessoinnin vahvistus ja DPA (tietojenkäsittelysopimus) pyydetty Shuftilta. GDPR Art. 44-49 -vaatimustenmukaisuus vaaditaan yritysasiakkaille. HMAC-SHA256 webhook-allekirjoitus vahvistettu.

### H.3 Palantir AIP — Liitinkumppanimalli

**Strateginen teesi:** Palantir AIP on alustakumppanuusmahdollisuus, ei kilpailija. Palantirilla on yritysjakelu ja ontologiadatamalli; DWS:llä on laitteistotason agentti-isolaatio ja EU-sääntelyn syvyys.

| Palantirilla on                        | Palantiriltä puuttuu              | DWS IQ tarjoaa                                |
| -------------------------------------- | --------------------------------- | --------------------------------------------- |
| Yritysagenttien orkestrointi (AIP)     | Laitteistotason agentti-isolaatio | Firecracker MicroVM (122ms terminointi)       |
| Fortune 500 -asiakaskunta              | EU CBAM/ETS/Fit for 55 -syvyys    | 20 toimialan sääntelymoottori                 |
| Ontologiadatamalli                     | TPM 2.0 -laitteistotodennus       | Oikeudellisesti pätevä auditointipolku        |
| $2,6 mrd ARR, todistettu skaalautuvuus | Alle 5ms VMM-tason suojakiskot    | Laitteistopakotteinen käyttäytymisen valvonta |

**Liitinarkkitehtuuri:** AIP-agentin työnkulut suoritetaan KYA-hallituissa Firecracker MicroVM:issä. Nollamuutosta olemassa oleviin Palantir-työnkulkuihin. Hallintakerros sijaitsee _agentin käyttöjärjestelmän alapuolella_.

**Ehdotetut tulomallit:**

| Malli          | Rakenne                                               |
| -------------- | ----------------------------------------------------- |
| Liitinlisenssi | Per-MicroVM-hallintamaksu (€0,02/agentti/tunti)       |
| Yhteismyynti   | Yhteiset yrityskaupat EU:n reguloiduilla toimialoilla |
| OEM            | Palantir niputtaa KYA-hallinnan AIP EU -tarjontaan    |

### H.4 BYO (Bring Your Own) -agenttipolitiikka

BYO määrittelee, miten ulkoiset agentit — miltä tahansa kumppanilta tai asiakkaalta — tulevat DWS IQ -ekosysteemiin:

| BYO-vaihe                 | Portti                                                               | Toimeenpano               |
| ------------------------- | -------------------------------------------------------------------- | ------------------------- |
| Rekisteröinti             | Agentin manifesti (nimi, versio, työkaluvaatimukset, lähde)          | DWS Agent Registry API    |
| Identiteettisidonta       | Agentti sidottu verifioituun henkilöidentiteettiin                   | KYA L1 (Shufti)           |
| Kyvykkyyskatselmointi     | MCP-työkalut katselmoidaan organisaation käytännön mukaan            | MCP Tool Approval         |
| Sandbox-sisääntulo        | Eristetty sandbox (vaihe 1–3 vuokralaistason mukaan)                 | OpenSandbox-arkkitehtuuri |
| Suoritusaikainen valvonta | Jatkuva telemetria: egress, tiedostokirjoitukset, tokenien kulutus   | KYA L4                    |
| Dynaaminen rajoitus       | Riskiprofiilin muutos → sandbox-oikeudet mukautuvat reaaliaikaisesti | KYA L5 (Shufti-webhookit) |

**Merkitys Firehorselle:** BYO mahdollistaa platform-as-a-service -mallin. Asiakkaat tuovat omat agenttinsa; DWS hallinnoi niitä. Tämä on Firehorse-toimintamallin monetisointikerros.

### H.5 Strategiset ekosysteemikumppanit (Aivot-Muisti-Keho-Kädet)

5 kumppanin ekosysteemi karttuu DWS-arkkitehtuurin tasoille:

| Kumppani             | Arkkitehtuuritaso                                          | KYA-rooli                                           | Tila                      |
| -------------------- | ---------------------------------------------------------- | --------------------------------------------------- | ------------------------- |
| NVIDIA               | Aivot (laskenta) + Kädet (Jetson-reuna) + Keho (Omniverse) | Laskentasubstraatti KYA-hallituille agenteille      | Inception-tavoite Q2 2026 |
| Siemens              | Kädet (MindSphere IoT) + Keho (digitaalinen kaksonen)      | Teollinen IoT-data KYA:n suoritusaikavalvontaan     | Xcelerator Q2 2026        |
| ABB                  | Kädet (automaatio, robotiikka, sähköverkko)                | Fyysinen toteutuskerros KYA-hallinnan alla          | Q3 2026                   |
| xAI                  | Aivot (Grok-reaaliaikatiedustelu)                          | Reaaliaikaiset signaalit multi-LLM-reitittimelle    | Tuotannossa               |
| Mistral              | Aivot/Muisti (EU-suvereeni tekoälypäättely)                | EU-suvereeni malli vaatimustenmukaisuustyökuormille | Suunniteltu Q3 2026       |
| Shufti Pro           | L1/L5 (henkilöidentiteetti + jatkuva riski)                | Identiteettiverifiointi KYA-luottamuskehykselle     | PoC Q1 2026               |
| Palantir (ehdotettu) | Aivot (AIP-orkestrointi)                                   | Yritysjakelu liitinmallin kautta                    | Yhteydenotto aloitettu    |

**Jakeluhypoteesin validointi:** Pääsy 10 000+ teollisuusasiakkaaseen (NVIDIA Inception, Siemens Xcelerator) ilman oman myyntiorganisaation rakentamista. Kumppanuusmalli on jakelustrategia — ei täydennys siihen.

### H.6 Tutkimuskontribuutio

KYA-kumppaniekosysteemi osoittaa kolme tutkimuslöydöstä:

1. **Identiteetistä suoritusaikaan -silta:** Mikään nykyinen toimittaja ei tarjoa jatkuvaa identiteettivalvontaa, joka ohjaa autonomisten agenttien sandbox-oikeuksia. Shufti-KYA-integraatio luo uuden kategorian: suorituskerroksen luottamus.

2. **Liitin-ei-kilpailija -positiointi:** Palantir-liitinmalli osoittaa, että laitteistotason hallinta voidaan tarjota infrastruktuurikerroksena olemassa oleville alustatoimittajille — kumppanuusstrategia, joka välttää suoran kilpailun vakiintuneiden toimijoiden kanssa.

3. **Kumppanuus jakelukanavana:** Yhden henkilön startup-yritykselle 5 kumppanin ekosysteemi (NVIDIA, Siemens, ABB, xAI, Mistral) tarjoaa markkinapääsyn, joka vastaa suoraa myyntiorganisaatiota — validoiden Firehorse-toimintamallin hypoteesin, että kumppanuudet voivat korvata henkilöstörekrytoinnin teollisten tekoälyyritysten alkuvaiheessa.

---

**Keskeiset kontribuutiot:**
1-14. (Katso VERSION AND AGENT HISTORY) 15. Harness Engineering ja forensiikkatelemetria — Yhdistää OpenAI:n harness engineering -kehyksen Firehorse-forensiikkaoperaatioihin; osoittaa, että EU-reguloidut toimialat vaativat oikeudellisesti pätevää harnessia (VERSION AND AGENT HISTORY, KYA-laitteistotodennus) vs Silicon Valleyn nopeusoptimointi; empiirinen validointi: pelkkä harness-parannus tuottaa 52,8%→66,5% tuloksen (malli muuttumaton); KYA-standardi laitteistotason harness-todennuksena ohjelmistotason scaffoldingin yli 16. KYA-kumppaniekosysteemi — 5-tasoinen kumppanikartoitus (Shufti IDV L1/L5, Palantir AIP -liitinmalli, BYO-agenttipolitiikka); osoittaa identiteetistä-suoritusaikaan-sillan uutena kategoriana, liitin-ei-kilpailija -positioinnin yritysjakelussa ja kumppanuus-jakelukanavana -hypoteesin yhden henkilön startup-skaalauksessa 17. Kilpailija-analyysi: Toimialakohtainen vs geneerinen AI-harness — 6-kohtainen erottautumisanalyysi 136-taidon geneerisiin kehyksiin verrattuna; token-budjettiargumentti toimialaspesifisyydelle säännellyillä toimialoilla 18. Pro gradun kaksoisversioarkkitehtuuri — v3.30.50 jäädytetty 50-sivuinen Metropolia-palautusversio + 82-sivuinen elävä dokumentti; malli tekoälyavusteiseen akateemiseen kirjoittamiseen, jossa tutkimuksen nopeus ylittää oppilaitoksen formaattirajoitukset 19. Report Engine tuotannossa — Firehorse Report -ajastin (PR #1064) ensimmäisenä cron-pohjaisena asiakastoimituksena; sulkee 3-tasoisen laskutussopimuksen silmukan toistuvilla vaatimustenmukaisuusartefakteilla; ensimmäinen päästä päähän -testi yhden-henkilön-tiimin monivuokralaisesta vaatimustenmukaisuushypoteesista 20. Mitattu harness-takaus (<125 ms Snap) — Firehorse Snap -tappoviive tuettu Firecracker MicroVM -mittaustuloksella korvaten Arctic 15 -spesifikaation; ensimmäinen oikeudellisesti pätevä harness-väite julkaistulla mittaustuloksella spesifikaation sijaan; edellytys EU AI Act -artikla 12 -lokien tutkintakelpoisuudelle 21. Perustajan→tiimin siirtymä taitoina — Ops Manager V0 -ostajalukitus (PRD v0.2 + validointiskripti) + `/investor-outreach` -taito (10+ INTRO-muistiota) koodaavat aiemmin hiljaiset perustajatoiminnat toistettaviksi DWS IQ -työnkuluiksi; laajentaa Firehorse-toimintamallin sisäisestä työkalusta perustajasta-tiimiksi-siirtymämekanismiksi 22. KYA Agentic AI Foundation -kohdennus ja dual-use-laajennus — KYA-standardi nostettu yleiseksi agenttien luottamus- ja hallintastandardiehdokkaaksi; DWS 7 määritelty empiiriseksi testialustaksi vetytalouden, suvereniteettisegmentoinnin (Aegis/Sovereign Infra/Connect) ja dual-use-toimialojen (Nokia Defence -keskustelut) validointiin yhdessä Siemens- ja NVIDIA Connect -kumppanuuskanavien kanssa 23. KYA open source -standardipolku — tutkimusohjelmaan lisätty eksplisiittinen standardointireitti (Agentic AI Foundation / Linux Foundation) sekä tila-arvio (ehdotus ja NIST-hakemus vielä lähettämättä), jolloin Artikkeli 1 siirtyy teoreettisesta viitekehyksestä avoimen spesifikaation ja referenssitoteutuksen julkaisutavoitteeksi 24. DWS Skilled -taksonomia (Rekisteri-eksplisiittinen brändiarkkitehtuuri toimintamalleille) — kolmitasoinen `Skilled / Industrial Specialist / Industry` -nimeämiskaava sovellettuna yhdenmukaisesti kolmelle ortogonaaliselle akselille (Agentit, Työnkulut, Jurisdiktiot) sekä eksplisiittinen laajennettavuuskaava tuleville akseleille; toimintamallin seuraukset johdettu (SKU-kopion kuri, ajastinkopion kuri, jurisdiktion pakkaus); "GodAgent"-brändäys poistettu käytöstä rekisterikohtaisten termien hyväksi, jotka kohdistavat Anthropicin Skills-paradigman validointiin (§14.16.4)

_Dokumentti generoitu Firehorse-toimintamallilla Claude Coden avulla_
_Viimeksi päivitetty: 22.04.2026_
_Versio: 3.37 (yhdistetty Metropolia V3Thesisin kanssa; rinnakkaispäivitys tästä eteenpäin)_
