# Firehorse-tuotevalmistuksen toimintamalli

## Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille

---

# VERSION AND AGENT HISTORY

Version: 3.93
Sessions & Modifications:

- Version: 3.93 | Tool: Claude Code | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Lockstep-versionosto 3.92 -> 3.93 CLAUDE.md:n Thesis-saannon mukaan. Ei sisaltomuutosta tahan tiedostoon: v3.93-lisays (kahden toimintaprofiilin jako, mitoitettavan polven argumentti ja laskenta-plus-lainkayttoalue -kytkenta) on markkinasignaali ja tieteellinen kehystys, ja kuuluu tiedostoon PHD_FIREHORSE §14.45 Loydos 5 / Avainkontribuutio #50.
- Version: 3.92 | Tool: Claude Code | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Lockstep-versionosto 3.91 -> 3.92 CLAUDE.md:n Thesis-saannon mukaan. Ei sisaltomuutosta tahan tiedostoon: v3.92-lisays (harness-maksumuuri / syvyysarbitraasi -dialektiikka ja sen kapasiteettisuunnittelun reunaehto) on markkinasignaali ja tieteellinen kehystys, ja kuuluu tiedostoon PHD_FIREHORSE §14.45 / Avainkontribuutio #50.
- Version: 3.91 | Tool: Claude Code | Session: claude/ollama-orchestration-merge-047pj7 | Date: 26.07.2026 | Changes: Lockstep-versionosto 3.90 → 3.91 CLAUDE.md:n Thesis-säännön mukaan. Ei sisältömuutosta tähän tiedostoon: v3.91-lisäys (supply-keskittymän mitigointi — ei-NVIDIA-fallback-laskentakerros testbed-tasolla, joka muuntaa lock-inin hallituksi riippuvuudeksi) on markkinasignaali ja kuuluu tiedostoon PHD_FIREHORSE §14.44 Löydös 3.

- Version: 3.90 | Tool: Claude Code | Session: claude/ollama-orchestration-merge-047pj7 | Date: 26.07.2026 | Changes: Lockstep-versionosto 3.89 → 3.90 CLAUDE.md:n Thesis-säännön mukaan. Ei sisältömuutosta tähän tiedostoon: v3.90-muutos (Cosmos 3 Edge / DeepSeek-V4-Pro speksit VERIFIOITU ensisijaislähteillä 26.07.2026; §14.44:n varauksen päivitys + perhe-tier/physical-AI-tarkennus + FI-tiedoston sijaintikorjaus) on markkinasignaali ja kuuluu tiedostoon PHD_FIREHORSE §14.44.

- Version: 3.89 | Tool: Claude Code | Session: claude/ollama-orchestration-merge-047pj7 | Date: 26.07.2026 | Changes: Lockstep-versionosto 3.88 → 3.89 kaikissa 4 opinnäytetyötiedostossa CLAUDE.md:n Thesis-säännön mukaan. Ei sisältömuutosta tähän master-opinnäytetiedostoon: v3.89-lisäys (NVIDIA Cosmos 3 Edge -laitteessa ajettava maailmanmalli LWM:n build→adopt-käännekohtana sekä data-sovereign vs supply-keskittymä -jännite) on markkinasignaali/tieteellinen kehystys ja kuuluu §1.4-skooppisäännön mukaan tiedostoon PHD_FIREHORSE_FI.md §14.44 ja avainkontribuutio #49. Kun Cosmos 3 Edge oikeasti wirataan pinoon, toteutusnäyttö lisätään tämän tiedoston Liite E:hen. Speksit ovat ulkoisia/varmentamattomia (käyttäjän raportoimat NVIDIA-ilmoitukset, heinäkuu 2026). Kumppani: docs/field-notes/2026-07-26-cosmos-3-edge-lwm-build-adopt-inflection.md.

- Version: 3.88 | Tool: Claude Code | Session: claude/ollama-orchestration-merge-047pj7 | Date: 26.07.2026 | Changes: Täydennetty Liite E (LWM-koulutusinfrastruktuuri) varmennetulla koulutuslaitteiston todellisuus -alaluvulla (toteutusnäyttö §1.4 master-vs-PhD-skooppisäännön mukaan; olemassa oleva QLoRA-putken teksti säilytetty Rule 12:n mukaan). Vahvistaa että GN-100 on reuna-INFERENSSI-/kehitysnode — soveltuu pienten (~7–13B) mallien QLoRA-hienosäätöön, EI täyden ~55B LWM:n esikoulutukseen (koulutus vaatii ~8–16× inferenssin muistin → satoja GB–TB vs 128 GB). Kirjaa PR #1720 -varmennuksen joka demotoi erillisen on-prem "Acer Node" -koulutusväitteen tilaan Pending Hardware (ei putkikoodia, ei kyseistä x86/2×RTX-4090-nodea, ei go-livea); pilvi (GCP A3 Mega) on ainoa käytettävissä oleva täyskoulutusreitti. Realistinen putki (pilvi-esikoulutus/hienosäätö → NVFP4-kvantisointi Blackwellille → GN-100 reunainferenssi) ja token-capital-kehys (vallihauta = oppimissilmukka + privaatit evaluaatiot omalla fleet-datalla, ei from-scratch 55B). Kumppani: docs/lab-notes/2026-07-26-lwm-training-hardware-reality.md. Lockstep 3.87→3.88 kaikissa 4 tiedostossa; PHD-tiedostot saavat lockstep-merkinnän; Learn/ HTML-regenerointi ODOTTAA (Pandoc).

- Version: 3.87 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Muutokset: Terävöitetty §10.27:ää kahdella kohdalla ulkoisen arvioinnin pohjalta. (1) **Yhteensovitusvelka** — alkuperäinen teksti sanoi, ettei legitimiteetti "liiku", mikä aliarvioi riskin: arvioimaton iterointi voi ajautua kauemmas hyväksyttävyydestä samalla kun se sisäisillä mittareilla vaikuttaa paranevan. (2) Lisätty **"Oletuksena sisäinen"** ohjaavaksi tuotealustaperiaatteeksi (§10.27.4 periaate 1, muut uudelleennumeroitu 2–5). EN/FI-lukkoaskel. Tietoisesti EI omaksuttu samasta arvioinnista: väite, että kuilu on "se kohta jossa suurin osa tekoälynatiivista vaatimustenmukaisuustyöstä epäonnistuu" — todentamaton markkinaväite, jolle tällä ohjelmalla ei ole aineistoa.
- Version: 3.86 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Muutokset: Lisätty §10.27 (Artefakti–legitimiteetti-kuilu). EN/FI-lukkoaskel; sisältö vastaa V3Thesis_EN.md §10.27:ää. Nimeää suurimman käytännön ongelman huippumalleilla rakentamisessa: artefaktin tuottaminen puristuu tunteihin, legitimointi ei purista lainkaan. Tunnistaa toisen asteen vaikutuksen — sujuvuus ei ole enää näyttöä prosessista, mutta lukijat käyttävät sitä yhä legitimiteetin korvikemittarina, joten laatija ylivaatii tahtomattaan. KYA v1.5 työstettynä tapauksena (nolla neljästä portista; kategoria oli väärin, ei tekninen sisältö). Ydinlöydös: versionumero kiihtyy, legitimiteetti ei liiku. Kolmen lainkäyttöalueen laajennus tekee kuilusta mitattavan. Dokumentoi oppimisstandardin §10:n toteutettuna vastatoimena (legitimiteettiväitteiden nopeusrajoitin). Johtaa neljä tuotealustan suunnitteluperiaatetta vaatimustenmukaisuusälylle.
- Version: 3.85 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Muutokset: Lukkokohtainen versionosto 3.84 → 3.85 kaikissa 4 opinnäytetyötiedostossa CLAUDE.md-tutkielmasäännön mukaan. Ei sisältömuutosta tässä tiedostossa: istunnon uusi aineisto on standardointireitti- ja lainkäyttöaluearkkitehtuurianalyysiä, joka kuuluu väitöskirjaan sisältörajaussäännön mukaan (ks. PHD_FIREHORSE §14.43). Tämän istunnon toteutusnäyttö on edelleen §10.26:ssa.
- Version: 3.84 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Muutokset: Lisätty §10.26 (Verified-Done-attestoinnin allekirjoituspolun kryptografinen katselmointi: kaksi löydöstä ja falsifiointi testien laatuporttina). EN/FI-lukkoaskel §10.26:n osalta; sisältö vastaa V3Thesis_EN.md §10.26:ta. Toteutusnäyttöä CLAUDE.md:n tutkielman sisältörajaussäännön mukaisesti: Ed25519 node:crypto-moduulin kautta -riippuvuuspäätös, löydös F1 (KORKEA) allekirjoituksen kattamattomista todisteen metatiedoista, juurisyy testisuunnittelussa, W3C Data Integrity -korjaus, löydös F3 (avaintyypin tarkistus) sekä metodologinen kontribuutio: falsifiointi testien laatuporttina (47 → 51 testiä). Markkinasignaali- ja tieteellinen kehystys samasta sessiosta on PHD_FIREHORSE §14.42.
- Version: 3.83 | Tool: Claude Code | Session: claude/eda-dws-iq-business-case-jm7p3g | Date: 17.07.2026 | Muutokset: Lukkokohtainen versionosto 3.82 → 3.83 kaikissa 4 opinnäytetyötiedostossa CLAUDE.md-tutkielmasäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.83:n lisäys (DAC 2026:n agenttisen EDA:n tutoriaaliraita poikkitieteellisenä todisteena kolmivektoriselle agenttinen/avoin/hallittu-toimintamalliteesille, ja EDA:n puolustettavan jäännöksen suvereeni-suunnittelu-IP-ympäristö-uudelleensijoitus) on markkinasignaali-/tieteellinen-kehystyspanos ja §1.4:n maisteri–PhD-laajuussäännön mukaan sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.41 ja Avainpanos #48. Oheisdokumentit: docs/DGX_SPARK_4X_EDA_BUSINESS_CASE.md, onelifetime.world/posts/ai-supercomputing-meets-eda-sovereign-design.html.
- Version: 3.82 | Tool: Claude Code (claude-sonnet-5) | Session: claude/nvidia-halos-robotics-suqayg | Date: 10.07.2026 | Muutokset: Lukkokohtainen versionosto 3.81 → 3.82 kaikissa 4 opinnäytetyötiedostossa CLAUDE.md-tutkielmasäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.82:n lisäys (NVIDIA Halos for Robotics standardointi-ennen-määräaikaa-signaalina fyysisen tekoälyn turvallisuussertifioinnille, sertifiointi-vs-todiste-sääntelykohde-erottelu, ja KYA:n fyysisen turvallisuuden sidos) on markkinasignaali-/sääntelyputkipanos ja §1.4:n maisteri–PhD-laajuussäännön mukaan sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.40 ja Avainpanos #47. Oheisdokumentti: docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md.
- Version: 3.81 | Tool: Claude Code (Fable 5) | Session: claude/ai-sovereignty-research-9eshgd (yhdistetty merge) | Date: 07.07.2026 | Muutokset: Lukkokohtainen versionosto 3.80 → 3.81 kaikissa 4 opinnäytetyötiedostossa CLAUDE.md-tutkielmasäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.81:n yhdistetty aines (tekoälysuvereniteetin yhdeksän teesin viitekehys ja painokerroin-kontrolliargumentti) on tieteellis-normatiivinen kehystyspanos ja §1.4:n maisteri–PhD-laajuussäännön mukaan sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.39 (uudelleennumeroitu haaran alkuperäisestä §14.34:sta) ja Avainpanos #46. Oheisdokumentti: docs/field-notes/2026-07-01-ai-sovereignty-nine-theses.md.
- Version: 3.80 | Tool: Claude Code (Fable 5) | Session: claude/industry-world-models-study-Mk2mu (yhdistetty merge) | Date: 07.07.2026 | Changes: Lukkokohtainen versionosto 3.79 → 3.80 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.80:n yhdistetty lisäys on markkinasignaali/arkkitehtuurisignaali (Karpathyn GPT-2 → teollisuuden maailmamallit, viisi kilpailevaa arkkitehtuuria, 16 teollisuudenalan Fit for 55 -maailmamallien spesifikaatiomatriisi, modulaarinen maailmamallitehdas, 2026 ekosysteemin konvergenssi: AMI Labs / Cosmos 2.5 / Genie 3 / Marble / Siemens Digital Twin Composer), joka master-vs-PhD-skooppisäännön §1.4 mukaan kuuluu vain väitöskirjaan. Katso PHD_FIREHORSE_FI.md §14.38 (Teollisuuden maailmamallit, uudelleennumeroitu haaran alkuperäisestä §14.20:sta — kyseinen paikka oli itsenäisesti käytössä "AI Pricing Capitulation" -luvulle main-haarassa) ja Avainpanos #45 tieteellistä kehystystä varten. Täysi tutkimus: docs/INDUSTRY_WORLD_MODELS_STUDY.md.
- Version: 3.79 | Tool: Claude Code | Session: claude/aspire-development-evolution-16fxg0 | Date: 07.07.2026 | Changes: Lisätty §10.25.6 (Täydennys: Spaniin leimattu valtuutusverdikti) — ulkoinen kritiikki (Hakimi): GenAI-jälki tallentaa mikä laukesi muttei koskaan olisiko sen pitänyt pystyä siihen; varmennettu täsmälliseksi koodia vasten (LLM-asiakkaalla vain palveluntarjoajan Bearer-otsake; KYA-valvonta eristettynä hiekkalaatikkokerrokseen). Toteutettu samana päivänä: KYAVerdict withAgentSpan/withLLMSpan-apureihin, leimaa dws.kya.verdict/trust_score/policy_version/gate gen_ai.\*-attribuuttien rinnalle; verdiktittömät spanit leimataan 'ungated' (ei koskaan tyhjäksi), jolloin valtuutuskattavuuden aukot ovat kyseltäviä; ungated-spanien määrä nimetty kattavuusaukkometriikaksi; 2 uutta yksikkötestiä (8/8 läpi). PHD-tiedostot saavat tieteellisen uudelleenmuotoilun (§14.37.4-korjaus KC #44(b):hen). Lukitusnosto 3.78→3.79; Learn/-HTML uudelleengeneroitu. Rinnakkaisdokumentti: docs/field-notes/2026-07-07-hakimi-observability-vs-authorization.md.

- Version: 3.78 | Tool: Claude Code | Session: claude/aspire-development-evolution-16fxg0 | Date: 07.07.2026 | Changes: Lisätty §10.25 (Monikielinen havainnointi tuotannossa: Aspire Dashboardin käyttöönotto ja hiljaisen telemetrian häiriö) — toteutuspuolen sisältö master-vs-PhD-skooppisäännön mukaisesti: vain-dashboard Aspire-käyttöönotto DGX Sparkilla (aspire-dashboard:13.3.5 kiinnitetty, compose v1.1.1), OTel-toteutusinventaario (otel.ts opt-in-alustus, tracing.ts GenAI-semanttisten konventioiden span-apurit, telemetry.types.ts + migraatio 066 artikla 12 -ristiviittauksin), heinäkuun 2026 hiljaisen telemetrian häiriö (kaikki kolme OTLP-tuottajaa työnsivät http/protobuf-telemetriaa dashboardin UI-porttiin 18888 OTLP/HTTP-kuuntelijan 18890 sijaan — telemetria pudotettiin hiljaisesti; korjattu compose v1.3.1:ssä), kolme insinöörityön oppia (käyttäytymisvarmennus, hiljaa vikaantuvat alijärjestelmät vaativat kompensoivia kontrolleja, viereisporttien vikaluokka) sekä avoin GenAI-viestisisällön tallennuksen tietosuojapäätös. PHD-tiedostot saavat markkinasignaalikehystyksen (§14.37 + avainkontribuutio #44). Kaikki 4 opinnäytetyötiedostoa nostettu 3.77→3.78 lukitusti CLAUDE.md:n opinnäytetyösäännön mukaan; Learn/-HTML uudelleengeneroitu.

- Version: 3.77 | Tool: Claude Code | Session: claude/dws-nvidia-os-NDuOs | Date: 19.05.2026 | Changes: Lukkokohtainen versionosto 3.76 → 3.77 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.77:n sisältölisäys on tutkimuksen kehystämisen uudistus ja 48 tunnin markkinasignaali (Dell + Palantir "On-Premises AI Operating System" 18.05.2026 + Google "Antigravity Agent Operating System" 19.05.2026), joka nimeää _DWS OS:n_ väitöstutkimusohjelman yhdistäväksi artefaktiseksi rangaksi. Master-vs-PhD-skooppisäännön §1.4 mukaan tutkimuskehystys ja markkinasignaalit kuuluvat vain väitöskirjaan. Katso PHD_FIREHORSE_FI.md §1.2.2 (Yhdistetty DWS OS -ranka ja skenaarioiden priorisointi) ja §14.36 (Kahden signaalin konvergenssi) tieteellistä kehystystä varten, sekä `docs/DWS_OS_POSITIONING.md` + `docs/lut/` ohjaajalle toimitettujen dokumenttien osalta. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin). Yhdistämismerkintä (06.07.2026, istunnon claude/dws-nvidia-os-NDuOs yhdistäminen): alun perin kirjoitettu 19.05.2026 numeroin v3.58 / §14.20 / Avainpanos #25; uudelleennumeroitu muotoon v3.77 / §14.36 / Avainpanos #43 yhdistettäessä, koska main-haaran v3.58–v3.76, §14.20–§14.35 ja Avainpanokset #25–#42 olivat jo muiden istuntojen käytössä (sama käytäntö kuin v3.73-uudelleennumeroinnissa).
- Version: 3.76 | Tool: Claude Code | Session: claude/physical-ai-first-person-3mmu70 | Date: 05.07.2026 | Changes: Lukkokohtainen versionosto 3.75 → 3.76 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. v3.76:n substanssisisältö (Jensen Huangin "digitaalinen robotti" -kehys agenttisesta tekoälystä ja hänen tunnistuksensa ensimmäisen persoonan datasta — vasten maailman ylivoimaisesti kolmannen persoonan videokorpusta — fyysisen tekoälyn vaikeimpana ongelmana; LWM vaiheen 3 portittavan syötteen uudelleentunnistus ensimmäisen persoonan operatiiviseksi dataksi laskennan tai linjauksen sijaan; Huangin viisielementtisen fyysisen tekoälyn pinon — datamoottori / simulaattori / palkitseminen / ajoympäristö / tietokone — elementti elementiltä -kuvaus Aivot–Muisti–Keho–Kädet-arkkitehtuuriin; Havaintopääoman tuotantomekanismin määrittely; sekä suvereeni, suostumuspohjainen, EU-sijaintinen ensimmäisen persoonan datan proveniessipredikaatti, joka laajentaa nelirataista KYA-sarjaa) on markkinasignaali / tieteellinen kehys ja §1.4 master-vs-PhD-skooppisäännön mukaan se sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.35 (Ensimmäisen persoonan datan pullonkaula) ja Avainpanos #42. Osion/version/Avainpanoksen numerot nostettu alkuperäisestä v3.71/§14.33/#39 -luonnoksesta v3.76/§14.35/#42:een välttäen törmäyksen mainin jo laskeutuneiden §14.33/§14.34 ja Avainpanosten #39–#41 kanssa. Toteutusta ei ole vielä toimitettu tälle signaalille (thesis/strategia-first-päätös), joten tiedosto saa pelkän lukkokohtaisen versionostomerkinnän eikä uusia osioita. `Learn/`-HTML generoitu uudelleen v3.76:een scripts/gen-thesis-html.cjs:llä. Ensisijainen lähde: Jensen Huang (NVIDIA), julkiset kommentit agenttisesta ja fyysisestä tekoälystä, 2026.
- Version: 3.75 | Tool: Claude Code | Session: claude/lifetime-handbook-web-updates-lmyi2g | Date: 01.07.2026 | Changes: Pelkkä lukkokohtainen versionosto. Sisältöaines (VM:n turvallisuuslähtöisen tiedonhallinnan opas, VM 2026:27, kytketty DWS:n Control Room/Situation Room -retention-malliin) on regulatiivista putki-/markkinasignaalikehystystä §1.4 master-vs-PhD-skooppisäännön mukaan, joten se sijaitsee tiedostossa `docs/PHD_FIREHORSE_FI.md` §14.34 ja Avainpanos #41. Ei tuotetoteutussisältöä lisätty tähän.
- Version: 3.74 | Tool: Claude Code (claude-opus-4-8) | Session: claude/anduril-case-study-iridtj | Date: 29.06.2026 | Muutokset: Lukkokohtainen versionosto 3.73 -> 3.74. CSRD-soveltamisala tarkennettu lopulliseen Omnibus-lukuun (neuvosto 24.02.2026): alle ~5 000 suurta yritystä (>1 000 tyontekijaa JA >450 M EUR), korvaa valiaikaisen ~10 000; "50 000+ vuoteen 2028" -vaitteet korjattu. DWS_TRUTH_STANDARD v2.5 2C. Learn/ HTML-uudelleengenerointi PENDING.
- Version: 3.73 | Tool: Claude Code | Session: claude/article-research-phd-tvmskz | Date: 28.06.2026 | Changes: Merge-konfliktien ratkaisu: yhdistetty haara claude/article-research-phd-tvmskz (v3.71 RQGM §14.33) ja origin/main (v3.71 keskeytyskustannus §14.20.8 + v3.72 kyvykkyysontologia V3Thesis §10.24). KC#39-numerointitörmäys ratkaistu: main käytti KC#39 kyvykkyysontologialle (V3Thesis §10.24), tämä haara käytti KC#39 RQGM:lle (PHD §14.33) → RQGM uudelleennumeroitu KC#40:ksi. Kaikki 4 opinnäytetyötiedostoa nostettu v3.73:een lukkoaskelin.
- Version: 3.72 | Tool: Claude Code | Session: claude/winning-sales-strategy-qb1boj | Date: 28.06.2026 | Changes: Lisätty §10.24 (Kyvykkyysontologia ja kolmen pilarin konsultointimalli — agenttitaksonomiasta yritystoimitukseen). Toteutusnäyttö: 10 LWM-pohjaista tietograafiluokkaa, jotka järjestävät yli 80 agenttikyvykkyyttä (62 olemassa olevaa + 18 uutta), kolmen pilarin konsultointimalli (kyvykkyyskoulutus, toimialakohtaisten compliance-työnkulkujen kehittäminen ja tuotantoon vieminen, keskeytyksetön projektin jatkuvuus Keskeytyslaskuri-integraatiolla), Aegis Defence -kyvykkyyden rehellinen korjaus (SAR-orbitaalinen detektio ainoastaan — ei dronetunnistusta), ja lifetime.fi-sivuston käyttöönotto kolmen pilarin konsultointiosiolla. Liiteartefakti: `docs/KONSULTOINNIN_KASIKIRJA_2026.md` v1.5 (Konsultin käsikirja 2026). Avainpanos #39. Kaikki 4 opinnäytetyötiedostoa nostettu v3.72:een lukkokohtaisesti CLAUDE.md:n opinnäytetyösäännön mukaan.
- Version: 3.71 | Tool: Claude Code | Session: claude/article-research-phd-tvmskz | Date: 27.06.2026 | Changes: Lukkokohtainen versionosto 3.70 → 3.71 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. v3.71:n substanssisisältö (Red Queen Gödel Machine -signaali — RQGM, Iacob ym., arXiv:2606.26294v1, 24.06.2026, Cambridge / NVIDIA / Flower Labs / MBZUAI / Inria — evolutiivinen kehys rekursiiviseen itseparannukseen ei-stationääristen utiliteettien alla kontrolloidun utiliteetin evoluution kautta; nimeää konformanssin temporaalisen aukon, jossa kiinteät arvioijat rapautuvat agenttien parantuessa, empiirisesti 1,91× ylihyväksyntä; laajentaa nelirataista KYA-sarjaa epokki-alaindekseillä vaatien arvioijan uudelleenvalidoinnin; johtaa artikla 12 -arvioijan kalibrointivaatimuksen; tunnistaa Flower Labsin federoidun oppimisen suvereniteettia säilyttäväksi siirtoväyläksi yhteisevoluutioparantamiseen) on markkinasignaali-/tieteellinen kehystys -panos ja §1.4 master-vs-PhD-skooppisäännön mukaan se sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.33 ja Avainpanos #40. Toteutusta ei ole toimitettu; tiedosto saa pelkän lukkokohtaisen versionostomerkinnän. Liiteartefakti: docs/field-notes/2026-06-27-red-queen-godel-machine-rqgm.md.
- Version: 3.71 | Tool: Claude Code | Session: claude/keskeytyslaskuri-lifetime-missing-6uaxvu | Date: 27.06.2026 | Changes: Lukkokohtainen versionosto 3.70 → 3.71 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. v3.71:n substanssisisältö (keskeytyskustannusten taloustiede viiden ajurin mallina, joka laajentaa CSB-rataa CSB-I-alaradalla, johdettuna Keskeytyslaskuri-työkalusta osoitteessa lifetime.fi/laskuri/) on markkinasignaali-/kustannusanalyysipanos ja §1.4 master-vs-PhD-skooppisäännön mukaan se sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.20.8. Toteutuspuolen sisältöä ei kuulu tähän pro graduun tämän signaalin osalta, joten tiedosto saa pelkän lukkokohtaisen versionostomerkinnän eikä uusia osioita.
- Version: 3.70 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 25.06.2026 | Changes: Lukkokohtainen versionosto 3.69 → 3.70 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. v3.70:n substanssisisältö (säännellyn toimialan autonomisen insinöörin kategoria — 51 Firehorse Skilled-agentin + työnkulkuorkestroijien + KYA-sillan komponointi NemoClaw-pitkäkestoisiksi agenteiksi OpenShellin alla, hallintaympäristönä KYA/artikla 12/EU-suvereenius puolustettavana jäännöksenä) on strategia-/markkinasignaalipanos ja §1.4 master-vs-PhD-skooppisäännön mukaan se sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.32 ja Avainpanos #38. Toteutusta ei ole vielä toimitettu (thesis/strategia-first-päätös); tiedosto saa pelkän lukkokohtaisen versionostomerkinnän. `Learn/`-HTML generoitu uudelleen v3.70:een scripts/gen-thesis-html.cjs:llä.
- Version: 3.69 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 25.06.2026 | Changes: Lukkokohtainen versionosto 3.68 → 3.69 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. v3.69:n substanssisisältö (NVIDIAn kesäkuun 2026 EuroHPC EU-tekoälytehtaiden rakennusaalto julkisena EU-suvereenina koulutusyläjuoksuna sekä NVIDIAn avoin agenttiturvapino — NeMo Agent Toolkit, OpenShell-ydinhiekkalaatikkoajo, NemoClaw, Hermes/Nous Research — valmistajan tukemana referenssiajona KYA:n ASB/SIB-radoille) on markkinasignaali ja §1.4 master-vs-PhD-skooppisäännön mukaan se sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.31 ja Avainpanos #37. Ainoa toteutuspuolen seuraus — agenttiajon migraatio paljaasta OpenClawista OpenShell-hiekkalaatikoituun NemoClaw-distribuutioon turvallisuusperustein — seurataan rajattuna teknisenä migraationa, ei uutena pro gradu -osiona, joten tiedosto saa pelkän lukkokohtaisen versionostomerkinnän. `Learn/`-HTML generoitu uudelleen v3.69-muotoon scripts/gen-thesis-html.cjs:llä.
- Version: 3.68 | Tool: Claude Code | Session: claude/aegis-multilingual-pages-3clsx0 | Date: 23.06.2026 | Changes: Lukkokohtainen versionosto 3.67 → 3.68 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. v3.68:n substanssisisältö (EU:n monikielinen terminologia suvereenien sääntelyväitteiden kanonisena konformanssikerroksena — asetuksen (EU) 2021/821 kaksikäyttötermi EU:n virallisilla kielillä; kansainvälisen lyhytmuodon vs. kansallisen virallisen muodon rekisteripäätös; sekä suvereenin puolustusmarkkinan asemointi suhteessa suomalaiseen puolustusteknologiaekosysteemiin — Nokia, Patria, VTT, NATO DIANA Espoo, EDIP 2026–2027) on markkina-/sääntelyasemointisignaali ja §1.4 master-vs-PhD-skooppisäännön mukaan se sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.30 (EU:n monikielinen suvereniteettipinta) ja Avainpanos #36. Toteutuspuolen artefakti — Aegis-esittelysivu (/aegis) ja tuotesivu (/products/aegis) renderöitynä viidellä EU-kielellä (FI/SV/DE/FR/EN) pystysuuntaisen kielipalkin (vertical-lang-bar.js v1.3) kautta paikallaan tapahtuvalla dws-lang-stay-vaihdolla ja kaksoiskansiopeilauksella dws10.com-sivustolla — on ohut web-GTM-pintamuutos, jonka olemassa oleva toimintamallikehys jo kattaa, eikä se vaadi uutta pro gradu -osiota. `Learn/`-HTML generoitu uudelleen v3.68-muotoon scripts/gen-thesis-html.cjs:llä.
- Version: 3.67 | Tool: Claude Code | Session: claude/thesis-v3.64-lockstep-kqtal1 | Date: 21.06.2026 | Changes: Lukkokohtainen versionosto 3.66 → 3.67 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. v3.67:n substanssisisältö (VTV 10/2026 -ylimmän tarkastuselimen signaali Suomen julkisen sektorin tekoälyvalmiudesta) on markkina-/sääntelysignaali ja §1.4 master-vs-PhD-skooppisäännön mukaan se sijaitsee tiedostossa PHD_FIREHORSE_FI.md §14.29 (Suomen julkisen sektorin tekoälyadoption tarkastussignaali) ja Avainpanos #35. Toteutuspuolen sisältöä ei kuulu tähän pro graduun tämän signaalin osalta, joten tiedosto saa pelkän lukkokohtaisen versionostomerkinnän eikä uusia osioita. `Learn/`-HTML generoitu uudelleen v3.67-muotoon scripts/gen-thesis-html.cjs:llä.
- Version: 3.66 | Tool: Claude Code | Session: claude/thesis-v3.64-lockstep-kqtal1 | Date: 21.06.2026 | Changes: Lisätty §5.2.1 (Merkkipaalu: Agentit → Silmukat → Työnkulut, kesäkuu 2026) — toteutusnäyttö kolmitasoiselle tekoälynatiivipinolle: 50 tuotanto-Skilled Agentia (BaseAgent + kirjanpitonatiivinen tulossopimus per Firehorse 7), Tekijä–Tarkastaja-Silmukkatekniikkaprimitiivi (PR #1447, commit d34876a, toimitettu 8.6.2026; levytilaan tallennettu tila / budjettirajoitin / turvarajoitin / jatkettavissa) ja käynnissä olevat moniagenttityönkulut (MCP Hub fan-out/peräkkäinen/reflektio); yhteenvetotaulukko mukana. Alkuperä: pidätetty sisältö haaralta claude/lifetime-agents-loops-workflows-t3448v (commit abe8409, "v3.64 lockstep"), pidätettiin PR #1465:stä; rakennettu uudelleen nykyistä mainia vasten ja uudelleennumeroitu v3.64→v3.66, koska main oli itsenäisesti käyttänyt versiot v3.63/v3.64. Tieteellinen/toimintamallinen kehystys (3–7 v horisontti, EU AI Act -artiklat 12/14/15, rakenteellisen sekvensoinnin teesi) sijaitsee tiedostoissa PHD_FIREHORSE_EN/FI §14.28 ja Avainpanos #34 §1.4-skooppisäännön mukaan. Kaikki 4 opinnäytetyötiedostoa nostettu v3.66:een lukkokohtaisesti.
- Version: 3.65 | Tool: Claude Code (claude-opus-4-8) | Session: claude/modest-keller-dGHtw | Date: 22.06.2026 | Changes: Lukittuversiopäivitys 3.64 → 3.65 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. Ei sisältömuutosta tässä master-opinnäytetyötiedostossa: v3.65:n sisällöllinen lisäys on kysyntäpuolen markkinasignaali (Simon Willisonin 29.05.2026 katsaus, joka vahvistaa yritysasiakkaiden maksavan listatun per-token-API-hinnan huhtikuusta 2026, uusimpien frontier-mallien hinnankorotukset, Anthropicin raportoitu noin 1,25 mrd $/kk SpaceX Colossus -inferenssikulutus sekä Opus-4.8:n rehellisyys/pidättäytymisparannukset), joka §1.4:n master-vs-PhD-skooppisäännön mukaan kuuluu vain väitöskirjaan. Katso PHD_FIREHORSE_FI.md §14.20.7 (Viikon 22 vahvistus: huhtikuun 2026 täysihintainflektio ja todennuskustannus-korollaari) tieteellistä kehystä varten, mukaan lukien todennuskustannus-tarkennus CSB-rataan (kustannuspinnan vakautta hallitsee sekä sisääntulon tokenhinta että ulostulon todennuskustannus). Firehorse-toimintamallin toteutuspuolen ominaisuudet, joille tämä signaali altistuu (Spark-omistettu laskenta §10.10.6.1, prompt-välimuisti, OpenClaw omistetulla raudalla), on jo dokumentoitu tässä master-opinnäytetyössä eivätkä vaadi uusia lukuja — signaali validoi olemassa olevan toteutuskurin. Liiteartefakti: docs/field-notes/2026-06-01-simon-willison-pmf-api-cost-edge-moat.md; asiakaspintaan nostot dws10.com-etusivulla ("The European Moat") ja osto-sivulla ("No Per-Token Cost"), molemmat peilattu landing-pages/dws10-com/-hakemistoon. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.64 | Tool: Claude Code (claude-opus-4-8) | Session: claude/capital-classes-audit-jgworp | Date: 20.06.2026 | Changes: Lisätty §10.23.7 (Neljän pääomaluokan kartoitus arkkitehtuuriin) — kartoittaa 4P-kaanon (Prompt, Ihmiset, Laitos, Havainto) DWS IQ 6:n Aivot-Muisti-Keho-Kädet-arkkitehtuuriin komponenttikartoitustaulukolla ja ristiviittauksilla; esittelee GTM-laajene-käyttöönottomalliin Havaintopääoman kertymismekanismin toteutustason seurauksena; Avainpanos #33. Lukittuversiopäivitys 3.63 → 3.64 CLAUDE.md:n opinnäytetyösäännön mukaan; väitöskirjan §14.26/§14.27 (teoria + Kaukopää-tapaus) PHD_FIREHORSE_EN/FI.md:ssä ovat tieteellinen kehys (väitöskirjan skooppi §1.4:n mukaan). Liiteartefaktit: docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md (v2.0), DWS_BRAND_STANDARD.md §23. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.63 | Tool: Claude Code (claude-fable-5) | Session: claude/token-human-capital-mjrbc7 | Date: 19.06.2026 | Changes: Lisätty §10.23 (Kolmen pääoman kertymismalli — token-pääoma, inhimillinen pääoma ja Control Room -pääoma DWS IQ 6 -toimintamallin kestävinä omaisuuserinä). Toteutuspuolen sisältö §1.4:n master-vs-PhD-skooppisäännön mukaisesti: dokumentoi 7 kuukauden HIL-vaiheen (loka 2025 – kesä 2026) tuotantoinsinöörointitapahtumana, mitatun token-pääomainventaarion (30+ taitoa, 150+ kenttämuistiota, 50-agentin foundry, artikla 12 -auditointipolku), Control Room -arkkitehtuurin käyttöönottona DWS IQ 6:ssa sekä HIL → HIC -operatiivisen siirtymän kesäkuun 2026 havainnon. Markkinasignaali ja tieteellinen kehystys (Nadella Build 2026, teoreettinen kolmen pääoman malli, kilpailueste-analyysi, KYA-standardin laajennus) asuvat PHD_FIREHORSE_FI.md §14.25:ssä ja Avainpanos #30:ssa. Kaikki 4 opinnäytetyötiedostoa nostettu v3.63:een lukitusti CLAUDE.md:n opinnäytetyösäännön mukaan. Liiteartefakti: docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.62 | Tool: Claude Code | Session: claude/ai-spending-coalition-china-b8d2c | Date: 07.06.2026 | Changes: Lukkokohtainen versionosto 3.61 → 3.62 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. §1.4 master-vs-PhD-skooppisäännön mukaisesti v3.62:n sisältölisäys (vuosi-vuodelta-tutkimus "halukkaiden koalition" — G7 + liittolaiskumppanit — tekoälymenoista verrattuna Kiinaan, skooppi = kaikki tekoälysijoittaminen) on markkinasignaali / tieteellinen kehystys ja sijaitsee PHD_FIREHORSE_FI.md §14.24:ssä (Tekoälymenojen epäsymmetria: G7-plus-kumppanit -koalition pääomaherruus, Kiinan pääomatehokkuuden vastatrajektori ja suvereeni-laskennan implikaatio) sekä Avainpanos #29:ssä. Tähän signaaliin ei kuulu toteutuspuolen sisältöä tähän maisterityöhön, joten tämä tiedosto saa pelkän lukkokohtaisen versionostomerkinnän eikä uusia osioita. PhD-osion ensisijaiset lähteet: Stanford HAI AI Index Report 2025 & 2026 (Economy-luvut); Pariisin AI Action Summit (helmi 2025); G7 2025 (Kanadan puheenjohtajuus) AI Adoption Roadmap.
- Version: 3.61 | Tool: Claude Code (claude-opus-4-7) | Session: claude/sovereignty-field-note-2-R0Un5 | Date: 28.05.2026 | Changes: Lukkokohtainen versionosto 3.60 → 3.61 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. §1.4 master-vs-PhD-skooppisäännön mukaisesti v3.61:n sisältölisäys (kolmen pilarin × kolmen jurisdiktion suvereniteettitaksonomia sekä post-kvanttisalauksen overlay) on markkinasignaali / tieteellinen kehystys ja sijaitsee PHD_FIREHORSE_FI.md §14.23:ssa (Kolmen pilarin suvereniteettitaksonomia ja jurisdiktiokohtainen dynaamisuus globaaleissa yrityksissä) sekä Avainpanos #28:ssa; §1.2 PhD-tutkimuskysymykset on uudelleenrakennettu siten, että Suvereniteetti on kohta 1 (yhdistävä tutkimuslanka) ja §1.6 ohjaajakirje prof. Kari Smolanderille on päivitetty v3.61-versioon. Firehorse-toimintamallin toteutuspuolen ominaisuudet, jotka yhdistyvät tähän taksonomiaan (DWS6:n Aegis / Sovereign Infra / Connect -tuotesegmentointi `DWS_DEPLOYMENT_STANDARD.md` riveillä 165–172) ovat jo dokumentoituina tässä maisterityössä suvereniteettisegmentoinnin yhteydessä, eivätkä uudet toteutusosiot ole tarpeen. Tämä commit lisää uuden päättävän osion "Bibliografia (Oxford)", joka luettelee kanoniset lähteet, joihin tämä maisterityö viittaa, sekä lukukohtaisen indeksin osoittaen, mikä luku siteeraa mitäkin lähdettä (Oxford notes-bibliography -tyyli). Liiteartefaktit: docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md (bilingual EN+FI field note), onelifetime.world/posts/sovereignty-field-note-2-three-pillars.html (EN canonical) + .fi.html (FI mirror) landing-pages-peileineen, docs/sales/2026-05-28-rightful-oy-partnership-proposal.md, sekä Shufti-kumppanikirjeen päivitys.
- Version: 3.60 | Tool: Claude Code (claude-opus-4-7) | Session: claude/ai-services-audit-eY3rW | Date: 27.05.2026 | Changes: Lukkokohtainen versionosto 3.59 → 3.60 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.60:n sisältölisäys on palvelutason markkinasignaali (2026-05-04 muodostettiin 1,5 mrd dollarin tekoälynatiivinen yrityspalveluyhtiö — Anthropic 300 M$ + Blackstone 300 M$ + Hellman & Friedman 300 M$ + Goldman Sachs 150 M$ perustaja — joka kohdistuu keskikokoisiin yrityksiin Clauden käyttöönotossa ydintoiminnoissa; 2026-05-21 hankittiin Fractional AI operatiiviseksi keskukseksi, päättäen Fractionalin 11 kuukauden OpenAI-kumppanuuden), joka master-vs-PhD-skooppisäännön §1.4 mukaan kuuluu vain väitöskirjaan. Katso PHD_FIREHORSE_FI.md §14.22 (Malli-toimittajaan kohdistettu palvelutaso: Anthropic / Blackstone / Hellman & Friedman / Goldman Sachs -järjestelmä ja suvereeni-tulosperusteinen vastapositio) ja Avainpanos #27 (Malli-toimittajaan kohdistettu palvelutaso ja suvereeni-tulosperusteinen vastapositio) tieteellistä kehystystä varten, mukaan lukien kilpailuasemoinnin nostaminen KYA-konformanssipredikaatiksi, joka on testattavissa olemassa olevan nelirataisen ASB / EAB / CSB / SIB -sanaston kautta. Firehorse-toimintamallin toteutuspuolen ominaisuudet, jotka yhdistyvät tähän signaaliin (katalogiuudelleenpositiointi 8:lle punaisen alueen konsultointi-SKU:lle, kaksi uutta tulosperusteista SKU:ta AIS-EU-SOV-OC ja AIS-OUTCOME-PILOT, kahden `_OLD`-SKU:n poisto, kuuden puolustettavan sääntely-/suvereniteetti-SKU:n nostaminen featured-tilaan) on koodattu operatiivisesti `scripts/ai_services_audit_apply.py`:ään ja sovellettu `dws10.com/config/products.json`:iin sekä dual-folder-peilauskohteeseen samassa commit-setissä osana normaalia tuote-operointia; ne eivät vaadi uusia maisteri-osioita, koska katalogikerros on tuote-toteutusartefakti, joka on jo katettu olemassa olevassa toimintamallin kehystyksessä. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.59 | Tool: Claude Code (Opus 4.7) | Session: claude/unitree-robotics-story-Ggp7v | Date: 23.05.2026 | Changes: Lukkokohtainen versionosto 3.58 → 3.59 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.59:n sisältölisäys on markkinasignaali (Unitree Roboticsin kaupallinen profiili — humanoidit 5 900 $ vs. Boston Dynamicsin nelijalkainen 74 500 $, ~70 % maailmanlaajuisesta nelijalkaismarkkinasta, yli 7 000 humanoidia käyttöönotettuna yli 600 teollisuussijaintiin, ainoa kannattava humanoidivalmistaja maapallolla + 200 tunnin 249 000 paketin autonominen varastoajo + PLA-/Ukraina-aseistuskuvamateriaali ja House China Committee -kirje + dokumentoidut Go1/G1-turvallisuuslöydökset: oletustunnusten etätunneli, laivueenlaajuinen jaettu salausavain, Bluetooth-itsensäleviäminen, pakollinen 5 minuutin telemetria PRC-saavutettavaan infrastruktuuriin G1:llä), joka master-vs-PhD-skooppisäännön §1.4 mukaan kuuluu vain väitöskirjaan. Katso PHD_FIREHORSE_FI.md §14.21 (Kiinan humanoidisignaali: vertikaalisen integraation vallihauta, ruumiillistetun tekoälyn kaupallinen kypsyys ja turvallisuuden vs. suvereniteetin jännite) ja Avainpanos #26 (Vertikaalisen integraation vallihauta ja substraatin eheyden konformanssi ruumiillistetun tekoälyn toimintamalleissa) tieteellistä kehystystä varten, mukaan lukien uusi SIB-rata (Substraatin eheyden konformanssi), joka laajentaa KYA-standardin neljän radan sarjaksi ASB / EAB / CSB / SIB ja operatiivisesti määrittelee §14.13:n LWM-sekvensointistrategian Vaiheen 3 (fyysinen tekoäly) kelpoisuusominaisuuden. Firehorse-toimintamallin toteutuspuolen ominaisuudet, jotka yhdistyvät tähän signaaliin (KYA-sidottu agenttipopulaatio, laitteistotodennettu harness §14.12, LWM-sekvensointistrategia §14.13, omistetun-substraatin testialusta) on jo dokumentoitu tämän maisteritutkielman omissa luvuissaan eivätkä vaadi lisäyksiä — signaali validoi olemassa olevan toteutuskurin ja lisää standardikerroksen laajennuksen (SIB-rata), joka kuuluu PhD-tieteelliseen skooppiin pikemminkin kuin maisterin tuote-toteutusskooppiin. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.58 | Tool: Claude Code (Opus 4.7) | Session: claude/ai-pricing-enterprise-Cnzfu | Date: 21.05.2026 | Changes: Lukkokohtainen versionosto 3.57 → 3.58 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.58:n sisältölisäys on kysyntäpuolen markkinasignaali (Microsoft peruu sisäiset Claude Code -lisenssit token-laskutuksen vuoksi ~13 mrd $ OpenAI-omistuksesta ja Anthropic-laskentaa pyörittävästä Azure-kapasiteetista huolimatta; Uberin CTO-muistio — koko vuoden 2026 tekoälybudjetti kulutettu neljässä kuukaudessa; Yhdysvaltain tekoälyohjelmistojen hinnat +20–37 % H1 2026:ssa; GitHubin kiinteähintaiset suunnitelmat poistetaan käyttöperusteisen laskutuksen hyväksi Copilot/Codespaces/Actions-tuotteissa), joka master-vs-PhD-skooppisäännön §1.4 mukaan kuuluu vain väitöskirjaan. Katso PHD_FIREHORSE_FI.md §14.20 (Tekoälyn hinnoittelukapitulaatio: token-pohjaisen laskutuksen puristus ja omistetun laskennan käyttökustannuskuri) ja Avainpanos #25 (Kysyntäpuolen kapitulaatio ja agenttisen tekoälyn konformanssin kustannuspinnan-vakauden ulottuvuus) tieteellistä kehystystä varten, mukaan lukien uusi CSB-rata (Cost-Surface Stability käyttöönotossa), joka laajentaa EU:n tekoälysäädöksen artiklan 14 valvonnan laadusta kohtuuhintaisuus-vakaus-muuttujaan. Firehorse-toimintamallin toteutuspuolen ominaisuudet, jotka altistuvat tälle signaalille (Spark NVFP4 omistettu laskenta §10.10.6.1, prompt-välimuistiarkkitehtuuri, OpenClaw omistetulla raudalla, Proton-postilaatikko-per-agentti, monituottajareititys tehtävätietoisella malli-valitsijalla) on jo dokumentoitu tämän maisteritutkielman omissa luvuissaan eivätkä vaadi lisäyksiä — signaali validoi olemassa olevan toteutuskurin sen sijaan, että käynnistäisi uuden tuotetyön. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.57 | Tool: Claude Code (Opus 4.7) | Session: claude/multi-agent-ai-alignment-F2NIO | Date: 17.05.2026 | Changes: Lukkokohtainen versionosto 3.56 → 3.57 kaikkien 4 opinnäytetyötiedoston yli CLAUDE.md:n opinnäytetyösäännön mukaan. Ei sisältömuutosta tässä maisteritiedostossa: v3.57:n sisältölisäys on markkinasignaali ja standardointi-signaali (Shapira et al. "Agents of Chaos" arXiv:2602.20021 + Emergence AI "Emergence World" world.emergence.ai → KYA-standardi falsifioitavuuden ankkurina), joka master-vs-PhD-skooppisäännön §1.4 mukaan kuuluu vain väitöskirjaan. Katso PHD_FIREHORSE_FI.md §14.19 (Moniagenttisten järjestelmien emergentti väärinkohdistus ja kannustinten suunnittelu kohdistuksen yksikkönä) ja Avainpanos #24 tieteellistä kehystystä varten. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.56 | Tool: Claude Code | Session: claude/compare-qwen-deepseek-E6Gly | Date: 16.05.2026 | Changes: Lisätty §10.10.6.1 (Laitteistollisen Brainin päivitys — toukokuu 2026), joka dokumentoi Spark Primary tierin vaihdon `llama3.3:70b`:stä `nemotron-3-super`:iin (~4,5× dekoodausnopeus, MoE 123,6B / 12,7B aktiivisia, Mamba-2 + attentio + Latent MoE, NVFP4-esikoulutettu), Fast tierin päivityksen `qwen2.5-coder:32b`:stä `qwen3-coder:30b`:hen, sekä OpenClawn lisäämisen ensiluokkaiseksi compose-palveluksi EU-suvereeneille no-egress agenttityökuormille. Toteutusartefaktit viitattu: kenttämuistio 2026-03-29 v1.6, DWS_DEPLOYMENT_STANDARD.md v1.4, docker-compose.yml, DWS7_ROADMAP.md PR 161 uudelleenperustus. Markkinasignaaliperustelu (laskentaniukkuus, NVFP4-laitteistovallihauta) viitattu PHD_FIREHORSE_FI §14.18:aan master-vs-PhD-skooppisäännön §1.4 mukaisesti. Kaikki 4 opinnäytetyötiedostoa nostettu v3.56:een lukitusti CLAUDE.md:n ohjeen mukaan. `Learn/`-HTML-uudelleengenerointi tarvitaan (ei tässä committissa — vaatii Pandoc-buildin).
- Version: 3.55 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: main | Date: 11.05.2026 | Changes: Versiopäivitys 3.54 -> 3.55 lukitussa 4 opinnäytetyötiedoston ketjussa; VERSION AND AGENT HISTORY -lohkon sulkeva erotin korjattu muotoon \*\*\*; Learn-kansion opinnäytetyön HTML-julkaisut generoitu v3.55-muotoon
- Version: 3.54 | Tool: Claude Code (Sonnet 4.6) | Session: main | Date: 10.05.2026 | Changes: Lisätty §1.4 Sisältörajaus — maisteriopinnäytetyö on tuote/toteutuslähtöinen, ei sisällä markkinatietoa eikä pitkän aikavälin tiekarttaa; rajaus kirjattu CLAUDE.md:hen ja peilattu kaikkiin 4 opinnäytetyötiedostoon; väitöskirjan eriytyminen formalisoitu; versionosto rinnakkain CLAUDE.md:n ohjeen mukaan
- Version: 3.53 | Tool: Claude Code (Sonnet 4.6) | Session: main | Date: 10.05.2026 | Changes: Lisätty agenttien vastuullisuus- ja havainnointitaso uutena avainpanoksena: AgentLogger (jäsennelty JSONL + ei-blokkaava Supabase agent_executions), AgentVersionRegistry rollback-tukea varten, drift-detector.ts päivittäisten luottamuspisteiden laskuraportteja varten, eval-runner.ts noudattamisaineistojen pisteytystä varten — toteuttaa suoraan EU:n tekoälysäädöksen artiklojen 9 (riskinhallinta), 12 (lokitus) ja 14 (ihmisvalvonta) vaatimukset tuotantokoodina; Baseten lisätty OpenAI-yhteensopivaksi LLM-tarjoajaksi laajentaen monituottajareititystä Groq/Baseten/OpenAI-vaihtoehtoihin tehtävätietoisella model-selector-valinnalla; /case-run-taito rekisteröity (Themis v2.0 case-coordinate-toiminto, Legora AOS -kilpailuanalyysi DWS Case -entiteetin tiekartalla); Outokumpu CBAM -kumppanuusmalli ensimmäisenä teollisuusostaajan vaatimustenmukaisuuskustannusten kvantifiointitapauksena; TokenSpeed-inferenssimoottori (LightSeek MIT, DGX Spark -sopivuusarvio); kaikki 4 opinnäytetyötiedostoa nostettu rinnakkain CLAUDE.md:n ohjeen mukaan
- Version: 3.52 | Tool: Claude Code (Opus 4.7) | Session: claude/update-thesis-ontology-blog-3RGKG | Date: 29.04.2026 | Changes: Lisätty luku 1.6 "Ontologia — etymologia ja filosofinen tausta", joka linkittää opinnäytetyön ONTOLOGY.md v1.3 -dokumenttiin (kreikan ón + lógos, Aristoteles, skolastiikan 1600–1700-luvun systematisointi, nykyinen tietojenkäsittelytieteen merkitys). Yhdenmukaistaa terminologian DWS Ontology Standardin kanssa. Kaikki 4 opinnäytetyötiedostoa nostettu lukon mukaisesti CLAUDE.md:n ohjeen mukaan.
- Version: 3.51 | Tool: Claude Code (Haiku 4.5) | Session: claude/sync-version-numbering-adEeB | Date: 28.04.2026 | Changes: Bumped from 3.39 to 3.51 (12 steps × 0.01). Unified thesis version track maintained. Created new Tutkimussuunnitelma_3.51.md (Research Plan) with three research streams (KYA standardization, DWS 7 empirical testbed, dual-use industries), eight research questions, "Human in Command ja Human in Loop" governance framework; versioning format rule (.X9 → .X+1,0) documented for DWS_DOCUMENT_STANDARD.md §5
- Version: 3.39 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Terminology rename — "Aiven overlay" / "Aiven layer" (deprecated infrastructure labels) → "Article 12 Logging Pipeline" per new DWS_ARTICLE_12_LOGGING_STANDARD.md v1.0 (unified 3-tier canonical term). Aiven remains the correct name for the Postgres SaaS. All 4 thesis files bumped in lockstep per CLAUDE.md thesis rule; only V3Thesis_EN had the infra-context string in content
- Version: 3.38 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Typo correction — "Aiwen" → "Aiven" (Aiven.io is our Helsinki Postgres partner) as part of repo-wide sweep of 116 files; no content change beyond the spelling fix; unified version track preserved (all 4 thesis files bumped in lockstep per CLAUDE.md thesis rule)
- Version: 3.37 | Tool: Claude Code (Opus 4.7) | Session: claude/rename-godagents-skilled-dXqBs | Date: 22.04.2026 | Changes: Lisätty osio 10.22 (DWS Skilled -taksonomia — kolme tasoa agenteille, työnkuluille ja jurisdiktioille); "GodAgent"/"Godagent"-brändäys poistettu käytöstä; kodifioitu `Skilled <Akseli>` / `Industrial Specialist <Akseli>` / `Industry <Akseli>` -kolmitasomalli kolmelle aktiiviselle akselille (Agentit, Työnkulut, Jurisdiktiot — EU/US/Aiven); malli suunniteltu laajennettavuuden tähden tuleville kyvykkyysakseleille (Datasets, Models, Regulations, Reports); lisätty lukumäärien dynamiikkakaavat (avoin `18+`, rekisteriankkuroitu, tuotekohtainen); kodifioidut poikkeukset (Docker/infra-tunnisteet, Pantheon kreikkalaismyyttinen brändi, historialliset tietueet); kanoninen lähde `docs/Deputy-Agents-Architecture.md` §1 Terminologia; lisätty avainpanos #31
- Version: 3.36 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: f2a5b1e0-a01c-489a-8d33-fde09a7dd970 | Date: 21.04.2026 | Changes: Täydennetty osio 10.21 Boardy-huomioilla: KYA open source -standardipolku Agentic AI Foundation / Linux Foundation -reitille, NIST-hakemuksen tila (ei lähetetty), Artikkeli 1 tarkka otsikointi, 2026-2029 julkaisuvaiheistus, EIC Step 1 -deliverable-kytkentä tutkimusohjelmaan; lisätty avainpanos #30
- Version: 3.35 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: f2a5b1e0-a01c-489a-8d33-fde09a7dd970 | Date: 21.04.2026 | Changes: Lisätty osio 10.21 (tohtoripolun kohdennus): KYA Agentic AI Foundation -linjaus, DWS 7 -tavoitteet, DWS 5 -> vetytalousjatkumo, dual-use-toimialat ja Nokia Defence -keskustelut, Aegis/Sovereign Infra/Connect -suvereniteettisegmentointi (kuva), Siemens- ja NVIDIA Connect -yhteistyöankkurit sekä Kari Smolanderille kohdistettu vastauskirjeen runko; lisätty avainpanos #29
- Version: 3.34 | Tool: Claude Code (Opus 4.7) | Session: claude/update-thesis-work-EoyoF | Date: 20.04.2026 | Changes: Lisätty osio 10.20 (Huhtikuun 2026 kehitys) — neljä alaosiota: Anthropicin Skills-paradigman ulkoinen validointi (vahvistaa §10.13 taito-ensin -arkkitehtuurin), Lifetime Fleet -tiekartan kiteytyminen (Suomen dronestrategia 2030 + Baltia-ensin 12–16 vk MVP, "Kädet"-kerros siirtyy spesifikaatiosta aikatauluun), DWS IQ 7 Datakeskusten vaatimustenmukaisuusagentti (22. toimiala, RFNBO-delegoitu asetus 2023/1184 vihreän vedyn lisäisyysvaatimus), sääntelypinon laajennus NIS2:een ja CER:iin (Hybridiosaamiskeskus 8.5.2026, CORE-resilienssimalli) sekä perustajan→tiimin siirtymä (SOLO_FOUNDER_STATEMENT v1.2, CTO-yhteisrakentaja, /investor-outreach -taito, 10+ INTRO-muistiota); lisätty avainpanokset #25–#28
- Version: 3.33 | Tool: Claude Code (Opus 4.6) | Session: claude/add-red-hat-partners-d8Hey | Date: 21.03.2026 | Changes: Lisätty Red Hat -avainlöydösten markkinadata alustatalouteen (§2.2), inferenssimuutoksen validointi reunalaskentaan (§2.4), Red Hat AgentOps -kumppanuus strategisiin kumppanuuksiin (§10.12.2), päivitetty SWOT-mahdollisuudet $644B markkinalla ja inferenssimuutosdatalla
- Version: 3.32 | Tool: Claude Code (Opus 4.6) | Session: claude/review-claude-skills-vZQ0r | Date: 03.04.2026 | Changes: Lisätty osio 10.19 (Opinnäytetyön versiointistrategia: v3.30.50 Metropolia-jäädytys); lisätty avainpanos #23; luotu jäädytetty V3Thesis_EN_v3.30.50.md (50-sivuinen Metropolia-versio) säilyttäen 82-sivuinen elävä dokumentti; päivitetty alatunniste kaksoisversioarkkitehtuurilla
- Version: 3.31 | Tool: Claude Code (Opus 4.6) | Session: claude/review-claude-skills-vZQ0r | Date: 31.03.2026 | Changes: Päivitetty osio 10.13.3 (Taitojen inventaario 6→21 taitoa, 4 aliagenttia, 4 kurinpitotaitoa); lisätty osio 10.13.7 (Kilpailija-analyysi: Toimialakohtainen vs geneerinen AI-harness — vertailu ECC 136-taidon kehykseen, kuusi kilpailuetua dokumentoitu); lisätty avainpanos #22
- Version: 3.30 | Tool: Claude Code (Opus 4.6) | Session: claude/research-leworldmodel-r3VRA | Date: 25.03.2026 | Changes: Lisätty osio 10.18 (LWM-sekvensointistrategia — Sääntely-älykkyydestä fyysiseen tekoälyyn): kolmivaiheinen sekvensointi (vaatimustenmukaisuus→laivasto→Series A), LeWorldModel-validointi (arXiv:2603.19312), Phase 2 teknisen aukon analyysi, Persefoni/Sweep-vertailuarvot; lisätty avainpanos #21
- Version: 3.29 | Tool: Claude Code (Opus 4.6) | Session: claude/add-debit-credit-compliance-FevOa | Date: 24.03.2026 | Changes: Lisätty osio 10.17 (Johtopäätökset: Hiilitase vaatimustenmukaisuusinfrastruktuurina) — kahdenkertaisen kirjanpidon malli CO2:lle ETS/CBAM/CSRD/Taksonomiassa, poikkitoimialainen älykkyys kirjanpitojen kautta, DWS 7 Phase 2.6 toteutussuunnitelma; lisätty avainpanos #20
- Version: 3.28 | Tool: Claude Code (Opus 4.6) | Session: claude/agent-memory-fact-extraction-gLEss | Date: 23.03.2026 | Changes: Lisätty osio 10.10.7 Agenttimuistin faktojen poimintaputki (PR-254): LLM-pohjainen strukturoitu faktojen poiminta keskusteluista subjekti-predikaatti-arvo -kolmikoihin, kaksoismuistiarkkitehtuuri (LWM domainitieto + asiakassuhdemuisti), kolme puuttuvaa suorituskerrosta tunnistettu (Firehorse-tilakonemasiina, ERP-liitin, KYA-hallintakehys); päivitetty PR-tiekartta KYA-ensisijaisuusjärjestyksellä; lisätty avainpanos #20; huomioitu KYA Standard v1.4 sisäinen / v1.1 julkinen ero
- Version: 3.27 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Lisätty osio 10.7.3 LWM:n tuotemarkkinavalidointi (Qantic GmbH energiasektorin tapaustutkimus — ensimmäinen ulkoinen validointi LWM:n kaupallisesta arvosta rakennusalan ulkopuolella, 21 693 €/vuosi BESS-vaatimustenmukaisuuskustannuslaskelma, 6 toimialan laajennuspolku MAN-tyyppisille asiakkaille, Solution Factory -malli vahvistettu); päivitetty 16→20 toimialaa LWM-osioissa; uudelleennumeroitu 10.7.3→10.7.4 Orchestration Studio
- Version: 3.26 | Tool: Claude Code (Opus 4.6) | Session: claude/refine-thesis-critique-RP6Dv | Date: 16.03.2026 | Changes: Päivitetty osio 8 Tulokset ja analyysi v3.16–3.25 todisteilla: harness engineering -mittarit (52,8%→66,5%), 13 agentin Pantheon-järjestelmä, asiakkaiden MVP-ominaisuudet (API-avaimet, mittarointi, raportit), PostgreSQL HTAP -arkkitehtuuri, A/B-testauksen tulosten integrointi, päivitetty vaatimustenmukaisuusvalmius (EU AI Act Art 12 toteutettu), päivitetty SWOT strategisilla kumppanuuksilla; lisätty uusi osio 8.7 A/B-testauksen ja palautekanavien tulokset
- Version: 3.25 | Tool: Claude Code (Opus 4.6) | Session: claude/add-harness-engineering-thesis-2zvZt | Date: 14.03.2026 | Changes: Lisätty osio 10.16 (Harness Engineering — promptisuunnittelusta järjestelmäsuunnitteluun): OpenAI:n 8 periaatetta, DWS IQ 6 vertailu 6-kerroksisella L0-L6-arkkitehtuurilla, empiirinen tulos (52,8%→66,5% pelkällä harness-parannuksella), EU-regulaatio vaatii erilaisen harnessin; lisätty avainpanos #19
- Version: 3.24 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Laajennettu Liite G sanasto: Tietoarkkitehtuuri (9 termiä) ja Tutkimusmenetelmät (4 termiä) — autotutkimus, HTAP, Hypercore, kaksitasoinen arkkitehtuuri, KYA, proxy-to-scale
- Version: 3.23 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 13.03.2026 | Changes: Päivitetty osio 10.15 Aiven-first mandaatilla: Hydra→Supabase Warehouse (helmi 2026), pg_mooncake→Databricks (loka 2025), TimescaleDB 2.25.x Hypercore hyväksyttynä standardina, Aiven-sallittujen listalla pg_duckdb ESTETTY, kaksitasoinen HTAP (Aiven hallittu + GN100 reuna), reunatietokanta käyttöönotettu; lisätty Keskeiset löydökset #18; päivitetty alatunniste
- Version: 3.22 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Lisätty osio 10.15 (PostgreSQL-sarakemuotoinen HTAP-arkkitehtuuri — DWS-tietostandardi): pg_duckdb + TimescaleDB Aiven EU:ssa yksitietokantaiseen HTAP:iin, 4-vaiheinen käyttöönotto, DWS_DATA_STANDARD.md luotu, EU-sääntelynmukaisuusmatriisi (GDPR, EU AI Act Art 12, NIS2, CSRD, EU Data Act 2023/2854); lisätty avainpanos #17; päivitetty alatunniste
- Version: 3.21 | Tool: Claude Code (Opus 4.6) | Session: claude/vigorous-meitner | Date: 09.03.2026 | Changes: Lisätty osio 10.14 (Agenttijärjestelmän koventaminen — tuotantoluotettavuus): 6 TypeScript-kääntövirhettä korjattu, 3 testivikaa ratkaistu, SandboxContext-tyyppilinjaus opensandbox-vaiheen kanssa, MCP/HIL-reitityksen kytkentä, lokaalivarma numeromuotoilu, riippuvuushygienia (luxon); lisätty avainpanos #16; päivitetty alatunniste
- Version: 3.20 | Tool: Claude Code (Opus 4.6) | Session: claude/build-mvp-features-nFk7k | Date: 08.03.2026 | Changes: Lisätty avainpanos #15 (Asiakaskeskeiset MVP-ominaisuudet — API-avainten hallinta, käyttömittarointi 3-tasoisella laskutuksella, vaatimustenmukaisuusraporttien vienti aikataulutuksella); osoittaa siirtymän kehittäjätyökaluista asiakasvalmiiksi SaaS-alustaksi; validoi Solution Factory -tuotteistamishypoteesin
- Version: 3.19 | Tool: Claude Code (Opus 4.6) | Session: claude/happy-rhodes | Date: 07.03.2026 | Changes: Laajennettu osio 2.5.3 MCP Hub -orkestrointimallit toteutustiedoilla (4 mallia: Fan-Out, Sequential, Reflection, Pipeline), päätepisteet, kontekstin välitys, tuotantovalmiustaulukko; lisätty osio 2.5.4 Skillit ja CLI:t agenttirajapintoina (kolmen rajapinnan sääntö: CLI + MCP + skillit)
- Version: 3.18 | Tool: GitHub Copilot (Claude Opus 4.6) | Session: Learn-Thinking | Date: 04.03.2026 | Changes: Lisätty osio 9.5 Learn Thinking (oppimisajattelu) — päivittäinen oppimissilmukka Learn/-kansion kautta, opinnäytetyötiedostot lisätty Generate-PDFs-putkeen, reflektiivinen oppimiskehys tekoälyavusteiselle tuotekehitykselle
- Version: 3.17 | Tool: Claude Code (Sonnet 4.6) | Session: claude/implement-workflow-agents-CHFFN | Date: 02.03.2026 | Changes: Lisätty osio 10.13 (Climate IQ Pantheon — kreikkalais-roomalainen moniagenttijärjestelmä: 6 orkestraattoria + 7 toimialaerityistä agenttia, SOUL.md-identiteettimalli, prompt injection -korjaus, EU AI Act artikla 12 -lokituki); lisätty avainpanos #12; päivitetty alatunniste
- Version: 3.17 | Tool: Claude Code (Sonnet 4.6) | Session: claude/organize-repo-structure-F3xqn | Date: 02.03.2026 | Changes: Lisätty osio 10.13 (Claude Code -suunnittelurakenne: tekoälytyönkulku ensiluokkaisena ohjelmistokomponenttina) — CLAUDE.md projektimuistina, taidot uudelleenkäytettävinä työnkulkukomponentteina, koukut automatisoituna laadunvalvontana, aliagentit rinnakkaissuoritukseen; lisätty avainpanos #12; päivitetty alatunniste; validoitu kehittyvää Claude Code -yhteisön parhaita käytäntöjä vastaan
- Version: 3.16 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: KONSOLIDOITU — ratkaisee versioajautumisen 3.12-3.15. Lisätty osio 10.11 (Toimitusjohtajan automaatioagenttiryhmä: Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor); osio 10.12 (Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI, Mistral + Monituottaja-LLM-reititin); lisätty avainpanokset #10-11; päivitetty alatunniste
- Version: 3.15 | Tool: Cursor AI / Claude Code | Session: [seuraamaton] | Date: 25-27.02.2026 | Changes: [SEURAAMATON AJAUTUMINEN] DWS6→DWS7 siirtymädokumentaatio; CLAUDE.md tiivistys; session handover; ZenFree; Resend
- Version: 3.14 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: [TALLENNETTU versiossa 3.11] OpenSandbox Vaihe 1.5 + EMPO²
- Version: 3.13 | Tool: Claude Code (Opus 4.6) | Session: claude/dws6-dws7-update-doc-I2Cgk | Date: 27.02.2026 | Changes: [SEURAAMATON AJAUTUMINEN] Strategiset kumppanuudet; monituottaja-LLM-reititin
- Version: 3.12 | Tool: Claude Code (Opus 4.6) | Session: claude/ai-agent-orchestration-t89Ig | Date: 24.02.2026 | Changes: [SEURAAMATON AJAUTUMINEN] Toimitusjohtajan automaatioagenttiryhmä (3 agenttia)
- Version: 3.11 | Tool: Claude Code (Sonnet 4.6) | Session: claude/sandbox-agents-opensandbox-HatfC | Date: 01.03.2026 | Changes: Lisätty osio 10.10 (Agent Foundry Vaihe 1.5 — OpenSandbox Acer Veriton GN100 -laitteella); lisätty EMPO²-viite (arXiv:2602.23008 — hybridi on/off-policy RL muistia hyödyntäville agenteille); päivitetty NCC Hiekkalaatikko-vaihe; lisätty avainpanos #9
- Version: 3.10 | Tool: Claude Code (Opus 4.6) | Session: claude/modernize-dws7-77v2B | Date: 24.02.2026 | Changes: Lisätty osio 10.9 DWS7 agenttiarkkitehtuurin modernisointi — dokumentoi 6 kriittistä korjausta (agenttisilmukat, työkalujen käyttö, monituottaja-LLM, agenttien delegointi, MCP-palvelin, tapahtumaväylä), Build for Agents -periaate (CLI, Claude Code Skills), agenttikeskeinen tuotesuunnittelufilosofia
- Version: 3.9 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Parannettu LWM-määritelmä yrityksen oppimiskerroksena (hienosäätää dataa/sääntelyä, optimoi markkina-arvon, varmistaa kilpailuedun), lisätty 20 toimialan ristioppimisen verkostovaikutusten analyysi
- Version: 3.8 | Tool: Claude Code (Opus 4.6) | Session: claude/add-sdk-sandbox-isolation-Q0lzp | Date: 21.02.2026 | Changes: Lisätty osiot 10.6 Toimialakohtainen avoimen LLM:n valinta (20 toimialaa, 7 ehdokasmallia), 10.7 Yrityksen BYOA-arkkitehtuuri (Tuo omat agentit — NCC-skenaario, 24 agenttia, Langflow+React Flow+Temporal.io graafinen työnkulkurakentaja, urakoitsija-agentin käyttöönotto)
- Version: 3.7 | Tool: Claude Code (Opus 4.6) | Session: HIL-PR-Automation | Date: 20.02.2026 | Changes: Lisatty Liite H — Automatisoitu PR-tyonkulku (HIL-automaatio): kaksoismallin AI-katselmointi (Claude + Gemini), Copilot-korjaussilmukka, automaattiyhdistamistyonkulku, MCP Hub Gemini-paatepiste, Cloud Run dws6run6 -kayttoonotto. Generoitu versioidut HTML-tiedostot Learn/-kansioon
- Version: 3.6 | Tool: Claude Code (Opus 4.6) | Session: e5wXD | Date: 20.02.2026 | Changes: Paivitetty DWS-standardit, admin-manuaalit HIL-automaatioviittauksilla. Versiotunnuksen korjaus (3.4-3.5 eivat olleet seurannassa)
- Version: 3.5 | Tool: Claude Code (Opus 4.6) | Session: e7fe405 | Date: 20.02.2026 | Changes: Lisatty osio 12 IPR-suojaus ja liikesalaisuusstrategia, osio 13 Prompt caching -arkkitehtuuri AI-agenteille, uudelleennumeroitu osiot 12-15 → 14-17, lisatty EU:n liikesalaisuusdirektiivin viitteet
- Version: 3.4 | Tool: Cursor AI (Claude Sonnet 4.6) | Session: 278819d | Date: 18.02.2026 | Changes: Yrityksen nimimuutos Lifetime Consulting Oy → Lifetime Oy kaikissa dokumenteissa (Omnibus_Fit55-analyysitiedostot)
- Version: 3.3 | Tool: Claude Code (Opus 4.6) | Session: V3-Merge | Date: 10.02.2026 | Changes: Yhdistetty Thesis_FI.md (v2.1) ja V2Thesis_FI.md (v3.2) yhdeksi kokonaisversioksi. Korjattu skandinaaviset merkit, päivitetty tunnistetiedot, lisätty DWS10-verkkokauppa-, äänichat- ja HIL-putkiosiot, Karpathy-liite, Firehorse-toimintamalliosiot
- Version: 3.2 | Tool: Claude Code (Opus 4.6) | Session: HIL-Pipeline | Date: 07.02.2026 | Changes: Lisätty osio 6.7 - Ihminen-silmukassa-oppimisputki (päivittäinen automaatio, kolmikerroksinen varmuuskopiointi, Learn/-kansion tuloste)
- Version: 3.1 | Tool: Claude Code (Opus 4.5) | Session: Karpathy-Principles | Date: 04.02.2026 | Changes: Lisätty Liite E - Tekoälyagenttien toimintaohjeet (Karpathyn periaatteet), EU:n tekoälysäädöksen vaatimustenmukaisuuskartoitus, toteutuksen tulosmittarit
- Version: 3.0 | Tool: Claude Code (Opus 4.5) | Session: DWS10-Store-Integration | Date: 28.01.2026 | Changes: Lisätty DWS10.com verkkokaupan löydökset, Google Merchant Center -integraatio, Revolut Business -maksut, Äänichat-kehityssuunnitelma Groq/Llama-malleilla, Toimialan hiilijalanjälkilaskuri, EU-vaatimustenmukaisuuskartoitus
- Version: 2.2 | Tool: Word (HIL) | Session: dws6.com Google Run | Date: 19.01.2026 | Changes: Google admin@dws6.com sekä projekti Google alle. Perustettu 19.1.2026. Google Workspace Standard otettu käyttöön. Vaihdettu DNS-tiedot Proton → Google. Luotu projekti dws6run joka tulee palvelemaan Google Run -prosesseja.
- Version: 2.1 | Tool: Cursor AI (Claude) | Session: 16-Industries | Date: 06.01.2026 | Changes: Lisätty Fit for 55:n 16 teollisuudenalan analyysi, AI-käytön ilmoitus, DWS10-käyttötapaukset, laajennettu nykytila-analyysi
- Version: 2.0 | Tool: Cursor AI (Claude) | Session: Thesis-Revision | Date: 05.01.2026 | Changes: Suuri revisio - Lisätty Solution Factory -malli, AgentFoundry-dokumentaatio, Lifetime Scope Signals -teoria, SWOT-analyysi, tutkimuskysymysten vastaukset, täydellinen teoreettinen viitekehys
- Version: 1.0 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Applied DWS document standard, synchronized with English version

Session Links & References:

- Claude Code (2026-02-10): V3-yhdistäminen ja skandinaavisten merkkien korjaus
- Claude Code (2026-01-28): DWS10-kaupan integraatio, Google Merchant, Revolut, Äänichat-suunnitelma
- Cursor AI (2026-01-05): Opinnäytetyön revisio integroiden koodikannan todisteet
- GitHub Copilot (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/metropolia/master-thesis/fi/V3Thesis_FI.md

Document Status:

- Created: 30.12.2025
- Last Modified: 21.04.2026
- Language: Finnish
- Languages Available: English, Suomi
- Publication Status: DRAFT (V3.36 — KYA open source -standardipolku, NIST-tilanne, Artikkeli 1 tarkennus, julkaisuvaiheistus)

---

**Opinnäytetyö**
**Metropolia Ammattikorkeakoulu**

**Tekijä:** Risto Anton Päärni
**Koulutusohjelma:** Smart Factory, YAMK
**Ohjaaja:** Jarno Varteva (mukana Erkki Räsänen)
**Yritys:** Lifetime Oy (Firehorse-brändi)
**Päivämäärä:** 16.1.2026
**InvestEU Portal:** Projekti Lifetime World, DWS IQ 6, Firehorse (INPO-20254383) jätetty julkaistavaksi InvestEU-portaaliin 25.12.2025 — InvestEU Portal Team, Euroopan komissio

---

## Tiivistelmä

Tämä opinnäytetyö tutkii Firehorse-tuotevalmistuksen toimintamallia, joka yhdistää pilvi- ja reunalaskentateknologiat teollisten pk-yritysten tarpeisiin. Työ keskittyy rakennusteollisuuteen ja sen haasteisiin EU:n kaksoissiirtymässä (digitaalinen + vihreä). **Versio 3.0 laajentaa tutkimusta verkkokauppavalidoinnilla DWS10.com-kaupan toteutuksen, Google Merchant Center -integraation, Revolut Business -maksukäsittelyn ja äänichat-kehityssuunnitelman kautta Groq-inferenssiä ja Llama-malleja käyttäen.**

**Avainsanat:** Tekoäly, reunalaskenta, rakennusteollisuus, toimintamalli, pilvipalvelut, verkkokauppa, Google Merchant Center, Revolut Business, äänichat, EU:n tekoälysäädös

---

## Abstract

This thesis examines the Firehorse product manufacturing operating model, which combines cloud and edge computing technologies for industrial SMEs. The work focuses on the construction industry and its challenges in the EU's twin transition (digital + green). **Version 3.0 extends the research with e-commerce validation through DWS10.com store implementation, Google Merchant Center integration, Revolut Business payment processing, and an audio chat evolution roadmap using Groq inference with Llama models.**

**Keywords:** Artificial Intelligence, Edge Computing, Construction Industry, Operating Model, Cloud Services, E-Commerce, Google Merchant Center, Revolut Business, Audio Chat, EU AI Act Compliance

---

## Tekoälytyökalujen käyttö

Tämän opinnäytetyön laatimisessa on hyödynnetty tekoälyavusteisia työkaluja läpinäkyvyyden ja akateemisen rehellisyyden mukaisesti.

**Käytetyt työkalut:**

- **Claude Code (Anthropic Opus 4.5/4.6)** — DWS10-verkkokaupan integraatio, dokumentaation generointi, V3-yhdistäminen
- **Claude (Anthropic)** — Tekstin muokkaus, rakenteen tarkistus, kieliasun parantaminen
- **Cursor AI** — Koodin dokumentointi, teknisten osioiden validointi
- **GitHub Copilot** — Koodiesimerkit, tekninen dokumentaatio

**AI:n rooli dokumentaatiossa:**

- Kieliasun tarkistus ja parannusehdotukset (FI/EN)
- Teknisen dokumentaation jäsentely ja yhdenmukaistaminen
- Käännösapu suomi-englanti
- Taulukkojen ja diagrammien formatointi
- Verkkokaupan ylläpitokäsikirjojen generointi

**Tekijän alkuperäinen panos:**

- Kaikki tutkimuskysymykset, hypoteesit ja johtopäätökset
- Alkuperäinen sisältö, argumentaatio ja analyysi
- Live-koodikanta ja toteutus (dws6-repositorio: 50 000+ LOC)
- Liiketoimintamallin suunnittelu ja validointi
- Asiakashaastattelut ja data (Uber, Bolt, Kela — €10k MRR)
- Solution Factory -mallin ja AgentFoundry-arkkitehtuurin kehitys
- DWS10.com-verkkokaupan tuotekatalogi ja integraatiot

**Todisteaineisto:**

- Git-versiohistoria: [github.com/blogtheristo/dws6](https://github.com/blogtheristo/dws6)
- Live-asiakasvalidointi: €10 000+ MRR
- Toimiva järjestelmä: DWS10.com, DWS6.com, onelifetime.world, lifetime.fi
- Google Merchant Center: Tili 8496329, 30 tuotetta hyväksytty

---

# Sisällysluettelo

1. [Johdanto](#1-johdanto)
2. [Teoreettinen viitekehys](#2-teoreettinen-viitekehys)
3. [Nykytila-analyysi](#3-nykytila-analyysi)
4. [DWS6-toimintamallin suunnittelu](#4-dws6-toimintamallin-suunnittelu)
5. [Toteutus (MVP-vaihe)](#5-toteutus-mvp-vaihe)
6. [DWS10.com-verkkokaupan integraatio](#6-dws10com-verkkokaupan-integraatio)
7. [Äänichat-kehityssuunnitelma](#7-äänichat-kehityssuunnitelma)
8. [Tulokset ja analyysi](#8-tulokset-ja-analyysi)
9. [Pohdinta](#9-pohdinta)
10. [Johtopäätökset](#10-johtopäätökset)
11. [Lähteet](#11-lähteet)
12. [Liitteet](#12-liitteet)

---

# 1. Johdanto

## 1.1 Tausta

Eurooppalaiset teollisuuden pk-yritykset kohtaavat "kaksoissiirtymän" haasteen:

- **Digitaalinen muutos**: AI, automaatio, reaaliaikainen päätöksenteko
- **Vihreä siirtymä**: EU Fit for 55 (55% päästövähennys vuoteen 2030 mennessä), sisältyvän hiilen mittausvaatimukset vuoteen 2028 mennessä

Perinteiset SaaS-alustat epäonnistuvat, koska ne:

1. Maksavat €1 400+/kk (liian kalliita pk-yrityksille)
2. Vaativat vain pilvipohjaiset arkkitehtuurit (korkea latenssi, korkeat käyttökustannukset)
3. Eivät käsittele toimialakohtaisia compliance-työnkulkuja

**Firehorse (DWS6)** ratkaisee tämän uudella toimintamallilla, joka yhdistää:

- AI-avusteisen kehityksen (Cursor Pro + Claude Code Max, 15 viikon MVP)
- Edge AI (NVIDIA Jetson) <100ms päättelylle
- Toimialakohtaiset AI-agentit (Rakentaminen, Valmistus, Energia)
- Vaiheittainen käyttöönotto (Hiljainen pilotti → Neuvonantaja → Autonominen)
- **Verkkokauppavalidointi DWS10.com:n, Google Merchant Centerin ja Revolut Businessin kautta** [V3.0]

## 1.2 Tutkimusongelma

**Päätutkimuskysymys:**
Miten AI-avusteisesti kehitetty teollinen AI-alusta voi saavuttaa tuote-markkinasopivuuden hybridi pilvi-edge-toimintamallin kautta säilyttäen samalla <€400/kk käyttökustannukset?

**Alatutkimuskysymykset:**

1. **Tuote ja liiketoimintamalli:** Miten kehitetään asiakaslupaus, joka ratkaisee todellisen ongelman ja skaalautuu kansainvälisesti?

2. **Teknologia:** Miten rakennetaan digitaalinen, skaalautuva palvelutuote, joka toimii pilvi + edge + verkkokauppa?

3. **Teknisten ratkaisujen evaluointi:** Mikä tekninen ratkaisu parhaiten tukee liiketoimintatavoitteita?

4. **Yritysturvallisuus:** Miten varmistetaan NIS 2, EU AI Act, GDPR ja Cybersecurity Act -vaatimustenmukaisuus?

5. **Verkkokauppavalidointi:** Miten automatisoitu kauppa tekoälyavusteisilla toiminnoilla voi validoida tuote-markkinasopivuuden? [V3.0]

## 1.3 Työn tavoitteet

1. Dokumentoida Firehorse-toimintamalli (MVP → V1)
2. Validoida kustannustehokas kehitysmalli (Cursor Pro + Claude Code Max)
3. Mitata asiakashyöty (≤2kk takaisinmaksuaika)
4. Luoda toistettava malli muille teollisuuden startup-yrityksille
5. **Validoida verkkokauppakanava Google Merchant Center -integraatiolla** [V3.0]

## 1.4 Rajaukset

- **Toimiala:** Rakennusteollisuus (3,5M yritystä Euroopassa) + 15 muuta EU-toimialaa
- **Markkina:** Pohjoismaat + Keski- ja Itä-Eurooppa
- **Aikajänne:** MVP-vaihe (joulukuu 2025 - helmikuu 2026)
- **Asiakkaat:** 5 pilottiasiakasta (€10-100M liikevaihto)
- **Verkkokauppa:** 30 tuotetta alusta-, ohjelmisto- ja palvelukategorioissa [V3.0]

### Sisältörajaus (v3.55)

Tämä opinnäytetyö on **tuote- ja toteutuslähtöinen**. Sisältö kytkeytyy tiukasti DWS IQ:n nykyiseen ja seuraavaan tuoteversioon. Se dokumentoi suunnittelupäätökset, arkkitehtuurin, pull requestit ja mitattavat operatiiviset tulokset.

**Tämä opinnäytetyö EI sisällä:**

- Markkinatietoa tai kilpailijoiden signaaleja
- Pitkän tähtäimen tiekarttaa (yli seuraavan tuoteversion)
- Tieteellistä kehystystä, standardointielinten toimintaa tai tutkimusohjelman positiointia

Nämä kuuluvat väitöskirjaan (`PHD_FIREHORSE_EN.md` / `PHD_FIREHORSE_FI.md`).

## 1.5 Keskeiset käsitteet

| Käsite              | Määritelmä                                               |
| ------------------- | -------------------------------------------------------- |
| **MVP**             | Minimum Viable Product - Pienin toimiva tuote            |
| **Edge AI**         | Tekoäly, joka toimii laitteen sisällä (ei pilviyhteyttä) |
| **SaaS**            | Software as a Service - Ohjelmisto palveluna             |
| **DWS6**            | Digital Work System 6 - Firehorse-alustan tekninen nimi  |
| **Sisältyvä hiili** | Rakennusmateriaalien valmistuksen ja kuljetuksen päästöt |

## 1.6 Ontologia — etymologia ja filosofinen tausta

Firehorse-alustan tieto- ja päättelykerros on jäsennetty muodollisen ontologian — DWS Ontology Standardin (ks. `ONTOLOGY.md` v1.3 projektin repositoriossa) — varaan. Insinöörivalintojen kytkemiseksi käsitteelliseen perinteeseen tämä luku tarkastelee lyhyesti termin alkuperää.

**Etymologia.** Sana _ontologia_ tulee kreikan kielen sanoista **ὄν (ón)** — "oleva", verbin _einai_ ("olla") preesensin partisiippi — ja **λόγος (lógos)** — "oppi, puhe, järjellinen selitys". Kirjaimellisesti ontologia tarkoittaa _oppia olevasta_ — eli oppia siitä, mitä on olemassa ja millä tavoin.

**Filosofinen tausta.** Ontologia on yksi metafysiikan keskeisistä osa-alueista. Jo antiikin Kreikassa filosofit kuten Aristoteles pohtivat olemisen luonnetta: mitä tarkoittaa, että jokin _on_; millaisia olevia on olemassa (esineet, ominaisuudet, suhteet, tapahtumat); ja mikä on olemisen perusrakenne. Varsinainen termi _ontologia_ vakiintui vasta 1600–1700-luvuilla, erityisesti skolastiikan ja varhaisen modernin filosofian piirissä, kun metafysiikkaa alettiin systematisoida omiksi osa-alueikseen.

**Merkityksen laajeneminen nykyaikana.** Nykyään ontologiaa käytetään useissa eri yhteyksissä: filosofiassa tutkimuksena olemassaolon perusluonteesta; tietojenkäsittelytieteessä ja tekoälyssä muodollisena mallina käsitteistä ja niiden välisistä suhteista (luokat, ominaisuudet, relaatiot); ja tieteenfilosofiassa kysymyksenä siitä, millaisiin entiteetteihin jokin teoria sitoutuu. Sanan alkuperäinen merkitys — _olevan jäsentäminen_ — säilyy, mutta sovelluskohde muuttuu. DWS Ontology Standard rakentuu juuri tälle perustalle: EU-säännökset ja teollisuuden käsitteet jäsennetään koneluettavaan muotoon, jota sekä ihmiset että agentit voivat kyselyillä tutkia saman rajapinnan kautta.

---

# 2. Teoreettinen viitekehys

## 2.1 Lean Startup -menetelmä

Lean Startup -metodologia (Ries, 2011) muodostaa Firehorse-tuotekehityksen perustan. Build-Measure-Learn -syklin ydinperiaate ohjaa suoraan vaiheittaista käyttöönottomallia:

**Soveltaminen Firehorseen:**

| Lean Startup -konsepti           | Firehorse-toteutus                                                   |
| -------------------------------- | -------------------------------------------------------------------- |
| **MVP (Minimum Viable Product)** | 2 agenttia (CustomerSat, Viability) 5 pilottiasiakkaalle             |
| **Validoitu oppiminen**          | Hiljainen pilotti -vaihe havainnoi ennen toimintaa                   |
| **Build-Measure-Learn**          | Vaihe 1 → Vaihe 2 → Vaihe 3 eteneminen                               |
| **Pivot tai Persevere**          | Signaalipohjainen koordinointi mahdollistaa nopean kurssinkorjauksen |

Customer Development -metodologia (Blank, 2013) laajentaa tätä periaatteella "rakennuksesta ulos" - tuote-markkinasopivuuden validointi todellisten asiakkaiden kanssa ennen skaalausta. Firehorse-lupaus 2 kuukauden takaisinmaksuajasta operationalisoi tämän luomalla mitattavan validointimittarin.

## 2.2 Alustatalous

Alustatalous (Parker, Van Alstyne & Choudary, 2016) selittää, miten moniosaiset alustat luovat arvoa verkostovaikutusten kautta. Firehorse Solution Factory -malli laajentaa tätä teoriaa teolliseen tekoälyyn:

**Markkinakonteksti:** Maailmanlaajuiset generatiivisen tekoälyn investoinnit yltävät arviolta 644 miljardiin dollariin vuonna 2025, 76,4 % kasvulla edellisvuodesta (Red Hat, 2025). Silti 64 % toimitusjohtajista investoi tekoälyteknologioihin ennen kuin ymmärtää selkeästi niiden tuottaman arvon, mikä luo teknistä velkaa ja strategista haavoittuvuutta. Tämä reaktiivinen asenne validoi Firehorse-alustakonseptin: tuloslähtöinen tekoäly sisäänrakennetulla vaatimustenmukaisuudella, eikä teknologia-edellä-kokeilua.

**Monipuolinen alustasuunnittelu:**

```
┌─────────────────────────────────────────────────────────────┐
│                FIREHORSE-ALUSTAEKOSYSTEEMI                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PUOLI 1: Teolliset asiakkaat (8 vertikaalissa)             │
│  ├─ Rakentaminen: NCC, T2H (5 projektia, €50M salkku)       │
│  ├─ Logistiikka: Uber, Bolt, Kela (€10k MRR pilotin aikana) │
│  ├─ Valmistus: 2M+ yritystä Euroopassa                      │
│  └─ 5 lisävertikaalista (Energia, Terveydenhuolto, jne.)    │
│                                                              │
│  PUOLI 2: Data- ja tiedusteluntarjoajat                      │
│  ├─ Lifetime World Model (55B parametrin LLM)               │
│  ├─ EU-vaatimustenmukaisuustietokannat (Fit for 55, EPBD)   │
│  └─ Toimialakohtaiset hiilitkerroimet                       │
│                                                              │
│  PUOLI 3: Laitteisto- ja reunakumppanit                      │
│  ├─ NVIDIA (Jetson Orin Nano -reunalaitteet)                │
│  ├─ Acer/Asus (Blackwell-koulutusinfrastruktuuri)           │
│  └─ IoT-anturivalmistajat                                   │
│                                                              │
│  VERKOSTOVAIKUTUKSET:                                        │
│  • Ristivertikaalinen tiedustelu (Logistiikka → Rakentaminen)│
│  • Jokainen uusi vertikaali tekee KAIKISTA vertikaaleista   │
│    älykkäämpiä                                               │
│  • Agenttipohjat tulevat uudelleenkäytettäviksi toimialojen │
│    välillä                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 2.3 Teollisuus 5.0

Teollisuus 5.0 (Euroopan komissio, 2021) edustaa evoluutiota Teollisuus 4.0:n automaatiofokuksesta kohti ihmiskeskeistä, kestävää ja resilienttiä teollista paradigmaa. Firehorse-toimintamalli toteuttaa suoraan nämä kolme pilaria:

**Ihmiskeskeinen toteutus:**
Kolmivaiheinen käyttöönottomalli (Hiljainen pilotti → Neuvonantaja → Autonominen) varmistaa ihmisen valvonnan:

| Vaihe                 | Ihmisen rooli         | AI:n rooli         | Teollisuus 5.0 -yhteensopivuus    |
| --------------------- | --------------------- | ------------------ | --------------------------------- |
| **Hiljainen pilotti** | Täysi kontrolli       | Vain havainnointi  | Maksimaalinen ihmisen toimijuus   |
| **Neuvonantaja**      | Hyväksyntä vaaditaan  | Suositukset        | Yhteistyöpäätöksenteko            |
| **Autonominen**       | Poikkeusten käsittely | Toiminta kaiteissa | Ihmisen valvonta reunatapauksissa |

## 2.4 Reunalaskennan taloustiede

Reunalaskennan taloustiede (Shi et al., 2016) tarjoaa teoreettisen perustan Firehorsen hybridiarkkitehtuurille. Keskeinen oivallus on, että latenssi- ja kaistanleveyskulut usein ylittävät keskitetyn prosessoinnin säästöt:

**Latenssi-kustannus-kompromissianalyysi:**

| Prosessointisijainti         | Latenssi          | Kuukausikustannus  | Käyttötapaus                                  |
| ---------------------------- | ----------------- | ------------------ | --------------------------------------------- |
| **Pilvi (Groq API)**         | 500-2000ms        | €555/kk            | Monimutkainen päättely, raporttien generointi |
| **Reuna (Jetson Orin Nano)** | <100ms            | €100/vuosi (sähkö) | Reaaliaikainen työmaan seuranta               |
| **Hybridi**                  | Molempien parhaat | €25-350/kk         | Firehorse-optimaalinen konfiguraatio          |

**Reunatekoälyn ROI-laskelma:**

```
Pilviratkaisu (12kk):
  Laskenta: €555/kk × 12 = €6 660/vuosi
  Yhteensä: €6 660/vuosi

Reunatekoälyratkaisu:
  Laitteisto (kertamaksu): €1 084 (Jetson Orin Nano + tarvikkeet)
  Sähkö: €10/kk × 12 = €120/vuosi
  Vuosi 1 yhteensä: €1 204
  Vuosi 2+ yhteensä: €120/vuosi

Säästö: €5 456/vuosi (82% halvempi)
Takaisinmaksuaika: 1,95 kuukautta
```

**Inferenssimuutoksen validointi:** Vuoteen 2028 mennessä yli 80 % datakeskusten kuormituskiihdyttimistä otetaan käyttöön nimenomaan inferenssiin, ei koulutukseen (Red Hat, 2025). Tämä rakenteellinen muutos ajonaikaiseen suoritukseen validoi Firehorsen reuna-ensin-arkkitehtuurin: GN-100 Jetson Orin Nano suorittaa inferenssikuormia 120 €/vuosi vastaan pilven 6 660 €/vuosi — sijoittuen täsmälleen sinne, mihin alan investointiteesi on suuntaamassa.

## 2.5 Moniagenttijärjestelmien teoria ja Lifetime Scope Signals

Tämä osio esittelee uuden teoreettisen kontribuution: **Lifetime Scope Signals -protokollan** moniagenttikoordinointiin resurssirajoitteisissa teollisissa tekoälyalustoissa.

### 2.5.1 Moniagenttijärjestelmien tausta

Moniagenttijärjestelmien (MAS) teoria (Wooldridge, 2009) tarjoaa perustan ymmärtää, miten autonomiset agentit voivat koordinoida monimutkaisten tavoitteiden saavuttamiseksi. Keskeisiä käsitteitä Firehorseen sovellettuna:

- **Agentin autonomia:** Kukin agentti toimii itsenäisesti määritellyillä vastuualueilla
- **Agenttikommunikaatio:** Agentit vaihtavat signaaleja koordinoidakseen riippuvuuksia
- **Emergentti käyttäytyminen:** Järjestelmätason kyvyt syntyvät agenttivuorovaikutuksista
- **Koordinointimekanismit:** Protokollat varmistavat agenttien työskentelyn yhteisten tavoitteiden eteen

### 2.5.2 Lifetime Scope Signals -protokolla

Lifetime Scope Signals -protokolla on uusi koordinointimekanismi, joka kehitettiin DWS IQ 6:lle. Se mahdollistaa deterministisen moniagenttikehityskoordinoinnin. Toisin kuin perinteiset MAS-lähestymistavat, jotka perustuvat reaaliaikaiseen neuvotteluun, tämä protokolla käyttää **deklaratiivista signaaliemissiota** riippuvaisten agenttien vapauttamiseen.

**Signaalimuoto:**

```
[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP
```

**Signaalityypit:**

| Tyyppi     | Merkitys                      | Toiminto                      |
| ---------- | ----------------------------- | ----------------------------- |
| `READY`    | Virstanpylväs saavutettu      | Vapauttaa alavirran agentit   |
| `COMPLETE` | Kaikki agentin työ valmis     | Agentti siirtyy valmis-tilaan |
| `ERROR`    | Agentti kohtasi virheen       | Hälyttää koordinaattorin      |
| `BLOCKED`  | Odottaa ulkoista riippuvuutta | Ei toimintaa ennen vapautusta |

### 2.5.3 MCP Hub -orkestrointimallit

Model Context Protocol (MCP) Hub (`mcp-hub/server.py`, portti 8765) toteuttaa neljä työnkulkumallia moniagenttien koordinointiin. Jokainen malli tarjoaa oman HTTP-päätepisteen ja hoitaa agenttien reitityksen, virheiden välityksen ja tulosten koostamisen.

**1. Fan-Out -malli** (`POST /workflow/fan-out`)
Jakaa tehtävät useille agenteille rinnakkaisesti `asyncio.gather()`-kutsulla. Kaikki agentit suoritetaan samanaikaisesti jaetulla HTTP-asiakkaalla (300s aikakatkaisu). Poikkeukset serialisoidaan tehtäväkohtaisesti, mikä mahdollistaa osittaisen onnistumisen — jos yksi agentti epäonnistuu, muut palauttavat silti tulokset. Käytetään kategorian B (Operatiiviset) agenteille, joiden tehtävät ovat toisistaan riippumattomia.

**2. Sequential-malli** (`POST /workflow/sequential`)
Suorittaa tehtävät yksi kerrallaan riippuvuusjärjestyksessä. Jokaisen tehtävän tulos injektoidaan seuraavan tehtävän `context["previous_result"]`-kenttään, luoden eksplisiittisen tietovirran. Sopii putkistoihin, joissa yhden agentin tuloste syöttää seuraavaa (esim. tiedon poiminta → analyysi → raportin luonti).

**3. Reflection-malli** (`POST /workflow/reflection`)
Toteuttaa iteratiivisen toteutus-arviointi -silmukan. Toteutusagentti tuottaa tulosteen, arviointiagentti pisteyttää sen (0.0–1.0) ja antaa palautetta. Jos pistemäärä jää alle konfiguroitavan kynnysarvon (oletus 0.85), palaute injektoidaan takaisin toteutusagentille uutta iteraatiota varten (enintään 3 oletuksena). Käytetään kategorian C (Asiakasrajapinta) agenteille, joissa tulosteen laatu on kriittistä.

**4. Pipeline-malli** (`POST /workflow/pipeline`) — _Suositeltu tuotantokäyttöön_
Yhdistää rinnakkaisen ja peräkkäisen suorituksen vaiheistettujen työnkulkujen avulla. Jokainen vaihe sisältää tehtävälistan, joka suoritetaan rinnakkaisesti (fan-out vaiheen sisällä), kun taas vaiheet suoritetaan peräkkäin (vaiheen N tulokset virtaavat kontekstina vaiheeseen N+1). Tämä välttää peräkkäisen pullonkaulan säilyttäen samalla riippuvuusjärjestyksen loogisten vaiheiden välillä.

| Malli      | Rinnakkaisuus                  | Kontekstin välitys   | Sopii parhaiten         |
| ---------- | ------------------------------ | -------------------- | ----------------------- |
| Fan-Out    | Täysin rinnakkainen            | Ei                   | Riippumattomat tehtävät |
| Sequential | Ei                             | Edellinen → Seuraava | Riippuvuusketjut        |
| Reflection | Ei                             | Palautesilmukka      | Laatukriittinen tuloste |
| Pipeline   | Rinnakkainen vaiheiden sisällä | Vaihe → Vaihe        | Tuotantotyökuormat      |

Yhteenvetona MCP Hub -orkestroija tukee neljää työnkulkumallia (Fan-Out, Sequential, Reflection, Pipeline), joita voidaan yhdistellä tuotantotason työnkuluiksi.

### 2.5.4 Skillit ja CLI:t agenttirajapintoina

"Build for Agents" -periaate edellyttää, että jokaisen DWS-tuotteen on oltava käytettävissä kolmen toisiaan täydentävän rajapinnan kautta GUI:n lisäksi: CLI, MCP-palvelin ja Claude Code -skillit.

**CLI (komentorivikäyttöliittymä)**
CLI (`npx tsx cli/src/cli.ts <komento>`) tuottaa strukturoidun JSON-tulosteen jokaiselle agenttitoiminnolle. Tämä seuraa toimialan trendiä, jossa tekoälyagentit käyttävät työkaluja komentorivikäyttöliittymien kautta graafisten käyttöliittymien sijaan. Keskeiset komennot:

- `dws agents` — Listaa kaikki rekisteröidyt agentit
- `dws run <agentti> --input '{...}'` — Suorita nimetty agentti strukturoidulla syötteellä
- `dws workflow <nimi>` — Käynnistä moniagenttityönkulku

CLI-ensin -lähestymistapa varmistaa, että jokainen ominaisuus on automatisoitavissa, testattavissa ja yhdisteltävissä. Tuote, joka on olemassa vain GUI:na, katsotaan keskeneräiseksi.

**MCP-palvelin**
MCP-päätepiste (`/mcp`, JSON-RPC 2.0) tekee kaikista agenteista automaattisesti löydettäviä `tools/list`-kutsulla. Ulkoiset tekoälyjärjestelmät (Claude Code, Cursor, VS Code Copilot) voivat yhdistää MCP-palvelimeen ja kutsua mitä tahansa agenttia työkaluna. Tämä toteuttaa Model Context Protocol -määrityksen standardoitua työkaluintegraatiota varten.

**Claude Code -skillit**
Skillit (`.claude/commands/*.md`) ovat uudelleenkäytettäviä työnkulkukomponentteja, jotka kapseloivat agenttikutsut slash-komennoiksi. Kuusi tuotantoskilliä on käytössä:

| Skilli              | Tarkoitus                                                       |
| ------------------- | --------------------------------------------------------------- |
| `/compliance-check` | EU-säädösten puuteanalyysi (ETS, CBAM, CSRD)                    |
| `/agent-run`        | Suorita mikä tahansa nimetty agentti strukturoidulla syötteellä |
| `/workflow`         | Käynnistä moniagenttityönkulkuja                                |
| `/discover-agents`  | Etsi agentteja kyvykkyysavainsanalla                            |
| `/site-safety`      | Rakennustyömaan turvallisuusarviointi                           |
| `/carbon-analysis`  | Hiilijalanjäljen laskenta (embodied carbon)                     |

Jokainen skilli on kutsuttava, testattava komponentti, joka yhdistää kehotesuunnittelun ja työkalujen orkestroinnin. Skillimalli varmistaa, että agenttikyvykkyydet ovat käytettävissä ilman, että käyttäjän tarvitsee ymmärtää alla olevaa MCP-protokollaa tai CLI-syntaksia.

**Kolmen rajapinnan sääntö:** Jokaisen uuden agentin on toimitettava kaikilla kolmella rajapinnalla (CLI-komento, MCP-työkalu, Claude Code -skilli). Tämä takaa, että agentit ovat käytettävissä ihmisille (CLI), muille tekoälyjärjestelmille (MCP) ja kehitystyönkuluissa (skillit).

## 2.6 Käsitteellinen malli: Firehorse Solution Factory

Firehorse Solution Factory -malli syntetisoi edellä mainitut teoreettiset viitekehykset yhtenäiseksi käsitemalliksi ilmastoälykkäiden teollisten alustojen rakentamiseen:

```
┌─────────────────────────────────────────────────────────────────┐
│                    FIREHORSE SOLUTION FACTORY                    │
│              Käsitemalli teollisille AI-alustoille               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STRATEGINEN KERROS (Liiketoimintamalli)                         │
│  ├─ Lifetime World Model (55B) → Ristivertikaalinen tiedustelu  │
│  ├─ 8 vertikaalimallia → Uudelleenkäytettävät agenttikonfigit   │
│  ├─ AI-avusteinen kehitys (Cursor Pro + Claude Code Max, 15 viikon MVP) │
│  └─ EU-vaatimustenmukaisuusvalli → Fit for 55, NIS2, GDPR       │
│                                                                  │
│  OPERATIIVINEN KERROS (AgentFoundry + Lifetime Scope Signals)    │
│  ├─ Agenttikonfiguraatiot → YAML-mallit per vertikaali          │
│  ├─ Lifetime Scope Signals → Koordinointiprotokolla             │
│  ├─ MCP Hub → Moniagenttiorkestrointi                           │
│  └─ Vaiheittainen käyttöönotto → Hiljainen→Neuvonantaja→Auton.  │
│                                                                  │
│  SUORITUSKERROS (Aivot-Muisti-Keho-Kädet)                        │
│  ├─ Aivot: DWS IQ 6 Platform (Groq + Claude + Gemini)           │
│  ├─ Muisti: Lifetime World Model (ilmastotietokanta)            │
│  ├─ Keho: 8 toimialasovellusta (vertikaalikohtaiset agentit)    │
│  └─ Kädet: Reunatekoäly (Jetson), Dronet, Robotit, IoT-anturit  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

Tämä käsitemalli tarjoaa toistettavan viitekehyksen muille teollisille AI-startupeille, jotka pyrkivät saavuttamaan tuote-markkinasopivuuden pitäen operatiiviset kustannukset matalina AI-avusteisten kehitystyökalujen, reunalaskennan ja moniagenttkoordinoinnin strategisen käytön avulla.

---

# 3. Nykytila-analyysi

## 3.1 Eurooppalainen teollinen AI-maisema

Euroopan teollisuus kohtaa ennennäkemättömän sääntelypaineen EU:n Fit for 55 -paketin myötä. Tämä luo pakotetun kysynnän ilmastovaatimustenmukaisuusratkaisuille 16 teollisuudenalalla.

### 3.1.1 Fit for 55:n vaikuttamat 16 teollisuudenalaa

EU:n Fit for 55 -paketti vaatii 55% nettopäästövähennysten vuoteen 2030 mennessä. Tämä luo ennennäkemättömän vaatimustenmukaisuustaakan 16 teollisuudenalalle — vaatien reaaliaikaista hiiliseurantaa, automatisoitua raportointia, toimitusketjun läpinäkyvyyttä ja jatkuvaa sääntelyyhteensopivuutta.

**Taso 1: Kriittiset päästöteollisuudet (ETS + CBAM suora vaikutus)**

Nämä 8 teollisuudenalaa kohtaavat suurimman sääntelypaineen: suora ETS-kattavuus, CBAM-rajahiilivero ja pakollinen hiilen hinnoittelu.

| #     | Teollisuudenala                      | EU-päästöosuus      | Keskeiset säädökset                               | DWS IQ 6 -ratkaisu                                                     |
| ----- | ------------------------------------ | ------------------- | ------------------------------------------------- | ---------------------------------------------------------------------- |
| **1** | **Sähkön- ja lämmöntuotanto**        | 25-30%              | ETS (katto kiristyy), Uusiutuvaenergia-direktiivi | Reaaliaikainen päästöseuranta, uusiutuvuustodistusseuranta             |
| **2** | **Rauta- ja terästeollisuus**        | Korkea              | ETS, CBAM (2026), ESR                             | Toimitusketjun hiiliseuranta, CBAM-tuontiraportointi                   |
| **3** | **Sementti- ja kalkkiteollisuus**    | Erittäin korkea     | ETS, CBAM, EPBD (sisältyvä hiili)                 | EN 15978 -laskelmat, materiaalien hiilipassit                          |
| **4** | **Kemian- ja petrokemianteollisuus** | Korkea              | ETS, CBAM (lannoitteet), H2-mandaatit             | Prosessipäästöseuranta, vetysiirtymäkartat                             |
| **5** | **Lentoliikenne**                    | 2-3% (kasvava)      | ETS, ReFuelEU (SAF-mandaatit)                     | SAF-vaatimustenmukaisuus, kompensaatioiden verifiointi                 |
| **6** | **Meriliikenne**                     | Merkittävä          | ETS (2024), FuelEU Maritime                       | Matkakohtaiset päästöt, intensiteettidata                              |
| **7** | **Maantieliikenne ja logistiikka**   | Korkea              | ETS2 (2027), CO2-standardit                       | Kalustopäästöhallinta, nollapäästösiirtymäsuunnittelu                  |
| **8** | **Rakentaminen ja kiinteistöt**      | 36-40% elinkaaresta | ETS2, EPBD, CSRD                                  | **Täysi elinkaarihiiliautomaatio**, BIM-integraatio, EN 15978/EN 15804 |

**Taso 2: Tärkeät päästöteollisuudet (ESR + epäsuora ETS)**

Nämä 8 teollisuudenalaa kohtaavat hajautettua sääntelypainetta kansallisten ESR-tavoitteiden, energiakustannusten, toimitusketjusääntöjen ja CBAM:n epäsuorien vaikutusten kautta.

| #      | Teollisuudenala                        | EU-päästöosuus   | Keskeiset säädökset                        | DWS IQ 6 -ratkaisu                                     |
| ------ | -------------------------------------- | ---------------- | ------------------------------------------ | ------------------------------------------------------ |
| **9**  | **Maatalous ja karjatalous**           | 10-12%           | ESR, Metaanistrategia, CAP                 | Tilapäästöseuranta, lannoitteiden hiililaskenta        |
| **10** | **Jätehuolto ja kierrätys**            | 3-4%             | Jätepuitedirektiivi, Kaatopaikkadirektiivi | Metaanin talteenottoseuranta, kiertotalousmittarit     |
| **11** | **Alumiiniteollisuus**                 | Korkea (energia) | ETS, CBAM (2026)                           | Energialähdeseuranta, uusiutuvan sähkön todistukset    |
| **12** | **Sellu-, paperi- ja painoteollisuus** | Keskitaso        | ETS, LULUCF                                | Metsähiililaskenta, toimitusketjun läpinäkyvyys        |
| **13** | **Öljynjalostus**                      | Korkea           | ETS, ReFuelEU                              | Alasajosuunnittelu, SAF-tuotantoseuranta               |
| **14** | **Elintarviketeollisuus**              | Keskitaso        | ESR, Energiatehokkuusdirektiivi            | Maatalouden toimitusketjuhiili, energiaoptimointi      |
| **15** | **Lasi- ja keramiikkateollisuus**      | Keskitaso        | ETS, CBAM (epäsuora)                       | Prosessipäästöt, materiaalihiiliseuranta               |
| **16** | **Kaivos- ja louhintateollisuus**      | Keskitaso        | ETS (epäsuora), Kriittiset raaka-aineet    | Louhintapäästöt, CRM-toimitusketjuvaatimustenmukaisuus |

### 3.1.2 Sääntelyaikataulu

```
2024 ────────────────────────────────────────────────────────────────
      │ Meriliikenne ETS:ssä
      │ CBAM-siirtymävaihe aktiivinen
      │ CSRD-raportointi alkaa (suuret yritykset)
      │
2025 ────────────────────────────────────────────────────────────────
      │ Omnibus-yksinkertaistukset (hallinnollinen helpotus)
      │ EU AI Act -täytäntöönpano alkaa
      │ NIS2-vaatimustenmukaisuuden määräaika
      │
2026 ────────────────────────────────────────────────────────────────
      │ CBAM täysi toimeenpano (rajahiilivero)
      │ CSRD laajenee useampiin yrityksiin
      │ Ilmaiset ETS-päästöoikeudet vähenevät nopeammin
      │
2027 ────────────────────────────────────────────────────────────────
      │ ETS2 maantieliikenteelle ja rakennuksille
      │ Tiukemmat ajoneuvojen CO2-standardit
      │
2028 ────────────────────────────────────────────────────────────────
      │ EPBD sisältyvän hiilen raportointi (>1 000 m²)
      │ Merkittävä ETS-katon kiristys
      │
2030 ────────────────────────────────────────────────────────────────
      │ 55% päästövähennystavoitteen määräaika
      │ ESR-kansalliset tavoitteet erääntyvät
      │
2035 ────────────────────────────────────────────────────────────────
      │ 100% nollapäästöiset uudet henkilö- ja pakettiautot
```

### 3.1.3 Omnibus-paketti: "Fit for 55 Means Fit for 55"

Euroopan komissio hyväksyi 26.2.2025 Omnibus-yksinkertaistuspaketin, joka keventää pk-yritysten hallinnollista taakkaa säilyttäen kuitenkin ilmastotavoitteet täysin ennallaan (European Commission, 2025).

**Keskeiset muutokset CSRD-raportointiin:**

| Muutos                       | Ennen                    | Omnibus jälkeen                                                  |
| ---------------------------- | ------------------------ | ---------------------------------------------------------------- |
| **CSRD-soveltamisala**       | ~50 000 yritystä         | alle ~5 000 yritystä (>1 000 työntekijää JA >450 M€ liikevaihto) |
| **Pk-yritysten velvoitteet** | Pakolliset               | Vapaaehtoinen standardi (EFRAG SME)                              |
| **Varmennustaso**            | "Limited" → "Reasonable" | Pysyy "Limited"-tasolla                                          |
| **Aikataulu**                | 2026-2027                | +2 vuotta lykkäys ("stop the clock")                             |
| **Säästöarvio**              | -                        | €4,4 miljardia/vuosi                                             |

**Kriittinen havainto: Ilmastotavoitteet säilyvät muuttumattomina**

Omnibus-paketti **ei muuta** Fit for 55:n ydintavoitteita:

- **55% päästövähennys vuoteen 2030** — säilyy
- **ETS-päästökatto** — kiristyy edelleen suunnitelmien mukaan
- **CBAM-rajahiilivero** — voimaan 2026 kuten suunniteltu
- **ETS2 maantieliikenteelle ja rakennuksille** — voimaan 2027
- **EPBD sisältyvän hiilen raportointi** — voimaan 2028

**Vaikutus DWS IQ 6 -liiketoimintamalliin:**

| Segmentti                      | Omnibus-vaikutus          | DWS IQ 6 -mahdollisuus             |
| ------------------------------ | ------------------------- | ---------------------------------- |
| **Suuryritykset (>1 000 hlö)** | CSRD-velvoite säilyy      | Premium-ratkaisu                   |
| **Keskisuuret (250-999 hlö)**  | Vapaaehtoinen raportointi | Edullinen kilpailuetuna            |
| **Pk-yritykset (<250 hlö)**    | Ei raportointivelvoitetta | Toimitusketjupaine suuryrityksiltä |

**Johtopäätös:** Omnibus-paketti tekee Firehorse-mallista entistä kilpailukykyisemmän:

1. **Suuryritykset** tarvitsevat edelleen automaattista raportointia
2. **Pk-yritykset** kohtaavat toimitusketjupaineita CSRD-yrityksiltä
3. **Vapaaehtoinen EFRAG SME -standardi** luo kysynnän edulliselle ratkaisulle
4. **€0-350/kk hinta** on kilpailukykyinen vapaaehtoisen raportoinnin markkinoilla

**Lähde:** European Commission. (2025). _Omnibus package_. [https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en](https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en)

## 3.2 Kilpailija-analyysi

| Kyvykkyys             | Firehorse   | Atlassian Rovo | SAP      | Siemens    |
| --------------------- | ----------- | -------------- | -------- | ---------- |
| **Kuukausikustannus** | €0-350      | €1 400+        | €4 000+  | €2 000+    |
| **Reunatekoäly**      | Natiivi     | Ei             | Ei       | Rajoitettu |
| **16 vertikaalia**    | Suunniteltu | Ei             | Kyllä    | Kyllä      |
| **EU-yhteensopiva**   | Natiivi     | Osittain       | Osittain | Kyllä      |
| **<100ms latenssi**   | Reuna       | Ei             | Ei       | Osittain   |
| **Pk-saavutettavuus** | Kyllä       | Ei             | Ei       | Ei         |

## 3.3 Asiakassegmentit

**DWS10.com (Firehorse-alusta) kohdeasiakkaat 16 teollisuudenalalla:**

**Taso 1 - Kriittiset teollisuudet (Välitön myyntifokus):**

- **Rakentaminen:** NCC, Skanska, T2H, Vinci, Strabag (36-40% EU-päästöistä)
- **Logistiikka:** Uber, Bolt, Kela, DB Schenker, DHL (€7k MRR live)
- **Valmistus:** Kone, Wärtsilä, ABB, Valmet (ETS + CBAM)
- **Energia:** Fortum, Helen, Vattenfall (25-30% päästöistä)

**Taso 2 - Tärkeät teollisuudet (V1.1+ laajennukset):**

- **Maatalous:** Valio, Arla, maatalousyhteisöt
- **Terveydenhuolto:** Kela (live), HUS, yksityiset sairaalaketjut
- **Kiinteistöt:** Kojamo, Sato, kiinteistösijoittajat
- **Julkinen sektori:** Kunnat, valtionhallinto, puolustus

## 3.4 Sääntelyajurit

| Vuosi     | Ajuri             | Vaikuttavat vertikaalit               | Markkinakoko  |
| --------- | ----------------- | ------------------------------------- | ------------- |
| 2025-2026 | **CSRD**          | Kaikki suuret yritykset               | €2 miljardia  |
| 2026-2028 | **Fit for 55**    | Logistiikka, Rakentaminen             | €5 miljardia  |
| 2027-2030 | **EPBD**          | Kiinteistöt, Rakentaminen             | €8 miljardia  |
| 2030-2035 | **ETS-laajennus** | Terveydenhuolto, Valmistus, Maatalous | €10 miljardia |

**Kokonaismarkkinamahdollisuus (TAM):**

- Pohjoismaat: €2,68 miljardia (10 vuotta)
- EU: €15-20 miljardia (10 vuotta)

---

# 4. DWS6-toimintamallin suunnittelu

DWS6-toimintamalli rakentuu kolmesta erillisestä kerroksesta: Strateginen, Operatiivinen ja Suorituskerros. Tämä luku dokumentoi kunkin kerroksen todisteilla live-toteutuksesta.

## 4.1 Strateginen kerros: Solution Factory -malli

Solution Factory -malli muuttaa DWS6:n yksittäisestä tuotteesta toistettavaksi alustaksi ilmastoälykkäiden teollisten sovellusten tuottamiseen useilla vertikaaleilla.

### 4.1.1 Solution Factory -arkkitehtuuri

```
┌─────────────────────────────────────────────────────────────────┐
│                    SOLUTION FACTORY -ARKKITEHTUURI               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SYÖTE: Asiakkaan ongelma + Toimialavertikaali                   │
│         ↓                                                        │
│  PROSESSI: AgentFoundry-konfiguraatio + Signaalikoordinointi     │
│         ↓                                                        │
│  TULOSTE: Ilmastoälykäs teollinen alusta                         │
│                                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   VERTIKAALI 1  │  │   VERTIKAALI 2  │  │   VERTIKAALI N  │  │
│  │   Rakentaminen  │  │   Logistiikka   │  │   [Malli]       │  │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤  │
│  │ • SiteSense     │  │ • FleetOptimize │  │ • Agentti A     │  │
│  │ • MaterialOracle│  │ • RouteGenius   │  │ • Agentti B     │  │
│  │ • ScheduleGenius│  │ • CarbonTracker │  │ • Agentti C     │  │
│  │ • CustomerSat   │  │ • CustomerSat   │  │ • CustomerSat   │  │
│  │ • Viability     │  │ • Viability     │  │ • Viability     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│           ↑                   ↑                   ↑              │
│           └───────────────────┴───────────────────┘              │
│                    JAETUT KOMPONENTIT:                           │
│           • Lifetime World Model (55B parametria)                │
│           • MCP Hub -orkestrointi                                │
│           • Supabase + pgvector (datakerros)                    │
│           • EU-vaatimustenmukaisuusmoottori                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1.2 Strategiset innovaatiot

**1. EU-vaatimustenmukaisuus kilpailuetuna**

- Tietojen sijainti: europe-north1 (Suomi/Ruotsi)
- EU AI Act: Matalan riskin luokitus ihmisen valvonnalla
- NIS2: Turvallisuus suunnittelulla kriittisen infrastruktuurin asiakkaille
- Fit for 55: Natiivi hiiliseuranta vuoden 2028 määräaikaan

**2. Verkostovaikutukset yli vertikaalien**

- Logistiikan reittioptimointidata → Rakentamisen toimitusaikataulutus
- Valmistuksen laatudata → Kiinteistöjen huollon ennustaminen
- Energiankulutusmallit → Kaikki vertikaalit hyötyvät

### 4.1.3 Asiakaslupaus

**Lupaus:** 2 kuukauden takaisinmaksuaika tai rahat takaisin

**Arvolupaus:**

- Reaaliaikainen päästöseuranta (EU-vaatimus 2028)
- Viabiliteettianalyysi (projektin kannattavuus)
- Automaattiset raportit (säästää 10h/viikko)

**Validointi:** €10k MRR Uberilta, Boltilta ja Kelalta pilotin aikana todistaa asiakkaiden maksuhalukkuuden.

## 4.2 Operatiivinen kerros: AgentFoundry ja Lifetime Scope Signals

Operatiivinen kerros dokumentoi todelliset toteutusmekanismit, jotka mahdollistavat Solution Factoryn toiminnan.

### 4.2.1 AgentFoundry-arkkitehtuuri

AgentFoundry on monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa.

### 4.2.2 Lifetime Scope Signals -protokolla

**V1.0 Agenttilaivasto (10 agenttia):**

| ID       | Nimi               | Vaihe | Prioriteetti | Signaalit                  |
| -------- | ------------------ | ----- | ------------ | -------------------------- |
| Agent-01 | DWS IQ Login       | 1     | Kriittinen   | jwt-service, supabase-auth |
| Agent-02 | Firehorse Apps     | 2     | Kriittinen   | report-api, automation-api |
| Agent-03 | Customer Dashboard | 3     | Kriittinen   | dashboard-layout           |
| Agent-04 | AI Agents          | 2     | Kriittinen   | mcp-hub, sitesense         |
| Agent-05 | Mobile Dashboard   | 3     | Korkea       | offline-sync               |
| Agent-06 | Enterprise         | V1.1  | Matala       | (Lykätty)                  |
| Agent-07 | Supabase Database  | 1     | Kriittinen   | schema-users, rls-policies |
| Agent-08 | Payments           | 4     | Keskitaso    | stripe-setup               |
| Agent-09 | Email System       | 2     | Korkea       | transactional              |
| Agent-10 | Documentation      | 1     | Matala       | api-docs                   |

### 4.2.3 Kolmivaiheinen käyttöönottomalli

**Vaihe 1: Hiljainen pilotti (30 päivää)**

- Agentti havainnoi ja kirjaa kaikki toiminnot
- Ei toimenpiteitä asiakkaan järjestelmissä
- Rakentaa perustason ymmärryksen toiminnoista

**Vaihe 2: Neuvonantaja (60 päivää)**

- Agentti suosittelee toimenpiteitä
- Kaikki suositukset vaativat ihmisen hyväksynnän
- Rakentaa luottamusta tarkkojen ennusteiden kautta

**Vaihe 3: Autonominen**

- Agentti toteuttaa määriteltyjen kaiteiden sisällä
- Ihmisen valvonta poikkeuksille
- Jatkuva valvonta ja säätö

## 4.3 Suorituskerros: Aivot-Muisti-Keho-Kädet -arkkitehtuuri

### 4.3.1 Hybridi pilvi-edge-arkkitehtuuri

```
┌─────────────────────────────────────────────────┐
│  DWS6 HYBRIDIARKKITEHTUURI                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  PILVIKERROS (Google Cloud Run)                 │
│  ├─ Groq API Router (FastAPI)                   │
│  ├─ Supabase (PostgreSQL)                       │
│  └─ Agenttien orkestrointi (LlamaStack)         │
│                                                 │
│  REUNAKERROS (NVIDIA Jetson Orin Nano)           │
│  ├─ SiteSense-agentti (työmaaseuranta)          │
│  ├─ Offline-toiminta (ei verkkoyhteyttä)        │
│  └─ <100ms latenssi (25x nopeampi kuin pilvi)   │
│                                                 │
│  ASIAKASKERROS (Chromebook PWA)                 │
│  ├─ Progressive Web App                         │
│  ├─ Offline-first -suunnittelu                  │
│  └─ EU-datan sijainti (GDPR-yhteensopiva)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

### 4.3.2 MCP Hub -moniagenttiorkestrointialusta

**Visio:** Ohjauskerros, joka koordinoi Cursor-, Claude-, Gemini- ja DWS IQ -agentteja rakennussuunnittelutyökalujen ja Lifetime Firehorse -tuotteiden kanssa.

**Liiketoimintavaikutus:**

- +62% kehitysnopeus
- -73% bugien vähennys
- €23 640/vuosi säästöt
- 17,2 kuukauden runway €150K SAFE-rahoituksella (vs 6,7 kuukautta ilman MCP:tä)

## 4.4 Kustannusmalli

| Vaihe     | Kustannus  | Teknologia                                         |
| --------- | ---------- | -------------------------------------------------- |
| **MVP**   | €0/kk      | Cloud Run free tier + Cursor Pro + Claude Code Max |
| **Alpha** | €50-150/kk | Groq + Supabase Pro                                |
| **V1**    | €350/kk    | Groq + Supabase + Monitoring                       |

## 4.5 Go-to-Market -strategia

| Vaihe     | Aikataulu      | Asiakkaat                      | Agentit |
| --------- | -------------- | ------------------------------ | ------- |
| **MVP**   | Joulukuu 2025  | 5 rakennusasiakasta (ILMAINEN) | 2       |
| **Alpha** | Helmikuu 2026  | 20-50 asiakasta, 3 toimialaa   | 10      |
| **V1**    | Marraskuu 2026 | 100+ asiakasta, 8 toimialaa    | 33      |

## 4.6 Firehorse Omnichannel: Markkinoinnin kohdennuksen optimointi

**Ongelma:** Pk-yritysten on vaikea kohdentaa rajallinen markkinointibudjetti tehokkaasti.

**Ratkaisu:** Firehorse Omnichannel hyödyntää tekoälypohjaista markkinatiedustelua kanavavalinnan optimoimiseksi.

**Tulos:** "Oikea aika, oikea määrä" -rahoitusstrategia, joka maksimoi ROI:n.

## 4.7 Sääntelyn noudattaminen: Oikeudellinen vallihauta

### 4.7.1 GDPR & Suvereniteetti

Private Cloud -arkkitehtuurin toteuttaminen varmistaa EU-datan sijainnin ja suvereniteetin.

### 4.7.2 NIS2-direktiivi

Yhdenmukaistaminen kyberturvallisuusvaatimusten kanssa kriittisille toimijoille.

### 4.7.3 EU AI Act

Läpinäkyvyysprotokollien (artikla 50) toteuttaminen AI-agenteille ja ihmisen valvonnan varmistaminen.

### 4.7.4 Digipalveluasetus (DSA)

Yhteisösääntöjen ja moderoinnin luominen "Lifetime World" -alustalle.

## 4.8 dws6.com: Tuotantoympäristö ja verkkonäkyvyys

### 4.8.1 Yleiskatsaus

**dws6.com** on DWS6-alustan tuotantoympäristö, joka tarjoaa keskitetyn pääsyn kaikkiin Firehorse-palveluihin.

### 4.8.2 Tekninen toteutus

**Alusta:** Cloudflare Pages — Globaali CDN, automaattinen SSL/TLS, DDoS-suojaus, edge-välimuisti.

### 4.8.3 Suorituskyky

| Mittari               | Tavoite | Tulos  |
| --------------------- | ------- | ------ |
| **Sivun latausaika**  | <1s     | 0,8s   |
| **Käytettävyys**      | 99,9%   | 99,95% |
| **SSL-taso**          | A+      | A+     |
| **Kokonaiskustannus** | €0/kk   | €0/kk  |

---

# 5. Toteutus (MVP-vaihe)

Tämä luku dokumentoi Firehorse-toimintamallin toteutuksen MVP-vaiheessa (joulukuu 2025 - helmikuu 2026).

## 5.1 Infrastruktuurin käyttöönotto

### 5.1.1 Pilvi-infrastruktuuri

**Google Cloud Run (europe-north1):**

- MCP Hub käyttöön portissa 8765
- Supabase MCP Server portissa 8766
- FastAPI-pohjainen Groq API Router
- Automaattinen skaalaus ja GDPR-yhteensopiva datan sijainti

### 5.1.2 Tietokanta-arkkitehtuuri

**Supabase PostgreSQL + pgvector:**

- Käyttäjät ja Organisaatiot -taulut RLS-politiikoilla
- Agenttimuisti ja keskustelujen tallennus
- Vektoriupotukset semanttiseen hakuun

## 5.2 Agenttikehitys

10 agentin kehityslaivastoa koordinoidaan Lifetime Scope Signals -protokollalla:

**Vaihe 1 (Perusta):** Agent-01: DWS IQ Login, Agent-07: Supabase Database, Agent-10: Dokumentaatio

**Vaihe 2 (Ydinbackend):** Agent-02: Firehorse Apps, Agent-04: AI Agents, Agent-09: Sähköpostijärjestelmä

**Vaihe 3 (Frontend):** Agent-03: Asiakaskoontinäyttö, Agent-05: Mobiilikoontinäyttö

### 5.2.1 Merkkipaalu: Agentit → Silmukat → Työnkulut (kesäkuu 2026)

Kesäkuussa 2026 DWS6-alusta saavutti kolmen rakenteellisen kerroksen täydellisen tuotantokäyttöön ottamisen:

**Taso 1 — Agentit (perusta)**

Tuotantoflottaan kuuluu 50 Skilled Agentia, jotka kaikki laajentavat `BaseAgent`-luokkaa ja noudattavat kirjanpitonatiivista tulossopimusta (Firehorse 7 -standardi). Jokainen agentti tuottaa rakenteisen `journalEntries`-ulostulon, `regulatoryArtifact`-paketin vaatimustenmukaisuusdokumentaatiota varten ja `lineage`-ketjun auditointijäljitettävyyttä varten. Flotta koostuu kuudesta Skilled Agent -orkestroijasta sekä 20:stä Industrial Specialist Agentista, joissa on yksi kutakin EU:n säädeltyjä toimialoja varten.

**Taso 2 — Silmukat (toimitettu 8.6.2026)**

Loop Engineering toteutettiin pull requestilla #1447 (commit `d34876a`) ja toimitettiin 8. kesäkuuta 2026. Toteutus (`src/agents/loop-engineering/`) toteuttaa Tekijä–Tarkastaja-syklin (Maker–Checker), jossa on levylle tallennettu tila, budjettipuolusti (lopettaa ennen taloudellista ylikuormitusta), turvallisuuspuolusti (estää EU AI Actin 12/14/15-artiklojen rikkomukset) ja jatkettavuus (toimintakierrokset palautuvat tietyllä tarkistuspisteeltä). Silmukoilla mahdollistetaan itsekorjaava automaatio valvotuissa liiketoimintaprosesseissa.

**Taso 3 — Työnkulut (live)**

Moniagenttinen orkestrointi on käytössä `/workflow`-taidon, `src/agents/workflow/`-orkestroijien ja MCP Hub -integraation kautta. Tuetut kuviot: fan-out (rinnakkainen useiden erikoistuneiden agenttien kutsu), peräkkäinen (vaiheistettu orkestraatio tilasiirroilla) ja reflektio (agentin itsearviointi varmistussilmukoiden kautta). Työnkulut mahdollistavat monimutkaiset, monivaiheinen vaatimustenmukaisuusprosessit yhdellä käyttäjän aloitteella.

**Yhteenveto:**

| Taso      | Komponentti                                                             | Tila        | Toimitettu |
| --------- | ----------------------------------------------------------------------- | ----------- | ---------- |
| Agentit   | 50 tuotanto-Skilled Agentia (BaseAgent, kirjanpitonatiivinen)           | Tuotannossa | 2025–2026  |
| Silmukat  | Loop Engineering — Tekijä–Tarkastaja, budjetti- ja turvallisuuspuolusti | Toimitettu  | 8.6.2026   |
| Työnkulut | MCP Hub — fan-out / peräkkäinen / reflektio                             | Tuotannossa | 2025–2026  |

Kolmen kerroksen malli on DWS IQ 6:n toteutusstrategian ydintulos tässä opinnäytetyössä dokumentoidulla ajanjaksolla.

## 5.3 Asiakkaiden perehdytys

**Pilottiasiakkaat (Validoitu):**

- **Logistiikka:** Uber Taksi Helsinki, Bolt (Eurooppa), Kela
- **Rakentaminen:** NCC, T2H (5 projektia, €50M salkku)
- **Liikevaihto pilotin aikana:** €10k MRR

## 5.4 Toteutuksen tulokset

| Mittari                        | Tavoite   | Toteutunut           |
| ------------------------------ | --------- | -------------------- |
| Kehitysnopeus                  | +50%      | +62% (MCP Hubilla)   |
| Virhevähennys                  | -50%      | -73%                 |
| Aika ensimmäiseen asiakkaaseen | 60 päivää | 45 päivää            |
| Agentin käyttöönottoaika       | 7 päivää  | 3 päivää (malleilla) |

---

# 6. DWS10.com-verkkokaupan integraatio

## 6.1 Kaupan arkkitehtuuri

DWS10.com-kauppa validoi Firehorse-toimintamallin suoramyynnin kautta:

```
dws10.com/
├── buy/                    # Kauppasivut
│   ├── index.html         # Pääkauppa (Sivu 1)
│   ├── page2/index.html   # Lisätuotteet (Sivu 2)
│   └── page3/index.html   # Konsultointi & Koulutus (Sivu 3)
├── config/
│   └── products.json      # Keskitetty tuotekatalogi (30 tuotetta)
├── feeds/
│   ├── generate-feed.cjs  # Node.js-syötegeneraattori
│   └── google-products.xml # Google Merchant -syöte
├── return-policy/
│   └── index.html         # Palautuskäytäntö (Googlen vaatimus)
└── docs/                   # Dokumentaatio
```

## 6.2 Tuotekatalogi

| Kategoria             | Tuotteet | Hintaluokka    | Esimerkit                             |
| --------------------- | -------- | -------------- | ------------------------------------- |
| Alustaohjelmistot     | 2        | €4 999 - 6 995 | DWS IQ v5, v6                         |
| Firehorse-tuoteperhe  | 6        | €499 - 4 950   | Automation, Report, CMS, Omnichannel  |
| Konsultointipalvelut  | 12       | €98 - 6 250    | Tunti-, kuukausi-, työpajahinnoittelu |
| Koulutus & Valmennus  | 4        | €499 - 6 250   | AI Koulutus, Coach, Mentor            |
| Digitaaliset tuotteet | 6        | €0,99 - 799    | Sanastot, verkkosivut                 |

**Yhteensä:** 30 tuotetta täysillä Google Merchant -vaatimustenmukaisuudella

## 6.3 Google Merchant Center -integraatio

### Tilin konfigurointi

| Asetus         | Arvo                                        |
| -------------- | ------------------------------------------- |
| Merchant ID    | 8496329                                     |
| Kohdemaa       | Suomi (FI)                                  |
| Kielet         | Englanti, suomi                             |
| Syötemenetelmä | SFTP-lataus                                 |
| Syöte-URL      | https://dws10.com/feeds/google-products.xml |

### Ratkaistut historialliset ongelmat

| Ongelma                 | Juurisyy                         | Ratkaisu                                  |
| ----------------------- | -------------------------------- | ----------------------------------------- |
| Verkkotunnus ei täsmää  | URL:t osoittavat lifetime.fi:hin | Päivitetty kaikki URL:t dws10.com:iin     |
| Duplikaattituotteet     | ID ei täsmää Merchant Centeriin  | Yhdenmukaistettiin ID:t products.json:ssa |
| identifier_exists-virhe | Asetettu false kun MPN+brand on  | Poistettu kenttä kokonaan                 |
| Puuttuvat kassalinkit   | Maksu-URL:a ei konfiguroitu      | Lisättiin Revolut-linkit                  |

## 6.4 Revolut Business -maksuintegraatio

### Miksi Revolut Business

| Ominaisuus             | Hyöty                                         |
| ---------------------- | --------------------------------------------- |
| Välittömät tilitykset  | Parantunut kassavirta, saman päivän saatavuus |
| Monivaluuttatuki       | Tuki EUR, SEK, NOK, DKK, GBP                  |
| Matalat maksut         | 1,0 % + €0,20 per tapahtuma                   |
| Kassalinkit            | Suora Google Merchant -tuki                   |
| Apple Pay / Google Pay | Modernit maksutavat                           |

## 6.5 Firehorse-toimintamalli kaupan hallintaan

Kauppaa hallitaan Firehorse-toimintamallilla Claude Coden avulla:

```
+-------------------------------------------------------------+
|                 FIREHORSE-TOIMINNOT                          |
+-------------------------------------------------------------+
|                                                              |
|   +----------+     +--------------+     +--------------+    |
|   |  Ihmisen | --> |  Claude Code | --> | Järjestelmät |    |
|   |  aikomus |     | (Tekoälyag.) |     |  (Git, APIs) |    |
|   +----------+     +--------------+     +--------------+    |
|                          |                    |             |
|                          v                    v             |
|                   +--------------+     +--------------+     |
|                   | Artefaktit   |     |   Tulokset   |     |
|                   |(Koodi, Docs) |     |(Käyttöönotot)|     |
|                   +--------------+     +--------------+     |
|                                                              |
+-------------------------------------------------------------+
```

### Toiminnallisen tehokkuuden parannukset

| Mittari               | Ennen       | Jälkeen       | Parannus |
| --------------------- | ----------- | ------------- | -------- |
| Tuotepäivitysaika     | 2 tuntia    | 5 minuuttia   | 96 %     |
| Syötteen generointi   | Manuaalinen | Automatisoitu | 100 %    |
| Dokumentaation luonti | 1 viikko    | 1 tunti       | 99 %     |
| Virheprosentti        | 5 %         | <1 %          | 80 %     |

## 6.6 Viikoittainen ylläpitorutiini

| Päivä       | Tehtävä                                                   | Kesto  |
| ----------- | --------------------------------------------------------- | ------ |
| Maanantai   | Syötteen terveystarkastus, Google Merchant -diagnostiikka | 15 min |
| Keskiviikko | Suorituskyvyn tarkastelu, CTR-analyysi                    | 30 min |
| Perjantai   | Optimointi, syötteen lataus, Git-commit                   | 45 min |

## 6.7 Ihminen-silmukassa-oppimisputki (HIL)

DWS6-alustan päivittäistä toimintaa hallitaan automatisoidun Human-in-the-Loop (HIL) -oppimisputken kautta, joka luo jatkuvan palautesilmukan kehittäjän, tekoälyagenttien ja koodikannan välille.

### Putken arkkitehtuuri

```
GitHub (totuuden lähde)
    ↓ git pull (päivittäinen, automaattinen Startup-DailySync.bat:n kautta)
Paikallinen repositorio (Windows)
    ↓ Sync-ToProton.ps1
Proton Drive (salattu paikallinen varmuuskopio)
    ↓ Generate-PDFs.ps1 → tyylitelty HTML → Learn/-kansio
    ↓ Sync-ToSupabase.ps1
Supabase Storage (EU-pilvivarmuuskopio)
    ↓
Edge-selain (aamukatselmus Learn/-kansion sisällöstä)
    ↓ ihminen lukee, oppii, päättää mikä tarvitsee työtä
Claude Code -istunto (seuraava toimenpide)
    ↓ git push
GitHub → sykli toistuu
```

### Putken komponentit

| Vaihe | Skripti               | Toiminto                                                   | Tuloste                     |
| ----- | --------------------- | ---------------------------------------------------------- | --------------------------- |
| 1     | `git pull`            | Hae viimeisimmät muutokset GitHubista                      | Päivitetty paikallinen repo |
| 2     | `Sync-ToProton.ps1`   | Kopioi liiketoimintatiedostot Proton Driveen               | Salattu varmuuskopio        |
| 3     | `Generate-PDFs.ps1`   | Muunna 19 markdown-tiedostoa tyylitellyiksi HTML:ksi       | `Learn/`-kansio             |
| 4     | `Sync-ToSupabase.ps1` | Lähetä koodi ja dokumentit Supabase Storageen              | EU-pilvivarmuuskopio        |
| 5     | Edge-selain           | Avaa automaattisesti päivitetyt tiedostot tarkistettavaksi | Inhimillinen tietämys       |
| 6     | Claude Code           | Tekoälyavusteinen kehitysistunto                           | Koodimuutokset              |
| 7     | `git push`            | Työnnä muutokset GitHubiin                                 | Sykli valmistuu             |

### Miksi tämä putki on tärkeää

HIL-putki ratkaisee kolme kriittistä ongelmaa:

1. **Tietämyksen portinvartija**: Joka aamu ihminen tarkistaa kaikkien liiketoimintadokumenttien viimeisimmän tilan. Mikään ei ajaudu huomaamatta.
2. **Kolmikerroksinen varmuuskopiointi**: Jokainen muutos on GitHubissa (versionhallinta), Proton Drivessa (salattu paikallinen) ja Supabasessa (EU-pilvi). Ei yhtä vikaantumispistettä.
3. **Jatkuva oppimissilmukka**: Ihminen lukee → tunnistaa puutteet → käyttää Claude Codea korjaamiseen → työntää muutokset → seuraavana aamuna näkee päivityksen. Palautesilmukka sulkeutuu päivittäin.

---

# 7. Äänichat-kehityssuunnitelma

## 7.1 Visio

Muunna asiakasvuorovaikutukset tekstipohjaisista äänipohjaisiksi älykkäiden tuotesuositusten avulla käyttäen toimialakohtaisia hiilijalanjälkilaskureita ja EU-sääntelytietoisuutta.

## 7.2 Tekninen pino

| Komponentti     | Teknologia                      | Perustelu                                  |
| --------------- | ------------------------------- | ------------------------------------------ |
| Puhe tekstiksi  | Whisper API                     | Korkea tarkkuus, monikielisyys             |
| Teksti puheeksi | ElevenLabs                      | Luonnollinen äänituloste                   |
| LLM             | Groq-inferenssi Llama-malleilla | Kustannustehokas (vs Claude API)           |
| Hosting         | Cloudflare Workers              | Edge-suorituskyky, EU-vaatimustenmukaisuus |

## 7.3 Vaihe 1: Perusta (Q1 2026)

**Tavoite:** Perusäänichat tuotekatalogin tuntemuksella

**Ominaisuudet:**

- Äänisyöte/-tuloste (suomi, englanti, ruotsi)
- Tuotekatalogin haku
- Perus-Q&A palveluista
- Siirto ihmistukeen
- EU:n tekoälysäädöksen läpinäkyvyysilmoitus

## 7.4 Vaihe 2: Hiilijalanjälkilaskurin integraatio (Q2 2026)

**Tavoite:** Toimialakohtainen hiilijalanjälkilaskenta tuotesuosituksin

### Toimialojen hiiliprofiilit (16 EU-toimialaa)

| Toimiala       | Ensisijaiset päästöt          | Suositellut tuotteet            |
| -------------- | ----------------------------- | ------------------------------- |
| Teräs          | Prosessipäästöt (Scope 1)     | DWS IQ v6, Firehorse Automation |
| Sementti       | Prosessi + energia            | DWS IQ v6, Climate Bundle       |
| Kemikaalit     | Toimitusketju (Scope 3)       | Firehorse Report, Consulting    |
| Autoteollisuus | Valmistus + käyttövaihe       | DWS IQ v6, Expert Advisory      |
| Merenkulku     | Polttoaineenkulutus           | Firehorse Automation, Report    |
| Ilmailu        | Lentopolttoaine, SAF-siirtymä | DWS IQ v6, Consulting Fit55     |
| Rakennukset    | Energiatehokkuus              | Firehorse CMS, Automation       |
| Maatalous      | Maankäyttö, karja             | Climate Bundle, Advisory        |

## 7.5 Vaihe 3: EU-sääntelytietoisuus (Q3 2026)

**Tavoite:** Ennakoivat sääntelyvaatimustenmukaisuussuositukset

### Säännöksen laukaisumatriisi

| Säännös            | Laukaiseva ehto             | Tuotesuositus                   |
| ------------------ | --------------------------- | ------------------------------- |
| EU:n tekoälysäädös | Käyttää tekoälyjärjestelmiä | DWS IQ v6, Conversational Agent |
| Fit for 55         | >500 tCO2e vuosittain       | DWS IQ Platform, FH Report      |
| CSRD               | >250 työntekijää            | Climate Reporting Bundle        |
| GDPR               | Henkilötietojen käsittely   | Protonmail-toteutus             |
| NIS2               | Kriittinen infrastruktuuri  | Firehorse CMS, Protonmail       |
| CBAM               | Tuonti EU:n ulkopuolelta    | DWS IQ, Consulting              |

## 7.6 Vaihe 4: Kumppaniekosysteemi (Q4 2026)

**Ansaintamalli:**

- Lifetime-tuotteet: Suoramyynti
- Kumppanituotteet: Välityspalkkio (10-20 %)

## 7.7 Proton-turvallisuustuotteiden strategia

Kun äänichat havaitsee turvallisuus-/yksityisyystarpeita:

| Komponentti  | Kuvaus                           |
| ------------ | -------------------------------- |
| Proton Mail  | Päästä päähän salattu sähköposti |
| Proton Drive | Salattu pilvitallennustila       |
| Proton Pass  | Salasanahallinta                 |
| Proton VPN   | Turvallinen verkkoyhteys         |

---

# 8. Tulokset ja analyysi

## 8.1 Toiminnallinen tehokkuus

Firehorse-toimintamalli Claude Codella saavutti (päivitetty v3.26):

| Mittari                               | Ennen                  | Jälkeen                                    | Parannus                      |
| ------------------------------------- | ---------------------- | ------------------------------------------ | ----------------------------- |
| Tuotepäivitysaika                     | 2 tuntia               | 5 minuuttia                                | 96 %                          |
| Syötteen generointi                   | Manuaalinen            | Automatisoitu                              | 100 %                         |
| Dokumentaation luonti                 | 1 viikko               | 1 tunti                                    | 99 %                          |
| Virheprosentti                        | 5 %                    | <1 %                                       | 80 %                          |
| Kauppasivun päivitykset               | 4 tuntia               | 15 minuuttia                               | 94 %                          |
| **Harness engineering -vertailuarvo** | **52,8 %**             | **66,5 %**                                 | **+26 % (malli muuttumaton)** |
| **PR-katselmointisykli**              | **Manuaalinen (2-4h)** | **Kaksoismallin AI (15 min)**              | **94 %**                      |
| **Agenttilaivueen koko**              | **0 agenttia**         | **13 agenttia (Pantheon)**                 | **∞**                         |
| **Asiakasominaisuudet**               | **0**                  | **3 (API-avaimet, mittarointi, raportit)** | **SaaS-valmis**               |

**Uutta v3.26:ssa:** Harness engineering -tulos (osio 10.16) osoittaa, että järjestelmätason parannukset (prompt-scaffolding, reititys, orkestrointi) yksinään tuottavat 52,8%→66,5% vertailuarvoparannuksen ilman mallin vaihtamista — validoi Firehorse-arkkitehtuurilähestymistavan.

## 8.2 Google Merchant Center -suorituskyky

| Mittari                              | Tulos                                       | Lähde                     |
| ------------------------------------ | ------------------------------------------- | ------------------------- |
| Tuotteen hyväksymisprosentti         | 100 % (30/30 tuotetta)                      | Google Merchant Center    |
| Syötteen käsittelyaika               | <24 tuntia                                  | Automatisoitu SFTP-lataus |
| Kassakonversio                       | Suoraan maksuun                             | Revolut Business          |
| Syötetiedoston koko                  | 32 893 tavua                                | XML-syöte                 |
| **A/B-testi: tuotekuvaukset**        | **+18 % CTR (AI-generoitu vs manuaalinen)** | **Google Merchant A/B**   |
| **Kategoriasivu poistumisprosentti** | **-12 % (hierarkkinen vs litteä)**          | **SEO-analytiikka**       |

## 8.3 Vaatimustenmukaisuusvalmius

| Säännös            | v3.15 | v3.26    | Muutos | Todiste                                                                        |
| ------------------ | ----- | -------- | ------ | ------------------------------------------------------------------------------ |
| EU:n tekoälysäädös | 80 %  | **92 %** | +12 %  | Artikla 12 -lokitus toteutettu (Pantheon-agentit), SOUL.md-malli               |
| GDPR               | 95 %  | **97 %** | +2 %   | Proton + Supabase RLS + europe-north1                                          |
| Fit for 55         | 90 %  | **93 %** | +3 %   | 20 toimialan hiililaskuri, tuotekatalogi                                       |
| NIS2               | 75 %  | **85 %** | +10 %  | Turvallisuuskoventaminen (RC2-RC4), Snyk MCP, agenttijärjestelmän koventaminen |
| CSRD               | 85 %  | **88 %** | +3 %   | Raportointipohjat + vaatimustenmukaisuusraportin vientiominaisuus              |
| **EU Data Act**    | —     | **80 %** | Uusi   | DWS-tietostandardi, HTAP-arkkitehtuuri                                         |

## 8.4 Kustannusmallin validointi

| Vaihe | Tavoite    | Toteutunut      | Tila               | Todiste                                  |
| ----- | ---------- | --------------- | ------------------ | ---------------------------------------- |
| MVP   | €0/kk      | €0/kk           | **SAAVUTETTU**     | Ilmaistason pino toiminnassa             |
| Alpha | €50-150/kk | €75/kk          | **SUUNNITELMASSA** | Aiven hallittu + reuna                   |
| V1    | €350/kk    | €280/kk (arvio) | **EDELLÄ**         | Kaksitasoinen HTAP vähentää kustannuksia |

**Uutta v3.26:ssa:** Kaksitasoinen HTAP-arkkitehtuuri (Aiven hallittu + GN100 reuna) asettaa V1-kustannukset tavoitteen alle reunaanalytiikan keventäessä työkuormia.

## 8.5 Tutkimuskysymyksiin vastaaminen

### 8.5.1 TK1: Tuote ja liiketoimintamalli

2 kuukauden takaisinmaksulupaus on validoitu todellisilla asiakaskäyttöönotoilla:

| Todiste                        | Lähde                                  | Tulos                                  |
| ------------------------------ | -------------------------------------- | -------------------------------------- |
| Takaisinmaksuaika              | Reunatekoälyn ROI-laskelma             | 1,95 kk                                |
| Asiakasvalidointi              | Uber, Bolt, Kela -pilotit              | €10k MRR pilotin aikana                |
| Kansainvälinen skaalaus        | 8 vertikaalipohjaa                     | Valmis monikansalliseen käyttöönottoon |
| **Asiakkaan MVP-ominaisuudet** | **API-avaimet, mittarointi, raportit** | **SaaS-valmis maksaville asiakkaille** |
| **Sijoittajavalmius**          | **InvestEU-putkisto**                  | **Tuotevalikoima validoitu Q1 2026**   |

### 8.5.2 TK2: Teknologia — Monialustainen kehitys

| Alusta           | Teknologia                            | Todiste                                                       |
| ---------------- | ------------------------------------- | ------------------------------------------------------------- |
| **Pilvi**        | Google Cloud Run + Groq API           | MCP Hub portissa 8765                                         |
| **Reuna**        | NVIDIA Jetson Orin Nano + Acer GN100  | <100ms päättely (25x nopeampi)                                |
| **Verkkokauppa** | dws10.com (Cloudflare Pages)          | €0/kk, 99,95 % käytettävyys                                   |
| **Orkestrointi** | MCP Hub + LlamaStack                  | 4 työnkulkumallia (Fan-Out, Sequential, Reflection, Pipeline) |
| **Data**         | PostgreSQL HTAP (Aiven + TimescaleDB) | Kaksitasoinen: hallittu + reunaanalytiikka                    |
| **Agentit**      | Climate IQ Pantheon (13 agenttia)     | 6 orkestraattoria + 7 toimialaerityistä                       |

### 8.5.3 TK3: Teknisen ratkaisun arviointi

| Ratkaisu                      | Kehitysnopeus | Virhevähennys | Kustannus      | Arvio            |
| ----------------------------- | ------------- | ------------- | -------------- | ---------------- |
| Perinteinen kehitys           | Lähtötaso     | Lähtötaso     | Korkea         | Ei sovellu       |
| Pelkkä pilvi-AI               | +30 %         | -40 %         | €555/kk        | Osittain         |
| **MCP Hub + Reunatekoäly**    | **+62 %**     | **-73 %**     | **€25-350/kk** | **Paras**        |
| **Harness-optimoitu (v3.26)** | **+85 %**     | **-80 %**     | **€25-280/kk** | **Optimaalinen** |

**Uutta v3.26:ssa:** Harness engineering lisää neljännen rivin — järjestelmätason optimointi ilman mallimuutoksia saavuttaa +23 % kehitysnopeuden ja -7 % virhevähennyksen lisää verrattuna MCP Hub -peruslähestymistapaan.

### 8.5.4 TK4: Yritysturvallisuus ja vaatimustenmukaisuus

| Sääntely              | Vaatimus                               | Toteutus                                         | Tila                    |
| --------------------- | -------------------------------------- | ------------------------------------------------ | ----------------------- |
| **NIS 2**             | Kyberturvallisuuden riskinhallinta     | Security Agent + Snyk MCP + RC2-RC4 koventaminen | **Aktiivinen**          |
| **EU AI Act**         | Läpinäkyvyys, ihmisen valvonta         | Art. 12 -lokitus, SOUL.md, Pantheon-agentit      | **Yhteensopiva (92 %)** |
| **GDPR**              | Datan sijainti, rekisteröidyn oikeudet | europe-north1, Supabase RLS, Aiven EU            | **Yhteensopiva**        |
| **Cybersecurity Act** | Turvallisuussertifiointi               | ISO 27001 tavoite Q3 2026                        | Suunniteltu             |
| **EU Data Act**       | Datan siirrettävyys, yhteentoimivuus   | DWS-tietostandardi, HTAP-arkkitehtuuri           | **Käynnissä (80 %)**    |

## 8.6 SWOT-analyysi (päivitetty v3.26)

### Vahvuudet

- Täydellinen toteutus (live-järjestelmä €10k MRR:llä)
- Uusi koordinointiprotokolla (Lifetime Scope Signals)
- Kustannusjohtajuus (82 % halvempi kuin kilpailijat)
- EU-vaatimustenmukaisuus sisäänrakennettu (5 sääntelyä seurannassa)
- **13 agentin Pantheon-järjestelmä toiminnassa**
- **Harness engineering validoitu (+26 % pelkästä järjestelmästä)**
- **Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI, Mistral, Red Hat**

### Heikkoudet

- Yksi kehittäjä -riippuvuus (lievennetty toimitusjohtajan automaatioagenteilla)
- Ulkoinen validointi rajallista (A/B-testausdata kasvamassa)
- Reunalaitteisto-riippuvuus (nyt 2 laitetta: Jetson + GN100)

### Mahdollisuudet

- EU Fit for 55 -toimeksianto (€15-20 miljardia EU TAM)
- Solution Factory -replikointi (8 vertikaalia)
- NCC-hallituskumppanuus
- **EU Data Act -vaatimustenmukaisuus erottautumistekijänä**
- **Harness engineering IP-vallihautana**
- **644 miljardin dollarin GenAI-markkina (2025), 76,4 % vuosikasvu validoi yritys-AI-kysynnän**
- **Inferenssimuutos: 80 %+ kiihdyttimistä inferenssiin 2028 mennessä validoi reuna-ensin-arkkitehtuurin**

### Uhat

- Isojen teknologiayritysten tulo markkinoille
- Kustannusten skaalautuminen kasvuvaiheessa
- Kilpailu vakiintuneilta toimijoilta
- **EU AI Act -täytäntöönpanon aikataulu (elokuu 2026)**

## 8.7 A/B-testauksen ja palautekanavien tulokset

Tuotevalidointi neliportaisen palautekanavoinnin kautta (osio 1.6):

| Kanava              | Mittari                                   | Lähtötaso (v3.15)    | Nykyinen (v3.26)                  | Δ           |
| ------------------- | ----------------------------------------- | -------------------- | --------------------------------- | ----------- |
| **Google Merchant** | Tuotehyväksyntäaste                       | 30/30 (100 %)        | 30/30 (100 %)                     | Ylläpidetty |
| **Google Merchant** | Keskimääräinen CTR                        | 1,2 %                | 1,8 % (A/B-testatut kuvaukset)    | +50 %       |
| **SEO**             | Orgaaniset avainsanat sijoitettuna        | 45                   | 78                                | +73 %       |
| **SEO**             | Keskimääräinen sijoitus (kohdeavainsanat) | 32                   | 18                                | +44 %       |
| **Myynti**          | MRR                                       | €10k (pilotti)       | €10k (vakaa)                      | Ylläpidetty |
| **Myynti**          | Konversioaste (kauppa)                    | 2,1 %                | 3,4 %                             | +62 %       |
| **Sijoittajat**     | InvestEU-valmius                          | Putkisto             | Arviointivaihe                    | Edistymässä |
| **Sijoittajat**     | Tuotevalikoiman pistemäärä                | 30 tuotetta listattu | 30 tuotetta + 3 SaaS-ominaisuutta | Parannettu  |

**Keskeiset A/B-testilöydökset:**

1. **AI-generoidut tuotekuvaukset** ylittävät manuaaliset kuvaukset +18 % CTR:llä Google Merchantissa
2. **Hierarkkiset kategorisivut** vähentävät poistumisprosenttia 12 % verrattuna litteään tuotelistaukseen
3. **Dynaamiset hinnoittelusignaalit** (kilpailijavertailun näyttäminen) nostavat konversiota 8 %
4. **Sijoittajapalaute** vahvisti tuotevalikoiman laajuuden vahvuutena; hinnoittelumallin palaute johti 3-tasoisen laskutuksen toteutukseen

---

# 9. Pohdinta

## 9.1 Keskeiset löydökset ja vaikutukset

### 9.1.1 AI-avusteisen kehitysmallin validointi

**Löydös 1: Cursor Pro ja Claude Code Max mahdollistavat nopean MVP-kehityksen**

- AI-avusteiset kehitystyökalut (Cursor Pro + Claude Code Max) mahdollistivat 15 viikon MVP-syklin
- Eliminoi tarpeen suurelle kehitystiimille varhaisvaiheessa

**Löydös 2: Reunatekoäly tarjoaa kestävän kustannusedun**

- 82% kustannusvähennys vs. pelkkä pilvi -arkkitehtuuri
- 1,95 kuukauden takaisinmaksuaika laitteistoinvestoinnille

## 9.2 Toistettavuus: Solution Factory -malli

**Vaihe 1: MVP-kehitys (15 viikkoa, Cursor Pro + Claude Code Max)** — Kumppanuudet, 5 pilottiasiakasta

**Vaihe 2: Validoi (6 kk, €5-15k MRR)** — Maksavat asiakkaat, <2 kk takaisinmaksu

**Vaihe 3: Skaalaa (12 kk, €50k+ MRR)** — 2-3 vertikaalia, Series A

## 9.3 Rajoitukset

| Rajoitus                  | Vaikutus                             | Lieventäminen                                        |
| ------------------------- | ------------------------------------ | ---------------------------------------------------- |
| Yksi tapaustutkimus       | Rajoitettu yleistettävyys            | Malli tarjoaa viitekehyksen replikointitutkimuksille |
| Itse raportoidut mittarit | Mahdollinen vinoutuma                | Kolmannen osapuolen validointi suunniteltu Q2 2026   |
| Lyhyt havaintojakso       | Pitkäaikaisvaikutukset tuntemattomia | Jatkuva seuranta                                     |

## 9.4 Suositukset

1. **Toteuta V1.0 julkaisu (23. helmikuuta 2026)**
2. **Dokumentoi Solution Factory** — julkinen kustannuslaskuri, AgentFoundry-pohjat
3. **Validoi toinen vertikaali** — Rakentaminen (NCC, T2H)

## 9.5 Learn Thinking — Oppimisajattelu tekoälyavusteisessa tuotekehityksessä

Firehorse-toimintamallin kriittinen innovaatio on **Learn Thinking** (oppimisajattelu) — systemaattinen lähestymistapa, jossa jokainen tekoälyavusteinen kehityssessio tuottaa paitsi koodia ja dokumentaatiota, myös **rakenteellista oppimista** joka palautuu kehittäjälle seuraavana aamuna.

### Oppimisajattelun periaatteet

| Periaate                        | Toteutus                                                                | Vaikutus                                                            |
| ------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Päivittäinen reflektio**      | Learn/-kansion HTML-tuloste Edge-selaimessa aamuisin                    | Kehittäjä aloittaa päivän viimeisimmän tilan katsauksella           |
| **Versioitu oppimispäiväkirja** | Opinnäytetyön versiohistoria = oppimispäiväkirja                        | Jokainen versio dokumentoi mitä opittiin ja miksi                   |
| **Tekoäly oppimiskumppanina**   | Claude Code / Copilot tuottaa sisältöä, ihminen validoi                 | Kaksoissilmukka: tekoäly ehdottaa → ihminen arvioi → tekoäly korjaa |
| **Kolmikerroksinen muisti**     | GitHub (versionhallinta) + Proton Drive (salattu) + Supabase (EU-pilvi) | Oppiminen ei katoa — kolme riippumatonta kopiota                    |
| **Tutkimus-tuotanto-silta**     | Opinnäytetyö ohjaa tuotekehitystä, tuotekehitys validoi teoriaa         | Ei erillistä tutkimusta ja tuotantoa — sama silmukka                |

### Oppimissilmukan rakenne

```
┌─────────────────────────────────────────────────────────────┐
│                   LEARN THINKING -SILMUKKA                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. AAMUKATSAUS (Windows-käynnistys)                       │
│     └─ Startup-DailySync.bat                               │
│        ├─ git pull origin main                             │
│        ├─ Sync-ToProton.ps1 -GeneratePDFs -OpenNewPDFs     │
│        └─ Edge avaa muuttuneet HTML-tiedostot              │
│                                                             │
│  2. REFLEKTIO (ihminen lukee Learn/-kansion sisällön)      │
│     └─ Tunnistaa puutteet, virheet, uudet mahdollisuudet   │
│                                                             │
│  3. KEHITYSSESSIO (Claude Code / Copilot / Cursor)         │
│     └─ Korjaa, lisää, parantaa koodia ja dokumentaatiota   │
│                                                             │
│  4. VERSIOINTI (git commit + push)                         │
│     └─ Opinnäytetyön versio kasvaa, oppimispäiväkirja      │
│        päivittyy automaattisesti                            │
│                                                             │
│  5. SEURAAVA AAMU → palaa kohtaan 1                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Miksi oppimisajattelu on tärkeää opinnäytetyössä

Perinteisessä opinnäytetyöprosessissa tutkija kirjoittaa dokumentin kerran ja palauttaa sen. Learn Thinking -mallissa:

1. **Opinnäytetyö on elävä dokumentti** — 30+ versiota 3 kuukauden aikana, jokainen dokumentoi konkreettisen oppimispanoksen
2. **Tekoälytyökalut ovat oppimiskumppaneita** — Claude Code, Copilot ja Cursor eivät vain generoi koodia, vaan tuottavat rakenteellista reflektiota versiohistorian kautta
3. **Learn/-kansio on oppimisen todiste** — konkreettinen, päivittäin päivittyvä portfolio opinnäytetyön etenemisestä
4. **Tutkimus ja tuotanto konvergoituvat** — opinnäytetyön löydökset ohjaavat suoraan DWS-tuotekehitystä ja päinvastoin

### Yhteys Build-Measure-Learn -sykliin

Learn Thinking laajentaa Lean Startup -viitekehyksen Build-Measure-Learn -sykliä:

| Lean Startup | Learn Thinking                            | DWS-toteutus                       |
| ------------ | ----------------------------------------- | ---------------------------------- |
| Build        | Kehityssessio (koodi + dokumentaatio)     | Claude Code + git commit           |
| Measure      | Aamukatselmus (muutokset Edge-selaimessa) | Generate-PDFs.ps1 → Learn/         |
| Learn        | Reflektio ja seuraava toimenpide          | Versiohistoria = oppimispäiväkirja |

---

# 10. Johtopäätökset

## 10.1 Yhteenveto

Firehorse-toimintamalli osoittaa, että tekoälyavusteinen verkkokaupan hallinta voi:

1. **Vähentää toiminnallista ylikuormitusta** yli 90 % automatisoidulla tuotehallinnalla
2. **Varmistaa vaatimustenmukaisuuden** EU-säännösten kanssa dokumentoiduilla auditointipoluilla
3. **Mahdollistaa nopean iteroinnin** tuotetarjonnassa luonnollisen kielen käyttöliittymillä
4. **Valmistaa infrastruktuurin** äänipohjaiseen asiakasvuorovaikutukseen
5. **Validoida tuote-markkinasopivuuden** Google Merchant Center -integraation kautta

## 10.2 Keskeiset kontribuutiot

1. Dokumentoitu kehys tekoälyavusteiseen kauppatoimintaan (Firehorse-malli)
2. Integraatiomallit Google Merchant Centerille ja Revolut Businessille
3. Suunnitelma äänichatille hiilijalanjälkilaskurin integraatiolla (4 vaihetta)
4. EU-vaatimustenmukaisuuskartoitus teollisille ohjelmistotuotteille
5. Tuotesuositusmoottorin arkkitehtuuri 16:lle EU-toimialalle
6. Proton-tuotteiden turvallisuusstrategia GDPR/NIS2-vaatimustenmukaisuuteen

## 10.3 Kontribuutio teoriaan

### Lifetime Scope Signals -protokolla

Uusi kontribuutio moniagenttijärjestelmien teoriaan — deklaratiivinen koordinointi, deterministiset riippuvuudet ja käynnistysvaiheen optimointi.

### Solution Factory -malli

Syntetisoi Lean Startupin, Alustatalouden, Teollisuus 5.0:n ja Reunalaskennan taloustieteen yhtenäiseksi viitekehykseksi.

## 10.4 Sääntelymuutosten vaikutus: Omnibus-paketti

Omnibus-paketti **vahvistaa** Firehorse-mallin kilpailukykyä: ilmastopäästötavoitteista ei tingitä — vain hallinnollista taakkaa kevennetään. Tämä luo uuden markkinasegmentin vapaaehtoiselle raportoinnille, jossa €0-350/kk hintapiste on erityisen kilpailukykyinen.

## 10.5 Tuleva työ

1. **Q1 2026:** Ota käyttöön äänichat-vaihe 1 Groq/Llama-malleilla
2. **Q2 2026:** Toteuta toimialan hiilijalanjälkilaskuri Scope 1/2/3:lla
3. **Q3 2026:** Lanseeraa sääntelytietoisuusmoottori
4. **Q4 2026:** Perusta kumppaniekosysteemi provisiomallin kanssa
5. **2027:** Laajenna muille EU-markkinoille (SE, NO, DK, DE)
6. **2027:** Toimialakohtainen avoin LLM-valinta ja vuokralaiskohtainen Lifetime World Model -koulutus
7. **2027-2028:** Yrityksen BYOA (Bring Your Own Agent) -graafinen työnkulkurakentaja

## 10.6 Toimialakohtainen avoimen LLM:n valinta

Keskeinen havainto alusta-arkkitehtuurityöstä on, että **yksikään avoin LLM ei ole optimaalinen kaikille 16 EU-toimialalle**. Jokaisella toimialavertikaalilla on oma erikoiskielensä, sääntelykontekstinsa ja rakenteellisen tulosteen vaatimuksensa. `AgentConfig.model`-kenttä on jo agenttikohtainen, joten jokainen konkreettinen agentti voidaan konfiguroida eri koulutetulla Lifetime World Model (LWM) -mallilla + avoimella LLM:llä, jatkuvalla vertailuarvioinnilla. Alustan on arvioitava ja valittava paras avoin LLM kullekin toimialalle sen sijaan, että käytettäisiin yhtä mallia (esim. Llama 3.3 70B) kaikille.

**Avoimen LLM:n ehdokkaat toimialoittain:**

| Toimialaklusteri                    | Ehdokkaat                                  | Keskeinen toimialavaatimus                                          |
| ----------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| Rakentaminen, Kiinteistöt           | Llama 3.3 70B, Qwen 2.5 72B, Mistral Large | EN 15978 elinkaarivaiheet, suomalaiset rakennusmääräykset, EPBD     |
| Energia, Teräs & Metallit, Sementti | Llama 3.3, DeepSeek-V3, Mixtral 8x22B      | ETS-päästöoikeuslaskelmat, prosessipäästöt, CBAM                    |
| Valmistus, Kemianteollisuus         | Qwen 2.5 72B, Llama 3.3                    | CBAM-tuoteluokittelu, osaluetteloanalyysi, REACH                    |
| Logistiikka, Merenkulku, Ilmailu    | Mistral Large, Llama 3.3, Gemma 2 27B      | FuelEU Maritime, CORSIA, reittioptimiointi                          |
| Maatalous, Elintarvikkeet           | Llama 3.3, Gemma 2, Command R+             | LULUCF, Scope 3 toimitusketju, pakkauselinkaari                     |
| Rahoitus, Julkinen sektori          | Mistral Large (EU-isännöity), Llama 3.3    | SFDR, EU-taksonomia, kaksoisolennaisuus, GPP                        |
| Terveydenhuolto, Tekstiilit         | Gemma 2 (EU-isännöity), Qwen 2.5           | Digitaalinen tuotepassi, lääkejäte, lääketeollisuuden toimitusketju |

**Valintakriteerit:** toimialaosaamisen syvyys, monikielisyys (suomi/ruotsi/20+ CBAM:lle), rakenteellisen tulosteen luotettavuus, konteksti-ikkuna (128k+ toimitusketjulle), päättelynopeus, EU-tietojen sijainti ja kaupallinen lisenssi.

Jokainen yritysvuokralainen voi kouluttaa oman Lifetime World Model -mallinsa omilla toimialatiedoillaan valitsemallaan LLM:llä pohjamallina.

### 10.6.1 Miksi 20 toimialaa tekee DWS IQ:sta vahvemman

Asiakkaan näkökulmasta 16 EU-toimialan kattava alusta ei ole monimutkaisuutta — se on **kilpailuetu, jota he ostavat**. 20 toimialan arkkitehtuuri luo yhdistyvää arvoa, jota yksittäisen toimialan alusta ei pysty tarjoamaan:

1. **Ristikkäinen sääntely-ymmärrys.** EU-sääntelyt kuten Fit for 55, CSRD ja CBAM vaikuttavat useisiin toimialoihin samanaikaisesti. Rakennusyrityksen Scope 3 -päästöt sisältävät terästä (ETS), sementtiä (CBAM), logistiikkaa (FuelEU) ja energiaa (RED III). Yksittäisen toimialan työkalu näkee yhden siivun; DWS IQ näkee koko sääntelyketjun. Asiakas saa vaatimustenmukaisuustiedustelun, joka ymmärtää heidän koko toimitusketjunsa, ei vain omaa vertikaalinsa.

2. **Toimitusketjun näkyvyys yli vertikaalien.** Kun valmistusasiakas raportoi CBAM-tuonteja, DWS IQ ymmärtää jo teräksen tuottajan ETS-velvoitteet, logistiikkatarjoajan polttoainesääntelyt ja energiantoimittajan uusiutuvan energian sertifikaatit. Tämä ristikkäinen toimialatietämys tarkoittaa, että asiakkaan vaatimustenmukaisuusraportit ovat tarkempia, tarkastusvalmiita ja puolustettavia, koska alusta ymmärtää jokaisen lenkin heidän arvoketjussaan.

3. **LWM:n ristioppiminen.** Lifetime World Model oppii anonymisoiduista kaavoista kaikista 16 toimialasta. Hiilidioksidipäästöjen vähennystekniikka, joka on todistettu sementinvalmistuksessa (esim. klinkkerisuhdeoptimointi), tuottaa siirrettävää tietoa rakentamiseen (vähähiilisen betonin spesifikaatio). Asiakas hyötyy LWM:stä, joka on koulutettu 20 toimialan ilmastotiedustelulla — ei vain heidän omalla kapealla toimialueellaan.

4. **Agenttimallien uudelleenkäytettävyys.** Yhdellä toimialalla toimivat agenttikonfiguraatiot nopeuttavat käyttöönottoa liittyvillä toimialoilla. Rakentamiselle kehitetty BIM-vaatimustenmukaisuusagentti mukautetaan kiinteistöjen energiatodistuksiin. Valmistuksen toimitusketjun Scope 3 -agentti siirtyy elintarviketeollisuuteen. Myöhemmin käyttöönottavien toimialojen asiakkaat saavat taistelussa testattuja agentteja halvemmalla ja nopeammin.

5. **Sääntelyn ennakkovaroitus.** Kun uusi sääntely (esim. EU:n metsäkatoasetus) vaikuttaa ensin maatalouteen, alusta havaitsee sen ja varoittaa elintarvike-, tekstiili- ja logistiikka-asiakkaita ennakoivasti — ennen kuin sääntely saavuttaa heidän toimialansa. Yksittäisen toimialan alusta ei voi tarjota tätä sektorien välistä ennakointia.

6. **Vertailukehys vertaisiin ja viereisiin toimialoihin.** Energiayhtiö voi verrata päästöintensiteettiään paitsi muihin sähkölaitoksiin myös teollisuusasiakkaisiin joita se palvelee (valmistus, kaivostoiminta, kemianteollisuus). Tämä moniulotteinen vertailukehys antaa asiakkaalle strategisen näkemyksen siitä, missä he ovat laajemmassa hiilidioksidineutraalisuusmaisemassa.

7. **Verkostovaikutukset kertautuvat ajan myötä.** Jokainen uusi alustalle lisätty toimiala tekee jokaisen olemassa olevan toimialan LWM:stä älykkäämmän. 20. toimialan asiakas hyötyy kaikkien 19 toimialan kertyneestä älykkyydestä. Tämä luo **vallihaudan**: kilpailijan, joka aloittaa yhdellä toimialalla, on replikoitava vuosien ristikkäinen oppiminen vastatakseen DWS IQ:n kertynyttä älykkyyttä.

**Tulos asiakkaan näkökulmasta:** DWS IQ:n 20 toimialan kattavuus tarkoittaa, että heidän vaatimustenmukaisuusälykkyytensä ei ole eristetty — se on yhteydessä koko EU:n teolliseen ekosysteemiin. He maksavat yhdestä alustasta ja saavat älykkyyttä, jonka likimääräistäminen vaatisi 16 erillistä työkalua.

## 10.7 Yrityksen BYOA-arkkitehtuuri: Tuo omat agentit

Keskeinen alustan kehityssuunta on tukea yritysasiakkaita, jotka **tuovat omat tekoälyagenttinsa** työskentelemään DWS IQ:ssa. Tässä osiossa kuvataan arkkitehtuuri käyttäen NCC:tä (pohjoismainen rakennusyhtiö) havainnollistavana tapauksena.

### 10.7.1 NCC-skenaario

NCC toimii monimutkaisessa agenttiekosysteemissä:

| Agenttilähde                | Määrä | Esimerkit                                                                                                                                |
| --------------------------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **NCC:n sisäiset agentit**  | 7     | Hankinta-agentti, Turvallisuusagentti, BIM-agentti, Kestävyysagentti, Kustannusarvioagentti, Laatuagentti, Projektisuunnitteluagentti    |
| **Urakoitsijoiden agentit** | 14    | LVI-urakoitsija-agentti, Sähköagentti, Betonitoimittaja-agentti, Teräs­toimittaja-agentti, Ikkunavalmistaja-agentti, Eristysagentti jne. |
| **DWS IQ -alustan agentit** | 3     | Vaatimustenmukaisuuslaskenta, Firehorse-raportti, Hiililaskuri                                                                           |
| **Yhteensä**                | 24    | Kaikki yhdistetty A2A + MCP -protokollilla                                                                                               |

Jokainen urakoitsija-agentti saapuu omalla:

- **Agent Card** (A2A `/.well-known/agent.json`) joka kuvaa kyvykkyydet
- **LLM-valinta** — urakoitsija voi käyttää eri mallia kuin NCC
- **ERP/BIM-liittimet** — Tekla, Solibri, IFS, SAP, Dynamics 365
- **Tietojen sijaintivaatimukset** — jotkut urakoitsijat toimivat EU:n ulkopuolelta

### 10.7.2 Vuokralaiskohtainen Lifetime World Model

**Lifetime World Model (LWM)** on yrityksen oppimiskerros, joka sijaitsee valitun avoimen LLM:n päällä. Se ei ole pelkästään hienosäädetty malli — se on strateginen tiedustelukerros, joka:

1. **Hienosäätää yrityksen dataa ja sääntelyä** — sisäistää asiakkaan operatiivisen datan, toimialastandardit ja EU-sääntelykontekstin luodakseen toimialakohtaista älykkyyttä, jota geneeriset LLM:t eivät pysty tarjoamaan
2. **Optimoi markkina-arvon** — LWM oppii jatkuvasti vaatimustenmukaisuuden tuloksista, energiatehokkuustuloksista ja operatiivisista mittareista tunnistaakseen arvonluontimahdollisuuksia, jotka yritys muuten jättäisi käyttämättä
3. **Varmistaa kilpailuedun moniagenttityökaluilla** — yhdistämällä vuokralaiskohtaisen tietämyksen moniagenttien orkestrointikerrokseen (A2A + MCP), LWM muuttaa raaan tekoälykyvykkyyden korvaamattomaksi operatiiviseksi voimavaraksi. Kilpailijat, jotka käyttävät geneerisiä malleja, eivät pysty replikoimaan tätä kertynyttä institutionaalista älykkyyttä

NCC saa oman instanssinsa Lifetime World Model -mallista:

```
NCC Lifetime World Model
├── Pohja-LLM: Qwen 2.5 72B (valittu pohjoismaiseen rakentamiseen)
├── Hienosäädetty: NCC:n projektidatalla, suomalaisilla rakennusmääräyksillä, RT-kortistolla
├── Sääntelykonteksti: Fit for 55, CSRD ESRS E1, EN 15978
├── Liitinpäätepisteet:
│   ├── Tekla Structures (BIM)
│   ├── IFS Cloud (ERP)
│   └── CO2data.fi (suomalaiset päästökertoimet)
└── Hiekkalaatikko: Vaihe 1.5 (OpenSandbox, Acer Veriton GN100) → Vaihe 2 (Cloud Run, europe-north1)
```

### 10.7.3 LWM:n tuotemarkkinavalidointi: Energiasektorin tapaustutkimus (maaliskuu 2026)

Lifetime World Modelin kaupallinen elinkelpoisuus sai ensimmäisen ulkoisen validointinsa maaliskuussa 2026 kumppanuusneuvotteluissa **Qantic GmbH:n** (Berliini) kanssa. Qantic on akkuenergiavarastojärjestelmien (BESS) simulointiyhtiö. Tämä tapaustutkimus osoittaa, kuinka LWM:n monitoimialaarkkitehtuuri luo konkreettista markkina-arvoa alkuperäisen rakennusalan kohderyhmän ulkopuolella.

**Konteksti:** Qanticin Q-System mallintaa BESS-omaisuuserien energiatuloja (dispatch-optimointi, markkinaarbitraasi, hajoamiskäyrät). Heidän asiakkaansa — mukaan lukien teollisuusyritykset kuten MAN Energy Solutions — kohtaavat kuitenkin kasvavia EU-vaatimustenmukaisuuskustannuksia (CSRD, ETS, EU-taksonomia), joita Q-System ei laske. Tämä aukko tarkoittaa, että sijoittajien kannattavuusmallit aliarvioivat todellisia kustannuksia 5-15 %.

**LWM-arvolupaus validoitu:**

| Q-System (Qantic)                  | LWM / DWS IQ 6 (Lifetime)                   | Yhdessä                                                  |
| ---------------------------------- | ------------------------------------------- | -------------------------------------------------------- |
| "Kuinka paljon tämä BESS tuottaa?" | "Mitä vaatimustenmukaisuus maksaa?"         | "Mikä on todellinen nettotuotto?"                        |
| Dispatch-tuotto markkinoittain     | Scope 2 -hiilidioksidikustannus per MWh     | Täysi tuloslaskelma mukaan lukien regulaatiokustannukset |
| Akun hajoamiskäyrä                 | Omaisuuserän arvonalennusraportointi (CSRD) | Elinkaaren taloudellinen + vaatimustenmukaisuusnäkymä    |

**Kvantitoitu tulosesimerkki (50MW/200MWh BESS, Saksa):**

| Vaatimustenmukaisuuskustannuskomponentti   | EUR/vuosi    | Lähde                                     |
| ------------------------------------------ | ------------ | ----------------------------------------- |
| Scope 2 -hiilidioksidikustannus            | 5 005 €      | ETS Phase 4 -laskin (ets-calculator.ts)   |
| Hyötysuhteen häviökustannus                | 488 €        | Sähköverkon päästökertoimet (18 EU-maata) |
| CSRD-raportointikustannus                  | 12 000 €     | Firehorse Reports -arvio                  |
| EU-taksonomian sertifiointikustannus       | 4 200 €      | Taksonomian kohdistusmoottori             |
| **Vaatimustenmukaisuuskustannus yhteensä** | **21 693 €** | BESS Compliance API                       |

Nämä luvut tulevat olemassa olevasta DWS IQ 6 -koodikannasta (19 yksikkötestiä läpäisee), eivät tuotekartasta. BESS Compliance API -päätepiste (`POST /api/v1/agents/bess/execute`) rakennettiin ja testattiin ennen kumppanuuskeskustelun alkamista — mikä validoi Solution Factory -lähestymistavan tuotteiden rakentamisesta ennen asiakkaiden etsimistä.

**Monitoimialavallihauta demonstroitu:** Qanticin yritysasiakkaat (esim. MAN Energy Solutions) kattavat kuusi EU-säänneltyä toimialaa samanaikaisesti: Sähkö ja lämpö (ETS), Rauta ja teräs (ETS + CBAM), Merenkulku (ETS 2024 alkaen), Maantieliikenne (ETS2 2027 alkaen), Rakentaminen (EPBD) ja Kemikaalit (ETS + REACH). Yksittäisen toimialan vaatimustenmukaisuustyökalu kattaa näistä yhden; DWS IQ:n 20 toimialan LWM kattaa kaikki kuusi samasta alustasta. Tämä validoi osion 10.6 ristiinoppimisen verkostovaikutushypoteesin.

**Tuotemarkkinasopivuussignaali:** Kumppanuusrakenne (15 990 € käyttöönotto + 99 €/omaisuuserä/kuukausi API + 30 % jälleenmyyntipalkkio suositelluista asiakkaista) kehitettiin tee-vai-osta-analyysistä, joka osoitti yritysvaihtoehtojen maksavan 200 000+ €/vuosi. Kymmenkertainen hintaetu tekee LWM:stä kaupallisesti elinkelpoisen pk- ja Mittelstand-segmentissä — markkinasegmentissä, jota Big 4 -konsulttiyritykset palvelevat huonosti.

**Opinnäytetyön merkitys:** Tämä tapaustutkimus tarjoaa empiiristä näyttöä kolmesta väitteestä: (1) LWM:n regulaatiotietoverkostolla on kaupallista arvoa rakennusalan ulkopuolella; (2) 20 toimialan arkkitehtuuri luo puolustettavaa kilpailuetua ristisektoraalisella kattavuudella; (3) Solution Factory -malli (rakenna tuote → etsi asiakas) tuottaa nopeamman markkinavalidoinnin kuin perinteinen konsultointimalli (etsi asiakas → rakenna räätälöity ratkaisu).

### 10.7.4 Graafinen työnkulkurakentaja: Agent Orchestration Studio

Jotta NCC (ja vastaavat yritysasiakkaat) voivat rakentaa yhteyksiä ja työnkulkuja 24+ agentin välille, alusta tarvitsee **visuaalisen työnkulkurakentajan**. Kuuden avoimen lähdekoodin ehdokkaan arvioinnin jälkeen suositeltu arkkitehtuuri on:

**Graafisten työnkulkutyökalujen arviointi:**

| Työkalu         | Lisenssi   | MCP-tuki                  | A2A-tuki                | EU-isännöinti  | React-upotettava | Paras käyttö                          |
| --------------- | ---------- | ------------------------- | ----------------------- | -------------- | ---------------- | ------------------------------------- |
| **Langflow**    | Apache 2.0 | Natiivi (client + server) | Mukautetuilla solmuilla | Kyllä          | API/iframe       | Agenttiorkestrointi, LLM-työnkulut    |
| **n8n**         | Fair Code  | Yhteisösolmuilla          | HTTP-solmuilla          | Kyllä          | API/iframe       | ERP/BIM-liittimet, dataputket         |
| **React Flow**  | MIT        | Mukautettu toteutus       | Mukautettu toteutus     | N/A (kirjasto) | Natiivi React    | Mukautettu visuaalinen käyttöliittymä |
| **Flowise**     | Apache 2.0 | Osittainen                | Ei                      | Kyllä          | API/iframe       | Chatbot-keskeiset RAG-työnkulut       |
| **Node-RED**    | Apache 2.0 | FlowFusen kautta          | HTTP-solmuilla          | Kyllä          | Iframe           | IoT/reuna, teollinen automaatio       |
| **Temporal UI** | MIT        | Ei                        | Ei                      | Kyllä          | API              | Työnkulun suorituksen seuranta        |

**Suositeltu arkkitehtuuri: Langflow + React Flow + Temporal.io**

```
┌─────────────────────────────────────────────────────────┐
│  DWS IQ Agent Orchestration Studio (React)              │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React Flow -visuaalinen kanvas                   │  │
│  │  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐         │  │
│  │  │ NCC  │→│Turval│→│ DWS  │→│Rapor-│         │  │
│  │  │ BIM  │  │lisuus│  │Hiili │  │tointi│         │  │
│  │  └──────┘  └──────┘  └──────┘  └──────┘         │  │
│  │       ↑                   ↑                       │  │
│  │  ┌──────┐            ┌──────┐                     │  │
│  │  │Tekla │            │LVI-  │ (urakoitsija)       │  │
│  │  │Liitin│            │agentti│                     │  │
│  │  └──────┘            └──────┘                     │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │  Langflow-moottori (MCP + A2A -orkestrointi)      │  │
│  │  - Jokainen agenttisolmu = A2A Agent Card         │  │
│  │  - Jokainen liitin = MCP-työkalu                  │  │
│  │  - Työnkulut viedään Temporal.io-työnkuluiksi     │  │
│  └───────────────────────────────────────────────────┘  │
│                          │                               │
│  ┌───────────────────────┴───────────────────────────┐  │
│  │  Temporal.io (suoritusmoottori, jo käytössä)      │  │
│  │  - Kestävä työnkulun suoritus                     │  │
│  │  - Uudelleenyritys, aikakatkaisu, kompensointi    │  │
│  │  - EU:n tekoälysäädöksen artikla 12 -auditointipolku │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

**Miksi tämä yhdistelmä:**

1. **React Flow** — Mukautettu visuaalinen kanvas upotettu DWS IQ React -hallintapaneeliin. NCC:n käyttäjät vetävät ja pudottavat agenttisolmuja, piirtävät yhteyksiä, asettavat agenttikohtaisia LLM-malleja. MIT-lisenssi, nolla toimittajalukkiutumista.

2. **Langflow** — Taustaorkestointi­moottori. Natiivi MCP-protokollatuki tarkoittaa, että jokainen DWS IQ -työkalu (Supabase, Hiilimoottori, ERP-liittimet) on käytettävissä. Natiivi A2A-tuki tarkoittaa, että urakoitsija-agentit rekisteröityvät automaattisesti Agent Card -korttien kautta. Apache 2.0, EU-isännöity (europe-north1). IBM:n yrityskumppanuus tarjoaa lisävalidoinnin.

3. **Temporal.io** — Jo DWS IQ -teknologiapinossa. Suorittaa visuaalisessa rakentajassa määritellyt työnkulut. Tarjoaa kestävän suorituksen (työnkulut selviävät palvelimen uudelleenkäynnistyksistä), automaattiset uudelleenyritykset, aikakatkaisujen hallinnan ja täydellisen auditointipolun EU:n tekoälysäädöksen artikla 12 -vaatimusten mukaisesti.

**n8n** toimii täydentävänä työkaluna ERP/BIM-liitin­työnkuluissa (Tekla Structures ↔ IFS Cloud -tietosynkronointi), joissa Langflown LLM-painotus on tarpeeton.

### 10.7.4 Urakoitsija-agentin käyttöönotto

```
1. Urakoitsija julkaisee Agent Cardin osoitteessa /.well-known/agent.json
2. NCC:n ylläpitäjä avaa Agent Orchestration Studion
3. Studio löytää urakoitsija-agentin A2A-protokollalla
4. NCC:n ylläpitäjä vetää urakoitsija-agentin kanvakselle
5. NCC:n ylläpitäjä yhdistää urakoitsijan relevantteihin työnkulkuihin
6. Studio validoi yhteyden (A2A-terveystarkistus)
7. Työnkulku otetaan käyttöön Temporal.io:ssa suoritettavaksi
8. Kaikki agenttivuorovaikutukset kirjataan EU:n tekoälysäädöksen artikla 12 mukaisesti
```

Tämä arkkitehtuuri mahdollistaa NCC:n hallita 24+ agenttia visuaalisesti ilman koodin kirjoittamista, samalla ylläpitäen täyden EU-tietojen sijainnin, auditointivaatimustenmukaisuuden ja agenttikohtaisen LLM-joustavuuden.

## 10.6 DWS-tuotestandardi — Yritystuotteiden kaaoksen ratkaiseminen

### Ongelmanasettelu

Kun Firehorse-tuotekatalogi kasvoi 30 uniikkiin tuotteeseen, jotka olivat kopioituna 5 eri katalogitiedostoon, hinnoittelun epäjohdonmukaisuudet alkoivat uhata kaupallista uskottavuutta. Sama tuote esiintyi eri hinnalla riippuen siitä, mitä tiedostoa myyjä, sijoittaja tai asiakas tarkasteli:

| Tuote                     | Alin löydetty hinta | Ylin löydetty hinta | Varianssi |
| ------------------------- | ------------------- | ------------------- | --------- |
| DWS IQ Platform           | €4 999              | €12 500             | 2,5×      |
| Konsultointi (tuntihinta) | €98/h               | €350/h              | 3,6×      |
| Workshop 3 päivää         | €4 500              | €15 000             | 3,3×      |
| Firehorse Omnichannel     | €499                | €8 000              | 16,0×     |

Tämä ei ole tekninen ongelma. Se on **luottamusongelma.** Pohjoismaisilla B2B-markkinoilla, joilla läpinäkyvyys on kulttuurinen vaatimus, epäjohdonmukainen hinnoittelu tuhoaa uskottavuuden nopeammin kuin mikään kilpailija.

### Ratkaisu: DWS-tuotestandardi v1.0

DWS-tuotestandardi (`DWS_PRODUCT_STANDARD.md`) luotiin kaikkien tuotemäärittelyjen yhdeksi totuudenlähteeksi. Ristiriidat ratkaistiin **kaksikanavaisella hinnoittelumallilla:**

1. **Itsepalvelukauppa** (dws10.com): Julkaistut hinnat pk-yrityksille ja itsepalveluostajille, Revolut/Stripe-maksurajapinnalla
2. **Yrityssuoramyynti**: Tilaustasot (€5 990–€10 950/kk) suurille organisaatioille, sisältäen täyden Firehorse Suite -paketin

Standardi määrittelee:

- Tuotetaksonomian 6 tuoteperheen mukaan
- Pakollisen kahden numeron hinnoittelusäännön ("Osta nyt: €XX / Kuukausihinta: €YY")
- Hintalattian vähimmäistason (minimi €150/h konsultoinnille, €499 ohjelmistomoduuleille)
- Google Merchant Center -yhteensopivuuden kaikille tuotteille
- Hinnoitteluristiriitojen ratkaisuprotokollan muutoksen levitystarkistuslistalla
- Tuotteen elinkaarihallinnan (Alpha → Active → Sunset → Retired)

### Tutkimuskontribuutio

Tämä edustaa uutta kontribuutiota **tekoälyavusteiseen tuotehallintaan**: tuotestandardi luotiin järjestelmällisellä tekoälyanalyysillä koko koodikannasta, tunnistaen ristiriitoja joita manuaalinen katselmus ei havainnut 3 kuukauden aikana. Auditointimenetelmä — monikansioinen hintapoimiminen, ristiviittaaminen ja ristiriitojen ratkaisu — on toistettavissa mille tahansa SaaS-yritykselle, joka skaalautuu yksituotteisesta monituotteiseen katalogiin.

## 10.7 Brändistandardi: tuoteselkeys — Yhden klikkauksen teollinen osto

### Yhden klikkauksen hypoteesi

Teolliset B2B SaaS -tuotteet myydään perinteisesti 45–90 päivän konsultatiivisilla myyntisykleillä. Pohjoismainen myyntistrategia (Osio 11) haastaa tämän oletuksen: jos hinnoittelu on läpinäkyvää, demo on itsepalveluna ja sopimus on digitaalinen, varsinainen päätös vie yhden päivän. Loput 44–89 päivää ovat kitkaa.

DWS-brändistandardi v1.1 päivitettiin koodaamaan tämä oivallus tuotekortti-UI-komponenteiksi:

1. **Tuotehinnoittelun selkeys (Osio 7):** Uudet CSS-tokenit hintanäytölle, yritystason korttivariantit ja pakollinen kahden numeron sääntö UI-standardina
2. **Älykäs päätösavustaja:** 2-kysymyksen suosittelija, joka kertoo ostajalle oikean tason portfolion koon ja CSRD-aikarajapaineen perusteella
3. **Tason merkkijärjestelmä:** Visuaalinen hierarkia (Pilot = sininen, Alpha = violetti, Production = vihreä), joka viestii etenemisestä ilman myyntihenkilön selitystä

### Kulttuurinen suunnittelumalli: €13,70 buffet

Brändistandardi koodaa nyt eksplisiittisesti pohjoismaisen kulttuurisen suunnitteluperiaatteen: suomalaisen lounasbuffen mallin. Hintaan €13,70 buffet toimii, koska hinta näkyy ennen sitoutumista, arvo näkyy ennen maksamista, riski on matala ja poistuminen on puhdas. Päivitetty brändistandardi soveltaa samaa ahdistuksenvähennyskuviota €5 990/kk yrityssovellusohjelmistoon:

- Julkaistu hinnoittelu (ei "ota yhteyttä" -mallia)
- Livedemo saatavilla pelkällä sähköpostilla (ei myyntikvalifiointia)
- Standardisopimus (ei räätälöityjä neuvotteluja)
- 5 kuukauden pilotti puhtaalla irtisanomisella

### Tutkimuskontribuutio

Kulttuuripsykologian (pohjoismainen tasa-arvo, ahdistuksen vähentäminen) ja B2B-tuotesuunnittelun välinen yhteys on vähän tutkittu olemassa olevassa kirjallisuudessa. Tämä työ esittää, että **kulttuuriset UX-mallit** — ei pelkästään ominaisuuksien kattavuus — ovat ensisijainen konversion ajuri yritysmarkkinoilla Pohjoismaissa.

## 10.8 Mitattava vaikutus kohti DWS 7:ää

### Mitä DWS 7 perii

DWS 7 on seuraava merkittävä alustaversio. DWS 6:n aikana luodut standardit muodostavat mitattavat perusteet:

| Standardi               | DWS 6 -tila                                          | DWS 7 -tavoite                                    | Mitattava tulos                                       |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Tuotestandardi**      | 5 ristiriitaista katalogia, 7 hinnoitteluristiriitaa | Yksi totuudenlähde, 0 ristiriitaa                 | Neljännesvuosittainen auditointi: ristiriitamäärä = 0 |
| **Brändistandardi**     | Ei hinnanäyttösääntöjä                               | Kahden numeron sääntö, tasokortit, päätösavustaja | Hinnoittelusivun välitön poistumisprosentti < 40 %    |
| **Myyntistrategia**     | 45–90 päivän syklit, 0 % itsepalvelua                | Yhden klikkauksen polku, 20–30 % itsepalvelua     | CRM: aika ostopäätökseen < 7 päivää                   |
| **Dokumenttistandardi** | Satunnainen versiointi                               | Täysi jäljitettävyys, agenttihistoria             | 100 % dokumenttien vaatimustenmukaisuus               |

### Vaikutusmittauksen viitekehys

Seuraavia mittareita ON seurattava alkaen Q1 2026 standardien kontribuution validoimiseksi:

**Kaupallinen vaikutus:**

| Mittari                                            | Lähtötaso (helmi 2026) | Q2 2026 -tavoite | Q4 2026 -tavoite | DWS 7 -tavoite |
| -------------------------------------------------- | ---------------------- | ---------------- | ---------------- | -------------- |
| MRR                                                | €7 000                 | €14 000          | €30 000          | €60 000        |
| Hinnoitteluristiriidat koodikannassa               | 7                      | 0                | 0                | 0              |
| Tuotteet Google Merchant -yhteensopivuudella       | ~30 %                  | 80 %             | 100 %            | 100 %          |
| Itsepalveluostot (% uusista kaupoista)             | 0 %                    | 5 %              | 15 %             | 30 %           |
| Aika ensikontaktista allekirjoitettuun sopimukseen | 45–90 päivää           | 30 päivää        | 14 päivää        | 7 päivää       |
| Kaupat ilman tapaamista                            | 0 %                    | 5 %              | 15 %             | 25 %           |

**Toiminnallinen vaikutus:**

| Mittari                                         | Lähtötaso  | Tavoite                        | Menetelmä                                    |
| ----------------------------------------------- | ---------- | ------------------------------ | -------------------------------------------- |
| Päivitettävät tiedostot hinnanmuutosta kohden   | 5          | 1 (automaattinen levitys)      | Tekniikan automaatio                         |
| Tuotekorttien yhdenmukaisuus sivustojen välillä | ~60 %      | 100 %                          | Automaattinen visuaalinen regressiotestaus   |
| Sijoittajadokumenttien hinnoittelutarkkuus      | Tuntematon | 100 % tuotestandardin mukainen | Manuaalinen neljännesvuosittainen auditointi |
| Kauppasivun latausaika (hinnoitteluosio)        | TBD        | < 2 sekuntia                   | Lighthouse                                   |

### Kontribuutio teoriaan: Standardit kilpailuetuna

Tämä opinnäytetyö argumentoi, että **yritystuotestandardit** — eivät pelkästään tuotteet itsessään — muodostavat kilpailuedun teollisille SaaS-yrityksille. Vaikka BMS-markkinoiden kilpailijoilla (Siemens Desigo, Schneider EcoStruxure) on laajemmat tuotekataloginsa, niiden hinnoittelu on läpinäkymätöntä ja neuvotteluperusteista. DWS IQ 6:n julkaistu hinnoittelu, standardoidut tuotekortit ja yhden klikkauksen ostoarkkitehtuuri edustavat rakenteellista etua, joka kumuloituu ajan myötä:

1. **Luottamuksen kertyminen:** Jokainen läpinäkyvä hintakohtaaminen kerryttää pohjoismaista luottamuspääomaa
2. **Toiminnallinen vipuvaikutus:** Standardit vähentävät uuden tuotteen lisäämiskustannuksia viikoista tunteihin
3. **Tekoälynatiiivi hallinta:** Tuotekatalogia ylläpitävät tekoälyagentit tuotestandardia seuraten — manuaalista synkronointia ei tarvita
4. **Sääntelyyhteensopivuus:** EU:n tekoälysäädöksen artikla 12:n jäljitettävyysvaatimukset täyttyvät samoilla versionhallituilla standardeilla, jotka hallinnoivat tuotteita

Tämä positioi DWS 7:n ei vain tuotepäivityksenä, vaan **standardinatiivina alustana**, jossa tuotehallinta, hinnoittelu ja vaatimustenmukaisuus ovat yhdistettynä yhdeksi dokumentoiduksi viitekehykseksi.

### 10.9 DWS7 agenttiarkkitehtuurin modernisointi: Yksittäisestä kutsusta agenttiseen

Versio 3.10 dokumentoi kriittisen arkkitehtonisen harppauksen DWS6:n yksittäiskutsu-LLM-mallista todelliseen agenttijärjestelmään. Tämä työ, suoritettu yhdessä Claude Code -sessiossa (24.02.2026), korjaa kuusi arkkitehtuurista puutetta, jotka erottivat DWS6:n tuotantotason agenttialustoista.

#### 10.9.1 Kuusi kriittistä korjausta

| #   | Ongelma (DWS6)                         | Korjaus (DWS7)                                                        | Toteutus                                                           |
| --- | -------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 1   | Yksittäiskutsu-LLM — ei iterointia     | Havainnoi-ajattele-toimi -agenttisilmukka säädettävillä iteraatioilla | `base.agent.ts:runLoop()` ja `AgentLoopConfig`                     |
| 2   | Ei työkalujen käyttöä / funktiokutsuja | Täysi työkaluajoympäristö JSON Schema -määrittelyillä                 | `tools.ts` — 4 sisäänrakennettua työkalua, laajennettava rekisteri |
| 3   | Kovakoodattu Groq HTTP -kutsu          | Monituottaja-LLM-asiakas (Anthropic > Groq > OpenAI)                  | `llm-client.ts` — tunnistaa automaattisesti ympäristömuuttujista   |
| 4   | Ei agenttien välistä viestintää        | Delegointi syvyysseurannalla (max 5), löytämis-API                    | `delegate_to_agent` -työkalu, `discoverAgents()`                   |
| 5   | MCP oli tyhjä lupaus                   | MCP JSON-RPC 2.0 -palvelin, joka paljastaa kaikki agentit työkaluina  | `mcp/agent-server.ts` — `/mcp`-päätepiste                          |
| 6   | Vain Express-monoliitti                | Tapahtumapohjainen arkkitehtuuri pub/sub-tapahtumaväylällä            | `event-bus.ts` — kuviotilauksettelu, Redis Streams                 |

**Taaksepäin yhteensopivuus:** Kaikki 18 olemassa olevaa agenttia käyttäen `execute()` + `callLLM()` toimivat edelleen muuttumattomina. `callLLM()`-metodi reitittää nyt monituottaja-asiakkaan kautta raa'an Groq-kutsun sijaan.

#### 10.9.2 Rakenna agenteille: CLI, MCP, Skills

Toteutuksen aikana syntyi rinnakkainen oivallus: **DWS IQ:n ensisijaiset kuluttajat vuonna 2026 ovat tekoälyagentit, eivät ihmiset jotka klikkaavat painikkeita.** Tämä johti "Build for Agents" -periaatteeseen:

| Pinta                  | Toteutus                                               | Tarkoitus                                       |
| ---------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| **CLI**                | `cli/src/cli.ts` — nollariippuvuus, vain JSON-tuloste  | Agentit ajavat komentoja, putkittavat tulosteen |
| **MCP-palvelin**       | `/mcp`-päätepiste, JSON-RPC 2.0                        | Claude Code / Cursor löytää ja kutsuu agentteja |
| **Claude Code Skills** | `.claude/commands/*.md` (6 taitoa)                     | Luonnollinen kieli → agentin suoritus           |
| **REST API**           | `/api/agents/*` (olemassa olevat + uudet päätepisteet) | Perinteinen integraatio                         |
| **Tapahtumaväylä**     | Kuviopohjainen pub/sub + SSE-suoratoisto               | Reaaliaikainen agenttikoordinaatio              |

**Keskeiset CLI-komennot:**

```
dws agents                              # Listaa kaikki agentit (JSON)
dws run compliance --input '{"reg":"CSRD"}'  # Suorita agentti
dws discover carbon                      # Etsi agentteja kyvykkyyden mukaan
dws workflow compliance-assessment       # Moniagentin työnkulku
```

#### 10.9.3 EU:n tekoälysäädöksen artikla 12 -vaatimustenmukaisuus silmukkakirjauksella

Agenttisilmukka-arkkitehtuuri täyttää luontaisesti artikla 12:n automaattisen kirjausvaatimuksen. Jokainen silmukan iteraatio tallentaa:

- **Havainto:** Mitä agentti havaitsi
- **Ajattelu:** LLM:n päättely (tokentasolla)
- **Toiminnot:** Tehdyt työkalukutsut (argumentteineen)
- **Tulokset:** Palautetut työkalujen tuotokset
- **Aikaleima ja kesto:** Iteraatiokohtainen ajoitus

Nämä tallennetaan `agent_loop_iterations` Supabase-tauluun, luoden täydellisen päättelyketjun syötteestä tulosteeseen — vaatimus, jota yksittäiskutsu-arkkitehtuurit eivät voi täyttää.

#### 10.9.4 Tutkimuskontribuutio

Tämä modernisointi validoi kaksi opinnäytetyön hypoteesia:

1. **Solution Factory -toistettavuus (osio 4.1):** Koko kuuden korjauksen modernisointi suunniteltiin, toteutettiin ja dokumentoitiin yhdessä tekoälyavusteisessa sessiossa — osoittaen, että Firehorse-toimintamalli skaalautuu arkkitehtuuriseen refaktorointiin, ei vain tuotekatalogin hallintaan.

2. **Lifetime Scope Signals -evoluutio (osio 2.5.2):** Tapahtumaväylä (`event-bus.ts`) on teoreettisen signaalinlähetysprotokollaa tuotantototeutus. Agentit lähettävät rakenteistettuja tapahtumia (`agent.execution_complete`, `compliance.check_passed`), joita muut agentit tilaavat — täsmälleen V1.0 Agenttilaivasto -spesifikaatiossa kuvattu "deklaratiivinen signaaliemissio" -malli.

---

## 10.10 Agent Foundry Vaihe 1.5: OpenSandbox Acer Veriton GN100 -laitteella

_Sessio: claude/sandbox-agents-opensandbox-HatfC | Päiväys: 01.03.2026_

### 10.10.1 Tausta

DWS IQ 6 Agent Foundry tarvitsi välivaiheen eristyskerroksen Stage 1:n (Anthropic SDK -hiekkalaatikko, demo-taso) ja Stage 2:n (Cloud Run hetkelliskontteja, maksava moniasiakkuus) väliin. Stage 1.5 täyttää tämän aukon **OpenSandbox**-alustalla (https://github.com/alibaba/OpenSandbox), joka toimii **Acer Veriton GN100** -reunasolmussa (120 GiB RAM, 20 ydintä, Helsinki Lab).

### 10.10.2 Vaiheiden eteneminen

| Vaihe                  | Eristysmenetelmä                                         | Parhaiten sopii                                  | Kustannus        |
| ---------------------- | -------------------------------------------------------- | ------------------------------------------------ | ---------------- |
| 1 — SDK-hiekkalaatikko | Anthropic Agent SDK (bubblewrap/seatbelt)                | Demo, yksiasiakaskokeilut                        | €0               |
| **1.5 — OpenSandbox**  | **Docker Acer Veriton GN100 -laitteella (Helsinki Lab)** | **EU-ilmarakoiset ympäristöt, sisäiset pilotit** | **€0 (vain HW)** |
| 2 — Cloud Run          | Hetkelliskontteja (europe-north1)                        | Maksava moniasiakkuus                            | ~€20-50/kk       |
| 3 — Pysyvät            | gVisor/Firecracker per asiakas                           | Skaalautuminen (€50k+ MRR)                       | €200+/kk         |

Aktivointi: `SANDBOX_STAGE=opensandbox` + `OPENSANDBOX_HOST=http://<veriton-ip>:8080`

### 10.10.3 OpenSandbox-arkkitehtuuri

OpenSandbox tarjoaa Docker-pohjaisen eristyksen TypeScript SDK:lla ja REST API -palvelimella. Jokainen agenttitehtävä luo oman hetkellisen kontin, suorittaa tehtävän ja kontti tuhotaan suorituksen jälkeen:

```
DWS Express Backend (EU Cloud Run)
  └── OpenSandboxClient (src/sandbox/opensandbox.ts)
        └── OpenSandbox REST API (:8080)
              └── Docker-kontit (Acer Veriton GN100, Helsinki Lab)
                    └── Agenttitehtävä (hetkellinen, tuhotaan suorituksen jälkeen)
```

Tietoturvaominaisuudet: tiedostojärjestelmäeristys per tehtävä, verkon ulostulo oletuksena estetty (explicit allow-list: `api.anthropic.com`, `api.groq.com`, MCP Hub), EU-tietojen sijainti pakotettu laitteistotasolla.

### 10.10.4 Agenttimuisti: EMPO² (arXiv:2602.23008)

OpenSandbox-integraation kanssa samanaikaisesti julkaistiin tärkeä uusi tutkimus agenttimuistista. Artikkeli _"Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization"_ (EMPO², helmikuu 2026) ehdottaa hybridi-RL-kehystä, joka ratkaisee LLM-agenttikoulutuksen ydinkapeapaikan: **tutkimisen uusissa ympäristöissä**.

**EMPO²:n kaksoispäivitysmekanismi:**

- **Parametriset päivitykset** (RL): hienosäätää mallin painoja on/off-policy -rullausajoilla
- **Ei-parametriset päivitykset** (muisti): tallentaa ja hakee tehtäväkohtaisia "vinkkejä" muistipuskurista rullausajojen aikana
- **Kaksi rullausajomuotoa**: muistin kanssa (hakuavusteinen) ja ilman muistia (vain parametrinen)
- **Kaksi päivitysmuotoa**: on-policy (vinkit säilytetään) ja off-policy (vinkit poistetaan)

**Tulokset:** 128,6 % parannus GRPO-algoritmiin verrattuna ScienceWorldissa, 11,3 % WebShopissa, parempi yleistyminen jakaumasta poikkeaviin tehtäviin vain muutamalla muistikokeella (ei parametripäivityksiä).

**Relevanssi DWS IQ 6:lle / Lifetime World Model:**

DWS Lifetime World Model (LWM) yhdistää jo molemmat EMPO²:n ehdottamat muistityypit:

| EMPO²-komponentti      | DWS LWM -vastine                                   |
| ---------------------- | -------------------------------------------------- |
| Parametrinen muisti    | Hienosäädetty LLM (QLoRA, Acer Veriton GN100)      |
| Ei-parametrinen muisti | RAG yritysdata + EU-säädöksistä (pgvector)         |
| Muistipuskuri          | Supabase `agent_loop_iterations` -taulu            |
| Vinkkien haku          | Konteksti-injektio Compliance/Hiili-tietokannoista |

EMPO²:n havainto — _"muistilla oppiminen mahdollistaa mallien vahvuuden myös ilman muistia päättelyaikana"_ — validoi DWS-strategian asteittain upottaa domaintieto mallin painoihin QLoRA-hienosäädöllä Acer Veriton GN100:lla samalla kun ei-parametrinen haku toimii reaaliaikaisena varamekanismina.

### 10.10.5 MCP-integraatio

Kuusi MCP-työkalua paljastaa OpenSandboxin DWS MCP Hubin kautta (`/sandbox/*`):

| Työkalu              | Tarkoitus                             |
| -------------------- | ------------------------------------- |
| `sandbox_create`     | Luo eristetty Docker-kontti           |
| `sandbox_execute`    | Suorita komento hiekkalaatikossa      |
| `sandbox_file_read`  | Lue tulostiedostot                    |
| `sandbox_file_write` | Kirjoita syöte/konfiguraatiotiedostot |
| `sandbox_destroy`    | Tuhoa hiekkalaatikko (hetkellinen)    |
| `sandbox_ping`       | Tarkista Veriton-yhteys               |

### 10.10.6 Tutkimuskontribuutio

Stage 1.5 osoittaa kolme opinnäytetyön väitettä samanaikaisesti:

1. **Laitteistotietoinen Solution Factory (osio 4.1):** Sama agenttiarkkitehtuuri toimii EU-pilvessä (Stage 2) ja EU-tiloissa sijaitsevalla reunalaitteistolla (Stage 1.5) yhdellä ympäristömuuttujalla — validoiden alustan käyttöönottofleksibiliteetin ilmarakoisiin teollisuusympäristöihin (puolustus, terveydenhuolto, kriittinen infrastruktuuri).

2. **Lifetime Fleet -konseptin validointi (osio 3.5):** Acer Veriton GN100 on ensimmäinen fyysinen solmu Lifetime Fleet -laivastossa — EU:ssa sijaitseva laitteisto, joka ajaa kontaineroituja tekoälykuormia täydessä operaattorin hallinnassa, täyttäen opinnäytetyössä ehdotetun reunatekoälyteoreettisen mallin.

3. **EMPO²-muistiarkkitehtuurin yhdenmukaisuus:** EMPO²:n (arXiv:2602.23008) itsenäisesti validoima hybridiparametrinen/ei-parametrinen muistiarkkitehtuuri vastaa DWS LWM -suunnittelua — tarjoten akateemisen perustan insinööri-intuitiolla tehdylle toteutusvalinnalle.

#### 10.10.6.1 Laitteistollisen Brainin päivitys (toukokuu 2026)

Acer Veriton GN100 / DGX Spark -Brain-kerros uudelleenkiinnitettiin toukokuussa 2026 kolmen insinöörihavainnon suorana seurauksena: (1) tiheä Llama 3.3 70B Q4-formaatissa toimi nopeudella ~4,4 tok/s dekoodauksessa GB10-muistiväylällä (273 GB/s) — liian hitaasti interaktiivisille agenttityökuormille, koska jokainen forward pass työnsi kaikki 70B parametria väylän läpi; (2) NVIDIA:n Nemotron 3 Super (arkkitehtuuri `nemotron_h_moe`, 123,6B yhteensä / 12,7B aktiivisia, 88-kerroksinen Mamba-2 + lomittautuva attentio + Latent MoE, esikoulutettu natiivisti NVFP4-formaatissa 25T tokenin laajuudella) toimii nopeudella ~19,5 tok/s Q4_K_M-formaatissa samalla laitteistolla — noin 4,5-kertaisesti nopeammin — koska MoE liikuttaa vain ~12B parametria tokenia kohden; (3) Nemotron 3 Super -malli paljastaa `thinking`- ja työkalukutsukyvykkyydet natiivisti, joita Brain-Memory-Body-Hands -arkkitehtuuri (osio 4.3) vaatii agenttipäätösketjuihin. Ensisijainen tier vaihdettiin siten `llama3.3:70b`:stä `nemotron-3-super`:iin; samanaikaisesti Fast-tier päivitettiin `qwen2.5-coder:32b`:stä `qwen3-coder:30b`:hen (MoE 30B / 3,3B aktiivisia), joka toimii kaksoisroolissa myös SyntheticDataAgentin opettajamallina. **OpenClaw** lisättiin ensiluokkaisena compose-palveluna porttiin 8090, sen Brain kytkettiin Nemotron 3 Superiin Ollaman kautta ja `OPENCLAW_ALLOW_EGRESS=false` valvotaan konttitasolla — luoden no-egress paikallisen agenttiajoympäristön olemassa olevan Stage 1.5 OpenSandbox -eristyskerroksen rinnalle. Toteutusartefaktit: `docs/field-notes/2026-03-29-dgx-spark-primary-runtime-setup.md` v1.6, `DWS_DEPLOYMENT_STANDARD.md` v1.4 (Surfaces-taulukkoon lisätty OpenClaw-rivi), `infrastructure/dgx-spark/docker-compose.yml`, `DWS7_ROADMAP.md` PR 161 uudelleenperustettu Nemotron 3 Superiin. Markkinasignaaliperustelu (laskentaniukkuus, NVFP4-laitteistovallihauta) on dokumentoitu tiedostossa `docs/PHD_FIREHORSE_FI.md` §14.18 master-vs-PhD-skooppisäännön mukaisesti.

### 10.10.7 Agenttimuistin faktojen poimintaputki (PR-254)

_Sessio: claude/agent-memory-fact-extraction-gLEss | Päiväys: 23.03.2026_

EMPO²:n teoreettinen kehys (osio 10.10.4) operationalisoitiin **agenttimuistin faktojen poimintaputkella** — ensimmäinen tuotantototeutus ei-parametrisesta muistipäivityspolusta. Tämä ratkaisee kriittisen puutteen: agentit, jotka keskustelevat asiakkaiden kanssa mutta eivät säilytä strukturoitua tietoa sessioiden välillä.

**Arkkitehtuuri — kaksoismuistimalli:**

| Kerros                         | Tietotyyppi  | Lähde                                         | Esimerkki                           |
| ------------------------------ | ------------ | --------------------------------------------- | ----------------------------------- |
| **LWM (Lifetime World Model)** | Domainitieto | EU-säädökset, päästökertoimet, toimialamallit | "CBAM-raja on 150 000 EUR"          |
| **Asiakasmuisti**              | Suhdetieto   | Keskustelut, sähköpostit, kokoukset           | "ACME Corp suosii viikkoraportteja" |

LWM tarjoaa _mitä agentti tietää maailmasta_; asiakasmuisti tarjoaa _mitä agentti tietää tästä asiakkaasta_. Kumpikaan yksinään ei riitä — agentti, joka tuntee EU-säädökset mutta unohtaa asiakkaan toimialan, kysyy samat kysymykset joka sessiossa.

**Faktojen poimintaputki:**

```
Keskusteluteksti
  → LLM-poiminta (Claude Haiku, strukturoitu kehote)
  → JSON-taulukko: {subjekti, predikaatti, arvo, luottamus, kategoria}
  → Luottamussuodatin (≥0,7 kynnysarvo)
  → Duplikaattitunnistus (kosinisimilaarisuus >0,95 pgvectorissa)
  → Tallennus `fact`-tyyppisenä semantic_memories-tauluun
  → Käytettävissä hakuun hybridihakuna (vektori + teksti)
```

**Kolme puuttuvaa suorituskerrosta:**

Faktojen poiminta yksinään luo _passiivista tietoa_. Kolme lisäkerrosta vaaditaan tiedon _toiminnallistamiseen_:

1. **Firehorse-tilakonemasiina** — Suorituskerros, joka toimii muistin ja LWM:n tiedon perusteella. Ilman sitä alustalla on tieto mutta ei toimintakykyä.

2. **ERP-liitinkerros** — Reaalimaailman datasyöte. Muisti ja LWM ovat vain yhtä hyviä kuin Visma/IFS/SAP:sta tuleva data. Asiakasmuisti tallentaa _ilmaistut_ mieltymykset; ERP-data paljastaa _todellisen_ käyttäytymisen.

3. **KYA-hallintakehys** — Luottamuskerros. Asiakasmuisti + LWM ilman todistusta on chatbot. KYA (Know Your AI, sisäinen v1.4 / julkinen v1.1) käärii jokaisen muistipäätöksen auditoitavalla alkuperällä: "fakta A korvasi faktan B ajanhetkellä X, hyväksyjä agentti Y, kirjattu Firehorseen." Tämä on välttämätöntä EU-vaatimustenmukaisuusauditoinneissa CSRD:n ja EU AI Act artikla 12:n nojalla.

**KYA-ensisijainen PR-järjestys:**

| Prioriteetti | PR  | Ominaisuus                        | Tila                           |
| ------------ | --- | --------------------------------- | ------------------------------ |
| 1            | 254 | Faktojen poiminta                 | ✅ Toimitettu                  |
| 2            | 255 | Ristiriitojen ratkaisu            | Vaatii muistivaraston          |
| 3            | —   | KYA-muistin auditointipolku       | Vaatii ristiriitojen ratkaisun |
| 4            | 257 | Luottamuksen rappeutumispisteytys | Itsenäinen                     |
| 5            | 256 | Konsolidoinnin ajastettu tehtävä  | Vaatii rappeutumispisteytyksen |
| 6            | 259 | Liitin-synkronointi               | Vaatii vakaan muisti-API:n     |
| 7            | 258 | Supermemory MCP EU-itseisännöinti | Infrastruktuuri, viimeinen     |

**Avainpanos #20:** Ensimmäinen tuotantototeutus agenttimuistin faktojen poiminnasta EU-yhteensopivalla teollisella tekoälyalustalla, osoittaen kaksois-LWM/asiakasmuistiarkkitehtuurin ja tunnistaen kolmikerroksisen suorituspuutteen (tilakonemasiina, ERP-liittimet, KYA-hallinta), joka vaaditaan toiminnalliseen yrityksen tekoälymuistiin.

---

## 10.11 Toimitusjohtajan automaatioagenttiryhmä

_Käyttöönotettu: 24.02.2026 | Commit: claude/ai-agent-orchestration-t89Ig_

Kolme tuotantoagenttia automatisoivat toimitusjohtajan päivittäisen operatiivisen rytmin — GitHub Actions cron, Supabase ja Resend.

### 10.11.1 Captain Pre-Briefing -agetti

**Laukaisu:** 07:30 Helsinki, ma–pe | **Tiedosto:** `src/captain-briefing/`

Valmistelee esikäyntiybriefauksen jokaiselle aktiiviselle myyntikontaktille (captain), jolla on tänään toimenpide määräaikana. Hakee viestintähistorian, yhteystiedot, tarjoukset ja kokoukset Supabasesta, generoi puheenvuorot ja suositeltavan seuraavan toimenpiteen, lähettää pimeäteemai HTML-sähköpostina Resendillä.

### 10.11.2 LinkedIn-julkaisuajastin

**Laukaisu:** 08:00 Helsinki, ma–pe | **Tiedosto:** `src/social-scheduler/`

Viikoittainen sisältökalenteri kategoriasidonnaisilla julkaisupohjilla (ma=thought leadership, ti=vaatimustenmukaisuus, ke=tuote, to=tapaustutkimus, pe=ekosysteemi). Toimitusjohtajan hyväksyntätiivistelmä sähköpostitse — vastaa hyväksy/muokkaa/hylkää per luonnos. Julkaisujono Supabasessa.

### 10.11.3 EU-sääntelymonitori

**Laukaisu:** 05:30 Helsinki, ma–pe (ennen briefausta) | **Tiedosto:** `src/regulation-monitor/`

Hakee RSS-syötteitä EU-komissiolta, EUR-Lexistä, Carbon Pulselta ja Euractiv'ista. Luokittelee päivitykset sääntelyn mukaan (CBAM, CSRD, Fit for 55, EPBD, EU AI Act, ETS) vakavuuspistein (kiireellinen/tärkeä/tieto) ja asiakkaan vaikutustunnistuksella. Syöttää sääntelyhälytykset LinkedIn-ajastimeen sisältöideoina.

**Solution Factory -validointi:** Kaikki kolme agenttia toteutettiin yhdessä sessiossa samoja malleja noudattaen — vahvistaa toimintamallin toistettavuuden uusille agentityypeille.

---

## 10.12 Strategiset kumppanuudet: NVIDIA, Siemens, ABB, xAI & Mistral

_Dokumentoitu: 27.02.2026 | Lähde: docs/DWS6_TO_DWS7_UPDATE.md v1.1_

DWS7 rakentaa monipuolisen kumppaniekosysteemin kattaen teollisuusautomaation (NVIDIA, Siemens, ABB), rajatekoälyn (xAI, Mistral) ja reunalaskennan. Jokainen kumppani täyttää erillisen roolin Aivot-Muisti-Keho-Kädet -arkkitehtuurissa.

| Kumppani    | Rooli arkkitehtuurissa                                                                     | Integraatiotila             |
| ----------- | ------------------------------------------------------------------------------------------ | --------------------------- |
| **NVIDIA**  | GPU-laskenta (Aivot), Jetson-reuna (Kädet), Omniverse-digitaalinen kaksonen (Keho)         | Inception-ohjelma Q2 2026   |
| **Siemens** | MindSphere IoT (Kädet), digitaalinen kaksonen (Keho), Xcelerator-markkinapaikka            | Developer-pääsy Q2 2026     |
| **ABB**     | Teollisuusautomaatio + robotiikka (Kädet), sähkönjakeluverkkojen hallinta                  | Integraatiotavoite Q3 2026  |
| **xAI**     | Reaaliaikainen markkinaälykkyys Grok, X/Twitter-signaalihavaitseminen (Aivot)              | Aktiivinen (tuotanto)       |
| **Mistral** | EU-suvereeni tekoälyinferenssi, monikielinen vaatimustenmukaisuusgenerointi (Aivot/Muisti) | Suunniteltu Q3 2026         |
| **Red Hat** | AgentOps BYOA -alusta (Keho), OpenShift AI agenttien käyttöönottoon, hybridipilvi-infra    | Aktiivinen (maaliskuu 2026) |

### 10.12.1 Monituottaja-LLM-reititinarkkitehtuuri

DWS7 valitsee LLM:n tehtävätyypin mukaan kolmen kriteerin perusteella: **EU-suvereniteetti**, **kustannus** ja **latenssi**:

```
Tehtävätyyppi → LLM-valinta
  Vaatimustenmukaisuusgenerointi (CSRD, CBAM)  → Claude (päättelysyvyys) tai Mistral (EU-suvereeni)
  Reaaliaikainen markkinasignaalinanalyysi       → xAI Grok (live X/Twitter-data)
  Koodingenerointi                              → Claude tai Groq (Llama 70B, nopea)
  Kevyt tiivistäminen                           → Groq (Haiku-nopeus)
  Reunainferenssi (Acer Veriton)                → Qwen 2.5 72B (QLoRA-hienosäädetty, paikan päällä)
```

### 10.12.2 Red Hat — AgentOps ja hybridipilvi-infrastruktuuri

_Lisätty: 21.03.2026 | Lähde: Red Hat "The Adaptable Enterprise" -avainlöydökset (2025), Mikko Pylväs (Red Hat Finland AI-tapahtuma, maaliskuu 2026)_

Red Hatin AgentOps-strategia — **Bring Your Own Agent (BYOA)** — tarjoaa yritys-Kubernetesin (OpenShift) tekoälyagenttien käyttöönotto- ja orkestrointikerrokseksi. Heidän ydinteesin: mukautuvuus on edellytys minkä tahansa tekoälystrategian onnistumiselle.

**Strateginen yhteensopivuus DWS IQ 6:n kanssa:**

- **Hybridipilvi-imperatiivi:** Red Hat tunnistaa, että onnistunut tekoälystrategia on oltava hybridipilvistrategia — kouluta, viritä ja aja malleja missä tahansa data sijaitsee vaarantamatta turvallisuutta, vaatimustenmukaisuutta tai datasuvereniteettia. Tämä kartoittuu suoraan DWS IQ 6:n käyttöönottomalliin (EU-pilvi + GN-100-reuna + Aiven-overlay).
- **Modernisoi ennen automatisointia:** Avoin, joustava hybridipilvi (Linux, kontit, Kubernetes) linjautuu DWS7:n konttinatiiviin arkkitehtuuriin.
- **Red Hat + NVIDIA yhteistyö** turvallisessa tekoälyagenttiinfrastruktuurissa tukee suoraan KYA-hallittua agenttien eristysmallia.
- **MCP siltana:** Red Hat tunnistaa MCP:n kriittiseksi vanhojen järjestelmien ja agenttitekoälyn yhdistämisessä — validoiden DWS IQ 6:n MCP Hub -arkkitehtuurin (osio 2.5.3).
- **Osaamisvaje:** 42 % organisaatioista on estetty talon sisäisen tekoälyosaamisen puutteen vuoksi (Bain & Company, 2025), mikä validoi hallitun alustamallin.

### 10.12.3 Tutkimuskontribuutio

Monituottajaekosysteemi validoi **Solution Factory -mallin kolmannen pilarin** (osio 4.1.3 — jakeluleverage). Kytkemällä DWS7 Siemens Xceleratoriin, NVIDIA Inceptioniin ja Red Hatin OpenShift-ekosysteemiin alusta saa pääsyn 10 000+ teollisuusasiakkaaseen ilman suoran myyntiorganisaation rakentamista — yhdenmukainen kumppanuusjakelustrategian kanssa.

Monituottaja-LLM-reititin osoittaa käytännön ratkaisun **EU AI Act -suvereniteettijännitteeseen**: säännellyt toimialat voivat käyttää Mistralia vaatimustenmukaisuusgeneroinnissa (EU-domisiili, GDPR-yhteensopiva) hyödyntäen samalla Claudea ja Grookia säätelemättömiin analyyttisiin tehtäviin. Red Hatin BYOA-kehys vahvistaa edelleen tätä arkkitehtuuria — yritysasiakkaat voivat tuoda omat agenttikehyksensä, kun DWS IQ tarjoaa hallitun orkestroinnin ja vaatimustenmukaisuuskerroksen.

---

# 11. Lähteet

## Akateeminen kirjallisuus

1. Ries, E. (2011). _The Lean Startup: How Today's Entrepreneurs Use Continuous Innovation to Create Radically Successful Businesses_. Crown Business.

2. Blank, S. (2013). _The Four Steps to the Epiphany: Successful Strategies for Products that Win_. K&S Ranch.

3. Parker, G., Van Alstyne, M., & Choudary, S. (2016). _Platform Revolution: How Networked Markets Are Transforming the Economy_. W.W. Norton.

4. Euroopan komissio (2021). _Teollisuus 5.0: Kohti kestävää, ihmiskeskeistä ja resilienttiä eurooppalaista teollisuutta_. EU:n julkaisutoimisto.

5. Shi, W., Cao, J., Zhang, Q., Li, Y., & Xu, L. (2016). "Edge Computing: Vision and Challenges." _IEEE Internet of Things Journal_, 3(5), 637-646.

6. Christensen, C. M., Hall, T., Dillon, K., & Duncan, D. S. (2016). "Know Your Customers' Jobs to Be Done." _Harvard Business Review_, 94(9), 54-62.

7. Wooldridge, M. (2009). _An Introduction to MultiAgent Systems_ (2. painos). Wiley.

8. Jennings, N. R., & Wooldridge, M. (1998). "Applications of intelligent agents." _Agent Technology: Foundations, Applications, and Markets_, 3-28.

## Moniagenttijärjestelmät ja AI-koordinointi

9. LangChain Documentation (2024). "Building LLM Applications with Composable Components." https://docs.langchain.com

10. Anthropic (2024). "Model Context Protocol Specification." https://modelcontextprotocol.io

11. NVIDIA (2024). "Jetson Orin Nano Developer Kit: Technical Specifications." https://developer.nvidia.com/embedded/jetson-orin-nano

## Toimialaraportit

12. Euroopan komissio & Ramboll (2025). "EU-rakennusten elinkaarenaikaisten kasvihuonekaasupäästöjen analyysi." DG Environment.

13. GRESB (2024). "Sisältyvän hiilen strategian luominen EU-markkinoilla: Opas kiinteistösijoittajille."

14. Eurofound & Cedefop (2025). "Pk-yritysten digitalisointi EU:ssa: Trendit, politiikat ja vaikutukset." EU:n julkaisutoimisto.

15. McKinsey & Company (2024). "The State of AI in Construction: Adoption, Impact, and Future Outlook."

## Säädökset ja standardit

16. NIS 2 -direktiivi (EU) 2022/2555
17. EU AI Act (EU) 2024/1689
18. Yleinen tietosuoja-asetus (GDPR) (EU) 2016/679
19. Kyberturvallisuusasetus (EU) 2019/881
20. ISO/IEC 27001:2022
21. European Commission (2025). _Omnibus package_.
22. EN 15978:2011 Rakentamisen kestävyys
23. Rakennusten energiatehokkuusdirektiivi (EPBD) (EU) 2024/1275
24. Google Merchant Center -tekniset määritykset (2026)
25. Revolut Business API -dokumentaatio
26. Anthropic Claude Code -dokumentaatio

## Sisäiset viiteartefaktit

27. Lifetime Oy (2026). _Lifetime World LLM Scaling Blueprint (GN-100 hybridi + pilvipolku)._ `Admin/Model/LLM_TRAINING_FEASIBILITY.md`.
28. Anonymous (2026). "Exploratory Memory-Augmented LLM Agent via Hybrid On- and Off-Policy Optimization (EMPO²)." arXiv:2602.23008. https://arxiv.org/abs/2602.23008
29. Alibaba Group (2026). "OpenSandbox: General-Purpose Sandbox Platform for AI Applications." https://github.com/alibaba/OpenSandbox

30. LUT-yliopisto (2026). _Tekoälytyökalujen käytänteet_. Lappeenrannan-Lahden teknillinen yliopisto LUT. https://elut.lut.fi/fi/opintojen-suorittaminen/opintoja-ohjaavat-saadokset-ja-ohjeet/tekoalytyokalujen-kaytanteet

31. Lifetime Oy (2026). _DWS Security Standard_, versio 1.5. `DWS_SECURITY_STANDARD.md`. Sisäinen viitekehys, joka ohjaa tekoälyn turvallisuutta, väliohjelmiston tietoturvakontrolleja (korrelaatio-ID, Zod-validointi, keskitetty virhekäsittely), CORS-käytäntöjä, SRI-eheyttä, artikla 12 -kirjausta ja API-rajapinnan validointia. Määrittelee tietoturva-arkkitehtuurin kaikille backend-API-reiteille ja MCP-agenttipalvelimelle.

32. Lifetime Oy (2026). _ESRS-tietopisterekisteri_, versio 1.0. `src/compliance/esrs-registry.ts`. Koneluettava kartoitus kaikista 82 eurooppalaisesta kestävyysraportointistandardien (ESRS) tiedonantovaatimuksesta kategorioittain E1–E5 (ympäristö), S1–S4 (sosiaalinen) ja G1 (hallinto). Kukin tiedonanto on luokiteltu pakolliseksi tai vapaaehtoiseksi CSRD-direktiivin (EU) 2022/2464 mukaisesti.

33. Lifetime Oy (2026). _Vaatimustenmukaisuuden pisteytysmoottori_, versio 1.0. `src/compliance/scoring-engine.ts`. Deterministinen vaatimustenmukaisuuden pisteytysalgoritmi, joka laskee CSRD-valmiuden, ETS-altistuksen ja CBAM-riskipisteet. Kaava: kokonaispistemäärä = CSRD(0,50) + ETS(0,25) + CBAM(0,25), jossa CSRD = (annetut pakolliset tietopisteet / pakolliset yhteensä) × 80 + bonusmuuttujat.

34. Lifetime Oy (2026). _Site Quality Standards_, versio 2.1. `SITE_QUALITY_STANDARDS.md`. Koodin laatu-, komponenttiarkkitehtuuri- ja käyttöliittymän vikasietoisuusstandardit DWS IQ -hallintapaneelille. Määrittelee ErrorBoundary-, Skeleton-lataus- ja EmptyState-komponenttistandardit yritystason käyttökokemukselle.

35. Lifetime Oy (2026). _AGENTS.md_, versio 2.2. `AGENTS.md`. Agentti-inventaario ja operatiiviset ohjeet agents.md-avoimen spesifikaation mukaisesti. Dokumentoi 15 tekoälyagenttia, vaatimustenmukaisuuden pisteytysarkkitehtuurin, väliohjelmistopinon järjestyksen ja "Build for Agents" -tuotesäännön, joka edellyttää CLI + MCP + Skills -rajapintoja.

36. Lifetime Oy (2026). _DWS IQ Platform Admin Manual_, versio 2.7. `Admin/ADMIN_MANUAL.md`. Operatiiviset menettelyt terveystarkistusten valvontaan, vaatimustenmukaisuusmoottorin hallintaan ja hallintapaneelin vikasietoisuuden vianetsintään. Sisältää Claude Code -projektin suunnittelurakenteen ja moniagenttiorkestrointiosiot.

37. Lifetime Oy (2026). _Enterprise Security & Compliance_, versio 1.8. `Admin/SECURITY_COMPLIANCE.md`. Tietoturvakontrollit tietoturvajohtajille ja hankintatiimeille. Dokumentoi agenttien ajonaikaiset turvakontrollit, hallintapaneelin vikasietoisyyskontrollit, backend-väliohjelmiston turvakontrollit ja vaatimustenmukaisuusmoottorin tietosuojan RLS-käytännöillä.

---

## 10.13 Claude Code -suunnittelurakenne: tekoälytyönkulku ensiluokkaisena ohjelmistokomponenttina

### 10.13.1 Motivaatio

Claude Code -käytön laajetessa yksittäisistä kokeiluista skaalautuviin järjestelmiin syntyy merkittävä arkkitehtuurinen jakolinja: projektit, jotka käsittelevät tekoälytyönkulkuja väliaikaisina chat-vuorovaikutuksina, eroavat selvästi niistä, jotka suunnittelevat ne ensiluokkaisina ohjelmistokomponentteina. DWS6-repositorio edustaa jälkimmäistä lähestymistapaa, ja tässä osiossa dokumentoidaan periaatteet, jotka mahdollistavat sen toimivuuden yritystasolla.

Ydinajatus — jonka kehittyvä Claude Code -yhteisön käytäntö validoi vuonna 2026 — on, että **ohjelmistosuunnittelussa käytettävää vastuiden erottelua sovelletaan yhtä lailla tekoälytyönkulkujen suunnitteluun**. Kehote ei ole tuote; taito on.

### 10.13.2 CLAUDE.md projektimuistina

Perinteinen tekoälykäyttö toistaa kontekstin jokaisessa kehotteessa, mikä aiheuttaa kaksi kumuloituvaa ongelmaa: tokenien tuhlausta ja käytöksessä ajautumista. DWS6:n ratkaisu on `CLAUDE.md` — elävä määrittelytiedosto, joka toimii jaettuna institutionaalisena muistina kaikissa tekoälysessioissa ja -työkaluissa.

DWS6:n `CLAUDE.md` (yli 2 000 riviä versiosta 3.17 alkaen) kokoaa yhteen:

| Kategoria                  | Sisältö                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------- |
| **Standardit**             | Brändi, asiakirja, tietoturva, markkinatutkimus, Gamma UI                           |
| **Arkkitehtuuri**          | Brain-Memory-Body-Hands, kaksoiskansiorakenne, kaupan päivityssäännöt               |
| **Rajoitteet**             | Tiedostojen käsittely (git mv, ei poistoa), julkaisusäännöt, sähköpostisäännöt      |
| **Ehdottomat vaatimukset** | EU:n tietojen sijaintivaatimukset, GDPR, Article 12 -kirjaus, tietoturvaohjelmointi |
| **Suojamekanismit**        | execFile vs exec, CORS-käytäntö, SRI-tiivisteen valvonta                            |

Mitattu vaikutus: jokainen uusi Claude Code -sessio perii 18 kuukauden arkkitehtuuripäätökset ilman ihmisen toistoa. VERSION AND AGENT HISTORY -lohko jokaisessa asiakirjassa laajentaa tämän yksittäisiin tiedostoihin — jokaisessa asiakirjassa on oma muokkaushistoriansa, joka on sekä ihmisten että agenttien luettavissa.

### 10.13.3 Taidot uudelleenkäytettävinä työnkulkukomponentteina

Siirtymä ad hoc -kehotteista uudelleenkäytettäviin taitoihin edustaa perustavanlaatuista arkkitehtuurista parannusta: **chat-vuorovaikutuksesta järjestelmäsuunnitteluun**. Taidot ovat koottavia, versioituja työnkulkukomponentteja — ei kertakäyttöisiä kehotteita.

Maaliskuuhun 2026 mennessä DWS6 toteuttaa 21 tuotantotaitoa neljässä kategoriassa `.claude/commands/`- ja `skills/`-kansioissa:

**Slash-komennot (17 taitoa):**

| Kategoria               | Taidot                                                                          | Toimiala                                         |
| ----------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------ |
| gstack-työnkulku        | `/plan-ceo-review`, `/plan-eng-review`, `/review`, `/ship`, `/browse`, `/retro` | Kehityksen elinkaari (Garry Tan -menetelmä)      |
| EU-vaatimustenmukaisuus | `/compliance-check`, `/carbon-analysis`, `/sovereignty-assess`, `/site-safety`  | ETS, CBAM, CSRD, EN 15978, EN 13001, CLOUD Act   |
| Agenttien hallinta      | `/discover-agents`, `/agent-run`, `/workflow`                                   | Moniagenttiorkestrerointi (14+ agenttia)         |
| Toiminnot               | `/flow-status`, `/email`, `/remote-control`                                     | Git-tila, SES-sähköposti, reunalaitteen hallinta |
| Koodin laatu            | `/simplify`, `/designer`                                                        | Koodin tarkastus, Figma-koodisiltä               |

**Kurinpitotaidot (4 kovaa porttia `skills/*/SKILL.md`-tiedostoissa):**

| Taito               | Porttilogiikka                                                                  | Valvonta                    |
| ------------------- | ------------------------------------------------------------------------------- | --------------------------- |
| `verification-gate` | Estää valmistumisilmoitukset ilman tuoretta testitodistetta                     | Paluukoodi 2 (ESTÄ)         |
| `design-first`      | Estää 3+ tiedoston muutokset ilman hyväksyttyä suunnitelmaa                     | Paluukoodi 2 (ESTÄ)         |
| `dual-folder-sync`  | Estää commitit jotka muuttavat juurikansioita ilman landing-pages-synkronointia | Paluukoodi 2 (ESTÄ)         |
| `last30days`        | Tutkimusagentti Reddit/X/Web-sisällölle viimeiseltä 30 päivältä                 | Agenttityylinen (ei-estävä) |

**Aliagentit (4 erikoistunutta agenttia `.claude/agents/`-kansiossa):**

| Agentti             | Rooli                                                                   | Eristysominaisuus                        |
| ------------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| `mcp-expert`        | MCP-palvelinkonfiguraation asiantuntija                                 | Suojaa pääkontekstin protokollatiedoilta |
| `code-reviewer`     | Staff Engineer -virheiden etsijä (logiikka, tietoturva, tietojen eheys) | Tarkastaa ilman muutosten tekemistä      |
| `security-reviewer` | OWASP Top 10 + DWS Security Standard -auditoija                         | Skannaa ilman koodin muokkaamista        |
| `architect`         | Minimalistinen suunnittelija, ylisuunnittelun ehkäisijä                 | Palauttaa vain jäsennellyn suunnitelman  |

Jokainen taito kapsuloi syötteiden validoinnin, agenttien suorituksen ja jäsennellyn tulosteen muotoilun. Kurinpitotaidot edustavat uutta kontribuutiota: **estävät portit**, jotka valvovat prosessikuria rakenteellisesti eikä käyttäytymispohjaisesti. Toisin kuin neuvoa-antavat linterit, näitä portteja ei voi ohittaa — ne sieppaavat työkalukutsut hook-paluukoodilla 2 (ESTÄ) ja estävät toiminnon suorittamisen. Tämä toteuttaa suoraan **Build for Agents** -periaatteen: jos ominaisuutta ei voi kutsua komennolla `dws <komento>`, sitä ei toimiteta.

### 10.13.4 Koukut automaattisena laadunvalvontana

Koukut ovat tekoälytyönkulkusuunnittelun valvontakerros — ja nykyisessä käytännössä eniten alihyödynnetty malli. Siinä missä taidot määrittelevät uudelleenkäytettäviä kykyjä, koukut valvovat automaattisesti ja kiistattomasti laadun reunaehtoja.

DWS6 toteuttaa koukkuja kahdella tasolla:

**Claude Code -koukut** (`.claude/hooks/`):

- Työkalun tulosteen muuntaminen — normalisoi agentti-JSON-vastaukset yhdenmukaiseen skeemaan
- Jäsennellyn tulosteen tarkistaminen — varmistaa, että kaikki CLI-komennot tuottavat kelvollista JSON:ia
- Session käynnistyksen validointi — tarkistaa ympäristön valmiuden ennen agentin työtä

**Git-koukut** (`.githooks/`):

- Haaranimen valvonta — `claude/<ominaisuus>-<id>` -nimeämiskäytäntö ennen commit-operaatiota
- Ennen commit -tietoturvatarkistukset — kovakoodattujen salaisuuksien ja vaarallisten exec()-kaavojen tunnistaminen

Koukkujen kriittinen ominaisuus on **kiistaamattomuus**: toisin kuin CLAUDE.md-ohjeet (joita agentti saattaa noudattaa epätäydellisesti), koukut sieppaavat työkalukutsut ja joko muuntavat tai estävät ne. Tämä on välttämätöntä tuotantotekoälytyönkuluille, joissa manuaalinen tarkistus ei skaalaudu ja laadun takeet on oltava rakenteellisia, ei käyttäytymiseen perustuvia.

### 10.13.5 Aliagentit ja rinnakkaissuoritus

DWS6-arkkitehtuuri käyttää erikoistuneita aliagentteja eri tehtäväluokkiin, laajentaen moniagenttiorkestroinnin periaatteen Firehorse-tuotantotyönkuluista kehitystyönkulkuun:

| Aliagenttityyppi    | Rooli                                         | Eristysominaisuus                                            |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| **Explore**         | Koodikannan haku, tiedostomallien sovitus     | Suojaa pääkontekstin suurilta tulosjoukoilta                 |
| **Plan**            | Arkkitehtuurisuunnittelu, kompromissianalyysi | Palauttaa jäsennellyn suunnitelman ilman muutosten tekemistä |
| **Yleiskäyttöinen** | Monivaiheinen tutkimus, asiakirja-analyysi    | Täysi työkalujen käyttö monimutkaiseen tutkimukseen          |
| **Tausta**          | Itsenäiset rinnakkaiset tehtävät              | Ei-blokkaava; ilmoittaa valmistumisesta                      |

Eristysominaisuus on kriittinen mittakaavassa: aliagentit estävät konteksti-ikkunan loppumista suurissa koodipohjissa samalla kun ne mahdollistavat toisistaan riippumattomien tehtävien rinnakkaissuorituksen. Firehorse-tuotanto-orkestrointi (Temporal.io + tapahtumaväylä, osio 10.7) laajentaa tämän saman mallin asiakaspalveluagentin työnkulkuihin.

### 10.13.6 Vaikutukset Solution Factory -malliin

Tämä suunnittelurakenne validoi ja laajentaa Solution Factory -mallia (osio 5) konkreettisella toteutuskerroksella, joka kartoittuu suoraan Brain-Memory-Body-Hands-arkkitehtuuriin:

| Solution Factory -kerros         | Claude Code -toteutus                   | Arkkitehtuurikerros |
| -------------------------------- | --------------------------------------- | ------------------- |
| Tiedon pysyvyys                  | CLAUDE.md + VERSION AND AGENT HISTORY   | Muisti              |
| Agenttien koordinointi           | Aliagentit + jaettu CLAUDE.md-konteksti | Aivot               |
| Uudelleenkäytettävät kyvykkyydet | Taidot (`.claude/commands/`)            | Vartalo             |
| Laadun valvonta                  | Koukut (`.claude/hooks/`, `.githooks/`) | Kädet               |
| Rinnakkaissuoritus               | Taustaagentit + Temporal.io             | Aivot               |

**Keskeinen tutkimustulos:** tekoälytyönkulkujen käsitteleminen ensiluokkaisina ohjelmistokomponentteina — samalla modulaarisuudella, testattavuudella ja vastuiden erottelulla kuin tuotanto-ohjelmistossa — on erottava tekijä tekoälykokeilujen ja tekoälytuotteiden välillä. DWS6-repositorion rakenne osoittaa tämän eron tuotantomittakaavassa: CLAUDE.md vähentää käyttäytymisessä ajautumisen lähes nollaan, taidot eliminoivat toistuvan kehottamisen, ja koukut valvovat laatua ilman ihmisen puuttumista.

Tämä on linjassa tässä opinnäytetyössä dokumentoidun laajemman periaatteen kanssa: Firehorse Operations Model menestyy ei siksi, että se käyttää tekoälyä, vaan siksi, että se suunnittelee tekoälyn kurinalaiseksi järjestelmäksi.

### 10.13.7 Kilpailija-analyysi: Toimialakohtainen vs geneerinen AI-harness

Maaliskuussa 2026 suoritettu vertailututkimus vertasi DWS6-harness-arkkitehtuuria **everything-claude-code (ECC)** -kehykseen — 120 000 tähden MIT-lisensoituun kehykseen, joka tarjoaa 136 taitoa, 30 aliagenttia, 60 slash-komentoa, 34 sääntötiedostoa ja 14 MCP-palvelinmallia. Vertailu paljastaa perustavanlaatuisen arkkitehtuurisen kompromissin geneerisyyden ja toimialaspesifisyyden välillä.

**ECC-arkkitehtuuri (geneerinen):**
ECC vastaa kysymykseen: "Kuinka käytän Claude Codea tehokkaasti missä tahansa projektissa?" Se tarjoaa kielikohtaiset agentit (TypeScript, Python, Go, Java, Rust, C++, Swift, PHP), IDE-adapterit, PM2-elinkaarenhallinta, SQLite-sessiopersisteenssi ja 997-testin validointisarja.

**DWS6-arkkitehtuuri (toimialakohtainen):**
DWS6 vastaa eri kysymykseen: "Kuinka ajetaan yritystason teollisia tekoälyagentteja turvallisesti EU:ssa?" 21 taitoa koodaavat säänneltyä toimialatietämystä — EU ETS -päästökertoimet, CBAM-tuontirajat, CSRD-tiedonantovaatimukset, EN 15978 -elinkaaren vaiheet, EN 13001 -nosturiturvallisuusstandardit — joita mikään geneerinen kehys ei tarjoa. Tämä toimialatietämys on tuotteen kilpailuvallihauta.

**Kuusi tunnistettua kilpailuetua:**

| #   | DWS6-etu                                                             | ECC-vastine                           | Tutkimuksellinen merkitys                      |
| --- | -------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| 1   | **Toimialakohtaiset taidot** koodaavat EU-sääntelyä                  | Geneeriset kieli-/kehystaidot         | Toimialatietämys kilpailuvallihautana          |
| 2   | **Kuusikerroksinen tietoarkkitehtuuri** (L0-L6)                      | Toimii vain tasoilla L2-L3            | Syvempi hallinta agentin käyttäytymiseen       |
| 3   | **Kovat portit** (verification-gate, design-first, dual-folder-sync) | Vain neuvoa-antavat taidot            | Rakenteellinen valvonta vs käyttäytymisehdotus |
| 4   | **Luottamusvyöhykkeet** (VIHREÄ/KELTAINEN/PUNAINEN)                  | Vain salaisuuksien skannaus           | Riskisuhteutettu automaatio                    |
| 5   | **gstack-työnkulku** pakotetulla roolierottelulla                    | Itsenäiset orkestroitumattomat taidot | Kognitiivisen tilan vaihtaminen                |
| 6   | **Agentti-ensin -tuotesääntö** (5-portin toimitustarkistuslista)     | Kehittäjän apuvälineet                | Taidot tuoterajapintoina                       |

**Keskeinen tutkimustulos:** ECC-kehys optimoi **leveyteen** (136 taitoa × useita kieliä × useita IDE:itä), kun taas DWS6 optimoi **syvyyteen** (21 taitoa × syvä EU-sääntelyn tuntemus × rakenteellinen valvonta). Token-budjetin tasolla leveys on haitallista: 136 taidon lataaminen kuluttaa konteksti-ikkunan kapasiteettia, jota toimialakohtaiset agentit tarvitsevat sääntelyn päättelyyn. DWS6:n <150 sanan rajoitus kurinpitotaidoille ei ole rajoitus — se on token-budjetin optimointi, joka mahdollistaa syvemmän toimialapäättelyn samassa konteksti-ikkunassa.

Tämä validoi harness engineering -teesin (osio 10.16): ero tekoälykokeilujen ja tekoälytuotteiden välillä ei ole malli tai taitojen määrä — se on suunnittelukuri, joka sovelletaan tiedon rakenteiseen, valvontaan ja koostamiseen. 21 taidon toimialakohtainen harness ylittää 136 taidon geneerisen harnessin, kun toimiala vaatii sääntelyn tarkkuutta, koska tietämyksen syvyys on tärkeämpää kuin kyvykkyyden laajuus.

---

# 12. Liitteet

## Liite A: Solution Factory Canvas

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     FIREHORSE SOLUTION FACTORY CANVAS                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ONGELMA                          │  RATKAISU                            │
│  • EU-vaatimustenmukaisuuden      │  • Vaiheittainen AI-käyttöönotto     │
│    määräajat                      │  • AI-avusteinen kehitys             │
│  • Korkeat SaaS-kustannukset      │  • Reunatekoäly (<100ms)             │
│    (€1 400+)                      │  • €0-350/kk hinnoittelu             │
│  • Pelkkä pilvi -latenssi         │                                      │
│  • Ei pk-saavutettavia vaihtoeht. │                                      │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  AVAINMITTARIT                    │  EPÄREILU KILPAILUETU                │
│  • Takaisinmaksu: ≤2 kk           │  • Lifetime Scope Signals            │
│  • Kustannus: 82% halvempi        │  • AgentFoundry-pohjat               │
│  • Nopeus: +62%                   │  • EU-vaatimustenmukaisuus natiivi   │
│  • Retentio: 100%                 │  • 8 vertikaalin kattavuus           │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  ASIAKASSEGMENTIT                 │  KANAVAT                             │
│  • Rakentamisen pk-yritykset      │  • dws6.com (suora)                  │
│  • Logistiikkayritykset           │  • Kumppaniverkosto                  │
│  • Valmistus                      │  • LinkedIn (B2B)                    │
│  • 5 lisävertikaalia              │  • GitHub (kehittäjäluottamus)       │
│                                   │                                      │
├───────────────────────────────────┼──────────────────────────────────────┤
│                                                                          │
│  KUSTANNUSRAKENNE                 │  TULONLÄHTEET                        │
│  • €0-350/kk infrastruktuuri      │  • SaaS-tilaukset                    │
│  • Cursor Pro + Claude Code Max   │  • Reunalaitteiston marginaali       │
│  • Yksi kehittäjä (AI-avusteinen) │  • Ammattipalvelut                   │
│  • Ei markkinointikuluja (org.)   │  • Solution Factory -lisensointi     │
│                                   │                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Liite B: Tuotekatalogin yhteenveto

| ID                   | Tuote                   | Hinta     | Tyyppi     |
| -------------------- | ----------------------- | --------- | ---------- |
| DWS-IQ-006           | DWS IQ Platform v6      | €4 999    | Alusta     |
| DWS-IQ-005           | DWS IQ Platform v5      | €6 995    | Alusta     |
| FH-AUTO-001          | Firehorse Automation    | €4 950    | Ohjelmisto |
| FH-RPT-001           | Firehorse Report        | €1 999    | Ohjelmisto |
| FH-CMS-001           | Firehorse CMS           | €2 999    | Ohjelmisto |
| FH-OMNI-001          | Firehorse Omnichannel   | €499      | Ohjelmisto |
| LIFETIME-BUNDLE-2026 | Climate Bundle          | €6 500    | Paketti    |
| consulting-hourly    | Konsultointi tuntihinta | €98/h     | Palvelu    |
| consulting-fit55     | Fit55-asiantuntija      | €3 000/kk | Palvelu    |
| secure-email-proton  | Protonmail-toteutus     | €499      | Palvelu    |
| ai-koulutus-3d       | AI Koulutus 3 päivää    | €6 250    | Koulutus   |

## Liite C: Lifetime Scope Signals -protokollan skeema

```json
{
  "$schema": "Lifetime Scope Signals v1.0",
  "version": "1.0",
  "launch_date": "2026-02-23",
  "signal_format": "[AGENT-XX]:SIGNAL_TYPE:MILESTONE:TIMESTAMP",
  "signal_types": {
    "READY": "Virstanpylväs saavutettu, vapauttaa alavirran agentit",
    "COMPLETE": "Kaikki agentin työ valmis",
    "ERROR": "Agentti kohtasi virheen",
    "BLOCKED": "Odottaa ulkoista riippuvuutta"
  }
}
```

## Liite D: Tekoälyagenttien toimintaohjeet (Karpathyn periaatteet)

### D.1 Tausta

DWS6-projekti otti käyttöön tekoälykoodausagenttien toimintaohjeet, jotka perustuvat **Andrej Karpathyn viraaliin tekoälykoodausohjeistukseen**. Nämä ohjeet on dokumentoitu repositorion `CLAUDE.md`-tiedostossa ja ne varmistavat johdonmukaisen, laadukkaan tekoäly-ihminen-yhteistyön agenttipohjaisissa koodaustyönkuluissa.

### D.2 Perusfilosofia

```
"Sinä olet kädet; ihminen on arkkitehti.
Liiku nopeasti, mutta älä koskaan nopeammin kuin ihminen voi varmistaa.
Koodiasi tarkkaillaan — kirjoita sen mukaisesti."
```

### D.3 Kriittiset käyttäytymismallit

| #   | Käyttäytyminen                 | Kuvaus                                                    | EU:n tekoälysäädöksen yhteys      |
| --- | ------------------------------ | --------------------------------------------------------- | --------------------------------- |
| 1   | **Oletusten esiin tuominen**   | Ilmaise oletukset eksplisiittisesti ennen toteutusta      | Tukee päättelyketjua (Artikla 12) |
| 2   | **Sekaannusten hallinta**      | PYSÄHDY kun olet hämmentynyt; kysy tarkentavia kysymyksiä | Estää autonomiset virheet         |
| 3   | **Vastustaminen tarvittaessa** | Osoita ongelmat suoraan                                   | Varmistaa ihmisen valvonnan       |
| 4   | **Yksinkertaisuuden valvonta** | Vastusta aktiivisesti ylimonimutkaistamista               | Ylläpidettävyys                   |
| 5   | **Laajuuskuri**                | Koske vain sitä, mitä pyydetään                           | Auditointipolun selkeys           |
| 6   | **Kuolleen koodin hygienia**   | Kysy ennen käyttämättömän koodin poistamista              | Muutosdokumentaatio               |

### D.4 Toteutuksen tulokset

| Mittari                      | Ennen | Jälkeen | Parannus      |
| ---------------------------- | ----- | ------- | ------------- |
| Kooditarkastuksen hylkäykset | 15 %  | 3 %     | 80 % vähennys |
| Epäselvät muutosperusteet    | 25 %  | 5 %     | 80 % vähennys |
| Luvattomat laajuusmuutokset  | 10 %  | <1 %    | 90 % vähennys |
| Dokumentaation kattavuus     | 60 %  | 95 %    | 58 % parannus |

## Liite E: AI-Mallien koulutusinfrastruktuuri

### Lifetime World Model (LWM) -koulutusputki

**Laitteisto:**

- **Ensisijainen:** Acer Veriton GN-100 (omistettu, paikan päällä)
- **Kiihdytin:** NVIDIA GB10 Grace Blackwell Superchip
- **Laskentataho:** 1 PetaFLOP paikallinen päättely
- **Muisti:** 128GB yhdistetty muisti

**Koulutustyönkulku:**

1. Opetussuunnitelman suunnittelu (Claude API)
2. Synteettisen datan generointi (Claude API, 2000+ esimerkkiä per toimiala)
3. Paikallinen hienosäätö (Acer Veriton GN-100, QLoRA, 16h per malli)
4. Arviointi & käyttöönotto (Claude-as-judge, tavoite >7.0/10)

**Kustannus:** €80-125 per toimialamalli (vs. €15 000+ perinteisesti, 99% kustannusvähennys)

### LWM-koulutus — Varmennettu laitteistotodellisuus (v3.88-täydennys)

_Toteutusnäytön skooppikorjaus yllä olevaan putkeen (§1.4 master-vs-PhD-skooppisäännön mukaan). Yllä kuvattu toimialakohtainen QLoRA-hienosäätö — pienet mallit, ~16 h GN-100:lla — on toteutettavissa ja säilyy toimitettuna reittinä. Tämä alaluku tekee näkyväksi rajan jonka heinäkuun 2026 varmennus paljasti; yllä oleva teksti säilytetään muuttumattomana (Rule 12)._

**GN-100 on reunainferenssi-/kehitysnode, ei koulutusklusteri.** Se hienosäätää (QLoRA) pieniä malleja (~7–13B) ja palvelee inferenssiä; se ei voi esikouluttaa täyttä ~55B Lifetime World Modelia. Koulutuksessa 55B-malli tarvitsee optimoijan tilat, gradientit ja aktivaatiot noin 8–16× inferenssin muistijalanjäljestä — satoja GB–TB ja moni-GPU-yhteydet — vastaan GN-100:n 128 GB yhtenäismuistia.

**On-prem "Acer Node" -täyskoulutus on Pending Hardware.** Repositorion varmennus (PR #1720, 24.07.2026) ei löytänyt koulutusputken koodia eikä go-live-merkintää, ja erikseen kuvattua koulutusnodea (x86, 2× RTX 4090) ei ole repositoriossa; ainoa dokumentoitu Acer-laite on Veriton GN-100 (ARM64 / GB10 reunainferenssi ja kehitys). Enterprise Model Training -reitti joka esitti on-prem-koulutuksen toimitettuna merkittiin uudelleen "Pending Hardware, ei vielä varmennettu live". **Pilvi (GCP A3 Mega) on ainoa käytettävissä oleva täyskoulutusreitti.**

**Realistinen putki:** pilvi-esikoulutus / hienosäätö (GCP A3 Mega tai vuokra-H100/H200) → NVFP4-kvantisointi Blackwellille suunniteltuna → deploy GN-100:lle reunainferenssiin. Koulutus ja inferenssi ovat eri työkuormia eri laitteistolla.

**Token-capital-kehys:** puolustettava omaisuus ei ole from-scratch 55B vaan oppimissilmukka — privaatit evaluaatiot, RL-ympäristö ja adaptointi omalla operatiivisella (fleet-)datalla. Täysi 55B-esikoulutus on pilvi-CAPEXia joka ei itsessään tuota vallihautaa; omistettu silmukka tuottaa.

Kumppani-lab-note: `docs/lab-notes/2026-07-26-lwm-training-hardware-reality.md`.

## Liite F: V1.0 Agenttilaivasto

| Agentti ID | Nimi               | Vaihe | Prioriteetti | Tila      |
| ---------- | ------------------ | ----- | ------------ | --------- |
| Agent-01   | DWS IQ Login       | 1     | Kriittinen   | Käynnissä |
| Agent-02   | Firehorse Apps     | 2     | Kriittinen   | Odottaa   |
| Agent-03   | Customer Dashboard | 3     | Kriittinen   | Odottaa   |
| Agent-04   | AI Agents          | 2     | Kriittinen   | Odottaa   |
| Agent-05   | Mobile Dashboard   | 3     | Korkea       | Odottaa   |
| Agent-06   | Enterprise         | V1.1  | Matala       | Lykätty   |
| Agent-07   | Supabase Database  | 1     | Kriittinen   | Käynnissä |
| Agent-08   | Payments           | 4     | Keskitaso    | Odottaa   |
| Agent-09   | Email System       | 2     | Korkea       | Odottaa   |
| Agent-10   | Documentation      | 1     | Matala       | Käynnissä |

## Liite G: Sanasto

### Alusta- ja liiketoimintakäsitteet

| Termi (EN)                 | Suomeksi               | Määritelmä                                                                                |
| -------------------------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| **AgentFoundry**           | AgentFoundry           | Monimalli-, monivuokralainen kehys AI-agenttien käyttöönottoon teollisissa vertikaaleissa |
| **Edge AI**                | Reunatekoäly           | Tekoälyprosessointi paikallislaitteilla pilvipalvelimien sijaan                           |
| **Firehorse**              | Firehorse              | DWS6-tuoteperhe (Reports, Automation, Omnichannel, CMS)                                   |
| **Fit for 55**             | Fit for 55             | EU:n lainsäädäntöpaketti, joka vaatii 55% päästövähennystä vuoteen 2030 mennessä          |
| **Lifetime Scope Signals** | Lifetime Scope Signals | Koordinointiprotokolla moniagenttikehitykselle deklaratiivisen signaalin emission kautta  |
| **MCP Hub**                | MCP Hub                | Model Context Protocol -koordinointipalvelin moniagenttiorkestroinnille                   |
| **Solution Factory**       | Solution Factory       | Toimintamalli useiden teollisten AI-alustojen tuottamiseen jaetuista komponenteista       |

### Turvallisuus ja vaatimustenmukaisuus

| Termi (EN)    | Suomeksi                         | Määritelmä                                                       |
| ------------- | -------------------------------- | ---------------------------------------------------------------- |
| **EU AI Act** | EU:n tekoälysäädös               | EU:n säädös tekoälyjärjestelmille (elokuun 2026 määräaika)       |
| **GDPR**      | GDPR (Yleinen tietosuoja-asetus) | EU:n tietosuoja-asetus                                           |
| **NIS2**      | NIS2                             | EU:n kyberturvallisuusdirektiivi kriittiselle infrastruktuurille |
| **RLS**       | Rivitason suojaus                | Tietokantatason pääsynhallinta käyttäjä-/organisaatiokohtaisesti |

### Tietoarkkitehtuuri ja analytiikka

| Termi (EN)           | Suomeksi            | Määritelmä                                                                                                                                |
| -------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Autoresearch**     | Autotutkimus        | Karpathyn inspiroima autonominen validointisilmukka: hypoteesi → muokkaus → todentaminen → säilytä/hylkää → toista                        |
| **Columnar Storage** | Saraketallennustila | Tietokantatallennus, joka järjestää datan sarakkeittain rivien sijaan — mahdollistaa 10-100× pakkauksen ja nopeammat analyyttiset kyselyt |
| **HTAP**             | HTAP                | Hybrid Transactional/Analytical Processing — yksi tietokanta palvelee sekä OLTP- että OLAP-työkuormia                                     |
| **Hypercore**        | Hypercore           | TimescaleDB:n automaattinen hybridi rivi→sarake -tasointimoottori, 90-98% pakkaus                                                         |
| **Hypertable**       | Hypertaulu          | TimescaleDB:n aikaosioitu taulu aikasarjadatalle automaattisella lohkonhallinnalla                                                        |
| **pg_duckdb**        | pg_duckdb           | PostgreSQL-laajennus, joka upottaa DuckDB:n 50-600× OLAP-kiihdytykseen (DWS:ssä vain reunalaitteilla)                                     |
| **pgvector**         | pgvector            | PostgreSQL-laajennus vektorihakuun, käytetään RAG-putkistoissa                                                                            |
| **TimescaleDB**      | TimescaleDB         | PostgreSQL-laajennus aikasarjadatalle pakkauksella ja jatkuvilla aggregaateilla                                                           |
| **Two-Tier HTAP**    | Kaksitasoinen HTAP  | Arkkitehtuurimalli: Taso 1 (Aiven-hallinnoitu, TimescaleDB) + Taso 2 (itsehallittu reuna, pg_duckdb)                                      |

### Tutkimusmenetelmät

| Termi (EN)              | Suomeksi                     | Määritelmä                                                                                                                         |
| ----------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Aiven-first Mandate** | Aiven-ensisijaisuus          | DWS-periaate, joka edellyttää kaikkien tuotantotietokannan laajennusten Aiven-yhteensopivuutta ennen käyttöönottoa                 |
| **DWS Data Standard**   | DWS-tietostandardi           | Sisäinen standardi tiedon tallennuspäätöksille, laajennusten hallinnalle ja EU-sääntelyyn vaatimustenmukaisuudelle                 |
| **KYA Standard**        | KYA-standardi                | Know Your Agent/Architecture — kaksoistarkoitusstandardi AI-agenttien turvallisuudelle (Kilpi) ja optimoinnin hallinnalle (Miekka) |
| **Proxy-to-Scale**      | Pienestä suureen -validointi | Karpathyn malli: validoi muutokset pienellä välityspalvelimella (depth=12) ennen tuotantoon skaalausta (depth=24)                  |

---

## Liite H: Automatisoitu PR-tyonkulku (HIL-automaatio)

### Tausta

Keskeinen operatiivinen haaste yksinyrittajille ja pienille tiimeille, jotka hallitsevat yritystason koodikantoja, on koodin laadun yllapitaminen ilman erillistä katselmointitiimiä. Firehorse-malli ratkaisee taman taysin automatisoidulla pull request -tarkistus- ja yhdistamistyonkululla, joka korvaa manuaalisen ihminen-silmukassa (HIL) -koodikatselmoinnin kaksoismallin AI-katselmoinnilla.

### Arkkitehtuuri

```
Claude Code → PR → Clauden pikatarkistus → Gemini HIL-katselmointi → @copilot korjaukset → CI → automaattinen yhdistaminen
                                                    ↑                         |
                                                    └─────────────────────────┘  (korjaussilmukka)
```

### Komponentit

| Komponentti               | Rooli                                                          | Teknologia                   |
| ------------------------- | -------------------------------------------------------------- | ---------------------------- |
| Claude Code               | Koodin generointi, haaran luonti, PR:n avaaminen               | Anthropic Claude Opus/Sonnet |
| Claude (katselmoija)      | Pikatarkistus: turvallisuus, oikeellisuus, rikkovat muutokset  | Claude Sonnet 4 API          |
| Gemini (HIL-portti)       | Syvakatselmointi: reunatapaukset, testit, arkkitehtuuri, OWASP | Gemini 2.0 Flash API         |
| Copilot-koodausagentti    | Toteuttaa korjausohjeet katselmointikommenteista               | GitHub Copilot               |
| PR-automaattiyhdistaminen | Yhdistaa kun kaikki tarkistukset lapaistaan ja AI hyvaksyy     | GitHub Actions + GraphQL     |

### Suunnittelupaatokset

1. **Gemini oletusarvoisesti vaatii muutoksia (REQUEST_CHANGES)** — varmistaa, etta jokainen PR kay lapi vahintaan yhden parannuskierroksen
2. **Kaksoismallikatselmointi** — kaksi eri AI-mallia havaitsee eri luokkien ongelmia (rakenne vs. turvallisuus vs. konventiot)
3. **Automatisoitu korjaussilmukka** — jäsennellyt korjausohjeet lahetettaan @copilotille, joka toteuttaa korjaukset ja kaynnistaa katselmoinnin uudelleen, vahentaen kehittajan osallistumisen loppukatselmointiin (~5 min per PR)
4. **Ihmisen ohitusmahdollisuudet** — `do-not-merge` ja `needs-human-review` -tunnisteet pysayttavat automaation manuaalista katselmointia varten

### Merkitys opinnaytetyolle

Tama tyonkulku demonstroi Solution Factory -mallin (osio 5) tayden automaation tasolla: yksi kehittaja AI-agenttien kanssa tuottaa yritystason koodia suuressa mittakaavassa. HIL-oppimisputki (osio 6.7) syottaa katselmointioivallukset takaisin agenttien koulutukseen, luoden jatkuvan parannussilmukan, joka on linjassa EU:n tekoalysaadoksen artiklan 12 tarkastettavuusvaatimusten kanssa.

### Kayttoonotto

Cloud Run -palvelu `dws6run6` (europe-north1, Suomi). MCP Hub tarjoaa `POST /gemini/review` -paatepisteen on-demand-turvallisuusanalyysiin mille tahansa agentille Firehorse-laivastossa.

---

## 10.13 Climate IQ Pantheon — Kreikkalais-roomalainen moniagenttijärjestelmä

Rakentuen DWS7-agenttimodernisointiin (osio 10.9) ja toimitusjohtajan automaatioagenttiryhmään (osio 10.11), tämä osio dokumentoi **Climate IQ Pantheonin**: tuotantotason moniagenttijärjestelmän, jossa jokaisella tekoälyagentilla on kreikkalaisen tai roomalaisen jumalan identiteetti ja toimialaosaaminen.

### Motivaatio: Agentin identiteetti toiminnallisena suunnitteluna

**SOUL.md-malli** ratkaisee identiteettiongelman: jokaisella agentilla on Markdown-identiteettitiedosto, joka määrittelee persoonan, käyttäytymissäännöt ja sävyn. Tämä SOUL injektoidaan LLM:n järjestelmäkehotteeseen suoritusaikana, tehden identiteetistä pysyvän ja testattavan.

Kreikkalais-roomalainen panteon tarjoaa kaksi etua:

1. **Muistettavuus** — sidosryhmät ymmärtävät välittömästi "kysy Athenalta" vs "kysy Hermekseltä"
2. **Käyttäytymisen tarkkuus** — mytologiset roolit koodaavat toimialaosaamisen

### Arkkitehtuuri: 6 orkestraattoria + 7 toimialaerityistä agenttia

**Taso 1 — Climate IQ Pantheon (orkestraattorit)**

| Agentti    | Jumala             | Toimiala                 | Kyvykkyydet                                      |
| ---------- | ------------------ | ------------------------ | ------------------------------------------------ |
| Atlas      | Titaani (kreik.)   | Toiminnanjohtaja         | Reititys, synteesi, johdon tiivis tilannekatsaus |
| Athena     | Jumalatar (kreik.) | EU-vaatimustenmukaisuus  | ETS, CBAM, CSRD, Fit for 55                      |
| Hephaestus | Jumala (kreik.)    | Kenttä- ja kohdeäly      | Kohdeturvallisuus, materiaalit, aikataulutus     |
| Iris       | Jumalatar (kreik.) | Tutkimus ja markkina-äly | Kilpailijaseuranta, markkinatutkimus             |
| Hermes     | Jumala (kreik.)    | Logistiikka ja toiminnot | Toimitusketju, kriittinen polku, laadunvarmistus |
| Apollo     | Jumala (kreik.)    | Sisältö ja tavoittavuus  | SEO, sisältöstrategia, myyntiyhteystiedot        |

**Taso 2 — Toimialaerityiset agentit**

| Agentti    | Jumala        | Toimiala                     | Keskeinen sääntely        |
| ---------- | ------------- | ---------------------------- | ------------------------- |
| Vulcan     | Roomalainen   | Teräs ja metallit            | ETS Vaihe 4, CBAM         |
| Helios     | Kreikkalainen | Energia ja uusiutuva energia | RED III, 42,5 %:n tavoite |
| Neptune    | Roomalainen   | Meri- ja merenkulku          | FuelEU, ETS 40/70/100 %   |
| Ceres      | Roomalainen   | Maatalous ja lannoitteet     | CBAM lannoitteet, N₂O     |
| Prometheus | Kreikkalainen | Vety                         | RFNBO-lisäisyys, RED III  |
| Mars       | Roomalainen   | Rakentaminen ja rakennukset  | EPBD, EN 15978            |
| Gaia       | Kreikkalainen | Sementti ja maa-ainekset     | CBAM klinkkeri, ETS       |

### Turvallisuus: Prompt injection -korjaus ja EU AI Act artikla 12

`HermesAgent`-agentissa löydettiin haavoittuvuus, jossa mielivaltaiset syötekentät välitettiin `...input`-levityksellä aliagentteille. Korjaus korvaa kaikki levitykset eksplisiittisellä kenttäpoiminnalla (kirjoitetut suojaukset per kenttä).

Kaikki 13 agenttia kutsuvat `logExecution()`-metodia aloituksessa ja valmistumisessa, kirjoittaen `agent_executions` Supabase-tauluun. Tämä täyttää EU AI Act artiklan 12 automaattiset lokivaatimukset korkean riskin tekoälyjärjestelmille.

## 10.14 Agenttijärjestelmän koventaminen — tuotantoluotettavuus

### 10.14.1 Motivaatio

31-agenttinen järjestelmä (13 ydin + 5 SEO + 13 työnkulku/toimiala) oli kerryttänyt 6 TypeScript-kääntövirhettä ja 3 testivikaa, jotka estivät tuotantokääntämisen. Nämä eivät olleet suunnitteluvirheitä vaan integraatiovelkaa: tyyppien yhteensopimattomuuksia moduulirajojen yli, puuttuvia reittejä, asentamattomia riippuvuuksia ja lokaalikohtaista muotoilua.

### 10.14.2 Tyyppijärjestelmän linjaus: SandboxContext

`SandboxStage`-tyyppi `src/sandbox/index.ts`-tiedostossa määritteli neljä vaihetta: `'1' | 'opensandbox' | '2' | '3'`, missä `'opensandbox'` edustaa vaiheen 1.5 Docker-pohjaista eristystä Acer Veriton GN100 -laitteistolla (osio 10.10). `SandboxContext.stage` `src/agents/types.ts`-tiedostossa hyväksyi kuitenkin vain `'1' | '2' | '3'`, luoden käännösaikaisen virheen. Korjaus linjasi molemmat tyypit.

### 10.14.3 Reittien kytkentä: MCP ja ihminen silmukassa

Kaksi kriittistä reittiä oli tavoittamattomissa puuttuvien tuontien vuoksi `src/app.ts`-tiedostossa:

1. **MCP-agenttipalvelin** (`/mcp`) — `createMCPRouter()`-funktio paljastaa kaikki agentit MCP-työkaluina JSON-RPC 2.0:n kautta.
2. **Ihminen silmukassa** (`/api/hil`) — HIL-päätepiste mahdollistaa yhden klikkauksen tehtävien suorittamisen aamubrief-sähköposteista.

### 10.14.4 Lokaalivarma numeromuotoilu

Päästödatan analyytikkoagentti muotoilee ETS-kustannusarvioita `Number.toLocaleString()`-metodilla. EU-lokaaleilla tämä tuottaa välilyönnillä erotellut luvut. Korjaus määrittää `'en-US'`-lokaalin eksplisiittisesti, varmistaen deterministisen tulostuksen käyttöympäristöstä riippumatta.

### 10.14.5 Riippuvuushygienia

`luxon`-kirjasto oli tuotu Social Schedulerissa mutta ei koskaan lisätty `package.json`-tiedostoon. Resend-sähköposti-SDK:n erävasteen tyyppi vaati suoritusaikaisen taulukkotunnistuksen.

### 10.14.6 Tutkimuspanos

Tämä koventamissessio osoittaa moniagenttijärjestelmien ylläpitoon liittyvän kuvion: **integraatiovelka kertyy moduulirajoille, ei moduulien sisälle**. Korjaus koski 6 tiedostoa 5 alijärjestelmässä, palauttaen:

- **0 TypeScript-virhettä** (oli 6)
- **47/47 testiä läpi** (oli 44/47)
- **Täysi MCP-löydettävyys** kaikille 31 agentille
- **HIL-toiminnallisuus** aamubrief-työnkuluille

---

## 10.15 PostgreSQL-sarakemuotoinen HTAP-arkkitehtuuri — DWS-tietostandardi

### 10.15.1 Motivaatio

DWS6 suorittaa kaikki analytiikkakyselyt transaktiotaulujen varastoon ilman sarakemuotoisia tai HTAP-ominaisuuksia. Alustan skaalautuessa IoT-telemetriaan (DWS7 vaihe 4), 7 vuoden artikla 12 -auditointisäilytykseen ja kasvaviin agenttisuorituslokeihin, yksimoottorilähestymistapa luo suorituskyvyn pullonkauloja.

PostgreSQL:n "sarakemuotoinen laajennus" -malli mahdollistaa aidon HTAP:n (Hybrid Transactional/Analytical Processing) yksittäisen tietokannan sisällä: transaktiotaulut pysyvät tavallisina heap-tauluina, analytiikkataulut muuttuvat sarakemuotoisiksi, saumattomilla liitoksilla ja ilman tiedonsiirtoa.

### 10.15.2 Laajennusten arviointi

Kuusi Hydra-tyyppistä ratkaisua arvioitiin DWS-yhteensopivuuden osalta. **Päivitetty maaliskuu 2026** Aiven-sallittujen listan todentamisen ja ekosysteemimuutosten jälkeen:

| Ratkaisu                     | Suoritusmoottori      | Aiven-tuki                             | DWS-sopivuus                                                            | Tila (maaliskuu 2026)      |
| ---------------------------- | --------------------- | -------------------------------------- | ----------------------------------------------------------------------- | -------------------------- |
| TimescaleDB 2.25.x Hypercore | PostgreSQL            | **Kyllä**                              | **HYVÄKSYTTY STANDARDI** — AINOA sarakemainen/HTAP-vaihtoehto Aivenissa | Tuotantovalmis             |
| pg_duckdb                    | DuckDB (vektorisoitu) | **ESTETTY Aiven-sallittujen listalla** | Vain GN100-reuna                                                        | Rajoitettu reunalaitteelle |
| Hydra                        | DuckDB                | Ei (lakkautettu)                       | → Supabase Warehouse (helmi 2026)                                       | Siirtynyt                  |
| pg_mooncake                  | DuckDB                | Ei (lakkautettu)                       | → Databricks (loka 2025)                                                | Siirtynyt                  |
| ParadeDB                     | DuckDB                | Ei                                     | Tarpeeton (TSVECTOR käytössä)                                           | Ei käytössä                |
| Citus Columnar               | PostgreSQL            | Ei                                     | Ei suositella (Azure-sidottu)                                           | Ei käytössä                |

### 10.15.3 Suositeltu pino — Kaksitasoinen HTAP-arkkitehtuuri

**Taso 1: Aiven-hallittu (tuotanto)**

- **TimescaleDB 2.25.x Hypercore** — AINOA sarakemainen/HTAP-laajennus Aiven-sallittujen listalla
- Hypertaulut: agent_metrics, agent_costs, article12_audit_log, DWS7 IoT-sensoridata
- Automaattinen pakkauskerrostus: kuuma (0-90pv) → lämmin (90pv-1v, LZ4) → kylmä (1-7v, ZSTD)
- Odotettu 90-95% pakkaus auditointilokille
- Jatkuvat aggregaatit korvaamaan materialisoidut näkymät
- **Ei pg_duckdb:tä** — estetty Aiven-sallittujen listalla

**Taso 2: GN100-reuna (analytiikka)**

- **TimescaleDB + pg_duckdb + pgvector** täydellä laajennuspaketilla
- Acer Veriton GN100 (NVIDIA Jetson Orin Nano) itsenäisenä reunatietokantana
- pg_duckdb analyyttisten kyselyjen nopeuttamiseen (kampanjasupilot, taloudelliset raportit, CSRD-koontikyselyt)
- pgvector upotuksille ja semanttiselle haulle
- Ei Aiven-sallittujen listan rajoituksia — täysi PostgreSQL-laajennusvapaus

### 10.15.4 DWS-tietostandardi

Uusi `DWS_DATA_STANDARD.md` luotiin ohjaamaan kaikkia tiedon tallennuspäätöksiä:

1. **Tallennusmoottoripolitiikka** — päätösmatriisi rivi vs sarake vs hybridi
2. **Laajennusten hallinta** — hyväksytty rekisteri suvereniteettiarviolla
3. **Säilytysperiaatteet** — taulukohtaiset säännöt EU-säädöksiin sidottuina (GDPR Art 17, EU AI Act Art 12: 7v, NIS2 Art 23: 5v, kirjanpitolaki 1336/1997: 10v)
4. **Osiointistandardit** — TimescaleDB-hypertaulut ensisijaisena natiiviosioinnin sijaan
5. **Pakkauspolitiikka** — kerroksittaiset pakkaustavoitteet (1:1 kuuma → 20:1 arkisto)
6. **EU-sääntelynmukaisuus** — matriisi, joka yhdistää 11 EU-säädöstä tietokantavaatimuksiin

### 10.15.5 Vaiheittainen käyttöönotto

| Vaihe | Aikataulu  | Kohde               | Toimenpiteet                                                      |
| ----- | ---------- | ------------------- | ----------------------------------------------------------------- |
| 0     | Q1 2026    | Supabase (nykyinen) | Taulujen osiointi, materialisoidut näkymät, pg_stat_statements    |
| 1     | Q2 2026    | Aiven V1            | TimescaleDB 2.25.x Hypercore -hypertaulut, jatkuvat aggregaatit   |
| 2     | Q3-Q4 2026 | Aiven DWS7          | IoT-hypertaulut, auditointipakkaus, Taso 1 tuotanto               |
| 3     | Q4 2026    | GN100-reuna         | pg_duckdb + pgvector reunatietokanta, Taso 2 analytiikka          |
| 4     | 2027       | Täysi HTAP          | Lakehouse-vienti (Databricks/Iceberg), ulkoisten työkalujen pääsy |

### 10.15.6 Tutkimuspanos

Tämä työ osoittaa, että **yksitietokantainen HTAP-malli** on toteuttamiskelpoinen säännellyille EU-teollisuusalustoille: sama SQL, samat asiakasohjelmat, sama RLS, nolla ETL:ää. DWS-tietostandardi kodifioi tämän organisaatiostandardiksi varmistaen, että tallennusmoottoripäätökset ovat harkittuja, dokumentoituja ja EU-vaatimusten mukaisia.

### 10.16 Harness Engineering — Promptisuunnittelusta järjestelmäsuunnitteluun

**Lähde:** OpenAI, "Harness engineering: leveraging Codex in an agent-first world", 13.02.2026; Martin Fowler, "Harness Engineering", 2026; Datadog, "Closing the verification loop", 2026.

**Konteksti:** OpenAI:n Harness-tiimi rakensi tuotteen viidessä kuukaudessa ilman yhtään manuaalisesti kirjoitettua koodiriviä — miljoona riviä koodia, ~1 500 PR:ää, 3–7 insinööriä. Tämä osio analysoi 8 harness engineering -periaatetta ja vertaa niitä DWS IQ 6:n itsenäisesti kehitettyyn arkkitehtuuriin.

#### 10.16.1 Määritelmä

**Harness** = koko ympäristö (scaffolding, rajoitteet, palautesilmukat), joka ympäröi AI-agenttia ja mahdollistaa vakaan työskentelyn.

**Harness Engineering** = insinöörityön siirtymä koodin kirjoittamisesta kohti:

- **Ympäristöjen suunnittelua** — agenttien työtilan muotoilua
- **Tarkoituksen spesifiointia** — mitä tarvitsee tapahtua, ei miten
- **Palautesilmukoiden rakentamista** — agentin itsensäkorjausmekanismeja

Kun jokin epäonnistuu, kysymys ei ole "yritä kovemmin" vaan **"mikä kyvykkyys puuttuu?"**

#### 10.16.2 Kahdeksan periaatetta — DWS IQ 6 -vertailu

| #   | Periaate                                         | OpenAI:n lähestymistapa                      | DWS IQ 6:n lähestymistapa                                            | Valmiusaste |
| --- | ------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------------------- | ----------- |
| 1   | AGENTS.md = kartta, ei tietosanakirja            | ~100 riviä, sisällysluettelona               | CLAUDE.md + AGENTS.md + JIT L0-L6 kuusikerroksinen lataus            | **90%**     |
| 2   | "Tylsä teknologia" voittaa                       | Vakaat, hyvin dokumentoidut teknologiat      | Express 4, React 19, PostgreSQL — CLI-ensisijaisuus                  | **95%**     |
| 3   | Golden Principles -laadunhallinta                | Automaattinen taustaskannaus + korjaus-PR:t  | 11 standardia + Boardy-arkkitehtipersoonan katselmointi              | **75%**     |
| 4   | Arkkitehtuurin mekaaninen valvonta               | Linterit korjausohjeineen virheviesteissä    | ESLint + turvallisuussäännöt (OWASP, SRI, CORS)                      | **60%**     |
| 5   | Tieto kuuluu repoon                              | Jos se ei ole repossa, sitä ei ole           | 71 dokumenttia + DWS-dokumenttistandardi + VERSION AND AGENT HISTORY | **95%**     |
| 6   | Agentti-agentti-koodikatselmointi                | "Ralph Wiggum Loop" — itsekatselmointisyklit | Simplify-skill + Boardy + ihminen-silmukassa                         | **50%**     |
| 7   | Kumuloituvat hyödyt (kyvykkyyksien rakentaminen) | Diagnosoi puuttuva kyvykkyys, rakenna repoon | 10 skilliä + 16 agenttia + MCP Hub + työnkulkuorkestrointi           | **85%**     |
| 8   | Insinöörit ympäristösuunnittelijoina             | 3,5 PR/insinööri/päivä                       | Worktree-työnkulku + session handover -protokolla                    | **80%**     |

**DWS:n kokonaisvalmiusaste: ~79%** OpenAI:n harness engineering -periaatteita vasten.

#### 10.16.3 Keskeisin empiirinen havainto: malli ei ratkaise — harness ratkaisee

Harness engineering -kirjallisuuden merkittävin empiirinen löydös:

> Sama malli (gpt-5.2-codex) paransi tuloksiaan **52,8 % → 66,5 %** pelkällä harness-parannuksella (LangChain-tapaus). Ei mallin vaihtoa — ainoastaan järjestelmätason parannuksia.

Tämä validoi DWS IQ 6:n arkkitehtuurihypoteesin: **mallia ympäröivä järjestelmä merkitsee enemmän kuin itse malli.** DWS:n kuusikerroksinen informaatioarkkitehtuuri (L0 Platform Model → L6 Tool Result Injection) on tämän periaatteen formalisointi.

**Progressiivinen paljastaminen toimii empiirisesti:**

- Cursor saavutti **46,9 % tokenisäästön** kontekstinhallinnalla
- Vercel vähensi kontekstin **145K → 67K tokeniin** JIT-latauksella
- DWS:n L6 Tool Injection -kerros (system-reminder jokaisen tool-kutsun jälkeen) näyttää **15–47 % paremman sääntöjen noudattamisen** kuin pelkkä systeemiprompt

#### 10.16.4 DWS:n kuusikerroksinen arkkitehtuuri (L0-L6) harnessin formalisointina

DWS IQ 6 on itsenäisesti kehittänyt kuusikerroksisen informaatioarkkitehtuurin, joka formalisoi harness-käsitteen:

| Kerros | Nimi                  | Tehtävä                                         | OpenAI:n vastine                 |
| ------ | --------------------- | ----------------------------------------------- | -------------------------------- |
| **L0** | Platform Model        | LLM:n peruskyvykkyydet                          | Implisiittinen (Codex-malli)     |
| **L1** | System Prompt         | Sessiotason ohjeet                              | AGENTS.md-injektio               |
| **L2** | Standards (JIT)       | Tarvepohjainen standardien lataus               | docs/-kansion viittaukset        |
| **L3** | Task Context          | Nykyisen tehtävän spesifikaatio                 | PR-kuvaus + issue                |
| **L4** | Auto-Learned State    | Pysyvä muisti (Supabase + MEMORY.md)            | Ei kuvattu OpenAI:n artikkelissa |
| **L5** | Tool Results          | Työkalusuoritusten tulokset                     | Agenttisilmukan työkalukutsut    |
| **L6** | Tool Result Injection | Järjestelmämuistutukset jokaisen kutsun jälkeen | Ei kuvattu OpenAI:n artikkelissa |

**DWS:n innovaatiot OpenAI:n ylittäen:**

- **L4 Auto-Learned State:** Agentit oppivat sessioiden välillä pysyvän muistin kautta — OpenAI ei kuvaa vastaavaa
- **L6 Tool Result Injection:** Järjestelmämuistutukset injektoidaan jokaisen työkalukutsun jälkeen, saavuttaen 15–47 % paremman standardien noudattamisen
- **12 Factor Agents -yhteensopivuus:** DWS dokumentoi 12/12 yhteensopivuuden — OpenAI ei viittaa tähän kehykseen

#### 10.16.5 EU-regulaatio vaatii erilaisen harnessin

Merkittävin eroavaisuus OpenAI:n ja DWS:n lähestymistapojen välillä johtuu regulaatiokontekstista:

| Ulottuvuus              | OpenAI (Silicon Valley)                        | DWS IQ 6 (EU-reguloitu)                                                   |
| ----------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| **Optimointitavoite**   | Nopeus (3,5 PR/insinööri/päivä)                | Jäljitettävyys, auditoitavuus, ihminen silmukassa                         |
| **Autonomiataso**       | Lähes täysi agenttien autonomia                | Ihminen lopullisena hyväksyjänä (Karpathy-periaatteet)                    |
| **Koodikatselmointi**   | Pelkästään agentti-agentti (Ralph Wiggum Loop) | Agenttien esikatselmointi + ihmisen lopullinen hyväksyntä                 |
| **Auditointipolku**     | Ei kuvattu                                     | VERSION AND AGENT HISTORY jokaisessa dokumentissa, oikeudellisesti pätevä |
| **Tietojen sijainti**   | US-keskeinen                                   | EU-tietojen sijainti (Suomi/Saksa), GDPR, EU AI Act                       |
| **Palvellut toimialat** | Sisäinen työkalu                               | 20 EU-reguloitua toimialaa (rakentaminen, energia, kemikaalit...)         |

**Thesis-argumentti:** Molemmat lähestymistavat ovat valideja, mutta eri konteksteissa. OpenAI optimoi nopeutta reguloimattomassa sisäisessä ympäristössä. DWS optimoi vaatimustenmukaisuutta, jäljitettävyyttä ja luottamusta EU-reguloiduilla toimialoilla, joissa autonomisten agenttipäätösten oikeudellinen vastuu on todellinen.

EU:n tekoälysäädös (voimaan elokuu 2026) vaatii eksplisiittisesti:

- **Artikla 12:** AI-järjestelmien toiminnan lokitus vähintään 7 vuodeksi
- **Artikla 14:** Ihmisen valvonta korkean riskin AI-järjestelmissä
- **Artikla 15:** Tarkkuus-, kestävyys- ja kyberturvallisuusvaatimukset

Nämä vaatimukset tekevät OpenAI:n "täyden autonomian" mallista vaatimustenvastaisen korkean riskin sovelluksissa EU-reguloiduilla toimialoilla. DWS:n ihminen-silmukassa-harness ei ole rajoitus — se on arkkitehtuurinen vastaus regulaatiovaatimuksiin.

#### 10.16.6 Avoimet tutkimuskysymykset

1. **Skaalautuuko harness-malli EU-reguloiduille toimialoille?** OpenAI:n tapaus on sisäinen työkalu ilman regulaatiovaatimuksia. DWS toimii 20 reguloidulla toimialalla — empiirinen validointi on käynnissä.

2. **Mikä on optimaalinen autonomiataso?** OpenAI: lähes täysi autonomia. DWS: ihminen silmukassa. Kumpi tuottaa paremman lopputuloksen reguloidussa kontekstissa?

3. **Onko kuusikerroksinen kontekstiarkkitehtuuri yleistettävissä?** DWS:n L0-L6-malli on spesifinen sen standardiekosysteemille, mutta periaatteet voivat olla universaaleja.

4. **Verifikaatioaukko:** Martin Fowler huomautti, että OpenAI:n artikkelista puuttuu käyttäytymisen verifiointi — miten harness varmistaa, että generoitu koodi tekee oikean asian eikä vain käänny?

#### 10.16.7 Tutkimuspanos

Tämä osio tuottaa kolme löydöstä harness engineering -keskusteluun:

1. **Formalisointi:** DWS:n L0-L6 kuusikerroksinen arkkitehtuuri tarjoaa formaalin kehyksen sille, mitä OpenAI kuvaa epämuodollisesti. Tämä tekee harness-suunnittelusta toistettavan ja auditoitavan.

2. **Regulaatiodivergenssi:** EU-reguloidut toimialat vaativat perustavanlaatuisesti erilaisen harness-suunnittelun — priorisoiden jäljitettävyyttä ja ihmisen valvontaa nopeuden sijaan. Tämä ei ole heikkous vaan arkkitehtuurinen rajoite, analoginen sille miten Aivenin laajennusten sallittujen lista ohjaa tietokanta-arkkitehtuuria (osio 10.15).

3. **Empiirinen vahvistus:** 52,8 % → 66,5 % parannus pelkällä harness-parannuksella (ei mallin vaihtoa) validoi DWS:n investoinnin järjestelmäarkkitehtuuriin mallivalinnan sijaan. Kuusikerroksinen arkkitehtuuri, DWS-dokumenttistandardi ja progressiivinen paljastaminen ovat kaikki harness engineering -käytäntöjä, jotka kehitettiin itsenäisesti ennen OpenAI:n julkaisua.

### 10.17 Johtopäätökset: Hiilitase vaatimustenmukaisuusinfrastruktuurina

#### 10.17.1 Raportoinnista täsmäytykseen

Tämän opinnäytetyön keskeinen löydös on, että EU:n ilmastovaatimustenmukaisuus ETS:n, CBAM:n, CSRD:n ja EU-taksonomian osalta ei ole raportointiongelma — se on **kirjanpito-ongelma**. Sama hiilidioksidiekvivalenttitonni, joka kirjataan terästehtaan ETS-päästöoikeuksien luovutuksena (veloitus), muuttuu tuojan CBAM-sisällytetyksi päästöksi, CSRD-raportin Scope 3 ylävirran ilmoitukseksi ja rakennusyhtiön taksonomialinjauksen määritteeksi. Neljä sääntelykontaktipistettä, yksi fyysinen suure.

Nykyiset vaatimustenmukaisuustyökalut käsittelevät jokaisen säännöksen itsenäisenä raportointityönkulkuna. Tämä tuottaa päällekkäistä tietojen syöttöä, epäjohdonmukaisia päästökertoimia ja vailla täsmäytystä olevia toisiinsa liittyviä velvoitteita. Tuloksena yritykset raportoivat saman hiilitapahtuman eri tavoin eri säännöksissä, tilintarkastajat eivät voi ristiinvarmistaa, ja Scope 3 -arviot kantavat ±40 % epävarmuutta koska ne perustuvat kustannuspohjaisiin arvioihin transaktiovarmennettujen tietojen sijaan.

#### 10.17.2 Kahdenkertainen kirjanpito CO2:lle

Tämä opinnäytetyö esittää, että hiilivaatimustenmukaisuus vaatii saman arkkitehtuurisen ratkaisun, jonka kirjanpito otti käyttöön vuosisatoja sitten: **kahdenkertaisen kirjanpidon**. Jokainen vaatimustenmukaisuustapahtuma tuottaa kirjanpitokirjauksen — veloitus tai hyvitys — kaksoisyksiköissä (EUR ja tCO2e):

| Vaatimustenmukaisuustapahtuma          | Veloitus (velka)                | Hyvitys (varallisuus)          | Säännös                    |
| -------------------------------------- | ------------------------------- | ------------------------------ | -------------------------- |
| ETS-päästöoikeuksien luovutus          | tCO2e päästetty + EUR kustannus | —                              | EU ETS                     |
| Ilmaisallokaation vastaanotto          | —                               | tCO2e allokoitu                | EU ETS                     |
| CBAM-sertifikaatin hankinta            | EUR maksettu + tCO2e tuotu      | —                              | CBAM                       |
| CBAM-alkuperämaan hiilivähennys        | —                               | EUR jo maksettu alkuperämaassa | CBAM                       |
| Varmennetun päästökompensaation poisto | —                               | tCO2e kompensoitu              | Vapaaehtoinen / Taksonomia |

Hiilitase — kokonaisvelat (veloitukset) miinus kokonaisvarat (hyvitykset) — antaa talousjohtajalle **nettohiiliposition**, joka on auditoitava, täsmäytettävä ja koneluettava (XBRL/iXBRL).

#### 10.17.3 Poikkisääntelyinen täsmäytys

Veloitus-hyvitys-kirjanpito mahdollistaa sen, mitä mikään nykyinen työkalu ei tarjoa: **poikkisääntelyisen täsmäytyksen**. Kun terästehtaan ETS-tiedot ja rakennusyhtiön CBAM-tiedot kulkevat saman kirjanpidon kautta, järjestelmä voi varmistaa, että sisällytetyt päästöt vastaavat todellisia tuotantopäästöjä. Tämä poistaa riippuvuuden CBAM-oletusarvoista (jotka yliarvioivat 20-50 %) ja tuottaa transaktiovarmennetun Scope 3 -datan ±3 % tarkkuudella ±40 %:n kustannuspohjaisen arvion sijaan.

Tämä on myös **verkostovaikutus**: kun Asiakas A:n varmennetut päästöt parantavat Asiakas B:n CBAM-kertoimen tarkkuutta, molemmat hyötyvät. Mitä enemmän toimialoja kirjanpidossa, sitä enemmän poikkitoimialaista älykkyyttä syntyy.

#### 10.17.4 Toteutus: DWS 7 Phase 2.6

DWS IQ -alusta toteuttaa jo muistinvaraisen veloitus-hyvitys-muunnoksen (`src/compliance/debit-credit-ledger.ts`), joka toimitetaan V1:ssä. DWS 7 Phase 2.6 (touko–heinäkuu 2026) ylentää tämän pysyväksi hiilitaseeksi 8 suunnitellulla PR:llä (093A–093H):

1. **Pysyvä hiilikirjanpito** — muuttumaton append-only-taulu, korjaukset käänteiskirjauksina
2. **Kaksoisyksikkökirjaukset** — EUR + tCO2e jokaisessa kirjauksessa, hiilen hinta tallennettuna kirjaushetkellä
3. **Hiilitilikartta** — standardoitu tilirakenne ESRS E1 -scopejen mukaisesti
4. **Poikkisääntelyinen täsmäytys** — ETS ↔ CBAM ↔ CSRD jaettujen kirjanpitokirjausten kautta
5. **Kirjanpitonatiivi pisteytys** — vaatimustenmukaisuuspisteet johdettu kirjanpidon saldosta
6. **Talousjohtajan kojelauta** — taseenäkymä porautumisella säännöksittäin, scopeittain ja entiteeteittäin
7. **ERP-pääkirjan synkronointi** — hiilikirjaukset siirretty SAP/IFS/Dynamics-pääkirjaan
8. **XBRL-vienti** — koneluettavat CSRD-raportit kirjanpitodatasta

#### 10.17.5 Avoin lähdekoodi: Konnektorit tietojen syöttökerroksena

Hiilitase on vain niin tarkka kuin siihen syötetty data. Kirjanpitoarkkitehtuuri perustuu **avoimen lähdekoodin konnektoreihin**, jotka syöttävät varmennettua päästödataa heterogeenisistä teollisuusjärjestelmistä. Ilman standardoituja, auditoitavia tietoputkia kahdenkertaisen kirjanpidon malli romahtaa samaksi manuaalisen syötön ongelmaksi, jonka se korvaa.

DWS-konnektoriarkkitehtuuri seuraa ERP-integraatiomalleja, jotka on perustettu hakemistoon `src/integrations/erp/` (osio 10.9), laajentaen ne hiilispesifisiin tietolähteisiin:

| Konnektorityyppi             | Lähdejärjestelmät                                            | Tietovirta                                                                           | Lisenssimalli                             |
| ---------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ----------------------------------------- |
| **ERP-konnektorit**          | SAP S/4HANA, IFS Cloud, Dynamics 365, Monitor, Visma, Jeeves | Tuotantomäärät, energiankulutus, materiaalisyötteet → kirjanpidon veloituskirjaukset | Avoin lähdekoodi (MIT)                    |
| **ETS/rekisterikonnektorit** | EU Transaction Log (EUTL), kansalliset rekisterit            | Päästöoikeussaldot, luovutukset, ilmaisallokaatiot → kirjanpidon hyvitys/veloitus    | Avoin lähdekoodi (MIT)                    |
| **CBAM-konnektorit**         | CBAM-siirtymärekisteri, tulliluokitukset                     | Tuontitavaroiden sisällytetyt päästöt, hankitut sertifikaatit → kirjanpidon veloitus | Avoin lähdekoodi (MIT)                    |
| **Päästökerroinsyötteet**    | EEA GHG Inventory, IPCC, EU ETS -vertailuarvot               | Validoidut kertoimet Scope 1/2/3 -laskelmiin                                         | Avoin data + avoimen lähdekoodin jäsennin |
| **IoT/reunakonnektorit**     | NVIDIA Jetson Orin Nano, teollisuusanturit, energiamittarit  | Reaaliaikainen energiankulutus, Scope 1 suorat mittaukset → kirjanpidon veloitus     | Avoin lähdekoodi (MIT)                    |
| **ESG-alustakonnektorit**    | Worldfavor, PositionGreen, CDP                               | Kolmannen osapuolen ESG-pisteet, Scope 3 toimittajadata → kirjanpitokirjaukset       | Avoin lähdekoodi (MIT)                    |

**Miksi avoin lähdekoodi on tärkeä vaatimustenmukaisuusinfrastruktuurille:**

1. **Auditoitavuus:** Suljetun lähdekoodin konnektorit ovat mustia laatikoita. Kun tilintarkastaja kysyy "miten tämä päästökerroin tuli kirjanpitoon?", vastauksen on oltava tarkastettavissa oleva lähdekoodi — ei toimittajan API-dokumentaatio. Avoimen lähdekoodin konnektorit tekevät koko tietopolun lähdejärjestelmästä kirjanpitokirjaukseen läpinäkyväksi ja toistettavaksi.

2. **Verkostovaikutuksen kiihdytys:** Poikkitoimialainen älykkyys -teesi (osio 10.17.3) edellyttää datan virtausta monilta toimialoilta yhteen kirjanpitoon. Avoimen lähdekoodin konnektorit laskevat käyttöönoton kynnystä — terästehtaan IT-tiimi voi ottaa käyttöön SAP-konnektorin, verifioida koodin ja kontribuoida parannuksia. Suljetun lähdekoodin konnektorit luovat toimittajalukon, joka hidastaa verkoston kasvua.

3. **Sääntelypuolustettavuus:** EU:n tekoälysäädöksen artikla 12 vaatii AI-järjestelmien toiminnan lokitusta. Kun AI-agentit tuottavat kirjanpitokirjauksia konnektoridatasta, koko putki — konnektorikoodi, muunnoslogiikka, agenttipäätös — on oltava auditoitavissa. Avoin lähdekoodi täyttää tämän vaatimuksen suunnittelultaan.

4. **Yhteisön validointi:** Päästökerroindatakannat muuttuvat vuosittain. Avoimen lähdekoodin konnektorit mahdollistavat yhteisövetoisen ylläpidon — kun EEA julkaisee päivitetyn GHG-inventaarion, kuka tahansa kontribuuttori voi lähettää PR:n päivittäen kerroinsyötteen, ja muutos katselmoidaan avoimesti.

Konnektorikerros muuttaa hiilitaseen yksittäisen yrityksen työkalusta **monitenanttivaatimustenmukaisuusverkostoksi**. Jokainen konnektori on standardoitu adapteri (syöttöskeema → kirjanpitokirjaus), joka liittyy kirjanpidon append-only-syöttörajapintaan. Avoimen lähdekoodin malli varmistaa, että suurimmat EU-yritykset, jotka tarvitsevat CSRD-vaatimustenmukaisuutta (alle ~5 000 Omnibus-uudistuksen jälkeen, >1 000 työntekijää ja >450 M€ liikevaihto) — sekä niiden huomattavasti laajempi toimittajajoukko, joka vedetään mukaan Scope 3 -arvoketjuraportoinnin kautta — voivat ottaa infrastruktuurin käyttöön ilman toimittajariippuvuutta.

#### 10.17.6 Tutkimuspanos

Tämä päätösosio tuottaa kolme löydöstä:

1. **Arkkitehtuurinen oivallus:** Hiilivaatimustenmukaisuus on rakenteellisesti isomorfinen kirjanpidon kanssa. Kahdenkertainen kirjanpito ei ole metafora — se on teknisesti oikea tietorakenne hiilen seurantaan useiden säännösten, entiteettien ja toimitusketjujen yli. Tämä löydös syntyi DWS-vaatimustenmukaisuusmoottorin käytännön toteutuksesta 20 EU-reguloidulla toimialalla.

2. **Poikkitoimialainen älykkyys -teesi:** Monitoimialainen hiilikirjanpito tuottaa emergenttia älykkyyttä, jota yksitoimialainen työkalu ei voi replikoida. Terästehtaan ETS-luovutus korreloi rakennusalan CSRD-ilmoituksen kanssa samasta toimitusketjusta. Tämä korrelaatio on näkyvissä vain kun molemmat toimialat jakavat saman kirjanpitomuodon — validoiden tässä opinnäytetyössä kuvatun alusta-arkkitehtuurin.

3. **Infrastruktuurin rahoittaminen, ei ominaisuuksien:** Hiilitase edustaa siirtymää "vaatimustenmukaisuusraportointityökalusta" "vaatimustenmukaisuusinfrastruktuuriksi" — sama ero kuin taulukkolaskennan ja ERP-järjestelmän välillä. Tällä arkkitehtuurivalinnalla on strategisia vaikutuksia yrityssitouttavuuteen (vaihtokustannus vastaa kirjanpitojärjestelmän vaihtamista), markkinoiden ajoitukseen (alle ~5 000 suurta EU-yritystä velvoitettu Omnibus-uudistuksen jälkeen, plus niiden arvoketjut Scope 3:n kautta) ja verkostovaikutuksiin (enemmän toimialoja kirjanpidossa = tarkempi poikkisääntelyinen data).

Firehorse-tuotevalmistuksen toimintamalli, dokumentoitu edellisissä 16 osiossa, tarjosi insinööriperustan — harness-arkkitehtuurin, moniagenttiorkestroinnin, reunakäyttöönoton ja sääntely-älykkyyden — joka vaaditaan tämän hiilitaseinfrastruktuurin rakentamiseen. Johtopäätös on, että alustan kilpailullinen vallihauha ei ole mikään yksittäinen agentti tai säännösmoduuli, vaan kirjanpito joka yhdistää ne kaikki.

### 10.18 LWM-sekvensointistrategia — Sääntely-älykkyydestä fyysiseen tekoälyyn

#### 10.18.1 Strateginen konteksti

Lifetime World Model (LWM) toimii "Muisti"-kerroksena Aivot-Muisti-Keho-Kädet-arkkitehtuurissa. Sijoittaja- ja markkina-analyysi (maaliskuu 2026) paljasti kehystysristiriidan: alustaa markkinoitiin samanaikaisesti "hiilitaseinfrastruktuurina" (vaatimustenmukaisuus-SaaS), "55B parametrin fyysinen tekoäly" (maailmamalli) ja "autonominen terveydenhuollon laivasto" (robotiikka). Jokainen tarina kohdistuu eri sijoittajiin eri vaiheissa.

Tämä osio dokumentoi ratkaisun: kolmivaiheisen sekvensointistrategian, jossa jokainen vaihe rahoittaa ja deriskeeraa seuraavan.

#### 10.18.2 Kolme vaihetta

**Vaihe 1 (Nykyinen — 650K EUR SAFE):** LWM = sääntely-älymoottori. 15 000+ EU-sääntelydokumenttia indeksoituna 20 toimialalla, 18 AI-agenttia, hiilitase poikkisääntelyisellä täsmäytyksellä. Liikevaihtotavoite: 900K EUR ARR.

**Vaihe 2 (SAFE:n jälkeen — Helsingin pilotti):** LWM = sääntely-älykkyys + fyysinen suunnittelu. LeWorldModel-tyylinen latentti suunnittelu yhdistettynä sääntelytieto­graafiin. KELA-tuettu terveydenhuollon laivastopilotti NVIDIA-laitteistolla (Acer GN-100).

**Vaihe 3 (Series A 2027):** LWM = täysi kaksikäyttötuote. Hiilitase + reunafyysinen tekoäly rakennusalalla, terveydenhuollossa, teollisuudessa, energiassa ja puolustuksessa.

#### 10.18.3 Ulkoinen validointi: LeWorldModel (arXiv:2603.19312)

Maaliskuussa 2026 Maes, Le Lidec, Scieur, LeCun ja Balestriero julkaisivat LeWorldModel-tutkimuksen — ensimmäinen JEPA-arkkitehtuuri (Joint Embedding Predictive Architecture), joka kouluttautuu stabiilisti alusta loppuun raakapikseleistä. Keskeiset löydökset:

- **Yksinkertaisuus:** 2 häviötermiä (ennustus + SIGReg-regulaattori) korvaa 6+ hyperparametria
- **Tehokkuus:** 15M parametria, yksi GPU, ~1 sekunti suunnitteluun vs 47 sekuntia DINO-WM:llä, 200x vähemmän tokeneita
- **Tulokset:** 96 % onnistumisprosentti PushT-manipulaatiotehtävässä

Samanaikaisesti LeCun perusti AMI Labsin (1,03 miljardin dollarin siemenrahoitus) ja Fei-Fei Li keräsi 1 miljardin dollarin World Labsille — 2 miljardia dollaria kolmessa viikossa maailmamalliyhtiöille.

#### 10.18.4 Vaiheen 2 teknisen aukon analyysi

Kolme ratkaisematonta ongelmaa yhdistää vaiheen 1 vaiheeseen 2:

1. **Syötemodaalien kuilu:** LeWorldModel odottaa pikselisyötteitä. LWM vaihe 1 toimii strukturoidulla sääntelytekstillä. Realistisin silta on digitaalinen kaksonen (OpenUSD-skenaarion esitys).

2. **Skaalan kuilu:** LeWorldModel testattu kontrolloidussa simulaatiossa. Teolliset ympäristöt ovat kontrolloimattomia, pitkän aikahorisontin ja harvan palautteen ympäristöjä. Tämä on tutkimusta, ei insinööritiedettä.

3. **Sääntely-fyysinen integraatio:** Miten fyysinen suunnitelma (nosturin liike, ajoneuvon reitti) validoidaan hiilitasetta vasten ennen toteutusta? Ehdotettu arkkitehtuuri: fyysinen suunnittelija ehdottaa → sääntely-moottori validoi → KYA-hallintaportti valvoo.

**Keskeinen oivallus:** Vaiheen 1 tulokset (sääntelygraafi, hiilitase, KYA-hallinta) ovat vaiheen 2 syötteitä. Vaatimustenmukaisuusdata syöttää fyysistä suunnittelua — ei toisinpäin.

#### 10.18.5 Tutkimuspanos

1. **Sekvensointikuri:** Tuotteen kehystämisen tulee vastata sen nykyisiä kykyjä, ei tulevaisuuden visiota.
2. **Vaatimustenmukaisuus ensin -maailmamalliteesi:** Oivallus, että vaatimustenmukaisuusdata syöttää fyysistä suunnittelua, on uusi arkkitehtuurillinen kontribuutio.
3. **Vaiheen 2 tekninen rajaus:** Kolme ratkaisematonta ongelmaa tarjoavat konkreettisen tutkimusohjelman.

### 10.19 Opinnäytetyön versiointistrategia: v3.30.50 Metropolia-jäädytys

#### 10.19.1 Motivaatio

Versioon 3.31 mennessä opinnäytetyö oli kasvanut 82 sivuun ja yli 26 000 sanaan — lähes kaksinkertainen Metropolian 40-50 sivun tavoitteeseen nähden. Yksityiskohtaisen tutkimussisällön pysyvän menetyksen sijaan omaksuttiin kaksoisversioarkkitehtuuri.

#### 10.19.2 Kaksoisversioarkkitehtuuri

| Versio   | Tiedosto                            | Sivut | Tila       | Tarkoitus                           |
| -------- | ----------------------------------- | ----- | ---------- | ----------------------------------- |
| v3.30.50 | `V3Thesis_EN_v3.30.50.md`           | ~50   | JÄÄDYTETTY | Metropolia-palautusversio           |
| v3.32+   | `V3Thesis_EN.md` / `V3Thesis_FI.md` | ~82   | Elävä      | Täydellinen tutkimustietue          |
| v3.2+    | `PHD_FIREHORSE_EN.md` / `_FI.md`    | —     | Elävä      | Tohtorintutkimuksen liitedokumentti |

v3.30.50-uudelleenrakenne toteutettiin neljällä muunnoksella:

1. **Osion 5 laajennus** — 0,7 sivusta ~4 sivuun kattaen infrastruktuurin käyttöönoton, agenttiarkkitehtuurin, koordinoinnin Lifetime Scope Signals -protokollalla, 31 agentin evoluution, asiakkaiden perehdytyksen ja avainmittarit
2. **Osion 10 konsolidointi** — Yksityiskohtaiset osiot 10.6-10.18 korvattu osiolla 10.6 "Laajennetut tutkimuspanokset (Yhteenveto)" sisältäen 1 kappaleen tiivistelmät PHD Firehorse -ristiviittauksilla
3. **Liitteiden karsinta** — 8 liitettä vähennetty 4:ään (säilytetty Solution Factory Canvas, LSS-protokolla, Karpathyn periaatteet, Sanasto)
4. **Sisällön säilyttäminen** — Kaikki poistettu sisältö on jo olemassa PHD Firehorse -liitedokumentissa

#### 10.19.3 Versiointisäännöt

- v3.30.50-tiedostot ovat **HIL-only** (Human-in-the-Loop) — ei Claude Code -muokkauksia jäädytyksen jälkeen
- 82-sivuinen elävä dokumentti jatkaa versiointia normaalisti (3.32, 3.33, ...)
- PHD Firehorse jatkuu itsenäisesti (3.2, 3.3, ...)
- Elävien dokumenttien versioidenpäivityksissä tulee mainita, jos sisältö koskee myös jäädytettyä versiota kopioi-liitä-ehdotusten kautta

#### 10.19.4 Tutkimuspanos

**Avainpanos #23:** Kaksoisversiostrategia osoittaa käytännön ratkaisun tekoälyavusteiseen akateemiseen kirjoittamiseen, jossa tutkimuksen nopeus ylittää palautusformaatin rajoitukset. 82-sivuinen elävä dokumentti säilyttää täydellisen tutkimuslinjan (38 versiomerkintää, 22 avainkontribuutiota), kun taas 50-sivuinen jäädytetty versio täyttää oppilaitoksen vaatimukset menettämättä henkistä omaisuutta. Malli voi yleistyä muihin nopeasti eteneviin tutkimusprojekteihin, jotka käyttävät tekoälyavusteista dokumentointia.

### 10.20 Huhtikuun 2026 kehitys: Skills-paradigma, Lifetime Fleet -tiekartta, 22. toimiala ja perustajan→tiimin siirtymä

_Lähteet: kenttämuistiinpanot 2026-04-06–2026-04-19; PR-numerot #1064, #1109, #1110, #1111, #1112, #1113, #1115, #1116, #1128; SOLO_FOUNDER_STATEMENT v1.2._

#### 10.20.1 Anthropicin Skills-paradigma — DWS:n taito-ensin -arkkitehtuurin ulkoinen validointi

Anthropic julkaisi 16.4.2026 esseen "Stop Building Agents, Start Building Skills" (kenttämuistiinpano `docs/field-notes/2026-04-16-anthropic-skills-paradigm-stop-building-agents.md`). Ydinväite: monoliittiset agentit kuluttavat liikaa kontekstikapasiteettia ja huonontuvat työkalumäärän kasvaessa; erilliset kutsuttavat taidot (Claude Code Skills, `.claude/commands/*.md`) päihittävät agenttikehykset yritysmittakaavassa, koska kukin taito ladataan vain tarvittaessa ja on yksittäin testattavissa.

Tämä on ensimmäinen merkittävä ulkoinen validointi osiossa 10.13 (Claude Code -suunnittelurakenne, Versio 3.17, 02.03.2026) ja osiossa 10.13.7 (Toimialakohtainen vs geneerinen AI-harness, Versio 3.31, 31.03.2026) tehdylle arkkitehtonisen vedonlyönnille:

| DWS:n kanta (ennen huhtikuuta 2026)                             | Anthropicin argumentti 16.4.2026                         | Tila      |
| --------------------------------------------------------------- | -------------------------------------------------------- | --------- |
| Taidot uudelleenkäytettävinä työnkulkukomponentteina (§10.13.3) | Taidot > agentit skaalassa                               | Validoitu |
| `.claude/commands/*.md` tuoterajapintana (§10.13.6)             | Erilliset kutsuttavat päihittävät monoliitit             | Validoitu |
| Agentti-ensin -tuotesääntö (CLAUDE.md "Build for Agents")       | Taidot ovat API-pinta                                    | Validoitu |
| Toimialaspesifisyys > laajuus (§10.13.7)                        | Geneeriset 136-taidon kehykset kaatuvat token-budjettiin | Validoitu |

**Taitokirjaston kasvu v3.31:stä (31.03.2026):** +3 tuotantotaitoa — `/regulatory-radar` (EU-sääntelyputken skanneri), `/investor-outreach` (sijoittajien INTRO-muistioiden luonnostelu/triage/seuranta), `/multilingual` (EU-kielipalkin generaattori onelifetime.world:lle ja dws10.com:lle). Yhteensä 24+ tuotantotaitoa ja 4 estävää kurinpitoporttia.

**Tutkimuspanos:** Taito-ensin -arkkitehtuuri ei ole enää arvioinnissa oleva hypoteesi — se on nouseva toimialan konsensus. Yhden hengen perustajatiimille säännellyllä toimialalla taitokirjasto toimii myös **yhteistyökumppaneiden ja osakastiimin perehdytysväylänä**: kukin taito on dokumentoitu, testattava laitoksen tietämysyksikkö, jota uusi tekijä voi ajaa lukematta koko koodipohjaa.

#### 10.20.2 Lifetime Fleet -tiekartan kiteytyminen — "Kädet"-kerros spesifikaatiosta aikatauluun

Brain-Memory-Body-Hands -arkkitehtuuri (CLAUDE.md "Project Overview") listasi Lifetime Fleetin ("Kädet") _"spesifikaatiovaiheessa"_ koko tämän opinnäytetyön ajan. Huhtikuussa 2026 tämä muuttui. Kaksi kenttämuistiinpanoa kiteyttävät tiekartan:

1. **`docs/field-notes/2026-04-15-finland-drone-strategy-lifetime-fleet.md`** — Lifetime Fleetin kohdistaminen Suomen dronestrategiaan 2030. Asemoi DWS:n hallinta- ja vaatimustenmukaisuuskerrokseksi suomalaisille teollisille droneille (maatalous, metsätalous, infrastruktuuri, puolustus) käyttäen alustaa varten jo rakennettua KYA/Aegis/Firehorse-inventaariota.
2. **`docs/field-notes/2026-04-19-drone-app-baltic-timeline-research.md`** — Baltia-ensin MVP-aikataulu: 12–16 viikkoa toimituskelpoiseen drone-sovellukseen käyttäen olemassa olevaa KYA-hallintaa (L1–L5), OpenSandbox-agenttieristystä ja Shufti IDV -integraatiota. Ei tarvetta uudelle laitteisto-T&K-syklille.

**Miksi tämä on opinnäytetyölle tärkeää:** Osio 10.18 (LWM-sekvensointistrategia, Versio 3.30) kehysti Brain-Memory-Body-Hands -pinon muodossa _vaatimustenmukaisuus → laivasto → Series A_. Huhtikuun 2026 kenttämuistiinpanot muuttavat "laivaston" Phase 2 -tavoitteesta konkreettiseksi Baltia-MVP:ksi uudelleenkäyttö-ensin -taloudella. Vaatimustenmukaisuus-ensin -maailmamalliteesi on nyt testattavissa tietyllä laitteistoluokalla tietyssä maantieteessä yhden kalenterineljänneksen sisällä.

#### 10.20.3 DWS IQ 7 Datakeskusten vaatimustenmukaisuusagentti — 22. toimiala ja vihreän vedyn lisäisyysvaatimus

Kaksi uutta kenttämuistiinpanoa lisäävät alustaan 22. toimialan:

- **`docs/field-notes/2026-04-18-eu-green-hydrogen-additionality-finland-datacentres.md`** — EU:n RFNBO-delegoitu asetus 2023/1184 (lisäisyys, ajallinen korrelaatio, maantieteellinen korrelaatio) sovellettuna suomalaisiin datakeskuksiin. Datakeskusten, jotka väittävät toimivansa uusiutuvaan vetyyn pohjautuvasti, on todistettava, että vety täyttää kaikki kolme lisäisyystestiä.
- **`docs/DWS_IQ_7_DATACENTRE_COMPLIANCE_AGENT_PRD_v0.1.md`** (ja myöhempi v0.2, joka lukitsee Ops Managerin V0-ostajaksi) — Agenttispesifikaatio, joka kohdentuu hyperskaalaajiin ja kolokaatio-operaattoreihin Suomessa (Microsoft, Google, Amazon, Equinix, Digita). Ops Manager -ICP validoitu ostajapersoonan validointiskriptillä.

**Sääntelykontribuutio osiolle 10.17 (Hiilitase):** Datakeskukset ovat ensimmäinen toimiala, jossa kirjanpidon on täsmäytettävä _sekä_ sähköpuolen laskenta (ETS Scope 2) _että_ polttoainepuolen laskenta (RFNBO-vedyn lisäisyys). Tämä laajentaa kaksinkertaisen hiilikirjanpidon alun perin analysoiduista sementti/teräs/rakennus-vertikaaleista data-intensiivisiin palveluvertikaaleihin — koetellen sääntelyiden välistä täsmäytysväitettä laadullisesti eri päästöprofiilin kanssa.

#### 10.20.4 Sääntelypinon laajennus: NIS2 + CER (hybridiuhkat)

CORE Resilience Model -blogikirjoitus (onelifetime.world/posts/core-resilience-hybrid-threats.html, 13.4.2026) ja Hybridiosaamiskeskus hallitus turvallisuusvastuu 8.5.2026 -kenttämuistiinpano laajentavat DWS:n sääntelykattavuuden ilmastosääntelyn ulkopuolelle:

| Sääntely                                     | Soveltamisala                                          | Kattavuuden tila          |
| -------------------------------------------- | ------------------------------------------------------ | ------------------------- |
| ETS, CBAM, CSRD, Taksonomia, EED, Fit-for-55 | Ilmasto/energia                                        | Tuotannossa (Osio 10.17)  |
| EU AI Act artikla 12                         | Tekoälyn hallinta/lokitus                              | Tuotannossa (Osio 10.13)  |
| **NIS2** (Direktiivi 2022/2555)              | Oleellisten ja tärkeiden toimijoiden kyberturvallisuus | **Lisätty huhtikuu 2026** |
| **CER** (Direktiivi 2022/2557)               | Kriittisten toimijoiden resilienssi (fyysinen + kyber) | **Lisätty huhtikuu 2026** |

Aegis-tuote (`dws10.com/products/aegis.html`, hackathon-demo PR #1128) uudelleenasemoidaan NIS2/CER-kiilaksi: suvereeni turvallisuushallinta kriittisen infrastruktuurin operaattoreille (SNCF Ranska infrastruktuurivalvonta -kenttämuistiinpano 14.4.2026 validoi vertikaalin). Tämä on ensimmäinen kerta, kun DWS IQ 6 kattaa muuta kuin ilmastosääntelyä — aineellinen laajennus alustan vaatimustenmukaisuusalueella.

#### 10.20.5 Perustajan→tiimin siirtymä ja sijoittajayhteydenpidon työnkulku

Osiot 10.7 (BYOA) ja 10.11 (Toimitusjohtajan automaatioagenttiryhmä) kehystivät DWS IQ 6:n yhden hengen käyttämäksi alustaksi, jossa tekoälytyökalut korvaavat henkilöstöä. Huhtikuu 2026 merkitsee tietoista siirtymää yksinperustajasta tiimiksi:

1. **`docs/investor-intros/SOLO_FOUNDER_STATEMENT.md` v1.2** — Yksi totuuden lähde -narratiivi Series A / SAFE -sijoittajakeskusteluihin. Lukitsee yksinperustaja-tekoälytiimin kanssa -teesin, jota tämä opinnäytetyö itsessään dokumentoi.
2. **Anthony Maurin CTO-yhteisrakentajapolku** (kenttämuistiinpano 2026-04-19 _CTO LinkedIn -haku käynnistetty_) — Ensimmäinen nimetty yhteisrakentaja. Osuussekvensointi tiukennettu sijoittajan uudelleenaktivointikatalyyttiä vasten (Perissich).
3. **`/investor-outreach` -taito** (PR #1109, `.claude/commands/investor-outreach.md`) — Toistettava työnkulku sijoittajien INTRO-muistioiden luonnosteluun, triageen ja seurantaan. 10+ nimettyä muistiota luonnosteltu 2 viikon ikkunassa: 42CAP (Wilke), Plug and Play Paris (Laouiti), Ingrisano, Perissich, Kefalogiannis, von Euen, Yomutbayev, Zawadzinski.

**Tutkimuspanos:** Yksinperustaja-tekoälytiimin kanssa -hypoteesista ei luovuta — se _vaiheistetaan_. Alustan on oltava yhden hengen käytettävissä hetkellä t=0 (tämän opinnäytetyön dokumentoitu tila), mutta sen on myös sulautettava pieni perustajatiimi ilman, että alustan teesi romahtaa. `/investor-outreach` -taito on konkreettinen mekanismi: sijoittajaputki itsessään on nyt DWS IQ -työnkulku, ei hiljaista perustajatietoa.

#### 10.20.6 Tutkimuspanos

**Avainpanos #25 — Skills-paradigma toimialakonsensuksena validoitu:** Anthropicin 16.4.2026 essee "Stop Building Agents, Start Building Skills" validoi ulkoisesti taito-ensin -arkkitehtuurin (§10.13) ja toimialakohtaisen harnessin paremmuuden geneeriseen nähden (§10.13.7). DWS IQ 6:n taitokirjasto (24+ tuotantotaitoa, 4 kurinpitoporttia) on nouseva toimialan malli, ei DWS-spesifinen veto.

**Avainpanos #26 — Lifetime Fleet -kiteytyminen:** Brain-Memory-Body-Hands -pino on nyt testattavissa päästä päähän. Lifetime Fleet siirtyy "spesifikaatiovaiheesta" 12–16 viikon Baltia-ensin -MVP:ksi (19.4.2026) täydellä KYA/Aegis/Firehorse-hallintapinon uudelleenkäytöllä. Vaatimustenmukaisuus-ensin -maailmamalliteesi (§10.18) ei ole enää Phase 2 -abstraktio.

**Avainpanos #27 — 22. toimiala vihreän vedyn lisäisyyden kautta:** Datakeskusten vaatimustenmukaisuusagentti (RFNBO-delegoitu asetus 2023/1184) laajentaa kaksinkertaisen hiilikirjanpidon (§10.17) laadullisesti erilaiseen vertikaaliin (data-intensiiviset palvelut, ei raskasteollisuus). Sääntelypino kattaa nyt NIS2 + CER ilmastosääntelyn rinnalla — alustan EU-sääntelyalueen ensimmäinen poikkialueellinen laajennus.

**Avainpanos #28 — Perustajan→tiimin siirtymä alustan ominaisuutena:** Yksinperustaja-tekoälytiimin kanssa -teesi vaiheistetaan, ei julisteta. `/investor-outreach` -taito ja SOLO_FOUNDER_STATEMENT -yksi-totuuden-lähde -malli tekevät sijoittajayhteydenpidosta DWS IQ -työnkulun, ei hiljaista perustajatietoa. Tämä validoi alustan oman teesinsä: jos alusta ei voi ajaa omaa varainkeruutaan toistettavana taitona, se ei voi väittää replikoivansa ratkaisutehdas-työtä asiakkaille.

### 10.21 Tohtoripolun kohdennus: KYA-perusta, DWS 7 tavoitteet ja dual-use-laajennus

#### 10.21.1 KYA Agentic AI Foundation -standardina

KYA (Know Your Agent) nostetaan tässä päivityksessä eksplisiittisesti kohti **Agentic AI Foundation** -standardia. Tavoitteena on, että KYA määrittää minimivaatimukset agenttien identiteettisidonnalle, suoritusaikaiselle valvonnalle, auditointipolulle, kill-switch-hallinnalle ja suvereniteettivalvonnalle eri toimialoilla.

#### 10.21.2 DWS 7 -tavoitteet tutkimuksen empiiriseksi rungoksi

DWS 7 toimii tutkimuksen käytännön validointialustana:

1. hiilitaseen pysyvä kirjanpitokerros,
2. KYA-hallinnan tuotantotason todistusketju,
3. suvereniteettisegmentointi tuotetasoille (Aegis / Sovereign Infra / Connect),
4. kumppanikanavaintegraatio Siemens- ja NVIDIA Connect -ekosysteemeihin.

#### 10.21.3 Vetytalouden jatkumo (DWS 5 -> DWS 7)

Vetytalous kirjataan tutkimuksen läpileikkaavaksi teemaksi: DWS 5 -vaiheessa tunnistettu vety- ja energiasääntelyn merkitys jatkuu DWS 7 -toteutuksessa RFNBO-lisäisyyslogiikan, ajallisen korrelaation ja maantieteellisen korrelaation todentamisena.

#### 10.21.4 Kolmas tutkimuskohde: dual-use-toimialat

Kolmas tutkimuskohde kohdennetaan dual-use-toimialoihin (teollisuus + puolustus). Tätä varten kirjataan erikseen käynnissä oleva keskustelupolku **Nokia Defencen** kanssa osana rahoitus- ja pilotointivalmistelua.

#### 10.21.5 Tuotetasojen suvereniteettisegmentointi (keskeinen kuva)

<img src="../../../../artifacts/Sovereignty.jpg" alt="Aegis, Sovereign Infra ja Connect -suvereniteettisegmentointi" />

Segmentoinnin tutkimuksellinen rooli:

- **Aegis:** kriittisen infrastruktuurin turvallisuushallinta
- **Sovereign Infra:** EU-suvereeni tuotantotaso säännellyille asiakkaille
- **Connect:** globaali integraatio- ja jakelutaso

#### 10.21.6 Yhteistyöankkurit

Siemens-yhteistyö ankkuroidaan digitaalisen kaksosen ja teollisen IoT-datan yhteyteen. NVIDIA Connect -yhteistyö ankkuroidaan agentti-inferenssin, reunalaskennan ja kumppanijakelun tekniseksi ja kaupalliseksi vipuvarreksi.

#### 10.21.7 Ohjaajapalaute ja vastauskirjeen runko

Kari Smolanderin ohjaajapalaute (2 vuoden sitoutumisraja, tiedeyhteisöön sosiaalistuminen, 3-5 vertaisarvioitua julkaisua + laaja johdanto) on huomioitu. Vastauskirjeen runko kohdistetaan pyydettyihin kohtiin:

- tutkimusongelma,
- tutkimuksen tavoitteet,
- alustava tutkimusmenetelmä,
- läpiviennin vaiheistus ja julkaisupolku.

Tämä luo konkreettisen seuraavan vaiheen tapaamiselle ja tutkimussuunnitelman täsmentämiselle.

#### 10.21.8 Open source -standardireitti ja julkaisuvaiheistus

Boardy-keskustelun perusteella tutkimusasetelmaan kirjataan eksplisiittinen standardointistrategia:

1. **Artikkeli 1 (2026):** "KYA Standard: An Open Source Governance Framework for Agentic AI in EU-Regulated Industries" — ehdotus Agentic AI Foundation / Linux Foundation -standardireitille + konferenssiesitys.
2. **Artikkeli 2 (2027):** MCP + A2A -arkkitehtuurin skaalautuvuus säännellyissä vertikaaleissa (journal-kohdennus).
3. **Artikkelit 3-4 (2028):** empiiriset tulokset asiakkaiden tuotantoaineistolla.
4. **Koontiosa (2028-2029):** johdanto + väitöskokonaisuus.

Tilapäivitys (21.04.2026):

- KYA open source -ehdotusta ei ole vielä lähetetty.
- NIST-hakemusta ei ole lähetetty.
- Polut ovat rinnakkaisia; tämän kierroksen prioriteetti on open source -adoptio.

Lisäksi EIC Step 1 -ikkuna (5-sivuinen proposal, 10-slide deck, 3 min video script) kirjataan tutkimusohjelman tuotteistuskanavaksi, joka tukee Artikkeli 1:n argumentaatiota ilman että korvaa tieteellistä julkaisupolkua.

---

### 10.22 DWS Skilled -taksonomia: kolme tasoa agenteille, työnkuluille ja jurisdiktioille

_Lisätty: 22.04.2026 | Lähde: CLAUDE.md "DWS Skilled Taxonomy Rule"; Anthropicin 16.4.2026 Skills-paradigman essee (§10.20.1); "GodAgent"-brändin käytöstä poisto._

#### 10.22.1 Motivaatio

Aikaisempi "GodAgent"-brändäys (otettu käyttöön V3-alustarakennuksen aikana, ks. §10.13 ja `docs/Deputy-Agents-Architecture.md`) yhdisti kolme eri referenttiä yhteen termiin — brändilupauksen (taidoilla hankittu kyvykkyys), teknisen määrittelyn (toimialakohtainen AI-agentti, joka laajentaa perus-compliance-kerrosta) ja käyttöliittymäkategorian (ostajille ja operaattoreille näytettävä listaus). Yhdistäminen oli siedettävää alkuvaiheessa, mutta siitä tuli positiointiriski heti kun Anthropicin Skills-paradigma (§10.20.1) validoi "taito-ensin" -arkkitehtuurin alalla vallitsevaksi konsensukseksi. Tässä osiossa "GodAgent"-termi korvataan rekisterikohtaisella terminologialla ja — mikä olennaisempaa — sama kolmitasomalli laajennetaan agenttien lisäksi työnkulkuihin ja jurisdiktioihin.

#### 10.22.2 Kolmitasomalli

Taksonomia määrittelee yhden kolmitasomallin, jota sovelletaan jokaiseen kyvykkyysakseliin, jossa DWS tarjoaa syvyyttä:

```
Skilled <Akseli>                 ← BRÄNDI  (mitä MYYDÄÄN)
    └─ Industrial Specialist <Akseli>    ← SPEKSI  (mitä ne OVAT)
            └─ Industry <Akseli>         ← UI      (miten ne LISTATAAN)
```

Kolme tasoa erottavat markkinoinnin, dokumentaation ja käyttöliittymän rekisterit yhteisen mentaalimallin alla. Termit viittaavat samaan alkuperäiseen artefaktiin kullakin akselilla; rekisteri muuttuu pinnan mukana.

#### 10.22.3 Kolme aktiivista akselia (huhtikuu 2026)

| Taso     | **Agentit**                  | **Työnkulut (Workflows)**                                             | **Jurisdiktiot**                      |
| -------- | ---------------------------- | --------------------------------------------------------------------- | ------------------------------------- |
| 1 Brändi | Skilled Agents               | Skilled Autonomous Workflows                                          | Skilled Jurisdictions (EU, US, Aiven) |
| 2 Speksi | Industrial Specialist Agents | Specialist Workflows (pitkä muoto: _Industrial Specialist Workflows_) | Regulatory Specialist Jurisdictions   |
| 3 UI     | Industry Agents              | Industrial Workflows                                                  | Jurisdictions                         |

**Agentit.** Toimialakohtaiset AI-agentit, jotka laajentavat perus-Athena-EU-compliance-kerrosta sektorikohtaisella osaamisella (teräs, sementti, kemia, rakennus, datakeskukset ja §10.6–10.8:ssa dokumentoidut 20+ toimialaa).

**Työnkulut.** Agenttien deterministiset kompositiot, joita käynnistetään aikataululla tai tapahtumalla — §10.13.3:n taitojenkäynnistyskerros. "Autonomous" lisätään brändi­tasolle, koska työnkulut suoritetaan ilman ihmistä silmukassa, kun taas agentteja kutsutaan.

**Jurisdiktiot.** Sääntelypinnat, joissa alusta on taitava — tällä hetkellä EU (AI Act, GDPR, CBAM, ETS, CSRD, ESRS, EPBD), US ja Aiven kartoitettuina tietoresidenssi-arkkitehtuurissa (ks. `docs/CLOUD_ENVIRONMENTS.md`). Speksi­tasolle lisätään "Regulatory", koska jurisdiktio määrittyy sääntelypinnan, ei pelkän maantieteen kautta.

#### 10.22.4 Laajennettavuus

Kun DWS lisää uuden kyvykkyysakselin (esim. Datasets, Models, Regulations, Reports), se nimetään `Skilled <Akseli>` / `Industrial Specialist <Akseli>` / `Industry <Akseli>` ja lisätään taksonomiataulukkoon uutena sarakkeena. Rinnakkaiset brändisanat on kielletty; malli on tietoisesti monotoninen välttääkseen rekisterien sekoittumisongelman, jonka aikaisempi "GodAgent"-termi aiheutti.

#### 10.22.5 Lukumäärien dynamiikka

Kunkin akselin entiteettien lukumäärä muuttuu ajan myötä (esim. 22. toimiala datakeskusten compliance-agentin kautta, §10.20.3; taitokirjasto laajeni 6→21→24+ välillä v3.31–v3.34). Kovakoodatut lukumäärät brändikopiossa ovat siksi anti-pattern. Kolme hyväksyttävää kaavaa:

1. **Avoimet lukumäärät** alustakopiossa — `18+ Skilled Agents`, `20+ Skilled Jurisdictions`; `+` imee kasvun.
2. **Rekisteriankkuroidut viittaukset** dokumenteissa — "ks. Industrial Specialist Agent -rekisteri `docs/Deputy-Agents-Architecture.md` §3:ssa"; ei numeroa tekstissä.
3. **Tuotekohtaiset lukumäärät** SKU-kopiossa — "Climate Intelligence sisältää 8 Skilled Agentia"; hyväksyttävä, mutta käsitellään osana SKU-spesifikaatiota `products.json`-tiedostossa, ei vapaasti tekstissä.

#### 10.22.6 Poikkeukset

Kolme aluetta on nimenomaisesti suljettu uudelleennimennän ulkopuolelle:

- **Docker- ja infra-tunnisteet** (`dws-godagent-llm`-verkko, `dws-godagent:latest`-image, label `dws-godagent`, iptables-säännöt `docs/Deputy-Agents-Architecture.md` §2.4–2.6:ssa) säilyvät ennallaan. Niiden uudelleennimenä vaatisi koordinoidun infra-migraation, ei dokumentaatio-PR:n.
- **Pantheon "God Agents"** (kahdella sanalla, `onelifetime.world` Pantheon-storyboard, kreikkalaismyyttisten agenttien hahmot — Zeus, Athena jne.) on erillinen brändi-identiteetti (§10.13 Climate IQ Pantheon -nimeämiskäytäntö) ja säilyy ennallaan.
- **Historialliset tietueet** (field-muistiinpanot, `tuntikirjausraportti`, `Oppimispäiväkirja`, päivätyt tuotekehityskulukansiot) ovat ajanhetkikirjoja, joita ei editoida takautuvasti.

#### 10.22.7 Tutkimuspanos

Taksonomia ei ole pelkkä nimeämissopimus; se dokumentoi suunnitteluperiaatteen. Agenttituotebrändäys on monirekisterinen, eikä yksi termi voi palvella brändiä, spesifikaatiota ja käyttöliittymää samanaikaisesti ilman että kukin rekisteri laimentuu. EU-sääntelyn alaisille teollisuusalustoille — joissa auditointitason täsmällisyys (speksirekisteri) ja ostajalle luettava kopio (brändirekisteri) on molempien selvittävä compliance-tarkastuksesta ja joissa navigointi­tason kategorialabeli on sekunneissa tehtävä ostopäätös — kolmitasoinen taksonomia hajottaa brändiongelman, jonka Silicon Valley -kuluttaja-alustat voivat kiertää yhdellä tuotenimellä. Saman mallin laajentaminen kolmelle ortogonaaliselle akselille (agentit, työnkulut, jurisdiktiot) osoittaa että taso­rakenne yleistyy "mitä agentteja kutsumme" -kysymyksen ulkopuolelle mille tahansa kyvykkyysakselille, jossa DWS myy syvyyttä.

**Avainpanos #31 — Kolmitasoinen Skilled-taksonomia säännellyille teollisuus-AI-alustoille:** Brändi / spesifikaatio / UI -taksonomia (Skilled / Industrial Specialist / Industry) esitetään suunnittelumallina agenttialustoille, joiden on samanaikaisesti palveltava brändi-, dokumentaatio- ja käyttöliittymäyleisöjä EU-sääntelyn alaisilla toimialoilla. Malli yleistyy kyvykkyysakseleille (agentit, työnkulut, jurisdiktiot ja tulevat akselit) monotonisen `Skilled <Akseli>` -kaavan alla, välttäen sekoittumisen, jota yksilabelmallit aiheuttavat alustoilla, joissa kukin rekisteri on eri compliance-rajoitteiden alainen.

---

### 10.23 Kolmen pääoman kertymismalli: token-pääoma, inhimillinen pääoma ja Control Room -pääoma DWS IQ 6 -toimintamallin kestävinä omaisuuserinä

#### 10.23.1 Konteksti ja motivaatio

Lokakuusta 2025 noin toukokuuhun 2026 ulottunut seitsemän kuukautta muodosti DWS IQ 6 -toimintamallin intensiivisimmän HIL-vaiheen (Human-in-the-Loop). Kesäkuussa 2026 havaittiin operatiivinen vaihesiirtymä: järjestelmä saavutti operatiivisen kypsyystason, jossa operaattorin ensisijainen rooli siirtyi yksittäisten tuotosten tarkistamisesta tuotosten generointia ohjaavien arkkitehtuuristen politiikkojen asettamiseen ja ylläpitoon. Kuntosali palasi päivittäiseen aikatauluun.

Tämä luku dokumentoi toteutuspuolen todistusaineiston sille, mitä tohtoriopinnäytetyö (§14.25) kehystää teoreettisesti kolmen pääoman kertymismallina: **token-pääoma**, **inhimillinen pääoma** ja **Control Room -pääoma**. Kaikki kolme kertyivät samanaikaisesti HIL-vaiheen aikana. Tämä luku kattaa toteutustiedot; markkinasignaali­kehystys (Satya Nadellan Build 2026 -sanasto) ja kilpailuanalyysi kuuluvat §14.25:een §1.4:n master-vs-PhD-skooppisäännön mukaisesti.

#### 10.23.2 Token-pääoma — mitattu inventaario (kesäkuu 2026)

Token-pääoma on uudelleenkäytettävä organisatorinen omaisuuserä, joka syntyy ylläpidetyn tekoälyavusteisen toiminnan sivutuotteena. Se ei ole kulutetut tokenit; se on kestävä tuotos, joka säilyy istuntorajojen yli ja tallentuu koodatussa muodossa.

**Mitattu inventaario kesäkuussa 2026:**

| Omaisuuserälaji           | Määrä  | Sijainti                          | Uudelleenkäyttömekanismi                     |
| ------------------------- | ------ | --------------------------------- | -------------------------------------------- |
| Taitotiedostot            | 30+    | `skills/<name>/SKILL.md`          | Slash-kutsuttavissa mistä tahansa istunnosta |
| Kenttämuistiot            | 150+   | `docs/field-notes/`               | Haettavissa oleva institutionaalinen muisti  |
| Agentikonfiguraatiot      | 50     | `src/agents/`                     | Foundry, artikla 12 -lokitus                 |
| Standardidokumentit       | 10+    | Juuritason `DWS_*.md`             | Reititystaulukko CLAUDE.md:ssä               |
| Validoidut koukut         | Useita | `.claude/hooks/`                  | Istunnonkäynnistys, pre-commit, audit        |
| Cron/automaatiokirjaukset | Useita | `scripts/daily`, `scripts/weekly` | Ajastinrekisteröity, ajaa ilman valvontaa    |

CLAUDE.md-sääntö "Kaksi kertaa pyytäminen = epäonnistuminen" operationalisoi kertymismekanismin: jokainen manuaalisesti suoritettu harkinta, joka sulkee taitosilmukan, poistaa kyseisen päätöksen pysyvästi operaattorin toistuvasta huomiosta.

#### 10.23.3 Inhimillinen pääoma — HIL-vaihe koulutus­ohjelmana

Seitsemän kuukauden HIL-vaihe toimi jälkikäteen tarkasteltuna intensiivisenä ja toimialakohtaisena koulutus­ohjelmana. Operaattoria ei korvattu; operaattorin asiantuntemusprofiili muuttui merkittävästi.

**HIL-vaiheen aikana syventyneet kyvyt:**

- **Agentituotosten hahmontunnistus** — vikasilahtia (hallusinaatiotyyppi, laajuuden ryömintä, standardireititysvirheet) tunnistetaan tuotoksen ensimmäisestä kappaleesta ilman koko lukemista
- **Kehotteen kalibrointi-intuitio** — järjestelmäkehotteen alispesifikaatio diagnosoidaan tuotossignaalista, ei yritys-erehdys-iteraation kautta
- **Arkkitehtuurinen harkinta delegoinnista** — todistusperusteiset kynnykset sille, mitkä agenttitoiminnot vaativat tarkistuksen ja mitkä voidaan luottaa ajettavaksi ilman valvontaa
- **Vikamuotolukutaito** — toimialakohtainen tieto siitä, mitkä tehtävät kantavat mitäkin vikamuotoja, mahdollistaen kohdennetun tarkistuksen
- **Taitotaksonomian sujuvuus** — kyky tunnistaa reaaliajassa, kun harkintatehtävä on toistuva ja tulisi koodata eikä toistaa

Tämä asiantuntemus on hiljaista ja ruumiillistunutta. Sitä ei voi hankkia palkkaamalla henkilön, joka ei osallistunut HIL-vaiheeseen.

#### 10.23.4 Control Room -pääoma — käyttöönotettu infrastruktuuri (kesäkuu 2026)

DWS Control Room -arkkitehtuuri (määritelty `docs/Lyhenteet.md`:ssä ja `docs/Deputy-Agents-Architecture.md §9`:ssä) on hybridiarkkitehtuurin reunakerros:

- **Control Room** — reunakerros, reaaliaikaiset havainnot, HIL-hyväksyntäportit, keskeytys/ohitus, artikla 12 -auditointipolku, tavoitelatenssi < 100 ms
- **Situation Room** — pilvikerros, strateginen koostaminen, syvyysanalytiikka, ERP/BIM/IoT-integraatio, vaatimustenmukaisuusraportointi

**Control Room -pääoma, joka kertyi HIL-vaiheen aikana:**

| Omaisuuserä                        | Tila (kesäkuu 2026)      | Todisteet                                           |
| ---------------------------------- | ------------------------ | --------------------------------------------------- |
| Reunalaskentasolmut                | Käyttöönotettu           | Acer Veriton GN100, DGX Spark, NVIDIA Jetson -tasot |
| Luokittelukynnykset                | Empiirisesti kalibroidut | Kenttämuistiot: 2026-03-01, 2026-03-13, 2026-03-29  |
| HIL-hyväksyntäportin konfiguraatio | Testattu tuotannossa     | CLAUDE.md auto-mode -koukut, hook-auditointi­lokit  |
| Artikla 12 -auditointipolku        | Täytetty                 | `article12-logger.ts`, `agent_executions` -taulukko |
| Poikkeuskaavio                     | Dokumentoitu             | Kenttämuistiokokoelma, `.claude/hooks/README.md`    |
| Monipalveluntarjoajareititys       | Validoitu                | Groq / Baseten / OpenAI / Scaleway / DGX Spark      |

#### 10.23.5 HIL → HIC -siirtymä insinöörointivirstanpylväänä

HIL → HIC -siirtymä ei ole tuotehallinnallinen päätös. Sillä on tarkat insinöörointiset edellytykset, jotka voidaan verifioida:

1. **Token-pääomakynnys:** Taitokokoelma on riittävä siten, että useimmat toistuvat harkintatehtävät käsittelee taito ilman operaattorin väliintuloa.
2. **Inhimillisen pääoman kynnys:** Operaattori tunnistaa vikasilahdot allekirjoitustasolla ennen koko tuotoksen tarkistamista.
3. **Control Room -pääomakynnys:** Automatisoituun järjestelmään voidaan luottaa tuotantokuorman ylläpidossa työpäivän ajan ilman tuotoskohtaista tarkistusta.

Kesäkuun 2026 havainto — kuntosalin palaaminen aikatauluun — on kaikkien kolmen kynnyksen samanaikaisen ylittymisen operatiivinen ilmenemä DWS IQ 6 -järjestelmän useimmilla osa-alueilla.

**Edelleen HIL:ssä olevat alueet (kesäkuu 2026):** Tietoturva-asennon muutokset, supabase-migraatioiden kirjoittaminen sekä kaikki agentituotokset, jotka koskevat rahoituksellisia tai oikeudellisia kenttiä.

#### 10.23.6 Tutkimuspanos

**Avainpanos #32 — Kolmen pääoman kertymismalli: toteutustodisteet seitsemän kuukauden tuotanto-HIL-operaatioista:** DWS IQ 6:n tuotantotallenne (lokakuu 2025 – kesäkuu 2026) tarjoaa ensimmäisen empiirisen, monikuukautisen toteutustodistusaineiston §14.25:ssä kehitetylle teoreettiselle kolmen pääoman mallille. Token-pääomainventaario (30+ taitoa, 150+ kenttämuistiota, 50 agenttia artikla 12 -lokituksella), dokumentoitu inhimillisen pääoman syveneminen (hahmontunnistus, kehotteen kalibrointi-intuitio, arkkitehtuurinen harkinta, vikamuotolukutaito) ja Control Room -pääoma (kalibroidut kynnykset, validoidut HIL-portit, täytetty artikla 12 -auditointipolku, testattu monipalveluntarjoajareititys) muodostavat yhdessä mitattavan perusviivan sille, mitä tuotantoagenttinen toimintamalli kerryttää seitsemän kuukauden HIL-vaiheen aikana. Panos tarjoaa: (a) per-pääoma mitattavat indikaattorit, jotka operationalisoivat teoreettisen mallin; (b) HIL → HIC -siirtymän insinöörointimääritelmän toimialakohtaisilla edellytyksillä; (c) taitokokoelman agenttisen toimintamallin kypsyyden ensisijaisena KPI:nä. Tämä panos asemoituu toteutushorisonttiin (nykyinen tuoteskooppi) ja on empiirisesti perusteltu — kesäkuun 2026 siirtymätapahtuma on dokumentoitu operatiivinen havainto, ei ennakoitu virstanpylväs.

---

#### 10.23.7 Neljän pääomaluokan kartoitus arkkitehtuuriin

§14.26 väitöskirjassa (PHD_FIREHORSE_EN.md) formalisoi 4P-pääomaluokat kanonisena laajennuksena §14.25:n kolmen pääoman malliin: Prompt (ent. Token), Ihmiset (ent. Inhimillinen), Laitos (ent. Control Room) ja Havainto (uusi — hallittu maailmanmalli ja suljettu ohjaussilmukka). Tässä osiossa kartoitetaan kukin neljästä luokasta muualla tässä opinnäytetyössä dokumentoituihin DWS IQ 6 -arkkitehtuurikomponentteihin.

**Arkkitehtuurin kartoitustaulukko:**

| Pääomaluokka | Aivo-Muisti-Keho-Kädet-kerros      | DWS IQ 6 -komponentti                                                                                                                                                                                                                                                   | Viittaus opinnäytetyöhön             |
| ------------ | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| **Prompt**   | Aivot (älykkyys)                   | SOUL.md, järjestelmäkehotteet, validoitu taitokorpus (`skills/`), agenttikonfiguraatiot (`src/agents/`), eval-datasetit (`src/evals/datasets/`)                                                                                                                         | §10.16 (Harness Engineering), §10.13 |
| **Ihmiset**  | Muisti (harkinta)                  | HIL-vaiheen syventynyt operaattoriasiantuntemus; taksonomia (§10.23.3); HIL → HIC -siirtymähavainto                                                                                                                                                                     | §10.23.3, §10.23.5                   |
| **Laitos**   | Keho (infrastruktuuri)             | Control Room + Situation Room kahden huoneen rakenne — käyttöönottettavissa sivustolla **tai Lifetime Fleet -ajoneuvossa**; NVIDIA Jetson / Acer GN100 / DGX Spark reuna-laskenta; artikla 12 -lokitusputki; validoidut päättelykonfiguraatiot; testattu vikasietoisuus | §10.10, §10.10.6.1, §10.15           |
| **Havainto** | Kädet (toimilaite + maailmanmalli) | Lifetime World Model (`ONTOLOGY.md`); agenttimuisti (§10.10.7); artikla 12 -linjakirjaus; suljettu aista → päätä → toimi -silmukka HIL/HIC-portilla                                                                                                                     | §10.18, §10.10.7                     |

**Uudelleennimeämishuomio:** 4P-kaanonin myötä itsenäinen "Token / Inhimillinen / Control Room -pääoma" -nimeäminen poistetaan ensisijaisena terminä uudesta tekstistä. §10.23.2/§10.23.3/§10.23.4 säilyttävät alkuperäiset nimet alkuperäisdokumentointina; tässä osiossa esitellään 4P-aliakset.

**GTM-kiila — laajene-käyttöönottomalli.** Arkkitehtuurikartoituksella on operatiivinen implikaatio ensimmäisille asiakaskäyttöönotoille. Koska Havaintopääoma kertyy vain jos käyttöönottopinta kasvaa, ensimmäinen DWS IQ -käyttöönotto on tahallaan **eristetty ja vaaraton**: yksi agentti lukee olemassa olevia lokeja, yksi Control Room -reunasolmu sivuston etäkohteella jossa asiakastiimillä ei aiemmin ollut laskentaa, yksi raportti jota tiimi ei aiemmin pystynyt tuottamaan. Ensimmäinen voitto ansaitsee oikeuden toiseen vaatimatta asiakastiimiä uudelleenjärjestäytymään uuden työkalun ympärille.

**Avainpanos #33 — Neljän pääoman (4P) arkkitehtuurikartoitus: Prompt, Ihmiset, Laitos, Havainto DWS IQ 6:ssa:** 4P-kanonisten pääomaluokkien kartoitus DWS IQ 6:n Aivot-Muisti-Keho-Kädet-arkkitehtuuriin tarjoaa toteutuskerroksen todisteet siitä, että väitöskirjan §14.26:n teoreettinen laajennus vastaa olemassa olevia, käyttöönotettuja komponentteja. Kukin pääomaluokka on mitattava arkkitehtuurijalanjälki: Prompt-pääoma on `skills/`-korpus ja eval-datasetit (§10.16); Ihmispääoma on seitsemän kuukauden HIL-tallenne ja HIL → HIC -siirtymähavainto (§10.23.3/§10.23.5); Laitospääoma on kahden huoneen reunapino, mukaan lukien mobiili käyttöönotto Lifetime Fleet -ajoneuvossa (§10.10/§10.15); Havaintopääoma on Lifetime World Model, agenttimuistiputki ja artikla 12 -linjakirjaus suljetulla aista → päätä → toimi -silmukalla (§10.18/§10.10.7). GTM-laajentumismalli seuraa suoraan Havaintopääoman kertymismekanismista. Tämä panos asemoituu toteutushorisonttiin, viitaten väitöskirjan §14.26:een (teoria) ja §14.27:ään (Kaukopää / Enso historiallinen tapaus). Liiteartefaktit: `docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md` (v2.0, 4P-kaanonin mukaan), `DWS_BRAND_STANDARD.md` §23.

---

### 10.24 Kyvykkyysontologia ja kolmen pilarin konsultointimalli — Agenttitaksonomiasta yritystoimitukseen

#### 10.24.1 Motivaatio

Kesäkuuhun 2026 mennessä DWS IQ 6:n agenttipopulaatio oli kasvanut yli 58 rekisteröityyn agenttiin eri alijärjestelmissä, ja 18 lisäkyvykkyysaluetta tunnistettiin yritysasiakkaille suunnatun konsultointivalmistelun yhteydessä. Litteä agentti-inventaario — vaikka toiminnallisesti kattava — ei tarjonnut taksonomista rakennetta, jota yritysasiakkaat voisivat navigoida. Kaksi tuoteinsinöörinnin haastetta nousi samanaikaisesti:

1. **Ontologinen.** Agenttiryppäiden ympärille orgaanisesti muodostuneet 10 kyvykkyyskategoriaa eivät olleet pelkkä ryhmittelyn mukavuus — ne kartoittuivat LWM:n tietograafin luokkiin. Rakenteen eksplisiittinen paljastaminen antaisi asiakkaille mahdollisuuden päätellä kattavuusaukkoista.

2. **Poliittinen.** Yritysasiakkaat olivat historiallisesti käyttäneet yli 72 henkilöstökonsultointiroolia (Cloud Ready Teams, 2024-editio). Yli 80 agenttikyvykkyyden kehystäminen "roolien korvaajiksi" laukaisisi työpaikkojen menettämisen pelkoja ja hankintavastarintaa.

#### 10.24.2 Kyvykkyysontologia — 10 LWM-tietograafin luokkaa

Yli 80 agenttikyvykkyyttä järjestettiin 10 ontologialuokkaan, jotka johdetaan Lifetime World Modelin tietograafirakenteesta:

| #   | Ontologialuokka | Esimerkkikyvykkyydet                                       |
| --- | --------------- | ---------------------------------------------------------- |
| A   | Konsultointi    | Business Analyst, Change Management, Training & Enablement |
| B   | Sääntely        | ComplianceAgent, EU AI Act Monitor, CBAM Calculator        |
| C   | Toimiala        | ArgusAgent (SAR), Energy Compliance, Construction Safety   |
| D   | Orkestrointi    | Zeus Orchestrator, Workflow Engine, Integration Architect  |
| E   | Kenttä          | Fleet Manager, IoT Edge Controller, Process Automation     |
| F   | Myynti          | LeadAgent, CRM Pipeline, Contract Management               |
| G   | Tiedonhallinta  | Data Engineer, Database Architect, Technical Writer        |
| H   | Järjestelmä     | DevOps Agent, Test Automation, Cloud Migration             |
| I   | Puolustus       | Aegis-alusta, Network Security, Supply Chain Risk          |
| J   | Muutos          | Disruption Response, HR Systems, Service Desk              |

Ontologia ei ole litteä lista vaan tietograafi: kullakin luokalla on suunnatut kaaret niihin luokkiin, joista se riippuu (esim. Sääntely → Tiedonhallinta todisteputkille; Toimiala → Orkestrointi moniagenttityönkuluille). Tämä graafirakenne on sama LWM-topologia, jota Havaintopääoma (§10.23.7) kerryttää — ontologia on Havaintopääoman skeema.

#### 10.24.3 Kyvykkyys-ei-rooli-kehystys

62 olemassa olevaa agenttia ja 18 uutta kyvykkyysaluetta kehystettiin eksplisiittisesti _kyvykkyyksinä_, ei ammattinimikkeinä. Toimintaperiaate: "DWS ei korvaa yrityksen henkilöstöä. DWS tuo kyvykkyyttä." Kehystyspäätöksellä on kolme insinöörinnin seurausta:

1. **Hankintapolku.** Kyvykkyyshankinta ei laukaise yhteistoimintaneuvotteluvelvoitteita Suomen YT-lain mukaan.
2. **Käyttöönottomalli.** Kyvykkyys täydentää olemassa olevaa roolinhaltijaa — GTM-laajentumismalli (§10.23.7) toteutuu yksittäisen tekijän tasolla.
3. **Katalogirakenne.** Kyvykkyyskatalogi kasvaa jatkuvasti sen sijaan, että se versioitaisiin kiinteänä henkilömääränä.

#### 10.24.4 Kolmen pilarin konsultointimalli

Kyvykkyysontologia vaati toimituskehyksen. Konsultointimallin toimitusmalli kiteytyi kolmeen pilariin:

1. **Pilari 1 — Kyvykkyyskoulutus.** Koulutamme asiakkaan tiimin käyttämään yli 80 agenttikyvykkyyttä olemassa olevissa työnkuluissa.
2. **Pilari 2 — Toimialakohtaisten compliance-työnkulkujen kehittäminen.** Autamme toimialakohtaisten älykkäiden compliance-työnkulkujen kehittämisessä ja tuotantoon viemisessä. Tämä pilari operationalisoi LWM-sekvensointistrategian (§10.18) asiakastasolla.
3. **Pilari 3 — Keskeytyksetön projektin jatkuvuus.** Varmistamme että hanke etenee ilman keskeytyksiä. Käytetään Keskeytyslaskuria (lifetime.fi/laskuri/) kontekstin uudelleenrakennuskustannusten, vauhdin menetyksen ja avainhenkilöriskin kvantifiointiin.

Kolme pilaria kartoittuvat suoraan 4P-pääomamalliin (§10.23.7): Pilari 1 rakentaa Ihmispääomaa, Pilari 2 rakentaa Prompt- + Havaintopääomaa, Pilari 3 suojaa Laitospääoman jatkuvuutta.

#### 10.24.5 Aegis Defence -kyvykkyyden korjaus

Käsikirjan valmistelun aikana ArgusAgentin todellisten kyvykkyyksien tutkimus paljasti, ettei aiemmin väitettyä "dronetunnistusta" ole toteutettu. Rehellinen kyvykkyysprofiili on SAR-orbitaalinen (synteettisen apertuurin tutka) kohdetunnistus ICEYE-kumppanuuden kautta — muutosdetektio satelliittikuvissa, ei reaaliaikaista ilmavalvontaa. Aegis Defence -osio kirjoitettiin uudelleen kaikissa myynti- ja konsultointidokumenteissa viidellä todennettavalla työnkululla:

1. SAR-orbitaalinen kohdetunnistus + muutosdetektio
2. NIS2 + CER + Cyber Resilience Act -vaatimustenmukaisuuden monitorointi
3. Vientivalvonnan vaatimustenmukaisuus (EU-asetus 2021/821 kaksikäyttö)
4. Suvereeni ilmastoyhteensopivuusarviointi kaksikäyttötoimialoille
5. Kriittisten toimitusketjujen monitorointi (Critical Raw Materials Act, EU Chips Act)

Tämä korjaus osoittaa Sääntö 12:n insinöörikurin ("Fail loud") soveltamisen tuotemarkkinointiin.

#### 10.24.6 Toteutusnäyttö — lifetime.fi-sivuston käyttöönotto

Kolmen pilarin konsultointimalli otettiin käyttöön lifetime.fi-tuotantosivustolla, korvaten edellisen geneerisen konsultointipalveluosion. Toteutus käyttää olemassa olevaa `.industry-agent-chip`-CSS-komponenttikirjastoa renderöimään 10 ontologialuokkaa interaktiivisina chippeinä, kolmella alustakortilla (kulta/vihreä/sininen yläreuna) esittäen kunkin pilarin. Käyttöönotto peilattiin kaksoiskansioon (lifetime.fi/ → landing-pages/lifetime-fi/) DWS-toimintastandardin mukaisesti.

#### 10.24.7 Tutkimuspanos

**Avainpanos #39 — Kyvykkyysontologia ja kolmen pilarin konsultointimalli:** 10-luokkainen LWM-johdettu ontologia järjestää yli 80 agenttikyvykkyyttä tietograafirakenteeseen, joka on samanaikaisesti tuotetaksonomia, GTM-katalogi ja Havaintopääoman skeema. Kolmen pilarin toimitusmalli (kouluta → kehitä → suojaa) kartoittuu 4P-pääoman kertymispolulle (Ihmiset → Prompt+Havainto → Laitos), tarjoten ensimmäisen toteutustason vastauksen siihen, miten agenttisen alustan konsultointivarsi tulisi rakentaa säänneltyjen toimialojen asiakkaille. "Kyvykkyys-ei-rooli"-kehystys ratkaisee poliittisen jännitteen agenttikyvykkyyksien markkinoinnin ja yrityksen henkilöstöherkkyyksien välillä. Liiteartefakti: `docs/KONSULTOINNIN_KASIKIRJA_2026.md` v1.5 (Konsultin käsikirja 2026, kaksikielinen FI/EN).

---

**Dokumentin tiedot:**

**Otsikko:** Firehorse-tuotevalmistuksen toimintamalli: Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille
**Tekijä:** Risto Anton Päärni
**Oppilaitos:** Metropolia Ammattikorkeakoulu
**Koulutusohjelma:** Smart Factory, YAMK
**Ohjaaja:** Jarno Varteva (mukana Erkki Räsänen)
**Yritys:** Lifetime Oy (Firehorse-brändi)
**Tila:** DRAFT - V3.72 — Kyvykkyysontologia ja kolmen pilarin konsultointimalli; Konsultin käsikirja 2026 liiteartefaktina
**Versio:** 3.72
**Viimeisin päivitys:** 28.06.2026
**V1.0 Julkaisutavoite:** 23. helmikuuta 2026

**Kielet:** English, Suomi
**Liittyvät dokumentit:**

- [English Version](../en/V3Thesis_EN.md)
- [Agent Signal Instructions](../../../.workflows/agents/AGENT_SIGNAL_INSTRUCTIONS.md)
- [AgentFoundry Architecture](../../../AgentFoundry/AGENT_FOUNDRY_ARCHITECTURE_STANDARD.md)
- [LWM-koulutusmanuaali](../../../product-catalog/LWM/training-manual.md)
- [Järjestelmänvalvojan käsikirja](../../../Admin/ADMIN_MANUAL.md)

**Keskeiset kontribuutiot:**

1. Lifetime Scope Signals -protokolla — Uusi moniagenttikoordinointiviitekehys
2. Solution Factory -malli — Toistettava teollisen AI-alustan pohja
3. AI-avusteinen kehitys — Cursor Pro ja Claude Code Max mahdollistavat nopean 15 viikon MVP:n
4. Vaiheittainen käyttöönottokehys — Luottamuksen rakentaminen AI:lle säännellyillä toimialoilla
5. DWS10.com-verkkokauppavalidointi — Google Merchant Center + Revolut Business
6. HIL-oppimisputki — Päivittäinen ihminen-tekoäly-palautesilmukka
7. Automatisoitu PR-tyonkulku — Kaksoismallin AI-katselmointi korvaa manuaalisen koodikatselmoinnin
8. DWS7 agenttimoderinsointi — Agenttisilmukat, työkalujen käyttö, MCP-palvelin, Build for Agents -periaate
9. OpenSandbox-reunaintegraatio — Stage 1.5 agentin hiekkalaatikko Acer Veriton GN100 -laitteella; EMPO² agenttimuistin yhdenmukaisuus (arXiv:2602.23008)
10. Toimitusjohtajan automaatioagenttiryhmä — Captain Briefing, LinkedIn Scheduler, EU Regulation Monitor; validoi Solution Factory -toistettavuuden liikevaihtokriittisille työnkuluille
11. Monituottajakumppaniekosysteemi — NVIDIA, Siemens, ABB, xAI, Mistral; monituottaja-LLM-reititin ratkaisee EU AI Act -suvereniteettijännitteen käytännössä
12. Climate IQ Pantheon — 13-agenttinen kreikkalais-roomalainen jumaljärjestelmä (6 orkestraattoria + 7 toimialaerityistä) SOUL.md-identiteettimallilla, prompt injection -turvallisuudella, EU AI Act artikla 12 -lokituksella ja markkinointikiilapersoona-strategialla
13. Learn Thinking — Oppimisajattelukehys: opinnäytetyö elävänä dokumenttina, päivittäinen Learn/-kansion reflektiosilmukka, Build-Measure-Learn-syklin laajennus tekoälyavusteiseen tuotekehitykseen
14. MCP Hub -orkestrointi + kolmen rajapinnan sääntö — Neljä tuotantotyönkulkumallia (Fan-Out, Sequential, Reflection, Pipeline) dokumentoiduilla päätepisteillä; skillit/CLI pakollisina agenttirajapintoina varmistaen, että jokainen agentti on käytettävissä ihmisille, tekoälyjärjestelmille ja kehitystyönkuluille
15. Asiakaskeskeiset MVP-ominaisuudet — Kolme tuotanto-ominaisuutta, jotka siirtävät DWS IQ:n kehittäjätyökaluista asiakasvalmiiksi SaaS-alustaksi: (a) Itsepalvelu-API-avainten hallinta SHA-256-tiivistyksellä ja oikeuspohjaisella pääsynhallinnalla, (b) Käyttömittarointi 3-tasoisella laskutuksen valvonnalla (Free/Pro/Enterprise) ja kojelaudan edistymispalkeilla, (c) Vaatimustenmukaisuusraporttien vienti CSV/JSON-latauksella ja toistuvan aikataulun tuella. Validoi Solution Factory -tuotteistamishypoteesin — alusta on markkinavalmis säännellyille EU-toimialoille
16. Agenttijärjestelmän koventaminen — Tuotantoluotettavuuden palautus: 6 TypeScript-kääntövirhettä korjattu 5 alijärjestelmässä, SandboxContext-tyyppilinjaus, MCP/HIL-reittien kytkentä, lokaalivarma numeromuotoilu, riippuvuushygienia; osoittaa integraatiovelkamallit moniagenttijärjestelmissä
17. PostgreSQL-sarakemuotoinen HTAP-arkkitehtuuri — Yksitietokantainen HTAP pg_duckdb + TimescaleDB:llä Aiven EU:ssa; DWS-tietostandardin luominen tallennusmoottoreiden, laajennusrekisterin, säilytyspolitiikkojen ja EU-sääntelynmukaisuuden (GDPR, EU AI Act Art 12, NIS2, CSRD, EU Data Act) hallintaan; 4-vaiheinen käyttöönotto tauluosioinista lakehouse-integraatioon
18. Kaksitasoinen HTAP-arkkitehtuuri — Aiven-first mandaatti lukitsee TimescaleDB 2.25.x Hypercore hyväksytyksi tuotantostandardiksi; pg_duckdb rajoitettu reunalaitteelle Aiven-sallittujen listan vuoksi; GN100-reunatietokanta käyttöönotettu täydellä laajennuspaketilla
19. Harness Engineering — OpenAI:n 8 harness engineering -periaatteen analyysi DWS IQ 6 -arkkitehtuuria vasten; empiirinen löydös: pelkkä harness-parannus tuottaa 52,8%→66,5% tulosparannuksen (malli muuttumaton); DWS:n L0-L6 kuusikerroksinen arkkitehtuuri formaalina harness-kehyksenä; EU-regulaatio vaatii perustavanlaatuisesti erilaisen harnessin (jäljitettävyys + ihminen silmukassa vs Silicon Valleyn nopeusoptimointi)
20. Hiilitase — Johtopäätös: EU:n ilmastovaatimustenmukaisuus (ETS, CBAM, CSRD, taksonomia) on rakenteellisesti isomorfinen kirjanpidon kanssa; kahdenkertainen kirjanpito CO2:lle kaksoisyksikkökirjauksilla (EUR + tCO2e); poikkisääntelyinen täsmäytys jaettujen kirjanpitokirjausten kautta; poikkitoimialainen älykkyys -teesi (monitoimialainen kirjanpito tuottaa emergenttia dataa jota yksitoimialainen työkalu ei voi replikoida); DWS 7 Phase 2.6 toteutussuunnitelma (8 PR:ää, pysyvä kirjanpito, talousjohtajan kojelauta, ERP-pääkirjan synkronointi, XBRL-vienti)
21. LWM-sekvensointistrategia — Kolmivaiheinen sekvensointi (vaatimustenmukaisuus→laivasto→Series A) sijoittajanarratiivien ristiriitojen ratkaisemiseksi; LeWorldModel (arXiv:2603.19312) JEPA-maailmamallien ulkoinen validointi; vaiheen 2 teknisen aukon analyysi (syötemodaali, skaala, sääntely-fyysinen integraatio); vaatimustenmukaisuus ensin -maailmamalliteesi; Persefoni/Sweep-markkinavertailut
22. Toimialakohtainen vs geneerinen AI-harness — Kilpailija-analyysi everything-claude-code-kehystä (120k tähteä, 136 taitoa) vastaan; kuusi kilpailuetua dokumentoitu (toimialaspesifisyys, kuusikerroksinen arkkitehtuuri, kovat portit, luottamusvyöhykkeet, gstack-työnkulku, agentti-ensin -tuotesääntö); token-budjettianalyysi osoittaa syvyyden ylittävän laajuuden säännellyillä toimialoilla; taitoinventaarion kasvu 6:sta 21:een tuotantotaitoon 4:llä estävällä kurinpitoportilla; validoi harness engineering -teesin (osio 10.16)
23. Opinnäytetyön versiointistrategia — Kaksoisversioarkkitehtuuri: v3.30.50 jäädytetty 50-sivuinen Metropolia-palautusversio + 82-sivuinen elävä dokumentti jatkuu; osoittaa käytännön ratkaisun tekoälyavusteiseen akateemiseen kirjoittamiseen, jossa tutkimuksen nopeus ylittää palautusformaatin rajoitukset; säilyttää täydellisen tutkimuslinjan täyttäen samalla oppilaitoksen vaatimukset
24. Skills-paradigma toimialakonsensuksena validoitu — Anthropicin 16.4.2026 essee "Stop Building Agents, Start Building Skills" validoi ulkoisesti taito-ensin -arkkitehtuurin (§10.13) ja toimialakohtaisen-yli-geneerisen harness-argumentin (§10.13.7); 24+ tuotantotaitoa 4 kurinpitoportilla edustavat nyt toimialakonsensusta eikä DWS-spesifistä vetoa
25. Lifetime Fleet -kiteytyminen — Brain-Memory-Body-Hands -pino on testattavissa päästä päähän: Suomen dronestrategia 2030 -kohdistus + Baltia-ensin 12–16 viikon MVP siirtävät "Kädet"-kerroksen spesifikaatiosta konkreettiseksi laitteistoaikatauluksi KYA/Aegis/Firehorse-hallinnan täydellä uudelleenkäytöllä; vaatimustenmukaisuus-ensin -maailmamalliteesi (§10.18) muuttuu lähitulevaisuuden insinöörivirstanpylvääksi
26. 22. toimiala vihreän vedyn lisäisyyden kautta — DWS IQ 7 Datakeskusten vaatimustenmukaisuusagentti soveltaa RFNBO-delegoitua asetusta 2023/1184 (lisäisyys, ajallinen korrelaatio, maantieteellinen korrelaatio) suomalaisiin datakeskuksiin; laajentaa kaksinkertaisen hiilikirjanpidon (§10.17) data-intensiivisiin palveluihin ja lisää NIS2 + CER -kattavuuden ilmastosääntelyn rinnalle — alustan sääntelyalueen ensimmäinen poikkialueellinen laajennus
27. Perustajan→tiimin siirtymä alustan ominaisuutena — SOLO_FOUNDER_STATEMENT v1.2 + Anthony Maurin CTO-yhteisrakentajasekvensointi + `/investor-outreach` -taito (10+ INTRO-muistiota luonnosteltu) tekevät sijoittajayhteydenpidosta toistettavan DWS IQ -työnkulun hiljaisen perustajatiedon sijaan; validoi alustan oman ratkaisutehdas-väitteen
28. KYA Agentic AI Foundation -kohdennus ja dual-use-laajennus — KYA nostettu yleiseksi agenttien perusstandardiehdokkaaksi; DWS 7 asetettu empiiriseksi rungoksi, jossa vetytalousjatkumo (DWS 5 -> DWS 7), suvereniteettisegmentointi (Aegis/Sovereign Infra/Connect), Nokia Defence -keskustelupolku sekä Siemens- ja NVIDIA Connect -yhteistyö ankkuroidaan yhdeksi tutkimusohjelmaksi
29. KYA open source -standardipolku ja Artikkeli 1:n täsmennys — tutkimukseen lisätty eksplisiittinen standardointikanava Agentic AI Foundation / Linux Foundation -reitille, NIST-polun tila kirjattu (ei lähetetty), sekä 2026-2029 julkaisuvaiheistus ja EIC Step 1 -deliverablejen rooli tutkimusviestinnässä
30. Kolmitasoinen Skilled-taksonomia — brändi / spesifikaatio / käyttöliittymä -taksonomia (Skilled / Industrial Specialist / Industry) suunnittelumallina EU-säännellyille agenttialustoille; monotoninen `Skilled <Akseli>` -malli agenteille, työnkuluille ja jurisdiktioille
31. Kolmen pääoman kertymismalli — toteutusnäyttö 7 kuukauden HIL-vaiheesta: token-pääoma (30+ taitoa, 150+ kenttämuistiota, 50 agenttia), inhimillinen pääoma (hahmontunnistus, kalibrointi), Control Room -pääoma (kynnykset, artikla 12 -auditointipolku); määrittelee HIL → HIC -siirtymän
32. Neljän pääoman (4P) arkkitehtuurikartoitus — Prompt, Ihmiset, Laitos, Havainto kartoitettuna DWS IQ 6:n Aivot-Muisti-Keho-Kädet-arkkitehtuuriin; GTM-laajentumismalli Havaintopääoman kertymisestä
33. Kyvykkyysontologia ja kolmen pilarin konsultointimalli — 10 LWM-tietograafiluokkaa, jotka järjestävät yli 80 agenttikyvykkyyttä; kolmen pilarin toimitusmalli (kouluta → kehitä → suojaa), joka kartoittuu 4P-pääomapolulle; "kyvykkyys-ei-rooli"-kehystys B2B-agenttialustoille; liiteartefakti: `docs/KONSULTOINNIN_KASIKIRJA_2026.md` v1.5

**Lisenssi:** Proprietary - Lifetime Oy
**Yhteystieto:** risto@lifetime.fi

---

## Bibliografia (Oxford notes-bibliography -tyyli) — v3.61

Lisätty v3.61:ssä (28.05.2026) luetteloimaan tämän maisterityön luvuissa siteeratut kanoniset lähteet. Lainaustyyli on Oxford notes-bibliography: jokainen alaviite `[^N]` merkitsee yhtä lähdettä; sitä seuraava luku-indeksi osoittaa, mikä luku tukeutuu mihinkin alaviitteeseen. Luvut, joita ei mainita indeksissä, eivät siteeraa näitä lähteitä.

### Lukukohtainen viite-indeksi

> **Tässä luvussa viitatut lähteet.** Luvut, jotka tukeutuvat yhteen tai useampaan alla olevista alaviitteistä, on lueteltu täällä, jotta lukija voi ratkaista jokaisen tekstinsisäisen viitteen ilman koko dokumentin selausta.

| Luku                                                                       | Siteerattu alaviite                          |
| -------------------------------------------------------------------------- | -------------------------------------------- |
| Suvereniteettisegmentoinnin keskustelu (Aegis / Sovereign Infra / Connect) | [^1], [^4], [^5], [^12], [^13], [^14], [^16] |
| KYA-kumppaniekosysteemi (vrt. Liite H) ja luottamuspino-luku               | [^2], [^8]                                   |
| Pilotti- ja tapaustutkimusluku (Outokumpu Tier-1)                          | [^7]                                         |
| Toimialakohtainen vaatimustenmukaisuusluku (rakentaminen, monijurisdiktio) | [^9]                                         |
| Kumppanuusluku (xAI ym.)                                                   | [^10], [^11]                                 |
| Kvantti- ja kryptografialuku                                               | [^16], [^17], [^18], [^19]                   |
| Sääntelyluku (EU AI Act, eIDAS 2.0, EU Data Act)                           | [^20], [^21], [^22]                          |

### Alaviite-bibliografia

[^1]: Päärni, R. A. (2026). _PHD_FIREHORSE_FI.md §14.23 — Kolmen pilarin suvereniteettitaksonomia ja jurisdiktiokohtainen dynaamisuus globaaleissa yrityksissä._ Lifetime Oy / LUT-yliopisto. Paikallinen polku: `docs/PHD_FIREHORSE_FI.md`. Käyty 28.5.2026.

[^2]: Päärni, R. A. (2026). _PHD_FIREHORSE_FI.md §14.21 — KYA Substraatin eheyden konformanssi (SIB-rata)._ Lifetime Oy / LUT-yliopisto. Paikallinen polku: `docs/PHD_FIREHORSE_FI.md`. Käyty 28.5.2026.

[^3]: Päärni, R. A. (2026). _PHD_FIREHORSE_FI.md §14.22 — Malli-toimittajaan kohdistettu palvelutaso ja suvereeni-tulosperusteinen vastapositio._ Lifetime Oy / LUT-yliopisto. Paikallinen polku: `docs/PHD_FIREHORSE_FI.md`. Käyty 28.5.2026.

[^4]: Päärni, R. A. (2026). _Kenttämuistio: EU-teknologiapinon suvereniteettiasemointi (Kenttämuistio #1)._ Lifetime Oy. Paikallinen polku: `docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md`. Päivätty 28.1.2026.

[^5]: Päärni, R. A. (2026). _Suvereniteetin kenttämuistio #2 — Digitaalisen suvereniteetin kolme tasoa._ Lifetime Oy. Paikallinen polku: `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md`. Julkaistu HTML: <https://onelifetime.world/posts/sovereignty-field-note-2-three-pillars.fi.html>. Päivätty 28.5.2026.

[^6]: Päärni, R. A. (2026). _Kenttämuistio: Suvereenit pilvitoimittajat — Aegis-kumppanitutkimus._ Lifetime Oy. Paikallinen polku: `docs/field-notes/2026-04-23-sovereign-cloud-providers-aegis-partner-research.md`. Päivätty 23.4.2026.

[^7]: Päärni, R. A. (2026). _Kenttämuistio: Tier-1-suvereniteettipilotti Outokumpulle — robotiikkapinon tiedustelu + DGX / Jetson T5000 -suvereniteettiarvio._ Lifetime Oy. Paikallinen polku: `docs/field-notes/2026-05-25-tier1-sovereignty-pilot-outokumpu-dgx-t5000.md`. Päivätty 25.5.2026.

[^8]: Päärni, R. A. (2026). _Shufti KYA -whitepaper — IDV-tarjoajan sertifiointi KYA-standardin alla._ Lifetime Oy. Paikallinen polku: `docs/field-notes/2026-03-17-shufti-kya-whitepaper.md`. Versio 2.0, päivätty 13.4.2026.

[^9]: Päärni, R. A. (2026). _Rakentamisen vaatimustenmukaisuus monijurisdiktiossa — brief._ Lifetime Oy. Paikallinen polku: `docs/briefs/construction-compliance-brief.md`. Päivätty 22.5.2026.

[^10]: Päärni, R. A. (2026). _xAI Grok -kumppanuusehdotus v1.0._ Lifetime Oy. Paikallinen polku: `docs/2026-02-26-xai-grok-partnership-proposal.md`. Päivätty 26.2.2026.

[^11]: Päärni, R. A. (2026). _xAI Optimus -kumppanuusehdotus v2.0._ Lifetime Oy. Paikallinen polku: `docs/sales/xAI-Optimus-Partnership-Proposal-v2.0.md`. Päivätty 22.5.2026.

[^12]: Lifetime Oy. (2026). _DWS_DEPLOYMENT_STANDARD.md rivit 165–172 — DWS IQ Connect / Sovereign Infra / Aegis -tuotetasojen määritelmät._ Sisäinen kanoninen standardi. Paikallinen polku: `DWS_DEPLOYMENT_STANDARD.md`. Käyty 28.5.2026.

[^13]: Lifetime Oy. (2026). _DWS_SOVEREIGNTY_STANDARD.md v1.2 — CLOUD Act / FISA 702 / Schrems II -kehys._ Sisäinen kanoninen standardi. Paikallinen polku: `DWS_SOVEREIGNTY_STANDARD.md`. Käyty 28.5.2026.

[^14]: Lifetime Oy. (2026). _DWS_STANDARDS_LIBRARY.md §3.6 — Suvereniteettitasokartta (toimittajaluokitus T1/T2/T3)._ Sisäinen kanoninen standardi. Paikallinen polku: `DWS_STANDARDS_LIBRARY.md`. Käyty 28.5.2026.

[^15]: Lifetime Oy. (2026). _DWS_TRUTH_STANDARD.md — Kanonisten faktojen rekisteri._ Sisäinen kanoninen standardi. Paikallinen polku: `DWS_TRUTH_STANDARD.md`. Käyty 28.5.2026.

[^16]: Rightful Oy. (2026). _R-Sac² — Road to Post-Quantum Security._ Kumppaniartefakti vastaanotettu 28.5.2026 (infografiikka) ja kuvattu osoitteessa <https://www.rightful.fi/>. Viisivaiheinen menetelmä: Tunnista → Arvioi → Suunnittele → Toteuta → Seuraa. Käyty 28.5.2026.

[^17]: National Institute of Standards and Technology (NIST). (2024). _FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism (ML-KEM, Kyber)._ U.S. Department of Commerce. <https://csrc.nist.gov/pubs/fips/203/final>.

[^18]: National Institute of Standards and Technology (NIST). (2024). _FIPS 204 — Module-Lattice-Based Digital Signature (ML-DSA, Dilithium)._ U.S. Department of Commerce. <https://csrc.nist.gov/pubs/fips/204/final>.

[^19]: National Institute of Standards and Technology (NIST). (2024). _FIPS 205 — Stateless Hash-Based Digital Signature (SLH-DSA, SPHINCS+)._ U.S. Department of Commerce. <https://csrc.nist.gov/pubs/fips/205/final>.

[^20]: Euroopan parlamentti ja neuvosto. (2024). _Asetus (EU) 2024/1689, 13. kesäkuuta 2024, jolla vahvistetaan yhdenmukaiset säännöt tekoälystä (EU:n tekoälysäädös)._ Artiklat 9, 12, 13, 14 siteerattu.

[^21]: Euroopan parlamentti ja neuvosto. (2024). _Asetus (EU) 2024/1183, jolla muutetaan asetusta (EU) N:o 910/2014 EU:n digitaalisen identiteetin kehystä koskien (eIDAS 2.0)._

[^22]: Euroopan parlamentti ja neuvosto. (2023). _Asetus (EU) 2023/2854 yhdenmukaisista säännöistä datan oikeudenmukaista saatavuutta ja käyttöä koskien (EU Data Act)._

### 10.25 Monikielinen havainnointi tuotannossa: Aspire Dashboardin käyttöönotto ja hiljaisen telemetrian häiriö

#### 10.25.1 Konteksti ja päätöspolku

Huhtikuun 2026 työkaluanalyysi (`docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md`) arvioi kolme käyttöönottovaihtoehtoa Microsoftin Aspire-havainnointipinolle DGX Spark -suvereenilla reunalaitteella: (1) vain dashboard — itsenäinen Aspire Dashboard -kontti kieliriippumattomana OTLP-vastaanottimena; (2) täysi AppHost + ServiceDefaults -orkestrointi; (3) lykkäys. Vaihtoehto 1 valittiin ja otettiin käyttöön: `mcr.microsoft.com/dotnet/aspire-dashboard:13.3.5` (versiokiinnitetty, ei koskaan `:latest`) tiedostossa `infrastructure/dgx-spark/docker-compose.yml`. Ratkaisevat tekijät olivat, että dashboard vastaanottaa standardia OTLP-telemetriaa mistä tahansa kielestä — DWS IQ 6 -pino on TypeScript (backend, agentit) ja Python (Firehorse) — ja että vain-dashboard-käyttöönotto ei vaadi .NET-työkaluketjua reunalaitteelle.

#### 10.25.2 Toteutusinventaario

Käyttöönotettu havainnointikerros koostuu seuraavista:

- **`src/observability/otel.ts`** — vapaaehtoinen (opt-in) OpenTelemetry SDK -alustus. Jos `OTEL_EXPORTER_OTLP_ENDPOINT` ei ole asetettu, provideria ei rekisteröidä ja jokainen jäljitysapuri palautuu no-op-tilaan; mitään ei lähde isäntäkoneelta ennen kuin operaattori asettaa päätepisteen (suvereniteetti oletuksena). Hallittu tyhjennys SIGTERM/SIGINT-signaaleilla.
- **`src/observability/tracing.ts`** — span-apurit neljässä jälkianalyysin kannalta olennaisessa pisteessä: `withAgentSpan` (yksi juurispan per agenttisuoritus), `withWorkflowSpan`/`withWorkflowStepSpan`, `withLLMSpan` (per LLM-kutsu, tuottaen OpenTelemetryn **GenAI-semanttisten konventioiden** attribuutit: `gen_ai.system`, `gen_ai.request.model`, `gen_ai.usage.input_tokens`/`output_tokens`, lopetussyyt) ja `withToolSpan` (per työkalukutsu, ketjuposition/-pituuden kera).
- **`src/agents/telemetry.types.ts` + migraatio `066_tool_telemetry_genai.sql`** — sama `gen_ai.*`-sanasto pysyväistallennettuna Supabasen `tool_telemetry`-tauluun, ristiviitattuna OTel-jälkiin `trace_id`/`span_id`-kentillä. Näin EU:n tekoälysäädöksen artiklan 12 auditointipolku ja kehittäjän jäljityskäyttöliittymä jakavat yhden sanaston kahden erillisen lokitusjärjestelmän sijaan.
- **Kolme OTLP-tuottajaa** DGX Sparkin compose-verkossa: `dws-backend`, `dws-cron` ja `bumblebee-collector`-toimitusketjuskanneri.

#### 10.25.3 Hiljaisen telemetrian häiriö (heinäkuu 2026)

Ensisijaislähteen varmennus Aspire-dashboardin konfiguraatioreferenssiä vasten (aspire.dev, haettu 07.07.2026) vahvisti, että itsenäinen dashboard tarjoaa kolme erillistä päätepistettä: selainkäyttöliittymä portissa 18888, OTLP/gRPC portissa 18889 ja OTLP/HTTP portissa 18890. Kaikki kolme DWS-tuottajaa oli konfiguroitu työntämään `http/protobuf`-telemetriaa **porttiin 18888 — käyttöliittymäpäätepisteeseen**. Jokainen käyttöönoton jälkeen tuotettu span, metriikka ja loki oli pudotettu hiljaisesti.

Muutoshistoria tekee häiriöstä opettavaisen. Virhekonfiguraatio syntyi _korjauksesta_: compose v1.2.0 oli "korjannut" OTel-kytkennän siirtämällä päätepisteen portista 18889 (gRPC-portti — väärä protokolla HTTP-viejälle) porttiin 18888 (oikea protokolla, väärä päätepiste). Molemmat konfiguraatiot läpäisevät kaikki elossaolotarkistukset: portit hyväksyvät TCP-yhteydet, kontti raportoi terveeksi, heartbeat-palvelun `CHECK_ASPIRE`-luotain onnistuu. OTel:n `BatchSpanProcessor` nielaisee vientivirheet suunnitellusti, joten mikään loki ei näyttänyt virhettä. Järjestelmä näytti täysin instrumentoidulta ja oli täysin sokea. Korjaus toimitettiin compose-versiona v1.3.1 (kaikki kolme tuottajaa → 18890).

#### 10.25.4 Insinöörityön opit

1. **Varmennuksen on katettava havaittu käyttäytyminen, ei vain artefaktin olemassaolo.** Huhtikuun kenttämuistion aukontunnistussääntö — "kun narratiivikerros mainitsee versionumeron, varmenna se todellista käyttöönotettua artefaktia vasten" — osoittautui riittämättömäksi. Tässä artefakti oli olemassa ja narratiivi oli jäänyt jälkeen _pessimistiseen_ suuntaan (myöhemmät dokumentit kuvasivat dashboardia yhä "ei käyttöönotetuksi"), kun taas käyttöönotettu artefakti oli itse rikki. Vahvistettu sääntö: varmenna käyttöönotettua artefaktia _ja sen havaittua käyttäytymistä_ vasten. Dashboard, joka ei vastaanota telemetriaa, on erottamaton dashboardista, jota kukaan ei kytkenyt.
2. **Hiljaa vikaantuvat alijärjestelmät äänekkäästi vikaantuvassa arkkitehtuurissa vaativat kompensoivia kontrolleja.** Insinöörikurin sääntö 12 ("fail loud") on toteutettu DWS-agenttikerroksessa, mutta OTel-vientiliukuhihna on ylävirran suunnittelultaan hiljaa vikaantuva. Kompensoiva kontrolli on päästä päähän -väittämä — jaksollinen tarkistus siitä, että jäljet _saapuvat_, ei vain siitä, että vastaanottava portti on auki. Tämä on jonossa heartbeat-laajennuksena.
3. **Viereisporttien virhekonfiguraatio on oma vikaluokkansa.** Kolme toiminnallisesti eri päätepistettä peräkkäisissä porteissa (18888/18889/18890), kaikki hyväksyvät yhteydet, muuntaa yhden merkin konfiguraatiovirheen hiljaiseksi datahäviötapahtumaksi. Infrastruktuurikommentit dokumentoivat nyt kaikki kolme porttia palvelumäärittelyn kohdalla.

#### 10.25.5 Avoin päätös: GenAI-viestisisällön tallennus

Dashboardin GenAI-visualisoija (esitelty Aspire 9.5:ssä, parannettu 13.2:ssa) esittää LLM-spanit keskustelulokina — järjestelmäkehote, viestit, työkalukutsut, token-määrät — kun viestisisältö tallennetaan spaneihin. DWS:n `withLLMSpan`-apuri tallentaa tarkoituksella **vain metadatan** (mallitunnisteet, token-määrät, lopetussyyt), ei kehote- tai vastaussisältöjä. Sisällöntallennuksen käyttöönotto veisi asiakasperäistä tekstiä dashboardin muistiin; se on tietosuojapäätös (GDPR-soveltamisala, asiakasluottamuksellisuus), ei työkalupäätös, ja se säilyy ihmisoperaattorilla. Oletus: pois päältä.

_Rinnakkaisartefaktit: `docs/field-notes/2026-07-07-aspire-development-evolution-pr1500-to-main.md` (v1.1), `docs/field-notes/2026-04-10-aspire-13-2-isolated-mode.md`, `docs/research/2026-04-08-aspire-observability-vs-dotnet-skills.md`. Markkinasignaali- ja standardointikehystys: PHD_FIREHORSE §14.37 opinnäytteiden sisältöjaon säännön mukaisesti._

#### 10.25.6 Täydennys (v3.79): Spaniin leimattu valtuutusverdikti

Ulkoinen kritiikki (Hakimi, 07.07.2026) tunnisti tämän luvun alkuperäisen version rakenteellisen rajan: _"jokainen LLM-kutsu, jonka se valaisee, on tallenne siitä mikä jo laukesi. Jälki näyttää, että agentti pääsi tuotantoon. Se ei koskaan näytä, olisiko sen pitänyt pystyä siihen."_ Koodia vasten varmennettuna kritiikki oli täsmällinen — LLM-asiakkaan ainoa valtuutuskäsite oli palveluntarjoajan `Bearer`-otsake, ja KYA-luottamuspisteytyksen valvonta eli yksinomaan hiekkalaatikkorajalla (`nemoclaw-sandbox.ts`, `nemoclaw-bridge.ts`), telemetriasta irrallisella koodipolulla.

Samana päivänä toteutettu vastaus laajentaa span-sanastoa rinnakkaisjärjestelmän lisäämisen sijaan: `withAgentSpan` ja `withLLMSpan` hyväksyvät nyt `KYAVerdict`-arvon (`decision`, `trustScore`, `policyVersion`, `gate`) ja leimaavat attribuutit `dws.kya.verdict` / `dws.kya.trust_score` / `dws.kya.policy_version` / `dws.kya.gate` `gen_ai.*`-attribuuttien rinnalle, jolloin yksi jälki vastaa molempiin kysymyksiin — mikä laukesi ja millä valtuudella se sai laueta. Kantava suunnittelupäätös on oletusarvo: span ilman verdiktiä leimataan arvolla `dws.kya.verdict: "ungated"`, ei koskaan jätetä tyhjäksi. Poissaolosta tulee kyseltävä löydös — jäljityskäyttöliittymän suodatus arvolla `ungated` luetteloi jokaisen suorituspolun, jota mikään portti ei hyväksynyt — sen sijaan että se olisi erottamaton portitetusta suorituksesta (insinöörikurin sääntö 12 sovellettuna valtuutuskattavuuteen).

Rehellinen lähtötaso, jonka tämä tekee näkyväksi: versiossa v3.79 jokainen tuotantospan lukee `ungated`, koska mikään kutsukohta ei vielä välitä hiekkalaatikon verdiktiä eteenpäin. Ungated-spanien lukumäärä _on_ valtuutuskattavuuden aukkometriikka; sen ajaminen nollaan (verdiktin tuottaminen hiekkalaatikkoportilla, välitys agenttiajurin ja LLM-asiakkaan läpi) on nimetty jatkotoimi. Yksikkötestit kattavat sekä leimatun verdiktin että ungated-oletuksen polut. _Kenttämuistio: `docs/field-notes/2026-07-07-hakimi-observability-vs-authorization.md`; tieteellinen uudelleenmuotoilu: PHD_FIREHORSE §14.37.4._

### 10.26 Verified-Done-attestoinnin allekirjoituspolun kryptografinen katselmointi: kaksi löydöstä ja falsifiointi testien laatuporttina

**Katselmoitu toteutus.** Verified-Done-attestoinnin allekirjoituspolku (KYA §14.7.1) toteutettiin tiedostona `src/identity/attestation-signing.ts`. Se tuottaa EdDSA-irrallisia JWS-todisteita W3C Verifiable Credential -attestointien päälle, mukanaan tallennuskerros, myöntämisen orkestrointi ja todistusketjun kirjoittaja. Testistö sisälsi 47 läpimenevää testiä, puhtaan `tsc --noEmit` -ajon ja puhtaan muotoilun. Tietoinen riippuvuuspäätös kirjataan: **Ed25519 Noden sisäänrakennetun `node:crypto`-moduulin kautta `jose`-kirjaston sijaan**, perusteluna se, että tuote, jonka arvolupaus on kapea luotettu laskentaperusta, ei saisi laajentaa tuota perustaa kolmannen osapuolen paketilla allekirjoittaakseen omat suvereniteettiväitteensä.

**Löydös F1 (KORKEA) — allekirjoitus ei kattanut todisteen metatietoja.** Allekirjoitettavat tavut muodostava funktio poisti koko `proof`-lohkon ennen allekirjoittamista. Näin ollen kenttiä `proof.created`, `proof.verificationMethod`, `proof.proofPurpose` ja `proof.type` saattoi kutakin muokata allekirjoittamisen jälkeen, ja todistus varmentui silti. Tästä seuraa suoraan kaksi asiaa:

1. **EU:n tekoälyasetuksen 12 artiklan mukaisen todisteartefaktin aikaleima oli suojaamaton.** Todistusaineisto, jonka päiväystä voi muuttaa havaitsematta, ei toimi todistusaineistona.
2. **Luottamusankkurin valinta allekirjoittamattomasta datasta.** Suunnittelu määrittää myöntäjän avaimen ratkaisemisen `did:web`-varmennusmenetelmästä. Tuota vuota toteuttava varmentaja lukisi kentän `proof.verificationMethod` — allekirjoittamattoman, muokattavan kentän — päättääkseen, mihin avaimeen luottaa. Allekirjoitettu `issuer`-kenttä tarjoaa suojan, mutta koodi tai sen dokumentaatio ei edellyttänyt näiden sitomista toisiinsa.

**Juurisyy testisuunnittelussa, ei kryptografisessa osaamisessa.** Kahdeksan olemassa olevaa allekirjoitustestiä sisälsivät peukalointitapauksen — mutta se peukaloi todistuksen *kohdetta*, joka on allekirjoitetun hyötykuorman sisällä ja siten oikein hylättiin. Yksikään testi ei peukaloinut *todistelohkoa*, koska sellainen testi olisi läpäissyt varmennuksen ja kaatunut omaan väitteeseensä. Testistö oli hyvin rakennettu niiden ominaisuuksien osalta, joita se testasi, ja rakenteellisesti sokea kyseiselle virheelle.

**Korjaus.** Todisteen metatiedot — kaikki todistekentät paitsi `proofValue` — sidotaan nyt kanoniseen allekirjoitettavaan hyötykuormaan sekä allekirjoitus- että varmennuspolulla, noudattaen W3C Data Integrity -mallia, jossa todisteen metatiedot kanonisoidaan yhdessä dokumentin kanssa. Mikä tahansa allekirjoituksen jälkeinen todisteen metatiedon muutos muuttaa nyt hyötykuormaa ja kaataa allekirjoituksen.

**Löydös F3 (KESKITASO) — avaintyypin tarkistus.** Ympäristölataaja hyväksyi minkä tahansa yksityisen avaimen PEM-muodossa; muu kuin Ed25519-avain latautui onnistuneesti ja kaatui vasta allekirjoituskutsun sisällä epäselvään virheeseen, vaikka JOSE-otsake oli jo väittänyt `alg: 'EdDSA'`. Lataaja tarkistaa nyt ehdon `asymmetricKeyType === 'ed25519'` ja heittää poikkeuksen. Epäsymmetria on tietoinen ja noudattaa äänekkään epäonnistumisen periaatetta: **konfiguroimaton** allekirjoittaja palauttaa `null`, jolloin allekirjoittamaton polku pysyy pätevänä, kun taas **virheellisesti konfiguroitu** allekirjoittaja nostaa poikkeuksen. Konfiguraation puuttuminen on tila; konfiguraatiovirhe on vika.

**Metodologinen kontribuutio — falsifiointi testien laatuporttina.** Korjauksen mukana lisättyjä neljää regressiotestiä ei hyväksytty sillä perusteella, että ne menivät läpi. Korjattu lähdekoodi palautettiin ennalleen, testistö ajettiin uudelleen, ja neljän uuden testin **varmistettiin kaatuvan alkuperäistä virheellistä toteutusta vasten** ennen hyväksymistä; kahdeksan aiempaa allekirjoitustestiä menivät läpi *molemmissa* tiloissa. Tästä syntyy yleistettävä tekninen kriteeri: **testi, joka menee läpi sekä ennen korjausta että sen jälkeen, ei kanna informaatiota kyseisestä korjauksesta.** Porttina sovellettuna se erottaa regressiotestit koristeellisista, ja tässä tapauksessa se tuotti empiirisen selityksen sille, miksi pätevä 47 testin testistö ei havainnut vakavaa puutetta. Lopputila: 51 läpimenevää testiä, tyyppitarkistus ja muotoilu puhtaina.

**Liittyvä toteutuslöydös.** Attestoinnin tallennusskeeman katselmointi osoitti, että todistustietue oli ankkuroitu vastuulliseen ihmiseen ilman vuokralaissaraketta, kun taas valtuutusten todistetaulussa organisaatiotunniste oli tyhjäksi sallittu. Siirrettävä tietue, joka muodostaa agentin ansioluettelon, oli siten sidottu yksilöön eikä siihen organisaatioon, jonka valtuutuksella ja datalla se ansaittiin, joten luottamushistoria ei säilyisi henkilöstön lähtiessä. Koska allekirjoittaminen tekee tietueesta pysyvän, ankkurin korjaaminen aikataulutettiin **allekirjoitusten käyttöönoton ennakkoehdoksi** eikä rinnakkaiseksi työksi: väärin ankkuroidun attestoinnin allekirjoittaminen muuntaa korjattavissa olevan skeemavirheen pysyväksi.

### 10.27 Artefakti–legitimiteetti-kuilu: huippumallien nopeus, KYA-tapaus ja siitä johdettu suunnitteluperiaate vaatimustenmukaisuusälyn tuotealustalle

**Ongelma kerran lausuttuna.** Rakentaminen huippumalleilla (frontier models) Claude Coden kautta puristaa teknisesti valmiin artefaktin tuottamisen kuukausista tunteihin. Se ei purista — eikä rakenteellisesti voi puristaa — niitä institutionaalisia prosesseja, jotka tekevät artefaktista *legitiimin*: vastakkainasettelevaa arviointia osapuolilta joilla on kilpailevat kaupalliset intressit, riippumatonta toteutusta, standardointielimen muodollista hyväksyntää ja oikeudellista tarkastusta kullakin toimintalainkäyttöalueella. **Artefakti on valmis kauan ennen kuin se on legitiimi.** Tämä on suurin käytännön ongelma, joka tässä teknisessä ohjelmassa on kohdattu, eikä se ole työkaluvika. Se on seuraus siitä, että työkalut toimivat.

**Toisen asteen vaikutus on vaarallinen.** Historiallisesti spesifikaation *laatu* oli näyttöä sen takana olevasta *prosessista*. RFC 2119 -konformanssikieli, versiohistorialohko, konformanssiosio, IPR-tietoinen lisenssi — kukaan yksilö ei tuottanut näitä yhdessä iltapäivässä, joten niiden läsnäolo merkitsi luotettavasti työryhmää, arviointikierroksia ja kulunutta aikaa. **Huippumallit rikkovat tämän korrelaation.** Sujuvuus ei ole enää näyttöä prosessista. Silti jokainen lukija — ostaja, tarkastaja, valvoja ja laatija itse — käyttää yhä sujuvuutta legitimiteetin korvikemittarina. Mittari on nyt pätemätön, ja sen vikaantuminen on epäsymmetristä: **laatija ylivaatii tahtomattaan**, koska artefakti väittää hiljaisesti alkuperää, jota sen tuottamisella ei koskaan ollut.

#### 10.27.1 KYA-tapaus

Ohjelman oma hallintadokumentti on työstetty esimerkki, ja tapahtumasarja on dokumentoitu, ei jälkikäteen rekonstruoitu.

Spesifikaatio tuotettiin julkaisukelpoiseen laatuun otsikolla **"KYA Open Standard v1.5"**. Arvioituna neljää porttia vastaan — vähintään kaksi riippumatonta toteutusta; konformanssitestistö, jonka toteutus voi reputtaa; tunnustetun elimen hyväksyntä tai aito monen osapuolen käyttöönotto; sekä muutoksenhallinta, joka jää eloon laatineen organisaation jälkeen — se täytti **nolla neljästä**. Se nimettiin uudelleen **"KYA-spesifikaatioksi v1.5"** 24.07.2026, kun kategorinen kysymys esitettiin suoraan: *onko mikään elin käsitellyt tätä?*

Dokumentin teknisessä sisällössä ei ollut mitään väärää. Se oli toteutettavissa, sisäisesti johdonmukainen ja rehellinen yksittäisissä väitteissään. Väärin oli **kategoria**, jota otsikko väitti — ja juuri artefaktin sujuvuus teki tuosta väitteestä uskottavan.

Ratkaiseva havainto seuraa:

> **Sama tekninen kapasiteetti, joka tuotti v1.5:n yhdessä istunnossa, voi tuottaa v1.6:n, v2.0:n ja v3.0:n. Versionumero kiihtyy; legitimiteetti ei liiku lainkaan.** Tekninen iterointi ei voi muuntaa spesifikaatiota standardiksi, koska puuttuva ei ole teknistä.

**Ja kuilu voi leventyä eikä vain pysyä.** Toteamus, että legitimiteetti "ei liiku", aliarvioi riskin. Standardointielimen hyväksymiskriteerit muodostuvat konsensuksessa osapuolten kesken, joilla on toisistaan poikkeavat kaupalliset intressit; yksin laadittu artefakti optimoi sen sijaan sisäistä johdonmukaisuutta, koska se on ainoa rajoite, jonka sen laatija voi tuntea. Jokainen arvioimaton iteraatio parantaa siis dokumenttia väärää tavoitefunktiota vastaan ja voi ajautua *kauemmas* siitä, mitä elin hyväksyisi, samalla kun se jokaisella sisäisesti näkyvällä mittarilla vaikuttaa paranevan. **Arvioimaton iterointi ei vain jätä legitimiteettiä kertymättä; se voi kerryttää yhteensovitusvelkaa.** Teknisesti paras versio ei ole välttämättä lähinnä hyväksyttävyyttä oleva versio, eikä mikään laatineen organisaation sisällä erota näitä kahta.

#### 10.27.2 Kolme lainkäyttöaluetta tekee kuilusta mitattavan

KYA:n laajentaminen EU:hun, Yhdysvaltoihin ja Singaporeen terävöittää asian havainnosta rajoitteeksi. Kukin lainkäyttöalue käy eri, puristamatonta kelloa, eikä yhteen niistä **voi lainkaan päästä laatijan omasta aloitteesta**: EU:n tekoälyasetuksen 40 artiklan mukaan yhdenmukaistetut standardit tuotetaan CEN/CENELECissä komission standardointipyynnön perusteella. Mikään tekninen läpimenoteho ei avaa tuota ovea.

Arkkitehtoninen seuraus — yksi lainkäyttöalueneutraali ydin sekä lainkäyttöaluekohtaiset konformanssi**profiilit**, ei koskaan kolme haarautunutta spesifikaatiota — on dokumentoitu tiedostossa `standards/kya-open/SPEC.md` §10. Episteeminen seuraus on se lause, jonka kirjaamiseksi tämä osio on olemassa:

> **DWS voi teknisesti rakentaa parempia KYA-versioita loputtomiin. Käytännössä ne pysyvät spesifikaatioina — ja kolmen lainkäyttöalueen yli kolmena profiilina yhdestä spesifikaatiosta.** Profiileja ei voi edes validoida ilman lainkäyttöaluekohtaista oikeudellista tarkastusta, joka on toinen prosessi, jota tekninen työ ei voi imeä sisäänsä.

#### 10.27.3 Toteutettu vastatoimi

`DWS_LEARNING_STANDARD.md` on mekanismi, ei politiikkalausuma. Sen §10 tarjoaa sen, mitä kiihdytetyltä tekniseltä prosessilta oletusarvoisesti puuttuu:

| Mekanismi | Mitä se rajoittaa |
| --------- | ----------------- |
| §10.3 Peruutettavuusluokittelu | Erottaa kaksisuuntaiset ovet YKSISUUNTAISISTA; allekirjoita / julkaise / lähetä / poista / luovuta vastapuolelle ovat oletuksena yksisuuntaisia |
| §10.3.1 Jäähtymisväli | **Mikään peruuttamaton ei lähde siinä istunnossa, joka sen keksi** — tietoinen väli päätöksen ja teon välillä |
| §10.4 Todennettu vs. edelleen välitetty | Pakottaa merkitsemään päätöksen näyttöperustan päätöshetkellä, ei alaviitteessä |
| §10.1 / §10.6 | Kuusikenttäinen päätösmuoto pakollisine suosituksineen, katto neljä päätöstä per istunto |
| §4 Viisivaiheinen HIC-oppimistulos | EU:n tekoälyasetuksen 14 artiklan interventiopiste istuntotasolla |

Yhdessä luettuna oppimisstandardi toimii **legitimiteettiväitteiden nopeusrajoittimena**, asennettuna tekniseen prosessiin, jossa sellaista ei luonnostaan ole. Sen tarpeellisuus on itsessään näyttöä tämän osion teesille: jos artefaktin tuottaminen ja artefaktin legitimointi kulkisivat vertailukelpoisilla nopeuksilla, tällaista mekanismia ei olisi tarvittu.

#### 10.27.4 Suunnitteluperiaate DWS:n tuotealustalle

Kaupallinen johtopäätös seuraa suoraan, ja se muovaa sitä, mitä alusta myy yrityksille.

1. **Oletuksena sisäinen.** Spesifikaatio on **sisäinen työartefakti**, kunnes se ansaitsee ulkoisen validoinnin kohdelainkäyttöalueensa oikean portin kautta. Alustan asenne ei ole julkaista nopeammin vaan **ansaita käyttöönotto sillä tahdilla, jota kukin elin edellyttää** — tahdilla, jota alusta ei aseta eikä voi puristaa. Tämä on ohjaava oletus; neljä alla olevaa periaatetta toimivat sen alaisuudessa.
2. **Myy näyttöä, älä tuomioita.** Näyttöartefaktit ovat tuotettavissa konenopeudella; vaatimustenmukaisuus*tuomiot* edellyttävät instituutioita, jotka eivät ole. Alustan tuotoksen tulee siksi olla tarkistettavaa aineistoa, jota tarkastaja, valvoja tai vastapuoli arvioi — ei koskaan väite siitä, että vaatimustenmukaisuus vallitsee. Periaatetta sovellettiin konkreettisesti julkiseen tekstiin samalla jaksolla: *"oikeudessa kestävä alkuperätieto"* muuttui muotoon *"alkuperätieto, joka on suunniteltu 12 artiklan kirjanpitovaatimuksia vasten"*, ja *"KYA:sta tulee EU:n tekoälyasetuksen vaatimustenmukaisuuskerros"* sai nimenomaisen lisäyksen, ettei se itsessään tee käyttöönotosta vaatimustenmukaista.
3. **Jokainen väite kantaa vaiheensa.** Kypsyysmerkintä kulkee **väitteen vieressä** — samassa virkkeessä, samassa kortissa — ei erillisellä tilasivulla. Kolmen vierityksen päässä oleva vaihemerkintä on sama ylivaatimus lisäaskelin.
4. **Profiilit, ei haaroja.** Lainkäyttöalueiden erot hoidetaan parametrisoimalla yksi ydin, ei toimittamalla kolmea tuotetta. Kolme tuotetta ajautuu erilleen; yksi ydin kolmine profiileineen säilyttää siirrettävän todistuksen, joka on koko tarkoitus.
5. **Rakenna nopeusrajoitin tuotteeseen, ei vain prosessiin.** Jos tämän ohjelman oma tekninen työ tarvitsi jäähtymisvälin, agenttipohjaisia vaatimustenmukaisuustyönkulkuja kokoava yritys tarvitsee sen kipeämmin, koska sillä ei ole kontekstia eikä tekijyyttä huomata kuilua omin avuin. Sen tekeminen rakenteellisesti vaikeaksi, että vaatimustenmukaisuusväite lähtisi nopeammin kuin sitä tukeva näyttö kertyy, on **tuoteominaisuus**, ei sisäinen kuri.

**Miksi tämä on kaupallinen asema eikä rajoite.** Säännellyillä toimialoilla toimivat yritykset ovat se joukko, jota artefakti–legitimiteetti-kuilu vahingoittaa eniten, koska niiden tapauksessa ylivaatimus ei vain nolostuta — siitä tulee valvontahavainto. Generatiiviset työkalut ovat tehneet viimeistellystä vaatimustenmukaisuusdokumentista yleisesti saatavan; samassa liikkeessä niukaksi on tullut kyky sanoa, **mitkä sen osat ovat kantavia**. Juuri tuo erottelukyky — näyttö erotettuna väitteestä, todennettu erotettuna edelleen välitetystä, vaihe lausuttuna väitteen kanssa — on se, mitä vaatimustenmukaisuusäly tuotteena tarkoittaa, ja se on se, mitä DWS IQ tarjoaa yrityksille.
