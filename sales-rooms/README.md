# Noux Myyntihuoneet — Sales Rooms Index

Repo-side home for the Noux (noux.io) sales rooms. The Noux room is the **buyer-facing surface**;
this folder is the **source of truth** for what goes into each room, which outreach pipeline feeds it,
and which demo tenant the visitor lands in.

**Repository-first** (`DWS_TRUTH_STANDARD.md` §2E): the `.md` here is the master, the Noux room is the
published copy. Never edit content only in Noux — update here, then re-upload.

**Owner:** Risto Anton Päärni, Founder, CEO · Lifetime Oy
**Last updated:** 2026-08-30
**Noux account:** `risto.paarni2024@lifetime.fi`

---

## The three rooms

| #   | Noux room title                                                                                              | Folder                                                           | Audience                                                                   | Feeding outreach pipeline                                                                    | Noux status (2026-08-30)                         |
| --- | ------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 1   | Lifetime Certified Partners Centre \| DWS IQ tuoteperhe \| Lifetime Consulting \| Certified Partners Support | [`01-certified-partners-centre/`](01-certified-partners-centre/) | Resellers, training, implementation & strategic partners                   | [`partners-outreach/`](../partners-outreach/), [`Partners/outreach/`](../Partners/outreach/) | Luonnos / Käynnissä — 0 visitors                 |
| 2   | Investor Centre \| DWS IQ tuoteperhe \| Firehorse tuoteperhe \| Investor Support                             | [`02-investor-centre/`](02-investor-centre/)                     | SAFE-round investors, angels, VCs (Admiral Lounge / Captain's Lounge tags) | [`investor-outreach/`](../investor-outreach/)                                                | Luonnos / Käynnissä — 0 visitors                 |
| 3   | Trial Centre \| DWS IQ tuoteperhe \| Firehorse tuoteperhe \| Customer Support                                | [`03-trial-centre/`](03-trial-centre/)                           | Trial & pilot customers (Boardy.ai-sourced intros tagged)                  | [`sales-outreach/`](../sales-outreach/), [`outreach/`](../outreach/)                         | **Aktiivinen** / Käynnissä — 1 visitor, 1 invite |

Room tags mirror the Noux "Tunnisteet" chips exactly — do not rename a tag on one side only.

---

## Per-room folder shape

Every room folder carries the same three files. Same shape everywhere, so a new room is a copy-and-fill,
not a design exercise.

| File           | Answers                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `README.md`    | What the room is, who it is for, its Noux tags/status, the visitor journey, the demo-stage checklist |
| `DOCUMENTS.md` | Asset manifest — repo source path → title shown in the room → upload status                          |
| `OUTREACH.md`  | Which pipeline feeds the room, the invite copy, the follow-up loop on room signals                   |

---

## Demo tenants

Each room links visitors into a live demo tenant rather than a slide.

- [`DEMO_TENANTS.md`](DEMO_TENANTS.md) — naming convention (`dev.<customer>@dws10.com`), contents, guardrails, open decisions
- [`DEMO_AUTOMATION_PLAN.md`](DEMO_AUTOMATION_PLAN.md) — phased plan + workflow definitions (W1–W4) for automating provisioning, expiry, and room sync

---

## Working rules

1. **No `.md` in a public site folder** (Non-Negotiable Rule 5). These files stay in `sales-rooms/`; the
   room shows PDFs/HTML/links, never a raw repo markdown path.
2. **Sender identity** in every invite and follow-up: `CLAUDE.md` → Sender Identity. Live partner /
   investor / sales threads send from `risto.paarni2024@lifetime.fi`.
3. **Outbound email is RED zone** — an agent drafts the invite, the HIC sends it.
4. **Roles by R-ID** — audience rows reference `DWS_ROLES_REGISTRY.md` (R01–R25), not ad-hoc job titles.
5. **Room signals are pipeline events** — a visit, an attachment open, or a comment in Noux is logged as
   the next action in that room's `OUTREACH.md`, not left in the Noux UI.
