---
slug: lifetime-world-model-ja-teollisuuden-prosessimallit
title: "Lifetime World Model ja teollisuuden prosessimallit"
subtitle: "DWS IQ -agentit tarvitsevat maailmanmallin — ISA-95, BPMN, SysML ja VSM siltana"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-07
Status: DRAFT
source: HIC-kirjoittama teksti (sessio claude/agent-use-cases-comparison-h7vl25)
series: Kolmas osa sarjassa "HIC-hallintamalli ja DWS IQ -agentit"
open_issue: |
  TERMISTÖRISTIRIITA (Sääntö 7 — ratkaistava ennen julkaisua). DWS_TRUTH_STANDARD.md rivi 20
  määrittelee Lifetime World Model (LWM) -termin toimialakohtaiseksi, yrityskohtaisesti
  hienosäädetyksi mallipohjaksi ("each industry carries its own ontology + Lifetime World Model
  (LWM) base, fine-tuned per enterprise"). Tämä teksti käyttää samaa termiä eri merkityksessä:
  reaaliaikaisena tila- ja luottamusrekisterinä (IDV/TRS/PRV-selkäranka). Nämä ovat eri asioita.
  Vaihtoehdot: (a) käytä hallintakerroksesta eri nimeä, (b) laajenna rivin 20 kanoninen määritelmä
  kattamaan molemmat kerrokset. Älä julkaise ennen kuin valinta on tehty ja kanoni päivitetty.
---

# Lifetime World Model ja teollisuuden prosessimallit

Kun yhdistetään DWS IQ -automaatio-organisaatio (`dws10.com`) ja Lifetime World Model, luodaan teollisuudelle jotain erittäin tehokasta: suorituskykyiset tausta-agentit yhdistettynä aukottomasti hallittuun ja todennettavaan maailmantilaan.

Pelkkä tekoälyagentti (kuten DWS IQ Skilled Agent) on vain "älykäs moottori". Se tarvitsee toimiakseen maailmanmallin (World Model) — yhtenäisen tilannekuvan siitä, mikä on järjestelmien tila, kuka tekee mitä, millä valtuuksilla ja mitä seurauksia teoilla on.

Tässä on kuvaus siitä, miten Lifetime World Model valjastetaan teollisuuden prosessimallien avulla DWS IQ -ympäristössä:

## 1. Synergia: DWS IQ Engine + Lifetime World Model

- **DWS IQ (`dws10.com`):** Toimii suorittavana kätenä. Se tuo erikoistuneet tausta-agentit (Skilled Agents), jotka yhdistävät dataa, ajavat työnkulkuja ja suorittavat teollisia taustaprosesseja.
- **Lifetime World Model:** Toimii valvovana ja muistavana aivokuorena. Se pitää yllä järjestelmän reaaliaikaista tilannekuvaa, KYA-S1-tunnistusta (IDV), luottamuspisteitä (TRS) ja päätöksentekohistoriaa (PRV).

Prosessimallit toimivat tässä siltana: ne kääntävät liiketoiminnan ja tuotannon tarpeet kielelle, jota sekä ihminen, DWS IQ -agentit että Lifetime World Model ymmärtävät.

## 2. Maailmanmallin hyödyntäminen prosessimalleissa

### A. ISA-95: Maailmanmalli vertikaalisena "luottamusselkärankana"

Teollisuudessa suurin haaste on tiedon ja valtuutusten katkeaminen hallintotasojen välillä (ERP vs. MES vs. SCADA).

- **Hyödyntäminen:** Lifetime World Model sijoitetaan horisontaalisesti koko ISA-95-pyramidin läpi.
- **Käytäntö:** Kun DWS IQ -agentti tekee päätöksen MES-tasolla (Taso 3), se tarkistaa Lifetime World Modelista reaaliaikaisesti toiminnan tason ja ihmisvaltuutuksen (IDV/TRS), joka on peräisin ERP/HR-tasolta (Taso 4). Agentti ei toimi "sokkona" omassa siilossaan.

### B. BPMN 2.0: Dynamiikkaa ja HIC-haarautumista luottamuksen mukaan

BPMN-kaaviot määrittelevät DWS IQ -agenttien etenemisreitit.

- **Hyödyntäminen:** BPMN-prosessin ehtohaaroihin kytketään Lifetime World Modelin elävä Trust Score (TRS).
- **Käytäntö:**
  - **TRS ≥ 85** → DWS IQ Agent suorittaa tehtävän automaattisesti (_Service Task_)
  - **TRS < 85** → BPMN reitittää tehtävän ihmisen hyväksyttäväksi (_User Task_ / HIC)

  Ihmisen tekemä kuittaus myöntää väliaikaisen valtuutuksen, joka päivittyy välittömästi takaisin Lifetime World Modeliin.

### C. SysML: Kyber-fyysiset turvarajat ja tilakoneet

Raskaassa teollisuudessa agentti ei saa ajaa fyysistä laitetta laitteiston kynnysarvojen yli.

- **Hyödyntäminen:** SysML-tilakoneet (_State Machines_) määrittelevät fyysiset turvarajat, joita DWS IQ -agentti ei saa ylittää.
- **Käytäntö:** Jos DWS IQ -agentti havaitsee poikkeaman tuotannossa, se kuulee World Modelin tilaa. Mikäli maailmanmalli ilmoittaa järjestelmävirheestä, SysML-malli ajaa prosessin hallittuun vikasietotilaan (_Safe State_) ja aktivoi välittömästi KYA-S1 hätäjarrun (TC4).

### D. VSM (Value Stream Mapping): Hukan poisto ilman auditointiriskiä

Lean-tuotannossa etsitään kohtia, joissa prosessi seisoo odottamassa ihmisen manuaalista kuittausta tai tiedonsiirtoa.

- **Hyödyntäminen:** VSM-analyysilla tunnistetaan arvoketjun pullonkaulat ja korvataan manuaalivaiheet DWS IQ Skilled Agenteilla.
- **Käytäntö:** Koska jokainen DWS IQ -agentin teko tallentuu Lifetime World Modeliin (PRV), läpimenoaikaa saadaan lyhennettyä rajusti ilman, että menetetään laadunhallinnan tai viranomaissääntelyn edellyttämää aukotonta jäljitettävyyttä.

## 3. Lopputulos: Hallittava ja skaalautuva teollisuusautomaatio

Kun `dws10.com`-ympäristöön tuodaan Lifetime World Model näiden prosessimallien kautta:

1. **Dashboard (Single Pane of Glass):** Ihminen johtaa kokonaisuutta yhdestä näkymästä, jossa näkyvät sekä BPMN-työnkulut, käynnissä olevat DWS IQ -agentit että niiden KYA-luottamustasot.
2. **Käänteentekevä riitatilanteiden ratkaisu:** Jos tuotantoseisokki tai virhe tapahtuu, KYA-S1:n FLT-luokittelu (_Fault Attribution_) ja World Modelin historiatiedot osoittavat 72 tunnissa, oliko kyseessä laiteyhteysvirhe, mallin poikkeama vai ihmisen antama virheellinen syöte.
