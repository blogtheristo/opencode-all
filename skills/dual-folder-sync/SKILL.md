---
name: dual-folder-sync
triggers:
  - dual folder sync
  - landing-pages sync
  - sync dws10.com
  - sync dws6.com
  - sync onelifetime.world
  - sync lifetime.fi
description: >
  Use when modifying files in dws10.com/, onelifetime.world/, dws6.com/, or
  lifetime.fi/ root folders. CRITICAL: changes must be synced to the matching
  landing-pages/ folder in the same commit. Prevents production drift.
---

# Dual Folder Sync

**EVERY ROOT FOLDER CHANGE MUST SYNC TO LANDING-PAGES IN THE SAME COMMIT.**

## Folder Map

| Root (source of truth) | Production copy                    |
| ---------------------- | ---------------------------------- |
| `dws10.com/`           | `landing-pages/dws10-com/`         |
| `onelifetime.world/`   | `landing-pages/onelifetime-world/` |
| `dws6.com/`            | `landing-pages/dws6-com/`          |
| `lifetime.fi/`         | `landing-pages/lifetime-fi/`       |

## Workflow

1. Edit file in root folder (source of truth)
2. Copy changed file to `landing-pages/` equivalent path
3. Verify sync: `diff root/file landing-pages/site/file` - must be empty
4. Commit both in the same commit

## Store-Specific Checklist

When touching `buy/`, `products.json`, or store assets:

1. Edit `dws10.com/buy/index.html`
2. Copy to `landing-pages/dws10-com/buy/index.html`
3. Sync `config/products.json` to both locations
4. Sync `shared-assets/` changes
5. Sync category pages (`buy/page*/`)

## Common Mistakes

- Editing root folder and forgetting landing-pages (production shows old version)
- Editing landing-pages directly (next root sync overwrites your changes)
- Splitting sync across two commits (deploy picks up partial state)
- Forgetting `shared-assets/` or `config/` - only syncing HTML

## Verification

```bash
diff -rq dws10.com/buy/ landing-pages/dws10-com/buy/ | head -20
```

If this shows ANY differences after your commit, the sync is broken.

## Latent vs Deterministic

| Step                                                                              | Kind                 |
| --------------------------------------------------------------------------------- | -------------------- |
| Detect a write to `dws10.com/`, `onelifetime.world/`, `dws6.com/`, `lifetime.fi/` | Deterministic        |
| Compute mirror path under `landing-pages/<site>/`                                 | Deterministic        |
| Copy + `diff -rq` verification                                                    | Deterministic        |
| Block commit if `diff` shows any difference                                       | Deterministic (hook) |

This skill is entirely deterministic — there is no judgment step. The LLM does not get to decide whether to sync; the rule applies whenever the trigger fires.

Extracted from DWS CLAUDE.md Store Update Rule and Dual Folder Structure Rule.
