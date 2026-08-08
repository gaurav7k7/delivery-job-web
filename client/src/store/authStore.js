import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Persists only enough to optimistically render the shell (avoid a login-page
// flash on reload) — session validity is still re-checked via useMe() against
// GET /auth/me on every app boot; the real backend's httpOnly cookie remains
// the actual source of truth once Phase 5's Auth module is live.
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
      clear: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: 'zerivon-admin-session' }
  )
);

// Mirrors the backend's authorize() middleware: an isSystem role (Super
// Admin) bypasses checks entirely, everyone else needs the permission's key
// among their role's populated Permission objects.
export function hasPermission(user, permission) {
  if (!user?.role) return false;
  if (user.role.isSystem) return true;
  if (!permission) return true;
  return (user.role.permissions || []).some((p) => (typeof p === 'string' ? p === permission : p?.key === permission));
}
