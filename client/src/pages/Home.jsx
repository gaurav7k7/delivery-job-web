import { lazy, Suspense } from 'react';
import { Seo } from '../components/ui/Seo';
import { Skeleton } from '../components/ui/Skeleton';
import { useHomepage } from '../api/homepage.api';
import { HeroSection } from '../components/home/HeroSection';

// Hero stays eager (it's the LCP element, above the fold on every load).
// Everything else is below the fold, so it's lazy-loaded per section instead
// of bundled into one ~650KB Home chunk.
const StatisticsSection = lazy(() => import('../components/home/StatisticsSection').then((m) => ({ default: m.StatisticsSection })));
const ServicesSection = lazy(() => import('../components/home/ServicesSection').then((m) => ({ default: m.ServicesSection })));
const IndustriesSection = lazy(() => import('../components/home/IndustriesSection').then((m) => ({ default: m.IndustriesSection })));
const BenefitsSection = lazy(() => import('../components/home/BenefitsSection').then((m) => ({ default: m.BenefitsSection })));
const ProcessSection = lazy(() => import('../components/home/ProcessSection').then((m) => ({ default: m.ProcessSection })));
const PlatformsSection = lazy(() => import('../components/home/PlatformsSection').then((m) => ({ default: m.PlatformsSection })));
const TestimonialsSection = lazy(() => import('../components/home/TestimonialsSection').then((m) => ({ default: m.TestimonialsSection })));
const ClientsSection = lazy(() => import('../components/home/ClientsSection').then((m) => ({ default: m.ClientsSection })));
const AwardsSection = lazy(() => import('../components/home/AwardsSection').then((m) => ({ default: m.AwardsSection })));
const FAQSection = lazy(() => import('../components/home/FAQSection').then((m) => ({ default: m.FAQSection })));
const BlogSection = lazy(() => import('../components/home/BlogSection').then((m) => ({ default: m.BlogSection })));
const CTASection = lazy(() => import('../components/home/CTASection').then((m) => ({ default: m.CTASection })));
const RiderApplySection = lazy(() => import('../components/home/RiderApplySection').then((m) => ({ default: m.RiderApplySection })));
const ContactSection = lazy(() => import('../components/home/ContactSection').then((m) => ({ default: m.ContactSection })));

function SectionFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-64 w-full rounded-lg" />
    </div>
  );
}

function withFallback(Component) {
  return function Wrapped() {
    return (
      <Suspense fallback={<SectionFallback />}>
        <Component />
      </Suspense>
    );
  };
}

function CareerCTA() {
  return (
    <CTASection
      eyebrow="Careers"
      title="Join the team building India's rider economy"
      description="We're hiring across operations, growth, and support — help riders earn more, faster."
      primaryLabel="View open roles"
      primaryTo="/careers"
    />
  );
}

// Keys mirror server/src/controllers/homepage.controller.js's
// DEFAULT_SECTIONS — an admin-toggled section with no mapped component here
// (e.g. "case-studies", "achievements", not yet built) simply renders
// nothing rather than breaking the page.
const SECTION_COMPONENTS = {
  hero: HeroSection,
  statistics: withFallback(StatisticsSection),
  services: withFallback(ServicesSection),
  industries: withFallback(IndustriesSection),
  'why-choose-us': withFallback(BenefitsSection),
  process: withFallback(ProcessSection),
  'technology-stack': withFallback(PlatformsSection),
  testimonials: withFallback(TestimonialsSection),
  clients: withFallback(ClientsSection),
  awards: withFallback(AwardsSection),
  faq: withFallback(FAQSection),
  'latest-blogs': withFallback(BlogSection),
  career: withFallback(CareerCTA),
  cta: withFallback(RiderApplySection),
  contact: withFallback(ContactSection),
};

const DEFAULT_ORDER = [
  'hero',
  'statistics',
  'services',
  'industries',
  'why-choose-us',
  'process',
  'technology-stack',
  'testimonials',
  'clients',
  'awards',
  'faq',
  'latest-blogs',
  'career',
  'cta',
  'contact',
];

export default function Home() {
  const { data: homepage } = useHomepage();

  const sections = homepage?.sections
    ? [...homepage.sections].filter((s) => s.isVisible).sort((a, b) => a.order - b.order)
    : DEFAULT_ORDER.map((key, order) => ({ key, order, isVisible: true }));

  return (
    <>
      <Seo />
      {sections.map((section) => {
        const Component = SECTION_COMPONENTS[section.key];
        return Component ? <Component key={section.key} /> : null;
      })}
    </>
  );
}
