import { BaseRepository } from './base.repository.js';
import { Industry } from '../models/index.js';

export const industryRepository = new BaseRepository(Industry, {
  searchableFields: ['name', 'description'],
  filterableFields: [],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'name'],
  defaultSort: 'order',
});
