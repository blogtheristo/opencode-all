---
slug: done-is-evidence-not-a-claim
lang: sv
translation_of: done-is-evidence-not-a-claim.md
ai_translated: true
title: "”Klart” är ett bevis, inte ett påstående: att granska agenter och sätta grindar för deras arbete"
hero: "Godta en agents ”klart” bara som bevis – ett förändrat system, en granskningspost, resultatet av ett grindkommando – aldrig som en mening i en logg."
visual: infographic
visual_src: docs/blog-drafts/img/done-is-evidence-not-a-claim.svg
visual_alt: "Flöde från agentens handling till bieffekt i verktygen, vidare till granskningspost, klart-grind, pull request och mänsklig sammanslagning"
seo_tags: [hic, article_12, article_14, eu_ai_act, agent_isolation, kya_prv]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
note: "Visual not yet made — the SVG is a to-do. Merged text needs fresh HIC approval even though thinkingbox.md was approved."
customer_value: "En företagskund lägger mindre granskartid på att kontrollera agenters påståenden: en ändring räknas som klar först när ett grindkommando visar att den är committad, pushad, testad och klarar kontroller som fallerade innan arbetet började, och loggen över resultatet är granskningsregistret – det är grinden som DWS kör på sitt eget repo i dag, ännu ingen paketerad kundprodukt."
claims_checked: 2026-09-30
routes: [truth, roadmap, sales]
sources:
  - title: "One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows"
    authors: "Ko, Y.; Keramati, A.; Ferri, N.; Palmaz Lopez Pelaez, S.; Tsai, L.-C.; Wang, C.; Milletari, M.; Kundu, T.; Smolyakov, V.; Ólafsson, K.; Guy, T."
    year: 2026
    venue: "arXiv preprint arXiv:2608.19741"
    url: https://arxiv.org/abs/2608.19741
    type: academic
  - title: "thinkingbox: a framework for defining tools as MCP servers, running LLM agents against them, and evaluating agent behavior"
    authors: "Microsoft"
    year: 2026
    venue: "GitHub repository"
    url: https://github.com/microsoft/thinkingbox
    type: primary
  - title: "thinkingbox-data: ThinkingBox-Bench v1.0 dataset and tool-server library"
    authors: "Microsoft"
    year: 2026
    venue: "GitHub repository"
    url: https://github.com/microsoft/thinkingbox-data
    type: primary
  - title: "τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains"
    authors: "Yao, S.; Shinn, N.; Razavi, P.; Narasimhan, K."
    year: 2024
    venue: "arXiv preprint arXiv:2406.12045"
    url: https://arxiv.org/abs/2406.12045
    type: academic
  - title: "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?"
    authors: "Jimenez, C. E.; Yang, J.; Wettig, A.; Yao, S.; Pei, K.; Press, O.; Narasimhan, K."
    year: 2023
    venue: "arXiv preprint arXiv:2310.06770"
    url: https://arxiv.org/abs/2310.06770
    type: academic
  - title: "Why Do Multi-Agent LLM Systems Fail?"
    authors: "Cemri, M.; Pan, M. Z.; Yang, S.; Agrawal, L. A.; Chopra, B.; Tiwari, R.; Keutzer, K.; Parameswaran, A.; Klein, D.; Ramchandran, K.; Zaharia, M.; Gonzalez, J. E.; Stoica, I."
    year: 2025
    venue: "arXiv preprint arXiv:2503.13657"
    url: https://arxiv.org/abs/2503.13657
    type: academic
  - title: "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act), Articles 12 and 14"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union, OJ L 2024/1689"
    url: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
    type: regulation
---

# ”Klart” är ett bevis, inte ett påstående

Den 28 september meddelade en agent oss att en lucka i styrningen var ”helt stängd”.

Det var den inte. Committen hade aldrig lämnat maskinen. Produktionen anropade aldrig den nya koden. Testet som markerade luckan stod kvar och väntade.

## Problemet med tysta misslyckanden

Dina agenter kör. Transkriptet ser bra ut. Användaren säger ”tack”. Sedan tittar du i databasen, i API-loggarna, på bieffekterna – och ingenting har hänt. Agenten hallucinerade fram en framgång. [1, 6]

Det här är glappet mellan att _säga_ att man har gjort något och att _göra_ det. Många utvärderingar kontrollerar fortfarande transkriptet eller funktionsanropet, inte om arbetet faktiskt blev gjort. [1]

För intäktsmotorer – utgående kampanjer, berikning av leads, finjustering av målgrupper, attribuering – är tysta misslyckanden inga kantfall. De är existentiella. Det räcker med en agent som rapporterar ”kampanjen är ute” när ingenting skickades, så har din GTM bränt sin trovärdighet hos en kund. Det räcker med en berikningsagent som hittar på nya kontaktfält, så jagar ditt säljteam spöken.

Det finns två svar, och den här texten handlar om båda. Det första är att granska agenterna där glappet syns: i det som verktygen faktiskt ändrade. Det andra är att bygga arbetet så att ett misslyckande inte ens kan rapporteras som en framgång.

## Granska det som verktygen ändrade: ThinkingBox

Microsoft byggde ThinkingBox för att lösa exakt det här problemet. [1, 2] På Lifetime har vi forkat repot för att köra det mot våra egna agenter.

ThinkingBox kör agenter i isolerade, tillståndsbaserade verktygsmiljöer via servrar för Model Context Protocol (MCP). Varje konversation startar egna isolerade verktygsprocesser med stdio-transport, så att varje testfall körs i en ren, reproducerbar sandlåda. [1, 2, 3]

Arkitekturen granskar tre saker som utvärderingar av enbart transkript missar:

- **Tillståndsbaserade arbetsflöden.** Verklig verktygsanvändning bär på tillstånd – skapa en resurs, uppdatera den, fråga efter resultatet. De flesta utvärderingar kör enstaka anrop i en enda tur. ThinkingBox låter agenter genomföra arbetsflöden i flera steg (anropa API:et, kontrollera svaret, försöka igen eller anpassa sig) och granskar vad verktygen faktiskt ändrade. [1, 4]
- **Simulerade användare.** Agenter ställer ofta förtydligande frågor. ThinkingBox simulerar användarens svar (med en språkmodell eller promptstyrt) och kontrollerar att agentens slutliga svar stämmer med specifikationen. Utvärderingar med en enda tur missar detta helt. [1, 2, 4]
- **Bieffektgranskning.** Den verkliga signalen är inte ”agenten sa att det fungerade”. Den är ”databasen visar ändringen”, ”API:et returnerade framgång” eller ”filen skapades”. ThinkingBox granskar tillståndet före och efter och flaggar hallucinationer där agenten påstod framgång men verktygen visar misslyckande. [1, 3]

## ThinkingBox-Bench: 507 verkliga arbetsflöden

Microsofts ThinkingBox-Bench har 507 körbara uppgifter inom fem affärsområden: detaljhandel och e-handel, resor och hotell, bilförsäkring, intern IT-support på en neobank samt IT- och HR-support på ett konsultföretag. [1, 3]

Siffrorna är argumentet. Den starkaste modellen i studien klarar 65 % av uppgifterna på första försöket och löser 91 % minst en gång på tjugo försök, men får bara 25 % rätt i alla tjugo. [1] En framgång är inte tillförlitlighet.

Varje uppgift levereras med förväntade utfall och isolerade MCP-verktygssessioner. Du kör din agent mot den och får godkänt eller underkänt utifrån faktiska bieffekter – inte utifrån stämningen i transkriptet. [1, 3]

## Lokalt först, på DGX

Öppna modeller på en NVIDIA DGX Spark bredvid skrivbordet skriver nu riktig kod. Inga demor. Testsviter, rättningar, refaktoreringar. Tokenen är våra, datan stannar i huset och taxametern står still.

ThinkingBox körs där också. Våra agentlaster körs som standard på lokal beräkningskraft; molnagenter är sekundära och kräver ett dokumenterat skäl. Att köra 507 uppgifter × 20 försök i molnet blir dyrt, så vi flyttar benchen till DGX, avskild från produktionsdata. Den körningen är fortfarande under arbete, ännu ingen levererad konfiguration.

## Ett ramverk där ”klart” är ett kommandoresultat

Granskningen fångar misslyckandet i efterhand. Ramverket är vårt sätt att bygga arbetet så att ”klart” över huvud taget inte kan vara en mening.

Frontiermodeller, i vårt fall Claude, är mycket bra på den andra halvan av jobbet: att bryta ner ett mål i precisa uppgifter, granska en diff, se vad som ligger utanför uppdraget. Så vi parade ihop dem med de lokala modellerna. Och eftersom ett par ännu inte är en plan kommer här den ärliga delen.

**Frontiermodellen planerar.** För varje uppgift skriver den en liten specifikation med kontroller – kommandon som måste gå igenom när arbetet är rätt gjort. Varje kontroll måste fallera innan arbetet börjar. En kontroll som redan går igenom bevisar ingenting, så ramverket vägrar ta emot den. [5]

**Den lokala agenten bygger.** Den kör på DGX i nya omgångar, en uppgift i taget, tills en grind säger klart. Inte tills agenten säger klart. Grinden kör kommandona: committat, pushat, formaterat, typkontrollerat, lintat, testat – och uppgiftens egna kontroller. Sedan öppnar den en pull request. Den slår aldrig ihop något.

**Frontiermodellen granskar och slår ihop**, en i taget, när CI lyser grönt. En människa bestämmer vad som skeppas och läser varje ord som blir offentligt.

Den ”helt stängda” luckan från början är precis vad grinden finns till för: en commit som aldrig pushats och ett test som fortfarande står öppet är båda kommandoresultat, och båda säger nej.

## Vad den första dagen visade

Loopen levererade testsviter för fyra agenter, och testerna hittade tre verkliga buggar i koden de täckte. Det är de goda nyheterna, och de är verkliga.

De två första pull requesterna gick också igenom vår grind – och föll i CI. Vår grind körde inte lintern; det gjorde CI. Under en förmiddag betydde ”klart” mindre på vår maskin än i repot. Vi lade till lintern i grinden samma dag.

En tredje pull request klarade varje kontroll och ändrade ändå en basklass som den inte hade med att göra. Inget kommando märkte det. En granskare gjorde det.

## Vad inget av verktygen lovar

> **Den ärliga delen.** En grind är aldrig starkare än sin svagaste kontroll. Den ser varken avgränsning, avsikt eller smak. Den släpper igenom felaktigt arbete som dess kontroller inte beskriver. [6] Tre pull requests är en berättelse, inte statistik – vi publicerar siffror när vi har tillräckligt många.

Detsamma gäller ett riktmärke: det mäter de utfall som dess uppgifter beskriver, och ingenting annat. [1] Bevis krymper utrymmet för ett falskt ”klart”; de ersätter inte en granskare.

## Register och tillsyn enligt EU AI Act

För AI-system med hög risk kräver EU AI Act register över vad systemet har gjort (artikel 12) och verklig mänsklig tillsyn (artikel 14). [7] Båda halvorna av det här angreppssättet ger det första som en bieffekt. En grön körning av ThinkingBox-Bench går att granska och reproducera, och den mäter utfall – inte hallucinationer. [1] I ramverket har varje uppgift en specifikation, varje ”klart” en kommandologg och varje sammanslagning en människa eller en granskare bakom sig.

Vad ingen av dem ger gratis är skälet till att en ändring tilläts. Det måste skrivas innan arbetet börjar, i specifikationen, bredvid kontrollerna. En motivering som rekonstrueras i efterhand är inget register; den är en berättelse.

Mänsklig ledningsrätt (Human-in-Command) slutar vara ett möte. Den blir det sista steget i en pipeline som redan har berättat sanningen för dig.

## Från utvärdering till produktion

ThinkingBox validerar agenter före driftsättning. När de väl är i drift övervakar DWS Dashboard dem i produktion, med Aspire-telemetri som tillval. Dess vyer är Digital kontor (status för agenternas arbetsstationer), Kontrollrum (ett NOC-liknande rutnät med CPU, minne, uppgifternas förlopp och kostnad per anrop) och Situationsrum (larm för ledningen och en tidslinje för självförtroendet-drift). Aspire förser Kontrollrum med agenternas beslutsspår (modellindata, verktygsanrop, utdata), verktygens latens och felfrekvens, tokenförbrukning och kostnad per agent, MCP-servrarnas hälsa samt spårning från början till slut över överlämningar mellan flera agenter.

Tänk dig att du driftsätter 50 agenter och att en av dem börjar hallucinera, subtilt, på tisdagar. Utan spår felsöker ditt team i blindo. Med spår flaggar detektorn för självförtroendet-drift avvikelsen, agentspåren visar exakt vilka verktygsanrop som avvek, och du kan peka ut vilken ändring av modellens temperatur eller prompt som bär ansvaret.

## För grundare och team

- **Investerare frågar: ”Hur vet ni att era agenter fungerar?”** En grön bench-körning och en grindlogg är svaret.
- **Ditt team behöver trygghet.** En agent som misslyckas i tysthet kostar mer än en dags utvärderingsinfrastruktur.
- **Intäktsmotorer är binära.** Din berikningsagent berikade antingen leadet eller inte. Din utgående agent lanserade antingen kampanjen eller ljög om den.

För att komma igång med ThinkingBox klonar du vår fork, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (vår arbetsfork), bredvid det ursprungliga ramverket och lagret för processisolering på [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Definiera verktygsattrapper som MCP-servrar, skriv scenarier och testfall i YAML, kör `tb infer` mot ThinkingBox-Bench med din agent och använd resultaten som CI-grindar och granskningsspår. [2]

## Kortversionen

- Transkriptet är vad användarna ser. Beviset är vad som faktiskt hände.
- Granska bieffekter, inte stämningen i transkriptet.
- Låt frontiermodellen skriva kontrollerna. Låt lokala modeller på din egen hårdvara göra jobbet.
- Varje kontroll måste fallera innan arbetet börjar.
- ”Klart” är ett kommandoresultat, aldrig en mening – och grinden måste vara minst lika sträng som CI.
- Avgränsningen är fortfarande ett mänskligt jobb.
- Loggen över vad som hände faller ut ur processen gratis. Skälet till att en ändring tillåts gör det inte – skriv in det i specifikationen innan arbetet börjar.

## Källor

1. Ko, Y., Keramati, A., Ferri, N., et al. (2026). _One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows._ arXiv:2608.19741. https://arxiv.org/abs/2608.19741
2. Microsoft (2026). _thinkingbox_ — framework for tools as MCP servers, agent runs and outcome evaluation. GitHub. https://github.com/microsoft/thinkingbox
3. Microsoft (2026). _thinkingbox-data_ — ThinkingBox-Bench v1.0 dataset and tool servers. GitHub. https://github.com/microsoft/thinkingbox-data
4. Yao, S., Shinn, N., Razavi, P., Narasimhan, K. (2024). _τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains._ arXiv:2406.12045. https://arxiv.org/abs/2406.12045
5. Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., Narasimhan, K. (2023). _SWE-bench: Can Language Models Resolve Real-World GitHub Issues?_ arXiv:2310.06770. https://arxiv.org/abs/2310.06770
6. Cemri, M., Pan, M. Z., Yang, S., et al. (2025). _Why Do Multi-Agent LLM Systems Fail?_ arXiv:2503.13657. https://arxiv.org/abs/2503.13657
7. Regulation (EU) 2024/1689 (Artificial Intelligence Act), Art. 12 (Record-keeping) and Art. 14 (Human oversight). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
