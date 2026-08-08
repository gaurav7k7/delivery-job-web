import { BaseRepository } from './base.repository.js';
import { Service } from '../models/index.js';

export const serviceRepository = new BaseRepository(Service, {
  searchableFields: ['title', 'shortDescription', 'description'],
  filterableFields: ['isFeatured', 'industries'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'title'],
  defaultSort: 'order',
  populate: { path: 'industries', select: 'name slug' },
});
