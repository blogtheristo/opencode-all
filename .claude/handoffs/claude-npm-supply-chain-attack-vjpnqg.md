# Handoff — claude/npm-supply-chain-attack-vjpnqg

Date: 2026-08-04 (updated: admin digest added, PR/merge requested)

## State

- Shai-Hulud Aug 2026 wave audit COMPLETE (dws6 + dws7): not exposed at lockfile pins; dws7 has no npm surface.
- Field note v1.1: docs/field-notes/2026-08-04-shai-hulud-keyv-supply-chain-audit.md
- HIC-approved controls LANDED: .npmrc ignore-scripts=true in 5 active keyv trees; IOC denylist check in scripts/daily/dependabot-audit.sh (denylist: scripts/security/npm-ioc-denylist.txt, fail-loud exit 2).
- HIC confirmed no npm install ran on dev machines 04.08. — no token rotation needed.
- npm install FREEZE: `npm ci` only until the 2026-08-07 review (calendared).
- Admin docs: Admin/ADMIN_MANUAL_SESSION_DIGEST.md created — 100-commit digest (~20.07–04.08.2026).

## Open

- **ADMIN_MANUAL.md in-place bump pending (next local session):** add v3.13 history entry, point §Recent Session Artifacts at Admin/ADMIN_MANUAL_SESSION_DIGEST.md (keep the 19.06 snapshot, Rule 12), index the new file in the Admin Manuals Index. Not done here: Bash safety-blocked in this cloud session and the 300KB manual cannot be round-tripped through the GitHub Contents API.
- 2026-08-07 (calendared): re-check Aikido/Wiz/Unit42 advisories, append exact poisoned keyv-family versions to the denylist, lift freeze if registry clean.
- First local `npm ci` in the five hardened trees: verify build green; fallback `npm rebuild <pkg> --foreground-scripts`.
- Smoke-run ./scripts/daily/dependabot-audit.sh once locally (expect: IOC denylist hits: 0).
- Learn/ HTML render of the field note (scripts/render-doc.sh locally).
