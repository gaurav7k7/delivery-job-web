import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, FileQuestion } from 'lucide-react';
import { api } from '../lib/axios';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { OptimizedImage } from '../components/ui/OptimizedImage';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { DynamicIcon } from '../components/ui/DynamicIcon';
import { useScrollReveal } from '../hooks/useScrollReveal';

function useServiceDetail(slug) {
  return useQuery({
    queryKey: ['public', 'services', 'detail', slug],
    queryFn: () => api.get(`/services/public/${slug}`).then((envelope) => envelope.data),
    retry: false,
  });
}

export default function ServiceDetail() {
  const { slug } = useParams();
  const { data: service, isLoading, isError } = useServiceDetail(slug);
  const reveal = useScrollReveal();

  if (isLoading) {
    return (
      <Container className="flex flex-col gap-6 py-16">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </Container>
    );
  }

  if (isError || !service) {
    return (
      <Container className="py-16">
        <EmptyState icon={FileQuestion} title="Service not found" headingLevel={1} action={<Button to="/services">Back to Services</Button>} />
      </Container>
    );
  }

  return (
    <>
      <Seo title={service.title} description={service.shortDescription} image={service.image?.url} />
      <Container className="mx-auto max-w-3xl py-16">
        <motion.div {...reveal} className="flex flex-col gap-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500">
            <DynamicIcon name={service.icon} size={26} />
          </div>
          <h1 className="font-heading text-h1 text-neutral-900">{service.title}</h1>
          <p className="text-body-lg text-neutral-600">{service.shortDescription}</p>

          {service.image?.url && (
            <div className="overflow-hidden rounded-xl">
              <OptimizedImage src={service.image.url} alt={service.image.alt || service.title} width={768} height={432} priority className="w-full" />
            </div>
          )}

          {service.description && <p className="whitespace-pre-wrap text-body-lg text-neutral-900">{service.description}</p>}

          {service.features?.length > 0 && (
            <Card className="flex flex-col gap-3 p-6">
              <h2 className="font-heading text-h4 text-neutral-900">What&rsquo;s included</h2>
              <ul className="flex flex-col gap-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-body-sm text-neutral-900">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-success-500" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {service.industries?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {service.industries.map((industry) => (
                <span key={industry._id ?? industry} className="rounded-full bg-neutral-100 px-3 py-1 text-caption text-neutral-600">
                  {industry.name ?? industry}
                </span>
              ))}
            </div>
          )}

          <Button to="/apply" className="w-fit">
            Apply Now
          </Button>
        </motion.div>
      </Container>
    </>
  );
}
