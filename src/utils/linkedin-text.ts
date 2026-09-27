/**
 * LinkedIn post text helpers.
 *
 * `/rest/posts` commentary uses "little" text — reserved chars must be escaped
 * or the API silently truncates. `/v2/ugcPosts` shareCommentary is plain text
 * (Unicode OK) but still benefits from NFC so ä/ö/å stay as single code points.
 *
 * Little reserved: \ | { } @ [ ] ( ) < > # * _ ~
 * @see https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/little-text-format
 */

/** NFC so Scandinavian letters are single code points (ä not a + combining diaeresis). */
export function normalizeLinkedInText(text: string): string {
  return text.normalize('NFC');
}

/**
 * Escape LinkedIn little-text reserved characters for `/rest/posts` commentary.
 * Backslash first so escapes are not double-escaped.
 */
export function escapeLinkedInLittleText(text: string): string {
  return normalizeLinkedInText(text).replace(/([\\|{}@[\]()<>#*_~])/g, '\\$1');
}
