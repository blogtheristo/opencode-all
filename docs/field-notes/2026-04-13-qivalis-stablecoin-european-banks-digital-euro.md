# Qivalis Stablecoin — Euroopan 12 suurpankin digieuro ennen ECB:tä

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-qivalis-research-ePIAY | Date: 13.04.2026 | Changes: Initial — documents Qivalis euro-stablecoin consortium (BBVA, ING + 10 others), H2 2026 launch timeline, first-mover advantage over ECB digital euro 2029, MiCA regulatory posture, DWS Firehorse payment relevance

Session Links & References:

- Qivalis announcement: https://www.qivalis.eu
- MiCA (Markets in Crypto-Assets Regulation): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32023R1114
- ECB digital euro project: https://www.ecb.europa.eu/paym/digital_euro/html/index.en.html
- BBVA stablecoin initiative: https://www.bbva.com/en/
- ING digital payments: https://www.ing.com/Newsroom/News/

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
**12 eurooppalaisen suurpankin konsortio** — julkisesti vahvistettuina mukana
ainakin **BBVA (Espanja)** ja **ING (Alankomaat)**. Muita konsortiojäseniä ei
toistaiseksi nimetty julkisesti (Q1 2026).

| Ominaisuus           | Arvo                              |
| -------------------- | --------------------------------- |
| Perivaluutta         | EUR (1:1 sidottu)                 |
| Konsortio            | 12 eurooppalaista suurpankkia     |
| Suunniteltu laukaisu | H2 2026                           |
| Regulaatiovalmius    | MiCA EMT (Electronic Money Token) |
| Kilpaileva CBDC      | ECB:n digitaalinen euro ~2029     |

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

### 3. Asiakasriskiarvio: ERP-toimittajat

SAP, IFS ja Dynamics 365 tulevat todennäköisesti lisäämään EMT-maksutuen
2027–2028 (precedent: SEPA-tuki lisättiin ~2 vuotta standardin jälkeen).
Asiakkaat, jotka toimivat BBVA:n tai ING:n kanssa, saattavat pyytää
Qivalis-tukea ennen kuin ERP-vendor sen toimittaa.

---

## Riskit ja epävarmuudet

| Riski                               | Todennäköisyys     | Vaikutus    | Huomio                                      |
| ----------------------------------- | ------------------ | ----------- | ------------------------------------------- |
| ECB kiristää EMT-sääntöjä           | Matala–Kohtalainen | Korkea      | ECB ei halua heikentää CBDC-asemiaan        |
| Konsortio hajoaa ennen lanseerausta | Matala             | Korkea      | Pankkien välinen governance on kompleksinen |
| ECB nopeuttaa CBDC-aikataulua 2027  | Hyvin matala       | Korkea      | Tekniset valmistelut eivät tue tätä         |
| Qivalis jää niche-instrumentiksi    | Kohtalainen        | Kohtalainen | Jos B2C-adoptointi jää matalaksi            |
| MiCA-toimilupa viivästyy            | Matala             | Korkea      | Konsortion pankeilla toimiluvat jo          |

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
