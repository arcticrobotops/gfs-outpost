/**
 * Format a price for display.
 * Whole-dollar amounts omit decimals; fractional amounts show two decimals.
 */
export function formatPrice(amount: number): string {
  return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
}

/**
 * Format a price range string (e.g. "$45–$60").
 */
export function formatPriceRange(min: number, max: number): string {
  if (min === max) return formatPrice(min);
  return `$${Math.round(min)}\u2013$${Math.round(max)}`;
}

/**
 * Deterministic hash of a string handle to a positive integer.
 */
export function hashHandle(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
