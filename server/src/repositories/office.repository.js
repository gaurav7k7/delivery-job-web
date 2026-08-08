import { BaseRepository } from './base.repository.js';
import { Office } from '../models/index.js';

export const officeRepository = new BaseRepository(Office, {
  searchableFields: ['branchName', 'city', 'addressLine'],
  filterableFields: ['city', 'isHeadOffice'],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'city'],
  defaultSort: 'order',
});
