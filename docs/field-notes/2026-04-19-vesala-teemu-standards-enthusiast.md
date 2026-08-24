# Teemu Vesala — Standardit rakastajan kirja & neuvonantajakandidaatti

**Date:** 2026-04-19
**Author:** Risto Päärni / Lifetime Oy
**Source:** Teemu Vesala — LinkedIn-julkaisu (FI), 2026-04-19
**Type:** Market Intelligence / Advisor Pipeline / Standards Knowledge Base

---

## Location

LinkedIn (remote), Finland market context.

## Context

Advisor-pipeline screening for standards coverage expansion in DWS IQ 6 and Lifetime Fleet.

## The Story

Teemu Vesala publicly described deep hands-on work across standards-driven protocol implementation, conformance testing, and security assessment. That signal matched an existing DWS gap: strong EU regulatory coverage, but weaker documented process/quality standards (ASPICE, SQuaRE).

## The Insight

Standards competence is a commercial gate, not just a documentation detail. Elevating ASPICE and SQuaRE in the standards registry improves enterprise RFP readiness and aligns product quality metrics with audit language buyers already trust.

## Next Steps

1. Execute advisor outreach and evaluate fit for a part-time Standards & Compliance Advisor role.
2. Continue with ASPICE/SQuaRE roadmap actions listed in `docs/DWS6_TO_DWS7_UPDATE.md`.
3. Validate new standards and status labels on customer-facing catalogue pages during each standards-library update.

---

## Ontology Tags

- **Geography:** Europe > Finland > Nordic
- **Sector:** Quality_Engineering > Protocol_Testing > Security_Assessment > Process_Standards
- **Entities:** Teemu Vesala, ISO/IEC 33000 (SPICE), ISO/IEC 25010 (SQuaRE), IETF RFC 2131 (DHCP), GDPR
- **Temporal Context:** 2026-Q2, advisor pipeline expansion, DWS standards library growth
- **Confidence:** High (primary source — oma julkaisu suoraan kirjoittajalta)

---

## Yhteenveto

Teemu Vesala kirjoitti 2026-04-19 LinkedIn-postauksen, jossa avautui ääneen tykkäävänsä standardeista — laatu-, protokolla- ja prosessistandardeista. Kertoi urallaan tehneensä standardinmukaisia protokollaimplementaatioita, standardinmukaisuuden testausta, tietoturva-arviointeja, dokumentaatiovaatimusten mukaista työtä ja infrastruktuurin suunnittelua standardien pohjalta.

Mainitut lyhenteet: **SPICE, SQuaRE, DHCP, GDPR** (ja muita — Teemu luetteli "just name it"). Lisäksi heitti, että regulaatioiden tukemaa maailmaa kaipaa — ei vain käsienheiluttelua.

*Huom: Teemu mainitsi myös HIPAA:n, mutta se ei ole DWS:n scopessa (ei US-terveydenhuoltoa) — ei käsitellä tässä analyysissä.*

Itseironiaa: "piirrostaidot riittävät juuri ja juuri pääjalkaisiin ja kieroon tikku-ukkoon" — eli AI-kuvituksiin olisi kiinnostusta.

---

## Standardien kartoitus — mitä Teemu tuntee vs. mitä DWS:llä on

| Standardi                  | Teema         | Teemu | DWS / Lifetime nykyinen kattavuus       |
| -------------------------- | ------------- | :---: | --------------------------------------- |
| **SPICE / ISO/IEC 33000**  | Prosessi      |   ✅   | ❌ Puuttuu (Automotive SPICE tarvitaan Lifetime Fleetille) |
| **SQuaRE / ISO/IEC 25010** | Laatu         |   ✅   | ❌ Puuttuu (ohjelmistolaatu, KYA-relevantti) |
| **DHCP / RFC 2131**        | Protokolla    |   ✅   | ⚠️ Ei oma tuote, mutta edge-laitteet (Acer, DGX) käyttävät |
| **GDPR**                   | Sääntely       |   ✅   | ✅ Kattavasti (`DWS_DATA_STANDARD.md`, Sovereign Database) |
| **EU AI Act**              | AI-sääntely    |   –   | ✅ Artikla 12 lokitus, omnibus-seuranta |
| **CBAM / ETS / CSRD / ESRS** | Kestävyys   |   –   | ✅ Kattavasti (`src/compliance/`)       |
| **NIS2**                   | Tietoturva     |   –   | ✅ Sovereign Database -positiointi       |
| **ISO 27001**              | ISMS           |   –   | ⚠️ Viitattu, ei omaa implementaatiota   |
| **ISO 9001**               | Laadunhallinta |   –   | ❌ Puuttuu                               |

**Kate-analyysi:** Teemun vahvuusalueista **SPICE ja SQuaRE puuttuvat DWS:n standardikirjastosta kokonaan.** DHCP on epäsuorasti käytössä mutta ei dokumentoitu. ISO 9001 / ISO 27001 olisi luonnollinen laajennus.

---

## Pitäisikö laajentaa standardikirjastoa?

**Kyllä, kohdennetusti.** Nykyinen kattavuus on vahva sääntely- ja kestävyyspuolella (EU AI Act, CBAM, ETS, CSRD, NIS2, GDPR), mutta **prosessi- ja laatustandardit ovat sokean pisteen**. Kaksi syytä laajentaa:

1. **Lifetime Fleet tarvitsee Automotive SPICE:n** — robotti/ajoneuvopuolella ilman ASPICE-kypsyystasoa ei pääse teolliseen myyntiin (Bosch, Continental, Volvo edellyttävät)
2. **SQuaRE (ISO/IEC 25010) on ohjelmistolaadun mittaristo** — KYA:n trust score, Sovereign Database -arviointiraportti ja agentic workflows hyötyisivät yhteismitallisesta laatumetriikasta (functional suitability, reliability, security, maintainability)

**Ei-laajennettavat:** DHCP ja vastaavat matalan tason protokollat — eivät ole DWS-tuotteiden ytimessä, jätetään edge-laitteiden vendoreiden huoleksi. HIPAA on US-terveydenhuollon standardi, ei DWS:n EU-sovereniteetti-scopessa.

**Toimenpide:** Luo `DWS_STANDARDS_LIBRARY.md` hakemisto, joka indeksoi kaikki DWS:n käytössä olevat standardit, niiden versiot, sovellusalueet ja vastuuhenkilöt — sama logiikka kuin `product-catalog/README.md`:ssa. Tämä on SKILL OPPORTUNITY: `/standards-lookup` kyselykomennolle, joka palauttaa standardin summary + DWS:n sovellustavan.

---

## Relevanssi DWS / Lifetime Oy

### Advisor-pipeline

Teemun profiili (protokollaimplementaatio + standardinmukaisuuden testaus + tietoturva-arviointi + dokumentaatiodiscipliini) on harvinaisen osuva DWS:n tarpeisiin:

| DWS-tarve                                    | Teemun vahvuus                                 |
| -------------------------------------------- | ---------------------------------------------- |
| MCP-protokollan conformance-testaus          | Protokollatestauskokemus                        |
| Sovereign Database audit-raporttien muotoilu | Standardinmukainen dokumentaatiokokemus          |
| KYA trust score -mittariston validointi      | ISO/IEC 25010 SQuaRE:n tuntemus                  |
| Article 12 lokituksen compliance             | GDPR + regulaatiokokemus                         |
| Lifetime Fleet ASPICE-kypsyystaso            | Prosessistandardien tuntemus                     |
| Agenttien testaus ja validointi              | Yleinen standardi-based test engineering -mindset |

### Kulttuurinen yhteensopivuus

- **"En keksi kun nuo kaksi lyhennettä"** (#standardit #nörtti) — sama itseironia kuin DWS:n sisäisessä viestinnässä
- **Kaipaa regulaatioita projekteissa** — DWS:n koko identiteetti rakentuu regulaatioiden hyödyntämiseen kilpailuetuna (EU AI Act, CBAM, NIS2)
- **AI-kuvitusten opettelu kiinnostaa** — sopii DWS:n picture-prompts.md -käytäntöön ja Nano Banana / Gemini -työnkulkuihin

### Neuvonantajapositio

Ehdotus: **Standards & Compliance Advisor**, osa-aikainen/projektiluonteinen:

- Auditoi DWS:n standardikirjasto, tunnista aukot
- Validoi Sovereign Database -arviointiraportin muotoilu auditointikelpoiseksi
- ASPICE-roadmap Lifetime Fleetille
- SQuaRE-pohjainen laatumittaristo agenteille

---

## Toimenpiteet

1. ☐ Lähetä Teemulle ystävällinen neuvonantajakutsu (valmis copy-paste alla)
2. ✅ **Tehty 2026-04-19:** Luotu `DWS_STANDARDS_LIBRARY.md` (SPICE, SQuaRE, ISO 27001, ISO 9001, protokollat, raportointistandardit) + rekisteröity `CLAUDE.md`:hen
3. ✅ **Tehty 2026-04-19:** Luotu asiakassivu `dws10.com/enterprise-integrations/` joka näyttää kaikki integraatiot + niihin liittyvät standardit (ERP / ESG / Edge / Identity / Data / KYA)
4. ☐ Harkitse `/standards-lookup` skillin luomista (CSO-trigger: "what standard applies to X")
5. ☐ Jos Teemu liittyy: aloita ASPICE-gap-analyysilla Lifetime Fleetille (roadmap: DWS IQ 7 Phase 3 / Aug-Oct 2026)
6. ☐ Lisää Teemun profiili `Admin/ADVISORS.md`-hakemistoon (jos hyväksyy)

---

## Alkuperäinen lähde

Teemu Vesala, LinkedIn-postaus 2026-04-19
Hashtagit: #standardit #nörtti
Avainsana-lyhenteet (DWS-scopessa): SPICE, SQuaRE, DHCP, GDPR
