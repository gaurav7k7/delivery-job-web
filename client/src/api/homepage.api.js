import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { notify } from '../lib/toast';

// Homepage is a singleton document (server/src/models/Homepage.model.js),
// not a list resource — doesn't fit createResourceApi's shape.
export function useHomepage() {
  return useQuery({
    queryKey: ['homepage'],
    queryFn: () => api.get('/homepage').then((envelope) => envelope.data),
  });
}

export function useUpdateHomepage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.patch('/homepage', payload).then((envelope) => envelope.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homepage'] });
      notify.success('Homepage layout updated');
    },
  });
}
