/**
 * Shared Navigation Component JavaScript
 * Version: 1.0
 *
 * Handles navigation functionality including:
 * - Mobile menu toggle
 * - Dropdown menus
 * - Active page highlighting
 * - Keyboard navigation
 * - Logo variant selection
 */

(function() {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    variant: 'dws-iq',
    activePage: '',
    logoPath: '/static/images/logos/'
  };

  // Logo configurations
  const LOGOS = {
    'dws-iq': {
      src: 'DWS_IQ2026.png',
      alt: 'DWS IQ Platform - Enterprise Resource Intelligence'
    },
    'onelifetime': {
      src: 'OneLifetime+Logo.png',
      alt: 'OneLifetime.World - Community & Partners'
    }
  };

  // Initialize navigation when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
  } else {
    initNavigation();
  }

  function initNavigation() {
    // Merge user config with defaults
    const config = {
      ...DEFAULT_CONFIG,
      ...(window.NAV_CONFIG || {})
    };

    // Find navigation container
    const container = document.getElementById('main-navigation');
    if (!container) {
      console.error('Navigation container #main-navigation not found');
      return;
    }

    // Clone template
    const template = document.getElementById('navigation-template');
    if (!template) {
      console.error('Navigation template not found');
      return;
    }

    const navContent = template.content.cloneNode(true);
    container.appendChild(navContent);

    // Setup logo
    setupLogo(config);

    // Setup mobile menu
    setupMobileMenu();

    // Setup dropdown menus
    setupDropdowns();

    // Setup keyboard navigation
    setupKeyboardNavigation();

    // Highlight active page
    highlightActivePage(config.activePage);

    // Setup analytics tracking
    setupAnalytics();
  }

  function setupLogo(config) {
    const logoImg = document.getElementById('nav-logo-img');
    if (!logoImg) return;

    const logoConfig = LOGOS[config.variant] || LOGOS['dws-iq'];

    // Determine logo path
    let logoSrc = logoConfig.src;

    // Check if we're on dws10.com or onelifetime.world
    if (window.location.hostname.includes('onelifetime')) {
      logoSrc = '/' + logoConfig.src;
    } else {
      // For dws10.com, check if logo exists in root or static folder
      logoSrc = logoConfig.src.startsWith('DWS') ? '/' + logoConfig.src : '/static/images/' + logoConfig.src;
    }

    logoImg.src = logoSrc;
    logoImg.alt = logoConfig.alt;
  }

  function setupMobileMenu() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!toggleButton || !navMenu) return;

    toggleButton.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('mobile-open');

      // Prevent body scroll when menu is open
      if (!isExpanded) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!toggleButton.contains(e.target) && !navMenu.contains(e.target)) {
        toggleButton.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile-open');
        document.body.style.overflow = '';
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('mobile-open')) {
        toggleButton.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile-open');
        document.body.style.overflow = '';
        toggleButton.focus();
      }
    });
  }

  function setupDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    dropdownToggles.forEach(toggle => {
      // Click handler for mobile
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const isExpanded = this.getAttribute('aria-expanded') === 'true';

        // Close other dropdowns
        dropdownToggles.forEach(other => {
          if (other !== this) {
            other.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle this dropdown
        this.setAttribute('aria-expanded', !isExpanded);
      });

      // Hover handler for desktop (with delay to prevent accidental triggers)
      let hoverTimeout;
      const parentItem = toggle.closest('.has-dropdown');

      if (window.matchMedia('(min-width: 1024px)').matches) {
        parentItem.addEventListener('mouseenter', function() {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            toggle.setAttribute('aria-expanded', 'true');
          }, 150);
        });

        parentItem.addEventListener('mouseleave', function() {
          clearTimeout(hoverTimeout);
          hoverTimeout = setTimeout(() => {
            toggle.setAttribute('aria-expanded', 'false');
          }, 150);
        });
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.has-dropdown')) {
        dropdownToggles.forEach(toggle => {
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  }

  function setupKeyboardNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .dropdown-link');

    navLinks.forEach((link, index) => {
      link.addEventListener('keydown', function(e) {
        let targetLink;

        switch(e.key) {
          case 'ArrowDown':
            e.preventDefault();
            targetLink = navLinks[index + 1];
            if (targetLink) targetLink.focus();
            break;

          case 'ArrowUp':
            e.preventDefault();
            targetLink = navLinks[index - 1];
            if (targetLink) targetLink.focus();
            break;

          case 'ArrowRight':
            e.preventDefault();
            // Find next main nav item
            const nextParent = this.closest('.nav-item')?.nextElementSibling;
            if (nextParent) {
              const nextLink = nextParent.querySelector('.nav-link');
              if (nextLink) nextLink.focus();
            }
            break;

          case 'ArrowLeft':
            e.preventDefault();
            // Find previous main nav item
            const prevParent = this.closest('.nav-item')?.previousElementSibling;
            if (prevParent) {
              const prevLink = prevParent.querySelector('.nav-link');
              if (prevLink) prevLink.focus();
            }
            break;

          case 'Escape':
            // Close dropdown and return to toggle
            const toggle = this.closest('.has-dropdown')?.querySelector('.dropdown-toggle');
            if (toggle) {
              toggle.setAttribute('aria-expanded', 'false');
              toggle.focus();
            }
            break;

          case 'Enter':
          case ' ':
            // If it's a toggle button, let the click handler handle it
            if (this.classList.contains('dropdown-toggle')) {
              e.preventDefault();
              this.click();
            }
            break;
        }
      });
    });
  }

  function highlightActivePage(activePage) {
    if (!activePage) {
      // Try to determine from current URL
      const path = window.location.pathname;

      // Map common paths to page identifiers
      const pathMap = {
        '/': 'home',
        '/products/': 'products',
        '/careers/': 'careers',
        '/investor-relations/': 'investor-relations',
        '/legal/': 'legal',
        '/privacy-policy/': 'legal',
        '/buy/': 'store',
        '/blog/': 'blog'
      };

      activePage = pathMap[path] || '';
    }

    if (activePage) {
      const activeLink = document.querySelector(`.nav-link[data-page="${activePage}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
      }
    }
  }

  function setupAnalytics() {
    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('[data-analytics="cta-click"]');

    ctaButtons.forEach(button => {
      button.addEventListener('click', function() {
        const ctaData = {
          location: this.getAttribute('data-cta-location'),
          type: this.getAttribute('data-cta-type'),
          goal: this.getAttribute('data-conversion-goal'),
          text: this.textContent.trim(),
          timestamp: new Date().toISOString()
        };

        // Send to analytics (Google Analytics, Mixpanel, etc.)
        if (window.gtag) {
          window.gtag('event', 'cta_click', ctaData);
        }

        if (window.analytics) {
          window.analytics.track('CTA Clicked', ctaData);
        }

        // Console log for debugging
        console.log('CTA clicked:', ctaData);
      });
    });

    // Track dropdown interactions
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function() {
        const dropdownData = {
          menu: this.textContent.trim(),
          timestamp: new Date().toISOString()
        };

        if (window.gtag) {
          window.gtag('event', 'dropdown_interact', dropdownData);
        }

        console.log('Dropdown interaction:', dropdownData);
      });
    });
  }

  // Expose utility functions for external use
  window.Navigation = {
    openMobileMenu: function() {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const menu = document.querySelector('.nav-menu');
      if (toggle && menu) {
        toggle.setAttribute('aria-expanded', 'true');
        menu.classList.add('mobile-open');
      }
    },

    closeMobileMenu: function() {
      const toggle = document.querySelector('.mobile-menu-toggle');
      const menu = document.querySelector('.nav-menu');
      if (toggle && menu) {
        toggle.setAttribute('aria-expanded', 'false');
        menu.classList.remove('mobile-open');
        document.body.style.overflow = '';
      }
    },

    closeAllDropdowns: function() {
      const toggles = document.querySelectorAll('.dropdown-toggle');
      toggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  };

})();
