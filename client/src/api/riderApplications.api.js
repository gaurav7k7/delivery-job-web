import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { createResourceApi } from './createResourceApi';

// Public lead-capture submission — the core "Become a Rider" conversion
// funnel (server/src/controllers/riderApplication.controller.js).
export function useSubmitRiderApplication() {
  return useMutation({
    mutationFn: (payload) => api.post('/rider-applications', payload).then((envelope) => envelope.data),
  });
}

// Admin-side list/update/delete against the same resource — there's no
// admin "create" here since leads only ever originate from the public form.
export const riderApplicationsApi = createResourceApi('rider-applications', { label: 'Rider application' });
