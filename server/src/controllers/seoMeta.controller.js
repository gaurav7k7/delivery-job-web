import { seoMetaRepository } from '../repositories/seoMeta.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { SeoMeta } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(seoMetaRepository, 'SeoMeta', 'seo');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const remove = base.remove;
export const restore = base.restore;

// `route` can contain slashes ("/services/rider-onboarding"), so it's read
// from a query param rather than a path segment.
export const getPublicByRoute = async (req, res) => {
  const route = String(req.query.route || '/').toLowerCase();
  const seoMeta = await SeoMeta.findOne({ route, isActive: true, isDeleted: false }).lean();
  return new ApiResponse(200, seoMeta).send(res);
};
