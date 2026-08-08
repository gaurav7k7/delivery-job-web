import { BaseRepository } from './base.repository.js';
import { ContactRequest } from '../models/index.js';

export const contactRequestRepository = new BaseRepository(ContactRequest, {
  searchableFields: ['name', 'email', 'subject', 'message'],
  filterableFields: ['status'],
  sortableFields: ['createdAt', 'updatedAt'],
  defaultSort: '-createdAt',
  populate: { path: 'respondedBy', select: 'name' },
});
