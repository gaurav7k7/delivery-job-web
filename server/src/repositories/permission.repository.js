import { BaseRepository } from './base.repository.js';
import { Permission } from '../models/index.js';

export const permissionRepository = new BaseRepository(Permission, {
  searchableFields: ['key', 'description'],
  filterableFields: ['module', 'action'],
  sortableFields: ['createdAt', 'updatedAt', 'module'],
  defaultSort: 'module',
});
