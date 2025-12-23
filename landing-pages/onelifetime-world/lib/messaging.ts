/**
 * DWS IQ Messaging Configuration
 * Centralized messaging system for A/B testing and deployment
 *
 * @description Provides structured messaging hierarchy for onelifetime.world
 * @performance Cached at edge for sub-100ms delivery
 * @compliance EU data residency (GDPR-compliant)
 */

export interface MessageVariant {
  id: string;
  primary: string;
  secondary?: string;
  cta?: string;
}

export interface MessagingConfig {
  slogans: {
    web_concise: string;
    strategic: string;
    extended: string;
    tagline: string;
  };
  hero: {
    default: MessageVariant;
    variant_a: MessageVariant;
    variant_b: MessageVariant;
  };
  value_props: string[];
  deployment: {
    region: string;
    cache_ttl: number;
    cdn: string;
  };
  ab_testing: {
    enabled: boolean;
    supabase_table: string;
    metrics: string[];
  };
}

/**
 * Primary messaging configuration
 * Last updated: 2025-12-09
 */
export const MESSAGING_CONFIG: MessagingConfig = {
  slogans: {
    web_concise: "Move faster from legacy operations to intelligent decisioning.",
    strategic: "DWS IQ accelerates the shift from legacy operations to intelligent decisioning",
    extended: "DWS IQ empowers our clients to move faster from legacy operations to intelligent decisioning, turning 2050 goals into 2026 insights.",
    tagline: "Turning 2050 goals into 2026 insights",
  },

  hero: {
    default: {
      id: "default",
      primary: "Move faster from legacy operations to intelligent decisioning.",
      secondary: "DWS IQ turns 2050 goals into 2026 insights by delivering AI-orchestrated Fit for 55 optimization and renewable electrification—securing your future in the Post-Carbon era.",
      cta: "Join the Community",
    },
    variant_a: {
      id: "variant_a",
      primary: "Turn 2050 goals into 2026 insights.",
      secondary: "DWS IQ delivers AI-orchestrated Fit for 55 optimization and renewable electrification, accelerating your shift from legacy operations to intelligent decisioning.",
      cta: "Get Started",
    },
    variant_b: {
      id: "variant_b",
      primary: "Accelerate from legacy operations to intelligent decisioning.",
      secondary: "With DWS IQ, transform 2050 climate goals into actionable 2026 insights through AI workforce orchestration and Fit for 55 compliance.",
      cta: "Book Demo",
    },
  },

  value_props: [
    "2050 goals → 2026 insights",
    "Fit for 55 optimization",
    "AI workforce orchestration",
    "Renewable electrification",
    "Post-Carbon competitive advantage",
  ],

  deployment: {
    region: "eu-west-1", // EU data residency
    cache_ttl: 31536000, // 1 year for static messaging
    cdn: "cloudflare",
  },

  ab_testing: {
    enabled: true,
    supabase_table: "messaging_experiments",
    metrics: ["impressions", "clicks", "conversions", "bounce_rate"],
  },
};

/**
 * Get message variant based on A/B test assignment
 * @param variantId - The variant identifier (default, variant_a, variant_b)
 * @returns MessageVariant object
 */
export function getMessageVariant(variantId: keyof typeof MESSAGING_CONFIG.hero = "default"): MessageVariant {
  return MESSAGING_CONFIG.hero[variantId];
}

/**
 * Footer positioning statement
 */
export const FOOTER_POSITIONING =
  "DWS IQ accelerates the shift from legacy operations to intelligent decisioning, translating 2050 goals into 2026 insights. By delivering Fit for 55 optimization through AI workforce orchestration and renewable electrification, we secure your competitive standing in the Post-Carbon era.";

/**
 * SEO metadata
 */
export const SEO_METADATA = {
  title: "OneLifetime.World - DWS IQ Platform",
  description: "Move faster from legacy operations to intelligent decisioning. DWS IQ turns 2050 goals into 2026 insights through AI-orchestrated Fit for 55 optimization and renewable electrification.",
  keywords: [
    "DWS IQ",
    "Fit for 55",
    "AI workforce orchestration",
    "renewable electrification",
    "Post-Carbon era",
    "intelligent decisioning",
    "climate compliance",
    "industrial AI",
  ],
  og: {
    title: "OneLifetime.World - Move Faster to Intelligent Decisioning",
    description: "DWS IQ turns 2050 goals into 2026 insights",
    image: "/static/images/8_Industries.png",
    url: "https://onelifetime.world",
  },
};

export default MESSAGING_CONFIG;
