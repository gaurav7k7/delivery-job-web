import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollToTop } from '../components/layout/ScrollToTop';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';

export function PublicLayout() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-[var(--color-on-primary)]"
      >
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <ErrorBoundary>
        <main id="main-content">
          <Outlet />
        </main>
      </ErrorBoundary>
      <Footer />
    </>
  );
}
