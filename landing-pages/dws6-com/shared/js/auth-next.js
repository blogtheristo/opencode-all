/**
 * Safe post-login return path. Only same-origin /dashboard/ URLs.
 * Evidence: Tool=Cursor Agent Date=2026-09-17
 */

export function sanitizeNextPath(raw) {
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
