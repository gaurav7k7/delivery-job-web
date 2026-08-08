// Admin-side mock fixtures. The mock login accepts a single fixed credential
// pair — this is a UI-development convenience only. Real session validation
// (httpOnly secure cookies, JWT verify, bcrypt compare) is a backend concern
// implemented in Phase 5's Auth module; nothing here should be read as a
// security implementation.
export const MOCK_CREDENTIALS = {
  email: 'admin@zerivon.in',
  password: 'Admin@123',
};

export const mockRole = {
  _id: 'role-super-admin',
  name: 'Super Admin',
  slug: 'super_admin',
  isSystem: true,
  permissions: ['*'],
};

export const mockUser = {
  _id: 'user-1',
  name: 'Aditi Sharma',
  email: MOCK_CREDENTIALS.email,
  avatar: null,
  role: mockRole,
  isEmailVerified: true,
  lastLoginAt: new Date().toISOString(),
};

export const dashboardStats = {
  riderApplications: { new: 18, contacted: 42, onboarded: 236, rejected: 11 },
  unreadMessages: 6,
  pendingTestimonials: 4,
  publishedBlogCount: 14,
  openJobApplications: 9,
  weeklyApplications: [
    { day: 'Mon', applications: 14 },
    { day: 'Tue', applications: 22 },
    { day: 'Wed', applications: 18 },
    { day: 'Thu', applications: 27 },
    { day: 'Fri', applications: 31 },
    { day: 'Sat', applications: 24 },
    { day: 'Sun', applications: 16 },
  ],
  platformBreakdown: [
    { platform: 'Swiggy', count: 68 },
    { platform: 'Zomato', count: 54 },
    { platform: 'Blinkit', count: 41 },
    { platform: 'Uber', count: 33 },
    { platform: 'Zepto', count: 25 },
    { platform: 'Vahan', count: 15 },
  ],
};

export const activityLog = [
  { _id: 'log-1', user: { name: 'Aditi Sharma' }, action: 'approve', module: 'testimonials', createdAt: minutesAgo(12) },
  { _id: 'log-2', user: { name: 'Rohan Das' }, action: 'update', module: 'services', createdAt: minutesAgo(48) },
  { _id: 'log-3', user: { name: 'Aditi Sharma' }, action: 'publish', module: 'blog', createdAt: minutesAgo(95) },
  { _id: 'log-4', user: { name: 'System' }, action: 'create', module: 'rider-applications', createdAt: minutesAgo(140) },
  { _id: 'log-5', user: { name: 'Rohan Das' }, action: 'reject', module: 'job-applications', createdAt: minutesAgo(210) },
  { _id: 'log-6', user: { name: 'Aditi Sharma' }, action: 'login', module: 'auth', createdAt: minutesAgo(400) },
  { _id: 'log-7', user: { name: 'Aditi Sharma' }, action: 'delete', module: 'faq', createdAt: minutesAgo(520) },
  { _id: 'log-8', user: { name: 'Rohan Das' }, action: 'update', module: 'settings', createdAt: minutesAgo(700) },
];

export const notifications = [
  {
    _id: 'notif-1',
    title: 'New rider application',
    message: 'Priya Verma applied from Kolkata (Swiggy, Zomato).',
    isRead: false,
    createdAt: minutesAgo(9),
    link: '/admin/careers/applications',
  },
  {
    _id: 'notif-2',
    title: 'New contact message',
    message: 'Suresh Kumar asked about the Garia branch timings.',
    isRead: false,
    createdAt: minutesAgo(37),
    link: '/admin/engagement/messages',
  },
  {
    _id: 'notif-3',
    title: 'Testimonial awaiting approval',
    message: 'A new testimonial from Chennai needs review before it goes live.',
    isRead: false,
    createdAt: minutesAgo(66),
    link: '/admin/content/testimonials',
  },
  {
    _id: 'notif-4',
    title: 'Job application received',
    message: 'A candidate applied for the Operations Executive role.',
    isRead: true,
    createdAt: minutesAgo(180),
    link: '/admin/careers/applications',
  },
  {
    _id: 'notif-5',
    title: 'Blog post published',
    message: '"5 Tips to Activate Faster on Swiggy" is now live.',
    isRead: true,
    createdAt: minutesAgo(300),
    link: '/admin/blog/posts',
  },
];

function minutesAgo(mins) {
  return new Date(Date.now() - mins * 60 * 1000).toISOString();
}
