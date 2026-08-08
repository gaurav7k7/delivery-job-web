import { motion } from 'framer-motion';
import { Wrench } from 'lucide-react';
import { usePublicContent } from '../api/publicContent.api';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { staggerContainer, fadeUp } from '../lib/motionVariants';

export default function Services() {
  const { data: services, isLoading } = usePublicContent('services');
  const reveal = useScrollReveal();

  return (
    <>
      <Seo title="Services" description="End-to-end rider onboarding services across every major delivery platform." />
      <Container className="flex flex-col gap-12 py-16">
        <motion.div {...reveal} className="flex flex-col gap-3 text-center">
          <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">What We Do</span>
          <h1 className="font-heading text-h1 text-neutral-900">Our Services</h1>
          <p className="mx-auto max-w-2xl text-body-lg text-neutral-600">
            From document verification to app activation, we handle every step of rider onboarding.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : !services || services.length === 0 ? (
          <EmptyState icon={Wrench} title="No services listed yet" headingLevel={2} />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer(0.08)}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service) => (
              <motion.div key={service._id} variants={fadeUp}>
                <a href={`/services/${service.slug}`} className="block h-full">
                  <Card className="flex h-full flex-col gap-3 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                      <DynamicIcon name={service.icon} size={22} />
                    </div>
                    <h2 className="font-heading text-h4 text-neutral-900">{service.title}</h2>
                    <p className="text-body-sm text-neutral-600">{service.shortDescription}</p>
                  </Card>
                </a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </>
  );
}
