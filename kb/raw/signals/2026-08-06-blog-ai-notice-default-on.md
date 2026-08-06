# Signal: AI-content notice defaults ON for AI-drafted regulatory blog posts

Date: 2026-08-06
Source: docs/field-notes/2026-08-06-arvonluonnin-ajurit-blog-publish.md
Session: claude/arvonluonnin-ajurit-research-hpiipo

## The signal

HIC approval of a blog post's _content_ is not the same thing as the reviewer-credit
required to remove the EU AI Act Article 50(4) AI-content notice (`DWS_BLOG_STANDARD.md`
§3.2.1). Publishing the "arvonluonnin ajurit" post in 5 languages, all 5 shipped with the
notice because no page had a named human reviewer credited per the standard's 4-step test
(named person, pre-publication substantive read, authority to amend/reject, publicly
reachable contact) — even though the HIC had explicitly approved every language's text.

## Why it matters for future sessions

Any agent publishing an AI-drafted page on a regulated topic (compliance, sovereignty, AI
Act, CBAM, etc.) should default the notice ON unless the 4-step credit process has actually
been run and recorded. "The HIC approved this" answers "is the content correct," not "is
there an accountable named reviewer" — they are different legal questions under DWS policy,
and the policy is deliberately stricter than the regulation's own minimum.

## Also confirmed this session

- EN/FI post pairs on `onelifetime.world/posts/` share ONE hero image, not a per-language
  split — check live conventions before assuming a per-language asset pattern.
- `scripts/inject-blog-nav.cjs` reruns touch the _previous_ chronological post's prev/next
  links too — always full-repo-diff the dual-folder mirror after running it, not just the
  new post's own files.
