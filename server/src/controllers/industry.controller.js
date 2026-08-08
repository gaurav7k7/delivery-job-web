import { industryRepository } from '../repositories/industry.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Industry } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const base = createCrudController(industryRepository, 'Industry', 'industries');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;
export const reorder = base.reorder;

export const listPublic = async (req, res) => {
  const industries = await Industry.find({ isActive: true, isDeleted: false })
    .select('name slug icon description image order')
    .sort('order')
    .lean();
  return new ApiResponse(200, industries).send(res);
};

export const getPublicBySlug = async (req, res) => {
  const industry = await Industry.findOne({ slug: req.params.slug, isActive: true, isDeleted: false }).lean();
  if (!industry) throw ApiError.notFound('Industry not found');
  return new ApiResponse(200, industry).send(res);
};
