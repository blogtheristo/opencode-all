import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
};

const execFileMock = vi.fn();

vi.mock('../utils/logger.js', () => ({ default: logger }));
vi.mock('child_process', () => ({ execFile: execFileMock }));

function jsonResponse(status: number, payload: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  } as Response;
}

async function runLoadSecrets(): Promise<void> {
  const { loadSecrets } = await import('../config/secret-loader.js');
  await loadSecrets();
}

const envSnapshot = { ...process.env };

beforeEach(() => {
  process.env = { ...envSnapshot };
  delete process.env.VAULT_PROVIDER;
  delete process.env.GCP_SECRET_LOADER;
  delete process.env.GCP_PROJECT_ID;
  delete process.env.AIVEN_DATABASE_URL;
  delete process.env.AIVEN_VAULT_KEY;
  delete process.env.SUPABASE_URL;
  delete process.env.JWT_SECRET;

  logger.info.mockReset();
  logger.warn.mockReset();
  logger.error.mockReset();
  logger.debug.mockReset();
  execFileMock.mockReset();
});

afterEach(() => {
  vi.unstubAllGlobals();
  process.env = { ...envSnapshot };
});

describe('loadSecrets (disabled)', () => {
  it('is a no-op when VAULT_PROVIDER is not set', async () => {
    await runLoadSecrets();
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('disabled'),
    );
  });

  it('warns and skips on unknown provider', async () => {
    process.env.VAULT_PROVIDER = 'mystery';
    await runLoadSecrets();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('unknown provider'),
    );
  });
});

describe('loadSecrets (GCP provider)', () => {
  it('supports legacy GCP_SECRET_LOADER, decodes values, and does not overwrite existing env vars', async () => {
    process.env.GCP_SECRET_LOADER = 'true';
    process.env.GCP_PROJECT_ID = 'prod-project';
    process.env.JWT_SECRET = 'already-set';

    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      if (url.includes('metadata.google.internal')) {
        return jsonResponse(200, { access_token: 'meta-token' });
      }
      if (url.includes('/supabase-url/')) {
        expect(init?.signal).toBeDefined();
        return jsonResponse(200, {
          payload: { data: Buffer.from('https://vault.supabase.co').toString('base64') },
        });
      }
      if (url.includes('/jwt-secret/')) {
        return jsonResponse(200, {
          payload: { data: Buffer.from('from-vault').toString('base64') },
        });
      }
      return jsonResponse(404, {});
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    await runLoadSecrets();

    expect(process.env.SUPABASE_URL).toBe('https://vault.supabase.co');
    expect(process.env.JWT_SECRET).toBe('already-set');
    expect(fetchMock).toHaveBeenCalled();
  });

  it('falls back to gcloud ADC token when metadata server is unavailable', async () => {
    process.env.VAULT_PROVIDER = 'gcp';
    process.env.GCP_PROJECT_ID = 'prod-project';

    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('metadata.google.internal')) {
        throw new Error('metadata unavailable');
      }
      return jsonResponse(200, {});
    });

    execFileMock.mockImplementation(
      (_file: string, _args: string[], callback: (err: Error | null, stdout: string, stderr: string) => void) => {
        callback(null, 'cli-token\n', '');
      },
    );

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    await runLoadSecrets();

    expect(execFileMock).toHaveBeenCalledWith(
      'gcloud',
      ['auth', 'application-default', 'print-access-token'],
      expect.any(Function),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('metadata.google.internal'),
      expect.any(Object),
    );
  });

  it('logs non-OK secret fetch responses at debug level', async () => {
    process.env.VAULT_PROVIDER = 'gcp';
    process.env.GCP_PROJECT_ID = 'prod-project';

    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes('metadata.google.internal')) {
        return jsonResponse(200, { access_token: 'meta-token' });
      }
      if (url.includes('/smtp-host/')) {
        return jsonResponse(403, {});
      }
      return jsonResponse(200, {});
    });

    vi.stubGlobal('fetch', fetchMock as unknown as typeof fetch);

    await runLoadSecrets();

    expect(logger.debug).toHaveBeenCalledWith(
      'GCP provider: secret fetch returned non-OK status',
      expect.objectContaining({ projectId: 'prod-project', secretName: 'smtp-host', status: 403 }),
    );
  });

  it('skips when GCP_PROJECT_ID is missing', async () => {
    process.env.VAULT_PROVIDER = 'gcp';

    await runLoadSecrets();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('GCP_PROJECT_ID not set'),
    );
  });
});

describe('loadSecrets (Aiven provider)', () => {
  it('skips when AIVEN_DATABASE_URL is missing', async () => {
    process.env.VAULT_PROVIDER = 'aiven';

    await runLoadSecrets();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('AIVEN_DATABASE_URL not set'),
    );
  });
});
