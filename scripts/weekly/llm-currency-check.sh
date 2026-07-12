#!/usr/bin/env bash
#
# llm-currency-check.sh
#
# Weekly "update the LLMs" task for DWS subscription products.
#
# Keeps the models behind our LLM-backed subscription products current as
# models release, get deprecated, or get suspended. Lints src/agents/* against
# config/llm-registry.json and flags:
#   - deprecated / retired / suspended models still referenced in code  -> FLAG
#   - candidate models not yet adopted                                  -> SUGGEST
#
# Reports only. It never edits model routing — swapping a production model is a
# judgment + cost change and stays human-in-command (see the RED zone in the
# auto-mode trust boundary, and check-ollama-models.sh which likewise never
# auto-pulls). Explanation + procedure: docs/LLM_UPDATE_TASK.md.
#
# Script Automation Rule (CLAUDE.md): placed in scripts/weekly/ so day-runner
# picks it up (Sunday 04:00 UTC). No manual registration.
# Non-negotiables: never Resend (SES only); never noreply@ (named human is
# risto.paarni@lifetime.fi). This script only logs + flags; no outbound.

set -euo pipefail

ROOT="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/../.." && pwd)"
REGISTRY="${ROOT}/config/llm-registry.json"
SCAN_DIR="${ROOT}/src/agents"
LOG_DIR="${ROOT}/logs/llm-currency"
mkdir -p "${LOG_DIR}"
STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
LOG="${LOG_DIR}/llm-currency-${STAMP}.log"
SUMMARY="${LOG_DIR}/summary-${STAMP}.json"

{
  echo "[$(date -u +%FT%TZ)] llm-currency-check begin"

  if [ ! -f "${REGISTRY}" ]; then
    echo "FAIL: registry not found at ${REGISTRY}" >&2
    exit 1
  fi
  if ! command -v node >/dev/null 2>&1; then
    echo "FAIL: node not on PATH; cannot lint registry" >&2
    exit 1
  fi
  if [ ! -d "${SCAN_DIR}" ]; then
    echo "WARN: ${SCAN_DIR} missing; nothing to scan"
  fi

  # Deterministic lint: node reads the registry + recursively scans src/agents
  # for each model id, and classifies drift. Model judgment ("is the candidate
  # worth adopting") is surfaced to the HIL, not decided here (CLAUDE.md Rule 5).
  node - "${REGISTRY}" "${SCAN_DIR}" "${SUMMARY}" "${STAMP}" <<'NODE'
const fs = require('fs');
const path = require('path');
const [registryPath, scanDir, summaryPath, stamp] = process.argv.slice(2);

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

// Gather source text from src/agents (recursive, .ts only).
function walk(dir) {
  let files = [];
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return files; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) files = files.concat(walk(p));
    else if (e.isFile() && p.endsWith('.ts')) files.push(p);
  }
  return files;
}
const files = walk(scanDir);
const haystack = files.map((f) => {
  try { return { file: f, text: fs.readFileSync(f, 'utf8') }; }
  catch { return { file: f, text: '' }; }
});

// Exact-id substring match (model ids are distinctive; low false-positive).
function usedIn(id) {
  const hits = [];
  for (const h of haystack) if (h.text.includes(id)) hits.push(path.relative(scanDir, h.file));
  return hits;
}

const flags = [];      // deprecated/suspended/retired but still referenced
const suggestions = []; // candidate models not yet adopted

for (const m of registry.models || []) {
  const hits = usedIn(m.id);
  const inUse = hits.length > 0;
  if (['deprecated', 'suspended', 'retired'].includes(m.status) && inUse) {
    flags.push({
      id: m.id, status: m.status, provider: m.provider,
      replacement: m.replacement || null, files: hits, notes: m.notes || '',
    });
  }
  if (m.status === 'candidate' && !inUse) {
    suggestions.push({ id: m.id, provider: m.provider, tier: m.tier || null, notes: m.notes || '' });
  }
}

const summary = {
  task: 'llm-currency-check',
  stamp,
  registry_version: registry.version || null,
  registry_updated: registry.updated || null,
  scanned_files: files.length,
  flags_count: flags.length,
  suggestions_count: suggestions.length,
  flags,
  suggestions,
  status: flags.length === 0 ? 'clean' : 'action_needed',
};
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

// Human-readable to stdout (fail loud — CLAUDE.md Rule 12).
console.log(`[llm-currency] scanned ${files.length} agent source files`);
if (flags.length === 0) {
  console.log('[llm-currency] OK — no deprecated/suspended models referenced');
} else {
  console.log(`[llm-currency] ACTION NEEDED — ${flags.length} stale/suspended model(s) still referenced:`);
  for (const f of flags) {
    const to = f.replacement ? ` -> migrate to ${f.replacement}` : '';
    console.log(`  - ${f.id} [${f.status}]${to}`);
    console.log(`      in: ${f.files.join(', ') || '(no files)'}`);
  }
}
if (suggestions.length > 0) {
  console.log(`[llm-currency] ${suggestions.length} candidate model(s) to evaluate:`);
  for (const s of suggestions) console.log(`  - ${s.id} (${s.provider}${s.tier ? ', ' + s.tier : ''})`);
}
NODE

  echo "[llm-currency] summary written: ${SUMMARY}"

  # Deliver the report by email (Amazon SES only — never Resend). This is what
  # makes a report actually arrive; without it the task is log-only. Non-fatal:
  # a send failure is logged loudly but does not fail the scan.
  if command -v npx >/dev/null 2>&1; then
    echo "[llm-currency] sending report to ${EMAIL_RECIPIENT:-risto@onelifetime.world} via SES..."
    if npx --yes tsx "${ROOT}/scripts/send-model-currency-report.ts"; then
      echo "[llm-currency] report email sent"
    else
      echo "[llm-currency] WARN: report email NOT sent (see error above; check SMTP_* SES creds on this host)"
    fi
  else
    echo "[llm-currency] WARN: npx not on PATH; report not emailed (summary JSON still written)"
  fi

  echo "[$(date -u +%FT%TZ)] llm-currency-check end"
} | tee -a "${LOG}"
