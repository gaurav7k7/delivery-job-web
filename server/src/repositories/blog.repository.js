import { BaseRepository } from './base.repository.js';
import { Blog } from '../models/index.js';

export const blogRepository = new BaseRepository(Blog, {
  searchableFields: ['title', 'excerpt', 'content'],
  filterableFields: ['category', 'status', 'isFeatured', 'author'],
  sortableFields: ['createdAt', 'updatedAt', 'publishedAt', 'views', 'title'],
  defaultSort: '-createdAt',
  populate: { path: 'author', select: 'name avatar' },
});
