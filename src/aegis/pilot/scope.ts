// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- src/aegis/pilot/scope.ts
/**
 * Aegis Pilot — Phase 0 signed scope (Store/PRODUCT_AEGIS_PILOT.md, "Phase 0").
 *
 * The scope is the contract the acceptance test runs against: site, workflow,
 * deployment mode, isolation method and the three acceptance conditions in
 * the customer's own words. Validation encodes the pilot's documented fail
 * conditions so they surface at week 2, not at the acceptance run:
 *
 *   - Phase 0 fails if the workflow is not a terminating sequence with a
 *     defined "complete" state.
 *   - Phase 2 fails if a step classified core needs the network. Declared
 *     here, it is caught before any integration work.
 */

import { z } from 'zod';

/**
 * Isolation ladder, strongest first. Chosen in Phase 0 and written into the
 * acceptance record so a reader in three years knows what was demonstrated.
 */
export const ISOLATION_LADDER = {
  'physical-disconnect': {
    rank: 1,
    demonstrates:
      'No network path exists at all; proves both the network boundary and the workload.',
    doesNotDemonstrate: 'Nothing material; strongest available method.',
  },
  'router-deny-all': {
    rank: 2,
    demonstrates:
      'Deny-all egress at the customer edge router: every packet leaving the site is dropped above the stack.',
    doesNotDemonstrate: 'Behaviour when the physical link itself fails (carrier loss, link flap).',
  },
  'vlan-isolation': {
    rank: 3,
    demonstrates: 'The Aegis segment has no route out; enforced at the customer switch.',
    doesNotDemonstrate: 'Isolation of hosts outside the Aegis segment; site-wide outage behaviour.',
  },
  'host-egress-block': {
    rank: 4,
    demonstrates:
      'Egress blocked at the host (firewall or network namespace); proves the workload needs no network.',
    doesNotDemonstrate:
      'The site network boundary; a host-level block is administered closer to the system under test.',
  },
} as const;

export type IsolationMethod = keyof typeof ISOLATION_LADDER;

const id = z
  .string()
  .regex(/^[a-z0-9][a-z0-9-]{0,62}$/, 'lowercase letters, digits and hyphens, max 63 chars');

const StepSchema = z.object({
  id,
  name: z.string().min(1).max(120),
  criticality: z.enum(['core', 'non-core']),
  requiresNetwork: z.boolean(),
  /** Key into the step-handler registry the runtime is started with. */
  handler: z.string().min(1).max(80),
});

export const PilotScopeSchema = z
  .object({
    v: z.literal(1),
    site: z.object({
      siteId: id,
      name: z.string().min(1).max(120),
      orgId: z.string().min(1).max(80),
      /** Site authority key id from `aegis-pilot init`, pinned at Phase 1 exit. */
      keyId: z
        .string()
        .regex(/^[0-9a-f]{16}$/)
        .optional(),
    }),
    workflow: z.object({
      id,
      name: z.string().min(1).max(160),
      /** What "complete" means, in the workflow owner's words. Required: no completion, nothing to test. */
      completionState: z.string().min(10).max(500),
      steps: z.array(StepSchema).min(1).max(50),
    }),
    deploymentMode: z.enum(['local-edge', 'hybrid', 'eu-sovereign-cloud']),
    deploymentModeJustification: z.string().min(10).max(1000),
    isolation: z.object({
      method: z.enum(Object.keys(ISOLATION_LADDER) as [IsolationMethod, ...IsolationMethod[]]),
      /** Who administers the block. Must be the customer: a system asked to disconnect itself has not been tested. */
      enforcedBy: z.string().min(3).max(160),
      /** Targets that must be unreachable before and after the run. Egress is attempted, not assumed. */
      egressProbes: z
        .array(
          z.object({
            host: z.string().min(1).max(253),
            port: z.number().int().min(1).max(65535),
            label: z.string().max(80).optional(),
            /** A firewall REJECT answers with a RST; opt in only when the block is known to reject rather than drop. */
            rejectCountsAsBlocked: z.boolean().optional(),
          }),
        )
        .min(1)
        .max(20),
    }),
    acceptance: z.object({
      windowMinutes: z
        .number()
        .int()
        .min(1)
        .max(24 * 60),
      heartbeatMs: z.number().int().min(100).max(60_000).default(1000),
      maxGapMs: z.number().int().min(200).max(300_000).default(5000),
      conditions: z.object({
        workflowCompletes: z.string().min(10).max(500),
        evidenceLocal: z.string().min(10).max(500),
        operatorStop: z.string().min(10).max(500),
      }),
    }),
    /** Non-core network steps, in the order deferred work is replayed on reconnect. */
    reconciliationOrder: z.array(id).default([]),
    signoff: z
      .object({
        customerSignatory: z.string().min(3).max(120),
        lifetimeSignatory: z.string().min(3).max(120),
        signedAt: z.string().datetime(),
      })
      .optional(),
  })
  .superRefine((scope, ctx) => {
    const steps = scope.workflow.steps;
    const ids = new Set<string>();
    for (const [i, s] of steps.entries()) {
      if (ids.has(s.id)) {
        ctx.addIssue({
          code: 'custom',
          path: ['workflow', 'steps', i, 'id'],
          message: `duplicate step id "${s.id}"`,
        });
      }
      ids.add(s.id);
      if (s.criticality === 'core' && s.requiresNetwork) {
        ctx.addIssue({
          code: 'custom',
          path: ['workflow', 'steps', i],
          message: `core step "${s.id}" requires the network — reclassify it as non-core or redesign it to run locally (Phase 2 fail condition)`,
        });
      }
    }
    if (!steps.some((s) => s.criticality === 'core')) {
      ctx.addIssue({
        code: 'custom',
        path: ['workflow', 'steps'],
        message: 'workflow has no core step — there is no outcome for the acceptance test to prove',
      });
    }
    const deferrable = steps
      .filter((s) => s.criticality === 'non-core' && s.requiresNetwork)
      .map((s) => s.id);
    const order = scope.reconciliationOrder;
    const missing = deferrable.filter((s) => !order.includes(s));
    const extra = order.filter((s) => !deferrable.includes(s));
    if (missing.length || extra.length || new Set(order).size !== order.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['reconciliationOrder'],
        message: `reconciliationOrder must list each non-core network step exactly once (missing: [${missing.join(', ')}], not deferrable: [${extra.join(', ')}])`,
      });
    }
    if (scope.acceptance.maxGapMs < 2 * scope.acceptance.heartbeatMs) {
      ctx.addIssue({
        code: 'custom',
        path: ['acceptance', 'maxGapMs'],
        message:
          'maxGapMs must be at least twice heartbeatMs, or every scheduling jitter reads as an evidence gap',
      });
    }
  });

export type PilotScope = z.infer<typeof PilotScopeSchema>;
export type PilotStep = PilotScope['workflow']['steps'][number];

export type ScopeValidation =
  | { ok: true; scope: PilotScope; warnings: string[] }
  | { ok: false; errors: string[] };

export function validateScope(input: unknown): ScopeValidation {
  const parsed = PilotScopeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
    };
  }
  const scope = parsed.data;
  const warnings: string[] = [];
  if (!scope.signoff) {
    warnings.push(
      'scope is not signed off — Phase 0 exit gate requires a signed scope before Phase 1',
    );
  }
  if (!scope.site.keyId) {
    warnings.push(
      'site.keyId is not pinned — record the key id printed by "aegis-pilot init" in the signed scope before acceptance',
    );
  }
  if (scope.isolation.method === 'host-egress-block') {
    warnings.push(
      'host-egress-block is the weakest isolation method: it proves the workload, not the site network boundary',
    );
  }
  if (scope.deploymentMode === 'eu-sovereign-cloud') {
    warnings.push(
      'eu-sovereign-cloud mode: define which link the acceptance test severs; core steps must still run without it',
    );
  }
  return { ok: true, scope, warnings };
}

/** Capability an agent credential must hold to execute a step. */
export function stepCapability(step: Pick<PilotStep, 'id'>): string {
  return `step:${step.id}`;
}
