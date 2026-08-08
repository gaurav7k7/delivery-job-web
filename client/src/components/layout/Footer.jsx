import { NavLink } from 'react-router-dom';
import { useFooterConfig } from '../../api/footer.api';
import { useSiteSettings } from '../../api/settings.api';
import { useSocialLinks } from '../../api/socialLinks.api';
import { Container } from '../ui/Container';
import { Skeleton } from '../ui/Skeleton';
import { SocialIcon } from '../ui/SocialIcon';

export function Footer() {
  const { data: footer, isLoading: footerLoading } = useFooterConfig();
  const { data: settings } = useSiteSettings();
  const { data: socialLinks = [] } = useSocialLinks();

  const columns = footer?.columns ? [...footer.columns].sort((a, b) => a.order - b.order) : [];

  return (
    // Forced dark regardless of the site's active theme (Phase 4 §3.2) — the
    // custom-variant `dark` selector cascades color tokens to this subtree
    // via [data-theme], so no per-utility dark: prefixes are needed inside.
    <footer data-theme="dark" className="bg-neutral-0 text-neutral-900">
      <div className="gradient-brand h-[3px] w-full" />

      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4">
          <span className="font-heading text-h4 font-bold text-gradient-brand">{settings?.siteName ?? 'Zerivon'}</span>
          <p className="text-body-sm text-neutral-600">{settings?.tagline}</p>
          {socialLinks.length > 0 && (
            <div className="flex gap-3 pt-2">
              {socialLinks.map((link) => (
                <a
                  key={link._id}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.platform}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:text-primary-500"
                >
                  <SocialIcon platform={link.platform} size={16} />
                </a>
              ))}
            </div>
          )}
        </div>

        {footerLoading
          ? // min-h matches the loaded-state column below (title + ~5 links) so
            // the skeleton→content swap doesn't shift the page — a real
            // Lighthouse CLS failure traced to exactly this mismatch.
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex min-h-[180px] flex-col gap-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-28" />
              </div>
            ))
          : columns.map((column) => (
              <div key={column.title} className="flex min-h-[180px] flex-col gap-3">
                <h3 className="font-heading text-body-sm font-semibold uppercase tracking-wide text-neutral-600">
                  {column.title}
                </h3>
                <ul className="flex flex-col gap-2">
                  {[...column.links]
                    .sort((a, b) => a.order - b.order)
                    .map((link) => (
                      <li key={link.label}>
                        <NavLink to={link.url} className="text-body-sm text-neutral-600 hover:text-primary-500">
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
      </Container>

      <div className="border-t border-neutral-200">
        <Container className="flex flex-col gap-2 py-6 text-caption text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer?.bottomText}</p>
          <p className="max-w-2xl sm:text-right">{footer?.disclaimerText}</p>
        </Container>
      </div>
    </footer>
  );
}
