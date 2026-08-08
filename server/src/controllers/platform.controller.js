import { platformRepository } from '../repositories/platform.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Platform } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(platformRepository, 'Platform', 'platforms');

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
  const platforms = await Platform.find({ isActive: true, isDeleted: false }).sort('order').lean();
  return new ApiResponse(200, platforms).send(res);
};
