import { describe, expect, test } from "bun:test"
import { CursorInstruction } from "@opencode-ai/core/cursor-instruction"

describe("CursorInstruction", () => {
  test("treats files without frontmatter as always-apply", () => {
    const rule = CursorInstruction.parse("/repo/.cursorrules", "Use bun.")
    expect(CursorInstruction.isAmbient(rule)).toBe(true)
  })

  test("treats alwaysApply true as ambient", () => {
    const rule = CursorInstruction.parse(
      "/repo/.cursor/rules/style.mdc",
      `---
alwaysApply: true
---
Prefer const.
`,
    )
    expect(CursorInstruction.isAmbient(rule)).toBe(true)
  })

  test("matches glob-scoped rules against project-relative files", () => {
    const rule = CursorInstruction.parse(
      "/repo/.cursor/rules/typescript.mdc",
      `---
globs: "**/*.ts"
alwaysApply: false
---
Use Effect.
`,
    )
    expect(CursorInstruction.isAmbient(rule)).toBe(false)
    expect(CursorInstruction.matches(rule, "/repo/packages/core/src/skill.ts")).toBe(true)
    expect(CursorInstruction.matches(rule, "/repo/README.md")).toBe(false)
  })
})
