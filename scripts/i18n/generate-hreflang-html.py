#!/usr/bin/env python3
# Evidence: Tool=Cursor Agent Model=cursor-grok-4.6 Date=2026-09-17
# Audit trail: git log -- scripts/i18n/generate-hreflang-html.py
"""Retired stub generator.

A previous version mixed str.format positional and named placeholders (KeyError)
and wrote incomplete light-theme HTML that dropped most product sections.

Do not generate Store pages from object-section JSON. Use:

    node scripts/i18n/build-i18n-pages.cjs scripts/i18n/<target>.config.json

with a JSON *array* of text nodes matching the HTML master (DWS_LANGUAGE_STANDARD.md).
"""

import sys


def main() -> int:
    sys.stderr.write(
        "scripts/i18n/generate-hreflang-html.py is retired.\n"
        "It must not write dws10.com/products/aegis.<lang>.html stubs.\n"
        "Use: node scripts/i18n/build-i18n-pages.cjs <config.json>\n"
    )
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
