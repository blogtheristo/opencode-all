---
slug: process-models-world-model-and-hic
lang: sv
title: "Processmodeller, Lifetime World Model och mänsklig ledningsrätt"
hero: "Så sätter industrins processmodeller, LWM:s tillståndsregister och mänsklig ledningsrätt gränserna för vad en DWS IQ-agent får göra."
visual: infographic
visual_src: docs/blog-drafts/img/process-models-world-model-and-hic.svg
visual_alt: "Processmodellerna ISA-95, BPMN, SysML, VSM och SIPOC kopplar DWS IQ-agenterna till Lifetime World Models tillståndsregister, under mänsklig ledningsrätt"
seo_tags: [lwm, lwm_state_register, hic, isa_95, sysml, vsm, sipoc, skilled_agent]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: process-models-world-model-and-hic.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
customer_value: "Ett industriföretag avgränsar redan i dag med förtroendepoängen när en AI-agent får agera utan människa och stoppar en felaktig agentkedja med en enda åtgärd, vilket är kärnan i den förmåga att ingripa och stoppa som artikel 14 i EU AI Act kräver; BPMN-gatewayen, kopplingarna till processmodellerna och världsmodellens beslutshistorik beskrivs här som planerade."
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

# Processmodeller, Lifetime World Model och mänsklig ledningsrätt

När automationsorganisationen DWS IQ (`dws10.com`) förenas med Lifetime World Model (LWM) får industrin något ovanligt kraftfullt: högpresterande bakgrundsagenter kopplade till ett världstillstånd som styrs utan luckor och går att verifiera. Den här texten samlar tre frågor till ett enda resonemang: vilka av industrins metoder för processbeskrivning en agent behöver, hur Lifetime World Model använder dem som sitt globala tillståndsregister och minne, och hur mänsklig ledningsrätt (HIC) avgör vad DWS IQ-agenterna får göra inom dem.

## En smart motor behöver en världsmodell

En AI-agent på egen hand – till exempel en DWS IQ Skilled Agent – är bara en ”smart motor”. För att kunna arbeta behöver den en världsmodell (World Model): en samlad lägesbild av hur systemen mår, vem som gör vad, med vilka befogenheter och med vilka följder. [1][2]

Arbetsfördelningen är tydlig:

- **DWS IQ (`dws10.com`)** är den verkställande handen. Den bidrar med specialiserade bakgrundsagenter (Skilled Agent) som knyter ihop data, kör arbetsflöden och utför industrins bakgrundsprocesser.
- **Lifetime World Model** är den vakande och minnande hjärnbarken. Som globalt tillståndsregister och minne upprätthåller den en lägesbild av systemet i realtid, KYA-S1-identifieringen, det vill säga Verifierad mänsklig huvudmannakoppling (IDV), Förtroendepoäng och auktorisering (TRS) samt beslutshistoriken, det vill säga Beslutsursprung och granskningskedja (PRV).

Men motorn och hjärnbarken talar inte samma språk utan tolk. Här fungerar processmodellerna som en bro: de översätter verksamhetens och produktionens behov till ett språk som både människan, DWS IQ-agenterna och Lifetime World Model förstår.

## En bakgrundsagent behöver mänsklig ledningsrätt

AI-agenter faller in i två huvudläger, och deras behov av tillsyn och den miljö de verkar i skiljer sig i grunden åt. GitHub Copilot Agent är utvecklarens interaktiva parkamrat i IDE:n: den arbetar på mikronivå, föreslår kod och kör tester under utvecklarens vakande öga, och den mänskliga tillsynen uppstår av sig själv i varje handgrepp i gränssnittet. En kodändring granskas alltid innan den checkas in.

DWS IQ-agenterna är bakgrundsagenter för industri och datalager. De arbetar på makronivå och driver affärs- och produktionsprocesser i flera steg, med direkt verkan på leveranskedjor, gränssnitt och databaser. Därför kräver de ett eget styrlager, så att tillsynen håller även när de kör i bakgrunden.

För att industrin ska nå både en hög automationsgrad och den mänskliga tillsyn som artikel 14 i EU AI Act kräver [3] – i DWS genomförande mänsklig ledningsrätt (HIC) – styrs DWS IQ-agenterna via en enhetlig kontrollvy i GitHub Copilot-stil:

- **En enda startvy:** Människan leder processen. Hon startar agentens arbetsflöde från en tydlig vy och följer processens läge i realtid.
- **Skilled Agent-roller:** Kontrollvyn dirigerar arbetsflödets olika steg till agenter som är specialiserade för ändamålet – till exempel en agent för kvalitetskontroll, dataanalys eller logistik – alltid efter vad det aktuella arbetssteget kräver.
- **Heltäckande KYA-koppling:** Varje agent som startas från kontrollvyn följer KYA-S1 Säkerhetsspecifikation (Känn din agent): säkerhetsfunktionen känner agentens mänskliga huvudman (IDV) och förtroendenivå (TRS) och har en omedelbar nödbroms (TC4) för hela agentkedjan.

Mänsklig ledningsrätt verkar dock inte i ett vakuum. Den behöver en karta att rita gränserna på. Den kartan tillhandahåller industrins egna, väletablerade metoder för processbeskrivning.

## Processmodeller: där agenten fäster

Utöver RUP-metodiken (och UML-diagrammen) använder industrin flera andra etablerade sätt att beskriva och modellera processer. Valet beror på om man betraktar affärsautomation, det fysiska produktionsflödet, utrustnings- och systemarkitektur eller kvalitetsstyrning. För att integrera AI-agenter är fem viktigast: ISA-95 på systemarkitekturens nivå, BPMN 2.0 på arbetsflödenas och automationens nivå, SysML på de cyberfysiska systemens nivå, VSM på material- och informationsflödenas nivå samt SIPOC på kvalitetsstyrningens och avgränsningens nivå. Var och en ger agenten en egen gräns, och var och en kopplas till Lifetime World Model på sitt eget sätt.

### ISA-95: verksamhetsnivån och en vertikal ryggrad av förtroende

ISA-95 (integration av affärs- och styrsystem, IEC 62264) är inget traditionellt flödesschema utan industrins standard för systemarkitektur och processgränssnitt – den så kallade automationspyramiden. [4] Den definierar hur information rör sig mellan affärssystemet (ERP), produktionsstyrningen (MES), övervakningen (SCADA) och fältutrustningen (PLC/IoT).

För agenten definierar ISA-95 verksamhetsnivå och befogenheter (Kapacitetsmanifest och register, REG, samt IDV). En agent som arbetar på MES-nivå (nivå 3) behöver helt andra säkerhetsmarginaler och reaktionstider än en agent som rör SCADA-styrningen direkt (nivå 2). [5]

Industrins största utmaning är att information och befogenheter bryts av mellan styrningsnivåerna. Därför placeras Lifetime World Model horisontellt genom hela ISA-95-pyramiden. När en DWS IQ-agent fattar ett beslut på MES-nivå kontrollerar den i realtid i Lifetime World Model verksamhetsnivån och den mänskliga auktoriseringen (IDV/TRS), som härrör från ERP/HR-nivån (nivå 4). Agenten agerar inte ”i blindo” i sitt eget stuprör.

### BPMN 2.0: ett körbart arbetsflöde som förgrenas efter förtroende

BPMN 2.0 är industrins och mjukvarubranschens gemensamma de facto-standard för att modellera affärsprocesser och arbetsflöden. BPMN-diagram är inte bara ritningar – de körs direkt som kod i processmotorer (till exempel Camunda, Flowable eller Zeebe). [6] Det gör BPMN till det idealiska språket för DWS IQ-agenter: i arbetsflödet kan man definiera ett steg, en BPMN Service Task (automatiskt spår), som agenten utför i bakgrunden. [6] Eftersom diagrammet är körbart är det också enkelt att koppla till den enhetliga kontrollvyn.

BPMN-diagrammen anger agenternas vägar framåt, och i deras villkorsgrenar kopplas Lifetime World Models levande förtroendepoäng (TRS) in:

- **TRS ≥ 85** → DWS IQ-agenten utför uppgiften automatiskt (BPMN Service Task).
- **TRS < 85** → BPMN skickar uppgiften till en människa för godkännande (BPMN User Task, mänsklig kvittering). [6]

Även en avvikelse skickar uppgiften till en människa: stöter agenten på en avvikelse för BPMN-processen automatiskt över den för mänsklig kvittering. Kvitteringen ger en tillfällig auktorisering, som omedelbart skrivs tillbaka till Lifetime World Model. Mänsklig ledningsrätt är alltså inte ett separat kontrollsteg utanför processen, utan en gren inuti den.

### SysML: cyberfysiska säkerhetsgränser och tillståndsmaskiner

SysML (systemmodelleringsspråk) är ett allmänt modelleringsspråk för komplexa cyberfysiska system – hårdvara, mjukvara, process och människa. Version 1 var en profil av UML; version 2, som OMG antog 2025, bygger på en egen KerML-kärna. [7] Språket används särskilt inom fordons- och flygindustrin.

Inom tung industri får en agent aldrig driva en fysisk maskin förbi utrustningens gränsvärden. SysML:s tillståndsmaskiner (_State Machine Diagrams_) definierar de fysiska säkerhetsgränser som en DWS IQ-agent inte får överskrida. [7] Upptäcker agenten en avvikelse i produktionen frågar den världsmodellen om läget. Rapporterar världsmodellen ett systemfel för SysML-modellen processen till ett kontrollerat felsäkert läge (_Safe State_) och löser omedelbart ut KYA-S1:s nödbroms (TC4).

### VSM: bort med slöseriet utan granskningsrisk

Värdeflödesanalys (VSM) är lean-industrins viktigaste verktyg för att åskådliggöra material- och informationsflöden från leverantör till kund. Den blottlägger produktionsprocessens slöseri, flaskhalsar, lagervärden och genomloppstider.

För agenten pekar VSM ut exakt var informationen står still eller där människor utför rutinmässigt manuellt arbete, till exempel orderbekräftelser eller inmatning av kvalitetsdata – de punkter där processen står och väntar på en människas manuella kvittering eller dataöverföring. Den fungerar som investeringskalkyl för var i processen det lönar sig att installera en AI-agent.

När de manuella stegen ersätts av Skilled Agent-agenter ser världsmodellen till att snabbheten inte sker på spårbarhetens bekostnad. Eftersom varje handling som en DWS IQ-agent utför lagras i Lifetime World Model (PRV) kan genomloppstiden kortas drastiskt utan att man förlorar den obrutna spårbarhet som kvalitetsstyrning och myndighetsregler kräver.

### SIPOC: gränsen mellan indata och utdata

SIPOC (Suppliers, Inputs, Process, Outputs, Customers) är den processkarta på hög nivå som Six Sigma-kvalitetsexperter använder: en enkel tabell som ryms på en sida och exakt avgränsar var processen börjar och slutar.

SIPOC definierar kritiska indata (_Inputs_) och utdata (_Outputs_). När en AI-agent blir en del av processen säkerställer SIPOC att de data agenten matas med och det resultat den levererar uppfyller KYA-specifikationens granskningskrav (PRV och Tidsbegränsad felattribuering, FLT). Den säkrar kvaliteten på agentens in- och utdata, liksom deras gränser, före införandet.

## Livscykeln: RUP-faserna under mänsklig ledningsrätt

De enskilda processmodellerna avgränsar agentens handlingar. Helheten behöver dessutom en livscykel. Industrin gör samarbetet med agenter förutsägbart och godtaget genom att förena verksamhetens användningsfall (Use Cases), det Workflow V2 som genomför dem, och Active Ontology – affärsobjekten, relationerna mellan dem, reglerna och de tillåtna åtgärderna. Rational Unified Process (RUP) och UML:s aktivitetsdiagram beskriver denna helhet som en styrd livscykel, och UML bidrar dessutom med struktur- och sekvensdiagram för kommunikationen mellan agenter.

- **Inception (Start):** Människan registrerar verksamhetens användningsfall, dess mål och ramar i kontrollvyn. Ledningsrätten börjar hos människan.
- **Elaboration (Precisering):** Workflow V2 bryter ned användningsfallet i steg och väljer de Skilled Agent-roller som behövs; processdiagrammet visas för en människa innan det startas.
- **Construction (Genomförande):** Agenterna utför arbetsstegen inom Active Ontologys ramar – bara tillåtna åtgärder på tillåtna affärsobjekt. Vid kritiska kontrollpunkter (_Gateways_) begär systemet en mänsklig kvittering innan nästa steg tar vid.
- **Transition (Överlämning):** Människan godkänner resultatet, och ett beslutsspår enligt KYA-S1 Säkerhetsspecifikation sparas automatiskt för senare granskning.

## Resultatet: industriell automation som går att styra och skala

När Lifetime World Model förs in i `dws10.com`-miljön genom dessa processmodeller får det två följder.

För det första leder människan helheten från en enda vy. I den enhetliga kontrollvyn syns både BPMN-arbetsflödena, de DWS IQ-agenter som är i gång och deras KYA-förtroendenivåer.

För det andra förändras lösningen av tvister i grunden. Om ett produktionsstopp eller ett fel inträffar visar KYA-S1:s Tidsbegränsad felattribuering (FLT) och världsmodellens historik inom 72 timmar om orsaken var ett fel i utrustningens uppkoppling, en avvikelse i modellen eller felaktig indata från en människa.

Processmodellerna drar gränserna, Lifetime World Model minns vad som hände innanför dem, och människan bestämmer var gränserna går. Genom att ge DWS IQ:s bakgrundsagenter GitHub Copilots välbekanta och trygga styrmodell, och genom att beskriva arbetsflödena med de RUP-processdiagram som industrin länge hållit kära, förvandlas plikten att leda AI från lagtext till en tydlig, praktisk och skalbar konkurrensfördel.

## Källor

1. Ha, D., & Schmidhuber, J. (2018). World Models. arXiv preprint arXiv:1803.10122. <https://arxiv.org/abs/1803.10122>
2. Zhou, R., Chen, D., Jia, Z., Su, Y., Liu, Y., Lu, Y., Shi, D., Huang, Y., Xu, T., et al. (2026). Digital Twin AI: Opportunities and Challenges from Large Language Models to World Models. arXiv preprint arXiv:2601.01321. <https://arxiv.org/abs/2601.01321>
3. European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), Article 14: Human oversight. Official Journal of the European Union. <https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng>
4. Digital Twin Consortium (n.d.). ManufacturingOntologies: International Society of Automation 95 (ISA 95 / IEC 62264). GitHub. <https://github.com/digitaltwinconsortium/ManufacturingOntologies>
5. Microsoft (n.d.). Enable an industrial dataspace on Azure. Azure Architecture Center, Microsoft Learn. <https://learn.microsoft.com/azure/architecture/guide/iot/how-to-enable-industrial-dataspaces>
6. Camunda (n.d.). BPMN primer; Service tasks; User tasks. Camunda 8 documentation. <https://github.com/camunda/camunda-docs/tree/main/docs/components/modeler/bpmn>
7. Object Management Group (2026). OMG Systems Modeling Language (SysML) Version 2.1 Beta 2, Part 1: Language Specification. <https://github.com/Systems-Modeling/SysML-v2-Release/blob/master/doc/2a-OMG_Systems_Modeling_Language.pdf>
