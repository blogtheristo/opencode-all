***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Extracted from AGENTS.md §9 as part of agents-md-slim refactoring

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

# Agent Development Guide

How to add a new agent to DWS IQ 6. Extracted from AGENTS.md §9.

---

## Step 1: Create the agent file

```bash
# File: src/agents/your-agent.agent.ts
```

```typescript
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

interface YourAgentInput {
  // Define input schema
}

export class YourAgent extends BaseAgent {
  constructor() {
    super({
      name: 'your-agent',           // kebab-case, unique
      description: 'One sentence',
      capabilities: ['cap-1', 'cap-2'],
      model: 'llama-3.3-70b-versatile',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const typedInput = input as unknown as YourAgentInput;

    // Log start
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input, output: null, status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    // 1. Deterministic scoring first (naive then optimize)
    // 2. LLM enhancement via this.callLLM()
    // 3. Build response

    const durationMs = Date.now() - startTime;

    const response: AgentResponse = {
      agentName: this.config.name,
      result: { /* your output */ },
      confidence: 0.85,
      reasoning: 'Explain the scoring logic',
      recommendations: ['Action 1', 'Action 2'],
      metadata: { durationMs },
    };

    // Log completion
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input, output: response, status: 'completed',
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    });

    return response;
  }
}
```

## Step 2: Register in the registry

```typescript
// src/agents/index.ts — add import and registration
import { YourAgent } from './your-agent.agent.js';

// In registerDefaults():
this.register(new YourAgent());
```

## Step 3: Add tests

```typescript
// src/__tests__/your-agent.test.ts
```

## Step 4: Update AGENTS.md

Add the agent to the Platform Agents table in Section 7. The `agents-md-sync` workflow will auto-detect the new file and add it to the table on next push to main.

## Step 5: Add Claude Code skill

Create `.claude/commands/<agent-name>.md` with the skill definition. Every agent MUST have a corresponding skill (see CLAUDE.md Build for Agents rule).

## Agent Cost Tracking

Every agent has a monthly budget:

```yaml
cost_tracking:
  budget_monthly_eur: 100-150
  alert_at_percentage: 80
  model_costs:
    llama_3_3_70b:
      provider: groq
      input_per_1m_tokens: 0.59
      output_per_1m_tokens: 0.79
    claude_sonnet_4_5:
      provider: anthropic
      input_per_1m_tokens: 3.00
      output_per_1m_tokens: 15.00
```
