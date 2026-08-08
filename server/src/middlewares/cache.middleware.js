import redis from '../config/redis.js';

/**
 * Cache-aside for public GET routes. A no-op when Redis isn't configured —
 * every route that uses this behaves identically with or without a Redis
 * instance provisioned, so it's safe to ship on routes today even though no
 * environment has REDIS_URL set yet.
 *
 * Patches res.send() rather than res.json() — Express's res.json() sets the
 * Content-Type header and then delegates to res.send() internally, so
 * patching send() transparently covers both plain JSON API routes and
 * non-JSON responses (e.g. the XML sitemap) with one code path, storing the
 * content-type alongside the body so a cache HIT restores it correctly.
 */
export function cacheResponse(ttlSeconds = 60) {
  return async (req, res, next) => {
    if (!redis || req.method !== 'GET') return next();

    const key = `cache:${req.originalUrl}`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        const { contentType, body } = JSON.parse(cached);
        res.setHeader('X-Cache', 'HIT');
        if (contentType) res.type(contentType);
        return res.send(body);
      }
    } catch (err) {
      console.error('[cache] read error:', err.message);
    }

    res.setHeader('X-Cache', 'MISS');
    const originalSend = res.send.bind(res);
    res.send = (body) => {
      if (res.statusCode < 400) {
        const payload = JSON.stringify({ contentType: res.get('Content-Type'), body });
        redis.set(key, payload, 'EX', ttlSeconds).catch((err) => {
          console.error('[cache] write error:', err.message);
        });
      }
      return originalSend(body);
    };

    next();
  };
}

/**
 * Called automatically after every mutation in crudControllerFactory.js —
 * a module author never has to remember cache invalidation by hand.
 */
export async function invalidateCache(tag) {
  if (!redis) return;

  try {
    const stream = redis.scanStream({ match: `cache:*${tag}*`, count: 100 });
    const keys = [];
    for await (const batch of stream) {
      keys.push(...batch);
    }
    if (keys.length > 0) await redis.del(...keys);
  } catch (err) {
    console.error('[cache] invalidation error:', err.message);
  }
}
