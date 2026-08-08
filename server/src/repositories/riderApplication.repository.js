import { BaseRepository } from './base.repository.js';
import { RiderApplication } from '../models/index.js';

export const riderApplicationRepository = new BaseRepository(RiderApplication, {
  searchableFields: ['fullName', 'phone', 'email', 'city'],
  filterableFields: ['status', 'city', 'vehicleType'],
  sortableFields: ['createdAt', 'updatedAt', 'fullName'],
  defaultSort: '-createdAt',
  populate: { path: 'preferredPlatforms', select: 'name slug logo' },
});
