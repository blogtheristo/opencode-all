/**
 * DWS10.com Iron Clad / Gamma Navigation v2.0
 * Unified navigation bar for all pages (Gamma-aligned with comprehensive Home menu)
 *
 * Usage: Add this script to any page:
 * <script src="/shared-assets/nav/ironclad-nav.js"></script>
 *
 * The script will automatically inject the navigation at the start of <body>
 */

(function() {
    'use strict';

    // Determine base path based on current location
    const getBasePath = () => {
        const path = window.location.pathname;
        const depth = (path.match(/\//g) || []).length - 1;
        if (depth === 0 || path === '/' || path === '/index.html') return '';
        return '../'.repeat(depth);
    };

    const basePath = getBasePath();

    // Navigation HTML (Gamma-aligned)
    const navHTML = `
<!-- DWS10.com Iron Clad / Gamma Navigation v2.0 (Gamma-aligned with Home menu) -->
<header class="ironclad-header">
    <div class="ironclad-container">
        <div class="ironclad-logo-section">
            <a href="${basePath || '/'}" class="ironclad-logo-link">
                <img src="${basePath}DWS_IQ2026.png" alt="DWS IQ Platform" class="ironclad-logo">
            </a>
            <span class="ironclad-title">DWS IQ Platform Version 6</span>
        </div>
        <nav class="ironclad-nav">
            <ul class="ironclad-menu">
                <!-- Home ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">Home ▾</a>
                    <ul class="ironclad-dropdown ironclad-dropdown-wide">
                        <li><a href="${basePath}index.html" class="ironclad-primary">🏠 Main Page</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}fit-for-55/" class="ironclad-primary">Fit for 55</a></li>
                        <li><a href="${basePath}csrd/" class="ironclad-primary">CSRD & ESG</a></li>
                        <!-- Industries flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-primary">🏭 Industries ▸</a>
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
                            <a href="#" class="ironclad-primary">🛠️ Tools ▸</a>
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
                            <a href="#" class="ironclad-primary">🏢 Company ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}careers/">Careers</a></li>
                                <li><a href="${basePath}partners/">Partners</a></li>
                                <li><a href="${basePath}investor-relations/">Investor Relations</a></li>
                                <li><a href="${basePath}lifetime-consulting/">Lifetime Consulting</a></li>
                                <li><a href="${basePath}lifetime-studios/">Lifetime Studios</a></li>
                                <li><a href="${basePath}lifetime-fleet/">Lifetime Fleet</a></li>
                            </ul>
                        </li>
                        <!-- Designs flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-secondary">🎨 Designs ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}gamma/" class="ironclad-primary">🏢 Gamma (Current)</a></li>
                                <li><a href="${basePath}theta/">🤖 Theta</a></li>
                                <li><a href="${basePath}ultra/" class="ironclad-secondary">✨ Ultra</a></li>
                                <li><a href="${basePath}industrial-preview/" class="ironclad-secondary">🏭 Ultra II - Industrial</a></li>
                            </ul>
                        </li>
                        <!-- Legal & Compliance flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}legal/" class="ironclad-legal">⚖️ Legal ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}legal/" class="ironclad-legal">⭐ Legal Hub</a></li>
                                <li><a href="${basePath}terms/">Terms of Service</a></li>
                                <li><a href="${basePath}terms-dws-iq/">DWS IQ Terms</a></li>
                                <li><a href="${basePath}terms-firehorse/">Firehorse Terms</a></li>
                                <li><a href="${basePath}terms-lifetime-fleet/">Fleet Terms</a></li>
                                <li><a href="${basePath}terms-professional/">Professional Services</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="${basePath}privacy-policy/">Privacy Policy</a></li>
                                <li><a href="${basePath}return-policy/">Return Policy</a></li>
                                <li><a href="${basePath}investment-safety/">Investment Security</a></li>
                                <li><a href="${basePath}regulatory-notice/">Regulatory Notice</a></li>
                                <li><a href="${basePath}data-handling-policy/">Data Handling Policy</a></li>
                                <li><a href="${basePath}data-security-policy/">Data Security Policy</a></li>
                            </ul>
                        </li>
                        <!-- Compliance flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}compliance/" class="ironclad-primary">🔒 Compliance ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}compliance/">Compliance Hub</a></li>
                                <li><a href="${basePath}compliance/trust-center/">Trust Center</a></li>
                                <li><a href="${basePath}dual-use/">Dual-Use Policy</a></li>
                            </ul>
                        </li>
                        <!-- Other Pages flyout -->
                        <li class="ironclad-has-submenu">
                            <a href="#" style="color: #64748b;">📄 Other ▸</a>
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
                        <li><a href="${basePath}products/firehorse-automation.html">Firehorse Automation</a></li>
                        <li><a href="${basePath}products/firehorse-omnichannel.html">Firehorse Omnichannel Next</a></li>
                        <li><a href="${basePath}products/expert-services.html">Workshop 3 Days – Expert Advisory & Implementation</a></li>
                        <li><a href="${basePath}products/expert-advisory.html">Expert Advisory & Implementation (Monthly)</a></li>
                        <li><a href="${basePath}products/consulting-fit55.html">Consulting Fit for 55 Specialist</a></li>
                        <li><a href="${basePath}products/firehorse-reports.html">Firehorse Report – Fit for 55 Template & Dashboard</a></li>
                        <li><a href="${basePath}products/consulting.html">Consulting – Hourly Rate</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}products/ai-consulting.html" class="ironclad-primary">AI Consulting – Agentic Development</a></li>
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
                        <li><a href="${basePath}partners/" class="ironclad-primary">🤝 Certified Partners</a></li>
                        <li><a href="${basePath}investor-relations/">Investor Relations</a></li>
                        <li><a href="${basePath}contact/">Contact</a></li>
                        <li class="ironclad-separator"></li>
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-highlight">🏢 Lifetime Group ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}lifetime-consulting/" class="ironclad-highlight">🚀 DWS Product Family Vision</a></li>
                                <li><a href="${basePath}lifetime-studios/">🎬 Lifetime Studios</a></li>
                                <li><a href="${basePath}roadmap/">🗺️ DWS Roadmap</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-has-submenu">
                            <a href="#" class="ironclad-secondary">🎨 Designs ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}theta/" class="ironclad-secondary">🤖 Theta</a></li>
                                <li><a href="${basePath}gamma/" class="ironclad-primary">🏢 Gamma</a></li>
                                <li><a href="${basePath}ultra/" class="ironclad-secondary">✨ Ultra</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}legal/" class="ironclad-legal">⚖️ Legal ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}legal/" class="ironclad-legal">⭐ Legal Hub</a></li>
                                <li><a href="${basePath}investment-safety/">Investment Security</a></li>
                                <li><a href="${basePath}regulatory-notice/">Regulatory Notice</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="${basePath}terms/">Terms of Service</a></li>
                                <li><a href="${basePath}terms-dws-iq/">DWS IQ Terms</a></li>
                                <li><a href="${basePath}terms-firehorse/">Firehorse Terms</a></li>
                                <li><a href="${basePath}terms-lifetime-fleet/">Fleet Terms</a></li>
                                <li><a href="${basePath}terms-professional/">Professional Services</a></li>
                                <li class="ironclad-separator"></li>
                                <li><a href="${basePath}privacy-policy/">Privacy Policy</a></li>
                                <li><a href="${basePath}return-policy/">Return Policy</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>

                <!-- IQ Login Button - Gamma Style -->
                <li class="ironclad-menu-item">
                    <a href="https://dws6.com/login" class="ironclad-cta" title="DWS IQ Login">🔐 IQ Login</a>
                </li>
                <li class="ironclad-menu-item">
                    <a href="https://onelifetime.world" class="ironclad-icon-link" title="OneLifetime.World">
                        <img src="${basePath}static/images/OneLifetime_Logo_Final.png" alt="OneLifetime.World">
                    </a>
                </li>
                <li class="ironclad-menu-item">
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
   IRONCLAD NAVIGATION - DWS10.com v1.1 (Gamma-aligned)
   Consistent navigation across all pages
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
    flex-wrap: wrap;
    gap: 20px;
}

.ironclad-logo-section {
    display: flex;
    align-items: center;
    gap: 15px;
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

/* Mobile Responsive */
@media (max-width: 900px) {
    .ironclad-container {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .ironclad-menu {
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
    }
    
    .ironclad-dropdown {
        position: static;
        box-shadow: none;
        border: none;
        padding-left: 20px;
    }
}
`;

    // Inject CSS
    const styleElement = document.createElement('style');
    styleElement.textContent = navCSS;
    document.head.appendChild(styleElement);

    // Inject Navigation HTML at the start of body
    document.addEventListener('DOMContentLoaded', function() {
        // Check if navigation already exists
        if (document.querySelector('.ironclad-header')) {
            return;
        }
        
        // Create nav element
        const navContainer = document.createElement('div');
        navContainer.innerHTML = navHTML;
        
        // Insert at the beginning of body
        document.body.insertBefore(navContainer.firstElementChild, document.body.firstChild);

        // Highlight store link when on /buy
        const pathname = window.location.pathname || '';
        if (pathname === '/buy' || pathname === '/buy/' || pathname.endsWith('/buy/index.html')) {
            const storeLink = document.querySelector('.ironclad-store-link');
            if (storeLink) {
                storeLink.classList.add('ironclad-active');
            }
        }
        
        console.log('🔒 Iron Clad / Gamma Navigation v1.1 loaded');
    });
})();
