import { pageContentRepository } from '../repositories/pageContent.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { PageContent } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(pageContentRepository, 'PageContent', 'page-content');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
export const reorder = base.reorder;

export const listPublicByPageSlug = async (req, res) => {
  const sections = await PageContent.find({
    pageSlug: req.params.pageSlug,
    isActive: true,
    isDeleted: false,
  })
    .sort('order')
    .lean();
  return new ApiResponse(200, sections).send(res);
};
