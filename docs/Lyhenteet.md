# Lyhenteet

**A2A**: Agent-to-Agent. DWS10/DWS IQ -kontekstissa agenttien välinen yhteentoimivuus- ja liityntäkäytäntö, jossa ulkoiset tai asiakkaan omat agentit voidaan liittää alustaan julkaisemalla agenttikortti (Agent Card), jonka perusteella alusta löytää ja orkestroi agentteja yhdessä sisäisen agenttijoukon kanssa.

**AI**: Artificial Intelligence. Tekoäly (koneäly), joka tuottaa havaintoja, ennusteita ja suosituksia datasta sekä kykenee automatisoimaan tehtäviä ihmisen määrittelemissä rajoissa. DWS10/DWS IQ/Firehorse -kontekstissa AI toteutuu käytännössä monimallisena ja moniagenttisena kokonaisuutena, jossa kielimallit orkestroivat toimialakohtaisia agentteja, yhdistävät operatiivisen datan (ERP/BIM/IoT) ja EU-sääntelyvaatimukset (Fit for 55, CSRD, EPBD, CBAM) sekä tuottavat auditoitavaa päätöksenteko- ja raportointikyvykkyyttä hybridiarkkitehtuurilla (reuna/pilvi: Control Room / Situation Room).

**API**: Application Programming Interface. Ohjelmointirajapinta, joka mahdollistaa järjestelmien välisen kommunikaation.

**CBAM**: Carbon Border Adjustment Mechanism. EU:n hiilirajamekanismi, joka kohdistaa hiilikustannusta tuontituotteiden sisältyviin päästöihin (mm. sementti, rauta ja teräs, alumiini) ja ehkäisee hiilivuotoa.

**CONTROL ROOM**: DWS10/DWS IQ -arkkitehtuurin reunakerros, jossa edge-ympäristö (esim. NVIDIA Jetson, teollinen yhdyskäytävä tai muu paikallinen laskenta) käsittelee sensorien ja prosessien tapahtumia reaaliajassa. Control Room toteuttaa paikallisen päättelyn, luokittelun, havaintojen validoinnin, hälytykset ja ensivaiheen ohjauksen alle 100 ms tavoitevasteella myös rajallisen yhteyden kohteissa. Kerros tukee HIL-käytäntömallia (ihmisen hyväksyntäportit, keskeytys/ohitus, poikkeuskäsittely) ja kirjaa tapahtumat audit trailiin, jonka perusteella Situation Room voi tehdä syväanalyysin, raportoinnin ja mallien jatko-optimoinnin.

**CSRD**: Corporate Sustainability Reporting Directive. EU:n yritysvastuuraportointidirektiivi, joka velvoittaa tietyt yritykset raportoimaan vuosittain kattavasti ympäristöön, yhteiskuntaan ja hallintotapaan (ESG) liittyvistä vaikutuksista, riskeistä ja mahdollisuuksista. Raportointi tehdään ESRS-standardien mukaisesti ja perustuu kaksoisolennaisuuteen (vaikutukset sekä taloudellinen olennaisuus), ja tietoihin sisältyy myös arvoketju (Scope 1-3) sekä varmennusvaatimus.

**DWS Connect**: DWS10/DWS IQ -toteutusmalli, joka mahdollistaa palvelun käytön ja integraatiot useilla lainkäyttöalueilla (jurisdiktioissa) ja/tai alueellisilla ympäristöillä. Ratkaisussa tietojen sijainti, integraatiot ja käyttöoikeudet voidaan sovittaa kunkin maan/alueen vaatimuksiin samalla, kun käyttäjälle tarjotaan yhtenäinen käyttöliittymä ja hallittu datavirta ("yksi dataputki - monta ulostuloa").

**DWS IQ**: DWS IQ Lifetime Oy:n kehittämä ilmastoälykäs palvelualusta EU-sääntelyn mukaiseen ilmastoyhteensopivuuden ja raportoinnin hallintaan. Alusta kokoaa organisaation päästö- ja toimintadatan (esim. ERP-, BIM- ja IoT-lähteet), laskee ja versioi EN 15978 -vaiheiden A1-D mukaisia tietoja sekä tuottaa auditoitavia raportteja ja dashboardeja erityisesti Fit for 55-, CSRD-, EPBD- ja CBAM-vaatimuksiin. DWS IQ:n ydinidea on "yksi dataputki - monta ulostuloa": sama hallittu tietomalli palvelee eri maiden ja standardien raportointitarpeita, ja jokainen luku on jäljitettävissä lähdedataan (audit trail). Alustaan kuuluu agenttien orkestrointi sekä vaihtoehtona reunalaskenta (NVIDIA Jetson) alle 100 ms vasteajalla, jolloin kriittisiä havaintoja ja päätöksiä voidaan tehdä myös kohteissa, joissa pilviyhteys on rajoitettu.

**DWS IQ 6**: DWS IQ -alustan infra-suvereeni toteutus ("Infrastructure Sovereignty"), jossa laskenta, data ja valitut integraatiot sijoitetaan ennalta määriteltyyn infrastruktuuriin ja alueeseen (esim. EU/ETA) ja niitä hallitaan sovittujen vaatimustenmukaisuus- ja turvallisuusrajojen sisällä. Tarkoitus on varmistaa datan sijainti, hallittu ylläpito ja ennakoitava kustannus samalla, kun hyödynnetään DWS10:n hybridi reuna-pilviarkkitehtuuria.

**DWS IQ Aegis**: DWS IQ -alustan täyden suvereeniteetin toteutus ("Full Sovereignty"), jossa asiakasympäristö voidaan toteuttaa täysin eriytettynä ja asiakkaan hallintamallin mukaisesti (esim. oma infrastruktuuri, oma pilvi, oma konesali). Tavoitteena on maksimoida datan ja mallien hallinta, vaatimustenmukaisuus ja auditointikelpoisuus silloin, kun toimialan tai julkishallinnon vaatimukset edellyttävät korkeinta mahdollista suvereniteettitasoa.

**Edge AI**: Reunalaitteessa (esim. älypuhelin, teollinen yhdyskäytävä, kamera tai NVIDIA Jetson) toimiva tekoäly, jossa kielimalli ja sitä hyödyntävä sovellus ajavat päättelyn paikallisesti (on-device inference) ilman jatkuvaa verkkoyhteyttä. Ratkaisu mahdollistaa nopean vasteajan ja toimintavarmuuden myös katvealueilla, vähentää tietoliikenne- ja pilvikustannuksia sekä parantaa tietosuojaa, kun dataa ei tarvitse siirtää ulkoisiin pilvipalveluihin. DWS10/DWS IQ -kontekstissa tyypillinen toteutus on hybridi: reuna (Control Room) hoitaa reaaliaikaiset havainnot ja ohjauksen (esim. sensoridata, luokittelut, hälytykset), ja pilvi (Situation Room) täydentää raskaammalla analyysillä, raportoinnilla, mallipäivityksillä sekä keskistetyllä tilannekuvalla.

**EPBD**: Energy Performance of Buildings Directive. Rakennusten energiatehokkuusdirektiivi (EU), joka ohjaa rakennuskannan energiankulutuksen ja päästöjen vähentämistä asettamalla vaatimuksia mm. energiatodistuksille, teknisille vähimmäisvaatimuksille sekä uudis- ja korjausrakentamisen energiatehokkuudelle. Uusimmassa uudistuksessa painotus laajenee pelkästä käytönaikaisesta energiasta myös rakennusten elinkaaren kasvihuonekaasupäästöihin: tietyiltä uudisrakennuksilta edellytetään elinkaaren aikaista ilmastovaikutusten (sisältyvä hiili mukaan lukien) laskentaa ja raportointia vaiheittain tiukentuvalla aikataululla.

**ETS**: Emissions Trading System. EU:n päästökauppajärjestelmä, joka perustuu päästökatto- ja päästökauppaperiaatteeseen (cap-and-trade): järjestelmän piirissä oleville sektoreille asetetaan EU-tason päästökatto, joka pienenee vuosittain, ja toimijat joutuvat luovuttamaan päästöoikeuksia (1 oikeus noin 1 tCO2e) toteutuneita päästöjään vastaavasti. Päästöoikeuksia hankitaan pääosin huutokaupasta ja osin ilmaisjakona hiilivuotoriskin toimialoille; oikeuksilla voi myös käydä kauppaa markkinoilla. Järjestelmä kattaa erityisesti sähkön ja lämmön tuotantoa, energiaintensiivistä teollisuutta sekä lento- ja meriliikennettä, ja sitä on laajennettu Fit for 55 -paketissa; lisäksi on luotu erillinen ETS2, joka kohdistuu polttoaineiden käytön CO2-päästöihin rakennuksissa ja tieliikenteessä ("upstream"-malli, velvoite polttoainetoimittajille).

**GDPR**: General Data Protection Regulation. Yleinen tietosuoja-asetus (EU) 2016/679.

**HIL**: Human-in-the-Loop. Ihminen-silmukassa-menetelmä, jossa ihminen on osana tekoälyjärjestelmän päätöksentekoa (hyväksyy, ohjaa tai keskeyttää toiminnan). DWS10/DWS IQ/Firehorse -kontekstissa HIL on keskeinen turvallisuus- ja luottamusmekanismi: käyttöönotto etenee vaiheittain (Hiljainen pilotti -> Neuvonantaja -> Autonominen), joissa tekoäly ensin vain havainnoi, sitten ehdottaa toimenpiteitä ja vasta lopulta voi toimia sovituissa rajoissa. Tämä tukee EU AI Actin (EU 2024/1689) vaatimuksia erityisesti ihmisen valvonnasta, käyttöohjeista ja toimintarajoista: Control Room -reunakerros tuottaa reaaliaikaiset havainnot ja hälytykset, mutta ihmisen hyväksyntäportit, poikkeuskäsittely ja pysäytys-/ohitusmahdollisuudet varmistavat, ettei automaatio tee ei-toivottuja muutoksia. Kaikki päätökset, syötteet ja muutokset kirjautuvat auditointipoluksi (audit trail) ja muodostavat läpinäkyvyyden sekä jäljitettävyyden perustan; käyttäjän palaute sulkee oppimissilmukan mallien ja agenttien parantamiseen.

**HQW**: High Quality Workflow. DWS10/Lifetime Studios -kontekstissa hyväksytty ja validoitu agentti-/artefakti, joka nostetaan osaksi DWS IQ -tuoteperhettä hallittuna projektina (versiointi, portit ja todistusaineisto), jotta toimitus on auditoitava ja yritystason laatuvaatimukset täyttyvät.

**IR**: Incident Response. Poikkeamien ja tietoturva-/toimintahäiriöiden hallintaprosessi (havainnointi, eskalointi, torjunta, palautus ja jälkikäsittely), jota DWS10 kuvaa runbookeilla ja eskalointikäytännöillä erityisesti NIS2-vaatimustenmukaisuuden tueksi.

**ISMS**: Information Security Management System. Tietoturvallisuuden hallintajärjestelmä: politiikat, roolit, riskienhallinta, kontrollit ja jatkuva parantaminen, joilla DWS10/DWS IQ:n tietoturvaa johdetaan järjestelmällisesti (ISO 27001 -viitekehys).

**ISO/IEC 27001**: Tietoturvallisuuden hallintajärjestelmän (ISMS) standardi. DWS10-kontekstissa tarkoittaa ISO 27001 -linjausta: riskiperusteista kontrollivalintaa, dokumentoituja politiikkoja ja auditoitavaa jatkuvan parantamisen sykliä (Plan-Do-Check-Act).

**KYA**: Know Your Architecture. DWS10/DWS IQ Aegis -kontekstissa arkkitehtuurin suvereenisuutta ja eriytystä korostava periaate: tiedetään missä data, identiteetit, avaimet, lokit ja mallit sijaitsevat ja kuka niitä hallitsee (tavoitteena minimoida ulkoinen juridinen altistus ja parantaa auditointikelpoisuutta).

**LCA**: Life Cycle Assessment. Elinkaariarviointi, tuotteen tai palvelun ympäristövaikutusten kokonaisarvio.

**LLM**: Large Language Model. Suuri kielimalli, kuten Claude, GPT tai Llama.

**MCP**: Model Context Protocol. Mallikontekstiprotokolla, joka mahdollistaa agenttien välisen koordinoinnin.

**MVP**: Minimum Viable Product. Pienin toimiva tuote, jolla voidaan testata liiketoimintahypoteeseja.

**NIS2**: Network and Information Security Directive 2. EU:n kyberturvallisuusdirektiivi (EU) 2022/2555, joka asettaa velvoitteita olennaisille ja tärkeille toimijoille (mm. energia, liikenne, terveys, digitaalinen infrastruktuuri sekä tietyt valmistavan teollisuuden ja palvelusektorin toimijat) kyberturvallisuusriskien hallintaan ja häiriöihin varautumiseen. NIS2 edellyttää riskiperusteisia toimenpiteitä (esim. tietoturvapolitiikat ja -kontrollit, haavoittuvuuksien hallinta, lokitus ja valvonta, varmistukset ja palautuminen, salaus ja käyttöoikeuksien hallinta), toimitusketjun turvallisuuden huomiointia sekä johdon vastuuta. Lisäksi direktiivi määrittää ilmoitusvelvollisuudet merkittävistä poikkeamista (varhainen ilmoitus ja jatkoraportointi kansallisen viranomaisen ohjeiden mukaan). DWS10-kontekstissa NIS2 näkyy käytännössä ISMS/ISO 27001 -linjauksena, IR-runbookeina ja eskalointina, RPO/RTO-tavoitteina, turvallisena SDLC:nä (mm. SAST) sekä auditointikelpoisena lokituksena ja todistusaineiston keruuna.

**PWA**: Progressive Web App. Progressiivinen verkkosovellus, joka toimii kuten natiivisovellus.

**RBAC**: Role-Based Access Control. Roolipohjainen käyttöoikeusmalli, jossa oikeudet myönnetään rooleille (ei yksittäisille käyttäjille). DWS10-kontekstissa toteuttaa vähimmän oikeuden periaatetta (least privilege) yhdessä vahvan tunnistautumisen ja auditointilokien kanssa.

**RLS**: Row-Level Security. Rivitason suojaus, joka rajoittaa tietokantakyselyn tuloksia käyttäjäkohtaisesti.

**ROI**: Return on Investment. Sijoitetun pääoman tuotto.

**RPO/RTO**: Recovery Point Objective / Recovery Time Objective. Palautumisen tavoitearvot: kuinka paljon dataa voidaan enintään menettää (RPO) ja kuinka nopeasti palvelu palautetaan (RTO). DWS10-kontekstissa osa varmistus- ja palautussuunnittelua sekä palautusharjoituksia.

**SaaS**: Software as a Service. Ohjelmisto palveluna, pilvipohjaisesti tuotettava ohjelmistopalvelu.

**SAST**: Static Application Security Testing. Staattinen sovellusturvatestaus, jolla koodista etsitään haavoittuvuuksia ja heikkoja käytäntöjä osana CI/CD-putkea (esim. SAST + riippuvuusskannaus ja korjausaikataulut).

**SDLC**: (Secure) Software Development Life Cycle. Ohjelmistokehityksen elinkaari, jota DWS10:ssa kuvataan turvallisena kehityskäytäntönä: uhkamallinnus, koodikatselmointi, muutoksenhallinta, julkaisuportit, lokitus ja todistusaineiston keruu.

**SOC 2 Type II**: Palveluorganisaation kontrollien auditointikehys, jossa Type II arvioi kontrollien toimivuutta ajanjakson yli (ei vain suunnittelua). DWS10-kontekstissa viittaa SOC 2 -valmiuteen erityisesti CI/CD:n muutoksenhallinnassa, julkaisuporteissa ja automaattisessa todistusaineiston (evidence) keruussa.

**SITUATION ROOM**: DWS10/DWS IQ -arkkitehtuurin pilvikerros (keskitetty "tilannehuone"), joka kokoaa reunan (Control Room) tuottamat havainnot, lokit ja tapahtumat yhdeksi hallituksi tilannekuvaksi. Situation Roomissa suoritetaan raskaampi analytiikka ja optimointi (esim. trendit, poikkeamien juurisyy, LCA/Scope-raporttien koostaminen), ylläpidetään integraatioita ja datamallia (ERP/BIM/IoT), hallitaan mallien/agenttien päivitykset ja versiot sekä tuotetaan auditointikelpoinen todistusaineisto (evidence) vaatimustenmukaisuutta varten (mm. EU AI Act, NIS2, CSRD/ESRS).

**TAM**: Total Addressable Market. Kokonaismarkkinapotentiaali.

## Agenttityön keskeiset lyhenteet (repo-konteksti)

**ADE**: Agentic Development Environment. Kehitysympäristö, jossa agentti voi suorittaa työkaluja ja orkestroida tehtäviä (esim. Claude Code, Cursor, VS Code + MCP-työkalut).

**ARR**: Annual Recurring Revenue. Vuotuinen toistuva liikevaihto, jota käytetään erityisesti SaaS- ja pilotista jatkuvaksi sopimukseksi siirtymisen mittarina.

**BYO**: Bring Your Own. DWS-kontekstissa asiakkaan oman agentin, infrastruktuurin tai mallin liittäminen hallittuun elinkaareen (esim. BYO Agent Lifecycle + KYA-portit).

**C2**: Command and Control. Tietoturvakontekstissa haitallinen etähallintakanava; DWS-kontekstissa viittaa uhkamalliin, jota torjutaan rajaamalla integraatioita ja valvomalla työkalu-/MCP-kutsuja.

**CDP**: Chrome DevTools Protocol. Selainautomaation protokolla, jota agenttipohjaiset selaintyökalut hyödyntävät selaimen ohjaukseen.

**CI/CD**: Continuous Integration / Continuous Deployment. Jatkuvan integraation ja toimituksen putki, jossa testaus, tietoturvatarkastukset ja julkaisuportit automatisoidaan.

**CLI**: Command Line Interface. Komentoriviliittymä; DWS-kontekstissa `dws` on ensisijainen agentti- ja operointirajapinta.

**DMS**: Document Management System. Dokumenttien hallintajärjestelmä; DWS/Firehorse-kontekstissa sisällönhaun, versionhallinnan ja raportointiaineiston hallittu kerros.

**DSAR**: Data Subject Access Request. Rekisteröidyn tietopyyntö GDPR-kontekstissa (esim. tarkastus-, oikaisu- tai poistopyyntö), joka tulee voida käsitellä auditoitavasti.

**ERP**: Enterprise Resource Planning. Toiminnanohjausjärjestelmä (esim. SAP, IFS, D365), josta agentit hakevat operatiivista dataa analytiikkaan ja raportointiin.

**ESG**: Environmental, Social and Governance. Ympäristö-, sosiaali- ja hallintovastuun viitekehys yritysten vastuullisuuden arviointiin ja raportointiin.

**ESRS**: European Sustainability Reporting Standards. CSRD-raportoinnin EU-standardit, joiden mukaisesti vastuullisuustieto rakenteistetaan ja raportoidaan.

**HTTP**: Hypertext Transfer Protocol. Verkkoprotokolla API- ja MCP-kutsuille (esim. JSON-RPC MCP-päätepisteissä).

**IDV**: Identity Verification. Henkilön tai toimijan identiteetin varmentaminen osana agenttien luottamus- ja käyttöönotto­prosessia.

**IoT**: Internet of Things. Esineiden internet; anturi- ja laitedata, jota DWS-agentit hyödyntävät reaaliaikaisessa seurannassa ja päätöksenteossa.

**JSON**: JavaScript Object Notation. Rakenneformaatti, jota DWS CLI, API:t ja agenttien välinen tietojenvaihto käyttävät.

**JSON-RPC**: JavaScript Object Notation - Remote Procedure Call. Kevyt RPC-protokolla, jota MCP-rajapinta hyödyntää työkalukutsujen välitykseen.

**JWT**: JSON Web Token. Allekirjoitettu valtuutustoken, jota käytetään API-kutsujen todennukseen ja valtuutukseen.

**KYB**: Know Your Business. Organisaation taustojen varmennusprosessi osana suvereniteetti- ja luottamusmallia.

**LTV**: Lifetime Value. Asiakkuuden elinkaaren arvo; agentit voivat käyttää mittaria asiakkuuden kannattavuuden arviointiin.

**MRR**: Monthly Recurring Revenue. Kuukausittain toistuva liikevaihto, jota käytetään erityisesti SaaS-liiketoiminnan suorituskykymittarina.

**NPS**: Net Promoter Score. Asiakaskokemusmittari, joka arvioi suositteluhalukkuutta ja tukee retention- ja asiakasterveysanalyyseja.

**RPC**: Remote Procedure Call. Etäkutsumalli, jossa asiakas kutsuu palvelun toimintoa verkon yli kuin paikallista funktiota.

**SDK**: Software Development Kit. Kehityspaketti, jolla integraatiot toteutetaan hallitusti (esim. pilvi- tai palvelukohtaiset SDK:t).

**SLA**: Service Level Agreement. Palvelutasosopimus, jossa määritellään saatavuus-, vaste- ja palautumistavoitteet.

**STRIDE**: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege. Uhkamallinnuskehys tietoturvariskien systemaattiseen tunnistamiseen.

**TTHW**: Time to Hello World. Kehityskokemusmittari, joka kuvaa kuinka nopeasti uusi kehittäjä tai agentti pääsee toimivaan ensitulokseen.

**VPA/HPA**: Vertical Pod Autoscaler / Horizontal Pod Autoscaler. Kubernetesin automaattisen skaalauksen mekanismit resurssioptimointiin.
