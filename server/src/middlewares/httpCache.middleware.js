/**
 * Browser/CDN-level caching (distinct from cache.middleware.js's server-side
 * Redis cache-aside — this one tells the *client* it doesn't need to ask
 * again for a while). Express's built-in weak ETag support (on by default,
 * see app.js) still lets a client that respects max-age=0 or does a hard
 * refresh get a cheap 304 instead of a full payload.
 */
export function httpCache(maxAgeSeconds = 60, staleWhileRevalidateSeconds = 300) {
  return (req, res, next) => {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${staleWhileRevalidateSeconds}`);
    }
    next();
  };
}

export const noStore = (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};
