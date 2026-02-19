#!/usr/bin/env python3
"""
Convert DWS7 Integration Roadmap from Markdown to PDF
"""

import os

import markdown2
from weasyprint import HTML
from weasyprint.text.fonts import FontConfiguration


def convert_markdown_to_pdf(md_file, pdf_file):
    """Convert markdown file to PDF with styling"""

    # Read the markdown file
    with open(md_file, encoding="utf-8") as f:
        md_content = f.read()

    # Convert markdown to HTML
    html_content = markdown2.markdown(
        md_content,
        extras=[
            "fenced-code-blocks",
            "tables",
            "header-ids",
            "toc",
            "break-on-newline",
            "code-friendly",
            "cuddled-lists",
        ],
    )

    # Create styled HTML document
    styled_html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>DWS7 Integration Roadmap - NVIDIA & Siemens</title>
        <style>
            @page {{
                size: A4;
                margin: 2cm;
                @top-center {{
                    content: "DWS7 Integration Roadmap";
                    font-size: 10pt;
                    color: #666;
                }}
                @bottom-center {{
                    content: "Page " counter(page) " of " counter(pages);
                    font-size: 9pt;
                    color: #666;
                }}
            }}

            body {{
                font-family: 'DejaVu Sans', Arial, sans-serif;
                font-size: 10pt;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
            }}

            h1 {{
                color: #2c3e50;
                font-size: 24pt;
                margin-top: 20pt;
                margin-bottom: 12pt;
                page-break-after: avoid;
                border-bottom: 3px solid #3498db;
                padding-bottom: 8pt;
            }}

            h2 {{
                color: #34495e;
                font-size: 18pt;
                margin-top: 16pt;
                margin-bottom: 10pt;
                page-break-after: avoid;
                border-bottom: 2px solid #95a5a6;
                padding-bottom: 6pt;
            }}

            h3 {{
                color: #2c3e50;
                font-size: 14pt;
                margin-top: 12pt;
                margin-bottom: 8pt;
                page-break-after: avoid;
            }}

            h4 {{
                color: #34495e;
                font-size: 12pt;
                margin-top: 10pt;
                margin-bottom: 6pt;
                page-break-after: avoid;
                font-weight: bold;
            }}

            p {{
                margin-bottom: 8pt;
                text-align: justify;
            }}

            ul, ol {{
                margin-bottom: 10pt;
                padding-left: 20pt;
            }}

            li {{
                margin-bottom: 4pt;
            }}

            code {{
                background-color: #f4f4f4;
                padding: 2pt 4pt;
                border-radius: 3pt;
                font-family: 'DejaVu Sans Mono', 'Courier New', monospace;
                font-size: 9pt;
            }}

            pre {{
                background-color: #f8f8f8;
                border: 1px solid #ddd;
                border-radius: 4pt;
                padding: 10pt;
                overflow-x: auto;
                margin-bottom: 10pt;
                page-break-inside: avoid;
            }}

            pre code {{
                background-color: transparent;
                padding: 0;
                font-size: 8pt;
            }}

            table {{
                border-collapse: collapse;
                width: 100%;
                margin-bottom: 12pt;
                page-break-inside: avoid;
                font-size: 9pt;
            }}

            th {{
                background-color: #3498db;
                color: white;
                padding: 8pt;
                text-align: left;
                font-weight: bold;
            }}

            td {{
                border: 1px solid #ddd;
                padding: 6pt;
            }}

            tr:nth-child(even) {{
                background-color: #f9f9f9;
            }}

            a {{
                color: #3498db;
                text-decoration: none;
            }}

            a:hover {{
                text-decoration: underline;
            }}

            blockquote {{
                border-left: 4px solid #3498db;
                padding-left: 12pt;
                margin-left: 0;
                color: #555;
                font-style: italic;
            }}

            hr {{
                border: none;
                border-top: 2px solid #e0e0e0;
                margin: 16pt 0;
            }}

            .page-break {{
                page-break-before: always;
            }}

            /* Prevent widows and orphans */
            p, li, h1, h2, h3, h4 {{
                orphans: 3;
                widows: 3;
            }}

            /* Table of contents styling */
            #table-of-contents {{
                background-color: #f8f9fa;
                padding: 15pt;
                border-radius: 5pt;
                margin-bottom: 20pt;
                page-break-after: always;
            }}

            #table-of-contents h2 {{
                margin-top: 0;
            }}

            /* Cover page */
            .cover {{
                text-align: center;
                padding-top: 200pt;
                page-break-after: always;
            }}

            .cover h1 {{
                font-size: 32pt;
                border: none;
                color: #2c3e50;
            }}

            .cover .subtitle {{
                font-size: 18pt;
                color: #7f8c8d;
                margin-top: 20pt;
            }}

            .cover .date {{
                font-size: 12pt;
                color: #95a5a6;
                margin-top: 40pt;
            }}
        </style>
    </head>
    <body>
        <div class="cover">
            <h1>DWS7 Integration Roadmap</h1>
            <div class="subtitle">NVIDIA & Siemens Industrial AI Technologies</div>
            <div class="date">Strategic Planning Document<br/>January 2026</div>
        </div>

        {html_content}
    </body>
    </html>
    """

    # Configure fonts
    font_config = FontConfiguration()

    # Convert HTML to PDF
    print(f"Converting {md_file} to PDF...")
    HTML(string=styled_html).write_pdf(pdf_file, font_config=font_config)

    print(f"✓ PDF created successfully: {pdf_file}")

    # Get file size
    file_size = os.path.getsize(pdf_file)
    print(f"  File size: {file_size / 1024:.1f} KB")


if __name__ == "__main__":
    # Set file paths
    md_file = "/home/user/dws6/dws7/DWS7_INTEGRATION_ROADMAP_NVIDIA_SIEMENS.md"
    pdf_file = "/home/user/dws6/dws7/DWS7_INTEGRATION_ROADMAP_NVIDIA_SIEMENS.pdf"

    # Convert
    convert_markdown_to_pdf(md_file, pdf_file)
