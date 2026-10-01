#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
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
 *                   [--witness W] [--hold] [--stop-mode hard|cooperative] [--containment worker|openshell [--image I] [--openshell-prover P --expect-prover-sha256 H]] [--handlers M] [--readings R] [--report-dir P] [--sync-url U|none]
 *   stop            --state-dir D --agent ID|'*' --operator-credential C --operator-key K --reason R
 *                   [--operator-copies-dir DIR] [--worm-dir DIR]   (copy + WORM record of the signed command;
 *                   defaults from site/anchoring.json, else ~/.aegis-operator/{commands,worm})
 *   decide          --state-dir D --seq N --hash H --verdict accept|modify|reject|defer --reason R
 *                   [--modified-file F (modify: the recommendation as changed)]
 *                   [--capture manual_entry --occurred-at ISO (a decision entered afterwards)]
 *                   --operator-credential C --operator-key K [--operator-copies-dir DIR] [--worm-dir DIR]
 *   erase-command-body --state-dir D --digest H --reason-code data-subject-request|retention-ended|data-minimisation|legal-order
 *                   [--worm-dir DIR]   (erase a command body; records evidence.redacted + WORM tombstone)
 *   drain-decisions --state-dir D            (site side: record queued decisions; a running `run` does this itself)
 *   outcome         --state-dir D --decision-seq N --decision-hash H --result positive|negative|neutral|unknown
 *                   [--metrics '{"eur_estimated":142.5}'] [--evidence-ref REF]
 *   journey         --state-dir D
 *   verify          --state-dir D [--record FILE] [--expect-key-id K]
 *   reconcile       --state-dir D --scope F [--handlers M] [--readings R] [--report-dir P] [--sync-url U|none]
 *   authority       --state-dir D [--scope F] [--agent ID]   who held decision authority, and what followed
 *   status          --state-dir D
 *   doctor          --state-dir D [--scope F]   (read-only preflight checks)
 *   prove           --scope F --openshell-prover P [--expect-prover-sha256 H]   (every step's sandbox policy within its boundary)
 *   seal            --state-dir D [--max-bytes N] [--max-age-days N] [--force]   (then exports queued anchors)
 *   seal --scheduled --state-dir D   one schedule tick (cron/systemd timer, e.g. every 15 min): seal when
 *                   due (human.override, configuration change, shift change, max age from
 *                   site/anchoring.json), record an overdue seal as an incident, export anchors
 *   seal-status     --state-dir D [--max-age-days N (≤ 1)]   age of the last seal and anchor export status;
 *                   exit 5 (alert) when the seal is overdue or an export sink is failing
 *   anchor-export   --state-dir D   retry/backfill queued seal anchors to the configured sinks
 *   segments        --state-dir D [--expect-seal DIGEST]   (anchor from an earlier 'seal' output)
 *   prune           --state-dir D [--confirm TOKEN]   (without it: lists expired segments and the token)
 *   export          --state-dir D --out DIR    copy evidence to DIR, with manifest.json and manifest.sig
 *   verify-bundle   --bundle DIR (--expect-key-id K | --allow-unpinned) [--operator-copies DIR]   verify evidence bundle
 *
 * Exit codes: 0 ok/PASS · 1 error · 2 NEGATIVE_RESULT · 3 NOT_TAKEN or INVALID · 4 verification failed
 * · 5 alert (seal overdue or anchor export failing).
 */

import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseArgs } from 'node:util';
import {
  CAP_AGENT_STOP,
  CAP_DECISION,
  DECISION_COMMAND_MAX_AGE_MS,
  createDecisionCommand,
  DecisionAuthority,
  type DecisionCapture,
  type DecisionVerdict,
  decisionJourneys,
  EvidenceLedger,
  buildAuthorityRecord,
  recordGrant,
  recordRevoke,
  type OutcomeResult,
  readLedgerEvents,
  recordOutcome,
  submitDecisionCommand,
  type HandlerModuleRef,
  createIsolatedRegistry,
  createOpenShellRegistry,
  createReferenceRegistry,
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
  checkHandlerConformance,
  verifyAcceptanceRecord,
  verifyLedger,
  type PilotScope,
  doctor,
} from '../src/aegis/pilot/index.js';
import { canonicalJSON, sha256 } from '../src/aegis/pilot/crypto.js';
import { exportBundle, verifyBundle } from '../src/aegis/pilot/bundle.js';
import {
  anchorExport,
  anchorStatus,
  recordSealOverdue,
  runScheduledSeal,
  sealDue,
  type CommandKind,
  eraseCommandBody,
  ledgerHeadForOperator,
  loadSiteConfig,
  operatorCopyDirs,
  writeDefaultSiteConfig,
  writeOperatorCopies,
  writeWormTombstone,
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
    'max-bytes': { type: 'string' },
    'max-age-days': { type: 'string' },
    force: { type: 'boolean' },
    scheduled: { type: 'boolean' },
    confirm: { type: 'string' },
    'expect-seal': { type: 'string' },
    'operator-credential': { type: 'string' },
    'operator-key': { type: 'string' },
    'await-operator': { type: 'boolean' },
    'timeout-s': { type: 'string' },
    witness: { type: 'string' },
    hold: { type: 'boolean' },
    'allow-unpinned': { type: 'boolean' },
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
    role: { type: 'string' },
    seq: { type: 'string' },
    hash: { type: 'string' },
    verdict: { type: 'string' },
    'decision-seq': { type: 'string' },
    'decision-hash': { type: 'string' },
    result: { type: 'string' },
    metrics: { type: 'string' },
    'evidence-ref': { type: 'string' },
    capture: { type: 'string' },
    'occurred-at': { type: 'string' },
    'modified-file': { type: 'string' },
    out: { type: 'string' },
    bundle: { type: 'string' },
    'operator-copies': { type: 'string' },
    'operator-copies-dir': { type: 'string' },
    'worm-dir': { type: 'string' },
    digest: { type: 'string' },
    'reason-code': { type: 'string' },
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
        // C4: OCSF events from each sandbox go into the ledger with the step.
        ocsf: true,
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

function captureArg(): DecisionCapture | undefined {
  if (a.capture === undefined || a.capture === 'live') return undefined;
  if (a.capture === 'manual_entry') return 'manual_entry';
  throw new Error('--capture must be live or manual_entry');
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

/**
 * Operator side, after the command is queued: keep a copy of what was signed outside the
 * state directory (EVIDENCE_FORMAT_v1.md §7). Never blocks the command: a failure is
 * reported, the stop or decision stands.
 */
function keepOperatorCopies(
  stateDir: string,
  kind: CommandKind,
  command: Record<string, unknown>,
  credential: ReturnType<typeof loadCredential>,
  issuedAgainst: ReturnType<typeof ledgerHeadForOperator>,
): Record<string, unknown> {
  try {
    const dirs = operatorCopyDirs(loadSiteConfig(stateDir), {
      dir: a['operator-copies-dir'],
      wormDir: a['worm-dir'],
    });
    const w = writeOperatorCopies({ kind, command, credential, issuedAgainst, ...dirs });
    return {
      written: true,
      copyPath: w.copyPath,
      wormPath: w.wormPath,
      commandDigest: w.worm.command_digest,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    process.stderr.write(`warning: operator copy not written: ${error}\n`);
    return { written: false, error };
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
      // The anchoring schedule is active from install (no pilot-mode exception).
      writeDefaultSiteConfig(site.stateDir);
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
        role: cred.role ?? null,
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
    case 'check-handlers': {
      const scope = loadScope();
      // Without --state-dir or --report-dir the check writes into a fresh temp dir; the old
      // default (/tmp/reports) did not exist, so every run failed with ENOENT (30.09.2026).
      const stateDir = a['state-dir'] ?? mkdtempSync(join(tmpdir(), 'aegis-conformance-'));
      // For conformance testing, we need to test network error paths, so we create
      // a registry with a real sync URL (not 'none'). This allows the sync-report
      // handler to actually call fetch and surface NetworkUnavailable.
      const registryOptions = {
        readingsPath: resolve(a.readings ?? 'config/aegis-pilot/sample-readings.json'),
        reportDir: resolve(a['report-dir'] ?? `${stateDir}/reports`),
        // Closed loopback port (discard, 9): fails as unreachable on every host, and the check
        // never calls an outside service. example.com depended on the network and proxies.
        syncUrl: a['sync-url'] ?? 'http://127.0.0.1:9/sync',
      };
      mkdirSync(registryOptions.reportDir, { recursive: true });
      // --handlers: check the customer's module (same loading as 'run', in-process: the
      // conformance check calls handlers directly against a temp dir). Without it, the
      // reference registry.
      const registry = a.handlers
        ? await loadRegistry(stateDir, scope, 'cooperative')
        : createReferenceRegistry(registryOptions);
      const options = {
        reportDir: registryOptions.reportDir,
      };
      const result = await checkHandlerConformance(scope, registry, options);
      out({ ok: result.ok, command: cmd, ...result }, result.ok ? 0 : 1);
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
      const credential = loadCredential(need('operator-credential'));
      const issuedAgainst = ledgerHeadForOperator(stateDir);
      const command = createStopCommand({
        target: need('agent'),
        reason: need('reason'),
        operatorCredential: credential,
        operatorKey: privateKeyFromPem(readFileSync(need('operator-key'), 'utf8')),
      });
      const path = submitStopCommand(stateDir, command);
      out({
        ok: true,
        command: cmd,
        commandId: command.commandId,
        target: command.target,
        inboxPath: path,
        operatorCopy: keepOperatorCopies(
          stateDir,
          'stop',
          command as unknown as Record<string, unknown>,
          credential,
          issuedAgainst,
        ),
      });
      break;
    }
    case 'decide': {
      // Operator side, like `stop`: sign and drop the command. Never loads the site key —
      // the site process that owns the ledger records it (a running `run`, or `drain-decisions`).
      const stateDir = need('state-dir');
      const credential = loadCredential(need('operator-credential'));
      const issuedAgainst = ledgerHeadForOperator(stateDir);
      const command = createDecisionCommand({
        recommendationSeq: intArg('seq'),
        recommendationHash: need('hash'),
        verdict: need('verdict') as DecisionVerdict,
        reason: need('reason'),
        capture: captureArg(),
        occurredAt: a['occurred-at'],
        modifiedRecommendation: a['modified-file']
          ? JSON.parse(readFileSync(resolve(a['modified-file']), 'utf8'))
          : undefined,
        operatorCredential: credential,
        operatorKey: privateKeyFromPem(readFileSync(need('operator-key'), 'utf8')),
      });
      const path = submitDecisionCommand(stateDir, command);
      const operatorCopy = keepOperatorCopies(
        stateDir,
        'decide',
        command as unknown as Record<string, unknown>,
        credential,
        issuedAgainst,
      );
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
        operatorCopy,
      });
      break;
    }
    case 'erase-command-body': {
      // Site side: erase one operator command body (its free-text reason with it). The chain
      // keeps the operator's framed digest signature; evidence.redacted records the erasure.
      const stateDir = need('state-dir');
      const site = SiteAuthority.load(stateDir);
      const ledger = openSiteLedger(site);
      let tombstone;
      try {
        tombstone = eraseCommandBody(stateDir, ledger, need('digest'), need('reason-code'));
      } finally {
        ledger.close();
      }
      let worm: Record<string, unknown>;
      try {
        const { wormDir } = operatorCopyDirs(loadSiteConfig(stateDir), { wormDir: a['worm-dir'] });
        worm = { written: true, path: writeWormTombstone(wormDir, tombstone) };
      } catch (err) {
        worm = { written: false, error: err instanceof Error ? err.message : String(err) };
      }
      // The tombstone is printed either way, so it can be placed in the WORM mirror by hand.
      out(
        { ok: worm.written === true, command: cmd, tombstone, wormRecord: worm },
        worm.written === true ? 0 : 1,
      );
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
        ).drainInbox(`drain-${Date.now()}`, { reconcile: true });
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
    case 'doctor': {
      const stateDir = need('state-dir');
      const scopePath = a.scope;
      // undefined: no scope, pin not checked; null: scope without a pin, which fails.
      const pin: string | null | undefined = scopePath
        ? (JSON.parse(readFileSync(resolve(scopePath), 'utf8'))?.site?.keyId ?? null)
        : undefined;
      const result = doctor(stateDir, pin);
      out({ ok: result.ok, command: cmd, ...result }, result.ok ? 0 : 1);
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
      const site = SiteAuthority.load(stateDir);
      const config = loadSiteConfig(stateDir);
      if (a.scheduled) {
        const tick = await runScheduledSeal({
          stateDir,
          site,
          schedule: config.sealSchedule,
          sinks: config.anchorExport,
        });
        const alert = tick.overdue || tick.anchor.failing.length > 0;
        out({ ok: !alert, command: cmd, scheduled: true, ...tick }, alert ? 5 : 0);
      }
      const result = sealActiveSegment({
        stateDir,
        site,
        maxBytes: a['max-bytes'] ? Number(a['max-bytes']) : undefined,
        maxAgeDays: a['max-age-days'] ? Number(a['max-age-days']) : undefined,
        force: a.force,
      });
      // A failed export never fails the seal: it is queued, recorded and retried.
      const anchor = await anchorExport({ stateDir, site, sinks: config.anchorExport });
      out({ ok: true, command: cmd, ...result, anchorExport: anchor });
      break;
    }
    case 'seal-status': {
      const stateDir = need('state-dir');
      const site = SiteAuthority.load(stateDir);
      const config = loadSiteConfig(stateDir);
      const schedule = {
        ...config.sealSchedule,
        maxAgeDays: a['max-age-days'] ? Number(a['max-age-days']) : config.sealSchedule.maxAgeDays,
      };
      const due = sealDue(stateDir, schedule, new Date());
      // An overdue seal is evidence too: recorded once per overdue period.
      const overdueIncident = due.overdue ? recordSealOverdue(stateDir, site, due) : null;
      const anchor = anchorStatus(stateDir, config.anchorExport);
      const alert = due.overdue || anchor.failing.length > 0;
      if (alert)
        process.stderr.write(
          `ALERT: ${due.overdue ? 'seal overdue' : ''}${due.overdue && anchor.failing.length ? '; ' : ''}${anchor.failing.length ? `anchor export failing (${anchor.failing.join(', ')})` : ''}\n`,
        );
      out(
        {
          ok: !alert,
          command: cmd,
          lastSealAt: due.lastSealAt,
          since: due.since,
          ageHours: Math.round((due.ageMs / 3_600_000) * 10) / 10,
          maxAgeDays: schedule.maxAgeDays,
          overdue: due.overdue,
          due: due.due,
          dueReasons: due.reasons,
          overdueIncident,
          anchor,
        },
        alert ? 5 : 0,
      );
      break;
    }
    case 'anchor-export': {
      const stateDir = need('state-dir');
      const site = SiteAuthority.load(stateDir);
      const result = await anchorExport({
        stateDir,
        site,
        sinks: loadSiteConfig(stateDir).anchorExport,
      });
      out(
        { ok: result.failing.length === 0, command: cmd, ...result },
        result.failing.length ? 5 : 0,
      );
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
      const manifest = exportBundle(stateDir, outDir);
      out({
        ok: true,
        command: cmd,
        stateDir,
        outDir,
        keyId: manifest.keyId,
        files: manifest.files.length,
        ledgerHead: manifest.ledgerHead,
        lastSealDigest: manifest.lastSealDigest,
      });
      break;
    }
    case 'verify-bundle': {
      const bundleDir = need('bundle');
      const result = verifyBundle(bundleDir, a['expect-key-id'], new Date(), {
        operatorCopies: a['operator-copies'],
      });
      // Without a pin the bundle is only checked against the key it carries, so a forged
      // bundle would verify. ok stays integrity-only; authenticity is stated separately.
      const keyPinned = a['expect-key-id'] !== undefined && a['expect-key-id'] === result.keyId;
      const authenticity = keyPinned
        ? 'established — key id matches the pin'
        : a['expect-key-id'] !== undefined
          ? 'NOT established — key id does not match the pin'
          : 'unpinned — authenticity not established (integrity only); pass --expect-key-id from the signed scope';
      if (!keyPinned && a['expect-key-id'] === undefined)
        process.stderr.write(`warning: ${authenticity}\n`);
      // HIC 01.10.2026: an unpinned result is not "verified" — exit 4 unless the caller says
      // integrity is all they want (--allow-unpinned).
      const unpinnedOk = a['allow-unpinned'] === true;
      const unpinned = a['expect-key-id'] === undefined;
      const exit = !result.ok || (unpinned && !unpinnedOk) ? 4 : 0;
      out(
        {
          command: cmd,
          ...result,
          ok: result.ok && (!unpinned || unpinnedOk),
          keyPinned,
          authenticity,
        },
        exit,
      );
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
            'seal-status',
            'anchor-export',
            'segments',
            'prune',
            'run',
            'stop',
            'decide',
            'drain-decisions',
            'erase-command-body',
            'outcome',
            'journey',
            'verify',
            'reconcile',
            'status',
            'doctor',
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
