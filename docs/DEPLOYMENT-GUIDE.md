# Deployment Guide

Version 1.0 · 2026-08-06

## 0. What I could and couldn't do in this pass

I don't have accounts or credentials for GitHub, Vercel, Render, MongoDB Atlas, Cloudinary, Sentry, or a domain registrar — deploying is fundamentally an account-level action only you can take. What I did instead: wrote every real config file the deployment needs (`vercel.json`, `render.yaml`, `.github/workflows/ci.yml`), wired up real error tracking (Sentry, gated to a no-op without a DSN, verified safe), initialized git locally, and — while building this — found and fixed a genuine latent bug (`recharts` depends on `react-is` as a peer dependency that was never actually installed; a clean `npm ci` on any CI/deploy platform would have failed the very first build). This guide is the exact sequence of account-level steps to take from here, in order, with copy-paste values everywhere one exists.

**Architecture decided in this pass**: the frontend (Vercel) proxies `/api/*`, `/sitemap.xml`, and `/robots.txt` to the backend (Render) via `vercel.json` rewrites. The browser only ever talks to one origin (your domain). This means no cross-origin CORS complexity for the actual API traffic, first-party (not third-party) cookies once real auth ships, and the sitemap/robots question flagged as open in `docs/PRODUCTION-OPTIMIZATION.md` is now resolved — see that file's updated note.

---

## 1. Push this repo to GitHub

Git is initialized locally (`git init`, branch renamed to `main`) but **nothing is committed yet** — I don't commit without being asked to. When you're ready:

```bash
cd "/home/gaurav/Desktop/delivery job web"
git add .
git commit -m "Initial commit"
```

Then create an empty repository on GitHub (no README/license — this repo already has content) and:

```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Everything below assumes this repo now lives on GitHub, since both Vercel and Render deploy by connecting to it directly.

---

## 2. MongoDB Atlas

1. Create a free account at mongodb.com/cloud/atlas.
2. Create a project, then a cluster.
   - **Tier**: M0 (free) works to get started, but **M0 does not support automated backups** — only manual on-demand snapshots via `mongodump`, and no point-in-time recovery. If backups are a hard requirement before real user data exists, budget for **M10** (~$0.08/hr, the cheapest tier with continuous backups). Decide this before real content/customer data goes in, not after.
   - Region: pick the one closest to your Render region (this guide uses Render's `singapore` region in `render.yaml` — match Atlas to the same region to minimize latency between API and DB).
3. **Database Access** → add a database user (not your Atlas login) with a strong generated password, scoped to "Read and write to any database" (or scope tighter to just the `zerivon` database once it exists).
4. **Network Access** → add IP `0.0.0.0/0` (allow from anywhere). This is correct here, not a shortcut: Render's free/starter tiers don't have static outbound IPs, so you can't allowlist a specific address. This is safe *because* Atlas requires TLS-encrypted connections and authenticated access regardless of network access rules — the "allow anywhere" rule only means "TLS+credentials are the actual gate," which they always were. If you later need to lock this down, Render offers static outbound IPs on paid plans, or use Atlas Private Endpoint (VPC peering) — overkill at this project's current stage.
5. **Backups** (if on M10+): Atlas → Backup → enable Continuous Backup, set a retention policy (7 days is a reasonable default). If staying on M0, set a recurring reminder to run `mongodump` manually and store the archive somewhere durable (e.g., a private S3/R2 bucket) until you upgrade.
6. Get your connection string: Cluster → Connect → Drivers → copy the `mongodb+srv://...` URI. This becomes `MONGODB_URI` in Render's environment variables (§5).

---

## 3. Cloudinary

1. Create a free account at cloudinary.com.
2. Dashboard → copy **Cloud Name**, **API Key**, **API Secret**. These become `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` in Render (§5). The backend (`server/src/config/cloudinary.js`) is already wired to these exact variable names — nothing to change in code.
3. No further setup needed yet — the Media Library admin module (which will actually upload files) hasn't been built. When it is, uploads go server-side through `server/src/services/cloudinary.service.js`, never exposing the API secret to the browser.

---

## 4. Sentry (error tracking) — optional but recommended

1. Create a free account at sentry.io.
2. Create two projects: one **Node.js/Express** (for the backend), one **React** (for the frontend). Each gives you a DSN (a URL, not a secret in the traditional sense — safe to expose client-side).
3. Backend DSN → `SENTRY_DSN` in Render (§5).
4. Frontend DSN → `VITE_SENTRY_DSN` in Vercel (§6).
5. Leave both blank if you'd rather not use Sentry yet — every integration point in this codebase checks for the DSN and silently no-ops without one (same pattern as Redis caching). Nothing breaks either way.

---

## 5. Deploy the backend to Render

1. render.com → New → **Blueprint** → connect your GitHub repo. Render reads `render.yaml` at the repo root automatically and proposes the `zerivon-api` web service defined there (Node runtime, `server/` as root directory, health check at `/api/health`, Singapore region, starter plan).
2. Render will prompt you for every environment variable marked `sync: false` in `render.yaml` during this initial creation flow. Fill in:

   | Variable | Value |
   |---|---|
   | `CLIENT_URL` | Your Vercel domain once you know it, e.g. `https://www.zerivon.in` — you can update this after step 6 if you don't have it yet |
   | `MONGODB_URI` | From §2 step 6 |
   | `JWT_ACCESS_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
   | `JWT_REFRESH_SECRET` | Generate the same way — **must be a different value** from the access secret |
   | `COOKIE_SECRET` | Generate the same way again — a third distinct value |
   | `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From §3 |
   | `REDIS_URL` | Leave blank unless you've also provisioned Redis (Render has a managed Redis add-on, or use Upstash's free tier) — the app runs correctly either way |
   | `SITE_URL` | Your production domain, e.g. `https://www.zerivon.in` |
   | `SENTRY_DSN` | From §4, or leave blank |

   Render only prompts for `sync: false` variables during **initial** Blueprint creation — if you need to add or change one later, do it manually in the service's Environment tab.

3. Click deploy. Render runs `npm ci` then `npm start` inside `server/`, and polls `/api/health` until it responds — this is the exact health check I already verified boots correctly against a real MongoDB in this session.
4. Once live, copy the service URL Render gives you (`https://zerivon-api-xxxx.onrender.com` or similar) — you need it for step 6.

**Cold starts on the free tier**: Render's free web services spin down after 15 minutes of inactivity and take ~30-50s to wake on the next request. The `starter` plan in `render.yaml` avoids this (always-on) — if you start on the free tier to save cost, expect that latency on the first request after idle, and consider an uptime monitor (§11) that also happens to keep it warm.

---

## 6. Deploy the frontend to Vercel

1. **First**, edit `client/vercel.json` and replace all three occurrences of `REPLACE-WITH-YOUR-RENDER-URL.onrender.com` with the actual Render URL from §5 step 4. Commit and push this change.
2. vercel.com → New Project → import your GitHub repo.
3. Set the **Root Directory** to `client` (this is a monorepo — Vercel needs to know the frontend lives in a subfolder). Framework preset should auto-detect as Vite; `vercel.json` (inside `client/`) supplies the explicit build command, output directory, rewrites, and headers regardless.
4. Environment variables (Vercel dashboard → Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `VITE_API_BASE_URL` | `/api` — a relative path, not the Render URL. The browser calls same-origin `/api/...`, and the rewrite in `vercel.json` proxies it to Render server-side. This is the whole point of the proxy architecture (§0). |
   | `VITE_ENABLE_MOCKS` | `false` — production must hit the real API, not the MSW mock layer |
   | `VITE_SITE_URL` | Your production domain, e.g. `https://www.zerivon.in` |
   | `VITE_SENTRY_DSN` | From §4, or leave blank |

5. Deploy. Vercel builds with `npm run build` inside `client/` and serves `dist/`.
6. Go back to Render (§5) and update `CLIENT_URL` to this Vercel domain if you hadn't already — this is what the backend's CORS middleware (`server/src/config/cors.config.js`) allows. In the proxy architecture this mostly matters for any direct (non-proxied) API access, not the main traffic path, but keep it correct regardless.

---

## 7. Custom domain, DNS, and SSL

Both Vercel and Render provision free automatic SSL (Let's Encrypt) the moment a custom domain is verified — there's no separate "SSL setup" step beyond pointing DNS correctly.

**Recommended setup** (frontend at the apex/www, backend stays on its Render subdomain and is never visited directly by users thanks to the proxy):

1. At your domain registrar, add:
   - `A` record: `@` → Vercel's IP (Vercel shows you the exact value when you add the domain in their dashboard — it's `76.76.21.21` as of writing, but always use what Vercel's UI shows you, this can change)
   - `CNAME` record: `www` → `cname.vercel-dns.com`
2. In Vercel → Project → Settings → Domains, add both `zerivon.in` and `www.zerivon.in`, and set one as the primary (Vercel auto-redirects the other to it).
3. Update `SITE_URL` (Render) and `VITE_SITE_URL` (Vercel) to match the final canonical domain exactly — these feed the sitemap, canonical URLs, and Open Graph tags.
4. You do **not** need a DNS record for the Render backend's own domain (e.g. `api.zerivon.in`) under this architecture — the proxy means end users never address it directly. If you later want it addressable anyway (e.g. for direct API access from a mobile app), add a `CNAME` for a subdomain pointing at the Render-provided hostname and enable it in Render's dashboard.
5. DNS propagation can take a few minutes to 48 hours depending on your registrar and previous TTL settings. Both platforms show a clear "verified" state once it's live.

---

## 8. GitHub Actions CI — already built, just gate it

`.github/workflows/ci.yml` runs on every push/PR to `main`: lints and builds the client, and lints + boots the server against a real MongoDB service container (verified working in this session — the exact same steps were run locally against a live database before this file was finalized).

To make this an actual gate (not just an FYI check):

1. GitHub repo → Settings → Branches → Add branch protection rule for `main`.
2. Require status checks to pass before merging → select both `Client — lint & build` and `Server — lint & boot smoke test`.
3. Now a PR can't merge into `main` with a broken build, and since both Vercel and Render deploy from `main`, this is what makes the pipeline test-gated end to end: PR → CI must pass → merge → Vercel/Render auto-deploy from `main`.

**Why not have GitHub Actions do the deploying too?** Both Vercel and Render's native GitHub integrations already do this better than a hand-rolled Actions deploy step would: automatic preview deployments per PR (Vercel), automatic rollback on failed health checks (Render), no deploy credentials to manage as GitHub Secrets. Driving deploys from Actions instead is a reasonable choice for teams wanting deploy-only-after-a-separate-approval-step, but it's added complexity this project doesn't need yet — the branch-protection approach above achieves "tests must pass before deploy" with less to maintain.

---

## 9. Post-deploy verification checklist

Run through this after the first real deploy — it mirrors the checks already verified locally in this session, now against the real URLs:

- [ ] `https://<your-render-url>/api/health` returns `{"success":true,...,"data":{"db":"connected",...}}`
- [ ] `https://www.zerivon.in/sitemap.xml` returns valid XML (via the Vercel proxy)
- [ ] `https://www.zerivon.in/robots.txt` returns the expected content (via the Vercel proxy)
- [ ] `https://www.zerivon.in/` loads with no console errors
- [ ] SSL padlock present on both the Vercel domain and the Render URL
- [ ] Security headers present — check via `curl -I https://www.zerivon.in/` and confirm `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options` are all there
- [ ] A deliberate 500 (or `Sentry.captureException` test call) shows up in the Sentry dashboard within a minute, if configured
- [ ] MongoDB Atlas → Metrics shows an active connection from Render
- [ ] Cloudinary dashboard shows the account is reachable (nothing to upload yet, but confirm credentials aren't rejected — check Render's startup logs for any Cloudinary auth error)

---

## 10. Monitoring & uptime

Not wired up in this pass — these are third-party accounts, same constraint as everything else in this guide. Recommended, in order of effort:

1. **Uptime monitoring** (5 minutes): a free account at UptimeRobot or Better Uptime, monitoring `https://<render-url>/api/health` every 5 minutes. This doubles as a Render free-tier keep-warm ping if you didn't upgrade to `starter` (§5).
2. **Error tracking dashboards**: already wired if you filled in the Sentry DSNs (§4) — check Sentry's own alerting rules (Settings → Alerts) to get notified rather than having to check the dashboard manually.
3. **MongoDB Atlas alerts**: Atlas → Alerts — enable the built-in "connections near limit" and "disk usage" alerts on the free tier at minimum.

---

## 11. Ongoing maintenance

- Re-run `npm audit` on both apps before each deploy of significance (the CI workflow doesn't currently fail the build on audit findings — this is a deliberate choice, since a new advisory shouldn't block an unrelated hotfix, but check manually).
- Rotate `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` / `COOKIE_SECRET` if ever suspected compromised — this invalidates all active sessions, which is the correct trade-off in that scenario.
- MongoDB Atlas M0 → M10 upgrade path: purely a dashboard action when you're ready for automated backups, no code or connection-string changes needed.
- Revisit the `vercel.json` CSP (`style-src 'self' 'unsafe-inline'`) if a future dependency lets you eliminate inline styles entirely — currently required because Framer Motion and Recharts both set real `style="..."` attributes at runtime, not just CSS classes.

---

## 12. Standing Requirements (per project instructions)

- Latest stable versions used throughout this pass (Sentry SDKs 10.69.0, ESLint 10.8.0 + current plugin versions) — verified against live sources where prior assumptions would have been wrong: Render's Blueprint spec (`autoDeployTrigger` replaced `autoDeploy`; `PORT` is auto-injected, not declared), and a genuine `kareem`/`react-is`-class latent dependency bug caught before it could break a deploy.
- No placeholder code — every config file here is the real, complete file that ships; the one deliberate placeholder (`REPLACE-WITH-YOUR-RENDER-URL` in `vercel.json`) is intentionally impossible to deploy successfully without editing, by design, rather than a plausible-looking fake URL someone might miss.
- This guide's sequencing (backend before frontend, `vercel.json` edited with the real Render URL before the Vercel deploy) reflects a genuine dependency, not arbitrary ordering.
