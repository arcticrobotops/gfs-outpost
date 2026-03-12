import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PASSWORD = process.env.SITE_PASSWORD;

// Issue #26: Validate SITE_PASSWORD is set at startup
if (!PASSWORD) {
  console.error('FATAL: Missing required environment variable: SITE_PASSWORD');
}

// Issue #5: No fallback secret — require AUTH_SECRET at runtime
function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('Missing required environment variable: AUTH_SECRET');
  }
  return secret;
}

const COOKIE_NAME = 'site-auth';
const TOKEN_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// Issue #2: In-memory rate limiter — max 5 attempts per 60s per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Validate that `next` is a safe relative path (starts with `/`, not `//`). */
function sanitizeNext(raw: string | null): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

/** Create an HMAC-signed auth token. */
function createSignedToken(): string {
  const payload = Date.now().toString();
  // Note: This uses Node.js crypto (available in API routes / Node runtime).
  // The middleware uses Web Crypto API (globalThis.crypto.subtle) because
  // Next.js middleware runs in the Edge runtime which does not have Node.js crypto.
  const hmac = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  return `${payload}.${hmac}`;
}

/** Verify an HMAC-signed auth token with expiration check. */
export function verifySignedToken(token: string): boolean {
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signature] = parts;

  // Issue #4: Reject tokens older than 30 days
  const timestamp = parseInt(payload, 10);
  if (isNaN(timestamp) || Date.now() - timestamp > TOKEN_MAX_AGE_MS) {
    return false;
  }

  const expected = crypto.createHmac('sha256', getAuthSecret()).update(payload).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const next = sanitizeNext(request.nextUrl.searchParams.get('next'));
  return new NextResponse(loginHTML(next), {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(request: NextRequest) {
  if (!PASSWORD) {
    return new NextResponse(loginHTML('/', 'Site password is not configured'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Issue #11: CSRF — validate Origin header
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && host) {
    try {
      const originHost = new URL(origin).host;
      if (originHost !== host) {
        return new NextResponse(loginHTML('/', 'Invalid request origin'), {
          status: 403,
          headers: { 'Content-Type': 'text/html' },
        });
      }
    } catch {
      return new NextResponse(loginHTML('/', 'Invalid request origin'), {
        status: 403,
        headers: { 'Content-Type': 'text/html' },
      });
    }
  }

  // Issue #2: Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (isRateLimited(ip)) {
    return new NextResponse(loginHTML('/', 'Too many attempts. Please try again later.'), {
      status: 429,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const next = sanitizeNext(formData.get('next') as string);

    // Timing-safe password comparison
    const passwordBuffer = Buffer.from(password);
    const expectedBuffer = Buffer.from(PASSWORD);
    const isValid =
      passwordBuffer.length === expectedBuffer.length &&
      crypto.timingSafeEqual(passwordBuffer, expectedBuffer);

    if (isValid) {
      // 303 See Other — ensures the browser follows the redirect with GET (not POST)
      const response = NextResponse.redirect(new URL(next, request.url), 303);
      response.cookies.set(COOKIE_NAME, createSignedToken(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    return new NextResponse(loginHTML(next, 'Incorrect password'), {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch {
    return new NextResponse(loginHTML('/', 'Something went wrong'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function loginHTML(next: string, error?: string) {
  const safeNext = escapeHtml(next);
  const safeError = error ? escapeHtml(error) : '';
  const errorId = 'password-error';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ghost Forest Surf Club</title>
  <meta name="description" content="Coldwater surf goods from Station 45°N. Neskowin, Oregon. Est. 2024.">
  <meta property="og:title" content="Ghost Forest Surf Club — Outpost">
  <meta property="og:description" content="Coldwater surf goods from Station 45°N. Neskowin, Oregon. Est. 2024.">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #e5e5e5;
    }
    .container {
      text-align: center;
      padding: 2rem;
      max-width: 360px;
      width: 100%;
    }
    .brand {
      font-size: 11px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 2rem;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 300;
      margin-bottom: 2rem;
      color: #ccc;
    }
    form { display: flex; flex-direction: column; gap: 1rem; }
    input[type="password"] {
      padding: 12px 16px;
      background: #2a2a2a;
      border: 1px solid #333;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 14px;
      text-align: center;
      outline: none;
      transition: border-color 0.2s;
    }
    input[type="password"]:focus { border-color: #555; }
    button {
      padding: 12px 16px;
      background: #333;
      border: 1px solid #444;
      border-radius: 6px;
      color: #e5e5e5;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #444; }
    .error {
      color: #e57373;
      font-size: 13px;
      margin-bottom: 0.5rem;
    }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border-width: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="brand">Ghost Forest Surf Club</p>
    <h1>Enter Password</h1>
    ${safeError ? `<p class="error" id="${errorId}" role="alert">${safeError}</p>` : ''}
    <form method="POST" action="/api/auth">
      <input type="hidden" name="next" value="${safeNext}" />
      <label for="password" class="sr-only">Password</label>
      <input type="password" name="password" id="password" placeholder="Password" autocomplete="current-password" autofocus required${safeError ? ` aria-describedby="${errorId}"` : ''} />
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}
