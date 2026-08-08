import { permissionRepository } from '../repositories/permission.repository.js';
import { createCrudController } from './crudControllerFactory.js';

const base = createCrudController(permissionRepository, 'Permission', 'permissions');

export const list = base.list;
export const getOne = base.getOne;
export const create = base.create;
export const update = base.update;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
