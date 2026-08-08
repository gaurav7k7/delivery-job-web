import Redis from 'ioredis';
import { env } from './env.js';

// Redis is optional (Phase 1 SRS §10 — "Redis (optional caching)"). When
// REDIS_URL isn't set, this stays null and every consumer (cache.middleware.js)
// checks for that and no-ops, so the app runs identically with or without it.
let client = null;

if (env.REDIS_URL) {
  client = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => Math.min(times * 200, 2000),
    lazyConnect: false,
  });

  client.on('connect', () => console.log('[redis] connected'));
  client.on('error', (err) => console.error('[redis] error:', err.message));
}

export default client;
