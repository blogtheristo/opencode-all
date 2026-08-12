# KYA-versioauditointi — 1.9x / v2 / KYA-S1: erot, käyttökohteet ja tuotteet

**Tarkoitus:** Yksi taulukko, joka kertoo mikä KYA-dokumentti on mikä, mihin kutakin käytetään, ja missä tuotteissa ne esiintyvät. Syntyi siitä, että tuotesivut siteerasivat versioita joita ei ole olemassa.

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 10.08.2026 | Changes: Ensimmäinen versio. Auditoi KYA-perheen versiot (KYA Standard -sarja, KYA-S1, NIST-sarja, v2-varaus), erot, käyttökohteet ja tuotekytkennät. Korjasi kolme tuotevirhettä: `dws10.com/products/themis.html` väitti "KYA Standard v1.7" (versiota ei ole olemassa) → v1.12; `dws10.com/products/aegis.html` liitti Firecracker MicroVM -eristyksen versioon v1.4 (optimointidokumentti, ei määrittele eristystä) → KYA Security v1.2; `src/identity/ats-engine.ts` ja `types.ts` siteerasivat kumottua tiedostoa `Legal/KYA_S1_v1.3.md` (DWS_TRUTH_STANDARD rivi 35: "do not cite it") → `Legal/KYA_S1.md`. Molemmat sivut korjattu myös `landing-pages/`-peilissä samassa muutoksessa (Dual Folder Sync).

Document Status:

- Created: 10.08.2026
- Language: Finnish
- Publication Status: INTERNAL
- Document Type: Versioauditointi / kanoninen kartta

***

## 1. Miksi versiot sekoittuvat — kaksi rinnakkaista numerointia

KYA-tiedostoissa on **kaksi toisistaan riippumatonta versionumeroa**, ja ne eivät ole samat (`docs/field-notes/2026-04-05-kya-version-number-conventions.md`):

| Raita | Missä | Mitä tarkoittaa |
| --- | --- | --- |
| **Otsikkoversio** | Rivi 1, esim. "KYA Standard **v1.12**" | Standardin sisältöversio — se, jota ulkoisesti siteerataan |
| **Sisäinen versio** | `Version:` VERSION AND AGENT HISTORY -lohkossa | Sessiojäljitys — nousee joka muokkauksella |
| **Tiedostonimi** | `KYA_SECURITY_v1.2.md` | Seuraa otsikkoversiota, ei sisäistä |

**Tästä syntyi kysymys "KYA 1.9x vai 2".** `Legal/KYA_STANDARD_v1.md` kulki pitkään sisäisessä versiossa **1.9.x** samalla kun sen otsikko oli v1.5 — nämä ovat eri raiteita, eivät kilpailevia versioita. Nyt tiedoston otsikko ja sisäinen versio ovat molemmat **1.12** (P0-korjausten jälkeen 08.08.2026).

***

## 2. Kanoninen kartta — mikä on mikä

| Tiedosto | Otsikkoversio | Sisäinen | Rooli | Omistaa (älä hae muualta) |
| --- | --- | --- | --- | --- |
| `Legal/KYA_STANDARD_v1.md` | **v1.12** | 1.12 | **Sisäinen toteutusmanuaali** — agenttiparvien itseoptimoinnin hallinta | ATS-alueet, luottamuspisteet, taloudelliset kertoimet, §14 agentic commerce -mandaattiportti, §14.2.1 tenant-profiilit |
| `Legal/KYA_SECURITY_v1.2.md` | v1.2 | 1.9 | **Identiteetti, eristys, forensiikka** | Firecracker MicroVM -eristys, §10 muistin audit trail, §11 systems inventory & policy gate |
| `Legal/KYA_OPTIMIZATION_v1.4.md` | v1.4 | 1.10 | **Taloudellinen arvo + itseoptimointi** | **Kanoninen ATS-kaava** (P0-2, 08.08.2026): `ATS_Base = max(0, 1 − V×0.25 − L − D×0.05)`, `ATS_Final = ATS_Base × (1 + A)`, A ∈ [0, 0.25] |
| `Legal/KYA_S1.md` | **v1.5** | 1.5 | **Ostajalle suunnattu attestaatiospesifikaatio** (ei "standardi") | 7 kontrollia IDV / BHM / REG / TC4 / FLT / TRS / PRV; varmuustasot **KYA-AL1 / AL2 / AL3** |
| `Legal/KYA_S1_v1.3.md` | v1.3 | 1.3 | **KUMOTTU** 09.08.2026 — säilytetty Sääntö 12:n nojalla | — **älä siteeraa** |
| `Legal/KYA_NIST_STANDARD_v1.md` + `_SECURITY_` + `_OPTIMIZATION_` | v1 | 1.0 | NIST-suuntaiset SP-001/002/003 -esitykset | US-viitekehyskartoitus |

### KYA v2 — mitä se on ja mitä se ei ole

**v2 ei ole julkaistu.** `KYA_STANDARD_v1.md` (sisäinen 1.9.1, 06.07.2026) varaa sen nimenomaisesti:

> "v2.0 is reserved for the schema freeze after the Supabase mandate-events migration and one end-to-end tenant profile exercise."

Sisällöllisesti v2 = **mandaatti- ja luottamuskerros**: mandaattiportti (toimiiko agentti myönnetyn mandaattinsa rajoissa) + yksityisyyttä säilyttävät "mandaatin sisäiset" todisteet post-kvanttipolulla. Tämä on EIC Accelerator -hakemuksen (WP2) kohde. **Ulkoisessa viestinnässä: "seuraava sukupolvi", ei "julkaistu".** JSON-skeemat ovat v2.0:aan asti havainnollistavia — ostajamateriaali lainaa politiikkasemantiikkaa, ei kenttänimiä; normatiivinen muoto on suoritettava Zod-validaattori.

***

## 3. Erot yhdellä rivillä

- **KYA Standard -sarja (v1.2 / v1.4 / v1.12)** = *miten me rakennamme sen*. Sisäinen, toteuttajalle. Pisteytys, kaavat, kynnykset.
- **KYA-S1 (v1.5)** = *mitä arvioija allekirjoittaa*. Ulkoinen, ostajan hankintakansioon SOC 2:n ja GDPR:n viereen. Kontrollit ja varmuustasot, ei pisteytyksen sisuskaluja.
- **KYA v2** = *seuraava kerros* (mandaatti + todisteet). Varattu, ei julkaistu.

**Kanoninen jako (DWS_TRUTH_STANDARD rivi 35):** älä lainaa KYA-S1:tä pisteytyksen sisäisiin asioihin äläkä manuaalia siihen mitä arvioija allekirjoittaa.

***

## 4. Käyttökohteet

| Tarve | Oikea lähde |
| --- | --- |
| ATS-kaava, kertoimet, kynnykset | `KYA_OPTIMIZATION_v1.4.md` §3.1 (kanoninen) |
| Agentin eristys, MicroVM, muistin audit trail | `KYA_SECURITY_v1.2.md` §10–§11 |
| Mandaattiportti, maksuvaltuutus, tenant-profiilit | `KYA_STANDARD_v1.md` §14 |
| Ostajan kysymys "mitä te attestoitte" | `KYA_S1.md` §5–§9 |
| Varmuustaso ostajalle | `KYA_S1.md` §8 — **KYA-AL1/AL2/AL3** |
| Hankintakansion rakenne suomeksi | `Legal/KYA_S1_HANKINTAKANSIO_FI.md` |

***

## 5. Tuotteet joissa KYA on mukana

| Tuote | Missä KYA näkyy | Tila 10.08.2026 |
| --- | --- | --- |
| **Themis** (`Store/PRODUCT_THEMIS.md`, `dws10.com/products/themis.html`) | Tuotteistettu KYA:n sovereign control plane: KYA Policy Proxy, muistin mutaatioattestaatio (KYA-S §10), systems inventory & policy gate (§11), Art. 12 -lokitus | ✅ **Korjattu** — sivu väitti "KYA Standard v1.7", jota ei ole olemassa → **v1.12** |
| **Aegis** (`Store/PRODUCT_AEGIS.md`, `dws10.com/products/aegis.html`) | Firecracker MicroVM -eristys per agentti; KYA-hallinta puolustus-/kaksikäyttöpinossa | ✅ **Korjattu** — eristys oli liitetty versioon "KYA v1.4" (optimointidokumentti, ei määrittele eristystä) → **KYA Security v1.2** |
| **Aegis Pilot** (`Store/PRODUCT_AEGIS_PILOT.md`) | Sama hallintakerros pilottilaajuudessa | Ei versioväitettä — ok |
| **Train Model** (`Store/PRODUCT_TRAIN_MODEL.md`) | KYA-hallinta koulutusajoille | Ei versioväitettä — ok |
| **DWS IQ -alusta** (referenssitoteutus) | KYA-S1 §9 referenssitoteutus | **DWS ei väitä tieriä** ennen riippumatonta arvioijaa — §9 on arkkitehtuurikuvaus, ei attestaatio |

***

## 6. Korjatut virheet (tämä sessio)

| # | Kohde | Oli | On | Miksi virhe |
| --- | --- | --- | --- | --- |
| 1 | `dws10.com/products/themis.html:439` + peili | KYA Standard **v1.7** | KYA Standard **v1.12** | v1.7:ää ei ole olemassa missään KYA-tiedostossa — haamuversio ostajan silmissä |
| 2 | `dws10.com/products/aegis.html:454` + peili | Firecracker MicroVM (**KYA v1.4**) | Firecracker MicroVM (**KYA Security v1.2**) | v1.4 on optimointi-/talousdokumentti; MicroVM-eristys määritellään Security v1.2:ssa |
| 3 | `src/identity/ats-engine.ts:16`, `types.ts:64,67` | `Legal/KYA_S1_v1.3.md` | `Legal/KYA_S1.md` (v1.5) | v1.3 on kumottu 09.08.2026; totuusstandardin rivi 35 sanoo suoraan "do not cite it" |

***

## 7. Avoin velka (ei korjattu tässä)

- **P1-1 latenssi ATS:ssä** — `L` pisteyttää suorituskyvyn epäluotettavuutena. **PR #1816 toteuttaa tämän korjauksen** (poistaa latenssin ATS:stä, jättää telemetriaksi). Ei siis avoin, jos #1816 menee sisään.
- **P1-2 / P1-3** (V:n aikaikkuna ja rehabilitaatio; seurausluokkakohtaiset kynnykset) — auki, ks. `Legal/KYA_AUDIT_WORKLIST_2026-08.md`.
- **TRS-1 ei ole täytetty** — neljästä vaaditusta syötteestä toteutettu vain IDV. Ei väitetä tieriä.
- **Julkaistut blogipostaukset** siteeraavat yhä "KYA-S1 v1.2 — a vendor **standard**" meta-kuvauksissa (useita tiedostoja `onelifetime.world/posts/`). Kanoni: **specification**, nykyversio v1.5. Ei korjattu tässä, koska julkaistun postauksen tekstin muutos kulkee Sääntö 13:n / `/blog-draft`-portin kautta.

***

_Versio 1.0 · 10.08.2026 · © Lifetime Oy — kaikki oikeudet pidätetään._
_Liikesalaisuus / Business Confidentiality: sisältää Lifetime Oy:n luottamuksellista tietoa._
