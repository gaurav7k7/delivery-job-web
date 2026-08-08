import { cn } from '../../lib/cn';

// headingLevel defaults to 3 (the common case: an empty-state block nested
// under a section h2) but must be set explicitly wherever that would break
// document heading order — e.g. directly under a page's h1 with no h2
// between them. A hardcoded <h3> here caused a real Lighthouse
// heading-order failure once used in exactly that context.
export function EmptyState({ icon: Icon, title, description, action, className, headingLevel = 3 }) {
  const HeadingTag = `h${headingLevel}`;

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      {Icon && (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <Icon size={24} aria-hidden="true" />
        </div>
      )}
      <HeadingTag className="font-heading text-h4 text-neutral-900">{title}</HeadingTag>
      {description && <p className="max-w-sm text-body-sm text-neutral-600">{description}</p>}
      {action}
    </div>
  );
}
