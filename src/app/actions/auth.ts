'use server';

import crypto from 'crypto';
import { cookies } from 'next/headers';
import {
  getAdminAuthConfig,
  createAdminSessionToken,
  verifyAdminSessionToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from '@/lib/server/auth';

export async function loginAdmin(formData: { email?: string; password?: string }) {
  const { email: envEmail, password: envPassword, secret, isConfigured } = getAdminAuthConfig();

  if (!isConfigured || !envEmail || !envPassword || !secret) {
    return {
      success: false,
      error: 'Server authentication is not configured. Missing required ADMIN_EMAIL, ADMIN_PASSWORD, or ADMIN_SESSION_SECRET environment variables.',
      isConfigurationError: true,
    };
  }

  const inputEmail = (formData.email || '').trim().toLowerCase();
  const inputPassword = formData.password || '';

  if (!inputEmail || !inputPassword) {
    return {
      success: false,
      error: 'Please enter both admin email and password.',
    };
  }

  // Constant-time comparison for password and email
  const targetEmail = envEmail.trim().toLowerCase();
  const emailBuffer = Buffer.from(inputEmail);
  const targetEmailBuffer = Buffer.from(targetEmail);
  const isEmailMatch =
    emailBuffer.length === targetEmailBuffer.length &&
    crypto.timingSafeEqual(emailBuffer, targetEmailBuffer);

  const passBuffer = Buffer.from(inputPassword);
  const targetPassBuffer = Buffer.from(envPassword);
  const isPasswordMatch =
    passBuffer.length === targetPassBuffer.length &&
    crypto.timingSafeEqual(passBuffer, targetPassBuffer);

  if (!isEmailMatch || !isPasswordMatch) {
    return {
      success: false,
      error: 'Invalid admin credentials.',
    };
  }

  // Generate signed expiring session token
  const token = await createAdminSessionToken(inputEmail, secret);
  await setAdminSessionCookie(token);

  return { success: true };
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  return { success: true };
}

export async function verifyAdminSession() {
  const { secret, isConfigured } = getAdminAuthConfig();
  if (!isConfigured || !secret) {
    return { authenticated: false, isConfigured: false };
  }

  const token = cookies().get('pk_admin_session')?.value;
  if (!token) {
    return { authenticated: false, isConfigured: true };
  }

  const verification = await verifyAdminSessionToken(token, secret);
  return {
    authenticated: verification.valid,
    email: verification.payload?.email,
    isConfigured: true,
  };
}
