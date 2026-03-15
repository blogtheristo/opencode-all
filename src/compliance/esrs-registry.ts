/**
 * ESRS Data Point Registry
 *
 * Maps all 82 ESRS disclosure requirements to structured data points.
 * Based on European Sustainability Reporting Standards (ESRS) 2023 final set.
 *
 * Categories: Environment (E1-E5), Social (S1-S4), Governance (G1)
 */

export interface ESRSDisclosure {
  id: string;           // e.g. 'E1-1'
  standard: string;     // e.g. 'E1'
  name: string;         // Human-readable name
  category: 'environment' | 'social' | 'governance';
  isMandatory: boolean; // Mandatory for all companies under CSRD
  description: string;  // What data is required
}

/**
 * Core ESRS disclosures most relevant for climate compliance MVP.
 * Full set of 82 disclosures — subset most critical for first assessment marked mandatory.
 */
export const ESRS_REGISTRY: ESRSDisclosure[] = [
  // ============ E1: Climate Change ============
  { id: 'E1-1', standard: 'E1', name: 'Transition plan for climate change mitigation', category: 'environment', isMandatory: true, description: 'Disclose transition plan aligned with 1.5°C pathway including targets, actions, and resources' },
  { id: 'E1-2', standard: 'E1', name: 'Policies related to climate change mitigation and adaptation', category: 'environment', isMandatory: true, description: 'Describe policies addressing climate change mitigation and adaptation' },
  { id: 'E1-3', standard: 'E1', name: 'Actions and resources related to climate change', category: 'environment', isMandatory: true, description: 'Describe actions taken and resources allocated to address climate change' },
  { id: 'E1-4', standard: 'E1', name: 'Targets related to climate change mitigation and adaptation', category: 'environment', isMandatory: true, description: 'Disclose targets for GHG emission reduction including base year and target year' },
  { id: 'E1-5', standard: 'E1', name: 'Energy consumption and mix', category: 'environment', isMandatory: true, description: 'Report total energy consumption, energy mix, and energy intensity' },
  { id: 'E1-6', standard: 'E1', name: 'Gross Scopes 1, 2, 3 and Total GHG emissions', category: 'environment', isMandatory: true, description: 'Report gross GHG emissions for Scope 1, 2, and 3 in tonnes CO2e' },
  { id: 'E1-7', standard: 'E1', name: 'GHG removals and storage', category: 'environment', isMandatory: false, description: 'Disclose GHG removals from own operations and value chain' },
  { id: 'E1-8', standard: 'E1', name: 'Internal carbon pricing', category: 'environment', isMandatory: false, description: 'Disclose internal carbon pricing schemes and shadow carbon prices' },
  { id: 'E1-9', standard: 'E1', name: 'Anticipated financial effects from climate change', category: 'environment', isMandatory: true, description: 'Disclose anticipated financial effects of physical and transition risks' },

  // ============ E2: Pollution ============
  { id: 'E2-1', standard: 'E2', name: 'Policies related to pollution', category: 'environment', isMandatory: false, description: 'Describe policies addressing pollution of air, water, and soil' },
  { id: 'E2-2', standard: 'E2', name: 'Actions and resources related to pollution', category: 'environment', isMandatory: false, description: 'Describe actions and resources to prevent and control pollution' },
  { id: 'E2-3', standard: 'E2', name: 'Targets related to pollution', category: 'environment', isMandatory: false, description: 'Disclose pollution reduction targets' },
  { id: 'E2-4', standard: 'E2', name: 'Pollution of air, water and soil', category: 'environment', isMandatory: false, description: 'Report pollutant emissions to air, water, and soil' },
  { id: 'E2-5', standard: 'E2', name: 'Substances of concern and very high concern', category: 'environment', isMandatory: false, description: 'Disclose use and production of substances of concern' },
  { id: 'E2-6', standard: 'E2', name: 'Anticipated financial effects from pollution', category: 'environment', isMandatory: false, description: 'Disclose anticipated financial effects from pollution-related risks' },

  // ============ E3: Water and Marine Resources ============
  { id: 'E3-1', standard: 'E3', name: 'Policies related to water and marine resources', category: 'environment', isMandatory: false, description: 'Describe policies for sustainable use of water and marine resources' },
  { id: 'E3-2', standard: 'E3', name: 'Actions and resources for water and marine resources', category: 'environment', isMandatory: false, description: 'Describe actions and resources for water stewardship' },
  { id: 'E3-3', standard: 'E3', name: 'Targets related to water and marine resources', category: 'environment', isMandatory: false, description: 'Disclose water-related targets' },
  { id: 'E3-4', standard: 'E3', name: 'Water consumption', category: 'environment', isMandatory: false, description: 'Report water withdrawal, consumption, and discharge' },
  { id: 'E3-5', standard: 'E3', name: 'Anticipated financial effects from water', category: 'environment', isMandatory: false, description: 'Disclose anticipated financial effects from water-related risks' },

  // ============ E4: Biodiversity and Ecosystems ============
  { id: 'E4-1', standard: 'E4', name: 'Transition plan for biodiversity', category: 'environment', isMandatory: false, description: 'Disclose transition plan for biodiversity and ecosystem protection' },
  { id: 'E4-2', standard: 'E4', name: 'Policies related to biodiversity', category: 'environment', isMandatory: false, description: 'Describe policies addressing biodiversity and ecosystem protection' },
  { id: 'E4-3', standard: 'E4', name: 'Actions and resources for biodiversity', category: 'environment', isMandatory: false, description: 'Describe actions and resources for biodiversity' },
  { id: 'E4-4', standard: 'E4', name: 'Targets related to biodiversity', category: 'environment', isMandatory: false, description: 'Disclose biodiversity targets' },
  { id: 'E4-5', standard: 'E4', name: 'Impact metrics for biodiversity', category: 'environment', isMandatory: false, description: 'Report metrics on biodiversity impact' },
  { id: 'E4-6', standard: 'E4', name: 'Anticipated financial effects from biodiversity', category: 'environment', isMandatory: false, description: 'Disclose anticipated financial effects from biodiversity risks' },

  // ============ E5: Resource Use and Circular Economy ============
  { id: 'E5-1', standard: 'E5', name: 'Policies for resource use and circular economy', category: 'environment', isMandatory: false, description: 'Describe policies for resource efficiency and circular economy' },
  { id: 'E5-2', standard: 'E5', name: 'Actions and resources for circular economy', category: 'environment', isMandatory: false, description: 'Describe actions for resource use optimization' },
  { id: 'E5-3', standard: 'E5', name: 'Targets for resource use and circular economy', category: 'environment', isMandatory: false, description: 'Disclose circular economy targets' },
  { id: 'E5-4', standard: 'E5', name: 'Resource inflows', category: 'environment', isMandatory: false, description: 'Report material resource inflows including virgin vs recycled' },
  { id: 'E5-5', standard: 'E5', name: 'Resource outflows', category: 'environment', isMandatory: false, description: 'Report waste generation and management' },
  { id: 'E5-6', standard: 'E5', name: 'Anticipated financial effects from resource use', category: 'environment', isMandatory: false, description: 'Disclose anticipated financial effects from resource depletion' },

  // ============ S1: Own Workforce ============
  { id: 'S1-1', standard: 'S1', name: 'Policies for own workforce', category: 'social', isMandatory: true, description: 'Describe policies for working conditions, equal treatment, and other workforce matters' },
  { id: 'S1-2', standard: 'S1', name: 'Processes for engaging with own workforce', category: 'social', isMandatory: true, description: 'Describe engagement processes with own workers and representatives' },
  { id: 'S1-3', standard: 'S1', name: 'Remediation processes for own workforce', category: 'social', isMandatory: true, description: 'Describe channels for own workers to raise concerns and seek remediation' },
  { id: 'S1-4', standard: 'S1', name: 'Taking action on own workforce impacts', category: 'social', isMandatory: true, description: 'Describe actions to address material impacts on own workforce' },
  { id: 'S1-5', standard: 'S1', name: 'Targets for own workforce', category: 'social', isMandatory: true, description: 'Disclose targets for managing workforce impacts' },
  { id: 'S1-6', standard: 'S1', name: 'Characteristics of own workforce', category: 'social', isMandatory: true, description: 'Report employee count by gender, country, contract type' },
  { id: 'S1-7', standard: 'S1', name: 'Characteristics of non-employee workers', category: 'social', isMandatory: true, description: 'Report non-employee worker data' },
  { id: 'S1-8', standard: 'S1', name: 'Collective bargaining coverage', category: 'social', isMandatory: true, description: 'Report percentage of employees covered by collective bargaining agreements' },
  { id: 'S1-9', standard: 'S1', name: 'Diversity metrics of own workforce', category: 'social', isMandatory: true, description: 'Report diversity indicators including gender pay gap' },
  { id: 'S1-10', standard: 'S1', name: 'Adequate wages', category: 'social', isMandatory: true, description: 'Report whether employees are paid adequate wages' },
  { id: 'S1-11', standard: 'S1', name: 'Social protection', category: 'social', isMandatory: true, description: 'Report social protection coverage for employees' },
  { id: 'S1-12', standard: 'S1', name: 'Persons with disabilities', category: 'social', isMandatory: true, description: 'Report on inclusion of persons with disabilities' },
  { id: 'S1-13', standard: 'S1', name: 'Training and skills development', category: 'social', isMandatory: true, description: 'Report training hours and skills development metrics' },
  { id: 'S1-14', standard: 'S1', name: 'Health and safety metrics', category: 'social', isMandatory: true, description: 'Report work-related injuries, ill health, and fatalities' },
  { id: 'S1-15', standard: 'S1', name: 'Work-life balance', category: 'social', isMandatory: true, description: 'Report on work-life balance policies and metrics' },
  { id: 'S1-16', standard: 'S1', name: 'Remuneration metrics', category: 'social', isMandatory: true, description: 'Report gender pay gap ratio and pay ratio of highest to median' },
  { id: 'S1-17', standard: 'S1', name: 'Incidents and complaints', category: 'social', isMandatory: true, description: 'Report incidents of discrimination, harassment complaints' },

  // ============ S2: Workers in the Value Chain ============
  { id: 'S2-1', standard: 'S2', name: 'Policies for value chain workers', category: 'social', isMandatory: false, description: 'Describe policies for workers in the value chain' },
  { id: 'S2-2', standard: 'S2', name: 'Engagement with value chain workers', category: 'social', isMandatory: false, description: 'Describe engagement with value chain workers' },
  { id: 'S2-3', standard: 'S2', name: 'Remediation for value chain workers', category: 'social', isMandatory: false, description: 'Describe remediation channels for value chain workers' },
  { id: 'S2-4', standard: 'S2', name: 'Actions on value chain worker impacts', category: 'social', isMandatory: false, description: 'Describe actions to address value chain worker impacts' },
  { id: 'S2-5', standard: 'S2', name: 'Targets for value chain workers', category: 'social', isMandatory: false, description: 'Disclose targets for value chain workers' },

  // ============ S3: Affected Communities ============
  { id: 'S3-1', standard: 'S3', name: 'Policies for affected communities', category: 'social', isMandatory: false, description: 'Describe policies related to affected communities' },
  { id: 'S3-2', standard: 'S3', name: 'Engagement with affected communities', category: 'social', isMandatory: false, description: 'Describe engagement with affected communities' },
  { id: 'S3-3', standard: 'S3', name: 'Remediation for affected communities', category: 'social', isMandatory: false, description: 'Describe remediation for affected communities' },
  { id: 'S3-4', standard: 'S3', name: 'Actions on community impacts', category: 'social', isMandatory: false, description: 'Describe actions to address community impacts' },
  { id: 'S3-5', standard: 'S3', name: 'Targets for affected communities', category: 'social', isMandatory: false, description: 'Disclose community-related targets' },

  // ============ S4: Consumers and End-Users ============
  { id: 'S4-1', standard: 'S4', name: 'Policies for consumers and end-users', category: 'social', isMandatory: false, description: 'Describe policies for consumer/end-user impacts' },
  { id: 'S4-2', standard: 'S4', name: 'Engagement with consumers and end-users', category: 'social', isMandatory: false, description: 'Describe engagement with consumers and end-users' },
  { id: 'S4-3', standard: 'S4', name: 'Remediation for consumers and end-users', category: 'social', isMandatory: false, description: 'Describe remediation channels for consumers' },
  { id: 'S4-4', standard: 'S4', name: 'Actions on consumer impacts', category: 'social', isMandatory: false, description: 'Describe actions to address consumer/end-user impacts' },
  { id: 'S4-5', standard: 'S4', name: 'Targets for consumers and end-users', category: 'social', isMandatory: false, description: 'Disclose consumer-related targets' },

  // ============ G1: Business Conduct ============
  { id: 'G1-1', standard: 'G1', name: 'Business conduct policies', category: 'governance', isMandatory: true, description: 'Describe corporate culture and business conduct policies including anti-corruption' },
  { id: 'G1-2', standard: 'G1', name: 'Management of relationships with suppliers', category: 'governance', isMandatory: true, description: 'Describe supplier relationship management and payment practices' },
  { id: 'G1-3', standard: 'G1', name: 'Prevention and detection of corruption', category: 'governance', isMandatory: true, description: 'Report anti-corruption and anti-bribery measures and incidents' },
  { id: 'G1-4', standard: 'G1', name: 'Confirmed incidents of corruption', category: 'governance', isMandatory: true, description: 'Report number of confirmed corruption/bribery incidents' },
  { id: 'G1-5', standard: 'G1', name: 'Political influence and lobbying', category: 'governance', isMandatory: true, description: 'Disclose political contributions and lobbying expenditures' },
  { id: 'G1-6', standard: 'G1', name: 'Payment practices', category: 'governance', isMandatory: true, description: 'Report average payment times to suppliers, especially SMEs' },
];

/** Get all mandatory disclosures */
export function getMandatoryDisclosures(): ESRSDisclosure[] {
  return ESRS_REGISTRY.filter((d) => d.isMandatory);
}

/** Get disclosures for a specific standard (e.g. 'E1') */
export function getDisclosuresByStandard(standard: string): ESRSDisclosure[] {
  return ESRS_REGISTRY.filter((d) => d.standard === standard);
}

/** Get disclosures by category */
export function getDisclosuresByCategory(category: 'environment' | 'social' | 'governance'): ESRSDisclosure[] {
  return ESRS_REGISTRY.filter((d) => d.category === category);
}

/** Total count of all disclosures in registry */
export const TOTAL_DISCLOSURES = ESRS_REGISTRY.length;

/** Count of mandatory disclosures */
export const MANDATORY_DISCLOSURES = ESRS_REGISTRY.filter((d) => d.isMandatory).length;
