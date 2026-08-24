# Field note — organisaation hankintakansio, kerrosmalli ostajalle

**Date:** 2026-08-09
**Branch:** `claude/organisaation-hankintakansio-57efio`
**Commit:** `6d17f2f` (v1.0), + v1.1 tässä sessiossa

## Mitä tehtiin

Sessioon tuli syötteenä pelkkä ASCII-taulukko "ORGANISAATION HANKINTAKANSIO" ilman verbiä — kuusi kerrosta, alimpana `KYA-S1 v1.3 (IDV, BHM, REG, TC4, FLT, TRS, PRV)`. Taulukko on suomenkielinen tiivistys siitä, mikä `Legal/KYA_S1_v1.3.md` §7:ssä on englanniksi ja ostajan sijaan spesifikaation näkökulmasta.

Deliverable: `Legal/KYA_S1_HANKINTAKANSIO_FI.md` v1.0 — suomenkielinen ostajanäkymä. Taulukko sellaisenaan, per-kerros "mitä todistaa / mitä jättää auki", seitsemän kontrollialuetta hankintakysymyksinä, kolmen kohdan pyyntölista (taso + arvioijan nimi + arviointipäivä) ja kaksi rajausta.

## Miksi uusi dokumentti eikä lisäys spesifikaatioon

`Legal/KYA_S1_v1.3.md` on englanninkielinen, toimittajalle suunnattu ja luonnos avoimessa kommenttikaudessa. Ostajan suomenkielinen hankintaohje on eri lukija ja eri elinkaari — spesifikaation §7:ään lisättynä se olisi pakottanut versiokorotuksen kesken kommenttikauden ja sekoittanut kaksi yleisöä. Kanoninen lähde pysyy §7:ssä; uusi dokumentti viittaa siihen eikä toista normatiivisia väitteitä.

## Rajaukset, joita pidettiin

- **Ei keksittyjä lukuja.** Tier-SLA:t (15 min / 5 min / 60 s) siteerataan vain viittauksena §8:aan, ei toisteta ostajaohjeeseen normatiivisina.
- **Ei koskettu KYA-S1 v1.3:een.** Rule 3 (surgical) — cross-reference olisi vaatinut versiokorotuksen.
- **MA-S2 säilyy rakenteellisena inspiraationa**, ei yhteistyönä (v1.1:n editorial tone-down).

## HIC-katselmointi 10.08.2026

HIC luki artefaktin ja palautti sen merkinnällä **"10.8.2026. hyväksytty. HIC"**. Dokumentti on nyt v1.1, Publication Status APPROVED.

Toimitukselliset korjaukset, jotka HIC teki suoraan tekstiin ja jotka sovellettiin sellaisenaan:

- §2:n varauma alkaa "Huom." — se on varoitus, ei sivulause.
- Taulukon rivi `Alusta / Infrastruktuuri` isolla alkukirjaimella, ASCII-kaavion kanssa yhdenmukaisesti.
- Pilkku: "syntyvät vasta, kun toimija on autonominen agentti".
- §5:n kaksi rajausta numeroitu **1.** ja **2.** — otsikko lupasi kaksi, teksti ei näyttänyt niitä.
- §6 yhdistää kommenttikauden ja sen kalenteroinnin samaan lukuun.

**HIC poisti päätöslistalta vaihtoehdon "onelifetime.world-sivulle".** Julkista sivua ei tehdä. Jäljelle jäi kaksi: vain repoon, vai KYA-S1:n virallinen FI-liite (versiolukitus + EN-käännös). Tämä on yhä auki.

## Avoimet asiat

- **Sijoituspäätös** — repo-only vai virallinen FI-liite. Jälkimmäinen tuo mukanaan EN-käännöksen ja lukituksen KYA-S1:n versioon.
- Dokumentista ei ole EN-versiota. Jos ostajaohje halutaan muillekin markkinoille, käännöspohja on tämä tiedosto.

## Learning Outcome — kuusi askelta

1. **KB-päivitys** — N/A: kyseessä on olemassa olevan kanonin uudelleenjärjestely ostajanäkymäksi, ei uutta tietoa `kb/`:hen.
2. **Field note** — tämä tiedosto.
3. **Learn/-HTML** — N/A: `scripts/render-doc.sh` vaatii pandocin, jota ei ole asennettu tähän konttiin ("pandoc not installed"). Renderöitävä ympäristössä, jossa pandoc on.
4. **Drive-vienti** — tekemättä. Dokumentti on nyt APPROVED, joten alkuperäinen syy ("luonnos") ei enää päde; uusi syy on että vienti riippuu sijoituspäätöksestä — FI-liitteenä se viedään EN-käännöksen kanssa, repo-only-ohjeena yksin. Tehtävä heti kun päätös on tehty.
5. **HIC-kysymys** — alla.
6. **Kalenterointi** — tehty 10.08.2026 HIC:n luvalla ("2. kyllä"). Kaksi merkintää Google-kalenteriin:
   - **04.11.2026** — "KYA-S1 v1.3 — julkinen kommenttikausi SULKEUTUU tänään". Kuvauksessa lista tiedostoista ja sivuista, jotka vanhenevat samana päivänä.
   - **14.10.2026** — "Aloita KYA-S1 v1.4 -käsittely". Kolmen viikon etuaika, koska kommenttien läpikäynti, v1.4:n rajaus ja julkaistujen sivujen päivitys eivät mahdu sulkeutumispäivään.

   Etuajan pituus on arvio, ei mitattu luku. Jos v1.4:n valmistelu osoittautuu isommaksi, merkintää siirretään aikaisemmaksi.

## HIC-kysymys

Sijoituspäätös on yhä auki: meneekö ohje **(a)** vain repoon myyntimateriaalin lähteeksi, vai **(b)** KYA-S1:n viralliseksi FI-liitteeksi, jolloin se lukitaan spesifikaation versioon ja käännetään EN:ksi? HIC poisti kolmannen vaihtoehdon (julkinen sivu) 10.08.2026.
