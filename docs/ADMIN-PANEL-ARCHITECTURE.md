# Admin Panel Architecture — Phase 3
## Zerivon — Enterprise Admin Console

Version 1.0 · 2026-08-05
Architecture only — no code, per phase instructions. Builds on [docs/SRS.md](SRS.md) (Phase 1) and [docs/DATABASE-DESIGN.md](DATABASE-DESIGN.md) (Phase 2).

---

## 1. Design Principle: Don't Force One Workflow onto Every Module

You asked for CRUD, search, pagination, filtering, sorting, status toggle, soft delete, bulk delete, image upload, drag-drop ordering, preview, autosave draft, publish/unpublish, and version history "for every module." Applied literally and identically to all 30 modules, this produces a bloated, inconsistent admin — a Contact Message inbox does not need "Publish/Unpublish" or "Version History," and Activity Logs must never be soft-deletable (that would defeat the point of an audit trail).

Instead, every module is assigned to one of **three tiers**, each with a clear default capability profile. Every capability you listed is still accounted for — it's applied where it's structurally meaningful, and explicitly marked "not applicable" with a reason where it isn't. Section 3 gives the full per-module breakdown so nothing is left ambiguous.

---

## 2. The Three Module Tiers

### Tier 1 — Rich Content (publishable, high business impact)
Full authoring workflow: draft → preview → publish, with rollback.

| Capability | Behavior |
|---|---|
| CRUD | Full |
| Search / Pagination / Filtering / Sorting | Full, server-side |
| Status Toggle | `draft` / `published` / `archived` (tri-state, not a boolean) |
| Soft Delete + Bulk Delete | Full |
| Image Upload | Full, wherever the module has visual fields |
| Drag & Drop Ordering | Full, wherever manual sequence affects the public site |
| Preview | Live "view as draft" on the real public site template, via signed preview token |
| Autosave Draft | Every ~2s of inactivity / on field blur, saved to a **draft shadow copy** — never overwrites the live published version |
| Publish/Unpublish | Explicit action; copies draft → published and creates a version snapshot |
| Version History | Full — snapshot on every publish, diff view, one-click restore |

**Modules:** Hero Banner, Homepage Sections, Services, Industries, Portfolio, Blog Posts, Site Settings, Theme Settings, Navigation Menu, Footer.

### Tier 2 — Structured List Content (smaller records, still public-facing)
Full list management, lighter authoring — a testimonial or FAQ entry doesn't need a diff/restore workflow.

| Capability | Behavior |
|---|---|
| CRUD | Full |
| Search / Pagination / Filtering / Sorting | Full, server-side |
| Status Toggle | Simple `isActive` boolean (shown as Active/Inactive switch) |
| Soft Delete + Bulk Delete | Full |
| Image Upload | Where the module has a visual field |
| Drag & Drop Ordering | Full — this tier is exactly where manual curation order matters most (client logos, team grid, FAQ order) |
| Preview | Not applicable — these records don't have their own public URL, they render inline within a Tier 1 page (e.g., a testimonial has no standalone page to preview) |
| Autosave Draft | Not applicable — record is small enough that direct save with a confirmation toast is sufficient; no meaningful "in-progress" state to protect |
| Publish/Unpublish | Same Active/Inactive toggle above does this job; no separate draft copy needed |
| Version History | Not applicable — low edit frequency, low blast radius; reintroduce later only if the client requests it |

**Modules:** Clients, Testimonials, Team, Career Jobs, FAQ, Gallery, Categories, Social Media.

### Tier 3 — Operational / Transactional (records the business generates, not authors)
These are inboxes, accounts, and logs — not content. "Publishing" is a meaningless concept here.

| Capability | Behavior |
|---|---|
| CRUD | Read + Update always; Create only where a human genuinely creates the record (Users, Roles, Gallery-adjacent N/A); Delete is soft-delete, not permanent, **except Activity Logs** |
| Search / Pagination / Filtering / Sorting | Full, server-side — this is where volume is highest (leads, messages, logs), so this matters most |
| Status Toggle | Domain-specific status enum instead of Active/Inactive (e.g., Job Application: applied → shortlisted → hired; Contact Message: unread → read → replied) |
| Soft Delete + Bulk Delete | Full, **except Activity Logs**, which is immutable by design — an audit trail that can be deleted isn't an audit trail |
| Image Upload | Only where genuinely needed (User avatar); N/A elsewhere |
| Drag & Drop Ordering | Not applicable — these lists are ordered by time or status, not manual curation |
| Preview | Not applicable |
| Autosave Draft | Not applicable |
| Publish/Unpublish | Not applicable |
| Version History | Not applicable (Activity Log *is itself* the version history of everything else) |

**Modules:** Job Applications, Contact Messages, Newsletter, Media Library, SEO (route index), Users, Roles, Permissions, Activity Logs.

**Exempt from the matrix entirely:** Dashboard and Analytics are read-only aggregation views, not content collections — see §7 and §8.

---

## 3. Full Module Table

| # | Module | Tier | Type | Backend Source (Phase 2) | Notes / Deviations from Tier Default |
|---|---|---|---|---|---|
| 1 | Dashboard | — | View | Aggregates across collections | No CRUD; see §7 |
| 2 | Hero Banner | 1 | Full module | `HeroBanner` | Ordering is scoped **per page** (each page's banner carousel reorders independently) |
| 3 | Homepage Sections | 1 | Full module (singleton) | `Homepage` | No pagination/search (bounded list of ~8-10 sections); ordering *is* the entire UI |
| 4 | Services | 1 | Full module | `Service` | |
| 5 | Industries | 1 | Full module | `Industry` | |
| 6 | Portfolio | 1 | Full module | `Portfolio` | |
| 7 | Clients | 2 | Full module | `Client` | |
| 8 | Testimonials | 2 | Full module | `Testimonial` | Status toggle is 3-way in practice: `isApproved` (submitted vs vetted) + `isFeatured` (shown on homepage) — two switches, not one |
| 9 | Team | 2 | Full module | `TeamMember` | |
| 10 | Career Jobs | 2 | Full module | `Career` | Status is `draft / open / closed` (domain-specific, not generic Active/Inactive) |
| 11 | Job Applications | 3 | Full module | `JobApplication` | Filter by Job + Status; resume download action |
| 12 | Blog | 1 | Full module | `Blog` | Category is a **reference** to the new `Category` module (see §5), not free text |
| 13 | Categories | 2 | Full module | New: `Category` | Shared taxonomy for Blog (and Portfolio, optionally); `type` field scopes which module a category belongs to |
| 14 | FAQ | 2 | Full module | `FAQ` | Secondary grouping by `page` and `category` in the list filters |
| 15 | Media Library | 3 (special) | Full module | `Media` | Not "publish" workflow — it's upload/tag/organize; see §6 |
| 16 | Gallery | 2 | Full module | New: `GalleryAlbum` | Album-of-images pattern; images reference Media Library items rather than re-uploading |
| 17 | SEO | 3 (special) | Full module + inline tabs | `SeoMeta` + embedded `seo` in Tier 1 modules | Two touchpoints — see §6 |
| 18 | Contact Messages | 3 | Full module | `ContactRequest` | Status: unread → read → replied → archived |
| 19 | Newsletter | 3 | Full module | `Newsletter` | Export-to-CSV action; unsubscribe is user-initiated, admin can manually toggle |
| 20 | Site Settings | 1 | Settings module (singleton) | `SiteSetting` | Includes **Company Information** as a tab (legal name, addresses, business hours) — not a separate collection, see §5 |
| 21 | Navigation Menu | 1 | Full module (singleton per location) | `Navigation` | Drag-drop with nesting (parent/child); live preview of resulting menu |
| 22 | Footer | 1 | Settings module (singleton) | `FooterConfig` | Columns + links are drag-drop orderable, nested one level |
| 23 | Company Information | — | Tab, not a module | `SiteSetting.contact` / `businessHours` | See #20 |
| 24 | Theme Settings | 1 | Settings module (singleton) | `SiteSetting` (extended) | Parent for Colors/Typography/Buttons tabs, see #25–27 |
| 25 | Colors | — | Tab, not a module | `SiteSetting.themeColors` | Live swatch preview against real components |
| 26 | Typography | — | Tab, not a module | `SiteSetting` (extended — new fields, see §5) | Font pickers + live type-scale preview |
| 27 | Buttons | — | Tab, not a module | `SiteSetting` (extended — new fields, see §5) | Border-radius/size/variant tokens + live button preview |
| 28 | Social Media | 2 | Full module | `SocialLink` | |
| 29 | Analytics | — | View | GA4 + internal counters | No CRUD; see §8 |
| 30 | User Management | 3 | Full module | `User` | Status: active / suspended; cannot self-suspend |
| 31 | Roles | 3 | Full module | `Role` | System roles (`isSystem: true`) cannot be deleted or renamed |
| 32 | Permissions | 3 | Full module, mostly read | `Permission` | Seed-managed; UI allows *assigning* permissions to roles more than authoring new permission keys (new permission keys ship with code, not typed in by an admin) |
| 33 | Activity Logs | 3 (locked) | Full module, read-only | `ActivityLog` | No create/update/delete of any kind from the UI; filter/search/export only |

Modules 23, 25, 26, 27 are listed because you named them explicitly — architecturally they are **tabs inside a parent settings module**, not separate collections or routes. Splitting a single design-token document into four separate CRUD screens would force an admin to save colors, fonts, and button styles in four different places when they conceptually belong to one "how the site looks" document. Counting only standalone modules, this is **26 modules** across 8 sidebar groups.

---

## 4. Admin Information Architecture

```
/admin/login
/admin/forgot-password

/admin                                Dashboard

/admin/content
  /hero-banners
  /homepage-sections
  /services
  /industries
  /portfolio
  /clients
  /testimonials
  /team
  /gallery
  /faq

/admin/blog
  /posts
  /categories

/admin/careers
  /jobs
  /applications

/admin/engagement
  /messages                           Contact Messages
  /newsletter

/admin/media                          Media Library

/admin/site
  /settings                           incl. Company Information tab
  /theme                              incl. Colors / Typography / Buttons tabs
  /navigation
  /footer
  /social-media
  /seo

/admin/analytics

/admin/access
  /users
  /roles
  /permissions
  /activity-logs
```

Sidebar groups mirror this tree exactly (Dashboard, Content, Blog, Careers, Engagement, Media, Site Configuration, Analytics, Access Control) — 8 groups, never more than 10 items per group, so the sidebar stays scannable without a search-within-sidebar crutch.

---

## 5. Backend Schema Deltas Required Before Build

Phase 2 covers most of this admin panel as-is. Five gaps need to close before Phase 4 (API) work starts. No code here — field-level spec only, for whoever implements Phase 4:

1. **New `Category` collection** — `{ name, slug, type: enum[blog, portfolio], description, order, ...audit }`. `Blog.category` (currently free-text) becomes `Blog.category: ObjectId ref Category`.
2. **New `GalleryAlbum` collection** — `{ title, slug, coverImage, images: [{ media: ObjectId ref Media, caption, order }], status, order, ...audit }`.
3. **New `ContentVersion` collection** — generic version-history store: `{ module, entityId, versionNumber, snapshot: Mixed, changeNote, createdBy, createdAt }`. One collection serves every Tier 1 module rather than a bespoke history array bolted onto each schema.
4. **`SiteSetting` extension** — add `typography: { headingFont, bodyFont, baseFontSize, scaleRatio }` and `buttonStyles: { borderRadius, primaryVariant, secondaryVariant, size }` sub-documents, siblings of the existing `themeColors`.
5. **Draft/publish shadow copy on every Tier 1 module** — `Service`, `Industry`, `Portfolio`, `HeroBanner`, `Homepage`, `Navigation`, `FooterConfig` currently have no `status` field (only `Blog` and `Career` do from Phase 2). Add `status: draft|published|archived` plus a `draftSnapshot: Mixed` field that autosave writes to, so in-progress edits never affect what the public site renders until "Publish" is pressed.

---

## 6. Shared Engines (built once, composed everywhere)

Rather than rebuilding search/pagination/upload/etc. per module, six shared engines are composed by every module's screens. This is what actually makes "90% of modules get the same 14 capabilities" tractable without 30 bespoke implementations.

**DataTable Engine** — one configurable table component driving list views: server-side search (debounced), pagination, column-based filtering, column sorting, row-level status toggle, row selection → bulk soft-delete, and a "Restore" view for soft-deleted items (trash, not permanent loss). Every Tier 1/2/3 list screen is a config object fed into this engine, not a hand-built table.

**Form + Draft Engine** — wraps React Hook Form + Zod. For Tier 1 modules it operates in draft-shadow mode (see §5 point 5): typing writes to `draftSnapshot` on a debounce, a persistent "Draft saved Xs ago" indicator shows autosave status, and "Publish" is a distinct, explicit action. For Tier 2/3 it's a plain form with direct save.

**Media Picker** — a single modal component (browse Media Library / upload new / crop / alt-text) invoked from any field that needs an image, backing onto the Media Library module itself. No module implements its own upload UI.

**Drag-Reorder Engine** — pointer- and keyboard-operable list reordering (arrow-key fallback for accessibility, not just mouse drag), writing an `order` integer back per item on drop. Used identically by Hero Banner, Homepage Sections, Services, Navigation, Footer columns, Gallery images, etc.

**Preview Engine** — for Tier 1 modules, "Preview" opens the real public-site route with a short-lived signed token appended; the public API, when it sees a valid token, serves `draftSnapshot` instead of the published document for that one request. This means preview always renders through the actual production template — never a separate "admin preview renderer" that can drift from reality.

**Version History Engine** — reads/writes the `ContentVersion` collection (§5.3). "Publish" always writes a new version; the history panel is a timeline with diff-on-hover and one-click restore (restore = copy that version's snapshot into `draftSnapshot`, then requires an explicit re-publish — restoring never silently overwrites the live site either).

Both Preview and Version History intentionally route back through the same publish/draft mechanism rather than each other — a smaller surface area to reason about and test.

---

## 7. Dashboard Architecture

Read-only aggregation view, no entities of its own. Widgets, each independently cached/refetched:

- **Lead funnel** — new/contacted/onboarded counts from `RiderApplication` this week vs. last week (the core business conversion metric)
- **Inbox health** — unread `ContactRequest` count, pending `Testimonial` approvals, open `JobApplication`s awaiting review
- **Content health** — published vs. draft counts per Tier 1 module (surfaces stale drafts sitting unpublished)
- **Recent activity feed** — latest 10 entries from `ActivityLog`, linking into the affected record
- **Quick actions** — shortcuts into the screens the above widgets point at (e.g., clicking "12 unread messages" opens Contact Messages pre-filtered to `unread`)

No widget here performs a write; every number is a query against an existing module's collection, so the dashboard has zero data-integrity surface of its own.

---

## 8. Analytics Architecture

Also read-only, but sourced partly externally:

- **Traffic & behavior** — embedded via Google Analytics 4 Data API, keyed off `SiteSetting.analytics.googleAnalyticsId` (already in the Phase 2 schema) — pageviews, top landing pages, device/geo breakdown
- **Content performance** — `Blog.views` (already tracked in Phase 2) ranked, most-viewed `Portfolio`/`Service` pages
- **Conversion tracking** — `RiderApplication` and `ContactRequest` volume over time, source breakdown (`source` field on both), funnel drop-off between "new" and "onboarded"

No new collection is required — this module is a read layer over existing counters plus a third-party API integration, which is why it's exempt from the CRUD matrix entirely.

---

## 9. Role-Based Access Control (RBAC) Architecture

Three-layer enforcement, never trusting the UI layer alone:

1. **Data layer** — `Permission` documents are namespaced `module:action` (e.g. `blog:publish`, `users:delete`), seeded at deploy time, not hand-typed by admins (Permissions module is read/assign-only, per §3 note).
2. **API layer** (source of truth) — every admin route checks the requesting user's `Role.permissions` against the required permission for that action; this is the only enforcement that actually matters for security.
3. **UI layer** (convenience, not security) — the sidebar, module actions, and even individual buttons (Publish, Delete, Bulk Delete) render conditionally based on the current user's resolved permission set, so users never see actions they can't perform — but this is purely UX; a stripped-down client could never bypass layer 2.

`isSystem: true` roles (e.g., Super Admin) are protected from deletion/permission-stripping at the API layer regardless of who's asking, preventing an org from ever locking itself out of its own admin panel.

Every mutating action across every module — regardless of tier — writes one `ActivityLog` entry (`user`, `action`, `module`, `entityId`, `changes` diff). This is enforced centrally (one piece of middleware wrapping all admin mutation routes), not opted into per module, so the audit trail can't have gaps from a module author forgetting to log something.

---

## 10. Frontend Folder Architecture (admin subtree)

Extends the `client/src/features/admin/` structure from the Phase 1 SRS:

```
features/admin/
  shared/
    DataTable/              the DataTable engine (§6)
    FormEngine/              draft/autosave/publish form wrapper (§6)
    MediaPicker/
    DragReorder/
    VersionHistory/
    PermissionGate/          <RequirePermission> wrapper component
  dashboard/
  content/
    heroBanners/  homepageSections/  services/  industries/
    portfolio/  clients/  testimonials/  team/  gallery/  faq/
  blog/
    posts/  categories/
  careers/
    jobs/  applications/
  engagement/
    messages/  newsletter/
  media/
  site/
    settings/  theme/  navigation/  footer/  socialMedia/  seo/
  analytics/
  access/
    users/  roles/  permissions/  activityLogs/
```

Every leaf folder (e.g., `content/services/`) follows the same internal shape: `ListPage.jsx` (config → DataTable engine), `EditForm.jsx` (config → Form Engine), and a `queries.js` (React Query hooks for that module's endpoints) — the tiering in §2 determines which optional pieces (drag-reorder, version history panel, preview button) that config turns on.

---

## 11. State & Data-Flow Architecture

- **Server state**: TanStack Query exclusively — one query-key namespace per module (`['services', filters]`, `['services', id]`), automatic cache invalidation on mutation, optimistic updates for high-frequency low-risk actions (status toggle, drag-reorder) with rollback on server rejection.
- **Client/UI state**: local component state for table filters/selection; a small global store (React Context, not Redux — the admin has no state complex enough to justify it) only for the current user's session/permissions, since that's read by the PermissionGate wrapper everywhere.
- **Autosave debounce**: 2s of typing inactivity or on field blur, whichever comes first; a visible "Saving… / Draft saved" indicator avoids the classic silent-autosave anxiety.
- **Bulk actions**: selection state lives in the DataTable engine itself, cleared on any successful bulk mutation or on filter/page change (never carries stale selection across a changed result set).

---

## 12. Non-Functional Requirements Specific to the Admin Panel

- **Performance at volume**: `Media Library`, `Activity Logs`, and `Job Applications`/`Contact Messages` are the collections most likely to grow into the thousands — these mandate server-side pagination from day one (no "load all, filter client-side" shortcut anywhere in the admin).
- **Accessibility**: drag-and-drop reordering ships with an arrow-key/keyboard alternative on every instance, not just Navigation Menu — WCAG 2.1 AA doesn't grade on a curve for admin tools.
- **Safety rails**: destructive actions (bulk delete, permanent purge from trash, role deletion) require a typed confirmation (not just an OK/Cancel dialog) once the affected count exceeds a threshold (e.g., >5 records).
- **No silent data loss**: the draft/published shadow-copy pattern (§5.5, §6) exists specifically so that "autosave" and "someone else is also editing this" can never clobber the live site — the worst case is a lost *draft*, never a broken *published page*.

---

## 13. Standing Requirements (per project instructions)

- Latest stable versions of all libraries and dependencies at implementation time.
- Clean, scalable, production-ready code in the eventual build phase — no placeholders or TODOs.
- Business content preserved from the existing zerivon.in site; visual design remains original, inspired by (not copied from) digiverse.co.in.
- This architecture is calibrated so that content genuinely editable through the admin — every Tier 1 and Tier 2 module, plus Site Settings/Theme/Navigation/Footer — covers approximately 90% of what renders on the public site, per the project's standing goal.

---

*Awaiting your review. Next phase (whenever you're ready): API implementation over the Phase 2 schema + this admin architecture.*
