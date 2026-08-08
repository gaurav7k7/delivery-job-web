import { BaseRepository } from './base.repository.js';
import { Benefit } from '../models/index.js';

export const benefitRepository = new BaseRepository(Benefit, {
  searchableFields: ['title', 'description'],
  filterableFields: [],
  sortableFields: ['createdAt', 'updatedAt', 'order'],
  defaultSort: 'order',
});
