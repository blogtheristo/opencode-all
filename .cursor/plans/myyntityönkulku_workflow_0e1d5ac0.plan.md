---
name: Myyntityönkulku Workflow
overview: "Rakennetaan automatisoitu myyntityönkulku-järjestelmä, joka käsittää kontaktien hallinnan CSV:stä, LinkedIn-kontaktoinnin (human-in-the-loop), agentti-pohjaisen prospektoinnin, personoidut myyntikirjeet, tapaamisten seurannan ja tarjousprosessin. Tavoite: 20 viestiä päivässä."
todos: []
---

#

Myyntityönkulku Workflow - Toteutussuunnitelma

## 1. Arkkitehtuuri ja teknologiapino

### 1.1 Komponentit

- **GitHub Actions**: Päivittäiset ajastetut työnkulut (20 viestiä/päivä)

- **Python-skriptit**: CSV-käsittely, agentti-integraatiot, dokumenttigenerointi

- **Temporal.io workflows**: Pitkäkestoiset prosessit (prospektointi, tarjousprosessi)

- **Supabase**: Workflow-tila, kontaktihistoria, tulokset

- **CSV-tiedostot** (`Admin/Li/lista_*.csv`): Lähdetiedot kontaktien hallintaan

### 1.2 Tietorakenteet

#### Supabase-skeema

```sql
-- Kontaktit
contacts (
  id UUID PRIMARY KEY,
  company_name TEXT,
  country TEXT,
  revenue_range TEXT,
  contact_name TEXT,
  title TEXT,
  linkedin_url TEXT,
  email TEXT,
  source_csv_file TEXT,
  created_at TIMESTAMP
)

-- Workflow-tilat
contact_states (
  id UUID PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id),
  state TEXT, -- 'new', 'prospected', 'qualified', 'contacted', 'meeting_scheduled', 'proposal_sent', 'won', 'lost', 'deferred'
  agent_analysis JSONB, -- Agentin prospektointianalyysi
  qualification_score INTEGER, -- 0-100
  notes TEXT,
  updated_at TIMESTAMP
)

-- Viestit ja kampanjat
messages (
  id UUID PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id),
  message_type TEXT, -- 'linkedin', 'email', 'phone'
  content TEXT,
  template_used TEXT,
  artifacts_used TEXT[], -- Myyntiartefaktien lista
  sent_at TIMESTAMP,
  opened_at TIMESTAMP,
  replied_at TIMESTAMP,
  status TEXT -- 'draft', 'pending_approval', 'sent', 'opened', 'replied'
)

-- Tapaamiset
meetings (
  id UUID PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id),
  scheduled_at TIMESTAMP,
  meeting_type TEXT, -- 'discovery', 'demo', 'proposal'
  outcome TEXT,
  notes TEXT,
  created_at TIMESTAMP
)

-- Tarjoukset
proposals (
  id UUID PRIMARY KEY,
  contact_id UUID REFERENCES contacts(id),
  proposal_number TEXT,
  country TEXT,
  contract_documents JSONB, -- Maakohtaiset sopimusasiakirjat
  status TEXT, -- 'draft', 'sent', 'accepted', 'rejected'
  value_eur DECIMAL,
  created_at TIMESTAMP
)

-- Kampanjat
campaigns (
  id UUID PRIMARY KEY,
  name TEXT,
  target_country TEXT[],
  target_revenue_range TEXT,
  daily_message_limit INTEGER DEFAULT 20,
  status TEXT, -- 'active', 'paused', 'completed'
  created_at TIMESTAMP
)
```

## 2. Workflow-vaiheet

### 2.1 Vaihe 1: Kontaktien import ja validointi

**Tiedosto**: `Admin/Li/workflows/import_contacts.py`

- Lue CSV-tiedostot (`lista_*.csv`)

- Validoi ja puhdista data

- Täydennä puuttuvat tiedot (LinkedIn-haku)

- Import Supabase-tietokantaan

- Luo `contact_states`-rivi jokaiselle kontaktille (state: 'new')

### 2.2 Vaihe 2: Agentti-pohjainen prospektointi

**Tiedosto**: `Admin/Li/workflows/prospect_contact.py`

**Temporal Workflow**: `ProspectContactWorkflow`

- Hae 'new'-tilassa olevat kontaktit

- Agentti analysoi:

- Yrityksen koko ja liikevaihto

- DWS IQ 6:n soveltuvuus (rakennus/infra-segmentti)

- Digitalisaatio- ja kestävyyspainotukset

- Maa ja lakisäädökset (Fit for 55, EPBD jne.)

- Päätös: `qualified` / `not_qualified` / `deferred`

- Tallenna `agent_analysis` ja `qualification_score`

### 2.3 Vaihe 3: Myyntiartefaktien valinta

**Tiedosto**: `Admin/Li/workflows/select_artifacts.py`

- Agentti valitsee kontaktin perusteella:

- Personoitu myyntikirje (PORR-esimerkki: PORR 2025 -ohjelma)

- Tuotetiedot (DWS IQ 6, Firehorse, Mobility)

- Hinnoittelu (Pilot/Alpha/V1)

- Referenssit (NCC, muut pohjoismaiset)

- Maakohtaiset compliance-tiedot

- Tallenna valinta `messages`-tauluun (status: 'draft')

### 2.4 Vaihe 4: Personoidun kirjeen generointi

**Tiedosto**: `Admin/Li/workflows/generate_message.py`

**Mallit**: `Admin/Li/templates/`

- Käytä Claude/Groq API:a personoidun viestin generointiin

- Inputit:

- Kontaktin tiedot (yritys, titteli, maa)

- Agentin prospektointianalyysi

- Valitut myyntiartefaktit

- Yrityskohtaiset tiedot (esim. PORR 2025 -ohjelma)

- Output: Personoitu LinkedIn-viesti tai email

- Tallenna `messages`-tauluun (status: 'pending_approval')

### 2.5 Vaihe 5: Human-in-the-loop -hyväksyntä

**Tiedosto**: `Admin/Li/workflows/approval_queue.py`

**GitHub Actions**: `.github/workflows/sales-approval-reminder.yml`

- Listaa 'pending_approval'-viestit

- Lähetä päivittäinen reminder GitHub Issuesiin tai emailiin

- Ihmisen hyväksyntä → status: 'approved'

- Ihmisen hylkäys → status: 'rejected' (syyt tallennetaan)

### 2.6 Vaihe 6: LinkedIn-kontaktointi

**Tiedosto**: `Admin/Li/workflows/send_linkedin_message.py`

**GitHub Actions**: `.github/workflows/daily-sales-outreach.yml`

- Hae 'approved'-viestit (max 20/päivä)

- **Human-in-the-loop**: Ihmisen tarkistus ennen lähetystä

- Lähetä LinkedIn-viesti (manuaalinen tai API jos saatavilla)

- Päivitä status: 'sent'

- Seuraa avausta/vastausta (jos mahdollista)

### 2.7 Vaihe 7: Vastausten käsittely

**Tiedosto**: `Admin/Li/workflows/handle_response.py`

- Seuraa vastauksia (manuaalinen tai API)

- Päivitä `messages.replied_at`

- Jos positiivinen vastaus → `contact_states.state = 'meeting_scheduled'`

- Luo `meetings`-rivi

### 2.8 Vaihe 8: Tapaamisten seuranta

**Tiedosto**: `Admin/Li/workflows/track_meetings.py`

- Tallenna tapaamisen tulokset

- Jos demo/tarjouspyyntö → `contact_states.state = 'proposal_requested'`

### 2.9 Vaihe 9: Tarjousgenerointi

**Tiedosto**: `Admin/Li/workflows/generate_proposal.py`

**Temporal Workflow**: `GenerateProposalWorkflow`

- Hae maakohtaiset sopimusasiakirjat (`Admin/Li/contracts/`)

- Generoi tarjous:

- Tuotetasot ja hinnat (Pilot/Alpha/V1)

- Maakohtaiset sopimusasiakirjat

- Compliance-tiedot (Fit for 55, GDPR jne.)

- Tallenna `proposals`-tauluun

- Lähetä asiakkaalle

### 2.10 Vaihe 10: Tulosten kirjaaminen ja raportointi

**Tiedosto**: `Admin/Li/workflows/report_results.py`

**GitHub Actions**: `.github/workflows/weekly-sales-report.yml`

- Päivittäinen yhteenveto:

- Lähetetyt viestit

- Vastaukset

- Tapaamiset

- Tarjoukset

- Viikoittainen raportti GitHub Issuesiin

## 3. Tiedostorakenne

```javascript
Admin/Li/
├── workflows/
│   ├── import_contacts.py
│   ├── prospect_contact.py
│   ├── select_artifacts.py
│   ├── generate_message.py
│   ├── approval_queue.py
│   ├── send_linkedin_message.py
│   ├── handle_response.py
│   ├── track_meetings.py
│   ├── generate_proposal.py
│   └── report_results.py
├── templates/
│   ├── linkedin_message_base.md
│   ├── email_message_base.md
│   └── proposal_template.md
├── artifacts/
│   ├── product_info_dws_iq6.md
│   ├── pricing_pilot_alpha_v1.md
│   ├── references_ncc.md
│   └── compliance_fit_for_55.md
├── contracts/
│   ├── finland/
│   ├── sweden/
│   ├── norway/
│   ├── denmark/
│   ├── germany/
│   └── austria/
├── lista_*.csv (lähdetiedot)
└── config.yaml (workflow-asetukset)
```

## 4. GitHub Actions -workflowt

### 4.1 Päivittäinen myyntikontaktointi

**Tiedosto**: `.github/workflows/daily-sales-outreach.yml`

- Ajetaan joka arkipäivä klo 08:00

- Hae 20 seuraavaa 'approved'-viestiä

- Luo GitHub Issue hyväksyntää varten

- Jos hyväksytty → valmista lähetystä varten

### 4.2 Viikoittainen raportti

**Tiedosto**: `.github/workflows/weekly-sales-report.yml`

- Ajetaan maanantaisin

- Generoi viikon yhteenveto

- Lähetä GitHub Issuesiin

### 4.3 Kontaktien import

**Tiedosto**: `.github/workflows/import-contacts.yml`

- Ajetaan manuaalisesti tai viikoittain

- Importoi uudet CSV-rivit Supabaseen

## 5. Temporal.io -workflowt

### 5.1 ProspectContactWorkflow

- Pitkäkestoiset prospektointitehtävät

- Retry-logiikka

- Timeout-asetukset

### 5.2 GenerateProposalWorkflow

- Tarjousgenerointi asynkronisesti

- Maakohtaisten dokumenttien käsittely

## 6. Agentti-integraatiot

### 6.1 Prospektointi-agentti

- Käyttää Claude Sonnet 4.5

- Analysoi yrityksen soveltuvuuden DWS IQ 6:lle

- Generoi qualification_score

### 6.2 Viestigenerointi-agentti

- Käyttää Claude Sonnet 4.5

- Generoi personoidut myyntikirjeet

- Yhdistää myyntiartefaktit

## 7. Konfiguraatio

**Tiedosto**: `Admin/Li/config.yaml`

```yaml
workflow:
  daily_message_limit: 20
  approval_required: true
  linkedin_api_enabled: false  # Aluksi manuaalinen
  
supabase:
  url: ${SUPABASE_URL}
  key: ${SUPABASE_KEY}
  
agents:
  prospecting:
    model: "claude-sonnet-4.5"
    api_key: ${CLAUDE_API_KEY}
  message_generation:
    model: "claude-sonnet-4.5"
    api_key: ${CLAUDE_API_KEY}
    
templates:
  linkedin_base: "templates/linkedin_message_base.md"
  email_base: "templates/email_message_base.md"
```

## 8. Toteutusvaiheet

1. **Vaihe 1**: Supabase-skeeman luonti

2. **Vaihe 2**: CSV-import -skriptin kehitys

3. **Vaihe 3**: Prospektointi-agentin integraatio

4. **Vaihe 4**: Viestigenerointi-agentin integraatio

5. **Vaihe 5**: GitHub Actions -workflowt

6. **Vaihe 6**: Temporal.io -workflowt

7. **Vaihe 7**: Myyntiartefaktien valmistelu

8. **Vaihe 8**: Testaus ja iterointi

9. **Vaihe 9**: Tuotantokäyttöönotto

## 9. Seuranta ja mittarit

- Lähetetyt viestit/päivä

- Vastausprosentti

- Tapaamiset/vastaus

- Tarjoukset/tapaaminen
- Voitto/tarjous