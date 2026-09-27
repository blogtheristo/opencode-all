// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- scripts/__tests__/build-learning-hub.test.mjs

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { afterEach, describe, expect, test } from 'vitest';
import { AUDIENCE_ROLES, buildRolePack, loadAndValidateManifest, validatePackDirectory } from '../build-learning-hub.mjs';

const repoRoot = path.resolve('.');
const scratchRoot = path.join(repoRoot, '.test-output', 'learning-hub');

afterEach(async () => {
  await rm(scratchRoot, { recursive: true, force: true });
});

describe('role-based Learning Hub packs', () => {
  test('isolates documents by audience role and writes checksums', async () => {
    const manifest = await loadAndValidateManifest(repoRoot);
    const outputRoot = '.test-output/learning-hub/isolation';
    const adminRoot = await buildRolePack({ repoRoot, manifest, role: 'admin', outputRoot });
    const customerRoot = await buildRolePack({ repoRoot, manifest, role: 'customer', outputRoot });
    const adminManifest = JSON.parse(await readFile(path.join(adminRoot, 'manifest.json'), 'utf8'));
    const customerManifest = JSON.parse(await readFile(path.join(customerRoot, 'manifest.json'), 'utf8'));

    expect(adminManifest.documents.map((document) => document.id)).toContain('admin-manual');
    expect(await readFile(path.join(adminRoot, 'docs/admin-manual.html'), 'utf8')).toContain(
      'Role-based Learning Hub distribution',
    );
    expect(customerManifest.documents.map((document) => document.id)).not.toContain('admin-manual');
    expect(customerManifest.documents.map((document) => document.id)).toEqual(['security-compliance', 'sovereign-intelligence']);
    expect(await readFile(path.join(customerRoot, 'checksums.sha256'), 'utf8')).toMatch(/^[a-f0-9]{64} {2}index\.html$/m);
    await expect(validatePackDirectory(customerRoot)).resolves.toBe(true);
  });

  test('detects checksum tampering', async () => {
    const manifest = await loadAndValidateManifest(repoRoot);
    const packRoot = await buildRolePack({ repoRoot, manifest, role: 'customer', outputRoot: '.test-output/learning-hub/checksum' });
    await writeFile(path.join(packRoot, 'index.html'), '<!doctype html><title>Tampered</title>');
    await expect(validatePackDirectory(packRoot)).rejects.toThrow('Checksum mismatch');
  });

  test('rejects an unknown requested role', async () => {
    const manifest = await loadAndValidateManifest(repoRoot);
    await expect(buildRolePack({ repoRoot, manifest, role: 'R22', outputRoot: '.test-output/learning-hub/unknown-role' })).rejects.toThrow('Unknown audience role');
    expect(AUDIENCE_ROLES).not.toContain('R22');
  });

  test.each([
    ['traversal', '../outside.html'],
    ['POSIX absolute', '/etc/passwd'],
    ['Windows absolute', 'C:\\Users\\example\\secret.html'],
    ['file URL', 'file:///C:/secret.html'],
  ])('rejects %s source paths', async (_label, source) => {
    const manifestPath = '.test-output/learning-hub/invalid-manifest.json';
    await mkdir(path.dirname(path.join(repoRoot, manifestPath)), { recursive: true });
    await writeFile(path.join(repoRoot, manifestPath), JSON.stringify({
      schemaVersion: '1.0.0',
      packVersion: '2026.09.27',
      releaseDate: '2026-09-27',
      audienceRoles: AUDIENCE_ROLES,
      documents: [{ id: 'invalid', title: 'Invalid', summary: 'Invalid path fixture', source, output: 'docs/invalid.html', roles: ['customer'] }],
    }));
    await expect(loadAndValidateManifest(repoRoot, manifestPath)).rejects.toThrow();
  });

  test('rejects required remote runtime assets', async () => {
    const fixtureRoot = path.join(scratchRoot, 'remote-runtime');
    await mkdir(fixtureRoot, { recursive: true });
    await writeFile(path.join(fixtureRoot, 'source.html'), '<!doctype html><html><head><script src="https://example.com/app.js"></script></head></html>');
    const manifest = {
      schemaVersion: '1.0.0', packVersion: '2026.09.27', releaseDate: '2026-09-27', title: 'Fixture', audienceRoles: AUDIENCE_ROLES,
      documents: [{ id: 'remote-runtime', title: 'Remote runtime', summary: 'Fixture', source: '.test-output/learning-hub/remote-runtime/source.html', output: 'docs/source.html', roles: ['customer'] }],
    };
    await expect(buildRolePack({ repoRoot, manifest, role: 'customer', outputRoot: '.test-output/learning-hub/remote-runtime-output' })).rejects.toThrow('requires remote runtime asset');
  });
});
