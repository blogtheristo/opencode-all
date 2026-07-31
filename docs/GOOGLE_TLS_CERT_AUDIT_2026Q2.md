# Google TLS Certificate Migration Audit — Q2 2026

**Trigger:** Google Cloud notice (received 2026-05-27) — many Google endpoints, including `googleapis.com`, will shift to the **Google Trust Services WE1** intermediate CA with **ECDSA** leaf certificates in late Q2 2026. Action advised before **2026-06-15**.

**Risk model:** Two failure modes break clients during this rotation:
1. **Certificate pinning** — pinning intermediate or leaf certs against a fixed value.
2. **Custom trust stores** — restricting trust to a subset of CAs that omits the GTS Roots.

**Scope:** Full dws6 repo (TypeScript, JavaScript, Python, shell, config), excluding `node_modules/`, `.git/`, `.venv/`.

**Branch:** `claude/google-tls-cert-audit-9lpD0`

---

## Verdict

**No action required.** The repo does not pin certificates and does not constrain trust to a subset of CAs. Every Google API call goes through standard HTTPS clients that defer to the host OS trust store, which will automatically accept the WE1 intermediate and ECDSA leaf once the OS CA bundle is current.

| Risk category                    | Status   | Notes                                                    |
| -------------------------------- | -------- | -------------------------------------------------------- |
| Certificate pinning              | Clean    | No SHA-256 fingerprints, no pinned PEMs, no SPKI checks. |
| Custom trust stores              | Clean    | No `NODE_EXTRA_CA_CERTS` / `REQUESTS_CA_BUNDLE` / `SSL_CERT_FILE` / `CURL_CA_BUNDLE`. |
| Embedded CA / leaf certs in repo | Clean    | No `*.pem` / `*.crt` / `*.cer` / `*.p12` files committed. |
| GTS WE1 / GTS roots referenced   | N/A      | Not referenced, not pinned — correct posture.            |
| Host OS CA bundle dependency     | Standard | Implicit; ensure base images include up-to-date roots.   |

---

## Google services in use (blast radius)

These endpoints will migrate to WE1 / ECDSA and must remain reachable:

| File | Endpoint | Client |
| ---- | -------- | ------ |
| `src/sandbox/cloudrun-ephemeral.ts:277,299,320,352` | `${region}-run.googleapis.com` (Cloud Run Admin API) | native `fetch` |
| `src/config/secret-loader.ts:202` | `secretmanager.googleapis.com` | native `fetch` |
| `src/config/secret-loader.ts:138` | `metadata.google.internal` (HTTP, not TLS — unaffected) | native `fetch` |
| `src/agents/llm-client.ts:228` | `generativelanguage.googleapis.com` (Gemini) | native `fetch` |
| `src/agents/seo/seo-audit.agent.ts:398` | `www.googleapis.com/pagespeedonline` | native `fetch` |
| `src/broker/providers.ts:62` | `gmail.googleapis.com` | proxied upstream |
| `src/mcp/security/domain_validator.py:42` | `storage.googleapis.com` (allowlist entry) | n/a (validator) |
| `Reports/upload_to_drive.py` | Google Drive API | `google-auth` + `googleapiclient` |
| `mcp-servers/cloudrun_OLD/server.py` | Cloud Monitoring metrics | `google-cloud-monitoring` (legacy `_OLD`, dormant) |
| `src/app.ts:128` | `fonts.googleapis.com` (CSP allow only) | n/a (browser) |

All clients are stock libraries (`fetch`, `axios`, `httpx`, `google-auth-library`, `googleapiclient.discovery`) that use the system trust store with no overrides. None of them implement pinning.

---

## Patterns searched (and not found)

- `ca:` / `cert:` options on `https.Agent`, `https.request`, `tls.connect`, `axios`, `node-fetch`, `got`
- `httpsAgent` constructions with custom roots
- `crypto.createPublicKey` / `X509Certificate` validation against fixed values
- Python: `ssl.create_default_context(cafile=...)`, `verify=` pointing at a custom path, `certifi.where()` overrides, custom `HTTPAdapter` with pinned trust
- Hardcoded SHA-256 fingerprints, SPKI hashes, or PEM blobs
- Env-var-based trust narrowing: `NODE_EXTRA_CA_CERTS`, `REQUESTS_CA_BUNDLE`, `CURL_CA_BUNDLE`, `SSL_CERT_FILE`
- Substrings: `sslPinning`, `certPinning`, `pinned`, `GTS Root`, `GTS WE1` (the three apparent `WE1` hits in `package-lock.json` are coincidental base64 substrings inside npm `integrity` hashes — not certificate material)

---

## Out-of-scope finding (logged, not in this audit's blast radius)

`scripts/lib/pg-connection.ts:24-28` exports `getInsecureSslConfig()` returning `{ rejectUnauthorized: false }`. Callers: `scripts/apply-migration-042.ts`, `scripts/apply-migration-043.ts`, `scripts/test-db-connection.ts`. These are **Postgres** migration/test scripts (Aiven), not Google endpoints — irrelevant to the WE1 rotation. Production Aiven connections in `src/config/secret-loader.ts:98` correctly use `rejectUnauthorized: true`. Flagging for a separate cleanup, not for this audit.

---

## Recommendations

1. **Do nothing in application code.** The repo already follows Google's recommended posture (no pinning, no custom trust store).
2. **Verify base-image CA bundle freshness** for any container that calls Google APIs:
   - Node base images: ensure `ca-certificates` package is current.
   - Python base images: ensure `certifi` is on a recent version (Q2 2026 or later releases include all GTS Roots).
   - Cloud Run / GKE / Cloud Build runners on managed Google infrastructure inherit current roots automatically.
3. **No allowlist work required** in `src/mcp/security/domain_validator.py` — domain allowlists are unrelated to certificate trust.
4. **Re-run this audit if any of the following are added later:**
   - A pinning library (`node-cert-pin`, `ssl-pinning-plugin`, `trustkit`)
   - Any env var in {`NODE_EXTRA_CA_CERTS`, `REQUESTS_CA_BUNDLE`, `SSL_CERT_FILE`, `CURL_CA_BUNDLE`}
   - Any committed `*.pem` / `*.crt` used as a trust anchor
   - A custom `https.Agent` or Python `HTTPAdapter` with `ca` / `verify` overrides

---

## Method

```
grep -rn for: ca:, cert:, httpsAgent, rejectUnauthorized, sslPinning, certPinning,
              NODE_EXTRA_CA_CERTS, REQUESTS_CA_BUNDLE, CURL_CA_BUNDLE, SSL_CERT_FILE,
              certifi, create_default_context, HTTPAdapter, GTS, WE1, googleapis
find for:    *.pem, *.crt, *.cer, *.p12, *.pfx (none committed)
enumerate:   all googleapis.com / google.com / google-auth / @google-cloud usage
```

Audit completed 2026-05-27 against `HEAD` of `claude/google-tls-cert-audit-9lpD0`.
