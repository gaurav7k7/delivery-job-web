import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Newspaper } from 'lucide-react';
import { api } from '../lib/axios';
import { usePublicContent } from '../api/publicContent.api';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Card } from '../components/ui/Card';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { staggerContainer, fadeUp } from '../lib/motionVariants';
import { cn } from '../lib/cn';

function useBlogList(category, page) {
  const params = new URLSearchParams({ page: String(page), limit: '9', sort: '-publishedAt' });
  if (category) params.set('category', category);
  return useQuery({
    queryKey: ['public', 'blog', 'list', category, page],
    queryFn: () => api.get(`/blog/public?${params.toString()}`).then((envelope) => ({ items: envelope.data, meta: envelope.meta })),
    staleTime: 2 * 60 * 1000,
  });
}

export default function Blog() {
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const reveal = useScrollReveal();

  const { data, isLoading } = useBlogList(category, page);
  const { data: categories = [] } = usePublicContent('blog', '/public/categories');

  const posts = data?.items ?? [];
  const meta = data?.meta;

  return (
    <>
      <Seo title="Blog" description="Tips, guides, and updates for delivery riders and partners." />
      <Container className="flex flex-col gap-10 py-16">
        <motion.div {...reveal} className="flex flex-col gap-3 text-center">
          <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">Blog</span>
          <h1 className="font-heading text-h1 text-neutral-900">Tips for riders and partners</h1>
        </motion.div>

        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCategory('');
                setPage(1);
              }}
              className={cn(
                'rounded-full border px-4 py-1.5 text-caption font-medium capitalize',
                !category ? 'border-primary-500 bg-primary-500/10 text-primary-700' : 'border-neutral-200 text-neutral-600'
              )}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setPage(1);
                }}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-caption font-medium capitalize',
                  category === c ? 'border-primary-500 bg-primary-500/10 text-primary-700' : 'border-neutral-200 text-neutral-600'
                )}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 w-full rounded-lg" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState icon={Newspaper} title="No posts yet" description="Check back soon for new articles." headingLevel={2} />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer(0.08)}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <motion.div key={post._id} variants={fadeUp}>
                <Card hoverLift={false} className="group h-full overflow-hidden">
                  <a href={`/blog/${post.slug}`} className="flex h-full flex-col">
                    <div className="aspect-video overflow-hidden">
                      <OptimizedImage src={post.coverImage?.url} alt={post.coverImage?.alt || post.title} width={480} height={270} className="h-full w-full transition group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col gap-2 p-5">
                      <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">{post.category}</span>
                      <h2 className="font-heading text-h4 text-neutral-900">{post.title}</h2>
                      <p className="line-clamp-2 flex-1 text-body-sm text-neutral-600">{post.excerpt}</p>
                    </div>
                  </a>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i + 1)}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-md text-body-sm font-medium',
                  page === i + 1 ? 'bg-primary-500 text-[var(--color-on-primary)]' : 'text-neutral-600 hover:bg-neutral-100'
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
