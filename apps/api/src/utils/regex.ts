/**
 * Escapes special regular-expression characters in untrusted user query strings
 * to prevent SyntaxError crashes and ReDoS attacks in MongoDB regex filters.
 */
export function escapeRegex(raw: string): string {
  return raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
