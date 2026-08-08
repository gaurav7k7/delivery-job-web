import { BaseRepository } from './base.repository.js';
import { Media } from '../models/index.js';

export const mediaRepository = new BaseRepository(Media, {
  searchableFields: ['altText', 'folder'],
  filterableFields: ['type', 'folder', 'tags'],
  sortableFields: ['createdAt', 'updatedAt', 'sizeBytes'],
  defaultSort: '-createdAt',
});
