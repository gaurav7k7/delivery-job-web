import { BaseRepository } from './base.repository.js';
import { HeroBanner } from '../models/index.js';

export const heroBannerRepository = new BaseRepository(HeroBanner, {
  searchableFields: ['title', 'subtitle'],
  filterableFields: ['page'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'startDate', 'endDate'],
  defaultSort: 'order',
});
