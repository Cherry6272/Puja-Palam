import { loginAdmin, logoutAdmin, verifyAdminSession } from '@/app/actions/auth';

/**
 * Consolidated Admin Authentication Helper
 * All credential validation and session signing happens strictly on the server.
 */
export const adminAuth = {
  async login(email: string, password: string): Promise<{ success: boolean; error?: string; isConfigurationError?: boolean }> {
    return loginAdmin({ email, password });
  },

  async logout(): Promise<void> {
    await logoutAdmin();
  },

  async checkSession(): Promise<{ authenticated: boolean; email?: string; isConfigured: boolean }> {
    return verifyAdminSession();
  },
};
