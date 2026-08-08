import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

function toSelect(fields) {
  if (!fields || typeof fields !== 'string') return undefined;
  return fields
    .split(',')
    .map((f) => f.trim())
    .filter(Boolean)
    .join(' ');
}

/**
 * Generates the standard controller handler set (list/get/create/update/
 * toggleStatus/remove/restore/bulkRemove/reorder) for a module's repository.
 *
 * Express 5 forwards thrown errors and rejected promises from async handlers
 * to the error middleware automatically, so no asyncHandler wrapper is needed
 * here — each handler below can throw directly.
 *
 * Modules with real business logic beyond plain CRUD (auth, uploads, publish
 * workflows) write their own controller instead of using this factory.
 *
 * @param {string} cacheTag - matches the tag used in that module's route file
 * for cacheResponse() (see routes/health.routes.js style modules once built);
 * every mutation below invalidates it automatically so a module author never
 * has to remember cache invalidation by hand. Defaults to the lowercased
 * resourceName.
 */
export function createCrudController(repository, resourceName = 'Resource', cacheTag) {
  const tag = cacheTag ?? resourceName.toLowerCase();

  return {
    // ?fields=title,slug,image lets a caller that only needs list-card data
    // (e.g. a homepage teaser) skip shipping full rich-text/description
    // payloads over the wire — translates straight into the lean query's
    // MongoDB projection, not an in-memory filter.
    list: async (req, res) => {
      const select = toSelect(req.query.fields);
      const { items, meta } = await repository.list(req.query, { select });
      return new ApiResponse(200, items, `${resourceName} list fetched`, meta).send(res);
    },

    getOne: async (req, res) => {
      const select = toSelect(req.query.fields);
      const doc = await repository.findById(req.params.id, { select });
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      return new ApiResponse(200, doc).send(res);
    },

    create: async (req, res) => {
      const doc = await repository.create(req.body, req.user?.id);
      await invalidateCache(tag);
      return new ApiResponse(201, doc, `${resourceName} created`).send(res);
    },

    update: async (req, res) => {
      const doc = await repository.updateById(req.params.id, req.body, req.user?.id);
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      await invalidateCache(tag);
      return new ApiResponse(200, doc, `${resourceName} updated`).send(res);
    },

    toggleStatus: async (req, res) => {
      const doc = await repository.toggleStatus(req.params.id, req.user?.id);
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      await invalidateCache(tag);
      return new ApiResponse(200, doc, `${resourceName} status updated`).send(res);
    },

    remove: async (req, res) => {
      const doc = await repository.softDeleteById(req.params.id, req.user?.id);
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      await invalidateCache(tag);
      return new ApiResponse(200, null, `${resourceName} deleted`).send(res);
    },

    restore: async (req, res) => {
      const doc = await repository.restoreById(req.params.id, req.user?.id);
      if (!doc) throw ApiError.notFound(`${resourceName} not found`);
      await invalidateCache(tag);
      return new ApiResponse(200, doc, `${resourceName} restored`).send(res);
    },

    bulkRemove: async (req, res) => {
      const { ids } = req.body;
      if (!Array.isArray(ids) || ids.length === 0) {
        throw ApiError.badRequest('ids must be a non-empty array');
      }
      const result = await repository.bulkSoftDelete(ids, req.user?.id);
      await invalidateCache(tag);
      return new ApiResponse(200, { deletedCount: result.modifiedCount }, `${resourceName}s deleted`).send(res);
    },

    reorder: async (req, res) => {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        throw ApiError.badRequest('items must be a non-empty array');
      }
      const result = await repository.reorder(items, req.user?.id);
      await invalidateCache(tag);
      return new ApiResponse(200, { modifiedCount: result.modifiedCount }, `${resourceName} order updated`).send(res);
    },
  };
}
