<!--
VERSION AND AGENT HISTORY
Document: repo-as-publication-surface.md
Version: 1.0
Last-Updated: 2026-07-28
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS rule for static-host repositories — when the build output
         directory is the repo root, every file in the repo is a published file.
         Worked case: cari.fi on Cloudflare Pages, where the customer field note
         (registration pricing, payment method, escalation log) would have been
         served at cari.fi/docs/.
Introduced-In: branch claude/cari-fi-new-site-x410ox
Code-Version: 1.0
Branch: claude/cari-fi-new-site-x410ox
Date: 2026-07-28
Owner: risto.paarni@lifetime.fi
-->

# The Repo Is the Publication Surface

**Version:** 1.0 · **Status:** Active · **Scope:** any repository deployed by a static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages, S3 sync)

## The rule

On a static host, **the build output directory is a publication decision, not a build setting.** Every file inside it is served to anyone who requests its path — no link, no index entry, and no `robots.txt` line is required for it to be readable.

Therefore: **set the output directory to a subfolder that contains only the site.** Never the repo root.

```
repo/
  public/        <- output directory: this, and only this, is public
    index.html
    assets/
  docs/          <- internal: never served
  README.md      <- internal: never served
```

## Why the root is the dangerous default

It is the *convenient* default for a single-file site — no build step, no folder to explain — and it is correct on the day it is chosen, because the repo contains only the site. The exposure arrives later, when someone adds the first internal file. **Nothing warns them.** The commit that creates the leak is a documentation commit, reviewed as documentation, and the reviewer is not thinking about HTTP.

`robots.txt` does not help: it is a crawling directive, not access control. A path that is not crawled is still fetched by anyone who guesses or is told it.

## Relationship to Non-Negotiable Rule 5

`CLAUDE.md` Rule 5 forbids publishing `.md` files in the named public-site folders (`dws10.com/`, `onelifetime.world/`, and their mirrors). That rule enumerates *folders known to be public*.

**This concept generalises it to the inverse question:** which folders are public? On a root-output static host the answer is *all of them*, and Rule 5's enumeration silently under-covers. Reading the rule as a list of forbidden destinations passes a repo that has no such folder and publishes everything anyway.

## The check

For every repo that a static host deploys, answer in the README:

1. **What is the output directory?** If the answer is `/` or "repo root", that is the finding.
2. **Would a stranger fetching `<site>/README.md` learn anything you would not put on the home page?** Customer names, pricing, supplier terms, incident logs, internal reasoning, staff details — all common in a README and none of it intended for publication.

## Worked case — cari.fi, 2026-07-28

The `blogtheristo/cari` repo was created as a single `index.html` at the root, with the Pages build output directory documented as `/`. Correct at creation.

Later the same week the repo gained `README.md` (customer address, launch gate, the mailbox that does not exist yet) and, on request, `docs/field-notes/` — the customer onboarding record, containing the domain registration price, the payment method, the YTJ address discrepancy, and the registrar escalation log.

All of it would have been served at `cari.fi/README.md` and `cari.fi/docs/…` on first deploy. Caught before the Pages project was connected, because the domain was still blocked at the registrar — **the leak was prevented by an unrelated delay, not by a control.** That is the part worth remembering.

Fix: site moved to `public/`, output directory changed to `public`, and the README states *why* it must not be the root — so the next person does not "simplify" it back.

## Related

- `CLAUDE.md` Non-Negotiable Rule 5 (no `.md` in public-site folders) — this concept is its generalisation
- `docs/field-notes/2026-07-26-cari-fi-new-site-cloudflare-onboarding.md`
- `kb/wiki/concepts/plausible-wait-window.md` (same session; the delay that happened to catch this)
