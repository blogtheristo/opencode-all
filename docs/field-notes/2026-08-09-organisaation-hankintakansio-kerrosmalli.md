# Field note — organisaation hankintakansio, kerrosmalli ostajalle

**Date:** 2026-08-09
**Branch:** `claude/organisaation-hankintakansio-57efio`
**Commit:** `6d17f2f`

## Mitä tehtiin

Sessioon tuli syötteenä pelkkä ASCII-taulukko "ORGANISAATION HANKINTAKANSIO" ilman verbiä — kuusi kerrosta, alimpana `KYA-S1 v1.3 (IDV, BHM, REG, TC4, FLT, TRS, PRV)`. Taulukko on suomenkielinen tiivistys siitä, mikä `Legal/KYA_S1_v1.3.md` §7:ssä on englanniksi ja ostajan sijaan spesifikaation näkökulmasta.

Deliverable: `Legal/KYA_S1_HANKINTAKANSIO_FI.md` v1.0 — suomenkielinen ostajanäkymä. Taulukko sellaisenaan, per-kerros "mitä todistaa / mitä jättää auki", seitsemän kontrollialuetta hankintakysymyksinä, kolmen kohdan pyyntölista (taso + arvioijan nimi + arviointipäivä) ja kaksi rajausta.

## Miksi uusi dokumentti eikä lisäys spesifikaatioon

`Legal/KYA_S1_v1.3.md` on englanninkielinen, toimittajalle suunnattu ja luonnos avoimessa kommenttikaudessa. Ostajan suomenkielinen hankintaohje on eri lukija ja eri elinkaari — spesifikaation §7:ään lisättynä se olisi pakottanut versiokorotuksen kesken kommenttikauden ja sekoittanut kaksi yleisöä. Kanoninen lähde pysyy §7:ssä; uusi dokumentti viittaa siihen eikä toista normatiivisia väitteitä.

## Rajaukset, joita pidettiin

- **Ei keksittyjä lukuja.** Tier-SLA:t (15 min / 5 min / 60 s) siteerataan vain viittauksena §8:aan, ei toisteta ostajaohjeeseen normatiivisina.
- **Ei koskettu KYA-S1 v1.3:een.** Rule 3 (surgical) — cross-reference olisi vaatinut versiokorotuksen.
- **MA-S2 säilyy rakenteellisena inspiraationa**, ei yhteistyönä (v1.1:n editorial tone-down).

## Avoimet asiat

- **04.11.2026 — KYA-S1:n kommenttikausi sulkeutuu.** Yhä kalenteroimatta (peritty edellisestä sessiosta, `docs/NEXT_SESSION_PROMPT_2026-08-08.md`). Tämä dokumentti viittaa päivään §6:ssa, joten sen sisältö vanhenee samana päivänä.
- Dokumentista ei ole EN-versiota. Jos ostajaohje halutaan muillekin markkinoille, käännöspohja on tämä tiedosto.

## Learning Outcome — kuusi askelta

1. **KB-päivitys** — N/A: kyseessä on olemassa olevan kanonin uudelleenjärjestely ostajanäkymäksi, ei uutta tietoa `kb/`:hen.
2. **Field note** — tämä tiedosto.
3. **Learn/-HTML** — N/A: `scripts/render-doc.sh` vaatii pandocin, jota ei ole asennettu tähän konttiin ("pandoc not installed"). Renderöitävä ympäristössä, jossa pandoc on.
4. **Drive-vienti** — N/A: dokumentti on luonnos (Publication Status: DRAFT), vienti tehdään kun HIC hyväksyy sisällön.
5. **HIC-kysymys** — alla.
6. **Kalenterointi** — 04.11.2026 kommenttikauden sulkeutuminen on yhä kalenteroimatta; tämä sessio ei tuottanut uusia päivämääriä.

## HIC-kysymys

Hankintakansio-ohje on nyt suomeksi ja ostajalle. Meneekö se **(a)** vain repoon myyntimateriaalin lähteeksi, **(b)** `onelifetime.world`-sivulle julkiseksi ostajan muistilistaksi, vai **(c)** KYA-S1:n viralliseksi FI-liitteeksi, jolloin se pitää lukita spesifikaation versioon ja kääntää myös EN:ksi?
