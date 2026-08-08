import { activityLogRepository } from '../repositories/activityLog.repository.js';
import { createCrudController } from './crudControllerFactory.js';

// Read-only — activity logs are a system-generated audit trail, never
// created, edited, or deleted through the API.
const base = createCrudController(activityLogRepository, 'ActivityLog', 'activity-logs');

export const list = base.list;
export const getOne = base.getOne;
