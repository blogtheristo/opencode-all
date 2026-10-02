---
slug: kya-s1-sanasto-glossary.fi
title: "KYA-S1 Sanasto — KYA (Know Your Agent): Käsitteistö ja sanasto"
series: "KYA-S1 -blogisarja"
part: 12
parts_total: 12
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-09
hero_image: ../static/images/blog/kya-s1-series-01-hero-fi.png
hero_image_alt: "Sarjakartta: KYA-S1 -blogisarjan 12 osaa"
Status: REAPPROVAL_NEEDED
reapproval_note: text corrected 30.09.2026 by external sourcing (BLOG_STANDARD §17); previously APPROVED. The published page is unchanged.
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — kanoninen Ground Truth -teksti
source: HIC-kirjoittama Ground Truth. Sisältö tallennettu sanatarkasti; kolme käännösvirhettä korjattu ja merkitty (ks. corrections).
note: >-
  Sarjan osa 12/12. Sarja kasvoi 11-osaisesta 12-osaiseksi tämän lisäyksen myötä —
  osien 1-11 julkaistut sivut sanovat yhä "1/11 … 11/11" ja niiden sarjaindeksistä
  puuttuu osa 12. Numerointi on päivitettävä 15 julkaistuun sivuun.
  Sama sanasto on kanonisoitu ontologiaan: ONTOLOGY.md §16 (v1.6).
  Normatiivinen lähde on Legal/KYA_S1.md v1.5; sanasto on kuvaileva ja väistyy sen tieltä.
corrections:
  - "SV/BHM: 'Beteendemodellering i speltid' → 'vid körning' (speltid = peliaika/kesto, ei ohjelmiston ajonaika)"
  - "FR/TC4: 'Termination de chaîne' → 'Terminaison de chaîne' (termination ei ole ranskaa tässä merkityksessä)"
  - "DE/TRS: 'Vertrauenspunkt' → 'Vertrauenswert' (Punkt = piste sijaintina, ei pistemäärä)"
claims_checked: 2026-09-30
sources:
  - title: "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act)"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union"
    url: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
    type: regulation
  - title: "Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment"
    authors: "High-Level Expert Group on Artificial Intelligence"
    year: 2020
    venue: "European Commission"
    url: https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment
    type: standard
  - title: "European Digital Identity Wallet — Architecture and Reference Framework (ARF)"
    authors: "European Commission and European Digital Identity Cooperation Group"
    year: 2026
    venue: "eu-digital-identity-wallet (GitHub)"
    url: https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework
    type: standard
  - title: "Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection"
    authors: "Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., Fritz, M."
    year: 2023
    venue: "arXiv"
    url: https://arxiv.org/abs/2302.12173
    type: academic
  - title: "MCPTox: A Benchmark for Tool Poisoning Attack on Real-World MCP Servers"
    authors: "Wang, Z., Gao, Y., Wang, Y., Liu, S., Sun, H., Cheng, H., Shi, G., Du, H., Li, X."
    year: 2025
    venue: "arXiv"
    url: https://arxiv.org/abs/2508.14925
    type: academic
  - title: "The Balkanization of Execution-Security Research for AI Coding Agents: Isolation, Access Control, and Time-of-Check-to-Time-of-Use Vulnerabilities"
    authors: "Rashidi, M."
    year: 2026
    venue: "arXiv"
    url: https://arxiv.org/abs/2607.05743
    type: academic
  - title: "International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025)"
    authors: "Financial Action Task Force (FATF)"
    year: 2025
    venue: "FATF"
    url: https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html
    type: standard
---

# KYA-S1 Sanasto — KYA (Know Your Agent): Käsitteistö ja sanasto

Blogi 12/12 · DWS IQ & Lifetime World Model · 9. elokuuta 2026 · Risto Anton Päärni

Tämä sanasto kokoaa yhteen KYA-S1 Specification v1.3 -turvallisuusstandardin, DWS IQ -alustan ja KYA-arkkitehtuurin keskeiset termit, kontrollit, varmuustasot sekä tekniset mekanismit.

## 1. Ydinkäsitteet ja standardit

**KYA (Know Your Agent)**
Tekoälyagenttien ajonaikaisen käyttäytymisen, identiteetin, toimintamandaatin ja turvallisuuden varmentava hallintakehikko (KYC-periaatteen [7] vastine tekoälymaailmassa).

**KYA-S1 Specification v1.3**
Tekoälyagenttien ajonaikaisen turvallisuuden ja hallinnan Lifetime Oy:n julkaisema standardiehdotus/spesifikaatio, joka määrittelee 7 kontrollialuetta, 3 varmuustasoa (KYA-AL) sekä auditoitavuusvaatimukset.

**Evidence Meta-Rule (§3)**
KYA-S1-spesifikaation ehdoton sääntö, joka kieltää itsearvioinnin (self-attestation) hyväksymisen yhteensopivuustodisteeksi. Hyväksyttäväksi todisteeksi kelpaa vain kolmannen osapuolen auditointiraportti tai kryptografisesti allekirjoitettu alustatelemetria.

**Agentic Commerce**
Tekoälyagenttien välinen autonominen kaupankäynti-, hankinta- ja maksuliikenneprotokolla, jossa transaktiot suojataan KYA-S1-valtuutuksin.

## 2. KYA-S1 -kontrollialueet (7 pääkontrollia)

| Kontrolli | Nimi                        | Kuvaus ja tarkoitus                                                                                                                                                             |
| --------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **IDV**   | Identity Verification       | **Todennettu ihmisjohtajan sidos:** Kytkee jokaisen agenttisession, työkaluvaatimuksen ja päätöksen kryptografisesti varmennettuun ihmiseen (IDV-1..4).                         |
| **REG**   | Capability Registration     | **Kyvykkyysmanifesti ja rekisteri:** Määrittelee agentin sallitut työkalut, API-osoitteet ja suoritusrajat (REG-1..2) ennen kuin agentti päästetään ajoon.                      |
| **BHM**   | Behavioral Modeling         | **Ajonaikainen käyttäytymisen valvonta:** Seuraa agentin suorituspolkuja reaaliaikaisesti ja havaitsee poikkeamat (esim. prompt injection [4] tai työkalumyrkytys [5]).         |
| **TC4**   | Chain Termination           | **Ketjun keskeytys / hätäjarru:** Suorittaa agenttiketjun atomisen eliminoinnin (leash snap) ja mitätöi aktiiviset valtuutusavaimet pika-ajassa.                                |
| **FLT**   | Fault Attribution           | **Aikarajoitettu virheattribuutio:** Tuottaa allekirjoitetun luokittelun virheen syystä 72 tunnissa tapauksen sulkemisesta (FLT-4).                                             |
| **TRS**   | Trust Score & Authorization | **Luottamuspiste ja valtuutus:** Laskee ajonaikaisen luottamustason (TRS) ja myöntää atomiset suoritusluvat.                                                                    |
| **PRV**   | Provenance & Audit Trail    | **Päätösten toistettavuus ja auditointijälki:** Tallentaa päätöksentekoketjun, mallitilan ja ihmisohjauksen kuittauksen (PRV-4) muuttumattomaan historiatietoon (PRV-2 Replay). |

## 3. KYA-S1:n KYA-AL-varmuustasot (Assurance Levels)

| Varmuustaso            | Auditointitiheys       | Todisteiden vaadittu syvyys                                                      | SLA-reagointiaika (IDV & TC4) | PRV-replay saatavuus |
| ---------------------- | ---------------------- | -------------------------------------------------------------------------------- | ----------------------------- | -------------------- |
| **KYA-AL1 (Standard)** | Vuotuinen auditointi   | Kolmannen osapuolen auditointi vähintään 1 alueella + allekirjoitettu telemetria | Enintään 15 minuuttia         | 30 päivää            |
| **KYA-AL2 (Enhanced)** | Neljännesvuosittainen  | Auditointi IDV- ja BHM-alueilla + 12 kk allekirjoitettu telemetria               | Enintään 5 minuuttia          | 7 päivää             |
| **KYA-AL3 (Critical)** | Jatkuva reaaliaikainen | Ulkopuolinen arvioija kaikilla 7 alueella + allekirjoitettu SLA                  | Enintään 60 sekuntia          | 24 tuntia            |

## 4. Tekniset mekanismit ja ajonaikaiset käsitteet

**Lease Token (TRS-4)**
Kertakäyttöinen, aikaan sidottu ja kryptografisesti allekirjoitettu valtuutusavain. Agentin delegaatti kuluttaa tokenin atomisesti `consumeAndExecute`-kutsulla suorituksen alussa, mikä estää kilpailutilanteet (race condition, TOCTOU) [6] ja kaksoisveloitukset.

**Fail-Closed (TRS-5)**
Vikaturvallisuusperiaate, joka estää automaattisuorituksen ja reitittää tehtävän poikkeuksetta ihmiselle (User Task / HIC Dashboard), jos luottamusmoottori (Trust Engine) ei vastaa aikarajassa (esim. > 500 ms) tai palauttaa virheen.

**Leash Snap / hätäjarru (TC4)**
Suoritusketjun atominen katkaisu, joka pysäyttää moniagenttisen ajon ja mitätöi kaikki aktiiviset Lease Tokenit välittömästi.

**Capture Precedes Release (TC4-5)**
KYA-S1-periaate, jossa suoritusympäristön tila ja forensinen auditointidata tallennetaan muistiin ennen kuin virtuaaliresursseista luovutaan hätäjarrutuksessa.

**Bounded Attribution Clock (FLT-4)**
Prosessi, joka takaa virhetilanteen syyn sitovan luokittelun 72 tunnissa insidentin sulkemisesta viiteen kategoriaan: kielimallivirhe, sovelluslogiikkavirhe, integraatiovirhe, ihmisen syötevirhe tai konfiguraatiovirhe.

**TRS (Trust Score)**
Agentin ajonaikainen luottamuspistemäärä (asteikolla 0–100 eli 0.00–1.00), johon vaikuttavat taustahenkilön tunnistus, BHM-käyttäytymishistoria ja alustan eheys.

**TRS_req (riskikynnys)**
Tehtäväkohtaisesti määritelty vähimmäisluottamustaso, joka agentin on saavutettava saadakseen automaattisen suoritusluvan.

## 5. Prosessi- ja integraatiokäsitteet

**HIC (Human-in-Command)**
Ihmisen todellinen johtamis-, valvonta- ja kumoamisvalta tekoälyprosessissa. Termi on EU:n tekoälyn korkean tason asiantuntijaryhmän eettisistä ohjeista [2]; EU AI Actin artikla 14 edellyttää korkean riskin järjestelmiltä tehokasta ihmisen valvontaa [1].

**HIC Dashboard / Single Pane of Glass**
Ihmisjohtajan yhtenäinen valvomonäkymä, josta poikkeamat, TRS-pisteet ja ihmisen kuittausta vaativat tehtävät (User Tasks) hallitaan.

**Human Decision Provenance (PRV-4)**
Auditoitava merkintä ihmisoperaattorin tekemästä kuittauksesta, joka sisältää annetun sanallisen perustelun, ihmisen eIDAS-identiteetin ja kuittaushetken tilannekuvan.

**BPMN 2.0 Engine**
Suoritettava prosessimoottori (esim. Camunda), joka ohjaa työnkulun ajonaikaisesti automaattiselle kaistalle (Service Task) tai ihmiselle (User Task) agentin TRS-pisteiden perusteella.

**EUDI Wallet / eIDAS 2.0**
EU:n virallinen digitaalinen lompakko, johon ihmisjohtajan perusidentiteetti (IDV-1) ja nimenkirjoitusoikeus (QEAA/QES) ankkuroidaan viranomaistasolla [3].

## 6. Viiden kielen käännöstaulukko

Suomi on Ground Truth; muut neljä ovat käännöksiä siitä.

| Termi / koodi                         | Suomi (FI) — Ground Truth                  | English (EN)                                 | Svenska (SV)                               | Deutsch (DE)                             | Français (FR)                                         |
| ------------------------------------- | ------------------------------------------ | -------------------------------------------- | ------------------------------------------ | ---------------------------------------- | ----------------------------------------------------- |
| **KYA**                               | Agentin tunnistaminen                      | Know Your Agent                              | Känn din agent                             | Kenne deinen Agenten                     | Connaissez votre agent                                |
| **KYA-S1 Specification**              | KYA-S1-turvallisuusspesifikaatio           | KYA-S1 Security Specification                | KYA-S1 Säkerhetsspecifikation              | KYA-S1 Sicherheitsspezifikation          | Spécification de sécurité KYA-S1                      |
| **Evidence Meta-Rule (§3)**           | Näyttömetasääntö (§3)                      | Evidence Meta-Rule (§3)                      | Bevis-metaregel (§3)                       | Evidenz-Metaregel (§3)                   | Méta-règle de preuve (§3)                             |
| **Agentic Commerce**                  | Autonominen agenttikaupankäynti            | Agentic Commerce                             | Agentisk handel                            | Agenten-Handel                           | Commerce agentique                                    |
| **IDV**                               | Todennettu ihmisjohtajan sidos             | Verified Human Principal Binding             | Verifierad mänsklig huvudmannakoppling     | Verifizierte menschliche Hauptverbindung | Liaison d'agent à un responsable humain vérifié       |
| **REG**                               | Kyvykkyysmanifesti ja rekisteri            | Capability Manifest & Registry               | Kapacitetsmanifest och register            | Fähigkeitsmanifest & Register            | Manifeste et registre des capacités                   |
| **BHM**                               | Ajonaikainen käyttäytymisen valvonta       | Runtime Behavioral Modeling                  | Beteendemodellering vid körning            | Laufzeit-Verhaltensmodellierung          | Modélisation comportementale en temps réel            |
| **TC4**                               | Ketjun keskeytys / hätäjarru               | Chain Termination / Leash Snap               | Kedjeavslutning / nödbroms                 | Kettenabbruch / Notbremse                | Terminaison de chaîne / frein d'urgence               |
| **FLT**                               | Aikarajoitettu virheattribuutio            | Bounded Fault Attribution                    | Tidsbegränsad felattribuering              | Zeitbegrenzte Fehlerattribuierung        | Attribution limitée des fautes                        |
| **TRS**                               | Luottamuspiste ja valtuutus                | Trust Score & Authorization                  | Förtroendepoäng och auktorisering          | Vertrauenswert & Autorisierung           | Score de confiance et autorisation                    |
| **PRV**                               | Päätösten toistettavuus ja auditointijälki | Decision Provenance & Audit Trail            | Beslutsursprung och granskningskedja       | Entscheidungsherkunft & Prüfpfad         | Provenance de la décision et piste d'audit            |
| **KYA-AL1**                           | Vakiotaso                                  | Standard Assurance                           | Standardgaranti                            | Standard-Garantie                        | Assurance standard                                    |
| **KYA-AL2**                           | Laajennettu taso                           | Enhanced Assurance                           | Förhöjd garanti                            | Erweiterte Garantie                      | Assurance renforcée                                   |
| **KYA-AL3**                           | Kriittinen taso                            | Critical Assurance                           | Kritisk garanti                            | Kritische Garantie                       | Assurance critique                                    |
| **Lease Token (TRS-4)**               | Kertakäyttöinen valtuutusavain             | Atomic Single-Use Lease Token                | Atomisk tidsbegränsad nyttjanderätts-token | Atomares Einmal-Autorisierungs-Token     | Jeton de bail atomique à usage unique                 |
| **Fail-Closed (TRS-5)**               | Pakkosuojaus vikatilanteessa               | Fail-Closed Protection                       | Säker vid fel (fail-closed)                | Fehlersichere Sperre (fail-closed)       | Verrouillage en cas de défaillance                    |
| **Leash Snap (TC4)**                  | Hätäjarru                                  | Leash Snap Emergency Stop                    | Nödbroms                                   | Notbremse                                | Frein d'urgence                                       |
| **Capture Precedes Release (TC4-5)**  | Tallennus ennen resursseista luopumista    | Capture Precedes Release                     | Lagring före frigörande                    | Erfassung vor Freigabe                   | Capture avant libération des ressources               |
| **Bounded Attribution Clock (FLT-4)** | Aikarajoitettu virheattribuutio (72 h)     | Bounded Attribution Clock (72 h)             | Tidsbegränsad felattribuering (72 h)       | Zeitbegrenzte Fehlerattribuierung (72 h) | Horloge d'attribution limitée (72 h)                  |
| **HIC**                               | Ihmisen johtamisvalta                      | Human-in-Command                             | Mänsklig ledningsrätt                      | Menschliche Führung                      | Commandement humain                                   |
| **Single Pane of Glass**              | Yhtenäinen valvomonäkymä                   | Single Pane of Glass HIC Dashboard           | Enhetlig kontrollvy                        | Zentrales Kontrollpanel                  | Panneau de contrôle unique                            |
| **Human Decision Provenance (PRV-4)** | Ihmispäätöksen alkuperä ja kuittaus        | Human Decision Provenance                    | Mänskligt beslutsursprung                  | Menschliche Entscheidungsherkunft        | Provenance de la décision humaine                     |
| **EUDI Wallet / eIDAS 2.0**           | EU:n digitaalinen lompakko / eIDAS 2.0     | European Digital Identity Wallet / eIDAS 2.0 | EU:s digitala plånbok / eIDAS 2.0          | Digitale EU-Brieftasche / eIDAS 2.0      | Portefeuille d'identité numérique de l'UE / eIDAS 2.0 |

### Kolme korjattua käännöstä

Merkitään, ei korjata hiljaisesti:

1. **SV / BHM:** "Beteendemodellering i speltid" → **"vid körning"**. _Speltid_ tarkoittaa peliaikaa tai elokuvan kestoa, ei ohjelmiston ajonaikaa.
2. **FR / TC4:** "Termination de chaîne" → **"Terminaison de chaîne"**. _Termination_ ei ole ranskaa tässä merkityksessä.
3. **DE / TRS:** "Vertrauenspunkt" → **"Vertrauenswert"**. _Punkt_ on piste sijaintina, ei pistemäärä.

## Katso sarjan muut osat

- **Osa 1:** Tunne agenttisi (KYA-S1) — Yksi allekirjoitettu sivu tekoälystä tietoturvakansiossa, joka koskee dataasi
- **Osa 2:** KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä
- **Osa 3:** EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita
- **Osa 4:** Agenttiluokat: Kehittäjän GitHub Copilot vs. teollisuuden DWS IQ -tausta-agentit
- **Osa 5:** KYA-S1 ja BPMN 2.0: Miten tekoälyagentin luottamustaso ohjaa teollisuusprosessia käytännössä?
- **Osa 6:** KYA-S1 v1.3 × BPMN 2.0: Atominen Lease Token, fail-closed ja rehellinen TRS-laskenta
- **Osa 7:** Kun jotain menee pieleen: 72 tunnin virheluokittelu (FLT) ja päätöksen toistaminen (PRV) käytännössä
- **Osa 8:** KYA-S1 Ekosysteemi & Tuotanto-Roadmap
- **Osa 9:** Lifetime World Model (LWM) — Globaali tilarekisteri ja muisti
- **Osa 10:** Agentic Commerce -protokollat & Autonomiset Maksut
- **Osa 11:** Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0
- **Osa 12:** KYA-S1 Sanasto — Käsitteistö ja sanasto

---

Risto Anton Päärni

Perustaja & toimitusjohtaja, Lifetime Oy

Päätoimittaja, Lifetime Scope Journal

## Lähteet

[1] European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[2] High-Level Expert Group on Artificial Intelligence (2020). Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment. European Commission. https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment

[3] European Commission and European Digital Identity Cooperation Group (2026). European Digital Identity Wallet — Architecture and Reference Framework (ARF). eu-digital-identity-wallet (GitHub). https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework

[4] Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., Fritz, M. (2023). Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection. arXiv. https://arxiv.org/abs/2302.12173

[5] Wang, Z., Gao, Y., Wang, Y., Liu, S., Sun, H., Cheng, H., Shi, G., Du, H., Li, X. (2025). MCPTox: A Benchmark for Tool Poisoning Attack on Real-World MCP Servers. arXiv. https://arxiv.org/abs/2508.14925

[6] Rashidi, M. (2026). The Balkanization of Execution-Security Research for AI Coding Agents: Isolation, Access Control, and Time-of-Check-to-Time-of-Use Vulnerabilities. arXiv. https://arxiv.org/abs/2607.05743

[7] Financial Action Task Force (FATF) (2025). International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025). FATF. https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html
