import type { ConnectionOptions } from 'tls';

const SSL_QUERY_PARAMS = [
  'ssl',
  'sslmode',
  'sslcert',
  'sslkey',
  'sslrootcert',
  'sslcrl',
  'sslpassword',
  'sslsni',
];

export function sanitizePostgresConnectionString(rawUrl: string): string {
  const url = new URL(rawUrl);

  for (const param of SSL_QUERY_PARAMS) {
    url.searchParams.delete(param);
  }

  return url.toString();
}

export function getInsecureSslConfig(): ConnectionOptions {
  return {
    rejectUnauthorized: false,
  };
}

export function getConnectionDebugInfo(rawUrl: string): { host: string; port: string } {
  const url = new URL(rawUrl);
  return {
    host: url.hostname,
    port: url.port || '5432',
  };
}
