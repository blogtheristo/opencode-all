---
slug: know-your-agent-kya-s1.fi
title: "Tunne agenttisi (KYA-S1): Yksi allekirjoitettu sivu tekoälystä tietoturvakansiossa, joka koskee dataasi"
series: "KYA-S1 -blogisarja"
part: 1
parts_total: 12
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
hero_image: ../static/images/blog/kya-s1-series-hero-fi.jpg
hero_image_alt: "Sarjakartta: KYA-S1 -blogisarjan 11 osaa yhdellä kuvalla"
hero_image_status: "PENDING FIX — Osa 8 esiintyy kahdesti (12 korttia / 11 osaa); 1024x559 alle 4K-rajan"
Status: APPROVED
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — "suomenkielinen hyväksytty"
source: HIC-kirjoittama ja hyväksymä teksti (sessio claude/kya-s1-blog-post-1-swb4k4). Teksti käytetty sellaisenaan; ei agentin uudelleenkirjoitusta.
note: >-
  Sarjan osa 1/11. Korvaa aiemman itsenäisen FI-version
  docs/blog-drafts/kya-s1-one-signed-page.fi.md, joka jää talteen CLAUDE.md Rule 12:n
  mukaisesti (formulaatioita ei hävitetä). Avoin ristiriita: tämä teksti käyttää
  varmuustasoja KYA-AL1/AL2/AL3. HIC ratkaisi nimeämisen 09.08.2026: AL-nimet jäävät, ja
  Legal/KYA_S1.md päivitettiin v1.4:ksi (Bronze/Silver/Gold poistui). Ei enää avointa ristiriitaa.
---

# Tunne agenttisi (KYA-S1): Yksi allekirjoitettu sivu tekoälystä tietoturvakansiossa, joka koskee dataasi

Blogi 1/11 · DWS IQ & Lifetime World Model · 8. elokuuta 2026 · Risto Anton Päärni

## Johdanto: Tekoäly tekee päätöksiä, mutta kuka kantaa vastuun?

Yritysten ja julkishallinnon hankintakansioista löytyy nykyisin kattava pino allekirjoitettuja asiakirjoja. Organisaatiotasolle on SOC 2 Type 2- ja ISO/IEC 27001 -sertifikaatit. Datalle ja tietosuojalle löytyvät GDPR- ja CSRD-todisteet. Alustaturvallisuudelle ja infrastruktuurille on osoittaa FedRAMP- tai suvereeni pilvihyväksyntä.

Hankintakansiosta puuttuu kuitenkin yksi kriittinen dokumentti: allekirjoitettu sivu autonomiselle tekoälyagentille.

Kun tekoäly siirtyy tekstin generoinnista autonomisiin toimenpiteisiin — suorittamaan koodia, kutsumaan API-rajapintoja, tekemään finanssitransaktioita ja ohjaamaan fyysisiä teollisuusprosesseja — vanha ohjelmistotietoturva ei enää riitä.

Autonominen tekoälyagentti ei ole pelkkä ohjelmisto. Se on toimija. Siksi jokainen agentti edellyttää omaa todennettua identiteettiä, toimintamandaattia sekä välitöntä hätäjarrua.

## Yksi sivu toimittajakansioon (KYA-S1 v1.3 Specification)

KYA-S1 (Know Your Agent Security Specification v1.3) on tekoälyagenttien ajonaikaisen käyttäytymisen ja identiteetin varmentava turvallisuusstandardiehdotus. Se tiivistyy kolmeen selkeään kysymykseen, joihin jokaisen toimittajan on pystyttävä vastaamaan ennen kuin agentti päästetään käsiksi asiakkaan dataan:

**Kuka on agentin takana? (IDV — Identity Verification)**
Jokainen agentin tekemä ratkaisu ja työkaluvaatimus on voitava jäljittää kryptografisesti todennettuun ihmiseen (HIC-johtajaan).

**Mitä se saa tehdä ja mitä se tekee juuri nyt? (REG & BHM)**
Agentilla on oltava ennen aktivointia ilmoitettu kyvykkyysmanifesti (REG), jota se ei voi ajonaikaisesti ylittää, sekä jatkuva käyttäytymisen valvonta (BHM) poikkeamien havaitsemiseksi.

**Miten se pysäytetään vikatilanteessa? (TC4 — Chain Termination)**
Jos agentin luottamustaso romahtaa tai tapahtuu poikkeama, koko agenttiketju on voitava eliminoida atomisesti aikarajoitetun SLA-vasteen puitteissa (leash snap).

## Ei itsearviointia (§3 Evidence Meta-Rule)

Toimittajahallinnan suurin sudenkuoppa on itsearviointi (self-attestation). KYA-S1-spesifikaation §3 kieltää toimittajan oman ilmoituksen ehdottomasti:

> **Sääntö (§3):** Itsearviointi ei ole hyväksyttävä todiste KYA-S1-yhteensopivuudesta. Paperi on täsmälleen niin arvokas kuin sen toisella allekirjoitusrivillä oleva nimi.

Hyväksyttäväksi todisteeksi kelpaa ainoastaan akkreditoidun kolmannen osapuolen auditointiraportti (esim. SOC 2 -auditoija tai akkreditoitu red-team-yritys) tai kryptografisesti varmennettu alustatelemetria, jota säilytetään muuttamattomassa lokirekisterissä.

Tämä sääntö sitoo myös spesifikaation laatijaa: Lifetime Oy ei myönnä KYA-S1-sertifikaattia omalle DWS IQ -alustalleen ennen kuin riippumaton, ulkopuolinen arvioija on sen allekirjoittanut.

## KYA-AL-varmuustasot (Assurance Levels)

Teollisuuden KYA-AL-varmuustasot (Assurance Levels) määrittelevät auditoinnin tiheyden ja SLA-reagointinopeuden:

| Varmuustaso            | Auditointitiheys       | Todisteiden vaadittu syvyys                                               | SLA-reagointiaika (IDV & TC4) |
| ---------------------- | ---------------------- | ------------------------------------------------------------------------- | ----------------------------- |
| **KYA-AL1 (Standard)** | Vuotuinen auditointi   | 3. osapuolen auditointi vähintään 1 alueella + allekirjoitettu telemetria | max 15 minuuttia              |
| **KYA-AL2 (Enhanced)** | Neljännesvuosittainen  | Auditointi IDV- ja BHM-alueilla + 12 kk allekirjoitettu telemetria        | max 5 minuuttia               |
| **KYA-AL3 (Critical)** | Jatkuva reaaliaikainen | Ulkopuolinen arvioija kaikilla 7 alueella + allekirjoitettu SLA           | max 60 sekuntia               |

## Suora kytkentä EU AI Actiin (§4)

KYA-S1-spesifikaatio tuottaa suoraan hyödynnettävää aineistoa EU:n tekoälyasetuksen velvoitteisiin:

- **Artikla 12 (Lokitus):** KYA-S1:n PRV-kontrolli tuottaa päätösten toistettavuuden (PRV-2) ja muuttumattoman historiatiedon.
- **Artikla 14 (Ihmisen valvonta / HIC):** KYA-S1:n IDV, TC4, TRS ja PRV-4 takaavat ihmisen todellisen johtamis- ja kumoamisvallan.
- **Artikla 50 (Läpinäkyvyys):** KYA-S1:n PRV-3 tuottaa todennettavan alkuperäismerkinnän tuotoksille.

**Rehellinen raja:** KYA-S1-yhteensopivuus ei sellaisenaan ole EU AI Act -yhteensopivuutta. Se antaa ostajalle kovan teknisen todisteen siitä, että agentin ajonaikainen toiminta täyttää lain kirjaimen.

## Lyhyesti

- **Yksi allekirjoitettu sivu:** Autonominen agentti tarvitsee oman turvallisuusasiakirjansa.
- **Aito valvonta:** KYA-S1 takaa ihmisjohtajan sitomisen agenttiin (IDV), ajonaikaisen rajoituksen (REG/BHM) ja viiveettömän hätäjarrun (TC4).
- **Ei itsearviointia (§3):** Todisteeksi hyväksytään vain riippumattoman arvioijan allekirjoitus tai kryptografinen telemetria.
- **AL-varmuustasot:** AL1, AL2 ja AL3 määrittelevät vaadittavan reagointinopeuden 15 minuutista aina 60 sekuntiin.

## Katso sarjan muut osat

- **Osa 1:** Tunne agenttisi (KYA-S1) — Yksi allekirjoitettu sivu tekoälystä, joka koskee dataasi
- **Osa 2:** KYC:n vastine tekoälylle — Seitsemän kriittistä KYA-kysymystä
- **Osa 3:** EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita
- **Osa 4:** Agenttiluokat: Kehittäjän GitHub Copilot vs. teollisuuden DWS IQ -tausta-agentit
- **Osa 5:** KYA-S1 ja BPMN 2.0: Miten tekoälyagentin luottamustaso ohjaa teollisuusprosessia käytännössä?
- **Osa 6:** KYA-S1 v1.3 × BPMN 2.0: Atominen Lease Token, fail-closed ja rehellinen TRS-laskenta
- **Osa 7:** Kun jotain menee pieleen: 72 tunnin virheluokittelu (FLT) ja päätöksen toistaminen (PRV) käytännössä
- **Osa 8:** KYA-S1 Ekosysteemi & Tuotanto-Roadmap
- **Osa 9:** Lifetime World Model (LWM) — Globaali tilarekisteri ja muisti
- **Osa 10:** Agentic Commerce -protokollat & Autonomiset Maksut
- **Osa 11:** Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0

---

Risto Anton Päärni

Perustaja & toimitusjohtaja, Lifetime Oy

Päätoimittaja, Lifetime Scope Journal
