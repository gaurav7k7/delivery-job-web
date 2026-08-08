# Production Optimization

Version 1.0 · 2026-08-05

## 1. Scope — read this first

"Optimize the entire website" means something different for a site at this stage than for a finished one. As of this pass: one public page exists (a temporary foundation-verification page, not real content), the admin has an auth/dashboard shell with mocked data, and the backend has no content routes beyond health/auth/settings/nav/footer stubs. No Blog, Service, Portfolio, or Career content has ever been published.

Given that, this pass does two kinds of work:

1. **Infrastructure that's genuinely complete right now** — it runs correctly against the empty/mock data that exists today and requires zero changes as real content modules land (the dynamic sitemap is the clearest example: it already queries the real `Blog`/`Service`/`Career`/etc. collections; it returns an empty dynamic set today purely because those collections are empty, not because the code is unfinished).
2. **Real bugs found and fixed** in what already exists — a WCAG contrast failure in the design tokens, a heading-order violation, a bundle-preload bug, missing font loading, duplicate MongoDB indexes. These aren't hypothetical; each was caught by an actual tool (Lighthouse, a live MongoDB instance, a real browser) and verified fixed the same way.

**What this pass explicitly does not claim**: a Lighthouse 95+ score "for the website" — most of the website doesn't exist yet to score. §6 gives the real, measured numbers against what's actually running, with methodology, so the number means something.

---

## 2. SEO Infrastructure

| Item | Status | Detail |
|---|---|---|
| Meta tags | ✅ Implemented | `client/src/components/ui/Seo.jsx` — title, description, one shared surface every page renders through |
| Open Graph | ✅ Implemented | og:title/description/url/type/image/site_name/locale, plus article:published_time/modified_time/author for blog-type pages |
| Twitter Cards | ✅ Implemented | summary_large_image when an image is present, summary otherwise |
| Canonical URLs | ✅ Implemented | Auto-derived from `VITE_SITE_URL` + current route unless explicitly overridden |
| Structured Data | ✅ Implemented | `client/src/lib/structuredData.js` — Organization, LocalBusiness (per office), BreadcrumbList, Article, JobPosting, FAQPage builders, ready for each page to call once that page exists |
| Dynamic sitemap.xml | ✅ Implemented, verified against real data | `server/src/routes/sitemap.routes.js` — 15 static marketing routes + live queries against Service/Industry/Platform/Blog/Career/Portfolio. Verified end-to-end: inserted a real published blog post into MongoDB, confirmed it appeared in the generated sitemap |
| robots.txt | ✅ Implemented | Both a backend route (`server/src/routes/robots.routes.js`) and a static `client/public/robots.txt` fallback — disallows `/admin`, points to the sitemap |

**Sitemap & robots.txt routing — resolved.** The routes are mounted at the app root in `server/src/app.js` (not under `/api`), and `client/vercel.json` proxies `/sitemap.xml` and `/robots.txt` (alongside `/api/*`) from the Vercel-hosted frontend to the Render backend at the edge. The browser only ever sees one origin — see `docs/DEPLOYMENT-GUIDE.md` §0 and §6 for the full architecture and setup steps.

---

## 3. Performance — Frontend

| Item | Status | Detail |
|---|---|---|
| Lazy loading | ✅ Implemented | Every route is `React.lazy()`; verified in the build output as separate chunks (e.g. `Dashboard-*.js` at 7.5KB standalone) |
| Code splitting | ✅ Implemented, one real bug fixed | See below — a manual vendor-chunking attempt backfired and got corrected |
| Image compression/optimization | ✅ Infrastructure ready, no real images yet | `client/src/components/ui/OptimizedImage.jsx` — Cloudinary auto-format/auto-quality + responsive srcSet for any Cloudinary-hosted URL, explicit width/height to reserve layout space, native lazy loading. Nothing to compress today since no content images exist |
| Font loading | ✅ Real bug fixed | Sora/Inter were referenced in CSS `font-family` but never actually loaded — the browser was silently falling back to system fonts the entire time. Fixed with self-hosted `@fontsource` imports (5 weights total: Sora 600/700, Inter 400/500/600), `font-display: swap` by default, unicode-range subsetting confirmed working (only the Latin-subset file each weight actually downloads) |
| Bundle optimization | ✅ Implemented, one real bug found+fixed | See below |
| Core Web Vitals | ✅ Measured, two real bugs fixed | See §6 |

### The bundle-chunking bug

First attempt at `vite.config.js` manual chunking forced `recharts` (used only by the lazy-loaded admin Dashboard) into its own named vendor chunk. That made Vite's `modulepreload` injection treat it as needed by every route — confirmed via network trace: the home page was eagerly fetching a 91KB chart-library chunk it never uses, flagged by Lighthouse's "unused JavaScript" audit. Fix: only force-split vendors genuinely used on every route (react-vendor, query-vendor, motion-vendor); left alone, Rolldown's automatic chunking correctly scopes recharts to Dashboard's lazy boundary. Verified after the fix: zero chart-related requests on the home page.

Also fixed while here: Vite 8's default bundler (Rolldown) only accepts a **function** for `manualChunks`, not Rollup's classic object-shorthand — the first version of the config didn't build at all.

---

## 4. Backend Performance & Caching

| Item | Status | Detail |
|---|---|---|
| MongoDB optimization | ✅ Implemented + audited | See below |
| Caching (Redis) | ✅ Implemented, optional, verified | `server/src/middlewares/cache.middleware.js` — cache-aside for GET routes, no-ops cleanly when `REDIS_URL` is unset. Verified live: MISS→HIT sequence confirmed via `X-Cache` header against a real Redis container, and mutation-triggered invalidation wired automatically into every CRUD module via `crudControllerFactory.js` |
| HTTP caching | ✅ Implemented | `server/src/middlewares/httpCache.middleware.js` — `Cache-Control: public, max-age=X, stale-while-revalidate=Y` for GET responses; Express's built-in weak ETag support is already on by default |
| API optimization | ✅ Implemented at the framework level | `.lean()` queries by default on all read paths (verified: returns plain objects, not Mongoose documents), `?fields=a,b,c` projection support on every list/get endpoint, compression + rate limiting already in place from Phase 5 |

### MongoDB optimization detail

- **Two duplicate indexes found and fixed**: `Navigation.location` and `Office.city` each had both `index: true` inline *and* a separate `schema.index()` call — caught by a Mongoose startup warning during this pass's verification boot, not something a static review would necessarily catch. Scanned all 33 models programmatically afterward for the same pattern; confirmed no others exist.
- **`.lean()` on every read path** (`list()`, `findById()`) — skips Mongoose's document-hydration machinery (change tracking, getters/setters, virtuals) on routes that only ever serialize to JSON. Verified: repository output is a plain `Object`, not a Mongoose document.
- **Field projection** (`select`) wired from `?fields=` query param straight into MongoDB's projection — a caller that only needs list-card data skips shipping full rich-text payloads.
- **Connection pool tuned**: `maxPoolSize: 20`, `minPoolSize: 2` (a small API rarely needs more; keeping 2 warm avoids a cold-connect penalty on the first request after idle).
- **`autoIndex` disabled in production** — index builds acquire a write lock; in production they belong in a deploy-time migration, not implicit on every app boot against a live collection.
- Every index already defined in Phase 2 was designed against actual query shapes (documented in `docs/DATABASE-DESIGN.md` §4) — this pass didn't need to add new indexes, only remove the two duplicates.

---

## 5. Accessibility

Two real WCAG failures found by Lighthouse and fixed (not review-only — both verified fixed by re-running the audit):

1. **Color contrast**: the accent color (`#F97316`) used for eyebrow labels/small text scored 2.68:1 against the light-mode background — WCAG AA requires 4.5:1. This is a bug in the Phase 4 design tokens that shipped without ever being contrast-checked. Fixed by adding a `--color-accent-700` token (`#C2410C`, computed to land at 4.96:1) — the "text-safe" variant of the accent color — and switching every text/icon usage of accent-500 to it (3 real call sites fixed: an eyebrow label, an admin stat-card icon, a notification badge's white-on-orange text, which was failing even worse at 2.80:1). `accent-500` itself is untouched and still used for backgrounds/gradients, where the stricter text-contrast rule doesn't apply.
2. **Heading order**: the reusable `EmptyState` component hardcoded `<h3>`, which broke document order wherever it appeared directly under an `<h1>` with no `<h2>` between them (two real instances: the foundation-check page, and every not-yet-built admin module's placeholder screen, since the admin `Topbar` renders an `<h1>` page title with nothing beneath it before `EmptyState`). Fixed by making the heading level a prop (`headingLevel`, default 3) and setting it correctly at both call sites. Also found the admin login page had no `<h1>` at all — the "Zerivon" brand mark was a styled `<span>`; changed to a real heading.

Both confirmed fixed by re-running Lighthouse: accessibility category went from 93 → **100**.

---

## 6. Measured Results (not claimed — measured)

**Methodology**: Lighthouse 13.4.1, desktop preset, against a local production build (`vite preview`) served over `localhost`. Two pages tested: the internal foundation-check page (intentionally `noindex` — see §1) and the admin login page (also intentionally `noindex`, and intentionally disallowed in `robots.txt` — you don't want an admin login indexed). This environment also runs VS Code, TypeScript language servers, and this Claude Code session concurrently, which measurably affects Lighthouse's main-thread timing audits (Total Blocking Time swung 20ms → 620ms between runs under simulated throttling); numbers below use `--throttling-method=provided` (observed, not simulated) for a stable reading, and are a range across 3 consecutive runs, not a single cherry-picked number.

| Category | Before this pass | After | Notes |
|---|---|---|---|
| Accessibility | 93 | **100** | Both real bugs (§5) fixed |
| Best Practices | 100 | **100** | Unchanged, already clean |
| Performance | 75 | **84–87** | CLS 0.109→0.063 (footer skeleton/content height mismatch fixed), bundle-preload bug fixed, TBT 320ms→20-30ms |
| SEO | 66 | 66 (on `noindex` pages) / **100** (verified on a page without `noindex`) | The `is-crawlable` audit is the entire gap — both tested pages are *deliberately* non-indexable. Proved this isn't a real deficiency by temporarily removing `noindex` from the foundation page and re-running: SEO scored 100, Performance 89, Accessibility 100, Best Practices 100 |

**The honest remaining gap**: Largest Contentful Paint sits around 2.1–2.3s on this build, the largest single drag on the Performance score. A meaningful share of that is explained by `main.jsx` awaiting MSW's mock service worker registration before the app renders at all — real in dev/demo mode, **not present in production** (`VITE_ENABLE_MOCKS=false` skips it entirely). This wasn't "fixed" in this pass because removing the `await` risks a race condition between MSW registering and the first real query firing, which needs a deliberate look rather than a rushed one under time pressure — flagged here rather than either ignored or falsely resolved. Worth re-measuring once real backend content replaces the mock layer, since at that point LCP will be driven by real data-fetch timing instead of mock-harness startup cost.

---

## 7. What's Deliberately Deferred (and why)

| Item | Why deferred |
|---|---|
| Per-module Redis TTLs tuned to real traffic patterns | No content modules exist yet to have traffic patterns |
| Image compression of actual content images | No content images exist yet — the `OptimizedImage` component is ready and will apply automatically the moment real Cloudinary URLs flow through it |
| CDN configuration for static assets | A hosting/deployment decision that hasn't been made for this project yet |
| API-response-shape-specific caching (e.g., stale-while-revalidate tuned per resource) | Same — no resources exist yet beyond settings/nav/footer |
| Preconnect hint for the API origin | Production API domain isn't decided yet (dev is `localhost:5000`); adding a hardcoded guess would be actively wrong. Cloudinary's preconnect *is* added since that domain is fixed regardless of hosting choice |
| MSW-registration-blocking-first-render fix | Real, but mock-mode-only and needs a deliberate look at the race condition, not a rushed one — see §6 |

---

## 8. Production Build Checklist

Concrete and specific to what's actually built, not a generic list.

**Environment & config**
- [x] Env vars fail-fast validated via Zod at boot (`server/src/config/env.js`) — the app refuses to start with missing/malformed config
- [ ] `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` / `COOKIE_SECRET` set to real random 64-char values in production (not the `.env.example` placeholders)
- [ ] `NODE_ENV=production` set (gates `autoIndex`, error stack traces, Morgan log format)
- [ ] `SITE_URL` set to the real production domain (feeds sitemap/robots/canonical URLs)
- [ ] `VITE_ENABLE_MOCKS=false` and `VITE_API_BASE_URL` pointed at the real API for the production frontend build

**Security** (mostly already done, Phase 5)
- [x] Helmet security headers
- [x] CORS locked to `CLIENT_URL`, credentialed
- [x] Rate limiting (global + auth-specific tiers)
- [x] httpOnly cookie infrastructure ready for JWT sessions
- [x] HTTPS/TLS — automatic on both Vercel and Render once a domain is added, no manual certificate management (see `docs/DEPLOYMENT-GUIDE.md` §7)
- [x] HSTS — Helmet sets it on the API; `vercel.json` sets it explicitly for the frontend too (`max-age=63072000; includeSubDomains; preload`)

**Database**
- [x] Indexes reviewed, duplicates removed
- [x] Connection pool sized, `autoIndex` disabled in production
- [x] Backup/restore strategy documented — MongoDB Atlas M10+ has continuous backups; the free M0 tier does not, and needs manual `mongodump` in the meantime. See `docs/DEPLOYMENT-GUIDE.md` §2 for the exact trade-off. Still your call which tier to actually provision.
- [ ] Production DB user scoped to least privilege (not the admin/root credential)

**Caching**
- [x] Redis cache-aside implemented, degrades gracefully without it
- [ ] `REDIS_URL` actually provisioned for production (currently unset everywhere — the app runs correctly either way, but response times benefit once it's live)

**Frontend build**
- [x] Sourcemaps disabled in production build (`vite.config.js`)
- [x] Manual vendor chunking (react/query/motion) for cache-friendly repeat visits
- [x] Fonts self-hosted, subsetted, `font-display: swap`
- [ ] Real Lighthouse run against production-deployed URLs (not localhost) once real content pages exist — the numbers in §6 are directionally real but the environment (shared dev machine, mock data) means they should be re-baselined post-deploy

**CI/CD**
- [x] GitHub Actions CI (`.github/workflows/ci.yml`) — lints and builds the frontend, lints and boot-tests the backend against a real MongoDB service container. The exact same steps were run locally against a live database before this file was finalized, not just written and assumed to work.
- [x] Deployment config as code — `vercel.json` and `render.yaml`, both committed, both validated (JSON/YAML parse-checked; `render.yaml` field names verified against Render's current Blueprint spec, catching one stale field name in the process)
- [ ] Branch protection on `main` requiring CI to pass — one checkbox in GitHub's UI, see `docs/DEPLOYMENT-GUIDE.md` §8

**Observability**
- [x] `/api/health` endpoint (DB connectivity + uptime)
- [x] Graceful shutdown on SIGTERM/SIGINT (drains in-flight requests, closes DB connection)
- [x] Morgan HTTP logging (dev format locally, combined format in production)
- [x] Error tracking — Sentry wired up on both backend (`server/src/instrument.js`) and frontend (`client/src/lib/sentry.js`), gracefully no-ops without a DSN configured. Verified safe to call with no DSN set. Creating the actual Sentry account/projects and setting the DSN env vars is the remaining account-level step — see `docs/DEPLOYMENT-GUIDE.md` §4.
- [ ] Uptime monitoring on `/api/health` from an external service — account-level step, see `docs/DEPLOYMENT-GUIDE.md` §10

**SEO**
- [x] Sitemap generation verified against real data
- [x] robots.txt correctly excludes `/admin`
- [x] Sitemap/robots.txt routing resolved for the actual production topology — see the updated note above and `docs/DEPLOYMENT-GUIDE.md`
- [ ] Google Search Console / Bing Webmaster Tools submission — do this once real content exists, not before (submitting an empty site trains nothing useful)

---

## 9. Standing Requirements (per project instructions)

- Latest stable versions used throughout (Lighthouse 13.4.1, ioredis 6.0.0, sitemap 9.0.1, @fontsource 5.3.0) — three separate version-specific behavior changes were caught by testing rather than assumed away: Rolldown's function-only `manualChunks`, `res.json()`'s delegation to `res.send()` in Express 5 (needed for the cache middleware to correctly handle non-JSON responses), and the modulepreload/manual-chunking interaction.
- No placeholder code — the sitemap genuinely queries the database; it returns an empty dynamic set today because the database is genuinely empty, which was proven by inserting a real document and watching it appear.
- Business content preserved — no content changes in this pass, only infrastructure.
- Admin-editable content — unaffected by this pass; every optimization here operates transparently underneath whatever content the admin panel produces once those modules are built.
