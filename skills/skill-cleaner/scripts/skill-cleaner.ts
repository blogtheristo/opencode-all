#!/usr/bin/env node
// skill-cleaner.ts — audit DWS6 skill description budget.
// Run: node --experimental-strip-types skills/skill-cleaner/scripts/skill-cleaner.ts

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

type Args = { contextTokens: number; budgetPct: number; roots: string[] };

function parseArgs(argv: string[]): Args {
  const out: Args = { contextTokens: 272_000, budgetPct: 2, roots: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--context-tokens") out.contextTokens = Number(argv[++i]);
    else if (a === "--budget-percent") out.budgetPct = Number(argv[++i]);
    else if (a === "--root") out.roots.push(argv[++i]);
  }
  if (out.roots.length === 0) out.roots = ["skills"];
  return out;
}

function tokenCost(s: string): number {
  return Math.ceil(Buffer.byteLength(s, "utf8") / 4);
}

function parseFrontmatter(text: string): Record<string, string> {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  const lines = m[1].split("\n");
  let key = "";
  let folded = false;
  let buf: string[] = [];
  const flush = () => {
    if (key) out[key] = buf.join(" ").trim().replace(/^"|"$/g, "");
    buf = [];
    folded = false;
  };
  for (const ln of lines) {
    const top = ln.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (top && !ln.startsWith(" ")) {
      flush();
      key = top[1];
      const val = top[2];
      if (val === ">" || val === "|") folded = true;
      else if (val) {
        buf.push(val);
        flush();
        key = "";
      }
    } else if (folded && /^\s+/.test(ln)) {
      buf.push(ln.trim());
    }
  }
  flush();
  return out;
}

function countTriggers(desc: string): number {
  const m = desc.match(/Use when:?(.*)/i);
  if (!m) return 0;
  const tail = m[1];
  const quoted = tail.match(/"[^"]+"/g);
  if (quoted) return quoted.length;
  return tail.split(/,|;/).filter((s) => s.trim().length > 2).length;
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

type Row = {
  name: string;
  path: string;
  words: number;
  chars: number;
  tokens: number;
  triggers: number;
  flags: string[];
  desc: string;
};

function audit(root: string): Row[] {
  const rows: Row[] = [];
  let dirs: string[] = [];
  try {
    dirs = readdirSync(root);
  } catch {
    return rows;
  }
  for (const d of dirs) {
    const full = join(root, d);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (!st.isDirectory()) continue;
    const p = join(full, "SKILL.md");
    let text: string;
    try {
      text = readFileSync(p, "utf8");
    } catch {
      continue;
    }
    const fm = parseFrontmatter(text);
    const desc = fm.description ?? "";
    if (!desc) continue;
    const words = wordCount(desc);
    const chars = desc.length;
    const tokens = tokenCost(desc);
    const triggers = countTriggers(desc);
    const flags: string[] = [];
    if (words > 60) flags.push("WORDS>60");
    if (chars > 400) flags.push("CHARS>400");
    if (tokens > 100) flags.push("TOKENS>100");
    if (triggers > 6) flags.push(`TRIGGERS=${triggers}`);
    if (/EXPERIMENTAL|DEPRECATED|status:|version|NOT yet/i.test(desc)) flags.push("STATUS-BANNER");
    if (/Load this skill|This skill is|in order to|expertise packag/i.test(desc)) flags.push("PROSE");
    rows.push({ name: d, path: p, words, chars, tokens, triggers, flags, desc });
  }
  return rows;
}

const args = parseArgs(process.argv.slice(2));
const budget = Math.floor((args.contextTokens * args.budgetPct) / 100);
const allRows: Row[] = [];
for (const r of args.roots) allRows.push(...audit(r));
allRows.sort((a, b) => b.tokens - a.tokens);
const total = allRows.reduce((s, r) => s + r.tokens, 0);
const offenders = allRows.filter((r) => r.flags.length > 0);

console.log("# DWS6 skill-cleaner audit");
console.log(
  `context_tokens=${args.contextTokens} budget_pct=${args.budgetPct} budget=${budget}t used=${total}t (${((total * 100) / budget).toFixed(1)}%)`,
);
console.log("");
console.log("## All skills (by token cost)");
console.log("| skill | words | chars | tokens | triggers | flags |");
console.log("|-------|------:|------:|-------:|---------:|-------|");
for (const r of allRows) {
  console.log(`| ${r.name} | ${r.words} | ${r.chars} | ${r.tokens} | ${r.triggers} | ${r.flags.join(", ")} |`);
}

if (offenders.length > 0) {
  console.log("");
  console.log("## Offenders (excerpt)");
  for (const r of offenders) {
    console.log(`### ${r.name} — ${r.flags.join(", ")}`);
    console.log("```");
    console.log(r.desc.slice(0, 220) + (r.desc.length > 220 ? "…" : ""));
    console.log("```");
  }
}
