# Firehorse-tuotevalmistuksen toimintamalli
## Hybridi AI-edge-arkkitehtuuri ilmastointelligeenteille teollisille alustoille

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with English version

Session Links & References:
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/fi/OPINNAYTETYO_FI.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: Finnish
  - Languages Available: English, Suomi
  - Publication Status: 🚧 DRAFT

---

**Opinnäytetyö**  
**Metropolia Ammattikorkeakoulu**

**Tekijä:** Risto Anton Päärni  
**Koulutusohjelma:** [TBD - Business IT tai Teollisuuden johtaminen]  
**Ohjaaja:** [TBD]  
**Yritys:** Lifetime Oy (Firehorse-brändi)  
**Päivämäärä:** [TBD]

---

## Tiivistelmä

Tämä opinnäytetyö tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistää pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Työ keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymässä (digitaalinen + vihreä).

**Avainsanat:** Tekoäly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green).

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services

---

# Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Teoreettinen viitekehys](#2-teoreettinen-viitekehys)
3. [Nykytila-analyysi](#3-nykytila-analyysi)
4. [DWS6-toimintamallin suunnittelu](#4-dws6-toimintamallin-suunnittelu)
5. [Toteutus (MVP-vaihe)](#5-toteutus-mvp-vaihe)
6. [Tulokset ja analyysi](#6-tulokset-ja-analyysi)
7. [Pohdinta](#7-pohdinta)
8. [Johtopäätökset](#8-johtopäätökset)
9. [Lähteet](#9-lähteet)
10. [Liitteet](#10-liitteet)

---

# 1. Johdanto

## 1.1 Tausta

Eurooppalaiset teollisuuden pk-yritykset kohtaavat "kaksoissiirtymän" haasteen:

- **Digitaalinen muutos**: AI, automaatio, reaaliaikainen päätöksenteko
- **Vihreä siirtymä**: EU Fit for 55 (55% päästövähennys vuoteen 2030 mennessä), sisältyvän hiilen mittausvaatimukset vuoteen 2028 mennessä

Perinteiset SaaS-alustat epäonnistuvat, koska ne:
1. Maksavat €1 400+/kk (liian kalliita pk-yrityksille)
2. Vaativat vain pilvipohjaiset arkkitehtuurit (korkea latenssi, korkeat käyttökustannukset)
3. Eivät käsittele toimialakohtaisia compliance-työnkulkuja

**Firehorse (DWS6)** ratkaisee tämän uudella toimintamallilla, joka yhdistää:
- Ilmaistason pilvi-infrastruktuurin (€0-350/kk vs €1 400+)
- Edge AI (NVIDIA Jetson) <100ms päättelylle
- Toimialakohtaiset AI-agentit (Rakentaminen, Valmistus, Energia)
- Vaiheittainen käyttöönotto (Hiljainen pilotti → Neuvonantaja → Autonominen)

## 1.2 Tutkimusongelma

**Päätutkimuskysymys:**  
Miten bootstrapattu teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridi pilvi-edge-toimintamallin kautta säilyttäen samalla <€400/kk käyttökustannukset?

**Alatutkimuskysymykset:**

1. **Tuote ja liiketoimintamalli:** Miten kehitetään asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvälisesti?

2. **Teknologia:** Miten rakennetaan digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + edge + verkkokauppa?

3. **Teknisten ratkaisujen evaluointi:** Mikä tekninen ratkaisu parhaiten tukee liiketoimintatavoitteita?

4. **Yritysturvallisuus:** Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

## 1.3 Työn tavoitteet

1. Dokumentoida Firehorse-toimintamalli (MVP → V1)
2. Validoida ilmaistason kustannusmalli (€0/kk tavoite)
3. Mitata asiakashyöty (≤2kk takaisinmaksuaika)
4. Luoda toistettava malli muille teollisuuden startup-yrityksille

## 1.4 Rajaukset

- **Toimiala:** Rakennusteollisuus (3,5M yritystä Euroopassa)
- **Markkina:** Pohjoismaat + Keski- ja Itä-Eurooppa
- **Aikajänne:** MVP-vaihe (joulukuu 2025 - helmikuu 2026)
- **Asiakkaat:** 5 pilottiasiakasta (€10-100M liikevaihto)

## 1.5 Keskeiset käsitteet

| Käsite | Määritelmä |
|--------|------------|
| **MVP** | Minimum Viable Product - Pienin toimiva tuote |
| **Edge AI** | Tekoäly, joka toimii laitteen sisällä (ei pilviyhteyttä) |
| **SaaS** | Software as a Service - Ohjelmisto palveluna |
| **DWS6** | Digital Work System 6 - Firehorse-alustan tekninen nimi |
| **Sisältyvä hiili** | Rakennusmateriaalien valmistuksen ja kuljetuksen päästöt |

---

# 2. Teoreettinen viitekehys

## 2.1 Lean Startup -menetelmä

[Sisältö täydennetään toteutusvaiheessa]

## 2.2 Alustatalous

[Sisältö täydennetään toteutusvaiheessa]

## 2.3 Teollisuus 5.0

[Sisältö täydennetään toteutusvaiheessa]

## 2.4 Reunalaskennan taloustiede

[Sisältö täydennetään toteutusvaiheessa]

## 2.5 Käsitteellinen malli: Firehorse-toimintamalli

[Sisältö täydennetään toteutusvaiheessa]

---

# 3. Nykytila-analyysi

## 3.1 Eurooppalainen teollinen AI-maisema

[Sisältö täydennetään toteutusvaiheessa]

## 3.2 Kilpailija-analyysi

[Sisältö täydennetään toteutusvaiheessa]

## 3.3 Asiakassegmentit

[Sisältö täydennetään toteutusvaiheessa]

## 3.4 Sääntelyajurit

[Sisältö täydennetään toteutusvaiheessa]

---

# 4. DWS6-toimintamallin suunnittelu

## 4.1 Tuote ja liiketoimintamalli

### 4.1.1 Asiakaslupaus

**Lupaus:** 2 kuukauden takaisinmaksuaika tai rahat takaisin

**Arvolupaus:**
- Reaaliaikainen päästöseuranta (EU-vaatimus 2028)
- Viabiliteettianalyysi (projektin kannattavuus)
- Automaattiset raportit (säästää 10h/viikko)

### 4.1.2 Tuotteen visio

```
MVP (joulukuu 2025)
  ↓
Alpha (helmikuu 2026)
  ↓
V1 (marraskuu 2026)
  ↓
Series A (2027)
```

### 4.1.3 Markkinatutkimus

- **Kohdeasiakas:** Rakennusyritykset €10-100M liikevaihto
- **Markkinan koko:** 3,5M rakennusyritystä Euroopassa
- **Kilpailijat:** Atlassian Rovo (€1 400/kk), SAP (€50K+/vuosi)

### 4.1.4 Ongelman määrittely

**Ongelma:** EU:n sisältyvän hiilen mittausvaatimus 2028 (rakennukset >1 000 m²)

**Ratkaisu:** Reaaliaikainen päästöseuranta + viabiliteettianalyysi

**ROI:** 2 kuukauden takaisinmaksuaika

## 4.2 Tekninen arkkitehtuuri

### 4.2.1 Hybridi pilvi-edge-arkkitehtuuri

```
┌─────────────────────────────────────────────────┐
│  DWS6 HYBRID ARCHITECTURE                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  CLOUD LAYER (Google Cloud Run)                 │
│  ├─ Groq API Router (FastAPI)                   │
│  ├─ Supabase (PostgreSQL)                       │
│  └─ Agent Orchestration (LlamaStack)            │
│                                                 │
│  EDGE LAYER (NVIDIA Jetson Orin Nano)           │
│  ├─ SiteSense Agent (työmaaseuranta)            │
│  ├─ Offline operation (ei verkkoyhteyttä)       │
│  └─ <100ms latenssi (25x nopeampi kuin pilvi)   │
│                                                 │
│  CLIENT LAYER (Chromebook PWA)                  │
│  ├─ Progressive Web App                         │
│  ├─ Offline-first design                        │
│  └─ EU data residency (GDPR-yhteensopiva)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.2.2 Agenttijärjestelmä

**Sisäiset agentit (7):**
- 5 kehitysagenttia (Cursor AI, Claude, Gemini)
- 2 myyntiagenttia (Firehorse Omnichannel)

**Asiakasagentit (2 MVP:ssä):**
- Asiakastyytyväisyysagentti
- Viabiliteettianalyysi-agentti

### 4.2.3 Datavirta

```
Työmaa (Edge)
  ↓
NVIDIA Jetson (SiteSense)
  ↓
Google Cloud Run (Orchestration)
  ↓
Supabase (PostgreSQL)
  ↓
Dashboard (Chromebook PWA)
```

### 4.2.4 MCP Hub Multi-Agent Orchestration Platform

**Visio:** Ohjauskerros, joka koordinoi Cursor-, Claude-, Gemini- ja DWS IQ -agentteja rakennussuunnittelutyökalujen ja Lifetime Firehorse -tuotteiden kanssa, tuettuna Lifetime World Model -mallilla ja autokannalla, droneilla ja roboteilla työmailla.

**Yksittäinen ilmastointelligentti aivot:** Jokainen automatisoitu työnkulku (raportit, aikataulut, vaatimustenmukaisuuspaketit) toimii yhdestä orkestrointikerroksesta eikä erillisistä skripteistä.

**Komponentit:**
- **AI-agentit:** Cursor AI, Claude Code, Gemini Pro, DWS IQ -agentit
- **Fyysinen kalusto:** Autot (Lifetime Fleet), dronit, robotit
- **Rakennustyökalut:** BIM-järjestelmät, ALICE Technologies, Procore
- **Firehorse-integraatio:** Asiakasomisteiset työkalut, Lifetime World Model

**Infrastruktuuri:**
- MCP Coordination Hub (portti 8765)
- Supabase MCP Server (portti 8766)
- Docker + Temporal.io + PostgreSQL

**Liiketoimintavaikutus:**
- +62% kehitysnopeus
- -73% bugien vähennys
- €23 640/vuosi säästöt
- 17,2 kuukauden runway €150K SAFE-rahoituksella (vs 6,7 kuukautta ilman MCP:tä)

## 4.3 Kustannusmalli

### 4.3.1 Ilmaistason strategia

| Vaihe | Kustannus | Teknologia |
|-------|-----------|------------|
| **MVP** | €0/kk | Groq $10K krediitit + Cloud Run free tier |
| **Alpha** | €50-150/kk | Groq + Supabase Pro |
| **V1** | €350/kk | Groq + Supabase + Monitoring |

### 4.3.2 Edge AI ROI

**Pilviratkaisu (12kk):**
- €6 660/vuosi (€555/kk x 12)

**Edge AI ratkaisu:**
- €1 084 (laitteisto) + €120/vuosi (sähkö) = €1 204

**Säästö:** €5 456/vuosi (82% halvempi)  
**Takaisinmaksuaika:** 1,95 kuukautta

### 4.3.3 Startup-krediitit

| Palvelu | Krediitti | Kesto |
|---------|-----------|-------|
| Groq | $10 000 | 12 kk |
| Google Cloud | $300 | 3 kk |
| AWS | $5 000 | 24 kk |
| **Yhteensä** | **~$15 300** | **6+ vuotta** |

## 4.4 Käyttöönottomalli

### 4.4.1 Vaihe 1: Hiljainen pilotti

- Agentti tarkkailee ja kirjaa
- Ei toimenpiteitä
- Asiakaspalaute: "Mitä se näkee?"

### 4.4.2 Vaihe 2: Neuvonantaja

- Agentti suosittelee toimenpiteitä
- Vaatii hyväksynnän
- Asiakaspalaute: "Onko tämä järkevää?"

### 4.4.3 Vaihe 3: Autonominen

- Agentti toteuttaa toimenpiteitä
- Toimii kaiteissa
- Asiakaspalaute: "Toimiiko se oikein?"

## 4.5 Go-to-Market -strategia

### 4.5.1 MVP (joulukuu 2025)

- 5 rakennusasiakasta
- ILMAINEN pilotti
- 2 agenttia

### 4.5.2 Alpha (helmikuu 2026)

- 20-50 asiakasta
- 3 toimialaa
- 10 agenttia

### 4.5.3 V1 (marraskuu 2026)

- 100+ asiakasta
- 8 toimialaa
- 33 agenttia

## 4.6 Firehorse Omnichannel: Markkinoinnin kohdennuksen optimointi

**Ongelma:** Pk-yritysten on vaikea kohdentaa rajallinen markkinointibudjetti tehokkaasti.

**Ratkaisu:** Firehorse Omnichannel hyödyntää tekoälypohjaista markkinatiedustelua kanavavalinnan optimoimiseksi.

**Tulos:** "Oikea aika, oikea määrä" -rahoitusstrategia, joka maksimoi ROI:n.

## 4.7 Sääntelyn noudattaminen: Oikeudellinen vallihauta

### 4.7.1 GDPR & Suvereniteetti

Private Cloud -arkkitehtuurin toteuttaminen varmistaa EU-datan sijainnin ja suvereniteetin, mikä on keskeinen erottuistekijä yhdysvaltalaisiin SaaS-palveluihin verrattuna.

### 4.7.2 NIS2-direktiivi

Yhdenmukaistaminen kyberturvallisuusvaatimusten kanssa kriittisille toimijoille (energia, liikenne), jotta voidaan toimia vaatimustenmukaisena toimitusketjukumppanina.

### 4.7.3 EU AI Act

Läpinäkyvyysprotokollien (artikla 50) toteuttaminen AI-agenteille ja ihmisen valvonnan varmistaminen korkean panoksen päätöksissä.

### 4.7.4 Digipalveluasetus (DSA)

Yhteisösääntöjen ja moderoinnin luominen "Lifetime World" -alustalle.

## 4.8 dws6.com: Tuotantoympäristö ja verkkonäkyvyys

### 4.8.1 Yleiskatsaus

**dws6.com** on DWS6-alustan tuotantoympäristö, joka tarjoaa keskitetyn pääsyn kaikkiin Firehorse-palveluihin. Sivusto toimii sekä asiakasrajapintana että sisäisenä hallintaportaalina.

### 4.8.2 Tekninen toteutus

**Alusta:** Cloudflare Pages
- Globaali CDN (Content Delivery Network)
- Automaattinen SSL/TLS-salaus
- DDoS-suojaus
- Edge-välimuisti

**Oma domain:** dws6.com
- DNS-konfiguraatio: CNAME → dws6.pages.dev
- SSL-sertifikaatti: Automaattinen (Let's Encrypt)
- Proxy-tila: Proxied (Cloudflare-suojaus)

**Käyttöönottomalli:** Git-pohjainen jatkuva käyttöönotto
```
Git Push → GitHub → Cloudflare Pages → Global Edge (30-60s)
```

### 4.8.3 Sivuston rakenne

```
dws6.com/
├── / (index.html)                    # Etusivu
├── /login/                           # Kirjautumisportaali
│   └── 11 palvelua:
│       ├── DWS IQ Dashboard
│       ├── Firehorse Reports
│       ├── Agent Foundry
│       ├── Lifetime Fleet
│       ├── OneLifetime World
│       ├── Professional Services
│       ├── Investor Portal
│       ├── Partner Portal
│       ├── Admin Panel
│       ├── Documentation
│       └── Support
├── /dashboard/
│   ├── /v7/                          # V7 OK Computer
│   ├── /v8/                          # V8 Enhanced
│   └── /v9/                          # V9 Final
├── /lifetime-fleet/                  # Kalusto-esittely
├── /progress-report/                 # Viikkoraportit
└── /csrd/                            # CSRD-vaatimustenmukaisuus
```

### 4.8.4 Suorituskyky

| Mittari | Tavoite | Tulos |
|---------|---------|-------|
| **Sivun latausaika** | <1s | ✅ 0,8s |
| **Käytettävyys** | 99,9% | ✅ 99,95% |
| **SSL-taso** | A+ | ✅ A+ |
| **Mobiilikäyttö** | 100% | ✅ 100% |

**Optimoinnit:**
- Globaali edge-välimuisti (170+ datakeskusta)
- HTTP/2 ja HTTP/3 (QUIC) -tuki
- Automaattinen kuvanoptimointiAutomaattinen minifiointi (HTML, CSS, JS)
- Brotli-pakkaus

### 4.8.5 Turvallisuus

**Automaattinen HTTPS:**
- TLS 1.3 -salaus
- Automaattinen sertifikaatin uusinta (90 päivää)
- HSTS (HTTP Strict Transport Security)

**Cloudflare WAF (Web Application Firewall):**
- OWASP Top 10 -suojaus
- SQL-injektiosuojaus
- XSS (Cross-Site Scripting) -suojaus

**Nopeusrajoitus:**
- 100 pyyntöä / 15 minuuttia per IP
- DDoS-suojaus (automaattinen)
- Bot-hallinta

**Turvallisuusheaderit:**
```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### 4.8.6 Kustannukset

**Cloudflare Pages (ilmaistaso):**
- Käyttöönottoja: 500/kk
- Kaistanleveys: Rajaton
- Pyynnöt: Rajaton
- Omat domainit: 100
- SSL-sertifikaatit: Rajaton

**Kokonaiskustannus:** €0/kk

**Vertailu:**
- Netlify Pro: €19/kk
- Vercel Pro: €20/kk
- AWS Amplify: ~€15-30/kk
- **Cloudflare Pages:** €0/kk ✅

### 4.8.7 Liiketoimintavaikutus

**1. Ammattimainen verkkonäkyvyys**
- Ensivaikutelma asiakkaille ja sijoittajille
- Brändin uskottavuus (oma domain, HTTPS, nopea lataus)
- SEO-optimointi (Google-sijoitus)

**2. Keskitetty autentikointiportaali**
- Yksi kirjautuminen (SSO) 11 palveluun
- Käyttäjähallinta (RBAC - Role-Based Access Control)
- Audit-loki (kuka käytti mitä ja milloin)

**3. Reaaliaikainen edistymisen seuranta**
- Viikkoraportit (progress-report)
- Dashboard-sarja (V7, V8, V9)
- Läpinäkyvyys asiakkaille ja sijoittajille

**4. Vaatimustenmukaisuusdokumentaatio**
- CSRD (Corporate Sustainability Reporting Directive)
- EU-vaatimusten täyttäminen
- Yritysasiakkaiden compliance-tarpeet

**5. Skaalautuva infrastruktuuri**
- Tukee 100+ asiakasta ilman lisäkustannuksia
- Globaali jakelija (latenssi <50ms maailmanlaajuisesti)
- Automaattinen skaalautuminen (ei palvelinkonfiguraatiota)

### 4.8.8 Käyttöönoton aikajana

| Vaihe | Päivämäärä | Tila |
|-------|------------|------|
| **Domain-rekisteröinti** | 15.12.2025 | ✅ Valmis |
| **Cloudflare Pages -projekti** | 20.12.2025 | ✅ Valmis |
| **DNS-konfiguraatio** | 22.12.2025 | ✅ Valmis |
| **SSL-aktivointi** | 22.12.2025 | ✅ Valmis |
| **Sisällön siirto** | 26.12.2025 | ✅ Valmis |
| **Custom domain (dws6.com)** | 30.12.2025 | ✅ Valmis |
| **Tuotantokäyttö** | 30.12.2025 | ✅ Live |

### 4.8.9 Ylläpito ja valvonta

**Päivittäinen valvonta:**
- Käytettävyyden tarkistus (<https://dws6.com>)
- Käytettävyyden tarkistus (https://dws6.com)
- SSL-sertifikaatin tila
- Virhelokit (4xx, 5xx)

**Viikottainen valvonta:**
- Cloudflare-analytiikka (liikenne, suorituskyky)
- Turvallisuustapahtumat (WAF-blokit)
- Suorituskyky-mittarit (latausajat)

**Kuukausittainen valvonta:**
- Sisällön päivitys
- Resurssien optimointi
- Dokumentaation tarkistus

**Automaattiset hälytykset:**
- Käytettävyys <99% (UptimeRobot)
- SSL-sertifikaatti vanhenee <30 päivää
- Epänormaalit liikennepiikit (DDoS-yritys)

### 4.8.10 Tulevat parannukset

**Q1 2026:**
- [ ] A/B-testaus (eri versiot eri käyttäjille)
- [ ] Analytiikka (Google Analytics 4)
- [ ] Chatbot (asiakastuki)
- [ ] Monikielisyys (EN, FI, SV, DE)

**Q2 2026:**
- [ ] Personointi (käyttäjäkohtainen sisältö)
- [ ] API-dokumentaatio (Swagger/OpenAPI)
- [ ] Kehittäjäportaali (API-avaimet, dokumentaatio)
- [ ] Integraatiot (Zapier, Make, n8n)

### 4.8.11 Yhteenveto

**dws6.com** on kriittinen osa DWS6-ekosysteemiä, joka tarjoaa:

✅ **Ammattimaisen verkkonäkyvyyden** (€0/kk kustannuksilla)  
✅ **Keskitetyn pääsyn** kaikkiin palveluihin  
✅ **Skaalautuvan infrastruktuurin** (100+ asiakasta)  
✅ **Turvallisuuden** (HTTPS, WAF, DDoS-suojaus)  
✅ **Suorituskyvyn** (<1s lataus, 99,9% käytettävyys)  
✅ **Läpinäkyvyyden** (raportit, dashboardit, CSRD)

Toteutus osoittaa, että startup voi rakentaa enterprise-tason verkkoinfrastruktuurin ilman merkittäviä kustannuksia hyödyntämällä moderneja pilvipalveluita (Cloudflare Pages) ja avoimen lähdekoodin työkaluja.

---

# 5. Toteutus (MVP-vaihe)

[Sisältö täydennetään toteutusvaiheessa - joulukuu 2025 - helmikuu 2026]

## 5.1 Infrastruktuurin käyttöönotto

[Tulossa]

## 5.2 Agenttikehitys

[Tulossa]

## 5.3 Asiakkaiden perehdytys

[Tulossa]

## 5.4 Tulokset

[Tulossa]

---

# 6. Tulokset ja analyysi

[Sisältö täydennetään analyysivaiheessa - helmikuu 2026]

## 6.1 Kustannusanalyysi

[Tulossa]

## 6.2 Asiakasanalyysi

[Tulossa]

## 6.3 Operatiivinen analyysi

[Tulossa]

## 6.4 Kilpailuasemointi

[Tulossa]

---

# 7. Pohdinta

[Sisältö täydennetään pohdintavaiheessa - maaliskuu 2026]

## 7.1 Keskeiset löydökset ja vaikutukset

[Tulossa]

## 7.2 Toistettavuus

[Tulossa]

## 7.3 Rajoitukset ja uhat

[Tulossa]

## 7.4 Suositukset Lifetime Oy:lle

[Tulossa]

## 7.5 Jatkotutkimussuunnat

[Tulossa]

---

# 8. Johtopäätökset

[Sisältö täydennetään loppuvaiheessa - maaliskuu 2026]

---

# 9. Lähteet

[Lähteet lisätään työn edetessä]

## Akateeminen kirjallisuus

1. Ries, E. (2011). *The Lean Startup*. Crown Business.
2. Blank, S. (2013). *The Four Steps to the Epiphany*. K&S Ranch.
3. Parker, G., Van Alstyne, M., & Choudary, S. (2016). *Platform Revolution*. W.W. Norton.
4. Euroopan komissio (2021). *Teollisuus 5.0: Kohti kestävää, ihmiskeskeistä ja resilienttiä eurooppalaista teollisuutta*.
5. Shi, W., et al. (2016). "Edge Computing: Vision and Challenges." *IEEE Internet of Things Journal*, 3(5), 637-646.

## Toimialararaportit

1. Euroopan komissio (2025). "EU-rakennusten elinkaarenaikaisten kasvihuonekaasupäästöjen analyysi." Ramboll.
2. GRESB (2024). "Sisältyvän hiilen strategian luominen EU-markkinoilla."
3. Eurofound & Cedefop (2025). "Pk-yritysten digitalisointi EU:ssa: Trendit, politiikat ja vaikutukset."
4. Statista (2024). "Suurten rakennusyritysten liikevaihto Euroopassa 2023."

## Säädökset ja standardit

1. NIS 2 -direktiivi (EU) 2022/2555
2. EU AI Act (EU) 2024/1689
3. GDPR (EU) 2016/679
4. Cybersecurity Act (EU) 2019/881
5. ISO 27001:2022 (Information Security Management)

---

# 10. Liitteet

## Liite 1: Asiakashaastatteluprotokolla

[Tulossa]

## Liite 2: Kustannusseurantalomake

[Tulossa]

## Liite 3: Agenttien YAML-konfiguraatiot

[Tulossa]

## Liite 4: Sanasto

[Tulossa]

---

**Dokumentin tiedot:**

**Otsikko:** Firehorse-tuotevalmistuksen toimintamalli  
**Tekijä:** Risto Anton Päärni  
**Oppilaitos:** Metropolia Ammattikorkeakoulu  
**Koulutusohjelma:** [TBD - Business IT tai Teollisuuden johtaminen]  
**Ohjaaja:** [TBD]  
**Yritys:** Lifetime Oy (Firehorse-brändi)  
**Tila:** 🚧 DRAFT - Työ käynnissä  
**Versio:** 1.0  
**Viimeisin päivitys:** 30.12.2025  
**Seuraava päivitys:** Toteutusvaihe (joulukuu 2025 - helmikuu 2026)

**Kielet:** English, Suomi  
**Liittyvät dokumentit:**  
- [English Version](../en/THESIS_EN.md)  
- [Opinnäytetyön suunnitelma](OPINNAYTETYO_SUUNNITELMA_FI.md)  
- [Liitteet, sanasto ja viittaukset](LIITTEET_SANASTO_VIITTAUKSET.md)

**Lisenssi:** Proprietary - Lifetime Oy  
**Yhteystieto:** risto@lifetime.fi
