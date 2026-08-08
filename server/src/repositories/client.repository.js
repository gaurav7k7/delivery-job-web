import { BaseRepository } from './base.repository.js';
import { Client } from '../models/index.js';

export const clientRepository = new BaseRepository(Client, {
  searchableFields: ['name'],
  filterableFields: [],
  sortableFields: ['createdAt', 'updatedAt', 'order', 'name'],
  defaultSort: 'order',
});
