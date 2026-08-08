import { awardRepository } from '../repositories/award.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Award } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(awardRepository, 'Award', 'awards');

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
  const awards = await Award.find({ isActive: true, isDeleted: false }).sort('-year order').lean();
  return new ApiResponse(200, awards).send(res);
};
