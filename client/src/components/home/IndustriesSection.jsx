import { motion } from 'framer-motion';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { DynamicIcon } from '../ui/DynamicIcon';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function IndustriesSection() {
  const { data: industries, isLoading } = usePublicContent('industries');

  if (!isLoading && (!industries || industries.length === 0)) return null;

  return (
    <section className="bg-neutral-100/50 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Industries We Serve" title="Built for every delivery vertical" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.06)}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
            : industries.map((industry) => (
                <motion.div key={industry._id} variants={fadeUp}>
                  <Card className="flex flex-col items-center gap-2 p-5 text-center">
                    <DynamicIcon name={industry.icon} size={26} className="text-primary-500" />
                    <p className="text-body-sm font-medium text-neutral-900">{industry.name}</p>
                  </Card>
                </motion.div>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
