import { BaseRepository } from './base.repository.js';
import { Navigation } from '../models/index.js';

export const navigationRepository = new BaseRepository(Navigation, {
  searchableFields: ['name'],
  filterableFields: ['location'],
  sortableFields: ['createdAt', 'updatedAt', 'name'],
  defaultSort: 'name',
});
