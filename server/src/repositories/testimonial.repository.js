import { BaseRepository } from './base.repository.js';
import { Testimonial } from '../models/index.js';

export const testimonialRepository = new BaseRepository(Testimonial, {
  searchableFields: ['name', 'message', 'city'],
  filterableFields: ['isApproved', 'isFeatured', 'platform', 'city'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'rating'],
  defaultSort: '-createdAt',
  populate: { path: 'platform', select: 'name slug logo' },
});
