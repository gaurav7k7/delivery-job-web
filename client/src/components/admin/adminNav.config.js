import {
  LayoutDashboard,
  LayoutGrid,
  Newspaper,
  Briefcase,
  MessageSquare,
  Image,
  Settings2,
  BarChart3,
  ShieldCheck,
} from 'lucide-react';

// Mirrors the Phase 3 admin information architecture (§4) exactly. Routes
// that don't have a real page yet render <ModulePlaceholder /> so the full
// IA is visible and navigable from day one instead of growing item by item.
export const adminNav = [
  { label: 'Dashboard', to: '/admin', icon: LayoutDashboard, end: true },
  {
    label: 'Content',
    icon: LayoutGrid,
    children: [
      { label: 'Hero Banners', to: '/admin/content/hero-banners' },
      { label: 'Homepage Sections', to: '/admin/content/homepage-sections' },
      { label: 'Services', to: '/admin/content/services' },
      { label: 'Industries', to: '/admin/content/industries' },
      { label: 'Statistics', to: '/admin/content/statistics' },
      { label: 'Benefits', to: '/admin/content/benefits' },
      { label: 'Process Steps', to: '/admin/content/process-steps' },
      { label: 'Portfolio', to: '/admin/content/portfolio' },
      { label: 'Clients', to: '/admin/content/clients' },
      { label: 'Testimonials', to: '/admin/content/testimonials' },
      { label: 'Team', to: '/admin/content/team' },
      { label: 'FAQ', to: '/admin/content/faq' },
      { label: 'Awards', to: '/admin/content/awards' },
      { label: 'Certificates', to: '/admin/content/certificates' },
      { label: 'Offices', to: '/admin/content/offices' },
    ],
  },
  {
    label: 'Blog',
    icon: Newspaper,
    children: [{ label: 'Posts', to: '/admin/blog/posts' }],
  },
  {
    label: 'Careers',
    icon: Briefcase,
    children: [
      { label: 'Jobs', to: '/admin/careers/jobs' },
      { label: 'Job Applications', to: '/admin/careers/applications' },
      { label: 'Rider Applications', to: '/admin/careers/rider-applications' },
    ],
  },
  {
    label: 'Engagement',
    icon: MessageSquare,
    children: [
      { label: 'Messages', to: '/admin/engagement/messages' },
      { label: 'Newsletter', to: '/admin/engagement/newsletter' },
    ],
  },
  { label: 'Media Library', to: '/admin/media', icon: Image },
  {
    label: 'Site Configuration',
    icon: Settings2,
    children: [
      { label: 'Settings', to: '/admin/site/settings' },
      { label: 'Navigation', to: '/admin/site/navigation' },
      { label: 'Footer', to: '/admin/site/footer' },
      { label: 'Social Media', to: '/admin/site/social-media' },
      { label: 'SEO', to: '/admin/site/seo' },
    ],
  },
  { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
  {
    label: 'Access Control',
    icon: ShieldCheck,
    children: [
      { label: 'Users', to: '/admin/access/users' },
      { label: 'Roles', to: '/admin/access/roles' },
      { label: 'Permissions', to: '/admin/access/permissions' },
      { label: 'Activity Logs', to: '/admin/access/activity-logs' },
    ],
  },
];
