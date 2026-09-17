# Field Note: Shai-Hulud Returns — keyv Maintainer Compromise, 868-Package npm Worm — DWS Exposure Audit

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/npm-supply-chain-attack-vjpnqg | Date: 04.08.2026 | Changes: Initial field note — audit of dws6 and dws7 against the 2026-08-04 Shai-Hulud wave (keyv maintainer GitHub account takeover, ≥868 packages, ~2B monthly installs). Result: no exposure at current lockfile pins; freeze-install guidance issued.
- Version: 1.1 | Tool: Claude Code | Session: claude/npm-supply-chain-attack-vjpnqg | Date: 04.08.2026 | Changes: HIC approved both hardening controls ("Yes to both"). Landed: (1) `ignore-scripts=true` .npmrc in the 5 active keyv-carrying trees (v10-react + content-pipeline + their landing-pages mirrors, src/cloudflare) — install-script packages there are only esbuild/fsevents/sharp/workerd, all of which ship prebuilt binaries via optionalDependencies; fallback `npm rebuild <pkg> --foreground-scripts` documented in each .npmrc. (2) IOC denylist check in scripts/daily/dependabot-audit.sh against scripts/security/npm-ioc-denylist.txt — exact package@version match in every lockfile, fail-loud exit 2 on hit, hits recorded in logs/dependabot-audit.json `ioc_hits`. Denylist seeded with the five confirmed secondary infections; keyv-family exact versions to be appended at the 2026-08-07 freeze review.

Session Links & References:

- Claude Code (claude/npm-supply-chain-attack-vjpnqg): https://claude.ai/code

Document Status:

- Created: 04.08.2026
- Last Modified: 04.08.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Security Field Note / Threat Intelligence

Related Documents:

- DWS_SECURITY_STANDARD.md (§13 Supply Chain Integrity)
- docs/field-notes/2026-05-12-shai-hulud-npm-malware-ai-tooling-targeting.md ("Mini" Shai-Hulud, May 2026 wave)
- scripts/daily/dependabot-audit.sh, scripts/daily/agent-config-integrity.sh (daily supply-chain + agent-config IOC scans)

***

## Executive Summary

On 4 August 2026 the Shai-Hulud npm worm returned. The GitHub account of the maintainer behind **keyv** (~127M weekly downloads) was taken over; the attackers pushed malicious commits to main and cut releases with legitimate GitHub Actions provenance. A **preinstall hook fires on `npm install`** and drops a stealer that sweeps npm, GitHub, AWS, Kubernetes, and Vault secrets, then uses harvested maintainer tokens to republish more packages. At time of writing: **≥868 packages compromised, >2B monthly installs**, growing 50–100 packages every few minutes. The maintainer's other high-volume packages — **cacheable, flat-cache, file-entry-cache** — are in the blast radius. Exfiltration goes to a public GitHub repo described "Shai-Hulud: Here We Go Again".

**DWS exposure verdict: NOT EXPOSED at current pins — but at risk on any fresh unpinned install until the registry is cleaned.**

## 1. Audit Performed (dws6 @ branch claude/npm-supply-chain-attack-vjpnqg, dws7 @ main)

| Check | Result |
| --- | --- |
| keyv / cacheable / flat-cache / file-entry-cache in any dws6 `package.json` (direct deps) | **Absent** — present only as transitive deps of the ESLint toolchain |
| Resolved versions in all 13 dws6 `package-lock.json` trees | **keyv 4.5.4, flat-cache 4.0.1, file-entry-cache 8.0.0** — all releases long predating 2026-08-04; `cacheable` absent entirely |
| Known secondary-infection packages (@deliveroo/reevent, @or-sdk/*, @picsart/ai-sdk, @qlik/embed-runtime, picasso.js) | **Absent** from all manifests and lockfiles |
| `preinstall` hooks in any first-party `package.json` | **None** |
| Committed `node_modules`, worm artifacts (bundle.js / setup_bun.js), trufflehog strings, webhook.site endpoints | **None** — the only "shai-hulud" grep hits are our own prior security docs |
| `.github/workflows` in dws6 clone (CI npm-install surface) | **None present** |
| dws7 repository contents | `docs/` and `templates/` only — **no npm surface** |

Lockfile trees carrying the keyv family (all via eslint → flat-cache → keyv): `dws6.com/dashboard/firehorse/v10-react`, `dws6.com/tools/content-pipeline`, `src/cloudflare`, both `landing-pages/` mirrors, `mobile-dashboard_RETIRED`.

## 2. Residual Risk

1. **Caret ranges.** Manifests declare `keyv: ^4.5.4`, `flat-cache: ^4.0.0`, `file-entry-cache: ^8.0.0`. A lockfile-less `npm install`, an `npm update`, or a lockfile regeneration **today** can resolve to a poisoned release. The lockfile is the only thing standing between us and the worm.
2. **Exact poisoned version numbers: unverified.** Vendor advisories (Aikido, Wiz, Unit42) were unreachable through the session egress proxy (HTTP 403); the compromised-version list could not be confirmed. Treat *any* keyv-family version released on/after 2026-08-04 as hostile until advisories are re-checked.
3. **Developer machines.** The repo audit says nothing about laptops/nodes where `npm install` may have run on 2026-08-04 in any project depending on the keyv family. This wave steals npm, GitHub, AWS, K8s, and Vault credentials and persists beyond package removal (see May 2026 field note for the `.claude/settings.json` / `.vscode/tasks.json` persistence pattern of the prior wave).

## 3. Mitigations (effective immediately)

- **Freeze:** `npm ci` only; no `npm install` of new packages, no `npm update`, no lockfile regeneration in any DWS project until registry cleanup is confirmed. Prefer `npm ci --ignore-scripts` where the build allows.
- **Do not bump** the ESLint toolchain or anything that transitively resolves the keyv family during the freeze window.
- **Daily scans already in place** (`scripts/daily/dependabot-audit.sh` with autofix opt-in only, `scripts/daily/agent-config-integrity.sh`) cover the drift and persistence surfaces from the May wave; keep them running.
- **Re-check on 2026-08-07:** confirm advisory version lists, verify npm has purged the poisoned releases, then lift the freeze.

## 3b. Controls Landed (HIC-approved, 04.08.2026 — "Yes to both")

1. **Install-script execution disabled** in the 5 active keyv-carrying trees via `.npmrc` `ignore-scripts=true` (`dws6.com/dashboard/firehorse/v10-react`, `dws6.com/tools/content-pipeline`, both `landing-pages/` mirrors, `src/cloudflare`). The only install-script packages in those lockfiles are esbuild, fsevents, sharp, workerd — all function without scripts via prebuilt `optionalDependencies` binaries; fallback `npm rebuild <pkg> --foreground-scripts` is documented inline in each `.npmrc`. This closes the preinstall-hook entry point every Shai-Hulud wave has used.
2. **Daily IOC denylist detection**: `scripts/daily/dependabot-audit.sh` now greps every lockfile for exact `package@version` pairs in `scripts/security/npm-ioc-denylist.txt`; a hit prints a quarantine instruction, lands in `logs/dependabot-audit.json` (`ioc_hits`), and exits 2 (fail loud). Denylist seeded with the five confirmed secondary infections; keyv-family exact versions get appended at the 07.08. freeze review.

## 4. The Pattern That Keeps Repeating

Third Shai-Hulud-family event documented in this repo (Sep 2025 original; May 2026 "Mini"; Aug 2026 "Here We Go Again"). The constant: **install-time script execution of transitively trusted code**. The durable DWS posture is lockfile discipline plus `--ignore-scripts` by default, not per-incident firefighting. Candidate `/learn` item: codify a repo-wide install-freeze switch and an IOC package denylist check into the daily dependabot audit.

## 5. HIC Learning Outcome Record (DWS_LEARNING_STANDARD)

1. Knowledge base: **N/A** — no `kb/` directory exists in this clone; content carried by this field note.
2. Field note: this document.
3. `Learn/` HTML: **N/A** — Bash execution blocked by session safety classifier; `scripts/render-doc.sh` could not run. Regenerate in a local session.
4. Drive export: done from session (Google Drive copy of this note; repo remains source of truth).
5. Decision question: put to HIC in session chat (token rotation scope + control approval — both answered 04.08.2026).
6. Calendar: 2026-08-07 re-check event created ("Shai-Hulud freeze review — lift npm install freeze?").

## Sources

- International Cyber Digest, 2026-08-04: https://x.com/IntCyberDigest/status/2084636007790449126
- Cyberpress: https://cyberpress.org/shai-hulud-npm-worm-compromises-868-packages/
- GBHackers: https://gbhackers.com/shai-hulud-supply-chain-attack-compromises-keyv/
- Aikido: https://www.aikido.dev/blog/keyv-and-friends-compromised-in-npm-supply-chain-attack (403 via proxy — unverified)
- Wiz: https://www.wiz.io/blog/keyv-and-cacheable-npm-supply-chain-attack (403 via proxy — unverified)
- Unit42 (prior waves): https://unit42.paloaltonetworks.com/npm-supply-chain-attack/
