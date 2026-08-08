import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminRoute } from './AdminRoute';
import { PageLoader } from '../components/ui/PageLoader';
import { adminNav } from '../components/admin/adminNav.config';

const Home = lazy(() => import('../pages/Home'));
const NotFound = lazy(() => import('../pages/NotFound'));
const PublicServices = lazy(() => import('../pages/Services'));
const PublicServiceDetail = lazy(() => import('../pages/ServiceDetail'));
const PublicBlog = lazy(() => import('../pages/Blog'));
const PublicBlogPost = lazy(() => import('../pages/BlogPost'));
const PublicCareers = lazy(() => import('../pages/Careers'));
const PublicCareerDetail = lazy(() => import('../pages/CareerDetail'));
const PublicAbout = lazy(() => import('../pages/About'));
const PublicApply = lazy(() => import('../pages/Apply'));
const PublicContact = lazy(() => import('../pages/Contact'));

const AdminLogin = lazy(() => import('../pages/admin/Login'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminProfile = lazy(() => import('../pages/admin/Profile'));
const AdminChangePassword = lazy(() => import('../pages/admin/ChangePassword'));
const ModulePlaceholder = lazy(() => import('../pages/admin/ModulePlaceholder'));

const HomepageSections = lazy(() => import('../pages/admin/content/HomepageSections'));
const HeroBanners = lazy(() => import('../pages/admin/content/HeroBanners'));
const Services = lazy(() => import('../pages/admin/content/Services'));
const Industries = lazy(() => import('../pages/admin/content/Industries'));
const Statistics = lazy(() => import('../pages/admin/content/Statistics'));
const Benefits = lazy(() => import('../pages/admin/content/Benefits'));
const ProcessSteps = lazy(() => import('../pages/admin/content/ProcessSteps'));
const Testimonials = lazy(() => import('../pages/admin/content/Testimonials'));
const Clients = lazy(() => import('../pages/admin/content/Clients'));
const FAQ = lazy(() => import('../pages/admin/content/FAQ'));
const Posts = lazy(() => import('../pages/admin/blog/Posts'));
const Jobs = lazy(() => import('../pages/admin/careers/Jobs'));
const JobApplications = lazy(() => import('../pages/admin/careers/JobApplications'));
const RiderApplications = lazy(() => import('../pages/admin/careers/RiderApplications'));
const Portfolio = lazy(() => import('../pages/admin/content/Portfolio'));
const Team = lazy(() => import('../pages/admin/content/Team'));
const MediaLibrary = lazy(() => import('../pages/admin/MediaLibrary'));
const Messages = lazy(() => import('../pages/admin/engagement/Messages'));
const Newsletter = lazy(() => import('../pages/admin/engagement/Newsletter'));
const SiteSettings = lazy(() => import('../pages/admin/site/Settings'));
const SiteNavigation = lazy(() => import('../pages/admin/site/Navigation'));
const SiteFooter = lazy(() => import('../pages/admin/site/Footer'));
const SiteSocialMedia = lazy(() => import('../pages/admin/site/SocialMedia'));
const SiteSEO = lazy(() => import('../pages/admin/site/SEO'));
const Users = lazy(() => import('../pages/admin/access/Users'));
const Roles = lazy(() => import('../pages/admin/access/Roles'));
const Permissions = lazy(() => import('../pages/admin/access/Permissions'));
const ActivityLogs = lazy(() => import('../pages/admin/access/ActivityLogs'));

// Real pages, keyed by their nav path (relative to /admin) — anything not
// listed here still falls through to ModulePlaceholder below, so the full
// Phase 3 IA stays navigable while pages are built out module by module.
const builtPages = {
  '/admin/content/homepage-sections': HomepageSections,
  '/admin/content/hero-banners': HeroBanners,
  '/admin/content/services': Services,
  '/admin/content/industries': Industries,
  '/admin/content/statistics': Statistics,
  '/admin/content/benefits': Benefits,
  '/admin/content/process-steps': ProcessSteps,
  '/admin/content/testimonials': Testimonials,
  '/admin/content/clients': Clients,
  '/admin/content/faq': FAQ,
  '/admin/content/portfolio': Portfolio,
  '/admin/content/team': Team,
  '/admin/blog/posts': Posts,
  '/admin/careers/jobs': Jobs,
  '/admin/careers/applications': JobApplications,
  '/admin/careers/rider-applications': RiderApplications,
  '/admin/media': MediaLibrary,
  '/admin/engagement/messages': Messages,
  '/admin/engagement/newsletter': Newsletter,
  '/admin/site/settings': SiteSettings,
  '/admin/site/navigation': SiteNavigation,
  '/admin/site/footer': SiteFooter,
  '/admin/site/social-media': SiteSocialMedia,
  '/admin/site/seo': SiteSEO,
  '/admin/access/users': Users,
  '/admin/access/roles': Roles,
  '/admin/access/permissions': Permissions,
  '/admin/access/activity-logs': ActivityLogs,
};

const placeholderPaths = adminNav
  .flatMap((item) => (item.children ? item.children.map((child) => child.to) : [item.to]))
  .filter((path) => path !== '/admin' && !builtPages[path]);

function withSuspense(element) {
  return <Suspense fallback={<PageLoader />}>{element}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={withSuspense(<Home />)} />
        <Route path="/services" element={withSuspense(<PublicServices />)} />
        <Route path="/services/:slug" element={withSuspense(<PublicServiceDetail />)} />
        <Route path="/blog" element={withSuspense(<PublicBlog />)} />
        <Route path="/blog/:slug" element={withSuspense(<PublicBlogPost />)} />
        <Route path="/careers" element={withSuspense(<PublicCareers />)} />
        <Route path="/careers/:slug" element={withSuspense(<PublicCareerDetail />)} />
        <Route path="/about" element={withSuspense(<PublicAbout />)} />
        <Route path="/apply" element={withSuspense(<PublicApply />)} />
        <Route path="/contact" element={withSuspense(<PublicContact />)} />
        {/* Catches everything not otherwise matched, public or unknown /admin/*
            paths that also miss the nested admin catch-all below (e.g. because
            the visitor isn't authenticated, so AdminRoute never even reaches
            it) — without this, an unknown URL rendered a blank page. */}
        <Route path="*" element={withSuspense(<NotFound />)} />
      </Route>

      <Route path="/admin/login" element={withSuspense(<AdminLogin />)} />

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={withSuspense(<AdminDashboard />)} />
          <Route path="profile" element={withSuspense(<AdminProfile />)} />
          <Route path="change-password" element={withSuspense(<AdminChangePassword />)} />
          {Object.entries(builtPages).map(([path, Component]) => (
            <Route key={path} path={path.replace('/admin/', '')} element={withSuspense(<Component />)} />
          ))}
          {placeholderPaths.map((path) => (
            <Route key={path} path={path.replace('/admin/', '')} element={withSuspense(<ModulePlaceholder />)} />
          ))}
          {/* Unknown path under an authenticated /admin/* — stays inside the
              admin shell (sidebar/topbar) instead of falling through to the
              public "*" route above, which would show public Header/Footer
              chrome for an admin URL. */}
          <Route path="*" element={withSuspense(<ModulePlaceholder />)} />
        </Route>
      </Route>
    </Routes>
  );
}
