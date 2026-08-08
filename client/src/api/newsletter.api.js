import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';

export function useSubscribeNewsletter() {
  return useMutation({
    mutationFn: (email) => api.post('/newsletter/subscribe', { email }).then((envelope) => envelope.data),
  });
}
