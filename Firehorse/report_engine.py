"""
Firehorse Report Engine
=======================

Adaptive template engine for generating European construction document reports
with EN 15978 carbon tracking and multi-format export capabilities.

Features:
- Load template configurations from JSON
- Fetch real-time data from Supabase/DWS IQ platform
- Populate templates with customer data
- Generate reports in multiple formats (PDF, DOCX, XLSX, PPTX)
- Apply customer-specific branding
- Validate against standard requirements
- EN 15978 carbon reporting

Author: DWS IQ 6 Platform Team
Date: December 30, 2025
Version: 1.0.0
"""

import json
import logging
import os
from datetime import datetime
from pathlib import Path
from typing import Any

# Third-party imports
try:
    import openpyxl
    from docx import Document
    from docx.enum.text import WD_ALIGN_PARAGRAPH
    from openpyxl.styles import Font
    from pptx import Presentation
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.platypus import (
        Paragraph,
        SimpleDocTemplate,
        Spacer,
        Table,
        TableStyle,
    )
    from simpleeval import simple_eval

    from supabase import Client, create_client
except ImportError as e:
    print(f"Warning: Some dependencies not installed: {e}")
    print(
        "Install with: pip install supabase reportlab python-docx openpyxl python-pptx matplotlib pandas"
    )

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


class FirehorseReportEngine:
    """
    Main report engine class for generating European construction documents.
    """

    def __init__(
        self,
        supabase_url: str | None = None,
        supabase_key: str | None = None,
        templates_dir: str | None = None,
    ):
        """
        Initialize the report engine.

        Args:
            supabase_url: Supabase project URL
            supabase_key: Supabase API key
            templates_dir: Path to templates directory
        """
        # Initialize Supabase client
        self.supabase_url = supabase_url or os.getenv("SUPABASE_URL")
        self.supabase_key = supabase_key or os.getenv("SUPABASE_KEY")

        if self.supabase_url and self.supabase_key:
            try:
                self.supabase: Client = create_client(
                    self.supabase_url, self.supabase_key
                )
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                self.supabase = None
        else:
            logger.warning("Supabase credentials not provided")
            self.supabase = None

        # Set templates directory
        self.templates_dir = Path(templates_dir or "templates")
        if not self.templates_dir.exists():
            logger.warning(f"Templates directory not found: {self.templates_dir}")

        # Cache for loaded templates
        self._template_cache: dict[str, dict] = {}

        logger.info("FirehorseReportEngine initialized")

    def load_template_config(self, standard: str, region: str) -> dict:
        """
        Load template configuration from JSON file.

        Args:
            standard: Standard type (e.g., 'EN 15978', 'RT Card', 'VOB/B')
            region: Region (e.g., 'Nordic', 'Central Europe', 'Pan-European')

        Returns:
            Template configuration dictionary

        Raises:
            FileNotFoundError: If template file not found
            json.JSONDecodeError: If template JSON is invalid
        """
        cache_key = f"{standard}_{region}"

        # Check cache first
        if cache_key in self._template_cache:
            logger.info(f"Loading template from cache: {cache_key}")
            return self._template_cache[cache_key]

        # Map standard to template file
        template_mapping = {
            "EN 15978": "pan-european/environmental/en15978-template.json",
            "RT Card": "nordic/finland/rt-card-template.json",
            "VOB/B": "central-europe/germany/vob-template.json",
        }

        template_file = template_mapping.get(standard)
        if not template_file:
            raise ValueError(f"Unknown standard: {standard}")

        template_path = self.templates_dir / template_file

        if not template_path.exists():
            raise FileNotFoundError(f"Template file not found: {template_path}")

        try:
            with open(template_path, encoding="utf-8") as f:
                config = json.load(f)

            # Cache the template
            self._template_cache[cache_key] = config
            logger.info(f"Template loaded successfully: {standard} ({region})")

            return config

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in template file: {e}")
            raise

    def fetch_project_data(self, project_id: str) -> dict:
        """
        Fetch project data from DWS IQ 6 platform via Supabase.

        Args:
            project_id: Project identifier

        Returns:
            Project data dictionary with all related information

        Raises:
            ValueError: If Supabase client not initialized
            Exception: If data fetch fails
        """
        if not self.supabase:
            raise ValueError("Supabase client not initialized")

        try:
            # Fetch project data
            project_response = (
                self.supabase.table("projects")
                .select("*")
                .eq("id", project_id)
                .single()
                .execute()
            )

            project_data = project_response.data

            # Fetch related alerts
            alerts_response = (
                self.supabase.table("alerts")
                .select("*")
                .eq("project_id", project_id)
                .execute()
            )

            project_data["alerts"] = alerts_response.data

            # Fetch KPIs
            kpis_response = (
                self.supabase.table("kpis")
                .select("*")
                .eq("project_id", project_id)
                .execute()
            )

            project_data["kpis"] = kpis_response.data

            logger.info(f"Project data fetched successfully: {project_id}")

            return project_data

        except Exception as e:
            logger.error(f"Failed to fetch project data: {e}")
            raise

    def fetch_carbon_data(self, project_id: str) -> dict:
        """
        Fetch carbon tracking data for EN 15978 reporting.

        Args:
            project_id: Project identifier

        Returns:
            Carbon data dictionary with budget, emissions, and life cycle breakdown

        Raises:
            ValueError: If Supabase client not initialized
            Exception: If data fetch fails
        """
        if not self.supabase:
            raise ValueError("Supabase client not initialized")

        try:
            # Fetch carbon budget
            budget_response = (
                self.supabase.table("carbon_budget")
                .select("*")
                .eq("project_id", project_id)
                .single()
                .execute()
            )

            carbon_data = budget_response.data or {}

            # Fetch carbon summary from view
            summary_response = (
                self.supabase.table("v_project_carbon_summary")
                .select("*")
                .eq("project_id", project_id)
                .single()
                .execute()
            )

            if summary_response.data:
                carbon_data["life_cycle_breakdown"] = {
                    "A1_A3": float(summary_response.data.get("carbon_a1a3", 0)),
                    "A4": float(summary_response.data.get("carbon_a4", 0)),
                    "A5": float(summary_response.data.get("carbon_a5", 0)),
                    "B1_B7": float(summary_response.data.get("carbon_b1b7", 0)),
                    "C1_C4": float(summary_response.data.get("carbon_c1c4", 0)),
                    "D": float(summary_response.data.get("carbon_d", 0)),
                    "total": float(summary_response.data.get("total_carbon", 0)),
                }

            # Fetch material-level carbon data
            materials_response = (
                self.supabase.table("project_carbon")
                .select(
                    "material_name, quantity, unit, carbon_emission, life_cycle_stage"
                )
                .eq("project_id", project_id)
                .execute()
            )

            carbon_data["materials"] = materials_response.data

            logger.info(f"Carbon data fetched successfully: {project_id}")

            return carbon_data

        except Exception as e:
            logger.error(f"Failed to fetch carbon data: {e}")
            raise

    def populate_template(self, template_config: dict, data: dict) -> dict:
        """
        Populate template with data by mapping data sources to fields.

        Args:
            template_config: Template configuration dictionary
            data: Combined data dictionary (project + carbon data)

        Returns:
            Populated template with all field values
        """
        populated = template_config.copy()

        for section in populated.get("sections", []):
            self._populate_section(section, data)

        logger.info("Template populated successfully")

        return populated

    def _populate_section(self, section: dict, data: dict) -> None:
        """
        Recursively populate section fields with data.

        Args:
            section: Section dictionary
            data: Data dictionary
        """
        for field in section.get("fields", []):
            if "dataSource" in field:
                value = self._extract_data_from_source(field["dataSource"], data)
                field["value"] = value

            # Handle calculated fields
            if "calculation" in field:
                field["value"] = self._evaluate_calculation(field["calculation"], data)

        # Handle subsections
        for subsection in section.get("subsections", []):
            self._populate_section(subsection, data)

    def _extract_data_from_source(self, source_path: str, data: dict) -> Any:
        """
        Extract data from nested dictionary using dot notation path.

        Args:
            source_path: Data source path (e.g., 'project.name', 'carbon_budget.current_carbon')
            data: Data dictionary

        Returns:
            Extracted value or None if not found
        """
        parts = source_path.split(".")
        current = data

        for part in parts:
            if isinstance(current, dict):
                current = current.get(part)
            else:
                return None

            if current is None:
                return None

        return current

    def _evaluate_calculation(self, formula: str, _data: dict) -> Any:
        """
        Evaluate calculation formula.

        Args:
            formula: Calculation formula
            data: Data dictionary for variable lookup

        Returns:
            Calculated value
        """
        # Safe formula evaluation using simpleeval (prevents arbitrary code execution).
        # Keep this path on simple_eval + nosec; do not regress to ast.literal_eval/eval.
        try:
            return simple_eval(formula, names=_data)  # nosec
        except Exception as e:
            logger.warning(f"Calculation evaluation failed: {e}")
            return None

    def generate_carbon_report(
        self,
        project_id: str,
        standard: str = "EN 15978",
        language: str = "en",
        output_format: str = "PDF",
    ) -> bytes:
        """
        Generate EN 15978 carbon assessment report.

        Args:
            project_id: Project identifier
            standard: Carbon standard (default: 'EN 15978')
            language: Report language (default: 'en')
            output_format: Output format (default: 'PDF')

        Returns:
            Report content as bytes

        Raises:
            ValueError: If invalid parameters
            Exception: If report generation fails
        """
        logger.info(f"Generating carbon report for project {project_id}")

        try:
            # Load template
            template_config = self.load_template_config(standard, "Pan-European")

            # Fetch data
            project_data = self.fetch_project_data(project_id)
            carbon_data = self.fetch_carbon_data(project_id)

            # Combine data
            combined_data = {
                "project": project_data,
                "carbon_budget": carbon_data,
                **project_data,
                **carbon_data,
            }

            # Populate template
            populated_template = self.populate_template(template_config, combined_data)

            # Generate report in requested format
            if output_format.upper() == "PDF":
                return self._generate_pdf(populated_template, language)
            if output_format.upper() == "DOCX":
                return self._generate_docx(populated_template, language)
            if output_format.upper() == "XLSX":
                return self._generate_xlsx(populated_template, language)
            if output_format.upper() == "PPTX":
                return self._generate_pptx(populated_template, language)
            raise ValueError(f"Unsupported output format: {output_format}")

        except Exception as e:
            logger.error(f"Failed to generate carbon report: {e}")
            raise

    def _generate_pdf(self, template: dict, _language: str) -> bytes:
        """
        Generate PDF report using ReportLab.

        Args:
            template: Populated template
            language: Report language

        Returns:
            PDF content as bytes
        """
        from io import BytesIO

        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4)
        story = []
        styles = getSampleStyleSheet()

        # Title
        title_style = ParagraphStyle(
            "CustomTitle",
            parent=styles["Heading1"],
            fontSize=24,
            textColor=colors.HexColor("#1e293b"),
            spaceAfter=30,
        )
        story.append(Paragraph(template.get("templateName", "Report"), title_style))
        story.append(Spacer(1, 12))

        # Process sections
        for section in template.get("sections", []):
            # Section heading
            section_style = ParagraphStyle(
                "SectionHeading",
                parent=styles["Heading2"],
                fontSize=16,
                textColor=colors.HexColor("#3b82f6"),
                spaceAfter=12,
            )
            story.append(Paragraph(section["sectionName"], section_style))

            # Section fields
            for field in section.get("fields", []):
                if field.get("type") == "table":
                    # Generate table
                    table_data = self._format_table_data(field)
                    if table_data:
                        t = Table(table_data)
                        t.setStyle(
                            TableStyle(
                                [
                                    (
                                        "BACKGROUND",
                                        (0, 0),
                                        (-1, 0),
                                        colors.HexColor("#3b82f6"),
                                    ),
                                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                                    ("FONTSIZE", (0, 0), (-1, 0), 12),
                                    ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                                    ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                                    ("GRID", (0, 0), (-1, -1), 1, colors.black),
                                ]
                            )
                        )
                        story.append(t)
                        story.append(Spacer(1, 12))
                else:
                    # Regular field
                    label = field.get("label", "")
                    value = field.get("value", "")
                    unit = field.get("unit", "")

                    text = f"<b>{label}:</b> {value} {unit}".strip()
                    story.append(Paragraph(text, styles["Normal"]))
                    story.append(Spacer(1, 6))

            story.append(Spacer(1, 20))

        # Build PDF
        doc.build(story)

        pdf_content = buffer.getvalue()
        buffer.close()

        logger.info("PDF report generated successfully")
        return pdf_content

    def _generate_docx(self, template: dict, _language: str) -> bytes:
        """
        Generate DOCX report using python-docx.

        Args:
            template: Populated template
            language: Report language

        Returns:
            DOCX content as bytes
        """
        from io import BytesIO

        doc = Document()

        # Title
        title = doc.add_heading(template.get("templateName", "Report"), 0)
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER

        # Process sections
        for section in template.get("sections", []):
            # Section heading
            doc.add_heading(section["sectionName"], level=1)

            # Section fields
            for field in section.get("fields", []):
                if field.get("type") == "table":
                    # Generate table
                    table_data = self._format_table_data(field)
                    if table_data and len(table_data) > 0:
                        table = doc.add_table(
                            rows=len(table_data), cols=len(table_data[0])
                        )
                        table.style = "Light Grid Accent 1"

                        for i, row_data in enumerate(table_data):
                            for j, cell_data in enumerate(row_data):
                                table.rows[i].cells[j].text = str(cell_data)
                else:
                    # Regular field
                    label = field.get("label", "")
                    value = field.get("value", "")
                    unit = field.get("unit", "")

                    p = doc.add_paragraph()
                    p.add_run(f"{label}: ").bold = True
                    p.add_run(f"{value} {unit}".strip())

            doc.add_paragraph()  # Spacing between sections

        # Save to buffer
        buffer = BytesIO()
        doc.save(buffer)
        docx_content = buffer.getvalue()
        buffer.close()

        logger.info("DOCX report generated successfully")
        return docx_content

    def _generate_xlsx(self, template: dict, _language: str) -> bytes:
        """
        Generate XLSX report using openpyxl.

        Args:
            template: Populated template
            language: Report language

        Returns:
            XLSX content as bytes
        """
        from io import BytesIO

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Report"

        row = 1

        # Title
        ws.cell(row=row, column=1, value=template.get("templateName", "Report"))
        ws.cell(row=row, column=1).font = Font(size=18, bold=True)
        row += 2

        # Process sections
        for section in template.get("sections", []):
            # Section heading
            ws.cell(row=row, column=1, value=section["sectionName"])
            ws.cell(row=row, column=1).font = Font(size=14, bold=True, color="3B82F6")
            row += 1

            # Section fields
            for field in section.get("fields", []):
                if field.get("type") == "table":
                    # Generate table
                    table_data = self._format_table_data(field)
                    if table_data:
                        for row_data in table_data:
                            for col, cell_data in enumerate(row_data, start=1):
                                ws.cell(row=row, column=col, value=cell_data)
                            row += 1
                else:
                    # Regular field
                    label = field.get("label", "")
                    value = field.get("value", "")
                    unit = field.get("unit", "")

                    ws.cell(row=row, column=1, value=label)
                    ws.cell(row=row, column=1).font = Font(bold=True)
                    ws.cell(row=row, column=2, value=f"{value} {unit}".strip())
                    row += 1

            row += 1  # Spacing between sections

        # Save to buffer
        buffer = BytesIO()
        wb.save(buffer)
        xlsx_content = buffer.getvalue()
        buffer.close()

        logger.info("XLSX report generated successfully")
        return xlsx_content

    def _generate_pptx(self, template: dict, _language: str) -> bytes:
        """
        Generate PPTX presentation using python-pptx.

        Args:
            template: Populated template
            language: Report language

        Returns:
            PPTX content as bytes
        """
        from io import BytesIO

        prs = Presentation()

        # Title slide
        title_slide_layout = prs.slide_layouts[0]
        slide = prs.slides.add_slide(title_slide_layout)
        title = slide.shapes.title
        subtitle = slide.placeholders[1]

        title.text = template.get("templateName", "Report")
        subtitle.text = f"Generated: {datetime.now().strftime('%Y-%m-%d')}"

        # Process sections
        for section in template.get("sections", []):
            # Section slide
            bullet_slide_layout = prs.slide_layouts[1]
            slide = prs.slides.add_slide(bullet_slide_layout)
            shapes = slide.shapes

            title_shape = shapes.title
            body_shape = shapes.placeholders[1]

            title_shape.text = section["sectionName"]

            tf = body_shape.text_frame

            # Section fields
            for field in section.get("fields", []):
                if field.get("type") != "table":
                    label = field.get("label", "")
                    value = field.get("value", "")
                    unit = field.get("unit", "")

                    p = tf.add_paragraph()
                    p.text = f"{label}: {value} {unit}".strip()
                    p.level = 0

        # Save to buffer
        buffer = BytesIO()
        prs.save(buffer)
        pptx_content = buffer.getvalue()
        buffer.close()

        logger.info("PPTX presentation generated successfully")
        return pptx_content

    def _format_table_data(self, field: dict) -> list[list[str]]:
        """
        Format table field data for rendering.

        Args:
            field: Table field configuration

        Returns:
            2D list of table data
        """
        columns = field.get("columns", [])
        value = field.get("value", [])

        if not columns:
            return []

        # Header row
        table_data = [[col.get("label", col.get("name", "")) for col in columns]]

        # Data rows
        if isinstance(value, list):
            for row in value:
                row_data = []
                for col in columns:
                    col_name = col.get("name", "")
                    cell_value = row.get(col_name, "")
                    row_data.append(str(cell_value))
                table_data.append(row_data)

        return table_data

    def export_report(
        self,
        content: bytes,
        format: str,
        output_path: str,
        filename: str | None = None,
    ) -> str:
        """
        Export report to file.

        Args:
            content: Report content as bytes
            format: Output format (PDF, DOCX, XLSX, PPTX)
            output_path: Output directory path
            filename: Optional filename (auto-generated if not provided)

        Returns:
            Full path to exported file

        Raises:
            IOError: If file write fails
        """
        # Create output directory if it doesn't exist
        output_dir = Path(output_path)
        output_dir.mkdir(parents=True, exist_ok=True)

        # Generate filename if not provided
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"report_{timestamp}.{format.lower()}"

        # Full file path
        file_path = output_dir / filename

        try:
            with open(file_path, "wb") as f:
                f.write(content)

            logger.info(f"Report exported successfully: {file_path}")
            return str(file_path)

        except OSError as e:
            logger.error(f"Failed to export report: {e}")
            raise

    def validate_compliance(self, report: dict, standard: str) -> list[str]:
        """
        Validate report compliance against standard requirements.

        Args:
            report: Populated report dictionary
            standard: Standard to validate against

        Returns:
            List of validation errors (empty if compliant)
        """
        errors = []

        # Get compliance rules from template
        compliance_rules = report.get("compliance", {})
        required_fields = compliance_rules.get("requiredFields", [])
        validation_rules = compliance_rules.get("validationRules", [])

        # Check required fields
        for field_path in required_fields:
            value = self._extract_data_from_source(field_path, report)
            if value is None or value == "":
                errors.append(f"Required field missing: {field_path}")

        # Apply validation rules
        for rule in validation_rules:
            rule_name = rule.get("rule", "")
            severity = rule.get("severity", "error")
            message = rule.get("message", f"Validation failed: {rule_name}")

            # Evaluate rule (simplified)
            # In production, implement proper rule evaluation
            if severity == "error":
                # Check rule condition
                # TODO: Implement rule checking logic
                pass

        # EN 15978 specific validation
        if standard == "EN 15978":
            errors.extend(self._validate_en15978(report))

        if errors:
            logger.warning(f"Validation found {len(errors)} error(s)")
        else:
            logger.info("Validation passed successfully")

        return errors

    def _validate_en15978(self, report: dict) -> list[str]:
        """
        Validate EN 15978 specific requirements.

        Args:
            report: Report dictionary

        Returns:
            List of validation errors
        """
        errors = []

        # Check life cycle stages (EN 15978 requires A1-A5, B1-B7, C1-C4, D)
        required_stages = ["A1_A3", "A4", "A5", "B1_B7", "C1_C4", "D"]
        life_cycle_data = report.get("carbon_budget", {}).get(
            "life_cycle_breakdown", {}
        )

        for stage in required_stages:
            if stage not in life_cycle_data:
                errors.append(f"Missing EN 15978 life cycle stage: {stage}")

        # Check carbon intensity
        carbon_intensity = report.get("carbon_budget", {}).get("current_intensity")
        if carbon_intensity is None:
            errors.append("Carbon intensity not calculated")

        # Check Fit for 55 compliance
        fit_for_55 = report.get("carbon_budget", {}).get("fit_for_55_compliant")
        if fit_for_55 is None:
            errors.append("Fit for 55 compliance status not determined")

        return errors


# Convenience functions for direct use


def load_template_config(standard: str, region: str) -> dict:
    """
    Load template configuration.

    Args:
        standard: Standard type
        region: Region

    Returns:
        Template configuration dictionary
    """
    engine = FirehorseReportEngine()
    return engine.load_template_config(standard, region)


def fetch_project_data(project_id: str) -> dict:
    """
    Fetch project data from DWS IQ platform.

    Args:
        project_id: Project identifier

    Returns:
        Project data dictionary
    """
    engine = FirehorseReportEngine()
    return engine.fetch_project_data(project_id)


def populate_template(template_path: str, data: dict) -> bytes:
    """
    Populate template with data and generate report.

    Args:
        template_path: Path to template file
        data: Data dictionary

    Returns:
        Generated report as bytes
    """
    engine = FirehorseReportEngine()

    # Load template from file
    with open(template_path, encoding="utf-8") as f:
        template_config = json.load(f)

    # Populate template
    populated = engine.populate_template(template_config, data)

    # Generate PDF by default
    return engine._generate_pdf(populated, "en")


def generate_carbon_report(project_id: str, standard: str = "EN 15978") -> bytes:
    """
    Generate EN 15978 carbon assessment report.

    Args:
        project_id: Project identifier
        standard: Carbon standard (default: 'EN 15978')

    Returns:
        Report content as bytes
    """
    engine = FirehorseReportEngine()
    return engine.generate_carbon_report(project_id, standard)


def export_report(content: bytes, format: str, output_path: str) -> str:
    """
    Export report to file.

    Args:
        content: Report content as bytes
        format: Output format
        output_path: Output directory path

    Returns:
        Full path to exported file
    """
    engine = FirehorseReportEngine()
    return engine.export_report(content, format, output_path)


def validate_compliance(report: dict, standard: str) -> list[str]:
    """
    Validate report compliance.

    Args:
        report: Report dictionary
        standard: Standard to validate against

    Returns:
        List of validation errors
    """
    engine = FirehorseReportEngine()
    return engine.validate_compliance(report, standard)


# Example usage
if __name__ == "__main__":
    # Initialize engine
    engine = FirehorseReportEngine(
        supabase_url="https://your-project.supabase.co",
        supabase_key="your-anon-key",
        templates_dir="templates",
    )

    # Example: Generate EN 15978 carbon report
    try:
        project_id = "PROJECT-001"

        # Generate report
        pdf_content = engine.generate_carbon_report(
            project_id=project_id,
            standard="EN 15978",
            language="en",
            output_format="PDF",
        )

        # Export to file
        output_file = engine.export_report(
            content=pdf_content,
            format="PDF",
            output_path="./reports",
            filename=f"carbon_report_{project_id}.pdf",
        )

        print(f"Report generated successfully: {output_file}")

    except Exception as e:
        print(f"Error generating report: {e}")
