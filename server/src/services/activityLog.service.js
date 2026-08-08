import { ActivityLog } from '../models/index.js';

/**
 * Fire-and-await audit trail write. Failures are logged, not thrown — an
 * audit-log write should never be the reason a real user action fails.
 */
export async function logActivity({ user, action, module, entityId, changes, req }) {
  try {
    await ActivityLog.create({
      user,
      action,
      module,
      entityId,
      changes,
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
      createdBy: user,
    });
  } catch (err) {
    console.error('[activityLog] failed to record activity:', err.message);
  }
}
