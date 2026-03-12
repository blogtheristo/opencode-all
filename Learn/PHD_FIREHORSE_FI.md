# Pro Gradu: Firehorse-toimintamalli tekoalyavusteiseen verkkokauppaan

**Otsikko:** Tekoalynatiivi verkkokaupan hallinta: Tapaustutkimus Firehorse-mallin toteutuksesta Claude Codella
**Tekija:** Lifetime Oy Tutkimusosasto
**Paivamaara:** Tammikuu 2026
**Laitos:** DWS IQ Research
**Dokumenttityyppi:** Pro Gradu -tutkielma

***
# VERSION AND AGENT HISTORY

Version: 2.2

Sessions & Modifications:
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
  - Last Modified: 02.03.2026
  - Language: Finnish
  - Languages Available: English, Suomi
  - Last Modified: 07.03.2026
  - Publication Status: DRAFT (V1.8 — LSS-koulutusputken koordinointi: koulutusagenttilaivasto T-01–T-10, laatuporttisignaalit, resurssien välimiesosoitus)

---

## Tiivistelma

Tama tutkielma dokumentoi Firehorse-toimintamallin toteutuksen, joka on tekoalyavusteinen lahestymistapa verkkokaupan hallintaan Claude Codea kayttaen. Malli osoittaa merkittavia tehokkuusparannuksia tuotekatalogin hallinnassa, Google Merchant Center -integraatiossa ja maksukasittelyssa Revolut Businessin kautta. Esittelemme teknisen arkkitehtuurin, toiminnalliset tyonkulut ja tulevan kehityksen kohti aanipohjaista asiakasvuorovaikutusta toimialakohtaisella hiilijalanjalkililaskurilla ja EU-saantelyvaatimusten tuntemuksella.

**Avainsanat:** Tekoalytoiminnot, Verkkokaupan automaatio, Google Merchant Center, Claude Code, Firehorse-malli, EU:n tekoalysaados, Hiilijalanjalkililaskuri, Teollinen vaatimustenmukaisuus

---

## Sisallysluettelo

1. [Johdanto](#1-johdanto)
2. [Kirjallisuuskatsaus](#2-kirjallisuuskatsaus)
3. [Firehorse-toimintamalli](#3-firehorse-toimintamalli)
4. [Tekninen toteutus](#4-tekninen-toteutus)
5. [Maksuintegraatio (Revolut Business)](#5-maksuintegraatio-revolut-business)
6. [Google Merchant Center -toiminnot](#6-google-merchant-center--toiminnot)
7. [EU-saantelyvaatimustenmukaisuus](#7-eu-saantelyvaatimustenmukaisuus)
8. [Tuotesuositusmoottori](#8-tuotesuositusmoottori)
9. [Aanichatin kehityssuunnitelma](#9-aanichatin-kehityssuunnitelma)
10. [Toimialan hiilijalanjalkililaskuri](#10-toimialan-hiilijalanjalkililaskuri)
11. [Proton-tuotestrategia](#11-proton-tuotestrategia)
12. [IPR-suojaus ja liikesalaisuusstrategia](#12-ipr-suojaus-ja-liikesalaisuusstrategia)
13. [Prompt-valimuistiarkkitehtuuri tekoalyagenteille](#13-prompt-valimuistiarkkitehtuuri-tekoalyagenteille)
14. [Yrityksen monivuokralainen agenttiarkkitehtuuri](#14-yrityksen-monivuokralainen-agenttiarkkitehtuuri)
15. [Tulokset ja pohdinta](#15-tulokset-ja-pohdinta)
16. [Johtopäätökset](#16-johtopaatotkset)
17. [Lahteet](#17-lahteet)
18. [Liitteet](#18-liitteet)

---

## 1. Johdanto

### 1.1 Tausta

Yritysohjelmistomarkkinat vaativat yha enemman nopeaa tuotekehitysta, EU-saannosten noudattamista ja saumatonta asiakaskokemusta. Perinteinen verkkokauppatoiminta vaatii manuaalista puuttumista tuotepaivityksiin, syotehallintaan ja asiakastukeen. Firehorse-toimintamalli vastaa naihin haasteisiin tekoalynatiivilla automaatiolla Claude Codea kayttaen.

Lifetime Oy operoi DWS10.com-alustaa, yritysverkkokauppaa joka palvelee ilmastoalykkyyden ratkaisuja, vaatimustenmukaisuusohjelmistoja ja ammattimaisia konsultointipalveluita 16:lle EU-saannellylle toimialalle. Alusta integroituu:

- **Google Merchant Center** (Tili-ID: 8496329) tuotenakyvyydelle
- **Revolut Business** kassan ja maksukasittelyn hoitamiseen
- **Claude Code** automatisoituun kaupan yllapitoon Firehorse-mallin kautta
- **Cloudflare Pages** staattiseen hostingiin EU-tietojen sijaintikriteerein

### 1.2 Tutkimuskysymykset

1. Miten tekoalyavustajat voivat tehokkaasti hallita verkkokaupan tuotekatalogeja?
2. Mitka tehokkuusparannukset ovat saavutettavissa automatisoidulla syotehallinnalla?
3. Miten aanipohjiaisen asiakasvuorovaikutuksen tulisi kehittya suositellakseen toimialakohtaisia ratkaisuja?
4. Mitka EU:n tekoalysaadoksen vaatimukset vaikuttavat tekoalyavusteisiin myyntikanaviin?
5. Miten hiilijalanjalkililaskurit voivat ohjata tuotesuosituksia teollisille asiakkaille?

### 1.3 Laajuus

Tama tutkielma kattaa DWS10.com-kaupan toteutuksen, joka palvelee yli 30 tuotetta seuraavissa kategorioissa:

| Kategoria | Tuotteet | Hintaluokka |
|-----------|----------|-------------|
| Alustaohjelmistot | DWS IQ v5, v6 | 4 999 - 6 995 EUR |
| Firehorse-tuoteperhe | Automation, Report, CMS, Omnichannel | 499 - 4 950 EUR |
| Konsultointipalvelut | Tunti-, kuukausi-, tyopajahinnoittelu | 98 - 6 250 EUR |
| Koulutus & Valmennus | AI Koulutus, Coach, Mentor | 499 - 6 250 EUR |
| Digitaaliset tuotteet | Sanastot, verkkosivut | 0,99 - 799 EUR |

---

## 2. Kirjallisuuskatsaus

### 2.1 Tekoaly verkkokauppatoiminnoissa

Viimeaikaiset edistysaskeleet suurissa kielimalleissa (LLM) mahdollistavat luonnollisen kielen kayttoliittymat monimutkaisiin teknisiin toimintoihin. Claude Code, joka perustuu Anthropicin Claude-malliin, tarjoaa:

- Tiedostojarjestelman kasittelyn
- Koodin generoinnin ja muokkauksen
- Ulkoisten API:en integroinnin
- Monivaiheisen tehtavien orkestroinnin
- Git-versionhallinnan integraation

### 2.2 Tuotetietojen hallinta

Modernit tuotetietojen hallintajarjestelmat (PIM) vaativat:

- Keskitetyn tietovaraston (products.json)
- Monikanavaisen jakelun (Google Merchant, sosiaalinen kauppa)
- Vaatimustenmukaisuuden metatiedot (EU-saannokset)
- Dynaamiset hinnoitteluominaisuudet
- Kassalinkkien integraation

### 2.3 EU:n saantelykehys

Euroopan unionin saantelymaisema tekoalyavusteisessa kaupassa sisaltaa:

| Saannos | Voimaantulo | Vaikutus |
|---------|-------------|----------|
| EU:n tekoalysaados | Elokuu 2026 | Tekoalyjarjestelmien luokittelu, lapinakyvaatimukset |
| GDPR | Toukokuu 2018 | Tietosuoja, suostumusten hallinta |
| NIS2-direktiivi | Lokakuu 2024 | Kyberturvallisuusvaatimukset |
| Vihreita vaitteita koskeva direktiivi | 2026 | Ymparistomarkkinoinnin vaatimustenmukaisuus |
| Fit for 55 -paketti | 2030 tavoitteet | Hiilidioksidipaastovahennysvelvoitteet |
| CSRD | Tammikuu 2024 | Yritysten kestavyysraportointi |
| CBAM | Lokakuu 2023 | Hiilirajamekanismi |
| EPBD 2028 | 2028 | Rakennusten energiatehokkuus |

---

## 3. Firehorse-toimintamalli

### 3.1 Mallin yleiskatsaus

Firehorse-toimintamalli on ihmisen ja tekoalyn yhteistyokehys verkkokaupan hallintaan:

```
┌─────────────────────────────────────────────────────────────┐
│                   FIREHORSE-TOIMINNOT                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────┐     ┌─────────────┐     ┌─────────────┐       │
│   │ Ihmisen │ ──► │ Claude Code │ ──► │Jarjestelmat │       │
│   │  aikomus│     │(Tekoalyagentti)│   │ (Git, APIs) │       │
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

1. **Luonnollisen kielen kayttoliittyma**: Toiminnot ilmaistaan selkokielella
2. **Versionhallinta**: Kaikki muutokset seurataan Gitin kautta
3. **Auditointipolku**: Taysi historia EU:n tekoalysaadoksen noudattamiseen
4. **Toistettavuus**: Dokumentoidut prosessit johdonmukaisuuden varmistamiseksi
5. **Jaljitettavyys**: Paatosketjut saantelyvaatimuksia varten

### 3.3 Toiminnalliset osa-alueet

| Osa-alue | Tekoalyn kyvykkyydet | Ihmisen valvonta |
|----------|---------------------|------------------|
| Tuotehallinta | CRUD-toiminnot, syotteen generointi | Hinnoittelun hyvaksynta, sisallon tarkistus |
| Maksuintegraatio | Linkkien luonti, konfigurointi | Taloudellinen valtuutus |
| Vaatimustenmukaisuus | Dokumenttien generointi, seuranta | Juridinen hyvaksynta |
| Asiakasvuorovaikutus | Tekoalychat, suositukset | Eskaloinnin kasittely |
| Dokumentaatio | Kasikirjojen generointi, kaannokset | Tekninen tarkistus |

### 3.4 Tyonkulkuesimerkit

**Tuotepaivityksen tyonkulku:**
```
Kayttaja: "Lisaa uusi tuote X hintaan 999 EUR"
Claude Code:
  1. Paivittaa products.json-tiedoston
  2. Validoi pakolliset kentat
  3. Generoi Google Merchant -syotteen uudelleen
  4. Committaa muutokset Gitiin
  5. Lahettaa syotteen SFTP:lla
```

**Dokumentaation tyonkulku:**
```
Kayttaja: "Luo yllapitokasikirja"
Claude Code:
  1. Lukee tuotekatalogin
  2. Analysoi jarjestelman arkkitehtuurin
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
  "description": "Teollinen aivot Fit for 55 -vaatimustenmukaisuuteen. Tekoalynatiivi alusta 5 agentilla pilviymparistossasi.",
  "priceNote": "Kertakayttooonotto + 499 EUR/kk tilaus",
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

### 4.3 Syotteen generointiputki

```javascript
// generate-feed.cjs tyonkulku
const generateFeed = () => {
  // 1. Lataa products.json
  const products = require('../config/products.json');

  // 2. Validoi pakolliset kentat
  validateProducts(products); // id, mpn, price, brand

  // 3. Generoi XML g:-nimiavaruudella
  let xml = generateXMLHeader();

  for (const product of products) {
    xml += generateProductItem(product);

    // 4. Lisaa checkout_link_template Revolutille
    const checkoutLink = product.revolutLink || 'https://revolut.me/lifetimeoy';
    xml += `<g:checkout_link_template>${checkoutLink}</g:checkout_link_template>`;
  }

  // 5. Kirjoita google-products.xml
  writeFile('google-products.xml', xml);
};
```

### 4.4 Kayttoonottoputki

- **Hosting:** Cloudflare Pages (staattinen HTML)
- **Build:** Automaattinen kayttoonotto git push -komennolla
- **Valimuisti:** Edge-valimuisti suorituskyvylle
- **Vaatimustenmukaisuus:** EU:n tietojen sijainti (Suomi/Saksa)

---

## 5. Maksuintegraatio (Revolut Business)

### 5.1 Miksi Revolut Business

Lifetime Oy valitsi Revolut Businessin maksukasittelyyn seuraavien ominaisuuksien perusteella:

| Ominaisuus | Hyoty |
|------------|-------|
| Valittoomat tilitykset | Parannettu kassavirta, saman paivan saatavuus |
| Monivaluuttatuki | Tuki EUR, SEK, NOK, DKK, GBP |
| Matalat maksut | 1,0 % + 0,20 EUR per tapahtuma |
| API-integraatio | Automatisoitu tasmaaytys |
| Kassalinkit | Suora Google Merchant -tuki |
| Apple Pay / Google Pay | Modernit maksutavat |

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

| Asetus | Arvo |
|--------|------|
| Merchant ID | 8496329 |
| Kohdemaa | Suomi (FI) |
| Kielet | Englanti (ensisijainen), suomi |
| Syotemenetelma | SFTP-lataus |
| Syote-URL | https://dws10.com/feeds/google-products.xml |
| SFTP-palvelin | partnerupload.google.com:19321 |

### 6.2 Syotteen vaatimustenmukaisuusvaatimukset

| Attribuutti | Vaatimus | Toteutus |
|-------------|----------|----------|
| g:id | Uniikki tunniste | Vastaa products.json ID:ta |
| g:mpn | Valmistajan osanumero | Muoto: KATEGORIA-TYYPPI-VUOSI |
| g:brand | Tuotemerkki | "Lifetime" tai "Firehorse" |
| g:price | Hinta valuutalla | EUR-muoto |
| g:availability | Varastotilanne | Aina "in_stock" palveluille |
| g:checkout_link_template | Maksu-URL | Revolut-kassalinkki |
| g:condition | Tuotteen kunto | Aina "new" |

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

| Ongelma | Juurisyy | Ratkaisu |
|---------|----------|----------|
| Verkkotunnus ei tasmaa | URL:t osoittavat lifetime.fi:hin | Paivitetty kaikki URL:t dws10.com:iin |
| Duplikaattituotteet | ID ei tasmaa Merchant Centeriin | Yhdenmukaistettiin ID:t products.json:ssa |
| identifier_exists-virhe | Asetettu false kun MPN+brand on | Poistettu kentta kokonaan |
| Kuva-URL-virheet | Kaksinkertaiset kauttaviivat poluissa | Korjattu polkujen generointi |
| Puuttuvat kassalinkit | Maksu-URL:a ei konfiguroitu | Lisattiin Revolut-linkit |

---

## 7. EU-saantelyvaatimustenmukaisuus

### 7.1 EU:n tekoalysaadoksen vaatimukset (elokuu 2026)

EU:n tekoalysaados luokittelee tekoalyjarjestelmat riskitason mukaan. Aanichat- ja suositusjärjestelmamme kuuluu **Rajoitetun riskin** kategoriaan, joka vaatii:

1. **Lapinaakyvyys:** Ilmoita kayttajille etta he ovat vuorovaikutuksessa tekoalyn kanssa
2. **Ihmisen valvonta:** Eskaloinnin polku ihmistukeen
3. **Dokumentaatio:** Jarjestelman kyvykkyydet ja rajoitukset
4. **Tietosuoja:** GDPR-vaatimustenmukainen tietojen kasittely
5. **Paattelyketju:** Jaljitettavat paatosketjut

### 7.2 Vaatimustenmukaisuuden kartoitus tuotteittain

| Saannos | Asiaankuuluvat tuotteet | Asiakkaan tarve |
|---------|------------------------|-----------------|
| **EU:n tekoalysaados** | DWS IQ v6, Conversational Agent | Tekoalyjarjestelman dokumentointi, lapinaakyvyys |
| **Fit for 55** | DWS IQ Platform, Firehorse Report | Hiiliraportointi, ETS-vaatimustenmukaisuus |
| **CSRD** | Climate Reporting Bundle | Kestavyysraportointi |
| **GDPR** | Protonmail Implementation | Tietosuoja, salaus |
| **NIS2** | Protonmail, Firehorse CMS | Kyberturvallisuusvaatimukset |
| **Vihreat vaitteet** | Firehorse Omnichannel | Ymparistomarkkinoinnin vaatimustenmukaisuus |
| **EPBD 2028** | Firehorse Automation | Rakennusten energiatehokkuus |
| **CBAM** | DWS IQ, Consulting Fit55 | Hiilirajamekanismi |

### 7.3 Artikla 12 -vaatimustenmukaisuus (automaattinen lokitus)

Firehorse-toimintamalli varmistaa EU:n tekoalysaadoksen artikla 12 -vaatimustenmukaisuuden:

- **Git-versionhallinta:** Kaikki muutokset lokitetaan aikaleimoin
- **Commit-historia:** Paatoosten alkupera dokumentoitu
- **Syotteen generointilokit:** Kasittelyrekisterit yllaapidetaan
- **Auditointipolku:** Taysi historia saantelyyn arviointiin

### 7.4 Vaatimustenmukaisuusilmoituksen malli

```
┌─────────────────────────────────────────────────────────────┐
│ VAATIMUSTENMUKAISUUSILMOITUS (EU:n tekoalysaados artikla 52)│
├─────────────────────────────────────────────────────────────┤
│ Tama keskustelu toimii tekoalyn avulla. Olet                │
│ vuorovaikutuksessa automatisoidun jarjestelman kanssa.      │
│                                                              │
│ Profiiliisi sovellettavat saannokset:                       │
│ • EU ETS -direktiivi - Paastokaupan vaatimustenmukaisuus   │
│ • CSRD - Kestavyysraportointivaatimukset                   │
│ • EU:n tekoalysaados - Tekoalyjarjestelman dokumentointi   │
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

### 8.2 Toimialan tunnistussaannot

| Toimialaindikaattori | Tunnistettu sektori | Ensisijaiset tuotteet |
|---------------------|---------------------|----------------------|
| "sementti", "betoni" | Sementti | DWS IQ v6, Climate Bundle |
| "teras", "metalli" | Teras | DWS IQ v6, Firehorse Automation |
| "kemikaali", "petrokemia" | Kemikaalit | Firehorse Report, Consulting |
| "autoteollisuus", "ajoneuvo" | Autoteollisuus | DWS IQ v6, Expert Advisory |
| "merenkulku", "laivaliikenne" | Merenkulku | Firehorse Automation, Report |
| "ilmailu", "lentoyhtioo" | Ilmailu | DWS IQ v6, Consulting Fit55 |
| "rakennus", "rakentaminen" | Rakennukset | Firehorse CMS, Automation |
| "maatalous", "viljely" | Maatalous | Climate Bundle, Advisory |

### 8.3 Saannoksen laukaisumatriisi

```
┌──────────────┬──────────────┬───────────────────────┐
│ Saannos      │ Laukaisin    │ Suositeltu tuote      │
├──────────────┼──────────────┼───────────────────────┤
│ EU AI Act    │ Tekoalyjarj. │ DWS IQ, Conv. Agent   │
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

## 9. Aanichatin kehityssuunnitelma

### 9.1 Visio

Muunna asiakasvuorovaikutukset tekstipohjaisesta aanipohjaiseksi alykkkailla tuotesuosituksilla kayttaen toimialakohtaisia hiilijalanjalkililaskureita ja EU-saantelytuntemusta.

### 9.2 Vaihe 1: Perusta (Q1 2026)

**Tavoite:** Perus-aanichat tuotekatalogin tuntemuksella

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
- EU:n tekoalysaadoksen lapinaakyvyysilmoitus

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

Aanichat: "Sementtituotannon toimialakeskiarvojen perusteella arvioitu
           vuotuinen paastosi on noin 450 000 tonnia CO2.

           EU:n paastokauppajarjestelman mukaan tarvitset varmennetun
           raportoinnin vuoteen 2026 mennessa. Suosittelen:

           1. DWS IQ Platform v6 hintaan 4 999 EUR - Automatisoitu ETS-raportointi
           2. Firehorse Automation hintaan 4 950 EUR - Kosketukseton vaatimustenmukaisuus

           Kokonaisinvestointi: 9 949 EUR ja 90 % ajansaasto raportoinnissa.

           Haluatko minun selittavan EU:n tekoalysaadoksen vaatimukset
           naille tekoalykayttoisille vaatimustenmukaisuustyokaluille?"
```

### 9.4 Vaihe 3: EU-saantelytuntemus (Q3 2026)

**Tavoite:** Ennakoivat saantelyvaatimustenmukaisuussuositukset

**Ominaisuudet:**
- Reaaliaikainen saantelyseuranta
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
├── Tietojen kasittelykaytannot
└── Tekoalyjarjestelman kaytto

→ Automatisoitu saannoskartoitus
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

| Vaihe | Kvartaali | Ominaisuudet | EU-vaatimustenmukaisuus |
|-------|-----------|--------------|------------------------|
| 1 | Q1 2026 | Perus-aanichat | Tekoalysaadoksen lapinaakyvyys |
| 2 | Q2 2026 | Hiilijalanjalkililaskuri | Fit for 55 -tuki |
| 3 | Q3 2026 | Saantelymoottori | Tayssi vaatimustenmukaisuuskartoitus |
| 4 | Q4 2026 | Kumppaniekosysteemi | Laajennetut tarjoamat |

---

## 10. Toimialan hiilijalanjalkililaskuri

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

| Toimiala | Keskim. tCO2e/M€ liikevaihto | Paapaastolahde |
|----------|------------------------------|----------------|
| Teras | 850 | Prosessipaastot (Scope 1) |
| Sementti | 900 | Kalsinointiprosessi |
| Kemikaalit | 400 | Energia + raaka-aineet |
| Autoteollisuus | 150 | Valmistus + toimitusketju |
| Merenkulku | 300 | Polttoaineenkulutus |
| Ilmailu | 500 | Lentopolttoaineen poltto |
| Rakennukset | 100 | Energiatehokkuus |
| Maatalous | 250 | Maankaytto, kotielaimet |
| Sellu & Paperi | 200 | Prosessienergia |
| Lasi | 350 | Sulatusprosessi |
| Keramiikka | 300 | Uunitoiminnot |
| Tekstiilit | 180 | Toimitusketju |
| Elintarvikkeet | 120 | Kasittely + kylmaketju |
| Elektroniikka | 80 | Valmistus + kayttovaihe |
| Laakkeet | 60 | Kontrolloidut prosessit |
| Datakeskukset | 150 | Sahkonkulutus |

### 10.3 Tuotekartoitus hiilijprofiilin mukaan

| Hiilijalanjalprofiili | Paastoalue | Suositellut tuotteet |
|----------------------|------------|---------------------|
| Erittain korkea | >100 000 tCO2e | DWS IQ v6, Firehorse Automation, Expert Advisory |
| Korkea | 10 000-100 000 tCO2e | DWS IQ v6, Firehorse Report, Climate Bundle |
| Keskitaso | 1 000-10 000 tCO2e | Climate Bundle, Firehorse Report |
| Matala | <1 000 tCO2e | Firehorse Report, Consulting Hourly |

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

| Komponentti | Kuvaus |
|-------------|--------|
| Proton Mail | Paasta paahan salattu sahkoposti |
| Proton Drive | Salattu pilvitallennustila |
| Proton Pass | Nollatietosalasanahallinta |
| Proton VPN | Turvallinen verkkoyhteys |
| Verkkotunnuksen asetus | Oman verkkotunnuksen konfigurointi |
| Migraatio | Sahkopostin siirtoapu |

### 11.3 Vaatimustenmukaisuuskattavuus

| Saannos | Protonin vaatimustenmukaisuus |
|---------|------------------------------|
| GDPR artikla 32 | Tekniset turvatoimet |
| NIS2 | Kryptografiset kontrollit |
| EU:n tekoalysaados | Turvallinen tekoalyviestinta |
| Sveitsin FADP | Lisakyksityisyydensuoja |

### 11.4 Suosituslaukaisimet

Aanichat suosittelee Proton-toteutusta kun havaitaan:

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
│ • EU:n tekoalysaados - Turvallinen tekoalyviestinta       │
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

| Taso | Mekanismi | Laajuus | Oikeudellinen perusta |
|------|-----------|---------|----------------------|
| **Taso 1: Julkinen** | Vapaa jakelu | Teaser, FCD-konsepti, markkinakoko | — |
| **Taso 2: NDA vaaditaan** | Salassapitosopimus | LWM-arkkitehtuuri, tietograafin yleiskuva, BYOC-logiikka | EU:n liikesalaisuusdirektiivi 2016/943 |
| **Taso 3A: Patentti** | Patenttisuoja | CIDM-menetelma, kausaalinen paattelyalgoritmi | PRH (Suomi), EPO, PCT |
| **Taso 3B: Liikesalaisuus** | Sisaiset kontrollit | Tietograafin rakenne (10 000+ solmua), painotukset, koulutusdatan | EU 2016/943, Liikesalaisuuslaki 595/2018 |

### 12.2 NDA-portti tekniselle tiedonjakamiselle

Ennen teknista syvennystä kumppanien, sijoittajien tai asiakkaiden kanssa vastaanottavan osapuolen on allekirjoitettava Lifetime Oy:n NDA (EU:n liikesalaisuusdirektiivin 2016/943 mukainen). NDA kattaa:

- **LWM-arkkitehtuuri** — komponenttikaavio, tietovirrat, kasittelyputki
- **Tietograafin rakenne** — solmutaksonomia, reunatyypit, suhdenmalli
- **BYOC (Bring Your Own Cloud) -logiikka** — pilvikaytonotto, vuokralaisieristys, tietojen sijainti
- **Agenttien orkestrointi** — MCP-palvelimen konfiguraatio, koordinointiprotokollat
- **Integraatioarkkitehtuuri** — ERP-liittimet (SAP, IFS, Dynamics)

Julkisia/markkinointimateriaaleja (taso 1) voidaan jakaa vapaasti ilman NDA:ta: tuote-esittelyt, FCD-konseptin yleiskatsaus, markkinakoko ja ylatasonarkkitehtuurikaaviot.

### 12.3 Patenttistrategia

Patentoitavat innovaatiot haetaan PRH:n (Patentti- ja rekisterihallitus) kautta kansainvalista PCT-laajennusta hyodyntaen:

| Prioriteetti | Innovaatio | Hakupolku | Tila |
|-------------|-----------|-----------|------|
| P1 | CIDM — Ilmastoalykas paatoksenteko | PRH → PCT → EPO/USPTO | Patenttihakemus vireilla |
| P2 | Kausaalinen paattely saantelyriskille | PRH → PCT | Ennakkoselvitys Q2 2026 |
| P3 | LWM:n temporaalinen latenttitila | PRH → PCT | Arviointi Q3 2026 |

**Kriittinen saanto:** Patenttihakemukset ON jatettava ennen menetelman julkista paljastamista. NDA:lla suojatut paljastukset eivat tuhoa patentoitavuutta.

### 12.4 Liikesalaisuus tietograafin ensisijaisena suojana

Tietograafille (10 000+ solmua) liikesalaisuussuoja on strategisesti parempi vaihtoehto kuin patentti:

| Tekija | Patentti | Liikesalaisuus |
|--------|---------|----------------|
| Kesto | 20 vuotta (sitten julkinen) | Rajoittamaton |
| Paljastusvelvoite | Menetelma julkaistava kokonaan | Ei paljastusvelvoitetta |
| Kilpailijan tietoisuus | Tietaa tarkalleen mita suojataan | Ei voi tietaa mita kopioida |
| Kustannus | 120k–200k EUR (3 patenttia, EU+US) | Hallinnolliset kulut |

Liikesalaisuusasema EU:n direktiivin 2016/943 mukaan edellyttaa: (1) tieto on salaista, (2) silla on kaupallista arvoa salaisuutensa vuoksi ja (3) kohtuullisia toimenpiteita on toteutettu sen pitamiseksi salassa. Lifetime Oy yllapitaa paasyvalvontaa, salausta, tyontekijoiden salassapitosopimuksia ja sisaisia luokittelurekistereita.

### 12.5 Vaikutukset Firehorse-toimintaan

IPR-kehys vaikuttaa suoraan Firehorse-verkkokauppatoimintaan:

- **Tuotekuvaukset** dws10.com:ssa kertovat *mita* alusta tekee (taso 1), eivat koskaan *miten* se toimii
- **Sijoittajapitchit** jakavat ongelman/ratkaisun/markkinan vapaasti; arkkitehtuuriyksityiskohdat vaativat NDA:n
- **Konferenssiesitykset** kasittelevat EU:n vaatimustenmukaisuuspuutteita, eivat algoritmien yksityiskohtia
- **Asiakasdemonstraatiot** toimivat NDA:n alla vesileimattuja materiaaleja kayttaen
- **Kaupan tuotesivut** viittaavat ominaisuuksiin, eivat toteutuksen yksityiskohtiin

---

## 13. Prompt-valimuistiarkkitehtuuri tekoalyagenteille

### 13.1 Suunnitteluperiaate: valimuisti ratkaisee kaiken

Firehorse-toimintamalli nojaa pitkakestoisiin tekoalyagenttisessioihin (Claude Code) kaupan hallintaan, tuotepaivityksiin ja vaatimustenmukaisuusautomaatioon. Prompt-valimuisti (prompt caching) on perustava suunnitteluperiaate, joka tekee naista sessioista taloudellisesti kannattavia.

**Lahde:** Thariq Shihipar (Anthropic), "Lessons from Building Claude Code: Prompt Caching Is Everything" (2026).

**Ydinnakyma:** Prompt-valimuisti kayttaa uudelleen laskentatuloksia aiemmista API-kierroksista etuliitesovituksen (prefix matching) avulla. API tallentaa valimuistiin kaiken pyynton alusta kunkin `cache_control`-katkaisupisteen kohdalle. Korkea valimuistin osumisprosentti vahentaa kustannuksia ja viivetta merkittavasti.

### 13.2 Jarjestelmapromptin asettelu valimuistia varten

Promptin sisallon jarjestys on ratkaiseva — staattinen sisalto ensin, dynaaminen viimeisena:

```
1. Staattinen jjarjestelma prompti & tyokalut  (globaalisti valimuistissa)
2. CLAUDE.md / projektikonfiguraatio            (valimuistissa projektin sisalla)
3. Sessiokonteksti                               (valimuistissa session sisalla)
4. Keskusteluviestit                              (uusia joka kierroksella)
```

**Herkkyysvaroitus:** Valimuistijaarjestys rikkoutuu kun:
- Aikaleimat sijoitetaan staattiseen jarjestelmapromptiin
- Tyokalumaaritelmat sekoitetaan ei-deterministisesti
- Tyokaluparametreja paivitetaan kesken session (esim. kaytettavissa olevat agentit)

### 13.3 Kuusi suunnittelusaantoa agenttien valimuistille

| Saanto | Periaate | Toteutus |
|--------|----------|----------|
| **1. Staattinen ensin, dynaaminen viimeisena** | Maksimoi jaettu etuliite sessioiden valilla | Jarjestelmaprompt → CLAUDE.md → sessiokonteksti → viestit |
| **2. Kayta jarjestelmaviesteja paivityksiin** | Ala muokkaa staattista promptia kesken session | Vaali ajan, tiedostomuutosten ja tilasiirtymien valittaminen `<system-reminder>`-tageina |
| **3. Ala vaihda mallia kesken session** | Prompt-valimuistit ovat mallikohtaisia | Haiku-vaihto 100k tokenin kohdalla maksaa enemman kuin Opus-jatkaminen (valimuistin uudelleenrakennus) |
| **4. Ala lisaa/poista tyokaluja kesken session** | Tyokalut ovat osa valimuistietuliitetta | Kayta tyokalutynkia `defer_loading: true` -asetuksella; loyda ToolSearchilla |
| **5. Suunnittele ominaisuudet valimuistin ehdoilla** | Tilasiirtymat tyokaluilla, ei tyokalujoukon vaihdoilla | Suunnittelutila = jarjestelmaaviesti + ExitPlanMode-tyokalu, ei tyokalujoukon vaihtaminen |
| **6. Haarautumisoperaatiot jakavat ylaviitteen** | Tiivistys/yhteenvedot on kaytettava valimuistia uudelleen | Kayta identtista jarjestelmaapromptia, tyokaluja ja viestihistoriaa haarautuneissa pyynnissa |

### 13.4 Tiivistys: valimuistiturvallinen kontekstin haarautuminen

Kun agenttisessiot lahestyvat konteksti-ikkunan rajaa, tiivistyksen (compaction) on sailytettava valimuisti:

```
VAARIN: Uusi API-kutsu eri jarjestelmapromptilla + ei tyokaluja
        → Taysi valimuistihuti, kallista

OIKEIN: Sama jarjestelmaprompt + samat tyokalut + ylatasoan viestihistoria
        + tiivistysprompt lisattyna uutena kayttajaviestina
        → Valimuistiosuma ylatasoan etuliitteelle, vain uudet tokenit ovat prompti
```

### 13.5 Toiminnallinen vaikutus Firehorseen

DWS10.com-kauppatoiminnoissa nama valimuistiperiaatteet tarkoittavat:

| Toiminto | Valimuistivaikutus | Kaytanto |
|----------|-------------------|----------|
| Tuotekatalogin paivitykset | Pitka sessio, paljon tiedostomuokkauksia | Pida sama malli koko session ajan |
| Syotteen generointi | Tyokalupainotteinen tyonkulku | Kaikki tyokalut maaritelty session alussa |
| Vaatimustenmukaisuustarkistus | Kontekstipainotteinen (saannokset) | CLAUDE.md valimuistissa projektikonfiguraationa |
| Monitiedostosynkronointi (kaksoiskansio) | Perakkaisia riippuvia operaatioita | Ketjuta yhdessa sessiossa, ala haarauta |

**Seuranta:** Valimuistin osumisprosenttia kasitellaan kayttoaikamittarina. Osumien lasku kaynnistaa tutkimuksen — se osoittaa jarjestelmapromptin muutoksen, tyokalumaaritysten siirtyman tai mallinvaihdon joka vaatii korjauksen.

### 13.6 Kustannus- ja viivevaikutukset

| Skenaario | Osumisprosentti | Suhteellinen kustannus | Viive |
|-----------|----------------|----------------------|-------|
| Optimoitu (staattinen etuliite) | >90 % | 1x (perustaso) | Matala |
| Tyokalujoukon muutokset kesken session | ~50 % | ~2x | Korkea |
| Mallinvaihto kesken session | 0 % (taysi uudelleenrakennus) | ~3-5x | Erittain korkea |
| Tiivistys ilman ylatasoan etuliitetta | 0 % | ~3x | Korkea |

Nama taloudelliset realiteetit ovat kriittisia Firehorsen tekoalyavusteiselle kauppatoiminnalle, jossa sessiot kasittelevat rutiininomaisesti yli 30 tuotetta useissa tiedostoissa.

---

## 14. Yrityksen monivuokralainen agenttiarkkitehtuuri

### 14.1 Toimialakohtainen avoimen LLM:n valinta

Yksikään avoin LLM ei ole optimaalinen kaikille 16 EU-toimialalle, joita DWS IQ palvelee. Jokaisella toimialavertikaalilla on oma sääntelykieli, toimialaosaamisvaatimukset ja rakenteellisen tulosteen tarpeet. `AgentConfig.model`-kenttä on jo agenttikohtainen, joten jokainen konkreettinen agentti voidaan konfiguroida eri koulutetulla Lifetime World Model (LWM) -mallilla + avoimella LLM:llä, jatkuvalla vertailuarvioinnilla.

**Avoimen LLM:n ehdokkaat toimialaklustereittain:**

| Toimialaklusteri | Ehdokkaat | Keskeinen toimialavaatimus |
|-----------------|-----------|--------------------------|
| Rakentaminen, Kiinteistöt | Llama 3.3 70B, Qwen 2.5 72B, Mistral Large | EN 15978 elinkaarivaiheet, pohjoismaiset rakennusmääräykset, EPBD |
| Energia, Teräs & Metallit, Sementti | Llama 3.3, DeepSeek-V3, Mixtral 8x22B | ETS-päästöoikeuslaskelmat, prosessipäästöt, CBAM |
| Valmistus, Kemianteollisuus | Qwen 2.5 72B, Llama 3.3 | CBAM-tuoteluokittelu, osaluetteloanalyysi, REACH |
| Logistiikka, Merenkulku, Ilmailu | Mistral Large, Llama 3.3, Gemma 2 27B | FuelEU Maritime, CORSIA, reittioptimiointi |
| Maatalous, Elintarvikkeet | Llama 3.3, Gemma 2, Command R+ | LULUCF, Scope 3 toimitusketju, pakkauselinkaari |
| Rahoitus, Julkinen sektori | Mistral Large (EU-isännöity), Llama 3.3 | SFDR, EU-taksonomia, kaksoisolennaisuus, GPP |
| Terveydenhuolto, Tekstiilit | Gemma 2 (EU-isännöity), Qwen 2.5 | Digitaalinen tuotepassi, lääketeollisuuden toimitusketju |

**Valintakriteerit:** toimialaosaamisen syvyys, monikielisyys, rakenteellisen tulosteen luotettavuus, konteksti-ikkuna (128k+), päättelynopeus, EU-tietojen sijainti ja kaupallinen lisenssi.

**Jatkuva vertailuarviointiprosessi:** Jokainen toimiala-agentti suorittaa viikoittain automaattiset vaatimustenmukaisuuskehotteet (EN 15978, CSRD ESRS E1, CBAM-ilmoitukset) nykyistä mallia ja 2-3 vaihtoehtoa vastaan. Jos vaihtoehto saa johdonmukaisesti korkeammat pisteet tarkkuudessa ja rakenteellisessa tulosteessa, malli merkitään tarkistettavaksi ja mahdollisesti vaihdettavaksi.

### 14.2 Tuo omat agentit (BYOA) -arkkitehtuuri

Yritysasiakkaat tuovat omat tekoälyagenttinsa työskentelemään DWS IQ:ssa. Tässä osiossa käytetään NCC:tä (pohjoismainen rakennusyhtiö) havainnollistavana tapauksena.

**NCC:n agenttiekosysteemi:**

| Agenttilähde | Määrä | Esimerkit |
|-------------|-------|----------|
| **NCC:n sisäiset** | 7 | Hankinta, Turvallisuus, BIM, Kestävyys, Kustannusarvio, Laatu, Projektisuunnittelu |
| **Urakoitsijoiden agentit** | 14 | LVI-urakoitsija, Sähkö, Betonitoimittaja, Terästoimittaja, Ikkunavalmistaja, Eristys jne. |
| **DWS IQ -alusta** | 3 | Vaatimustenmukaisuuslaskenta, Firehorse-raportti, Hiililaskuri |
| **Yhteensä** | 24 | Kaikki yhdistetty A2A + MCP -protokollilla |

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

**Miksi 16 toimialaa tekee LWM:stä vahvemman:** Jokainen alustalle lisätty toimiala tekee jokaisen olemassa olevan toimialan LWM:stä älykkäämmän anonymisoitujen vaatimustenmukaisuuskaavojen ristioppimisen kautta. Sementinvalmistuksessa todistettu hiilidioksidipäästöjen vähennystekniikka tuottaa siirrettävää tietoa rakentamiseen. Valmistuksen toimitusketjun Scope 3 -agentit siirtyvät elintarviketeollisuuteen. 16. toimialan asiakas hyötyy kaikkien 15 toimialan kertyneestä älykkyydestä — luoden vallihaudan, jota yksittäisen toimialan kilpailijat eivät voi replikoida.

### 14.3 Agent Orchestration Studio: Graafinen työnkulkurakentaja

Jotta yritysasiakkaat voivat rakentaa yhteyksiä 24+ agentin välille, alusta tarjoaa visuaalisen työnkulkurakentajan.

**Työkalujen arviointi:**

| Työkalu | Lisenssi | MCP-tuki | A2A-tuki | EU-isännöinti | Paras käyttö |
|---------|---------|----------|---------|--------------|-------------|
| **Langflow** | Apache 2.0 | Natiivi (client + server) | Mukautetuilla solmuilla | Kyllä | Agenttiorkestrointi, LLM-työnkulut |
| **n8n** | Fair Code | Yhteisösolmuilla | HTTP-solmuilla | Kyllä | ERP/BIM-liittimet, dataputket |
| **React Flow** | MIT | Mukautettu | Mukautettu | N/A (kirjasto) | Mukautettu visuaalinen käyttöliittymä |
| **Flowise** | Apache 2.0 | Osittainen | Ei | Kyllä | Chatbot RAG -työnkulut |
| **Node-RED** | Apache 2.0 | FlowFusen kautta | HTTP | Kyllä | IoT/reuna, teollinen automaatio |
| **Temporal UI** | MIT | Ei | Ei | Kyllä | Työnkulun suorituksen seuranta |

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

| # | Puute | Korjaus | Tiedosto |
|---|-------|---------|----------|
| 1 | Yksittäiskutsu-LLM | Havainnoi-ajattele-toimi -silmukka (`runLoop()`) | `base.agent.ts` |
| 2 | Ei työkalujen käyttöä | Työkaluajoympäristö JSON Schemalla + 4 sisäänrak. työkalua | `tools.ts` |
| 3 | Kovakoodattu Groq-kutsu | Monituottaja-asiakas (Anthropic > Groq > OpenAI) | `llm-client.ts` |
| 4 | Ei agenttiviestintää | Delegointi + syvyysseuranta + löytämis-API | `index.ts` |
| 5 | MCP oli tyhjä lupaus | JSON-RPC 2.0 -palvelin osoitteessa `/mcp` | `agent-server.ts` |
| 6 | Vain Express | Tapahtumaväylä pub/sub + Redis Streams | `event-bus.ts` |

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

*Sessio: claude/sandbox-agents-opensandbox-HatfC | Päiväys: 01.03.2026*

#### 14.6.1 Vaihe 1.5 — OpenSandbox Acer Veriton GN100 -laitteella

Agent Foundry sai uuden eristysvaiheen demo-tason SDK-hiekkalaatikon (Vaihe 1) ja Cloud Run:n (Vaihe 2) väliin: **OpenSandbox** (https://github.com/alibaba/OpenSandbox) **Acer Veriton GN100** -reunasolmussa (120 GiB RAM, 20 ydintä, Helsinki Lab).

| Vaihe | Menetelmä | Kustannus | Käyttötapaus |
|-------|-----------|-----------|-------------|
| 1 | SDK-hiekkalaatikko (bubblewrap/seatbelt) | €0 | Demo, yksiasiakkuus |
| **1.5** | **OpenSandbox Docker (Veriton GN100)** | **€0 HW** | **EU-ilmarakoinen, sisäinen pilotti** |
| 2 | Cloud Run hetkelliskontteja (europe-north1) | ~€20-50/kk | Maksava moniasiakkuus |
| 3 | Pysyvät kontit (gVisor) | €200+/kk | Skaalautuminen |

Aktivointi: `SANDBOX_STAGE=opensandbox`. Kuusi MCP-työkalua (`sandbox_create`, `sandbox_execute`, `sandbox_file_read`, `sandbox_file_write`, `sandbox_destroy`, `sandbox_ping`) paljastavat sen `/sandbox/*`-päätepisteissä MCP Hubissa.

**Vaikutus Firehorse-toimintamalliin:** Vaihe 1.5 mahdollistaa EU-ilmarakoisen agentin suorituksen säännelyillä toimialoilla (puolustus, terveydenhuolto, kriittinen infrastruktuuri) — asiakkaille, joiden data ei saa koskaan poistua paikan päällä sijaitsevasta laitteistosta. Acer Veriton GN100 on ensimmäinen fyysinen Lifetime Fleet -solmu, joka täyttää tämän ominaisuuden.

#### 14.6.2 EMPO²: LWM-muistiarkkitehtuurin akateeminen perusta

Artikkeli *"Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization"* (EMPO², arXiv:2602.23008, helmikuu 2026) tarjoaa akateemisen validoinnin DWS Lifetime World Model -hybridimuistisuunnittelulle.

EMPO² yhdistää:
- **Parametrinen muisti** (RL-päivitykset mallin painoihin) — vastaa DWS LWM:n hienosäätöä (QLoRA, Acer Veriton GN100)
- **Ei-parametrinen muisti** (haku muistipuskurista) — vastaa DWS RAG:ta EU-säädöksistä + yritysdata (pgvector)

Tulokset: 128,6 % parannus GRPO-algoritmiin nähden ScienceWorldissa, 11,3 % WebShopissa. Keskeinen havainto: *muistilla koulutetut mallit ovat vahvoja myös ilman muistia päättelyaikana* — validoiden DWS-strategian asteittain upottaa domaintieto LWM-painoihin samalla kun RAG toimii varamekanismina.

#### 14.6.3 Lifetime Scope Signals LWM-koulutuksen koordinointiin

*Sessio: claude/pedantic-easley | Päivämäärä: 07.03.2026*

Lifetime Scope Signals (LSS) -protokolla — alun perin suunniteltu deterministiseen moniagenttikehityskoordinointiin (katso Metropolia-tutkielma osio 2.5.2) — laajenee luonnollisesti ML-putkien orkestrointiin. Sen sijaan, että otettaisiin käyttöön dedikoitu ML-työnkulkumoottori (Kubeflow, Airflow), LWM-koulutusputkea koordinoidaan samoilla neljällä signaalityypillä: READY, COMPLETE, ERROR, BLOCKED.

**Koulutusagenttilaivasto (T-01 – T-10):**

| Agentti ID | Nimi | Rooli | Emittoi | Kuuntelee |
|------------|------|-------|---------|-----------|
| T-01 | InfraVerifier | Validoi CUDA/PyTorch GN-100 -solmuissa | `COMPLETE:infra-verified` | (ei mitään — aloituspiste) |
| T-02 | ModelFetcher | Lataa perusmalli jaettuun tallennustilaan | `READY:base-model` | `T-01:COMPLETE:infra-verified` |
| T-03 | CurriculumAgent | Claude API:n opetussuunnitelma per vertikaali | `READY:curriculum:{vertical}` | `T-02:READY:base-model` |
| T-04 | DataSynthAgent | Generoi 2000+ synteettistä esimerkkiä | `READY:dataset:{vertical}` | `T-03:READY:curriculum:{vertical}` |
| T-05 | TrainingAgent | QLoRA-hienosäätö osoitetulla solmulla | `READY:lora-weights:{vertical}` | `T-04:READY:dataset:{vertical}`, `T-06:READY:node-slot` |
| T-06 | ResourceArbiter | Allokoi GN-100 -solmupaikat (2 tokenia) | `READY:node-slot` | `T-05:READY:lora-weights:*` (vapauttaa paikan) |
| T-07 | EvalAgent | Claude-as-judge, laatuportti ≥7.0 | `READY:eval-pass:{vertical}` / `ERROR:eval-fail:{vertical}` | `T-05:READY:lora-weights:{vertical}` |
| T-08 | MergeAgent | Yhdistä LoRA-adapteri perusmalliin | `READY:merged-model:{vertical}` | `T-07:READY:eval-pass:{vertical}` |
| T-09 | DeployAgent | Julkaise päättelyrajapinta | `COMPLETE:lwm-deployed:{vertical}` | `T-08:READY:merged-model:{vertical}` |
| T-10 | PipelineOrchestrator | Monitoroi kaikkia vertikaaleja | `COMPLETE:lwm-all-verticals` | Kaikki `T-09:COMPLETE:*` |

`{vertical}`-parametrisoitu virstanpylväs mahdollistaa toimialakohtaisen putken instanssoinnin — ainoa protokollalaajennus LSS v1.0 -peusskeemaan.

**Keskeiset mekanismit:**

1. **Laatuporttisignaalit** — T-07 emittoi `READY:eval-pass:{vertical}` vain kun Claude-as-judge-pisteet ≥7.0; epäonnistuminen emittoi `ERROR:eval-fail:{vertical}`, laukaiseen opetussuunnitelman uudelleengeneroinnin (maks. 3 yritystä → `BLOCKED` → ihmisen eskalaatio). Tämä kuvautuu EMPO²:n off-policy-päivitysmalliin (osio 14.6.2).

2. **Resurssien välimiesosoitus** — T-06 hallinnoi kahta solmupaikkatokenia (yksi per GN-100). Koulutusagentit saavat tokenin ennen aloitusta; vapauttavat valmistuessa. Saapumisjärjestys signaaliemission mukaan.

3. **Fan-Out-rinnakkaisuus** — Opetussuunnitelman generointi (T-03) ja datasynteesi (T-04) suoritetaan kaikissa 16 vertikaalissa samanaikaisesti (CPU-sidonnaisia, ei GPU-rajoitetta), eliminoiden GPU:n joutoajan.

**Vaikutus Firehorse-toimintamalliin:** Koulutuskoordinointi validoi LSS:n yleiskäyttöisenä deterministisenä koordinointimekanismina — sama protokolla orkestroi sekä ohjelmistokehitysagentteja (Liite F) että ML-koulutusputkia, vähentäen operatiivista monimutkaisuutta Firehorse-asiakkaille, jotka tarvitsevat molempia kyvykkyyksiä.

---

### 14.7 Toimitusjohtajan automaatioagenttiryhmä

*Käyttöönotettu: 24.02.2026 | Commit: claude/ai-agent-orchestration-t89Ig*

| Agentti | Laukaisu | Rooli |
|---------|---------|------|
| **Captain Pre-Briefing** | 07:30 Helsinki, ma–pe | CRM-haku → puheenvuorot → sähköposti |
| **LinkedIn-julkaisuajastin** | 08:00 Helsinki, ma–pe | Sisältökalenteri → luonnos → toimitusjohtajan hyväksyntä |
| **EU-sääntelymonitori** | 05:30 Helsinki, ma–pe | RSS-haku → luokittelu → vakavuuspisteytys → syöte ajastimeen |

EU-sääntelymonitori luo suljetun palautesilmukan: hakee EU-komission / EUR-Lexin / Carbon Pulsen / Euractiv-uutiset, luokittelee sääntelyn mukaan (CBAM, CSRD, Fit for 55, EPBD, EU AI Act, ETS) ja syöttää hälytykset LinkedIn-sisältöideoina — varmistaen, että toimitusjohtajan viestintä pysyy linjassa aktiivisen sääntelykehityksen kanssa.

**Vaikutus Firehorse-toimintamalliin:** Nämä agentit osoittavat mallin liikevaihtokerroksessa — myynti ja thought leadership ovat nyt tekoälyautomaatioita. Toimitusjohtaja toimii valvojana, ei suorittajana, päivittäisessä liikevaihtotyönkulussa.

### 14.8 Strategiset kumppanuudet ja monituottaja-LLM-reititin

*Dokumentoitu: 27.02.2026 | Lähde: docs/DWS6_TO_DWS7_UPDATE.md v1.1*

| Kumppani | Arkkitehtuurikerros | Tila |
|---------|---------------------|------|
| NVIDIA | Aivot (laskenta) + Kädet (Jetson-reuna) + Keho (Omniverse) | Inception Q2 2026 |
| Siemens | Kädet (MindSphere IoT) + Keho (digitaalinen kaksonen) | Xcelerator Q2 2026 |
| ABB | Kädet (automaatio, robotiikka, sähköverkot) | Q3 2026 |
| xAI | Aivot (Grok reaaliaikainen markkinaälykkyys) | Aktiivinen tuotanto |
| Mistral | Aivot/Muisti (EU-suvereeni tekoälyinferenssi) | Suunniteltu Q3 2026 |

**Monituottaja-LLM-reititin:** Tehtävätason LLM-valinta suvereniteetti-, kustannus- ja latenssikriteereillä — Claude/Mistral vaatimustenmukaisuuteen, Grok markkinasignaaleihin, Groq nopeaan tiivistämiseen, Qwen 2.5 72B (QLoRA, Acer Veriton) paikan päällä tehtävään suvereeniinferenssiiin.

**Tutkimuskontribuutio:** Kumppanuusmalli validoi Firehorse-toimintamallin jakelusupotushypoteesin: pääsy 10 000+ teollisuusasiakkaaseen (NVIDIA Inception, Siemens Xcelerator) ilman suoran myyntiorganisaation rakentamista.

---

## 15. Tulokset ja pohdinta

### 15.1 Toiminnallisen tehokkuuden parannukset

Firehorse-toimintamalli Claude Codella saavutti:

| Mittari | Ennen | Jalkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepaivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syotteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |
| Kauppasivun paivitykset | 4 tuntia | 15 minuuttia | 94 % |

### 15.2 Google Merchant Center -suorituskyky

Revolut-kassalinkkien toteutuksen ja syoteongelmien korjauksen jalkeen:

| Mittari | Tulos |
|---------|-------|
| Tuotteen hyvaksymisaste | 100 % (30/30 tuotetta) |
| Syotteen kasittelyaika | <24 tuntia |
| Kassakonversio | Suora maksuun |
| Syotetiedoston koko | 32 893 tavua |

### 15.3 Vaatimustenmukaisuusvalmiuden arviointi

| Saannos | Valmius | Puuteanalyysi |
|---------|---------|---------------|
| EU:n tekoalysaados | 80 % | Aanichatin lapinaakyvyys odottaa |
| GDPR | 95 % | Proton-toteutus valmis |
| Fit for 55 | 90 % | Tuotekatalogi valmis |
| NIS2 | 75 % | Turvallisuusarviointi tarvitaan |
| CSRD | 85 % | Raportointipohjat valmiina |

### 15.4 Rajoitukset

1. **Aanichat ei viela kaytossa** - Suunnitelma dokumentoitu, Q1 2026 tavoite
2. **Kumppaniekosysteemi** - Kumppanuudet kehitteilla
3. **Monikielituki** - Talla hetkella vain englanti/suomi
4. **Hiilijalanjalkililaskuri** - Vaatii toimialatietojen validoinnin

---

## 16. Johtopäätökset

### 16.1 Yhteenveto

Firehorse-toimintamalli osoittaa etta tekoalyavusteinen verkkokaupan hallinta voi:

1. **Vahentaa toiminnallista ylikuormitusta** yli 90 % automatisoidulla tuotehallinnalla
2. **Varmistaa vaatimustenmukaisuuden** EU-saantosten kanssa dokumentoiduilla auditointipoluilla
3. **Mahdollistaa nopean iteroinnin** tuotetarjonnassa luonnollisen kielen kayttoliittymilla
4. **Valmistaa infrastruktuurin** aanipohjaiseen asiakasvuorovaikutukseen
5. **Tukea teollisia asiakkaita** hiilijalanjalkililaskurin integraatiolla

### 16.2 Keskeiset kontribuutiot

Tama tutkielma kontribuoi:

1. Dokumentoitu kehys tekoalyavusteiseen kauppatoimintaan (Firehorse-malli)
2. Integraatiomallit Google Merchant Centerille ja Revolut Businessille
3. Suunnitelma aanichatille hiilijalanjalkililaskurin integraatiolla (4 vaihetta)
4. EU-vaatimustenmukaisuuskartoitus teollisille ohjelmistotuotteille
5. Tuotesuositusmoottorin arkkitehtuuri 16:lle EU-toimialalle
6. Proton-tuotteiden turvallisuusstrategia GDPR/NIS2-vaatimustenmukaisuuteen
7. Agent Foundry Vaihe 1.5 — OpenSandbox Acer Veriton GN100 -laitteella EU-ilmarakoiseen agentin hiekkalaatikointiin
8. EMPO²-yhdenmukaisuus — hybridiparametrinen/ei-parametrinen muistiarkkitehtuuri validoitu arXiv:2602.23008-tutkimuksella
9. Toimitusjohtajan automaatioagenttiryhmä — Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor; Firehorse-malli sovellettu liikevaihtotyönkulun automatisointiin
10. Monituottajakumppaniekosysteemi — NVIDIA, Siemens, ABB, xAI, Mistral + monituottaja-LLM-reititin; validoi Firehorse-toimintamallin jakelusupotushypoteesin
11. LSS-koulutusputken koordinointi — Lifetime Scope Signals sovellettuna LWM-koulutukseen: koulutusagenttilaivasto (T-01–T-10), laatuporttisignaalit, resurssien välimiesosoitus 2× GN-100 -solmuille; validoi LSS:n yleiskäyttöisenä koordinointina ohjelmistokehityksen ulkopuolella

### 16.3 Tuleva tyo

1. **Q1 2026:** Ota kayttoon aanichatin vaihe 1 EU:n tekoalysaadoksen lapinaakyvyydella
2. **Q2 2026:** Toteuta toimialan hiilijalanjalkililaskuri Scope 1/2/3:lla
3. **Q3 2026:** Lanseeraa saantelytuntemusmoottori
4. **Q4 2026:** Perusta kumppaniekosysteemi provisiomallin kanssa
5. **2027:** Laajenna muille EU-markkinoille (SE, NO, DK, DE)

---

## 17. Lahteet

1. EU:n tekoalysaados, Asetus (EU) 2024/1689
2. Google Merchant Center -tekniset maaritykset (2026)
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
13. EU:n liikesalaisuusdirektiivi (EU) 2016/943
14. Liikesalaisuuslaki 595/2018 (Suomi)
15. Patenttiyhteistyosopimus (PCT), WIPO
16. Shihipar, T. (2026). "Lessons from Building Claude Code: Prompt Caching Is Everything." Anthropic Engineering Blog

### DWS-alustan standardit (sisäiset)

Seuraavat sisäiset standardit ohjaavat DWS IQ 6 -alustan arkkitehtuuria, tietoturvaa ja laatua. Niitä ylläpidetään elävinä dokumentteina yksityisessä repositoriossa ja niihin viitataan tässä Oxford-notaatiolla akateemisen jäljitettävyyden varmistamiseksi.

17. Lifetime Oy (2026). *DWS Security Standard*, versio 1.5. `DWS_SECURITY_STANDARD.md`. Sisäinen viitekehys, joka ohjaa tekoälyn turvallisuutta, väliohjelmiston tietoturvakontrolleja, CORS-käytäntöjä, SRI-eheyttä, artikla 12 -kirjausta ja API-rajapinnan validointia Zod-skeemoilla. Määrittelee tietoturva-arkkitehtuurin kaikille 15 backend-API-reitille ja MCP-agenttipalvelimelle.

18. Lifetime Oy (2026). *ESRS-tietopisterekisteri*, versio 1.0. `src/compliance/esrs-registry.ts`. Koneluettava kartoitus kaikista 82 eurooppalaisesta kestävyysraportointistandardien (ESRS) tiedonantovaatimuksesta kategorioittain E1–E5 (ympäristö), S1–S4 (sosiaalinen) ja G1 (hallinto). Kukin tiedonanto on luokiteltu pakolliseksi tai vapaaehtoiseksi CSRD-direktiivin (EU) 2022/2464 mukaisesti.

19. Lifetime Oy (2026). *Vaatimustenmukaisuuden pisteytysmoottori*, versio 1.0. `src/compliance/scoring-engine.ts`. Deterministinen vaatimustenmukaisuuden pisteytysalgoritmi, joka laskee CSRD-valmiuden, ETS-altistuksen ja CBAM-riskipisteet. Kaava: kokonaispistemäärä = CSRD(0,50) + ETS(0,25) + CBAM(0,25), jossa CSRD = (annetut pakolliset tietopisteet / pakolliset yhteensä) × 80 + bonusmuuttujat.

20. Lifetime Oy (2026). *Site Quality Standards*, versio 2.1. `SITE_QUALITY_STANDARDS.md`. Koodin laatu-, komponenttiarkkitehtuuri- ja käyttöliittymän vikasietoisuusstandardit DWS IQ -hallintapaneelille. Määrittelee ErrorBoundary-, Skeleton-lataus- ja EmptyState-komponenttistandardit yritystason käyttökokemukselle.

21. Lifetime Oy (2026). *AGENTS.md*, versio 2.2. `AGENTS.md`. Agentti-inventaario ja operatiiviset ohjeet agents.md-avoimen spesifikaation mukaisesti. Dokumentoi 15 tekoälyagenttia, vaatimustenmukaisuuden pisteytysarkkitehtuurin, väliohjelmistopinon järjestyksen ja "Build for Agents" -tuotesäännön, joka edellyttää CLI + MCP + Skills -rajapintoja.

22. Lifetime Oy (2026). *DWS IQ Platform Admin Manual*, versio 2.7. `Admin/ADMIN_MANUAL.md`. Operatiiviset menettelyt terveystarkistusten valvontaan, vaatimustenmukaisuusmoottorin hallintaan ja hallintapaneelin vikasietoisuuden vianetsintään. Sisältää Claude Code -projektin suunnittelurakenteen ja moniagenttiorkestrointiosiot.

23. Lifetime Oy (2026). *Enterprise Security & Compliance*, versio 1.8. `Admin/SECURITY_COMPLIANCE.md`. Tietoturvakontrollit tietoturvajohtajille ja hankintatiimeille. Dokumentoi agenttien ajonaikaiset turvakontrollit, hallintapaneelin vikasietoisyyskontrollit, backend-väliohjelmiston turvakontrollit ja vaatimustenmukaisuusmoottorin tietosuojan RLS-käytännöillä.

---

## 18. Liitteet

### Liite A: Taysi tuotekatalogi

| ID | Tuote | Hinta | Tyyppi | Brändi |
|----|-------|-------|--------|--------|
| DWS-IQ-006 | DWS IQ Platform v6 | 4 999 EUR | Alusta | Lifetime |
| DWS-IQ-005 | DWS IQ Platform v5 | 6 995 EUR | Alusta | Lifetime |
| FH-AUTO-001 | Firehorse Automation | 4 950 EUR | Ohjelmisto | Firehorse |
| FH-RPT-001 | Firehorse Report | 1 999 EUR | Ohjelmisto | Firehorse |
| FH-CMS-001 | Firehorse CMS | 2 999 EUR | Ohjelmisto | Firehorse |
| FH-OMNI-001 | Firehorse Omnichannel | 499 EUR | Ohjelmisto | Firehorse |
| LIFETIME-BUNDLE-2026 | Climate Bundle | 6 500 EUR | Paketti | Lifetime |
| expert-services | Expert Workshop 3 paivaa | 4 500 EUR | Palvelu | Lifetime |
| consulting-hourly | Konsultointi tuntihinta | 98 EUR/h | Palvelu | Lifetime |
| consulting-fit55 | Fit55-asiantuntija | 3 000 EUR/kk | Palvelu | Lifetime |
| LIFETIME-EXP-001 | Expert Advisory | 3 000 EUR/kk | Palvelu | Lifetime |
| aws-consultancy | Tekoaly & Cloud -konsultointi | 4 500 EUR | Palvelu | Lifetime |
| conversational-agent | Keskusteluagentti | 3 500 EUR | Ohjelmisto | Lifetime |
| m365-consultancy | M365-konsultointi | 1 120 EUR | Palvelu | Lifetime |
| powerapps-consultancy | Power Platform | 1 120 EUR | Palvelu | Lifetime |
| ai-agent-engineering | Tekoalyagenttisuunnittelu | 99 EUR/h | Palvelu | Lifetime |
| lean-project | Firehorse Lean Project | 4 960 EUR | Palvelu | Firehorse |
| ai-consultant-day | Tekoalykonsulttipaaiva | 699 EUR | Palvelu | Lifetime |
| business-mentor-30 | Business Mentor 30h | 4 960 EUR | Palvelu | Lifetime |
| firehorse-coach | Firehorse Coach | 499 EUR | Palvelu | Firehorse |
| firehorse-flow | Firehorse Flow | 499 EUR | Ohjelmisto | Firehorse |
| omnichannel-multimodal | Omnichannel Multimodal | 699 EUR/kk | Ohjelmisto | Firehorse |
| professional-web-pages | Ammattimaiset verkkosivut | 799 EUR | Palvelu | Lifetime |
| secure-email-proton | Protonmail-toteutus | 499 EUR | Palvelu | Lifetime |
| firehorse-data-services | Datapalvelut | 899 EUR | Palvelu | Firehorse |
| agentti-sanasto | Agentti Sanasto | 0,99 EUR | Digitaalinen | Lifetime |
| devops-lead | Workflow Agent Delivery | 2 500 EUR | Palvelu | Lifetime |
| digital-design-gold | Digital Design Gold | 2 499 EUR | Palvelu | Lifetime |
| cloud-ready-teams | Solution Ready Team | 950 EUR | Palvelu | Lifetime |
| ai-koulutus-3d | AI Koulutus 3 paivaa | 6 250 EUR | Koulutus | Lifetime |

### Liite B: Viikoittainen yllapitotarkistuslista

```
MAANANTAI - Syotteen terveystarkistus
[ ] Avaa Google Merchant Center -diagnostiikka
[ ] Tarkista tuotteen hyvaksymisstatus
[ ] Tarkista hylatyt tuotteet
[ ] Varmista syotteen tuoreus (< 7 paivaa)
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

### Liite C: Aanichatin vaatimustenmukaisuusilmoitukset

**Vaadittu ilmoitus (EU:n tekoalysaados artikla 52):**
```
"Olet nyt yhteydessa Lifetimen tekoalyavustajaan. Tama on automaattinen
jarjestelma, joka kayttaa tekoalya. Jos haluat keskustella ihmisen kanssa,
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

| Asetus | Arvo |
|--------|------|
| Palvelin | partnerupload.google.com |
| Portti | 19321 |
| Kayttajatunnus | mc-sftp-8496329 |
| Protokolla | SFTP |
| Tiedosto | google-products.xml |

### Liite E: Automatisoitu PR-tyonkulku (HIL-automaatio)

Firehorse-toimintamalli sisaltaa taysin automatisoidun pull request -tarkistus- ja yhdistamistyonkulun, joka korvaa manuaalisen ihminen-silmukassa (HIL) -koodikatselmoinnin. Tama on keskeinen operatiivinen tehokkuusparannus yksinyrittajille ja pienille tiimeille, jotka hallitsevat yritystason koodikantoja.

**Arkkitehtuuri:**

```
Claude Code → PR → Clauden pikatarkistus → Gemini HIL-katselmointi → @copilot korjaukset → CI → automaattinen yhdistaminen
                                                    ↑                         |
                                                    └─────────────────────────┘  (korjaussilmukka)
```

**Komponentit:**

| Komponentti | Rooli | Teknologia |
|------------|-------|-----------|
| Claude Code | Koodin generointi, haaran luonti, PR:n avaaminen | Anthropic Claude Opus/Sonnet |
| AI-koodikatselmointi | Kaksoismallikatselmointi korvaa ihmiskatselmoijan | GitHub Actions -tyonkulku |
| Claude (katselmoija) | Pikatarkistus: turvallisuus, oikeellisuus, rikkovat muutokset | Claude Sonnet 4 API |
| Gemini (HIL-portti) | Syvakatselmointi: reunatapaukset, testit, arkkitehtuuri, OWASP | Gemini 2.0 Flash API |
| Copilot-koodausagentti | Toteuttaa korjausohjeet katselmointikommenteista | GitHub Copilot |
| PR-automaattiyhdistaminen | Yhdistaa kun kaikki tarkistukset lapaistaan ja AI hyvaksyy | GitHub Actions + GraphQL |

**Keskeinen suunnittelupaatos:** Gemini oletusarvoisesti vaatii muutoksia (REQUEST_CHANGES) jokaisessa katselmoinnissa. Tama varmistaa, etta jokainen PR kay lapi vahintaan yhden parannuskierroksen. Vain koodi, jossa on nolla ongelmaa, riittava testikattavuus ja konventioiden noudattaminen, saa hyvaksynnan (APPROVE).

**Operatiiviset mittarit (odotettu):**
- Kehittajan osallistuminen vahenee loppukatselmointiin (~5 min per PR)
- 70-90% perus-/refaktorointi-/testiongelmista havaitaan ennen ihmiskatselmoijaa
- Tyypillinen korjaussilmukka: 1-3 iteraatiota ennen hyvaksyntaa

**Kayttoonotto:** Cloud Run -palvelu `dws6run6` (europe-north1, Suomi). MCP Hub `POST /gemini/review` on-demand-koodianalyysiin.

---

## 14.9 Climate IQ Pantheon — Kreikkalais-roomalainen moniagenttijärjestelmä

Rakentuen monivuokralaajuiseen agenttiarkkitehtuuriin (osio 14), tämä osio dokumentoi **Climate IQ Pantheonin**: 13 tuotantoagenttia kreikkalais-roomalaisilla jumalaidentiteeteillä, organisoituna kahteen tasoon Climate IQ:n EU:n teollisen vaatimustenmukaisuusalustan tueksi.

### Järjestelmän yleiskatsaus

**Taso 1 — Orkestraattoriagenteista (6)**

| Agentti | Jumala | Rooli | Iskulause |
|---------|--------|-------|-----------|
| Atlas | Kreik. Titaani | Toiminnanjohtaja | Reitittää kaaoksen, syntetisoi sen johdon tilannekatsaukseksi |
| Athena | Kreik. Jumalatar | EU-vaatimustenmukaisuus | Oppinut jokaisen EU-säännön ulkoa vuodesta 2005 |
| Hephaestus | Kreik. Jumala | Kenttä ja kohde | Ei koskaan likaannu saappaita, mutta tarkistaa kaiken |
| Iris | Kreik. Jumalatar | Tutkimus ja äly | Lukee 10 000 sivua, jotta sinun ei tarvitse |
| Hermes | Kreik. Jumala | Logistiikka | Optimoi toimitusketjun ennen kuin löydät varaston |
| Apollo | Kreik. Jumala | Sisältö | Kirjoittaa kopion, sijoittaa sen, lähettää seurannan. Jo teki. |

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
**Taidot uudelleenkäytettävinä työnkulkukomponentteina**
Kuusi tuotantotaitoa `.claude/commands/`-kansiossa muuntavat ad hoc -kehottamisen kutsuttaviksi, dokumentoiduiksi, testattaviksi työnkulkukomponenteiksi:
| Taito | Toimiala |
|-------|----------|
| `/compliance-check` | EU ETS/CBAM/CSRD-vaatimustenmukaisuusanalyysi |
| `/agent-run` | Suorita mikä tahansa DWS IQ -agentti CLI:n kautta |
| `/workflow` | Ketjuta useita agentteja yhdistetyiksi raporteiksi |
| `/discover-agents` | Agenttikyvykkyyksien löytäminen |
| `/site-safety` | Rakennustyömaan turvallisuus (EN 13001) |
| `/carbon-analysis` | Rakennetun hiilen elinkaariarviointi |
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

**Ratkaisu: Yksitietokantainen HTAP Aiven EU:ssa**

PostgreSQL:n sarakemuotoinen laajennusmalli mahdollistaa aidon HTAP:n yksittäisessä tietokannassa. Kuusi tuotantovalmista ratkaisua arvioitiin:

| Ratkaisu | Moottori | Aiven-tuki | Firehorse-sopivuus |
|----------|----------|------------|-------------------|
| TimescaleDB | PostgreSQL | Kyllä | Ensisijainen — aikasarja-agenttimetriikat, auditointipakkaus |
| pg_duckdb | DuckDB | Varmistettava | Ensisijainen — kampanjasuppilon nopeutus |
| pg_mooncake | DuckDB | Ei | Tulevaisuus — lakehouse-vienti (EU Data Act) |

**DWS-tietostandardi luotu** (`DWS_DATA_STANDARD.md`):
- Tallennusmoottoripäätökset (rivi vs sarake vs hybridi)
- Laajennusten hallinta EU-suvereniteettiarviolla
- Säilytysperiaatteet 11 EU-säädökseen sidottuina (GDPR Art 17, EU AI Act Art 12: 7v, NIS2: 5v, kirjanpitolaki: 10v)
- Osiointi- ja pakkausstandardit

**4-vaiheinen käyttöönotto:** Vaihe 0 (tauluosiointi) → Vaihe 1 (TimescaleDB Aivenilla) → Vaihe 2 (pg_duckdb HTAP) → Vaihe 3 (lakehouse-integraatio).

**Tutkimuspanos:** Osoittaa, että yksitietokantainen HTAP on toteuttamiskelpoinen säännellyille EU-verkkokauppa-alustoille — sama SQL, samat asiakasohjelmat, sama RLS, nolla ETL:ää.

---

*Dokumentti generoitu Firehorse-toimintamallilla Claude Coden avulla*
*Viimeksi paivitetty: 12.03.2026*
*Versio: 2.2*
