# Software Requirement Specification (SRS)
## Zerivon — MERN Stack Website Redesign
**Phase 1 — Analysis & Specification**
Version 1.0 · 2026-08-05

---

## 1. Project Overview

Zerivon is a Kolkata-based rider onboarding agency that recruits and activates delivery/rider partners across six gig platforms (Uber, Swiggy, Zomato, Blinkit, Zepto, Vahan). The current website (`zerivon.in`) is a single-page marketing site with anchor navigation, no CMS, no admin control, and limited SEO surface area.

**Goal:** Rebuild the site from scratch on the MERN stack as a multi-page, SEO-friendly, admin-manageable platform — preserving all existing business content and messaging, but with an original, premium design system inspired (not copied) from `digiverse.co.in`'s layout rhythm, motion, and professionalism.

**~90% of content must be editable from the Admin Panel** without a code deploy: hero copy, stats, services, platforms, benefits, process steps, testimonials, FAQs, blog, office locations, and global site settings.

---

## 2. Content Analysis — Source Site (zerivon.in)

| Element | Extracted Detail |
|---|---|
| Tagline | "India's Fastest Riders Onboarding Agency" |
| Positioning | End-to-end rider recruitment & onboarding across 6 platforms |
| Key stats | 1.25L+ riders onboarded · 6 platforms · 48-hr activation · 98% activation rate · ₹2,000+/day earning potential |
| Services | Talent Acquisition, Skill Development (NATS/NAPS/AEDP), Onboarding (registration, doc verification, activation, multi-platform, training, joining bonus) |
| Process | 4 steps: Register offline (2 min) → Document verification → Account activation → Start earning (weekly payouts) |
| Platforms | Uber, Swiggy, Zomato, Blinkit, Zepto, Vahan |
| Benefits | 48-hr activation, 7-day support (call/WhatsApp/walk-in), weekly payouts, multi-platform activation, free training, joining bonuses |
| Testimonials | 3 riders (Bengaluru, Delhi NCR, Chennai) with earnings figures |
| Offices | 4 Kolkata branches (Bangur Avenue x2, Phoolbagan, Garia) — full addresses captured |
| Contact | Phone/WhatsApp +91 9875419099, 7 days/week. No email, no social links on current site |
| Footer | © 2025 Zerivon, platform-affiliation disclaimer, "no registration fee" / "100% legitimate" notices |
| Gaps identified | No blog, no FAQ, no careers page, no email, no social presence, no per-page SEO, no admin/CMS |

**Decisions confirmed with client-side stakeholder (you):**
- Rebuild as a **multi-page** site (routed, SEO-indexable pages) instead of single-scroll.
- Add **Blog** and **FAQ** as new sections (admin-manageable), beyond original content.
- Add **email + social links** fields (optional, admin-fillable), even though unused today.
- Color palette is **fully open** — an original system will be proposed, inspired by Digiverse's professionalism but visually distinct.

---

## 3. Design Direction (Inspiration Analysis — digiverse.co.in)

Observed patterns to draw inspiration from (structure/motion only, not visuals):
- Full-width hero with headline + benefit checklist + dual CTA
- Icon-led service card grid
- Vertical 4-step process timeline
- Card-based testimonial carousel with ratings
- Stat callouts embedded mid-page ("100+ Projects" style)
- Multi-column footer, generous whitespace, scroll-reveal motion, rounded CTA buttons with arrow icons

**Proposed original design system for Zerivon (Phase 2 will finalize in code/Tailwind config):**

| Token | Direction |
|---|---|
| Primary | Deep indigo/blue (trust, corporate credibility) — distinct hue from Digiverse's navy |
| Accent | Warm amber/orange (energy, "earning income" association — differentiates from Digiverse's teal) |
| Neutral | Off-white background, slate-gray text scale |
| Typography | Modern geometric sans for headings (e.g., Sora/Manrope-class), humanist sans for body (Inter-class) |
| Motion | Framer Motion scroll-reveal on section entry, staggered card fade-ups, count-up stat animation, subtle hover-lift on cards, SwiperJS for testimonials/platforms carousel |
| Shape language | Soft-rounded cards (not pill-heavy), subtle shadows, gradient accent blobs behind hero — original composition |
| Imagery | Real rider/delivery photography treatment (not stock-generic), platform logos in a clean marquee/badge row |

This system will be locked down visually in Phase 2 (Design System / Tailwind theme) before component build begins.

---

## 4. Information Architecture — Sitemap

### Public Site
```
/                          Home
/about                     About Us
/services                  Services (overview)
/services/:slug            Service detail (Talent Acquisition, Skill Development, Rider Onboarding)
/how-it-works              How It Works (process detail)
/platforms                 Platforms We Work With
/platforms/:slug           Platform detail (optional deep page per brand)
/benefits                  Benefits
/success-stories           Testimonials (full list, filterable by platform/city)
/locations                 Office Locations (all branches + map)
/apply                     Apply Now / Become a Rider (lead form)
/blog                      Blog listing
/blog/:slug                Blog post detail
/faq                       FAQ
/contact                   Contact Us
/privacy-policy            Privacy Policy
/terms-and-conditions      Terms & Conditions
*                          404 Not Found
/error                     500 / Something Went Wrong
```

### Admin Panel (`/admin/*`, JWT-protected)
```
/admin/login
/admin/forgot-password
/admin                      Dashboard (overview widgets)
/admin/content               Page content editor (hero/about/footer text blocks per page)
/admin/services              Services CRUD
/admin/platforms             Platforms CRUD
/admin/stats                 Stats/counters CRUD
/admin/process-steps         "How It Works" steps CRUD
/admin/benefits              Benefits CRUD
/admin/testimonials          Testimonials CRUD + approve/feature
/admin/blog                  Blog posts CRUD (rich text editor)
/admin/faq                   FAQ CRUD
/admin/locations              Office locations CRUD
/admin/applications           Rider applications (leads) inbox
/admin/messages               Contact form messages inbox
/admin/media                  Media library (Cloudinary assets)
/admin/users                  Admin/staff user management (role-based)
/admin/settings                Global site settings (contact info, social links, SEO defaults)
/admin/logs                    Activity/audit log
```

---

## 5. Page-by-Page Section Breakdown

**Home (`/`)**
Hero (headline, subhead, dual CTA: "Apply Now" / "Talk to Us") → Trust stat strip (animated counters) → Services overview grid (3 cards, link to detail) → How It Works (4-step timeline preview) → Platforms marquee/badges → Benefits grid → Featured testimonials carousel → Blog teaser (3 latest posts) → CTA banner → Footer

**About Us**
Company story/mission → Stats → Why Zerivon (values) → Timeline/milestones (optional) → CTA

**Services (overview)**
Intro → Full services grid (Talent Acquisition, Skill Development, Rider Onboarding) → CTA

**Service Detail**
Hero (service name) → Description → Feature list → Related process steps → Related testimonials → CTA

**How It Works**
Hero → 4-step detailed timeline → FAQ snippet → CTA

**Platforms**
Hero → Platform cards (logo, description, benefits per platform) → CTA

**Benefits**
Hero → Benefit cards grid → Comparison/why-us strip → CTA

**Success Stories**
Hero → Filterable testimonial grid (by platform/city) → CTA

**Locations**
Hero → Branch cards (address, phone, map embed) per office → CTA

**Apply Now**
Hero (short pitch + trust stat) → Multi-step lead form (Personal Details → Platform Preference → Vehicle/Docs → Review & Submit) → What happens next (mini process) → FAQ snippet

**Blog Listing**
Hero → Category/tag filter → Paginated post grid → Newsletter/CTA (optional)

**Blog Detail**
Post header (title, cover image, author, date, tags) → Rich content → Share buttons → Related posts → CTA

**FAQ**
Hero → Accordion grouped by category → Still-have-questions CTA (contact link)

**Contact**
Hero → Contact form → Office cards → Phone/WhatsApp/email → Map

**Privacy Policy / Terms**
Static rich-text content (admin-editable via content editor)

**404 / 500**
Illustration + message + CTA back to Home

---

## 6. Reusable Component Library

**Layout**
`Header/Navbar` (with mobile hamburger menu), `Footer`, `MobileMenu`, `Breadcrumbs`, `SEO` (Helmet wrapper), `ScrollToTop`, `WhatsAppFloatingButton`, `AdminLayout` (sidebar + topbar)

**UI Primitives**
`Button`, `IconButton`, `Badge`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `FormField` (React Hook Form + Zod wrapper), `Modal/Dialog`, `Tooltip`, `Tabs`, `Accordion`, `Pagination`, `Toast/Notification`, `Spinner`

**Content Cards**
`ServiceCard`, `PlatformCard`, `TestimonialCard`, `BlogCard`, `StatCard`/`AnimatedCounter`, `BenefitCard`, `LocationCard`, `FAQAccordionItem`, `TeamCard` (future-ready)

**Motion/Interaction**
`AnimatedSection` (Framer Motion scroll-reveal wrapper), `Carousel` (SwiperJS wrapper for testimonials/platforms), `ImageWithFallback` (lazy-loaded, optimized)

**State Components**
`SkeletonCard` variants (per card type), `EmptyState`, `ErrorBoundary`, `ErrorFallback`, `LoadingOverlay`

**Admin-Specific**
`DataTable` (sort/filter/paginate), `RichTextEditor` wrapper, `ImageUploader` (Cloudinary + drag-drop), `StatusBadge`, `ConfirmDialog`, `DashboardWidget`, `ReorderableList` (drag-to-reorder for CMS ordering fields)

---

## 7. Admin Dashboard Features

1. **Auth**: Secure login (JWT, httpOnly cookie), forgot/reset password, role-based access (Super Admin, Editor)
2. **Dashboard Overview**: New applications this week, unread messages count, pending testimonial approvals, published blog count, quick links
3. **Content Editor**: Edit hero text, about copy, footer text, disclaimers per page — generic key-value content blocks, no redeploy needed
4. **Services / Platforms / Stats / Process Steps / Benefits / FAQ**: Full CRUD, drag-to-reorder, active/inactive toggle
5. **Testimonials**: CRUD, approve/reject, feature-on-homepage toggle
6. **Blog**: CRUD with rich text editor, cover image upload, draft/publish workflow, categories/tags, per-post SEO fields
7. **Locations**: CRUD for branch offices with map coordinates
8. **Applications Inbox**: View rider "Apply Now" submissions, update status (New → Contacted → Onboarded → Rejected), notes, CSV export
9. **Messages Inbox**: Contact form submissions, mark read/replied, reply-via-email trigger (Nodemailer)
10. **Media Library**: Browse/delete Cloudinary-hosted assets, reuse across content
11. **User Management**: Super Admin can invite/manage staff accounts and roles
12. **Site Settings**: Global contact info, social links, SEO defaults (site title/description/OG image), logo/favicon upload
13. **Activity Log**: Audit trail of who changed what, when

---

## 8. MongoDB Collections

| Collection | Key Fields |
|---|---|
| `users` | name, email, passwordHash, role(super_admin/editor), avatar, isActive, lastLoginAt, timestamps |
| `sitesettings` (singleton) | siteName, logoUrl, faviconUrl, phone, whatsapp, email, socialLinks{}, seoDefaults{title,description,ogImage}, footerText, disclaimerText |
| `pagecontents` | pageSlug, sectionKey, contentType, data(JSON: heading/subheading/body/images/cta), updatedBy, timestamps |
| `services` | title, slug, icon, shortDescription, fullDescriptionHTML, features[], image, order, isActive, seo{} |
| `platforms` | name, slug, logoUrl, brandColor, description, order, isActive |
| `stats` | label, value, suffix, icon, order |
| `processsteps` | stepNumber, title, description, icon, order |
| `benefits` | title, description, icon, order |
| `testimonials` | name, city, platform(ref), message, rating, avatarUrl, isApproved, isFeatured, order, timestamps |
| `blogposts` | title, slug, excerpt, contentHTML, coverImageUrl, author(ref users), tags[], category, status(draft/published), publishedAt, seo{}, views, timestamps |
| `faqs` | question, answer, category, order, isActive |
| `locations` | branchName, addressLine, city, state, pincode, phone, lat, lng, order, isActive |
| `applications` | fullName, phone, email, city, preferredPlatforms[], vehicleType, hasLicense, hasDocuments, status(new/contacted/onboarded/rejected), notes, source, timestamps |
| `contactmessages` | name, email, phone, subject, message, status(unread/read/replied), timestamps |
| `media` | url, publicId, type, altText, sizeBytes, uploadedBy(ref), timestamps |
| `activitylogs` | user(ref), action, entityType, entityId, meta(JSON), timestamps |

---

## 9. API Specification

**Auth** (`/api/auth`)
`POST /login` · `POST /logout` · `POST /refresh` · `GET /me` · `POST /forgot-password` · `POST /reset-password`

**Public content (read-only, Redis-cacheable)**
`GET /api/settings` · `GET /api/content/:pageSlug` · `GET /api/services` · `GET /api/services/:slug` · `GET /api/platforms` · `GET /api/platforms/:slug` · `GET /api/stats` · `GET /api/process-steps` · `GET /api/benefits` · `GET /api/testimonials?platform=&city=` · `GET /api/blog?page=&tag=&category=` · `GET /api/blog/:slug` · `GET /api/faqs` · `GET /api/locations`

**Public write (rate-limited, Zod-validated)**
`POST /api/applications` (Apply Now form) · `POST /api/contact` (Contact form)

**Admin — content CRUD** (`/api/admin/*`, JWT + role middleware; each resource gets full CRUD + reorder where applicable)
`PUT /api/admin/content/:pageSlug` · `POST|PUT|DELETE|PATCH /api/admin/services[/:id][/reorder]` · same pattern for `platforms`, `stats`, `process-steps`, `benefits`, `faqs`, `locations` · `POST|PUT|DELETE /api/admin/testimonials[/:id]` + `PATCH /:id/approve` + `PATCH /:id/feature` · `POST|PUT|DELETE /api/admin/blog[/:id]` + `PATCH /:id/publish`

**Admin — operations**
`GET /api/admin/applications` · `GET /api/admin/applications/:id` · `PATCH /api/admin/applications/:id/status` · `GET /api/admin/applications/export` · `GET /api/admin/messages` · `PATCH /api/admin/messages/:id/status` · `DELETE /api/admin/messages/:id`

**Admin — media, users, settings, dashboard, logs**
`POST /api/admin/upload` (Multer→Cloudinary) · `DELETE /api/admin/upload/:publicId` · `GET|POST|PUT|DELETE /api/admin/users[/:id]` (super_admin only) · `PUT /api/admin/settings` · `GET /api/admin/dashboard/stats` · `GET /api/admin/logs`

**System**
`GET /api/health`

All admin routes: `authenticate` (JWT) → `authorize(role)` → `validate(zodSchema)` → controller → `activityLogger`. All public POST routes: `rateLimiter` → `validate(zodSchema)` → controller.

---

## 10. Folder Architecture

```
client/
  src/
    app/                  App.jsx, router.jsx, providers (QueryClient, Auth, Theme)
    components/
      common/             Button, Input, Modal, Card, Accordion, ...
      layout/              Header, Footer, MobileMenu, AdminLayout, Sidebar
      sections/            Hero, StatsSection, ProcessTimeline, TestimonialsCarousel, CTASection
      states/              SkeletonCard, EmptyState, ErrorBoundary
    features/
      home/ about/ services/ platforms/ benefits/ blog/ faq/ contact/ apply/ locations/
      admin/
        dashboard/ services/ platforms/ testimonials/ blog/ faq/ locations/
        applications/ messages/ media/ users/ settings/
    hooks/                useAuth, useDebounce, useMediaQuery, ...
    lib/                  axios.js, queryClient.js, cloudinary.js
    schemas/              zod validation schemas (shared shape with server)
    context/               AuthContext, ThemeContext
    routes/                AppRoutes.jsx, ProtectedRoute.jsx, AdminRoute.jsx
    styles/                globals.css, tailwind.config.js tokens
    utils/                 formatters, constants
  public/
  index.html · vite.config.js · tailwind.config.js · .env.example

server/
  src/
    config/               db.js, cloudinary.js, redis.js, env.js
    models/               User, Service, Platform, Stat, ProcessStep, Benefit,
                           Testimonial, BlogPost, FAQ, Location, Application,
                           ContactMessage, SiteSettings, PageContent, ActivityLog, Media
    controllers/           one per resource
    routes/                 one per resource, mounted in routes/index.js
    middlewares/            auth.js, authorize.js, validate.js, upload.js,
                             rateLimiter.js, errorHandler.js, requestLogger.js, activityLogger.js
    validators/             zod schemas per resource
    services/               emailService.js, cloudinaryService.js, cacheService.js
    utils/                  ApiResponse.js, asyncHandler.js, tokenUtils.js
  logs/
  app.js · server.js · .env.example · Dockerfile

docker-compose.yml
README.md
```

---

## 11. Non-Functional Requirements

- **SEO**: Per-page meta via `react-helmet-async`, dynamic sitemap.xml + robots.txt generation, JSON-LD (`LocalBusiness`/`Organization`/`Article` for blog), canonical URLs, Open Graph tags.
- **Accessibility (WCAG 2.1 AA)**: Semantic landmarks, ARIA on interactive components, full keyboard navigation, visible focus states, color contrast ≥ 4.5:1, alt text on all content images.
- **Performance**: Route-based code splitting (`React.lazy`), Cloudinary auto-format/quality image delivery, lazy-loaded below-fold images, `compression` middleware, Redis caching on public GET endpoints, bundle analysis in CI.
- **Security**: `helmet`, strict CORS allowlist, `express-rate-limit` on public write routes, bcrypt password hashing, JWT in httpOnly+secure cookies, Zod validation on both client and server, Mongo query sanitization (NoSQL injection), Multer file-type/size restrictions.
- **Reliability**: Centralized Express error middleware, React `ErrorBoundary` per route, custom 404/500 pages, Morgan HTTP logs + structured app logging, health-check endpoint for uptime monitoring.
- **UX States**: Loading skeletons matched to each card type, empty states for zero-data lists, success/error toasts on every form submission.
- **DevOps**: Dockerfiles for client/server, `docker-compose.yml` (client + server + mongo + redis), `.env.example` for both apps, environment-based config (no hardcoded secrets).

---

## 12. Assumptions & Open Items for Client Sign-Off

1. Blog and FAQ are net-new sections not on the current site — content will need to be supplied or drafted collaboratively before launch.
2. Email address and social media links will be added as empty/admin-fillable fields; client to supply actual values when ready.
3. Final color palette, font pairing, and logo treatment will be presented as a mini design-system deliverable in **Phase 2** before any component is built.
4. "Apply Now" is treated as a lead-capture form (stored in `applications`, visible in admin) rather than a full document-upload pipeline — file/document upload can be added later if the client wants riders to upload ID proof directly.
5. Redis is optional per the original stack list — included in architecture but can be deferred to a later phase if infra isn't ready at launch.

---

## 13. Phase Roadmap (for context, not started)

- **Phase 1** (this document): SRS ✅
- **Phase 2**: Design system — color tokens, typography scale, Tailwind config, component visual spec
- **Phase 3**: Backend — models, auth, API implementation
- **Phase 4**: Frontend — public site pages/components
- **Phase 5**: Admin panel
- **Phase 6**: Integrations (Cloudinary, Nodemailer, Redis), SEO pass, accessibility audit
- **Phase 7**: Testing, Docker, deployment

---

*Awaiting your review and approval before Phase 2 begins.*
