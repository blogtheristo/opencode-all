# Room 1 — Outreach Wiring

**Feeding pipelines:** [`../../partners-outreach/`](../../partners-outreach/) (pipeline `partner` in
Supabase `outreach_contacts`) and [`../../Partners/outreach/`](../../Partners/outreach/) (per-target letters).

## Invite list (from the partner pipeline)

| Target        | Contact                      | Pipeline doc                                                                                                 | Room-ready?             | Next action                                   |
| ------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------- | --------------------------------------------- |
| One Click LCA | Suzana Delanghe (CRO)        | [`LETTER_SUZANA_DELANGHE_OCL.md`](../../partners-outreach/LETTER_SUZANA_DELANGHE_OCL.md)                     | after docs 1–3          | Send room link with partner-program follow-up |
| IFS Cloud     | ISV Partner Program          | [`IFS_CLOUD_PARTNERSHIP_PITCH.md`](../../partners-outreach/IFS_CLOUD_PARTNERSHIP_PITCH.md)                   | after docs 1–3          | Attach room link to ISV application           |
| SAP           | PartnerEdge Build            | [`SAP_PARTNEREDGE_PITCH.md`](../../partners-outreach/SAP_PARTNEREDGE_PITCH.md)                               | after docs 1–3          | Attach room link to Build application         |
| Rakennustieto | Laura Apilo (MD)             | [`RAKENNUSTIETO_PARTNERSHIP_PITCH.md`](../../partners-outreach/RAKENNUSTIETO_PARTNERSHIP_PITCH.md)           | after FI docs           | FI-language invite                            |
| Nokia         | Tommi Haapala (NDA in force) | [`LETTER_TOMMI_HAAPALA_NOKIA_UPDATE_EN.md`](../../partners-outreach/LETTER_TOMMI_HAAPALA_NOKIA_UPDATE_EN.md) | yes (NDA signed)        | Room link in next update                      |
| Telia         | Strategic Partnerships       | [`../../Partners/outreach/2026-05-26-telia.md`](../../Partners/outreach/2026-05-26-telia.md)                 | after Nokia warm bridge | —                                             |

Keep this table in sync with `partners-outreach/README.md`; that file remains the pipeline master, this
one only tracks **room** readiness and room invites.

## Invite copy

From: `risto.paarni2024@lifetime.fi` for live threads, `risto.paarni@lifetime.fi` for cold first touch.
Signature: short sig from `CLAUDE.md`. Never `noreply@`. Transport is Amazon SES; **sending is RED zone —
the agent drafts, the HIC sends.**

## Follow-up loop on room signals

| Noux signal               | Meaning                              | Action                                                                     | Within   |
| ------------------------- | ------------------------------------ | -------------------------------------------------------------------------- | -------- |
| Invite opened, no visit   | Subject line landed, content did not | Resend with a specific document named in the subject                       | 3 days   |
| Visit, < 1 min            | Wrong room or wrong person           | Check role fit; re-route to Trial Centre if they are a buyer not a partner | 2 days   |
| Visit, program doc opened | Real interest in terms               | Offer walkthrough + provision demo tenant                                  | 1 day    |
| NDA opened, not signed    | Legal-stage stall                    | Ask which clause is blocking; offer their paper                            | 5 days   |
| Comment in room           | Highest-intent signal Noux produces  | Reply in-thread same day, log the question here                            | same day |

Every signal handled gets a line appended below with a date — the room's history lives here, not in the
Noux UI.

## Signal log

_(no visits yet — room created 2026-08-30)_
