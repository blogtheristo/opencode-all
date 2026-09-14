---
task: Fix SV/FR translation structure (array → object format)
priority: CRITICAL
branch: feat/aegis-translations-opencode
status: BLOCKING_HTML_GENERATION
date_created: 2026-09-14
---

# Fix SV/FR Translation Structure — Detailed Guide for OpenCode

## The Problem

You translated SV and FR, but in the **wrong structure**. The files won't work with the HTML generator.

```
❌ CURRENT (WRONG):
{
  "src": "...",
  "count": 166,
  "strings": [
    "string 1",
    "string 2",
    ...
  ]
}

✅ REQUIRED (CORRECT):
{
  "meta": {...},
  "seo": {...},
  "nav": {...},
  "hero": {...},
  ...
}
```

---

## Why This Matters

The HTML generator script expects **named sections** (meta, seo, nav, hero, edip, agents, pricing, etc.), not a flat array of 166 unnamed strings. The array format loses the context of where each string belongs.

---

## Solution: Map 166 Strings Back to Object Structure

The 166 strings in the array were extracted from the EN source. You need to **reverse the process** and map them back into the correct sections.

### Step 1: Get the String-to-Section Mapping

Use the **EN file as your master reference** to understand which strings belong in which sections:

```bash
# View the EN structure and understand the section hierarchy
python3 << 'EOF'
import json

with open('scripts/i18n/aegis-products/en-strings.json') as f:
    en = json.load(f)

# Print all section names and how many keys each has
for section, content in en.items():
    if isinstance(content, dict):
        key_count = len(content)
        print(f"{section}: {key_count} keys")
        # Show first key from each section
        if content:
            first_key = list(content.keys())[0]
            print(f"  └─ first key: {first_key}")

EOF
```

Expected output:

```
meta: 4 keys
  └─ first key: version
seo: 7 keys
  └─ first key: title
nav: 7 keys
  └─ first key: back_to_store
hero: 7 keys
  └─ first key: h1
edip: 6 keys
  └─ first key: h2
why_aegis: 5 keys
  └─ first key: h2
financial_engine: 3 keys
  └─ first key: h2
sovereignty: 7 keys
  └─ first key: h2
technical_specs: 21 keys
  └─ first key: h2
agents: 3 keys
  └─ first key: h2
target_market: 5 keys
  └─ first key: h2
competitive: 4 keys
  └─ first key: h2
signal_trace: 4 keys
  └─ first key: h2
pricing: 4 keys
  └─ first key: h2
deployment_architecture: 7 keys
  └─ first key: h3
distribution: 2 keys
  └─ first key: h2
cta_final: 1 keys
  └─ first key: button
ecosystem: 3 keys
  └─ first key: tag
page_version: 1 keys
  └─ first key: (value itself, not a key)
```

### Step 2: Use This Restructuring Script

This Python script will automatically convert your SV/FR array format into the correct object structure:

```bash
cat > /tmp/fix_translation_structure.py << 'SCRIPT'
#!/usr/bin/env python3
"""
Convert array-based translation (166 strings) back to object structure.
Usage: python3 /tmp/fix_translation_structure.py sv > scripts/i18n/aegis-products/sv-strings.json
"""

import json
import sys

if len(sys.argv) < 2:
    print("Usage: python3 fix_translation_structure.py <lang>")
    sys.exit(1)

lang = sys.argv[1]
array_file = f"scripts/i18n/aegis-products/{lang}-strings.json"
en_file = "scripts/i18n/aegis-products/en-strings.json"

# Load the English structure (master reference)
with open(en_file) as f:
    en_data = json.load(f)

# Load the translated array
with open(array_file) as f:
    array_data = json.load(f)

strings = array_data.get("strings", [])
string_index = 0

# Rebuild the structure section by section
result = {}

for section_name, section_content in en_data.items():
    if not isinstance(section_content, dict):
        # Handle non-dict sections (like page_version which is just a string)
        if string_index < len(strings):
            result[section_name] = strings[string_index]
            string_index += 1
        continue

    result[section_name] = {}

    for key in section_content.keys():
        if string_index < len(strings):
            result[section_name][key] = strings[string_index]
            string_index += 1
        else:
            print(f"WARNING: Not enough strings for {section_name}.{key}", file=sys.stderr)
            result[section_name][key] = ""

# Output the restructured JSON
print(json.dumps(result, ensure_ascii=False, indent=2))
SCRIPT

# Run the script for SV
python3 /tmp/fix_translation_structure.py sv > scripts/i18n/aegis-products/sv-strings.json

# Run the script for FR
python3 /tmp/fix_translation_structure.py fr > scripts/i18n/aegis-products/fr-strings.json
```

### Step 3: Verify the Fix

```bash
# Check structure is now correct
python3 << 'EOF'
import json

for lang in ['sv', 'fr']:
    file = f"scripts/i18n/aegis-products/{lang}-strings.json"
    with open(file) as f:
        data = json.load(f)

    print(f"\n{lang.upper()} Structure Check:")
    print(f"  Has 'meta' section? {('meta' in data)}")
    print(f"  Has 'seo' section? {('seo' in data)}")
    print(f"  Has 'nav' section? {('nav' in data)}")
    print(f"  Has 'hero' section? {('hero' in data)}")

    if 'meta' in data and isinstance(data['meta'], dict):
        print(f"  meta.version = {data['meta'].get('version', 'MISSING')}")
        print(f"  meta.lang = {data['meta'].get('lang', 'MISSING')}")

EOF
```

Expected output:

```
SV Structure Check:
  Has 'meta' section? True
  Has 'seo' section? True
  Has 'nav' section? True
  Has 'hero' section? True
  meta.version = 1.0
  meta.lang = sv

FR Structure Check:
  Has 'meta' section? True
  Has 'seo' section? True
  Has 'nav' section? True
  Has 'hero' section? True
  meta.version = 1.0
  meta.lang = fr
```

### Step 4: Validate the Fix

```bash
# Validate JSON syntax
for lang in sv fr; do
  echo -n "$lang: "
  if python3 -m json.tool scripts/i18n/aegis-products/${lang}-strings.json > /dev/null 2>&1; then
    echo "✓ Valid JSON"
  else
    echo "✗ INVALID JSON"
  fi
done

# Count empty fields
for lang in sv fr; do
  python3 << EOF
import json
with open('scripts/i18n/aegis-products/${lang}-strings.json') as f:
    data = json.load(f)

empty_count = 0
for section, content in data.items():
    if isinstance(content, dict):
        for key, value in content.items():
            if value == "":
                empty_count += 1

print(f"$lang: {empty_count} empty fields")
EOF
done

# Run the helper validation script
./scripts/i18n/validate-translations.sh sv
./scripts/i18n/validate-translations.sh fr
```

Expected output:

```
sv: ✓ Valid JSON
fr: ✓ Valid JSON
sv: 0 empty fields
fr: 0 empty fields
```

---

## Step 5: Spot-Check One Section (Glossary Consistency)

Verify that glossary terms are consistent across all 4 languages (EN/FI/SV/FR):

```bash
python3 << 'EOF'
import json

files = {
    'en': 'scripts/i18n/aegis-products/en-strings.json',
    'fi': 'scripts/i18n/aegis-products/fi-strings.json',
    'sv': 'scripts/i18n/aegis-products/sv-strings.json',
    'fr': 'scripts/i18n/aegis-products/fr-strings.json',
}

data = {}
for lang, path in files.items():
    with open(path) as f:
        data[lang] = json.load(f)

# Spot-check: EDIP section titles
print("EDIP Section Titles:")
for lang in ['en', 'fi', 'sv', 'fr']:
    title = data[lang].get('edip', {}).get('h2', '')
    print(f"  {lang.upper()}: {title[:70]}")

print("\nSovereignty value prop:")
for lang in ['en', 'fi', 'sv', 'fr']:
    sovereignty = data[lang].get('why_aegis', {}).get('items', {}).get('sovereignty', '')
    print(f"  {lang.upper()}: {sovereignty[:70]}...")

EOF
```

Expected output shows translations present in all 4 languages (not empty).

---

## Step 6: Generate HTML Files

Once the structure is fixed and validated:

```bash
python3 scripts/i18n/generate-hreflang-html.py
```

Expected output:

```
✓ All HTML files generated successfully!
  Main files:    dws10.com/products/aegis.*.html
  Mirror files:  landing-pages/dws10-com/products/aegis.*.html
```

---

## Step 7: Commit

```bash
git add scripts/i18n/aegis-products/sv-strings.json scripts/i18n/aegis-products/fr-strings.json

git add dws10.com/products/aegis.*.html landing-pages/dws10-com/products/aegis.*.html

git commit -m "fix: restructure SV/FR translations to object format + generate multilingual HTML with hreflang

- Convert SV/FR from array format (166 strings) to object structure (19 sections)
- Ensures compatibility with HTML generator and glossary validation
- Generate 10 HTML files (5 main + 5 landing-pages mirror) with proper hreflang tags
- All 4 languages (EN/FI/SV/FR) now have consistent object structure"

git push origin feat/aegis-translations-opencode
```

---

## Complete Checklist Before You're Done

- [ ] **Structure Fixed**: `python3 << 'EOF' ... EOF` shows 'meta', 'seo', 'nav', 'hero' sections present in SV and FR
- [ ] **JSON Valid**: `python3 -m json.tool` succeeds for both SV and FR
- [ ] **Empty Fields**: 0 empty fields in SV and FR
- [ ] **Glossary Spot-Check**: EDIP, sovereignty, KYA terms are translated (not empty) in all 4 languages
- [ ] **HTML Generated**: 10 files exist (5 main + 5 landing-pages)
- [ ] **hreflang Tags**: Each HTML file includes `<link rel="alternate" hreflang="..."`
- [ ] **Committed**: All changes pushed to remote
- [ ] **German Still Pending**: DE file is still skeleton (will be handed back for translation in separate step)

---

## Why Structure Matters

**The HTML generator expects this flow:**

```
SV/FR JSON (object format)
  ↓
Python script reads meta.version, meta.lang, meta.date
  ↓
Script reads seo.title, seo.description, seo.og_title (for <head>)
  ↓
Script reads hero.h1, hero.tagline, hero.intro (for <h1>, <h2>, content)
  ↓
Script iterates through all sections, building the page content
  ↓
Adds hreflang tags linking all 4 languages together
  ↓
Writes to dws10.com/products/aegis.sv.html (+ landing-pages mirror)
```

**Array format breaks this because:**

- No section names → can't find which string belongs where
- 166 unnamed strings → generator doesn't know if a string is a title, description, or body text
- No metadata context → can't build proper <head> tags

---

## If Something Goes Wrong

**Problem:** Script says "Not enough strings"

- **Solution:** Count the strings in your array vs. EN structure. EN has exactly 166 strings total. If you have fewer, some translations are missing.

**Problem:** German (DE) still shows empty fields

- **Solution:** DE is still a skeleton awaiting translation. Focus on SV/FR restructuring first. DE will be translated in a separate step.

**Problem:** HTML generator can't find the sections

- **Solution:** Run the spot-check Python script above to verify structure is correct. If meta/seo/nav are missing, the restructuring didn't work.

---

## Next Steps After You're Done

1. Push the fixed SV/FR + generated HTML to remote
2. Hand back to Claude Code for final audit
3. Claude Code will verify structure + hreflang + glossary consistency
4. Once approved, merge to main

---

**You have everything you need.** Run the restructuring script, validate, generate HTML, commit, and push. 🚀
