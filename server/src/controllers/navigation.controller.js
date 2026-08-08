import { navigationRepository } from '../repositories/navigation.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Navigation } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(navigationRepository, 'Navigation', 'navigation');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;

export const getByLocation = async (req, res) => {
  const nav = await Navigation.findOne({
    location: req.params.location,
    isActive: true,
    isDeleted: false,
  }).lean();
  return new ApiResponse(200, nav).send(res);
};
