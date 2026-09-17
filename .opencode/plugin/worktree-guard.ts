/**
 * worktree-guard.ts — enforce WORKTREE_POLICY.md
 *
 * Blocks git write operations (add/commit/merge/rebase/push/pull/cherry-pick)
 * executed from the PRIMARY checkout of this repository by any OpenCode session.
 * Agents must do their work in an isolated worktree:
 *
 *   scripts/new-opencode-worktree.sh <task-name>
 *
 * Escape hatch for humans/emergencies: DWS_ALLOW_PRIMARY_GIT=1
 */
import type { Plugin } from "@opencode-ai/plugin"
import { execFileSync } from "child_process"

const GIT_WRITE_RE =
  /(^|[;&|]\s*|\b(?:sudo|nohup|env)\s+|\bsh\s+-c\b.*[;&|]\s*)git(?:\s+-\S+)*\s+(add|commit|merge|rebase|push|pull|cherry-pick)\b/

function resolveGitDirs(cwd: string): { gitDir: string; commonDir: string } | null {
  try {
    const opts = { cwd, encoding: "utf8" } as const
    const gitDir = execFileSync(
      "git",
      ["rev-parse", "--path-format=absolute", "--git-dir"],
      opts,
    ).trim()
    const commonDir = execFileSync(
      "git",
      ["rev-parse", "--path-format=absolute", "--git-common-dir"],
      opts,
    ).trim()
    return { gitDir, commonDir }
  } catch {
    return null
  }
}

export const WorktreeGuard = (async () => {
  return {
    "tool.execute.before": async (input: any, output: any) => {
      if (input?.tool !== "bash") return
      const cmd = String(output?.args?.command ?? "")
      if (!GIT_WRITE_RE.test(cmd)) return

      if (process.env.DWS_ALLOW_PRIMARY_GIT === "1") return

      // The bash tool may declare its own working dir; fall back to session dir
      const candidates = [
        typeof output?.args?.cwd === "string" ? output.args.cwd : undefined,
        typeof output?.args?.workdir === "string" ? output.args.workdir : undefined,
        typeof input?.directory === "string" ? input.directory : undefined,
      ].filter((v): v is string => Boolean(v))

      for (const cwd of candidates) {
        const dirs = resolveGitDirs(cwd)
        if (!dirs) continue
        // Primary checkout: git-dir equals the common dir.
        // Linked worktree: git-dir lives under <common>/.git/worktrees/<name>.
        if (dirs.gitDir === dirs.commonDir) {
          throw new Error(
            [
              "WORKTREE_POLICY.md violation: git write attempted in the PRIMARY checkout.",
              "",
              "Concurrent agents share this index — commits here can sweep other",
              "agents' staged files (incident: dca623b3c, 2026-08-22).",
              "",
              "Do instead:",
              "  scripts/new-opencode-worktree.sh <task-name>",
              "  # work in ~/.opencode-worktrees/dws6/<task-name>, commit there,",
              "  # push branch, open PR.",
              "",
              "Human override: prefix the shell command with DWS_ALLOW_PRIMARY_GIT=1",
            ].join("\n"),
          )
        }
      }
    },
  }
}) satisfies Plugin

export default WorktreeGuard
