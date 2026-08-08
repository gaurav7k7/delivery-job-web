import { BaseRepository } from './base.repository.js';
import { Certificate } from '../models/index.js';

export const certificateRepository = new BaseRepository(Certificate, {
  searchableFields: ['title', 'issuer'],
  filterableFields: [],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'issuedDate'],
  defaultSort: 'order',
});
