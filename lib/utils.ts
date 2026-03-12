/**
 * Format a price for display.
 * Whole-dollar amounts omit decimals; fractional amounts show two decimals.
 */
export function formatPrice(amount: number): string {
  return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
}

/**
 * Sanitize HTML by stripping <script> tags and on* event handler attributes.
 */
export function sanitizeHtml(html: string): string {
  // Remove <script> tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove on* event handler attributes (e.g. onclick, onerror, onload)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  return sanitized;
}

/**
 * Deterministic hash of a string handle to a positive integer.
 */
export function hashHandle(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
