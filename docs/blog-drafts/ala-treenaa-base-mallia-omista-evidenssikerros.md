Status: REAPPROVAL_NEEDED
reapproval_note: text corrected 30.09.2026 by external sourcing (BLOG_STANDARD §17); previously APPROVED. The published page is unchanged.
Slug: ala-treenaa-base-mallia-omista-evidenssikerros
Title: Älä treenaa base-mallia, omista evidenssikerros
Language: fi
Target: onelifetime.world/posts/ala-treenaa-base-mallia-omista-evidenssikerros.html
Date: 2026-07-26
claims_checked: 2026-09-30
Reviewed-By: Risto Anton Päärni (HIC)
Reviewed-On: 2026-07-27
Approval-Record: HIC, 27.07.2026 — "This text i reviewed." Backfilled after the fact:
this post was published (PR #1757) before the draft gate existed. The record is here
because the HIC confirmed the review, not because the process was followed at the time.

# Älä treenaa base-mallia, omista evidenssikerros

Näkökulma · Arkkitehtuuri · 26. heinäkuuta 2026 · Risto Anton Päärni · Espoo, Suomi
Jokainen AI-startup kertoo juuri nyt fine-tunaavansa omaa malliaan. EU-sovereign
compliance-työssä se on väärä kysymys.

Ongelma ei ole mallin laatu. Ongelma on artifact-legitimacy gap: tekninen
valmius ja legitiimiys eivät kulje samalla kellolla. Frontier-malli tuottaa artefaktin
tunneissa. Sen sitominen sääntelytodellisuuteen — vertaisarviointi, riippumaton
toteutus, viranomaisen hyväksyntä, per-lainkäyttöalue oikeudellinen tarkastus — vie
viikkoja tai kuukausia, eikä lyhene. Oman mallin omistaminen ei sulje tätä kuilua. Se
siirtää sen.

Ja fyysinen AI ja compliance-evidenssi ovat kaksi eri optimointiongelmaa. Robotin
havainnointi→toiminta reaaliajassa on eri tehtävä kuin tuomioistuinkelpoisen
päättelyketjun tuottaminen. Yksi malli molempiin on kompromissi kumpaankin suuntaan.

## Tee näin sen sijaan

Adoptoi valmis sovereign-komponentti fyysiseen kerrokseen. NVIDIA Cosmos 3
Edge on avoin, laitteessa ajettava maailmanmalli [1][2] — se pyörii on-prem sillä
NVIDIA-laatikolla (Ampere, Hopper tai Blackwell) joka sinulla jo on [1]. Et treenaa sitä.
Otat sen käyttöön.

Aja compliance-päättely avoimella LLM:llä NIM:n kautta. Se on ei-sovereign
työtä: benchmarkkausta ja luonnostelua, ei asiakasdatan ydintä.

Investoi siihen mitä et voi ostaa: omistettuun evidenssisilmukkaan.
Privaatit evaluaatiot, RL-ympäristö, adaptointi omalla fleet-datalla, KYA-governance,
Article 12 -näyttö [3]. Base-malli kommoditisoituu joka kuukausi. Silmukka ei. Se on ainoa
kerros jota kilpailija ei voi kopioida, koska se on rakennettu sinun operaatioidesi päälle.

## Nimeä myös riski, älä piilota sitä

NVIDIA-stack on dominoiva: rauta, malli ja tarjoilu samalta toimittajalta. Se on todellinen
keskittymä. Mutta koska painot ovat avoimet, siirrettävyys on aitoa — joskin Cosmos 3 Edge on
testattu vain NVIDIA-raudalla [1], joten siirrettävyys pitää osoittaa, ei olettaa. Pidä yksi avoin malli
ja yksi työkuorma ajettavana ei-NVIDIA-kiihdyttimellä (AMD MI300, Intel Gaudi)
testbed-tasolla. Silloin exit-kustannus on auditoitava, ei teoreettinen.

Riippuvuus on hallittu vasta kun exit on osoitettu — ei kun se on väitetty.

## Näin se näkyy tuotelinjassa

Yksi tuote, kolme tieriä — ei neljää irrallista tuotetta.

DWS IQ Aegis on kahden kerroksen tuote: fyysinen
havainnointi→toiminta (Cosmos 3 Edge -luokan adoptoitu maailmanmalli) ja
compliance-evidenssi (erillinen LLM-kerros), jotka KYA-silmukka sitoo yhteen. Sen tierit
skaalaavat sovereniteettia: Sovereign Infra jakaa fleet/edge-fyysisen ja
cloud-compliancen, Connect on globaali tier ilman sovereign-rajoitteita. Ja
Firehorse Production Engine ajaa operator-independent-työnkulut konenäöllä
siellä missä operaattorin havainnointi korvautuu — rakennusalan forensiikka, ei uusi
malli.

## Mitä puuttuu vielä

Koska artifact-legitimacy gap koskee myös meitä. NVIDIA-supply-riskin fallback-suunnitelma
pitää kirjata näkyväksi riskirekisteriin, per tuote jossa DGX, Cosmos tai NIM on
kriittinen. Ei riitä että exit on mahdollinen; sen pitää olla harjoiteltu. Tämä on kysymys
jonka sijoittaja ja enterprise-ostaja esittää heti kun mainitset NVIDIA-riippuvuuden.
Sanomme sen ääneen ennen kuin he kysyvät.

## Periaate on universaali

Vallihauta ei ole mallissa. Se on siinä miten mallin tuotos sidotaan sääntelytodellisuuteen.
Komponentit voit ostaa. Evidenssikerrosta et.

Lisää arkkitehtuurista ja tuotteista:
DWS IQ Aegis.

## Lähteet

[1] NVIDIA (2026). Cosmos3-Edge — model card (released 20.07.2026, OpenMDW 1.1 license). Hugging Face. https://huggingface.co/nvidia/Cosmos3-Edge

[2] NVIDIA et al. (2026). Cosmos 3: Omnimodal World Models for Physical AI. arXiv:2606.02800. https://arxiv.org/abs/2606.02800

[3] Euroopan parlamentti ja neuvosto (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), artikla 12 (Record-keeping). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
