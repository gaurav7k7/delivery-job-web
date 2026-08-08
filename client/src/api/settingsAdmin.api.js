import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { notify } from '../lib/toast';

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.patch('/settings', payload).then((envelope) => envelope.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      notify.success('Site settings updated');
    },
  });
}
