/**
 * Ironclad Navigation Loader
 * Dynamically loads the Ironclad/Gamma navigation into pages
 * Usage: Add <script src="/shared-assets/nav/nav-loader.js" defer></script> to your page
 */

function sanitizeNavFragment(html) {
    const template = document.createElement('template');
    template.innerHTML = html;

    const disallowedTags = ['script', 'iframe', 'object', 'embed', 'link', 'meta', 'base'];
    template.content.querySelectorAll(disallowedTags.join(',')).forEach((el) => el.remove());

    template.content.querySelectorAll('*').forEach((el) => {
        Array.from(el.attributes).forEach((attr) => {
            const name = attr.name.toLowerCase();
            const value = attr.value.trim().toLowerCase();
            if (name.startsWith('on')) {
                el.removeAttribute(attr.name);
                return;
            }
            if ((name === 'href' || name === 'src' || name === 'xlink:href') && value.startsWith('javascript:')) {
                el.removeAttribute(attr.name);
            }
        });
    });

    return template.content;
}

document.addEventListener('DOMContentLoaded', function() {
    const navPlaceholder = document.getElementById('ironclad-nav-placeholder');
    if (!navPlaceholder) return;

    fetch('/shared-assets/nav/ironclad-nav.html', { credentials: 'same-origin' })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Navigation request failed with status ${response.status}`);
            }
            return response.text();
        })
        .then((html) => {
            navPlaceholder.replaceChildren(sanitizeNavFragment(html));
        })
        .catch((err) => {
            console.error('Failed to load navigation:', err);
        });
});
