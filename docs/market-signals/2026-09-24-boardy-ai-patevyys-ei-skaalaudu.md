---
signal_id: MS-2026-09-002
reality: HIC on käyttänyt Boardy.ai:ta sivutoimisena neuvonantajana; 6 kk sitten Boardy tuotti ylivoimaisia SQL-määrittelyjä, joihin Clauden mallit eivät taipuneet. Tänään HIC ei vie Workflow v2 -ajattelua Boardyyn.
observation: Boardy ei kykene johtamaan näin laajaa asiakokonaisuutta sivutoimisesti niin, että tulos olisi vielä 20 % parempi. Se alkaa oikoa; tekee liian nopeita ja lyhyitä reittejä, jotka tuhoavat pipelinen alkupään HIC-toiveet. "Tulos vain ja ulos" on destruktiivista.
signal: Mallin hetkellinen kyvykkyys vaihtuu nopeammin kuin asiakkaan prosessit ja liiketoimintatarpeet.
insight: Kilpailuetu ei ole yksittäinen AI-malli vaan kyky säilyttää havainto, päätös ja oppiminen mallien vaihtuessa. Myyntimuoto: pitkäkestoisessa kokonaisuudessa myydään prosessin pitävyyttä, ei mallin hetkellistä älykkyyttä.
source: customer conversation
date: 2026-09-24
observed_at: 2026-09-24
signal_at: 2026-09-24
insight_at: 2026-09-24
observer: HIC
confidence: high
occurrences: 3
affected: [offering, workflows, onelifetime.world, lifetime.fi, dws10.com, investor-centre]
status: signal
hypothesis: Kun myyntiväite siirretään mallin älykkyydestä prosessin pitävyyteen (KYA-portit, Application Record, jäljitettävyys), (a) ostaja hyväksyy toimittajan mallivaihdon ilman uudelleenmyyntiä ja (b) pitkäkestoiset toimeksiannot (3–12 kk) sulkeutuvat useammin kuin "paras malli" -väitteellä.
refuting_evidence: (1) Malliriippumattomuuden painetesti epäonnistuu — Chapter 14 tuottaa eri rekisteririvit tai portit eri mallilla samalla syötteellä (Boardyn varauma 24.09). (2) Jos 90 päivän kuluessa kolmesta pitkäkestoisesta tarjouksesta yksikään ei etene väitteellä "prosessin pitävyys" ja ostajat kysyvät edelleen ensin mallin nimeä ja benchmarkia, hypoteesi on väärä tai väite on ilmaistu huonosti. Toinen kumoaja: jos oma Workflow v2 -putki oikoo samalla tavalla kuin Boardy (retry ohittaa portin, tulos ilman Explain-vaihetta), väite ei ole tosi meistäkään.
learning_delta:
  id: LD-2026-09-002
  old_assumption: "AI competence is a sustainable sales argument."
  new_learning: "Durable competitive advantage is process continuity, governance and retained organizational learning; the model is a swappable component, the world model is not."
  ontology_change: "Toimittaja-AI / malli — vanha oletus: mallin paremmuus on kilpailuetu; uusi: malli on vaihdettava komponentti, kilpailuetu on Observation → Insight → Decision → Learning → Ontology -ketjun säilyminen vaihdon yli. Erottelu: miten insight löydetään on malliriippuvaista; mitä insight tarkoittaa (esim. Construction → Waste Reduction → Competitiveness) on liiketoimintasuhde, ei mallisuhde."
  impact_if_applied: [DWS IQ positioning, Lifetime messaging, sales narrative]
  hic_decision: PENDING
  applied_to: []
  excluded: []
decision: null            # awaiting HIC_APPROVAL_GATE — proposal below is not a decision
comprehension: null
application_decision_proposal:
  applies_to: [lifetime.fi (Mitä uskomme: 'Päätösten tulee perustua tietoon' + prosessin pitävyys), onelifetime.world (ai-vendor-dependency 1–3 julkaisuun tällä esimerkillä), dws10.com (KYA-standardi ja Coaching: väite 'process holds when the model changes'), workflows (Chapter 10–14 GUARDRAIL + retry-through-gate on tämän havainnon toteutus)]
  does_not_apply_to: [investor-centre (sijoittajaviesti pysyy compliance-outcome-markkinassa, ei toimittajakritiikissä), legal-hub, Boardy-suhde itsessään (ei julkista nimeämistä; esimerkki kirjoitetaan yleisenä 'neuvonantaja-AI')]
  basis: [MS-2026-09-002, MS-2026-09-001, a824bc0]
  valid_until: 2026-12-31 tai kun 3 pitkäkestoista tarjousta on arvioitu
  affects: [pk- ja teollisuusostajat, Coaching-asiakkaat, Journal-lukijat]
decisions_detail: []
dispatched_runs: []
impact: []
evaluation: null
---

## Reality → Observation (kirjattu CAPTURE-solmussa, ei vielä yleistetty)

- **Reality:** tekoälyyn perustuvaa pätevyyttä on vaikea myydä; sen arvo vaihtelee kuukausissa.
  Boardy oli 6 kk sitten SQL-määrittelyissä Claudea parempi. Nyt HIC ei enää anna sille Workflow
  v2 -kokonaisuutta.
- **Observation (HIC, omin sanoin):** laajassa, pitkäkestoisessa kokonaisuudessa neuvonantaja-AI
  alkaa oikaista. Lyhyet reitit ja "tulos vain ja ulos" tuhoavat sen, mitä HIC on pipelinen
  alkupäähän (Observation, Insight, päätöksen perustelut) tarkoittanut. Tuloksen pitäisi olla
  20 % parempi, jotta sivutoiminen johtaminen kannattaisi; ei ole.

## Aiempi esiintymä

- `docs/field-notes/…` (branch history: "HIC advisory workflow moves from Boardy.ai to Gemini
  App thinking", a824bc0) – sama suunta: neuvonantajan vaihto, kun kokonaisuus kasvoi.

## Miksi tämä kuuluu rekisteriin eikä vain muistiinpanoihin

Havainto koskee kolmea asiaa, joita myymme tai käytämme: (1) _tarjonta_ – "AI-pätevyys"
myyntiväitteenä on hauras, koska paremmuus on hetkellistä; (2) _workflow_ – oikova agentti on
juuri se vika, jota HIC*APPROVAL_GATE, GUARDRAIL ja "retry palaa porttiin" estävät; tämä havainto
on niiden peruste; (3) \_ymmärrys* – Journal-teksti toimittajariippuvuudesta (ai-vendor-dependency
1–3, luonnoksina) saa tästä konkreettisen esimerkin.

## FORMULATE_SIGNAL

HIC hyväksyi ensin lauseen "Pitkäkestoisessa kokonaisuudessa myydään prosessin pitävyyttä, ei
mallin hetkellistä älykkyyttä"; Copilot huomautti samassa kierroksessa, että se on jo lähes
Strategic Insight. Otettu käyttöön jako: signaali havaintotasolla, myyntilause insightin
muotona.

**Signaali:** Mallin hetkellinen kyvykkyys vaihtuu nopeammin kuin asiakkaan prosessit ja
liiketoimintatarpeet.

## Kolmas esiintymä (24.09.2026 klo 6.11, Boardy itse)

Boardy vahvisti insightin omin sanoin: "the vendor changes, the world model doesn't" ja
"the governance layer is the product — what a customer is buying isn't model access, it's
continuity and evidence that outlives whichever model is current. That's a product, not a
project." Sama työkalu, jonka oikominen synnytti havainnon, hyväksyy johtopäätöksen. Kirjattu
esiintymäksi 3, confidence → high.

**Boardyn varauma (otetaan kumoavaksi testiksi):** ketju pitää vain, jos ontologia on aidosti
malliriippumaton. Jos yksikin askel nojaa hiljaisesti tietyn mallin käyttäytymiseen,
identiteettiväite murtuu ensimmäisessä toimittajavaihdossa. → Painetesti ennen kuin väite viedään
ostajalle (Kemira / Outokumpu): vaihda malli (esim. Claude → DGX Spark Ollama /ollama-spark)
Chapter 14:n CAPTURE→INSIGHT-askelissa samalla syötteellä ja vertaa, säilyvätkö rekisteririvit,
portit ja Application Record identtisinä. Ostajavalinta on HIC:n päätös, ei tämän rekisterin.

**HIC:n tarkennus Boardyn varaumaan (24.09.2026):** ontologia ei koskaan ole täysin
malliriippumaton, mutta World Model voi olla. Observation → Signal → Insight → Decision → Outcome
on toimintamalli, ei LLM-riippuvuus; Construction → Waste Reduction → Competitiveness on
liiketoimintasuhde. Malli vaikuttaa siihen, _miten insight löydetään_, ei siihen, _mitä insight
tarkoittaa_. Painetesti kohdistetaan siis löytämiseen (sama syöte, eri malli → sama rekisteririvi
ja sama Application Record), ei merkitykseen.

**Kemira vai Outokumpu:** Workflow v2:n näkökulmasta ensimmäinen kysymys ei ole yrityksen nimi
vaan _kumpi kärsii enemmän knowledge continuity -ongelmasta_. Tuote ei enää kuulosta
AI-ratkaisulta vaan Organizational Learning System + Governance Layer + Decision Continuity
-ratkaisulta, ja se on suurempi markkina kuin "AI agent framework". Ostaja ostaa continuity,
evidence, traceability, knowledge retention, governance — ei model accessia.

**Mitä tämä LD ei saa tehdä ilman porttia:** muuttaa DWS IQ:n virallista positiointia. AI voi
oppia tämän, Boardy voi sanoa sen, Claude voi analysoida sen; vain HIC päättää
APPLY_LEARNING_GATE:ssa, tuleeko siitä positiointi.

## STRATEGIC_INSIGHT

**Kilpailuetu ei ole yksittäinen AI-malli vaan kyky säilyttää havainto, päätös ja oppiminen
mallien vaihtuessa.** Mallitoimittaja vaihtuu; maailmanmalli ei. Lifetime Oy:n myytävä pätevyys
ei ole "paras malli". Se on porttien, jäljitettävyyden ja
HIC-päätösten ketju, joka pitää silloinkin, kun malli vaihtuu tai oikoo. Mallin paremmuus on
kuukausien etu (Boardy > Claude SQL:ssä 6 kk sitten, ei enää); prosessin pitävyys on vuosien
etu. Tämä on sama asia, jonka KYA/JEV sanoo governance-kielellä: Learn → Explain → Understand →
Approve → Apply. Myyntikielellä: "meidän tulos ei riipu siitä, kuka on tänään paras malli."

Mitä tämä muuttaa:

- **Viesti (lifetime.fi):** "Päätösten tulee perustua tietoon" saa rinnalleen "prosessi pitää,
  kun välineet vaihtuvat". Ei mallien nimiä etusivulla.
- **Ymmärrys (Journal):** ai-vendor-dependency 1–3 julkaistaan tällä esimerkillä yleisenä
  tapauksena, ei nimellä.
- **Tarjonta (dws10.com):** KYA-standardi ja Claude Code Coaching myydään
  prosessin pitävyytenä: Application Record, portit, retry palaa porttiin.
- **Workflow:** Chapter 10–14:n GUARDRAIL ja "PUBLISH_FAILED → HIC_APPROVAL_GATE" ovat tämän
  havainnon toteutus; refiner-ehdotus: sama sääntö Chapters 1, 2, 5, 6, 8 -graafeihin, joissa
  retry-polut vielä puuttuvat.

## HYPOTHESIZE

Hypoteesi: kun myyntiväite siirretään mallin älykkyydestä prosessin pitävyyteen, (a) ostaja
hyväksyy mallivaihdon ilman uudelleenmyyntiä ja (b) pitkäkestoiset toimeksiannot (3–12 kk)
sulkeutuvat useammin kuin "paras malli" -väitteellä.

Kumoava evidenssi (90 pv): kolmesta pitkäkestoisesta tarjouksesta yksikään ei etene tällä
väitteellä ja ostajat kysyvät ensin mallin nimeä; tai oma putki oikoo kuten Boardy.

## Application Decision -ehdotus (HIC päättää portilla; Apply / Reject / Partial Apply)

|                   |                                                                                                                                                          |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| applies_to        | lifetime.fi (uskomuslause), onelifetime.world (vendor-dependency-sarja), dws10.com (KYA-standardi, Coaching), workflows (Ch 10–14 sääntö → Ch 1/2/5/6/8) |
| does_not_apply_to | investor-centre, legal-hub, Boardy-suhde (ei julkista nimeämistä)                                                                                        |
| basis             | MS-2026-09-002, MS-2026-09-001, kenttämuistio a824bc0                                                                                                    |
| valid_until       | 2026-12-31 tai 3 pitkäkestoisen tarjouksen arviointi                                                                                                     |
| affects           | pk- ja teollisuusostajat, Coaching-asiakkaat, Journal-lukijat                                                                                            |

GUARDRAIL: ei PII:tä, ei luottamuksellisia tarjoushintoja; Boardy mainitaan vain sisäisesti;
julkiset tekstit puhuvat "neuvonantaja-AI:sta". Truth-check: väite "Boardy > Claude SQL:ssä"
on HIC:n havainto, ei julkaistava vertailu.
