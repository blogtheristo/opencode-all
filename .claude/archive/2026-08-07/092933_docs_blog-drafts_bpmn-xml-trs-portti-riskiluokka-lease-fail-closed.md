---
slug: bpmn-xml-trs-portti-riskiluokka-lease-fail-closed
title: "BPMN 2.0 XML: TRS-portti, riskiluokka, lease ja fail-closed"
subtitle: "Kiinteä raja 85 ei riitä — näin HIC-portti koodataan niin ettei se ole näennäinen"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-07
Status: DRAFT
source: HIC-ohjaus (sessio claude/agent-use-cases-comparison-h7vl25) — neljä kovennusta blogiin 5
series: "Blogi 6/6 · DWS IQ & Lifetime World Model"
open_decisions: |
  Ennen julkaisua HIC:n päätettävä:
  1. Riskiluokkataulukon (R1–R4) kynnysarvot — tässä esitetyt luvut ovat ehdotus, eivät kanonia.
     Jos ne hyväksytään, ne kirjataan Legal/KYA_S1.md §6.2:een ennen kuin blogi julkaisee ne.
  2. Lease-TTL 30 s ja Trust Engine -timeout 2 s: ehdotettuja oletuksia, ei mitattuja.
     Vahvistettava toteutuksesta ennen kuin luvut esitetään julkisesti.
  3. Toteutusalusta: Camunda 7 (esimerkin syntaksi) vs Camunda 8 / Zeebe (eri
     laajennusnimiavaruus). Esimerkki on C7-muodossa; C8-vastine kuvattu §6:ssa.
---

# BPMN 2.0 XML: TRS-portti, riskiluokka, lease ja fail-closed

Edellinen kirjoitus kuvasi periaatteen: BPMN reitittää työn luottamuspisteen (TRS) mukaan joko agentille tai ihmiselle. Periaate on oikea, mutta siinä esitetty kiinteä raja `TRS >= 85` ei kestä tuotantoa. Se on liian karkea neljällä tavalla, ja jokainen niistä tekee HIC-portista näennäisen.

Tämä kirjoitus korjaa ne XML-tasolla. Kaavio, joka ei kestä näitä neljää kysymystä, ei ole hallintaa vaan hallinnan kuva.

## 1. Neljä puutetta kiinteässä rajassa

| Puute                          | Mitä tapahtuu ilman korjausta                                                                                               | Korjaus                                                |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Ei tehtäväkohtaista riskiä** | Erän hyllypaikan päivitys ja tuotantolinjan pysäytys vaativat saman pistemäärän. Toinen on liian tiukka, toinen liian löysä | Riskiluokka R1–R4, kynnys per luokka                   |
| **Ei voimassaoloaikaa**        | 40 minuuttia sitten laskettu piste kelpaa yhä. "Reaaliaikainen" on tällöin markkinointia                                    | TRS-vastauksella TTL; vanhentunut = ei pistettä        |
| **Ei fail-closed-käytöstä**    | Trust Engine ei vastaa → moottori jatkaa oletuksella tai kaatuu. Kumpikin on väärin                                         | Timeout → pakotettu HIC-polku, ei koskaan auto         |
| **Ei lukitusta**               | Piste tarkistetaan, sitten suoritetaan. Välissä piste voi romahtaa — **race condition**                                     | Lease-token, joka validoidaan atomisesti suorituksessa |

Neljäs on vakavin, koska se on näkymätön. Tarkistus ja suoritus ovat eri hetkiä. Jos agentin luottamus romahtaa niiden välissä — TC4-tapahtuma, IDV-peruutus, käyttäytymispoikkeama — työ suoritetaan silti valtuudella, jota ei enää ole. Auditointijälki näyttää siltä, että portti toimi. Se ei toiminut.

## 2. Riskiluokat kynnyksen tilalle

Kynnys ei ole järjestelmän ominaisuus vaan **teon seurausvakavuuden** ominaisuus. KYA-S1 §6.2 (TRS-2) edellyttää dokumentoituja tasoja, muttei sido lukuun — luku kuuluu tänne:

| Riskiluokka | Esimerkki teosta                                 | TRS-kynnys | Lease-TTL | Vaadittu hyväksyntä alle kynnyksen |
| ----------- | ------------------------------------------------ | ---------- | --------- | ---------------------------------- |
| **R1**      | Raportin luku, datan haku, koonti                | 40         | 300 s     | Ei — jatka lokituksella            |
| **R2**      | Laatukirjaus, erän statuspäivitys                | 70         | 60 s      | Yksi operaattori                   |
| **R3**      | Tilaus, toimittajaviesti, ERP-kirjaus            | 85         | 30 s      | Yksi operaattori + perustelu       |
| **R4**      | Laitteen ohjaus, linjan pysäytys, SCADA-vaikutus | 95         | 10 s      | Kaksi henkilöä (four-eyes)         |

R4:ssä kynnys on niin korkea, että automaattipolku on käytännössä poikkeus eikä sääntö. Se on tarkoitus.

## 3. BPMN 2.0 XML — koko portti

Alla on ajettava fragmentti (Camunda 7 -laajennusnimiavaruus). Se pakottaa näkyviin viisi asiaa, joita kaavion laatikot piilottavat: kuuntelijan, timeoutin, gatewayn, ihmishyväksynnän ja PRV-kirjauksen.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
    targetNamespace="https://dws10.com/bpmn/kya">

  <bpmn:process id="dws-iq-laadunvarmistus" isExecutable="true">

    <bpmn:startEvent id="start" name="Työkortti luotu dashboardilta">
      <bpmn:extensionElements>
        <!-- Riskiluokka on tehtävän ominaisuus, ei ajonaikainen arvaus. -->
        <camunda:inputOutput>
          <camunda:inputParameter name="riskClass">R3</camunda:inputParameter>
          <camunda:inputParameter name="agentId">dws-iq-quality-agent</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:outgoing>flow_to_trs</bpmn:outgoing>
    </bpmn:startEvent>

    <!-- 1. TRS-tarkistus omana tehtävänään, jotta timeout on mallinnettavissa. -->
    <bpmn:serviceTask id="trsCheck" name="KYA-S1: pyydä TRS + lease"
                      camunda:type="external" camunda:topic="kya-trs-lease">
      <bpmn:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="requestedScope">quality.batch.write</camunda:inputParameter>
          <camunda:inputParameter name="riskClass">${riskClass}</camunda:inputParameter>
          <!-- Palauttaa: trsScore, trsThreshold, leaseId, leaseExpiresAt -->
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:incoming>flow_to_trs</bpmn:incoming>
      <bpmn:outgoing>flow_to_gateway</bpmn:outgoing>
    </bpmn:serviceTask>

    <!-- 2. FAIL-CLOSED: jos Trust Engine ei vastaa 2 sekunnissa, ei oletusarvoa.
         Prosessi ei jatka automaattipolulle. Se menee ihmiselle. -->
    <bpmn:boundaryEvent id="trsTimeout" attachedToRef="trsCheck" cancelActivity="true">
      <bpmn:timerEventDefinition>
        <bpmn:timeDuration xsi:type="bpmn:tFormalExpression"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">PT2S</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
      <bpmn:outgoing>flow_timeout_to_hic</bpmn:outgoing>
    </bpmn:boundaryEvent>

    <!-- 3. XOR-portti. Kynnys tulee riskiluokasta, ei kovakoodattuna.
         leaseExpiresAt-vertailu estää vanhentuneen pisteen käytön. -->
    <bpmn:exclusiveGateway id="trsGate" name="TRS >= riskiluokan kynnys?">
      <bpmn:incoming>flow_to_gateway</bpmn:incoming>
      <bpmn:outgoing>flow_auto</bpmn:outgoing>
      <bpmn:outgoing>flow_hic</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:sequenceFlow id="flow_auto" sourceRef="trsGate" targetRef="agentExec">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        ${trsScore >= trsThreshold &amp;&amp; leaseId != null &amp;&amp; now() &lt; leaseExpiresAt}
      </bpmn:conditionExpression>
    </bpmn:sequenceFlow>

    <!-- Oletushaara on HIC. Jos ehto ei täyty MISTÄ TAHANSA syystä, mennään ihmiselle. -->
    <bpmn:sequenceFlow id="flow_hic" sourceRef="trsGate" targetRef="hicApproval" />

    <!-- 4. Agenttisuoritus esittää leasen. Trust Engine validoi + kuluttaa sen
         ATOMISESTI. Jos piste romahti tarkistuksen jälkeen, lease on mitätön
         ja tehtävä heittää virheen — se ei suoriudu vanhalla valtuudella. -->
    <bpmn:serviceTask id="agentExec" name="DWS IQ Skilled Agent suorittaa"
                      camunda:type="external" camunda:topic="dws-iq-agent-exec">
      <bpmn:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="leaseId">${leaseId}</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:incoming>flow_auto</bpmn:incoming>
      <bpmn:outgoing>flow_exec_to_prv</bpmn:outgoing>
    </bpmn:serviceTask>

    <!-- 5. Lease mitätöitiin kesken suorituksen (TC4, IDV-peruutus, TRS-romahdus).
         Ei uudelleenyritystä automaattina — suoraan ihmiselle. -->
    <bpmn:boundaryEvent id="leaseRevoked" attachedToRef="agentExec" cancelActivity="true">
      <bpmn:errorEventDefinition errorRef="ERR_LEASE_INVALID" />
      <bpmn:outgoing>flow_revoked_to_hic</bpmn:outgoing>
    </bpmn:boundaryEvent>

    <!-- 6. HIC-portti. Kolme sisääntuloa: matala TRS, timeout, mitätöity lease. -->
    <bpmn:userTask id="hicApproval" name="HIC-hyväksyntä (Single Pane of Glass)"
                   camunda:candidateGroups="operators">
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="decision" label="Päätös" type="enum">
            <camunda:value id="approve" name="Hyväksy" />
            <camunda:value id="reject" name="Hylkää" />
          </camunda:formField>
          <!-- R3+ vaatii perustelun. Kuittaus ilman perustelua ei ole valvontaa. -->
          <camunda:formField id="rationale" label="Perustelu" type="string">
            <camunda:validation><camunda:constraint name="required" /></camunda:validation>
          </camunda:formField>
        </camunda:formData>
      </bpmn:extensionElements>
      <bpmn:incoming>flow_hic</bpmn:incoming>
      <bpmn:incoming>flow_timeout_to_hic</bpmn:incoming>
      <bpmn:incoming>flow_revoked_to_hic</bpmn:incoming>
      <bpmn:outgoing>flow_hic_to_prv</bpmn:outgoing>
    </bpmn:userTask>

    <!-- 7. Eskalointi: kuittaamaton HIC-tehtävä ei jää roikkumaan hiljaisuudessa. -->
    <bpmn:boundaryEvent id="hicEscalation" attachedToRef="hicApproval" cancelActivity="false">
      <bpmn:timerEventDefinition>
        <bpmn:timeDuration xsi:type="bpmn:tFormalExpression"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">PT15M</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
      <bpmn:outgoing>flow_escalate</bpmn:outgoing>
    </bpmn:boundaryEvent>

    <!-- 8. PRV-kirjaus MOLEMMILTA poluilta. Ihmisen päätös on yhtä lailla
         auditoitava tapahtuma kuin agentin. -->
    <bpmn:serviceTask id="prvWrite" name="PRV-kirjaus Lifetime World Modeliin"
                      camunda:type="external" camunda:topic="kya-prv-write">
      <bpmn:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="path">${execution.hasVariable('decision') ? 'hic' : 'auto'}</camunda:inputParameter>
          <camunda:inputParameter name="trsAtDecision">${trsScore}</camunda:inputParameter>
          <camunda:inputParameter name="leaseId">${leaseId}</camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:incoming>flow_exec_to_prv</bpmn:incoming>
      <bpmn:incoming>flow_hic_to_prv</bpmn:incoming>
      <bpmn:outgoing>flow_to_end</bpmn:outgoing>
    </bpmn:serviceTask>

    <bpmn:endEvent id="end" name="Valmis — PRV-2 replay mahdollinen">
      <bpmn:incoming>flow_to_end</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:sequenceFlow id="flow_to_trs" sourceRef="start" targetRef="trsCheck" />
    <bpmn:sequenceFlow id="flow_to_gateway" sourceRef="trsCheck" targetRef="trsGate" />
    <bpmn:sequenceFlow id="flow_timeout_to_hic" sourceRef="trsTimeout" targetRef="hicApproval" />
    <bpmn:sequenceFlow id="flow_revoked_to_hic" sourceRef="leaseRevoked" targetRef="hicApproval" />
    <bpmn:sequenceFlow id="flow_exec_to_prv" sourceRef="agentExec" targetRef="prvWrite" />
    <bpmn:sequenceFlow id="flow_hic_to_prv" sourceRef="hicApproval" targetRef="prvWrite" />
    <bpmn:sequenceFlow id="flow_to_end" sourceRef="prvWrite" targetRef="end" />

  </bpmn:process>

  <bpmn:error id="ERR_LEASE_INVALID" errorCode="KYA_LEASE_INVALID"
              name="Lease mitätöity ennen suoritusta" />

</bpmn:definitions>
```

## 4. Mitä XML pakottaa näkyviin

Kaavio voi valehdella; XML ei. Neljä kohtaa, jotka laatikkopiirroksesta puuttuvat aina:

1. **Oletushaara on HIC, ei auto.** `flow_hic` on portin oletusreitti ilman ehtoa. Jos ehtolauseke epäonnistuu, muuttuja puuttuu tai lease on `null`, prosessi menee ihmiselle. Automaatti vaatii aktiivisen todistuksen; ihmispolku ei vaadi mitään.
2. **Timeout ei ole virhe vaan reitti.** `trsTimeout` (PT2S) ei kaada prosessia eikä oleta pistettä — se siirtää työn HIC-polulle. Trust Enginen alasajo hidastaa tuotantoa; se ei avaa porttia.
3. **Lease sulkee race conditionin.** Tarkistus ja suoritus eivät jaa oletusta. `agentExec` esittää `leaseId`:n, jonka Trust Engine validoi ja kuluttaa atomisesti. Väliin osunut TC4 tai IDV-peruutus mitätöi leasen → `ERR_LEASE_INVALID` → HIC. **Tämä on ainoa kohta, joka tekee HIC:stä aidon eikä näennäisen.**
4. **PRV kirjaa myös ihmisen.** `prvWrite` on molempien polkujen jälkeen. Jos vain agenttipolku lokitetaan, auditoinnissa ihmisen kuittaukset katoavat — ja juuri ne ovat Artikla 14:n todiste.

## 5. Mitä tämä ei vielä ratkaise

Rehellisyyden vuoksi (Sääntö 12): tämä malli ei kerro, **miten TRS lasketaan**. Portti on vain niin hyvä kuin sen syöte. Painotukset IDV-tilan, BHM-poikkeaman, red-team-tuloksen ja kyvykkyysmanifestin laajuuden välillä ovat seuraavan kirjoituksen aihe, samoin poikkeamatapaukset: mitä pisteelle tapahtuu kylmäkäynnistyksessä, mallin versiopäivityksessä ja verkkokatkon jälkeen.

Ennen sitä on yksi HIC-päätös: **hyväksytäänkö taulukon R1–R4 kynnysarvot** (40/70/85/95) DWS-oletuksiksi. Jos kyllä, ne kuuluvat `Legal/KYA_S1.md` §6.2:een — ei blogiin ensimmäisenä esiintymänä.

## 6. Camunda 8 / Zeebe -vastine

Esimerkki on Camunda 7 -muodossa, koska sen `camunda:`-laajennukset ovat luettavimmat. Camunda 8:ssa vastineet ovat: `camunda:type="external"` → `zeebe:taskDefinition type="..."`, `camunda:inputOutput` → `zeebe:ioMapping`, ja lomakekentät → Camunda Forms JSON. Rakenne — fail-closed-timeout, lease-boundary-error, oletushaara HIC:iin — siirtyy sellaisenaan.
