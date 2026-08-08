import { ChevronDown } from 'lucide-react';
import { usePublicContent } from '../../api/publicContent.api';
import { Container } from '../ui/Container';
import { Skeleton } from '../ui/Skeleton';
import { SectionHeading } from './SectionHeading';

export function FAQSection() {
  const { data: faqs, isLoading } = usePublicContent('faq', '/public?page=general');

  if (!isLoading && (!faqs || faqs.length === 0)) return null;

  return (
    <section className="bg-neutral-100/50 py-20">
      <Container className="mx-auto flex max-w-3xl flex-col gap-12">
        <SectionHeading eyebrow="FAQ" title="Frequently asked questions" />

        <div className="flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-neutral-0">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-5">
                  <Skeleton className="h-5 w-2/3" />
                </div>
              ))
            : faqs.map((faq) => (
                <details key={faq._id} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-body-sm font-medium text-neutral-900">
                    {faq.question}
                    <ChevronDown size={18} className="shrink-0 text-neutral-600 transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="mt-3 text-body-sm text-neutral-600">{faq.answer}</p>
                </details>
              ))}
        </div>
      </Container>
    </section>
  );
}
