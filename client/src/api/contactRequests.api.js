import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { createResourceApi } from './createResourceApi';

export function useSubmitContactRequest() {
  return useMutation({
    mutationFn: (payload) => api.post('/contact-requests', payload).then((envelope) => envelope.data),
  });
}

// Admin-side list/update(status)/delete against the same resource.
export const contactRequestsApi = createResourceApi('contact-requests', { label: 'Message' });
