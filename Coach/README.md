# Coach — koulutusmateriaalit asiakkaittain

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/finland-public-ai-strategy-t0goqg | Commit: pending | Date: 25.06.2026 | Changes: Coach-koulutuskansion rakenne, versiointikäytäntö ja tuote-/palvelutasomalli. Ensimmäinen asiakaskansio OP Financial Group; toinen esimerkki Nokia Defence eri tuoteversiolla.

Document Status:

- Created: 25.06.2026
- Last Modified: 25.06.2026
- Language: Suomi
- Languages Available: Suomi
- Publication Status: ACTIVE
- Document Type: Folder Guide

---

## Tarkoitus

`Coach/` sisältää **asiakaskohtaiset koulutusmateriaalit** (tarjoukset, sopimuspohjat,
agendat, materiaalit). Kanonisen opetussuunnitelman lähde on
`docs/coaching/CLAUDE_CODE_COACHING_CURRICULUM_FI_v1.0.md` — Coach-materiaalit **nostavat**
sisältöä siitä, eivät paranna sitä rinnalla.

## Rakenne

```
Coach/
  README.md                      ← tämä tiedosto
  _templates/                    ← parametroidut pohjat (älä forkkaa per asiakas)
    KOULUTUSTARJOUS_TEMPLATE_FI.md
  <Asiakas>/                     ← yksi kansio per asiakas
    KOULUTUSTARJOUS_<ASIAKAS>_FI_vX.Y.md
    Archive/                     ← vanhentuneet versiot (cron siirtää tänne)
```

## Versiointikäytäntö

- Tiedostonimi päättyy aina `_vX.Y` ennen päätettä, esim. `..._FI_v1.0.md`.
- Pienet muutokset nostavat `Y`:tä (v1.0 → v1.1), olennaiset uudistukset `X`:ää (v1.x → v2.0).
- Viikoittainen cron (`scripts/weekly/coach-learn-curate.sh`) pitää **uusimman version**
  kansion juuressa ja siirtää vanhemmat versiot kansioon `<Asiakas>/Archive/`. Mitään ei poisteta.
- Sama cron renderöi uusimmat Coach-materiaalit HTML:ksi `Learn/`-kansioon ja päivittää
  hakemistosivun `Learn/start.html`.

## Tuote- ja palvelutasot (huomioitava tarjouksessa ja sopimuksessa)

Coach voi kohdistua **eri asiakkaille tuotteen eri versioon**. Jokainen tarjous lukitsee neljä
kenttää koneluettavaan `COACH-META`-lohkoon (cron lukee ne hakemistosivulle):

| Kenttä          | Merkitys                               | Lähde / kanoni                                                              |
| --------------- | -------------------------------------- | --------------------------------------------------------------------------- |
| **Product**     | Tuoteversio, johon valmennus kohdistuu | `DWS_TRUTH_STANDARD.md` rivi 20 — esim. DWS IQ 6, DWS IQ 7                  |
| **ProductTier** | Tuotetaso                              | Aegis Standard · Aegis Defence · Aegis Sovereign (kanoni: TRUTH rivi 20)    |
| **ServiceTier** | Palvelutaso (valmennuksen laajuus)     | T1 Luento · T2 Työpaja · T3 Ohjelma · T4 Projekti (hinnat: `products.json`) |
| **Version**     | Tarjouksen oma versio                  | tämä tiedosto                                                               |

**Esimerkit (versiointi huomioitu):**

- **OP Financial Group** → Product: **DWS IQ 6**, ProductTier: **Aegis Standard** (EU-suvereeni,
  säännelty rahoitusala).
- **Nokia Defence** → Product: **DWS IQ 7**, ProductTier: **Aegis Defence** (dual-use / puolustus).
  **Huom. (29.07.2026):** tämä on esimerkkikansio, ei laskeutunut asiakkuus. Nokiaa ei saa nimetä
  Lifetime Oy:n puolustusalan vastapuoleksi missään materiaalissa, joka lähtee tämän
  vastapuolisuhteen ulkopuolelle — NDA kattaa neuvottelut ja kumppanuuden ja sisältää
  100 000 euron sopimussakon. Ulkoisissa viittauksissa käytetään muotoa "a defence-industry prime".
  Kanoninen lähde: `docs/TRACTION_CANONICAL.md`.

> Käyttäjän pikamuoto "DWS IQ Defence 7" vastaa kanonista nimeämistä **DWS IQ 7 + Aegis Defence
> -taso** (TRUTH rivi 20). Tarjouksissa käytetään kanonista muotoa.

## Palvelutasot (hinnat: `dws10.com/config/products.json`)

| Taso | Sisältö                         | SKU                             | Hinta (alv 0 %) |
| ---- | ------------------------------- | ------------------------------- | --------------- |
| T1   | 1 pv luento (≤12)               | `claude-code-coaching-lecture`  | 1 900 €         |
| T2   | 2 pv työpaja (≤10)              | `claude-code-coaching-workshop` | 4 500 €         |
| T3   | 3 pv ohjelma (luento + työpaja) | `claude-code-coaching-3day`     | 5 900 €         |
| T4   | Upotettu projekti (2–6 vk)      | `claude-code-coaching-project`  | alkaen 7 500 €  |
