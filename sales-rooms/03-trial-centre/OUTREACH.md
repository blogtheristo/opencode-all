# Room 3 — Outreach Wiring

**Feeding pipelines:** [`../../sales-outreach/`](../../sales-outreach/) (per-target `INTRO_*` / `LETTER_*`),
[`../../outreach/`](../../outreach/) (playbooks), Supabase `outreach_contacts` pipeline `sales`, and the
daily flow `scripts/daily/flow-sales-outreach.ts`.

Boardy.ai-sourced intros carry the `Boardy.ai` tag in the room — keep the tag on, it is how we measure
whether that channel produces buyers or only conversations.

## Open item — the existing visitor

The room shows **1 visitor and 1 invite** but 0 attachments. Before any new invite:

1. Identify the visitor in Noux (Vierailijat view).
2. Match them to a pipeline doc in `sales-outreach/`.
3. Upload P0 documents (`DOCUMENTS.md` items 1–4).
4. Follow up naming what is now in the room.

## Invite list (room-ready targets from the sales pipeline)

| Target            | Pipeline doc                                                                                            | Demo tenant slug                  | Room-ready?                  | Next action                   |
| ----------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------- | ----------------------------- |
| Outokumpu         | [`INTRO_ARI_HIRVONEN_OUTOKUMPU.md`](../../sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md)               | `dev.outokumpu@dws10.com`         | after P0 docs                | Provision tenant, then invite |
| Kemira            | [`INTRO_MARIA_SEDERHOLM_KEMIRA.md`](../../sales-outreach/INTRO_MARIA_SEDERHOLM_KEMIRA.md)               | `dev.kemira@dws10.com`            | after P0 docs                | Provision tenant, then invite |
| Valmet Automotive | [`INTRO_PASI_RANNUS_VALMET_AUTOMOTIVE.md`](../../sales-outreach/INTRO_PASI_RANNUS_VALMET_AUTOMOTIVE.md) | `dev.valmet-automotive@dws10.com` | after P0 docs                | —                             |
| Consti Group      | [`INTRO_CONSTI_GROUP.md`](../../sales-outreach/INTRO_CONSTI_GROUP.md)                                   | `dev.consti@dws10.com`            | after P0 + construction case | —                             |
| GRK Infra         | [`INTRO_GRK_INFRA.md`](../../sales-outreach/INTRO_GRK_INFRA.md)                                         | `dev.grk@dws10.com`               | after P0 + construction case | —                             |
| Kreate Group      | [`INTRO_KREATE_GROUP.md`](../../sales-outreach/INTRO_KREATE_GROUP.md)                                   | `dev.kreate@dws10.com`            | after P0 + construction case | —                             |
| Istekki           | [`INTRO_ISTEKKI_OY_FI.md`](../../sales-outreach/INTRO_ISTEKKI_OY_FI.md)                                 | `dev.istekki@dws10.com`           | FI docs required             | —                             |

Slug convention and provisioning: [`../DEMO_TENANTS.md`](../DEMO_TENANTS.md).

## Invite copy

FI for Finnish targets, EN otherwise. From `risto.paarni2024@lifetime.fi` on live threads,
`risto.paarni@lifetime.fi` cold. Short sig, phone included. **Sending is RED zone — HIC sends.**

The invite names the tenant, not the room: "your environment is ready at
`dev.<customer>@dws10.com` — the trial scope and the compliance coverage are in the room."

## Follow-up loop on room signals

| Noux signal                      | Meaning                           | Action                                                                     | Within   |
| -------------------------------- | --------------------------------- | -------------------------------------------------------------------------- | -------- |
| Visit, no doc opened             | Landing copy did not connect      | Follow up naming the one document for their role                           | 2 days   |
| Trial scope + pricing opened     | Buying-stage                      | Offer the pilot call; prepare the pilot agreement                          | 1 day    |
| Security/sovereignty doc opened  | Technical gate is being run       | Offer a call with the technical answers; expect NIS2 / EU AI Act questions | 1 day    |
| Demo tenant logged into          | Highest-value signal in this room | Watch first-session usage; follow up on what they actually tried           | same day |
| Tenant provisioned, never opened | Invite failed, not the product    | Re-send tenant link by a different channel                                 | 3 days   |
| Trial day 25                     | Expiry approaching                | Convert-or-close conversation (calendar event set at provisioning)         | day 25   |
| Comment in room                  | Highest-intent signal             | Reply same day, log here                                                   | same day |

## Signal log

| Date       | Signal                             | Who          | Action taken                                                     |
| ---------- | ---------------------------------- | ------------ | ---------------------------------------------------------------- |
| 2026-08-30 | 1 visitor, 1 invite, 0 attachments | unidentified | Room folder created; visitor identification + P0 uploads pending |
