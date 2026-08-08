import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';

// A shared admin notification feed (not per-recipient) — appropriate for a
// small internal team where "mark as read" is a team-wide acknowledgement
// rather than a per-user inbox.
const notificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    link: { type: String, trim: true },
    type: { type: String, trim: true, default: 'info' },
    isRead: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

notificationSchema.plugin(auditablePlugin);

notificationSchema.index({ createdAt: -1 });

export default model('Notification', notificationSchema);
