import { BaseRepository } from './base.repository.js';
import { SocialLink } from '../models/index.js';

export const socialLinkRepository = new BaseRepository(SocialLink, {
  searchableFields: ['platform', 'url'],
  filterableFields: ['platform'],
  sortableFields: ['createdAt', 'updatedAt', 'order'],
  defaultSort: 'order',
});
