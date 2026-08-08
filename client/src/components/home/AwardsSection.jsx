import { motion } from 'framer-motion';
import { Award as AwardIcon } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function AwardsSection() {
  const { data: awards, isLoading } = usePublicContent('awards');

  if (!isLoading && (!awards || awards.length === 0)) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Recognition" title="Awards & achievements" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.08)}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-lg" />)
            : awards.map((award) => (
                <motion.div key={award._id} variants={fadeUp}>
                  <Card className="flex h-full items-start gap-4 p-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-warning-500/10 text-warning-500">
                      <AwardIcon size={20} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-heading text-h4 text-neutral-900">{award.title}</h3>
                      <p className="text-caption text-neutral-600">{[award.issuer, award.year].filter(Boolean).join(' · ')}</p>
                      {award.description && <p className="mt-2 text-body-sm text-neutral-600">{award.description}</p>}
                    </div>
                  </Card>
                </motion.div>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
