---
slug: flt-72h-virheluokittelu-ja-prv-paatoksen-toistaminen
title: "Kun jotain menee pieleen: 72 tunnin virheluokittelu (FLT) ja päätöksen toistaminen (PRV) käytännössä"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
hero_image: ../static/images/blog/kya-s1-series-01-hero-fi.png
hero_image_alt: "Sarjakartta: KYA-S1 -blogisarjan 12 osaa"
Status: APPROVED
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — "Osat 5, 6, 7 ja 11 hyväksytään virallisesti"
series: "KYA-S1 -blogisarja"
part: 7
parts_total: 12
source: HIC-kirjoittama teksti (sessio claude/agent-use-cases-comparison-h7vl25)
display_series: "Blogi 7/12 · DWS IQ & Lifetime World Model"
editorial_fixes: |
  Neljä terminologiakorjausta Legal/KYA_S1.md:tä vasten (Sääntö 12 — kerrotaan ääneen):
  1. FLT = "Fault Attribution" (§6.1), ei "Fault Triaging". Viisi virheluokkaa täsmäävät
     FLT-1:een sellaisenaan — vain domainin nimi oli väärin.
  2. TC4 = "Trust Collapse Response & Chain Termination" (§5.4), EI "Targeted Cascade
     Cut-off". Merkitysero on olennainen: TC4 laukeaa luottamuksen romahduksesta, ei
     kohdennetusta katkaisupäätöksestä. Talon vakiintunut kansankielinen nimi on
     "leash snap" (TC4-2).
  3. PRV = "Memory & Decision Provenance" (§6.3), ei "Reproducibility". Toistettavuus on
     PRV-2 (Decision replay), yksi kolmesta vaatimuksesta — ei koko domainin nimi.
     Sama korjaus tehtiin luonnokseen 5.
  4. 72 tunnin kello: FLT-2 laskee sen tapauksen SULKEMISESTA ("within 72 hours of
     incident close"), ei havaitsemisesta. Teksti lupasi tiukemman aikarajan kuin
     spesifikaatio — julkisena lupauksena se olisi ollut ylilupaus.
  Lisäksi: "cryptografisesti" → "kryptografisesti".
open_decisions: |
  1. Sarjan numerointi: tämä on HIC:n merkinnällä "Blogi 6", mutta edellinen BPMN-XML-osa
     on myös numeroitu 6:ksi. Alaviitteen "Katso myös" -lista viittaa kuuteen osaan.
     Numerointi lukittava ennen julkaisua — nyt kaksi eri tekstiä kantaa numeroa 6.
  2. "Katso myös" -listan osat 1–3 viittaavat teksteihin, joita ei ole tässä repossa
     luonnoksina. Tarkistettava, ovatko ne jo julkaistuja vai vielä kirjoittamatta,
     ennen kuin linkkilista julkaistaan.
---

# Kun jotain menee pieleen: 72 tunnin virheluokittelu (FLT) ja päätöksen toistaminen (PRV) käytännössä

_DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni_

---

## Johdanto: Rehellinen katse poikkeamatilanteisiin

Edellisessä kirjoituksessa koodasimme BPMN 2.0 -prosessimoottoriin ohjausmekanismin, joka ei jätä rakoa: atomisen **Lease Tokenin**, tehtäväkohtaiset TRS_req-kynnysarvot ja **fail-closed**-pakkosuojauksen.

Vaikka tekninen arkkitehtuuri olisi kuinka tiivis, teollisuusympäristössä on hyväksyttävä yksi rehellinen tosiasia:

**Ennen pitkää jokin menee vikaan.**

Tekoäly mallintaa poikkeavan tilanteen väärin, taustajärjestelmän tietokantayhteys katkeaa kesken transaktion, kenttälaite syöttää korruptoitunutta dataa, tai ihminen antaa virheellisen syötteen.

KYA-S1-spesifikaatiossa kysymys ei ole siitä, tapahtuuko virhe. Kysymys kuuluu: **mitä tapahtuu 72 tuntia sen jälkeen, kun tapaus on suljettu?**

---

## FLT (Fault Attribution): 72 tunnin kello

Sopimusmaailmassa suurin kustannus virheen sattuessa ei yleensä ole itse tekninen vika, vaan viikkoja tai kuukausia kestävä lakimiesten ja toimittajien "eipäs–juupas"-väittely siitä, kenen vastuulla vahinko oli.

KYA-S1:n **FLT-periaate (Fault Attribution)** poistaa tämän epävarmuuden. Poikkeaman jälkeen järjestelmä tuottaa allekirjoitetun vastuuluokittelun **72 tunnin sisällä tapauksen sulkemisesta** (FLT-2), viiteen kategoriaan:

| Virheluokka              | Kuvaus                                                                | Vastuun kohdistus                   |
| ------------------------ | --------------------------------------------------------------------- | ----------------------------------- |
| **1. Model Fault**       | Kielimallin hallusinaatio, stokastinen virhe tai odottamaton ulostulo | Mallitoimittaja / LLM Provider      |
| **2. Logic Fault**       | DWS IQ -agentin sovelluslogiikan tai prompt-rakenteen koodivirhe      | Agenttiohjelmiston toimittaja       |
| **3. Integration Fault** | API-yhteysvirhe, verkkoviive, timeout tai tietokantakatko             | Infra- / integraatiotoimittaja      |
| **4. Operator Fault**    | Ihmisoperaattorin antama virheellinen tai puutteellinen syöte         | Tilaaja / käyttäjäorganisaatio      |
| **5. Policy Fault**      | Säännöstön, rajoituksen tai valtuutuksen konfiguraatiovirhe           | Sääntöarkkitehti / turvallisuuselin |

Tämän luokittelun ansiosta vastuunjako lakkaa olemasta kuluttava lakitekninen väittely ja muuttuu täsmälliseksi hakukyselyksi.

---

## PRV (Memory & Decision Provenance): tekoälyn aikakone

Jotta FLT-luokittelu voidaan tehdä puolueettomasti, tarvitaan kovaa teknistä todisteaineistoa. Tässä kohtaa **Lifetime World Model** astuu peliin.

Edellisen osan BPMN-mallissa PRV-kirjaus oli oma `Service Task`, johon **molemmat** polut — agentin suoritus ja ihmisen kuittaus — yhtyvät. Aina kun DWS IQ -agentti suorittaa tehtävän tai se ohjautuu HIC-dashboardille, World Modeliin tallennetaan kryptografisesti allekirjoitettu tilavedos:

1. **Alkuperäiset syötteet:** täsmälleen se data ja konteksti, joka agentille syötettiin
2. **Luottamustila (TRS-snapshot):** agentin TRS-pistemäärä ja IDV-tila suoritushetkellä
3. **Käytetty Lease Token:** todiste siitä, että suorituslupa oli voimassa ja atomisesti kulutettu
4. **Mallin tila:** malliversio, lämpötilaparametri ja järjestelmäkehotteet

Tämä mahdollistaa **PRV-2:n (Decision replay)**. Vaikka varsinainen tekoälymalli päivittyisi tai vaihtuisi kahden vuoden kuluttua, alkuperäinen päätöksentekoketju voidaan rekonstruoida täsmälleen samoilla reunaehdoilla.

Mitä agentti tiesi? Millä valtuudella se toimi? Miten se päätyi tulokseen? PRV antaa näihin vastauksen — myös silloin kun päättäjä oli ihminen.

---

## Dominoefektin katkaisu: TC4 ja ketjun terminointi

Teollisuuden moniagenttiympäristöissä yksi DWS IQ -agentti voi käynnistää toisia agentteja. Laadunvalvonta-agentti käynnistää logistiikka-agentin, joka käynnistää tilaus-agentin.

Jos ensimmäisen agentin päätöksessä havaitaan virhe, suurin vaara on **dominoefekti** — virheen monistuminen taustajärjestelmiin.

KYA-S1:n **TC4 (Trust Collapse Response & Chain Termination)** katkaisee ketjun. Talon kansankielinen nimi sille on _leash snap_ (TC4-2):

```
[ DWS IQ Agent A ] ──(Luottamusromahdus havaittu)──> [ KYA-S1 TC4 Trigger ]
                                                  │
                                         (Mitätöi Lease Tokenit)
                                                  │
                                                  ▼
                         ┌─────────────────────────────────────────┐
                         │ ALL DOWNSTREAM AGENTS FROZEN (TC4-2)    │
                         │ Agent B (Logistiikka)  ──> PYSÄYTETTY   │
                         │ Agent C (Tilaus)       ──> PYSÄYTETTY   │
                         └─────────────────────────────────────────┘
                                                  │
                                                  ▼
                         [ Ohjaus siirretty HIC Dashboardille ]
```

1. **TC4-1** — luottamusromahdus havaitaan määritellyllä kynnyksellä ja siitä lähetetään allekirjoitettu tapahtuma.
2. **TC4-2** — ketju terminoidaan atomisesti: rikkova agentti, jokainen sen käynnistämä alempi agentti ja kaikki niiden aktiiviset työkalusessiot. Lease Tokenit mitätöityvät samalla, joten yksikään kesken oleva `Service Task` ei pääse kirjoittamaan tietokantaan.
3. **TC4-4** — koko agentin tila, työkaluhistoria ja päätösjälki säilötään terminointihetkellä forensista tutkintaa varten. Tästä FLT-luokittelu saa aineistonsa.
4. Prosessi siirtyy HIC-dashboardille ihmisoperaattorin hallintaan.

Huomaa järjestys: **todisteet talteen ennen kuin ketju vapautetaan.** Jos TC4-4 jää tekemättä, FLT-luokittelu 72 tunnissa on mahdoton — jäljelle jää vain arvaus.

---

## Yhteenveto: rehellinen tekoälyhallinta teollisuudessa

Tähän päättyy sarjamme KYA-S1-spesifikaatiosta, EU AI Actin HIC-valvontavelvoitteesta ja DWS IQ -agenttien teollisuusautomaatiosta. Kokonaisuus tiivistyy ketjuun:

1. **Yksi allekirjoitettu sivu:** tylsä tietoturvakansio saa vihdoin oman sivunsa tekoälyagentille.
2. **Tekninen luottamus (TRS):** luottamustaso ei ole mittari dashboardilla, vaan BPMN 2.0 -prosessin suora ehto- ja ohjausmekanismi.
3. **Ihmisen johtajuus (HIC):** ihminen johtaa prosessia _Single Pane of Glass_ -näkymästä, ja ohjelmisto takaa, ettei valvonta ole näennäistä.
4. **Aukoton kriisinhallinta (FLT & PRV):** kun asiat menevät pieleen, vastuuluokittelu ja World Modelin historiatiedot pitävät vastuunjaon kirkkaana.

Kun nämä palaset ovat paikoillaan, tekoälyagentit lakkaavat olemasta hallitsematon tietoturvariski — ja muuttuvat siksi, miksi ne on tarkoitettu: **teollisuuden luotettavaksi ja suorituskykyiseksi suoritusportaaksi.**

---

**Risto Anton Päärni**
_Perustaja & toimitusjohtaja, Lifetime Oy_
_Päätoimittaja, Lifetime Scope Journal_
