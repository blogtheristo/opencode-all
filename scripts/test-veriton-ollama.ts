/**
 * Test Veriton-hosted Ollama connectivity and model availability.
 *
 * Requires: OLLAMA_HOST
 * Optional: OLLAMA_MODEL (defaults to qwen3:8b)
 * Run: npm run diag:ollama
 */

import dotenv from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const root = resolve(process.cwd());
for (const f of ['.env', '100326.env', '.env.local']) {
  const p = resolve(root, f);
  if (existsSync(p)) dotenv.config({ path: p, override: true });
}

interface OllamaModel {
  name: string;
  size: number;
  parameter_size?: string;
  quantization_level?: string;
}

async function main() {
  const host = process.env.OLLAMA_HOST;

  if (!host) {
    console.error('Missing OLLAMA_HOST. Set it in .env (e.g. http://localhost:11434)');
    process.exit(1);
  }

  const baseUrl = host.replace(/\/$/, '');

  // 1. Health check
  console.log(`\n[1/3] Testing Ollama endpoint: ${baseUrl}/api/tags`);
  const tagsRes = await fetch(`${baseUrl}/api/tags`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!tagsRes.ok) {
    console.error(`FAILED: ${tagsRes.status} ${tagsRes.statusText}`);
    process.exit(1);
  }

  const tagsData = await tagsRes.json() as { models?: OllamaModel[] };
  const models = tagsData.models || [];
  console.log(`OK — ${models.length} model(s) available:`);
  for (const m of models) {
    const sizeGB = (m.size / 1e9).toFixed(1);
    console.log(`  - ${m.name} (${sizeGB} GB${m.parameter_size ? `, ${m.parameter_size}` : ''}${m.quantization_level ? `, ${m.quantization_level}` : ''})`);
  }

  // 2. Check if configured model is available
  const model = process.env.OLLAMA_MODEL || 'qwen3:8b';
  const modelAvailable = models.some((m) => m.name === model || m.name.startsWith(`${model}:`));
  console.log(`\n[2/3] Configured model: ${model} — ${modelAvailable ? 'AVAILABLE' : 'NOT FOUND (pull it with: ollama pull ' + model + ')'}`);

  // 3. Quick inference test via OpenAI-compatible endpoint
  console.log(`\n[3/3] Testing inference via ${baseUrl}/v1/chat/completions ...`);
  const chatRes = await fetch(`${baseUrl}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ollama',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: 'Reply with exactly: {"status":"ok"}' }],
      max_completion_tokens: 32,
      temperature: 0,
    }),
  });

  if (!chatRes.ok) {
    const err = await chatRes.text();
    console.error(`Inference FAILED: ${chatRes.status} — ${err.slice(0, 200)}`);
    if (!modelAvailable) {
      console.error(`Hint: model "${model}" not found. Pull it first on the GN100.`);
    }
    process.exit(1);
  }

  const chatData = await chatRes.json() as {
    choices?: Array<{ message?: { content?: string } }>;
    model?: string;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
  };

  const reply = chatData.choices?.[0]?.message?.content || '';
  const usage = chatData.usage;
  console.log(`OK — Model: ${chatData.model}`);
  console.log(`     Reply: ${reply.slice(0, 100)}`);
  if (usage) {
    console.log(`     Tokens: ${usage.prompt_tokens} in / ${usage.completion_tokens} out`);
  }

  console.log('\nOllama diagnostics PASSED.');
}

main().catch((error) => {
  console.error('Ollama connectivity test failed:', error.message || error);
  process.exit(1);
});
