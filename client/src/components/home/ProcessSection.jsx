import { motion } from 'framer-motion';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Skeleton } from '../ui/Skeleton';
import { DynamicIcon } from '../ui/DynamicIcon';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function ProcessSection() {
  const { data: steps, isLoading } = usePublicContent('process-steps', '/public/how-it-works');

  if (!isLoading && (!steps || steps.length === 0)) return null;

  return (
    <section className="bg-neutral-100/50 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="How It Works" title="From sign-up to your first ride in days" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.1)}
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-lg" />)
            : [...steps]
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((step) => (
                  <motion.div key={step._id} variants={fadeUp} className="flex flex-col items-start gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-500 text-h4 font-bold text-[var(--color-on-primary)]">
                      {step.stepNumber}
                    </span>
                    {step.icon && <DynamicIcon name={step.icon} size={20} className="text-primary-500" />}
                    <h3 className="font-heading text-h4 text-neutral-900">{step.title}</h3>
                    <p className="text-body-sm text-neutral-600">{step.description}</p>
                  </motion.div>
                ))}
        </motion.div>
      </Container>
    </section>
  );
}
