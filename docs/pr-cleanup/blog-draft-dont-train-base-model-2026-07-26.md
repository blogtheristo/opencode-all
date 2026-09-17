<!-- DRAFT for HIC review — weekly blog post (Boardy draft, audited). NOT published.
Language: FI (primary, matches the Boardy draft). Publish workflow (separate, reviewed):
EN parity + hreflang, HTML render, §3 registry + blog/index.html latestPosts +
scripts/inject-blog-nav.cjs, dual-folder sync to landing-pages/onelifetime-world/,
5-language bar, product cards. House voice: BLOG_STANDARD §12 (Seth Godin).
Corrections applied vs the raw Boardy draft:
  1. Tier structure — Sovereign Infra & Connect are TIERS of Aegis, not standalone
     products; framed as "one product line, three tiers + FPE" (per PRODUCT_REFRAME_AUDIT).
  2. Risk-register gap named explicitly as a "what's missing" item (the DD question). -->

# Älä treenaa base-mallia, omista evidenssikerros

Jokainen AI-startup kertoo juuri nyt fine-tunaavansa omaa malliaan. EU-sovereign compliance-työssä se on väärä kysymys.

Ongelma ei ole mallin laatu. Ongelma on artifact-legitimacy gap: tekninen valmius ja legitiimiys eivät kulje samalla kellolla. Frontier-malli tuottaa artefaktin tunneissa. Sen sitominen sääntelytodellisuuteen — vertaisarviointi, riippumaton toteutus, viranomaisen hyväksyntä, per-lainkäyttöalue oikeudellinen tarkastus — vie viikkoja tai kuukausia, eikä lyhene. Oman mallin omistaminen ei sulje tätä kuilua. Se siirtää sen.

Ja fyysinen AI ja compliance-evidenssi ovat kaksi eri optimointiongelmaa. Robotin havainnointi→toiminta reaaliajassa on eri tehtävä kuin tuomioistuinkelpoisen päättelyketjun tuottaminen. Yksi malli molempiin on kompromissi kumpaankin suuntaan.

Tee näin sen sijaan.

Adoptoi valmis sovereign-komponentti fyysiseen kerrokseen. NVIDIA Cosmos 3 Edge on avoin, laitteessa ajettava maailmanmalli — se pyörii on-prem sillä laatikolla joka sinulla jo on. Et treenaa sitä. Otat sen käyttöön.

Aja compliance-päättely avoimella LLM:llä NIM:n kautta. Se on ei-sovereign työtä: benchmarkkausta ja luonnostelua, ei asiakasdatan ydintä.

Investoi siihen mitä et voi ostaa: omistettuun evidenssisilmukkaan. Privaatit evaluaatiot, RL-ympäristö, adaptointi omalla fleet-datalla, KYA-governance, Article 12 -näyttö. Base-malli kommoditisoituu joka kuukausi. Silmukka ei. Se on ainoa kerros jota kilpailija ei voi kopioida, koska se on rakennettu sinun operaatioidesi päälle.

Nimeä myös riski, älä piilota sitä.

NVIDIA-stack on dominoiva: rauta, malli ja tarjoilu samalta toimittajalta. Se on todellinen keskittymä. Mutta koska painot ovat avoimet, siirrettävyys on aitoa. Pidä yksi avoin malli ja yksi työkuorma ajettavana ei-NVIDIA-kiihdyttimellä (AMD MI300, Intel Gaudi) testbed-tasolla. Silloin exit-kustannus on auditoitava, ei teoreettinen. Managed dependency, ei lock-in.

Näin se näkyy tuotelinjassa. Yksi tuote, kolme tieriä — ei neljää irrallista tuotetta.

DWS IQ Aegis on kahden kerroksen tuote: fyysinen havainnointi→toiminta (Cosmos 3 Edge) + compliance-evidenssi (erillinen LLM-kerros), jotka KYA-silmukka sitoo yhteen. Sen tierit skaalaavat sovereniteettia: Sovereign Infra jakaa fleet/edge-fyysisen ja cloud-compliancen; Connect on globaali tier ilman sovereign-rajoitteita. Ja Firehorse Production Engine ajaa operator-independent-työnkulut konenäöllä siellä missä operaattorin havainnointi korvautuu — rakennusalan forensiikka, ei uusi malli.

Mitä puuttuu vielä — koska artifact-legitimacy gap koskee myös meitä.

NVIDIA-supply-riskin fallback-suunnitelma pitää kirjata näkyväksi riskirekisteriin, per tuote jossa DGX/Cosmos/NIM on kriittinen. Ei riitä että exit on mahdollinen; sen pitää olla harjoiteltu. Tämä on kysymys jonka sijoittaja ja enterprise-ostaja esittää heti kun mainitset NVIDIA-riippuvuuden. Sanomme sen ääneen ennen kuin he kysyvät.

Periaate on universaali. Vallihauta ei ole mallissa. Se on siinä miten mallin tuotos sidotaan sääntelytodellisuuteen. Komponentit voit ostaa. Evidenssikerrosta et.

Lisää arkkitehtuurista ja tuotteista: dws10.com

_Risto Anton Päärni · Founder, CEO · Lifetime Oy · the Agent Outcome Company_
