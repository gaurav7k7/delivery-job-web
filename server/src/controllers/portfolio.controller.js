import { portfolioRepository } from '../repositories/portfolio.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Portfolio } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const base = createCrudController(portfolioRepository, 'Portfolio', 'portfolio');

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
  const items = await Portfolio.find({ isActive: true, isDeleted: false })
    .select('title slug coverImage summary industry service isFeatured order completedAt')
    .populate([
      { path: 'industry', select: 'name slug' },
      { path: 'service', select: 'title slug' },
    ])
    .sort('order')
    .lean();
  return new ApiResponse(200, items).send(res);
};

export const getPublicBySlug = async (req, res) => {
  const item = await Portfolio.findOne({ slug: req.params.slug, isActive: true, isDeleted: false })
    .populate([
      { path: 'client', select: 'name logo websiteUrl' },
      { path: 'industry', select: 'name slug' },
      { path: 'service', select: 'title slug' },
    ])
    .lean();
  if (!item) throw ApiError.notFound('Portfolio item not found');
  return new ApiResponse(200, item).send(res);
};
