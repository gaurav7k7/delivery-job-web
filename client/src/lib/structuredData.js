const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.zerivon.in').replace(/\/$/, '');

/**
 * schema.org JSON-LD builders — one function per type actually used on this
 * site (matched against the Phase 1 sitemap / Phase 2 collections), not a
 * generic do-everything builder. Pass the result straight into <Seo
 * structuredData={...} />.
 */

export function buildOrganizationSchema({ logo, sameAs = [], phone, email } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zerivon',
    url: SITE_URL,
    ...(logo && { logo }),
    ...(sameAs.length > 0 && { sameAs }),
    ...(phone || email
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            ...(phone && { telephone: phone }),
            ...(email && { email }),
            areaServed: 'IN',
            availableLanguage: ['en', 'hi'],
          },
        }
      : {}),
  };
}

export function buildLocalBusinessSchema(office) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `Zerivon — ${office.branchName}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: office.addressLine,
      addressLocality: office.city,
      addressRegion: office.state,
      postalCode: office.pincode,
      addressCountry: 'IN',
    },
    ...(office.phones?.[0] && { telephone: office.phones[0] }),
    ...(office.lat && office.lng && { geo: { '@type': 'GeoCoordinates', latitude: office.lat, longitude: office.lng } }),
  };
}

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function buildArticleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { '@type': 'Person', name: post.author?.name ?? 'Zerivon' },
    publisher: {
      '@type': 'Organization',
      name: 'Zerivon',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${post.slug}` },
  };
}

export function buildJobPostingSchema(job) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description,
    datePosted: job.createdAt,
    ...(job.applicationDeadline && { validThrough: job.applicationDeadline }),
    employmentType: job.employmentType?.toUpperCase(),
    hiringOrganization: { '@type': 'Organization', name: 'Zerivon', sameAs: SITE_URL },
    jobLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: job.location, addressCountry: 'IN' },
    },
    ...(job.salaryRange?.isDisclosed && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salaryRange.currency ?? 'INR',
        value: { '@type': 'QuantitativeValue', minValue: job.salaryRange.min, maxValue: job.salaryRange.max, unitText: 'MONTH' },
      },
    }),
  };
}

export function buildFaqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
