/**
 * DWS Gamma Hamburger Menu v1.0
 * Single source of truth for mobile hamburger navigation across all DWS pages.
 *
 * Usage: Add this script to any page with .nav-header > .nav-links:
 * <script src="/shared-assets/nav/hamburger-menu.js"></script>
 *
 * The script will automatically:
 * 1. Inject required CSS for hamburger toggle and mobile nav
 * 2. Insert the hamburger button into .nav-header
 * 3. Wire up toggle behavior with ARIA accessibility
 *
 * DWS Gamma Brand Specs:
 * - 48px minimum touch target (WCAG 2.2 AAA)
 * - 3-bar icon with animated X transition
 * - Full-width slide-down mobile menu
 * - Breakpoint: 768px
 * - Colors: #e2e8f0 bars, #1e293b menu background
 */

(function() {
    'use strict';

    // Inject CSS (only once)
    if (!document.getElementById('dws-hamburger-css')) {
        var style = document.createElement('style');
        style.id = 'dws-hamburger-css';
        style.textContent = [
            '/* DWS Gamma Hamburger Menu v1.0 */',
            '.hamburger-toggle { display: none; background: none; border: none; cursor: pointer; padding: 8px; min-height: 48px; min-width: 48px; align-items: center; justify-content: center; z-index: 101; }',
            '.hamburger-toggle span { display: block; width: 24px; height: 2px; background: #e2e8f0; margin: 5px 0; transition: all 0.3s ease; border-radius: 2px; }',
            '.hamburger-toggle.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }',
            '.hamburger-toggle.active span:nth-child(2) { opacity: 0; }',
            '.hamburger-toggle.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }',
            '@media (max-width: 768px) {',
            '  .hamburger-toggle { display: inline-flex; }',
            '  .nav-header { position: relative; }',
            '  .nav-links { display: none; position: absolute; top: 100%; left: 0; right: 0; background: #1e293b; flex-direction: column; padding: 16px 20px; gap: 16px; border-bottom: 1px solid #334155; box-shadow: 0 8px 16px rgba(0,0,0,0.3); z-index: 100; }',
            '  .nav-links.open { display: flex; }',
            '  .nav-links a { padding: 8px 0; }',
            '  .nav-links .btn-primary { text-align: center; padding: 12px 16px !important; }',
            '  .nav-links .nav-dropdown { width: 100%; }',
            '  .nav-dropdown-content { position: static; box-shadow: none; border: none; margin-top: 4px; padding-left: 16px; }',
            '}'
        ].join('\n');
        document.head.appendChild(style);
    }

    function init() {
        var navHeader = document.querySelector('.nav-header');
        var navLinks = document.querySelector('.nav-links');
        if (!navHeader || !navLinks) return;

        // Don't double-init
        if (navHeader.querySelector('.hamburger-toggle')) return;

        // Create hamburger button
        var btn = document.createElement('button');
        btn.className = 'hamburger-toggle';
        btn.setAttribute('aria-label', 'Toggle navigation menu');
        btn.setAttribute('aria-expanded', 'false');
        btn.innerHTML = '<span></span><span></span><span></span>';

        // Insert before nav-links
        navHeader.insertBefore(btn, navLinks);

        // Toggle behavior
        btn.addEventListener('click', function() {
            btn.classList.toggle('active');
            navLinks.classList.toggle('open');
            btn.setAttribute('aria-expanded', navLinks.classList.contains('open'));
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                btn.classList.remove('active');
                navLinks.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', function(e) {
            if (!navHeader.contains(e.target)) {
                btn.classList.remove('active');
                navLinks.classList.remove('open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Init when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
