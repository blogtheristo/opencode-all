#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- scripts/aegis-pilot.ts
/**
 * aegis-pilot — operator CLI for DWS-AEGIS-PILOT-001 (Store/PRODUCT_AEGIS_PILOT.md).
 * Every command prints one JSON document to stdout. Runbook:
 * docs/runbooks/AEGIS_PILOT_RUNBOOK.md.
 *
 *   init            --state-dir D --site-id S [--org-id O]
 *   issue-operator  --state-dir D --name N --key-out K [--ttl-hours 72]
 *   revoke          --state-dir D --credential ID
 *   validate-scope  --scope F
 *   probe           --scope F
 *   run             --state-dir D --scope F --kind rehearsal|acceptance
 *                   (--operator-credential C --operator-key K | --await-operator [--timeout-s 600])
 *                   [--witness W] [--hold] [--stop-mode hard|cooperative] [--containment worker|openshell [--image I] [--openshell-prover P --expect-prover-sha256 H]] [--handlers M] [--readings R] [--report-dir P] [--sync-url U|none]
 *   stop            --state-dir D --agent ID|'*' --operator-credential C --operator-key K --reason R
 *   verify          --state-dir D [--record FILE] [--expect-key-id K]
 *   reconcile       --state-dir D --scope F [--handlers M] [--readings R] [--report-dir P] [--sync-url U|none]
 *   authority       --state-dir D [--scope F] [--agent ID]   who held decision authority, and what followed
 *   status          --state-dir D
 *   prove           --scope F --openshell-prover P [--expect-prover-sha256 H]   (every step's sandbox policy within its boundary)
 *   seal            --state-dir D [--max-bytes N] [--max-age-days N] [--force]
 *   segments        --state-dir D [--expect-seal DIGEST]   (anchor from an earlier 'seal' output)
 *   prune           --state-dir D [--confirm TOKEN]   (without it: lists expired segments and the token)
 *   export          --state-dir D --out DIR    copy evidence to DIR, with manifest.json and manifest.sig
 *   verify-bundle   --bundle DIR [--expect-key-id K]   verify evidence bundle
 *
 * Exit codes: 0 ok/PASS · 1 error · 2 NEGATIVE_RESULT · 3 NOT_TAKEN or INVALID · 4 verification failed.
 */

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import {
  CAP_AGENT_STOP,
  EvidenceLedger,
  buildAuthorityRecord,
  recordGrant,
  recordRevoke,
  type HandlerModuleRef,
  createIsolatedRegistry,
  createOpenShellRegistry,
  openShellStopTestAgent,
  type HandlerRegistry,
  SiteAuthority,
  createStopCommand,
  generateEd25519,
  loadCredential,
  type PolicyOptions,
  proveStepPolicies,
  pruneExpiredSegments,
  sealActiveSegment,
  verifySegments,
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
import { canonicalJSON, sha256 } from '../src/aegis/pilot/crypto.js';
import { exportBundle, verifyBundle } from '../src/aegis/pilot/bundle.js';

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
    'max-bytes': { type: 'string' },
    'max-age-days': { type: 'string' },
    force: { type: 'boolean' },
    confirm: { type: 'string' },
    'expect-seal': { type: 'string' },
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
    containment: { type: 'string' },
    image: { type: 'string' },
    'openshell-cli': { type: 'string' },
    'openshell-prover': { type: 'string' },
    'expect-prover-sha256': { type: 'string' },
    agent: { type: 'string' },
    reason: { type: 'string' },
    record: { type: 'string' },
    'expect-key-id': { type: 'string' },
    out: { type: 'string' },
    bundle: { type: 'string' },
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

/**
 * What decides each sandbox policy. The SAME object goes to the prover and to the
 * sandboxes, so the proven policy is the enforced one (the run also compares
 * digests). Non-core endpoints are not configurable from the CLI yet.
 */
const POLICY_OPTIONS: PolicyOptions = { nodeBinary: '/usr/local/bin/node' };

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
  if (containmentMode() === 'openshell' && mode === 'hard') {
    // C4: each step in its own OpenShell sandbox. The reference workflow's paths
    // are remapped into the sandbox; its report directory round-trips per step.
    const reference = !a.handlers;
    const reportDir = resolve(a['report-dir'] ?? `${stateDir}/reports`);
    return createOpenShellRegistry(
      {
        modulePath: ref.modulePath,
        options: reference
          ? {
              readingsPath: '/sandbox/in/readings.json',
              reportDir: '/sandbox/out',
              syncUrl: a['sync-url'] ?? 'none',
            }
          : {},
        inputs: reference ? { 'in/readings.json': String(ref.options?.readingsPath) } : {},
        outputDir: reference ? reportDir : undefined,
        image: a.image ?? 'aegis-pilot-node:22',
        workRoot: resolve(stateDir, 'sandbox-work'),
        cli: a['openshell-cli'] ?? 'openshell',
        ...POLICY_OPTIONS,
      },
      scope.workflow.steps,
    );
  }
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

function containmentMode(): 'worker' | 'openshell' {
  const m = a.containment ?? 'worker';
  if (m !== 'worker' && m !== 'openshell')
    throw new Error('--containment must be worker or openshell');
  return m;
}

function stopMode(): 'hard' | 'cooperative' {
  const m = a['stop-mode'] ?? 'hard';
  if (m !== 'hard' && m !== 'cooperative')
    throw new Error('--stop-mode must be hard or cooperative');
  return m;
}

/** Append to the site ledger (grants, revocations). Fails loud if a run holds the ledger. */
function withLedger(site: SiteAuthority, fn: (ledger: EvidenceLedger) => void): void {
  const ledger = EvidenceLedger.open(statePaths(site.stateDir).ledger, {
    siteId: site.manifest.siteId,
    orgId: site.manifest.siteId,
    signer: (h) => site.sign(h),
    publicKey: site.publicKey,
  });
  try {
    fn(ledger);
  } finally {
    ledger.close();
  }
}

function scopeDigestOf(scope: PilotScope): string {
  return sha256(canonicalJSON(scope));
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
        capabilities: [CAP_AGENT_STOP],
        subjectPublicKeyPem: kp.publicKeyPem,
        ttlHours: Number(a['ttl-hours'] ?? 72),
      });
      withLedger(site, (ledger) =>
        recordGrant(
          ledger,
          cred,
          {
            scopeDigest: a.scope ? scopeDigestOf(loadScope()) : null,
            basis: 'operator stop authority issued',
          },
          crypto.randomUUID(),
        ),
      );
      out({
        ok: true,
        command: cmd,
        credentialId: cred.credentialId,
        operatorId: cred.subjectId,
        credentialPath: `${statePaths(site.stateDir).credentials}/${cred.credentialId}.json`,
        keyPath: keyOut,
        expiresAt: cred.expiresAt,
      });
      break;
    }
    case 'revoke': {
      const site = SiteAuthority.load(need('state-dir'));
      site.revoke(need('credential'));
      withLedger(site, (ledger) => recordRevoke(ledger, need('credential'), crypto.randomUUID()));
      out({ ok: true, command: cmd, revoked: a.credential });
      break;
    }
    case 'authority': {
      // Who held decision authority, and what followed — derived from the signed ledger only.
      const site = SiteAuthority.load(need('state-dir'));
      const record = buildAuthorityRecord(site.stateDir, {
        publicKey: site.publicKey,
        scope: a.scope ? loadScope() : undefined,
        agentIds: a.agent ? [a.agent] : undefined,
      });
      out({ ok: true, command: cmd, ...record });
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
      // C4: prove every generated sandbox policy against its boundary before the run.
      const openshell = stopMode() === 'hard' && containmentMode() === 'openshell';
      if (a['openshell-prover'] && !openshell) {
        throw new Error('--openshell-prover needs --containment openshell with the hard stop');
      }
      const proof =
        openshell && a['openshell-prover']
          ? await proveStepPolicies({
              steps: scope.workflow.steps,
              proverPath: resolve(a['openshell-prover']),
              expectSha256: a['expect-prover-sha256'],
              policy: POLICY_OPTIONS,
            })
          : undefined;
      const signed = await runAcceptance({
        stateDir,
        scope,
        registry: await loadRegistry(stateDir, scope, stopMode()),
        stopMode: stopMode(),
        containment:
          stopMode() === 'cooperative'
            ? { mode: 'in-process' }
            : containmentMode() === 'openshell'
              ? { mode: 'openshell', image: a.image ?? 'aegis-pilot-node:22', proof }
              : { mode: 'worker' },
        stopTestAgent:
          stopMode() === 'hard' && containmentMode() === 'openshell'
            ? (tickMs: number) =>
                openShellStopTestAgent(
                  {
                    image: a.image ?? 'aegis-pilot-node:22',
                    workRoot: resolve(stateDir, 'sandbox-work'),
                    cli: a['openshell-cli'] ?? 'openshell',
                    nodeBinary: POLICY_OPTIONS.nodeBinary,
                  },
                  tickMs,
                )
            : undefined,
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
    case 'prove': {
      const scope = loadScope();
      const proof = await proveStepPolicies({
        steps: scope.workflow.steps,
        proverPath: resolve(need('openshell-prover')),
        expectSha256: a['expect-prover-sha256'],
        policy: POLICY_OPTIONS,
      });
      out({ ok: proof.ok, command: cmd, ...proof }, proof.ok ? 0 : 4);
      break;
    }
    case 'seal': {
      const stateDir = need('state-dir');
      const result = sealActiveSegment({
        stateDir,
        site: SiteAuthority.load(stateDir),
        maxBytes: a['max-bytes'] ? Number(a['max-bytes']) : undefined,
        maxAgeDays: a['max-age-days'] ? Number(a['max-age-days']) : undefined,
        force: a.force,
      });
      out({ ok: true, command: cmd, ...result });
      break;
    }
    case 'segments': {
      const stateDir = need('state-dir');
      const v = verifySegments(stateDir, SiteAuthority.load(stateDir), new Date(), {
        expectSealDigest: a['expect-seal'],
      });
      out({ ok: v.valid, command: cmd, ...v }, v.valid ? 0 : 4);
      break;
    }
    case 'prune': {
      const stateDir = need('state-dir');
      const result = pruneExpiredSegments({
        stateDir,
        site: SiteAuthority.load(stateDir),
        confirm: a.confirm,
      });
      out({ ok: true, command: cmd, ...result });
      break;
    }
    case 'export': {
      const stateDir = need('state-dir');
      const outDir = need('out');
      exportBundle(stateDir, outDir);
      out({ ok: true, command: cmd, stateDir, outDir });
      break;
    }
    case 'verify-bundle': {
      const bundleDir = need('bundle');
      const result = verifyBundle(bundleDir, a['expect-key-id']);
      out({ ok: result.ok, command: cmd, ...result }, result.ok ? 0 : 4);
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
            'prove',
            'seal',
            'segments',
            'prune',
            'run',
            'stop',
            'verify',
            'reconcile',
            'status',
            'authority',
            'export',
            'verify-bundle',
          ],
        },
        1,
      );
  }
}

main().catch((err: unknown) =>
  out({ ok: false, error: err instanceof Error ? err.message : String(err) }, 1),
);
