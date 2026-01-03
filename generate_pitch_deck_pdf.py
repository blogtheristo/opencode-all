#!/usr/bin/env python3
"""Generate PDF from investor pitch deck markdown"""

import os

import markdown
from weasyprint import HTML


def generate_pdf():
    # Read the markdown file
    with open("investor-outreach/investor-pitch-deck.md", encoding="utf-8") as f:
        md_content = f.read()

    # Convert markdown to HTML
    html_content = markdown.markdown(md_content, extensions=["tables", "fenced_code"])

    # Create a styled HTML document
    full_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            @page {{
                size: A4;
                margin: 2cm;
            }}
            body {{
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #1a202c;
                font-size: 10pt;
            }}
            h1 {{
                color: #1a365d;
                font-size: 24pt;
                margin-top: 0;
                page-break-after: avoid;
            }}
            h2 {{
                color: #2d5a87;
                font-size: 18pt;
                margin-top: 1.5em;
                page-break-after: avoid;
                border-bottom: 2px solid #60a5fa;
                padding-bottom: 0.3em;
            }}
            h3 {{
                color: #1a365d;
                font-size: 14pt;
                margin-top: 1em;
                page-break-after: avoid;
            }}
            h4 {{
                color: #2d5a87;
                font-size: 12pt;
                margin-top: 0.8em;
            }}
            table {{
                width: 100%;
                border-collapse: collapse;
                margin: 1em 0;
                font-size: 9pt;
                page-break-inside: avoid;
            }}
            table th,
            table td {{
                border: 1px solid #cbd5e1;
                padding: 8px;
                text-align: left;
            }}
            table th {{
                background-color: #e2e8f0;
                color: #1a365d;
                font-weight: bold;
            }}
            ul, ol {{
                margin: 0.5em 0;
                padding-left: 1.5em;
            }}
            li {{
                margin: 0.3em 0;
            }}
            pre {{
                background-color: #f7fafc;
                border: 1px solid #cbd5e1;
                border-radius: 4px;
                padding: 1em;
                font-size: 8pt;
                line-height: 1.4;
                overflow-x: auto;
                page-break-inside: avoid;
            }}
            code {{
                background-color: #f7fafc;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 9pt;
            }}
            strong {{
                color: #1a365d;
            }}
            a {{
                color: #2d5a87;
                text-decoration: none;
            }}
            hr {{
                border: none;
                border-top: 1px solid #cbd5e1;
                margin: 2em 0;
                page-break-after: always;
            }}
            .page-break {{
                page-break-before: always;
            }}
        </style>
    </head>
    <body>
        {html_content}
    </body>
    </html>
    """

    # Generate PDF with compression
    output_path = "docs/presentations/DWS-IQ6-Investor-Pitch-Deck-2025.pdf"

    print("Generating PDF...")
    HTML(string=full_html).write_pdf(
        output_path,
        optimize_size=("fonts", "images"),
    )

    print(f"✅ PDF generated: {output_path}")

    # Check file size
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"📄 File size: {size_mb:.2f} MB")


if __name__ == "__main__":
    generate_pdf()
