import { serviceRepository } from '../repositories/service.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Service } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const base = createCrudController(serviceRepository, 'Service', 'services');

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
  const services = await Service.find({ isActive: true, isDeleted: false })
    .select('title slug icon shortDescription image order isFeatured')
    .sort('order')
    .lean();
  return new ApiResponse(200, services).send(res);
};

export const getPublicBySlug = async (req, res) => {
  const service = await Service.findOne({ slug: req.params.slug, isActive: true, isDeleted: false })
    .populate({ path: 'industries', select: 'name slug' })
    .lean();
  if (!service) throw ApiError.notFound('Service not found');
  return new ApiResponse(200, service).send(res);
};
