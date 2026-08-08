import { careerRepository } from '../repositories/career.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Career } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

const base = createCrudController(careerRepository, 'Career', 'careers');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

export const listPublic = async (req, res) => {
  const careers = await Career.find({ status: 'open', isActive: true, isDeleted: false })
    .select('title slug department location employmentType experienceLevel salaryRange applicationDeadline createdAt')
    .sort('-createdAt')
    .lean();
  return new ApiResponse(200, careers).send(res);
};

export const getPublicBySlug = async (req, res) => {
  const career = await Career.findOne({
    slug: req.params.slug,
    status: 'open',
    isActive: true,
    isDeleted: false,
  }).lean();
  if (!career) throw ApiError.notFound('Job opening not found');
  return new ApiResponse(200, career).send(res);
};
