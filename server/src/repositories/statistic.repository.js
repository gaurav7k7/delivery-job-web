import { BaseRepository } from './base.repository.js';
import { Statistic } from '../models/index.js';

export const statisticRepository = new BaseRepository(Statistic, {
  searchableFields: ['label'],
  filterableFields: [],
  sortableFields: ['createdAt', 'updatedAt', 'order'],
  defaultSort: 'order',
});
