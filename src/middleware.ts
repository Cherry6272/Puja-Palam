import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes except /admin/login
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const secret = process.env.ADMIN_SESSION_SECRET;

    // If server secret is missing, fail closed and redirect to login
    if (!secret || !secret.trim()) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('error', 'config_missing');
      return NextResponse.redirect(loginUrl);
    }

    const sessionCookie = request.cookies.get('pk_admin_session')?.value;
    if (!sessionCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token using Web Crypto API in Edge runtime
    const isValid = await verifyEdgeSession(sessionCookie, secret.trim());
    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      const response = NextResponse.redirect(loginUrl);
      // Clean up invalid cookie
      response.cookies.delete('pk_admin_session');
      return response;
    }
  }

  return NextResponse.next();
}

async function verifyEdgeSession(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Decode base64url signature
    const base64Sig = signatureB64.replace(/-/g, '+').replace(/_/g, '/');
    const binarySig = atob(base64Sig);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const isSigValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(payloadB64)
    );

    if (!isSigValid) return false;

    // Decode base64url payload
    const base64Payload = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const payloadStr = atob(base64Payload);
    const payload = JSON.parse(payloadStr);

    if (!payload.exp || Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
