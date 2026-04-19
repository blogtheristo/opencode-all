/**
 * TED Sector Hooks — CPV→Sector mapping and sector-specific DM templates
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Branch: claude/improve-sales-call-script-xg1zO
 * Date: 2026-03-22
 * Owner: Lifetime Oy
 *
 * 20 EU-regulated industries × 5 languages × multiple hook angles per sector.
 * Each sector has a primary regulation hook and a value-prop tailored to that industry.
 *
 * Sources:
 * - CPV codes: EU Regulation 213/2008 (Common Procurement Vocabulary)
 * - Sector regulations: EU ETS (2003/87/EC), CBAM (2023/956), CSRD (2022/2464),
 *   EPBD (2024/1275), FuelEU Maritime (2023/1805), Fit for 55 package
 * - Sector benchmarks: src/compliance/eu-benchmarks.ts
 */

// ── Types ──────────────────────────────────────────────────────────────

export type DwsSector =
  | 'construction' | 'steel' | 'cement' | 'aluminium'
  | 'chemicals' | 'fertilizers' | 'hydrogen' | 'energy'
  | 'transport' | 'mining' | 'food' | 'paper'
  | 'pharma' | 'textiles' | 'automotive' | 'real-estate'
  | 'waste' | 'it-digital' | 'financial' | 'manufacturing';

export type DmLanguage = 'FI' | 'SV' | 'DE' | 'FR' | 'EN';

export interface SectorHook {
  regulation: string;        // Primary EU regulation for this sector
  painPoint: string;         // What keeps the CFO/CSO up at night (EN)
  dwsProduct: string;        // Which DWS product solves it
}

// ── CPV → Sector Mapping ───────────────────────────────────────────────
// CPV prefix (2-5 digits) → DWS sector. Longest prefix match wins.

const CPV_SECTOR_MAP: [string, DwsSector][] = [
  // Construction (45xxxxxx)
  ['45', 'construction'],
  // Steel & metal structures (44 = structures/materials)
  ['4421', 'steel'],       // Steel structures
  ['4431', 'steel'],       // Steel pipes
  ['44', 'manufacturing'], // General construction materials → fallback
  // Cement & concrete (44.11 = concrete)
  ['4411', 'cement'],
  // Aluminium
  ['4422', 'aluminium'],   // Aluminium structures
  // Chemicals (24xxxxxx)
  ['2415', 'fertilizers'], // Fertilizers (more specific first)
  ['24', 'chemicals'],
  // Petroleum, fuel, energy (09, 65)
  ['091', 'hydrogen'],     // Hydrogen & gases
  ['09', 'energy'],        // Petroleum, fuel
  ['65', 'energy'],        // Public utilities, electricity
  ['31', 'energy'],        // Electrical machinery
  // Transport & logistics (34, 60, 63)
  ['341', 'automotive'],   // Motor vehicles
  ['34', 'transport'],     // Transport equipment
  ['60', 'transport'],     // Transport services (legacy CPV)
  ['63', 'transport'],     // Supporting transport services
  // Mining (14, 43)
  ['14', 'mining'],        // Mining products
  ['43', 'mining'],        // Mining machinery
  // Food & agriculture (03, 15)
  ['03', 'food'],          // Agricultural products
  ['15', 'food'],          // Food, beverages
  ['77', 'food'],          // Agricultural/horticultural services
  // Paper & forestry
  ['034', 'paper'],        // Forestry products (more specific than food 03)
  ['22', 'paper'],         // Printed matter, paper
  // Pharma & healthcare (33, 85)
  ['33', 'pharma'],        // Medical equipment
  ['85', 'pharma'],        // Health services
  // Textiles (19)
  ['19', 'textiles'],      // Leather, textiles
  ['18', 'textiles'],      // Clothing
  // Real estate & property (70, 71)
  ['70', 'real-estate'],   // Real estate
  ['71', 'real-estate'],   // Architectural/engineering
  // Waste & circular economy (90)
  ['90', 'waste'],         // Sewage, refuse, waste
  // IT & digital (30, 48, 72)
  ['30', 'it-digital'],    // IT equipment
  ['48', 'it-digital'],    // Software
  ['72', 'it-digital'],    // IT services
  // Financial services (66)
  ['66', 'financial'],     // Financial services
];

// Sort by prefix length descending so longest match wins
const SORTED_CPV_MAP = [...CPV_SECTOR_MAP].sort((a, b) => b[0].length - a[0].length);

/**
 * Resolve CPV code to DWS sector. Longest prefix match.
 * Falls back to 'manufacturing' if no match.
 */
export function cpvToSector(cpv: string | null | undefined): DwsSector {
  if (!cpv) return 'manufacturing';
  const code = cpv.replace(/[^0-9]/g, '');
  for (const [prefix, sector] of SORTED_CPV_MAP) {
    if (code.startsWith(prefix)) return sector;
  }
  return 'manufacturing';
}

// ── Sector Metadata ────────────────────────────────────────────────────

export const SECTOR_HOOKS: Record<DwsSector, SectorHook> = {
  construction: {
    regulation: 'CSRD + EPBD',
    painPoint: 'EN 15978 lifecycle carbon reporting for construction projects',
    dwsProduct: 'automated carbon reporting',
  },
  steel: {
    regulation: 'ETS + CBAM',
    painPoint: 'emission allowance costs and CBAM border adjustment',
    dwsProduct: 'ETS compliance automation',
  },
  cement: {
    regulation: 'ETS + CBAM',
    painPoint: 'highest per-ton CO2 in industry, CBAM exposure',
    dwsProduct: 'emission monitoring and CBAM reporting',
  },
  aluminium: {
    regulation: 'CBAM + ETS',
    painPoint: 'CBAM import declarations and embedded emissions',
    dwsProduct: 'CBAM declaration automation',
  },
  chemicals: {
    regulation: 'ETS + REACH + CSRD',
    painPoint: 'multi-regulation compliance across ETS, REACH, and CSRD',
    dwsProduct: 'cross-regulation compliance platform',
  },
  fertilizers: {
    regulation: 'CBAM + ETS',
    painPoint: 'CBAM border costs on nitrogen-based imports',
    dwsProduct: 'CBAM cost tracking and reporting',
  },
  hydrogen: {
    regulation: 'ETS + RED III',
    painPoint: 'green hydrogen certification and additionality proof',
    dwsProduct: 'hydrogen certification compliance',
  },
  energy: {
    regulation: 'ETS + Fit for 55',
    painPoint: 'emission trading and renewable energy directive compliance',
    dwsProduct: 'ETS portfolio optimization',
  },
  transport: {
    regulation: 'FuelEU Maritime + ETS + CSRD',
    painPoint: 'Scope 3 supply chain emissions and FuelEU reporting',
    dwsProduct: 'transport emission tracking',
  },
  mining: {
    regulation: 'ETS + CSRD + Taxonomy',
    painPoint: 'extraction emissions reporting and taxonomy alignment',
    dwsProduct: 'mining emission compliance',
  },
  food: {
    regulation: 'CSRD + Deforestation Reg',
    painPoint: 'supply chain deforestation due diligence and CSRD disclosure',
    dwsProduct: 'agri-food supply chain compliance',
  },
  paper: {
    regulation: 'CSRD + LULUCF + Deforestation Reg',
    painPoint: 'forestry carbon accounting and deforestation regulation',
    dwsProduct: 'forestry carbon and supply chain compliance',
  },
  pharma: {
    regulation: 'CSRD + EU Taxonomy',
    painPoint: 'CSRD sustainability disclosure and taxonomy-eligible activities',
    dwsProduct: 'pharma sustainability reporting',
  },
  textiles: {
    regulation: 'CSRD + Ecodesign',
    painPoint: 'textile waste directive and digital product passport',
    dwsProduct: 'textile compliance and DPP automation',
  },
  automotive: {
    regulation: 'ETS + CBAM + Euro 7',
    painPoint: 'fleet emission standards and CBAM on imported components',
    dwsProduct: 'automotive emission compliance',
  },
  'real-estate': {
    regulation: 'EPBD + CSRD + Taxonomy',
    painPoint: 'building energy performance and taxonomy-aligned green assets',
    dwsProduct: 'real estate carbon and EPBD compliance',
  },
  waste: {
    regulation: 'CSRD + Circular Economy Package',
    painPoint: 'waste hierarchy compliance and circular economy metrics',
    dwsProduct: 'waste and circular economy reporting',
  },
  'it-digital': {
    regulation: 'CSRD + EU AI Act',
    painPoint: 'data center energy reporting and AI Act compliance',
    dwsProduct: 'digital sustainability and AI compliance',
  },
  financial: {
    regulation: 'SFDR + CSRD + Taxonomy',
    painPoint: 'SFDR fund disclosure and taxonomy alignment of portfolios',
    dwsProduct: 'ESG portfolio compliance',
  },
  manufacturing: {
    regulation: 'CSRD + ETS',
    painPoint: 'emission reporting and CSRD sustainability disclosure',
    dwsProduct: 'manufacturing compliance automation',
  },
};

// ── Sector-Specific DM Templates ───────────────────────────────────────
// Structure: tender hook → sector pain point → referral handoff
// Each language has a template function that takes (buyer, title, sector)

type DmTemplate = (buyer: string, title: string, hook: SectorHook) => string;

const SECTOR_DM_TEMPLATES: Record<DmLanguage, DmTemplate> = {
  FI: (buyer, title, hook) =>
    `Näin hankinnan "${title}" (${buyer}). ${hook.regulation}-vaatimus koskee sitä suoraan — automatisoimme ${sectorProductFI(hook)}. Sopiiko että ohjaat minut oikealle henkilölle ${hook.regulation}-vastuussa?`,
  SV: (buyer, title, hook) =>
    `Jag såg upphandlingen "${title}" (${buyer}). ${hook.regulation}-kravet gäller direkt — vi automatiserar ${sectorProductSV(hook)}. Kan du hänvisa mig till rätt person med ${hook.regulation}-ansvar?`,
  DE: (buyer, title, hook) =>
    `Ich habe die Ausschreibung "${title}" (${buyer}) gesehen. Die ${hook.regulation}-Anforderung gilt direkt — wir automatisieren ${sectorProductDE(hook)}. Könnten Sie mich an die zuständige Person für ${hook.regulation} weiterleiten?`,
  FR: (buyer, title, hook) =>
    `J'ai vu l'appel d'offres "${title}" (${buyer}). L'exigence ${hook.regulation} s'applique directement — nous automatisons ${sectorProductFR(hook)}. Pourriez-vous me diriger vers la personne responsable ${hook.regulation} ?`,
  EN: (buyer, title, hook) =>
    `I saw the tender "${title}" (${buyer}). The ${hook.regulation} requirement applies directly — we automate ${hook.dwsProduct}. Could you point me to the right person handling ${hook.regulation} compliance?`,
};

// ── Localized product descriptions ─────────────────────────────────────
// Short Finnish/Swedish/German/French translations of dwsProduct per sector

function sectorProductFI(hook: SectorHook): string {
  const map: Partial<Record<string, string>> = {
    'automated carbon reporting': 'hiilijalanjälkiraportoinnin',
    'ETS compliance automation': 'päästökaupan vaatimustenmukaisuuden',
    'emission monitoring and CBAM reporting': 'päästöseurannan ja CBAM-raportoinnin',
    'CBAM declaration automation': 'CBAM-tuonti-ilmoitukset',
    'cross-regulation compliance platform': 'moniregulatiivisen vaatimustenmukaisuuden',
    'CBAM cost tracking and reporting': 'CBAM-kustannusseurannan ja raportoinnin',
    'hydrogen certification compliance': 'vetysertifioinnin vaatimukset',
    'ETS portfolio optimization': 'päästökauppasalkun optimoinnin',
    'transport emission tracking': 'kuljetusten päästöseurannan',
    'mining emission compliance': 'kaivosten päästövaatimustenmukaisuuden',
    'agri-food supply chain compliance': 'ruokaketjun vaatimustenmukaisuuden',
    'forestry carbon and supply chain compliance': 'metsäsektorin hiililaskennan',
    'pharma sustainability reporting': 'lääketeollisuuden kestävyysraportoinnin',
    'textile compliance and DPP automation': 'tekstiilialan vaatimukset ja digitaalisen tuotepassin',
    'automotive emission compliance': 'autoalan päästövaatimukset',
    'real estate carbon and EPBD compliance': 'kiinteistöjen energia- ja hiiliraportoinnin',
    'waste and circular economy reporting': 'jätehuollon ja kiertotalousraportoinnin',
    'digital sustainability and AI compliance': 'digitaalisen kestävyyden ja AI-vaatimukset',
    'ESG portfolio compliance': 'ESG-salkkuvaatimukset',
    'manufacturing compliance automation': 'teollisuuden vaatimustenmukaisuuden',
  };
  return map[hook.dwsProduct] || hook.dwsProduct;
}

function sectorProductSV(hook: SectorHook): string {
  const map: Partial<Record<string, string>> = {
    'automated carbon reporting': 'koldioxidrapporteringen',
    'ETS compliance automation': 'ETS-regelefterlevnad',
    'emission monitoring and CBAM reporting': 'utsläppsövervakning och CBAM-rapportering',
    'CBAM declaration automation': 'CBAM-importdeklarationer',
    'cross-regulation compliance platform': 'flerregulatorisk regelefterlevnad',
    'CBAM cost tracking and reporting': 'CBAM-kostnadsspårning och rapportering',
    'hydrogen certification compliance': 'vätecertifieringskrav',
    'ETS portfolio optimization': 'ETS-portföljoptimering',
    'transport emission tracking': 'transportutsläppsspårning',
    'mining emission compliance': 'gruvutsläppsefterlevnad',
    'agri-food supply chain compliance': 'livsmedelkedjans regelefterlevnad',
    'forestry carbon and supply chain compliance': 'skogssektorns kolrapportering',
    'pharma sustainability reporting': 'läkemedelsbranschens hållbarhetsrapportering',
    'textile compliance and DPP automation': 'textilkrav och digitalt produktpass',
    'automotive emission compliance': 'fordonsutsläppskrav',
    'real estate carbon and EPBD compliance': 'fastigheters energi- och kolrapportering',
    'waste and circular economy reporting': 'avfalls- och cirkulärekonomrapportering',
    'digital sustainability and AI compliance': 'digital hållbarhet och AI-krav',
    'ESG portfolio compliance': 'ESG-portföljkrav',
    'manufacturing compliance automation': 'industrins regelefterlevnad',
  };
  return map[hook.dwsProduct] || hook.dwsProduct;
}

function sectorProductDE(hook: SectorHook): string {
  const map: Partial<Record<string, string>> = {
    'automated carbon reporting': 'die CO2-Berichterstattung',
    'ETS compliance automation': 'die ETS-Compliance',
    'emission monitoring and CBAM reporting': 'die Emissionsüberwachung und CBAM-Berichterstattung',
    'CBAM declaration automation': 'die CBAM-Importerklärungen',
    'cross-regulation compliance platform': 'die regulierungsübergreifende Compliance',
    'CBAM cost tracking and reporting': 'die CBAM-Kostenverfolgung und Berichterstattung',
    'hydrogen certification compliance': 'die Wasserstoff-Zertifizierung',
    'ETS portfolio optimization': 'die ETS-Portfoliooptimierung',
    'transport emission tracking': 'die Transportemissionserfassung',
    'mining emission compliance': 'die Bergbau-Emissionscompliance',
    'agri-food supply chain compliance': 'die Lebensmittelketten-Compliance',
    'forestry carbon and supply chain compliance': 'die Forst-CO2-Bilanzierung',
    'pharma sustainability reporting': 'die Pharma-Nachhaltigkeitsberichterstattung',
    'textile compliance and DPP automation': 'die Textil-Compliance und den digitalen Produktpass',
    'automotive emission compliance': 'die Kfz-Emissionscompliance',
    'real estate carbon and EPBD compliance': 'die Immobilien-Energie- und CO2-Berichterstattung',
    'waste and circular economy reporting': 'die Abfall- und Kreislaufwirtschaftsberichterstattung',
    'digital sustainability and AI compliance': 'die digitale Nachhaltigkeit und AI-Compliance',
    'ESG portfolio compliance': 'die ESG-Portfolio-Compliance',
    'manufacturing compliance automation': 'die Industrie-Compliance',
  };
  return map[hook.dwsProduct] || hook.dwsProduct;
}

function sectorProductFR(hook: SectorHook): string {
  const map: Partial<Record<string, string>> = {
    'automated carbon reporting': 'le reporting carbone',
    'ETS compliance automation': 'la conformité ETS',
    'emission monitoring and CBAM reporting': 'le suivi des émissions et le reporting CBAM',
    'CBAM declaration automation': 'les déclarations CBAM',
    'cross-regulation compliance platform': 'la conformité multi-réglementaire',
    'CBAM cost tracking and reporting': 'le suivi des coûts CBAM et le reporting',
    'hydrogen certification compliance': 'la certification hydrogène',
    'ETS portfolio optimization': "l'optimisation du portefeuille ETS",
    'transport emission tracking': 'le suivi des émissions transport',
    'mining emission compliance': 'la conformité émissions minières',
    'agri-food supply chain compliance': 'la conformité chaîne agroalimentaire',
    'forestry carbon and supply chain compliance': 'le bilan carbone forestier',
    'pharma sustainability reporting': 'le reporting durabilité pharma',
    'textile compliance and DPP automation': 'la conformité textile et le passeport numérique',
    'automotive emission compliance': 'la conformité émissions automobile',
    'real estate carbon and EPBD compliance': "le reporting énergie et carbone immobilier",
    'waste and circular economy reporting': "le reporting déchets et économie circulaire",
    'digital sustainability and AI compliance': 'la durabilité numérique et la conformité IA',
    'ESG portfolio compliance': 'la conformité portefeuille ESG',
    'manufacturing compliance automation': "la conformité industrielle",
  };
  return map[hook.dwsProduct] || hook.dwsProduct;
}

// ── Public API ─────────────────────────────────────────────────────────

/**
 * Generate a sector-aware DM for a TED lead.
 * Resolves CPV → sector → hook → localized DM.
 */
export function generateSectorDM(
  buyer: string,
  title: string,
  cpv: string | null | undefined,
  lang: DmLanguage,
): string {
  const sector = cpvToSector(cpv);
  const hook = SECTOR_HOOKS[sector];
  const template = SECTOR_DM_TEMPLATES[lang] || SECTOR_DM_TEMPLATES.EN;
  return template(buyer || '(company)', title || '(project)', hook);
}

/**
 * Get all available sectors with their hooks.
 * Useful for CLI --sector flag or UI selector.
 */
export function listSectors(): Array<{ sector: DwsSector; regulation: string; painPoint: string }> {
  return Object.entries(SECTOR_HOOKS).map(([sector, hook]) => ({
    sector: sector as DwsSector,
    regulation: hook.regulation,
    painPoint: hook.painPoint,
  }));
}

/**
 * Get the sector label for display.
 */
export function sectorLabel(sector: DwsSector): string {
  const labels: Record<DwsSector, string> = {
    construction: 'Construction',
    steel: 'Steel',
    cement: 'Cement',
    aluminium: 'Aluminium',
    chemicals: 'Chemicals',
    fertilizers: 'Fertilizers',
    hydrogen: 'Hydrogen',
    energy: 'Energy',
    transport: 'Transport & Logistics',
    mining: 'Mining',
    food: 'Food & Agriculture',
    paper: 'Paper & Forestry',
    pharma: 'Pharma & Healthcare',
    textiles: 'Textiles',
    automotive: 'Automotive',
    'real-estate': 'Real Estate',
    waste: 'Waste & Circular Economy',
    'it-digital': 'IT & Digital',
    financial: 'Financial Services',
    manufacturing: 'Manufacturing (General)',
  };
  return labels[sector];
}
