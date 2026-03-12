/**
 * Format a price for display.
 * Whole-dollar amounts omit decimals; fractional amounts show two decimals.
 */
export function formatPrice(amount: number): string {
  return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
}

/**
 * Allowlist of safe HTML tags and their permitted attributes.
 * Everything not on the list is stripped.
 */
const ALLOWED_TAGS: Record<string, string[]> = {
  p: [],
  br: [],
  strong: [],
  em: [],
  b: [],
  i: [],
  ul: [],
  ol: [],
  li: [],
  a: ['href'],
  h2: [],
  h3: [],
  h4: [],
  span: [],
  div: [],
};

/**
 * Sanitize HTML using an allowlist-based approach.
 * Only permits safe tags defined in ALLOWED_TAGS.
 * For <a> tags, only http/https href values are permitted.
 * All other tags and attributes are stripped.
 */
export function sanitizeHtml(html: string): string {
  // Process the HTML character by character, parsing tags
  let result = '';
  let i = 0;

  while (i < html.length) {
    if (html[i] === '<') {
      // Find the end of the tag
      const closeIndex = html.indexOf('>', i);
      if (closeIndex === -1) {
        // Malformed — skip the rest
        break;
      }

      const tagContent = html.slice(i + 1, closeIndex).trim();

      // Check for closing tag
      if (tagContent.startsWith('/')) {
        const tagName = tagContent.slice(1).trim().toLowerCase().split(/\s/)[0];
        if (tagName in ALLOWED_TAGS) {
          result += `</${tagName}>`;
        }
        // else: strip the closing tag
      } else {
        // Opening or self-closing tag
        // Parse tag name
        const match = tagContent.match(/^([a-zA-Z][a-zA-Z0-9]*)/);
        if (match) {
          const tagName = match[1].toLowerCase();
          const isSelfClosing = tagContent.endsWith('/');

          if (tagName in ALLOWED_TAGS) {
            const allowedAttrs = ALLOWED_TAGS[tagName];
            let sanitizedTag = `<${tagName}`;

            // Parse and filter attributes
            if (allowedAttrs.length > 0) {
              const attrRegex = /([a-zA-Z][a-zA-Z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+))/g;
              const attrSource = tagContent.slice(match[0].length);
              let attrMatch;
              while ((attrMatch = attrRegex.exec(attrSource)) !== null) {
                const attrName = attrMatch[1].toLowerCase();
                const attrValue = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? '';

                if (allowedAttrs.includes(attrName)) {
                  // For href, only allow http and https protocols
                  if (attrName === 'href') {
                    const trimmed = attrValue.trim().toLowerCase();
                    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
                      continue;
                    }
                  }
                  // Escape attribute value
                  const safeValue = attrValue
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                  sanitizedTag += ` ${attrName}="${safeValue}"`;
                }
              }
            }

            sanitizedTag += isSelfClosing ? ' />' : '>';
            result += sanitizedTag;
          }
          // else: tag not allowed — strip it (content outside will still be kept)
        }
      }

      i = closeIndex + 1;
    } else {
      result += html[i];
      i++;
    }
  }

  return result;
}

/**
 * Deterministic hash of a string handle to a positive integer.
 */
export function hashHandle(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}
