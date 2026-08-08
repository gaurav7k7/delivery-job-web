import { processStepRepository } from '../repositories/processStep.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { ProcessStep } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(processStepRepository, 'ProcessStep', 'process-steps');

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
  const steps = await ProcessStep.find({
    page: req.params.page || 'how-it-works',
    isActive: true,
    isDeleted: false,
  })
    .sort('stepNumber')
    .lean();
  return new ApiResponse(200, steps).send(res);
};
