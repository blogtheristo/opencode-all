#!/bin/bash
# Glossary consistency checker — looks for the *target-language* term, not English.
# Usage: ./scripts/i18n/check-glossary.sh [language-code]
set -euo pipefail

LANG_CODE="${1:-sv}"
FILE="scripts/i18n/aegis-products/${LANG_CODE}-strings.json"
GLOSSARY="docs/localization/aegis-glossary.json"

if [ ! -f "$FILE" ]; then
  echo "Error: $FILE not found"
  exit 1
fi

if [ ! -f "$GLOSSARY" ]; then
  echo "Error: $GLOSSARY not found"
  exit 1
fi

python3 - "$LANG_CODE" "$FILE" "$GLOSSARY" <<'PY'
import json, sys, re

lang, path, gloss_path = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.load(open(path, encoding="utf-8"))
gloss = json.load(open(gloss_path, encoding="utf-8"))
blob = json.dumps(data, ensure_ascii=False)

print(f"Glossary Consistency Check for {lang}:\n")
missing = 0
banned_hits = 0
for key, row in gloss.items():
    expected = row.get(lang)
    if not expected or expected in ("EDIP", "Aegis", "Kubernetes", "Firecracker", "CLOUD Act", "DWS IQ"):
        continue
    if expected == row.get("en"):
        continue
    if expected.lower() not in blob.lower():
        print(f"⚠️  '{expected}' ({key}) not found in {path}")
        missing += 1
    else:
        print(f"✓ '{expected}' ({key})")

banned = {
    "sv": ["enrebell", "Souverän", "Dataspårighet"],
    "de": ["Wissen Sie Ihren Agenten"],
    "fr": ["Monolocalisation"],
}
for token in banned.get(lang, []):
    if token.lower() in blob.lower():
        print(f"✗ banned token present: {token}")
        banned_hits += 1

print(f"\n{missing} glossary term(s) not present in copy (advisory).")
sys.exit(1 if banned_hits else 0)
PY
