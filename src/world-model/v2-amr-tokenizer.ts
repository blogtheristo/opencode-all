// Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=engineering-execution Date=2026-09-05
// Audit trail: git log -- src/world-model/v2-amr-tokenizer.ts

/**
 * Lifetime World Model v2 — AMR Tokenizer (Multilingual, Safety-Aware)
 *
 * MVP scope: German (DE), English (EN), Swedish (SV)
 * Extensions: 24 EU languages in Phase 2
 *
 * Purpose: Convert raw sensor labels + safety commands + ERP transaction fields
 * into token sequences for Llama 3.1 LoRA fine-tuning.
 */

interface Tokenizer {
  encode(text: string): number[];
  decode(tokens: number[]): string;
}

interface TokenizerConfig {
  baseTokenizer: Tokenizer;
  customVocab: Map<string, number>;
  safetyCommands: string[];
  sensorLabels: string[];
  erpFields: string[];
}

interface ValidationResult {
  language: string;
  sampleCount: number;
  latencyMs: number;
  tokenEfficiency: number; // tokens per word
  parseErrorRate: number; // % of failed parses
  status: 'pass' | 'fail';
}

/**
 * AMR-specific tokenizer: adds safety commands, sensor labels, ERP transaction fields.
 * Base: Llama 3.1 (90+ language support)
 */
export class AMRTokenizer {
  private config: TokenizerConfig;
  private safetyCommandTokens: Map<string, number[]> = new Map();

  constructor(baseTokenizer: Tokenizer) {
    this.config = {
      baseTokenizer,
      customVocab: new Map([
        // Safety commands (all languages)
        ['STOP_IMMEDIATE', 50000],
        ['RETURN_HOME', 50001],
        ['COLLISION_RISK', 50002],
        ['MOTOR_WEAR_HIGH', 50003],
        ['BATTERY_LOW', 50004],

        // Sensor labels
        ['lidar_front_3m', 50100],
        ['camera_rgb_hd', 50101],
        ['motor_temp_critical', 50102],

        // ERP transaction fields
        ['part_id', 50200],
        ['urgency_level', 50201],
        ['vendor_cbam_score', 50202],
      ]),
      safetyCommands: [
        'STOP_IMMEDIATE',
        'RETURN_HOME',
        'COLLISION_RISK',
        'MOTOR_WEAR_HIGH',
        'BATTERY_LOW',
      ],
      sensorLabels: ['lidar_front_3m', 'camera_rgb_hd', 'motor_temp_critical', 'imu_gyro_z'],
      erpFields: ['part_id', 'urgency_level', 'vendor_cbam_score', 'requested_delivery_days'],
    };

    this.precompileSafetyCommands();
  }

  /**
   * Precompile safety commands for fast lookup
   */
  private precompileSafetyCommands(): void {
    const safetyDict: Record<string, string[]> = {
      de: [
        'Sofort stoppen',
        'Zur Basis zurückkehren',
        'Kollisionsgefahr erkannt',
        'Motorverschleiß hoch',
        'Batterie schwach',
      ],
      en: [
        'Stop immediately',
        'Return home',
        'Collision risk detected',
        'Motor wear high',
        'Battery low',
      ],
      sv: [
        'Stoppa omedelbar',
        'Återgå hem',
        'Kollisionsrisk upptäckt',
        'Högt motorslitage',
        'Lågt batteri',
      ],
    };

    for (const [lang, commands] of Object.entries(safetyDict)) {
      for (const cmd of commands) {
        const tokens = this.config.baseTokenizer.encode(cmd);
        this.safetyCommandTokens.set(`${lang}_${cmd}`, tokens);
      }
    }
  }

  /**
   * Encode text with custom vocabulary support
   */
  encode(text: string, language: string = 'en'): number[] {
    const tokens: number[] = [];

    // Check if text matches a custom token
    for (const [key, id] of this.config.customVocab) {
      if (text.includes(key)) {
        tokens.push(id);
        return tokens;
      }
    }

    // Check if text matches a precompiled safety command
    const safetyKey = `${language}_${text}`;
    const safetyTokens = this.safetyCommandTokens.get(safetyKey);
    if (safetyTokens) {
      return safetyTokens;
    }

    // Fall back to base tokenizer
    return this.config.baseTokenizer.encode(text);
  }

  /**
   * Decode tokens back to text
   */
  decode(tokens: number[]): string {
    // Reverse-lookup custom tokens
    for (const [key, id] of this.config.customVocab) {
      if (tokens.includes(id)) {
        return key; // return custom vocabulary entry
      }
    }

    // Fall back to base tokenizer
    return this.config.baseTokenizer.decode(tokens);
  }

  /**
   * Validate tokenizer on multilingual safety corpus
   * Returns latency + parse error rate
   */
  validate(language: string, samples: string[]): ValidationResult {
    const start = performance.now();
    let errorCount = 0;

    for (const sample of samples) {
      try {
        const tokens = this.encode(sample, language);
        if (!tokens || tokens.length === 0) {
          errorCount++;
        }
      } catch (_error) {
        errorCount++;
      }
    }

    const latencyMs = performance.now() - start;
    const avgTokensPerWord =
      samples.reduce(
        (acc, sample) => acc + this.encode(sample, language).length / sample.split(' ').length,
        0,
      ) / samples.length;

    const result: ValidationResult = {
      language,
      sampleCount: samples.length,
      latencyMs: latencyMs / samples.length,
      tokenEfficiency: avgTokensPerWord,
      parseErrorRate: (errorCount / samples.length) * 100,
      status:
        latencyMs / samples.length < 50 && errorCount / samples.length < 0.05 ? 'pass' : 'fail',
    };

    return result;
  }
}

/**
 * Validation harness for Sprint 1 gate check
 */
export async function validateTokenizerMVP(tokenizer: AMRTokenizer): Promise<boolean> {
  const safetyCorpus = {
    de: [
      'Sofort stoppen',
      'Hindernis erkannt',
      'Motorverschleiß 85%',
      'Batterie kritisch',
      'Zur Basis zurückkehren',
    ],
    en: [
      'Stop immediately',
      'Obstacle detected',
      'Motor wear 85%',
      'Battery critical',
      'Return home',
    ],
    sv: [
      'Stoppa omedelbar',
      'Hinder upptäckt',
      'Motorslitage 85%',
      'Batteri kritiskt',
      'Återgå hem',
    ],
  };

  let allPass = true;

  for (const [lang, samples] of Object.entries(safetyCorpus)) {
    const result = tokenizer.validate(lang, samples);
    console.warn(
      `[Tokenizer] ${lang.toUpperCase()}: latency=${result.latencyMs.toFixed(1)}ms, efficiency=${result.tokenEfficiency.toFixed(2)}, error_rate=${result.parseErrorRate.toFixed(1)}%`,
    );

    if (result.status === 'fail') {
      console.error(`[Tokenizer] ${lang} FAILED: latency exceeded or parse error rate too high`);
      allPass = false;
    }
  }

  return allPass;
}
