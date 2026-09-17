---
slug: teollisuuden-prosessikuvaustavat-ja-tekoalyagentit
title: "Teollisuuden prosessikuvaustavat ja tekoälyagentit"
subtitle: "BPMN, VSM, ISA-95, SysML ja SIPOC — mihin kohtaan agentti kiinnittyy"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-07
Status: DRAFT
source: HIC-kirjoittama teksti (sessio claude/agent-use-cases-comparison-h7vl25), KYA-viittaukset tarkistettu Legal/KYA_S1.md §5–6 vasten
series: Jatko-osa kirjoitukselle "HIC-hallintamalli ja DWS IQ -agentit"
---

# Teollisuuden prosessikuvaustavat ja tekoälyagentit

RUP-metodologian (ja UML-kaavioiden) lisäksi teollisuudessa käytetään useita muita vakiintuneita prosessikuvaus- ja mallintamistapoja. Valinta riippuu siitä, tarkastellaanko **liiketoiminta-automaatiota, fyysistä tuotantovirtaa, laite- ja järjestelmäarkkitehtuuria vai laadunhallintaa.**

Tekoälyagenttien (_DWS IQ_, _HIC_, _KYA-S1_) integroinnin kannalta merkittävimmät teollisuuden prosessikuvaustavat ovat:

---

## 1. BPMN 2.0 (Business Process Model and Notation)

**BPMN 2.0** on teollisuuden ja ohjelmistoalojen yhteinen de facto -standardi liiketoiminta- ja työnkulkujen mallintamiseen.

- **Syy suosioon:** BPMN-kaaviot eivät ole vain piirroksia, vaan ne ovat **suoraan suoritettavaa koodia** prosessimoottoreissa (esim. Camunda, Flowable, Zeebe).
- **Kytkentä tekoälyagentteihin:** BPMN on ihanteellinen kieli DWS IQ -agenteille. Työnkulkuun voidaan määritellä tietty vaihe (_Service Task_ eli palvelutehtävä), jonka agentti suorittaa taustalla. Mikäli agentti kohtaa poikkeaman, BPMN-prosessi reitittää tehtävän automaattisesti ihmiselle (_User Task / HIC-valvonta_).

---

## 2. VSM (Value Stream Mapping / Arvovirtakuvaus)

**VSM** on Lean-teollisuuden tärkein työkalu materiaali- ja tietovirtojen visualisointiin toimittajalta asiakkaalle.

- **Syy suosioon:** Se paljastaa tuotantoprosessin hukat, pullonkaulat, varastoarvot ja läpimenoajat.
- **Kytkentä tekoälyagentteihin:** VSM osoittaa täsmällisesti ne kohdat, joissa tieto ei liiku tai joissa ihmiset tekevät rutiininomaista manuaalityötä (esim. tilausten vahvistukset, laatudatan syöttö). Se toimii investointilaskelmana sille, mihin kohtaan prosessia tekoälyagentti kannattaa asentaa.

---

## 3. ISA-95 / IEC 62264 (Teollisuusautomaation hierarkiamalli)

**ISA-95** ei ole perinteinen vuokaavio, vaan teollisuuden järjestelmäarkkitehtuurin ja prosessirajapintojen standardi (ns. _automaatiopyramidi_).

- **Syy suosioon:** Määrittelee, miten tieto liikkuu toiminnanohjauksen (ERP), tuotannonohjauksen (MES), valvonnan (SCADA) ja kenttälaitteiden (PLC/IoT) välillä.
- **Kytkentä tekoälyagentteihin:** ISA-95 määrittelee agentin **toimintatason ja valtuudet (KYA-REG/IDV)**. Agentti, joka toimii MES-tasolla (Taso 3), tarvitsee täysin eri turva- ja reagointiajat kuin agentti, joka koskee suoraan SCADA-ohjaukseen (Taso 2).

---

## 4. SysML (Systems Modeling Language)

**SysML** on UML-kielestä kehitetty laajennus monimutkaisten kyber-fyysisten järjestelmien (laitteisto + ohjelmisto + prosessi + ihminen) mallintamiseen.

- **Syy suosioon:** Erittäin suosittu raskaimmassa teollisuudessa (ilmailu, autoteollisuus, energiasektori, vaativa konepaja).
- **Kytkentä tekoälyagentteihin:** Mallintaa laitteiston ja agentin välistä vuorovaikutusta. Jos DWS IQ -agentti ohjaa laitetta tuotantolinjalla, SysML-rakenne määrittää järjestelmän fyysiset turvarajat ja tilakoneet (_State Machine Diagrams_).

---

## 5. SIPOC (Suppliers, Inputs, Process, Outputs, Customers)

**SIPOC** on Six Sigma -laatuasiantuntijoiden käyttämä korkean tason prosessikartta.

- **Syy suosioon:** Yksinkertainen, yhdelle sivulle mahtuva taulukko, joka rajaa prosessin aloituksen ja lopetuksen täsmällisesti.
- **Kytkentä tekoälyagentteihin:** SIPOC määrittelee kriittiset syötteet (_Inputs_) ja tuotokset (_Outputs_). Kun tekoälyagentti tuodaan osaksi prosessia, SIPOC varmistaa, että agentille syötettävä data ja sen tuottama lopputulos täyttävät KYA-spesifikaation auditointivaatimukset (_PRV/FLT_).

---

## Prosessikuvaustapojen vertailu teollisuudessa

| Menetelmä      | Ensisijainen taso           | Vahvuus tekoälyagenttien & HIC-valvonnan kannalta                                  |
| -------------- | --------------------------- | ---------------------------------------------------------------------------------- |
| **BPMN 2.0**   | Työnkulut & Automaatio      | Suoraan suoritettavissa; helppo kytkeä _Single Pane of Glass_ -dashboardiin.       |
| **VSM (Lean)** | Materiaali- ja tietovirrat  | Osoittaa prosessin hukat ja paikat, joihin agentti tuo suurimman ROI:n.            |
| **ISA-95**     | Järjestelmäarkkitehtuuri    | Määrittelee agentin toimintatason teollisuuspyramidissa (ERP vs. MES vs. SCADA).   |
| **SysML**      | Kyber-fyysiset järjestelmät | Mallintaa laitteiston, ohjelmiston ja agentin fyysisen turvallisuuden yhteispelin. |
| **SIPOC**      | Laadunhallinta & Rajaus     | Varmistaa agentin syöte- ja tuotosdatan laadun sekä rajat ennen toteutusta.        |
| **RUP / UML**  | Järjestelmäkehitys          | Tarjoaa rakenne- ja sekvenssikaaviot agenttien väliselle viestinnälle.             |
