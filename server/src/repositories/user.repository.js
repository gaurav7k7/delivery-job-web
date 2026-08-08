import { BaseRepository } from './base.repository.js';
import { User } from '../models/index.js';

export const userRepository = new BaseRepository(User, {
  searchableFields: ['name', 'email'],
  filterableFields: ['role', 'isActive'],
  sortableFields: ['createdAt', 'updatedAt', 'name', 'lastLoginAt'],
  defaultSort: '-createdAt',
  populate: { path: 'role', select: 'name slug isSystem' },
});
