/**
 * DWS10.com Iron Clad / Gamma Navigation v3.0
 * Unified navigation bar for all pages (Gamma-aligned with mobile hamburger menu)
 *
 * Usage: Add this script to any page:
 * <script src="/shared-assets/nav/ironclad-nav.js"></script>
 *
 * v3.0 — Mobile hamburger menu (slide-out panel, tap-to-expand submenus)
 * v2.0 — Comprehensive Home menu with flyouts
 * v1.1 — Initial Gamma-aligned release
 *
 * The script will automatically inject the navigation at the start of <body>
 */

(function () {
  'use strict';

  // Determine base path based on current location
  const getBasePath = () => {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    if (depth === 0 || path === '/' || path === '/index.html') return '';
    return '../'.repeat(depth);
  };

  const basePath = getBasePath();

  // Navigation HTML (Gamma-aligned with hamburger support)
  const navHTML = `
<!-- DWS10.com Iron Clad / Gamma Navigation v3.0 (Mobile Hamburger) -->
<header class="ironclad-header">
    <div class="ironclad-container">
        <div class="ironclad-logo-section">
            <a href="${basePath || '/'}" class="ironclad-logo-link">
                <img src="${basePath}DWS_IQ2026.png" alt="DWS IQ Platform" class="ironclad-logo">
            </a>
            <span class="ironclad-title">DWS IQ Platform Version 6</span>
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
                        <li><a href="${basePath}index.html" class="ironclad-primary">Main Page</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}fit-for-55/" class="ironclad-primary">Fit for 55</a></li>
                        <li><a href="${basePath}csrd/" class="ironclad-primary">CSRD & ESG</a></li>
                        <!-- Industries flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-primary">Industries ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}construction/">Construction</a></li>
                                <li><a href="${basePath}logistics/">Logistics</a></li>
                                <li><a href="${basePath}manufacturing/">Manufacturing</a></li>
                                <li><a href="${basePath}energy/">Energy</a></li>
                                <li><a href="${basePath}healthcare/">Healthcare</a></li>
                                <li><a href="${basePath}real-estate/">Real Estate</a></li>
                                <li><a href="${basePath}financial-services/">Financial Services</a></li>
                                <li><a href="${basePath}public-sector/">Public Sector</a></li>
                                <li><a href="${basePath}mining/">Mining</a></li>
                                <li><a href="${basePath}shipbuilding/">Shipbuilding</a></li>
                                <li><a href="${basePath}waste/">Waste Management</a></li>
                            </ul>
                        </li>
                        <!-- Products/Tools flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-primary">Tools ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}calculator/">Calculator</a></li>
                                <li><a href="${basePath}dashboard/">Dashboard</a></li>
                                <li><a href="${basePath}buy/">Buy/Store</a></li>
                                <li><a href="${basePath}checkout/">Checkout</a></li>
                                <li><a href="${basePath}world-model/">World Model</a></li>
                            </ul>
                        </li>
                        <!-- Company flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-primary">Company ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}careers/">Careers</a></li>
                                <li><a href="${basePath}partners/">Partners</a></li>
                                <li><a href="${basePath}investor-relations/">Investor Relations</a></li>
                                <li><a href="${basePath}lifetime-consulting/">Lifetime Consulting</a></li>
                                <li><a href="${basePath}lifetime-studios/">Lifetime Studios</a></li>
                                <li><a href="${basePath}lifetime-fleet/">Lifetime Fleet</a></li>
                            </ul>
                        </li>
                        <!-- Legal & Compliance flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}legal/" class="ironclad-legal">Legal ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}legal/" class="ironclad-legal">Legal Hub</a></li>
                                <li><a href="${basePath}terms/">Terms of Service</a></li>
                                <li><a href="${basePath}terms-dws-iq/">DWS IQ Terms</a></li>
                                <li><a href="${basePath}terms-firehorse/">Firehorse Terms</a></li>
                                <li><a href="${basePath}terms-lifetime-fleet/">Fleet Terms</a></li>
                                <li><a href="${basePath}terms-professional/">Professional Services</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="https://dws10.com/privacy-policy/">Privacy Policy</a></li>
                                <li><a href="${basePath}return-policy/">Return Policy</a></li>
                                <li><a href="${basePath}investment-safety/">Investment Security</a></li>
                                <li><a href="${basePath}regulatory-notice/">Regulatory Notice</a></li>
                                <li><a href="${basePath}data-handling-policy/">Data Handling Policy</a></li>
                                <li><a href="${basePath}data-security-policy/">Data Security Policy</a></li>
                            </ul>
                        </li>
                        <!-- Compliance flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}compliance/" class="ironclad-primary">Compliance ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}compliance/">Compliance Hub</a></li>
                                <li><a href="${basePath}compliance/trust-center/">Trust Center</a></li>
                                <li><a href="${basePath}dual-use/">Dual-Use Policy</a></li>
                            </ul>
                        </li>
                        <!-- Other Pages flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" style="color: #64748b;">Other ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}architecture/">Architecture</a></li>
                                <li><a href="${basePath}progress-report/">Progress Report</a></li>
                                <li><a href="${basePath}week-50/">Week 50 Update</a></li>
                                <li><a href="${basePath}week-51/">Week 51 Update</a></li>
                                <li><a href="${basePath}dashboard/login/">Dashboard Login</a></li>
                                <li><a href="${basePath}checkout/success/">Checkout Success</a></li>
                                <li><a href="${basePath}checkout/cancel/">Checkout Cancel</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <!-- Solutions ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">Solutions ▾</a>
                    <ul class="ironclad-dropdown">
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}fit-for-55/" class="ironclad-primary">Fit for 55 ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}construction/?solution=fit55">Construction</a></li>
                                <li><a href="${basePath}logistics/?solution=fit55">Logistics</a></li>
                                <li><a href="${basePath}manufacturing/?solution=fit55">Manufacturing</a></li>
                                <li><a href="${basePath}energy/?solution=fit55">Energy</a></li>
                                <li><a href="${basePath}healthcare/?solution=fit55">Healthcare</a></li>
                                <li><a href="${basePath}real-estate/?solution=fit55">Real Estate</a></li>
                                <li><a href="${basePath}lifetime-fleet/?solution=fit55">Fleet Management</a></li>
                                <li><a href="${basePath}public-sector/?solution=fit55">Public Sector</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}csrd/" class="ironclad-primary">CSRD & ESG ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}construction/?solution=csrd">Construction</a></li>
                                <li><a href="${basePath}logistics/?solution=csrd">Logistics</a></li>
                                <li><a href="${basePath}manufacturing/?solution=csrd">Manufacturing</a></li>
                                <li><a href="${basePath}energy/?solution=csrd">Energy</a></li>
                                <li><a href="${basePath}healthcare/?solution=csrd">Healthcare</a></li>
                                <li><a href="${basePath}real-estate/?solution=csrd">Real Estate</a></li>
                                <li><a href="${basePath}lifetime-fleet/?solution=csrd">Fleet Management</a></li>
                                <li><a href="${basePath}public-sector/?solution=csrd">Public Sector</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <!-- Products ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">Products ▾</a>
                    <ul class="ironclad-dropdown ironclad-dropdown-wide">
                        <li><a href="${basePath}products/dwsiq.html" class="ironclad-primary">DWS IQ Platform v6</a></li>
                        <li><a href="${basePath}products/bundle.html">Climate Reporting Bundle</a></li>
                        <li><a href="${basePath}products/firehorse-amplify.html">Firehorse Amplify</a></li>
                        <li><a href="${basePath}products/firehorse-omnichannel.html">Firehorse Omnichannel Next</a></li>
                        <li><a href="${basePath}products/expert-services.html">Workshop 3 Days</a></li>
                        <li><a href="${basePath}products/expert-advisory.html">Expert Advisory (Monthly)</a></li>
                        <li><a href="${basePath}products/consulting-fit55.html">Consulting Fit for 55</a></li>
                        <li><a href="${basePath}products/firehorse-reports.html">Firehorse Report</a></li>
                        <li><a href="${basePath}products/consulting.html">Consulting – Hourly</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}products/ai-consulting.html" class="ironclad-primary">AI Consulting – Agentic</a></li>
                        <li><a href="${basePath}products/sovereignty-cloud-consulting.html" class="ironclad-primary">Sovereignty Cloud Consulting</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}world-model/" class="ironclad-primary">Lifetime World Model</a></li>
                    </ul>
                </li>

                <!-- About ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">About ▾</a>
                    <ul class="ironclad-dropdown">
                        <li><a href="https://onelifetime.world" target="_blank">Lifetime World</a></li>
                        <li><a href="${basePath}team/">Team</a></li>
                        <li><a href="${basePath}careers/">Careers</a></li>
                        <li><a href="${basePath}partners/" class="ironclad-primary">Certified Partners</a></li>
                        <li><a href="${basePath}investor-relations/">Investor Relations</a></li>
                        <li><a href="${basePath}press-releases/">Press Releases</a></li>
                        <li><a href="${basePath}contact/">Contact</a></li>
                        <li class="ironclad-separator"></li>
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-highlight">Lifetime Group ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}lifetime-consulting/" class="ironclad-highlight">DWS Product Family Vision</a></li>
                                <li><a href="${basePath}lifetime-studios/">Lifetime Studios</a></li>
                                <li><a href="${basePath}roadmap/">DWS Roadmap</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}legal/" class="ironclad-legal">Legal ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}legal/" class="ironclad-legal">Legal Hub</a></li>
                                <li><a href="${basePath}investment-safety/">Investment Security</a></li>
                                <li><a href="${basePath}regulatory-notice/">Regulatory Notice</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="${basePath}terms/">Terms of Service</a></li>
                                <li><a href="${basePath}terms-dws-iq/">DWS IQ Terms</a></li>
                                <li><a href="${basePath}terms-firehorse/">Firehorse Terms</a></li>
                                <li><a href="${basePath}terms-lifetime-fleet/">Fleet Terms</a></li>
                                <li><a href="${basePath}terms-professional/">Professional Services</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="https://dws10.com/privacy-policy/">Privacy Policy</a></li>
                                <li><a href="${basePath}return-policy/">Return Policy</a></li>
                            </ul>
                        </li>
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
                    <a href="${basePath}buy/" class="ironclad-store-link" title="Firehorse Store">
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
    padding: 15px 0;
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
    height: 50px;
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
        padding: 10px 0;
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
        height: 36px;
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
}
`;

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

    // Find all links that have a dropdown or submenu as next sibling
    document.querySelectorAll('.ironclad-link, .ironclad-has-submenu > a').forEach(function (link) {
      const sibling = link.nextElementSibling;
      if (!sibling) return;
      const isDropdown = sibling.classList.contains('ironclad-dropdown');
      const isSubmenu = sibling.classList.contains('ironclad-submenu');
      if (!isDropdown && !isSubmenu) return;

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

    console.log('Iron Clad / Gamma Navigation v3.0 loaded (mobile hamburger ready)');
  });
})();
