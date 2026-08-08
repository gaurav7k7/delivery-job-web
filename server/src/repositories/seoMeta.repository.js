import { BaseRepository } from './base.repository.js';
import { SeoMeta } from '../models/index.js';

export const seoMetaRepository = new BaseRepository(SeoMeta, {
  searchableFields: ['route'],
  filterableFields: [],
  sortableFields: ['createdAt', 'updatedAt', 'route'],
  defaultSort: 'route',
});
