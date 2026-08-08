import { roleRepository } from '../repositories/role.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { Role } from '../models/index.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

const base = createCrudController(roleRepository, 'Role', 'roles');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const bulkRemove = base.bulkRemove;
export const restore = base.restore;

export const update = async (req, res) => {
  const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
  if (!role) throw ApiError.notFound('Role not found');
  if (role.isSystem && req.body.name) throw ApiError.forbidden('System roles cannot be renamed');

  Object.assign(role, req.body, { updatedBy: req.user.id });
  await role.save();
  await invalidateCache('roles');
  return new ApiResponse(200, role, 'Role updated').send(res);
};

export const remove = async (req, res) => {
  const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
  if (!role) throw ApiError.notFound('Role not found');
  if (role.isSystem) throw ApiError.forbidden('System roles cannot be deleted');

  await role.softDelete(req.user.id);
  await invalidateCache('roles');
  return new ApiResponse(200, null, 'Role deleted').send(res);
};

export const toggleStatus = async (req, res) => {
  const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
  if (!role) throw ApiError.notFound('Role not found');
  if (role.isSystem) throw ApiError.forbidden('System roles cannot be deactivated');

  role.isActive = !role.isActive;
  role.updatedBy = req.user.id;
  await role.save();
  await invalidateCache('roles');
  return new ApiResponse(200, role, 'Role status updated').send(res);
};
