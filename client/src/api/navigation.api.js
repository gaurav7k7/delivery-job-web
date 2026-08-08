import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function useNavigation(location = 'header') {
  return useQuery({
    queryKey: ['navigation', location],
    queryFn: () => api.get(`/navigation/location/${location}`).then((envelope) => envelope.data),
    staleTime: 5 * 60 * 1000,
  });
}
