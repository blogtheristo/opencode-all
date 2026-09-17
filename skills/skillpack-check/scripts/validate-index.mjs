#!/usr/bin/env node
// skillpack-check / validate-index.mjs
// Verifies four invariants:
//   1. Every skills/<name>/SKILL.md (or Risto_Skills.md) parses as YAML frontmatter
//      and has at minimum `name` + `description`.
//   2. Every skill folder name appears in docs/DWS_SKILLS_GUIDE.md.
//   3. Every skill folder name appears in AGENTS.md.
//   4. Any skill whose text carries a "Based on"/"Adapted from" external
//      attribution also carries a "Source pin:" line (repo + version/state +
//      observed date) — see docs/field-notes/2026-08-20-external-skill-provenance-audit.md
//      Finding 1. Prevents provenance rotting silently after import.
//
// Flags: --json (machine-readable), --fix (append missing rows to registries).
// Exit code: 0 if all invariants hold, non-zero otherwise.

import { readFileSync, readdirSync, statSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..', '..', '..');
const SKILLS_DIR = join(REPO_ROOT, 'skills');
const GUIDE_PATH = join(REPO_ROOT, 'docs', 'DWS_SKILLS_GUIDE.md');
const AGENTS_PATH = join(REPO_ROOT, 'AGENTS.md');

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const fix = args.includes('--fix');

function listSkillFolders() {
  return readdirSync(SKILLS_DIR)
    .filter((name) => {
      const p = join(SKILLS_DIR, name);
      if (!statSync(p).isDirectory()) return false;
      // skill folder must contain SKILL.md OR Risto_Skills.md
      try {
        const entries = readdirSync(p);
        return entries.includes('SKILL.md') || entries.includes('Risto_Skills.md');
      } catch {
        return false;
      }
    })
    .sort();
}

function parseFrontmatter(text) {
  // Minimal YAML frontmatter parser: extract the first --- ... --- block,
  // pull `name:` and `description:` (multiline `>` supported).
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const body = match[1];
  const out = {};
  const lines = body.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let value = m[2];
    if (value === '>' || value === '|') {
      const buf = [];
      i++;
      while (i < lines.length && /^\s+/.test(lines[i])) {
        buf.push(lines[i].trim());
        i++;
      }
      i--;
      value = buf.join(' ');
    }
    out[key] = value.replace(/^["']|["']$/g, '');
  }
  return out;
}

function loadSkillFrontmatter(folder) {
  const p1 = join(SKILLS_DIR, folder, 'SKILL.md');
  const p2 = join(SKILLS_DIR, folder, 'Risto_Skills.md');
  let path;
  try {
    statSync(p1);
    path = p1;
  } catch {
    path = p2;
  }
  const text = readFileSync(path, 'utf-8');
  return { path, fm: parseFrontmatter(text) };
}

function fileContains(path, needle) {
  try {
    const text = readFileSync(path, 'utf-8');
    // Match skill name in backticks (registry table format) or as markdown link target
    // This prevents false positives from generic words like "query", "reports", "maintain"
    const pattern = new RegExp(`\`${needle}\`|/${needle}/`);
    return pattern.test(text);
  } catch {
    return false;
  }
}

const skills = listSkillFolders();
const rows = [];
let errors = 0;

function hasExternalAttribution(text) {
  return /Based on `[^`]+` in gbrain by Garry Tan|Adapted from \[/.test(text);
}

function hasSourcePin(text) {
  return /\*\*Source pin:\*\*/.test(text);
}

for (const folder of skills) {
  const { fm, path } = loadSkillFrontmatter(folder);
  const fmOk = fm && fm.name && fm.description;
  const inGuide = fileContains(GUIDE_PATH, folder);
  const inAgents = fileContains(AGENTS_PATH, folder);
  const text = readFileSync(path, 'utf-8');
  const needsPin = hasExternalAttribution(text);
  const pinOk = !needsPin || hasSourcePin(text);
  const ok = fmOk && inGuide && inAgents && pinOk;
  if (!ok) errors++;
  rows.push({
    skill: folder,
    fmOk: !!fmOk,
    inGuide,
    inAgents,
    pinOk,
    needsPin,
    path,
  });
}

if (fix) {
  // Append a registry block to each file if any skill is missing — minimal,
  // user must still flesh out the description.
  const missingGuide = rows.filter((r) => !r.inGuide).map((r) => r.skill);
  const missingAgents = rows.filter((r) => !r.inAgents).map((r) => r.skill);
  if (missingGuide.length) {
    const block =
      '\n\n<!-- skillpack-check --fix appended ' +
      new Date().toISOString() +
      ' -->\n' +
      missingGuide.map((s) => `- \`${s}\` — see skills/${s}/SKILL.md`).join('\n') +
      '\n';
    appendFileSync(GUIDE_PATH, block);
  }
  if (missingAgents.length) {
    const block =
      '\n\n<!-- skillpack-check --fix appended ' +
      new Date().toISOString() +
      ' -->\n' +
      missingAgents.map((s) => `- \`${s}\` — see skills/${s}/SKILL.md`).join('\n') +
      '\n';
    appendFileSync(AGENTS_PATH, block);
  }
}

if (asJson) {
  process.stdout.write(JSON.stringify({ total: skills.length, errors, rows }, null, 2) + '\n');
} else {
  for (const r of rows) {
    const status = r.fmOk && r.inGuide && r.inAgents && r.pinOk ? 'OK  ' : 'FAIL';
    const guide = r.inGuide ? 'guide=yes' : 'guide=NO ';
    const agents = r.inAgents ? 'agents=yes' : 'agents=NO ';
    const fmflag = r.fmOk ? 'fm=yes' : 'fm=NO ';
    const pin = r.needsPin ? (r.pinOk ? 'pin=yes' : 'pin=NO ') : 'pin=n/a';
    process.stdout.write(
      `${status} ${r.skill.padEnd(24)} ${fmflag}  ${guide}  ${agents}  ${pin}\n`,
    );
  }
  process.stdout.write(`---\n${skills.length} skills, ${errors} errors\n`);
}

process.exit(errors === 0 ? 0 : 1);
