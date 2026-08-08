---
slug: kya-s1-ja-bpmn-2-luottamustaso-ohjaa-prosessia
title: "KYA-S1 ja BPMN 2.0: Miten tekoälyagentin luottamustaso ohjaa teollisuusprosessia käytännössä?"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-07
Status: DRAFT
source: HIC-kirjoittama teksti (sessio claude/agent-use-cases-comparison-h7vl25)
series: "Blogi 5/7 · DWS IQ & Lifetime World Model"
editorial_fixes: |
  Kolme korjausta alkuperäiseen tekstiin ennen luonnostusta (Sääntö 12 — kerrotaan ääneen):
  1. "Reproducibility (PRV)" → PRV = "Memory & Decision Provenance" (Legal/KYA_S1.md §6.3).
     Toistettavuus on PRV-2 (Decision replay), ei koko domainin nimi.
  2. Kynnysarvo 85 on HAVAINNOLLISTAVA, ei kanoninen. KYA-S1 §6.2 (TRS-2) edellyttää
     "documented levels", muttei nimeä lukua. Merkitty tekstissä esimerkiksi.
  3. Kirjoitusvirheet: "Dystanssi" → "Etäisyys", "Olapa" → "Olipa".
  Avoin kysymys HIC:lle: julkaistaanko kynnysarvo 85 sitovana DWS-oletuksena? Jos kyllä,
  se on kirjattava Legal/KYA_S1.md:hen ennen julkaisua, ei blogissa ensimmäistä kertaa.
---

# KYA-S1 ja BPMN 2.0: Miten tekoälyagentin luottamustaso ohjaa teollisuusprosessia käytännössä?

_Blogi 5/7 · DWS IQ & Lifetime World Model · 7. elokuuta 2026 · Risto Anton Päärni_

---

## Johdanto: Puheista prosessikoodiksi

Sääntelyn ja arkkitehtuurikuvauksien jälkeen vastaan tulee aina sama tekninen kysymys: **miten tämä koodataan pystyyn?**

Miten yhdistetään **BPMN 2.0 -prosessimoottori** (kuten Camunda tai Zeebe), **KYA-S1-spesifikaation elävä luottamuspistemäärä (TRS)** sekä **DWS IQ -tausta-agentit (`dws10.com`)** siten, että tuloksena on EU AI Actin vaatima rehellinen _Human-in-Command_ (HIC) -valvonta?

Vastaus piilee siinä, että prosessimoottorille ei anneta agentille kiinteää käyttöoikeutta, vaan jokainen työvaihe reititetään dynaamisesti luottamustason mukaan.

---

## Arkkitehtuurin kolme roolia

Jotta tekninen toteutus on selkeä, jaetaan vastuualueet kolmeen komponenttiin:

| Komponentti              | Rooli järjestelmässä                        | Tekninen vastine                      |
| ------------------------ | ------------------------------------------- | ------------------------------------- |
| **BPMN 2.0 Engine**      | Tuotantoprosessin kapellimestari            | Työnkulun reititys ja tilakone        |
| **KYA-S1 TRS Service**   | Reaaliaikainen luottamus- ja riskipisteytys | Lifetime World Model API              |
| **DWS IQ Skilled Agent** | Suorittava tausta-agentti                   | Mikropalvelu / Autonominen suorittaja |

---

## Miten kytkentä toimii teknisesti? (Vaihe vaiheelta)

Kun DWS IQ -ympäristössä ajetaan liiketoiminta- tai tuotantoprosessia, BPMN 2.0 -moottori ja KYA-S1 TRS viestivät keskenään jokaisessa kriittisessä solmukohdassa.

```
[ BPMN Service Task ] ──(1. Pre-execution Check)──> [ KYA-S1 TRS Engine ]
                                                              │
                                                     (2. Laskee pistemäärän)
                                                              │
[ BPMN XOR Gateway ] <──(3. Palauttaa TRS: 0-100)─────────────┘
   │
   ├── (JOS TRS >= 85) ──> [ DWS IQ Skilled Agent suorittaa ]
   │
   └── (JOS TRS < 85)  ──> [ User Task: HIC Dashboard / Ihmisen hyväksyntä ]
```

### 1. Pre-execution Listener (Ennakkoarviointi)

Ennen kuin BPMN-moottori siirtyy tehtävään (_Service Task_), se laukaisee `Execution Listener` -kuuntelijan. Kuuntelija tekee REST/gRPC-pyynnön KYA-S1 Trust Enginelle:

> `"Onko DWS IQ Quality Agent X valtuutettu suorittamaan tehtävä 'Laadunvarmistus_Erä_402' juuri nyt?"`

### 2. Etäisyys perustasosta ja TRS-laskenta

KYA-S1-palvelu laskee istunnon elävän luottamuspistemäärän TRS ∈ [0, 100] perustuen:

- **IDV:** Onko agentin taustahenkilön identiteetti ja käyttöoikeus voimassa?
- **BHM:** Onko agentin ajonaikaisessa käyttäytymisessä havaittu poikkeamia viimeisen 10 minuutin aikana?
- **TRS History:** Paljonko aikaa on kulunut edellisestä arvioinnista?

### 3. Eksklusiivinen reititys (XOR Gateway)

BPMN-prosessi käyttää KYA-S1:n palauttamaa TRS-arvoa ehtolausekkeessa (_Sequence Flow Expression_). Alla käytetty kynnysarvo **85 on havainnollistava esimerkki** — KYA-S1 §6.2 (TRS-2) edellyttää dokumentoitua kynnysarvoa, muttei sido tiettyyn lukuun; oikea arvo asetetaan toimialan ja teon seurausvakavuuden mukaan:

- **Automaattipolku (TRS ≥ 85):** Prosessi jatkuu välittömästi automaattisena `Service Task` -tehtävänä. DWS IQ Skilled Agent suorittaa transaktion millisekunnissa.
- **HIC-poikkeamapolku (TRS < 85):** Prosessi haarautuu välittömästi `User Task` -muotoon. Tehtävä ilmestyy operaattorin _Single Pane of Glass_ -dashboardille. Prosessi pysähtyy turvallisesti odottamaan ihmisen kuittausta.

### 4. Päätöksentekojälki World Modeliin (PRV)

Olipa valittu polku automaattinen tai ihmisen ohjaama, BPMN-moottori lähettää suorituksen tuloksen ja kryptografisen allekirjoituksen **Lifetime World Modeliin**. Tämä täyttää KYA-S1:n _Memory & Decision Provenance_ (PRV) -vaatimuksen — täsmällisesti kohdan **PRV-2 (Decision replay)**: prosessi voidaan ajaa uudelleen samat syötteet todentaen vuosienkin päästä.

---

## Miksi tämä on KYA-spesifikaation ydinarvo?

Perinteisessä automaatiossa agentille annetaan joko 0 % tai 100 % valtuutus. Jos jotain menee pieleen, ainoa keino on sammuttaa koko järjestelmä.

Kytkemällä BPMN 2.0 -moottori ja KYA-S1 TRS toisiinsa saavutetaan **dynamiikka**:

1. **Ei turhia katkoja:** Kun kaikki muuttujat ovat vihreällä, DWS IQ -agentit pyörittävät teollisuusprosessia täydellä teholla.
2. **Automaattinen suojaus:** Jos agentin ympäristössä tapahtuu poikkeama tai valtuutus vanhenee, luottamuspisteet putoavat välittömästi. Järjestelmä ei kaadu, vaan _siirtää päätöksenteon pehmeästi ihmiselle (Human-in-Command)_.

Tämä on se täsmällinen syy, miksi autoimme luomaan tämän spesifikaation: se tekee lakisääteisestä ihmisen johtamisvelvoitteesta toimintavarmaa ohjelmistoarkkitehtuuria.

---

## Lyhyesti (TL;DR)

- **BPMN 2.0** ohjaa prosessin kulkua, **KYA-S1 TRS** määrittelee agentin luottamustason jokaisessa vaiheessa.
- **DWS IQ Skilled Agent** suorittaa tehtävän vain silloin, kun TRS ylittää dokumentoidun kynnysarvon.
- Jos pisteet alittavat rajan, prosessi reitittyy automaattisesti ihmisen hyväksyttäväksi HIC-dashboardille.
- Tuloksena on aukoton auditointijälki (PRV) ja täydellinen hallinta ilman turhaa manuaalityötä.
