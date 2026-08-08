import { BaseRepository } from './base.repository.js';
import { Platform } from '../models/index.js';

export const platformRepository = new BaseRepository(Platform, {
  searchableFields: ['name', 'description'],
  filterableFields: [],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'name'],
  defaultSort: 'order',
});
