---
branch: feat/aegis-translations-opencode
date: 2026-09-13
status: PENDING_COMPLETION
task: Complete SV/DE/FR translations + build HTML with hreflang
---

# Aegis Product Page Translation Completion Handoff

## Current State

**Status:** Translation foundation laid; EN+FI complete; SV/DE/FR are skeleton files awaiting translation.

### Files Present

- `scripts/i18n/aegis-products/en-strings.json` — ✓ COMPLETE (19 product sections, all fields filled)
- `scripts/i18n/aegis-products/fi-strings.json` — ✓ COMPLETE (19 product sections, Finnish translations)
- `scripts/i18n/aegis-products/sv-strings.json` — ✗ SKELETON (structure only, ~65 empty fields)
- `scripts/i18n/aegis-products/de-strings.json` — ✗ SKELETON (structure only, ~65 empty fields)
- `scripts/i18n/aegis-products/fr-strings.json` — ✗ SKELETON (structure only, ~65 empty fields)

### What Has Been Validated

- JSON syntax: ✓ all files valid
- Metadata: ✓ v1.0, dated 2026-09-13
- Structure: ✓ all 5 files have matching keys (19 sections each)
- EN/FI glossary alignment: ✓ verified (sovereign → suvereniteetti, single-tenant → yksihuolto, EDIP → EDIP, KYA → KYA)

### What's Missing

1. **SV translations** for all 19 sections (nav, hero, edip, why_aegis, financial_engine, sovereignty, technical_specs, agents, target_market, competitive, signal_trace, pricing, deployment_architecture, distribution, cta_final, ecosystem, page_version)
2. **DE translations** for all 19 sections
3. **FR translations** for all 19 sections
4. **HTML files with hreflang tags** (one per language: en, fi, sv, de, fr) linking to each other for SEO

---

## Translation Rules (Learn This Pattern)

### 1. Glossary Consistency Across Languages

Use these translations consistently across **all languages**:

| English Term                    | Finnish                              | Swedish                      | German                       | French                                  |
| ------------------------------- | ------------------------------------ | ---------------------------- | ---------------------------- | --------------------------------------- |
| sovereignty                     | suvereniteetti                       | suveränitet                  | Souveränität                 | souveraineté                            |
| single-tenant                   | yksihuolto (yksi vuokralainen)       | enrebell                     | Single-Tenant                | tenant unique                           |
| dual-use                        | kaksikäyttö                          | dubbelbruk                   | Dual-Use                     | usage double                            |
| EDIP                            | EDIP                                 | EDIP                         | EDIP                         | EDIP                                    |
| EU Defence Industrial Programme | EU:n puolustustehdasohjelma          | EU:s försvarsindustriprogram | EU-Rüstungsindustrieprogramm | Programme industriel de défense de l'UE |
| KYA (Know Your Agent)           | KYA (Tunne agentista)                | KYA (Känn din agent)         | KYA (Kenne deinen Agenten)   | KYA (Connaître votre agent)             |
| AI agents                       | tekoälyagentit                       | AI-agenter                   | KI-Agenten                   | agents IA                               |
| compliance                      | vaatimustenmukaisuus / noudattaminen | överensstämmelse             | Einhaltung / Compliance      | conformité                              |
| Firecracker MicroVM             | Firecracker MicroVM                  | Firecracker MicroVM          | Firecracker MicroVM          | Firecracker MicroVM                     |
| UpCloud                         | UpCloud                              | UpCloud                      | UpCloud                      | UpCloud                                 |
| NVIDIA DGX                      | NVIDIA DGX                           | NVIDIA DGX                   | NVIDIA DGX                   | NVIDIA DGX                              |
| Helsinki DC                     | Helsinki-datakeskus                  | Helsingfors datacenter       | Helsinki-Rechenzentrum       | centre de données Helsinki              |
| EU AI Act                       | EU:n tekoälyasetus                   | EU:s AI-förordning           | EU-KI-Verordnung             | Règlement IA de l'UE                    |
| NIS2                            | NIS2                                 | NIS2                         | NIS2                         | NIS2                                    |
| CSRD                            | CSRD                                 | CSRD                         | CSRD                         | CSRD                                    |
| CBAM                            | CBAM                                 | CBAM                         | CBAM                         | CBAM                                    |
| Kubernetes                      | Kubernetes                           | Kubernetes                   | Kubernetes                   | Kubernetes                              |
| PostgreSQL                      | PostgreSQL                           | PostgreSQL                   | PostgreSQL                   | PostgreSQL                              |

**Pattern:** Acronyms stay as-is (EDIP, KYA, NIS2, CSRD, CBAM); brand names stay as-is (UpCloud, NVIDIA, Kubernetes, Firecracker). Regulatory concepts and industrial terminology adapt to each language.

### 2. Tone Alignment

Each language section must **match the register and tone of the English source**, which is:

- **Technical but accessible** (not pure jargon, but precise)
- **Authority-driven** (DWS IQ is sovereign, deliberate, proven)
- **Regulatory/compliance-aware** (speaks the language of defence + EU law)
- **Not marketing-fluff** (every claim is specific and traceable to EDIP, KYA, or actual technical stack)

Check yourself: Would a Finnish/Swedish/German/French defence procurement officer recognize this as speaking their language and their concerns?

### 3. Section-by-Section Guidance

#### `meta`

- `version`: "1.0" (fixed)
- `date`: "2026-09-13" (fixed)
- `lang`: "sv" / "de" / "fr" (fixed per file)
- `page`: "aegis-product" (fixed)

#### `seo` (SEO titles, descriptions for search engines)

- `title`: Adapt the hero H1 + value proposition for SV/DE/FR search intent
  - EN: "DWS IQ Aegis — Sovereign Industrial Intelligence for Dual-Use Manufacturing | Lifetime Firehorse™Store"
  - FI: "DWS IQ Aegis — Suvereniteettiin perustuva teollinen älykkyys dual-use-valmistukseen | Lifetime Firehorse™Kauppa"
  - Pattern: `[PRODUCT] — [VALUE PROP] | [COMPANY][REGION]`

- `description`: 1–2 sentences emphasizing EDIP-readiness, EU sovereignty, availability Sept 2026
  - Keep the same claims, translate the regulatory/technical language to each locale

- `keywords`: Keep product names + regulatory terms + platform names + use cases
  - EN: DWS IQ, Aegis, sovereign AI, EU AI Act, UpCloud, Kubernetes, Helm, defence, dual-use, Finnish cloud
  - SV: DWS IQ, Aegis, suveränt AI, EU AI-förordning, UpCloud, Kubernetes, Helm, försvar, dubbelbruk, finländskt moln
  - DE: DWS IQ, Aegis, souveräne KI, EU-KI-Verordnung, UpCloud, Kubernetes, Helm, Verteidigung, Dual-Use, finnische Cloud
  - FR: DWS IQ, Aegis, IA souveraine, Règlement IA de l'UE, UpCloud, Kubernetes, Helm, défense, usage double, cloud finlandais

#### `nav` (navigation strings)

- Back to Store: "← Tillbaka till Butik", "← Zurück zum Shop", "← Retour au magasin"
- Keep product names and tier names (Aegis, DWS IQ) consistent
- Translate action verbs ("Compare deployments" → "Jämför distributioner", "Vergleiche Bereitstellungen", "Comparer les déploiements")

#### `hero` (main headline section)

- `h1`: "DWS IQ Aegis" (brand, stays same)
- `tagline`: Translate the value prop, keeping "Sovereign", "Industrial Intelligence", "Dual-Use Manufacturing" as core concepts
- `badge_*`: Translate but preserve dates (September 2026), acronyms (EDIP), and product names
- `intro`: Full paragraph; translate but check that regulatory/sovereignty claims map to the target language's regulatory context
  - **Important:** "zero US cloud dependencies" and "designed to reduce CLOUD Act exposure" are critical claims — translate these precisely, not loosely

#### `edip` (EU Defence Industrial Programme section)

- Translate regulatory references but keep article numbers exact (Article 9, €1.5 billion, etc.)
- The table entries ("EU Establishment", "Third-Country Control", etc.) must be precise legal language in each language
- Translate "ALIGNED" → "FÖRENLIG", "KONFORM", "CONFORME"
- Example: EN: "100% Finnish-owned, no US parent or corporate dependencies" → SV: "100% finländsk ägd, ingen amerikansk moderbolag eller överordnade beroendet" (or more natural SV phrasing)

#### `why_aegis` (5 key value props)

1. **Sovereignty** — DWS IQ unique claim, translate but preserve the assertion that Finnish UpCloud = zero US exposure
2. **Single-tenant** — Legal/technical term; use standard translation
3. **Dual-use compliance** — Keep the regulatory scope (NIS2, EU AI Act, Reg. 2021/821) but translate the narrative
4. **Deterministic factory execution** — Technical claim; translate but keep precision on "zero-hallucination", "auditable"
5. **EDIP-aligned** — Regulatory term; keep exact

#### `financial_engine` (compliance monetization narrative)

- Translate but preserve:
  - "Financial Alpha" (if established in Finnish / SV / DE / FR tech speak, adapt; otherwise leave as English term with explanation)
  - "Revised Product Liability Directive" (exact regulatory name, may need localized acronym or full name)
  - "KYA-tiered swarm deployments" (product term, keep as is; explain if needed)
  - The core thesis: compliance → cost savings → defensible evidence → insurer/court advantage

#### `sovereignty` (Three-Pillar Governance Framework)

- **Data Sovereignty (KYA SIB-track)** — Acronym KYA stays; SIB-track is a DWS internal term, keep as is
- **Technology Sovereignty (KYA CSB-track)** — Same; CSB = DWS internal track
- **Operational Sovereignty (KYA EAB-track)** — Same; EAB = DWS internal track
- The table: "PASS" / "FAIL" or equivalent pass/fail indicators in each language (or keep PASS in all languages)
- "R-Sac² Architecture" — DWS product name + Rightful Oy partnership; keep as is

#### `technical_specs` (21+ technical specifications)

- Infrastructure names stay same: UpCloud, Kubernetes, PostgreSQL, NVIDIA L40S, Valkey/Redis, Firecracker
- Translate the capability descriptions but not the product/tech names
- Regulatory references (GDPR, NIS2, EU AI Act) stay as acronyms
- SLA percentages (99.9%, 99.999%) stay as is
- Example: "Database | UpCloud Managed PostgreSQL + pgvector (HA, automated backups, Helsinki DC)"
  - SV: "Databas | UpCloud Managed PostgreSQL + pgvector (HA, automatiserade säkerhetskopior, Helsinki DC)"
  - DE: "Datenbank | UpCloud Managed PostgreSQL + pgvector (HA, automatisierte Sicherungen, Helsinki DC)"
  - FR: "Base de données | UpCloud Managed PostgreSQL + pgvector (HA, sauvegardes automatisées, centre de données Helsinki)"

#### `agents` (21 agent list)

- Agent names (ComplianceAgent, ArgusAgent, SiteSenseAgent, etc.) stay in English; DWS product naming
- Translate the capability descriptions, keeping regulatory/technical language precise
- Example:
  - EN: "ComplianceAgent | EU regulatory compliance (CSRD, ETS, CBAM, Fit for 55, EU AI Act)"
  - SV: "ComplianceAgent | EU-regelefterlevnad (CSRD, ETS, CBAM, Fit for 55, EU AI Act)"
  - DE: "ComplianceAgent | EU-Regulatorische Einhaltung (CSRD, ETS, CBAM, Fit for 55, EU-KI-Verordnung)"
  - FR: "ComplianceAgent | Conformité réglementaire de l'UE (CSRD, ETS, CBAM, Fit for 55, Règlement IA de l'UE)"

#### `pricing` (Tiers: Standard, Defence, Sovereign)

- Tier names stay in English (Aegis Standard, Aegis Defence, Aegis Sovereign)
- Prices stay as is (€59,990, €999/mo, etc.)
- Translate the included capabilities but keep acronyms (K8s = Kubernetes, L40S GPU = NVIDIA L40S GPU, Article 12 logging = EU AI Act Article 12 logging)
- "Onboarding + Integration", "Monthly" headers stay consistent across languages
- Example pricing note: The philosophical claim about "hardware bundling" and "software platform + governance layer" must be translated precisely — it's a commercial distinction

#### `deployment_architecture` (local, cloud, hybrid modes)

- Mode names: "Local / Edge", "EU-Sovereign Cloud", "Hybrid" — keep these consistent
- Translate the business logic (why control-room needs local, why development uses cloud, why hybrid makes sense) with full clarity
- Keep the supply-risk narrative ("models we adopt ship as open weights") and non-NVIDIA fallback path language
- Year-1 cost comparison (13× lower than Palantir, €72K Standard) — translate intro but keep numbers

#### `distribution` (channels)

- Channel names stay as-is (IFS Cloud Marketplace, SAP Store, Microsoft AppSource, DEFINE, Direct enterprise sales)
- Add regional/language context if helpful, but the core is channel names + marketplace references

#### `cta_final` (call-to-action)

- Button text: Translate "Schedule a Deployment Scoping Call" but keep the date (September 2026) and product name (DWS IQ Aegis)
- SV: "Schemalägg ett telefonsamtal om distributionsomfattning"
- DE: "Vereinbaren Sie einen Planungsgespräch zur Bereitstellung"
- FR: "Planifiez un appel d'étendue de déploiement"

#### `ecosystem` (full picture / next rung section)

- "The Full Picture", "sovereign hardware at the edge", "on-premise inference", "EU service team", "recurring NVIDIA-model relationship" — translate but preserve the supply-chain narrative

#### `page_version` (footer)

- Keep the version string format: "DWS IQ Aegis — product page v1.1 · 2026-06-23"
- Translate "product page" in each language but keep version number and date

### 4. Quality Checks (Before You Claim "Done")

For **each language** (SV, DE, FR):

1. **No empty strings** — every field in the JSON must have a non-empty value
2. **Glossary audit** — grep for key terms and confirm they match the table above
3. **Regulatory precision** — any EU regulation, acronym, or legal reference is correct
4. **Tone check** — read the hero + why_aegis + financial_engine sections aloud; do they sound authoritative and precise in that language?
5. **JSON syntax** — `python3 -m json.tool <file>` succeeds

---

## HTML Generation with hreflang (Learn This Pattern)

### Goal

Build 5 HTML files (one per language) with:

- Proper hreflang tags linking to all language variants
- Language flag or language selector UI
- SEO-friendly structure
- Consistency with existing `dws10.com/products/aegis.html` structure

### Expected Output Structure

```
dws10.com/products/aegis.en.html    (or /en/aegis.html)
dws10.com/products/aegis.fi.html    (or /fi/aegis.html)
dws10.com/products/aegis.sv.html    (or /sv/aegis.html)
dws10.com/products/aegis.de.html    (or /de/aegis.html)
dws10.com/products/aegis.fr.html    (or /fr/aegis.html)
```

### hreflang Implementation (Sample)

Each HTML file must include this in the `<head>`:

```html
<!-- Language links for SEO -->
<link rel="alternate" hreflang="en" href="https://dws10.com/products/aegis.en.html" />
<link rel="alternate" hreflang="fi" href="https://dws10.com/products/aegis.fi.html" />
<link rel="alternate" hreflang="sv" href="https://dws10.com/products/aegis.sv.html" />
<link rel="alternate" hreflang="de" href="https://dws10.com/products/aegis.de.html" />
<link rel="alternate" hreflang="fr" href="https://dws10.com/products/aegis.fr.html" />
<link rel="alternate" hreflang="x-default" href="https://dws10.com/products/aegis.en.html" />

<!-- Open Graph tags with language -->
<meta property="og:url" content="https://dws10.com/products/aegis.fi.html" />
<meta property="og:locale" content="fi_FI" />
<meta property="og:locale:alternate" content="sv_SE" />
<meta property="og:locale:alternate" content="de_DE" />
<meta property="og:locale:alternate" content="fr_FR" />
```

### Metadata Per Language

| Language | `og:locale` | `x-default`    | hreflang code |
| -------- | ----------- | -------------- | ------------- |
| English  | en_US       | YES (fallback) | en            |
| Finnish  | fi_FI       | NO             | fi            |
| Swedish  | sv_SE       | NO             | sv            |
| German   | de_DE       | NO             | de            |
| French   | fr_FR       | NO             | fr            |

### Language Selector UI (Recommended)

Add a simple language picker to the navigation or footer:

```html
<div class="language-selector">
  <a href="/products/aegis.en.html" lang="en">English</a>
  <a href="/products/aegis.fi.html" lang="fi">Suomi</a>
  <a href="/products/aegis.sv.html" lang="sv">Svenska</a>
  <a href="/products/aegis.de.html" lang="de">Deutsch</a>
  <a href="/products/aegis.fr.html" lang="fr">Français</a>
</div>
```

Or use flag icons + language names.

### Dual-Folder Sync Rule

Remember: **Both `dws10.com/` and `landing-pages/dws10-com/` must be kept in sync.**

```bash
# After creating dws10.com/products/aegis.{en,fi,sv,de,fr}.html
# Mirror to landing-pages:
cp dws10.com/products/aegis.*.html landing-pages/dws10-com/products/
```

Commit both in the same commit.

---

## Success Criteria

**Translation completion:**

- [ ] SV file: 0 empty strings, glossary consistent, tone authoritative
- [ ] DE file: 0 empty strings, glossary consistent, tone authoritative
- [ ] FR file: 0 empty strings, glossary consistent, tone authoritative
- [ ] All 5 JSON files pass `python3 -m json.tool` validation
- [ ] Spot-check: hero section reads naturally in all 5 languages

**HTML generation:**

- [ ] 5 HTML files created (en, fi, sv, de, fr) in `dws10.com/products/aegis.*.html`
- [ ] Each file includes hreflang tags linking to all 5 versions
- [ ] Each file includes og:locale + language-alternate metadata
- [ ] Language selector UI visible and functional
- [ ] Mirrored to `landing-pages/dws10-com/products/aegis.*.html`

**Commit:**

- Single commit with all JSON translations + all 10 HTML files (5 main + 5 mirror)
- Commit message: `feat: complete aegis-products translations (SV/DE/FR) and build multilingual HTML with hreflang`
- Attribution: Co-Authored-By as per CLAUDE.md

---

## What NOT to Do

1. **Don't use machine translation without review** — Human review of tone + legal accuracy required
2. **Don't split terms** — Use the glossary table; don't invent new translations per section
3. **Don't add marketing fluff** — Keep the register technical + regulatory, matching EN tone
4. **Don't ignore hreflang** — SEO requires all 5 files to know about each other
5. **Don't forget the dual-folder sync** — Both dws10.com and landing-pages must match in one commit

---

## Helper Scripts (Make Your Work Easier)

Three scripts have been created to automate validation and generation:

### 1. Validate Translations

```bash
./scripts/i18n/validate-translations.sh sv   # Check Swedish
./scripts/i18n/validate-translations.sh all  # Check all languages
```

**Output:** Confirms JSON syntax is valid and reports empty fields per language.

### 2. Check Glossary Consistency

```bash
./scripts/i18n/check-glossary.sh sv  # Verify glossary terms in Swedish
./scripts/i18n/check-glossary.sh de  # Verify glossary terms in German
./scripts/i18n/check-glossary.sh fr  # Verify glossary terms in French
```

**Output:** Reports which glossary terms are found and warns about missing ones.

### 3. Generate HTML with hreflang

```bash
python3 scripts/i18n/generate-hreflang-html.py
```

**Output:** Automatically generates:

- `dws10.com/products/aegis.{en,fi,sv,de,fr}.html` (5 files with hreflang tags)
- `landing-pages/dws10-com/products/aegis.{en,fi,sv,de,fr}.html` (mirrored)

**Use these scripts in this order:**

1. After translating each language → `./scripts/i18n/validate-translations.sh <lang>`
2. Before committing → `./scripts/i18n/check-glossary.sh <lang>` (for each of sv/de/fr)
3. Final step → `python3 scripts/i18n/generate-hreflang-html.py`

---

## Next Steps for OpenCode

1. **Translate SV/DE/FR** using the glossary table and section-by-section guidance above
2. **Validate JSON** with `./scripts/i18n/validate-translations.sh all`
3. **Check glossary** with `./scripts/i18n/check-glossary.sh {sv,de,fr}`
4. **Build HTML files** with `python3 scripts/i18n/generate-hreflang-html.py` (auto-generates + mirrors)
5. **Commit all** (translations + HTML) as one commit
6. **Return to Claude Code** for final audit + merge approval

---

## Timeline

- **Target completion:** 2026-09-14 (OpenCode to complete within 1 session)
- **Hand back to Claude Code for final audit** once translations + HTML are complete and committed

---

## Questions for OpenCode

- Are the glossary translations correct for your target market (Swedish, German, French)?
- Does the tone in each language match the technical + regulatory authority of the EN source?
- Are hreflang tags correctly implemented for SEO?

**Good luck!** This is a scalable pattern for all 109 products in the DWS IQ suite. Once validated on Aegis, you can apply it to the rest.
