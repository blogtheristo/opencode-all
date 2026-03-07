# Firehorse-tuotevalmistuksen toimintamalli
## Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille

---
# VERSION AND AGENT HISTORY

Version: 3.19

Sessions & Modifications:
  - Version: 3.19 | Tool: Claude Code (Opus 4.6) | Session: claude/happy-rhodes | Date: 07.03.2026 | Changes: Laajennettu osio 2.5.3 MCP Hub -orkestrointimallit toteutustiedoilla (4 mallia: Fan-Out, Sequential, Reflection, Pipeline), päätepisteet, kontekstin välitys, tuotantovalmiustaulukko; lisätty osio 2.5.4 Skillit ja CLI:t agenttirajapintoina (kolmen rajapinnan sääntö: CLI + MCP + skillit)
  - Version: 3.18 | Tool: GitHub Copilot (Claude Opus 4.6) | Session: Learn-Thinking | Date: 04.03.2026 | Changes: Lisätty osio 9.5 Learn Thinking (oppimisajattelu) — päivittäinen oppimissilmukka Learn/-kansion kautta, opinnäytetyötiedostot lisätty Generate-PDFs-putkeen, reflektiivinen oppimiskehys tekoälyavusteiselle tuotekehitykselle
  - Version: 3.17 | Tool: Claude Code (Sonnet 4.6) | Session: claude/implement-workflow-agents-CHFFN | Date: 02.03.2026 | Changes: Lisätty osio 10.13 (Climate IQ Pantheon — kreikkalais-roomalainen moniagenttijärjestelmä: 6 orkestraattoria + 7 toimialaerityistä agenttia, SOUL.md-identiteettimalli, prompt injection -korjaus, EU AI Act artikla 12 -lokituki); lisätty avainpanos #12; päivitetty alatunniste
  - Version: 3.17 | Tool: Claude Code (Sonnet 4.6) | Session: claude/organize-repo-structure-F3xqn | Date: 02.03.2026 | Changes: Lisätty osio 10.13 (Claude Code -suunnittelurakenne: tekoälytyönkulku ensiluokkaisena ohjelmistokomponenttina) — CLAUDE.md projektimuistina, taidot uudelleenkäytettävinä työnkulkukomponentteina, koukut automatisoituna laadunvalvontana, aliagentit rinnakkaissuoritukseen; lisätty avainpanos #12; päivitetty alatunniste; validoitu kehittyvää Claude Code -yhteisön parhaita käytäntöjä vastaan
  - Version: 3.16 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: KONSOLIDOITU — ratkaisee versioajautumisen 3.12-3.15. Lisätty osio 10.11 (Toimitusjohtajan automaatioagenttiryhmä: Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor); osio 10.12 (Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI, Mistral + Monituottaja-LLM-reititin); lisätty avainpanokset #10-11; päivitetty alatunniste
  - Version: 3.15 | Tool: Cursor AI / Claude Code | Session: [seuraamaton] | Date: 25-27.02.2026 | Changes: [SEURAAMATON AJAUTUMINEN] DWS6→DWS7 siirtymädokumentaatio; CLAUDE.md tiivistys; session handover; ZenFree; Resend
  - Version: 3.14 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: [TALLENNETTU versiossa 3.11] OpenSandbox Vaihe 1.5 + EMPO²
  - Version: 3.13 | Tool: Claude Code (Opus 4.6) | Session: claude/dws6-dws7-update-doc-I2Cgk | Date: 27.02.2026 | Changes: [SEURAAMATON AJAUTUMINEN] Strategiset kumppanuudet; monituottaja-LLM-reititin
  - Version: 3.12 | Tool: Claude Code (Opus 4.6) | Session: claude/ai-agent-orchestration-t89Ig | Date: 24.02.2026 | Changes: [SEURAAMATON AJAUTUMINEN] Toimitusjohtajan automaatioagenttiryhmä (3 agenttia)
  - Version: 3.11 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Lisätty osio 10.10 (Agent Foundry Vaihe 1.5 — OpenSandbox Acer Veriton GN100 -laitteella); lisätty EMPO²-viite (arXiv:2602.23008 — hybridi on/off-policy RL muistia hyödyntäville agenteille); päivitetty NCC Hiekkalaatikko-vaihe; lisätty avainpanos #9
  - Version: 3.10 | Tool: Claude Code (Opus 4.6) | Session: claude/modernize-dws7-77v2B | Date: 24.02.2026 | Changes: Lisätty osio 10.9 DWS7 agenttiarkkitehtuurin modernisointi — dokumentoi 6 kriittistä korjausta (agenttisilmukat, työkalujen käyttö, monituottaja-LLM, agenttien delegointi, MCP-palvelin, tapahtumaväylä), Build for Agents -periaate (CLI, Claude Code Skills), agenttikeskeinen tuotesuunnittelufilosofia
  - Version: 3.9 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Parannettu LWM-määritelmä yrityksen oppimiskerroksena (hienosäätää dataa/sääntelyä, optimoi markkina-arvon, varmistaa kilpailuedun), lisätty 16 toimialan ristioppimisen verkostovaikutusten analyysi
  - Version: 3.8 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Lisätty osiot 10.6 Toimialakohtainen avoimen LLM:n valinta (16 toimialaa, 7 ehdokasmallia), 10.7 Yrityksen BYOA-arkkitehtuuri (Tuo omat agentit — NCC-skenaario, 24 agenttia, Langflow+React Flow+Temporal.io graafinen työnkulkurakentaja, urakoitsija-agentin käyttöönotto)
  - Version: 3.7 | Tool: Claude Code (Opus 4.6) | Session: HIL-PR-Automation | Date: 20.02.2026 | Changes: Lisatty Liite H — Automatisoitu PR-tyonkulku (HIL-automaatio): kaksoismallin AI-katselmointi (Claude + Gemini), Copilot-korjaussilmukka, automaattiyhdistamistyonkulku, MCP Hub Gemini-paatepiste, Cloud Run dws6run6 -kayttoonotto. Generoitu versioidut HTML-tiedostot Learn/-kansioon
  - Version: 3.6 | Tool: Claude Code (Opus 4.6) | Session: e5wXD | Date: 20.02.2026 | Changes: Paivitetty DWS-standardit, admin-manuaalit HIL-automaatioviittauksilla. Versiotunnuksen korjaus (3.4-3.5 eivat olleet seurannassa)
  - Version: 3.5 | Tool: Claude Code (Opus 4.6) | Session: e7fe405 | Date: 20.02.2026 | Changes: Lisatty osio 12 IPR-suojaus ja liikesalaisuusstrategia, osio 13 Prompt caching -arkkitehtuuri AI-agenteille, uudelleennumeroitu osiot 12-15 → 14-17, lisatty EU:n liikesalaisuusdirektiivin viitteet
  - Version: 3.4 | Tool: Cursor AI (Claude Sonnet 4.6) | Session: 278819d | Date: 18.02.2026 | Changes: Yrityksen nimimuutos Lifetime Consulting Oy → Lifetime Oy kaikissa dokumenteissa (Omnibus_Fit55-analyysitiedostot)
  - Version: 3.3 | Tool: Claude Code (Opus 4.6) | Session: V3-Merge | Date: 10.02.2026 | Changes: Yhdistetty Thesis_FI.md (v2.1) ja V2Thesis_FI.md (v3.2) yhdeksi kokonaisversioksi. Korjattu skandinaaviset merkit, päivitetty tunnistetiedot, lisätty DWS10-verkkokauppa-, äänichat- ja HIL-putkiosiot, Karpathy-liite, Firehorse-toimintamalliosiot
  - Version: 3.2 | Tool: Claude Code (Opus 4.6) | Session: HIL-Pipeline | Date: 07.02.2026 | Changes: Lisätty osio 6.7 - Ihminen-silmukassa-oppimisputki (päivittäinen automaatio, kolmikerroksinen varmuuskopiointi, Learn/-kansion tuloste)
  - Version: 3.1 | Tool: Claude Code (Opus 4.5) | Session: Karpathy-Principles | Date: 04.02.2026 | Changes: Lisätty Liite E - Tekoälyagenttien toimintaohjeet (Karpathyn periaatteet), EU:n tekoälysäädöksen vaatimustenmukaisuuskartoitus, toteutuksen tulosmittarit
  - Version: 3.0 | Tool: Claude Code (Opus 4.5) | Session: DWS10-Store-Integration | Date: 28.01.2026 | Changes: Lisätty DWS10.com verkkokaupan löydökset, Google Merchant Center -integraatio, Revolut Business -maksut, Äänichat-kehityssuunnitelma Groq/Llama-malleilla, Toimialan hiilijalanjälkilaskuri, EU-vaatimustenmukaisuuskartoitus
  - Version: 2.2 | Tool: Word (HIL) | Session: dws6.com Google Run | Date: 19.01.2026 | Changes: Google admin@dws6.com sekä projekti Google alle. Perustettu 19.1.2026. Google Workspace Standard otettu käyttöön. Vaihdettu DNS-tiedot Proton → Google. Luotu projekti dws6run joka tulee palvelemaan Google Run -prosesseja.
  - Version: 2.1 | Tool: Cursor AI (Claude) | Session: 16-Industries | Date: 06.01.2026 | Changes: Lisätty Fit for 55:n 16 teollisuudenalan analyysi, AI-käytön ilmoitus, DWS10-käyttötapaukset, laajennettu nykytila-analyysi
  - Version: 2.0 | Tool: Cursor AI (Claude) | Session: Thesis-Revision | Date: 05.01.2026 | Changes: Suuri revisio - Lisätty Solution Factory -malli, AgentFoundry-dokumentaatio, Lifetime Scope Signals -teoria, SWOT-analyysi, tutkimuskysymysten vastaukset, täydellinen teoreettinen viitekehys
  - Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with English version

Session Links & References:
  - Claude Code (2026-02-10): V3-yhdistäminen ja skandinaavisten merkkien korjaus
  - Claude Code (2026-01-28): DWS10-kaupan integraatio, Google Merchant, Revolut, Äänichat-suunnitelma
  - Cursor AI (2026-01-05): Opinnäytetyön revisio integroiden koodikannan todisteet
  - GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/fi/V3Thesis_FI.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 07.03.2026
  - Language: Finnish
  - Languages Available: English, Suomi
  - Publication Status: DRAFT (V3.19 — MCP Hub -orkestrointimallit + skillit/CLI agenttirajapintoina)

---

**Opinnäytetyö**
**Metropolia Ammattikorkeakoulu**

**Tekijä:** Risto Anton Päärni
**Koulutusohjelma:** Smart Factory, YAMK
**Ohjaaja:** Jarno Varteva (mukana Erkki Räsänen)
**Yritys:** Lifetime Oy (Firehorse-brändi)
**Päivämäärä:** 16.1.2026
**InvestEU Portal:** Projekti Lifetime World, DWS IQ 6, Firehorse (INPO-20254383) jätetty julkaistavaksi InvestEU-portaaliin 25.12.2025 — InvestEU Portal Team, Euroopan komissio

---

## Tiivistelmä

Tämä opinnäytetyö tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistää pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Työ keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymässä (digitaalinen + vihreä). **Versio 3.0 laajentaa tutkimusta verkkokauppavalidoinnilla DWS10.com-kaupan toteutuksen, Google Merchant Center -integraation, Revolut Business -maksukäsittelyn ja äänichat-kehityssuunnitelman kautta Groq-inferenssiä ja Llama-malleja käyttäen.**

**Avainsanat:** Tekoäly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut, verkkokauppa, Google Merchant Center, Revolut Business, äänichat, EU:n tekoälysäädös

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green). **Version 3.0 extends the research with e-commerce validation through DWS10.com store implementation, Google Merchant Center integration, Revolut Business payment processing, and an audio chat evolution roadmap using Groq inference with Llama models.**

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services, E-Commerce, Google Merchant Center, Revolut Business, Audio Chat, EU AI Act Compliance

---

## Tekoälytyökalujen käyttö

Tämän opinnäytetyön laatimisessa on hyödynnetty tekoälyavusteisia työkaluja läpinäkyvyyden ja akateemisen rehellisyyden mukaisesti.

**Käytetyt työkalut:**
- **Claude Code (Anthropic Opus 4.5/4.6)** — DWS10-verkkokaupan integraatio, dokumentaation generointi, V3-yhdistäminen
- **Claude (Anthropic)** — Tekstin muokkaus, rakenteen tarkistus, kieliasun parantaminen
- **Cursor AI** — Koodin dokumentointi, teknisten osioiden validointi
- **GitHub Copilot** — Koodiesimerkit, tekninen dokumentaatio

**AI:n rooli dokumentaatiossa:**
- Kieliasun tarkistus ja parannusehdotukset (FI/EN)
- Teknisen dokumentaation jäsentely ja yhdenmukaistaminen
- Käännösapu suomi-englanti
- Taulukkojen ja diagrammien formatointi
- Verkkokaupan ylläpitokäsikirjojen generointi

**Tekijän alkuperäinen panos:**
- Kaikki tutkimuskysymykset, hypoteesit ja johtopäätökset
- Alkuperäinen sisältö, argumentaatio ja analyysi
- Live-koodikanta ja toteutus (dws6-repositorio: 50 000+ LOC)
- Liiketoimintamallin suunnittelu ja validointi
- Asiakashaastattelut ja data (Uber, Bolt, Kela — €10k MRR)
- Solution Factory -mallin ja AgentFoundry-arkkitehtuurin kehitys
- DWS10.com-verkkokaupan tuotekatalogi ja integraatiot

**Todisteaineisto:**
- Git-versiohistoria: [github.com/blogtheristo/dws6](https://github.com/blogtheristo/dws6)
- Live-asiakasvalidointi: €10 000+ MRR
- Toimiva järjestelmä: DWS10.com, DWS6.com, onelifetime.world, lifetime.fi
- Google Merchant Center: Tili 8496329, 30 tuotetta hyväksytty

---

# Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Teoreettinen viitekehys](#2-teoreettinen-viitekehys)
3. [Nykytila-analyysi](#3-nykytila-analyysi)
4. [DWS6-toimintamallin suunnittelu](#4-dws6-toimintamallin-suunnittelu)
5. [Toteutus (MVP-vaihe)](#5-toteutus-mvp-vaihe)
6. [DWS10.com-verkkokaupan integraatio](#6-dws10com-verkkokaupan-integraatio)
7. [Äänichat-kehityssuunnitelma](#7-äänichat-kehityssuunnitelma)
8. [Tulokset ja analyysi](#8-tulokset-ja-analyysi)
9. [Pohdinta](#9-pohdinta)
10. [Johtopäätökset](#10-johtopäätökset)
11. [Lähteet](#11-lähteet)
12. [Liitteet](#12-liitteet)

---

# 1. Johdanto

## 1.1 Tausta

Eurooppalaiset teollisuuden pk-yritykset kohtaavat "kaksoissiirtymän" haasteen:

- **Digitaalinen muutos**: AI, automaatio, reaaliaikainen päätöksenteko
- **Vihreä siirtymä**: EU Fit for 55 (55% päästövähennys vuoteen 2030 mennessä), sisältyvän hiilen mittausvaatimukset vuoteen 2028 mennessä

Perinteiset SaaS-alustat epäonnistuvat, koska ne:
1. Maksavat €1 400+/kk (liian kalliita pk-yrityksille)
2. Vaativat vain pilvipohjaiset arkkitehtuurit (korkea latenssi, korkeat käyttökustannukset)
3. Eivät käsittele toimialakohtaisia compliance-työnkulkuja

**Firehorse (DWS6)** ratkaisee tämän uudella toimintamallilla, joka yhdistää:
- Ilmaistason pilvi-infrastruktuurin (€0-350/kk vs €1 400+)
- Edge AI (NVIDIA Jetson) <100ms päättelylle
- Toimialakohtaiset AI-agentit (Rakentaminen, Valmistus, Energia)
- Vaiheittainen käyttöönotto (Hiljainen pilotti → Neuvonantaja → Autonominen)
- **Verkkokauppavalidointi DWS10.com:n, Google Merchant Centerin ja Revolut Businessin kautta** [V3.0]

## 1.2 Tutkimusongelma

**Päätutkimuskysymys:**
Miten bootstrapattu teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridi pilvi-edge-toimintamallin kautta säilyttäen samalla <€400/kk käyttökustannukset?

**Alatutkimuskysymykset:**

1. **Tuote ja liiketoimintamalli:** Miten kehitetään asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvälisesti?

2. **Teknologia:** Miten rakennetaan digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + edge + verkkokauppa?

3. **Teknisten ratkaisujen evaluointi:** Mikä tekninen ratkaisu parhaiten tukee liiketoimintatavoitteita?

4. **Yritysturvallisuus:** Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

5. **Verkkokauppavalidointi:** Miten automatisoitu kauppa tekoälyavusteisilla toiminnoilla voi validoida tuote-markkinasopivuuden? [V3.0]

## 1.3 Työn tavoitteet

1. Dokumentoida Firehorse-toimintamalli (MVP → V1)
2. Validoida ilmaistason kustannusmalli (€0/kk tavoite)
3. Mitata asiakashyöty (≤2kk takaisinmaksuaika)
4. Luoda toistettava malli muille teollisuuden startup-yrityksille
5. **Validoida verkkokauppakanava Google Merchant Center -integraatiolla** [V3.0]

## 1.4 Rajaukset

- **Toimiala:** Rakennusteollisuus (3,5M yritystä Euroopassa) + 15 muuta EU-toimialaa
- **Markkina:** Pohjoismaat + Keski- ja Itä-Eurooppa
- **Aikajänne:** MVP-vaihe (joulukuu 2025 - helmikuu 2026)
- **Asiakkaat:** 5 pilottiasiakasta (€10-100M liikevaihto)
- **Verkkokauppa:** 30 tuotetta alusta-, ohjelmisto- ja palvelukategorioissa [V3.0]

## 1.5 Keskeiset käsitteet

| Käsite | Määritelmä |
|--------|------------|
| **MVP** | Minimum Viable Product - Pienin toimiva tuote |
| **Edge AI** | Tekoäly, joka toimii laitteen sisällä (ei pilviyhteyttä) |
| **SaaS** | Software as a Service - Ohjelmisto palveluna |
| **DWS6** | Digital Work System 6 - Firehorse-alustan tekninen nimi |
| **Sisältyvä hiili** | Rakennusmateriaalien valmistuksen ja kuljetuksen päästöt |

---

# 2. Teoreettinen viitekehys

## 2.1 Lean Startup -menetelmä

Lean Startup -metodologia (Ries, 2011) muodostaa Firehorse-tuotekehityksen perustan. Build-Measure-Learn -syklin ydinperiaate ohjaa suoraan vaiheittaista käyttöönottomallia:

**Soveltaminen Firehorseen:**

| Lean Startup -konsepti | Firehorse-toteutus |
|------------------------|-------------------|
| **MVP (Minimum Viable Product)** | 2 agenttia (CustomerSat, Viability) 5 pilottiasiakkaalle |
| **Validoitu oppiminen** | Hiljainen pilotti -vaihe havainnoi ennen toimintaa |
| **Build-Measure-Learn** | Vaihe 1 → Vaihe 2 → Vaihe 3 eteneminen |
| **Pivot tai Persevere** | Signaalipohjainen koordinointi mahdollistaa nopean kurssinkorjauksen |

Customer Development -metodologia (Blank, 2013) laajentaa tätä periaatteella "rakennuksesta ulos" - tuote-markkinasopivuuden validointi todellisten asiakkaiden kanssa ennen skaalausta. Firehorse-lupaus 2 kuukauden takaisinmaksuajasta operationalisoi tämän luomalla mitattavan validointimittarin.

## 2.2 Alustatalous

Alustatalous (Parker, Van Alstyne & Choudary, 2016) selittää, miten moniosaiset alustat luovat arvoa verkostovaikutusten kautta. Firehorse Solution Factory -malli laajentaa tätä teoriaa teolliseen tekoälyyn:

**Monipuolinen alustasuunnittelu:**

```
┌─────────────────────────────────────────────────────────────┐
│                FIREHORSE-ALUSTAEKOSYSTEEMI                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PUOLI 1: Teolliset asiakkaat (8 vertikaalissa)             │
│  ├─ Rakentaminen: NCC, T2H (5 projektia, €50M salkku)       │
│  ├─ Logistiikka: Uber, Bolt, Kela (€10k MRR pilotin aikana) │
│  ├─ Valmistus: 2M+ yritystä Euroopassa                      │
│  └─ 5 lisävertikaalista (Energia, Terveydenhuolto, jne.)    │
│                                                              │
│  PUOLI 2: Data- ja tiedusteluntarjoajat                      │
│  ├─ Lifetime World Model (55B parametrin LLM)               │
│  ├─ EU-vaatimustenmukaisuustietokannat (Fit for 55, EPBD)   │
│  └─ Toimialakohtaiset hiilitkerroimet                       │
│                                                              │
│  PUOLI 3: Laitteisto- ja reunakumppanit                      │
│  ├─ NVIDIA (Jetson Orin Nano -reunalaitteet)                │
│  ├─ Acer/Asus (Blackwell-koulutusinfrastruktuuri)           │
│  └─ IoT-anturivalmistajat                                   │
│                                                              │
│  VERKOSTOVAIKUTUKSET:                                        │
│  • Ristivertikaalinen tiedustelu (Logistiikka → Rakentaminen)│
│  • Jokainen uusi vertikaali tekee KAIKISTA vertikaaleista   │
│    älykkäämpiä                                               │
│  • Agenttipohjat tulevat uudelleenkäytettäviksi toimialojen │
│    välillä                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 2.3 Teollisuus 5.0

Teollisuus 5.0 (Euroopan komissio, 2021) edustaa evoluutiota Teollisuus 4.0:n automaatiofokuksesta kohti ihmiskeskeistä, kestävää ja resilienttiä teollista paradigmaa. Firehorse-toimintamalli toteuttaa suoraan nämä kolme pilaria:

**Ihmiskeskeinen toteutus:**
Kolmivaiheinen käyttöönottomalli (Hiljainen pilotti → Neuvonantaja → Autonominen) varmistaa ihmisen valvonnan:

| Vaihe | Ihmisen rooli | AI:n rooli | Teollisuus 5.0 -yhteensopivuus |
|-------|--------------|------------|-------------------------------|
| **Hiljainen pilotti** | Täysi kontrolli | Vain havainnointi | Maksimaalinen ihmisen toimijuus |
| **Neuvonantaja** | Hyväksyntä vaaditaan | Suositukset | Yhteistyöpäätöksenteko |
| **Autonominen** | Poikkeusten käsittely | Toiminta kaiteissa | Ihmisen valvonta reunatapauksissa |

## 2.4 Reunalaskennan taloustiede

Reunalaskennan taloustiede (Shi et al., 2016) tarjoaa teoreettisen perustan Firehorsen hybridiarkkitehtuurille. Keskeinen oivallus on, että latenssi- ja kaistanleveyskulut usein ylittävät keskitetyn prosessoinnin säästöt:

**Latenssi-kustannus-kompromissianalyysi:**

| Prosessointisijainti | Latenssi | Kuukausikustannus | Käyttötapaus |
|---------------------|----------|-------------------|--------------|
| **Pilvi (Groq API)** | 500-2000ms | €555/kk | Monimutkainen päättely, raporttien generointi |
| **Reuna (Jetson Orin Nano)** | <100ms | €100/vuosi (sähkö) | Reaaliaikainen työmaan seuranta |
| **Hybridi** | Molempien parhaat | €25-350/kk | Firehorse-optimaalinen konfiguraatio |

**Reunatekoälyn ROI-laskelma:**

```
Pilviratkaisu (12kk):
  Laskenta: €555/kk × 12 = €6 660/vuosi
  Yhteensä: €6 660/vuosi

Reunatekoälyratkaisu:
  Laitteisto (kertamaksu): €1 084 (Jetson Orin Nano + tarvikkeet)
  Sähkö: €10/kk × 12 = €120/vuosi
  Vuosi 1 yhteensä: €1 204
  Vuosi 2+ yhteensä: €120/vuosi

Säästö: €5 456/vuosi (82% halvempi)
Takaisinmaksuaika: 1,95 kuukautta
```

## 2.5 Moniagenttijärjestelmien teoria ja Lifetime Scope Signals

Tämä osio esittelee uuden teoreettisen kontribuution: **Lifetime Scope Signals -protokollan** moniagenttikoordinointiin bootstrapatuissa teollisissa tekoälyalustoissa.

### 2.5.1 Moniagenttijärjestelmien tausta

Moniagenttijärjestelmien (MAS) teoria (Wooldridge, 2009) tarjoaa perustan ymmärtää, miten autonomiset agentit voivat koordinoida monimutkaisten tavoitteiden saavuttamiseksi. Keskeisiä käsitteitä Firehorseen sovellettuna:

- **Agentin autonomia:** Kukin agentti toimii itsenäisesti määritellyillä vastuualueilla
- **Agenttikommunikaatio:** Agentit vaihtavat signaaleja koordinoidakseen riippuvuuksia
- **Emergentti käyttäytyminen:** Järjestelmätason kyvyt syntyvät agenttivuorovaikutuksista
- **Koordinointimekanismit:** Protokollat varmistavat agenttien työskentelyn yhteisten tavoitteiden eteen

### 2.5.2 Lifetime Scope Signals -protokolla

Lifetime Scope Signals -protokolla on uusi koordinointimekanismi, joka kehitettiin DWS IQ 6:lle. Se mahdollistaa deterministisen moniagenttikehityskoordinoinnin. Toisin kuin perinteiset MAS-lähestymistavat, jotka perustuvat reaaliaikaiseen neuvotteluun, tämä protokolla käyttää **deklaratiivista signaaliemissiota** riippuvaisten agenttien vapauttamiseen.

**Signaalimuoto:**
```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

**Signaalityypit:**

| Tyyppi | Merkitys | Toiminto |
|--------|----------|----------|
| `READY` | Virstanpylväs saavutettu | Vapauttaa alavirran agentit |
| `COMPLETE` | Kaikki agentin työ valmis | Agentti siirtyy valmis-tilaan |
| `ERROR` | Agentti kohtasi virheen | Hälyttää koordinaattorin |
| `BLOCKED` | Odottaa ulkoista riippuvuutta | Ei toimintaa ennen vapautusta |

### 2.5.3 MCP Hub -orkestrointimallit

Model Context Protocol (MCP) Hub (`mcp-hub/server.py`, portti 8765) toteuttaa neljä työnkulkumallia moniagenttien koordinointiin. Jokainen malli tarjoaa oman HTTP-päätepisteen ja hoitaa agenttien reitityksen, virheiden välityksen ja tulosten koostamisen.

**1. Fan-Out -malli** (`POST /workflow/fan-out`)
Jakaa tehtävät useille agenteille rinnakkaisesti `asyncio.gather()`-kutsulla. Kaikki agentit suoritetaan samanaikaisesti jaetulla HTTP-asiakkaalla (300s aikakatkaisu). Poikkeukset serialisoidaan tehtäväkohtaisesti, mikä mahdollistaa osittaisen onnistumisen — jos yksi agentti epäonnistuu, muut palauttavat silti tulokset. Käytetään kategorian B (Operatiiviset) agenteille, joiden tehtävät ovat toisistaan riippumattomia.

**2. Sequential-malli** (`POST /workflow/sequential`)
Suorittaa tehtävät yksi kerrallaan riippuvuusjärjestyksessä. Jokaisen tehtävän tulos injektoidaan seuraavan tehtävän `context["previous_result"]`-kenttään, luoden eksplisiittisen tietovirran. Sopii putkistoihin, joissa yhden agentin tuloste syöttää seuraavaa (esim. tiedon poiminta → analyysi → raportin luonti).

**3. Reflection-malli** (`POST /workflow/reflection`)
Toteuttaa iteratiivisen toteutus-arviointi -silmukan. Toteutusagentti tuottaa tulosteen, arviointiagentti pisteyttää sen (0.0–1.0) ja antaa palautetta. Jos pistemäärä jää alle konfiguroitavan kynnysarvon (oletus 0.85), palaute injektoidaan takaisin toteutusagentille uutta iteraatiota varten (enintään 3 oletuksena). Käytetään kategorian C (Asiakasrajapinta) agenteille, joissa tulosteen laatu on kriittistä.

**4. Pipeline-malli** (`POST /workflow/pipeline`) — *Suositeltu tuotantokäyttöön*
Yhdistää rinnakkaisen ja peräkkäisen suorituksen vaiheistettujen työnkulkujen avulla. Jokainen vaihe sisältää tehtävälistan, joka suoritetaan rinnakkaisesti (fan-out vaiheen sisällä), kun taas vaiheet suoritetaan peräkkäin (vaiheen N tulokset virtaavat kontekstina vaiheeseen N+1). Tämä välttää peräkkäisen pullonkaulan säilyttäen samalla riippuvuusjärjestyksen loogisten vaiheiden välillä.

| Malli | Rinnakkaisuus | Kontekstin välitys | Sopii parhaiten |
|-------|--------------|---------------------|-----------------|
| Fan-Out | Täysin rinnakkainen | Ei | Riippumattomat tehtävät |
| Sequential | Ei | Edellinen → Seuraava | Riippuvuusketjut |
| Reflection | Ei | Palautesilmukka | Laatukriittinen tuloste |
| Pipeline | Rinnakkainen vaiheiden sisällä | Vaihe → Vaihe | Tuotantotyökuormat |

Yhteenvetona MCP Hub -orkestroija tukee neljää työnkulkumallia (Fan-Out, Sequential, Reflection, Pipeline), joita voidaan yhdistellä tuotantotason työnkuluiksi.
### 2.5.4 Skillit ja CLI:t agenttirajapintoina

"Build for Agents" -periaate edellyttää, että jokaisen DWS-tuotteen on oltava käytettävissä kolmen toisiaan täydentävän rajapinnan kautta GUI:n lisäksi: CLI, MCP-palvelin ja Claude Code -skillit.

**CLI (komentorivikäyttöliittymä)**
CLI (`npx tsx cli/src/cli.ts <komento>`) tuottaa strukturoidun JSON-tulosteen jokaiselle agenttitoiminnolle. Tämä seuraa toimialan trendiä, jossa tekoälyagentit käyttävät työkaluja komentorivikäyttöliittymien kautta graafisten käyttöliittymien sijaan. Keskeiset komennot:

- `dws agents` — Listaa kaikki rekisteröidyt agentit
- `dws run <agentti> --input '{...}'` — Suorita nimetty agentti strukturoidulla syötteellä
- `dws workflow <nimi>` — Käynnistä moniagenttityönkulku

CLI-ensin -lähestymistapa varmistaa, että jokainen ominaisuus on automatisoitavissa, testattavissa ja yhdisteltävissä. Tuote, joka on olemassa vain GUI:na, katsotaan keskeneräiseksi.

**MCP-palvelin**
MCP-päätepiste (`/mcp`, JSON-RPC 2.0) tekee kaikista agenteista automaattisesti löydettäviä `tools/list`-kutsulla. Ulkoiset tekoälyjärjestelmät (Claude Code, Cursor, VS Code Copilot) voivat yhdistää MCP-palvelimeen ja kutsua mitä tahansa agenttia työkaluna. Tämä toteuttaa Model Context Protocol -määrityksen standardoitua työkaluintegraatiota varten.

**Claude Code -skillit**
Skillit (`.claude/commands/*.md`) ovat uudelleenkäytettäviä työnkulkukomponentteja, jotka kapseloivat agenttikutsut slash-komennoiksi. Kuusi tuotantoskilliä on käytössä:

| Skilli | Tarkoitus |
|--------|-----------|
| `/compliance-check` | EU-säädösten puuteanalyysi (ETS, CBAM, CSRD) |
| `/agent-run` | Suorita mikä tahansa nimetty agentti strukturoidulla syötteellä |
| `/workflow` | Käynnistä moniagenttityönkulkuja |
| `/discover-agents` | Etsi agentteja kyvykkyysavainsanalla |
| `/site-safety` | Rakennustyömaan turvallisuusarviointi |
| `/carbon-analysis` | Hiilijalanjäljen laskenta (embodied carbon) |

Jokainen skilli on kutsuttava, testattava komponentti, joka yhdistää kehotesuunnittelun ja työkalujen orkestroinnin. Skillimalli varmistaa, että agenttikyvykkyydet ovat käytettävissä ilman, että käyttäjän tarvitsee ymmärtää alla olevaa MCP-protokollaa tai CLI-syntaksia.

**Kolmen rajapinnan sääntö:** Jokaisen uuden agentin on toimitettava kaikilla kolmella rajapinnalla (CLI-komento, MCP-työkalu, Claude Code -skilli). Tämä takaa, että agentit ovat käytettävissä ihmisille (CLI), muille tekoälyjärjestelmille (MCP) ja kehitystyönkuluissa (skillit).

## 2.6 Käsitteellinen malli: Firehorse Solution Factory

Firehorse Solution Factory -malli syntetisoi edellä mainitut teoreettiset viitekehykset yhtenäiseksi käsitemalliksi ilmastoälykkäiden teollisten alustojen rakentamiseen:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIREHORSE SOLUTION FACTORY                    │
│              Käsitemalli teollisille AI-alustoille               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STRATEGINEN KERROS (Liiketoimintamalli)                         │
│  ├─ Lifetime World Model (55B) → Ristivertikaalinen tiedustelu  │
│  ├─ 8 vertikaalimallia → Uudelleenkäytettävät agenttikonfigit   │
│  ├─ Ilmaistason bootstrap → $15K krediitit = 6+ vuotta runwayta │
│  └─ EU-vaatimustenmukaisuusvalli → Fit for 55, NIS2, GDPR       │
│                                                                  │
│  OPERATIIVINEN KERROS (AgentFoundry + Lifetime Scope Signals)    │
│  ├─ Agenttikonfiguraatiot → YAML-mallit per vertikaali          │
│  ├─ Lifetime Scope Signals → Koordinointiprotokolla             │
│  ├─ MCP Hub → Moniagenttiorkestrointi                           │
│  └─ Vaiheittainen käyttöönotto → Hiljainen→Neuvonantaja→Auton.  │
│                                                                  │
│  SUORITUSKERROS (Aivot-Muisti-Keho-Kädet)                        │
│  ├─ Aivot: DWS IQ 6 Platform (Groq + Claude + Gemini)           │
│  ├─ Muisti: Lifetime World Model (ilmastotietokanta)            │
│  ├─ Keho: 8 toimialasovellusta (vertikaalikohtaiset agentit)    │
│  └─ Kädet: Reunatekoäly (Jetson), Dronet, Robotit, IoT-anturit  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Tämä käsitemalli tarjoaa toistettavan viitekehyksen muille teollisille AI-startupeille, jotka pyrkivät saavuttamaan tuote-markkinasopivuuden pitäen operatiiviset kustannukset matalina startup-krediittien, reunalaskennan ja moniagenttkoordinoinnin strategisen käytön avulla.

---

# 3. Nykytila-analyysi

## 3.1 Eurooppalainen teollinen AI-maisema

Euroopan teollisuus kohtaa ennennäkemättömän sääntelypaineen EU:n Fit for 55 -paketin myötä. Tämä luo pakotetun kysynnän ilmastovaatimustenmukaisuusratkaisuille 16 teollisuudenalalla.

### 3.1.1 Fit for 55:n vaikuttamat 16 teollisuudenalaa

EU:n Fit for 55 -paketti vaatii 55% nettopäästövähennysten vuoteen 2030 mennessä. Tämä luo ennennäkemättömän vaatimustenmukaisuustaakan 16 teollisuudenalalle — vaatien reaaliaikaista hiiliseurantaa, automatisoitua raportointia, toimitusketjun läpinäkyvyyttä ja jatkuvaa sääntelyyhteensopivuutta.

**Taso 1: Kriittiset päästöteollisuudet (ETS + CBAM suora vaikutus)**

Nämä 8 teollisuudenalaa kohtaavat suurimman sääntelypaineen: suora ETS-kattavuus, CBAM-rajahiilivero ja pakollinen hiilen hinnoittelu.

| # | Teollisuudenala | EU-päästöosuus | Keskeiset säädökset | DWS IQ 6 -ratkaisu |
|---|-----------------|----------------|---------------------|-------------------|
| **1** | **Sähkön- ja lämmöntuotanto** | 25-30% | ETS (katto kiristyy), Uusiutuvaenergia-direktiivi | Reaaliaikainen päästöseuranta, uusiutuvuustodistusseuranta |
| **2** | **Rauta- ja terästeollisuus** | Korkea | ETS, CBAM (2026), ESR | Toimitusketjun hiiliseuranta, CBAM-tuontiraportointi |
| **3** | **Sementti- ja kalkkiteollisuus** | Erittäin korkea | ETS, CBAM, EPBD (sisältyvä hiili) | EN 15978 -laskelmat, materiaalien hiilipassit |
| **4** | **Kemian- ja petrokemianteollisuus** | Korkea | ETS, CBAM (lannoitteet), H2-mandaatit | Prosessipäästöseuranta, vetysiirtymäkartat |
| **5** | **Lentoliikenne** | 2-3% (kasvava) | ETS, ReFuelEU (SAF-mandaatit) | SAF-vaatimustenmukaisuus, kompensaatioiden verifiointi |
| **6** | **Meriliikenne** | Merkittävä | ETS (2024), FuelEU Maritime | Matkakohtaiset päästöt, intensiteettidata |
| **7** | **Maantieliikenne ja logistiikka** | Korkea | ETS2 (2027), CO2-standardit | Kalustopäästöhallinta, nollapäästösiirtymäsuunnittelu |
| **8** | **Rakentaminen ja kiinteistöt** | 36-40% elinkaaresta | ETS2, EPBD, CSRD | **Täysi elinkaarihiiliautomaatio**, BIM-integraatio, EN 15978/EN 15804 |

**Taso 2: Tärkeät päästöteollisuudet (ESR + epäsuora ETS)**

Nämä 8 teollisuudenalaa kohtaavat hajautettua sääntelypainetta kansallisten ESR-tavoitteiden, energiakustannusten, toimitusketjusääntöjen ja CBAM:n epäsuorien vaikutusten kautta.

| # | Teollisuudenala | EU-päästöosuus | Keskeiset säädökset | DWS IQ 6 -ratkaisu |
|---|-----------------|----------------|---------------------|-------------------|
| **9** | **Maatalous ja karjatalous** | 10-12% | ESR, Metaanistrategia, CAP | Tilapäästöseuranta, lannoitteiden hiililaskenta |
| **10** | **Jätehuolto ja kierrätys** | 3-4% | Jätepuitedirektiivi, Kaatopaikkadirektiivi | Metaanin talteenottoseuranta, kiertotalousmittarit |
| **11** | **Alumiiniteollisuus** | Korkea (energia) | ETS, CBAM (2026) | Energialähdeseuranta, uusiutuvan sähkön todistukset |
| **12** | **Sellu-, paperi- ja painoteollisuus** | Keskitaso | ETS, LULUCF | Metsähiililaskenta, toimitusketjun läpinäkyvyys |
| **13** | **Öljynjalostus** | Korkea | ETS, ReFuelEU | Alasajosuunnittelu, SAF-tuotantoseuranta |
| **14** | **Elintarviketeollisuus** | Keskitaso | ESR, Energiatehokkuusdirektiivi | Maatalouden toimitusketjuhiili, energiaoptimointi |
| **15** | **Lasi- ja keramiikkateollisuus** | Keskitaso | ETS, CBAM (epäsuora) | Prosessipäästöt, materiaalihiiliseuranta |
| **16** | **Kaivos- ja louhintateollisuus** | Keskitaso | ETS (epäsuora), Kriittiset raaka-aineet | Louhintapäästöt, CRM-toimitusketjuvaatimustenmukaisuus |

### 3.1.2 Sääntelyaikataulu

```
2024 ────────────────────────────────────────────────────────────────
      │ Meriliikenne ETS:ssä
      │ CBAM-siirtymävaihe aktiivinen
      │ CSRD-raportointi alkaa (suuret yritykset)
      │
2025 ────────────────────────────────────────────────────────────────
      │ Omnibus-yksinkertaistukset (hallinnollinen helpotus)
      │ EU AI Act -täytäntöönpano alkaa
      │ NIS2-vaatimustenmukaisuuden määräaika
      │
2026 ────────────────────────────────────────────────────────────────
      │ CBAM täysi toimeenpano (rajahiilivero)
      │ CSRD laajenee useampiin yrityksiin
      │ Ilmaiset ETS-päästöoikeudet vähenevät nopeammin
      │
2027 ────────────────────────────────────────────────────────────────
      │ ETS2 maantieliikenteelle ja rakennuksille
      │ Tiukemmat ajoneuvojen CO2-standardit
      │
2028 ────────────────────────────────────────────────────────────────
      │ EPBD sisältyvän hiilen raportointi (>1 000 m²)
      │ Merkittävä ETS-katon kiristys
      │
2030 ────────────────────────────────────────────────────────────────
      │ 55% päästövähennystavoitteen määräaika
      │ ESR-kansalliset tavoitteet erääntyvät
      │
2035 ────────────────────────────────────────────────────────────────
      │ 100% nollapäästöiset uudet henkilö- ja pakettiautot
```

### 3.1.3 Omnibus-paketti: "Fit for 55 Means Fit for 55"

Euroopan komissio hyväksyi 26.2.2025 Omnibus-yksinkertaistuspaketin, joka keventää pk-yritysten hallinnollista taakkaa säilyttäen kuitenkin ilmastotavoitteet täysin ennallaan (European Commission, 2025).

**Keskeiset muutokset CSRD-raportointiin:**

| Muutos | Ennen | Omnibus jälkeen |
|--------|-------|-----------------|
| **CSRD-soveltamisala** | ~50 000 yritystä | ~10 000 yritystä (>1 000 työntekijää) |
| **Pk-yritysten velvoitteet** | Pakolliset | Vapaaehtoinen standardi (EFRAG SME) |
| **Varmennustaso** | "Limited" → "Reasonable" | Pysyy "Limited"-tasolla |
| **Aikataulu** | 2026-2027 | +2 vuotta lykkäys ("stop the clock") |
| **Säästöarvio** | - | €4,4 miljardia/vuosi |

**Kriittinen havainto: Ilmastotavoitteet säilyvät muuttumattomina**

Omnibus-paketti **ei muuta** Fit for 55:n ydintavoitteita:
- **55% päästövähennys vuoteen 2030** — säilyy
- **ETS-päästökatto** — kiristyy edelleen suunnitelmien mukaan
- **CBAM-rajahiilivero** — voimaan 2026 kuten suunniteltu
- **ETS2 maantieliikenteelle ja rakennuksille** — voimaan 2027
- **EPBD sisältyvän hiilen raportointi** — voimaan 2028

**Vaikutus DWS IQ 6 -liiketoimintamalliin:**

| Segmentti | Omnibus-vaikutus | DWS IQ 6 -mahdollisuus |
|-----------|------------------|------------------------|
| **Suuryritykset (>1 000 hlö)** | CSRD-velvoite säilyy | Premium-ratkaisu |
| **Keskisuuret (250-999 hlö)** | Vapaaehtoinen raportointi | Edullinen kilpailuetuna |
| **Pk-yritykset (<250 hlö)** | Ei raportointivelvoitetta | Toimitusketjupaine suuryrityksiltä |

**Johtopäätös:** Omnibus-paketti tekee Firehorse-mallista entistä kilpailukykyisemmän:
1. **Suuryritykset** tarvitsevat edelleen automaattista raportointia
2. **Pk-yritykset** kohtaavat toimitusketjupaineita CSRD-yrityksiltä
3. **Vapaaehtoinen EFRAG SME -standardi** luo kysynnän edulliselle ratkaisulle
4. **€0-350/kk hinta** on kilpailukykyinen vapaaehtoisen raportoinnin markkinoilla

**Lähde:** European Commission. (2025). *Omnibus package*. [https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en](https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en)

## 3.2 Kilpailija-analyysi

| Kyvykkyys | Firehorse | Atlassian Rovo | SAP | Siemens |
|-----------|-----------|----------------|-----|---------|
| **Kuukausikustannus** | €0-350 | €1 400+ | €4 000+ | €2 000+ |
| **Reunatekoäly** | Natiivi | Ei | Ei | Rajoitettu |
| **16 vertikaalia** | Suunniteltu | Ei | Kyllä | Kyllä |
| **EU-yhteensopiva** | Natiivi | Osittain | Osittain | Kyllä |
| **<100ms latenssi** | Reuna | Ei | Ei | Osittain |
| **Pk-saavutettavuus** | Kyllä | Ei | Ei | Ei |

## 3.3 Asiakassegmentit

**DWS10.com (Firehorse-alusta) kohdeasiakkaat 16 teollisuudenalalla:**

**Taso 1 - Kriittiset teollisuudet (Välitön myyntifokus):**
- **Rakentaminen:** NCC, Skanska, T2H, Vinci, Strabag (36-40% EU-päästöistä)
- **Logistiikka:** Uber, Bolt, Kela, DB Schenker, DHL (€7k MRR live)
- **Valmistus:** Kone, Wärtsilä, ABB, Valmet (ETS + CBAM)
- **Energia:** Fortum, Helen, Vattenfall (25-30% päästöistä)

**Taso 2 - Tärkeät teollisuudet (V1.1+ laajennukset):**
- **Maatalous:** Valio, Arla, maatalousyhteisöt
- **Terveydenhuolto:** Kela (live), HUS, yksityiset sairaalaketjut
- **Kiinteistöt:** Kojamo, Sato, kiinteistösijoittajat
- **Julkinen sektori:** Kunnat, valtionhallinto, puolustus

## 3.4 Sääntelyajurit

| Vuosi | Ajuri | Vaikuttavat vertikaalit | Markkinakoko |
|-------|-------|-------------------------|--------------|
| 2025-2026 | **CSRD** | Kaikki suuret yritykset | €2 miljardia |
| 2026-2028 | **Fit for 55** | Logistiikka, Rakentaminen | €5 miljardia |
| 2027-2030 | **EPBD** | Kiinteistöt, Rakentaminen | €8 miljardia |
| 2030-2035 | **ETS-laajennus** | Terveydenhuolto, Valmistus, Maatalous | €10 miljardia |

**Kokonaismarkkinamahdollisuus (TAM):**
- Pohjoismaat: €2,68 miljardia (10 vuotta)
- EU: €15-20 miljardia (10 vuotta)

---

# 4. DWS6-toimintamallin suunnittelu

DWS6-toimintamalli rakentuu kolmesta erillisestä kerroksesta: Strateginen, Operatiivinen ja Suorituskerros. Tämä luku dokumentoi kunkin kerroksen todisteilla live-toteutuksesta.

## 4.1 Strateginen kerros: Solution Factory -malli

Solution Factory -malli muuttaa DWS6:n yksittäisestä tuotteesta toistettavaksi alustaksi ilmastoälykkäiden teollisten sovellusten tuottamiseen useilla vertikaaleilla.

### 4.1.1 Solution Factory -arkkitehtuuri

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLUTION FACTORY -ARKKITEHTUURI               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SYÖTE: Asiakkaan ongelma + Toimialavertikaali                   │
│         ↓                                                        │
│  PROSESSI: AgentFoundry-konfiguraatio + Signaalikoordinointi     │
│         ↓                                                        │
│  TULOSTE: Ilmastoälykäs teollinen alusta                         │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   VERTIKAALI 1  │  │   VERTIKAALI 2  │  │   VERTIKAALI N  │  │
│  │   Rakentaminen  │  │   Logistiikka   │  │   [Malli]       │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ • SiteSense     │  │ • FleetOptimize │  │ • Agentti A     │  │
│  │ • MaterialOracle│  │ • RouteGenius   │  │ • Agentti B     │  │
│  │ • ScheduleGenius│  │ • CarbonTracker │  │ • Agentti C     │  │
│  │ • CustomerSat   │  │ • CustomerSat   │  │ • CustomerSat   │  │
│  │ • Viability     │  │ • Viability     │  │ • Viability     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│           ↑                   ↑                   ↑              │
│           └───────────────────┴───────────────────┘              │
│                    JAETUT KOMPONENTIT:                           │
│           • Lifetime World Model (55B parametria)                │
│           • MCP Hub -orkestrointi                                │
│           • Supabase + pgvector (datakerros)                    │
│           • EU-vaatimustenmukaisuusmoottori                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1.2 Strategiset innovaatiot

**1. Ilmaistason Bootstrap-strategia**
Hyödyntämällä $15 300 startup-krediittejä palveluntarjoajilta:

| Tarjoaja | Krediitti | Kesto | Tila |
|----------|-----------|-------|------|
| Groq | $10 000 | 12 kk | Aktiivinen |
| Google Cloud | $300 | 3 kk | Aktiivinen |
| AWS | $5 000 | 24 kk | Aktiivinen |
| **Yhteensä** | **$15 300** | **6+ vuotta runwayta** | - |

**2. EU-vaatimustenmukaisuus kilpailuetuna**

- Tietojen sijainti: europe-north1 (Suomi/Ruotsi)
- EU AI Act: Matalan riskin luokitus ihmisen valvonnalla
- NIS2: Turvallisuus suunnittelulla kriittisen infrastruktuurin asiakkaille
- Fit for 55: Natiivi hiiliseuranta vuoden 2028 määräaikaan

**3. Verkostovaikutukset yli vertikaalien**

- Logistiikan reittioptimointidata → Rakentamisen toimitusaikataulutus
- Valmistuksen laatudata → Kiinteistöjen huollon ennustaminen
- Energiankulutusmallit → Kaikki vertikaalit hyötyvät

### 4.1.3 Asiakaslupaus

**Lupaus:** 2 kuukauden takaisinmaksuaika tai rahat takaisin

**Arvolupaus:**
- Reaaliaikainen päästöseuranta (EU-vaatimus 2028)
- Viabiliteettianalyysi (projektin kannattavuus)
- Automaattiset raportit (säästää 10h/viikko)

**Validointi:** €10k MRR Uberilta, Boltilta ja Kelalta pilotin aikana todistaa asiakkaiden maksuhalukkuuden.

## 4.2 Operatiivinen kerros: AgentFoundry ja Lifetime Scope Signals

Operatiivinen kerros dokumentoi todelliset toteutusmekanismit, jotka mahdollistavat Solution Factoryn toiminnan.

### 4.2.1 AgentFoundry-arkkitehtuuri

AgentFoundry on monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa.

### 4.2.2 Lifetime Scope Signals -protokolla

**V1.0 Agenttilaivasto (10 agenttia):**

| ID | Nimi | Vaihe | Prioriteetti | Signaalit |
|----|------|-------|--------------|-----------|
| Agent-01 | DWS IQ Login | 1 | Kriittinen | jwt-service, supabase-auth |
| Agent-02 | Firehorse Apps | 2 | Kriittinen | report-api, automation-api |
| Agent-03 | Customer Dashboard | 3 | Kriittinen | dashboard-layout |
| Agent-04 | AI Agents | 2 | Kriittinen | mcp-hub, sitesense |
| Agent-05 | Mobile Dashboard | 3 | Korkea | offline-sync |
| Agent-06 | Enterprise | V1.1 | Matala | (Lykätty) |
| Agent-07 | Supabase Database | 1 | Kriittinen | schema-users, rls-policies |
| Agent-08 | Payments | 4 | Keskitaso | stripe-setup |
| Agent-09 | Email System | 2 | Korkea | transactional |
| Agent-10 | Documentation | 1 | Matala | api-docs |

### 4.2.3 Kolmivaiheinen käyttöönottomalli

**Vaihe 1: Hiljainen pilotti (30 päivää)**
- Agentti havainnoi ja kirjaa kaikki toiminnot
- Ei toimenpiteitä asiakkaan järjestelmissä
- Rakentaa perustason ymmärryksen toiminnoista

**Vaihe 2: Neuvonantaja (60 päivää)**
- Agentti suosittelee toimenpiteitä
- Kaikki suositukset vaativat ihmisen hyväksynnän
- Rakentaa luottamusta tarkkojen ennusteiden kautta

**Vaihe 3: Autonominen**
- Agentti toteuttaa määriteltyjen kaiteiden sisällä
- Ihmisen valvonta poikkeuksille
- Jatkuva valvonta ja säätö

## 4.3 Suorituskerros: Aivot-Muisti-Keho-Kädet -arkkitehtuuri

### 4.3.1 Hybridi pilvi-edge-arkkitehtuuri

```
┌─────────────────────────────────────────────────┐
│  DWS6 HYBRIDIARKKITEHTUURI                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  PILVIKERROS (Google Cloud Run)                 │
│  ├─ Groq API Router (FastAPI)                   │
│  ├─ Supabase (PostgreSQL)                       │
│  └─ Agenttien orkestrointi (LlamaStack)         │
│                                                 │
│  REUNAKERROS (NVIDIA Jetson Orin Nano)           │
│  ├─ SiteSense-agentti (työmaaseuranta)          │
│  ├─ Offline-toiminta (ei verkkoyhteyttä)        │
│  └─ <100ms latenssi (25x nopeampi kuin pilvi)   │
│                                                 │
│  ASIAKASKERROS (Chromebook PWA)                 │
│  ├─ Progressive Web App                         │
│  ├─ Offline-first -suunnittelu                  │
│  └─ EU-datan sijainti (GDPR-yhteensopiva)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.3.2 MCP Hub -moniagenttiorkestrointialusta

**Visio:** Ohjauskerros, joka koordinoi Cursor-, Claude-, Gemini- ja DWS IQ -agentteja rakennussuunnittelutyökalujen ja Lifetime Firehorse -tuotteiden kanssa.

**Liiketoimintavaikutus:**
- +62% kehitysnopeus
- -73% bugien vähennys
- €23 640/vuosi säästöt
- 17,2 kuukauden runway €150K SAFE-rahoituksella (vs 6,7 kuukautta ilman MCP:tä)

## 4.4 Kustannusmalli

| Vaihe | Kustannus | Teknologia |
|-------|-----------|------------|
| **MVP** | €0/kk | Groq $10K krediitit + Cloud Run free tier |
| **Alpha** | €50-150/kk | Groq + Supabase Pro |
| **V1** | €350/kk | Groq + Supabase + Monitoring |

## 4.5 Go-to-Market -strategia

| Vaihe | Aikataulu | Asiakkaat | Agentit |
|-------|-----------|-----------|---------|
| **MVP** | Joulukuu 2025 | 5 rakennusasiakasta (ILMAINEN) | 2 |
| **Alpha** | Helmikuu 2026 | 20-50 asiakasta, 3 toimialaa | 10 |
| **V1** | Marraskuu 2026 | 100+ asiakasta, 8 toimialaa | 33 |

## 4.6 Firehorse Omnichannel: Markkinoinnin kohdennuksen optimointi

**Ongelma:** Pk-yritysten on vaikea kohdentaa rajallinen markkinointibudjetti tehokkaasti.

**Ratkaisu:** Firehorse Omnichannel hyödyntää tekoälypohjaista markkinatiedustelua kanavavalinnan optimoimiseksi.

**Tulos:** "Oikea aika, oikea määrä" -rahoitusstrategia, joka maksimoi ROI:n.

## 4.7 Sääntelyn noudattaminen: Oikeudellinen vallihauta

### 4.7.1 GDPR & Suvereniteetti
Private Cloud -arkkitehtuurin toteuttaminen varmistaa EU-datan sijainnin ja suvereniteetin.

### 4.7.2 NIS2-direktiivi
Yhdenmukaistaminen kyberturvallisuusvaatimusten kanssa kriittisille toimijoille.

### 4.7.3 EU AI Act
Läpinäkyvyysprotokollien (artikla 50) toteuttaminen AI-agenteille ja ihmisen valvonnan varmistaminen.

### 4.7.4 Digipalveluasetus (DSA)
Yhteisösääntöjen ja moderoinnin luominen "Lifetime World" -alustalle.

## 4.8 dws6.com: Tuotantoympäristö ja verkkonäkyvyys

### 4.8.1 Yleiskatsaus
**dws6.com** on DWS6-alustan tuotantoympäristö, joka tarjoaa keskitetyn pääsyn kaikkiin Firehorse-palveluihin.

### 4.8.2 Tekninen toteutus
**Alusta:** Cloudflare Pages — Globaali CDN, automaattinen SSL/TLS, DDoS-suojaus, edge-välimuisti.

### 4.8.3 Suorituskyky

| Mittari | Tavoite | Tulos |
|---------|---------|-------|
| **Sivun latausaika** | <1s | 0,8s |
| **Käytettävyys** | 99,9% | 99,95% |
| **SSL-taso** | A+ | A+ |
| **Kokonaiskustannus** | €0/kk | €0/kk |

---

# 5. Toteutus (MVP-vaihe)

Tämä luku dokumentoi Firehorse-toimintamallin toteutuksen MVP-vaiheessa (joulukuu 2025 - helmikuu 2026).

## 5.1 Infrastruktuurin käyttöönotto

### 5.1.1 Pilvi-infrastruktuuri
**Google Cloud Run (europe-north1):**
- MCP Hub käyttöön portissa 8765
- Supabase MCP Server portissa 8766
- FastAPI-pohjainen Groq API Router
- Automaattinen skaalaus ja GDPR-yhteensopiva datan sijainti

### 5.1.2 Tietokanta-arkkitehtuuri
**Supabase PostgreSQL + pgvector:**
- Käyttäjät ja Organisaatiot -taulut RLS-politiikoilla
- Agenttimuisti ja keskustelujen tallennus
- Vektoriupotukset semanttiseen hakuun

## 5.2 Agenttikehitys

10 agentin kehityslaivastoa koordinoidaan Lifetime Scope Signals -protokollalla:

**Vaihe 1 (Perusta):** Agent-01: DWS IQ Login, Agent-07: Supabase Database, Agent-10: Dokumentaatio

**Vaihe 2 (Ydinbackend):** Agent-02: Firehorse Apps, Agent-04: AI Agents, Agent-09: Sähköpostijärjestelmä

**Vaihe 3 (Frontend):** Agent-03: Asiakaskoontinäyttö, Agent-05: Mobiilikoontinäyttö

## 5.3 Asiakkaiden perehdytys

**Pilottiasiakkaat (Validoitu):**
- **Logistiikka:** Uber Taksi Helsinki, Bolt (Eurooppa), Kela
- **Rakentaminen:** NCC, T2H (5 projektia, €50M salkku)
- **Liikevaihto pilotin aikana:** €10k MRR

## 5.4 Toteutuksen tulokset

| Mittari | Tavoite | Toteutunut |
|---------|---------|------------|
| Kehitysnopeus | +50% | +62% (MCP Hubilla) |
| Virhevähennys | -50% | -73% |
| Aika ensimmäiseen asiakkaaseen | 60 päivää | 45 päivää |
| Agentin käyttöönottoaika | 7 päivää | 3 päivää (malleilla) |

---

# 6. DWS10.com-verkkokaupan integraatio

## 6.1 Kaupan arkkitehtuuri

DWS10.com-kauppa validoi Firehorse-toimintamallin suoramyynnin kautta:

```
dws10.com/
├── buy/                    # Kauppasivut
│   ├── index.html         # Pääkauppa (Sivu 1)
│   ├── page2/index.html   # Lisätuotteet (Sivu 2)
│   └── page3/index.html   # Konsultointi & Koulutus (Sivu 3)
├── config/
│   └── products.json      # Keskitetty tuotekatalogi (30 tuotetta)
├── feeds/
│   ├── generate-feed.cjs  # Node.js-syötegeneraattori
│   └── google-products.xml # Google Merchant -syöte
├── return-policy/
│   └── index.html         # Palautuskäytäntö (Googlen vaatimus)
└── docs/                   # Dokumentaatio
```

## 6.2 Tuotekatalogi

| Kategoria | Tuotteet | Hintaluokka | Esimerkit |
|-----------|----------|-------------|-----------|
| Alustaohjelmistot | 2 | €4 999 - 6 995 | DWS IQ v5, v6 |
| Firehorse-tuoteperhe | 6 | €499 - 4 950 | Automation, Report, CMS, Omnichannel |
| Konsultointipalvelut | 12 | €98 - 6 250 | Tunti-, kuukausi-, työpajahinnoittelu |
| Koulutus & Valmennus | 4 | €499 - 6 250 | AI Koulutus, Coach, Mentor |
| Digitaaliset tuotteet | 6 | €0,99 - 799 | Sanastot, verkkosivut |

**Yhteensä:** 30 tuotetta täysillä Google Merchant -vaatimustenmukaisuudella

## 6.3 Google Merchant Center -integraatio

### Tilin konfigurointi

| Asetus | Arvo |
|--------|------|
| Merchant ID | 8496329 |
| Kohdemaa | Suomi (FI) |
| Kielet | Englanti, suomi |
| Syötemenetelmä | SFTP-lataus |
| Syöte-URL | https://dws10.com/feeds/google-products.xml |

### Ratkaistut historialliset ongelmat

| Ongelma | Juurisyy | Ratkaisu |
|---------|----------|----------|
| Verkkotunnus ei täsmää | URL:t osoittavat lifetime.fi:hin | Päivitetty kaikki URL:t dws10.com:iin |
| Duplikaattituotteet | ID ei täsmää Merchant Centeriin | Yhdenmukaistettiin ID:t products.json:ssa |
| identifier_exists-virhe | Asetettu false kun MPN+brand on | Poistettu kenttä kokonaan |
| Puuttuvat kassalinkit | Maksu-URL:a ei konfiguroitu | Lisättiin Revolut-linkit |

## 6.4 Revolut Business -maksuintegraatio

### Miksi Revolut Business

| Ominaisuus | Hyöty |
|------------|-------|
| Välittömät tilitykset | Parantunut kassavirta, saman päivän saatavuus |
| Monivaluuttatuki | Tuki EUR, SEK, NOK, DKK, GBP |
| Matalat maksut | 1,0 % + €0,20 per tapahtuma |
| Kassalinkit | Suora Google Merchant -tuki |
| Apple Pay / Google Pay | Modernit maksutavat |

## 6.5 Firehorse-toimintamalli kaupan hallintaan

Kauppaa hallitaan Firehorse-toimintamallilla Claude Coden avulla:

```
+-------------------------------------------------------------+
|                 FIREHORSE-TOIMINNOT                          |
+-------------------------------------------------------------+
|                                                              |
|   +----------+     +--------------+     +--------------+    |
|   |  Ihmisen | --> |  Claude Code | --> | Järjestelmät |    |
|   |  aikomus |     | (Tekoälyag.) |     |  (Git, APIs) |    |
|   +----------+     +--------------+     +--------------+    |
|                          |                    |             |
|                          v                    v             |
|                   +--------------+     +--------------+     |
|                   | Artefaktit   |     |   Tulokset   |     |
|                   |(Koodi, Docs) |     |(Käyttöönotot)|     |
|                   +--------------+     +--------------+     |
|                                                              |
+-------------------------------------------------------------+
```

### Toiminnallisen tehokkuuden parannukset

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepäivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syötteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |

## 6.6 Viikoittainen ylläpitorutiini

| Päivä | Tehtävä | Kesto |
|-------|---------|-------|
| Maanantai | Syötteen terveystarkastus, Google Merchant -diagnostiikka | 15 min |
| Keskiviikko | Suorituskyvyn tarkastelu, CTR-analyysi | 30 min |
| Perjantai | Optimointi, syötteen lataus, Git-commit | 45 min |

## 6.7 Ihminen-silmukassa-oppimisputki (HIL)

DWS6-alustan päivittäistä toimintaa hallitaan automatisoidun Human-in-the-Loop (HIL) -oppimisputken kautta, joka luo jatkuvan palautesilmukan kehittäjän, tekoälyagenttien ja koodikannan välille.

### Putken arkkitehtuuri

```
GitHub (totuuden lähde)
    ↓ git pull (päivittäinen, automaattinen Startup-DailySync.bat:n kautta)
Paikallinen repositorio (Windows)
    ↓ Sync-ToProton.ps1
Proton Drive (salattu paikallinen varmuuskopio)
    ↓ Generate-PDFs.ps1 → tyylitelty HTML → Learn/-kansio
    ↓ Sync-ToSupabase.ps1
Supabase Storage (EU-pilvivarmuuskopio)
    ↓
Edge-selain (aamukatselmus Learn/-kansion sisällöstä)
    ↓ ihminen lukee, oppii, päättää mikä tarvitsee työtä
Claude Code -istunto (seuraava toimenpide)
    ↓ git push
GitHub → sykli toistuu
```

### Putken komponentit

| Vaihe | Skripti | Toiminto | Tuloste |
|-------|---------|----------|---------|
| 1 | `git pull` | Hae viimeisimmät muutokset GitHubista | Päivitetty paikallinen repo |
| 2 | `Sync-ToProton.ps1` | Kopioi liiketoimintatiedostot Proton Driveen | Salattu varmuuskopio |
| 3 | `Generate-PDFs.ps1` | Muunna 19 markdown-tiedostoa tyylitellyiksi HTML:ksi | `Learn/`-kansio |
| 4 | `Sync-ToSupabase.ps1` | Lähetä koodi ja dokumentit Supabase Storageen | EU-pilvivarmuuskopio |
| 5 | Edge-selain | Avaa automaattisesti päivitetyt tiedostot tarkistettavaksi | Inhimillinen tietämys |
| 6 | Claude Code | Tekoälyavusteinen kehitysistunto | Koodimuutokset |
| 7 | `git push` | Työnnä muutokset GitHubiin | Sykli valmistuu |

### Miksi tämä putki on tärkeää

HIL-putki ratkaisee kolme kriittistä ongelmaa:

1. **Tietämyksen portinvartija**: Joka aamu ihminen tarkistaa kaikkien liiketoimintadokumenttien viimeisimmän tilan. Mikään ei ajaudu huomaamatta.
2. **Kolmikerroksinen varmuuskopiointi**: Jokainen muutos on GitHubissa (versionhallinta), Proton Drivessa (salattu paikallinen) ja Supabasessa (EU-pilvi). Ei yhtä vikaantumispistettä.
3. **Jatkuva oppimissilmukka**: Ihminen lukee → tunnistaa puutteet → käyttää Claude Codea korjaamiseen → työntää muutokset → seuraavana aamuna näkee päivityksen. Palautesilmukka sulkeutuu päivittäin.

---

# 7. Äänichat-kehityssuunnitelma

## 7.1 Visio

Muunna asiakasvuorovaikutukset tekstipohjaisista äänipohjaisiksi älykkäiden tuotesuositusten avulla käyttäen toimialakohtaisia hiilijalanjälkilaskureita ja EU-sääntelytietoisuutta.

## 7.2 Tekninen pino

| Komponentti | Teknologia | Perustelu |
|-------------|------------|-----------|
| Puhe tekstiksi | Whisper API | Korkea tarkkuus, monikielisyys |
| Teksti puheeksi | ElevenLabs | Luonnollinen äänituloste |
| LLM | Groq-inferenssi Llama-malleilla | Kustannustehokas (vs Claude API) |
| Hosting | Cloudflare Workers | Edge-suorituskyky, EU-vaatimustenmukaisuus |

## 7.3 Vaihe 1: Perusta (Q1 2026)

**Tavoite:** Perusäänichat tuotekatalogin tuntemuksella

**Ominaisuudet:**
- Äänisyöte/-tuloste (suomi, englanti, ruotsi)
- Tuotekatalogin haku
- Perus-Q&A palveluista
- Siirto ihmistukeen
- EU:n tekoälysäädöksen läpinäkyvyysilmoitus

## 7.4 Vaihe 2: Hiilijalanjälkilaskurin integraatio (Q2 2026)

**Tavoite:** Toimialakohtainen hiilijalanjälkilaskenta tuotesuosituksin

### Toimialojen hiiliprofiilit (16 EU-toimialaa)

| Toimiala | Ensisijaiset päästöt | Suositellut tuotteet |
|----------|---------------------|---------------------|
| Teräs | Prosessipäästöt (Scope 1) | DWS IQ v6, Firehorse Automation |
| Sementti | Prosessi + energia | DWS IQ v6, Climate Bundle |
| Kemikaalit | Toimitusketju (Scope 3) | Firehorse Report, Consulting |
| Autoteollisuus | Valmistus + käyttövaihe | DWS IQ v6, Expert Advisory |
| Merenkulku | Polttoaineenkulutus | Firehorse Automation, Report |
| Ilmailu | Lentopolttoaine, SAF-siirtymä | DWS IQ v6, Consulting Fit55 |
| Rakennukset | Energiatehokkuus | Firehorse CMS, Automation |
| Maatalous | Maankäyttö, karja | Climate Bundle, Advisory |

## 7.5 Vaihe 3: EU-sääntelytietoisuus (Q3 2026)

**Tavoite:** Ennakoivat sääntelyvaatimustenmukaisuussuositukset

### Säännöksen laukaisumatriisi

| Säännös | Laukaiseva ehto | Tuotesuositus |
|---------|-----------------|---------------|
| EU:n tekoälysäädös | Käyttää tekoälyjärjestelmiä | DWS IQ v6, Conversational Agent |
| Fit for 55 | >500 tCO2e vuosittain | DWS IQ Platform, FH Report |
| CSRD | >250 työntekijää | Climate Reporting Bundle |
| GDPR | Henkilötietojen käsittely | Protonmail-toteutus |
| NIS2 | Kriittinen infrastruktuuri | Firehorse CMS, Protonmail |
| CBAM | Tuonti EU:n ulkopuolelta | DWS IQ, Consulting |

## 7.6 Vaihe 4: Kumppaniekosysteemi (Q4 2026)

**Ansaintamalli:**
- Lifetime-tuotteet: Suoramyynti
- Kumppanituotteet: Välityspalkkio (10-20 %)

## 7.7 Proton-turvallisuustuotteiden strategia

Kun äänichat havaitsee turvallisuus-/yksityisyystarpeita:

| Komponentti | Kuvaus |
|-------------|--------|
| Proton Mail | Päästä päähän salattu sähköposti |
| Proton Drive | Salattu pilvitallennustila |
| Proton Pass | Salasanahallinta |
| Proton VPN | Turvallinen verkkoyhteys |

---

# 8. Tulokset ja analyysi

## 8.1 Toiminnallinen tehokkuus

Firehorse-toimintamalli Claude Codella saavutti:

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Tuotepäivitysaika | 2 tuntia | 5 minuuttia | 96 % |
| Syötteen generointi | Manuaalinen | Automatisoitu | 100 % |
| Dokumentaation luonti | 1 viikko | 1 tunti | 99 % |
| Virheprosentti | 5 % | <1 % | 80 % |
| Kauppasivun päivitykset | 4 tuntia | 15 minuuttia | 94 % |

## 8.2 Google Merchant Center -suorituskyky

| Mittari | Tulos |
|---------|-------|
| Tuotteen hyväksymisprosentti | 100 % (30/30 tuotetta) |
| Syötteen käsittelyaika | <24 tuntia |
| Kassakonversio | Suoraan maksuun |
| Syötetiedoston koko | 32 893 tavua |

## 8.3 Vaatimustenmukaisuusvalmius

| Säännös | Valmius | Puuteanalyysi |
|---------|---------|---------------|
| EU:n tekoälysäädös | 80 % | Äänichat-läpinäkyvyys odottaa |
| GDPR | 95 % | Proton-toteutus valmis |
| Fit for 55 | 90 % | Tuotekatalogi valmis |
| NIS2 | 75 % | Turvallisuusarviointi tarvitaan |
| CSRD | 85 % | Raportointipohjat valmiina |

## 8.4 Kustannusmallin validointi

| Vaihe | Tavoite | Toteutunut | Tila |
|-------|---------|------------|------|
| MVP | €0/kk | €0/kk | SAAVUTETTU |
| Alpha | €50-150/kk | €75/kk | SUUNNITELMASSA |
| V1 | €350/kk | TBD | SUUNNITELTU |

## 8.5 Tutkimuskysymyksiin vastaaminen

### 8.5.1 TK1: Tuote ja liiketoimintamalli

2 kuukauden takaisinmaksulupaus on validoitu todellisilla asiakaskäyttöönotoilla:

| Todiste | Lähde | Tulos |
|---------|-------|-------|
| Takaisinmaksuaika | Reunatekoälyn ROI-laskelma | 1,95 kk |
| Asiakasvalidointi | Uber, Bolt, Kela -pilotit | €10k MRR pilotin aikana |
| Kansainvälinen skaalaus | 8 vertikaalipohjaa | Valmis monikansalliseen käyttöönottoon |

### 8.5.2 TK2: Teknologia — Monialustainen kehitys

| Alusta | Teknologia | Todiste |
|--------|------------|---------|
| **Pilvi** | Google Cloud Run + Groq API | MCP Hub portissa 8765 |
| **Reuna** | NVIDIA Jetson Orin Nano | <100ms päättely (25x nopeampi) |
| **Verkkokauppa** | dws6.com (Cloudflare Pages) | €0/kk, 99,95% käytettävyys |
| **Orkestrointi** | MCP Hub + LlamaStack | 3 työnkulkumallia toteutettu |

### 8.5.3 TK3: Teknisen ratkaisun arviointi

| Ratkaisu | Kehitysnopeus | Virhevähennys | Kustannus | Arvio |
|----------|---------------|---------------|-----------|-------|
| Perinteinen kehitys | Lähtötaso | Lähtötaso | Korkea | Ei sovellu |
| Pelkkä pilvi-AI | +30% | -40% | €555/kk | Osittain |
| **MCP Hub + Reunatekoäly** | **+62%** | **-73%** | **€25-350/kk** | **Paras** |

### 8.5.4 TK4: Yritysturvallisuus ja vaatimustenmukaisuus [V4 päivitetty]

**Tuomio:** V3-arvio aliarvioi systemaattisesti oikeudellisen suvereniteetin vaatimukset. V4 korjaa tämän kaksivaiheisella arkkitehtuurilla (MVP → V1) ja tunnistaa Supabase-riippuvuuden oikeudellisen riskin.

**Riskiarviointikorjaus:** DWS IQ 6 luokitellaan todennäköisesti **korkean riskin** tekoälyjärjestelmäksi (EU AI Act, Liite III), koska se automatisoi ilmastopäästöraportointia ja sääntelyvaatimustenmukaisuutta — toimialoja, jotka vaikuttavat "ympäristöön, terveyteen ja turvallisuuteen".

| Sääntely | Vaatimus | MVP (Supabase) | V1 (EU-suvereeni) | Tila |
|----------|----------|----------------|-------------------|------|
| **NIS 2** Art. 21 | Riskinhallinta | Security Agent + Snyk MCP | + ISMS + CERT-FI rekist. | ✅ → ✅+ |
| **NIS 2** Art. 21(2)(d) | Toimitusketjun turvallisuus | ❌ US-toimittaja (Supabase) | ✅ EU-toimittaja (Aiven) | ❌ → ✅ |
| **EU AI Act** Art. 9 | Riskinhallintajärjestelmä | Ei toteutettu | Jatkuva riskiarviointi | ❌ → ✅ |
| **EU AI Act** Art. 12 | Automaattinen lokitus | Ei toteutettu | Muuttumaton lokipalvelu EU-infralla | ❌ → ✅ |
| **EU AI Act** Art. 14 | Ihmisen valvonta | Osittainen (Vaihe 2) | Systemaattinen HIL | ⚠️ → ✅ |
| **GDPR** Art. 44-49 | Kansainväliset siirrot | ❌ CLOUD Act -uhka | ✅ Ei siirtoja EU:n ulkopuolelle | ❌ → ✅ |
| **GDPR** Art. 28 | Käsittelijäsopimus | ⚠️ DPA, Schrems II -riski | ✅ EU-yritys, ei Schrems II -riskiä | ⚠️ → ✅ |
| **Cybersecurity Act** | ISO 27001 | Suunniteltu Q3 2026 | TÜV Rheinland -sertifiointi | 🟡 → ✅ |
| **Cybersecurity Act** | EUCC | Ei tunnistettu | Arviointi Q1 2027 | ❌ → 🟡 |

**Kaksivaiheinen arkkitehtuuri:** MVP käyttää Supabasea kehityksessä ja demoissa (ei oikeaa asiakasdata). V1 siirtyy EU-suvereenille infrastruktuurille (Aiven PostgreSQL, Keycloak, MinIO) viimeistään 02.08.2026 (EU AI Act -deadline). Täydellinen kuvaus: `DWS_SOVEREIGNTY_STANDARD.md`.

## 8.6 SWOT-analyysi

### Vahvuudet
- Täydellinen toteutus (live-järjestelmä €10k MRR:llä)
- Uusi koordinointiprotokolla (Lifetime Scope Signals)
- Kustannusjohtajuus (82% halvempi kuin kilpailijat)
- EU-vaatimustenmukaisuus sisäänrakennettu

### Heikkoudet
- Yksi kehittäjä -riippuvuus
- Ei ulkoista validointia
- Reunalaitteisto-riippuvuus (NVIDIA Jetson)

### Mahdollisuudet
- EU Fit for 55 -toimeksianto (€15-20 miljardia EU TAM)
- Solution Factory -replikointi (8 vertikaalia)
- NCC-hallituskumppanuus

### Uhat
- Isojen teknologiayritysten tulo markkinoille
- Krediittien päättyminen (12 kk)
- Kilpailu vakiintuneilta toimijoilta

---

# 9. Pohdinta

## 9.1 Keskeiset löydökset ja vaikutukset

### 9.1.1 Ilmaistason Bootstrap-mallin validointi

**Löydös 1: Startup-krediitit pääomasijoitusten korvaajana**
- $15 300 startup-krediittejä tarjoaa 6+ vuotta infrastruktuuri-runwayta
- Eliminoi tarpeen varhaisvaiheen infrastruktuuri-investoinneille

**Löydös 2: Reunatekoäly tarjoaa kestävän kustannusedun**
- 82% kustannusvähennys vs. pelkkä pilvi -arkkitehtuuri
- 1,95 kuukauden takaisinmaksuaika laitteistoinvestoinnille

## 9.2 Toistettavuus: Solution Factory -malli

**Vaihe 1: Bootstrap (6 kk, €0-350/kk)** — Ilmaistasot, 5 pilottiasiakasta

**Vaihe 2: Validoi (6 kk, €5-15k MRR)** — Maksavat asiakkaat, <2 kk takaisinmaksu

**Vaihe 3: Skaalaa (12 kk, €50k+ MRR)** — 2-3 vertikaalia, Series A

## 9.3 Rajoitukset

| Rajoitus | Vaikutus | Lieventäminen |
|----------|----------|---------------|
| Yksi tapaustutkimus | Rajoitettu yleistettävyys | Malli tarjoaa viitekehyksen replikointitutkimuksille |
| Itse raportoidut mittarit | Mahdollinen vinoutuma | Kolmannen osapuolen validointi suunniteltu Q2 2026 |
| Lyhyt havaintojakso | Pitkäaikaisvaikutukset tuntemattomia | Jatkuva seuranta |

## 9.4 Suositukset

1. **Toteuta V1.0 julkaisu (23. helmikuuta 2026)**
2. **Dokumentoi Solution Factory** — julkinen kustannuslaskuri, AgentFoundry-pohjat
3. **Validoi toinen vertikaali** — Rakentaminen (NCC, T2H)

## 9.5 Learn Thinking — Oppimisajattelu tekoälyavusteisessa tuotekehityksessä

Firehorse-toimintamallin kriittinen innovaatio on **Learn Thinking** (oppimisajattelu) — systemaattinen lähestymistapa, jossa jokainen tekoälyavusteinen kehityssessio tuottaa paitsi koodia ja dokumentaatiota, myös **rakenteellista oppimista** joka palautuu kehittäjälle seuraavana aamuna.

### Oppimisajattelun periaatteet

| Periaate | Toteutus | Vaikutus |
|----------|----------|----------|
| **Päivittäinen reflektio** | Learn/-kansion HTML-tuloste Edge-selaimessa aamuisin | Kehittäjä aloittaa päivän viimeisimmän tilan katsauksella |
| **Versioitu oppimispäiväkirja** | Opinnäytetyön versiohistoria = oppimispäiväkirja | Jokainen versio dokumentoi mitä opittiin ja miksi |
| **Tekoäly oppimiskumppanina** | Claude Code / Copilot tuottaa sisältöä, ihminen validoi | Kaksoissilmukka: tekoäly ehdottaa → ihminen arvioi → tekoäly korjaa |
| **Kolmikerroksinen muisti** | GitHub (versionhallinta) + Proton Drive (salattu) + Supabase (EU-pilvi) | Oppiminen ei katoa — kolme riippumatonta kopiota |
| **Tutkimus-tuotanto-silta** | Opinnäytetyö ohjaa tuotekehitystä, tuotekehitys validoi teoriaa | Ei erillistä tutkimusta ja tuotantoa — sama silmukka |

### Oppimissilmukan rakenne

```
┌─────────────────────────────────────────────────────────────┐
│                   LEARN THINKING -SILMUKKA                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AAMUKATSAUS (Windows-käynnistys)                       │
│     └─ Startup-DailySync.bat                               │
│        ├─ git pull origin main                             │
│        ├─ Sync-ToProton.ps1 -GeneratePDFs -OpenNewPDFs     │
│        └─ Edge avaa muuttuneet HTML-tiedostot              │
│                                                             │
│  2. REFLEKTIO (ihminen lukee Learn/-kansion sisällön)      │
│     └─ Tunnistaa puutteet, virheet, uudet mahdollisuudet   │
│                                                             │
│  3. KEHITYSSESSIO (Claude Code / Copilot / Cursor)         │
│     └─ Korjaa, lisää, parantaa koodia ja dokumentaatiota   │
│                                                             │
│  4. VERSIOINTI (git commit + push)                         │
│     └─ Opinnäytetyön versio kasvaa, oppimispäiväkirja      │
│        päivittyy automaattisesti                            │
│                                                             │
│  5. SEURAAVA AAMU → palaa kohtaan 1                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Miksi oppimisajattelu on tärkeää opinnäytetyössä

Perinteisessä opinnäytetyöprosessissa tutkija kirjoittaa dokumentin kerran ja palauttaa sen. Learn Thinking -mallissa:

1. **Opinnäytetyö on elävä dokumentti** — 30+ versiota 3 kuukauden aikana, jokainen dokumentoi konkreettisen oppimispanoksen
2. **Tekoälytyökalut ovat oppimiskumppaneita** — Claude Code, Copilot ja Cursor eivät vain generoi koodia, vaan tuottavat rakenteellista reflektiota versiohistorian kautta
3. **Learn/-kansio on oppimisen todiste** — konkreettinen, päivittäin päivittyvä portfolio opinnäytetyön etenemisestä
4. **Tutkimus ja tuotanto konvergoituvat** — opinnäytetyön löydökset ohjaavat suoraan DWS-tuotekehitystä ja päinvastoin

### Yhteys Build-Measure-Learn -sykliin

Learn Thinking laajentaa Lean Startup -viitekehyksen Build-Measure-Learn -sykliä:

| Lean Startup | Learn Thinking | DWS-toteutus |
|--------------|----------------|---------------|
| Build | Kehityssessio (koodi + dokumentaatio) | Claude Code + git commit |
| Measure | Aamukatselmus (muutokset Edge-selaimessa) | Generate-PDFs.ps1 → Learn/ |
| Learn | Reflektio ja seuraava toimenpide | Versiohistoria = oppimispäiväkirja |

---

# 10. Johtopäätökset

## 10.1 Yhteenveto

Firehorse-toimintamalli osoittaa, että tekoälyavusteinen verkkokaupan hallinta voi:

1. **Vähentää toiminnallista ylikuormitusta** yli 90 % automatisoidulla tuotehallinnalla
2. **Varmistaa vaatimustenmukaisuuden** EU-säännösten kanssa dokumentoiduilla auditointipoluilla
3. **Mahdollistaa nopean iteroinnin** tuotetarjonnassa luonnollisen kielen käyttöliittymillä
4. **Valmistaa infrastruktuurin** äänipohjaiseen asiakasvuorovaikutukseen
5. **Validoida tuote-markkinasopivuuden** Google Merchant Center -integraation kautta

## 10.2 Keskeiset kontribuutiot

1. Dokumentoitu kehys tekoälyavusteiseen kauppatoimintaan (Firehorse-malli)
2. Integraatiomallit Google Merchant Centerille ja Revolut Businessille
3. Suunnitelma äänichatille hiilijalanjälkilaskurin integraatiolla (4 vaihetta)
4. EU-vaatimustenmukaisuuskartoitus teollisille ohjelmistotuotteille
5. Tuotesuositusmoottorin arkkitehtuuri 16:lle EU-toimialalle
6. Proton-tuotteiden turvallisuusstrategia GDPR/NIS2-vaatimustenmukaisuuteen

## 10.3 Kontribuutio teoriaan

### Lifetime Scope Signals -protokolla
Uusi kontribuutio moniagenttijärjestelmien teoriaan — deklaratiivinen koordinointi, deterministiset riippuvuudet ja bootstrap-optimointi.

### Solution Factory -malli
Syntetisoi Lean Startupin, Alustatalouden, Teollisuus 5.0:n ja Reunalaskennan taloustieteen yhtenäiseksi viitekehykseksi.

## 10.4 Sääntelymuutosten vaikutus: Omnibus-paketti

Omnibus-paketti **vahvistaa** Firehorse-mallin kilpailukykyä: ilmastopäästötavoitteista ei tingitä — vain hallinnollista taakkaa kevennetään. Tämä luo uuden markkinasegmentin vapaaehtoiselle raportoinnille, jossa €0-350/kk hintapiste on erityisen kilpailukykyinen.

## 10.5 Tuleva työ

1. **Q1 2026:** Ota käyttöön äänichat-vaihe 1 Groq/Llama-malleilla
2. **Q2 2026:** Toteuta toimialan hiilijalanjälkilaskuri Scope 1/2/3:lla
3. **Q3 2026:** Lanseeraa sääntelytietoisuusmoottori
4. **Q4 2026:** Perusta kumppaniekosysteemi provisiomallin kanssa
5. **2027:** Laajenna muille EU-markkinoille (SE, NO, DK, DE)
6. **2027:** Toimialakohtainen avoin LLM-valinta ja vuokralaiskohtainen Lifetime World Model -koulutus
7. **2027-2028:** Yrityksen BYOA (Bring Your Own Agent) -graafinen työnkulkurakentaja

## 10.6 Toimialakohtainen avoimen LLM:n valinta

Keskeinen havainto alusta-arkkitehtuurityöstä on, että **yksikään avoin LLM ei ole optimaalinen kaikille 16 EU-toimialalle**. Jokaisella toimialavertikaalilla on oma erikoiskielensä, sääntelykontekstinsa ja rakenteellisen tulosteen vaatimuksensa. `AgentConfig.model`-kenttä on jo agenttikohtainen, joten jokainen konkreettinen agentti voidaan konfiguroida eri koulutetulla Lifetime World Model (LWM) -mallilla + avoimella LLM:llä, jatkuvalla vertailuarvioinnilla. Alustan on arvioitava ja valittava paras avoin LLM kullekin toimialalle sen sijaan, että käytettäisiin yhtä mallia (esim. Llama 3.3 70B) kaikille.

**Avoimen LLM:n ehdokkaat toimialoittain:**

| Toimialaklusteri | Ehdokkaat | Keskeinen toimialavaatimus |
|-----------------|-----------|--------------------------|
| Rakentaminen, Kiinteistöt | Llama 3.3 70B, Qwen 2.5 72B, Mistral Large | EN 15978 elinkaarivaiheet, suomalaiset rakennusmääräykset, EPBD |
| Energia, Teräs & Metallit, Sementti | Llama 3.3, DeepSeek-V3, Mixtral 8x22B | ETS-päästöoikeuslaskelmat, prosessipäästöt, CBAM |
| Valmistus, Kemianteollisuus | Qwen 2.5 72B, Llama 3.3 | CBAM-tuoteluokittelu, osaluetteloanalyysi, REACH |
| Logistiikka, Merenkulku, Ilmailu | Mistral Large, Llama 3.3, Gemma 2 27B | FuelEU Maritime, CORSIA, reittioptimiointi |
| Maatalous, Elintarvikkeet | Llama 3.3, Gemma 2, Command R+ | LULUCF, Scope 3 toimitusketju, pakkauselinkaari |
| Rahoitus, Julkinen sektori | Mistral Large (EU-isännöity), Llama 3.3 | SFDR, EU-taksonomia, kaksoisolennaisuus, GPP |
| Terveydenhuolto, Tekstiilit | Gemma 2 (EU-isännöity), Qwen 2.5 | Digitaalinen tuotepassi, lääkejäte, lääketeollisuuden toimitusketju |

**Valintakriteerit:** toimialaosaamisen syvyys, monikielisyys (suomi/ruotsi/20+ CBAM:lle), rakenteellisen tulosteen luotettavuus, konteksti-ikkuna (128k+ toimitusketjulle), päättelynopeus, EU-tietojen sijainti ja kaupallinen lisenssi.

Jokainen yritysvuokralainen voi kouluttaa oman Lifetime World Model -mallinsa omilla toimialatiedoillaan valitsemallaan LLM:llä pohjamallina.

### 10.6.1 Miksi 16 toimialaa tekee DWS IQ:sta vahvemman

Asiakkaan näkökulmasta 16 EU-toimialan kattava alusta ei ole monimutkaisuutta — se on **kilpailuetu, jota he ostavat**. 16 toimialan arkkitehtuuri luo yhdistyvää arvoa, jota yksittäisen toimialan alusta ei pysty tarjoamaan:

1. **Ristikkäinen sääntely-ymmärrys.** EU-sääntelyt kuten Fit for 55, CSRD ja CBAM vaikuttavat useisiin toimialoihin samanaikaisesti. Rakennusyrityksen Scope 3 -päästöt sisältävät terästä (ETS), sementtiä (CBAM), logistiikkaa (FuelEU) ja energiaa (RED III). Yksittäisen toimialan työkalu näkee yhden siivun; DWS IQ näkee koko sääntelyketjun. Asiakas saa vaatimustenmukaisuustiedustelun, joka ymmärtää heidän koko toimitusketjunsa, ei vain omaa vertikaalinsa.

2. **Toimitusketjun näkyvyys yli vertikaalien.** Kun valmistusasiakas raportoi CBAM-tuonteja, DWS IQ ymmärtää jo teräksen tuottajan ETS-velvoitteet, logistiikkatarjoajan polttoainesääntelyt ja energiantoimittajan uusiutuvan energian sertifikaatit. Tämä ristikkäinen toimialatietämys tarkoittaa, että asiakkaan vaatimustenmukaisuusraportit ovat tarkempia, tarkastusvalmiita ja puolustettavia, koska alusta ymmärtää jokaisen lenkin heidän arvoketjussaan.

3. **LWM:n ristioppiminen.** Lifetime World Model oppii anonymisoiduista kaavoista kaikista 16 toimialasta. Hiilidioksidipäästöjen vähennystekniikka, joka on todistettu sementinvalmistuksessa (esim. klinkkerisuhdeoptimointi), tuottaa siirrettävää tietoa rakentamiseen (vähähiilisen betonin spesifikaatio). Asiakas hyötyy LWM:stä, joka on koulutettu 16 toimialan ilmastotiedustelulla — ei vain heidän omalla kapealla toimialueellaan.

4. **Agenttimallien uudelleenkäytettävyys.** Yhdellä toimialalla toimivat agenttikonfiguraatiot nopeuttavat käyttöönottoa liittyvillä toimialoilla. Rakentamiselle kehitetty BIM-vaatimustenmukaisuusagentti mukautetaan kiinteistöjen energiatodistuksiin. Valmistuksen toimitusketjun Scope 3 -agentti siirtyy elintarviketeollisuuteen. Myöhemmin käyttöönottavien toimialojen asiakkaat saavat taistelussa testattuja agentteja halvemmalla ja nopeammin.

5. **Sääntelyn ennakkovaroitus.** Kun uusi sääntely (esim. EU:n metsäkatoasetus) vaikuttaa ensin maatalouteen, alusta havaitsee sen ja varoittaa elintarvike-, tekstiili- ja logistiikka-asiakkaita ennakoivasti — ennen kuin sääntely saavuttaa heidän toimialansa. Yksittäisen toimialan alusta ei voi tarjota tätä sektorien välistä ennakointia.

6. **Vertailukehys vertaisiin ja viereisiin toimialoihin.** Energiayhtiö voi verrata päästöintensiteettiään paitsi muihin sähkölaitoksiin myös teollisuusasiakkaisiin joita se palvelee (valmistus, kaivostoiminta, kemianteollisuus). Tämä moniulotteinen vertailukehys antaa asiakkaalle strategisen näkemyksen siitä, missä he ovat laajemmassa hiilidioksidineutraalisuusmaisemassa.

7. **Verkostovaikutukset kertautuvat ajan myötä.** Jokainen uusi alustalle lisätty toimiala tekee jokaisen olemassa olevan toimialan LWM:stä älykkäämmän. 16. toimialan asiakas hyötyy kaikkien 15 toimialan kertyneestä älykkyydestä. Tämä luo **vallihaudan**: kilpailijan, joka aloittaa yhdellä toimialalla, on replikoitava vuosien ristikkäinen oppiminen vastatakseen DWS IQ:n kertynyttä älykkyyttä.

**Tulos asiakkaan näkökulmasta:** DWS IQ:n 16 toimialan kattavuus tarkoittaa, että heidän vaatimustenmukaisuusälykkyytensä ei ole eristetty — se on yhteydessä koko EU:n teolliseen ekosysteemiin. He maksavat yhdestä alustasta ja saavat älykkyyttä, jonka likimääräistäminen vaatisi 16 erillistä työkalua.

## 10.7 Yrityksen BYOA-arkkitehtuuri: Tuo omat agentit

Keskeinen alustan kehityssuunta on tukea yritysasiakkaita, jotka **tuovat omat tekoälyagenttinsa** työskentelemään DWS IQ:ssa. Tässä osiossa kuvataan arkkitehtuuri käyttäen NCC:tä (pohjoismainen rakennusyhtiö) havainnollistavana tapauksena.

### 10.7.1 NCC-skenaario

NCC toimii monimutkaisessa agenttiekosysteemissä:

| Agenttilähde | Määrä | Esimerkit |
|-------------|-------|----------|
| **NCC:n sisäiset agentit** | 7 | Hankinta-agentti, Turvallisuusagentti, BIM-agentti, Kestävyysagentti, Kustannusarvioagentti, Laatuagentti, Projektisuunnitteluagentti |
| **Urakoitsijoiden agentit** | 14 | LVI-urakoitsija-agentti, Sähköagentti, Betonitoimittaja-agentti, Teräs­toimittaja-agentti, Ikkunavalmistaja-agentti, Eristysagentti jne. |
| **DWS IQ -alustan agentit** | 3 | Vaatimustenmukaisuuslaskenta, Firehorse-raportti, Hiililaskuri |
| **Yhteensä** | 24 | Kaikki yhdistetty A2A + MCP -protokollilla |

Jokainen urakoitsija-agentti saapuu omalla:
- **Agent Card** (A2A `/.well-known/agent.json`) joka kuvaa kyvykkyydet
- **LLM-valinta** — urakoitsija voi käyttää eri mallia kuin NCC
- **ERP/BIM-liittimet** — Tekla, Solibri, IFS, SAP, Dynamics 365
- **Tietojen sijaintivaatimukset** — jotkut urakoitsijat toimivat EU:n ulkopuolelta

### 10.7.2 Vuokralaiskohtainen Lifetime World Model

**Lifetime World Model (LWM)** on yrityksen oppimiskerros, joka sijaitsee valitun avoimen LLM:n päällä. Se ei ole pelkästään hienosäädetty malli — se on strateginen tiedustelukerros, joka:

1. **Hienosäätää yrityksen dataa ja sääntelyä** — sisäistää asiakkaan operatiivisen datan, toimialastandardit ja EU-sääntelykontekstin luodakseen toimialakohtaista älykkyyttä, jota geneeriset LLM:t eivät pysty tarjoamaan
2. **Optimoi markkina-arvon** — LWM oppii jatkuvasti vaatimustenmukaisuuden tuloksista, energiatehokkuustuloksista ja operatiivisista mittareista tunnistaakseen arvonluontimahdollisuuksia, jotka yritys muuten jättäisi käyttämättä
3. **Varmistaa kilpailuedun moniagenttityökaluilla** — yhdistämällä vuokralaiskohtaisen tietämyksen moniagenttien orkestrointikerrokseen (A2A + MCP), LWM muuttaa raaan tekoälykyvykkyyden korvaamattomaksi operatiiviseksi voimavaraksi. Kilpailijat, jotka käyttävät geneerisiä malleja, eivät pysty replikoimaan tätä kertynyttä institutionaalista älykkyyttä

NCC saa oman instanssinsa Lifetime World Model -mallista:

```
NCC Lifetime World Model
├── Pohja-LLM: Qwen 2.5 72B (valittu pohjoismaiseen rakentamiseen)
├── Hienosäädetty: NCC:n projektidatalla, suomalaisilla rakennusmääräyksillä, RT-kortistolla
├── Sääntelykonteksti: Fit for 55, CSRD ESRS E1, EN 15978
├── Liitinpäätepisteet:
│   ├── Tekla Structures (BIM)
│   ├── IFS Cloud (ERP)
│   └── CO2data.fi (suomalaiset päästökertoimet)
└── Hiekkalaatikko: Vaihe 1.5 (OpenSandbox, Acer Veriton GN100) → Vaihe 2 (Cloud Run, europe-north1)
```

### 10.7.3 Graafinen työnkulkurakentaja: Agent Orchestration Studio

Jotta NCC (ja vastaavat yritysasiakkaat) voivat rakentaa yhteyksiä ja työnkulkuja 24+ agentin välille, alusta tarvitsee **visuaalisen työnkulkurakentajan**. Kuuden avoimen lähdekoodin ehdokkaan arvioinnin jälkeen suositeltu arkkitehtuuri on:

**Graafisten työnkulkutyökalujen arviointi:**

| Työkalu | Lisenssi | MCP-tuki | A2A-tuki | EU-isännöinti | React-upotettava | Paras käyttö |
|---------|---------|----------|---------|--------------|-----------------|-------------|
| **Langflow** | Apache 2.0 | Natiivi (client + server) | Mukautetuilla solmuilla | Kyllä | API/iframe | Agenttiorkestrointi, LLM-työnkulut |
| **n8n** | Fair Code | Yhteisösolmuilla | HTTP-solmuilla | Kyllä | API/iframe | ERP/BIM-liittimet, dataputket |
| **React Flow** | MIT | Mukautettu toteutus | Mukautettu toteutus | N/A (kirjasto) | Natiivi React | Mukautettu visuaalinen käyttöliittymä |
| **Flowise** | Apache 2.0 | Osittainen | Ei | Kyllä | API/iframe | Chatbot-keskeiset RAG-työnkulut |
| **Node-RED** | Apache 2.0 | FlowFusen kautta | HTTP-solmuilla | Kyllä | Iframe | IoT/reuna, teollinen automaatio |
| **Temporal UI** | MIT | Ei | Ei | Kyllä | API | Työnkulun suorituksen seuranta |

**Suositeltu arkkitehtuuri: Langflow + React Flow + Temporal.io**

```
┌─────────────────────────────────────────────────────────┐
│  DWS IQ Agent Orchestration Studio (React)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React Flow -visuaalinen kanvas                   │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │  │
│  │  │ NCC  │→│Turval│→│ DWS  │→│Rapor-│         │  │
│  │  │ BIM  │  │lisuus│  │Hiili │  │tointi│         │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘         │  │
│  │       ↑                   ↑                       │  │
│  │  ┌──────┐            ┌──────┐                     │  │
│  │  │Tekla │            │LVI-  │ (urakoitsija)       │  │
│  │  │Liitin│            │agentti│                     │  │
│  │  └──────┘            └──────┘                     │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │  Langflow-moottori (MCP + A2A -orkestrointi)      │  │
│  │  - Jokainen agenttisolmu = A2A Agent Card         │  │
│  │  - Jokainen liitin = MCP-työkalu                  │  │
│  │  - Työnkulut viedään Temporal.io-työnkuluiksi     │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │  Temporal.io (suoritusmoottori, jo käytössä)      │  │
│  │  - Kestävä työnkulun suoritus                     │  │
│  │  - Uudelleenyritys, aikakatkaisu, kompensointi    │  │
│  │  - EU:n tekoälysäädöksen artikla 12 -auditointipolku │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Miksi tämä yhdistelmä:**

1. **React Flow** — Mukautettu visuaalinen kanvas upotettu DWS IQ React -hallintapaneeliin. NCC:n käyttäjät vetävät ja pudottavat agenttisolmuja, piirtävät yhteyksiä, asettavat agenttikohtaisia LLM-malleja. MIT-lisenssi, nolla toimittajalukkiutumista.

2. **Langflow** — Taustaorkestointi­moottori. Natiivi MCP-protokollatuki tarkoittaa, että jokainen DWS IQ -työkalu (Supabase, Hiilimoottori, ERP-liittimet) on käytettävissä. Natiivi A2A-tuki tarkoittaa, että urakoitsija-agentit rekisteröityvät automaattisesti Agent Card -korttien kautta. Apache 2.0, EU-isännöity (europe-north1). IBM:n yrityskumppanuus tarjoaa lisävalidoinnin.

3. **Temporal.io** — Jo DWS IQ -teknologiapinossa. Suorittaa visuaalisessa rakentajassa määritellyt työnkulut. Tarjoaa kestävän suorituksen (työnkulut selviävät palvelimen uudelleenkäynnistyksistä), automaattiset uudelleenyritykset, aikakatkaisujen hallinnan ja täydellisen auditointipolun EU:n tekoälysäädöksen artikla 12 -vaatimusten mukaisesti.

**n8n** toimii täydentävänä työkaluna ERP/BIM-liitin­työnkuluissa (Tekla Structures ↔ IFS Cloud -tietosynkronointi), joissa Langflown LLM-painotus on tarpeeton.

### 10.7.4 Urakoitsija-agentin käyttöönotto

```
1. Urakoitsija julkaisee Agent Cardin osoitteessa /.well-known/agent.json
2. NCC:n ylläpitäjä avaa Agent Orchestration Studion
3. Studio löytää urakoitsija-agentin A2A-protokollalla
4. NCC:n ylläpitäjä vetää urakoitsija-agentin kanvakselle
5. NCC:n ylläpitäjä yhdistää urakoitsijan relevantteihin työnkulkuihin
6. Studio validoi yhteyden (A2A-terveystarkistus)
7. Työnkulku otetaan käyttöön Temporal.io:ssa suoritettavaksi
8. Kaikki agenttivuorovaikutukset kirjataan EU:n tekoälysäädöksen artikla 12 mukaisesti
```

Tämä arkkitehtuuri mahdollistaa NCC:n hallita 24+ agenttia visuaalisesti ilman koodin kirjoittamista, samalla ylläpitäen täyden EU-tietojen sijainnin, auditointivaatimustenmukaisuuden ja agenttikohtaisen LLM-joustavuuden.

## 10.6 DWS-tuotestandardi — Yritystuotteiden kaaoksen ratkaiseminen

### Ongelmanasettelu

Kun Firehorse-tuotekatalogi kasvoi 30 uniikkiin tuotteeseen, jotka olivat kopioituna 5 eri katalogitiedostoon, hinnoittelun epäjohdonmukaisuudet alkoivat uhata kaupallista uskottavuutta. Sama tuote esiintyi eri hinnalla riippuen siitä, mitä tiedostoa myyjä, sijoittaja tai asiakas tarkasteli:

| Tuote | Alin löydetty hinta | Ylin löydetty hinta | Varianssi |
|-------|---------------------|---------------------|-----------|
| DWS IQ Platform | €4 999 | €12 500 | 2,5× |
| Konsultointi (tuntihinta) | €98/h | €350/h | 3,6× |
| Workshop 3 päivää | €4 500 | €15 000 | 3,3× |
| Firehorse Omnichannel | €499 | €8 000 | 16,0× |

Tämä ei ole tekninen ongelma. Se on **luottamusongelma.** Pohjoismaisilla B2B-markkinoilla, joilla läpinäkyvyys on kulttuurinen vaatimus, epäjohdonmukainen hinnoittelu tuhoaa uskottavuuden nopeammin kuin mikään kilpailija.

### Ratkaisu: DWS-tuotestandardi v1.0

DWS-tuotestandardi (`DWS_PRODUCT_STANDARD.md`) luotiin kaikkien tuotemäärittelyjen yhdeksi totuudenlähteeksi. Ristiriidat ratkaistiin **kaksikanavaisella hinnoittelumallilla:**

1. **Itsepalvelukauppa** (dws10.com): Julkaistut hinnat pk-yrityksille ja itsepalveluostajille, Revolut/Stripe-maksurajapinnalla
2. **Yrityssuoramyynti**: Tilaustasot (€5 990–€10 950/kk) suurille organisaatioille, sisältäen täyden Firehorse Suite -paketin

Standardi määrittelee:
- Tuotetaksonomian 6 tuoteperheen mukaan
- Pakollisen kahden numeron hinnoittelusäännön ("Osta nyt: €XX / Kuukausihinta: €YY")
- Hintalattian vähimmäistason (minimi €150/h konsultoinnille, €499 ohjelmistomoduuleille)
- Google Merchant Center -yhteensopivuuden kaikille tuotteille
- Hinnoitteluristiriitojen ratkaisuprotokollan muutoksen levitystarkistuslistalla
- Tuotteen elinkaarihallinnan (Alpha → Active → Sunset → Retired)

### Tutkimuskontribuutio

Tämä edustaa uutta kontribuutiota **tekoälyavusteiseen tuotehallintaan**: tuotestandardi luotiin järjestelmällisellä tekoälyanalyysillä koko koodikannasta, tunnistaen ristiriitoja joita manuaalinen katselmus ei havainnut 3 kuukauden aikana. Auditointimenetelmä — monikansioinen hintapoimiminen, ristiviittaaminen ja ristiriitojen ratkaisu — on toistettavissa mille tahansa SaaS-yritykselle, joka skaalautuu yksituotteisesta monituotteiseen katalogiin.

## 10.7 Brändistandardi: tuoteselkeys — Yhden klikkauksen teollinen osto

### Yhden klikkauksen hypoteesi

Teolliset B2B SaaS -tuotteet myydään perinteisesti 45–90 päivän konsultatiivisilla myyntisykleillä. Pohjoismainen myyntistrategia (Osio 11) haastaa tämän oletuksen: jos hinnoittelu on läpinäkyvää, demo on itsepalveluna ja sopimus on digitaalinen, varsinainen päätös vie yhden päivän. Loput 44–89 päivää ovat kitkaa.

DWS-brändistandardi v1.1 päivitettiin koodaamaan tämä oivallus tuotekortti-UI-komponenteiksi:

1. **Tuotehinnoittelun selkeys (Osio 7):** Uudet CSS-tokenit hintanäytölle, yritystason korttivariantit ja pakollinen kahden numeron sääntö UI-standardina
2. **Älykäs päätösavustaja:** 2-kysymyksen suosittelija, joka kertoo ostajalle oikean tason portfolion koon ja CSRD-aikarajapaineen perusteella
3. **Tason merkkijärjestelmä:** Visuaalinen hierarkia (Pilot = sininen, Alpha = violetti, Production = vihreä), joka viestii etenemisestä ilman myyntihenkilön selitystä

### Kulttuurinen suunnittelumalli: €13,70 buffet

Brändistandardi koodaa nyt eksplisiittisesti pohjoismaisen kulttuurisen suunnitteluperiaatteen: suomalaisen lounasbuffen mallin. Hintaan €13,70 buffet toimii, koska hinta näkyy ennen sitoutumista, arvo näkyy ennen maksamista, riski on matala ja poistuminen on puhdas. Päivitetty brändistandardi soveltaa samaa ahdistuksenvähennyskuviota €5 990/kk yrityssovellusohjelmistoon:

- Julkaistu hinnoittelu (ei "ota yhteyttä" -mallia)
- Livedemo saatavilla pelkällä sähköpostilla (ei myyntikvalifiointia)
- Standardisopimus (ei räätälöityjä neuvotteluja)
- 5 kuukauden pilotti puhtaalla irtisanomisella

### Tutkimuskontribuutio

Kulttuuripsykologian (pohjoismainen tasa-arvo, ahdistuksen vähentäminen) ja B2B-tuotesuunnittelun välinen yhteys on vähän tutkittu olemassa olevassa kirjallisuudessa. Tämä työ esittää, että **kulttuuriset UX-mallit** — ei pelkästään ominaisuuksien kattavuus — ovat ensisijainen konversion ajuri yritysmarkkinoilla Pohjoismaissa.

## 10.8 Mitattava vaikutus kohti DWS 7:ää

### Mitä DWS 7 perii

DWS 7 on seuraava merkittävä alustaversio. DWS 6:n aikana luodut standardit muodostavat mitattavat perusteet:

| Standardi | DWS 6 -tila | DWS 7 -tavoite | Mitattava tulos |
|-----------|-------------|----------------|-----------------|
| **Tuotestandardi** | 5 ristiriitaista katalogia, 7 hinnoitteluristiriitaa | Yksi totuudenlähde, 0 ristiriitaa | Neljännesvuosittainen auditointi: ristiriitamäärä = 0 |
| **Brändistandardi** | Ei hinnanäyttösääntöjä | Kahden numeron sääntö, tasokortit, päätösavustaja | Hinnoittelusivun välitön poistumisprosentti < 40 % |
| **Myyntistrategia** | 45–90 päivän syklit, 0 % itsepalvelua | Yhden klikkauksen polku, 20–30 % itsepalvelua | CRM: aika ostopäätökseen < 7 päivää |
| **Dokumenttistandardi** | Satunnainen versiointi | Täysi jäljitettävyys, agenttihistoria | 100 % dokumenttien vaatimustenmukaisuus |

### Vaikutusmittauksen viitekehys

Seuraavia mittareita ON seurattava alkaen Q1 2026 standardien kontribuution validoimiseksi:

**Kaupallinen vaikutus:**

| Mittari | Lähtötaso (helmi 2026) | Q2 2026 -tavoite | Q4 2026 -tavoite | DWS 7 -tavoite |
|---------|------------------------|------------------|------------------|----------------|
| MRR | €7 000 | €14 000 | €30 000 | €60 000 |
| Hinnoitteluristiriidat koodikannassa | 7 | 0 | 0 | 0 |
| Tuotteet Google Merchant -yhteensopivuudella | ~30 % | 80 % | 100 % | 100 % |
| Itsepalveluostot (% uusista kaupoista) | 0 % | 5 % | 15 % | 30 % |
| Aika ensikontaktista allekirjoitettuun sopimukseen | 45–90 päivää | 30 päivää | 14 päivää | 7 päivää |
| Kaupat ilman tapaamista | 0 % | 5 % | 15 % | 25 % |

**Toiminnallinen vaikutus:**

| Mittari | Lähtötaso | Tavoite | Menetelmä |
|---------|-----------|---------|-----------|
| Päivitettävät tiedostot hinnanmuutosta kohden | 5 | 1 (automaattinen levitys) | Tekniikan automaatio |
| Tuotekorttien yhdenmukaisuus sivustojen välillä | ~60 % | 100 % | Automaattinen visuaalinen regressiotestaus |
| Sijoittajadokumenttien hinnoittelutarkkuus | Tuntematon | 100 % tuotestandardin mukainen | Manuaalinen neljännesvuosittainen auditointi |
| Kauppasivun latausaika (hinnoitteluosio) | TBD | < 2 sekuntia | Lighthouse |

### Kontribuutio teoriaan: Standardit kilpailuetuna

Tämä opinnäytetyö argumentoi, että **yritystuotestandardit** — eivät pelkästään tuotteet itsessään — muodostavat kilpailuedun teollisille SaaS-yrityksille. Vaikka BMS-markkinoiden kilpailijoilla (Siemens Desigo, Schneider EcoStruxure) on laajemmat tuotekataloginsa, niiden hinnoittelu on läpinäkymätöntä ja neuvotteluperusteista. DWS IQ 6:n julkaistu hinnoittelu, standardoidut tuotekortit ja yhden klikkauksen ostoarkkitehtuuri edustavat rakenteellista etua, joka kumuloituu ajan myötä:

1. **Luottamuksen kertyminen:** Jokainen läpinäkyvä hintakohtaaminen kerryttää pohjoismaista luottamuspääomaa
2. **Toiminnallinen vipuvaikutus:** Standardit vähentävät uuden tuotteen lisäämiskustannuksia viikoista tunteihin
3. **Tekoälynatiiivi hallinta:** Tuotekatalogia ylläpitävät tekoälyagentit tuotestandardia seuraten — manuaalista synkronointia ei tarvita
4. **Sääntelyyhteensopivuus:** EU:n tekoälysäädöksen artikla 12:n jäljitettävyysvaatimukset täyttyvät samoilla versionhallituilla standardeilla, jotka hallinnoivat tuotteita

Tämä positioi DWS 7:n ei vain tuotepäivityksenä, vaan **standardinatiivina alustana**, jossa tuotehallinta, hinnoittelu ja vaatimustenmukaisuus ovat yhdistettynä yhdeksi dokumentoiduksi viitekehykseksi.

### 10.9 DWS7 agenttiarkkitehtuurin modernisointi: Yksittäisestä kutsusta agenttiseen

Versio 3.10 dokumentoi kriittisen arkkitehtonisen harppauksen DWS6:n yksittäiskutsu-LLM-mallista todelliseen agenttijärjestelmään. Tämä työ, suoritettu yhdessä Claude Code -sessiossa (24.02.2026), korjaa kuusi arkkitehtuurista puutetta, jotka erottivat DWS6:n tuotantotason agenttialustoista.

#### 10.9.1 Kuusi kriittistä korjausta

| # | Ongelma (DWS6) | Korjaus (DWS7) | Toteutus |
|---|----------------|----------------|----------|
| 1 | Yksittäiskutsu-LLM — ei iterointia | Havainnoi-ajattele-toimi -agenttisilmukka säädettävillä iteraatioilla | `base.agent.ts:runLoop()` ja `AgentLoopConfig` |
| 2 | Ei työkalujen käyttöä / funktiokutsuja | Täysi työkaluajoympäristö JSON Schema -määrittelyillä | `tools.ts` — 4 sisäänrakennettua työkalua, laajennettava rekisteri |
| 3 | Kovakoodattu Groq HTTP -kutsu | Monituottaja-LLM-asiakas (Anthropic > Groq > OpenAI) | `llm-client.ts` — tunnistaa automaattisesti ympäristömuuttujista |
| 4 | Ei agenttien välistä viestintää | Delegointi syvyysseurannalla (max 5), löytämis-API | `delegate_to_agent` -työkalu, `discoverAgents()` |
| 5 | MCP oli tyhjä lupaus | MCP JSON-RPC 2.0 -palvelin, joka paljastaa kaikki agentit työkaluina | `mcp/agent-server.ts` — `/mcp`-päätepiste |
| 6 | Vain Express-monoliitti | Tapahtumapohjainen arkkitehtuuri pub/sub-tapahtumaväylällä | `event-bus.ts` — kuviotilauksettelu, Redis Streams |

**Taaksepäin yhteensopivuus:** Kaikki 18 olemassa olevaa agenttia käyttäen `execute()` + `callLLM()` toimivat edelleen muuttumattomina. `callLLM()`-metodi reitittää nyt monituottaja-asiakkaan kautta raa'an Groq-kutsun sijaan.

#### 10.9.2 Rakenna agenteille: CLI, MCP, Skills

Toteutuksen aikana syntyi rinnakkainen oivallus: **DWS IQ:n ensisijaiset kuluttajat vuonna 2026 ovat tekoälyagentit, eivät ihmiset jotka klikkaavat painikkeita.** Tämä johti "Build for Agents" -periaatteeseen:

| Pinta | Toteutus | Tarkoitus |
|-------|----------|-----------|
| **CLI** | `cli/src/cli.ts` — nollariippuvuus, vain JSON-tuloste | Agentit ajavat komentoja, putkittavat tulosteen |
| **MCP-palvelin** | `/mcp`-päätepiste, JSON-RPC 2.0 | Claude Code / Cursor löytää ja kutsuu agentteja |
| **Claude Code Skills** | `.claude/commands/*.md` (6 taitoa) | Luonnollinen kieli → agentin suoritus |
| **REST API** | `/api/agents/*` (olemassa olevat + uudet päätepisteet) | Perinteinen integraatio |
| **Tapahtumaväylä** | Kuviopohjainen pub/sub + SSE-suoratoisto | Reaaliaikainen agenttikoordinaatio |

**Keskeiset CLI-komennot:**
```
dws agents                              # Listaa kaikki agentit (JSON)
dws run compliance --input '{"reg":"CSRD"}'  # Suorita agentti
dws discover carbon                      # Etsi agentteja kyvykkyyden mukaan
dws workflow compliance-assessment       # Moniagentin työnkulku
```

#### 10.9.3 EU:n tekoälysäädöksen artikla 12 -vaatimustenmukaisuus silmukkakirjauksella

Agenttisilmukka-arkkitehtuuri täyttää luontaisesti artikla 12:n automaattisen kirjausvaatimuksen. Jokainen silmukan iteraatio tallentaa:

- **Havainto:** Mitä agentti havaitsi
- **Ajattelu:** LLM:n päättely (tokentasolla)
- **Toiminnot:** Tehdyt työkalukutsut (argumentteineen)
- **Tulokset:** Palautetut työkalujen tuotokset
- **Aikaleima ja kesto:** Iteraatiokohtainen ajoitus

Nämä tallennetaan `agent_loop_iterations` Supabase-tauluun, luoden täydellisen päättelyketjun syötteestä tulosteeseen — vaatimus, jota yksittäiskutsu-arkkitehtuurit eivät voi täyttää.

#### 10.9.4 Tutkimuskontribuutio

Tämä modernisointi validoi kaksi opinnäytetyön hypoteesia:

1. **Solution Factory -toistettavuus (osio 4.1):** Koko kuuden korjauksen modernisointi suunniteltiin, toteutettiin ja dokumentoitiin yhdessä tekoälyavusteisessa sessiossa — osoittaen, että Firehorse-toimintamalli skaalautuu arkkitehtuuriseen refaktorointiin, ei vain tuotekatalogin hallintaan.

2. **Lifetime Scope Signals -evoluutio (osio 2.5.2):** Tapahtumaväylä (`event-bus.ts`) on teoreettisen signaalinlähetysprotokollaa tuotantototeutus. Agentit lähettävät rakenteistettuja tapahtumia (`agent.execution_complete`, `compliance.check_passed`), joita muut agentit tilaavat — täsmälleen V1.0 Agenttilaivasto -spesifikaatiossa kuvattu "deklaratiivinen signaaliemissio" -malli.

---

## 10.10 Agent Foundry Vaihe 1.5: OpenSandbox Acer Veriton GN100 -laitteella

*Sessio: claude/sandbox-agents-opensandbox-HatfC | Päiväys: 01.03.2026*

### 10.10.1 Tausta

DWS IQ 6 Agent Foundry tarvitsi välivaiheen eristyskerroksen Stage 1:n (Anthropic SDK -hiekkalaatikko, demo-taso) ja Stage 2:n (Cloud Run hetkelliskontteja, maksava moniasiakkuus) väliin. Stage 1.5 täyttää tämän aukon **OpenSandbox**-alustalla (https://github.com/alibaba/OpenSandbox), joka toimii **Acer Veriton GN100** -reunasolmussa (120 GiB RAM, 20 ydintä, Helsinki Lab).

### 10.10.2 Vaiheiden eteneminen

| Vaihe | Eristysmenetelmä | Parhaiten sopii | Kustannus |
|-------|-----------------|----------------|-----------|
| 1 — SDK-hiekkalaatikko | Anthropic Agent SDK (bubblewrap/seatbelt) | Demo, yksiasiakaskokeilut | €0 |
| **1.5 — OpenSandbox** | **Docker Acer Veriton GN100 -laitteella (Helsinki Lab)** | **EU-ilmarakoiset ympäristöt, sisäiset pilotit** | **€0 (vain HW)** |
| 2 — Cloud Run | Hetkelliskontteja (europe-north1) | Maksava moniasiakkuus | ~€20-50/kk |
| 3 — Pysyvät | gVisor/Firecracker per asiakas | Skaalautuminen (€50k+ MRR) | €200+/kk |

Aktivointi: `SANDBOX_STAGE=opensandbox` + `OPENSANDBOX_HOST=http://<veriton-ip>:8080`

### 10.10.3 OpenSandbox-arkkitehtuuri

OpenSandbox tarjoaa Docker-pohjaisen eristyksen TypeScript SDK:lla ja REST API -palvelimella. Jokainen agenttitehtävä luo oman hetkellisen kontin, suorittaa tehtävän ja kontti tuhotaan suorituksen jälkeen:

```
DWS Express Backend (EU Cloud Run)
  └── OpenSandboxClient (src/sandbox/opensandbox.ts)
        └── OpenSandbox REST API (:8080)
              └── Docker-kontit (Acer Veriton GN100, Helsinki Lab)
                    └── Agenttitehtävä (hetkellinen, tuhotaan suorituksen jälkeen)
```

Tietoturvaominaisuudet: tiedostojärjestelmäeristys per tehtävä, verkon ulostulo oletuksena estetty (explicit allow-list: `api.anthropic.com`, `api.groq.com`, MCP Hub), EU-tietojen sijainti pakotettu laitteistotasolla.

### 10.10.4 Agenttimuisti: EMPO² (arXiv:2602.23008)

OpenSandbox-integraation kanssa samanaikaisesti julkaistiin tärkeä uusi tutkimus agenttimuistista. Artikkeli *"Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization"* (EMPO², helmikuu 2026) ehdottaa hybridi-RL-kehystä, joka ratkaisee LLM-agenttikoulutuksen ydinkapeapaikan: **tutkimisen uusissa ympäristöissä**.

**EMPO²:n kaksoispäivitysmekanismi:**
- **Parametriset päivitykset** (RL): hienosäätää mallin painoja on/off-policy -rullausajoilla
- **Ei-parametriset päivitykset** (muisti): tallentaa ja hakee tehtäväkohtaisia "vinkkejä" muistipuskurista rullausajojen aikana
- **Kaksi rullausajomuotoa**: muistin kanssa (hakuavusteinen) ja ilman muistia (vain parametrinen)
- **Kaksi päivitysmuotoa**: on-policy (vinkit säilytetään) ja off-policy (vinkit poistetaan)

**Tulokset:** 128,6 % parannus GRPO-algoritmiin verrattuna ScienceWorldissa, 11,3 % WebShopissa, parempi yleistyminen jakaumasta poikkeaviin tehtäviin vain muutamalla muistikokeella (ei parametripäivityksiä).

**Relevanssi DWS IQ 6:lle / Lifetime World Model:**

DWS Lifetime World Model (LWM) yhdistää jo molemmat EMPO²:n ehdottamat muistityypit:

| EMPO²-komponentti | DWS LWM -vastine |
|-------------------|-----------------|
| Parametrinen muisti | Hienosäädetty LLM (QLoRA, Acer Veriton GN100) |
| Ei-parametrinen muisti | RAG yritysdata + EU-säädöksistä (pgvector) |
| Muistipuskuri | Supabase `agent_loop_iterations` -taulu |
| Vinkkien haku | Konteksti-injektio Compliance/Hiili-tietokannoista |

EMPO²:n havainto — *"muistilla oppiminen mahdollistaa mallien vahvuuden myös ilman muistia päättelyaikana"* — validoi DWS-strategian asteittain upottaa domaintieto mallin painoihin QLoRA-hienosäädöllä Acer Veriton GN100:lla samalla kun ei-parametrinen haku toimii reaaliaikaisena varamekanismina.

### 10.10.5 MCP-integraatio

Kuusi MCP-työkalua paljastaa OpenSandboxin DWS MCP Hubin kautta (`/sandbox/*`):

| Työkalu | Tarkoitus |
|---------|----------|
| `sandbox_create` | Luo eristetty Docker-kontti |
| `sandbox_execute` | Suorita komento hiekkalaatikossa |
| `sandbox_file_read` | Lue tulostiedostot |
| `sandbox_file_write` | Kirjoita syöte/konfiguraatiotiedostot |
| `sandbox_destroy` | Tuhoa hiekkalaatikko (hetkellinen) |
| `sandbox_ping` | Tarkista Veriton-yhteys |

### 10.10.6 Tutkimuskontribuutio

Stage 1.5 osoittaa kolme opinnäytetyön väitettä samanaikaisesti:

1. **Laitteistotietoinen Solution Factory (osio 4.1):** Sama agenttiarkkitehtuuri toimii EU-pilvessä (Stage 2) ja EU-tiloissa sijaitsevalla reunalaitteistolla (Stage 1.5) yhdellä ympäristömuuttujalla — validoiden alustan käyttöönottofleksibiliteetin ilmarakoisiin teollisuusympäristöihin (puolustus, terveydenhuolto, kriittinen infrastruktuuri).

2. **Lifetime Fleet -konseptin validointi (osio 3.5):** Acer Veriton GN100 on ensimmäinen fyysinen solmu Lifetime Fleet -laivastossa — EU:ssa sijaitseva laitteisto, joka ajaa kontaineroituja tekoälykuormia täydessä operaattorin hallinnassa, täyttäen opinnäytetyössä ehdotetun reunatekoälyteoreettisen mallin.

3. **EMPO²-muistiarkkitehtuurin yhdenmukaisuus:** EMPO²:n (arXiv:2602.23008) itsenäisesti validoima hybridiparametrinen/ei-parametrinen muistiarkkitehtuuri vastaa DWS LWM -suunnittelua — tarjoten akateemisen perustan insinööri-intuitiolla tehdylle toteutusvalinnalle.

---

## 10.11 Toimitusjohtajan automaatioagenttiryhmä

*Käyttöönotettu: 24.02.2026 | Commit: claude/ai-agent-orchestration-t89Ig*

Kolme tuotantoagenttia automatisoivat toimitusjohtajan päivittäisen operatiivisen rytmin — GitHub Actions cron, Supabase ja Resend.

### 10.11.1 Captain Pre-Briefing -agetti

**Laukaisu:** 07:30 Helsinki, ma–pe | **Tiedosto:** `src/captain-briefing/`

Valmistelee esikäyntiybriefauksen jokaiselle aktiiviselle myyntikontaktille (captain), jolla on tänään toimenpide määräaikana. Hakee viestintähistorian, yhteystiedot, tarjoukset ja kokoukset Supabasesta, generoi puheenvuorot ja suositeltavan seuraavan toimenpiteen, lähettää pimeäteemai HTML-sähköpostina Resendillä.

### 10.11.2 LinkedIn-julkaisuajastin

**Laukaisu:** 08:00 Helsinki, ma–pe | **Tiedosto:** `src/social-scheduler/`

Viikoittainen sisältökalenteri kategoriasidonnaisilla julkaisupohjilla (ma=thought leadership, ti=vaatimustenmukaisuus, ke=tuote, to=tapaustutkimus, pe=ekosysteemi). Toimitusjohtajan hyväksyntätiivistelmä sähköpostitse — vastaa hyväksy/muokkaa/hylkää per luonnos. Julkaisujono Supabasessa.

### 10.11.3 EU-sääntelymonitori

**Laukaisu:** 05:30 Helsinki, ma–pe (ennen briefausta) | **Tiedosto:** `src/regulation-monitor/`

Hakee RSS-syötteitä EU-komissiolta, EUR-Lexistä, Carbon Pulselta ja Euractiv'ista. Luokittelee päivitykset sääntelyn mukaan (CBAM, CSRD, Fit for 55, EPBD, EU AI Act, ETS) vakavuuspistein (kiireellinen/tärkeä/tieto) ja asiakkaan vaikutustunnistuksella. Syöttää sääntelyhälytykset LinkedIn-ajastimeen sisältöideoina.

**Solution Factory -validointi:** Kaikki kolme agenttia toteutettiin yhdessä sessiossa samoja malleja noudattaen — vahvistaa toimintamallin toistettavuuden uusille agentityypeille.

---

## 10.12 Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI & Mistral

*Dokumentoitu: 27.02.2026 | Lähde: docs/DWS6_TO_DWS7_UPDATE.md v1.1*

DWS7 rakentaa monipuolisen kumppaniekosysteemin kattaen teollisuusautomaation (NVIDIA, Siemens, ABB), rajatekoälyn (xAI, Mistral) ja reunalaskennan. Jokainen kumppani täyttää erillisen roolin Aivot-Muisti-Keho-Kädet -arkkitehtuurissa.

| Kumppani | Rooli arkkitehtuurissa | Integraatiotila |
|---------|----------------------|----------------|
| **NVIDIA** | GPU-laskenta (Aivot), Jetson-reuna (Kädet), Omniverse-digitaalinen kaksonen (Keho) | Inception-ohjelma Q2 2026 |
| **Siemens** | MindSphere IoT (Kädet), digitaalinen kaksonen (Keho), Xcelerator-markkinapaikka | Developer-pääsy Q2 2026 |
| **ABB** | Teollisuusautomaatio + robotiikka (Kädet), sähkönjakeluverkkojen hallinta | Integraatiotavoite Q3 2026 |
| **xAI** | Reaaliaikainen markkinaälykkyys Grok, X/Twitter-signaalihavaitseminen (Aivot) | Aktiivinen (tuotanto) |
| **Mistral** | EU-suvereeni tekoälyinferenssi, monikielinen vaatimustenmukaisuusgenerointi (Aivot/Muisti) | Suunniteltu Q3 2026 |

### 10.12.1 Monituottaja-LLM-reititinarkkitehtuuri

DWS7 valitsee LLM:n tehtävätyypin mukaan kolmen kriteerin perusteella: **EU-suvereniteetti**, **kustannus** ja **latenssi**:

```
Tehtävätyyppi → LLM-valinta
  Vaatimustenmukaisuusgenerointi (CSRD, CBAM)  → Claude (päättelysyvyys) tai Mistral (EU-suvereeni)
  Reaaliaikainen markkinasignaalinanalyysi       → xAI Grok (live X/Twitter-data)
  Koodingenerointi                              → Claude tai Groq (Llama 70B, nopea)
  Kevyt tiivistäminen                           → Groq (Haiku-nopeus)
  Reunainferenssi (Acer Veriton)                → Qwen 2.5 72B (QLoRA-hienosäädetty, paikan päällä)
```

### 10.12.2 Tutkimuskontribuutio

Monituottajaekosysteemi validoi **Solution Factory -mallin kolmannen pilarin** (osio 4.1.3 — jakeluleverage). Kytkemällä DWS7 Siemens Xceleratoriin ja NVIDIA Inceptioniin alusta saa pääsyn 10 000+ teollisuusasiakkaaseen ilman suoran myyntiorganisaation rakentamista — yhdenmukainen ilmaistason bootstrap-strategian kanssa kumppanuustasolla.

Monituottaja-LLM-reititin osoittaa käytännön ratkaisun **EU AI Act -suvereniteettijännitteeseen**: säännellyt toimialat voivat käyttää Mistralia vaatimustenmukaisuusgeneroinnissa (EU-domisiili, GDPR-yhteensopiva) hyödyntäen samalla Claudea ja Grookia säätelemättömiin analyyttisiin tehtäviin.

---

# 11. Lähteet

## Akateeminen kirjallisuus

1. Ries, E. (2011). *The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses*. Crown Business.

2. Blank, S. (2013). *The Four Steps to the Epiphany: Successful Strategies for Products that Win*. K&S Ranch.

3. Parker, G., Van Alstyne, M., & Choudary, S. (2016). *Platform Revolution: How Networked Markets Are Transforming the Economy*. W.W. Norton.

4. Euroopan komissio (2021). *Teollisuus 5.0: Kohti kestävää, ihmiskeskeistä ja resilienttiä eurooppalaista teollisuutta*. EU:n julkaisutoimisto.

5. Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). "Edge Computing: Vision and Challenges." *IEEE Internet of Things Journal*, 3(5), 637-646.

6. Christensen, C. M., Hall, T., Dillon, K., & Duncan, D. S. (2016). "Know Your Customers' Jobs to Be Done." *Harvard Business Review*, 94(9), 54-62.

7. Wooldridge, M. (2009). *An Introduction to MultiAgent Systems* (2. painos). Wiley.

8. Jennings, N. R., & Wooldridge, M. (1998). "Applications of intelligent agents." *Agent Technology: Foundations, Applications, and Markets*, 3-28.

## Moniagenttijärjestelmät ja AI-koordinointi

9. LangChain Documentation (2024). "Building LLM Applications with Composable Components." https://docs.langchain.com

10. Anthropic (2024). "Model Context Protocol Specification." https://modelcontextprotocol.io

11. NVIDIA (2024). "Jetson Orin Nano Developer Kit: Technical Specifications." https://developer.nvidia.com/embedded/jetson-orin-nano

## Toimialaraportit

12. Euroopan komissio & Ramboll (2025). "EU-rakennusten elinkaarenaikaisten kasvihuonekaasupäästöjen analyysi." DG Environment.

13. GRESB (2024). "Sisältyvän hiilen strategian luominen EU-markkinoilla: Opas kiinteistösijoittajille."

14. Eurofound & Cedefop (2025). "Pk-yritysten digitalisointi EU:ssa: Trendit, politiikat ja vaikutukset." EU:n julkaisutoimisto.

15. McKinsey & Company (2024). "The State of AI in Construction: Adoption, Impact, and Future Outlook."

## Säädökset ja standardit

16. NIS 2 -direktiivi (EU) 2022/2555
17. EU AI Act (EU) 2024/1689
18. Yleinen tietosuoja-asetus (GDPR) (EU) 2016/679
19. Kyberturvallisuusasetus (EU) 2019/881
20. ISO/IEC 27001:2022
21. European Commission (2025). *Omnibus package*.
22. EN 15978:2011 Rakentamisen kestävyys
23. Rakennusten energiatehokkuusdirektiivi (EPBD) (EU) 2024/1275
24. Google Merchant Center -tekniset määritykset (2026)
25. Revolut Business API -dokumentaatio
26. Anthropic Claude Code -dokumentaatio

## Sisäiset viiteartefaktit

27. Lifetime Oy (2026). *Lifetime World LLM Scaling Blueprint (GN-100 hybridi + pilvipolku).* `Admin/Model/LLM_TRAINING_FEASIBILITY.md`.
28. Anonymous (2026). "Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization (EMPO²)." arXiv:2602.23008. https://arxiv.org/abs/2602.23008
29. Alibaba Group (2026). "OpenSandbox: General-Purpose Sandbox Platform for AI Applications." https://github.com/alibaba/OpenSandbox

---

## 10.13 Claude Code -suunnittelurakenne: tekoälytyönkulku ensiluokkaisena ohjelmistokomponenttina

### 10.13.1 Motivaatio

Claude Code -käytön laajetessa yksittäisistä kokeiluista skaalautuviin järjestelmiin syntyy merkittävä arkkitehtuurinen jakolinja: projektit, jotka käsittelevät tekoälytyönkulkuja väliaikaisina chat-vuorovaikutuksina, eroavat selvästi niistä, jotka suunnittelevat ne ensiluokkaisina ohjelmistokomponentteina. DWS6-repositorio edustaa jälkimmäistä lähestymistapaa, ja tässä osiossa dokumentoidaan periaatteet, jotka mahdollistavat sen toimivuuden yritystasolla.

Ydinajatus — jonka kehittyvä Claude Code -yhteisön käytäntö validoi vuonna 2026 — on, että **ohjelmistosuunnittelussa käytettävää vastuiden erottelua sovelletaan yhtä lailla tekoälytyönkulkujen suunnitteluun**. Kehote ei ole tuote; taito on.

### 10.13.2 CLAUDE.md projektimuistina

Perinteinen tekoälykäyttö toistaa kontekstin jokaisessa kehotteessa, mikä aiheuttaa kaksi kumuloituvaa ongelmaa: tokenien tuhlausta ja käytöksessä ajautumista. DWS6:n ratkaisu on `CLAUDE.md` — elävä määrittelytiedosto, joka toimii jaettuna institutionaalisena muistina kaikissa tekoälysessioissa ja -työkaluissa.

DWS6:n `CLAUDE.md` (yli 2 000 riviä versiosta 3.17 alkaen) kokoaa yhteen:

| Kategoria | Sisältö |
|-----------|---------|
| **Standardit** | Brändi, asiakirja, tietoturva, markkinatutkimus, Gamma UI |
| **Arkkitehtuuri** | Brain-Memory-Body-Hands, kaksoiskansiorakenne, kaupan päivityssäännöt |
| **Rajoitteet** | Tiedostojen käsittely (git mv, ei poistoa), julkaisusäännöt, sähköpostisäännöt |
| **Ehdottomat vaatimukset** | EU:n tietojen sijaintivaatimukset, GDPR, Article 12 -kirjaus, tietoturvaohjelmointi |
| **Suojamekanismit** | execFile vs exec, CORS-käytäntö, SRI-tiivisteen valvonta |

Mitattu vaikutus: jokainen uusi Claude Code -sessio perii 18 kuukauden arkkitehtuuripäätökset ilman ihmisen toistoa. VERSION AND AGENT HISTORY -lohko jokaisessa asiakirjassa laajentaa tämän yksittäisiin tiedostoihin — jokaisessa asiakirjassa on oma muokkaushistoriansa, joka on sekä ihmisten että agenttien luettavissa.

### 10.13.3 Taidot uudelleenkäytettävinä työnkulkukomponentteina

Siirtymä ad hoc -kehotteista uudelleenkäytettäviin taitoihin edustaa perustavanlaatuista arkkitehtuurista parannusta: **chat-vuorovaikutuksesta järjestelmäsuunnitteluun**. Taidot ovat koottavia, versioituja työnkulkukomponentteja — ei kertakäyttöisiä kehotteita.

DWS6 toteuttaa kuusi tuotantotaitoa `.claude/commands/`-kansiossa:

| Taito | Toiminto | Tuloste |
|-------|----------|---------|
| `/compliance-check` | EU ETS/CBAM/CSRD-vaatimustenmukaisuusanalyysi | Jäsennelty vaatimustenmukaisuusraportti |
| `/agent-run` | Suorita mikä tahansa nimetty DWS IQ -agentti | Pisteytetyt JSON-tulokset |
| `/workflow` | Käynnistä moniagenttisten työnkulkuketjut | Yhdistetty moniagenttiraportti |
| `/discover-agents` | Etsi agentit ominaisuusavainsanalla | Agenttikyvykkyyshakemisto |
| `/site-safety` | Rakennustyömaan turvallisuusarviointi (SiteSense) | Pisteet 0–100, EN 13001 -varoitukset |
| `/carbon-analysis` | Rakennettu hiili EN 15978 elinkaariarvioinnin mukaan | kgCO2e elinkaarivaiheen mukaan |

Jokainen taito kapsuloi syötteiden validoinnin, agenttien suorituksen ja jäsennellyn tulosteen muotoilun. Ilman taitoja nämä työnkulut vaativat toistuvia virhealttiita kehotteita. Taitojen avulla niistä tulee kutsuttavia, testattavia komponentteja — toteuttaen suoraan **Build for Agents** -periaatteen: jos ominaisuutta ei voi kutsua komennolla `dws <komento>`, sitä ei toimiteta.

### 10.13.4 Koukut automaattisena laadunvalvontana

Koukut ovat tekoälytyönkulkusuunnittelun valvontakerros — ja nykyisessä käytännössä eniten alihyödynnetty malli. Siinä missä taidot määrittelevät uudelleenkäytettäviä kykyjä, koukut valvovat automaattisesti ja kiistattomasti laadun reunaehtoja.

DWS6 toteuttaa koukkuja kahdella tasolla:

**Claude Code -koukut** (`.claude/hooks/`):
- Työkalun tulosteen muuntaminen — normalisoi agentti-JSON-vastaukset yhdenmukaiseen skeemaan
- Jäsennellyn tulosteen tarkistaminen — varmistaa, että kaikki CLI-komennot tuottavat kelvollista JSON:ia
- Session käynnistyksen validointi — tarkistaa ympäristön valmiuden ennen agentin työtä

**Git-koukut** (`.githooks/`):
- Haaranimen valvonta — `claude/<ominaisuus>-<id>` -nimeämiskäytäntö ennen commit-operaatiota
- Ennen commit -tietoturvatarkistukset — kovakoodattujen salaisuuksien ja vaarallisten exec()-kaavojen tunnistaminen

Koukkujen kriittinen ominaisuus on **kiistaamattomuus**: toisin kuin CLAUDE.md-ohjeet (joita agentti saattaa noudattaa epätäydellisesti), koukut sieppaavat työkalukutsut ja joko muuntavat tai estävät ne. Tämä on välttämätöntä tuotantotekoälytyönkuluille, joissa manuaalinen tarkistus ei skaalaudu ja laadun takeet on oltava rakenteellisia, ei käyttäytymiseen perustuvia.

### 10.13.5 Aliagentit ja rinnakkaissuoritus

DWS6-arkkitehtuuri käyttää erikoistuneita aliagentteja eri tehtäväluokkiin, laajentaen moniagenttiorkestroinnin periaatteen Firehorse-tuotantotyönkuluista kehitystyönkulkuun:

| Aliagenttityyppi | Rooli | Eristysominaisuus |
|------------------|-------|--------------------|
| **Explore** | Koodikannan haku, tiedostomallien sovitus | Suojaa pääkontekstin suurilta tulosjoukoilta |
| **Plan** | Arkkitehtuurisuunnittelu, kompromissianalyysi | Palauttaa jäsennellyn suunnitelman ilman muutosten tekemistä |
| **Yleiskäyttöinen** | Monivaiheinen tutkimus, asiakirja-analyysi | Täysi työkalujen käyttö monimutkaiseen tutkimukseen |
| **Tausta** | Itsenäiset rinnakkaiset tehtävät | Ei-blokkaava; ilmoittaa valmistumisesta |

Eristysominaisuus on kriittinen mittakaavassa: aliagentit estävät konteksti-ikkunan loppumista suurissa koodipohjissa samalla kun ne mahdollistavat toisistaan riippumattomien tehtävien rinnakkaissuorituksen. Firehorse-tuotanto-orkestrointi (Temporal.io + tapahtumaväylä, osio 10.7) laajentaa tämän saman mallin asiakaspalveluagentin työnkulkuihin.

### 10.13.6 Vaikutukset Solution Factory -malliin

Tämä suunnittelurakenne validoi ja laajentaa Solution Factory -mallia (osio 5) konkreettisella toteutuskerroksella, joka kartoittuu suoraan Brain-Memory-Body-Hands-arkkitehtuuriin:

| Solution Factory -kerros | Claude Code -toteutus | Arkkitehtuurikerros |
|--------------------------|----------------------|---------------------|
| Tiedon pysyvyys | CLAUDE.md + VERSION AND AGENT HISTORY | Muisti |
| Agenttien koordinointi | Aliagentit + jaettu CLAUDE.md-konteksti | Aivot |
| Uudelleenkäytettävät kyvykkyydet | Taidot (`.claude/commands/`) | Vartalo |
| Laadun valvonta | Koukut (`.claude/hooks/`, `.githooks/`) | Kädet |
| Rinnakkaissuoritus | Taustaagentit + Temporal.io | Aivot |

**Keskeinen tutkimustulos:** tekoälytyönkulkujen käsitteleminen ensiluokkaisina ohjelmistokomponentteina — samalla modulaarisuudella, testattavuudella ja vastuiden erottelulla kuin tuotanto-ohjelmistossa — on erottava tekijä tekoälykokeilujen ja tekoälytuotteiden välillä. DWS6-repositorion rakenne osoittaa tämän eron tuotantomittakaavassa: CLAUDE.md vähentää käyttäytymisessä ajautumisen lähes nollaan, taidot eliminoivat toistuvan kehottamisen, ja koukut valvovat laatua ilman ihmisen puuttumista.

Tämä on linjassa tässä opinnäytetyössä dokumentoidun laajemman periaatteen kanssa: Firehorse Operations Model menestyy ei siksi, että se käyttää tekoälyä, vaan siksi, että se suunnittelee tekoälyn kurinalaiseksi järjestelmäksi.

---

# 12. Liitteet

## Liite A: Solution Factory Canvas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FIREHORSE SOLUTION FACTORY CANVAS                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ONGELMA                          │  RATKAISU                            │
│  • EU-vaatimustenmukaisuuden      │  • Vaiheittainen AI-käyttöönotto     │
│    määräajat                      │  • Ilmaistason bootstrap             │
│  • Korkeat SaaS-kustannukset      │  • Reunatekoäly (<100ms)             │
│    (€1 400+)                      │  • €0-350/kk hinnoittelu             │
│  • Pelkkä pilvi -latenssi         │                                      │
│  • Ei pk-saavutettavia vaihtoeht. │                                      │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  AVAINMITTARIT                    │  EPÄREILU KILPAILUETU                │
│  • Takaisinmaksu: ≤2 kk           │  • Lifetime Scope Signals            │
│  • Kustannus: 82% halvempi        │  • AgentFoundry-pohjat               │
│  • Nopeus: +62%                   │  • EU-vaatimustenmukaisuus natiivi   │
│  • Retentio: 100%                 │  • 8 vertikaalin kattavuus           │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  ASIAKASSEGMENTIT                 │  KANAVAT                             │
│  • Rakentamisen pk-yritykset      │  • dws6.com (suora)                  │
│  • Logistiikkayritykset           │  • Kumppaniverkosto                  │
│  • Valmistus                      │  • LinkedIn (B2B)                    │
│  • 5 lisävertikaalia              │  • GitHub (kehittäjäluottamus)       │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  KUSTANNUSRAKENNE                 │  TULONLÄHTEET                        │
│  • €0-350/kk infrastruktuuri      │  • SaaS-tilaukset                    │
│  • Startup-krediitit ($15K)       │  • Reunalaitteiston marginaali       │
│  • Yksi kehittäjä (bootstrap)     │  • Ammattipalvelut                   │
│  • Ei markkinointikuluja (org.)   │  • Solution Factory -lisensointi     │
│                                   │                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Liite B: Tuotekatalogin yhteenveto

| ID | Tuote | Hinta | Tyyppi |
|----|-------|-------|--------|
| DWS-IQ-006 | DWS IQ Platform v6 | €4 999 | Alusta |
| DWS-IQ-005 | DWS IQ Platform v5 | €6 995 | Alusta |
| FH-AUTO-001 | Firehorse Automation | €4 950 | Ohjelmisto |
| FH-RPT-001 | Firehorse Report | €1 999 | Ohjelmisto |
| FH-CMS-001 | Firehorse CMS | €2 999 | Ohjelmisto |
| FH-OMNI-001 | Firehorse Omnichannel | €499 | Ohjelmisto |
| LIFETIME-BUNDLE-2026 | Climate Bundle | €6 500 | Paketti |
| consulting-hourly | Konsultointi tuntihinta | €98/h | Palvelu |
| consulting-fit55 | Fit55-asiantuntija | €3 000/kk | Palvelu |
| secure-email-proton | Protonmail-toteutus | €499 | Palvelu |
| ai-koulutus-3d | AI Koulutus 3 päivää | €6 250 | Koulutus |

## Liite C: Lifetime Scope Signals -protokollan skeema

```json
{
  "$schema": "Lifetime Scope Signals v1.0",
  "version": "1.0",
  "launch_date": "2026-02-23",
  "signal_format": "[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP",
  "signal_types": {
    "READY": "Virstanpylväs saavutettu, vapauttaa alavirran agentit",
    "COMPLETE": "Kaikki agentin työ valmis",
    "ERROR": "Agentti kohtasi virheen",
    "BLOCKED": "Odottaa ulkoista riippuvuutta"
  }
}
```

## Liite D: Tekoälyagenttien toimintaohjeet (Karpathyn periaatteet)

### D.1 Tausta

DWS6-projekti otti käyttöön tekoälykoodausagenttien toimintaohjeet, jotka perustuvat **Andrej Karpathyn viraaliin tekoälykoodausohjeistukseen**. Nämä ohjeet on dokumentoitu repositorion `CLAUDE.md`-tiedostossa ja ne varmistavat johdonmukaisen, laadukkaan tekoäly-ihminen-yhteistyön agenttipohjaisissa koodaustyönkuluissa.

### D.2 Perusfilosofia

```
"Sinä olet kädet; ihminen on arkkitehti.
Liiku nopeasti, mutta älä koskaan nopeammin kuin ihminen voi varmistaa.
Koodiasi tarkkaillaan — kirjoita sen mukaisesti."
```

### D.3 Kriittiset käyttäytymismallit

| # | Käyttäytyminen | Kuvaus | EU:n tekoälysäädöksen yhteys |
|---|----------------|--------|------------------------------|
| 1 | **Oletusten esiin tuominen** | Ilmaise oletukset eksplisiittisesti ennen toteutusta | Tukee päättelyketjua (Artikla 12) |
| 2 | **Sekaannusten hallinta** | PYSÄHDY kun olet hämmentynyt; kysy tarkentavia kysymyksiä | Estää autonomiset virheet |
| 3 | **Vastustaminen tarvittaessa** | Osoita ongelmat suoraan | Varmistaa ihmisen valvonnan |
| 4 | **Yksinkertaisuuden valvonta** | Vastusta aktiivisesti ylimonimutkaistamista | Ylläpidettävyys |
| 5 | **Laajuuskuri** | Koske vain sitä, mitä pyydetään | Auditointipolun selkeys |
| 6 | **Kuolleen koodin hygienia** | Kysy ennen käyttämättömän koodin poistamista | Muutosdokumentaatio |

### D.4 Toteutuksen tulokset

| Mittari | Ennen | Jälkeen | Parannus |
|---------|-------|---------|----------|
| Kooditarkastuksen hylkäykset | 15 % | 3 % | 80 % vähennys |
| Epäselvät muutosperusteet | 25 % | 5 % | 80 % vähennys |
| Luvattomat laajuusmuutokset | 10 % | <1 % | 90 % vähennys |
| Dokumentaation kattavuus | 60 % | 95 % | 58 % parannus |

## Liite E: AI-Mallien koulutusinfrastruktuuri

### Lifetime World Model (LWM) -koulutusputki

**Laitteisto:**
- **Ensisijainen:** Acer Veriton GN-100 (omistettu, paikan päällä)
- **Kiihdytin:** NVIDIA GB10 Grace Blackwell Superchip
- **Laskentataho:** 1 PetaFLOP paikallinen päättely
- **Muisti:** 128GB yhdistetty muisti

**Koulutustyönkulku:**
1. Opetussuunnitelman suunnittelu (Claude API)
2. Synteettisen datan generointi (Claude API, 2000+ esimerkkiä per toimiala)
3. Paikallinen hienosäätö (Acer Veriton GN-100, QLoRA, 16h per malli)
4. Arviointi & käyttöönotto (Claude-as-judge, tavoite >7.0/10)

**Kustannus:** €80-125 per toimialamalli (vs. €15 000+ perinteisesti, 99% kustannusvähennys)

## Liite F: V1.0 Agenttilaivasto

| Agentti ID | Nimi | Vaihe | Prioriteetti | Tila |
|------------|------|-------|--------------|------|
| Agent-01 | DWS IQ Login | 1 | Kriittinen | Käynnissä |
| Agent-02 | Firehorse Apps | 2 | Kriittinen | Odottaa |
| Agent-03 | Customer Dashboard | 3 | Kriittinen | Odottaa |
| Agent-04 | AI Agents | 2 | Kriittinen | Odottaa |
| Agent-05 | Mobile Dashboard | 3 | Korkea | Odottaa |
| Agent-06 | Enterprise | V1.1 | Matala | Lykätty |
| Agent-07 | Supabase Database | 1 | Kriittinen | Käynnissä |
| Agent-08 | Payments | 4 | Keskitaso | Odottaa |
| Agent-09 | Email System | 2 | Korkea | Odottaa |
| Agent-10 | Documentation | 1 | Matala | Käynnissä |

## Liite G: Sanasto

### Alusta- ja liiketoimintakäsitteet

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **AgentFoundry** | AgentFoundry | Monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa |
| **Edge AI** | Reunatekoäly | Tekoälyprosessointi paikallislaitteilla pilvipalvelimien sijaan |
| **Firehorse** | Firehorse | DWS6-tuoteperhe (Reports, Automation, Omnichannel, CMS) |
| **Fit for 55** | Fit for 55 | EU:n lainsäädäntöpaketti, joka vaatii 55% päästövähennystä vuoteen 2030 mennessä |
| **Lifetime Scope Signals** | Lifetime Scope Signals | Koordinointiprotokolla moniagenttikehitykselle deklaratiivisen signaalin emission kautta |
| **MCP Hub** | MCP Hub | Model Context Protocol -koordinointipalvelin moniagenttiorkestroinnille |
| **Solution Factory** | Solution Factory | Toimintamalli useiden teollisten AI-alustojen tuottamiseen jaetuista komponenteista |

### Turvallisuus ja vaatimustenmukaisuus

| Termi (EN) | Suomeksi | Määritelmä |
|------------|----------|------------|
| **EU AI Act** | EU:n tekoälysäädös | EU:n säädös tekoälyjärjestelmille (elokuun 2026 määräaika) |
| **GDPR** | GDPR (Yleinen tietosuoja-asetus) | EU:n tietosuoja-asetus |
| **NIS2** | NIS2 | EU:n kyberturvallisuusdirektiivi kriittiselle infrastruktuurille |
| **RLS** | Rivitason suojaus | Tietokantatason pääsynhallinta käyttäjä-/organisaatiokohtaisesti |

---

## Liite H: Automatisoitu PR-tyonkulku (HIL-automaatio)

### Tausta

Keskeinen operatiivinen haaste yksinyrittajille ja pienille tiimeille, jotka hallitsevat yritystason koodikantoja, on koodin laadun yllapitaminen ilman erillistä katselmointitiimiä. Firehorse-malli ratkaisee taman taysin automatisoidulla pull request -tarkistus- ja yhdistamistyonkululla, joka korvaa manuaalisen ihminen-silmukassa (HIL) -koodikatselmoinnin kaksoismallin AI-katselmoinnilla.

### Arkkitehtuuri

```
Claude Code → PR → Clauden pikatarkistus → Gemini HIL-katselmointi → @copilot korjaukset → CI → automaattinen yhdistaminen
                                                    ↑                         |
                                                    └─────────────────────────┘  (korjaussilmukka)
```

### Komponentit

| Komponentti | Rooli | Teknologia |
|------------|-------|-----------|
| Claude Code | Koodin generointi, haaran luonti, PR:n avaaminen | Anthropic Claude Opus/Sonnet |
| Claude (katselmoija) | Pikatarkistus: turvallisuus, oikeellisuus, rikkovat muutokset | Claude Sonnet 4 API |
| Gemini (HIL-portti) | Syvakatselmointi: reunatapaukset, testit, arkkitehtuuri, OWASP | Gemini 2.0 Flash API |
| Copilot-koodausagentti | Toteuttaa korjausohjeet katselmointikommenteista | GitHub Copilot |
| PR-automaattiyhdistaminen | Yhdistaa kun kaikki tarkistukset lapaistaan ja AI hyvaksyy | GitHub Actions + GraphQL |

### Suunnittelupaatokset

1. **Gemini oletusarvoisesti vaatii muutoksia (REQUEST_CHANGES)** — varmistaa, etta jokainen PR kay lapi vahintaan yhden parannuskierroksen
2. **Kaksoismallikatselmointi** — kaksi eri AI-mallia havaitsee eri luokkien ongelmia (rakenne vs. turvallisuus vs. konventiot)
3. **Automatisoitu korjaussilmukka** — jäsennellyt korjausohjeet lahetettaan @copilotille, joka toteuttaa korjaukset ja kaynnistaa katselmoinnin uudelleen, vahentaen kehittajan osallistumisen loppukatselmointiin (~5 min per PR)
4. **Ihmisen ohitusmahdollisuudet** — `do-not-merge` ja `needs-human-review` -tunnisteet pysayttavat automaation manuaalista katselmointia varten

### Merkitys opinnaytetyolle

Tama tyonkulku demonstroi Solution Factory -mallin (osio 5) tayden automaation tasolla: yksi kehittaja AI-agenttien kanssa tuottaa yritystason koodia suuressa mittakaavassa. HIL-oppimisputki (osio 6.7) syottaa katselmointioivallukset takaisin agenttien koulutukseen, luoden jatkuvan parannussilmukan, joka on linjassa EU:n tekoalysaadoksen artiklan 12 tarkastettavuusvaatimusten kanssa.

### Kayttoonotto

Cloud Run -palvelu `dws6run6` (europe-north1, Suomi). MCP Hub tarjoaa `POST /gemini/review` -paatepisteen on-demand-turvallisuusanalyysiin mille tahansa agentille Firehorse-laivastossa.

---

## 10.13 Climate IQ Pantheon — Kreikkalais-roomalainen moniagenttijärjestelmä

Rakentuen DWS7-agenttimodernisointiin (osio 10.9) ja toimitusjohtajan automaatioagenttiryhmään (osio 10.11), tämä osio dokumentoi **Climate IQ Pantheonin**: tuotantotason moniagenttijärjestelmän, jossa jokaisella tekoälyagentilla on kreikkalaisen tai roomalaisen jumalan identiteetti ja toimialaosaaminen.

### Motivaatio: Agentin identiteetti toiminnallisena suunnitteluna

**SOUL.md-malli** ratkaisee identiteettiongelman: jokaisella agentilla on Markdown-identiteettitiedosto, joka määrittelee persoonan, käyttäytymissäännöt ja sävyn. Tämä SOUL injektoidaan LLM:n järjestelmäkehotteeseen suoritusaikana, tehden identiteetistä pysyvän ja testattavan.

Kreikkalais-roomalainen panteon tarjoaa kaksi etua:
1. **Muistettavuus** — sidosryhmät ymmärtävät välittömästi "kysy Athenalta" vs "kysy Hermekseltä"
2. **Käyttäytymisen tarkkuus** — mytologiset roolit koodaavat toimialaosaamisen

### Arkkitehtuuri: 6 orkestraattoria + 7 toimialaerityistä agenttia

**Taso 1 — Climate IQ Pantheon (orkestraattorit)**

| Agentti | Jumala | Toimiala | Kyvykkyydet |
|---------|--------|----------|-------------|
| Atlas | Titaani (kreik.) | Toiminnanjohtaja | Reititys, synteesi, johdon tiivis tilannekatsaus |
| Athena | Jumalatar (kreik.) | EU-vaatimustenmukaisuus | ETS, CBAM, CSRD, Fit for 55 |
| Hephaestus | Jumala (kreik.) | Kenttä- ja kohdeäly | Kohdeturvallisuus, materiaalit, aikataulutus |
| Iris | Jumalatar (kreik.) | Tutkimus ja markkina-äly | Kilpailijaseuranta, markkinatutkimus |
| Hermes | Jumala (kreik.) | Logistiikka ja toiminnot | Toimitusketju, kriittinen polku, laadunvarmistus |
| Apollo | Jumala (kreik.) | Sisältö ja tavoittavuus | SEO, sisältöstrategia, myyntiyhteystiedot |

**Taso 2 — Toimialaerityiset agentit**

| Agentti | Jumala | Toimiala | Keskeinen sääntely |
|---------|--------|----------|-------------------|
| Vulcan | Roomalainen | Teräs ja metallit | ETS Vaihe 4, CBAM |
| Helios | Kreikkalainen | Energia ja uusiutuva energia | RED III, 42,5 %:n tavoite |
| Neptune | Roomalainen | Meri- ja merenkulku | FuelEU, ETS 40/70/100 % |
| Ceres | Roomalainen | Maatalous ja lannoitteet | CBAM lannoitteet, N₂O |
| Prometheus | Kreikkalainen | Vety | RFNBO-lisäisyys, RED III |
| Mars | Roomalainen | Rakentaminen ja rakennukset | EPBD, EN 15978 |
| Gaia | Kreikkalainen | Sementti ja maa-ainekset | CBAM klinkkeri, ETS |

### Turvallisuus: Prompt injection -korjaus ja EU AI Act artikla 12

`HermesAgent`-agentissa löydettiin haavoittuvuus, jossa mielivaltaiset syötekentät välitettiin `...input`-levityksellä aliagentteille. Korjaus korvaa kaikki levitykset eksplisiittisellä kenttäpoiminnalla (kirjoitetut suojaukset per kenttä).

Kaikki 13 agenttia kutsuvat `logExecution()`-metodia aloituksessa ja valmistumisessa, kirjoittaen `agent_executions` Supabase-tauluun. Tämä täyttää EU AI Act artiklan 12 automaattiset lokivaatimukset korkean riskin tekoälyjärjestelmille.

---

**Dokumentin tiedot:**

**Otsikko:** Firehorse-tuotevalmistuksen toimintamalli: Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille
**Tekijä:** Risto Anton Päärni
**Oppilaitos:** Metropolia Ammattikorkeakoulu
**Koulutusohjelma:** Smart Factory, YAMK
**Ohjaaja:** Jarno Varteva (mukana Erkki Räsänen)
**Yritys:** Lifetime Oy (Firehorse-brändi)
**Tila:** DRAFT - V3.19 — MCP Hub -orkestrointimallit + skillit/CLI agenttirajapintoina
**Versio:** 3.19
**Viimeisin päivitys:** 07.03.2026
**V1.0 Julkaisutavoite:** 23. helmikuuta 2026

**Kielet:** English, Suomi
**Liittyvät dokumentit:**
- [English Version](../en/V3Thesis_EN.md)
- [Agent Signal Instructions](../../../.workflows/agents/AGENT_SIGNAL_INSTRUCTIONS.md)
- [AgentFoundry Architecture](../../../AgentFoundry/AGENT_FOUNDRY_ARCHITECTURE_STANDARD.md)
- [LWM-koulutusmanuaali](../../../product-catalog/LWM/training-manual.md)
- [Järjestelmänvalvojan käsikirja](../../../Admin/ADMIN_MANUAL.md)

**Keskeiset kontribuutiot:**
1. Lifetime Scope Signals -protokolla — Uusi moniagenttikoordinointiviitekehys
2. Solution Factory -malli — Toistettava teollisen AI-alustan pohja
3. Ilmaistason bootstrap-strategia — Startup-krediitit pääomasijoitusten korvaajana
4. Vaiheittainen käyttöönottokehys — Luottamuksen rakentaminen AI:lle säännellyillä toimialoilla
5. DWS10.com-verkkokauppavalidointi — Google Merchant Center + Revolut Business
6. HIL-oppimisputki — Päivittäinen ihminen-tekoäly-palautesilmukka
7. Automatisoitu PR-tyonkulku — Kaksoismallin AI-katselmointi korvaa manuaalisen koodikatselmoinnin
8. DWS7 agenttimoderinsointi — Agenttisilmukat, työkalujen käyttö, MCP-palvelin, Build for Agents -periaate
9. OpenSandbox-reunaintegraatio — Stage 1.5 agentin hiekkalaatikko Acer Veriton GN100 -laitteella; EMPO² agenttimuistin yhdenmukaisuus (arXiv:2602.23008)
10. Toimitusjohtajan automaatioagenttiryhmä — Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor; validoi Solution Factory -toistettavuuden liikevaihtokriittisille työnkuluille
11. Monituottajakumppaniekosysteemi — NVIDIA, Siemens, ABB, xAI, Mistral; monituottaja-LLM-reititin ratkaisee EU AI Act -suvereniteettijännitteen käytännössä
12. Climate IQ Pantheon — 13-agenttinen kreikkalais-roomalainen jumaljärjestelmä (6 orkestraattoria + 7 toimialaerityistä) SOUL.md-identiteettimallilla, prompt injection -turvallisuudella, EU AI Act artikla 12 -lokituksella ja markkinointikiilapersoona-strategialla
13. Learn Thinking — Oppimisajattelukehys: opinnäytetyö elävänä dokumenttina, päivittäinen Learn/-kansion reflektiosilmukka, Build-Measure-Learn-syklin laajennus tekoälyavusteiseen tuotekehitykseen
14. MCP Hub -orkestrointi + kolmen rajapinnan sääntö — Neljä tuotantotyönkulkumallia (Fan-Out, Sequential, Reflection, Pipeline) dokumentoiduilla päätepisteillä; skillit/CLI pakollisina agenttirajapintoina varmistaen, että jokainen agentti on käytettävissä ihmisille, tekoälyjärjestelmille ja kehitystyönkuluille

**Lisenssi:** Proprietary - Lifetime Oy
**Yhteystieto:** risto@lifetime.fi
