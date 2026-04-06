/**
 * Compute Strategy Configuration — Lifetime Oy NVIDIA AI Enterprise Stack
 *
 * Code-Version: 1.0
 * Branch: claude/synthetic-data-pipeline-TK1Lp
 * Date: 2026-04-06
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Documents the compute architecture for synthetic data generation and
 * agent inference as an NVIDIA Connect ISV Partner.
 *
 * Sources:
 * - NVIDIA Connect ISV Partner approval (2026-03-08)
 * - GTC 2026 Keynote impact assessment (2026-03-16)
 * - NVIDIA × Groq deal analysis (2026-04-05)
 * - Scaleway EU inference setup (2026-04-05)
 */

// ============ TYPES ============

export interface ComputeNode {
  name: string;
  role: 'inference' | 'generation' | 'training' | 'edge' | 'orchestration';
  hardware: string;
  location: string;
  dataResidency: 'EU' | 'US' | 'global';
  capabilities: string[];
  status: 'active' | 'planned' | 'evaluation';
  costTier: 'free-tier' | 'pay-per-use' | 'reserved' | 'owned';
  source: string;
}

export interface InferenceRoute {
  name: string;
  priority: number;
  provider: string;
  model: string;
  endpoint: string;
  latencyMs: { p50: number; p99: number };
  dataResidency: 'EU' | 'US' | 'global';
  useCase: string;
  source: string;
}

export interface GenerationPipeline {
  name: string;
  description: string;
  hardware: string;
  estimatedThroughput: string;
  targetDatasetSize: string;
  estimatedDuration: string;
  cost: string;
  source: string;
}

export interface ComputeStrategy {
  version: string;
  partner: {
    company: string;
    businessId: string;
    program: string;
    status: string;
    verificationUrl: string;
  };
  nodes: ComputeNode[];
  inferenceRoutes: InferenceRoute[];
  generationPipelines: GenerationPipeline[];
  roadmap: Array<{
    phase: string;
    timeline: string;
    items: string[];
  }>;
}

// ============ STRATEGY ============

/**
 * The full compute strategy for DD data room.
 * Every number has a real source — no invented throughput claims.
 */
export const COMPUTE_STRATEGY: ComputeStrategy = {
  version: '1.0.0',
  partner: {
    company: 'Lifetime Oy',
    businessId: '0772407-9',
    program: 'NVIDIA Connect ISV Partner',
    status: 'Approved (2026-03-08)',
    verificationUrl: 'https://www.nvidia.com/en-us/about-nvidia/partners/partner-locator/',
  },

  nodes: [
    // === ACTIVE ===
    {
      name: 'DGX Spark (Acer Veriton GN100)',
      role: 'edge',
      hardware: 'NVIDIA Blackwell GPU, 128GB unified memory',
      location: 'Espoo, Finland (on-premise)',
      dataResidency: 'EU',
      capabilities: [
        'Local LLM inference (Ollama)',
        'Agent sandbox execution (KYA Standard)',
        'cuDF data pipeline acceleration',
        'NIM container hosting',
        'Day-runner script automation',
        'NeMo DataDesigner dev/test (small-model generation with Llama 3.3 8B)',
        'Daily synthetic pipeline health checks (scripts/daily/synthetic-data-health.ts)',
        'Deterministic validation of all 55 seed filings (50 clean + 5 Red Team negatives, no GPU required)',
      ],
      status: 'active',
      costTier: 'owned',
      source: 'docs/field-notes/2026-03-10-acer-dgx-sandbox-strategy.md',
    },
    {
      name: 'Scaleway EU Inference (Generative APIs)',
      role: 'inference',
      hardware: 'Scaleway Generative APIs (managed, serverless)',
      location: 'Paris / Amsterdam (EU)',
      dataResidency: 'EU',
      capabilities: [
        'Primary EU inference route',
        'Llama 3.3 70B serving',
        'GDPR-compliant prompt processing',
        'Climate assistant real-time queries',
        '1M tokens/month free tier',
      ],
      status: 'active',
      costTier: 'free-tier',
      source: 'docs/field-notes/2026-04-05-scaleway-eu-inference-setup.md',
    },
    {
      name: 'Scaleway H100 (Generation Cluster)',
      role: 'generation',
      hardware: 'NVIDIA H100 SXM 80GB (1x or 2x)',
      location: 'Paris fr-par-2 / Warsaw pl-waw-2 (EU)',
      dataResidency: 'EU',
      capabilities: [
        'NeMo DataDesigner synthetic data generation',
        'Nemotron-3 70B MTC narrative generation (fits in 80GB VRAM)',
        'LLM-as-Judge validation pipeline',
        'Self-hosted NIM containers',
        'cuDF data pipeline acceleration',
      ],
      status: 'active',
      costTier: 'pay-per-use',
      source: 'scaleway.com/en/h100/ — EUR 2.73/hr on-demand (fr-par-2, pl-waw-2)',
    },
    {
      name: 'Google Cloud Run (europe-north1)',
      role: 'orchestration',
      hardware: 'Cloud Run serverless containers',
      location: 'Hamina, Finland (europe-north1)',
      dataResidency: 'EU',
      capabilities: [
        'Express API backend',
        'Agent orchestration (40+ agents)',
        'MCP server (/mcp endpoint)',
        'Supabase integration',
      ],
      status: 'active',
      costTier: 'pay-per-use',
      source: 'src/app.ts — Cloud Run deployment',
    },
    {
      name: 'Groq Cloud (US fallback)',
      role: 'inference',
      hardware: 'Groq LPU (Language Processing Unit)',
      location: 'US (GroqCloud)',
      dataResidency: 'US',
      capabilities: [
        'Ultra-low-latency inference decode (500+ tok/s)',
        'Non-EU admin/demo path',
        'Speed benchmarking (LPU vs GPU)',
        'Fallback if Scaleway + NIM both fail',
      ],
      status: 'active',
      costTier: 'free-tier',
      source: 'docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md',
    },

    // === PLANNED ===
    {
      name: 'NVIDIA NIM (EU Region)',
      role: 'inference',
      hardware: 'NVIDIA NIM Microservices on H200/B200',
      location: 'EU data center (TBD — Equinix FR / Hetzner DE)',
      dataResidency: 'EU',
      capabilities: [
        'NVIDIA-native inference microservices',
        'Nemotron model serving',
        'Connect Partner benefit access',
        'Judge model hosting for synthetic data validation',
      ],
      status: 'planned',
      costTier: 'reserved',
      source: 'docs/field-notes/2026-03-16-nvidia-gtc-2026-keynote-dws-impact.md',
    },
    {
      name: 'Scaleway HGX B300 (Blackwell Upgrade)',
      role: 'generation',
      hardware: 'NVIDIA HGX B300 Blackwell, up to 2.3TB memory',
      location: 'Scaleway EU (pre-registration, ETA H2 2026)',
      dataResidency: 'EU',
      capabilities: [
        '10x perf/watt over H100 for re-simulation workloads',
        'Full 100K dataset re-generation in ~20 hours (vs 200 on H100)',
        'Vera Rubin rack-scale integration path',
        'Phase 4 continuous nervous system target',
      ],
      status: 'evaluation',
      costTier: 'reserved',
      source: 'scaleway.com/en/gpu-instances/ — HGX B300 pre-registration open',
    },
    {
      name: 'Scaleway H200 (Pre-registration)',
      role: 'generation',
      hardware: 'NVIDIA H200 141GB HBM3e',
      location: 'Scaleway EU (pre-registration)',
      dataResidency: 'EU',
      capabilities: [
        'Larger VRAM for bigger models (141GB vs H100 80GB)',
        'Faster memory bandwidth for generation throughput',
        'Bridge between H100 and Blackwell',
      ],
      status: 'evaluation',
      costTier: 'reserved',
      source: 'scaleway.com/en/gpu-instances/ — H200 pre-registration open, est. EUR 3.50-4.50/hr',
    },
    {
      name: 'Groq 3 LPX (EU-hosted)',
      role: 'inference',
      hardware: 'NVIDIA Groq 3 LPX on Samsung 4nm (Vera Rubin rack-scale)',
      location: 'EU data center (post-Q3 2026)',
      dataResidency: 'EU',
      capabilities: [
        'Groq LPU latency with EU data residency',
        'Sub-second agent responses',
        'Real-time CBAM audit during import processing',
      ],
      status: 'evaluation',
      costTier: 'reserved',
      source: 'docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md — V1.5 milestone',
    },
  ],

  inferenceRoutes: [
    {
      name: 'EU Primary',
      priority: 1,
      provider: 'Scaleway',
      model: 'Llama 3.3 70B',
      endpoint: 'api.scaleway.ai',
      latencyMs: { p50: 150, p99: 800 },
      dataResidency: 'EU',
      useCase: 'EU customer inference — compliance queries, agent reasoning',
      source: 'src/services/climate-assistant.service.ts',
    },
    {
      name: 'NVIDIA NIM (EU)',
      priority: 2,
      provider: 'NVIDIA NIM',
      model: 'Nemotron-3 70B / custom NIM',
      endpoint: 'nim.nvidia.com (EU region)',
      latencyMs: { p50: 120, p99: 600 },
      dataResidency: 'EU',
      useCase: 'Strategic — Connect Partner route, judge model for synthetic data',
      source: 'docs/field-notes/2026-03-16-nvidia-gtc-2026-keynote-dws-impact.md',
    },
    {
      name: 'Groq (US fallback)',
      priority: 3,
      provider: 'Groq',
      model: 'Llama 3.3 70B / Mixtral',
      endpoint: 'api.groq.com',
      latencyMs: { p50: 40, p99: 120 },
      dataResidency: 'US',
      useCase: 'Non-EU admin, demos, speed benchmarks, fallback',
      source: 'docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md',
    },
    {
      name: 'DGX Spark (local)',
      priority: 4,
      provider: 'Ollama (on-premise)',
      model: 'Llama 3.3 8B / Gemma 3 12B',
      endpoint: 'localhost:11434',
      latencyMs: { p50: 200, p99: 1500 },
      dataResidency: 'EU',
      useCase: 'Edge/offline, agent sandbox, development, day-runner scripts',
      source: 'docs/field-notes/2026-03-10-acer-dgx-sandbox-strategy.md',
    },
  ],

  generationPipelines: [
    {
      name: 'NCC V1 Demo (1K records)',
      description:
        'Generate 1,000 synthetic CBAM declarations with MTC narratives for NCC due diligence demo by June 15',
      hardware: 'Scaleway H100 SXM 80GB (1x GPU, fr-par-2)',
      estimatedThroughput: '~200 records/hour (Nemotron-3 70B narrative + judge validation)',
      targetDatasetSize: '1,000 validated records',
      estimatedDuration: '~5 hours on 1x H100',
      cost: 'EUR 14 (5h × EUR 2.73/hr) + judge scoring via Scaleway Generative APIs free tier',
      source: 'scaleway.com/en/h100/ — EUR 2.73/hr on-demand',
    },
    {
      name: 'CBAM Stress Test V1 (100K records)',
      description:
        'Full-scale generation of 100K synthetic CBAM declarations with MTC narratives and anomaly injection',
      hardware: 'Scaleway H100 SXM 80GB (2x GPU, fr-par-2 or pl-waw-2)',
      estimatedThroughput: '~500 records/hour (2x H100 parallel generation + validation)',
      targetDatasetSize: '100,000 validated records',
      estimatedDuration: '~200 hours (8.3 days) on 2x H100',
      cost: 'EUR 546 on-demand (200h × EUR 2.73/hr) or ~EUR 380 with reserved pricing (~30% discount)',
      source: 'scaleway.com/en/h100/ — EUR 2.73/hr on-demand, ~EUR 1.90/hr reserved',
    },
    {
      name: 'Regulatory Re-simulation (Blackwell upgrade)',
      description:
        'Re-generate entire dataset when EU regulations update (e.g., 2027 ETS auction price change). Requires Blackwell for 48-hour target.',
      hardware: 'Scaleway HGX B300 (Blackwell, pre-registration) or H200',
      estimatedThroughput: '~2000 records/hour (Blackwell 10x perf/watt vs H100)',
      targetDatasetSize: '100,000 validated records (full refresh)',
      estimatedDuration: '~48 hours on Blackwell (vs ~200 hours on H100)',
      cost: 'TBD — Blackwell pre-registration pricing not yet published. H200 fallback est. EUR 700-900',
      source: 'scaleway.com/en/gpu-instances/ — HGX B300 pre-registration',
    },
  ],

  roadmap: [
    {
      phase: 'Phase 1 — Seed & Deterministic (Now)',
      timeline: 'April 2026',
      items: [
        '55 seed filings: 50 clean ground truth + 5 Red Team negatives (done — seed-dataset.ts)',
        'Deterministic validation against cbam-calculator.ts (done — llm-judge.ts)',
        'CBAM schema aligned with NeMo DataDesigner format (done — cbam-schema.ts)',
        'SyntheticDataAgent registered as Agent 19',
      ],
    },
    {
      phase: 'Phase 2 — NCC V1 Demo',
      timeline: 'May–June 2026',
      items: [
        'Dev/test generation on DGX Spark (Ollama Nemotron or Llama 3.3 8B — free, on-premise)',
        'Production generation on Scaleway H100 fr-par-2 (EUR 2.73/hr)',
        'Judge scoring via Scaleway Generative APIs (free tier, 1M tokens/month)',
        'Generate 1,000 validated records with LLM MTC narratives (~EUR 14 compute)',
        'Validate judge scoring against human-annotated ground truth from 55 seeds (including 5 Red Team negatives)',
        'V1 demo for NCC (Nordic Capital) by June 15',
      ],
    },
    {
      phase: 'Phase 3 — Full Generation (100K)',
      timeline: 'July–September 2026',
      items: [
        'Scale to 100K records on Scaleway 2x H100 (~EUR 380-546)',
        'cuDF integration for batch processing on DGX Spark (GTC 2026 Phase 3)',
        'Groq 3 LPU evaluation for real-time audit inference',
        'Full simulation matrix: 12 installations × 8 anomaly types × 1000 variations',
        'Pre-register Scaleway H200 / HGX B300 for Phase 4 upgrade',
      ],
    },
    {
      phase: 'Phase 4 — Continuous Nervous System',
      timeline: 'October 2026+',
      items: [
        'Automated re-simulation when EU regulations update',
        'Upgrade to Scaleway HGX B300 (Blackwell) for 48-hour full refresh',
        'DGX Spark as local validation node (daily health checks, seed re-validation)',
        'Integration with NVIDIA Base Command for orchestration',
        'Regulatory change detection via regulation-monitor agent',
      ],
    },
  ],
};

/**
 * Get active compute nodes only.
 */
export function getActiveNodes(): ComputeNode[] {
  return COMPUTE_STRATEGY.nodes.filter((n) => n.status === 'active');
}

/**
 * Get EU-resident inference routes (for GDPR compliance).
 */
export function getEUInferenceRoutes(): InferenceRoute[] {
  return COMPUTE_STRATEGY.inferenceRoutes.filter((r) => r.dataResidency === 'EU');
}

/**
 * Compute total owned vs. rented infrastructure for DD summary.
 */
export function getInfrastructureSummary(): {
  owned: number;
  rented: number;
  planned: number;
  euResident: number;
  totalNodes: number;
} {
  const nodes = COMPUTE_STRATEGY.nodes;
  return {
    owned: nodes.filter((n) => n.costTier === 'owned').length,
    rented: nodes.filter((n) => ['free-tier', 'pay-per-use', 'reserved'].includes(n.costTier))
      .length,
    planned: nodes.filter((n) => n.status !== 'active').length,
    euResident: nodes.filter((n) => n.dataResidency === 'EU').length,
    totalNodes: nodes.length,
  };
}
