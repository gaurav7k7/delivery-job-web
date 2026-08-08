import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { notify } from '../lib/toast';

export function useUpdateFooterConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.patch('/footer', payload).then((envelope) => envelope.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['footer'] });
      notify.success('Footer updated');
    },
  });
}
