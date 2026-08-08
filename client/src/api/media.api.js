import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';

// FormData is passed straight through — axios/the browser set the
// multipart Content-Type header (with boundary) automatically, so this must
// never set that header manually or the boundary goes missing.
export function useUploadMedia() {
  return useMutation({
    mutationFn: (formData) => api.post('/media/upload', formData).then((envelope) => envelope.data),
  });
}
