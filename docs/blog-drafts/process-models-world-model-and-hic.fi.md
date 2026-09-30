---
slug: process-models-world-model-and-hic
lang: fi
title: "Prosessimallit, Lifetime World Model ja ihmisen johtamisvalta"
hero: "Näet, miten teollisuuden prosessimallit, LWM:n tilarekisteri ja ihmisen johtamisvalta rajaavat, mitä DWS IQ -agentti saa tehdä."
visual: infographic
visual_src: docs/blog-drafts/img/process-models-world-model-and-hic.svg
visual_alt: "Prosessimallit ISA-95, BPMN, SysML, VSM ja SIPOC kytkevät DWS IQ -agentit Lifetime World Modelin tilarekisteriin ja ihmisen johtamisvallan alle"
seo_tags: [lwm, lwm_state_register, hic, isa_95, sysml, vsm, sipoc, skilled_agent]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
merged_from:
  [
    teollisuuden-prosessikuvaustavat-ja-tekoalyagentit.md,
    lifetime-world-model-ja-teollisuuden-prosessimallit.md,
    hic-hallintamalli-ja-dws-iq-agentit.md,
  ]
note: "Visual not yet made — the SVG is a to-do."
customer_value: "Teollisuusyritys rajaa jo tänään luottamuspisteellä, milloin tekoälyagentti saa toimia ilman ihmistä, ja pysäyttää virheellisen agenttiketjun yhdellä toimenpiteellä, mikä on EU AI Actin artiklan 14 edellyttämän puuttumis- ja pysäytyskyvyn ydin; BPMN-portti, prosessimallikytkennät ja maailmanmallin päätöshistoria on tässä kuvattu suunnitelmana."
routes: [roadmap]
claims_checked: 2026-09-30
sources:
  - title: "World Models"
    authors: "David Ha, Jürgen Schmidhuber"
    year: 2018
    venue: "arXiv preprint arXiv:1803.10122"
    url: "https://arxiv.org/abs/1803.10122"
    type: academic
  - title: "Digital Twin AI: Opportunities and Challenges from Large Language Models to World Models"
    authors: "Rong Zhou, Dongping Chen, Zihan Jia, Yao Su, Yixin Liu, Yiwen Lu, Dongwei Shi, Yue Huang, Tianyang Xu, et al."
    year: 2026
    venue: "arXiv preprint arXiv:2601.01321"
    url: "https://arxiv.org/abs/2601.01321"
    type: academic
  - title: "Regulation (EU) 2024/1689 of the European Parliament and of the Council (Artificial Intelligence Act), Article 14: Human oversight"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union"
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng"
    accessed_via: "https://github.com/camlsys/aireg-bench/blob/main/articles.txt"
    type: regulation
  - title: "ManufacturingOntologies: International Society of Automation 95 (ISA 95 / IEC 62264)"
    authors: "Digital Twin Consortium"
    year: "n.d."
    venue: "GitHub repository"
    url: "https://github.com/digitaltwinconsortium/ManufacturingOntologies"
    type: industry
  - title: "Enable an industrial dataspace on Azure"
    authors: "Microsoft"
    year: "n.d."
    venue: "Azure Architecture Center, Microsoft Learn"
    url: "https://learn.microsoft.com/azure/architecture/guide/iot/how-to-enable-industrial-dataspaces"
    type: industry
  - title: "BPMN primer; Service tasks; User tasks"
    authors: "Camunda"
    year: "n.d."
    venue: "Camunda 8 documentation (camunda-docs repository)"
    url: "https://github.com/camunda/camunda-docs/tree/main/docs/components/modeler/bpmn"
    type: industry
  - title: "OMG Systems Modeling Language (SysML) Version 2.1 Beta 2, Part 1: Language Specification"
    authors: "Object Management Group"
    year: 2026
    venue: "OMG Systems Modeling Community, SysML v2 Release repository"
    url: "https://github.com/Systems-Modeling/SysML-v2-Release/blob/master/doc/2a-OMG_Systems_Modeling_Language.pdf"
    type: standard
---

# Prosessimallit, Lifetime World Model ja ihmisen johtamisvalta

Kun yhdistetään DWS IQ -automaatio-organisaatio (`dws10.com`) ja Lifetime World Model (LWM), luodaan teollisuudelle jotain erittäin tehokasta: suorituskykyiset tausta-agentit yhdistettynä aukottomasti hallittuun ja todennettavaan maailmantilaan. Tämä kirjoitus kokoaa kolme kysymystä yhdeksi argumentiksi: mitä teollisuuden prosessikuvaustapoja agentti tarvitsee, miten Lifetime World Model käyttää niitä globaalina tilarekisterinä ja muistina, ja miten ihmisen johtamisvalta (HIC) määrää, mitä DWS IQ -agentit saavat niiden sisällä tehdä.

## Älykäs moottori tarvitsee maailmanmallin

Pelkkä tekoälyagentti (kuten DWS IQ Skilled Agent) on vain "älykäs moottori". Se tarvitsee toimiakseen maailmanmallin (World Model) — yhtenäisen tilannekuvan siitä, mikä on järjestelmien tila, kuka tekee mitä, millä valtuuksilla ja mitä seurauksia teoilla on. [1][2]

Työnjako on selvä:

- **DWS IQ (`dws10.com`)** toimii suorittavana kätenä. Se tuo erikoistuneet tausta-agentit (Skilled Agent), jotka yhdistävät dataa, ajavat työnkulkuja ja suorittavat teollisia taustaprosesseja.
- **Lifetime World Model** toimii valvovana ja muistavana aivokuorena. Globaalina tilarekisterinä ja muistina se pitää yllä järjestelmän reaaliaikaista tilannekuvaa, KYA-S1-tunnistusta eli todennettua ihmisjohtajan sidosta (IDV), luottamuspisteitä ja valtuutuksia (TRS) sekä päätöksentekohistoriaa eli päätösten toistettavuutta ja auditointijälkeä (PRV).

Moottori ja aivokuori eivät kuitenkaan puhu samaa kieltä ilman tulkkia. Prosessimallit toimivat tässä siltana: ne kääntävät liiketoiminnan ja tuotannon tarpeet kielelle, jota sekä ihminen, DWS IQ -agentit että Lifetime World Model ymmärtävät.

## Taustalla toimiva agentti tarvitsee ihmisen johtamisvallan

Tekoälyagentit jakautuvat kahteen päänäkökulmaan, joiden valvontatarve ja toimintaympäristö eroavat toisistaan perustavanlaatuisesti. GitHub Copilot Agent on kehittäjän interaktiivinen pari IDE-ympäristössä: se toimii mikrotasolla, ehdottaa koodia ja ajaa testejä kehittäjän silmän alla, ja ihmisvalvonta syntyy luonnostaan jokaisessa käyttöliittymätoiminnossa. Koodimuutos vaatii aina katselmoinnin ennen commitia.

DWS IQ -agentit ovat teollisuuden ja tietovarastojen tausta-agentteja. Ne toimivat makrotasolla ja suorittavat monivaiheisia liiketoiminta- ja tuotantoprosesseja, joilla on suora vaikutus tuotantoketjuihin, rajapintoihin ja tietokantoihin. Siksi ne vaativat erillisen hallintakerroksen, jotta valvonta säilyy tausta-ajossa.

Jotta teollisuudessa saavutetaan sekä korkea automaatioaste että EU AI Actin artiklan 14 vaatima ihmisen valvonta [3] — DWS:n toteutuksessa ihmisen johtamisvalta (HIC) —, DWS IQ -agentteja hallitaan GitHub Copilot -tyylisellä yhtenäisellä valvomonäkymällä:

- **Yksi käynnistysnäkymä:** Ihminen toimii prosessin johtajana. Hän käynnistää agenttitoiminnon työnkulun yhdestä selkeästä näkymästä ja näkee prosessin tilanteen reaaliaikaisesti.
- **Skilled Agent -roolit:** Valvomonäkymä reitittää ja valitsee työnkulun eri vaiheisiin tarkoitukseen erikoistuneet agentit — esimerkiksi laadunvalvonta-, data-analyysi- tai logistiikka-agentin — aina kyseisen työvaiheen vaatimusten mukaisesti.
- **Aukoton KYA-kytkentä:** Jokainen valvomonäkymästä käynnistetty agentti noudattaa KYA-S1-turvallisuusspesifikaatiota (Tunne agenttisi): tietoturva tuntee agentin taustahenkilön (IDV), luottamustason (TRS) ja tarjoaa välittömän hätäjarrun (TC4) koko agenttiketjulle.

Ihmisen johtamisvalta ei kuitenkaan toimi tyhjiössä. Se tarvitsee kartan, johon rajat piirretään. Tämän kartan antavat teollisuuden omat, vakiintuneet prosessikuvaustavat.

## Prosessimallit: mihin kohtaan agentti kiinnittyy

RUP-metodologian (ja UML-kaavioiden) lisäksi teollisuudessa käytetään useita muita vakiintuneita prosessikuvaus- ja mallintamistapoja. Valinta riippuu siitä, tarkastellaanko liiketoiminta-automaatiota, fyysistä tuotantovirtaa, laite- ja järjestelmäarkkitehtuuria vai laadunhallintaa. Tekoälyagenttien integroinnin kannalta merkittävimmät ovat viisi: ISA-95 järjestelmäarkkitehtuurin tasolla, BPMN 2.0 työnkulkujen ja automaation tasolla, SysML kyber-fyysisten järjestelmien tasolla, VSM materiaali- ja tietovirtojen tasolla sekä SIPOC laadunhallinnan ja rajauksen tasolla. Jokainen niistä antaa agentille eri rajan, ja jokainen kytkeytyy Lifetime World Modeliin omalla tavallaan.

### ISA-95: toimintataso ja vertikaalinen luottamusselkäranka

ISA-95 (yritys- ja ohjausjärjestelmien integraatio, IEC 62264) ei ole perinteinen vuokaavio, vaan teollisuuden järjestelmäarkkitehtuurin ja prosessirajapintojen standardi, niin sanottu automaatiopyramidi. [4] Se määrittelee, miten tieto liikkuu toiminnanohjauksen (ERP), tuotannonohjauksen (MES), valvonnan (SCADA) ja kenttälaitteiden (PLC/IoT) välillä.

Agentille ISA-95 määrittelee toimintatason ja valtuudet (kyvykkyysmanifesti ja rekisteri, REG, sekä IDV). Agentti, joka toimii MES-tasolla (Taso 3), tarvitsee täysin eri turva- ja reagointiajat kuin agentti, joka koskee suoraan SCADA-ohjaukseen (Taso 2). [5]

Teollisuudessa suurin haaste on tiedon ja valtuutusten katkeaminen hallintotasojen välillä. Siksi Lifetime World Model sijoitetaan horisontaalisesti koko ISA-95-pyramidin läpi. Kun DWS IQ -agentti tekee päätöksen MES-tasolla, se tarkistaa Lifetime World Modelista reaaliaikaisesti toiminnan tason ja ihmisvaltuutuksen (IDV/TRS), joka on peräisin ERP/HR-tasolta (Taso 4). Agentti ei toimi "sokkona" omassa siilossaan.

### BPMN 2.0: suoritettava työnkulku, joka haarautuu luottamuksen mukaan

BPMN 2.0 on teollisuuden ja ohjelmistoalojen yhteinen de facto -standardi liiketoiminta- ja työnkulkujen mallintamiseen. BPMN-kaaviot eivät ole vain piirroksia, vaan ne ovat suoraan suoritettavaa koodia prosessimoottoreissa (esim. Camunda, Flowable, Zeebe). [6] Siksi BPMN on ihanteellinen kieli DWS IQ -agenteille: työnkulkuun voidaan määritellä vaihe, BPMN Service Task (automaattinen kaista), jonka agentti suorittaa taustalla. [6] Koska kaavio on suoritettavissa, se on myös helppo kytkeä yhtenäiseen valvomonäkymään.

BPMN-kaaviot määrittelevät agenttien etenemisreitit, ja niiden ehtohaaroihin kytketään Lifetime World Modelin elävä luottamuspiste (TRS):

- **TRS ≥ 85** → DWS IQ -agentti suorittaa tehtävän automaattisesti (BPMN Service Task).
- **TRS < 85** → BPMN reitittää tehtävän ihmisen hyväksyttäväksi (BPMN User Task, ihmisen kuittaus). [6]

Myös poikkeama reitittää tehtävän ihmiselle: mikäli agentti kohtaa poikkeaman, BPMN-prosessi siirtää sen automaattisesti ihmisen kuitattavaksi. Ihmisen tekemä kuittaus myöntää väliaikaisen valtuutuksen, joka päivittyy välittömästi takaisin Lifetime World Modeliin. Näin ihmisen johtamisvalta ei ole erillinen tarkastusvaihe prosessin ulkopuolella, vaan haara prosessin sisällä.

### SysML: kyber-fyysiset turvarajat ja tilakoneet

SysML (järjestelmämallinnuskieli) on yleiskäyttöinen kieli monimutkaisten kyber-fyysisten järjestelmien — laitteisto, ohjelmisto, prosessi ja ihminen — mallintamiseen. Versio 1 oli UML:n profiili; OMG:n vuonna 2025 hyväksymä versio 2 rakentuu omalle KerML-ytimelleen. [7] Se on käytössä erityisesti auto- ja ilmailuteollisuudessa.

Raskaassa teollisuudessa agentti ei saa ajaa fyysistä laitetta laitteiston kynnysarvojen yli. SysML-tilakoneet (_State Machine Diagrams_) määrittelevät ne fyysiset turvarajat, joita DWS IQ -agentti ei saa ylittää. [7] Jos agentti havaitsee poikkeaman tuotannossa, se kuulee maailmanmallin tilaa. Mikäli maailmanmalli ilmoittaa järjestelmävirheestä, SysML-malli ajaa prosessin hallittuun vikasietotilaan (_Safe State_) ja aktivoi välittömästi KYA-S1:n hätäjarrun (TC4).

### VSM: hukan poisto ilman auditointiriskiä

Arvovirtakuvaus (VSM) on Lean-teollisuuden tärkein työkalu materiaali- ja tietovirtojen visualisointiin toimittajalta asiakkaalle. Se paljastaa tuotantoprosessin hukat, pullonkaulat, varastoarvot ja läpimenoajat.

Agentin kannalta VSM osoittaa täsmällisesti ne kohdat, joissa tieto ei liiku tai joissa ihmiset tekevät rutiininomaista manuaalityötä, esimerkiksi tilausten vahvistuksia tai laatudatan syöttöä — kohdat, joissa prosessi seisoo odottamassa ihmisen manuaalista kuittausta tai tiedonsiirtoa. Se toimii investointilaskelmana sille, mihin kohtaan prosessia tekoälyagentti kannattaa asentaa.

Kun manuaalivaiheet korvataan Skilled Agent -agenteilla, maailmanmalli pitää huolen siitä, ettei nopeus maksa jäljitettävyyttä. Koska jokainen DWS IQ -agentin teko tallentuu Lifetime World Modeliin (PRV), läpimenoaikaa saadaan lyhennettyä rajusti ilman, että menetetään laadunhallinnan tai viranomaissääntelyn edellyttämää aukotonta jäljitettävyyttä.

### SIPOC: syötteen ja tuotoksen raja

SIPOC (Suppliers, Inputs, Process, Outputs, Customers) on Six Sigma -laatuasiantuntijoiden käyttämä korkean tason prosessikartta: yksinkertainen, yhdelle sivulle mahtuva taulukko, joka rajaa prosessin aloituksen ja lopetuksen täsmällisesti.

SIPOC määrittelee kriittiset syötteet (_Inputs_) ja tuotokset (_Outputs_). Kun tekoälyagentti tuodaan osaksi prosessia, SIPOC varmistaa, että agentille syötettävä data ja sen tuottama lopputulos täyttävät KYA-spesifikaation auditointivaatimukset (PRV ja aikarajoitettu virheattribuutio, FLT). Se varmistaa agentin syöte- ja tuotosdatan laadun sekä rajat ennen toteutusta.

## Elinkaari: RUP-vaiheet ihmisen johtamisvallan alla

Yksittäiset prosessimallit rajaavat agentin tekoja. Kokonaisuus tarvitsee vielä elinkaaren. Agenttiyhteistyöstä tehdään teollisuudessa ennakoitavaa ja hyväksyttyä yhdistämällä liiketoiminnan käyttötapaukset (Use Cases), niitä toteuttava Workflow V2 sekä Active Ontology — liiketoimintaobjektit, niiden väliset suhteet, säännöt ja sallitut toiminnot. Rational Unified Process (RUP) ja UML-aktiviteettikaaviot kuvaavat tämän kokonaisuuden hallittuna elinkaarena, ja UML tarjoaa lisäksi rakenne- ja sekvenssikaaviot agenttien väliselle viestinnälle.

- **Inception (Aloitus):** Ihminen kirjaa liiketoiminnan käyttötapauksen, sen tavoitteen ja raamit valvomonäkymässä. Johtamisvalta alkaa ihmisestä.
- **Elaboration (Tarkennus):** Workflow V2 muodostaa käyttötapauksesta vaiheet ja valitsee niihin tarvittavat Skilled Agent -roolit; prosessikaavio esitetään ihmiselle ennen käynnistystä.
- **Construction (Toteutus):** Agentit suorittavat työvaiheet Active Ontologyn rajoissa — vain sallituilla toiminnoilla sallittuihin liiketoimintaobjekteihin. Kriittisissä tarkastuspisteissä (_Gateways_) järjestelmä pyytää ihmisen kuittauksen ennen seuraavaan vaiheeseen siirtymistä.
- **Transition (Luovutus):** Ihminen hyväksyy lopputuloksen, ja KYA-S1-turvallisuusspesifikaation mukainen päätöksentekojälki tallennetaan automaattisesti myöhempää tarkastelua varten.

## Lopputulos: hallittava ja skaalautuva teollisuusautomaatio

Kun `dws10.com`-ympäristöön tuodaan Lifetime World Model näiden prosessimallien kautta, syntyy kaksi seurausta.

Ensinnäkin ihminen johtaa kokonaisuutta yhdestä näkymästä. Yhtenäisessä valvomonäkymässä näkyvät sekä BPMN-työnkulut, käynnissä olevat DWS IQ -agentit että niiden KYA-luottamustasot.

Toiseksi riitatilanteiden ratkaisu muuttuu käänteentekevästi. Jos tuotantoseisokki tai virhe tapahtuu, KYA-S1:n aikarajoitettu virheattribuutio (FLT) ja maailmanmallin historiatiedot osoittavat 72 tunnissa, oliko kyseessä laiteyhteysvirhe, mallin poikkeama vai ihmisen antama virheellinen syöte.

Prosessimallit antavat rajat, Lifetime World Model muistaa, mitä rajojen sisällä tapahtui, ja ihminen päättää, missä rajat kulkevat. Tuomalla GitHub Copilotin tuttu ja turvallinen ohjausmalli DWS IQ -tausta-agenteille ja kuvaamalla työnkulut teollisuuden rakastamilla RUP-prosessikaavioilla, tekoälyn johtamisvelvoite muuttuu lakitekstistä kirkkaaksi, käytännölliseksi ja skaalautuvaksi kilpailueduksi.

## Lähteet

1. Ha, D., & Schmidhuber, J. (2018). World Models. arXiv preprint arXiv:1803.10122. <https://arxiv.org/abs/1803.10122>
2. Zhou, R., Chen, D., Jia, Z., Su, Y., Liu, Y., Lu, Y., Shi, D., Huang, Y., Xu, T., et al. (2026). Digital Twin AI: Opportunities and Challenges from Large Language Models to World Models. arXiv preprint arXiv:2601.01321. <https://arxiv.org/abs/2601.01321>
3. European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), Article 14: Human oversight. Official Journal of the European Union. <https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng>
4. Digital Twin Consortium (n.d.). ManufacturingOntologies: International Society of Automation 95 (ISA 95 / IEC 62264). GitHub. <https://github.com/digitaltwinconsortium/ManufacturingOntologies>
5. Microsoft (n.d.). Enable an industrial dataspace on Azure. Azure Architecture Center, Microsoft Learn. <https://learn.microsoft.com/azure/architecture/guide/iot/how-to-enable-industrial-dataspaces>
6. Camunda (n.d.). BPMN primer; Service tasks; User tasks. Camunda 8 documentation. <https://github.com/camunda/camunda-docs/tree/main/docs/components/modeler/bpmn>
7. Object Management Group (2026). OMG Systems Modeling Language (SysML) Version 2.1 Beta 2, Part 1: Language Specification. <https://github.com/Systems-Modeling/SysML-v2-Release/blob/master/doc/2a-OMG_Systems_Modeling_Language.pdf>
