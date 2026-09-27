#!/usr/bin/env node
// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- scripts/build-learning-hub.mjs

import { createHash } from 'node:crypto';
import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';

export const AUDIENCE_ROLES = Object.freeze(['admin', 'investor', 'partner', 'customer']);
const DEFAULT_MANIFEST = 'config/learning-hub/role-documents.json';
const DEFAULT_OUTPUT = 'dist/learning-hub';
const RUNTIME_TAGS = new Set(['audio', 'embed', 'iframe', 'img', 'object', 'script', 'source', 'video']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function isWindowsAbsolute(value) {
  return /^[A-Za-z]:[\\/]/.test(value) || /^\\\\/.test(value);
}

function validateRelativePath(value, label) {
  assert(typeof value === 'string' && value.length > 0, `${label} must be a non-empty string`);
  assert(!/^file:/i.test(value), `${label} must not use a file URL`);
  assert(!path.isAbsolute(value) && !isWindowsAbsolute(value), `${label} must be relative`);
  assert(!value.includes('\\'), `${label} must use forward slashes`);
  const normalized = path.posix.normalize(value);
  assert(normalized !== '..' && !normalized.startsWith('../'), `${label} must not traverse outside its root`);
  return normalized;
}

function resolveInside(root, relativePath, label) {
  const normalized = validateRelativePath(relativePath, label);
  const resolvedRoot = path.resolve(root);
  const resolved = path.resolve(resolvedRoot, normalized);
  assert(resolved === resolvedRoot || resolved.startsWith(`${resolvedRoot}${path.sep}`), `${label} escapes its root`);
  return resolved;
}

function isRemote(value) {
  return /^(?:https?:)?\/\//i.test(value);
}

function isIgnoredReference(value) {
  return value === '' || value.startsWith('#') || /^(?:data:|mailto:|tel:)/i.test(value);
}

function referencePath(value) {
  return value.split(/[?#]/, 1)[0];
}

function parseTagAttributes(tag) {
  const attributes = new Map();
  for (const match of tag.matchAll(/\b([a-zA-Z][\w:-]*)\s*=\s*(["'])(.*?)\2/g)) {
    attributes.set(match[1].toLowerCase(), match[3]);
  }
  return attributes;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderMarkdown(markdown, title) {
  const renderer = new MarkdownIt({ html: false, linkify: false, typographer: false });
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { max-width: 72rem; margin: 0 auto; padding: 2rem; line-height: 1.6; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #64748b; padding: .5rem; text-align: left; }
      pre { overflow-x: auto; padding: 1rem; background: #1e293b; color: #e2e8f0; }
      code { overflow-wrap: anywhere; }
      img { max-width: 100%; height: auto; }
    </style>
  </head>
  <body>${renderer.render(markdown)}</body>
</html>
`;
}

function transformHtml(html, sourceRelative, outputRelative, sourceToOutput, assetSourceToOutput) {
  assert(!/@import\s+(?:url\()?['"]?(?:https?:)?\/\//i.test(html), `${sourceRelative} requires a remote CSS import`);
  assert(!/url\(\s*['"]?(?:https?:)?\/\//i.test(html), `${sourceRelative} requires a remote CSS asset`);

  return html.replace(/<([a-zA-Z][\w:-]*)\b[^>]*>/g, (tag, rawName) => {
    const tagName = rawName.toLowerCase();
    const attributes = parseTagAttributes(tag);
    const runtimeAttribute = tagName === 'link' ? 'href' : tagName === 'object' ? 'data' : 'src';
    const runtimeValue = attributes.get(runtimeAttribute);
    const linkRel = attributes.get('rel')?.toLowerCase() ?? '';
    const linkIsRuntime = tagName === 'link' && /\b(?:stylesheet|preload|modulepreload|icon)\b/.test(linkRel);
    if ((RUNTIME_TAGS.has(tagName) || linkIsRuntime) && runtimeValue && isRemote(runtimeValue)) {
      throw new Error(`${sourceRelative} requires remote runtime asset ${runtimeValue}`);
    }

    let transformed = tag;
    for (const attribute of ['href', 'src', 'data']) {
      const value = attributes.get(attribute);
      if (!value || isIgnoredReference(value) || isRemote(value)) continue;
      assert(!/^(?:file|javascript):/i.test(value), `${sourceRelative} contains unsafe ${attribute}: ${value}`);
      const pathPart = referencePath(value);
      const unsafeLocalPath = path.isAbsolute(pathPart) || isWindowsAbsolute(pathPart) || pathPart.includes('\\');
      const sourceTarget = unsafeLocalPath
        ? ''
        : path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelative), pathPart));
      const escapesRepository = sourceTarget === '..' || sourceTarget.startsWith('../');
      const outputTarget = escapesRepository ? undefined : sourceToOutput.get(sourceTarget) ?? assetSourceToOutput.get(sourceTarget);

      if (attribute === 'href' && !outputTarget) {
        transformed = transformed.replace(
          new RegExp(`(${attribute}\\s*=\\s*["'])${escapeRegExp(value)}(["'])`, 'i'),
          '$1#unavailable-in-role-pack$2',
        );
        continue;
      }
      assert(!unsafeLocalPath && !escapesRepository, `${sourceRelative} contains unsafe ${attribute}: ${value}`);
      const suffix = value.slice(pathPart.length);
      assert(outputTarget, `${sourceRelative} references unapproved local asset ${value}`);
      const rewritten = path.posix.relative(path.posix.dirname(outputRelative), outputTarget) || path.posix.basename(outputTarget);
      transformed = transformed.replace(
        new RegExp(`(${attribute}\\s*=\\s*["'])${escapeRegExp(value)}(["'])`, 'i'),
        `$1${rewritten}${suffix}$2`,
      );
    }
    return transformed;
  });
}

function renderIndex(manifest, role, documents) {
  const cards = documents.map((document) => `        <li>
          <a href="${escapeHtml(document.output)}">${escapeHtml(document.title)}</a>
          <p>${escapeHtml(document.summary)}</p>
        </li>`).join('\n');
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(manifest.title)} — ${escapeHtml(role)}</title>
    <style>
      :root { color-scheme: light dark; font-family: system-ui, sans-serif; }
      body { max-width: 64rem; margin: 0 auto; padding: 2rem; line-height: 1.5; }
      header { border-bottom: 1px solid #64748b; margin-bottom: 2rem; }
      .role { text-transform: capitalize; font-weight: 700; color: #0f766e; }
      ul { display: grid; gap: 1rem; padding: 0; list-style: none; }
      li { border: 1px solid #64748b; border-radius: .5rem; padding: 1rem; }
      a { font-weight: 700; }
      p { margin-bottom: 0; }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(manifest.title)}</h1>
      <p>Audience pack: <span class="role">${escapeHtml(role)}</span> · Version ${escapeHtml(manifest.packVersion)}</p>
      <p>This offline pack is a generated distribution copy. Repository documents remain the source of truth.</p>
    </header>
    <main>
      <h2>Documentation available to this role</h2>
      <ul>
${cards}
      </ul>
    </main>
  </body>
</html>
`;
}

async function sha256(filePath) {
  return createHash('sha256').update(await readFile(filePath)).digest('hex');
}

async function listFiles(root, current = root) {
  const files = [];
  for (const entry of await readdir(current, { withFileTypes: true })) {
    const fullPath = path.join(current, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(root, fullPath)));
    else files.push(path.relative(root, fullPath).split(path.sep).join('/'));
  }
  return files.sort();
}

export async function loadAndValidateManifest(repoRoot, manifestPath = DEFAULT_MANIFEST) {
  const absoluteManifest = resolveInside(repoRoot, manifestPath, 'manifest path');
  const manifest = JSON.parse(await readFile(absoluteManifest, 'utf8'));
  assert(manifest.schemaVersion === '1.0.0', 'Unsupported manifest schemaVersion');
  assert(/^\d{4}\.\d{2}\.\d{2}$/.test(manifest.packVersion), 'packVersion must use YYYY.MM.DD');
  assert(/^\d{4}-\d{2}-\d{2}$/.test(manifest.releaseDate), 'releaseDate must use YYYY-MM-DD');
  assert(JSON.stringify(manifest.audienceRoles) === JSON.stringify(AUDIENCE_ROLES), `audienceRoles must be exactly ${AUDIENCE_ROLES.join(', ')}`);
  assert(Array.isArray(manifest.documents) && manifest.documents.length > 0, 'documents must be a non-empty array');

  const ids = new Set();
  const roleOutputs = new Map(AUDIENCE_ROLES.map((role) => [role, new Set()]));
  for (const document of manifest.documents) {
    assert(/^[a-z0-9][a-z0-9-]*$/.test(document.id), `Invalid document id: ${document.id}`);
    assert(!ids.has(document.id), `Duplicate document id: ${document.id}`);
    ids.add(document.id);
    assert(typeof document.title === 'string' && document.title.length > 0, `${document.id} needs a title`);
    assert(typeof document.summary === 'string' && document.summary.length > 0, `${document.id} needs a summary`);
    const source = validateRelativePath(document.source, `${document.id} source`);
    const output = validateRelativePath(document.output, `${document.id} output`);
    assert(output.endsWith('.html'), `${document.id} output must be HTML`);
    const sourcePath = resolveInside(repoRoot, source, `${document.id} source`);
    assert((await stat(sourcePath)).isFile(), `${document.id} source does not exist`);
    if (document.canonicalSource) {
      const canonicalSource = validateRelativePath(document.canonicalSource, `${document.id} canonical source`);
      assert((await stat(resolveInside(repoRoot, canonicalSource, `${document.id} canonical source`))).isFile(), `${document.id} canonical source does not exist`);
    }
    if (document.requiredText) {
      assert(typeof document.requiredText === 'string', `${document.id} requiredText must be a string`);
      assert((await readFile(sourcePath, 'utf8')).includes(document.requiredText), `${document.id} rendered source is stale: missing required text`);
    }
    assert(Array.isArray(document.roles) && document.roles.length > 0, `${document.id} needs roles`);
    for (const role of document.roles) {
      assert(AUDIENCE_ROLES.includes(role), `${document.id} has unknown audience role: ${role}`);
      const outputs = roleOutputs.get(role);
      assert(!outputs.has(output), `Output collision for ${role}: ${output}`);
      outputs.add(output);
    }
    for (const asset of document.assets ?? []) {
      assert((await stat(resolveInside(repoRoot, asset.source, `${document.id} asset source`))).isFile(), `${document.id} asset does not exist`);
      const assetOutput = validateRelativePath(asset.output, `${document.id} asset output`);
      for (const role of document.roles) {
        const outputs = roleOutputs.get(role);
        assert(!outputs.has(assetOutput), `Output collision for ${role}: ${assetOutput}`);
        outputs.add(assetOutput);
      }
    }
  }
  return manifest;
}

export async function buildRolePack({ repoRoot, manifest, role, outputRoot = DEFAULT_OUTPUT, installerPath = 'scripts/install-learning-hub.ps1' }) {
  assert(AUDIENCE_ROLES.includes(role), `Unknown audience role: ${role}`);
  const documents = manifest.documents.filter((document) => document.roles.includes(role));
  assert(documents.length > 0, `No documents configured for ${role}`);
  const packRoot = resolveInside(repoRoot, path.posix.join(outputRoot, manifest.packVersion, role), 'pack output');
  await rm(packRoot, { recursive: true, force: true });
  await mkdir(packRoot, { recursive: true });

  const sourceToOutput = new Map(documents.map((document) => [path.posix.normalize(document.source), document.output]));
  const assets = documents.flatMap((document) => document.assets ?? []);
  const assetSourceToOutput = new Map(assets.map((asset) => [path.posix.normalize(asset.source), asset.output]));
  for (const document of documents) {
    const destinationPath = resolveInside(packRoot, document.output, `${document.id} output`);
    await mkdir(path.dirname(destinationPath), { recursive: true });
    const sourceText = await readFile(resolveInside(repoRoot, document.source, `${document.id} source`), 'utf8');
    const html = path.extname(document.source).toLowerCase() === '.md'
      ? renderMarkdown(sourceText, document.title)
      : sourceText;
    await writeFile(destinationPath, transformHtml(html, document.source, document.output, sourceToOutput, assetSourceToOutput), 'utf8');
  }
  for (const asset of assets) {
    const destinationPath = resolveInside(packRoot, asset.output, 'asset output');
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await copyFile(resolveInside(repoRoot, asset.source, 'asset source'), destinationPath);
  }

  const subset = {
    schemaVersion: manifest.schemaVersion,
    packVersion: manifest.packVersion,
    releaseDate: manifest.releaseDate,
    role,
    documents: documents.map(({ id, title, summary, output }) => ({ id, title, summary, output })),
  };
  await writeFile(path.join(packRoot, 'index.html'), renderIndex(manifest, role, documents), 'utf8');
  await writeFile(path.join(packRoot, 'manifest.json'), `${JSON.stringify(subset, null, 2)}\n`, 'utf8');
  await writeFile(path.join(packRoot, 'VERSION.json'), `${JSON.stringify({ packVersion: manifest.packVersion, releaseDate: manifest.releaseDate, role }, null, 2)}\n`, 'utf8');
  await copyFile(resolveInside(repoRoot, installerPath, 'installer path'), path.join(packRoot, 'Install.ps1'));

  const files = (await listFiles(packRoot)).filter((file) => file !== 'checksums.sha256');
  const checksums = [];
  for (const file of files) checksums.push(`${await sha256(path.join(packRoot, file))}  ${file}`);
  await writeFile(path.join(packRoot, 'checksums.sha256'), `${checksums.join('\n')}\n`, 'utf8');
  await validatePackDirectory(packRoot);
  return packRoot;
}

export async function validatePackDirectory(packRoot) {
  const lines = (await readFile(path.join(packRoot, 'checksums.sha256'), 'utf8')).trim().split('\n').filter(Boolean);
  assert(lines.length > 0, 'checksums.sha256 is empty');
  for (const line of lines) {
    const match = /^([a-f0-9]{64}) {2}(.+)$/.exec(line);
    assert(match, `Invalid checksum line: ${line}`);
    const filePath = resolveInside(packRoot, match[2], 'checksum file');
    assert((await sha256(filePath)) === match[1], `Checksum mismatch: ${match[2]}`);
  }
  for (const relativePath of (await listFiles(packRoot)).filter((file) => file.endsWith('.html'))) {
    const html = await readFile(path.join(packRoot, relativePath), 'utf8');
    for (const tag of html.matchAll(/<([a-zA-Z][\w:-]*)\b[^>]*>/g)) {
      const attributes = parseTagAttributes(tag[0]);
      for (const attribute of ['href', 'src', 'data']) {
        const value = attributes.get(attribute);
        if (!value || isIgnoredReference(value) || isRemote(value)) continue;
        assert(!/^(?:file|javascript):/i.test(value), `${relativePath} contains unsafe ${attribute}`);
        const targetPart = referencePath(value);
        const relativeTarget = path.posix.normalize(path.posix.join(path.posix.dirname(relativePath), targetPart));
        await stat(resolveInside(packRoot, relativeTarget, `${relativePath} ${attribute}`));
      }
    }
  }
  return true;
}

async function main() {
  const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const args = process.argv.slice(2);
  const manifest = await loadAndValidateManifest(repoRoot);
  if (args.includes('--validate')) {
    console.log(`Learning Hub manifest valid: ${manifest.documents.length} documents`);
    return;
  }
  const roleIndex = args.indexOf('--role');
  const requestedRole = roleIndex >= 0 ? args[roleIndex + 1] : 'all';
  const roles = requestedRole === 'all' ? AUDIENCE_ROLES : [requestedRole];
  for (const role of roles) {
    const output = await buildRolePack({ repoRoot, manifest, role });
    console.log(`Built ${role}: ${path.relative(repoRoot, output)}`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
