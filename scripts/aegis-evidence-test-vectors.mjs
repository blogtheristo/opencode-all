#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude Agent=aegis-evidence-impl Date=2026-10-01
// Audit trail: git log -- scripts/aegis-evidence-test-vectors.mjs
/**
 * Deterministic test vectors for docs/aegis/EVIDENCE_FORMAT_v1.md.
 *
 *   node scripts/aegis-evidence-test-vectors.mjs [--out DIR]   (default docs/aegis/evidence-test-vectors)
 *
 * Self-contained on purpose: node:crypto only, its own canonical JSON — it does not import
 * the Aegis kit, so the kit's TS verifier and the Python verifier reproduce these files
 * independently (src/__tests__/aegis-evidence-vectors.test.ts, tools/aegis-verify-py).
 *
 * TEST-ONLY keys: every private key is derived from a public label (sha256 of the label is
 * the Ed25519 seed). They protect nothing and must never sign real evidence.
 *
 * Writes:
 *   bundle/                 an export bundle: one sealed 6-event segment (human.decide +
 *                           human.override), its seal, an active segment, site key,
 *                           credentials, command bodies, manifest + manifest.sig
 *   operator-copies/        the operators' full copies and digest-only WORM records
 *   variants/redacted-stop-body.jsonl   the segment with the stop body erased (+ evidence.redacted)
 *   negative/*.jsonl        the segment re-signed with the site key after a forgery
 *   negative/changed-reason.bodies/     the forged body for that case
 *   expected.json           every canonical string, event_hash and signature, and the cases
 */

import { createHash, createPrivateKey, createPublicKey, sign } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({ options: { out: { type: 'string' } } });
const OUT = resolve(values.out ?? 'docs/aegis/evidence-test-vectors');

// --- format primitives (EVIDENCE_FORMAT_v1.md §2–§4) -----------------------------------

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

/** §2: recursively sorted keys (UTF-16 code units), no whitespace, ECMAScript JSON.stringify. */
function canonical(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  return `{${Object.keys(v)
    .filter((k) => v[k] !== undefined)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`)
    .join(',')}}`;
}

const PKCS8_ED25519 = Buffer.from('302e020100300506032b657004220420', 'hex');
const SEED_LABEL = (name) => `aegis-evidence-test-vectors/v1 ${name} TEST-ONLY`;

function testKey(name) {
  const seed = createHash('sha256').update(SEED_LABEL(name)).digest();
  const privateKey = createPrivateKey({
    key: Buffer.concat([PKCS8_ED25519, seed]),
    format: 'der',
    type: 'pkcs8',
  });
  const publicKeyPem = createPublicKey(privateKey)
    .export({ type: 'spki', format: 'pem' })
    .toString();
  return { name, seedHex: seed.toString('hex'), privateKey, publicKeyPem };
}

/** §3: Ed25519 over the UTF-8 canonical JSON of the payload, base64url without padding. */
const signPayload = (payload, key) =>
  sign(null, Buffer.from(canonical(payload), 'utf8'), key.privateKey).toString('base64url');
const keyIdOf = (pem) => sha256(pem.trim()).slice(0, 16);

// --- fixed inputs -------------------------------------------------------------------------

const SITE_ID = 'vector-site';
const ORG_ID = 'vector-org';
const T0 = Date.parse('2026-10-01T06:00:00.000Z');
const at = (s) => new Date(T0 + s * 1000).toISOString();
const uuid = (n) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;
const GENESIS = '0'.repeat(64);
const DOMAIN = 'dws.aegis.operator-command.v1';

const site = testKey('site');
const opA = testKey('operator-a');
const opB = testKey('operator-b');
const siteManifest = {
  siteId: SITE_ID,
  keyId: keyIdOf(site.publicKeyPem),
  publicKeyPem: site.publicKeyPem,
  createdAt: at(-7200),
};

function credential(n, key, subjectName, capabilities, role) {
  const body = {
    v: 1,
    credentialId: uuid(100 + n),
    kind: 'operator',
    subjectId: uuid(200 + n),
    subjectName,
    siteId: SITE_ID,
    issuerKeyId: siteManifest.keyId,
    capabilities: [...capabilities].sort(),
    subjectPublicKeyPem: key.publicKeyPem,
    role,
    issuedAt: at(-3600),
    expiresAt: at(-3600 + 72 * 3600),
  };
  return { ...body, signature: signPayload(body, site) };
}
const credA = credential(
  1,
  opA,
  'TEST-ONLY operator A',
  ['agent.stop', 'decision.record'],
  'shift-supervisor',
);
const credB = credential(2, opB, 'TEST-ONLY operator B', ['agent.stop'], undefined);
const AGENT = uuid(300);
const AGENT_CRED = uuid(301);

// --- operator commands (§5) -------------------------------------------------------------------

function signCommand(kind, body, cred, key) {
  const digest = sha256(canonical(body));
  const frame = {
    domain: DOMAIN,
    command_id: body.commandId,
    command_kind: kind,
    role: cred.role ?? null,
    issued_at: body.issuedAt,
    command_digest: digest,
  };
  return {
    kind,
    body,
    digest,
    frame,
    signature: signPayload(body, key),
    digestSignature: signPayload(frame, key),
    cred,
  };
}

function operatorFields(c) {
  return {
    command_kind: c.kind,
    command_digest: c.digest,
    issued_at: c.body.issuedAt,
    role: c.cred.role ?? null,
    operator_credential_id: c.cred.credentialId,
    digest_signature: c.digestSignature,
    operator_signature: c.signature,
  };
}

// --- the ledger (§4) ------------------------------------------------------------------------

function chain(inputs) {
  let prev = GENESIS;
  return inputs.map((input, seq) => {
    const body = {
      seq,
      event_id: uuid(1000 + seq),
      event_type: input.event_type,
      timestamp: input.timestamp,
      site_id: SITE_ID,
      org_id: ORG_ID,
      trace_id: input.trace_id ?? 'trace-vector',
      agent_id: input.agent_id ?? null,
      operator_id: input.operator_id ?? null,
      capability_manifest_hash: null,
      model_version: input.model_version ?? null,
      input_digest: input.input_digest ?? null,
      output_digest: input.output_digest ?? null,
      confidence: input.confidence ?? null,
      detail: input.detail ?? {},
      prev_hash: prev,
    };
    const event_hash = sha256(prev + canonical(body));
    prev = event_hash;
    return { ...body, event_hash, sig: signPayload(event_hash, site) };
  });
}

const jsonl = (events) => events.map((e) => `${JSON.stringify(e)}\n`).join('');

/** Events 0–1: genesis and the recommendation the operator decides on. */
function headInputs() {
  return [
    {
      event_type: 'system.genesis',
      timestamp: at(0),
      detail: { site_id: SITE_ID, org_id: ORG_ID, format: 'aegis-pilot-ledger/1' },
    },
    {
      event_type: 'agent.decide',
      timestamp: at(1),
      trace_id: 'trace-recommendation',
      agent_id: AGENT,
      model_version: 'vector-model/1',
      output_digest: sha256('recommendation'),
      confidence: 0.875,
      // Number formatting vectors (§2.4): exponent forms and a fraction.
      detail: { recommendation: true, step: 'forecast', tiny: 1e-7, huge: 1e21, share: 0.1 },
    },
  ];
}
const REC_HASH = chain(headInputs())[1].event_hash;

/** Base event inputs; `mutate` builds forgeries before the chain is (re-)signed. */
function segmentInputs({ decide, stop, mutate = (x) => x, redact = null }) {
  const [genesis, rec] = headInputs();
  const inputs = [
    genesis,
    rec,
    {
      event_type: 'human.decide',
      timestamp: at(3),
      trace_id: rec.trace_id,
      operator_id: credA.subjectId,
      input_digest: rec.output_digest,
      detail: {
        action: 'decision',
        verdict: decide.body.verdict,
        journey_event: 'PATH_ACCEPTED',
        decision_by: credA.role,
        command_id: decide.body.commandId,
        recommendation_seq: 1,
        recommendation_hash: REC_HASH,
        recommended_by: AGENT,
        decided_at: decide.body.issuedAt,
        capture: 'live',
        evidence_quality: 'HUMAN_CONFIRMED',
        evidence_strength: 0.72,
        capture_lag_ms: 1000,
        decision_latency_ms: 1000,
        latency_basis: 'operator-signed issuedAt minus recommendation timestamp',
        recorded_lag_ms: 1000,
        signed_at: decide.body.issuedAt,
        ...operatorFields(decide),
      },
    },
    {
      event_type: 'human.override',
      timestamp: at(5),
      operator_id: credB.subjectId,
      detail: {
        action: 'agent.stop',
        command_id: stop.body.commandId,
        target: stop.body.target,
        agents_stopped: [AGENT],
        latency_ms: 1000,
        ...operatorFields(stop),
      },
    },
    {
      event_type: 'authority.revoke',
      timestamp: at(5),
      operator_id: credB.subjectId,
      detail: {
        credential_id: AGENT_CRED,
        reason: 'operator stop',
        command_id: stop.body.commandId,
      },
    },
  ];
  if (redact)
    inputs.push({
      event_type: 'evidence.redacted',
      timestamp: at(6),
      detail: { command_digest: redact, erased_at: at(6), reason_code: 'data-subject-request' },
    });
  inputs.push({
    event_type: 'system.segment_seal',
    timestamp: at(7),
    detail: { segment_index: 0, reason: 'scheduled: human.override since the last seal' },
  });
  return chain(mutate(inputs));
}

const decideCmd = signCommand(
  'decide',
  {
    v: 1,
    commandId: uuid(401),
    recommendationSeq: 1,
    recommendationHash: REC_HASH,
    verdict: 'accept',
    reason: 'TEST-ONLY: checked against the load forecast',
    issuedAt: at(2),
    operatorCredentialId: credA.credentialId,
  },
  credA,
  opA,
);
const stopCmd = signCommand(
  'stop',
  {
    v: 1,
    commandId: uuid(402),
    target: AGENT,
    reason: 'TEST-ONLY: operator stop',
    issuedAt: at(4),
    operatorCredentialId: credB.credentialId,
  },
  credB,
  opB,
);

const segment = segmentInputs({ decide: decideCmd, stop: stopCmd });

function retainUntil(iso, months) {
  const d = new Date(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString();
}

const sealBody = {
  v: 1,
  format: 'aegis-pilot-segment/1',
  siteId: SITE_ID,
  keyId: siteManifest.keyId,
  index: 0,
  file: '000000.jsonl',
  sha256: sha256(jsonl(segment)),
  bytes: Buffer.byteLength(jsonl(segment)),
  count: segment.length,
  firstTimestamp: segment[0].timestamp,
  lastTimestamp: segment.at(-1).timestamp,
  headHash: segment.at(-1).event_hash,
  sealedAt: at(8),
  reason: 'scheduled: human.override since the last seal',
  prevSeal: null,
  retention: {
    classes: { 'risk-6m': 3, 'identity-5y': 3 },
    retainUntil: retainUntil(segment.at(-1).timestamp, 60),
  },
};
const seal = { ...sealBody, sig: signPayload(sealBody, site) };
const sealDigest = sha256(canonical(sealBody));

const activePrev = GENESIS;
const activeBody = {
  seq: 0,
  event_id: uuid(2000),
  event_type: 'system.genesis',
  timestamp: at(8),
  site_id: SITE_ID,
  org_id: ORG_ID,
  trace_id: 'trace-roll',
  agent_id: null,
  operator_id: null,
  capability_manifest_hash: null,
  model_version: null,
  input_digest: null,
  output_digest: null,
  confidence: null,
  detail: {
    prev_segment: { index: 0, head_hash: sealBody.headHash, seal_digest: sealDigest },
    site_id: SITE_ID,
    org_id: ORG_ID,
    format: 'aegis-pilot-ledger/1',
  },
  prev_hash: activePrev,
};
const activeHash = sha256(activePrev + canonical(activeBody));
const active = [{ ...activeBody, event_hash: activeHash, sig: signPayload(activeHash, site) }];

// --- write the bundle (§6) -------------------------------------------------------------------

rmSync(OUT, { recursive: true, force: true });
const write = (rel, content) => {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, content);
};
const pretty = (o) => `${JSON.stringify(o, null, 2)}\n`;
const bodyFile = (c) => `${JSON.stringify({ ...c.body, signature: c.signature })}\n`;

const bundleFiles = {
  'AUDITOR_GUIDE.md':
    '# TEST-ONLY auditor guide stub\n\nVersion: 1.0 [Latest]\n\nTest-vector bundle for docs/aegis/EVIDENCE_FORMAT_v1.md. Not evidence.\n',
  'site/site.json': pretty(siteManifest),
  [`credentials/${credA.credentialId}.json`]: pretty(credA),
  [`credentials/${credB.credentialId}.json`]: pretty(credB),
  [`command-bodies/${decideCmd.digest}.json`]: bodyFile(decideCmd),
  [`command-bodies/${stopCmd.digest}.json`]: bodyFile(stopCmd),
  'ledger/segments/000000.jsonl': jsonl(segment),
  'ledger/segments/000000.seal.json': pretty(seal),
  'ledger/article12.jsonl': jsonl(active),
};
for (const [rel, content] of Object.entries(bundleFiles)) write(`bundle/${rel}`, content);
const manifest = {
  v: 1,
  siteId: SITE_ID,
  keyId: siteManifest.keyId,
  createdAt: at(9),
  ledgerHead: { count: 1, hash: activeHash },
  lastSealDigest: sealDigest,
  files: Object.entries(bundleFiles)
    .map(([path, content]) => ({
      path,
      sha256: sha256(content),
      bytes: Buffer.byteLength(content),
    }))
    .sort((a, b) => (a.path < b.path ? -1 : 1)),
};
const manifestSig = signPayload(manifest, site);
write('bundle/manifest.json', pretty(manifest));
write('bundle/manifest.sig', manifestSig);

// --- operator copies (§7) --------------------------------------------------------------------

const worm = (c, against) => ({
  command_digest: c.digest,
  command_id: c.body.commandId,
  command_kind: c.kind,
  role: c.cred.role ?? null,
  issued_at: c.body.issuedAt,
  operator_credential_id: c.cred.credentialId,
  digest_signature: c.digestSignature,
  ledger_seq: against.seq,
  event_hash: against.event_hash,
});
const copies = [
  [decideCmd, segment[1]],
  [stopCmd, segment[2]],
];
for (const [c, against] of copies) {
  write(`operator-copies/${c.digest}.json`, pretty(worm(c, against)));
  write(
    `operator-copies/${c.body.commandId}.json`,
    pretty({
      format: 'aegis-operator-copy/1',
      command_kind: c.kind,
      command: { ...c.body, signature: c.signature, digestSignature: c.digestSignature },
      issued_against: { segment: 0, seq: against.seq, event_hash: against.event_hash },
    }),
  );
}

// --- variants and negative cases (§5.3) ------------------------------------------------------------

const detailOf = (inputs, type) => inputs.find((i) => i.event_type === type).detail;
const base = { decide: decideCmd, stop: stopCmd };
write(
  'variants/redacted-stop-body.jsonl',
  jsonl(segmentInputs({ ...base, redact: stopCmd.digest })),
);

const forged = signCommand(
  'decide',
  { ...decideCmd.body, reason: 'TEST-ONLY: forged reason' },
  credA,
  opA,
);
const negatives = {
  'changed-target': (i) => {
    detailOf(i, 'human.override').target = uuid(999);
    return i;
  },
  'changed-verdict': (i) => {
    detailOf(i, 'human.decide').verdict = 'reject';
    return i;
  },
  // The site key holder edits the body's reason and re-points the event at the new digest.
  'changed-reason': (i) => {
    detailOf(i, 'human.decide').command_digest = forged.digest;
    return i;
  },
  'swapped-credential': (i) => {
    const d = i.find((x) => x.event_type === 'human.decide');
    d.detail.operator_credential_id = credB.credentialId;
    d.operator_id = credB.subjectId;
    return i;
  },
  'framed-role-swap': (i) => {
    const d = detailOf(i, 'human.decide');
    d.role = 'plant-manager';
    d.decision_by = 'plant-manager';
    return i;
  },
  'framed-command-id-swap': (i) => {
    detailOf(i, 'human.override').command_id = uuid(998);
    return i;
  },
  // The stop body is gone and nothing records its erasure (unchanged ledger, body omitted).
  'missing-body': (i) => i,
};
for (const [name, mutate] of Object.entries(negatives))
  write(`negative/${name}.jsonl`, jsonl(segmentInputs({ ...base, mutate })));
write(`negative/changed-reason.bodies/${forged.digest}.json`, bodyFile(forged));

const cases = [
  {
    name: 'redacted-stop-body',
    ledger: 'variants/redacted-stop-body.jsonl',
    omit_bodies: [stopCmd.digest],
    expect: 'PASS',
  },
  {
    name: 'changed-target',
    ledger: 'negative/changed-target.jsonl',
    expect: 'OPERATOR_BINDING_MISMATCH:target',
  },
  {
    name: 'changed-verdict',
    ledger: 'negative/changed-verdict.jsonl',
    expect: 'OPERATOR_BINDING_MISMATCH:verdict',
  },
  {
    name: 'changed-reason',
    ledger: 'negative/changed-reason.jsonl',
    extra_bodies: 'negative/changed-reason.bodies',
    expect: 'OPERATOR_SIGNATURE_INVALID',
  },
  {
    name: 'swapped-credential',
    ledger: 'negative/swapped-credential.jsonl',
    expect: 'OPERATOR_BINDING_MISMATCH:operator_credential_id',
  },
  {
    name: 'framed-role-swap',
    ledger: 'negative/framed-role-swap.jsonl',
    expect: 'OPERATOR_SIGNATURE_INVALID',
  },
  {
    name: 'framed-command-id-swap',
    ledger: 'negative/framed-command-id-swap.jsonl',
    expect: 'OPERATOR_SIGNATURE_INVALID',
  },
  {
    name: 'missing-body',
    ledger: 'negative/missing-body.jsonl',
    omit_bodies: [stopCmd.digest],
    expect: 'COMMAND_BODY_MISSING',
  },
];

// --- expected.json ---------------------------------------------------------------------------

const CANONICAL_VECTORS = [
  ['key order by UTF-16 code units', '{"z":1,"a":2,"é":3,"\\ud83d\\ude00":4,"\\uffff":5,"B":6}'],
  ['nested, arrays keep order', '{"b":[3,1,{"y":null,"x":true}],"a":{"d":"","c":false}}'],
  [
    'string escapes',
    '{"s":"quote\\" backslash\\\\ nl\\n tab\\t ctl\\u0001 del\\u007f nbsp\\u00a0 ls\\u2028 é 😀"}',
  ],
  ['numbers', '[0,-0,1,-1,0.1,1.5e-7,1e-7,1e21,1e+300,123456789012345680000,5e-324,0.000001,2.5]'],
];
const eventEntries = (label, events) =>
  events.map((e) => {
    const { event_hash, sig, ...body } = e;
    return {
      segment: label,
      seq: e.seq,
      event_type: e.event_type,
      canonical: canonical(body),
      event_hash,
      sig,
    };
  });
const commandEntry = (c) => ({
  kind: c.kind,
  command_id: c.body.commandId,
  canonical_body: canonical(c.body),
  command_digest: c.digest,
  operator_signature: c.signature,
  frame_canonical: canonical(c.frame),
  digest_signature: c.digestSignature,
});
const credEntry = (c) => {
  const { signature, ...body } = c;
  return { credential_id: c.credentialId, canonical_body: canonical(body), signature };
};
const keyEntry = (k) => ({
  seed_label: SEED_LABEL(k.name),
  test_only_seed_hex: k.seedHex,
  public_key_pem: k.publicKeyPem,
  key_id: keyIdOf(k.publicKeyPem),
});

const expected = {
  format: 'aegis-evidence-test-vectors/1',
  spec: 'docs/aegis/EVIDENCE_FORMAT_v1.md',
  warning:
    'TEST-ONLY. Every private key here is sha256(seed_label) and is public. Never sign real evidence with it.',
  keys: { site: keyEntry(site), 'operator-a': keyEntry(opA), 'operator-b': keyEntry(opB) },
  canonicalization: CANONICAL_VECTORS.map(([name, json]) => ({
    name,
    json,
    canonical: canonical(JSON.parse(json)),
  })),
  credentials: [credEntry(credA), credEntry(credB)],
  commands: [commandEntry(decideCmd), commandEntry(stopCmd)],
  events: [...eventEntries('000000', segment), ...eventEntries('active', active)],
  seals: [
    { index: 0, canonical_body: canonical(sealBody), seal_digest: sealDigest, sig: seal.sig },
  ],
  manifest: { canonical: canonical(manifest), sig: manifestSig },
  cases,
};
write('expected.json', pretty(expected));
process.stdout.write(
  `${JSON.stringify({ ok: true, out: OUT, files: Object.keys(bundleFiles).length + 2, cases: cases.length })}\n`,
);
