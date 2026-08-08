import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

function getInitials(name = '') {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}

export function TestimonialsSection() {
  const { data: testimonials, isLoading } = usePublicContent('testimonials');

  if (!isLoading && (!testimonials || testimonials.length === 0)) return null;

  return (
    <section className="bg-neutral-100/50 py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Rider Stories" title="What riders say about Zerivon" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.08)}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52 w-full rounded-lg" />)
            : testimonials.map((testimonial) => (
                <motion.div key={testimonial._id} variants={fadeUp}>
                  <Card className="flex h-full flex-col gap-4 p-6">
                    <Quote size={22} className="text-primary-500/40" aria-hidden="true" />
                    <p className="flex-1 text-body-sm text-neutral-900">{testimonial.message}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} size={14} className="fill-warning-500 text-warning-500" aria-hidden="true" />
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      {testimonial.avatar?.url ? (
                        <img src={testimonial.avatar.url} alt="" className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 text-caption font-semibold text-primary-700">
                          {getInitials(testimonial.name)}
                        </span>
                      )}
                      <div>
                        <p className="text-body-sm font-medium text-neutral-900">{testimonial.name}</p>
                        <p className="text-caption text-neutral-600">
                          {[testimonial.designation, testimonial.city].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
        </motion.div>
      </Container>
    </section>
  );
}
