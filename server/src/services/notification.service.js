import { Notification } from '../models/index.js';

/**
 * Fire-and-forget: a failed notification write should never break the
 * action that triggered it (same pattern as activityLog.service.js).
 */
export async function notify({ title, message, link, type = 'info' }) {
  try {
    await Notification.create({ title, message, link, type });
  } catch (err) {
    console.error('[notification] failed to create:', err.message);
  }
}
