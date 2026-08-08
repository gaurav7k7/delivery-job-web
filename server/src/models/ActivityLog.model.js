import { Schema, model } from 'mongoose';
import { auditablePlugin } from './plugins/auditable.plugin.js';
import { ACTIVITY_ACTIONS } from '../constants/enums.js';

const activityLogSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    action: { type: String, required: true, enum: ACTIVITY_ACTIONS, index: true },
    module: { type: String, required: true, trim: true, lowercase: true, index: true },
    entityId: { type: Schema.Types.ObjectId },
    changes: { type: Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true }
);

activityLogSchema.plugin(auditablePlugin);

activityLogSchema.index({ module: 1, entityId: 1 });
activityLogSchema.index({ createdAt: -1 });

export default model('ActivityLog', activityLogSchema);
