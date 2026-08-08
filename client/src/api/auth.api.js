import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { notify } from '../lib/toast';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (credentials) => api.post('/auth/login', credentials).then((envelope) => envelope.data),
    onSuccess: (user) => {
      setUser(user);
      notify.success(`Welcome back, ${user.name.split(' ')[0]}`);
    },
  });
}

export function useLogout() {
  const clear = useAuthStore((s) => s.clear);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      clear();
      queryClient.clear();
    },
  });
}

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/auth/me').then((envelope) => envelope.data),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
    meta: {
      onSuccess: setUser,
      onError: clear,
    },
  });
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload) => api.patch('/auth/me', payload).then((envelope) => envelope.data),
    onSuccess: (user) => {
      setUser(user);
      notify.success('Profile updated');
    },
    onError: (err) => notify.error(err.message),
  });
}

export function useChangePassword() {
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: (payload) => api.post('/auth/change-password', payload),
    onSuccess: () => {
      // The backend revokes the session on password change — the cookie is
      // already cleared server-side, so drop local state too.
      clear();
      notify.success('Password changed. Please sign in again.');
    },
    onError: (err) => notify.error(err.message),
  });
}
