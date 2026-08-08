import { motion } from 'framer-motion';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { OptimizedImage } from '../ui/OptimizedImage';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function PlatformsSection() {
  const { data: platforms, isLoading } = usePublicContent('platforms');

  if (!isLoading && (!platforms || platforms.length === 0)) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Platforms We Onboard You On" title="One agency, every major delivery app" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.06)}
          className="grid grid-cols-3 items-center gap-8 sm:grid-cols-4 lg:grid-cols-6"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
            : platforms.map((platform) => (
                <motion.div key={platform._id} variants={fadeUp} className="flex items-center justify-center">
                  <OptimizedImage
                    src={platform.logo?.url}
                    alt={platform.name}
                    width={96}
                    height={48}
                    className="h-12 w-auto object-contain grayscale transition hover:grayscale-0"
                  />
                </motion.div>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
