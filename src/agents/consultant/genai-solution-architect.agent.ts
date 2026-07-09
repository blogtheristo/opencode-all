import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import logger from '../../utils/logger.js';

const SOUL = `You are the GenAI Solution Architect for DWS IQ 6 — Lifetime Oy's enterprise climate intelligence platform.

Your role: Design enterprise AI architecture using Claude Code, Qwen, Llama, and other foundation models. Configure KYA (Know Your Agent) management and agent architecture for large enterprises.

Core competencies:
- Foundation model selection: Claude (Anthropic), Qwen (Alibaba), Llama (Meta), Gemini (Google)
- Claude Code deployment and workflow automation
- KYA (Know Your Agent) sandbox management: trust tiers, autonomy phases
- Multi-agent architecture design (50+ agent fleet orchestration)
- MCP (Model Context Protocol) server configuration
- RAG pipeline design (vector stores, embedding strategies)
- Prompt engineering and system prompt architecture
- Cost optimization across model providers

Architecture patterns:
- Agent fleet: Brain (orchestrator) → Memory (context) → Body (inference) → Hands (tools)
- KYA tiers: sandbox (observe) → professional (advise) → enterprise (act)
- Model routing: lite tasks → Groq/Ollama, standard → Haiku/Llama 70B, heavy → Opus/Sonnet
- MCP integration: Google Drive, GitHub, Calendar, custom enterprise connectors

Output format: Always respond with valid JSON containing keys: "architectureDesign", "modelSelection", "kyaConfiguration", "agentTopology", "costEstimate".`;

export class GenAISolutionArchitectAgent extends BaseAgent {
  constructor() {
    super({
      name: 'genai-solution-architect',
      description:
        'Designs enterprise GenAI architecture with Claude Code, KYA management, and multi-agent orchestration',
      capabilities: [
        'genai-architecture',
        'kya-management',
        'agent-orchestration',
        'model-selection',
        'mcp-integration',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'heavy',
      autonomyPhase: 'advisor',
      notify: { channels: ['in_app'], maxPerHour: 3, maxPerDay: 10 },
    });
    this.soulPrompt = SOUL;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const useCase = (input.useCase as string) || 'enterprise-ai';
    const scale = (input.scale as string) || 'large';

    logger.info('GenAI Solution Architect executing', {
      useCase,
      scale,
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

    const prompt = `Design a GenAI solution architecture:
Use case: ${useCase}
Enterprise scale: ${scale}
Current AI maturity: ${(input.aiMaturity as string) || 'beginner'}
Budget range: ${(input.budgetRange as string) || 'unspecified'}
Security requirements: ${(input.securityRequirements as string) || 'standard'}
Existing infrastructure: ${JSON.stringify(input.existingInfra || [])}
Agent needs: ${JSON.stringify(input.agentNeeds || [])}
Data sources for RAG: ${JSON.stringify(input.dataSources || [])}

Design the architecture including model selection, KYA configuration, agent topology, and cost estimate.`;

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
      result: { useCase, scale, ...parsed },
      confidence: 0.8,
      reasoning: `Designed GenAI architecture for ${useCase} at ${scale} scale. Included KYA configuration and agent topology.`,
      recommendations: Array.isArray(parsed.costEstimate)
        ? (parsed.costEstimate as string[])
        : ['Start with pilot KYA sandbox tier', 'Design agent topology before scaling'],
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
