"""
Image Prompt Injection Detector

Detects and sanitizes prompt injection attempts in images.

Based on:
- Simon Willison: "Unseeable prompt injections in screenshots" (2025-10-21)
- https://simonwillison.net/2025/Oct/21/unseeable-prompt-injections/
- Brave Security: Comet browser exploitation research

Attack Vector:
- Text on an image that's imperceptible to the human eye
- Contains instructions interpreted by LLM (e.g., Claude's vision)
- Examples: white text on white background, 1px font size
"""

import logging
import re

logger = logging.getLogger(__name__)

try:
    from PIL import Image, ImageDraw, ImageStat

    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    logger.warning("PIL not available - image sanitization disabled")

try:
    import pytesseract

    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    logger.warning("pytesseract not available - OCR detection disabled")


class ImagePromptInjectionDetector:
    """
    Detect and sanitize prompt injection attempts in images.
    """

    # Suspicious patterns in image OCR text
    INJECTION_PATTERNS = [
        r"(?i)ignore\s+(?:all\s+)?(?:previous\s+)?instructions?",
        r"(?i)system\s*:\s*you\s+are",
        r"(?i)execute\s+the\s+following",
        r"(?i)send\s+(?:to|data\s+to)\s+https?://",
        r"(?i)exfiltrat",
        r"(?i)(?:extract|read|fetch)\s+.*?\s+(?:from\s+)?(?:database|file|system)",
        r"https?://(?:webhook\.site|requestbin\.com|pipedream\.com)",
        r"(?i)forget\s+(?:all\s+)?(?:previous\s+)?(?:instructions?|context)",
        r"(?i)new\s+instructions?",
        r"(?i)disregard\s+(?:all\s+)?(?:previous|above)",
    ]

    # Low-contrast text detection thresholds
    MIN_CONTRAST_RATIO = 1.5  # WCAG AA minimum is 4.5, we use lower to catch attempts
    LOW_VARIANCE_THRESHOLD = 100  # Empirically determined for grayscale variance

    @classmethod
    def scan_image(cls, image_path: str) -> tuple[bool, list[str]]:
        """
        Scan image for prompt injection attempts.

        Args:
            image_path: Path to image file

        Returns:
            (is_suspicious, reasons)
        """
        if not PIL_AVAILABLE:
            return False, ["PIL not available - skipping image scan"]

        reasons = []

        try:
            img = Image.open(image_path)

            # 1. Low-contrast text detection
            if cls._has_low_contrast_text(img):
                reasons.append(
                    "Low-contrast text detected (possible hidden instructions)"
                )

            # 2. OCR extraction and pattern matching (if available)
            if TESSERACT_AVAILABLE:
                try:
                    ocr_text = pytesseract.image_to_string(img)

                    # Pattern matching
                    for pattern in cls.INJECTION_PATTERNS:
                        if re.search(pattern, ocr_text):
                            reasons.append(f"Suspicious pattern detected: {pattern}")

                    # Suspiciously long text in image
                    if len(ocr_text) > 500:
                        reasons.append(
                            f"Unusually long text in image: {len(ocr_text)} characters"
                        )
                except Exception as e:
                    logger.warning(f"OCR failed for {image_path}: {e}")

        except Exception as e:
            logger.error(f"Error scanning image {image_path}: {e}")
            return False, [f"Scan failed: {e}"]

        if reasons:
            logger.warning(
                f"Suspicious image detected: {image_path}\nReasons: {reasons}"
            )

        return len(reasons) > 0, reasons

    @classmethod
    def _has_low_contrast_text(cls, img: Image.Image) -> bool:
        """
        Detect low-contrast text (e.g., white on white).
        Uses simple variance analysis on grayscale image.
        """
        try:
            # Convert to grayscale
            grayscale = img.convert("L")

            # Calculate statistics
            stat = ImageStat.Stat(grayscale)
            variance = stat.var[0]  # Variance of grayscale channel

            # Low variance = low contrast (likely hidden text)
            return variance < cls.LOW_VARIANCE_THRESHOLD

        except Exception as e:
            logger.warning(f"Low contrast detection failed: {e}")
            return False

    @classmethod
    def sanitize_image(cls, image_path: str, output_path: str) -> None:
        """
        Sanitize image by removing text overlay.
        Creates a clean version with OCR text removed.

        Args:
            image_path: Input image path
            output_path: Output path for sanitized image
        """
        if not PIL_AVAILABLE or not TESSERACT_AVAILABLE:
            logger.warning("Cannot sanitize image - dependencies not available")
            return

        try:
            img = Image.open(image_path)

            # Use pytesseract to get text bounding boxes
            ocr_data = pytesseract.image_to_data(
                img, output_type=pytesseract.Output.DICT
            )

            # Create drawing context
            draw = ImageDraw.Draw(img)

            # Redact all text regions with white boxes
            for i in range(len(ocr_data["text"])):
                if ocr_data["text"][i].strip():  # If text exists
                    x, y, w, h = (
                        ocr_data["left"][i],
                        ocr_data["top"][i],
                        ocr_data["width"][i],
                        ocr_data["height"][i],
                    )
                    draw.rectangle([x, y, x + w, y + h], fill="white")

            img.save(output_path)
            logger.info(f"Sanitized image saved to: {output_path}")

        except Exception as e:
            logger.error(f"Error sanitizing image {image_path}: {e}")
            raise
