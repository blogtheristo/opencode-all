#!/bin/bash
# Translation validator for aegis-products
# Detects and validates both array format (166 strings) and object format (19 sections)
# Usage: ./scripts/i18n/validate-translations.sh [language-code]
# Example: ./scripts/i18n/validate-translations.sh sv

set -e

LANG_CODE="${1:-all}"
BASE_DIR="scripts/i18n/aegis-products"

check_json() {
  local file=$1
  local lang=$2
  echo "Checking $lang..."

  if python3 -m json.tool "$file" > /dev/null 2>&1; then
    # Analyze structure and count empty fields
    python3 << EOF
import json
with open('$file') as f:
    data = json.load(f)

# Detect format
has_array = "strings" in data and isinstance(data.get("strings"), list)
has_object_sections = any(k in data for k in ['meta', 'seo', 'nav', 'hero'])

if has_array:
    # Array format (166 strings)
    strings = data.get("strings", [])
    print(f"  ℹ️  Array format detected ({len(strings)} strings)")
    if len(strings) != 166:
        print(f"  ⚠️  Expected 166 strings, found {len(strings)}")

    # Check for empty strings
    empty = sum(1 for s in strings if s == "")
    if empty == 0:
        print(f"  ✓ Valid JSON, all {len(strings)} strings filled")
    else:
        print(f"  ⚠️  Valid JSON but {empty} empty strings found")

elif has_object_sections:
    # Object format (19 sections)
    print(f"  ℹ️  Object format detected (meta, seo, nav, hero, ...)")

    # Count empty fields in object structure
    empty_count = 0
    for section, content in data.items():
        if isinstance(content, dict):
            for key, value in content.items():
                if value == "":
                    empty_count += 1

    if empty_count == 0:
        print(f"  ✓ Valid JSON, no empty fields (ready for HTML generation)")
    else:
        print(f"  ⚠️  Valid JSON but {empty_count} empty fields found")
else:
    print(f"  ⚠️  Unknown format (neither array nor object sections)")

EOF

    return 0
  else
    echo "  ✗ INVALID JSON"
    python3 -m json.tool "$file" 2>&1 | head -20
    return 1
  fi
}

# Validate single language or all
if [ "$LANG_CODE" = "all" ]; then
  for file in "$BASE_DIR"/*-strings.json; do
    lang=$(basename "$file" | cut -d- -f1)
    check_json "$file" "$lang" || true
  done
else
  file="$BASE_DIR/${LANG_CODE}-strings.json"
  if [ -f "$file" ]; then
    check_json "$file" "$LANG_CODE"
  else
    echo "File not found: $file"
    exit 1
  fi
fi
