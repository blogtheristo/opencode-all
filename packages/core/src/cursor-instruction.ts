export * as CursorInstruction from "./cursor-instruction"

import { relative, sep } from "path"
import { ConfigMarkdown } from "./config/markdown"
import { Glob } from "./util/glob"

export type Rule = {
  path: string
  alwaysApply: boolean
  globs: string[]
  content: string
}

const RULE_PATTERN = ".cursor/rules/**/*.{md,mdc}"
const RULE_FILE = ".cursorrules"

export const PROJECT_TARGETS = [RULE_FILE] as const
export const RULE_GLOB = RULE_PATTERN
export const SKILLS_DIR = ".cursor"

export function parse(path: string, content: string): Rule {
  const markdown = ConfigMarkdown.parseOption(content)
  if (!markdown) {
    return { path, alwaysApply: true, globs: [], content }
  }
  const alwaysApply = markdown.data.alwaysApply
  const globs = normalizeGlobs(markdown.data.globs)
  if (alwaysApply === true) {
    return { path, alwaysApply: true, globs, content: markdown.content || content }
  }
  if (alwaysApply === false) {
    return { path, alwaysApply: false, globs, content: markdown.content || content }
  }
  return {
    path,
    alwaysApply: globs.length === 0,
    globs,
    content: markdown.content || content,
  }
}

export function isAmbient(rule: Rule) {
  return rule.alwaysApply
}

export function matches(rule: Rule, filepath: string) {
  if (rule.alwaysApply || rule.globs.length === 0) return false
  const candidates = pathCandidates(filepath, rule.path)
  return rule.globs.some((pattern) => candidates.some((candidate) => Glob.match(pattern, candidate)))
}

function normalizeGlobs(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed === "" ? [] : [trimmed]
  }
  if (!Array.isArray(value)) return []
  return value.flatMap((item) => (typeof item === "string" && item.trim() !== "" ? [item.trim()] : []))
}

function pathCandidates(filepath: string, rulePath: string) {
  const posix = filepath.split(sep).join("/")
  return [posix, projectRelative(filepath, rulePath)].filter((item) => item !== "")
}

function projectRelative(filepath: string, rulePath: string) {
  const marker = `${sep}.cursor${sep}rules${sep}`
  const index = rulePath.lastIndexOf(marker)
  if (index === -1) return relative(rulePath.slice(0, rulePath.lastIndexOf("/") + 1) || ".", filepath).split(sep).join("/")
  return relative(rulePath.slice(0, index), filepath).split(sep).join("/")
}
