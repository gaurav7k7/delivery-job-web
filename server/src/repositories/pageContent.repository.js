import { BaseRepository } from './base.repository.js';
import { PageContent } from '../models/index.js';

export const pageContentRepository = new BaseRepository(PageContent, {
  searchableFields: ['title', 'subtitle', 'body'],
  filterableFields: ['pageSlug', 'sectionKey'],
  sortableFields: ['createdAt', 'updatedAt', 'order'],
  defaultSort: 'order',
});
