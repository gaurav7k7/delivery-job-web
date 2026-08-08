import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { SmoothScrollProvider } from './components/layout/SmoothScrollProvider';
import { AppRoutes } from './routes/AppRoutes';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { useThemeStore } from './store/themeStore';

export default function App() {
  const theme = useThemeStore((s) => s.theme);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SmoothScrollProvider>
              <AppRoutes />
            </SmoothScrollProvider>
          </BrowserRouter>
          {/* offset clears the 64px fixed topbar (both public Header and AdminLayout Topbar are h-16) */}
          <Toaster richColors position="top-right" theme={theme} offset={{ top: 80 }} mobileOffset={{ top: 80 }} />
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
