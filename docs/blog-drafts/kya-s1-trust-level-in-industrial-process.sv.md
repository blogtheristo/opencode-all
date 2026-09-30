---
slug: kya-s1-trust-level-in-industrial-process
lang: sv
title: "KYA-S1 och BPMN 2.0: förtroendepoängen styr AI-agenten i den industriella processen"
hero: "Så avgör förtroendepoängen om arbetet utförs av en agent eller en människa – och så utreds ett fel och beslutet spelas upp i efterhand."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-trust-level-in-industrial-process.svg
visual_alt: "Flödesschema: förtroendepoängen (TRS) väljer spår, en engångstoken förbrukas i utförandeögonblicket, vid fel leder fail-closed-skyddet uppgiften till en människa, och flödet avslutas med felattribuering (FLT) och uppspelning av beslutet (PRV)."
seo_tags: [kya_trs, kya_lease_token, kya_fail_closed, kya_flt, kya_prv, bpmn_user_task]
series: "KYA-S1"
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: kya-s1-trust-level-in-industrial-process.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
---

# KYA-S1 och BPMN 2.0: förtroendepoängen styr AI-agenten i den industriella processen

## Från ord till processkod

När regelverket är genomläst och arkitekturskisserna ritade dyker alltid samma tekniska fråga upp: **hur bygger man det här i praktiken?**

Hur kopplar man ihop en BPMN 2.0-processmotor (till exempel Camunda eller Zeebe), den levande förtroendepoängen (TRS) i KYA-S1 Säkerhetsspecifikation och DWS IQ:s bakgrundsagenter så att resultatet blir den verkliga mänskliga ledningsrätt (HIC, _Human-in-Command_) som EU AI Act kräver?

Svaret är att processmotorn aldrig ger agenten en fast behörighet. I stället dirigeras varje arbetsmoment dynamiskt efter förtroendenivån. Den här texten följer kedjan från början till slut: hur förtroendepoängen väljer spår, hur engångstoken och fail-closed-skyddet täpper till luckorna – och vad som händer när något ändå går snett.

## Förtroendepoängen avgör spåret

För att den tekniska lösningen ska bli tydlig fördelas ansvaret på tre komponenter. **BPMN 2.0-motorn** är produktionsprocessens dirigent: den sköter arbetsflödets routning och tillståndsmaskinen. **KYA-S1 TRS-tjänsten** gör förtroende- och riskbedömningen i realtid via gränssnittet mot Lifetime World Model (LWM). **DWS IQ Skilled Agent** är den verkställande bakgrundsagenten – en mikrotjänst eller en autonom utförare.

När en affärs- eller produktionsprocess körs i en DWS IQ-miljö kommunicerar BPMN 2.0-motorn och KYA-S1 TRS med varandra vid varje kritisk knutpunkt.

**Förhandsbedömning.** Innan BPMN-motorn går in i en uppgift utlöser den en `Execution Listener`. Lyssnaren skickar en REST- eller gRPC-förfrågan till KYA-S1 Trust Engine: _”Är DWS IQ Quality Agent X behörig att utföra uppgiften 'Laadunvarmistus_Erä_402' just nu?”_ Lyssnaren hämtar inte bara poängen, utan poängen och token tillsammans – före gatewayen.

**Exklusiv routning.** BPMN-processen använder det returnerade värdet i villkorsuttrycket för en XOR-gateway. Det finns två spår:

- **BPMN Service Task (automatiskt spår):** processen fortsätter omedelbart som en automatisk uppgift, och DWS IQ Skilled Agent genomför transaktionen på en millisekund.
- **BPMN User Task (mänskligt godkännande):** processen förgrenar sig omedelbart till en människa. Uppgiften dyker upp i operatörens enhetliga kontrollvy (_Single Pane of Glass_), och processen stannar säkert i väntan på mänskligt godkännande.

I praktiken sitter lyssnaren på det sequence flow som leder till gatewayen och tar emot uppgiftens krav som fält: erforderlig förtroendepoäng (`requiredTrs`), uppgiftens riskklass (`taskRiskTier`) och tidsgräns (`timeoutMs`, 500 ms). Villkoret för det automatiska spåret har två delar: förtroendet är godkänt **och** token har erhållits. Inget av dem räcker ensamt.

Gatewayens standardgren (`default`) pekar mot det mänskliga spåret. Om villkoret för det automatiska spåret inte uppfylls, oavsett orsak – låg poäng, saknad token eller tidsgränsen överskriden – går uppgiften till en människa.

I traditionell automation får en agent antingen 0 % eller 100 % behörighet. Går något fel är den enda utvägen att stänga av hela systemet. Genom att koppla ihop BPMN 2.0-motorn med KYA-S1 TRS uppnår man i stället **dynamik**. När alla variabler lyser grönt driver DWS IQ-agenterna den industriella processen för full kraft. Uppstår en avvikelse i agentens omgivning eller löper behörigheten ut, rasar förtroendepoängen omedelbart. Systemet kraschar inte, utan _lämnar mjukt över beslutet till en människa_.

## En fast gräns räcker inte

Det enklaste sättet att illustrera gatewayen är en fast gräns, till exempel `TRS >= 85`. Som pedagogiskt exempel fungerar det – i produktion är det en säkerhetsrisk. KYA-S1 Säkerhetsspecifikation (§6.2, TRS-2) kräver ett dokumenterat tröskelvärde men binder det inte till något visst tal; rätt värde sätts utifrån bransch och hur allvarliga följderna av handlingen kan bli.

Därför har varje BPMN-uppgift sin egen kravnivå, ett **uppgiftsspecifikt risktröskelvärde (TRS_req)**. Tröskeln är inte en egenskap hos systemet utan hos **handlingens följdallvar**. Siffrorna nedan är förslag, inte kanon:

| Risknivå                                          | TRS_req | Tokens giltighetstid | Godkännande under tröskeln  |
| ------------------------------------------------- | ------- | -------------------- | --------------------------- |
| Läsning, sökning, sammanställning                 | 60      | 30 s                 | Nej – fortsätt med loggning |
| Kvalitetsregistrering, statusuppdatering av batch | 75      | 15 s                 | En operatör                 |
| Finansiell transaktion, ERP-bokning, order        | 85      | 5 s                  | Operatör + motivering       |
| Utrustningsstyrning, linjestopp, SCADA            | 95      | 2 s                  | Två personer (four-eyes)    |

### En ärlig förtroendepoäng är gatewayens indata

En gateway är aldrig bättre än sina indata. Förtroendepoängen TRS ∈ [0, 100] bildas av en viktad summa från vilken avvikelseavdrag dras: `TRS = max(0, (w₁·IDV + w₂·BHM + w₃·REG + w₄·TRS_hist) − Δ_decay − Δ_anomaly)`.

- **IDV** – verifierad mänsklig huvudmannakoppling: är identiteten och behörigheten hos personen bakom agenten giltiga och aktuella?
- **BHM** – beteendemodellering vid körning: har avvikelser upptäckts i agentens beteende jämfört med baslinjen, till exempel under de senaste 10 minuterna?
- **REG** – kapacitetsmanifest och register: är agentens registrering och modellversion aktuella?
- **TRS_hist** – tillförlitligheten i agentens historik.

De föreslagna standardvikterna är w₁ = 0,35, w₂ = 0,35, w₃ = 0,15 och w₄ = 0,15, vilket summerar till 1,0.

**Teckenkonventionen är entydig.** Δ_decay och Δ_anomaly är per definition icke-negativa avdrag, och formeln subtraherar dem. En avvikelse med ”effekt −40” betyder alltså `Δ_anomaly = 40`. En sammanblandning här blir dyr: om en implementation stoppar in −40 direkt i formeln **höjer** den dubbla negationen förtroendepoängen i själva avvikelseögonblicket – och öppnar gatewayen just när den borde stängas.

## Atomisk tidsbegränsad nyttjanderätts-token täpper till luckan

Om det mellan förtroendekontrollen och själva utförandet finns en lucka på ens några millisekunder utan låsning uppstår ett **race condition**. Agenten kan förlora sin behörighet strax före utförandet, och processen kör ändå igenom den. Granskningsspåret ser ut som om gatewayen fungerade. Det gjorde den inte. Den mänskliga ledningsrätten är då bara skenbar.

Därför returnerar Trust Engine inte bara ett tal, utan en **atomisk tidsbegränsad nyttjanderätts-token** (_Lease Token_) för engångsbruk: en kryptografiskt signerad, tidsbunden nyckel som gäller i till exempel 5 sekunder. En automatisk uppgift kan genomföras bara om den **förbrukar** en giltig token i utförandeögonblicket. Det är den enda punkt som täpper till race condition.

### Diagrammet är inte atomiskt – det är delegatens ansvar

Här ser diagrammet säkrare ut än verkligheten vid körning, och för ärlighetens skull måste det sägas rakt ut. BPMN-modellens `inputParameter` **förbrukar inte token**. Den kopierar bara en sträng från en processvariabel till uppgiftens scope. Om agentens delegat tar emot värdet och börjar arbeta är race condition fortfarande öppet – det har bara flyttat från BPMN-nivån in i delegaten, där granskaren inte ser det.

Atomiciteten är **delegatens kontrakt**, inte en egenskap hos XML-koden. Kraven är fyra:

1. Delegatens **första** operation är `consumeAndExecute(leaseToken, action)` – ett enda anrop som på Trust Engines sida validerar token, markerar den som förbrukad och godkänner handlingen i samma transaktion (låsning på nivån `SELECT … FOR UPDATE` eller `compare-and-swap`).
2. Finns ingen enskild atomisk operation måste förbrukningen av token vara transaktionens första **låsta** steg, och allt arbete med sidoeffekter måste komma därefter i samma transaktion.
3. En misslyckad förbrukning kastar felet `KYA_LEASE_INVALID`, som via en gränshändelse leder uppgiften till en människa. Inget automatiskt nytt försök.
4. Delegaten får aldrig läsa token för att själv avgöra om den fortfarande gäller. Giltigheten avgörs enbart av Trust Engine i förbrukningsögonblicket.

Utan detta kontrakt beskriver diagrammet en avsikt, inte en garanti. Det är implementationen av punkterna 1–4 som gör gatewayen verklig – XML-koden gör den bara granskningsbar.

Exemplet är skrivet i Camunda 7-format, eftersom dess `camunda:`-tillägg är lättast att läsa. I Camunda 8 är motsvarigheterna okomplicerade: `camunda:delegateExpression` blir `zeebe:taskDefinition`, `camunda:inputOutput` blir `zeebe:ioMapping` och formulärfälten blir Camunda Forms JSON. Strukturen – tidsgränsen som fail-closed-skydd, gränshändelsen för token, standardgrenen till en människa och PRV som en egen uppgift – följer med oförändrad.

## Säker vid fel (fail-closed)

Om KYA-S1 Trust Engine inte svarar inom tidsgränsen (över 500 ms) eller returnerar ett fel, kör processen aldrig automationen. Den leds undantagslöst till mänskligt godkännande. Ett avbrott i Trust Engine bromsar produktionen; det öppnar inte gatewayen.

Detsamma gäller en token som redan har utfärdats. Om den ogiltigförklaras mitt under utförandet – på grund av nödbromsen, en återkallad behörighet eller att den löper ut – avbryts den automatiska uppgiften, en rollback görs och uppgiften går direkt till en människa. När nödbromsen (TC4) utlöses ogiltigförklarar Lifetime World Model omedelbart alla aktiva token – i hela agentkedjan på en gång.

Även det mänskliga spåret har två regler. Ett godkännande utan motivering är ingen tillsyn, så motiveringsfältet är obligatoriskt. Och en uppgift som ingen kvitterar blir inte liggande i det tysta: en timer på 15 minuter eskalerar den.

Ett systems ärlighet prövas i avvikelserna, inte i normaldriften:

| Avvikelse                              | Effekt på förtroendepoängen | Följd i BPMN-motorn                            |
| -------------------------------------- | --------------------------- | ---------------------------------------------- |
| Normaldrift, allt i ordning            | 90–100                      | Token utfärdas → automatiskt                   |
| Huvudmannens behörighet ändras (IDV)   | → 0 omedelbart              | Token ogiltigförklaras → mänskligt godkännande |
| Okänt API-anrop / kodavvikelse (BHM)   | Δ_anomaly = −40             | Poäng under TRS_req → mänskligt godkännande    |
| Timeout i Engine / förbindelsen bruten | inget värde                 | **Fail-closed** → omedelbart till en människa  |
| Token löper ut                         | Token blir ogiltig          | Automatisk uppgift avvisar → rollback & HIC    |
| Nödbroms (TC4)                         | Alla token ogiltigförklaras | Hela agentkedjan stannar omedelbart            |

Lägg märke till vad som **saknas** i matrisen: det finns inte en enda rad där en avvikelse leder till automatiskt utförande. Det är kärnan i hela konstruktionen. Automatiken kräver ett aktivt bevis; den mänskliga vägen kräver ingenting.

## När något går fel: 72-timmarsklockan

Hur tät den tekniska arkitekturen än är måste man i en industrimiljö acceptera ett ärligt faktum:

**Förr eller senare går något fel.**

AI:n tolkar en avvikande situation fel, bakomliggande systems databasförbindelse bryts mitt i en transaktion, en fältenhet matar in korrupta data, eller en människa ger felaktig indata.

I KYA-S1-specifikationen är frågan inte om ett fel inträffar. Frågan är: **vad händer 72 timmar efter att ärendet har stängts?**

I avtalsvärlden är den största kostnaden när ett fel inträffar sällan själva det tekniska felet, utan det veckor- eller månadslånga käbblet mellan jurister och leverantörer – ”ert fel”, ”nej, ert” – om vems ansvar skadan var.

KYA-S1:s **tidsbegränsade felattribuering (FLT)** undanröjer den osäkerheten. Efter en avvikelse tar systemet fram en signerad ansvarsklassificering **inom 72 timmar från att ärendet stängts** (FLT-2), i en av fem kategorier:

| Felklass                 | Beskrivning                                                           | Ansvaret faller på                      |
| ------------------------ | --------------------------------------------------------------------- | --------------------------------------- |
| **1. Model Fault**       | Språkmodellens hallucination, stokastiskt fel eller oväntad utdata    | Modelleverantör / LLM Provider          |
| **2. Logic Fault**       | Kodfel i DWS IQ-agentens applikationslogik eller promptstruktur       | Leverantör av agentprogramvaran         |
| **3. Integration Fault** | API-anslutningsfel, nätverksfördröjning, timeout eller databasavbrott | Infrastruktur- / integrationsleverantör |
| **4. Operator Fault**    | Felaktig eller ofullständig indata från en mänsklig operatör          | Beställare / användarorganisation       |
| **5. Policy Fault**      | Konfigurationsfel i regelverk, begränsning eller behörighet           | Regelarkitekt / säkerhetsorgan          |

Tack vare denna klassificering upphör ansvarsfördelningen att vara en utdragen juridisk tvist och blir i stället en exakt sökfråga.

## Uppspelning av beslutet: AI:ns tidsmaskin

För att felattribueringen ska kunna göras opartiskt krävs hårda tekniska bevis. Här kliver Lifetime World Model in, och därför är PRV-registreringen – beslutsursprung och granskningskedja – en egen automatisk uppgift i BPMN-modellen och inte bara en lyssnare på ett enda sequence flow.

Skillnaden är avgörande. En lyssnare på ett sequence flow täcker bara just den vägen, och då blir det mänskliga godkännandet ologgat. I en egen uppgift möts **båda** vägarna – agentens utförande och det mänskliga godkännandet – och den syns dessutom i diagrammet; granskaren behöver inte leta efter en lyssnare inne i XML-koden. Ett mänskligt beslut är en lika granskningsbar händelse som en agents: mänskligt beslutsursprung är just det bevis som Artikel 14 kräver.

Varje gång en DWS IQ-agent utför en uppgift eller uppgiften leds till kontrollvyn, sparas en kryptografiskt signerad ögonblicksbild i World Model:

1. **Ursprungliga indata:** exakt de data och den kontext som agenten matades med.
2. **Förtroendetillstånd:** agentens förtroendepoäng och IDV-status i utförandeögonblicket.
3. **Använd token:** beviset på att tillståndet att utföra var giltigt och förbrukades atomiskt.
4. **Modellens tillstånd:** modellversion, temperaturparameter och systemprompter.

PRV-uppgiften registrerar också vilket spår beslutet kom via (automatiskt eller mänskligt godkännande), förtroendepoängen i beslutsögonblicket och den token som användes. Först därefter avslutas processen – och sluthändelsens namn säger varför: utförandet har nått sitt slut, och det beslut som fattades kan spelas upp igen.

Detta möjliggör **PRV-2 (Decision replay)**. Även om den egentliga AI-modellen uppdateras eller byts ut om två år kan den ursprungliga beslutskedjan rekonstrueras under exakt samma randvillkor och verifieras även åratal senare.

Vad visste agenten? Med vilken befogenhet agerade den? Hur kom den fram till sitt resultat? PRV ger svaren – även när beslutsfattaren var en människa.

## Att bryta dominoeffekten: kedjeavslutning

I industriella multiagentmiljöer kan en DWS IQ-agent starta andra agenter. En kvalitetskontrollagent startar en logistikagent, som i sin tur startar en beställningsagent. Upptäcks ett fel i den första agentens beslut är den största faran en **dominoeffekt** – att felet mångfaldigas ut i de bakomliggande systemen.

KYA-S1:s **kedjeavslutning (TC4, _Trust Collapse Response & Chain Termination_)** bryter kedjan. Internt kallas den i dagligt tal nödbromsen, _leash snap_ (TC4-2).

1. **TC4-1** – ett förtroenderas upptäcks vid ett definierat tröskelvärde, och en signerad händelse skickas.
2. **TC4-2** – kedjan avslutas atomiskt: den felande agenten, varje underordnad agent den har startat och alla deras aktiva verktygssessioner. Samtidigt ogiltigförklaras alla token, så att ingen pågående automatisk uppgift kan skriva till databasen.
3. **TC4-4** – agentens fullständiga tillstånd, verktygshistorik och beslutsspår bevaras i avslutningsögonblicket för forensisk utredning. Det är härifrån felattribueringen hämtar sitt underlag.
4. Processen flyttas till kontrollvyn och tas över av en mänsklig operatör.

Lägg märke till ordningen: **säkra bevisen innan kedjan släpps** – lagring före frigörande. Utelämnas TC4-4 blir felattribuering inom 72 timmar omöjlig – kvar finns bara gissningar.

## Sammanfattning: ärlig AI-styrning i industrin

Helheten kan sammanfattas som en kedja:

1. **En signerad sida:** den tråkiga säkerhetspärmen får äntligen en egen sida för AI-agenten.
2. **Tekniskt förtroende:** förtroendepoängen är ingen mätare på en instrumentpanel, utan BPMN 2.0-processens direkta villkors- och styrmekanism.
3. **Människan leder på riktigt:** varje avvikelse, avbrott i förbindelsen eller behörighetsfel leder uppgiften till en människa, och programvaran garanterar att tillsynen inte är skenbar.
4. **Inget race condition:** engångstoken garanterar att agenten inte kan utföra någonting utan en färsk och giltig förtroendenivå i utförandeögonblicket.
5. **Krishantering utan luckor:** när något går fel håller felattribueringen och World Models historik ansvarsfördelningen klar. Loggen styrker i efterhand vem som gjorde vad, med vilka befogenheter och varför – även när den som handlade var en människa.

Det är precis därför vi var med och tog fram den här specifikationen: den förvandlar den lagstadgade skyldigheten till mänsklig ledningsrätt till driftsäker programvaruarkitektur.

När de här bitarna är på plats upphör AI-agenterna att vara en okontrollerbar säkerhetsrisk – och blir det de var avsedda att vara: **industrins pålitliga och högpresterande utförandenivå.**

---

**Risto Anton Päärni**
_Grundare och vd, Lifetime Oy_
_Chefredaktör, Lifetime Scope Journal_
