import { BaseRepository } from './base.repository.js';
import { Portfolio } from '../models/index.js';

export const portfolioRepository = new BaseRepository(Portfolio, {
  searchableFields: ['title', 'summary'],
  filterableFields: ['client', 'industry', 'service', 'isFeatured'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'title', 'completedAt'],
  defaultSort: 'order',
  populate: [
    { path: 'client', select: 'name logo' },
    { path: 'industry', select: 'name slug' },
    { path: 'service', select: 'title slug' },
  ],
});
