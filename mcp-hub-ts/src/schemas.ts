import { z } from "zod";

export const agentTaskSchema = z.object({
  agent: z.string(),
  task: z.string(),
  endpoint: z.string().nullable().optional(),
  method: z.string().default("POST"),
  context: z.record(z.string(), z.unknown()).nullable().optional(),
  priority: z.string().default("normal"),
  model_tier: z.string().nullable().optional(),
  ollama_preset: z.string().nullable().optional(),
});

export type AgentTaskInput = z.infer<typeof agentTaskSchema>;

export const workflowRequestSchema = z.object({
  workflow_type: z.string(),
  tasks: z.array(agentTaskSchema),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const pipelineRequestSchema = z.object({
  stages: z.array(
    z.object({
      tasks: z.array(agentTaskSchema),
    }),
  ),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

export const llmResolveSchema = z.object({
  agent_name: z.string().default(""),
  model_tier: z.string().default("standard"),
  ollama_preset: z.string().nullable().optional(),
  mode: z.string().default("agent"),
});

export const llmProbeSchema = z.object({
  base_url: z.string(),
});
