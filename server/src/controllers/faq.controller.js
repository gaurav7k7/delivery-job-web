import { faqRepository } from '../repositories/faq.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { FAQ } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(faqRepository, 'FAQ', 'faq');

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
  const filter = { isActive: true, isDeleted: false };
  if (req.query.page) filter.page = String(req.query.page).toLowerCase();
  if (req.query.category) filter.category = String(req.query.category).toLowerCase();

  const faqs = await FAQ.find(filter).sort('order').lean();
  return new ApiResponse(200, faqs).send(res);
};
