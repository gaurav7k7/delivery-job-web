import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => api.get('/dashboard/stats').then((envelope) => envelope.data),
    staleTime: 60 * 1000,
  });
}

export function useActivityLog() {
  return useQuery({
    queryKey: ['admin', 'logs'],
    queryFn: () => api.get('/activity-logs?limit=10').then((envelope) => envelope.data),
    staleTime: 30 * 1000,
  });
}
