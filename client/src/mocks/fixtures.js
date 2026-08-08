// Fixture data mirrors the exact shape the real Phase 2/5 API returns, so
// swapping VITE_ENABLE_MOCKS to false and pointing VITE_API_BASE_URL at a
// live backend requires no frontend code changes. Content preserved from
// the original zerivon.in site.

export const siteSettings = {
  siteName: 'Zerivon',
  tagline: "India's Fastest Riders Onboarding Agency",
  logo: { url: '/logo.svg', alt: 'Zerivon' },
  favicon: { url: '/favicon.svg', alt: 'Zerivon' },
  themeColors: {
    primary: '#4F46E5',
    accent: '#F97316',
    background: '#FAFAF9',
    text: '#1C1E29',
  },
  contact: {
    phones: ['+91 9875419099'],
    whatsapp: '+919875419099',
    email: '',
    addressLine: 'Kolkata, West Bengal, India',
  },
  businessHours: 'Open 7 days a week',
};

export const navigation = {
  primary_header: {
    name: 'primary_header',
    location: 'header',
    items: [
      { _id: 'nav-1', label: 'Home', url: '/', order: 0 },
      { _id: 'nav-2', label: 'About', url: '/about', order: 1 },
      { _id: 'nav-3', label: 'Services', url: '/services', order: 2 },
      { _id: 'nav-4', label: 'How It Works', url: '/how-it-works', order: 3 },
      { _id: 'nav-5', label: 'Platforms', url: '/platforms', order: 4 },
      { _id: 'nav-6', label: 'Benefits', url: '/benefits', order: 5 },
      { _id: 'nav-7', label: 'Blog', url: '/blog', order: 6 },
      { _id: 'nav-8', label: 'FAQ', url: '/faq', order: 7 },
      { _id: 'nav-9', label: 'Contact', url: '/contact', order: 8 },
    ],
  },
};

export const footerConfig = {
  columns: [
    {
      title: 'Company',
      order: 0,
      links: [
        { label: 'About Us', url: '/about', order: 0 },
        { label: 'Blog', url: '/blog', order: 1 },
        { label: 'Careers', url: '/careers', order: 2 },
        { label: 'Contact', url: '/contact', order: 3 },
      ],
    },
    {
      title: 'Quick Links',
      order: 1,
      links: [
        { label: 'How It Works', url: '/how-it-works', order: 0 },
        { label: 'Benefits', url: '/benefits', order: 1 },
        { label: 'Success Stories', url: '/success-stories', order: 2 },
        { label: 'FAQ', url: '/faq', order: 3 },
      ],
    },
    {
      title: 'Platforms',
      order: 2,
      links: [
        { label: 'Uber', url: '/platforms/uber', order: 0 },
        { label: 'Swiggy', url: '/platforms/swiggy', order: 1 },
        { label: 'Zomato', url: '/platforms/zomato', order: 2 },
        { label: 'Blinkit', url: '/platforms/blinkit', order: 3 },
        { label: 'Zepto', url: '/platforms/zepto', order: 4 },
        { label: 'Vahan', url: '/platforms/vahan', order: 5 },
      ],
    },
  ],
  bottomText: '© 2026 Zerivon. All rights reserved.',
  disclaimerText:
    'Zerivon is not officially affiliated with Uber, Swiggy, Zomato, Blinkit, Zepto or Vahan. No registration fee. 100% legitimate.',
  newsletterEnabled: true,
};

export const socialLinks = [];
