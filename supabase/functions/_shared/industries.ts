// Canonical 25-industry slug list for /playbooks/.
// Order is fixed (matches CLAUDE.md and dws10.com/products/situation-room.html).
// Adding an industry requires also adding it here AND to the index page.
export const INDUSTRY_SLUGS = [
  'construction',
  'cement',
  'steel',
  'aluminium',
  'chemicals',
  'pharmaceuticals',
  'healthcare',
  'defence',
  'energy-grid',
  'oil-gas',
  'nuclear',
  'water-utilities',
  'telecommunications',
  'banking-finance',
  'insurance',
  'maritime',
  'aviation',
  'rail',
  'logistics-customs',
  'agriculture',
  'food-processing',
  'forestry',
  'mining',
  'government-civil-defence',
  'education-research',
] as const;

export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

// Phase 1: only 'defence' has a published PDF. Everything else captures
// wait-list leads. Update this set when a new playbook PDF ships.
export const PUBLISHED_PLAYBOOKS: ReadonlySet<IndustrySlug> = new Set<IndustrySlug>([
  'defence',
]);

// PDF object-key resolution: storage key = `${industry}-${language}.pdf`.
// PDF_VERSIONS[industry][language] returns the pinned semver of the file
// currently in the "playbooks" bucket, logged into playbook_downloads.
export const PDF_VERSIONS: Record<string, Partial<Record<'en'|'fi'|'sv'|'de'|'fr', string>>> = {
  defence: {
    en: 'defence-en@1.2.0',
    fi: 'defence-fi@1.2.0',
  },
};
