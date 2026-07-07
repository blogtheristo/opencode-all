import crypto from 'crypto';
import { getSupabaseClient } from '../config/supabase.js';
import { getInternalDbPool } from '../config/internal-db.js';
import logger from '../utils/logger.js';

export type TokenProvider = 'anthropic' | 'github' | 'openai' | 'other';
export type TokenProduct = 'claude-code' | 'github-copilot' | 'other';

export interface TokenUsageEventInput {
  eventId?: string;
  provider: TokenProvider;
  product: TokenProduct;
  model: string;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  sessionId: string;
  taskId: string;
  timestamp: string;
}

export interface TokenBudgetInput {
  dailyLimitTokens: number;
  monthlyLimitTokens: number;
  monthlyLimitEur: number;
  hardCap: boolean;
  notifyThresholds: number[];
}

interface StoredTokenUsageEvent extends TokenUsageEventInput {
  userId: string;
  organizationId: string | null;
  costEur: number;
  dedupeKey: string;
}

export interface TokenBudget extends TokenBudgetInput {
  updatedAt: string;
}

interface TokenRecommendation {
  ruleId: string;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  estimatedSavingsEur: number;
}

interface RateCard {
  inputPerTokenEur: number;
  outputPerTokenEur: number;
  cachedPerTokenEur: number;
}

const DEFAULT_RATE_CARD: RateCard = {
  inputPerTokenEur: 0.000003,
  outputPerTokenEur: 0.000015,
  cachedPerTokenEur: 0.0000003,
};

const RATE_BY_MODEL: Record<string, RateCard> = {
  'claude-sonnet-4.5': DEFAULT_RATE_CARD,
  'claude-sonnet-4.6': DEFAULT_RATE_CARD,
  'gpt-5.4': {
    inputPerTokenEur: 0.0000025,
    outputPerTokenEur: 0.00001,
    cachedPerTokenEur: 0.0000002,
  },
};

const RATE_BY_PRODUCT: Record<TokenProduct, RateCard> = {
  'claude-code': DEFAULT_RATE_CARD,
  'github-copilot': {
    inputPerTokenEur: 0.0000015,
    outputPerTokenEur: 0.000006,
    cachedPerTokenEur: 0.0000001,
  },
  other: DEFAULT_RATE_CARD,
};

const eventsByUser = new Map<string, StoredTokenUsageEvent[]>();
const budgetsByUser = new Map<string, TokenBudget>();
const dedupeKeysByUser = new Map<string, Set<string>>();

function computeDedupeKey(userId: string, event: TokenUsageEventInput): string {
  if (event.eventId) {
    return `${userId}:${event.eventId}`;
  }

  const fingerprint = [
    userId,
    event.provider,
    event.product,
    event.model,
    event.promptTokens,
    event.completionTokens,
    event.cachedTokens,
    event.sessionId,
    event.taskId,
    event.timestamp,
  ].join('|');

  return crypto.createHash('sha1').update(fingerprint, 'utf8').digest('hex');
}

function resolveRateCard(event: TokenUsageEventInput): RateCard {
  return RATE_BY_MODEL[event.model] || RATE_BY_PRODUCT[event.product] || DEFAULT_RATE_CARD;
}

function computeEventCostEur(event: TokenUsageEventInput): number {
  const rate = resolveRateCard(event);
  const cost =
    event.promptTokens * rate.inputPerTokenEur +
    event.completionTokens * rate.outputPerTokenEur +
    event.cachedTokens * rate.cachedPerTokenEur;
  return Number(cost.toFixed(6));
}

function toDateOrThrow(value: string): Date {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid timestamp: ${value}`);
  }
  return parsed;
}

function getOrCreateUserEvents(userId: string): StoredTokenUsageEvent[] {
  const existing = eventsByUser.get(userId);
  if (existing) {
    return existing;
  }
  const created: StoredTokenUsageEvent[] = [];
  eventsByUser.set(userId, created);
  return created;
}

function getOrCreateDedupeSet(userId: string): Set<string> {
  const existing = dedupeKeysByUser.get(userId);
  if (existing) {
    return existing;
  }
  const created = new Set<string>();
  dedupeKeysByUser.set(userId, created);
  return created;
}

function getMonthStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
}

function toSnakeCaseRow(event: StoredTokenUsageEvent) {
  return {
    organization_id: event.organizationId,
    user_id: event.userId,
    event_id: event.eventId ?? null,
    dedupe_key: event.dedupeKey,
    provider: event.provider,
    product: event.product,
    model: event.model,
    prompt_tokens: event.promptTokens,
    completion_tokens: event.completionTokens,
    cached_tokens: event.cachedTokens,
    cost_eur: event.costEur,
    session_id: event.sessionId,
    task_id: event.taskId,
    created_at: event.timestamp,
  };
}

function fromSnakeCaseRow(row: any): StoredTokenUsageEvent {
  return {
    userId: row.user_id,
    organizationId: row.organization_id ?? null,
    eventId: row.event_id ?? undefined,
    provider: row.provider,
    product: row.product,
    model: row.model,
    promptTokens: row.prompt_tokens,
    completionTokens: row.completion_tokens,
    cachedTokens: row.cached_tokens,
    // pg returns NUMERIC columns as strings — coerce so downstream arithmetic
    // (totalCostEur += event.costEur) is numeric addition, not concatenation.
    costEur: Number(row.cost_eur),
    sessionId: row.session_id,
    taskId: row.task_id,
    timestamp: row.created_at,
    dedupeKey: row.dedupe_key,
  };
}

async function resolveOrganizationId(userId: string): Promise<string | null> {
  const sb = getSupabaseClient();
  if (!sb) {
    return null;
  }

  const { data, error } = await sb
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.warn('Failed resolving organization for token usage', { userId, error: error.message });
    return null;
  }

  return data?.organization_id ?? null;
}

async function getBudgetFromDb(userId: string): Promise<TokenBudget | null> {
  const pool = getInternalDbPool();
  if (!pool) {
    return null;
  }

  let data: any;
  try {
    const { rows } = await pool.query(
      `SELECT daily_limit_tokens, monthly_limit_tokens, monthly_limit_eur, hard_cap, notify_thresholds, updated_at
       FROM token_budgets WHERE user_id = $1`,
      [userId],
    );
    data = rows[0];
  } catch (error) {
    logger.warn('Failed reading token budget from internal DB', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }

  if (!data) {
    return null;
  }

  return {
    dailyLimitTokens: data.daily_limit_tokens,
    monthlyLimitTokens: data.monthly_limit_tokens,
    // pg returns NUMERIC columns as strings — coerce for downstream arithmetic.
    monthlyLimitEur: Number(data.monthly_limit_eur),
    hardCap: data.hard_cap,
    notifyThresholds: Array.isArray(data.notify_thresholds) ? data.notify_thresholds : [],
    updatedAt: data.updated_at,
  };
}

async function getEventsForPeriod(
  userId: string,
  periodDays: number,
  sessionId?: string,
): Promise<StoredTokenUsageEvent[]> {
  const pool = getInternalDbPool();
  const periodStart = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString();

  if (pool) {
    try {
      const selectCols =
        'organization_id, user_id, event_id, dedupe_key, provider, product, model, prompt_tokens, completion_tokens, cached_tokens, cost_eur, session_id, task_id, created_at';
      const { rows } = sessionId
        ? await pool.query(
            `SELECT ${selectCols} FROM token_usage_events
             WHERE user_id = $1 AND created_at >= $2 AND session_id = $3`,
            [userId, periodStart, sessionId],
          )
        : await pool.query(
            `SELECT ${selectCols} FROM token_usage_events
             WHERE user_id = $1 AND created_at >= $2`,
            [userId, periodStart],
          );
      return rows.map(fromSnakeCaseRow);
    } catch (error) {
      logger.warn('Failed reading token usage events from internal DB', {
        userId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (eventsByUser.get(userId) || []).filter((event) => {
    const inWindow = toDateOrThrow(event.timestamp).getTime() >= new Date(periodStart).getTime();
    const inSession = !sessionId || event.sessionId === sessionId;
    return inWindow && inSession;
  });
}

function computeSummaryFromEvents(
  events: StoredTokenUsageEvent[],
  budget: TokenBudget | null,
  periodDays: number,
) {
  const byModelMap = new Map<
    string,
    { model: string; events: number; totalTokens: number; totalCostEur: number }
  >();
  let totalPromptTokens = 0;
  let totalCompletionTokens = 0;
  let totalCachedTokens = 0;
  let totalCostEur = 0;

  for (const event of events) {
    totalPromptTokens += event.promptTokens;
    totalCompletionTokens += event.completionTokens;
    totalCachedTokens += event.cachedTokens;
    totalCostEur += event.costEur;

    const modelEntry = byModelMap.get(event.model) || {
      model: event.model,
      events: 0,
      totalTokens: 0,
      totalCostEur: 0,
    };
    modelEntry.events += 1;
    modelEntry.totalTokens += event.promptTokens + event.completionTokens + event.cachedTokens;
    modelEntry.totalCostEur += event.costEur;
    byModelMap.set(event.model, modelEntry);
  }

  const monthStartTs = getMonthStart().getTime();
  const monthlyEvents = events.filter(
    (event) => toDateOrThrow(event.timestamp).getTime() >= monthStartTs,
  );
  const monthlyTokens = monthlyEvents.reduce(
    (sum, event) => sum + event.promptTokens + event.completionTokens + event.cachedTokens,
    0,
  );
  const monthlyCostEur = monthlyEvents.reduce((sum, event) => sum + event.costEur, 0);

  const monthlyTokenUsagePct =
    budget && budget.monthlyLimitTokens > 0
      ? Number(((monthlyTokens / budget.monthlyLimitTokens) * 100).toFixed(2))
      : null;
  const monthlyCostUsagePct =
    budget && budget.monthlyLimitEur > 0
      ? Number(((monthlyCostEur / budget.monthlyLimitEur) * 100).toFixed(2))
      : null;
  const hardCapExceeded = Boolean(
    budget &&
    budget.hardCap &&
    (monthlyTokens > budget.monthlyLimitTokens || monthlyCostEur > budget.monthlyLimitEur),
  );
  const thresholdBreaches = budget
    ? budget.notifyThresholds
        .filter(
          (threshold) =>
            monthlyTokenUsagePct !== null &&
            monthlyCostUsagePct !== null &&
            (monthlyTokenUsagePct >= threshold || monthlyCostUsagePct >= threshold),
        )
        .sort((a, b) => a - b)
    : [];

  return {
    periodDays,
    totals: {
      totalEvents: events.length,
      totalPromptTokens,
      totalCompletionTokens,
      totalCachedTokens,
      totalTokens: totalPromptTokens + totalCompletionTokens + totalCachedTokens,
      totalCostEur: Number(totalCostEur.toFixed(6)),
    },
    byModel: Array.from(byModelMap.values())
      .map((entry) => ({ ...entry, totalCostEur: Number(entry.totalCostEur.toFixed(6)) }))
      .sort((a, b) => b.totalCostEur - a.totalCostEur),
    budget: {
      configured: !!budget,
      details: budget,
      usage: {
        monthlyTokens,
        monthlyCostEur: Number(monthlyCostEur.toFixed(6)),
        monthlyTokenUsagePct,
        monthlyCostUsagePct,
        thresholdBreaches,
        hardCapExceeded,
      },
    },
  };
}

async function persistAlertsForBreaches(
  userId: string,
  organizationId: string | null,
  breaches: number[],
  hardCapExceeded: boolean,
) {
  const pool = getInternalDbPool();
  if (!pool || (!hardCapExceeded && breaches.length === 0)) {
    return;
  }

  const rows = [
    ...breaches.map((threshold) => ({
      organization_id: organizationId,
      user_id: userId,
      alert_type: 'threshold_breach',
      threshold_value: threshold,
      status: 'open',
    })),
    ...(hardCapExceeded
      ? [
          {
            organization_id: organizationId,
            user_id: userId,
            alert_type: 'hard_cap_exceeded',
            threshold_value: 100,
            status: 'open',
          },
        ]
      : []),
  ];

  const alertTypes = Array.from(
    new Set(rows.map((row) => row.alert_type).filter((value): value is string => Boolean(value))),
  );
  const thresholdValues = Array.from(
    new Set(
      rows
        .map((row) => row.threshold_value)
        .filter((value): value is number => typeof value === 'number'),
    ),
  );

  let existingAlerts: Array<{ alert_type: string; threshold_value: number }>;
  try {
    const { rows: existingRows } = await pool.query(
      `SELECT alert_type, threshold_value FROM token_alerts
       WHERE user_id = $1 AND status = 'open' AND alert_type = ANY($2) AND threshold_value = ANY($3)`,
      [userId, alertTypes, thresholdValues],
    );
    existingAlerts = existingRows;
  } catch (error) {
    logger.warn('Failed reading existing token usage alerts', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }

  const existingSet = new Set(
    existingAlerts.map((row) => `${row.alert_type}:${row.threshold_value}`),
  );
  const rowsToInsert = rows.filter(
    (row) => !existingSet.has(`${row.alert_type}:${row.threshold_value}`),
  );
  if (rowsToInsert.length === 0) {
    return;
  }

  const columns = ['organization_id', 'user_id', 'alert_type', 'threshold_value', 'status'];
  const valuesSql = rowsToInsert
    .map((_, i) => `(${columns.map((_c, j) => `$${i * columns.length + j + 1}`).join(', ')})`)
    .join(', ');
  const params = rowsToInsert.flatMap((row) => [
    row.organization_id,
    row.user_id,
    row.alert_type,
    row.threshold_value,
    row.status,
  ]);

  try {
    await pool.query(
      `INSERT INTO token_alerts (${columns.join(', ')}) VALUES ${valuesSql}`,
      params,
    );
  } catch (error) {
    logger.warn('Failed writing token usage alerts', {
      userId,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export const tokenUsageService = {
  async ingestEvents(
    userId: string,
    events: TokenUsageEventInput[],
  ): Promise<{
    ingested: number;
    duplicate: number;
    totalCostEur: number;
  }> {
    let ingested = 0;
    let duplicate = 0;
    let totalCostEur = 0;

    const prepared: StoredTokenUsageEvent[] = [];
    for (const event of events) {
      toDateOrThrow(event.timestamp);
      const dedupeKey = computeDedupeKey(userId, event);
      prepared.push({
        ...event,
        userId,
        organizationId: null,
        costEur: computeEventCostEur(event),
        dedupeKey,
      });
    }

    const pool = getInternalDbPool();
    if (pool) {
      // organization_members is business/customer data — that lookup stays on
      // Supabase even though token_usage_events itself moves to the internal pool.
      const organizationId = await resolveOrganizationId(userId);
      prepared.forEach((event) => {
        event.organizationId = organizationId;
      });

      let persistedRows: Array<{ dedupe_key: string; cost_eur: string | number }> = [];
      if (prepared.length > 0) {
        const columns = [
          'organization_id',
          'user_id',
          'event_id',
          'dedupe_key',
          'provider',
          'product',
          'model',
          'prompt_tokens',
          'completion_tokens',
          'cached_tokens',
          'cost_eur',
          'session_id',
          'task_id',
          'created_at',
        ];
        const rows = prepared.map((event) => {
          const row = toSnakeCaseRow(event) as Record<string, unknown>;
          return columns.map((col) => row[col]);
        });
        const valuesSql = rows
          .map((row, i) => `(${row.map((_, j) => `$${i * columns.length + j + 1}`).join(', ')})`)
          .join(', ');
        const params = rows.flat();

        try {
          const result = await pool.query(
            `INSERT INTO token_usage_events (${columns.join(', ')}) VALUES ${valuesSql}
             ON CONFLICT (user_id, dedupe_key) DO NOTHING
             RETURNING dedupe_key, cost_eur`,
            params,
          );
          persistedRows = result.rows;
        } catch (error) {
          throw new Error(
            `Failed writing token usage events: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }

      ingested = persistedRows.length;
      duplicate = prepared.length - ingested;
      totalCostEur = Number(
        persistedRows.reduce((sum: number, row) => sum + Number(row.cost_eur || 0), 0).toFixed(6),
      );

      const summary = await this.getSummary(userId, 30);
      await persistAlertsForBreaches(
        userId,
        organizationId,
        summary.budget.usage.thresholdBreaches,
        summary.budget.usage.hardCapExceeded,
      );

      return { ingested, duplicate, totalCostEur };
    }

    const userEvents = getOrCreateUserEvents(userId);
    const dedupeSet = getOrCreateDedupeSet(userId);

    for (const event of prepared) {
      if (dedupeSet.has(event.dedupeKey)) {
        duplicate++;
        continue;
      }

      userEvents.push(event);
      dedupeSet.add(event.dedupeKey);
      ingested++;
      totalCostEur += event.costEur;
    }

    return {
      ingested,
      duplicate,
      totalCostEur: Number(totalCostEur.toFixed(6)),
    };
  },

  async getSummary(
    userId: string,
    periodDays: number,
  ): Promise<{
    periodDays: number;
    totals: {
      totalEvents: number;
      totalPromptTokens: number;
      totalCompletionTokens: number;
      totalCachedTokens: number;
      totalTokens: number;
      totalCostEur: number;
    };
    byModel: Array<{
      model: string;
      events: number;
      totalTokens: number;
      totalCostEur: number;
    }>;
    budget: {
      configured: boolean;
      details: TokenBudget | null;
      usage: {
        monthlyTokens: number;
        monthlyCostEur: number;
        monthlyTokenUsagePct: number | null;
        monthlyCostUsagePct: number | null;
        thresholdBreaches: number[];
        hardCapExceeded: boolean;
      };
    };
  }> {
    const events = await getEventsForPeriod(userId, periodDays);
    const budget = (await getBudgetFromDb(userId)) || budgetsByUser.get(userId) || null;
    return computeSummaryFromEvents(events, budget, periodDays);
  },

  async getRecommendations(
    userId: string,
    periodDays: number,
    sessionId?: string,
  ): Promise<{
    periodDays: number;
    sessionId: string | null;
    recommendations: TokenRecommendation[];
  }> {
    const scopedEvents = await getEventsForPeriod(userId, periodDays, sessionId);
    const summary = await this.getSummary(userId, periodDays);
    const scopedCostEur = Number(
      scopedEvents.reduce((sum, event) => sum + event.costEur, 0).toFixed(6),
    );
    const recommendationCostBasisEur =
      scopedCostEur > 0 ? scopedCostEur : summary.totals.totalCostEur;
    const recommendations: TokenRecommendation[] = [];
    const totalEvents = scopedEvents.length;
    const totalTokens = scopedEvents.reduce(
      (sum, event) => sum + event.promptTokens + event.completionTokens + event.cachedTokens,
      0,
    );
    const totalPromptTokens = scopedEvents.reduce((sum, event) => sum + event.promptTokens, 0);
    const totalCachedTokens = scopedEvents.reduce((sum, event) => sum + event.cachedTokens, 0);
    const avgTokensPerEvent = totalEvents > 0 ? totalTokens / totalEvents : 0;
    const promptRatio = totalTokens > 0 ? totalPromptTokens / totalTokens : 0;
    const cacheRatio = totalTokens > 0 ? totalCachedTokens / totalTokens : 0;

    if (avgTokensPerEvent >= 2500 || promptRatio >= 0.6) {
      const savings = Math.max(recommendationCostBasisEur * 0.15, 0.01);
      recommendations.push({
        ruleId: 'compact-context',
        severity: avgTokensPerEvent >= 3500 ? 'high' : 'medium',
        recommendation:
          'Use tighter prompts and periodic context compaction to reduce repeated prompt tokens.',
        estimatedSavingsEur: Number(savings.toFixed(6)),
      });
    }

    if (cacheRatio < 0.1 && totalEvents >= 2) {
      const savings = Math.max(recommendationCostBasisEur * 0.1, 0.01);
      recommendations.push({
        ruleId: 'increase-cache-reuse',
        severity: 'medium',
        recommendation:
          'Increase reusable context blocks (project brief, conventions) to improve cache hit rate.',
        estimatedSavingsEur: Number(savings.toFixed(6)),
      });
    }

    if (summary.budget.configured && (summary.budget.usage.monthlyTokenUsagePct ?? 0) >= 80) {
      const savings = Math.max(recommendationCostBasisEur * 0.2, 0.01);
      recommendations.push({
        ruleId: 'near-budget-cap',
        severity: 'high',
        recommendation:
          'Route low-risk tasks to cheaper models and split large sessions into smaller task-focused runs.',
        estimatedSavingsEur: Number(savings.toFixed(6)),
      });
    }

    return {
      periodDays,
      sessionId: sessionId || null,
      recommendations,
    };
  },

  async setBudget(userId: string, budgetInput: TokenBudgetInput): Promise<TokenBudget> {
    const budget: TokenBudget = {
      ...budgetInput,
      updatedAt: new Date().toISOString(),
    };
    budgetsByUser.set(userId, budget);

    const pool = getInternalDbPool();
    if (pool) {
      const organizationId = await resolveOrganizationId(userId);
      try {
        await pool.query(
          `INSERT INTO token_budgets (
             organization_id, user_id, daily_limit_tokens, monthly_limit_tokens,
             monthly_limit_eur, hard_cap, notify_thresholds, updated_at
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (user_id) DO UPDATE SET
             organization_id = EXCLUDED.organization_id,
             daily_limit_tokens = EXCLUDED.daily_limit_tokens,
             monthly_limit_tokens = EXCLUDED.monthly_limit_tokens,
             monthly_limit_eur = EXCLUDED.monthly_limit_eur,
             hard_cap = EXCLUDED.hard_cap,
             notify_thresholds = EXCLUDED.notify_thresholds,
             updated_at = EXCLUDED.updated_at`,
          [
            organizationId,
            userId,
            budget.dailyLimitTokens,
            budget.monthlyLimitTokens,
            budget.monthlyLimitEur,
            budget.hardCap,
            budget.notifyThresholds,
            budget.updatedAt,
          ],
        );
      } catch (error) {
        logger.warn('Failed writing token budget to internal DB', {
          userId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return budget;
  },

  async getBudget(userId: string): Promise<TokenBudget | null> {
    const fromDb = await getBudgetFromDb(userId);
    return fromDb || budgetsByUser.get(userId) || null;
  },

  resetForTests(): void {
    eventsByUser.clear();
    budgetsByUser.clear();
    dedupeKeysByUser.clear();
  },
};

export default tokenUsageService;
