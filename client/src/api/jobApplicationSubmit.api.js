import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/axios';

// Public application submission — multipart/form-data with the resume file.
// Axios sets the correct multipart Content-Type (with boundary)
// automatically when the body is a FormData instance; setting it manually
// would drop the boundary and break the request.
export function useSubmitJobApplication() {
  return useMutation({
    mutationFn: (formData) => api.post('/job-applications', formData).then((envelope) => envelope.data),
  });
}
