import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { OptimizedImage } from '../ui/OptimizedImage';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeading } from './SectionHeading';
import { staggerContainer, fadeUp } from '../../lib/motionVariants';

export function BlogSection() {
  const { data: posts, isLoading } = usePublicContent('blog', '/public?limit=3&sort=-publishedAt');

  if (!isLoading && (!posts || posts.length === 0)) return null;

  return (
    <section className="py-20">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="From the Blog" title="Latest tips for riders and partners" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer(0.1)}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-lg" />)
            : posts.map((post) => (
                <motion.div key={post._id} variants={fadeUp}>
                  <Card hoverLift={false} className="group overflow-hidden">
                    <a href={`/blog/${post.slug}`} className="block">
                      <div className="aspect-video overflow-hidden">
                        <OptimizedImage
                          src={post.coverImage?.url}
                          alt={post.coverImage?.alt || post.title}
                          width={480}
                          height={270}
                          className="h-full w-full transition group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-col gap-2 p-5">
                        <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">{post.category}</span>
                        <h3 className="font-heading text-h4 text-neutral-900">{post.title}</h3>
                        <p className="line-clamp-2 text-body-sm text-neutral-600">{post.excerpt}</p>
                      </div>
                    </a>
                  </Card>
                </motion.div>
              ))}
        </motion.div>

        <Button to="/blog" variant="secondary" className="mx-auto">
          Read more articles
          <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </Container>
    </section>
  );
}
