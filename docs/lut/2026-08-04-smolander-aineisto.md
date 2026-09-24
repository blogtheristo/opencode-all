# Aineisto — tapaaminen prof. Kari Smolander 4.8.2026 (jaettava versio)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/dissertation-research-question-jkpdhq | Date: 04.08.2026 | Changes: Luotu HIC:n pyynnöstä jaettavaksi aineistoksi Smolanderille ("laitan hänelle export tiedoston heti kun se on valmis aineistoksi tähän päivään"). **Ulkoinen dokumentti** — sisältää vain jaettavan sisällön: HIC:n korjattu taustoitus, RQ5 kahtena vaihtoehtona, tutkimuskohde/IP-rajaus, seuraava askel, ja Liite 1 = KYA Specification v1.5:n suullinen tiivistelmä (HIC ei avaa .md-tiedostoja kokouksessa). Sisäiset neuvottelunuotit ovat erillisessä agendassa (`2026-08-04-smolander-kokous-agenda.md`), **jota ei jaeta**. Lähetys Karille on ihmisen teko.

Document Status:

- Created: 04.08.2026
- Last Modified: 04.08.2026
- Language: Finnish
- Publication Status: EXTERNAL-READY — HIC lähettää itse; agentti ei lähetä

Related Documents:

- `standards/kya-open/SPEC.md` v0.3 — Liitteen 1 lähde
- `docs/lut/2026-08-04-smolander-kokous-agenda.md` — SISÄINEN agenda, ei jaeta
- `docs/phd/RQ_SHARPENING_SIDE_BY_SIDE.md` v1.1 — RQ5-muotoilujen lähde

---

# Tutkimussuunnan tarkennus — aineisto keskusteluun 4.8.2026

Risto Anton Päärni · Lifetime Oy

## 1. Taustoitus — tähän on tultu

Työ on edennyt käytännön rakentamisesta kohti rajattua tutkimuskysymystä. DWS IQ:n kehityksessä tuli toistuvasti vastaan sama ongelma: agentin pitää pystyä osoittamaan identiteettinsä, toimivaltansa, päätöksensä lähteet ja se, milloin ihminen voi pysäyttää toiminnan. Tästä muodostui KYA (Know Your Agent), ensin kaupallisen järjestelmän governance- ja evidenssikerroksena. Sen ytimessä on **portitus**: agentin valtuudet on sidottu sen ansaittuun luottamuspisteeseen (ATS). Mitä agentti saa käsitellä (kyvykkyysvaltuudet) ja kuinka paljon se saa sitoa rahaa tai tehdä sitovia toimia (kulutusvaltuudet) määräytyvät pistevyöhykkeen mukaan — pisteen laskiessa valtuudet kapenevat automaattisesti, ja alarajan alittuessa toiminta pysähtyy ihmisen tarkastukseen. Valtuus ei siis ole binäärinen tila, vaan jatkuvasti ansaittava ja menetettävä asema. Kun kävi ilmi, että sama ongelma koskee laajemmin agenttijärjestelmiä, KYA:sta alettiin erottaa avoin spesifikaatiokerros: KYA Specification (Apache 2.0), credential-muodot, ATS-trust-scoring-kaava ja neljä porttia, jotka ansaitsisivat sanan "standardi": (1) kaksi riippumatonta toteutusta, (2) konformanssitestistö, jossa toteutus voi myös epäonnistua, (3) elimen hyväksyntä tai aito monen osapuolen omaksuminen, ja (4) muutoshallinta, joka ei riipu Lifetime Oy:stä. Tänään: 0/4. Nämä portit ovat RQ5 v3:n tutkittava kriteeri. Suljettu telemetria, DWS skilled agents (sekä myöhemmin fyysisten agenttien muodostama Lifetime Fleet), Lifetime World Model sekä DWS IQ:n Situation Room & Control Room -terminologia ja -toteutus jäävät DWS:n kaupalliseksi IP:ksi.

Työskentelytapa on ollut iteratiivinen ja evidenssipohjainen. En ole lähtenyt siitä, että alkuperäinen idea on automaattisesti oikea, vaan väitteitä on testattu korpusta, referenssitoteutusta ja riippumattomuusvaatimuksia vasten. Samalla on eroteltu tarkasti kolme asiaa: mikä on rakennettu tuotteeksi, mikä voidaan julkaista avoimena spesifikaationa ja mikä olisi oikeasti standardi. Tämä erottelu pakotti myös tutkimuskysymyksen RQ5 uudelleenmuotoiluun.

YAMK-lopputyö (_Omnichannel First -toimintamallin käyttöönotto Lifetime World palveluissa_, Metropolia, arvioitu 5.6.2026 arvosanalla erinomainen 5/5) syntyi tästä samasta käytännön työstä. Se ratkaisi soveltavan kehittämisen kysymyksen — mutta osoitti samalla rajan: KYA:n avoimuus, konformanssi ja muuttuvan agentin hallinta vaativat varsinaista tutkimusta. Tohtoriopinnot ovat minulle henkilökohtainen tavoite, ja tutkimus on tarkoituksella irrotettu yhtiön kaupallisesta menestyksestä: väitöskirja ei voi riippua siitä, saavuttaako KYA virallisen standardiaseman tai miten kaupallistaminen etenee. DWS IQ — DWS skilled agents (sekä myöhemmin fyysisten agenttien muodostama Lifetime Fleet), joka kohdistuu 25 EU-säänneltyyn toimialaan — ja käynnissä olevat yhteydet (mm. KTH/TECoSA) toimivat tutkimuksen validointiympäristönä ja aineistolähteenä — eivät tutkimuskysymyksenä.

## 2. RQ5 — kaksi avointa vaihtoehtoa

**A — alkuperäinen (lähetetty 14.7.2026):**

> _How can a Know-Your-Agent (KYA) trust-scoring model be designed and validated as an open conformance standard for agentic AI in EU-regulated industries?_

Havaitsin ongelman omalla falsifiointitestilläni: suunnittelupuoleen aineisto (spesifikaatio, referenssitoteutus, kriteerit) vastaa jo, ja validointipuolen kielteinen vastaus — "KYA:ta ei omaksuttu standardiksi" — olisi viivästys, ei tutkimuslöydös.

**B — RQ5 v3 (ehdotus):**

> _Pitääkö klassinen spesifikaatio/standardi-erottelu agenttihallinnassa, jossa sertifioitava kohde muuttuu sertifioinnin jälkeen — ja onko nelivaiheinen portti (riippumattomat toteutukset, konformanssitestistö, jossa toteutus voi epäonnistua, institutionaalinen hyväksyntä tai aito omaksuminen, tekijästä riippumaton muutoshallinta) välttämätön ja riittävä kriteeri sille erolle?_
>
> _Does the classical specification/standard distinction hold for agent governance, where the certified subject changes after certification — and is the four-gate criterion necessary and sufficient for that difference?_

Ydinargumentti: perinteinen tuotestandardi — esimerkiksi konepultin — sertifioi artefaktin, joka ei muutu sertifioinnin jälkeen. Agenttihallinnan standardi sertifioi käyttäytymistä, joka muuttuu jatkuvasti — malli päivittyy, agenttipopulaatio oppii, mandaatit vaihtuvat, ja arvioijasta itsestään tulee liikkuva kohde. Klassinen erottelu olettaa staattisen kohteen. Kysymys on falsifioitava molempiin suuntiin: sekä "erottelu pitää" että "erottelu ei pidä liikkuvalle kohteelle" ovat julkaisukelpoisia tuloksia, eikä kumpikaan riipu KYA:n kaupallisesta menestyksestä.

**Kysymykseni sinulle:** onko tämä uudelleenmuotoilu mielestäsi tutkimuksellisesti vahvempi vai heikompi kuin alkuperäinen? Jos alkuperäinen on mielestäsi parempi, pidän sen. Jos emme ehdi käsitellä tätä tapaamisessa, arvion voi antaa myös kirjallisesti tämän aineiston pohjalta.

## 3. Rajaus — tutkimuskohde vs. kaupallinen IP

| Väitöstutkimuksen kohde                                                                                                                                            | Lifetime Oy:n kaupallinen IP (ei väitöskirjassa)                                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Avoin KYA-spesifikaatio (Apache 2.0): ATS-kaava, credential-muodot, gate-semantiikka, neliporttikriteeri — ja ilmiö, jonka sen valmistelu standardointiprosessia varten paljasti | Telemetriaputki · Lifetime World Model · DWS skilled agents (sekä myöhemmin fyysisten agenttien muodostama Lifetime Fleet) · Situation Room & Control Room (terminologia ja toteutus) |

## 4. Ehdotettu seuraava askel

Pyydän sinulta tänään kahta asiaa:

1. **Arvio suunnasta.** Onko RQ5:n ympärille rajattu tutkimus (kohta 2) mielestäsi LUT:n tohtoriohjelmaan sopiva — ja kumpi muotoilu on parempi, A vai B?

2. **Sovittu seuraava askel.** Ehdotukseni:
   - **Kahden viikon kuluessa** kirjoitan yhden sivun tarkennetun tutkimussuunnitelman sen RQ5-muotoilun ympärille, jonka tässä keskustelussa valitsemme, ja lähetän sen sinulle kommentoitavaksi.
   - **Sen jälkeen** käynnistän LUT:n tohtoriohjelman muodollisen hakuprosessin.
   - **Sinulta tarvitsen:** kommentit yhden sivun suunnitelmaan, ja tiedon siitä, mitä hakuprosessi käytännössä edellyttää (ohjaajajärjestely ja -lausunto, hakuajat, mahdolliset esitietovaatimukset).

---

# Liite 1 — KYA Specification v1.5: tiivistelmä keskustelua varten

_(Lähde: `standards/kya-open/SPEC.md`, versio 0.3, 25.7.2026. Tämä liite on suullisen esittelyn tuki — kaikki olennainen yhdessä paikassa.)_

## Mikä se on

Hallintaspesifikaatio autonomisille ohjelmistoagenteille, jotka toimivat delegoidulla ihmisen valtuudella. Se vastaa neljään kysymykseen mistä tahansa agentin toimesta — muodossa, jonka **kolmas osapuoli voi tarkistaa luottamatta operaattoriin**:

1. **Kuka tämä agentti on?** — identiteetti + kyvykkyysmanifesti
2. **Kuka ihminen on sen takana?** — vastuusidonta
3. **Mitä se saa tehdä?** — kyvykkyys- ja kulutusvaltuuksien portitus
4. **Mitä se todella teki?** — todisteketju + verified-done-attestaatio

Spesifikaatio kuvaa **protokollan** (credential-muodot, pisteytyskaavan semantiikka, porttipäätökset, todisteketjun tapahtumatyypit, verifiointimenettely) niin, että sen voi toteuttaa taho, jolla ei ole pääsyä Lifetime Oy:n infrastruktuuriin.

## Nykytila

- **Luonnos v0.3, ei vielä julkaistu.** Lisenssi Apache 2.0 (valittu nimenomaan patenttilausekkeen §3 takia).
- **Spesifikaatio, ei standardi** — dokumentti sanoo tämän itse (§0.6). Ei de jure (mikään elin ei ole käsitellyt) eikä de facto (nolla toteutusta Lifetime Oy:n ulkopuolella).
- **Neljä porttia**, jotka ansaitsisivat sanan "standardi": (1) kaksi riippumatonta toteutusta, (2) konformanssitestistö, jossa toteutus voi myös epäonnistua, (3) elimen hyväksyntä _tai_ aito monen osapuolen omaksuminen, (4) muutoshallinta joka ei riipu Lifetime Oy:stä. **Tänään: 0/4.** Nämä portit ovat RQ5 v3:n tutkittava kriteeri.

## Tekninen sisältö pähkinänkuoressa

- **Luottamusketju.** Jokainen KYA-vaatimus todentuu yhtä ketjua pitkin, ja ketjun jokaisen lenkin on oltava sellaisen osapuolen tarkistettavissa, joka ei luota myöntäjään. Ketju kulkee neljässä askeleessa: (1) **todennettu ihminen** — valtuuden lähde on tunnistettu, vastuullinen henkilö; (2) **allekirjoitettu kyvykkyysmanifesti** — asiakirja, joka määrittää, mitä agentti saa käsitellä ja kuinka kauan valtuus on voimassa; (3) **allekirjoitettu mandaatti** — yksittäistä toimeksiantoa koskeva valtuutus, joka on sidottu agentin senhetkiseen luottamuspisteeseen; (4) **valmiiksi todennettu -attestaatio** (_verified-done_) — todiste siitä, että toimeksianto toteutui hallinnan alaisena ja kirjautui todisteketjuun. Verifioija ei saa hyväksyä lenkkiä, jonka edeltävä lenkki puuttuu tai on todentamaton: valtuutus ei voi syntyä tyhjästä, vaan jokainen askel palautuu tunnistettuun ihmiseen.
  _EN: Every KYA-conformant claim resolves along one chain — verified human → signed capability manifest → signed mandate → verified-done attestation. Each link must be checkable by a party that does not trust the issuer, and a verifier must not accept a link whose predecessor is absent or unverifiable._
- **ATS-pisteytys (julkaistu kaava):** `ATS = max(0, 1.0 − V×0.25 − L − D×0.05 + A×0.15)` — V = rikkeet, L = latenssisakko, D = evätyt pääsy-yritykset, A = validoitu parannuskerroin (katto 0.15). Pistevyöhykkeet: ≥ 0.80 täysi hiekkalaatikko · 0.50–0.79 rajoitettu · < 0.50 keskeytys, ihminen tarkastaa. Julkaistu kaava on tarkistettavissa — salainen kaava ei olisi; arvo tulee telemetriasta, joka tuottaa kaavan syötteet (ja joka pysyy suljettuna).
- **Mandaattiportitus:** maksuvaltuudet sidotaan ATS-vyöhykkeeseen. Kaksi liikkumatonta lattiaa: ei mandaatteja alle 0.50:n, eikä "ihminen ei paikalla" -rajaa (≥ 0.90) saa laskea — käyttöönottoprofiili saa vain kiristää. Anonyymi kulutusvaltuus on ei-konformantti.
- **Todisteketju:** jokainen mandaattitapahtuma hash-ketjutettuun, muutosjäljitettävään lokiin. Tietueita ei poisteta — peruutus on tilasiirtymä. Vastuuihminen pseudonyyminä (todisteketju ei saa olla henkilörekisteri). Kartoittuu EU AI Act artiklaan 12.
- **Ihmisvalvonta:** jokainen agenttiketju päättyy tunnistettavaan vastuulliseen ihmiseen (HIC, Human-In-Command); interventiopiste, jossa ihminen voi tarkastaa, ohittaa ja lopettaa agentin valtuuden — kartoittuu artiklaan 14. Ihmisen identiteetin peruutus kaskadoituu hänen valtuuttamiinsa mandaatteihin.
- **Allekirjoitus:** Ed25519; allekirjoituksen on katettava myös proof-optiot (aikaleima, verifiointimenetelmä) — todiste, jonka aikaleimaa voi muuttaa, ei ole todiste.
- **Jurisdiktioprofiilit (§10):** yksi neutraali ydin + EU/US/SG-profiilit (nimetty, ei vielä kirjoitettu). Profiili saa kiristää ytimen vaatimusta, ei koskaan löysätä.

## Kolme todentamispistettä

1. **Spesifikaatio asettaa vaatimuksia, joita oma referenssitoteutuksemme ei vielä täytä** (mm. allekirjoituksen kattavuus, revokaation löydettävyys). Tämä on tarkoituksellista ja kirjattu: spesifikaatio kuvaa mitä konformanssi tarkoittaa, ei mitä yksi toimittaja tänään toimittaa.
2. **Konformanssitestistöä ei ole** — siihen asti "KYA-compliant" on verifioimaton itsearvio, ja dokumentti sanoo senkin itse.
3. **Harmonisoitua asemaa ei voi käynnistää itse:** EU:ssa harmonisoidut standardit syntyvät CEN/CENELECissä komission standardointipyynnöstä (AI Act art. 40), ja vain EU antaa vaatimustenmukaisuusolettaman — Yhdysvaltain NIST AI RMF on vapaaehtoinen viitekehys ilman olettamaa. Tämä epäsymmetria on osa tutkittavaa ilmiötä, ei alaviite.

## Miksi tämä on tutkimuksellisesti kiinnostava artefakti

Kehittyneet kielimallityökalut ovat muuttaneet spesifikaation kirjoittamisen talouden: teknisesti täydellinen, julkaisukelpoinen spesifikaatio — konformanssikielineen, versiohistorioineen ja viittauksineen — syntyy nyt tunneissa tai päivissä. Sen sijaan mikään legitimoivista prosesseista ei ole nopeutunut: riippumaton toteutus, kilpailevien intressien suorittama katselmointi, standardointielimen käsittely ja tekijästä riippumaton muutoshallinta etenevät samaa vauhtia kuin ennenkin — kuukausissa ja vuosissa.

Tästä syntyy eriytymä: **artefaktin tuotantonopeus on irronnut sen institutionaalisen legitimoinnin nopeudesta.** Dokumentin laatu ei enää kerro prosessista, jonka läpi se on kulkenut. Aiemmin huoliteltu spesifikaatio oli epäsuora todiste katselmoinnista ja yhteisön työstä; nyt se voi olla yhden organisaation yhden työjakson tuotos. Lukija, joka käyttää sujuvuutta legitimiteetin merkkinä, tulee johdetuksi harhaan — ilman että kukaan sitä tarkoittaa.

KYA:n valmistelu standardointiprosessia varten paljasti ilmiön käytännössä: versionumero kasvaa, mutta legitimiteetti ei liiku, koska puuttuva asia ei ole tekninen. RQ5 v3 tutkii juuri tätä: päteekö klassinen spesifikaation ja standardin välinen erottelu, kun sertifioitava kohde — agentin käyttäytyminen, sen taustalla oleva malli ja lopulta arvioija itse — muuttuu jatkuvasti sertifioinnin jälkeen, ja ovatko neljä porttia välttämätön ja riittävä kriteeri sille erolle.

_EN: Frontier language-model tooling has changed the economics of writing a specification: a technically complete, publication-quality specification — conformance language, version history, references — can now be produced in hours or days. None of the legitimating processes has accelerated: independent implementation, review by parties with competing interests, standards-body processing, and author-independent change control still move at the pace of months and years. The result is a decoupling — the speed of artifact production has separated from the speed of institutional legitimation, and document quality no longer signals the process behind it. Preparing KYA for the standardisation process exposed this in practice: the version number advances while legitimacy does not move, because what is missing is not technical. RQ5 v3 investigates precisely this: does the classical specification/standard distinction hold when the certified subject — the agent's behaviour, the underlying model, and ultimately the assessor itself — keeps changing after certification, and is the four-gate criterion necessary and sufficient for that difference?_

---

# Liite 2 — Nykyiset tutkimuskysymykset (lähetetty 14.7.2026)

_(Kysymysten sisäinen rakenne: RQ5 on tekninen selkäranka, jonka RQ1, RQ2 ja RQ4 instantioivat ja jonka RQ3 näyttää ulospäin; RQ6 on organisatorinen vastinpari.)_

**RQ1 — Formaali todentaminen.** Miten suvereeni reunatekoälyn orkestrointi voidaan formaalisti todentaa luotettavaksi säännellyissä teollisuusympäristöissä?
_EN: How can sovereign edge AI orchestration be formally verified for trustworthiness in regulated industrial environments?_
_Ankkuri: KTH/TECoSA (Törngren) · Testipenkki: Aegis-reunakäyttöönotto + KYA edge control room_

**RQ2 — Hallintorakenteet.** Mitä hallintorakenteita moniagenttiset tekoälyjärjestelmät edellyttävät tuottaakseen oikeudellisesti puolustettavia ympäristövaatimustenmukaisuustuloksia EU-sääntelyn alla?
_EN: What governance structures are required for multi-agent AI systems to produce legally defensible environmental compliance outputs under EU regulation?_
_Ankkuri: Stockholm Resilience Centre (Galaz; vahvistamaton) · Testipenkki: artikla 12 -lokitusputki + KYA-todisteketju CBAM/CSRD-kuormissa_

**RQ3 — Läpinäkyvyys.** Miten suvereenin tekoälyjärjestelmän läpinäkyvyys voidaan operationalisoida julkiseksi luettavuudeksi EU:n tekoälyasetuksen artiklan 50 mukaisesti?
_EN: How can sovereign AI system transparency be operationalized for public legibility under EU AI Act Article 50?_
_Ankkuri: tiedeviestintä Universeum/Chalmers (vahvistamaton) · Merkitty eteenpäin katsovaksi_

**RQ4 — Turvallisuus–suorituskyky.** Miten suvereenien reunatekoälyjärjestelmien turvallisuus–suorituskyky-vaihtokaupat voidaan formaalisti mallintaa ja validoida reaaliaikaisissa toimintarajoitteissa?
_EN: How can safety-performance trade-offs in sovereign edge AI systems be formally modeled and validated under real-time operational constraints?_
_Ankkuri: Törngrenin SAFECOMP-turvallisuusargumenttimetodologia · Testipenkki: Aegis (turvallisuusnäyttö vs. latenssi/laskenta)_

**RQ5 — KYA (tekninen selkäranka).** Nykyinen muoto: Miten Know-Your-Agent (KYA) -luottamuspisteytysmalli voidaan suunnitella ja validoida avoimeksi konformanssistandardiksi agenttiselle tekoälylle EU-säännellyillä toimialoilla?
_EN: How can a Know-Your-Agent (KYA) trust-scoring model be designed and validated as an open conformance standard for agentic AI in EU-regulated industries?_
\*Ankkuri: LUT-natiivi (Design Science) · Testipenkki: KYA-referenssitoteutus tuotannossa · **Ehdotettu uudelleenmuotoilu v3 — ks. kohta 2 tässä aineistossa\***

**RQ6 — Siirtymän hallinta (organisatorinen huipennus).** Miten teollisuusyritykset voivat hallita siirtymän vapaaehtoisesta ESG-raportoinnista pakolliseen suvereeniin vaatimustenmukaisuusinfrastruktuuriin häiritsemättä yritysten olemassa olevia johtamisjärjestelmiä?
_EN: How can industrial enterprises govern the transition from voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure without disrupting existing management systems?_
_Ankkuri: LUT Industrial Management · Testipenkki: Outokumpu + rakennusalan pilotit_

---

# Appendix 2 (EN) — Current Research Questions, for TECoSA / LUT innovation collaboration

_(Internal structure: RQ5 is the technical governance spine that RQ1, RQ2 and RQ4 instantiate and RQ3 exposes; RQ6 is the organisational counterpart.)_

**RQ1 — Formal verification.** How can sovereign edge AI orchestration be formally verified for trustworthiness in regulated industrial environments?
_Anchor: KTH/TECoSA (Törngren) · Testbed: Aegis edge deployment + KYA edge control room_

**RQ2 — Governance structures.** What governance structures are required for multi-agent AI systems to produce legally defensible environmental compliance outputs under EU regulation?
_Anchor: Stockholm Resilience Centre (Galaz; prospective) · Testbed: Article 12 logging pipeline + KYA evidence chain under CBAM/CSRD loads_

**RQ3 — Transparency.** How can sovereign AI system transparency be operationalized for public legibility under EU AI Act Article 50?
_Anchor: science communication via Universeum/Chalmers (prospective) · Marked forward-looking_

**RQ4 — Safety–performance.** How can safety-performance trade-offs in sovereign edge AI systems be formally modeled and validated under real-time operational constraints?
_Anchor: Törngren's SAFECOMP safety-argument methodology · Testbed: Aegis (safety evidence vs. latency/compute)_

**RQ5 — KYA (technical spine).** Current form: How can a Know-Your-Agent (KYA) trust-scoring model be designed and validated as an open conformance standard for agentic AI in EU-regulated industries?
_Anchor: LUT-native (Design Science) · Testbed: KYA reference implementation in production · **Proposed reframing v3 — see section 2:** Does the classical specification/standard distinction hold for agent governance, where the certified subject changes after certification — and is the four-gate criterion necessary and sufficient for that difference?_

**RQ6 — Transition governance (organisational capstone).** How can industrial enterprises govern the transition from voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure without disrupting existing management systems?
_Anchor: LUT Industrial Management · Testbed: Outokumpu + construction-sector pilots_

---

© 2026 Risto Anton Päärni · Lifetime Oy. Kaikki oikeudet pidätetään. / All rights reserved. KYA Specification -spesifikaatioteksti on lisensoitu erikseen Apache License 2.0 -ehdoin. / The KYA Specification text is separately licensed under the Apache License 2.0.
