// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- src/aegis/pilot/kill-authority.ts
/**
 * Aegis Pilot — local kill authority (PRODUCT_AEGIS_PILOT.md, requirement 2
 * and acceptance condition iii: "can an operator still stop a running agent?").
 *
 * The existing TC-4 path (src/identity/kya-engine.ts terminateChain) marks
 * agents terminated in Supabase — it needs the network the pilot removes.
 * This path has no network hop:
 *
 *   operator ──signs──▶ StopCommand file ──▶ <stateDir>/kill/ inbox
 *                                               │ (local poll)
 *   runtime ◀── AbortSignal ◀── KillAuthority ──┘ verifies against local
 *                                               credentials + site manifest
 *
 * A command is honoured only if: the operator credential is valid for this
 * site and grants `agent.stop`; the command is signed by the key bound in
 * that credential; it is fresh (issuedAt within the replay window); and its
 * commandId has not been seen. Every accepted stop is a `human.override`
 * ledger event carrying the operator id (Art. 14(5)); every rejected one is
 * an `incident`. Processed commands move to kill/processed or kill/rejected
 * so the inbox never replays.
 *
 * Stop is cooperative at the step level (handlers receive the AbortSignal)
 * and immediate at the runner level: the runner stops awaiting the step and
 * schedules nothing further for that agent.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { type KeyObject, randomUUID } from 'node:crypto';
import { publicKeyFromPem, publicPemOf, signPayload, verifyPayload } from './crypto.js';
import {
  CAP_AGENT_STOP,
  CLOCK_SKEW_MS,
  type Credential,
  type CredentialVerifier,
  loadCredential,
  statePaths,
} from './identity.js';
import type { EvidenceLedger } from './evidence-ledger.js';
import {
  commandDigest,
  commandDigestOf,
  commandFrame,
  operatorEventFields,
  signCommandFrame,
  splitCommand,
  storeCommandBody,
} from './operator-evidence.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** A stop command older than this is refused as a possible replay. */
export const STOP_COMMAND_MAX_AGE_MS = 10 * 60 * 1000;

export interface StopCommandBody {
  v: 1;
  commandId: string;
  /** Agent subjectId to stop, or '*' for every running agent on the site. */
  target: string;
  reason: string;
  issuedAt: string;
  operatorCredentialId: string;
}

export interface StopCommand extends StopCommandBody {
  signature: string;
  /**
   * Operator's Ed25519 signature over the framed digest message (operator-evidence.ts,
   * EVIDENCE_FORMAT_v1.md §5.1). Made at issue time beside `signature`; it is what the
   * ledger keeps after the body is erased.
   */
  digestSignature: string;
}

export interface StopOutcome {
  accepted: boolean;
  commandId: string;
  reason?: string;
  stoppedAgents: string[];
  /** ms from command issuedAt to abort signalled (same-host clock). */
  latencyMs?: number;
  /** Ledger seq of the human.override (accepted) or incident (rejected) event. */
  ledgerSeq?: number;
  /**
   * Credential ids revoked because of this stop (safe halt, Art. 14(4)(e)): the
   * stopped agent cannot act again under the same grant. Empty without `revoke`.
   */
  disarmed?: string[];
}

/** Operator side: build and sign a stop command. Pure — no I/O. */
export function createStopCommand(
  params: {
    target: string;
    reason: string;
    operatorCredential: Credential;
    operatorKey: KeyObject;
  },
  now = new Date(),
): StopCommand {
  if (
    params.operatorCredential.subjectPublicKeyPem?.trim() !== publicPemOf(params.operatorKey).trim()
  ) {
    throw new Error('operator private key does not match the key bound in the operator credential');
  }
  const body: StopCommandBody = {
    v: 1,
    commandId: randomUUID(),
    target: params.target,
    reason: params.reason.slice(0, 200),
    issuedAt: now.toISOString(),
    operatorCredentialId: params.operatorCredential.credentialId,
  };
  return {
    ...body,
    signature: signPayload(body, params.operatorKey),
    digestSignature: signCommandFrame(
      'stop',
      body,
      params.operatorCredential.role ?? null,
      params.operatorKey,
    ),
  };
}

/** Operator side: drop a signed command into the site's local kill inbox (atomic rename). */
export function submitStopCommand(stateDir: string, command: StopCommand): string {
  const inbox = statePaths(stateDir).killInbox;
  mkdirSync(inbox, { recursive: true, mode: 0o700 });
  const final = join(inbox, `${command.commandId}.json`);
  const tmp = `${final}.tmp`;
  writeFileSync(tmp, JSON.stringify(command), { mode: 0o600 });
  renameSync(tmp, final);
  return final;
}

interface RunningAgent {
  controller: AbortController;
  credential: Credential;
}

export class KillAuthority {
  private readonly running = new Map<string, RunningAgent>();
  private readonly seen = new Set<string>();
  private readonly outcomes: StopOutcome[] = [];

  constructor(
    private readonly stateDir: string,
    private readonly verifier: CredentialVerifier,
    private readonly ledger: EvidenceLedger,
    private readonly now: () => Date = () => new Date(),
    /**
     * `revoke`: disarms a stopped agent by revoking its credential (the site
     * process holds the site authority). Each revocation is an `authority.revoke`
     * event after the `human.override`, carrying the operator id.
     */
    private readonly opts: { revoke?: (credentialId: string) => void } = {},
  ) {
    const p = statePaths(stateDir);
    for (const sub of ['processed', 'rejected']) {
      mkdirSync(join(p.killInbox, sub), { recursive: true, mode: 0o700 });
    }
    for (const f of readdirSync(join(p.killInbox, 'processed'))) {
      this.seen.add(f.replace(/\.json$/, ''));
    }
  }

  /** Register a running agent; returns the signal its work must honour. */
  register(credential: Credential): { signal: AbortSignal; release: () => void } {
    const controller = new AbortController();
    this.running.set(credential.subjectId, { controller, credential });
    return { signal: controller.signal, release: () => this.running.delete(credential.subjectId) };
  }

  get history(): readonly StopOutcome[] {
    return this.outcomes;
  }

  /** Verify and execute one stop command. Never throws on a bad command — records it. */
  execute(command: StopCommand, traceId: string): StopOutcome {
    const reject = (reason: string, operatorId: string | null = null): StopOutcome => {
      const outcome: StopOutcome = {
        accepted: false,
        commandId: String(command?.commandId ?? 'unknown'),
        reason,
        stoppedAgents: [],
      };
      outcome.ledgerSeq = this.ledger.append({
        event_type: 'incident',
        trace_id: traceId,
        operator_id: operatorId,
        detail: {
          kind: 'stop-command-rejected',
          command_id: outcome.commandId,
          reason,
          // Lets a digest-only operator copy match its rejection (EVIDENCE_FORMAT_v1.md §7).
          command_digest: commandDigestOf(command),
        },
      }).seq;
      this.outcomes.push(outcome);
      return outcome;
    };

    if (
      command?.v !== 1 ||
      typeof command.commandId !== 'string' ||
      !UUID.test(command.commandId)
    ) {
      return reject('malformed command');
    }
    // Marked seen only once accepted: a forged file reusing a genuine commandId
    // must not be able to burn that id before the genuine command arrives.
    if (this.seen.has(command.commandId)) return reject('command already processed (replay)');

    if (!UUID.test(String(command.operatorCredentialId))) {
      return reject('operator credential not issued by this site');
    }
    const credPath = join(
      statePaths(this.stateDir).credentials,
      `${command.operatorCredentialId}.json`,
    );
    if (!existsSync(credPath)) return reject('operator credential not issued by this site');
    const cred = loadCredential(credPath);
    const t = this.now();
    const check = this.verifier.check(cred, t, CAP_AGENT_STOP);
    if (!check.ok) return reject(`operator credential: ${check.reason}`, cred.subjectId);
    if (cred.kind !== 'operator' || !cred.subjectPublicKeyPem) {
      return reject('credential is not an operator credential', cred.subjectId);
    }
    const { body, signature, digestSignature } = splitCommand(
      command as unknown as Record<string, unknown>,
    );
    const operatorKey = publicKeyFromPem(cred.subjectPublicKeyPem);
    if (typeof signature !== 'string' || !verifyPayload(body, signature, operatorKey)) {
      return reject('command signature does not match operator key', cred.subjectId);
    }
    const frame = commandFrame(
      'stop',
      command.commandId,
      String(command.issuedAt),
      cred.role ?? null,
      commandDigest(body),
    );
    if (
      typeof digestSignature !== 'string' ||
      !verifyPayload(frame, digestSignature, operatorKey)
    ) {
      return reject(
        'command digest signature missing or does not match operator key',
        cred.subjectId,
      );
    }
    const issued = Date.parse(command.issuedAt);
    if (Number.isNaN(issued) || issued - CLOCK_SKEW_MS > t.getTime()) {
      return reject('command issuedAt is in the future', cred.subjectId);
    }
    if (t.getTime() - issued > STOP_COMMAND_MAX_AGE_MS) {
      return reject('command expired (older than replay window)', cred.subjectId);
    }

    this.seen.add(command.commandId);
    // The body (with its free-text reason) goes to the erasable sidecar, never into the chain.
    storeCommandBody(this.stateDir, body, signature);
    const targets =
      command.target === '*'
        ? [...this.running.keys()]
        : this.running.has(command.target)
          ? [command.target]
          : [];
    const stoppedCredentials: string[] = [];
    for (const id of targets) {
      const agent = this.running.get(id);
      agent?.controller.abort(new StopRequested(command.commandId, command.reason));
      if (agent) stoppedCredentials.push(agent.credential.credentialId);
    }
    const outcome: StopOutcome = {
      accepted: true,
      commandId: command.commandId,
      stoppedAgents: targets,
      latencyMs: this.now().getTime() - issued,
    };
    outcome.ledgerSeq = this.ledger.append({
      event_type: 'human.override',
      trace_id: traceId,
      operator_id: cred.subjectId,
      detail: {
        action: 'agent.stop',
        command_id: command.commandId,
        target: command.target,
        agents_stopped: targets,
        latency_ms: outcome.latencyMs,
        note: targets.length === 0 ? 'no matching running agent' : undefined,
        // Operator evidence (EVIDENCE_FORMAT_v1.md §5): framed fields, credential id and the
        // operator's signatures, so the stop verifies with the operator's key alone, years
        // later. No body and no free-text reason: those live in the erasable sidecar.
        ...operatorEventFields('stop', body, cred, digestSignature),
        // The operator's Ed25519 signature over the command body (verifiable while it exists).
        operator_signature: signature,
      },
    }).seq;
    // Safe halt: the stop is not complete while the agent could resume under the same grant.
    outcome.disarmed = [];
    if (this.opts.revoke) {
      for (const credentialId of stoppedCredentials) {
        this.opts.revoke(credentialId);
        this.ledger.append({
          event_type: 'authority.revoke',
          trace_id: traceId,
          operator_id: cred.subjectId,
          detail: {
            credential_id: credentialId,
            reason: 'operator stop',
            command_id: command.commandId,
          },
        });
        outcome.disarmed.push(credentialId);
      }
    }
    this.outcomes.push(outcome);
    return outcome;
  }

  /** Process every command currently in the inbox. */
  drainInbox(traceId: string): StopOutcome[] {
    const inbox = statePaths(this.stateDir).killInbox;
    if (!existsSync(inbox)) return [];
    const results: StopOutcome[] = [];
    for (const f of readdirSync(inbox)
      .filter((n) => n.endsWith('.json'))
      .sort()) {
      const path = join(inbox, f);
      let command: StopCommand;
      try {
        command = JSON.parse(readFileSync(path, 'utf8')) as StopCommand;
      } catch {
        command = { commandId: f.replace(/\.json$/, '') } as StopCommand;
      }
      const outcome = this.execute(command, traceId);
      results.push(outcome);
      // Accepted commands are filed under their verified commandId so the replay
      // set rebuilt on restart matches what was actually executed.
      const dest = outcome.accepted
        ? join(inbox, 'processed', `${outcome.commandId}.json`)
        : join(inbox, 'rejected', `${Date.now()}-${f}`);
      renameSync(path, dest);
    }
    return results;
  }

  /** Poll the local inbox. Returns a stop function. */
  watch(traceId: string, pollMs = 100): () => void {
    const timer = setInterval(() => this.drainInbox(traceId), pollMs);
    timer.unref?.();
    return () => clearInterval(timer);
  }
}

export class StopRequested extends Error {
  constructor(
    readonly commandId: string,
    readonly stopReason: string,
  ) {
    super(`agent stopped by operator command ${commandId}: ${stopReason}`);
    this.name = 'StopRequested';
  }
}
