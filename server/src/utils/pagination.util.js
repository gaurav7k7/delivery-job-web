const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 20;

/**
 * Turns raw Express query-string params into a Mongo-ready filter/sort/pagination
 * shape. Every list-capable module (DataTable-style: search + filter + sort +
 * pagination) goes through this one function instead of reimplementing it.
 */
export function parseListQuery(
  query,
  { searchableFields = [], filterableFields = [], sortableFields = ['createdAt', 'updatedAt', 'order'], defaultSort = '-createdAt' } = {}
) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number.parseInt(query.limit, 10) || DEFAULT_LIMIT));

  const filter = {};

  if (query.search && searchableFields.length > 0) {
    const regex = new RegExp(escapeRegex(String(query.search).trim()), 'i');
    filter.$or = searchableFields.map((field) => ({ [field]: regex }));
  }

  for (const field of filterableFields) {
    if (query[field] !== undefined && query[field] !== '') {
      filter[field] = query[field];
    }
  }

  if (query.isActive !== undefined) {
    filter.isActive = query.isActive === 'true';
  }

  if (query.includeDeleted !== 'true') {
    filter.isDeleted = false;
  }

  let sort = defaultSort;
  if (query.sort) {
    const requested = String(query.sort);
    const field = requested.replace(/^-/, '');
    if (sortableFields.includes(field)) sort = requested;
  }

  return { page, limit, filter, sort, skip: (page - 1) * limit };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
