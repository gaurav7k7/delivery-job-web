import { statisticRepository } from '../repositories/statistic.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Statistic } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(statisticRepository, 'Statistic', 'statistics');

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
  const statistics = await Statistic.find({ isActive: true, isDeleted: false }).sort('order').lean();
  return new ApiResponse(200, statistics).send(res);
};
