/**
 * DWS10.com Iron Clad / Gamma Navigation v4.0
 * Unified navigation bar for all pages (Gamma-aligned with mobile hamburger menu)
 * Single source of truth: dws10.com/shared-assets/nav/ironclad-nav.js
 * Synced to lifetime.fi and onelifetime.world via scripts/on-deploy/sync-ironclad-nav.sh
 *
 * Usage: Add this script to any page:
 * <script src="/shared-assets/nav/ironclad-nav.js"></script>
 *
 * v4.2 — Solutions ▾: Industry Stack flyout (Industries Hub, DGX Spark, Situation Room, Control Room)
 * v4.1 — About ▾: removed dead "Team" link (no /team/ page exists on any site → 404)
 * v4.0 — Solutions ▾: Firehorse Production Engine added above Lifetime World Model V1
 * v3.9 — About ▾: "Certified Partners" replaced with "Partner Tiers ▸" flyout (Partner Program, Aegis Tier 1, Sovereign Infra Tier 2, Connect Tier 3) — same 4 partner links as in Solutions ▾ ▸ Integrations ▸
 * v3.8 — Compliance renamed to "Compliance Hub"; moved from Home ▾ to Solutions ▾ (after CSRD, above Integrations)
 * v3.7 — Lifetime Studios + Lifetime Consulting moved to Lifetime Group submenu (About ▾);
 *         Other ▸ flyout removed from Home ▾; Designs removed from nav
 * v3.6 — Industries flyout → direct link to /industries/ hub; Tools flyout removed;
 *         Lifetime World Model V1 added to Solutions menu; Fleet Admiral added above Captain in Investor submenu
 * v3.5 — Removed checkout/success from Other menu (payment callback only, not user-facing);
 *         Lifetime Oy added to Lifetime Group submenu → lifetime.fi;
 *         "Dual Use Industries" renamed to "Industries"; checkout/cancel removed from Other menu
 * v3.4 — Domain-aware logo (LifetimeOy.png on lifetime.fi, OLW logo on onelifetime.world);
 *         Legal Hub simplified to direct link (no flyout); investment-safety removed from Legal submenu;
 *         Agentic Commerce added to enterprise-integrations; booking CTA uses /book/
 * v3.3 — Products menu rendered at runtime from config/products.json (single source of truth shared with /price-list/); categories mirror CATEGORY_ORDER from scripts/gen-price-list-html.cjs
 * v3.2 — Nordic Industrial rebrand + duplicate-include guard: inject nordic-theme.css + IBM Plex Sans fonts + language subdirectory redirect
 * v3.1 — Language selector (EN | FI | SV) with localStorage persistence
 * v3.0 — Mobile hamburger menu (slide-out panel, tap-to-expand submenus)
 * v2.0 — Comprehensive Home menu with flyouts
 * v1.1 — Initial Gamma-aligned release
 *
 * The script will automatically inject the navigation at the start of <body>
 */

(function () {
  'use strict';

  // Duplicate-include guard: prevent double injection of nav, theme, and font links
  if (window.__ironcladNavLoaded) return;
  window.__ironcladNavLoaded = true;

  // Determine base path based on current location
  const getBasePath = () => {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    if (depth === 0 || path === '/' || path === '/index.html') return '';
    return '../'.repeat(depth);
  };

  const basePath = getBasePath();

  // Language configuration (expandable — add new languages here)
  const ironcladLanguages = [
    { code: 'en', label: 'English' },
    { code: 'fi', label: 'Suomeksi' },
    { code: 'sv', label: 'Svenska' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
  ];
  const ironcladCurrentLang = localStorage.getItem('dws-lang') || 'en';
  const ironcladCurrentLabel = (
    ironcladLanguages.find((l) => l.code === ironcladCurrentLang) || ironcladLanguages[0]
  ).label;

  // Domain-aware site configuration (v3.4)
  const hostname = window.location.hostname;
  const siteConfig =
    hostname === 'lifetime.fi' || hostname === 'www.lifetime.fi'
      ? {
          logo: 'static/images/LifetimeOy.png',
          logoAlt: 'Lifetime Oy',
          title: 'Lifetime Oy',
        }
      : hostname === 'onelifetime.world' || hostname === 'www.onelifetime.world'
        ? {
            logo: 'static/images/OneLifetime_Logo_Final.png',
            logoAlt: 'OneLifetime.World',
            title: 'OneLifetime.World',
          }
        : {
            logo: 'DWS_IQ2026.png',
            logoAlt: 'DWS IQ Platform',
            title: 'DWS IQ Platform Version 6',
          };
  const onDws10 = hostname === 'dws10.com' || hostname === 'www.dws10.com';
  // Content base for shared pages that physically live on dws10.com.
  // On dws10.com → relative basePath. On lifetime.fi / onelifetime.world the nav
  // is embedded but those pages don't exist there, so point at the real dws10.com
  // page instead of a same-origin path that 404s.
  const contentBase = onDws10 ? basePath : 'https://dws10.com/';
  const regulatoryNoticeHref = onDws10
    ? `${basePath}regulatory-notice/`
    : 'https://dws10.com/legal/';
  const priceListHref = onDws10 ? `${basePath}price-list/` : 'https://dws10.com/price-list/';

  // 5-language i18n translations for nav items (v5.0)
  var NAV_I18N = {
    'home-menu': { fi: 'Etusivu ▾', sv: 'Hem ▾', de: 'Start ▾', fr: 'Accueil ▾', en: 'Home ▾' },
    'main-page': {
      fi: 'Pääsivu',
      sv: 'Huvudsida',
      de: 'Hauptseite',
      fr: 'Page principale',
      en: 'Main Page',
    },
    'industries-hub': {
      fi: 'Toimialat',
      sv: 'Branscher',
      de: 'Branchen',
      fr: 'Secteurs',
      en: 'Industries Hub',
    },
    company: {
      fi: 'Yritys ▸',
      sv: 'Företag ▸',
      de: 'Unternehmen ▸',
      fr: 'Entreprise ▸',
      en: 'Company ▸',
    },
    careers: { fi: 'Rekrytointi', sv: 'Karriär', de: 'Karriere', fr: 'Carrières', en: 'Careers' },
    partners: { fi: 'Kumppanit', sv: 'Partners', de: 'Partner', fr: 'Partenaires', en: 'Partners' },
    'industry-captains': {
      fi: 'Toimialakapteenit',
      sv: 'Branschkaptener',
      de: 'Branchenkapitäne',
      fr: 'Capitaines sectoriels',
      en: 'Industry Captains',
    },
    'fleet-admiral': {
      fi: 'Laivastoamiraali',
      sv: 'Flottamiral',
      de: 'Flottenadmiral',
      fr: 'Amiral de flotte',
      en: 'Fleet Admiral',
    },
    'fleet-admiral-icon': {
      fi: '⚓ Laivastoamiraali',
      sv: '⚓ Flottamiral',
      de: '⚓ Flottenadmiral',
      fr: '⚓ Amiral de flotte',
      en: '⚓ Fleet Admiral',
    },
    'investor-relations': {
      fi: 'Sijoittajasuhteet',
      sv: 'Investerarrelationer',
      de: 'Investor Relations',
      fr: 'Relations investisseurs',
      en: 'Investor Relations',
    },
    'press-releases': {
      fi: 'Lehdistötiedotteet',
      sv: 'Pressmeddelanden',
      de: 'Pressemitteilungen',
      fr: 'Communiqués de presse',
      en: 'Press Releases',
    },
    'legal-hub': {
      fi: 'Lakiasiat',
      sv: 'Juridik',
      de: 'Recht',
      fr: 'Centre juridique',
      en: 'Legal Hub',
    },
    'solutions-menu': {
      fi: 'Ratkaisut ▾',
      sv: 'Lösningar ▾',
      de: 'Lösungen ▾',
      fr: 'Solutions ▾',
      en: 'Solutions ▾',
    },
    'fit55-menu': {
      fi: 'Fit for 55 ▸',
      sv: 'Fit for 55 ▸',
      de: 'Fit for 55 ▸',
      fr: 'Fit for 55 ▸',
      en: 'Fit for 55 ▸',
    },
    fit55: {
      fi: 'Fit for 55',
      sv: 'Fit for 55',
      de: 'Fit for 55',
      fr: 'Fit for 55',
      en: 'Fit for 55',
    },
    'csrd-menu': {
      fi: 'CSRD & ESG ▸',
      sv: 'CSRD & ESG ▸',
      de: 'CSRD & ESG ▸',
      fr: 'CSRD & ESG ▸',
      en: 'CSRD & ESG ▸',
    },
    csrd: {
      fi: 'CSRD & ESG',
      sv: 'CSRD & ESG',
      de: 'CSRD & ESG',
      fr: 'CSRD & ESG',
      en: 'CSRD & ESG',
    },
    'compliance-menu': {
      fi: 'Vaatimustenmukaisuus ▸',
      sv: 'Regelefterlevnad ▸',
      de: 'Compliance ▸',
      fr: 'Conformité ▸',
      en: 'Compliance Hub ▸',
    },
    compliance: {
      fi: 'Vaatimustenmukaisuus',
      sv: 'Regelefterlevnad',
      de: 'Compliance',
      fr: 'Conformité',
      en: 'Compliance Hub',
    },
    'trust-center': {
      fi: 'Luottamuskeskus',
      sv: 'Förtroendecenter',
      de: 'Vertrauenszentrum',
      fr: 'Centre de confiance',
      en: 'Trust Center',
    },
    'dual-use': {
      fi: 'Kaksikäyttö & Puolustus (Aegis)',
      sv: 'Dual-Use & Försvar (Aegis)',
      de: 'Dual-Use & Verteidigung (Aegis)',
      fr: 'Double usage & Défense (Aegis)',
      en: 'Dual-Use & Defence (Aegis)',
    },
    'interruption-calc': {
      fi: 'Keskeytyslaskuri',
      sv: 'Avbrottsberäknare',
      de: 'Unterbrechungsrechner',
      fr: "Calculateur d'interruption",
      en: 'Interruption Calculator',
    },
    'integrations-menu': {
      fi: 'Integraatiot ▸',
      sv: 'Integrationer ▸',
      de: 'Integrationen ▸',
      fr: 'Intégrations ▸',
      en: 'Integrations ▸',
    },
    'all-integrations': {
      fi: 'Kaikki yritysintegraatiot',
      sv: 'Alla företagsintegrationer',
      de: 'Alle Unternehmensintegrationen',
      fr: 'Toutes les intégrations',
      en: 'All Enterprise Integrations',
    },
    construction: {
      fi: 'Rakentaminen',
      sv: 'Bygg',
      de: 'Bauwesen',
      fr: 'Construction',
      en: 'Construction',
    },
    logistics: {
      fi: 'Logistiikka',
      sv: 'Logistik',
      de: 'Logistik',
      fr: 'Logistique',
      en: 'Logistics',
    },
    manufacturing: {
      fi: 'Valmistus',
      sv: 'Tillverkning',
      de: 'Fertigung',
      fr: 'Fabrication',
      en: 'Manufacturing',
    },
    energy: { fi: 'Energia', sv: 'Energi', de: 'Energie', fr: 'Énergie', en: 'Energy' },
    healthcare: {
      fi: 'Terveydenhuolto',
      sv: 'Hälsovård',
      de: 'Gesundheitswesen',
      fr: 'Santé',
      en: 'Healthcare',
    },
    'real-estate': {
      fi: 'Kiinteistöt',
      sv: 'Fastigheter',
      de: 'Immobilien',
      fr: 'Immobilier',
      en: 'Real Estate',
    },
    'fleet-mgmt': {
      fi: 'Ajoneuvokalusto',
      sv: 'Fordonsflotta',
      de: 'Flottenmanagement',
      fr: 'Gestion de flotte',
      en: 'Fleet Management',
    },
    'public-sector': {
      fi: 'Julkinen sektori',
      sv: 'Offentlig sektor',
      de: 'Öffentlicher Sektor',
      fr: 'Secteur public',
      en: 'Public Sector',
    },
    'synthetic-data': {
      fi: 'Synteettiset dataratkaisut',
      sv: 'Syntetiska datalösningar',
      de: 'Synthetische Datenlösungen',
      fr: 'Solutions de données synthétiques',
      en: 'Synthetic Data Solutions',
    },
    'products-menu': {
      fi: 'Tuotteet ▾',
      sv: 'Produkter ▾',
      de: 'Produkte ▾',
      fr: 'Produits ▾',
      en: 'Products ▾',
    },
    loading: {
      fi: 'Ladataan tuotteita…',
      sv: 'Laddar produkter…',
      de: 'Produkte werden geladen…',
      fr: 'Chargement des produits…',
      en: 'Loading products…',
    },
    'price-list': {
      fi: 'Näytä koko hinnasto →',
      sv: 'Visa fullständig prislista →',
      de: 'Komplette Preisliste →',
      fr: 'Liste complète des prix →',
      en: 'View full Price List →',
    },
    'buy-store': { fi: 'Kauppa', sv: 'Butik', de: 'Shop', fr: 'Boutique', en: 'Buy / Store' },
    'about-menu': {
      fi: 'Tietoa ▾',
      sv: 'Om oss ▾',
      de: 'Über uns ▾',
      fr: 'À propos ▾',
      en: 'About ▾',
    },
    team: { fi: 'Tiimi', sv: 'Team', de: 'Team', fr: 'Équipe', en: 'Team' },
    'partner-tiers': {
      fi: 'Kumppanustasot ▸',
      sv: 'Partnernivåer ▸',
      de: 'Partnerstufen ▸',
      fr: 'Niveaux partenaires ▸',
      en: 'Partner Tiers ▸',
    },
    'partner-program': {
      fi: 'Kumppaniohjelma',
      sv: 'Partnerprogram',
      de: 'Partnerprogramm',
      fr: 'Programme partenaire',
      en: 'Partner Program',
    },
    'book-meeting': {
      fi: '📅 Varaa tapaaminen',
      sv: '📅 Boka möte',
      de: '📅 Termin buchen',
      fr: '📅 Réserver',
      en: '📅 Book Meeting',
    },
    investor: {
      fi: 'Sijoittaja ▸',
      sv: 'Investerare ▸',
      de: 'Investor ▸',
      fr: 'Investisseur ▸',
      en: 'Investor ▸',
    },
    'captain-seats': {
      fi: 'Kapteenipaikat',
      sv: 'Kaptenplatser',
      de: 'Kapitänsplätze',
      fr: 'Sièges de capitaine',
      en: 'Industry Captain Seats',
    },
    'regulatory-notice': {
      fi: 'Sääntelyilmoitus',
      sv: 'Regulatoriskt meddelande',
      de: 'Regulatorischer Hinweis',
      fr: 'Avis réglementaire',
      en: 'Regulatory Notice',
    },
    'lifetime-group': {
      fi: 'Lifetime-konserni ▸',
      sv: 'Lifetime-koncernen ▸',
      de: 'Lifetime-Gruppe ▸',
      fr: 'Groupe Lifetime ▸',
      en: 'Lifetime Group ▸',
    },
    roadmap: {
      fi: 'Tiekartta',
      sv: 'Färdplan',
      de: 'Roadmap',
      fr: 'Feuille de route',
      en: 'DWS Roadmap',
    },
    'menu-title': { fi: 'Valikko', sv: 'Meny', de: 'Menü', fr: 'Menu', en: 'Menu' },
    'enterprise-offers': {
      fi: 'Yritystarjoukset',
      sv: 'Företagserbjudanden',
      de: 'Unternehmensangebote',
      fr: 'Offres entreprise',
      en: 'Enterprise Offers',
    },
    'fleet-overview': {
      fi: 'Kaluston yleiskuva',
      sv: 'Flottöversikt',
      de: 'Flottenübersicht',
      fr: 'Aperçu de la flotte',
      en: 'Fleet Overview',
    },
    'lifetime-fleet': {
      fi: 'Lifetime Fleet ▸',
      sv: 'Lifetime Fleet ▸',
      de: 'Lifetime Fleet ▸',
      fr: 'Lifetime Fleet ▸',
      en: 'Lifetime Fleet ▸',
    },
    // Product-dropdown category headers (rendered dynamically, translated via tagged span)
    'cat-platform': {
      fi: 'Alusta & Tuotteet',
      sv: 'Plattform & Produkter',
      de: 'Plattform & Produkte',
      fr: 'Plateforme & Produits',
      en: 'Platform & Products',
    },
    'cat-ai-cloud': {
      fi: 'Tekoäly & Pilvi',
      sv: 'AI & Moln',
      de: 'KI & Cloud',
      fr: 'IA & Cloud',
      en: 'AI & Cloud',
    },
    'cat-advisory': {
      fi: 'Asiantuntijaneuvonta & Koulutus',
      sv: 'Expertråd & Utbildning',
      de: 'Expertenberatung & Schulung',
      fr: 'Conseil & Formation',
      en: 'Expert Advisory & Training',
    },
    'cat-digital': {
      fi: 'Digitaaliset palvelut',
      sv: 'Digitala tjänster',
      de: 'Digitale Dienste',
      fr: 'Services numériques',
      en: 'Digital Services',
    },
    'cat-hardware': {
      fi: 'Suvereeni laitteisto',
      sv: 'Suverän hårdvara',
      de: 'Souveräne Hardware',
      fr: 'Matériel souverain',
      en: 'Sovereign Hardware',
    },
    'cat-add-on': { fi: 'Lisäosat', sv: 'Tillägg', de: 'Add-ons', fr: 'Modules', en: 'Add-ons' },
  };

  var NAV_TEXT_MAP = {
    'Home ▾': 'home-menu',
    'Main Page': 'main-page',
    'Industries Hub': 'industries-hub',
    'Company ▸': 'company',
    Careers: 'careers',
    Partners: 'partners',
    'Industry Captains': 'industry-captains',
    'Fleet Admiral': 'fleet-admiral',
    '⚓ Fleet Admiral': 'fleet-admiral-icon',
    'Investor Relations': 'investor-relations',
    'Press Releases': 'press-releases',
    'Legal Hub': 'legal-hub',
    'Solutions ▾': 'solutions-menu',
    'Fit for 55 ▸': 'fit55-menu',
    'Fit for 55': 'fit55',
    'CSRD & ESG ▸': 'csrd-menu',
    'CSRD & ESG': 'csrd',
    'Compliance Hub ▸': 'compliance-menu',
    'Compliance Hub': 'compliance',
    'Trust Center': 'trust-center',
    'Dual-Use & Defence (Aegis)': 'dual-use',
    Keskeytyslaskuri: 'interruption-calc',
    'Integrations ▸': 'integrations-menu',
    'All Enterprise Integrations': 'all-integrations',
    Construction: 'construction',
    Logistics: 'logistics',
    Manufacturing: 'manufacturing',
    Energy: 'energy',
    Healthcare: 'healthcare',
    'Real Estate': 'real-estate',
    'Fleet Management': 'fleet-mgmt',
    'Public Sector': 'public-sector',
    'Synthetic Data Solutions': 'synthetic-data',
    'Products ▾': 'products-menu',
    'Loading products…': 'loading',
    'View full Price List →': 'price-list',
    'Buy / Store': 'buy-store',
    'About ▾': 'about-menu',
    Team: 'team',
    'Partner Tiers ▸': 'partner-tiers',
    'Partner Program': 'partner-program',
    '📅 Book Meeting': 'book-meeting',
    'Investor ▸': 'investor',
    'Industry Captain Seats': 'captain-seats',
    'Regulatory Notice': 'regulatory-notice',
    'Lifetime Group ▸': 'lifetime-group',
    'DWS Roadmap': 'roadmap',
    Menu: 'menu-title',
    'Enterprise Offers': 'enterprise-offers',
    'Fleet Overview': 'fleet-overview',
    'Lifetime Fleet ▸': 'lifetime-fleet',
  };

  function navT(key, lang) {
    var tr = NAV_I18N[key];
    return (tr && (tr[lang] || tr.en)) || key;
  }

  function applyNavLang(lang) {
    document.querySelectorAll('[data-i18n-nav]').forEach(function (el) {
      // Only translate text-only elements; never clobber nested <img>/<svg>/<small> children
      if (el.children.length) return;
      var key = el.getAttribute('data-i18n-nav');
      var tr = NAV_I18N[key];
      if (tr && tr[lang]) el.textContent = tr[lang];
    });
  }

  function tagNavElements() {
    var header = document.querySelector('.ironclad-header');
    if (!header) return;
    header
      .querySelectorAll('a, .ironclad-mobile-title, .ironclad-products-loading')
      .forEach(function (el) {
        if (el.children.length) return;
        var text = el.textContent.trim();
        var key = NAV_TEXT_MAP[text];
        if (key && !el.getAttribute('data-i18n-nav')) {
          el.setAttribute('data-i18n-nav', key);
        }
      });
  }

  // Navigation HTML (Gamma-aligned with hamburger support)
  const navHTML = `
<!-- DWS10.com Iron Clad / Gamma Navigation v3.9 (Mobile Hamburger) -->
<header class="ironclad-header">
    <div class="ironclad-container">
        <div class="ironclad-logo-section">
            <a href="${basePath || '/'}" class="ironclad-logo-link">
                <img src="${basePath}${siteConfig.logo}" alt="${siteConfig.logoAlt}" class="ironclad-logo">
            </a>
            <span class="ironclad-title">${siteConfig.title}</span>
        </div>
        <button class="ironclad-hamburger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <nav class="ironclad-nav">
            <div class="ironclad-mobile-header">
                <span class="ironclad-mobile-title">Menu</span>
                <button class="ironclad-close" aria-label="Close menu">&times;</button>
            </div>
            <ul class="ironclad-menu">
                <!-- Home ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">Home ▾</a>
                    <ul class="ironclad-dropdown ironclad-dropdown-wide">
                        <li><a href="${contentBase}index.html" class="ironclad-primary">Main Page</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${contentBase}fit-for-55/" class="ironclad-primary">Fit for 55</a></li>
                        <li><a href="${contentBase}csrd/" class="ironclad-primary">CSRD & ESG</a></li>
                        <!-- Industries Hub — direct link (v3.6: hub page replaces flyout) -->
                        <li><a href="${contentBase}industries/" class="ironclad-primary">Industries Hub</a></li>
                        <!-- Company flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-primary">Company ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}careers/">Careers</a></li>
                                <li><a href="${contentBase}partners/">Partners</a></li>
                                <li><a href="${contentBase}captain/" style="color: #d4a843; font-weight: 600;">Industry Captains</a></li>
                                <li><a href="${contentBase}fleet-admiral/" style="color: #d4a843; font-weight: 600;">Fleet Admiral</a></li>
                                <li><a href="${contentBase}series-a/" style="color: #d4a843; font-weight: 600;">Series A</a></li>
                                <li><a href="${contentBase}investor-relations/">Investor Relations</a></li>
                                <li><a href="${contentBase}press-releases/">Press Releases</a></li>
                                <li class="ironclad-has-submenu">
                                    <a href="${contentBase}lifetime-fleet/" class="ironclad-primary">Lifetime Fleet ▸</a>
                                    <ul class="ironclad-submenu">
                                        <li><a href="${contentBase}lifetime-fleet/">Fleet Overview</a></li>
                                        <li><a href="${contentBase}lifetime-fleet/optimus-v3/">Optimus V3</a></li>
                                        <li><a href="${contentBase}lifetime-fleet/nvidia-isv/" class="ironclad-highlight">NVIDIA ISV Partner</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <!-- Legal Hub — direct link (v3.4: simplified, no flyout) -->
                        <li><a href="${contentBase}legal/" class="ironclad-legal">Legal Hub</a></li>
                    </ul>
                </li>

                <!-- Solutions ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">Solutions ▾</a>
                    <ul class="ironclad-dropdown">
                        <li class="ironclad-has-submenu">
                            <a href="${contentBase}fit-for-55/" class="ironclad-primary">Fit for 55 ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}construction/?solution=fit55">Construction</a></li>
                                <li><a href="${contentBase}logistics/?solution=fit55">Logistics</a></li>
                                <li><a href="${contentBase}manufacturing/?solution=fit55">Manufacturing</a></li>
                                <li><a href="${contentBase}energy/?solution=fit55">Energy</a></li>
                                <li><a href="${contentBase}healthcare/?solution=fit55">Healthcare</a></li>
                                <li><a href="${contentBase}real-estate/?solution=fit55">Real Estate</a></li>
                                <li><a href="${contentBase}lifetime-fleet/?solution=fit55">Fleet Management</a></li>
                                <li><a href="${contentBase}public-sector/?solution=fit55">Public Sector</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-has-submenu">
                            <a href="${contentBase}csrd/" class="ironclad-primary">CSRD & ESG ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}construction/?solution=csrd">Construction</a></li>
                                <li><a href="${contentBase}logistics/?solution=csrd">Logistics</a></li>
                                <li><a href="${contentBase}manufacturing/?solution=csrd">Manufacturing</a></li>
                                <li><a href="${contentBase}energy/?solution=csrd">Energy</a></li>
                                <li><a href="${contentBase}healthcare/?solution=csrd">Healthcare</a></li>
                                <li><a href="${contentBase}real-estate/?solution=csrd">Real Estate</a></li>
                                <li><a href="${contentBase}lifetime-fleet/?solution=csrd">Fleet Management</a></li>
                                <li><a href="${contentBase}public-sector/?solution=csrd">Public Sector</a></li>
                            </ul>
                        </li>
                        <!-- Compliance Hub (v3.8: moved from Home ▾) -->
                        <li class="ironclad-has-submenu">
                            <a href="${contentBase}compliance/" class="ironclad-primary">Compliance Hub ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}compliance/">Compliance Hub</a></li>
                                <li><a href="${contentBase}compliance/trust-center/">Trust Center</a></li>
                                <li><a href="${contentBase}dual-use/" style="color: #d4a843;">Dual-Use &amp; Defence (Aegis)</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-separator"></li>
                        <li><a href="https://lifetime.fi/firehorse-production-engine/" style="color:#f97316;font-weight:700;">🔥 Firehorse Production Engine</a></li>
                        <li><a href="${contentBase}world-model/" style="color:#8b5cf6;font-weight:700;">🧠 Lifetime World Model V1</a></li>
                        <li class="ironclad-separator"></li>
                        <li class="ironclad-has-submenu">
                            <a href="${contentBase}industries/" class="ironclad-primary">Industry Stack ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}industries/" class="ironclad-primary">Industries Hub (25)</a></li>
                                <li class="ironclad-separator"></li>
                                <li style="padding:6px 20px;color:#64748b;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Toolkit + LLM → World Model + Infrastructure</li>
                                <li><a href="${contentBase}products/dgx-spark.html">DGX Spark (On-Prem)</a></li>
                                <li><a href="${contentBase}products/situation-room.html">Situation Room</a></li>
                                <li><a href="${contentBase}products/edge-node-gn100.html">Control Room (GN100)</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-has-submenu">
                            <a href="${contentBase}enterprise-integrations/" class="ironclad-primary">Integrations ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}enterprise-integrations/" class="ironclad-primary">All Enterprise Integrations</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="${contentBase}enterprise-integrations/siemens/" class="ironclad-primary">Siemens — Building Automation</a></li>
                                <li><a href="${contentBase}enterprise-integrations/#erp">ERP (SAP, IFS, Dynamics, Monitor, Visma, Jeeves)</a></li>
                                <li><a href="${contentBase}enterprise-integrations/#industrial">Industrial Control (ABB, AspenTech)</a></li>
                                <li><a href="${contentBase}enterprise-integrations/#esg">ESG Platforms (Worldfavor, Position Green)</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="${contentBase}products/synthetic-data/" class="ironclad-primary">Synthetic Data Solutions</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="${contentBase}partners/">Partner Program</a></li>
                                <li><a href="${contentBase}aegis-partners/">Aegis Partners (Tier 1)</a></li>
                                <li><a href="${contentBase}sovereign-infra-partners/">Sovereign Infra Partners (Tier 2)</a></li>
                                <li><a href="${contentBase}connect-partners/">Connect Partners (Tier 3)</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <!-- Products ▾ (categories + items populated at runtime from config/products.json — same source as /price-list/) -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">Products ▾</a>
                    <ul class="ironclad-dropdown ironclad-dropdown-wide" id="ironclad-products-menu" data-products-menu="pending">
                        <li class="ironclad-products-loading" style="padding:10px 20px;color:#64748b;font-style:italic;">Loading products…</li>
                    </ul>
                </li>

                <!-- About ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">About ▾</a>
                    <ul class="ironclad-dropdown">
                        <li><a href="https://onelifetime.world" target="_blank">Lifetime World</a></li>
                        <li><a href="https://onelifetime.world/blog/" target="_blank" class="ironclad-primary">📰 LSJ Business Blog</a></li>
                        <li><a href="${contentBase}careers/">Careers</a></li>
                        <li class="ironclad-has-submenu">
                            <a href="${contentBase}partners/" class="ironclad-primary">Partner Tiers ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}partners/" class="ironclad-primary">Partner Program</a></li>
                                <li><a href="${contentBase}aegis-partners/">Aegis Partners (Tier 1)</a></li>
                                <li><a href="${contentBase}sovereign-infra-partners/">Sovereign Infra Partners (Tier 2)</a></li>
                                <li><a href="${contentBase}connect-partners/">Connect Partners (Tier 3)</a></li>
                            </ul>
                        </li>
                        <li><a href="${contentBase}book/" class="ironclad-highlight">📅 Book Meeting</a></li>
                        <li class="ironclad-separator"></li>
                        <!-- Investor section (Press Releases, Investor Relations, Series A, Investment Safety) -->
                        <li class="ironclad-has-submenu">
                            <a href="${contentBase}investor-relations/" class="ironclad-primary">Investor ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${contentBase}investor-relations/" class="ironclad-primary">Investor Relations</a></li>
                                <li><a href="${contentBase}press-releases/" class="ironclad-primary">Press Releases</a></li>
                                <li><a href="${contentBase}series-a/" style="color: #d4a843; font-weight: 600;">Series A</a></li>
                                <li><a href="${contentBase}fleet-admiral/" style="color: #ffd700; font-weight: 700;">⚓ Fleet Admiral</a></li>
                                <li><a href="${contentBase}captain/" style="color: #d4a843; font-weight: 600;">Industry Captain Seats</a></li>
                                <li><a href="${regulatoryNoticeHref}">Regulatory Notice</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-separator"></li>
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-highlight">Lifetime Group ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="https://lifetime.fi/" class="ironclad-highlight">Lifetime Oy</a></li>
                                <li><a href="${contentBase}lifetime-consulting/" class="ironclad-highlight">Lifetime Consulting</a></li>
                                <li><a href="${contentBase}lifetime-studios/">Lifetime Studios</a></li>
                                <li><a href="${contentBase}roadmap/">DWS Roadmap</a></li>
                            </ul>
                        </li>
                        <!-- Legal Hub — direct link (v3.4: simplified, no flyout) -->
                        <li><a href="${contentBase}legal/" class="ironclad-legal">Legal Hub</a></li>
                    </ul>
                </li>

                <!-- Language Selector -->
                <li class="ironclad-menu-item ironclad-lang-item">
                    <button class="ironclad-lang-toggle" aria-label="Select language" aria-expanded="false">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                        <span class="ironclad-lang-code">${ironcladCurrentLang.toUpperCase()}</span>
                        <span class="ironclad-lang-arrow">&#9662;</span>
                    </button>
                    <ul class="ironclad-lang-dropdown">
                        ${ironcladLanguages.map((l) => '<li><button class="ironclad-lang-option' + (l.code === ironcladCurrentLang ? ' ironclad-lang-active' : '') + '" data-lang="' + l.code + '">' + l.label + '</button></li>').join('\n                        ')}
                    </ul>
                </li>

                <!-- Book Meeting CTA -->
                <li class="ironclad-menu-item">
                    <a href="https://dws10.com/book/?service=demo" class="ironclad-cta-book" title="Book a meeting — Demo or Consultation">📅 Book Meeting</a>
                </li>
                <!-- IQ Login Button - Gamma Style -->
                <li class="ironclad-menu-item">
                    <a href="https://dws6.com/login" class="ironclad-cta" title="DWS IQ Login">IQ Login</a>
                </li>
                <li class="ironclad-menu-item ironclad-icon-item">
                    <a href="https://onelifetime.world" class="ironclad-icon-link" title="OneLifetime.World">
                        <img src="${basePath}static/images/OneLifetime_Logo_Final.png" alt="OneLifetime.World">
                    </a>
                </li>
                <li class="ironclad-menu-item ironclad-icon-item">
                    <a href="${contentBase}buy/" class="ironclad-store-link" title="Firehorse Store">
                        <img src="${basePath}static/images/Firehorse_Store.jpg" alt="Firehorse Store" class="ironclad-store-image">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</header>
`;

  // Navigation CSS
  const navCSS = `
/* ============================================
   IRONCLAD NAVIGATION - DWS10.com v3.0
   Gamma-aligned with mobile hamburger menu
   ============================================ */

.ironclad-header {
    background: #ffffff;
    color: #0a1628;
    padding: 24px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #e2e8f0;
}

.ironclad-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.ironclad-logo-section {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-shrink: 0;
}

.ironclad-logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.ironclad-logo {
    height: 64px;
    width: auto;
}

.ironclad-title {
    font-size: clamp(0.9rem, 1.5vw, 1.25rem);
    font-weight: 700;
    color: #0a1628;
}

.ironclad-nav {
    flex-grow: 0;
}

.ironclad-menu {
    display: flex;
    list-style: none;
    gap: 8px;
    align-items: center;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
}

.ironclad-menu-item {
    position: relative;
    padding: 0;
}

.ironclad-menu-item::before {
    display: none;
}

.ironclad-link {
    color: #334155;
    text-decoration: none;
    white-space: nowrap;
    font-weight: 500;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    display: block;
}

.ironclad-link:hover {
    background: #f1f5f9;
    color: #0066cc;
}

.ironclad-secondary {
    color: #7c3aed;
    font-weight: 600;
}

.ironclad-highlight {
    color: #16a34a;
    font-weight: 600;
}

.ironclad-legal {
    color: #0d7a3e;
    font-weight: 600;
}

/* Dropdown Menus */
.ironclad-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    min-width: 220px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 8px;
    padding: 8px 0;
    display: none;
    z-index: 100;
    border: 1px solid #e2e8f0;
    list-style: none;
    margin: 0;
}

.ironclad-dropdown-wide {
    min-width: 280px;
}

.ironclad-menu-item:hover > .ironclad-dropdown {
    display: block;
}

.ironclad-dropdown li {
    padding: 0;
}

.ironclad-dropdown li::before {
    display: none;
}

.ironclad-dropdown a {
    display: block;
    padding: 10px 20px;
    color: #475569;
    text-decoration: none;
    transition: all 0.2s;
}

.ironclad-dropdown a:hover {
    background: #f8fafc;
    color: #0066cc;
}

.ironclad-dropdown .ironclad-primary {
    color: #0066cc;
    font-weight: 600;
}

.ironclad-dropdown .ironclad-highlight {
    color: #059669;
    font-weight: 600;
}

.ironclad-dropdown .ironclad-secondary {
    color: #7c3aed;
    font-weight: 600;
}

.ironclad-dropdown .ironclad-legal {
    color: #0d7a3e;
    font-weight: 600;
}

.ironclad-separator {
    border-top: 1px solid #e2e8f0;
    margin: 5px 0;
}

/* Submenu */
.ironclad-has-submenu {
    position: relative;
}

.ironclad-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    background: #ffffff;
    min-width: 180px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 8px;
    padding: 8px 0;
    display: none;
    z-index: 101;
    border: 1px solid #e2e8f0;
    list-style: none;
    margin: 0;
}

.ironclad-has-submenu:hover > .ironclad-submenu {
    display: block;
}

/* CTA Button - Dark Navy (DWS Brand Standard) */
.ironclad-cta {
    background: linear-gradient(135deg, #0a1628 0%, #152238 100%);
    color: #ffffff !important;
    padding: 6px 14px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    height: 32px;
    border: 1px solid #0066cc;
    transition: all 0.3s;
}

.ironclad-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
    background: linear-gradient(135deg, #152238 0%, #1e3a5f 100%);
}

/* Book Meeting CTA - Green (matches Schedule Demo buttons) */
.ironclad-cta-book {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff !important;
    padding: 6px 14px;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    height: 32px;
    border: 1px solid #059669;
    transition: all 0.3s;
}

.ironclad-cta-book:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
}

.ironclad-icon-link,
.ironclad-store-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
}

.ironclad-active {
    background: rgba(37, 99, 235, 0.12);
    border-radius: 6px;
    padding: 6px 8px;
}

.ironclad-active img,
.ironclad-active svg {
    filter: drop-shadow(0 0 6px rgba(37, 99, 235, 0.35));
}

.ironclad-icon-link img {
    height: 32px;
    width: auto;
}

.ironclad-store-image {
    height: 32px;
    width: auto;
    border-radius: 4px;
}

/* ============================================
   LANGUAGE SELECTOR
   ============================================ */
.ironclad-lang-item {
    position: relative;
}
.ironclad-lang-toggle {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: none;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 6px 10px;
    cursor: pointer;
    color: #334155;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.2s;
    font-family: inherit;
}
.ironclad-lang-toggle:hover {
    background: #f1f5f9;
    border-color: #0066cc;
    color: #0066cc;
}
.ironclad-lang-toggle svg {
    flex-shrink: 0;
}
.ironclad-lang-code {
    font-weight: 600;
}
.ironclad-lang-arrow {
    font-size: 0.65rem;
    opacity: 0.6;
}
.ironclad-lang-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: #ffffff;
    min-width: 140px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 8px;
    padding: 6px 0;
    display: none;
    z-index: 102;
    border: 1px solid #e2e8f0;
    list-style: none;
    margin: 4px 0 0 0;
}
.ironclad-lang-item:hover > .ironclad-lang-dropdown,
.ironclad-lang-dropdown.open {
    display: block;
}
.ironclad-lang-dropdown li {
    padding: 0;
}
.ironclad-lang-dropdown li::before {
    display: none;
}
.ironclad-lang-option {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 16px;
    background: none;
    border: none;
    color: #475569;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    font-family: inherit;
}
.ironclad-lang-option:hover {
    background: #f8fafc;
    color: #0066cc;
}
.ironclad-lang-active {
    color: #0066cc;
    font-weight: 600;
    background: #eff6ff;
}

/* ============================================
   HAMBURGER BUTTON — hidden on desktop
   ============================================ */
.ironclad-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 1002;
    -webkit-tap-highlight-color: transparent;
}

.ironclad-hamburger span {
    display: block;
    width: 24px;
    height: 2.5px;
    background: #334155;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
}

.ironclad-hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}
.ironclad-hamburger.active span:nth-child(2) {
    opacity: 0;
}
.ironclad-hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* Mobile header inside slide-out panel — hidden on desktop */
.ironclad-mobile-header {
    display: none;
}

/* Close button — hidden on desktop */
.ironclad-close {
    display: none;
}

/* Backdrop overlay — hidden by default */
.ironclad-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
}
.ironclad-backdrop.active {
    display: block;
    opacity: 1;
}

/* ============================================
   MOBILE RESPONSIVE — Hamburger Menu
   ============================================ */
@media (max-width: 900px) {

    .ironclad-header {
        padding: 18px 0;
    }

    .ironclad-container {
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        gap: 12px;
    }

    .ironclad-title {
        display: none;
    }

    .ironclad-logo {
        height: 52px;
    }

    /* Show hamburger */
    .ironclad-hamburger {
        display: flex;
    }

    /* Slide-out panel */
    .ironclad-nav {
        position: fixed;
        top: 0;
        right: -320px;
        width: min(300px, 85vw);
        height: 100vh;
        height: 100dvh;
        background: #ffffff;
        z-index: 1001;
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0 0 24px 0;
        box-shadow: -4px 0 24px rgba(0,0,0,0.2);
        flex-grow: 0;
    }

    .ironclad-nav.open {
        right: 0;
    }

    /* Mobile panel header */
    .ironclad-mobile-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #e2e8f0;
        background: #f8fafc;
        position: sticky;
        top: 0;
        z-index: 10;
    }

    .ironclad-mobile-title {
        font-size: 1rem;
        font-weight: 700;
        color: #0a1628;
    }

    .ironclad-close {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-size: 1.4rem;
        color: #475569;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: all 0.2s;
    }

    .ironclad-close:hover {
        background: #e2e8f0;
        color: #0f172a;
    }

    /* Menu layout — vertical */
    .ironclad-menu {
        flex-direction: column;
        gap: 0;
        width: 100%;
        padding: 0;
        align-items: stretch;
    }

    .ironclad-menu-item {
        width: 100%;
        border-bottom: 1px solid #f1f5f9;
    }

    .ironclad-link {
        padding: 14px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 0;
        font-size: 0.95rem;
    }

    .ironclad-link:hover {
        background: transparent;
    }

    /* Dropdowns — static, collapsed by default */
    .ironclad-dropdown {
        position: static;
        display: none;
        box-shadow: none;
        border: none;
        border-radius: 0;
        padding: 0;
        min-width: 0;
        width: 100%;
        border-top: 1px solid #e2e8f0;
        background: #f8fafc;
    }

    .ironclad-dropdown-wide {
        min-width: 0;
    }

    /* Override desktop hover — only expanded class works on mobile */
    .ironclad-menu-item:hover > .ironclad-dropdown {
        display: none;
    }
    .ironclad-menu-item > .ironclad-dropdown.expanded {
        display: block !important;
    }

    .ironclad-dropdown a {
        padding: 11px 20px 11px 28px;
        font-size: 0.9rem;
    }

    /* Submenus — static, collapsed by default */
    .ironclad-submenu {
        position: static;
        display: none;
        box-shadow: none;
        border: none;
        border-radius: 0;
        padding: 0;
        min-width: 0;
        width: 100%;
        background: #f1f5f9;
    }

    .ironclad-has-submenu:hover > .ironclad-submenu {
        display: none;
    }
    .ironclad-has-submenu > .ironclad-submenu.expanded {
        display: block !important;
    }

    .ironclad-submenu a {
        padding: 10px 20px 10px 44px;
        font-size: 0.85rem;
    }

    /* Submenu toggle indicator */
    .ironclad-has-submenu > a {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    /* CTA in mobile menu */
    .ironclad-cta,
    .ironclad-cta-book {
        margin: 12px 20px;
        justify-content: center;
        height: 40px;
        font-size: 0.9rem;
    }

    /* Icon items in mobile menu */
    .ironclad-icon-item {
        border-bottom: none;
    }

    .ironclad-icon-link,
    .ironclad-store-link {
        padding: 10px 20px;
    }

    .ironclad-icon-link img {
        height: 28px;
    }

    .ironclad-store-image {
        height: 28px;
    }

    /* Language selector — mobile */
    .ironclad-lang-item {
        border-bottom: 1px solid #f1f5f9;
        width: 100%;
    }
    .ironclad-lang-toggle {
        width: 100%;
        padding: 14px 20px;
        border: none;
        border-radius: 0;
        justify-content: flex-start;
    }
    .ironclad-lang-dropdown {
        position: static;
        box-shadow: none;
        border: none;
        border-radius: 0;
        min-width: 0;
        width: 100%;
        background: #f8fafc;
        border-top: 1px solid #e2e8f0;
        margin: 0;
    }
    .ironclad-lang-item:hover > .ironclad-lang-dropdown {
        display: none;
    }
    .ironclad-lang-dropdown.open {
        display: block !important;
    }
    .ironclad-lang-option {
        padding: 11px 20px 11px 36px;
    }
}
`;

  // Inject Nordic theme CSS + IBM Plex Sans fonts (v3.2)
  const nordicThemeLink = document.createElement('link');
  nordicThemeLink.rel = 'stylesheet';
  nordicThemeLink.href = (getBasePath() || '/') + 'shared-assets/nordic-theme.css';
  document.head.appendChild(nordicThemeLink);

  const fontsLink = document.createElement('link');
  fontsLink.rel = 'stylesheet';
  fontsLink.href =
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Condensed:wght@600;700&family=IBM+Plex+Mono&display=swap';
  document.head.appendChild(fontsLink);

  // Inject CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = navCSS;
  document.head.appendChild(styleElement);

  // Inject Navigation HTML at the start of body
  document.addEventListener('DOMContentLoaded', function () {
    // Check if navigation already exists
    if (document.querySelector('.ironclad-header')) {
      return;
    }

    // Create nav element
    const navContainer = document.createElement('div');
    navContainer.innerHTML = navHTML;

    // Insert at the beginning of body
    document.body.insertBefore(navContainer.firstElementChild, document.body.firstChild);

    // Create backdrop element
    const backdrop = document.createElement('div');
    backdrop.className = 'ironclad-backdrop';
    document.body.appendChild(backdrop);

    // Highlight store link when on /buy
    const pathname = window.location.pathname || '';
    if (pathname === '/buy' || pathname === '/buy/' || pathname.endsWith('/buy/index.html')) {
      const storeLink = document.querySelector('.ironclad-store-link');
      if (storeLink) {
        storeLink.classList.add('ironclad-active');
      }
    }

    // ---- Mobile Hamburger Menu Logic ----
    const hamburger = document.querySelector('.ironclad-hamburger');
    const nav = document.querySelector('.ironclad-nav');
    const closeBtn = document.querySelector('.ironclad-close');

    function openMenu() {
      nav.classList.add('open');
      backdrop.classList.add('active');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      nav.classList.remove('open');
      backdrop.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (hamburger) {
      hamburger.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    backdrop.addEventListener('click', closeMenu);

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    // ---- Mobile tap-to-expand dropdowns and submenus ----
    const mobileQuery = window.matchMedia('(max-width: 900px)');

    function attachMobileToggles(root) {
      (root || document)
        .querySelectorAll('.ironclad-link, .ironclad-has-submenu > a')
        .forEach(function (link) {
          if (link.dataset.ironcladToggle === '1') return;
          const sibling = link.nextElementSibling;
          if (!sibling) return;
          const isDropdown = sibling.classList.contains('ironclad-dropdown');
          const isSubmenu = sibling.classList.contains('ironclad-submenu');
          if (!isDropdown && !isSubmenu) return;

          link.dataset.ironcladToggle = '1';
          link.addEventListener('click', function (e) {
            if (mobileQuery.matches) {
              e.preventDefault();
              e.stopPropagation();
              sibling.classList.toggle('expanded');
            } else if (link.getAttribute('href') === '#') {
              // Prevent hash jump on desktop for # links
              e.preventDefault();
            }
          });
        });
    }
    attachMobileToggles(document);

    // ---- Products menu — single source of truth: dws10.com/config/products.json ----
    // Same JSON the /price-list/ page consumes. Keeps nav + price list in lockstep
    // so there is exactly one product record, shared across both surfaces.
    populateProductsMenu();

    function populateProductsMenu() {
      const menu = document.getElementById('ironclad-products-menu');
      if (!menu || menu.dataset.productsMenu !== 'pending') return;

      const CATEGORY_ORDER = ['platform', 'ai-cloud', 'advisory', 'digital', 'hardware', 'add-on'];
      const CATEGORY_LABELS = {
        platform: 'Platform & Products',
        'ai-cloud': 'AI & Cloud',
        advisory: 'Expert Advisory & Training',
        digital: 'Digital Services',
        hardware: 'Sovereign Hardware',
        'add-on': 'Add-ons',
      };

      function escHtml(s) {
        return String(s == null ? '' : s)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }
      function normalizeUrl(u) {
        if (!u) return '';
        return contentBase + String(u).replace(/^(?:\.\.\/)+/, '');
      }
      function renderFailure() {
        menu.innerHTML =
          '<li><a href="' +
          contentBase +
          'buy/" class="ironclad-primary">Buy / Store</a></li>' +
          '<li><a href="' +
          priceListHref +
          '" class="ironclad-primary">View full Price List →</a></li>';
        menu.dataset.productsMenu = 'fallback';
        attachMobileToggles(menu);
      }

      fetch(contentBase + 'config/products.json', { cache: 'no-store' })
        .then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function (data) {
          const buckets = {};
          Object.values(data.products || {}).forEach(function (p) {
            if (!p || p.productType === 'archived') return;
            const c = p.storeCategory || 'other';
            (buckets[c] = buckets[c] || []).push(p);
          });
          const orderedCats = CATEGORY_ORDER.filter(function (c) {
            return buckets[c] && buckets[c].length;
          }).concat(
            Object.keys(buckets).filter(function (c) {
              return CATEGORY_ORDER.indexOf(c) === -1;
            }),
          );

          const curLang = localStorage.getItem('dws-lang') || 'en';
          const html = orderedCats
            .map(function (cat) {
              const catKey = 'cat-' + cat;
              const label = NAV_I18N[catKey] ? navT(catKey, curLang) : CATEGORY_LABELS[cat] || cat;
              const items = buckets[cat]
                .slice()
                .sort(function (a, b) {
                  return (
                    (a.buyPageOrder == null ? 999 : a.buyPageOrder) -
                      (b.buyPageOrder == null ? 999 : b.buyPageOrder) ||
                    (a.name || '').localeCompare(b.name || '')
                  );
                })
                .map(function (p) {
                  const href = normalizeUrl(p.detailsUrl) || contentBase + 'buy/';
                  return (
                    '<li><a href="' + escHtml(href) + '">' + escHtml(p.name || p.id) + '</a></li>'
                  );
                })
                .join('');
              return (
                '<li class="ironclad-has-submenu">' +
                '<a href="#" class="ironclad-primary">' +
                (NAV_I18N['cat-' + cat]
                  ? '<span data-i18n-nav="cat-' + cat + '">' + escHtml(label) + '</span>'
                  : escHtml(label)) +
                ' <small style="color:#64748b;font-weight:400;">(' +
                buckets[cat].length +
                ')</small> ▸</a>' +
                '<ul class="ironclad-submenu">' +
                items +
                '</ul>' +
                '</li>'
              );
            })
            .join('');

          menu.innerHTML =
            html +
            '<li class="ironclad-separator"></li>' +
            '<li><a href="' +
            priceListHref +
            '" class="ironclad-primary">View full Price List →</a></li>' +
            '<li><a href="' +
            contentBase +
            'buy/">Buy / Store</a></li>';
          menu.dataset.productsMenu = 'loaded';
          attachMobileToggles(menu);
          tagNavElements();
          applyNavLang(localStorage.getItem('dws-lang') || 'en');
        })
        .catch(function (e) {
          console.warn('[ironclad-nav] products.json load failed:', e && e.message);
          renderFailure();
        });
    }

    // Reset mobile state on resize to desktop
    mobileQuery.addEventListener('change', function (e) {
      if (!e.matches) {
        closeMenu();
        // Remove all expanded classes
        document
          .querySelectorAll('.ironclad-dropdown.expanded, .ironclad-submenu.expanded')
          .forEach(function (el) {
            el.classList.remove('expanded');
          });
      }
    });

    // ---- Language Selector Logic ----
    const langToggle = document.querySelector('.ironclad-lang-toggle');
    const langDropdown = document.querySelector('.ironclad-lang-dropdown');

    if (langToggle && langDropdown) {
      // Toggle dropdown on click (mobile-friendly)
      langToggle.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        const isOpen = langDropdown.classList.contains('open');
        langDropdown.classList.toggle('open');
        langToggle.setAttribute('aria-expanded', !isOpen);
      });

      // Handle language selection
      document.querySelectorAll('.ironclad-lang-option').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          const lang = btn.getAttribute('data-lang');
          localStorage.setItem('dws-lang', lang);

          // Update toggle display
          var codeEl = langToggle.querySelector('.ironclad-lang-code');
          if (codeEl) codeEl.textContent = lang.toUpperCase();

          // Update active state
          document.querySelectorAll('.ironclad-lang-option').forEach(function (b) {
            b.classList.remove('ironclad-lang-active');
          });
          btn.classList.add('ironclad-lang-active');

          // Close dropdown
          langDropdown.classList.remove('open');
          langToggle.setAttribute('aria-expanded', 'false');

          // Dispatch custom event for page-level reactions
          window.dispatchEvent(new CustomEvent('dws-lang-change', { detail: { lang: lang } }));

          // v3.3: Redirect to language subdirectory only for languages with subdirectory pages
          var LANGS_WITH_SUBDIRS = ['en', 'fi', 'sv'];
          var currentPath = window.location.pathname;
          var isHomepage =
            currentPath === '/' ||
            currentPath === '/index.html' ||
            currentPath === '/fi/' ||
            currentPath === '/fi/index.html' ||
            currentPath === '/sv/' ||
            currentPath === '/sv/index.html';
          if (
            isHomepage &&
            LANGS_WITH_SUBDIRS.includes(lang) &&
            !document.querySelector('[data-i18n]')
          ) {
            var targetPath = lang === 'en' ? '/' : '/' + lang + '/';
            if (currentPath !== targetPath && currentPath !== targetPath + 'index.html') {
              window.location.href = targetPath;
              return;
            }
          }
        });
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function (e) {
        if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
          langDropdown.classList.remove('open');
          langToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Language bar is a PAGE ELEMENT, not a nav/menu element.
    // Include /shared-assets/vertical-lang-bar.js directly on each page that needs it.

    // ---- 5-language i18n: tag and translate nav elements ----
    tagNavElements();
    applyNavLang(localStorage.getItem('dws-lang') || 'en');

    window.addEventListener('dws-lang-change', function (e) {
      var lang = e.detail && e.detail.lang;
      if (!lang) return;
      applyNavLang(lang);
      var codeEl = document.querySelector('.ironclad-lang-code');
      if (codeEl) codeEl.textContent = lang.toUpperCase();
      document.querySelectorAll('.ironclad-lang-option').forEach(function (b) {
        if (b.getAttribute('data-lang') === lang) {
          b.classList.add('ironclad-lang-active');
        } else {
          b.classList.remove('ironclad-lang-active');
        }
      });
    });

    console.log('Iron Clad / Gamma Navigation v5.0 loaded (5-language i18n)');
  });
})();
