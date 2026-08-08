import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { usePublicContent } from '../api/publicContent.api';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { staggerContainer, fadeUp } from '../lib/motionVariants';

const EMPLOYMENT_LABELS = { full_time: 'Full-time', part_time: 'Part-time', contract: 'Contract', internship: 'Internship' };

export default function Careers() {
  const { data: jobs, isLoading } = usePublicContent('careers');
  const reveal = useScrollReveal();

  return (
    <>
      <Seo title="Careers" description="Join the Zerivon team building India's rider economy." />
      <Container className="flex flex-col gap-12 py-16">
        <motion.div {...reveal} className="flex flex-col gap-3 text-center">
          <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">Careers</span>
          <h1 className="font-heading text-h1 text-neutral-900">Join our team</h1>
          <p className="mx-auto max-w-2xl text-body-lg text-neutral-600">
            We&rsquo;re hiring across operations, growth, and support — help riders earn more, faster.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <EmptyState icon={Briefcase} title="No open roles right now" description="Check back soon — we're growing fast." headingLevel={2} />
        ) : (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={staggerContainer(0.08)} className="flex flex-col gap-4">
            {jobs.map((job) => (
              <motion.div key={job._id} variants={fadeUp}>
                <a href={`/careers/${job.slug}`} className="block">
                  <Card className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-heading text-h4 text-neutral-900">{job.title}</h2>
                      <p className="text-body-sm text-neutral-600">
                        {job.department} · {job.location}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-primary-500/10 px-3 py-1 text-caption font-medium text-primary-700">
                      {EMPLOYMENT_LABELS[job.employmentType] ?? job.employmentType}
                    </span>
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
