'use server';

import { cookies } from 'next/headers';

export async function loginAdmin(password: string) {
  // In a real application, this would check a database hash.
  // For the MVP, we use an environment variable (not exposed to the client).
  // IMPORTANT: Set ADMIN_PASSWORD in your production environment variables.
  const correctPassword = process.env.ADMIN_PASSWORD || 'samptrapthi2026';

  if (password === correctPassword) {
    cookies().set('pk_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Invalid admin password.' };
}

export async function logoutAdmin() {
  cookies().delete('pk_admin_session');
}
