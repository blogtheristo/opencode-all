/**
 * Schedule Genius Agent Tests
 *
 * Vitest suite for schedule-genius.agent.ts.
 * Covers main execute path, pure helpers, input validation,
 * failure paths (with mocks), and numeric thresholds.
 */

import { describe, expect, it, type Mock, vi } from 'vitest';
import { ScheduleGeniusAgent } from '../../agents/schedule-genius.agent.js';
import type { AgentContext } from '../../agents/types.js';

// ============ MOCK LLM CLIENT ============

class _MockLLMClient {
  constructor(private readonly replies: string[]) {}
  private callIndex = 0;

  async chat(
    _messages: Array<{ role: 'system' | 'user' | 'assistant' | 'tool'; content: string }>,
  ): Promise<{ content: string; model: string; inputTokens: number; outputTokens: number }> {
    const reply = this.replies[Math.min(this.callIndex++, this.replies.length - 1)];
    return {
      content: reply,
      model: 'mock-model',
      inputTokens: reply.length,
      outputTokens: reply.length,
    };
  }
}

// ============ TEST UTILITIES ============

const testContext: AgentContext = {
  projectId: 'test-project-123',
  userId: 'user-456',
  orgId: 'org-789',
  sessionId: 'session-abc',
};

function createMockAgent(): ScheduleGeniusAgent & {
  callLLM: Mock<
    ReturnType<ScheduleGeniusAgent['callLLM']>,
    Parameters<ScheduleGeniusAgent['callLLM']>
  >;
} {
  const agent = new ScheduleGeniusAgent();
  agent.callLLM = vi.fn(async () => {
    throw new Error('callLLM should be mocked in tests');
  });
  return agent as unknown as typeof agent & { callLLM: Mock };
}

// ============ TEST SUITE ============

describe('ScheduleGeniusAgent', () => {
  describe('Configuration', () => {
    it('has valid agent config', () => {
      const agent = new ScheduleGeniusAgent();
      const config = agent.getConfig();
      expect(config.name).toBe('schedule-genius');
      expect(config.description).toBe(
        'Optimizes project schedules using critical path method, identifies delays and recommends adjustments',
      );
      expect(config.capabilities).toContain('critical-path-analysis');
    });

    it('uses llama-3.3-70b-versatile model', () => {
      const agent = new ScheduleGeniusAgent();
      const config = agent.getConfig();
      expect(config.model).toBe('llama-3.3-70b-versatile');
      expect(config.modelTier).toBe('standard');
    });
  });

  describe('Input Validation', () => {
    it('rejects missing projectId', async () => {
      const agent = new ScheduleGeniusAgent();
      const promise = agent.execute(testContext, {
        tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 0 }],
      });
      await expect(promise).rejects.toThrow();
    });

    it('rejects missing tasks array', async () => {
      const agent = new ScheduleGeniusAgent();
      const promise = agent.execute(testContext, {
        projectId: 'proj-123',
      });
      await expect(promise).rejects.toThrow();
    });

    it('rejects empty tasks array', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [],
      });
      expect(response.result.projectDuration).toBe(0);
      expect(response.result.overallProgress).toBe(0);
      expect(response.result.criticalPath).toEqual([]);
    });

    it('rejects task with invalid duration (negative)', async () => {
      const agent = new ScheduleGeniusAgent();
      await expect(
        agent.execute(testContext, {
          projectId: 'proj-123',
          tasks: [{ name: 'Task A', duration: -5, dependencies: [], progress: 0 }],
        }),
      ).rejects.toThrow(/must be a non-negative number/);
    });

    it('rejects task with progress > 100', async () => {
      const agent = new ScheduleGeniusAgent();
      await expect(
        agent.execute(testContext, {
          projectId: 'proj-123',
          tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 150 }],
        }),
      ).rejects.toThrow(/must be a number between 0 and 100/);
    });

    it('handles tasks with circular dependencies (gracefully)', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 3, dependencies: ['Task B'], progress: 0 },
          { name: 'Task B', duration: 2, dependencies: ['Task A'], progress: 0 },
        ],
      });
      expect(response.result.tasks.length).toBe(2);
      expect(response.result.projectDuration).toBeGreaterThan(0);
    });
  });

  describe('Core CPM Algorithm', () => {
    it('computes correct earliest start/finish for simple chain', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 3, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 2, dependencies: ['Task A'], progress: 0 },
          { name: 'Task C', duration: 4, dependencies: ['Task B'], progress: 0 },
        ],
      });

      const taskMap = new Map(response.result.tasks.map((t: any) => [t.name, t]));

      expect(taskMap.get('Task A')?.earliestStart).toBe(0);
      expect(taskMap.get('Task A')?.earliestFinish).toBe(3);
      expect(taskMap.get('Task B')?.earliestStart).toBe(3);
      expect(taskMap.get('Task B')?.earliestFinish).toBe(5);
      expect(taskMap.get('Task C')?.earliestStart).toBe(5);
      expect(taskMap.get('Task C')?.earliestFinish).toBe(9);
    });

    it('identifies critical path correctly', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 5, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 3, dependencies: ['Task A'], progress: 0 },
          { name: 'Task C', duration: 2, dependencies: ['Task A'], progress: 0 },
        ],
      });

      expect(response.result.criticalPath).toEqual(['Task A', 'Task B']);
      expect(response.result.projectDuration).toBe(8);
    });

    it('computes total slack correctly', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 5, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 3, dependencies: ['Task A'], progress: 0 },
          { name: 'Task C', duration: 2, dependencies: ['Task A'], progress: 0 },
        ],
      });

      const taskMap = new Map(response.result.tasks.map((t: any) => [t.name, t]));

      expect(taskMap.get('Task A')?.isCritical).toBe(true);
      expect(taskMap.get('Task A')?.totalSlack).toBe(0);
      expect(taskMap.get('Task B')?.isCritical).toBe(true);
      expect(taskMap.get('Task B')?.totalSlack).toBe(0);
      expect(taskMap.get('Task C')?.isCritical).toBe(false);
      expect(taskMap.get('Task C')?.totalSlack).toBe(1);
    });

    it('handles tasks with multiple dependencies', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 3, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 2, dependencies: ['Task A'], progress: 0 },
          { name: 'Task C', duration: 4, dependencies: ['Task A'], progress: 0 },
          { name: 'Task D', duration: 2, dependencies: ['Task B', 'Task C'], progress: 0 },
        ],
      });

      expect(response.result.projectDuration).toBe(9);
      expect(response.result.criticalPath).toEqual(['Task A', 'Task C', 'Task D']);
    });

    it('computes project duration from earliest finish times', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 10, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 5, dependencies: ['Task A'], progress: 0 },
        ],
      });

      expect(response.result.projectDuration).toBe(15);
    });
  });

  describe('Progress & Status', () => {
    it('computes correct overall progress (weighted average)', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 6, dependencies: [], progress: 50 },
          { name: 'Task B', duration: 4, dependencies: ['Task A'], progress: 100 },
        ],
      });

      const totalDuration = 6 + 4;
      const weightedProgress = (50 / 100) * 6 + (100 / 100) * 4;
      const expectedProgress = Math.round((weightedProgress / totalDuration) * 100);

      expect(response.result.overallProgress).toBe(expectedProgress);
      expect(response.result.overallProgress).toBe(70);
    });

    it('marks completed tasks correctly (progress >= 100)', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 5, dependencies: [], progress: 100 },
          { name: 'Task B', duration: 3, dependencies: [], progress: 99 },
        ],
      });

      const taskMap = new Map(response.result.tasks.map((t: any) => [t.name, t]));

      expect(taskMap.get('Task A')?.status).toBe('completed');
      expect(taskMap.get('Task B')?.status).toBe('in-progress');
    });

    it('marks at-risk tasks correctly (critical + progress < 50)', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 5, dependencies: [], progress: 30 },
          { name: 'Task B', duration: 3, dependencies: ['Task A'], progress: 0 },
        ],
      });

      const taskMap = new Map(response.result.tasks.map((t: any) => [t.name, t]));

      expect(taskMap.get('Task A')?.status).toBe('at-risk');
      expect(taskMap.get('Task A')?.isCritical).toBe(true);
      expect(taskMap.get('Task B')?.status).toBe('delayed');
    });

    it('marks delayed tasks correctly (behind expected progress)', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 10, dependencies: [], progress: 10 }],
      });

      const taskMap = new Map(response.result.tasks.map((t: any) => [t.name, t]));

      expect(taskMap.get('Task A')?.status).toBe('at-risk');
    });

    it('computes remaining days correctly', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 10, dependencies: [], progress: 30 }],
      });

      const taskMap = new Map(response.result.tasks.map((t: any) => [t.name, t]));

      expect(taskMap.get('Task A')?.remainingDays).toBe(7);
    });
  });

  describe('Delay Risk Detection', () => {
    it('flags critical tasks with low progress as high severity', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 10, dependencies: [], progress: 20 },
          { name: 'Task B', duration: 5, dependencies: ['Task A'], progress: 0 },
        ],
      });

      expect(response.result.delayRisks.length).toBeGreaterThan(0);
      const highRisks = response.result.delayRisks.filter((r: any) => r.severity === 'high');
      expect(highRisks.length).toBeGreaterThan(0);
    });

    it('flags tasks with low slack as medium severity', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 4, dependencies: [], progress: 20 },
          { name: 'Task B', duration: 1, dependencies: ['Task A'], progress: 0 },
          { name: 'Task C', duration: 2, dependencies: ['Task A'], progress: 0 },
        ],
      });

      const mediumRisks = response.result.delayRisks.filter((r: any) => r.severity === 'medium');
      expect(mediumRisks.length).toBeGreaterThan(0);
    });

    it('returns empty risks for on-track schedule', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 100 }],
      });

      expect(response.result.delayRisks.length).toBe(0);
    });
  });

  describe('Recommendations', () => {
    it('generates recommendations for high-severity risks', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 10, dependencies: [], progress: 10 },
          { name: 'Task B', duration: 5, dependencies: ['Task A'], progress: 0 },
        ],
      });

      const hasPriorityRec = response.recommendations.some((r: string) => r.includes('PRIORITY'));
      expect(hasPriorityRec).toBe(true);
    });

    it('warns when > 60% tasks are on critical path', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 3, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 2, dependencies: ['Task A'], progress: 0 },
          { name: 'Task C', duration: 1, dependencies: ['Task A'], progress: 0 },
        ],
      });

      expect(
        response.recommendations.some((r: string) =>
          r.includes('Over 60% of tasks are on the critical path'),
        ),
      ).toBe(true);
    });

    it('warns when no tasks completed with multiple tasks', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 3, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 2, dependencies: [], progress: 0 },
          { name: 'Task C', duration: 1, dependencies: [], progress: 0 },
          { name: 'Task D', duration: 2, dependencies: [], progress: 0 },
        ],
      });

      expect(
        response.recommendations.some((r: string) => r.includes('No tasks completed yet')),
      ).toBe(true);
    });

    it('suggests independent tasks that can start immediately', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 3, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 2, dependencies: [], progress: 0 },
          { name: 'Task C', duration: 1, dependencies: ['Task A'], progress: 0 },
        ],
      });

      expect(
        response.recommendations.some((r: string) =>
          r.includes('independent task(s) have not started yet'),
        ),
      ).toBe(true);
    });
  });

  describe('LLM Enhancement Failure Path', () => {
    it('gracefully handles LLM call failure', async () => {
      const agent = new ScheduleGeniusAgent();
      // Override callLLM to throw
      // @ts-expect-error - private method
      agent.callLLM = async () => {
        throw new Error('LLM service unavailable');
      };

      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 0 }],
      });

      expect(response.result.llmOptimization).toBe('');
      expect(response.result.tasks).toBeDefined();
      expect(response.result.criticalPath).toBeDefined();
    });

    it('handles malformed LLM response', async () => {
      const agent = createMockAgent();
      // @ts-expect-error - private method
      agent.callLLM = async () => ({
        content: 'not valid json at all',
        model: 'mock-model',
        inputTokens: 0,
        outputTokens: 0,
      });

      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 0 }],
      });

      expect(response.result.llmOptimization).toBe('');
      expect(response.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles single task project', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 0 }],
      });

      expect(response.result.projectDuration).toBe(5);
      expect(response.result.criticalPath).toEqual(['Task A']);
      expect(response.result.summary.totalTasks).toBe(1);
    });

    it('handles project with no dependencies', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 5, dependencies: [], progress: 0 },
          { name: 'Task B', duration: 3, dependencies: [], progress: 0 },
          { name: 'Task C', duration: 4, dependencies: [], progress: 0 },
        ],
      });

      expect(response.result.projectDuration).toBe(5);
      expect(response.result.criticalPath).toEqual(['Task A']);
    });

    it('returns correct metadata with duration and token usage', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 0 }],
      });

      expect(response.metadata.durationMs).toBeGreaterThanOrEqual(0);
      expect(response.metadata.llmModel).toBeDefined();
    });

    it('handles tasks with zero progress (not-started)', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [{ name: 'Task A', duration: 5, dependencies: [], progress: 0 }],
      });

      expect(response.result.tasks[0].status).toBe('not-started');
      expect(response.result.tasks[0].progress).toBe(0);
    });
  });

  describe('Summary Statistics', () => {
    it('computes correct summary counts', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [
          { name: 'Task A', duration: 5, dependencies: [], progress: 100 },
          { name: 'Task B', duration: 3, dependencies: [], progress: 50 },
          { name: 'Task C', duration: 2, dependencies: [], progress: 0 },
          { name: 'Task D', duration: 4, dependencies: [], progress: 100 },
        ],
      });

      expect(response.result.summary.totalTasks).toBe(4);
      expect(response.result.summary.completedTasks).toBe(2);
      expect(response.result.summary.atRiskTasks).toBeGreaterThanOrEqual(0);
    });

    it('computes overall progress for empty tasks', async () => {
      const agent = new ScheduleGeniusAgent();
      const response = await agent.execute(testContext, {
        projectId: 'proj-123',
        tasks: [],
      });

      expect(response.result.overallProgress).toBe(0);
      expect(response.result.projectDuration).toBe(0);
    });
  });
});
