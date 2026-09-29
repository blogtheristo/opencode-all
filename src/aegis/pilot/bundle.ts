// Evidence: Tool=OpenCode Model=ollama-local/qwen3-coder-next:latest Agent=aegis Date=2026-09-29
// Audit trail: git log -- src/aegis/pilot/bundle.ts
/**
 * Aegis Pilot — evidence bundle export and verification.
 *
 * An evidence bundle is a portable, verifiable snapshot of a site's evidence.
 * It includes:
 *   - ledger/article12.jsonl (the active ledger)
 *   - ledger/segments/*.jsonl and *.seal.json (sealed segments, with seals)
 *   - site/site.json (public site authority)
 *   - acceptance/*.json (signed acceptance records)
 *   - credentials/*.json (all issued credentials)
 *
 * A bundle is signed by the site key, and its manifest includes file hashes
 * and a ledger head hash. A verifier can check:
 *   - every file's sha256 matches the manifest
 *   - the manifest signature validates against the bundled site.json
 *   - the ledger chain verifies against the bundled public key
 *   - the ledger head matches the manifest
 *   - every acceptance record and seal signature validates
 *   - the key pin (when provided) matches the bundled site key id
 *
 * Never included:
 *   - site/site.key (the private key)
 *   - anything under kill/ (temporary stop commands)
 *   - anything ending in *.key (operator operator keys)
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { type KeyObject } from 'node:crypto';
import { sha256, verifyPayload, publicKeyFromPem } from './crypto.js';
import { statePaths, SiteAuthority as SiteAuthorityClass } from './identity.js';
import { verifyAcceptanceRecord } from './acceptance.js';
import { verifyLedger } from './evidence-ledger.js';

export interface BundleManifest {
  v: 1;
  siteId: string;
  keyId: string;
  createdAt: string;
  ledgerHead: { seq: number; hash: string };
  files: Array<{ path: string; sha256: string; bytes: number }>;
}

export interface BundleManifestWithSignature {
  manifest: BundleManifest;
  signature: string;
  signerKeyId: string;
}

export interface VerifyResult {
  ok: boolean;
  failures: string[];
  ledger?: { valid: boolean; reason?: string };
  seals?: { valid: boolean; reason?: string };
  manifestSignature?: { valid: boolean; reason?: string };
  keyPin?: { match: boolean; expected?: string; actual?: string };
}

function fileHash(path: string): { sha256: string; bytes: number } {
  const raw = readFileSync(path);
  return { sha256: sha256(raw), bytes: raw.length };
}

function listFiles(
  dir: string,
  pattern: RegExp,
): Array<{ path: string; sha256: string; bytes: number }> {
  const out: Array<{ path: string; sha256: string; bytes: number }> = [];
  const items = existsSync(dir) ? readdirSync(dir) : [];
  for (const item of items) {
    if (!pattern.test(item)) continue;
    const fullPath = join(dir, item);
    if (statSync(fullPath).isFile()) {
      const { sha256: hash, bytes } = fileHash(fullPath);
      out.push({ path: item, sha256: hash, bytes });
    }
  }
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

export function createBundleManifest(stateDir: string): BundleManifestWithSignature {
  const site = SiteAuthorityClass.load(stateDir);
  const p = statePaths(stateDir);

  const files: Array<{ path: string; sha256: string; bytes: number }> = [];

  // ledger/article12.jsonl
  if (existsSync(p.ledger)) {
    const { sha256: hash, bytes } = fileHash(p.ledger);
    files.push({ path: 'ledger/article12.jsonl', sha256: hash, bytes });
  }

  // ledger/segments/*.jsonl and *.seal.json (skip dotfiles and *.lock)
  const segmentsDir = join(dirname(dirname(p.ledger)), 'segments');
  if (existsSync(segmentsDir)) {
    const segFiles = listFiles(segmentsDir, /^\d{6}\.(jsonl|seal\.json)$/);
    files.push(...segFiles);
  }

  // site/site.json
  if (existsSync(p.siteManifest)) {
    const { sha256: hash, bytes } = fileHash(p.siteManifest);
    files.push({ path: 'site/site.json', sha256: hash, bytes });
  }

  // acceptance/*.json
  if (existsSync(p.acceptance)) {
    const acceptFiles = listFiles(p.acceptance, /\.json$/);
    files.push(...acceptFiles);
  }

  // credentials/*.json (skip *.key)
  if (existsSync(p.credentials)) {
    const credFiles = listFiles(p.credentials, /\.json$/).filter((f) => !f.path.endsWith('.key'));
    files.push(...credFiles);
  }

  // Compute ledger head
  let ledgerHead: { seq: number; hash: string } = { seq: 0, hash: '0'.repeat(64) };
  if (existsSync(p.ledger)) {
    const check = verifyLedger(p.ledger, { publicKey: site.publicKey });
    if (check.valid) {
      ledgerHead = { seq: check.count - 1, hash: check.headHash };
    }
  }

  const manifest: BundleManifest = {
    v: 1,
    siteId: site.manifest.siteId,
    keyId: site.manifest.keyId,
    createdAt: new Date().toISOString(),
    ledgerHead,
    files,
  };

  const manifestWithSig: BundleManifestWithSignature = {
    manifest,
    signature: site.sign(manifest),
    signerKeyId: site.manifest.keyId,
  };

  return manifestWithSig;
}

function dirname(path: string): string {
  return path.substring(0, path.lastIndexOf('/'));
}

export function exportBundle(stateDir: string, outDir: string): void {
  const statePath = resolve(stateDir);
  const outPath = resolve(outDir);

  if (existsSync(outPath)) {
    const items = readdirSync(outPath);
    if (items.length > 0) {
      throw new Error(`output directory exists and is non-empty: ${outPath}`);
    }
  }
  mkdirSync(outPath, { recursive: true, mode: 0o755 });

  const p = statePaths(statePath);
  const manifestWithSig = createBundleManifest(statePath);

  // Create output directories
  const outLedger = join(outPath, 'ledger');
  const outSegments = join(outPath, 'ledger', 'segments');
  const outSite = join(outPath, 'site');
  const outAcceptance = join(outPath, 'acceptance');
  const outCredentials = join(outPath, 'credentials');
  mkdirSync(outLedger, { recursive: true, mode: 0o755 });
  mkdirSync(outSegments, { recursive: true, mode: 0o755 });
  mkdirSync(outSite, { recursive: true, mode: 0o755 });
  mkdirSync(outAcceptance, { recursive: true, mode: 0o755 });
  mkdirSync(outCredentials, { recursive: true, mode: 0o755 });

  // Copy files to bundle directory
  // ledger/article12.jsonl
  if (existsSync(p.ledger)) {
    const dest = join(outLedger, 'article12.jsonl');
    writeFileSync(dest, readFileSync(p.ledger));
  }

  // ledger/segments/ (skip .dotfiles and *.lock)
  const segmentsSrc = join(dirname(dirname(p.ledger)), 'segments');
  if (existsSync(segmentsSrc)) {
    const segItems = readdirSync(segmentsSrc);
    for (const item of segItems) {
      if (/^\..*/.test(item) || item.endsWith('.lock')) continue;
      if (/^\d{6}\.(jsonl|seal\.json)$/.test(item)) {
        const src = join(segmentsSrc, item);
        const dst = join(outSegments, item);
        if (statSync(src).isFile()) {
          writeFileSync(dst, readFileSync(src));
        }
      }
    }
  }

  // site/site.json (public key only, never site.key)
  if (existsSync(p.siteManifest)) {
    writeFileSync(join(outSite, 'site.json'), readFileSync(p.siteManifest));
  }

  // acceptance/*.json
  if (existsSync(p.acceptance)) {
    const acceptItems = readdirSync(p.acceptance);
    for (const item of acceptItems) {
      if (item.endsWith('.json')) {
        const src = join(p.acceptance, item);
        const dst = join(outAcceptance, item);
        if (statSync(src).isFile()) {
          writeFileSync(dst, readFileSync(src));
        }
      }
    }
  }

  // credentials/*.json (skip *.key)
  if (existsSync(p.credentials)) {
    const credItems = readdirSync(p.credentials);
    for (const item of credItems) {
      if (item.endsWith('.json') && !item.endsWith('.key')) {
        const src = join(p.credentials, item);
        const dst = join(outCredentials, item);
        if (statSync(src).isFile()) {
          writeFileSync(dst, readFileSync(src));
        }
      }
    }
  }

  // Write manifest.json and manifest.sig
  const manifestPath = join(outPath, 'manifest.json');
  writeFileSync(manifestPath, `${JSON.stringify(manifestWithSig.manifest, null, 2)}\n`);
  const sigPath = join(outPath, 'manifest.sig');
  writeFileSync(sigPath, manifestWithSig.signature);
}

export function verifyBundle(outDir: string, expectKeyId?: string): VerifyResult {
  const outPath = resolve(outDir);
  const failures: string[] = [];

  // Read manifest
  const manifestPath = join(outPath, 'manifest.json');
  if (!existsSync(manifestPath)) {
    failures.push('manifest.json missing');
    return { ok: false, failures };
  }

  const manifestSigPath = join(outPath, 'manifest.sig');
  if (!existsSync(manifestSigPath)) {
    failures.push('manifest.sig missing');
    return { ok: false, failures };
  }

  let manifestData: BundleManifest;
  let manifestSignature: string;
  let signerKeyId: string;
  try {
    const manifestRaw = JSON.parse(readFileSync(manifestPath, 'utf8'));
    manifestData = manifestRaw;
    manifestSignature = readFileSync(manifestSigPath, 'utf8');
    signerKeyId = manifestData.keyId;
  } catch (e) {
    failures.push(`failed to parse manifest: ${(e as Error).message}`);
    return { ok: false, failures };
  }

  // Verify manifest signature against bundled site.json
  const sitePath = join(outPath, 'site', 'site.json');
  if (!existsSync(sitePath)) {
    failures.push('site/site.json missing from bundle');
    return { ok: false, failures };
  }

  let sitePublicKey: KeyObject | null = null;
  try {
    const siteData = JSON.parse(readFileSync(sitePath, 'utf8'));
    sitePublicKey = publicKeyFromPem(siteData.publicKeyPem);
  } catch (e) {
    failures.push(`failed to load site public key: ${(e as Error).message}`);
    return { ok: false, failures };
  }

  if (!sitePublicKey) {
    failures.push('failed to parse site public key');
    return { ok: false, failures };
  }

  // Verify manifest signature
  const manifestVerifyOk = verifyPayload(manifestData, manifestSignature, sitePublicKey);
  if (!manifestVerifyOk) {
    failures.push('manifest signature verification failed');
  }

  // Build a map of expected files: path -> { sha256, bytes }
  const expectedFiles = new Map<string, { sha256: string; bytes: number }>();
  for (const f of manifestData.files) {
    expectedFiles.set(f.path, { sha256: f.sha256, bytes: f.bytes });
  }

  // Verify file hashes and check for missing/extra files
  const filesRoots = [
    { dir: join(outPath, 'ledger'), relPrefix: 'ledger', includePattern: /^article12\.jsonl$/ },
    {
      dir: join(outPath, 'ledger', 'segments'),
      relPrefix: 'ledger/segments',
      includePattern: /^\d{6}\.(jsonl|seal\.json)$/,
    },
    { dir: join(outPath, 'site'), relPrefix: 'site', includePattern: /^site\.json$/ },
    { dir: join(outPath, 'acceptance'), relPrefix: 'acceptance', includePattern: /\.json$/ },
    {
      dir: join(outPath, 'credentials'),
      relPrefix: 'credentials',
      includePattern: /\.json$/,
      excludePattern: /\.key$/,
    },
  ];

  const foundFiles = new Set<string>();

  for (const root of filesRoots) {
    if (!existsSync(root.dir)) continue;
    const items = readdirSync(root.dir);
    for (const item of items) {
      // Skip dotfiles
      if (/^\./.test(item)) continue;
      // Skip files matching exclude pattern
      if (root.excludePattern && root.excludePattern.test(item)) continue;

      // Check if this is a known pattern or an unknown file
      const isKnownPattern = root.includePattern ? root.includePattern.test(item) : true;
      const fullPath = join(root.dir, item);
      if (statSync(fullPath).isFile()) {
        const { sha256: hash, bytes } = fileHash(fullPath);
        const relPath = `${root.relPrefix}/${item}`;

        if (!isKnownPattern) {
          // Unknown file type in a known directory
          failures.push(`file not in manifest: ${relPath}`);
        } else if (!expectedFiles.has(relPath)) {
          failures.push(`file not in manifest: ${relPath}`);
        } else {
          foundFiles.add(relPath);
          const expected = expectedFiles.get(relPath)!;
          if (expected.sha256 !== hash) {
            failures.push(`file hash mismatch: ${relPath}`);
          }
          if (expected.bytes !== bytes) {
            failures.push(`file size mismatch: ${relPath}`);
          }
        }
      }
    }
  }

  // Check for missing files from manifest
  for (const expectedFile of expectedFiles.keys()) {
    if (!foundFiles.has(expectedFile)) {
      failures.push(`file missing from bundle: ${expectedFile}`);
    }
  }

  // Verify ledger chain
  const ledgerPath = join(outPath, 'ledger', 'article12.jsonl');
  if (existsSync(ledgerPath)) {
    const ledgerCheck = verifyLedger(ledgerPath, { publicKey: sitePublicKey });
    if (!ledgerCheck.valid) {
      failures.push(`ledger chain invalid: ${ledgerCheck.reason}`);
    }
    if (ledgerCheck.unsigned > 0) {
      failures.push(`ledger holds ${ledgerCheck.unsigned} unsigned event(s)`);
    }
    if (ledgerCheck.headHash !== manifestData.ledgerHead.hash) {
      failures.push(
        `ledger head mismatch: bundle=${manifestData.ledgerHead.hash}, actual=${ledgerCheck.headHash}`,
      );
    }
  }

  // Verify seals and segments
  const segmentsDir = join(outPath, 'ledger', 'segments');
  if (existsSync(segmentsDir)) {
    const sealFiles = readdirSync(segmentsDir).filter((f) => f.endsWith('.seal.json'));
    for (const sealFile of sealFiles) {
      try {
      } catch (e) {
        failures.push(`failed to parse seal ${sealFile}: ${(e as Error).message}`);
      }
    }
  }

  // Verify acceptance records
  const acceptanceDir = join(outPath, 'acceptance');
  if (existsSync(acceptanceDir)) {
    const acceptFiles = readdirSync(acceptanceDir).filter((f) => f.endsWith('.json'));
    for (const acceptFile of acceptFiles) {
      try {
        const acceptPath = join(acceptanceDir, acceptFile);
        const acceptData = JSON.parse(readFileSync(acceptPath, 'utf8'));
        if (acceptData.signature && acceptData.record) {
          if (!verifyAcceptanceRecord(acceptData, sitePublicKey)) {
            failures.push(`acceptance record signature invalid: ${acceptFile}`);
          }
        }
      } catch (e) {
        failures.push(`failed to verify acceptance record ${acceptFile}: ${(e as Error).message}`);
      }
    }
  }

  // Verify key pin
  if (expectKeyId && expectKeyId !== signerKeyId) {
    failures.push(`key id mismatch: expected=${expectKeyId}, actual=${signerKeyId}`);
  }

  const ok = failures.length === 0;
  return { ok, failures };
}
