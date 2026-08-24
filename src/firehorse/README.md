# Firehorse Omnichannel Next Pilot - CustomerPilotLoop v1

Automatisoidtu myyntiprosessi DWS IQ 6 + Firehorse piloteille.

## Tavoite

- 2 uutta DWS IQ 6 + Firehorse pilottia Q1/26 (Nordics infra / construction)
- Päivittäin: 30 uutta outbound-kontaktia
- Tavoite: ≥1 tapaaminen/päivä

## Lead States

```
New → Cold_1_Sent → Cold_1_Opened → Engaged → Meeting_Booked
                                   ↓
                          Cold_1_Clicked → Engaged
                  ↓
         Cold_2_Sent (3d) → Cold_3_Sent (5d)
                  ↓                    ↓
              Disqualified        Parked
```

## Triggers

| Trigger | Kuvaus |
|---------|--------|
| `t_new_day` | Kerran päivässä 08:00 |
| `t_email_open` | Email avattu |
| `t_link_click` | Linkki klikattu |
| `t_reply` | Email-vastaus saapunut |
| `t_meeting_booked` | Tapaaminen varattu |
| `t_cold1_no_engagement_3d` | Ei engagementtia 3 päivää Cold 1:n jälkeen |
| `t_cold2_no_engagement_5d` | Ei engagementtia 5 päivää Cold 2:n jälkeen |

## Actions

| Action | Kuvaus |
|--------|--------|
| `a_send_email(template_id, lead_id)` | Lähetä email |
| `a_send_linkedin_dm(template_id, lead_id)` | Lähetä LinkedIn DM (tulevaisuudessa) |
| `a_change_state(new_state, lead_id)` | Vaihda lead-tilaa |
| `a_log_event(event_type, lead_id)` | Kirjaa tapahtuma |
| `a_create_task(owner, type, lead_id)` | Luo task myyjälle |

## Tietokanta

### Taulut

- `firehorse_leads` - Lead-tiedot ja tilat
- `firehorse_events` - Tapahtumaloki
- `firehorse_tasks` - Taskit myyjälle
- `firehorse_email_templates` - Email-templatet
- `firehorse_replies` - Vastaukset intent-analyysillä

### Views

- `firehorse_daily_new_leads` - Päivän uudet leadit (max 30)
- `firehorse_cold2_candidates` - Leadit jotka tarvitsevat Cold 2 follow-upin
- `firehorse_cold3_candidates` - Leadit jotka tarvitsevat Cold 3 follow-upin

## Email Templates

1. **CustomerPilot_Cold1_FI** - Ensimmäinen cold outreach (suomi)
2. **CustomerPilot_Cold1_EN** - Ensimmäinen cold outreach (englanti)
3. **CustomerPilot_Cold2_Reminder** - Toinen follow-up (3 päivää)
4. **CustomerPilot_Cold3_CloseLoop** - Kolmas ja viimeinen follow-up (5 päivää)

## API Endpoints

### Webhooks (email service integrations)

```
POST /firehorse/webhooks/email-opened
POST /firehorse/webhooks/link-clicked
POST /firehorse/webhooks/email-reply
POST /firehorse/webhooks/meeting-booked
```

### Manual Triggers (testing)

```
POST /firehorse/jobs/daily      # Trigger daily new leads job
POST /firehorse/jobs/cold2      # Trigger Cold 2 follow-up job
POST /firehorse/jobs/cold3      # Trigger Cold 3 follow-up job
```

### Lead Management

```
POST /firehorse/leads           # Create new lead
GET  /firehorse/leads/:id       # Get lead by ID
GET  /firehorse/leads/:id/events # Get lead events
GET  /firehorse/leads/:id/tasks  # Get lead tasks
```

## Käyttöönotto

### 1. Asenna dependencies

```bash
npm install @supabase/supabase-js node-cron
```

### 2. Konfiguroi ympäristömuuttujat

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
```

### 3. Aja database migration

```bash
# Supabase CLI
supabase migration up

# Tai kopioi SQL suoraan Supabase SQL Editoriin
# supabase/migrations/002_firehorse_pilot.sql
```

### 4. Integroi pääsovellukseen

```typescript
// src/app.ts
import { initFirehorsePilot, firehorseRoutes } from './firehorse';

// Initialize
initFirehorsePilot();

// Mount routes
app.use('/firehorse', firehorseRoutes);
```

### 5. Konfiguroi email service

Päivitä `src/firehorse/email-service.ts` integroimaan todellinen email service (SendGrid, Resend, AWS SES, etc.)

## Scheduler

Scheduler käynnistyy automaattisesti kun kutsut `initFirehorsePilot()`.

- **Päivittäiset uudet leadit**: 08:00
- **Follow-up prosessointi**: Joka 6. tunti

### Manuaalinen ajastus

```typescript
import { scheduler } from './firehorse';

// Aja yksittäinen job
await scheduler.runManually('daily');
await scheduler.runManually('cold2');
await scheduler.runManually('cold3');
await scheduler.runManually('all');
```

## Testing

### Luo testilead

```bash
curl -X POST http://localhost:3000/firehorse/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "Lead",
    "company": "Test Company",
    "country": "FI",
    "segment": "Infra/Construction"
  }'
```

### Simuloi email avaus

```bash
curl -X POST http://localhost:3000/firehorse/webhooks/email-opened \
  -H "Content-Type: application/json" \
  -d '{
    "lead_id": "lead-uuid",
    "email": "test@example.com",
    "opened_at": "2025-12-25T10:00:00Z"
  }'
```

### Aja päivittäinen job manuaalisesti

```bash
curl -X POST http://localhost:3000/firehorse/jobs/daily
```

## Arkkitehtuuri

```
src/firehorse/
├── types.ts           # TypeScript types ja enums
├── state-machine.ts   # State machine logiikka
├── actions.ts         # Action functions
├── database.ts        # Supabase database layer
├── email-service.ts   # Email service integration
├── scheduler.ts       # Cron scheduler
├── routes.ts          # Express API routes
├── index.ts           # Main entry point
└── README.md          # Tämä dokumentti
```

## Tulevat ominaisuudet

- [ ] LinkedIn DM automaatio
- [ ] AI-powered reply intent analysis (OpenAI/Anthropic)
- [ ] Slack notifications taskeihin
- [ ] Dashboard lead-tilastoille
- [ ] A/B testing email templateille
- [ ] Multi-channel tracking (email + LinkedIn + puhelu)

## Lisenssit ja turvallisuus

- **GDPR compliance**: Tallenna vain liiketoiminnallisesti tarpeelliset tiedot
- **Email unsubscribe**: Lisää unsubscribe-linkki kaikkiin emaileihin
- **Rate limiting**: Rajoita webhook-kutsuja
- **API auth**: Lisää autentikointi production-ympäristöön

## Yhteenveto

Firehorse Omnichannel Next Pilot on yksinkertainen, state machine -pohjainen myyntiautomaatio joka:

1. Lähettää 30 cold emailia päivässä
2. Seuraa engagement-triggereitä (avaukset, klikkaukset, vastaukset)
3. Lähettää automaattiset follow-upit (3d ja 5d)
4. Luo taskeja myyjälle kun lead on engaged
5. Tavoitteena ≥1 meeting/päivä

Koodipohja on modulaarinen ja helppo laajentaa lisäominaisuuksilla.
