#!/bin/bash
# Glossary consistency checker for aegis-products translations
# Usage: ./scripts/i18n/check-glossary.sh [language-code]
# Example: ./scripts/i18n/check-glossary.sh sv

LANG_CODE="${1:-sv}"
FILE="scripts/i18n/aegis-products/${LANG_CODE}-strings.json"

if [ ! -f "$FILE" ]; then
  echo "Error: $FILE not found"
  exit 1
fi

echo "Glossary Consistency Check for $LANG_CODE:"
echo ""

# Define glossary mappings (add more as needed)
declare -A glossary

# Swedish glossary
if [ "$LANG_CODE" = "sv" ]; then
  glossary["sovereign"]="suveränitet"
  glossary["single.tenant"]="enrebell"
  glossary["dual.use"]="dubbelbruk"
  glossary["EDIP"]="EDIP"
  glossary["KYA"]="KYA"

# German glossary
elif [ "$LANG_CODE" = "de" ]; then
  glossary["sovereign"]="Souveränität"
  glossary["single.tenant"]="Single-Tenant"
  glossary["dual.use"]="Dual-Use"
  glossary["EDIP"]="EDIP"
  glossary["KYA"]="KYA"

# French glossary
elif [ "$LANG_CODE" = "fr" ]; then
  glossary["sovereign"]="souveraineté"
  glossary["single.tenant"]="tenant unique"
  glossary["dual.use"]="usage double"
  glossary["EDIP"]="EDIP"
  glossary["KYA"]="KYA"

else
  echo "Glossary not defined for $LANG_CODE"
  exit 1
fi

# Check for key terms (case-insensitive)
for term in "${!glossary[@]}"; do
  expected="${glossary[$term]}"
  # Convert term underscores to space for grep
  search_term=$(echo "$term" | tr '.' ' ')

  count=$(grep -io "$search_term" "$FILE" 2>/dev/null | wc -l || echo "0")

  if [ "$count" -gt 0 ]; then
    echo "✓ '$search_term' found $count times (expected translation: '$expected')"
  else
    echo "⚠️  '$search_term' NOT found (expected translation: '$expected')"
  fi
done

echo ""
echo "Manual review recommended:"
echo "  - Check that all occurrences of the above terms match the expected translations"
echo "  - Use: grep -i 'sovereign' $FILE"
