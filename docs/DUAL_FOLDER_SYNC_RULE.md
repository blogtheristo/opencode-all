---
name: dual-folder-sync
description: Dual-folder sync enforcement for dws10.com ↔ landing-pages/dws10-com
metadata:
  type: reference
---

# Dual-Folder Sync Rule

**Status:** Enforced  
**Scope:** All files in `dws10.com/` must be mirrored to `landing-pages/dws10-com/` in the same commit

---

## Rationale

DWS maintains two deployment copies for Cloudflare Pages:

- **Source:** `dws10.com/` — primary source directory
- **Mirror:** `landing-pages/dws10-com/` — Cloudflare deployment target

Keeping them byte-identical ensures:

- ✅ Consistent deployment across both domains
- ✅ No divergence or stale files in the mirror
- ✅ Single source of truth (source directory)
- ✅ Reversible migrations (both can be reverted together)

---

## Rule

**Every commit that touches `dws10.com/` MUST also update `landing-pages/dws10-com/` with identical content.**

Files must be **byte-identical** — no formatting changes, no partial syncs.

---

## Enforcement

### Automated Pre-Commit Hook

A git hook automatically validates the sync before commit:

```bash
./scripts/install-hooks.sh  # Install hooks (one-time)
git commit ...              # Hook runs automatically
```

If a commit tries to change `dws10.com/` without syncing `landing-pages/dws10-com/`, it is **blocked**:

```
❌ COMMIT BLOCKED: Dual-Folder Sync violation
   dws10.com/ changes must be mirrored to landing-pages/dws10-com/

   To fix:
   1. ./scripts/validate-dual-folder-sync.sh --fix
   2. git add landing-pages/dws10-com/
   3. git commit
```

### Manual Validation

Check sync status anytime:

```bash
./scripts/validate-dual-folder-sync.sh          # Check only
./scripts/validate-dual-folder-sync.sh --fix    # Fix and report
```

---

## Workflow

### When updating `dws10.com/`

1. **Make changes** to `dws10.com/`
2. **Stage changes** — `git add dws10.com/...`
3. **Run sync** — `./scripts/validate-dual-folder-sync.sh --fix`
4. **Stage mirror** — `git add landing-pages/dws10-com/`
5. **Commit** — `git commit -m "..."`

**Or** use the pre-commit hook (automatic after step 5).

### Example: Updating Aegis product page

```bash
# Edit the source
vi dws10.com/products/aegis.html

# Stage it
git add dws10.com/products/aegis.html

# Fix sync (copies to mirror)
./scripts/validate-dual-folder-sync.sh --fix

# Stage the mirror
git add landing-pages/dws10-com/products/aegis.html

# Commit (hook validates before commit)
git commit -m "feat: Aegis product page hreflang + language footer"
```

---

## Exceptions

**None.** Every file in `dws10.com/` that goes to production **must** be mirrored.

Deployments happen via Cloudflare Pages, which reads from:

- `dws10.com/` → deploys to `https://dws10.com/`
- `landing-pages/dws10-com/` → serves as backup/mirror

Both must stay in sync to ensure no deployment divergence.

---

## Implementation Details

**Sync Script:** `scripts/validate-dual-folder-sync.sh`

- Uses `diff -r` to find differences
- Uses `rsync` to copy files when fixing
- Checks both files AND directories

**Pre-Commit Hook:** `scripts/hooks/pre-commit-dual-folder-sync.sh`

- Runs only if `dws10.com/` files are staged
- Blocks commit if sync would be violated
- Provides clear fix instructions

**Installation:** `scripts/install-hooks.sh`

- Creates symlink from `.git/hooks/pre-commit-*` to `scripts/hooks/`
- Wraps sub-hooks in main `.git/hooks/pre-commit` orchestrator
- One-time setup per repository clone

---

## Troubleshooting

### "Commit blocked: Dual-Folder Sync violation"

**Fix:**

```bash
./scripts/validate-dual-folder-sync.sh --fix
git add landing-pages/dws10-com/
git commit
```

### Hook not running

**Ensure hooks are installed:**

```bash
./scripts/install-hooks.sh
ls -l .git/hooks/pre-commit*  # Should show symlinks
```

### Manual sync verification

```bash
diff -r dws10.com/ landing-pages/dws10-com/  # Should show no output
```

---

## Related Files

- `scripts/validate-dual-folder-sync.sh` — Sync validator
- `scripts/hooks/pre-commit-dual-folder-sync.sh` — Git hook
- `scripts/install-hooks.sh` — Hook installer
- `CLAUDE.md` § "Source-of-Truth Rules" — Policy overview

---

**Last updated:** 2026-09-13  
**Enforced since:** PR #2014
