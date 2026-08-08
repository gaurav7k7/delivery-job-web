import { create } from 'zustand';

const STORAGE_KEY = 'zerivon-theme';

function getInitialTheme() {
  if (typeof document === 'undefined') return 'light';
  // index.html's inline script already set this before first paint.
  return document.documentElement.getAttribute('data-theme') || 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export const useThemeStore = create((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    set({ theme: next });
  },
}));
