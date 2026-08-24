/**
 * DWS6.com Iron Clad Admin Navigation v1.0
 * Unified admin navigation bar with login gate + hamburger menu
 *
 * Usage: Add this script to any admin page:
 * <script src="/shared-assets/nav/ironclad-admin-nav.js" defer></script>
 *
 * The script will automatically inject navigation at the start of <body>.
 * Auth-gated items are hidden until admin session is detected.
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
<!-- DWS6.com Iron Clad Admin Navigation v1.0 -->
<header class="ic-admin-header">
    <div class="ic-admin-container">
        <div class="ic-admin-logo-section">
            <a href="${basePath || '/'}" class="ic-admin-logo-link">
                <span class="ic-admin-logo-icon">🔐</span>
                <span class="ic-admin-logo-text">DWS6 Admin</span>
            </a>
            <span class="ic-admin-badge">Administrator</span>
        </div>
        <button class="ic-admin-hamburger" aria-label="Toggle navigation menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <nav class="ic-admin-nav">
            <ul class="ic-admin-menu">
                <li class="ic-admin-menu-item">
                    <a href="${basePath}admin/" class="ic-admin-link">Portal</a>
                </li>
                <li class="ic-admin-menu-item">
                    <a href="#" class="ic-admin-link">Manage &#9662;</a>
                    <ul class="ic-admin-dropdown">
                        <li><a href="${basePath}admin/connectors/">🔗 Connectors</a></li>
                        <li><a href="${basePath}admin/users/" class="ic-admin-auth-gate">👥 Users</a></li>
                        <li><a href="${basePath}admin/security/" class="ic-admin-auth-gate">🛡️ Security</a></li>
                        <li><a href="${basePath}admin/integrations/" class="ic-admin-auth-gate">🔌 Integrations</a></li>
                        <li><a href="${basePath}admin/settings/" class="ic-admin-auth-gate">⚙️ Settings</a></li>
                    </ul>
                </li>
                <li class="ic-admin-menu-item">
                    <a href="#" class="ic-admin-link ic-admin-tools-link">Tools &#9662;</a>
                    <ul class="ic-admin-dropdown">
                        <li><a href="${basePath}admin/tools/jsonl-review/" class="ic-admin-auth-gate ic-admin-primary">📋 JSONL Session Review</a></li>
                    </ul>
                </li>
                <li class="ic-admin-menu-item">
                    <a href="#" class="ic-admin-link">Dashboards &#9662;</a>
                    <ul class="ic-admin-dropdown">
                        <li><a href="${basePath}dashboard/">📊 Main Dashboard</a></li>
                        <li><a href="https://dws10.com" target="_blank">🌐 DWS10.com</a></li>
                        <li><a href="https://onelifetime.world" target="_blank">🌍 OneLifetime</a></li>
                    </ul>
                </li>
                <li class="ic-admin-menu-item">
                    <a href="${basePath}admin/login/" class="ic-admin-cta" id="ic-admin-login-btn">🔑 Admin Login</a>
                </li>
            </ul>
        </nav>
    </div>
</header>
`;

    // Navigation CSS
    const navCSS = `
/* ============================================
   IRONCLAD ADMIN NAVIGATION - DWS6.com v1.0
   Dark enterprise admin nav with auth gate
   ============================================ */

.ic-admin-header {
    background: #0a1628;
    color: #e2e8f0;
    padding: 12px 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #1e293b;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
}

.ic-admin-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.ic-admin-logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.ic-admin-logo-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #e2e8f0;
}

.ic-admin-logo-icon {
    font-size: 1.4rem;
}

.ic-admin-logo-text {
    font-size: 1.15rem;
    font-weight: 700;
    color: #f8fafc;
}

.ic-admin-badge {
    background: #dc2626;
    color: #fff;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Hamburger */
.ic-admin-hamburger {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    min-height: 44px;
    min-width: 44px;
    align-items: center;
    justify-content: center;
    z-index: 1001;
}

.ic-admin-hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: #e2e8f0;
    margin: 5px 0;
    transition: all 0.3s ease;
    border-radius: 2px;
}

.ic-admin-hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}
.ic-admin-hamburger.active span:nth-child(2) {
    opacity: 0;
}
.ic-admin-hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
}

/* Navigation */
.ic-admin-nav {
    flex-grow: 0;
}

.ic-admin-menu {
    display: flex;
    list-style: none;
    gap: 4px;
    align-items: center;
    margin: 0;
    padding: 0;
}

.ic-admin-menu-item {
    position: relative;
    padding: 0;
}

.ic-admin-menu-item::before {
    display: none;
}

.ic-admin-link {
    color: #94a3b8;
    text-decoration: none;
    white-space: nowrap;
    font-weight: 500;
    font-size: 0.875rem;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    display: block;
}

.ic-admin-link:hover {
    color: #e2e8f0;
    background: #1e293b;
}

.ic-admin-tools-link {
    color: #8b5cf6;
    font-weight: 600;
}

.ic-admin-tools-link:hover {
    color: #a78bfa;
}

/* Dropdown */
.ic-admin-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: #152238;
    min-width: 240px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    border-radius: 8px;
    padding: 6px 0;
    display: none;
    z-index: 100;
    border: 1px solid #1e293b;
    list-style: none;
    margin: 0;
}

.ic-admin-menu-item:hover > .ic-admin-dropdown {
    display: block;
}

.ic-admin-dropdown li {
    padding: 0;
}

.ic-admin-dropdown li::before {
    display: none;
}

.ic-admin-dropdown a {
    display: block;
    padding: 10px 18px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.85rem;
    transition: all 0.2s;
}

.ic-admin-dropdown a:hover {
    background: #1e293b;
    color: #e2e8f0;
}

.ic-admin-dropdown .ic-admin-primary {
    color: #8b5cf6;
    font-weight: 600;
}

.ic-admin-dropdown .ic-admin-primary:hover {
    color: #a78bfa;
}

/* Auth-gated items (hidden by default) */
.ic-admin-auth-gate {
    opacity: 0.4;
    pointer-events: none;
    position: relative;
}

.ic-admin-auth-gate::after {
    content: '🔒';
    margin-left: 6px;
    font-size: 0.7rem;
}

/* When authenticated, reveal auth-gated items */
.ic-admin-header.authenticated .ic-admin-auth-gate {
    opacity: 1;
    pointer-events: auto;
}

.ic-admin-header.authenticated .ic-admin-auth-gate::after {
    display: none;
}

/* Hide login button when authenticated */
.ic-admin-header.authenticated #ic-admin-login-btn {
    display: none;
}

/* CTA Button */
.ic-admin-cta {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    color: #ffffff !important;
    padding: 6px 14px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.82rem;
    display: inline-flex;
    align-items: center;
    height: 32px;
    border: 1px solid rgba(220, 38, 38, 0.5);
    transition: all 0.3s;
    white-space: nowrap;
}

.ic-admin-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .ic-admin-hamburger {
        display: inline-flex;
    }

    .ic-admin-nav {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #0a1628;
        border-top: 1px solid #1e293b;
        box-shadow: 0 8px 16px rgba(0,0,0,0.4);
        z-index: 999;
    }

    .ic-admin-nav.open {
        display: block;
    }

    .ic-admin-menu {
        flex-direction: column;
        align-items: stretch;
        padding: 12px 16px;
        gap: 2px;
    }

    .ic-admin-dropdown {
        position: static;
        box-shadow: none;
        border: none;
        background: #0f1d32;
        padding-left: 16px;
        border-radius: 0;
    }

    .ic-admin-menu-item:hover > .ic-admin-dropdown {
        display: block;
    }

    .ic-admin-cta {
        text-align: center;
        justify-content: center;
        width: 100%;
        margin-top: 8px;
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
        if (document.querySelector('.ic-admin-header')) return;

        // Create nav element
        const navContainer = document.createElement('div');
        navContainer.innerHTML = navHTML;

        // Insert at the beginning of body
        document.body.insertBefore(navContainer.firstElementChild, document.body.firstChild);

        // Hamburger toggle
        const hamburger = document.querySelector('.ic-admin-hamburger');
        const nav = document.querySelector('.ic-admin-nav');
        if (hamburger && nav) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                nav.classList.toggle('open');
                hamburger.setAttribute('aria-expanded', nav.classList.contains('open'));
            });

            // Close on outside click
            document.addEventListener('click', function(e) {
                if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
                    hamburger.classList.remove('active');
                    nav.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Auth gate: check for Supabase session
        checkAdminAuth();

        console.log('🔒 Iron Clad Admin Navigation v1.0 loaded');
    });

    // Check admin auth status and unlock gated items
    async function checkAdminAuth() {
        const header = document.querySelector('.ic-admin-header');
        if (!header) return;

        try {
            // Try to detect Supabase session from localStorage
            const keys = Object.keys(localStorage);
            const sbKey = keys.find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
            if (sbKey) {
                const data = JSON.parse(localStorage.getItem(sbKey));
                if (data && data.access_token) {
                    header.classList.add('authenticated');
                    return;
                }
            }

            // Fallback: check sessionStorage for admin flag
            if (sessionStorage.getItem('dws6_admin_auth') === 'true') {
                header.classList.add('authenticated');
            }
        } catch (e) {
            // Silent fail — stay locked
        }
    }
})();
