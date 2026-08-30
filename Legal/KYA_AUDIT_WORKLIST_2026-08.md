# KYA-sarjan auditlista — korjattavat tiedostot

**Tarkoitus:** Kaikki tiedostot, joihin KYA-S1 -blogisarjan (osat 5–11) katselmus tuotti korjausvelan. Tarkoitettu ulkoiseen auditointiin (Gemini) — jokainen rivi on tarkistettavissa nimetystä tiedostosta.
**Lähde:** `Legal/KYA_S1_REVIEW_v1.3_PROPOSAL.md` Osa A (vendor-standardi) + Osa B (sisäiset standardit ja koodi).
**Tila:** Osa A on toteutettu (`Legal/KYA_S1_v1.3.md`). Osa B:stä on toteutettu **P0-1, P0-2 ja P0-3** (08.08.2026) — kaikki P0-esteet poistettu. P1–P3 ovat tekemättä.

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/agent-use-cases-comparison-h7vl25 | Date: 08.08.2026 | Changes: Ensimmäinen versio — koottu auditlista KYA-sarjan katselmuksen tuottamasta korjausvelasta. 12 tiedostoa, 16 työkohtaa, prioriteetti ja hyväksymiskriteeri per kohta.

Session Links & References:

- Claude Code (claude/agent-use-cases-comparison-h7vl25): https://github.com/blogtheristo/dws6/commits/claude/agent-use-cases-comparison-h7vl25
- PR: https://github.com/blogtheristo/dws6/pull/1808

Document Status:

- Created: 08.08.2026
- Last Modified: 08.08.2026
- Language: Finnish
- Publication Status: DRAFT — INTERNAL
- Classification: INTERNAL — STANDARDS REVIEW
- Document Type: Auditlista / korjausvelka

***

## 0. Yhteenveto

| Prioriteetti  | Kohteita | Kuvaus                                                                 |
| ------------- | -------- | ---------------------------------------------------------------------- |
| **P0 (esto)** | 3 (kaikki korjattu)        | Estävät KYA-S1-attestaation. Standardi väittää jotain mitä ei tapahdu. |
| **P1**        | 5        | Turvallisuus- tai auditointiaukko, ei vielä julkinen väärä väite.      |
| **P2**        | 5        | Dokumenttivelka, ristiriitainen kanoni, versiotunnisteet.              |
| **P3**        | 3        | Blogisarjan sisäinen johdonmukaisuus ennen julkaisua.                  |

**Kriittisin havainto:** `KYA_S1.md` §9 väitti, että DWS:n referenssitoteutus tarjoaa TRS-kontrollin. `src/identity/ats-engine.ts` ei toteuttanut yhtään TRS-1:n neljästä vaaditusta syötteestä. Korjattu v1.3:ssa julkaisemalla conformance-note, ja **IDV-jäsen on nyt toteutettu koodissa** (P0-1, 08.08.2026). Kolme neljästä syötteestä puuttuu yhä, joten TRS-1 ei ole täytetty eikä tieriä väitetä.

***

## 1. P0 — Estävät kohdat

### P0-1 · `src/identity/ats-engine.ts` — IDV-tila puuttuu luottamuspisteestä ✅ KORJATTU 08.08.2026

**Havainto (B1).** KYA-S1 TRS-1 vaatii dokumentoidut syötteet: _IDV state, behavioral baseline distance, red-team posture, capability manifest scope_. Toteutettu kaava on `ATS_Base = max(0, 1.0 − V×0.25 − L − D×0.05)`. Neljästä vaaditusta syötteestä **yksikään ei esiinny**.

**Seuraus.** Ihmisen todennuksen peruutus **ei liikuta luottamuspistettä lainkaan**. §4:n Artikla 14 -kytkentä IDV:n ja TRS:n välillä ei ole olemassa toteutuksessa. Koko wallet-ankkurointi (Osa 11) rakentuu sen varaan, että IDV-tilan muutos katkaisee ketjun — nyt se ei katkea, se vain näyttää katkeavan kaaviossa.

**Korjaus.** IDV-tila hard kill -syötteeksi, olemassa olevan manifest-TTL-tarkistuksen rinnalle (`calculateATS()`, rivit ~70–86). Behavioral baseline distance pisteytetyksi syötteeksi.

**Hyväksymiskriteeri.** Testi, jossa IDV-peruutus voimassa olevalla manifestilla tuottaa ATS = 0.

**TOTEUTETTU 08.08.2026.** `IdvState`-tyyppi (`src/identity/types.ts`), IDV hard kill `calculateATS()`:ssä manifest-tarkistuksen rinnalla, `ATSBreakdown` laajennettu kentillä `idvValid` / `idvStatus` / `humanPrincipalId`. `idv` on **pakollinen parametri**, ei valinnainen — valinnainen parametri antaisi kutsujan hiljaa ohittaa juuri sen kontrollin jota varten syöte on olemassa (TRS-5). `unknown`-tila, vanhentunut attestaatio, virheellinen aikaleima ja TTL ≤ 0 kaatuvat kaikki kiinni. Vanhentuminen raportoidaan `expired`-tilana erillään `revoked`:sta, koska IDV-3 ja IDV-4 vaativat eri operaattoritoimen. Testit: `src/__tests__/ats-idv-gate.test.ts`, 8/8 läpi; `mandate-gate` + `verified-done-attestation` 27/27 ennallaan.

**YHÄ AUKI tässä kohdassa:** behavioral baseline distance, red-team posture ja capability manifest **scope** puuttuvat edelleen TRS-1:n syötteistä. Manifestin *voimassaolo* tarkistetaan, sen *laajuus* ei vaikuta pisteeseen. TRS-1 ei siis ole vielä täytetty — vain sen IDV-jäsen.

### P0-2 · `Legal/KYA_STANDARD_v1.md` §3.1 — kanonisessa tiedostossa turvattomaksi todettu kaava ✅ KORJATTU 08.08.2026

**Havainto (B3).** Tiedosto määrittelee `ATS = max(0, 1.0 − V×0.25 − L − D×0.05 + A×0.15)` (additiivinen A). Sen omat sisardokumentit — `KYA_SECURITY_v1.2.md` §3.1 ja `KYA_OPTIMIZATION_v1.4.md` §185 — toteavat molemmat nimenomaisesti, että **additiivinen muoto oli score-inflaatiovektori** ja se korvattiin siksi: agentti saattoi olla "optimaalinen mutta vuotava" ja silti pitää korkean pisteen.

**Seuraus.** Resolverin kautta tähän tiedostoon päätyvä toteuttaja rakentaa tunnetusti turvattoman version.

**Korjaus.** Korvaa multiplikatiivisella `ATS_Final = ATS_Base × (1 + A)`, A = 0 kun V > 0. **Rule 12: älä poista vanhaa muotoilua** — merkitse superseded, päivämäärä ja syy.

**Hyväksymiskriteeri.** Yksi kaava, yksi A-kerroin, kaikissa neljässä dokumentissa sama.

**TOTEUTETTU 08.08.2026.** Kanoniseksi valittiin `KYA_OPTIMIZATION_v1.4.md` §3.1 (kehittynein muoto, sisältää V>0-hard stopin ja validointiportit): `ATS_Base = max(0, 1.0 − V×0.25 − L − D×0.05)`, `ATS_Final = ATS_Base × (1 + A)`, A ∈ [0, 0.25], A = 0 kun V > 0. `KYA_STANDARD_v1.md` §3.1 korvattu; vanhat muotoilut säilytetty uudessa §3.1.2:ssa syineen ja päivämäärineen (Rule 12). `KYA_SECURITY_v1.2.md` §3.1 täydennetty A:n katolla. `KYA_OPTIMIZATION_v1.4.md` §3.1 merkitty kanoniseksi. Historiallinen v1.1→v1.4 -muutostaulukko (§1) jätettiin ennalleen ja sen alle lisättiin osoitin §3.1.2:een. Versiot: STANDARD 1.11→1.12, SECURITY 1.8→1.9, OPTIMIZATION 1.9→1.10.

### P0-3 · A-kertoimen neljä eri arvoa ✅ KORJATTU 08.08.2026

**Havainto (B3).** Sama kerroin esiintyy neljänä eri lukuna, ja koodissa viidentenä (ei lainkaan):

| Lähde                               | Muoto                            | Kerroin            |
| ----------------------------------- | -------------------------------- | ------------------ |
| `KYA_STANDARD_v1.md` §3.1           | additiivinen                     | 0.15               |
| `KYA_OPTIMIZATION_v1.4.md` §185     | additiivinen (viitattu menneenä) | 0.18               |
| `KYA_OPTIMIZATION_v1.4.md` historia | "corrected to A×0.25"            | 0.25               |
| `KYA_SECURITY_v1.2.md` §3.1         | `ATS_Base × (1 + A)`             | multiplikatiivinen |
| `src/identity/ats-engine.ts`        | ei A-termiä lainkaan             | —                  |

**Korjaus.** Valitse yksi arvo, kirjaa se kerran, viittaa muualta. Päätä lisäksi: toteutetaanko A koodiin vai dokumentoidaanko että security-baseline ei sisällä sitä. Koodin kommentti rivillä 16 viittaa §3:een, joka kuvaa laajennusta jota koodissa ei ole.

**TOTEUTETTU 08.08.2026 — ja tämän kohdan kehystys oli osin väärä.** 0.15 ja 0.18 olivat **kertoimia** additiivisessa muodossa; 0.25 on **katto A:lle** multiplikatiivisessa muodossa. Ne eivät siis olleet neljä kilpailevaa arvoa samalle suureelle, vaan kahden eri kaavamuodon parametreja — plus yksi epätarkka sanamuoto. Kaikissa kolmessa dokumentissa lukee nyt yksiselitteisesti "A ∈ [0, 0.25], 0.25 on katto ei kerroin". `KYA_OPTIMIZATION_v1.4.md`:n oma historiarivi "corrected to A×0.25" merkittiin epätarkaksi paikallaan, alkuperäinen sanamuoto säilyttäen.

**Koodipäätös: A ei tule koodiin.** `src/identity/ats-engine.ts` laskee `ATS_Base`:n vain, ja tämä on nyt dokumentoitu tarkoitukselliseksi kaikissa kolmessa standardissa: turvallisuuspisteytys ei saa olla optimointisuorituksella inflatoitavissa, joten A jää autoresearch-orkestraattorikerrokselle. Koodin `@see`-kommentti korjattu vastaamaan.

***

## 2. P1 — Turvallisuus- ja auditointiaukot

### P1-1 · `src/identity/ats-engine.ts` — latenssi pisteytetään epäluotettavuutena

**Havainto (B2).** `L = 0.10 if avg_latency > 500 ms` sijoittaa **suorituskykymittarin luottamuspisteen sisään**. Ruuhkainen verkko tai kylmäkäynnistys laskee agentin luottamusta ja voi työntää sen oikeusrajan yli. Agentti ei ole tehnyt mitään epäluotettavaa.

Tämä on väärinpäin täsmällisellä tavalla: infrastruktuurin heikentyminen kuuluu reitittää ihmiselle (fail-closed, TRS-5), ei hiljaa muuttaa auktorisointiarvoa. Hitaus ja epälojaalius eivät ole sama signaali eivätkä saa jakaa kanavaa.

**Korjaus.** Poista L ATS:stä. Seuraa latenssia omana SLA-mittarinaan.

### P1-2 · V:llä ei ole aikaikkunaa, vaimennusta eikä rehabilitaatiota

**Havainto (B5).** `V` on `KYA_VIOLATION`-tapahtumien lukumäärä siinä `telemetry`-taulukossa jonka kutsuja sattuu antamaan.

1. **Ikkuna on kutsujan valinta eikä dokumentoitu.** Sessiokohtainen telemetria → V per sessio; 12 kuukautta → agentti pysyvästi jäässä.
2. **Ei vaimennusta.** "4 rikkomusta = nolla luottamus" ilman puoliintumisaikaa tarkoittaa monotonisesti palautumatonta luottamusta.
3. **Ei rehabilitaatiopolkua.** Mikään ei kerro, miten ATS = 0 -agentti palaa käyttöön tai kuka sen valtuuttaa.

**Korjaus.** Määrittele arviointi-ikkuna standardissa, lisää dokumentoitu puoliintumisaika, määrittele ihmisen valtuuttama rehabilitaatiomenettely. Kaikki kolme ovat edellytyksiä TRS-1:n "documented inputs" -väitteelle.

### P1-3 · Yksi globaali oikeusporras kaikille teoille

**Havainto (B6).** ATS-kynnykset (`≥0.80` täysi, `0.50–0.79` rajoitettu, `<0.50` keskeytetty) muodostavat **yhden portaan kaikille teoille**. Raportin lukeminen ja tuotantolinjan pysäytys ylittävät saman riman 0.80:ssa.

**Huomio:** kuvio on jo olemassa — `MANDATE_FLOOR_ATS = 0.5` / `PAYMENT_BAND_ATS = 0.8` / `HNP_FLOOR_ATS = 0.9` (`ats-engine.ts:174–180`) toteuttaa sen agentic commerce -mandaateille. Sitä ei vain ole yleistetty työkalukutsuihin ja fyysiseen ohjaukseen.

**Korjaus.** Yleistä mandate band -kuvio seurausluokaksi kyvykkyysmanifestiin (§9.1), jolloin manifesti ilmoittaa kunkin kyvykkyyden riman.

### P1-4 · `Legal/KYA_SECURITY_v1.2.md` §11.5 — policy-bypass pisteytetään, ei estetä

**Havainto (B7).** Rivi kuuluu: _Policy `deny` decision in production (policy engine bypassed) → V += 5 (−1.00) and agent quarantine._ Sulkulauseke myöntää, että policy-moottori **voidaan ohittaa**, ja vastaa siihen jälkikäteisellä sakolla.

KYA-S1 REG-2 vaatii päinvastaista: _capabilities outside the manifest must be denied at runtime, not merely audited._

**Korjaus.** Joko sulje bypass-polku ajonaikaisesti, tai totea §11.3:ssa selvästi mikä valvonta on ehkäisevää ja mikä havaitsevaa — ja lakkaa väittämästä REG-2:ta havaitsevalle osalle.

### P1-5 · `Legal/KYA_SECURITY_v1.2.md` §11.3 — escalate-timeoutin käytös määrittelemättä

**Havainto (B8).** `escalate` → "Pending, 24h SLA for human decision". Mitä tapahtuu tunnilla 25, ei ole määritelty. Tämä on TRS-5:n fail-closed-aukko policy-kerroksessa.

**Korjaus.** Määrittele vanheneminen kielloksi (expiry-to-deny) ilmoituksen kera.

***

## 3. P2 — Dokumenttivelka ja kanonin ristiriidat

### P2-1 · Manifest-TTL hard kill on olemassa vain koodissa

**Havainto (B4).** `calculateATS()` aloittaa hard killillä, jota ei ole missään standardin kaavassa:

```ts
const manifestExpired =
  Date.now() > new Date(manifest.signedAt).getTime() + manifest.ttlSeconds * 1000;
if (!manifest.signature.verified || manifestExpired) return buildResult(0.0, ...);
```

Tämä on **hyvä** — se on allekirjoitettu, aikaan sidottu auktorisointiprimitiivi, eli lähin olemassa oleva vastine TRS-4:n Lease Tokenille. Se on myös näkymätön kolmessa standardissa.

Kontrollia, joka on vain koodissa, ei voi attestoida: §3 vaatii arkkitehtuuridokumentaatiota tai telemetriaa, eikä kumpikaan kuvaa mekanismia jota mikään dokumentti ei nimeä.

**Korjaus.** Dokumentoi kaikkiin kolmeen standardiin. Rakenna TRS-4 tämän päälle.

### P2-2 · `DWS_TRUTH_STANDARD.md` rivi 20 — LWM-termi kahdessa merkityksessä

**Havainto.** Rivi 20 määrittelee Lifetime World Model (LWM) -termin **toimialakohtaiseksi, yrityskohtaisesti hienosäädetyksi mallipohjaksi**. Blogiluonnos `lifetime-world-model-ja-teollisuuden-prosessimallit.md` käyttää samaa termiä **reaaliaikaisena tila- ja luottamusrekisterinä** (IDV/TRS/PRV-selkäranka). Nämä ovat eri asioita.

**Korjaus (valitse).** (a) eri nimi hallintakerrokselle, tai (b) rivin 20 kanoninen määritelmä laajennetaan kattamaan molemmat kerrokset. **Älä julkaise blogia ennen valintaa.**

### P2-3 · Versiotunnisteet ristiriitaisia

**Havainto (B9).**

- `KYA_STANDARD_v1.md`: tiedostonimi `v1`, otsikko **v1.5**, §3 **v1.4**, §14 **v1.11**, §14.7 **v1.10**.
- `KYA_OPTIMIZATION_v1.4.md`: tiedostonimi ja historia **v1.4**, mutta §185 selittää muutosta "(v1.6)".

Auditoija ei voi viitata kontrolliin versiolla, kun dokumentti on eri mieltä itsensä kanssa.

**Korjaus.** Yksi sovitusajo `DWS_DOCUMENT_STANDARD.md`:n mukaan.

### P2-4 · `Legal/KYA_S1.md` §9 — vanha versio kantaa yhä katettamattoman väitteen

**Havainto.** v1.2 väittää §9:ssä referenssitoteutuksen tarjoavan "TRS — Agent Trust Score engine" ilman varausta. Korjaus tehtiin `Legal/KYA_S1_v1.3.md`:hen; **v1.2 on yhä repossa ja yhä julkinen**.

**Korjaus.** Päätä: korvaako v1.3 v1.2:n samassa tiedostossa vai jäävätkö molemmat rinnakkain. Jos rinnakkain, v1.2:een on merkittävä superseded-viite.

### P2-5 · Linter muuntaa `***` → `---` VERSION AND AGENT HISTORY -lohkossa

**Havainto.** CLAUDE.md Markdown Delimiter Rule vaatii `***` (Pandoc-yhteensopivuus). PostToolUse-formatoija muunsi sen `---`:ksi kahdessa uudessa dokumentissa. Korjattu käsin, mutta **se toistuu jokaisella kirjoituksella**.

**Korjaus.** Poikkeus formatoijan konfiguraatioon tai jälkitarkistus hookiin. Käsin korjaaminen ei ole korjaus.

***

## 4. P3 — Blogisarjan johdonmukaisuus ennen julkaisua

### P3-1 · Sarjan numerointi kesken

Osat 5, 6, 7 kantavat `series: "… n/7"`. HIC:n suunnitelma osista 8–11 tekee kokonaismäärästä 11. Osa 11 on kirjoitettu (`eudi-wallet-eidas2-idv-ankkurointi.md`, merkitty 11/11), osat 8–10 puuttuvat.

Lisäksi osien 1–4 kartoitus on epäselvä: Osan 7 "Katso myös" -lista nimeää osat 1–3 KYA-johdantoteksteiksi, joita ei ole tässä repossa luonnoksina. Kolme luonnosta (`hic-hallintamalli`, `teollisuuden-prosessikuvaustavat`, `lifetime-world-model`) on numeroimatta.

**Korjaus.** Lukitse kartoitus 1–11 ennen ensimmäistäkään julkaisua.

### P3-2 · Osan 11 kolme varmentamatonta EU-väitettä

`eudi-wallet-eidas2-idv-ankkurointi.md` merkitsee frontmatterissa kolme väitettä tarkistettavaksi: EUDI-asetuksen takaraja ja nykytila, edustusattestaation normatiivinen tila, sekä peruutustiedon todellinen etenemisviive. Kolmas kantaa §5:n koko argumentin IDV-4:n Gold-tason yhteensopivuudesta.

**Korjaus.** Varmenna lähteestä. Nämä ovat julkisia väitteitä EU-sääntelystä.

### P3-3 · Seitsemän luonnosta odottaa HIC-hyväksyntää

Kaikki `docs/blog-drafts/` -tiedostot ovat `Status: DRAFT`. Non-Negotiable Rule 13: hyväksyntä on annettava **slug-kohtaisesti**, ei yleisenä "julkaise kaikki".

***

## 5. Tiedostohakemisto

| Tiedosto                         | Kohdat                       |
| -------------------------------- | ---------------------------- |
| `src/identity/ats-engine.ts`     | P0-1, P1-1, P1-2, P1-3       |
| `Legal/KYA_STANDARD_v1.md`       | P0-2, P0-3, P1-2, P2-1, P2-3 |
| `Legal/KYA_SECURITY_v1.2.md`     | P0-3, P1-1, P1-4, P1-5, P2-1 |
| `Legal/KYA_OPTIMIZATION_v1.4.md` | P0-3, P2-3                   |
| `Legal/KYA_S1.md` (v1.2)         | P2-4                         |
| `Legal/KYA_S1_v1.3.md`           | valmis — vertailukohta       |
| `DWS_TRUTH_STANDARD.md` rivi 20  | P2-2                         |
| `docs/blog-drafts/*.md` (7 kpl)  | P3-1, P3-2, P3-3             |
| `.claude/hooks/` (formatoija)    | P2-5                         |

***

## 6. Suositeltu järjestys

1. **P0-1** ensin. Kaikki muu KYA-työ nojaa siihen, että IDV-tilan muutos vaikuttaa johonkin.
2. **P0-2 ja P0-3** yhdessä — sama sovitusajo, sama commit.
3. **P1-1** on nopea ja poistaa väärän signaalin ennen kuin sen päälle rakennetaan.
4. **P2-1** ennen TRS-4:n toteutusta — primitiivi on olemassa, se pitää vain nimetä.
5. Loput vapaassa järjestyksessä. **P3 ennen mitään julkaisua.**
