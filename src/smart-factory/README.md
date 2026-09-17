# Smart Factory for Sales (Firehorse Omnichannel)

Automated go-to-market engine: takes a product catalog of **any size**, finds
prospects who need those products, contacts them across **email, WhatsApp,
LinkedIn and Facebook**, and **books calls** into the existing DWS booking
system.

This is the working implementation behind the Firehorse Omnichannel V2
"Smart Factory" capability — DWS runs its own product as the agent
(`smart-factory`, `src/agents/smart-factory.agent.ts`).

## Pipeline

```
catalog (N products) ──► prospect sourcing ──► deterministic matching ──► upsert prospects
                                                                          │
                                        ┌─────────────────────────────────┘
                                        ▼
                     channel routing ──► rate-capped dispatch ──► call booking on reply
```

| Stage | Module | Notes |
|---|---|---|
| Catalog normalization | `catalog.ts` | Accepts array, `{products:[...]}` or the DWS store map format (`dws10.com/config/products.json`). Extracts keywords/industries/regulations per product. |
| Matching | `match.ts` | Deterministic token-overlap scoring of every candidate against every product. Threshold 0.2, top-3 products kept per prospect. |
| Channel routing | `channels.ts` | email → SES; WhatsApp → Meta Cloud API; LinkedIn → **always human-in-the-loop** (`firehorse/linkedin-pending`); Facebook → manual task. Message templates EN/FI by country code. |
| Dispatch | `sender.ts` | Atomic daily cap via `smart_factory_reserve_send` RPC (same pattern as TED outreach). Reserve before transport, release on failure. Every outcome persisted to `smart_factory_messages`. |
| Call booking | `booker.ts` | Inserts into `booking_reservations` (migration 064), finds next free slot via `v_booked_slots`, marks prospect `call_booked`. |
| Orchestration | `pipeline.ts` | Sources candidates from `EU_TARGET_UNIVERSE` + recent TED construction leads, then runs match → persist → dispatch. |

## Database

Migration [`supabase/migrations/083_smart_factory_sales.sql`](../../supabase/migrations/083_smart_factory_sales.sql):

- `smart_factory_campaigns` — campaign config + normalized catalog JSON + channels + daily cap
- `smart_factory_prospects` — matched prospects (`matched_products` JSONB), dedup key per campaign
- `smart_factory_messages` — full outbound audit trail per channel
- `smart_factory_daily_send` + atomic reserve/release RPCs — concurrency-safe rate limiting

All tables RLS-enabled, service-role only.

## Running it

```bash
# Daily pipeline (cron / GitHub Actions)
node --import tsx scripts/smart-factory-daily.ts

# Compose-only dry run (no dispatch)
SMART_FACTORY_NO_SEND=true node --import tsx scripts/smart-factory-daily.ts

# Via API (shared secret X-Smart-Factory-Key header, SMART_FACTORY_KEY env)
curl -X POST http://localhost:3001/api/v1/smart-factory/run \
  -H "X-Smart-Factory-Key: $SMART_FACTORY_KEY" \
  -H "Content-Type: application/json" \
  -d '{"campaignName":"q3-firehorse","channels":["email","linkedin"]}'

# Book a call for a prospect
curl -X POST http://localhost:3001/api/v1/smart-factory/book \
  -H "X-Smart-Factory-Key: $SMART_FACTORY_KEY" \
  -H "Content-Type: application/json" \
  -d '{"campaignId":"...","prospectId":"...","customerName":"Maija","customerEmail":"maija@acme.fi"}'
```

### Environment

| Variable | Purpose |
|---|---|
| `SMART_FACTORY_CATALOG_PATH` | Custom catalog JSON (default `dws10.com/config/products.json`) |
| `SMART_FACTORY_DAILY_CAP` | Daily send cap (default 30; enforced atomically in DB) |
| `SMART_FACTORY_CHANNELS` | Cron channel list (default `email`) |
| `SMART_FACTORY_QUEUE_MANUAL=true` | Also queue LinkedIn/Facebook drafts for human delivery |
| `SMART_FACTORY_CTA_URL` | Booking link embedded in messages |
| `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` | Meta WhatsApp Cloud API credentials |
| `SMTP_*`, `EMAIL_FROM` | SES email transport (existing) |
| `SMART_FACTORY_KEY` | API shared secret |

## Safety model

- Email + WhatsApp are automated but rate-capped (atomic DB counter).
- LinkedIn is **never** auto-sent — drafts queue for a human (MDP policy,
  account-risk control). Facebook DMs likewise.
- All sends, failures and manual queues land in `smart_factory_messages`.
- Without Supabase or transports configured the pipeline degrades to a
  dry-run report instead of failing silently.
