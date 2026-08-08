import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../api/navigation.api';
import { useSiteSettings } from '../../api/settings.api';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { cn } from '../../lib/cn';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: nav } = useNavigation('header');
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const items = nav?.items ? [...nav.items].sort((a, b) => a.order - b.order) : [];
  const whatsapp = settings?.contact?.whatsapp;

  return (
    // The mobile menu's `fixed` overlay is rendered as a *sibling* of
    // <header>, not a descendant — a `position: sticky` ancestor acts as the
    // containing block for `position: fixed` children in Chromium, which
    // collapsed the overlay's height to ~0 when it was nested inside.
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-shadow duration-300',
          scrolled ? 'glass-surface shadow-[var(--shadow-elevation-1)]' : 'bg-neutral-0/60 backdrop-blur-md'
        )}
      >
      <Container className="flex h-16 items-center justify-between gap-4">
        <NavLink to="/" className="font-heading text-h4 font-bold text-gradient-brand">
          {settings?.siteName ?? 'Zerivon'}
        </NavLink>

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary">
          {items.map((navItem) => (
            <NavLink
              key={navItem._id}
              to={navItem.url}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-body-sm font-medium text-neutral-600 transition-colors hover:text-primary-500',
                  isActive && 'text-primary-500'
                )
              }
            >
              {navItem.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <ThemeToggle />
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
              className="flex h-11 w-11 items-center justify-center rounded-full text-success-500 hover:bg-neutral-100"
            >
              <MessageCircle size={20} aria-hidden="true" />
            </a>
          )}
          <Button to="/apply" size="sm">
            Apply Now
          </Button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-md text-neutral-900"
          >
            {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </Container>
      </header>

      <AnimatePresence>{mobileOpen && <MobileMenu items={items} onClose={() => setMobileOpen(false)} />}</AnimatePresence>
    </>
  );
}
