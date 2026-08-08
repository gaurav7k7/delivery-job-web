import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
  build: {
    sourcemap: false,
    // Vendor code changes far less often than app code — splitting it into
    // its own chunk(s) means a repeat visitor's browser cache serves it
    // straight from disk after an app-only deploy, instead of re-downloading
    // React/Router/Query/Motion every time a page component changes.
    //
    // Only vendors used on *every* route go here. Forcing a route-specific
    // dependency (recharts, only imported by the lazy-loaded admin Dashboard)
    // into its own named chunk backfired: Vite's modulepreload injection
    // treated the named chunk as globally needed and eagerly preloaded 91KB
    // of chart library on pages that never render a chart — caught by a real
    // Lighthouse "unused JavaScript" audit. Left to its own automatic
    // chunking, Rolldown correctly scopes recharts to Dashboard's lazy
    // boundary instead.
    //
    // Vite 8's default bundler (Rolldown) only accepts a function form for
    // manualChunks, not Rollup's classic { name: [...packages] } shorthand.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) return 'react-vendor';
          if (id.includes('@tanstack/react-query')) return 'query-vendor';
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'motion-vendor';
          return undefined;
        },
      },
    },
  },
});
