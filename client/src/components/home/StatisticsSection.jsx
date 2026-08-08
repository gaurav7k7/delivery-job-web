import { motion } from 'framer-motion';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { DynamicIcon } from '../ui/DynamicIcon';
import { Skeleton } from '../ui/Skeleton';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function StatisticsSection() {
  const { data: stats, isLoading } = usePublicContent('statistics');
  const reveal = useScrollReveal();

  if (!isLoading && (!stats || stats.length === 0)) return null;

  return (
    <section className="border-y border-neutral-200 bg-neutral-100/50 py-16">
      <Container>
        <motion.div
          {...reveal}
          variants={staggerContainer(0.08)}
          className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5"
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
            : stats.map((stat) => (
                <motion.div key={stat._id} variants={fadeUp} className="flex flex-col items-center gap-2 text-center">
                  {stat.icon && <DynamicIcon name={stat.icon} size={28} className="text-primary-500" />}
                  <p className="font-heading text-h2 text-neutral-900">
                    {stat.prefix}
                    {stat.value.toLocaleString('en-IN')}
                    {stat.suffix}
                  </p>
                  <p className="text-body-sm text-neutral-600">{stat.label}</p>
                </motion.div>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
