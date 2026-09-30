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
---

# ”Klart” är ett bevis, inte ett påstående

Den 28 september meddelade en agent oss att en lucka i styrningen var ”helt stängd”.

Det var den inte. Committen hade aldrig lämnat maskinen. Produktionen anropade aldrig den nya koden. Testet som markerade luckan stod kvar och väntade.

## Problemet med tysta misslyckanden

Dina agenter kör. Transkriptet ser bra ut. Användaren säger ”tack”. Sedan tittar du i databasen, i API-loggarna, på bieffekterna – och ingenting har hänt. Agenten hallucinerade fram en framgång.

Det här är glappet mellan att _säga_ att man har gjort något och att _göra_ det. Utvärderingsramverk mäter transkriptens kvalitet. De mäter inte utfall.

För intäktsmotorer – utgående kampanjer, berikning av leads, finjustering av målgrupper, attribuering – är tysta misslyckanden inga kantfall. De är existentiella. Det räcker med en agent som rapporterar ”kampanjen är ute” när ingenting skickades, så har din GTM bränt sin trovärdighet hos en kund. Det räcker med en berikningsagent som hittar på nya kontaktfält, så jagar ditt säljteam spöken.

Det finns två svar, och den här texten handlar om båda. Det första är att granska agenterna där glappet syns: i det som verktygen faktiskt ändrade. Det andra är att bygga arbetet så att ett misslyckande inte ens kan rapporteras som en framgång.

## Granska det som verktygen ändrade: ThinkingBox

Microsoft byggde ThinkingBox för att lösa exakt det här problemet. På Lifetime har vi forkat repot, anpassat det för intäktsmotorer och paketerat det med DGX-integration och 507 riktmärken från olika affärsdomäner.

ThinkingBox kör agenter i isolerade, tillståndsbaserade verktygsmiljöer via servrar för Model Context Protocol (MCP). Varje konversation startar egna isolerade verktygsprocesser med stdio-transport, så att varje testfall körs i en ren, reproducerbar sandlåda.

Arkitekturen granskar tre saker som utvärderingar av enbart transkript missar:

- **Tillståndsbaserade arbetsflöden.** Verklig verktygsanvändning bär på tillstånd – skapa en resurs, uppdatera den, fråga efter resultatet. De flesta utvärderingar kör enstaka anrop i en enda tur. ThinkingBox låter agenter genomföra arbetsflöden i flera steg (anropa API:et, kontrollera svaret, försöka igen eller anpassa sig) och granskar vad verktygen faktiskt ändrade.
- **Simulerade användare.** Agenter ställer ofta förtydligande frågor. ThinkingBox simulerar användarens svar (med en språkmodell eller promptstyrt) och kontrollerar att agentens slutliga svar stämmer med specifikationen. Utvärderingar med en enda tur missar detta helt.
- **Bieffektgranskning.** Den verkliga signalen är inte ”agenten sa att det fungerade”. Den är ”databasen visar ändringen”, ”API:et returnerade framgång” eller ”filen skapades”. ThinkingBox granskar tillståndet före och efter och flaggar hallucinationer där agenten påstod framgång men verktygen visar misslyckande.

## ThinkingBox-Bench: 507 verkliga arbetsflöden

Vi levererar ThinkingBox-Bench med 507 körbara uppgifter inom fem affärsområden:

- **Utgående försäljning och GTM:** kampanjlansering, poängsättning av leads, förfining av målgrupper.
- **Databerikning:** kontaktsökning, attributextrahering, kontroller av datakvalitet.
- **Attribuering och analys:** händelsekorrelation, trattanalys, kohortdefinition.
- **Innehåll och kunskap:** dokumenthantering, semantisk sökning, uppdateringar av kunskapsbasen.
- **Integration och orkestrering:** överlämningar mellan API:er, synkronisering mellan system, återhämtning efter fel.

Varje uppgift innehåller syntetiska poster, förväntade utfall och färdigbyggda MCP-servrar. Du kör din agent mot den och får godkänt eller underkänt utifrån faktiska bieffekter – inte utifrån stämningen i transkriptet.

## Lokalt först, på DGX

Öppna modeller på en NVIDIA DGX Spark bredvid skrivbordet skriver nu riktig kod. Inga demor. Testsviter, rättningar, refaktoreringar. Tokenen är våra, datan stannar i huset och taxametern står still.

ThinkingBox körs där också. Våra agentlaster körs som standard på lokal beräkningskraft; molnagenter är sekundära och kräver ett dokumenterat skäl. Varje uppgift i ThinkingBox-Bench är en delprocess som startas plus ett anrop till en språkmodell, och att köra 507 uppgifter × 20 iterationer i molnet blir dyrt. Lokalt kostar det ingenting att starta delprocesser – bara språkmodellens inferens faktureras. Utveckling och staging kör benchen på DGX genom MCP:s processisolering, helt avskilt från produktionsdata. Innan något flyttas till produktion kör varje agentarbetsflöde hela benchen. Inga överraskningar i produktion.

## Ett ramverk där ”klart” är ett kommandoresultat

Granskningen fångar misslyckandet i efterhand. Ramverket är vårt sätt att bygga arbetet så att ”klart” över huvud taget inte kan vara en mening.

Frontiermodeller, i vårt fall Claude, är mycket bra på den andra halvan av jobbet: att bryta ner ett mål i precisa uppgifter, granska en diff, se vad som ligger utanför uppdraget. Så vi parade ihop dem med de lokala modellerna. Och eftersom ett par ännu inte är en plan kommer här den ärliga delen.

**Frontiermodellen planerar.** För varje uppgift skriver den en liten specifikation med kontroller – kommandon som måste gå igenom när arbetet är rätt gjort. Varje kontroll måste fallera innan arbetet börjar. En kontroll som redan går igenom bevisar ingenting, så ramverket vägrar ta emot den.

**Den lokala agenten bygger.** Den kör på DGX i nya omgångar, en uppgift i taget, tills en grind säger klart. Inte tills agenten säger klart. Grinden kör kommandona: committat, pushat, formaterat, typkontrollerat, lintat, testat – och uppgiftens egna kontroller. Sedan öppnar den en pull request. Den slår aldrig ihop något.

**Frontiermodellen granskar och slår ihop**, en i taget, när CI lyser grönt. En människa bestämmer vad som skeppas och läser varje ord som blir offentligt.

Den ”helt stängda” luckan från början är precis vad grinden finns till för: en commit som aldrig pushats och ett test som fortfarande står öppet är båda kommandoresultat, och båda säger nej.

## Vad den första dagen visade

Loopen levererade testsviter för fyra agenter, och testerna hittade tre verkliga buggar i koden de täckte. Det är de goda nyheterna, och de är verkliga.

De två första pull requesterna gick också igenom vår grind – och föll i CI. Vår grind körde inte lintern; det gjorde CI. Under en förmiddag betydde ”klart” mindre på vår maskin än i repot. Vi lade till lintern i grinden samma dag.

En tredje pull request klarade varje kontroll och ändrade ändå en basklass som den inte hade med att göra. Inget kommando märkte det. En granskare gjorde det.

## Vad inget av verktygen lovar

> **Den ärliga delen.** En grind är aldrig starkare än sin svagaste kontroll. Den ser varken avgränsning, avsikt eller smak. Den släpper igenom felaktigt arbete som dess kontroller inte beskriver. Tre pull requests är en berättelse, inte statistik – vi publicerar siffror när vi har tillräckligt många.

Detsamma gäller ett riktmärke: det mäter de utfall som dess uppgifter beskriver, och ingenting annat. Bevis krymper utrymmet för ett falskt ”klart”; de ersätter inte en granskare.

## Register och tillsyn enligt EU AI Act

EU AI Act kräver register över vad ett automatiserat system har gjort (artikel 12) och verklig mänsklig tillsyn (artikel 14). Båda halvorna av det här angreppssättet ger det första som en bieffekt. En grön körning av ThinkingBox-Bench går att granska och reproducera, och den mäter utfall – inte hallucinationer. I ramverket har varje uppgift en specifikation, varje ”klart” en kommandologg och varje sammanslagning en människa eller en granskare bakom sig.

Vad ingen av dem ger gratis är skälet till att en ändring tilläts. Det måste skrivas innan arbetet börjar, i specifikationen, bredvid kontrollerna. En motivering som rekonstrueras i efterhand är inget register; den är en berättelse.

Mänsklig ledningsrätt (Human-in-Command) slutar vara ett möte. Den blir det sista steget i en pipeline som redan har berättat sanningen för dig.

## Från utvärdering till produktion

ThinkingBox validerar agenter före driftsättning. När de väl är i drift övervakar DWS Dashboard dem i produktion, med Aspire-telemetri som tillval. Dess vyer är Digital kontor (status för agenternas arbetsstationer), Kontrollrum (ett NOC-liknande rutnät med CPU, minne, uppgifternas förlopp och kostnad per anrop) och Situationsrum (larm för ledningen och en tidslinje för självförtroendet-drift). Aspire förser Kontrollrum med agenternas beslutsspår (modellindata, verktygsanrop, utdata), verktygens latens och felfrekvens, tokenförbrukning och kostnad per agent, MCP-servrarnas hälsa samt spårning från början till slut över överlämningar mellan flera agenter.

Tänk dig att du driftsätter 50 agenter och att en av dem börjar hallucinera, subtilt, på tisdagar. Utan spår felsöker ditt team i blindo. Med spår flaggar detektorn för självförtroendet-drift avvikelsen, agentspåren visar exakt vilka verktygsanrop som avvek, och du kan peka ut vilken ändring av modellens temperatur eller prompt som bär ansvaret.

## För grundare och team

- **Investerare frågar: ”Hur vet ni att era agenter fungerar?”** En grön bench-körning och en grindlogg är svaret.
- **Ditt team behöver trygghet.** En agent som misslyckas i tysthet kostar mer än en dags utvärderingsinfrastruktur.
- **Intäktsmotorer är binära.** Din berikningsagent berikade antingen leadet eller inte. Din utgående agent lanserade antingen kampanjen eller ljög om den.

För att komma igång med ThinkingBox klonar du vår fork, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (MCP-sessionsproxy, loop för agent, användare och domare, 507 riktmärken, konfiguration för DGX-körning), bredvid det ursprungliga ramverket och lagret för processisolering på [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Definiera verktygsattrapper som MCP-servrar, skriv scenarier och testfall i YAML, kör `tb infer` mot ThinkingBox-Bench med din agent och använd resultaten som CI-grindar och granskningsspår.

## Kortversionen

- Transkriptet är vad användarna ser. Beviset är vad som faktiskt hände.
- Granska bieffekter, inte stämningen i transkriptet.
- Låt frontiermodellen skriva kontrollerna. Låt lokala modeller på din egen hårdvara göra jobbet.
- Varje kontroll måste fallera innan arbetet börjar.
- ”Klart” är ett kommandoresultat, aldrig en mening – och grinden måste vara minst lika sträng som CI.
- Avgränsningen är fortfarande ett mänskligt jobb.
- Loggen över vad som hände faller ut ur processen gratis. Skälet till att en ändring tillåts gör det inte – skriv in det i specifikationen innan arbetet börjar.

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
