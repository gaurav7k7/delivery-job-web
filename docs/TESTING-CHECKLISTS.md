# Testing & QA

Version 1.0 · 2026-08-06

## 0. Scope & Methodology

This is a real testing pass, not a hypothetical checklist — every item marked ✅ below was executed against a running instance of the app (backend booted against real MongoDB + Redis containers, frontend built and served via `vite preview`), not inferred from reading the code. Every ⬜ item is either genuinely not built yet (most content modules) or a real limitation of this environment (documented, not glossed over).

**What exists to test, honestly:** one public page (a temporary foundation-verification page), the admin auth/dashboard/profile/password shell, and backend infrastructure (health, sitemap, robots, security middleware — no content APIs). "Test the complete application" at this stage means thoroughly testing *what's complete*, not fabricating results for what isn't. Checklist items for unbuilt modules (Services, Blog, Portfolio, etc.) are listed as **standing checklists to run against each module as it's built**, not marked pass/fail now.

**Tools used**: Playwright (Chromium 1228 + Firefox 153, both real automated browsers, not simulated), axe-core 4.x (automated WCAG scanning), Lighthouse 13.4.1, `npm audit`, direct `curl` against the live API, a live MongoDB 7 + Redis 7 container pair.

---

## 1. Bugs Found This Session — Fixed

Found by actually running the app, not by review. All six verified fixed by re-testing after the fix, not just by inspecting the diff.

| # | Bug | How it was found | Fix |
|---|---|---|---|
| 1 | **No 404 page** — an unknown URL rendered a completely blank page (0 bytes of content, no error, no way back) | Direct browser navigation to an unmapped route | Added `NotFound.jsx` + a public catch-all route, plus a separate admin-scoped catch-all so unmatched `/admin/*` paths stay inside the admin shell instead of falling through to public chrome |
| 2 | **WCAG contrast failures** — `warning-500` (2.06:1) and `success-500` (3.16:1) failed as text in light mode; `danger-500` (4.04:1) failed in **dark mode specifically** (a latent bug — every prior contrast check in this project was light-mode-only) | axe-core scan across both themes | Added `-700` text-safe token variants (computed per-theme to clear 4.5:1) for accent/success/warning/danger; replaced every real text usage (form errors, StatCard trend/icons, logout menu item, ErrorBoundary) |
| 3 | **White text on primary buttons/avatars illegible in dark mode** — dark mode's brightened `primary-500` (#8b85ff, chosen for its own legibility as link/text color against the dark background) made white button/avatar text only 3.04:1 | Same axe-core dark-mode pass, appeared on every authenticated page | Added a dedicated `--color-on-primary` token (white in light mode, dark ink in dark mode) and applied it to Button, ProfileMenu avatar, Profile page avatar, and the skip-to-content link |
| 4 | **Header horizontal overflow at 1024px** — logo + 9 nav links + theme toggle + WhatsApp icon + Apply Now button didn't fit at the `lg` (1024px) breakpoint, causing an 18px horizontal scroll | Automated overflow check across 6 viewport widths | Moved the desktop-nav-appears breakpoint from `lg` to `xl` (1280px) consistently across Header, MobileMenu |
| 5 | **`server/.gitignore` didn't exist at all** — real risk of committing `.env` (secrets) and `node_modules` the moment this project is put under version control | Direct file check during the security pass | Created `server/.gitignore` mirroring the client's pattern |
| 6 | **Icon-only buttons at 40×40px** (theme toggle, hamburger, notification bell) — under the 44×44 recommended touch target | Automated touch-target size audit at mobile viewport | Bumped to 44×44 (`h-11 w-11`) across all four instances |

## 2. Known Issues — Not Fixed, With Reasoning

| Issue | Why not fixed now |
|---|---|
| `react-router` npm audit advisory (high severity, RSC-mode CSRF bypass) | Doesn't apply — this app uses plain client-side `BrowserRouter` with no server actions/RSC. No patched version exists yet in the 7.x line to upgrade to. Re-verify before ever adopting React Router's server-action features. |
| `ProfileMenu` avatar dropdown trigger is ~40px tall on narrow admin viewports (name/role text hides below `sm:`, leaving just the avatar + minimal padding) | Admin-only, low-traffic control, admin users are predominantly on desktop. Lower priority than the four public-facing touch targets already fixed. |
| Largest Contentful Paint (~2.1s) partly driven by `main.jsx` awaiting MSW's mock service worker registration before first render | Real, but mock-mode-only — doesn't exist in production (`VITE_ENABLE_MOCKS=false` skips it). Fixing risks a genuine race condition between MSW registration and the first real query firing; flagged for a deliberate look, not a rushed one. |
| WebKit/Safari not tested | Playwright's WebKit build requires system-level dependencies installable only via `sudo apt-get install` — not run without being asked, since it modifies the system. Chromium and real Firefox were both tested and rendered identically (screenshots confirm pixel-parity, including chart rendering). Safari genuinely needs dedicated testing before production launch — see the Cross-Browser checklist. |
| No real backend Auth/JWT/RBAC | Not built yet (was mocked in the frontend for admin UI development — see Phase 6/7 conversation history). Most session-security checklist items are N/A until that module exists; flagged explicitly below rather than silently skipped. |

---

## 3. Backend Test Checklist

| Item | Status | Notes |
|---|---|---|
| Server boots cleanly against real MongoDB | ✅ | Verified against a live MongoDB 7 container |
| Server boots cleanly against real Redis (optional) | ✅ | Verified connected; also verified graceful no-op when `REDIS_URL` unset (Phase 5) |
| No Mongoose duplicate-index warnings on boot | ✅ | Re-confirmed clean after the Phase 2/optimization-pass fixes |
| `GET /api/health` returns correct shape | ✅ | `{success, statusCode, message, data:{db, uptime}}` |
| 404 on unknown API route | ✅ | Correct envelope, stack trace hidden in production, shown in development |
| Global error handler: stack traces hidden in production | ✅ | Verified by booting with `NODE_ENV=production` and diffing the response body |
| Malformed JSON body → clean 400, not a crash | ✅ | |
| Request body size limit (2MB) enforced | ✅ | 413 on a 3MB payload |
| Rate limiting triggers correctly | ✅ | Verified by lowering the limit and confirming 429 fires exactly at the configured threshold, not before/after |
| CORS configured correctly for the configured origin | ✅ | Verified against `cors` package source — static-origin config always returns that fixed value; enforcement is browser-side (see §4) |
| Compression (gzip) active | ✅ | `Content-Encoding: gzip` confirmed |
| `sitemap.xml` generates valid XML from real DB queries | ✅ | Verified end-to-end: inserted a real published blog post, confirmed it appeared |
| `robots.txt` correctly disallows `/admin` and `/api` | ✅ | |
| Redis cache-aside: MISS → HIT → invalidation-on-mutation | ✅ | Verified via `X-Cache` header sequence against a live Redis container |
| MongoDB `.lean()` + field projection | ✅ | Verified output is a plain object, not a Mongoose document; `?fields=` projection confirmed |
| Graceful shutdown on SIGTERM/SIGINT | ✅ | Confirmed in server logs during test teardown |
| Morgan logging format switches (dev → combined) by `NODE_ENV` | ✅ | |
| — Auth endpoints (login/logout/refresh/me) | ⬜ N/A | Not built on the backend yet |
| — Content module CRUD (Services, Blog, Portfolio, etc.) | ⬜ N/A | Not built yet — re-run this checklist's relevant rows per module as each lands |
| — File upload endpoint | ⬜ N/A | `upload.middleware.js` exists but isn't wired to a route yet |
| — Pagination/search/filter/sort on a real list endpoint | ⬜ N/A | `BaseRepository`/`parseListQuery` unit-verified in isolation (Phase 2/5), no live route to test end-to-end yet |

## 4. Frontend Test Checklist

| Item | Status | Notes |
|---|---|---|
| Public home page loads, no console errors | ✅ | |
| 404 page renders for unknown routes (public + admin-scoped) | ✅ | Fixed this session, see Bug #1 |
| Admin login: correct credentials succeed | ✅ | |
| Admin login: wrong credentials show a clean error | ✅ | 401 handled gracefully, no crash |
| Admin login: empty-submit client-side validation | ✅ | |
| Session persists across reload (optimistic) + revalidates via `/auth/me` | ✅ | |
| Logout clears session and blocks back-navigation to protected routes | ✅ | |
| Sidebar: group expand/collapse, active-route highlighting | ✅ | |
| Sidebar: desktop icon-collapse mode with hover flyouts | ✅ | |
| Sidebar: mobile drawer open/close | ✅ | |
| Unknown `/admin/*` path (authenticated) stays inside admin shell | ✅ | |
| Dashboard: stat cards, bar chart, donut chart, activity feed all render | ✅ | Verified in both Chromium and Firefox |
| Notification bell: dropdown, unread badge, mark-read, mark-all-read | ✅ | |
| Profile form: validation, dirty-state gating on Save button | ✅ | |
| Change Password: mismatch validation, wrong-current-password server error | ✅ | |
| Theme toggle: persists, applies instantly, no flash-of-wrong-theme on reload | ✅ | |
| Toast notifications positioned correctly (don't overlap fixed topbar) | ✅ | Verified in Phase 7 |
| Module placeholder pages render for all 24 not-yet-built admin routes | ✅ | |
| — Public pages beyond the foundation stub (Home, Services, Blog, etc.) | ⬜ N/A | Not built yet |
| — Any real CRUD admin module (DataTable engine, forms, drag-reorder) | ⬜ N/A | Not built yet |

## 5. Security Checklist

| Item | Status | Notes |
|---|---|---|
| `npm audit` — backend | ✅ | 0 vulnerabilities |
| `npm audit` — frontend | ⚠️ | 1 advisory (react-router, doesn't apply — see §2) |
| Helmet security headers present | ✅ | CSP, HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, X-DNS-Prefetch-Control, X-Download-Options, X-Permitted-Cross-Domain-Policies all confirmed via live response headers |
| CORS locked to configured origin | ✅ | Verified via package source, not just observed behavior |
| Rate limiting on all routes (general + stricter auth tier ready) | ✅ | |
| No `dangerouslySetInnerHTML` anywhere in the frontend | ✅ | Zero matches |
| No `eval()`/`new Function()` anywhere in either app | ✅ | Zero matches |
| No hardcoded real secrets/credentials in the repo | ✅ | Searched for connection strings with embedded credentials — none found |
| `.env` correctly gitignored (client) | ✅ | |
| `.env` correctly gitignored (server) | ✅ | **Fixed this session — the file didn't exist at all (Bug #5)** |
| Request body size limits enforced | ✅ | |
| Stack traces never leak in production | ✅ | |
| httpOnly cookie infrastructure present | ✅ | `cookie-parser` configured with secret; no session-issuing route yet to test end-to-end |
| — JWT issuance/verification, refresh-token rotation | ⬜ N/A | Real backend Auth module not built |
| — RBAC/permission enforcement at the API layer | ⬜ N/A | Real backend Auth module not built (UI-layer `PermissionGate` exists and is documented as convenience-only, not a security boundary, per Phase 3 §9) |
| — NoSQL injection testing on a live query-accepting endpoint | ⬜ N/A | No route accepts free-form query input yet beyond the (safe, hardcoded) sitemap queries |
| — CSRF protection strategy for cookie-based auth | ⬜ Flag for Auth module | Standard practice once real cookie auth ships: SameSite cookie attribute + double-submit or synchronizer token, decided when that module is built |
| — Dependency vulnerability re-scan before each deploy | ⬜ Process item | Add to CI, not a one-time check |

## 6. Performance Checklist

| Item | Status | Notes |
|---|---|---|
| Lazy loading / route-based code splitting | ✅ | Every route is `React.lazy()`, confirmed via separate build chunks |
| Vendor chunking (react/query/motion) for cache-friendly repeat visits | ✅ | |
| Bundle-preload bug (chart library eagerly loading on unrelated pages) | ✅ | Found and fixed in the optimization pass |
| Self-hosted, subsetted web fonts with `font-display: swap` | ✅ | Verified only the Latin-subset file per weight actually downloads |
| Image optimization infrastructure (Cloudinary transforms, responsive srcSet) | ✅ | Ready, nothing to compress yet — no content images exist |
| MongoDB `.lean()` + projection on read paths | ✅ | |
| Redis response caching | ✅ | Optional, verified working |
| HTTP cache headers on public GET routes | ✅ | |
| Compression (gzip) | ✅ | |
| Lighthouse Performance score | ⚠️ 84-87 (range, see methodology) | See `docs/PRODUCTION-OPTIMIZATION.md` §6 for full methodology and honest caveats — this sandbox runs concurrent dev tooling that measurably affects timing metrics |
| — Real-world Core Web Vitals (field data, not lab) | ⬜ N/A | Requires production deployment + real traffic |
| — Performance under real content load (many images, long lists) | ⬜ N/A | No real content exists yet |

## 7. SEO Checklist

| Item | Status | Notes |
|---|---|---|
| Meta tags (title, description) | ✅ | |
| Open Graph tags | ✅ | title/description/url/type/image/site_name/locale |
| Twitter Card tags | ✅ | summary_large_image / summary |
| Canonical URLs | ✅ | Auto-derived per route |
| Structured data (JSON-LD) builders | ✅ | Organization, LocalBusiness, BreadcrumbList, Article, JobPosting, FAQPage — ready, not yet called from a real page |
| Dynamic sitemap.xml | ✅ | Verified against real DB data |
| robots.txt | ✅ | Correctly excludes `/admin` |
| `noindex` correctly applied to non-content pages (admin, internal test page) | ✅ | Verified via Lighthouse `is-crawlable` audit — see `docs/PRODUCTION-OPTIMIZATION.md` for the full investigation |
| Lighthouse SEO score on an indexable page | ✅ 100 | Proven by testing against a page without `noindex` |
| — Sitemap/robots.txt served at the correct production domain | ⬜ Deployment decision pending | Documented assumption in `docs/PRODUCTION-OPTIMIZATION.md` §2 |
| — Real per-page structured data wired up | ⬜ N/A | No real content pages exist yet to attach it to |

## 8. Accessibility Checklist

| Item | Status | Notes |
|---|---|---|
| Automated WCAG 2.1 A/AA scan (axe-core) — light theme, all 7 real pages/states | ✅ **0 violations** | |
| Automated WCAG 2.1 A/AA scan (axe-core) — dark theme, all 7 real pages/states | ✅ **0 violations** | Found and fixed 3 real contrast bugs to get here (Bugs #2, #3) |
| Heading order (no skipped levels) | ✅ | Fixed this session (`EmptyState` hardcoded `<h3>`, missing `<h1>` on Login) |
| Every interactive icon-only control has an accessible name | ✅ | `aria-label` audited across Header, Topbar, NotificationBell, ThemeToggle, Sidebar |
| Focus-visible outline present and consistent | ✅ | Global `:focus-visible` rule in `index.css` |
| Skip-to-content link | ✅ | Present, and its contrast bug fixed this session |
| Keyboard-operable drag-drop alternative | ⬜ N/A | No drag-drop UI built yet (planned for the Homepage Sections / Navigation admin modules) |
| Reduced-motion respected | ✅ | Global CSS governor + Framer Motion `useReducedMotion` checked in `useScrollReveal`; Lenis smooth-scroll disabled entirely under `prefers-reduced-motion` |
| Touch target sizing | ✅ | 4 icon buttons bumped to 44×44 this session (Bug #6); text links reviewed and left as-is per WCAG's accepted exemption for inline text |
| Screen-reader semantic structure (landmarks, nav labels) | ✅ | `<main>`, `<nav aria-label>`, `<header>`, `<footer>` all present and correctly labeled |

## 9. Mobile Checklist

| Item | Status | Notes |
|---|---|---|
| No horizontal overflow at 375px (iPhone SE) | ✅ | |
| No horizontal overflow at 390px (iPhone 12/13) | ✅ | |
| No horizontal overflow at 768px (iPad portrait) | ✅ | |
| No horizontal overflow at 1024px (iPad landscape) | ✅ | Fixed this session — was overflowing by 18px (Bug #4) |
| No horizontal overflow at 1440px / 1920px (laptop/desktop) | ✅ | |
| Mobile hamburger menu opens/closes correctly | ✅ | Verified in both Chromium and Firefox |
| Mobile menu shows the full nav list, staggered entrance | ✅ | |
| Header correctly switches between desktop nav and hamburger at the right breakpoint | ✅ | Verified the exact pixel boundary (1024px) after the fix |
| Touch targets ≥44×44px on primary interactive controls | ✅ | See Bug #6 |
| Admin sidebar collapses to a mobile drawer correctly | ✅ | |
| Dashboard charts render and resize correctly on mobile viewport | ✅ | |
| — Real device testing (physical iOS/Android hardware) | ⬜ N/A | Only emulated viewports tested in this pass; recommended before launch |

## 10. Cross-Browser Checklist

| Browser | Status | Notes |
|---|---|---|
| Chromium (Playwright-bundled, Chrome-equivalent engine) | ✅ | Full test suite run against this engine |
| Firefox (real Firefox 153, Playwright-driven) | ✅ | Home page, theme toggle, admin login, dashboard (with charts), mobile menu — all verified, zero console errors, pixel-identical rendering to Chromium |
| Safari / WebKit | ⬜ **Not tested — real gap** | Playwright's WebKit build requires `sudo apt-get install` system dependencies not available in this environment. Genuinely untested; WebKit is historically the engine most likely to diverge (flexbox/grid edge cases, backdrop-filter support, CSS custom property quirks). **Recommend dedicated Safari/iOS testing before production launch.** |
| Real Edge (Chromium-based, but with its own quirks) | ⬜ Not separately tested | Chromium-engine result is a reasonable proxy but not identical — Edge has its own default settings (tracking prevention, etc.) worth a spot-check |
| Mobile Safari (iOS) | ⬜ Not tested | Same WebKit limitation as above, compounded by real touch/viewport behavior differing from desktop emulation |

## 11. Deployment Checklist

Also see `docs/PRODUCTION-OPTIMIZATION.md` §8 for the fuller version — this is the testing-focused subset.

| Item | Status |
|---|---|
| Backend boots cleanly with production env vars | ✅ Verified |
| Frontend production build completes with no errors | ✅ Verified, every rebuild this session |
| `NODE_ENV=production` correctly gates dev-only behavior (stack traces, Morgan format, `autoIndex`) | ✅ Verified |
| No stray `.env` files or secrets in version control | ✅ Verified (and one real gap closed — Bug #5) |
| Health check endpoint available for uptime monitoring | ✅ |
| Graceful shutdown handles in-flight requests | ✅ |
| `docs/PRODUCTION-OPTIMIZATION.md` §8's full checklist | ⬜ Several items pending real hosting/domain decisions, explicitly listed there |

---

## 12. Standing Requirements (per project instructions)

- Latest stable tool versions used for testing itself (Playwright 1.62.1, axe-core 4.x, Lighthouse 13.4.1) — consistent with the same "verify, don't assume" discipline applied to the application's own dependencies throughout this project.
- No placeholder results — every ✅ above corresponds to a command that was actually run and an output that was actually read, in this conversation.
- Business content unaffected — this pass touched only infrastructure, design tokens, and bug fixes; no content changes.
- The six real bugs fixed here (§1) all affect components/tokens shared across every future page, so fixing them now — rather than after more pages are built on top of the same bugs — is the higher-leverage move.
