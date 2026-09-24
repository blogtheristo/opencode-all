# Preloop evaluation — moving GitHub Actions onto DGX Spark

<!-- Evidence: Tool=Claude Code (cloud) Agent=research Date=2026-09-23 -->
<!-- Audit trail: git log -- docs/field-notes/2026-09-23-preloop-gha-to-dgx-evaluation.md -->

Status: DECIDED — DEFER (HIC, 2026-09-23)
Source: https://github.com/preloopdev/preloop (README + releases page, read 2026-09-23)

## 1. Question

Should DWS6 adopt Preloop to take the remaining GitHub Actions (GHA) load off
GitHub-hosted runners and onto the DGX Spark?

## 2. What Preloop is

| Aspect         | Finding                                                                                                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Function       | Local executor for unmodified `.github/workflows/*.yml`, run inside hardware-isolated microVMs (~300 ms boot). Runs against uncommitted changes, no push required.                                                                 |
| Compatibility  | `${{ }}` expressions, matrix, reusable workflows, concurrency groups, OIDC. Speaks the official `actions/runner` protocol.                                                                                                         |
| Runner         | `preloop-runner` Rust re-implementation: vendor-reported 36× smaller install, 19× lower peak memory than the official runner.                                                                                                      |
| Agent features | DAP debugger attach per job, pause/inspect context and env, step-level retry, NDJSON event stream.                                                                                                                                 |
| Auth           | GitHub App or fine-grained PAT, per-job token minting, webhook watchdog.                                                                                                                                                           |
| Platforms      | Linux/macOS/Windows. `aarch64-unknown-linux-gnu` binary is published (DGX Spark is arm64).                                                                                                                                         |
| Licence        | MIT for CLI, runner, parser, VM orchestrator. Control plane (`preloop serve`) is FSL-1.1-MIT: source-available, becomes MIT 2 years after each release. Internal use is allowed. Offering it as a competing hosted service is not. |
| Maturity       | Version 0.33.x, ~154 stars, first public release about one month before the latest one. Early-stage, single vendor.                                                                                                                |
| Disk           | 80 GB+ free. The official runner image is ~9 GB compressed and ~50 GB unpacked.                                                                                                                                                    |

## 3. Where DWS6 is today

- The DGX already runs a registered GitHub self-hosted runner (`[self-hosted, dgx-spark]`).
  It runs `ci-audit-verify.yml`, `claude-auto-fix.yml` and `security-check-pr.yml`.
  `test-on-pr.yml` also runs there, and falls back to `ubuntu-latest` when the DGX heartbeat is down.
- Scheduled work already moved to DGX cron (`Cron-works.md`, three-tier failover).
- Remaining GHA spend is estimated at **~415–515 min/month ≈ $3.3–4.1/month**
  (`Cron-works.md`, "Cost Estimate"), against a $10 budget.

So the cost problem Preloop would solve is already mostly solved.

## 4. Fit assessment

| Criterion                     | Assessment                                                                                                                                                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cost saving                   | **Marginal.** At most ~$4/month is left to recover.                                                                                                                                                                                                                                                                 |
| Pre-push local CI             | **Real gain.** Agents (OpenCode, Claude Code on DGX) can run the actual workflow files before pushing. That means fewer red-CI cycles on PRs. Our current runner can't do this.                                                                                                                                     |
| Agent debugging (DAP, NDJSON) | **Real gain.** Matches the DWS agent-native direction and the "fail loud" rule.                                                                                                                                                                                                                                     |
| Isolation                     | **Better than today.** Our self-hosted runner executes PR jobs directly on the DGX host. MicroVM isolation shrinks the blast radius if someone runs untrusted PR code.                                                                                                                                              |
| arm64 on DGX                  | **Unverified.** An arm64 CLI exists, but the docs don't say which Linux arm64 hypervisor is used (KVM backend) or whether arm64 golden images exist. The official runner image is x86_64. Their own docs note Docker actions fail under x86 emulation on Apple Silicon. Expect the same class of issue on the GB10. |
| Resource contention           | 50 GB image plus microVMs share the DGX with Ollama and training workloads. We would need to cap them.                                                                                                                                                                                                              |
| Vendor risk                   | High for a 0.x project with one vendor. The core is MIT, so it can be forked. The control plane is FSL.                                                                                                                                                                                                             |
| Compliance                    | Workflows keep their GHA syntax, so we keep the fallback to GitHub-hosted runners. That preserves the three-tier failover.                                                                                                                                                                                          |

## 5. Recommendation

**Don't replace the current DGX self-hosted runner. Run a bounded pilot of Preloop
as a pre-push local CI tool for agents on the DGX.**

Rationale: the "remove GHA to DGX" goal is already largely met (~$4/month left).
Preloop's differentiated value is local, agent-debuggable, isolated workflow
execution before push. It doesn't add much as a cost lever.

### Pilot (≤ 1 day of engineering, DGX only, no production path change)

1. Install the `aarch64-unknown-linux-gnu` CLI on the DGX. Confirm KVM is available and a microVM boots.
2. Run `test-on-pr.yml` and `security-check-pr.yml` locally against a dirty worktree.
3. Record wall-clock time, peak RAM/disk, and pass/fail parity against the latest GHA run of the same commit.
4. Run one workflow that uses a Docker action to test the arm64/x86 emulation risk.

**Go criteria:** parity on both workflows, Docker action works or has a documented workaround, ≤ 60 GB disk, no impact on Ollama latency.
**No-go:** any of the above fails. Stay on the current runner and re-evaluate at Preloop ≥ 1.0.

Only after a go: consider replacing the host-level `dgx-spark` runner with Preloop-isolated execution (the security gain). Keep `ubuntu-latest` failover unchanged.

## 5a. Update 2026-09-23 — container-escape signal (CVE-2026-80521)

Sources: [The Hacker News](https://thehackernews.com/2026/09/exploit-released-for-unpatched-ubuntu.html),
[CyberSec Guru](https://thecybersecguru.com/news/cve-2026-80521-ubuntu-kernel-container-escape/), DepthFirst writeup (22 Sep 2026).

- **Flaw:** use-after-free in the AF_UNIX socket subsystem, CVSS 7.8. An unprivileged process in a default Docker or Kubernetes container gets root on the host. Namespaces, cgroups and seccomp don't stop it.
- **Patch status:** fixed upstream on 6 Aug. Ubuntu 22.04, 24.04 and 26.04 are **not** patched yet. A public exploit exists.
- **Discovery:** found and exploited with AI tooling. It's the third container escape of 2026, after a crypto-subsystem flaw in April and a futex flaw in July.

**What it means for DWS6:**

1. Today's `dgx-spark` runner doesn't use containers. `ci-audit-verify`, `security-check-pr` and `test-on-pr` run `pull_request` code **directly on the DGX host**. So a container escape isn't even needed, and any code in a PR runs with the runner user's rights. The repo is private, which limits exposure to people with push access and the agents we run. Those agents (auto-fix, OpenCode, cloud sessions) can be prompt-injected into committing hostile code.
2. DGX OS is Ubuntu-based, so the DGX is likely in the unpatched set. Anything on it that relies on Docker for isolation (Ollama, script containers) should be treated as having **no** kernel boundary until patched. Verify the kernel version first.
3. A per-job VM with its own guest kernel moves the boundary from the shared host kernel to the hypervisor (KVM). The attack surface is much smaller, though not zero. **This makes Preloop's isolation the main reason to adopt it, ahead of cost.**

**Revised recommendation:** raise the pilot's priority from "nice to have" to "security remediation candidate". Take these interim steps regardless of Preloop:

- Patch or mitigate the DGX kernel once Ubuntu ships the fix. Until then, look for a vendor mitigation (restrict unprivileged user namespaces, custom seccomp).
- Run the self-hosted runner as a dedicated unprivileged user, with no access to `.env`, SSH keys or the Ollama model store.
- Make every `dgx-spark` job ephemeral (`--ephemeral` runner registration) so nothing carries over between jobs.
- Pilot go-criterion added: the microVM path must work on the DGX (KVM on GB10 arm64). If it can't, evaluate an alternative VM-per-job runner (Firecracker- or Kata-based) with the same criteria.

## 6. Learning-outcome steps

- KB update: N/A — research-only note pending HIC decision.
- HTML render / Drive export: N/A — deferred until HIC approves the pilot.
- Calendar: N/A — no dated commitment made.

## 7. HIC decision question

Approve the DGX pilot now as a security fix (section 5a), plus the interim runner hardening?

## 8. HIC decision (2026-09-23)

**Deferred until Preloop 1.0.** No pilot now. Re-evaluate against sections 4–5a when 1.0 ships.
The interim runner hardening in section 5a is a separate item and is still open.

## 9. Interim runner hardening — drafted (2026-09-23)

HIC asked for the section 5a hardening as a PR. It's implemented in `infrastructure/dgx-spark/setup-github-runner.sh` v2.0.0 plus `infrastructure/dgx-spark/gh-runner/`. The v1 script is kept as `setup-github-runner_OLD.sh` for rollback.

- Jobs run as system user `gh-runner`: no sudo, no docker group, no login shell. `/home`, `/root`, `/etc/gh-runner` and the Docker socket are invisible to jobs.
- Ephemeral: each unit start mints a single-use JIT config (`generate-jitconfig` API), runs one job, then wipes `_work`, `$HOME` and the tool cache.
- The PAT is root-only (`/etc/gh-runner/pat`, 0600) and passed to curl through a file descriptor, never on argv.
- Runner binaries are SHA256-verified against the release notes, and root-owned so jobs can't modify them.
- systemd sandbox: read-only host, no new privileges, no capabilities, `RestrictNamespaces`, syscall filter. Capped at 8 cores / 24 GB so Ollama keeps headroom.
- Workflows are unchanged: same labels `[self-hosted, dgx-spark]`, and the health probe stays on `:9800`.

**Known limits (fail loud):**

- `AF_UNIX` must stay allowed because the runner, Node and .NET use it. The sandbox therefore does **not** block the CVE-2026-80521 path. Only a kernel patch does.
- The tool cache is wiped per job, so expect +20–40 s per job for `setup-node` / `setup-python`.
- Between jobs, the `:9800` probe reports down for a few seconds. `test-on-pr` may fail over to `ubuntu-latest` if a heartbeat lands in that window.
- Runner self-update can't write to the root-owned binaries. Bump `RUNNER_VERSION` and re-run setup instead.
- Tested in a cloud container only (scripts, JIT minting with stubbed API, PAT not on argv, state wipe, unit syntax). Not yet run on the DGX.
