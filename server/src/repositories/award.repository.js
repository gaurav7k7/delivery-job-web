import { BaseRepository } from './base.repository.js';
import { Award } from '../models/index.js';

export const awardRepository = new BaseRepository(Award, {
  searchableFields: ['title', 'issuer'],
  filterableFields: ['year'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'year'],
  defaultSort: '-year',
});
