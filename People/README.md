# 👥 People Database

**Lifetime Group & DWS IQ 6 Contact Management System**

---

## 📊 Overview

This directory contains structured information about key people in the Lifetime Group ecosystem:

- **Internal**: Team members, leadership, employees
- **Partners**: Technology partners, consultants, advisors
- **Customers**: Enterprise clients, pilot users, prospects
- **Investors**: Current investors, prospects, advisors

---

## 📁 Directory Structure

```
People/
├── README.md                    # This file
├── people_database.json         # Master database (JSON)
├── supabase-people-schema.sql   # Supabase schema
├── internal/                    # Internal team
│   ├── leadership/
│   │   └── risto.md
│   └── team/
├── partners/                    # Partners & advisors
│   ├── ai/
│   │   └── boardy.md           # Boardy AI tactical asset
│   ├── technology/
│   └── consultants/
├── customers/                   # Customer contacts
│   ├── enterprise/
│   └── pilots/
└── investors/                   # Investor relations
    ├── current/
    └── prospects/
```

---

## 🏷️ Tag System

### Primary Tags
- `internal` - Team members
- `partner` - Partners & advisors
- `customer` - Clients & prospects
- `investor` - Investors & prospects

### Role Tags
- `founder` - Company founders
- `ceo` - Chief Executive Officer
- `cto` - Chief Technology Officer
- `director` - Directors
- `manager` - Managers
- `developer` - Developers
- `advisor` - Advisors
- `consultant` - Consultants

### Product Tags
- `firehorse` - Firehorse products
- `dws-iq` - DWS IQ 6 platform
- `carbon` - Carbon reporting
- `construction` - Construction sector
- `infrastructure` - Infrastructure sector

### Status Tags
- `active` - Active relationship
- `prospect` - Potential relationship
- `inactive` - Inactive relationship
- `vip` - VIP contact

---

## 📋 Data Schema

### Person Object

```json
{
  "id": "unique-id",
  "type": "internal|partner|customer|investor",
  "status": "active|prospect|inactive",
  "personal": {
    "first_name": "string",
    "last_name": "string",
    "full_name": "string",
    "title": "string",
    "email": "string",
    "phone": "string",
    "linkedin": "url",
    "photo_url": "url"
  },
  "organization": {
    "company": "string",
    "department": "string",
    "role": "string",
    "location": {
      "city": "string",
      "country": "string",
      "region": "Nordic|Central Europe|Global"
    }
  },
  "professional": {
    "education": "string",
    "expertise": ["string"],
    "languages": ["string"],
    "certifications": ["string"]
  },
  "relationship": {
    "tags": ["string"],
    "products": ["firehorse", "dws-iq"],
    "interests": ["string"],
    "engagement_level": "high|medium|low",
    "last_contact": "ISO date",
    "next_action": "string",
    "notes": "string"
  },
  "business": {
    "contract_value": "number",
    "contract_start": "ISO date",
    "contract_end": "ISO date",
    "payment_terms": "string",
    "projects": ["string"]
  },
  "metadata": {
    "created_at": "ISO date",
    "updated_at": "ISO date",
    "created_by": "string",
    "updated_by": "string"
  }
}
```

---

## 🔍 Usage Examples

### Query by Type
```bash
# Find all internal team members
jq '.[] | select(.type == "internal")' people_database.json

# Find all customers
jq '.[] | select(.type == "customer")' people_database.json
```

### Query by Product
```bash
# Find all Firehorse contacts
jq '.[] | select(.relationship.products[] == "firehorse")' people_database.json
```

### Query by Status
```bash
# Find all active investors
jq '.[] | select(.type == "investor" and .status == "active")' people_database.json
```

---

## 🔐 Privacy & GDPR

**IMPORTANT**: This database contains personal information.

### Compliance
- ✅ GDPR compliant
- ✅ Consent-based
- ✅ Right to be forgotten
- ✅ Data minimization
- ✅ Purpose limitation

### Security
- 🔒 Row-Level Security (RLS) in Supabase
- 🔒 Encrypted at rest
- 🔒 Access control
- 🔒 Audit logging

### Data Retention
- Active contacts: Indefinite
- Prospects: 2 years
- Inactive: 1 year after last contact
- Deleted: 30 days in trash

---

## 📊 Integration

### Supabase
```sql
-- See: supabase-people-schema.sql
-- Tables: people, interactions, notes
```

### CRM Integration
- HubSpot (future)
- Salesforce (future)
- LinkedIn Sales Navigator (future)

### Email Integration
- Gmail API (future)
- Outlook API (future)

---

## 🚀 Quick Start

### 1. Add New Person

```bash
# Copy template
cp People/templates/person_template.json People/internal/leadership/new_person.json

# Edit details
code People/internal/leadership/new_person.json

# Add to database
jq '. += [input]' people_database.json new_person.json > temp.json
mv temp.json people_database.json
```

### 2. Update Person

```bash
# Edit file
code People/internal/leadership/risto.json

# Sync to database
# (automated via git hooks)
```

### 3. Search People

```bash
# By name
jq '.[] | select(.personal.full_name | contains("Risto"))' people_database.json

# By company
jq '.[] | select(.organization.company | contains("Lifetime"))' people_database.json
```

---

## 📈 Analytics

### Key Metrics
- Total contacts: `jq 'length' people_database.json`
- Active customers: `jq '[.[] | select(.type == "customer" and .status == "active")] | length'`
- Investor prospects: `jq '[.[] | select(.type == "investor" and .status == "prospect")] | length'`

### Reports
- Monthly contact summary
- Engagement tracking
- Pipeline analysis
- Relationship health

---

## 🔄 Maintenance

### Regular Tasks
- [ ] Weekly: Update last_contact dates
- [ ] Monthly: Review inactive contacts
- [ ] Quarterly: Clean up prospects
- [ ] Annually: GDPR compliance audit

### Backup
```bash
# Daily backup to Supabase
# Weekly backup to encrypted storage
# Monthly backup to offline storage
```

---

**Last Updated**: December 31, 2025  
**Maintained By**: Risto (Founder & CEO)  
**Version**: 1.0.0
