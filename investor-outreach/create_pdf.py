#!/usr/bin/env python3
"""
Convert DWS IQ6 Investor Pitch Deck from Markdown to PDF
Optimized to stay below 10MB
"""

import os

import markdown

# File paths
input_file = r"d:\Proton\My files\2026\Repos2026\dws6\investor-outreach\DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md"
output_html = r"d:\Proton\My files\2026\Repos2026\dws6\investor-outreach\DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.html"
output_pdf = r"d:\Proton\My files\2026\Repos2026\dws6\investor-outreach\DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.pdf"

# Read markdown content
with open(input_file, encoding="utf-8") as f:
    md_content = f.read()

# Convert to HTML with extensions
html_content = markdown.markdown(
    md_content, extensions=["tables", "fenced_code", "toc", "meta", "nl2br"]
)

# Create styled HTML document
styled_html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>DWS IQ 6 Investor Pitch Deck</title>
    <style>
        @page {{
            size: A4;
            margin: 2cm;
        }}
        body {{
            font-family: 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 100%;
            margin: 0 auto;
            padding: 20px;
        }}
        h1 {{
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            page-break-before: always;
        }}
        h1:first-of-type {{
            page-break-before: avoid;
        }}
        h2 {{
            color: #34495e;
            border-bottom: 2px solid #95a5a6;
            padding-bottom: 5px;
            margin-top: 30px;
        }}
        h3 {{
            color: #7f8c8d;
            margin-top: 20px;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
            font-size: 10pt;
            page-break-inside: avoid;
        }}
        th, td {{
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }}
        th {{
            background-color: #3498db;
            color: white;
            font-weight: bold;
        }}
        tr:nth-child(even) {{
            background-color: #f2f2f2;
        }}
        code {{
            background-color: #f4f4f4;
            padding: 2px 5px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }}
        pre {{
            background-color: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            page-break-inside: avoid;
        }}
        ul, ol {{
            margin: 15px 0;
            padding-left: 30px;
        }}
        li {{
            margin: 5px 0;
        }}
        blockquote {{
            border-left: 4px solid #3498db;
            padding-left: 15px;
            margin: 20px 0;
            color: #555;
            font-style: italic;
        }}
        .page-break {{
            page-break-after: always;
        }}
        hr {{
            border: none;
            border-top: 2px solid #ddd;
            margin: 30px 0;
        }}
        strong {{
            color: #2c3e50;
        }}
        em {{
            color: #7f8c8d;
        }}
    </style>
</head>
<body>
{html_content}
</body>
</html>
"""

# Write HTML file
with open(output_html, "w", encoding="utf-8") as f:
    f.write(styled_html)

print(f"✅ HTML file created: {output_html}")

# Try to convert to PDF using weasyprint (no external dependencies)
try:
    from weasyprint import HTML

    print("⏳ Converting HTML to PDF using WeasyPrint...")
    HTML(output_html).write_pdf(
        output_pdf,
        optimize_size=("fonts", "images"),  # Optimize to reduce file size
    )

    # Check file size
    file_size_mb = os.path.getsize(output_pdf) / (1024 * 1024)
    print(f"✅ PDF file created: {output_pdf}")
    print(f"📊 File size: {file_size_mb:.2f} MB")

    if file_size_mb < 10:
        print("✅ File size is below 10 MB!")
    else:
        print("⚠️ Warning: File size exceeds 10 MB")
        print("   Consider reducing images or content to stay under 10 MB")

except Exception as e:
    print(f"⚠️ Could not create PDF: {e}")
    print("\n📋 Alternative options:")
    print("1. Use the HTML file and print to PDF from your browser")
    print("2. Install MiKTeX (LaTeX) and use: pandoc input.md -o output.pdf")
    print(f"\n✅ HTML file is ready: {output_html}")
    print("   Open this file in Chrome/Edge and use 'Print to PDF'")
