import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import { notify } from '../lib/toast';

// Media is not a plain CRUD resource (createResourceApi doesn't fit — there
// is no create-with-a-form, only upload-a-file), so it gets its own hooks.
export function useMediaList(params = {}) {
  return useQuery({
    queryKey: ['media', 'list', params],
    queryFn: () => api.get('/media', { params }).then((envelope) => ({ items: envelope.data, meta: envelope.meta })),
    placeholderData: (prev) => prev,
  });
}

export function useUploadMediaFiles() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => api.post('/media/upload', formData).then((envelope) => envelope.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      notify.success('Uploaded');
    },
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/media/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      notify.success('Deleted');
    },
  });
}
