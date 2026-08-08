import { Construction } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { Seo } from '../../components/ui/Seo';
import { EmptyState } from '../../components/ui/EmptyState';
import { adminNav } from '../../components/admin/adminNav.config';

function resolveLabel(pathname) {
  for (const item of adminNav) {
    if (item.to === pathname) return item.label;
    const match = item.children?.find((child) => child.to === pathname);
    if (match) return match.label;
  }
  return 'This module';
}

// Placeholder for admin modules planned in the Phase 3 architecture but not
// yet built — keeps the full information architecture navigable from Module
// 1 onward instead of 404ing or hiding nav items until each module lands.
export default function ModulePlaceholder() {
  const { pathname } = useLocation();
  const label = resolveLabel(pathname);

  return (
    <>
      <Seo title={label} noIndex />
      <EmptyState
        icon={Construction}
        title={`${label} — coming in a later module`}
        description="This screen is part of the planned admin architecture (Phase 3) and will be built in an upcoming module."
        className="py-24"
        headingLevel={2}
      />
    </>
  );
}
