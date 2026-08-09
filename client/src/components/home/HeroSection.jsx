import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { useSiteSettings } from '../../api/settings.api';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/OptimizedImage';
import { Skeleton } from '../ui/Skeleton';
import { useScrollReveal } from '../../hooks/useScrollReveal';

// `Button`'s `to` prop renders a React Router <Link>, which does not trigger
// the browser's native scroll-to-element for hash-only targets on a
// client-side route change — only a real <a href> does. `banner.ctaPrimary`
// is admin-entered and may be either a real route or an in-page anchor
// (e.g. "#apply"), so the prop has to be picked based on which it is.
function ctaProps(url) {
  return url.startsWith('#') ? { href: url } : { to: url };
}

export function HeroSection() {
  // Hero content is managed in the admin panel, so fetch fresh data each time
  // the visitor returns to Home instead of retaining an older banner for five
  // minutes in the React Query cache.
  const { data: banners, isLoading } = usePublicContent('hero-banners', '/page/home', {
    staleTime: 0,
    refetchOnMount: 'always',
  });
  const { data: settings } = useSiteSettings();
  const reveal = useScrollReveal();

  const banner = banners?.[0];

  if (isLoading) {
    return (
      <Container className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="mt-4 h-12 w-40" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </Container>
    );
  }

  const title = banner?.title ?? `${settings?.siteName ?? 'Zerivon'} — Onboard Riders in Record Time`;
  const description =
    banner?.description ??
    settings?.tagline ??
    'We onboard riders onto Uber, Swiggy, Zomato, Blinkit, Zepto and Vahan in as little as 48 hours, with weekly payouts and free training.';

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_-10%,var(--color-primary-500)/12,transparent_55%)]" />
      <Container className="grid gap-10 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <motion.div {...reveal} className="flex flex-col gap-6">
          {banner?.subtitle && (
            <span className="w-fit rounded-full bg-primary-500/10 px-4 py-1.5 text-caption font-semibold uppercase tracking-wide text-primary-700">
              {banner.subtitle}
            </span>
          )}
          <h1 className="font-heading text-display text-neutral-900">{title}</h1>
          <p className="max-w-xl text-body-lg text-neutral-600">{description}</p>
          <div className="flex flex-wrap gap-4">
            <Button {...ctaProps(banner?.ctaPrimary?.url || '#apply')} size="lg">
              {banner?.ctaPrimary?.label || 'Become a Rider'}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button {...ctaProps(banner?.ctaSecondary?.url || '#contact')} variant="secondary" size="lg">
              {banner?.ctaSecondary?.label || 'Talk to Us'}
            </Button>
          </div>
        </motion.div>

        {banner?.image?.url ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-xl shadow-[var(--shadow-elevation-3)]"
          >
            <OptimizedImage src={banner.image.url} alt={banner.image.alt || title} width={720} height={540} priority className="h-full w-full" />
          </motion.div>
        ) : (
          <div className="hidden aspect-4/3 rounded-xl bg-gradient-to-br from-primary-500/15 to-accent-500/15 lg:block" />
        )}
      </Container>
    </section>
  );
}
