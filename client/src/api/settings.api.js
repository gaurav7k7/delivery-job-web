import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((envelope) => envelope.data),
    staleTime: 5 * 60 * 1000,
  });
}
