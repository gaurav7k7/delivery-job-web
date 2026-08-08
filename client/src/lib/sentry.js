import * as Sentry from '@sentry/react';

// Optional — same graceful-degradation pattern as the backend (instrument.js)
// and Redis caching: with no VITE_SENTRY_DSN configured, initSentry() is a
// no-op and every Sentry.* call elsewhere (ErrorBoundary) stays safe to call.
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
  });
}

export { Sentry };
