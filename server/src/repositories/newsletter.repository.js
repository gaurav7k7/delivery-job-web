import { BaseRepository } from './base.repository.js';
import { Newsletter } from '../models/index.js';

export const newsletterRepository = new BaseRepository(Newsletter, {
  searchableFields: ['email'],
  filterableFields: ['isSubscribed'],
  sortableFields: ['createdAt', 'updatedAt', 'subscribedAt'],
  defaultSort: '-createdAt',
});
