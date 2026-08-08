import { Compass } from 'lucide-react';
import { Seo } from '../components/ui/Seo';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';

// Real bug found during testing: with no catch-all route, an unknown URL
// rendered a completely blank page (zero content, no error, no way back).
// React Router doesn't provide a fallback UI on its own — one has to be
// wired up explicitly (see the path="*" route in AppRoutes.jsx).
export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" noIndex />
      <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <Compass size={28} aria-hidden="true" />
        </div>
        <span className="font-heading text-h1 font-bold text-gradient-brand">404</span>
        <h1 className="font-heading text-h3 text-neutral-900">Page not found</h1>
        <p className="max-w-md text-body-lg text-neutral-600">
          The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved. Let&rsquo;s get you back on track.
        </p>
        <div className="mt-2 flex gap-3">
          <Button to="/">Back to Home</Button>
        </div>
      </Container>
    </>
  );
}
