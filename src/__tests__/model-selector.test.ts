import { afterEach, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import {
  escalateToClaude,
  estimateLocalModelDiskUsage,
  isProviderAvailable,
  LITELLM_LOCAL_MODEL,
  LITELLM_TIER_ALIASES,
  MODEL_CATALOG,
  modelFitsDepth,
  OLLAMA_DEPLOYED_MODELS,
  selectModel,
} from '../agents/model-selector.js';

const ENV_KEYS = [
  'ANTHROPIC_API_KEY',
  'GROQ_API_KEY',
  'GOOGLE_AI_API_KEY',
  'GEMINI_API_KEY',
  'OLLAMA_BASE_URL',
  'ACER_VERITON_HOST',
  'VLLM_BASE_URL',
  'OPENAI_API_KEY',
] as const;

const originalEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]])) as Record<
  (typeof ENV_KEYS)[number],
  string | undefined
>;

function resetEnv(): void {
  for (const key of ENV_KEYS) {
    const original = originalEnv[key];
    if (original === undefined) {
      Reflect.deleteProperty(process.env, key);
    } else {
      process.env[key] = original;
    }
  }
}

afterEach(() => {
  resetEnv();
});

describe('model-selector', () => {
  it('selectModel treats vLLM as local when Ollama is unavailable', () => {
    delete process.env.OLLAMA_BASE_URL;
    delete process.env.ACER_VERITON_HOST;
    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';
    delete process.env.GROQ_API_KEY;
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GOOGLE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;

    const selection = selectModel('atlas');
    expect(selection.provider).toBe('vllm-local');
    expect(selection.isLocal).toBe(true);
    expect(selection.reason).toContain('local');
  });

  it('isProviderAvailable recognizes vLLM and Google API key aliases', () => {
    delete process.env.VLLM_BASE_URL;
    expect(isProviderAvailable('vllm-local')).toBe(false);

    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';
    expect(isProviderAvailable('vllm-local')).toBe(true);

    delete process.env.GOOGLE_AI_API_KEY;
    delete process.env.GEMINI_API_KEY;
    expect(isProviderAvailable('google')).toBe(false);

    process.env.GEMINI_API_KEY = 'gemini-key';
    expect(isProviderAvailable('google')).toBe(true);
  });

  it('estimateLocalModelDiskUsage includes local tier models once', () => {
    const summary = estimateLocalModelDiskUsage(['atlas', 'sitesense', 'atlas']);
    const modelIds = summary.models.map((m) => m.modelId);

    expect(summary.totalDiskGb).toBeGreaterThan(0);
    expect(summary.totalRamGb).toBeGreaterThan(0);
    expect(new Set(modelIds).size).toBe(modelIds.length);
  });

  // ===== (a) Local-model drift guard =====================================
  // Four sources named local models and no two agreed (31.07.2026). These tests
  // fail if any of them drifts again — the point is that the sovereign path must
  // be selectable in fact, not only in name.

  it('every ollama-local model in the catalog is one the box actually has', () => {
    const deployed = new Set<string>(Object.values(OLLAMA_DEPLOYED_MODELS));
    const catalogued = Object.values(MODEL_CATALOG)
      .flatMap((tier) => tier.models)
      .filter((m) => m.provider === 'ollama-local')
      .map((m) => m.id);

    expect(catalogued.length).toBeGreaterThan(0);
    for (const id of catalogued) {
      expect(deployed).toContain(id);
    }
  });

  it('the daily model check enforces exactly the models the catalog selects', () => {
    const script = readFileSync('scripts/daily/check-ollama-models.sh', 'utf8');
    const required = script.match(/REQUIRED_MODELS=\(([^)]*)\)/)?.[1] ?? '';
    for (const id of Object.values(OLLAMA_DEPLOYED_MODELS)) {
      expect(required).toContain(id);
    }
  });

  it('the DGX deploy path pulls the models the catalog selects', () => {
    const deploy = readFileSync('infrastructure/dgx-spark/deploy.sh', 'utf8');
    for (const id of Object.values(OLLAMA_DEPLOYED_MODELS)) {
      expect(deploy).toContain(`ollama pull ${id}`);
    }
  });

  it('standard tier has a local option so an Ollama-only host never falls to metered cloud', () => {
    const localIds = MODEL_CATALOG.standard.models
      .filter((m) => m.provider === 'ollama-local')
      .map((m) => m.id);
    expect(localIds).toContain(OLLAMA_DEPLOYED_MODELS.fast);
  });

  it('LiteLLM aliases map the 2026-09-18 complexity labels onto DWS tiers', () => {
    expect(LITELLM_TIER_ALIASES.SIMPLE).toBe('lite');
    expect(LITELLM_TIER_ALIASES.MEDIUM).toBe('standard');
    expect(LITELLM_TIER_ALIASES.COMPLEX).toBe('heavy');
    expect(LITELLM_TIER_ALIASES.REASONING).toBe('heavy');
    expect(LITELLM_LOCAL_MODEL.SIMPLE).toBe(OLLAMA_DEPLOYED_MODELS.fast);
    expect(LITELLM_LOCAL_MODEL.COMPLEX).toBe(OLLAMA_DEPLOYED_MODELS.deep);
  });

  it('LiteLLM config only names deployed Ollama models and env-based keys', () => {
    const yaml = readFileSync('config/litellm-config.yaml', 'utf8');
    const active = yaml
      .split('\n')
      .filter((line) => !line.trim().startsWith('#'))
      .join('\n');
    const ollamaModels = [...active.matchAll(/model:\s*ollama\/(\S+)/g)].map((m) => m[1]);
    const deployed = new Set<string>(Object.values(OLLAMA_DEPLOYED_MODELS));

    expect(ollamaModels.length).toBeGreaterThan(0);
    for (const id of ollamaModels) {
      expect(deployed).toContain(id);
    }
    const ollamaBases = [...active.matchAll(/api_base:\s*os\.environ\/OLLAMA_API_BASE/g)];
    expect(ollamaBases.length).toBe(ollamaModels.length);
    expect(yaml).toMatch(/host\.docker\.internal:11434/);
    expect(yaml).toMatch(/extra_hosts:\s*host\.docker\.internal:host-gateway/);
    expect(active).toMatch(/api_key:\s*os\.environ\/ANTHROPIC_API_KEY/);
    expect(active).toMatch(/api_base:\s*os\.environ\/OLLAMA_API_BASE/);
    expect(active).not.toMatch(/api_base:\s*http:\/\//);
    expect(active).toMatch(/model:\s*anthropic\/claude-opus-4-8/);
    expect(active).not.toMatch(/claude-opus-5/);
    expect(active).toMatch(/master_key:\s*os\.environ\/LITELLM_MASTER_KEY/);
    expect(active).toMatch(/allowed_ips:\s*\["127\.0\.0\.1"/);
    expect(active).not.toMatch(/api_key:\s*sk-/);
    expect(active).not.toMatch(/api_key:\s*['"][^o]/);
    expect(active).not.toContain('sk-ant-');
  });

  it('litellm-spark.sh exits 1 when LITELLM_MASTER_KEY is unset', () => {
    const result = spawnSync('bash', ['scripts/litellm-spark.sh'], {
      env: { ...process.env, LITELLM_MASTER_KEY: '', OLLAMA_API_BASE: 'http://127.0.0.1:11434' },
      encoding: 'utf8',
    });
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(/LITELLM_MASTER_KEY/);
  });

  it('truth mirror deprecates all six undeployed Spark ids as bare phrases', () => {
    const mirror = JSON.parse(
      readFileSync('config/truth/dgx-ollama-deployed-pair.json', 'utf8'),
    ) as { deprecatedDisplayPhrases: string[] };
    expect(mirror.deprecatedDisplayPhrases).toEqual([
      'llama3.3:70b',
      'qwen2.5:7b',
      'qwen2.5:72b',
      'qwen2.5:32b',
      'gpt-oss:120b',
      'phi4',
    ]);
  });

  it('truth-claim lint FAILs a live claim that names any of the six undeployed ids', () => {
    const ids = [
      'llama3.3:70b',
      'qwen2.5:7b',
      'qwen2.5:72b',
      'qwen2.5:32b',
      'gpt-oss:120b',
      'phi4',
    ];
    for (const id of ids) {
      const result = spawnSync(
        'node',
        ['scripts/lint-truth-claims.mjs', '--check', `Live Spark pair is ${id}`, '--json'],
        { encoding: 'utf8' },
      );
      expect(result.status, id).toBe(1);
      const payload = JSON.parse(result.stdout) as {
        fails: number;
        findings: Array<{ severity: string; phrase: string }>;
      };
      expect(payload.fails).toBeGreaterThan(0);
      expect(
        payload.findings.some((f) => f.severity === 'FAIL' && f.phrase === id),
        id,
      ).toBe(true);
    }
  });

  it('Deputy-Agents compose fence does not name the forbidden floating LiteLLM image', () => {
    const deputy = readFileSync('docs/Deputy-Agents-Architecture.md', 'utf8');
    expect(deputy).not.toContain('ghcr.io/berriai/litellm:main-latest');
    const fences = [...deputy.matchAll(/```ya?ml\n([\s\S]*?)```/g)].map((m) => m[1]);
    expect(fences.length).toBeGreaterThan(0);
    for (const fence of fences) {
      expect(fence).not.toMatch(/litellm:main-latest/);
      expect(fence).not.toMatch(/image:\s*ghcr\.io\/berriai\/litellm/);
    }
  });

  it('LiteLLM local-sovereign fallbacks never name a cloud model (Model Standard §9)', () => {
    const yaml = readFileSync('config/litellm-config.yaml', 'utf8');
    const active = yaml
      .split('\n')
      .filter((line) => !line.trim().startsWith('#'))
      .join('\n');
    const sovereign = active.match(/local-sovereign:\s*\[([^\]]*)\]/);
    expect(sovereign).not.toBeNull();
    expect(sovereign?.[1] ?? '').not.toMatch(/claude|groq/i);
    const localFast = active.match(/local-fast:\s*\[([^\]]*)\]/);
    expect(localFast?.[1] ?? '').not.toMatch(/claude|groq/i);
    expect(LITELLM_TIER_ALIASES['local-sovereign']).toBe('heavy');
  });

  // ===== (b) Depth-aware selection =======================================
  // contextWindow was declared on every model and read by nothing until
  // 31.07.2026. These assert it is now load-bearing.

  it('modelFitsDepth rejects a model whose window is smaller than the work', () => {
    const shallow = { contextWindow: 32768 } as never;
    expect(modelFitsDepth(shallow, 32768)).toBe(true);
    expect(modelFitsDepth(shallow, 32769)).toBe(false);
  });

  it('a deep task skips shallow models and lands on one that can hold it', () => {
    process.env.VLLM_BASE_URL = 'http://localhost:8000/v1';
    process.env.GEMINI_API_KEY = 'gemini-key';

    const selection = selectModel('vulcan', { estimatedInputTokens: 200_000 });

    expect(selection.contextWindow).toBeGreaterThanOrEqual(selection.requiredContextTokens);
    expect(selection.requiredContextTokens).toBeGreaterThan(200_000);
    // diffusiongemma (32k) is first by preference but cannot hold 200k.
    expect(selection.modelId).not.toBe('diffusiongemma-26b');
  });

  it('required depth counts the reserved output, not just the input', () => {
    process.env.GEMINI_API_KEY = 'gemini-key';
    const selection = selectModel('vulcan', { estimatedInputTokens: 1000 });
    // standard tier reserves 2048 output tokens
    expect(selection.requiredContextTokens).toBe(1000 + MODEL_CATALOG.standard.maxTokens);
  });

  it('fails loud, naming depth, when no model in the catalog is deep enough', () => {
    process.env.GEMINI_API_KEY = 'gemini-key';
    process.env.ANTHROPIC_API_KEY = 'anthropic-key';

    const selection = selectModel('vulcan', { estimatedInputTokens: 50_000_000 });

    expect(selection.modelId).toBe('placeholder');
    expect(selection.reason).toContain('deep enough');
  });

  describe('escalateToClaude', () => {
    it('forces FRONTIER-CLAUDE-OPUS (claude-opus-4-8) via the Anthropic API key', () => {
      process.env.ANTHROPIC_API_KEY = 'anthropic-key';

      const selection = escalateToClaude('athena');

      expect(selection.modelId).toBe('claude-opus-4-8');
      expect(selection.provider).toBe('anthropic');
      expect(selection.isLocal).toBe(false);
      expect(selection.tier).toBe('heavy');
      expect(selection.reason).toContain('athena');

      const standard = readFileSync('DWS_MODEL_STANDARD.md', 'utf8');
      expect(standard).toMatch(/\*\*FRONTIER-CLAUDE-OPUS\*\*\s*\|\s*Claude Opus 4\.8/);
      expect(standard).toContain('claude-opus-4-8');
      const registry = JSON.parse(readFileSync('config/llm-registry.json', 'utf8')) as {
        models: Array<{ id: string; status: string }>;
      };
      expect(
        registry.models.some((m) => m.id === 'claude-opus-4-8' && m.status === 'current'),
      ).toBe(true);
      expect(registry.models.some((m) => m.id === 'claude-opus-5')).toBe(false);
    });

    it('throws rather than silently falling back when ANTHROPIC_API_KEY is unset', () => {
      delete process.env.ANTHROPIC_API_KEY;

      expect(() => escalateToClaude('athena')).toThrow(/ANTHROPIC_API_KEY/);
    });

    it('never routes through a local or non-Anthropic provider', () => {
      process.env.ANTHROPIC_API_KEY = 'anthropic-key';
      process.env.OLLAMA_BASE_URL = 'http://localhost:11434';

      const selection = escalateToClaude('atlas');

      expect(selection.provider).toBe('anthropic');
      expect(selection.isLocal).toBe(false);
    });
  });
});
