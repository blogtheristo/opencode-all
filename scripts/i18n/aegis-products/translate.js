const fs = require('fs');

// Read the English file (which has the correct format with 'strings' array)
const enData = JSON.parse(fs.readFileSync('./scripts/i18n/aegis-products/en-strings.json', 'utf8'));

// Extract just the strings array (this is what the build tool expects)
const enStrings = enData.strings || [];

// Helper function to get flat list of all translatable strings from the original structure
function getFlatStrings(data) {
  const strings = [];
  
  function flatten(obj) {
    if (typeof obj === 'string') {
      strings.push(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(flatten);
    } else if (typeof obj === 'object' && obj !== null) {
      Object.values(obj).forEach(flatten);
    }
  }
  
  flatten(data);
  return strings;
}

// Generate translation files for each language (FI/SV/DE/FR) with the correct format
const languages = ['fi', 'sv', 'de', 'fr'];
const glossary = require('./../../docs/localization/aegis-glossary.json');

languages.forEach(lang => {
  const fileName = `./scripts/i18n/aegis-products/${lang}-strings.json`;
  
  // Read the corresponding translation if it exists already
  let translatedStrings = null;
  try {
    const existing = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    translatedStrings = existing.strings || [];
  } catch (err) {
    // If it doesn't exist, we'll generate a dummy translation
    console.log(`Creating dummy translation for ${lang}`);
    translatedStrings = enStrings.map(() => `TRANSLATION NEEDED FOR ${lang}`);
  }
  
  // Validate that the count matches
  if (translatedStrings.length !== enStrings.length) {
    console.log(`Warning: ${lang} translation count (${translatedStrings.length}) doesn't match English (${enStrings.length})`);
    // Pad or truncate as needed
    while (translatedStrings.length < enStrings.length) translatedStrings.push(`TRANSLATION NEEDED FOR ${lang}`);
    translatedStrings = translatedStrings.slice(0, enStrings.length);
  }
  
  // Write the file in the expected format
  const jsonData = {
    strings: translatedStrings
  };
  
  fs.writeFileSync(fileName, JSON.stringify(jsonData, null, 2));
  console.log(`Generated ${lang} translations: ${translatedStrings.length} strings`);
});

console.log("Translation files generated successfully.");