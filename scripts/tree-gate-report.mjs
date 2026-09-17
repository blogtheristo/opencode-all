#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-10
// Audit trail: git log -- scripts/tree-gate-report.mjs
/**
 * CI-side result reader for scripts/poisoned-tree-gate.mjs.
 *
 * The gate prints a JSON ARRAY of `{ref, decision}` to stdout, its reasons to
 * stderr, and exits 0 (allow) / 1 (block) / 2 (usage error). The previous
 * workflow read `.decision` off that array with `jq`, which is always null, and
 * then rendered a null decision as "_No violations detected._" — so a gate that
 * exited 2 before running a single check still commented reassurance on the PR.
 *
 * This reader exists so that failure to run is a distinct, loud outcome:
 *
 *   allow  — the gate executed and cleared every pushed ref
 *   block  — the gate executed and blocked at least one ref
 *   error  — the gate did not produce a usable verdict (fail closed)
 *
 * "error" covers: exit 2, unparseable or absent stdout, output that is not an
 * array of decisions, the expected ref missing from the results, and any
 * disagreement between the exit code and the parsed decisions. None of those
 * may ever render as an allow.
 *
 * Usage:
 *   node scripts/tree-gate-report.mjs --result <file> --exit-code <n> \
 *     --expected-ref <ref> [--reasons <file>] [--github-output <file>]
 *
 * Exit codes: 0 = allow, 1 = block, 2 = error. Mirrors the gate itself.
 */

import { existsSync, readFileSync, appendFileSync } from 'node:fs';

/**
 * @returns {{decision:'allow'|'block'|'error', reasons:string[], refs:object[]}}
 */
export function interpret({ exitCode, stdout, expectedRef, stderr = '' }) {
  const reasons = String(stderr)
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (exitCode === 2) {
    return {
      decision: 'error',
      refs: [],
      reasons: reasons.length
        ? reasons
        : ['gate exited 2 (usage error) — it did not execute any check'],
    };
  }
  if (exitCode !== 0 && exitCode !== 1) {
    return {
      decision: 'error',
      refs: [],
      reasons: [
        ...reasons,
        `gate exited ${exitCode} — unexpected exit code, treating as failure to execute`,
      ],
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    return {
      decision: 'error',
      refs: [],
      reasons: [...reasons, 'gate stdout is not valid JSON — no verdict available'],
    };
  }
  if (!Array.isArray(parsed)) {
    return {
      decision: 'error',
      refs: [],
      reasons: [...reasons, 'gate stdout is not an array of ref decisions'],
    };
  }
  if (parsed.length === 0) {
    return {
      decision: 'error',
      refs: [],
      reasons: [...reasons, 'gate returned no ref decisions — nothing was evaluated'],
    };
  }
  for (const r of parsed) {
    if (!r || typeof r.ref !== 'string' || (r.decision !== 'allow' && r.decision !== 'block')) {
      return {
        decision: 'error',
        refs: parsed,
        reasons: [...reasons, `gate returned a malformed ref decision: ${JSON.stringify(r)}`],
      };
    }
  }
  if (expectedRef && !parsed.some((r) => r.ref === expectedRef)) {
    return {
      decision: 'error',
      refs: parsed,
      reasons: [...reasons, `gate did not evaluate the expected ref ${expectedRef}`],
    };
  }

  const blocked = parsed.filter((r) => r.decision === 'block');
  // The gate sets exit 1 iff it blocked something. A mismatch means we are not
  // reading the run we think we are; never resolve that in favour of allow.
  if (blocked.length > 0 && exitCode !== 1) {
    return {
      decision: 'error',
      refs: parsed,
      reasons: [...reasons, 'gate reported a block but exited 0 — inconsistent result'],
    };
  }
  if (blocked.length === 0 && exitCode !== 0) {
    return {
      decision: 'error',
      refs: parsed,
      reasons: [...reasons, 'gate exited 1 but reported no blocked ref — inconsistent result'],
    };
  }
  if (blocked.length > 0) {
    return { decision: 'block', refs: parsed, reasons };
  }
  return { decision: 'allow', refs: parsed, reasons };
}

/** PR comment body. An unexecuted gate never renders as "no violations". */
export function renderComment({ decision, reasons, refs }) {
  const heading = {
    allow: '### Tree Gate: ALLOW',
    block: '### Tree Gate: BLOCK',
    error: '### Tree Gate: ERROR — the gate did not execute',
  }[decision];

  const body = [heading, ''];
  if (decision === 'allow') {
    body.push(`Evaluated ${refs.length} ref(s); no violation found.`);
    if (reasons.length) body.push('', '```', ...reasons, '```');
  } else if (decision === 'block') {
    body.push('The gate ran and blocked this push:', '', '```', ...reasons, '```');
  } else {
    body.push(
      'No verdict was produced, so **this is not a clean result** — treat it as unverified.',
      '',
      '```',
      ...(reasons.length ? reasons : ['(no diagnostic output)']),
      '```',
    );
  }
  return body.join('\n');
}

export function main(argv) {
  // A flag in final position, or one immediately followed by another flag, has
  // no value. Returning `undefined` there slipped past the `=== null` usage
  // check and surfaced as "gate exited NaN" instead of a usage error — this
  // script's whole job is to make a non-verdict legible, so it must not garble
  // its own.
  const get = (flag) => {
    const i = argv.indexOf(flag);
    if (i === -1 || i + 1 >= argv.length) return null;
    const value = argv[i + 1];
    return value.startsWith('--') ? null : value;
  };
  const resultPath = get('--result');
  const exitCodeRaw = get('--exit-code');
  const expectedRef = get('--expected-ref');
  const reasonsPath = get('--reasons');
  const githubOutput = get('--github-output') ?? process.env.GITHUB_OUTPUT;

  if (!resultPath || exitCodeRaw === null || !Number.isInteger(Number(exitCodeRaw))) {
    console.error(
      'tree-gate-report: usage --result <file> --exit-code <n> [--expected-ref <ref>] [--reasons <file>]',
    );
    process.exitCode = 2;
    return;
  }

  const stdout = existsSync(resultPath) ? readFileSync(resultPath, 'utf8') : '';
  const stderr = reasonsPath && existsSync(reasonsPath) ? readFileSync(reasonsPath, 'utf8') : '';
  if (!existsSync(resultPath)) {
    // Missing result file is itself an error condition; interpret() sees empty
    // stdout and fails closed, but say plainly why.
    console.error(`tree-gate-report: result file ${resultPath} does not exist`);
  }

  const res = interpret({ exitCode: Number(exitCodeRaw), stdout, expectedRef, stderr });
  const comment = renderComment(res);
  console.log(comment);

  if (githubOutput) {
    const delim = `TREEGATE_${Date.now()}`;
    appendFileSync(
      githubOutput,
      `decision=${res.decision}\ncomment<<${delim}\n${comment}\n${delim}\n`,
    );
  }
  process.exitCode = { allow: 0, block: 1, error: 2 }[res.decision];
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop())) {
  main(process.argv.slice(2));
}
