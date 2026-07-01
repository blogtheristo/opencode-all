# Referenssit — Claude Code -valmennus, AI-asiantuntijapalvelut ja tutkimusyhteistyö

## LUT-yliopisto

---

---

VERSION AND AGENT HISTORY
Versio: 1.0 | 2026-06-27 | Claude Sonnet 4.6 | Alkuperäinen referenssiasiakirja

---

---

## Tarjoajan tiedot

Yritys: Lifetime Oy
Y-tunnus: 0772407-9
Yhteyshenkilö: Risto Anton Päärni
Sähköposti: risto.paarni@lifetime.fi
Rooli LUT:ssa: Tohtorikoulutettava, PHD_FIREHORSE -tutkimussuunnitelma v3.51

---

## Referenssi 1 — Claude Code -valmennusohjelma: EU AI Act 4 artiklan mukainen AI-lukutaitomalli

**Asiakas / tilaaja:** EU-organisaatiot (useita toimeksiantoja; yksittäiset asiakkaat NDA-suojattu)
**Ajanjakso:** 2025–2026
**Laajuus:** n. 25 htp per toimeksianto (1 pv luento + 2 pv työpaja + 2–6 vk ohjattu projektityö)

**Kuvaus:**

Kehitetty ja toimitettu Claude Code -valmennusohjelma, joka tuottaa asiakasorganisaatiolle dokumentoidun tekoälyn hallintamallin ja EU AI Act 4 artiklan mukaisen AI-lukutaitonäytön:

- **EU AI Act 4 artiklan mukainen AI-lukutaitomalli:** ohjelma tuottaa organisaatiolle kirjallisen näytön henkilöstön tekoälylukutaidosta
- **Hallintamallin rakenne:** GREEN/YELLOW/RED -luottamusraja-arkkitehtuuri; agenttien autonomiataso ja eskalointiprotokolla; kontekstin suunnitteluperiaatteet; tietoturva- ja tietosuojakäytännöt AI-työkaluille
- **Ohjelmarakenne:**
  - 1 pv: agenttisiirtymä, 12 insinöörikurin sääntöä, kontekstin suunnittelu, luottamusraja, live-demo
  - 2 pv: asiakkaan omassa repositoriossa plan → implement → review → ship -sykli käytännössä
  - Valinnainen 2–6 vk: ohjattu toimitus oikeasta backlog-kohteesta
- **EU-suvereenius:** asiakkaan koodi ja immateriaalioikeudet eivät poistu EU-lainkäyttöalueelta
- **Kohderyhmä:** ohjelmistokehittäjät, tekniset vastaavat, kehityspäälliköt (max 10–12 hlö/ryhmä)
- **Kielet:** suomi, englanti, ruotsi, saksa, ranska

**Toimitettu output asiakkaalle:**

- Kirjallinen AI-käyttöpolitiikka organisaatiolle
- Henkilöstön tekoälylukutaitonäyttö (EU AI Act 4 art.)
- Luottamusraja-dokumentaatio (GREEN/YELLOW/RED)
- Prosessikuvaus: miten AI integroituu kehityssykliin

**Rooli:** Ohjelman suunnittelija, kouluttaja ja toimittaja (100 %)

---

## Referenssi 2 — PHD_FIREHORSE: empiiriset tulokset agenttipohjaisen kehityksen vaikutuksista

**Konteksti:** LUT-yliopiston tohtorikoulutettavan tutkimusaineisto
**Ajanjakso:** 2024–2026 (jatkuva)
**Aineisto:** 1 500+ pull requestia dws6-repositoriossa; 15 GitHub Actions -työnkulkua; 16+ agentin tuotantojärjestelmä

**Empiiriset tulokset (PHD_FIREHORSE -tutkimuksesta):**

| Mittari                       | Tulos                          | Mittaustapa                         |
| ----------------------------- | ------------------------------ | ----------------------------------- |
| Kehitysnopeus (velocity)      | +62 % kasvu                    | Pull request -tiheys, 2024 vs. 2026 |
| Kustannusvähenemä             | 82 % lasku                     | Tunti/feature-suhde ennen/jälkeen   |
| Auditoitavuus                 | 100 % pull requesteista        | GitHub Actions tarkistuspiste       |
| EU AI Act Article 12 -lokitus | Jokaisella agenttioperaatiolla | Immutable audit trail tuotannossa   |

**Tieteellinen merkitys LUT:lle:**

- Empiirinen aineisto agenttipohjaisen ohjelmistokehityksen vaikutuksista — harvinainen n=1 500+ pitkittäisaineisto
- Vertailtavuus: sama kehittäjä, sama koodipohja, agenttityökalun käyttöönotto mitattuna
- Sovellettavuus: tulokset relevantteja ohjelmistotuotannon, teollisuuden digitalisaation ja AI-hallinnan tutkimukselle

**Rooli:** Tutkija ja aineiston omistaja

---

## Referenssi 3 — EU-sääntelyautomatisointi: AI-pohjainen prosessikehitys teollisuudessa

**Asiakas / tilaaja:** Pohjoismaiset teollisuusyritykset (energia, rakennus, logistiikka) — NDA-suojattu
**Ajanjakso:** Q4/2025 – Q2/2026
**Laajuus:** n. 60 htp; laskutettu Q1/2026 pilottisopimukset 59 900 €; 6 maksavaa asiakasta

**Kuvaus — AI-pohjainen prosessikehitys ja hallintamalli:**

1. **Nykytila-analyysi:** asiakkaan prosessien kartoitus, manuaalisen työn osuuden mittaus, AI-hyödyntämismahdollisuuksien arviointi
2. **Toimintamallin suunnittelu:** 16 toimialaontologiaan perustuva asiakaskontekstin mallinnus; Human-in-the-Loop -pisteet
3. **Pilottitoteutus:** asiakaskohtainen EU-sääntelyanalyysiagentin räätälöinti; manuaalisen työn vähenemä 70–80 % raportoinnissa
4. **Koulutus ja käyttöönotto:** loppukäyttäjäkoulutus, ohjeistus suomeksi, palautekierros
5. **Jatkuva tuki:** MRR-pohjainen tilausmalli (7 000 €/kk huhtikuussa 2026)

**Asiakassegmentit:** energia (päästöraportointi ETS/CBAM), rakennus (hankintojen vaatimustenmukaisuus), logistiikka (toimitusketjun dokumentaatio CSRD)

**Rooli:** Pää-konsultti ja arkkitehti

---

## Referenssi 4 — DWS IQ 6 -alusta: EU-suvereeni moniagenttijärjestelmä tuotannossa

**Asiakas / tilaaja:** DWS IQ 6 SaaS-asiakkaat (Pohjoismaiset teollisuusyritykset)
**Ajanjakso:** 2024–2026 (jatkuva)
**Laajuus:** n. 120 htp; 6 maksavaa asiakasta; MRR 7 000 €

**Kuvaus — EU-suvereeni tekoälyarkkitehtuuri:**

- **16+ TypeScript-agenttia** tuotannossa Brain-Memory-Body-Hands -arkkitehtuurilla
- **EU AI Act -vaatimustenmukaisuus:** Article 12 immutable audit trail, Article 9 riskienhallinta
- **Sovereignty audit:** Kaikki malli-inferenssi voidaan ajaa EU-lainkäyttöalueella (Cloudflare Workers Europe, Google Cloud EU)
- **MCP-protokolla:** Model Context Protocol agenttiyhteistyön standardina
- **15 000+ EU-sääntelydokumenttia** RAG-indeksissä (pgvector + semanttinen haku)

**Yhteys PHD_FIREHORSE -tutkimukseen:** Tämä järjestelmä on tutkimuksen primaarinen empiirinen kohde ja samalla todiste EU-suvereenin moniagenttiarkkitehtuurin toteutettavuudesta.

**Rooli:** Suunnittelija, arkkitehti ja pääkehittäjä (100 %)

---

## Avainasiantuntija

| Kenttä            | Tieto                                                                   |
| ----------------- | ----------------------------------------------------------------------- |
| Nimi              | Risto Anton Päärni                                                      |
| Titteli           | Toimitusjohtaja & Pää-arkkitehti, Lifetime Oy                           |
| Akateeminen rooli | Tohtorikoulutettava, LUT-yliopisto (PHD_FIREHORSE v3.51)                |
| Kokemusvuodet     | 35+ vuotta (teollisuuden ICT-konsultointi 1990–)                        |
| AI-konsultointi   | 3+ vuotta EU-organisaatioille                                           |
| Koulutus          | YAMK Smart Factory — Metropolia AMK (lopputyö jätetty 20.6.2026)        |
| Kielet            | Suomi (äidinkieli), englanti (C2), ruotsi (B2), saksa (A2), ranska (A2) |
| Sijainti          | Espoo, Finland                                                          |

### Relevantti osaaminen LUT:n kannalta

- Tohtorikoulutettava LUT:ssa — akateeminen suhde valmiina
- Empiirinen tutkimusaineisto: +62 % kehitysnopeus, 82 % kustannusvähenemä (n=1 500+ PR)
- EU AI Act 4 artiklan mukaisen AI-lukutaitomallin suunnittelu ja toimitus
- EU-suvereeni moniagenttiarkkitehtuuri tuotannossa (PHD_FIREHORSE tutkimuksen kohde)
- EU-sääntelyautomatisointi: ETS, CBAM, CSRD, NIS2, GDPR — LUT:n tutkimusintressit
- Monikielinen koulutus ja dokumentointi (suomi, englanti, ruotsi)

---

_Lifetime Oy | Y-tunnus: 0772407-9 | risto.paarni@lifetime.fi_
