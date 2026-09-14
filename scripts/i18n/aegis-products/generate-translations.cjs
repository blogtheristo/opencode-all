const fs = require('fs');

// Get the English array of translatable strings
const enData = JSON.parse(fs.readFileSync('./scripts/i18n/aegis-products/en-strings.json', 'utf8'));
const enStrings = enData.strings;

// Create empty translation files for each language
const languages = ['fi', 'sv', 'de', 'fr'];

languages.forEach(lang => {
  const langStrings = enStrings.map(str => `TRANSLATE: ${str}`);
  const translationData = langStrings;
  
  const fileName = `./scripts/i18n/aegis-products/${lang}-strings.json`;
  fs.writeFileSync(fileName, JSON.stringify(translationData, null, 2));
  console.log(`Generated ${lang} translation file with ${translationData.length} strings`);
});

console.log("All translation files generated successfully.");