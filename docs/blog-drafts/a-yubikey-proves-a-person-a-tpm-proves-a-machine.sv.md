---
slug: a-yubikey-proves-a-person-a-tpm-proves-a-machine
lang: sv
title: "En YubiKey bevisar en människa. En TPM bevisar en maskin."
hero: "Två hårdvarukontroller svarar på två olika frågor i en revision. Vad var och en bevisar, vad vi inte säljer och vad vår pilot registrerar."
visual: infographic
visual_src: docs/blog-drafts/img/a-yubikey-proves-a-person-a-tpm-proves-a-machine.svg
visual_alt: "Två paneler: en säkerhetsnyckel signerar stoppet och bevisar vilken person som var närvarande; en TPM signerar starttillståndet och bevisar vilken maskin som kördes. Nedan Aegis Pilots register i dag: stoppsignaturen finns, hårdvaruattestering används inte."
seo_tags: [aegis, hic, kya_tc4, kya_idv, article_14]
demo_agent:
demo_url:
target: onelifetime.world/posts/a-yubikey-proves-a-person-a-tpm-proves-a-machine.sv.html
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
---

När vi planerade det första vittnade testet av Aegis Pilot ställde vi oss en fråga som en köpares revisor kommer att ställa: när agenten stoppas, vad bevisar att en verklig människa stoppade den, och vad bevisar att det skedde på den maskin vi säger?

Det är två frågor, och två olika enheter svarar på dem.

**En YubiKey bevisar en människa.** En YubiKey, liksom vilken hårdvarusäkerhetsnyckel som helst, är en liten enhet som du ansluter till din bärbara dator och rör vid. Den innehåller en hemlighet som aldrig lämnar enheten. När operatören stoppar en agent signerar nyckeln kommandot, och signaturen finns bara om den personens nyckel fysiskt var på plats. Att kopiera en fil kopierar den inte. Den svarar på frågan "vem hade befogenheten i det ögonblicket", vilket ett register över mänsklig tillsyn måste visa där artikel 14 i EU AI Act gäller, det vill säga för system med hög risk.

**En TPM bevisar en maskin.** En TPM är ett litet chip på datorns moderkort. Den registrerar vad maskinen startade med och kan signera ett utlåtande om det. Om någon byter ut programvaran under agenten, eller flyttar bevisen till en annan låda, slutar chipets utlåtande att stämma. Den svarar på frågan "var det här maskinen, och körde den den här programvaran".

De två ersätter inte varandra. En nyckel på en ärlig persons bärbara dator säger ingenting om servern. En perfekt server säger ingenting om vem som tryckte på stopp.

Så här ligger vi till, rakt på sak. I Aegis Pilot signerar operatören i dag ett stopp med en programvarunyckel som förvaras på den egna maskinen. Signaturen finns i registret, och den kontrolleras utan nätverk. Den är också svagare än en hårdvarunyckel, och det säger vi. Separat har pilotens godkännanderegister en avdelning för hårdvaruattestering, med en post för TPM-kontrollen och en för hårdvarunyckeln. I piloten står båda posterna som "används inte". Det är två olika rader: stoppet är signerat, och hårdvaran bakom signaturen är inte attesterad. Vi vill hellre att registret säger detta än att du tror att du fått mer än du köpt.

Två saker vi inte gör. Vi säljer inte hårdvara. Du köper servern och nycklarna från de leverantörer du redan använder, och de är din egendom. Vi påstår inte heller att programvaran ensam kan ge hårdvarubevis. En TPM behöver en kontrollerad startkedja hos dig, och det är en egenskap hos din anläggning, inte hos vår kod.

Det vi arbetar med härnäst är nyckeln. Att signera stoppet med en hårdvarunyckel är ett mindre steg än att attestera en maskin, och det är det en revisor ser först: personen, fysiskt närvarande, i stoppögonblicket. Om det hinner före vårt första vittnade test är inte beslutat, och vi påstår det inte förrän ett stopp har signerats på det sättet och registret visar det.

Om du kör agenter där någon senare kommer att fråga vem som stoppade dem och med vad, fråga din leverantör vilken av de två de kan visa. Be sedan att få se registret. De flesta leverantörer kan visa en logg. En logg är inte samma sak som en signerad kedja som en utomstående kan kontrollera utan nätverk och utan att ringa leverantören. Det senare är vad Aegis Pilots bevispaket är avsett att lämna till din revisor. Det blir klart till vårt första vittnade test, och tills en utomstående har kontrollerat ett, betrakta det som ett löfte och ännu inte en produkt. Det är skälet till att registret säger det det säger.

Vi skriver igen den dag ett stopp har signerats med en hårdvarunyckel och registret visar det.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
