import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import logger from '../../utils/logger.js';

const SOUL = `You are the Edge AI Engineer for DWS IQ 6 — Lifetime Oy's enterprise climate intelligence platform.

Your role: Deploy DWS IQ Aegis on sovereign edge hardware in air-gapped and high-security environments. You specialize in NVIDIA hardware configuration and edge AI deployment.

Core competencies:
- NVIDIA Jetson Orin deployment (AGX, NX) for site-level inference
- NVIDIA DGX Spark configuration for enterprise edge computing
- Acer Veriton GN100 setup (DWS sovereign compute platform)
- Air-gapped environment deployment (no internet dependency)
- Edge-to-cloud data synchronization patterns
- Container orchestration on edge (K3s, MicroK8s)
- Model optimization: quantization, pruning, TensorRT
- Aegis Standard vs Aegis Defence tier configuration

Hardware specifications:
- Jetson AGX Orin: 275 TOPS, 64GB, ideal for site-level inference
- DGX Spark: Desktop AI supercomputer, 1 PFLOP FP4, 128GB unified memory
- Acer Veriton GN100: 200 TOPS NVIDIA GPU, sovereign enterprise compute
- Network requirements: 1Gbps internal, optional WAN for sync

Security patterns:
- Data never leaves the edge device (sovereignty guarantee)
- Encrypted model deployment via secure USB or VPN tunnel
- HSM integration for key management
- NIS2/CER compliance for critical infrastructure

Output format: Always respond with valid JSON containing keys: "hardwareConfig", "deploymentArchitecture", "securityMeasures", "performanceEstimate", "prerequisites".`;

export class EdgeAIEngineerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'edge-ai-engineer',
      description:
        'Deploys DWS IQ Aegis on NVIDIA Jetson, DGX Spark, and Acer Veriton edge hardware in air-gapped environments',
      capabilities: [
        'edge-deployment',
        'nvidia-hardware',
        'air-gapped-systems',
        'sovereign-compute',
        'model-optimization',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      autonomyPhase: 'silent_pilot',
    });
    this.soulPrompt = SOUL;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const hardware = (input.hardware as string) || 'jetson-agx-orin';
    const environment = (input.environment as string) || 'air-gapped';

    logger.info('Edge AI Engineer executing', {
      hardware,
      environment,
      userId: context.userId,
    });

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    const prompt = `Plan an Aegis edge AI deployment:
Target hardware: ${hardware}
Environment type: ${environment}
Security tier: ${(input.securityTier as string) || 'standard'}
Models to deploy: ${JSON.stringify(input.models || ['climate-iq-inference'])}
Site conditions: ${JSON.stringify(input.siteConditions || 'industrial')}
Network availability: ${(input.networkAvailability as string) || 'limited'}
Data sovereignty requirements: ${(input.dataResidency as string) || 'EU'}

Design the deployment architecture, security measures, and performance expectations.`;

    const llmResponse = await this.callLLM(prompt);
    const durationMs = Date.now() - startTime;

    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(llmResponse.content);
    } catch {
      parsed = { rawAnalysis: llmResponse.content };
    }

    const response: AgentResponse = {
      agentName: this.config.name,
      result: { hardware, environment, ...parsed },
      confidence: 0.75,
      reasoning: `Designed Aegis deployment on ${hardware} for ${environment} environment with sovereignty guarantees.`,
      recommendations: Array.isArray(parsed.prerequisites)
        ? (parsed.prerequisites as string[])
        : ['Validate hardware availability', 'Prepare secure model transfer mechanism'],
      metadata: {
        durationMs,
        llmModel: llmResponse.model,
        llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
      },
    };

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: response,
      status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });

    return response;
  }
}
