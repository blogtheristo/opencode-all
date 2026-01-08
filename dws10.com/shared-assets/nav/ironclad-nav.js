/**
 * DWS10.com Iron Clad Navigation v1.0
 * Unified navigation bar for all pages
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

    // Navigation HTML
    const navHTML = `
<!-- DWS10.com Iron Clad Navigation Bar v1.0 -->
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
                    <a href="${basePath || '/'}" class="ironclad-link">Home ▾</a>
                    <ul class="ironclad-dropdown">
                        <li><a href="${basePath}investor-relations/">Investor Relations</a></li>
                        <li><a href="${basePath}lifetime-fleet/">Lifetime Fleet</a></li>
                        <li><a href="https://onelifetime.world" target="_blank">Lifetime World</a></li>
                        <li><a href="${basePath}careers/">Careers</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}progress-report/">Investor Progress Report</a></li>
                        <li><a href="${basePath}csrd/">CSRD Compliance</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}gamma/" class="ironclad-highlight">✨ Gamma Design Preview</a></li>
                    </ul>
                </li>
                
                <!-- Solutions ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">Solutions ▾</a>
                    <ul class="ironclad-dropdown">
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}csrd/">Fit for 55 ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}construction/?solution=fit55">Construction</a></li>
                                <li><a href="${basePath}logistics/?solution=fit55">Logistics</a></li>
                                <li><a href="${basePath}manufacturing/?solution=fit55">Manufacturing</a></li>
                                <li><a href="${basePath}energy/?solution=fit55">Energy</a></li>
                            </ul>
                        </li>
                        <li class="ironclad-has-submenu">
                            <a href="${basePath}csrd/">CSRD ▸</a>
                            <ul class="ironclad-submenu">
                                <li><a href="${basePath}construction/?solution=csrd">Construction</a></li>
                                <li><a href="${basePath}logistics/?solution=csrd">Logistics</a></li>
                                <li><a href="${basePath}manufacturing/?solution=csrd">Manufacturing</a></li>
                                <li><a href="${basePath}energy/?solution=csrd">Energy</a></li>
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
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}world-model/" class="ironclad-primary">Lifetime World Model</a></li>
                    </ul>
                </li>
                
                <!-- About ▾ -->
                <li class="ironclad-menu-item">
                    <a href="#" class="ironclad-link">About ▾</a>
                    <ul class="ironclad-dropdown">
                        <li><a href="https://onelifetime.world" target="_blank">Lifetime World</a></li>
                        <li><a href="${basePath}investor-relations/">Investor Relations</a></li>
                        <li><a href="${basePath}legal/">Legal Hub</a></li>
                        <li class="ironclad-separator"></li>
                        <li><a href="${basePath}partners/" class="ironclad-primary">🤝 Certified Partners</a></li>
                    </ul>
                </li>
                
                <!-- Client Portal Button -->
                <li class="ironclad-menu-item">
                    <a href="https://dws6.com/login" class="ironclad-cta">🔐 Client Portal</a>
                </li>
            </ul>
        </nav>
    </div>
</header>
`;

    // Navigation CSS
    const navCSS = `
/* ============================================
   IRONCLAD NAVIGATION - DWS10.com v1.0
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

/* CTA Button */
.ironclad-cta {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white !important;
    padding: 10px 18px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.ironclad-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
        
        console.log('🔒 Iron Clad Navigation v1.0 loaded');
    });
})();
