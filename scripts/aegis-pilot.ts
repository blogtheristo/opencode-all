#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- scripts/aegis-pilot.ts
/**
 * aegis-pilot — operator CLI for DWS-AEGIS-PILOT-001 (Store/PRODUCT_AEGIS_PILOT.md).
 * Every command prints one JSON document to stdout. Runbook:
 * docs/runbooks/AEGIS_PILOT_RUNBOOK.md.
 *
 *   init            --state-dir D --site-id S [--org-id O]
 *   issue-operator  --state-dir D --name N --key-out K [--ttl-hours 72] [--role R]
 *                   (--role grants decision.record; R is a role such as shift-supervisor, never a name)
 *   revoke          --state-dir D --credential ID
 *   validate-scope  --scope F
 *   probe           --scope F
 *   run             --state-dir D --scope F --kind rehearsal|acceptance
 *                   (--operator-credential C --operator-key K | --await-operator [--timeout-s 600])
 *                   [--witness W] [--hold] [--stop-mode hard|cooperative] [--handlers M] [--readings R] [--report-dir P] [--sync-url U|none]
 *   stop            --state-dir D --agent ID|'*' --operator-credential C --operator-key K --reason R
 *   decide          --state-dir D --seq N --hash H --verdict accept|reject|defer --reason R
 *                   --operator-credential C --operator-key K
 *   drain-decisions --state-dir D            (site side: record queued decisions; a running `run` does this itself)
 *   outcome         --state-dir D --decision-seq N --decision-hash H --result positive|negative|neutral|unknown
 *                   [--metrics '{"eur_estimated":142.5}'] [--evidence-ref REF]
 *   journey         --state-dir D
 *   verify          --state-dir D [--record FILE] [--expect-key-id K]
 *   reconcile       --state-dir D --scope F [--handlers M] [--readings R] [--report-dir P] [--sync-url U|none]
 *   status          --state-dir D
 *
 * Exit codes: 0 ok/PASS · 1 error · 2 NEGATIVE_RESULT · 3 NOT_TAKEN or INVALID · 4 verification failed.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import {
  CAP_AGENT_STOP,
  CAP_DECISION,
  DECISION_COMMAND_MAX_AGE_MS,
  createDecisionCommand,
  DecisionAuthority,
  type DecisionVerdict,
  decisionJourneys,
  EvidenceLedger,
  type OutcomeResult,
  readLedgerEvents,
  recordOutcome,
  submitDecisionCommand,
  type HandlerModuleRef,
  createIsolatedRegistry,
  type HandlerRegistry,
  SiteAuthority,
  createStopCommand,
  generateEd25519,
  loadCredential,
  privateKeyFromPem,
  probeUplink,
  readOutbox,
  reconcileOutbox,
  runAcceptance,
  statePaths,
  submitStopCommand,
  validateScope,
  verifyAcceptanceRecord,
  verifyLedger,
  type PilotScope,
} from '../src/aegis/pilot/index.js';

const { values: a, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    'state-dir': { type: 'string' },
    'site-id': { type: 'string' },
    'org-id': { type: 'string' },
    name: { type: 'string' },
    'key-out': { type: 'string' },
    'ttl-hours': { type: 'string' },
    credential: { type: 'string' },
    scope: { type: 'string' },
    kind: { type: 'string' },
    'operator-credential': { type: 'string' },
    'operator-key': { type: 'string' },
    'await-operator': { type: 'boolean' },
    'timeout-s': { type: 'string' },
    witness: { type: 'string' },
    hold: { type: 'boolean' },
    handlers: { type: 'string' },
    readings: { type: 'string' },
    'report-dir': { type: 'string' },
    'sync-url': { type: 'string' },
    'stop-mode': { type: 'string' },
    agent: { type: 'string' },
    reason: { type: 'string' },
    record: { type: 'string' },
    'expect-key-id': { type: 'string' },
    role: { type: 'string' },
    seq: { type: 'string' },
    hash: { type: 'string' },
    verdict: { type: 'string' },
    'decision-seq': { type: 'string' },
    'decision-hash': { type: 'string' },
    result: { type: 'string' },
    metrics: { type: 'string' },
    'evidence-ref': { type: 'string' },
  },
});

function out(doc: unknown, code = 0): never {
  process.stdout.write(`${JSON.stringify(doc, null, 2)}\n`);
  process.exit(code);
}

function need(name: keyof typeof a): string {
  const v = a[name];
  if (typeof v !== 'string' || !v) throw new Error(`--${String(name)} is required`);
  return v;
}

function loadScope(): PilotScope {
  const v = validateScope(JSON.parse(readFileSync(need('scope'), 'utf8')));
  if (!v.ok) out({ ok: false, command: 'scope', errors: v.errors }, 1);
  for (const w of v.warnings) process.stderr.write(`warning: ${w}\n`);
  return v.scope;
}

function handlerModule(stateDir: string): HandlerModuleRef {
  if (a.handlers) return { modulePath: resolve(a.handlers), options: {} };
  return {
    modulePath: fileURLToPath(new URL('../src/aegis/pilot/reference-workflow.ts', import.meta.url)),
    options: {
      readingsPath: resolve(a.readings ?? 'config/aegis-pilot/sample-readings.json'),
      reportDir: resolve(a['report-dir'] ?? `${stateDir}/reports`),
      syncUrl: a['sync-url'] ?? 'none',
    },
  };
}

/**
 * 'hard' (default for run): each step runs in a terminable worker thread and the
 * handler module is never loaded into this process. 'cooperative': in-process.
 */
async function loadRegistry(
  stateDir: string,
  scope: PilotScope,
  mode: 'hard' | 'cooperative',
): Promise<HandlerRegistry> {
  const ref = handlerModule(stateDir);
  if (mode === 'hard') {
    return createIsolatedRegistry(
      ref,
      scope.workflow.steps.map((s) => s.handler),
    );
  }
  const mod = (await import(pathToFileURL(ref.modulePath).href)) as {
    createRegistry?: (options: Record<string, unknown>) => HandlerRegistry;
    default?: HandlerRegistry;
    registry?: HandlerRegistry;
  };
  const reg =
    typeof mod.createRegistry === 'function'
      ? mod.createRegistry(ref.options ?? {})
      : (mod.registry ?? mod.default);
  if (!reg) {
    throw new Error(
      `${ref.modulePath} must export createRegistry(options), "registry" or a default HandlerRegistry`,
    );
  }
  return reg;
}

function stopMode(): 'hard' | 'cooperative' {
  const m = a['stop-mode'] ?? 'hard';
  if (m !== 'hard' && m !== 'cooperative')
    throw new Error('--stop-mode must be hard or cooperative');
  return m;
}

function intArg(name: keyof typeof a): number {
  const raw = need(name);
  if (!/^(0|[1-9][0-9]*)$/.test(raw))
    throw new Error(`--${String(name)} must be a non-negative integer`);
  return Number(raw);
}

/** Open the site ledger outside a run, keeping the org id its genesis event recorded. */
function openSiteLedger(site: SiteAuthority): EvidenceLedger {
  const path = statePaths(site.stateDir).ledger;
  const genesis = readLedgerEvents(path)[0];
  if (genesis?.event_type !== 'system.genesis') {
    throw new Error('no ledger yet — run "aegis-pilot init" first');
  }
  return EvidenceLedger.open(path, {
    siteId: site.manifest.siteId,
    orgId: String(genesis.detail.org_id ?? genesis.org_id),
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
  });
}

async function main(): Promise<void> {
  const cmd = positionals[0];
  switch (cmd) {
    case 'init': {
      const site = SiteAuthority.init(need('state-dir'), need('site-id'));
      const ledger = EvidenceLedger.open(statePaths(site.stateDir).ledger, {
        siteId: site.manifest.siteId,
        orgId: a['org-id'] ?? site.manifest.siteId,
        signer: (h) => site.sign(h),
        publicKey: site.publicKey,
      });
      const head = ledger.head;
      ledger.close();
      out({
        ok: true,
        command: cmd,
        siteId: site.manifest.siteId,
        keyId: site.manifest.keyId,
        ledgerHead: head,
      });
      break;
    }
    case 'issue-operator': {
      const site = SiteAuthority.load(need('state-dir'));
      const keyOut = resolve(need('key-out'));
      if (existsSync(keyOut))
        throw new Error(`${keyOut} exists; refusing to overwrite an operator key`);
      if (keyOut.startsWith(resolve(site.stateDir))) {
        throw new Error(
          'the operator key must live outside the site state directory (it is the operator’s, not the site’s)',
        );
      }
      const kp = generateEd25519();
      writeFileSync(keyOut, kp.privateKeyPem, { mode: 0o600, flag: 'wx' });
      const cred = site.issue({
        kind: 'operator',
        subjectName: need('name'),
        capabilities: a.role ? [CAP_AGENT_STOP, CAP_DECISION] : [CAP_AGENT_STOP],
        subjectPublicKeyPem: kp.publicKeyPem,
        role: a.role,
        ttlHours: Number(a['ttl-hours'] ?? 72),
      });
      out({
        ok: true,
        command: cmd,
        credentialId: cred.credentialId,
        operatorId: cred.subjectId,
        credentialPath: `${statePaths(site.stateDir).credentials}/${cred.credentialId}.json`,
        keyPath: keyOut,
        role: cred.role ?? null,
        expiresAt: cred.expiresAt,
      });
      break;
    }
    case 'revoke': {
      const site = SiteAuthority.load(need('state-dir'));
      site.revoke(need('credential'));
      out({ ok: true, command: cmd, revoked: a.credential });
      break;
    }
    case 'validate-scope': {
      const v = validateScope(JSON.parse(readFileSync(need('scope'), 'utf8')));
      out({ command: cmd, ...v }, v.ok ? 0 : 1);
      break;
    }
    case 'probe': {
      const scope = loadScope();
      const report = await probeUplink(scope.isolation.egressProbes);
      out({ ok: true, command: cmd, ...report }, report.isolated ? 0 : 3);
      break;
    }
    case 'run': {
      const stateDir = need('state-dir');
      const scope = loadScope();
      const kind = need('kind');
      if (kind !== 'rehearsal' && kind !== 'acceptance')
        throw new Error('--kind must be rehearsal or acceptance');
      const operator = a['await-operator']
        ? {
            mode: 'await-operator' as const,
            timeoutMs: Number(a['timeout-s'] ?? 600) * 1000,
            onAwait: (agentId: string, agentName: string) =>
              process.stderr.write(
                `\nAGENT RUNNING: ${agentName} (${agentId})\nOperator: stop it now with\n  npm run aegis:pilot -- stop --state-dir ${stateDir} --agent ${agentId} --operator-credential <your credential> --operator-key <your key> --reason "acceptance stop"\n\n`,
              ),
          }
        : {
            mode: 'automated' as const,
            credential: loadCredential(need('operator-credential')),
            key: privateKeyFromPem(readFileSync(need('operator-key'), 'utf8')),
          };
      const signed = await runAcceptance({
        stateDir,
        scope,
        registry: await loadRegistry(stateDir, scope, stopMode()),
        stopMode: stopMode(),
        kind,
        operator,
        witness: a.witness,
        holdUntilWindowEnd: a.hold,
      });
      const code = { PASS: 0, NEGATIVE_RESULT: 2, NOT_TAKEN: 3, INVALID: 3 }[signed.record.outcome];
      out(
        {
          ok: true,
          command: cmd,
          outcome: signed.record.outcome,
          recordPath: signed.path,
          conditions: {
            workflowCompletes: signed.record.conditions.workflowCompletes.pass,
            evidenceLocal: signed.record.conditions.evidenceLocal.pass,
            operatorStop: signed.record.conditions.operatorStop.pass,
          },
          isolation: signed.record.isolation.method,
          findings: signed.record.findings,
        },
        code,
      );
      break;
    }
    case 'stop': {
      const stateDir = need('state-dir');
      const command = createStopCommand({
        target: need('agent'),
        reason: need('reason'),
        operatorCredential: loadCredential(need('operator-credential')),
        operatorKey: privateKeyFromPem(readFileSync(need('operator-key'), 'utf8')),
      });
      const path = submitStopCommand(stateDir, command);
      out({
        ok: true,
        command: cmd,
        commandId: command.commandId,
        target: command.target,
        inboxPath: path,
      });
      break;
    }
    case 'decide': {
      // Operator side, like `stop`: sign and drop the command. Never loads the site key —
      // the site process that owns the ledger records it (a running `run`, or `drain-decisions`).
      const stateDir = need('state-dir');
      const command = createDecisionCommand({
        recommendationSeq: intArg('seq'),
        recommendationHash: need('hash'),
        verdict: need('verdict') as DecisionVerdict,
        reason: need('reason'),
        operatorCredential: loadCredential(need('operator-credential')),
        operatorKey: privateKeyFromPem(readFileSync(need('operator-key'), 'utf8')),
      });
      const path = submitDecisionCommand(stateDir, command);
      out({
        ok: true,
        command: cmd,
        commandId: command.commandId,
        verdict: command.verdict,
        queued: true,
        recorded: false,
        inboxPath: path,
        recordBy: new Date(
          Date.parse(command.issuedAt) + DECISION_COMMAND_MAX_AGE_MS,
        ).toISOString(),
        next: 'a running `run` records it within 200 ms; otherwise the site runs `drain-decisions` before recordBy',
      });
      break;
    }
    case 'drain-decisions': {
      // Site side: record every queued decision. Holds the site key, like `run`.
      const stateDir = need('state-dir');
      const site = SiteAuthority.load(stateDir);
      let ledger: EvidenceLedger;
      try {
        ledger = openSiteLedger(site);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        // Only a live run holding the lock means "still queued" — that run drains decide/ itself.
        // Any other failure (torn tail, broken chain) is an error, never a silent queue.
        if (/locked by running process/.test(message)) {
          out({ ok: false, command: cmd, queued: true, recorded: false, note: message }, 2);
        }
        throw err;
      }
      try {
        const results = new DecisionAuthority(
          stateDir,
          site.verifier(),
          ledger,
          site.publicKey,
        ).drainInbox(`drain-${Date.now()}`);
        out(
          { ok: results.every((r) => r.accepted), command: cmd, processed: results },
          results.every((r) => r.accepted) ? 0 : 1,
        );
      } finally {
        ledger.close();
      }
      break;
    }
    case 'outcome': {
      const site = SiteAuthority.load(need('state-dir'));
      const metrics = a.metrics ? (JSON.parse(a.metrics) as Record<string, number>) : undefined;
      const ledger = openSiteLedger(site);
      try {
        const ev = recordOutcome(
          ledger,
          {
            decisionSeq: intArg('decision-seq'),
            decisionHash: need('decision-hash'),
            result: need('result') as OutcomeResult,
            metrics,
            evidenceRef: a['evidence-ref'],
          },
          site.publicKey,
        );
        out({ ok: true, command: cmd, outcomeSeq: ev.seq, eventHash: ev.event_hash });
      } finally {
        ledger.close();
      }
      break;
    }
    case 'journey': {
      const site = SiteAuthority.load(need('state-dir'));
      const path = statePaths(site.stateDir).ledger;
      const ledger = verifyLedger(path, { publicKey: site.publicKey });
      if (!ledger.valid) out({ ok: false, command: cmd, ledger }, 4);
      out({ ok: true, command: cmd, ...decisionJourneys(path) });
      break;
    }
    case 'verify': {
      const site = SiteAuthority.load(need('state-dir'));
      const ledger = verifyLedger(statePaths(site.stateDir).ledger, { publicKey: site.publicKey });
      let record: { path: string; signatureValid: boolean; outcome: string } | undefined;
      if (a.record) {
        const signed = JSON.parse(readFileSync(a.record, 'utf8'));
        record = {
          path: a.record,
          signatureValid:
            signed.signerKeyId === site.manifest.keyId &&
            verifyAcceptanceRecord(signed, site.publicKey),
          outcome: signed.record?.outcome,
        };
      }
      // --expect-key-id: the key id recorded outside the state directory (signed scope,
      // customer records). Without it, a replaced site authority verifies its own forgeries.
      const pinned = a['expect-key-id'];
      const keyPinned = pinned ? pinned === site.manifest.keyId : null;
      const ok =
        ledger.valid &&
        ledger.unsigned === 0 &&
        (record?.signatureValid ?? true) &&
        keyPinned !== false;
      out(
        { ok, command: cmd, siteKeyId: site.manifest.keyId, keyPinned, ledger, record },
        ok ? 0 : 4,
      );
      break;
    }
    case 'reconcile': {
      const stateDir = need('state-dir');
      const scope = loadScope();
      const site = SiteAuthority.load(stateDir);
      const ledger = EvidenceLedger.open(statePaths(stateDir).ledger, {
        siteId: site.manifest.siteId,
        orgId: scope.site.orgId,
        signer: (h) => site.sign(h),
        publicKey: site.publicKey,
      });
      try {
        const result = await reconcileOutbox({
          scope,
          registry: await loadRegistry(stateDir, scope, 'cooperative'),
          ledger,
          outboxPath: statePaths(stateDir).outbox,
          publicKey: site.publicKey,
          traceId: crypto.randomUUID(),
        });
        out(
          { ok: result.errors.length === 0, command: cmd, ...result },
          result.errors.length ? 1 : 0,
        );
      } finally {
        ledger.close();
      }
      break;
    }
    case 'status': {
      const stateDir = need('state-dir');
      const site = SiteAuthority.load(stateDir);
      const p = statePaths(stateDir);
      const ledger = verifyLedger(p.ledger, { publicKey: site.publicKey });
      const records = existsSync(p.acceptance)
        ? readdirSync(p.acceptance).filter((f) => f.endsWith('.json'))
        : [];
      out({
        ok: true,
        command: cmd,
        site: { siteId: site.manifest.siteId, keyId: site.manifest.keyId },
        ledger: {
          valid: ledger.valid,
          events: ledger.count,
          head: ledger.headHash,
          last: ledger.lastTimestamp,
        },
        outbox: readOutbox(p.outbox).map((e) => e.stepId),
        acceptanceRecords: records.map((f) => {
          const r = JSON.parse(readFileSync(`${p.acceptance}/${f}`, 'utf8')).record;
          return { recordId: r.recordId, kind: r.kind, outcome: r.outcome, createdAt: r.createdAt };
        }),
      });
      break;
    }
    default:
      out(
        {
          ok: false,
          error: `unknown command "${cmd ?? ''}"`,
          commands: [
            'init',
            'issue-operator',
            'revoke',
            'validate-scope',
            'probe',
            'run',
            'stop',
            'decide',
            'drain-decisions',
            'outcome',
            'journey',
            'verify',
            'reconcile',
            'status',
          ],
        },
        1,
      );
  }
}

main().catch((err: unknown) =>
  out({ ok: false, error: err instanceof Error ? err.message : String(err) }, 1),
);
