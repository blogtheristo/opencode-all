/**
 * URL Guard Tests — SSRF defense
 *
 * Covers:
 *   - IPv4 private/loopback/link-local/CGNAT/multicast/reserved
 *   - IPv6 loopback/link-local/unique-local/IPv4-mapped
 *   - Cloud metadata IP (AWS/GCP/Azure 169.254.169.254)
 *   - Local hostnames (localhost, *.local, *.internal)
 *   - DNS resolution paths (mocked) including resolves-to-private
 *   - BROWSE_ALLOW_PRIVATE=1 override
 *   - Bad scheme + invalid URL
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// dns/promises is invoked lazily inside assertPublicUrl
vi.mock('node:dns/promises', () => ({
  lookup: vi.fn(),
}));

import { lookup } from 'node:dns/promises';
import { assertPublicUrl, isPrivateOrUnsafeIp, SsrfBlockedError } from '../utils/url-guard.js';

const lookupMock = lookup as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  delete process.env.BROWSE_ALLOW_PRIVATE;
  lookupMock.mockReset();
});

describe('isPrivateOrUnsafeIp — IPv4', () => {
  const cases: Array<[string, boolean, string]> = [
    ['8.8.8.8', false, 'public Google DNS'],
    ['1.1.1.1', false, 'public Cloudflare DNS'],
    ['127.0.0.1', true, 'loopback'],
    ['127.255.255.255', true, 'loopback range'],
    ['10.0.0.1', true, 'RFC1918 10/8'],
    ['172.16.0.1', true, 'RFC1918 172.16/12 lower'],
    ['172.31.255.254', true, 'RFC1918 172.16/12 upper'],
    ['172.32.0.1', false, 'just outside 172.16/12'],
    ['172.15.255.255', false, 'just below 172.16/12'],
    ['192.168.1.1', true, 'RFC1918 192.168/16'],
    ['169.254.169.254', true, 'AWS/GCP/Azure metadata IP'],
    ['169.254.0.1', true, 'link-local'],
    ['100.64.0.1', true, 'CGNAT lower'],
    ['100.127.255.255', true, 'CGNAT upper'],
    ['100.128.0.1', false, 'just outside CGNAT'],
    ['100.63.255.255', false, 'just below CGNAT'],
    ['0.0.0.0', true, 'unspecified'],
    ['224.0.0.1', true, 'multicast'],
    ['239.255.255.255', true, 'multicast end'],
    ['240.0.0.1', true, 'reserved'],
    ['255.255.255.255', true, 'broadcast'],
    ['not.an.ip', true, 'unparseable → deny'],
  ];

  for (const [addr, expected, label] of cases) {
    it(`${addr} (${label}) → ${expected ? 'BLOCK' : 'allow'}`, () => {
      expect(isPrivateOrUnsafeIp(addr)).toBe(expected);
    });
  }
});

describe('isPrivateOrUnsafeIp — IPv6', () => {
  const cases: Array<[string, boolean, string]> = [
    ['2606:4700:4700::1111', false, 'public Cloudflare DNS'],
    ['2001:4860:4860::8888', false, 'public Google DNS'],
    ['::1', true, 'loopback'],
    ['::', true, 'unspecified'],
    ['fe80::1', true, 'link-local'],
    ['fc00::1', true, 'unique-local fc'],
    ['fd12:3456:789a::1', true, 'unique-local fd'],
    ['ff02::1', true, 'multicast'],
    ['::ffff:127.0.0.1', true, 'IPv4-mapped loopback'],
    ['::ffff:169.254.169.254', true, 'IPv4-mapped metadata'],
    ['::ffff:8.8.8.8', false, 'IPv4-mapped public'],
  ];

  for (const [addr, expected, label] of cases) {
    it(`${addr} (${label}) → ${expected ? 'BLOCK' : 'allow'}`, () => {
      expect(isPrivateOrUnsafeIp(addr)).toBe(expected);
    });
  }
});

describe('assertPublicUrl — schemes', () => {
  it('rejects file:// even with BROWSE_ALLOW_PRIVATE=1', async () => {
    process.env.BROWSE_ALLOW_PRIVATE = '1';
    await expect(assertPublicUrl('file:///etc/passwd')).rejects.toThrow(SsrfBlockedError);
  });
  it('rejects javascript:', async () => {
    await expect(assertPublicUrl('javascript:alert(1)')).rejects.toThrow(/scheme/);
  });
  it('rejects malformed URL', async () => {
    await expect(assertPublicUrl('not a url')).rejects.toThrow(/Invalid URL/);
  });
});

describe('assertPublicUrl — IP literals (no DNS)', () => {
  it('rejects http://127.0.0.1', async () => {
    await expect(assertPublicUrl('http://127.0.0.1/admin')).rejects.toThrow(/private-ip-literal/);
    expect(lookupMock).not.toHaveBeenCalled();
  });
  it('rejects http://169.254.169.254 (cloud metadata)', async () => {
    await expect(assertPublicUrl('http://169.254.169.254/latest/meta-data/')).rejects.toThrow(
      /private-ip-literal/,
    );
  });
  it('rejects http://[::1]', async () => {
    await expect(assertPublicUrl('http://[::1]/')).rejects.toThrow(/private-ip-literal/);
  });
  it('allows http://8.8.8.8', async () => {
    await expect(assertPublicUrl('http://8.8.8.8/')).resolves.toBeUndefined();
    expect(lookupMock).not.toHaveBeenCalled();
  });
});

describe('assertPublicUrl — local hostnames (no DNS)', () => {
  for (const host of ['localhost', 'foo.local', 'bar.internal', 'baz.intranet', 'x.localhost']) {
    it(`rejects http://${host}/`, async () => {
      await expect(assertPublicUrl(`http://${host}/`)).rejects.toThrow(/local-hostname/);
      expect(lookupMock).not.toHaveBeenCalled();
    });
  }
});

describe('assertPublicUrl — DNS resolution', () => {
  it('allows hostname that resolves to public IP', async () => {
    lookupMock.mockResolvedValueOnce([{ address: '93.184.216.34', family: 4 }]);
    await expect(assertPublicUrl('https://example.com/')).resolves.toBeUndefined();
  });
  it('rejects hostname that resolves to private IP (DNS rebinding-style)', async () => {
    lookupMock.mockResolvedValueOnce([{ address: '10.0.0.5', family: 4 }]);
    await expect(assertPublicUrl('https://attacker.example/')).rejects.toThrow(/private-resolved/);
  });
  it('rejects when ANY resolved address is private (mixed answers)', async () => {
    lookupMock.mockResolvedValueOnce([
      { address: '93.184.216.34', family: 4 },
      { address: '127.0.0.1', family: 4 },
    ]);
    await expect(assertPublicUrl('https://multi.example/')).rejects.toThrow(/private-resolved/);
  });
  it('rejects when DNS lookup fails', async () => {
    lookupMock.mockRejectedValueOnce(new Error('ENOTFOUND'));
    await expect(assertPublicUrl('https://no-such-host.invalid/')).rejects.toThrow(/unresolvable/);
  });
});

describe('assertPublicUrl — BROWSE_ALLOW_PRIVATE override', () => {
  it('allows http://127.0.0.1 when override is set', async () => {
    process.env.BROWSE_ALLOW_PRIVATE = '1';
    await expect(assertPublicUrl('http://127.0.0.1:8080/')).resolves.toBeUndefined();
  });
  it('allows http://localhost when override is set', async () => {
    process.env.BROWSE_ALLOW_PRIVATE = '1';
    await expect(assertPublicUrl('http://localhost:3000/')).resolves.toBeUndefined();
  });
  it('still rejects bad scheme even with override', async () => {
    process.env.BROWSE_ALLOW_PRIVATE = '1';
    await expect(assertPublicUrl('ftp://example.com/')).rejects.toThrow(/scheme/);
  });
});
