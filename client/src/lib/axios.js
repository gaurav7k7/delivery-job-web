import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true, // required for the httpOnly secure-cookie auth session (Phase 5)
  timeout: 15000,
});

// Without this guard Axios falls back to the frontend origin when the Vite
// variable is missing. That can make a failed production submission look like
// a successful form interaction while no API request was ever made.
api.interceptors.request.use((config) => {
  if (!apiBaseUrl) {
    return Promise.reject(new Error('The website API is not configured. Please contact support.'));
  }
  return config;
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
