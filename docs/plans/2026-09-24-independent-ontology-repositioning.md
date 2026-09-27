# Decision Memo: Independent Ontology after Active Ontology 1.5 — from knowledge product to decision infrastructure

---

VERSION AND AGENT HISTORY

- Version: 2.0
- Status: DECIDED — kept confidential until M1 (HIC 24.09.2026); public copy NOT changed
- Classification: CONFIDENTIAL — do not use in public copy, investor material, blog posts or outreach until the HIC releases it after M1
- Document type: Decision Memo
- Author: Claude Code (standby runtime) + risto.paarni2024@lifetime.fi
- Date: 2026-09-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/blissful-davinci-8782wy

Sessions & Modifications:

- Version: 2.0 [Latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §15 product line published (PR #2094 catalogue 1.31, PR #2095 catalogue 1.32): pilot 3 months, 100% credit within 90 days, binary success goals A/B/C, GO/HOLD/NO-GO, sovereignty principle (own model owned, base pack licensed). Other pilots to be aligned (separate PR).
- Version: 1.9 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §14 HIC release decision: FI buy-page copy published before M1 in a separate PR (#2094); marketing name + official product name; final core claim. Memo itself stays confidential.
- Version: 1.8 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §13.3 HIC choices: extend LF-TRAIN-IND (no new START SKU); separate LF-ONTOLOGY-PILOT, pilot line removed from the licence. Draft catalogue text for HIC approval; implementation waits for a separate branch/PR.
- Version: 1.7 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §13 HIC decision: implementation and organising becomes its own product, separate from the LF-ONTOLOGY-25 licence; price memo stays confidential sales material; Decision Flight Recorder terms stay off the public page until M1–M3. Catalogue check: LF-TRAIN-IND already is that separate service; overlaps listed for HIC choice. §11 closing note corrected by pointer.
- Version: 1.6 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §12 HIC decisions: (1) Independent Ontology stays a licence product, not an implementation service; (2) learning in future/enabling tense until M3; (3) no present-tense proof claims until M1. HIC third draft (buy page) recorded verbatim with a line-by-line truth check. HIC proposes release before M1; this reverses §7 and is open for explicit confirmation.
- Version: 1.5 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §11 confidential price benchmark: LF-ONTOLOGY-25 vs Palantir Foundry/AIP, C3.ai, Microsoft Fabric (IQ), Stardog, Neo4j Aura, Cognite. Internal use only.
- Version: 1.4 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §10 HIC second draft (bolder; business, continuity and accountability language instead of ontology language) recorded verbatim as the current release candidate; supersedes §9. Price section flagged. Confidential until M1.
- Version: 1.3 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: §9 merged candidate (FI): the HIC text from §8 unchanged, plus the memo's lead lines (decision memory / Decision Flight Recorder for Organizations, modelled vs real world, 'Ontologia ei ole tuote'). Confidential until M1.
- Version: 1.2 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC-authored full product page text (FI) recorded verbatim in §8. It replaces the §6 draft as the candidate copy. Still confidential until M1.
- Version: 1.1 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC decisions: (1) Independent Ontology = `LF-ONTOLOGY-25`; (2) product copy waits until after M1, and the repositioning stays confidential until then (§7).
- Version: 1.0 [not latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC insight recorded: Active Ontology 1.5 changes the nature of the Independent Ontology offer on dws10.com/buy. Four-level product pyramid, repositioning lines kept verbatim, catalogue mapping, truth gate for public claims, draft copy.

Related Documents:

- `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` §9.5–9.6 — technical validation of the Decision Flight Recorder (not yet applied to Supabase)
- `docs/plans/2026-07-02-firehorse-ontology-upsell-chain.md` — the standalone-ontology decision this builds on
- `dws10.com/config/products.json` — `LF-ONTOLOGY-25`, `LWM-ONT-IND`, `LWM-ONT-SUITE`, `LWM-ONT-SOVEREIGN`
- `DWS_TRUTH_STANDARD.md` — public claims must be true when published

---

## 1. The insight (HIC, 24.09.2026)

Active Ontology 1.5 changes the character of the Independent Ontology more than it changes the product itself.

|                   | Before                                                                                                                          | After Active Ontology 1.5                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Chain             | Ontology → Observation → Interpretation → Recommendation                                                                        | Independent Ontology → Observation → Ownership Discovery → Decision Path → Evidence → Learning → Ontology Update |
| Question answered | "What does this observation mean?"                                                                                              | "What was observed? Whose was it? What was recommended? What was decided? What happened? What was learned?"      |
| Category          | Recommendation engine (useful, e.g. _batch carbon footprint unknown → Climate Intelligence_; _ownership unclear → Captain Day_) | Decision memory for the organisation                                                                             |
| What is bought    | "I buy an ontology."                                                                                                            | "I buy the ability to keep decisions traceable while technologies change."                                       |

Kept verbatim (HIC):

> Organisaation päätöksenteon muistijärjestelmä. — _Decision Flight Recorder for Organizations._
>
> Ontologia ei ole tuote. Todennettu päätöshistoria on tuote.
>
> Independent Ontology kertoo, miten maailma on mallinnettu. Active Ontology kertoo, mitä maailmassa oikeasti tapahtui.

This implements the claim in the HIC's LinkedIn text: _Teknologia muuttuu. Mallit vaihtuvat. Vastuu säilyy ihmisellä._

## 2. Product pyramid

| Level | Product                  | Role                              | Status on 24.09.2026                                                           |
| ----- | ------------------------ | --------------------------------- | ------------------------------------------------------------------------------ |
| 1     | DISCOVER                 | Finds the problem (and its owner) | Live on dws10.com, intake storage pending env vars + migrations 089–091        |
| 2     | Independent Ontology     | Models the world                  | Sold: `LF-ONTOLOGY-25`, `LWM-ONT-*`                                            |
| 3     | Decision Flight Recorder | Proves what happened              | Validated on a clean database (092/093, 32 + 20 PASS); not applied to Supabase |
| 4     | Active Ontology          | Learns from decision paths        | Designed; learns only after M1–M3 exist                                        |

## 3. Competitive line

A competitor can say _"we have an ontology too."_ That is no longer enough. The DWS answer: the ontology models the world; the verified decision history is the asset, and it cannot be generated, copied or bought.

## 4. Catalogue mapping

The name "Independent Ontology" does not appear in `products.json` or on the site. The closest match is `LF-ONTOLOGY-25` ("DWS IQ is one possible runtime, not a required dependency"). Its current description sells **coverage and knowledge**, which the new line _"Ontologia ei ole tuote"_ contradicts.

**Resolve before any copy change:** does "Independent Ontology" mean `LF-ONTOLOGY-25`, or a new offer on dws10.com/buy?

## 5. Truth gate for public claims

Public copy has to be true on the day it is published.

- **Today, allowed:** "designed to" / "being built" / "validated in test" language. For example: _"Built to keep every decision traceable: what was observed, who owned it, what was decided and what happened."_
- **Not yet allowed:** "records your decision history", "verified decision paths", any number of journeys. The Decision Flight Recorder is not applied to Supabase, and M1 has not happened.
- **After M1** (the first real Ownership Transfer, recorded with evidence), the page can show it as the first evidence. This follows the DWS "show me, not trust me" principle.

This keeps the HIC's own priority: M1 first, not a copy or feature change first.

## 6. Draft copy (superseded by the HIC text in §8; kept for the record)

**EN, one-liner:** Independent Ontology — the decision memory of your organisation. It models your world today, and records what was observed, who owned it, what was decided and what happened, so decisions stay traceable when technologies and models change.

**FI, one-liner:** Independent Ontology — organisaation päätöksenteon muisti. Mallintaa maailmanne tänään ja kirjaa, mitä havaittiin, kenen asia se oli, mitä päätettiin ja mitä tapahtui, jotta päätökset pysyvät jäljitettävinä teknologioiden ja mallien vaihtuessa.

Before any of this is published, run `/truth-check` and the Approval Request Rule. Update the root and `landing-pages/` mirrors in the same commit.

## 7. HIC decisions (24.09.2026)

1. **Independent Ontology = `LF-ONTOLOGY-25`.** When the repositioning is published, this SKU's description in `dws10.com/config/products.json` changes, together with the `landing-pages/` mirror in the same commit. Prices do not change.
2. **Publish only after M1, confidential until then.** The repositioning, the pyramid and the draft copy stay internal. They are not used in public copy, investor material, blog posts or outreach. Release requires both:
   - M1 is reached (the first real Ownership Transfer recorded with evidence);
   - the HIC explicitly releases the text, after `/truth-check` and the Approval Request Rule.

## 8. Candidate product page — HIC text, verbatim (FI, 24.09.2026)

The HIC rewrote Independent Ontology almost entirely: it is no longer presented as an ontology but as a product for **continuity of organisational understanding and decision-making**. The text below is preserved verbatim (DWS_DOCUMENT_STANDARD §21). **Confidential; not published** (§7).

```text
# Independent Ontology

## Ymmärrys säilyy, vaikka teknologia muuttuu.

Organisaatiot eivät menetä kilpailukykyään siksi, että data katoaa.

Ne menettävät kilpailukykyään, koska ymmärrys katoaa.

Ihmiset vaihtavat tehtäviä.
Projektit päättyvät.
Järjestelmät korvataan uusilla.
Tekoälymallit muuttuvat.

Kun päätösten perusteet katoavat, katoaa myös kyky oppia.

## Independent Ontology luo jatkuvuuden

Independent Ontology kokoaa yhteen:

- havaintoja
- käsitteitä
- omistajuuksia
- päätöksiä
- vaikutuksia

yhdeksi ymmärrettäväksi kokonaisuudeksi.

Se ei sido organisaation ymmärrystä yksittäiseen järjestelmään, toimittajaan tai tekoälymalliin.

## Mitä ongelmaa ratkaistaan?

Monessa organisaatiossa tiedetään:

    Mitä päätettiin.

Mutta ei enää tiedetä:

    Miksi päätettiin?
    Kuka päätti?
    Mihin havaintoihin päätös perustui?
    Mitä päätöksestä seurasi?

Independent Ontology säilyttää tämän yhteyden.

## Päätösten jäljitettävyys

Teknologia muuttuu.

Mallit vaihtuvat.

Vastuu säilyy ihmisellä.

Siksi päätösten tulee olla jäljitettävissä.

Independent Ontology mahdollistaa päätöspolkujen dokumentoinnin siten, että myöhemmin voidaan osoittaa:

    Havainto → Omistajuus → Suositus → Päätös → Toimenpide → Vaikutus

## Organisaation muisti

Independent Ontology toimii organisaation yhteisenä muistina.

Sen avulla voidaan säilyttää:

- päätösten taustat
- omistajuudet
- käsitteet
- riippuvuudet
- opitut asiat

myös silloin, kun ihmiset, järjestelmät tai teknologiat vaihtuvat.

## Kenelle?

Organisaatioille, jotka haluavat:

- säilyttää ymmärryksen pitkällä aikavälillä
- parantaa päätöksenteon laatua
- vähentää henkilöriippuvuutta
- rakentaa jatkuvuutta muutoksen keskellä
- hyödyntää tekoälyä ilman että ymmärrys katoaa sen mukana

## Lopputulos

Independent Ontology ei ole tietokanta.

Se ei ole raportti.

Se ei ole tekoälymalli.

Se on tapa varmistaa, että organisaation ymmärrys säilyy.

**Jatkuvuus luo turvallisuuden.**

**Ymmärrys luo kilpailukyvyn.**

**Oppiminen mahdollistaa kasvun.**
```

**Checks already run (24.09.2026):** `lint-truth-claims` on the text: 0 fail / 0 warn.

**Release checklist (at M1 + HIC release, §7):**

1. **Present-tense claims must be true on release day.** These sentences describe decision memory as working now:
   - "kokoaa yhteen … päätöksiä, vaikutuksia"
   - "mahdollistaa päätöspolkujen dokumentoinnin"
   - "toimii organisaation yhteisenä muistina"

   They hold only once migrations 092/093 run in production and M1 is recorded. The `LF-ONTOLOGY-25` offer must also include or connect the Decision Flight Recorder. Today its description sells a 25-industry ontology pack only. Either the SKU scope changes, or the text is bound to the combined offer.

2. **The SKU description changes** in `dws10.com/config/products.json` and its `landing-pages/` mirror, in the same commit. No price change.
3. **EN version and other site languages** are produced from this FI text, then reviewed by the HIC line by line (`/dialog`).
4. **Final gates:** `/truth-check` and the Approval Request Rule (published review link) before the page goes live.

## 9. Merged candidate page (FI) — superseded by §10

The §8 HIC text is used unchanged. Added from §1 and §6: the subtitle line "Organisaation päätöksenteon muisti. Decision Flight Recorder for Organizations.", one traceability sentence after the decision chain, and the section "Mallinnettu maailma ja todellinen maailma". The HIC text's code blocks became plain lines. `lint-truth-claims`: 0 fail / 0 warn. The §8 release checklist applies unchanged. **Confidential; not published** (§7).

```text
# Independent Ontology

## Ymmärrys säilyy, vaikka teknologia muuttuu.

Organisaation päätöksenteon muisti. Decision Flight Recorder for Organizations.

Organisaatiot eivät menetä kilpailukykyään siksi, että data katoaa.

Ne menettävät kilpailukykyään, koska ymmärrys katoaa.

Ihmiset vaihtavat tehtäviä.
Projektit päättyvät.
Järjestelmät korvataan uusilla.
Tekoälymallit muuttuvat.

Kun päätösten perusteet katoavat, katoaa myös kyky oppia.

## Independent Ontology luo jatkuvuuden

Independent Ontology kokoaa yhteen:

- havaintoja
- käsitteitä
- omistajuuksia
- päätöksiä
- vaikutuksia

yhdeksi ymmärrettäväksi kokonaisuudeksi.

Se ei sido organisaation ymmärrystä yksittäiseen järjestelmään, toimittajaan tai tekoälymalliin.

## Mitä ongelmaa ratkaistaan?

Monessa organisaatiossa tiedetään, mitä päätettiin.

Mutta ei enää tiedetä:

- Miksi päätettiin?
- Kuka päätti?
- Mihin havaintoihin päätös perustui?
- Mitä päätöksestä seurasi?

Independent Ontology säilyttää tämän yhteyden.

## Päätösten jäljitettävyys

Teknologia muuttuu.

Mallit vaihtuvat.

Vastuu säilyy ihmisellä.

Siksi päätösten tulee olla jäljitettävissä.

Independent Ontology mahdollistaa päätöspolkujen dokumentoinnin siten, että myöhemmin voidaan osoittaa:

Havainto → Omistajuus → Suositus → Päätös → Toimenpide → Vaikutus

Jokainen vaihe kirjataan sillä hetkellä, kun se tapahtuu, ja jokainen voidaan jäljittää takaisin alkuperäiseen havaintoon ja sen evidenssiin. Ei jälkikäteen muisteltuna.

## Organisaation muisti

Independent Ontology toimii organisaation yhteisenä muistina.

Sen avulla voidaan säilyttää:

- päätösten taustat
- omistajuudet
- käsitteet
- riippuvuudet
- opitut asiat

myös silloin, kun ihmiset, järjestelmät tai teknologiat vaihtuvat.

## Mallinnettu maailma ja todellinen maailma

Ontologia kertoo, miten maailma on mallinnettu.

Päätöshistoria kertoo, mitä maailmassa oikeasti tapahtui.

Ontologia ei ole tuote. Todennettu päätöshistoria on tuote.

Ette osta ontologiaa. Ostatte kyvyn säilyttää päätösten jäljitettävyys, kun teknologiat vaihtuvat.

## Kenelle?

Organisaatioille, jotka haluavat:

- säilyttää ymmärryksen pitkällä aikavälillä
- parantaa päätöksenteon laatua
- vähentää henkilöriippuvuutta
- rakentaa jatkuvuutta muutoksen keskellä
- hyödyntää tekoälyä ilman että ymmärrys katoaa sen mukana

## Lopputulos

Independent Ontology ei ole tietokanta.

Se ei ole raportti.

Se ei ole tekoälymalli.

Se on tapa varmistaa, että organisaation ymmärrys säilyy.

**Jatkuvuus luo turvallisuuden.**

**Ymmärrys luo kilpailukyvyn.**

**Oppiminen mahdollistaa kasvun.**
```

## 10. HIC second draft (FI) — current release candidate (24.09.2026)

The HIC's direction: bolder, no ontology language written for engineers, the language of business, continuity and accountability instead. Recorded verbatim; the code blocks became plain lines. It supersedes §9 as the candidate. `lint-truth-claims`: 0 fail / 0 warn. **Confidential; not published** (§7).

```text
# Independent Ontology

## Teknologia muuttuu. Ymmärryksen pitää säilyä.

Ihmiset vaihtavat tehtäviä.

Järjestelmät vaihtuvat.

Tekoälymallit vaihtuvat.

Mutta organisaation kyky ymmärtää omaa toimintaansa ei saa kadota muutoksen mukana.

Independent Ontology auttaa säilyttämään ymmärryksen, päätösten perusteet ja niiden vaikutukset yli järjestelmä-, toimittaja- ja teknologiasukupolvien.

## Mitä tapahtuu, kun ymmärrys katoaa?

Useimmat organisaatiot tietävät mitä päätettiin.

Harvempi tietää enää:

- miksi päätettiin
- mihin havaintoihin päätös perustui
- kuka omisti asian
- mitä päätöksestä seurasi

Kun tämä yhteys katkeaa, oppiminen pysähtyy.

Samat virheet toistuvat.

Samat selvitykset tehdään uudelleen.

Ja kilpailukyky heikkenee vähitellen.

## Päätöksenteon jatkuvuus

Independent Ontology yhdistää:

    Havainto → Omistajuus → Päätös → Toimenpide → Vaikutus → Oppiminen

samaan ymmärrettävään kokonaisuuteen.

Tavoitteena ei ole tallentaa lisää dataa.

Tavoitteena on säilyttää ymmärrys.

## Organisaation yhteinen muisti

Kun organisaatio kasvaa, tieto hajautuu.

Ihmisten mukana katoaa kokemusta.

Projektien mukana katoaa kontekstia.

Järjestelmien mukana katoaa historiaa.

Independent Ontology toimii yhteisenä muistina, joka säilyttää:

- käsitteet
- yhteydet
- omistajuudet
- päätösten perustelut
- opitut asiat

riippumatta siitä, mitä teknologiaa käytetään.

## Jäljitettävät päätöspolut

Luottamus syntyy evidenssistä.

Siksi havaintojen, päätösten ja vaikutusten on oltava jäljitettävissä.

Independent Ontology mahdollistaa päätöspolut, joiden avulla voidaan vuosienkin päästä ymmärtää:

    Mitä havaittiin? → Kuka omisti asian? → Mitä päätettiin? → Mitä tehtiin? → Mitä siitä seurasi?

## Kenelle?

Organisaatioille, jotka haluavat:

- säilyttää kriittisen ymmärryksen
- vähentää henkilöriskiä
- parantaa päätöksenteon laatua
- rakentaa jatkuvuutta muutoksen keskellä
- hyödyntää tekoälyä ilman että vastuu tai ymmärrys katoaa

## Lopputulos

Independent Ontology ei ole tietokanta.

Se ei ole raportointijärjestelmä.

Se ei ole tekoälymalli.

Se on organisaation kyky säilyttää ymmärrys teknologian muuttuessa.

**Jatkuvuus luo turvallisuuden.**

**Ymmärrys luo kilpailukyvyn.**

**Oppiminen mahdollistaa kasvun.**

### Hinta

**Independent Ontology**
Käyttöönotto ja organisointi organisaation tarpeisiin.

👉 Aloita rakentamalla ymmärryksen jatkuvuutta jo tänään.
```

**Release notes for this draft** (in addition to the §8 checklist):

1. **Price section.** The draft names no price, which is acceptable: prices are never hardcoded. On release, the section is rendered from `dws10.com/config/products.json` → `LF-ONTOLOGY-25`, which today is €25,000 per licensed site-year, with site tiers in `priceNote`. That price is for the ontology licence. If the offer changes to "käyttöönotto ja organisointi" (implementation and organising), the SKU scope and price must be decided in `products.json` first (HIC), and the page follows.
2. **"→ Oppiminen" in the chain.** Learning is shown as part of the offer. Present-tense learning is true only after M3 (the first Verified Learning Delta). Until then, the release text should describe learning as the goal, or the release waits for M3.
3. **Present-tense claims** ("yhdistää", "toimii yhteisenä muistina", "mahdollistaa päätöspolut") follow the §8 rule: true only after 092/093 run in production and M1 is recorded.

## 11. Price benchmark (CONFIDENTIAL, 24.09.2026)

Internal use only. No public use and no investor use before M1 + HIC release. Figures are either published list prices (L), public third-party estimates (E), or derived from SEC filings (S). EUR at ~0.92 USD.

| Product                               | What is bought                                            | Price / year                                                                               | Type                | Comparable to LF-ONTOLOGY-25?                    |
| ------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------- | ------------------------------------------------ |
| **LF-ONTOLOGY-25**                    | Ontology licence per site                                 | €25,000 / site; 2–5 sites €60k; 6–20 €120k; 21+ from €200k; pilot €15–25k                  | L (`products.json`) | —                                                |
| Palantir Foundry + AIP                | Platform (data integration + ontology + apps + FDE staff) | ~$250k narrow single use case; most first contracts $0.5–2M; avg customer ~$4.7M (≈ €4.3M) | E / S               | Partly: ontology is one layer of a full platform |
| C3.ai                                 | Enterprise AI application platform                        | $250k – $1M+                                                                               | E                   | Partly                                           |
| Microsoft Fabric (Fabric IQ ontology) | Capacity F64 + storage                                    | ~$60k reserved / ~$101k PAYG (≈ €55–93k), before build work                                | L (capacity)        | Tooling only: the customer builds the ontology   |
| Stardog Enterprise KG                 | Knowledge graph platform                                  | from $47,250 (≈ €43k) software + AWS infra                                                 | L (AWS Marketplace) | Tooling only                                     |
| Neo4j AuraDB Business Critical        | Graph database                                            | from ~$1.6k (small); ~$146/GB/month at scale                                               | L                   | Database only                                    |
| Cognite Data Fusion                   | Industrial DataOps / digital twin                         | Private pricing (not published)                                                            | —                   | Partly (industrial sites)                        |

**Readings (price only):**

1. One LF-ONTOLOGY-25 site costs ≈ 1/10 of Palantir's smallest commercial deal and ≈ 1/170 of Palantir's average customer.
2. Against build-it-yourself tooling (Fabric, Stardog), the licence costs about the same or less than the software alone, and the customer's own modelling work is not included in their price.
3. The price gap against Palantir is a strength for the SME and mid-market segment. It also invites the question "why so cheap?". The answer must be evidence (M1–M3), not price.

**Like-for-like caveats:**

- Palantir, C3.ai and Cognite sell a platform plus people. LF-ONTOLOGY-25 is an ontology licence. Compare it only to Palantir's ontology-layer outcome, never to its whole platform.
- Decision memory (the Decision Flight Recorder: append-only evidence, negative evidence, ownership transfers) is not a priced item in any benchmarked product. It is a differentiator only after 092/093 are in production and M1 is recorded (Truth Standard).
- Palantir figures are third-party estimates plus SEC-derived averages; there is no list price.

**Open HIC decision:** whether the "käyttöönotto ja organisointi" (implementation and organising) offer becomes a separate SKU. A pilot band of €15–25k sits well below the €250k Palantir entry point. _Closed in §12: no — the product stays a licence._ _Superseded by §13 (HIC, 24.09.2026): yes — implementation and organising is a separate product; the licence stays a licence._

**Sources:** `docs/field-notes/2026-03-26-aegis-pricing-study.md` (Palantir FY2025 10-K: revenue $4.475B, 954 customers); [Redress: Palantir AIP/Foundry negotiation 2026](https://redresscompliance.com/palantir-aip-foundry-negotiation); [BD Emerson: What Palantir costs](https://www.bdemerson.com/article/palantir-cost); [UK G-Cloud 14 Palantir pricing document](https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/92736/804537709233305-pricing-document-2024-05-01-1339.pdf); [Microsoft Fabric pricing (Synapx)](https://www.synapx.com/blogs/microsoft-fabric-pricing-guide-2026); [AWS Marketplace: Stardog](https://aws.amazon.com/marketplace/pp/prodview-ulfm6fel7xgjq); [Neo4j pricing](https://neo4j.com/pricing/); [AWS Marketplace: Palantir Platform](https://aws.amazon.com/marketplace/pp/prodview-a5m5xespbqyci) (private pricing only); [AWS Marketplace: Cognite Data Fusion](https://aws.amazon.com/marketplace/pp/prodview-pnszk2onnidau) (private pricing only).

## 12. HIC decisions and third draft (24.09.2026)

### 12.1 Decisions (HIC, 24.09.2026)

1. **Independent Ontology stays a licence product.** It is not an implementation service or consultancy. The buy page speaks of "lisensoitu organisaation ymmärrysinfrastruktuuri", not of a "käyttöönottoprojekti". This matches the catalogue: `LF-ONTOLOGY-25` is the licence (Starter 1 site €25k, Growth 2–5 sites €60k, Enterprise 6–20 sites €120k, 21+ from €200k, all in `features`/`priceNote` of one SKU), and remote configuration is the separate `LF-TRAIN-IND` (from €15k). No new SKUs are needed; `LF-ONTOLOGY-60/120/200+` in the HIC message are tier labels, not SKU ids.
2. **Learning in the future or enabling tense** until M3 (Verified Learning Delta = 0 today): "mahdollistaa oppimisen" / "luo perustan oppimiselle", never "järjestelmä oppii".
3. **No present-tense proof claims** until M1: "on suunniteltu yhdistämään" / "tarjoaa rakenteen, jossa yhteydet voidaan säilyttää", never "yhdistää".

HIC view: the draft below can be released **before M1 and M3**, because it sells vision, licence and continuity, not recorded decision paths. This reverses the §7 decision ("confidential until M1") and needs an explicit HIC go before any public change.

### 12.2 Truth check of the third draft (Claude Code, 24.09.2026)

Checked against `dws10.com/config/products.json` → `LF-ONTOLOGY-25` and `DWS_TRUTH_STANDARD.md`.

| #   | Line in draft                                                                                                                        | Status      | Reason / fix                                                                                                                                                                                                                                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T1  | "tarjoaa rakenteen, jonka avulla organisaatio voi säilyttää käsitteet, omistajuudet, päätösten perusteet ja kriittisen tietopääoman" | Partly true | The SKU delivers ontology artefacts (concepts, relations, versioned updates). Ownership and decision reasoning are Decision Journey (092/093), which is not in the SKU and not in production. Fix: "käsitteet ja niiden väliset suhteet — ja luo perustan omistajuuksien ja päätösten perusteiden säilyttämiselle", or add decision memory to the SKU scope first (HIC). |
| T2  | "Päätöksenteon jatkuvuus … tarjoaa rakenteen, jonka avulla nämä yhteydet voidaan säilyttää"                                          | Borderline  | Same as T1. "on suunniteltu säilyttämään" is safe until M1.                                                                                                                                                                                                                                                                                                              |
| T3  | "auttaa muodostamaan yhteisen rakenteen / yhteisen kielen"                                                                           | True        | This is what an ontology pack does.                                                                                                                                                                                                                                                                                                                                      |
| T4  | "Riippumaton teknologioista … ei sido … ohjelmistoon, tietokantaan, tekoälymalliin, toimittajaan, alustaan"                          | True        | SKU text: "DWS IQ is one possible runtime, not a required dependency".                                                                                                                                                                                                                                                                                                   |
| T5  | "Oppiminen mahdollistaa kasvun" / "Mitä opimme?"                                                                                     | True        | Motto and question, not a system claim (§12.1 rule 2).                                                                                                                                                                                                                                                                                                                   |
| T6  | "25 000 € / vuosi / nimetty toimipaikka"                                                                                             | Rule        | Correct today, but must be rendered from `products.json` (no hardcoded prices).                                                                                                                                                                                                                                                                                          |
| T7  | Page name "Independent Ontology" vs SKU name "European Industry Ontology, 25 industries"                                             | Mismatch    | Either rename the SKU display name in `products.json` (+ mirror) or show both ("Independent Ontology — European Industry Ontology, 25 toimialaa"). HIC choice.                                                                                                                                                                                                           |

### 12.3 HIC third draft — short version (verbatim)

```text
## Independent Ontology

### Organisaation ymmärryksen jatkuvuus teknologian muuttuessa

Teknologia muuttuu.

Järjestelmät vaihtuvat.

Tekoälymallit kehittyvät.

Mutta organisaation kyky ymmärtää omaa toimintaansa ei saa kadota muutoksen mukana.

Independent Ontology tarjoaa rakenteen, jonka avulla organisaatio voi säilyttää käsitteet, omistajuudet, päätösten perusteet ja niihin liittyvän tiedon yli järjestelmä- ja teknologiasukupolvien.

### Miksi tämä on tärkeää?

Useimmat organisaatiot tietävät mitä päätettiin.

Harvemmat pystyvät vuosien päästä vastaamaan kysymyksiin:

- miksi päätös tehtiin
- mihin havaintoihin se perustui
- kuka omisti asian
- mitä vaikutuksia päätöksellä tavoiteltiin

Kun yhteys havaintojen, päätösten ja vaikutusten välillä katoaa, myös organisaation ymmärrys alkaa rapautua.

### Riippumaton teknologioista

Independent Ontology ei sido organisaation ymmärrystä yksittäiseen:

- ohjelmistoon
- tietokantaan
- toimittajaan
- tekoälymalliin

Se tarjoaa pysyvämmän rakenteen ymmärryksen hallintaan.

### Organisaatioille, jotka haluavat

- vähentää henkilöriippuvuutta
- säilyttää kriittisen tiedon
- tukea päätöksentekoa
- rakentaa jatkuvuutta muutoksen keskellä
- hyödyntää tekoälyä ilman että ymmärrys katoaa sen mukana

### Lopputulos

Independent Ontology on lisensoitava organisaation ymmärryskerros.

Sen tarkoituksena on auttaa organisaatiota säilyttämään päätöksenteon konteksti, omistajuus ja tietopääoma teknologian muuttuessa.

**Jatkuvuus luo turvallisuuden.**

**Ymmärrys luo kilpailukyvyn.**

**Oppiminen mahdollistaa kasvun.**
```

### 12.4 HIC third draft — full page (verbatim, current release candidate)

```text
## Independent Ontology

# Teknologia muuttuu. Ymmärryksen pitää säilyä.

Ihmiset vaihtavat tehtäviä.

Järjestelmät vaihtuvat.

Tekoälymallit kehittyvät.

Mutta organisaation kyky ymmärtää omaa toimintaansa ei saa kadota muutoksen mukana.

**Independent Ontology** tarjoaa rakenteen, jonka avulla organisaatio voi säilyttää käsitteet, omistajuudet, päätösten perusteet ja kriittisen tietopääoman yli järjestelmä-, toimittaja- ja teknologiasukupolvien.

## Mitä tapahtuu, kun ymmärrys katoaa?

Useimmat organisaatiot tietävät mitä päätettiin.

Harvemmat pystyvät vuosien päästä vastaamaan kysymyksiin:

- Miksi päätös tehtiin?
- Mihin havaintoihin päätös perustui?
- Kuka omisti asian?
- Mitä vaikutuksia tavoiteltiin?
- Mitä opimme?

Kun yhteys havaintojen, päätösten ja vaikutusten välillä katkeaa, myös organisaation kyky oppia heikkenee.

Samat selvitykset tehdään uudelleen.

Samat virheet toistuvat.

Hiljainen tieto katoaa ihmisten mukana.

## Riippumaton teknologioista

Independent Ontology ei sido organisaation ymmärrystä yhteen:

- ohjelmistoon
- tietokantaan
- tekoälymalliin
- toimittajaan
- alustaan

Se tarjoaa pysyvämmän rakenteen tiedon, käsitteiden ja omistajuuksien hallintaan.

Teknologioita voidaan vaihtaa.

Ymmärrystä ei tarvitse vaihtaa niiden mukana.

## Organisaation yhteinen kieli

Kasvun myötä organisaatioihin syntyy rinnakkaisia käsityksiä samoista asioista.

Yksi puhuu asiakkaista.

Toinen prosesseista.

Kolmas datasta.

Neljäs liiketoiminnan tavoitteista.

Independent Ontology auttaa muodostamaan yhteisen rakenteen, jonka avulla asioista voidaan puhua samalla tavalla läpi organisaation.

## Päätöksenteon jatkuvuus

Päätöksenteko ei ole yksittäinen tapahtuma.

Se on ketju havaintoja, valintoja, vastuita ja vaikutuksia.

Independent Ontology tarjoaa rakenteen, jonka avulla nämä yhteydet voidaan säilyttää ymmärrettävinä myös vuosien päästä.

Tavoitteena ei ole kerätä enemmän dataa.

Tavoitteena on säilyttää enemmän ymmärrystä.

## Kenelle?

Independent Ontology sopii organisaatioille, jotka haluavat:

- vähentää henkilöriippuvuutta
- säilyttää kriittisen tietopääoman
- parantaa päätöksenteon laatua
- rakentaa jatkuvuutta muutoksen keskellä
- hyödyntää tekoälyä vastuullisesti
- suojata kilpailukykyään pitkällä aikavälillä

## Miksi nyt?

Tekoäly nopeuttaa muutosta.

Uusia työkaluja syntyy jatkuvasti.

Tietoa syntyy enemmän kuin koskaan.

Samalla ymmärryksen säilyttämisestä tulee entistä tärkeämpää.

Organisaatiot, jotka kykenevät säilyttämään ja kehittämään ymmärrystään teknologian muuttuessa, rakentavat kestävää kilpailuetua.

## Lopputulos

Independent Ontology ei ole raportti.

Se ei ole tietokanta.

Se ei ole tekoälymalli.

Se on organisaation ymmärryksen jatkuvuuden perusta.

**Jatkuvuus luo turvallisuuden.**

**Ymmärrys luo kilpailukyvyn.**

**Oppiminen mahdollistaa kasvun.**

### Independent Ontology

**25 000 € / vuosi / nimetty toimipaikka**

Skaalautuvat lisenssitasot suuremmille kokonaisuuksille.

**Rakenna ymmärryksen jatkuvuutta ennen kuin siitä tulee kilpailuetu jollekin toiselle.**
```

## 13. HIC decision: licence and implementation as separate products (24.09.2026)

### 13.1 Decisions (HIC, 24.09.2026)

1. **The price benchmark (§11) is confidential sales and positioning material**, never public buy-page copy.
2. **LF-ONTOLOGY-25 is not expensive.** The real sales risk is "miksi näin halpa?", and it is answered with M1 → M2 → M3 evidence, not with price.
3. **Public buy page before M1–M3:** yes to continuity of understanding, technology independence, organisational memory and decision context. No to "Verified Decision Journeys", "Decision Flight Recorder" and "Learning Delta".
4. **Gitleaks:** bypassing a security scanner must be a deliberate infrastructure decision, never a side effect of one commit. (This session: the scanner was installed and the push passed all checks; no bypass was used.)
5. **Product structure:** the licence and implementation are separate products with their own codes and prices. The licence must never be bundled with modelling, workshops or change management ("kate hämärtyy, skaalautuvuus katoaa, arvonmääritys vaikeutuu, vertailu Palantiriin vaikeutuu").
   - `LF-ONTOLOGY-25` — Independent Ontology License, €25,000 / year / site: licence, templates, update rights, version control, documentation.
   - `LF-ONTOLOGY-START` — Implementation & Organization Package, €15,000–25,000 one-time: current-state mapping, concept workshops, ownership mapping, first ontology skeleton, deployment.
   - `LF-ONTOLOGY-EXPAND` — Ontology Expansion Engagement, from €25,000: new industries, units, sites, data sources.
   - `LF-ONTOLOGY-PILOT` — €15,000–25,000: map concepts, build a first ontology and test the model before the annual licence.

HIC positioning line (verbatim):

```text
Ei ontologiaa.

Ei tietokantaa.

Ei tekoälyä.

Vaan organisaation ymmärryksen jatkuvuutta.
```

"Kilpailija ei ole Neo4j. Kilpailija ei ole Stardog. Kilpailija ei ole Fabric. Kilpailija on: ymmärryksen katoaminen, henkilöriippuvuus, organisaation muistin häviäminen. Ja se on paljon kalliimpi ongelma kuin 25 000 € vuodessa."

### 13.2 Catalogue check against `dws10.com/config/products.json` (Claude Code, 24.09.2026)

| Proposed                                    | Already in catalogue                                                                                                                                                                              | Overlap                                                                                        | Open choice (HIC)                                                                                                                                                                                                      |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `LF-ONTOLOGY-START` €15–25k one-time        | `LF-TRAIN-IND` "Sovereign Training and Site Configuration", €15,000 per site, one-time, "Sold separately from LF-ONTOLOGY-25": workshops, per-site configuration, validation, acceptance evidence | High: same principle, same entry price, same buyer                                             | (a) extend `LF-TRAIN-IND` scope (+ current-state mapping, concept workshops, ownership mapping, first skeleton) and band to €15–25k; or (b) new `LF-ONTOLOGY-START` and rename `LF-TRAIN-IND` to `_OLD` (never delete) |
| `LF-ONTOLOGY-PILOT` €15–25k                 | `LF-ONTOLOGY-25` feature: "Optional first-year one-site pilot licence: €15,000–€25,000 (quote)"                                                                                                   | High: same band as START; a buyer cannot tell a reduced licence from a service                 | Define the pilot as START + first-year reduced licence, or drop one of the two                                                                                                                                         |
| `LF-ONTOLOGY-EXPAND` from €25k              | None                                                                                                                                                                                              | —                                                                                              | New SKU; can wait for the first customer who asks (simplicity, no new features before M1)                                                                                                                              |
| Licence name "Independent Ontology License" | `LF-ONTOLOGY-25` display name "European Industry Ontology, 25 industries"                                                                                                                         | Name mismatch (§12.2 T7)                                                                       | Rename display name, or show both                                                                                                                                                                                      |
| —                                           | `LWM-ONT-SUITE` "LWM Ontology Suite — All 25 Industries", €14,990/year                                                                                                                            | A cheaper sibling of the same 25-industry family sharpens "miksi näin halpa?" and "mitä eroa?" | Position `LWM-ONT-SUITE` as data/intelligence and `LF-ONTOLOGY-25` as the named-site licence, or retire one                                                                                                            |

Any catalogue change is a public-site change (price list and buy page are rendered from `products.json`, root + `landing-pages/dws10-com/` mirror in the same commit). It goes in its own PR, not in PR #2093 (scope: CI and review fixes only).

### 13.3 HIC choices (24.09.2026) and draft catalogue text

HIC answers:

1. **Implementation and organising = extend `LF-TRAIN-IND`.** No new `LF-ONTOLOGY-START` SKU. `LF-TRAIN-IND` gets the added scope (current-state mapping, concept workshops, ownership mapping, first ontology skeleton). Its existing price lines stay (remote from €15,000, on-site from €25,000, complex €50–75k quote), which already cover the HIC band of €15–25k.
2. **Pilot = its own `LF-ONTOLOGY-PILOT` SKU.** The pilot line is removed from `LF-ONTOLOGY-25` (feature line and `priceNote` sentence).
3. `LF-ONTOLOGY-EXPAND` is not created now (no customer has asked for it yet).

Draft catalogue text (EN, as the catalogue is EN). Not applied; for HIC approval:

```text
LF-TRAIN-IND
name:        Ontology Implementation and Organisation (site configuration)
type:        one-time · per site · from €15,000
description: Optional one-time service, sold separately from the LF-ONTOLOGY-25 licence:
             current-state mapping, concept workshops, ownership mapping, a first ontology
             skeleton, per-site configuration, validation and acceptance evidence at a named
             factory or site (and, if the customer chooses, a sovereign model stack). The
             licence can be purchased without this service. Complex multi-system plants
             remain quote-only.
features:    + Scope: current-state mapping, concept workshops, ownership mapping,
               first ontology skeleton, deployment
             (all existing price and deliverable lines unchanged)

LF-ONTOLOGY-PILOT
name:        Independent Ontology Pilot, one site
type:        one-time · one named site · €15,000–€25,000 (quote)
description: Time-boxed one-site pilot before the annual LF-ONTOLOGY-25 licence: map the
             site's core concepts, build a first ontology on the 25-industry pack, and test
             the model with the customer's own questions. Includes pilot-period usage rights
             for one named site. The annual licence and ongoing support are not included.

LF-ONTOLOGY-25
features:    - "Optional first-year one-site pilot licence: €15,000–€25,000 (quote)"  (removed)
             + "Pilot before the licence: see LF-ONTOLOGY-PILOT"
priceNote:   sentence "First-year one-site pilot €15,000–€25,000 on request." replaced by
             "Pilot: LF-ONTOLOGY-PILOT."
```

Open for HIC before implementation: pilot length (months) and whether the pilot fee is credited toward the first licence year.

Implementation footprint (separate branch and PR, not PR #2093): `dws10.com/config/products.json` + `landing-pages/dws10-com/` mirror; catalogue version 1.30 → 1.31; `scripts/validate-product-publication.mjs` (`EXPECTED_INDEPENDENT_IDS`, `CATALOG_VERSION`); `scripts/gen-price-list-html.cjs`; regenerated price lists (EN/FI/SV/DE/FR, root + mirror, new versions file; old versions kept); buy page. Public on merge to main (Cloudflare Pages).

## 14. HIC release decision (24.09.2026)

Supersedes §7 for the product page only. This memo (price benchmark, catalogue analysis) stays confidential.

1. **Publish before M1: yes**, in a separate PR, with the truth-checked copy. The page claims only what is true today.
2. **Name: show both.** The marketing name is **Independent Ontology**; the official product name **European Industry Ontology (25 Industries)** is shown under it. `products.json` and the SKU code are unchanged.
3. **Final core claim (HIC, verbatim):** "Independent Ontology tarjoaa rakenteen, jonka avulla organisaatio voi säilyttää käsitteet ja niiden väliset suhteet yli järjestelmä-, toimittaja- ja teknologiasukupolvien sekä luoda perustan omistajuuksien ja päätösten perusteiden pitkäjänteiselle hallinnalle." Follow-up: "Independent Ontology on suunniteltu säilyttämään nämä yhteydet ymmärrettävinä myös vuosien päästä."
   - The HIC's alternative wording, kept for reference: "…käsitteet, niiden väliset suhteet ja yhteisen ymmärryksen … Samalla se luo perustan omistajuuksien, päätösten perusteiden ja organisaation tietopääoman pitkäjänteiselle hallinnalle." Follow-up: "…riippumatta siitä, mitä järjestelmiä, toimittajia tai tekoälymalleja organisaatio käyttää."
   - The HIC's three levels: true today (concepts, relations, shared understanding); a foundation for the future (ownership, decision reasoning); the long horizon (years ahead, changing technologies).
4. **Not on the public page before M1–M3:** Decision Flight Recorder, Verified Decision Journey, Learning Delta.

Implementation: PR [#2094](https://github.com/blogtheristo/dws6/pull/2094). It adds `dws10.com/products/independent-ontology.fi.html` and its mirror. The price is read from `products.json`. One wording change: "omistajuuksien hallintaan" became "perustan omistajuuksien hallinnalle", per rule 3 above. The page is not yet linked from the buy page, because `detailsUrl` serves all languages; an EN master page is the follow-up.

## 15. Product line published (24.09.2026)

HIC decisions, all live on main:

| Item          | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                            | Where                                                                             |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Product line  | `LF-ONTOLOGY-PILOT` (€15–25k, 3 months) → `LF-TRAIN-IND` (from €15k) → `LF-ONTOLOGY-25` (€25k/site-year) → tiers €60k / €120k / €200k+. No SKUs for the tiers.                                                                                                                                                                                                                                                                                      | PR #2094 (1.31), #2095 (1.32)                                                     |
| Pilot credit  | 100% of the pilot fee is credited against the first licence year when the licence is signed within **90 days** of the pilot's end. The HIC confirmed 90 days over 6 months after a conflicting answer.                                                                                                                                                                                                                                              | PR #2095                                                                          |
| Pilot success | Binary. The pilot succeeds if at least one goal is achieved and accepted by the customer (A business: 50 concepts, 100 relations, 3 reviewers, 80% assessed correct; B ownership: 20 objects, 90% owners, clear/unclear documented for each object, map accepted; C compliance: one regulatory area, one end-to-end chain, one audit concept map, model accepted). It ends in GO / HOLD / NO-GO. "Pilotti testaa meitä, ei teitä eikä teknologiaa." | PR #2095                                                                          |
| Sovereignty   | This is a product principle and an architecture requirement, not a pilot criterion. The customer owns its own model; the base pack and its updates are licensed; the customer's own model stays with the customer when the licence ends. The ontology can be delivered into own, private or air-gapped environments without a continuous connection, and it needs no DGX.                                                                           | PR #2095, `docs/specs/2026-09-24-independent-ontology-sovereignty-requirement.md` |
| Other pilots  | Align DWS-US-PILOT, DWS-EU-PILOT, DWS-AEGIS-PILOT-001 and AIS-OUTCOME-PILOT to the same structure. Soften the AIS guarantee.                                                                                                                                                                                                                                                                                                                        | Separate PR (catalogue 1.33), HIC review before merge                             |

Open items: legal review of the ownership and licence wording; an offline update procedure for air-gapped sites.
