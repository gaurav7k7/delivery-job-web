import { motion } from 'framer-motion';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { OptimizedImage } from '../ui/OptimizedImage';
import { Skeleton } from '../ui/Skeleton';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function ClientsSection() {
  const { data: clients, isLoading } = usePublicContent('clients');

  if (!isLoading && (!clients || clients.length === 0)) return null;

  return (
    <section className="py-16">
      <Container>
        <p className="mb-8 text-center text-caption font-semibold uppercase tracking-wide text-neutral-600">
          Trusted by leading delivery brands
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.06)}
          className="grid grid-cols-3 items-center gap-8 sm:grid-cols-4 lg:grid-cols-6"
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)
            : clients.map((client) => (
                <motion.a
                  key={client._id}
                  variants={fadeUp}
                  href={client.websiteUrl || undefined}
                  target={client.websiteUrl ? '_blank' : undefined}
                  rel={client.websiteUrl ? 'noreferrer' : undefined}
                  className="flex items-center justify-center"
                >
                  <OptimizedImage src={client.logo?.url} alt={client.name} width={96} height={40} className="h-10 w-auto object-contain grayscale transition hover:grayscale-0" />
                </motion.a>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
