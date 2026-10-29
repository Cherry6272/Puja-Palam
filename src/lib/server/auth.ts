import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'pk_admin_session';

export interface AdminSessionPayload {
  email: string;
  role: 'admin';
  exp: number; // Unix timestamp in ms
}

export function getAdminAuthConfig(): {
  email?: string;
  password?: string;
  secret?: string;
  isConfigured: boolean;
} {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  const isConfigured = Boolean(
    email && email.trim() &&
    password && password.trim() &&
    secret && secret.trim()
  );

  return { email, password, secret, isConfigured };
}

/**
 * Creates an HMAC SHA-256 signed session token
 */
export async function createAdminSessionToken(email: string, secret: string): Promise<string> {
  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    role: 'admin',
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr, 'utf-8').toString('base64url');

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadB64));
  const signatureB64 = Buffer.from(signature).toString('base64url');

  return `${payloadB64}.${signatureB64}`;
}

/**
 * Verifies an HMAC SHA-256 session token
 */
export async function verifyAdminSessionToken(
  token: string,
  secret: string
): Promise<{ valid: boolean; payload?: AdminSessionPayload }> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return { valid: false };

    const [payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBuffer = Buffer.from(signatureB64, 'base64url');
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBuffer,
      encoder.encode(payloadB64)
    );

    if (!isValid) return { valid: false };

    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload: AdminSessionPayload = JSON.parse(payloadJson);

    if (!payload.exp || Date.now() > payload.exp) {
      return { valid: false };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

/**
 * Sets secure HTTP-only session cookie
 */
export async function setAdminSessionCookie(token: string): Promise<void> {
  cookies().set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

/**
 * Clears the session cookie
 */
export async function clearAdminSessionCookie(): Promise<void> {
  cookies().delete(SESSION_COOKIE_NAME);
}

