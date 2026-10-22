/**
 * Converts an HTML string (such as one produced by a rich text editor)
 * into clean plain text for editing in a text area or message input.
 *
 * Example:
 * "<p>Happy&nbsp;married&nbsp;life</p><p></p>" -> "Happy married life"
 */
export function htmlToPlainText(html: string): string {
  if (!html) return "";

  let text = html;

  // Replace line break tags
  text = text.replace(/<br\s*\/?>/gi, "\n");

  // Handle closing block tags by appending newlines
  text = text.replace(/<\/(p|div|h[1-6]|tr)>/gi, "\n\n");
  text = text.replace(/<\/li>/gi, "\n");

  // Format list items
  text = text.replace(/<li[^>]*>/gi, "• ");

  // Strip all other HTML tags
  text = text.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&ndash;/gi, "–")
    .replace(/&mdash;/gi, "—")
    .replace(/&bull;/gi, "•");

  // Collapse multiple horizontal whitespaces (except newlines)
  text = text
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n");

  // Collapse more than two consecutive newlines into two
  text = text.replace(/\n{3,}/g, "\n\n");

  return text.trim();
}
