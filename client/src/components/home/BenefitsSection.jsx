import { motion } from 'framer-motion';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { DynamicIcon } from '../ui/DynamicIcon';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function BenefitsSection() {
  const { data: benefits, isLoading } = usePublicContent('benefits');

  if (!isLoading && (!benefits || benefits.length === 0)) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Why Choose Us" title="Riders trust us. Platforms trust us." />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.08)}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-lg" />)
            : benefits.map((benefit) => (
                <motion.div key={benefit._id} variants={fadeUp}>
                  <Card className="flex h-full flex-col gap-3 p-6">
                    <DynamicIcon name={benefit.icon} size={24} className="text-accent-700" />
                    <h3 className="font-heading text-h4 text-neutral-900">{benefit.title}</h3>
                    <p className="text-body-sm text-neutral-600">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
