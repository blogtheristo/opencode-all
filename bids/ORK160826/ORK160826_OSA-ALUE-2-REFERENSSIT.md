# Osa-alue 2 — Asiakasratkaisujen ja -prosessien kehityksen tuki

## Referenssilomake | ORK/1462/2026

***

VERSION AND AGENT HISTORY
Version: 2.0 | 2026-06-27 | Claude Sonnet 4.6 | Päivitetty osa-aluekohtaisten vaatimusten mukaiseksi

***

---

## Tarjoajan tiedot

Yritys: Lifetime Oy
Y-tunnus: 0772407-9
Yhteyshenkilö: Risto Anton Päärni
Sähköposti: risto.paarni@lifetime.fi

---

## Vaatimuskartoitus — Osa-alue 2

| Vaatimus                                                                          | Referenssi                                                       | HTP               |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ----------------- |
| Tekoälyn hallintamalli asiakasorganisaatiolle, ≥20 htp                            | Referenssi 1 — Claude Code -hallintamallitoimitus                | ~25 htp / asiakas |
| Asiakaskonsultointi AI-pohjainen prosessi-/palvelu-/toimintamallikehitys, ≥20 htp | Referenssi 2 — EU-sääntelyautomatisointi teollisuusasiakkaille   | ~60 htp           |
| Tuotantoon viety agenttipohjainen ratkaisu, toimittaja suunnitellut kokonaisuuden | Referenssi 3 — DWS IQ 6 asiakasportaali ja onboarding-automaatti | ~120 htp          |

---

## Referenssi 1 — Claude Code -valmennusohjelma: tekoälyn hallintamalli organisaatiolle

**Kattaa vaatimuksen:** Tekoälyn hallintamallin tuottaminen asiakasorganisaatiolle ≥20 htp

**Asiakas / tilaaja:** EU-organisaatiot (useita toimeksiantoja; yksittäiset asiakkaat NDA-suojattu)
**Ajanjakso:** 2025–2026
**Laajuus:** n. 25 htp per toimeksianto (1 pv luento + 2 pv työpaja + 2–6 vk ohjattu projektityö)

**Kuvaus — AI-hallintamalli ja organisatorinen tekoälylukutaito:**

Kehitetty ja toimitettu Claude Code -valmennusohjelma, joka tuottaa asiakasorganisaatiolle dokumentoidun tekoälyn hallintamallin:

- **EU AI Act 4 artiklan mukainen AI-lukutaitomalli:** ohjelma tuottaa organisaatiolle kirjallisen näytön henkilöstön tekoälylukutaidosta (EU-vaatimustenmukaisuus)
- **Hallintamallin rakenne:** GREEN/YELLOW/RED -luottamusraja-arkkitehtuuri; agenttien autonomiataso ja eskalointiprotokolla; kontekstin suunnitteluperiaatteet; tietoturva- ja tietosuojakäytännöt AI-työkaluille
- **Ohjelmarakenne:**
  - 1 pv: agenttisiirtymä, 12 insinöörikurin sääntöä, kontekstin suunnittelu, luottamusraja, live-demo
  - 2 pv: asiakkaan omassa repositoriossa plan → implement → review → ship -sykli käytännössä
  - Valinnainen 2–6 vk: ohjattu toimitus oikeasta backlog-kohteesta
- **EU-suvereenius:** asiakkaan koodi ja immateriaalioikeudet eivät poistu EU-lainkäyttöalueelta
- **Kohderyhmä:** ohjelmistokehittäjät, tekniset vastaavat, kehityspäälliköt (max 10–12 hlö/ryhmä)
- **Kielet:** suomi, englanti, ruotsi, saksa, ranska

**Toimitettu hallintamallin output asiakkaalle:**

- Kirjallinen AI-käyttöpolitiikka organisaatiolle
- Henkilöstön tekoälylukutaitonäyttö (EU AI Act 4 art.)
- Luottamusraja-dokumentaatio (GREEN/YELLOW/RED)
- Prosessikuvaus: miten AI integroituu kehityssykliin

**Rooli:** Ohjelman suunnittelija, kouluttaja ja toimittaja (100 %)

---

## Referenssi 2 — EU-sääntelyautomatisoinnin asiakaskonsultointi (prosessikehitys AI:n avulla)

**Kattaa vaatimuksen:** Asiakaskonsultointi, jossa prosessien/palveluiden/toimintamallien kehittäminen AI:n avulla ≥20 htp

**Asiakas / tilaaja:** Pohjoismaiset teollisuusyritykset (energia, rakennus, logistiikka) — yksityiskohtaisemmat tiedot NDA-suojattu, asiakasreferenssikirje saatavilla pyydettäessä
**Ajanjakso:** Q4/2025 – Q2/2026
**Laajuus:** n. 60 htp (vaatimusmäärittely, prosessianalyysi, pilottitoteutus, koulutus)
**Laskutettu:** Q1/2026 pilottisopimukset yhteensä 59 900 €; 6 maksavaa asiakasta

**Kuvaus — Tekoälypohjainen prosessikehitys asiakkaalla:**

Toteutettu asiakaskohtainen konsultointiprosessi EU-sääntelyvaatimustenmukaisuuden automatisointiin:

1. **Nykytila-analyysi:** asiakkaan prosessien kartoitus, manuaalisen työn osuuden mittaus, AI-hyödyntämismahdollisuuksien arviointi
2. **Toimintamallin suunnittelu:** 25 toimialaontologiaan perustuva asiakaskontekstin mallinnus; AI-agentin vastuualueiden rajaus; inhimillisen valvonnan pisteet (Human-in-the-Loop)
3. **Pilottitoteutus:** asiakaskohtainen EU-sääntelyanalyysiagentin räätälöinti; manuaalisen työn vähenemä 70–80 % raportoinnissa
4. **Koulutus ja käyttöönotto:** loppukäyttäjäkoulutus, ohjeistus suomeksi, palautekierros
5. **Jatkuva tuki:** kuukausittainen tilausmalli. (Hinnoittelu tarjouksen hintalomakkeen mukaan. Yhtiön n. 7 000 €/kk on palvelu- ja kuljetusliikevaihtoa, ei ohjelmiston MRR:ää — ks. `docs/TRACTION_CANONICAL.md`.)

**Asiakassegmentit:** energia (päästöraportointi), rakennus (hankintojen vaatimustenmukaisuus), logistiikka (toimitusketjun dokumentaatio)

**Rooli:** Pää-konsultti ja arkkitehti

---

## Referenssi 3 — DWS IQ 6 asiakasportaali: agenttipohjainen palvelukokonaisuus

**Kattaa vaatimuksen:** Tuotantoon viety agenttipohjainen tekoälyratkaisu, jossa toimittaja on suunnitellut palvelukokonaisuuden

**Asiakas / tilaaja:** Pohjoismaiset teollisuusyritykset (DWS IQ 6 SaaS-asiakkaat)
**Ajanjakso:** 2024–2026 (jatkuva)
**Laajuus:** n. 120 htp asiakasportaalin ja onboarding-automaation suunnitteluun ja toteutukseen
**Tuotantostatus:** Käytössä 6 maksavalla asiakkaalla; MRR 7 000 €

**Kuvaus — Kokonaispalvelukokonaisuuden suunnittelu ja toteutus:**

Suunniteltu ja toteutettu alusta loppuun agenttipohjainen asiakaspalvelukokonaisuus:

- **Palveluarkkitehtuuri:** KYA (Know Your Advisor) -profilointi → automatisoitu nykytila-analyysi → agenttikohtainen toimenpidesuositus → raportointi
- **Onboarding-automaatti:** asiakastietojen keruu → validointi → organisaatioprofiilin luonti → ensimmäinen AI-analyysi automaattisesti < 24 h tilauksesta
- **Asiakasportaali:** React 19 -käyttöliittymä, Supabase-backend, RLS-käyttöoikeushallinta
- **Raportointi:** JSON → PDF/HTML automaattisesti, monikielinen (suomi/englanti/ruotsi)
- **Integraatiot:** Cloudflare Workers (edge), Google Cloud Run (backend), GitHub Actions CI/CD

**Rooli:** Palvelukokonaisuuden suunnittelija, arkkitehti ja pääkehittäjä (100 %)

---

## Avainasiantuntija: Risto Anton Päärni

| Kenttä          | Tieto                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| Nimi            | Risto Anton Päärni                                                      |
| Titteli         | Toimitusjohtaja & Pää-arkkitehti, Lifetime Oy                           |
| Kokemusvuodet   | 35+ vuotta (teollisuuden ICT-konsultointi 1990–)                        |
| AI-konsultointi | 3+ vuotta EU-organisaatioille                                           |
| Koulutus        | YAMK, Smart Factory — Metropolia AMK (lopputyö jätetty 20.6.2026)       |
| Kielet          | Suomi (äidinkieli), englanti (C2), ruotsi (B2), saksa (A2), ranska (A2) |
| Sijainti        | Espoo, Finland                                                          |

### Relevantti osaaminen tähän osa-alueeseen

- Tekoälyn hallintamallien suunnittelu ja toimitus EU-organisaatioille (EU AI Act 4 art.)
- Asiakasprosessien nykytila-analyysi ja AI-pohjainen kehittäminen
- Claude Code -valmennus: agenttisiirtymä, luottamusraja-arkkitehtuuri, GREEN/YELLOW/RED
- EU-sääntelyautomatisointi: NIS2, GDPR, EU AI Act, CSRD, ETS/CBAM
- Prosessiautomaatio: Power Automate, tekoälyagentit, ERP-integraatiot (SAP, IFS, Dynamics 365)
- Vaatimusmäärittely ja käyttäjätarinat julkishallintotasolla
- Monikielinen dokumentointi ja koulutus (suomi, englanti, ruotsi)
