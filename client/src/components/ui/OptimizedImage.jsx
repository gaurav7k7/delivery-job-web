import { cn } from '../../lib/cn';

const RESPONSIVE_WIDTHS = [480, 768, 1024, 1440];

function buildCloudinaryUrl(url, { width, quality = 'auto', format = 'auto' } = {}) {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const transform = `f_${format},q_${quality}${width ? `,w_${width}` : ''},c_limit`;
  return url.replace('/upload/', `/upload/${transform}/`);
}

/**
 * Every content image on the site renders through this component instead of
 * a bare <img> — Cloudinary auto-format/auto-quality + a responsive srcSet
 * happen automatically for any Cloudinary-hosted URL, and explicit
 * width/height are required so the browser reserves layout space before the
 * image loads (the single biggest lever against layout-shift CLS).
 */
export function OptimizedImage({ src, alt, width, height, className, sizes = '100vw', priority = false, ...props }) {
  const isCloudinary = typeof src === 'string' && src.includes('res.cloudinary.com');
  const optimizedSrc = buildCloudinaryUrl(src, { width });
  const srcSet = isCloudinary
    ? RESPONSIVE_WIDTHS.map((w) => `${buildCloudinaryUrl(src, { width: w })} ${w}w`).join(', ')
    : undefined;

  return (
    <img
      src={optimizedSrc}
      srcSet={srcSet}
      sizes={srcSet ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={cn('bg-neutral-100 object-cover', className)}
      {...props}
    />
  );
}
