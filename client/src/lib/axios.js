import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // required for the httpOnly secure-cookie auth session (Phase 5)
  timeout: 15000,
});

// Unwraps { success, statusCode, message, data, meta } on success, and
// normalizes every failure (network error, validation error, 401, ...) into
// the same { statusCode, message, fieldErrors } shape so calling code never
// has to branch on error source.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const payload = error.response?.data;
    return Promise.reject({
      statusCode: payload?.statusCode ?? error.response?.status ?? 500,
      message: payload?.message || error.message || 'Something went wrong',
      fieldErrors: payload?.errors || null,
    });
  }
);
