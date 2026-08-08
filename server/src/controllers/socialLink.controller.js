import { socialLinkRepository } from '../repositories/socialLink.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { SocialLink } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(socialLinkRepository, 'SocialLink', 'social-links');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const remove = base.remove;
export const restore = base.restore;
export const reorder = base.reorder;

export const listPublic = async (req, res) => {
  const links = await SocialLink.find({ isActive: true, isDeleted: false }).sort('order').lean();
  return new ApiResponse(200, links).send(res);
};
