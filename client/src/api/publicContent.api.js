import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

// Every public read-only content endpoint (server/src/routes/*.routes.js's
// `/public` sub-routes) shares this one hook instead of a bespoke file per
// resource — there's no mutation, pagination, or admin auth involved here.
export function usePublicContent(resource, path = '/public', options = {}) {
  return useQuery({
    queryKey: ['public', resource, path],
    queryFn: () => api.get(`/${resource}${path}`).then((envelope) => envelope.data),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}
