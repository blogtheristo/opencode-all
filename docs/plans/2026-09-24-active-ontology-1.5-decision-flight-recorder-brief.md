# HIC Brief: Active Ontology 1.5 – Decision Flight Recorder

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: SOURCE RECORD (HIC brief, verbatim)
- Classification: INTERNAL
- Document type: HIC Brief
- Author: risto.paarni2024@lifetime.fi (recorded by Claude Code)
- Date: 2026-09-24
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/blissful-davinci-8782wy

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Date: 24.09.2026 | Changes: HIC brief recorded verbatim ("Kopioi tämä Claudeen sellaisenaan"). Implemented in `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` v1.5 and `supabase/migrations/089_240926_decision_journey.sql`.

Related Documents:

- `docs/plans/2026-09-24-decision-journey-outcome-evidence.md` — the specification that implements this brief (§9 maps each item)

---

The text below is the HIC's brief, unchanged.

```text
Active Ontology 1.5 – Decision Flight Recorder

Tämä EI ole enää copy-muutos.

Tämä on Active Ontologyn ydintietomallin päivitys.

Tausta

Keskustelun johtopäätös:

Active Ontology ei opi tuotteista.

Active Ontology ei opi suosituksista.

Active Ontology oppii vain todennetuista päätöspoluista.

Ja:

Suositus ei ole tieto.

Päätös on tieto.

Lopputulos on evidenssi.

Oppiminen on evidenssin tulkinta.

Ontologian päivitys on hyväksytty oppiminen.

1. Muuta malli "Decision Flight Recorder" -malliksi

Älä ajattele tätä CRM:nä.

Älä ajattele tätä lead-pipelineksi.

Ajattele tätä lentotallentimena.

Tallennetaan tapahtumat.

Ei tiloja.

Ei yhteenvetoja.

Ei jälkikäteen muisteltuja NOTE-kenttiä.

2. Uusi ydintaulu
decision_journey_event

Jokainen rivi on append-only.

UPDATE ei ole sallittu.

Korjaus tehdään aina uutena eventtinä.

Esimerkiksi:

OBSERVATION_RECORDED
↓
OBSERVATION_CORRECTED

Ei:

UPDATE observation ...

3. Event-skeema

Pakolliset kentät:

event_id
journey_id
event_type
occurred_at
recorded_at
emitted_by
decision_by
affected_party
ontology_version
world_model_version
evidence_quality
evidence_strength
payload
previous_event_id
hash

4. Kolme toimijaa

Ei pelkkä actor_id.

Tarvitaan:

emitted_by
decision_by
affected_party

Esimerkki:

PATH_RECOMMENDED
emitted_by:
  industry_captain_ai
decision_by:
  null
affected_party:
  customer

ja myöhemmin:

PATH_REJECTED
emitted_by:
  portal
decision_by:
  customer
affected_party:
  customer

HUOM:

decision_by: null

ei tarkoita puuttuvaa tietoa.

Se voi tarkoittaa:

Päätöstä ei koskaan tehty.

5. PATH_ABANDONED

Lisää uusi event-tyyppi:

PATH_ABANDONED

Tämä EI ole käyttäjän syöttämä.

Järjestelmä luo sen automaattisesti.

Esimerkki:

PATH_RECOMMENDED
↓
30 päivää
↓
ei ACCEPT
↓
ei REJECT
↓
PATH_ABANDONED

Event:

emitted_by:
  system
decision_by:
  null

Tämä on Active Ontologyn "dark matter".

Todennäköisesti yleisin event.

6. Evidence ≠ Learning

Tärkeä sääntö.

Evidence-eventit:

OBSERVATION_RECORDED
PATH_RECOMMENDED
PATH_ACCEPTED
PATH_REJECTED
PATH_ABANDONED
SKU_PURCHASED
WORKSHOP_COMPLETED
OWNER_ACKNOWLEDGED

Näissä EI tehdä tulkintoja.

Oppiminen tapahtuu erillisessä eventissä:

LEARNING_DELTA_CREATED

Payload:

hypothesis:
confidence:
evidence_refs:

Esimerkki:

hypothesis:
  wrong_stakeholder
confidence:
  0.41

Tämä on hypoteesi.

Ei fakta.

7. Learning Confidence -sääntö

Pakollinen sääntö:

learning_confidence
≤
minimum(evidence_strength)

Ei weighted average.

Ei poikkeuksia.

Esimerkki:

0.95
0.81
0.43
↓
learning_confidence
≤ 0.43

Perustelu:

Heikoin evidenssi rajaa väitteen voimakkuuden.

Auditoitava.

Yksinkertainen.

Rehellinen.

8. Evidence Quality

Pidä molemmat:

evidence_quality
evidence_strength

Esimerkki:

SYSTEM_CONFIRMED
WORKSHOP_OUTPUT
HUMAN_CONFIRMED
MANUAL_ENTRY
EXTERNAL_SOURCE

sekä

evidence_strength:
  0.00 - 1.00

HUOM:

ÄLÄ johda scorea vain:

occurred_at
vs
recorded_at

perusteella.

Huomioi myös lähde.

Esimerkki:

System-confirmed order
0.99

Manual entry
0.40

vaikka kirjattaisiin välittömästi.

9. Hash chain

Hash suojaa payloadin.

Ei pelkkää riviä.

Käytä:

hash(
 previous_hash +
 payload +
 occurred_at +
 ontology_version
)

HUOM:

occurred_at

ei

recorded_at

koska tapahtumahetki on suojattava väite.

10. Ownership Transfer

Nykyinen:

transferred_to_owner

ei riitä.

Lisää jatkoeventit:

PATH_TRANSFERRED
OWNER_ACKNOWLEDGED
OWNER_DECISION_STARTED

Näin voidaan mitata:

Transfer Activation Rate

Mutta älä tee siitä suorituskykymittaria.

Se mittaa asiakkaan käyttäytymistä.

Ei järjestelmän laatua.

11. Verified Decision Journey

Uusi strateginen KPI:

Nykyinen tavoite EI ole:

10 journeys

Ensimmäinen tavoite on:

1 verified decision journey

Määritelmä:

Observation
↓
Ownership Finding
↓
Decision
↓
Action
↓
Outcome
↓
Learning Delta
↓
Ontology Update

ulkopuolisessa organisaatiossa.

12. Dashboard

Näytä aina pari:

Observation Count

ja

Decision Traceability Coverage

Ei koskaan pelkkää Coverage-mittaria.

Muuten syntyy kannustin olla kirjaamatta vaikeita havaintoja.

13. Strateginen määritelmä

Lisää Active Ontologyn periaatteeksi:

Active Ontology ei tallenna asiakkuuksia.

Active Ontology tallentaa päätöksenteon historiaa.

Jokainen tapahtuma on append-only.

Jokainen oppiminen perustuu evidenssiin.

Jokainen ontologian päivitys voidaan jäljittää siihen päätöspolkuun, josta oppiminen syntyi.

14. Ei vielä toteutukseen

Älä rakenna kaikkia eventtejä heti.

Ensin:

decision_journey_event
PATH_ABANDONED
evidence_quality
evidence_strength
decision_by
append-only

Kun nämä ovat olemassa, voidaan alkaa kerätä ensimmäistä oikeaa Verified Decision Journeyta. Se on tärkeämpi kuin seuraavat 20 ominaisuutta.
```
