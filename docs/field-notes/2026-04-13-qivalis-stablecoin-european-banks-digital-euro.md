# Qivalis Stablecoin — Euroopan 12 suurpankin digieuro ennen ECB:tä

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-qivalis-research-ePIAY | Date: 13.04.2026 | Changes: Updated with verified consortium list (all 12 banks named), reserve structure (40% deposits + sovereign bonds), Amsterdam HQ, digital dollarization urgency angle, SEB Nordic relevance, exchange partner talks confirmed
- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-qivalis-research-ePIAY | Date: 13.04.2026 | Changes: Initial — documents Qivalis euro-stablecoin consortium (BBVA, ING + 10 others), H2 2026 launch timeline, first-mover advantage over ECB digital euro 2029, MiCA regulatory posture, DWS Firehorse payment relevance

Session Links & References:

- BBVA joins consortium: https://www.bbva.com/en/innovation/bbva-joins-banking-consortium-to-issue-european-stablecoin/
- Yahoo Finance / H2 2026 launch: https://finance.yahoo.com/news/european-banks-qivalis-targets-h2-124715867.html
- CoinDesk / exchange talks: https://www.coindesk.com/business/2026/03/02/eu-banks-euro-pegged-stablecoin-in-talks-with-crypto-exchanges-to-ensure-liquidity
- CoinDesk / digital dollarization: https://www.coindesk.com/business/2026/03/31/europe-faces-digital-dollarization-without-a-euro-stablecoin-of-its-own-warns-qivalis-ceo
- CaixaBank announcement: https://www.caixabank.com/en/headlines/news/qivalis-joint-venture-of-a-european-banking-consortium-to-launch-euro-stablecoin-in-the-second-half-of-2026
- The Block: https://www.theblock.co/post/391770/european-bank-consortium-targets-2026-launch-for-euro-backed-stablecoin-report
- MiCA (Markets in Crypto-Assets Regulation): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114
- ECB digital euro project: https://www.ecb.europa.eu/paym/digital_euro/html/index.en.html

Document Status:

- Created: 13.04.2026
- Last Modified: 13.04.2026
- Language: Finnish + English (bilingual)
- Publication Status: ACTIVE

---

**Type:** Kilpailuanalyysi / Maksuinfrastruktuuri
**Scope:** EU:n digitaalinen maksujärjestelmä, stablecoin-regulaatio (MiCA), Firehorse-maksutuki, DWS-asiakkaiden ERP-integraatiot
**Related:** `Firehorse/`, `src/integrations/`, `DWS_MARKET_RESEARCH_STANDARD.md`

---

## Mikä on Qivalis?

**Qivalis** on yksityisen sektorin euromääräinen stablecoin, jonka taustalla on
**12 eurooppalaisen suurpankin konsortio**. Joint venture on rekisteröity
**Amsterdamiin**. BBVA liittyi 12. jäsenenä helmikuussa 2026.

### Kaikki 12 konsortiojäsentä (vahvistettu)

| Pankki                            | Maa            | Teollisuusrelevanssi DWS:lle                                 |
| --------------------------------- | -------------- | ------------------------------------------------------------ |
| **BNP Paribas**                   | Ranska         | Suurin eurooppalainen yrityspankki                           |
| **UniCredit**                     | Italia / Saksa | Laaja teollisuusasiakaskunta                                 |
| **ING**                           | Alankomaat     | Aktiivinen regtech-sijoittaja (ING Ventures)                 |
| **SEB**                           | Ruotsi         | **Pohjoismaat — suoraan DWS:n kotimarkkina**                 |
| **Danske Bank**                   | Tanska         | Pohjoismainen teollisuus                                     |
| **KBC**                           | Belgia         | Rakennusala + teollisuus                                     |
| **Raiffeisen Bank International** | Itävalta       | Keski-Euroopan teollisuus                                    |
| **DekaBank**                      | Saksa          | Saksalainen institutionaalinen                               |
| **DZ BANK**                       | Saksa          | Suurin saksalainen osuuspankkikeskus                         |
| **CaixaBank**                     | Espanja        | Iberian teollisuus                                           |
| **Banca Sella**                   | Italia         | Fintech-fokus                                                |
| **BBVA**                          | Espanja        | Liittyi 12. jäsenenä helmikuu 2026; BBVA Ventures aktiivinen |

| Ominaisuus               | Arvo                                                        |
| ------------------------ | ----------------------------------------------------------- |
| Perivaluutta             | EUR (1:1 sidottu)                                           |
| Reservirakenne           | Min. 40% pankkitalletukset + lyhytaikaiset EU-valtionlainat |
| Konsortio HQ             | Amsterdam                                                   |
| Suunniteltu laukaisu     | H2 2026                                                     |
| Regulaatiovalmius        | MiCA EMT (Electronic Money Token)                           |
| Lunastus                 | 24/7 (MiCA-vaatimus)                                        |
| Kilpaileva CBDC          | ECB:n digitaalinen euro ~2029                               |
| Vaihtokauppa-neuvottelut | Käynnissä kryptopörssien kanssa (maaliskuu 2026)            |

---

## First-Mover-Etu: Yksityinen ennen julkista

ECB:n digitaalinen euro on **preparation phase** -vaiheessa 2026 ja
**mahdollinen liikkeeseenlasku aikaisintaan 2028–2029**. Tämä jättää
**2–3 vuoden aukko**, jonka Qivalis pyrkii täyttämään.

### Aikajana

```
2026 H2   Qivalis lanseeraus (12 pankin konsortio)
2027      Volyymin kasvu; PSD2/Open Banking -integraatiot
2028      ECB päätös digitaalisesta eurosta (lopullinen)
2029+     ECB CBDC markkinoille — jos aikataulussa
```

First-mover-edun kestävyys riippuu siitä, kuinka syvälle Qivalis ehtii
integroitua ERP-järjestelmiin, verkkomaksuratkaisuihin ja B2B-maksuvirtoihin
ennen CBDC:n tuloa.

### "Digital Dollarization" — Qivalisin CEO:n keskeinen argumentti

Qivalisin toimitusjohtaja varoitti maaliskuussa 2026 **"digitaalisesta
dollarisaatiosta"**: jos Eurooppa ei saa omaa reguloitua eurostablecoinia
markkinoille ennen kuin USD-stablecoinit (USDC, Tether) dominoivat
eurooppalaiset B2B-maksuvirrat, euron asema teollisuusmaksuissa heikkenee
rakenteellisesti.

Tämä on **poliittinen turvallisuusargumentti**, ei pelkkä bisnesargumentti.
Se nostaa Qivalisin prioriteetin EU-instituutioiden silmissä ja tekee
H2 2026 -aikataulusta poliittisesti sitovan — ei pelkästään
kaupallisen tavoitteen.

**Investor-implikaatio:** Qivalis ei voi epäonnistua poliittisesti.
Konsortio saa regulaattorituen, koska vaihtoehtona on dollarisaatio.
Tämä vähentää "konsortio hajoaa ennen lanseerausta" -riskiä merkittävästi.

---

## MiCA-regulaatio: Etu, ei este

Qivalis operoi **MiCA-asetuksen (EU 2023/1114) EMT-kategorian** alla:

| MiCA-kategoria               | Kuvaus                             | Qivalis-relevanssi          |
| ---------------------------- | ---------------------------------- | --------------------------- |
| ART (Asset-Referenced Token) | Useampaan omaisuuteen sidottu      | Ei — Qivalis on EUR-only    |
| **EMT (E-Money Token)**      | 1:1 sidottu yhteen FIAT-valuuttaan | **Kyllä — tämä on Qivalis** |
| Utility Token                | Palvelupääsy                       | Ei                          |

EMT-liikkeeseenlaskijat tarvitsevat **sähkörahalaitoksen (EMI) toimiluvan** tai
pankkitoimiluvan. Konsortiossa olevat suurpankit (BBVA, ING) täyttävät tämän
automaattisesti. Tämä on merkittävä kilpailueste uusille tulijoille.

**Sääntely on Qivalisin vahvuus**, ei heikkous: pienet DeFi-stablecoinit eivät
pysty täyttämään EMT-vaatimuksia.

---

## Vertailu: Qivalis vs. muut digitaaliset euro-instrumentit

| Instrumentti          | Liikkeeseenlaskija        | MiCA              | Saatavuus        |
| --------------------- | ------------------------- | ----------------- | ---------------- |
| **Qivalis**           | 12 pankin konsortio       | EMT ✅            | H2 2026          |
| ECB digitaalinen euro | Euroopan keskuspankki     | Ei sovellu (CBDC) | 2029+            |
| EURC (Circle)         | Circle Internet Financial | EMT ✅            | Nyt (rajoitettu) |
| EURI (Banking Circle) | Banking Circle            | EMT ✅            | 2025             |
| EURR (Anchored Coins) | Anchored Coins AG         | EMT ✅            | 2025             |

Qivalis erottuu **konsortion laajuudessa** — 12 suurpankkia tarkoittaa
laajempaa pankkiverkkoa ja luottamuspohjaista jakautumista kuin mikään muu
EMT-toimija tällä hetkellä.

---

## Strateginen merkitys DWS:lle

### 1. Firehorse-myyntiputki ja B2B-maksut

Firehorse on DWS:n omnikanaali-myyntiratkaisu. Yritykset, jotka ottavat
Qivalisin käyttöön ERP-maksuvirtaan, tarvitsevat:

- Maksuvarmistus- ja kirjanpito-integraatiot
- Laskutusautomaation (EUR ↔ Qivalis -tapahtumat)
- Täsmäytysraportoinnin

**Mahdollisuus:** Firehorse-integraatioprofiili Qivalis-maksuille Q1 2027
tavoitteena (kun volyymi on riittävä).

### 2. EU-vaatimustenmukaisuus ja raportointi

Stablecoin-transaktiot ovat MiCA:n artikkelin 76 mukaisen
raportoinnin alaisia. DWS Compliance-agentille tarvitaan
Qivalis-tapahtumien MiCA-raportointiprofiili, kun asiakaskanta laajenee.

### 3. SEB + Danske Bank mukana — mutta Nordea ja OP puuttuvat

**SEB (Ruotsi)** ja **Danske Bank (Tanska)** ovat konsortiossa. **Nordea**
ja **OP** eivät ole — vahvistettu tutkimuksella (huhtikuu 2026).

| Pohjoismainen pankki | Qivalis-konsortio | Implikaatio                                            |
| -------------------- | ----------------- | ------------------------------------------------------ |
| SEB                  | **Kyllä**         | Ruotsalainen teollisuusasiakas saa Qivalis-maksut heti |
| Danske Bank          | **Kyllä**         | Tanskalaiset + osin suomalaiset yrityspankkiasiakkaat  |
| **Nordea**           | **Ei**            | Pohjoismaiden suurin pankki puuttuu — iso aukko        |
| **OP**               | **Ei**            | Suurin suomalainen pankkiryhmä puuttuu                 |

**Mikä tämä tarkoittaa DWS:lle:**

Nordean ja OP:n teollisuusasiakkaat (jotka ovat iso osa Suomen ja Pohjoismaiden
teollisuusmarkkinaa) eivät saa Qivalis-maksuja automaattisesti H2 2026
lanseerauksessa. He odottavat joko:

1. Nordean / OP:n liittymistä konsortioon (ei vahvistettu aikataulua)
2. Erillisiä EMT-ratkaisuja omilta pankeiltaan

**Muutos "Pohjoismaat suoraan DWS:n kotimarkkinaa" -argumenttiin:**
Pitää tarkentaa — SEB:n kautta Ruotsin teollisuus on suora polku,
mutta Suomen kotimarkkina (OP-asiakkaat) jää toistaiseksi Qivalis-ekosysteemin
ulkopuolelle. Tämä on sekä riski (hitaampi adoptointi Suomessa) että
mahdollisuus (Nordea/OP liittyy → lisää momentum).

### 4. Asiakasriskiarvio: ERP-toimittajat

SAP, IFS ja Dynamics 365 tulevat todennäköisesti lisäämään EMT-maksutuen
2027–2028 (precedent: SEPA-tuki lisättiin ~2 vuotta standardin jälkeen).
Asiakkaat, jotka toimivat SEB:n, BBVA:n tai ING:n kanssa, saattavat pyytää
Qivalis-tukea ennen kuin ERP-vendor sen toimittaa.

---

## Riskit ja epävarmuudet

| Riski                               | Todennäköisyys     | Vaikutus    | Huomio                                                      |
| ----------------------------------- | ------------------ | ----------- | ----------------------------------------------------------- |
| ECB kiristää EMT-sääntöjä           | Matala–Kohtalainen | Korkea      | ECB ei halua heikentää CBDC-asemiaan                        |
| Konsortio hajoaa ennen lanseerausta | **Hyvin matala**   | Korkea      | Dollarisaatio-uhka tekee aikataulusta poliittisesti sitovan |
| ECB nopeuttaa CBDC-aikataulua 2027  | Hyvin matala       | Korkea      | Tekniset valmistelut eivät tue tätä                         |
| Qivalis jää niche-instrumentiksi    | Kohtalainen        | Kohtalainen | Jos B2C-adoptointi jää matalaksi                            |
| MiCA-toimilupa viivästyy            | Matala             | Korkea      | Konsortion pankeilla toimiluvat jo                          |

---

## Johtopäätös

Qivalis on **ensimmäinen uskottava yksityisen sektorin eurodigitaalinen
maksuinstrumentti** riittävän laajalla pankkikonsortiotuella.

**Kolme keskeistä havaintoa:**

1. **2–3 vuoden first-mover-ikkuna on todellinen.** ECB:n 2029-aikataulu on
   optimistinen; käytännössä 2030+ on todennäköisempi.

2. **MiCA EMT -sertifiointi on kilpailumoat.** Pankkikonsortio täyttää
   automaattisesti vaatimukset, joita pienet toimijat eivät voi täyttää.

3. **DWS:n Firehorse- ja Compliance-agentit hyötyvät early-awareness-asemasta.**
   Integraatioprofiilien rakentaminen nyt (2026) on halvempaa kuin reaktiivisesti 2028.

---

_Field note kirjoitettu 13.04.2026. Päivitetään kun konsortiojäsenet vahvistetaan
julkisesti tai MiCA-rekisteröinti vahvistuu._
