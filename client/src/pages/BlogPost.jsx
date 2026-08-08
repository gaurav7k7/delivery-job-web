import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileQuestion } from 'lucide-react';
import { api } from '../lib/axios';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { useScrollReveal } from '../hooks/useScrollReveal';

function useBlogPost(slug) {
  return useQuery({
    queryKey: ['public', 'blog', 'detail', slug],
    queryFn: () => api.get(`/blog/public/${slug}`).then((envelope) => envelope.data),
    retry: false,
  });
}

export default function BlogPost() {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useBlogPost(slug);
  const reveal = useScrollReveal();

  if (isLoading) {
    return (
      <Container className="flex flex-col gap-6 py-16">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-80 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </Container>
    );
  }

  if (isError || !post) {
    return (
      <Container className="py-16">
        <EmptyState
          icon={FileQuestion}
          title="Post not found"
          description="This article may have been unpublished or moved."
          headingLevel={1}
          action={<Button to="/blog">Back to Blog</Button>}
        />
      </Container>
    );
  }

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.coverImage?.url}
        type="article"
        publishedTime={post.publishedAt}
        author={post.author?.name}
      />
      <Container className="mx-auto max-w-3xl py-16">
        <motion.div {...reveal} className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-caption font-semibold uppercase tracking-wide text-accent-700">{post.category}</span>
            <h1 className="font-heading text-h1 text-neutral-900">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-caption text-neutral-600">
              {post.author?.name && <span>By {post.author.name}</span>}
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} aria-hidden="true" />
                  {new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
              {post.readTimeMinutes && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} aria-hidden="true" />
                  {post.readTimeMinutes} min read
                </span>
              )}
            </div>
          </div>

          {post.coverImage?.url && (
            <div className="overflow-hidden rounded-xl">
              <OptimizedImage src={post.coverImage.url} alt={post.coverImage.alt || post.title} width={768} height={432} priority className="w-full" />
            </div>
          )}

          <div className="whitespace-pre-wrap text-body-lg text-neutral-900">{post.content}</div>

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-neutral-100 px-3 py-1 text-caption text-neutral-600">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </>
  );
}
