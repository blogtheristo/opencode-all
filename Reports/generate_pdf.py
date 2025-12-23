#!/usr/bin/env python3
"""
Generate professional PDF reports with Lifetime Group branding
Converts Markdown to PDF with logo, headers, and footers
"""

import os
import sys
from datetime import datetime
from pathlib import Path
import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

# Company introduction templates
INTRODUCTIONS = {
    "en": """
    <div class="intro-section">
        <h2>About Lifetime World</h2>
        <p><strong>Mission:</strong> Empowering construction SMEs with AI-driven intelligence to achieve sustainable growth and operational excellence across the Nordic region.</p>

        <h2>About DWS IQ</h2>
        <p><strong>Product:</strong> AI-powered business intelligence platform that predicts customer churn, optimizes unit economics, and identifies growth opportunities through advanced analytics and machine learning.</p>

        <h2>About This Report</h2>
        <p><strong>Purpose:</strong> Weekly progress report tracking the development and deployment of the DWS6 pilot system, targeting five Nordic construction companies with a production-ready AI agent platform.</p>
    </div>
    """,
    "fi": """
    <div class="intro-section">
        <h2>Lifetime World -yhtiöstä</h2>
        <p><strong>Missio:</strong> Voimaannuttaa rakennusalan pk-yrityksiä tekoälypohjaisella tiedolla saavuttaakseen kestävää kasvua ja toiminnallista erinomaisuutta Pohjoismaissa.</p>

        <h2>DWS IQ -tuotteesta</h2>
        <p><strong>Tuote:</strong> Tekoälypohjainen liiketoimintatietoalusta, joka ennustaa asiakaspoistumaa, optimoi yksikkötalouden ja tunnistaa kasvumahdollisuuksia edistyneen analytiikan ja koneoppimisen avulla.</p>

        <h2>Tästä Raportista</h2>
        <p><strong>Tarkoitus:</strong> Viikoittainen edistymisraportti, joka seuraa DWS6-pilottijärjestelmän kehitystä ja käyttöönottoa, kohdistuen viiteen pohjoismaiseen rakennusyritykseen tuotantovalmiilla tekoälyagenttialustalla.</p>
    </div>
    """
}

# HTML/CSS template for professional PDF
HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{title}</title>
    <style>
        @page {{
            size: A4;
            margin: 2.5cm 2cm 3cm 2cm;

            @top-right {{
                content: element(logo);
                vertical-align: top;
            }}

            @bottom-left {{
                content: element(footer-left);
                font-size: 9pt;
                color: #666;
            }}

            @bottom-center {{
                content: counter(page) " / " counter(pages);
                font-size: 9pt;
                color: #666;
            }}

            @bottom-right {{
                content: element(footer-right);
                font-size: 9pt;
                color: #666;
            }}
        }}

        body {{
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
        }}

        #logo {{
            position: running(logo);
            width: 120px;
            margin-bottom: 10px;
        }}

        #footer-left {{
            position: running(footer-left);
        }}

        #footer-right {{
            position: running(footer-right);
        }}

        h1 {{
            color: #1a56db;
            font-size: 24pt;
            margin-top: 0;
            border-bottom: 3px solid #1a56db;
            padding-bottom: 10px;
        }}

        h2 {{
            color: #1a56db;
            font-size: 16pt;
            margin-top: 20px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }}

        h3 {{
            color: #2563eb;
            font-size: 13pt;
            margin-top: 15px;
        }}

        h4 {{
            color: #3b82f6;
            font-size: 11pt;
            margin-top: 10px;
        }}

        .intro-section {{
            background-color: #f0f9ff;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #1a56db;
            page-break-inside: avoid;
        }}

        .intro-section h2 {{
            color: #1a56db;
            font-size: 14pt;
            margin-top: 10px;
            border: none;
        }}

        .intro-section p {{
            margin: 5px 0;
        }}

        table {{
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            font-size: 10pt;
            page-break-inside: avoid;
        }}

        th {{
            background-color: #1a56db;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }}

        td {{
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }}

        tr:nth-child(even) {{
            background-color: #f9fafb;
        }}

        code {{
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 9pt;
        }}

        pre {{
            background-color: #1f2937;
            color: #f3f4f6;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            font-size: 9pt;
            page-break-inside: avoid;
        }}

        pre code {{
            background-color: transparent;
            color: inherit;
            padding: 0;
        }}

        .status-green {{
            color: #059669;
            font-weight: bold;
        }}

        .status-yellow {{
            color: #d97706;
            font-weight: bold;
        }}

        .status-red {{
            color: #dc2626;
            font-weight: bold;
        }}

        blockquote {{
            border-left: 4px solid #ddd;
            margin: 15px 0;
            padding-left: 15px;
            color: #666;
            font-style: italic;
        }}

        ul, ol {{
            margin: 10px 0;
            padding-left: 25px;
        }}

        li {{
            margin: 5px 0;
        }}

        .page-break {{
            page-break-after: always;
        }}

        .metadata {{
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
            font-size: 10pt;
        }}
    </style>
</head>
<body>
    <div id="logo">
        <img src="{logo_path}" alt="Lifetime Group Logo" style="width: 100%; height: auto;">
    </div>

    <div id="footer-left">
        Lifetime Group<br>
        DWS IQ Platform
    </div>

    <div id="footer-right">
        Confidential<br>
        {date}
    </div>

    <div class="metadata">
        <strong>Report Period:</strong> {period}<br>
        <strong>Team Lead:</strong> Risto Anton Päärni<br>
        <strong>Generated:</strong> {timestamp}<br>
        <strong>Status:</strong> <span class="status-green">🟢 ON TRACK</span>
    </div>

    {intro}

    <div class="page-break"></div>

    {content}
</body>
</html>
"""

def markdown_to_html(md_file):
    """Convert Markdown file to HTML"""
    with open(md_file, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Convert Markdown to HTML with extensions
    html = markdown.markdown(
        md_content,
        extensions=[
            'tables',
            'fenced_code',
            'codehilite',
            'nl2br',
            'sane_lists'
        ]
    )

    # Replace emoji status indicators with styled spans
    html = html.replace('🟢', '<span class="status-green">🟢</span>')
    html = html.replace('🟡', '<span class="status-yellow">🟡</span>')
    html = html.replace('🔴', '<span class="status-red">🔴</span>')

    return html

def create_logo_placeholder(output_path):
    """Create a simple SVG logo placeholder if logo doesn't exist"""
    svg_logo = """
    <svg width="120" height="40" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="40" fill="#1a56db" rx="5"/>
        <text x="60" y="25" font-family="Arial, sans-serif" font-size="16"
              fill="white" text-anchor="middle" font-weight="bold">
            LIFETIME
        </text>
    </svg>
    """
    with open(output_path, 'w') as f:
        f.write(svg_logo)
    return output_path

def generate_pdf(md_file, output_pdf, language='en'):
    """Generate PDF from Markdown with Lifetime Group branding"""

    script_dir = Path(__file__).parent

    # Logo path (check for actual logo, fallback to placeholder)
    logo_path = script_dir / "assets" / "lifetime_logo.svg"
    if not logo_path.exists():
        logo_path.parent.mkdir(exist_ok=True)
        logo_path = create_logo_placeholder(logo_path)

    # Convert Markdown to HTML
    content_html = markdown_to_html(md_file)

    # Get introduction text
    intro_html = INTRODUCTIONS.get(language, INTRODUCTIONS['en'])

    # Prepare template variables
    title = "DWS6 Weekly Progress Report"
    if language == 'fi':
        title = "DWS6 Viikoittainen Edistymisraportti"

    period = "November 27 - December 3, 2025"
    if language == 'fi':
        period = "27. marraskuuta - 3. joulukuuta 2025"

    # Fill HTML template
    html_content = HTML_TEMPLATE.format(
        title=title,
        logo_path=str(logo_path),
        date=datetime.now().strftime('%Y-%m-%d'),
        period=period,
        timestamp=datetime.now().strftime('%Y-%m-%d %H:%M'),
        intro=intro_html,
        content=content_html
    )

    # Generate PDF
    font_config = FontConfiguration()
    html = HTML(string=html_content, base_url=str(script_dir))

    print(f"📄 Generating PDF: {output_pdf}")
    html.write_pdf(output_pdf, font_config=font_config)
    print(f"✅ PDF created: {output_pdf}")

    return output_pdf

def main():
    """Generate PDFs for all reports"""
    script_dir = Path(__file__).parent

    # Generate English PDF
    en_md = script_dir / "en" / "WEEKLY_REPORT.md"
    en_pdf = script_dir / "en" / "WEEKLY_REPORT.pdf"

    if en_md.exists():
        generate_pdf(en_md, en_pdf, language='en')
    else:
        print(f"❌ English report not found: {en_md}")

    # Generate Finnish PDF
    fi_md = script_dir / "fi" / "WEEKLY_REPORT_FI.md"
    fi_pdf = script_dir / "fi" / "WEEKLY_REPORT_FI.pdf"

    if fi_md.exists():
        generate_pdf(fi_md, fi_pdf, language='fi')
    else:
        print(f"❌ Finnish report not found: {fi_md}")

if __name__ == "__main__":
    main()
