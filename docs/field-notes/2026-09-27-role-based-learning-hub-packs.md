# Role-Based Learning Hub Packs

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: GitHub Copilot CLI 1.0.88 (gpt-5.6-sol) | Session: copilot/role-learning-hub-0ee942b3 | Date: 27.09.2026 | Changes: Recorded separate offline Learning Hub packs for admin, investor, partner, and customer audiences, with role-aware dashboard discovery and Windows installation. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md + docs/system-config/STANDARDS_ROUTING.md | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Field Note
- Author: GitHub Copilot CLI
- Location: `/home/admin100/dws6`
- Context: Windows 11 Learning Hub distribution and role-based documentation discovery

---

## Ontology Tags

`learning-hub` · `documentation` · `role-based-distribution` · `windows-11` · `admin-dashboard` · `human-in-command`

## The Story

The downloaded `start-hic-hub.html` depended on its original repository-relative paths. Moving that single file into Windows Downloads while the repository remained on `F:` broke its document links. Hard-coding the repository drive would preserve the same portability failure.

The approved solution keeps repository documents canonical and generates four physically separate offline packs: `admin`, `investor`, `partner`, and `customer`. A declarative allowlist selects documents for each audience. Each pack contains local HTML, a role-specific manifest, version metadata, SHA-256 checksums, and a Windows installer that installs under the current user's `%LOCALAPPDATA%`.

The v10 dashboard now exposes a Documentation route through desktop and mobile navigation. It validates `user_metadata.role`, falls back to `customer` for unknown values, and lists only documents for that audience. The role value controls discovery only. Restricted-pack distribution still requires a separate authenticated or offline channel.

## The Insight

Documentation portability and documentation authorization are different controls. Relative repository links solve neither when a single HTML file is copied elsewhere. A portable pack needs a self-contained directory, while confidential role separation requires documents to be omitted from unauthorized packs rather than hidden by client-side navigation.

The dashboard therefore does not publish all packs under an assumed public URL. It enables document links only when an approved `VITE_LEARNING_HUB_BASE_URL` has been configured; otherwise it presents the correct role catalogue and directs the user to the installed pack.

## Next Steps

1. Decide which external audience pack is published first and through which authenticated or approved distribution channel.
2. Review the initial investor, partner, and customer allowlists before external distribution.
3. Add signing for `Install.ps1` when an operational code-signing certificate is available.

## HIC Learning Outcome

- Step 1 — KB: BLOCKED — `dws kb status` returned HTTP 401 because no authentication token was available; no KB content was written.
- Step 2 — Field note: Complete — this file.
- Step 3 — Learn HTML: Complete — `Learn/2026-09-27-role-based-learning-hub-packs.html`.
- Step 4 — Drive export: N/A — no Google Drive tool is available in this session.
- Step 5 — HIC decision: Q1 below.
- Step 6 — Calendar: N/A — this implementation created no dated commitment.

**Q1 — Which external pack should receive the first configured dashboard publication path?**

- Option A: Customer only.
- Option B: Customer and partner.
- Option C: Keep all packs offline until authenticated pack delivery exists.
- **RECOMMEND: Option C.** It preserves the physical distribution boundary and avoids turning role metadata into a false authorization control.
- Reversibility: Two-way door.
- Provenance: Verified from the implemented role manifest, dashboard behavior, and code review in this session.

---

**Document version:** v1.0 · **Date:** 27.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Business ID 0772407-9). All rights reserved.
**Internal.** This document is confidential to Lifetime Oy.
