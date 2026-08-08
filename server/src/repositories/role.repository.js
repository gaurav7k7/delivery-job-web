import { BaseRepository } from './base.repository.js';
import { Role } from '../models/index.js';

export const roleRepository = new BaseRepository(Role, {
  searchableFields: ['name', 'description'],
  filterableFields: ['isSystem'],
  sortableFields: ['createdAt', 'updatedAt', 'name'],
  defaultSort: 'name',
  populate: { path: 'permissions', select: 'key module action description' },
});
