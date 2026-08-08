import { useAuthStore, hasPermission } from '../../store/authStore';

// UI-layer convenience only (Phase 3 §9) — hides actions the user can't
// perform so they never see a control that would 403. The API is always the
// real enforcement; this is not a security boundary on its own.
export function PermissionGate({ permission, fallback = null, children }) {
  const user = useAuthStore((s) => s.user);

  if (!permission || hasPermission(user, permission)) {
    return children;
  }

  return fallback;
}
