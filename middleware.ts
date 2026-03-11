import { NextRequest, NextResponse } from 'next/server';

const PASSWORD = process.env.SITE_PASSWORD || 'gfsctest';
const COOKIE_NAME = 'site-auth';

export function middleware(request: NextRequest) {
  // Check for auth cookie
  const authCookie = request.cookies.get(COOKIE_NAME);
  if (authCookie?.value === 'authenticated') {
    return NextResponse.next();
  }

  // Handle password submission
  if (request.method === 'POST' && request.nextUrl.pathname === '/__auth') {
    return handleLogin(request);
  }

  // Show login page for all other requests
  if (request.nextUrl.pathname === '/__auth') {
    return new NextResponse(loginHTML(), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Redirect to login
  const loginUrl = new URL('/__auth', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

async function handleLogin(request: NextRequest) {
  try {
    const formData = await request.formData();
    const password = formData.get('password') as string;
    const next = formData.get('next') as string || '/';

    if (password === PASSWORD) {
      const response = NextResponse.redirect(new URL(next, request.url));
      response.cookies.set(COOKIE_NAME, 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return response;
    }

    return new NextResponse(loginHTML('Incorrect password'), {
      status: 401,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch {
    return new NextResponse(loginHTML('Something went wrong'), {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

function loginHTML(error?: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ghost Forest Surf Club</title>
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
  </style>
</head>
<body>
  <div class="container">
    <p class="brand">Ghost Forest Surf Club</p>
    <h1>Enter Password</h1>
    ${error ? `<p class="error">${error}</p>` : ''}
    <form method="POST" action="/__auth">
      <input type="hidden" name="next" value="/" />
      <input type="password" name="password" placeholder="Password" autofocus required />
      <button type="submit">Enter</button>
    </form>
  </div>
</body>
</html>`;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)'],
};
