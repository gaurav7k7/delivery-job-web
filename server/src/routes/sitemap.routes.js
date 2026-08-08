import { Router } from 'express';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'node:stream';
import { env } from '../config/env.js';
import { Service, Industry, Platform, Blog, Career, Portfolio } from '../models/index.js';
import { cacheResponse } from '../middlewares/cache.middleware.js';

const router = Router();

// Static marketing routes from the Phase 1 sitemap — kept here as the single
// source of truth for "pages that always exist" rather than duplicated
// per-frontend-route-file.
const STATIC_ROUTES = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.8 },
  { url: '/services', changefreq: 'weekly', priority: 0.9 },
  { url: '/how-it-works', changefreq: 'monthly', priority: 0.7 },
  { url: '/platforms', changefreq: 'monthly', priority: 0.7 },
  { url: '/benefits', changefreq: 'monthly', priority: 0.6 },
  { url: '/success-stories', changefreq: 'weekly', priority: 0.7 },
  { url: '/locations', changefreq: 'monthly', priority: 0.6 },
  { url: '/apply', changefreq: 'monthly', priority: 0.9 },
  { url: '/blog', changefreq: 'daily', priority: 0.8 },
  { url: '/careers', changefreq: 'weekly', priority: 0.6 },
  { url: '/faq', changefreq: 'monthly', priority: 0.5 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  { url: '/privacy-policy', changefreq: 'yearly', priority: 0.2 },
  { url: '/terms-and-conditions', changefreq: 'yearly', priority: 0.2 },
];

// Real query against the actual collections — returns an empty dynamic set
// today (no content modules are built yet) and the correct set automatically
// once those modules start publishing rows. Nothing here is a placeholder.
async function getDynamicRoutes() {
  const [services, industries, platforms, posts, jobs, projects] = await Promise.all([
    Service.find({ isActive: true, isDeleted: false }).select('slug updatedAt').lean(),
    Industry.find({ isActive: true, isDeleted: false }).select('slug updatedAt').lean(),
    Platform.find({ isActive: true, isDeleted: false }).select('slug updatedAt').lean(),
    Blog.find({ status: 'published', isDeleted: false }).select('slug updatedAt').lean(),
    Career.find({ status: 'open', isDeleted: false }).select('slug updatedAt').lean(),
    Portfolio.find({ isActive: true, isDeleted: false }).select('slug updatedAt').lean(),
  ]);

  return [
    ...services.map((s) => ({ url: `/services/${s.slug}`, lastmod: s.updatedAt, changefreq: 'monthly', priority: 0.7 })),
    ...industries.map((i) => ({ url: `/industries/${i.slug}`, lastmod: i.updatedAt, changefreq: 'monthly', priority: 0.6 })),
    ...platforms.map((p) => ({ url: `/platforms/${p.slug}`, lastmod: p.updatedAt, changefreq: 'monthly', priority: 0.6 })),
    ...posts.map((b) => ({ url: `/blog/${b.slug}`, lastmod: b.updatedAt, changefreq: 'weekly', priority: 0.7 })),
    ...jobs.map((c) => ({ url: `/careers/${c.slug}`, lastmod: c.updatedAt, changefreq: 'weekly', priority: 0.6 })),
    ...projects.map((p) => ({ url: `/portfolio/${p.slug}`, lastmod: p.updatedAt, changefreq: 'monthly', priority: 0.6 })),
  ];
}

// Cached for 10 minutes — a sitemap doesn't need to be second-fresh, and
// crawlers hit it repeatedly.
router.get('/', cacheResponse(600), async (req, res) => {
  const dynamicRoutes = await getDynamicRoutes();
  const stream = new SitemapStream({ hostname: env.SITE_URL });
  const xml = await streamToPromise(Readable.from([...STATIC_ROUTES, ...dynamicRoutes]).pipe(stream));

  res.header('Content-Type', 'application/xml');
  res.send(xml.toString());
});

export default router;
