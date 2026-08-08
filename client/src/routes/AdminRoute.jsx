import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMe } from '../api/auth.api';

export function AdminRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  // Revalidates the persisted session against the server on every app boot;
  // once the real backend is live, an invalid/expired session 401s here and
  // authStore.clear() (wired via meta.onError in useMe) redirects below.
  useMe();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
