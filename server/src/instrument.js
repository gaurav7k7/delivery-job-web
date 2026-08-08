// Must be the first thing imported in server.js — Sentry's Node SDK relies on
// OpenTelemetry auto-instrumentation that has to wrap modules (express,
// mongoose, http) before *they* get imported elsewhere in the app.
//
// Optional, same graceful-degradation pattern as Redis (config/redis.js):
// with no SENTRY_DSN configured, this is a no-op and the app runs identically.
import * as Sentry from '@sentry/node';
import { env, isProduction } from './config/env.js';

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    // Full tracing in dev/staging is cheap; sampled in production to control
    // event volume/cost as real traffic arrives.
    tracesSampleRate: isProduction ? 0.2 : 1.0,
  });
}
