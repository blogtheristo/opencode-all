---
marp: true
theme: default
paginate: true
size: 16:9
header: "Firehorse-tuotevalmistuksen toimintamalli · YAMK 2026"
footer: "Risto Anton Päärni · Metropolia AMK · 28.5.2026"
style: |
  section { font-size: 24px; }
  h1 { color: #c0392b; }
  h2 { color: #2c3e50; }
  table { font-size: 0.85em; }
  code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
---

<!--
Kypsyysnäytteen lopputuloksen esittely.
Pituus: ~20 min · 20 kalvoa · noin 1 min/kalvo.
Lähde: docs/metropolia/master-thesis/fi/V3Thesis_FI.md (V3, 28.5.2026)
-->

# Firehorse-tuotevalmistuksen toimintamalli

## Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille

**YAMK-opinnäytetyön lopputulosten esittely**

Risto Anton Päärni
Metropolia Ammattikorkeakoulu
Espoo, 28.5.2026

---

# Esityksen rakenne

1. Tutkimuksen tausta ja motivaatio
2. Tutkimusongelma ja kysymykset
3. Teoreettinen viitekehys
4. Firehorse Solution Factory -malli
5. DWS6-arkkitehtuuri: Aivot–Muisti–Keho–Kädet
6. Lifetime Scope Signals -protokolla
7. AI-avusteinen kehitysmalli
8. DWS10.com-verkkokauppa
9. Google Merchant Center + Revolut Business
10. EU-sääntelyvalli
11. Tulokset: toiminnallinen tehokkuus
12. Tulokset: vaatimustenmukaisuus
13. Tulokset: kustannusmallin validointi
14. Tutkimuskysymyksiin vastaaminen
15. SWOT-analyysi v3.26
16. Keskeiset kontribuutiot
17. Toistettavuus ja tuleva työ
18. Yhteenveto

---

# 1. Tutkimuksen tausta

**Eurooppalaisten teollisuuden pk-yritysten kaksoissiirtymä:**

- **Digitaalinen muutos** — tekoäly, automaatio, reaaliaikainen päätöksenteko
- **Vihreä siirtymä** — EU Fit for 55 (–55 % päästöt 2030), sisältyvän hiilen mittaus 2028

**Perinteisten SaaS-alustojen ongelmat:**

- Hinta €1 400+/kk — pk-yritykselle liikaa
- Vain pilvi → korkea latenssi, korkeat käyttökustannukset
- Ei toimialakohtaista compliance-työnkulkua

**Henkilökohtainen ajuri:** Microsoft for Startups -ohjelma päättyi 02/2025 → tarvittiin radikaalisti edullisempi tuotantotapa. Cloudflare + Cursor AI + Claude Code mahdollistivat uuden mallin elokuusta 2025 alkaen.

---

# 2. Tutkimusongelma

**Päätutkimuskysymys**
> Miten AI-avusteisesti kehitetty teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridissä pilvi–edge-toimintamallissa säilyttäen alle €400/kk käyttökustannukset?

**Viisi alatutkimuskysymystä:**

1. **Tuote ja liiketoiminta** — Miten luodaan kansainvälisesti skaalautuva asiakaslupaus?
2. **Teknologia** — Miten rakennetaan palvelutuote, joka toimii pilvi + edge + verkkokauppa?
3. **Teknisten ratkaisujen evaluointi** — Mikä arkkitehtuuri tukee liiketoimintatavoitteita parhaiten?
4. **Yritysturvallisuus** — Miten saavutetaan NIS 2-, EU AI Act-, GDPR- ja Cybersecurity Act -yhteensopivuus?
5. **Verkkokauppavalidointi (V3.0)** — Miten automatisoitu kauppa validoi tuote–markkinasopivuuden?

---

# 3. Teoreettinen viitekehys

| Teoriaperusta | Soveltaminen Firehorseen |
|---|---|
| **Lean Startup** (Ries 2011) | Build–Measure–Learn → vaiheittainen käyttöönotto (Hiljainen → Neuvonantaja → Autonominen) |
| **Alustatalous** | Monitahoinen alusta: asiakkaat, agenttitoimittajat, datatuottajat |
| **Teollisuus 5.0** | Ihmiskeskeisyys, kestävyys, resilienssi |
| **Reunalaskennan taloustiede** | <100 ms latenssi paikallisesti, 82 % halvempi kuin pilvi |
| **Moniagenttijärjestelmät (MAS)** | Lifetime Scope Signals -koordinointiprotokolla |

**Käsitteellinen synteesi:** Firehorse Solution Factory yhdistää nämä viisi viitekehystä toistettavaksi malliksi teollisille AI-startupeille.

---

# 4. Firehorse Solution Factory -malli

```
┌──────────────────────────────────────────────────────────┐
│  STRATEGINEN KERROS (liiketoimintamalli)                 │
│  ├─ Lifetime World Model (55B) — ristivertikaalitieto    │
│  ├─ 8 vertikaalimallia — uudelleenkäytettäviä konfeja    │
│  ├─ AI-avusteinen kehitys (Cursor + Claude Code, 15 vk)  │
│  └─ EU-vaatimustenmukaisuusvalli                         │
│                                                          │
│  OPERATIIVINEN KERROS (AgentFoundry + Scope Signals)     │
│  ├─ Agenttikonfiguraatiot YAML-malleilla                 │
│  ├─ MCP Hub — moniagenttiorkestrointi                    │
│  └─ Vaiheittainen käyttöönotto                           │
│                                                          │
│  SUORITUSKERROS (Aivot–Muisti–Keho–Kädet)                │
│  └─ Hybridi pilvi + edge -toteutus                       │
└──────────────────────────────────────────────────────────┘
```

---

# 5. DWS6-arkkitehtuuri: Aivot–Muisti–Keho–Kädet

| Komponentti | Toteutus | Todiste |
|---|---|---|
| **Aivot** | DWS IQ 6 -alusta (Groq + Claude + Gemini) | MCP Hub portissa 8765 |
| **Muisti** | Lifetime World Model + EMPO² | PostgreSQL HTAP (Aiven + TimescaleDB) |
| **Keho** | 8 toimialasovellusta, 13-agenttinen Pantheon | Climate IQ Pantheon |
| **Kädet** | NVIDIA Jetson + Acer GN100, dronet, IoT | **<100 ms** päättely, **25× nopeampi** kuin pilvi |

**Kaksitasoinen HTAP-arkkitehtuuri (v3.26):** Aiven hallittu + GN100-reuna → V1-kustannus **€280/kk** (tavoite €350/kk).

---

# 6. Lifetime Scope Signals -protokolla

**Tutkimuksen uusi teoreettinen kontribuutio:**

- Deklaratiivinen koordinointiprotokolla moniagenttijärjestelmille
- Deterministiset riippuvuudet — käynnistysvaiheen optimointi
- Signaalit: **READY · COMPLETE · ERROR · BLOCKED**

**Neljä työnkulkumallia MCP Hubin kautta:**

1. **Fan-Out** — rinnakkainen suoritus
2. **Sequential** — peräkkäinen ketju
3. **Reflection** — itsekorjaava silmukka
4. **Pipeline** — vaiheistettu putki

**Vaikutus:** mahdollistaa toistettavan, auditoitavan ja **EU AI Act artikla 12** -yhteensopivan agenttiorkestraation.

---

# 7. AI-avusteinen kehitysmalli

**15 viikon MVP-sykli yhdellä kehittäjällä:**

- Cursor Pro + Claude Code Max + GitHub Copilot
- Periaate: **Human-in-Command** — kaikki muutokset ihmisen hyväksymiä (EU AI Act -vaatimus)
- Yksityinen GitHub-repositorio varovaisuusperiaatteen mukaisesti

**DWS-standardit ohjaavat tekoälyä:**

- 15 standardia: DWS Document Standard, Brand Standard, Security Standard, …
- `CLAUDE.md` projektimuistina
- Skillit ja koukut uudelleenkäytettävinä työnkulkukomponentteina

**Mittakaava 28.5.2026:** 4 604 commitia · ~1 400 PR:ää · 3 576 markdown-tiedostoa · 1 916 TypeScript-tiedostoa · 113 tuotetta (112 ostettavissa).

---

# 8. DWS10.com-verkkokauppa

**Tekninen toteutus:**

- Cloudflare Pages + Workers — **€0/kk**, **99,95 %** käytettävyys
- Yksi totuuden lähde: `dws10.com/config/products.json`
- Hierarkkinen kategoria-arkkitehtuuri (parantaa konversiota ja SEO:ta)
- Dual-folder-mirror: muutokset synkronoidaan sisarkansioon samassa commitissa

**Sisältö ja katalogi:**

- 113 tuotetta tuotuna, 112 ostettavissa
- Alusta-, ohjelmisto- ja palvelukategoriat
- Tuotekuvaukset AI-generoituja, A/B-testattuja

**Kehityskanava:** ihminen-silmukassa-oppimisputki (HIL) — viikoittainen ylläpitorutiini ja PR-katselmointi 15 minuutissa.

---

# 9. Google Merchant Center + Revolut Business

**Google Merchant Center**

- Tili 8496329
- **30/30 tuotetta hyväksytty (100 %)**
- Syötteen käsittelyaika <24 h, XML-syöte 32 893 tavua
- Automatisoitu SFTP-lataus

**Google Agentic Commerce -protokollat (kevät 2026)**

- Etenivät de facto -käytännöiksi → uusi luku ja dynaaminen yhteys **Google Merchant Nextiin**

**Revolut Business -maksuintegraatio**

- Kassakonversio suoraan maksuun
- EU-pankki, kustannustehokas pk-yrittäjälle
- Valuutta- ja monikielikäsittely sisäänrakennettuna

---

# 10. EU-sääntelyvalli

**16 EU-toimialan Fit for 55 -vaikutusanalyysi**

- **Taso 1** (8 toimialaa): suora ETS + CBAM (sähkö, teräs, sementti, kemia, lento, meri, maantie, rakentaminen)
- **Taso 2** (8 toimialaa): epäsuora ETS + ESR

**Viisi seurattua säädöstä:** EU AI Act · GDPR · NIS2 · CSRD · EU Data Act

**Omnibus-paketti (26.2.2025) — kilpailuetu:**

- CSRD-laajuus: 50 000 → 10 000 yritystä
- Pk-yritysten raportointi muuttui vapaaehtoiseksi (EFRAG SME)
- Ilmastotavoitteet säilyivät ennallaan
- → €0–350/kk hinta erityisen kilpailukykyinen vapaaehtoisen raportoinnin markkinoilla

**Sääntely-TAM:** Pohjoismaat **€2,68 mrd**, EU **€15–20 mrd** (10 v).

---

# 11. Tulokset: toiminnallinen tehokkuus

| Mittari | Ennen | Jälkeen | Parannus |
|---|---|---|---|
| Tuotepäivitysaika | 2 h | 5 min | **96 %** |
| Syötteen generointi | manuaalinen | automatisoitu | **100 %** |
| Dokumentaation luonti | 1 viikko | 1 h | **99 %** |
| Virheprosentti | 5 % | <1 % | **80 %** |
| Kauppasivun päivitykset | 4 h | 15 min | **94 %** |
| PR-katselmointisykli | 2–4 h (manuaali) | 15 min (kaksoismalli-AI) | **94 %** |
| Agenttilaivueen koko | 0 | 13 (Pantheon) | **∞** |
| **Harness engineering -vertailuarvo** | **52,8 %** | **66,5 %** | **+26 % (sama malli)** |

**Keskeinen löydös v3.26:** järjestelmätason optimointi (prompt-scaffolding, reititys, orkestrointi) tuottaa +26 % parannuksen **ilman mallin vaihtamista** — validoi Firehorse-arkkitehtuurin.

---

# 12. Tulokset: vaatimustenmukaisuus

**EU-säädösten valmiusaste v3.15 → v3.26:**

| Säännös | v3.15 | v3.26 | Todiste |
|---|---|---|---|
| **EU AI Act** | 80 % | **92 %** | Artikla 12 -lokitus, Pantheon-agentit, SOUL.md |
| **GDPR** | 95 % | **97 %** | Proton + Supabase RLS + europe-north1 |
| **Fit for 55** | 90 % | **93 %** | 20-toimialainen hiililaskuri, tuotekatalogi |
| **NIS2** | 75 % | **85 %** | RC2–RC4 koventaminen, Snyk MCP |
| **CSRD** | 85 % | **88 %** | Raportointipohjat + vientiominaisuus |
| **EU Data Act** | — | **80 %** (uusi) | DWS-tietostandardi, HTAP-arkkitehtuuri |

**Cybersecurity Act:** ISO 27001 -sertifiointitavoite Q3 2026.

---

# 13. Tulokset: kustannusmallin validointi

| Vaihe | Tavoite | Toteutunut | Tila |
|---|---|---|---|
| **MVP** | €0/kk | €0/kk | **SAAVUTETTU** (ilmaistason pino) |
| **Alpha** | €50–150/kk | €75/kk | suunnitelmassa |
| **V1** | €350/kk | **€280/kk** | **EDELLÄ TAVOITETTA** |

**Kustannusedut:**

- **82 %** halvempi kuin pelkkä pilvi -arkkitehtuuri
- Takaisinmaksuaika **1,95 kk** laitteistoinvestoinnille
- Kaksitasoinen HTAP keventää työkuormia reunalle

**Asiakasvalidointi:** Uber, Bolt, Kela — **€10 k MRR** pilotin aikana.

---

# 14. Tutkimuskysymyksiin vastaaminen

| TK | Aihe | Vastaus / todiste |
|---|---|---|
| **TK1** | Tuote & liiketoiminta | €10 k MRR · 8 vertikaalia · takaisinmaksu 1,95 kk |
| **TK2** | Teknologia | Pilvi (Groq) + Reuna (Jetson + GN100) + Kauppa (dws10) toimivat |
| **TK3** | Teknisen ratkaisun arviointi | Harness-optimoitu: +85 % nopeus, –80 % virheet, €25–280/kk |
| **TK4** | Yritysturvallisuus | 5 säädöstä 80–97 % yhteensopivuus |
| **TK5** | Verkkokauppavalidointi | 100 % hyväksyntäaste Google Merchantissa, +18 % CTR (AI vs. manuaalinen) |

**Keskeinen havainto:** hypoteesit validoituivat **live-järjestelmällä** — ei pelkkä prototyyppi.

---

# 15. SWOT-analyysi v3.26

**Vahvuudet**
- Live-järjestelmä €10 k MRR · 13-agenttinen Pantheon
- Kustannusjohtajuus (82 % halvempi)
- EU-vaatimustenmukaisuus sisäänrakennettu
- Harness engineering validoitu (+26 % pelkästä järjestelmästä)
- Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI, Mistral, Red Hat

**Heikkoudet**
- Yhden kehittäjän riippuvuus (lievennetty automaatioagenteilla)
- Rajallinen ulkoinen validointi
- Reunalaitteistoriippuvuus (Jetson + GN100)

**Mahdollisuudet**
- EU Fit for 55: €15–20 mrd TAM
- 644 mrd $ GenAI-markkina (76,4 % vuosikasvu)
- Inferenssimuutos: 80 %+ kiihdyttimistä inferenssiin 2028 mennessä

**Uhat**
- Isojen teknologiayritysten markkinatulo · EU AI Act -aikataulu (08/2026)

---

# 16. Keskeiset kontribuutiot

**Käytäntöön**

1. **Firehorse-toimintamalli** — dokumentoitu kehys AI-avusteiseen kauppa- ja agenttitoimintaan
2. **Google Merchant + Revolut -integraatiomallit** EU-pk-yrityksille
3. **Äänichatin kehityssuunnitelma** hiilijalanjälkilaskurin integraatiolla (4 vaihetta)
4. **EU-vaatimustenmukaisuuskartoitus** 16 toimialalle
5. **Tuotesuositusmoottorin arkkitehtuuri** EU-toimialoille

**Teoriaan**

6. **Lifetime Scope Signals -protokolla** — uusi kontribuutio MAS-teoriaan
7. **Solution Factory -malli** — Lean Startup, alustatalous, Teollisuus 5.0 ja reunalaskenta yhtenäisenä viitekehyksenä
8. **Learn Thinking -oppimisajattelu** — laajentaa Build–Measure–Learn -sykliä AI-aikakaudelle

---

# 17. Toistettavuus ja tuleva työ

**Solution Factory -toistettavuus**

- **Vaihe 1:** MVP (15 vk, Cursor Pro + Claude Code Max)
- **Vaihe 2:** Validoi (6 kk, €5–15 k MRR)
- **Vaihe 3:** Skaalaa (12 kk, €50 k+ MRR, 2–3 vertikaalia, Series A)

**Tiekartta 2026**

- **Q1** Äänichat vaihe 1 (Groq + Llama)
- **Q2** Toimialan hiilijalanjälkilaskuri (Scope 1/2/3)
- **Q3** Sääntelytietoisuusmoottori
- **Q4** Kumppaniekosysteemi

**Pitkä horisontti**

- 2027: laajennus SE/NO/DK/DE
- **DWS7:** agenttiarkkitehtuurin modernisointi
- **PhD Firehorse (LUT):** 3–7 vuoden tutkimusagenda (tieteellinen kehystys + markkinasignaalit)

---

# 18. Yhteenveto

**Firehorse-toimintamalli on validoitu live-järjestelmällä:**

- **96 %** toiminnallisen tehokkuuden parannus
- **82 %** kustannussäästö pilvi-arkkitehtuuriin verrattuna
- **5 EU-säädöstä** yhteensopivuus käynnissä (80–97 %)
- **€10 k MRR** maksavilla pilottiasiakkailla
- **Harness engineering** +26 % ilman mallin vaihtamista
- **Toistettava** malli muille teollisuusstartupeille

> "Tekoälyavusteinen verkkokaupan ja agenttihallinta voi vähentää toiminnallista ylikuormitusta yli 90 %, varmistaa EU-vaatimustenmukaisuuden ja mahdollistaa nopean iteroinnin — yhden kehittäjän vetämänä."

**Kiitos!**
Risto Anton Päärni · risto.paarni@metropolia.fi
github.com/blogtheristo/dws6 · dws10.com

<!--
VERSION AND AGENT HISTORY
(In an HTML comment so it stays in-source without rendering as a trailing slide.)

| Versio | Päivämäärä | Tekijä | Muutos |
|---|---|---|---|
| 1.0 | 2026-05-28 | Risto Anton Päärni + Claude Code | Ensimmäinen versio kypsyysnäytteen esitykseksi V3-opinnäytetyön pohjalta |

Lähde: docs/metropolia/master-thesis/fi/V3Thesis_FI.md
Käyttö: Marp (VS Code -extensio) → vie PPTX / PDF / HTML.
Pituustavoite: 20 min · 20 kalvoa · ~1 min per kalvo.
-->

