# Field Note — Mail Address Map: Proton Catch-All Inbound, Proton-Only Outbound

- **Date:** 2026-09-28
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/wonderful-rubin-xn5oib`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — mail infrastructure. During the PR #2223 review an agent flagged `risto.anton@lifetime.fi` in the checkout code as a "non-canonical address". The HIC says this question comes up about once a week.
- **Confidence:** High for inbound (HIC statement 28.09.2026). Outbound authority is taken from `2026-08-04-lifetime-fi-outbound-dmarc-proton.md`; this session did not re-read the DNS.
- **Status:** RESOLVED — HIC 28.09.2026

## Ontology Tags

- **Geography:** Europe > Finland > Espoo
- **Sector:** Internal infrastructure > Email routing
- **Entities:** Proton Business, Google Workspace, `lifetime.fi`, `dws10.com`, `onelifetime.world`, `CLAUDE.md` Sender Identity Rule
- **Temporal Context:** 2026-Q3

---

## 1. The rule agents keep missing

**Inbound:** Proton accepts mail for **any address** on our domains. That includes `risto.paarni@lifetime.fi`, `risto.anton@lifetime.fi` and role addresses such as `security@dws10.com`. Mail sent to any of these reaches the HIC.

**Outbound:** the Sender Identity table in `CLAUDE.md` still decides which address may appear in `From:` / `Reply-To:`.

These are two separate questions. An address in code, a form, a `mailto:` or a document that only **receives** mail is not an error, as long as it is on one of our domains.

## 2. Address map

| Address                                       | Inbound (Proton)       | Outbound `From:`                   | Note                                  |
| --------------------------------------------- | ---------------------- | ---------------------------------- | ------------------------------------- |
| `risto.paarni@lifetime.fi`                    | ✅                     | ✅ Lifetime Oy outbound (Proton)   | Canonical public contact              |
| `risto@onelifetime.world`                     | ✅                     | ✅ DWS IQ platform From/Reply-To   |                                       |
| `risto.anton@lifetime.fi`                     | ✅                     | — not in the sender table          | Valid receive address; do not flag it |
| `security@dws10.com` and any `*@<our domain>` | ✅                     | — not in the sender table          | Role addresses; valid for receiving   |
| `risto.paarni2024@lifetime.fi`                | Google Workspace login | ❌ never — Proton sends everything | Workspace (Calendar, Meet, Drive)     |

## 3. Outbound: resolved

HIC, 28.09.2026: "I send everything from Proton." All outbound mail goes through Proton, which is the only sender `lifetime.fi` DNS authorizes, so there is no DMARC exposure.

`risto.paarni2024@lifetime.fi` is the Google Workspace login (Calendar, Meet, Drive). It is not a sending path. The earlier reading of "google sender is risto.paarni2024@" as Gmail outbound was wrong. The 2026-07-26 observation (`2026-07-26-pr-backlog-orchestration-cleanup.md:61`) that partner mail was sent from that address is superseded by this HIC statement.

## 4. Change made

`CLAUDE.md` v1.10 adds one inbound line under Sender Identity. The outbound rules are unchanged.

## 5. Session Learning Outcome

1. KB — N/A: this is a one-line operational rule, and `CLAUDE.md` is the source every tool loads.
2. Field note — this file.
3. Learn/ HTML — N/A: an internal operations note.
4. Drive export — N/A: the repo is the source of truth.
5. HIC decision: answered in-session (§3).
6. Calendar — N/A: no dated commitment.

## HIC Decision

None open. Outbound is Proton-only (HIC, 28.09.2026).
