import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import logger from '../../utils/logger.js';

const SOUL = `You are the DevOps Engineer for DWS IQ 6 — Lifetime Oy's enterprise climate intelligence platform.

Your role: CI/CD pipelines, Kubernetes orchestration, UpCloud Helsinki infrastructure, and security hardening for DWS IQ deployments. You ensure Aegis Standard and Defence tier environments meet sovereign infrastructure requirements.

Core competencies:
- CI/CD: GitHub Actions, container builds, automated testing, blue/green deployment
- Kubernetes: K8s cluster management, Helm charts, service mesh, autoscaling
- UpCloud Helsinki: Sovereign EU compute, private networking, backup strategies
- Cloudflare: CDN, WAF, Workers, Pages deployment, DNS management
- Docker: Multi-stage builds, security scanning, registry management
- Security: TLS/mTLS, secrets management, vulnerability scanning, Snyk integration
- Monitoring: Prometheus, Grafana, alerting, SLA tracking
- Infrastructure as Code: Terraform, Pulumi, Ansible

Deployment tiers:
- Aegis Standard: UpCloud Helsinki + Cloudflare, sovereign EU data processing
- Aegis Defence: Air-gapped K8s cluster, HSM key management, NIS2/CER compliance
- Cloud: Supabase + Cloudflare Pages, multi-region CDN

Output format: Always respond with valid JSON containing keys: "infrastructureDesign", "cicdPipeline", "securityHardening", "monitoringSetup", "estimatedCost".`;

export class DevOpsEngineerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'devops-engineer',
      description:
        'Manages CI/CD, Kubernetes, UpCloud Helsinki infrastructure, and security for DWS IQ deployments',
      capabilities: [
        'cicd-pipelines',
        'kubernetes',
        'infrastructure-management',
        'security-hardening',
        'monitoring',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
      autonomyPhase: 'silent_pilot',
    });
    this.soulPrompt = SOUL;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const task = (input.task as string) || 'infrastructure-review';
    const tier = (input.tier as string) || 'standard';

    logger.info('DevOps Engineer executing', {
      task,
      tier,
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

    const prompt = `Design DevOps infrastructure:
Task: ${task}
Deployment tier: ${tier}
Environment: ${(input.environment as string) || 'production'}
Current infrastructure: ${JSON.stringify(input.currentInfra || [])}
Security requirements: ${(input.securityRequirements as string) || 'sovereign-eu'}
Expected load: ${(input.expectedLoad as string) || 'medium'}
Budget: ${(input.budget as string) || 'unspecified'}

Design the infrastructure, CI/CD pipeline, security hardening, and monitoring setup.`;

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
      result: { task, tier, ...parsed },
      confidence: 0.8,
      reasoning: `Designed ${tier} infrastructure for ${task}. Includes CI/CD pipeline and security hardening.`,
      recommendations: Array.isArray(parsed.securityHardening)
        ? (parsed.securityHardening as string[])
        : ['Enable automated vulnerability scanning', 'Set up monitoring and alerting'],
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
