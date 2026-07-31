/**
 * Schedule Genius Agent - Timeline Optimization & Critical Path Analysis
 *
 * Optimizes project schedules by identifying critical path delays,
 * computing slack times, and recommending schedule adjustments.
 * Uses a simplified CPM (Critical Path Method) algorithm.
 *
 * Input: { projectId, tasks: Array<{ name, duration, dependencies, progress }> }
 * Output: optimized schedule, critical path, delay risks, recommendations
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ INPUT INTERFACE ============

interface TaskInput {
  name: string;
  /** Duration in days */
  duration: number;
  /** Names of tasks this depends on */
  dependencies: string[];
  /** Completion percentage 0-100 */
  progress: number;
}

interface ScheduleGeniusInput {
  projectId: string;
  tasks: TaskInput[];
}

// ============ INTERNAL TYPES ============

interface ScheduledTask {
  name: string;
  duration: number;
  progress: number;
  dependencies: string[];
  earliestStart: number;
  earliestFinish: number;
  latestStart: number;
  latestFinish: number;
  totalSlack: number;
  isCritical: boolean;
  remainingDays: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'at-risk' | 'delayed';
}

// ============ AGENT IMPLEMENTATION ============

export class ScheduleGeniusAgent extends BaseAgent {
  constructor() {
    super({
      name: 'schedule-genius',
      description:
        'Optimizes project schedules using critical path method, identifies delays and recommends adjustments',
      capabilities: [
        'critical-path-analysis',
        'schedule-optimization',
        'delay-risk-detection',
        'resource-leveling-hints',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const schedInput = input as unknown as ScheduleGeniusInput;
    const { projectId, tasks } = schedInput;

    logger.info('ScheduleGenius agent executing', {
      projectId,
      taskCount: tasks.length,
      userId: context.userId,
    });

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      // 1. Run forward pass (earliest start/finish)
      const taskMap = this.forwardPass(tasks);

      // 2. Run backward pass (latest start/finish, slack)
      this.backwardPass(taskMap);

      // 3. Identify critical path
      const criticalPath = this.extractCriticalPath(taskMap);

      // 4. Compute project-level metrics
      const scheduledTasks = Array.from(taskMap.values());
      const projectDuration = Math.max(...scheduledTasks.map((t) => t.earliestFinish));
      const overallProgress = this.computeOverallProgress(scheduledTasks);
      const delayRisks = this.identifyDelayRisks(scheduledTasks);

      // 5. Build recommendations
      const recommendations = this.buildRecommendations(scheduledTasks, criticalPath, delayRisks);

      // 6. Optional LLM enhancement
      const llmResponse = await this.callLLM(
        `Analyze this project schedule and suggest optimizations:
Project: ${projectId}, Tasks: ${tasks.length}, Duration: ${projectDuration} days
Critical path: ${criticalPath.join(' -> ')}
Overall progress: ${overallProgress}%
Delay risks: ${delayRisks.map((r) => r.taskName).join(', ') || 'None'}
Respond as JSON with keys: "optimization" (string), "riskMitigation" (string[])`,
      );

      let llmOptimization = '';
      try {
        const parsed = JSON.parse(llmResponse.content);
        llmOptimization = parsed.optimization || '';
        if (Array.isArray(parsed.riskMitigation)) {
          recommendations.push(...parsed.riskMitigation);
        }
      } catch {
        // Non-critical - continue with deterministic results
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          projectId,
          projectDuration,
          overallProgress,
          criticalPath,
          tasks: scheduledTasks.map((t) => ({
            name: t.name,
            duration: t.duration,
            progress: t.progress,
            earliestStart: t.earliestStart,
            earliestFinish: t.earliestFinish,
            latestStart: t.latestStart,
            latestFinish: t.latestFinish,
            totalSlack: t.totalSlack,
            isCritical: t.isCritical,
            remainingDays: t.remainingDays,
            status: t.status,
          })),
          delayRisks: delayRisks.map((r) => ({
            taskName: r.taskName,
            severity: r.severity,
            reason: r.reason,
            impactDays: r.impactDays,
          })),
          summary: {
            totalTasks: tasks.length,
            criticalTasks: scheduledTasks.filter((t) => t.isCritical).length,
            atRiskTasks: scheduledTasks.filter((t) => t.status === 'at-risk').length,
            delayedTasks: scheduledTasks.filter((t) => t.status === 'delayed').length,
            completedTasks: scheduledTasks.filter((t) => t.status === 'completed').length,
          },
          llmOptimization,
        },
        confidence: tasks.length > 0 ? 0.9 : 0.5,
        reasoning: `Critical path analysis across ${tasks.length} tasks yields a project duration of ${projectDuration} days. ${criticalPath.length} tasks are on the critical path. Overall progress is ${overallProgress}%. ${delayRisks.length} task(s) identified as delay risks.`,
        recommendations: [...new Set(recommendations)],
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
        input: input,
        output: response,
        status: 'completed',
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;
      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input: input,
        output: null,
        status: 'error',
        error_message: err.message,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });
      throw err;
    }
  }

  // ============ CPM ALGORITHM ============

  /** Forward pass: compute earliest start and finish times */
  private forwardPass(tasks: TaskInput[]): Map<string, ScheduledTask> {
    const taskMap = new Map<string, ScheduledTask>();

    // Initialize all tasks
    for (const task of tasks) {
      const remainingDays = Math.round(task.duration * (1 - task.progress / 100));
      taskMap.set(task.name, {
        name: task.name,
        duration: task.duration,
        progress: task.progress,
        dependencies: task.dependencies,
        earliestStart: 0,
        earliestFinish: 0,
        latestStart: 0,
        latestFinish: 0,
        totalSlack: 0,
        isCritical: false,
        remainingDays,
        status: task.progress >= 100 ? 'completed' : task.progress > 0 ? 'in-progress' : 'not-started',
      });
    }

    // Topological sort and forward pass
    const visited = new Set<string>();
    const sorted: string[] = [];

    const visit = (name: string) => {
      if (visited.has(name)) return;
      visited.add(name);
      const task = taskMap.get(name);
      if (!task) return;
      for (const dep of task.dependencies) {
        visit(dep);
      }
      sorted.push(name);
    };

    for (const task of tasks) {
      visit(task.name);
    }

    // Compute earliest start/finish
    for (const name of sorted) {
      const task = taskMap.get(name)!;
      let es = 0;
      for (const dep of task.dependencies) {
        const depTask = taskMap.get(dep);
        if (depTask) {
          es = Math.max(es, depTask.earliestFinish);
        }
      }
      task.earliestStart = es;
      task.earliestFinish = es + task.duration;
    }

    return taskMap;
  }

  /** Backward pass: compute latest start/finish and slack */
  private backwardPass(taskMap: Map<string, ScheduledTask>): void {
    const tasks = Array.from(taskMap.values());
    const projectEnd = Math.max(...tasks.map((t) => t.earliestFinish));

    // Initialize latest finish to project end
    for (const task of tasks) {
      task.latestFinish = projectEnd;
      task.latestStart = projectEnd - task.duration;
    }

    // Backward pass (reverse topological order)
    const reversed = [...tasks].reverse();
    for (const task of reversed) {
      // Find all tasks that depend on this task
      const successors = tasks.filter((t) => t.dependencies.includes(task.name));
      if (successors.length > 0) {
        task.latestFinish = Math.min(...successors.map((s) => s.latestStart));
        task.latestStart = task.latestFinish - task.duration;
      }
    }

    // Compute slack and critical flag
    for (const task of tasks) {
      task.totalSlack = task.latestStart - task.earliestStart;
      task.isCritical = task.totalSlack === 0;

      // Refine status for at-risk tasks
      if (task.status === 'in-progress' && task.isCritical && task.progress < 50) {
        task.status = 'at-risk';
      }
      if (task.status === 'in-progress' || task.status === 'not-started') {
        // Estimate expected progress based on earliest start
        const expectedProgress = task.earliestFinish > 0
          ? Math.min(100, Math.round((task.earliestStart / task.earliestFinish) * 100))
          : 0;
        if (task.progress < expectedProgress - 20 && task.isCritical) {
          task.status = 'delayed';
        }
      }
    }
  }

  /** Extract the critical path as an ordered list of task names */
  private extractCriticalPath(taskMap: Map<string, ScheduledTask>): string[] {
    return Array.from(taskMap.values())
      .filter((t) => t.isCritical)
      .sort((a, b) => a.earliestStart - b.earliestStart)
      .map((t) => t.name);
  }

  /** Compute weighted overall progress */
  private computeOverallProgress(tasks: ScheduledTask[]): number {
    if (tasks.length === 0) return 0;
    const totalDuration = tasks.reduce((sum, t) => sum + t.duration, 0);
    if (totalDuration === 0) return 0;
    const weightedProgress = tasks.reduce(
      (sum, t) => sum + (t.progress / 100) * t.duration,
      0,
    );
    return Math.round((weightedProgress / totalDuration) * 100);
  }

  /** Identify tasks at risk of causing delays */
  private identifyDelayRisks(tasks: ScheduledTask[]): Array<{
    taskName: string;
    severity: 'low' | 'medium' | 'high';
    reason: string;
    impactDays: number;
  }> {
    const risks: Array<{
      taskName: string;
      severity: 'low' | 'medium' | 'high';
      reason: string;
      impactDays: number;
    }> = [];

    for (const task of tasks) {
      if (task.status === 'completed') continue;

      // Critical path task with low progress
      if (task.isCritical && task.progress < 30 && task.duration > 5) {
        risks.push({
          taskName: task.name,
          severity: 'high',
          reason: `Critical path task at only ${task.progress}% with ${task.remainingDays} days remaining`,
          impactDays: task.remainingDays,
        });
      }

      // Near-zero slack with incomplete status
      if (task.totalSlack > 0 && task.totalSlack <= 2 && task.progress < 80) {
        risks.push({
          taskName: task.name,
          severity: 'medium',
          reason: `Only ${task.totalSlack} day(s) of slack remaining with ${task.progress}% complete`,
          impactDays: task.totalSlack,
        });
      }

      // Delayed status
      if (task.status === 'delayed') {
        risks.push({
          taskName: task.name,
          severity: 'high',
          reason: `Task is behind expected progress on the critical path`,
          impactDays: task.remainingDays,
        });
      }
    }

    return risks.sort((a, b) => {
      const sev = { high: 0, medium: 1, low: 2 };
      return sev[a.severity] - sev[b.severity];
    });
  }

  private buildRecommendations(
    tasks: ScheduledTask[],
    criticalPath: string[],
    delayRisks: Array<{ taskName: string; severity: string }>,
  ): string[] {
    const recs: string[] = [];

    const highRisks = delayRisks.filter((r) => r.severity === 'high');
    if (highRisks.length > 0) {
      recs.push(
        `PRIORITY: Allocate additional resources to ${highRisks.map((r) => r.taskName).join(', ')} to prevent critical path delays`,
      );
    }

    if (criticalPath.length > tasks.length * 0.6) {
      recs.push(
        'Over 60% of tasks are on the critical path - consider parallelizing work to reduce schedule risk',
      );
    }

    const completedCount = tasks.filter((t) => t.status === 'completed').length;
    if (completedCount === 0 && tasks.length > 3) {
      recs.push('No tasks completed yet - verify that task dependencies are realistic and resources are assigned');
    }

    const notStarted = tasks.filter((t) => t.status === 'not-started' && t.dependencies.length === 0);
    if (notStarted.length > 0) {
      recs.push(
        `${notStarted.length} independent task(s) have not started yet: ${notStarted.map((t) => t.name).join(', ')}. These can begin immediately.`,
      );
    }

    if (recs.length === 0) {
      recs.push('Schedule is on track - continue monitoring critical path tasks for early warning signals');
    }

    return recs;
  }
}
