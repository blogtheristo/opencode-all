---
slug: bpmn-xml-trs-portti-riskiluokka-lease-fail-closed
title: "KYA-S1 v1.3 × BPMN 2.0: Atominen Lease Token, fail-closed ja rehellinen TRS-laskenta"
subtitle: "Kiinteä raja 85 ei riitä — näin HIC-portista tehdään aito eikä näennäinen"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-07
Status: APPROVED
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — "Osat 5, 6, 7 ja 11 hyväksytään virallisesti"
series: "KYA-S1 -blogisarja"
part: 6
parts_total: 12
source: HIC-kirjoittama teksti + arkkitehtuurikovennus (sessio claude/agent-use-cases-comparison-h7vl25)
series: "Blogi 6/7 · DWS IQ & Lifetime World Model"
editorial_fixes: |
  Kaksi BPMN-validiusvirhettä korjattu HIC:n alkuperäisestä XML:stä (Sääntö 12 — kerrotaan ääneen):
  1. Flow_To_PRV_Log oli määritelty kerran (sourceRef=Task_DWS_IQ_Agent_Execution), mutta
     SEKÄ Service Task ETTÄ User Task listasivat sen omaksi outgoing-flowikseen. BPMN-flowilla
     on täsmälleen yksi lähde ja yksi kohde. Korjaus: erilliset flowit molemmilta poluilta,
     yhdistettynä omaan PRV Service Taskiin.
  2. Flow_To_Human_Approval oli listattu EndEvent_1:n incoming-flowiksi, vaikka sen targetRef
     on Task_Human_Override. Sama virhe. Korjaus: poistettu.
  Seuraus oli juuri se aukko, jota kovennus yritti tukkia: PRV-listener istui vain
  agenttipolun flowilla, joten ihmisen kuittaus EI olisi kirjautunut World Modeliin —
  eli Artikla 14:n todiste olisi puuttunut lokista.
open_decisions: |
  Ennen julkaisua HIC:n päätettävä:
  1. Kynnysarvot (luku 60 / 85 / 95) ja painot (w1=0.35, w2=0.35, w3=0.15, w4=0.15):
     ehdotuksia, EI kanonia. Legal/KYA_S1.md §6.2 (TRS-1) edellyttää "documented inputs" ja
     TRS-2 "documented levels" — luvut kuuluvat sinne, ei blogiin ensiesiintymänä.
  2. Lease-TTL 5 s ja Trust Engine -timeout 500 ms: ehdotettuja oletuksia, ei mitattuja.
     Vahvistettava toteutuksesta ennen julkista lupausta.
  3. Toteutusalusta Camunda 7 (esimerkin syntaksi) vs Camunda 8 / Zeebe — ks. §5.
---

# KYA-S1 v1.3 × BPMN 2.0: Atominen Lease Token, fail-closed ja rehellinen TRS-laskenta

Edellinen kirjoitus kuvasi periaatteen: BPMN reitittää työn luottamuspisteen (TRS) mukaan joko agentille tai ihmiselle. Periaate on oikea, mutta siinä esitetty kiinteä raja `TRS >= 85` on havainnollinen opetusesimerkki — tuotannossa se on tietoturvariski.

Jos luottamustason tarkistuksen ja itse suorituksen välillä on edes muutaman millisekunnin rako ilman lukitusta, syntyy **race condition**. Agentti voi menettää valtuutuksensa juuri ennen suoritusta, ja prosessi ajaa sen silti läpi. Auditointijälki näyttää siltä, että portti toimi. Se ei toiminut. HIC-valvonta on tällöin näennäistä.

Kovennetaan arkkitehtuuri neljällä tuotantosäännöllä.

## 1. Neljä tuotantosääntöä

**1. Tehtäväkohtainen riskikynnys (TRS_req).** Jokaisella BPMN-tehtävällä on oma vaatimustasonsa. Datan lukeminen vaatii tasoa ~60, finanssitransaktio 85, fyysisen laitteen ohjaus tuotantolinjalla 95. Kynnys ei ole järjestelmän ominaisuus vaan **teon seurausvakavuuden** ominaisuus.

**2. Fail-closed-pakkosuojaus.** Jos KYA-S1 TRS Engine ei vastaa aikarajan puitteissa (> 500 ms) tai palauttaa virheen, prosessi ei koskaan aja automaatiota. Se ohjautuu poikkeuksetta `User Task` -haaraan. Trust Enginen alasajo hidastaa tuotantoa; se ei avaa porttia.

**3. Atominen Lease Token.** TRS Engine ei palauta pelkkää numeroa, vaan kryptografisesti allekirjoitetun ja aikaan sidotun kertakäyttöisen valtuutusavaimen (TTL esim. 5 s). Service Task voi toteutua vain, jos se **kuluttaa** kelvollisen tokenin suoritushetkellä. Tämä on ainoa kohta, joka sulkee race conditionin.

**4. Viiveetön mitätöinti.** Kun operaattori painaa HIC-dashboardilta hätäjarrua (TC4), World Model mitätöi kaikki aktiiviset Lease Tokenit välittömästi — koko agenttiketjusta kerralla.

| Riskitaso                               | TRS_req | Lease-TTL | Hyväksyntä alle kynnyksen  |
| --------------------------------------- | ------- | --------- | -------------------------- |
| Luku, haku, koonti                      | 60      | 30 s      | Ei — jatka lokituksella    |
| Laatukirjaus, erän statuspäivitys       | 75      | 15 s      | Yksi operaattori           |
| Finanssitransaktio, ERP-kirjaus, tilaus | 85      | 5 s       | Operaattori + perustelu    |
| Laitteen ohjaus, linjan pysäytys, SCADA | 95      | 2 s       | Kaksi henkilöä (four-eyes) |

## 2. BPMN 2.0 XML -toteutus

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:camunda="http://camunda.org/schema/1.0/bpmn"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_KYA_HIC"
                  targetNamespace="http://onelifetime.world/bpmn/kya">
  <bpmn:process id="DWS_IQ_Industrial_Workflow"
                name="DWS IQ Automated Process with KYA-S1 HIC" isExecutable="true">

    <!-- 1. ALOITUSTAPAHTUMA -->
    <bpmn:startEvent id="StartEvent_1" name="Työnkulku käynnistetty">
      <bpmn:outgoing>Flow_To_TRS_Check</bpmn:outgoing>
    </bpmn:startEvent>

    <!-- 2. TRS-EVALUOINTI: Execution Listener hakee pisteen JA Lease Tokenin
         ennen porttia. timeoutMs=500 → fail-closed. -->
    <bpmn:sequenceFlow id="Flow_To_TRS_Check"
                       sourceRef="StartEvent_1" targetRef="Gateway_Trust_Decision">
      <bpmn:extensionElements>
        <camunda:executionListener
            class="world.onelifetime.kya.bpmn.KyaTrustEvaluationListener" event="take">
          <camunda:field name="requiredTrs" stringValue="85" />
          <camunda:field name="taskRiskTier" stringValue="HIGH_CRITICALITY" />
          <camunda:field name="timeoutMs" stringValue="500" />
        </camunda:executionListener>
      </bpmn:extensionElements>
    </bpmn:sequenceFlow>

    <!-- 3. XOR-PORTTI. default= osoittaa HIC-haaraan: jos ehto ei täyty MISTÄ
         TAHANSA syystä (matala TRS, null-token, timeout), mennään ihmiselle. -->
    <bpmn:exclusiveGateway id="Gateway_Trust_Decision"
                           name="Täyttyykö TRS ja Lease Token?"
                           default="Flow_To_Human_Approval">
      <bpmn:incoming>Flow_To_TRS_Check</bpmn:incoming>
      <bpmn:outgoing>Flow_To_Agent_Execution</bpmn:outgoing>
      <bpmn:outgoing>Flow_To_Human_Approval</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:sequenceFlow id="Flow_To_Agent_Execution" name="TRS Valid &amp;&amp; Lease Acquired"
                       sourceRef="Gateway_Trust_Decision"
                       targetRef="Task_DWS_IQ_Agent_Execution">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">
        ${execution.getVariable('kya_trust_approved') == true
          &amp;&amp; execution.getVariable('kya_lease_token') != null}
      </bpmn:conditionExpression>
    </bpmn:sequenceFlow>

    <bpmn:sequenceFlow id="Flow_To_Human_Approval" name="Fail-Closed / Fallback"
                       sourceRef="Gateway_Trust_Decision" targetRef="Task_Human_Override" />

    <!-- 4A. AUTOMAATTIPOLKU: Lease Token kulutetaan atomisesti suorituksen alussa. -->
    <bpmn:serviceTask id="Task_DWS_IQ_Agent_Execution" name="DWS IQ Skilled Agent Suoritus"
                      camunda:delegateExpression="${dwsIqAgentDelegate}">
      <bpmn:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="leaseToken">
            ${execution.getVariable('kya_lease_token')}
          </camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_To_Agent_Execution</bpmn:incoming>
      <bpmn:outgoing>Flow_Agent_To_PRV</bpmn:outgoing>
    </bpmn:serviceTask>

    <!-- Token mitätöitiin kesken suorituksen (TC4, IDV-peruutus, TTL umpeutui).
         Ei uudelleenyritystä automaattina — rollback ja suoraan ihmiselle. -->
    <bpmn:boundaryEvent id="Boundary_Lease_Invalid"
                        attachedToRef="Task_DWS_IQ_Agent_Execution" cancelActivity="true">
      <bpmn:errorEventDefinition errorRef="ERR_LEASE_INVALID" />
      <bpmn:outgoing>Flow_Revoked_To_Human</bpmn:outgoing>
    </bpmn:boundaryEvent>
    <bpmn:sequenceFlow id="Flow_Revoked_To_Human"
                       sourceRef="Boundary_Lease_Invalid" targetRef="Task_Human_Override" />

    <!-- 4B. POIKKEAMAPOLKU: Human-in-Command. Kolme sisääntuloa. -->
    <bpmn:userTask id="Task_Human_Override"
                   name="HIC Valvonta: Ihmisoperaattorin hyväksyntä"
                   camunda:candidateGroups="operators">
      <bpmn:documentation>TRS-pisteet alittuivat, Lease Token vanheni tai mitätöitiin,
        tai TRS Engine aikakatkaistiin. Vaatii manuaalisen kuittauksen.</bpmn:documentation>
      <bpmn:extensionElements>
        <camunda:formData>
          <camunda:formField id="decision" label="Päätös" type="enum">
            <camunda:value id="approve" name="Hyväksy" />
            <camunda:value id="reject" name="Hylkää" />
          </camunda:formField>
          <!-- Kuittaus ilman perustelua ei ole valvontaa. -->
          <camunda:formField id="rationale" label="Perustelu" type="string">
            <camunda:validation><camunda:constraint name="required" /></camunda:validation>
          </camunda:formField>
        </camunda:formData>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_To_Human_Approval</bpmn:incoming>
      <bpmn:incoming>Flow_Revoked_To_Human</bpmn:incoming>
      <bpmn:outgoing>Flow_Human_To_PRV</bpmn:outgoing>
    </bpmn:userTask>

    <!-- Kuittaamaton HIC-tehtävä ei jää roikkumaan hiljaisuudessa. -->
    <bpmn:boundaryEvent id="Boundary_HIC_Escalation"
                        attachedToRef="Task_Human_Override" cancelActivity="false">
      <bpmn:timerEventDefinition>
        <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">PT15M</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
    </bpmn:boundaryEvent>

    <!-- 5. PRV-KIRJAUS OMANA TEHTÄVÄNÄÄN — MOLEMMILTA POLUILTA.
         Ihmisen päätös on yhtä lailla auditoitava tapahtuma kuin agentin;
         se on nimenomaan Artikla 14:n todiste. -->
    <bpmn:sequenceFlow id="Flow_Agent_To_PRV"
                       sourceRef="Task_DWS_IQ_Agent_Execution" targetRef="Task_PRV_Log" />
    <bpmn:sequenceFlow id="Flow_Human_To_PRV"
                       sourceRef="Task_Human_Override" targetRef="Task_PRV_Log" />

    <bpmn:serviceTask id="Task_PRV_Log" name="PRV-kirjaus Lifetime World Modeliin"
                      camunda:delegateExpression="${kyaPrvAuditLoggerDelegate}">
      <bpmn:extensionElements>
        <camunda:inputOutput>
          <camunda:inputParameter name="path">
            ${execution.hasVariable('decision') ? 'hic' : 'auto'}
          </camunda:inputParameter>
          <camunda:inputParameter name="trsAtDecision">
            ${execution.getVariable('kya_trs_score')}
          </camunda:inputParameter>
          <camunda:inputParameter name="leaseToken">
            ${execution.getVariable('kya_lease_token')}
          </camunda:inputParameter>
        </camunda:inputOutput>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_Agent_To_PRV</bpmn:incoming>
      <bpmn:incoming>Flow_Human_To_PRV</bpmn:incoming>
      <bpmn:outgoing>Flow_To_End</bpmn:outgoing>
    </bpmn:serviceTask>

    <bpmn:sequenceFlow id="Flow_To_End" sourceRef="Task_PRV_Log" targetRef="EndEvent_1" />
    <bpmn:endEvent id="EndEvent_1" name="Prosessisuoritus päätökseen — PRV-2 replay mahdollinen">
      <bpmn:incoming>Flow_To_End</bpmn:incoming>
    </bpmn:endEvent>

  </bpmn:process>

  <bpmn:error id="ERR_LEASE_INVALID" errorCode="KYA_LEASE_INVALID"
              name="Lease Token mitätöity tai vanhentunut ennen suoritusta" />
</bpmn:definitions>
```

**Huomio mallintajalle.** PRV-kirjaus on tässä oma `Service Task`, ei `executionListener` yhdellä sequence flowilla. Ero on olennainen: listener flowilla kattaa vain sen yhden reitin, jolloin ihmisen kuittaus jää lokittamatta. Omaan tehtäväänsä yhdistyvät molemmat polut, ja se on myös näkyvissä kaaviossa — auditoija ei löydä listeneriä XML:n sisältä.

### 2.1 XML ei vielä ole atominen — se on delegaatin vastuu

Tässä on kohta, jossa kaavio näyttää turvallisemmalta kuin ajonaikainen todellisuus, ja se on rehellisyyden vuoksi sanottava ääneen:

```xml
<camunda:inputParameter name="leaseToken">${...kya_lease_token}</camunda:inputParameter>
```

**`inputParameter` ei kuluta tokenia.** Se vain kopioi merkkijonon prosessimuuttujasta tehtävän skooppiin. Jos `dwsIqAgentDelegate` ottaa arvon vastaan ja aloittaa työn, race condition on edelleen auki — se on vain siirtynyt BPMN-tasolta delegaatin sisään, missä auditoija ei sitä näe.

Atomisuus on **delegaatin sopimus**, ei XML:n ominaisuus. Vaatimus:

1. Delegaatin **ensimmäinen** operaatio on `consumeAndExecute(leaseToken, action)` — yksi kutsu, joka Trust Enginen puolella validoi tokenin, merkitsee sen kulutetuksi ja valtuuttaa teon samassa transaktiossa (`SELECT … FOR UPDATE` / `compare-and-swap` -tasoinen lukitus).
2. Jos yhtä atomista operaatiota ei ole saatavilla, tokenin kulutuksen on oltava transaktion ensimmäinen **lukittu** vaihe, ja kaiken sivuvaikutuksellisen työn sen jälkeen samassa transaktiossa.
3. Epäonnistunut kulutus heittää `KYA_LEASE_INVALID` → `Boundary_Lease_Invalid` → HIC. Ei uudelleenyritystä.
4. Delegaatti ei saa koskaan lukea `kya_lease_token` -muuttujaa päättääkseen itse, onko token vielä voimassa. Voimassaolon ratkaisee yksin Trust Engine kulutushetkellä.

Ilman tätä sopimusta kaavio kuvaa aikomusta, ei takuuta. Kohtien 1–4 toteutus on se, mikä tekee portista aidon — XML vain tekee siitä tarkastettavan.

## 3. Rehellinen TRS-laskenta

Portti on vain niin hyvä kuin sen syöte. Trust Score TRS ∈ [0, 100] muodostuu painotetusta summasta, josta vähennetään poikkeamasakot:

```
TRS = max(0, (w₁·IDV + w₂·BHM + w₃·REG + w₄·TRS_hist) − Δ_decay − Δ_anomaly)
```

- **IDV** — identiteetin ja valtuutuksen tuoreus
- **BHM** — poikkeamat ajonaikaisessa käyttäytymisessä verrattuna perustasoon
- **REG** — agentin rekisteröinnin ja malliversion ajantasaisuus
- **TRS_hist** — agentin historiatietojen luotettavuus

Ehdotetut oletuspainot: w₁ = 0.35, w₂ = 0.35, w₃ = 0.15, w₄ = 0.15 (Σwᵢ = 1.0).

**Merkkisopimus (yksiselitteinen).** Δ_decay ja Δ_anomaly ovat määritelmän mukaan **ei-negatiivisia sakkoja**, Δ ≥ 0, ja kaava vähentää ne. Poikkeaman "vaikutus −40" luvun 4 matriisissa tarkoittaa siis `Δ_anomaly = 40`. Sekaannus tässä on kallis: jos toteutus tulkitsee matriisin −40:n suoraan kaavaan sijoitettavaksi termiksi, kaksoisnegaatio **nostaa** luottamuspistettä poikkeaman hetkellä — eli avaa portin juuri silloin kun sen pitäisi sulkeutua. Matriisi kuvaa vaikutuksen etumerkillä, kaava ottaa sakon itseisarvona.

## 4. Poikkeamamatriisi

Järjestelmän rehellisyys testataan poikkeamissa, ei normaaliajossa:

| Poikkeamatilanne                            | TRS-vaikutus               | Seuraus BPMN-moottorissa                         |
| ------------------------------------------- | -------------------------- | ------------------------------------------------ |
| Normaaliajo, kaikki kunnossa                | 90–100                     | Lease Token myönnetään → automaattisuoritus      |
| Taustahenkilön oikeus muuttuu (IDV)         | → 0 välittömästi           | Token mitätöidään → `User Task` (HIC)            |
| Tuntematon API-kutsu / koodipoikkeama (BHM) | Δ_anomaly = −40            | Pisteet alle TRS_req → `User Task` (HIC)         |
| Engine timeout / yhteys poikki              | N/A                        | **Fail-closed** → välittömästi `User Task` (HIC) |
| Lease Token TTL vanhenee                    | Token invalidoituu         | Service Task hylkää → rollback & HIC             |
| Manuaalinen hätäjarru (TC4)                 | Kaikki tokenit mitätöidään | Koko agenttiketju pysähtyy välittömästi          |

Huomaa, mikä matriisissa **puuttuu**: ei yhtään riviä, jolla poikkeama johtaisi automaattisuoritukseen. Se on koko suunnittelun ydin.

## 5. Camunda 8 / Zeebe -vastine

Esimerkki on Camunda 7 -muodossa, koska sen `camunda:`-laajennukset ovat luettavimmat. Camunda 8:ssa vastineet: `camunda:delegateExpression` → `zeebe:taskDefinition type="..."`, `camunda:inputOutput` → `zeebe:ioMapping`, lomakekentät → Camunda Forms JSON. Rakenne — fail-closed-timeout, lease-boundary-error, `default`-haara HIC:iin, PRV omana tehtävänään — siirtyy sellaisenaan.

## Yhteenveto

1. **Ihminen johtaa oikeasti.** Jokainen poikkeama, yhteyskatko tai valtuutusvirhe ohjaa tehtävän ihmiselle. Automaatti vaatii aktiivisen todistuksen; ihmispolku ei vaadi mitään.
2. **Ei race conditionia.** Lease Token takaa, ettei agentti voi suorittaa mitään ilman tuoretta ja validia luottamustasoa suoritushetkellä.
3. **Sertifioitu PRV-jälki.** World Modeliin jäävä loki todentaa jälkikäteen, kuka teki, millä valtuuksilla ja miksi — myös silloin kun tekijä oli ihminen.
