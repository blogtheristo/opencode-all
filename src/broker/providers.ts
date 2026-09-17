/**
 * Broker provider registry — which upstream services agents may reach
 * through the credential broker, and how to attach credentials to a forwarded
 * request.
 *
 * Each provider declares:
 *   - id              — scope name used in BROKER_AGENT_TOKENS scopes[]
 *   - upstreamBaseUrl — where the broker forwards requests to
 *   - credentialEnv   — env var holding the real upstream credential
 *                       (populated by the vault loader at boot)
 *   - injectAuth      — strategy for putting the credential on the outbound
 *                       request (header, URL-segment for Telegram, etc.)
 *
 * Agents never see `credentialEnv`. They only see their own capability token,
 * which the broker validates and exchanges for the real credential.
 */

export type AuthInjection =
  | { kind: 'header'; name: string; valuePrefix?: string; extraHeaders?: Record<string, string> }
  | { kind: 'url-segment-bot'; }; // Telegram: https://api.telegram.org/bot<TOKEN>/<method>

export interface ProviderSpec {
  id: string;
  upstreamBaseUrl: string;
  credentialEnv: string;
  injectAuth: AuthInjection;
  /** Optional allowlist of path patterns relative to upstreamBaseUrl. If unset, all paths allowed. */
  allowedPathPattern?: RegExp;
}

export const PROVIDERS: Record<string, ProviderSpec> = {
  anthropic: {
    id: 'anthropic',
    upstreamBaseUrl: 'https://api.anthropic.com',
    credentialEnv: 'ANTHROPIC_API_KEY',
    injectAuth: {
      kind: 'header',
      name: 'x-api-key',
      extraHeaders: { 'anthropic-version': '2023-06-01' },
    },
  },
  openrouter: {
    id: 'openrouter',
    upstreamBaseUrl: 'https://openrouter.ai/api',
    credentialEnv: 'OPENROUTER_API_KEY',
    injectAuth: { kind: 'header', name: 'Authorization', valuePrefix: 'Bearer ' },
  },
  groq: {
    id: 'groq',
    upstreamBaseUrl: 'https://api.groq.com/openai',
    credentialEnv: 'GROQ_API_KEY',
    injectAuth: { kind: 'header', name: 'Authorization', valuePrefix: 'Bearer ' },
  },
  telegram: {
    id: 'telegram',
    upstreamBaseUrl: 'https://api.telegram.org',
    credentialEnv: 'TELEGRAM_BOT_TOKEN',
    injectAuth: { kind: 'url-segment-bot' },
  },
  gmail: {
    id: 'gmail',
    upstreamBaseUrl: 'https://gmail.googleapis.com',
    credentialEnv: 'GMAIL_ACCESS_TOKEN',
    injectAuth: { kind: 'header', name: 'Authorization', valuePrefix: 'Bearer ' },
  },
};

/** Look up a provider by id (scope). Returns undefined if not registered. */
export function getProvider(id: string): ProviderSpec | undefined {
  return PROVIDERS[id];
}

/**
 * Build the upstream URL + auth headers for a given provider + subpath.
 * Returns null if the provider's credential is not configured in the environment.
 *
 * For Telegram (URL-segment auth) the credential is woven into the path:
 *   /telegram/sendMessage  →  https://api.telegram.org/bot<TOKEN>/sendMessage
 * For header-based providers the credential becomes a header and `subpath`
 * is appended to upstreamBaseUrl verbatim.
 */
export function resolveUpstream(
  provider: ProviderSpec,
  subpath: string,
  inboundQuery: string,
): { url: string; headers: Record<string, string> } | null {
  const credential = process.env[provider.credentialEnv];
  if (!credential) return null;

  if (provider.allowedPathPattern && !provider.allowedPathPattern.test(subpath)) {
    return null;
  }

  const normalizedSub = subpath.startsWith('/') ? subpath : `/${subpath}`;
  const query = inboundQuery && inboundQuery.length > 0
    ? (inboundQuery.startsWith('?') ? inboundQuery : `?${inboundQuery}`)
    : '';

  if (provider.injectAuth.kind === 'url-segment-bot') {
    return {
      url: `${provider.upstreamBaseUrl}/bot${credential}${normalizedSub}${query}`,
      headers: {},
    };
  }

  const headers: Record<string, string> = {};
  const inj = provider.injectAuth;
  headers[inj.name] = `${inj.valuePrefix ?? ''}${credential}`;
  if (inj.extraHeaders) Object.assign(headers, inj.extraHeaders);

  return {
    url: `${provider.upstreamBaseUrl}${normalizedSub}${query}`,
    headers,
  };
}
