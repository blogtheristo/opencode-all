# OpenCode Translation Task: Complete SV/DE/FR for Aegis Product Page

**Branch:** `feat/aegis-translations-opencode`  
**Status:** FI translation complete + structured; SV/DE/FR ready for population  
**Commit:** d6235d329 (committed, pushed)

---

## What's Done ✅

- `fi-strings.json` — Finnish translation **complete** with v1.0 metadata
- `sv-strings.json`, `de-strings.json`, `fr-strings.json` — **structured skeletons** with all keys in place (empty values ready for translation)
- JSON syntax validated and committed

---

## Your Task: Translate SV/DE/FR

### Step 1: Swedish (sv-strings.json)

Translate all empty strings in `scripts/i18n/aegis-products/sv-strings.json` into Swedish.

**Reference materials:**

- Glossary: `docs/localization/aegis-glossary.json` — use for consistent terminology (sovereign = "souverän", etc.)
- Precedent: `/aegis/index.sv.html` — approved Swedish tone for defence/sovereignty language
- English source: `en-strings.json` — reference for content structure
- Finnish precedent: `fi-strings.json` — already translated, use for terminology alignment

**Key terms (consult glossary):**

- `sovereign` → SV: "souverän"
- `dual-use` → SV: "dubbelbruk"
- `single-tenant` → SV: "enskild klient"
- Agent names stay in English (ComplianceAgent, VulcanAgent, GaiaAgent, etc.)

**Validation:**

- All 200+ strings must be filled (no empty values)
- JSON must be valid: `node -e "JSON.parse(require('fs').readFileSync('scripts/i18n/aegis-products/sv-strings.json'))"`
- Every glossary term must match the glossary exactly

### Step 2: German (de-strings.json)

Translate all empty strings in `scripts/i18n/aegis-products/de-strings.json` into German.

**Reference materials:**

- Glossary: `docs/localization/aegis-glossary.json`
- Precedent: `/aegis/index.de.html` — approved German tone
- English source: `en-strings.json`

**Key terms:**

- `sovereign` → DE: "souverän"
- `dual-use` → DE: "Dual-Use"
- `single-tenant` → DE: "einzelner Mandant"
- Agent names stay in English

**Validation:**

- All 200+ strings filled
- JSON valid
- Glossary terms consistent

### Step 3: French (fr-strings.json)

Translate all empty strings in `scripts/i18n/aegis-products/fr-strings.json` into French.

**Reference materials:**

- Glossary: `docs/localization/aegis-glossary.json`
- Precedent: `/aegis/index.fr.html` — approved French tone
- English source: `en-strings.json`

**Key terms:**

- `sovereign` → FR: "souverain"
- `dual-use` → FR: "double usage"
- `single-tenant` → FR: "client unique"
- Agent names stay in English

**Validation:**

- All 200+ strings filled
- JSON valid
- Glossary terms consistent

---

## Commit Instructions

Once all 3 languages are translated and validated:

```bash
git add scripts/i18n/aegis-products/{sv,de,fr}-strings.json
git commit -m "feat: complete SV/DE/FR translations for Aegis (v1.0)"
git push origin feat/aegis-translations-opencode
```

**Do NOT merge the PR** — await HIC review.

---

## Success Criteria

- [ ] All 3 language files (SV/DE/FR) have all keys populated (no empty strings)
- [ ] JSON syntax valid for all 3 files
- [ ] Every glossary term identical to `docs/localization/aegis-glossary.json`
- [ ] Tone consistent with precedent files (`/aegis/index.{sv,de,fr}.html`)
- [ ] Commit message references v1.0 metadata
- [ ] Branch pushed to remote

---

**OpenCode: You have everything you need. Start with Swedish, validate at each step, then repeat for German and French. Stop when commit is pushed.**
