import { QueryClient, QueryCache } from '@tanstack/react-query';
import { notify } from './toast';

// TanStack Query v5 removed per-query onSuccess/onError callbacks from
// useQuery; the documented replacement is a global QueryCache handler that
// dispatches to `query.meta.onSuccess` / `query.meta.onError` when a query
// declares them (see src/api/auth.api.js's useMe for the consumer side).
const queryCache = new QueryCache({
  onSuccess: (data, query) => {
    query.meta?.onSuccess?.(data);
  },
  onError: (error, query) => {
    query.meta?.onError?.(error);
    if (query.meta?.silent) return;
    notify.error(error?.message || 'Something went wrong');
  },
});

export const queryClient = new QueryClient({
  queryCache,
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
