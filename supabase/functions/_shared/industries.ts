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

export const PDF_VERSIONS: Record<string, string> = {
  defence: 'defence-en@1.2.0',
};
