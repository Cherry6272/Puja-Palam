import { AdminSession, AdminUser } from '@/types';

const ADMIN_SESSION_KEY = 'pk_admin_session_v2';
const DEFAULT_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'samptrapthi2026';

const DEFAULT_ADMIN_USER: AdminUser = {
  id: 'admin-01',
  name: 'Lead Ritual Operations',
  email: 'admin@samptrapthi.com',
  role: 'super_admin',
};

export const adminAuth = {
  getAdminSession(): AdminSession | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!stored) return null;
      const session: AdminSession = JSON.parse(stored);
      if (Date.now() > session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getAdminSession() !== null;
  },

  login(emailInput: string, passwordInput: string): { success: boolean; error?: string } {
    if (!emailInput || !emailInput.trim()) {
      return { success: false, error: 'Please enter your admin email address.' };
    }
    if (!passwordInput || !passwordInput.trim()) {
      return { success: false, error: 'Please enter the admin security password.' };
    }

    if (passwordInput !== DEFAULT_PASSWORD) {
      return { success: false, error: 'Incorrect admin credentials. Please verify your access key.' };
    }

    const session: AdminSession = {
      token: `pk-admin-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      user: {
        ...DEFAULT_ADMIN_USER,
        email: emailInput.trim(),
      },
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    try {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
      // Also write cookie for middleware / server compatibility
      document.cookie = `pk_admin_session=${session.token}; path=/; max-age=86400; SameSite=Lax`;
    } catch {
      // ignore
    }

    return { success: true };
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      document.cookie = 'pk_admin_session=; path=/; max-age=0; SameSite=Lax';
    } catch {
      // ignore
    }
  },
};
