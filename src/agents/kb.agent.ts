/**
 * Knowledge Base Agent — DWS IQ 6/7
 *
 * LLM-maintained knowledge base inspired by Karpathy's workflow:
 * raw sources → LLM-compiled wiki → auto-maintained indexes → Q&A.
 *
 * The human dumps raw sources into kb/raw/. The LLM compiles them
 * into a markdown wiki at kb/wiki/ with backlinks, concept articles,
 * and three auto-maintained index files. No vector DB needed — the
 * LLM reads its own indexes and navigates the wiki autonomously.
 *
 * Operations: compile, ask, research, lint, ingest, status
 *
 * Introduced-In: PR-TBD
 * Code-Version: 1.0
 * Branch: claude/llm-knowledge-base-frfcq
 * Date: 2026-04-03
 * Owner: Risto / Claude
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { basename, extname, isAbsolute, join, relative, resolve } from 'path';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse, ToolDefinition } from './types.js';
import logger from '../utils/logger.js';

// ============ CONSTANTS ============

const KB_ROOT = resolve(process.cwd(), 'kb');
const RAW_DIR = join(KB_ROOT, 'raw');
const WIKI_DIR = join(KB_ROOT, 'wiki');
const EPHEMERAL_DIR = join(KB_ROOT, 'ephemeral');
const KB_JSON = join(KB_ROOT, 'kb.json');

// ============ KB TOOL DEFINITIONS ============

export const KB_TOOLS: ToolDefinition[] = [
  {
    name: 'kb_list_raw',
    description:
      'List all files in kb/raw/ with their paths, sizes, and modification timestamps. Use to discover raw sources that need compilation.',
    parameters: {
      type: 'object',
      properties: {
        subdirectory: {
          type: 'string',
          description: 'Subdirectory within raw/ to list (articles, repos, images, signals). Omit to list all.',
        },
      },
    },
  },
  {
    name: 'kb_read_file',
    description:
      'Read any file within the kb/ directory tree. Use to read raw sources, wiki articles, or index files.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative path from kb/ (e.g., "raw/articles/paper.md", "wiki/_index.md", "wiki/concepts/CBAM.md")',
        },
      },
      required: ['path'],
    },
  },
  {
    name: 'kb_write_article',
    description:
      'Write or update a markdown file in kb/wiki/. Creates parent directories if needed. Use for summaries, concepts, entities, reports, and index files.',
    parameters: {
      type: 'object',
      properties: {
        path: {
          type: 'string',
          description: 'Relative path from kb/wiki/ (e.g., "concepts/CBAM.md", "summaries/paper-2026.md", "_index.md")',
        },
        content: {
          type: 'string',
          description: 'Full markdown content to write',
        },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'kb_list_wiki',
    description:
      'List all files in kb/wiki/ with their paths, sizes, and modification timestamps. Use to see what articles exist.',
    parameters: {
      type: 'object',
      properties: {
        subdirectory: {
          type: 'string',
          description: 'Subdirectory within wiki/ to list (concepts, entities, summaries, reports, slides). Omit to list all.',
        },
      },
    },
  },
  {
    name: 'kb_update_metadata',
    description:
      'Update the kb.json metadata file with current statistics. Call after compile or lint operations.',
    parameters: {
      type: 'object',
      properties: {
        articleCount: { type: 'number', description: 'Total wiki articles' },
        rawCount: { type: 'number', description: 'Total raw sources' },
        healthScore: { type: 'number', description: 'Health score 0-100 from lint' },
        topics: {
          type: 'array',
          items: { type: 'string' },
          description: 'List of topic names',
        },
        lastCompile: { type: 'string', description: 'ISO timestamp of last compile' },
        lastLint: { type: 'string', description: 'ISO timestamp of last lint' },
      },
    },
  },
];

// ============ KB TOOL HANDLERS ============

function listDirectory(dir: string): Array<{ path: string; size: number; modified: string }> {
  if (!existsSync(dir)) return [];
  const results: Array<{ path: string; size: number; modified: string }> = [];

  function walk(currentDir: string): void {
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.name === '.gitkeep') continue;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const stat = statSync(fullPath);
        results.push({
          path: relative(KB_ROOT, fullPath),
          size: stat.size,
          modified: stat.mtime.toISOString(),
        });
      }
    }
  }

  walk(dir);
  return results;
}

function resolveWithin(baseDir: string, targetPath?: string): string | null {
  const resolved = targetPath ? resolve(baseDir, targetPath) : resolve(baseDir);
  const rel = relative(baseDir, resolved);

  if (rel.startsWith('..') || isAbsolute(rel)) {
    return null;
  }

  return resolved;
}

export async function registerKBToolHandlers(): Promise<void> {
  // Lazy import to avoid circular dependency
  const { registerToolHandler } = await import('./tools.js');

  registerToolHandler('kb_list_raw', async (args: Record<string, unknown>) => {
    const subdir = args.subdirectory as string | undefined;
    const dir = resolveWithin(RAW_DIR, subdir);
    if (!dir) {
      return { error: 'Path traversal not allowed — can only list kb/raw/' };
    }
    return { files: listDirectory(dir) };
  });

  registerToolHandler('kb_read_file', async (args: Record<string, unknown>) => {
    const filePath = args.path as string;
    const fullPath = resolveWithin(KB_ROOT, filePath);

    // Security: prevent path traversal
    if (!fullPath) {
      return { error: 'Path traversal not allowed' };
    }

    if (!existsSync(fullPath)) {
      return { error: `File not found: ${filePath}` };
    }

    const stat = statSync(fullPath);
    if (stat.size > 500_000) {
      return { error: `File too large (${stat.size} bytes). Max 500KB.` };
    }

    const content = readFileSync(fullPath, 'utf-8');
    return { path: filePath, content, size: stat.size, modified: stat.mtime.toISOString() };
  });

  registerToolHandler('kb_write_article', async (args: Record<string, unknown>) => {
    const filePath = args.path as string;
    const content = args.content as string;
    const fullPath = resolveWithin(WIKI_DIR, filePath);

    // Security: prevent path traversal
    if (!fullPath) {
      return { error: 'Path traversal not allowed — can only write to kb/wiki/' };
    }

    // Ensure parent directory exists
    const parentDir = join(fullPath, '..');
    if (!existsSync(parentDir)) {
      mkdirSync(parentDir, { recursive: true });
    }

    writeFileSync(fullPath, content, 'utf-8');
    logger.info('KB article written', { path: filePath, size: content.length });
    return { written: true, path: filePath, size: content.length };
  });

  registerToolHandler('kb_list_wiki', async (args: Record<string, unknown>) => {
    const subdir = args.subdirectory as string | undefined;
    const dir = resolveWithin(WIKI_DIR, subdir);
    if (!dir) {
      return { error: 'Path traversal not allowed — can only list kb/wiki/' };
    }
    return { files: listDirectory(dir) };
  });

  registerToolHandler('kb_update_metadata', async (args: Record<string, unknown>) => {
    let metadata: Record<string, unknown> = {};
    if (existsSync(KB_JSON)) {
      metadata = JSON.parse(readFileSync(KB_JSON, 'utf-8'));
    }

    // Merge provided fields
    if (args.articleCount !== undefined) metadata.articleCount = args.articleCount;
    if (args.rawCount !== undefined) metadata.rawCount = args.rawCount;
    if (args.healthScore !== undefined) metadata.healthScore = args.healthScore;
    if (args.topics !== undefined) metadata.topics = args.topics;
    if (args.lastCompile !== undefined) metadata.lastCompile = args.lastCompile;
    if (args.lastLint !== undefined) metadata.lastLint = args.lastLint;

    writeFileSync(KB_JSON, JSON.stringify(metadata, null, 2) + '\n', 'utf-8');
    return { updated: true, metadata };
  });

  logger.info('KB tool handlers registered', {
    tools: ['kb_list_raw', 'kb_read_file', 'kb_write_article', 'kb_list_wiki', 'kb_update_metadata'],
  });
}

// ============ SYSTEM PROMPTS ============

const COMPILE_PROMPT = `You are the DWS Knowledge Base compiler. Your job is to compile raw source
materials into a well-organized markdown wiki.

WORKFLOW:
1. Use kb_list_raw to discover all raw sources
2. Use kb_list_wiki to see what's already compiled
3. For each raw source that doesn't have a corresponding summary in wiki/summaries/:
   a. Read it with kb_read_file
   b. Write a summary to wiki/summaries/{slug}.md
   c. Extract key concepts — if a concept doesn't have wiki/concepts/{name}.md, create it
   d. Extract key entities — if an entity doesn't have wiki/entities/{name}.md, create it
4. Add backlinks: when a concept/entity article references another, add [[links]]
5. Regenerate all three index files:
   - wiki/_index.md (master index with all articles, grouped by type, each with 1-line summary)
   - wiki/_index-by-topic.md (articles grouped by topic clusters you decide)
   - wiki/_index-by-date.md (reverse-chronological)
6. Update metadata with kb_update_metadata

ARTICLE FORMAT:
- Use standard markdown with # headers
- First line: # Title
- Include a "Sources" section at bottom linking back to raw/ files
- Use [[Concept Name]] for internal wiki links
- Keep summaries concise (200-500 words)
- Keep concept articles comprehensive but focused (500-2000 words)

INDEX FORMAT for _index.md:
- Group by type: Concepts, Entities, Summaries, Reports
- Each entry: "- [Title](path) — one-line description"
- Include article count and timestamp at top

Be incremental — only process new/changed raw files unless told otherwise.`;

const ASK_PROMPT = `You are the DWS Knowledge Base research assistant. Answer questions by
reading the wiki.

WORKFLOW:
1. Read wiki/_index.md and wiki/_index-by-topic.md to understand what's available
2. Based on the question, identify 3-8 relevant articles to read
3. Read those articles with kb_read_file
4. Synthesize an answer with citations to wiki articles
5. If asked to save (--save flag), write the answer as wiki/reports/{slug}.md
   and update the indexes

Be thorough but concise. Always cite which wiki articles informed your answer.`;

const LINT_PROMPT = `You are the DWS Knowledge Base health checker. Audit the wiki for data quality.

WORKFLOW:
1. Read wiki/_index.md to get the current article inventory
2. Use kb_list_wiki and kb_list_raw to check for:
   - ORPHANED: articles in wiki/ not listed in any index
   - STALE: raw sources newer than their wiki/summaries/ counterpart
   - STUB: articles with very little content (<100 words)
   - MISSING: index references articles that don't exist
   - UNLINKED: concepts mentioned in 3+ articles but no concept article exists
3. Write findings to wiki/_stale.md
4. Calculate health score (0-100):
   - Start at 100
   - -5 per orphaned article
   - -10 per stale article
   - -3 per stub
   - -15 per missing reference
   - -5 per unlinked concept
5. Update kb_update_metadata with healthScore and lastLint

Be specific — list exact file paths and what needs fixing.`;

const RESEARCH_PROMPT = `You are the DWS Knowledge Base deep researcher. Conduct thorough
multi-step research to answer complex questions.

WORKFLOW:
1. Read wiki/_index.md and wiki/_index-by-topic.md
2. Read all relevant wiki articles (be thorough — read 5-15 articles)
3. Identify knowledge gaps — what's missing from the wiki to fully answer the question?
4. Write analysis articles to wiki/reports/ as you discover findings
5. Cross-reference findings, identify contradictions or patterns
6. Write a final comprehensive report to wiki/reports/{slug}.md
7. Update the indexes to include the new report

Your goal is depth and rigor. Connect dots across multiple articles.
Cite sources. Flag uncertainties. Suggest follow-up questions.`;

// ============ KB AGENT ============

export class KBAgent extends BaseAgent {
  constructor() {
    super({
      name: 'kb',
      description: 'LLM-maintained Knowledge Base — compiles raw sources into a markdown wiki with auto-maintained indexes. Supports compile, ask, research, and lint operations.',
      capabilities: ['knowledge-base', 'wiki', 'research', 'compile', 'lint', 'q&a'],
      model: 'claude-sonnet-5',
      loop: {
        maxIterations: 15,
        allowDelegation: true,
        logIterations: true,
      },
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const operation = (input.operation as string) || 'status';
    const startTime = Date.now();

    // Ensure KB directories exist
    this.ensureDirectories();

    switch (operation) {
      case 'compile':
        return this.runCompile(context, input);
      case 'ask':
        return this.runAsk(context, input);
      case 'research':
        return this.runResearch(context, input);
      case 'lint':
        return this.runLint(context);
      case 'ingest':
        return this.runIngest(input);
      case 'status':
        return this.runStatus();
      default:
        return {
          agentName: 'kb',
          result: { error: `Unknown operation: ${operation}` },
          confidence: 0,
          reasoning: `Operation "${operation}" is not supported. Use: compile, ask, research, lint, ingest, status.`,
          recommendations: ['Use a valid operation: compile, ask, research, lint, ingest, status'],
          metadata: { durationMs: Date.now() - startTime },
        };
    }
  }

  private ensureDirectories(): void {
    const dirs = [
      RAW_DIR, join(RAW_DIR, 'articles'), join(RAW_DIR, 'repos'),
      join(RAW_DIR, 'images'), join(RAW_DIR, 'signals'),
      WIKI_DIR, join(WIKI_DIR, 'concepts'), join(WIKI_DIR, 'entities'),
      join(WIKI_DIR, 'summaries'), join(WIKI_DIR, 'reports'), join(WIKI_DIR, 'slides'),
      EPHEMERAL_DIR,
    ];
    for (const dir of dirs) {
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    }
  }

  private async runCompile(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const full = input.full === true;
    const userMsg = full
      ? 'Perform a FULL recompile of the entire knowledge base. Process all raw sources, not just new ones.'
      : 'Perform an incremental compile. Only process raw sources that are new or changed since the last compile.';

    const loopResult = await this.runLoop(context, COMPILE_PROMPT, userMsg, KB_TOOLS);

    return {
      agentName: 'kb',
      result: { output: loopResult.content, iterations: loopResult.iterations.length },
      confidence: 0.9,
      reasoning: `Knowledge base ${full ? 'full' : 'incremental'} compilation completed in ${loopResult.iterations.length} iterations.`,
      recommendations: ['Run `dws kb lint` to verify wiki consistency', 'Run `dws kb status` to see updated stats'],
      metadata: {
        model: loopResult.model,
        totalTokens: loopResult.totalTokens,
        iterations: loopResult.iterations.length,
      },
    };
  }

  private async runAsk(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const question = input.question as string;
    if (!question) {
      return {
        agentName: 'kb',
        result: { error: 'No question provided' },
        confidence: 0,
        reasoning: 'The "ask" operation requires a "question" field.',
        recommendations: ['Provide a question: dws kb ask "your question here"'],
        metadata: {},
      };
    }

    const save = input.save === true;
    const userMsg = save
      ? `Answer this question and save the answer as a report in wiki/reports/:\n\n${question}`
      : `Answer this question using the knowledge base:\n\n${question}`;

    const loopResult = await this.runLoop(context, ASK_PROMPT, userMsg, KB_TOOLS);

    return {
      agentName: 'kb',
      result: { answer: loopResult.content, saved: save },
      confidence: 0.85,
      reasoning: `Researched knowledge base to answer: "${question.slice(0, 100)}"`,
      recommendations: [],
      metadata: {
        model: loopResult.model,
        totalTokens: loopResult.totalTokens,
        iterations: loopResult.iterations.length,
      },
    };
  }

  private async runResearch(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const question = input.question as string;
    if (!question) {
      return {
        agentName: 'kb',
        result: { error: 'No question provided' },
        confidence: 0,
        reasoning: 'The "research" operation requires a "question" field.',
        recommendations: ['Provide a question: dws kb research "your research question"'],
        metadata: {},
      };
    }

    // Use longer loop for deep research
    const savedLoop = this.config.loop;
    this.config.loop = { maxIterations: 25, allowDelegation: savedLoop?.allowDelegation ?? false, logIterations: savedLoop?.logIterations ?? false };

    const userMsg = `Conduct deep research on this question. Write analysis articles and a final report.\n\n${question}`;
    const loopResult = await this.runLoop(context, RESEARCH_PROMPT, userMsg, KB_TOOLS);

    this.config.loop = savedLoop;

    return {
      agentName: 'kb',
      result: { report: loopResult.content, iterations: loopResult.iterations.length },
      confidence: 0.8,
      reasoning: `Deep research completed on: "${question.slice(0, 100)}" in ${loopResult.iterations.length} iterations.`,
      recommendations: ['Check wiki/reports/ for the full report', 'Run `dws kb lint` to verify consistency'],
      metadata: {
        model: loopResult.model,
        totalTokens: loopResult.totalTokens,
        iterations: loopResult.iterations.length,
      },
    };
  }

  private async runLint(context: AgentContext): Promise<AgentResponse> {
    const loopResult = await this.runLoop(context, LINT_PROMPT, 'Run a health check on the knowledge base.', KB_TOOLS);

    return {
      agentName: 'kb',
      result: { report: loopResult.content, iterations: loopResult.iterations.length },
      confidence: 0.9,
      reasoning: 'Knowledge base health check completed.',
      recommendations: ['Review wiki/_stale.md for issues', 'Run `dws kb compile` to fix stale articles'],
      metadata: {
        model: loopResult.model,
        totalTokens: loopResult.totalTokens,
        iterations: loopResult.iterations.length,
      },
    };
  }

  private runIngest(input: Record<string, unknown>): AgentResponse {
    const sourcePath = input.file as string;
    if (!sourcePath) {
      return {
        agentName: 'kb',
        result: { error: 'No file path provided' },
        confidence: 0,
        reasoning: 'The "ingest" operation requires a "file" field with the path to ingest.',
        recommendations: ['Provide a file: dws kb ingest path/to/file.md'],
        metadata: {},
      };
    }

    const resolvedSource = resolve(sourcePath);
    if (!existsSync(resolvedSource)) {
      return {
        agentName: 'kb',
        result: { error: `File not found: ${sourcePath}` },
        confidence: 0,
        reasoning: `The file "${sourcePath}" does not exist.`,
        recommendations: ['Check the file path and try again'],
        metadata: {},
      };
    }

    // Determine target subdirectory based on extension
    const ext = extname(resolvedSource).toLowerCase();
    let subdir = 'articles';
    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].includes(ext)) subdir = 'images';
    else if (['.ts', '.js', '.py', '.rs', '.go'].includes(ext)) subdir = 'repos';

    const targetPath = join(RAW_DIR, subdir, basename(resolvedSource));
    copyFileSync(resolvedSource, targetPath);

    logger.info('KB raw source ingested', { source: sourcePath, target: relative(KB_ROOT, targetPath) });

    return {
      agentName: 'kb',
      result: { ingested: true, target: relative(KB_ROOT, targetPath) },
      confidence: 1.0,
      reasoning: `File ingested to ${relative(KB_ROOT, targetPath)}. Run \`dws kb compile\` to process it.`,
      recommendations: ['Run `dws kb compile` to compile the new source into the wiki'],
      metadata: {},
    };
  }

  private runStatus(): AgentResponse {
    let metadata: Record<string, unknown> = {};
    if (existsSync(KB_JSON)) {
      metadata = JSON.parse(readFileSync(KB_JSON, 'utf-8'));
    }

    // Count actual files
    const rawFiles = listDirectory(RAW_DIR);
    const wikiFiles = listDirectory(WIKI_DIR).filter(f => !f.path.startsWith('wiki/_'));

    return {
      agentName: 'kb',
      result: {
        ...metadata,
        rawCount: rawFiles.length,
        articleCount: wikiFiles.length,
        rawFiles: rawFiles.map(f => f.path),
        wikiFiles: wikiFiles.map(f => f.path),
      },
      confidence: 1.0,
      reasoning: `Knowledge base has ${rawFiles.length} raw sources and ${wikiFiles.length} wiki articles.`,
      recommendations: rawFiles.length > wikiFiles.length
        ? ['Run `dws kb compile` to process uncompiled raw sources']
        : ['Knowledge base is up to date'],
      metadata: {},
    };
  }
}
