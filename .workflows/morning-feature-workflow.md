# Morning Feature Workflow

**Purpose:** Start the day with a clean feature branch, green build and tests, then implement.

---

## What it does

1. **Builds the feature branch** — Creates or checks out `claude/<feature-name>` from `main`, pulls latest.
2. **Validates** — Runs `npm run build` and `npm run test` so the branch is green.
3. **Optional** — Run workflow fix-agent to apply one automated fix from the latest audit.
4. **Then** — You implement your feature on this branch and commit/push.

---

## Usage

### Windows (PowerShell)

```powershell
cd F:\2026\Repos2026\dws6
.\scripts\morning-feature-workflow.ps1 -FeatureName "compliance-dashboard"
```

With optional fix-agent after build/test:

```powershell
.\scripts\morning-feature-workflow.ps1 -FeatureName "v2-carbon-reporting" -RunFixAgent
```

Create a **worktree** instead of branching in-place:

```powershell
.\scripts\morning-feature-workflow.ps1 -FeatureName "compliance-dashboard" -UseWorktree
```

### Linux / macOS / Chromebook (bash)

```bash
cd /path/to/dws6
./scripts/morning-feature-workflow.sh compliance-dashboard
```

With fix-agent:

```bash
./scripts/morning-feature-workflow.sh v2-carbon-reporting --run-fix-agent
```

Worktree mode:

```bash
./scripts/morning-feature-workflow.sh compliance-dashboard --use-worktree
```

---

## Parameters

| Parameter       | Script (PS1)              | Script (sh)      | Description |
|----------------|---------------------------|------------------|-------------|
| Feature name   | `-FeatureName "name"`     | First positional | Branch: `claude/<name>`. Default: `morning-YYYYMMDD` |
| Base branch    | `-BaseBranch main`        | `BASE_BRANCH=main` | Branch to branch from |
| Skip build     | `-SkipBuild`              | `--skip-build`   | Do not run `npm run build` |
| Skip test      | `-SkipTest`               | `--skip-test`    | Do not run `npm run test` |
| Run fix-agent  | `-RunFixAgent`            | `--run-fix-agent` | Run fix-agent.js after build/test |
| Use worktree   | `-UseWorktree`            | `--use-worktree` | Create worktree via New-ClaudeWorktree / new-claude-worktree.sh |

---

## When to use

- **Start of day** — One command to get a branch and green baseline.
- **After morning briefing** — If the briefing suggests a fix or feature, run this then implement.
- **Before a PR** — Ensures your branch is based on latest main and build/test pass.

---

## Related

- **Worktree creation:** `scripts/New-ClaudeWorktree.ps1`, `scripts/new-claude-worktree.sh`
- **Fix agent:** `.workflows/agents/fix-agent.js` (run after audit-agent)
- **CLAUDE.md:** Branch naming `claude/<feature>-<id>`, worktree workflow
