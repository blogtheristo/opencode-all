# DWS Core Artifacts

This directory contains **validated enterprise knowledge** that forms the foundation of the Lifetime World Model (LWM).

## Purpose

Core Artifacts are the answer to the challenge: *"How do we make AI work for regulated, precise enterprise tasks?"*

Each artifact contains:
- **Validated knowledge** from field experience
- **Enterprise-specific** business logic
- **Actionable** orchestration rules
- **Versioned** evolution history
- **Traceable** source attribution

## Directory Structure

```
artifacts/
├── FINANCIAL_SERVICES/   # Banking, insurance, underwriting
├── MANUFACTURING/        # Production, quality, supply chain
├── HEALTHCARE/           # Medical, diagnostics, patient care
├── COMPLIANCE/           # Legal, regulatory, audit
├── STRATEGY/             # Business strategy, competitive intel
├── TECHNOLOGY/           # Architecture, security, infrastructure
├── SALES/                # Customer insights, competitive wins
└── GENERAL/              # Cross-functional knowledge
```

## Naming Convention

**Format:** `ART-[YYYY]-[NNN]-[descriptive-name].md`

**Examples:**
- `ART-2026-001-enterprise-ai-ontology.md`
- `ART-2026-002-uk-cross-border-underwriting.md`
- `ART-2026-003-eu-gdpr-updates.md`

## Creating a Core Artifact

1. **Start with a Field Note:** Capture raw observation in `/docs/field-notes/`
2. **Validate:** Confirm with 2+ team members
3. **Draft Artifact:** Use template from `ONTOLOGY.md` Section 5
4. **Test Logic:** Apply to 2-3 real cases
5. **Publish:** Save here, update database, generate embeddings

## Quality Standards

Before publishing an artifact:
- [ ] Validated by at least 2 team members
- [ ] Contains specific business logic (not generic advice)
- [ ] Has clear ontology anchors (geography, sector, etc.)
- [ ] Includes source attribution (field note, regulation, etc.)
- [ ] Assigned initial confidence score (0.5-0.75 for new)
- [ ] Linked to related artifacts or regulations
- [ ] Follows naming convention

## Review Cycle

- **Every 90 days:** Review all artifacts
- **Flag for update:** If used but confidence < 0.7
- **Flag for deprecation:** If unused for 180 days
- **Immediate review:** If world model collision detected

## Operational snapshots (git-tracked)

Ephemeral **PR / worktree exports** sometimes land here for dreaming and merge triage (large trees — prefer periodic cleanup or archival policy):

| Path | Typical use |
|------|-------------|
| `pr925-view.json` | PR metadata export |
| `pr925-worktree/` | Full worktree for parallel agents or backlog replay |
| `pr1295-mergecheck/` | Merge-conflict check snapshot |

See `.claude/clawdbot/proposals/dream-on-2026-05-14.md` for the latest continuation memo tied to these snapshots.

## Related Documents

- **Ontology Framework:** `/ONTOLOGY.md`
- **Document Standard:** `/DWS_DOCUMENT_STANDARD.md`
- **Field Notes:** `/docs/field-notes/`

---

**Questions?** Contact ontology@dws-iq.com
