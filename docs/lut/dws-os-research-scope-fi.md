# DWS OS — Väitöstutkimuksen laajuus (yhden sivun tiivistelmä)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/dws-nvidia-os-NDuOs | Date: 19.05.2026 | Changes: Tiivis yhden sivun suomenkielinen tutkimuslaajuus. Huolellinen tieteellinen suomennos englanninkielisestä yhden sivun versiosta (docs/lut/dws-os-research-scope.md). Tarkoitettu toimitettavaksi prof. Kari Smolanderille (LUT) englanninkielisen version rinnalla.

Document Status:

- Created: 19.05.2026
- Last Modified: 19.05.2026
- Language: Suomi
- Languages Available: EN, FI
- Publication Status: LUONNOS (ohjaajan arviointia varten)
- Classification: LUOTTAMUKSELLINEN — Tohtoritutkimuksen yhteydenpito
- Document Type: Tutkimuslaajuuden tiivistelmä

***

**Tutkimuskohde.** DWS OS — NVIDIA-pohjainen, EU-suvereeni paikallinen tekoälykäyttöjärjestelmä (GB10 Grace Blackwell + Nemotron 3 Super + OpenClaw-agenttiajoaika + KYA + Firecracker MicroVM), jota operoi EU:ssa kotipaikkaansa pitävä toimija (Lifetime Oy, FI).

**Tutkimusongelma.** Miten suunnitella ja validoida paikallinen tekoälykäyttöjärjestelmä, joka on **suvereeni jo rakenteen tasolla** — ei pelkästään väittämän tasolla — ja joka tuottaa **oikeudessa kestävää vaatimustenmukaisuusnäyttöä** EU:n tekoälysäädöksen, CBAM:n, CSRD:n, NIS2:n ja DORA:n alaisuudessa pysyen samalla avoimena malli-, ajoaika- ja semantiikkakerroksissaan.

**Tutkimuskysymykset.**

- **TK1 — Hallinta.** Mikä on minimaalinen, laitteistotason todentamiseen perustuva hallintayksikkö (KYA), joka riittää tekemään DWS OS:n sisäisten agenttitoimien oikeudellisen falsifioitavuuden mahdolliseksi EU:n sääntelypopulaation laajuudessa?
- **TK2 — Suvereeni arkkitehtuuri.** Mitkä arkkitehtoniset invariantit ovat välttämättömiä ja riittäviä, jotta paikallinen tekoälykäyttöjärjestelmä on EU-suvereeni rakenteen tasolla — mitattuna DWS:n suvereniteettistandardin kahdeksalla ulottuvuudella — ja miten DWS OS vertautuu empiirisesti Dellin ja Palantirin 18.05.2026 julkistettuun viitearkkitehtuuriin?
- **TK3 — Teollinen skaalautuvuus.** Yleistyykö DWS OS -malli yli 20:n EU-säännellyn toimialan poikki, ja missä yleistyksen rajat tulevat vastaan, kun sääntelyn ontologia, datan sijaintivaatimus ja agentin tehtäväpinta poikkeavat toimialojen välillä?

**Menetelmä.** Konstruktiivinen tutkimusote (Design Science Research, DSR) kolmessa virrassa: (1) artefakti — DWS OS -viiteimplementaatio on jo tuotannossa ympärivuorokautisesti, KYA avoimen standardin ehdokkaana; (2) empiirinen validointi maksavien asiakkaiden teollisuusympäristöissä tietojenkäsittelysopimuksen (DPA) alla; (3) vertaileva mittaus — kahdeksanulotteinen suvereniteetin arviointimittari sekä käyttäytymisperusteiset vertailutestit (EAB, ASB, OWASP Top 10 for Agentic Applications 2026) pisteytettynä nimettyjä vaihtoehtoja vastaan (Dell + Palantir -kokonaisuus, Foundry yksinään, julkinen pilvifrontier).

**Laajuus.** Paikallinen kerros (laitteistotason todentaminen, agenttien ajoaika, hallinta, todistuskelpoinen lokitus) EU-säännellyssä teollisessa tekoälyssä.

**Laajuuden ulkopuolella.** Mallien esikoulutus; kuluttajien agentit; EU:n ulkopuoliset sääntelyalueet (käsitellään vain vertailevan oikeudellisen kontrastin yhteydessä — yhdysvaltalainen CLOUD Act vs. GDPR).

**Säilytetään tutkimuskysymyksenä, ei oletuksena.** Voidaanko Palantir AIP -työnkulut ajaa vieraana vuokralaisena DWS OS:n sisällä rikkomatta suvereniteetti-invariantteja (konnektori-hypoteesi).

**Odotetut tieteelliset tulokset.** (1) Avoimesti lisensoitu KYA-hallintastandardi konformanssitestisarjalla, joka on kytketty EU:n tekoälysäädöksen artikloihin 12 / 14 / 72; (2) EU:n paikallisen tekoälykäyttöjärjestelmän viitearkkitehtuuri ja kahdeksanulotteinen suvereniteettimittari, jotka validoidaan ajantasaista kaupallista vaihtoehtoa vastaan; (3) empiirinen tapauspohja yli 20 toimialalta; (4) teoreettinen silta moniagenttisen päättely–käyttäytymis-aukon (Shapira 2026; Emergence AI 2026; EARTHwise EAB 2026) ja laitteistotason todentamiseen perustuvan falsifioitavuus-lokuksen välille.

**Aikataulu (3–7 vuoden aikahorisontti).**

- 2026 — Artikkeli 1: KYA-avoimen lähdekoodin hallintastandardi.
- 2027 — Artikkeli 2: *Suvereeni rakenteen tasolla* — DWS OS -arkkitehtuuri ja Dell + Palantir -vertailu.
- 2028 — Artikkelit 3–4: 20 toimialan empiiriset havainnot.
- 2028–2029 — Väitöskirjan synteesi ja puolustus.
