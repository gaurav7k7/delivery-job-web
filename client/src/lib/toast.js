import { toast } from 'sonner';

// Thin wrapper so every module calls the same four verbs instead of importing
// sonner directly everywhere — keeps copy/styling decisions in one place.
export const notify = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  info: (message) => toast(message),
  promise: (promise, messages) => toast.promise(promise, messages),
};
