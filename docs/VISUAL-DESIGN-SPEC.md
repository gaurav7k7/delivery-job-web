# Visual Design Specification — Phase 4
## Zerivon — Premium Corporate Redesign

Version 1.0 · 2026-08-05
Design description only — no code, per phase instructions. This is the design-system layer promised in Phase 1 (§3) and the visual counterpart to the content architecture in Phase 1 and the schema in Phase 2. Implementation (Phase 5+) builds directly against the tokens and section specs below.

**Scope note:** the 18 content sections below are written as the *homepage* sequence (they map 1:1 to `Homepage.sections[]` from Phase 2 — this is literally what the "Homepage Sections" admin module from Phase 3 reorders). Several of them are also condensed teasers of a full dedicated page from the Phase 1 sitemap (Services teaser → `/services`; Case Studies teaser → `/portfolio`; Blog teaser → `/blog`; Careers teaser → `/careers`; Contact section → `/contact`). The section spec below describes the homepage treatment; dedicated pages reuse the same design language at full length.

---

## 1. Design Philosophy

Zerivon's business is *speed, activation, and income* — riders go from "never delivered a package" to "earning today" in 48 hours. The old site communicated this only through bare text stats. The redesign expresses it visually: **motion equals momentum**. Numbers count up instead of sitting static, timelines animate as you scroll instead of listing dates, and the entire palette is built around one deep, confident indigo (trust, corporate credibility — this is a business handling people's income and documents) cut with one high-energy amber (motion, earning, "go") — the accent color literally does the work of directing the eye toward income-related numbers, CTAs, and process highlights.

This is deliberately **not** Digiverse's navy-and-teal SaaS look (different hue family, different shape language — Digiverse leans pill-heavy and flat; this system leans soft-rounded with layered depth and gradient warmth) and **not** the old Zerivon site (which had no real design system at all — this replaces "a page with information on it" with an actual product-grade brand).

---

## 2. Design System Foundations

### 2.1 Color — Light Theme

| Token | Hex | Usage |
|---|---|---|
| `primary-50` | #EEF0FF | tinted section backgrounds, badge fills |
| `primary-100` | #DEE1FE | hover states on light surfaces |
| `primary-500` | #4F46E5 | **brand primary** — buttons, links, active nav, icon accents |
| `primary-700` | #3730A3 | deep primary — headings-on-tint, pressed states |
| `accent-400` | #FDBA74 | gradient stop, highlight underlines |
| `accent-500` | #F97316 | **brand accent** — CTAs' secondary punch, stat emphasis, badges ("New", "Fast-Track") |
| `neutral-0` | #FAFAF9 | page background |
| `neutral-100` | #F4F3F1 | card/section alternate background |
| `neutral-200` | #E7E5E1 | borders, dividers |
| `neutral-600` | #57596B | secondary text |
| `neutral-900` | #1C1E29 | primary text/headings |
| `success-500` | #16A34A | "onboarded", positive status |
| `warning-500` | #F59E0B | "pending" status |
| `danger-500` | #DC2626 | error states, form validation |

### 2.2 Color — Dark Theme

| Token | Hex | Usage |
|---|---|---|
| `primary-400` | #8B85FF | brand primary (brightened for dark contrast) |
| `primary-300` | #ADA8FF | hover/active on dark surfaces |
| `accent-400` | #FFB74D | brand accent (unchanged hue, lifted for dark) |
| `neutral-900` | #0B0C12 | page background |
| `neutral-800` | #14161F | card/section surface |
| `neutral-700` | #1F2230 | elevated surface / modal |
| `neutral-600` | #2C2F42 | borders, dividers |
| `neutral-300` | #A6A8B8 | secondary text |
| `neutral-0` | #F2F2F5 | primary text/headings |

Both themes share the same semantic hues (success/warning/danger) at adjusted lightness for AA contrast. All tokens are CSS custom properties swapped via `[data-theme="dark"]` on `<html>`; default follows `prefers-color-scheme`, with a manual toggle (sun/moon icon, animated morph on switch) persisted to `localStorage`.

**Admin tie-in (Phase 3 §5.4):** the admin's Theme Settings module exposes only `primary-500`, `accent-500`, and the two neutral background tokens per theme — the rest of each 9-step scale is generated programmatically from those base picks via an HSL lightness ramp, so a non-designer client can rebrand the whole site by picking 2 colors, not 20.

### 2.3 Typography

| Role | Font | Notes |
|---|---|---|
| Headings | **Sora** (variable) | geometric, confident, distinct from Digiverse's typical SaaS sans |
| Body / UI | **Inter** (variable) | high legibility at small sizes, industry-standard for dense admin + public UI consistency |

Modular scale, ratio 1.25, base 16px:

| Token | Size / Line-height | Weight |
|---|---|---|
| `display` | 3.5rem / 1.1 (clamp down to 2.25rem on mobile) | 700 |
| `h1` | 2.75rem / 1.15 | 700 |
| `h2` | 2.25rem / 1.2 | 700 |
| `h3` | 1.75rem / 1.25 | 600 |
| `h4` | 1.375rem / 1.3 | 600 |
| `body-lg` | 1.125rem / 1.6 | 400 |
| `body` | 1rem / 1.6 | 400 |
| `body-sm` | 0.875rem / 1.5 | 400 |
| `caption` | 0.75rem / 1.4 | 500, uppercase, tracked +0.04em |

Section eyebrows (small kicker labels above every `h2`, e.g. "WHO WE ARE") always use `caption` in `accent-500`, tracked wider — a repeated rhythm that ties every section together.

### 2.4 Spacing, Radius, Elevation

- **Spacing**: 8px base unit — 4/8/12/16/24/32/48/64/96/128/160, used for all padding/gaps/margins. Section vertical rhythm: 96px desktop / 64px mobile between sections.
- **Radius**: `sm` 8px (inputs, small badges), `md` 12px (buttons), `lg` 20px (cards), `full` (pills, avatars, icon buttons).
- **Elevation**: four soft, layered shadow levels (ambient + directional key light, not a single flat drop-shadow) — `elevation-1` (resting card) through `elevation-4` (open modal/dropdown). Primary buttons additionally get a **brand-tinted glow shadow** (`0 8px 24px -8px primary-500 at 40% opacity`) rather than a generic black shadow — a small detail that reads as premium.

### 2.5 Glassmorphism — Used Deliberately, Not Everywhere

Applied only where content floats over a rich gradient or imagery background, so it earns its keep rather than becoming visual noise:

- **Sticky header**, once scrolled past the hero: `backdrop-filter: blur(16px)`, background `neutral-0` at 70% opacity (light) / `neutral-900` at 65% opacity (dark), 1px bottom border at 8% white/black.
- **Stat cards in the Hero and Achievements sections**, sitting on top of the gradient mesh background: blur(20px), background white at 10–12% opacity (dark theme reads better here), 1px border at 15% white, subtle inner top highlight to sell "glass edge."
- **Mobile nav overlay** and **testimonial carousel card**: same recipe, lower blur (12px) for performance on mobile.

Not used on: standard content cards, tables, forms, footer — anywhere sitting on a flat neutral background, where glass has nothing to differentiate itself from and just costs GPU/battery for no visual gain.

### 2.6 Gradients

One signature gradient, reused everywhere rather than inventing a new one per section: **135° linear, `primary-500` → `#7C6FF0` (mid violet) → `accent-500`**. Used for: hero background mesh (as large, soft, blurred blob shapes — see §2.8), CTA banner backgrounds, gradient-clipped text on hero headline emphasis words and animated stat numbers, and thin 2–3px accent underlines beneath section eyebrows.

### 2.7 Iconography

**Lucide** icon set throughout (consistent 1.75px stroke, no fill, 20/24/32px sizing scale) — clean, modern, and license-friendly. Every service/benefit/process card icon sits inside a `md`-radius square token (48×48 or 64×64), background `primary-50` (light) / `primary-500` at 12% opacity (dark), icon colored `primary-500`/`primary-400`. On card hover, this icon tile background shifts to the full gradient (§2.6) and the icon inverts to white — the single most-repeated micro-interaction on the site.

### 2.8 SVG Decoration System

Abstract, on-brand background decoration — never literal clip-art:

- **Blurred gradient blobs** (large, soft-edged organic shapes, `filter: blur(80–120px)`) positioned behind the Hero and CTA sections, using the signature gradient at low opacity. Given very subtle parallax on scroll (see §2.9).
- **Dotted grid pattern** (small dot matrix, `neutral-200`/`neutral-700` at low opacity) as a texture layer behind the Stats and Achievements sections, reinforcing a "data/precision" feel.
- **Route-line motif**: a thin, gradient-stroked dashed path (evoking a delivery route on a map) used specifically in the Process/Timeline sections, animated to "draw" itself (stroke-dashoffset animation) as the user scrolls through the steps — this is the one decorative element that's actually *narrative* (it visually connects step 1 → step 4) rather than purely ambient, and it's the clearest visual link back to what Zerivon actually does.

All decorative SVGs are `aria-hidden="true"`, sit at `z-index: 0` behind content, and never reduce text contrast below AA (verified against the actual text color, not just "looks fine").

### 2.9 Motion System (Framer Motion)

| Token | Value | Used for |
|---|---|---|
| `ease-out-premium` | `cubic-bezier(0.16, 1, 0.3, 1)` | all entrance animations |
| `ease-in-premium` | `cubic-bezier(0.65, 0, 0.35, 1)` | exits, closing menus |
| `duration-micro` | 150ms | hover/press feedback |
| `duration-base` | 300ms | element transitions (theme toggle, tab switch) |
| `duration-section` | 600–800ms | scroll-triggered section reveals |
| `stagger-children` | 60–100ms | card grids, list items revealing in sequence |

**Scroll-reveal pattern** (used on every section, via `whileInView`): opacity 0→1, `translateY` 24px→0, `viewport={{ once: true, margin: "-100px" }}` — content animates in once, on first approach, never re-triggers on scroll-back (avoids the dated "animate every time it enters view" feel).

**Hover pattern** (cards): `scale(1.02–1.03)` + elevation step-up + icon-tile gradient fill (§2.7), 150–200ms. Buttons: primary CTA gets a subtle sheen-sweep (a soft diagonal highlight translating across the button on hover); buttons with a trailing arrow icon animate the icon `translateX(+4px)` on hover.

**Parallax**: restrained — hero background blobs and the route-line SVG move at 0.05–0.15× scroll speed (5–15px total travel), never full-strength parallax scrolling that causes layout shift or motion sickness.

**Smooth scroll**: page-level inertial smooth scrolling (Lenis) wraps the whole app, so anchor navigation and mouse-wheel scrolling both feel weighted/premium rather than the browser's default instant jump.

**Accessibility governor**: everything above respects `prefers-reduced-motion: reduce` — parallax and blob motion disable entirely, scroll-reveal collapses to a simple opacity fade (no translate), and Lottie/animated SVGs fall back to a static frame. This is a single global check, not a per-component opt-out.

### 2.10 Lottie — Used Sparingly, at High-Value Moments Only

Not sprinkled everywhere (that reads as gimmicky, not premium). Three specific placements:
1. **Hero** — a small, subtle looping illustration (e.g., a delivery route/pin pulse) beside the headline, low visual weight, never competing with the headline for attention.
2. **Process section, step 4 ("Start Earning")** — a short, non-looping success/checkmark animation that plays once when that step scrolls into view, reinforcing the "you're done, you're earning" payoff moment.
3. **Apply Now form success state** — a celebratory but brief (under 2s) confirmation animation after a rider submits their application.

All three lazy-load (dynamic import, not in the initial bundle) and fall back to a static SVG frame under reduced-motion or slow connections.

### 2.11 Cards — One System, Several Skins

A single card primitive (radius `lg`, elevation-1 resting / elevation-2 hover, `neutral-0`/`neutral-800` surface) is reskinned per context rather than each section inventing its own card:
- **Icon card** (Services, Why Choose Us, Industries): icon tile top, title, short description, optional "Learn more →" link.
- **Media card** (Case Studies, Blog, Portfolio): image top (fixed aspect ratio, lazy-loaded), category badge overlapping the image's bottom edge, title + excerpt below.
- **Profile card** (Testimonials, Team — Phase 3 module, not in this page but same primitive): avatar, name, role/city, quote or bio.
- **Stat card** (Statistics, Achievements): large gradient-clipped number, label below, glass treatment when on a gradient background (§2.5).

---

## 3. Global Chrome

### 3.1 Header / Navigation
Transparent over the hero (text/logo in white or high-contrast variant), transitioning to the glass treatment (§2.5) once scrolled past ~80% of hero height — a smooth 300ms cross-fade, not an abrupt snap. Center-aligned primary nav (desktop), logo left, "Apply Now" primary CTA + theme toggle + WhatsApp icon-button right. Mobile: hamburger opens a full-screen glass overlay with staggered link entrance (§2.9 stagger token).

### 3.2 Footer (as requested in your list)
Dark surface regardless of active theme (`neutral-900`) — footers read as a distinct "close of page" zone on most premium sites, and it's where the gradient (§2.6) reappears one final time as a thin top border treatment. Four-column layout (Company/About, Quick Links, Platforms, Contact + Office cities), social icons row, newsletter signup input inline, bottom bar with copyright + legal links + the platform-affiliation disclaimer preserved verbatim from the original site. Fully sourced from `FooterConfig` + `SiteSetting` + `SocialLink` (Phase 2/3) — this is one of the ~90%-admin-editable surfaces.

---

## 4. Section-by-Section Specification

### 4.1 Hero
**Content mapping:** `HeroBanner` (page: `home`) — headline emphasizing "thousands of riders earning steady income," subheadline on the 6-platform / 48-hour promise, dual CTA ("Apply Now" primary, "Talk to Us" secondary/outline).
**Layout:** Full-viewport-height (not forced 100vh on mobile — min-height with content-driven overflow), two-zone: left 60% text + CTAs + trust micro-copy ("No registration fee · 100% legitimate"), right 40% Lottie illustration (§2.10) + floating glass stat chip ("1.25L+ riders onboarded").
**Visual treatment:** Signature gradient mesh blobs (§2.8) behind everything, low opacity, blurred. Headline's key phrase ("earning steady income") gradient-clipped (§2.6).
**Motion:** Headline/subhead/CTAs stagger in on load (not scroll-triggered, since it's above the fold — plays once, immediately, via `animate` not `whileInView`). Background blobs have continuous slow ambient drift (12–18s loop) plus the scroll parallax from §2.9. Scroll-cue chevron at the bottom, gently bouncing.
**Dark/Light:** gradient hue stays constant; blob opacity increases slightly in dark mode (12% → 18%) since it reads as more washed-out against a dark background otherwise.

### 4.2 Animated Statistics
**Content mapping:** `Statistic` collection — riders onboarded, platforms, activation time, activation rate.
**Layout:** 4-column row (2×2 on mobile) of Stat cards (§2.11) on the dotted-grid texture (§2.8).
**Motion:** Count-up animation (0 → target value) triggered once on scroll-into-view, eased with `ease-out-premium`, duration scaled to magnitude (bigger numbers count slightly longer, ~1.2–1.8s, so they don't all finish instantly and feel synced/cheap).
**Visual:** Numbers use `display`-scale type, gradient-clipped; icon above each number (Lucide) in the icon-tile treatment.

### 4.3 Services
**Content mapping:** `Service` collection (Talent Acquisition, Skill Development, Rider Onboarding) — top 3 or `isFeatured` items.
**Layout:** 3-column icon-card grid (§2.11), section eyebrow "WHAT WE DO."
**Motion:** Grid staggers in (§2.9), each card hovers with icon-tile gradient fill + 1.02 scale.
**CTA:** "View All Services →" linking to `/services`, arrow micro-animates on hover.

### 4.4 Process ("How It Works")
**Content mapping:** `ProcessStep` collection — the original 4-step flow (Register → Verify → Activate → Earn), preserved verbatim from zerivon.in.
**Layout:** Horizontal 4-node timeline on desktop (vertical, stacked on mobile), connected by the animated route-line SVG motif (§2.8) — this is the one section where that motif is load-bearing, not just decorative.
**Motion:** As the section scrolls into view, the route-line "draws" itself left-to-right (stroke-dashoffset), each node's icon/label fading in as the line reaches it — a genuinely narrative scroll animation, not a generic fade. Step 4 gets the Lottie success moment (§2.10).

### 4.5 Platforms ("Technology Stack," reinterpreted)
**Content mapping:** `Platform` collection — Uber, Swiggy, Zomato, Blinkit, Zepto, Vahan. *(Reinterpretation note: a literal "tech stack" section doesn't map to a rider-onboarding agency's actual business — the honest equivalent of "which technologies/platforms are we integrated with" is the six delivery platforms riders get activated on, so this section fills that structural slot with real, truthful content rather than fabricated tech-logo filler.)*
**Layout:** Auto-scrolling logo marquee (pauses on hover/focus, respects reduced-motion by becoming a static wrapped row) using each platform's brand color as a subtle card-border accent.
**Motion:** Continuous slow horizontal scroll (CSS/Framer Motion `animate` loop), each logo card lifts slightly on hover revealing a one-line benefit ("Weekly payouts" etc. from `Platform.benefits[]`).

### 4.6 Why Choose Us (Benefits)
**Content mapping:** `Benefit` collection — 48-hr activation, 7-day support, weekly payouts, multi-platform activation, free training, joining bonuses.
**Layout:** Alternating 2-column "zig-zag" rows (icon-card left/text right, then mirrored) rather than a repeat of the Services grid — visually differentiates this section from 4.3 even though both are icon+text content, which matters since they sit close together in the page flow.
**Motion:** Each row slides in from its respective side (left row from left, right row from right) rather than the standard bottom-up reveal, reinforcing the alternating layout.

### 4.7 Industries ("Sectors We Serve")
**Content mapping:** `Industry` collection — reinterpreted as the gig-economy verticals Zerivon's platforms span: Food Delivery, Quick-Commerce/Grocery, Ride-Hailing/Mobility, Logistics & Courier. *(Same honesty principle as §4.5 — real segmentation of Zerivon's actual six platforms, not invented generic "industries.")*
**Layout:** 4-tile grid, each tile a large background image (dimmed/gradient-overlaid for text legibility) rather than the icon-card style — visually distinct from Services/Benefits, feels more editorial/photographic.
**Motion:** Ken-Burns-style slow image zoom on hover (subtle, ~1.08 scale over 4s), text overlay slides up slightly.

### 4.8 Our Journey (Timeline)
**Content mapping:** New lightweight content, admin-editable via `PageContent` (pageSlug: `home`, sectionKey: `timeline`) as a repeating milestone block — company founding, platform partnerships added, riders-onboarded milestones, office expansions.
**Layout:** Vertical alternating timeline (left/right cards off a center spine) on desktop, single-side on mobile.
**Motion:** Spine draws downward as you scroll (same stroke-dashoffset technique as §4.4, establishing a visual signature reused twice — intentional repetition, not two different timeline styles competing for "this is our motif" status), each milestone card fades/slides in from its side as the spine reaches it.

### 4.9 Case Studies
**Content mapping:** `Portfolio` collection, reinterpreted for Zerivon as **onboarding-drive case studies** (e.g., "5,000 Riders Onboarded in Bengaluru in 30 Days") — `metrics[]` field displays the before/after numbers.
**Layout:** Large media-card carousel (SwiperJS, 1.2 cards visible on desktop so the next card peeks in, signaling swipeability), each card: cover image, city/platform badges, headline metric pulled large (reusing the gradient-number treatment from §4.2).
**Motion:** Carousel entrance staggers; active/centered card gets a subtle scale-up (1.0 → 1.05) versus its peeking neighbors.

### 4.10 Clients / Partners
**Content mapping:** `Client` collection — platform/corporate partner logos.
**Layout:** Simple grayscale-by-default logo grid, logos gain full color + slight lift on hover (a very common but genuinely effective premium-site pattern — restraint here, this section doesn't need heavy motion).
**Motion:** Minimal — fade-in grid only. This section is intentionally the "quiet" one between two higher-motion neighbors (Case Studies and Testimonials), giving the page rhythm rather than nonstop animation fatigue.

### 4.11 Testimonials
**Content mapping:** `Testimonial` collection, `isFeatured: true` — riders from Bengaluru, Delhi NCR, Chennai with earnings figures, preserved from the original site.
**Layout:** Profile-card carousel (§2.11), glass treatment (§2.5) since it sits on a gradient-tinted section background, star rating, city + platform badge.
**Motion:** Auto-advance every 6s (pauses on hover/focus/touch), swipeable on mobile, card cross-fades with a slight scale rather than a hard slide.

### 4.12 Achievements
**Content mapping:** Curated highlight cards pulled from `Statistic`, presented narratively rather than as raw counters (differentiated from §4.2, which is the "instant proof" version at the top of the page — this is the "here's what that means" version further down, e.g. "Fastest-growing onboarding network in East India").
**Layout:** 3-across trophy-style cards on the dotted-grid texture (§2.8), reusing Stat card primitive but with a supporting sentence beneath the number instead of just a label.
**Motion:** Standard scroll-reveal stagger; no re-animated counting here (avoids redundant motion — the counting moment already happened in §4.2).

### 4.13 Awards & Recognition
**Content mapping:** `Award` collection — issuer, year, badge image.
**Layout:** Horizontal badge row/marquee (same mechanic as §4.5's platform marquee, reused rather than reinvented), each badge a simple framed logo with issuer/year on hover tooltip.
**Motion:** Same auto-scroll-pause-on-hover pattern as §4.5.

### 4.14 FAQ
**Content mapping:** `FAQ` collection, `page: 'home'`.
**Layout:** Two-column on desktop (accordion left, a supporting illustration/CTA card right — "Still have questions? Chat on WhatsApp"), single-column accordion on mobile.
**Motion:** Accordion expand/collapse: height auto-animates (Framer Motion `layout`), chevron icon rotates 180°, `duration-base`.

### 4.15 Latest From the Blog
**Content mapping:** `Blog` collection, `status: published`, latest 3, ordered by `publishedAt`.
**Layout:** 3-column media-card grid (§2.11).
**Motion:** Standard grid stagger reveal; card image has the same subtle Ken-Burns hover as §4.7 for visual consistency across all "image-forward" cards.

### 4.16 Careers Teaser
**Content mapping:** `Career` collection, `status: open`, count + 2–3 featured openings.
**Layout:** Split section — left: "We're Hiring" copy + open-roles count as a large gradient number; right: 2–3 compact job cards (title, department, location) linking to `/careers`.
**Motion:** Standard reveal; job cards get the icon-card hover treatment.

### 4.17 CTA Banner
**Content mapping:** Editable via `Homepage.sections[].settings` (headline/subhead/button text/link) — the site's final high-intent push toward Apply Now.
**Layout:** Full-width, signature gradient background (§2.6) at full saturation (this is the one section where the gradient is the *entire* background, not a subtle blob — it's meant to feel like a distinct, energetic full-stop before Contact/Footer), centered headline + single primary CTA (white/inverted button for contrast against the gradient).
**Motion:** Gradient has slow ambient hue-shift/position drift (very subtle, matching hero blob timing), button has the sheen-sweep hover from §2.9.

### 4.18 Contact
**Content mapping:** `Office` collection (4 Kolkata branches) + `SiteSetting.contact` (phone/WhatsApp/email) + a `ContactRequest`-submitting form.
**Layout:** Split — left: contact form (React Hook Form + Zod, inline validation, matching input styling from the design system's form tokens); right: stacked office cards with embedded map links, phone/WhatsApp click-to-actions.
**Motion:** Form field focus states use a soft `primary-500` glow ring (`box-shadow`, not a harsh outline); submit success replaces the form with a brief confirmation state (checkmark icon, `duration-base` cross-fade).

---

## 5. Responsive Behavior (applies across all sections)

- **Breakpoints:** 480 / 768 / 1024 / 1280 / 1536 — mobile-first Tailwind defaults, no custom breakpoint set needed.
- **Section padding** steps down from 96px → 64px → 48px as viewport narrows (§2.3).
- **Grids** collapse in the expected order: 4-col → 2-col → 1-col (Stats, Achievements), 3-col → 2-col → 1-col (Services, Blog), split layouts (Why Choose Us, Careers, Contact) stack with text-first ordering.
- **Motion cost on mobile:** parallax and marquees remain (they're cheap), but blur radius on glass/blob decoration is reduced (~40%) to protect GPU performance on mid-range devices; Lottie assets are the same three placements but sized down.

---

## 6. What Ties This Back to "90% Admin-Editable"

Every section above sources its content from a Phase 2 collection or `Homepage.sections[].settings` — none of the copy, images, stats, or ordering is hardcoded. The only genuinely fixed elements are the design *system* itself (the gradient recipe, motion tokens, card primitives) — which is correct: a client should be able to rewrite every word and reorder every section without a developer, but "rebrand the entire animation and layout language" is a design decision, not a content-editing one, and stays governed by the Theme Settings module's 2-color-input-drives-9-shade-scale mechanism (§2.2) rather than exposing raw CSS to the admin.

---

## 7. Standing Requirements (per project instructions)

- Latest stable versions of all libraries and dependencies at implementation time (Framer Motion, Lenis, Lucide, SwiperJS, Lottie-web/lottie-react).
- Clean, scalable, production-ready code in the implementation phase — no placeholders or TODOs.
- Business content preserved from zerivon.in (stats, platforms, process, benefits, testimonials, offices) — §4.5 and §4.7 explicitly reinterpret two requested section types to keep them truthful to Zerivon's real business rather than inventing fictional content to fill a generic template slot.
- Visual design is original, inspired by (not copied from) digiverse.co.in — differentiated on hue family, shape language (soft-rounded vs. pill-heavy), and motion signature (route-line/timeline narrative motion is not present on the reference site).
- ~90% of what's described above is sourced from admin-editable collections/settings, per §6.

---

*Awaiting your review. Next phase (whenever you're ready): implementation — component build against this spec, the Phase 2 schema, and the Phase 3 admin architecture.*
