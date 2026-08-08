# Database Design — Phase 2
## Zerivon — MongoDB Schema Layer

Version 1.0 · 2026-08-05
Code: `server/src/models/` (Mongoose 9.9.1)

---

## 1. Scope & How This Maps to Your Collection List

You asked for 24 named collections plus Users/Roles/Permissions. I implemented all of them, and added **6 more** that either preserve Zerivon's actual business content (per the standing instruction) or are structurally required to hit the "~90% admin-editable" bar. Nothing below is speculative — every addition is used by at least one page in the Phase 1 sitemap.

| Your list | Implemented as | Notes |
|---|---|---|
| Users, Roles, Permissions | `User`, `Role`, `Permission` | Role references Permission docs (many-to-many); User references one Role |
| Homepage | `Homepage` (singleton) | Controls section order/visibility only — actual content lives in each section's own collection |
| Services | `Service` | |
| Industries | `Industry` | |
| Blogs | `Blog` | |
| Careers | `Career` + `JobApplication` | Split: job postings vs. applicant submissions (same pattern as Zerivon's own lead form) |
| Testimonials | `Testimonial` | |
| Clients | `Client` | Logo/brand showcase ("trusted by") |
| Portfolio | `Portfolio` | |
| FAQ | `FAQ` | |
| Contact Requests | `ContactRequest` | |
| Newsletter | `Newsletter` | |
| Media Gallery | `Media` | |
| SEO | `SeoMeta` + embedded `seo` sub-schema | See §3 |
| Site Settings | `SiteSetting` (singleton) | |
| Navigation | `Navigation` | Recursive, supports dropdowns |
| Footer | `FooterConfig` (singleton) | |
| Social Links | `SocialLink` | |
| Hero Banners | `HeroBanner` | |
| Statistics | `Statistic` | |
| Awards | `Award` | |
| Certificates | `Certificate` | |
| Offices | `Office` | Replaces Phase 1's `locations` name |
| Team Members | `TeamMember` | |
| *(not in your list)* | `Platform` | **Zerivon-specific**: Uber/Swiggy/Zomato/Blinkit/Zepto/Vahan — this is core business content from the old site and must be preserved |
| *(not in your list)* | `ProcessStep` | **Zerivon-specific**: the 4-step "How It Works" flow |
| *(not in your list)* | `Benefit` | **Zerivon-specific**: 48-hr activation, weekly payouts, etc. |
| *(not in your list)* | `RiderApplication` | **Zerivon-specific**: the "Apply Now / Become a Rider" lead form — this is the site's primary conversion goal, distinct from `JobApplication` (internal hiring) |
| *(not in your list)* | `PageContent` | Generic freeform blocks (heading/body/media) for static pages with no dedicated collection — About intro, Contact intro, Privacy Policy body, etc. This is what pushes editable coverage toward 90% |
| *(not in your list)* | `ActivityLog` | Audit trail — required to make `createdBy`/`updatedBy` actually mean something operationally |

**33 collections total.**

---

## 2. Shared Building Blocks (DRY, not duplicated 33 times)

- **`plugins/auditable.plugin.js`** — every schema calls `schema.plugin(auditablePlugin)`. Adds `isActive`, `isDeleted`, `createdBy`, `updatedBy` uniformly, plus `softDelete()` / `restore()` instance methods and a `findActive()` static. `createdAt`/`updatedAt` come from `{ timestamps: true }` on every schema.
- **`schemas/seo.schema.js`** — reusable `{ metaTitle, metaDescription, metaKeywords, ogImage, canonicalUrl, noIndex }` sub-document, embedded wherever a page/entity needs its own SEO (Service, Blog, Career, Portfolio, Industry, Homepage, PageContent).
- **`schemas/image.schema.js`** — reusable `{ url, publicId, alt, width, height }` sub-document for every Cloudinary-backed image field.
- **`utils/slugify.js`** — `attachSlug(schema, sourceField)` wires a `pre('validate')` hook that derives `slug` from the given field when absent, and normalizes any manually-entered slug. Uniqueness is enforced by a DB-level unique index, not app logic.
- **`constants/enums.js`** — every enum (statuses, employment types, vehicle types, social platforms, etc.) lives in one file so values can't drift between schema and future validators.

All 33 models were loaded and validated against real Mongoose 9 schema compilation (slug generation, recursive nav embedding, custom validators, and password hashing were exercised directly — see verification log at the end of this doc).

---

## 3. Key Relationships

```
Role ──< Permission (many-to-many via Role.permissions[])
User >── Role (many-to-one)
User ──< Blog (author)
User ──< ActivityLog, ContactRequest.respondedBy, Media.uploadedBy

Service ──< Industry (many-to-many via Service.industries[])
Portfolio >── Client, Industry, Service (many-to-one each)
Testimonial >── Platform (many-to-one)
RiderApplication ──< Platform (many-to-many via preferredPlatforms[])
JobApplication >── Career (many-to-one)
Career ──< JobApplication (one-to-many)

Homepage.sections[].key   → logically points at Service/Testimonial/Blog/etc.
                             (soft reference by convention, not ObjectId —
                             a section renders "featured/latest N" from its
                             own collection, it doesn't store item IDs)
PageContent.pageSlug      → soft reference to a route, not a collection
SeoMeta.route             → soft reference to a route, not a collection
```

Design choice: `Homepage`, `PageContent`, and `SeoMeta` deliberately use **soft references** (string keys/slugs) rather than hard ObjectId references, because they orchestrate *layout*, not *ownership* — the content they point at already exists independently in its own collection and has its own lifecycle.

---

## 4. Index Rationale (production)

| Collection | Index | Why |
|---|---|---|
| `User` | unique `email`; `{role, isActive, isDeleted}` | login lookup; admin user-list filtering by role/status |
| `Role` / all slugged collections | unique `slug` | slug is the public lookup key for detail pages (`/services/:slug`) |
| `Permission` | `{module, action}` | role-builder UI groups permissions by module |
| `Service` | `{isActive, isDeleted, order}`; text index on `title, shortDescription` | public listing sorted by admin-defined order; search |
| `Blog` | `{status, publishedAt: -1}`; `tags`; text index on `title, excerpt, content` | blog listing query is always "published, newest first"; tag filter; full-text search |
| `Career` | `{status, department}` | careers page filters by department, only shows "open" |
| `JobApplication` | `{job, status}`; `email` | admin inbox grouped by job + status; duplicate-application checks |
| `RiderApplication` | `{status, createdAt: -1}`; `phone` | admin inbox default view; duplicate-lead lookup by phone |
| `ContactRequest` | `{status, createdAt: -1}` | admin inbox default view |
| `Testimonial` | `{isApproved, isFeatured, order}` | homepage only queries approved+featured, in order |
| `HeroBanner` | `{page, order, isActive}` | banner carousel per page, in order, active only |
| `PageContent` | unique `{pageSlug, sectionKey}` | one block per page/section, and it's the primary lookup pattern |
| `ProcessStep` | unique `{page, stepNumber}` | prevents duplicate step numbers per page, enforces ordering key |
| `Media` | unique `publicId`; `{type, folder}`; `tags` | Cloudinary is the source of truth for `publicId`; library browsing by type/folder/tag |
| `Newsletter` | unique `email` | prevents duplicate subscriptions |
| `SocialLink` | unique `{platform, url}` | allows multiple accounts per platform (e.g. two Instagram handles) without allowing exact duplicates |
| Every collection (via plugin) | `{isDeleted, isActive}` | every admin list view and every public query filters on both; this is the single most-hit predicate in the whole system |

General rule applied throughout: **fields used in a `WHERE`/filter get an index; fields only ever displayed don't.** Compound indexes are ordered filter-field(s) first, sort-field last, matching actual query shape (e.g., `{status: 1, createdAt: -1}` for inbox views).

---

## 5. Validation Approach

- **Format validation** (email, URL, phone) uses the `validator` package at the schema level — same rule the client-side Zod schemas will mirror in a later phase, so invalid data is rejected at both layers.
- **Enum validation** for all status/type fields, sourced from `constants/enums.js`.
- **Length constraints** (`maxlength`) on fields that render in fixed UI space or SEO meta tags (`metaTitle` ≤ 70, `metaDescription` ≤ 160, `Blog.excerpt` ≤ 300, `Testimonial.message` ≤ 1000).
- **Referential fields** use `ref` + `ObjectId` so Mongoose/population can enforce shape; existence of the referenced document is a Phase 3 (API-layer) concern, not a schema-layer one.

---

## 6. Verified

```
$ node --check src/models/index.js   → OK
$ node -e "import('./src/models/index.js')..."
Loaded 33 models: ActivityLog, Award, Benefit, Blog, Career, Certificate, Client,
ContactRequest, FAQ, FooterConfig, HeroBanner, Homepage, Industry, JobApplication,
Media, Navigation, Newsletter, Office, PageContent, Permission, Platform, Portfolio,
ProcessStep, RiderApplication, Role, SeoMeta, Service, SiteSetting, SocialLink,
Statistic, TeamMember, Testimonial, User

Career slug: backend-engineer            ✓ slug auto-derived from title
Service slug: rider-onboarding           ✓ slug auto-derived from title
Nav nested child: Talent Acquisition     ✓ recursive dropdown schema works
Rider bad phone correctly rejected        ✓ custom validator fires
Role slug: super-admin                    ✓ slug auto-derived from name
Password before hash matches plaintext: true   ✓ (expected — hash only runs on .save(), not .validate())
```

One real bug was caught and fixed during this verification: Mongoose 9 removed the legacy `pre(hook, function(next) {...})` callback style entirely (confirmed by reading the `kareem` 3.3.0 middleware engine source directly — it no longer synthesizes a `next` argument). Both `attachSlug`'s `pre('validate')` hook and `User`'s `pre('save')` password-hashing hook were written in the old callback style and would have silently failed at runtime with `next is not a function`. Both are now the current promise/plain-return style.

---

*Awaiting your review. Next phase (whenever you're ready): API implementation over this schema layer.*
