---
slug: kya-s1-reading-path
lang: sv
title: "KYA-S1 i rätt ordning — en läsväg från en signerad sida till en verifierad människa"
hero: "Följ sex texter från den signerade leverantörssidan till den EU-verifierade människan bakom agenten, i den ordning en köpare behöver dem."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-reading-path.svg
visual_alt: "Sex texter på en linje: den signerade sidan, sju frågor, ordlistan, färdplanen, EU:s digitala plånbok och mänsklig tillsyn enligt Artikel 14"
seo_tags: [kya_s1_spec, kya_evidence_meta_rule, kya_trs, hic, article_14, eudi_wallet]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
kind: hub
note: "Visual not yet made — the SVG is a to-do."
translation_of: kya-s1-reading-path.md
ai_translated: true
---

# KYA-S1 i rätt ordning — en läsväg från en signerad sida till en verifierad människa

KYA-S1 Säkerhetsspecifikation riktar sig till leverantörer och gäller autonoma agenters identitet och beteende. Syftet är lätt att formulera: att ge upphandlingen en enda signerad sida om agenten, bredvid SOC 2 och ISO 27001, som anger vem som står bakom agenten, vad den får göra och hur den stoppas. Vi har skrivit om den i flera texter, de flesta på finska och som del av en serie i tolv delar. Den här sidan ställer sex av dem på en linje, så att även den som inte läser finska ser hur de hänger ihop.

Ordningen följer köparens frågor. Först: vad är sidan, och varför behöver den en oberoende signatur? Sedan: exakt vad frågar köparen? Därefter: vad betyder begreppen? Sedan: hur inför en organisation den steg för steg? Och till sist: vem utövar den mänskliga ledningsrätten, och hur bevisas vem den människan är — både i processen och i EU-rätten.

En anmärkning om versioner. Texterna skrevs medan specifikationen utvecklades. Den engelska texten presenterade v1.2, den finska serien hänvisar till v1.3, och aktuell version är v1.5, som döpte om garantinivåerna till KYA-AL1, KYA-AL2 och KYA-AL3. Varje text anger den version som gällde när den publicerades.

## 1. [KYA-S1 — One Signed Page for the Agent in Your Vendor File](https://onelifetime.world/posts/kya-s1-one-signed-page.html) (på engelska)

Utgångspunkten. En sida, signerad av leverantören och en oberoende bedömare, med sju kontroller — IDV, BHM, REG, TC4, FLT, TRS, PRV — och ett förnyelsedatum. Texten utesluter självdeklaration, även Lifetime Oy:s egen, och är noggrann i fråga om EU AI Act: KYA-S1 tar fram bevis som är relevanta för Artikel 12, 14 och 50, men uppfyller inte i sig skyldigheterna i dem.

## 2. [KYC:n vastine tekoälylle — seitsemän KYA-kysymystä](https://onelifetime.world/posts/kya-kyc-seven-questions.fi.html) (på finska)

Köparens checklista. Texten för över bankvärldens Know Your Customer-princip till AI-agenter: hur litar man på en aktör utan ansikte och utan pass? Den gör de sju kontrollerna till sju frågor — vem bär ansvaret, var går gränserna, hur beter sig agenten, hur stoppas den, vem betalar för ett fel, gäller behörigheten just nu, och kan beslutet spelas upp igen två år senare.

## 3. [KYA-S1 Sanasto — käsitteistö ja sanasto](https://onelifetime.world/posts/kya-s1-sanasto-glossary.fi.html) (på finska)

Uppslagsverket. Ordlistan samlar kärnbegreppen på ett ställe: de sju kontrollområdena, de tre garantinivåerna med revisionsfrekvens, svarstids-SLA:er och uppspelningsfönster, samt körtidsmekanismer som atomisk tidsbegränsad nyttjanderätts-token (Lease Token), säker vid fel (fail-closed), nödbroms (leash snap), lagring före frigörande och tidsbegränsad felattribuering (72 h). Ha den öppen medan du läser resten av serien.

## 4. [KYA-S1 Ekosysteemi & tuotanto-roadmap](https://onelifetime.world/posts/kya-s1-ecosystem-roadmap.fi.html) (på finska)

Införandeplanen. Texten behandlar KYA-S1 som köparens verktyg för leverantörsstyrning och visar hur de tre garantinivåerna bildar en stegvis färdplan, där svarstiderna skärps från femton minuter till fem minuter och vidare till sextio sekunder. Den upprepar principen Bevis-metaregel (§3) — ingen självdeklaration — och placerar KYA-S1 i upphandlingspärmen bredvid SOC 2, ISO 27001, ISO/IEC 42001 och FedRAMP, där den täcker den autonoma agent som de standarderna inte omfattar.

## 5. [Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0](https://onelifetime.world/posts/eudi-wallet-eidas2-human-identity.fi.html) (på finska)

Identitetsankaret. En intern SSO-inloggning räcker inte när en agent skriver under avtal eller lämnar in handlingar till myndigheter över organisationsgränserna; människan bakom den måste vara verifierad på EU-nivå. Texten knyter EU:s digitala plånbok (EUDI Wallet) enligt eIDAS 2.0 till IDV-kontrollerna: identifiering i realtid, en kryptografisk koppling till agentsessionen och en återkallelse som slår igenom inom garantinivåns tidsram och utlöser nödbromsen.

## 6. [EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita](https://onelifetime.world/posts/eu-ai-act-article-14-hic.fi.html) (på finska)

Mänsklig ledningsrätt. Artikel 14 kräver effektiv mänsklig tillsyn, men en agent som behöver ett mänskligt klick vid varje anrop är oanvändbar. Texten löser konflikten med routning efter förtroendepoäng: över uppgiftens tröskel kör agenten automatiskt; under den, eller när Trust Engine inte svarar i tid, går uppgiften till en människa i den enhetliga kontrollvyn (HIC Dashboard). En obligatorisk skriftlig motivering vid varje mänskligt godkännande skyddar mot slentrianmässiga godkännanden.

## Hur de sex hänger ihop

Den signerade sidan är löftet. De sju frågorna är köparens sätt att kontrollera det. Ordlistan låser orden, och färdplanen gör löftet till steg som en organisation kan införa. De två sista texterna besvarar frågan som ligger under varje kontroll: vilken människa bär ansvaret — bevisad med en EU-identitet och med bibehållen mänsklig ledningsrätt, utan att bli flaskhalsen.

Risto Anton Päärni
Grundare & vd, Lifetime Oy · Chefredaktör, Lifetime Scope Journal
