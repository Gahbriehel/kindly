/**
 * Extracts initials from a full name.
 * - Single word → first 2 chars uppercased (e.g. "Adaeze" → "AD")
 * - Multi-word → first char of first two words uppercased (e.g. "John Doe" → "JD")
 * Strips "&" connectors before processing.
 */
export function getInitials(name: string): string {
  if (!name) return "";
  const parts = name
    .trim()
    .split(/\s+/)
    .filter((part) => part && part !== "&");
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
