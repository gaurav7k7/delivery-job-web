import { BaseRepository } from './base.repository.js';
import { FAQ } from '../models/index.js';

export const faqRepository = new BaseRepository(FAQ, {
  searchableFields: ['question', 'answer'],
  filterableFields: ['category', 'page'],
  sortableFields: ['createdAt', 'updatedAt', 'order'],
  defaultSort: 'order',
});
