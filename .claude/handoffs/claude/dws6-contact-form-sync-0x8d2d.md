# Handoff — claude/dws6-contact-form-sync-0x8d2d

## State
Merged `copilot/request-access-button-fix` (PR #1824) into this branch and fixed it. Pushed as `bee5e30e`.

## What was wrong with #1824
1. `mergeable_state: dirty` — two mirrored conflicts in `regulatory-notice/index.html`, signature block only.
2. **Blocking**: `functions/api/contact.js` called `new EmailMessage(...)` with no import
   (`cloudflare:email`), so every submission threw and returned 502. Fixed by switching to the
   documented Email Service binding form: `env.CONTACT_EMAIL.send({from,to,replyTo,subject,text})`.
3. No rate limiting. Added 5 req / 10 min per IP via optional `CONTACT_RL` KV binding.

## Still blocked on HIC (form returns 503 until done)
Cloudflare Pages project `dws10.com` → Settings → Bindings:
- `CONTACT_EMAIL` — Email Service send binding (requires lifetime.fi onboarded to Email Service + SPF/DKIM)
- `CONTACT_FROM` — verified sender on that domain
- `CONTACT_TO` — optional, defaults to risto.paarni@lifetime.fi
- `CONTACT_RL` — optional KV namespace; without it rate limiting is skipped (honeypot only)

## NOT done (scope b, never started)
Level 1/2/3 investor-access model, DD intake fields (investor type, EEA status, check size, thesis,
LinkedIn), server-side level enforcement, and the investor-relations stale-content inventory.
Verified absent: no such fields or gating anywhere in `dws10.com/`, `dws6.com/`, `src/routes/`.

## Pre-existing debris on main (untouched, needs HIC call)
`merge_tmp/ours/`, `merge_tmp/theirs/`, empty `gcp-sa-key-new.json` — committed in `3cd87731`.
