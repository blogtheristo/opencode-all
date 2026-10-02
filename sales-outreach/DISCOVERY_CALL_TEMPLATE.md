<!--
VERSION AND AGENT HISTORY
Document: DISCOVERY_CALL_TEMPLATE.md
Version: 1.0
Last-Updated: 2026-09-28
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-sonnet-4-6)
Branch: claude/sales-outreach-2-7uro90
Purpose: Reusable discovery-call question template for DWS IQ 6 and Aegis sales motions.
         Three-question pattern derived from Kemira scoping (2026-09-28):
         (1) gap validation, (2) power mapping, (3) champion test.
         Vertical variants: construction, logistics, chemicals/manufacturing, public sector.
-->

# DWS IQ — Löytämiskutsun kysymyspatteristo

**Käyttötilanne:** Ensimmäinen tapaaminen tai puhelinkeskustelu ennen varsinaista demoa.
**Tavoite:** 3 vastausta → tiedät onko kauppa mahdollinen, kuka sen tekee, ja onko prosessi alkanut.
**Kesto mallirunkoon:** 20–30 min. Yksi patternijakso, ei myyntipuhetta.

---

## Patterniperiaate — miksi nämä kolme

Kolme kysymystä muodostaa ketjun: **kipu → omistaja → kampanjointi**.

| #      | Kysymys                                         | Mitä se paljastaa                                                     | Milloin esität                 |
| ------ | ----------------------------------------------- | --------------------------------------------------------------------- | ------------------------------ |
| **Q1** | Pyytävätkö asiakkaanne [X], ja saavatko he sen? | Onko kipua: ero "kysytään" ja "saadaan" välillä on myyntimahdollisuus | Heti kontekstin jälkeen        |
| **Q2** | Kenen päätettävissä se teillä olisi?            | Kuka on todellinen ostaja — usein ei se, jonka kanssa puhut           | Kun Q1-vastaus vahvistaa kivun |
| **Q3** | Tietääkö joku, että päätös on hänen?            | Onko sisäinen kampanjoija olemassa, vai oletko ensimmäinen            | Sulkeva kvalifiointikysymys    |

**Järjestys on pakollinen.** Q3 ilman Q1:n kipua kuulostaa manipulatiiviselta. Q2 ilman Q1:n vahvistusta on ennenaikainen.

---

## Kysymykset — skriptit

### Q1 — Kipuvalidointi

**Yleismuoto:**

> "Pyytävätkö teidän asiakkaanne [X], ja saavatko he sen?"

**[X] on konkreettinen datatuote tai raportti, ei abstrakti käsite.** Ei "vastuullisuusdataa" — vaan "erätason hiilijalanjälki", "projektikohtainen Scope 1 -päästöraportti", "reittikohtainen CO₂-kustannus".

**Seuranta Q1:n jälkeen (aina):**

> "Miten kauan yhden [X]-raportin tuottaminen teillä kestää?"

Tämä numero (tyypillisesti 20–80 tuntia/kk) on laskuperusta koko kaupalle.

---

### Q2 — Valtakartta

**Yleismuoto:**

> "Kenen päätettävissä se teillä olisi?"

**Tämä on ansakysymys hyvässä mielessä.** Kolme mahdollista vastausta:

| Vastaus                              | Mitä se tarkoittaa                         | Mitä teet                                  |
| ------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| "Minulla / meidän tiimillä"          | Kontakti omistaa päätöksen — paras vastaus | Jatka suoraan demoon                       |
| "Ei oikeastaan kenelläkään — hajoaa" | Päätöstä ei ole tehty, prosessia ei ole    | Tarjoa itsesi prosessin rakentajaksi       |
| Nimeää jonkun muun                   | Sinun pitää tavata tuo henkilö ennen demoa | Pyydä esittely: "Voisitko esitellä minut?" |

---

### Q3 — Kampanjoijatesti

**Yleismuoto:**

> "Tietääkö joku teillä, että tämä päätös on hänen?"

**Tämä on kvalifiointikysymys, ei myyntipuhe.** Kysy rauhallisesti, odota vastausta.

| Vastaus                   | Mitä se tarkoittaa                  | Aikajana                 |
| ------------------------- | ----------------------------------- | ------------------------ |
| "Ei" tai epäröinti        | Olet ensimmäinen — prosessia ei ole | 3–6 kk (rakennusaika)    |
| "Joo, [nimi] hoitaa tätä" | Arviointiprosessi on alkanut        | 4–8 vko (liiku nopeasti) |
| "Kyllä — minä"            | Kontakti itse kampanjoi             | Nopea kauppa mahdollinen |

---

## Toimialavariantit

### Rakentaminen (CSRD / EPBD)

**Q1:**

> "Pyytävätkö tilaajanne tai julkiset hankintayksiköt projektikohtaista CO₂-raporttia, ja pystyykö rakentamisyhtiönne toimittamaan sen?"

**[X] = projektikohtainen Scope 1/2 -päästöraportti**

Odotettu vastaus: "Kyllä kysytään, mutta teemme sen käsin — tai emme pysty lainkaan."

**Q2:**

> "Kenen päätettävissä se teillä olisi — onko se vastuullisuusjohtajan vai CDO:n vai liiketoimintajohdon asia?"

Odotettu vastaus: hajoaa näiden kolmen välille → asennettu ongelma.

**Q3:**

> "Tietääkö teidän vastuullisuusjohtajanne, että tämä on heidän päätöksensä tehdä — vai onko se vielä auki?"

---

### Logistiikka / kuljetukset (ETS2 / CSRD-laivasto)

**Q1:**

> "Pyytävätkö tavaranlähetysasiakkaanne tai viranomaiset reittikohtaisen hiilijalanjäljen toimituksille, ja pystyyttekö toimittamaan sen?"

**[X] = reittikohtainen tai lähetyskohtainen CO₂-luku**

Odotettu vastaus: "Jotkut pyytävät — meillä on arvio, ei oikeaa dataa."

**Q2:**

> "ETS2 alkaa 2027 — kenen budjettiin se dieselkustannus kuuluu teillä?"

Tämä ohjaa suoraan CFO:n tai COO:n luo.

**Q3:**

> "Onko teillä jo joku, joka evaluoi ETS2-mittaristoa, vai ei vielä?"

---

### Kemikaalit / prosessiteollisuus (PCF / CSRD Scope 3)

**Q1:**

> "Pyytävätkö asiakkaanne erätason hiilijalanjälkeä tuotteistanne, ja saavatko he sen?"

**[X] = erätason PCF (Product Carbon Footprint)**

Kemira-konteksti: PCF Guideline on olemassa (2025) — vastaus on "kyllä kysytään, toimitamme käsin/epäjohdonmukaisesti."

**Q2:**

> "Kenen päätettävissä se Kemiralla / teillä olisi — onko se vastuullisuuden, R&D:n vai kaupallisen puolen asia?"

Odotettu vastaus: hajoaa kaikkien kolmen välille.

**Q3:**

> "Tietääkö joku teillä, että tämä on heidän päätöksensä?"

---

### Julkinen sektori / hankintayksiköt (EPBD / GreenPublicProcurement)

**Q1:**

> "Vaativatko hankintayksiköt jo CO₂-raporttia palveluntuottajiltanne, ja pystyykö palveluntuottajanne toimittamaan sen?"

**[X] = EPBD-yhteensopiva energiasuorituskykyraportti tai Scope 1/2 -todistus**

**Q2:**

> "Kenen teillä pitäisi tehdä päätös siitä, mitä dataa hankintaehdoissa vaaditaan?"

**Q3:**

> "Onko hankintajohtajallanne tiedossa, että tämä muutos on tulossa?"

---

## Koko kutsurunko — 25 min

```
00:00–02:00  AVAUS
  "Kiitos ajasta. Halusin ennen kuin näytän mitään kysyä kolme
   kysymystä — vastauksesi määrittävät onko meillä mitään
   asiaa toisillemme."

02:00–10:00  Q1 — KIPUVALIDOINTI
  Esitä Q1. Kuuntele. Kysy seuranta: "Miten kauan kestää?"
  Kirjaa numero. Älä puhu tuotteesta vielä.

10:00–17:00  Q2 — VALTAKARTTA
  Esitä Q2. Kuuntele tarkasti. Jos nimeää jonkun muun:
  "Voisitko esitellä minut hänelle ennen seuraavaa tapaamista?"

17:00–22:00  Q3 — KAMPANJOIJATESTI
  Esitä Q3. Odota vastausta. Älä täytä hiljaisuutta.

22:00–25:00  SEURAAVA ASKEL
  Jos Q1 + Q2 + Q3 = kyllä/kyllä/kyllä → sovi demo.
  Jos Q2 = "ei kukaan omista" → tarjoa: "Voisin auttaa
   rakentamaan teille sisäisen perustelun — haluaisitko?"
  Jos Q3 = ei → "Ymmärrän. Miten te yleensä aloitatte
   tällaisen arviointiprosessin?"
```

---

## Vastausmatriisi — päätöspuu

```
Q1: Pyytävätkö asiakkaat? Saavatko he?
├── "Ei pyydä" → Ei kauppa nyt. Merkitse signaaliksi tulevaisuuteen.
├── "Pyytävät, saavat automaattisesti" → Ei kauppa. Kysele mikä järjestelmä.
└── "Pyytävät, ei saa / saa käsin" → KIPU VAHVISTETTU → jatka Q2:een.
        │
        Q2: Kenen päätös?
        ├── "Minun" → Nopea kauppa mahdollinen. Demo seuraavaksi.
        ├── "Hajoaa / ei kukaan" → Olet ensimmäinen. Tarjoa prosessin rakentamista.
        └── Nimeää jonkun → Vaadi esittely ennen demoa.
                │
                Q3: Tietääkö joku?
                ├── "Kyllä, [nimi]" → Arviointiprosessi alkanut. Liiku nopeasti.
                ├── "En tiedä" → Kartoita. Pyydä esittely.
                └── "Ei" → Olet ensimmäinen. Aikajana 3–6 kk. Aloita sisäinen case.
```

---

## Mitä EI tehdä

- **Älä myy Q1:n aikana.** Tuotteen esittely ennen kivun vahvistamista katkaisee luottamuksen.
- **Älä täytä Q3:n jälkeistä hiljaisuutta.** Ensimmäinen joka puhuu, häviää.
- **Älä kysy kaikkia kerralla** ("Onko teillä kipua, kuka päättää, ja onko kampanjoija olemassa?") — se kuulostaa lomakkeelta.
- **Älä esitä demoa ennen Q2:n vastausta.** Demo väärällä henkilöllä on viikon hukkaan.

---

## Tiedostoviitteet

| Tiedosto                                  | Käyttötilanne                                               |
| ----------------------------------------- | ----------------------------------------------------------- |
| `INTRO_MARIA_SEDERHOLM_KEMIRA.md`         | Kemira — PCF/Aegis, alkuperäinen konteksti tälle patterille |
| `sales-outreach/NORDIC_SALES_STRATEGY.md` | Pohjoismainen myyntistrategia, "Kapteeni/Viinitarha/Buffet" |
| `sales-outreach/signaalimyynti.md`        | Signaalipohjainen myynti, kontaktoinnin kynnys              |
| `LETTER_*.md` / `INTRO_*.md`              | Prospektikohtaiset viestit ja suunnitelmat                  |
