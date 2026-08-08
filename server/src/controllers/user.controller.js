import { userRepository } from '../repositories/user.repository.js';
import { createCrudController } from './crudControllerFactory.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../services/activityLog.service.js';
import { invalidateCache } from '../middlewares/cache.middleware.js';

const base = createCrudController(userRepository, 'User', 'users');

export const list = base.list;
export const getOne = base.getOne;
export const toggleStatus = base.toggleStatus;
export const remove = base.remove;
export const restore = base.restore;
export const bulkRemove = base.bulkRemove;

export const create = async (req, res) => {
  const doc = await userRepository.create(req.body, req.user.id);
  await invalidateCache('users');
  await logActivity({ user: req.user.id, action: 'create', module: 'users', entityId: doc.id, req });

  const safeDoc = doc.toObject();
  delete safeDoc.password;
  return new ApiResponse(201, safeDoc, 'User created').send(res);
};

export const update = async (req, res) => {
  // Password changes go through the dedicated auth reset/change-password
  // flow, not this general-purpose edit endpoint — strip it even if sent,
  // since a plain findOneAndUpdate here would bypass the hashing hook.
  const { password: _password, ...safeUpdates } = req.body;
  const doc = await userRepository.updateById(req.params.id, safeUpdates, req.user.id);
  if (!doc) throw ApiError.notFound('User not found');
  await invalidateCache('users');
  await logActivity({ user: req.user.id, action: 'update', module: 'users', entityId: doc.id, req });
  return new ApiResponse(200, doc, 'User updated').send(res);
};
