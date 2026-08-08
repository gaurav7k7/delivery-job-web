import { BaseRepository } from './base.repository.js';
import { ActivityLog } from '../models/index.js';

export const activityLogRepository = new BaseRepository(ActivityLog, {
  searchableFields: [],
  filterableFields: ['user', 'action', 'module', 'entityId'],
  sortableFields: ['createdAt'],
  defaultSort: '-createdAt',
  populate: { path: 'user', select: 'name email avatar' },
});
