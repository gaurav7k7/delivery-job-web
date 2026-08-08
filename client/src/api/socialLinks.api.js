import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function useSocialLinks() {
  return useQuery({
    queryKey: ['socialLinks'],
    queryFn: () => api.get('/social-links/public').then((envelope) => envelope.data),
    staleTime: 5 * 60 * 1000,
  });
}
