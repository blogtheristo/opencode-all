/**
 * EU Regulatory Timeline & Deadline Engine
 *
 * Tracks regulatory deadlines for CSRD, EPBD, ETS2, Fit for 55, CBAM, EU AI Act,
 * and the physical-AI safety pipeline (Machinery Regulation, revised Product
 * Liability Directive).
 * Provides countdown logic, urgency classification, and action items per deadline.
 *
 * All dates from official EUR-Lex publications. No invented deadlines.
 *
 * Code-Version: 1.1
 * Date: 2026-06-23
 * Owner: Lifetime Oy
 */

// ============ TYPES ============

export type RegulationId =
  | 'csrd'
  | 'epbd'
  | 'ets2'
  | 'cbam'
  | 'fit-for-55'
  | 'eu-ai-act'
  | 'eu-taxonomy'
  | 'red-iii'
  | 'eed'
  | 'energy-digitalisation'
  | 'eu-machinery-reg'
  | 'product-liability-directive';

export type UrgencyLevel = 'overdue' | 'critical' | 'urgent' | 'upcoming' | 'planned';

export interface RegulatoryDeadline {
  id: string;
  regulation: RegulationId;
  regulationName: string;
  milestone: string;
  description: string;
  date: string; // ISO date
  source: string; // EUR-Lex reference
  /** Who this affects */
  scope: string;
  /** Key action items to meet this deadline */
  actionItems: string[];
}

export interface DeadlineStatus {
  deadline: RegulatoryDeadline;
  daysRemaining: number;
  urgency: UrgencyLevel;
  /** Human-readable countdown */
  countdown: string;
  /** Is this deadline passed? */
  isPast: boolean;
}

export interface RegulatoryTimeline {
  /** All deadlines sorted by date (nearest first) */
  deadlines: DeadlineStatus[];
  /** Next 3 urgent deadlines */
  nextActions: DeadlineStatus[];
  /** Overdue items requiring immediate attention */
  overdue: DeadlineStatus[];
  /** Summary counts by urgency */
  summary: Record<UrgencyLevel, number>;
  /** Generated at */
  generatedAt: string;
}

// ============ DEADLINE DATABASE ============

/**
 * Official EU regulatory deadlines.
 * Sources: EUR-Lex, European Commission, EFRAG.
 * Verified 2026-04-02.
 */
const REGULATORY_DEADLINES: RegulatoryDeadline[] = [
  // CSRD
  {
    id: 'csrd-large-2025',
    regulation: 'csrd',
    regulationName: 'CSRD',
    milestone: 'Large PIEs first reporting',
    description:
      'Large public-interest entities (>500 employees) must publish ESRS-compliant sustainability reports for FY2024',
    date: '2025-01-01',
    source: 'Dir. 2022/2464, Art. 5(1)',
    scope: 'Large PIEs (banks, insurers, listed >500 emp)',
    actionItems: [
      'Complete double materiality assessment',
      'Map ESRS E1-E5, S1-S4, G1 disclosures',
      'Engage limited assurance provider',
    ],
  },
  {
    id: 'csrd-large-2026',
    regulation: 'csrd',
    regulationName: 'CSRD',
    milestone: 'All large companies reporting',
    description:
      'All large companies (250+ employees or EUR 50M+ revenue) must report under CSRD for FY2025',
    date: '2026-01-01',
    source: 'Dir. 2022/2464, Art. 5(2)',
    scope: 'All large companies (EU definition)',
    actionItems: [
      'Complete ESRS data collection',
      'Establish emissions monitoring',
      'File first sustainability statement',
    ],
  },
  {
    id: 'csrd-sme-2027',
    regulation: 'csrd',
    regulationName: 'CSRD',
    milestone: 'Listed SMEs reporting',
    description: 'Listed SMEs must report under CSRD (voluntary simplified ESRS) for FY2026',
    date: '2027-01-01',
    source: 'Dir. 2022/2464, Art. 5(3)',
    scope: 'Listed SMEs on EU regulated markets',
    actionItems: ['Adopt LSME ESRS standard', 'Identify material topics', 'Begin data collection'],
  },

  // EPBD Recast
  {
    id: 'epbd-embodied-2028',
    regulation: 'epbd',
    regulationName: 'EPBD Recast',
    milestone: 'Embodied carbon reporting (>1,000 m²)',
    description:
      'New buildings >1,000 m² must calculate and disclose whole-life Global Warming Potential (GWP)',
    date: '2028-01-01',
    source: 'Dir. 2024/1275, Art. 7(2)',
    scope: 'New buildings >1,000 m² gross floor area',
    actionItems: [
      'Implement EN 15978 LCA pipeline',
      'Source EPD data for key materials',
      'Integrate BIM quantities extraction',
    ],
  },
  {
    id: 'epbd-all-new-2030',
    regulation: 'epbd',
    regulationName: 'EPBD Recast',
    milestone: 'All new buildings whole-life carbon',
    description:
      'All new buildings must calculate whole-life carbon and meet maximum GWP thresholds',
    date: '2030-01-01',
    source: 'Dir. 2024/1275, Art. 7(3)',
    scope: 'All new buildings',
    actionItems: [
      'Extend LCA to all project types',
      'Establish material carbon budgets',
      'Automate EN 15978 from ERP data',
    ],
  },
  {
    id: 'epbd-zero-emission-2030',
    regulation: 'epbd',
    regulationName: 'EPBD Recast',
    milestone: 'Zero-emission building standard',
    description: 'All new buildings must be zero-emission buildings (ZEB) as defined by EPBD',
    date: '2030-01-01',
    source: 'Dir. 2024/1275, Art. 7(1)',
    scope: 'All new buildings',
    actionItems: [
      'Design to ZEB standard',
      'On-site renewable energy',
      'Heat pump / district heating ready',
    ],
  },

  // ETS2 (Buildings & Road Transport)
  {
    id: 'ets2-start-2027',
    regulation: 'ets2',
    regulationName: 'ETS2',
    milestone: 'ETS2 buildings sector start',
    description:
      'New emissions trading system for buildings and road transport fuel suppliers begins',
    date: '2027-01-01',
    source: 'Dir. 2023/959, Art. 30a',
    scope: 'Fuel suppliers for buildings sector',
    actionItems: [
      'Assess building portfolio energy sources',
      'Calculate heating emission exposure',
      'Plan fuel switching roadmap',
    ],
  },
  {
    id: 'ets2-full-2028',
    regulation: 'ets2',
    regulationName: 'ETS2',
    milestone: 'ETS2 full implementation',
    description:
      'Full ETS2 with allowance obligations, carbon price passed through to building owners/tenants',
    date: '2028-01-01',
    source: 'Dir. 2023/959, Art. 30d',
    scope: 'Building owners, heating fuel suppliers',
    actionItems: [
      'Budget for carbon cost pass-through',
      'Accelerate building energy renovation',
      'Monitor ETS2 allowance prices',
    ],
  },

  // CBAM
  {
    id: 'cbam-definitive-2026',
    regulation: 'cbam',
    regulationName: 'CBAM',
    milestone: 'CBAM definitive phase',
    description:
      'Importers must purchase CBAM certificates for embedded carbon in imports (cement, steel, aluminium, fertilizers, hydrogen, electricity)',
    date: '2026-01-01',
    source: 'Reg. 2023/956, Art. 36',
    scope: 'EU importers of CBAM goods',
    actionItems: [
      'Register as authorized CBAM declarant',
      'Obtain supplier-specific emission data',
      'Budget for CBAM certificate costs',
    ],
  },

  // Fit for 55
  {
    id: 'fit55-target-2030',
    regulation: 'fit-for-55',
    regulationName: 'Fit for 55',
    milestone: '55% emissions reduction target',
    description: 'EU must achieve 55% net GHG emission reduction vs 1990 levels',
    date: '2030-01-01',
    source: 'European Climate Law, Reg. 2021/1119, Art. 4(1)',
    scope: 'All EU economic sectors',
    actionItems: [
      'Align corporate transition plan with 55% pathway',
      'Set science-based targets',
      'Report progress in CSRD disclosure',
    ],
  },

  // EU AI Act
  {
    id: 'ai-act-high-risk-2026',
    regulation: 'eu-ai-act',
    regulationName: 'EU AI Act',
    milestone: 'High-risk AI system requirements',
    description:
      'High-risk AI systems must comply with Art. 6-15 requirements (risk management, data governance, transparency, human oversight)',
    date: '2026-08-02',
    source: 'Reg. 2024/1689, Art. 113(1)',
    scope: 'Providers of high-risk AI systems in EU market',
    actionItems: [
      'Classify AI system risk level',
      'Implement Article 12 logging',
      'Document training data governance',
    ],
  },
  {
    id: 'ai-act-embedded-high-risk-2028',
    regulation: 'eu-ai-act',
    regulationName: 'EU AI Act',
    milestone: 'Embedded-product high-risk obligations (Annex I)',
    description:
      'High-risk obligations for AI systems that are safety components of products covered by EU harmonisation legislation (Annex I) — including machinery/robots — apply. Date reflects the reported/proposed Omnibus timeline relief (provisional agreement, 7 May 2026; postponed from 2 Aug 2027) — not yet reflected in the EUR-Lex text of the base Regulation. Notified Body assessment under the Machinery Regulation discharges the overlapping AI Act conformity step; Art. 12 record-keeping and Art. 14 human-oversight evidence remain continuous obligations.',
    date: '2028-08-02',
    source: 'Reg. (EU) 2024/1689, Art. 113 (Annex I products)',
    scope:
      'Providers of AI safety components embedded in regulated products (machinery, medical devices, vehicles)',
    actionItems: [
      'Map AI safety components to the overlapping Machinery Regulation conformity route',
      'Implement Article 12 logging and Article 14 human-oversight evidence as continuous output',
      'Maintain post-market monitoring and the technical documentation file',
    ],
  },

  // Machinery Regulation (physical-AI safety pipeline)
  {
    id: 'machinery-reg-application-2027',
    regulation: 'eu-machinery-reg',
    regulationName: 'Machinery Regulation',
    milestone: 'Machinery Regulation applies (repeals Directive 2006/42/EC)',
    description:
      'Regulation (EU) 2023/1230 applies in full. AI safety components with fully or partially self-evolving (machine-learning) behaviour ensuring safety functions (Annex I, Part A, Nos 5-6) require mandatory third-party (Notified Body) conformity assessment. Effective runway is already negative once Notified Body lead times (6-12 months) are counted.',
    date: '2027-01-20',
    source: 'Reg. (EU) 2023/1230, Art. 53; Annex I Part A Nos 5-6',
    scope:
      'Manufacturers/importers of machinery & AI safety components on the EU market (incl. robots, humanoids, autonomous machines)',
    actionItems: [
      'Classify whether the AI safety component falls under Annex I Part A Nos 5-6 (self-evolving / ML safety functions)',
      'Engage a Notified Body early — assessment lead times (6-12 months) can exceed the remaining runway',
      'Use an ANAB-accredited pre-certification pipeline (e.g. NVIDIA Halos AI Systems Inspection Lab) to de-risk before third-party assessment',
      'Address cybersecurity-of-safety-functions and technical documentation requirements',
    ],
  },

  // Revised Product Liability Directive (physical-AI safety pipeline)
  {
    id: 'pld-transposition-2026',
    regulation: 'product-liability-directive',
    regulationName: 'Product Liability Directive (revised)',
    milestone: 'Member-State transposition deadline',
    description:
      'Directive (EU) 2024/2853 brings software and AI systems explicitly within strict (no-fault) product liability and eases the claimant burden of proof. Member States must transpose into national law — raising the cost of an unevidenced safety failure.',
    date: '2026-12-09',
    source: 'Dir. (EU) 2024/2853, Art. 22',
    scope: 'Manufacturers/providers of products incl. software & AI placed on the EU market',
    actionItems: [
      'Treat unevidenced safety failures as a strict-liability exposure',
      'Retain conformity and safety-case evidence to rebut the presumption of defectiveness',
      'Align liability posture with the Machinery Regulation + AI Act conformity files',
    ],
  },

  // RED III (Renewable Energy Directive)
  {
    id: 'red-iii-target-2030',
    regulation: 'red-iii',
    regulationName: 'RED III',
    milestone: '42.5% renewable energy target (binding)',
    description:
      'EU must achieve at least 42.5% share of energy from renewable sources (binding), with aspiration of 45%',
    date: '2030-01-01',
    source: 'Dir. (EU) 2023/2413, Art. 3(1)',
    scope: 'All EU Member States, energy producers',
    actionItems: [
      'Assess current renewable share vs 42.5% target',
      'Develop renewable deployment roadmap',
      'Report renewable share in CSRD E1 disclosures',
    ],
  },
  {
    id: 'red-iii-transport-2030',
    regulation: 'red-iii',
    regulationName: 'RED III',
    milestone: 'Transport sector renewable target',
    description:
      '14.5% renewable share in transport OR 29% renewables in final energy consumption in transport sector',
    date: '2030-01-01',
    source: 'Dir. (EU) 2023/2413, Art. 25',
    scope: 'Fuel suppliers, transport operators',
    actionItems: [
      'Map transport fuel mix',
      'Plan biofuel/e-fuel/hydrogen integration',
      'Assess fleet electrification timeline',
    ],
  },

  // Energy Efficiency Directive (EED) Recast
  {
    id: 'eed-energy-audits-2026',
    regulation: 'eed',
    regulationName: 'EED Recast',
    milestone: 'Enhanced energy audit requirements',
    description:
      'Large enterprises must conduct energy audits every 4 years. Companies with >85 TJ annual consumption must implement energy management systems (ISO 50001)',
    date: '2026-10-11',
    source: 'Dir. (EU) 2023/1791, Art. 11',
    scope: 'Large enterprises (>250 employees), high-consumption companies (>85 TJ/yr)',
    actionItems: [
      'Assess annual energy consumption vs 85 TJ threshold',
      'Commission energy audit or implement ISO 50001',
      'Document energy efficiency measures',
    ],
  },
  {
    id: 'eed-data-centres-2026',
    regulation: 'eed',
    regulationName: 'EED Recast',
    milestone: 'Data centre sustainability reporting',
    description:
      'Data centres with installed IT power demand >= 500 kW must report key sustainability indicators (PUE, renewable share, waste heat reuse)',
    date: '2026-05-15',
    source: 'Dir. (EU) 2023/1791, Art. 12',
    scope: 'Data centre operators (>= 500 kW IT power)',
    actionItems: [
      'Calculate PUE and water usage effectiveness',
      'Report renewable energy share',
      'Assess waste heat reuse potential',
    ],
  },

  // Energy Digitalisation Roadmap
  {
    id: 'energy-digital-roadmap-2026',
    regulation: 'energy-digitalisation',
    regulationName: 'Energy Digitalisation Roadmap',
    milestone: 'Strategic Roadmap on AI in Energy published',
    description:
      'EC Strategic Roadmap on Digitalisation and AI in Energy Sector — defines digital readiness expectations for grid operators, utilities, and data centres',
    date: '2026-04-01',
    source: 'EC Affordable Energy Action Plan (Feb 2025), Action 5',
    scope: 'All EU energy sector operators',
    actionItems: [
      'Review roadmap requirements',
      'Develop digitalisation strategy',
      'Assess AI readiness for grid optimisation',
    ],
  },
  {
    id: 'energy-efficiency-consultation-2026',
    regulation: 'eed',
    regulationName: 'Post-2030 Energy Efficiency Framework',
    milestone: 'Call for evidence deadline',
    description:
      'Public consultation on Post-2030 Energy Efficiency Framework closes — contribute to shape post-2030 requirements',
    date: '2026-04-16',
    source: 'energy.ec.europa.eu (launched 20 March 2026)',
    scope: 'Energy companies, industry associations, public',
    actionItems: [
      'Submit consultation response by 16 April 2026',
      'Align internal efficiency targets with expected post-2030 framework',
      'Monitor outcome for new obligations',
    ],
  },

  // EU Taxonomy
  {
    id: 'taxonomy-construction-2026',
    regulation: 'eu-taxonomy',
    regulationName: 'EU Taxonomy',
    milestone: 'Construction activity reporting',
    description:
      'Report Taxonomy alignment for construction activities (Activity 7.1-7.7) with CapEx/OpEx breakdown',
    date: '2026-01-01',
    source: 'Del. Reg. 2021/2139, Annex I',
    scope: 'Large companies reporting under CSRD',
    actionItems: [
      'Map construction CapEx to Taxonomy activities',
      'Assess substantial contribution criteria',
      'Calculate aligned vs eligible ratios',
    ],
  },
];

// ============ TIMELINE ENGINE ============

/**
 * Generate a full regulatory timeline with urgency classification.
 * @param referenceDate - Date to calculate from (defaults to now)
 */
export function generateTimeline(referenceDate?: Date): RegulatoryTimeline {
  const now = referenceDate ?? new Date();
  const nowMs = now.getTime();

  const deadlines: DeadlineStatus[] = REGULATORY_DEADLINES.map((d) => {
    const deadlineMs = new Date(d.date).getTime();
    const daysRemaining = Math.ceil((deadlineMs - nowMs) / 86_400_000);
    const isPast = daysRemaining < 0;

    return {
      deadline: d,
      daysRemaining,
      urgency: classifyUrgency(daysRemaining),
      countdown: formatCountdown(daysRemaining),
      isPast,
    };
  }).sort((a, b) => a.daysRemaining - b.daysRemaining);

  const overdue = deadlines.filter((d) => d.urgency === 'overdue');
  const nextActions = deadlines.filter((d) => !d.isPast).slice(0, 3);

  const summary: Record<UrgencyLevel, number> = {
    overdue: 0,
    critical: 0,
    urgent: 0,
    upcoming: 0,
    planned: 0,
  };
  for (const d of deadlines) {
    summary[d.urgency]++;
  }

  return {
    deadlines,
    nextActions,
    overdue,
    summary,
    generatedAt: now.toISOString(),
  };
}

/**
 * Get timeline filtered by regulation.
 */
export function getTimelineForRegulation(
  regulation: RegulationId,
  referenceDate?: Date,
): DeadlineStatus[] {
  const full = generateTimeline(referenceDate);
  return full.deadlines.filter((d) => d.deadline.regulation === regulation);
}

/**
 * Get next deadline for a specific regulation.
 */
export function getNextDeadline(
  regulation: RegulationId,
  referenceDate?: Date,
): DeadlineStatus | undefined {
  const filtered = getTimelineForRegulation(regulation, referenceDate);
  return filtered.find((d) => !d.isPast);
}

// ============ HELPERS ============

function classifyUrgency(daysRemaining: number): UrgencyLevel {
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining <= 90) return 'critical';
  if (daysRemaining <= 365) return 'urgent';
  if (daysRemaining <= 730) return 'upcoming';
  return 'planned';
}

function formatCountdown(days: number): string {
  if (days < 0) {
    const absDays = Math.abs(days);
    if (absDays > 365)
      return `${Math.floor(absDays / 365)}y ${Math.floor((absDays % 365) / 30)}m overdue`;
    if (absDays > 30) return `${Math.floor(absDays / 30)}m overdue`;
    return `${absDays}d overdue`;
  }
  if (days === 0) return 'Today';
  if (days <= 30) return `${days}d`;
  if (days <= 365) return `${Math.floor(days / 30)}m ${days % 30}d`;
  return `${Math.floor(days / 365)}y ${Math.floor((days % 365) / 30)}m`;
}

/**
 * Get all regulations tracked in the timeline.
 */
export function getTrackedRegulations(): {
  id: RegulationId;
  name: string;
  deadlineCount: number;
}[] {
  const map = new Map<RegulationId, { name: string; count: number }>();
  for (const d of REGULATORY_DEADLINES) {
    const existing = map.get(d.regulation);
    if (existing) {
      existing.count++;
    } else {
      map.set(d.regulation, { name: d.regulationName, count: 1 });
    }
  }
  return Array.from(map.entries()).map(([id, v]) => ({
    id,
    name: v.name,
    deadlineCount: v.count,
  }));
}
