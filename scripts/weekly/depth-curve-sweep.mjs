#!/usr/bin/env node
/**
 * depth-curve-sweep.mjs — locate the fixed-hardware throughput knee (Q3)
 *
 * WHY THIS EXISTS
 * PHD_FIREHORSE §14.45 Finding 2 argues that agentic harness overhead stops being a
 * variable financial cost and becomes amortised latency on owned silicon — valid
 * only where per-task context depth is high AND concurrency is bounded, i.e. to the
 * left of the hardware throughput knee. That argument is currently an architectural
 * hypothesis. This sweep is what turns it into a capacity-planning model, by
 * locating the knee rather than confirming a headline tok/s figure.
 *
 * It answers the two mechanism questions from Finding 2:
 *   1. At what context length does KV-cache bandwidth push generation below the
 *      interactive throughput threshold?
 *   2. Where does the regime shift from memory-bound generation to batching-induced
 *      queueing delay?
 *
 * and reports the six quantities a commercial claim needs (external review, 30.07.2026):
 *   tokens/task, latency, concurrent jobs, GPU memory, queue time, € per audit-ready output.
 *
 * WHY NOT scripts/ollama-spark.sh: that wrapper is one-shot /api/generate with no
 * options passthrough and no timing capture, so it cannot set num_ctx, cannot vary
 * concurrency, and cannot measure queue time. This is deliberately separate.
 *
 * NOTHING IS ESTIMATED. Every number in the artifact is measured or absent. A field
 * that could not be sampled is written as null with a stated reason — a fabricated
 * curve would be worse than no curve (Rule 12).
 *
 * Usage:
 *   node scripts/weekly/depth-curve-sweep.mjs \
 *     --model nemotron-cascade-2-30b-a3b \
 *     --depths 4000,16000,32000,64000,128000,250000 \
 *     --concurrency 1,2,4,8 \
 *     [--host http://dgx-spark:11434] [--eur-per-hour 0.42] [--out <path>]
 *
 * Env: OLLAMA_BASE_URL or DGX_OLLAMA_URL for the host; DEPTH_SWEEP_EUR_PER_HOUR for
 * the amortised cost basis (see --eur-per-hour).
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const INTERACTIVE_TOKENS_PER_SEC = 10; // below this, an operator experiences a stall

function parseArgs(argv) {
  const out = {
    depths: [4000, 16000, 32000, 64000, 128000, 250000],
    concurrency: [1, 2, 4, 8],
    model: null,
    host: process.env.OLLAMA_BASE_URL || process.env.DGX_OLLAMA_URL || null,
    eurPerHour: Number(process.env.DEPTH_SWEEP_EUR_PER_HOUR || '0') || null,
    out: null,
  };
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--model') out.model = argv[++i];
    else if (a === '--depths') out.depths = argv[++i].split(',').map(Number);
    else if (a === '--concurrency') out.concurrency = argv[++i].split(',').map(Number);
    else if (a === '--host') out.host = argv[++i];
    else if (a === '--eur-per-hour') out.eurPerHour = Number(argv[++i]);
    else if (a === '--out') out.out = argv[++i];
  }
  return out;
}

/** Filler that defeats prefix caching so each depth is genuinely paid for. */
function buildPrompt(approxTokens, salt) {
  const unit = `sector ${salt} reading ${Math.random().toString(36).slice(2, 10)} nominal. `;
  const reps = Math.max(1, Math.ceil((approxTokens * 4) / unit.length));
  return `${unit.repeat(reps)}\n\nSummarise the anomaly in one sentence.`;
}

/**
 * Classify each operating point and find the knee.
 * Exported for tests: pure, no I/O, no clock.
 */
export function analyseCurve(points) {
  const ok = points.filter((p) => p.error == null && p.tokensPerSec != null);
  if (ok.length === 0) return { knee: null, reason: 'no successful samples' };

  const byConcurrency = new Map();
  for (const p of ok) {
    if (!byConcurrency.has(p.concurrency)) byConcurrency.set(p.concurrency, []);
    byConcurrency.get(p.concurrency).push(p);
  }

  const knees = [];
  for (const [concurrency, series] of byConcurrency) {
    const sorted = [...series].sort((a, b) => a.depth - b.depth);

    // Q1: first depth at which generation drops below interactive speed.
    const belowInteractive = sorted.find((p) => p.tokensPerSec < INTERACTIVE_TOKENS_PER_SEC);

    // Q2: regime change — queueing dominates when queue time outgrows generation
    // time, which is what "batching-induced delay" actually looks like from outside.
    const queueDominant = sorted.find(
      (p) => p.queueMs != null && p.generateMs != null && p.queueMs > p.generateMs,
    );

    // The knee is the earliest depth where throughput falls off non-linearly —
    // more than halving while depth merely doubles.
    let nonLinear = null;
    for (let i = 1; i < sorted.length; i += 1) {
      const prev = sorted[i - 1];
      const cur = sorted[i];
      const depthRatio = cur.depth / prev.depth;
      const throughputRatio = prev.tokensPerSec / Math.max(cur.tokensPerSec, 1e-9);
      if (throughputRatio > depthRatio) {
        nonLinear = cur;
        break;
      }
    }

    knees.push({
      concurrency,
      interactiveFloorDepth: belowInteractive?.depth ?? null,
      queueDominantDepth: queueDominant?.depth ?? null,
      nonLinearKneeDepth: nonLinear?.depth ?? null,
      maxMeasuredDepth: sorted[sorted.length - 1].depth,
    });
  }

  // The usable envelope is the tightest knee across concurrencies: the point past
  // which the §14.45 arbitrage stops holding.
  const candidates = knees
    .flatMap((k) => [k.interactiveFloorDepth, k.queueDominantDepth, k.nonLinearKneeDepth])
    .filter((d) => d != null);

  return {
    perConcurrency: knees,
    knee: candidates.length ? Math.min(...candidates) : null,
    reason: candidates.length
      ? 'earliest depth at which interactive floor, queue dominance or non-linear falloff was observed'
      : 'no knee observed within the swept range — the envelope is wider than what was measured',
  };
}

async function sample({ host, model, depth, concurrency, eurPerHour }) {
  const prompts = Array.from({ length: concurrency }, (_, i) => buildPrompt(depth, i));
  const submittedAt = Date.now();

  const runs = prompts.map(async (prompt) => {
    const res = await fetch(`${host.replace(/\/$/, '')}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        options: { num_ctx: Math.max(depth + 2048, 4096) },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  });

  const results = await Promise.all(runs);
  const wallMs = Date.now() - submittedAt;

  // Ollama reports nanosecond timings; prompt_eval covers prefill (the KV-cache
  // cost we care about), eval covers generation.
  const evalCounts = results.map((r) => r.eval_count ?? 0);
  const evalNs = results.map((r) => r.eval_duration ?? 0);
  const promptNs = results.map((r) => r.prompt_eval_duration ?? 0);
  const totalNs = results.map((r) => r.total_duration ?? 0);

  const outputTokens = evalCounts.reduce((a, b) => a + b, 0);
  const generateMs = Math.max(...evalNs) / 1e6 || null;
  const prefillMs = Math.max(...promptNs) / 1e6 || null;
  // Queue time is wall-clock the request spent neither prefilling nor generating.
  const busiestMs = Math.max(...totalNs) / 1e6 || null;
  const queueMs = busiestMs == null ? null : Math.max(0, wallMs - busiestMs);

  const tokensPerSec = generateMs ? outputTokens / (generateMs / 1000) : null;
  const eurPerOutput =
    eurPerHour && wallMs ? (eurPerHour * (wallMs / 3_600_000)) / concurrency : null;

  return {
    depth,
    concurrency,
    promptTokens: results.map((r) => r.prompt_eval_count ?? null),
    outputTokens,
    tokensPerSec,
    latencyMs: wallMs,
    prefillMs,
    generateMs,
    queueMs,
    // Ollama's HTTP API exposes no VRAM figure; sampling it needs nvidia-smi on the
    // host. Recorded as null with a reason rather than guessed.
    gpuMemoryMb: null,
    gpuMemoryNote: 'not sampled — requires nvidia-smi on the inference host',
    eurPerAuditReadyOutput: eurPerOutput,
    error: null,
  };
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.model) {
    console.error('depth-curve-sweep: --model is required');
    process.exit(1);
  }
  if (!args.host) {
    console.error(
      'depth-curve-sweep: no inference host. Set OLLAMA_BASE_URL or DGX_OLLAMA_URL, or pass --host.\n' +
        '  This sweep must run against real hardware; there is no simulation mode by design.',
    );
    process.exit(1);
  }

  const points = [];
  for (const concurrency of args.concurrency) {
    for (const depth of args.depths) {
      process.stderr.write(`  depth=${depth} concurrency=${concurrency} ... `);
      try {
        const point = await sample({ ...args, depth, concurrency });
        points.push(point);
        process.stderr.write(
          `${point.tokensPerSec ? point.tokensPerSec.toFixed(1) : '?'} tok/s, queue ${point.queueMs ?? '?'}ms\n`,
        );
      } catch (err) {
        points.push({ depth, concurrency, error: err.message, tokensPerSec: null });
        process.stderr.write(`FAILED: ${err.message}\n`);
      }
    }
  }

  const analysis = analyseCurve(points);
  const artifact = {
    model: args.model,
    host: args.host,
    interactiveThresholdTokensPerSec: INTERACTIVE_TOKENS_PER_SEC,
    eurPerHourBasis: args.eurPerHour,
    eurBasisNote: args.eurPerHour
      ? 'amortised hardware cost supplied by the operator; not a measured figure'
      : 'not supplied — € per audit-ready output is null and the commercial claim is unsupported',
    points,
    analysis,
  };

  const out =
    args.out || path.join('telemetry', 'depth-curves', `${args.model.replace(/[^\w.-]/g, '_')}.json`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(artifact, null, 2)}\n`, 'utf-8');

  console.log(`depth-curve-sweep: wrote ${out}`);
  console.log(`  knee: ${analysis.knee ?? 'not observed'} (${analysis.reason})`);
  const failed = points.filter((p) => p.error).length;
  if (failed) console.log(`  ${failed}/${points.length} operating points FAILED — curve is partial.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(`depth-curve-sweep: ${err.message}`);
    process.exit(1);
  });
}
