import { Schema } from "effect"
import { NamedError } from "@opencode-ai/core/util/error"
import { Process } from "@/util/process"
import { IdeEvent } from "@opencode-ai/schema/ide-event"

const SUPPORTED_IDES = [
  { name: "Windsurf" as const, cmd: "windsurf" },
  { name: "Visual Studio Code - Insiders" as const, cmd: "code-insiders" },
  { name: "Visual Studio Code" as const, cmd: "code" },
  { name: "Cursor" as const, cmd: "cursor" },
  { name: "VSCodium" as const, cmd: "codium" },
]

export const Event = IdeEvent

export const AlreadyInstalledError = NamedError.create("AlreadyInstalledError", {})

export const InstallFailedError = NamedError.create("InstallFailedError", {
  stderr: Schema.String,
})

export function ide() {
  const caller = process.env["OPENCODE_CALLER"]
  if (caller === "cursor") return "Cursor"
  if (caller === "windsurf") return "Windsurf"
  if (caller === "vscodium") return "VSCodium"
  if (caller === "vscode-insiders") return "Visual Studio Code - Insiders"
  if (caller === "vscode") return "Visual Studio Code"
  if (process.env["TERM_PROGRAM"] === "vscode") {
    const v = process.env["GIT_ASKPASS"]
    for (const ide of SUPPORTED_IDES) {
      if (v?.includes(ide.name)) return ide.name
    }
  }
  return "unknown"
}

const INSTALLED_CALLERS = new Set(["vscode", "vscode-insiders", "cursor", "windsurf", "vscodium"])

export function alreadyInstalled() {
  const caller = process.env["OPENCODE_CALLER"]
  return caller !== undefined && INSTALLED_CALLERS.has(caller)
}

export async function install(ide: (typeof SUPPORTED_IDES)[number]["name"]) {
  const cmd = SUPPORTED_IDES.find((i) => i.name === ide)?.cmd
  if (!cmd) throw new Error(`Unknown IDE: ${ide}`)

  const p = await Process.run([cmd, "--install-extension", "sst-dev.opencode"], {
    nothrow: true,
  })
  const stdout = p.stdout.toString()
  const stderr = p.stderr.toString()

  if (p.code !== 0) {
    throw new InstallFailedError({ stderr })
  }
  if (stdout.includes("already installed")) {
    throw new AlreadyInstalledError({})
  }
}

export * as Ide from "."
