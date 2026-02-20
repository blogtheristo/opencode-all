# LinkedIn Strategy Update - Pull Approach

## Muutos strategiassa

Sen sijaan että lähetetään suoraan viestejä (push-strategia), käytetään nyt **pull-strategiaa**:

1. **Profiili optimointi** - Tehdään profiilista kiinnostava
2. **Sisällöntuotanto** - LinkedIn-postaukset ja Scope Journal
3. **Connection ilman notea** - Lähetetään vain "Connect"
4. **DM vasta hyväksynnän jälkeen** - Kun he hyväksyvät, vasta sitten lyhyt DM

## Miksi tämä toimii paremmin?

- **Connection-kiintiö on pieni** - Ei tarvita Sales Navigator / Business Core
- **Korkeampi hyväksymisprosentti** - 50-70% vs. 10-20% noteettomilla
- **Luonnollinen flow** - He näkevät profiilin ensin, sitten vastaavat
- **Vähemmän aggressiivinen** - Ei "spammy" tunnetta

## Uudet workflow-vaiheet

### Vaihe 3: LinkedIn-profiilin optimointi (UUSI)
```bash
python Admin/Li/workflows/optimize_linkedin_profile.py
```

Generoi:
- Profiili-otsikko
- About-teksti
- 3 LinkedIn-postia
- Scope Journal -artikkelin

### Vaihe 7: Connection-pyyntö ilman notea (UUSI)
```bash
python Admin/Li/workflows/send_connection_request.py --queue
```

Lähetä noteeton connection-pyyntö. 50-70% hyväksyy jos profiili ja sisältö osuu kohdalleen.

### Vaihe 8: Follow-up DM (MUUTETTU)
```bash
python Admin/Li/workflows/send_linkedin_message.py --queue
```

Vasta HYVÄKSYNNÄN JÄLKEEN lähetetään lyhyt DM.

## 2 viikon toteutussuunnitelma

### Viikko 1-2: Profiili ja sisältö

1. **Päivitä profiili**
   - Otsikko: "Founder, Lifetime Group – DWS IQ 6 mobile control room for construction portfolios (SPI/CPI, safety, Fit for 55)"
   - Banner: Mobiilinäyttö
   - About: Ongelma → ratkaisu → pilot €29,950

2. **Julkaise 3 postia**
   - Post 1: NCC-tyyppinen walkthrough
   - Post 2: Fit for 55 + portfolio-ohjaus
   - Post 3: PORR 2025 / Green & Lean
   - Pinnaa Featured-osioon

3. **Julkaise Scope Journal -artikkeli**
   - "Why we're building a mobile control room for construction portfolios"
   - Linkitä kommenteissa ja profiilissa

### Viikko 3+: Connection-strategia

1. Lähetä 20 connection-pyyntöä päivässä (ilman notea)
2. Odota hyväksyntää
3. Kun hyväksyvät, lähetä lyhyt DM
4. Seuraa vastauksia

## Seuranta

- Profiilikatselut
- Connection-hyvyksymisprosentti (tavoite: 50-70%)
- DM-vastausprosentti
- Tapaamiset

## Tiedostot

- `Admin/Li/workflows/optimize_linkedin_profile.py` - Sisällön generointi
- `Admin/Li/workflows/send_connection_request.py` - Connection-pyyntöjen hallinta
- `Admin/Li/content_strategy/` - Generoidut sisällöt


