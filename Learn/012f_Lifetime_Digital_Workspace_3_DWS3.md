# 012f Lifetime Digital Workspace 3 (DWS 3)

---

**VERSION AND AGENT HISTORY**

- **Document:** 012f Lifetime Digital Workspace 3 — Projektiasiakirja (DWS 3)
- **Document ID:** 012f
- **Languages Available:** FI
- **Version:** 0.1 (DRAFT — odottaa Drive-aineistoa)
- **Date:** 10.04.2026
- **Owner:** Risto Päärni, Lifetime Oy (Y-tunnus 0772407-9)
- **Agent:** Claude (Opus 4.6)
- **Branch:** claude/activate-dev-expenses-Cbb1q
- **Sessions & Modifications:**
  - 0.1 (10.04.2026, Claude Opus 4.6): Alkuperäinen luonnos. Sisältää vain käyttäjän suullisesti vahvistamat faktat (10.04.2026, Risto Päärni). Tarkat tunnit, kuukausierittely, AWS-laskut, EBAN-sopimuskirjeet ja koodirepojen tilannekuvat odottavat Google Drive -aineistoa (`private/dws3-5/dws3/`). EI SISÄLLÄ Gemini-AI:n hallusinoimia "Digital Watchdog Spectrum" / C++ media server / NAT traversal / Apple Silicon -mainintoja jotka olivat eri yhtiön tuotteita.
- **Document Status:** DRAFT — TARKISTETTAVA
- **Use Case:** Tuotekehitysmenojen aktivoinnin (KPL 5:8, IAS 38) lähdedokumentti DWS 3 -projektin osalta. Liite hallituksen päätökseen 31.12.2025 ja kirjanpitäjälle (Merja) toimitettavaan erittelyyn.

---

## 1. Projektin yleiskuvaus

**Nimi:** Lifetime Digital Workspace 3 (DWS 3)
**Alustaperhe:** Lifetime Digital Workspace -tuoteperheen kolmas sukupolvi
**Omistaja:** Lifetime Oy
**Vastuuhenkilö:** Risto Anton Päärni (founder, full-stack)
**Tila:** Legacy / korvattu (DWS 5 → DWS 6 -siirtymä, ks. `Learn/Oppimispäiväkirja.md`)
**Aktivointistatus:** Sisällytetään tuotekehitysmenojen aktivointiin (€594 000 -kokonaisuus, hallituksen päätös 31.12.2025)

## 2. Aikajakso

| Vaihe                   | Päivämäärä                                                      | Lähde                                       |
| :---------------------- | :-------------------------------------------------------------- | :------------------------------------------ |
| EBAN-krediitin myöntö   | TARKISTETTAVA (oletettu 2019 H2 / 2020 H1)                      | EBAN-sopimuskirje (Drive)                   |
| AWS-tilien käyttöönotto | TARKISTETTAVA                                                   | AWS Management Console -lokit, IAM-historia |
| DWS 3 -alustan kehitys  | ~2020 → 2023 (Q3)                                               | Drive-projektitiedostot, koodirepot         |
| DWS 3 → DWS 5 -siirtymä | 2024 Q1 (siirtymä; Microsoft Founders Hub -jäsenyys alkanut 2021, 2021–2024) | `Learn/Oppimispäiväkirja.md` (vahvistettu)  |
| DWS 3 -hosting alasajo  | TARKISTETTAVA                                                   | Viimeinen AWS-lasku                         |

> **Huom.** Tarkat päivämäärät täydennetään Drive-aineistosta. Ne on jätetty TBD-tilaan koska CLAUDE.md "Validated Mock Data Rule" kieltää keksittyjen päivämäärien kirjaamisen aktivointia tukevaan dokumenttiin.

## 3. Rahoitus ja resurssit

| Resurssi                 | Määrä         | Lähde                               |
| :----------------------- | :------------ | :---------------------------------- |
| EBAN AWS-krediitit       | **5 000 €**   | Käyttäjän vahvistus 10.04.2026 (RA) |
| AWS-laskutus omasta      | TARKISTETTAVA | AWS Cost Explorer / kuukausilaskut  |
| Henkilöresurssi          | RA (founder)  | Käyttäjän vahvistus 10.04.2026      |
| Mahdolliset alihankkijat | TARKISTETTAVA | Ostolaskut, sopimukset              |

> **Taustatieto (ei vielä lähdevarmennettu):** EBANista ja AWS-krediittiohjelmien tyypillisistä tasoista voidaan lisätä yleiskuvaus myöhemmin lähdeviitteiden kanssa. Tämä taustahuomio ei ole osa tämän luonnoksen käyttäjän vahvistamaa todistusaineistoa.

## 4. Tekninen sisältö (käyttäjän vahvistuksen mukaan)

Käyttäjän suullinen kuvaus 10.04.2026:

> "Sain EBANilta 5000 eurolla crediittejä ja ryhdyin tekemään dws3 aws:n päälle. Tämä vaihe sisälsi aws palveluiden käynnistymistä ym."

Tästä tunnistettavissa olevat työpaketit (kategoriat, jotka aktivointierittelyssä jaetaan tunneiksi kun lähde on saatavilla):

| WP  | Kategoria                                                             | Status        |
| :-- | :-------------------------------------------------------------------- | :------------ |
| WP1 | AWS-tilien ja IAM-ympäristön käyttöönotto                             | TARKISTETTAVA |
| WP2 | DWS 3 -alustan arkkitehtuurisuunnittelu                               | TARKISTETTAVA |
| WP3 | AWS-palveluiden integrointi (S3, EC2, RDS, IAM ym.)                   | TARKISTETTAVA |
| WP4 | Käyttäjähallinta ja autentikaatio                                     | TARKISTETTAVA |
| WP5 | Datatallennus ja tietokannat                                          | TARKISTETTAVA |
| WP6 | Mahdollinen migraatio aiemmasta Lifetime Mobile -ympäristöstä (Azure) | TARKISTETTAVA |
| WP7 | Tuotedokumentointi ja käyttöönotto-ohjeet                             | TARKISTETTAVA |

> **Tärkeää:** Yllä olevat työpaketit perustuvat YLEISIIN AWS-projektin elinkaarivaiheisiin, eivät DWS 3 -projektin spesifeihin tehtäviin. Käytetään vain otsikkotason työpaketteina kunnes Drive-aineisto vahvistaa tai korjaa ne. Tunteja EI ole vielä jaettu.

## 5. Suhde myöhempiin Lifetime DWS -versioihin

| Versio    | Aikajakso       | Tekninen alusta                                                        | Status                                      |
| :-------- | :-------------- | :--------------------------------------------------------------------- | :------------------------------------------ |
| **DWS 3** | ~2020 → 2023 Q3 | AWS (S3, EC2, ym.)                                                     | **Tämä asiakirja**                          |
| DWS 4     | TARKISTETTAVA   | TARKISTETTAVA (siirtymä DWS 3 → DWS 5 voi olla suora)                  | Tarvitaan oma asiakirja                     |
| DWS 5     | 2024 (1 vuosi)  | Oqtane / .NET 8 Blazor / Azure Container Apps + Microsoft Founders Hub | Vahvistettu — `Learn/Oppimispäiväkirja.md`  |
| DWS 6     | 2025 → nyt      | React 19 / Vite / Supabase / Cloudflare / Google Cloud Run             | Vahvistettu — `CLAUDE.md`, koko `dws6`-repo |

**Jatkuvuusnarratiivi (aktivointia varten):** DWS 3:n AWS-perustyö muodostaa Lifetime Oy:n pilvi-natiivin tuotekehityksen perustan. Vaikka koodipohja on korvattu (DWS 3 AWS → DWS 5 Azure → DWS 6 GCP/Cloudflare), arkkitehtoniset opit, tietomallit ja tuotekonseptit ovat siirtyneet eteenpäin ja ovat osa DWS 6:n aineetonta pääomaa. Tämä on vakiintunut KPL 5:8 -tulkinta sukupolvelta toiselle siirtyvälle tuotekehitykselle.

## 6. Aktivointiperuste (alustava)

Tämä projekti on osa €594 000 -kokonaisuutta, jonka Lifetime Oy:n hallitus päätti aktivoida 31.12.2025 (KPL 5:8 + IAS 38 mukaisesti).

| Kenttä                      | Arvo                                                              |
| :-------------------------- | :---------------------------------------------------------------- |
| Aktivointiperuste           | KPL 5:8 (Kirjanpitolaki, kehittämismenot)                         |
| IFRS-vastine                | IAS 38 (Aineettomat hyödykkeet)                                   |
| Hallituksen päätös          | 31.12.2025 (Lifetime Oy)                                          |
| Tuntihinta (laskennallinen) | 100 €/h (markkinatason mediaani 80–120 €/h, senior dev Helsinki)  |
| DWS 3 -osuuden tunnit       | TBD (täydennetään Drive-aineistosta)                              |
| DWS 3 -osuuden arvo         | TBD                                                               |
| Lemonsoft-tiliöinti         | Debet 1030 Kehittämismenot · Kredit 3950 Valmistus omaan käyttöön |

## 7. Lähdeaineiston tarkistuslista

Kun Google Drive -pääsy saadaan (ks. `Learn/`-kansio: erilliset Drive-kytkentäohjeet), tarkistettavat artefaktit:

- [ ] EBAN-sopimuskirje (krediitin myöntämispäivä, ehdot, summa)
- [ ] AWS Activate -hakemus ja hyväksyntä
- [ ] AWS Cost Explorer -lokit 2019–2023 (todelliset käyttömäärät)
- [ ] AWS IAM-historia (tilien luontipäivät)
- [ ] DWS 3 -koodirepot (jos GitHub/GitLab/Bitbucket)
- [ ] Projektisuunnitelmat ja arkkitehtuuriasiakirjat
- [ ] Sähköpostiketjut tuotekehityksestä 2019–2023
- [ ] Mahdolliset asiakaskeskustelut, demot, pilottisopimukset
- [ ] Lifetime Oy:n tasekirjat 2019–2023 (kirjanpitoon viedyt menot)

## 8. Avoimet kysymykset (käyttäjälle)

1. **DWS 3 -projektin tarkka aloituspäivä** — onko se "AWS-tilin avaaminen" vai "EBAN-sopimuksen allekirjoitus"? Aktivointi alkaa siitä päivästä, kun työ täyttää KPL 5:8 -kriteerit (tekninen toteutettavuus + aikomus loppuun saattaa).
2. **DWS 4 — oliko olemassa erillistä DWS 4 -versiota** vai oliko siirtymä DWS 3 → DWS 5 suora? Jos DWS 4 oli, siitä tarvitaan oma asiakirja `012g_Lifetime_Digital_Workspace_4_DWS4.md`.
3. **Muut tekijät DWS 3 -aikakaudelta** — oliko muita kehittäjiä tai konsultteja kuin RA?
4. **DWS 3:n alasajo / käytöstä poisto** — milloin viimeinen AWS-lasku? Tämä on tärkeä myös taseelle (mahdollinen impairment-arviointi).

---

**Allekirjoitus:**
Risto Anton Päärni, CEO, Lifetime Oy
Päivämäärä: ****\_\_****

**Hyväksyntä (kirjanpitäjä):**
Merja ****\_\_****
Päivämäärä: ****\_\_****
