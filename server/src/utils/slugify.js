import slugify from 'slugify';

export const toSlug = (value) => slugify(String(value), { lower: true, strict: true, trim: true });

/**
 * Attaches a pre-validate hook that derives `slug` from `sourceField` when the
 * caller didn't supply one, and normalizes any slug that was supplied manually.
 * Uniqueness is enforced at the DB level via a unique index on `slug`.
 */
export const attachSlug = (schema, sourceField = 'title') => {
  schema.pre('validate', function attachSlugHook() {
    if (this.slug) {
      this.slug = toSlug(this.slug);
    } else if (this[sourceField]) {
      this.slug = toSlug(this[sourceField]);
    }
  });
};
