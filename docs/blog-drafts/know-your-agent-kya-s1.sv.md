---
slug: know-your-agent-kya-s1.sv
title: "Känn din agent (KYA-S1): En signerad sida om den AI i säkerhetspärmen som rör dina data"
series: "KYA-S1 bloggserie"
part: 1
parts_total: 11
lang: sv
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
Status: DRAFT
source: Översättning av den HIC-godkända finska texten (know-your-agent-kya-s1.fi.md). Avsnitt för avsnitt, påstående för påstående.
ai_disclosure: required
note: >-
  Seriens del 1/11. Väntar på HIC:s godkännande (Regel 13) — HIC godkände uttryckligen FI
  och EN, inte SV/DE/FR. AI-översättningsmärkning krävs vid publicering
  (docs/BLOG_STANDARD.md §3.2.1, EU AI Act art. 50(4)).
  Säkerhetsnivåerna följer Legal/KYA_S1.md v1.4 (KYA-AL1/AL2/AL3).
---

# Känn din agent (KYA-S1): En signerad sida om den AI i säkerhetspärmen som rör dina data

Blogg 1/11 · DWS IQ & Lifetime World Model · 8 augusti 2026 · Risto Anton Päärni

## Inledning: AI fattar beslut — men vem bär ansvaret?

I företagens och den offentliga förvaltningens upphandlingspärmar finns i dag en omfattande bunt signerade dokument. På organisationsnivå finns SOC 2 Type 2- och ISO/IEC 27001-certifikat. För data och dataskydd finns GDPR- och CSRD-bevis. För plattformssäkerhet och infrastruktur finns FedRAMP eller ett suveränt molngodkännande att peka på.

Ett kritiskt dokument saknas ändå i upphandlingspärmen: en signerad sida för den autonoma AI-agenten.

När AI går från att generera text till autonoma åtgärder — köra kod, anropa API:er, utföra finansiella transaktioner och styra fysiska industriprocesser — räcker gammal programvarusäkerhet inte längre.

En autonom AI-agent är inte enbart programvara. Den är en aktör. Därför kräver varje agent en egen verifierad identitet, ett mandat att agera och en omedelbar nödbroms.

## En sida till leverantörspärmen (KYA-S1 v1.3 Specification)

KYA-S1 (Know Your Agent Security Specification v1.3) är ett förslag till säkerhetsstandard som verifierar AI-agenters identitet och beteende vid körning. Den kokar ner till tre tydliga frågor som varje leverantör måste kunna besvara innan en agent släpps in till kundens data:

**Vem står bakom agenten? (IDV — Identity Verification)**
Varje beslut agenten fattar och varje verktyg den begär måste kunna spåras till en kryptografiskt verifierad människa (HIC — den människa som har befälet).

**Vad får den göra, och vad gör den just nu? (REG & BHM)**
Agenten måste ha ett kapacitetsmanifest som deklarerats före aktivering (REG) och som den inte kan överskrida under körning, samt kontinuerlig beteendeövervakning (BHM) för att upptäcka avvikelser.

**Hur stoppas den vid fel? (TC4 — Chain Termination)**
Om agentens förtroendenivå kollapsar eller en avvikelse inträffar måste hela agentkedjan kunna elimineras atomiskt inom en tidsbegränsad SLA-respons (leash snap).

## Ingen självutvärdering (§3 Evidence Meta-Rule)

Den största fallgropen i leverantörsstyrning är självutvärdering (self-attestation). §3 i KYA-S1-specifikationen förbjuder leverantörens egen försäkran ovillkorligt:

> **Regel (§3):** Självutvärdering är inte godtagbart bevis för KYA-S1-överensstämmelse. Papperet är värt exakt så mycket som namnet på dess andra signaturrad.

Som godtagbart bevis duger endast en revisionsrapport från en ackrediterad tredje part (till exempel en SOC 2-revisor eller ett ackrediterat red team-företag) eller kryptografiskt verifierad plattformstelemetri som bevaras i ett oföränderligt loggregister.

Regeln binder även specifikationens upphovsman: Lifetime Oy utfärdar inget KYA-S1-certifikat till sin egen DWS IQ-plattform förrän en oberoende, extern bedömare har signerat det.

## KYA-AL-säkerhetsnivåer (Assurance Levels)

Branschens KYA-AL-säkerhetsnivåer definierar revisionsfrekvensen och SLA-responstiden:

| Säkerhetsnivå          | Revisionsfrekvens      | Krävt bevisdjup                                                | SLA-responstid (IDV & TC4) |
| ---------------------- | ---------------------- | -------------------------------------------------------------- | -------------------------- |
| **KYA-AL1 (Standard)** | Årlig revision         | Tredjepartsrevision inom minst 1 område + signerad telemetri   | max 15 minuter             |
| **KYA-AL2 (Enhanced)** | Kvartalsvis            | Revision inom IDV- och BHM-området + 12 mån signerad telemetri | max 5 minuter              |
| **KYA-AL3 (Critical)** | Kontinuerlig i realtid | Extern bedömare inom alla 7 områden + signerad SLA             | max 60 sekunder            |

## Direkt koppling till EU:s AI-förordning (§4)

KYA-S1-specifikationen producerar material som är direkt användbart mot skyldigheterna i EU:s AI-förordning:

- **Artikel 12 (Loggning):** KYA-S1:s PRV-kontroll ger reproducerbarhet för beslut (PRV-2) och oföränderlig historik.
- **Artikel 14 (Mänsklig tillsyn / HIC):** KYA-S1:s IDV, TC4, TRS och PRV-4 garanterar människans verkliga befäls- och vetorätt.
- **Artikel 50 (Transparens):** KYA-S1:s PRV-3 ger en verifierbar ursprungsmärkning för utdata.

**Den ärliga gränsen:** KYA-S1-överensstämmelse är inte i sig överensstämmelse med EU:s AI-förordning. Den ger köparen hårt tekniskt bevis för att agentens beteende vid körning uppfyller lagens bokstav.

## Kort sagt

- **En signerad sida:** en autonom agent behöver ett eget säkerhetsdokument.
- **Verklig tillsyn:** KYA-S1 garanterar att en mänsklig befälhavare binds till agenten (IDV), begränsning under körning (REG/BHM) och en nödbroms utan fördröjning (TC4).
- **Ingen självutvärdering (§3):** som bevis godtas endast en oberoende bedömares signatur eller kryptografisk telemetri.
- **AL-säkerhetsnivåer:** AL1, AL2 och AL3 definierar den krävda responshastigheten, från 15 minuter ända ner till 60 sekunder.

## Se seriens övriga delar

- **Del 1:** Känn din agent (KYA-S1) — En signerad sida om den AI som rör dina data
- **Del 2:** KYC:s motsvarighet för AI — sju kritiska KYA-frågor
- **Del 3:** EU:s AI-förordning artikel 14 (HIC) och motsättningen i agenters självständighet
- **Del 4:** Agentklasser: utvecklarens GitHub Copilot vs. industrins DWS IQ-bakgrundsagenter
- **Del 5:** KYA-S1 och BPMN 2.0: hur en AI-agents förtroendenivå styr en industriprocess i praktiken
- **Del 6:** KYA-S1 v1.3 × BPMN 2.0: atomisk Lease Token, fail-closed och ärlig TRS-beräkning
- **Del 7:** När något går fel: 72 timmars felklassificering (FLT) och beslutsreproduktion (PRV) i praktiken
- **Del 8:** KYA-S1-ekosystemet & produktionsfärdplanen
- **Del 9:** Lifetime World Model (LWM) — ett globalt tillståndsregister och minne
- **Del 10:** Agentic commerce-protokoll & autonoma betalningar
- **Del 11:** Kopplingen till eWallet EU (EUDI Wallet) & eIDAS 2.0

---

Risto Anton Päärni

Founder, CEO, Lifetime Oy

Chefredaktör, Lifetime Scope Journal
