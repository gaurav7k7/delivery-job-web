import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SITE_NAME = 'Zerivon';
const DEFAULT_TITLE = "Zerivon — India's Fastest Riders Onboarding Agency";
const DEFAULT_DESCRIPTION =
  'Zerivon onboards riders onto Uber, Swiggy, Zomato, Blinkit, Zepto and Vahan in as little as 48 hours, with weekly payouts and free training.';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.zerivon.in').replace(/\/$/, '');

/**
 * One shared SEO surface for every page — meta tags, Open Graph, Twitter
 * Cards, canonical URL, and JSON-LD structured data all go through this
 * component rather than each page hand-rolling its own <Helmet> block.
 *
 * `structuredData` accepts one schema.org object or an array of them (see
 * src/lib/structuredData.js for builders) and is rendered as one or more
 * application/ld+json <script> tags.
 */
export function Seo({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  image,
  imageAlt,
  type = 'website',
  noIndex = false,
  structuredData,
  publishedTime,
  modifiedTime,
  author,
}) {
  const { pathname } = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const url = canonical ?? `${SITE_URL}${pathname}`;
  const absoluteImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : undefined;
  const schemas = structuredData ? (Array.isArray(structuredData) ? structuredData : [structuredData]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      {absoluteImage && <meta property="og:image:alt" content={imageAlt ?? fullTitle} />}
      {type === 'article' && publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {type === 'article' && modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {type === 'article' && author && <meta property="article:author" content={author} />}

      {/* Twitter Card */}
      <meta name="twitter:card" content={absoluteImage ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
