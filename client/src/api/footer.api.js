import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function useFooterConfig() {
  return useQuery({
    queryKey: ['footer'],
    queryFn: () => api.get('/footer').then((envelope) => envelope.data),
    staleTime: 5 * 60 * 1000,
  });
}
