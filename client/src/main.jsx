import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initSentry } from './lib/sentry.js';

initSentry();

// Self-hosted (no third-party Google Fonts request) — only the weights the
// design system actually uses (index.css §2.3: Sora 600/700 for headings,
// Inter 400/500/600 for body/UI text). Each file's @font-face rules are
// unicode-range subsetted, so the browser only fetches the Latin subset.
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import './index.css';

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') {
    const { worker } = await import('./mocks/browser.js');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
