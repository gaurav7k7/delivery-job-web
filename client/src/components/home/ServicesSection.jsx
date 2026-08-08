import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Skeleton } from '../ui/Skeleton';
import { DynamicIcon } from '../ui/DynamicIcon';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function ServicesSection() {
  const { data: services, isLoading } = usePublicContent('services');

  if (!isLoading && (!services || services.length === 0)) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="What We Do"
          title="End-to-end rider onboarding services"
          description="From document verification to app activation, we handle every step so riders can start earning faster."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.08)}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-lg" />)
            : services.map((service) => (
                <motion.div key={service._id} variants={fadeUp}>
                  <Card className="flex h-full flex-col gap-3 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
                      <DynamicIcon name={service.icon} size={22} />
                    </div>
                    <h3 className="font-heading text-h4 text-neutral-900">{service.title}</h3>
                    <p className="text-body-sm text-neutral-600">{service.shortDescription}</p>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

        <Button to="/services" variant="secondary" className="mx-auto">
          View all services
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </Container>
    </section>
  );
}
