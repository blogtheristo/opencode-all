/**
 * Ironclad Navigation Loader
 * Dynamically loads the Ironclad/Gamma navigation into pages
 * Usage: Add <script src="/shared-assets/nav/nav-loader.js" defer></script> to your page
 */

document.addEventListener('DOMContentLoaded', function() {
    const navPlaceholder = document.getElementById('ironclad-nav-placeholder');
    if (!navPlaceholder) return;

    fetch('/shared-assets/nav/ironclad-nav.html')
        .then(response => response.text())
        .then(html => {
            navPlaceholder.innerHTML = html;
        })
        .catch(err => {
            console.error('Failed to load navigation:', err);
        });
});
