// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/aegis/pilot/authority.ts
/**
 * Aegis Pilot — the decision-authority record: who held authority, and what
 * followed from it (HIC 28.09.2026: "the rare part").
 *
 * A secure runtime plus a log shows what an agent did. This record answers the
 * question the decision owner is asked afterwards:
 *
 *   granted  — which credential the agent acted under, what it allowed, and
 *              under which signed scope (and, if the scope is supplied, who
 *              signed it on each side)
 *   decided  — the decisions it made under that grant
 *   followed — the outcome: completed, failed, deferred and later reconciled,
 *              or stopped
 *   stopped  — which operator stopped it, when, why, how fast, and proof from
 *              the ledger that the agent did no further work afterwards
 *
 * The ledger stays pseudonymous (ids and digests only). Names are resolved
 * here, at read time, from credentials and the scope held on the customer's
 * own host — they are never written to the Article 12 record.
 *
 * Everything is derived from the signed ledger, never from an agent's own
 * report: build() refuses a ledger whose chain or signatures do not verify.
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { KeyObject } from 'node:crypto';
import { canonicalJSON, sha256 } from './crypto.js';
import { type EvidenceLedger, type LedgerEvent, verifyLedger } from './evidence-ledger.js';
import {
  capabilityManifestHash,
  type Credential,
  credentialDigest,
  statePaths,
} from './identity.js';
import type { PilotScope } from './scope.js';
import { readCommandBody } from './operator-evidence.js';

/** Record that authority was granted. Written when a credential is issued for use on this site. */
export function recordGrant(
  ledger: EvidenceLedger,
  cred: Credential,
  grantedUnder: { scopeDigest: string | null; basis: string },
  traceId: string,
): LedgerEvent {
  return ledger.append({
    event_type: 'authority.grant',
    trace_id: traceId,
    agent_id: cred.kind === 'agent' ? cred.subjectId : null,
    operator_id: cred.kind === 'operator' ? cred.subjectId : null,
    capability_manifest_hash: capabilityManifestHash(cred.capabilities),
    detail: {
      credential_id: cred.credentialId,
      credential_digest: credentialDigest(cred),
      kind: cred.kind,
      capabilities: cred.capabilities,
      issuer_key_id: cred.issuerKeyId,
      expires_at: cred.expiresAt,
      scope_digest: grantedUnder.scopeDigest,
      basis: grantedUnder.basis.slice(0, 120),
    },
  });
}

export function recordRevoke(
  ledger: EvidenceLedger,
  credentialId: string,
  traceId: string,
): LedgerEvent {
  return ledger.append({
    event_type: 'authority.revoke',
    trace_id: traceId,
    detail: { credential_id: credentialId },
  });
}

export interface AgentAuthority {
  agentId: string;
  name: string | null;
  granted: {
    credentialId: string;
    seq: number;
    at: string;
    capabilities: string[];
    basis: string;
    scopeDigest: string | null;
    credentialDigest: string | null;
    expiresAt: string | null;
    /**
     * true when a credential file held on this host hashes to the digest
     * written at grant time — the binding between the pseudonymous id and the
     * credential (and so the role) it was granted. null: no file to check.
     */
    credentialOnFileMatches: boolean | null;
    /** From the supplied scope, only when its digest matches the grant. */
    signatories: { customer: string; lifetime: string; signedAt: string } | null;
    revoked: boolean;
  } | null;
  decisions: { count: number; steps: string[]; firstAt: string | null; lastAt: string | null };
  outcome: 'completed' | 'failed' | 'stopped' | 'no-outcome-recorded';
  failure: string | null;
  deferred: string[];
  reconciledLater: string[];
  stop: {
    seq: number;
    at: string;
    operatorId: string;
    operatorName: string | null;
    commandId: string;
    reason: string;
    latencyMs: number | null;
  } | null;
  /** Evidence that the stop took effect. null when the agent was not stopped. */
  afterStop: {
    agentWorkEvents: number;
    /** Attempts refused by the ledger tombstone (evidence the agent tried). */
    refusedAttempts: number;
    terminated: boolean;
    terminationMs: number | null;
  } | null;
  incidents: string[];
}

export interface AuthorityRecord {
  ledgerHead: string;
  events: number;
  agents: AgentAuthority[];
}

function credentialsOnFile(stateDir: string): {
  names: Map<string, string>;
  digests: Map<string, Set<string>>;
} {
  const names = new Map<string, string>();
  const digests = new Map<string, Set<string>>();
  const dir = statePaths(stateDir).credentials;
  if (!existsSync(dir)) return { names, digests };
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.json'))) {
    try {
      const c = JSON.parse(readFileSync(join(dir, f), 'utf8')) as Credential;
      if (!c?.subjectId) continue;
      if (c.subjectName) names.set(c.subjectId, c.subjectName);
      const set = digests.get(c.subjectId) ?? new Set<string>();
      set.add(credentialDigest(c));
      digests.set(c.subjectId, set);
    } catch {
      // not a credential file
    }
  }
  return { names, digests };
}

function onFileMatches(onFile: Set<string> | undefined, granted: unknown): boolean | null {
  if (!onFile || typeof granted !== 'string') return null;
  return onFile.has(granted);
}

const WORK = new Set(['agent.decide', 'tool.invoke']);

/**
 * Build the decision-authority record from the site ledger. Throws if the
 * ledger does not verify against the site key: an authority record is only as
 * good as the evidence it is built from.
 */
export function buildAuthorityRecord(
  stateDir: string,
  opts: { publicKey: KeyObject; scope?: PilotScope; agentIds?: readonly string[] },
): AuthorityRecord {
  const ledgerPath = statePaths(stateDir).ledger;
  const v = verifyLedger(ledgerPath, { publicKey: opts.publicKey });
  if (!v.valid || v.unsigned > 0) {
    throw new Error(
      `ledger does not verify (${v.reason ?? `${v.unsigned} unsigned`}); no authority record can be built from it`,
    );
  }
  const events = readFileSync(ledgerPath, 'utf8')
    .split('\n')
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l) as LedgerEvent);
  const { names, digests } = credentialsOnFile(stateDir);
  const scopeDigest = opts.scope ? sha256(canonicalJSON(opts.scope)) : null;
  const revoked = new Set(
    events
      .filter((e) => e.event_type === 'authority.revoke')
      .map((e) => String(e.detail.credential_id)),
  );

  const agentIds = opts.agentIds
    ? [...opts.agentIds]
    : [
        ...new Set(
          events
            .filter((e) => e.event_type === 'authority.grant')
            .flatMap((e) => (e.agent_id ? [e.agent_id] : [])),
        ),
      ];

  const agents = agentIds.map((agentId): AgentAuthority => {
    const mine = events.filter((e) => e.agent_id === agentId);
    const grantEv = mine.find((e) => e.event_type === 'authority.grant');
    const work = mine.filter((e) => WORK.has(e.event_type));
    const stopEv = events.find(
      (e) =>
        e.event_type === 'human.override' &&
        Array.isArray(e.detail.agents_stopped) &&
        (e.detail.agents_stopped as string[]).includes(agentId),
    );
    const end = [...mine]
      .reverse()
      .find((e) => e.event_type === 'workflow.complete' || e.event_type === 'workflow.failed');
    const deferredEvents = mine.filter((e) => e.event_type === 'system.degraded');
    const deferredEntryIds = new Set(deferredEvents.map((e) => String(e.detail.outbox_entry)));
    const reconciled = events
      .filter(
        (e) =>
          e.event_type === 'system.reconcile' &&
          deferredEntryIds.has(String(e.detail.outbox_entry)),
      )
      .map((e) => String(e.detail.step));
    const terminated = stopEv
      ? mine.find((e) => e.event_type === 'system.agent_terminated' && e.seq > stopEv.seq)
      : undefined;

    let outcome: AgentAuthority['outcome'] = 'no-outcome-recorded';
    if (stopEv) outcome = 'stopped';
    else if (end?.event_type === 'workflow.complete') outcome = 'completed';
    else if (end) outcome = end.detail.status === 'stopped' ? 'stopped' : 'failed';

    const grantScope = grantEv ? ((grantEv.detail.scope_digest as string | null) ?? null) : null;
    return {
      agentId,
      name: names.get(agentId) ?? null,
      granted: grantEv
        ? {
            credentialId: String(grantEv.detail.credential_id),
            seq: grantEv.seq,
            at: grantEv.timestamp,
            capabilities: (grantEv.detail.capabilities as string[]) ?? [],
            basis: String(grantEv.detail.basis ?? ''),
            scopeDigest: grantScope,
            credentialDigest: (grantEv.detail.credential_digest as string | undefined) ?? null,
            expiresAt: (grantEv.detail.expires_at as string | undefined) ?? null,
            credentialOnFileMatches: onFileMatches(
              digests.get(agentId),
              grantEv.detail.credential_digest,
            ),
            signatories:
              opts.scope?.signoff && grantScope && grantScope === scopeDigest
                ? {
                    customer: opts.scope.signoff.customerSignatory,
                    lifetime: opts.scope.signoff.lifetimeSignatory,
                    signedAt: opts.scope.signoff.signedAt,
                  }
                : null,
            revoked: revoked.has(String(grantEv.detail.credential_id)),
          }
        : null,
      decisions: {
        count: work.length,
        steps: [...new Set(work.map((e) => String(e.detail.step ?? '')))].filter(Boolean),
        firstAt: work[0]?.timestamp ?? null,
        lastAt: work.at(-1)?.timestamp ?? null,
      },
      outcome,
      failure:
        end?.event_type === 'workflow.failed' ? String(end.detail.failure ?? '') || null : null,
      deferred: deferredEvents.map((e) => String(e.detail.step)),
      reconciledLater: reconciled,
      stop: stopEv
        ? {
            seq: stopEv.seq,
            at: stopEv.timestamp,
            operatorId: String(stopEv.operator_id),
            operatorName: names.get(String(stopEv.operator_id)) ?? null,
            commandId: String(stopEv.detail.command_id),
            // The free-text reason lives in the erasable command body, not in the chain;
            // empty once erased. (Ledgers before 01.10.2026 kept it in the event.)
            reason: String(
              readCommandBody(stateDir, stopEv.detail.command_digest)?.reason ??
                stopEv.detail.reason ??
                '',
            ),
            latencyMs:
              typeof stopEv.detail.latency_ms === 'number' ? stopEv.detail.latency_ms : null,
          }
        : null,
      afterStop: stopEv
        ? {
            agentWorkEvents: mine.filter((e) => WORK.has(e.event_type) && e.seq > stopEv.seq)
              .length,
            refusedAttempts: mine.filter(
              (e) => e.event_type === 'incident' && e.detail.kind === 'work-after-stop-refused',
            ).length,
            terminated: Boolean(terminated),
            terminationMs:
              terminated && typeof terminated.detail.termination_ms === 'number'
                ? terminated.detail.termination_ms
                : null,
          }
        : null,
      incidents: mine
        .filter((e) => e.event_type === 'incident')
        .map((e) => String(e.detail.kind ?? 'incident')),
    };
  });

  return { ledgerHead: v.headHash, events: v.count, agents };
}
