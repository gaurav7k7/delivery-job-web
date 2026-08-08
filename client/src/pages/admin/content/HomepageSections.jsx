import { useState } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save } from 'lucide-react';
import { Seo } from '../../../components/ui/Seo';
import { AdminPageHeader } from '../../../components/admin/AdminPageHeader';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useHomepage, useUpdateHomepage } from '../../../api/homepage.api';

const SECTION_LABELS = {
  hero: 'Hero',
  statistics: 'Animated Statistics',
  services: 'Services',
  industries: 'Industries',
  'why-choose-us': 'Why Choose Us',
  process: 'Process / How It Works',
  'technology-stack': 'Technology Stack',
  'case-studies': 'Case Studies / Portfolio',
  testimonials: 'Testimonials',
  clients: 'Clients',
  achievements: 'Achievements',
  awards: 'Awards',
  faq: 'FAQ',
  'latest-blogs': 'Latest Blog Posts',
  career: 'Careers CTA',
  cta: 'Call To Action',
  contact: 'Contact',
};

export default function HomepageSections() {
  const { data: homepage, isLoading } = useHomepage();

  return (
    <>
      <Seo title="Homepage Sections" noIndex />
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Homepage Sections"
          description="Control which sections appear on the homepage, and in what order."
        />

        <Card className="p-2" hoverLift={false}>
          {isLoading ? (
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <SectionsEditor initialSections={homepage?.sections ?? []} />
          )}
        </Card>
      </div>
    </>
  );
}

// Mounted only once `homepage` has loaded, so the reorder buffer can be
// initialized directly from props via lazy useState — no effect needed to
// sync it in after the fact.
function SectionsEditor({ initialSections }) {
  const updateHomepage = useUpdateHomepage();
  const [sections, setSections] = useState(() => [...initialSections].sort((a, b) => a.order - b.order));

  function move(index, direction) {
    setSections((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((section, i) => ({ ...section, order: i }));
    });
  }

  function toggleVisible(index) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, isVisible: !s.isVisible } : s)));
  }

  return (
    <>
      <div className="flex justify-end px-2 pb-2">
        <Button onClick={() => updateHomepage.mutate({ sections })} disabled={updateHomepage.isPending}>
          <Save size={18} aria-hidden="true" />
          {updateHomepage.isPending ? 'Saving…' : 'Save order'}
        </Button>
      </div>
      <ul className="flex flex-col divide-y divide-neutral-200">
        {sections.map((section, index) => (
          <li key={section.key} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-caption font-semibold text-neutral-600">
                {index + 1}
              </span>
              <p className="text-body-sm font-medium text-neutral-900">{SECTION_LABELS[section.key] ?? section.key}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toggleVisible(index)}
                aria-label={section.isVisible ? 'Hide section' : 'Show section'}
                className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100"
              >
                {section.isVisible ? <Eye size={16} aria-hidden="true" /> : <EyeOff size={16} aria-hidden="true" />}
              </button>
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label="Move up"
                className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
              >
                <ArrowUp size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === sections.length - 1}
                aria-label="Move down"
                className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-600 hover:bg-neutral-100 disabled:opacity-30"
              >
                <ArrowDown size={16} aria-hidden="true" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
