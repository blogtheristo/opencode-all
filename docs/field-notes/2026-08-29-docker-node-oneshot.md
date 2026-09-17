# Field Note — 2026-08-29: Docker node one-shot shell

## Context

Win11 had bare `node` removed from the host. Node 24.19.0 was subsequently reinstalled via winget. During the investigation a useful one-shot Docker pattern was discovered.

## The pattern

```bash
docker run -it --rm -v "${PWD}:/app" -w /app node:24-slim sh
```

| Flag | Effect |
|---|---|
| `-it` | Interactive TTY — gives a shell prompt |
| `--rm` | Container deleted on exit — no cleanup needed |
| `-v "${PWD}:/app"` | Mounts current directory into `/app` inside the container |
| `-w /app` | Sets working directory to `/app` so `node`, `npm`, `npx` run against repo files |
| `node:24-slim` | Official Node 24 slim image — no OS bloat |

## When to use

- Quick `node`/`npm`/`npx` command when host node is unavailable or version-pinned differently
- One-off script runs without installing node globally
- Testing a script against a specific node version

## When NOT to use

- Persistent named container needed by a hook or cron → use `docker run -d --name <name>` instead
- CI hooks (pre-push) → host node is now installed; this pattern is for interactive use only
- The `dws6-node` named container idea was considered for the pre-push hook but dropped — node 24.19.0 is now on the Win11 system PATH via winget

## N/A exemptions

N/A — trivial operational note, not a substantive session artifact.
