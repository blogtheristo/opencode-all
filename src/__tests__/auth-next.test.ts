import { describe, expect, it } from 'vitest';

function sanitizeNextPath(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;
  let path = raw.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    return null;
  }
  if (!path.startsWith('/')) return null;
  if (path.startsWith('//') || path.includes('://') || path.includes('\\')) return null;
  if (path.includes('..')) return null;
  if (!/^\/dashboard(\/|$|\?)/.test(path)) return null;
  return path;
}

describe('sanitizeNextPath', () => {
  it('allows Mission Control', () => {
    expect(sanitizeNextPath('/dashboard/mission-control/')).toBe('/dashboard/mission-control/');
  });

  it('rejects open redirects', () => {
    expect(sanitizeNextPath('https://evil.example/')).toBeNull();
    expect(sanitizeNextPath('//evil.example/dashboard/')).toBeNull();
    expect(sanitizeNextPath('/login/')).toBeNull();
    expect(sanitizeNextPath('/dashboard/../login/')).toBeNull();
  });
});
