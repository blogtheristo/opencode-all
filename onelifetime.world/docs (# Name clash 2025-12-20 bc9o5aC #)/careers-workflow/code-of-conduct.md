# Lifetime Consulting Oy - Code of Conduct
## Toimintaohjeet

---

## 1. Missiomme ja Arvomme / Our Mission and Values

### Suomi
**Missio**: Kiihdytämme siirtymää perinteisjärjestelmistä älykkääseen päätöksentekoon, muuttaen vuoden 2050 tavoitteet vuoden 2026 näkemyksiksi.

**Ydinarvot**:
- **Tekninen erinomainen**: Sub-100ms vasteajat eivät ole tavoite, vaan standardi
- **Dataturvallisuus ensisijaisena**: EU-datavaatimukset, GDPR-compliance, asiakkaiden tietosuoja
- **Ilmastovastuullisuus**: Fit for 55 -optimointi ja uusiutuva sähköistäminen
- **Avoimuus ja rehellisyys**: Läpinäkyvä viestintä asiakkaille ja tiimille
- **Jatkuva oppiminen**: AI-kentän nopea kehitys vaatii päivittäistä opiskelua

### English
**Mission**: We accelerate the transition from legacy operations to intelligent decisioning, translating 2050 goals into 2026 insights.

**Core Values**:
- **Technical Excellence**: Sub-100ms response times are not goals, but standards
- **Data Security First**: EU data residency, GDPR compliance, customer privacy
- **Climate Responsibility**: Fit for 55 optimization and renewable electrification
- **Transparency and Integrity**: Clear communication with clients and team
- **Continuous Learning**: Rapid AI field evolution requires daily study

---

## 2. Ammatillinen Käytös / Professional Conduct

### Suomi
**Asiakassuhteissa**:
- Lupaa vain mitä voidaan toimittaa: Sub-100ms SLA:t ovat sitovia
- Dokumentoi kaikki tekniset päätökset ja niiden perustelut
- Ilmoita asiakkaalle välittömästi kaikista kriittisistä ongelmista (< 1h)
- Kunnioita asiakkaiden proprietary dataa: ei koskaan shared learning setiin

**Tiimityöskentelyssä**:
- Code review pakollinen kaikille production-muutoksille
- Kommunikoi proaktiivisesti: Jos et voi pitää deadlinea, kerro 48h etukäteen
- Jaa oppimaasi: Jokaisen on pidettävä vähintään yksi tech talk / kvartaali
- Tue kollegoita: Senior-kehittäjät varaavat 10% ajastaan junioreiden mentoroinnille

**Etätyön standardit**:
- Core hours: 10:00-15:00 EET, jolloin kaikki tavoitettavissa
- Response time Slack: < 2h työaikana, < 24h työajan ulkopuolella
- Kamera päälle tärkeissä asiakaspalaverissa ja viikkopalaverissa
- Async-first: Dokumentoi päätökset, älä oleta että kaikki olivat kokouksessa

### English
**Client Relationships**:
- Promise only what can be delivered: Sub-100ms SLAs are binding
- Document all technical decisions and rationale
- Inform clients immediately of critical issues (< 1h)
- Respect client proprietary data: never in shared learning sets

**Team Collaboration**:
- Code review mandatory for all production changes
- Communicate proactively: If missing deadline, notify 48h in advance
- Share learnings: Everyone hosts minimum one tech talk / quarter
- Support colleagues: Senior developers allocate 10% time to mentoring juniors

**Remote Work Standards**:
- Core hours: 10:00-15:00 EET, everyone available
- Slack response time: < 2h during work hours, < 24h outside
- Camera on for important client meetings and weekly meetings
- Async-first: Document decisions, don't assume everyone was in meeting

---

## 3. Tietoturva ja Tietosuoja / Data Security and Privacy

### Suomi
**EU Compliance**:
- Kaikki asiakasdata säilytetään EU-alueella (Google Cloud europe-north1)
- GDPR-compliance tarkistetaan kvartaalittain ulkopuolisen auditoijan toimesta
- Data classification: Strategic / Operational / Proprietary - noudata eristystasoja
- Personal data minimization: Kerää vain välttämätön, poista 90 päivän kuluttua

**Tekninen tietoturva**:
- 2FA pakollinen kaikille järjestelmille (GitHub, Google Cloud, Supabase)
- API keys: Koskaan version kontrollin, käytä secret manageria (Google Secret Manager)
- Edge device security: TPM-based attestation pakollinen NVIDIA Jetson -laitteissa
- Incident response: < 1h initial assessment, < 4h mitigation plan

**Asiakkaiden proprietary data**:
- KOSKAAN ei käytetä global model trainingiin ilman eksplisiittistä kirjallista lupaa
- Isoloidut deployment-forkit jokaiselle asiakkaalle partner-ohjelmassa
- Zero-knowledge encryption customer databases (Supabase vault)
- Right to be forgotten: 30 päivän SLA täydelliseen datan poistoon

### English
**EU Compliance**:
- All customer data stored in EU region (Google Cloud europe-north1)
- GDPR compliance checked quarterly by external auditor
- Data classification: Strategic / Operational / Proprietary - follow isolation levels
- Personal data minimization: Collect only necessary, delete after 90 days

**Technical Security**:
- 2FA mandatory for all systems (GitHub, Google Cloud, Supabase)
- API keys: Never in version control, use secret manager (Google Secret Manager)
- Edge device security: TPM-based attestation mandatory for NVIDIA Jetson devices
- Incident response: < 1h initial assessment, < 4h mitigation plan

**Customer Proprietary Data**:
- NEVER used for global model training without explicit written consent
- Isolated deployment forks for each customer in partner program
- Zero-knowledge encryption for customer databases (Supabase vault)
- Right to be forgotten: 30-day SLA for complete data deletion

---

## 4. Tekninen Standardit / Technical Standards

### Suomi
**Performance Requirements**:
- Sub-100ms inference latency 99th percentile
- Edge-to-cloud data sync < 200ms round trip
- API availability 99.9% (max 8.76h downtime/vuosi)
- Load testing pakollinen ennen jokaista production deploymenttiä

**Code Quality**:
- TypeScript strict mode pakollinen
- Unit test coverage minimum 80% critical paths
- Integration tests kaikille API endpoints
- Documentation: TSDoc kommentit kaikille public functions

**Infrastructure as Code**:
- Kaikki infra Terraform / Pulumi koodissa
- Git-based deployment pipeline (GitHub Actions)
- Immutable infrastructure: Ei manuaalisia muutoksia production-ympäristöön
- Disaster recovery: RTO < 4h, RPO < 15min

### English
**Performance Requirements**:
- Sub-100ms inference latency at 99th percentile
- Edge-to-cloud data sync < 200ms round trip
- API availability 99.9% (max 8.76h downtime/year)
- Load testing mandatory before every production deployment

**Code Quality**:
- TypeScript strict mode mandatory
- Unit test coverage minimum 80% for critical paths
- Integration tests for all API endpoints
- Documentation: TSDoc comments for all public functions

**Infrastructure as Code**:
- All infrastructure in Terraform / Pulumi code
- Git-based deployment pipeline (GitHub Actions)
- Immutable infrastructure: No manual changes to production environment
- Disaster recovery: RTO < 4h, RPO < 15min

---

## 5. Liiketoiminnan Etiikka / Business Ethics

### Suomi
**Asiakassuhteet**:
- Kiinteät hinnat vahvistetaan kirjallisesti ennen projektin alkua
- Muutospyynnöt dokumentoidaan change request -prosessissa
- Läpinäkyvä kustannusraportointi: Asiakas näkee cloud costs breakdown kuukausittain
- Ei vendor lock-in: Asiakkaalla aina pääsy omaan dataansa standard-formaateissa

**Kilpailu**:
- Emme parjaa kilpailijoita, keskitymme omaan vahvuuteemme
- Kilpailijoiden IP kunnioitetaan: Ei reverse engineeringiä
- Open source contributions: Palauta yhteisölle aina kun mahdollista
- Fair pricing: LTV:CAC ratio 6.8-8.3:1 on kestävä, ei saalistushinnoittelua

**Rahoitus ja talous**:
- Tarkka kirjanpito pakollinen: Talous tarkistetaan kuukausittain
- Runway-laskenta: Aina 6kk näkyvyys kassavirtaan
- Investor relations: Kvartaalin päivitykset osakkeenomistajille
- Expense policy: Yli €500 kulut vaativat esimiehen hyväksynnän

### English
**Client Relations**:
- Fixed prices confirmed in writing before project start
- Change requests documented in change request process
- Transparent cost reporting: Client sees cloud costs breakdown monthly
- No vendor lock-in: Customer always has access to their data in standard formats

**Competition**:
- We don't disparage competitors, focus on our strengths
- Respect competitor IP: No reverse engineering
- Open source contributions: Give back to community when possible
- Fair pricing: LTV:CAC ratio 6.8-8.3:1 is sustainable, no predatory pricing

**Finance and Accounting**:
- Accurate bookkeeping mandatory: Finance reviewed monthly
- Runway calculation: Always 6-month visibility to cash flow
- Investor relations: Quarterly updates to shareholders
- Expense policy: Expenses over €500 require manager approval

---

## 6. Ympäristövastuu / Environmental Responsibility

### Suomi
**Carbon Footprint**:
- Cloud provider: Google Cloud käyttää 100% uusiutuvaa energiaa EU-regioissa
- Edge computing: NVIDIA Jetson optimoitu tehonkulutukselle (5-15W per device)
- Travel policy: Prioritoi remote, lennot vain asiakaskohtaamisiin
- Office: Paperless operations, kierrätys 95%

**Tuotteiden impact**:
- DWS IQ auttaa asiakkaita saavuttamaan Fit for 55 -tavoitteet
- ROI measurement: Seuraa asiakkaan CO2-vähennyksiä kvartaaleittain
- Renewable electrification optimization → suora climate impact
- Green metrics raportoidaan asiakkaille transparently

### English
**Carbon Footprint**:
- Cloud provider: Google Cloud uses 100% renewable energy in EU regions
- Edge computing: NVIDIA Jetson optimized for power consumption (5-15W per device)
- Travel policy: Prioritize remote, flights only for client meetings
- Office: Paperless operations, 95% recycling

**Product Impact**:
- DWS IQ helps clients achieve Fit for 55 targets
- ROI measurement: Track client CO2 reductions quarterly
- Renewable electrification optimization → direct climate impact
- Green metrics reported to clients transparently

---

## 7. Työhyvinvointi / Workplace Wellbeing

### Suomi
**Work-Life Balance**:
- Ei oleteta 24/7 saavutettavuutta: On-call rotaatio dokumentoitu
- Lomapolitiikka: 25 päivää + joulu-uusi vuosi + juhannusviikko
- Burnout prevention: Jos viikottainen tuntimäärä > 45h kahden viikon ajan, pakollinen keskustelu esimiehen kanssa
- Flexible hours: Core hours 10-15 EET, muu työaika vapaa

**Terveys**:
- Työterveyshuolto kaikille työntekijöille
- Mental health support: Terapia-sessiot työnantajan kustannuksella
- Ergonomic workspace: €500 budjetti etätyö setupille
- Sport benefit: €50/kk liikuntaetuus

**Osaamisen kehitys**:
- Training budget: €2000/henkilö/vuosi konferensseille ja kursseille
- Kirjallisuus: Unlimited budget teknisille kirjoille ja subscriptioille
- Certificates: AWS/Google Cloud sertifikaatit työnantajan kustannuksella
- Conference speaking: Prioritized, kaikki kulut katetaan

### English
**Work-Life Balance**:
- No 24/7 availability expectation: On-call rotation documented
- Vacation policy: 25 days + Christmas-New Year + Midsummer week
- Burnout prevention: If weekly hours > 45h for two weeks, mandatory discussion with manager
- Flexible hours: Core hours 10-15 EET, other work time flexible

**Health**:
- Occupational health care for all employees
- Mental health support: Therapy sessions covered by employer
- Ergonomic workspace: €500 budget for remote work setup
- Sport benefit: €50/month for fitness activities

**Skills Development**:
- Training budget: €2000/person/year for conferences and courses
- Literature: Unlimited budget for technical books and subscriptions
- Certificates: AWS/Google Cloud certifications covered by employer
- Conference speaking: Prioritized, all expenses covered

---

## 8. Riitojen Ratkaisu / Conflict Resolution

### Suomi
**Sisäinen prosessi**:
1. **Vaihe 1**: Keskustelu osapuolten kesken (48h aikataulu)
2. **Vaihe 2**: Keskustelu esimiehen kanssa (5 työpäivän aikataulu)
3. **Vaihe 3**: HR-prosessi (10 työpäivän aikataulu)
4. **Vaihe 4**: Ulkopuolinen sovittelu (30 päivän aikataulu)

**Whistleblowing**:
- Anonyymi ilmoituskanava: ethics@lifetime.fi
- Zero retaliation policy: Ilmoittajan suojelu absoluuttinen
- 48h kuittaus, 5 työpäivän initial investigation
- Ulkopuolinen legal counsel vakavissa tapauksissa

**Asiakasriidat**:
- Escalation path dokumentoitu asiakassopimuksessa
- Mediation preferred over litigation
- Dispute resolution timeline: 30 päivää sovinnolliseen ratkaisuun
- Transparent communication maintained throughout process

### English
**Internal Process**:
1. **Step 1**: Discussion between parties (48h timeline)
2. **Step 2**: Discussion with manager (5 business days timeline)
3. **Step 3**: HR process (10 business days timeline)
4. **Step 4**: External mediation (30 days timeline)

**Whistleblowing**:
- Anonymous reporting channel: ethics@lifetime.fi
- Zero retaliation policy: Reporter protection absolute
- 48h acknowledgment, 5 business days initial investigation
- External legal counsel for serious cases

**Client Disputes**:
- Escalation path documented in client contract
- Mediation preferred over litigation
- Dispute resolution timeline: 30 days to amicable solution
- Transparent communication maintained throughout process

---

## 9. Compliance ja Auditointi / Compliance and Auditing

### Suomi
**Säännöllinen auditointi**:
- GDPR compliance audit: Kvartaalittain
- Security audit: Puolivuosittain (ulkopuolinen pentester)
- Financial audit: Vuosittain (tilintarkastaja)
- Code quality audit: Jatkuva (automated tools)

**Dokumentaatio**:
- Kaikki compliance-dokumentit version-hallinnassa
- Audit trail: Muutosloki kaikista kriittisistä järjestelmistä
- Retention policy: 7 vuotta financial, 3 vuotta operational
- Backup verification: Kuukausittainen restore-testi

### English
**Regular Auditing**:
- GDPR compliance audit: Quarterly
- Security audit: Biannually (external pentester)
- Financial audit: Annually (certified auditor)
- Code quality audit: Continuous (automated tools)

**Documentation**:
- All compliance documents in version control
- Audit trail: Change log for all critical systems
- Retention policy: 7 years financial, 3 years operational
- Backup verification: Monthly restore test

---

## 10. Toimintaohjeiden Noudattaminen / Code Adherence

### Suomi
**Jokainen työntekijä**:
- Allekirjoittaa Code of Conduct työsopimuksen yhteydessä
- Käy läpi vuosittainen päivityskoulutus
- Voi ehdottaa muutoksia: Submit pull request GitHub repository
- On vastuussa rikkomusten raportoimisesta

**Rikkomukset**:
- **Lievä**: Kirjallinen varoitus + koulutus
- **Keskivaikea**: Kirjallinen varoitus + kurinpitotoimi (esim. bonuksen menetys)
- **Vakava**: Välitön irtisanominen + mahdollinen lakitoimi

**Jatkuva parantaminen**:
- Code of Conduct tarkistetaan kvartaalittain
- Työntekijöiden feedback kerätään nimettömästi puolivuosittain
- Best practices jaetaan tech talks -tilaisuuksissa
- Living document: Versio 1.0.0 (semantic versioning)

### English
**Every Employee**:
- Signs Code of Conduct upon employment contract
- Completes annual refresher training
- Can propose changes: Submit pull request to GitHub repository
- Responsible for reporting violations

**Violations**:
- **Minor**: Written warning + training
- **Moderate**: Written warning + disciplinary action (e.g. bonus forfeiture)
- **Serious**: Immediate termination + possible legal action

**Continuous Improvement**:
- Code of Conduct reviewed quarterly
- Employee feedback collected anonymously biannually
- Best practices shared in tech talks
- Living document: Version 1.0.0 (semantic versioning)

---

## Yhteystiedot / Contact Information

**Ethics & Compliance**: ethics@lifetime.fi  
**HR**: hr@lifetime.fi  
**Technical Security**: security@lifetime.fi  
**CEO**: risto@lifetime.fi

**Emergency Hotline**: +358 [number] (24/7 for critical security incidents)

---

## Dokumentin Historia / Document History

| Versio | Päivämäärä | Muutokset | Tekijä |
|--------|-----------|-----------|---------|
| 1.0.0 | 2024-12-16 | Initial release | Lifetime Consulting Oy |

---

*Tämä dokumentti on elävä ohjeistus, joka kehittyy yrityksemme ja alan mukana. Ehdotukset parannuksiin ovat tervetulleita.*

*This document is a living guideline that evolves with our company and industry. Suggestions for improvements are welcome.*
