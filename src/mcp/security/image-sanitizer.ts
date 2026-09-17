import logger from '../../utils/logger.js';

/**
 * Image Prompt Injection Detector
 * 
 * Detects suspicious patterns in OCR text extracted from images.
 * 
 * Based on:
 * - Simon Willison: "Unseeable prompt injections in screenshots" (2025-10-21)
 * - https://simonwillison.net/2025/Oct/21/unseeable-prompt-injections/
 */
export class ImagePromptInjectionDetector {
  // Suspicious patterns in image OCR text
  private static readonly INJECTION_PATTERNS = [
    /(ignore\s+(all\s+)?(previous\s+)?instructions?)/i,
    /(system\s*:\s*you\s+are)/i,
    /(execute\s+the\s+following)/i,
    /(send\s+(to|data\s+to)\s+https?:\/\/)/i,
    /(exfiltrat)/i,
    /(hidden\s+instruction)/i
  ];

  /**
   * Scan extracted text for injection patterns
   * 
   * @param text Text extracted via OCR from an image
   * @returns Array of detected patterns or empty array if clean
   */
  public static scanText(text: string): string[] {
    const detected: string[] = [];
    
    for (const pattern of this.INJECTION_PATTERNS) {
      const match = text.match(pattern);
      if (match) {
        detected.push(match[0]);
      }
    }

    if (detected.length > 0) {
      logger.warn('Detected prompt injection pattern in image text', { 
        count: detected.length,
        patterns: detected 
      });
    }

    return detected;
  }

  /**
   * Simple brightness/contrast check to detect "unseeable" text
   * (Placeholder for more complex pixel analysis)
   * 
   * In November 2025, low-contrast text was the primary vector.
   */
  public static isSuspiciouslyLowContrast(avgBrightness: number, textBrightness: number): boolean {
    const diff = Math.abs(avgBrightness - textBrightness);
    // If text color is very close to background color, it's suspicious
    return diff < 5; // Threshold from Simon Willison's research
  }
}
