import { teamMemberRepository } from '../repositories/teamMember.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { TeamMember } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const base = createCrudController(teamMemberRepository, 'TeamMember', 'team');

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
  const members = await TeamMember.find({ isActive: true, isDeleted: false })
    .select('name designation department bio photo socialLinks order isLeadership')
    .sort('order')
    .lean();
  return new ApiResponse(200, members).send(res);
};
